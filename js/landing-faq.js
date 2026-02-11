document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.lp-faq-item h3').forEach(function(question) {
        question.addEventListener('click', function() {
            var item = this.parentElement;
            var isActive = item.classList.contains('active');
            document.querySelectorAll('.lp-faq-item').forEach(function(el) {
                el.classList.remove('active');
            });
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
