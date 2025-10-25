/**
 * MASE Position Picker Module
 * 
 * Provides visual position picker for background images with:
 * - 3x3 grid for standard positions
 * - Custom X/Y percentage inputs
 * - Live preview updates
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function($) {
    'use strict';
    
    // Ensure MASE namespace exists
    window.MASE = window.MASE || {};
    
    /**
     * Position Picker Module
     */
    MASE.positionPicker = {
        
        /**
         * Cached DOM elements
         * Task 35: Minimize DOM queries using caching
         */
        domCache: {},

        /**
         * Debounced update function
         * Task 35: Debounce live preview updates (300ms)
         */
        debouncedUpdate: null,

        /**
         * Initialize position picker
         */
        init: function() {
            // Initialize DOM cache
            this.initDOMCache();

            // Create debounced update function
            if (MASE.assetLoader && typeof MASE.assetLoader.debounce === 'function') {
                this.debouncedUpdate = MASE.assetLoader.debounce(this.updatePreview.bind(this), 300);
            } else {
                this.debouncedUpdate = this.updatePreview.bind(this);
            }

            this.initGridPicker();
            this.initCustomPosition();
        },

        /**
         * Initialize DOM cache
         * Task 35: Minimize DOM queries using caching
         */
        initDOMCache: function() {
            this.domCache = {
                $gridCells: $('.mase-position-grid-cell'),
                $positionInputs: $('.mase-background-position'),
                $positionX: $('.mase-position-x'),
                $positionY: $('.mase-position-y'),
                $previews: $('.mase-background-preview')
            };
        },
        
        /**
         * Initialize 3x3 grid position picker
         */
        initGridPicker: function() {
            $('.mase-position-grid-cell').on('click', function() {
                const position = $(this).data('position');
                const area = $(this).closest('.mase-background-config').data('area');
                
                // Update selection
                $(this).addClass('selected').siblings().removeClass('selected');
                
                // Update hidden input
                $('.mase-background-position[data-area="' + area + '"]').val(position);
                
                // Clear custom position inputs
                $('.mase-position-x[data-area="' + area + '"]').val('');
                $('.mase-position-y[data-area="' + area + '"]').val('');
                
                // Update preview
                MASE.positionPicker.updatePreview(area);
            });
        },
        
        /**
         * Initialize custom position inputs (X%, Y%)
         */
        initCustomPosition: function() {
            const self = this;

            // Use debounced update for input events
            $('.mase-position-x, .mase-position-y').on('input', function() {
                const area = $(this).closest('.mase-background-config').data('area');
                const x = $('.mase-position-x[data-area="' + area + '"]').val();
                const y = $('.mase-position-y[data-area="' + area + '"]').val();
                
                // Only update if both values are provided
                if (x !== '' && y !== '') {
                    // Validate range (0-100)
                    const xVal = Math.max(0, Math.min(100, parseInt(x) || 0));
                    const yVal = Math.max(0, Math.min(100, parseInt(y) || 0));
                    
                    // Update position value
                    const position = xVal + '% ' + yVal + '%';
                    $('.mase-background-position[data-area="' + area + '"]').val(position);
                    
                    // Clear grid selection
                    $('.mase-position-grid-cell[data-area="' + area + '"]').removeClass('selected');
                    
                    // Use debounced update
                    if (self.debouncedUpdate) {
                        self.debouncedUpdate(area);
                    } else {
                        self.updatePreview(area);
                    }
                }
            });
            
            // Validate input on blur
            $('.mase-position-x, .mase-position-y').on('blur', function() {
                const val = parseInt($(this).val());
                if (!isNaN(val)) {
                    const clamped = Math.max(0, Math.min(100, val));
                    $(this).val(clamped);
                }
            });
        },
        
        /**
         * Update background position preview
         * 
         * @param {string} area - Area identifier
         */
        updatePreview: function(area) {
            const position = $('.mase-background-position[data-area="' + area + '"]').val();
            
            // Update preview element
            $('.mase-background-preview[data-area="' + area + '"]').css('background-position', position);
            
            // Trigger live preview if enabled
            if (MASE.livePreview && MASE.livePreview.enabled) {
                MASE.livePreview.updateBackground(area);
            }
        },
        
        /**
         * Set position from value (for initialization)
         * 
         * @param {string} area - Area identifier
         * @param {string} position - Position value (e.g., "center center" or "50% 50%")
         */
        setPosition: function(area, position) {
            if (!position) return;
            
            // Check if it's a standard position
            const standardPositions = [
                'left top', 'center top', 'right top',
                'left center', 'center center', 'right center',
                'left bottom', 'center bottom', 'right bottom'
            ];
            
            if (standardPositions.indexOf(position) !== -1) {
                // Highlight grid cell
                $('.mase-position-grid-cell[data-position="' + position + '"][data-area="' + area + '"]')
                    .addClass('selected')
                    .siblings()
                    .removeClass('selected');
                
                // Clear custom inputs
                $('.mase-position-x[data-area="' + area + '"]').val('');
                $('.mase-position-y[data-area="' + area + '"]').val('');
            } else {
                // Parse custom position (e.g., "50% 75%")
                const parts = position.split(' ');
                if (parts.length === 2) {
                    const x = parseInt(parts[0]);
                    const y = parseInt(parts[1]);
                    
                    if (!isNaN(x) && !isNaN(y)) {
                        $('.mase-position-x[data-area="' + area + '"]').val(x);
                        $('.mase-position-y[data-area="' + area + '"]').val(y);
                        
                        // Clear grid selection
                        $('.mase-position-grid-cell[data-area="' + area + '"]').removeClass('selected');
                    }
                }
            }
            
            // Update hidden input
            $('.mase-background-position[data-area="' + area + '"]').val(position);
        },
        
        /**
         * Get current position value
         * 
         * @param {string} area - Area identifier
         * @return {string} Current position value
         */
        getPosition: function(area) {
            return $('.mase-background-position[data-area="' + area + '"]').val() || 'center center';
        }
    };
    
    // Initialize on document ready
    $(document).ready(function() {
        MASE.positionPicker.init();
    });
    
})(jQuery);
