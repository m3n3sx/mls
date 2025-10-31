/**
 * Enhanced Floral Theme Effects JavaScript
 * Handles dynamic petal generation and bloom interactions
 * Requirements: 10.1, 10.5
 */

(function($) {
    'use strict';

    /**
     * Floral Effects Controller
     */
    const MASEFloralEffects = {
        
        /**
         * Initialize floral effects
         */
        init: function() {
            if (!$('body').hasClass('mase-template-floral')) {
                return;
            }

            this.createPetalContainer();
            this.generatePetals();
            this.initBloomEffects();
            this.handlePerformanceMode();
        },

        /**
         * Create container for floating petals
         */
        createPetalContainer: function() {
            if ($('.mase-floral-petals').length > 0) {
                return;
            }

            const container = $('<div>', {
                class: 'mase-floral-petals',
                'aria-hidden': 'true'
            });

            $('body').append(container);
        },

        /**
         * Generate multiple floating petals
         */
        generatePetals: function() {
            const container = $('.mase-floral-petals');
            if (container.length === 0) {
                return;
            }

            // Check if reduced motion is preferred
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            // Check performance mode
            if ($('html').attr('data-performance-mode') === 'true') {
                return;
            }

            // Petal emojis to use
            const petalTypes = ['🌸', '🌺', '🌼', '🌻', '🌷'];
            
            // Generate 5 petals with randomized properties
            for (let i = 0; i < 5; i++) {
                const petal = $('<div>', {
                    class: 'mase-floral-petal',
                    text: petalTypes[i % petalTypes.length]
                });

                // Randomize starting position
                const leftPosition = Math.random() * 100;
                petal.css('left', leftPosition + '%');

                // Randomize animation delay
                const delay = Math.random() * 10;
                petal.css('animation-delay', delay + 's');

                // Randomize animation duration
                const duration = 10 + Math.random() * 3;
                petal.css('animation-duration', duration + 's');

                // Randomize drift direction
                const drift = (Math.random() - 0.5) * 60;
                petal.css('--petal-drift', drift + 'px');

                container.append(petal);
            }
        },

        /**
         * Initialize bloom effects on button clicks
         */
        initBloomEffects: function() {
            const self = this;

            // Add bloom effect to buttons
            $(document).on('click', '.mase-template-floral .button, .mase-template-floral .button-primary', function(e) {
                self.triggerBloomEffect($(this), e);
            });

            // Add bloom effect to menu items
            $(document).on('click', '.mase-template-floral #adminmenu a', function(e) {
                self.triggerBloomEffect($(this), e);
            });
        },

        /**
         * Trigger bloom effect at click position
         * @param {jQuery} $element - Element that was clicked
         * @param {Event} e - Click event
         */
        triggerBloomEffect: function($element, e) {
            // Check if reduced motion is preferred
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            // Check performance mode
            if ($('html').attr('data-performance-mode') === 'true') {
                return;
            }

            // Get click position relative to element
            const rect = $element[0].getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Create bloom element
            const bloom = $('<div>', {
                class: 'mase-bloom-effect',
                css: {
                    position: 'absolute',
                    left: x + 'px',
                    top: y + 'px',
                    width: '0',
                    height: '0',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(232, 67, 147, 0.6) 0%, rgba(253, 121, 168, 0.4) 50%, transparent 100%)',
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -50%)',
                    zIndex: '1000'
                }
            });

            // Ensure element has position relative
            if ($element.css('position') === 'static') {
                $element.css('position', 'relative');
            }

            // Add bloom to element
            $element.append(bloom);

            // Animate bloom expansion
            bloom.animate({
                width: '200px',
                height: '200px',
                opacity: 0
            }, 600, 'swing', function() {
                bloom.remove();
            });
        },

        /**
         * Handle performance mode changes
         */
        handlePerformanceMode: function() {
            const self = this;

            // Watch for performance mode changes
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'data-performance-mode') {
                        const performanceMode = $('html').attr('data-performance-mode');
                        
                        if (performanceMode === 'true') {
                            self.disableEffects();
                        } else {
                            self.enableEffects();
                        }
                    }
                });
            });

            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['data-performance-mode']
            });
        },

        /**
         * Disable effects for performance mode
         */
        disableEffects: function() {
            $('.mase-floral-petals').hide();
        },

        /**
         * Enable effects when performance mode is off
         */
        enableEffects: function() {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                $('.mase-floral-petals').show();
            }
        },

        /**
         * Clean up effects
         */
        destroy: function() {
            $('.mase-floral-petals').remove();
            $(document).off('click', '.mase-template-floral .button');
            $(document).off('click', '.mase-template-floral #adminmenu a');
        }
    };

    /**
     * Initialize on document ready
     */
    $(document).ready(function() {
        MASEFloralEffects.init();
    });

    /**
     * Reinitialize when theme changes
     */
    $(document).on('mase-theme-changed', function(e, theme) {
        if (theme === 'floral') {
            MASEFloralEffects.init();
        } else {
            MASEFloralEffects.destroy();
        }
    });

    // Expose to global scope for external access
    window.MASEFloralEffects = MASEFloralEffects;

})(jQuery);
