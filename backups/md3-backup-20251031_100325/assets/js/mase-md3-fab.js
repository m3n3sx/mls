/**
 * Material Design 3 Floating Action Button (FAB)
 * Handles FAB interactions, save action, loading states, and success feedback
 * 
 * Requirements: 25.1, 25.2, 25.3, 25.4, 25.5
 * 
 * @package ModernAdminStyler
 * @since 1.2.0
 */

(function ($) {
    'use strict';

    /**
     * FAB Manager Module
     * Handles all FAB interactions and states
     */
    var MASE_FAB = {
        /**
         * FAB element cache
         */
        $fab: null,
        $form: null,
        $saveButton: null,
        
        /**
         * State flags
         */
        isLoading: false,
        isSaving: false,
        
        /**
         * Initialize FAB
         * Requirement 25.1: Initialize FAB functionality
         */
        init: function () {
            var self = this;
            
            // Cache DOM elements
            this.$fab = $('#mase-fab-save');
            this.$form = $('#mase-settings-form');
            this.$saveButton = $('#mase-save-settings');
            
            if (this.$fab.length === 0) {
                console.log('[MASE FAB] FAB element not found');
                return;
            }
            
            console.log('[MASE FAB] Initializing FAB');
            
            // Bind events
            this.bindEvents();
            
            // Initialize ripple effect
            this.initRipple();
            
            // Hide/show FAB on scroll (optional enhancement)
            this.initScrollBehavior();
            
            console.log('[MASE FAB] FAB initialized successfully');
        },
        
        /**
         * Bind FAB events
         * Requirement 25.5: Handle FAB click to trigger save
         */
        bindEvents: function () {
            var self = this;
            
            // FAB click handler - Requirement 25.5
            this.$fab.on('click', function (e) {
                e.preventDefault();
                
                if (self.isSaving) {
                    console.log('[MASE FAB] Save already in progress');
                    return;
                }
                
                console.log('[MASE FAB] FAB clicked, triggering save');
                self.handleSave();
            });
            
            // Listen for form submit events to sync FAB state
            if (this.$form.length > 0) {
                this.$form.on('submit', function (e) {
                    // Don't prevent default, let form submit normally
                    console.log('[MASE FAB] Form submit detected');
                    self.showLoading();
                });
            }
            
            // Listen for save button clicks to sync FAB state
            if (this.$saveButton.length > 0) {
                this.$saveButton.on('click', function () {
                    console.log('[MASE FAB] Save button clicked');
                    self.showLoading();
                });
            }
            
            // Listen for AJAX complete events
            $(document).on('mase:save:start', function () {
                console.log('[MASE FAB] Save started');
                self.showLoading();
            });
            
            $(document).on('mase:save:success', function () {
                console.log('[MASE FAB] Save successful');
                self.showSuccess();
            });
            
            $(document).on('mase:save:error', function () {
                console.log('[MASE FAB] Save error');
                self.showError();
            });
        },
        
        /**
         * Handle save action
         * Requirement 25.5: Trigger save action when FAB is clicked
         */
        handleSave: function () {
            console.log('[MASE FAB] Handling save action');
            
            // Show loading state
            this.showLoading();
            
            // Trigger form submit
            if (this.$form.length > 0) {
                console.log('[MASE FAB] Submitting form');
                this.$form.submit();
            } else if (this.$saveButton.length > 0) {
                console.log('[MASE FAB] Clicking save button');
                this.$saveButton.trigger('click');
            } else {
                console.error('[MASE FAB] No form or save button found');
                this.showError();
            }
        },
        
        /**
         * Show loading state
         * Requirement 25.5: Show loading state during save
         */
        showLoading: function () {
            console.log('[MASE FAB] Showing loading state');
            
            this.isSaving = true;
            this.$fab.addClass('loading');
            this.$fab.prop('disabled', true);
            this.$fab.attr('aria-busy', 'true');
            
            // Change icon to loading spinner
            var $icon = this.$fab.find('.mase-fab-icon');
            $icon.removeClass('dashicons-saved')
                 .addClass('dashicons-update');
        },
        
        /**
         * Show success state
         * Requirement 25.5: Display success feedback after save
         */
        showSuccess: function () {
            var self = this;
            
            console.log('[MASE FAB] Showing success state');
            
            this.$fab.removeClass('loading error');
            this.$fab.addClass('success');
            this.$fab.attr('aria-busy', 'false');
            
            // Change icon to checkmark
            var $icon = this.$fab.find('.mase-fab-icon');
            $icon.removeClass('dashicons-update dashicons-saved')
                 .addClass('dashicons-yes');
            
            // Reset to normal state after 2 seconds
            setTimeout(function () {
                self.resetState();
            }, 2000);
        },
        
        /**
         * Show error state
         * Requirement 25.5: Display error feedback if save fails
         */
        showError: function () {
            var self = this;
            
            console.log('[MASE FAB] Showing error state');
            
            this.$fab.removeClass('loading success');
            this.$fab.addClass('error');
            this.$fab.attr('aria-busy', 'false');
            
            // Change icon to error
            var $icon = this.$fab.find('.mase-fab-icon');
            $icon.removeClass('dashicons-update dashicons-saved dashicons-yes')
                 .addClass('dashicons-warning');
            
            // Reset to normal state after 3 seconds
            setTimeout(function () {
                self.resetState();
            }, 3000);
        },
        
        /**
         * Reset FAB to normal state
         */
        resetState: function () {
            console.log('[MASE FAB] Resetting to normal state');
            
            this.isSaving = false;
            this.$fab.removeClass('loading success error');
            this.$fab.prop('disabled', false);
            this.$fab.attr('aria-busy', 'false');
            
            // Reset icon to saved
            var $icon = this.$fab.find('.mase-fab-icon');
            $icon.removeClass('dashicons-update dashicons-yes dashicons-warning')
                 .addClass('dashicons-saved');
        },
        
        /**
         * Initialize ripple effect
         * Requirement 25.5: Add ripple effect on click
         */
        initRipple: function () {
            var self = this;
            
            this.$fab.on('mousedown touchstart', function (e) {
                // Don't add ripple if disabled or loading
                if (self.$fab.prop('disabled') || self.$fab.hasClass('loading')) {
                    return;
                }
                
                var $button = $(this);
                var $ripple = $('<span class="mase-ripple"></span>');
                
                // Get click position relative to button
                var rect = this.getBoundingClientRect();
                var x = (e.pageX || e.originalEvent.touches[0].pageX) - rect.left - window.pageXOffset;
                var y = (e.pageY || e.originalEvent.touches[0].pageY) - rect.top - window.pageYOffset;
                
                // Calculate ripple size (diameter of button)
                var size = Math.max(rect.width, rect.height);
                
                // Position ripple
                $ripple.css({
                    width: size,
                    height: size,
                    left: x - size / 2,
                    top: y - size / 2
                });
                
                // Add ripple to button
                $button.append($ripple);
                
                // Trigger animation
                setTimeout(function () {
                    $ripple.addClass('mase-ripple-active');
                }, 10);
                
                // Remove ripple after animation
                setTimeout(function () {
                    $ripple.remove();
                }, 600);
            });
        },
        
        /**
         * Initialize scroll behavior (optional enhancement)
         * Hide FAB when scrolling down, show when scrolling up
         */
        initScrollBehavior: function () {
            var self = this;
            var lastScrollTop = 0;
            var scrollThreshold = 100;
            var isHidden = false;
            
            $(window).on('scroll', function () {
                var scrollTop = $(this).scrollTop();
                
                // Only hide/show if scrolled past threshold
                if (scrollTop < scrollThreshold) {
                    if (isHidden) {
                        self.$fab.removeClass('hidden');
                        isHidden = false;
                    }
                    return;
                }
                
                // Scrolling down - hide FAB
                if (scrollTop > lastScrollTop && !isHidden) {
                    self.$fab.addClass('hidden');
                    isHidden = true;
                }
                // Scrolling up - show FAB
                else if (scrollTop < lastScrollTop && isHidden) {
                    self.$fab.removeClass('hidden');
                    isHidden = false;
                }
                
                lastScrollTop = scrollTop;
            });
        }
    };

    /**
     * Initialize on document ready
     */
    $(document).ready(function () {
        MASE_FAB.init();
    });

    /**
     * Expose MASE_FAB globally for debugging
     */
    window.MASE_FAB = MASE_FAB;

})(jQuery);
