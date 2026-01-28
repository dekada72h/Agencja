document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle with animation
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close mobile menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // Scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Search/Filter functionality
    const searchForm = document.getElementById('search-form');
    const propertiesGrid = document.getElementById('properties-grid');
    const propertyCards = document.querySelectorAll('.property-card');

    function filterProperties() {
        const transaction = document.getElementById('search-transaction').value;
        const type = document.getElementById('search-type').value;
        const location = document.getElementById('search-location').value;
        const budget = document.getElementById('search-budget').value;

        let visibleCount = 0;

        propertyCards.forEach(card => {
            const cardTransaction = card.dataset.transaction;
            const cardType = card.dataset.type;
            const cardLocation = card.dataset.location;
            const cardPrice = parseInt(card.dataset.price);

            let show = true;

            if (transaction && cardTransaction !== transaction) show = false;
            if (type && cardType !== type) show = false;
            if (location && cardLocation !== location) show = false;
            if (budget && cardPrice > parseInt(budget)) show = false;

            if (show) {
                card.classList.remove('hidden');
                card.classList.add('visible');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Handle no results message
        const existingNoResults = propertiesGrid.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }

        if (visibleCount === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results fade-in visible';
            noResults.innerHTML = `
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <h4>Brak wynikow</h4>
                <p>Nie znalezlismy nieruchomosci spelniajacej Twoje kryteria.</p>
                <button type="button" class="btn btn-dark js-reset-filters">Wyczysc filtry</button>
            `;
            propertiesGrid.appendChild(noResults);
        }

        // Scroll to properties section
        const propertiesSection = document.getElementById('properties');
        if (propertiesSection) {
            const offset = 80;
            const targetPosition = propertiesSection.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    function resetFilters() {
        document.getElementById('search-transaction').value = '';
        document.getElementById('search-type').value = '';
        document.getElementById('search-location').value = '';
        document.getElementById('search-budget').value = '';

        propertyCards.forEach(card => {
            card.classList.remove('hidden');
            card.classList.add('visible');
        });

        const existingNoResults = propertiesGrid.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }
    }

    // Event delegation for dynamically created reset button
    if (propertiesGrid) {
        propertiesGrid.addEventListener('click', function(e) {
            if (e.target.classList.contains('js-reset-filters')) {
                resetFilters();
            }
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            filterProperties();
        });
    }

    // Contact form submission with validation
    const contactForm = document.querySelector('.contact-form-wrapper form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = this.querySelector('input[type="text"]');
            const phone = this.querySelector('input[type="tel"]');
            const email = this.querySelector('input[type="email"]');
            const interest = this.querySelector('select');

            let isValid = true;

            // Clear previous errors
            this.querySelectorAll('.form-error').forEach(err => err.remove());
            this.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
                input.style.borderColor = '';
            });

            // Validate name
            if (!name.value.trim() || name.value.trim().length < 3) {
                showError(name, 'Prosze podac imie i nazwisko (min. 3 znaki)');
                isValid = false;
            }

            // Validate phone
            const phoneRegex = /^[\d\s\+\-]{9,}$/;
            if (!phoneRegex.test(phone.value.trim())) {
                showError(phone, 'Prosze podac prawidlowy numer telefonu');
                isValid = false;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                showError(email, 'Prosze podac prawidlowy adres email');
                isValid = false;
            }

            // Validate interest selection
            if (!interest.value) {
                showError(interest, 'Prosze wybrac temat zapytania');
                isValid = false;
            }

            if (isValid) {
                // Show success message
                const btn = this.querySelector('.form-submit');
                const originalText = btn.textContent;
                btn.textContent = 'Wysylanie...';
                btn.disabled = true;

                setTimeout(() => {
                    showSuccessMessage();
                    this.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 1000);
            }
        });
    }

    function showError(input, message) {
        input.style.borderColor = '#dc3545';
        const error = document.createElement('span');
        error.className = 'form-error';
        error.style.cssText = 'color: #dc3545; font-size: 0.8rem; display: block; margin-top: 5px;';
        error.textContent = message;
        input.parentNode.appendChild(error);
    }

    function showSuccessMessage() {
        const wrapper = document.querySelector('.contact-form-wrapper');
        const existingSuccess = wrapper.querySelector('.success-message');
        if (existingSuccess) existingSuccess.remove();

        const success = document.createElement('div');
        success.className = 'success-message';
        success.style.cssText = 'background: #d4edda; color: #155724; padding: 15px 20px; border-radius: 8px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;';
        success.innerHTML = `
            <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; stroke: currentColor; fill: none; stroke-width: 2;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Dziekujemy za wiadomosc! Skontaktujemy sie wkrotce.</span>
        `;
        wrapper.insertBefore(success, wrapper.querySelector('form'));

        setTimeout(() => {
            success.style.transition = 'opacity 0.5s';
            success.style.opacity = '0';
            setTimeout(() => success.remove(), 500);
        }, 5000);
    }

    // Dynamic copyright year
    const footerP = document.querySelector('.footer-bottom p');
    if (footerP) {
        footerP.innerHTML = footerP.innerHTML.replace('2024', new Date().getFullYear());
    }
});
