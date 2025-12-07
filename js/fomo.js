/**
 * FOMO (Fear Of Missing Out) Elements Logic
 * Handles urgency badges only (Countdown logic removed by user request)
 */

document.addEventListener('DOMContentLoaded', () => {
    // initSmartCountdown(); // Disabled
    injectUrgencyBadges();
});

/**
 * Inject Urgency Badges
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
