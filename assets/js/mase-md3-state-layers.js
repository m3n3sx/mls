/**
 * Material Design 3 State Layer System
 * 
 * Implements MD3 state layers for interactive feedback:
 * - Hover: 8% opacity
 * - Focus: 12% opacity
 * - Pressed: 12% opacity
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function($) {
    'use strict';

    /**
     * State Layer Manager
     */
    const MaseStateLayerManager = {
        /**
         * Initialize state layer system
         */
        init: function() {
            this.applyStateLayersToButtons();
            this.applyStateLayersToTabs();
            this.applyStateLayersToCards();
            this.applyStateLayersToFormControls();
            
            console.log('MASE MD3 State Layers initialized');
        },

        /**
         * Create state layer element
         * @param {string} type - State type (hover, focus, pressed)
         * @returns {jQuery} State layer element
         */
        createStateLayer: function(type) {
            const layer = $('<span></span>')
                .addClass('mase-state-layer')
                .addClass('mase-state-layer--' + type)
                .attr('aria-hidden', 'true');
            
            return layer;
        },

        /**
         * Add state layer to element
         * @param {jQuery} $element - Target element
         */
        addStateLayer: function($element) {
            // Skip if already has state layer or is disabled
            if ($element.find('.mase-state-layer').length > 0 || 
                $element.is(':disabled') || 
                $element.hasClass('disabled')) {
                return;
            }

            // Ensure element has position context
            const position = $element.css('position');
            if (position === 'static') {
                $element.css('position', 'relative');
            }

            // Ensure overflow hidden for state layer
            $element.css('overflow', 'hidden');

            // Create hover state layer
            const $hoverLayer = this.createStateLayer('hover');
            $element.append($hoverLayer);

            // Create focus state layer
            const $focusLayer = this.createStateLayer('focus');
            $element.append($focusLayer);

            // Create pressed state layer
            const $pressedLayer = this.createStateLayer('pressed');
            $element.append($pressedLayer);

            // Attach event handlers
            this.attachStateLayerEvents($element, $hoverLayer, $focusLayer, $pressedLayer);
        },

        /**
         * Attach event handlers for state layers
         * @param {jQuery} $element - Target element
         * @param {jQuery} $hoverLayer - Hover state layer
         * @param {jQuery} $focusLayer - Focus state layer
         * @param {jQuery} $pressedLayer - Pressed state layer
         */
        attachStateLayerEvents: function($element, $hoverLayer, $focusLayer, $pressedLayer) {
            // Hover state
            $element.on('mouseenter.maseStateLayer', function() {
                if (!$element.is(':disabled') && !$element.hasClass('disabled')) {
                    $hoverLayer.addClass('active');
                }
            });

            $element.on('mouseleave.maseStateLayer', function() {
                $hoverLayer.removeClass('active');
            });

            // Focus state
            $element.on('focus.maseStateLayer', function() {
                if (!$element.is(':disabled') && !$element.hasClass('disabled')) {
                    $focusLayer.addClass('active');
                }
            });

            $element.on('blur.maseStateLayer', function() {
                $focusLayer.removeClass('active');
            });

            // Pressed state
            $element.on('mousedown.maseStateLayer touchstart.maseStateLayer', function() {
                if (!$element.is(':disabled') && !$element.hasClass('disabled')) {
                    $pressedLayer.addClass('active');
                }
            });

            $element.on('mouseup.maseStateLayer mouseleave.maseStateLayer touchend.maseStateLayer', function() {
                $pressedLayer.removeClass('active');
            });
        },

        /**
         * Remove state layers from element
         * @param {jQuery} $element - Target element
         */
        removeStateLayer: function($element) {
            $element.find('.mase-state-layer').remove();
            $element.off('.maseStateLayer');
        },

        /**
         * Apply state layers to buttons
         */
        applyStateLayersToButtons: function() {
            const self = this;
            
            // MD3 buttons
            $('.mase-button-filled, .mase-button-outlined, .mase-button-text').each(function() {
                self.addStateLayer($(this));
            });

            // WordPress buttons
            $('.button, .button-primary, .button-secondary').each(function() {
                const $btn = $(this);
                if (!$btn.hasClass('mase-state-layer-applied')) {
                    self.addStateLayer($btn);
                    $btn.addClass('mase-state-layer-applied');
                }
            });
        },

        /**
         * Apply state layers to tabs
         */
        applyStateLayersToTabs: function() {
            const self = this;
            
            // MD3 navigation tabs
            $('.mase-nav-tab').each(function() {
                self.addStateLayer($(this));
            });

            // WordPress nav tabs
            $('.nav-tab').each(function() {
                const $tab = $(this);
                if (!$tab.hasClass('mase-state-layer-applied')) {
                    self.addStateLayer($tab);
                    $tab.addClass('mase-state-layer-applied');
                }
            });
        },

        /**
         * Apply state layers to cards
         */
        applyStateLayersToCards: function() {
            const self = this;
            
            // Template cards
            $('.mase-template-card').each(function() {
                self.addStateLayer($(this));
            });

            // Palette cards
            $('.mase-palette-card').each(function() {
                self.addStateLayer($(this));
            });

            // Generic interactive cards
            $('.mase-card[data-clickable="true"], .mase-card.clickable').each(function() {
                self.addStateLayer($(this));
            });
        },

        /**
         * Apply state layers to form controls
         */
        applyStateLayersToFormControls: function() {
            const self = this;
            
            // Text inputs
            $('input[type="text"], input[type="email"], input[type="url"], input[type="number"], textarea').each(function() {
                const $input = $(this);
                if (!$input.hasClass('mase-state-layer-applied')) {
                    // Wrap input if not already wrapped
                    if (!$input.parent().hasClass('mase-input-wrapper')) {
                        $input.wrap('<div class="mase-input-wrapper"></div>');
                    }
                    self.addStateLayer($input.parent());
                    $input.addClass('mase-state-layer-applied');
                }
            });

            // Select dropdowns
            $('select').each(function() {
                const $select = $(this);
                if (!$select.hasClass('mase-state-layer-applied')) {
                    if (!$select.parent().hasClass('mase-select-wrapper')) {
                        $select.wrap('<div class="mase-select-wrapper"></div>');
                    }
                    self.addStateLayer($select.parent());
                    $select.addClass('mase-state-layer-applied');
                }
            });

            // Checkboxes and radio buttons
            $('input[type="checkbox"], input[type="radio"]').each(function() {
                const $input = $(this);
                if (!$input.hasClass('mase-state-layer-applied')) {
                    // Apply to label if exists
                    const $label = $input.closest('label');
                    if ($label.length > 0) {
                        self.addStateLayer($label);
                    } else {
                        // Wrap input
                        if (!$input.parent().hasClass('mase-checkbox-wrapper')) {
                            $input.wrap('<span class="mase-checkbox-wrapper"></span>');
                        }
                        self.addStateLayer($input.parent());
                    }
                    $input.addClass('mase-state-layer-applied');
                }
            });
        },

        /**
         * Update state layers when elements are disabled/enabled
         */
        updateDisabledStates: function() {
            const self = this;
            
            // Remove state layers from disabled elements
            $(':disabled, .disabled').each(function() {
                const $element = $(this);
                if ($element.find('.mase-state-layer').length > 0) {
                    self.removeStateLayer($element);
                }
            });

            // Re-apply state layers to enabled elements
            $(':not(:disabled):not(.disabled)').each(function() {
                const $element = $(this);
                if ($element.hasClass('mase-state-layer-applied') && 
                    $element.find('.mase-state-layer').length === 0) {
                    self.addStateLayer($element);
                }
            });
        },

        /**
         * Refresh state layers (useful after dynamic content)
         */
        refresh: function() {
            this.applyStateLayersToButtons();
            this.applyStateLayersToTabs();
            this.applyStateLayersToCards();
            this.applyStateLayersToFormControls();
            this.updateDisabledStates();
        }
    };

    // Initialize on document ready
    $(document).ready(function() {
        MaseStateLayerManager.init();
    });

    // Expose to global scope for external access
    window.MaseStateLayerManager = MaseStateLayerManager;

    // Re-apply state layers after AJAX content updates
    $(document).on('mase:contentUpdated', function() {
        MaseStateLayerManager.refresh();
    });

})(jQuery);
