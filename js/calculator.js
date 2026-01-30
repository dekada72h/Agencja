/**
 * Price Calculator
 * Interactive website price calculator with step-by-step form
 */

document.addEventListener('DOMContentLoaded', function() {
    const calculator = {
        currentStep: 1,
        totalSteps: 5,
        data: {
            type: { value: '', label: '', price: 0 },
            pages: { value: '', label: '', price: 0 },
            features: [],
            timeline: { value: '', label: '', multiplier: 1 }
        },

        init() {
            this.bindEvents();
            this.updateProgress();
        },

        bindEvents() {
            // Option cards (single select)
            document.querySelectorAll('.option-card').forEach(card => {
                card.addEventListener('click', (e) => this.selectOption(e.currentTarget));
            });

            // Checkbox options (multi select)
            document.querySelectorAll('.checkbox-option').forEach(option => {
                option.addEventListener('click', (e) => this.toggleCheckbox(e.currentTarget));
            });

            // Navigation buttons
            document.querySelectorAll('.btn-next').forEach(btn => {
                btn.addEventListener('click', () => this.nextStep());
            });

            document.querySelectorAll('.btn-prev').forEach(btn => {
                btn.addEventListener('click', () => this.prevStep());
            });

            document.querySelector('.btn-restart')?.addEventListener('click', () => this.restart());

            // Form submission
            const form = document.getElementById('calculatorForm');
            if (form) {
                form.addEventListener('submit', (e) => this.handleSubmit(e));
            }
        },

        selectOption(card) {
            const step = card.closest('.calculator-step');
            const stepNumber = parseInt(step.dataset.step);

            // Remove selection from siblings
            step.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));

            // Add selection to clicked card
            card.classList.add('selected');

            // Store data based on step
            const value = card.dataset.value;
            const label = card.querySelector('h4').textContent;
            const price = parseInt(card.dataset.price) || 0;
            const multiplier = parseFloat(card.dataset.multiplier) || 1;

            if (stepNumber === 1) {
                this.data.type = { value, label, price };
            } else if (stepNumber === 2) {
                this.data.pages = { value, label, price };
            } else if (stepNumber === 4) {
                this.data.timeline = { value, label, multiplier };
            }

            // Enable next button
            step.querySelector('.btn-next').disabled = false;
        },

        toggleCheckbox(option) {
            const checkbox = option.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            option.classList.toggle('selected', checkbox.checked);

            // Update features data
            this.updateFeatures();
        },

        updateFeatures() {
            this.data.features = [];
            document.querySelectorAll('.checkbox-option.selected').forEach(option => {
                const checkbox = option.querySelector('input');
                const label = option.querySelector('h5').textContent;
                const price = parseInt(option.dataset.price) || 0;
                this.data.features.push({
                    value: checkbox.value,
                    label,
                    price
                });
            });
        },

        nextStep() {
            if (this.currentStep < this.totalSteps) {
                // Hide current step
                document.querySelector(`.calculator-step[data-step="${this.currentStep}"]`).classList.remove('active');

                this.currentStep++;

                // Show next step
                document.querySelector(`.calculator-step[data-step="${this.currentStep}"]`).classList.add('active');

                // Update progress
                this.updateProgress();

                // If going to summary, calculate and display
                if (this.currentStep === 5) {
                    this.showSummary();
                }

                // Scroll to top of calculator
                document.querySelector('.calculator-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },

        prevStep() {
            if (this.currentStep > 1) {
                // Hide current step
                document.querySelector(`.calculator-step[data-step="${this.currentStep}"]`).classList.remove('active');

                this.currentStep--;

                // Show previous step
                document.querySelector(`.calculator-step[data-step="${this.currentStep}"]`).classList.add('active');

                // Update progress
                this.updateProgress();
            }
        },

        updateProgress() {
            document.querySelectorAll('.progress-step').forEach((step, index) => {
                const stepNum = index + 1;
                step.classList.remove('active', 'completed');

                if (stepNum < this.currentStep) {
                    step.classList.add('completed');
                } else if (stepNum === this.currentStep) {
                    step.classList.add('active');
                }
            });
        },

        calculateTotal() {
            let total = 0;

            // Base price (type)
            total += this.data.type.price;

            // Pages addition
            total += this.data.pages.price;

            // Features
            this.data.features.forEach(feature => {
                total += feature.price;
            });

            // Timeline multiplier
            total = Math.round(total * this.data.timeline.multiplier);

            return total;
        },

        showSummary() {
            // Type
            document.getElementById('summaryType').textContent = this.data.type.label || '-';

            // Pages
            document.getElementById('summaryPages').textContent = this.data.pages.label || '-';

            // Features
            const featuresText = this.data.features.length > 0
                ? this.data.features.map(f => f.label).join(', ')
                : 'Brak dodatkowych funkcji';
            document.getElementById('summaryFeatures').textContent = featuresText;

            // Timeline
            document.getElementById('summaryTimeline').textContent = this.data.timeline.label || '-';

            // Total
            const total = this.calculateTotal();
            document.getElementById('summaryTotal').textContent = this.formatPrice(total);

            // Update hidden input for form
            const summaryText = `
Typ strony: ${this.data.type.label} (${this.formatPrice(this.data.type.price)})
Liczba podstron: ${this.data.pages.label} (+${this.formatPrice(this.data.pages.price)})
Dodatkowe funkcje: ${featuresText}
Termin: ${this.data.timeline.label}
---
ORIENTACYJNA WYCENA: ${this.formatPrice(total)} netto
            `.trim();

            document.getElementById('projectSummaryInput').value = summaryText;
        },

        formatPrice(price) {
            return price.toLocaleString('pl-PL') + ' zł';
        },

        restart() {
            // Reset data
            this.data = {
                type: { value: '', label: '', price: 0 },
                pages: { value: '', label: '', price: 0 },
                features: [],
                timeline: { value: '', label: '', multiplier: 1 }
            };

            // Reset UI
            document.querySelectorAll('.option-card').forEach(card => {
                card.classList.remove('selected');
            });

            document.querySelectorAll('.checkbox-option').forEach(option => {
                option.classList.remove('selected');
                option.querySelector('input').checked = false;
            });

            document.querySelectorAll('.btn-next').forEach(btn => {
                btn.disabled = true;
            });

            // Step 3 doesn't require selection
            document.querySelector('.calculator-step[data-step="3"] .btn-next').disabled = false;

            // Go to step 1
            document.querySelectorAll('.calculator-step').forEach(step => {
                step.classList.remove('active');
            });
            document.querySelector('.calculator-step[data-step="1"]').classList.add('active');

            this.currentStep = 1;
            this.updateProgress();

            // Scroll to top
            document.querySelector('.calculator-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
        },

        async handleSubmit(e) {
            e.preventDefault();

            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const successMsg = document.getElementById('calcFormSuccess');
            const errorMsg = document.getElementById('calcFormError');

            // Hide previous messages
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            // Validate
            const name = form.querySelector('#calcName').value.trim();
            const email = form.querySelector('#calcEmail').value.trim();
            const phone = form.querySelector('#calcPhone').value.trim();
            const consent = form.querySelector('input[name="consent"]').checked;

            if (!name || !email || !phone) {
                errorMsg.textContent = 'Proszę wypełnić wszystkie wymagane pola.';
                errorMsg.style.display = 'block';
                return;
            }

            if (!consent) {
                errorMsg.textContent = 'Proszę wyrazić zgodę na przetwarzanie danych.';
                errorMsg.style.display = 'block';
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorMsg.textContent = 'Proszę podać poprawny adres email.';
                errorMsg.style.display = 'block';
                return;
            }

            // Show loading
            const originalText = submitBtn.textContent;
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
                    successMsg.style.display = 'block';
                    form.reset();
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    errorMsg.textContent = 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie.';
                    errorMsg.style.display = 'block';
                }
            } catch (error) {
                errorMsg.textContent = 'Wystąpił błąd połączenia. Sprawdź internet i spróbuj ponownie.';
                errorMsg.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    };

    // Initialize calculator
    calculator.init();
});
