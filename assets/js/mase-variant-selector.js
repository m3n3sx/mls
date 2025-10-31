/**
 * Theme Variant Selector
 * Modern Admin Styler - Template Visual Enhancements v2
 * 
 * Handles color variant selection for template themes
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function($) {
	'use strict';

	/**
	 * Variant definitions for each theme
	 */
	const themeVariants = {
		terminal: [
			{ id: 'green', name: 'Green', color: '#00ff41' },
			{ id: 'blue', name: 'Blue', color: '#00d4ff' },
			{ id: 'amber', name: 'Amber', color: '#ffb000' },
			{ id: 'red', name: 'Red', color: '#ff0040' }
		],
		gaming: [
			{ id: 'cyberpunk', name: 'Cyberpunk', color: '#00f5ff' },
			{ id: 'neon', name: 'Neon', color: '#ff10f0' },
			{ id: 'matrix', name: 'Matrix', color: '#00ff00' }
		],
		glass: [
			{ id: 'clear', name: 'Clear', color: 'rgba(255, 255, 255, 0.3)' },
			{ id: 'blue', name: 'Blue', color: 'rgba(33, 150, 243, 0.3)' },
			{ id: 'purple', name: 'Purple', color: 'rgba(156, 39, 176, 0.3)' }
		],
		gradient: [
			{ id: 'warm', name: 'Warm', color: '#ee7752' },
			{ id: 'cool', name: 'Cool', color: '#23a6d5' },
			{ id: 'sunset', name: 'Sunset', color: '#ff6b6b' }
		],
		floral: [
			{ id: 'rose', name: 'Rose', color: '#e84393' },
			{ id: 'lavender', name: 'Lavender', color: '#a29bfe' },
			{ id: 'sakura', name: 'Sakura', color: '#ffb3ba' }
		],
		retro: [
			{ id: 'classic', name: 'Classic', color: '#ff6b6b' },
			{ id: 'synthwave', name: 'Synthwave', color: '#ff006e' },
			{ id: 'vaporwave', name: 'Vaporwave', color: '#ff71ce' }
		],
		professional: [
			{ id: 'corporate', name: 'Corporate', color: '#2c3e50' },
			{ id: 'executive', name: 'Executive', color: '#1a1a2e' },
			{ id: 'modern', name: 'Modern', color: '#2d3436' }
		],
		minimal: [
			{ id: 'light', name: 'Light', color: '#ffffff' },
			{ id: 'dark', name: 'Dark', color: '#1a1a1a' },
			{ id: 'monochrome', name: 'Monochrome', color: '#000000' }
		]
	};

	/**
	 * Initialize variant selectors
	 */
	function initVariantSelectors() {
		// Add variant selectors to template cards
		$('.mase-template-card, .mase-template-preview-card').each(function() {
			const $card = $(this);
			const templateId = $card.data('template');
			
			// Check if this theme has variants
			if (!themeVariants[templateId]) {
				return;
			}

			// Check if variant selector already exists
			if ($card.find('.mase-variant-selector').length > 0) {
				return;
			}

			// Create variant selector
			const $variantSelector = createVariantSelector(templateId, themeVariants[templateId]);
			
			// Insert after template info or at the end of card content
			const $insertPoint = $card.find('.mase-template-info');
			if ($insertPoint.length > 0) {
				$insertPoint.after($variantSelector);
			} else {
				$card.find('.mase-template-content').append($variantSelector);
			}
		});

		// Bind variant selection events
		bindVariantEvents();
	}

	/**
	 * Create variant selector HTML
	 */
	function createVariantSelector(themeId, variants) {
		const $selector = $('<div>', {
			class: 'mase-variant-selector',
			'data-theme': themeId
		});

		const $label = $('<div>', {
			class: 'mase-variant-label',
			text: 'Color Variant:'
		});

		const $swatches = $('<div>', {
			class: 'mase-variant-swatches'
		});

		// Get current variant from settings or default to first variant
		const currentVariant = getMASESettings().templates?.variants?.[themeId] || variants[0].id;

		// Create color swatches
		variants.forEach(variant => {
			const $swatch = $('<button>', {
				type: 'button',
				class: 'mase-variant-swatch' + (variant.id === currentVariant ? ' active' : ''),
				'data-variant': variant.id,
				'data-theme': themeId,
				'aria-label': variant.name + ' variant',
				title: variant.name
			});

			$swatch.css('background-color', variant.color);

			// Add checkmark for active variant
			if (variant.id === currentVariant) {
				$swatch.append('<span class="dashicons dashicons-yes" aria-hidden="true"></span>');
			}

			$swatches.append($swatch);
		});

		$selector.append($label).append($swatches);

		return $selector;
	}

	/**
	 * Bind variant selection events
	 */
	function bindVariantEvents() {
		$(document).on('click', '.mase-variant-swatch', function(e) {
			e.preventDefault();
			e.stopPropagation();

			const $swatch = $(this);
			const themeId = $swatch.data('theme');
			const variantId = $swatch.data('variant');

			// Update active state
			$swatch.siblings().removeClass('active').find('.dashicons').remove();
			$swatch.addClass('active').append('<span class="dashicons dashicons-yes" aria-hidden="true"></span>');

			// Apply variant
			applyVariant(themeId, variantId);

			// Show preview if available
			showVariantPreview(themeId, variantId);
		});

		// Variant preview on hover
		$(document).on('mouseenter', '.mase-variant-swatch', function() {
			const $swatch = $(this);
			const themeId = $swatch.data('theme');
			const variantId = $swatch.data('variant');
			const variantName = $swatch.attr('title');

			// Show tooltip
			showVariantTooltip($swatch, variantName);
		});

		$(document).on('mouseleave', '.mase-variant-swatch', function() {
			hideVariantTooltip();
		});
	}

	/**
	 * Apply variant to theme
	 */
	function applyVariant(themeId, variantId) {
		// Update data attribute on body/root
		$('body').attr('data-variant', variantId);
		$('html').attr('data-variant', variantId);

		// Save variant preference
		saveVariantPreference(themeId, variantId);

		// Trigger custom event
		$(document).trigger('mase:variantChanged', { theme: themeId, variant: variantId });
	}

	/**
	 * Save variant preference to WordPress options
	 */
	function saveVariantPreference(themeId, variantId) {
		if (typeof maseAdmin === 'undefined' || !maseAdmin.ajaxurl) {
			console.error('MASE Admin object not found');
			return;
		}

		const data = {
			action: 'mase_save_variant',
			nonce: maseAdmin.nonce,
			theme: themeId,
			variant: variantId
		};

		$.ajax({
			url: maseAdmin.ajaxurl,
			type: 'POST',
			data: data,
			success: function(response) {
				if (response.success) {
					console.log('Variant saved:', themeId, variantId);
				} else {
					console.error('Failed to save variant:', response.data);
				}
			},
			error: function(xhr, status, error) {
				console.error('AJAX error saving variant:', error);
			}
		});
	}

	/**
	 * Show variant preview
	 */
	function showVariantPreview(themeId, variantId) {
		// This would integrate with the preview modal system
		// For now, just apply the variant to the current view
		console.log('Preview variant:', themeId, variantId);
	}

	/**
	 * Show variant tooltip
	 */
	function showVariantTooltip($element, text) {
		const $tooltip = $('<div>', {
			class: 'mase-variant-tooltip',
			text: text
		});

		$('body').append($tooltip);

		// Position tooltip
		const offset = $element.offset();
		const swatchWidth = $element.outerWidth();
		const tooltipWidth = $tooltip.outerWidth();

		$tooltip.css({
			top: offset.top - $tooltip.outerHeight() - 8,
			left: offset.left + (swatchWidth / 2) - (tooltipWidth / 2)
		});

		$tooltip.fadeIn(150);
	}

	/**
	 * Hide variant tooltip
	 */
	function hideVariantTooltip() {
		$('.mase-variant-tooltip').fadeOut(150, function() {
			$(this).remove();
		});
	}

	/**
	 * Get MASE settings from hidden input or global
	 */
	function getMASESettings() {
		if (typeof maseSettings !== 'undefined') {
			return maseSettings;
		}

		// Try to parse from hidden input
		const $settingsInput = $('input[name="mase_settings"]');
		if ($settingsInput.length > 0) {
			try {
				return JSON.parse($settingsInput.val());
			} catch (e) {
				console.error('Failed to parse MASE settings:', e);
			}
		}

		return {};
	}

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function() {
		initVariantSelectors();

		// Re-initialize when templates tab is shown
		$(document).on('mase:tabChanged', function(e, tabId) {
			if (tabId === 'templates') {
				setTimeout(initVariantSelectors, 100);
			}
		});
	});

})(jQuery);
