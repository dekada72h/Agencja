# Security Audit – Dekada72H Infrastructure

- **Date:** 2026-04-25
- **Scope:** GitHub repos (dekada72h org), VPS `51.83.161.122` (vps-dae43f65, Ubuntu 24.04), 5 production sites behind Traefik (`dekada72h.com`, `domexpert.online`, `kowalskipartners.space`, `skytech-solutions.de`, `skytech-solutions.pl`).
- **Methodology:** static code review, secret-grep, container introspection, filesystem scan on host, external nmap/sslscan/nikto from Kali, HTTP surface tests.
- **Overall posture:** 🟢 **Strong.** No credential leaks, only ports 22/80/443 reachable, modern TLS, kernel/SSH hardened. Two **medium-severity** findings (information disclosure via `.claude/` directories) and a few **low-severity** hardening gaps.

## Remediation status (applied 2026-04-25)
All findings 1–6 below were fixed the same day. Verified externally with `curl -sI` and `sslscan`:
- ✅ `.claude/` removed from `domexpert.online` and `kowalskipartners.space` webroots
- ✅ Global nginx dotfile-deny via shared `/srv/sites/_shared/default.conf` mounted into every container
- ✅ Traefik file provider added (`/srv/traefik/dynamic.yml`) with `security-headers` middleware applied globally on the `websecure` entrypoint — HSTS / X-Frame-Options DENY / X-Content-Type-Options nosniff / Referrer-Policy / Permissions-Policy now sent on every site, `Server` header stripped
- ✅ `tls.options.default` restricts TLS 1.2 to GCM + CHACHA20 only, dropping CBC suites (TLS 1.3 unchanged)
- ✅ All site containers + Traefik run with `read_only: true` + tmpfs for `/var/cache/nginx`, `/var/run`, `/tmp`
- ✅ `server_tokens off;` in shared nginx config and skytech `nginx.conf`
- ✅ APT upgraded (5 → 0 pending)
- ⚠️ Side effect: `apt upgrade` bumped Docker 28.5.2 → 29.4.1, which broke Traefik's docker provider (known incompatibility documented in VPS notes). Downgraded back to 28.5.2 and `apt-mark hold docker-ce docker-ce-cli` to prevent recurrence.
- 🔧 Pre-change config snapshot saved at `/srv/_backups/pre-audit-fix-2026-04-25/`.

---

## 1. Findings (prioritized)

### 🟠 MEDIUM-1 – `.claude/settings.local.json` publicly accessible
`HTTP 200` on:
- `https://domexpert.online/.claude/settings.local.json`
- `https://kowalskipartners.space/.claude/settings.local.json`

The files were published from the dev workstation along with the static site. They contain no API keys/tokens, but they leak: AI tooling in use (Claude Code), historic shell command snippets (git/gh/cat), and project metadata. This is information disclosure; not exploitable directly but useful for reconnaissance.

**Remediation (one of):**
- Delete `.claude/` from `/srv/sites/<site>/html/` on the VPS (and from the corresponding GitHub repo `gh-pages`/`main`).
- Add nginx rule `location ~ /\. { deny all; return 404; }` to all containers to block all dotfile URLs.

### 🟠 MEDIUM-2 – Security response headers missing on all sites
None of the production sites send `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`. The `_headers` file in the repo is for Cloudflare Pages / Netlify and is **inert when nginx serves the site directly**. Verified with `curl -sI` on all five hostnames and confirmed by nikto (`HSTS not defined`, `X-Frame-Options not present`, `X-Content-Type-Options not set`).

**Remediation:** add a shared `security-headers.conf` to each nginx container (or as a Traefik middleware) with at minimum:
```
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```
Traefik middleware approach (preferred) keeps it DRY across all sites.

### 🟡 LOW-1 – nginx version disclosed
`Server: nginx/1.29.8` returned on all sites. Cosmetic; useful for attackers to identify CVE matches.
**Fix:** `server_tokens off;` in nginx `http {}` block.

### 🟡 LOW-2 – Containers run as root, rootfs writable
`docker inspect` shows `User=""` and `ReadOnly=false` for all four nginx containers. Container breakout impact is reduced by `no-new-privileges:true` (set globally in `daemon.json`) and `:ro` mount on `/usr/share/nginx/html`, but defense-in-depth is missing.
**Fix:** add `read_only: true` to compose, plus `tmpfs: [/var/cache/nginx, /var/run]`, optionally `user: "101:101"` (nginx user in Alpine image).

### 🟡 LOW-3 – TLS 1.2 CBC ciphers still offered
`ECDHE-RSA-AES128-SHA` and `ECDHE-RSA-AES256-SHA` are accepted on dekada72h.com (TLS 1.2). Not vulnerable to known practical attacks but classed as "weak" by SSL Labs. TLS 1.3 + GCM/CHACHA suites are preferred.
**Fix:** set Traefik `tls.options.default.cipherSuites` to GCM+CHACHA only, drop CBC.

### 🟡 LOW-4 – 5 pending APT updates on VPS
`apt list --upgradable | wc -l` = 5. Unattended-upgrades is enabled but these have not landed yet (likely held / kernel related). Worth running `sudo apt upgrade` manually.

### 🟢 INFO – nmap vulners "OpenSSH 9.6p1" CVE list
~80 CVEs reported by `--script vulners`. The package on the host is `9.6p1 Ubuntu 3ubuntu13.15` – Ubuntu backports patches into `3ubuntu13.x` revisions, so most of these are **false positives**. CVE-2024-6387 (regreSSHion) is fixed in current Ubuntu 24.04. Recommendation: keep unattended-upgrades on, monitor `unattended-upgrade.log`.

---

## 2. Code & Secret Audit

### 2.1 Local repo (`Agencja`, public)
- 109 files (79 HTML, 18 JS, 9 CSS, 1 JSON, 1 XML, 1 MD).
- No `.env`, `.key`, `.pem`, `id_rsa*`, `*.bak`, or `*credential*` files in tree or git history (`git log --diff-filter=A`).
- Regex sweep for `api_key|secret|token|password|AIza|sk_live|ghp_|BEGIN .* PRIVATE` – **0 matches** outside of UI strings.
- Only third-party identifier present is the public Formspree form ID (`xlgneypa`), not a secret.
- Cookie-consent gates Google Analytics (`G-DX7YV492B7`) – correct for GDPR.

### 2.2 GitHub – public repos
Audited 6 public repos (`Agencja`, `skytech-solutions.de`, `domexpert`, `kowalski-partners`, `software-slice`, `claude-code`).
- No `.env`, no Dockerfiles, no compose files committed.
- `skytech-solutions.de` (Next.js) has no `process.env` reads, no API endpoints, contact via `mailto:`/`tel:` only.
- `domexpert` and `kowalski-partners` are pure static HTML/CSS/JS – no backend.
- Private repos (`Trimora`, `aeropro-portal`, `easyfaktura`, `flowmatic`, `hairly.space`) **not in scope** for this audit.

### 2.3 VPS – container env & filesystem
- All four nginx containers have only generic env (`PATH`, `NGINX_VERSION`, etc.) – **no secrets**.
- Traefik container env: `TZ=Europe/Warsaw` only. ACME email and resolver come from `traefik.yml` (chmod 644, owned by `ubuntu` – fine, no secret content).
- `/srv/traefik/acme.json` and `acme.json.bak.20260412_140313` correctly chmod `600`, owned `root`. ✅
- `/home/ubuntu`, `/root/` mode `0700` / `0750`. No `.bash_history` (cleared). ✅
- No `.git`, `.env`, `.swp`, `.bak` files inside `/srv/sites/*/html/`.
- `.claude/` directories present in `domexpert.online/html/` and `kowalskipartners.space/html/` – see MEDIUM-1.

---

## 3. VPS Hardening Status

| Control | State |
|---|---|
| UFW (only 22/80/443 in) | ✅ |
| SSH: pubkey-only, ed25519/chacha20, `AuthenticationMethods publickey`, `AllowUsers ubuntu`, `MaxAuthTries 3`, `LoginGraceTime 30` | ✅ |
| SSH banner (`/etc/issue.net`) | ✅ |
| fail2ban (sshd + recidive jails, ~30+ IPs banned at audit time) | ✅ |
| sysctl hardening (`tcp_syncookies`, `rp_filter`, `kptr_restrict=2`, `dmesg_restrict=1`, `unprivileged_bpf_disabled=1`, `kexec_load_disabled=1`, `protected_hardlinks/symlinks`) | ✅ |
| auditd active (10 watch rules) | ✅ |
| unattended-upgrades active | ✅ (5 pending – LOW-4) |
| Docker daemon: `no-new-privileges`, `userland-proxy=false`, `live-restore`, `icc=false`, log rotation 10m×3 | ✅ |
| Docker version 28.5.2 (pinned – 29.x breaks Traefik) | ✅ |
| Per-container `read_only`, non-root user | ❌ (LOW-2) |
| HTTPS-only redirect (HTTP 308) | ✅ |
| TLS 1.0/1.1/SSLv2/SSLv3 disabled | ✅ |
| Heartbleed | ✅ Not vulnerable |
| TLS 1.2 CBC ciphers offered | ⚠️ (LOW-3) |
| Security response headers | ❌ (MEDIUM-2) |

---

## 4. External Surface (nmap from Kali)

```
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 9.6p1 Ubuntu 3ubuntu13.15
80/tcp  open  http     Traefik (Go net/http)
443/tcp open  https    Traefik (Go net/http)
```
- TCP all-ports (-p-): only **3 ports open**, all others filtered.
- UDP top-50: 0 open, 50 open|filtered (no responses) – nothing listening.
- SSL `ssl-enum-ciphers`: TLS 1.2 + 1.3, all ciphers grade **A**, post-quantum `X25519MLKEM768` group offered on TLS 1.3.
- HTTP methods on `/`: only `GET` returns 200; POST/PUT/DELETE/OPTIONS/TRACE/PATCH all `405`.
- Common sensitive paths (`.env`, `.git/config`, `wp-admin`, `server-status`, `.htaccess`, `backup.zip`): all `404`.
- Directory listing: `403` (denied).

---

## 5. Recommendations (rank-ordered)

1. **Remove `.claude/` from production webroots** (MEDIUM-1) and add a global nginx dotfile-deny rule.
2. **Apply security headers** via Traefik middleware (MEDIUM-2).
3. `server_tokens off;` (LOW-1).
4. Run `sudo apt upgrade` to clear the 5 pending updates (LOW-4).
5. Tighten TLS to GCM/CHACHA-only via Traefik `tls.options` (LOW-3).
6. Add `read_only: true`, tmpfs mounts, and `user:` to per-site compose files (LOW-2).
7. Consider rotating SSH key/banner reminder once a year and exporting auditd logs off-host.

---

## 6. Tools used
nmap 7.98 (`-sV -sC -p- --script default,vuln,ssl-enum-ciphers,http-headers,http-security-headers,http-methods`), sslscan, nikto 2.1.5, curl, ssh, `docker inspect`, `find`, `grep -E`, `gh repo clone`. All scans authorized (assets owned by audit requester).
