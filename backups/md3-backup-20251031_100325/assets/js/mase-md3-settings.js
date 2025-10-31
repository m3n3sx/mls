/**
 * Material Design 3 Settings Panel JavaScript
 * 
 * Handles:
 * - Collapsible section expand/collapse with state persistence
 * - Save success feedback animations
 * - Smooth transitions and animations
 * 
 * Requirements: 24.3, 24.5
 * 
 * @package ModernAdminStyler
 * @since 1.2.0
 */

(function($) {
	'use strict';

	/**
	 * Settings Panel Manager
	 */
	const MaseSettingsPanel = {
		
		/**
		 * Initialize the settings panel
		 */
		init: function() {
			this.initCollapsibleSections();
			this.initSaveFeedback();
			this.initConditionalGroups();
			
			console.log('[MASE MD3 Settings] Initialized');
		},
		
		/**
		 * Initialize collapsible sections (Requirement 24.3)
		 */
		initCollapsibleSections: function() {
			const self = this;
			
			// Load saved expanded states from localStorage
			const expandedSections = this.getExpandedSections();
			
			// Initialize each collapsible section
			$('.mase-section-collapsible').each(function() {
				const $section = $(this);
				const sectionId = $section.attr('id') || $section.data('section-id');
				
				// Restore expanded state if saved
				if (sectionId && expandedSections.includes(sectionId)) {
					$section.addClass('expanded');
				}
				
				// Set initial max-height for smooth animation
				self.updateContentHeight($section);
			});
			
			// Handle header clicks
			$(document).on('click', '.mase-section-collapsible-header', function(e) {
				e.preventDefault();
				const $section = $(this).closest('.mase-section-collapsible');
				self.toggleSection($section);
			});
			
			// Handle keyboard navigation
			$(document).on('keydown', '.mase-section-collapsible-header', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					const $section = $(this).closest('.mase-section-collapsible');
					self.toggleSection($section);
				}
			});
			
			// Update heights on window resize
			let resizeTimer;
			$(window).on('resize', function() {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function() {
					$('.mase-section-collapsible.expanded').each(function() {
						self.updateContentHeight($(this));
					});
				}, 250);
			});
		},
		
		/**
		 * Toggle section expanded/collapsed state
		 * 
		 * @param {jQuery} $section - The section element
		 */
		toggleSection: function($section) {
			const isExpanded = $section.hasClass('expanded');
			const sectionId = $section.attr('id') || $section.data('section-id');
			
			if (isExpanded) {
				// Collapse
				$section.removeClass('expanded');
				$section.find('.mase-section-collapsible-content').css('max-height', '0');
				
				// Update ARIA
				$section.find('.mase-section-collapsible-header')
					.attr('aria-expanded', 'false');
				
				// Save state
				if (sectionId) {
					this.removeExpandedSection(sectionId);
				}
			} else {
				// Expand
				$section.addClass('expanded');
				this.updateContentHeight($section);
				
				// Update ARIA
				$section.find('.mase-section-collapsible-header')
					.attr('aria-expanded', 'true');
				
				// Save state
				if (sectionId) {
					this.addExpandedSection(sectionId);
				}
			}
		},
		
		/**
		 * Update content height for smooth animation
		 * 
		 * @param {jQuery} $section - The section element
		 */
		updateContentHeight: function($section) {
			const $content = $section.find('.mase-section-collapsible-content');
			const $body = $section.find('.mase-section-collapsible-body');
			
			if ($section.hasClass('expanded')) {
				// Get actual content height
				const height = $body.outerHeight(true);
				$content.css('max-height', height + 'px');
			}
		},
		
		/**
		 * Get expanded sections from localStorage
		 * 
		 * @return {Array} Array of expanded section IDs
		 */
		getExpandedSections: function() {
			try {
				const saved = localStorage.getItem('mase_expanded_sections');
				return saved ? JSON.parse(saved) : [];
			} catch (e) {
				console.warn('[MASE MD3 Settings] Failed to load expanded sections:', e);
				return [];
			}
		},
		
		/**
		 * Add section to expanded list
		 * 
		 * @param {string} sectionId - Section ID to add
		 */
		addExpandedSection: function(sectionId) {
			try {
				const expanded = this.getExpandedSections();
				if (!expanded.includes(sectionId)) {
					expanded.push(sectionId);
					localStorage.setItem('mase_expanded_sections', JSON.stringify(expanded));
				}
			} catch (e) {
				console.warn('[MASE MD3 Settings] Failed to save expanded section:', e);
			}
		},
		
		/**
		 * Remove section from expanded list
		 * 
		 * @param {string} sectionId - Section ID to remove
		 */
		removeExpandedSection: function(sectionId) {
			try {
				const expanded = this.getExpandedSections();
				const index = expanded.indexOf(sectionId);
				if (index > -1) {
					expanded.splice(index, 1);
					localStorage.setItem('mase_expanded_sections', JSON.stringify(expanded));
				}
			} catch (e) {
				console.warn('[MASE MD3 Settings] Failed to remove expanded section:', e);
			}
		},
		
		/**
		 * Initialize save feedback animations (Requirement 24.5)
		 */
		initSaveFeedback: function() {
			const self = this;
			
			// Listen for successful save events
			$(document).on('mase:settings:saved', function(e, data) {
				self.showSaveSuccess(data);
			});
			
			// Listen for palette/template apply events
			$(document).on('mase:palette:applied mase:template:applied', function(e, data) {
				self.showSaveSuccess({
					message: data.message || 'Changes applied successfully!'
				});
			});
		},
		
		/**
		 * Show save success feedback
		 * 
		 * @param {Object} data - Success data with optional message
		 */
		showSaveSuccess: function(data) {
			const message = data.message || 'Settings saved successfully!';
			
			// Create or get success indicator
			let $indicator = $('.mase-save-success');
			
			if ($indicator.length === 0) {
				$indicator = $('<div class="mase-save-success">' +
					'<span class="dashicons dashicons-yes-alt"></span>' +
					'<span class="mase-save-success-text"></span>' +
					'</div>');
				$('body').append($indicator);
			}
			
			// Update message
			$indicator.find('.mase-save-success-text').text(message);
			
			// Show with animation
			setTimeout(function() {
				$indicator.addClass('show');
			}, 10);
			
			// Hide after 3 seconds
			setTimeout(function() {
				$indicator.removeClass('show');
			}, 3000);
		},
		
		/**
		 * Show inline section save indicator
		 * 
		 * @param {jQuery} $section - Section element
		 * @param {string} message - Success message
		 */
		showSectionSaveIndicator: function($section, message) {
			message = message || 'Saved';
			
			// Find or create indicator
			let $indicator = $section.find('.mase-section-save-indicator');
			
			if ($indicator.length === 0) {
				$indicator = $('<span class="mase-section-save-indicator">' +
					'<span class="dashicons dashicons-yes"></span>' +
					'<span>' + message + '</span>' +
					'</span>');
				$section.find('h2, h3').first().append($indicator);
			}
			
			// Show with animation
			$indicator.addClass('show');
			
			// Hide after 2 seconds
			setTimeout(function() {
				$indicator.removeClass('show');
			}, 2000);
		},
		
		/**
		 * Initialize conditional groups visibility
		 */
		initConditionalGroups: function() {
			const self = this;
			
			// Handle conditional group visibility based on parent control
			$(document).on('change', 'input[type="checkbox"], select', function() {
				const $control = $(this);
				const controlId = $control.attr('id');
				
				if (!controlId) return;
				
				// Find dependent conditional groups
				const $dependents = $('[data-depends-on="' + controlId + '"]');
				
				$dependents.each(function() {
					const $dependent = $(this);
					const requiredValue = $dependent.data('value');
					
					if ($control.is('input[type="checkbox"]')) {
						// Checkbox: show if checked (unless specific value required)
						const isChecked = $control.is(':checked');
						if (requiredValue === undefined) {
							$dependent.toggle(isChecked);
						} else {
							$dependent.toggle(isChecked && $control.val() === requiredValue);
						}
					} else if ($control.is('select')) {
						// Select: show if value matches
						const currentValue = $control.val();
						if (requiredValue === undefined) {
							$dependent.show();
						} else {
							$dependent.toggle(currentValue === requiredValue);
						}
					}
				});
			});
			
			// Trigger initial visibility check
			$('input[type="checkbox"], select').each(function() {
				$(this).trigger('change');
			});
		}
	};
	
	/**
	 * Initialize on document ready
	 */
	$(document).ready(function() {
		// Only initialize on MASE settings page
		if ($('.mase-settings-wrap').length > 0) {
			MaseSettingsPanel.init();
		}
	});
	
	// Expose to global scope for external access
	window.MaseSettingsPanel = MaseSettingsPanel;
	
})(jQuery);

	/**
	 * Template Search and Filter (Task 19)
	 * Requirements: 27.1, 27.2, 27.3, 27.4, 27.5
	 */
	const MaseTemplateSearch = {
		
		/**
		 * Initialize template search
		 */
		init: function() {
			this.searchInput = $('#mase-template-search');
			this.clearButton = $('#mase-template-search-clear');
			this.emptyState = $('#mase-template-empty-state');
			this.emptyStateClearBtn = $('#mase-empty-state-clear');
			this.templateCards = $('.mase-template-card');
			
			if (this.searchInput.length === 0) {
				return;
			}
			
			this.bindEvents();
			console.log('[MASE Template Search] Initialized');
		},
		
		/**
		 * Bind event handlers
		 */
		bindEvents: function() {
			const self = this;
			
			// Real-time search (Requirement 27.2)
			this.searchInput.on('input', function() {
				const query = $(this).val();
				self.filterTemplates(query);
				self.toggleClearButton(query);
			});
			
			// Clear button click (Requirement 27.5)
			this.clearButton.on('click', function() {
				self.clearSearch();
			});
			
			// Empty state clear button
			this.emptyStateClearBtn.on('click', function() {
				self.clearSearch();
			});
			
			// Keyboard shortcuts
			this.searchInput.on('keydown', function(e) {
				// Escape key clears search
				if (e.key === 'Escape') {
					e.preventDefault();
					self.clearSearch();
				}
			});
		},
		
		/**
		 * Filter templates based on search query (Requirement 27.2, 27.3)
		 * 
		 * @param {string} query - Search query
		 */
		filterTemplates: function(query) {
			const searchTerm = query.toLowerCase().trim();
			let visibleCount = 0;
			
			this.templateCards.each(function() {
				const $card = $(this);
				const templateName = $card.find('.mase-template-name').text().toLowerCase();
				const templateDesc = $card.find('.mase-template-description').text().toLowerCase();
				
				// Check if template matches search
				const matches = searchTerm === '' || 
					templateName.includes(searchTerm) || 
					templateDesc.includes(searchTerm);
				
				if (matches) {
					// Show with animation (Requirement 27.3)
					$card.removeClass('mase-filtered-out').addClass('mase-filtered-in');
					visibleCount++;
					
					// Remove animation class after animation completes
					setTimeout(function() {
						$card.removeClass('mase-filtered-in');
					}, 300);
				} else {
					// Hide
					$card.removeClass('mase-filtered-in').addClass('mase-filtered-out');
				}
			});
			
			// Show/hide empty state (Requirement 27.4)
			this.toggleEmptyState(visibleCount === 0 && searchTerm !== '');
		},
		
		/**
		 * Toggle clear button visibility (Requirement 27.5)
		 * 
		 * @param {string} query - Current search query
		 */
		toggleClearButton: function(query) {
			if (query.length > 0) {
				this.clearButton.fadeIn(200);
			} else {
				this.clearButton.fadeOut(200);
			}
		},
		
		/**
		 * Toggle empty state visibility (Requirement 27.4)
		 * 
		 * @param {boolean} show - Whether to show empty state
		 */
		toggleEmptyState: function(show) {
			if (show) {
				this.emptyState.fadeIn(300);
			} else {
				this.emptyState.fadeOut(300);
			}
		},
		
		/**
		 * Clear search and restore all templates (Requirement 27.5)
		 */
		clearSearch: function() {
			// Clear input
			this.searchInput.val('').focus();
			
			// Hide clear button
			this.clearButton.fadeOut(200);
			
			// Hide empty state
			this.emptyState.fadeOut(300);
			
			// Show all templates with smooth animation
			this.templateCards.each(function() {
				const $card = $(this);
				$card.removeClass('mase-filtered-out').addClass('mase-filtered-in');
				
				// Remove animation class after animation completes
				setTimeout(function() {
					$card.removeClass('mase-filtered-in');
				}, 300);
			});
			
			console.log('[MASE Template Search] Search cleared');
		}
	};
	
	// Initialize on document ready
	$(document).ready(function() {
		MaseTemplateSearch.init();
	});

