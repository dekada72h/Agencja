---
description: Pełny cykl audytu bezpieczeństwa Dekada72H VPS + kontenery + 4 strony + naprawy + raport
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(ssh dekada-vps:*), Bash(scp:*), Bash(rsync:*), Bash(nmap *), Bash(sslscan *), Bash(nikto *), Bash(dig *), Bash(ping *), Bash(npm audit *), Bash(curl *), Bash(ab *), Bash(git *), Bash(gh *), Bash(mkdir -p:*)
argument-hint: [quick|full|fix-only|verify] [optional-scope]
---

# Security Audit Skill — Dekada72H Infrastructure

Powtarzalny pipeline audytu bezpieczeństwa, którego wynikiem jest zaktualizowany `SECURITY-AUDIT.md` i naprawione luki na VPS. Każdy przebieg datowany. Historia w git.

## Stałe konteksty (NIE pytaj o nie)

- **VPS:** `51.83.161.122` (OVH, Ubuntu 24.04), SSH alias `dekada-vps`, user `ubuntu`
- **6 kontenerów:** `traefik` (v3.5), `dekada72h` (Next.js 16), `skytech-solutions` (Next.js 14), `skytech-db` (postgres:16-alpine), `domexpert-online` (nginx:alpine), `kowalskipartners-space` (nginx:alpine)
- **5 produkcyjnych domen:** `dekada72h.com`, `skytech-solutions.de`, `skytech-solutions.pl`, `domexpert.online`, `kowalskipartners.space` (każda + `www.`)
- **4 lokalne projekty na ścieżkach:** `/home/kali/Desktop/Agencja` (web/ to Next.js), `/home/kali/Desktop/skytech-solutions.de`, `/home/kali/Desktop/Kowalski&Partners`, `/home/kali/Desktop/DomExpert`
- **2 repo z SECURITY-AUDIT.md:** `dekada72h/Agencja` (master, central infra report) i `dekada72h/skytech-solutions.de` (main, app-specific). Statyki bez własnego raportu.
- **Docker MUSI zostać 28.5.2** (apt-mark hold) – 29.x łamie Traefik docker provider, zweryfikowane w poprzednich audytach.
- **Backupy zmian configu:** `/srv/_backups/audit-YYYY-MM-DD/` na VPS (containers/, dynamic.yml, compose).

## Argument: tryb pracy

- `quick` — recon + headers test + container matrix + minimal nmap (~3 min). Bez fixów. Bez lynis. Tylko rapid health check.
- `full` (domyślny) — pełny audyt jak w sesji 2026-05-01: recon, code audit, external scan, TLS, headers, sensitive paths, container hardening, lynis, light stress test, naprawy znalezionych luk, update SECURITY-AUDIT.md, commit+push.
- `fix-only` — pomiń skany, zaaplikuj **wyłącznie** otwarte zalecenia z bieżącego `SECURITY-AUDIT.md` które są oznaczone jako auto-applicable (np. "Wariant A" runbooks). Nie podejmuje "Open Security Decisions" wymagających ludzkiej decyzji (HSTS preload).
- `verify` — pomiń audit, tylko sanity-check że wszystkie domeny zwracają 200, kontenery `healthy`, fail2ban aktywny, scheduled systemd timery na miejscu.

## Pipeline pełnego audytu (`full` tryb)

### Faza 1: Pre-flight i whitelistowanie
1. Pobierz publiczne IP audytora: `curl -s https://ifconfig.me`
2. Dodaj do fail2ban ignore na czas testów: `ssh dekada-vps "sudo fail2ban-client set sshd addignoreip <IP>; sudo fail2ban-client set recidive addignoreip <IP>"` — zapamiętaj że trzeba zdjąć po
3. Stwórz folder backupów: `/srv/_backups/audit-$(date +%Y-%m-%d)/`

### Faza 2: Recon
- VPS: `uname -a`, `uptime`, `ufw status`, `ss -tulnp`, `docker ps`, `docker network ls`, `getent group sudo`, lista users z shell
- fail2ban status + jails + counts
- `apt list --upgradable`, `apt-mark showhold` (zweryfikuj że docker-ce jest w hold)
- `dpkg -l | grep linux-image` (stare kernele do ewentualnego cleanup)
- Reboot pending check: `ls /var/run/reboot-required*`

### Faza 3: Audyt kodu
- W `/home/kali/Desktop/Agencja/web/` i `/home/kali/Desktop/skytech-solutions.de/`:
  - `npm audit --json` (skip dev-only deps)
  - Grep secrets: `grep -rEi "api_key|secret|password|token|sk_live|firebase|BEGIN .* PRIVATE"` (poza node_modules, .next, .git)
  - Sprawdź `.env*` files: czy są w `.gitignore`, czy git nie tracking
  - Lista API endpointów: `find src/app/api app/api -name "route.ts"` — dla każdego sprawdź: walidację Zod, auth check (`requireAdmin`/`requireSession`), rate-limit, honeypot
- Statyczne strony (`Kowalski&Partners`, `DomExpert`): grep secrets, listing `.git/`/`.env`/`.claude/`

### Faza 4: External skan z Kali
- `nmap -Pn -T2 -p- --max-rate 50 51.83.161.122` — pełny TCP, stealth
- `sslscan --no-colour 51.83.161.122:443`
- HTTP headers per domena: `curl -ksI https://<d>/` — sprawdź obecność CSP, COOP, CORP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, brak Server/X-Powered-By
- Sensitive paths probe na każdej domenie (status code != 200 dla wszystkich): `/.env`, `/.git/config`, `/.claude/settings.local.json`, `/data/partners.json`, `/server-status`, `/admin`, `/wp-admin`, `/backup.zip`, `/.htaccess`, `/_next/static/chunks/main.js`
- API behavior: `/api/auth/session`, `/api/auth/csrf`, `/api/admin/*` (powinny 401/405/400, nigdy 200 bez auth)
- Rate-limit verify: 30 szybkich POST do `/api/auth/forgot` na skytech (oczekuj 20×200 → 10×429), oraz na `/api/auth/csrf` na dekada72h
- Honeypot test: POST `/api/contact` z `website` field → oczekuj `id:null`; POST bez → oczekuj UUID
- Nikto -Tuning x6 -maxtime 60 na największych Next.js domenach (dekada72h, skytech-solutions.de). Parsuj output, ignoruj typowe false positives (Drupal Link header, NEXT_LOCALE cookie).

### Faza 5: Audyt kontenerów Docker
Dla każdego z 6 kontenerów: `docker inspect` + `docker exec ... grep ^Cap /proc/1/status` zbiera:

| Kontrola | Idealnie |
|---|---|
| `Config.User` | non-root (1001 dla Next.js, 70 dla postgres alpine, root only dla nginx master) |
| `HostConfig.ReadonlyRootfs` | `true` (poza skytech-db który ma RW volume na pgdata) |
| `HostConfig.SecurityOpt` | zawiera `no-new-privileges:true` |
| `HostConfig.CapDrop` | `[ALL]` |
| `HostConfig.CapAdd` | tylko absolutnie wymagane (NET_BIND_SERVICE dla Traefik/nginx, CHOWN+DAC+SETUID/GID dla nginx master + postgres init) |
| `HostConfig.Memory` (mem_limit) | ustawione (5-10× headroom) |
| `HostConfig.PidsLimit` | ustawione (50-200) |
| `Config.Healthcheck` | obecne dla web/DB |
| Inside `/proc/1/status`: `CapEff` | `0x0` dla Next.js, `0x4c3` dla nginx, `0x400` dla Traefik |
| Inside: `Seccomp` | `2` (filtered) |
| `AppArmorProfile` | `docker-default` |

Brakujące → MEDIUM finding, zaproponuj fix przez edycję compose i restart kontenera.

### Faza 6: Audyt VPS-OS (Lynis)
- `sudo lynis audit system --quiet --no-colors > /tmp/lynis-after.log`
- Parsuj `suggestion[]=` z `/var/log/lynis-report.dat`. Liczba sugestii to wskaźnik – cel: ≤22 (stan po 2026-05-01).
- Sprawdź:
  - SSH: `sshd -T | grep -iE "(permitroot|password|maxauth|allowusers|ciphers|kex|macs|maxsessions)"` — porównaj z baseline w `SECURITY-AUDIT.md` sekcja 5b
  - sysctl runtime: 12 kluczowych wartości (tcp_syncookies, rp_filter, kptr_restrict, dmesg_restrict, unprivileged_bpf_disabled, kexec_load_disabled, yama.ptrace_scope, fs.protected_*) — wszystko enabled
  - sudoers: `timestamp_timeout=15` w `/etc/sudoers.d/99-hardening`
  - Kernel module blacklist: `/etc/modprobe.d/blacklist-rare-network.conf`, `/etc/modprobe.d/blacklist-usb-storage.conf`
  - `/etc/login.defs`: `UMASK 027`, `PASS_MAX_DAYS 365`, `SHA_CRYPT_MIN_ROUNDS 500000`
  - `/etc/security/limits.conf`: `* hard core 0`, `* soft core 0`
  - Pakiety hardening: `dpkg -l libpam-tmpdir debsums apt-show-versions`

### Faza 7: Light stress test (kontrolowany, na whitelistowanym IP)
`ab -n 50 -c 5 -k https://<d>/` na każdej z 5 domen. Zero failed = OK. Notuj RPS/median dla baseline.

### Faza 8: Naprawy automatyczne
Każda znaleziona luka, która ma ustaloną procedurę naprawy w `SECURITY-AUDIT.md` sekcja "🛠 Jak zaaplikować":
1. Backup pliku do `/srv/_backups/audit-$(date +%Y-%m-%d)/`
2. Wykonaj zmianę
3. Verify (curl, docker inspect, sshd -T, etc.)
4. Jeśli verify failed → rollback z backupu i zarapportuj w raporcie

**NIE aplikuj automatycznie:** HSTS preload submission (irreversible), zmiany wymagające user decision oznaczone w "🚨 OPEN SECURITY DECISIONS".

### Faza 9: Update raport + commit + push
1. Edytuj `/home/kali/Desktop/Agencja/SECURITY-AUDIT.md`:
   - Dodaj nowy wpis w sekcji "Historia" z datą bieżącą i wynikami
   - Update hardening matrix (sekcja 5)
   - Update Lynis suggestions count
   - Jeśli nowe luki znalezione+naprawione → opisz w sekcji "Findings" z severity, repro, fix
   - Jeśli nowa luka **nie naprawiona** → dodaj do "🚨 OPEN SECURITY DECISIONS" z runbookiem
2. Update `/home/kali/Desktop/skytech-solutions.de/SECURITY-AUDIT.md` jeśli były app-specific zmiany w skytech kodzie
3. `git add SECURITY-AUDIT.md && git commit -m "audit: <data> — <co znaleziono i naprawiono>" && git push`
4. Per dotknięte repo: skytech zmiany kodu commit do `dekada72h/skytech-solutions.de@main`, infra zmiany do `dekada72h/Agencja@master`

### Faza 10: Cleanup
- Zdjęcie audytora z fail2ban whitelist: `ssh dekada-vps "sudo fail2ban-client set sshd delignoreip <IP>; sudo fail2ban-client set recidive delignoreip <IP>"` — **MUSI** się stać przed końcem
- Albo: zaplanować systemd-timer one-shot na `+8h` żeby zdjął sam (jak w 2026-05-01: `audit-f2b-whitelist-cleanup.service`)

## Zasady krytyczne

1. **Whitelist swoje IP w fail2ban PRZED skanowaniem**, ZDEJMIJ po. Brak = ban + lockout VPS po SSH.
2. **NIGDY nie podnoś `apt upgrade` bez sprawdzenia `apt-mark showhold`**. Docker-ce 28.5.2 jest pinned. 29.x łamie Traefik docker provider — udokumentowane w VPS notes.
3. **Pre-change backup do `/srv/_backups/audit-YYYY-MM-DD/`** dla każdego pliku który modyfikujesz (compose, sshd_config, sysctl, dynamic.yml).
4. **Test po każdej zmianie containera**: `docker inspect <c>`, `curl -ksI https://<domena>/`, `docker logs <c> --tail 20`. Jeśli health != healthy lub HTTP != 200 → rollback.
5. **NIE rebootuj VPS** ręcznie. unattended-upgrades robi to autonomicznie 04:00 UTC gdy potrzebne.
6. **Nigdy nie commit sekretów** do raportu. Auth secrets, DB hasła, fail2ban whitelist IP audytora są OK do wymienienia ale nie ich wartości. Hash bcrypt nie jest sekretem (jednokierunkowy).
7. **Format daty:** zawsze ISO `YYYY-MM-DD` w plikach, czas UTC dla schedulingu.

## Output po sukcesie

- Komunikat z liczbą znalezionych luk (severity breakdown), liczbą naprawionych, otwartych zaleceń, Lynis index, linkiem do commit URLs.
- Lista IP zdjętych z fail2ban whitelist (lub planowanego cleanup czasu jeśli timer).
- Czas wykonania audytu.

## Output po błędzie

- Co się nie udało, na jakim kontenerze/pliku/skanie.
- Czy stan jest zachowany czy wymaga ręcznego rollback z `/srv/_backups/audit-<date>/`.
- Jeśli IP nadal w fail2ban whitelist → instrukcja zdjęcia.

## Reference – ostatnie cykle

- **2026-04-25:** pierwszy audyt. .claude/ removal, security headers, server_tokens, CBC ciphers off. Wynik: 77 Lynis.
- **2026-05-01:** drugi audyt + container hardening pass + VPS hardening pass. Wynik: 76 Lynis (po dodaniu nowych testów), CapEff=0 dla Next.js, 22 Lynis suggestions.
