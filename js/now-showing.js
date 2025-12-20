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

    // 4. Update Live Stats (Now handled by global-enhancements.js for consistent count)
    // We only update the match count locally here if needed
});

// Global Ticker Data Array
let tickerData = [];

/**
 * تحميل وعرض المباريات المباشرة (Collapsible)
 */
async function loadLiveMatches() {
    const container = document.getElementById('matches-grid');
    if (!container) return;

    try {
        const matches = await footballAPI.getTodayMatches();
        container.innerHTML = '';
        tickerData = []; // Reset ticker data

        if (matches.length === 0) {
            container.innerHTML = '<div class="no-matches">لا توجد مباريات مباشرة حالياً.</div>';
            loadSmartTicker(); // Load ticker even if empty (will show old news or movies)
            return;
        }

        // 1. Group by League
        const matchesByLeague = {};
        matches.forEach(match => {
            const leagueName = match.competition.name || 'بطولات أخرى';
            if (!matchesByLeague[leagueName]) {
                matchesByLeague[leagueName] = [];
            }
            matchesByLeague[leagueName].push(match);

            // Add to Ticker Data
            addMatchToTicker(match);
        });

        // 2. Sort Leagues (Priority to Champions League, PL, La Liga)
        const priorityLeagues = ['UEFA Champions League', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga'];
        const sortedLeagueNames = Object.keys(matchesByLeague).sort((a, b) => {
            const indexA = priorityLeagues.indexOf(a);
            const indexB = priorityLeagues.indexOf(b);
            // If both are priority, sort by index. If one is priority, it comes first.
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });

        // 3. Display Groups (Accordion)
        sortedLeagueNames.forEach((leagueName, index) => {
            const leagueMatches = matchesByLeague[leagueName];
            const isPriority = index < 2; // Open first 2 leagues only

            const groupHTML = `
                <div class="competition-group ${isPriority ? 'open' : ''}" id="group-${index}">
                    <div class="competition-header" onclick="toggleCompetition('${index}')">
                        <h3 class="competition-title">
                            ${leagueName}
                            <span class="competition-count">${leagueMatches.length} مباريات</span>
                        </h3>
                        <i class="fas fa-chevron-down toggle-icon"></i>
                    </div>
                    <div class="competition-matches-grid">
                        ${leagueMatches.map(match => createMatchCard(match)).join('')}
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', groupHTML);
        });

        // Update Stats
        const liveCount = matches.filter(m => m.status === 'IN_PLAY').length;
        const totalCount = matches.length;
        document.getElementById('live-matches-count').innerText = liveCount > 0 ? liveCount : totalCount;

        // Load Ticker after matches are processed
        loadSmartTicker();

    } catch (error) {
        console.error('Error loading matches:', error);
        container.innerHTML = '<div class="error-msg">حدث خطأ في تحميل المباريات.</div>';
    }
}

// Toggle Accordion
window.toggleCompetition = function (index) {
    const group = document.getElementById(`group-${index}`);
    if (group) {
        group.classList.toggle('open');
    }
}

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
                <a href="downloads.html" class="channel-tag" style="background: rgba(124, 58, 237, 0.2); color: #a78bfa; border: 1px solid rgba(124, 58, 237, 0.3); text-decoration: none; display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-download"></i> حمل التطبيق للمشاهدة
                </a>
            </div>
        </div>
    `;
}

function addMatchToTicker(match) {
    if (match.status === 'IN_PLAY' || match.status === 'PAUSED') {
        tickerData.push({
            type: 'live',
            text: `⚽ مباشر: ${match.homeTeam.name} ${match.score.fullTime.home} - ${match.score.fullTime.away} ${match.awayTeam.name}`
        });
    } else if (match.status === 'FINISHED') {
        tickerData.push({
            type: 'finished',
            text: `🏁 انتهت: ${match.homeTeam.name} ${match.score.fullTime.home} - ${match.score.fullTime.away} ${match.awayTeam.name} - شاهد الإعادة على التطبيق`
        });
    }
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

            // Add to ticker (first 3 only)
            if (index < 3) {
                tickerData.push({
                    type: 'new',
                    text: `🎬 جديد: فيلم ${movie.title} مترجم للعربية`
                });
            }

            const movieCard = `
                <div class="media-card" tabindex="0" title="${movie.title}">
                    <span class="media-badge-translated">مترجم</span>
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

        // Update ticker UI after Movies loaded
        updateTickerUI();

    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

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
                    <span class="media-badge-translated">مترجم</span>
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
    }
}

function loadSmartTicker() {
    // Just ensures functions are called in order, actual update happens in updateTickerUI
}

function updateTickerUI() {
    const tickerEl = document.getElementById('smart-news-ticker');
    if (!tickerEl || tickerData.length === 0) return;

    const tickerHTML = tickerData.map(item => {
        let tagClass = '';
        let tagText = '';
        if (item.type === 'live') { tagClass = 'tag-live'; tagText = 'مباشر'; }
        else if (item.type === 'finished') { tagClass = 'tag-finished'; tagText = 'انتهت'; }
        else if (item.type === 'new') { tagClass = 'tag-new'; tagText = 'جديد'; }

        return `
            <span class="ticker-item">
                <span class="ticker-tag ${tagClass}">${tagText}</span>
                ${item.text}
            </span>
        `;
    }).join('');

    // Duplicate content for smooth infinite scroll
    tickerEl.innerHTML = tickerHTML + tickerHTML;
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
