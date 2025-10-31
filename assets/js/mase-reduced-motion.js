/**
 * MASE Reduced Motion Support
 * 
 * Detects and respects user's motion preferences
 * Requirements: 21.4, 21.5 - Respect prefers-reduced-motion for animations
 * 
 * Features:
 * - Detect prefers-reduced-motion media query
 * - Disable animations when requested
 * - Use instant transitions
 * - Maintain all functionality
 * - Add body class for CSS targeting
 */

(function($) {
    'use strict';

    /**
     * Reduced Motion Manager
     */
    const MASEReducedMotion = {
        /**
         * Initialize reduced motion detection
         */
        init: function() {
            this.detectMotionPreference();
            this.watchMotionPreference();
            this.disableAnimations();
            
            console.log('MASE Reduced Motion support initialized');
        },

        /**
         * Detect user's motion preference
         */
        detectMotionPreference: function() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (prefersReducedMotion) {
                $('body').addClass('mase-reduced-motion');
                console.log('Reduced motion preference detected');
            } else {
                $('body').removeClass('mase-reduced-motion');
            }
            
            return prefersReducedMotion;
        },

        /**
         * Watch for changes in motion preference
         */
        watchMotionPreference: function() {
            const self = this;
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            // Modern browsers
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', function(e) {
                    if (e.matches) {
                        $('body').addClass('mase-reduced-motion');
                        self.disableAnimations();
                        console.log('Reduced motion enabled');
                    } else {
                        $('body').removeClass('mase-reduced-motion');
                        console.log('Reduced motion disabled');
                    }
                });
            }
            // Legacy browsers
            else if (mediaQuery.addListener) {
                mediaQuery.addListener(function(e) {
                    if (e.matches) {
                        $('body').addClass('mase-reduced-motion');
                        self.disableAnimations();
                        console.log('Reduced motion enabled');
                    } else {
                        $('body').removeClass('mase-reduced-motion');
                        console.log('Reduced motion disabled');
                    }
                });
            }
        },

        /**
         * Disable animations when reduced motion is preferred
         */
        disableAnimations: function() {
            if (!this.detectMotionPreference()) {
                return;
            }

            // Disable decorative animations
            this.disableShimmerAnimations();
            this.disablePulseAnimations();
            this.disableFloatAnimations();
            this.disableGradientAnimations();
            this.disableTransformAnimations();
            
            // Keep functional transitions but make them instant
            this.makeTransitionsInstant();
        },

        /**
         * Disable shimmer animations
         */
        disableShimmerAnimations: function() {
            $('.mase-loading-shimmer').css({
                'animation': 'none',
                'background': 'var(--md-surface-variant)'
            });
            
            $('.mase-template-minibar').css({
                'animation': 'none',
                'opacity': '0.8'
            });
        },

        /**
         * Disable pulse animations
         */
        disablePulseAnimations: function() {
            $('.mase-template-menuitem').css({
                'animation': 'none',
                'opacity': '0.6'
            });
        },

        /**
         * Disable float animations
         */
        disableFloatAnimations: function() {
            $('.mase-admin-header::before').css({
                'animation': 'none'
            });
        },

        /**
         * Disable gradient animations
         */
        disableGradientAnimations: function() {
            $('.mase-color-picker').css({
                'animation': 'none',
                'background-position': '0% 50%'
            });
        },

        /**
         * Disable transform animations on hover
         */
        disableTransformAnimations: function() {
            const style = document.createElement('style');
            style.id = 'mase-reduced-motion-transforms';
            style.textContent = `
                .mase-reduced-motion .mase-template-card:hover,
                .mase-reduced-motion .mase-button-filled:hover,
                .mase-reduced-motion .mase-fab:hover {
                    transform: none !important;
                }
            `;
            
            if (!document.getElementById('mase-reduced-motion-transforms')) {
                document.head.appendChild(style);
            }
        },

        /**
         * Make transitions instant while maintaining functionality
         */
        makeTransitionsInstant: function() {
            const style = document.createElement('style');
            style.id = 'mase-reduced-motion-transitions';
            style.textContent = `
                .mase-reduced-motion *,
                .mase-reduced-motion *::before,
                .mase-reduced-motion *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
                
                /* Maintain focus indicators */
                .mase-reduced-motion *:focus-visible {
                    outline: 3px solid var(--md-primary, #6750a4);
                    outline-offset: 2px;
                }
            `;
            
            if (!document.getElementById('mase-reduced-motion-transitions')) {
                document.head.appendChild(style);
            }
        },

        /**
         * Check if reduced motion is preferred
         * @returns {boolean} True if reduced motion is preferred
         */
        isReducedMotion: function() {
            return $('body').hasClass('mase-reduced-motion');
        },

        /**
         * Conditionally run animation
         * @param {Function} animationFn - Animation function to run
         * @param {Function} fallbackFn - Fallback function for reduced motion
         */
        conditionalAnimation: function(animationFn, fallbackFn) {
            if (this.isReducedMotion()) {
                if (fallbackFn) {
                    fallbackFn();
                }
            } else {
                animationFn();
            }
        },

        /**
         * Get animation duration based on motion preference
         * @param {number} normalDuration - Normal duration in ms
         * @returns {number} Duration in ms (0.01 if reduced motion)
         */
        getAnimationDuration: function(normalDuration) {
            return this.isReducedMotion() ? 0.01 : normalDuration;
        },

        /**
         * Animate element with reduced motion support
         * @param {jQuery} $element - Element to animate
         * @param {Object} properties - CSS properties to animate
         * @param {number} duration - Animation duration in ms
         * @param {string} easing - Easing function
         * @param {Function} complete - Completion callback
         */
        animate: function($element, properties, duration, easing, complete) {
            const actualDuration = this.getAnimationDuration(duration);
            
            $element.animate(properties, actualDuration, easing, complete);
        },

        /**
         * Fade in element with reduced motion support
         * @param {jQuery} $element - Element to fade in
         * @param {number} duration - Fade duration in ms
         * @param {Function} complete - Completion callback
         */
        fadeIn: function($element, duration, complete) {
            const actualDuration = this.getAnimationDuration(duration);
            
            if (this.isReducedMotion()) {
                $element.show();
                if (complete) complete();
            } else {
                $element.fadeIn(actualDuration, complete);
            }
        },

        /**
         * Fade out element with reduced motion support
         * @param {jQuery} $element - Element to fade out
         * @param {number} duration - Fade duration in ms
         * @param {Function} complete - Completion callback
         */
        fadeOut: function($element, duration, complete) {
            const actualDuration = this.getAnimationDuration(duration);
            
            if (this.isReducedMotion()) {
                $element.hide();
                if (complete) complete();
            } else {
                $element.fadeOut(actualDuration, complete);
            }
        },

        /**
         * Slide down element with reduced motion support
         * @param {jQuery} $element - Element to slide down
         * @param {number} duration - Slide duration in ms
         * @param {Function} complete - Completion callback
         */
        slideDown: function($element, duration, complete) {
            const actualDuration = this.getAnimationDuration(duration);
            
            if (this.isReducedMotion()) {
                $element.show();
                if (complete) complete();
            } else {
                $element.slideDown(actualDuration, complete);
            }
        },

        /**
         * Slide up element with reduced motion support
         * @param {jQuery} $element - Element to slide up
         * @param {number} duration - Slide duration in ms
         * @param {Function} complete - Completion callback
         */
        slideUp: function($element, duration, complete) {
            const actualDuration = this.getAnimationDuration(duration);
            
            if (this.isReducedMotion()) {
                $element.hide();
                if (complete) complete();
            } else {
                $element.slideUp(actualDuration, complete);
            }
        }
    };

    /**
     * Initialize on document ready
     */
    $(document).ready(function() {
        MASEReducedMotion.init();
    });

    /**
     * Expose to global scope for external access
     */
    window.MASEReducedMotion = MASEReducedMotion;

})(jQuery);
