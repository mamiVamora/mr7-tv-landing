/**
 * MR7 TV AI Chatbot - Powered by Google Gemini
 * 
 * ملف الإعدادات
 */

const CHATBOT_CONFIG = {
    // المفتاح المقيد (Restricted Key) - يعمل فقط على الدومين المحدد
    GEMINI_API_KEY: 'AIzaSyBLeDgOfcT4YEe2YH6Q7joPr8wwgwL8T50',

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
