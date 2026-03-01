document.addEventListener('DOMContentLoaded', function() {
    let currentActiveItem = document.querySelector('.lp-faq-item.active');

    document.querySelectorAll('.lp-faq-item h3').forEach(function(question) {
        question.addEventListener('click', function() {
            var item = this.parentElement;
            var isActive = item.classList.contains('active');

            if (currentActiveItem && currentActiveItem !== item) {
                currentActiveItem.classList.remove('active');
            }

            if (!isActive) {
                item.classList.add('active');
                currentActiveItem = item;
            } else {
                item.classList.remove('active');
                currentActiveItem = null;
            }
        });
    });
});
