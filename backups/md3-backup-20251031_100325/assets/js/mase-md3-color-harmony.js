/**
 * Material Design 3 Color Harmony Visualization
 * 
 * Handles:
 * - Color swatch display for primary, secondary, tertiary colors
 * - Container color variant display
 * - Contrast ratio calculations and verification
 * - Real-time updates when colors change
 * - WCAG compliance checking
 * 
 * Requirements: 28.1, 28.2, 28.3, 28.4, 28.5
 * 
 * @package ModernAdminStyler
 * @since 1.2.0
 */

(function($) {
	'use strict';

	/**
	 * Color Harmony Visualization Manager
	 */
	const MaseColorHarmony = {
		
		/**
		 * Initialize color harmony visualization
		 */
		init: function() {
			this.$container = $('.mase-color-harmony');
			
			if (this.$container.length === 0) {
				return;
			}
			
			this.colorInputs = {};
			this.initColorInputs();
			this.renderColorGroups();
			this.bindEvents();
			
			console.log('[MASE Color Harmony] Initialized');
		},
		
		/**
		 * Initialize color input references
		 */
		initColorInputs: function() {
			// Map color roles to input IDs
			const colorMap = {
				primary: 'admin_bar_bg_color',
				secondary: 'menu_bg_color',
				tertiary: 'admin_bar_text_color',
				surface: 'content_bg_color',
				error: '#ba1a1a' // Default error color
			};
			
			// Store references to color inputs
			for (const [role, inputId] of Object.entries(colorMap)) {
				if (inputId.startsWith('#')) {
					// Static color
					this.colorInputs[role] = { value: inputId, isStatic: true };
				} else {
					// Dynamic input
					const $input = $(`#${inputId}`);
					if ($input.length > 0) {
						this.colorInputs[role] = { 
							$element: $input, 
							value: $input.val() || '#6750a4',
							isStatic: false
						};
					}
				}
			}
		},
		
		/**
		 * Render color groups (Requirement 28.1, 28.2)
		 */
		renderColorGroups: function() {
			this.$container.empty();
			
			const colorRoles = ['primary', 'secondary', 'tertiary'];
			
			colorRoles.forEach(role => {
				if (this.colorInputs[role]) {
					const $group = this.createColorGroup(role);
					this.$container.append($group);
				}
			});
		},
		
		/**
		 * Create a color group card (Requirement 28.5)
		 * 
		 * @param {string} role - Color role (primary, secondary, tertiary)
		 * @return {jQuery} Color group element
		 */
		createColorGroup: function(role) {
			const color = this.getColorValue(role);
			const containerColor = this.generateContainerColor(color);
			const onColor = this.getOnColor(color);
			const onContainerColor = this.getOnColor(containerColor);
			
			const $group = $(`
				<div class="mase-color-group" data-role="${role}">
					<div class="mase-color-group-header">
						<h3 class="mase-color-group-title">${this.formatRoleName(role)}</h3>
						<p class="mase-color-group-subtitle">Main color and container variant</p>
					</div>
					<div class="mase-color-swatches">
						${this.createColorSwatch(role, color, onColor, false)}
						${this.createColorSwatch(role + '-container', containerColor, onContainerColor, true)}
					</div>
					${this.createContrastInfo(color, onColor, containerColor, onContainerColor)}
				</div>
			`);
			
			return $group;
		},
		
		/**
		 * Create a color swatch (Requirement 28.1, 28.2)
		 * 
		 * @param {string} role - Color role
		 * @param {string} bgColor - Background color
		 * @param {string} textColor - Text color
		 * @param {boolean} isContainer - Whether this is a container variant
		 * @return {string} Swatch HTML
		 */
		createColorSwatch: function(role, bgColor, textColor, isContainer) {
			const label = isContainer ? 'Container' : 'Main';
			const className = isContainer ? 'mase-color-swatch-container' : '';
			
			return `
				<div class="mase-color-swatch ${className}" data-role="${role}">
					<div class="mase-color-swatch-content" style="background-color: ${bgColor}; color: ${textColor};">
						<div class="mase-color-label">${label}</div>
						<div class="mase-color-value">${bgColor.toUpperCase()}</div>
					</div>
				</div>
			`;
		},
		
		/**
		 * Create contrast information section (Requirement 28.3)
		 * 
		 * @param {string} mainColor - Main color
		 * @param {string} onMainColor - On-main color
		 * @param {string} containerColor - Container color
		 * @param {string} onContainerColor - On-container color
		 * @return {string} Contrast info HTML
		 */
		createContrastInfo: function(mainColor, onMainColor, containerColor, onContainerColor) {
			const mainRatio = this.calculateContrastRatio(mainColor, onMainColor);
			const containerRatio = this.calculateContrastRatio(containerColor, onContainerColor);
			
			const mainStatus = this.getContrastStatus(mainRatio);
			const containerStatus = this.getContrastStatus(containerRatio);
			
			return `
				<div class="mase-contrast-info">
					<div class="mase-contrast-ratio">
						<span class="mase-contrast-ratio-label">Main Contrast:</span>
						<span class="mase-contrast-ratio-value ${mainStatus.class}">${mainRatio.toFixed(2)}:1</span>
					</div>
					<div class="mase-contrast-badge ${mainStatus.class}">
						<span class="dashicons ${mainStatus.icon}"></span>
						${mainStatus.label}
					</div>
					
					<div class="mase-contrast-ratio" style="margin-top: 8px;">
						<span class="mase-contrast-ratio-label">Container Contrast:</span>
						<span class="mase-contrast-ratio-value ${containerStatus.class}">${containerRatio.toFixed(2)}:1</span>
					</div>
					<div class="mase-contrast-badge ${containerStatus.class}">
						<span class="dashicons ${containerStatus.icon}"></span>
						${containerStatus.label}
					</div>
					
					<div class="mase-text-samples">
						<div class="mase-text-sample" style="background-color: ${mainColor}; color: ${onMainColor};">
							<div class="mase-text-sample-label">Sample text on main</div>
							<div class="mase-text-sample-text">The quick brown fox jumps</div>
						</div>
						<div class="mase-text-sample" style="background-color: ${containerColor}; color: ${onContainerColor};">
							<div class="mase-text-sample-label">Sample text on container</div>
							<div class="mase-text-sample-text">The quick brown fox jumps</div>
						</div>
					</div>
				</div>
			`;
		},
		
		/**
		 * Bind event handlers for real-time updates (Requirement 28.4)
		 */
		bindEvents: function() {
			const self = this;
			
			// Listen for color input changes
			Object.keys(this.colorInputs).forEach(role => {
				const input = this.colorInputs[role];
				if (!input.isStatic && input.$element) {
					input.$element.on('change input', function() {
						self.updateColorGroup(role, $(this).val());
					});
				}
			});
			
			// Listen for palette changes
			$(document).on('mase:palette:applied', function(e, data) {
				self.handlePaletteChange(data);
			});
			
			// Listen for template changes
			$(document).on('mase:template:applied', function(e, data) {
				self.handleTemplateChange(data);
			});
		},
		
		/**
		 * Update a color group when color changes (Requirement 28.4)
		 * 
		 * @param {string} role - Color role
		 * @param {string} newColor - New color value
		 */
		updateColorGroup: function(role, newColor) {
			const $group = $(`.mase-color-group[data-role="${role}"]`);
			
			if ($group.length === 0) {
				return;
			}
			
			// Update stored value
			if (this.colorInputs[role]) {
				this.colorInputs[role].value = newColor;
			}
			
			// Add updating class for animation
			$group.find('.mase-color-swatch').addClass('updating');
			$group.find('.mase-contrast-info').addClass('updating');
			
			// Calculate new colors
			const containerColor = this.generateContainerColor(newColor);
			const onColor = this.getOnColor(newColor);
			const onContainerColor = this.getOnColor(containerColor);
			
			// Update main swatch
			const $mainSwatch = $group.find(`.mase-color-swatch[data-role="${role}"]`);
			$mainSwatch.find('.mase-color-swatch-content').css({
				'background-color': newColor,
				'color': onColor
			});
			$mainSwatch.find('.mase-color-value').text(newColor.toUpperCase());
			
			// Update container swatch
			const $containerSwatch = $group.find(`.mase-color-swatch[data-role="${role}-container"]`);
			$containerSwatch.find('.mase-color-swatch-content').css({
				'background-color': containerColor,
				'color': onContainerColor
			});
			$containerSwatch.find('.mase-color-value').text(containerColor.toUpperCase());
			
			// Update contrast info
			this.updateContrastInfo($group, newColor, onColor, containerColor, onContainerColor);
			
			// Remove updating class after animation
			setTimeout(function() {
				$group.find('.mase-color-swatch').removeClass('updating');
				$group.find('.mase-contrast-info').removeClass('updating');
			}, 400);
			
			console.log(`[MASE Color Harmony] Updated ${role} to ${newColor}`);
		},
		
		/**
		 * Update contrast information
		 * 
		 * @param {jQuery} $group - Color group element
		 * @param {string} mainColor - Main color
		 * @param {string} onMainColor - On-main color
		 * @param {string} containerColor - Container color
		 * @param {string} onContainerColor - On-container color
		 */
		updateContrastInfo: function($group, mainColor, onMainColor, containerColor, onContainerColor) {
			const mainRatio = this.calculateContrastRatio(mainColor, onMainColor);
			const containerRatio = this.calculateContrastRatio(containerColor, onContainerColor);
			
			const mainStatus = this.getContrastStatus(mainRatio);
			const containerStatus = this.getContrastStatus(containerRatio);
			
			// Update main contrast
			const $mainRatioValue = $group.find('.mase-contrast-ratio:first .mase-contrast-ratio-value');
			$mainRatioValue
				.text(`${mainRatio.toFixed(2)}:1`)
				.removeClass('pass fail')
				.addClass(mainStatus.class);
			
			const $mainBadge = $group.find('.mase-contrast-badge:first');
			$mainBadge
				.removeClass('wcag-aa wcag-aaa fail')
				.addClass(mainStatus.class)
				.html(`<span class="dashicons ${mainStatus.icon}"></span>${mainStatus.label}`);
			
			// Update container contrast
			const $containerRatioValue = $group.find('.mase-contrast-ratio:last .mase-contrast-ratio-value');
			$containerRatioValue
				.text(`${containerRatio.toFixed(2)}:1`)
				.removeClass('pass fail')
				.addClass(containerStatus.class);
			
			const $containerBadge = $group.find('.mase-contrast-badge:last');
			$containerBadge
				.removeClass('wcag-aa wcag-aaa fail')
				.addClass(containerStatus.class)
				.html(`<span class="dashicons ${containerStatus.icon}"></span>${containerStatus.label}`);
			
			// Update text samples
			const $samples = $group.find('.mase-text-sample');
			$samples.eq(0).css({
				'background-color': mainColor,
				'color': onMainColor
			});
			$samples.eq(1).css({
				'background-color': containerColor,
				'color': onContainerColor
			});
		},
		
		/**
		 * Handle palette change event
		 * 
		 * @param {Object} data - Palette data
		 */
		handlePaletteChange: function(data) {
			// Re-initialize color inputs to get new values
			this.initColorInputs();
			
			// Re-render all color groups
			this.renderColorGroups();
			
			console.log('[MASE Color Harmony] Updated for palette change');
		},
		
		/**
		 * Handle template change event
		 * 
		 * @param {Object} data - Template data
		 */
		handleTemplateChange: function(data) {
			// Re-initialize color inputs to get new values
			this.initColorInputs();
			
			// Re-render all color groups
			this.renderColorGroups();
			
			console.log('[MASE Color Harmony] Updated for template change');
		},
		
		/**
		 * Get color value from input or static value
		 * 
		 * @param {string} role - Color role
		 * @return {string} Color value
		 */
		getColorValue: function(role) {
			const input = this.colorInputs[role];
			if (!input) {
				return '#6750a4'; // Default primary color
			}
			
			if (input.isStatic) {
				return input.value;
			}
			
			return input.$element ? input.$element.val() : input.value;
		},
		
		/**
		 * Generate container color from main color (lighter/darker variant)
		 * 
		 * @param {string} color - Main color
		 * @return {string} Container color
		 */
		generateContainerColor: function(color) {
			const rgb = this.hexToRgb(color);
			if (!rgb) return color;
			
			// Lighten the color for container (add 40% white)
			const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * 0.7));
			const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * 0.7));
			const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * 0.7));
			
			return this.rgbToHex(r, g, b);
		},
		
		/**
		 * Get appropriate on-color (text color) for background
		 * 
		 * @param {string} bgColor - Background color
		 * @return {string} On-color (white or black)
		 */
		getOnColor: function(bgColor) {
			const rgb = this.hexToRgb(bgColor);
			if (!rgb) return '#000000';
			
			// Calculate relative luminance
			const luminance = this.getRelativeLuminance(rgb.r, rgb.g, rgb.b);
			
			// Return white for dark backgrounds, black for light backgrounds
			return luminance > 0.5 ? '#000000' : '#ffffff';
		},
		
		/**
		 * Calculate contrast ratio between two colors (Requirement 28.3)
		 * 
		 * @param {string} color1 - First color
		 * @param {string} color2 - Second color
		 * @return {number} Contrast ratio
		 */
		calculateContrastRatio: function(color1, color2) {
			const rgb1 = this.hexToRgb(color1);
			const rgb2 = this.hexToRgb(color2);
			
			if (!rgb1 || !rgb2) return 1;
			
			const l1 = this.getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
			const l2 = this.getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
			
			const lighter = Math.max(l1, l2);
			const darker = Math.min(l1, l2);
			
			return (lighter + 0.05) / (darker + 0.05);
		},
		
		/**
		 * Get contrast status based on ratio
		 * 
		 * @param {number} ratio - Contrast ratio
		 * @return {Object} Status object with class, label, and icon
		 */
		getContrastStatus: function(ratio) {
			if (ratio >= 7) {
				return {
					class: 'wcag-aaa',
					label: 'WCAG AAA',
					icon: 'dashicons-yes-alt'
				};
			} else if (ratio >= 4.5) {
				return {
					class: 'wcag-aa',
					label: 'WCAG AA',
					icon: 'dashicons-yes'
				};
			} else {
				return {
					class: 'fail',
					label: 'Below WCAG',
					icon: 'dashicons-warning'
				};
			}
		},
		
		/**
		 * Calculate relative luminance
		 * 
		 * @param {number} r - Red value (0-255)
		 * @param {number} g - Green value (0-255)
		 * @param {number} b - Blue value (0-255)
		 * @return {number} Relative luminance
		 */
		getRelativeLuminance: function(r, g, b) {
			const rsRGB = r / 255;
			const gsRGB = g / 255;
			const bsRGB = b / 255;
			
			const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
			const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
			const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
			
			return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
		},
		
		/**
		 * Convert hex color to RGB
		 * 
		 * @param {string} hex - Hex color
		 * @return {Object|null} RGB object or null
		 */
		hexToRgb: function(hex) {
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		},
		
		/**
		 * Convert RGB to hex color
		 * 
		 * @param {number} r - Red value
		 * @param {number} g - Green value
		 * @param {number} b - Blue value
		 * @return {string} Hex color
		 */
		rgbToHex: function(r, g, b) {
			return '#' + [r, g, b].map(x => {
				const hex = x.toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			}).join('');
		},
		
		/**
		 * Format role name for display
		 * 
		 * @param {string} role - Color role
		 * @return {string} Formatted name
		 */
		formatRoleName: function(role) {
			return role.charAt(0).toUpperCase() + role.slice(1);
		}
	};
	
	/**
	 * Initialize on document ready
	 */
	$(document).ready(function() {
		// Only initialize on MASE settings page
		if ($('.mase-settings-wrap').length > 0) {
			MaseColorHarmony.init();
		}
	});
	
	// Expose to global scope for external access
	window.MaseColorHarmony = MaseColorHarmony;
	
})(jQuery);
