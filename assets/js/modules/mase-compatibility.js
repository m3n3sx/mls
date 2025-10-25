/**
 * MASE Browser Compatibility Module
 * 
 * Detects browser feature support and provides graceful degradation
 * for the Advanced Background System.
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function($) {
    'use strict';

    window.MASE = window.MASE || {};

    /**
     * Browser Compatibility Detection and Handling
     */
    MASE.compatibility = {
        /**
         * Feature support flags
         */
        features: {
            fileReader: false,
            dragDrop: false,
            blendModes: false,
            gradients: false,
            webp: false,
            intersectionObserver: false,
            cssVariables: false
        },

        /**
         * Initialize compatibility checks
         */
        init: function() {
            this.detectFeatures();
            this.applyFallbacks();
            this.showCompatibilityNotices();
        },

        /**
         * Detect all browser features
         */
        detectFeatures: function() {
            // FileReader API (for file upload preview)
            this.features.fileReader = typeof FileReader !== 'undefined';

            // Drag and Drop API
            this.features.dragDrop = 'draggable' in document.createElement('div') &&
                                     'ondrop' in document.createElement('div');

            // CSS Blend Modes
            this.features.blendModes = this.detectBlendModes();

            // CSS Gradients
            this.features.gradients = this.detectGradients();

            // IntersectionObserver (for lazy loading)
            this.features.intersectionObserver = 'IntersectionObserver' in window;

            // CSS Custom Properties
            this.features.cssVariables = this.detectCSSVariables();

            // WebP support (async detection)
            this.detectWebP();

            // Log detected features in debug mode
            if (window.console && maseAdmin.debug) {
                console.log('MASE Compatibility:', this.features);
            }
        },

        /**
         * Detect CSS blend mode support
         * 
         * @return {boolean} True if blend modes are supported
         */
        detectBlendModes: function() {
            if (typeof CSS === 'undefined' || typeof CSS.supports === 'undefined') {
                return false;
            }

            return CSS.supports('mix-blend-mode', 'overlay') ||
                   CSS.supports('mix-blend-mode', 'multiply');
        },

        /**
         * Detect CSS gradient support
         * 
         * @return {boolean} True if gradients are supported
         */
        detectGradients: function() {
            if (typeof CSS === 'undefined' || typeof CSS.supports === 'undefined') {
                // Fallback detection for older browsers
                var testElement = document.createElement('div');
                testElement.style.cssText = 'background-image: linear-gradient(#fff, #000);';
                return testElement.style.backgroundImage.indexOf('gradient') !== -1;
            }

            return CSS.supports('background-image', 'linear-gradient(#fff, #000)') ||
                   CSS.supports('background-image', 'radial-gradient(circle, #fff, #000)');
        },

        /**
         * Detect CSS custom properties support
         * 
         * @return {boolean} True if CSS variables are supported
         */
        detectCSSVariables: function() {
            if (typeof CSS === 'undefined' || typeof CSS.supports === 'undefined') {
                return false;
            }

            return CSS.supports('--test', '0');
        },

        /**
         * Detect WebP support asynchronously
         */
        detectWebP: function() {
            var self = this;
            var webp = new Image();

            webp.onload = webp.onerror = function() {
                self.features.webp = (webp.height === 2);
                
                // Update UI after detection
                self.updateWebPUI();

                // Trigger custom event
                $(document).trigger('mase:webp-detected', [self.features.webp]);
            };

            // Lossy WebP test image
            webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        },

        /**
         * Apply fallbacks for unsupported features
         */
        applyFallbacks: function() {
            // FileReader fallback
            if (!this.features.fileReader) {
                this.disableFileUploadPreview();
            }

            // Drag & Drop fallback
            if (!this.features.dragDrop) {
                this.disableDragDrop();
            }

            // Blend modes fallback
            if (!this.features.blendModes) {
                this.disableBlendModes();
            }

            // Gradients fallback
            if (!this.features.gradients) {
                this.disableGradients();
            }

            // IntersectionObserver fallback
            if (!this.features.intersectionObserver) {
                this.provideLazyLoadFallback();
            }

            // CSS Variables fallback
            if (!this.features.cssVariables) {
                this.provideCSSVariablesFallback();
            }
        },

        /**
         * Disable file upload preview if FileReader not supported
         */
        disableFileUploadPreview: function() {
            $('.mase-background-upload-zone').each(function() {
                var $zone = $(this);
                $zone.find('.mase-upload-preview').remove();
                $zone.addClass('mase-no-preview');
            });
        },

        /**
         * Disable drag & drop functionality
         */
        disableDragDrop: function() {
            $('.mase-background-upload-zone').each(function() {
                var $zone = $(this);
                $zone.removeClass('mase-drag-drop-enabled');
                $zone.find('.mase-drag-drop-text').hide();
                $zone.find('.mase-click-upload-text').show();
            });
        },

        /**
         * Disable blend mode controls
         */
        disableBlendModes: function() {
            $('.mase-blend-mode-control').each(function() {
                var $control = $(this);
                $control.prop('disabled', true);
                $control.val('normal');
                $control.closest('.mase-control-group').addClass('mase-feature-unsupported');
            });
        },

        /**
         * Disable gradient builder
         */
        disableGradients: function() {
            $('.mase-gradient-builder').each(function() {
                var $builder = $(this);
                $builder.addClass('mase-feature-unsupported');
                $builder.find('input, select, button').prop('disabled', true);
            });

            // Hide gradient option from background type selector
            $('.mase-background-type option[value="gradient"]').prop('disabled', true);
        },

        /**
         * Provide fallback for lazy loading without IntersectionObserver
         */
        provideLazyLoadFallback: function() {
            // Load all images immediately instead of lazy loading
            $(document).on('mase:background-image-set', function(e, area, imageUrl) {
                var selector = MASE.compatibility.getAreaSelector(area);
                $(selector).css('background-image', 'url(' + imageUrl + ')');
            });
        },

        /**
         * Provide fallback for CSS custom properties
         */
        provideCSSVariablesFallback: function() {
            // Use inline styles instead of CSS variables
            $('body').addClass('mase-no-css-variables');
        },

        /**
         * Update UI after WebP detection
         */
        updateWebPUI: function() {
            if (this.features.webp) {
                $('body').addClass('mase-webp-supported');
            } else {
                $('body').addClass('mase-webp-not-supported');
            }
        },

        /**
         * Show compatibility notices for unsupported features
         */
        showCompatibilityNotices: function() {
            var unsupportedFeatures = [];

            if (!this.features.fileReader) {
                unsupportedFeatures.push('File preview');
            }

            if (!this.features.dragDrop) {
                unsupportedFeatures.push('Drag & drop upload');
            }

            if (!this.features.blendModes) {
                unsupportedFeatures.push('Blend modes');
            }

            if (!this.features.gradients) {
                unsupportedFeatures.push('CSS gradients');
            }

            // Show notice if any features are unsupported
            if (unsupportedFeatures.length > 0) {
                this.displayCompatibilityNotice(unsupportedFeatures);
            }
        },

        /**
         * Display compatibility notice
         * 
         * @param {Array} features Array of unsupported feature names
         */
        displayCompatibilityNotice: function(features) {
            var message = 'Your browser does not support the following features: ' +
                         features.join(', ') + '. ' +
                         'Some functionality may be limited. ' +
                         'Please consider updating your browser for the best experience.';

            var $notice = $('<div class="notice notice-warning mase-compatibility-notice">' +
                '<p><strong>Browser Compatibility:</strong> ' + message + '</p>' +
                '</div>');

            // Insert notice at the top of the settings page
            $('.mase-settings-page').prepend($notice);
        },

        /**
         * Get CSS selector for admin area
         * 
         * @param {string} area Area identifier
         * @return {string} CSS selector
         */
        getAreaSelector: function(area) {
            var selectors = {
                'dashboard': '#wpbody-content',
                'admin_menu': '#adminmenu',
                'post_lists': '.wp-list-table',
                'post_editor': '#post-body',
                'widgets': '.postbox',
                'login': 'body.login'
            };

            return selectors[area] || '';
        },

        /**
         * Check if a specific feature is supported
         * 
         * @param {string} feature Feature name
         * @return {boolean} True if supported
         */
        isSupported: function(feature) {
            return this.features[feature] === true;
        },

        /**
         * Get browser information
         * 
         * @return {Object} Browser name and version
         */
        getBrowserInfo: function() {
            var ua = navigator.userAgent;
            var browser = {
                name: 'Unknown',
                version: 'Unknown'
            };

            // Detect browser
            if (ua.indexOf('Firefox') > -1) {
                browser.name = 'Firefox';
                browser.version = ua.match(/Firefox\/(\d+)/)[1];
            } else if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
                browser.name = 'Chrome';
                browser.version = ua.match(/Chrome\/(\d+)/)[1];
            } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
                browser.name = 'Safari';
                browser.version = ua.match(/Version\/(\d+)/)[1];
            } else if (ua.indexOf('Edg') > -1) {
                browser.name = 'Edge';
                browser.version = ua.match(/Edg\/(\d+)/)[1];
            } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
                browser.name = 'Internet Explorer';
                browser.version = ua.match(/(?:MSIE |rv:)(\d+)/)[1];
            }

            return browser;
        },

        /**
         * Check if browser is outdated
         * 
         * @return {boolean} True if browser is outdated
         */
        isOutdatedBrowser: function() {
            var browser = this.getBrowserInfo();
            var minVersions = {
                'Chrome': 60,
                'Firefox': 55,
                'Safari': 11,
                'Edge': 79,
                'Internet Explorer': 999 // IE not supported
            };

            if (browser.name in minVersions) {
                return parseInt(browser.version) < minVersions[browser.name];
            }

            return false;
        },

        /**
         * Show outdated browser warning
         */
        showOutdatedBrowserWarning: function() {
            if (this.isOutdatedBrowser()) {
                var browser = this.getBrowserInfo();
                var message = 'You are using an outdated version of ' + browser.name + ' (' + browser.version + '). ' +
                             'Please update your browser for the best experience and security.';

                var $notice = $('<div class="notice notice-error mase-outdated-browser-notice">' +
                    '<p><strong>Outdated Browser:</strong> ' + message + '</p>' +
                    '</div>');

                $('.mase-settings-page').prepend($notice);
            }
        }
    };

    /**
     * Initialize on document ready
     */
    $(document).ready(function() {
        MASE.compatibility.init();
        MASE.compatibility.showOutdatedBrowserWarning();
    });

})(jQuery);
