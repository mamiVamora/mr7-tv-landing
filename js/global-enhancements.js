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

    // 2.2 Dynamic Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2.5 Inject Speed Test Modal
    const speedTestModalHTML = `
        <div id="speed-test-modal" class="modal-overlay" onclick="if(event.target === this) this.style.display='none'">
            <div class="modal-content speed-test-content">
                <button class="modal-close" onclick="document.getElementById('speed-test-modal').style.display='none'"><i class="fas fa-times"></i></button>
                <div class="speed-test-header">
                    <i class="fas fa-tachometer-alt speed-icon"></i>
                    <h2>فحص سرعة الانترنت</h2>
                    <p>تأكد من جودة اتصالك للحصول على أفضل تجربة مشاهدة</p>
                </div>
                <div class="speed-test-frame-container">
                    <iframe src="https://fast.com/ar/" frameborder="0" title="Speed Test" allow="autoplay; encrypted-media"></iframe>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', speedTestModalHTML);

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
    // 7. UI Enhancements (Scroll Progress & Floating WhatsApp)

    // Inject Scroll Progress Bar
    const scrollProgressHTML = `
        <div id="scroll-progress-container">
            <div id="scroll-progress-bar"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', scrollProgressHTML);

    // Inject Floating WhatsApp
    const floatingWhatsappHTML = `
        <a href="https://wa.me/9647777842422" class="floating-whatsapp" target="_blank" title="تواصل معنا عبر واتساب">
            <i class="fab fa-whatsapp"></i>
        </a>
    `;
    document.body.insertAdjacentHTML('beforeend', floatingWhatsappHTML);

    // Scroll Progress Logic
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;

        const progressBar = document.getElementById('scroll-progress-bar');
        if (progressBar) {
            progressBar.style.width = scrollPercentage + '%';
        }

        // Header Glass Effect Toggle
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // 8. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // 9. Consistent Viewer Count Logic (Max 3000)
    initConsistentViewers();
    setInterval(updateViewerCount, 5000); // Small updates every 5s

    function initConsistentViewers() {
        // Range: 2200 - 2950 (Realistic)
        let count = localStorage.getItem('mr7_viewer_count');
        if (!count) {
            count = Math.floor(Math.random() * (2950 - 2200 + 1) + 2200);
            localStorage.setItem('mr7_viewer_count', count);
        }
        updateDOMViewers(count);
    }

    function updateViewerCount() {
        let current = parseInt(localStorage.getItem('mr7_viewer_count')) || 2450;
        // Small fluctuation ±15
        const change = Math.floor(Math.random() * 31) - 15;
        let newCount = current + change;

        // Keep within logical bounds
        if (newCount < 1800) newCount = 1800; // Min floor
        if (newCount > 3200) newCount = 3200; // Max ceiling (slightly elastic)

        localStorage.setItem('mr7_viewer_count', newCount);
        updateDOMViewers(newCount);
    }

    function updateDOMViewers(count) {
        // Update both ID variants used in pages
        const ids = ['live-count-number', 'live-viewers-count'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.innerText = count.toLocaleString();
            }
        });
    }

});
