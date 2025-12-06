/**
 * FOMO (Fear Of Missing Out) Elements Logic
 * Handles smart countdowns and urgency badges
 */

document.addEventListener('DOMContentLoaded', () => {
    initSmartCountdown();
    injectUrgencyBadges();
});

/**
 * 1. Smart Countdown Timer
 * Finds the existing #countdown element and makes it "smart" (always ending soon).
 */
function initSmartCountdown() {
    const countdownContainer = document.getElementById('countdown');
    if (!countdownContainer) return;

    // Set end time to: Today at 23:59:59 OR if passed, next day 23:59:59
    // This creates a sense of "Ends Tonight!"
    const now = new Date();
    let endTime = new Date();
    endTime.setHours(23, 59, 59, 999);

    // If it's already late night (e.g. 23:55), push to tomorrow to avoid negative panic
    if (endTime.getTime() - now.getTime() < 1000 * 60 * 60) { // Less than 1 hour remains
        // Alternative strategy: 4 hour countdown loop
        endTime = new Date(now.getTime() + (4 * 60 * 60 * 1000));
    }

    // Add "Urgency Message" above timer
    const message = document.createElement('div');
    message.className = 'urgency-message pulse-text-red';
    message.innerHTML = '🔥 سارع بالاشتراك! تبقى <strong>3 باقات</strong> فقط بسعر العرض';

    // Insert before the timer items, inside the container
    countdownContainer.parentElement.insertBefore(message, countdownContainer);

    function update() {
        const t = Date.parse(endTime) - Date.parse(new Date());

        // If expired, reset to 4 hours later
        if (t <= 0) {
            endTime = new Date(new Date().getTime() + (4 * 60 * 60 * 1000));
            update();
            return;
        }

        const days = Math.floor(t / (1000 * 60 * 60 * 24));
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const seconds = Math.floor((t / 1000) % 60);

        // Update DOM
        updateElement('days', days);
        updateElement('hours', hours);
        updateElement('minutes', minutes);
        updateElement('seconds', seconds);
    }

    function updateElement(id, value) {
        const el = document.getElementById(id);
        if (el) el.innerText = ('0' + value).slice(-2);
    }

    update();
    setInterval(update, 1000);
}

/**
 * 2. Inject Urgency Badges
 * Adds "Best Seller" or "Limited Offer" badges to pricing cards
 */
function injectUrgencyBadges() {
    const pricingCards = document.querySelectorAll('.pricing-card');

    pricingCards.forEach((card, index) => {
        // Logic to assign badges
        if (index === 1) { // Assuming 2nd card is the "Best Value" usually (6 Months)
            addBadge(card, 'الأكثر مبيعاً 🏆', 'badge-best-seller');
            addLowStockIndicator(card, 'تبقى 4 فقط');
        } else if (index === 2) { // 3rd card (1 Year)
            addBadge(card, 'توفير هائل 💰', 'badge-best-value');
        }
    });
}

function addBadge(card, text, className) {
    // Check if badge already exists (from HTML) to avoid double
    if (card.querySelector('.offer-badge') || card.querySelector('.fomo-badge')) return;

    const badge = document.createElement('div');
    badge.className = `fomo-badge ${className} pop-in`;
    badge.innerText = text;
    card.appendChild(badge);

    // Ensure card has relative positioning
    if (getComputedStyle(card).position === 'static') {
        card.style.position = 'relative';
    }
}

function addLowStockIndicator(card, text) {
    const body = card.querySelector('.card-body');
    if (!body) return;

    const indicator = document.createElement('div');
    indicator.className = 'low-stock-indicator';
    indicator.innerHTML = `
        <div class="progress-bar-container">
            <div class="progress-bar" style="width: 85%"></div>
        </div>
        <span class="stock-text">${text}</span>
    `;

    // Insert before the button
    const btn = body.querySelector('.btn');
    if (btn) {
        body.insertBefore(indicator, btn);
    } else {
        body.appendChild(indicator);
    }
}
