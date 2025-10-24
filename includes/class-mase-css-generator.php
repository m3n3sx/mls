<?php
/**
 * MASE CSS Generator Class
 *
 * Generates and minifies CSS from settings for WordPress admin styling.
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class MASE_CSS_Generator
 *
 * Generates CSS from settings with minification support.
 * Optimized for <100ms generation time using string concatenation.
 */
class MASE_CSS_Generator {

	/**
	 * Generate CSS from settings.
	 *
	 * @param array $settings Settings array containing admin_bar and admin_menu configuration.
	 * @return string Generated CSS string.
	 */
	public function generate( $settings ) {
		// Start performance monitoring.
		$start_time = microtime( true );

		try {
			$css = '';

			// NEW: Generate Google Fonts @import (Requirement 8.5).
			$css .= $this->generate_google_fonts_import( $settings );

			// Generate palette CSS variables (Requirement 4.3).
			$css .= $this->generate_palette_css( $settings );

			// Generate admin bar CSS.
			$css .= $this->generate_admin_bar_css( $settings );

			// Generate floating layout fixes (Requirements 13.1, 13.2, 13.3).
			$css .= $this->generate_floating_layout_fixes( $settings );

			// Generate admin bar submenu CSS (Requirement 6.1, 6.2, 6.3).
			$css .= $this->generate_submenu_css( $settings );

			// Generate admin menu CSS.
			$css .= $this->generate_admin_menu_css( $settings );

			// Generate typography CSS (Requirement 6.1, 6.2, 6.3, 6.4, 6.5).
			$css .= $this->generate_typography_css( $settings );

			// Generate glassmorphism CSS (Requirement 5.1).
			$css .= $this->generate_glassmorphism_css( $settings );

			// Generate floating elements CSS (Requirement 5.2).
			$css .= $this->generate_floating_elements_css( $settings );

			// Generate shadows CSS (Requirement 5.3, 5.4).
			$css .= $this->generate_shadows_css( $settings );

			// Generate animations CSS (Requirement 5.5).
			$css .= $this->generate_animations_css( $settings );

			// Generate visual effects CSS.
			$css .= $this->generate_visual_effects_css( $settings );

			// Generate spacing CSS.
			$css .= $this->generate_spacing_css( $settings );

			// Generate mobile CSS (Requirement 7.1, 7.2, 7.3, 7.4, 7.5).
			$css .= $this->generate_mobile_css( $settings );

			// Generate custom CSS (Requirement 14.1).
			$css .= $this->generate_custom_css( $settings );

			// Performance monitoring.
			$duration = ( microtime( true ) - $start_time ) * 1000; // Convert to milliseconds.
			if ( $duration > 10 ) {
				error_log( sprintf( 'MASE: Total CSS generation took %.2fms (threshold: 10ms)', $duration ) );
			}

			return $css;

		} catch ( Exception $e ) {
			// Log the error.
			error_log( sprintf( 'MASE: CSS generation failed: %s', $e->getMessage() ) );

			// Attempt to return cached CSS on error.
			$cache = new MASE_Cache();
			$cached_css = $cache->get_cached_css();

			if ( false !== $cached_css ) {
				error_log( 'MASE: Returning cached CSS due to generation error' );
				return $cached_css;
			}

			// Return empty string as graceful degradation.
			return '';
		}
	}

	/**
	 * Generate admin bar CSS.
	 *
	 * @param array $settings Settings array.
	 * @return string Admin bar CSS.
	 */
	private function generate_admin_bar_css( $settings ) {
		try {
			$admin_bar = isset( $settings['admin_bar'] ) ? $settings['admin_bar'] : array();

			$bg_color   = isset( $admin_bar['bg_color'] ) ? $admin_bar['bg_color'] : '#23282d';
			$text_color = isset( $admin_bar['text_color'] ) ? $admin_bar['text_color'] : '#ffffff';
			$height     = isset( $admin_bar['height'] ) ? absint( $admin_bar['height'] ) : 32;
			$bg_type    = isset( $admin_bar['bg_type'] ) ? $admin_bar['bg_type'] : 'solid';

			$css = '';

			// Admin bar background, height, and flexbox alignment (Requirements 1.1, 1.2, 1.3, 5.1, 5.2, 5.3).
			$css .= 'body.wp-admin #wpadminbar {';
			
			// Apply background based on type (Requirement 5.5).
			if ( $bg_type === 'gradient' ) {
				$css .= $this->generate_gradient_background( $admin_bar );
			} else {
				$css .= 'background-color: ' . $bg_color . ' !important;';
			}
			
			$css .= 'height: ' . $height . 'px !important;';
			// Add flexbox for vertical alignment of text and icons.
			$css .= 'display: flex !important;';
			$css .= 'align-items: center !important;';
			$css .= '}';

			// CRITICAL: Fix #wp-toolbar to match admin bar height and alignment
			// justify-content: space-between pushes left items to left, right items to right
			$css .= 'body.wp-admin #wpadminbar #wp-toolbar {';
			$css .= 'height: ' . $height . 'px !important;';
			$css .= 'width: 100% !important;';
			$css .= 'display: flex !important;';
			$css .= 'align-items: center !important;';
			$css .= 'justify-content: space-between !important;';
			$css .= '}';

			// Ensure admin bar items maintain flexbox alignment (Requirements 3.1, 3.2, 3.3).
			$css .= 'body.wp-admin #wpadminbar .ab-item,';
			$css .= 'body.wp-admin #wpadminbar a.ab-item {';
			$css .= 'display: flex !important;';
			$css .= 'align-items: center !important;';
			$css .= 'height: 100% !important;';
			$css .= '}';

			// Ensure icons align with text on same baseline (Requirements 1.1, 1.2, 1.3).
			$css .= 'body.wp-admin #wpadminbar .ab-icon,';
			$css .= 'body.wp-admin #wpadminbar .dashicons {';
			$css .= 'display: inline-flex !important;';
			$css .= 'align-items: center !important;';
			$css .= 'vertical-align: middle !important;';
			$css .= '}';

			// Admin bar text color.
			$css .= 'body.wp-admin #wpadminbar .ab-item,';
			$css .= 'body.wp-admin #wpadminbar a.ab-item,';
			$css .= 'body.wp-admin #wpadminbar > #wp-toolbar span.ab-label,';
			$css .= 'body.wp-admin #wpadminbar > #wp-toolbar span.noticon {';
			$css .= 'color: ' . $text_color . ' !important;';
			$css .= '}';

			// Icon color synchronization (Requirements 2.1, 2.2).
			$css .= $this->generate_icon_color_css( $admin_bar );

			// Width (Requirements 11.1, 11.2).
			$css .= $this->generate_width_css( $admin_bar );

			// Border radius (Requirements 9.1, 9.2).
			$css .= $this->generate_border_radius_css( $admin_bar );

			// Shadow (Requirements 10.1, 10.2, 10.3).
			$css .= $this->generate_shadow_css( $admin_bar );

			// Floating margins (Requirements 12.1, 12.2).
			$css .= $this->generate_floating_css( $admin_bar, $settings );

			// Adjust page margin for admin bar height - only if height is different from default
			if ( $height !== 32 ) {
				$css .= 'body.wp-admin.admin-bar {';
				$css .= 'margin-top: ' . $height . 'px !important;';
				$css .= '}';
			}

			// Adjust admin bar submenu position.
			$css .= 'body.wp-admin #wpadminbar .ab-sub-wrapper {';
			$css .= 'top: ' . $height . 'px !important;';
			$css .= '}';

			// CRITICAL FIX: WordPress admin bar specific elements
			// Fix for user profile menu and other admin bar items
			$css .= 'body.wp-admin #wpadminbar #wp-admin-bar-my-account,';
			$css .= 'body.wp-admin #wpadminbar #wp-admin-bar-my-account > .ab-item {';
			$css .= 'display: flex !important;';
			$css .= 'align-items: center !important;';
			$css .= 'height: ' . $height . 'px !important;';
			$css .= '}';

			// Fix for top-secondary (right side) items
			$css .= 'body.wp-admin #wpadminbar #wp-admin-bar-top-secondary {';
			$css .= 'display: flex !important;';
			$css .= 'align-items: center !important;';
			$css .= 'height: ' . $height . 'px !important;';
			$css .= '}';

			// Fix for all top-level menu items
			$css .= 'body.wp-admin #wpadminbar .ab-top-menu > li,';
			$css .= 'body.wp-admin #wpadminbar .ab-top-menu > li > .ab-item {';
			$css .= 'display: flex !important;';
			$css .= 'align-items: center !important;';
			$css .= 'height: ' . $height . 'px !important;';
			$css .= '}';

			// Fix for user avatar
			$css .= 'body.wp-admin #wpadminbar .avatar {';
			$css .= 'display: inline-flex !important;';
			$css .= 'align-items: center !important;';
			$css .= 'vertical-align: middle !important;';
			$css .= '}';

			// Fix for display name
			$css .= 'body.wp-admin #wpadminbar .display-name {';
			$css .= 'display: inline-flex !important;';
			$css .= 'align-items: center !important;';
			$css .= 'height: auto !important;';
			$css .= 'line-height: normal !important;';
			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Admin bar CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate gradient background CSS for admin bar.
	 * Supports linear, radial, and conic gradients (Requirements 5.1, 5.2, 5.3).
	 *
	 * @param array $admin_bar Admin bar settings array.
	 * @return string Gradient background CSS.
	 */
	private function generate_gradient_background( $admin_bar ) {
		try {
			$gradient_type = isset( $admin_bar['gradient_type'] ) ? $admin_bar['gradient_type'] : 'linear';
			$gradient_angle = isset( $admin_bar['gradient_angle'] ) ? absint( $admin_bar['gradient_angle'] ) : 90;
			$gradient_colors = isset( $admin_bar['gradient_colors'] ) ? $admin_bar['gradient_colors'] : array();

			// Ensure we have at least 2 color stops.
			if ( count( $gradient_colors ) < 2 ) {
				$gradient_colors = array(
					array( 'color' => '#23282d', 'position' => 0 ),
					array( 'color' => '#32373c', 'position' => 100 ),
				);
			}

			// Build color stops string.
			$color_stops = array();
			foreach ( $gradient_colors as $stop ) {
				$color = isset( $stop['color'] ) ? $stop['color'] : '#23282d';
				$position = isset( $stop['position'] ) ? absint( $stop['position'] ) : 0;
				$color_stops[] = $color . ' ' . $position . '%';
			}
			$color_stops_str = implode( ', ', $color_stops );

			$css = '';

			// Generate gradient based on type (Requirements 5.1, 5.2).
			switch ( $gradient_type ) {
				case 'linear':
					$css .= 'background: linear-gradient(' . $gradient_angle . 'deg, ' . $color_stops_str . ') !important;';
					break;

				case 'radial':
					$css .= 'background: radial-gradient(circle, ' . $color_stops_str . ') !important;';
					break;

				case 'conic':
					$css .= 'background: conic-gradient(from ' . $gradient_angle . 'deg, ' . $color_stops_str . ') !important;';
					break;

				default:
					// Fallback to linear gradient.
					$css .= 'background: linear-gradient(' . $gradient_angle . 'deg, ' . $color_stops_str . ') !important;';
					break;
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Gradient background CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate icon color CSS for admin bar.
	 * Synchronizes icon colors with text color (Requirements 2.1, 2.2).
	 *
	 * @param array $admin_bar Admin bar settings array.
	 * @return string Icon color CSS.
	 */
	private function generate_icon_color_css( $admin_bar ) {
		try {
			$text_color = isset( $admin_bar['text_color'] ) ? $admin_bar['text_color'] : '#ffffff';
			$hover_color = isset( $admin_bar['hover_color'] ) ? $admin_bar['hover_color'] : '#00b9eb';

			$css = '';

			// Apply text color to all icon types (Requirement 2.1).
			// Target dashicons, SVG elements, and icon containers.
			$css .= 'body.wp-admin #wpadminbar .ab-icon,';
			$css .= 'body.wp-admin #wpadminbar .dashicons,';
			$css .= 'body.wp-admin #wpadminbar .ab-icon:before,';
			$css .= 'body.wp-admin #wpadminbar .dashicons-before:before {';
			$css .= 'color: ' . $text_color . ' !important;';
			$css .= '}';

			// Apply color to SVG elements (Requirement 2.1).
			$css .= 'body.wp-admin #wpadminbar svg,';
			$css .= 'body.wp-admin #wpadminbar .ab-icon svg {';
			$css .= 'fill: ' . $text_color . ' !important;';
			$css .= '}';

			// Apply color to SVG paths and shapes.
			$css .= 'body.wp-admin #wpadminbar svg path,';
			$css .= 'body.wp-admin #wpadminbar svg circle,';
			$css .= 'body.wp-admin #wpadminbar svg rect,';
			$css .= 'body.wp-admin #wpadminbar svg polygon {';
			$css .= 'fill: ' . $text_color . ' !important;';
			$css .= '}';

			// Apply color to SVG strokes.
			$css .= 'body.wp-admin #wpadminbar svg[stroke],';
			$css .= 'body.wp-admin #wpadminbar svg path[stroke] {';
			$css .= 'stroke: ' . $text_color . ' !important;';
			$css .= '}';

			// Hover states for icons (Requirement 2.2).
			$css .= 'body.wp-admin #wpadminbar .ab-item:hover .ab-icon,';
			$css .= 'body.wp-admin #wpadminbar .ab-item:hover .dashicons,';
			$css .= 'body.wp-admin #wpadminbar .ab-item:hover .ab-icon:before,';
			$css .= 'body.wp-admin #wpadminbar .ab-item:hover .dashicons-before:before {';
			$css .= 'color: ' . $hover_color . ' !important;';
			$css .= '}';

			// Hover states for SVG elements.
			$css .= 'body.wp-admin #wpadminbar .ab-item:hover svg,';
			$css .= 'body.wp-admin #wpadminbar .ab-item:hover .ab-icon svg {';
			$css .= 'fill: ' . $hover_color . ' !important;';
			$css .= '}';

			$css .= 'body.wp-admin #wpadminbar .ab-item:hover svg path,';
			$css .= 'body.wp-admin #wpadminbar .ab-item:hover svg circle,';
			$css .= 'body.wp-admin #wpadminbar .ab-item:hover svg rect,';
			$css .= 'body.wp-admin #wpadminbar .ab-item:hover svg polygon {';
			$css .= 'fill: ' . $hover_color . ' !important;';
			$css .= '}';

			$css .= 'body.wp-admin #wpadminbar .ab-item:hover svg[stroke],';
			$css .= 'body.wp-admin #wpadminbar .ab-item:hover svg path[stroke] {';
			$css .= 'stroke: ' . $hover_color . ' !important;';
			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Icon color CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate border radius CSS for admin bar.
	 * Handles both uniform and individual corner radius modes (Requirements 9.1, 9.2).
	 *
	 * @param array $admin_bar Admin bar settings array.
	 * @return string Border radius CSS.
	 */
	private function generate_border_radius_css( $admin_bar ) {
		try {
			$mode = isset( $admin_bar['border_radius_mode'] ) ? $admin_bar['border_radius_mode'] : 'uniform';
			$css = '';

			if ( $mode === 'individual' ) {
				// Individual corner radii (Requirement 9.2).
				$tl = isset( $admin_bar['border_radius_tl'] ) ? absint( $admin_bar['border_radius_tl'] ) : 0;
				$tr = isset( $admin_bar['border_radius_tr'] ) ? absint( $admin_bar['border_radius_tr'] ) : 0;
				$br = isset( $admin_bar['border_radius_br'] ) ? absint( $admin_bar['border_radius_br'] ) : 0;
				$bl = isset( $admin_bar['border_radius_bl'] ) ? absint( $admin_bar['border_radius_bl'] ) : 0;

				// Only generate CSS if at least one corner has a radius.
				if ( $tl > 0 || $tr > 0 || $br > 0 || $bl > 0 ) {
					$css .= 'body.wp-admin #wpadminbar {';
					$css .= sprintf(
						'border-radius: %dpx %dpx %dpx %dpx !important;',
						$tl,
						$tr,
						$br,
						$bl
					);
					$css .= '}';
				}
			} else {
				// Uniform border radius (Requirement 9.1).
				$radius = isset( $admin_bar['border_radius'] ) ? absint( $admin_bar['border_radius'] ) : 0;

				// Only generate CSS if radius is greater than 0.
				if ( $radius > 0 ) {
					$css .= 'body.wp-admin #wpadminbar {';
					$css .= 'border-radius: ' . $radius . 'px !important;';
					$css .= '}';
				}
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Border radius CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate shadow CSS for admin bar.
	 * Supports preset and custom shadow modes (Requirements 10.1, 10.2, 10.3).
	 *
	 * @param array $admin_bar Admin bar settings array.
	 * @return string Shadow CSS.
	 */
	private function generate_shadow_css( $admin_bar ) {
		try {
			$mode = isset( $admin_bar['shadow_mode'] ) ? $admin_bar['shadow_mode'] : 'preset';
			$css = '';

			if ( $mode === 'custom' ) {
				// Custom shadow with individual values (Requirement 10.2, 10.3).
				$h_offset = isset( $admin_bar['shadow_h_offset'] ) ? intval( $admin_bar['shadow_h_offset'] ) : 0;
				$v_offset = isset( $admin_bar['shadow_v_offset'] ) ? intval( $admin_bar['shadow_v_offset'] ) : 4;
				$blur = isset( $admin_bar['shadow_blur'] ) ? absint( $admin_bar['shadow_blur'] ) : 8;
				$spread = isset( $admin_bar['shadow_spread'] ) ? intval( $admin_bar['shadow_spread'] ) : 0;
				$color = isset( $admin_bar['shadow_color'] ) ? $admin_bar['shadow_color'] : '#000000';
				$opacity = isset( $admin_bar['shadow_opacity'] ) ? floatval( $admin_bar['shadow_opacity'] ) : 0.15;

				// Ensure opacity is within valid range (0-1).
				$opacity = max( 0, min( 1, $opacity ) );

				// Convert hex color to RGB and combine with opacity (Requirement 10.3).
				$rgb = $this->hex_to_rgb( $color );
				$shadow_color = sprintf( 'rgba(%d, %d, %d, %.2f)', $rgb['r'], $rgb['g'], $rgb['b'], $opacity );

				// Build custom shadow value.
				$shadow_value = sprintf(
					'%dpx %dpx %dpx %dpx %s',
					$h_offset,
					$v_offset,
					$blur,
					$spread,
					$shadow_color
				);

				$css .= 'body.wp-admin #wpadminbar {';
				$css .= 'box-shadow: ' . $shadow_value . ' !important;';
				$css .= '}';

			} else {
				// Preset shadow mode (Requirement 10.1).
				$preset = isset( $admin_bar['shadow_preset'] ) ? $admin_bar['shadow_preset'] : 'none';

				// Map presets to box-shadow values (Requirement 10.1).
				$shadow_presets = array(
					'none'     => 'none',
					'subtle'   => '0 2px 4px rgba(0, 0, 0, 0.1)',
					'medium'   => '0 4px 8px rgba(0, 0, 0, 0.15)',
					'strong'   => '0 8px 16px rgba(0, 0, 0, 0.2)',
					'dramatic' => '0 12px 24px rgba(0, 0, 0, 0.3)',
				);

				$shadow_value = isset( $shadow_presets[ $preset ] ) ? $shadow_presets[ $preset ] : 'none';

				// Only generate CSS if shadow is not 'none'.
				if ( $shadow_value !== 'none' ) {
					$css .= 'body.wp-admin #wpadminbar {';
					$css .= 'box-shadow: ' . $shadow_value . ' !important;';
					$css .= '}';
				}
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Shadow CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate width CSS for admin bar.
	 * Supports percentage and pixel widths with horizontal centering (Requirements 11.1, 11.2).
	 *
	 * @param array $admin_bar Admin bar settings array.
	 * @return string Width CSS.
	 */
	private function generate_width_css( $admin_bar ) {
		try {
			$width_unit = isset( $admin_bar['width_unit'] ) ? $admin_bar['width_unit'] : 'percent';
			$width_value = isset( $admin_bar['width_value'] ) ? absint( $admin_bar['width_value'] ) : 100;
			$css = '';

			// Only generate CSS if width is not 100% (default full width).
			if ( ! ( $width_unit === 'percent' && $width_value === 100 ) ) {
				$css .= 'body.wp-admin #wpadminbar {';
				
				// Apply width based on unit (Requirement 11.1, 11.2).
				if ( $width_unit === 'percent' ) {
					$css .= 'width: ' . $width_value . '% !important;';
				} else {
					// Pixels
					$css .= 'width: ' . $width_value . 'px !important;';
					$css .= 'max-width: 100% !important;'; // Prevent overflow on smaller screens
				}
				
				// Center admin bar horizontally when width < 100% (Requirement 11.2).
				$css .= 'left: 50% !important;';
				$css .= 'transform: translateX(-50%) !important;';
				$css .= 'right: auto !important;';
				
				$css .= '}';
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Width CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate floating margin CSS for admin bar.
	 * Handles both uniform and individual margin modes (Requirements 12.1, 12.2).
	 * Only applies when floating mode is enabled in visual_effects.
	 *
	 * @param array $admin_bar Admin bar settings array.
	 * @param array $settings Full settings array to check floating mode.
	 * @return string Floating margin CSS.
	 */
	private function generate_floating_css( $admin_bar, $settings ) {
		try {
			// Check if floating mode is enabled (Requirement 12.1).
			$floating_enabled = isset( $settings['visual_effects']['admin_bar']['floating'] ) ? 
				$settings['visual_effects']['admin_bar']['floating'] : false;

			// Only generate CSS if floating mode is enabled.
			if ( ! $floating_enabled ) {
				return '';
			}

			$mode = isset( $admin_bar['floating_margin_mode'] ) ? $admin_bar['floating_margin_mode'] : 'uniform';
			$css = '';

			$css .= 'body.wp-admin #wpadminbar {';
			$css .= 'position: fixed !important;';

			if ( $mode === 'individual' ) {
				// Individual margins (Requirement 12.2).
				$top = isset( $admin_bar['floating_margin_top'] ) ? absint( $admin_bar['floating_margin_top'] ) : 8;
				$right = isset( $admin_bar['floating_margin_right'] ) ? absint( $admin_bar['floating_margin_right'] ) : 8;
				$bottom = isset( $admin_bar['floating_margin_bottom'] ) ? absint( $admin_bar['floating_margin_bottom'] ) : 8;
				$left = isset( $admin_bar['floating_margin_left'] ) ? absint( $admin_bar['floating_margin_left'] ) : 8;

				$css .= sprintf(
					'top: %dpx !important; right: %dpx !important; bottom: auto !important; left: %dpx !important;',
					$top,
					$right,
					$left
				);
				
				// Calculate width accounting for left and right margins.
				$css .= sprintf( 'width: calc(100%% - %dpx) !important;', $left + $right );

			} else {
				// Uniform margin (Requirement 12.1).
				$margin = isset( $admin_bar['floating_margin'] ) ? absint( $admin_bar['floating_margin'] ) : 8;

				$css .= sprintf(
					'top: %dpx !important; right: %dpx !important; bottom: auto !important; left: %dpx !important;',
					$margin,
					$margin,
					$margin
				);
				
				// Calculate width accounting for margins on both sides.
				$css .= sprintf( 'width: calc(100%% - %dpx) !important;', $margin * 2 );
			}

			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Floating margin CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate floating layout fix CSS for admin bar.
	 * Prevents admin bar from overlapping side menu by applying padding-top to #adminmenuwrap.
	 * Requirements 13.1, 13.2, 13.3.
	 *
	 * @param array $settings Full settings array.
	 * @return string Floating layout fix CSS.
	 */
	private function generate_floating_layout_fixes( $settings ) {
		try {
			// Check if floating mode is enabled (Requirement 13.1).
			$floating_enabled = isset( $settings['visual_effects']['admin_bar']['floating'] ) ? 
				$settings['visual_effects']['admin_bar']['floating'] : false;

			// Only generate CSS if floating mode is enabled.
			if ( ! $floating_enabled ) {
				return '';
			}

			$admin_bar = isset( $settings['admin_bar'] ) ? $settings['admin_bar'] : array();
			
			// Get admin bar height (Requirement 13.2).
			$height = isset( $admin_bar['height'] ) ? absint( $admin_bar['height'] ) : 32;
			
			// Get floating margin mode and values (Requirement 13.2).
			$mode = isset( $admin_bar['floating_margin_mode'] ) ? $admin_bar['floating_margin_mode'] : 'uniform';
			
			// Calculate top margin based on mode.
			if ( $mode === 'individual' ) {
				$top_margin = isset( $admin_bar['floating_margin_top'] ) ? absint( $admin_bar['floating_margin_top'] ) : 8;
			} else {
				$top_margin = isset( $admin_bar['floating_margin'] ) ? absint( $admin_bar['floating_margin'] ) : 8;
			}
			
			// Calculate total offset (height + top margin) (Requirement 13.2).
			$total_offset = $height + $top_margin;
			
			$css = '';
			
			// Apply padding-top to side menu to prevent overlap (Requirement 13.3).
			$css .= 'body.wp-admin #adminmenuwrap {';
			$css .= 'padding-top: ' . $total_offset . 'px !important;';
			$css .= '}';
			
			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Floating layout fix CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Convert hex color to RGB array.
	 *
	 * @param string $hex Hex color code (with or without #).
	 * @return array RGB values array with keys 'r', 'g', 'b'.
	 */
	private function hex_to_rgb( $hex ) {
		// Remove # if present.
		$hex = ltrim( $hex, '#' );

		// Handle 3-character hex codes.
		if ( strlen( $hex ) === 3 ) {
			$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
		}

		// Convert to RGB.
		return array(
			'r' => hexdec( substr( $hex, 0, 2 ) ),
			'g' => hexdec( substr( $hex, 2, 2 ) ),
			'b' => hexdec( substr( $hex, 4, 2 ) ),
		);
	}

	/**
	 * Generate submenu CSS for admin bar.
	 * Applies background color, border radius, and spacing to submenus (Requirements 6.1, 6.2, 6.3).
	 *
	 * @param array $settings Settings array.
	 * @return string Submenu CSS.
	 */
	private function generate_submenu_css( $settings ) {
		try {
			$submenu = isset( $settings['admin_bar_submenu'] ) ? $settings['admin_bar_submenu'] : array();

			// Get submenu settings with defaults matching WordPress styles.
			$bg_color      = isset( $submenu['bg_color'] ) ? $submenu['bg_color'] : '#32373c';
			$border_radius = isset( $submenu['border_radius'] ) ? absint( $submenu['border_radius'] ) : 0;
			$spacing       = isset( $submenu['spacing'] ) ? absint( $submenu['spacing'] ) : 0;

			$css = '';

			// Target submenu wrapper and submenu elements (Requirement 6.1, 6.2, 6.3).
			$css .= 'body.wp-admin #wpadminbar .ab-sub-wrapper,';
			$css .= 'body.wp-admin #wpadminbar .ab-submenu {';
			
			// Apply background color (Requirement 6.1).
			$css .= 'background-color: ' . $bg_color . ' !important;';
			
			// Apply border radius (Requirement 6.2).
			if ( $border_radius > 0 ) {
				$css .= 'border-radius: ' . $border_radius . 'px !important;';
			}
			
			$css .= '}';

			// Apply spacing from admin bar (Requirement 6.3).
			if ( $spacing > 0 ) {
				$css .= 'body.wp-admin #wpadminbar .ab-sub-wrapper {';
				$css .= 'margin-top: ' . $spacing . 'px !important;';
				$css .= '}';
			}

			// Ensure submenu items inherit background.
			$css .= 'body.wp-admin #wpadminbar .ab-submenu .ab-item {';
			$css .= 'background-color: transparent !important;';
			$css .= '}';

			// Submenu item hover state.
			$css .= 'body.wp-admin #wpadminbar .ab-submenu .ab-item:hover {';
			$css .= 'background-color: rgba(255, 255, 255, 0.1) !important;';
			$css .= '}';

			// NEW: Submenu typography (Requirement 7.1, 7.2, 7.3, 7.4, 7.5, 8.5).
			$css .= 'body.wp-admin #wpadminbar .ab-submenu .ab-item,';
			$css .= 'body.wp-admin #wpadminbar .ab-submenu a.ab-item {';
			
			if ( isset( $submenu['font_size'] ) ) {
				$css .= 'font-size: ' . absint( $submenu['font_size'] ) . 'px !important;';
			}
			if ( isset( $submenu['text_color'] ) ) {
				$css .= 'color: ' . esc_attr( $submenu['text_color'] ) . ' !important;';
			}
			if ( isset( $submenu['line_height'] ) ) {
				$css .= 'line-height: ' . floatval( $submenu['line_height'] ) . ' !important;';
			}
			if ( isset( $submenu['letter_spacing'] ) ) {
				$css .= 'letter-spacing: ' . intval( $submenu['letter_spacing'] ) . 'px !important;';
			}
			if ( isset( $submenu['text_transform'] ) ) {
				$css .= 'text-transform: ' . esc_attr( $submenu['text_transform'] ) . ' !important;';
			}
			// Font family support (Requirement 8.5).
			if ( isset( $submenu['font_family'] ) && $submenu['font_family'] !== 'system' ) {
				$font_family = $this->get_font_family_css( $submenu['font_family'] );
				if ( $font_family ) {
					$css .= 'font-family: ' . $font_family . ' !important;';
				}
			}
			
			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Submenu CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate admin menu CSS.
	 *
	 * @param array $settings Settings array.
	 * @return string Admin menu CSS.
	 */
	private function generate_admin_menu_css( $settings ) {
		try {
			$admin_menu = isset( $settings['admin_menu'] ) ? $settings['admin_menu'] : array();

			$bg_color         = isset( $admin_menu['bg_color'] ) ? $admin_menu['bg_color'] : '#23282d';
			$text_color       = isset( $admin_menu['text_color'] ) ? $admin_menu['text_color'] : '#ffffff';
			$hover_bg_color   = isset( $admin_menu['hover_bg_color'] ) ? $admin_menu['hover_bg_color'] : '#191e23';
			$hover_text_color = isset( $admin_menu['hover_text_color'] ) ? $admin_menu['hover_text_color'] : '#00b9eb';
			$width            = isset( $admin_menu['width'] ) ? absint( $admin_menu['width'] ) : 160;
			$height_mode      = isset( $admin_menu['height_mode'] ) ? $admin_menu['height_mode'] : 'full';
			$bg_type          = isset( $admin_menu['bg_type'] ) ? $admin_menu['bg_type'] : 'solid';

			$css = '';

			// Admin menu background (solid or gradient) (Requirements 6.1, 6.2, 6.4).
			$css .= 'body.wp-admin #adminmenu,';
			$css .= 'body.wp-admin #adminmenuback,';
			$css .= 'body.wp-admin #adminmenuwrap {';
			
			// Apply background based on type (Requirement 6.5).
			if ( $bg_type === 'gradient' ) {
				$css .= $this->generate_gradient_background_menu( $admin_menu );
			} else {
				$css .= 'background-color: ' . $bg_color . ' !important;';
			}
			
			// Apply border radius (Requirements 12.1, 12.2, 12.3).
			$css .= $this->generate_menu_border_radius_css( $admin_menu );
			
			$css .= '}';
			
			// Generate shadow CSS (Requirements 13.1, 13.2, 13.3).
			$css .= $this->generate_menu_shadow_css( $admin_menu );
			
			// Generate floating margin CSS (Requirements 15.1, 15.2, 15.3).
			$css .= $this->generate_menu_floating_css( $admin_menu, $settings );
			
			// Generate Height Mode CSS (Requirement 4.4).
			$css .= $this->generate_height_mode_css( $admin_menu );
			
			// Generate width CSS with unit support (Requirements 14.1, 14.2, 14.3, 14.5).
			$css .= $this->generate_menu_width_css( $admin_menu );
			
			// Fix folded menu icons and submenu positioning
			// Ensure icons are visible and centered in folded mode
			$css .= 'body.wp-admin.folded #adminmenu .wp-menu-image {';
			$css .= 'width: 36px !important;';
			$css .= 'height: 34px !important;';
			$css .= 'display: flex !important;';
			$css .= 'align-items: center !important;';
			$css .= 'justify-content: center !important;';
			$css .= 'overflow: hidden !important;';
			$css .= '}';
			
			// Fix folded menu icon dashicons - smaller size to fit in 36px
			$css .= 'body.wp-admin.folded #adminmenu .wp-menu-image:before {';
			$css .= 'padding: 0 !important;';
			$css .= 'margin: 0 !important;';
			$css .= 'width: 18px !important;';
			$css .= 'height: 18px !important;';
			$css .= 'font-size: 18px !important;';
			$css .= 'line-height: 1 !important;';
			$css .= 'display: block !important;';
			$css .= '}';
			
			// Fix folded menu item height
			$css .= 'body.wp-admin.folded #adminmenu li.menu-top {';
			$css .= 'height: 34px !important;';
			$css .= 'min-height: 34px !important;';
			$css .= '}';
			
			// Fix folded menu link padding
			$css .= 'body.wp-admin.folded #adminmenu .wp-menu-image img {';
			$css .= 'width: 18px !important;';
			$css .= 'height: 18px !important;';
			$css .= 'padding: 0 !important;';
			$css .= '}';
			
			// Fix folded menu submenu positioning
			// Submenu should appear to the right of the collapsed menu
			$css .= 'body.wp-admin.folded #adminmenu .wp-submenu {';
			$css .= 'position: absolute !important;';
			$css .= 'left: 36px !important;';
			$css .= 'top: 0 !important;';
			$css .= 'margin: 0 !important;';
			$css .= 'padding: 0 !important;';
			$css .= 'min-width: 160px !important;';
			$css .= 'z-index: 9999 !important;';
			$css .= '}';
			
			// Fix folded menu submenu background
			$css .= 'body.wp-admin.folded #adminmenu .wp-submenu {';
			$css .= 'background-color: ' . $bg_color . ' !important;';
			$css .= 'box-shadow: 2px 2px 5px rgba(0,0,0,0.1) !important;';
			$css .= '}';
			
			// Hide menu text in folded mode
			$css .= 'body.wp-admin.folded #adminmenu .wp-menu-name {';
			$css .= 'display: none !important;';
			$css .= '}';

			// Admin menu text color.
			$css .= 'body.wp-admin #adminmenu a,';
			$css .= 'body.wp-admin #adminmenu div.wp-menu-name {';
			$css .= 'color: ' . $text_color . ' !important;';
			$css .= '}';

			// Admin menu hover states.
			$css .= 'body.wp-admin #adminmenu li.menu-top:hover,';
			$css .= 'body.wp-admin #adminmenu li.opensub > a.menu-top,';
			$css .= 'body.wp-admin #adminmenu li > a.menu-top:focus {';
			$css .= 'background-color: ' . $hover_bg_color . ' !important;';
			$css .= '}';

			$css .= 'body.wp-admin #adminmenu li.menu-top:hover a,';
			$css .= 'body.wp-admin #adminmenu li.opensub > a.menu-top,';
			$css .= 'body.wp-admin #adminmenu li > a.menu-top:focus {';
			$css .= 'color: ' . $hover_text_color . ' !important;';
			$css .= '}';

			// Generate menu item padding CSS (Requirement 1.1, 1.4, 1.5).
			$css .= $this->generate_menu_item_padding_css( $admin_menu );

			// Generate icon color CSS (Requirement 2.1, 2.2).
			$css .= $this->generate_menu_icon_color_css( $admin_menu );

			// Generate submenu positioning CSS (Requirements 3.1, 3.2, 3.3, 3.4).
			$css .= $this->generate_submenu_positioning_css( $admin_menu, $settings );

			// Generate submenu CSS (Requirements 7.1, 7.3, 8.1, 10.1, 10.2, 10.3, 10.4, 10.5).
			$css .= $this->generate_menu_submenu_css( $settings );

			// Generate logo CSS (Requirements 16.2, 16.3, 16.4, 16.8).
			$css .= $this->generate_menu_logo_css( $admin_menu );

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Admin menu CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate menu item padding CSS.
	 * Applies vertical and horizontal padding to menu items (Requirement 1.1, 1.4, 1.5).
	 *
	 * @param array $admin_menu Admin menu settings array.
	 * @return string Menu item padding CSS.
	 */
	private function generate_menu_item_padding_css( $admin_menu ) {
		try {
			$v_padding = isset( $admin_menu['padding_vertical'] ) ? absint( $admin_menu['padding_vertical'] ) : 10;
			$h_padding = isset( $admin_menu['padding_horizontal'] ) ? absint( $admin_menu['padding_horizontal'] ) : 15;

			$css = '';

			// Apply padding to menu items (Requirement 1.1, 1.5).
			$css .= 'body.wp-admin #adminmenu li.menu-top > a {';
			$css .= 'padding: ' . $v_padding . 'px ' . $h_padding . 'px !important;';
			$css .= '}';

			// Also apply to submenu items for consistency.
			$css .= 'body.wp-admin #adminmenu .wp-submenu a {';
			$css .= 'padding: ' . $v_padding . 'px ' . $h_padding . 'px !important;';
			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Menu item padding CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate menu icon color CSS.
	 * Synchronizes icon colors with text color in auto mode or applies custom color (Requirements 2.1, 2.2).
	 *
	 * @param array $admin_menu Admin menu settings array.
	 * @return string Menu icon color CSS.
	 */
	private function generate_menu_icon_color_css( $admin_menu ) {
		try {
			$mode = isset( $admin_menu['icon_color_mode'] ) ? $admin_menu['icon_color_mode'] : 'auto';
			$text_color = isset( $admin_menu['text_color'] ) ? $admin_menu['text_color'] : '#ffffff';
			$hover_text_color = isset( $admin_menu['hover_text_color'] ) ? $admin_menu['hover_text_color'] : '#00b9eb';

			$css = '';

			// Determine icon color based on mode (Requirement 2.1, 2.2).
			if ( $mode === 'auto' ) {
				// Auto mode: sync icon color with text color (Requirement 2.1).
				$icon_color = $text_color;
			} else {
				// Custom mode: use custom icon color (Requirement 2.2).
				$icon_color = isset( $admin_menu['icon_color'] ) ? $admin_menu['icon_color'] : '#ffffff';
			}

			// Apply icon color to all icon types (Requirement 2.1, 2.2).
			$css .= 'body.wp-admin #adminmenu .wp-menu-image,';
			$css .= 'body.wp-admin #adminmenu .wp-menu-image:before,';
			$css .= 'body.wp-admin #adminmenu .dashicons,';
			$css .= 'body.wp-admin #adminmenu .dashicons-before:before {';
			$css .= 'color: ' . $icon_color . ' !important;';
			$css .= '}';

			// Apply color to SVG elements (Requirement 2.1, 2.2).
			$css .= 'body.wp-admin #adminmenu .wp-menu-image svg,';
			$css .= 'body.wp-admin #adminmenu .wp-menu-image img {';
			$css .= 'fill: ' . $icon_color . ' !important;';
			$css .= '}';

			// Hover states for icons (Requirement 2.2).
			// In auto mode, icons follow hover text color; in custom mode, they keep custom color.
			if ( $mode === 'auto' ) {
				$hover_icon_color = $hover_text_color;
			} else {
				// In custom mode, icons maintain their custom color on hover.
				$hover_icon_color = $icon_color;
			}

			$css .= 'body.wp-admin #adminmenu li.menu-top:hover .wp-menu-image,';
			$css .= 'body.wp-admin #adminmenu li.menu-top:hover .wp-menu-image:before,';
			$css .= 'body.wp-admin #adminmenu li.menu-top:hover .dashicons,';
			$css .= 'body.wp-admin #adminmenu li.menu-top:hover .dashicons-before:before,';
			$css .= 'body.wp-admin #adminmenu li.opensub > a.menu-top .wp-menu-image,';
			$css .= 'body.wp-admin #adminmenu li.opensub > a.menu-top .wp-menu-image:before,';
			$css .= 'body.wp-admin #adminmenu li.opensub > a.menu-top .dashicons,';
			$css .= 'body.wp-admin #adminmenu li > a.menu-top:focus .wp-menu-image,';
			$css .= 'body.wp-admin #adminmenu li > a.menu-top:focus .wp-menu-image:before,';
			$css .= 'body.wp-admin #adminmenu li > a.menu-top:focus .dashicons {';
			$css .= 'color: ' . $hover_icon_color . ' !important;';
			$css .= '}';

			// Hover states for SVG elements.
			$css .= 'body.wp-admin #adminmenu li.menu-top:hover .wp-menu-image svg,';
			$css .= 'body.wp-admin #adminmenu li.menu-top:hover .wp-menu-image img,';
			$css .= 'body.wp-admin #adminmenu li.opensub > a.menu-top .wp-menu-image svg,';
			$css .= 'body.wp-admin #adminmenu li.opensub > a.menu-top .wp-menu-image img,';
			$css .= 'body.wp-admin #adminmenu li > a.menu-top:focus .wp-menu-image svg,';
			$css .= 'body.wp-admin #adminmenu li > a.menu-top:focus .wp-menu-image img {';
			$css .= 'fill: ' . $hover_icon_color . ' !important;';
			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Menu icon color CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate Height Mode CSS for admin menu.
	 * Controls whether menu uses full height or fits to content (Requirement 4.4).
	 *
	 * @param array $admin_menu Admin menu settings array.
	 * @return string Height Mode CSS.
	 */
	private function generate_height_mode_css( $admin_menu ) {
		try {
			$height_mode = isset( $admin_menu['height_mode'] ) ? $admin_menu['height_mode'] : 'full';
			$css = '';

			if ( 'content' === $height_mode ) {
				// Target all menu wrapper elements with maximum specificity (Requirement 4.4).
				$css .= 'body.wp-admin #adminmenuwrap,';
				$css .= 'body.wp-admin #adminmenuback,';
				$css .= 'body.wp-admin #adminmenumain {';
				$css .= 'height: auto !important;';
				$css .= 'min-height: 0 !important;';  // Override WordPress default min-height: 100vh
				$css .= 'bottom: auto !important;';  // Override WordPress default bottom: -120px
				$css .= '}';
				
				// Ensure menu container fits content.
				$css .= 'body.wp-admin #adminmenu {';
				$css .= 'height: auto !important;';
				$css .= 'min-height: 0 !important;';
				$css .= 'position: relative !important;';
				$css .= 'bottom: auto !important;';  // Override WordPress default
				$css .= '}';
				
				// Allow natural height for menu items.
				$css .= 'body.wp-admin #adminmenu li.menu-top {';
				$css .= 'height: auto !important;';
				$css .= '}';
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Height Mode CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate submenu positioning CSS.
	 * Dynamically positions submenus based on menu width and spacing (Requirements 3.1, 3.2, 3.3, 3.4, 14.4).
	 *
	 * @param array $admin_menu Admin menu settings array.
	 * @param array $settings Full settings array to access submenu settings.
	 * @return string Submenu positioning CSS.
	 */
	private function generate_submenu_positioning_css( $admin_menu, $settings ) {
		try {
			// Get menu width with unit support (Requirement 3.1, 3.2, 14.4).
			$width_unit = isset( $admin_menu['width_unit'] ) ? $admin_menu['width_unit'] : 'pixels';
			$width_value = isset( $admin_menu['width_value'] ) ? absint( $admin_menu['width_value'] ) : 160;
			
			// Fallback to legacy 'width' field if new fields not set.
			if ( ! isset( $admin_menu['width_unit'] ) && isset( $admin_menu['width'] ) ) {
				$width_unit = 'pixels';
				$width_value = absint( $admin_menu['width'] );
			}
			
			// Determine width string based on unit (Requirement 14.4).
			$width_str = $width_unit === 'percent' ? $width_value . '%' : $width_value . 'px';

			// Get submenu spacing offset (Requirement 3.3).
			$spacing = 0;
			if ( isset( $settings['admin_menu_submenu']['spacing'] ) ) {
				$spacing = absint( $settings['admin_menu_submenu']['spacing'] );
			}

			$css = '';

			// Position submenus to the right of the menu at the menu width (Requirement 3.1, 3.2, 3.3, 14.4).
			// Only apply to expanded menu, not folded menu (folded menu has its own positioning).
			$css .= 'body.wp-admin:not(.folded) #adminmenu .wp-submenu {';
			$css .= 'left: ' . $width_str . ' !important;';
			
			// Apply vertical spacing offset if set (Requirement 3.4).
			if ( $spacing > 0 ) {
				$css .= 'top: ' . $spacing . 'px !important;';
			}
			
			$css .= '}';

			// Ensure submenu is positioned absolutely for proper placement.
			$css .= 'body.wp-admin:not(.folded) #adminmenu .wp-submenu {';
			$css .= 'position: absolute !important;';
			$css .= 'margin: 0 !important;';
			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Submenu positioning CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate menu width CSS.
	 * Supports both pixel and percentage units (Requirements 14.1, 14.2, 14.3).
	 *
	 * @param array $admin_menu Admin menu settings array.
	 * @return string Menu width CSS.
	 */
	private function generate_menu_width_css( $admin_menu ) {
		try {
			// Get width settings (Requirement 14.1, 14.2).
			$width_unit = isset( $admin_menu['width_unit'] ) ? $admin_menu['width_unit'] : 'pixels';
			$width_value = isset( $admin_menu['width_value'] ) ? absint( $admin_menu['width_value'] ) : 160;
			
			// Fallback to legacy 'width' field if new fields not set.
			if ( ! isset( $admin_menu['width_unit'] ) && isset( $admin_menu['width'] ) ) {
				$width_unit = 'pixels';
				$width_value = absint( $admin_menu['width'] );
			}

			$css = '';

			// Only generate CSS if width is not default (160px or 100%).
			$is_default = ( $width_unit === 'pixels' && $width_value === 160 ) || 
			              ( $width_unit === 'percent' && $width_value === 100 );

			if ( ! $is_default ) {
				// Determine width string based on unit (Requirement 14.1, 14.2).
				if ( $width_unit === 'percent' ) {
					$width_str = $width_value . '%';
				} else {
					$width_str = $width_value . 'px';
				}

				// Expanded menu width (Requirement 14.2).
				$css .= 'body.wp-admin:not(.folded) #adminmenu,';
				$css .= 'body.wp-admin:not(.folded) #adminmenuback,';
				$css .= 'body.wp-admin:not(.folded) #adminmenuwrap {';
				$css .= 'width: ' . $width_str . ' !important;';
				$css .= '}';
				
				// Folded menu width (always 36px when collapsed).
				$css .= 'body.wp-admin.folded #adminmenu,';
				$css .= 'body.wp-admin.folded #adminmenuback,';
				$css .= 'body.wp-admin.folded #adminmenuwrap {';
				$css .= 'width: 36px !important;';
				$css .= '}';
				
				// Adjust content area margin for custom menu width (Requirement 14.5).
				// For percentage widths, use calc() to handle dynamic sizing.
				if ( $width_unit === 'percent' ) {
					$css .= 'body.wp-admin:not(.folded) #wpcontent,';
					$css .= 'body.wp-admin:not(.folded) #wpfooter {';
					$css .= 'margin-left: ' . $width_str . ' !important;';
					$css .= '}';
				} else {
					$css .= 'body.wp-admin:not(.folded) #wpcontent,';
					$css .= 'body.wp-admin:not(.folded) #wpfooter {';
					$css .= 'margin-left: ' . $width_value . 'px !important;';
					$css .= '}';
				}
				
				// Adjust content area margin for folded menu.
				$css .= 'body.wp-admin.folded #wpcontent,';
				$css .= 'body.wp-admin.folded #wpfooter {';
				$css .= 'margin-left: 36px !important;';
				$css .= '}';
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Menu width CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate gradient background CSS for admin menu.
	 * Supports linear, radial, and conic gradients (Requirements 6.1, 6.2, 6.4).
	 *
	 * @param array $admin_menu Admin menu settings array.
	 * @return string Gradient background CSS.
	 */
	private function generate_gradient_background_menu( $admin_menu ) {
		try {
			$gradient_type = isset( $admin_menu['gradient_type'] ) ? $admin_menu['gradient_type'] : 'linear';
			$gradient_angle = isset( $admin_menu['gradient_angle'] ) ? absint( $admin_menu['gradient_angle'] ) : 90;
			$gradient_colors = isset( $admin_menu['gradient_colors'] ) ? $admin_menu['gradient_colors'] : array();

			// Ensure we have at least 2 color stops (Requirement 6.4).
			if ( count( $gradient_colors ) < 2 ) {
				$gradient_colors = array(
					array( 'color' => '#23282d', 'position' => 0 ),
					array( 'color' => '#32373c', 'position' => 100 ),
				);
			}

			// Build color stops string.
			$color_stops = array();
			foreach ( $gradient_colors as $stop ) {
				$color = isset( $stop['color'] ) ? $stop['color'] : '#23282d';
				$position = isset( $stop['position'] ) ? absint( $stop['position'] ) : 0;
				$color_stops[] = $color . ' ' . $position . '%';
			}
			$color_stops_str = implode( ', ', $color_stops );

			$css = '';

			// Generate gradient based on type (Requirements 6.1, 6.2).
			switch ( $gradient_type ) {
				case 'linear':
					$css .= 'background: linear-gradient(' . $gradient_angle . 'deg, ' . $color_stops_str . ') !important;';
					break;

				case 'radial':
					$css .= 'background: radial-gradient(circle, ' . $color_stops_str . ') !important;';
					break;

				case 'conic':
					$css .= 'background: conic-gradient(from ' . $gradient_angle . 'deg, ' . $color_stops_str . ') !important;';
					break;

				default:
					// Fallback to linear gradient.
					$css .= 'background: linear-gradient(' . $gradient_angle . 'deg, ' . $color_stops_str . ') !important;';
					break;
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Menu gradient background CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate comprehensive submenu CSS for admin menu.
	 * Combines background, border radius, and typography (Requirements 7.1, 7.3, 8.1, 10.1-10.5).
	 *
	 * @param array $settings Full settings array.
	 * @return string Submenu CSS.
	 */
	private function generate_menu_submenu_css( $settings ) {
		try {
			$submenu = isset( $settings['admin_menu_submenu'] ) ? $settings['admin_menu_submenu'] : array();

			// Get submenu background color with default matching WordPress styles (Requirement 7.1).
			$bg_color = isset( $submenu['bg_color'] ) ? $submenu['bg_color'] : '#32373c';

			$css = '';

			// Target submenu wrapper and submenu elements (Requirement 7.1, 7.3, 8.1).
			$css .= 'body.wp-admin #adminmenu .wp-submenu {';
			
			// Apply background color (Requirement 7.1, 7.3).
			$css .= 'background-color: ' . $bg_color . ' !important;';
			
			// Apply border radius (Requirement 8.1).
			$css .= $this->generate_submenu_border_radius_css( $submenu );
			
			$css .= '}';

			// Ensure submenu items inherit background.
			$css .= 'body.wp-admin #adminmenu .wp-submenu .wp-submenu-wrap {';
			$css .= 'background-color: ' . $bg_color . ' !important;';
			$css .= '}';

			// Submenu item hover state with semi-transparent overlay.
			$css .= 'body.wp-admin #adminmenu .wp-submenu a:hover,';
			$css .= 'body.wp-admin #adminmenu .wp-submenu a:focus {';
			$css .= 'background-color: rgba(255, 255, 255, 0.1) !important;';
			$css .= '}';

			// Generate submenu typography CSS (Requirements 10.1, 10.2, 10.3, 10.4, 10.5).
			$css .= $this->generate_menu_submenu_typography_css( $submenu );

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Menu submenu CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate submenu typography CSS for admin menu.
	 * Applies typography styles to submenu items (Requirements 10.1, 10.2, 10.3, 10.4, 10.5).
	 *
	 * @param array $submenu Submenu settings array.
	 * @return string Submenu typography CSS.
	 */
	private function generate_menu_submenu_typography_css( $submenu ) {
		try {
			$css = '';

			// Target submenu items (Requirements 10.1, 10.2, 10.3, 10.4, 10.5).
			$css .= 'body.wp-admin #adminmenu .wp-submenu a,';
			$css .= 'body.wp-admin #adminmenu .wp-submenu li {';

			// Font size (Requirement 10.1).
			if ( isset( $submenu['font_size'] ) ) {
				$font_size = absint( $submenu['font_size'] );
				if ( $font_size >= 10 && $font_size <= 24 ) {
					$css .= 'font-size: ' . $font_size . 'px !important;';
				}
			}

			// Text color (Requirement 10.2).
			if ( isset( $submenu['text_color'] ) ) {
				$text_color = sanitize_hex_color( $submenu['text_color'] );
				if ( $text_color ) {
					$css .= 'color: ' . $text_color . ' !important;';
				}
			}

			// Line height (Requirement 10.3).
			if ( isset( $submenu['line_height'] ) ) {
				$line_height = floatval( $submenu['line_height'] );
				if ( $line_height >= 1.0 && $line_height <= 3.0 ) {
					$css .= 'line-height: ' . $line_height . ' !important;';
				}
			}

			// Letter spacing (Requirement 10.4).
			if ( isset( $submenu['letter_spacing'] ) ) {
				$letter_spacing = intval( $submenu['letter_spacing'] );
				if ( $letter_spacing >= -2 && $letter_spacing <= 5 ) {
					$css .= 'letter-spacing: ' . $letter_spacing . 'px !important;';
				}
			}

			// Text transform (Requirement 10.5).
			if ( isset( $submenu['text_transform'] ) ) {
				$text_transform = strtolower( sanitize_text_field( $submenu['text_transform'] ) );
				$valid_transforms = array( 'none', 'uppercase', 'lowercase', 'capitalize' );
				if ( in_array( $text_transform, $valid_transforms, true ) ) {
					$css .= 'text-transform: ' . $text_transform . ' !important;';
				}
			}

			// Font family (Requirement 11.1).
			if ( isset( $submenu['font_family'] ) && $submenu['font_family'] !== 'system' ) {
				$font_family = $this->get_font_family_css( $submenu['font_family'] );
				if ( $font_family ) {
					$css .= 'font-family: ' . $font_family . ' !important;';
				}
			}

			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Menu submenu typography CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate border radius CSS for admin menu submenu.
	 * Handles both uniform and individual corner radius modes (Requirement 8.1).
	 *
	 * @param array $submenu Submenu settings array.
	 * @return string Border radius CSS.
	 */
	private function generate_submenu_border_radius_css( $submenu ) {
		try {
			$mode = isset( $submenu['border_radius_mode'] ) ? $submenu['border_radius_mode'] : 'uniform';
			$css = '';

			if ( $mode === 'individual' ) {
				// Individual corner radii (Requirement 8.1).
				$tl = isset( $submenu['border_radius_tl'] ) ? absint( $submenu['border_radius_tl'] ) : 0;
				$tr = isset( $submenu['border_radius_tr'] ) ? absint( $submenu['border_radius_tr'] ) : 0;
				$br = isset( $submenu['border_radius_br'] ) ? absint( $submenu['border_radius_br'] ) : 0;
				$bl = isset( $submenu['border_radius_bl'] ) ? absint( $submenu['border_radius_bl'] ) : 0;

				// Only generate CSS if at least one corner has a radius.
				if ( $tl > 0 || $tr > 0 || $br > 0 || $bl > 0 ) {
					$css .= sprintf(
						'border-radius: %dpx %dpx %dpx %dpx !important;',
						$tl,
						$tr,
						$br,
						$bl
					);
				}
			} else {
				// Uniform border radius (Requirement 8.1).
				$radius = isset( $submenu['border_radius'] ) ? absint( $submenu['border_radius'] ) : 0;

				// Only generate CSS if radius is greater than 0.
				if ( $radius > 0 ) {
					$css .= 'border-radius: ' . $radius . 'px !important;';
				}
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Submenu border radius CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate border radius CSS for admin menu.
	 * Handles both uniform and individual corner radius modes (Requirements 12.1, 12.2, 12.3).
	 *
	 * @param array $admin_menu Admin menu settings array.
	 * @return string Border radius CSS.
	 */
	private function generate_menu_border_radius_css( $admin_menu ) {
		try {
			$mode = isset( $admin_menu['border_radius_mode'] ) ? $admin_menu['border_radius_mode'] : 'uniform';
			$css = '';

			if ( $mode === 'individual' ) {
				// Individual corner radii (Requirement 12.2, 12.3).
				$tl = isset( $admin_menu['border_radius_tl'] ) ? absint( $admin_menu['border_radius_tl'] ) : 0;
				$tr = isset( $admin_menu['border_radius_tr'] ) ? absint( $admin_menu['border_radius_tr'] ) : 0;
				$br = isset( $admin_menu['border_radius_br'] ) ? absint( $admin_menu['border_radius_br'] ) : 0;
				$bl = isset( $admin_menu['border_radius_bl'] ) ? absint( $admin_menu['border_radius_bl'] ) : 0;

				// Only generate CSS if at least one corner has a radius.
				if ( $tl > 0 || $tr > 0 || $br > 0 || $bl > 0 ) {
					$css .= sprintf(
						'border-radius: %dpx %dpx %dpx %dpx !important;',
						$tl,
						$tr,
						$br,
						$bl
					);
				}
			} else {
				// Uniform border radius (Requirement 12.1).
				$radius = isset( $admin_menu['border_radius'] ) ? absint( $admin_menu['border_radius'] ) : 0;

				// Only generate CSS if radius is greater than 0.
				if ( $radius > 0 ) {
					$css .= 'border-radius: ' . $radius . 'px !important;';
				}
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Menu border radius CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate shadow CSS for admin menu.
	 * Supports preset and custom shadow modes (Requirements 13.1, 13.2, 13.3).
	 *
	 * @param array $admin_menu Admin menu settings array.
	 * @return string Shadow CSS.
	 */
	private function generate_menu_shadow_css( $admin_menu ) {
		try {
			$mode = isset( $admin_menu['shadow_mode'] ) ? $admin_menu['shadow_mode'] : 'preset';
			$css = '';

			if ( $mode === 'custom' ) {
				// Custom shadow with individual values (Requirements 13.2, 13.3).
				$h_offset = isset( $admin_menu['shadow_h_offset'] ) ? intval( $admin_menu['shadow_h_offset'] ) : 0;
				$v_offset = isset( $admin_menu['shadow_v_offset'] ) ? intval( $admin_menu['shadow_v_offset'] ) : 4;
				$blur = isset( $admin_menu['shadow_blur'] ) ? absint( $admin_menu['shadow_blur'] ) : 8;
				$spread = isset( $admin_menu['shadow_spread'] ) ? intval( $admin_menu['shadow_spread'] ) : 0;
				$color = isset( $admin_menu['shadow_color'] ) ? $admin_menu['shadow_color'] : '#000000';
				$opacity = isset( $admin_menu['shadow_opacity'] ) ? floatval( $admin_menu['shadow_opacity'] ) : 0.15;

				// Ensure opacity is within valid range (0-1).
				$opacity = max( 0, min( 1, $opacity ) );

				// Convert hex color to RGB and combine with opacity (Requirement 13.3).
				$rgb = $this->hex_to_rgb( $color );
				$shadow_color = sprintf( 'rgba(%d, %d, %d, %.2f)', $rgb['r'], $rgb['g'], $rgb['b'], $opacity );

				// Build custom shadow value.
				$shadow_value = sprintf(
					'%dpx %dpx %dpx %dpx %s',
					$h_offset,
					$v_offset,
					$blur,
					$spread,
					$shadow_color
				);

				$css .= 'body.wp-admin #adminmenu,';
				$css .= 'body.wp-admin #adminmenuback,';
				$css .= 'body.wp-admin #adminmenuwrap {';
				$css .= 'box-shadow: ' . $shadow_value . ' !important;';
				$css .= '}';

			} else {
				// Preset shadow mode (Requirement 13.1).
				$preset = isset( $admin_menu['shadow_preset'] ) ? $admin_menu['shadow_preset'] : 'none';

				// Map presets to box-shadow values (Requirement 13.1).
				$shadow_presets = array(
					'none'     => 'none',
					'subtle'   => '0 2px 4px rgba(0, 0, 0, 0.1)',
					'medium'   => '0 4px 8px rgba(0, 0, 0, 0.15)',
					'strong'   => '0 8px 16px rgba(0, 0, 0, 0.2)',
					'dramatic' => '0 12px 24px rgba(0, 0, 0, 0.25)',
				);

				$shadow_value = isset( $shadow_presets[ $preset ] ) ? $shadow_presets[ $preset ] : 'none';

				// Only generate CSS if shadow is not 'none'.
				if ( $shadow_value !== 'none' ) {
					$css .= 'body.wp-admin #adminmenu,';
					$css .= 'body.wp-admin #adminmenuback,';
					$css .= 'body.wp-admin #adminmenuwrap {';
					$css .= 'box-shadow: ' . $shadow_value . ' !important;';
					$css .= '}';
				}
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Menu shadow CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate floating margin CSS for admin menu.
	 * Handles both uniform and individual margin modes (Requirements 15.1, 15.2, 15.3).
	 * Only applies when floating mode is enabled in visual_effects.
	 *
	 * @param array $admin_menu Admin menu settings array.
	 * @param array $settings Full settings array to check floating mode.
	 * @return string Floating margin CSS.
	 */
	private function generate_menu_floating_css( $admin_menu, $settings ) {
		try {
			// Check if floating mode is enabled (Requirement 15.1).
			$floating_enabled = isset( $settings['visual_effects']['admin_menu']['floating'] ) ? 
				$settings['visual_effects']['admin_menu']['floating'] : false;

			// Only generate CSS if floating mode is enabled.
			if ( ! $floating_enabled ) {
				return '';
			}

			$mode = isset( $admin_menu['floating_margin_mode'] ) ? $admin_menu['floating_margin_mode'] : 'uniform';
			$css = '';

			$css .= 'body.wp-admin #adminmenu,';
			$css .= 'body.wp-admin #adminmenuback,';
			$css .= 'body.wp-admin #adminmenuwrap {';
			$css .= 'position: fixed !important;';

			if ( $mode === 'individual' ) {
				// Individual margins (Requirement 15.2, 15.3).
				$top = isset( $admin_menu['floating_margin_top'] ) ? absint( $admin_menu['floating_margin_top'] ) : 8;
				$right = isset( $admin_menu['floating_margin_right'] ) ? absint( $admin_menu['floating_margin_right'] ) : 8;
				$bottom = isset( $admin_menu['floating_margin_bottom'] ) ? absint( $admin_menu['floating_margin_bottom'] ) : 8;
				$left = isset( $admin_menu['floating_margin_left'] ) ? absint( $admin_menu['floating_margin_left'] ) : 8;

				$css .= sprintf(
					'top: %dpx !important; right: auto !important; bottom: auto !important; left: %dpx !important;',
					$top,
					$left
				);
				
				// Calculate height accounting for top and bottom margins.
				$css .= sprintf( 'height: calc(100vh - %dpx) !important;', $top + $bottom );

			} else {
				// Uniform margin (Requirement 15.1).
				$margin = isset( $admin_menu['floating_margin'] ) ? absint( $admin_menu['floating_margin'] ) : 8;

				$css .= sprintf(
					'top: %dpx !important; right: auto !important; bottom: auto !important; left: %dpx !important;',
					$margin,
					$margin
				);
				
				// Calculate height accounting for margins on top and bottom.
				$css .= sprintf( 'height: calc(100vh - %dpx) !important;', $margin * 2 );
			}

			$css .= '}';
			
			// Adjust content area margin to account for floating menu position.
			if ( $mode === 'individual' ) {
				$left = isset( $admin_menu['floating_margin_left'] ) ? absint( $admin_menu['floating_margin_left'] ) : 8;
				$width_value = isset( $admin_menu['width_value'] ) ? absint( $admin_menu['width_value'] ) : 160;
				$width_unit = isset( $admin_menu['width_unit'] ) ? $admin_menu['width_unit'] : 'pixels';
				
				if ( $width_unit === 'pixels' ) {
					$total_offset = $left + $width_value;
					$css .= 'body.wp-admin #wpcontent,';
					$css .= 'body.wp-admin #wpfooter {';
					$css .= sprintf( 'margin-left: %dpx !important;', $total_offset );
					$css .= '}';
				}
			} else {
				$margin = isset( $admin_menu['floating_margin'] ) ? absint( $admin_menu['floating_margin'] ) : 8;
				$width_value = isset( $admin_menu['width_value'] ) ? absint( $admin_menu['width_value'] ) : 160;
				$width_unit = isset( $admin_menu['width_unit'] ) ? $admin_menu['width_unit'] : 'pixels';
				
				if ( $width_unit === 'pixels' ) {
					$total_offset = $margin + $width_value;
					$css .= 'body.wp-admin #wpcontent,';
					$css .= 'body.wp-admin #wpfooter {';
					$css .= sprintf( 'margin-left: %dpx !important;', $total_offset );
					$css .= '}';
				}
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Menu floating margin CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate typography CSS.
	 *
	 * @param array $settings Settings array.
	 * @return string Typography CSS.
	 */
	private function generate_typography_css( $settings ) {
		// Start performance monitoring.
		$start_time = microtime( true );

		try {
			// Check cache first.
			$cache = new MASE_Cache();
			$cached_css = $cache->get_cached_typography_css();
			
			if ( false !== $cached_css ) {
				// Log cache hit.
				$duration = ( microtime( true ) - $start_time ) * 1000;
				error_log( sprintf( 'MASE: Typography CSS cache hit (%.2fms)', $duration ) );
				return $cached_css;
			}

			$typography = isset( $settings['typography'] ) ? $settings['typography'] : array();

			// Return empty string if no typography settings.
			if ( empty( $typography ) ) {
				return '';
			}

			$css = '';

			// Generate admin bar typography CSS.
			if ( isset( $typography['admin_bar'] ) ) {
				$admin_bar = $typography['admin_bar'];

				$css .= 'body.wp-admin #wpadminbar,';
				$css .= 'body.wp-admin #wpadminbar .ab-item,';
				$css .= 'body.wp-admin #wpadminbar > #wp-toolbar span.ab-label,';
				$css .= 'body.wp-admin #wpadminbar > #wp-toolbar span.noticon {';

				if ( isset( $admin_bar['font_size'] ) ) {
					$css .= 'font-size: ' . absint( $admin_bar['font_size'] ) . 'px !important;';
				}
				if ( isset( $admin_bar['font_weight'] ) ) {
					$css .= 'font-weight: ' . absint( $admin_bar['font_weight'] ) . ' !important;';
				}
				if ( isset( $admin_bar['line_height'] ) ) {
					$css .= 'line-height: ' . floatval( $admin_bar['line_height'] ) . ' !important;';
				}
				if ( isset( $admin_bar['letter_spacing'] ) ) {
					$css .= 'letter-spacing: ' . intval( $admin_bar['letter_spacing'] ) . 'px !important;';
				}
				if ( isset( $admin_bar['text_transform'] ) ) {
					$css .= 'text-transform: ' . esc_attr( $admin_bar['text_transform'] ) . ' !important;';
				}
				// NEW: Font family support (Requirement 8.5)
				if ( isset( $admin_bar['font_family'] ) && $admin_bar['font_family'] !== 'system' ) {
					$font_family = $this->get_font_family_css( $admin_bar['font_family'] );
					if ( $font_family ) {
						$css .= 'font-family: ' . $font_family . ' !important;';
					}
				}

				$css .= '}';
			}

			// Generate admin menu typography CSS.
			if ( isset( $typography['admin_menu'] ) ) {
				$admin_menu = $typography['admin_menu'];

				$css .= 'body.wp-admin #adminmenu a,';
				$css .= 'body.wp-admin #adminmenu div.wp-menu-name,';
				$css .= 'body.wp-admin #adminmenu .wp-submenu a {';

				if ( isset( $admin_menu['font_size'] ) ) {
					$css .= 'font-size: ' . absint( $admin_menu['font_size'] ) . 'px !important;';
				}
				if ( isset( $admin_menu['font_weight'] ) ) {
					$css .= 'font-weight: ' . absint( $admin_menu['font_weight'] ) . ' !important;';
				}
				if ( isset( $admin_menu['line_height'] ) ) {
					$css .= 'line-height: ' . floatval( $admin_menu['line_height'] ) . ' !important;';
				}
				if ( isset( $admin_menu['letter_spacing'] ) ) {
					$css .= 'letter-spacing: ' . intval( $admin_menu['letter_spacing'] ) . 'px !important;';
				}
				if ( isset( $admin_menu['text_transform'] ) ) {
					$css .= 'text-transform: ' . esc_attr( $admin_menu['text_transform'] ) . ' !important;';
				}
				// Font family support (Requirement 11.2, 11.5)
				if ( isset( $admin_menu['font_family'] ) && $admin_menu['font_family'] !== 'system' ) {
					$font_family = $this->get_font_family_css( $admin_menu['font_family'] );
					if ( $font_family ) {
						$css .= 'font-family: ' . $font_family . ' !important;';
					}
				}

				$css .= '}';
			}

			// Generate content typography CSS.
			if ( isset( $typography['content'] ) ) {
				$content = $typography['content'];

				$css .= 'body.wp-admin #wpbody-content,';
				$css .= 'body.wp-admin .wrap,';
				$css .= 'body.wp-admin #wpbody-content p,';
				$css .= 'body.wp-admin .wrap p {';

				if ( isset( $content['font_size'] ) ) {
					$css .= 'font-size: ' . absint( $content['font_size'] ) . 'px !important;';
				}
				if ( isset( $content['font_weight'] ) ) {
					$css .= 'font-weight: ' . absint( $content['font_weight'] ) . ' !important;';
				}
				if ( isset( $content['line_height'] ) ) {
					$css .= 'line-height: ' . floatval( $content['line_height'] ) . ' !important;';
				}
				if ( isset( $content['letter_spacing'] ) ) {
					$css .= 'letter-spacing: ' . intval( $content['letter_spacing'] ) . 'px !important;';
				}
				if ( isset( $content['text_transform'] ) ) {
					$css .= 'text-transform: ' . esc_attr( $content['text_transform'] ) . ' !important;';
				}

				$css .= '}';
			}

			// Performance monitoring.
			$duration = ( microtime( true ) - $start_time ) * 1000; // Convert to milliseconds.
			if ( $duration > 10 ) {
				error_log( sprintf( 'MASE: Typography CSS generation took %.2fms (threshold: 10ms)', $duration ) );
			}

			// Cache the generated CSS.
			$cache_duration = isset( $settings['performance']['cache_duration'] ) ? 
				absint( $settings['performance']['cache_duration'] ) : 3600;
			$cache->set_cached_typography_css( $css, $cache_duration );

			return $css;

		} catch ( Exception $e ) {
			// Log the error.
			error_log( sprintf( 'MASE: Typography CSS generation failed: %s', $e->getMessage() ) );

			// Attempt to return cached CSS on error.
			$cache = new MASE_Cache();
			$cached_css = $cache->get_cached_typography_css();

			if ( false !== $cached_css ) {
				error_log( 'MASE: Returning cached typography CSS due to generation error' );
				return $cached_css;
			}

			// Return empty string as graceful degradation.
			return '';
		}
	}

	/**
	 * Get font family CSS value
	 * Requirement 8.5: Convert font family setting to CSS value with fallbacks
	 * 
	 * @param string $font_family Font family setting value.
	 * @return string Font family CSS value.
	 */
	private function get_font_family_css( $font_family ) {
		if ( empty( $font_family ) || $font_family === 'system' ) {
			return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
		}
		
		// Check if it's a Google Font (starts with 'google:')
		if ( strpos( $font_family, 'google:' ) === 0 ) {
			$font_name = str_replace( 'google:', '', $font_family );
			return '"' . esc_attr( $font_name ) . '", sans-serif';
		}
		
		// Return as-is for system fonts (already includes fallbacks)
		return esc_attr( $font_family );
	}

	/**
	 * Generate Google Fonts @import statement
	 * Requirement 8.5: Generate @import for Google Fonts
	 * Requirement 23.3: Error handling for Google Font loading
	 * 
	 * @param array $settings Settings array.
	 * @return string Google Fonts @import CSS.
	 */
	private function generate_google_fonts_import( $settings ) {
		try {
			$fonts_to_load = array();
			
			// Check admin bar font
			if ( isset( $settings['typography']['admin_bar']['font_family'] ) ) {
				$font = $settings['typography']['admin_bar']['font_family'];
				if ( strpos( $font, 'google:' ) === 0 ) {
					$fonts_to_load[] = str_replace( 'google:', '', $font );
				}
			}
			
			// Check admin bar submenu font
			if ( isset( $settings['admin_bar_submenu']['font_family'] ) ) {
				$font = $settings['admin_bar_submenu']['font_family'];
				if ( strpos( $font, 'google:' ) === 0 ) {
					$fonts_to_load[] = str_replace( 'google:', '', $font );
				}
			}
			
			// Check admin menu font (Requirement 11.2)
			if ( isset( $settings['typography']['admin_menu']['font_family'] ) ) {
				$font = $settings['typography']['admin_menu']['font_family'];
				if ( strpos( $font, 'google:' ) === 0 ) {
					$fonts_to_load[] = str_replace( 'google:', '', $font );
				}
			}
			
			// Check admin menu submenu font (Requirement 11.2)
			if ( isset( $settings['admin_menu_submenu']['font_family'] ) ) {
				$font = $settings['admin_menu_submenu']['font_family'];
				if ( strpos( $font, 'google:' ) === 0 ) {
					$fonts_to_load[] = str_replace( 'google:', '', $font );
				}
			}
			
			// Remove duplicates
			$fonts_to_load = array_unique( $fonts_to_load );
			
			if ( empty( $fonts_to_load ) ) {
				return '';
			}
			
			// Build @import statement (Requirement 11.2, 11.5)
			$css = '';
			foreach ( $fonts_to_load as $font_name ) {
				// Validate font name to prevent injection
				$font_name = sanitize_text_field( $font_name );
				if ( empty( $font_name ) ) {
					continue;
				}
				
				$font_url = 'https://fonts.googleapis.com/css2?family=' . 
							str_replace( ' ', '+', $font_name ) . 
							':wght@300;400;500;600;700&display=swap';
				$css .= '@import url("' . esc_url( $font_url ) . '");';
			}
			
			return $css;
			
		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Google Fonts import generation failed: %s', $e->getMessage() ) );
			// Return empty string to gracefully degrade to system fonts
			return '';
		}
	}

	/**
	 * Generate visual effects CSS.
	 *
	 * @param array $settings Settings array.
	 * @return string Visual effects CSS.
	 */
	private function generate_visual_effects_css( $settings ) {
		// Start performance monitoring.
		$start_time = microtime( true );

		try {
			// Check cache first.
			$cache = new MASE_Cache();
			$cached_css = $cache->get_cached_visual_effects_css();
			
			if ( false !== $cached_css ) {
				// Log cache hit.
				$duration = ( microtime( true ) - $start_time ) * 1000;
				error_log( sprintf( 'MASE: Visual effects CSS cache hit (%.2fms)', $duration ) );
				return $cached_css;
			}

			$visual_effects = isset( $settings['visual_effects'] ) ? $settings['visual_effects'] : array();

			// Return empty string if no visual effects settings.
			if ( empty( $visual_effects ) ) {
				return '';
			}

			$css = '';

			// CSS Custom Properties for shadow system.
			$css .= ':root{';
			$css .= '--mase-shadow-subtle:0 2px 8px rgba(0,0,0,0.1);';
			$css .= '--mase-shadow-medium:0 4px 12px rgba(0,0,0,0.15);';
			$css .= '--mase-shadow-strong:0 8px 20px 2px rgba(0,0,0,0.2);';
			$css .= '--mase-transition-shadow:box-shadow 200ms cubic-bezier(0.4,0,0.2,1);';
			$css .= '}';

			// Generate admin bar visual effects.
			if ( isset( $visual_effects['admin_bar'] ) ) {
				$css .= $this->generate_element_visual_effects(
					'body.wp-admin #wpadminbar',
					$visual_effects['admin_bar']
				);
			}

			// Generate admin menu visual effects.
			// Apply only to top-level menu items, not submenu items to avoid positioning conflicts
			if ( isset( $visual_effects['admin_menu'] ) ) {
				$css .= $this->generate_element_visual_effects(
					'body.wp-admin #adminmenu li.menu-top > a',
					$visual_effects['admin_menu'],
					true // Include hover states.
				);
			}

			// Generate button visual effects.
			if ( isset( $visual_effects['buttons'] ) ) {
				$css .= $this->generate_element_visual_effects(
					'body.wp-admin .button,body.wp-admin .button-primary',
					$visual_effects['buttons'],
					true // Include hover states.
				);
			}

			// Generate form field visual effects.
			if ( isset( $visual_effects['form_fields'] ) ) {
				$css .= $this->generate_element_visual_effects(
					'body.wp-admin input[type="text"],body.wp-admin input[type="email"],body.wp-admin textarea,body.wp-admin select',
					$visual_effects['form_fields'],
					true // Include focus states.
				);
			}

			// Mobile optimization - responsive shadow scaling (Requirement 9.1, 9.2, 9.3).
			$css .= '@media screen and (max-width:782px){';
			
			// Check if mobile shadows are disabled (Requirement 9.5, 16.2).
			$disable_mobile_shadows = isset( $settings['visual_effects']['disable_mobile_shadows'] ) ? 
				$settings['visual_effects']['disable_mobile_shadows'] : false;
			
			if ( $disable_mobile_shadows ) {
				// Disable shadows completely on mobile but maintain border radius (Requirement 16.3).
				$css .= 'body.wp-admin #wpadminbar,';
				$css .= 'body.wp-admin #adminmenu li.menu-top > a,';
				$css .= 'body.wp-admin .button,';
				$css .= 'body.wp-admin .button-primary,';
				$css .= 'body.wp-admin input[type="text"],';
				$css .= 'body.wp-admin input[type="email"],';
				$css .= 'body.wp-admin textarea,';
				$css .= 'body.wp-admin select{';
				$css .= 'box-shadow:none!important;';
				$css .= '}';
			} else {
				// Scale shadows down by 30% on mobile (Requirement 9.2, 9.3).
				if ( isset( $visual_effects['admin_bar'] ) ) {
					$mobile_shadow = $this->calculate_mobile_shadow( $visual_effects['admin_bar'] );
					$css .= 'body.wp-admin #wpadminbar{';
					$css .= 'box-shadow:' . $mobile_shadow . '!important;';
					$css .= '}';
				}
				
				if ( isset( $visual_effects['admin_menu'] ) ) {
					$mobile_shadow = $this->calculate_mobile_shadow( $visual_effects['admin_menu'] );
					$css .= 'body.wp-admin #adminmenu a{';
					$css .= 'box-shadow:' . $mobile_shadow . '!important;';
					$css .= '}';
				}
				
				if ( isset( $visual_effects['buttons'] ) ) {
					$mobile_shadow = $this->calculate_mobile_shadow( $visual_effects['buttons'] );
					$css .= 'body.wp-admin .button,';
					$css .= 'body.wp-admin .button-primary{';
					$css .= 'box-shadow:' . $mobile_shadow . '!important;';
					$css .= '}';
				}
				
				if ( isset( $visual_effects['form_fields'] ) ) {
					$mobile_shadow = $this->calculate_mobile_shadow( $visual_effects['form_fields'] );
					$css .= 'body.wp-admin input[type="text"],';
					$css .= 'body.wp-admin input[type="email"],';
					$css .= 'body.wp-admin textarea,';
					$css .= 'body.wp-admin select{';
					$css .= 'box-shadow:' . $mobile_shadow . '!important;';
					$css .= '}';
				}
			}
			
			$css .= '}';

			// Reduced motion support (Requirement 18.4).
			$css .= '@media (prefers-reduced-motion:reduce){';
			$css .= 'body.wp-admin *{';
			$css .= 'transition:none!important;';
			$css .= '}';
			$css .= '}';

			// Focus indicators with sufficient contrast (Requirement 18.2, 13.1).
			$css .= 'body.wp-admin .mase-range:focus,';
			$css .= 'body.wp-admin .mase-select:focus,';
			$css .= 'body.wp-admin .mase-color-picker:focus,';
			$css .= 'body.wp-admin input[type="radio"]:focus{';
			$css .= 'outline:2px solid #2271b1!important;';
			$css .= 'outline-offset:2px!important;';
			$css .= 'box-shadow:0 0 0 1px #fff,0 0 0 3px #2271b1!important;';
			$css .= '}';

			// High contrast focus for better visibility (Requirement 18.1, 18.2).
			$css .= 'body.wp-admin .mase-shadow-direction label:focus-within{';
			$css .= 'outline:2px solid #2271b1!important;';
			$css .= 'outline-offset:2px!important;';
			$css .= 'border-radius:3px!important;';
			$css .= '}';

			// Ensure sufficient contrast for error states (Requirement 18.1).
			$css .= 'body.wp-admin .mase-input.error,';
			$css .= 'body.wp-admin .mase-input[aria-invalid="true"]{';
			$css .= 'border-color:#d63638!important;';
			$css .= 'box-shadow:0 0 0 1px #d63638!important;';
			$css .= '}';

			// Keyboard navigation visual feedback (Requirement 18.3).
			$css .= 'body.wp-admin .palette-preset:focus,';
			$css .= 'body.wp-admin #mase-export-btn:focus,';
			$css .= 'body.wp-admin #mase-import-btn:focus{';
			$css .= 'outline:2px solid #2271b1!important;';
			$css .= 'outline-offset:2px!important;';
			$css .= 'box-shadow:0 0 0 1px #fff,0 0 0 3px #2271b1!important;';
			$css .= '}';

			// Performance monitoring.
			$duration = ( microtime( true ) - $start_time ) * 1000; // Convert to milliseconds.
			if ( $duration > 5 ) {
				error_log( sprintf( 'MASE: Visual effects CSS generation took %.2fms (threshold: 5ms)', $duration ) );
			}

			// Cache the generated CSS.
			$cache_duration = isset( $settings['performance']['cache_duration'] ) ? 
				absint( $settings['performance']['cache_duration'] ) : 3600;
			$cache->set_cached_visual_effects_css( $css, $cache_duration );

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Visual effects CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate visual effects CSS for a specific element.
	 *
	 * @param string $selector CSS selector for the element.
	 * @param array  $effects Visual effects settings for the element.
	 * @param bool   $include_hover Whether to include hover/focus states.
	 * @return string Element visual effects CSS.
	 */
	private function generate_element_visual_effects( $selector, $effects, $include_hover = false ) {
		$css = '';

		// Base styles.
		$css .= $selector . '{';

		// Border radius.
		if ( isset( $effects['border_radius'] ) ) {
			$css .= 'border-radius:' . absint( $effects['border_radius'] ) . 'px!important;';
		}

		// Box shadow.
		$shadow = $this->calculate_shadow( $effects );
		$css .= 'box-shadow:' . $shadow . '!important;';

		// Transition.
		$css .= 'transition:var(--mase-transition-shadow)!important;';

		// GPU acceleration hints for better performance.
		if ( 'none' !== $shadow ) {
			$css .= 'will-change:box-shadow!important;';
			// Force GPU layer creation for smoother animations.
			$css .= 'transform:translateZ(0)!important;';
			// Enable hardware acceleration.
			$css .= 'backface-visibility:hidden!important;';
		}

		$css .= '}';

		// Hover/focus states with enhanced shadow.
		if ( $include_hover && 'none' !== $shadow ) {
			$hover_effects = $effects;
			// Increase shadow intensity for hover state.
			if ( isset( $hover_effects['shadow_intensity'] ) ) {
				$intensity_map = array(
					'subtle' => 'medium',
					'medium' => 'strong',
					'strong' => 'strong',
				);
				if ( isset( $intensity_map[ $hover_effects['shadow_intensity'] ] ) ) {
					$hover_effects['shadow_intensity'] = $intensity_map[ $hover_effects['shadow_intensity'] ];
				}
			}

			$hover_shadow = $this->calculate_shadow( $hover_effects );

			// Determine if selector is for form fields (use :focus) or other elements (use :hover).
			$is_form_field = strpos( $selector, 'input' ) !== false || 
							 strpos( $selector, 'textarea' ) !== false || 
							 strpos( $selector, 'select' ) !== false;

			if ( $is_form_field ) {
				// Use :focus for form fields.
				$hover_selectors = array();
				$base_selectors = explode( ',', $selector );
				foreach ( $base_selectors as $base_selector ) {
					$hover_selectors[] = trim( $base_selector ) . ':focus';
				}
				$css .= implode( ',', $hover_selectors ) . '{';
			} else {
				// Use :hover and :focus for other elements.
				$hover_selectors = array();
				$base_selectors = explode( ',', $selector );
				foreach ( $base_selectors as $base_selector ) {
					$hover_selectors[] = trim( $base_selector ) . ':hover';
					$hover_selectors[] = trim( $base_selector ) . ':focus';
				}
				$css .= implode( ',', $hover_selectors ) . '{';
			}

			$css .= 'box-shadow:' . $hover_shadow . '!important;';
			$css .= '}';
		}

		return $css;
	}

	/**
	 * Calculate mobile-optimized shadow CSS value.
	 * Reduces shadow blur by 30% for better mobile performance (Requirement 9.2, 9.3).
	 *
	 * @param array $effects Visual effects settings containing shadow properties.
	 * @return string CSS box-shadow value optimized for mobile.
	 */
	private function calculate_mobile_shadow( $effects ) {
		// Get shadow properties with defaults.
		$intensity = isset( $effects['shadow_intensity'] ) ? $effects['shadow_intensity'] : 'none';
		
		// Return 'none' if intensity is none.
		if ( 'none' === $intensity ) {
			return 'none';
		}
		
		// Create a copy of effects and reduce blur by 30% (Requirement 9.2).
		$mobile_effects = $effects;
		$original_blur = isset( $effects['shadow_blur'] ) ? absint( $effects['shadow_blur'] ) : 10;
		$mobile_effects['shadow_blur'] = max( 0, round( $original_blur * 0.7 ) );
		
		// Use standard shadow calculation with reduced blur.
		return $this->calculate_shadow( $mobile_effects );
	}

	/**
	 * Calculate shadow CSS value from visual effects settings.
	 *
	 * @param array $effects Visual effects settings containing shadow properties.
	 * @return string CSS box-shadow value.
	 */
	private function calculate_shadow( $effects ) {
		// Get shadow properties with defaults.
		$intensity = isset( $effects['shadow_intensity'] ) ? $effects['shadow_intensity'] : 'none';
		$direction = isset( $effects['shadow_direction'] ) ? $effects['shadow_direction'] : 'bottom';
		$blur      = isset( $effects['shadow_blur'] ) ? absint( $effects['shadow_blur'] ) : 10;
		$color     = isset( $effects['shadow_color'] ) ? $effects['shadow_color'] : 'rgba(0,0,0,0.15)';

		// Return 'none' if intensity is none.
		if ( 'none' === $intensity ) {
			return 'none';
		}

		// Base shadow sizes by intensity.
		$sizes = array(
			'subtle' => array( 'x' => 2, 'y' => 2, 'spread' => 0 ),
			'medium' => array( 'x' => 4, 'y' => 4, 'spread' => 0 ),
			'strong' => array( 'x' => 8, 'y' => 8, 'spread' => 2 ),
		);

		// Direction modifiers.
		$directions = array(
			'top'    => array( 'x' => 0, 'y' => -1 ),
			'right'  => array( 'x' => 1, 'y' => 0 ),
			'bottom' => array( 'x' => 0, 'y' => 1 ),
			'left'   => array( 'x' => -1, 'y' => 0 ),
			'center' => array( 'x' => 0, 'y' => 0 ),
		);

		// Get base size and direction modifier.
		$base = isset( $sizes[ $intensity ] ) ? $sizes[ $intensity ] : $sizes['subtle'];
		$dir  = isset( $directions[ $direction ] ) ? $directions[ $direction ] : $directions['bottom'];

		// Calculate final shadow values.
		$x      = $base['x'] * $dir['x'];
		$y      = $base['y'] * $dir['y'];
		$spread = $base['spread'];

		// Format shadow value.
		return sprintf( '%dpx %dpx %dpx %dpx %s', $x, $y, $blur, $spread, $color );
	}

	/**
	 * Generate spacing CSS.
	 *
	 * Generates CSS for spacing controls including menu padding, menu margin,
	 * admin bar padding, submenu spacing, and content margin.
	 * Requirements: 11.1, 11.2, 11.3, 11.7, 11.4, 11.5, 11.6, 17.1, 17.2, 17.3, 17.4, 17.5
	 *
	 * @param array $settings Settings array.
	 * @return string Spacing CSS.
	 */
	private function generate_spacing_css( $settings ) {
		// Start performance monitoring (Requirement 17.1, 17.3).
		$start_time = microtime( true );

		try {
			// Check cache first (Requirement 11.6, 17.1).
			$cache = new MASE_Cache();
			$cached_css = $cache->get_cached_spacing_css();
			
			if ( false !== $cached_css ) {
				// Log cache hit.
				$duration = ( microtime( true ) - $start_time ) * 1000;
				error_log( sprintf( 'MASE: Spacing CSS cache hit (%.2fms)', $duration ) );
				return $cached_css;
			}

			$spacing = isset( $settings['spacing'] ) ? $settings['spacing'] : array();

			// Return empty string if no spacing settings (Requirement 11.5).
			if ( empty( $spacing ) ) {
				return '';
			}

			$css = '';

			// Generate menu padding CSS.
			if ( isset( $spacing['menu_padding'] ) && is_array( $spacing['menu_padding'] ) ) {
				$menu_padding = $spacing['menu_padding'];
				$unit = isset( $menu_padding['unit'] ) ? $menu_padding['unit'] : 'px';

				$css .= 'body.wp-admin #adminmenu li.menu-top > a{';
				
				if ( isset( $menu_padding['top'] ) ) {
					$css .= 'padding-top:' . $this->format_spacing_value( $menu_padding['top'], $unit ) . '!important;';
				}
				if ( isset( $menu_padding['right'] ) ) {
					$css .= 'padding-right:' . $this->format_spacing_value( $menu_padding['right'], $unit ) . '!important;';
				}
				if ( isset( $menu_padding['bottom'] ) ) {
					$css .= 'padding-bottom:' . $this->format_spacing_value( $menu_padding['bottom'], $unit ) . '!important;';
				}
				if ( isset( $menu_padding['left'] ) ) {
					$css .= 'padding-left:' . $this->format_spacing_value( $menu_padding['left'], $unit ) . '!important;';
				}
				
				$css .= '}';
			}

			// Generate menu margin CSS.
			if ( isset( $spacing['menu_margin'] ) && is_array( $spacing['menu_margin'] ) ) {
				$menu_margin = $spacing['menu_margin'];
				$unit = isset( $menu_margin['unit'] ) ? $menu_margin['unit'] : 'px';

				$css .= 'body.wp-admin #adminmenu li.menu-top{';
				
				if ( isset( $menu_margin['top'] ) ) {
					$css .= 'margin-top:' . $this->format_spacing_value( $menu_margin['top'], $unit ) . '!important;';
				}
				if ( isset( $menu_margin['right'] ) ) {
					$css .= 'margin-right:' . $this->format_spacing_value( $menu_margin['right'], $unit ) . '!important;';
				}
				if ( isset( $menu_margin['bottom'] ) ) {
					$css .= 'margin-bottom:' . $this->format_spacing_value( $menu_margin['bottom'], $unit ) . '!important;';
				}
				if ( isset( $menu_margin['left'] ) ) {
					$css .= 'margin-left:' . $this->format_spacing_value( $menu_margin['left'], $unit ) . '!important;';
				}
				
				$css .= '}';
			}

			// Generate admin bar padding CSS.
			if ( isset( $spacing['admin_bar_padding'] ) && is_array( $spacing['admin_bar_padding'] ) ) {
				$admin_bar_padding = $spacing['admin_bar_padding'];
				$unit = isset( $admin_bar_padding['unit'] ) ? $admin_bar_padding['unit'] : 'px';

				$css .= 'body.wp-admin #wpadminbar .ab-item{';
				
				if ( isset( $admin_bar_padding['top'] ) ) {
					$css .= 'padding-top:' . $this->format_spacing_value( $admin_bar_padding['top'], $unit ) . '!important;';
				}
				if ( isset( $admin_bar_padding['right'] ) ) {
					$css .= 'padding-right:' . $this->format_spacing_value( $admin_bar_padding['right'], $unit ) . '!important;';
				}
				if ( isset( $admin_bar_padding['bottom'] ) ) {
					$css .= 'padding-bottom:' . $this->format_spacing_value( $admin_bar_padding['bottom'], $unit ) . '!important;';
				}
				if ( isset( $admin_bar_padding['left'] ) ) {
					$css .= 'padding-left:' . $this->format_spacing_value( $admin_bar_padding['left'], $unit ) . '!important;';
				}
				
				$css .= '}';
			}

			// Generate submenu spacing CSS.
			// Only generate if values differ from WordPress defaults to avoid conflicts
			if ( isset( $spacing['submenu_spacing'] ) && is_array( $spacing['submenu_spacing'] ) ) {
				$submenu_spacing = $spacing['submenu_spacing'];
				$unit = isset( $submenu_spacing['unit'] ) ? $submenu_spacing['unit'] : 'px';
				
				// Check if any padding values are set and different from defaults
				$has_padding = false;
				$padding_css = '';
				
				// WordPress default submenu padding is approximately 5px 12px
				$defaults = array(
					'padding_top' => 5,
					'padding_right' => 12,
					'padding_bottom' => 5,
					'padding_left' => 12
				);
				
				foreach ( $defaults as $side => $default_value ) {
					if ( isset( $submenu_spacing[$side] ) && $submenu_spacing[$side] != $default_value ) {
						$padding_css .= str_replace('_', '-', $side) . ':' . $this->format_spacing_value( $submenu_spacing[$side], $unit ) . '!important;';
						$has_padding = true;
					}
				}
				
				if ( $has_padding ) {
					$css .= 'body.wp-admin #adminmenu .wp-submenu a{';
					$css .= $padding_css;
					$css .= '}';
				}

				// Submenu margin and offset - only if non-zero
				$has_submenu_styles = false;
				$submenu_css = '';
				
				if ( isset( $submenu_spacing['margin_top'] ) && $submenu_spacing['margin_top'] != 0 ) {
					$submenu_css .= 'margin-top:' . $this->format_spacing_value( $submenu_spacing['margin_top'], $unit ) . '!important;';
					$has_submenu_styles = true;
				}
				// Only set left offset if it's not 0 (to preserve WordPress default positioning)
				if ( isset( $submenu_spacing['offset_left'] ) && $submenu_spacing['offset_left'] != 0 ) {
					$submenu_css .= 'left:' . $this->format_spacing_value( $submenu_spacing['offset_left'], $unit ) . '!important;';
					$has_submenu_styles = true;
				}
				
				if ( $has_submenu_styles ) {
					$css .= 'body.wp-admin #adminmenu .wp-submenu{';
					$css .= $submenu_css;
					$css .= '}';
				}
			}

			// Generate content margin CSS.
			if ( isset( $spacing['content_margin'] ) && is_array( $spacing['content_margin'] ) ) {
				$content_margin = $spacing['content_margin'];
				$unit = isset( $content_margin['unit'] ) ? $content_margin['unit'] : 'px';

				$css .= 'body.wp-admin #wpbody-content{';
				
				if ( isset( $content_margin['top'] ) ) {
					$css .= 'margin-top:' . $this->format_spacing_value( $content_margin['top'], $unit ) . '!important;';
				}
				if ( isset( $content_margin['right'] ) ) {
					$css .= 'margin-right:' . $this->format_spacing_value( $content_margin['right'], $unit ) . '!important;';
				}
				if ( isset( $content_margin['bottom'] ) ) {
					$css .= 'margin-bottom:' . $this->format_spacing_value( $content_margin['bottom'], $unit ) . '!important;';
				}
				if ( isset( $content_margin['left'] ) ) {
					$css .= 'margin-left:' . $this->format_spacing_value( $content_margin['left'], $unit ) . '!important;';
				}
				
				$css .= '}';
			}

			// Add smooth transitions for spacing changes (Requirement 9.7).
			$css .= 'body.wp-admin #adminmenu li.menu-top > a,';
			$css .= 'body.wp-admin #adminmenu li.menu-top,';
			$css .= 'body.wp-admin #wpadminbar .ab-item,';
			$css .= 'body.wp-admin #adminmenu .wp-submenu,';
			$css .= 'body.wp-admin #adminmenu .wp-submenu a,';
			$css .= 'body.wp-admin #wpbody-content{';
			$css .= 'transition:padding 0.3s ease,margin 0.3s ease,left 0.3s ease!important;';
			$css .= '}';

			// Add reduced motion support (Requirement 9.5, 10.5).
			$css .= '@media (prefers-reduced-motion:reduce){';
			$css .= 'body.wp-admin #adminmenu li.menu-top > a,';
			$css .= 'body.wp-admin #adminmenu li.menu-top,';
			$css .= 'body.wp-admin #wpadminbar .ab-item,';
			$css .= 'body.wp-admin #adminmenu .wp-submenu,';
			$css .= 'body.wp-admin #adminmenu .wp-submenu a,';
			$css .= 'body.wp-admin #wpbody-content{';
			$css .= 'transition:none!important;';
			$css .= '}';
			$css .= '}';

			// Add responsive spacing media queries (Requirement 9.1, 9.2, 9.3, 9.4, 9.5).
			$css .= $this->generate_responsive_spacing_css( $spacing );

			// Browser-specific fallbacks for older browsers (Task 11.5).
			// Add static fallback values before CSS custom properties.
			$css .= $this->generate_spacing_fallbacks( $spacing );

			// Performance monitoring (Requirement 17.2, 17.4).
			$duration = ( microtime( true ) - $start_time ) * 1000; // Convert to milliseconds.
			if ( $duration > 5 ) {
				error_log( sprintf( 'MASE: Spacing CSS generation took %.2fms (threshold: 5ms)', $duration ) );
			}

			// Cache the generated CSS (Requirement 11.6, 17.1, 17.5).
			$cache_duration = isset( $settings['performance']['cache_duration'] ) ? 
				absint( $settings['performance']['cache_duration'] ) : 3600;
			$cache->set_cached_spacing_css( $css, $cache_duration );

			return $css;

		} catch ( Exception $e ) {
			// Log the error (Requirement 17.3).
			error_log( sprintf( 'MASE: Spacing CSS generation failed: %s', $e->getMessage() ) );

			// Attempt to return cached CSS on error (Requirement 11.5, 17.5).
			$cache = new MASE_Cache();
			$cached_css = $cache->get_cached_spacing_css();

			if ( false !== $cached_css ) {
				error_log( 'MASE: Returning cached spacing CSS due to generation error' );
				return $cached_css;
			}

			// Return empty string as graceful degradation.
			return '';
		}
	}

	/**
	 * Generate browser-specific fallbacks for spacing CSS.
	 *
	 * Provides static fallback values for browsers that don't support
	 * modern CSS features like CSS custom properties.
	 * Task 11.5 - Browser-specific fallbacks.
	 *
	 * @param array $spacing Spacing settings array.
	 * @return string Fallback CSS for older browsers.
	 */
	private function generate_spacing_fallbacks( $spacing ) {
		$css = '';

		// Add comment for fallback section (removed in minification).
		$css .= '/* Browser fallbacks for IE11 and older browsers */';

		// Force vertical menu layout - prevent horizontal display bug.
		$css .= 'body.wp-admin #adminmenu{';
		$css .= 'display:block !important;'; // Maintain WordPress default vertical layout.
		$css .= '}';
		
		// Ensure submenu displays correctly (position absolute, left positioning)
		$css .= 'body.wp-admin #adminmenu .wp-submenu{';
		$css .= 'position:absolute !important;';
		$css .= 'top:0 !important;';
		$css .= 'display:none !important;';
		$css .= 'z-index:9999 !important;';
		$css .= '}';
		
		$css .= 'body.wp-admin #adminmenu li.opensub > .wp-submenu,';
		$css .= 'body.wp-admin #adminmenu li:hover > .wp-submenu{';
		$css .= 'display:block !important;';
		$css .= '}';
		
		// Ensure submenu appears to the right of menu
		// Submenu positioning is handled by WordPress core - don't override

		// Box-sizing fallback for older browsers.
		$css .= 'body.wp-admin #adminmenu li.menu-top > a,';
		$css .= 'body.wp-admin #wpadminbar .ab-item,';
		$css .= 'body.wp-admin #adminmenu .wp-submenu a{';
		$css .= '-webkit-box-sizing:border-box;'; // Safari/Chrome.
		$css .= '-moz-box-sizing:border-box;'; // Firefox.
		$css .= 'box-sizing:border-box;'; // Modern browsers.
		$css .= '}';

		// Transition fallbacks with vendor prefixes.
		$css .= 'body.wp-admin #adminmenu li.menu-top > a,';
		$css .= 'body.wp-admin #adminmenu li.menu-top,';
		$css .= 'body.wp-admin #wpadminbar .ab-item{';
		$css .= '-webkit-transition:padding 0.3s ease,margin 0.3s ease;'; // Safari/Chrome.
		$css .= '-moz-transition:padding 0.3s ease,margin 0.3s ease;'; // Firefox.
		$css .= '-o-transition:padding 0.3s ease,margin 0.3s ease;'; // Opera.
		$css .= 'transition:padding 0.3s ease,margin 0.3s ease;'; // Modern browsers.
		$css .= '}';

		// Calc() fallback for older browsers.
		// Provide static values as fallback before calc() expressions.
		if ( isset( $spacing['menu_padding'] ) && is_array( $spacing['menu_padding'] ) ) {
			$menu_padding = $spacing['menu_padding'];
			$unit = isset( $menu_padding['unit'] ) ? $menu_padding['unit'] : 'px';

			// Only add fallback if using rem (which might not be supported).
			if ( 'rem' === $unit ) {
				$css .= 'body.wp-admin #adminmenu li.menu-top > a{';
				
				// Convert rem to px as fallback (assuming 16px base).
				if ( isset( $menu_padding['top'] ) ) {
					$px_value = round( floatval( $menu_padding['top'] ) * 16 );
					$css .= 'padding-top:' . $px_value . 'px;'; // Fallback.
				}
				if ( isset( $menu_padding['right'] ) ) {
					$px_value = round( floatval( $menu_padding['right'] ) * 16 );
					$css .= 'padding-right:' . $px_value . 'px;'; // Fallback.
				}
				if ( isset( $menu_padding['bottom'] ) ) {
					$px_value = round( floatval( $menu_padding['bottom'] ) * 16 );
					$css .= 'padding-bottom:' . $px_value . 'px;'; // Fallback.
				}
				if ( isset( $menu_padding['left'] ) ) {
					$px_value = round( floatval( $menu_padding['left'] ) * 16 );
					$css .= 'padding-left:' . $px_value . 'px;'; // Fallback.
				}
				
				$css .= '}';
			}
		}

		// IE-specific hacks for known issues.
		$css .= '@media screen and (-ms-high-contrast:active),(-ms-high-contrast:none){';
		$css .= '/* IE10+ specific styles */';
		$css .= 'body.wp-admin #adminmenu li.menu-top > a{';
		$css .= 'display:block;'; // Ensure block display in IE.
		$css .= '}';
		$css .= '}';

		// Edge Legacy specific fixes.
		$css .= '@supports (-ms-ime-align:auto){';
		$css .= '/* Edge Legacy specific styles */';
		$css .= 'body.wp-admin #adminmenu li.menu-top > a{';
		$css .= 'display:block;'; // Ensure block display in Edge Legacy.
		$css .= '}';
		$css .= '}';

		return $css;
	}

	/**
	 * Generate responsive spacing CSS with media queries.
	 *
	 * Generates tablet and mobile media queries with scaled spacing values.
	 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.7, 10.1, 10.2, 10.3, 10.4, 10.5
	 *
	 * @param array $spacing Spacing settings array.
	 * @return string Responsive spacing CSS with media queries.
	 */
	private function generate_responsive_spacing_css( $spacing ) {
		$css = '';

		// Tablet media query (783px-1024px) - 90% scaling (Requirement 9.1, 9.4).
		$css .= '@media screen and (min-width:783px) and (max-width:1024px){';

		// Scale menu padding by 90%.
		if ( isset( $spacing['menu_padding'] ) && is_array( $spacing['menu_padding'] ) ) {
			$menu_padding = $spacing['menu_padding'];
			$unit = isset( $menu_padding['unit'] ) ? $menu_padding['unit'] : 'px';

			$css .= 'body.wp-admin #adminmenu li.menu-top > a{';
			
			if ( isset( $menu_padding['top'] ) ) {
				$scaled_value = $this->scale_spacing_value( $menu_padding['top'], 0.9 );
				$css .= 'padding-top:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			if ( isset( $menu_padding['right'] ) ) {
				$scaled_value = $this->scale_spacing_value( $menu_padding['right'], 0.9 );
				$css .= 'padding-right:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			if ( isset( $menu_padding['bottom'] ) ) {
				$scaled_value = $this->scale_spacing_value( $menu_padding['bottom'], 0.9 );
				$css .= 'padding-bottom:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			if ( isset( $menu_padding['left'] ) ) {
				$scaled_value = $this->scale_spacing_value( $menu_padding['left'], 0.9 );
				$css .= 'padding-left:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			
			$css .= '}';
		}

		// Scale menu margin by 90%.
		if ( isset( $spacing['menu_margin'] ) && is_array( $spacing['menu_margin'] ) ) {
			$menu_margin = $spacing['menu_margin'];
			$unit = isset( $menu_margin['unit'] ) ? $menu_margin['unit'] : 'px';

			$css .= 'body.wp-admin #adminmenu li.menu-top{';
			
			if ( isset( $menu_margin['top'] ) ) {
				$scaled_value = $this->scale_spacing_value( $menu_margin['top'], 0.9 );
				$css .= 'margin-top:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			if ( isset( $menu_margin['bottom'] ) ) {
				$scaled_value = $this->scale_spacing_value( $menu_margin['bottom'], 0.9 );
				$css .= 'margin-bottom:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			
			$css .= '}';
		}

		$css .= '}';

		// Mobile media query (<782px) - 75% scaling or mobile overrides (Requirement 9.2, 9.3, 10.1, 10.2, 10.3).
		$css .= '@media screen and (max-width:782px){';

		// Check if mobile overrides are enabled (Requirement 10.1, 10.2).
		$mobile_overrides_enabled = isset( $spacing['mobile_overrides']['enabled'] ) && 
									$spacing['mobile_overrides']['enabled'];

		if ( $mobile_overrides_enabled && isset( $spacing['mobile_overrides']['menu_padding'] ) ) {
			// Use mobile override values (Requirement 10.3, 10.4).
			$mobile_menu_padding = $spacing['mobile_overrides']['menu_padding'];
			$unit = isset( $mobile_menu_padding['unit'] ) ? $mobile_menu_padding['unit'] : 'px';

			$css .= 'body.wp-admin #adminmenu li.menu-top > a{';
			
			if ( isset( $mobile_menu_padding['top'] ) ) {
				$css .= 'padding-top:' . $this->format_spacing_value( $mobile_menu_padding['top'], $unit ) . '!important;';
			}
			if ( isset( $mobile_menu_padding['right'] ) ) {
				$css .= 'padding-right:' . $this->format_spacing_value( $mobile_menu_padding['right'], $unit ) . '!important;';
			}
			if ( isset( $mobile_menu_padding['bottom'] ) ) {
				$css .= 'padding-bottom:' . $this->format_spacing_value( $mobile_menu_padding['bottom'], $unit ) . '!important;';
			}
			if ( isset( $mobile_menu_padding['left'] ) ) {
				$css .= 'padding-left:' . $this->format_spacing_value( $mobile_menu_padding['left'], $unit ) . '!important;';
			}
			
			$css .= '}';
		} elseif ( isset( $spacing['menu_padding'] ) ) {
			// Scale down by 75% (Requirement 9.2, 9.3).
			$menu_padding = $spacing['menu_padding'];
			$unit = isset( $menu_padding['unit'] ) ? $menu_padding['unit'] : 'px';

			$css .= 'body.wp-admin #adminmenu li.menu-top > a{';
			
			if ( isset( $menu_padding['top'] ) ) {
				$scaled_value = $this->scale_spacing_value( $menu_padding['top'], 0.75 );
				$css .= 'padding-top:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			if ( isset( $menu_padding['right'] ) ) {
				$scaled_value = $this->scale_spacing_value( $menu_padding['right'], 0.75 );
				$css .= 'padding-right:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			if ( isset( $menu_padding['bottom'] ) ) {
				$scaled_value = $this->scale_spacing_value( $menu_padding['bottom'], 0.75 );
				$css .= 'padding-bottom:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			if ( isset( $menu_padding['left'] ) ) {
				$scaled_value = $this->scale_spacing_value( $menu_padding['left'], 0.75 );
				$css .= 'padding-left:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			
			$css .= '}';
		}

		// Mobile menu margin - scale by 70% (Requirement 9.3).
		if ( isset( $spacing['menu_margin'] ) && is_array( $spacing['menu_margin'] ) ) {
			$menu_margin = $spacing['menu_margin'];
			$unit = isset( $menu_margin['unit'] ) ? $menu_margin['unit'] : 'px';

			$css .= 'body.wp-admin #adminmenu li.menu-top{';
			
			if ( isset( $menu_margin['top'] ) ) {
				$scaled_value = $this->scale_spacing_value( $menu_margin['top'], 0.7 );
				$css .= 'margin-top:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			if ( isset( $menu_margin['bottom'] ) ) {
				$scaled_value = $this->scale_spacing_value( $menu_margin['bottom'], 0.7 );
				$css .= 'margin-bottom:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			
			$css .= '}';
		}

		// Mobile admin bar padding - use overrides or scale (Requirement 10.4, 10.5).
		if ( $mobile_overrides_enabled && isset( $spacing['mobile_overrides']['admin_bar_padding'] ) ) {
			$mobile_admin_bar_padding = $spacing['mobile_overrides']['admin_bar_padding'];
			$unit = isset( $mobile_admin_bar_padding['unit'] ) ? $mobile_admin_bar_padding['unit'] : 'px';

			$css .= 'body.wp-admin #wpadminbar .ab-item{';
			
			if ( isset( $mobile_admin_bar_padding['right'] ) ) {
				$css .= 'padding-right:' . $this->format_spacing_value( $mobile_admin_bar_padding['right'], $unit ) . '!important;';
			}
			if ( isset( $mobile_admin_bar_padding['left'] ) ) {
				$css .= 'padding-left:' . $this->format_spacing_value( $mobile_admin_bar_padding['left'], $unit ) . '!important;';
			}
			
			$css .= '}';
		} elseif ( isset( $spacing['admin_bar_padding'] ) ) {
			$admin_bar_padding = $spacing['admin_bar_padding'];
			$unit = isset( $admin_bar_padding['unit'] ) ? $admin_bar_padding['unit'] : 'px';

			$css .= 'body.wp-admin #wpadminbar .ab-item{';
			
			if ( isset( $admin_bar_padding['right'] ) ) {
				$scaled_value = $this->scale_spacing_value( $admin_bar_padding['right'], 0.75 );
				$css .= 'padding-right:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			if ( isset( $admin_bar_padding['left'] ) ) {
				$scaled_value = $this->scale_spacing_value( $admin_bar_padding['left'], 0.75 );
				$css .= 'padding-left:' . $this->format_spacing_value( $scaled_value, $unit ) . '!important;';
			}
			
			$css .= '}';
		}

		$css .= '}';

		return $css;
	}

	/**
	 * Scale spacing value by a factor.
	 *
	 * @param mixed $value  Spacing value.
	 * @param float $factor Scaling factor (e.g., 0.9 for 90%, 0.75 for 75%).
	 * @return mixed Scaled spacing value.
	 */
	private function scale_spacing_value( $value, $factor ) {
		$scaled = floatval( $value ) * $factor;
		// Round to 3 decimal places for rem, or nearest integer for px.
		return round( $scaled, 3 );
	}

	/**
	 * Format spacing value with unit.
	 *
	 * @param mixed  $value Spacing value.
	 * @param string $unit  Unit (px or rem).
	 * @return string Formatted spacing value with unit.
	 */
	private function format_spacing_value( $value, $unit ) {
		if ( 'rem' === $unit ) {
			return number_format( floatval( $value ), 3, '.', '' ) . 'rem';
		}
		return intval( $value ) . 'px';
	}

	/**
	 * Generate palette CSS variables from current palette.
	 * Creates CSS custom properties for all palette colors.
	 * Requirement 4.3 - Use CSS custom properties for all color values.
	 *
	 * @param array $settings Settings array.
	 * @return string Palette CSS variables.
	 */
	private function generate_palette_css( $settings ) {
		try {
			// Get current palette from settings.
			$palettes = isset( $settings['palettes'] ) ? $settings['palettes'] : array();
			$current_palette_id = isset( $palettes['current'] ) ? $palettes['current'] : '';

			// Return empty if no palette selected.
			if ( empty( $current_palette_id ) ) {
				return '';
			}

			// Get palette colors (this would come from MASE_Settings::get_palette()).
			// For now, we'll check if palette colors are in settings.
			$palette_colors = isset( $palettes['colors'] ) ? $palettes['colors'] : array();

			if ( empty( $palette_colors ) ) {
				return '';
			}

			$css = ':root{';

			// Generate CSS variables for each color.
			if ( isset( $palette_colors['primary'] ) ) {
				$css .= '--mase-primary:' . esc_attr( $palette_colors['primary'] ) . ';';
			}
			if ( isset( $palette_colors['secondary'] ) ) {
				$css .= '--mase-secondary:' . esc_attr( $palette_colors['secondary'] ) . ';';
			}
			if ( isset( $palette_colors['accent'] ) ) {
				$css .= '--mase-accent:' . esc_attr( $palette_colors['accent'] ) . ';';
			}
			if ( isset( $palette_colors['background'] ) ) {
				$css .= '--mase-background:' . esc_attr( $palette_colors['background'] ) . ';';
			}
			if ( isset( $palette_colors['text'] ) ) {
				$css .= '--mase-text:' . esc_attr( $palette_colors['text'] ) . ';';
			}
			if ( isset( $palette_colors['text_secondary'] ) ) {
				$css .= '--mase-text-secondary:' . esc_attr( $palette_colors['text_secondary'] ) . ';';
			}

			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Palette CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate glassmorphism CSS with backdrop-filter effects.
	 * Requirement 5.1 - Apply backdrop-filter blur with configurable intensity.
	 *
	 * @param array $settings Settings array.
	 * @return string Glassmorphism CSS.
	 */
	private function generate_glassmorphism_css( $settings ) {
		try {
			$visual_effects = isset( $settings['visual_effects'] ) ? $settings['visual_effects'] : array();

			// Return empty if visual effects not configured.
			if ( empty( $visual_effects ) ) {
				return '';
			}

			$css = '';

			// Admin bar glassmorphism.
			if ( isset( $visual_effects['admin_bar']['glassmorphism'] ) && 
				 $visual_effects['admin_bar']['glassmorphism'] ) {
				
				$blur_intensity = isset( $visual_effects['admin_bar']['blur_intensity'] ) ? 
					absint( $visual_effects['admin_bar']['blur_intensity'] ) : 20;

				// Clamp blur intensity to 0-50px range.
				$blur_intensity = max( 0, min( 50, $blur_intensity ) );

				$css .= 'body.wp-admin #wpadminbar{';
				$css .= 'backdrop-filter:blur(' . $blur_intensity . 'px)!important;';
				$css .= '-webkit-backdrop-filter:blur(' . $blur_intensity . 'px)!important;';
				$css .= 'background:rgba(255,255,255,0.1)!important;';
				$css .= 'border:1px solid rgba(255,255,255,0.2)!important;';
				$css .= '}';

				// Fallback for browsers without backdrop-filter support (Requirement 19.5).
				$css .= '@supports not (backdrop-filter:blur(10px)){';
				$css .= 'body.wp-admin #wpadminbar{';
				$css .= 'background:rgba(255,255,255,0.9)!important;';
				$css .= '}';
				$css .= '}';
			}

			// Admin menu glassmorphism.
			if ( isset( $visual_effects['admin_menu']['glassmorphism'] ) && 
				 $visual_effects['admin_menu']['glassmorphism'] ) {
				
				$blur_intensity = isset( $visual_effects['admin_menu']['blur_intensity'] ) ? 
					absint( $visual_effects['admin_menu']['blur_intensity'] ) : 20;

				$blur_intensity = max( 0, min( 50, $blur_intensity ) );

				$css .= 'body.wp-admin #adminmenu,';
				$css .= 'body.wp-admin #adminmenuback,';
				$css .= 'body.wp-admin #adminmenuwrap{';
				$css .= 'backdrop-filter:blur(' . $blur_intensity . 'px)!important;';
				$css .= '-webkit-backdrop-filter:blur(' . $blur_intensity . 'px)!important;';
				$css .= 'background:rgba(255,255,255,0.1)!important;';
				$css .= '}';

				// Fallback for browsers without backdrop-filter support.
				$css .= '@supports not (backdrop-filter:blur(10px)){';
				$css .= 'body.wp-admin #adminmenu,';
				$css .= 'body.wp-admin #adminmenuback,';
				$css .= 'body.wp-admin #adminmenuwrap{';
				$css .= 'background:rgba(255,255,255,0.9)!important;';
				$css .= '}';
				$css .= '}';
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Glassmorphism CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate floating elements CSS with margin-based positioning.
	 * Requirement 5.2 - Apply configurable top margin to create floating appearance.
	 *
	 * @param array $settings Settings array.
	 * @return string Floating elements CSS.
	 */
	private function generate_floating_elements_css( $settings ) {
		try {
			$visual_effects = isset( $settings['visual_effects'] ) ? $settings['visual_effects'] : array();

			if ( empty( $visual_effects ) ) {
				return '';
			}

			$css = '';

			// Admin bar floating effect.
			if ( isset( $visual_effects['admin_bar']['floating'] ) && 
				 $visual_effects['admin_bar']['floating'] ) {
				
				$floating_margin = isset( $visual_effects['admin_bar']['floating_margin'] ) ? 
					absint( $visual_effects['admin_bar']['floating_margin'] ) : 8;

				// Clamp margin to 0-20px range.
				$floating_margin = max( 0, min( 20, $floating_margin ) );

				$css .= 'body.wp-admin #wpadminbar{';
				$css .= 'margin-top:' . $floating_margin . 'px!important;';
				$css .= '}';

				// Adjust page margin to compensate.
				$css .= 'body.wp-admin.admin-bar{';
				$css .= 'margin-top:' . ( 32 + $floating_margin ) . 'px!important;';
				$css .= '}';
			}

			// Admin menu floating effect.
			if ( isset( $visual_effects['admin_menu']['floating'] ) && 
				 $visual_effects['admin_menu']['floating'] ) {
				
				$floating_margin = isset( $visual_effects['admin_menu']['floating_margin'] ) ? 
					absint( $visual_effects['admin_menu']['floating_margin'] ) : 8;

				$floating_margin = max( 0, min( 20, $floating_margin ) );

				$css .= 'body.wp-admin #adminmenu,';
				$css .= 'body.wp-admin #adminmenuback,';
				$css .= 'body.wp-admin #adminmenuwrap{';
				$css .= 'margin-left:' . $floating_margin . 'px!important;';
				$css .= 'margin-top:' . $floating_margin . 'px!important;';
				$css .= '}';
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Floating elements CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate shadows CSS for shadow presets and custom shadows.
	 * Requirements 5.3, 5.4 - Apply predefined and custom shadow values.
	 *
	 * @param array $settings Settings array.
	 * @return string Shadows CSS.
	 */
	private function generate_shadows_css( $settings ) {
		try {
			$visual_effects = isset( $settings['visual_effects'] ) ? $settings['visual_effects'] : array();

			if ( empty( $visual_effects ) ) {
				return '';
			}

			$css = '';

			// Shadow presets.
			$shadow_presets = array(
				'flat'     => 'none',
				'subtle'   => '0 2px 8px rgba(0,0,0,0.1)',
				'elevated' => '0 4px 12px rgba(0,0,0,0.15)',
				'floating' => '0 8px 20px 2px rgba(0,0,0,0.2)',
			);

			// Admin bar shadow.
			if ( isset( $visual_effects['admin_bar']['shadow'] ) ) {
				$shadow = $visual_effects['admin_bar']['shadow'];

				// Check if it's a preset or custom.
				if ( isset( $shadow_presets[ $shadow ] ) ) {
					$shadow_value = $shadow_presets[ $shadow ];
				} elseif ( 'custom' === $shadow && isset( $visual_effects['admin_bar']['custom_shadow'] ) ) {
					$shadow_value = esc_attr( $visual_effects['admin_bar']['custom_shadow'] );
				} else {
					$shadow_value = 'none';
				}

				if ( 'none' !== $shadow_value ) {
					$css .= 'body.wp-admin #wpadminbar{';
					$css .= 'box-shadow:' . $shadow_value . '!important;';
					$css .= '}';
				}
			}

			// Admin menu shadow.
			if ( isset( $visual_effects['admin_menu']['shadow'] ) ) {
				$shadow = $visual_effects['admin_menu']['shadow'];

				if ( isset( $shadow_presets[ $shadow ] ) ) {
					$shadow_value = $shadow_presets[ $shadow ];
				} elseif ( 'custom' === $shadow && isset( $visual_effects['admin_menu']['custom_shadow'] ) ) {
					$shadow_value = esc_attr( $visual_effects['admin_menu']['custom_shadow'] );
				} else {
					$shadow_value = 'none';
				}

				if ( 'none' !== $shadow_value ) {
					$css .= 'body.wp-admin #adminmenu,';
					$css .= 'body.wp-admin #adminmenuback,';
					$css .= 'body.wp-admin #adminmenuwrap{';
					$css .= 'box-shadow:' . $shadow_value . '!important;';
					$css .= '}';
				}
			}

			// Border radius (Requirement 5.5).
			if ( isset( $visual_effects['admin_bar']['border_radius'] ) ) {
				$border_radius = absint( $visual_effects['admin_bar']['border_radius'] );
				$border_radius = max( 0, min( 20, $border_radius ) );

				if ( $border_radius > 0 ) {
					$css .= 'body.wp-admin #wpadminbar{';
					$css .= 'border-radius:' . $border_radius . 'px!important;';
					$css .= '}';
				}
			}

			if ( isset( $visual_effects['admin_menu']['border_radius'] ) ) {
				$border_radius = absint( $visual_effects['admin_menu']['border_radius'] );
				$border_radius = max( 0, min( 20, $border_radius ) );

				if ( $border_radius > 0 ) {
					$css .= 'body.wp-admin #adminmenu,';
					$css .= 'body.wp-admin #adminmenuback,';
					$css .= 'body.wp-admin #adminmenuwrap{';
					$css .= 'border-radius:' . $border_radius . 'px!important;';
					$css .= '}';
				}
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Shadows CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate animations CSS for page and element animations.
	 * Requirement 5.5 - Apply animations and transitions.
	 *
	 * @param array $settings Settings array.
	 * @return string Animations CSS.
	 */
	private function generate_animations_css( $settings ) {
		try {
			$effects = isset( $settings['effects'] ) ? $settings['effects'] : array();
			$visual_effects = isset( $settings['visual_effects'] ) ? $settings['visual_effects'] : array();

			$css = '';

			// Page animations.
			if ( isset( $effects['page_animations'] ) && $effects['page_animations'] ) {
				$animation_speed = isset( $effects['animation_speed'] ) ? 
					absint( $effects['animation_speed'] ) : 300;

				$css .= 'body.wp-admin{';
				$css .= 'animation:mase-fade-in ' . $animation_speed . 'ms ease-in-out;';
				$css .= '}';

				$css .= '@keyframes mase-fade-in{';
				$css .= '0%{opacity:0;transform:translateY(10px);}';
				$css .= '100%{opacity:1;transform:translateY(0);}';
				$css .= '}';
			}

			// Hover effects.
			if ( isset( $effects['hover_effects'] ) && $effects['hover_effects'] ) {
				$css .= 'body.wp-admin #adminmenu a:hover,';
				$css .= 'body.wp-admin .button:hover,';
				$css .= 'body.wp-admin .button-primary:hover{';
				$css .= 'transform:translateY(-2px)!important;';
				$css .= 'transition:transform 200ms ease!important;';
				$css .= '}';
			}

			// Microanimations.
			if ( isset( $visual_effects['microanimations_enabled'] ) && 
				 $visual_effects['microanimations_enabled'] ) {
				
				$css .= 'body.wp-admin #adminmenu a,';
				$css .= 'body.wp-admin .button,';
				$css .= 'body.wp-admin .button-primary,';
				$css .= 'body.wp-admin input[type="text"],';
				$css .= 'body.wp-admin input[type="email"],';
				$css .= 'body.wp-admin textarea,';
				$css .= 'body.wp-admin select{';
				$css .= 'transition:all 200ms cubic-bezier(0.4,0,0.2,1)!important;';
				$css .= '}';
			}

			// Reduced motion support (Requirement 13.2).
			$css .= '@media (prefers-reduced-motion:reduce){';
			$css .= 'body.wp-admin,';
			$css .= 'body.wp-admin *{';
			$css .= 'animation:none!important;';
			$css .= 'transition:none!important;';
			$css .= '}';
			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Animations CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate mobile CSS with responsive media queries.
	 * Requirements 7.1, 7.2, 7.3, 7.4, 7.5 - Mobile optimization.
	 *
	 * @param array $settings Settings array.
	 * @return string Mobile CSS.
	 */
	private function generate_mobile_css( $settings ) {
		try {
			$mobile = isset( $settings['mobile'] ) ? $settings['mobile'] : array();

			// Return empty if mobile optimization not enabled.
			if ( ! isset( $mobile['optimized'] ) || ! $mobile['optimized'] ) {
				return '';
			}

			$css = '';

			// Mobile media query (<782px).
			$css .= '@media screen and (max-width:782px){';

			// Touch-friendly targets (Requirement 7.2).
			if ( isset( $mobile['touch_friendly'] ) && $mobile['touch_friendly'] ) {
				$css .= 'body.wp-admin #adminmenu a,';
				$css .= 'body.wp-admin .button,';
				$css .= 'body.wp-admin .button-primary{';
				$css .= 'min-height:44px!important;';
				$css .= 'min-width:44px!important;';
				$css .= 'padding:12px 16px!important;';
				$css .= '}';
			}

			// Compact mode (Requirement 7.4).
			if ( isset( $mobile['compact_mode'] ) && $mobile['compact_mode'] ) {
				$css .= 'body.wp-admin #wpadminbar,';
				$css .= 'body.wp-admin #adminmenu,';
				$css .= 'body.wp-admin #wpbody-content{';
				$css .= 'padding:0.75em!important;';
				$css .= 'margin:0.5em!important;';
				$css .= '}';
			}

			// Reduced effects (Requirement 7.3).
			if ( isset( $mobile['reduced_effects'] ) && $mobile['reduced_effects'] ) {
				$css .= 'body.wp-admin #wpadminbar,';
				$css .= 'body.wp-admin #adminmenu{';
				$css .= 'backdrop-filter:none!important;';
				$css .= '-webkit-backdrop-filter:none!important;';
				$css .= 'box-shadow:none!important;';
				$css .= 'animation:none!important;';
				$css .= 'transition:none!important;';
				$css .= '}';
			}

			// Stack layout vertically (Requirement 7.5).
			$css .= 'body.wp-admin #wpcontent{';
			$css .= 'display:block!important;';
			$css .= 'width:100%!important;';
			$css .= '}';

			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Mobile CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate custom CSS from user input.
	 * Requirement 14.1 - Append custom CSS to generated output.
	 *
	 * @param array $settings Settings array.
	 * @return string Custom CSS.
	 */
	private function generate_custom_css( $settings ) {
		try {
			$advanced = isset( $settings['advanced'] ) ? $settings['advanced'] : array();

			// Get custom CSS.
			$custom_css = isset( $advanced['custom_css'] ) ? $advanced['custom_css'] : '';

			// Return empty if no custom CSS.
			if ( empty( $custom_css ) ) {
				return '';
			}

			// Sanitize custom CSS (Requirement 14.4).
			$custom_css = wp_kses_post( $custom_css );

			// Add comment to identify custom CSS section.
			$css = '/* Custom CSS */';
			$css .= $custom_css;

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Custom CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Generate menu logo CSS.
	 * Positions and styles the logo in the admin menu (Requirements 16.2, 16.3, 16.4, 16.8).
	 *
	 * @param array $admin_menu Admin menu settings array.
	 * @return string Menu logo CSS.
	 */
	private function generate_menu_logo_css( $admin_menu ) {
		try {
			// Check if logo is enabled (Requirement 16.1).
			$logo_enabled = isset( $admin_menu['logo_enabled'] ) && $admin_menu['logo_enabled'];
			
			if ( ! $logo_enabled || empty( $admin_menu['logo_url'] ) ) {
				return '';
			}

			$logo_url = esc_url( $admin_menu['logo_url'] );
			$logo_position = isset( $admin_menu['logo_position'] ) ? $admin_menu['logo_position'] : 'top';
			$logo_width = isset( $admin_menu['logo_width'] ) ? absint( $admin_menu['logo_width'] ) : 100;
			$logo_alignment = isset( $admin_menu['logo_alignment'] ) ? $admin_menu['logo_alignment'] : 'center';

			$css = '';

			// Create logo container (Requirement 16.2, 16.3, 16.4).
			$css .= 'body.wp-admin #adminmenu::' . ( $logo_position === 'top' ? 'before' : 'after' ) . ' {';
			$css .= 'content: "";';
			$css .= 'display: block;';
			$css .= 'width: ' . $logo_width . 'px;';
			$css .= 'height: auto;';
			$css .= 'max-width: 100%;';
			$css .= 'padding: 15px;';
			$css .= 'box-sizing: border-box;';
			$css .= 'background-image: url("' . $logo_url . '");';
			$css .= 'background-size: contain;';
			$css .= 'background-repeat: no-repeat;';
			$css .= 'background-position: center;';
			
			// Apply alignment (Requirement 16.4).
			if ( $logo_alignment === 'left' ) {
				$css .= 'margin-left: 0;';
				$css .= 'margin-right: auto;';
				$css .= 'background-position: left center;';
			} elseif ( $logo_alignment === 'right' ) {
				$css .= 'margin-left: auto;';
				$css .= 'margin-right: 0;';
				$css .= 'background-position: right center;';
			} else {
				$css .= 'margin-left: auto;';
				$css .= 'margin-right: auto;';
				$css .= 'background-position: center;';
			}
			
			// Maintain aspect ratio (Requirement 16.8).
			$css .= 'aspect-ratio: auto;';
			$css .= 'min-height: 40px;';
			
			$css .= '}';

			// Adjust menu padding to accommodate logo.
			if ( $logo_position === 'top' ) {
				$css .= 'body.wp-admin #adminmenu {';
				$css .= 'padding-top: 10px;';
				$css .= '}';
			} else {
				$css .= 'body.wp-admin #adminmenu {';
				$css .= 'padding-bottom: 10px;';
				$css .= '}';
			}

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Menu logo CSS generation failed: %s', $e->getMessage() ) );
			return '';
		}
	}

	/**
	 * Minify CSS by removing whitespace and comments.
	 *
	 * @param string $css CSS string to minify.
	 * @return string Minified CSS.
	 */
	public function minify( $css ) {
		// Remove comments.
		$css = preg_replace( '!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css );

		// Remove whitespace.
		$css = str_replace( array( "\r\n", "\r", "\n", "\t", '  ', '    ', '    ' ), '', $css );

		// Remove spaces around CSS syntax characters.
		$css = str_replace( array( ' {', '{ ', ' }', '} ', ' :', ': ', ' ;', '; ', ' ,', ', ' ), array( '{', '{', '}', '}', ':', ':', ';', ';', ',', ',' ), $css );

		return trim( $css );
	}
}
