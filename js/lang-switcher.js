/* ============================================
   LANGUAGE SWITCHER
   ============================================ */
const LangSwitcher = {
    currentLang: 'pl',
    STORAGE_KEY: 'lang',

    init() {
        // One-time reset: clear stale language from old testing sessions
        // Remove this block after first deploy to production
        if (!localStorage.getItem('lang_v2')) {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.setItem('lang_v2', '1');
        }
        this.currentLang = localStorage.getItem(this.STORAGE_KEY) || 'pl';
        this.updateHtmlLang();
        this.updateToggleUI();
        this.applyTranslations();
        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                if (lang && lang !== this.currentLang) {
                    this.setLanguage(lang);
                }
            });
        });
    },

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem(this.STORAGE_KEY, lang);
        this.updateHtmlLang();
        this.updateToggleUI();
        this.applyTranslations();
    },

    applyTranslations() {
        if (typeof TRANSLATIONS === 'undefined') return;

        // Text content (textContent)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = TRANSLATIONS[key];
            if (!translation) return;
            const text = translation[this.currentLang];
            if (text === undefined) return;

            if (el.hasAttribute('data-i18n-html')) {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        });

        // Placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = TRANSLATIONS[key];
            if (translation && translation[this.currentLang]) {
                el.placeholder = translation[this.currentLang];
            }
        });

        // Page title
        const titleEl = document.querySelector('title[data-i18n]');
        if (titleEl) {
            const key = titleEl.getAttribute('data-i18n');
            if (TRANSLATIONS[key] && TRANSLATIONS[key][this.currentLang]) {
                document.title = TRANSLATIONS[key][this.currentLang];
            }
        }

        // Meta description
        const metaDesc = document.querySelector('meta[name="description"][data-i18n-content]');
        if (metaDesc) {
            const key = metaDesc.getAttribute('data-i18n-content');
            if (TRANSLATIONS[key] && TRANSLATIONS[key][this.currentLang]) {
                metaDesc.setAttribute('content', TRANSLATIONS[key][this.currentLang]);
            }
        }
    },

    updateToggleUI() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },

    updateHtmlLang() {
        document.documentElement.lang = this.currentLang;
    },

    // Helper for JS-generated strings
    t(key) {
        if (typeof TRANSLATIONS === 'undefined') return '';
        const translation = TRANSLATIONS[key];
        if (!translation) return '';
        return translation[this.currentLang] || '';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    LangSwitcher.init();
});
