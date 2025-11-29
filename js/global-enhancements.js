document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Preloader HTML
    const preloaderHTML = `
        <div id="preloader">
            <span class="loader"></span>
            <span class="loader-text">MR7 TV</span>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', preloaderHTML);

    // 2. Inject Scroll to Top HTML
    const scrollToTopHTML = `
        <button id="scrollToTopBtn" title="العودة للأعلى">
            <i class="fas fa-arrow-up"></i>
        </button>
    `;
    document.body.insertAdjacentHTML('beforeend', scrollToTopHTML);

    // 3. Preloader Logic
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500); // Slight delay for smoothness
    });

    // 4. Scroll to Top Logic
    const scrollBtn = document.getElementById('scrollToTopBtn');

    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.style.display = 'flex';
            } else {
                scrollBtn.style.display = 'none';
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 5. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
});
