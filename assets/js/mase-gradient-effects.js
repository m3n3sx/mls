/**
 * Enhanced Gradient Theme Effects
 * Handles scroll-based rotation and hover distortion
 */

(function($) {
    'use strict';

    /**
     * Gradient angle rotation based on scroll position
     */
    class GradientScrollRotation {
        constructor() {
            this.isActive = false;
            this.scrollIndicator = null;
            this.lastScrollY = 0;
            this.ticking = false;
            
            this.init();
        }

        init() {
            // Check if gradient theme with scroll rotation is active
            if (!document.body.classList.contains('mase-template-gradient') ||
                !document.body.classList.contains('mase-scroll-rotate')) {
                return;
            }

            // Check for reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            // Check for performance mode
            if (document.documentElement.getAttribute('data-performance-mode') === 'true') {
                return;
            }

            this.isActive = true;
            this.createScrollIndicator();
            this.attachScrollListener();
        }

        createScrollIndicator() {
            this.scrollIndicator = document.createElement('div');
            this.scrollIndicator.className = 'mase-scroll-indicator';
            this.scrollIndicator.innerHTML = '<div class="mase-scroll-indicator-inner"></div>';
            document.body.appendChild(this.scrollIndicator);
        }

        attachScrollListener() {
            window.addEventListener('scroll', () => {
                this.lastScrollY = window.scrollY;

                if (!this.ticking) {
                    window.requestAnimationFrame(() => {
                        this.updateGradientAngle();
                        this.ticking = false;
                    });

                    this.ticking = true;
                }
            }, { passive: true });

            // Initial update
            this.updateGradientAngle();
        }

        updateGradientAngle() {
            const scrollPercent = this.getScrollPercent();
            
            // Calculate angle based on scroll (0-360 degrees)
            const angle = Math.round(scrollPercent * 360);
            
            // Update CSS custom property
            document.documentElement.style.setProperty('--scroll-angle', `${angle}deg`);
            
            // Update all elements with scroll rotation
            const elements = document.querySelectorAll('.mase-scroll-rotate, .mase-scroll-rotate .wrap, .mase-scroll-rotate .postbox, .mase-scroll-rotate .card, .mase-scroll-rotate .button, .mase-scroll-rotate .button-primary');
            elements.forEach(el => {
                el.style.setProperty('--scroll-angle', `${angle}deg`);
            });

            // Update scroll indicator
            if (this.scrollIndicator) {
                const inner = this.scrollIndicator.querySelector('.mase-scroll-indicator-inner');
                if (inner) {
                    inner.style.transform = `rotate(${angle}deg)`;
                }

                // Show indicator when scrolling
                if (scrollPercent > 0.01) {
                    this.scrollIndicator.classList.add('visible');
                } else {
                    this.scrollIndicator.classList.remove('visible');
                }
            }
        }

        getScrollPercent() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const trackLength = documentHeight - windowHeight;
            
            return trackLength > 0 ? scrollTop / trackLength : 0;
        }
    }

    /**
     * Hover gradient distortion effect
     */
    class GradientHoverDistortion {
        constructor() {
            this.isActive = false;
            this.init();
        }

        init() {
            // Check if gradient theme is active
            if (!document.body.classList.contains('mase-template-gradient')) {
                return;
            }

            // Check for reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            // Check for performance mode
            if (document.documentElement.getAttribute('data-performance-mode') === 'true') {
                return;
            }

            this.isActive = true;
            this.attachHoverListeners();
        }

        attachHoverListeners() {
            const cards = document.querySelectorAll('.mase-template-gradient .postbox, .mase-template-gradient .card, .mase-template-gradient .wrap');
            
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    this.handleMouseMove(e, card);
                }, { passive: true });

                card.addEventListener('mouseleave', () => {
                    this.handleMouseLeave(card);
                });
            });
        }

        handleMouseMove(e, element) {
            const rect = element.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            // Update CSS custom properties for mouse position
            element.style.setProperty('--mouse-x', `${x}%`);
            element.style.setProperty('--mouse-y', `${y}%`);
        }

        handleMouseLeave(element) {
            // Reset to center
            element.style.setProperty('--mouse-x', '50%');
            element.style.setProperty('--mouse-y', '50%');
        }
    }

    /**
     * Color harmony preset switcher
     */
    class ColorHarmonySwitcher {
        constructor() {
            this.currentHarmony = null;
            this.init();
        }

        init() {
            // Check if gradient theme is active
            if (!document.body.classList.contains('mase-template-gradient')) {
                return;
            }

            this.attachHarmonyListeners();
            this.loadSavedHarmony();
        }

        attachHarmonyListeners() {
            $(document).on('click', '.mase-harmony-option', (e) => {
                const harmony = $(e.currentTarget).data('harmony');
                this.applyHarmony(harmony);
            });
        }

        applyHarmony(harmony) {
            // Remove previous harmony
            if (this.currentHarmony) {
                document.body.removeAttribute('data-harmony');
            }

            // Apply new harmony
            if (harmony && harmony !== 'default') {
                document.body.setAttribute('data-harmony', harmony);
                this.currentHarmony = harmony;
            } else {
                this.currentHarmony = null;
            }

            // Update active state
            $('.mase-harmony-option').removeClass('active');
            $(`.mase-harmony-option[data-harmony="${harmony}"]`).addClass('active');

            // Save preference
            this.saveHarmony(harmony);
        }

        saveHarmony(harmony) {
            if (typeof maseAdmin !== 'undefined' && maseAdmin.ajaxurl) {
                $.ajax({
                    url: maseAdmin.ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'mase_save_gradient_harmony',
                        nonce: maseAdmin.nonce,
                        harmony: harmony
                    }
                });
            }
        }

        loadSavedHarmony() {
            const savedHarmony = document.body.getAttribute('data-harmony');
            if (savedHarmony) {
                this.currentHarmony = savedHarmony;
                $(`.mase-harmony-option[data-harmony="${savedHarmony}"]`).addClass('active');
            }
        }
    }

    // Initialize on document ready
    $(document).ready(function() {
        new GradientScrollRotation();
        new GradientHoverDistortion();
        new ColorHarmonySwitcher();
    });

})(jQuery);


    /**
     * Gradient trail effect
     */
    class GradientTrail {
        constructor() {
            this.trail = null;
            this.isActive = false;
            this.init();
        }

        init() {
            // Check if gradient theme is active
            if (!document.body.classList.contains('mase-template-gradient')) {
                return;
            }

            // Check for reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            // Check for performance mode
            if (document.documentElement.getAttribute('data-performance-mode') === 'true') {
                return;
            }

            // Don't enable on mobile
            if (window.innerWidth <= 768) {
                return;
            }

            this.isActive = true;
            this.createTrail();
            this.attachMouseListener();
        }

        createTrail() {
            this.trail = document.createElement('div');
            this.trail.className = 'mase-gradient-trail';
            document.body.appendChild(this.trail);
        }

        attachMouseListener() {
            let timeout;

            document.addEventListener('mousemove', (e) => {
                if (!this.trail) return;

                // Update trail position
                this.trail.style.left = e.clientX + 'px';
                this.trail.style.top = e.clientY + 'px';

                // Show trail
                this.trail.classList.add('active');

                // Hide trail after inactivity
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (this.trail) {
                        this.trail.classList.remove('active');
                    }
                }, 100);
            }, { passive: true });
        }
    }

    /**
     * Ripple effect on click
     */
    class GradientRipple {
        constructor() {
            this.init();
        }

        init() {
            // Check if gradient theme is active
            if (!document.body.classList.contains('mase-template-gradient')) {
                return;
            }

            // Check for reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            this.attachClickListeners();
        }

        attachClickListeners() {
            const clickableElements = document.querySelectorAll('.mase-template-gradient .button, .mase-template-gradient .button-primary, .mase-template-gradient .postbox, .mase-template-gradient .card');

            clickableElements.forEach(element => {
                element.addEventListener('click', (e) => {
                    this.createRipple(e, element);
                });
            });
        }

        createRipple(e, element) {
            const ripple = document.createElement('span');
            ripple.className = 'mase-gradient-ripple';

            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';

            element.style.position = 'relative';
            element.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    }

    // Initialize additional effects on document ready
    $(document).ready(function() {
        new GradientTrail();
        new GradientRipple();
    });
