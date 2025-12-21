/**
 * Global Enhancements Functionality
 * Contact Form to WhatsApp
 * Honest Speed Test
 */

// Function to send contact form data to WhatsApp
function sendContactWhatsapp() {
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    if (!name || !message) {
        alert('يرجى ملء الاسم والرسالة');
        return;
    }

    const phoneNumber = "9647777842422";
    const text = `مرحباً، اسمي ${name}.%0A${message}`;

    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
}

// Honest Speed Test Logic
async function runSpeedTest() {
    const resultElement = document.getElementById('speed-result');
    const resultText = document.getElementById('speed-text');
    const resultIcon = document.getElementById('speed-icon');
    const adviceText = document.getElementById('speed-advice');

    resultElement.style.display = 'block';
    resultText.innerHTML = 'جاري قياس السرعة... <i class="fas fa-spinner fa-spin"></i>';
    resultIcon.className = '';
    adviceText.innerHTML = '';

    try {
        // REAL speed test using Cloudflare CDN
        const testUrl = 'https://speed.cloudflare.com/__down?bytes=25000000';
        const fileSizeMB = 25;

        const startTime = performance.now();
        const response = await fetch(testUrl, {
            method: 'GET',
            cache: 'no-store',
            mode: 'cors'
        });

        if (!response.ok) throw new Error('Network error');

        await response.blob();
        const endTime = performance.now();

        const durationSeconds = (endTime - startTime) / 1000;
        const speedMbps = (fileSizeMB * 8) / durationSeconds;
        const finalSpeed = speedMbps.toFixed(1);

        let message = "";
        let icon = "";
        let colorClass = "";
        let recommendedQuality = "";

        if (speedMbps >= 20) {
            message = `السرعة ممتازة! يمكنك المشاهدة بوضوح تام بدون تقطيع بجودة`;
            recommendedQuality = "4K";
            icon = "fas fa-rocket";
            colorClass = "text-success";
        } else if (speedMbps >= 8) {
            message = `السرعة جيدة! ننصحك بالمشاهدة بجودة`;
            recommendedQuality = "FHD";
            icon = "fas fa-check-circle";
            colorClass = "text-warning";
        } else {
            message = `السرعة مقبولة. ننصحك بالمشاهدة بجودة`;
            recommendedQuality = "HD أو SD";
            icon = "fas fa-exclamation-triangle";
            colorClass = "text-danger";
        }

        const qualityColor = speedMbps >= 20 ? '#10b981' : speedMbps >= 8 ? '#fbbf24' : '#ef4444';
        const fullMessage = `${message} <strong style="color: ${qualityColor}; font-size: 1.3em; font-weight: 900; text-shadow: 0 0 15px ${qualityColor}; display: inline-block; padding: 0 8px; background: ${qualityColor}20; border-radius: 6px;">${recommendedQuality}</strong>`;

        resultText.innerHTML = `سرعتك: ${finalSpeed} Mbps`;
        resultIcon.className = icon + " " + colorClass;
        adviceText.className = "speed-advice-box " + colorClass;
        adviceText.innerHTML = fullMessage;

    } catch (e) {
        console.error('Speed test error:', e);
        resultText.innerHTML = 'تعذر قياس السرعة';
        adviceText.innerHTML = 'لكن لا تقلق! سيرفراتنا تتكيف تلقائياً مع جميع السرعات لضمان أفضل تجربة مشاهدة.';
        resultIcon.className = 'fas fa-info-circle';
    }
}
