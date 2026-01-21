/* ============================================
   JERONIMO DIGITAL - AGENCY MAIN JAVASCRIPT
   Modern Marketing Agency
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    // Preloader.init();
    Navigation.init();
    ScrollAnimations.init();
    ScrollTop.init();
    ContactForm.init();
    Testimonials.init();
    CounterAnimation.init();
});

/* ============================================
   PRELOADER
   ============================================ */
const Preloader = {
    init() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = 'visible';
            }, 500);
        });
    }
};

/* ============================================
   NAVIGATION
   ============================================ */
const Navigation = {
    navbar: null,
    menuToggle: null,
    navMenu: null,
    navLinks: null,

    init() {
        this.navbar = document.querySelector('.navbar');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        if (!this.navbar) return;

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Scroll event for navbar styling
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.navMenu && this.navMenu.classList.contains('active')) {
                if (!this.navMenu.contains(e.target) && !this.menuToggle.contains(e.target)) {
                    this.closeMenu();
                }
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    },

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    },

    toggleMenu() {
        this.menuToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    },

    closeMenu() {
        this.menuToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
const ScrollAnimations = {
    elements: null,

    init() {
        this.elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');

        if (!this.elements.length) return;

        // Create intersection observer
        const observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                root: null,
                rootMargin: '0px 0px -100px 0px',
                threshold: 0.1
            }
        );

        // Observe all elements
        this.elements.forEach(element => observer.observe(element));
    },

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }
};

/* ============================================
   SCROLL TO TOP
   ============================================ */
const ScrollTop = {
    button: null,

    init() {
        this.button = document.querySelector('.scroll-top');
        if (!this.button) return;

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.button.addEventListener('click', () => this.scrollToTop());
    },

    handleScroll() {
        if (window.scrollY > 500) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

/* ============================================
   CONTACT FORM
   ============================================ */
const ContactForm = {
    form: null,

    init() {
        this.form = document.querySelector('.contact-form');
        if (!this.form) return;

        this.bindEvents();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    },

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        let isValid = true;

        // Validate all fields
        this.form.querySelectorAll('.form-input, .form-textarea').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Simulate form submission
        const submitBtn = this.form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Wysyłanie...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.showSuccess();
            this.form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    },

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'To pole jest wymagane';
        }

        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Podaj prawidłowy adres email';
            }
        }

        // Phone validation
        if (fieldName === 'phone' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]{9,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Podaj prawidłowy numer telefonu';
            }
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.clearError(field);
        }

        return isValid;
    },

    showError(field, message) {
        this.clearError(field);

        field.style.borderColor = '#ef4444';

        const errorEl = document.createElement('span');
        errorEl.className = 'form-error';
        errorEl.textContent = message;
        errorEl.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 4px; display: block;';

        field.parentNode.appendChild(errorEl);
    },

    clearError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    },

    showSuccess() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                <svg style="width: 48px; height: 48px; margin: 0 auto 12px; display: block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h4 style="margin-bottom: 8px; font-size: 1.25rem;">Wiadomość wysłana!</h4>
                <p style="margin: 0; opacity: 0.9;">Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.</p>
            </div>
        `;

        this.form.insertBefore(successDiv, this.form.firstChild);

        // Remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
};

/* ============================================
   TESTIMONIALS SLIDER
   ============================================ */
const Testimonials = {
    slides: null,
    dots: null,
    currentIndex: 0,
    autoplayInterval: null,

    init() {
        this.slides = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.testimonial-dot');

        if (this.slides.length <= 1) return;

        this.bindEvents();
        this.startAutoplay();
    },

    bindEvents() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoplay();
            });
        });
    },

    goToSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });

        // Remove active from all dots
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Show current slide
        this.slides[index].style.display = 'block';
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');

        this.currentIndex = index;
    },

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    },

    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
    },

    resetAutoplay() {
        clearInterval(this.autoplayInterval);
        this.startAutoplay();
    }
};

/* ============================================
   COUNTER ANIMATION
   ============================================ */
const CounterAnimation = {
    counters: null,
    animated: new Set(),

    init() {
        this.counters = document.querySelectorAll('.stat-number');
        if (!this.counters.length) return;

        const observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.5 }
        );

        this.counters.forEach(counter => observer.observe(counter));
    },

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.animated.has(entry.target)) {
                this.animated.add(entry.target);
                this.animateCounter(entry.target);
            }
        });
    },

    animateCounter(element) {
        const text = element.textContent;
        const match = text.match(/(\d+)/);

        if (!match) return;

        const target = parseInt(match[1]);
        const suffix = text.replace(match[1], '').trim();
        const prefix = text.substring(0, text.indexOf(match[1]));
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const stepDuration = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = prefix + Math.floor(current) + suffix;
        }, stepDuration);
    }
};

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

/* ============================================
   LAZY LOADING IMAGES
   ============================================ */
const LazyLoad = {
    init() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
};

// Initialize lazy loading
LazyLoad.init();

/* ============================================
   PARALLAX EFFECT (Optional)
   ============================================ */
const Parallax = {
    elements: null,

    init() {
        this.elements = document.querySelectorAll('[data-parallax]');
        if (!this.elements.length) return;

        window.addEventListener('scroll', () => this.handleScroll());
    },

    handleScroll() {
        const scrollY = window.scrollY;

        this.elements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
};

Parallax.init();

/* ============================================
   TYPING EFFECT (for hero section)
   ============================================ */
const TypingEffect = {
    element: null,
    words: [],
    currentWordIndex: 0,
    currentCharIndex: 0,
    isDeleting: false,
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseDuration: 2000,

    init() {
        this.element = document.querySelector('[data-typing]');
        if (!this.element) return;

        this.words = this.element.dataset.typing.split(',').map(w => w.trim());
        this.type();
    },

    type() {
        const currentWord = this.words[this.currentWordIndex];

        if (this.isDeleting) {
            this.currentCharIndex--;
            this.element.textContent = currentWord.substring(0, this.currentCharIndex);
        } else {
            this.currentCharIndex++;
            this.element.textContent = currentWord.substring(0, this.currentCharIndex);
        }

        let timeout = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentWord.length) {
            timeout = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            timeout = 500;
        }

        setTimeout(() => this.type(), timeout);
    }
};

TypingEffect.init();
