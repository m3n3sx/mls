/**
 * Theme Customization Panel
 * 
 * Provides interactive UI for customizing theme colors, effects, and spacing.
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

/* eslint-disable deprecation/deprecation */
(function($) {
	'use strict';

	/**
	 * Theme Customizer Class
	 */
	class MASEThemeCustomizer {
		constructor() {
			this.panel = null;
			this.backdrop = null;
			this.currentTemplate = null;
			this.originalSettings = {};
			this.currentSettings = {};
			this.previewElements = {};
			
			this.init();
		}

		/**
		 * Initialize customizer
		 */
		init() {
			this.createPanel();
			this.attachEvents();
			this.loadSettings();
		}

		/**
		 * Create customization panel HTML
		 */
		createPanel() {
			// Create backdrop
			this.backdrop = $('<div>', {
				class: 'mase-customizer-backdrop',
				'aria-hidden': 'true'
			});

			// Create panel
			this.panel = $('<div>', {
				class: 'mase-customizer-panel',
				role: 'dialog',
				'aria-labelledby': 'mase-customizer-title',
				'aria-modal': 'true'
			});

			// Build panel structure
			const panelHTML = `
				<div class="mase-customizer-header">
					<div class="mase-customizer-title" id="mase-customizer-title">
						<span>${maseCustomizerL10n.panelTitle}</span>
						<button type="button" class="mase-customizer-close" aria-label="${maseCustomizerL10n.closePanel}">
							<span class="dashicons dashicons-no-alt"></span>
						</button>
					</div>
					<p class="mase-customizer-subtitle">${maseCustomizerL10n.panelSubtitle}</p>
				</div>

				<div class="mase-customizer-content">
					<!-- Live Preview -->
					<div class="mase-customizer-preview">
						<div class="mase-customizer-preview-header">${maseCustomizerL10n.livePreview}</div>
						<div class="mase-customizer-preview-content" id="mase-customizer-preview-content">
							<div class="mase-customizer-preview-element" data-preview="primary">
								${maseCustomizerL10n.previewPrimary}
							</div>
							<div class="mase-customizer-preview-element" data-preview="secondary">
								${maseCustomizerL10n.previewSecondary}
							</div>
							<button class="mase-customizer-preview-button" data-preview="button">
								${maseCustomizerL10n.previewButton}
							</button>
							<p class="mase-customizer-preview-text">${maseCustomizerL10n.previewText}</p>
						</div>
					</div>

					<!-- Color Controls -->
					<div class="mase-customizer-group">
						<h3 class="mase-customizer-group-title">${maseCustomizerL10n.colorsTitle}</h3>
						<p class="mase-customizer-group-description">${maseCustomizerL10n.colorsDescription}</p>

						<div class="mase-customizer-control">
							<label class="mase-customizer-control-label" for="mase-custom-primary-color">
								${maseCustomizerL10n.primaryColor}
							</label>
							<div class="mase-customizer-color-input">
								<div class="mase-customizer-color-preview" data-color-target="primary" style="background-color: #0073aa;"></div>
								<input 
									type="text" 
									id="mase-custom-primary-color"
									class="mase-customizer-color-value"
									data-color-property="primary"
									data-default-color="#0073aa"
									value="#0073aa"
									placeholder="#0073aa"
								/>
							</div>
						</div>

						<div class="mase-customizer-control">
							<label class="mase-customizer-control-label" for="mase-custom-secondary-color">
								${maseCustomizerL10n.secondaryColor}
							</label>
							<div class="mase-customizer-color-input">
								<div class="mase-customizer-color-preview" data-color-target="secondary" style="background-color: #23282d;"></div>
								<input 
									type="text" 
									id="mase-custom-secondary-color"
									class="mase-customizer-color-value"
									data-color-property="secondary"
									data-default-color="#23282d"
									value="#23282d"
									placeholder="#23282d"
								/>
							</div>
						</div>

						<div class="mase-customizer-control">
							<label class="mase-customizer-control-label" for="mase-custom-accent-color">
								${maseCustomizerL10n.accentColor}
							</label>
							<div class="mase-customizer-color-input">
								<div class="mase-customizer-color-preview" data-color-target="accent" style="background-color: #00a0d2;"></div>
								<input 
									type="text" 
									id="mase-custom-accent-color"
									class="mase-customizer-color-value"
									data-color-property="accent"
									data-default-color="#00a0d2"
									value="#00a0d2"
									placeholder="#00a0d2"
								/>
							</div>
						</div>
					</div>

					<!-- Effect Controls -->
					<div class="mase-customizer-group">
						<h3 class="mase-customizer-group-title">${maseCustomizerL10n.effectsTitle}</h3>
						<p class="mase-customizer-group-description">${maseCustomizerL10n.effectsDescription}</p>

						<div class="mase-customizer-control">
							<div class="mase-customizer-slider">
								<div class="mase-customizer-slider-header">
									<label class="mase-customizer-control-label" for="mase-custom-blur-intensity">
										${maseCustomizerL10n.blurIntensity}
									</label>
									<span class="mase-customizer-slider-value" data-slider-value="blur">10px</span>
								</div>
								<input 
									type="range" 
									id="mase-custom-blur-intensity"
									class="mase-customizer-range"
									data-effect-property="blur"
									min="0"
									max="30"
									step="1"
									value="10"
								/>
								<div class="mase-customizer-slider-labels">
									<span>0px</span>
									<span>30px</span>
								</div>
							</div>
						</div>

						<div class="mase-customizer-control">
							<div class="mase-customizer-slider">
								<div class="mase-customizer-slider-header">
									<label class="mase-customizer-control-label" for="mase-custom-shadow-depth">
										${maseCustomizerL10n.shadowDepth}
									</label>
									<span class="mase-customizer-slider-value" data-slider-value="shadow">5px</span>
								</div>
								<input 
									type="range" 
									id="mase-custom-shadow-depth"
									class="mase-customizer-range"
									data-effect-property="shadow"
									min="0"
									max="20"
									step="1"
									value="5"
								/>
								<div class="mase-customizer-slider-labels">
									<span>0px</span>
									<span>20px</span>
								</div>
							</div>
						</div>

						<div class="mase-customizer-control">
							<div class="mase-customizer-slider">
								<div class="mase-customizer-slider-header">
									<label class="mase-customizer-control-label" for="mase-custom-border-radius">
										${maseCustomizerL10n.borderRadius}
									</label>
									<span class="mase-customizer-slider-value" data-slider-value="radius">8px</span>
								</div>
								<input 
									type="range" 
									id="mase-custom-border-radius"
									class="mase-customizer-range"
									data-effect-property="radius"
									min="0"
									max="24"
									step="1"
									value="8"
								/>
								<div class="mase-customizer-slider-labels">
									<span>0px</span>
									<span>24px</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="mase-customizer-footer">
					<button type="button" class="button mase-customizer-reset">
						<span class="dashicons dashicons-image-rotate"></span>
						${maseCustomizerL10n.resetButton}
					</button>
					<button type="button" class="button mase-customizer-export">
						<span class="dashicons dashicons-download"></span>
						${maseCustomizerL10n.exportButton}
					</button>
					<button type="button" class="button mase-customizer-import">
						<span class="dashicons dashicons-upload"></span>
						${maseCustomizerL10n.importButton}
					</button>
					<input type="file" id="mase-customizer-import-file" accept=".json" style="display: none;" />
					<button type="button" class="button button-primary mase-customizer-save">
						<span class="dashicons dashicons-saved"></span>
						${maseCustomizerL10n.saveButton}
					</button>
				</div>
			`;

			this.panel.html(panelHTML);

			// Append to body
			$('body').append(this.backdrop).append(this.panel);

			// Cache preview elements
			this.previewElements = {
				primary: this.panel.find('[data-preview="primary"]'),
				secondary: this.panel.find('[data-preview="secondary"]'),
				button: this.panel.find('[data-preview="button"]')
			};
		}

		/**
		 * Attach event listeners
		 */
		attachEvents() {
			const self = this;

			// Close panel
			this.panel.on('click', '.mase-customizer-close', function() {
				self.closePanel();
			});

			// Close on backdrop click
			this.backdrop.on('click', function() {
				self.closePanel();
			});

			// Close on ESC key
			$(document).on('keydown', function(e) {
				if (e.key === 'Escape' && self.panel.hasClass('active')) {
					self.closePanel();
				}
			});

			// Color preview click - trigger WordPress color picker
			this.panel.on('click', '.mase-customizer-color-preview', function() {
				const target = $(this).data('color-target');
				const input = self.panel.find(`[data-color-property="${target}"]`);
				
				// Trigger WordPress color picker
				if (input.length && input.hasClass('wp-color-picker')) {
					input.wpColorPicker('open');
				}
			});

			// Slider change
			this.panel.on('input change', '.mase-customizer-range', function() {
				const property = $(this).data('effect-property');
				const value = $(this).val();
				const unit = property === 'blur' || property === 'shadow' || property === 'radius' ? 'px' : '';
				
				// Update value display
				self.panel.find(`[data-slider-value="${property}"]`).text(value + unit);
				
				// Update live preview
				self.updateLivePreview();
				
				// Store setting
				self.currentSettings.effects = self.currentSettings.effects || {};
				self.currentSettings.effects[property] = value;
			});

			// Reset button
			this.panel.on('click', '.mase-customizer-reset', function() {
				if (confirm(maseCustomizerL10n.confirmReset)) {
					self.resetToDefaults();
				}
			});

			// Export button (Task 14.1: Theme Export)
			this.panel.on('click', '.mase-customizer-export', function() {
				self.exportTheme();
			});

			// Import button (Task 14.2: Theme Import)
			this.panel.on('click', '.mase-customizer-import', function() {
				$('#mase-customizer-import-file').click();
			});

			// File input change (Task 14.2: Theme Import)
			this.panel.on('change', '#mase-customizer-import-file', function(e) {
				const file = e.target.files[0];
				if (file) {
					self.importTheme(file);
				}
				// Reset file input
				$(this).val('');
			});

			// Save button
			this.panel.on('click', '.mase-customizer-save', function() {
				self.saveCustomizations();
			});

			// Customize button on template cards
			$(document).on('click', '.mase-template-customize-btn', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				const templateId = $(this).data('template-id');
				self.openPanel(templateId);
			});
		}

		/**
		 * Initialize WordPress Color Pickers
		 * Requirement 14.2: Integrate color picker library
		 */
		initializeColorPickers() {
			const self = this;
			
			// Find all color inputs in the panel
			this.panel.find('.mase-customizer-color-value').each(function() {
				const $input = $(this);
				const property = $input.data('color-property');
				
				// Skip if already initialized
				if ($input.hasClass('wp-color-picker')) {
					return;
				}
				
				// Initialize WordPress Color Picker
				$input.wpColorPicker({
					change: function(_event, ui) {
						const color = ui.color.toString();
						
						// Update preview swatch
						self.updateColorPreview(property, color);
						
						// Update live preview
						self.updateLivePreview();
						
						// Store in current settings
						self.currentSettings.colors = self.currentSettings.colors || {};
						self.currentSettings.colors[property] = color;
					},
					clear: function() {
						// Reset to default color
						const defaultColor = $input.data('default-color') || '#0073aa';
						$input.val(defaultColor).trigger('change');
					},
					palettes: [
						'#0073aa', '#00a0d2', '#0085ba', '#005a87',
						'#23282d', '#32373c', '#464b50', '#5b6166',
						'#00ff41', '#ff0080', '#8000ff', '#ffb000'
					]
				});
			});
		}

		/**
		 * Open customization panel
		 */
		openPanel(templateId) {
			this.currentTemplate = templateId;
			this.loadTemplateSettings(templateId);
			
			// Initialize color pickers
			this.initializeColorPickers();
			
			// Show panel and backdrop
			this.backdrop.addClass('active');
			this.panel.addClass('active');
			
			// Focus first input
			setTimeout(() => {
				this.panel.find('input').first().focus();
			}, 400);
			
			// Announce to screen readers
			this.announceToScreenReader(maseCustomizerL10n.panelOpened);
		}

		/**
		 * Close customization panel
		 */
		closePanel() {
			this.backdrop.removeClass('active');
			this.panel.removeClass('active');
			
			// Announce to screen readers
			this.announceToScreenReader(maseCustomizerL10n.panelClosed);
		}

		/**
		 * Load template settings
		 */
		loadTemplateSettings(templateId) {
			// Store template ID for reference
			this.currentTemplate = templateId;
			
			// In a real implementation, this would load from WordPress options
			// For now, use defaults
			const defaults = {
				colors: {
					primary: '#0073aa',
					secondary: '#23282d',
					accent: '#00a0d2'
				},
				effects: {
					blur: 10,
					shadow: 5,
					radius: 8
				}
			};

			this.originalSettings = $.extend(true, {}, defaults);
			this.currentSettings = $.extend(true, {}, defaults);

			// Update UI
			this.updateUIFromSettings();
		}

		/**
		 * Update UI from current settings
		 */
		updateUIFromSettings() {
			// Update color inputs
			Object.keys(this.currentSettings.colors || {}).forEach(property => {
				const value = this.currentSettings.colors[property];
				const $input = this.panel.find(`[data-color-property="${property}"]`);
				
				// Update WordPress Color Picker if initialized
				if ($input.hasClass('wp-color-picker')) {
					$input.wpColorPicker('color', value);
				} else {
					$input.val(value);
				}
				
				this.updateColorPreview(property, value);
			});

			// Update sliders
			Object.keys(this.currentSettings.effects || {}).forEach(property => {
				const value = this.currentSettings.effects[property];
				const slider = this.panel.find(`[data-effect-property="${property}"]`);
				slider.val(value);
				
				const unit = property === 'blur' || property === 'shadow' || property === 'radius' ? 'px' : '';
				this.panel.find(`[data-slider-value="${property}"]`).text(value + unit);
			});

			// Update live preview
			this.updateLivePreview();
		}

		/**
		 * Update color preview swatch
		 */
		updateColorPreview(property, color) {
			this.panel.find(`[data-color-target="${property}"]`).css('background-color', color);
		}

		/**
		 * Update live preview
		 * Requirement 14.2, 14.3, 14.4: Show live preview of changes
		 */
		updateLivePreview() {
			const colors = this.currentSettings.colors || {};
			const effects = this.currentSettings.effects || {};

			// Apply blur effect to preview container if supported
			const previewContent = this.panel.find('#mase-customizer-preview-content');
			if (previewContent.length && effects.blur !== undefined) {
				// Apply subtle backdrop blur to preview container background
				previewContent.css({
					'backdrop-filter': `blur(${Math.max(0, effects.blur / 4)}px)`,
					'-webkit-backdrop-filter': `blur(${Math.max(0, effects.blur / 4)}px)`
				});
			}

			// Update primary element
			if (this.previewElements.primary) {
				this.previewElements.primary.css({
					'background-color': colors.primary || '#0073aa',
					'color': '#ffffff',
					'border-radius': (effects.radius || 8) + 'px',
					'box-shadow': `0 ${effects.shadow || 5}px ${(effects.shadow || 5) * 2}px rgba(0, 0, 0, 0.15)`
				});
			}

			// Update secondary element
			if (this.previewElements.secondary) {
				this.previewElements.secondary.css({
					'background-color': colors.secondary || '#23282d',
					'color': '#ffffff',
					'border-radius': (effects.radius || 8) + 'px',
					'box-shadow': `0 ${effects.shadow || 5}px ${(effects.shadow || 5) * 2}px rgba(0, 0, 0, 0.15)`
				});
			}

			// Update button
			if (this.previewElements.button) {
				this.previewElements.button.css({
					'background-color': colors.accent || '#00a0d2',
					'color': '#ffffff',
					'border-radius': (effects.radius || 8) + 'px',
					'box-shadow': `0 ${effects.shadow || 5}px ${(effects.shadow || 5) * 2}px rgba(0, 160, 210, 0.3)`
				});
			}
		}

		/**
		 * Reset to default settings
		 */
		resetToDefaults() {
			this.currentSettings = $.extend(true, {}, this.originalSettings);
			this.updateUIFromSettings();
			this.announceToScreenReader(maseCustomizerL10n.settingsReset);
		}

		/**
		 * Save customizations
		 */
		saveCustomizations() {
			const self = this;
			const saveButton = this.panel.find('.mase-customizer-save');
			
			// Show loading state
			saveButton.prop('disabled', true).html('<span class="dashicons dashicons-update mase-spin"></span> ' + maseCustomizerL10n.saving);

			// Prepare data
			const data = {
				action: 'mase_save_theme_customization',
				nonce: maseCustomizerL10n.nonce,
				template_id: this.currentTemplate,
				settings: this.currentSettings
			};

			// Send AJAX request
			$.ajax({
				url: maseCustomizerL10n.ajaxUrl,
				type: 'POST',
				data: data,
				success: function(response) {
					if (response.success) {
						self.announceToScreenReader(maseCustomizerL10n.saveSuccess);
						
						// Update original settings
						self.originalSettings = $.extend(true, {}, self.currentSettings);
						
						// Show success message
						self.showNotice(maseCustomizerL10n.saveSuccess, 'success');
						
						// Close panel after short delay
						setTimeout(() => {
							self.closePanel();
						}, 1500);
					} else {
						self.showNotice(response.data || maseCustomizerL10n.saveError, 'error');
					}
				},
				error: function() {
					self.showNotice(maseCustomizerL10n.saveError, 'error');
				},
				complete: function() {
					// Restore button state
					saveButton.prop('disabled', false).html('<span class="dashicons dashicons-saved"></span> ' + maseCustomizerL10n.saveButton);
				}
			});
		}

		/**
		 * Export theme customizations
		 * Task 14.1: Implement theme export
		 * Requirements: 15.1, 15.2
		 */
		exportTheme() {
			// Collect all theme settings
			const exportData = {
				version: '1.0',
				timestamp: new Date().toISOString(),
				template_id: this.currentTemplate,
				settings: this.currentSettings,
				metadata: {
					exported_by: 'MASE Theme Customizer',
					plugin_version: '1.3.0'
				}
			};

			// Generate JSON file
			const jsonString = JSON.stringify(exportData, null, 2);
			const blob = new Blob([jsonString], { type: 'application/json' });
			
			// Create download link
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `mase-theme-${this.currentTemplate}-${Date.now()}.json`;
			
			// Trigger download
			document.body.appendChild(link);
			link.click();
			
			// Cleanup
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			
			// Show success message
			this.showNotice(maseCustomizerL10n.exportSuccess, 'success');
			this.announceToScreenReader(maseCustomizerL10n.exportSuccess);
		}

		/**
		 * Import theme customizations
		 * Task 14.2: Implement theme import
		 * Requirements: 15.3, 15.4
		 */
		importTheme(file) {
			const self = this;

			// Validate file type
			if (!file.name.endsWith('.json')) {
				this.showNotice(maseCustomizerL10n.importInvalidFile, 'error');
				return;
			}

			// Validate file size (max 1MB)
			if (file.size > 1048576) {
				this.showNotice(maseCustomizerL10n.importFileTooLarge, 'error');
				return;
			}

			// Read file
			const reader = new FileReader();
			
			reader.onload = function(e) {
				try {
					// Parse JSON
					const importData = JSON.parse(e.target.result);
					
					// Validate theme data
					if (!self.validateImportData(importData)) {
						self.showNotice(maseCustomizerL10n.importInvalidData, 'error');
						return;
					}

					// Apply imported theme (Task 14.3)
					self.applyImportedTheme(importData);
					
				} catch (error) {
					console.error('MASE: Import error:', error);
					self.showNotice(maseCustomizerL10n.importParseError, 'error');
				}
			};

			reader.onerror = function() {
				self.showNotice(maseCustomizerL10n.importReadError, 'error');
			};

			reader.readAsText(file);
		}

		/**
		 * Validate imported theme data
		 * Task 14.2: Validate theme data
		 * Requirement: 15.4
		 */
		validateImportData(data) {
			// Check required fields
			if (!data || typeof data !== 'object') {
				return false;
			}

			if (!data.version || !data.settings) {
				return false;
			}

			// Validate settings structure
			if (typeof data.settings !== 'object') {
				return false;
			}

			// Validate colors if present
			if (data.settings.colors) {
				if (typeof data.settings.colors !== 'object') {
					return false;
				}
				
				// Validate color format
				for (const key in data.settings.colors) {
					const color = data.settings.colors[key];
					if (typeof color !== 'string' || !this.isValidColor(color)) {
						return false;
					}
				}
			}

			// Validate effects if present
			if (data.settings.effects) {
				if (typeof data.settings.effects !== 'object') {
					return false;
				}
				
				// Validate effect values
				for (const key in data.settings.effects) {
					const value = data.settings.effects[key];
					if (typeof value !== 'number' || value < 0) {
						return false;
					}
				}
			}

			return true;
		}

		/**
		 * Check if color value is valid
		 */
		isValidColor(color) {
			// Check hex color format
			if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
				return true;
			}
			
			// Check rgb/rgba format
			if (/^rgba?\([\d\s,\.]+\)$/i.test(color)) {
				return true;
			}
			
			return false;
		}

		/**
		 * Apply imported theme settings
		 * Task 14.3: Apply imported theme
		 * Requirement: 15.5
		 */
		applyImportedTheme(importData) {
			// Update current settings with imported data
			this.currentSettings = $.extend(true, {}, importData.settings);
			
			// Update template ID if provided
			if (importData.template_id) {
				this.currentTemplate = importData.template_id;
			}

			// Update UI from imported settings
			this.updateUIFromSettings();

			// Update CSS custom properties
			this.updateCSSCustomProperties();

			// Show success message
			this.showNotice(maseCustomizerL10n.importSuccess, 'success');
			this.announceToScreenReader(maseCustomizerL10n.importSuccess);
		}

		/**
		 * Update CSS custom properties
		 * Task 14.3: Update CSS custom properties
		 * Requirement: 15.5
		 */
		updateCSSCustomProperties() {
			const colors = this.currentSettings.colors || {};
			const effects = this.currentSettings.effects || {};

			// Update color custom properties
			if (colors.primary) {
				document.documentElement.style.setProperty('--mase-custom-primary', colors.primary);
			}
			if (colors.secondary) {
				document.documentElement.style.setProperty('--mase-custom-secondary', colors.secondary);
			}
			if (colors.accent) {
				document.documentElement.style.setProperty('--mase-custom-accent', colors.accent);
			}

			// Update effect custom properties
			if (effects.blur !== undefined) {
				document.documentElement.style.setProperty('--mase-custom-blur', effects.blur + 'px');
			}
			if (effects.shadow !== undefined) {
				document.documentElement.style.setProperty('--mase-custom-shadow', effects.shadow + 'px');
			}
			if (effects.radius !== undefined) {
				document.documentElement.style.setProperty('--mase-custom-radius', effects.radius + 'px');
			}
		}

		/**
		 * Load settings from WordPress options
		 */
		loadSettings() {
			// This would load saved customizations from WordPress options
			// Implementation depends on backend structure
		}

		/**
		 * Show notice message
		 */
		showNotice(message, type) {
			const notice = $('<div>', {
				class: `notice notice-${type} is-dismissible`,
				html: `<p>${message}</p>`
			});

			$('.mase-settings-wrap').prepend(notice);

			// Auto-dismiss after 5 seconds
			setTimeout(() => {
				notice.fadeOut(300, function() {
					$(this).remove();
				});
			}, 5000);
		}

		/**
		 * Announce message to screen readers
		 */
		announceToScreenReader(message) {
			const announcement = $('<div>', {
				class: 'screen-reader-text',
				role: 'status',
				'aria-live': 'polite',
				text: message
			});

			$('body').append(announcement);

			setTimeout(() => {
				announcement.remove();
			}, 1000);
		}
	}

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function() {
		// Only initialize on MASE settings page
		if ($('.mase-settings-wrap').length) {
			window.maseThemeCustomizer = new MASEThemeCustomizer();
		}
	});

})(jQuery);
