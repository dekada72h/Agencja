# Security Audit – Dekada72H Infrastructure

> ## 🚨 OPEN SECURITY DECISIONS (manual — non-automated)
>
> Te punkty **wymagają świadomej decyzji człowieka** i nie mogą być zaplanowane jako auto-task. Lokalizacja jedyna i centralna: **ten plik** (`Agencja/SECURITY-AUDIT.md`) – mimo że dotyczą całej infry / wielu repo. Powód: 1 VPS = 1 raport infra; pozostałe repo (skytech-solutions.de, kowalski-partners, domexpert) tylko cross-linkują tutaj.
>
> ### 1. HSTS preload list (`stsPreload: true` w Traefik dynamic.yml)
>
> **Status:** ❌ wyłączone (`stsPreload: false`). Plik: `/srv/traefik/dynamic.yml` na VPS.
>
> **Co to robi:** Po włączeniu i submisji domeny na <https://hstspreload.org/>, Google wpina domenę do **kodu Chrome/Firefox/Safari/Edge**. Przeglądarki **nigdy** nie wykonają HTTP requestu do tej domeny – nawet pierwszego, nawet po reinstalu, nawet w incognito. Eliminuje MITM downgrade attack na pierwszej wizycie usera.
>
> **DLACZEGO TO POWAŻNA DECYZJA — ŻELAZNA REGUŁA:**
>
> Submission jest **w jedną stronę**. Wycofanie się z preload listy zajmuje **6–12 tygodni** (czas na nowy release Chrome i propagację) – w międzyczasie:
>
> - 🔒 **Każda subdomena** musi serwować HTTPS z ważnym certem. `*.dekada72h.com`. Jeśli postawisz `dev.dekada72h.com` bez TLS – jest niedostępna z Chrome.
> - 🔒 Jeśli **Let's Encrypt renew się zepsuje** i certs wygasną – domena jest niedostępna. Brak HTTP fallback (zazwyczaj można odpalić plain HTTP "tylko na chwilę by naprawić" – preload to wyklucza).
> - 🔒 Jeśli **sprzedasz/oddasz domenę** – nowy właściciel nie może serwować HTTP. Tani redirect do nowej strony? Niemożliwy bez TLS.
> - 🔒 **`includeSubDomains` jest wymagane** – nawet subdomeny które nie są twoje technicznie (np. cnames do third-party services) muszą być HTTPS.
>
> **Rekomendacja per domena (stan na 2026-05-01):**
>
> | Domena | Włączyć preload? | Uzasadnienie |
> |---|---|---|
> | `dekada72h.com` | ✅ TAK (kandydat) | Domena biznesowa, single-purpose, długoterminowa, brak planów na dev-subdomeny bez TLS |
> | `kowalskipartners.space` | ✅ TAK (kandydat) | Statyczna strona klienta, single-purpose, długoterminowa |
> | `domexpert.online` | ✅ TAK (kandydat) | jw. |
> | `skytech-solutions.de` | ⚠️ ROZWAŻ | Może w przyszłości potrzebować dev/staging subdomeny |
> | `skytech-solutions.pl` | ⚠️ ROZWAŻ | jw. |
>
> **Jak zaaplikować (gdy zdecydujesz):**
>
> 1. Edytuj `/srv/traefik/dynamic.yml` na VPS:
>    ```yaml
>    headers:
>      stsSeconds: 31536000          # już jest
>      stsIncludeSubdomains: true    # już jest
>      stsPreload: true              # ← zmienić z false na true
>    ```
> 2. Restart Traefik: `cd /srv/traefik && docker compose restart traefik`
> 3. Verify: `curl -ksI https://<domain>/ | grep -i strict-transport` musi zawierać `; preload`
> 4. Submit każdej domeny ręcznie na <https://hstspreload.org/> i potwierdź własność.
> 5. Czekaj ~6 tygodni na release Chrome z domeną na liście.
>
> **Test "ready to preload":** strona <https://hstspreload.org/> sama waliduje. Jeśli "eligible for preloading" – możesz, jeśli nie – pokazuje co poprawić.
>
> ### 2. Defense-in-depth per-user rate-limit w Next.js (Upstash Redis sliding window)
>
> **Status:** ❌ niezaimplementowane. Traefik ma per-IP rate-limit (10/min auth, 30/min public-api) co zatrzymuje większość ataków, ale przy CDN przed Traefikiem albo NAT-owanych ISP wszyscy użytkownicy dzielą jeden IP.
>
> **Decyzja:** czy chcemy ten dodatkowy poziom zabezpieczenia. Jeśli tak: integracja z Upstash (free tier) ~1 dnia pracy w `skytech-solutions.de`. Wymaga GitHub repo connection w Claude Code lub ręcznej pracy.
>
> ### 3. Konsolidacja `/srv/_backups/` (rok rolloff)
>
> Stare backupy `pre-audit-fix-2026-04-25/` mogą być usunięte po 2027-04-25 (rok retention). Niski priorytet – to są kilkudziesięcio-kilobajtowe configi YAML.
>
> ---
>
> **Zautomatyzowane follow-upy (nie wymagają twojej akcji):**
>
> | # | Co | Kiedy | Mechanizm |
> |---|---|---|---|
> | 1 | `apt autoremove --purge` (cleanup kernel-headers 6.8.0-110 po reboot) | 2026-05-02 12:00 UTC | systemd timer `audit-apt-cleanup.timer` na VPS |
> | 2 | `fail2ban delignoreip 185.72.186.36` (zdjąć whitelist Kali audytora) | 2026-05-01 22:00 UTC | systemd timer `audit-f2b-whitelist-cleanup.timer` na VPS |
>
> Verify on VPS: `systemctl list-timers --all \| grep audit-`. Logi po wykonaniu: `journalctl -u audit-apt-cleanup.service` i `journalctl -u audit-f2b-whitelist-cleanup.service`.

---

**Data audytu:** 2026-05-01
**Poprzedni audyt:** 2026-04-25 (zachowany w historii git)
**Skanujący IP:** 185.72.186.36 (Kali Linux, IP whitelistowany w fail2ban na czas testów)
**Zakres:** 5 produkcyjnych domen za Traefikiem, VPS `51.83.161.122` (OVH, Ubuntu 24.04), 4 lokalne repozytoria (`Agencja`, `skytech-solutions.de`, `Kowalski&Partners`, `DomExpert`).
**Metodyka:** static review, secret-grep, container introspection, nmap stealth (-T2/-T3, --max-rate 50), sslscan, nikto -Tuning x6, curl probes na 21+ wrażliwych ścieżkach, lekki ab stress test (50 żądań × 5 współbieżnych), apt list --upgradable, docker inspect, postgres query, lynis audit system.
**Ogólny stan:** 🟢 **MOCNY** – po dzisiejszych naprawach. Wszystkie znalezione luki krytyczne i średnie zaadresowane. Brak otwartych problemów wysokich.

---

## 1. Inwentaryzacja infrastruktury (stan 2026-05-01)

### VPS
| Pole | Wartość |
|---|---|
| IP | `51.83.161.122` (OVH) |
| Hostname | `vps-dae43f65` |
| OS | Ubuntu 24.04 LTS (noble) |
| Kernel działa | `6.8.0-110-generic` |
| Kernel oczekujący (reboot 04:00 UTC sob 2026-05-02) | `6.8.0-111-generic` |
| Disk | 72 GB, 38 % zajęte |
| RAM | 7.6 GB, 1.7 GB używane |
| Swap | brak |
| Uptime | 16 d 3 h |
| Load avg (1/5/15 min) | 0.66 / 0.39 / 0.28 |
| Lynis Hardening Index | **76/100** |
| Docker | **28.5.2** (HOLD – 29.x łamie Traefik docker provider, znany problem) |
| ufw | `active`, in: 22/80/443 only |
| fail2ban (jail sshd) | 38 currently banned, 346 łącznie zbanowanych |
| fail2ban (jail recidive) | 0 obecnie, 0 łącznie |
| auditd | 10 reguł aktywnych (passwd/shadow/sudoers/sshd/hosts/traefik + execve euid=0) |
| unattended-upgrades | aktywne, ostatnio zadziałało 2026-05-01 06:13 (kernel + libkmod) |
| Pending APT updates | 0 security; tylko `docker-ce` 28→29 (HOLD intencjonalny) |

### Kontenery (6 działających, all production)
| Container | Image | Status | Networks | Sec posture |
|---|---|---|---|---|
| `traefik` | `traefik:v3.5` | up 16 min* | web | RO root, tmpfs, no-new-priv, docker.sock RO |
| `dekada72h` | `dekada72h-next:latest` (Next 16.2.4) | up 7 min* | web | RO root, tmpfs, **user nextjs (1001)**, partners.json RO bind |
| `skytech-solutions` | `skytech-solutions:latest` (Next 14.2) | up 11 min* | web + skytech-internal | **user nextjs (1001)**, no-new-priv, RW (Next.js standalone wymaga zapisu) |
| `skytech-db` | `postgres:16-alpine` | up 3 d (healthy) | skytech-internal **only** | private net, no host port, hasło 31-char random |
| `domexpert-online` | `nginx:alpine` | up 5 d | web | RO root, tmpfs, ro html |
| `kowalskipartners-space` | `nginx:alpine` | up 5 d | web | RO root, tmpfs, ro html |

*restarty wynikają z dzisiejszych deployów napraw (2 z nich)

### Domeny w Traefik
- `dekada72h.com` (+ `www.`) → `dekada72h` (Next.js 16, panel wspólników)
- `skytech-solutions.de` (+ `www.`) → `skytech-solutions` (Next.js 14, admin panel + 2FA + DB)
- `skytech-solutions.pl` (+ `www.`) → `skytech-solutions` (ten sam kontener, drugi router)
- `domexpert.online` (+ `www.`) → `domexpert-online` (statyka)
- `kowalskipartners.space` (+ `www.`) → `kowalskipartners-space` (statyka)

### Sieć
- Tylko TCP 22 / 80 / 443 wystawione na świat (potwierdzone `nmap -p- --max-rate 50` z Kali).
- Docker bridge `web` łączy Traefika z 4 site-containerami; `skytech-internal` izoluje DB Postgres.
- Postgres NIE jest exposed ani na hosta, ani do `web` – tylko `skytech-solutions` ma do niej dostęp.

---

## 2. Znalezione problemy i naprawy (chronologicznie – od 2026-05-01)

### 🟠 MEDIUM-1 – Brak Content-Security-Policy
**Stan przed:** żadna z 5 domen nie wysyłała CSP. Inne security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) były obecne globalnie z poprzedniego audytu. Brak CSP otwiera drogę do XSS/clickjacking, jeśli kiedykolwiek pojawi się user-input rendered nieescapowany.

**Naprawa:** dodano `contentSecurityPolicy` do `security-headers@file` w `/srv/traefik/dynamic.yml`. CSP pozwala na inline scripts/styles (wymóg Next.js hydration + CSS-in-JS), ale ogranicza source do `'self'` + zaufane domeny (Google Analytics, Formspree, Unsplash). Ustawione również `Cross-Origin-Opener-Policy: same-origin` i `Cross-Origin-Resource-Policy: same-origin` dla mitigacji Spectre-class attacks.

**Verify:** `curl -ksI https://dekada72h.com/ | grep -i csp` zwraca pełny header.

### 🟠 MEDIUM-2 – `/api/admin/me/2fa/disable` wyłączał 2FA bez weryfikacji hasła
**Stan przed:** endpoint w skytech-solutions wymagał tylko sesji – sama cookie wystarczyła, by wyłączyć 2FA. Cracked password = wymaga 2FA przy logowaniu, ale skradzionym session cookie atakujący mógłby zdjąć 2FA bez znajomości hasła **ani** dostępu do telefonu.

**Naprawa:** endpoint przyjmuje teraz `{ password, totp? }`, sprawdza `bcrypt.compare(password, user.passwordHash)` oraz, jeśli 2FA jest aktywne, `totpVerify(totp, user.twoFactorSecret)`. UI (`SettingsClient.tsx`) prosi o oba przed POST.

**Pliki zmienione (`/home/kali/Desktop/skytech-solutions.de/`):**
- `src/app/api/admin/me/2fa/disable/route.ts` – dodano walidację Zod, bcrypt, otplib
- `src/app/admin/settings/SettingsClient.tsx` – `prompt()` dla password + TOTP, body POST

### 🟠 MEDIUM-3 – Brak rate-limiting na publicznych endpointach
**Stan przed:** `/api/contact`, `/api/leads`, `/api/auth/forgot`, `/api/auth/[...nextauth]` pozwalały na ~10 req/s z jednego IP. Tester zrobił 5 żądań `/api/auth/forgot` w 0.5 s – wszystkie 200. Pozwalało to na: spam wiadomości w bazie Message, masowe wystawianie tokenów reset (które trafiają do bazy), brute-force loginu.

**Naprawa:** dodano dwa middleware Traefik w `dynamic.yml`:
- `auth-ratelimit` – 10/min average, burst 20 → na `/api/auth/*` (skytech .de + .pl + dekada72h)
- `public-api-ratelimit` – 30/min average, burst 60 → na `/api/contact` i `/api/leads` (skytech .de + .pl)

Każdy site ma teraz 2 dodatkowe routery w `docker-compose.yml`, z `priority=200` żeby wyprzedzały catch-all router strony.

**Verify:** `for i in {1..30}; do curl ... /api/auth/forgot; done` pokazuje 20× `200` potem 10× `429`. Strony / publiczne traffic NIE są limitowane.

### 🟠 MEDIUM-4 – Formularze bez honeypot/timestamp anti-spam
**Stan przed:** komentarz w `/api/contact/route.ts` deklarował "Anti-spam: sprawdzanie honeypot field" – ale w kodzie tego nigdy nie było. Tester wysłał `{name:test,email:test@test.com,message:hello}` POST → status 200 + `id` w odpowiedzi (lead w DB).

**Naprawa:** dodano dwa optional pola do schematu Zod w `/api/contact` i `/api/leads`:
- `website` – honeypot. UI (`Contact.tsx`) renderuje hidden input `<div aria-hidden style="position:absolute;left:-9999px">` z `tabindex=-1, autocomplete=off`. Boty wypełnią, ludzie nie. Jeśli wypełnione → 200 OK ale `id: null` (silent drop).
- `ts` – timestamp z `useState(() => Date.now())` na mount. Submit przed 1.5 s od montażu → silent drop.

**Verify:**
- `{...,"website":"https://x"}` → `{"ok":true,"id":null}` ✓ (drop)
- normal payload → `{"ok":true,"id":"cmom..."}` ✓ (DB insert)

### 🟡 LOW-1 – Hold linkowanie kerneli 6.8.0-86 i 6.8.0-107 zostawały na dysku
**Stan przed:** `dpkg -l linux-image-*` pokazał 4 obrazy: 86 (stary), 107 (auto-removed wcześniej, ale config files zostały), 110 (running), 111 (pending reboot).

**Naprawa:** `apt-get purge linux-{image,modules}-6.8.0-{86,107}-generic`. Po purge zostały tylko 110 + 111. Disk usage bez zmian (config files były małe), ale czystszy stan.

### 🟢 INFO – cookie `NEXT_LOCALE` bez `Secure` i `HttpOnly`
nikto flagował. Cookie nie zawiera danych sesji ani uwierzytelnienia – tylko język użytkownika (`pl`/`en`/`de`). HttpOnly nie ma znaczenia (cookie nie jest sensitive), Secure pominięte przez Next.js żeby działało w dev / cross-domain. **Nie zmienialiśmy** – false positive w kontekście tego usecase.

### 🟢 INFO – nikto "Drupal Link header"
Klasyczny false positive. `Link:` header to standardowe Next.js preload fonts (`<...woff2>; rel=preload; as=font`). Nie ma nic wspólnego z Drupalem.

---

## 3. Audyt kodu (lokalny + GitHub)

### 3.1 `Agencja` / `web` (Next.js 16, panel wspólników, public repo)
- **Routes:** marketing pages + `/login` + `/panel/*` + `/api/auth/[...nextauth]`.
- **Auth:** NextAuth v5 Credentials, partnerzy w `data/partners.json` (bcrypt hash, mounted RO do kontenera, **nie** w obrazie).
- **AUTH_SECRET:** `.env.local` lokalnie + `.env` na VPS (mode 600), 32-byte random base64.
- **`npm audit`:** 4 moderate (next/postcss/next-auth/next-intl). Wszystkie wynikają z `next < 16.3.0-canary.5` – brak stable fix. Practically: postcss XSS via `</style>` w outpucie CSS – exploit wymagałby kontroli nad zawartością CSS-input (nie istnieje w tej aplikacji). Akceptowalne.
- **Sekrety w git:** brak. `git ls-files | grep env` → tylko `.env.example`-y w dependencjach `node_modules` (które `.gitignore` excluduje).
- **Endpointy publiczne:** tylko `/api/auth/*` (NextAuth), które są teraz rate-limited (10/min).

### 3.2 `skytech-solutions.de` (Next.js 14, admin panel + 2FA + Postgres, public repo)
- **Routes:** marketing + 4 calculatory + 17 API endpointów + `/admin/*` (chronione middleware).
- **Auth:** NextAuth v5 Credentials, użytkownicy w Postgres (User table), bcrypt cost 12, opcjonalne 2FA TOTP (otplib + QR przez qrcode).
- **`npm audit`:** dev-only podatności (eslint-config-next deps: glob, ajv, brace-expansion, flatted). Runtime czysto.
- **API security:**
  - ✅ Walidacja Zod na wszystkich endpointach
  - ✅ `requireAdmin()` / `requireSession()` wrappers na wszystkich `/api/admin/*`
  - ✅ Password reset z hashowanym tokenem (sha256), 1 h expiry, transaction invalidating other tokens
  - ✅ Forgot zawsze zwraca `ok` (nie wycieka czy email istnieje)
  - ✅ Self-delete ADMIN-a zablokowane
  - ✅ Po dzisiejszych naprawach: `/api/admin/me/2fa/disable` wymaga password + TOTP, `/api/contact` + `/api/leads` mają honeypot
- **Postgres credentials:** w env Docker (`POSTGRES_PASSWORD`), 31-znakowy random. Container nie eksponowany na hosta.

### 3.3 `Kowalski&Partners` i `DomExpert` (statyczne HTML, public repos)
- Czyste HTML/CSS/JS, brak backendu.
- Grep `api_key|secret|password|token|sk_live|firebase` – tylko false hits (np. `<title>... | Kowalski Secrets ...</title>`, `<meta description>... trusted...</meta>`). Brak realnych sekretów.
- `.git/`, `.env`, `.claude/` – `404` na publicznym URL (poprawione w audycie 2026-04-25, dziś re-verified).

---

## 4. Zewnętrzny surface (z Kali, IP whitelistowany w fail2ban)

### nmap (`-Pn -T2 -T3 -p- --max-rate 50`)
```
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 9.6p1 Ubuntu 3ubuntu13.16
80/tcp  open  http     Traefik (Go net/http) – redirect 308 → 443
443/tcp open  ssl/http Traefik (Go net/http)
```
Wszystkie 65535 portów: **3 open, reszta filtered**.

### sslscan
- TLSv1.0/1.1/SSLv2/SSLv3 disabled
- TLSv1.2: tylko ECDHE-RSA-GCM/CHACHA20 (3 ciphers)
- TLSv1.3: AES-128-GCM, AES-256-GCM, CHACHA20
- Heartbleed: nie podatny
- Compression: disabled, Renegotiation: not supported
- Cert: TRAEFIK DEFAULT (tylko gdy łączymy się z surowym IP bez SNI – Let's Encrypt po SNI dla każdej domeny)

### Probe wrażliwych ścieżek (21 testów)
| URL | Status | Notatka |
|---|---|---|
| `/.env`, `/.git/config`, `/server-status` na każdej domenie | 404 | ✅ block |
| `/.claude/settings.local.json` (domexpert, kowalski) | 404 | ✅ poprawione 2026-04-25 |
| `/data/partners.json` na dekada72h | 404 | ✅ tylko ro mount do kontenera |
| `/panel`, `/admin`, `/admin/leads` | 307 | ✅ redirect na login |
| `/api/admin/users`, `/api/admin/leads/abc` | 405/401 | ✅ HEAD/GET odrzucony |
| `/api/auth/session`, `/api/auth/csrf` | 400 | ✅ wymaga POST |
| `/api/contact` POST z payloadem | 200 | ✅ (z honeypot/ratelimit) |

### Lekki stress test (`ab -n 50 -c 5`)
| Domena | RPS | mean ms | failed |
|---|---|---|---|
| dekada72h.com (Next.js SSR) | 14 | 352 | 0 |
| skytech-solutions.de (Next.js + DB) | 28 | 176 | 0 |
| domexpert.online (static) | 160 | 31 | 0 |
| kowalskipartners.space (static) | 156 | 32 | 0 |

Brak regresji, fail2ban nas nie zablokował (whitelist), Traefik bez błędów.

### nikto -Tuning x6 (interesting)
- `Server: No banner retrieved` ✓ (header stripped)
- `NEXT_LOCALE without Secure flag` – informational, niesensitive cookie
- `Drupal Link header` – false positive (Next.js font preload)

---

## 5. Hardening matrix (po naprawach)

| Kontrola | Stan |
|---|---|
| ufw 22/80/443 only | ✅ |
| SSH pubkey-only, ed25519/chacha20, MaxAuthTries 3, AllowUsers ubuntu | ✅ |
| SSH banner DoD-style | ✅ |
| fail2ban sshd + recidive | ✅ (38 banned now) |
| auditd 10 watch rules + execve euid=0 | ✅ |
| sysctl hardening (syncookies, rp_filter, kptr_restrict, dmesg_restrict, ...) | ✅ |
| unattended-upgrades + auto-reboot 04:00 | ✅ |
| Docker daemon: no-new-privileges, ICC off, log rotation, userland-proxy=false | ✅ |
| Docker version pinned 28.5.2 | ✅ |
| Per-container read_only + tmpfs (gdzie możliwe) | ✅ (3/4 nginx + traefik + dekada72h; skytech wymaga RW przez Next.js standalone cache) |
| Per-container non-root user | ✅ (nextjs:1001 dla obu Next.js; nginx user dla 2 statyk) |
| HTTPS-only (HTTP→308) | ✅ |
| TLS 1.2+1.3 only, GCM+CHACHA only | ✅ |
| HSTS includeSubDomains | ✅ |
| **Content-Security-Policy** | ✅ **(nowe)** |
| **Cross-Origin-Opener-Policy / Resource-Policy** | ✅ **(nowe)** |
| X-Frame-Options DENY, X-Content-Type-Options nosniff | ✅ |
| Referrer-Policy strict-origin-when-cross-origin | ✅ |
| Permissions-Policy (camera, mic, geo, payment, usb) | ✅ |
| Server / X-Powered-By stripped | ✅ |
| **Rate-limit /api/auth/* (10/min)** | ✅ **(nowe)** |
| **Rate-limit /api/contact, /api/leads (30/min)** | ✅ **(nowe)** |
| **Honeypot + timestamp anti-spam** | ✅ **(nowe)** |
| **2FA disable wymaga password+TOTP** | ✅ **(nowe)** |
| Postgres tylko na private network skytech-internal | ✅ |
| Postgres random 31-char password | ✅ |
| acme.json mode 600, owned root | ✅ |

---

## 6. Pliki backupu (rollback)
Wszystkie pre-change configi zachowane na VPS:
```
/srv/_backups/audit-2026-05-01/
├── dynamic.yml.bak
├── skytech-compose.yml.bak
└── dekada72h-compose.yml.bak
```
Rollback dowolnego z nich: `sudo install -m 0644 /srv/_backups/audit-2026-05-01/<file>.bak /srv/<original-path>`. Traefik/docker zauważy zmianę (file watch / compose up).

---

## 7. Otwarte zalecenia (low priority)

1. **Reboot 6.8.0-110 → 6.8.0-111** zaplanowany automatycznie sob 2026-05-02 04:00 UTC. Po nim warto zrobić `apt autoremove --purge` żeby zdjąć kernel headers 110.
2. **Lynis index 76/100** – pojedyncze suggestions (nie krytyczne); pełny szczegół dostępny w `/var/log/lynis.log` na VPS. Można dążyć do 80+ przez: AIDE / file integrity, USB guard, fizyczna konsola password tym razem nie ma realnego sensu na VPS.
3. **Konsolidacja pre/post audit backups** w `/srv/_backups/` (`pre-audit-fix-2026-04-25/` z poprzedniego cyklu nadal tam siedzi – do usunięcia w przyszłym audycie po rok rolloff).
4. **Defense-in-depth rate-limit w aplikacji** – Traefik liczy per-IP, więc CDN / NAT może być obejściem. Dla wysokiej skali warto dodać per-user limit w samym Next.js (np. Upstash Redis sliding window).
5. **Zdjąć whitelist 185.72.186.36 z fail2ban** po zakończeniu testów (auto-resetuje się przy restarcie fail2bana lub po `fail2ban-client set sshd delignoreip 185.72.186.36`).
6. **HSTS preload** – dodać `stsPreload: true` dopiero po świadomej decyzji (preload list submission jest niewracalny).
7. **`/api/contact` honeypot** wymaga klienta (UI form) wysyłającego `website` + `ts`. Gdy ktoś wywoła endpoint z innego klienta bez tych pól, walidacja Zod przepuści (są optional) – ale brak `ts` znaczy że timestamp check jest pominięty. Akceptowalne (pierwsza linia obrony to ratelimit; honeypot to defense-in-depth dla form bots).

---

## 8. Narzędzia użyte
nmap 7.98 (`-Pn -T2 -T3 -p- --max-rate 50`), sslscan, nikto 2.1.5 (`-Tuning x6 -maxtime 60`), curl, ssh, ApacheBench (`ab -n 50 -c 5 -k`), `docker inspect`, `docker compose config/build/up`, postgres `psql`, `apt list --upgradable`, `dpkg -l`, lynis (audit system), git, gh, rsync, scp, fail2ban-client.

Wszystkie skany autoryzowane (assets własne audytora). IP audytora dodane do `fail2ban-client set sshd addignoreip 185.72.186.36` żeby skanowanie nie zablokowało dostępu.

---

## 9. Historia
- **2026-04-25** – pierwszy audyt cyklu. Naprawiono: `.claude/` w produkcji, brak globalnych security headers, server_tokens, TLS CBC ciphers, RW rootfs nginx. Wynik: 76→77 Lynis.
- **2026-05-01** – ten audyt. Naprawiono: brak CSP, 2FA-disable bez weryfikacji, brak rate-limit i honeypot, stare kernele. Wynik: utrzymanie postury 76 + zaadresowanie nowych vectorów.
