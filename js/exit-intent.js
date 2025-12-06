/**
 * Exit Intent Popup Logic
 * Detects when user tries to leave the page and shows a special offer
 */

document.addEventListener('DOMContentLoaded', () => {
    initExitIntent();
});

function initExitIntent() {
    // Check if already shown in this session
    if (sessionStorage.getItem('exitPopupShown')) return;

    let showPopup = true;

    // Detect mouse leaving the viewport (Desktop)
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0 && showPopup) {
            triggerPopup();
        }
    });

    // Mobile backup: Show after 40 seconds if not shown
    setTimeout(() => {
        if (showPopup && !sessionStorage.getItem('exitPopupShown')) {
            triggerPopup();
        }
    }, 40000);

    function triggerPopup() {
        if (sessionStorage.getItem('exitPopupShown')) return;

        createPopup();
        showPopup = false;
        sessionStorage.setItem('exitPopupShown', 'true');
    }
}

function createPopup() {
    const popupHTML = `
        <div class="exit-popup-overlay" id="exitPopup">
            <div class="exit-popup-content slide-in-top">
                <button class="close-popup">&times;</button>
                <div class="popup-header">
                    <span class="popup-icon">🎁</span>
                    <h2>انتظر! لا تفوت هذه الفرصة</h2>
                </div>
                <div class="popup-body">
                    <p class="highlight-offer">احصل على <strong>شهر إضافي مجاناً</strong> عند اشتراكك في باقة السنة!</p>
                    <p class="sub-text">هذا العرض خاص بك ومتاح لمدة <strong>5 دقائق</strong> فقط.</p>
                    
                    <div class="popup-timer" id="popup-timer">05:00</div>
                    
                    <a href="https://wa.me/905340218618?text=مرحباً، أريد الاستفادة من عرض الشهر الإضافي المجاني قبل المغادرة!" class="btn-claim pulse-btn" target="_blank">
                        <i class="fab fa-whatsapp"></i> احصل على العرض الآن
                    </a>
                    
                    <button class="btn-decline">لا شكراً، لا أريد هدايا مجانية</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupHTML);

    const popup = document.getElementById('exitPopup');
    const closeBtn = popup.querySelector('.close-popup');
    const declineBtn = popup.querySelector('.btn-decline');

    // Close logic
    const close = () => {
        popup.classList.add('fade-out');
        setTimeout(() => popup.remove(), 400); // Wait for animation
    };

    closeBtn.addEventListener('click', close);
    declineBtn.addEventListener('click', close);

    // Close on clicking overlay
    popup.addEventListener('click', (e) => {
        if (e.target === popup) close();
    });

    // Start 5 minute timer
    startPopupTimer(popup.querySelector('#popup-timer'));
}

function startPopupTimer(displayElement) {
    let duration = 60 * 5; // 5 minutes
    const timer = setInterval(() => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        displayElement.textContent =
            `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

        if (--duration < 0) {
            clearInterval(timer);
            displayElement.textContent = "00:00";
            displayElement.style.color = "#ef4444"; // Turn red
        }
    }, 1000);
}
