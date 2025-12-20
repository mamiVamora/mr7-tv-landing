/**
 * TMDB API Integration
 * The Movie Database API for fetching movies and TV shows
 * Free API Key required from: https://www.themoviedb.org/settings/api
 */

class TMDB_API {
    constructor() {
        // API Key - يجب على المستخدم وضع مفتاحه هنا
        // احصل على مفتاح مجاني من: https://www.themoviedb.org/settings/api
        this.apiKey = 'de6de214cd04b7d03ddeb93532a5dd0f'; // ضع مفتاحك هنا
        this.baseURL = 'https://api.themoviedb.org/3';
        this.imageBaseURL = 'https://image.tmdb.org/t/p';
    }

    /**
     * جلب أحدث الأفلام
     * @param {number} page - رقم الصفحة
     * @returns {Promise} - قائمة الأفلام
     */
    async getLatestMovies(page = 1) {
        try {
            const url = `${this.baseURL}/movie/now_playing?api_key=${this.apiKey}&language=ar&page=${page}&region=SA`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.results.slice(0, 20); // أحدث 20 فيلم
        } catch (error) {
            console.error('خطأ في جلب الأفلام:', error);
            return this.getMockMovies(); // بيانات تجريبية في حالة الخطأ
        }
    }

    /**
     * جلب أحدث المسلسلات
     * @param {number} page - رقم الصفحة
     * @returns {Promise} - قائمة المسلسلات
     */
    async getLatestTVShows(page = 1) {
        try {
            const url = `${this.baseURL}/tv/on_the_air?api_key=${this.apiKey}&language=ar&page=${page}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.results.slice(0, 20); // أحدث 20 مسلسل
        } catch (error) {
            console.error('خطأ في جلب المسلسلات:', error);
            return this.getMockTVShows(); // بيانات تجريبية في حالة الخطأ
        }
    }

    /**
     * الحصول على رابط الصورة
     * @param {string} path - مسار الصورة
     * @param {string} size - حجم الصورة (w500, w780, original)
     * @returns {string} - رابط الصورة الكامل
     */
    getImageURL(path, size = 'w500') {
        if (!path) return 'images/logo-new.jpg'; // صورة افتراضية
        return `${this.imageBaseURL}/${size}${path}`;
    }

    /**
     * بيانات تجريبية للأفلام (في حالة عدم وجود API key)
     */
    getMockMovies() {
        return [
            {
                id: 1,
                title: 'Oppenheimer',
                overview: 'قصة مخترع القنبلة الذرية روبرت أوبنهايمر، والصراعات النفسية والسياسية التي واجهها خلال مشروع مانهاتن.',
                poster_path: null,
                vote_average: 8.5,
                release_date: '2023-07-21'
            },
            {
                id: 2,
                title: 'Barbie',
                overview: 'باربي تعيش في عالم باربي لاند المثالي، ولكن عندما تضطر للذهاب إلى العالم الحقيقي، تكتشف حقائق جديدة.',
                poster_path: null,
                vote_average: 7.2,
                release_date: '2023-07-21'
            },
            {
                id: 3,
                title: 'John Wick: Chapter 4',
                overview: 'يكتشف جون ويك طريقة لهزيمة الطاولة العليا، ولكن قبل أن يتمكن من كسب حريته، يجب عليه مواجهة عدو جديد.',
                poster_path: null,
                vote_average: 8.0,
                release_date: '2023-03-24'
            },
            {
                id: 4,
                title: 'Mission: Impossible',
                overview: 'إيثان هانت وفريقه في مهمة جديدة لإنقاذ العالم من سلاح مرعب يهدد البشرية.',
                poster_path: null,
                vote_average: 7.8,
                release_date: '2023-07-12'
            }
        ];
    }

    /**
     * بيانات تجريبية للمسلسلات (في حالة عدم وجود API key)
     */
    getMockTVShows() {
        return [
            {
                id: 1,
                name: 'House of the Dragon',
                overview: 'قصة حرب أهليّة داخل منزل تارجارين، تقع أحداثها قبل 200 عام من أحداث صراع العروش.',
                poster_path: null,
                vote_average: 8.5,
                first_air_date: '2022-08-21',
                number_of_seasons: 2
            },
            {
                id: 2,
                name: 'The Last of Us',
                overview: 'بعد تدمير حضارة حديثة، يتم استئجار مهرب متمرس لتهريب فتاة تبلغ من العمر 14 عامًا من منطقة حجر صحي قمعية.',
                poster_path: null,
                vote_average: 8.8,
                first_air_date: '2023-01-15',
                number_of_seasons: 1
            },
            {
                id: 3,
                name: 'Succession',
                overview: 'عائلة روي المعروفة بسيطرتها على أكبر شركة إعلامية وترفيهية في العالم، والصراعات الداخلية للسيطرة عليها.',
                poster_path: null,
                vote_average: 8.9,
                first_air_date: '2018-06-03',
                number_of_seasons: 4
            },
            {
                id: 4,
                name: 'Stranger Things',
                overview: 'تظهر قوى شريرة خارقة للطبيعة وتبدأ في تهديد بلدة صغيرة، بينما يحاول مجموعة من الأطفال كشف الأسرار.',
                poster_path: null,
                vote_average: 8.7,
                first_air_date: '2016-07-15',
                number_of_seasons: 4
            }
        ];
    }
}

// تصدير instance واحد
const tmdbAPI = new TMDB_API();
