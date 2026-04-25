# Dekada72H — Agencja Marketingowa

```
██████╗ ███████╗██╗  ██╗ █████╗ ██████╗  █████╗     ███████╗██████╗ ██╗  ██╗
██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██╔══██╗██╔══██╗    ╚════██║╚════██╗██║  ██║
██║  ██║█████╗  █████╔╝ ███████║██║  ██║███████║        ██╔╝ █████╔╝███████║
██║  ██║██╔══╝  ██╔═██╗ ██╔══██║██║  ██║██╔══██║       ██╔╝ ██╔═══╝ ██╔══██║
██████╔╝███████╗██║  ██╗██║  ██║██████╔╝██║  ██║       ██║  ███████╗██║  ██║
╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝       ╚═╝  ╚══════╝╚═╝  ╚═╝

╔══════════════════════════════════════════════════════════════════════╗
║                        ★  RESTRICTED SYSTEM  ★                       ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  This is a private computing system. It is for authorized use only.  ║
║  Users (authorized or unauthorized) have NO explicit or implicit     ║
║  expectation of privacy.                                              ║
║                                                                      ║
║  Any or all uses of this system and all files on this system may be  ║
║  intercepted, monitored, recorded, copied, audited, inspected, and   ║
║  disclosed to authorized site personnel and law enforcement.         ║
║                                                                      ║
║  By using this system, the user consents to such interception,       ║
║  monitoring, recording, copying, auditing, inspection, and           ║
║  disclosure at the discretion of authorized personnel.               ║
║                                                                      ║
║  Unauthorized or improper use of this system may result in           ║
║  administrative disciplinary action and civil and criminal           ║
║  penalties. By continuing to use this system you indicate your       ║
║  awareness of and consent to these terms and conditions of use.      ║
║                                                                      ║
║  LOG OFF IMMEDIATELY if you do not agree to the conditions stated.   ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

Statyczna strona internetowa agencji marketingowej **Dekada72H** z Wrocławia oraz infrastruktura hostingowa pod własne i klienckie strony WWW.

---

## 🏆 Case Study — Dekada72H: Strona agencji + multi-domain hosting infrastruktury

### O projekcie

Dekada72H to wrocławska agencja marketingowa, która chciała mieć nie tylko własną wizytówkę online, lecz pełnię kontroli nad całą warstwą hostingu — zarówno dla siebie, jak i dla swoich klientów. Zamiast wynajmować shared hosting, postanowiliśmy zbudować **własną infrastrukturę VPS** zdolną serwować dowolną liczbę domen klienckich z poziomu jednego, hardenowanego serwera.

### Wyzwanie

Klient miał konkretną wizję: **jedna platforma**, która obsłuży zarówno stronę agencji, jak i wszystkie strony klientów — szybko, bezpiecznie i bez kosztów platform hostingowych. System musiał być:

- **Wielojęzyczny** — obsługa klientów polskich i międzynarodowych (PL/EN) z runtime language switcherem
- **SEO-ready** — kompletne schema markup, sitemap, alt texts, hreflang
- **RODO-compliant** — banner zgody cookies blokujący Google Analytics przed akceptacją
- **Skalowalny** — możliwość dorzucenia kolejnej domeny w 60 sekund (skrypt bootstrappujący)
- **Bezpieczny** — hardening klasy enterprise (audyt zewnętrzny + remediation)
- **Samodzielny** — pełna kontrola nad serwerem, brak zewnętrznych dependency

### Rozwiązanie

Zaprojektowano i wdrożono kompletny ekosystem składający się z trzech warstw:

#### 🌐 Strona agencji — Dekada72H.com

Statyczna, dwujęzyczna strona z hero, sekcjami o nas, usługach, portfolio (9 realizacji), blogu (11 wpisów z pełnym schema Article/FAQ/Breadcrumb), narzędziami (kalkulatory dla klientów), formularzem kontaktowym (Formspree), niche landing page dla kancelarii prawnych z Wrocławia, custom 404, banerem zgody RODO i mechanizmem language switching opartym na `data-i18n`. Wszystkie strony portfolio to **multi-page mini-sites** z własnym arkuszem CSS — każda realizacja prezentowana jak osobny projekt produkcyjny.

#### 🖥️ VPS Infrastructure — Traefik + Docker

Własny serwer OVH (Ubuntu 24.04) z reverse proxy **Traefik v3.5**, automatycznym wystawianiem certyfikatów Let's Encrypt (ACME http-01), pojedynczą siecią Docker `web` i jednolitym wzorcem deploy'u: jeden katalog `/srv/sites/<domain>/`, jeden `docker-compose.yml`, jeden kontener nginx:alpine na domenę. Skrypt `sudo /srv/new-site.sh <domain>` bootstrapuje nową stronę w **60 sekund** — od katalogu po działający HTTPS. Backupy daily/weekly/monthly per domena.

#### 🔒 Hardening warstwa — pełne security baseline

Pełny audyt zewnętrzny i remediation (zob. `SECURITY-AUDIT.md`): UFW restrict do 22/80/443, fail2ban z sshd + recidive jail, SSH key-only z dedykowanym kluczem `kali@dekada72h` (ed25519, `AuthenticationMethods publickey`), banner `/etc/issue.net` z DoD-style restricted-system formula, kernel sysctl hardening (rp_filter, syncookies, kptr_restrict, unprivileged_bpf_disabled, …), auditd z 10 watch rules, unattended-upgrades z auto-reboot, Docker daemon `no-new-privileges` + `icc=false` + log rotation, kontenery z `read_only: true` + tmpfs + `no-new-privileges`, Traefik middleware z security headers (HSTS, X-Frame DENY, nosniff, Referrer-Policy, Permissions-Policy), TLS 1.2+1.3 z GCM/CHACHA tylko (CBC dropped), dotfile deny przez nginx + `server_tokens off`, Docker pin 28.5.2 (`apt-mark hold` — 29.x łamie Traefika).

### Wyzwania techniczne, które pokonaliśmy

**Multi-domain hosting bez kompromisu na bezpieczeństwo** — Konfiguracja Traefika tak, by każda domena miała własny kontener nginx, izolowany webroot, izolowane logi, ale współdzielił certificate resolver, security middleware i sieć. Wszystko z poziomu jednego pliku `traefik.yml` + `dynamic.yml` + per-site labels.

**Skrypt bootstrap one-liner** — `/srv/new-site.sh` tworzy strukturę katalogów, generuje docker-compose z poprawnym Host rule + www-redirect middleware + cert resolver, wgrywa szablon nginx, montuje shared security config, podnosi kontener i automatycznie wystawia certyfikat. **Czas dodania nowej domeny: ~60 sekund**.

**Audyt bezpieczeństwa zewnętrzny + auto-remediation** — Pełny audyt z poziomu Kali Linux (nmap full-port + UDP, sslscan, nikto, manual recon) ujawnił 2 znaleziska MEDIUM (info disclosure przez `.claude/` directories, brak security headers) i 4 LOW. Wszystkie naprawione w jednej sesji, zweryfikowane zewnętrznie i udokumentowane.

**Docker 29.x compatibility issue** — `apt upgrade` w trakcie remediation podbił Docker do 29.4.1, co rozłożyło Traefika (client API mismatch). Diagnoza w 5 minut, downgrade do 28.5.2 + `apt-mark hold` jako trwała ochrona, dokumentacja w VPS notes żeby nie powtórzyć.

**SSH key hygiene** — Wymiana wspólnego dla wielu VPS klucza ed25519 na dedykowany `kali@dekada72h`, usunięcie nieaktywnych wpisów z `authorized_keys`, naprawa konfliktu drop-inów sshd (50-cloud-init.conf override'ował hardening) — wszystko z testami, że kolejne logowanie nadal przechodzi.

### Rezultaty

- **5 produkcyjnych domen** na jednym VPS — `dekada72h.com`, `domexpert.online`, `kowalskipartners.space`, `skytech-solutions.de`, `skytech-solutions.pl`
- **9 portfolio realizacji** w stylu multi-page mini-sites (BellaVista, BudMaster, FitPro, Glamour-Beauty, MediCare-Plus, PetZone, PrintMaster, ToyLand, Katarzyna-Schwenk)
- **11 wpisów blogowych** z pełnym schema Article/FAQ/Breadcrumb i Related Articles
- **Pełen security baseline** — audyt + remediation + walidacja zewnętrzna (zob. `SECURITY-AUDIT.md`)
- **Tylko 22/80/443** otwarte, modern TLS, zero info-disclosure paths
- **5 certyfikatów Let's Encrypt** auto-odnawianych przez Traefika
- **2 jails fail2ban** aktywnie blokujące SSH brute-force (39 banów teraz, 120 lifetime)
- **6 GB RAM headroom** — kontenery zjadają łącznie ~37 MiB
- **3.9 GB / 72 GB** dysku — masa miejsca na kolejne domeny i blog content
- **Lynis hardening index 77/100** — zweryfikowany lokalny baseline
- **Custom skill `/blog-seo`** — 5 akcji do zarządzania zawartością blogową (new, related, alts, links, audit)
- **Niche landing pages** — dedykowana podstrona pod kancelarie z Wrocławia z Service/FAQ/Breadcrumb schemas

### Stack technologiczny

HTML5 · CSS3 · Vanilla JavaScript · Google Analytics 4 (cookie-consent gated) · Formspree · Cloudflare-style `_headers` · GitHub Actions deployment · Ubuntu 24.04 LTS · Docker 28.5.2 (pinned) · Traefik v3.5 · nginx:alpine · Let's Encrypt ACME · UFW · fail2ban · auditd · sysctl hardening · Lynis · Kali Linux (audit toolchain)

---

## 💰 Wycena i wartość rynkowa

### Szacunkowa wartość projektu (strona + infra + hardening): **45 000 – 70 000 PLN**

Wycena oparta na analizie zakresu, złożoności i stawek rynkowych w Polsce (2025/2026):

| Moduł | Szacunkowy koszt |
|-------|------------------|
| **Strona agencji** (multi-page, 2 języki, schema markup, blog engine, niche landing page, RODO consent, custom 404) | 12 000 – 18 000 PLN |
| **9 realizacji portfolio** (multi-page mini-sites, każda z własnym arkuszem CSS i unikalnym designem) | 14 000 – 22 000 PLN |
| **11 wpisów blogowych z SEO** (schema Article/FAQ/Breadcrumb, OG tags, alt texts, related articles, custom skill `/blog-seo`) | 5 000 – 8 000 PLN |
| **Infrastruktura VPS** (Traefik + Docker, multi-domain auto-cert, bootstrap script `new-site.sh`, backupy daily/weekly/monthly) | 8 000 – 12 000 PLN |
| **Hardening + audyt bezpieczeństwa** (UFW, fail2ban, SSH key-only, sysctl, auditd, container hardening, security headers, audyt zewnętrzny + remediation, dokumentacja) | 6 000 – 10 000 PLN |

### Kontekst rynkowy

- Strona agencji marketingowej w software house: **15 000 – 30 000 PLN**
- Multi-domain hosting setup z reverse proxy + cert auto-renewal: **5 000 – 10 000 PLN**
- Pełen audyt bezpieczeństwa serwera (zewnętrzny pentest + remediation): **8 000 – 15 000 PLN**
- Statyczne strony portfolio prezentujące realizacje: **1 500 – 2 500 PLN/szt.** w software house
- Custom CMS-less blog engine z pełnym schema markup: **8 000 – 12 000 PLN**

### Co wpływa na wartość

- **Self-hosting** — brak kosztów Vercel/Netlify, pełna kontrola nad warstwą serwera
- **Skalowalność hostingu** — `new-site.sh` pozwala dodawać kolejne domeny w 60 sekund
- **Bezpieczeństwo zweryfikowane zewnętrznie** — pełen audit + remediation + walidacja narzędziami (nmap, sslscan, nikto)
- **Zero zewnętrznych zależności CMS** — strona statyczna, brak vendor lock-in
- **SEO-ready out of the box** — schema markup, sitemap, hreflang, alt texts, niche landing pages
- **Multi-tenant capacity** — ten sam VPS hostuje stronę agencji + 4 strony klientów bez konfliktów

> 💡 **Podsumowanie:** Dekada72H to nie tylko strona internetowa agencji — to kompletna infrastruktura hostingowa multi-domain z hardenowanym VPS, własnym skryptem bootstrappującym kolejne strony, pełnym audytem bezpieczeństwa i 9 multi-page realizacjami portfolio prezentującymi możliwości firmy. Wartość rynkowa **45 000 – 70 000 PLN**, niski koszt utrzymania (~50 PLN/msc za VPS OVH), pełna własność stosu.

---

## Technologie

- **HTML5 + CSS3 + Vanilla JS** — statyczne strony, bez frameworka, maksymalna szybkość
- **Schema.org JSON-LD** — LocalBusiness, Article, FAQ, Breadcrumb, Service
- **Google Analytics 4** — `G-DX7YV492B7` ładowane warunkowo przez `cookie-consent.js`
- **Formspree** — backend formularza kontaktowego (`xlgneypa`)
- **Custom i18n** — `data-i18n` attributes + `translations.js` (PL/EN runtime switching)
- **Docker 28.5.2 (pinned)** — produkcja: 5 kontenerów (1 traefik + 4 nginx:alpine)
- **Traefik v3.5** — reverse proxy + ACME http-01 + security headers middleware
- **Let's Encrypt R12** — auto-renewal ~30 dni przed wygaśnięciem
- **Ubuntu 24.04 LTS** — host OS z auditd, fail2ban, UFW, unattended-upgrades

## Struktura Projektu

```
Agencja/
├── index.html                  # Strona główna (hero, usługi, sekcje, CTA)
├── about.html                  # O agencji
├── services.html               # Usługi (z opisami pakietów)
├── portfolio.html              # Lista 9 realizacji + filtr "Sztuka"
├── contact.html                # Formularz kontaktowy + dane firmy
├── tools.html                  # Darmowe narzędzia / kalkulatory
├── blog.html                   # Lista wpisów blogowych
├── privacy.html, terms.html    # RODO / regulamin
├── 404.html                    # Custom error page (noindex)
├── strony-internetowe-dla-kancelarii-wroclaw.html  # Niche landing page
│
├── blog/                       # 11 wpisów blogowych
│   ├── marketing-internetowy-wroclaw.html         # Template referencyjny
│   ├── seo-dla-malych-firm.html
│   ├── google-ads-vs-facebook-ads.html
│   ├── content-marketing-praktyczny-poradnik.html
│   ├── strona-internetowa-dla-firmy-2026.html
│   ├── linkedin-dla-firm-b2b.html
│   ├── email-marketing-zwiekszenie-sprzedazy.html
│   ├── analityka-internetowa-google-analytics-4.html
│   ├── lokalne-pozycjonowanie-google-moja-firma.html
│   ├── instagram-marketing-2026.html
│   └── tiktok-marketing-dla-firm.html
│
├── portfolio/                  # 9 realizacji jako multi-page mini-sites
│   ├── BellaVista/             # Restauracja
│   ├── BudMaster/              # Firma budowlana
│   ├── FitPro/                 # Studio fitness
│   ├── Glamour-Beauty/         # Salon kosmetyczny (multi-page, własny CSS)
│   ├── MediCare-Plus/          # Klinika medyczna (multi-page, własny CSS)
│   ├── PetZone/                # Sklep zoologiczny (multi-page, własny CSS)
│   ├── PrintMaster/            # Drukarnia (multi-page, własny CSS)
│   ├── ToyLand/                # Sklep z zabawkami (multi-page, własny CSS)
│   └── Katarzyna-Schwenk/      # Strona artystki (multi-page, art-gallery aesthetic)
│
├── css/style.css               # Główny arkusz stylów
├── js/
│   ├── cookie-consent.js       # GDPR banner + GA gating
│   ├── lang-switcher.js        # PL/EN runtime switching
│   ├── translations.js         # Słownik tłumaczeń (~253 KB)
│   ├── contact-form.js         # Formspree integration + validation
│   ├── main.js                 # Animacje, fade-in, mobile menu
│   ├── portfolio.js            # Filtry portfolio
│   ├── services.js             # Tabsy w sekcji usług
│   ├── calculator.js           # Kalkulatory na tools.html
│   ├── accessibility.js        # A11y enhancements
│   └── landing-faq.js          # FAQ accordion
│
├── sitemap.xml                 # Pełna mapa strony (wszystkie URL)
├── robots.txt                  # Disallow privacy/terms (no SEO value)
├── _headers                    # Security headers (Cloudflare-style; produkcyjnie przez Traefik)
├── CNAME                       # dekada72h.com
│
├── .claude/commands/blog-seo.md  # Custom skill: new/related/alts/links/audit
│
├── README.md                   # Ten plik
└── SECURITY-AUDIT.md           # Pełen raport audytu (2026-04-25)
```

## Funkcjonalności

### Strona publiczna (`/`)

- Hero z CTA, sekcje "O nas", "Usługi", "Portfolio preview", "Blog preview", "Kontakt CTA"
- Bilingual (PL/EN) z runtime switcherem na każdej podstronie
- Custom 404 z noindex i powrotem do home
- RODO cookie consent banner blokujący GA4 do akceptacji
- Sticky nav z mobile burger menu
- Smooth scroll, fade-in animations, scroll-spy nav highlighting

### Blog (`/blog/*.html`)

- 11 wpisów z pełnym schema Article + FAQ + Breadcrumb
- Open Graph + Twitter Card meta na każdym wpisie
- Related Articles section (3-4 powiązane wpisy per post)
- Inline `<style>` z custom CSS components per artykuł (cytaty, tipy, ostrzeżenia)
- Daty: DD.MM.YYYY w HTML, YYYY-MM-DD w schema/sitemap
- Internal linking między wpisami + cross-link do niche landing page

### Niche Landing Page — kancelarie prawne

- `strony-internetowe-dla-kancelarii-wroclaw.html` — dedykowana landing pod long-tail keywords
- Service + FAQ + Breadcrumb schemas
- 7+ internal links do blog posts
- 3 wpisy blogowe linkują z powrotem (cross-linking)

### Portfolio (`/portfolio.html`)

- 9 realizacji w 4 kategoriach: Strona WWW, Landing Page, Redesign, Sztuka
- Filtry kategorii (JS-based bez przeładowania)
- Każda realizacja jako multi-page mini-site (3-6 podstron, własny arkusz CSS)
- Specjalna karta dla `Katarzyna-Schwenk` z badge'em "Pokaz portfolio · subdomena Dekada72H" (bez własnej domeny)
- Sticky banner powrotu na każdej podstronie portfolio bez własnej domeny

### Narzędzia (`/tools.html`)

- Kalkulator wyceny strony WWW
- Kalkulator ROI marketingu
- Inne pomocnicze narzędzia dla klientów

### Custom skill `/blog-seo`

`.claude/commands/blog-seo.md` — automatyzacja zarządzania blogiem:

- `/blog-seo new <slug>` — tworzy nowy wpis z template'u + dodaje do `blog.html` + `sitemap.xml`
- `/blog-seo related` — aktualizuje sekcje Related Articles we wszystkich wpisach
- `/blog-seo alts` — sprawdza i poprawia alt texts obrazków
- `/blog-seo links` — wykrywa broken internal links
- `/blog-seo audit` — pełen audyt SEO (schema, meta, alt, sitemap consistency)

---

## VPS Deployment

### Architektura

```
                   Internet
                      │
              ┌───────▼───────┐
              │   UFW (22/80/443)
              └───────┬───────┘
                      │
              ┌───────▼───────┐
              │  Traefik v3.5  │  ◄── ACME (Let's Encrypt)
              │  reverse proxy │  ◄── security-headers middleware
              └───────┬───────┘  ◄── tls.options (GCM/CHACHA only)
            ┌─────────┼─────────┬──────────────┐
            │         │         │              │
        ┌───▼──┐  ┌──▼──┐  ┌──▼──┐  ┌────────▼──────┐
        │dekada│  │dom-  │  │kow- │  │skytech (.de+ │
        │72h   │  │expert│  │alski│  │ .pl, 1 cont.)│
        └──────┘  └─────┘  └─────┘  └──────────────┘
```

### Bootstrap nowej domeny

```bash
# Z poziomu VPS — dodaje domenę w ~60 sekund
sudo /srv/new-site.sh nowa-domena.pl
```

Skrypt tworzy `/srv/sites/nowa-domena.pl/{html,logs}`, generuje docker-compose z Traefik labels, podnosi kontener nginx i Traefik automatycznie żąda certyfikatu Let's Encrypt.

### Deploy contentu (z lokala)

```bash
# Synchronizacja zawartości na VPS przez rsync
rsync -avz --delete portfolio/ dekada-vps:/srv/sites/dekada72h.com/html/portfolio/

# lub konkretny plik
rsync -avz portfolio.html sitemap.xml dekada-vps:/tmp/stage/
ssh dekada-vps 'sudo cp /tmp/stage/* /srv/sites/dekada72h.com/html/'
```

### Backup — automatyczny daily/weekly/monthly

`/srv/scripts/backup-sites.sh` przez `/etc/cron.d/site-backups`:

- **Daily** — `dekada72h.com` (retention 14 dni)
- **Weekly** — `dekada72h.com` (retention 8 tygodni)
- **Monthly** — wszystkie strony + Traefik + acme.json (retention 12 miesięcy)
- Lokalizacja: `/var/backups/sites/{daily,weekly,monthly}/`

---

## 🔒 Bezpieczeństwo

Pełen audyt zewnętrzny + remediation udokumentowany w **[`SECURITY-AUDIT.md`](./SECURITY-AUDIT.md)**.

### Hardening — co działa

- ✅ UFW: tylko 22/80/443 in
- ✅ SSH: key-only ed25519, `AuthenticationMethods publickey`, `AllowUsers ubuntu`, dedykowany klucz `kali@dekada72h`
- ✅ fail2ban: sshd jail + recidive jail (39 IP banned now, 120 lifetime)
- ✅ sysctl hardening: rp_filter, syncookies, kptr_restrict=2, dmesg_restrict=1, unprivileged_bpf_disabled=1, kexec_load_disabled=1, protected_hardlinks/symlinks
- ✅ auditd: 10 watch rules na passwd/shadow/sudoers/sshd/traefik
- ✅ unattended-upgrades z auto-reboot 04:00
- ✅ Docker daemon: `no-new-privileges=true`, `userland-proxy=false`, `live-restore=true`, `icc=false`, log rotation 10m × 3
- ✅ Containers: `read_only=true`, `no-new-privileges=true`, tmpfs for `/var/cache/nginx`, `/var/run`, `/tmp`
- ✅ Traefik middleware: HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy
- ✅ TLS: 1.2+1.3 only, GCM/CHACHA20 cipher suites, CBC dropped, post-quantum X25519MLKEM768 group
- ✅ Server header stripped, `server_tokens off`, dotfile paths → 404
- ✅ HTTP→HTTPS redirect (308) na wszystkich domenach
- ✅ Tylko `GET` returns 200 — pozostałe metody → 405
- ✅ Docker pinned 28.5.2 (`apt-mark hold` — 29.x łamie Traefika)
- ✅ Lynis hardening index: **77/100**

### Audyt zewnętrzny

Z poziomu Kali Linux:

- **nmap** full TCP + top-50 UDP — tylko 22/80/443 reachable
- **sslscan** — wszystkie ciphers grade A
- **nikto** — brak istotnych findings po remediation
- **manual recon** — `.env`, `.git`, `.htaccess`, `wp-admin`, `server-status`, `.DS_Store`, `backup.zip` → wszystkie 404
- **Form-method enumeration** — POST/PUT/DELETE/OPTIONS/TRACE/PATCH → 405

---

# 🖥️ Stan VPS — Dekada72H Infrastructure

> **Snapshot:** **2026-04-25**
> **Host:** `vps-dae43f65` · `51.83.161.122` (OVH)
> **SSH alias:** `dekada-vps` (key-only, ed25519, `kali@dekada72h`)

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

## Operational notes

- **Do NOT** unhold docker — `apt upgrade` to 29.x will break Traefik (client API mismatch). Documented in VPS notes; the hold is the safety net.
- TLS auto-renew: monitor `/srv/traefik/logs/traefik.log` for `letsencrypt` errors; rate limit is 5 failed validations/hour/identifier.
- Backups: daily site backups → `/var/backups/sites/{daily,weekly,monthly}` via `/srv/scripts/backup-sites.sh` cron.
- Pre-audit-fix configs preserved in `/srv/_backups/pre-audit-fix-2026-04-25/`.

---

*Stan VPS to snapshot z dnia podanego wyżej. Aktualizacja po zmianach infrastrukturalnych lub na żądanie. Pełen raport audytu bezpieczeństwa: [`SECURITY-AUDIT.md`](./SECURITY-AUDIT.md).*
