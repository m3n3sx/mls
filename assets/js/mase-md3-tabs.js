/**
 * Material Design 3 Tab Navigation Enhancement
 * 
 * Enhances tab switching with MD3 animations:
 * - Smooth transition when changing tabs
 * - Coordinated active state changes
 * - Content fade transition
 * 
 * Requirements: 6.4, 6.5
 * 
 * @package ModernAdminStyler
 * @since 1.2.0
 */

(function ($) {
	'use strict';

	/**
	 * MD3 Tab Navigation Enhancement
	 */
	const MASE_MD3_Tabs = {
		/**
		 * Initialize MD3 tab enhancements
		 */
		init: function () {
			if (typeof MASE_DEBUG !== 'undefined') {
				MASE_DEBUG.log('MASE MD3 Tabs: Initializing...');
			}

			this.enhanceTabSwitching();
			this.setupAnimationCoordination();

			if (typeof MASE_DEBUG !== 'undefined') {
				MASE_DEBUG.log('MASE MD3 Tabs: Initialized successfully');
			}
		},

		/**
		 * Enhance tab switching with MD3 animations
		 * Requirement 6.4: Add smooth transition when changing tabs
		 */
		enhanceTabSwitching: function () {
			const self = this;

			// Listen for tab switch events
			$(document).on('mase:tabSwitched', function (event, tabId, $tabContent) {
				if (typeof MASE_DEBUG !== 'undefined') {
					MASE_DEBUG.log('MASE MD3 Tabs: Tab switched to:', tabId);
				}

				// Add animation class to trigger fade-in
				self.animateTabContent($tabContent);
			});

			// Enhance click handler for smoother transitions
			$(document).on('click', '.mase-md3-tab', function (e) {
				const $tab = $(this);
				
				// Add pressed state briefly
				$tab.addClass('mase-tab-pressed');
				
				setTimeout(function () {
					$tab.removeClass('mase-tab-pressed');
				}, 150);
			});
		},

		/**
		 * Animate tab content with fade-in effect
		 * Requirement 6.4: Update content with fade transition
		 * 
		 * @param {jQuery} $content - Tab content element
		 */
		animateTabContent: function ($content) {
			if (!$content || !$content.length) {
				return;
			}

			// Ensure content starts hidden
			$content.css({
				opacity: 0,
				transform: 'translateY(8px)'
			});

			// Force reflow
			$content[0].offsetHeight;

			// Trigger fade-in animation
			requestAnimationFrame(function () {
				$content.css({
					opacity: 1,
					transform: 'translateY(0)'
				});
			});
		},

		/**
		 * Setup animation coordination
		 * Requirement 6.4: Coordinate active state changes
		 */
		setupAnimationCoordination: function () {
			// Coordinate tab button and content animations
			$(document).on('click', '.mase-md3-tab', function () {
				const $clickedTab = $(this);
				const $allTabs = $('.mase-md3-tab');

				// Remove active state with animation
				$allTabs.not($clickedTab).each(function () {
					const $tab = $(this);
					if ($tab.hasClass('active')) {
						// Animate out
						$tab.css('transform', 'scale(0.98)');
						
						setTimeout(function () {
							$tab.removeClass('active');
							$tab.css('transform', '');
						}, 100);
					}
				});

				// Add active state with animation (after existing handler runs)
				setTimeout(function () {
					if ($clickedTab.hasClass('active')) {
						$clickedTab.css('transform', 'scale(1.02)');
						
						setTimeout(function () {
							$clickedTab.css('transform', '');
						}, 200);
					}
				}, 50);
			});
		},

		/**
		 * Check if reduced motion is preferred
		 * 
		 * @returns {boolean} True if reduced motion is preferred
		 */
		prefersReducedMotion: function () {
			return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	};

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function () {
		// Wait for main MASE admin to initialize first
		setTimeout(function () {
			MASE_MD3_Tabs.init();
		}, 100);
	});

	// Expose to global scope for debugging
	window.MASE_MD3_Tabs = MASE_MD3_Tabs;

})(jQuery);
