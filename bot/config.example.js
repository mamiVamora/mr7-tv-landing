/**
 * MR7 TV AI Chatbot - Powered by Google Gemini
 * 
 * ملف الإعدادات - مثال
 * انسخ هذا الملف إلى config.js وضع مفتاح API الخاص بك
 */

const CHATBOT_CONFIG = {
    // ضع مفتاح Gemini API الخاص بك هنا
    // احصل على مفتاح من: https://makersuite.google.com/app/apikey
    GEMINI_API_KEY: 'YOUR_API_KEY_HERE',

    // إعدادات النموذج
    MODEL_NAME: 'gemini-1.5-flash',

    // إعدادات التوليد
    GENERATION_CONFIG: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
    }
};

// تصدير الإعدادات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CHATBOT_CONFIG;
}
