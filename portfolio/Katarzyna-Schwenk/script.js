document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('open'));
        links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            alert('Dziękuję za wiadomość. Odpowiem najszybciej jak to możliwe.');
            form.reset();
        });
    }
});
