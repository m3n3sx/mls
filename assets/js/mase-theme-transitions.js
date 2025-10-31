/**
 * MASE Theme Transitions Controller
 * 
 * Handles smooth animated transitions when switching between templates
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 * 
 * @package Modern_Admin_Styler_Enterprise
 * @since 2.0.0
 */

(function ($) {
    'use strict';

    /**
     * Theme Transitions Controller
     * Requirement 6.1: Implement crossfade transition (500ms)
     * Requirement 6.2: Add color transition for all elements
     * Requirement 6.3: Create stagger effect for elements
     * Requirement 6.4: Add loading indicator during switch
     * Requirement 6.5: Prevent multiple simultaneous switches
     */
    window.MASE_ThemeTransitions = {
        /**
         * State management
         */
        state: {
            isTransitioning: false,
            transitionTimeout: null,
            overlayElement: null,
            loadingElement: null
        },

        /**
         * Configuration
         */
        config: {
            transitionDuration: 500, // ms (Requirement 6.1)
            staggerDelay: 50, // ms between elements (Requirement 6.3)
            loadingDelay: 200 // ms before showing loading indicator
        },

        /**
         * Initialize theme transitions
         * Sets up DOM elements and event listeners
         */
        init: function () {
            this.createOverlayElement();
            this.createLoadingElement();
            this.bindEvents();
            
            if (window.MASE_DEBUG && window.MASE_DEBUG.enabled) {
                console.log('[MASE Theme Transitions] Initialized');
            }
        },

        /**
         * Create overlay element for crossfade effect
         * Requirement 6.1: Implement crossfade transition
         */
        createOverlayElement: function () {
            if (this.state.overlayElement) {
                return;
            }

            var overlay = $('<div>', {
                'class': 'mase-theme-overlay',
                'aria-hidden': 'true'
            });

            $('body').append(overlay);
            this.state.overlayElement = overlay;
        },

        /**
         * Create loading indicator element
         * Requirement 6.4: Add loading indicator during switch
         */
        createLoadingElement: function () {
            if (this.state.loadingElement) {
                return;
            }

            var loading = $('<div>', {
                'class': 'mase-theme-loading',
                'role': 'status',
                'aria-live': 'polite'
            });

            var spinner = $('<div>', {
                'class': 'mase-theme-loading-spinner',
                'aria-hidden': 'true'
            });

            var text = $('<div>', {
                'class': 'mase-theme-loading-text',
                'text': 'Applying theme...'
            });

            loading.append(spinner).append(text);
            $('body').append(loading);
            this.state.loadingElement = loading;
        },

        /**
         * Bind event listeners
         */
        bindEvents: function () {
            var self = this;

            // Listen for theme application events
            $(document).on('mase:theme:apply:start', function (e, data) {
                self.startTransition(data);
            });

            $(document).on('mase:theme:apply:complete', function () {
                self.completeTransition();
            });

            $(document).on('mase:theme:apply:error', function () {
                self.cancelTransition();
            });
        },

        /**
         * Start theme transition
         * Requirement 6.1: Implement crossfade transition (500ms)
         * Requirement 6.2: Add color transition for all elements
         * Requirement 6.3: Create stagger effect for elements
         * Requirement 6.4: Add loading indicator during switch
         * Requirement 6.5: Prevent multiple simultaneous switches
         * 
         * @param {Object} data - Transition data (templateId, templateName)
         */
        startTransition: function (data) {
            var self = this;

            // Requirement 6.5: Prevent multiple simultaneous switches
            if (this.state.isTransitioning) {
                if (window.MASE_DEBUG && window.MASE_DEBUG.enabled) {
                    console.log('[MASE Theme Transitions] Transition already in progress');
                }
                return false;
            }

            this.state.isTransitioning = true;

            if (window.MASE_DEBUG && window.MASE_DEBUG.enabled) {
                console.log('[MASE Theme Transitions] Starting transition:', data);
            }

            // Requirement 6.5: Disable template cards and buttons
            $('body').addClass('mase-theme-switching');

            // Requirement 6.2: Add transition classes for color transitions
            $('body').addClass('mase-theme-transitioning');

            // Requirement 6.4: Show loading indicator after delay
            this.state.transitionTimeout = setTimeout(function () {
                self.state.loadingElement.addClass('active');
            }, this.config.loadingDelay);

            // Requirement 6.1: Activate crossfade overlay
            setTimeout(function () {
                self.state.overlayElement.addClass('active');
            }, 50);

            return true;
        },

        /**
         * Complete theme transition
         * Called when theme has been successfully applied
         */
        completeTransition: function () {
            var self = this;

            if (window.MASE_DEBUG && window.MASE_DEBUG.enabled) {
                console.log('[MASE Theme Transitions] Completing transition');
            }

            // Clear loading timeout
            if (this.state.transitionTimeout) {
                clearTimeout(this.state.transitionTimeout);
                this.state.transitionTimeout = null;
            }

            // Hide loading indicator
            this.state.loadingElement.removeClass('active');

            // Wait for transition to complete before removing classes
            setTimeout(function () {
                $('body').removeClass('mase-theme-transitioning mase-theme-switching');
                self.state.overlayElement.removeClass('active');
                self.state.isTransitioning = false;
            }, this.config.transitionDuration);
        },

        /**
         * Cancel theme transition
         * Called when theme application fails
         */
        cancelTransition: function () {
            if (window.MASE_DEBUG && window.MASE_DEBUG.enabled) {
                console.log('[MASE Theme Transitions] Cancelling transition');
            }

            // Clear loading timeout
            if (this.state.transitionTimeout) {
                clearTimeout(this.state.transitionTimeout);
                this.state.transitionTimeout = null;
            }

            // Hide loading indicator immediately
            this.state.loadingElement.removeClass('active');

            // Remove transition classes
            $('body').removeClass('mase-theme-transitioning mase-theme-switching');
            this.state.overlayElement.removeClass('active');
            this.state.isTransitioning = false;
        },

        /**
         * Check if transition is in progress
         * Requirement 6.5: Prevent multiple simultaneous switches
         * 
         * @returns {boolean} True if transitioning
         */
        isTransitioning: function () {
            return this.state.isTransitioning;
        },

        /**
         * Update loading text
         * 
         * @param {string} text - New loading text
         */
        setLoadingText: function (text) {
            if (this.state.loadingElement) {
                this.state.loadingElement.find('.mase-theme-loading-text').text(text);
            }
        }
    };

    /**
     * Initialize on document ready
     */
    $(document).ready(function () {
        MASE_ThemeTransitions.init();
    });

})(jQuery);
