/**
 * Simple .env file loader for browser
 * يقرأ ملف .env ويحمل المتغيرات
 */

class EnvLoader {
    constructor() {
        this.env = {};
    }

    async load() {
        try {
            const response = await fetch('../.env');
            if (!response.ok) {
                console.warn('⚠️ ملف .env غير موجود. يرجى إنشاؤه من .env.example');
                return false;
            }

            const text = await response.text();
            this.parse(text);
            return true;
        } catch (error) {
            console.error('خطأ في تحميل ملف .env:', error);
            return false;
        }
    }

    parse(text) {
        const lines = text.split('\n');

        for (const line of lines) {
            // تجاهل التعليقات والأسطر الفارغة
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) {
                continue;
            }

            // تحليل السطر (KEY=VALUE)
            const match = trimmed.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();

                // إزالة علامات الاقتباس إن وجدت
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }

                this.env[key] = value;
            }
        }
    }

    get(key, defaultValue = null) {
        return this.env[key] || defaultValue;
    }

    getAll() {
        return { ...this.env };
    }
}

// تصدير instance واحد
const envLoader = new EnvLoader();
