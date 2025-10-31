/**
 * Material Design 3 Palette Switcher
 * 
 * Handles dynamic color palette switching with:
 * - CSS custom property updates
 * - WordPress options persistence
 * - Smooth transitions
 * - Dark mode compatibility
 * 
 * @package ModernAdminStyler
 */

(function($) {
    'use strict';

    /**
     * MD3 Palette Manager
     */
    const MASEMD3Palette = {
        
        /**
         * Available palettes
         */
        palettes: ['purple', 'blue', 'green', 'orange', 'pink'],
        
        /**
         * Current palette
         */
        currentPalette: 'purple',
        
        /**
         * Initialize palette system
         */
        init: function() {
            // Load saved palette
            this.loadSavedPalette();
            
            // Bind palette switcher events
            this.bindEvents();
            
            // Apply initial palette
            this.applyPalette(this.currentPalette, false);
            
            console.log('[MASE MD3] Palette system initialized');
        },
        
        /**
         * Load saved palette from WordPress options
         */
        loadSavedPalette: function() {
            // Check if palette is saved in localized data
            if (typeof maseAdmin !== 'undefined' && maseAdmin.md3Palette) {
                this.currentPalette = maseAdmin.md3Palette;
                console.log('[MASE MD3] Loaded saved palette:', this.currentPalette);
            }
        },
        
        /**
         * Bind event handlers
         */
        bindEvents: function() {
            const self = this;
            
            // Palette selector buttons
            $(document).on('click', '.mase-palette-selector', function(e) {
                e.preventDefault();
                const palette = $(this).data('palette');
                
                if (palette && self.palettes.includes(palette)) {
                    self.switchPalette(palette);
                }
            });
            
            // Palette dropdown (if exists)
            $(document).on('change', '#mase-md3-palette-select', function() {
                const palette = $(this).val();
                
                if (palette && self.palettes.includes(palette)) {
                    self.switchPalette(palette);
                }
            });
        },
        
        /**
         * Switch to a new palette
         * 
         * @param {string} palette - Palette name
         */
        switchPalette: function(palette) {
            if (!this.palettes.includes(palette)) {
                console.error('[MASE MD3] Invalid palette:', palette);
                return;
            }
            
            console.log('[MASE MD3] Switching to palette:', palette);
            
            // Apply palette
            this.applyPalette(palette, true);
            
            // Save to WordPress options
            this.savePalette(palette);
            
            // Update UI
            this.updateUI(palette);
            
            // Trigger custom event
            $(document).trigger('mase:paletteChanged', [palette]);
        },
        
        /**
         * Apply palette to document
         * 
         * @param {string} palette - Palette name
         * @param {boolean} animate - Whether to animate the transition
         */
        applyPalette: function(palette, animate) {
            const root = document.documentElement;
            
            // Add transition class for smooth color changes
            if (animate) {
                root.classList.add('mase-palette-transitioning');
            }
            
            // Update data-palette attribute
            root.setAttribute('data-palette', palette);
            
            // Store current palette
            this.currentPalette = palette;
            
            // Remove transition class after animation
            if (animate) {
                setTimeout(function() {
                    root.classList.remove('mase-palette-transitioning');
                }, 300);
            }
            
            console.log('[MASE MD3] Applied palette:', palette);
        },
        
        /**
         * Save palette to WordPress options via AJAX
         * 
         * @param {string} palette - Palette name
         */
        savePalette: function(palette) {
            if (typeof maseAdmin === 'undefined' || !maseAdmin.ajaxurl) {
                console.error('[MASE MD3] AJAX URL not available');
                return;
            }
            
            $.ajax({
                url: maseAdmin.ajaxurl,
                type: 'POST',
                data: {
                    action: 'mase_save_md3_palette',
                    nonce: maseAdmin.nonce,
                    palette: palette
                },
                success: function(response) {
                    if (response.success) {
                        console.log('[MASE MD3] Palette saved:', palette);
                        
                        // Show success notification
                        if (typeof MASEMD3Snackbar !== 'undefined') {
                            MASEMD3Snackbar.show('Palette applied successfully', 'success');
                        }
                    } else {
                        console.error('[MASE MD3] Failed to save palette:', response.data);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('[MASE MD3] AJAX error saving palette:', error);
                }
            });
        },
        
        /**
         * Update UI to reflect current palette
         * 
         * @param {string} palette - Palette name
         */
        updateUI: function(palette) {
            // Update palette selector buttons
            $('.mase-palette-selector').removeClass('active');
            $('.mase-palette-selector[data-palette="' + palette + '"]').addClass('active');
            
            // Update dropdown
            $('#mase-md3-palette-select').val(palette);
            
            // Update preview elements
            this.updatePreview(palette);
        },
        
        /**
         * Update palette preview
         * 
         * @param {string} palette - Palette name
         */
        updatePreview: function(palette) {
            // Get computed colors from CSS
            const root = document.documentElement;
            const styles = getComputedStyle(root);
            
            const colors = {
                primary: styles.getPropertyValue('--md-primary').trim(),
                secondary: styles.getPropertyValue('--md-secondary').trim(),
                tertiary: styles.getPropertyValue('--md-tertiary').trim()
            };
            
            // Update preview swatches if they exist
            $('.mase-palette-preview-primary').css('background-color', colors.primary);
            $('.mase-palette-preview-secondary').css('background-color', colors.secondary);
            $('.mase-palette-preview-tertiary').css('background-color', colors.tertiary);
        },
        
        /**
         * Get current palette
         * 
         * @return {string} Current palette name
         */
        getCurrentPalette: function() {
            return this.currentPalette;
        },
        
        /**
         * Get available palettes
         * 
         * @return {array} Array of palette names
         */
        getAvailablePalettes: function() {
            return this.palettes;
        }
    };
    
    /**
     * Initialize on document ready
     */
    $(document).ready(function() {
        MASEMD3Palette.init();
    });
    
    /**
     * Expose to global scope
     */
    window.MASEMD3Palette = MASEMD3Palette;
    
})(jQuery);
