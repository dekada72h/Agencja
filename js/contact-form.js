/**
 * Contact Form Handler
 * Handles form submission via Formspree with validation and status messages
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const successMessage = document.getElementById('formSuccess');
    const errorMessage = document.getElementById('formError');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Basic validation
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const phone = form.querySelector('#phone').value.trim();
        const message = form.querySelector('#message').value.trim();
        const consent = form.querySelector('input[name="consent"]').checked;

        if (!name || !email || !phone || !message) {
            errorMessage.textContent = 'Proszę wypełnić wszystkie wymagane pola.';
            errorMessage.style.display = 'block';
            return;
        }

        if (!consent) {
            errorMessage.textContent = 'Proszę wyrazić zgodę na przetwarzanie danych.';
            errorMessage.style.display = 'block';
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorMessage.textContent = 'Proszę podać poprawny adres email.';
            errorMessage.style.display = 'block';
            return;
        }

        // Phone validation (basic - at least 9 digits)
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 9) {
            errorMessage.textContent = 'Proszę podać poprawny numer telefonu.';
            errorMessage.style.display = 'block';
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wysyłanie...';

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                successMessage.style.display = 'block';
                form.reset();
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                const data = await response.json();
                if (data.errors) {
                    errorMessage.textContent = data.errors.map(err => err.message).join(', ');
                } else {
                    errorMessage.textContent = 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie.';
                }
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'Wystąpił błąd połączenia. Sprawdź internet i spróbuj ponownie.';
            errorMessage.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    // Real-time validation feedback
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '';
            }
        });
    });
});
