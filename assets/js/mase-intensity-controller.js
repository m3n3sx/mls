/**
 * Theme Intensity Controller
 * Modern Admin Styler - Template Visual Enhancements v2
 * 
 * Handles theme intensity controls:
 * - Slider change handler
 * - CSS custom property updates
 * - WordPress options persistence
 * - Live preview updates
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function($) {
	'use strict';

	/**
	 * Intensity Controller Class
	 */
	class MASEIntensityController {
		constructor() {
			this.slider = null;
			this.labels = null;
			this.stats = {
				animationSpeed: null,
				blurAmount: null,
				glowIntensity: null
			};
			this.currentIntensity = 2; // Default: Medium
			
			this.init();
		}

		/**
		 * Initialize the controller
		 */
		init() {
			// Wait for DOM ready
			$(document).ready(() => {
				this.cacheElements();
				this.bindEvents();
				this.loadSavedIntensity();
				this.updateUI();
			});
		}

		/**
		 * Cache DOM elements
		 */
		cacheElements() {
			this.slider = $('#theme-intensity-level');
			this.labels = $('.mase-intensity-label');
			this.stats = {
				animationSpeed: $('#intensity-animation-speed'),
				blurAmount: $('#intensity-blur-amount'),
				glowIntensity: $('#intensity-glow-intensity')
			};
		}

		/**
		 * Bind event handlers
		 */
		bindEvents() {
			if (!this.slider.length) {
				return;
			}

			// Slider change event
			this.slider.on('input change', (e) => {
				this.handleSliderChange(e);
			});

			// Label click events for quick selection
			this.labels.on('click', (e) => {
				const value = $(e.currentTarget).data('value');
				this.slider.val(value).trigger('change');
			});

			// Save settings when form is submitted
			$('#mase-settings-form').on('submit', () => {
				this.saveIntensity();
			});
		}

		/**
		 * Handle slider change
		 * @param {Event} e - Change event
		 */
		handleSliderChange(e) {
			const value = parseInt($(e.target).val(), 10);
			this.currentIntensity = value;
			
			// Update CSS custom properties
			this.updateCSSProperties(value);
			
			// Update UI
			this.updateUI();
			
			// Update ARIA attributes
			this.updateARIA(value);
		}

		/**
		 * Update CSS custom properties based on intensity level
		 * @param {number} level - Intensity level (1=Low, 2=Medium, 3=High)
		 */
		updateCSSProperties(level) {
			const root = document.documentElement;
			const body = document.body;
			
			// Set data attribute for CSS selectors
			const intensityName = this.getIntensityName(level);
			root.setAttribute('data-intensity', intensityName);
			body.setAttribute('data-intensity', intensityName);
			
			// Calculate multipliers based on level
			let multiplier, animationSpeed, blurAmount, glowIntensity, shadowDepth, transitionDuration;
			
			switch(level) {
				case 1: // Low
					multiplier = 0.5;
					animationSpeed = '2s';
					blurAmount = '14px';
					glowIntensity = 0.7;
					shadowDepth = 0.7;
					transitionDuration = '600ms';
					break;
				case 3: // High
					multiplier = 1.5;
					animationSpeed = '0.7s';
					blurAmount = '30px';
					glowIntensity = 1.5;
					shadowDepth = 1.5;
					transitionDuration = '200ms';
					break;
				case 2: // Medium (default)
				default:
					multiplier = 1;
					animationSpeed = '1s';
					blurAmount = '20px';
					glowIntensity = 1;
					shadowDepth = 1;
					transitionDuration = '300ms';
					break;
			}
			
			// Set CSS custom properties
			root.style.setProperty('--mase-intensity-multiplier', multiplier);
			root.style.setProperty('--mase-animation-speed', animationSpeed);
			root.style.setProperty('--mase-blur-amount', blurAmount);
			root.style.setProperty('--mase-glow-intensity', glowIntensity);
			root.style.setProperty('--mase-shadow-depth', shadowDepth);
			root.style.setProperty('--mase-transition-duration', transitionDuration);
			
			// Trigger custom event for other components
			$(document).trigger('mase:intensityChanged', {
				level: level,
				multiplier: multiplier,
				animationSpeed: animationSpeed,
				blurAmount: blurAmount,
				glowIntensity: glowIntensity
			});
		}

		/**
		 * Update UI elements
		 */
		updateUI() {
			const level = this.currentIntensity;
			
			// Update active label
			this.labels.removeClass('active');
			this.labels.filter(`[data-value="${level}"]`).addClass('active');
			
			// Update stat values
			this.updateStats(level);
		}

		/**
		 * Update stat display values
		 * @param {number} level - Intensity level
		 */
		updateStats(level) {
			let animationSpeed, blurAmount, glowIntensity;
			
			switch(level) {
				case 1: // Low
					animationSpeed = '0.5x';
					blurAmount = '70%';
					glowIntensity = '70%';
					break;
				case 3: // High
					animationSpeed = '1.5x';
					blurAmount = '150%';
					glowIntensity = '150%';
					break;
				case 2: // Medium
				default:
					animationSpeed = '1x';
					blurAmount = '100%';
					glowIntensity = '100%';
					break;
			}
			
			// Animate value changes
			if (this.stats.animationSpeed.length) {
				this.animateValue(this.stats.animationSpeed, animationSpeed);
			}
			if (this.stats.blurAmount.length) {
				this.animateValue(this.stats.blurAmount, blurAmount);
			}
			if (this.stats.glowIntensity.length) {
				this.animateValue(this.stats.glowIntensity, glowIntensity);
			}
		}

		/**
		 * Animate value change with fade effect
		 * @param {jQuery} $element - Element to update
		 * @param {string} newValue - New value to display
		 */
		animateValue($element, newValue) {
			$element.fadeOut(150, function() {
				$(this).text(newValue).fadeIn(150);
			});
		}

		/**
		 * Update ARIA attributes for accessibility
		 * @param {number} level - Intensity level
		 */
		updateARIA(level) {
			if (!this.slider.length) {
				return;
			}
			
			const intensityName = this.getIntensityName(level);
			this.slider.attr('aria-valuenow', level);
			this.slider.attr('aria-valuetext', intensityName);
		}

		/**
		 * Get intensity name from level
		 * @param {number} level - Intensity level (1-3)
		 * @returns {string} Intensity name
		 */
		getIntensityName(level) {
			switch(level) {
				case 1:
					return 'low';
				case 3:
					return 'high';
				case 2:
				default:
					return 'medium';
			}
		}

		/**
		 * Load saved intensity from WordPress options
		 */
		loadSavedIntensity() {
			// Check if there's a saved value in the form
			if (this.slider.length) {
				const savedValue = parseInt(this.slider.val(), 10);
				if (savedValue >= 1 && savedValue <= 3) {
					this.currentIntensity = savedValue;
					this.updateCSSProperties(savedValue);
				}
			}
		}

		/**
		 * Save intensity preference to WordPress options
		 * This is called when the main settings form is submitted
		 */
		saveIntensity() {
			// The intensity value is already in the form input
			// It will be saved with the rest of the settings
			console.log('MASE: Intensity level saved:', this.currentIntensity);
		}
	}

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function() {
		// Initialize intensity controller
		window.MASEIntensityController = new MASEIntensityController();
		
		// Log initialization
		if (window.console && window.console.log) {
			console.log('MASE: Intensity Controller initialized');
		}
	});

})(jQuery);
