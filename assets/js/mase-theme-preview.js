/**
 * MASE Theme Preview Module
 * Task 2.3: Create preview modal JavaScript
 * Requirements: 1.1, 1.5
 *
 * Handles interactive template preview with hover delay trigger,
 * keyboard shortcuts, and iframe content loading.
 *
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function ($) {
	'use strict';

	/**
	 * MASE Theme Preview Object
	 */
	var MASEThemePreview = {
		/**
		 * Configuration
		 */
		config: {
			hoverDelay: 2000, // Requirement 1.1: 2s hover delay
			modal: null,
			backdrop: null,
			container: null,
			iframe: null,
			loading: null,
			closeBtn: null,
			applyBtn: null,
			customizeBtn: null,
			currentTemplateId: null,
			hoverTimeout: null,
			isOpen: false
		},

		/**
		 * Initialize the preview system
		 */
		init: function () {
			var self = this;

			// Cache DOM elements
			this.cacheElements();

			// Bind event handlers
			this.bindEvents();

			console.log('[MASE Preview] Preview system initialized');
		},

		/**
		 * Cache DOM elements for performance
		 */
		cacheElements: function () {
			this.config.modal = $('#mase-preview-modal');
			this.config.backdrop = $('.mase-preview-backdrop');
			this.config.container = $('.mase-preview-container');
			this.config.iframe = $('#mase-preview-iframe');
			this.config.loading = $('.mase-preview-loading');
			this.config.closeBtn = $('.mase-preview-close, .mase-preview-action-close');
			this.config.applyBtn = $('.mase-preview-action-apply');
			this.config.customizeBtn = $('.mase-preview-action-customize');
		},

		/**
		 * Bind event handlers
		 */
		bindEvents: function () {
			var self = this;

			// Requirement 1.1: Hover delay trigger (2s)
			$(document).on('mouseenter', '.mase-template-card, .mase-template-preview-card', function () {
				var $card = $(this);
				var templateId = $card.data('template') || $card.data('template-id');

				// Clear any existing timeout
				if (self.config.hoverTimeout) {
					clearTimeout(self.config.hoverTimeout);
				}

				// Set new timeout for 2 seconds
				self.config.hoverTimeout = setTimeout(function () {
					self.showPreview(templateId);
				}, self.config.hoverDelay);
			});

			// Clear timeout on mouse leave
			$(document).on('mouseleave', '.mase-template-card, .mase-template-preview-card', function () {
				if (self.config.hoverTimeout) {
					clearTimeout(self.config.hoverTimeout);
					self.config.hoverTimeout = null;
				}
			});

			// Preview button click (immediate preview)
			$(document).on('click', '.mase-template-preview-btn', function (e) {
				e.preventDefault();
				e.stopPropagation();

				var $btn = $(this);
				var templateId = $btn.data('template-id');

				// Clear hover timeout if exists
				if (self.config.hoverTimeout) {
					clearTimeout(self.config.hoverTimeout);
					self.config.hoverTimeout = null;
				}

				self.showPreview(templateId);
			});

			// Close button click
			this.config.closeBtn.on('click', function (e) {
				e.preventDefault();
				self.closePreview();
			});

			// Backdrop click to close
			this.config.backdrop.on('click', function (e) {
				e.preventDefault();
				self.closePreview();
			});

			// Apply button click
			this.config.applyBtn.on('click', function (e) {
				e.preventDefault();
				self.applyTemplate();
			});

			// Customize button click (future feature)
			this.config.customizeBtn.on('click', function (e) {
				e.preventDefault();
				self.customizeTemplate();
			});

			// Requirement 1.5: Keyboard shortcuts (ESC to close)
			$(document).on('keydown', function (e) {
				if (e.key === 'Escape' && self.config.isOpen) {
					e.preventDefault();
					self.closePreview();
				}
			});

			// Prevent clicks inside container from closing modal
			this.config.container.on('click', function (e) {
				e.stopPropagation();
			});
		},

		/**
		 * Show preview modal for a template
		 * Requirement 1.1: Display preview modal
		 * Requirement 1.5: Handle iframe content loading
		 *
		 * @param {string} templateId - The template ID to preview
		 */
		showPreview: function (templateId) {
			var self = this;

			if (!templateId) {
				console.error('[MASE Preview] No template ID provided');
				return;
			}

			// Store current template ID
			this.config.currentTemplateId = templateId;

			// Show modal
			this.config.modal.attr('aria-hidden', 'false').addClass('active');
			this.config.isOpen = true;

			// Show loading state
			this.config.loading.removeClass('hidden');
			this.config.iframe.hide();

			// Update modal title
			var templateName = this.getTemplateName(templateId);
			$('#mase-preview-modal-title').text(templateName + ' Preview');

			// Load preview content
			this.loadPreviewContent(templateId);

			// Focus trap - move focus to modal
			this.config.closeBtn.first().focus();

			// Prevent body scroll
			$('body').css('overflow', 'hidden');

			console.log('[MASE Preview] Showing preview for template:', templateId);
		},

		/**
		 * Close preview modal
		 */
		closePreview: function () {
			var self = this;

			// Hide modal
			this.config.modal.attr('aria-hidden', 'true').removeClass('active');
			this.config.isOpen = false;

			// Clear iframe content after animation
			setTimeout(function () {
				self.config.iframe.attr('src', 'about:blank');
				self.config.loading.removeClass('hidden');
				self.config.iframe.hide();
			}, 300);

			// Restore body scroll
			$('body').css('overflow', '');

			// Clear current template ID
			this.config.currentTemplateId = null;

			console.log('[MASE Preview] Preview closed');
		},

		/**
		 * Load preview content into iframe
		 * Requirement 1.5: Handle preview iframe content loading
		 *
		 * @param {string} templateId - The template ID to load
		 */
		loadPreviewContent: function (templateId) {
			var self = this;

			// In a real implementation, this would load actual preview content
			// For now, we'll generate a sample preview HTML
			var previewHTML = this.generatePreviewHTML(templateId);

			// Create blob URL for iframe
			var blob = new Blob([previewHTML], { type: 'text/html' });
			var blobURL = URL.createObjectURL(blob);

			// Load iframe
			this.config.iframe.on('load', function () {
				// Hide loading, show iframe
				self.config.loading.addClass('hidden');
				self.config.iframe.show();

				console.log('[MASE Preview] Preview content loaded');
			});

			this.config.iframe.attr('src', blobURL);
		},

		/**
		 * Generate preview HTML content
		 * Task 2.4: Generate preview content
		 *
		 * @param {string} templateId - The template ID
		 * @return {string} HTML content for preview
		 */
		generatePreviewHTML: function (templateId) {
			// Get template data from localized script
			var template = this.getTemplateData(templateId);
			var templateName = template ? template.name : templateId;

			// Generate sample HTML with template applied
			var html = '<!DOCTYPE html>';
			html += '<html lang="en">';
			html += '<head>';
			html += '<meta charset="UTF-8">';
			html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
			html += '<title>' + templateName + ' Preview</title>';
			html += '<style>';
			html += this.getPreviewStyles(templateId);
			html += '</style>';
			html += '</head>';
			html += '<body>';
			html += this.getPreviewBody(templateId);
			html += '</body>';
			html += '</html>';

			return html;
		},

		/**
		 * Get preview styles for template
		 * Task 2.4: Create sample admin bar, menu, and content HTML
		 *
		 * @param {string} templateId - The template ID
		 * @return {string} CSS styles
		 */
		getPreviewStyles: function (templateId) {
			// Get template data to apply theme-specific styles
			var template = this.getTemplateData(templateId);
			
			var styles = `
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}
				
				body {
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
					background: #f0f0f1;
					min-height: 100vh;
					overflow-x: hidden;
				}
				
				.preview-container {
					display: flex;
					flex-direction: column;
					min-height: 100vh;
				}
				
				/* Admin Bar Preview - Requirement 1.2 */
				.preview-admin-bar {
					background: #23282d;
					color: #ffffff;
					padding: 0 20px;
					height: 32px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
					position: sticky;
					top: 0;
					z-index: 100;
				}
				
				.preview-admin-bar-left {
					display: flex;
					align-items: center;
					gap: 15px;
				}
				
				.preview-admin-bar-item {
					color: #ffffff;
					text-decoration: none;
					font-size: 13px;
					padding: 0 10px;
					height: 32px;
					display: flex;
					align-items: center;
					transition: background 200ms;
				}
				
				.preview-admin-bar-item:hover {
					background: rgba(255, 255, 255, 0.1);
				}
				
				.preview-admin-bar-logo {
					font-weight: 600;
					font-size: 14px;
				}
				
				/* Layout Container */
				.preview-layout {
					display: flex;
					flex: 1;
				}
				
				/* Menu Preview - Requirement 1.2 */
				.preview-menu {
					width: 160px;
					background: #ffffff;
					border-right: 1px solid #c3c4c7;
					padding: 10px 0;
					overflow-y: auto;
				}
				
				.preview-menu-item {
					padding: 10px 20px;
					cursor: pointer;
					transition: all 200ms;
					display: flex;
					align-items: center;
					gap: 10px;
					font-size: 14px;
					color: #1d2327;
					border-left: 3px solid transparent;
				}
				
				.preview-menu-item:hover {
					background: #f0f0f1;
					border-left-color: #2271b1;
				}
				
				.preview-menu-item.active {
					background: #f0f0f1;
					border-left-color: #2271b1;
					font-weight: 600;
				}
				
				.preview-menu-icon {
					width: 20px;
					height: 20px;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 18px;
				}
				
				.preview-menu-separator {
					height: 1px;
					background: #c3c4c7;
					margin: 10px 0;
				}
				
				/* Content Area Preview - Requirement 1.2 */
				.preview-content-wrapper {
					flex: 1;
					padding: 20px;
					overflow-y: auto;
				}
				
				.preview-content {
					background: #ffffff;
					border: 1px solid #c3c4c7;
					border-radius: 4px;
					padding: 30px;
					max-width: 1200px;
				}
				
				.preview-content-header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 25px;
					padding-bottom: 15px;
					border-bottom: 1px solid #e0e0e0;
				}
				
				.preview-content h1 {
					font-size: 23px;
					font-weight: 400;
					color: #1d2327;
					margin: 0;
				}
				
				.preview-content h2 {
					font-size: 18px;
					font-weight: 600;
					color: #1d2327;
					margin: 20px 0 15px;
				}
				
				.preview-content p {
					line-height: 1.6;
					color: #50575e;
					margin-bottom: 15px;
				}
				
				.preview-button {
					display: inline-flex;
					align-items: center;
					gap: 8px;
					padding: 8px 16px;
					background: #2271b1;
					color: #ffffff;
					border: none;
					border-radius: 4px;
					cursor: pointer;
					font-size: 13px;
					font-weight: 500;
					transition: background 200ms;
					text-decoration: none;
				}
				
				.preview-button:hover {
					background: #135e96;
				}
				
				.preview-button-secondary {
					background: #ffffff;
					color: #2271b1;
					border: 1px solid #2271b1;
				}
				
				.preview-button-secondary:hover {
					background: #f0f0f1;
				}
				
				.preview-card {
					background: #f9f9f9;
					border: 1px solid #e0e0e0;
					border-radius: 4px;
					padding: 20px;
					margin: 15px 0;
				}
				
				.preview-card h3 {
					font-size: 16px;
					font-weight: 600;
					color: #1d2327;
					margin-bottom: 10px;
				}
				
				.preview-form-group {
					margin-bottom: 20px;
				}
				
				.preview-label {
					display: block;
					font-weight: 600;
					margin-bottom: 8px;
					color: #1d2327;
				}
				
				.preview-input {
					width: 100%;
					padding: 8px 12px;
					border: 1px solid #8c8f94;
					border-radius: 4px;
					font-size: 14px;
					transition: border-color 200ms;
				}
				
				.preview-input:focus {
					outline: none;
					border-color: #2271b1;
					box-shadow: 0 0 0 1px #2271b1;
				}
				
				/* Responsive */
				@media (max-width: 782px) {
					.preview-menu {
						width: 60px;
					}
					
					.preview-menu-item {
						padding: 10px;
						justify-content: center;
					}
					
					.preview-menu-item span {
						display: none;
					}
				}
			`;

			return styles;
		},

		/**
		 * Get preview body HTML
		 * Task 2.4: Create sample admin bar, menu, and content HTML
		 * Requirement 1.2: Include admin bar, menu, content area, and buttons
		 *
		 * @param {string} templateId - The template ID
		 * @return {string} HTML body content
		 */
		getPreviewBody: function (templateId) {
			var templateName = this.getTemplateName(templateId);

			var html = '<div class="preview-container">';
			
			// Admin Bar Preview - Requirement 1.2
			html += '<div class="preview-admin-bar">';
			html += '<div class="preview-admin-bar-left">';
			html += '<div class="preview-admin-bar-logo">WordPress</div>';
			html += '<a href="#" class="preview-admin-bar-item">Dashboard</a>';
			html += '<a href="#" class="preview-admin-bar-item">Updates</a>';
			html += '<a href="#" class="preview-admin-bar-item">Comments</a>';
			html += '</div>';
			html += '<div class="preview-admin-bar-right">';
			html += '<a href="#" class="preview-admin-bar-item">Howdy, Admin</a>';
			html += '</div>';
			html += '</div>';
			
			// Layout Container
			html += '<div class="preview-layout">';
			
			// Menu Preview - Requirement 1.2
			html += '<div class="preview-menu">';
			html += '<div class="preview-menu-item active">';
			html += '<span class="preview-menu-icon">📊</span>';
			html += '<span>Dashboard</span>';
			html += '</div>';
			html += '<div class="preview-menu-item">';
			html += '<span class="preview-menu-icon">📝</span>';
			html += '<span>Posts</span>';
			html += '</div>';
			html += '<div class="preview-menu-item">';
			html += '<span class="preview-menu-icon">🖼️</span>';
			html += '<span>Media</span>';
			html += '</div>';
			html += '<div class="preview-menu-item">';
			html += '<span class="preview-menu-icon">📄</span>';
			html += '<span>Pages</span>';
			html += '</div>';
			html += '<div class="preview-menu-separator"></div>';
			html += '<div class="preview-menu-item">';
			html += '<span class="preview-menu-icon">🎨</span>';
			html += '<span>Appearance</span>';
			html += '</div>';
			html += '<div class="preview-menu-item">';
			html += '<span class="preview-menu-icon">🔌</span>';
			html += '<span>Plugins</span>';
			html += '</div>';
			html += '<div class="preview-menu-item">';
			html += '<span class="preview-menu-icon">👥</span>';
			html += '<span>Users</span>';
			html += '</div>';
			html += '<div class="preview-menu-item">';
			html += '<span class="preview-menu-icon">⚙️</span>';
			html += '<span>Settings</span>';
			html += '</div>';
			html += '</div>';
			
			// Content Area Preview - Requirement 1.2
			html += '<div class="preview-content-wrapper">';
			html += '<div class="preview-content">';
			
			// Content Header
			html += '<div class="preview-content-header">';
			html += '<h1>' + templateName + ' Template Preview</h1>';
			html += '<div>';
			html += '<button class="preview-button">Add New</button>';
			html += '</div>';
			html += '</div>';
			
			// Content Body
			html += '<p>This is a live preview of how the <strong>' + templateName + '</strong> template will transform your WordPress admin interface. ';
			html += 'The template includes carefully crafted colors, typography, and visual effects designed to enhance your workflow.</p>';
			
			// Sample Card
			html += '<div class="preview-card">';
			html += '<h3>Template Features</h3>';
			html += '<p>This template includes custom styling for all admin elements including the admin bar, navigation menu, content areas, forms, and buttons. ';
			html += 'All colors and effects are optimized for readability and usability.</p>';
			html += '</div>';
			
			// Sample Form
			html += '<h2>Sample Form Elements</h2>';
			html += '<div class="preview-form-group">';
			html += '<label class="preview-label">Title</label>';
			html += '<input type="text" class="preview-input" placeholder="Enter title..." value="Sample Post Title">';
			html += '</div>';
			
			html += '<div class="preview-form-group">';
			html += '<label class="preview-label">Description</label>';
			html += '<input type="text" class="preview-input" placeholder="Enter description..." value="This is a sample description">';
			html += '</div>';
			
			// Action Buttons
			html += '<div style="display: flex; gap: 10px; margin-top: 25px;">';
			html += '<button class="preview-button">Save Changes</button>';
			html += '<button class="preview-button preview-button-secondary">Cancel</button>';
			html += '</div>';
			
			html += '</div>'; // .preview-content
			html += '</div>'; // .preview-content-wrapper
			
			html += '</div>'; // .preview-layout
			html += '</div>'; // .preview-container

			return html;
		},

		/**
		 * Apply the currently previewed template
		 */
		applyTemplate: function () {
			var self = this;

			if (!this.config.currentTemplateId) {
				console.error('[MASE Preview] No template to apply');
				return;
			}

			// Close preview
			this.closePreview();

			// Trigger template application via MASE.templateManager
			if (window.MASE && window.MASE.templateManager) {
				window.MASE.templateManager.apply(this.config.currentTemplateId);
			} else {
				console.error('[MASE Preview] Template manager not available');
			}
		},

		/**
		 * Open customization panel for template (future feature)
		 */
		customizeTemplate: function () {
			console.log('[MASE Preview] Customize feature coming soon');
			// This will be implemented in Task 13: Theme Customization Panel
		},

		/**
		 * Get template name from ID
		 *
		 * @param {string} templateId - The template ID
		 * @return {string} Template name
		 */
		getTemplateName: function (templateId) {
			var $card = $('.mase-template-card[data-template="' + templateId + '"], .mase-template-preview-card[data-template="' + templateId + '"]');
			var name = $card.find('h3').first().text();
			return name || templateId;
		},

		/**
		 * Get template data from localized script
		 *
		 * @param {string} templateId - The template ID
		 * @return {Object|null} Template data
		 */
		getTemplateData: function (templateId) {
			if (window.maseAdmin && window.maseAdmin.templates && window.maseAdmin.templates[templateId]) {
				return window.maseAdmin.templates[templateId];
			}
			return null;
		}
	};

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function () {
		MASEThemePreview.init();
	});

	/**
	 * Expose to global scope for external access
	 */
	window.MASEThemePreview = MASEThemePreview;

})(jQuery);
