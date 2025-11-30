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

    // 6. Floating Icons Background (Particles.js Custom Config)
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } }, // Increased density
                color: {
                    value: ["#ef4444", "#fbbf24", "#3b82f6", "#22c55e", "#a855f7", "#22d3ee"]
                }, // Vibrant: Red, Gold, Blue, Green, Purple, Cyan
                shape: {
                    type: "char",
                    stroke: { width: 0, color: "#000000" },
                    polygon: { nb_sides: 5 },
                    character: [
                        { value: "\uf26c", font: "FontAwesome", style: "", weight: "900", fill: true }, // TV
                        { value: "\uf144", font: "FontAwesome", style: "", weight: "900", fill: true }, // Play Circle
                        { value: "\uf7c0", font: "FontAwesome", style: "", weight: "900", fill: true }, // Satellite Dish
                        { value: "\uf1e3", font: "FontAwesome", style: "", weight: "900", fill: true }, // Soccer Ball
                        { value: "\uf008", font: "FontAwesome", style: "", weight: "900", fill: true }, // Film
                        { value: "\uf1eb", font: "FontAwesome", style: "", weight: "900", fill: true }  // Wifi
                    ]
                },
                opacity: {
                    value: 0.3, // Increased opacity for better visibility
                    random: true,
                    anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 24, // Slightly larger
                    random: true,
                    anim: { enable: true, speed: 2, size_min: 12, sync: false }
                },
                line_linked: {
                    enable: false,
                },
                move: {
                    enable: true,
                    speed: 1.5, // Slightly faster movement
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: { enable: false, rotateX: 600, rotateY: 1200 }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "bubble" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    bubble: { distance: 200, size: 35, duration: 2, opacity: 0.6, speed: 3 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
});
