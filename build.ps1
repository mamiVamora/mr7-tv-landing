# PowerShell Build Script for MR7 TV Landing Page
# This script merges all HTML sections into a single index.html file

$outputFile = "index.html"
$sectionsDir = "sections"

# Header Content (Static)
$header = @"
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MR7 TV - عالمك الترفيهي بين يديك</title>
    <meta name="description" content="شاهد المباريات، الأفلام، والمسلسلات - تطبيق MR7 TV متوفر على جميع المنصات">
    <link rel="stylesheet" href="css/style.css">
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- AOS Animation Library -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
</head>

<body>
    <!-- Particles Background -->
    <div id="particles-js"></div>

    <!-- Header -->
    <header>
        <div class="container">
            <nav>
                <a href="#" class="logo">
                    <img src="logo.jpg" alt="MR7 TV Logo">
                </a>
                <ul class="nav-links">
                    <li><a href="#home">الرئيسية</a></li>
                    <li><a href="#social">متابعينا</a></li>
                    <li><a href="#services">خدماتنا</a></li>
                    <li><a href="#pricing">الباقات</a></li>
                    <li><a href="#features">المميزات</a></li>
                    <li><a href="#gallery">المعرض</a></li>
                    <li><a href="#faq">الأسئلة الشائعة</a></li>
                    <li><a href="#downloads">التحميلات</a></li>
                    <li><a href="#contact">تواصل معنا</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
"@

# Footer Content (Static)
$footer = @"
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2025 MR7 TV. جميع الحقوق محفوظة.</p>
        </div>
    </footer>

    <!-- Particles.js Script -->
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>

    <!-- AOS Animation Script -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

    <!-- Custom Scripts -->
    <script>
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true
        });

        // Particles.js Configuration
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#7c3aed' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#7c3aed',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                }
            },
            retina_detect: true
        });

        // Parallax Effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-content');

            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // FAQ Accordion
        document.addEventListener('click', function(e) {
            if (e.target.closest('.faq-question')) {
                const question = e.target.closest('.faq-question');
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');

                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Open clicked item if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            }
        });

        // Social Media Counter Animation
        const socialSection = document.querySelector('#social');
        if (socialSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counters = entry.target.querySelectorAll('.social-number');
                        counters.forEach(counter => {
                            if (!counter.classList.contains('animated')) {
                                counter.classList.add('animated');
                                animateCounter(counter);
                            }
                        });
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(socialSection);
        }

        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target.toLocaleString() + '+';
                }
            };

            updateCounter();
        };
    </script>
</body>
</html>
"@

# Define section order
$sections = @(
    "hero.html",
    "social.html",
    "services.html",
    "pricing.html",
    "features.html",
    "refund-policy.html",
    "gallery.html",
    "become-agent.html",
    "faq.html",
    "downloads.html",
    "contact.html"
)

# Start writing to file
Set-Content -Path $outputFile -Value $header -Encoding UTF8

# Append each section
foreach ($section in $sections) {
    $path = Join-Path $sectionsDir $section
    if (Test-Path $path) {
        $content = Get-Content -Path $path -Raw -Encoding UTF8
        Add-Content -Path $outputFile -Value "`n<!-- Section: $section -->`n" -Encoding UTF8
        Add-Content -Path $outputFile -Value $content -Encoding UTF8
    } else {
        Write-Host "Warning: Section $section not found!" -ForegroundColor Yellow
    }
}

# Append footer
Add-Content -Path $outputFile -Value $footer -Encoding UTF8

Write-Host "Build completed successfully! index.html has been updated." -ForegroundColor Green
