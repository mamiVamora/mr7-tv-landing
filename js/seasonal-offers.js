/**
 * Seasonal Offers Logic
 * Handles the display of the seasonal offer banner and countdown timer
 */

document.addEventListener('DOMContentLoaded', () => {
    initSeasonalBanner();
});

function initSeasonalBanner() {
    // 1. Create Banner Element
    const existingBanner = document.querySelector('.seasonal-offer-banner');
    if (existingBanner) return; // Prevent duplicate

    const banner = document.createElement('div');
    banner.className = 'seasonal-offer-banner slide-down';

    // حساب الوقت المتبقي (مثلاً 3 أيام من الآن)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3); // ينتهي بعد 3 أيام

    banner.innerHTML = `
        <div class="offer-content">
            <span class="offer-icon">🎁</span>
            <span class="offer-text">
                <strong>عرض خاص لفترة محدودة!</strong> 
                احصل على باقة القنوات العالمية والمكتبة الشاملة بأقوى العروض.
            </span>
            <div class="offer-countdown" id="offer-countdown">
                <div class="time-unit">
                    <span class="num" id="days">03</span>
                    <span class="label">يوم</span>
                </div>
                <span class="sep">:</span>
                <div class="time-unit">
                    <span class="num" id="hours">00</span>
                    <span class="label">ساعة</span>
                </div>
                <span class="sep">:</span>
                <div class="time-unit">
                    <span class="num" id="minutes">00</span>
                    <span class="label">دقيقة</span>
                </div>
                <span class="sep">:</span>
                <div class="time-unit">
                    <span class="num" id="seconds">00</span>
                    <span class="label">ثانية</span>
                </div>
            </div>
            <a href="contact.html" class="offer-btn pulse-btn-white">تواصل معنا الآن <i class="fas fa-arrow-left"></i></a>
            <button class="close-banner" aria-label="إغلاق العرض">&times;</button>
        </div>
    `;

    // Insert at the top of MAIN element (to avoid covering fixed header)
    const main = document.querySelector('main');
    if (main) {
        main.prepend(banner);
    } else {
        document.body.prepend(banner);
    }

    // 2. Start Countdown
    startCountdown(endDate);

    // 3. Handle Close Button
    const closeBtn = banner.querySelector('.close-banner');
    closeBtn.addEventListener('click', () => {
        banner.classList.add('slide-up');
        setTimeout(() => banner.remove(), 500);
        // Save state to localStorage to not show again for this session (optional)
        // sessionStorage.setItem('offerBannerClosed', 'true');
    });
}

function startCountdown(endTime) {
    function updateTimer() {
        const total = Date.parse(endTime) - Date.parse(new Date());

        if (total <= 0) {
            // Reset timer automatically for endless scarcity loop or hide
            endTime.setDate(endTime.getDate() + 2); // Extend 2 days
            return;
        }

        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    updateTimer(); // Run once immediately
    setInterval(updateTimer, 1000); // Update every second
}
