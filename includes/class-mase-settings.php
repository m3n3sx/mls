<?php
/**
 * MASE Settings Management Class
 *
 * Handles settings storage, retrieval, validation, and defaults.
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class MASE_Settings
 *
 * Centralized settings management with validation and defaults.
 */
class MASE_Settings {

	/**
	 * WordPress option name for storing settings.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'mase_settings';

	/**
	 * Current plugin version for migration tracking.
	 *
	 * @var string
	 */
	const PLUGIN_VERSION = '1.2.0';

	/**
	 * Option name for storing plugin version.
	 *
	 * @var string
	 */
	const VERSION_OPTION_NAME = 'mase_version';

	/**
	 * Get option value.
	 *
	 * Retrieves settings from WordPress options table and merges with defaults
	 * to ensure completeness (Requirement 16.3).
	 *
	 * @param string|null $key     Optional. Specific setting key to retrieve.
	 * @param mixed       $default Optional. Default value if key not found.
	 * @return mixed Setting value or full settings array.
	 */
	public function get_option( $key = null, $default = null ) {
		$defaults = $this->get_defaults();
		$settings = get_option( self::OPTION_NAME, array() );

		// Merge with defaults to ensure all keys exist (Requirement 16.3).
		$settings = $this->array_merge_recursive_distinct( $defaults, $settings );

		if ( null === $key ) {
			return $settings;
		}

		return isset( $settings[ $key ] ) ? $settings[ $key ] : $default;
	}

	/**
	 * Recursively merge arrays, with values from the second array taking precedence.
	 *
	 * Unlike array_merge_recursive, this function does not convert values to arrays
	 * when keys are duplicated. Instead, values from $array2 overwrite values from $array1.
	 *
	 * @param array $array1 Base array with default values.
	 * @param array $array2 Array with user values that override defaults.
	 * @return array Merged array.
	 */
	private function array_merge_recursive_distinct( array $array1, array $array2 ) {
		$merged = $array1;

		foreach ( $array2 as $key => $value ) {
			if ( is_array( $value ) && isset( $merged[ $key ] ) && is_array( $merged[ $key ] ) ) {
				$merged[ $key ] = $this->array_merge_recursive_distinct( $merged[ $key ], $value );
			} else {
				$merged[ $key ] = $value;
			}
		}

		return $merged;
	}



	/**
	 * Update option value.
	 * Requirement 7.1: Apply mobile-optimized settings automatically during save.
	 *
	 * @param array $data Settings data to save.
	 * @return bool True on success, false on failure.
	 */
	public function update_option( $data ) {
		try {
			error_log( 'MASE: Starting validation...' );
			$validated = $this->validate( $data );
			
			if ( is_wp_error( $validated ) ) {
				// Log validation errors for debugging
				error_log( 'MASE: Validation failed - ' . $validated->get_error_message() );
				error_log( 'MASE: Validation errors: ' . print_r( $validated->get_error_data(), true ) );
				return false;
			}

			error_log( 'MASE: Validation passed, applying mobile optimization...' );
			// Apply mobile optimization if on mobile device (Requirement 7.1).
			$mobile_optimizer = new MASE_Mobile_Optimizer();
			if ( $mobile_optimizer->is_mobile() ) {
				$validated = $mobile_optimizer->get_optimized_settings( $validated );
			}

			error_log( 'MASE: Saving to database...' );
			
			// Save to database
			// Note: update_option() returns false if value is unchanged, but that's OK
			update_option( self::OPTION_NAME, $validated );
			
			// Verify the save by reading back
			$saved_value = get_option( self::OPTION_NAME );
			if ( $saved_value === $validated || $saved_value == $validated ) {
				error_log( 'MASE: Save successful (verified)' );
				return true;
			}
			
			error_log( 'MASE: Save verification failed' );
			return false;
		} catch ( Exception $e ) {
			error_log( 'MASE: Exception in update_option: ' . $e->getMessage() );
			error_log( 'MASE: Stack trace: ' . $e->getTraceAsString() );
			return false;
		}
	}

	/**
	 * Get default settings.
	 *
	 * Extended with new categories: palettes, templates, typography (enhanced),
	 * visual_effects (enhanced), effects, advanced, mobile, accessibility, keyboard_shortcuts.
	 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
	 *
	 * @return array Default settings array.
	 */
	public function get_defaults() {
		return array(
			'admin_bar'   => array(
				'bg_color'    => '#23282d',
				'text_color'  => '#ffffff',
				'height'      => 32,
			),
			'admin_menu'  => array(
				'bg_color'          => '#23282d',
				'text_color'        => '#ffffff',
				'hover_bg_color'    => '#191e23',
				'hover_text_color'  => '#00b9eb',
				'width'             => 160,
				'height_mode'       => 'full',
				'item_padding'      => '6px 12px',
				'font_size'         => 13,
				'line_height'       => 18,
			),
			'performance' => array(
				'enable_minification' => true,
				'cache_duration'      => 3600,
			),
			// NEW: Palettes category (Requirement 3.1).
			'palettes' => array(
				'current' => 'professional-blue',
				'custom'  => array(), // Array of user-created palettes.
			),
			// NEW: Templates category (Requirement 3.2).
			'templates' => array(
				'current' => 'default',
				'custom'  => array(), // Array of user-created templates.
			),
			// EXTENDED: Typography with enhanced settings (Requirement 3.3).
			'typography'  => array(
				'admin_bar'  => array(
					'font_size'      => 13,
					'font_weight'    => 400,
					'line_height'    => 1.5,
					'letter_spacing' => 0,
					'text_transform' => 'none',
					'font_family'    => 'system',
				),
				'admin_menu' => array(
					'font_size'      => 13,
					'font_weight'    => 400,
					'line_height'    => 1.5,
					'letter_spacing' => 0,
					'text_transform' => 'none',
					'font_family'    => 'system',
				),
				'content'    => array(
					'font_size'      => 13,
					'font_weight'    => 400,
					'line_height'    => 1.6,
					'letter_spacing' => 0,
					'text_transform' => 'none',
					'font_family'    => 'system',
				),
				'google_fonts' => 'Inter:300,400,500,600,700',
				'enabled'      => true,
			),
			// EXTENDED: Visual effects with glassmorphism and floating (Requirement 3.4).
			'visual_effects' => array(
				'admin_bar' => array(
					'glassmorphism'    => false,
					'blur_intensity'   => 20,
					'floating'         => false,
					'floating_margin'  => 8,
					'border_radius'    => 0,
					'shadow'           => 'none',
					'shadow_intensity' => 'none',
					'shadow_direction' => 'bottom',
					'shadow_blur'      => 10,
					'shadow_color'     => 'rgba(0, 0, 0, 0.15)',
				),
				'admin_menu' => array(
					'glassmorphism'    => false,
					'blur_intensity'   => 20,
					'floating'         => false,
					'floating_margin'  => 8,
					'border_radius'    => 0,
					'shadow'           => 'none',
					'shadow_intensity' => 'none',
					'shadow_direction' => 'bottom',
					'shadow_blur'      => 10,
					'shadow_color'     => 'rgba(0, 0, 0, 0.15)',
				),
				'buttons' => array(
					'border_radius'    => 3,
					'shadow_intensity' => 'subtle',
					'shadow_direction' => 'bottom',
					'shadow_blur'      => 8,
					'shadow_color'     => 'rgba(0, 0, 0, 0.1)',
				),
				'form_fields' => array(
					'border_radius'    => 3,
					'shadow_intensity' => 'none',
					'shadow_direction' => 'bottom',
					'shadow_blur'      => 5,
					'shadow_color'     => 'rgba(0, 0, 0, 0.05)',
				),
				'preset'                 => 'flat',
				'disable_mobile_shadows' => false,
				'auto_detect_low_power'  => true,
				'animations_enabled'     => true,
				'microanimations_enabled' => true,
				'particle_system'        => false,
				'sound_effects'          => false,
				'3d_effects'             => false,
			),
			// NEW: Effects category (Requirement 3.5).
			'effects' => array(
				'page_animations'  => true,
				'animation_speed'  => 300,
				'hover_effects'    => true,
				'focus_mode'       => false,
				'performance_mode' => false,
			),
			// NEW: Advanced category (Requirement 3.5).
			'advanced' => array(
				'custom_css'             => '',
				'custom_js'              => '',
				'login_page_enabled'     => true,
				'auto_palette_switch'    => false,
				'auto_palette_times'     => array(
					'morning'   => 'professional-blue',
					'afternoon' => 'energetic-green',
					'evening'   => 'sunset',
					'night'     => 'dark-elegance',
				),
				'backup_enabled'         => true,
				'backup_before_changes'  => true,
			),
			// NEW: Mobile category (Requirement 3.5).
			'mobile' => array(
				'optimized'       => true,
				'touch_friendly'  => true,
				'compact_mode'    => false,
				'reduced_effects' => true,
			),
			// NEW: Accessibility category (Requirement 3.5).
			'accessibility' => array(
				'high_contrast'       => false,
				'reduced_motion'      => false,
				'focus_indicators'    => true,
				'keyboard_navigation' => true,
			),
			// NEW: Keyboard shortcuts category (Requirement 3.5).
			'keyboard_shortcuts' => array(
				'enabled'          => true,
				'palette_switch'   => true,
				'theme_toggle'     => true,
				'focus_mode'       => true,
				'performance_mode' => true,
			),
			'spacing' => array(
				'menu_padding' => array(
					'top'    => 10,
					'right'  => 15,
					'bottom' => 10,
					'left'   => 15,
					'unit'   => 'px',
				),
				'menu_margin' => array(
					'top'    => 2,
					'right'  => 0,
					'bottom' => 2,
					'left'   => 0,
					'unit'   => 'px',
				),
				'admin_bar_padding' => array(
					'top'    => 0,
					'right'  => 10,
					'bottom' => 0,
					'left'   => 10,
					'unit'   => 'px',
				),
				'submenu_spacing' => array(
					'padding_top'    => 5,
					'padding_right'  => 12,
					'padding_bottom' => 5,
					'padding_left'   => 12,
					'margin_top'     => 0,
					'offset_left'    => 0,
					'unit'           => 'px',
				),
				'content_margin' => array(
					'top'    => 20,
					'right'  => 20,
					'bottom' => 20,
					'left'   => 20,
					'unit'   => 'px',
				),
				'mobile_overrides' => array(
					'enabled' => false,
					'menu_padding' => array(
						'top'    => 8,
						'right'  => 12,
						'bottom' => 8,
						'left'   => 12,
						'unit'   => 'px',
					),
					'admin_bar_padding' => array(
						'top'    => 0,
						'right'  => 8,
						'bottom' => 0,
						'left'   => 8,
						'unit'   => 'px',
					),
				),
				'preset' => 'default',
			),
		);
	}

	/**
	 * Validate settings input.
	 *
	 * @param array $input Input data to validate.
	 * @return array|WP_Error Validated data or WP_Error on failure.
	 */
	public function validate( $input ) {
		$validated = array();
		$errors    = array();

		// Validate master settings.
		if ( isset( $input['master'] ) ) {
			$validated['master'] = array();

			if ( isset( $input['master']['enabled'] ) ) {
				$validated['master']['enabled'] = (bool) $input['master']['enabled'];
			}

			if ( isset( $input['master']['apply_to_login'] ) ) {
				$validated['master']['apply_to_login'] = (bool) $input['master']['apply_to_login'];
			}

			if ( isset( $input['master']['dark_mode'] ) ) {
				$validated['master']['dark_mode'] = (bool) $input['master']['dark_mode'];
			}
		}

		// Validate admin bar settings.
		if ( isset( $input['admin_bar'] ) ) {
			$validated['admin_bar'] = array();

			if ( isset( $input['admin_bar']['bg_color'] ) ) {
				$color = sanitize_hex_color( $input['admin_bar']['bg_color'] );
				if ( $color ) {
					$validated['admin_bar']['bg_color'] = $color;
				} else {
					$errors['admin_bar_bg_color'] = 'Invalid hex color format';
				}
			}

			if ( isset( $input['admin_bar']['text_color'] ) ) {
				$color = sanitize_hex_color( $input['admin_bar']['text_color'] );
				if ( $color ) {
					$validated['admin_bar']['text_color'] = $color;
				} else {
					$errors['admin_bar_text_color'] = 'Invalid hex color format';
				}
			}

			if ( isset( $input['admin_bar']['height'] ) ) {
				$height = absint( $input['admin_bar']['height'] );
				if ( $height >= 0 && $height <= 500 ) {
					$validated['admin_bar']['height'] = $height;
				} else {
					$errors['admin_bar_height'] = 'Height must be between 0 and 500';
				}
			}
		}

		// Validate content settings.
		if ( isset( $input['content'] ) ) {
			$validated['content'] = array();

			// Validate content colors
			$color_fields = array( 'bg_color', 'text_color' );
			foreach ( $color_fields as $field ) {
				if ( isset( $input['content'][ $field ] ) ) {
					$color = sanitize_hex_color( $input['content'][ $field ] );
					if ( $color ) {
						$validated['content'][ $field ] = $color;
					} else {
						$errors[ 'content_' . $field ] = 'Invalid hex color format';
					}
				}
			}

			// Validate content padding (0-100px)
			if ( isset( $input['content']['padding'] ) ) {
				$padding = absint( $input['content']['padding'] );
				if ( $padding >= 0 && $padding <= 100 ) {
					$validated['content']['padding'] = $padding;
				} else {
					$errors['content_padding'] = 'Padding must be between 0 and 100';
				}
			}

			// Validate content margin (0-100px)
			if ( isset( $input['content']['margin'] ) ) {
				$margin = absint( $input['content']['margin'] );
				if ( $margin >= 0 && $margin <= 100 ) {
					$validated['content']['margin'] = $margin;
				} else {
					$errors['content_margin'] = 'Margin must be between 0 and 100';
				}
			}

			// Validate content max_width (0-2000px)
			if ( isset( $input['content']['max_width'] ) ) {
				$max_width = absint( $input['content']['max_width'] );
				if ( $max_width >= 0 && $max_width <= 2000 ) {
					$validated['content']['max_width'] = $max_width;
				} else {
					$errors['content_max_width'] = 'Max width must be between 0 and 2000';
				}
			}

			// Validate content border_radius (0-50px)
			if ( isset( $input['content']['border_radius'] ) ) {
				$border_radius = absint( $input['content']['border_radius'] );
				if ( $border_radius >= 0 && $border_radius <= 50 ) {
					$validated['content']['border_radius'] = $border_radius;
				} else {
					$errors['content_border_radius'] = 'Border radius must be between 0 and 50';
				}
			}
		}

		// Validate admin menu settings.
		if ( isset( $input['admin_menu'] ) ) {
			$validated['admin_menu'] = array();

			$color_fields = array( 'bg_color', 'text_color', 'hover_bg_color', 'hover_text_color' );
			foreach ( $color_fields as $field ) {
				if ( isset( $input['admin_menu'][ $field ] ) ) {
					$color = sanitize_hex_color( $input['admin_menu'][ $field ] );
					if ( $color ) {
						$validated['admin_menu'][ $field ] = $color;
					} else {
						$errors[ 'admin_menu_' . $field ] = 'Invalid hex color format';
					}
				}
			}

			if ( isset( $input['admin_menu']['width'] ) ) {
				$width = absint( $input['admin_menu']['width'] );
				if ( $width >= 0 && $width <= 500 ) {
					$validated['admin_menu']['width'] = $width;
				} else {
					$errors['admin_menu_width'] = 'Width must be between 0 and 500';
				}
			}

			if ( isset( $input['admin_menu']['height_mode'] ) ) {
				$height_mode = sanitize_text_field( $input['admin_menu']['height_mode'] );
				$allowed_modes = array( 'full', 'content' );
				if ( in_array( $height_mode, $allowed_modes, true ) ) {
					$validated['admin_menu']['height_mode'] = $height_mode;
				} else {
					$errors['admin_menu_height_mode'] = 'Height mode must be full or content';
				}
			}
		}

		// Validate performance settings.
		if ( isset( $input['performance'] ) ) {
			$validated['performance'] = array();

			if ( isset( $input['performance']['enable_minification'] ) ) {
				$validated['performance']['enable_minification'] = (bool) $input['performance']['enable_minification'];
			}

			if ( isset( $input['performance']['cache_duration'] ) ) {
				$duration = absint( $input['performance']['cache_duration'] );
				if ( $duration >= 300 && $duration <= 86400 ) {
					$validated['performance']['cache_duration'] = $duration;
				} else {
					$errors['cache_duration'] = 'Cache duration must be between 300 and 86400 seconds';
				}
			}
		}

		// Validate typography settings.
		if ( isset( $input['typography'] ) ) {
			$typography_result = $this->validate_typography( $input['typography'] );
			if ( is_wp_error( $typography_result ) ) {
				$errors = array_merge( $errors, $typography_result->get_error_data() );
			} else {
				$validated['typography'] = $typography_result;
			}
		}

		// Validate visual effects settings.
		if ( isset( $input['visual_effects'] ) ) {
			$visual_effects_result = $this->validate_visual_effects( $input['visual_effects'] );
			if ( is_wp_error( $visual_effects_result ) ) {
				$errors = array_merge( $errors, $visual_effects_result->get_error_data() );
			} else {
				$validated['visual_effects'] = $visual_effects_result;
			}
		}

		// Validate spacing settings.
		if ( isset( $input['spacing'] ) ) {
			$spacing_result = $this->validate_spacing( $input['spacing'] );
			if ( is_wp_error( $spacing_result ) ) {
				$errors = array_merge( $errors, $spacing_result->get_error_data() );
			} else {
				$validated['spacing'] = $spacing_result;
			}
		}

		// NEW: Validate palettes settings (Requirement 3.4).
		if ( isset( $input['palettes'] ) ) {
			$validated['palettes'] = array();
			
			if ( isset( $input['palettes']['current'] ) ) {
				$validated['palettes']['current'] = sanitize_text_field( $input['palettes']['current'] );
			}
			
			if ( isset( $input['palettes']['custom'] ) && is_array( $input['palettes']['custom'] ) ) {
				$validated['palettes']['custom'] = $input['palettes']['custom'];
			}
		}

		// NEW: Validate templates settings (Requirement 3.4).
		if ( isset( $input['templates'] ) ) {
			$validated['templates'] = array();
			
			if ( isset( $input['templates']['current'] ) ) {
				$validated['templates']['current'] = sanitize_text_field( $input['templates']['current'] );
			}
			
			if ( isset( $input['templates']['custom'] ) && is_array( $input['templates']['custom'] ) ) {
				$validated['templates']['custom'] = $input['templates']['custom'];
			}
		}

		// NEW: Validate effects settings (Requirement 3.4).
		if ( isset( $input['effects'] ) ) {
			$validated['effects'] = array();
			
			if ( isset( $input['effects']['page_animations'] ) ) {
				$validated['effects']['page_animations'] = (bool) $input['effects']['page_animations'];
			}
			
			if ( isset( $input['effects']['animation_speed'] ) ) {
				$speed = absint( $input['effects']['animation_speed'] );
				if ( $speed >= 100 && $speed <= 1000 ) {
					$validated['effects']['animation_speed'] = $speed;
				} else {
					$errors['animation_speed'] = 'Animation speed must be between 100 and 1000 milliseconds';
				}
			}
			
			if ( isset( $input['effects']['hover_effects'] ) ) {
				$validated['effects']['hover_effects'] = (bool) $input['effects']['hover_effects'];
			}
			
			if ( isset( $input['effects']['focus_mode'] ) ) {
				$validated['effects']['focus_mode'] = (bool) $input['effects']['focus_mode'];
			}
			
			if ( isset( $input['effects']['performance_mode'] ) ) {
				$validated['effects']['performance_mode'] = (bool) $input['effects']['performance_mode'];
			}
		}

		// NEW: Validate advanced settings (Requirement 3.4).
		if ( isset( $input['advanced'] ) ) {
			$validated['advanced'] = array();
			
			if ( isset( $input['advanced']['custom_css'] ) ) {
				$validated['advanced']['custom_css'] = wp_kses_post( $input['advanced']['custom_css'] );
			}
			
			if ( isset( $input['advanced']['custom_js'] ) ) {
				$validated['advanced']['custom_js'] = sanitize_textarea_field( $input['advanced']['custom_js'] );
			}
			
			if ( isset( $input['advanced']['login_page_enabled'] ) ) {
				$validated['advanced']['login_page_enabled'] = (bool) $input['advanced']['login_page_enabled'];
			}
			
			if ( isset( $input['advanced']['auto_palette_switch'] ) ) {
				$validated['advanced']['auto_palette_switch'] = (bool) $input['advanced']['auto_palette_switch'];
			}
			
			if ( isset( $input['advanced']['auto_palette_times'] ) && is_array( $input['advanced']['auto_palette_times'] ) ) {
				$validated['advanced']['auto_palette_times'] = array();
				$time_periods = array( 'morning', 'afternoon', 'evening', 'night' );
				
				foreach ( $time_periods as $period ) {
					if ( isset( $input['advanced']['auto_palette_times'][ $period ] ) ) {
						$validated['advanced']['auto_palette_times'][ $period ] = 
							sanitize_text_field( $input['advanced']['auto_palette_times'][ $period ] );
					}
				}
			}
			
			if ( isset( $input['advanced']['backup_enabled'] ) ) {
				$validated['advanced']['backup_enabled'] = (bool) $input['advanced']['backup_enabled'];
			}
			
			if ( isset( $input['advanced']['backup_before_changes'] ) ) {
				$validated['advanced']['backup_before_changes'] = (bool) $input['advanced']['backup_before_changes'];
			}
		}

		// NEW: Validate mobile settings (Requirement 3.4).
		if ( isset( $input['mobile'] ) ) {
			$validated['mobile'] = array();
			
			if ( isset( $input['mobile']['optimized'] ) ) {
				$validated['mobile']['optimized'] = (bool) $input['mobile']['optimized'];
			}
			
			if ( isset( $input['mobile']['touch_friendly'] ) ) {
				$validated['mobile']['touch_friendly'] = (bool) $input['mobile']['touch_friendly'];
			}
			
			if ( isset( $input['mobile']['compact_mode'] ) ) {
				$validated['mobile']['compact_mode'] = (bool) $input['mobile']['compact_mode'];
			}
			
			if ( isset( $input['mobile']['reduced_effects'] ) ) {
				$validated['mobile']['reduced_effects'] = (bool) $input['mobile']['reduced_effects'];
			}
		}

		// NEW: Validate accessibility settings (Requirement 3.4).
		if ( isset( $input['accessibility'] ) ) {
			$validated['accessibility'] = array();
			
			if ( isset( $input['accessibility']['high_contrast'] ) ) {
				$validated['accessibility']['high_contrast'] = (bool) $input['accessibility']['high_contrast'];
			}
			
			if ( isset( $input['accessibility']['reduced_motion'] ) ) {
				$validated['accessibility']['reduced_motion'] = (bool) $input['accessibility']['reduced_motion'];
			}
			
			if ( isset( $input['accessibility']['focus_indicators'] ) ) {
				$validated['accessibility']['focus_indicators'] = (bool) $input['accessibility']['focus_indicators'];
			}
			
			if ( isset( $input['accessibility']['keyboard_navigation'] ) ) {
				$validated['accessibility']['keyboard_navigation'] = (bool) $input['accessibility']['keyboard_navigation'];
			}
		}

		// NEW: Validate keyboard shortcuts settings (Requirement 3.4).
		if ( isset( $input['keyboard_shortcuts'] ) ) {
			$validated['keyboard_shortcuts'] = array();
			
			if ( isset( $input['keyboard_shortcuts']['enabled'] ) ) {
				$validated['keyboard_shortcuts']['enabled'] = (bool) $input['keyboard_shortcuts']['enabled'];
			}
			
			if ( isset( $input['keyboard_shortcuts']['palette_switch'] ) ) {
				$validated['keyboard_shortcuts']['palette_switch'] = (bool) $input['keyboard_shortcuts']['palette_switch'];
			}
			
			if ( isset( $input['keyboard_shortcuts']['theme_toggle'] ) ) {
				$validated['keyboard_shortcuts']['theme_toggle'] = (bool) $input['keyboard_shortcuts']['theme_toggle'];
			}
			
			if ( isset( $input['keyboard_shortcuts']['focus_mode'] ) ) {
				$validated['keyboard_shortcuts']['focus_mode'] = (bool) $input['keyboard_shortcuts']['focus_mode'];
			}
			
			if ( isset( $input['keyboard_shortcuts']['performance_mode'] ) ) {
				$validated['keyboard_shortcuts']['performance_mode'] = (bool) $input['keyboard_shortcuts']['performance_mode'];
			}
		}

		if ( ! empty( $errors ) ) {
			return new WP_Error( 'validation_failed', 'Validation failed', $errors );
		}

		// Merge with defaults to ensure all keys exist.
		return array_merge( $this->get_defaults(), $validated );
	}

	/**
	 * Validate typography settings.
	 *
	 * @param array $typography Typography settings to validate.
	 * @return array|WP_Error Validated typography data or WP_Error on failure.
	 */
	private function validate_typography( $typography ) {
		$validated = array();
		$errors    = array();

		$elements = array( 'admin_bar', 'admin_menu', 'content' );

		foreach ( $elements as $element ) {
			if ( ! isset( $typography[ $element ] ) ) {
				continue;
			}

			$validated[ $element ] = array();
			$element_data          = $typography[ $element ];

			// Validate font_size (10-32px).
			if ( isset( $element_data['font_size'] ) ) {
				$font_size = absint( $element_data['font_size'] );
				if ( $font_size >= 10 && $font_size <= 32 ) {
					$validated[ $element ]['font_size'] = $font_size;
				} else {
					$errors[ 'typography_' . $element . '_font_size' ] = 'Font size must be between 10 and 32 pixels';
				}
			}

			// Validate font_weight (300, 400, 500, 600, 700).
			if ( isset( $element_data['font_weight'] ) ) {
				$font_weight     = absint( $element_data['font_weight'] );
				$allowed_weights = array( 300, 400, 500, 600, 700 );
				if ( in_array( $font_weight, $allowed_weights, true ) ) {
					$validated[ $element ]['font_weight'] = $font_weight;
				} else {
					$errors[ 'typography_' . $element . '_font_weight' ] = 'Font weight must be 300, 400, 500, 600, or 700';
				}
			}

			// Validate line_height (1.0-2.5).
			if ( isset( $element_data['line_height'] ) ) {
				$line_height = floatval( $element_data['line_height'] );
				if ( $line_height >= 1.0 && $line_height <= 2.5 ) {
					$validated[ $element ]['line_height'] = round( $line_height, 1 );
				} else {
					$errors[ 'typography_' . $element . '_line_height' ] = 'Line height must be between 1.0 and 2.5';
				}
			}

			// Validate letter_spacing (-2 to 5px).
			if ( isset( $element_data['letter_spacing'] ) ) {
				$letter_spacing = intval( $element_data['letter_spacing'] );
				if ( $letter_spacing >= -2 && $letter_spacing <= 5 ) {
					$validated[ $element ]['letter_spacing'] = $letter_spacing;
				} else {
					$errors[ 'typography_' . $element . '_letter_spacing' ] = 'Letter spacing must be between -2 and 5 pixels';
				}
			}

			// Validate text_transform (none, uppercase, lowercase, capitalize).
			if ( isset( $element_data['text_transform'] ) ) {
				$text_transform      = strtolower( sanitize_text_field( $element_data['text_transform'] ) );
				$allowed_transforms  = array( 'none', 'uppercase', 'lowercase', 'capitalize' );
				if ( in_array( $text_transform, $allowed_transforms, true ) ) {
					$validated[ $element ]['text_transform'] = $text_transform;
				} else {
					$errors[ 'typography_' . $element . '_text_transform' ] = 'Text transform must be none, uppercase, lowercase, or capitalize';
				}
			}

			// NEW: Validate font_family - Requirement 3.3.
			if ( isset( $element_data['font_family'] ) ) {
				$validated[ $element ]['font_family'] = sanitize_text_field( $element_data['font_family'] );
			}
		}

		// NEW: Validate google_fonts - Requirement 3.3.
		if ( isset( $typography['google_fonts'] ) ) {
			$validated['google_fonts'] = sanitize_text_field( $typography['google_fonts'] );
		}

		// NEW: Validate enabled - Requirement 3.3.
		if ( isset( $typography['enabled'] ) ) {
			$validated['enabled'] = (bool) $typography['enabled'];
		}

		if ( ! empty( $errors ) ) {
			return new WP_Error( 'typography_validation_failed', 'Typography validation failed', $errors );
		}

		return $validated;
	}

	/**
	 * Validate visual effects settings.
	 *
	 * @param array $visual_effects Visual effects settings to validate.
	 * @return array|WP_Error Validated visual effects data or WP_Error on failure.
	 */
	private function validate_visual_effects( $visual_effects ) {
		$validated = array();
		$errors    = array();

		$elements = array( 'admin_bar', 'admin_menu', 'buttons', 'form_fields' );

		foreach ( $elements as $element ) {
			if ( ! isset( $visual_effects[ $element ] ) ) {
				continue;
			}

			$validated[ $element ] = array();
			$element_data          = $visual_effects[ $element ];

			// NEW: Validate glassmorphism (boolean) - Requirement 3.4.
			if ( isset( $element_data['glassmorphism'] ) ) {
				$validated[ $element ]['glassmorphism'] = (bool) $element_data['glassmorphism'];
			}

			// NEW: Validate blur_intensity (0-50px) - Requirement 3.4.
			if ( isset( $element_data['blur_intensity'] ) ) {
				$blur_intensity = absint( $element_data['blur_intensity'] );
				if ( $blur_intensity >= 0 && $blur_intensity <= 50 ) {
					$validated[ $element ]['blur_intensity'] = $blur_intensity;
				} else {
					$errors[ 've_' . $element . '_blur_intensity' ] = 'Blur intensity must be between 0 and 50 pixels';
				}
			}

			// NEW: Validate floating (boolean) - Requirement 3.4.
			if ( isset( $element_data['floating'] ) ) {
				$validated[ $element ]['floating'] = (bool) $element_data['floating'];
			}

			// NEW: Validate floating_margin (0-20px) - Requirement 3.4.
			if ( isset( $element_data['floating_margin'] ) ) {
				$floating_margin = absint( $element_data['floating_margin'] );
				if ( $floating_margin >= 0 && $floating_margin <= 20 ) {
					$validated[ $element ]['floating_margin'] = $floating_margin;
				} else {
					$errors[ 've_' . $element . '_floating_margin' ] = 'Floating margin must be between 0 and 20 pixels';
				}
			}

			// Validate border_radius (0-30px).
			if ( isset( $element_data['border_radius'] ) ) {
				$border_radius = absint( $element_data['border_radius'] );
				if ( $border_radius >= 0 && $border_radius <= 30 ) {
					$validated[ $element ]['border_radius'] = $border_radius;
				} else {
					$errors[ 've_' . $element . '_border_radius' ] = 'Border radius must be between 0 and 30 pixels';
				}
			}

			// NEW: Validate shadow (enum: none, subtle, elevated, floating) - Requirement 3.4.
			if ( isset( $element_data['shadow'] ) ) {
				$shadow = strtolower( sanitize_text_field( $element_data['shadow'] ) );
				$allowed_shadows = array( 'none', 'subtle', 'elevated', 'floating' );
				if ( in_array( $shadow, $allowed_shadows, true ) ) {
					$validated[ $element ]['shadow'] = $shadow;
				} else {
					$errors[ 've_' . $element . '_shadow' ] = 'Shadow must be none, subtle, elevated, or floating';
				}
			}

			// Validate shadow_intensity (none, subtle, medium, strong).
			if ( isset( $element_data['shadow_intensity'] ) ) {
				$shadow_intensity    = strtolower( sanitize_text_field( $element_data['shadow_intensity'] ) );
				$allowed_intensities = array( 'none', 'subtle', 'medium', 'strong' );
				if ( in_array( $shadow_intensity, $allowed_intensities, true ) ) {
					$validated[ $element ]['shadow_intensity'] = $shadow_intensity;
				} else {
					$errors[ 've_' . $element . '_shadow_intensity' ] = 'Shadow intensity must be none, subtle, medium, or strong';
				}
			}

			// Validate shadow_direction (top, right, bottom, left, center).
			if ( isset( $element_data['shadow_direction'] ) ) {
				$shadow_direction    = strtolower( sanitize_text_field( $element_data['shadow_direction'] ) );
				$allowed_directions  = array( 'top', 'right', 'bottom', 'left', 'center' );
				if ( in_array( $shadow_direction, $allowed_directions, true ) ) {
					$validated[ $element ]['shadow_direction'] = $shadow_direction;
				} else {
					$errors[ 've_' . $element . '_shadow_direction' ] = 'Shadow direction must be top, right, bottom, left, or center';
				}
			}

			// Validate shadow_blur (0-30px).
			if ( isset( $element_data['shadow_blur'] ) ) {
				$shadow_blur = absint( $element_data['shadow_blur'] );
				if ( $shadow_blur >= 0 && $shadow_blur <= 30 ) {
					$validated[ $element ]['shadow_blur'] = $shadow_blur;
				} else {
					$errors[ 've_' . $element . '_shadow_blur' ] = 'Shadow blur must be between 0 and 30 pixels';
				}
			}

			// Validate shadow_color (rgba or hex format).
			if ( isset( $element_data['shadow_color'] ) ) {
				$shadow_color = sanitize_text_field( $element_data['shadow_color'] );
				// Check for valid rgba or hex color format.
				if ( preg_match( '/^(rgba?\([^)]+\)|#[0-9a-f]{3,8})$/i', $shadow_color ) ) {
					$validated[ $element ]['shadow_color'] = $shadow_color;
				} else {
					$errors[ 've_' . $element . '_shadow_color' ] = 'Invalid shadow color format. Use rgba() or hex format';
				}
			}
		}

		// Validate preset.
		if ( isset( $visual_effects['preset'] ) ) {
			$preset          = strtolower( sanitize_text_field( $visual_effects['preset'] ) );
			$allowed_presets = array( 'flat', 'subtle', 'elevated', 'floating', 'custom' );
			if ( in_array( $preset, $allowed_presets, true ) ) {
				$validated['preset'] = $preset;
			} else {
				$errors['ve_preset'] = 'Preset must be flat, subtle, elevated, floating, or custom';
			}
		}

		// Validate disable_mobile_shadows (Requirement 9.5, 16.2).
		if ( isset( $visual_effects['disable_mobile_shadows'] ) ) {
			$validated['disable_mobile_shadows'] = (bool) $visual_effects['disable_mobile_shadows'];
		}

		// Validate auto_detect_low_power (Requirement 16.1).
		if ( isset( $visual_effects['auto_detect_low_power'] ) ) {
			$validated['auto_detect_low_power'] = (bool) $visual_effects['auto_detect_low_power'];
		}

		// NEW: Validate animations_enabled - Requirement 3.4.
		if ( isset( $visual_effects['animations_enabled'] ) ) {
			$validated['animations_enabled'] = (bool) $visual_effects['animations_enabled'];
		}

		// NEW: Validate microanimations_enabled - Requirement 3.4.
		if ( isset( $visual_effects['microanimations_enabled'] ) ) {
			$validated['microanimations_enabled'] = (bool) $visual_effects['microanimations_enabled'];
		}

		// NEW: Validate particle_system - Requirement 3.4.
		if ( isset( $visual_effects['particle_system'] ) ) {
			$validated['particle_system'] = (bool) $visual_effects['particle_system'];
		}

		// NEW: Validate sound_effects - Requirement 3.4.
		if ( isset( $visual_effects['sound_effects'] ) ) {
			$validated['sound_effects'] = (bool) $visual_effects['sound_effects'];
		}

		// NEW: Validate 3d_effects - Requirement 3.4.
		if ( isset( $visual_effects['3d_effects'] ) ) {
			$validated['3d_effects'] = (bool) $visual_effects['3d_effects'];
		}

		if ( ! empty( $errors ) ) {
			return new WP_Error( 'visual_effects_validation_failed', 'Visual effects validation failed', $errors );
		}

		return $validated;
	}

	/**
	 * Get spacing preset definitions.
	 *
	 * Defines four spacing presets: compact, default, comfortable, and spacious.
	 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
	 *
	 * @return array Spacing presets with values for all spacing controls.
	 */
	public function get_spacing_presets() {
		return array(
			'compact' => array(
				'menu_padding' => array(
					'top'    => 6,
					'right'  => 10,
					'bottom' => 6,
					'left'   => 10,
				),
				'menu_margin' => array(
					'top'    => 1,
					'right'  => 0,
					'bottom' => 1,
					'left'   => 0,
				),
				'admin_bar_padding' => array(
					'top'    => 0,
					'right'  => 8,
					'bottom' => 0,
					'left'   => 8,
				),
				'submenu_spacing' => array(
					'padding_top'    => 6,
					'padding_right'  => 10,
					'padding_bottom' => 6,
					'padding_left'   => 10,
					'margin_top'     => 0,
					'offset_left'    => 0,
				),
				'content_margin' => array(
					'top'    => 15,
					'right'  => 15,
					'bottom' => 15,
					'left'   => 15,
				),
			),
			'default' => array(
				'menu_padding' => array(
					'top'    => 10,
					'right'  => 15,
					'bottom' => 10,
					'left'   => 15,
				),
				'menu_margin' => array(
					'top'    => 2,
					'right'  => 0,
					'bottom' => 2,
					'left'   => 0,
				),
				'admin_bar_padding' => array(
					'top'    => 0,
					'right'  => 10,
					'bottom' => 0,
					'left'   => 10,
				),
				'submenu_spacing' => array(
					'padding_top'    => 8,
					'padding_right'  => 12,
					'padding_bottom' => 8,
					'padding_left'   => 12,
					'margin_top'     => 0,
					'offset_left'    => 0,
				),
				'content_margin' => array(
					'top'    => 20,
					'right'  => 20,
					'bottom' => 20,
					'left'   => 20,
				),
			),
			'comfortable' => array(
				'menu_padding' => array(
					'top'    => 12,
					'right'  => 18,
					'bottom' => 12,
					'left'   => 18,
				),
				'menu_margin' => array(
					'top'    => 3,
					'right'  => 0,
					'bottom' => 3,
					'left'   => 0,
				),
				'admin_bar_padding' => array(
					'top'    => 0,
					'right'  => 12,
					'bottom' => 0,
					'left'   => 12,
				),
				'submenu_spacing' => array(
					'padding_top'    => 10,
					'padding_right'  => 14,
					'padding_bottom' => 10,
					'padding_left'   => 14,
					'margin_top'     => 2,
					'offset_left'    => 0,
				),
				'content_margin' => array(
					'top'    => 25,
					'right'  => 25,
					'bottom' => 25,
					'left'   => 25,
				),
			),
			'spacious' => array(
				'menu_padding' => array(
					'top'    => 16,
					'right'  => 24,
					'bottom' => 16,
					'left'   => 24,
				),
				'menu_margin' => array(
					'top'    => 4,
					'right'  => 0,
					'bottom' => 4,
					'left'   => 0,
				),
				'admin_bar_padding' => array(
					'top'    => 0,
					'right'  => 15,
					'bottom' => 0,
					'left'   => 15,
				),
				'submenu_spacing' => array(
					'padding_top'    => 12,
					'padding_right'  => 16,
					'padding_bottom' => 12,
					'padding_left'   => 16,
					'margin_top'     => 4,
					'offset_left'    => 0,
				),
				'content_margin' => array(
					'top'    => 30,
					'right'  => 30,
					'bottom' => 30,
					'left'   => 30,
				),
			),
		);
	}

	/**
	 * Apply a spacing preset to current settings.
	 *
	 * Retrieves preset values and applies them to all spacing settings.
	 * Requirements: 7.6, 7.7
	 *
	 * @param string $preset_name Preset name (compact, default, comfortable, spacious).
	 * @return array|false Updated settings array on success, false on invalid preset.
	 */
	public function apply_spacing_preset( $preset_name ) {
		$presets = $this->get_spacing_presets();

		// Validate preset name.
		if ( ! isset( $presets[ $preset_name ] ) ) {
			return false;
		}

		$preset_values    = $presets[ $preset_name ];
		$current_settings = $this->get_option();

		// Ensure spacing array exists.
		if ( ! isset( $current_settings['spacing'] ) ) {
			$current_settings['spacing'] = array();
		}

		// Apply preset values to all spacing settings.
		foreach ( $preset_values as $key => $values ) {
			if ( ! isset( $current_settings['spacing'][ $key ] ) ) {
				$current_settings['spacing'][ $key ] = array();
			}

			// Merge preset values with existing structure (preserving unit if set).
			foreach ( $values as $prop => $value ) {
				$current_settings['spacing'][ $key ][ $prop ] = $value;
			}

			// Ensure unit is set (default to px if not present).
			if ( ! isset( $current_settings['spacing'][ $key ]['unit'] ) ) {
				$current_settings['spacing'][ $key ]['unit'] = 'px';
			}
		}

		// Update preset field to selected preset name.
		$current_settings['spacing']['preset'] = $preset_name;

		return $current_settings;
	}

	/**
	 * Convert spacing value between px and rem units.
	 *
	 * Converts spacing values between pixels and rem units using a base font size.
	 * Requirements: 6.1, 6.2, 6.3, 6.4
	 *
	 * @param float  $value          Value to convert.
	 * @param string $from_unit      Source unit (px or rem).
	 * @param string $to_unit        Target unit (px or rem).
	 * @param int    $base_font_size Base font size in pixels (default 16).
	 * @return float Converted value.
	 */
	private function convert_spacing_unit( $value, $from_unit, $to_unit, $base_font_size = 16 ) {
		// No conversion needed if units are the same.
		if ( $from_unit === $to_unit ) {
			return $value;
		}

		// Convert px to rem.
		if ( 'px' === $from_unit && 'rem' === $to_unit ) {
			return round( $value / $base_font_size, 3 );
		}

		// Convert rem to px.
		if ( 'rem' === $from_unit && 'px' === $to_unit ) {
			return round( $value * $base_font_size );
		}

		// Return original value if conversion not supported.
		return $value;
	}

	/**
	 * Convert all spacing values to a target unit.
	 *
	 * Iterates through all spacing settings and converts values to the target unit.
	 * Requirements: 6.5
	 *
	 * @param array  $spacing    Spacing settings array.
	 * @param string $target_unit Target unit (px or rem).
	 * @return array Spacing settings with converted values.
	 */
	public function convert_all_spacing_units( $spacing, $target_unit ) {
		// Validate target unit.
		if ( ! in_array( $target_unit, array( 'px', 'rem' ), true ) ) {
			return $spacing;
		}

		// Define spacing sections to convert.
		$sections = array(
			'menu_padding',
			'menu_margin',
			'admin_bar_padding',
			'submenu_spacing',
			'content_margin',
		);

		// Convert each section.
		foreach ( $sections as $section ) {
			if ( ! isset( $spacing[ $section ] ) || ! is_array( $spacing[ $section ] ) ) {
				continue;
			}

			// Get current unit for this section.
			$current_unit = isset( $spacing[ $section ]['unit'] ) ? $spacing[ $section ]['unit'] : 'px';

			// Skip if already in target unit.
			if ( $current_unit === $target_unit ) {
				continue;
			}

			// Convert each numeric value in the section.
			foreach ( $spacing[ $section ] as $key => $value ) {
				// Skip non-numeric values (like 'unit' field).
				if ( 'unit' === $key || ! is_numeric( $value ) ) {
					continue;
				}

				// Convert the value.
				$spacing[ $section ][ $key ] = $this->convert_spacing_unit(
					$value,
					$current_unit,
					$target_unit
				);
			}

			// Update unit field.
			$spacing[ $section ]['unit'] = $target_unit;
		}

		// Handle mobile overrides if enabled.
		if ( isset( $spacing['mobile_overrides']['enabled'] ) && $spacing['mobile_overrides']['enabled'] ) {
			$mobile_sections = array( 'menu_padding', 'admin_bar_padding' );

			foreach ( $mobile_sections as $section ) {
				if ( ! isset( $spacing['mobile_overrides'][ $section ] ) ) {
					continue;
				}

				$current_unit = isset( $spacing['mobile_overrides'][ $section ]['unit'] ) ?
					$spacing['mobile_overrides'][ $section ]['unit'] : 'px';

				if ( $current_unit === $target_unit ) {
					continue;
				}

				foreach ( $spacing['mobile_overrides'][ $section ] as $key => $value ) {
					if ( 'unit' === $key || ! is_numeric( $value ) ) {
						continue;
					}

					$spacing['mobile_overrides'][ $section ][ $key ] = $this->convert_spacing_unit(
						$value,
						$current_unit,
						$target_unit
					);
				}

				$spacing['mobile_overrides'][ $section ]['unit'] = $target_unit;
			}
		}

		return $spacing;
	}

	/**
	 * Validate spacing settings.
	 *
	 * Validates all spacing values against defined constraints and returns
	 * specific error messages for invalid fields.
	 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8
	 *
	 * @param array $spacing Spacing settings to validate.
	 * @return array|WP_Error Validated spacing data or WP_Error with field errors.
	 */
	private function validate_spacing( $spacing ) {
		$validated = array();
		$errors    = array();

		// Validate menu padding (0-50px range).
		if ( isset( $spacing['menu_padding'] ) && is_array( $spacing['menu_padding'] ) ) {
			$validated['menu_padding'] = array();
			$sides = array( 'top', 'right', 'bottom', 'left' );

			foreach ( $sides as $side ) {
				if ( isset( $spacing['menu_padding'][ $side ] ) ) {
					$value = floatval( $spacing['menu_padding'][ $side ] );
					$unit  = isset( $spacing['menu_padding']['unit'] ) ? $spacing['menu_padding']['unit'] : 'px';

					// Validate based on unit.
					if ( 'px' === $unit ) {
						if ( $value < 0 || $value > 50 ) {
							$errors[ 'menu_padding_' . $side ] = sprintf(
								'Menu padding %s must be between 0 and 50 pixels',
								$side
							);
						} else {
							$validated['menu_padding'][ $side ] = intval( $value );
						}
					} elseif ( 'rem' === $unit ) {
						if ( $value < 0 || $value > 5 ) {
							$errors[ 'menu_padding_' . $side ] = sprintf(
								'Menu padding %s must be between 0 and 5 rem',
								$side
							);
						} else {
							$validated['menu_padding'][ $side ] = round( $value, 3 );
						}
					}
				}
			}

			// Validate unit.
			if ( isset( $spacing['menu_padding']['unit'] ) ) {
				$unit = strtolower( sanitize_text_field( $spacing['menu_padding']['unit'] ) );
				if ( in_array( $unit, array( 'px', 'rem' ), true ) ) {
					$validated['menu_padding']['unit'] = $unit;
				} else {
					$errors['menu_padding_unit'] = 'Menu padding unit must be px or rem';
				}
			}
		}

		// Validate menu margin (-20 to 100px range).
		if ( isset( $spacing['menu_margin'] ) && is_array( $spacing['menu_margin'] ) ) {
			$validated['menu_margin'] = array();
			$sides = array( 'top', 'right', 'bottom', 'left' );

			foreach ( $sides as $side ) {
				if ( isset( $spacing['menu_margin'][ $side ] ) ) {
					$value = floatval( $spacing['menu_margin'][ $side ] );
					$unit  = isset( $spacing['menu_margin']['unit'] ) ? $spacing['menu_margin']['unit'] : 'px';

					// Validate based on unit.
					if ( 'px' === $unit ) {
						if ( $value < -20 || $value > 100 ) {
							$errors[ 'menu_margin_' . $side ] = sprintf(
								'Menu margin %s must be between -20 and 100 pixels',
								$side
							);
						} else {
							$validated['menu_margin'][ $side ] = intval( $value );
						}
					} elseif ( 'rem' === $unit ) {
						if ( $value < 0 || $value > 5 ) {
							$errors[ 'menu_margin_' . $side ] = sprintf(
								'Menu margin %s must be between 0 and 5 rem',
								$side
							);
						} else {
							$validated['menu_margin'][ $side ] = round( $value, 3 );
						}
					}
				}
			}

			// Validate unit.
			if ( isset( $spacing['menu_margin']['unit'] ) ) {
				$unit = strtolower( sanitize_text_field( $spacing['menu_margin']['unit'] ) );
				if ( in_array( $unit, array( 'px', 'rem' ), true ) ) {
					$validated['menu_margin']['unit'] = $unit;
				} else {
					$errors['menu_margin_unit'] = 'Menu margin unit must be px or rem';
				}
			}
		}

		// Validate admin bar padding (0-30px range).
		if ( isset( $spacing['admin_bar_padding'] ) && is_array( $spacing['admin_bar_padding'] ) ) {
			$validated['admin_bar_padding'] = array();
			$sides = array( 'top', 'right', 'bottom', 'left' );

			foreach ( $sides as $side ) {
				if ( isset( $spacing['admin_bar_padding'][ $side ] ) ) {
					$value = floatval( $spacing['admin_bar_padding'][ $side ] );
					$unit  = isset( $spacing['admin_bar_padding']['unit'] ) ? $spacing['admin_bar_padding']['unit'] : 'px';

					// Validate based on unit.
					if ( 'px' === $unit ) {
						if ( $value < 0 || $value > 30 ) {
							$errors[ 'admin_bar_padding_' . $side ] = sprintf(
								'Admin bar padding %s must be between 0 and 30 pixels',
								$side
							);
						} else {
							$validated['admin_bar_padding'][ $side ] = intval( $value );
						}
					} elseif ( 'rem' === $unit ) {
						if ( $value < 0 || $value > 5 ) {
							$errors[ 'admin_bar_padding_' . $side ] = sprintf(
								'Admin bar padding %s must be between 0 and 5 rem',
								$side
							);
						} else {
							$validated['admin_bar_padding'][ $side ] = round( $value, 3 );
						}
					}
				}
			}

			// Validate unit.
			if ( isset( $spacing['admin_bar_padding']['unit'] ) ) {
				$unit = strtolower( sanitize_text_field( $spacing['admin_bar_padding']['unit'] ) );
				if ( in_array( $unit, array( 'px', 'rem' ), true ) ) {
					$validated['admin_bar_padding']['unit'] = $unit;
				} else {
					$errors['admin_bar_padding_unit'] = 'Admin bar padding unit must be px or rem';
				}
			}
		}

		// Validate submenu spacing (0-30px padding, -50 to 50px offset).
		if ( isset( $spacing['submenu_spacing'] ) && is_array( $spacing['submenu_spacing'] ) ) {
			$validated['submenu_spacing'] = array();
			$padding_sides = array( 'padding_top', 'padding_right', 'padding_bottom', 'padding_left' );

			// Validate padding values (0-30px range).
			foreach ( $padding_sides as $side ) {
				if ( isset( $spacing['submenu_spacing'][ $side ] ) ) {
					$value = floatval( $spacing['submenu_spacing'][ $side ] );
					$unit  = isset( $spacing['submenu_spacing']['unit'] ) ? $spacing['submenu_spacing']['unit'] : 'px';

					// Validate based on unit.
					if ( 'px' === $unit ) {
						if ( $value < 0 || $value > 30 ) {
							$errors[ 'submenu_spacing_' . $side ] = sprintf(
								'Submenu %s must be between 0 and 30 pixels',
								str_replace( '_', ' ', $side )
							);
						} else {
							$validated['submenu_spacing'][ $side ] = intval( $value );
						}
					} elseif ( 'rem' === $unit ) {
						if ( $value < 0 || $value > 5 ) {
							$errors[ 'submenu_spacing_' . $side ] = sprintf(
								'Submenu %s must be between 0 and 5 rem',
								str_replace( '_', ' ', $side )
							);
						} else {
							$validated['submenu_spacing'][ $side ] = round( $value, 3 );
						}
					}
				}
			}

			// Validate margin_top.
			if ( isset( $spacing['submenu_spacing']['margin_top'] ) ) {
				$value = floatval( $spacing['submenu_spacing']['margin_top'] );
				$unit  = isset( $spacing['submenu_spacing']['unit'] ) ? $spacing['submenu_spacing']['unit'] : 'px';

				if ( 'px' === $unit ) {
					if ( $value < -10 || $value > 50 ) {
						$errors['submenu_spacing_margin_top'] = 'Submenu margin top must be between -10 and 50 pixels';
					} else {
						$validated['submenu_spacing']['margin_top'] = intval( $value );
					}
				} elseif ( 'rem' === $unit ) {
					if ( $value < 0 || $value > 5 ) {
						$errors['submenu_spacing_margin_top'] = 'Submenu margin top must be between 0 and 5 rem';
					} else {
						$validated['submenu_spacing']['margin_top'] = round( $value, 3 );
					}
				}
			}

			// Validate offset_left (-50 to 50px range).
			if ( isset( $spacing['submenu_spacing']['offset_left'] ) ) {
				$value = floatval( $spacing['submenu_spacing']['offset_left'] );
				$unit  = isset( $spacing['submenu_spacing']['unit'] ) ? $spacing['submenu_spacing']['unit'] : 'px';

				if ( 'px' === $unit ) {
					if ( $value < -50 || $value > 50 ) {
						$errors['submenu_spacing_offset_left'] = 'Submenu offset must be between -50 and 50 pixels';
					} else {
						$validated['submenu_spacing']['offset_left'] = intval( $value );
					}
				} elseif ( 'rem' === $unit ) {
					if ( $value < -5 || $value > 5 ) {
						$errors['submenu_spacing_offset_left'] = 'Submenu offset must be between -5 and 5 rem';
					} else {
						$validated['submenu_spacing']['offset_left'] = round( $value, 3 );
					}
				}
			}

			// Validate unit.
			if ( isset( $spacing['submenu_spacing']['unit'] ) ) {
				$unit = strtolower( sanitize_text_field( $spacing['submenu_spacing']['unit'] ) );
				if ( in_array( $unit, array( 'px', 'rem' ), true ) ) {
					$validated['submenu_spacing']['unit'] = $unit;
				} else {
					$errors['submenu_spacing_unit'] = 'Submenu spacing unit must be px or rem';
				}
			}
		}

		// Validate content margin (0-100px range).
		if ( isset( $spacing['content_margin'] ) && is_array( $spacing['content_margin'] ) ) {
			$validated['content_margin'] = array();
			$sides = array( 'top', 'right', 'bottom', 'left' );

			foreach ( $sides as $side ) {
				if ( isset( $spacing['content_margin'][ $side ] ) ) {
					$value = floatval( $spacing['content_margin'][ $side ] );
					$unit  = isset( $spacing['content_margin']['unit'] ) ? $spacing['content_margin']['unit'] : 'px';

					// Validate based on unit.
					if ( 'px' === $unit ) {
						if ( $value < 0 || $value > 100 ) {
							$errors[ 'content_margin_' . $side ] = sprintf(
								'Content margin %s must be between 0 and 100 pixels',
								$side
							);
						} else {
							$validated['content_margin'][ $side ] = intval( $value );
						}
					} elseif ( 'rem' === $unit ) {
						if ( $value < 0 || $value > 5 ) {
							$errors[ 'content_margin_' . $side ] = sprintf(
								'Content margin %s must be between 0 and 5 rem',
								$side
							);
						} else {
							$validated['content_margin'][ $side ] = round( $value, 3 );
						}
					}
				}
			}

			// Validate unit.
			if ( isset( $spacing['content_margin']['unit'] ) ) {
				$unit = strtolower( sanitize_text_field( $spacing['content_margin']['unit'] ) );
				if ( in_array( $unit, array( 'px', 'rem' ), true ) ) {
					$validated['content_margin']['unit'] = $unit;
				} else {
					$errors['content_margin_unit'] = 'Content margin unit must be px or rem';
				}
			}
		}

		// Validate mobile overrides if present.
		if ( isset( $spacing['mobile_overrides'] ) && is_array( $spacing['mobile_overrides'] ) ) {
			$validated['mobile_overrides'] = array();

			// Validate enabled flag.
			if ( isset( $spacing['mobile_overrides']['enabled'] ) ) {
				$validated['mobile_overrides']['enabled'] = (bool) $spacing['mobile_overrides']['enabled'];
			}

			// Validate mobile menu padding if enabled.
			if ( isset( $spacing['mobile_overrides']['menu_padding'] ) && is_array( $spacing['mobile_overrides']['menu_padding'] ) ) {
				$validated['mobile_overrides']['menu_padding'] = array();
				$sides = array( 'top', 'right', 'bottom', 'left' );

				foreach ( $sides as $side ) {
					if ( isset( $spacing['mobile_overrides']['menu_padding'][ $side ] ) ) {
						$value = floatval( $spacing['mobile_overrides']['menu_padding'][ $side ] );
						$unit  = isset( $spacing['mobile_overrides']['menu_padding']['unit'] ) ? $spacing['mobile_overrides']['menu_padding']['unit'] : 'px';

						if ( 'px' === $unit ) {
							if ( $value < 0 || $value > 50 ) {
								$errors[ 'mobile_menu_padding_' . $side ] = sprintf(
									'Mobile menu padding %s must be between 0 and 50 pixels',
									$side
								);
							} else {
								$validated['mobile_overrides']['menu_padding'][ $side ] = intval( $value );
							}
						} elseif ( 'rem' === $unit ) {
							if ( $value < 0 || $value > 5 ) {
								$errors[ 'mobile_menu_padding_' . $side ] = sprintf(
									'Mobile menu padding %s must be between 0 and 5 rem',
									$side
								);
							} else {
								$validated['mobile_overrides']['menu_padding'][ $side ] = round( $value, 3 );
							}
						}
					}
				}

				if ( isset( $spacing['mobile_overrides']['menu_padding']['unit'] ) ) {
					$unit = strtolower( sanitize_text_field( $spacing['mobile_overrides']['menu_padding']['unit'] ) );
					if ( in_array( $unit, array( 'px', 'rem' ), true ) ) {
						$validated['mobile_overrides']['menu_padding']['unit'] = $unit;
					}
				}
			}

			// Validate mobile admin bar padding if enabled.
			if ( isset( $spacing['mobile_overrides']['admin_bar_padding'] ) && is_array( $spacing['mobile_overrides']['admin_bar_padding'] ) ) {
				$validated['mobile_overrides']['admin_bar_padding'] = array();
				$sides = array( 'top', 'right', 'bottom', 'left' );

				foreach ( $sides as $side ) {
					if ( isset( $spacing['mobile_overrides']['admin_bar_padding'][ $side ] ) ) {
						$value = floatval( $spacing['mobile_overrides']['admin_bar_padding'][ $side ] );
						$unit  = isset( $spacing['mobile_overrides']['admin_bar_padding']['unit'] ) ? $spacing['mobile_overrides']['admin_bar_padding']['unit'] : 'px';

						if ( 'px' === $unit ) {
							if ( $value < 0 || $value > 30 ) {
								$errors[ 'mobile_admin_bar_padding_' . $side ] = sprintf(
									'Mobile admin bar padding %s must be between 0 and 30 pixels',
									$side
								);
							} else {
								$validated['mobile_overrides']['admin_bar_padding'][ $side ] = intval( $value );
							}
						} elseif ( 'rem' === $unit ) {
							if ( $value < 0 || $value > 5 ) {
								$errors[ 'mobile_admin_bar_padding_' . $side ] = sprintf(
									'Mobile admin bar padding %s must be between 0 and 5 rem',
									$side
								);
							} else {
								$validated['mobile_overrides']['admin_bar_padding'][ $side ] = round( $value, 3 );
							}
						}
					}
				}

				if ( isset( $spacing['mobile_overrides']['admin_bar_padding']['unit'] ) ) {
					$unit = strtolower( sanitize_text_field( $spacing['mobile_overrides']['admin_bar_padding']['unit'] ) );
					if ( in_array( $unit, array( 'px', 'rem' ), true ) ) {
						$validated['mobile_overrides']['admin_bar_padding']['unit'] = $unit;
					}
				}
			}
		}

		// Validate preset field.
		if ( isset( $spacing['preset'] ) ) {
			$preset = strtolower( sanitize_text_field( $spacing['preset'] ) );
			$allowed_presets = array( 'compact', 'default', 'comfortable', 'spacious', 'custom' );
			if ( in_array( $preset, $allowed_presets, true ) ) {
				$validated['preset'] = $preset;
			} else {
				$errors['preset'] = 'Invalid spacing preset';
			}
		}

		if ( ! empty( $errors ) ) {
			return new WP_Error( 'spacing_validation_failed', 'Spacing validation failed', $errors );
		}

		return $validated;
	}

	/**
	 * Generate accessibility validation warnings for spacing settings.
	 *
	 * Checks for potential accessibility issues without blocking save.
	 * Requirements: 20.1, 20.2, 20.6
	 *
	 * @param array $spacing Validated spacing settings.
	 * @return array Array of warning messages.
	 */
	public function get_spacing_accessibility_warnings( $spacing ) {
		$warnings = array();

		// Check menu padding for touch target size (minimum 44x44px).
		if ( isset( $spacing['menu_padding'] ) && is_array( $spacing['menu_padding'] ) ) {
			$unit = isset( $spacing['menu_padding']['unit'] ) ? $spacing['menu_padding']['unit'] : 'px';
			
			// Convert to px for comparison if needed.
			$top    = isset( $spacing['menu_padding']['top'] ) ? floatval( $spacing['menu_padding']['top'] ) : 0;
			$bottom = isset( $spacing['menu_padding']['bottom'] ) ? floatval( $spacing['menu_padding']['bottom'] ) : 0;
			
			if ( 'rem' === $unit ) {
				$top    = $top * 16;
				$bottom = $bottom * 16;
			}
			
			$total_vertical_padding = $top + $bottom;
			
			// Assuming base menu item height is ~20px, check if total height meets 44px minimum.
			$estimated_height = 20 + $total_vertical_padding;
			
			if ( $estimated_height < 44 ) {
				$warnings[] = sprintf(
					'Menu padding may create touch targets smaller than 44x44px (estimated height: %dpx). Consider increasing vertical padding for better mobile accessibility.',
					intval( $estimated_height )
				);
			}
		}

		// Check admin bar padding for touch target size.
		if ( isset( $spacing['admin_bar_padding'] ) && is_array( $spacing['admin_bar_padding'] ) ) {
			$unit = isset( $spacing['admin_bar_padding']['unit'] ) ? $spacing['admin_bar_padding']['unit'] : 'px';
			
			$top    = isset( $spacing['admin_bar_padding']['top'] ) ? floatval( $spacing['admin_bar_padding']['top'] ) : 0;
			$bottom = isset( $spacing['admin_bar_padding']['bottom'] ) ? floatval( $spacing['admin_bar_padding']['bottom'] ) : 0;
			
			if ( 'rem' === $unit ) {
				$top    = $top * 16;
				$bottom = $bottom * 16;
			}
			
			$total_vertical_padding = $top + $bottom;
			
			// Admin bar default height is 32px.
			$estimated_height = 32 + $total_vertical_padding;
			
			if ( $estimated_height < 44 ) {
				$warnings[] = sprintf(
					'Admin bar padding may create touch targets smaller than 44x44px (estimated height: %dpx). Consider increasing vertical padding for better mobile accessibility.',
					intval( $estimated_height )
				);
			}
		}

		// Check submenu padding for touch target size.
		if ( isset( $spacing['submenu_spacing'] ) && is_array( $spacing['submenu_spacing'] ) ) {
			$unit = isset( $spacing['submenu_spacing']['unit'] ) ? $spacing['submenu_spacing']['unit'] : 'px';
			
			$top    = isset( $spacing['submenu_spacing']['padding_top'] ) ? floatval( $spacing['submenu_spacing']['padding_top'] ) : 0;
			$bottom = isset( $spacing['submenu_spacing']['padding_bottom'] ) ? floatval( $spacing['submenu_spacing']['padding_bottom'] ) : 0;
			
			if ( 'rem' === $unit ) {
				$top    = $top * 16;
				$bottom = $bottom * 16;
			}
			
			$total_vertical_padding = $top + $bottom;
			
			// Assuming base submenu item height is ~18px.
			$estimated_height = 18 + $total_vertical_padding;
			
			if ( $estimated_height < 44 ) {
				$warnings[] = sprintf(
					'Submenu padding may create touch targets smaller than 44x44px (estimated height: %dpx). Consider increasing vertical padding for better mobile accessibility.',
					intval( $estimated_height )
				);
			}
		}

		// Check for negative margins that could create overlaps.
		if ( isset( $spacing['menu_margin'] ) && is_array( $spacing['menu_margin'] ) ) {
			$unit = isset( $spacing['menu_margin']['unit'] ) ? $spacing['menu_margin']['unit'] : 'px';
			
			$top    = isset( $spacing['menu_margin']['top'] ) ? floatval( $spacing['menu_margin']['top'] ) : 0;
			$bottom = isset( $spacing['menu_margin']['bottom'] ) ? floatval( $spacing['menu_margin']['bottom'] ) : 0;
			
			if ( 'rem' === $unit ) {
				$top    = $top * 16;
				$bottom = $bottom * 16;
			}
			
			if ( $top < 0 || $bottom < 0 ) {
				$warnings[] = 'Negative menu margins detected. This may cause menu items to overlap, making them difficult to click or tap. Verify that all menu items remain accessible.';
			}
		}

		// Check for negative submenu offset that could cause alignment issues.
		if ( isset( $spacing['submenu_spacing']['offset_left'] ) ) {
			$offset = floatval( $spacing['submenu_spacing']['offset_left'] );
			$unit   = isset( $spacing['submenu_spacing']['unit'] ) ? $spacing['submenu_spacing']['unit'] : 'px';
			
			if ( 'rem' === $unit ) {
				$offset = $offset * 16;
			}
			
			if ( $offset < -20 ) {
				$warnings[] = sprintf(
					'Large negative submenu offset (%dpx) may cause submenus to overlap with parent menu items or extend off-screen. Verify submenu positioning on different screen sizes.',
					intval( $offset )
				);
			}
			
			if ( $offset > 20 ) {
				$warnings[] = sprintf(
					'Large positive submenu offset (%dpx) may create a gap between parent and submenu items, making the relationship unclear. Consider reducing the offset for better usability.',
					intval( $offset )
				);
			}
		}

		// Check for very small padding that could affect readability.
		if ( isset( $spacing['menu_padding'] ) && is_array( $spacing['menu_padding'] ) ) {
			$unit = isset( $spacing['menu_padding']['unit'] ) ? $spacing['menu_padding']['unit'] : 'px';
			
			$left  = isset( $spacing['menu_padding']['left'] ) ? floatval( $spacing['menu_padding']['left'] ) : 0;
			$right = isset( $spacing['menu_padding']['right'] ) ? floatval( $spacing['menu_padding']['right'] ) : 0;
			
			if ( 'rem' === $unit ) {
				$left  = $left * 16;
				$right = $right * 16;
			}
			
			if ( $left < 8 || $right < 8 ) {
				$warnings[] = 'Menu padding below 8px may make text difficult to read and reduce visual comfort. Consider increasing horizontal padding for better readability.';
			}
		}

		return $warnings;
	}

	/**
	 * Get shadow preset definitions.
	 *
	 * @return array Shadow presets with intensity and blur values.
	 */
	public function get_shadow_presets() {
		return array(
			'flat' => array(
				'name'        => 'Flat',
				'description' => 'No shadows, clean flat design',
				'admin_bar'   => array(
					'intensity' => 'none',
					'blur'      => 0,
				),
				'admin_menu'  => array(
					'intensity' => 'none',
					'blur'      => 0,
				),
				'buttons'     => array(
					'intensity' => 'none',
					'blur'      => 0,
				),
				'form_fields' => array(
					'intensity' => 'none',
					'blur'      => 0,
				),
			),
			'subtle' => array(
				'name'        => 'Subtle',
				'description' => 'Light shadows for gentle depth',
				'admin_bar'   => array(
					'intensity' => 'subtle',
					'blur'      => 8,
				),
				'admin_menu'  => array(
					'intensity' => 'subtle',
					'blur'      => 6,
				),
				'buttons'     => array(
					'intensity' => 'subtle',
					'blur'      => 5,
				),
				'form_fields' => array(
					'intensity' => 'subtle',
					'blur'      => 3,
				),
			),
			'elevated' => array(
				'name'        => 'Elevated',
				'description' => 'Medium shadows for clear hierarchy',
				'admin_bar'   => array(
					'intensity' => 'medium',
					'blur'      => 12,
				),
				'admin_menu'  => array(
					'intensity' => 'medium',
					'blur'      => 10,
				),
				'buttons'     => array(
					'intensity' => 'medium',
					'blur'      => 8,
				),
				'form_fields' => array(
					'intensity' => 'subtle',
					'blur'      => 5,
				),
			),
			'floating' => array(
				'name'        => 'Floating',
				'description' => 'Strong shadows for dramatic depth',
				'admin_bar'   => array(
					'intensity' => 'strong',
					'blur'      => 20,
				),
				'admin_menu'  => array(
					'intensity' => 'strong',
					'blur'      => 15,
				),
				'buttons'     => array(
					'intensity' => 'medium',
					'blur'      => 10,
				),
				'form_fields' => array(
					'intensity' => 'subtle',
					'blur'      => 6,
				),
			),
		);
	}

	/**
	 * Detect if current visual effects settings match a preset.
	 *
	 * @param array $visual_effects Current visual effects settings.
	 * @return string Preset name or 'custom' if no match.
	 */
	public function detect_visual_effects_preset( $visual_effects ) {
		$presets = $this->get_shadow_presets();

		foreach ( $presets as $preset_id => $preset_data ) {
			$matches = true;

			foreach ( array( 'admin_bar', 'admin_menu', 'buttons', 'form_fields' ) as $element ) {
				if ( ! isset( $visual_effects[ $element ] ) || ! isset( $preset_data[ $element ] ) ) {
					$matches = false;
					break;
				}

				$current = $visual_effects[ $element ];
				$preset  = $preset_data[ $element ];

				if ( $current['shadow_intensity'] !== $preset['intensity'] ||
					 absint( $current['shadow_blur'] ) !== absint( $preset['blur'] ) ) {
					$matches = false;
					break;
				}
			}

			if ( $matches ) {
				return $preset_id;
			}
		}

		return 'custom';
	}

	/**
	 * Reset settings to defaults.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function reset_to_defaults() {
		return update_option( self::OPTION_NAME, $this->get_defaults() );
	}

	/**
	 * Initialize default settings on plugin activation.
	 *
	 * Only sets defaults if settings don't already exist.
	 *
	 * @return bool True if defaults were set, false if settings already exist.
	 */
	public function initialize_defaults() {
		$existing = get_option( self::OPTION_NAME );
		
		if ( false === $existing ) {
			return update_option( self::OPTION_NAME, $this->get_defaults() );
		}
		
		return false;
	}

	/**
	 * Get default color palettes.
	 *
	 * Defines 10 built-in color palettes with IDs, names, and color values.
	 * Requirements: 1.1, 2.1, 2.2
	 *
	 * @return array Array of color palettes.
	 */
	public function get_default_palettes() {
		return array(
			'professional-blue' => array(
				'id'         => 'professional-blue',
				'name'       => 'Professional Blue',
				'colors'     => array(
					'primary'        => '#4A90E2',
					'secondary'      => '#50C9C3',
					'accent'         => '#7B68EE',
					'background'     => '#F8FAFC',
					'text'           => '#1E293B',
					'text_secondary' => '#64748B',
				),
				'admin_bar'  => array(
					'bg_color'   => '#4A90E2',
					'text_color' => '#ffffff',
				),
				'admin_menu' => array(
					'bg_color'         => '#1E40AF',
					'text_color'       => '#ffffff',
					'hover_bg_color'   => '#3B82F6',
					'hover_text_color' => '#E0E7FF',
				),
				'is_custom'  => false,
			),
			'creative-purple'   => array(
				'id'         => 'creative-purple',
				'name'       => 'Creative Purple',
				'colors'     => array(
					'primary'        => '#8B5CF6',
					'secondary'      => '#EC4899',
					'accent'         => '#F59E0B',
					'background'     => '#FAF5FF',
					'text'           => '#1F2937',
					'text_secondary' => '#6B7280',
				),
				'admin_bar'  => array(
					'bg_color'   => '#8B5CF6',
					'text_color' => '#ffffff',
				),
				'admin_menu' => array(
					'bg_color'         => '#7C3AED',
					'text_color'       => '#ffffff',
					'hover_bg_color'   => '#8B5CF6',
					'hover_text_color' => '#EDE9FE',
				),
				'is_custom'  => false,
			),
			'energetic-green'   => array(
				'id'         => 'energetic-green',
				'name'       => 'Energetic Green',
				'colors'     => array(
					'primary'        => '#10B981',
					'secondary'      => '#34D399',
					'accent'         => '#FBBF24',
					'background'     => '#F0FDF4',
					'text'           => '#064E3B',
					'text_secondary' => '#047857',
				),
				'admin_bar'  => array(
					'bg_color'   => '#10B981',
					'text_color' => '#ffffff',
				),
				'admin_menu' => array(
					'bg_color'         => '#059669',
					'text_color'       => '#ffffff',
					'hover_bg_color'   => '#10B981',
					'hover_text_color' => '#D1FAE5',
				),
				'is_custom'  => false,
			),
			'sunset'            => array(
				'id'         => 'sunset',
				'name'       => 'Sunset',
				'colors'     => array(
					'primary'        => '#F97316',
					'secondary'      => '#FB923C',
					'accent'         => '#FBBF24',
					'background'     => '#FFF7ED',
					'text'           => '#7C2D12',
					'text_secondary' => '#C2410C',
				),
				'admin_bar'  => array(
					'bg_color'   => '#F97316',
					'text_color' => '#ffffff',
				),
				'admin_menu' => array(
					'bg_color'         => '#EA580C',
					'text_color'       => '#ffffff',
					'hover_bg_color'   => '#F97316',
					'hover_text_color' => '#FED7AA',
				),
				'is_custom'  => false,
			),
			'dark-elegance'     => array(
				'id'         => 'dark-elegance',
				'name'       => 'Dark Elegance',
				'colors'     => array(
					'primary'        => '#1F2937',
					'secondary'      => '#374151',
					'accent'         => '#60A5FA',
					'background'     => '#111827',
					'text'           => '#F9FAFB',
					'text_secondary' => '#D1D5DB',
				),
				'admin_bar'  => array(
					'bg_color'   => '#1F2937',
					'text_color' => '#F9FAFB',
				),
				'admin_menu' => array(
					'bg_color'         => '#111827',
					'text_color'       => '#F9FAFB',
					'hover_bg_color'   => '#374151',
					'hover_text_color' => '#60A5FA',
				),
				'is_custom'  => false,
			),
			'ocean-breeze'      => array(
				'id'         => 'ocean-breeze',
				'name'       => 'Ocean Breeze',
				'colors'     => array(
					'primary'        => '#0EA5E9',
					'secondary'      => '#06B6D4',
					'accent'         => '#22D3EE',
					'background'     => '#F0F9FF',
					'text'           => '#0C4A6E',
					'text_secondary' => '#0369A1',
				),
				'admin_bar'  => array(
					'bg_color'   => '#0EA5E9',
					'text_color' => '#ffffff',
				),
				'admin_menu' => array(
					'bg_color'         => '#0284C7',
					'text_color'       => '#ffffff',
					'hover_bg_color'   => '#0EA5E9',
					'hover_text_color' => '#E0F2FE',
				),
				'is_custom'  => false,
			),
			'rose-garden'       => array(
				'id'         => 'rose-garden',
				'name'       => 'Rose Garden',
				'colors'     => array(
					'primary'        => '#E11D48',
					'secondary'      => '#F43F5E',
					'accent'         => '#FB7185',
					'background'     => '#FFF1F2',
					'text'           => '#881337',
					'text_secondary' => '#BE123C',
				),
				'admin_bar'  => array(
					'bg_color'   => '#E11D48',
					'text_color' => '#ffffff',
				),
				'admin_menu' => array(
					'bg_color'         => '#BE123C',
					'text_color'       => '#ffffff',
					'hover_bg_color'   => '#E11D48',
					'hover_text_color' => '#FFE4E6',
				),
				'is_custom'  => false,
			),
			'forest-calm'       => array(
				'id'         => 'forest-calm',
				'name'       => 'Forest Calm',
				'colors'     => array(
					'primary'        => '#16A34A',
					'secondary'      => '#22C55E',
					'accent'         => '#84CC16',
					'background'     => '#F7FEE7',
					'text'           => '#14532D',
					'text_secondary' => '#166534',
				),
				'admin_bar'  => array(
					'bg_color'   => '#16A34A',
					'text_color' => '#ffffff',
				),
				'admin_menu' => array(
					'bg_color'         => '#15803D',
					'text_color'       => '#ffffff',
					'hover_bg_color'   => '#16A34A',
					'hover_text_color' => '#DCFCE7',
				),
				'is_custom'  => false,
			),
			'midnight-blue'     => array(
				'id'         => 'midnight-blue',
				'name'       => 'Midnight Blue',
				'colors'     => array(
					'primary'        => '#1E3A8A',
					'secondary'      => '#3B82F6',
					'accent'         => '#60A5FA',
					'background'     => '#EFF6FF',
					'text'           => '#1E3A8A',
					'text_secondary' => '#1E40AF',
				),
				'admin_bar'  => array(
					'bg_color'   => '#1E3A8A',
					'text_color' => '#ffffff',
				),
				'admin_menu' => array(
					'bg_color'         => '#1E40AF',
					'text_color'       => '#ffffff',
					'hover_bg_color'   => '#3B82F6',
					'hover_text_color' => '#DBEAFE',
				),
				'is_custom'  => false,
			),
			'golden-hour'       => array(
				'id'         => 'golden-hour',
				'name'       => 'Golden Hour',
				'colors'     => array(
					'primary'        => '#D97706',
					'secondary'      => '#F59E0B',
					'accent'         => '#FBBF24',
					'background'     => '#FFFBEB',
					'text'           => '#78350F',
					'text_secondary' => '#92400E',
				),
				'admin_bar'  => array(
					'bg_color'   => '#D97706',
					'text_color' => '#ffffff',
				),
				'admin_menu' => array(
					'bg_color'         => '#B45309',
					'text_color'       => '#ffffff',
					'hover_bg_color'   => '#D97706',
					'hover_text_color' => '#FEF3C7',
				),
				'is_custom'  => false,
			),
		);
	}

	/**
	 * Get a specific palette by ID.
	 *
	 * Retrieves palette from default palettes or custom palettes.
	 * Requirement 3.1: Palette management methods.
	 * Requirements 16.3, 16.4: Return WP_Error if palette not found.
	 *
	 * @param string $palette_id Palette ID to retrieve.
	 * @return array|WP_Error Palette data or WP_Error if not found.
	 */
	public function get_palette( $palette_id ) {
		$all_palettes = $this->get_all_palettes();
		
		if ( ! isset( $all_palettes[ $palette_id ] ) ) {
			return new WP_Error(
				'palette_not_found',
				__( 'Palette not found', 'modern-admin-styler' )
			);
		}
		
		return $all_palettes[ $palette_id ];
	}

	/**
	 * Get all available palettes (default + custom).
	 *
	 * Requirement 3.1: Palette management methods.
	 *
	 * @return array Array of all palettes.
	 */
	public function get_all_palettes() {
		$default_palettes = $this->get_default_palettes();
		$settings = $this->get_option();
		$custom_palettes = isset( $settings['palettes']['custom'] ) ? $settings['palettes']['custom'] : array();
		
		return array_merge( $default_palettes, $custom_palettes );
	}

	/**
	 * Apply a color palette.
	 *
	 * Updated to support new palette structure and custom palettes.
	 * Requirement 3.1: Palette management methods.
	 * Requirement 17.1: Apply palette and return result.
	 *
	 * @param string $palette_id Palette ID to apply.
	 * @return bool|WP_Error True on success, WP_Error on failure.
	 */
	public function apply_palette( $palette_id ) {
		// Call get_palette() to validate palette exists.
		$palette = $this->get_palette( $palette_id );

		// Return error if palette not found.
		if ( is_wp_error( $palette ) ) {
			return $palette;
		}

		$current_settings = $this->get_option();

		// Update 'current_palette' setting with palette_id.
		$current_settings['palettes']['current'] = $palette_id;

		// Loop through palette colors and update settings.
		if ( isset( $palette['admin_bar'] ) ) {
			$current_settings['admin_bar'] = array_merge(
				$current_settings['admin_bar'],
				$palette['admin_bar']
			);
		}

		if ( isset( $palette['admin_menu'] ) ) {
			$current_settings['admin_menu'] = array_merge(
				$current_settings['admin_menu'],
				$palette['admin_menu']
			);
		}

		// Call save() method to persist changes (using update_option as the save method).
		$result = $this->update_option( $current_settings );

		// Return result of save operation.
		if ( ! $result ) {
			return new WP_Error(
				'palette_save_failed',
				__( 'Failed to save palette settings', 'modern-admin-styler' )
			);
		}

		return true;
	}

	/**
	 * Save a custom palette.
	 *
	 * Requirement 3.1: Palette management methods.
	 *
	 * @param string $name   Palette name.
	 * @param array  $colors Palette colors (admin_bar and admin_menu).
	 * @return string|false Palette ID on success, false on failure.
	 */
	public function save_custom_palette( $name, $colors ) {
		// Validate required structure.
		if ( ! isset( $colors['admin_bar'] ) || ! isset( $colors['admin_menu'] ) ) {
			return false;
		}

		// Validate colors.
		$validated_colors = $this->validate_palette_colors( $colors );
		if ( is_wp_error( $validated_colors ) ) {
			return false;
		}

		$current_settings = $this->get_option();
		
		// Generate unique ID for custom palette.
		$palette_id = 'custom_' . sanitize_title( $name ) . '_' . time();
		
		// Ensure custom palettes array exists.
		if ( ! isset( $current_settings['palettes']['custom'] ) ) {
			$current_settings['palettes']['custom'] = array();
		}

		// Add custom palette.
		$current_settings['palettes']['custom'][ $palette_id ] = array(
			'name'       => sanitize_text_field( $name ),
			'admin_bar'  => $validated_colors['admin_bar'],
			'admin_menu' => $validated_colors['admin_menu'],
			'is_custom'  => true,
			'created_at' => current_time( 'timestamp' ),
		);

		$result = $this->update_option( $current_settings );
		
		return $result ? $palette_id : false;
	}

	/**
	 * Delete a custom palette.
	 *
	 * Requirement 3.1: Palette management methods.
	 *
	 * @param string $palette_id Palette ID to delete.
	 * @return bool True on success, false on failure.
	 */
	public function delete_custom_palette( $palette_id ) {
		// Prevent deletion of default palettes.
		if ( strpos( $palette_id, 'custom_' ) !== 0 ) {
			return false;
		}

		$current_settings = $this->get_option();
		
		if ( ! isset( $current_settings['palettes']['custom'][ $palette_id ] ) ) {
			return false;
		}

		// Remove custom palette.
		unset( $current_settings['palettes']['custom'][ $palette_id ] );

		// If deleted palette was current, reset to default.
		if ( isset( $current_settings['palettes']['current'] ) && 
		     $current_settings['palettes']['current'] === $palette_id ) {
			$current_settings['palettes']['current'] = 'professional-blue';
		}

		return $this->update_option( $current_settings );
	}

	/**
	 * Validate palette ID.
	 *
	 * Checks if palette ID exists in default or custom palettes.
	 * Requirements: 1.1, 2.1, 2.2
	 *
	 * @param string $palette_id Palette ID to validate.
	 * @return bool True if valid, false otherwise.
	 */
	public function validate_palette_id( $palette_id ) {
		if ( empty( $palette_id ) || ! is_string( $palette_id ) ) {
			return false;
		}

		$all_palettes = $this->get_all_palettes();
		return isset( $all_palettes[ $palette_id ] );
	}

	/**
	 * Validate palette colors.
	 *
	 * Requirement 3.4: Validate color arrays.
	 *
	 * @param array $colors Palette colors to validate.
	 * @return array|WP_Error Validated colors or WP_Error on failure.
	 */
	private function validate_palette_colors( $colors ) {
		$validated = array();
		$errors = array();

		// Validate admin_bar colors.
		if ( isset( $colors['admin_bar'] ) ) {
			$validated['admin_bar'] = array();
			
			if ( isset( $colors['admin_bar']['bg_color'] ) ) {
				$color = sanitize_hex_color( $colors['admin_bar']['bg_color'] );
				if ( $color ) {
					$validated['admin_bar']['bg_color'] = $color;
				} else {
					$errors['admin_bar_bg_color'] = 'Invalid hex color format';
				}
			}

			if ( isset( $colors['admin_bar']['text_color'] ) ) {
				$color = sanitize_hex_color( $colors['admin_bar']['text_color'] );
				if ( $color ) {
					$validated['admin_bar']['text_color'] = $color;
				} else {
					$errors['admin_bar_text_color'] = 'Invalid hex color format';
				}
			}
		}

		// Validate admin_menu colors.
		if ( isset( $colors['admin_menu'] ) ) {
			$validated['admin_menu'] = array();
			$color_fields = array( 'bg_color', 'text_color', 'hover_bg_color', 'hover_text_color' );
			
			foreach ( $color_fields as $field ) {
				if ( isset( $colors['admin_menu'][ $field ] ) ) {
					$color = sanitize_hex_color( $colors['admin_menu'][ $field ] );
					if ( $color ) {
						$validated['admin_menu'][ $field ] = $color;
					} else {
						$errors[ 'admin_menu_' . $field ] = 'Invalid hex color format';
					}
				}
			}
		}

		if ( ! empty( $errors ) ) {
			return new WP_Error( 'palette_validation_failed', 'Palette validation failed', $errors );
		}

		return $validated;
	}

	/**
	 * Validate template ID.
	 *
	 * Checks if template ID exists in default or custom templates.
	 * Requirements: 1.1, 2.1, 2.2
	 *
	 * @param string $template_id Template ID to validate.
	 * @return bool True if valid, false otherwise.
	 */
	public function validate_template_id( $template_id ) {
		if ( empty( $template_id ) || ! is_string( $template_id ) ) {
			return false;
		}

		$all_templates = $this->get_all_templates();
		return isset( $all_templates[ $template_id ] );
	}

	/**
	 * Get a specific template by ID.
	 *
	 * Retrieves template from default templates or custom templates.
	 * Requirement 3.2: Template management methods.
	 *
	 * @param string $template_id Template ID to retrieve.
	 * @return array|false Template data or false if not found.
	 */
	public function get_template( $template_id ) {
		$all_templates = $this->get_all_templates();
		
		return isset( $all_templates[ $template_id ] ) ? $all_templates[ $template_id ] : false;
	}

	/**
	 * Generate template thumbnail.
	 *
	 * Creates an SVG thumbnail with template name and primary color.
	 * Uses base64 encoding for inline data URI.
	 *
	 * @since 1.2.0
	 * @param string $name  Template name.
	 * @param string $color Primary color (hex).
	 * @return string Base64-encoded SVG data URI.
	 */
	private function generate_template_thumbnail( $name, $color ) {
		// Sanitize color input - remove # and validate hex format.
		$color_clean = str_replace( '#', '', $color );
		if ( ! preg_match( '/^[0-9A-Fa-f]{6}$/', $color_clean ) ) {
			$color_clean = '4A90E2'; // Default fallback color.
		}
		
		// Escape template name to prevent XSS.
		$name_escaped = esc_html( $name );
		
		// Generate 300x200px SVG with colored background.
		$svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">';
		$svg .= '<rect fill="#' . $color_clean . '" width="300" height="200"/>';
		$svg .= '<text x="150" y="100" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3)">';
		$svg .= $name_escaped;
		$svg .= '</text>';
		$svg .= '</svg>';
		
		// Encode SVG as base64 data URI.
		$base64 = base64_encode( $svg );
		
		return 'data:image/svg+xml;base64,' . $base64;
	}

	/**
	 * Get all available templates (default + custom).
	 *
	 * Requirement 3.2: Template management methods.
	 *
	 * @return array Array of all templates.
	 */
	public function get_all_templates() {
		$default_templates = $this->get_default_templates();
		$settings = $this->get_option();
		$custom_templates = isset( $settings['templates']['custom'] ) ? $settings['templates']['custom'] : array();
		
		$all_templates = array_merge( $default_templates, $custom_templates );
		
		// Add thumbnails to each template.
		foreach ( $all_templates as $template_id => &$template ) {
			// Extract primary color from template's palette settings.
			$primary_color = '#4A90E2'; // Default fallback color.
			
			if ( isset( $template['settings']['palettes']['current'] ) ) {
				$palette_id = $template['settings']['palettes']['current'];
				$palette = $this->get_palette( $palette_id );
				
				if ( ! is_wp_error( $palette ) && isset( $palette['colors']['primary'] ) ) {
					$primary_color = $palette['colors']['primary'];
				}
			}
			
			// Generate thumbnail with template name and color.
			$template['thumbnail'] = $this->generate_template_thumbnail( 
				$template['name'], 
				$primary_color 
			);
		}
		
		return $all_templates;
	}

	/**
	 * Get default templates.
	 *
	 * Defines 11 predefined templates with complete settings.
	 * Requirements: 1.1, 2.1, 2.2
	 *
	 * @return array Array of default templates.
	 */
	private function get_default_templates() {
		return array(
			'default' => array(
				'id'          => 'default',
				'name'        => 'WordPress Default',
				'description' => 'Classic WordPress admin styling with no modifications',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'professional-blue' ),
					'typography' => array(
						'admin_bar' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
						'admin_menu' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
					),
					'visual_effects' => array(
						'admin_bar' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 0,
							'shadow' => 'none',
						),
						'admin_menu' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 0,
							'shadow' => 'none',
						),
					),
				),
			),
			'modern-minimal' => array(
				'id'          => 'modern-minimal',
				'name'        => 'Modern Minimal',
				'description' => 'Clean and minimal design with subtle effects',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'professional-blue' ),
					'typography' => array(
						'admin_bar' => array(
							'font_size' => 14,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
						'admin_menu' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
					),
					'visual_effects' => array(
						'admin_bar' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 4,
							'shadow' => 'subtle',
						),
						'admin_menu' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 4,
							'shadow' => 'subtle',
						),
					),
				),
			),
			'glassmorphic' => array(
				'id'          => 'glassmorphic',
				'name'        => 'Glassmorphic',
				'description' => 'Modern glass effect with blur and transparency',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'professional-blue' ),
					'typography' => array(
						'admin_bar' => array(
							'font_size' => 14,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
					),
					'visual_effects' => array(
						'admin_bar' => array(
							'glassmorphism' => true,
							'blur_intensity' => 20,
							'floating' => true,
							'floating_margin' => 8,
							'border_radius' => 12,
							'shadow' => 'elevated',
						),
						'admin_menu' => array(
							'glassmorphism' => true,
							'blur_intensity' => 15,
							'floating' => false,
							'border_radius' => 8,
							'shadow' => 'subtle',
						),
					),
				),
			),
			'dark-mode' => array(
				'id'          => 'dark-mode',
				'name'        => 'Dark Mode',
				'description' => 'Elegant dark theme for reduced eye strain',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'dark-elegance' ),
					'typography' => array(
						'admin_bar' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
						'admin_menu' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
					),
					'visual_effects' => array(
						'admin_bar' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 0,
							'shadow' => 'subtle',
						),
						'admin_menu' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 0,
							'shadow' => 'subtle',
						),
					),
				),
			),
			'creative-studio' => array(
				'id'          => 'creative-studio',
				'name'        => 'Creative Studio',
				'description' => 'Vibrant and creative design for artistic workflows',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'creative-purple' ),
					'typography' => array(
						'admin_bar' => array(
							'font_size' => 14,
							'font_weight' => 500,
							'line_height' => 1.5,
						),
						'admin_menu' => array(
							'font_size' => 13,
							'font_weight' => 500,
							'line_height' => 1.5,
						),
					),
					'visual_effects' => array(
						'admin_bar' => array(
							'glassmorphism' => false,
							'floating' => true,
							'floating_margin' => 10,
							'border_radius' => 8,
							'shadow' => 'elevated',
						),
						'admin_menu' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 6,
							'shadow' => 'subtle',
						),
					),
				),
			),
			'corporate-pro' => array(
				'id'          => 'corporate-pro',
				'name'        => 'Corporate Pro',
				'description' => 'Professional corporate design with clean lines',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'midnight-blue' ),
					'typography' => array(
						'admin_bar' => array(
							'font_size' => 13,
							'font_weight' => 500,
							'line_height' => 1.5,
						),
						'admin_menu' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
					),
					'visual_effects' => array(
						'admin_bar' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 0,
							'shadow' => 'subtle',
						),
						'admin_menu' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 0,
							'shadow' => 'none',
						),
					),
				),
			),
			'nature-inspired' => array(
				'id'          => 'nature-inspired',
				'name'        => 'Nature Inspired',
				'description' => 'Calming green tones inspired by nature',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'forest-calm' ),
					'typography' => array(
						'admin_bar' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.6,
						),
						'admin_menu' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.6,
						),
					),
					'visual_effects' => array(
						'admin_bar' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 6,
							'shadow' => 'subtle',
						),
						'admin_menu' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 4,
							'shadow' => 'subtle',
						),
					),
				),
			),
			'sunset-vibes' => array(
				'id'          => 'sunset-vibes',
				'name'        => 'Sunset Vibes',
				'description' => 'Warm sunset colors for evening work sessions',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'sunset' ),
					'typography' => array(
						'admin_bar' => array(
							'font_size' => 14,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
						'admin_menu' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
					),
					'visual_effects' => array(
						'admin_bar' => array(
							'glassmorphism' => false,
							'floating' => true,
							'floating_margin' => 8,
							'border_radius' => 10,
							'shadow' => 'elevated',
						),
						'admin_menu' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 6,
							'shadow' => 'subtle',
						),
					),
				),
			),
			'ocean-depth' => array(
				'id'          => 'ocean-depth',
				'name'        => 'Ocean Depth',
				'description' => 'Cool ocean blues for a refreshing workspace',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'ocean-breeze' ),
					'typography' => array(
						'admin_bar' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
						'admin_menu' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
					),
					'visual_effects' => array(
						'admin_bar' => array(
							'glassmorphism' => true,
							'blur_intensity' => 15,
							'floating' => false,
							'border_radius' => 8,
							'shadow' => 'subtle',
						),
						'admin_menu' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 4,
							'shadow' => 'subtle',
						),
					),
				),
			),
			'elegant-rose' => array(
				'id'          => 'elegant-rose',
				'name'        => 'Elegant Rose',
				'description' => 'Sophisticated rose tones for a refined look',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'rose-garden' ),
					'typography' => array(
						'admin_bar' => array(
							'font_size' => 13,
							'font_weight' => 500,
							'line_height' => 1.5,
						),
						'admin_menu' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.5,
						),
					),
					'visual_effects' => array(
						'admin_bar' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 6,
							'shadow' => 'subtle',
						),
						'admin_menu' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 4,
							'shadow' => 'subtle',
						),
					),
				),
			),
			'golden-luxury' => array(
				'id'          => 'golden-luxury',
				'name'        => 'Golden Luxury',
				'description' => 'Luxurious golden tones for premium feel',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'golden-hour' ),
					'typography' => array(
						'admin_bar' => array(
							'font_size' => 14,
							'font_weight' => 500,
							'line_height' => 1.5,
						),
						'admin_menu' => array(
							'font_size' => 13,
							'font_weight' => 500,
							'line_height' => 1.5,
						),
					),
					'visual_effects' => array(
						'admin_bar' => array(
							'glassmorphism' => false,
							'floating' => true,
							'floating_margin' => 10,
							'border_radius' => 8,
							'shadow' => 'elevated',
						),
						'admin_menu' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 6,
							'shadow' => 'subtle',
						),
					),
				),
			),
		);
	}

	/**
	 * Apply a template.
	 *
	 * Applies complete template settings including palette, typography, and effects.
	 * Requirement 3.2: Template management methods.
	 *
	 * @param string $template_id Template ID to apply.
	 * @return bool True on success, false on failure.
	 */
	public function apply_template( $template_id ) {
		$template = $this->get_template( $template_id );

		if ( false === $template ) {
			return false;
		}

		$current_settings = $this->get_option();

		// Apply template settings (merge with current to preserve unrelated settings).
		if ( isset( $template['settings'] ) && is_array( $template['settings'] ) ) {
			foreach ( $template['settings'] as $key => $value ) {
				if ( is_array( $value ) && isset( $current_settings[ $key ] ) && is_array( $current_settings[ $key ] ) ) {
					$current_settings[ $key ] = $this->array_merge_recursive_distinct( $current_settings[ $key ], $value );
				} else {
					$current_settings[ $key ] = $value;
				}
			}
		}

		// Update current template.
		$current_settings['templates']['current'] = $template_id;

		// Apply palette if specified in template.
		if ( isset( $template['settings']['palettes']['current'] ) ) {
			$palette_id = $template['settings']['palettes']['current'];
			$palette = $this->get_palette( $palette_id );
			
			if ( false !== $palette ) {
				$current_settings['admin_bar'] = array_merge(
					$current_settings['admin_bar'],
					$palette['admin_bar']
				);
				$current_settings['admin_menu'] = array_merge(
					$current_settings['admin_menu'],
					$palette['admin_menu']
				);
			}
		}

		return $this->update_option( $current_settings );
	}

	/**
	 * Save a custom template.
	 *
	 * Requirement 3.2: Template management methods.
	 *
	 * @param string $name     Template name.
	 * @param array  $settings Template settings (complete settings snapshot).
	 * @return string|false Template ID on success, false on failure.
	 */
	public function save_custom_template( $name, $settings ) {
		// Validate settings structure.
		$validated_settings = $this->validate( $settings );
		if ( is_wp_error( $validated_settings ) ) {
			return false;
		}

		$current_settings = $this->get_option();
		
		// Generate unique ID for custom template.
		$template_id = 'custom_' . sanitize_title( $name ) . '_' . time();
		
		// Ensure custom templates array exists.
		if ( ! isset( $current_settings['templates']['custom'] ) ) {
			$current_settings['templates']['custom'] = array();
		}

		// Add custom template.
		$current_settings['templates']['custom'][ $template_id ] = array(
			'id'          => $template_id,
			'name'        => sanitize_text_field( $name ),
			'description' => '',
			'thumbnail'   => '',
			'is_custom'   => true,
			'created_at'  => current_time( 'timestamp' ),
			'settings'    => $validated_settings,
		);

		$result = $this->update_option( $current_settings );
		
		return $result ? $template_id : false;
	}

	/**
	 * Delete a custom template.
	 *
	 * Requirement 3.2: Template management methods.
	 *
	 * @param string $template_id Template ID to delete.
	 * @return bool True on success, false on failure.
	 */
	public function delete_custom_template( $template_id ) {
		// Prevent deletion of default templates.
		if ( strpos( $template_id, 'custom_' ) !== 0 ) {
			return false;
		}

		$current_settings = $this->get_option();
		
		if ( ! isset( $current_settings['templates']['custom'][ $template_id ] ) ) {
			return false;
		}

		// Remove custom template.
		unset( $current_settings['templates']['custom'][ $template_id ] );

		// If deleted template was current, reset to default.
		if ( isset( $current_settings['templates']['current'] ) && 
		     $current_settings['templates']['current'] === $template_id ) {
			$current_settings['templates']['current'] = 'default';
		}

		return $this->update_option( $current_settings );
	}

	/**
	 * Auto-switch palette based on time of day.
	 *
	 * Checks current time and applies configured palette for time period.
	 * Requirement 3.3: Auto palette switching with time-based logic.
	 *
	 * @return bool True if palette was switched, false otherwise.
	 */
	public function auto_switch_palette() {
		$settings = $this->get_option();
		
		// Check if auto-switching is enabled.
		if ( ! isset( $settings['advanced']['auto_palette_switch'] ) || 
		     ! $settings['advanced']['auto_palette_switch'] ) {
			return false;
		}

		$current_hour = intval( current_time( 'H' ) );
		$palette_id = $this->get_palette_for_time( $current_hour );
		
		// Check if palette needs to change.
		$current_palette = isset( $settings['palettes']['current'] ) ? $settings['palettes']['current'] : '';
		
		if ( $palette_id === $current_palette ) {
			return false;
		}

		// Apply the palette for current time.
		return $this->apply_palette( $palette_id );
	}

	/**
	 * Get palette ID for specific hour.
	 *
	 * Requirement 3.3: Time-based palette selection.
	 *
	 * @param int $hour Hour of day (0-23).
	 * @return string Palette ID for the time period.
	 */
	public function get_palette_for_time( $hour ) {
		$settings = $this->get_option();
		$time_palettes = isset( $settings['advanced']['auto_palette_times'] ) ? 
		                 $settings['advanced']['auto_palette_times'] : array();

		// Default time periods.
		if ( $hour >= 6 && $hour < 12 ) {
			// Morning: 6:00-11:59.
			return isset( $time_palettes['morning'] ) ? $time_palettes['morning'] : 'professional-blue';
		} elseif ( $hour >= 12 && $hour < 18 ) {
			// Afternoon: 12:00-17:59.
			return isset( $time_palettes['afternoon'] ) ? $time_palettes['afternoon'] : 'energetic-green';
		} elseif ( $hour >= 18 && $hour < 22 ) {
			// Evening: 18:00-21:59.
			return isset( $time_palettes['evening'] ) ? $time_palettes['evening'] : 'warm-orange';
		} else {
			// Night: 22:00-5:59.
			return isset( $time_palettes['night'] ) ? $time_palettes['night'] : 'creative-purple';
		}
	}

	/**
	 * Get current plugin version from database.
	 *
	 * @return string|false Current version or false if not set.
	 */
	public function get_current_version() {
		return get_option( self::VERSION_OPTION_NAME, false );
	}

	/**
	 * Update plugin version in database.
	 *
	 * @param string $version Version to store.
	 * @return bool True on success, false on failure.
	 */
	private function update_version( $version ) {
		return update_option( self::VERSION_OPTION_NAME, $version );
	}

	/**
	 * Check if migration is needed.
	 *
	 * @return bool True if migration needed, false otherwise.
	 */
	public function needs_migration() {
		$current_version = $this->get_current_version();
		
		// Fresh install - no migration needed.
		if ( false === $current_version ) {
			return false;
		}

		// Compare versions.
		return version_compare( $current_version, self::PLUGIN_VERSION, '<' );
	}

	/**
	 * Run all necessary migrations.
	 *
	 * Checks current version and runs appropriate migration methods.
	 * Requirement 15.4: Preserve existing settings during plugin update.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function run_migrations() {
		$current_version = $this->get_current_version();

		// Fresh install - initialize version and defaults.
		if ( false === $current_version ) {
			$this->initialize_defaults();
			$this->update_version( self::PLUGIN_VERSION );
			return true;
		}

		// No migration needed.
		if ( ! $this->needs_migration() ) {
			return true;
		}

		$success = true;

		// Migrate from v1.1 or earlier to v1.2 (visual effects feature).
		if ( version_compare( $current_version, '1.2.0', '<' ) ) {
			$success = $this->migrate_to_v1_2();
		}

		// Update version if all migrations successful.
		if ( $success ) {
			$this->update_version( self::PLUGIN_VERSION );
		}

		return $success;
	}

	/**
	 * Migrate settings from v1.1 to v1.2.
	 *
	 * Adds visual effects settings while preserving all existing settings.
	 * Requirements: 15.1-15.6
	 * - 15.1: Store in WordPress options table (existing structure)
	 * - 15.2: Use structured array format (existing structure)
	 * - 15.3: Return default values for missing keys
	 * - 15.4: Preserve existing settings during update
	 * - 15.5: Cache separately (handled by MASE_CacheManager)
	 * - 15.6: Display error on database write failure
	 *
	 * @return bool True on success, false on failure.
	 */
	public function migrate_to_v1_2() {
		// Get existing settings.
		$existing_settings = get_option( self::OPTION_NAME, array() );

		// If settings don't exist, initialize with defaults.
		if ( empty( $existing_settings ) ) {
			return $this->initialize_defaults();
		}

		// Check if visual_effects already exists (migration already done).
		if ( isset( $existing_settings['visual_effects'] ) ) {
			return true;
		}

		// Get default visual effects settings.
		$defaults = $this->get_defaults();
		$visual_effects_defaults = $defaults['visual_effects'];

		// Add visual effects to existing settings without modifying other settings.
		$existing_settings['visual_effects'] = $visual_effects_defaults;

		// Save updated settings.
		$result = update_option( self::OPTION_NAME, $existing_settings );

		// Log migration result.
		if ( $result ) {
			error_log( 'MASE: Successfully migrated settings to v1.2 (added visual effects)' );
		} else {
			error_log( 'MASE: Failed to migrate settings to v1.2 - database write error' );
		}

		return $result;
	}

	/**
	 * Verify migration integrity.
	 *
	 * Checks that all expected settings keys exist after migration.
	 *
	 * @return array Array with 'success' boolean and 'missing_keys' array.
	 */
	public function verify_migration() {
		$current_settings = get_option( self::OPTION_NAME, array() );
		$defaults = $this->get_defaults();
		$missing_keys = array();

		// Check top-level keys.
		foreach ( array_keys( $defaults ) as $key ) {
			if ( ! isset( $current_settings[ $key ] ) ) {
				$missing_keys[] = $key;
			}
		}

		// Check visual effects sub-keys.
		if ( isset( $current_settings['visual_effects'] ) ) {
			foreach ( array_keys( $defaults['visual_effects'] ) as $key ) {
				if ( ! isset( $current_settings['visual_effects'][ $key ] ) ) {
					$missing_keys[] = 'visual_effects.' . $key;
				}
			}
		}

		return array(
			'success'      => empty( $missing_keys ),
			'missing_keys' => $missing_keys,
		);
	}
}
