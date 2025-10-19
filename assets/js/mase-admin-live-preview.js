/**
 * Modern Admin Styler Enterprise - Live Preview System
 *
 * Handles live preview functionality for real-time style updates
 *
 * @package MASE
 * @since 1.2.0
 */

(function($) {
    'use strict';
    
    /**
     * MASEAdmin Object - Core live preview system
     * Requirements: 1.1, 4.4, 9.1
     */
    window.MASEAdmin = {
        
        /**
         * Configuration
         */
        config: {
            livePreviewEnabled: false,
            debounceDelay: 300,
            colorPickerDebounce: 100,
            sliderDebounce: 300
        },
        
        /**
         * State management
         */
        state: {
            livePreviewEnabled: false,
            isDirty: false
        },
        
        /**
         * Initialize the admin interface
         * Requirement 1.1: Implement init() method to set up all components
         * Requirement 4.4: Log initialization status
         * Requirement 9.1: Log initialization to console
         */
        init: function() {
            console.log('MASE Admin initializing...');
            
            try {
                // Verify required elements exist
                if ($('#mase-live-preview-toggle').length === 0) {
                    console.error('MASE Error: Live preview toggle element not found (#mase-live-preview-toggle)');
                }
                
                // Bind all events
                this.bindEvents();
                
                // Check if live preview is already enabled
                if ($('#mase-live-preview-toggle').is(':checked')) {
                    this.state.livePreviewEnabled = true;
                    this.livePreview.bind();
                    console.log('MASE: Live preview enabled on initialization');
                }
                
                console.log('MASE Admin initialized successfully');
                console.log('MASE: Live preview system ready');
                
            } catch (error) {
                console.error('MASE Initialization Error:', error);
            }
        },
        
        /**
         * Bind event handlers
         * Requirement 1.1: Implement bindEvents() method to attach event listeners
         */
        bindEvents: function() {
            var self = this;
            
            console.log('MASE: Binding events...');
            
            // Live preview toggle (Requirement 1.2)
            $('#mase-live-preview-toggle').on('change', function() {
                self.toggleLivePreview();
            });
            
            // Color picker events (Requirement 1.4)
            this.bindColorPickers();
            
            // Slider events (Requirement 1.5)
            this.bindSliders();
            
            console.log('MASE: Events bound successfully');
        },
        
        /**
         * Toggle live preview on/off
         * Requirement 1.1: Enable/disable live preview
         * Requirement 1.5: Update state.livePreviewEnabled
         * Requirement 9.2: Log state changes
         */
        toggleLivePreview: function() {
            var $checkbox = $('#mase-live-preview-toggle');
            this.state.livePreviewEnabled = $checkbox.is(':checked');
            
            console.log('MASE: Live preview toggled -', this.state.livePreviewEnabled ? 'enabled' : 'disabled');
            
            if (this.state.livePreviewEnabled) {
                this.livePreview.bind();
                this.livePreview.update();
                console.log('MASE: Live preview enabled and updated');
            } else {
                this.livePreview.unbind();
                this.livePreview.remove();
                console.log('MASE: Live preview disabled and CSS removed');
            }
        },
        
        /**
         * Bind color picker events
         * Requirement 1.4: Bind change events to all .mase-color-picker elements
         * Requirement 1.4: Implement 100ms debounce for color picker changes
         * Requirement 7.1: Trigger live preview update on color change
         */
        bindColorPickers: function() {
            var self = this;
            
            // Bind to all color picker inputs
            $('.mase-color-picker').on('change', this.debounce(function() {
                console.log('MASE: Color picker changed:', $(this).attr('id'), '=', $(this).val());
                if (self.state.livePreviewEnabled) {
                    self.livePreview.update();
                }
            }, this.config.colorPickerDebounce));
            
            console.log('MASE: Color picker events bound (100ms debounce)');
        },
        
        /**
         * Bind slider events
         * Requirement 1.5: Bind input events to all input[type="range"] elements
         * Requirement 1.5: Update slider value display on input
         * Requirement 1.5: Implement 300ms debounce for slider changes
         * Requirement 7.1: Trigger live preview update on slider change
         */
        bindSliders: function() {
            var self = this;
            
            // Bind to all range sliders
            $('input[type="range"]').on('input', function() {
                var $slider = $(this);
                var value = $slider.val();
                
                // Update slider value display (Requirement 1.5)
                var $display = $slider.siblings('.mase-slider-value');
                if ($display.length) {
                    $display.text(value);
                }
                
                // Debounced live preview update
                self.debouncedSliderUpdate();
            });
            
            // Create debounced update function
            this.debouncedSliderUpdate = this.debounce(function() {
                console.log('MASE: Slider value changed');
                if (self.state.livePreviewEnabled) {
                    self.livePreview.update();
                }
            }, this.config.sliderDebounce);
            
            console.log('MASE: Slider events bound (300ms debounce)');
        },
        
        /**
         * Live Preview Module
         * Handles real-time preview of settings changes
         * Requirements: 1.2, 1.3, 1.4
         */
        livePreview: {
            /**
             * Bind input events for live preview
             * Requirement 1.3: Bind events to form controls
             */
            bind: function() {
                var self = MASEAdmin;
                
                console.log('MASE: Binding live preview events...');
                
                // Bind to text inputs
                $('input[type="text"], input[type="number"]').on('input.livepreview', self.debounce(function() {
                    console.log('MASE: Text input changed');
                    self.livePreview.update();
                }, self.config.debounceDelay));
                
                // Bind to selects
                $('select').on('change.livepreview', self.debounce(function() {
                    console.log('MASE: Select changed');
                    self.livePreview.update();
                }, self.config.debounceDelay));
                
                console.log('MASE: Live preview events bound');
            },
            
            /**
             * Unbind input events
             */
            unbind: function() {
                $('input[type="text"], input[type="number"], select').off('.livepreview');
                console.log('MASE: Live preview events unbound');
            },
            
            /**
             * Update preview with current settings
             * Requirement 1.3: Update preview in real-time
             */
            update: function() {
                console.log('MASE: Updating live preview...');
                
                var formData = this.collectFormData();
                var css = this.generatePreviewCSS(formData);
                this.applyPreviewCSS(css);
                
                console.log('MASE: Live preview updated');
            },
            
            /**
             * Collect current form data
             * Requirement 1.3: Write collectFormData() method to gather all form values
             */
            collectFormData: function() {
                var formData = {
                    admin_bar: {},
                    admin_menu: {}
                };
                
                // Collect admin bar settings
                formData.admin_bar.bg_color = $('#admin-bar-bg-color').val() || '#23282d';
                formData.admin_bar.text_color = $('#admin-bar-text-color').val() || '#ffffff';
                formData.admin_bar.height = $('#admin-bar-height').val() || 32;
                
                // Collect admin menu settings
                formData.admin_menu.bg_color = $('#admin-menu-bg-color').val() || '#23282d';
                formData.admin_menu.text_color = $('#admin-menu-text-color').val() || '#ffffff';
                formData.admin_menu.hover_bg_color = $('#admin-menu-hover-bg-color').val() || '#191e23';
                formData.admin_menu.hover_text_color = $('#admin-menu-hover-text-color').val() || '#00b9eb';
                formData.admin_menu.width = $('#admin-menu-width').val() || 160;
                
                console.log('MASE: Form data collected:', formData);
                
                return formData;
            },
            
            /**
             * Generate preview CSS from form data
             * Requirement 1.3: Write generatePreviewCSS() method to create CSS from form data
             * Requirement 1.3: Implement CSS generation for admin bar colors and dimensions
             * Requirement 1.3: Implement CSS generation for admin menu colors and dimensions
             */
            generatePreviewCSS: function(formData) {
                var css = '';
                
                // Admin bar CSS (Requirement 1.3)
                if (formData.admin_bar) {
                    css += '#wpadminbar {';
                    if (formData.admin_bar.bg_color) {
                        css += 'background-color: ' + formData.admin_bar.bg_color + ' !important;';
                    }
                    if (formData.admin_bar.height) {
                        css += 'height: ' + formData.admin_bar.height + 'px !important;';
                    }
                    css += '}';
                    
                    // Admin bar text color
                    if (formData.admin_bar.text_color) {
                        css += '#wpadminbar .ab-item, ';
                        css += '#wpadminbar a.ab-item, ';
                        css += '#wpadminbar > #wp-toolbar span.ab-label, ';
                        css += '#wpadminbar > #wp-toolbar span.noticon {';
                        css += 'color: ' + formData.admin_bar.text_color + ' !important;';
                        css += '}';
                    }
                    
                    // Adjust page margin for admin bar height
                    if (formData.admin_bar.height) {
                        css += 'body.admin-bar {';
                        css += 'margin-top: ' + formData.admin_bar.height + 'px !important;';
                        css += '}';
                    }
                }
                
                // Admin menu CSS (Requirement 1.3)
                if (formData.admin_menu) {
                    css += '#adminmenuwrap, #adminmenu, #adminmenuback {';
                    if (formData.admin_menu.bg_color) {
                        css += 'background-color: ' + formData.admin_menu.bg_color + ' !important;';
                    }
                    if (formData.admin_menu.width) {
                        css += 'width: ' + formData.admin_menu.width + 'px !important;';
                    }
                    css += '}';
                    
                    // Admin menu text color
                    if (formData.admin_menu.text_color) {
                        css += '#adminmenu a, #adminmenu div.wp-menu-name {';
                        css += 'color: ' + formData.admin_menu.text_color + ' !important;';
                        css += '}';
                    }
                    
                    // Admin menu hover states
                    if (formData.admin_menu.hover_bg_color) {
                        css += '#adminmenu li.menu-top:hover, ';
                        css += '#adminmenu li.opensub > a.menu-top, ';
                        css += '#adminmenu li > a.menu-top:focus {';
                        css += 'background-color: ' + formData.admin_menu.hover_bg_color + ' !important;';
                        css += '}';
                    }
                    
                    if (formData.admin_menu.hover_text_color) {
                        css += '#adminmenu li.menu-top:hover a, ';
                        css += '#adminmenu li.opensub > a.menu-top, ';
                        css += '#adminmenu li > a.menu-top:focus {';
                        css += 'color: ' + formData.admin_menu.hover_text_color + ' !important;';
                        css += '}';
                    }
                    
                    // Adjust content area margin for menu width
                    if (formData.admin_menu.width) {
                        css += '#wpcontent, #wpfooter {';
                        css += 'margin-left: ' + formData.admin_menu.width + 'px !important;';
                        css += '}';
                        
                        css += 'body.folded #wpcontent, body.folded #wpfooter {';
                        css += 'margin-left: 36px !important;';
                        css += '}';
                    }
                }
                
                console.log('MASE: Generated CSS length:', css.length, 'characters');
                
                return css;
            },
            
            /**
             * Apply preview CSS to page
             * Requirement 1.3: Write applyPreviewCSS() method to inject CSS into page
             */
            applyPreviewCSS: function(css) {
                var $style = $('#mase-live-preview-css');
                
                // Create style tag if it doesn't exist
                if ($style.length === 0) {
                    $style = $('<style id="mase-live-preview-css" type="text/css"></style>');
                    $('head').append($style);
                    console.log('MASE: Created live preview style tag');
                }
                
                // Update CSS content
                $style.text(css);
                console.log('MASE: Applied preview CSS to page');
            },
            
            /**
             * Remove live preview CSS
             */
            remove: function() {
                $('#mase-live-preview-css').remove();
                console.log('MASE: Removed live preview CSS');
            }
        },
        
        /**
         * Debounce utility function for performance optimization
         * Requirement: Implement debounce utility for performance optimization
         * 
         * @param {Function} func - Function to debounce
         * @param {number} wait - Milliseconds to wait
         * @return {Function} Debounced function
         */
        debounce: function(func, wait) {
            var timeout;
            return function() {
                var context = this;
                var args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    func.apply(context, args);
                }, wait);
            };
        }
    };
    
    // Initialize on document ready
    $(document).ready(function() {
        MASEAdmin.init();
    });
    
})(jQuery);
