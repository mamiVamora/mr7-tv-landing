/**
 * Live Viewers & Subscribers Counter
 * Creates a sense of activity and social proof
 */

document.addEventListener('DOMContentLoaded', () => {
    initLiveViewers();
    initRecentSubscriptions();
});

function initLiveViewers() {
    // إنشاء عنصر العداد العائم
    const viewerBadge = document.createElement('div');
    viewerBadge.className = 'live-viewer-badge slide-in-bottom';
    viewerBadge.innerHTML = `
        <div class="viewer-content">
            <span class="pulse-dot"></span>
            <span class="viewer-text">
                <strong id="live-count">2,845</strong> شخص يشاهدون الآن
            </span>
        </div>
    `;
    document.body.appendChild(viewerBadge);

    // تحديث الرقم بشكل عشوائي للواقعية
    setInterval(() => {
        const countEl = document.getElementById('live-count');
        if (!countEl) return;

        // إزالة الفواصل لتحويله لرقم
        let current = parseInt(countEl.innerText.replace(/,/g, ''));

        // تغيير عشوائي بين -5 و +8
        const change = Math.floor(Math.random() * 14) - 5;
        let newCount = current + change;

        // الحفاظ على نطاق منطقي (مثلاً بين 2500 و 3500)
        if (newCount < 2500) newCount = 2500 + Math.floor(Math.random() * 100);
        if (newCount > 3500) newCount = 3500 - Math.floor(Math.random() * 100);

        countEl.innerText = newCount.toLocaleString();

        // تأثير وميض أخضر عند الزيادة وأحمر عند النقصان (اختياري)
        const parent = countEl.parentElement;
        if (change > 0) {
            parent.classList.add('count-up');
            setTimeout(() => parent.classList.remove('count-up'), 500);
        }
    }, 4000);
}

function initRecentSubscriptions() {
    // قائمة بأسماء ومدن عراقية (الجمهور المستهدف)
    const names = ['محمد', 'علي', 'حسين', 'أحمد', 'عباس', 'حيدر', 'مصطفى', 'يوسف', 'حسن', 'كرار', 'سجاد', 'زين العابدين', 'عمر', 'عثمان'];
    const cities = ['بغداد', 'البصرة', 'أربيل', 'الموصل', 'النجف', 'كربلاء', 'كركوك', 'السليمانية', 'الحلة', 'الناصرية', 'الديوانية', 'الكوت', 'العمارة', 'دهوك'];

    // إنشاء حاوية للإشعارات
    const container = document.createElement('div');
    container.className = 'subscription-notification-container';
    document.body.appendChild(container); // يجب التأكد من وجود css يحدد مكانها

    // دالة لإظهار إشعار جديد
    const showNotification = () => {
        const name = names[Math.floor(Math.random() * names.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const timeAgo = Math.floor(Math.random() * 5) + 1; // 1-5 minutes ago

        const notification = document.createElement('div');
        notification.className = 'sub-notification slide-in-left';
        notification.innerHTML = `
            <div class="sub-icon">🎉</div>
            <div class="sub-content">
                <p class="sub-title">اشتراك جديد!</p>
                <p class="sub-desc"><strong>${name}</strong> من <strong>${city}</strong> اشترك في الباقة الذهبية</p>
                <span class="sub-time">منذ ${timeAgo} دقائق</span>
            </div>
            <button class="close-sub">&times;</button>
        `;

        container.appendChild(notification);

        // إغلاق الإشعار عند النقر
        notification.querySelector('.close-sub').addEventListener('click', () => {
            notification.classList.add('slide-out-left');
            setTimeout(() => notification.remove(), 500);
        });

        // إخفاء تلقائي بعد 6 ثواني
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('slide-out-left');
                setTimeout(() => notification.remove(), 500);
            }
        }, 6000);
    };

    // إظهار إشعار أول مرة بعد 5 ثواني
    setTimeout(showNotification, 5000);

    // تكرار كل 20-40 ثانية بشكل عشوائي
    const loop = () => {
        const nextTime = Math.floor(Math.random() * (40000 - 20000) + 20000);
        setTimeout(() => {
            showNotification();
            loop();
        }, nextTime);
    };
    loop();
}
