# Rollback procedure: dekada72h.com

If the new Next.js deploy misbehaves, this restores the previous nginx
container in under 30 seconds. Both containers share the same
`container_name: dekada72h`, so we never have label conflicts — only
**one runs at a time**.

## State on the VPS

```
/srv/sites/dekada72h.com/
├── docker-compose.yml          # ← legacy nginx (UNTOUCHED, do not edit)
├── docker-compose.next.yml     # ← new Next.js
├── html/                       # ← legacy static files (UNTOUCHED)
├── web/                        # ← rsynced Next.js source (build context)
└── logs/                       # ← nginx logs from legacy
```

`html/` and `docker-compose.yml` are intentionally never modified, so the
legacy site can come back up by running a single command.

## Rollback (Next.js → legacy nginx)

```bash
ssh dekada-vps
cd /srv/sites/dekada72h.com
docker compose -f docker-compose.next.yml down
docker compose up -d                    # legacy nginx
docker logs dekada72h --tail 20
curl -I https://dekada72h.com/          # expect HTTP 200, nginx response header
```

Traefik picks up the relabeled container within ~5 seconds.

## Forward (legacy nginx → Next.js)

```bash
ssh dekada-vps
cd /srv/sites/dekada72h.com
docker compose down                                # nginx down
docker compose -f docker-compose.next.yml up -d    # Next.js up
docker logs dekada72h --tail 30
curl -I https://dekada72h.com/          # expect HTTP 200, x-powered-by removed
```

## Rebuild (after a code change)

```bash
ssh dekada-vps
cd /srv/sites/dekada72h.com
# 1. rsync the latest source from your laptop
#    (run this from your laptop, not the VPS)
#    rsync -az --delete --exclude=node_modules --exclude=.next --exclude=.git \
#      /home/kali/Desktop/Agencja/web/ dekada-vps:/srv/sites/dekada72h.com/web/

# 2. build + recreate
docker compose -f docker-compose.next.yml build --pull web
docker compose -f docker-compose.next.yml up -d
```

Build takes ~3–5 minutes on the 4-core VPS. The container is replaced
atomically; downtime is the time it takes for Traefik to flip routes
(~5s).

## Health checks

```bash
# Container alive?
docker ps --filter name=dekada72h

# Logs OK?
docker logs dekada72h --tail 30

# All routes returning 200?
for path in / /about /services /portfolio /blog \
            /portfolio/Katarzyna-Schwenk \
            /portfolio/BellaVista/index.html \
            /blog/jak-zwiekszyc-konwersje-na-stronie; do
  echo -n "$path  "
  curl -sS -o /dev/null -w "%{http_code}\n" -m 5 "https://dekada72h.com$path"
done
```

## Image cleanup (optional)

After a successful deploy, prune old images:

```bash
docker image prune -f
```

The legacy `nginx:alpine` is pinned across many sites — leave it alone.
