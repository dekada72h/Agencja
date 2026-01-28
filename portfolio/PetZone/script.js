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

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add to cart buttons
    document.querySelectorAll('.product-add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;"><polyline points="20 6 9 17 4 12"/></svg> Dodano!';
            btn.style.background = '#22c55e';
            setTimeout(() => {
                btn.innerHTML = originalContent;
                if (!originalContent.includes('svg')) {
                     btn.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Dodaj do koszyka';
                }
                btn.style.background = '';
            }, 2000);
        });
    });

    // Newsletter form
    const newsletterSubmit = document.querySelector('.newsletter-submit');
    if (newsletterSubmit) {
        newsletterSubmit.addEventListener('click', function() {
            const input = document.querySelector('.newsletter-input');
            if (input && input.value) {
                alert('Dziekujemy za zapisanie sie! Twoj kod rabatowy: PETZONE15');
                input.value = '';
            }
        });
    }
});
