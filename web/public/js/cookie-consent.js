(function() {
    'use strict';

    var GA_ID = 'G-DX7YV492B7';

    var translations = {
        pl: {
            text: 'Ta strona używa plików cookie, w tym Google Analytics, do analizy ruchu. Korzystając z witryny, możesz wyrazić zgodę na ich użycie.',
            accept: 'Akceptuję',
            reject: 'Odrzucam',
            policy: 'Polityka prywatności'
        },
        en: {
            text: 'This site uses cookies, including Google Analytics, to analyze traffic. By using the site, you can consent to their use.',
            accept: 'Accept',
            reject: 'Reject',
            policy: 'Privacy Policy'
        },
        de: {
            text: 'Diese Website verwendet Cookies, einschließlich Google Analytics, zur Verkehrsanalyse. Durch die Nutzung der Website können Sie deren Verwendung zustimmen.',
            accept: 'Akzeptieren',
            reject: 'Ablehnen',
            policy: 'Datenschutzrichtlinie'
        }
    };

    function getLang() {
        var lang = localStorage.getItem('lang') || 'pl';
        return translations[lang] ? lang : 'pl';
    }

    function getPrivacyPath() {
        var path = window.location.pathname;
        if (path.indexOf('/blog/') !== -1) return '../privacy.html';
        if (path.indexOf('/portfolio/') !== -1) return '../../privacy.html';
        return 'privacy.html';
    }

    function loadGA() {
        if (document.getElementById('gtag-script')) return;
        var s = document.createElement('script');
        s.id = 'gtag-script';
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_ID);
    }

    function injectStyles() {
        var style = document.createElement('style');
        style.textContent =
            '#cookie-consent-banner{' +
                'position:fixed;bottom:0;left:0;right:0;z-index:10000;' +
                'background:var(--dark-lighter,#1e293b);' +
                'color:var(--white,#fff);' +
                'padding:20px 24px;' +
                'box-shadow:var(--shadow-xl,0 -4px 20px rgba(0,0,0,0.3));' +
                'font-family:var(--font-primary,Inter,-apple-system,sans-serif);' +
                'transform:translateY(100%);' +
                'transition:transform 0.4s ease;' +
            '}' +
            '#cookie-consent-banner.cc-visible{transform:translateY(0);}' +
            '#cookie-consent-banner.cc-hidden{transform:translateY(100%);}' +
            '.cc-inner{' +
                'max-width:var(--container-max,1200px);margin:0 auto;' +
                'display:flex;align-items:center;gap:20px;flex-wrap:wrap;' +
            '}' +
            '.cc-text{flex:1;min-width:280px;font-size:14px;line-height:1.6;color:var(--gray-300,#d1d5db);}' +
            '.cc-text a{color:var(--primary-light,#818cf8);text-decoration:underline;}' +
            '.cc-text a:hover{color:var(--primary,#6366f1);}' +
            '.cc-buttons{display:flex;gap:10px;flex-shrink:0;}' +
            '.cc-btn{' +
                'padding:10px 24px;border-radius:var(--radius-lg,12px);' +
                'font-size:14px;font-weight:600;cursor:pointer;' +
                'transition:all var(--transition-fast,0.2s ease);border:none;' +
            '}' +
            '.cc-btn-accept{' +
                'background:var(--gradient-primary,linear-gradient(135deg,#6366f1,#0ea5e9));' +
                'color:#fff;' +
            '}' +
            '.cc-btn-accept:hover{opacity:0.9;transform:translateY(-1px);}' +
            '.cc-btn-reject{' +
                'background:transparent;color:var(--gray-300,#d1d5db);' +
                'border:1px solid var(--gray-600,#4b5563) !important;' +
            '}' +
            '.cc-btn-reject:hover{border-color:var(--gray-400,#9ca3af) !important;color:#fff;}' +
            '@media(max-width:600px){' +
                '.cc-inner{flex-direction:column;text-align:center;}' +
                '.cc-buttons{width:100%;justify-content:center;}' +
            '}';
        document.head.appendChild(style);
    }

    function createBanner() {
        var lang = getLang();
        var t = translations[lang];
        var banner = document.getElementById('cookie-consent-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'cookie-consent-banner';
            document.body.appendChild(banner);
        }
        banner.innerHTML =
            '<div class="cc-inner">' +
                '<div class="cc-text">' +
                    t.text + ' ' +
                    '<a href="' + getPrivacyPath() + '">' + t.policy + '</a>' +
                '</div>' +
                '<div class="cc-buttons">' +
                    '<button class="cc-btn cc-btn-reject" id="cc-reject">' + t.reject + '</button>' +
                    '<button class="cc-btn cc-btn-accept" id="cc-accept">' + t.accept + '</button>' +
                '</div>' +
            '</div>';
        return banner;
    }

    function showBanner() {
        var banner = createBanner();
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                banner.classList.add('cc-visible');
            });
        });

        document.getElementById('cc-accept').addEventListener('click', function() {
            localStorage.setItem('cookie_consent', 'accepted');
            hideBanner(banner);
            loadGA();
        });

        document.getElementById('cc-reject').addEventListener('click', function() {
            localStorage.setItem('cookie_consent', 'rejected');
            hideBanner(banner);
        });
    }

    function hideBanner(banner) {
        banner.classList.remove('cc-visible');
        banner.classList.add('cc-hidden');
        setTimeout(function() {
            if (banner.parentNode) banner.parentNode.removeChild(banner);
        }, 500);
    }

    function init() {
        var consent = localStorage.getItem('cookie_consent');
        if (consent === 'accepted') {
            loadGA();
            return;
        }
        if (consent === 'rejected') {
            return;
        }
        injectStyles();
        if (document.body) {
            showBanner();
        } else {
            document.addEventListener('DOMContentLoaded', showBanner);
        }
    }

    // Listen for language switches to update banner text
    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.lang-btn');
        if (btn && document.getElementById('cookie-consent-banner')) {
            setTimeout(function() {
                createBanner();
            }, 50);
        }
    });

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
