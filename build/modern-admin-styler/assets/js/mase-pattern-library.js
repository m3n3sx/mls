/**
 * MASE Pattern Library Module
 * 
 * Handles pattern browser UI, search/filter, and pattern selection.
 * Task 22: Build pattern browser UI
 * Requirements: 3.1, 3.5
 */

(function($) {
	'use strict';

	// Create MASE namespace if it doesn't exist
	window.MASE = window.MASE || {};

	/**
	 * Pattern Library Module
	 */
	MASE.patternLibrary = {
		/**
		 * Pattern library data (populated via wp_localize_script)
		 */
		patterns: {},

		/**
		 * Currently selected pattern ID
		 */
		selectedPattern: null,

		/**
		 * Current filter category
		 */
		currentCategory: 'all',

		/**
		 * Current search query
		 */
		searchQuery: '',

		/**
		 * Cached DOM elements
		 * Task 35: Minimize DOM queries using caching
		 */
		domCache: {},

		/**
		 * Debounced update function
		 * Task 35: Debounce live preview updates (300ms)
		 */
		debouncedUpdate: null,

		/**
		 * Initialize pattern library
		 */
		init: function() {
			// Get pattern library data from localized script
			if (typeof masePatternLibrary !== 'undefined') {
				this.patterns = masePatternLibrary;
			}

			// Initialize DOM cache
			this.initDOMCache();

			// Create debounced update function
			if (MASE.assetLoader && typeof MASE.assetLoader.debounce === 'function') {
				this.debouncedUpdate = MASE.assetLoader.debounce(this.updatePatternPreview.bind(this), 300);
			} else {
				this.debouncedUpdate = this.updatePatternPreview.bind(this);
			}

			// Bind event handlers
			this.bindEvents();

			// Initial render
			this.render();

			// Initialize customization controls (Task 23)
			this.initCustomizationControls();
		},

		/**
		 * Sanitize SVG content to prevent XSS
		 * Task 39: XSS Prevention - Requirement 12.4
		 * 
		 * @param {string} svg - SVG content to sanitize
		 * @return {string} - Sanitized SVG content
		 */
		sanitizeSVG: function(svg) {
			if (typeof svg !== 'string') {
				return '';
			}

			// Remove script tags
			svg = svg.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
			
			// Remove event handlers (onclick, onload, etc.)
			svg = svg.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
			
			// Remove javascript: URLs
			svg = svg.replace(/javascript:/gi, '');
			
			// Remove data: URLs (except for image/*)
			svg = svg.replace(/data:(?!image\/)[^"'\s]*/gi, '');
			
			return svg;
		},

		/**
		 * Initialize DOM cache
		 * Task 35: Minimize DOM queries using caching
		 */
		initDOMCache: function() {
			this.domCache = {
				$patternGrid: $('.mase-pattern-grid'),
				$categoryFilter: $('.mase-pattern-category-filter'),
				$searchInput: $('.mase-pattern-search'),
				$colorPicker: $('.mase-pattern-color-picker'),
				$opacitySlider: $('.mase-pattern-opacity-slider'),
				$opacityValue: $('.mase-pattern-opacity-value'),
				$scaleSlider: $('.mase-pattern-scale-slider'),
				$scaleValue: $('.mase-pattern-scale-value'),
				$preview: $('.mase-pattern-customization-preview')
			};
		},

		/**
		 * Bind event handlers
		 */
		bindEvents: function() {
			var self = this;

			// Category filter dropdown
			$(document).on('change', '.mase-pattern-category-filter', function() {
				self.currentCategory = $(this).val();
				self.render();
			});

			// Search input - debounced for performance
			// Task 35: Debounce search input
			var debouncedSearch = MASE.assetLoader && MASE.assetLoader.debounce ? 
				MASE.assetLoader.debounce(function(query) {
					self.searchQuery = query;
					self.render();
				}, 300) : function(query) {
					self.searchQuery = query;
					self.render();
				};

			$(document).on('input', '.mase-pattern-search', function() {
				debouncedSearch($(this).val().toLowerCase());
			});

			// Pattern selection
			$(document).on('click', '.mase-pattern-item', function() {
				var patternId = $(this).data('pattern-id');
				self.selectPattern(patternId);
			});

			// Task 23: Pattern customization controls
			// Pattern color picker - use debounced update
			$(document).on('change', '.mase-pattern-color-picker', function() {
				if (self.debouncedUpdate) {
					self.debouncedUpdate();
				} else {
					self.updatePatternPreview();
				}
			});

			// Pattern opacity slider - use debounced update
			$(document).on('input change', '.mase-pattern-opacity-slider', function() {
				var value = $(this).val();
				// Update value display immediately for responsiveness
				if (self.domCache.$opacityValue && self.domCache.$opacityValue.length) {
					self.domCache.$opacityValue.text(value + '%');
				} else {
					$('.mase-pattern-opacity-value').text(value + '%');
				}
				// Debounce the preview update
				if (self.debouncedUpdate) {
					self.debouncedUpdate();
				} else {
					self.updatePatternPreview();
				}
			});

			// Pattern scale slider - use debounced update
			$(document).on('input change', '.mase-pattern-scale-slider', function() {
				var value = $(this).val();
				// Update value display immediately for responsiveness
				if (self.domCache.$scaleValue && self.domCache.$scaleValue.length) {
					self.domCache.$scaleValue.text(value + '%');
				} else {
					$('.mase-pattern-scale-value').text(value + '%');
				}
				// Debounce the preview update
				if (self.debouncedUpdate) {
					self.debouncedUpdate();
				} else {
					self.updatePatternPreview();
				}
			});
		},

		/**
		 * Render pattern library grid
		 */
		render: function() {
			// Use cached DOM element if available
			var $container = this.domCache.$patternGrid && this.domCache.$patternGrid.length ? 
				this.domCache.$patternGrid : $('.mase-pattern-grid');
			
			if ($container.length === 0) {
				return;
			}

			// Clear container
			$container.empty();

			// Get filtered patterns
			var filteredPatterns = this.getFilteredPatterns();

			// Check if no patterns found
			if (filteredPatterns.length === 0) {
				$container.append(
					'<div class="mase-pattern-empty">' +
					'<p>No patterns found matching your criteria.</p>' +
					'</div>'
				);
				return;
			}

			// Render each pattern
			filteredPatterns.forEach(function(pattern) {
				var $item = $('<div>')
					.addClass('mase-pattern-item')
					.attr('data-pattern-id', pattern.id)
					.attr('data-category', pattern.category)
					.attr('title', pattern.name);

				// Add selected class if this is the selected pattern
				if (pattern.id === this.selectedPattern) {
					$item.addClass('selected');
				}

				// Create pattern preview
				// XSS Prevention - Task 39: Sanitize SVG before inserting
				// Pattern SVG comes from trusted source (pattern library), but we still sanitize
				var sanitizedSVG = MASE.patternLibrary.sanitizeSVG(pattern.svg);
				var $preview = $('<div>')
					.addClass('mase-pattern-preview')
					.html(sanitizedSVG);

				// Create pattern name label
				var $name = $('<div>')
					.addClass('mase-pattern-name')
					.text(pattern.name);

				$item.append($preview).append($name);
				$container.append($item);
			}.bind(this));
		},

		/**
		 * Get filtered patterns based on category and search
		 * 
		 * @return {Array} Filtered pattern objects
		 */
		getFilteredPatterns: function() {
			var filtered = [];

			// Iterate through all categories
			for (var category in this.patterns) {
				if (!this.patterns.hasOwnProperty(category)) {
					continue;
				}

				// Skip if category filter is active and doesn't match
				if (this.currentCategory !== 'all' && this.currentCategory !== category) {
					continue;
				}

				var categoryPatterns = this.patterns[category];

				// Iterate through patterns in category
				for (var patternId in categoryPatterns) {
					if (!categoryPatterns.hasOwnProperty(patternId)) {
						continue;
					}

					var pattern = categoryPatterns[patternId];

					// Apply search filter
					if (this.searchQuery) {
						var searchableText = (pattern.name + ' ' + pattern.description + ' ' + category).toLowerCase();
						if (searchableText.indexOf(this.searchQuery) === -1) {
							continue;
						}
					}

					// Add to filtered results
					filtered.push({
						id: patternId,
						name: pattern.name,
						category: category,
						description: pattern.description,
						svg: pattern.svg
					});
				}
			}

			return filtered;
		},

		/**
		 * Select a pattern
		 * 
		 * @param {string} patternId Pattern ID to select
		 */
		selectPattern: function(patternId) {
			// Update selected pattern
			this.selectedPattern = patternId;

			// Update UI
			$('.mase-pattern-item').removeClass('selected');
			$('.mase-pattern-item[data-pattern-id="' + patternId + '"]').addClass('selected');

			// Get pattern data
			var patternData = this.getPatternData(patternId);

			if (!patternData) {
				return;
			}

			// Update hidden input with pattern ID
			$('input[name="custom_backgrounds[pattern_id]"]').val(patternId).trigger('change');

			// Trigger pattern selected event for other modules
			$(document).trigger('mase:patternSelected', [patternId, patternData]);

			// Update live preview if available
			if (typeof MASE.livePreview !== 'undefined' && MASE.livePreview.updateBackground) {
				MASE.livePreview.updateBackground();
			}
		},

		/**
		 * Get pattern data by ID
		 * 
		 * @param {string} patternId Pattern ID
		 * @return {Object|null} Pattern data or null if not found
		 */
		getPatternData: function(patternId) {
			for (var category in this.patterns) {
				if (!this.patterns.hasOwnProperty(category)) {
					continue;
				}

				if (this.patterns[category][patternId]) {
					return {
						id: patternId,
						category: category,
						name: this.patterns[category][patternId].name,
						description: this.patterns[category][patternId].description,
						svg: this.patterns[category][patternId].svg
					};
				}
			}

			return null;
		},

		/**
		 * Get current selected pattern ID
		 * 
		 * @return {string|null} Selected pattern ID or null
		 */
		getSelectedPattern: function() {
			return this.selectedPattern;
		},

		/**
		 * Set selected pattern programmatically
		 * 
		 * @param {string} patternId Pattern ID to select
		 */
		setSelectedPattern: function(patternId) {
			this.selectedPattern = patternId;
			this.render();
		},

		/**
		 * Update pattern preview with current customization settings
		 * Task 23: Pattern customization controls
		 * Requirements: 3.2, 3.3
		 */
		updatePatternPreview: function() {
			if (!this.selectedPattern) {
				return;
			}

			// Get current customization values
			var color = $('.mase-pattern-color-picker').val() || '#000000';
			var opacity = parseInt($('.mase-pattern-opacity-slider').val() || 100, 10);
			var scale = parseInt($('.mase-pattern-scale-slider').val() || 100, 10);

			// Get pattern data
			var patternData = this.getPatternData(this.selectedPattern);
			if (!patternData) {
				return;
			}

			// Replace color placeholder in SVG
			var customizedSvg = patternData.svg.replace(/{color}/g, color);

			// Create data URI
			var dataUri = 'data:image/svg+xml;base64,' + btoa(customizedSvg);

			// Update preview element
			var $preview = $('.mase-pattern-customization-preview');
			if ($preview.length > 0) {
				$preview.css({
					'background-image': 'url(' + dataUri + ')',
					'background-size': scale + '%',
					'background-repeat': 'repeat',
					'opacity': opacity / 100
				});
			}

			// Trigger pattern customization changed event
			$(document).trigger('mase:patternCustomizationChanged', [{
				patternId: this.selectedPattern,
				color: color,
				opacity: opacity,
				scale: scale,
				svg: customizedSvg,
				dataUri: dataUri
			}]);

			// Update live preview if available
			if (typeof MASE.livePreview !== 'undefined' && MASE.livePreview.updateBackground) {
				MASE.livePreview.updateBackground();
			}
		},

		/**
		 * Initialize pattern customization controls
		 * Task 23: Initialize color picker and sliders
		 */
		initCustomizationControls: function() {
			// Initialize WordPress color picker for pattern color
			if ($.fn.wpColorPicker) {
				$('.mase-pattern-color-picker').wpColorPicker({
					change: function() {
						MASE.patternLibrary.updatePatternPreview();
					},
					clear: function() {
						MASE.patternLibrary.updatePatternPreview();
					}
				});
			}

			// Set initial slider values
			var opacity = $('.mase-pattern-opacity-slider').val() || 100;
			var scale = $('.mase-pattern-scale-slider').val() || 100;
			$('.mase-pattern-opacity-value').text(opacity + '%');
			$('.mase-pattern-scale-value').text(scale + '%');

			// Initial preview update
			this.updatePatternPreview();
		}
	};

	// Initialize on document ready
	$(document).ready(function() {
		MASE.patternLibrary.init();
	});

})(jQuery);
