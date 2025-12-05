(function () {
    // Configuration - CHANGE THIS TO YOUR BOT URL IN PRODUCTION
    // For local testing: http://127.0.0.1:5000
    // For production: https://your-bot-domain.com
    const API_BASE = 'http://127.0.0.1:5000';

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function trackVisit() {
        const source = getQueryParam('source') || 'direct';
        const page = window.location.pathname.split('/').pop() || 'index.html';

        // Fire and forget
        fetch(`${API_BASE}/api/track-visit?page=${page}&source=${source}`, {
            mode: 'cors'
        })
            .then(response => console.log('MR7 Analytics: Visit tracked'))
            .catch(error => console.warn('MR7 Analytics: Tracking server unreachable (might be offline or blocked)'));
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackVisit);
    } else {
        trackVisit();
    }
})();
