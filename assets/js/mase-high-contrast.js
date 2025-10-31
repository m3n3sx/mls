/**
 * High Contrast Mode Controller
 * Modern Admin Styler - Accessibility Enhancement
 * 
 * Handles high contrast mode toggle and persistence
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 * Requirements: 17.2
 */

(function($) {
	'use strict';

	/**
	 * High Contrast Controller
	 */
	const MaseHighContrast = {
		/**
		 * Initialize high contrast controller
		 */
		init: function() {
			this.bindEvents();
			this.loadSavedState();
			this.detectSystemPreference();
		},

		/**
		 * Bind event handlers
		 */
		bindEvents: function() {
			// Toggle checkbox
			$(document).on('change', '#mase-high-contrast-toggle', this.handleToggle.bind(this));
			
			// Listen for system preference changes
			if (window.matchMedia) {
				const contrastQuery = window.matchMedia('(prefers-contrast: high)');
				if (contrastQuery.addEventListener) {
					contrastQuery.addEventListener('change', this.handleSystemPreferenceChange.bind(this));
				} else if (contrastQuery.addListener) {
					// Fallback for older browsers
					contrastQuery.addListener(this.handleSystemPreferenceChange.bind(this));
				}
			}
		},

		/**
		 * Handle toggle change
		 */
		handleToggle: function(e) {
			const enabled = $(e.target).is(':checked');
			this.setHighContrast(enabled);
			this.saveState(enabled);
			
			// Show notification
			this.showNotification(
				enabled ? 'High contrast mode enabled' : 'High contrast mode disabled'
			);
		},

		/**
		 * Set high contrast mode
		 */
		setHighContrast: function(enabled) {
			if (enabled) {
				document.documentElement.setAttribute('data-high-contrast', 'true');
				document.body.setAttribute('data-high-contrast', 'true');
				
				// Add badge to header
				this.addBadge();
			} else {
				document.documentElement.removeAttribute('data-high-contrast');
				document.body.removeAttribute('data-high-contrast');
				
				// Remove badge
				this.removeBadge();
			}
			
			// Trigger custom event
			$(document).trigger('mase:highContrastChanged', [enabled]);
		},

		/**
		 * Save state to WordPress options
		 */
		saveState: function(enabled) {
			if (!window.maseAdmin || !window.maseAdmin.ajaxurl) {
				return;
			}

			$.ajax({
				url: window.maseAdmin.ajaxurl,
				type: 'POST',
				data: {
					action: 'mase_save_high_contrast',
					nonce: window.maseAdmin.nonce,
					enabled: enabled ? '1' : '0'
				},
				success: function(response) {
					if (response.success) {
						console.log('High contrast preference saved');
					}
				},
				error: function(xhr, status, error) {
					console.error('Failed to save high contrast preference:', error);
				}
			});
		},

		/**
		 * Load saved state
		 */
		loadSavedState: function() {
			// Check if high contrast is already enabled via attribute
			const isEnabled = document.documentElement.getAttribute('data-high-contrast') === 'true';
			
			if (isEnabled) {
				$('#mase-high-contrast-toggle').prop('checked', true);
				this.addBadge();
			}
		},

		/**
		 * Detect system preference
		 */
		detectSystemPreference: function() {
			if (!window.matchMedia) {
				return;
			}

			const contrastQuery = window.matchMedia('(prefers-contrast: high)');
			
			if (contrastQuery.matches) {
				// System prefers high contrast
				const userOverride = document.documentElement.getAttribute('data-high-contrast');
				
				// Only apply if user hasn't explicitly disabled it
				if (userOverride !== 'false') {
					this.setHighContrast(true);
					$('#mase-high-contrast-toggle').prop('checked', true);
				}
			}
		},

		/**
		 * Handle system preference change
		 */
		handleSystemPreferenceChange: function(e) {
			if (e.matches) {
				// System now prefers high contrast
				this.setHighContrast(true);
				$('#mase-high-contrast-toggle').prop('checked', true);
				
				this.showNotification(
					'High contrast mode enabled (system preference detected)'
				);
			}
		},

		/**
		 * Add high contrast badge to header
		 */
		addBadge: function() {
			if ($('.mase-high-contrast-badge').length > 0) {
				return;
			}

			const badge = $('<div>')
				.addClass('mase-high-contrast-badge')
				.text('High Contrast')
				.attr('title', 'High contrast mode is active');

			$('.mase-header').append(badge);
		},

		/**
		 * Remove high contrast badge
		 */
		removeBadge: function() {
			$('.mase-high-contrast-badge').remove();
		},

		/**
		 * Show notification
		 */
		showNotification: function(message) {
			// Check if WordPress admin notices are available
			if (typeof wp !== 'undefined' && wp.data && wp.data.dispatch) {
				wp.data.dispatch('core/notices').createNotice(
					'info',
					message,
					{
						isDismissible: true,
						type: 'snackbar'
					}
				);
			} else {
				// Fallback to console
				console.log(message);
			}
		}
	};

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function() {
		MaseHighContrast.init();
	});

	/**
	 * Expose to global scope
	 */
	window.MaseHighContrast = MaseHighContrast;

})(jQuery);
