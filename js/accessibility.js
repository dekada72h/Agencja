/* ============================================
   ACCESSIBILITY WIDGET
   Dekada72H - Accessibility Features
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const AccessibilityWidget = {
        STORAGE_KEY: 'a11y_settings',
        panel: null,
        trigger: null,
        readingGuideLine: null,
        isOpen: false,

        defaults: {
            fontSize: 0,
            dyslexia: false,
            contrast: false,
            colorBlind: null,
            readingGuide: false
        },

        settings: null,

        init() {
            this.settings = this.loadSettings();
            this.injectSVGFilters();
            this.injectWidget();
            this.bindEvents();
            this.applySettings();
            this.updateUI();
        },

        t(key) {
            if (typeof LangSwitcher !== 'undefined' && LangSwitcher.t) {
                var val = LangSwitcher.t(key);
                if (val && val !== key) return val;
            }
            var fallbacks = {
                'a11y.trigger.label': 'Dostępność',
                'a11y.panel.title': 'Ustawienia dostępności',
                'a11y.fontSize': 'Rozmiar czcionki',
                'a11y.dyslexia': 'Tryb dysleksji',
                'a11y.dyslexia.desc': 'Czcionka i odstępy przyjazne osobom z dysleksją',
                'a11y.contrast': 'Wysoki kontrast',
                'a11y.contrast.desc': 'Ciemne tło, jasny tekst, wyraźne krawędzie',
                'a11y.colorblind': 'Daltonizm',
                'a11y.colorblind.desc': 'Filtry kolorów i wzmocnione wizualne wskazówki',
                'a11y.cb.protanopia': 'Protanopia (czerwony)',
                'a11y.cb.deuteranopia': 'Deuteranopia (zielony)',
                'a11y.cb.tritanopia': 'Tritanopia (niebieski)',
                'a11y.readingGuide': 'Linia czytania',
                'a11y.readingGuide.desc': 'Pozioma linia podążająca za kursorem',
                'a11y.resetAll': 'Resetuj wszystko'
            };
            return fallbacks[key] || key;
        },

        injectSVGFilters() {
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('aria-hidden', 'true');
            svg.style.position = 'absolute';
            svg.style.width = '0';
            svg.style.height = '0';
            svg.style.overflow = 'hidden';
            svg.innerHTML = '<filter id="a11y-protanopia-filter">' +
                '<feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/>' +
                '</filter>' +
                '<filter id="a11y-deuteranopia-filter">' +
                '<feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/>' +
                '</filter>' +
                '<filter id="a11y-tritanopia-filter">' +
                '<feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/>' +
                '</filter>';
            document.body.insertBefore(svg, document.body.firstChild);
        },

        injectWidget() {
            this.trigger = document.createElement('button');
            this.trigger.className = 'a11y-trigger';
            this.trigger.setAttribute('aria-label', this.t('a11y.trigger.label'));
            this.trigger.setAttribute('title', this.t('a11y.trigger.label'));
            this.trigger.setAttribute('aria-expanded', 'false');
            this.trigger.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="4" r="2"/><path d="M12 7c-1.5 0-4.5 1-4.5 1L9 13l-3 8h2.5l2.5-6 2.5 6H16l-3-8 1.5-5S13.5 7 12 7z"/></svg>';

            this.panel = document.createElement('div');
            this.panel.className = 'a11y-panel';
            this.panel.setAttribute('role', 'dialog');
            this.panel.setAttribute('aria-label', this.t('a11y.panel.title'));
            this.panel.innerHTML = this.buildPanelHTML();

            this.readingGuideLine = document.createElement('div');
            this.readingGuideLine.className = 'a11y-reading-guide-line';

            document.body.appendChild(this.trigger);
            document.body.appendChild(this.panel);
            document.body.appendChild(this.readingGuideLine);
        },

        buildPanelHTML() {
            return '<div class="a11y-panel-header">' +
                '<h3 class="a11y-panel-title">' + this.t('a11y.panel.title') + '</h3>' +
                '<button class="a11y-panel-close" aria-label="Close" data-a11y-close>&times;</button>' +
                '</div>' +
                '<div class="a11y-panel-body">' +

                '<div class="a11y-section">' +
                '<span class="a11y-section-label">' + this.t('a11y.fontSize') + '</span>' +
                '<div class="a11y-font-controls">' +
                '<button class="a11y-font-btn" data-a11y-fontsize="0">A</button>' +
                '<button class="a11y-font-btn" data-a11y-fontsize="1">A+</button>' +
                '<button class="a11y-font-btn" data-a11y-fontsize="2">A++</button>' +
                '</div>' +
                '</div>' +

                '<div class="a11y-section">' +
                '<button class="a11y-toggle" data-a11y-toggle="dyslexia" aria-pressed="false">' +
                '<span class="a11y-toggle-label">' + this.t('a11y.dyslexia') + '</span>' +
                '<span class="a11y-toggle-switch"></span>' +
                '</button>' +
                '<span class="a11y-section-desc">' + this.t('a11y.dyslexia.desc') + '</span>' +
                '</div>' +

                '<div class="a11y-section">' +
                '<button class="a11y-toggle" data-a11y-toggle="contrast" aria-pressed="false">' +
                '<span class="a11y-toggle-label">' + this.t('a11y.contrast') + '</span>' +
                '<span class="a11y-toggle-switch"></span>' +
                '</button>' +
                '<span class="a11y-section-desc">' + this.t('a11y.contrast.desc') + '</span>' +
                '</div>' +

                '<div class="a11y-section">' +
                '<button class="a11y-toggle" data-a11y-toggle="colorBlind" aria-pressed="false">' +
                '<span class="a11y-toggle-label">' + this.t('a11y.colorblind') + '</span>' +
                '<span class="a11y-toggle-switch"></span>' +
                '</button>' +
                '<span class="a11y-section-desc">' + this.t('a11y.colorblind.desc') + '</span>' +
                '<div class="a11y-cb-options" data-a11y-cb-options>' +
                '<button class="a11y-cb-option" data-a11y-cb="protanopia">' +
                '<span class="a11y-cb-dot a11y-cb-dot--protanopia"></span>' +
                '<span>' + this.t('a11y.cb.protanopia') + '</span>' +
                '</button>' +
                '<button class="a11y-cb-option" data-a11y-cb="deuteranopia">' +
                '<span class="a11y-cb-dot a11y-cb-dot--deuteranopia"></span>' +
                '<span>' + this.t('a11y.cb.deuteranopia') + '</span>' +
                '</button>' +
                '<button class="a11y-cb-option" data-a11y-cb="tritanopia">' +
                '<span class="a11y-cb-dot a11y-cb-dot--tritanopia"></span>' +
                '<span>' + this.t('a11y.cb.tritanopia') + '</span>' +
                '</button>' +
                '</div>' +
                '</div>' +

                '<div class="a11y-section">' +
                '<button class="a11y-toggle" data-a11y-toggle="readingGuide" aria-pressed="false">' +
                '<span class="a11y-toggle-label">' + this.t('a11y.readingGuide') + '</span>' +
                '<span class="a11y-toggle-switch"></span>' +
                '</button>' +
                '<span class="a11y-section-desc">' + this.t('a11y.readingGuide.desc') + '</span>' +
                '</div>' +

                '<button class="a11y-reset" data-a11y-reset>' + this.t('a11y.resetAll') + '</button>' +

                '</div>';
        },

        bindEvents() {
            var self = this;

            this.trigger.addEventListener('click', function() { self.togglePanel(); });

            this.panel.querySelector('[data-a11y-close]')
                .addEventListener('click', function() { self.closePanel(); });

            this.panel.querySelectorAll('[data-a11y-fontsize]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    self.settings.fontSize = parseInt(btn.getAttribute('data-a11y-fontsize'));
                    self.applySettings();
                    self.updateUI();
                    self.saveSettings();
                });
            });

            this.panel.querySelectorAll('[data-a11y-toggle]').forEach(function(toggle) {
                toggle.addEventListener('click', function() {
                    var key = toggle.getAttribute('data-a11y-toggle');
                    if (key === 'colorBlind') {
                        if (self.settings.colorBlind) {
                            self.settings.colorBlind = null;
                        } else {
                            self.settings.colorBlind = 'protanopia';
                        }
                    } else {
                        self.settings[key] = !self.settings[key];
                    }
                    self.applySettings();
                    self.updateUI();
                    self.saveSettings();
                });
            });

            this.panel.querySelectorAll('[data-a11y-cb]').forEach(function(option) {
                option.addEventListener('click', function() {
                    self.settings.colorBlind = option.getAttribute('data-a11y-cb');
                    self.applySettings();
                    self.updateUI();
                    self.saveSettings();
                });
            });

            this.panel.querySelector('[data-a11y-reset]')
                .addEventListener('click', function() { self.resetAll(); });

            document.addEventListener('mousemove', function(e) {
                if (self.settings.readingGuide && self.readingGuideLine) {
                    self.readingGuideLine.style.top = e.clientY + 'px';
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && self.isOpen) {
                    self.closePanel();
                }
            });

            document.addEventListener('click', function(e) {
                if (self.isOpen &&
                    !self.panel.contains(e.target) &&
                    !self.trigger.contains(e.target)) {
                    self.closePanel();
                }
            });
        },

        togglePanel() {
            if (this.isOpen) {
                this.closePanel();
            } else {
                this.openPanel();
            }
        },

        openPanel() {
            this.panel.classList.add('open');
            this.isOpen = true;
            this.trigger.setAttribute('aria-expanded', 'true');
        },

        closePanel() {
            this.panel.classList.remove('open');
            this.isOpen = false;
            this.trigger.setAttribute('aria-expanded', 'false');
        },

        applySettings() {
            var body = document.body;

            body.classList.remove('a11y-font-lg', 'a11y-font-xl');
            if (this.settings.fontSize === 1) {
                body.classList.add('a11y-font-lg');
            } else if (this.settings.fontSize === 2) {
                body.classList.add('a11y-font-xl');
            }

            body.classList.toggle('a11y-dyslexia', this.settings.dyslexia);
            body.classList.toggle('a11y-contrast', this.settings.contrast);

            body.classList.remove('a11y-cb-protanopia', 'a11y-cb-deuteranopia', 'a11y-cb-tritanopia');
            if (this.settings.colorBlind) {
                body.classList.add('a11y-cb-' + this.settings.colorBlind);
            }

            body.classList.toggle('a11y-reading-guide', this.settings.readingGuide);
        },

        updateUI() {
            var self = this;

            this.panel.querySelectorAll('[data-a11y-fontsize]').forEach(function(btn) {
                var level = parseInt(btn.getAttribute('data-a11y-fontsize'));
                btn.classList.toggle('active', level === self.settings.fontSize);
            });

            ['dyslexia', 'contrast', 'readingGuide'].forEach(function(key) {
                var toggle = self.panel.querySelector('[data-a11y-toggle="' + key + '"]');
                if (toggle) {
                    toggle.classList.toggle('active', self.settings[key]);
                    toggle.setAttribute('aria-pressed', String(self.settings[key]));
                }
            });

            var cbToggle = this.panel.querySelector('[data-a11y-toggle="colorBlind"]');
            if (cbToggle) {
                var cbActive = this.settings.colorBlind !== null;
                cbToggle.classList.toggle('active', cbActive);
                cbToggle.setAttribute('aria-pressed', String(cbActive));
            }

            var cbOptions = this.panel.querySelector('[data-a11y-cb-options]');
            if (cbOptions) {
                cbOptions.classList.toggle('visible', this.settings.colorBlind !== null);
            }

            this.panel.querySelectorAll('[data-a11y-cb]').forEach(function(option) {
                var type = option.getAttribute('data-a11y-cb');
                option.classList.toggle('active', type === self.settings.colorBlind);
            });
        },

        resetAll() {
            this.settings = Object.assign({}, this.defaults);
            this.applySettings();
            this.updateUI();
            this.saveSettings();
        },

        loadSettings() {
            try {
                var stored = localStorage.getItem(this.STORAGE_KEY);
                if (stored) {
                    var parsed = JSON.parse(stored);
                    return Object.assign({}, this.defaults, parsed);
                }
            } catch (e) {}
            return Object.assign({}, this.defaults);
        },

        saveSettings() {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
            } catch (e) {}
        }
    };

    AccessibilityWidget.init();
});
