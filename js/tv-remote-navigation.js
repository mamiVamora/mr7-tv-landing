/**
 * TV Remote Navigation System for MR7 TV
 * Enables navigation using TV remote control (arrow keys)
 * Compatible with all pages
 */

(function () {
    'use strict';

    class TVRemoteNavigation {
        constructor() {
            this.focusableElements = [];
            this.currentIndex = -1;
            this.isEnabled = false;
            this.hintShown = false;

            this.init();
        }

        init() {
            // تأخير بسيط للتأكد من تحميل DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        setup() {
            // جمع العناصر القابلة للتفاعل
            this.updateFocusableElements();

            // إضافة event listeners
            document.addEventListener('keydown', (e) => this.handleKeyPress(e));

            // مراقبة تغييرات DOM
            const observer = new MutationObserver(() => {
                if (this.isEnabled) {
                    this.updateFocusableElements();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // عرض تلميح عند أول استخدام للأسهم
            this.setupHint();
        }

        updateFocusableElements() {
            // جمع جميع العناصر القابلة للتفاعل
            const selectors = [
                'a:not([tabindex="-1"])',
                'button:not([tabindex="-1"])',
                'input:not([type="hidden"]):not([tabindex="-1"])',
                'select:not([tabindex="-1"])',
                'textarea:not([tabindex="-1"])',
                '.card',
                '.pricing-card',
                '.method-card',
                '.feature-card',
                '.stat-card',
                '.gallery-item',
                '[tabindex]:not([tabindex="-1"])'
            ];

            this.focusableElements = Array.from(
                document.querySelectorAll(selectors.join(', '))
            ).filter(el => {
                // تصفية العناصر المخفية أو غير المرئية
                const style = window.getComputedStyle(el);
                return el.offsetParent !== null &&
                    style.display !== 'none' &&
                    style.visibility !== 'hidden' &&
                    !el.disabled;
            });
        }

        handleKeyPress(e) {
            const key = e.key;

            // تفعيل النظام عند أول ضغطة على سهم
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                e.preventDefault();

                if (!this.isEnabled) {
                    this.isEnabled = true;
                    this.showHint();
                }

                // إذا لم يكن هناك عنصر محدد، ابدأ من الأول
                if (this.currentIndex === -1 && this.focusableElements.length > 0) {
                    this.focusElement(0);
                    return;
                }

                this.navigate(key);
            }
            // تفعيل العنصر عند الضغط على Enter
            else if (key === 'Enter' && this.isEnabled && this.currentIndex >= 0) {
                e.preventDefault();
                this.activate();
            }
            // إلغاء التحديد عند الضغط على Escape
            else if (key === 'Escape' && this.isEnabled) {
                this.clearFocus();
            }
        }

        navigate(direction) {
            if (this.focusableElements.length === 0) return;

            const currentEl = this.focusableElements[this.currentIndex];
            if (!currentEl) {
                this.focusElement(0);
                return;
            }

            const currentRect = currentEl.getBoundingClientRect();
            let bestIndex = this.currentIndex;
            let bestDistance = Infinity;

            // البحث عن أفضل عنصر في الاتجاه المطلوب
            this.focusableElements.forEach((el, index) => {
                if (index === this.currentIndex) return;

                const rect = el.getBoundingClientRect();

                // التحقق من أن العنصر في الاتجاه الصحيح
                if (!this.isInDirection(currentRect, rect, direction)) return;

                // حساب المسافة
                const distance = this.calculateDistance(currentRect, rect, direction);

                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestIndex = index;
                }
            });

            // الانتقال للعنصر الجديد إذا وُجد
            if (bestIndex !== this.currentIndex) {
                this.focusElement(bestIndex);
            }
        }

        isInDirection(fromRect, toRect, direction) {
            const threshold = 50; // هامش للتسامح

            switch (direction) {
                case 'ArrowUp':
                    return toRect.bottom <= fromRect.top + threshold;
                case 'ArrowDown':
                    return toRect.top >= fromRect.bottom - threshold;
                case 'ArrowLeft':
                    return toRect.right <= fromRect.left + threshold;
                case 'ArrowRight':
                    return toRect.left >= fromRect.right - threshold;
                default:
                    return false;
            }
        }

        calculateDistance(fromRect, toRect, direction) {
            // حساب المسافة بناءً على الاتجاه
            let dx, dy;

            switch (direction) {
                case 'ArrowUp':
                case 'ArrowDown':
                    // المسافة العمودية + المسافة الأفقية (بوزن أقل)
                    dy = Math.abs(toRect.top - fromRect.top);
                    dx = Math.abs(toRect.left - fromRect.left) * 0.3;
                    break;
                case 'ArrowLeft':
                case 'ArrowRight':
                    // المسافة الأفقية + المسافة العمودية (بوزن أقل)
                    dx = Math.abs(toRect.left - fromRect.left);
                    dy = Math.abs(toRect.top - fromRect.top) * 0.3;
                    break;
                default:
                    dx = toRect.left - fromRect.left;
                    dy = toRect.top - fromRect.top;
            }

            return Math.sqrt(dx * dx + dy * dy);
        }

        focusElement(index) {
            // إزالة التركيز من العنصر الحالي
            if (this.currentIndex >= 0 && this.focusableElements[this.currentIndex]) {
                this.focusableElements[this.currentIndex].classList.remove('tv-focused');
            }

            // تحديث الفهرس
            this.currentIndex = index;
            const element = this.focusableElements[index];

            if (!element) return;

            // إضافة التركيز للعنصر الجديد
            element.classList.add('tv-focused');
            element.focus({ preventScroll: true });

            // التمرير للعنصر بسلاسة
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }

        activate() {
            const element = this.focusableElements[this.currentIndex];
            if (!element) return;

            // محاكاة النقر
            element.click();
        }

        clearFocus() {
            if (this.currentIndex >= 0 && this.focusableElements[this.currentIndex]) {
                this.focusableElements[this.currentIndex].classList.remove('tv-focused');
            }
            this.currentIndex = -1;
            this.isEnabled = false;
        }

        setupHint() {
            // التحقق من عدم عرض التلميح سابقاً
            const hintDismissed = localStorage.getItem('mr7_tv_hint_dismissed');
            if (hintDismissed) return;

            // إنشاء عنصر التلميح
            const hint = document.createElement('div');
            hint.className = 'tv-navigation-hint';
            hint.style.display = 'none';
            hint.innerHTML = `
                <button class="close-hint" aria-label="إغلاق">×</button>
                <p><i class="fas fa-gamepad"></i> استخدم أسهم الريموت للتنقل</p>
                <p><i class="fas fa-check-circle"></i> اضغط OK للاختيار</p>
            `;

            document.body.appendChild(hint);

            // معالج إغلاق التلميح
            const closeBtn = hint.querySelector('.close-hint');
            closeBtn.addEventListener('click', () => {
                hint.style.display = 'none';
                localStorage.setItem('mr7_tv_hint_dismissed', 'true');
            });

            this.hintElement = hint;
        }

        showHint() {
            if (this.hintShown || !this.hintElement) return;

            this.hintElement.style.display = 'block';
            this.hintShown = true;

            // إخفاء تلقائي بعد 5 ثواني
            setTimeout(() => {
                if (this.hintElement) {
                    this.hintElement.style.display = 'none';
                }
            }, 5000);
        }
    }

    // تهيئة النظام تلقائياً
    new TVRemoteNavigation();

})();
