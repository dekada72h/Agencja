// Portfolio Filter
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-showcase-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                const itemsToShow = [];
                const itemsToHide = [];

                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        itemsToShow.push(item);
                    } else {
                        itemsToHide.push(item);
                    }
                });

                // Batch DOM updates: Hide phase 1 (start transition)
                itemsToHide.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                });

                // Batch DOM updates: Show phase 1 (make block)
                itemsToShow.forEach(item => {
                    item.style.display = 'block';
                });

                // Batch DOM updates: Show phase 2 (start transition after display applied)
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        itemsToShow.forEach(item => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        });
                    });
                });

                // Batch DOM updates: Hide phase 2 (display none after transition completes)
                setTimeout(() => {
                    itemsToHide.forEach(item => {
                        // Only set to none if it hasn't been shown again quickly
                        if (item.style.opacity === '0') {
                            item.style.display = 'none';
                        }
                    });
                }, 300);
            });
        });
    }
});
