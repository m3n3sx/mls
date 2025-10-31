/**
 * Material Design 3 Loading States Manager
 * 
 * Provides utilities for managing loading states including:
 * - Shimmer loading effects
 * - Circular progress indicators
 * - Success animations
 * - Loading state transitions
 * 
 * @package ModernAdminStyler
 */

(function($) {
    'use strict';

    /**
     * MASE MD3 Loading States Manager
     */
    window.MASE_MD3_Loading = {
        
        /**
         * Show shimmer loading effect on an element
         * 
         * @param {jQuery|string} element - Element or selector
         * @param {Object} options - Configuration options
         * @returns {jQuery} The loading element
         */
        showShimmer: function(element, options) {
            const $element = $(element);
            const settings = $.extend({
                height: '16px',
                width: '100%',
                className: 'mase-skeleton-text'
            }, options);
            
            // Create shimmer element
            const $shimmer = $('<div>')
                .addClass('mase-loading-shimmer')
                .addClass(settings.className)
                .css({
                    height: settings.height,
                    width: settings.width
                });
            
            // Replace or append
            if (settings.replace) {
                $element.html($shimmer);
            } else {
                $element.append($shimmer);
            }
            
            return $shimmer;
        },
        
        /**
         * Show circular progress indicator
         * 
         * @param {jQuery|string} container - Container element or selector
         * @param {Object} options - Configuration options
         * @returns {jQuery} The progress element
         */
        showProgress: function(container, options) {
            const $container = $(container);
            const settings = $.extend({
                size: 'medium',
                color: 'primary',
                label: '',
                center: true
            }, options);
            
            // Create progress indicator
            const $progress = $('<div>')
                .addClass('mase-progress-circular')
                .addClass('mase-progress-circular--' + settings.size);
            
            if (settings.color !== 'primary') {
                $progress.addClass('mase-progress-circular--' + settings.color);
            }
            
            // Wrap in container if needed
            let $wrapper = $progress;
            if (settings.center) {
                $wrapper = $('<div>').addClass('mase-progress-center').append($progress);
            }
            
            // Add label if provided
            if (settings.label) {
                const $labeled = $('<div>')
                    .addClass('mase-progress-labeled')
                    .append($progress)
                    .append($('<div>').addClass('mase-progress-label').text(settings.label));
                $wrapper = settings.center ? $('<div>').addClass('mase-progress-center').append($labeled) : $labeled;
            }
            
            $container.html($wrapper);
            return $progress;
        },
        
        /**
         * Show success animation
         * 
         * @param {jQuery|string} container - Container element or selector
         * @param {Object} options - Configuration options
         * @returns {jQuery} The success element
         */
        showSuccess: function(container, options) {
            const $container = $(container);
            const settings = $.extend({
                title: 'Success!',
                description: '',
                expanding: false,
                duration: 2000
            }, options);
            
            // Create success checkmark
            const $checkmark = $('<div>')
                .addClass('mase-success-checkmark')
                .addClass('mase-success-animation');
            
            if (settings.expanding) {
                $checkmark.addClass('mase-success-expanding');
            }
            
            // Create success message
            const $message = $('<div>').addClass('mase-success-message');
            
            if (settings.title) {
                $message.append(
                    $('<div>').addClass('mase-success-title').text(settings.title)
                );
            }
            
            if (settings.description) {
                $message.append(
                    $('<div>').addClass('mase-success-description').text(settings.description)
                );
            }
            
            // Create container
            const $success = $('<div>')
                .addClass('mase-progress-center')
                .append(
                    $('<div>').append($checkmark).append($message)
                );
            
            $container.html($success);
            
            // Auto-remove after duration if specified
            if (settings.duration > 0) {
                setTimeout(function() {
                    $success.addClass('mase-loading-remove');
                    setTimeout(function() {
                        $success.remove();
                    }, 300);
                }, settings.duration);
            }
            
            return $checkmark;
        },
        
        /**
         * Show loading overlay on an element
         * 
         * @param {jQuery|string} container - Container element or selector
         * @param {Object} options - Configuration options
         * @returns {jQuery} The overlay element
         */
        showOverlay: function(container, options) {
            const $container = $(container);
            const settings = $.extend({
                label: 'Loading...',
                size: 'medium'
            }, options);
            
            // Make container relative if not already positioned
            if ($container.css('position') === 'static') {
                $container.css('position', 'relative');
            }
            
            // Create overlay
            const $overlay = $('<div>')
                .addClass('mase-loading-overlay')
                .append(
                    this.createProgressWithLabel(settings.label, settings.size)
                );
            
            $container.append($overlay);
            
            return $overlay;
        },
        
        /**
         * Hide loading overlay
         * 
         * @param {jQuery|string} container - Container element or selector
         * @param {Function} callback - Optional callback after hide
         */
        hideOverlay: function(container, callback) {
            const $container = $(container);
            const $overlay = $container.find('.mase-loading-overlay');
            
            if ($overlay.length) {
                $overlay.addClass('hidden');
                setTimeout(function() {
                    $overlay.remove();
                    if (callback) callback();
                }, 300);
            }
        },
        
        /**
         * Show button loading state
         * 
         * @param {jQuery|string} button - Button element or selector
         * @returns {jQuery} The button element
         */
        showButtonLoading: function(button) {
            const $button = $(button);
            $button.addClass('mase-button-loading').prop('disabled', true);
            return $button;
        },
        
        /**
         * Hide button loading state
         * 
         * @param {jQuery|string} button - Button element or selector
         * @returns {jQuery} The button element
         */
        hideButtonLoading: function(button) {
            const $button = $(button);
            $button.removeClass('mase-button-loading').prop('disabled', false);
            return $button;
        },
        
        /**
         * Show card loading state
         * 
         * @param {jQuery|string} card - Card element or selector
         * @returns {jQuery} The card element
         */
        showCardLoading: function(card) {
            const $card = $(card);
            $card.addClass('mase-card-loading');
            return $card;
        },
        
        /**
         * Hide card loading state
         * 
         * @param {jQuery|string} card - Card element or selector
         * @returns {jQuery} The card element
         */
        hideCardLoading: function(card) {
            const $card = $(card);
            $card.removeClass('mase-card-loading');
            return $card;
        },
        
        /**
         * Show field loading state
         * 
         * @param {jQuery|string} field - Field element or selector
         * @returns {jQuery} The field element
         */
        showFieldLoading: function(field) {
            const $field = $(field);
            $field.addClass('mase-field-loading');
            $field.find('input, select, textarea').prop('disabled', true);
            return $field;
        },
        
        /**
         * Hide field loading state
         * 
         * @param {jQuery|string} field - Field element or selector
         * @returns {jQuery} The field element
         */
        hideFieldLoading: function(field) {
            const $field = $(field);
            $field.removeClass('mase-field-loading');
            $field.find('input, select, textarea').prop('disabled', false);
            return $field;
        },
        
        /**
         * Create progress indicator with label
         * 
         * @param {string} label - Label text
         * @param {string} size - Size variant
         * @returns {jQuery} The progress container
         */
        createProgressWithLabel: function(label, size) {
            const $progress = $('<div>')
                .addClass('mase-progress-circular')
                .addClass('mase-progress-circular--' + size);
            
            if (!label) {
                return $progress;
            }
            
            return $('<div>')
                .addClass('mase-progress-labeled')
                .append($progress)
                .append($('<div>').addClass('mase-progress-label').text(label));
        },
        
        /**
         * Show loading dots animation
         * 
         * @param {jQuery|string} container - Container element or selector
         * @returns {jQuery} The dots container
         */
        showLoadingDots: function(container) {
            const $container = $(container);
            const $dots = $('<div>')
                .addClass('mase-loading-dots')
                .append($('<div>').addClass('mase-loading-dot'))
                .append($('<div>').addClass('mase-loading-dot'))
                .append($('<div>').addClass('mase-loading-dot'));
            
            $container.html($dots);
            return $dots;
        },
        
        /**
         * Create skeleton screen
         * 
         * @param {jQuery|string} container - Container element or selector
         * @param {Object} options - Configuration options
         * @returns {jQuery} The skeleton container
         */
        createSkeleton: function(container, options) {
            const $container = $(container);
            const settings = $.extend({
                heading: true,
                lines: 3,
                button: false,
                avatar: false
            }, options);
            
            const $skeleton = $('<div>').addClass('mase-skeleton-container');
            
            if (settings.avatar) {
                $skeleton.append(
                    $('<div>').addClass('mase-loading-shimmer mase-skeleton-avatar')
                );
            }
            
            if (settings.heading) {
                $skeleton.append(
                    $('<div>').addClass('mase-loading-shimmer mase-skeleton-heading')
                );
            }
            
            for (let i = 0; i < settings.lines; i++) {
                $skeleton.append(
                    $('<div>').addClass('mase-loading-shimmer mase-skeleton-text')
                );
            }
            
            if (settings.button) {
                $skeleton.append(
                    $('<div>').addClass('mase-loading-shimmer mase-skeleton-button')
                );
            }
            
            $container.html($skeleton);
            return $skeleton;
        },
        
        /**
         * Transition from loading to content
         * 
         * @param {jQuery|string} container - Container element or selector
         * @param {jQuery|string} content - Content to show
         * @param {Function} callback - Optional callback after transition
         */
        transitionToContent: function(container, content, callback) {
            const $container = $(container);
            const $content = $(content);
            
            // Hide loading overlay if present
            this.hideOverlay($container, function() {
                // Add loaded animation to content
                $content.addClass('mase-content-loaded');
                
                // Remove animation class after it completes
                setTimeout(function() {
                    $content.removeClass('mase-content-loaded');
                    if (callback) callback();
                }, 300);
            });
        }
    };
    
    // Make available globally
    window.MASELoading = window.MASE_MD3_Loading;

})(jQuery);
