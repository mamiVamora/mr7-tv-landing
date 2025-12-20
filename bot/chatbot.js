/**
 * MR7 TV AI Chatbot - Main JavaScript File
 * Powered by Google Gemini AI
 */

(function () {
    'use strict';

    // ============================================
    // Configuration & System Instructions
    // ============================================

    const SYSTEM_INSTRUCTION = `أنت مساعد ذكي لخدمة MR7 TV - أفضل خدمة IPTV في الشرق الأوسط.

معلومات المشروع:
- الاسم: MR7 TV (مرح TV)
- الموقع: https://mamivamora.github.io/mr7-tv-landing/
- واتساب: +9647777842422

الميزات الرئيسية:
- +9500 قناة مباشرة
- +19800 فيلم مترجم
- +9800 مسلسل مترجم
- جودة 4K / FHD
- تحديثات يومية
- دعم فني 24/7
- بدون تقطيع (No Buffering)
- تجربة مجانية 24 ساعة
- يعمل على جهازين في نفس الوقت

الباقات المتوفرة:
1. باقة 3 أشهر (جهاز واحد) - السعر حسب الطلب
2. باقة 6 أشهر (جهاز واحد) - عرض خاص
3. باقة 12 شهر (جهاز واحد) - الأكثر طلباً
4. باقة 12 شهر (جهازين) - عرض العائلة
5. عروض ذهبية: 12+3 أشهر مجاناً

روابط التحميل:

للأندرويد:
- التطبيق الأول (APK مباشر): https://mr7tv.online/MR7TV.apk
- التطبيق الثاني (000 Player): https://play.google.com/store/apps/details?id=com.player.iptv
- كود التفعيل للتطبيق الثاني: 6021421

للآيفون والآيباد:
- تطبيق 000 Player: https://apps.apple.com/us/app/000-player/id1665441224
- كود السيرفر: 55555
- طريقة الدخول: الخانة الأولى (أي اسم)، الثانية (اسم المستخدم)، الثالثة (كلمة المرور)، الأخيرة (55555)

للشاشات الذكية (Smart TV):
- التطبيق: IPTV Smarters Pro (ابحث عنه في متجر الشاشة)
- طريقة التفعيل: اختر XTREME CODES API
- رابط السيرفر: http://mr7tv.vip:80

القنوات المتوفرة:
- beIN Sports (4K)
- SSC Sports
- Abu Dhabi Sports
- Al Kass
- Netflix
- Shahid VIP
- OSN Plus
- Watch It
- MBC Group
- Rotana
- وقنوات أخرى كثيرة

طريقة الاشتراك:
1. اختر الباقة المناسبة
2. تواصل معنا عبر واتساب: +9647777842422
3. استلم بيانات الاشتراك فوراً
4. حمل التطبيق وابدأ المشاهدة

تعليمات مهمة:
- أجب دائماً بالعربية
- كن ودوداً ومحترفاً
- أعط معلومات دقيقة ومحددة
- إذا سأل عن السعر، قل له يتواصل عبر واتساب للحصول على سعر خاص
- إذا سأل عن التحميل، أعطه الرابط المناسب لجهازه
- إذا لم تعرف الإجابة، اعتذر بلطف واطلب منه التواصل مع الدعم الفني
- استخدم الإيموجي بشكل مناسب لجعل المحادثة أكثر حيوية
- ضع الروابط بشكل واضح في الإجابات`;

    // ============================================
    // Chatbot Class
    // ============================================

    class MR7Chatbot {
        constructor() {
            this.apiKey = null;
            this.conversationHistory = [];
            this.isOpen = false;
            this.isTyping = false;

            this.init();
        }

        init() {
            // Load configuration
            this.loadConfig();

            // Inject HTML & CSS
            this.injectStyles();
            this.injectHTML();

            // Setup event listeners
            this.setupEventListeners();

            // Load conversation history from localStorage
            this.loadHistory();
        }

        async loadConfig() {
            // Try to load from .env file first (recommended)
            if (typeof envLoader !== 'undefined') {
                const loaded = await envLoader.load();
                if (loaded) {
                    this.apiKey = envLoader.get('VITE_GEMINI_API_KEY');
                    if (this.apiKey && this.apiKey !== 'YOUR_API_KEY_HERE') {
                        console.log('✅ تم تحميل مفتاح API من ملف .env');
                        return;
                    }
                }
            }

            // Fallback to config.js (deprecated)
            if (typeof CHATBOT_CONFIG !== 'undefined' && CHATBOT_CONFIG.GEMINI_API_KEY) {
                this.apiKey = CHATBOT_CONFIG.GEMINI_API_KEY;
                if (this.apiKey === 'YOUR_API_KEY_HERE') {
                    console.warn('⚠️ يرجى تعيين مفتاح Gemini API في ملف .env');
                    this.apiKey = null;
                } else {
                    console.log('✅ تم تحميل مفتاح API من config.js (يُفضل استخدام .env)');
                }
            } else {
                console.warn('⚠️ لم يتم العثور على مفتاح API. يرجى إنشاء ملف .env من .env.example');
            }
        }

        injectStyles() {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'bot/chatbot.css';
            document.head.appendChild(link);
        }

        async injectHTML() {
            try {
                const response = await fetch('bot/chatbot.html');
                const html = await response.text();
                document.body.insertAdjacentHTML('beforeend', html);
            } catch (error) {
                console.error('خطأ في تحميل واجهة الشات:', error);
            }
        }

        setupEventListeners() {
            // Wait for DOM to be ready
            setTimeout(() => {
                const toggleBtn = document.getElementById('mr7-chatbot-toggle');
                const closeBtn = document.querySelector('.chatbot-close');
                const sendBtn = document.getElementById('chatbot-send-btn');
                const input = document.getElementById('chatbot-input');
                const quickBtns = document.querySelectorAll('.quick-question-btn');

                if (toggleBtn) {
                    toggleBtn.addEventListener('click', () => this.toggleChat());
                }

                if (closeBtn) {
                    closeBtn.addEventListener('click', () => this.closeChat());
                }

                if (sendBtn) {
                    sendBtn.addEventListener('click', () => this.sendMessage());
                }

                if (input) {
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            this.sendMessage();
                        }
                    });
                }

                // Quick question buttons
                quickBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const question = btn.getAttribute('data-question');
                        this.sendQuickQuestion(question);
                    });
                });
            }, 500);
        }

        toggleChat() {
            const window = document.getElementById('mr7-chatbot-window');
            if (window) {
                this.isOpen = !this.isOpen;
                window.classList.toggle('active');

                if (this.isOpen) {
                    document.getElementById('chatbot-input')?.focus();
                }
            }
        }

        closeChat() {
            const window = document.getElementById('mr7-chatbot-window');
            if (window) {
                this.isOpen = false;
                window.classList.remove('active');
            }
        }

        sendQuickQuestion(question) {
            const input = document.getElementById('chatbot-input');
            if (input) {
                input.value = question;
                this.sendMessage();
            }
        }

        async sendMessage() {
            const input = document.getElementById('chatbot-input');
            const message = input?.value.trim();

            if (!message || this.isTyping) return;

            // Check if API key is configured
            if (!this.apiKey) {
                this.showError('⚠️ لم يتم تكوين مفتاح API. يرجى مراجعة ملف bot/config.js');
                return;
            }

            // Clear input
            input.value = '';

            // Add user message
            this.addMessage(message, 'user');

            // Show typing indicator
            this.showTyping();

            try {
                // Get AI response
                const response = await this.getAIResponse(message);

                // Hide typing indicator
                this.hideTyping();

                // Add bot response
                this.addMessage(response, 'bot');

                // Save to history
                this.saveHistory();

            } catch (error) {
                console.error('خطأ في الحصول على الرد:', error);
                this.hideTyping();
                this.addMessage('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى أو التواصل معنا عبر واتساب: +9647777842422', 'bot');
            }
        }

        async getAIResponse(userMessage) {
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

            // Build conversation context
            const contents = [
                {
                    role: 'user',
                    parts: [{ text: SYSTEM_INSTRUCTION }]
                },
                {
                    role: 'model',
                    parts: [{ text: 'فهمت! أنا مساعد MR7 TV الذكي. سأجيب على جميع الأسئلة بدقة واحترافية. كيف يمكنني مساعدتك؟' }]
                }
            ];

            // Add conversation history (last 5 messages)
            const recentHistory = this.conversationHistory.slice(-5);
            recentHistory.forEach(msg => {
                contents.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                });
            });

            // Add current message
            contents.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            const requestBody = {
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response format');
            }
        }

        addMessage(text, sender) {
            const messagesContainer = document.getElementById('chatbot-messages');
            if (!messagesContainer) return;

            // Remove welcome message if exists
            const welcomeMsg = messagesContainer.querySelector('.welcome-message');
            if (welcomeMsg) {
                welcomeMsg.remove();
            }

            // Create message element
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${sender}`;

            const avatar = document.createElement('div');
            avatar.className = `message-avatar ${sender}`;
            avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

            const content = document.createElement('div');
            content.className = 'message-content';

            // Convert URLs to clickable links
            const textWithLinks = this.linkify(text);
            content.innerHTML = textWithLinks;

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);

            messagesContainer.appendChild(messageDiv);

            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Save to history
            this.conversationHistory.push({
                role: sender,
                text: text,
                timestamp: Date.now()
            });
        }

        linkify(text) {
            // Convert URLs to clickable links
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, (url) => {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
            });
        }

        showTyping() {
            this.isTyping = true;
            const messagesContainer = document.getElementById('chatbot-messages');
            if (!messagesContainer) return;

            const typingDiv = document.createElement('div');
            typingDiv.className = 'chatbot-message bot';
            typingDiv.id = 'typing-indicator';

            const avatar = document.createElement('div');
            avatar.className = 'message-avatar bot';
            avatar.innerHTML = '<i class="fas fa-robot"></i>';

            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

            typingDiv.appendChild(avatar);
            typingDiv.appendChild(indicator);

            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Disable send button
            const sendBtn = document.getElementById('chatbot-send-btn');
            if (sendBtn) sendBtn.disabled = true;
        }

        hideTyping() {
            this.isTyping = false;
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }

            // Enable send button
            const sendBtn = document.getElementById('chatbot-send-btn');
            if (sendBtn) sendBtn.disabled = false;
        }

        showError(message) {
            const messagesContainer = document.getElementById('chatbot-messages');
            if (!messagesContainer) return;

            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;

            messagesContainer.appendChild(errorDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        saveHistory() {
            try {
                localStorage.setItem('mr7_chatbot_history', JSON.stringify(this.conversationHistory));
            } catch (error) {
                console.warn('تعذر حفظ سجل المحادثة:', error);
            }
        }

        loadHistory() {
            try {
                const saved = localStorage.getItem('mr7_chatbot_history');
                if (saved) {
                    this.conversationHistory = JSON.parse(saved);

                    // Restore messages (last 10)
                    setTimeout(() => {
                        const messagesContainer = document.getElementById('chatbot-messages');
                        if (messagesContainer && this.conversationHistory.length > 0) {
                            // Remove welcome message
                            const welcomeMsg = messagesContainer.querySelector('.welcome-message');
                            if (welcomeMsg) welcomeMsg.remove();

                            // Add last 10 messages
                            const recentMessages = this.conversationHistory.slice(-10);
                            recentMessages.forEach(msg => {
                                this.addMessageToDOM(msg.text, msg.role);
                            });
                        }
                    }, 600);
                }
            } catch (error) {
                console.warn('تعذر تحميل سجل المحادثة:', error);
            }
        }

        addMessageToDOM(text, sender) {
            const messagesContainer = document.getElementById('chatbot-messages');
            if (!messagesContainer) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${sender}`;

            const avatar = document.createElement('div');
            avatar.className = `message-avatar ${sender}`;
            avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

            const content = document.createElement('div');
            content.className = 'message-content';
            content.innerHTML = this.linkify(text);

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            messagesContainer.appendChild(messageDiv);
        }
    }

    // ============================================
    // Initialize Chatbot
    // ============================================

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new MR7Chatbot();
        });
    } else {
        new MR7Chatbot();
    }

})();
