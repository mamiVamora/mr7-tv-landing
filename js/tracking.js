(function () {
    // Configuration
    // NOTE: In production, user must change this to their actual Bot/API URL
    const API_BASE = 'http://127.0.0.1:5000';

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function trackVisit() {
        const source = getQueryParam('source') || 'direct';
        const page = window.location.pathname.split('/').pop() || 'index.html';

        // Fire and forget visit tracking
        fetch(`${API_BASE}/api/track-visit?page=${page}&source=${source}`, {
            mode: 'cors'
        }).catch(err => console.debug('Tracking inactive'));
    }

    function trackDownload(deviceType) {
        console.log(`Tracking download for: ${deviceType}`);
        fetch(`${API_BASE}/api/track-download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ device: deviceType }),
            mode: 'cors'
        })
            .then(res => res.json())
            .then(data => console.log('Download tracked:', data))
            .catch(err => console.error('Download tracking failed:', err));
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        trackVisit();

        // Attach listeners to all download-related buttons
        const downloadButtons = document.querySelectorAll('a[href*="downloads"], .btn-download, .download-btn');

        downloadButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Try to guess device from text or class, default to 'generic'
                let device = 'generic';
                const text = btn.innerText.toLowerCase();
                const href = btn.getAttribute('href').toLowerCase();

                if (text.includes('android') || href.includes('apk')) device = 'android_v1';
                else if (text.includes('ios') || text.includes('iphone') || text.includes('apple')) device = 'ios';
                else if (text.includes('tv') || text.includes('smart')) device = 'tv';
                else if (text.includes('windows') || text.includes('pc')) device = 'windows';

                trackDownload(device);
            });
        });
    });
})();
