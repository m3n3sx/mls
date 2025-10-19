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

			// Generate palette CSS variables (Requirement 4.3).
			$css .= $this->generate_palette_css( $settings );

			// Generate admin bar CSS.
			$css .= $this->generate_admin_bar_css( $settings );

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

			$css = '';

			// Admin bar background and height.
			$css .= 'body.wp-admin #wpadminbar {';
			$css .= 'background-color: ' . $bg_color . ' !important;';
			$css .= 'height: ' . $height . 'px !important;';
			$css .= '}';

			// Admin bar text color.
			$css .= 'body.wp-admin #wpadminbar .ab-item,';
			$css .= 'body.wp-admin #wpadminbar a.ab-item,';
			$css .= 'body.wp-admin #wpadminbar > #wp-toolbar span.ab-label,';
			$css .= 'body.wp-admin #wpadminbar > #wp-toolbar span.noticon {';
			$css .= 'color: ' . $text_color . ' !important;';
			$css .= '}';

			// Adjust page margin for admin bar height.
			$css .= 'body.wp-admin.admin-bar {';
			$css .= 'margin-top: ' . $height . 'px !important;';
			$css .= '}';

			// Adjust admin bar submenu position.
			$css .= 'body.wp-admin #wpadminbar .ab-sub-wrapper {';
			$css .= 'top: ' . $height . 'px !important;';
			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Admin bar CSS generation failed: %s', $e->getMessage() ) );
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

			$css = '';

			// Admin menu background and width.
			$css .= 'body.wp-admin #adminmenu,';
			$css .= 'body.wp-admin #adminmenuback,';
			$css .= 'body.wp-admin #adminmenuwrap {';
			$css .= 'background-color: ' . $bg_color . ' !important;';
			$css .= 'width: ' . $width . 'px !important;';
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

			// Adjust content area margin for menu width.
			$css .= 'body.wp-admin #wpcontent,';
			$css .= 'body.wp-admin #wpfooter {';
			$css .= 'margin-left: ' . $width . 'px !important;';
			$css .= '}';

			// Adjust for folded menu.
			$css .= 'body.wp-admin.folded #wpcontent,';
			$css .= 'body.wp-admin.folded #wpfooter {';
			$css .= 'margin-left: 36px !important;';
			$css .= '}';

			return $css;

		} catch ( Exception $e ) {
			error_log( sprintf( 'MASE: Admin menu CSS generation failed: %s', $e->getMessage() ) );
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
			if ( isset( $visual_effects['admin_menu'] ) ) {
				$css .= $this->generate_element_visual_effects(
					'body.wp-admin #adminmenu a',
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
				$css .= 'body.wp-admin #adminmenu a,';
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
			if ( isset( $spacing['submenu_spacing'] ) && is_array( $spacing['submenu_spacing'] ) ) {
				$submenu_spacing = $spacing['submenu_spacing'];
				$unit = isset( $submenu_spacing['unit'] ) ? $submenu_spacing['unit'] : 'px';

				// Submenu padding.
				$css .= 'body.wp-admin #adminmenu .wp-submenu a{';
				
				if ( isset( $submenu_spacing['padding_top'] ) ) {
					$css .= 'padding-top:' . $this->format_spacing_value( $submenu_spacing['padding_top'], $unit ) . '!important;';
				}
				if ( isset( $submenu_spacing['padding_right'] ) ) {
					$css .= 'padding-right:' . $this->format_spacing_value( $submenu_spacing['padding_right'], $unit ) . '!important;';
				}
				if ( isset( $submenu_spacing['padding_bottom'] ) ) {
					$css .= 'padding-bottom:' . $this->format_spacing_value( $submenu_spacing['padding_bottom'], $unit ) . '!important;';
				}
				if ( isset( $submenu_spacing['padding_left'] ) ) {
					$css .= 'padding-left:' . $this->format_spacing_value( $submenu_spacing['padding_left'], $unit ) . '!important;';
				}
				
				$css .= '}';

				// Submenu margin and offset.
				$css .= 'body.wp-admin #adminmenu .wp-submenu{';
				
				if ( isset( $submenu_spacing['margin_top'] ) ) {
					$css .= 'margin-top:' . $this->format_spacing_value( $submenu_spacing['margin_top'], $unit ) . '!important;';
				}
				if ( isset( $submenu_spacing['offset_left'] ) ) {
					$css .= 'left:' . $this->format_spacing_value( $submenu_spacing['offset_left'], $unit ) . '!important;';
				}
				
				$css .= '}';
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
