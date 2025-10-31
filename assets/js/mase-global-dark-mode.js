/**
 * MASE Global Dark Mode
 * 
 * Lightweight script for global dark/light mode toggle.
 * Works on all WordPress admin pages, not just MASE settings.
 * 
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.3.0
 */

(function($) {
    'use strict';

    /**
     * Global Dark Mode Controller
     */
    var MASEGlobalDarkMode = {
        
        /**
         * Initialize
         */
        init: function() {
            this.loadSavedMode();
            this.bindEvents();
            console.log('MASE Global Dark Mode initialized');
        },

        /**
         * Load saved mode from localStorage
         */
        loadSavedMode: function() {
            try {
                var savedMode = localStorage.getItem('mase_dark_mode');
                
                if (savedMode === 'dark') {
                    this.enableDarkMode(false); // false = don't save again
                } else if (savedMode === 'light') {
                    this.enableLightMode(false);
                }
            } catch (e) {
                console.warn('MASE: Could not load dark mode preference', e);
            }
        },

        /**
         * Bind events
         */
        bindEvents: function() {
            var self = this;
            
            // FAB click handler
            $(document).on('click', '#mase-global-dark-mode-fab', function(e) {
                e.preventDefault();
                self.toggle();
            });

            // Keyboard shortcut: Ctrl+Shift+D
            $(document).on('keydown', function(e) {
                if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                    e.preventDefault();
                    self.toggle();
                }
            });
        },

        /**
         * Toggle dark/light mode
         */
        toggle: function() {
            var $fab = $('#mase-global-dark-mode-fab');
            var currentMode = $fab.attr('data-mode');
            
            if (currentMode === 'dark') {
                this.enableLightMode(true);
            } else {
                this.enableDarkMode(true);
            }
        },

        /**
         * Enable dark mode
         * @param {boolean} save - Whether to save to localStorage and server
         */
        enableDarkMode: function(save) {
            // Add CSS classes
            $('html').attr('data-theme', 'dark');
            $('body').addClass('mase-dark-mode');
            
            // Update FAB
            var $fab = $('#mase-global-dark-mode-fab');
            $fab.attr('data-mode', 'dark');
            $fab.attr('aria-pressed', 'true');
            $fab.attr('aria-label', 'Switch to Light Mode');
            $fab.find('.dashicons').removeClass('dashicons-moon').addClass('dashicons-sun');
            $fab.find('.mase-fab-tooltip').text('Light Mode');
            $fab.find('.sr-only').text('Current mode: Dark');
            
            if (save) {
                // Save to localStorage
                try {
                    localStorage.setItem('mase_dark_mode', 'dark');
                } catch (e) {
                    console.warn('MASE: Could not save dark mode preference', e);
                }
                
                // Save to server (user meta)
                this.saveToServer('dark');
            }
            
            console.log('MASE: Dark mode enabled');
        },

        /**
         * Enable light mode
         * @param {boolean} save - Whether to save to localStorage and server
         */
        enableLightMode: function(save) {
            // Remove CSS classes
            $('html').removeAttr('data-theme');
            $('body').removeClass('mase-dark-mode');
            
            // Update FAB
            var $fab = $('#mase-global-dark-mode-fab');
            $fab.attr('data-mode', 'light');
            $fab.attr('aria-pressed', 'false');
            $fab.attr('aria-label', 'Switch to Dark Mode');
            $fab.find('.dashicons').removeClass('dashicons-sun').addClass('dashicons-moon');
            $fab.find('.mase-fab-tooltip').text('Dark Mode');
            $fab.find('.sr-only').text('Current mode: Light');
            
            if (save) {
                // Save to localStorage
                try {
                    localStorage.setItem('mase_dark_mode', 'light');
                } catch (e) {
                    console.warn('MASE: Could not save light mode preference', e);
                }
                
                // Save to server (user meta)
                this.saveToServer('light');
            }
            
            console.log('MASE: Light mode enabled');
        },

        /**
         * Save preference to server (user meta)
         * @param {string} mode - 'dark' or 'light'
         */
        saveToServer: function(mode) {
            if (typeof maseGlobalDarkMode === 'undefined') {
                console.warn('MASE: maseGlobalDarkMode not defined');
                return;
            }
            
            $.ajax({
                url: maseGlobalDarkMode.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'mase_toggle_dark_mode',
                    nonce: maseGlobalDarkMode.nonce,
                    mode: mode
                },
                success: function(response) {
                    if (response.success) {
                        console.log('MASE: Dark mode preference saved to server');
                    }
                },
                error: function(xhr, status, error) {
                    console.warn('MASE: Could not save dark mode preference to server', error);
                }
            });
        }
    };

    // Initialize on document ready
    $(document).ready(function() {
        MASEGlobalDarkMode.init();
    });

    // Expose to global scope for debugging
    window.MASEGlobalDarkMode = MASEGlobalDarkMode;

})(jQuery);
