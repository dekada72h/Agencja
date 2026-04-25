# Infrastructure Status — Dekada72H VPS

**Snapshot:** 2026-04-25
**Host:** `vps-dae43f65` · `51.83.161.122` (OVH)
**SSH alias:** `dekada-vps` (key-only, ed25519, `kali@dekada72h`)

## Host

| | |
|---|---|
| OS | Ubuntu 24.04.4 LTS |
| Kernel | 6.8.0-110-generic |
| Uptime | 10d 5h (boot 2026-04-15 04:00) |
| CPU | Intel Haswell (no TSX), 4 vCPU |
| Load avg | 0.01 / 0.00 / 0.00 — idle |
| RAM | 7.6 GB total · 635 MB used · 5.4 GB free · 1.8 GB buff/cache · **6.9 GB available** |
| Swap | 0 (none configured) |
| Disk `/` | 72 GB ext4 · **3.9 GB used (6 %)** · 68 GB free |
| Disk `/boot` | 881 MB ext4 · 117 MB used (15 %) |

## Storage breakdown

| Path | Size | Notes |
|---|---|---|
| `/srv/sites` | 27 MB | All 4 site webroots |
| `/srv/traefik` | 16 MB | Config + ACME storage + logs |
| `/srv/_backups` | 32 KB | Pre-audit-fix configs (2026-04-25) |
| `/var/log` | 403 MB | journald + traefik + nginx access/error |
| `/var/backups` | 14 MB | Daily/weekly site backups |

Plenty of headroom. Log growth is the main consumer; rotation already enforced (Docker json-file 10 MB × 3, journald default).

## Docker

| | |
|---|---|
| Server / API | **28.5.2** / 1.51 (held: `docker-ce`, `docker-ce-cli`) |
| Images | 2 (`nginx:alpine`, `traefik:v3.5`) — 243 MB total |
| Containers | 5 running, 0 stopped |
| Volumes | 0 (bind mounts only) |
| Build cache | 0 |
| Hardening | All containers `read_only=true`, `no-new-privileges=true`, tmpfs for `/var/cache/nginx`, `/var/run`, `/tmp` |

## Containers (live)

| Name | Image | CPU % | Mem | Mem % | Net I/O |
|---|---|---|---|---|---|
| traefik | traefik:v3.5 | 0.00 % | 17.3 MiB | 0.22 % | 1.73 MB / 2.15 MB |
| dekada72h | nginx:alpine | 0.00 % | 4.98 MiB | 0.06 % | 19.6 kB / 71.7 kB |
| domexpert-online | nginx:alpine | 0.00 % | 4.83 MiB | 0.06 % | 13.3 kB / 78.9 kB |
| kowalskipartners-space | nginx:alpine | 0.00 % | 4.79 MiB | 0.06 % | 10.8 kB / 6.1 kB |
| skytech-solutions | nginx:alpine | 0.00 % | 4.84 MiB | 0.06 % | 56.5 kB / 980 kB |

Total memory in containers: ~37 MiB (~0.5 % of host RAM). Effectively the box is sitting idle.

## Network & firewall

| | |
|---|---|
| Open ports (UFW + nmap-confirmed) | 22/tcp · 80/tcp · 443/tcp |
| HTTP→HTTPS redirect | 308 (Traefik) |
| Listening processes (incl. localhost) | sshd (22), dockerd (80, 443), systemd-resolved (127.0.0.x:53) |

## TLS certificates (Let's Encrypt R12)

| Domain | Expires | Status |
|---|---|---|
| dekada72h.com | 2026-07-11 17:17 UTC | ✅ |
| domexpert.online | 2026-07-11 17:17 UTC | ✅ |
| kowalskipartners.space | 2026-07-11 17:17 UTC | ✅ |
| skytech-solutions.de | 2026-07-11 17:17 UTC | ✅ |
| skytech-solutions.pl | 2026-07-11 17:17 UTC | ✅ |

Auto-renewal via Traefik ACME http-01 challenge, runs ~30 days before expiry.

## Security services

| Service | Status |
|---|---|
| ufw | active (22/80/443 in) |
| fail2ban | active — sshd jail + recidive jail |
| auditd | active — 10 watch rules |
| unattended-upgrades | active (auto-reboot 04:00) |
| docker | active |
| ssh | active (key-only, `AuthenticationMethods publickey`) |

**fail2ban current state:** 39 IPs banned, 120 lifetime bans, 2034 failed auth attempts blocked.

## Patch status

| | |
|---|---|
| APT upgradable (real) | **0** |
| APT held back | 2 (`docker-ce`, `docker-ce-cli` — held at 28.5.2 because 29.x breaks Traefik docker provider) |

## Hardening posture (from 2026-04-25 audit)

All audit findings resolved — see [`SECURITY-AUDIT.md`](./SECURITY-AUDIT.md). External validation:

- Security headers: HSTS · X-Frame-Options DENY · X-Content-Type-Options nosniff · Referrer-Policy · Permissions-Policy → all present on every site
- TLS: TLSv1.2 + TLSv1.3 only, GCM/CHACHA20 cipher suites only (CBC dropped)
- `Server` header stripped, `server_tokens off`
- Dotfile paths (`/.claude/*`, `/.env`, `/.git/*`, …) → 404 on all sites
- Only `GET` returns 200; POST/PUT/DELETE/OPTIONS/TRACE/PATCH → 405
- SSH: dedicated `kali@dekada72h` ed25519 key, only that one key in `authorized_keys`, password auth disabled at every layer

## Operational notes

- **Do NOT** unhold docker — `apt upgrade` to 29.x will break Traefik (client API mismatch). Documented in VPS notes; the hold is the safety net.
- TLS auto-renew: monitor `/srv/traefik/logs/traefik.log` for `letsencrypt` errors; rate limit is 5 failed validations/hour/identifier.
- Backups: daily site backups → `/var/backups/sites/{daily,weekly,monthly}` via `/srv/scripts/backup-sites.sh` cron.
- Pre-audit-fix configs preserved in `/srv/_backups/pre-audit-fix-2026-04-25/`.
