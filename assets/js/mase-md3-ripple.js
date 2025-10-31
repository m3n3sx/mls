/**
 * Material Design 3 Ripple Effect System
 * Creates circular ripple animations on button clicks
 */

(function($) {
    'use strict';

    /**
     * MD3 Ripple Effect Class
     */
    class MD3Ripple {
        constructor() {
            this.rippleClass = 'mase-ripple';
            this.rippleDuration = 600; // ms
            this.init();
        }

        /**
         * Initialize ripple effect on all buttons
         */
        init() {
            this.attachRippleListeners();
        }

        /**
         * Attach click listeners to buttons
         */
        attachRippleListeners() {
            const buttonSelectors = [
                '.mase-button',
                '.mase-button-filled',
                '.mase-button-outlined',
                '.mase-button-text'
            ].join(', ');

            $(document).on('mousedown', buttonSelectors, (e) => {
                this.createRipple(e);
            });

            $(document).on('touchstart', buttonSelectors, (e) => {
                // Use first touch point for mobile
                if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length > 0) {
                    this.createRipple(e, e.originalEvent.touches[0]);
                }
            });
        }

        /**
         * Create and animate ripple effect
         * @param {Event} event - Click or touch event
         * @param {Touch} touch - Touch object for mobile (optional)
         */
        createRipple(event, touch = null) {
            const button = $(event.currentTarget);
            
            // Don't create ripple on disabled buttons
            if (button.is(':disabled') || button.hasClass('disabled')) {
                return;
            }

            // Get button dimensions and position
            const buttonRect = button[0].getBoundingClientRect();
            const buttonWidth = buttonRect.width;
            const buttonHeight = buttonRect.height;

            // Calculate click position relative to button
            let clickX, clickY;
            if (touch) {
                clickX = touch.clientX - buttonRect.left;
                clickY = touch.clientY - buttonRect.top;
            } else {
                clickX = event.clientX - buttonRect.left;
                clickY = event.clientY - buttonRect.top;
            }

            // Calculate ripple size (diameter should reach furthest corner)
            const rippleSize = Math.max(
                Math.sqrt(Math.pow(clickX, 2) + Math.pow(clickY, 2)),
                Math.sqrt(Math.pow(buttonWidth - clickX, 2) + Math.pow(clickY, 2)),
                Math.sqrt(Math.pow(clickX, 2) + Math.pow(buttonHeight - clickY, 2)),
                Math.sqrt(Math.pow(buttonWidth - clickX, 2) + Math.pow(buttonHeight - clickY, 2))
            ) * 2;

            // Create ripple element
            const ripple = $('<span></span>')
                .addClass(this.rippleClass)
                .css({
                    width: rippleSize + 'px',
                    height: rippleSize + 'px',
                    left: (clickX - rippleSize / 2) + 'px',
                    top: (clickY - rippleSize / 2) + 'px'
                });

            // Remove any existing ripples
            button.find('.' + this.rippleClass).remove();

            // Add ripple to button
            button.append(ripple);

            // Trigger animation
            requestAnimationFrame(() => {
                ripple.addClass('mase-ripple-active');
            });

            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, this.rippleDuration);
        }

        /**
         * Manually trigger ripple on element
         * @param {jQuery} element - Button element
         * @param {number} x - X coordinate (optional, defaults to center)
         * @param {number} y - Y coordinate (optional, defaults to center)
         */
        triggerRipple(element, x = null, y = null) {
            const $element = $(element);
            const rect = $element[0].getBoundingClientRect();
            
            const fakeEvent = {
                currentTarget: $element[0],
                clientX: x !== null ? x : rect.left + rect.width / 2,
                clientY: y !== null ? y : rect.top + rect.height / 2
            };
            
            this.createRipple(fakeEvent);
        }
    }

    /**
     * Initialize on document ready
     */
    $(document).ready(function() {
        // Create global ripple instance
        window.MASE_MD3_Ripple = new MD3Ripple();
    });

})(jQuery);
