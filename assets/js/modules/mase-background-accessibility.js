/**
 * MASE Background System Accessibility Module
 * 
 * Provides comprehensive accessibility features for the background system:
 * - ARIA labels and attributes for all interactive elements
 * - Keyboard navigation support
 * - Focus indicators
 * - Screen reader announcements for dynamic changes
 * - WCAG 2.1 AA compliance
 * 
 * Task 45: Add accessibility improvements
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function($) {
	'use strict';

	// Ensure MASE namespace exists
	window.MASE = window.MASE || {};

	/**
	 * Background Accessibility Module
	 */
	MASE.backgroundAccessibility = {

		/**
		 * Announcement region for screen readers
		 */
		$announcer: null,

		/**
		 * Initialize accessibility features
		 */
		init: function() {
			// Create screen reader announcement region
			this.createAnnouncementRegion();

			// Add ARIA labels to all interactive elements
			this.addAriaLabels();

			// Initialize keyboard navigation
			this.initKeyboardNavigation();

			// Add focus indicators
			this.addFocusIndicators();

			// Initialize screen reader announcements
			this.initScreenReaderAnnouncements();

			// Add role attributes
			this.addRoleAttributes();

			// Initialize slider accessibility
			this.initSliderAccessibility();

			// Initialize toggle accessibility
			this.initToggleAccessibility();

			// Initialize accordion accessibility
			this.initAccordionAccessibility();

			// Initialize tab accessibility
			this.initTabAccessibility();

			console.log('MASE: Background accessibility features initialized');
		},

		/**
		 * Create hidden announcement region for screen readers
		 * WCAG 2.1 - 4.1.3 Status Messages (Level AA)
		 */
		createAnnouncementRegion: function() {
			if ($('#mase-sr-announcer').length === 0) {
				this.$announcer = $('<div>', {
					id: 'mase-sr-announcer',
					role: 'status',
					'aria-live': 'polite',
					'aria-atomic': 'true',
					class: 'screen-reader-text'
				}).appendTo('body');
			} else {
				this.$announcer = $('#mase-sr-announcer');
			}
		},

		/**
		 * Announce message to screen readers
		 * 
		 * @param {string} message - Message to announce
		 * @param {string} priority - 'polite' or 'assertive' (default: 'polite')
		 */
		announce: function(message, priority) {
			if (!this.$announcer) {
				this.createAnnouncementRegion();
			}

			priority = priority || 'polite';
			this.$announcer.attr('aria-live', priority);

			// Clear previous message
			this.$announcer.text('');

			// Announce new message after brief delay (allows screen reader to detect change)
			setTimeout(() => {
				this.$announcer.text(message);
			}, 100);

			// Clear message after 5 seconds
			setTimeout(() => {
				this.$announcer.text('');
			}, 5000);
		},

		/**
		 * Add ARIA labels to interactive elements
		 * WCAG 2.1 - 4.1.2 Name, Role, Value (Level A)
		 */
		addAriaLabels: function() {
			// Background type selectors
			$('.mase-background-type-selector').each(function() {
				const $select = $(this);
				if (!$select.attr('aria-label') && !$select.attr('aria-labelledby')) {
					const area = $select.data('area');
					const areaLabel = $select.closest('.mase-background-area-section')
						.find('.mase-background-area-title h3').text().trim();
					$select.attr('aria-label', `Background type for ${areaLabel}`);
				}
			});

			// Upload zones
			$('.mase-background-upload-zone').each(function() {
				const $zone = $(this);
				if (!$zone.attr('aria-label')) {
					$zone.attr('aria-label', 'Upload or select background image. Click to open media library or drag and drop an image file.');
				}
				if (!$zone.attr('tabindex')) {
					$zone.attr('tabindex', '0');
				}
			});

			// Change/Remove image buttons
			$('.mase-change-image-btn').each(function() {
				if (!$(this).attr('aria-label')) {
					$(this).attr('aria-label', 'Change background image');
				}
			});

			$('.mase-remove-image-btn').each(function() {
				if (!$(this).attr('aria-label')) {
					$(this).attr('aria-label', 'Remove background image');
				}
			});

			// Position picker grid cells
			$('.mase-position-grid-cell').each(function() {
				const $cell = $(this);
				if (!$cell.attr('aria-label')) {
					const position = $cell.data('position');
					const label = MASE.backgroundAccessibility.getPositionLabel(position);
					$cell.attr('aria-label', label);
				}
				if (!$cell.attr('role')) {
					$cell.attr('role', 'button');
				}
			});

			// Gradient angle dial
			$('.mase-gradient-angle-dial').each(function() {
				if (!$(this).attr('aria-label')) {
					$(this).attr('aria-label', 'Gradient angle visual indicator. Use the numeric input to change the angle.');
				}
				if (!$(this).attr('role')) {
					$(this).attr('role', 'img');
				}
			});

			// Add/Remove color stop buttons
			$('.mase-add-color-stop').each(function() {
				if (!$(this).attr('aria-label')) {
					$(this).attr('aria-label', 'Add color stop to gradient');
				}
			});

			$('.mase-remove-color-stop').each(function() {
				const $btn = $(this);
				if (!$btn.attr('aria-label')) {
					const index = $btn.closest('.mase-color-stop').data('index');
					$btn.attr('aria-label', `Remove color stop ${index + 1}`);
				}
			});

			// Pattern items
			$('.mase-pattern-item').each(function() {
				const $item = $(this);
				if (!$item.attr('role')) {
					$item.attr('role', 'button');
				}
				if (!$item.attr('tabindex')) {
					$item.attr('tabindex', '0');
				}
				if (!$item.attr('aria-label')) {
					const patternName = $item.find('.mase-pattern-name').text().trim();
					$item.attr('aria-label', `Select ${patternName} pattern`);
				}
			});

			// Gradient preset items
			$('.mase-gradient-preset-item').each(function() {
				const $item = $(this);
				if (!$item.attr('role')) {
					$item.attr('role', 'button');
				}
				if (!$item.attr('tabindex')) {
					$item.attr('tabindex', '0');
				}
			});

			// Device preview buttons
			$('.mase-device-preview-btn').each(function() {
				const $btn = $(this);
				if (!$btn.attr('role')) {
					$btn.attr('role', 'button');
				}
			});
		},

		/**
		 * Get human-readable label for position value
		 * 
		 * @param {string} position - Position value (e.g., "center center")
		 * @return {string} Human-readable label
		 */
		getPositionLabel: function(position) {
			const labels = {
				'left top': 'Top Left',
				'center top': 'Top Center',
				'right top': 'Top Right',
				'left center': 'Center Left',
				'center center': 'Center',
				'right center': 'Center Right',
				'left bottom': 'Bottom Left',
				'center bottom': 'Bottom Center',
				'right bottom': 'Bottom Right'
			};
			return labels[position] || position;
		},

		/**
		 * Initialize keyboard navigation
		 * WCAG 2.1 - 2.1.1 Keyboard (Level A)
		 */
		initKeyboardNavigation: function() {
			const self = this;

			// Upload zone keyboard activation
			$('.mase-background-upload-zone').on('keydown', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					$(this).click();
				}
			});

			// Position picker grid keyboard navigation
			$('.mase-position-grid-cell').on('keydown', function(e) {
				const $cell = $(this);
				const $grid = $cell.parent();
				const $cells = $grid.find('.mase-position-grid-cell');
				const currentIndex = $cells.index($cell);

				let newIndex = currentIndex;

				switch(e.key) {
					case 'Enter':
					case ' ':
						e.preventDefault();
						$cell.click();
						self.announce(`Position set to ${$cell.attr('aria-label')}`);
						break;

					case 'ArrowRight':
						e.preventDefault();
						newIndex = (currentIndex + 1) % $cells.length;
						break;

					case 'ArrowLeft':
						e.preventDefault();
						newIndex = (currentIndex - 1 + $cells.length) % $cells.length;
						break;

					case 'ArrowDown':
						e.preventDefault();
						newIndex = (currentIndex + 3) % $cells.length;
						break;

					case 'ArrowUp':
						e.preventDefault();
						newIndex = (currentIndex - 3 + $cells.length) % $cells.length;
						break;

					case 'Home':
						e.preventDefault();
						newIndex = 0;
						break;

					case 'End':
						e.preventDefault();
						newIndex = $cells.length - 1;
						break;
				}

				if (newIndex !== currentIndex) {
					$cells.eq(newIndex).focus();
				}
			});

			// Pattern library keyboard navigation
			$('.mase-pattern-item').on('keydown', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					$(this).click();
					const patternName = $(this).find('.mase-pattern-name').text().trim();
					self.announce(`${patternName} pattern selected`);
				}
			});

			// Gradient preset keyboard navigation
			$('.mase-gradient-preset-item').on('keydown', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					$(this).click();
					const presetName = $(this).find('.mase-gradient-preset-name').text().trim();
					self.announce(`${presetName} gradient preset applied`);
				}
			});

			// Accordion keyboard navigation
			$('.mase-background-area-toggle').on('keydown', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					$(this).click();
				}
			});

			// Tab keyboard navigation
			$('.mase-breakpoint-tab').on('keydown', function(e) {
				const $tab = $(this);
				const $tabs = $tab.parent().find('.mase-breakpoint-tab');
				const currentIndex = $tabs.index($tab);

				let newIndex = currentIndex;

				switch(e.key) {
					case 'ArrowRight':
						e.preventDefault();
						newIndex = (currentIndex + 1) % $tabs.length;
						break;

					case 'ArrowLeft':
						e.preventDefault();
						newIndex = (currentIndex - 1 + $tabs.length) % $tabs.length;
						break;

					case 'Home':
						e.preventDefault();
						newIndex = 0;
						break;

					case 'End':
						e.preventDefault();
						newIndex = $tabs.length - 1;
						break;
				}

				if (newIndex !== currentIndex) {
					$tabs.eq(newIndex).click().focus();
				}
			});
		},

		/**
		 * Add focus indicators
		 * WCAG 2.1 - 2.4.7 Focus Visible (Level AA)
		 */
		addFocusIndicators: function() {
			// Add focus class to interactive elements
			const focusableSelectors = [
				'.mase-background-upload-zone',
				'.mase-position-grid-cell',
				'.mase-pattern-item',
				'.mase-gradient-preset-item',
				'.mase-background-area-toggle',
				'.mase-breakpoint-tab',
				'.mase-device-preview-btn'
			].join(', ');

			$(focusableSelectors).on('focus', function() {
				$(this).addClass('mase-has-focus');
			}).on('blur', function() {
				$(this).removeClass('mase-has-focus');
			});
		},

		/**
		 * Initialize screen reader announcements for dynamic changes
		 * WCAG 2.1 - 4.1.3 Status Messages (Level AA)
		 */
		initScreenReaderAnnouncements: function() {
			const self = this;

			// Background type change
			$(document).on('change', '.mase-background-type-selector', function() {
				const type = $(this).val();
				const typeLabels = {
					'none': 'None - Background disabled',
					'image': 'Image upload',
					'gradient': 'Gradient',
					'pattern': 'SVG Pattern'
				};
				self.announce(`Background type changed to ${typeLabels[type] || type}`);
			});

			// Background enable/disable toggle
			$(document).on('change', '.mase-background-enable-toggle', function() {
				const enabled = $(this).is(':checked');
				const areaLabel = $(this).closest('.mase-background-area-section')
					.find('.mase-background-area-title h3').text().trim();
				self.announce(`Background for ${areaLabel} ${enabled ? 'enabled' : 'disabled'}`);
			});

			// Image upload success
			$(document).on('mase:backgroundImageUploaded', function(e, data) {
				self.announce('Background image uploaded successfully');
			});

			// Image removal
			$(document).on('mase:backgroundImageRemoved', function(e, data) {
				self.announce('Background image removed');
			});

			// Gradient type change
			$(document).on('change', '.mase-gradient-type', function() {
				const type = $(this).val();
				self.announce(`Gradient type changed to ${type}`);
			});

			// Color stop added
			$(document).on('mase:colorStopAdded', function(e, data) {
				self.announce(`Color stop ${data.index + 1} added`);
			});

			// Color stop removed
			$(document).on('mase:colorStopRemoved', function(e, data) {
				self.announce(`Color stop removed`);
			});

			// Pattern selected
			$(document).on('mase:patternSelected', function(e, patternId, patternData) {
				self.announce(`${patternData.name} pattern selected`);
			});

			// Responsive toggle
			$(document).on('change', '.mase-responsive-toggle', function() {
				const enabled = $(this).is(':checked');
				self.announce(`Responsive variations ${enabled ? 'enabled' : 'disabled'}`);
			});

			// Breakpoint tab change
			$(document).on('mase:breakpointChanged', function(e, breakpoint) {
				const labels = {
					'desktop': 'Desktop (1024 pixels and above)',
					'tablet': 'Tablet (768 to 1023 pixels)',
					'mobile': 'Mobile (below 768 pixels)'
				};
				self.announce(`Switched to ${labels[breakpoint] || breakpoint} settings`);
			});

			// Device preview change
			$(document).on('mase:devicePreviewChanged', function(e, device) {
				const labels = {
					'desktop': 'Desktop',
					'tablet': 'Tablet',
					'mobile': 'Mobile'
				};
				self.announce(`Preview changed to ${labels[device] || device} view`);
			});
		},

		/**
		 * Add role attributes to elements
		 * WCAG 2.1 - 4.1.2 Name, Role, Value (Level A)
		 */
		addRoleAttributes: function() {
			// Upload zones
			$('.mase-background-upload-zone').each(function() {
				if (!$(this).attr('role')) {
					$(this).attr('role', 'button');
				}
			});

			// Error messages
			$('.mase-upload-error').each(function() {
				if (!$(this).attr('role')) {
					$(this).attr('role', 'alert');
				}
				if (!$(this).attr('aria-live')) {
					$(this).attr('aria-live', 'assertive');
				}
			});

			// Preview containers
			$('.mase-gradient-preview, .mase-pattern-customization-preview').each(function() {
				if (!$(this).attr('role')) {
					$(this).attr('role', 'img');
				}
				if (!$(this).attr('aria-label')) {
					$(this).attr('aria-label', 'Live preview');
				}
			});

			// Breakpoint indicator
			$('.mase-breakpoint-indicator').each(function() {
				if (!$(this).attr('role')) {
					$(this).attr('role', 'status');
				}
				if (!$(this).attr('aria-live')) {
					$(this).attr('aria-live', 'polite');
				}
			});
		},

		/**
		 * Initialize slider accessibility
		 * WCAG 2.1 - 4.1.2 Name, Role, Value (Level A)
		 */
		initSliderAccessibility: function() {
			// Opacity sliders
			$('.mase-background-opacity-slider, .mase-pattern-opacity-slider').each(function() {
				const $slider = $(this);
				
				// Add ARIA attributes if not present
				if (!$slider.attr('aria-valuemin')) {
					$slider.attr('aria-valuemin', '0');
				}
				if (!$slider.attr('aria-valuemax')) {
					$slider.attr('aria-valuemax', '100');
				}
				if (!$slider.attr('aria-valuenow')) {
					$slider.attr('aria-valuenow', $slider.val());
				}
				if (!$slider.attr('aria-valuetext')) {
					$slider.attr('aria-valuetext', $slider.val() + '%');
				}

				// Update ARIA attributes on change
				$slider.on('input change', function() {
					const value = $(this).val();
					$(this).attr('aria-valuenow', value);
					$(this).attr('aria-valuetext', value + '%');
				});
			});

			// Scale sliders
			$('.mase-pattern-scale-slider').each(function() {
				const $slider = $(this);
				
				if (!$slider.attr('aria-valuemin')) {
					$slider.attr('aria-valuemin', '50');
				}
				if (!$slider.attr('aria-valuemax')) {
					$slider.attr('aria-valuemax', '200');
				}
				if (!$slider.attr('aria-valuenow')) {
					$slider.attr('aria-valuenow', $slider.val());
				}
				if (!$slider.attr('aria-valuetext')) {
					$slider.attr('aria-valuetext', $slider.val() + '%');
				}

				$slider.on('input change', function() {
					const value = $(this).val();
					$(this).attr('aria-valuenow', value);
					$(this).attr('aria-valuetext', value + '%');
				});
			});

			// Gradient angle input
			$('.mase-gradient-angle-input').each(function() {
				const $input = $(this);
				
				if (!$input.attr('aria-valuemin')) {
					$input.attr('aria-valuemin', '0');
				}
				if (!$input.attr('aria-valuemax')) {
					$input.attr('aria-valuemax', '360');
				}
				if (!$input.attr('aria-valuenow')) {
					$input.attr('aria-valuenow', $input.val());
				}
				if (!$input.attr('aria-valuetext')) {
					$input.attr('aria-valuetext', $input.val() + ' degrees');
				}

				$input.on('input change', function() {
					const value = $(this).val();
					$(this).attr('aria-valuenow', value);
					$(this).attr('aria-valuetext', value + ' degrees');
				});
			});
		},

		/**
		 * Initialize toggle accessibility
		 * WCAG 2.1 - 4.1.2 Name, Role, Value (Level A)
		 */
		initToggleAccessibility: function() {
			// Background enable toggles
			$('.mase-background-enable-toggle').each(function() {
				const $toggle = $(this);
				
				if (!$toggle.attr('role')) {
					$toggle.attr('role', 'switch');
				}
				if (!$toggle.attr('aria-checked')) {
					$toggle.attr('aria-checked', $toggle.is(':checked') ? 'true' : 'false');
				}

				// Update aria-checked on change
				$toggle.on('change', function() {
					$(this).attr('aria-checked', $(this).is(':checked') ? 'true' : 'false');
				});
			});

			// Responsive toggles
			$('.mase-responsive-toggle').each(function() {
				const $toggle = $(this);
				
				if (!$toggle.attr('role')) {
					$toggle.attr('role', 'switch');
				}
				if (!$toggle.attr('aria-checked')) {
					$toggle.attr('aria-checked', $toggle.is(':checked') ? 'true' : 'false');
				}

				$toggle.on('change', function() {
					$(this).attr('aria-checked', $(this).is(':checked') ? 'true' : 'false');
				});
			});
		},

		/**
		 * Initialize accordion accessibility
		 * WCAG 2.1 - 4.1.2 Name, Role, Value (Level A)
		 */
		initAccordionAccessibility: function() {
			$('.mase-background-area-toggle').each(function() {
				const $toggle = $(this);
				const $content = $toggle.closest('.mase-background-area-section')
					.find('.mase-background-area-content');

				// Add ARIA attributes
				if (!$toggle.attr('aria-expanded')) {
					$toggle.attr('aria-expanded', 'false');
				}
				if (!$toggle.attr('aria-controls')) {
					const contentId = $content.attr('id');
					if (contentId) {
						$toggle.attr('aria-controls', contentId);
					}
				}

				// Update aria-expanded on click
				$toggle.on('click', function() {
					const isExpanded = $content.is(':visible');
					$(this).attr('aria-expanded', isExpanded ? 'true' : 'false');
				});
			});
		},

		/**
		 * Initialize tab accessibility
		 * WCAG 2.1 - 4.1.2 Name, Role, Value (Level A)
		 */
		initTabAccessibility: function() {
			// Breakpoint tabs
			$('.mase-breakpoint-tab').each(function() {
				const $tab = $(this);
				
				if (!$tab.attr('role')) {
					$tab.attr('role', 'tab');
				}
				if (!$tab.attr('aria-selected')) {
					$tab.attr('aria-selected', $tab.hasClass('active') ? 'true' : 'false');
				}

				// Update aria-selected on click
				$tab.on('click', function() {
					const $tabs = $(this).parent().find('.mase-breakpoint-tab');
					$tabs.attr('aria-selected', 'false');
					$(this).attr('aria-selected', 'true');

					// Trigger event for screen reader announcement
					const breakpoint = $(this).data('breakpoint');
					$(document).trigger('mase:breakpointChanged', [breakpoint]);
				});
			});

			// Device preview buttons
			$('.mase-device-preview-btn').each(function() {
				const $btn = $(this);
				
				if (!$btn.attr('aria-pressed')) {
					$btn.attr('aria-pressed', $btn.hasClass('active') ? 'true' : 'false');
				}

				// Update aria-pressed on click
				$btn.on('click', function() {
					const $buttons = $(this).parent().find('.mase-device-preview-btn');
					$buttons.attr('aria-pressed', 'false');
					$(this).attr('aria-pressed', 'true');

					// Trigger event for screen reader announcement
					const device = $(this).data('device');
					$(document).trigger('mase:devicePreviewChanged', [device]);
				});
			});
		},

		/**
		 * Refresh accessibility features (call after dynamic content changes)
		 */
		refresh: function() {
			this.addAriaLabels();
			this.initKeyboardNavigation();
			this.addFocusIndicators();
			this.addRoleAttributes();
			this.initSliderAccessibility();
			this.initToggleAccessibility();
		}
	};

	// Initialize on document ready
	$(document).ready(function() {
		MASE.backgroundAccessibility.init();
	});

	// Refresh after dynamic content loads
	$(document).on('mase:backgroundControlsLoaded', function() {
		MASE.backgroundAccessibility.refresh();
	});

})(jQuery);
