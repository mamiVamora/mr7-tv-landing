/**
 * Advanced Analytics Integration
 * Supports Google Analytics 4, Microsoft Clarity, and custom Event Tracking
 */

const ANALYTICS_CONFIG = {
    GA4_ID: 'G-XXXXXXXXXX', // Replace with your GA4 Measurement ID
    CLARITY_ID: 'cnxxxxxxx' // Replace with your Clarity Project ID
};

document.addEventListener('DOMContentLoaded', () => {
    initGoogleAnalytics();
    initMicrosoftClarity();
    initEventTracking();
});

// 1. Google Analytics 4
function initGoogleAnalytics() {
    if (ANALYTICS_CONFIG.GA4_ID === 'G-XXXXXXXXXX') return;

    // Load Script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_ID}`;
    document.head.appendChild(script);

    // Initialize
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.GA4_ID);
}

// 2. Microsoft Clarity (Heatmaps & Session Recording)
function initMicrosoftClarity() {
    if (ANALYTICS_CONFIG.CLARITY_ID === 'cnxxxxxxx') return;

    (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", ANALYTICS_CONFIG.CLARITY_ID);
}

// 3. Custom Event Tracking
function initEventTracking() {
    // Track Button Clicks
    document.querySelectorAll('a.btn, a.btn-enhanced, button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnText = btn.innerText.trim();
            const btnLink = btn.getAttribute('href') || 'button';

            // Log to console for now (dev mode)
            console.log(`[Analytics] Click: ${btnText} -> ${btnLink}`);

            // Send to GA4 if active
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    'event_category': 'CTA',
                    'event_label': btnText,
                    'transport_type': 'beacon'
                });
            }
        });
    });

    // Track WhatsApp Clicks specifically
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'convert', {
                    'event_category': 'WhatsApp',
                    'event_label': 'Lead'
                });
            }
        });
    });
}
