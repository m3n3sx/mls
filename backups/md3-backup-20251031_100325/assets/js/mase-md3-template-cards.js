/**
 * Material Design 3 Template Cards
 * 
 * Handles dynamic color application for template card gradients
 * based on template-specific colors.
 * 
 * Requirements: 23.4 (Theme-specific colors for previews)
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function($) {
	'use strict';

	/**
	 * Initialize template card colors
	 */
	function initTemplateCardColors() {
		$('.mase-template-card[data-template-primary]').each(function() {
			const $card = $(this);
			const primaryColor = $card.data('template-primary');
			const secondaryColor = $card.data('template-secondary');
			
			// Set CSS custom properties for this card
			if (primaryColor) {
				$card.css('--template-primary', primaryColor);
			}
			if (secondaryColor) {
				$card.css('--template-secondary', secondaryColor);
			}
		});
	}

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function() {
		initTemplateCardColors();
		
		// Re-initialize when templates are dynamically loaded
		$(document).on('mase:templates-loaded', function() {
			initTemplateCardColors();
		});
	});

})(jQuery);
