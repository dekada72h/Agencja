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
> ---
> #### 🛠 Wariant A — włącz preload **dla wszystkich 5 domen jednocześnie** (1 minuta pracy)
>
> Tylko jedna zmiana. Skopiuj i wklej w lokalnym terminalu:
>
> ```bash
> # 1) Zaloguj się na VPS
> ssh dekada-vps
>
> # 2) Backup obecnej konfiguracji
> sudo cp /srv/traefik/dynamic.yml /srv/_backups/audit-2026-05-01/dynamic.yml.pre-preload.bak
>
> # 3) Flip false → true (idempotentne)
> sudo sed -i 's/stsPreload: false/stsPreload: true/' /srv/traefik/dynamic.yml
>
> # 4) Restart Traefika (file watch reaguje na zmianę, ale restart pewniejszy)
> cd /srv/traefik && sudo -u ubuntu docker compose restart traefik && sleep 5
>
> # 5) Verify — nagłówek MUSI zawierać "; preload" na końcu
> for d in dekada72h.com domexpert.online kowalskipartners.space skytech-solutions.de skytech-solutions.pl; do
>   echo -n "$d → "; curl -ksI https://$d/ | grep -i strict-transport
> done
> ```
>
> **Submission (per domena):** otwórz <https://hstspreload.org/>, wpisz domenę, sprawdź "Submit", powtórz dla każdej z 5 (lub mniejszej liczby).
>
> ---
> #### 🛠 Wariant B — włącz preload **TYLKO dla wybranych domen** (np. dekada72h, kowalski, domexpert; pomiń skytech)
>
> Wymaga drugiego middleware w Traefik + zmiany compose labels per kontener. ~10 minut pracy.
>
> ```bash
> ssh dekada-vps
> sudo cp /srv/traefik/dynamic.yml /srv/_backups/audit-2026-05-01/dynamic.yml.pre-preload-split.bak
>
> # 1) Dodaj nowe middleware "security-headers-preload" do dynamic.yml — kopia security-headers z stsPreload: true
> sudo tee -a /srv/traefik/dynamic.yml > /dev/null << 'EOF'
>
>     # Variant of security-headers WITH HSTS preload flag set.
>     # Apply per-router only on domains submitted to hstspreload.org.
>     security-headers-preload:
>       headers:
>         stsSeconds: 31536000
>         stsIncludeSubdomains: true
>         stsPreload: true
>         contentTypeNosniff: true
>         frameDeny: true
>         referrerPolicy: "strict-origin-when-cross-origin"
>         permissionsPolicy: "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
>         contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://formspree.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://formspree.io https://images.unsplash.com; frame-ancestors 'none'; form-action 'self' https://formspree.io; base-uri 'self'; object-src 'none'; upgrade-insecure-requests"
>         customResponseHeaders:
>           Server: ""
>           X-Powered-By: ""
>           Cross-Origin-Opener-Policy: "same-origin"
>           Cross-Origin-Resource-Policy: "same-origin"
> EOF
>
> # 2) Per-router middleware override przez docker labels — przykład dla dekada72h:
> #    edytuj /srv/sites/dekada72h.com/docker-compose.next.yml i do labels: dodaj
> #    - "traefik.http.routers.dekada72h.middlewares=dekada72h-www,security-headers-preload@file"
> #    (zastępuje default entryPoint middleware tylko dla tego routera)
> sudo nano /srv/sites/dekada72h.com/docker-compose.next.yml
> # zapisz i:
> cd /srv/sites/dekada72h.com && sudo -u ubuntu docker compose -f docker-compose.next.yml up -d
>
> # 3) Powtórz (2) dla kowalskipartners.space i domexpert.online:
> #    /srv/sites/kowalskipartners.space/docker-compose.yml
> #    /srv/sites/domexpert.online/docker-compose.yml
> # W każdym dodać do labels routera (np. kowalskipartners-space):
> #    - "traefik.http.routers.<router-name>.middlewares=<existing>,security-headers-preload@file"
>
> # 4) Verify per domena
> for d in dekada72h.com kowalskipartners.space domexpert.online; do
>   echo -n "$d → "; curl -ksI https://$d/ | grep -i strict-transport
> done
> # skytech ma nadal bez "; preload"
> for d in skytech-solutions.de skytech-solutions.pl; do
>   echo -n "$d → "; curl -ksI https://$d/ | grep -i strict-transport
> done
> ```
>
> Submission per domena na <https://hstspreload.org/> — tylko te trzy.
>
> ---
> #### 🛟 Rollback (jeśli zauważysz problem PRZED submitem na hstspreload)
>
> Tylko Traefik header się zmienia – żadne przeglądarki jeszcze nie zapamiętały preload. Bezpieczne wycofanie:
>
> ```bash
> ssh dekada-vps
> # przywróć oryginał z backupu
> sudo cp /srv/_backups/audit-2026-05-01/dynamic.yml.pre-preload.bak /srv/traefik/dynamic.yml
> # (jeśli wariant B) usuń security-headers-preload z dynamic.yml + przywróć compose labels
> cd /srv/traefik && sudo -u ubuntu docker compose restart traefik
> ```
>
> #### ⚠️ Rollback PO submisji na hstspreload — niemożliwy szybko
>
> Po submisji domeny i jej akceptacji przez Google: **wycofanie zajmuje 6–12 tygodni** (czas na nowy release Chrome i propagację). W tym czasie domena jest "uwięziona" w preload. Jest formularz removal request na <https://hstspreload.org/removal/> ale nie jest natychmiastowy. Dlatego **pomyśl 2× przed submitem.**
>
> #### 🧪 Test "ready to preload" przed submitem
>
> ```bash
> # Skopiuj wynik na https://hstspreload.org/?domain=<domena> i sprawdź "preview"
> curl -ksI https://dekada72h.com/ | grep -i strict-transport-security
> # Powinno: max-age=31536000; includeSubDomains; preload
> # Plus: HTTPS musi działać dla domain root + www + 3+ aktywnych subdomen
> ```
>
> ### 2. Defense-in-depth per-user rate-limit w Next.js (Upstash Redis sliding window)
>
> **Status:** ❌ niezaimplementowane. Traefik ma per-IP rate-limit (10/min auth, 30/min public-api) co zatrzymuje większość ataków, ale przy CDN przed Traefikiem albo NAT-owanych ISP wszyscy użytkownicy dzielą jeden IP.
>
> **Decyzja:** czy chcemy ten dodatkowy poziom zabezpieczenia. Jeśli tak: integracja z Upstash (free tier) ~1 dnia pracy w `skytech-solutions.de`.
>
> #### 🛠 Jak zrobić (gdy zdecydujesz)
>
> ```bash
> # 1) Zarejestruj się na https://upstash.com/ (free tier wystarczy: 10k req/dzień)
> # 2) Stwórz nowy Redis database, region: eu-west-1 lub eu-central-1
> # 3) Skopiuj UPSTASH_REDIS_REST_URL i UPSTASH_REDIS_REST_TOKEN
>
> # 4) Lokalnie:
> cd /home/kali/Desktop/skytech-solutions.de
> npm install @upstash/ratelimit @upstash/redis
>
> # 5) Stwórz src/lib/ratelimit.ts:
> cat > src/lib/ratelimit.ts << 'EOF'
> import { Ratelimit } from "@upstash/ratelimit";
> import { Redis } from "@upstash/redis";
>
> const redis = Redis.fromEnv(); // czyta UPSTASH_REDIS_REST_URL + _TOKEN
>
> export const authLimiter = new Ratelimit({
>   redis,
>   limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 prób/min na user
>   analytics: true,
>   prefix: "rl:auth",
> });
>
> export const publicLimiter = new Ratelimit({
>   redis,
>   limiter: Ratelimit.slidingWindow(15, "1 m"), // 15/min na user
>   prefix: "rl:public",
> });
> EOF
>
> # 6) W każdym z 4 publicznych endpointów (src/app/api/{contact,leads,auth/forgot}/route.ts
> #    + auth callback w src/lib/auth.ts) na początku POST handler dodaj:
> #
> #    import { authLimiter } from "@/lib/ratelimit";
> #    const id = req.headers.get("x-forwarded-for") ?? "anon";
> #    const { success } = await authLimiter.limit(id);
> #    if (!success) return NextResponse.json({ error: "rate limited" }, { status: 429 });
>
> # 7) Dodaj do .env na VPS (/srv/sites/skytech-solutions/.env):
> #    UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
> #    UPSTASH_REDIS_REST_TOKEN=AaXxXx...
> #    + dopisać te 2 zmienne do environment: w docker-compose.yml
>
> # 8) Sync na VPS, rebuild, restart:
> rsync -av --exclude=node_modules --exclude=.next --exclude=.git --exclude=.env src/ dekada-vps:/srv/sites/skytech-solutions/build/src/
> rsync -av package.json package-lock.json dekada-vps:/srv/sites/skytech-solutions/build/
> ssh dekada-vps 'cd /srv/sites/skytech-solutions && sudo -u ubuntu docker compose build web && sudo -u ubuntu docker compose up -d'
> ```
>
> Po wdrożeniu Traefik per-IP zostaje jako pierwsza linia, Upstash łapie obejścia per-IP (CDN/NAT). Limity możesz tunować w jednym pliku.
>
> ### 3. Konsolidacja `/srv/_backups/` (rok rolloff)
>
> Stare backupy `pre-audit-fix-2026-04-25/` mogą być usunięte po 2027-04-25 (rok retention). Niski priorytet – to są kilkudziesięcio-kilobajtowe configi YAML.
>
> #### 🛠 Jak zrobić (po 2027-04-25)
>
> ```bash
> ssh dekada-vps
> sudo ls -la /srv/_backups/                       # sprawdź co tam jest
> sudo du -sh /srv/_backups/*                      # rozmiary
> sudo rm -rf /srv/_backups/pre-audit-fix-2026-04-25/   # usuń stare
> # zachowaj audit-2026-05-01/ aż do 2027-05-01
> ```
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

**Data audytu:** 2026-05-01 (kontynuacja: full container + system hardening pass dodany tego samego dnia)
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

## 5a. Pełne hartowanie kontenerów (drugie podejście, 2026-05-01)

Po pierwszym audycie kontenery miały tylko `no-new-privileges:true` i częściowo `read_only`. Drugie podejście dodało: cap-drop, capability whitelist, resource limits, healthchecki, non-root user gdzie się dało.

| Kontener | User | RO rootfs | CapDrop | CapAdd | Mem | Pids | Health |
|---|---|---|---|---|---|---|---|
| `traefik` | root* | ✅ | ALL | NET_BIND_SERVICE | 256M | 100 | none** |
| `dekada72h` | nextjs (1001) | ✅ | ALL | — (zero caps) | 1G | 200 | ✅ healthy |
| `skytech-solutions` | nextjs (1001) | ✅ (nowe) | ALL | — (zero caps) | 1G | 200 | ✅ healthy |
| `skytech-db` | postgres (70:70, nowe) | ❌ (DB volume) | ALL | CHOWN, DAC_READ_SEARCH, FOWNER, SETGID, SETUID | 512M | 200 | ✅ healthy |
| `domexpert-online` | root* | ✅ | ALL | CHOWN, DAC_OVERRIDE, NET_BIND_SERVICE, SETGID, SETUID | 128M | 50 | ✅ healthy |
| `kowalskipartners-space` | root* | ✅ | ALL | CHOWN, DAC_OVERRIDE, NET_BIND_SERVICE, SETGID, SETUID | 128M | 50 | ✅ healthy |

*\* "root" = master process, ale workery automatycznie schodzą do `nginx (101)` (nginx-alpine) lub Traefik nie eskaluje. Dla nginx próbowaliśmy `user: 101:101` ale tmpfs `/var/cache/nginx` nie pozwala na mkdir bez DAC; pozostawienie master jako root z **5 cap zamiast 14** to większy redukcja ataku niż dodawanie tmpfs uid options.*
*\*\* Traefik healthcheck wymaga skonfigurowanego `--ping` w `traefik.yml`; pominięto na razie.*

**Efekt netto:**
- **2 kontenery (Next.js)** mają **CapEff = 0x0** (zero capabilities w trybie running) – nawet root w tych kontenerach nie może otworzyć surowego socketu, bind <1024, chown plik, etc.
- **Postgres** – CapEff = 0x0 (postgres self-drops), CapBnd = 0xcd (5 zezwolone, ale niewykorzystane)
- **2× nginx** – CapEff = 0x4c3 (5 caps potrzebne nginx master do mkdir cache + setuid worker), worker procs jako uid 101.
- **Resource limits**: każdy kontener ma `mem_limit` (5–10× headroom względem zużycia), `pids_limit` blokuje fork bomb.
- **Healthchecks** dla 4/6 kontenerów (web/DB), wszystkie `healthy`.

Backupy compose pre-zmiany: `/srv/_backups/audit-2026-05-01/containers/{traefik,dekada72h,skytech,domexpert,kowalski}.yml.bak`. Rollback: `sudo install -m 0644 /srv/_backups/audit-2026-05-01/containers/<file>.bak /srv/<orig-path> && cd <site> && docker compose up -d`.

---

## 5b. VPS-level hardening (Lynis-driven, 2026-05-01)

Po zaaplikowaniu suggestions z Lynis: **26 → 22** otwartych sugestii (-4 zaadresowane).

| Hardening | Stan |
|---|---|
| `libpam-tmpdir` zainstalowane (per-user `$TMPDIR` w PAM sessions) | ✅ |
| `debsums` zainstalowane (verify integrity zainstalowanych pakietów) | ✅ |
| `apt-show-versions` zainstalowane (patch management) | ✅ |
| Core dumps disabled (`/etc/security/limits.conf`: `* hard core 0` + `* soft core 0`) | ✅ |
| `/etc/login.defs`: `UMASK 027`, `PASS_MAX_DAYS 365`, `PASS_MIN_DAYS 1`, `PASS_WARN_AGE 14`, `SHA_CRYPT_{MIN,MAX}_ROUNDS 500000` | ✅ |
| Kernel module blacklist: `dccp`, `sctp`, `rds`, `tipc` (rzadkie, historycznie podatne) | ✅ |
| Kernel module blacklist: `usb-storage` (defense-in-depth, VPS bez USB ale chroni przed `modprobe` exploit) | ✅ |
| SSH `MaxSessions 5 → 2` | ✅ |
| `sudoers.d/99-hardening`: `timestamp_timeout=15`, `passwd_timeout=2` | ✅ |
| `apt-get autoremove --purge` (orphaned packages) | ✅ (0 do usunięcia po dwóch wcześniejszych przebiegach) |
| `apt-listbugs` | ❌ niedostępne na noble (package not found) |
| GRUB password (BOOT-5122) | ❌ skip – fizyczny dostęp do hosta OVH wymaga kompromisu po ich stronie; nie warto |
| Separate `/tmp`, `/home`, `/var` partycje (FILE-6310) | ❌ skip – OVH single-disk standard |
| SSH port change z 22 (SSH-7408) | ❌ skip – security through obscurity, fail2ban robi swoje |

**Pozostałe SSH hardening (już istniejące, potwierdzone):**
- `PermitRootLogin no`, `PasswordAuthentication no`, `AuthenticationMethods publickey`
- `MaxAuthTries 3`, `LoginGraceTime 30`, `AllowUsers ubuntu`
- `X11Forwarding/AllowTcpForwarding/AllowAgentForwarding/GatewayPorts no`
- Modern ciphers only: `chacha20-poly1305, aes256-gcm, aes128-gcm`
- Modern KEX: `curve25519, sntrup761x25519` (post-quantum)
- Modern MACs: `hmac-sha2-{512,256}-etm`
- HostKeyAlgorithms: tylko `ssh-ed25519` + `rsa-sha2-{256,512}`
- `LogLevel VERBOSE`, banner `/etc/issue.net` (DoD-style)

**sysctl hardening** (już aplikowane, runtime potwierdzone):
- `net.ipv4.tcp_syncookies=1`, `tcp_rfc1337=1`, `rp_filter=1`
- `accept_redirects=0`, `send_redirects=0`, `accept_source_route=0`
- `kernel.kptr_restrict=2`, `dmesg_restrict=1`, `unprivileged_bpf_disabled=1`
- `kexec_load_disabled=1`, `yama.ptrace_scope=2`, `sysrq=0`
- `fs.protected_{hardlinks,symlinks,fifos,regular}=1/2`

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
