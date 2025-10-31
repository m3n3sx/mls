/**
 * Material Design 3 Snackbar Notification System
 * 
 * Provides snackbar notifications with:
 * - Slide-in animation from bottom (300ms)
 * - Auto-dismiss after 4 seconds
 * - Fade-out animation
 * - Success, error, and info variants
 * - Action button support
 * - Queue management for multiple notifications
 * 
 * Requirements: 18.1, 18.2, 18.3, 18.4
 * 
 * @package ModernAdminStyler
 * @since 1.2.0
 */

(function($) {
	'use strict';

	/**
	 * Snackbar notification system
	 */
	const MASESnackbar = {
		/**
		 * Snackbar element
		 */
		$snackbar: null,

		/**
		 * Current timeout ID
		 */
		timeoutId: null,

		/**
		 * Notification queue
		 */
		queue: [],

		/**
		 * Is snackbar currently showing
		 */
		isShowing: false,

		/**
		 * Initialize snackbar system
		 */
		init: function() {
			this.$snackbar = $('#mase-snackbar');
			
			if (this.$snackbar.length === 0) {
				console.warn('MASE Snackbar: Snackbar element not found');
				return;
			}

			this.bindEvents();
			console.log('MASE Snackbar: Initialized');
		},

		/**
		 * Bind event handlers
		 */
		bindEvents: function() {
			const self = this;

			// Close button
			this.$snackbar.on('click', '.mase-snackbar-close', function(e) {
				e.preventDefault();
				self.hide();
			});

			// Action button
			this.$snackbar.on('click', '.mase-snackbar-action', function(e) {
				e.preventDefault();
				const callback = $(this).data('callback');
				if (typeof callback === 'function') {
					callback();
				}
				self.hide();
			});
		},

		/**
		 * Show snackbar notification
		 * 
		 * @param {Object} options - Notification options
		 * @param {string} options.message - Message text
		 * @param {string} options.type - Notification type (success, error, info, default)
		 * @param {number} options.duration - Auto-dismiss duration in ms (default: 4000)
		 * @param {string} options.actionText - Action button text (optional)
		 * @param {Function} options.actionCallback - Action button callback (optional)
		 * @param {string} options.icon - Icon class (optional, auto-detected from type)
		 */
		show: function(options) {
			// Add to queue if already showing
			if (this.isShowing) {
				this.queue.push(options);
				return;
			}

			// Default options
			const defaults = {
				message: '',
				type: 'default',
				duration: 4000,
				actionText: '',
				actionCallback: null,
				icon: ''
			};

			const settings = $.extend({}, defaults, options);

			// Auto-detect icon based on type
			if (!settings.icon) {
				switch (settings.type) {
					case 'success':
						settings.icon = 'dashicons-yes-alt';
						break;
					case 'error':
						settings.icon = 'dashicons-warning';
						break;
					case 'info':
						settings.icon = 'dashicons-info';
						break;
					default:
						settings.icon = 'dashicons-info-outline';
				}
			}

			// Update snackbar content
			this.$snackbar.find('.mase-snackbar-icon')
				.removeClass()
				.addClass('mase-snackbar-icon dashicons ' + settings.icon);

			this.$snackbar.find('.mase-snackbar-message')
				.text(settings.message);

			// Update action button
			const $action = this.$snackbar.find('.mase-snackbar-action');
			if (settings.actionText && settings.actionCallback) {
				$action
					.text(settings.actionText)
					.data('callback', settings.actionCallback)
					.show();
			} else {
				$action.hide();
			}

			// Update variant class
			this.$snackbar
				.removeClass('success error info')
				.addClass(settings.type);

			// Show snackbar with slide-in animation (Requirement 18.3)
			this.isShowing = true;
			this.$snackbar
				.show()
				.addClass('show');

			// Update ARIA live region
			this.$snackbar.attr('aria-live', settings.type === 'error' ? 'assertive' : 'polite');

			// Auto-dismiss after duration (Requirement 18.4)
			if (settings.duration > 0) {
				this.timeoutId = setTimeout(() => {
					this.hide();
				}, settings.duration);
			}
		},

		/**
		 * Hide snackbar with fade-out animation (Requirement 18.4)
		 */
		hide: function() {
			// Clear auto-dismiss timeout
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = null;
			}

			// Remove show class to trigger fade-out
			this.$snackbar.removeClass('show');

			// Wait for animation to complete before hiding
			setTimeout(() => {
				this.$snackbar.hide();
				this.isShowing = false;

				// Show next notification in queue
				if (this.queue.length > 0) {
					const next = this.queue.shift();
					// Small delay between notifications
					setTimeout(() => {
						this.show(next);
					}, 200);
				}
			}, 300); // Match CSS transition duration
		},

		/**
		 * Show success notification
		 * 
		 * @param {string} message - Success message
		 * @param {Object} options - Additional options
		 */
		success: function(message, options = {}) {
			this.show($.extend({}, options, {
				message: message,
				type: 'success'
			}));
		},

		/**
		 * Show error notification
		 * 
		 * @param {string} message - Error message
		 * @param {Object} options - Additional options
		 */
		error: function(message, options = {}) {
			this.show($.extend({}, options, {
				message: message,
				type: 'error',
				duration: 6000 // Longer duration for errors
			}));
		},

		/**
		 * Show info notification
		 * 
		 * @param {string} message - Info message
		 * @param {Object} options - Additional options
		 */
		info: function(message, options = {}) {
			this.show($.extend({}, options, {
				message: message,
				type: 'info'
			}));
		}
	};

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function() {
		MASESnackbar.init();

		// Make globally accessible
		window.MASESnackbar = MASESnackbar;
	});

	/**
	 * jQuery plugin wrapper
	 */
	$.fn.maseSnackbar = function(options) {
		if (typeof options === 'string') {
			// Method call
			const method = options;
			const args = Array.prototype.slice.call(arguments, 1);
			
			if (method === 'show' && args.length > 0) {
				MASESnackbar.show(args[0]);
			} else if (method === 'hide') {
				MASESnackbar.hide();
			} else if (method === 'success' && args.length > 0) {
				MASESnackbar.success(args[0], args[1]);
			} else if (method === 'error' && args.length > 0) {
				MASESnackbar.error(args[0], args[1]);
			} else if (method === 'info' && args.length > 0) {
				MASESnackbar.info(args[0], args[1]);
			}
		} else {
			// Show with options
			MASESnackbar.show(options);
		}
		
		return this;
	};

})(jQuery);
