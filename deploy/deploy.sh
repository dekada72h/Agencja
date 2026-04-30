#!/usr/bin/env bash
# Safe deploy of the Next.js dekada72h.com to the VPS.
#
# Stages:
#   1. rsync source from laptop → VPS:/srv/sites/dekada72h.com/web/
#   2. install + build the Docker image on the VPS
#   3. start the new container under a sandbox name on an unrouted port
#      (3001) and smoke-test it via curl from inside the VPS
#   4. CUTOVER: stop legacy nginx, start Next.js with the production
#      Traefik labels (atomic from Traefik's point of view, ~5s flip)
#   5. external smoke-test against https://dekada72h.com/
#
# The script aborts before cutover if any internal check fails.
# The legacy /srv/sites/dekada72h.com/{docker-compose.yml,html/} are
# never modified, so rollback is one command (see deploy/ROLLBACK.md).

set -euo pipefail

VPS=dekada-vps
REMOTE_BASE=/srv/sites/dekada72h.com
LOCAL_WEB=$(cd "$(dirname "$0")/.." && pwd)/web
LOCAL_COMPOSE=$(cd "$(dirname "$0")" && pwd)/docker-compose.next.yml

bold() { printf '\033[1m%s\033[0m\n' "$*"; }
err()  { printf '\033[31mERROR:\033[0m %s\n' "$*" >&2; }
ok()   { printf '\033[32m✓\033[0m %s\n' "$*"; }

bold "── 1. rsync source → VPS"
rsync -az --delete \
  --exclude=node_modules --exclude=.next --exclude=.git \
  --exclude='*.log' --exclude=.dockerignore \
  "$LOCAL_WEB/" "$VPS:$REMOTE_BASE/web/"
ok "source synced"

bold "── 2. push compose file"
scp "$LOCAL_COMPOSE" "$VPS:$REMOTE_BASE/docker-compose.next.yml"
ok "compose pushed"

bold "── 3. build image on VPS"
ssh "$VPS" "cd $REMOTE_BASE && sudo docker compose -f docker-compose.next.yml build --pull"
ok "image built"

bold "── 4. internal smoke test (ad-hoc container on unrouted port 3001)"
ssh "$VPS" 'set -e
  sudo docker rm -f dekada72h-test 2>/dev/null || true
  sudo docker run -d --rm --name dekada72h-test --network web \
    -p 127.0.0.1:3001:3000 \
    dekada72h-next:latest
  sleep 6
  for path in / /about /services /portfolio /blog \
              /portfolio/Katarzyna-Schwenk \
              /portfolio/BellaVista/index.html \
              /blog/jak-zwiekszyc-konwersje-na-stronie; do
    code=$(curl -sS -o /dev/null -m 5 -w "%{http_code}" "http://127.0.0.1:3001$path" || echo 000)
    if [ "$code" != "200" ]; then
      echo "FAIL  $path  →  $code"
      sudo docker logs dekada72h-test --tail 30
      sudo docker rm -f dekada72h-test
      exit 1
    fi
    echo "  ✓ $path"
  done
  sudo docker rm -f dekada72h-test
'
ok "internal smoke test passed"

bold "── 5. CUTOVER (this is the moment of truth)"
read -r -p "Proceed with cutover? Old nginx will go down, Next.js takes over. (y/N) " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  err "cutover aborted by user"
  exit 1
fi

ssh "$VPS" "set -e
  cd $REMOTE_BASE
  echo 'Stopping legacy nginx…'
  sudo docker compose down
  echo 'Starting Next.js…'
  sudo docker compose -f docker-compose.next.yml up -d
  sleep 4
  sudo docker ps --filter name=dekada72h --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}'
"
ok "cutover complete"

bold "── 6. external smoke test (live HTTPS)"
sleep 4
fail=0
for path in / /about /services /portfolio /blog \
            /portfolio/Katarzyna-Schwenk \
            /portfolio/Katarzyna-Schwenk/galeria \
            /portfolio/BellaVista/index.html \
            /blog/jak-zwiekszyc-konwersje-na-stronie; do
  code=$(curl -sS -o /dev/null -m 8 -w "%{http_code}" "https://dekada72h.com$path" || echo 000)
  if [ "$code" = "200" ]; then
    printf '  \033[32m✓\033[0m %-48s %s\n' "$path" "$code"
  else
    printf '  \033[31m✗\033[0m %-48s %s\n' "$path" "$code"
    fail=1
  fi
done

if [ "$fail" -eq 1 ]; then
  err "External tests failed. Rollback procedure: deploy/ROLLBACK.md"
  exit 1
fi

bold "── 7. www → apex redirect"
code=$(curl -sS -o /dev/null -m 8 -w "%{http_code}" -I "https://www.dekada72h.com/" || echo 000)
printf '  www.dekada72h.com  →  %s (expect 301)\n' "$code"

ok "DEPLOY SUCCESS — dekada72h.com is now Next.js"
