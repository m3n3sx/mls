/**
 * MASE Animation Controls Module
 * 
 * Handles advanced animation controls including:
 * - Animation speed multiplier (Task 15.2)
 * - Animation type toggles (Task 15.3)
 * - Performance mode (Task 15.4)
 * - Reduced motion preference (Task 15.5)
 * 
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function ($) {
	'use strict';

	/**
	 * Animation Controls Module
	 */
	var MASE_AnimationControls = {
		/**
		 * Initialize the module
		 */
		init: function () {
			this.bindEvents();
			this.applySettings();
			this.detectReducedMotion();
		},

		/**
		 * Bind event handlers
		 */
		bindEvents: function () {
			var self = this;

			// Animation speed multiplier slider (Task 15.2)
			$('#effects-animation-speed-multiplier').on('input', function () {
				var value = $(this).val();
				$('#animation-speed-multiplier-value').text(value + 'x');
				self.updateAnimationSpeed(value);
			});

			// Animation type toggles (Task 15.3)
			$('#effects-hover-animations').on('change', function () {
				self.toggleHoverAnimations($(this).is(':checked'));
			});

			$('#effects-transition-animations').on('change', function () {
				self.toggleTransitionAnimations($(this).is(':checked'));
			});

			$('#effects-background-animations').on('change', function () {
				self.toggleBackgroundAnimations($(this).is(':checked'));
			});

			// Performance mode toggle (Task 15.4)
			$('#effects-performance-mode-advanced').on('change', function () {
				self.togglePerformanceMode($(this).is(':checked'));
			});

			// Reduced motion preference toggle (Task 15.5)
			$('#effects-respect-reduced-motion').on('change', function () {
				self.toggleReducedMotionRespect($(this).is(':checked'));
			});
		},

		/**
		 * Apply current settings on page load
		 */
		applySettings: function () {
			// Apply animation speed multiplier
			var speedMultiplier = $('#effects-animation-speed-multiplier').val();
			if (speedMultiplier) {
				this.updateAnimationSpeed(speedMultiplier);
			}

			// Apply animation type toggles
			if (!$('#effects-hover-animations').is(':checked')) {
				this.toggleHoverAnimations(false);
			}
			if (!$('#effects-transition-animations').is(':checked')) {
				this.toggleTransitionAnimations(false);
			}
			if (!$('#effects-background-animations').is(':checked')) {
				this.toggleBackgroundAnimations(false);
			}

			// Apply performance mode
			if ($('#effects-performance-mode-advanced').is(':checked')) {
				this.togglePerformanceMode(true);
			}
		},

		/**
		 * Update animation speed multiplier (Task 15.2)
		 * Requirement 13.1: Create speed multiplier (0.5x - 2x)
		 * 
		 * @param {number} multiplier - Speed multiplier value
		 */
		updateAnimationSpeed: function (multiplier) {
			// Set CSS custom property for animation speed
			document.documentElement.style.setProperty('--mase-animation-speed-multiplier', multiplier);

			// Update all animation durations
			var baseSpeed = 300; // Base animation speed in ms
			var newSpeed = baseSpeed / multiplier;

			document.documentElement.style.setProperty('--mase-animation-duration', newSpeed + 'ms');

			// Log for debugging
			if (typeof MASE_DEBUG !== 'undefined' && MASE_DEBUG.enabled) {
				console.log('[MASE Animation Controls] Speed multiplier set to: ' + multiplier + 'x');
			}
		},

		/**
		 * Toggle hover animations (Task 15.3)
		 * Requirement 13.2: Add toggle for hover animations
		 * 
		 * @param {boolean} enabled - Whether hover animations are enabled
		 */
		toggleHoverAnimations: function (enabled) {
			if (enabled) {
				$('body').removeClass('mase-no-hover-animations');
			} else {
				$('body').addClass('mase-no-hover-animations');
			}

			if (typeof MASE_DEBUG !== 'undefined' && MASE_DEBUG.enabled) {
				console.log('[MASE Animation Controls] Hover animations: ' + (enabled ? 'enabled' : 'disabled'));
			}
		},

		/**
		 * Toggle transition animations (Task 15.3)
		 * Requirement 13.2: Add toggle for transition animations
		 * 
		 * @param {boolean} enabled - Whether transition animations are enabled
		 */
		toggleTransitionAnimations: function (enabled) {
			if (enabled) {
				$('body').removeClass('mase-no-transition-animations');
			} else {
				$('body').addClass('mase-no-transition-animations');
			}

			if (typeof MASE_DEBUG !== 'undefined' && MASE_DEBUG.enabled) {
				console.log('[MASE Animation Controls] Transition animations: ' + (enabled ? 'enabled' : 'disabled'));
			}
		},

		/**
		 * Toggle background animations (Task 15.3)
		 * Requirement 13.2: Add toggle for background animations
		 * 
		 * @param {boolean} enabled - Whether background animations are enabled
		 */
		toggleBackgroundAnimations: function (enabled) {
			if (enabled) {
				$('body').removeClass('mase-no-background-animations');
			} else {
				$('body').addClass('mase-no-background-animations');
			}

			if (typeof MASE_DEBUG !== 'undefined' && MASE_DEBUG.enabled) {
				console.log('[MASE Animation Controls] Background animations: ' + (enabled ? 'enabled' : 'disabled'));
			}
		},

		/**
		 * Toggle performance mode (Task 15.4)
		 * Requirements 13.4, 13.5: Disable expensive effects
		 * 
		 * @param {boolean} enabled - Whether performance mode is enabled
		 */
		togglePerformanceMode: function (enabled) {
			if (enabled) {
				// Add performance mode class
				$('body').addClass('mase-performance-mode');

				// Disable expensive effects
				// - Remove backdrop-filter (Requirement 13.4)
				// - Disable particle systems (Requirement 13.4)
				// - Disable complex animations (Requirement 13.5)
				document.documentElement.style.setProperty('--mase-backdrop-filter', 'none');
				document.documentElement.style.setProperty('--mase-blur-amount', '0px');

				// Hide particle systems
				$('.mase-particle-system, .mase-particles').hide();

				if (typeof MASE_DEBUG !== 'undefined' && MASE_DEBUG.enabled) {
					console.log('[MASE Animation Controls] Performance mode: enabled');
				}
			} else {
				// Remove performance mode class
				$('body').removeClass('mase-performance-mode');

				// Re-enable effects
				document.documentElement.style.setProperty('--mase-backdrop-filter', 'blur(10px)');
				document.documentElement.style.setProperty('--mase-blur-amount', '10px');

				// Show particle systems
				$('.mase-particle-system, .mase-particles').show();

				if (typeof MASE_DEBUG !== 'undefined' && MASE_DEBUG.enabled) {
					console.log('[MASE Animation Controls] Performance mode: disabled');
				}
			}
		},

		/**
		 * Toggle reduced motion preference respect (Task 15.5)
		 * Requirement 13.3: Respect prefers-reduced-motion system preference
		 * 
		 * @param {boolean} enabled - Whether to respect system preference
		 */
		toggleReducedMotionRespect: function (enabled) {
			if (enabled) {
				$('body').addClass('mase-respect-reduced-motion');
				// Re-check system preference
				this.detectReducedMotion();
			} else {
				$('body').removeClass('mase-respect-reduced-motion');
				// Remove reduced motion class if it was applied
				$('body').removeClass('mase-reduced-motion');
			}

			if (typeof MASE_DEBUG !== 'undefined' && MASE_DEBUG.enabled) {
				console.log('[MASE Animation Controls] Respect reduced motion: ' + (enabled ? 'enabled' : 'disabled'));
			}
		},

		/**
		 * Detect system reduced motion preference (Task 15.5)
		 * Requirement 13.3: Detect system preference and disable animations when requested
		 */
		detectReducedMotion: function () {
			// Check if user wants to respect system preference
			var respectPreference = $('#effects-respect-reduced-motion').is(':checked');

			if (!respectPreference) {
				return;
			}

			// Check for prefers-reduced-motion media query
			var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

			if (prefersReducedMotion.matches) {
				// User prefers reduced motion
				$('body').addClass('mase-reduced-motion');

				// Disable all animations
				this.toggleHoverAnimations(false);
				this.toggleTransitionAnimations(false);
				this.toggleBackgroundAnimations(false);

				if (typeof MASE_DEBUG !== 'undefined' && MASE_DEBUG.enabled) {
					console.log('[MASE Animation Controls] System prefers reduced motion - animations disabled');
				}
			} else {
				$('body').removeClass('mase-reduced-motion');
			}

			// Listen for changes to the preference
			var self = this;
			prefersReducedMotion.addEventListener('change', function (e) {
				if (e.matches) {
					$('body').addClass('mase-reduced-motion');
					self.toggleHoverAnimations(false);
					self.toggleTransitionAnimations(false);
					self.toggleBackgroundAnimations(false);

					if (typeof MASE_DEBUG !== 'undefined' && MASE_DEBUG.enabled) {
						console.log('[MASE Animation Controls] System preference changed - reduced motion enabled');
					}
				} else {
					$('body').removeClass('mase-reduced-motion');

					if (typeof MASE_DEBUG !== 'undefined' && MASE_DEBUG.enabled) {
						console.log('[MASE Animation Controls] System preference changed - reduced motion disabled');
					}
				}
			});
		}
	};

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function () {
		MASE_AnimationControls.init();
	});

})(jQuery);
