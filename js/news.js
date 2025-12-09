// News Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    let allNews = [];
    let currentFilter = 'all';

    // Load news from API
    async function loadNews() {
        try {
            // Fetch from the live bot API
            const response = await fetch('https://mr7-tv-bot.onrender.com/api/news');
            const data = await response.json();
            allNews = data.news;
            displayNews(allNews);
        } catch (error) {
            console.warn('API connection failed, falling back to local news.json');
            try {
                // Fallback: Load local JSON file
                const localResponse = await fetch('news.json');
                const localData = await localResponse.json();
                allNews = localData.news;
                displayNews(allNews);
            } catch (localError) {
                console.error('Error loading local news:', localError);
                document.getElementById('newsGrid').innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>حدث خطأ في تحميل الأخبار</p>
                    </div>
                `;
            }
        }
    }

    // Display news items
    function displayNews(newsItems) {
        const newsGrid = document.getElementById('newsGrid');
        const noResults = document.getElementById('noResults');

        if (newsItems.length === 0) {
            newsGrid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        newsGrid.innerHTML = newsItems.map(item => `
            <article class="news-card" data-category="${item.category}" data-aos="fade-up">
                ${item.featured ? '<div class="featured-badge"><i class="fas fa-star"></i> مميز</div>' : ''}
                <div class="news-image">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='images/logo.jpg'">
                    <div class="category-badge ${item.category}">
                        ${getCategoryIcon(item.category)} ${getCategoryName(item.category)}
                    </div>
                </div>
                <div class="news-content">
                    <div class="news-meta">
                        <span class="news-date">
                            <i class="far fa-calendar"></i> ${formatDate(item.date)}
                        </span>
                    </div>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-description">${item.description}</p>
                    <a href="#" class="news-link">
                        اقرأ المزيد <i class="fas fa-arrow-left"></i>
                    </a>
                </div>
            </article>
        `).join('');

        // Re-initialize AOS for new elements
        AOS.refresh();
    }

    // Get category icon
    function getCategoryIcon(category) {
        const icons = {
            'sports': '<i class="fas fa-futbol"></i>',
            'movies': '<i class="fas fa-film"></i>',
            'series': '<i class="fas fa-tv"></i>',
            'offers': '<i class="fas fa-gift"></i>'
        };
        return icons[category] || '<i class="fas fa-newspaper"></i>';
    }

    // Get category name in Arabic
    function getCategoryName(category) {
        const names = {
            'sports': 'رياضة',
            'movies': 'أفلام',
            'series': 'مسلسلات',
            'offers': 'عروض'
        };
        return names[category] || 'أخبار';
    }

    // Format date to Arabic
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ar-SA', options);
    }

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Get filter value
            currentFilter = this.getAttribute('data-filter');

            // Filter news
            filterNews();
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        filterNews();
    });

    // Filter news based on category and search
    function filterNews() {
        let filteredNews = allNews;

        // Filter by category
        if (currentFilter !== 'all') {
            filteredNews = filteredNews.filter(item => item.category === currentFilter);
        }

        // Filter by search term
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filteredNews = filteredNews.filter(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm)
            );
        }

        displayNews(filteredNews);
    }

    // Initialize
    loadNews();
});
