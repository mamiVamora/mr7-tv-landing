/**
 * Now Showing Page Logic
 * Handles loading and displaying live matches, movies, and TV shows
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Particles
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: '#7c3aed' },
                shape: { type: 'circle' },
                opacity: { value: 0.3, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#7c3aed', opacity: 0.2, width: 1 },
                move: { enable: true, speed: 1.5 }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'bubble' }, onclick: { enable: true, mode: 'push' } },
                modes: { bubble: { distance: 200, size: 6, opacity: 0.6 } }
            }
        });
    }

    // 2. Load Content
    loadLiveMatches();
    loadLatestMovies();
    loadLatestTVShows();

    // 3. Initialize Carousels
    setupCarousel('movies-grid', 'prev-movies', 'next-movies');
    setupCarousel('series-grid', 'prev-series', 'next-series');

    // 4. Update Live Stats
    updateLiveStats();
    setInterval(updateLiveStats, 5000); // تحديث كل 5 ثواني
});

/**
 * تحميل وعرض المباريات المباشرة
 */
/**
 * تحميل وعرض المباريات المباشرة (مجمعة حسب البطولة)
 */
async function loadLiveMatches() {
    const container = document.getElementById('matches-grid');
    if (!container) return;

    try {
        const matches = await footballAPI.getTodayMatches();
        container.innerHTML = ''; // مسح المحتوى القديم

        if (matches.length === 0) {
            container.innerHTML = '<div class="no-matches">لا توجد مباريات مباشرة حالياً.</div>';
            return;
        }

        // 1. تجميع المباريات حسب البطولة
        const matchesByLeague = {};
        matches.forEach(match => {
            const leagueName = match.competition.name || 'بطولات أخرى';
            if (!matchesByLeague[leagueName]) {
                matchesByLeague[leagueName] = [];
            }
            matchesByLeague[leagueName].push(match);
        });

        // 2. عرض كل بطولة في قسم منفصل
        Object.keys(matchesByLeague).forEach((leagueName, groupIndex) => {
            const leagueMatches = matchesByLeague[leagueName];

            // إنشاء هيكل القسم (Header + Grid)
            const groupHTML = `
                <div class="competition-group" data-aos="fade-up" data-aos-delay="${groupIndex * 100}">
                    <div class="competition-header">
                        <h3 class="competition-title">
                            ${leagueName}
                            <span class="competition-count">${leagueMatches.length} مباريات</span>
                        </h3>
                    </div>
                    <div class="competition-matches-grid">
                        ${leagueMatches.map(match => createMatchCard(match)).join('')}
                    </div>
                </div>
            `;

            container.insertAdjacentHTML('beforeend', groupHTML);
        });

        // تحديث إحصائية العدد الإجمالي
        const liveCount = matches.filter(m => m.status === 'IN_PLAY').length;
        const totalCount = matches.length;
        document.getElementById('live-matches-count').innerText = liveCount > 0 ? liveCount : totalCount;

    } catch (error) {
        console.error('Error loading matches:', error);
        container.innerHTML = '<div class="error-msg">حدث خطأ في تحميل المباريات.</div>';
    }
}

/**
 * إنشاء بطاقة المباراة (بدون اسم القناة)
 */
function createMatchCard(match) {
    const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
    const statusClass = isLive ? 'live' : '';
    const statusText = footballAPI.getMatchStatus(match.status);
    const time = footballAPI.formatMatchTime(match.utcDate);

    return `
        <div class="match-card ${isLive ? 'live-match' : (match.status === 'FINISHED' ? 'finished-match' : '')}" tabindex="0">
            <div class="match-header">
                <span class="match-status ${statusClass}">${statusText}</span>
            </div>
            <div class="teams-container">
                <div class="team home">
                    <img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}" class="team-logo" onerror="this.src='images/logo-new.jpg'">
                    <span class="team-name">${match.homeTeam.name}</span>
                </div>
                <div class="match-score-time">
                    ${(isLive || match.status === 'FINISHED') ?
            `<span class="match-score ${isLive ? 'pulse-text' : ''}">${match.score.fullTime.home} - ${match.score.fullTime.away}</span>` :
            `<span class="match-time">${time}</span>`
        }
                </div>
                <div class="team away">
                    <img src="${match.awayTeam.crest}" alt="${match.awayTeam.name}" class="team-logo" onerror="this.src='images/logo-new.jpg'">
                    <span class="team-name">${match.awayTeam.name}</span>
                </div>
            </div>
            <div class="match-footer" style="display: flex !important; justify-content: center; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                <span class="channel-tag" style="background: rgba(124, 58, 237, 0.2); color: #a78bfa; border: 1px solid rgba(124, 58, 237, 0.3);"><i class="fas fa-mobile-alt"></i> شاهدها على MR7 TV</span>
            </div>
        </div>
    `;
}

async function loadLatestMovies() {
    const container = document.getElementById('movies-grid');
    if (!container) return;

    try {
        const movies = await tmdbAPI.getLatestMovies();
        container.innerHTML = '';

        movies.forEach((movie, index) => {
            const posterUrl = tmdbAPI.getImageURL(movie.poster_path);
            const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

            const movieCard = `
                <div class="media-card" tabindex="0" title="${movie.title}">
                    <img src="${posterUrl}" alt="${movie.title}" class="media-poster" loading="lazy">
                    <div class="media-info">
                        <h3 class="media-title">${movie.title}</h3>
                        <div class="media-details">
                            <span class="media-rating"><i class="fas fa-star text-gold"></i> ${rating}</span>
                            <span class="media-year">${year}</span>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', movieCard);
        });
    } catch (error) {
        console.error('Error loading movies:', error);
        container.innerHTML = '<div class="error-msg">حدث خطأ في تحميل الأفلام.</div>';
    }
}

/**
 * تحميل وعرض أحدث المسلسلات
 */
async function loadLatestTVShows() {
    const container = document.getElementById('series-grid');
    if (!container) return;

    try {
        const shows = await tmdbAPI.getLatestTVShows();
        container.innerHTML = '';

        shows.forEach((show, index) => {
            const posterUrl = tmdbAPI.getImageURL(show.poster_path);
            const year = show.first_air_date ? show.first_air_date.split('-')[0] : 'N/A';
            const rating = show.vote_average ? show.vote_average.toFixed(1) : 'N/A';

            const showCard = `
                <div class="media-card" tabindex="0" title="${show.name}">
                    <img src="${posterUrl}" alt="${show.name}" class="media-poster" loading="lazy">
                    <div class="media-info">
                        <h3 class="media-title">${show.name}</h3>
                        <div class="media-details">
                            <span class="media-rating"><i class="fas fa-star text-gold"></i> ${rating}</span>
                            <span class="media-year">${year}</span>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', showCard);
        });
    } catch (error) {
        console.error('Error loading TV shows:', error);
        container.innerHTML = '<div class="error-msg">حدث خطأ في تحميل المسلسلات.</div>';
    }
}

/**
 * إعداد Carousel للتمرير
 */
function setupCarousel(containerId, prevBtnId, nextBtnId) {
    const container = document.getElementById(containerId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    if (!container || !prevBtn || !nextBtn) return;

    const scrollAmount = 300;

    prevBtn.addEventListener('click', () => {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
}

/**
 * تحديث الإحصائيات الحية (وهمي ذكي)
 */
function updateLiveStats() {
    const viewersEl = document.getElementById('live-viewers-count');
    if (viewersEl) {
        // رقم عشوائي بين 2500 و 3500 يتغير قليلاً
        let current = parseInt(viewersEl.innerText.replace(/,/g, '')) || 2850;
        const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
        let newCount = current + change;

        // حدود منطقية
        if (newCount < 2500) newCount = 2500;
        if (newCount > 3500) newCount = 3500;

        viewersEl.innerText = newCount.toLocaleString();
    }
}
