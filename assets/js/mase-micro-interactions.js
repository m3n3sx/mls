/**
 * Material Design 3 Micro-interactions
 * JavaScript for dynamic animation states
 */

(function($) {
    'use strict';

    /**
     * Initialize micro-interactions
     */
    function initMicroInteractions() {
        initFormSubmissionAnimations();
        initNotificationAnimations();
        initIconAnimations();
    }

    /**
     * Form submission animations
     */
    function initFormSubmissionAnimations() {
        // Handle form submissions
        $('form').on('submit', function(e) {
            const $form = $(this);
            const $submitButton = $form.find('button[type="submit"], input[type="submit"]');
            
            // Add submitting state
            $submitButton.addClass('submitting loading');
            
            // Simulate success after AJAX (this will be triggered by actual AJAX success)
            // This is just the animation setup
        });

        // Listen for custom success event
        $(document).on('mase:form:success', function(e, data) {
            const $submitButton = data.$button || $('button[type="submit"].submitting');
            
            // Remove loading, add success
            $submitButton.removeClass('submitting loading').addClass('success');
            
            // Remove success class after animation
            setTimeout(function() {
                $submitButton.removeClass('success');
            }, 600);
        });

        // Listen for custom error event
        $(document).on('mase:form:error', function(e, data) {
            const $submitButton = data.$button || $('button[type="submit"].submitting');
            
            // Remove loading state
            $submitButton.removeClass('submitting loading');
        });
    }

    /**
     * Notification animations
     */
    function initNotificationAnimations() {
        // Auto-dismiss notifications after 4 seconds
        $('.mase-notification, .mase-snackbar').each(function() {
            const $notification = $(this);
            
            // Skip if already has dismiss handler
            if ($notification.data('auto-dismiss-initialized')) {
                return;
            }
            
            $notification.data('auto-dismiss-initialized', true);
            
            // Auto-dismiss after 4 seconds
            setTimeout(function() {
                dismissNotification($notification);
            }, 4000);
        });

        // Handle manual dismiss
        $(document).on('click', '.mase-notification .mase-close-icon, .mase-snackbar .mase-close-icon', function(e) {
            e.preventDefault();
            const $notification = $(this).closest('.mase-notification, .mase-snackbar');
            dismissNotification($notification);
        });

        // WordPress notices
        $(document).on('click', '.notice .notice-dismiss', function() {
            const $notice = $(this).closest('.notice');
            dismissNotification($notice);
        });
    }

    /**
     * Dismiss notification with animation
     */
    function dismissNotification($notification) {
        $notification.addClass('dismissing');
        
        setTimeout(function() {
            $notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 300);
    }

    /**
     * Icon animations - add interactive classes
     */
    function initIconAnimations() {
        // Add mase-icon class to all interactive icons that don't have it
        $('.dashicons').each(function() {
            const $icon = $(this);
            const $parent = $icon.parent();
            
            // Only add if parent is interactive
            if ($parent.is('button, a, .mase-nav-tab, .mase-template-card')) {
                $icon.addClass('mase-icon');
            }
        });

        // Add specific icon classes based on context
        $('.dashicons-editor-help, .dashicons-info').addClass('mase-help-icon');
        $('.dashicons-no, .dashicons-dismiss').addClass('mase-close-icon');
        $('.dashicons-admin-generic, .dashicons-admin-settings').addClass('mase-settings-icon');
    }

    /**
     * Show notification programmatically
     */
    function showNotification(message, type = 'info', duration = 4000) {
        const $notification = $('<div>', {
            class: `mase-notification ${type}`,
            html: `
                <span class="mase-notification-message">${message}</span>
                <button class="mase-close-icon dashicons dashicons-no" aria-label="Dismiss"></button>
            `
        });

        // Append to body or notification container
        const $container = $('.mase-notification-container');
        if ($container.length) {
            $container.append($notification);
        } else {
            $('body').append($notification);
        }

        // Position notification
        $notification.css({
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000
        });

        // Auto-dismiss
        if (duration > 0) {
            setTimeout(function() {
                dismissNotification($notification);
            }, duration);
        }

        return $notification;
    }

    /**
     * Trigger form success animation
     */
    function triggerFormSuccess($button) {
        $(document).trigger('mase:form:success', { $button: $button });
    }

    /**
     * Trigger form error animation
     */
    function triggerFormError($button) {
        $(document).trigger('mase:form:error', { $button: $button });
    }

    // Initialize on document ready
    $(document).ready(function() {
        initMicroInteractions();
    });

    // Expose public API
    window.MASEMicroInteractions = {
        showNotification: showNotification,
        dismissNotification: dismissNotification,
        triggerFormSuccess: triggerFormSuccess,
        triggerFormError: triggerFormError
    };

})(jQuery);
