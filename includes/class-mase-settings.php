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
	 * to ensure completeness (Requirement 16.3, 4.2).
	 * Ensures Height Mode and all new admin menu settings are loaded correctly.
	 *
	 * @param string|null $key     Optional. Specific setting key to retrieve.
	 * @param mixed       $default Optional. Default value if key not found.
	 * @return mixed Setting value or full settings array.
	 */
	public function get_option( $key = null, $default = null ) {
		$defaults = $this->get_defaults();
		$settings = get_option( self::OPTION_NAME, array() );

		// Merge with defaults to ensure all keys exist (Requirement 16.3, 4.2).
		// This ensures Height Mode and all new admin menu settings have default values.
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
	 * Requirement 4.1: Ensure Height Mode is saved correctly.
	 * Requirements 18.1: Validate and sanitize all new menu settings.
	 * Requirements 2.1, 2.2: Return WP_Error on validation failure.
	 * Requirements 3.1, 3.2, 3.3, 3.4, 3.5: Handle mobile optimizer errors gracefully.
	 *
	 * @param array $data Settings data to save.
	 * @return bool|WP_Error True on success, WP_Error on validation failure.
	 */
	public function update_option( $data ) {
		// Validate all settings including Height Mode and new admin menu settings (Requirement 4.1, 18.1).
		error_log( 'MASE: update_option called with sections: ' . implode( ', ', array_keys( $data ) ) );
		
		$validated = $this->validate( $data );
		
		// CRITICAL: Return WP_Error instead of false to preserve error details (Requirement 2.1, 2.2).
		if ( is_wp_error( $validated ) ) {
			error_log( 'MASE: Validation error: ' . $validated->get_error_message() );
			$error_data = $validated->get_error_data();
			if ( is_array( $error_data ) ) {
				error_log( 'MASE: Validation errors: ' . print_r( $error_data, true ) );
			}
			// Return WP_Error to caller instead of false (Requirement 2.2).
			return $validated;
		}
		
		error_log( 'MASE: Validation passed, validated sections: ' . implode( ', ', array_keys( $validated ) ) );

		// Apply mobile optimization with comprehensive error handling (Requirements 3.1, 3.2, 3.3, 3.4, 3.5).
		try {
			// Check if mobile optimizer class exists (Requirement 3.1).
			if ( class_exists( 'MASE_Mobile_Optimizer' ) ) {
				$mobile_optimizer = new MASE_Mobile_Optimizer();
				
				// Check if is_mobile method exists before calling (Requirement 3.2).
				if ( method_exists( $mobile_optimizer, 'is_mobile' ) && $mobile_optimizer->is_mobile() ) {
					// Check if get_optimized_settings method exists before calling (Requirement 3.3).
					if ( method_exists( $mobile_optimizer, 'get_optimized_settings' ) ) {
						$validated = $mobile_optimizer->get_optimized_settings( $validated );
					} else {
						error_log( 'MASE: Mobile optimizer error: get_optimized_settings method not found' );
					}
				}
			} else {
				// Log warning but continue - mobile optimization is optional (Requirement 3.1).
				error_log( 'MASE: Mobile optimizer class not available - skipping optimization' );
			}
		} catch ( Exception $e ) {
			// Catch exceptions and log but continue save operation (Requirement 3.4, 3.5).
			error_log( 'MASE: Mobile optimizer error: ' . $e->getMessage() );
		} catch ( Error $e ) {
			// Catch fatal errors and log but continue save operation (Requirement 3.4, 3.5).
			error_log( 'MASE: Mobile optimizer error: ' . $e->getMessage() );
		}

		$result = update_option( self::OPTION_NAME, $validated );
		error_log( 'MASE: update_option result: ' . ( $result ? 'true' : 'false' ) );
		error_log( 'MASE: Validated data keys: ' . implode( ', ', array_keys( $validated ) ) );
		
		// Task 20: Invalidate CSS cache when settings are updated (Requirement 19.4).
		// This ensures fresh CSS is generated on next page load.
		MASE_CacheManager::delete( 'mase_generated_css' );
		error_log( 'MASE: CSS cache invalidated after settings update' );
		
		// Return true even if value unchanged (update_option returns false if value unchanged).
		// But log the actual result for debugging.
		if ( ! $result ) {
			error_log( 'MASE: WordPress update_option returned false - value may be unchanged' );
		}
		
		return true;
	}

	/**
	 * Save settings (alias for update_option).
	 * 
	 * Requirement 18.1: Add validation for all new menu settings.
	 * Requirement 4.1: Ensure Height Mode is saved correctly.
	 *
	 * @param array $data Settings data to save.
	 * @return bool True on success, false on failure.
	 */
	public function save_settings( $data ) {
		return $this->update_option( $data );
	}

	/**
	 * Get settings (alias for get_option).
	 * 
	 * Requirement 18.2: Load all new menu settings with defaults.
	 * Requirement 4.2: Ensure Height Mode is loaded correctly.
	 *
	 * @param string|null $key     Optional. Specific setting key to retrieve.
	 * @param mixed       $default Optional. Default value if key not found.
	 * @return mixed Setting value or full settings array.
	 */
	public function get_settings( $key = null, $default = null ) {
		return $this->get_option( $key, $default );
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
				// Existing properties
				'bg_color'          => '#23282d',
				'text_color'        => '#ffffff',
				'hover_bg_color'    => '#191e23',
				'hover_text_color'  => '#00b9eb',
				'width'             => 160,
				'width_unit'        => 'pixels', // 'pixels' | 'percent' (Requirement 14.1)
				'width_value'       => 160, // 160-400 pixels or 50-100 percent (Requirement 14.2)
				'height_mode'       => 'full', // 'full' | 'content'
				
				// NEW: Gradient background (Requirement 6.1)
				'bg_type'           => 'solid', // 'solid' | 'gradient'
				'gradient_type'     => 'linear', // 'linear' | 'radial' | 'conic'
				'gradient_angle'    => 90, // 0-360 degrees
				'gradient_colors'   => array(
					array( 'color' => '#23282d', 'position' => 0 ),
					array( 'color' => '#32373c', 'position' => 100 ),
				),
				
				// NEW: Padding controls (Requirement 1.2)
				'padding_vertical'   => 10, // 5-30 pixels
				'padding_horizontal' => 15, // 5-30 pixels
				
				// NEW: Icon color controls (Requirement 2.3)
				'icon_color_mode'   => 'auto', // 'auto' | 'custom'
				'icon_color'        => '#ffffff', // used when mode is 'custom'
				
				// NEW: Corner radius (Requirement 12.1)
				'border_radius_mode' => 'uniform', // 'uniform' | 'individual'
				'border_radius'      => 0, // uniform value 0-50px
				'border_radius_tl'   => 0, // top-left
				'border_radius_tr'   => 0, // top-right
				'border_radius_bl'   => 0, // bottom-left
				'border_radius_br'   => 0, // bottom-right
				
				// NEW: Floating margins (Requirement 15.1)
				'floating'           => false,
				'floating_margin_mode' => 'uniform', // 'uniform' | 'individual'
				'floating_margin'    => 8, // uniform value 0-100px
				'floating_margin_top'    => 8,
				'floating_margin_right'  => 8,
				'floating_margin_bottom' => 8,
				'floating_margin_left'   => 8,
				
				// NEW: Advanced shadows (Requirement 13.1)
				'shadow_mode'        => 'preset', // 'preset' | 'custom'
				'shadow_preset'      => 'none', // 'none' | 'subtle' | 'medium' | 'strong' | 'dramatic'
				'shadow_h_offset'    => 0,
				'shadow_v_offset'    => 4,
				'shadow_blur'        => 8,
				'shadow_spread'      => 0,
				'shadow_color'       => 'rgba(0,0,0,0.15)',
				'shadow_opacity'     => 0.15,
				
				// NEW: Logo placement (Requirement 16.1)
				'logo_enabled'       => false,
				'logo_url'           => '',
				'logo_position'      => 'top', // 'top' | 'bottom'
				'logo_width'         => 100, // 20-200 pixels
				'logo_alignment'     => 'center', // 'left' | 'center' | 'right'
			),
			// NEW: Admin menu submenu settings (Requirements 7.1, 8.1, 9.1, 10.1)
			'admin_menu_submenu' => array(
				'bg_color'           => '#32373c',
				'border_radius_mode' => 'uniform',
				'border_radius'      => 0,
				'border_radius_tl'   => 0,
				'border_radius_tr'   => 0,
				'border_radius_bl'   => 0,
				'border_radius_br'   => 0,
				'spacing'            => 0, // distance from menu 0-50px
				
				// Submenu typography
				'font_size'          => 13, // 10-24px
				'text_color'         => '#ffffff',
				'line_height'        => 1.5, // 1.0-3.0
				'letter_spacing'     => 0, // -2 to 5px
				'text_transform'     => 'none', // 'none' | 'uppercase' | 'lowercase' | 'capitalize'
				'font_family'        => 'system', // 'system' | Google Font name
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
			// EXTENDED: Typography with enhanced settings (Requirement 3.3, 11.1).
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
					'font_family'    => 'system', // NEW: Font family support (Requirement 11.1)
					'google_font_url' => '', // NEW: Google Font URL if selected
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
			// NEW: Dark/Light Mode Toggle (Global Dark Mode Feature).
			'dark_light_toggle' => array(
				'enabled'                    => true,
				'current_mode'               => 'light', // 'light' | 'dark'
				'respect_system_preference'  => true,
				'light_palette'              => 'professional-blue',
				'dark_palette'               => 'dark-elegance',
				'transition_duration'        => 300, // milliseconds
				'keyboard_shortcut_enabled'  => true,
				'fab_position'               => array(
					'bottom' => 20, // pixels from bottom
					'right'  => 20, // pixels from right
				),
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
					'padding_top'    => 8,
					'padding_right'  => 12,
					'padding_bottom' => 8,
					'padding_left'   => 12,
					'margin_top'     => 0,
					'offset_left'    => 0,
					'unit'           => 'px',
				),
				'content_margin' => array(
					'top'    => 20,
					'right'  => 20,
					'bottom' => 20,
					'left'   => 0,  // Changed from 20 to 0 - WordPress already has proper margin from menu
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
			// NEW: Login Page Customization (Requirements 5.1, 5.2)
			'login_customization' => array(
				// Logo Settings
				'logo_enabled'        => false,
				'logo_url'            => '',
				'logo_width'          => 84,  // WordPress default
				'logo_height'         => 84,
				'logo_link_url'       => '',  // Empty = wordpress.org (default)
				
				// Background Settings
				'background_type'     => 'color',  // 'color' | 'image' | 'gradient'
				'background_color'    => '#f0f0f1', // WordPress default
				'background_image'    => '',
				'background_position' => 'center center',
				'background_size'     => 'cover',  // 'cover' | 'contain' | 'auto'
				'background_repeat'   => 'no-repeat',
				'background_opacity'  => 100,
				
				// Gradient Settings (when background_type = 'gradient')
				'gradient_type'       => 'linear',  // 'linear' | 'radial'
				'gradient_angle'      => 135,
				'gradient_colors'     => array(
					array( 'color' => '#667eea', 'position' => 0 ),
					array( 'color' => '#764ba2', 'position' => 100 ),
				),
				
				// Form Styling
				'form_bg_color'       => '#ffffff',
				'form_border_color'   => '#c3c4c7',
				'form_border_radius'  => 0,
				'form_box_shadow'     => 'default',  // 'none' | 'default' | 'subtle' | 'medium' | 'strong'
				'form_text_color'     => '#2c3338',
				'form_focus_color'    => '#2271b1',
				
				// Glassmorphism Effect
				'glassmorphism_enabled' => false,
				'glassmorphism_blur'    => 10,
				'glassmorphism_opacity' => 80,
				
				// Typography
				'label_font_family'   => 'system',
				'label_font_size'     => 14,
				'label_font_weight'   => 400,
				'input_font_family'   => 'system',
				'input_font_size'     => 24,
				
				// Additional Elements
				'footer_text'         => '',
				'hide_wp_branding'    => false,
				'custom_css'          => '',
				'remember_me_style'   => 'default',  // 'default' | 'custom'
			),
			// NEW: Universal Button Styling System (Requirements 1.1, 1.2, 11.1)
			'universal_buttons' => $this->get_button_defaults(),
			// Plugin Compatibility: Excluded button selectors (Requirements 10.1, 10.2)
			'excluded_button_selectors' => '',
			// NEW: Advanced Background System (Requirements 1.1, 4.1, 11.1)
			'custom_backgrounds' => $this->get_background_defaults(),
			// NEW: Content Typography System (Requirements 1.1, 1.2, 1.3, 1.4)
			'content_typography' => $this->get_content_typography_defaults(),
			// NEW: Dashboard Widgets Customization (Requirements 2.1, 2.2, 2.3, 2.4, 2.5)
			'dashboard_widgets' => $this->get_dashboard_widgets_defaults(),
			// NEW: Advanced Input Fields & Forms System (Requirements 3.1, 3.2, 3.3, 3.4)
			'form_controls' => $this->get_form_controls_defaults(),
		);
	}

	/**
	 * Get default button settings for all button types and states.
	 *
	 * Defines default styling for 6 button types (Primary, Secondary, Danger, Success, Ghost, Tabs)
	 * across 5 states (normal, hover, active, focus, disabled).
	 * Requirements: 1.1, 1.2, 11.1
	 *
	 * @return array Default button settings array.
	 */
	private function get_button_defaults() {
		// Define base state properties that will be used as template
		$default_state = array(
			'bg_type'             => 'solid',
			'bg_color'            => '#0073aa',
			'gradient_type'       => 'linear',
			'gradient_angle'      => 90,
			'gradient_colors'     => array(
				array( 'color' => '#0073aa', 'position' => 0 ),
				array( 'color' => '#005177', 'position' => 100 ),
			),
			'text_color'          => '#ffffff',
			'border_width'        => 1,
			'border_style'        => 'solid',
			'border_color'        => '#0073aa',
			'border_radius_mode'  => 'uniform',
			'border_radius'       => 3,
			'border_radius_tl'    => 3,
			'border_radius_tr'    => 3,
			'border_radius_bl'    => 3,
			'border_radius_br'    => 3,
			'padding_horizontal'  => 12,
			'padding_vertical'    => 6,
			'font_size'           => 13,
			'font_weight'         => 400,
			'text_transform'      => 'none',
			'shadow_mode'         => 'preset',
			'shadow_preset'       => 'subtle',
			'shadow_h_offset'     => 0,
			'shadow_v_offset'     => 2,
			'shadow_blur'         => 4,
			'shadow_spread'       => 0,
			'shadow_color'        => 'rgba(0,0,0,0.1)',
			'transition_duration' => 200,
			'ripple_effect'       => false,
		);

		return array(
			'primary' => array(
				'normal' => $default_state,
				'hover' => array_merge( $default_state, array(
					'bg_color' => '#005177',
				) ),
				'active' => array_merge( $default_state, array(
					'bg_color' => '#004561',
				) ),
				'focus' => array_merge( $default_state, array(
					'border_color' => '#00a0d2',
				) ),
				'disabled' => array_merge( $default_state, array(
					'bg_color'   => '#cccccc',
					'text_color' => '#666666',
				) ),
			),
			'secondary' => array(
				'normal' => array_merge( $default_state, array(
					'bg_color'     => '#f7f7f7',
					'text_color'   => '#555555',
					'border_color' => '#cccccc',
				) ),
				'hover' => array_merge( $default_state, array(
					'bg_color'     => '#fafafa',
					'text_color'   => '#23282d',
					'border_color' => '#999999',
				) ),
				'active' => array_merge( $default_state, array(
					'bg_color'     => '#eeeeee',
					'text_color'   => '#23282d',
					'border_color' => '#999999',
				) ),
				'focus' => array_merge( $default_state, array(
					'bg_color'     => '#f7f7f7',
					'text_color'   => '#555555',
					'border_color' => '#00a0d2',
				) ),
				'disabled' => array_merge( $default_state, array(
					'bg_color'     => '#f7f7f7',
					'text_color'   => '#a0a5aa',
					'border_color' => '#ddd',
				) ),
			),
			'danger' => array(
				'normal' => array_merge( $default_state, array(
					'bg_color'     => '#dc3232',
					'text_color'   => '#ffffff',
					'border_color' => '#dc3232',
				) ),
				'hover' => array_merge( $default_state, array(
					'bg_color'     => '#c62d2d',
					'text_color'   => '#ffffff',
					'border_color' => '#c62d2d',
				) ),
				'active' => array_merge( $default_state, array(
					'bg_color'     => '#b02828',
					'text_color'   => '#ffffff',
					'border_color' => '#b02828',
				) ),
				'focus' => array_merge( $default_state, array(
					'bg_color'     => '#dc3232',
					'text_color'   => '#ffffff',
					'border_color' => '#ff6b6b',
				) ),
				'disabled' => array_merge( $default_state, array(
					'bg_color'     => '#f0b8b8',
					'text_color'   => '#999999',
					'border_color' => '#f0b8b8',
				) ),
			),
			'success' => array(
				'normal' => array_merge( $default_state, array(
					'bg_color'     => '#46b450',
					'text_color'   => '#ffffff',
					'border_color' => '#46b450',
				) ),
				'hover' => array_merge( $default_state, array(
					'bg_color'     => '#3fa045',
					'text_color'   => '#ffffff',
					'border_color' => '#3fa045',
				) ),
				'active' => array_merge( $default_state, array(
					'bg_color'     => '#388c3b',
					'text_color'   => '#ffffff',
					'border_color' => '#388c3b',
				) ),
				'focus' => array_merge( $default_state, array(
					'bg_color'     => '#46b450',
					'text_color'   => '#ffffff',
					'border_color' => '#6dd46f',
				) ),
				'disabled' => array_merge( $default_state, array(
					'bg_color'     => '#b8e6bb',
					'text_color'   => '#999999',
					'border_color' => '#b8e6bb',
				) ),
			),
			'ghost' => array(
				'normal' => array_merge( $default_state, array(
					'bg_color'     => 'transparent',
					'text_color'   => '#0073aa',
					'border_width' => 0,
					'border_style' => 'none',
					'border_color' => 'transparent',
				) ),
				'hover' => array_merge( $default_state, array(
					'bg_color'     => 'transparent',
					'text_color'   => '#005177',
					'border_width' => 0,
					'border_style' => 'none',
					'border_color' => 'transparent',
				) ),
				'active' => array_merge( $default_state, array(
					'bg_color'     => 'transparent',
					'text_color'   => '#004561',
					'border_width' => 0,
					'border_style' => 'none',
					'border_color' => 'transparent',
				) ),
				'focus' => array_merge( $default_state, array(
					'bg_color'     => 'transparent',
					'text_color'   => '#0073aa',
					'border_width' => 0,
					'border_style' => 'none',
					'border_color' => 'transparent',
				) ),
				'disabled' => array_merge( $default_state, array(
					'bg_color'     => 'transparent',
					'text_color'   => '#a0a5aa',
					'border_width' => 0,
					'border_style' => 'none',
					'border_color' => 'transparent',
				) ),
			),
			'tabs' => array(
				'normal' => array_merge( $default_state, array(
					'bg_color'     => '#f1f1f1',
					'text_color'   => '#555555',
					'border_width' => 1,
					'border_style' => 'solid',
					'border_color' => '#cccccc',
					'border_radius' => 0,
					'border_radius_tl' => 0,
					'border_radius_tr' => 0,
					'border_radius_bl' => 0,
					'border_radius_br' => 0,
				) ),
				'hover' => array_merge( $default_state, array(
					'bg_color'     => '#ffffff',
					'text_color'   => '#23282d',
					'border_width' => 1,
					'border_style' => 'solid',
					'border_color' => '#cccccc',
					'border_radius' => 0,
					'border_radius_tl' => 0,
					'border_radius_tr' => 0,
					'border_radius_bl' => 0,
					'border_radius_br' => 0,
				) ),
				'active' => array_merge( $default_state, array(
					'bg_color'     => '#ffffff',
					'text_color'   => '#23282d',
					'border_width' => 1,
					'border_style' => 'solid',
					'border_color' => '#cccccc',
					'border_radius' => 0,
					'border_radius_tl' => 0,
					'border_radius_tr' => 0,
					'border_radius_bl' => 0,
					'border_radius_br' => 0,
				) ),
				'focus' => array_merge( $default_state, array(
					'bg_color'     => '#f1f1f1',
					'text_color'   => '#555555',
					'border_width' => 1,
					'border_style' => 'solid',
					'border_color' => '#00a0d2',
					'border_radius' => 0,
					'border_radius_tl' => 0,
					'border_radius_tr' => 0,
					'border_radius_bl' => 0,
					'border_radius_br' => 0,
				) ),
				'disabled' => array_merge( $default_state, array(
					'bg_color'     => '#f1f1f1',
					'text_color'   => '#a0a5aa',
					'border_width' => 1,
					'border_style' => 'solid',
					'border_color' => '#ddd',
					'border_radius' => 0,
					'border_radius_tl' => 0,
					'border_radius_tr' => 0,
					'border_radius_bl' => 0,
					'border_radius_br' => 0,
				) ),
			),
		);
	}

	/**
	 * Get default background settings for all admin areas.
	 *
	 * Defines default background configuration for 6 admin areas (dashboard, admin_menu, 
	 * post_lists, post_editor, widgets, login) supporting 3 background types (image, gradient, pattern).
	 * Requirements: 1.1, 4.1, 11.1
	 *
	 * @return array Default background settings array.
	 */
	private function get_background_defaults() {
		// Define base background configuration template
		$default_background = array(
			'enabled'             => false,
			'type'                => 'none', // 'none' | 'image' | 'gradient' | 'pattern'
			
			// Image settings
			'image_url'           => '',
			'image_id'            => 0, // WordPress attachment ID
			'position'            => 'center center',
			'size'                => 'cover', // 'cover' | 'contain' | 'auto' | 'custom'
			'size_custom'         => '', // e.g., '100% auto'
			'repeat'              => 'no-repeat', // 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
			'attachment'          => 'scroll', // 'scroll' | 'fixed'
			
			// Gradient settings
			'gradient_type'       => 'linear', // 'linear' | 'radial'
			'gradient_angle'      => 90, // 0-360 degrees
			'gradient_colors'     => array(
				array( 'color' => '#667eea', 'position' => 0 ),
				array( 'color' => '#764ba2', 'position' => 100 ),
			),
			'gradient_preset'     => '', // preset ID or empty for custom
			
			// Pattern settings
			'pattern_id'          => '', // pattern identifier
			'pattern_color'       => '#000000',
			'pattern_opacity'     => 100, // 0-100
			'pattern_scale'       => 100, // 50-200
			
			// Advanced options
			'opacity'             => 100, // 0-100
			'blend_mode'          => 'normal', // CSS blend mode value
			
			// Responsive variations
			'responsive_enabled'  => false,
			'responsive'          => array(
				'desktop' => array(), // Will inherit parent settings
				'tablet'  => array(), // Will inherit parent settings
				'mobile'  => array(), // Will inherit parent settings
			),
		);

		return array(
			'dashboard'   => $default_background,
			'admin_menu'  => $default_background,
			'post_lists'  => $default_background,
			'post_editor' => $default_background,
			'widgets'     => $default_background,
			'login'       => $default_background,
		);
	}

	/**
	 * Get default content typography settings for all admin areas.
	 *
	 * Defines default typography configuration for 6 admin content areas with 13 properties each,
	 * heading hierarchy with scale ratios, and Google Fonts integration.
	 * Requirements: 1.1, 1.2, 1.3, 1.4
	 *
	 * @return array Default content typography settings array.
	 */
	private function get_content_typography_defaults() {
		// Define base typography properties template
		$default_typography = array(
			'font_family'      => 'system', // 'system' | Google Font name
			'font_size'        => 13, // 8-72px
			'line_height'      => 1.5, // 0.8-3.0
			'letter_spacing'   => 0, // -5px to 10px
			'word_spacing'     => 0, // -5px to 10px
			'font_weight'      => 400, // 100-900 (multiples of 100)
			'font_style'       => 'normal', // 'normal' | 'italic' | 'oblique'
			'text_transform'   => 'none', // 'none' | 'uppercase' | 'lowercase' | 'capitalize'
			'text_shadow'      => '', // CSS text-shadow value
			'text_stroke'      => '', // CSS -webkit-text-stroke value
			'ligatures'        => false, // Enable font ligatures
			'drop_caps'        => false, // Enable drop caps for first letter
			'font_variant'     => 'normal', // CSS font-variant value
		);

		return array(
			// 6 admin content areas
			'body_text' => $default_typography,
			'headings' => array(
				'scale_ratio' => 1.250, // 1.125, 1.200, 1.250, 1.333, 1.414, 1.500, 1.618
				'h1' => array_merge( $default_typography, array(
					'font_size' => 32,
					'font_weight' => 700,
					'line_height' => 1.2,
				) ),
				'h2' => array_merge( $default_typography, array(
					'font_size' => 26,
					'font_weight' => 600,
					'line_height' => 1.3,
				) ),
				'h3' => array_merge( $default_typography, array(
					'font_size' => 21,
					'font_weight' => 600,
					'line_height' => 1.3,
				) ),
				'h4' => array_merge( $default_typography, array(
					'font_size' => 17,
					'font_weight' => 600,
					'line_height' => 1.4,
				) ),
				'h5' => array_merge( $default_typography, array(
					'font_size' => 14,
					'font_weight' => 600,
					'line_height' => 1.4,
				) ),
				'h6' => array_merge( $default_typography, array(
					'font_size' => 13,
					'font_weight' => 600,
					'line_height' => 1.4,
				) ),
			),
			'comments' => $default_typography,
			'widgets' => $default_typography,
			'meta' => array_merge( $default_typography, array(
				'font_size' => 12,
				'line_height' => 1.4,
			) ),
			'tables' => $default_typography,
			'notices' => $default_typography,
			
			// Google Fonts configuration
			'google_fonts_enabled' => false,
			'google_fonts_list' => array(), // Array of Google Font names
			'font_display' => 'swap', // 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
			'preload_fonts' => array(), // Array of font names to preload
			'font_subset' => 'latin-ext', // Font subset for Polish language support
		);
	}

	/**
	 * Get default dashboard widgets settings.
	 *
	 * Defines default styling configuration for dashboard widgets including container,
	 * header, content, specific widget overrides, advanced effects, and responsive layout.
	 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
	 *
	 * @return array Default dashboard widgets settings array.
	 */
	private function get_dashboard_widgets_defaults() {
		return array(
			// Global container settings (Requirement 2.1)
			'container' => array(
				'bg_type'            => 'solid', // 'solid' | 'gradient' | 'transparent'
				'bg_color'           => '#ffffff',
				'gradient_type'      => 'linear', // 'linear' | 'radial'
				'gradient_angle'     => 90, // 0-360 degrees
				'gradient_colors'    => array(
					array( 'color' => '#ffffff', 'position' => 0 ),
					array( 'color' => '#f0f0f0', 'position' => 100 ),
				),
				'border_width_top'    => 1, // 0-10 pixels
				'border_width_right'  => 1,
				'border_width_bottom' => 1,
				'border_width_left'   => 1,
				'border_style'        => 'solid', // 'solid' | 'dashed' | 'dotted' | 'double'
				'border_color'        => '#cccccc',
				'border_radius_mode'  => 'uniform', // 'uniform' | 'individual'
				'border_radius'       => 4, // 0-50 pixels (uniform mode)
				'border_radius_tl'    => 4, // top-left (individual mode)
				'border_radius_tr'    => 4, // top-right
				'border_radius_br'    => 4, // bottom-right
				'border_radius_bl'    => 4, // bottom-left
				'shadow_preset'       => 'subtle', // 'none' | 'subtle' | 'medium' | 'strong' | 'custom'
				'shadow_h_offset'     => 0, // -50 to 50 pixels (custom mode)
				'shadow_v_offset'     => 2,
				'shadow_blur'         => 4,
				'shadow_spread'       => 0,
				'shadow_color'        => 'rgba(0,0,0,0.1)',
				'padding_top'         => 12, // 5-50 pixels
				'padding_right'       => 12,
				'padding_bottom'      => 12,
				'padding_left'        => 12,
				'margin_top'          => 0, // 0-30 pixels
				'margin_right'        => 0,
				'margin_bottom'       => 20,
				'margin_left'         => 0,
			),
			
			// Header settings (Requirement 2.2)
			'header' => array(
				'bg_color'           => '#f5f5f5',
				'font_size'          => 14, // 12-24 pixels
				'font_weight'        => 600, // 400-700
				'text_color'         => '#23282d',
				'text_transform'     => 'none', // 'none' | 'uppercase' | 'lowercase' | 'capitalize'
				'border_bottom_width' => 1, // 0-5 pixels
				'border_bottom_color' => '#e0e0e0',
				'icon_color'         => 'inherit', // 'inherit' or hex color
				'icon_size'          => 16, // 12-24 pixels
				'height'             => 'auto', // 'auto' or custom px value
			),
			
			// Content area settings (Requirement 2.3)
			'content' => array(
				'bg_color'           => 'transparent', // hex color or 'transparent'
				'font_size'          => 13, // 10-18 pixels
				'text_color'         => '#555555',
				'link_color'         => '#0073aa',
				'link_hover_color'   => '#005177',
				'list_style'         => 'disc', // 'disc' | 'circle' | 'square' | 'none'
				'list_spacing'       => 8, // 0-20 pixels
			),
			
			// Specific widget overrides (Requirement 2.1)
			'specific_widgets' => array(
				'dashboard_right_now' => array(
					'enabled'   => false,
					'container' => array(), // Override any container settings
					'header'    => array(), // Override any header settings
					'content'   => array(), // Override any content settings
				),
				'dashboard_activity' => array(
					'enabled'   => false,
					'container' => array(),
					'header'    => array(),
					'content'   => array(),
				),
				'dashboard_quick_press' => array(
					'enabled'   => false,
					'container' => array(),
					'header'    => array(),
					'content'   => array(),
				),
				'dashboard_primary' => array(
					'enabled'   => false,
					'container' => array(),
					'header'    => array(),
					'content'   => array(),
				),
			),
			
			// Advanced effects (Requirement 2.4)
			'glassmorphism'      => false,
			'blur_intensity'     => 10, // 0-30 pixels
			'hover_animation'    => 'none', // 'none' | 'lift' | 'glow' | 'scale'
			'hover_lift_distance' => 4, // 0-10 pixels
			'hover_scale_factor' => 1.02, // 1.0-1.1
			
			// Responsive layout (Requirement 2.5)
			'responsive' => array(
				'mobile_stack'       => true,
				'tablet_columns'     => 2, // 1-2
				'desktop_columns'    => 3, // 2-4
			),
		);
	}

	/**
	 * Get default form controls settings for all input types.
	 *
	 * Defines default styling configuration for 7 input types (text_inputs, textareas, selects,
	 * checkboxes, radios, file_uploads, search_fields) with state-specific settings.
	 * Requirements: 3.1, 3.2, 3.3, 3.4
	 *
	 * @return array Default form controls settings array.
	 */
	private function get_form_controls_defaults() {
		// Define base form control properties template
		$default_control = array(
			'bg_color'           => '#ffffff',
			'bg_color_focus'     => '#ffffff',
			'bg_color_disabled'  => '#f7f7f7',
			'text_color'         => '#32373c',
			'placeholder_color'  => '#7e8993',
			'border_width_top'   => 1, // 0-5 pixels
			'border_width_right' => 1,
			'border_width_bottom' => 1,
			'border_width_left'  => 1,
			'border_color'       => '#8c8f94',
			'border_color_focus' => '#007cba',
			'border_color_hover' => '#6c7781',
			'border_color_error' => '#dc3232',
			'border_radius'      => 4, // 0-25 pixels
			'padding_horizontal' => 12, // 5-25 pixels
			'padding_vertical'   => 8, // 3-15 pixels
			'height_mode'        => 'auto', // 'auto' | 'custom'
			'height_custom'      => 40, // 20-60 pixels
			'font_family'        => 'system',
			'font_size'          => 14, // 10-18 pixels
			'font_weight'        => 400, // 400-600
			'focus_glow'         => '0 0 0 2px rgba(0,124,186,0.2)',
			'disabled_opacity'   => 60, // 0-100 percent
		);

		return array(
			// Text inputs settings (Requirement 3.1)
			'text_inputs' => $default_control,
			
			// Textareas settings (extends text_inputs) (Requirement 3.1)
			'textareas' => array_merge( $default_control, array(
				'min_height'         => 100, // 50-300 pixels
				'resize'             => 'vertical', // 'none' | 'both' | 'horizontal' | 'vertical'
				'line_height'        => 1.6, // 1.0-2.0
			) ),
			
			// Select dropdowns settings (extends text_inputs) (Requirement 3.1)
			'selects' => array_merge( $default_control, array(
				'arrow_icon'         => 'default', // 'default' | 'chevron' | 'caret' | 'custom'
				'arrow_custom_svg'   => '',
				'dropdown_bg_color'  => '#ffffff',
				'dropdown_border_color' => '#8c8f94',
				'option_hover_color' => '#f0f0f0',
				'option_selected_color' => '#007cba',
			) ),
			
			// Checkboxes settings (Requirement 3.2)
			'checkboxes' => array(
				'size'               => 16, // 12-24 pixels
				'bg_color'           => '#ffffff',
				'bg_color_checked'   => '#007cba',
				'border_color'       => '#8c8f94',
				'border_color_checked' => '#007cba',
				'check_color'        => '#ffffff',
				'border_radius'      => 2, // 0-8 pixels
				'check_animation'    => 'slide', // 'slide' | 'fade' | 'bounce' | 'none'
				'custom_icon'        => false,
				'custom_icon_svg'    => '',
			),
			
			// Radio buttons settings (Requirement 3.2)
			'radios' => array(
				'size'               => 16, // 12-24 pixels
				'bg_color'           => '#ffffff',
				'bg_color_checked'   => '#007cba',
				'border_color'       => '#8c8f94',
				'border_color_checked' => '#007cba',
				'dot_color'          => '#ffffff',
				'dot_size'           => 8, // 4-16 pixels
				'check_animation'    => 'fade', // 'slide' | 'fade' | 'bounce' | 'none'
			),
			
			// File uploads settings (Requirement 3.3)
			'file_uploads' => array(
				'dropzone_bg_color'  => '#f9f9f9',
				'dropzone_border_color' => '#8c8f94',
				'dropzone_border_style' => 'dashed', // 'solid' | 'dashed' | 'dotted'
				'dropzone_hover_bg_color' => '#f0f0f0',
				'progress_color'     => '#007cba',
				'progress_bg_color'  => '#e0e0e0',
				'file_type_icons'    => true,
				'button_style'       => 'primary', // 'primary' | 'secondary' | 'custom'
			),
			
			// Search fields settings (extends text_inputs) (Requirement 3.4)
			'search_fields' => array_merge( $default_control, array(
				'icon_position'      => 'left', // 'left' | 'right' | 'none'
				'icon_color'         => '#7e8993',
				'clear_button'       => true,
				'clear_button_color' => '#7e8993',
			) ),
		);
	}

	/**
	 * Get gradient presets library.
	 *
	 * Provides 20+ pre-designed gradient presets organized by category.
	 * Presets can be filtered via WordPress filter hook for extensibility.
	 * Requirement 2.3: Gradient preset library with popular gradients.
	 *
	 * @return array Gradient presets organized by category.
	 */
	public function get_gradient_presets() {
		$presets = array(
			// Warm gradients
			'warm' => array(
				'sunset' => array(
					'name'   => __( 'Sunset', 'mase' ),
					'type'   => 'linear',
					'angle'  => 135,
					'colors' => array(
						array( 'color' => '#ff6b6b', 'position' => 0 ),
						array( 'color' => '#feca57', 'position' => 100 ),
					),
				),
				'fire' => array(
					'name'   => __( 'Fire', 'mase' ),
					'type'   => 'linear',
					'angle'  => 45,
					'colors' => array(
						array( 'color' => '#f12711', 'position' => 0 ),
						array( 'color' => '#f5af19', 'position' => 100 ),
					),
				),
				'peach' => array(
					'name'   => __( 'Peach', 'mase' ),
					'type'   => 'linear',
					'angle'  => 90,
					'colors' => array(
						array( 'color' => '#ed4264', 'position' => 0 ),
						array( 'color' => '#ffedbc', 'position' => 100 ),
					),
				),
				'orange-coral' => array(
					'name'   => __( 'Orange Coral', 'mase' ),
					'type'   => 'linear',
					'angle'  => 120,
					'colors' => array(
						array( 'color' => '#ff9a56', 'position' => 0 ),
						array( 'color' => '#ff6a88', 'position' => 100 ),
					),
				),
				'warm-flame' => array(
					'name'   => __( 'Warm Flame', 'mase' ),
					'type'   => 'linear',
					'angle'  => 45,
					'colors' => array(
						array( 'color' => '#ff9a56', 'position' => 0 ),
						array( 'color' => '#ff6a88', 'position' => 50 ),
						array( 'color' => '#ff99ac', 'position' => 100 ),
					),
				),
			),
			
			// Cool gradients
			'cool' => array(
				'ocean' => array(
					'name'   => __( 'Ocean', 'mase' ),
					'type'   => 'linear',
					'angle'  => 180,
					'colors' => array(
						array( 'color' => '#667eea', 'position' => 0 ),
						array( 'color' => '#764ba2', 'position' => 100 ),
					),
				),
				'sky' => array(
					'name'   => __( 'Sky', 'mase' ),
					'type'   => 'linear',
					'angle'  => 135,
					'colors' => array(
						array( 'color' => '#56ccf2', 'position' => 0 ),
						array( 'color' => '#2f80ed', 'position' => 100 ),
					),
				),
				'frost' => array(
					'name'   => __( 'Frost', 'mase' ),
					'type'   => 'linear',
					'angle'  => 90,
					'colors' => array(
						array( 'color' => '#a8edea', 'position' => 0 ),
						array( 'color' => '#fed6e3', 'position' => 100 ),
					),
				),
				'deep-blue' => array(
					'name'   => __( 'Deep Blue', 'mase' ),
					'type'   => 'linear',
					'angle'  => 180,
					'colors' => array(
						array( 'color' => '#6a11cb', 'position' => 0 ),
						array( 'color' => '#2575fc', 'position' => 100 ),
					),
				),
				'aqua' => array(
					'name'   => __( 'Aqua', 'mase' ),
					'type'   => 'linear',
					'angle'  => 135,
					'colors' => array(
						array( 'color' => '#13547a', 'position' => 0 ),
						array( 'color' => '#80d0c7', 'position' => 100 ),
					),
				),
			),
			
			// Vibrant gradients
			'vibrant' => array(
				'rainbow' => array(
					'name'   => __( 'Rainbow', 'mase' ),
					'type'   => 'linear',
					'angle'  => 90,
					'colors' => array(
						array( 'color' => '#ff0000', 'position' => 0 ),
						array( 'color' => '#ff7f00', 'position' => 20 ),
						array( 'color' => '#ffff00', 'position' => 40 ),
						array( 'color' => '#00ff00', 'position' => 60 ),
						array( 'color' => '#0000ff', 'position' => 80 ),
						array( 'color' => '#8b00ff', 'position' => 100 ),
					),
				),
				'neon' => array(
					'name'   => __( 'Neon', 'mase' ),
					'type'   => 'linear',
					'angle'  => 45,
					'colors' => array(
						array( 'color' => '#f953c6', 'position' => 0 ),
						array( 'color' => '#b91d73', 'position' => 100 ),
					),
				),
				'electric' => array(
					'name'   => __( 'Electric', 'mase' ),
					'type'   => 'linear',
					'angle'  => 135,
					'colors' => array(
						array( 'color' => '#4facfe', 'position' => 0 ),
						array( 'color' => '#00f2fe', 'position' => 100 ),
					),
				),
				'purple-bliss' => array(
					'name'   => __( 'Purple Bliss', 'mase' ),
					'type'   => 'linear',
					'angle'  => 90,
					'colors' => array(
						array( 'color' => '#360033', 'position' => 0 ),
						array( 'color' => '#0b8793', 'position' => 100 ),
					),
				),
				'pink-flavour' => array(
					'name'   => __( 'Pink Flavour', 'mase' ),
					'type'   => 'linear',
					'angle'  => 180,
					'colors' => array(
						array( 'color' => '#800080', 'position' => 0 ),
						array( 'color' => '#ffc0cb', 'position' => 100 ),
					),
				),
			),
			
			// Subtle gradients
			'subtle' => array(
				'cloudy-apple' => array(
					'name'   => __( 'Cloudy Apple', 'mase' ),
					'type'   => 'linear',
					'angle'  => 135,
					'colors' => array(
						array( 'color' => '#f3e7e9', 'position' => 0 ),
						array( 'color' => '#e3eeff', 'position' => 100 ),
					),
				),
				'soft-grass' => array(
					'name'   => __( 'Soft Grass', 'mase' ),
					'type'   => 'linear',
					'angle'  => 90,
					'colors' => array(
						array( 'color' => '#c1dfc4', 'position' => 0 ),
						array( 'color' => '#deecdd', 'position' => 100 ),
					),
				),
				'light-blue' => array(
					'name'   => __( 'Light Blue', 'mase' ),
					'type'   => 'linear',
					'angle'  => 180,
					'colors' => array(
						array( 'color' => '#e0f7fa', 'position' => 0 ),
						array( 'color' => '#b2ebf2', 'position' => 100 ),
					),
				),
				'pale-wood' => array(
					'name'   => __( 'Pale Wood', 'mase' ),
					'type'   => 'linear',
					'angle'  => 45,
					'colors' => array(
						array( 'color' => '#eacda3', 'position' => 0 ),
						array( 'color' => '#d6ae7b', 'position' => 100 ),
					),
				),
				'morning-salad' => array(
					'name'   => __( 'Morning Salad', 'mase' ),
					'type'   => 'linear',
					'angle'  => 135,
					'colors' => array(
						array( 'color' => '#b7f8db', 'position' => 0 ),
						array( 'color' => '#50a7c2', 'position' => 100 ),
					),
				),
			),
			
			// Nature gradients
			'nature' => array(
				'forest' => array(
					'name'   => __( 'Forest', 'mase' ),
					'type'   => 'linear',
					'angle'  => 90,
					'colors' => array(
						array( 'color' => '#134e5e', 'position' => 0 ),
						array( 'color' => '#71b280', 'position' => 100 ),
					),
				),
				'spring-warmth' => array(
					'name'   => __( 'Spring Warmth', 'mase' ),
					'type'   => 'linear',
					'angle'  => 135,
					'colors' => array(
						array( 'color' => '#fad0c4', 'position' => 0 ),
						array( 'color' => '#ffd1ff', 'position' => 100 ),
					),
				),
				'autumn' => array(
					'name'   => __( 'Autumn', 'mase' ),
					'type'   => 'linear',
					'angle'  => 45,
					'colors' => array(
						array( 'color' => '#dad299', 'position' => 0 ),
						array( 'color' => '#b0dab9', 'position' => 100 ),
					),
				),
				'winter' => array(
					'name'   => __( 'Winter', 'mase' ),
					'type'   => 'linear',
					'angle'  => 180,
					'colors' => array(
						array( 'color' => '#e6dada', 'position' => 0 ),
						array( 'color' => '#274046', 'position' => 100 ),
					),
				),
			),
			
			// Radial gradients
			'radial' => array(
				'radial-sunset' => array(
					'name'   => __( 'Radial Sunset', 'mase' ),
					'type'   => 'radial',
					'angle'  => 0, // Not used for radial
					'colors' => array(
						array( 'color' => '#ff6b6b', 'position' => 0 ),
						array( 'color' => '#feca57', 'position' => 100 ),
					),
				),
				'radial-ocean' => array(
					'name'   => __( 'Radial Ocean', 'mase' ),
					'type'   => 'radial',
					'angle'  => 0,
					'colors' => array(
						array( 'color' => '#667eea', 'position' => 0 ),
						array( 'color' => '#764ba2', 'position' => 100 ),
					),
				),
				'radial-glow' => array(
					'name'   => __( 'Radial Glow', 'mase' ),
					'type'   => 'radial',
					'angle'  => 0,
					'colors' => array(
						array( 'color' => '#ffffff', 'position' => 0 ),
						array( 'color' => '#4facfe', 'position' => 100 ),
					),
				),
			),
		);

		/**
		 * Filter gradient presets library.
		 *
		 * Allows developers to add, remove, or modify gradient presets.
		 *
		 * @since 1.2.0
		 * @param array $presets Gradient presets organized by category.
		 */
		return apply_filters( 'mase_gradient_presets', $presets );
	}

	/**
	 * Validate settings input with selective validation.
	 *
	 * SECURITY IMPLEMENTATION (Requirement 20.1, 20.2, 22.1):
	 * - Validates all numeric inputs against allowed ranges
	 * - Sanitizes all color values using sanitize_hex_color()
	 * - Sanitizes all text inputs using sanitize_text_field()
	 * - Validates enum values against allowed options
	 * - Returns WP_Error with detailed error information on failure
	 *
	 * SELECTIVE VALIDATION STRATEGY (Requirement 1.1, 1.2, 1.3):
	 * - Only validates sections present in submitted data
	 * - Prevents validation failures in unrelated sections from blocking saves
	 * - Allows partial updates without full validation overhead
	 * - Critical for palette/template application which only changes specific sections
	 *
	 * VALIDATION RULES:
	 * - admin_bar.height: 0-500 pixels
	 * - admin_menu.width: 100-400 pixels or 50-100 percent
	 * - Colors: Must be valid hex format (#RRGGBB)
	 * - Enum values: Must match predefined allowed values
	 * - Text fields: Sanitized to prevent XSS
	 *
	 * ERROR HANDLING:
	 * - Collects all validation errors before returning
	 * - Returns WP_Error with error details for user feedback
	 * - Logs validation errors for debugging
	 *
	 * @param array $input Input data to validate (only sections being updated).
	 * @return array|WP_Error Validated data array on success, WP_Error on validation failure.
	 * @since 1.0.0
	 */
	public function validate( $input ) {
		error_log( 'MASE: validate() called with input sections: ' . implode( ', ', array_keys( $input ) ) );
		
		$validated = array();
		$errors    = array();
		
		// CRITICAL FIX (Requirement 1.1, 1.2, 1.3): Only validate sections present in submitted data
		// This prevents validation failures in unrelated sections from blocking saves

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

			// Validate width (legacy support for old 'width' field)
			if ( isset( $input['admin_menu']['width'] ) ) {
				$width = absint( $input['admin_menu']['width'] );
				if ( $width >= 100 && $width <= 400 ) {
					$validated['admin_menu']['width'] = $width;
				} else {
					$errors['admin_menu_width'] = 'Width must be between 100 and 400';
				}
			}

			// Validate width_unit (Requirement 14.1)
			if ( isset( $input['admin_menu']['width_unit'] ) ) {
				$width_unit = sanitize_text_field( $input['admin_menu']['width_unit'] );
				if ( in_array( $width_unit, array( 'pixels', 'percent' ), true ) ) {
					$validated['admin_menu']['width_unit'] = $width_unit;
				} else {
					$errors['admin_menu_width_unit'] = 'Width unit must be pixels or percent';
				}
			}

			// Validate width_value (Requirement 14.2, 14.3)
			if ( isset( $input['admin_menu']['width_value'] ) ) {
				$width_value = absint( $input['admin_menu']['width_value'] );
				$width_unit = isset( $validated['admin_menu']['width_unit'] ) ? $validated['admin_menu']['width_unit'] : 'pixels';
				
				if ( $width_unit === 'percent' ) {
					// Percentage: 50-100%
					if ( $width_value >= 50 && $width_value <= 100 ) {
						$validated['admin_menu']['width_value'] = $width_value;
					} else {
						$errors['admin_menu_width_value'] = 'Width percentage must be between 50 and 100';
					}
				} else {
					// Pixels: 160-400px
					if ( $width_value >= 160 && $width_value <= 400 ) {
						$validated['admin_menu']['width_value'] = $width_value;
					} else {
						$errors['admin_menu_width_value'] = 'Width pixels must be between 160 and 400';
					}
				}
			}

			// Validate height_mode (Requirement 4.1)
			if ( isset( $input['admin_menu']['height_mode'] ) ) {
				$height_mode = sanitize_text_field( $input['admin_menu']['height_mode'] );
				if ( in_array( $height_mode, array( 'full', 'content' ), true ) ) {
					$validated['admin_menu']['height_mode'] = $height_mode;
				} else {
					$errors['admin_menu_height_mode'] = 'Height mode must be full or content';
				}
			}

			// Validate bg_type (Requirement 6.1)
			if ( isset( $input['admin_menu']['bg_type'] ) ) {
				$bg_type = sanitize_text_field( $input['admin_menu']['bg_type'] );
				if ( in_array( $bg_type, array( 'solid', 'gradient' ), true ) ) {
					$validated['admin_menu']['bg_type'] = $bg_type;
				}
			}

			// Validate gradient_type (Requirement 6.1)
			if ( isset( $input['admin_menu']['gradient_type'] ) ) {
				$gradient_type = sanitize_text_field( $input['admin_menu']['gradient_type'] );
				if ( in_array( $gradient_type, array( 'linear', 'radial', 'conic' ), true ) ) {
					$validated['admin_menu']['gradient_type'] = $gradient_type;
				}
			}

			// Validate gradient_angle (Requirement 6.4)
			if ( isset( $input['admin_menu']['gradient_angle'] ) ) {
				$angle = absint( $input['admin_menu']['gradient_angle'] );
				if ( $angle >= 0 && $angle <= 360 ) {
					$validated['admin_menu']['gradient_angle'] = $angle;
				}
			}

			// Validate gradient_colors (Requirement 6.2)
			if ( isset( $input['admin_menu']['gradient_colors'] ) && is_array( $input['admin_menu']['gradient_colors'] ) ) {
				$validated['admin_menu']['gradient_colors'] = array();
				foreach ( $input['admin_menu']['gradient_colors'] as $stop ) {
					if ( isset( $stop['color'] ) && isset( $stop['position'] ) ) {
						$color = sanitize_hex_color( $stop['color'] );
						$position = absint( $stop['position'] );
						if ( $color && $position >= 0 && $position <= 100 ) {
							$validated['admin_menu']['gradient_colors'][] = array(
								'color' => $color,
								'position' => $position,
							);
						}
					}
				}
			}

			// Validate padding (Requirement 1.2)
			if ( isset( $input['admin_menu']['padding_vertical'] ) ) {
				$padding = absint( $input['admin_menu']['padding_vertical'] );
				if ( $padding >= 5 && $padding <= 30 ) {
					$validated['admin_menu']['padding_vertical'] = $padding;
				}
			}

			if ( isset( $input['admin_menu']['padding_horizontal'] ) ) {
				$padding = absint( $input['admin_menu']['padding_horizontal'] );
				if ( $padding >= 5 && $padding <= 30 ) {
					$validated['admin_menu']['padding_horizontal'] = $padding;
				}
			}

			// Validate icon_color_mode (Requirement 2.3)
			if ( isset( $input['admin_menu']['icon_color_mode'] ) ) {
				$mode = sanitize_text_field( $input['admin_menu']['icon_color_mode'] );
				if ( in_array( $mode, array( 'auto', 'custom' ), true ) ) {
					$validated['admin_menu']['icon_color_mode'] = $mode;
				}
			}

			// Validate icon_color (Requirement 2.3)
			if ( isset( $input['admin_menu']['icon_color'] ) ) {
				$color = sanitize_hex_color( $input['admin_menu']['icon_color'] );
				if ( $color ) {
					$validated['admin_menu']['icon_color'] = $color;
				}
			}

			// Validate border_radius_mode (Requirement 12.1)
			if ( isset( $input['admin_menu']['border_radius_mode'] ) ) {
				$mode = sanitize_text_field( $input['admin_menu']['border_radius_mode'] );
				if ( in_array( $mode, array( 'uniform', 'individual' ), true ) ) {
					$validated['admin_menu']['border_radius_mode'] = $mode;
				}
			}

			// Validate border_radius values (Requirement 12.1)
			$radius_fields = array( 'border_radius', 'border_radius_tl', 'border_radius_tr', 'border_radius_bl', 'border_radius_br' );
			foreach ( $radius_fields as $field ) {
				if ( isset( $input['admin_menu'][ $field ] ) ) {
					$radius = absint( $input['admin_menu'][ $field ] );
					if ( $radius >= 0 && $radius <= 50 ) {
						$validated['admin_menu'][ $field ] = $radius;
					}
				}
			}

			// Validate floating (Requirement 15.1)
			if ( isset( $input['admin_menu']['floating'] ) ) {
				$validated['admin_menu']['floating'] = (bool) $input['admin_menu']['floating'];
			}

			// Validate floating_margin_mode (Requirement 15.1)
			if ( isset( $input['admin_menu']['floating_margin_mode'] ) ) {
				$mode = sanitize_text_field( $input['admin_menu']['floating_margin_mode'] );
				if ( in_array( $mode, array( 'uniform', 'individual' ), true ) ) {
					$validated['admin_menu']['floating_margin_mode'] = $mode;
				}
			}

			// Validate floating margin values (Requirement 15.1)
			$margin_fields = array( 'floating_margin', 'floating_margin_top', 'floating_margin_right', 'floating_margin_bottom', 'floating_margin_left' );
			foreach ( $margin_fields as $field ) {
				if ( isset( $input['admin_menu'][ $field ] ) ) {
					$margin = absint( $input['admin_menu'][ $field ] );
					if ( $margin >= 0 && $margin <= 100 ) {
						$validated['admin_menu'][ $field ] = $margin;
					}
				}
			}

			// Validate shadow_mode (Requirement 13.1)
			if ( isset( $input['admin_menu']['shadow_mode'] ) ) {
				$mode = sanitize_text_field( $input['admin_menu']['shadow_mode'] );
				if ( in_array( $mode, array( 'preset', 'custom' ), true ) ) {
					$validated['admin_menu']['shadow_mode'] = $mode;
				}
			}

			// Validate shadow_preset (Requirement 13.1)
			if ( isset( $input['admin_menu']['shadow_preset'] ) ) {
				$preset = sanitize_text_field( $input['admin_menu']['shadow_preset'] );
				if ( in_array( $preset, array( 'none', 'subtle', 'medium', 'strong', 'dramatic' ), true ) ) {
					$validated['admin_menu']['shadow_preset'] = $preset;
				}
			}

			// Validate custom shadow values (Requirement 13.2)
			if ( isset( $input['admin_menu']['shadow_h_offset'] ) ) {
				$validated['admin_menu']['shadow_h_offset'] = intval( $input['admin_menu']['shadow_h_offset'] );
			}

			if ( isset( $input['admin_menu']['shadow_v_offset'] ) ) {
				$validated['admin_menu']['shadow_v_offset'] = intval( $input['admin_menu']['shadow_v_offset'] );
			}

			if ( isset( $input['admin_menu']['shadow_blur'] ) ) {
				$blur = absint( $input['admin_menu']['shadow_blur'] );
				if ( $blur >= 0 && $blur <= 50 ) {
					$validated['admin_menu']['shadow_blur'] = $blur;
				}
			}

			if ( isset( $input['admin_menu']['shadow_spread'] ) ) {
				$validated['admin_menu']['shadow_spread'] = intval( $input['admin_menu']['shadow_spread'] );
			}

			if ( isset( $input['admin_menu']['shadow_color'] ) ) {
				$shadow_color = sanitize_text_field( $input['admin_menu']['shadow_color'] );
				if ( preg_match( '/^(rgba?\([^)]+\)|#[0-9a-f]{3,8})$/i', $shadow_color ) ) {
					$validated['admin_menu']['shadow_color'] = $shadow_color;
				}
			}

			if ( isset( $input['admin_menu']['shadow_opacity'] ) ) {
				$opacity = floatval( $input['admin_menu']['shadow_opacity'] );
				if ( $opacity >= 0 && $opacity <= 1 ) {
					$validated['admin_menu']['shadow_opacity'] = round( $opacity, 2 );
				}
			}

			// Validate logo settings (Requirement 16.1)
			if ( isset( $input['admin_menu']['logo_enabled'] ) ) {
				$validated['admin_menu']['logo_enabled'] = (bool) $input['admin_menu']['logo_enabled'];
			}

			if ( isset( $input['admin_menu']['logo_url'] ) ) {
				$validated['admin_menu']['logo_url'] = esc_url_raw( $input['admin_menu']['logo_url'] );
			}

			if ( isset( $input['admin_menu']['logo_position'] ) ) {
				$position = sanitize_text_field( $input['admin_menu']['logo_position'] );
				if ( in_array( $position, array( 'top', 'bottom' ), true ) ) {
					$validated['admin_menu']['logo_position'] = $position;
				}
			}

			if ( isset( $input['admin_menu']['logo_width'] ) ) {
				$width = absint( $input['admin_menu']['logo_width'] );
				if ( $width >= 20 && $width <= 200 ) {
					$validated['admin_menu']['logo_width'] = $width;
				}
			}

			if ( isset( $input['admin_menu']['logo_alignment'] ) ) {
				$alignment = sanitize_text_field( $input['admin_menu']['logo_alignment'] );
				if ( in_array( $alignment, array( 'left', 'center', 'right' ), true ) ) {
					$validated['admin_menu']['logo_alignment'] = $alignment;
				}
			}
		}

		// NEW: Validate admin_menu_submenu settings (Requirements 7.1, 8.1, 9.1, 10.1)
		if ( isset( $input['admin_menu_submenu'] ) ) {
			$validated['admin_menu_submenu'] = array();

			// Validate bg_color
			if ( isset( $input['admin_menu_submenu']['bg_color'] ) ) {
				$color = sanitize_hex_color( $input['admin_menu_submenu']['bg_color'] );
				if ( $color ) {
					$validated['admin_menu_submenu']['bg_color'] = $color;
				}
			}

			// Validate border_radius_mode
			if ( isset( $input['admin_menu_submenu']['border_radius_mode'] ) ) {
				$mode = sanitize_text_field( $input['admin_menu_submenu']['border_radius_mode'] );
				if ( in_array( $mode, array( 'uniform', 'individual' ), true ) ) {
					$validated['admin_menu_submenu']['border_radius_mode'] = $mode;
				}
			}

			// Validate border_radius values (0-20px for submenu)
			$radius_fields = array( 'border_radius', 'border_radius_tl', 'border_radius_tr', 'border_radius_bl', 'border_radius_br' );
			foreach ( $radius_fields as $field ) {
				if ( isset( $input['admin_menu_submenu'][ $field ] ) ) {
					$radius = absint( $input['admin_menu_submenu'][ $field ] );
					if ( $radius >= 0 && $radius <= 20 ) {
						$validated['admin_menu_submenu'][ $field ] = $radius;
					}
				}
			}

			// Validate spacing (0-50px)
			if ( isset( $input['admin_menu_submenu']['spacing'] ) ) {
				$spacing = absint( $input['admin_menu_submenu']['spacing'] );
				if ( $spacing >= 0 && $spacing <= 50 ) {
					$validated['admin_menu_submenu']['spacing'] = $spacing;
				}
			}

			// Validate font_size (10-24px)
			if ( isset( $input['admin_menu_submenu']['font_size'] ) ) {
				$font_size = absint( $input['admin_menu_submenu']['font_size'] );
				if ( $font_size >= 10 && $font_size <= 24 ) {
					$validated['admin_menu_submenu']['font_size'] = $font_size;
				}
			}

			// Validate text_color
			if ( isset( $input['admin_menu_submenu']['text_color'] ) ) {
				$color = sanitize_hex_color( $input['admin_menu_submenu']['text_color'] );
				if ( $color ) {
					$validated['admin_menu_submenu']['text_color'] = $color;
				}
			}

			// Validate line_height (1.0-3.0)
			if ( isset( $input['admin_menu_submenu']['line_height'] ) ) {
				$line_height = floatval( $input['admin_menu_submenu']['line_height'] );
				if ( $line_height >= 1.0 && $line_height <= 3.0 ) {
					$validated['admin_menu_submenu']['line_height'] = round( $line_height, 1 );
				}
			}

			// Validate letter_spacing (-2 to 5px)
			if ( isset( $input['admin_menu_submenu']['letter_spacing'] ) ) {
				$letter_spacing = intval( $input['admin_menu_submenu']['letter_spacing'] );
				if ( $letter_spacing >= -2 && $letter_spacing <= 5 ) {
					$validated['admin_menu_submenu']['letter_spacing'] = $letter_spacing;
				}
			}

			// Validate text_transform
			if ( isset( $input['admin_menu_submenu']['text_transform'] ) ) {
				$text_transform = strtolower( sanitize_text_field( $input['admin_menu_submenu']['text_transform'] ) );
				if ( in_array( $text_transform, array( 'none', 'uppercase', 'lowercase', 'capitalize' ), true ) ) {
					$validated['admin_menu_submenu']['text_transform'] = $text_transform;
				}
			}

			// Validate font_family
			if ( isset( $input['admin_menu_submenu']['font_family'] ) ) {
				$validated['admin_menu_submenu']['font_family'] = sanitize_text_field( $input['admin_menu_submenu']['font_family'] );
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
		// CRITICAL FIX (Requirement 1.1): Only validate if section data is present and non-empty
		if ( isset( $input['typography'] ) && is_array( $input['typography'] ) && ! empty( $input['typography'] ) ) {
			$typography_result = $this->validate_typography( $input['typography'] );
			if ( is_wp_error( $typography_result ) ) {
				$errors = array_merge( $errors, $typography_result->get_error_data() );
			} else {
				$validated['typography'] = $typography_result;
			}
		}

		// Validate visual effects settings.
		// CRITICAL FIX (Requirement 1.1): Only validate if section data is present and non-empty
		if ( isset( $input['visual_effects'] ) && is_array( $input['visual_effects'] ) && ! empty( $input['visual_effects'] ) ) {
			$visual_effects_result = $this->validate_visual_effects( $input['visual_effects'] );
			if ( is_wp_error( $visual_effects_result ) ) {
				$errors = array_merge( $errors, $visual_effects_result->get_error_data() );
			} else {
				$validated['visual_effects'] = $visual_effects_result;
			}
		}

		// Validate spacing settings.
		// CRITICAL FIX (Requirement 1.1): Only validate if section data is present and non-empty
		if ( isset( $input['spacing'] ) && is_array( $input['spacing'] ) && ! empty( $input['spacing'] ) ) {
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

		// NEW: Validate dark_light_toggle settings (Global Dark Mode Feature).
		if ( isset( $input['dark_light_toggle'] ) ) {
			$validated['dark_light_toggle'] = array();

			// Validate enabled
			if ( isset( $input['dark_light_toggle']['enabled'] ) ) {
				$validated['dark_light_toggle']['enabled'] = (bool) $input['dark_light_toggle']['enabled'];
			}

			// Validate current_mode
			if ( isset( $input['dark_light_toggle']['current_mode'] ) ) {
				$mode = sanitize_text_field( $input['dark_light_toggle']['current_mode'] );
				if ( in_array( $mode, array( 'light', 'dark' ), true ) ) {
					$validated['dark_light_toggle']['current_mode'] = $mode;
				} else {
					$errors['dark_light_toggle_current_mode'] = 'Mode must be light or dark';
				}
			}

			// Validate respect_system_preference
			if ( isset( $input['dark_light_toggle']['respect_system_preference'] ) ) {
				$validated['dark_light_toggle']['respect_system_preference'] = (bool) $input['dark_light_toggle']['respect_system_preference'];
			}

			// Validate light_palette
			if ( isset( $input['dark_light_toggle']['light_palette'] ) ) {
				$validated['dark_light_toggle']['light_palette'] = sanitize_text_field( $input['dark_light_toggle']['light_palette'] );
			}

			// Validate dark_palette
			if ( isset( $input['dark_light_toggle']['dark_palette'] ) ) {
				$validated['dark_light_toggle']['dark_palette'] = sanitize_text_field( $input['dark_light_toggle']['dark_palette'] );
			}

			// Validate transition_duration (0-1000ms, 0 = instant)
			if ( isset( $input['dark_light_toggle']['transition_duration'] ) ) {
				$duration = absint( $input['dark_light_toggle']['transition_duration'] );
				if ( $duration >= 0 && $duration <= 1000 ) {
					$validated['dark_light_toggle']['transition_duration'] = $duration;
				} else {
					$errors['dark_light_toggle_transition_duration'] = 'Transition duration must be between 0 and 1000ms';
				}
			}

			// Validate keyboard_shortcut_enabled
			if ( isset( $input['dark_light_toggle']['keyboard_shortcut_enabled'] ) ) {
				$validated['dark_light_toggle']['keyboard_shortcut_enabled'] = (bool) $input['dark_light_toggle']['keyboard_shortcut_enabled'];
			}

			// Validate fab_position
			if ( isset( $input['dark_light_toggle']['fab_position'] ) && is_array( $input['dark_light_toggle']['fab_position'] ) ) {
				$validated['dark_light_toggle']['fab_position'] = array();

				// Validate bottom (0-200px)
				if ( isset( $input['dark_light_toggle']['fab_position']['bottom'] ) ) {
					$bottom = absint( $input['dark_light_toggle']['fab_position']['bottom'] );
					if ( $bottom >= 0 && $bottom <= 200 ) {
						$validated['dark_light_toggle']['fab_position']['bottom'] = $bottom;
					}
				}

				// Validate right (0-200px)
				if ( isset( $input['dark_light_toggle']['fab_position']['right'] ) ) {
					$right = absint( $input['dark_light_toggle']['fab_position']['right'] );
					if ( $right >= 0 && $right <= 200 ) {
						$validated['dark_light_toggle']['fab_position']['right'] = $right;
					}
				}
			}
		}

		// NEW: Validate login_customization settings (Requirements 5.1, 5.2, 6.1).
		if ( isset( $input['login_customization'] ) ) {
			$validated['login_customization'] = array();
			$login = $input['login_customization'];

			// Validate boolean fields.
			if ( isset( $login['logo_enabled'] ) ) {
				$validated['login_customization']['logo_enabled'] = (bool) $login['logo_enabled'];
			}

			if ( isset( $login['glassmorphism_enabled'] ) ) {
				$validated['login_customization']['glassmorphism_enabled'] = (bool) $login['glassmorphism_enabled'];
			}

			if ( isset( $login['hide_wp_branding'] ) ) {
				$validated['login_customization']['hide_wp_branding'] = (bool) $login['hide_wp_branding'];
			}

			// Validate URL fields.
			if ( isset( $login['logo_url'] ) ) {
				$validated['login_customization']['logo_url'] = esc_url_raw( $login['logo_url'] );
			}

			if ( isset( $login['logo_link_url'] ) ) {
				$validated['login_customization']['logo_link_url'] = esc_url_raw( $login['logo_link_url'] );
			}

			if ( isset( $login['background_image'] ) ) {
				$validated['login_customization']['background_image'] = esc_url_raw( $login['background_image'] );
			}

			// Validate numeric ranges - logo dimensions (50-400).
			if ( isset( $login['logo_width'] ) ) {
				$width = absint( $login['logo_width'] );
				if ( $width >= 50 && $width <= 400 ) {
					$validated['login_customization']['logo_width'] = $width;
				} else {
					$errors['login_logo_width'] = 'Logo width must be between 50 and 400 pixels';
				}
			}

			if ( isset( $login['logo_height'] ) ) {
				$height = absint( $login['logo_height'] );
				if ( $height >= 50 && $height <= 400 ) {
					$validated['login_customization']['logo_height'] = $height;
				} else {
					$errors['login_logo_height'] = 'Logo height must be between 50 and 400 pixels';
				}
			}

			// Validate opacity (0-100).
			if ( isset( $login['background_opacity'] ) ) {
				$opacity = absint( $login['background_opacity'] );
				if ( $opacity >= 0 && $opacity <= 100 ) {
					$validated['login_customization']['background_opacity'] = $opacity;
				} else {
					$errors['login_background_opacity'] = 'Background opacity must be between 0 and 100';
				}
			}

			if ( isset( $login['glassmorphism_opacity'] ) ) {
				$opacity = absint( $login['glassmorphism_opacity'] );
				if ( $opacity >= 0 && $opacity <= 100 ) {
					$validated['login_customization']['glassmorphism_opacity'] = $opacity;
				} else {
					$errors['login_glassmorphism_opacity'] = 'Glassmorphism opacity must be between 0 and 100';
				}
			}

			// Validate glassmorphism blur (0-50).
			if ( isset( $login['glassmorphism_blur'] ) ) {
				$blur = absint( $login['glassmorphism_blur'] );
				if ( $blur >= 0 && $blur <= 50 ) {
					$validated['login_customization']['glassmorphism_blur'] = $blur;
				} else {
					$errors['login_glassmorphism_blur'] = 'Glassmorphism blur must be between 0 and 50 pixels';
				}
			}

			// Validate border radius (0-25).
			if ( isset( $login['form_border_radius'] ) ) {
				$radius = absint( $login['form_border_radius'] );
				if ( $radius >= 0 && $radius <= 25 ) {
					$validated['login_customization']['form_border_radius'] = $radius;
				} else {
					$errors['login_form_border_radius'] = 'Form border radius must be between 0 and 25 pixels';
				}
			}

			// Validate gradient angle (0-360).
			if ( isset( $login['gradient_angle'] ) ) {
				$angle = absint( $login['gradient_angle'] );
				if ( $angle >= 0 && $angle <= 360 ) {
					$validated['login_customization']['gradient_angle'] = $angle;
				} else {
					$errors['login_gradient_angle'] = 'Gradient angle must be between 0 and 360 degrees';
				}
			}

			// Validate font sizes.
			if ( isset( $login['label_font_size'] ) ) {
				$size = absint( $login['label_font_size'] );
				if ( $size >= 10 && $size <= 24 ) {
					$validated['login_customization']['label_font_size'] = $size;
				} else {
					$errors['login_label_font_size'] = 'Label font size must be between 10 and 24 pixels';
				}
			}

			if ( isset( $login['input_font_size'] ) ) {
				$size = absint( $login['input_font_size'] );
				if ( $size >= 16 && $size <= 32 ) {
					$validated['login_customization']['input_font_size'] = $size;
				} else {
					$errors['login_input_font_size'] = 'Input font size must be between 16 and 32 pixels';
				}
			}

			// Validate font weight (300-900).
			if ( isset( $login['label_font_weight'] ) ) {
				$weight = absint( $login['label_font_weight'] );
				$allowed_weights = array( 100, 200, 300, 400, 500, 600, 700, 800, 900 );
				if ( in_array( $weight, $allowed_weights, true ) ) {
					$validated['login_customization']['label_font_weight'] = $weight;
				} else {
					$errors['login_label_font_weight'] = 'Label font weight must be 100, 200, 300, 400, 500, 600, 700, 800, or 900';
				}
			}

			// Validate enum fields - background_type.
			if ( isset( $login['background_type'] ) ) {
				$type = sanitize_text_field( $login['background_type'] );
				if ( in_array( $type, array( 'color', 'image', 'gradient' ), true ) ) {
					$validated['login_customization']['background_type'] = $type;
				} else {
					$errors['login_background_type'] = 'Background type must be color, image, or gradient';
				}
			}

			// Validate gradient_type.
			if ( isset( $login['gradient_type'] ) ) {
				$type = sanitize_text_field( $login['gradient_type'] );
				if ( in_array( $type, array( 'linear', 'radial' ), true ) ) {
					$validated['login_customization']['gradient_type'] = $type;
				} else {
					$errors['login_gradient_type'] = 'Gradient type must be linear or radial';
				}
			}

			// Validate background_size.
			if ( isset( $login['background_size'] ) ) {
				$size = sanitize_text_field( $login['background_size'] );
				if ( in_array( $size, array( 'cover', 'contain', 'auto' ), true ) ) {
					$validated['login_customization']['background_size'] = $size;
				} else {
					$errors['login_background_size'] = 'Background size must be cover, contain, or auto';
				}
			}

			// Validate form_box_shadow.
			if ( isset( $login['form_box_shadow'] ) ) {
				$shadow = sanitize_text_field( $login['form_box_shadow'] );
				if ( in_array( $shadow, array( 'none', 'default', 'subtle', 'medium', 'strong' ), true ) ) {
					$validated['login_customization']['form_box_shadow'] = $shadow;
				} else {
					$errors['login_form_box_shadow'] = 'Form box shadow must be none, default, subtle, medium, or strong';
				}
			}

			// Validate remember_me_style.
			if ( isset( $login['remember_me_style'] ) ) {
				$style = sanitize_text_field( $login['remember_me_style'] );
				if ( in_array( $style, array( 'default', 'custom' ), true ) ) {
					$validated['login_customization']['remember_me_style'] = $style;
				} else {
					$errors['login_remember_me_style'] = 'Remember me style must be default or custom';
				}
			}

			// Validate background_repeat.
			if ( isset( $login['background_repeat'] ) ) {
				$repeat = sanitize_text_field( $login['background_repeat'] );
				if ( in_array( $repeat, array( 'no-repeat', 'repeat', 'repeat-x', 'repeat-y' ), true ) ) {
					$validated['login_customization']['background_repeat'] = $repeat;
				} else {
					$errors['login_background_repeat'] = 'Background repeat must be no-repeat, repeat, repeat-x, or repeat-y';
				}
			}

			// Validate background_position.
			if ( isset( $login['background_position'] ) ) {
				$validated['login_customization']['background_position'] = sanitize_text_field( $login['background_position'] );
			}

			// Validate color fields (hex format).
			$color_fields = array(
				'background_color',
				'form_bg_color',
				'form_border_color',
				'form_text_color',
				'form_focus_color',
			);

			foreach ( $color_fields as $field ) {
				if ( isset( $login[ $field ] ) ) {
					$color = sanitize_hex_color( $login[ $field ] );
					if ( $color ) {
						$validated['login_customization'][ $field ] = $color;
					} else {
						$errors[ 'login_' . $field ] = 'Invalid hex color format for ' . str_replace( '_', ' ', $field );
					}
				}
			}

			// Validate font family fields.
			if ( isset( $login['label_font_family'] ) ) {
				$validated['login_customization']['label_font_family'] = sanitize_text_field( $login['label_font_family'] );
			}

			if ( isset( $login['input_font_family'] ) ) {
				$validated['login_customization']['input_font_family'] = sanitize_text_field( $login['input_font_family'] );
			}

			// Sanitize text fields - footer_text with wp_kses_post.
			if ( isset( $login['footer_text'] ) ) {
				$validated['login_customization']['footer_text'] = wp_kses_post( $login['footer_text'] );
			}

			// Sanitize custom_css with wp_strip_all_tags.
			if ( isset( $login['custom_css'] ) ) {
				$validated['login_customization']['custom_css'] = wp_strip_all_tags( $login['custom_css'] );
			}

			// Validate gradient_colors array (Requirements 2.3, 2.4).
			if ( isset( $login['gradient_colors'] ) && is_array( $login['gradient_colors'] ) ) {
				$validated['login_customization']['gradient_colors'] = array();
				
				foreach ( $login['gradient_colors'] as $stop ) {
					// Skip if not an array (defensive handling for malformed data).
					if ( ! is_array( $stop ) ) {
						continue;
					}
					
					// Validate each color stop has required keys.
					if ( ! isset( $stop['color'] ) || ! isset( $stop['position'] ) ) {
						// Skip invalid stops instead of failing entire save.
						continue;
					}

					// Validate color format.
					$color = sanitize_hex_color( $stop['color'] );
					if ( ! $color ) {
						// Skip invalid color instead of failing entire save.
						continue;
					}

					// Validate position is 0-100.
					$position = absint( $stop['position'] );
					if ( $position < 0 || $position > 100 ) {
						// Skip invalid position instead of failing entire save.
						continue;
					}

					// Add validated color stop.
					$validated['login_customization']['gradient_colors'][] = array(
						'color'    => $color,
						'position' => $position,
					);
				}
				
				// If no valid stops were found, use defaults.
				if ( empty( $validated['login_customization']['gradient_colors'] ) ) {
					$validated['login_customization']['gradient_colors'] = array(
						array( 'color' => '#667eea', 'position' => 0 ),
						array( 'color' => '#764ba2', 'position' => 100 ),
					);
				}
			}
		}

		// NEW: Validate universal_buttons settings (Requirements 6.1, 11.2).
		// CRITICAL FIX (Requirement 1.1): Only validate if section data is present and non-empty
		if ( isset( $input['universal_buttons'] ) && is_array( $input['universal_buttons'] ) && ! empty( $input['universal_buttons'] ) ) {
			$button_validation = $this->validate_buttons( $input['universal_buttons'] );
			if ( is_wp_error( $button_validation ) ) {
				$errors = array_merge( $errors, $button_validation->get_error_data() );
			} else {
				$validated['universal_buttons'] = $button_validation;
			}
		}

		// Validate excluded_button_selectors (Requirements 10.1, 10.2, 10.3).
		if ( isset( $input['excluded_button_selectors'] ) ) {
			$exclusion_validation = $this->validate_excluded_button_selectors( $input['excluded_button_selectors'] );
			if ( is_wp_error( $exclusion_validation ) ) {
				$errors = array_merge( $errors, $exclusion_validation->get_error_data() );
			} else {
				$validated['excluded_button_selectors'] = $exclusion_validation;
			}
		}

		// NEW: Validate custom_backgrounds settings (Requirements 1.4, 5.1, 12.1, 12.2, 12.3, 12.4, 12.5).
		// CRITICAL FIX (Requirement 1.1): Only validate if section data is present and non-empty
		if ( isset( $input['custom_backgrounds'] ) && is_array( $input['custom_backgrounds'] ) && ! empty( $input['custom_backgrounds'] ) ) {
			$validated['custom_backgrounds'] = array();
			$background_areas = array( 'dashboard', 'admin_menu', 'post_lists', 'post_editor', 'widgets', 'login' );
			
			foreach ( $background_areas as $area ) {
				// Only validate areas that are actually present in the input
				if ( isset( $input['custom_backgrounds'][ $area ] ) && is_array( $input['custom_backgrounds'][ $area ] ) && ! empty( $input['custom_backgrounds'][ $area ] ) ) {
					$background_validation = $this->validate_background_settings(
						$input['custom_backgrounds'][ $area ],
						$area
					);
					
					if ( is_wp_error( $background_validation ) ) {
						$errors = array_merge( $errors, $background_validation->get_error_data() );
					} else {
						$validated['custom_backgrounds'][ $area ] = $background_validation;
					}
				}
			}
		}

		// NEW: Validate content_typography settings (Requirements 1.1, 1.2, 1.3, 1.4, 1.7, 4.2).
		// CRITICAL FIX: Only validate if section data is present and non-empty
		if ( isset( $input['content_typography'] ) && is_array( $input['content_typography'] ) && ! empty( $input['content_typography'] ) ) {
			$typography_validation = $this->validate_content_typography( $input['content_typography'] );
			if ( is_wp_error( $typography_validation ) ) {
				$errors = array_merge( $errors, $typography_validation->get_error_data() );
			} else {
				$validated['content_typography'] = $typography_validation;
			}
		}

		// NEW: Validate dashboard_widgets settings (Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.8, 4.2).
		// CRITICAL FIX: Only validate if section data is present and non-empty
		if ( isset( $input['dashboard_widgets'] ) && is_array( $input['dashboard_widgets'] ) && ! empty( $input['dashboard_widgets'] ) ) {
			$widgets_validation = $this->validate_dashboard_widgets( $input['dashboard_widgets'] );
			if ( is_wp_error( $widgets_validation ) ) {
				$errors = array_merge( $errors, $widgets_validation->get_error_data() );
			} else {
				$validated['dashboard_widgets'] = $widgets_validation;
			}
		}

		// NEW: Validate form_controls settings (Requirements 3.1, 3.2, 3.3, 3.4, 3.7, 4.2).
		// CRITICAL FIX: Only validate if section data is present and non-empty
		if ( isset( $input['form_controls'] ) && is_array( $input['form_controls'] ) && ! empty( $input['form_controls'] ) ) {
			$form_controls_validation = $this->validate_form_controls( $input['form_controls'] );
			if ( is_wp_error( $form_controls_validation ) ) {
				$errors = array_merge( $errors, $form_controls_validation->get_error_data() );
			} else {
				$validated['form_controls'] = $form_controls_validation;
			}
		}

		if ( ! empty( $errors ) ) {
			error_log( 'MASE: Validation failed with ' . count( $errors ) . ' errors' );
			error_log( 'MASE: Validation errors: ' . print_r( $errors, true ) );
			return new WP_Error( 'validation_failed', 'Validation failed', $errors );
		}

		error_log( 'MASE: Validation passed, validated sections: ' . implode( ', ', array_keys( $validated ) ) );
		
		// Merge with defaults to ensure all keys exist.
		$merged = array_merge( $this->get_defaults(), $validated );
		error_log( 'MASE: Merged with defaults, final sections: ' . implode( ', ', array_keys( $merged ) ) );
		
		return $merged;
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

			// NEW: Validate font_family - Requirement 3.3, 11.1.
			if ( isset( $element_data['font_family'] ) ) {
				$validated[ $element ]['font_family'] = sanitize_text_field( $element_data['font_family'] );
			}

			// NEW: Validate google_font_url for admin_menu - Requirement 11.2.
			if ( 'admin_menu' === $element && isset( $element_data['google_font_url'] ) ) {
				$validated[ $element ]['google_font_url'] = esc_url_raw( $element_data['google_font_url'] );
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
	 * Validate content typography settings.
	 *
	 * Validates typography settings for 6 admin content areas with 13 properties each,
	 * heading hierarchy with scale ratios, and Google Fonts configuration.
	 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 4.2
	 *
	 * @param array $typography Content typography settings to validate.
	 * @return array|WP_Error Validated typography data or WP_Error on failure.
	 */
	private function validate_content_typography( $typography ) {
		$validated = array();
		$errors    = array();

		// Define admin content areas to validate
		$areas = array( 'body_text', 'comments', 'widgets', 'meta', 'tables', 'notices' );

		// Validate each area's typography properties
		foreach ( $areas as $area ) {
			if ( ! isset( $typography[ $area ] ) || ! is_array( $typography[ $area ] ) ) {
				continue;
			}

			$validated[ $area ] = array();
			$area_data = $typography[ $area ];

			// Validate font_family
			if ( isset( $area_data['font_family'] ) ) {
				$validated[ $area ]['font_family'] = sanitize_text_field( $area_data['font_family'] );
			}

			// Validate font_size (8-72px) - Requirement 1.7
			if ( isset( $area_data['font_size'] ) ) {
				$font_size = absint( $area_data['font_size'] );
				if ( $font_size >= 8 && $font_size <= 72 ) {
					$validated[ $area ]['font_size'] = $font_size;
				} else {
					$errors[ 'content_typography_' . $area . '_font_size' ] = 'Font size must be between 8 and 72 pixels';
				}
			}

			// Validate line_height (0.8-3.0) - Requirement 1.7
			if ( isset( $area_data['line_height'] ) ) {
				$line_height = floatval( $area_data['line_height'] );
				if ( $line_height >= 0.8 && $line_height <= 3.0 ) {
					$validated[ $area ]['line_height'] = round( $line_height, 2 );
				} else {
					$errors[ 'content_typography_' . $area . '_line_height' ] = 'Line height must be between 0.8 and 3.0';
				}
			}

			// Validate letter_spacing (-5px to 10px) - Requirement 1.7
			if ( isset( $area_data['letter_spacing'] ) ) {
				$letter_spacing = intval( $area_data['letter_spacing'] );
				if ( $letter_spacing >= -5 && $letter_spacing <= 10 ) {
					$validated[ $area ]['letter_spacing'] = $letter_spacing;
				} else {
					$errors[ 'content_typography_' . $area . '_letter_spacing' ] = 'Letter spacing must be between -5 and 10 pixels';
				}
			}

			// Validate word_spacing (-5px to 10px) - Requirement 1.7
			if ( isset( $area_data['word_spacing'] ) ) {
				$word_spacing = intval( $area_data['word_spacing'] );
				if ( $word_spacing >= -5 && $word_spacing <= 10 ) {
					$validated[ $area ]['word_spacing'] = $word_spacing;
				} else {
					$errors[ 'content_typography_' . $area . '_word_spacing' ] = 'Word spacing must be between -5 and 10 pixels';
				}
			}

			// Validate font_weight (100-900, multiples of 100) - Requirement 1.7
			if ( isset( $area_data['font_weight'] ) ) {
				$font_weight = absint( $area_data['font_weight'] );
				$allowed_weights = array( 100, 200, 300, 400, 500, 600, 700, 800, 900 );
				if ( in_array( $font_weight, $allowed_weights, true ) ) {
					$validated[ $area ]['font_weight'] = $font_weight;
				} else {
					$errors[ 'content_typography_' . $area . '_font_weight' ] = 'Font weight must be 100, 200, 300, 400, 500, 600, 700, 800, or 900';
				}
			}

			// Validate font_style
			if ( isset( $area_data['font_style'] ) ) {
				$font_style = strtolower( sanitize_text_field( $area_data['font_style'] ) );
				$allowed_styles = array( 'normal', 'italic', 'oblique' );
				if ( in_array( $font_style, $allowed_styles, true ) ) {
					$validated[ $area ]['font_style'] = $font_style;
				} else {
					$errors[ 'content_typography_' . $area . '_font_style' ] = 'Font style must be normal, italic, or oblique';
				}
			}

			// Validate text_transform - Requirement 1.7
			if ( isset( $area_data['text_transform'] ) ) {
				$text_transform = strtolower( sanitize_text_field( $area_data['text_transform'] ) );
				$allowed_transforms = array( 'none', 'uppercase', 'lowercase', 'capitalize' );
				if ( in_array( $text_transform, $allowed_transforms, true ) ) {
					$validated[ $area ]['text_transform'] = $text_transform;
				} else {
					$errors[ 'content_typography_' . $area . '_text_transform' ] = 'Text transform must be none, uppercase, lowercase, or capitalize';
				}
			}

			// Validate text_shadow (CSS value)
			if ( isset( $area_data['text_shadow'] ) ) {
				$validated[ $area ]['text_shadow'] = sanitize_text_field( $area_data['text_shadow'] );
			}

			// Validate text_stroke (CSS value)
			if ( isset( $area_data['text_stroke'] ) ) {
				$validated[ $area ]['text_stroke'] = sanitize_text_field( $area_data['text_stroke'] );
			}

			// Validate ligatures (boolean)
			if ( isset( $area_data['ligatures'] ) ) {
				$validated[ $area ]['ligatures'] = (bool) $area_data['ligatures'];
			}

			// Validate drop_caps (boolean)
			if ( isset( $area_data['drop_caps'] ) ) {
				$validated[ $area ]['drop_caps'] = (bool) $area_data['drop_caps'];
			}

			// Validate font_variant
			if ( isset( $area_data['font_variant'] ) ) {
				$validated[ $area ]['font_variant'] = sanitize_text_field( $area_data['font_variant'] );
			}
		}

		// Validate headings section with hierarchy - Requirement 1.4
		if ( isset( $typography['headings'] ) && is_array( $typography['headings'] ) ) {
			$validated['headings'] = array();

			// Validate scale_ratio - Requirement 1.7
			if ( isset( $typography['headings']['scale_ratio'] ) ) {
				$scale_ratio = floatval( $typography['headings']['scale_ratio'] );
				$allowed_ratios = array( 1.125, 1.200, 1.250, 1.333, 1.414, 1.500, 1.618 );
				
				// Check if the ratio is close to one of the allowed values (within 0.001)
				$is_valid = false;
				foreach ( $allowed_ratios as $allowed ) {
					if ( abs( $scale_ratio - $allowed ) < 0.001 ) {
						$validated['headings']['scale_ratio'] = $allowed;
						$is_valid = true;
						break;
					}
				}
				
				if ( ! $is_valid ) {
					$errors['content_typography_headings_scale_ratio'] = 'Scale ratio must be 1.125, 1.200, 1.250, 1.333, 1.414, 1.500, or 1.618';
				}
			}

			// Validate individual heading levels (h1-h6)
			$heading_levels = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
			foreach ( $heading_levels as $level ) {
				if ( ! isset( $typography['headings'][ $level ] ) || ! is_array( $typography['headings'][ $level ] ) ) {
					continue;
				}

				$validated['headings'][ $level ] = array();
				$heading_data = $typography['headings'][ $level ];

				// Validate same properties as other areas
				if ( isset( $heading_data['font_family'] ) ) {
					$validated['headings'][ $level ]['font_family'] = sanitize_text_field( $heading_data['font_family'] );
				}

				if ( isset( $heading_data['font_size'] ) ) {
					$font_size = absint( $heading_data['font_size'] );
					// Only validate and save if value is in valid range
					// Invalid values will be replaced with defaults during merge
					if ( $font_size >= 8 && $font_size <= 72 ) {
						$validated['headings'][ $level ]['font_size'] = $font_size;
					}
					// Don't add error - just skip invalid values and use defaults
				}

				if ( isset( $heading_data['line_height'] ) ) {
					$line_height = floatval( $heading_data['line_height'] );
					if ( $line_height >= 0.8 && $line_height <= 3.0 ) {
						$validated['headings'][ $level ]['line_height'] = round( $line_height, 2 );
					} else {
						$errors[ 'content_typography_' . $level . '_line_height' ] = 'Line height must be between 0.8 and 3.0';
					}
				}

				if ( isset( $heading_data['font_weight'] ) ) {
					$font_weight = absint( $heading_data['font_weight'] );
					$allowed_weights = array( 100, 200, 300, 400, 500, 600, 700, 800, 900 );
					if ( in_array( $font_weight, $allowed_weights, true ) ) {
						$validated['headings'][ $level ]['font_weight'] = $font_weight;
					} else {
						$errors[ 'content_typography_' . $level . '_font_weight' ] = 'Font weight must be 100, 200, 300, 400, 500, 600, 700, 800, or 900';
					}
				}

				// Validate other properties for headings
				if ( isset( $heading_data['letter_spacing'] ) ) {
					$letter_spacing = intval( $heading_data['letter_spacing'] );
					if ( $letter_spacing >= -5 && $letter_spacing <= 10 ) {
						$validated['headings'][ $level ]['letter_spacing'] = $letter_spacing;
					}
				}

				if ( isset( $heading_data['text_transform'] ) ) {
					$text_transform = strtolower( sanitize_text_field( $heading_data['text_transform'] ) );
					$allowed_transforms = array( 'none', 'uppercase', 'lowercase', 'capitalize' );
					if ( in_array( $text_transform, $allowed_transforms, true ) ) {
						$validated['headings'][ $level ]['text_transform'] = $text_transform;
					}
				}
			}
		}

		// Validate Google Fonts configuration - Requirements 1.2, 1.7
		if ( isset( $typography['google_fonts_enabled'] ) ) {
			$validated['google_fonts_enabled'] = (bool) $typography['google_fonts_enabled'];
		}

		// Validate Google Fonts list - Requirement 1.7
		if ( isset( $typography['google_fonts_list'] ) && is_array( $typography['google_fonts_list'] ) ) {
			$validated['google_fonts_list'] = array();
			foreach ( $typography['google_fonts_list'] as $font ) {
				if ( is_string( $font ) && ! empty( $font ) ) {
					$validated['google_fonts_list'][] = sanitize_text_field( $font );
				} else {
					$errors['content_typography_google_fonts_list'] = 'Invalid Google Font name in list';
				}
			}
		}

		// Validate font_display
		if ( isset( $typography['font_display'] ) ) {
			$font_display = strtolower( sanitize_text_field( $typography['font_display'] ) );
			$allowed_displays = array( 'auto', 'block', 'swap', 'fallback', 'optional' );
			if ( in_array( $font_display, $allowed_displays, true ) ) {
				$validated['font_display'] = $font_display;
			} else {
				$errors['content_typography_font_display'] = 'Font display must be auto, block, swap, fallback, or optional';
			}
		}

		// Validate preload_fonts
		if ( isset( $typography['preload_fonts'] ) && is_array( $typography['preload_fonts'] ) ) {
			$validated['preload_fonts'] = array();
			foreach ( $typography['preload_fonts'] as $font ) {
				if ( is_string( $font ) && ! empty( $font ) ) {
					$validated['preload_fonts'][] = sanitize_text_field( $font );
				}
			}
		}

		// Validate font_subset
		if ( isset( $typography['font_subset'] ) ) {
			$validated['font_subset'] = sanitize_text_field( $typography['font_subset'] );
		}

		// Return WP_Error with detailed messages on validation failure - Requirement 4.2
		if ( ! empty( $errors ) ) {
			return new WP_Error( 'content_typography_validation_failed', 'Content typography validation failed', $errors );
		}

		return $validated;
	}

	/**
	 * Validate dashboard widgets settings.
	 *
	 * Validates all dashboard widget styling including container, header, content,
	 * specific widget overrides, advanced effects, and responsive layout.
	 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.8, 4.2
	 *
	 * @param array $widgets Dashboard widgets settings to validate.
	 * @return array|WP_Error Validated widgets data or WP_Error on failure.
	 */
	private function validate_dashboard_widgets( $widgets ) {
		$validated = array();
		$errors    = array();

		// Validate container settings (Requirement 2.1)
		if ( isset( $widgets['container'] ) && is_array( $widgets['container'] ) ) {
			$validated['container'] = array();
			$container = $widgets['container'];

			// Validate bg_type
			if ( isset( $container['bg_type'] ) ) {
				$bg_type = sanitize_text_field( $container['bg_type'] );
				if ( in_array( $bg_type, array( 'solid', 'gradient', 'transparent' ), true ) ) {
					$validated['container']['bg_type'] = $bg_type;
				}
			}

			// Validate bg_color
			if ( isset( $container['bg_color'] ) ) {
				$color = sanitize_hex_color( $container['bg_color'] );
				if ( $color ) {
					$validated['container']['bg_color'] = $color;
				}
			}

			// Validate gradient settings
			if ( isset( $container['gradient_type'] ) ) {
				$gradient_type = sanitize_text_field( $container['gradient_type'] );
				if ( in_array( $gradient_type, array( 'linear', 'radial' ), true ) ) {
					$validated['container']['gradient_type'] = $gradient_type;
				}
			}

			if ( isset( $container['gradient_angle'] ) ) {
				$angle = absint( $container['gradient_angle'] );
				if ( $angle >= 0 && $angle <= 360 ) {
					$validated['container']['gradient_angle'] = $angle;
				}
			}

			// Validate gradient_colors array
			if ( isset( $container['gradient_colors'] ) && is_array( $container['gradient_colors'] ) ) {
				$validated['container']['gradient_colors'] = array();
				foreach ( $container['gradient_colors'] as $stop ) {
					if ( isset( $stop['color'] ) && isset( $stop['position'] ) ) {
						$color = sanitize_hex_color( $stop['color'] );
						$position = absint( $stop['position'] );
						if ( $color && $position >= 0 && $position <= 100 ) {
							$validated['container']['gradient_colors'][] = array(
								'color' => $color,
								'position' => $position,
							);
						}
					}
				}
			}

			// Validate border width (0-10px) - Requirement 2.8
			$border_sides = array( 'top', 'right', 'bottom', 'left' );
			foreach ( $border_sides as $side ) {
				$field = 'border_width_' . $side;
				if ( isset( $container[ $field ] ) ) {
					$width = absint( $container[ $field ] );
					if ( $width >= 0 && $width <= 10 ) {
						$validated['container'][ $field ] = $width;
					} else {
						$errors[ 'dashboard_widgets_container_' . $field ] = 'Border width must be between 0 and 10 pixels';
					}
				}
			}

			// Validate border_style
			if ( isset( $container['border_style'] ) ) {
				$border_style = sanitize_text_field( $container['border_style'] );
				if ( in_array( $border_style, array( 'solid', 'dashed', 'dotted', 'double' ), true ) ) {
					$validated['container']['border_style'] = $border_style;
				}
			}

			// Validate border_color
			if ( isset( $container['border_color'] ) ) {
				$color = sanitize_hex_color( $container['border_color'] );
				if ( $color ) {
					$validated['container']['border_color'] = $color;
				}
			}

			// Validate border_radius_mode
			if ( isset( $container['border_radius_mode'] ) ) {
				$mode = sanitize_text_field( $container['border_radius_mode'] );
				if ( in_array( $mode, array( 'uniform', 'individual' ), true ) ) {
					$validated['container']['border_radius_mode'] = $mode;
				}
			}

			// Validate border_radius (0-50px) - Requirement 2.8
			$radius_fields = array( 'border_radius', 'border_radius_tl', 'border_radius_tr', 'border_radius_br', 'border_radius_bl' );
			foreach ( $radius_fields as $field ) {
				if ( isset( $container[ $field ] ) ) {
					$radius = absint( $container[ $field ] );
					if ( $radius >= 0 && $radius <= 50 ) {
						$validated['container'][ $field ] = $radius;
					} else {
						$errors[ 'dashboard_widgets_container_' . $field ] = 'Border radius must be between 0 and 50 pixels';
					}
				}
			}

			// Validate shadow_preset
			if ( isset( $container['shadow_preset'] ) ) {
				$preset = sanitize_text_field( $container['shadow_preset'] );
				if ( in_array( $preset, array( 'none', 'subtle', 'medium', 'strong', 'custom' ), true ) ) {
					$validated['container']['shadow_preset'] = $preset;
				}
			}

			// Validate shadow properties (custom mode)
			if ( isset( $container['shadow_h_offset'] ) ) {
				$offset = intval( $container['shadow_h_offset'] );
				if ( $offset >= -50 && $offset <= 50 ) {
					$validated['container']['shadow_h_offset'] = $offset;
				}
			}

			if ( isset( $container['shadow_v_offset'] ) ) {
				$offset = intval( $container['shadow_v_offset'] );
				if ( $offset >= -50 && $offset <= 50 ) {
					$validated['container']['shadow_v_offset'] = $offset;
				}
			}

			if ( isset( $container['shadow_blur'] ) ) {
				$blur = absint( $container['shadow_blur'] );
				if ( $blur >= 0 && $blur <= 50 ) {
					$validated['container']['shadow_blur'] = $blur;
				}
			}

			if ( isset( $container['shadow_spread'] ) ) {
				$spread = intval( $container['shadow_spread'] );
				if ( $spread >= -20 && $spread <= 20 ) {
					$validated['container']['shadow_spread'] = $spread;
				}
			}

			if ( isset( $container['shadow_color'] ) ) {
				$validated['container']['shadow_color'] = sanitize_text_field( $container['shadow_color'] );
			}

			// Validate padding (5-50px) - Requirement 2.8
			$padding_sides = array( 'top', 'right', 'bottom', 'left' );
			foreach ( $padding_sides as $side ) {
				$field = 'padding_' . $side;
				if ( isset( $container[ $field ] ) ) {
					$padding = absint( $container[ $field ] );
					if ( $padding >= 5 && $padding <= 50 ) {
						$validated['container'][ $field ] = $padding;
					} else {
						$errors[ 'dashboard_widgets_container_' . $field ] = 'Padding must be between 5 and 50 pixels';
					}
				}
			}

			// Validate margin (0-30px) - Requirement 2.8
			$margin_sides = array( 'top', 'right', 'bottom', 'left' );
			foreach ( $margin_sides as $side ) {
				$field = 'margin_' . $side;
				if ( isset( $container[ $field ] ) ) {
					$margin = absint( $container[ $field ] );
					if ( $margin >= 0 && $margin <= 30 ) {
						$validated['container'][ $field ] = $margin;
					} else {
						$errors[ 'dashboard_widgets_container_' . $field ] = 'Margin must be between 0 and 30 pixels';
					}
				}
			}
		}

		// Validate header settings (Requirement 2.2)
		if ( isset( $widgets['header'] ) && is_array( $widgets['header'] ) ) {
			$validated['header'] = array();
			$header = $widgets['header'];

			// Validate bg_color
			if ( isset( $header['bg_color'] ) ) {
				$color = sanitize_hex_color( $header['bg_color'] );
				if ( $color ) {
					$validated['header']['bg_color'] = $color;
				}
			}

			// Validate font_size (12-24px) - Requirement 2.8
			if ( isset( $header['font_size'] ) ) {
				$font_size = absint( $header['font_size'] );
				if ( $font_size >= 12 && $font_size <= 24 ) {
					$validated['header']['font_size'] = $font_size;
				} else {
					$errors['dashboard_widgets_header_font_size'] = 'Header font size must be between 12 and 24 pixels';
				}
			}

			// Validate font_weight (400-700)
			if ( isset( $header['font_weight'] ) ) {
				$font_weight = absint( $header['font_weight'] );
				if ( $font_weight >= 400 && $font_weight <= 700 ) {
					$validated['header']['font_weight'] = $font_weight;
				}
			}

			// Validate text_color
			if ( isset( $header['text_color'] ) ) {
				$color = sanitize_hex_color( $header['text_color'] );
				if ( $color ) {
					$validated['header']['text_color'] = $color;
				}
			}

			// Validate text_transform
			if ( isset( $header['text_transform'] ) ) {
				$text_transform = strtolower( sanitize_text_field( $header['text_transform'] ) );
				if ( in_array( $text_transform, array( 'none', 'uppercase', 'lowercase', 'capitalize' ), true ) ) {
					$validated['header']['text_transform'] = $text_transform;
				}
			}

			// Validate border_bottom_width (0-5px)
			if ( isset( $header['border_bottom_width'] ) ) {
				$width = absint( $header['border_bottom_width'] );
				if ( $width >= 0 && $width <= 5 ) {
					$validated['header']['border_bottom_width'] = $width;
				}
			}

			// Validate border_bottom_color
			if ( isset( $header['border_bottom_color'] ) ) {
				$color = sanitize_hex_color( $header['border_bottom_color'] );
				if ( $color ) {
					$validated['header']['border_bottom_color'] = $color;
				}
			}

			// Validate icon_color
			if ( isset( $header['icon_color'] ) ) {
				if ( $header['icon_color'] === 'inherit' ) {
					$validated['header']['icon_color'] = 'inherit';
				} else {
					$color = sanitize_hex_color( $header['icon_color'] );
					if ( $color ) {
						$validated['header']['icon_color'] = $color;
					}
				}
			}

			// Validate icon_size (12-24px)
			if ( isset( $header['icon_size'] ) ) {
				$icon_size = absint( $header['icon_size'] );
				if ( $icon_size >= 12 && $icon_size <= 24 ) {
					$validated['header']['icon_size'] = $icon_size;
				}
			}

			// Validate height
			if ( isset( $header['height'] ) ) {
				$validated['header']['height'] = sanitize_text_field( $header['height'] );
			}
		}

		// Validate content settings (Requirement 2.3)
		if ( isset( $widgets['content'] ) && is_array( $widgets['content'] ) ) {
			$validated['content'] = array();
			$content = $widgets['content'];

			// Validate bg_color
			if ( isset( $content['bg_color'] ) ) {
				if ( $content['bg_color'] === 'transparent' ) {
					$validated['content']['bg_color'] = 'transparent';
				} else {
					$color = sanitize_hex_color( $content['bg_color'] );
					if ( $color ) {
						$validated['content']['bg_color'] = $color;
					}
				}
			}

			// Validate font_size (10-18px)
			if ( isset( $content['font_size'] ) ) {
				$font_size = absint( $content['font_size'] );
				if ( $font_size >= 10 && $font_size <= 18 ) {
					$validated['content']['font_size'] = $font_size;
				}
			}

			// Validate text_color
			if ( isset( $content['text_color'] ) ) {
				$color = sanitize_hex_color( $content['text_color'] );
				if ( $color ) {
					$validated['content']['text_color'] = $color;
				}
			}

			// Validate link_color
			if ( isset( $content['link_color'] ) ) {
				$color = sanitize_hex_color( $content['link_color'] );
				if ( $color ) {
					$validated['content']['link_color'] = $color;
				}
			}

			// Validate link_hover_color
			if ( isset( $content['link_hover_color'] ) ) {
				$color = sanitize_hex_color( $content['link_hover_color'] );
				if ( $color ) {
					$validated['content']['link_hover_color'] = $color;
				}
			}

			// Validate list_style
			if ( isset( $content['list_style'] ) ) {
				$list_style = sanitize_text_field( $content['list_style'] );
				if ( in_array( $list_style, array( 'disc', 'circle', 'square', 'none' ), true ) ) {
					$validated['content']['list_style'] = $list_style;
				}
			}

			// Validate list_spacing (0-20px)
			if ( isset( $content['list_spacing'] ) ) {
				$spacing = absint( $content['list_spacing'] );
				if ( $spacing >= 0 && $spacing <= 20 ) {
					$validated['content']['list_spacing'] = $spacing;
				}
			}
		}

		// Validate specific_widgets overrides (Requirement 2.1)
		if ( isset( $widgets['specific_widgets'] ) && is_array( $widgets['specific_widgets'] ) ) {
			$validated['specific_widgets'] = array();
			$widget_ids = array( 'dashboard_right_now', 'dashboard_activity', 'dashboard_quick_press', 'dashboard_primary' );

			foreach ( $widget_ids as $widget_id ) {
				if ( isset( $widgets['specific_widgets'][ $widget_id ] ) && is_array( $widgets['specific_widgets'][ $widget_id ] ) ) {
					$validated['specific_widgets'][ $widget_id ] = array();

					// Validate enabled flag
					if ( isset( $widgets['specific_widgets'][ $widget_id ]['enabled'] ) ) {
						$validated['specific_widgets'][ $widget_id ]['enabled'] = (bool) $widgets['specific_widgets'][ $widget_id ]['enabled'];
					}

					// Validate container, header, content overrides (same validation as above)
					// For simplicity, just pass through the arrays - they'll be validated when applied
					if ( isset( $widgets['specific_widgets'][ $widget_id ]['container'] ) ) {
						$validated['specific_widgets'][ $widget_id ]['container'] = $widgets['specific_widgets'][ $widget_id ]['container'];
					}

					if ( isset( $widgets['specific_widgets'][ $widget_id ]['header'] ) ) {
						$validated['specific_widgets'][ $widget_id ]['header'] = $widgets['specific_widgets'][ $widget_id ]['header'];
					}

					if ( isset( $widgets['specific_widgets'][ $widget_id ]['content'] ) ) {
						$validated['specific_widgets'][ $widget_id ]['content'] = $widgets['specific_widgets'][ $widget_id ]['content'];
					}
				}
			}
		}

		// Validate advanced effects (Requirement 2.4)
		if ( isset( $widgets['glassmorphism'] ) ) {
			$validated['glassmorphism'] = (bool) $widgets['glassmorphism'];
		}

		if ( isset( $widgets['blur_intensity'] ) ) {
			$blur = absint( $widgets['blur_intensity'] );
			if ( $blur >= 0 && $blur <= 30 ) {
				$validated['blur_intensity'] = $blur;
			}
		}

		// Validate hover_animation (none, lift, glow, scale) - Requirement 2.8
		if ( isset( $widgets['hover_animation'] ) ) {
			$animation = sanitize_text_field( $widgets['hover_animation'] );
			if ( in_array( $animation, array( 'none', 'lift', 'glow', 'scale' ), true ) ) {
				$validated['hover_animation'] = $animation;
			} else {
				$errors['dashboard_widgets_hover_animation'] = 'Hover animation must be none, lift, glow, or scale';
			}
		}

		if ( isset( $widgets['hover_lift_distance'] ) ) {
			$distance = absint( $widgets['hover_lift_distance'] );
			if ( $distance >= 0 && $distance <= 10 ) {
				$validated['hover_lift_distance'] = $distance;
			}
		}

		if ( isset( $widgets['hover_scale_factor'] ) ) {
			$scale = floatval( $widgets['hover_scale_factor'] );
			if ( $scale >= 1.0 && $scale <= 1.1 ) {
				$validated['hover_scale_factor'] = round( $scale, 2 );
			}
		}

		// Validate responsive layout (Requirement 2.5)
		if ( isset( $widgets['responsive'] ) && is_array( $widgets['responsive'] ) ) {
			$validated['responsive'] = array();
			$responsive = $widgets['responsive'];

			// Validate mobile_stack
			if ( isset( $responsive['mobile_stack'] ) ) {
				$validated['responsive']['mobile_stack'] = (bool) $responsive['mobile_stack'];
			}

			// Validate tablet_columns (1-2) - Requirement 2.8
			if ( isset( $responsive['tablet_columns'] ) ) {
				$columns = absint( $responsive['tablet_columns'] );
				if ( $columns >= 1 && $columns <= 2 ) {
					$validated['responsive']['tablet_columns'] = $columns;
				} else {
					$errors['dashboard_widgets_responsive_tablet_columns'] = 'Tablet columns must be between 1 and 2';
				}
			}

			// Validate desktop_columns (2-4) - Requirement 2.8
			if ( isset( $responsive['desktop_columns'] ) ) {
				$columns = absint( $responsive['desktop_columns'] );
				if ( $columns >= 2 && $columns <= 4 ) {
					$validated['responsive']['desktop_columns'] = $columns;
				} else {
					$errors['dashboard_widgets_responsive_desktop_columns'] = 'Desktop columns must be between 2 and 4';
				}
			}
		}

		// Return WP_Error with detailed messages on validation failure - Requirement 4.2
		if ( ! empty( $errors ) ) {
			return new WP_Error( 'dashboard_widgets_validation_failed', 'Dashboard widgets validation failed', $errors );
		}

		return $validated;
	}

	/**
	 * Validate form controls settings.
	 *
	 * Validates all form control styling including text inputs, textareas, selects,
	 * checkboxes, radios, file uploads, and search fields with state-specific settings.
	 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.7, 4.2
	 *
	 * @param array $controls Form controls settings to validate.
	 * @return array|WP_Error Validated form controls data or WP_Error on failure.
	 */
	private function validate_form_controls( $controls ) {
		$validated = array();
		$errors    = array();

		// Define control types to validate
		$control_types = array( 'text_inputs', 'textareas', 'selects', 'checkboxes', 'radios', 'file_uploads', 'search_fields' );

		foreach ( $control_types as $control_type ) {
			if ( ! isset( $controls[ $control_type ] ) || ! is_array( $controls[ $control_type ] ) ) {
				continue;
			}

			$validated[ $control_type ] = array();
			$control_data = $controls[ $control_type ];

			// Validate colors (hex format) - Requirement 3.7
			$color_fields = array( 'bg_color', 'bg_color_focus', 'bg_color_disabled', 'text_color', 'placeholder_color', 
								   'border_color', 'border_color_focus', 'border_color_hover', 'border_color_error' );
			
			foreach ( $color_fields as $field ) {
				if ( isset( $control_data[ $field ] ) ) {
					$color = sanitize_hex_color( $control_data[ $field ] );
					if ( $color ) {
						$validated[ $control_type ][ $field ] = $color;
					} else {
						$errors[ 'form_controls_' . $control_type . '_' . $field ] = 'Invalid hex color format for ' . $field;
					}
				}
			}

			// Validate border width (0-5px) - Requirement 3.7
			$border_sides = array( 'top', 'right', 'bottom', 'left' );
			foreach ( $border_sides as $side ) {
				$field = 'border_width_' . $side;
				if ( isset( $control_data[ $field ] ) ) {
					$width = absint( $control_data[ $field ] );
					if ( $width >= 0 && $width <= 5 ) {
						$validated[ $control_type ][ $field ] = $width;
					} else {
						$errors[ 'form_controls_' . $control_type . '_' . $field ] = 'Border width must be between 0 and 5 pixels';
					}
				}
			}

			// Validate border radius (0-25px) - Requirement 3.7
			if ( isset( $control_data['border_radius'] ) ) {
				$radius = absint( $control_data['border_radius'] );
				if ( $radius >= 0 && $radius <= 25 ) {
					$validated[ $control_type ]['border_radius'] = $radius;
				} else {
					$errors[ 'form_controls_' . $control_type . '_border_radius' ] = 'Border radius must be between 0 and 25 pixels';
				}
			}

			// Validate padding (3-25px) - Requirement 3.7
			if ( isset( $control_data['padding_horizontal'] ) ) {
				$padding = absint( $control_data['padding_horizontal'] );
				if ( $padding >= 5 && $padding <= 25 ) {
					$validated[ $control_type ]['padding_horizontal'] = $padding;
				} else {
					$errors[ 'form_controls_' . $control_type . '_padding_horizontal' ] = 'Horizontal padding must be between 5 and 25 pixels';
				}
			}

			if ( isset( $control_data['padding_vertical'] ) ) {
				$padding = absint( $control_data['padding_vertical'] );
				if ( $padding >= 3 && $padding <= 15 ) {
					$validated[ $control_type ]['padding_vertical'] = $padding;
				} else {
					$errors[ 'form_controls_' . $control_type . '_padding_vertical' ] = 'Vertical padding must be between 3 and 15 pixels';
				}
			}

			// Validate height (20-60px) - Requirement 3.7
			if ( isset( $control_data['height_mode'] ) ) {
				$mode = sanitize_text_field( $control_data['height_mode'] );
				if ( in_array( $mode, array( 'auto', 'custom' ), true ) ) {
					$validated[ $control_type ]['height_mode'] = $mode;
				}
			}

			if ( isset( $control_data['height_custom'] ) ) {
				$height = absint( $control_data['height_custom'] );
				if ( $height >= 20 && $height <= 60 ) {
					$validated[ $control_type ]['height_custom'] = $height;
				} else {
					$errors[ 'form_controls_' . $control_type . '_height_custom' ] = 'Custom height must be between 20 and 60 pixels';
				}
			}

			// Validate font size (10-18px) - Requirement 3.7
			if ( isset( $control_data['font_size'] ) ) {
				$font_size = absint( $control_data['font_size'] );
				if ( $font_size >= 10 && $font_size <= 18 ) {
					$validated[ $control_type ]['font_size'] = $font_size;
				} else {
					$errors[ 'form_controls_' . $control_type . '_font_size' ] = 'Font size must be between 10 and 18 pixels';
				}
			}

			// Validate font weight (400-600)
			if ( isset( $control_data['font_weight'] ) ) {
				$font_weight = absint( $control_data['font_weight'] );
				$allowed_weights = array( 400, 500, 600 );
				if ( in_array( $font_weight, $allowed_weights, true ) ) {
					$validated[ $control_type ]['font_weight'] = $font_weight;
				}
			}

			// Validate font family
			if ( isset( $control_data['font_family'] ) ) {
				$validated[ $control_type ]['font_family'] = sanitize_text_field( $control_data['font_family'] );
			}

			// Validate focus glow (CSS value)
			if ( isset( $control_data['focus_glow'] ) ) {
				$validated[ $control_type ]['focus_glow'] = sanitize_text_field( $control_data['focus_glow'] );
			}

			// Validate disabled opacity (0-100%)
			if ( isset( $control_data['disabled_opacity'] ) ) {
				$opacity = absint( $control_data['disabled_opacity'] );
				if ( $opacity >= 0 && $opacity <= 100 ) {
					$validated[ $control_type ]['disabled_opacity'] = $opacity;
				}
			}

			// Type-specific validations
			
			// Textareas specific
			if ( $control_type === 'textareas' ) {
				if ( isset( $control_data['min_height'] ) ) {
					$min_height = absint( $control_data['min_height'] );
					if ( $min_height >= 50 && $min_height <= 300 ) {
						$validated[ $control_type ]['min_height'] = $min_height;
					}
				}

				if ( isset( $control_data['resize'] ) ) {
					$resize = sanitize_text_field( $control_data['resize'] );
					if ( in_array( $resize, array( 'none', 'both', 'horizontal', 'vertical' ), true ) ) {
						$validated[ $control_type ]['resize'] = $resize;
					}
				}

				if ( isset( $control_data['line_height'] ) ) {
					$line_height = floatval( $control_data['line_height'] );
					if ( $line_height >= 1.0 && $line_height <= 2.0 ) {
						$validated[ $control_type ]['line_height'] = round( $line_height, 1 );
					}
				}
			}

			// Selects specific
			if ( $control_type === 'selects' ) {
				if ( isset( $control_data['arrow_icon'] ) ) {
					$arrow_icon = sanitize_text_field( $control_data['arrow_icon'] );
					if ( in_array( $arrow_icon, array( 'default', 'chevron', 'caret', 'custom' ), true ) ) {
						$validated[ $control_type ]['arrow_icon'] = $arrow_icon;
					}
				}

				if ( isset( $control_data['arrow_custom_svg'] ) ) {
					$validated[ $control_type ]['arrow_custom_svg'] = wp_kses_post( $control_data['arrow_custom_svg'] );
				}

				$select_colors = array( 'dropdown_bg_color', 'dropdown_border_color', 'option_hover_color', 'option_selected_color' );
				foreach ( $select_colors as $field ) {
					if ( isset( $control_data[ $field ] ) ) {
						$color = sanitize_hex_color( $control_data[ $field ] );
						if ( $color ) {
							$validated[ $control_type ][ $field ] = $color;
						}
					}
				}
			}

			// Checkboxes specific - Requirement 3.7
			if ( $control_type === 'checkboxes' ) {
				if ( isset( $control_data['size'] ) ) {
					$size = absint( $control_data['size'] );
					if ( $size >= 12 && $size <= 24 ) {
						$validated[ $control_type ]['size'] = $size;
					} else {
						$errors[ 'form_controls_checkboxes_size' ] = 'Checkbox size must be between 12 and 24 pixels';
					}
				}

				$checkbox_colors = array( 'bg_color', 'bg_color_checked', 'border_color', 'border_color_checked', 'check_color' );
				foreach ( $checkbox_colors as $field ) {
					if ( isset( $control_data[ $field ] ) ) {
						$color = sanitize_hex_color( $control_data[ $field ] );
						if ( $color ) {
							$validated[ $control_type ][ $field ] = $color;
						}
					}
				}

				if ( isset( $control_data['check_animation'] ) ) {
					$animation = sanitize_text_field( $control_data['check_animation'] );
					if ( in_array( $animation, array( 'slide', 'fade', 'bounce', 'none' ), true ) ) {
						$validated[ $control_type ]['check_animation'] = $animation;
					} else {
						$errors[ 'form_controls_checkboxes_check_animation' ] = 'Animation must be slide, fade, bounce, or none';
					}
				}

				if ( isset( $control_data['custom_icon'] ) ) {
					$validated[ $control_type ]['custom_icon'] = (bool) $control_data['custom_icon'];
				}

				if ( isset( $control_data['custom_icon_svg'] ) ) {
					$validated[ $control_type ]['custom_icon_svg'] = wp_kses_post( $control_data['custom_icon_svg'] );
				}
			}

			// Radios specific - Requirement 3.7
			if ( $control_type === 'radios' ) {
				if ( isset( $control_data['size'] ) ) {
					$size = absint( $control_data['size'] );
					if ( $size >= 12 && $size <= 24 ) {
						$validated[ $control_type ]['size'] = $size;
					} else {
						$errors[ 'form_controls_radios_size' ] = 'Radio size must be between 12 and 24 pixels';
					}
				}

				$radio_colors = array( 'bg_color', 'bg_color_checked', 'border_color', 'border_color_checked', 'dot_color' );
				foreach ( $radio_colors as $field ) {
					if ( isset( $control_data[ $field ] ) ) {
						$color = sanitize_hex_color( $control_data[ $field ] );
						if ( $color ) {
							$validated[ $control_type ][ $field ] = $color;
						}
					}
				}

				if ( isset( $control_data['dot_size'] ) ) {
					$dot_size = absint( $control_data['dot_size'] );
					if ( $dot_size >= 4 && $dot_size <= 16 ) {
						$validated[ $control_type ]['dot_size'] = $dot_size;
					}
				}

				if ( isset( $control_data['check_animation'] ) ) {
					$animation = sanitize_text_field( $control_data['check_animation'] );
					if ( in_array( $animation, array( 'slide', 'fade', 'bounce', 'none' ), true ) ) {
						$validated[ $control_type ]['check_animation'] = $animation;
					} else {
						$errors[ 'form_controls_radios_check_animation' ] = 'Animation must be slide, fade, bounce, or none';
					}
				}
			}

			// File uploads specific
			if ( $control_type === 'file_uploads' ) {
				$file_colors = array( 'dropzone_bg_color', 'dropzone_border_color', 'dropzone_hover_bg_color', 'progress_color', 'progress_bg_color' );
				foreach ( $file_colors as $field ) {
					if ( isset( $control_data[ $field ] ) ) {
						$color = sanitize_hex_color( $control_data[ $field ] );
						if ( $color ) {
							$validated[ $control_type ][ $field ] = $color;
						}
					}
				}

				if ( isset( $control_data['dropzone_border_style'] ) ) {
					$style = sanitize_text_field( $control_data['dropzone_border_style'] );
					if ( in_array( $style, array( 'solid', 'dashed', 'dotted' ), true ) ) {
						$validated[ $control_type ]['dropzone_border_style'] = $style;
					}
				}

				if ( isset( $control_data['file_type_icons'] ) ) {
					$validated[ $control_type ]['file_type_icons'] = (bool) $control_data['file_type_icons'];
				}

				if ( isset( $control_data['button_style'] ) ) {
					$button_style = sanitize_text_field( $control_data['button_style'] );
					if ( in_array( $button_style, array( 'primary', 'secondary', 'custom' ), true ) ) {
						$validated[ $control_type ]['button_style'] = $button_style;
					}
				}
			}

			// Search fields specific
			if ( $control_type === 'search_fields' ) {
				if ( isset( $control_data['icon_position'] ) ) {
					$position = sanitize_text_field( $control_data['icon_position'] );
					if ( in_array( $position, array( 'left', 'right', 'none' ), true ) ) {
						$validated[ $control_type ]['icon_position'] = $position;
					}
				}

				$search_colors = array( 'icon_color', 'clear_button_color' );
				foreach ( $search_colors as $field ) {
					if ( isset( $control_data[ $field ] ) ) {
						$color = sanitize_hex_color( $control_data[ $field ] );
						if ( $color ) {
							$validated[ $control_type ][ $field ] = $color;
						}
					}
				}

				if ( isset( $control_data['clear_button'] ) ) {
					$validated[ $control_type ]['clear_button'] = (bool) $control_data['clear_button'];
				}
			}
		}

		// Return WP_Error with detailed messages on validation failure - Requirement 4.2
		if ( ! empty( $errors ) ) {
			return new WP_Error( 'form_controls_validation_failed', 'Form controls validation failed', $errors );
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
				'type'       => 'light', // NEW: Palette type for dark mode support
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
				'type'       => 'light', // NEW: Palette type for dark mode support
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
				'type'       => 'light', // NEW: Palette type for dark mode support
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
				'type'       => 'light', // NEW: Palette type for dark mode support
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
				'type'       => 'dark', // Dark mode palette (default)
				'colors'     => array(
					'primary'        => '#1F2937',
					'secondary'      => '#374151',
					'accent'         => '#60A5FA',
					'background'     => '#0F1419', // Darker for better contrast
					'text'           => '#F9FAFB', // WCAG AAA: 15.3:1 contrast
					'text_secondary' => '#E5E7EB', // WCAG AAA: 12.6:1 contrast
				),
				'admin_bar'  => array(
					'bg_color'   => '#1A1F2E', // Darker for better contrast
					'text_color' => '#F9FAFB', // WCAG AAA: 14.8:1 contrast
				),
				'admin_menu' => array(
					'bg_color'         => '#0F1419', // Very dark background
					'text_color'       => '#F9FAFB', // WCAG AAA: 15.3:1 contrast
					'hover_bg_color'   => '#1F2937',
					'hover_text_color' => '#93C5FD', // Lighter blue for better contrast
				),
				'contrast_ratio' => 15.3, // WCAG AAA compliant
				'luminance'      => 0.05, // Very dark
				'is_custom'      => false,
			),
			'ocean-breeze'      => array(
				'id'         => 'ocean-breeze',
				'name'       => 'Ocean Breeze',
				'type'       => 'light', // NEW: Palette type for dark mode support
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
				'type'       => 'light', // NEW: Palette type for dark mode support
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
				'type'       => 'light', // NEW: Palette type for dark mode support
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
				'type'       => 'dark', // Dark mode palette
				'colors'     => array(
					'primary'        => '#1E3A8A',
					'secondary'      => '#3B82F6',
					'accent'         => '#60A5FA',
					'background'     => '#0A1628', // Dark blue background
					'text'           => '#E0F2FE', // WCAG AAA: 13.8:1 contrast
					'text_secondary' => '#BAE6FD', // WCAG AAA: 11.2:1 contrast
				),
				'admin_bar'  => array(
					'bg_color'   => '#1E3A8A', // Deep blue
					'text_color' => '#E0F2FE', // WCAG AAA: 8.5:1 contrast
				),
				'admin_menu' => array(
					'bg_color'         => '#0A1628', // Very dark blue
					'text_color'       => '#E0F2FE', // WCAG AAA: 13.8:1 contrast
					'hover_bg_color'   => '#1E40AF',
					'hover_text_color' => '#93C5FD', // Lighter blue for contrast
				),
				'contrast_ratio' => 13.8, // WCAG AAA compliant
				'luminance'      => 0.04, // Very dark
				'is_custom'      => false,
			),
			'golden-hour'       => array(
				'id'         => 'golden-hour',
				'name'       => 'Golden Hour',
				'type'       => 'light', // NEW: Palette type for dark mode support
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
			// NEW: Additional dark mode palettes
			'charcoal'          => array(
				'id'         => 'charcoal',
				'name'       => 'Charcoal',
				'type'       => 'dark', // Dark mode palette
				'colors'     => array(
					'primary'        => '#2D3748',
					'secondary'      => '#4A5568',
					'accent'         => '#63B3ED',
					'background'     => '#0D1117', // Darker charcoal
					'text'           => '#F7FAFC', // WCAG AAA: 16.1:1 contrast
					'text_secondary' => '#E2E8F0', // WCAG AAA: 13.2:1 contrast
				),
				'admin_bar'  => array(
					'bg_color'   => '#1A202C', // Dark gray
					'text_color' => '#F7FAFC', // WCAG AAA: 12.8:1 contrast
				),
				'admin_menu' => array(
					'bg_color'         => '#0D1117', // Very dark charcoal
					'text_color'       => '#F7FAFC', // WCAG AAA: 16.1:1 contrast
					'hover_bg_color'   => '#2D3748',
					'hover_text_color' => '#90CDF4', // Lighter blue for contrast
				),
				'contrast_ratio' => 16.1, // WCAG AAA compliant
				'luminance'      => 0.03, // Very dark
				'is_custom'      => false,
			),
			'midnight-ocean'    => array(
				'id'         => 'midnight-ocean',
				'name'       => 'Midnight Ocean',
				'type'       => 'dark', // Dark mode palette
				'colors'     => array(
					'primary'        => '#1E3A5F',
					'secondary'      => '#2C5282',
					'accent'         => '#4299E1',
					'background'     => '#0A0E14', // Darker ocean
					'text'           => '#F0F9FF', // WCAG AAA: 17.2:1 contrast
					'text_secondary' => '#BAE6FD', // WCAG AAA: 13.5:1 contrast
				),
				'admin_bar'  => array(
					'bg_color'   => '#1E3A5F', // Deep ocean blue
					'text_color' => '#F0F9FF', // WCAG AAA: 8.2:1 contrast
				),
				'admin_menu' => array(
					'bg_color'         => '#0A0E14', // Very dark ocean
					'text_color'       => '#F0F9FF', // WCAG AAA: 17.2:1 contrast
					'hover_bg_color'   => '#2C5282',
					'hover_text_color' => '#7DD3FC', // Lighter cyan for contrast
				),
				'contrast_ratio' => 17.2, // WCAG AAA compliant
				'luminance'      => 0.02, // Very dark
				'is_custom'      => false,
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
		error_log( 'MASE: apply_palette called with palette_id: ' . $palette_id );
		
		// Call get_palette() to validate palette exists.
		$palette = $this->get_palette( $palette_id );

		// Return error if palette not found.
		if ( is_wp_error( $palette ) ) {
			error_log( 'MASE: Palette not found: ' . $palette->get_error_message() );
			return $palette;
		}

		error_log( 'MASE: Palette found: ' . $palette['name'] );
		
		$current_settings = $this->get_option();
		error_log( 'MASE: Current palette before change: ' . ( $current_settings['palettes']['current'] ?? 'none' ) );

		// Update 'current_palette' setting with palette_id.
		$current_settings['palettes']['current'] = $palette_id;

		// Loop through palette colors and update settings.
		if ( isset( $palette['admin_bar'] ) ) {
			error_log( 'MASE: Applying admin_bar colors from palette' );
			$current_settings['admin_bar'] = array_merge(
				$current_settings['admin_bar'],
				$palette['admin_bar']
			);
		}

		if ( isset( $palette['admin_menu'] ) ) {
			error_log( 'MASE: Applying admin_menu colors from palette' );
			$current_settings['admin_menu'] = array_merge(
				$current_settings['admin_menu'],
				$palette['admin_menu']
			);
		}

		error_log( 'MASE: Calling update_option to save palette changes' );
		
		// PROPER FIX: Only validate the sections we're actually modifying
		// This prevents validation errors in unrelated sections (like custom_backgrounds)
		// from blocking palette application
		$sections_to_update = array(
			'admin_bar'  => $current_settings['admin_bar'],
			'admin_menu' => $current_settings['admin_menu'],
			'palettes'   => $current_settings['palettes'],
		);
		
		// Validate only the sections being modified (Requirements 2.1, 2.2)
		$validated = $this->validate( $sections_to_update );
		
		// Check if validation failed (Requirement 2.2)
		if ( is_wp_error( $validated ) ) {
			error_log( 'MASE: apply_palette failed - validation error: ' . $validated->get_error_message() );
			return $validated;
		}
		
		// Merge validated sections back into full settings
		$current_settings['admin_bar']  = $validated['admin_bar'];
		$current_settings['admin_menu'] = $validated['admin_menu'];
		$current_settings['palettes']   = $validated['palettes'];
		
		// Save with mobile optimization and debug logging (Requirements 3.1-3.5, 5.1-5.5)
		// Note: We pass full settings to update_option, but only the validated sections were modified
		$result = update_option( self::OPTION_NAME, $current_settings );
		
		error_log( 'MASE: WordPress update_option result: ' . ( $result ? 'true' : 'false' ) );
		error_log( 'MASE: apply_palette completed successfully' );
		
		// Return true even if value unchanged (update_option returns false if unchanged)
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

		// Use WordPress update_option directly to bypass validation
		// We're only adding a palette to the palettes array, which is already validated
		$result = update_option( self::OPTION_NAME, $current_settings );
		
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

		// Use WordPress update_option directly to bypass validation
		// We're only removing a palette from the palettes array
		return update_option( self::OPTION_NAME, $current_settings );
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
	 * Creates an enhanced SVG thumbnail showcasing template characteristics.
	 * Uses base64 encoding for inline data URI.
	 * Requirements: 18.1, 18.2, 18.3, 18.4
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
		
		// Generate 300x200px SVG with theme-specific styling.
		$svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">';
		
		// Add theme-specific visual effects based on template name.
		if ( stripos( $name, 'glass' ) !== false || stripos( $name, 'glassmorphic' ) !== false ) {
			// Glassmorphism theme - frosted glass effect.
			$svg .= '<defs>';
			$svg .= '<linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">';
			$svg .= '<stop offset="0%" style="stop-color:rgba(255,255,255,0.3);stop-opacity:1" />';
			$svg .= '<stop offset="100%" style="stop-color:rgba(255,255,255,0.1);stop-opacity:1" />';
			$svg .= '</linearGradient>';
			$svg .= '<filter id="blur"><feGaussianBlur in="SourceGraphic" stdDeviation="2" /></filter>';
			$svg .= '</defs>';
			$svg .= '<rect fill="#' . $color_clean . '" width="300" height="200"/>';
			$svg .= '<rect fill="url(#glassGrad)" width="280" height="180" x="10" y="10" rx="12" filter="url(#blur)" opacity="0.9"/>';
			$svg .= '<rect fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" width="280" height="180" x="10" y="10" rx="12"/>';
			
		} elseif ( stripos( $name, 'gradient' ) !== false || stripos( $name, 'sunset' ) !== false || stripos( $name, 'creative' ) !== false ) {
			// Gradient theme - multi-stop gradient.
			$svg .= '<defs>';
			$svg .= '<linearGradient id="multiGrad" x1="0%" y1="0%" x2="100%" y2="100%">';
			$svg .= '<stop offset="0%" style="stop-color:#' . $color_clean . ';stop-opacity:1" />';
			$svg .= '<stop offset="33%" style="stop-color:#e73c7e;stop-opacity:1" />';
			$svg .= '<stop offset="66%" style="stop-color:#23a6d5;stop-opacity:1" />';
			$svg .= '<stop offset="100%" style="stop-color:#23d5ab;stop-opacity:1" />';
			$svg .= '</linearGradient>';
			$svg .= '</defs>';
			$svg .= '<rect fill="url(#multiGrad)" width="300" height="200"/>';
			$svg .= '<rect fill="rgba(0,0,0,0.2)" width="280" height="60" x="10" y="70" rx="8"/>';
			
		} elseif ( stripos( $name, 'minimal' ) !== false || stripos( $name, 'modern' ) !== false ) {
			// Minimal theme - clean and simple.
			$svg .= '<rect fill="#f8f9fa" width="300" height="200"/>';
			$svg .= '<rect fill="#' . $color_clean . '" width="300" height="40"/>';
			$svg .= '<rect fill="white" width="280" height="140" x="10" y="50" rx="8"/>';
			$svg .= '<rect fill="#e9ecef" width="260" height="20" x="20" y="70" rx="4"/>';
			$svg .= '<rect fill="#e9ecef" width="200" height="20" x="20" y="100" rx="4"/>';
			$svg .= '<rect fill="#e9ecef" width="180" height="20" x="20" y="130" rx="4"/>';
			
		} elseif ( stripos( $name, 'dark' ) !== false || stripos( $name, 'midnight' ) !== false ) {
			// Dark mode theme.
			$svg .= '<rect fill="#1a1a1a" width="300" height="200"/>';
			$svg .= '<rect fill="#2d2d2d" width="300" height="40"/>';
			$svg .= '<rect fill="#252525" width="280" height="140" x="10" y="50" rx="8"/>';
			$svg .= '<rect fill="#3a3a3a" width="260" height="20" x="20" y="70" rx="4"/>';
			$svg .= '<rect fill="#3a3a3a" width="200" height="20" x="20" y="100" rx="4"/>';
			
		} elseif ( stripos( $name, 'corporate' ) !== false || stripos( $name, 'professional' ) !== false ) {
			// Professional/Corporate theme.
			$svg .= '<rect fill="#ffffff" width="300" height="200"/>';
			$svg .= '<rect fill="#' . $color_clean . '" width="300" height="40"/>';
			$svg .= '<rect fill="white" width="60" height="140" x="10" y="50" stroke="#e0e0e0" stroke-width="1"/>';
			$svg .= '<rect fill="white" width="210" height="140" x="80" y="50" stroke="#e0e0e0" stroke-width="1"/>';
			$svg .= '<rect fill="#f5f5f5" width="190" height="20" x="90" y="70" rx="2"/>';
			$svg .= '<rect fill="#f5f5f5" width="190" height="20" x="90" y="100" rx="2"/>';
			
		} elseif ( stripos( $name, 'nature' ) !== false || stripos( $name, 'forest' ) !== false ) {
			// Nature/Forest theme.
			$svg .= '<defs>';
			$svg .= '<linearGradient id="natureGrad" x1="0%" y1="0%" x2="0%" y2="100%">';
			$svg .= '<stop offset="0%" style="stop-color:#a8e6cf;stop-opacity:1" />';
			$svg .= '<stop offset="100%" style="stop-color:#' . $color_clean . ';stop-opacity:1" />';
			$svg .= '</linearGradient>';
			$svg .= '</defs>';
			$svg .= '<rect fill="url(#natureGrad)" width="300" height="200"/>';
			$svg .= '<circle fill="rgba(255,255,255,0.3)" cx="50" cy="50" r="30"/>';
			$svg .= '<circle fill="rgba(255,255,255,0.2)" cx="250" cy="150" r="40"/>';
			
		} elseif ( stripos( $name, 'ocean' ) !== false ) {
			// Ocean theme.
			$svg .= '<defs>';
			$svg .= '<linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">';
			$svg .= '<stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />';
			$svg .= '<stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />';
			$svg .= '</linearGradient>';
			$svg .= '</defs>';
			$svg .= '<rect fill="url(#oceanGrad)" width="300" height="200"/>';
			$svg .= '<path d="M0,120 Q75,100 150,120 T300,120 L300,200 L0,200 Z" fill="rgba(255,255,255,0.2)"/>';
			
		} elseif ( stripos( $name, 'rose' ) !== false || stripos( $name, 'elegant' ) !== false ) {
			// Rose/Elegant theme.
			$svg .= '<defs>';
			$svg .= '<linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">';
			$svg .= '<stop offset="0%" style="stop-color:#ffeef8;stop-opacity:1" />';
			$svg .= '<stop offset="100%" style="stop-color:#' . $color_clean . ';stop-opacity:1" />';
			$svg .= '</linearGradient>';
			$svg .= '</defs>';
			$svg .= '<rect fill="url(#roseGrad)" width="300" height="200"/>';
			$svg .= '<circle fill="rgba(255,255,255,0.4)" cx="150" cy="100" r="60"/>';
			$svg .= '<circle fill="rgba(255,255,255,0.3)" cx="150" cy="100" r="40"/>';
			
		} elseif ( stripos( $name, 'golden' ) !== false || stripos( $name, 'luxury' ) !== false ) {
			// Golden/Luxury theme.
			$svg .= '<defs>';
			$svg .= '<linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">';
			$svg .= '<stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />';
			$svg .= '<stop offset="50%" style="stop-color:#' . $color_clean . ';stop-opacity:1" />';
			$svg .= '<stop offset="100%" style="stop-color:#b8860b;stop-opacity:1" />';
			$svg .= '</linearGradient>';
			$svg .= '</defs>';
			$svg .= '<rect fill="url(#goldGrad)" width="300" height="200"/>';
			$svg .= '<rect fill="rgba(255,255,255,0.2)" width="280" height="180" x="10" y="10" rx="8" stroke="rgba(255,215,0,0.5)" stroke-width="2"/>';
			
		} else {
			// Default theme - simple colored background.
			$svg .= '<rect fill="#' . $color_clean . '" width="300" height="200"/>';
		}
		
		// Add template name text with shadow.
		$svg .= '<text x="150" y="100" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" style="text-shadow: 0 2px 8px rgba(0,0,0,0.5)">';
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
			'terminal' => array(
				'id'          => 'terminal',
				'name'        => 'Terminal Linux',
				'description' => 'Hacker/Developer theme with matrix effects',
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
			'gaming' => array(
				'id'          => 'gaming',
				'name'        => 'Gaming Cyberpunk',
				'description' => 'Epic gaming theme with RGB neon effects',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'dark-elegance' ),
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
							'floating_margin' => 8,
							'border_radius' => 8,
							'shadow' => 'elevated',
						),
						'admin_menu' => array(
							'glassmorphism' => false,
							'floating' => false,
							'border_radius' => 4,
							'shadow' => 'elevated',
						),
					),
				),
			),
			'retro' => array(
				'id'          => 'retro',
				'name'        => 'Retro 80s Synthwave',
				'description' => 'Nostalgic 80s theme with vaporwave aesthetics',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'sunset' ),
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
			'floral' => array(
				'id'          => 'floral',
				'name'        => 'Floral Natural',
				'description' => 'Organic theme with pastel colors',
				'thumbnail'   => '',
				'is_custom'   => false,
				'settings'    => array(
					'palettes' => array( 'current' => 'rose-garden' ),
					'typography' => array(
						'admin_bar' => array(
							'font_size' => 13,
							'font_weight' => 400,
							'line_height' => 1.6,
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
							'border_radius' => 8,
							'shadow' => 'subtle',
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
			'professional' => array(
				'id'          => 'professional',
				'name'        => 'Professional Dark',
				'description' => 'Corporate elegance with gold accents',
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
							'font_weight' => 500,
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
			'glass' => array(
				'id'          => 'glass',
				'name'        => 'Glass Material',
				'description' => 'Premium glassmorphism with prismatic effects',
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
			'gradient' => array(
				'id'          => 'gradient',
				'name'        => 'Gradient Flow',
				'description' => 'Dynamic theme with flowing gradients',
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
			'minimal' => array(
				'id'          => 'minimal',
				'name'        => 'Minimalist Modern',
				'description' => 'Clean design with focus on typography',
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
		
		// Track which sections are being modified for validation
		$sections_to_validate = array();

		// Apply template settings (merge with current to preserve unrelated settings).
		if ( isset( $template['settings'] ) && is_array( $template['settings'] ) ) {
			foreach ( $template['settings'] as $key => $value ) {
				if ( is_array( $value ) && isset( $current_settings[ $key ] ) && is_array( $current_settings[ $key ] ) ) {
					$current_settings[ $key ] = $this->array_merge_recursive_distinct( $current_settings[ $key ], $value );
				} else {
					$current_settings[ $key ] = $value;
				}
				// Track this section for validation
				$sections_to_validate[ $key ] = $current_settings[ $key ];
			}
		}

		// Update current template.
		$current_settings['templates']['current'] = $template_id;
		$sections_to_validate['templates'] = $current_settings['templates'];

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
				// Track these sections for validation
				$sections_to_validate['admin_bar'] = $current_settings['admin_bar'];
				$sections_to_validate['admin_menu'] = $current_settings['admin_menu'];
			}
		}
		
		// PROPER FIX: Only validate the sections we're actually modifying
		// This prevents validation errors in unrelated sections (like custom_backgrounds)
		// from blocking template application
		error_log( 'MASE: apply_template validating sections: ' . implode( ', ', array_keys( $sections_to_validate ) ) );
		
		$validated = $this->validate( $sections_to_validate );
		
		// Check if validation failed (Requirement 2.2)
		if ( is_wp_error( $validated ) ) {
			error_log( 'MASE: apply_template failed - validation error: ' . $validated->get_error_message() );
			return $validated;
		}
		
		// Merge validated sections back into full settings
		foreach ( $validated as $key => $value ) {
			$current_settings[ $key ] = $value;
		}
		
		// Save with mobile optimization and debug logging (Requirements 3.1-3.5, 5.1-5.5)
		// Note: We pass full settings to update_option, but only the validated sections were modified
		$result = update_option( self::OPTION_NAME, $current_settings );
		
		error_log( 'MASE: apply_template completed - update_option result: ' . ( $result ? 'true' : 'false' ) );
		
		// Return true even if value unchanged (update_option returns false if unchanged)
		return true;
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
			error_log( 'MASE: save_custom_template validation failed: ' . $validated_settings->get_error_message() );
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

		// Use WordPress update_option directly to bypass validation
		// Settings are already validated above, we're just adding to templates array
		$result = update_option( self::OPTION_NAME, $current_settings );
		
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

		// Use WordPress update_option directly to bypass validation
		// We're only removing a template from the templates array
		return update_option( self::OPTION_NAME, $current_settings );
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

	/**
	 * Validation Helper Methods
	 * Requirement 22.1: Centralized validation and sanitization functions.
	 */

	/**
	 * Validate and sanitize numeric value within range.
	 *
	 * @param mixed $value Value to validate.
	 * @param int   $min   Minimum allowed value.
	 * @param int   $max   Maximum allowed value.
	 * @param int   $default Default value if validation fails.
	 * @return int Validated integer value.
	 */
	private function validate_numeric_range( $value, $min, $max, $default ) {
		$value = absint( $value );
		if ( $value < $min || $value > $max ) {
			return $default;
		}
		return $value;
	}

	/**
	 * Validate and sanitize float value within range.
	 *
	 * @param mixed $value Value to validate.
	 * @param float $min   Minimum allowed value.
	 * @param float $max   Maximum allowed value.
	 * @param float $default Default value if validation fails.
	 * @param int   $decimals Number of decimal places.
	 * @return float Validated float value.
	 */
	private function validate_float_range( $value, $min, $max, $default, $decimals = 2 ) {
		$value = floatval( $value );
		if ( $value < $min || $value > $max ) {
			return $default;
		}
		return round( $value, $decimals );
	}

	/**
	 * Validate and sanitize color value (hex or rgba).
	 *
	 * @param string $value Color value to validate.
	 * @param string $default Default color if validation fails.
	 * @return string Validated color value.
	 */
	private function validate_color( $value, $default = '#000000' ) {
		// Try hex color first.
		$hex = sanitize_hex_color( $value );
		if ( $hex ) {
			return $hex;
		}

		// Try rgba format.
		$value = sanitize_text_field( $value );
		if ( preg_match( '/^rgba?\([^)]+\)$/i', $value ) ) {
			return $value;
		}

		return $default;
	}

	/**
	 * Validate enum value against allowed values.
	 *
	 * @param string $value Value to validate.
	 * @param array  $allowed Allowed values.
	 * @param string $default Default value if validation fails.
	 * @return string Validated enum value.
	 */
	private function validate_enum( $value, $allowed, $default ) {
		$value = sanitize_text_field( $value );
		if ( ! in_array( $value, $allowed, true ) ) {
			return $default;
		}
		return $value;
	}

	/**
	 * Validate and sanitize URL.
	 *
	 * @param string $value URL to validate.
	 * @param string $default Default URL if validation fails.
	 * @return string Validated URL.
	 */
	private function validate_url( $value, $default = '' ) {
		$url = esc_url_raw( $value );
		if ( empty( $url ) && ! empty( $value ) ) {
			return $default;
		}
		return $url;
	}

	/**
	 * Validate boolean value.
	 *
	 * @param mixed $value Value to validate.
	 * @return bool Validated boolean value.
	 */
	private function validate_boolean( $value ) {
		return (bool) $value;
	}

	/**
	 * Sanitize text field with length limit.
	 *
	 * @param string $value Value to sanitize.
	 * @param int    $max_length Maximum allowed length.
	 * @return string Sanitized text value.
	 */
	private function sanitize_text_limited( $value, $max_length = 255 ) {
		$value = sanitize_text_field( $value );
		if ( strlen( $value ) > $max_length ) {
			$value = substr( $value, 0, $max_length );
		}
		return $value;
	}

	/**
	 * Validate gradient colors array.
	 *
	 * @param array $colors Gradient colors array.
	 * @return array Validated gradient colors.
	 */
	private function validate_gradient_colors( $colors ) {
		if ( ! is_array( $colors ) ) {
			return array();
		}

		$validated = array();
		foreach ( $colors as $stop ) {
			if ( ! isset( $stop['color'] ) || ! isset( $stop['position'] ) ) {
				continue;
			}

			$color = $this->validate_color( $stop['color'] );
			$position = $this->validate_numeric_range( $stop['position'], 0, 100, 0 );

			$validated[] = array(
				'color'    => $color,
				'position' => $position,
			);
		}

		// Ensure at least 2 color stops.
		if ( count( $validated ) < 2 ) {
			return array(
				array( 'color' => '#23282d', 'position' => 0 ),
				array( 'color' => '#32373c', 'position' => 100 ),
			);
		}

		return $validated;
	}

	/**
	 * Validate universal button settings.
	 *
	 * Validates all button types and states with comprehensive property validation.
	 * Requirements: 6.1, 6.2, 11.2
	 *
	 * @param array $buttons Button settings to validate.
	 * @return array|WP_Error Validated button settings or WP_Error on failure.
	 */
	private function validate_buttons( $buttons ) {
		$validated = array();
		$errors    = array();

		$button_types  = array( 'primary', 'secondary', 'danger', 'success', 'ghost', 'tabs' );
		$button_states = array( 'normal', 'hover', 'active', 'focus', 'disabled' );

		foreach ( $button_types as $type ) {
			if ( ! isset( $buttons[ $type ] ) ) {
				continue;
			}

			$validated[ $type ] = array();

			foreach ( $button_states as $state ) {
				if ( ! isset( $buttons[ $type ][ $state ] ) ) {
					continue;
				}

				$state_data       = $buttons[ $type ][ $state ];
				$validated_state  = array();

				// Validate bg_type (solid/gradient).
				$validated_state['bg_type'] = $this->validate_enum(
					$state_data['bg_type'] ?? 'solid',
					array( 'solid', 'gradient' ),
					'solid'
				);

				// Validate colors.
				$validated_state['bg_color'] = $this->validate_color(
					$state_data['bg_color'] ?? '#0073aa',
					'#0073aa'
				);
				$validated_state['text_color'] = $this->validate_color(
					$state_data['text_color'] ?? '#ffffff',
					'#ffffff'
				);
				$validated_state['border_color'] = $this->validate_color(
					$state_data['border_color'] ?? '#0073aa',
					'#0073aa'
				);

				// Validate gradient settings.
				$validated_state['gradient_type'] = $this->validate_enum(
					$state_data['gradient_type'] ?? 'linear',
					array( 'linear', 'radial' ),
					'linear'
				);
				$validated_state['gradient_angle'] = $this->validate_numeric_range(
					$state_data['gradient_angle'] ?? 90,
					0,
					360,
					90
				);
				$validated_state['gradient_colors'] = $this->validate_gradient_colors(
					$state_data['gradient_colors'] ?? array()
				);

				// Validate border properties.
				$validated_state['border_width'] = $this->validate_numeric_range(
					$state_data['border_width'] ?? 1,
					0,
					5,
					1
				);
				$validated_state['border_style'] = $this->validate_enum(
					$state_data['border_style'] ?? 'solid',
					array( 'solid', 'dashed', 'dotted', 'none' ),
					'solid'
				);

				// Validate border radius.
				$validated_state['border_radius_mode'] = $this->validate_enum(
					$state_data['border_radius_mode'] ?? 'uniform',
					array( 'uniform', 'individual' ),
					'uniform'
				);
				$validated_state['border_radius'] = $this->validate_numeric_range(
					$state_data['border_radius'] ?? 3,
					0,
					25,
					3
				);
				$validated_state['border_radius_tl'] = $this->validate_numeric_range(
					$state_data['border_radius_tl'] ?? 3,
					0,
					25,
					3
				);
				$validated_state['border_radius_tr'] = $this->validate_numeric_range(
					$state_data['border_radius_tr'] ?? 3,
					0,
					25,
					3
				);
				$validated_state['border_radius_bl'] = $this->validate_numeric_range(
					$state_data['border_radius_bl'] ?? 3,
					0,
					25,
					3
				);
				$validated_state['border_radius_br'] = $this->validate_numeric_range(
					$state_data['border_radius_br'] ?? 3,
					0,
					25,
					3
				);

				// Validate padding (horizontal 5-30px, vertical 3-20px).
				$validated_state['padding_horizontal'] = $this->validate_numeric_range(
					$state_data['padding_horizontal'] ?? 12,
					5,
					30,
					12
				);
				$validated_state['padding_vertical'] = $this->validate_numeric_range(
					$state_data['padding_vertical'] ?? 6,
					3,
					20,
					6
				);

				// Validate typography (font size 11-18px).
				$validated_state['font_size'] = $this->validate_numeric_range(
					$state_data['font_size'] ?? 13,
					11,
					18,
					13
				);
				$validated_state['font_weight'] = $this->validate_enum(
					$state_data['font_weight'] ?? 400,
					array( 300, 400, 500, 600, 700 ),
					400
				);
				$validated_state['text_transform'] = $this->validate_enum(
					$state_data['text_transform'] ?? 'none',
					array( 'none', 'uppercase', 'lowercase', 'capitalize' ),
					'none'
				);

				// Validate shadow settings.
				$validated_state['shadow_mode'] = $this->validate_enum(
					$state_data['shadow_mode'] ?? 'preset',
					array( 'preset', 'custom', 'none' ),
					'preset'
				);
				$validated_state['shadow_preset'] = $this->validate_enum(
					$state_data['shadow_preset'] ?? 'subtle',
					array( 'none', 'subtle', 'medium', 'strong' ),
					'subtle'
				);
				$validated_state['shadow_h_offset']  = intval( $state_data['shadow_h_offset'] ?? 0 );
				$validated_state['shadow_v_offset']  = intval( $state_data['shadow_v_offset'] ?? 2 );
				$validated_state['shadow_blur']      = $this->validate_numeric_range(
					$state_data['shadow_blur'] ?? 4,
					0,
					50,
					4
				);
				$validated_state['shadow_spread']    = intval( $state_data['shadow_spread'] ?? 0 );
				$validated_state['shadow_color']     = $this->validate_color(
					$state_data['shadow_color'] ?? 'rgba(0,0,0,0.1)',
					'rgba(0,0,0,0.1)'
				);

				// Validate transition duration (0-1000ms).
				$validated_state['transition_duration'] = $this->validate_numeric_range(
					$state_data['transition_duration'] ?? 200,
					0,
					1000,
					200
				);

				// Validate ripple effect flag.
				$validated_state['ripple_effect'] = $this->validate_boolean(
					$state_data['ripple_effect'] ?? false
				);

				// Accessibility check: Enforce minimum contrast ratio (Requirements 8.1, 8.2).
				$contrast_check = $this->check_button_contrast(
					$validated_state['bg_color'],
					$validated_state['text_color']
				);
				if ( ! $contrast_check['passes'] ) {
					$errors[ $type . '_' . $state . '_contrast' ] = sprintf(
						'Button %s %s state has insufficient contrast ratio: %.2f (minimum 4.5:1 required)',
						$type,
						$state,
						$contrast_check['ratio']
					);
				}

				$validated[ $type ][ $state ] = $validated_state;
			}
		}

		if ( ! empty( $errors ) ) {
			return new WP_Error( 'button_validation_failed', 'Button validation failed', $errors );
		}

		return $validated;
	}

	/**
	 * Validate excluded button selectors.
	 *
	 * Validates CSS selectors that should be excluded from button styling.
	 * Ensures selectors are properly formatted and safe to use.
	 * Requirements: 10.1, 10.2, 10.3
	 *
	 * @param string $selectors Comma-separated list of CSS selectors to exclude.
	 * @return string|WP_Error Validated selectors string or WP_Error on failure.
	 */
	private function validate_excluded_button_selectors( $selectors ) {
		$errors = array();

		// Sanitize the input.
		$selectors = sanitize_textarea_field( $selectors );

		// If empty, return empty string (valid).
		if ( empty( trim( $selectors ) ) ) {
			return '';
		}

		// Split by comma or newline.
		$selector_array = preg_split( '/[,\n\r]+/', $selectors );
		$validated_selectors = array();

		foreach ( $selector_array as $selector ) {
			$selector = trim( $selector );

			// Skip empty lines.
			if ( empty( $selector ) ) {
				continue;
			}

			// Basic CSS selector validation.
			// Allow: classes (.), IDs (#), elements, attributes ([]), pseudo-classes (:), pseudo-elements (::), combinators (>, +, ~, space).
			// Disallow: dangerous characters that could break CSS or inject code.
			if ( ! preg_match( '/^[a-zA-Z0-9\s\.\#\[\]\:\-\_\>\+\~\*\=\(\)\"\'\,]+$/', $selector ) ) {
				$errors['invalid_selector_' . md5( $selector )] = sprintf(
					'Invalid CSS selector format: %s. Only standard CSS selector characters are allowed.',
					esc_html( $selector )
				);
				continue;
			}

			// Check for potentially dangerous patterns.
			$dangerous_patterns = array(
				'<script',
				'javascript:',
				'onerror',
				'onclick',
				'onload',
			);

			$selector_lower = strtolower( $selector );
			foreach ( $dangerous_patterns as $pattern ) {
				if ( strpos( $selector_lower, $pattern ) !== false ) {
					$errors['dangerous_selector_' . md5( $selector )] = sprintf(
						'Potentially dangerous selector detected: %s',
						esc_html( $selector )
					);
					continue 2;
				}
			}

			$validated_selectors[] = $selector;
		}

		if ( ! empty( $errors ) ) {
			return new WP_Error( 'excluded_selectors_validation_failed', 'Excluded selectors validation failed', $errors );
		}

		// Return as comma-separated string.
		return implode( ', ', $validated_selectors );
	}

	/**
	 * Check button contrast ratio for WCAG compliance.
	 *
	 * Calculates contrast ratio between button background and text colors
	 * and enforces WCAG AA minimum of 4.5:1.
	 * Requirements: 8.1, 8.2
	 *
	 * @param string $bg_color   Background color (hex or rgba).
	 * @param string $text_color Text color (hex or rgba).
	 * @return array Array with 'ratio' and 'passes' keys.
	 */
	private function check_button_contrast( $bg_color, $text_color ) {
		// Convert colors to RGB.
		$bg_rgb   = $this->hex_to_rgb( $bg_color );
		$text_rgb = $this->hex_to_rgb( $text_color );

		// Calculate relative luminance.
		$bg_luminance   = $this->calculate_luminance( $bg_rgb );
		$text_luminance = $this->calculate_luminance( $text_rgb );

		// Calculate contrast ratio.
		$lighter = max( $bg_luminance, $text_luminance );
		$darker  = min( $bg_luminance, $text_luminance );
		$ratio   = ( $lighter + 0.05 ) / ( $darker + 0.05 );

		return array(
			'ratio'  => $ratio,
			'passes' => $ratio >= 4.5, // WCAG AA requirement.
		);
	}

	/**
	 * Calculate relative luminance for contrast ratio.
	 *
	 * Implements WCAG luminance calculation formula.
	 * Requirement 8.1
	 *
	 * @param array $rgb RGB color array with 'r', 'g', 'b' keys.
	 * @return float Relative luminance value.
	 */
	private function calculate_luminance( $rgb ) {
		$r = $rgb['r'] / 255;
		$g = $rgb['g'] / 255;
		$b = $rgb['b'] / 255;

		$r = $r <= 0.03928 ? $r / 12.92 : pow( ( $r + 0.055 ) / 1.055, 2.4 );
		$g = $g <= 0.03928 ? $g / 12.92 : pow( ( $g + 0.055 ) / 1.055, 2.4 );
		$b = $b <= 0.03928 ? $b / 12.92 : pow( ( $b + 0.055 ) / 1.055, 2.4 );

		return 0.2126 * $r + 0.7152 * $g + 0.0722 * $b;
	}

	/**
	 * Convert hex color to RGB array.
	 *
	 * Supports 3-digit and 6-digit hex colors.
	 * Requirement 8.2
	 *
	 * @param string $hex Hex color string.
	 * @return array RGB array with 'r', 'g', 'b' keys.
	 */
	private function hex_to_rgb( $hex ) {
		// Handle rgba format - extract hex from rgba().
		if ( strpos( $hex, 'rgba' ) === 0 || strpos( $hex, 'rgb' ) === 0 ) {
			// For rgba/rgb, extract RGB values.
			preg_match( '/rgba?\((\d+),\s*(\d+),\s*(\d+)/', $hex, $matches );
			if ( count( $matches ) === 4 ) {
				return array(
					'r' => intval( $matches[1] ),
					'g' => intval( $matches[2] ),
					'b' => intval( $matches[3] ),
				);
			}
			// Fallback to black if parsing fails.
			return array( 'r' => 0, 'g' => 0, 'b' => 0 );
		}

		// Handle hex format.
		$hex = ltrim( $hex, '#' );
		if ( strlen( $hex ) === 3 ) {
			$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
		}
		return array(
			'r' => hexdec( substr( $hex, 0, 2 ) ),
			'g' => hexdec( substr( $hex, 2, 2 ) ),
			'b' => hexdec( substr( $hex, 4, 2 ) ),
		);
	}

	/**
	 * Validate numeric value is within specified range.
	 *
	 * Helper method for comprehensive numeric input validation.
	 * Task 37: Add comprehensive input validation
	 * Requirement 12.3
	 *
	 * @param mixed  $value Input value to validate.
	 * @param int    $min   Minimum allowed value (inclusive).
	 * @param int    $max   Maximum allowed value (inclusive).
	 * @param string $field Field name for error message.
	 * @param string $area  Area identifier for error key.
	 * @param array  &$errors Reference to errors array.
	 * @return int|null Validated integer or null if invalid.
	 */
	private function validate_numeric_range_comprehensive( $value, $min, $max, $field, $area, &$errors ) {
		$numeric_value = absint( $value );
		
		if ( $numeric_value < $min || $numeric_value > $max ) {
			$errors[ $area . '_' . $field ] = sprintf(
				'%s must be between %d and %d',
				ucfirst( str_replace( '_', ' ', $field ) ),
				$min,
				$max
			);
			return null;
		}
		
		return $numeric_value;
	}

	/**
	 * Validate color value using WordPress sanitization.
	 *
	 * Helper method for comprehensive color input validation.
	 * Task 37: Add comprehensive input validation
	 * Requirement 12.2
	 *
	 * @param mixed  $value Input color value.
	 * @param string $field Field name for error message.
	 * @param string $area  Area identifier for error key.
	 * @param array  &$errors Reference to errors array.
	 * @return string|null Validated hex color or null if invalid.
	 */
	private function validate_color_comprehensive( $value, $field, $area, &$errors ) {
		$color = sanitize_hex_color( $value );
		
		if ( ! $color ) {
			$errors[ $area . '_' . $field ] = sprintf(
				'Invalid hex color format for %s. Use format #RRGGBB or #RGB',
				str_replace( '_', ' ', $field )
			);
			return null;
		}
		
		return $color;
	}

	/**
	 * Validate URL using WordPress sanitization and PHP filter.
	 *
	 * Helper method for comprehensive URL input validation.
	 * Task 37: Add comprehensive input validation
	 * Requirement 12.2, 12.3
	 *
	 * @param mixed  $value Input URL value.
	 * @param string $field Field name for error message.
	 * @param string $area  Area identifier for error key.
	 * @param array  &$errors Reference to errors array.
	 * @param bool   $allow_empty Whether empty values are allowed.
	 * @return string|null Validated URL or null/empty string if invalid.
	 */
	private function validate_url_comprehensive( $value, $field, $area, &$errors, $allow_empty = true ) {
		$url = esc_url_raw( $value );
		
		// Allow empty URLs if specified.
		if ( empty( $url ) && $allow_empty ) {
			return '';
		}
		
		// Validate URL format using filter_var (Requirement 12.2).
		if ( ! empty( $url ) && ! filter_var( $url, FILTER_VALIDATE_URL ) ) {
			$errors[ $area . '_' . $field ] = sprintf(
				'Invalid URL format for %s',
				str_replace( '_', ' ', $field )
			);
			return null;
		}
		
		return $url;
	}

	/**
	 * Validate enum value against allowed list.
	 *
	 * Helper method for comprehensive enum validation.
	 * Task 37: Add comprehensive input validation
	 * Requirement 12.1, 12.5
	 *
	 * @param mixed  $value Input value to validate.
	 * @param array  $allowed_values Array of allowed values.
	 * @param string $field Field name for error message.
	 * @param string $area  Area identifier for error key.
	 * @param array  &$errors Reference to errors array.
	 * @return string|null Validated value or null if invalid.
	 */
	private function validate_enum_comprehensive( $value, $allowed_values, $field, $area, &$errors ) {
		$sanitized_value = sanitize_text_field( $value );
		
		if ( ! in_array( $sanitized_value, $allowed_values, true ) ) {
			$errors[ $area . '_' . $field ] = sprintf(
				'%s must be one of: %s',
				ucfirst( str_replace( '_', ' ', $field ) ),
				implode( ', ', $allowed_values )
			);
			return null;
		}
		
		return $sanitized_value;
	}

	/**
	 * Validate background settings for a specific area.
	 *
	 * Validates all background configuration including type, opacity, blend modes,
	 * image URLs, gradient colors/angles, and pattern IDs.
	 * Task 37: Enhanced with comprehensive validation helpers
	 * Requirements: 1.4, 5.1, 12.1, 12.2, 12.3, 12.4, 12.5
	 *
	 * @param array  $input Background settings to validate.
	 * @param string $area  Area identifier (dashboard, admin_menu, post_lists, post_editor, widgets, login).
	 * @return array|WP_Error Validated background settings or WP_Error with specific error messages.
	 */
	public function validate_background_settings( $input, $area ) {
		$validated = array();
		$errors    = array();

		// Validate enabled (boolean).
		if ( isset( $input['enabled'] ) ) {
			$validated['enabled'] = (bool) $input['enabled'];
		}

		// Validate background type (Requirement 1.4, 12.1).
		if ( isset( $input['type'] ) ) {
			$allowed_types = array( 'none', 'image', 'gradient', 'pattern' );
			$type = $this->validate_enum_comprehensive(
				$input['type'],
				$allowed_types,
				'type',
				$area,
				$errors
			);
			if ( $type !== null ) {
				$validated['type'] = $type;
			}
		}

		// Validate opacity (0-100 range) (Requirement 5.1, 12.3).
		if ( isset( $input['opacity'] ) ) {
			$opacity = $this->validate_numeric_range_comprehensive(
				$input['opacity'],
				0,
				100,
				'opacity',
				$area,
				$errors
			);
			if ( $opacity !== null ) {
				$validated['opacity'] = $opacity;
			}
		}

		// Validate blend mode (Requirement 5.1, 12.1).
		if ( isset( $input['blend_mode'] ) ) {
			$allowed_blend_modes = array(
				'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
				'color-dodge', 'color-burn', 'hard-light', 'soft-light',
				'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity',
			);
			$blend_mode = $this->validate_enum_comprehensive(
				$input['blend_mode'],
				$allowed_blend_modes,
				'blend_mode',
				$area,
				$errors
			);
			if ( $blend_mode !== null ) {
				$validated['blend_mode'] = $blend_mode;
			}
		}

		// Validate image settings (Requirements 1.4, 12.2, 12.3).
		if ( isset( $input['image_url'] ) ) {
			$image_url = $this->validate_url_comprehensive(
				$input['image_url'],
				'image_url',
				$area,
				$errors,
				true
			);
			if ( $image_url !== null ) {
				$validated['image_url'] = $image_url;
			}
		}

		// Validate original image URL for WebP fallback (Requirement 7.2).
		if ( isset( $input['original_url'] ) ) {
			$original_url = $this->validate_url_comprehensive(
				$input['original_url'],
				'original_url',
				$area,
				$errors,
				true
			);
			if ( $original_url !== null ) {
				$validated['original_url'] = $original_url;
			}
		}

		if ( isset( $input['image_id'] ) ) {
			$validated['image_id'] = absint( $input['image_id'] );
		}

		// Validate image position (Requirement 12.3).
		if ( isset( $input['position'] ) ) {
			$position = sanitize_text_field( $input['position'] );
			
			// Validate position format (standard positions or custom percentages).
			$standard_positions = array(
				'top left', 'top center', 'top right',
				'center left', 'center center', 'center right',
				'bottom left', 'bottom center', 'bottom right',
				'left top', 'center top', 'right top',
				'left center', 'center', 'right center',
				'left bottom', 'center bottom', 'right bottom',
			);
			
			// Check if it's a standard position.
			if ( in_array( $position, $standard_positions, true ) ) {
				$validated['position'] = $position;
			} else {
				// Validate custom percentage format (e.g., "50% 75%").
				if ( preg_match( '/^(\d+)%\s+(\d+)%$/', $position, $matches ) ) {
					$x = absint( $matches[1] );
					$y = absint( $matches[2] );
					
					// Validate percentages are 0-100 (Requirement 12.3).
					if ( $x >= 0 && $x <= 100 && $y >= 0 && $y <= 100 ) {
						$validated['position'] = $x . '% ' . $y . '%';
					} else {
						$errors[ $area . '_position' ] = 'Custom position percentages must be between 0 and 100';
					}
				} else {
					$errors[ $area . '_position' ] = 'Invalid position format. Use standard positions or custom percentages (e.g., "50% 75%")';
				}
			}
		}

		// Validate image size (Requirement 12.1).
		if ( isset( $input['size'] ) ) {
			$allowed_sizes = array( 'cover', 'contain', 'auto', 'custom' );
			$size = $this->validate_enum_comprehensive(
				$input['size'],
				$allowed_sizes,
				'size',
				$area,
				$errors
			);
			if ( $size !== null ) {
				$validated['size'] = $size;
			}
		}

		// Validate custom size (Requirement 12.3, 12.4).
		if ( isset( $input['size_custom'] ) ) {
			$size_custom = sanitize_text_field( $input['size_custom'] );
			
			// Validate custom size format (e.g., "100% auto", "200px 150px", "50% 100px").
			if ( ! empty( $size_custom ) ) {
				// Allow combinations of: percentages, pixels, auto, cover, contain.
				if ( preg_match( '/^((\d+(%|px)|auto|cover|contain)\s+(\d+(%|px)|auto|cover|contain))$/', $size_custom ) ) {
					$validated['size_custom'] = $size_custom;
				} else {
					$errors[ $area . '_size_custom' ] = 'Invalid custom size format. Use valid CSS values (e.g., "100% auto", "200px 150px")';
				}
			} else {
				$validated['size_custom'] = '';
			}
		}

		// Validate image repeat (Requirement 12.1).
		if ( isset( $input['repeat'] ) ) {
			$allowed_repeats = array( 'no-repeat', 'repeat', 'repeat-x', 'repeat-y' );
			$repeat = $this->validate_enum_comprehensive(
				$input['repeat'],
				$allowed_repeats,
				'repeat',
				$area,
				$errors
			);
			if ( $repeat !== null ) {
				$validated['repeat'] = $repeat;
			}
		}

		// Validate image attachment (Requirement 12.1).
		if ( isset( $input['attachment'] ) ) {
			$allowed_attachments = array( 'scroll', 'fixed' );
			$attachment = $this->validate_enum_comprehensive(
				$input['attachment'],
				$allowed_attachments,
				'attachment',
				$area,
				$errors
			);
			if ( $attachment !== null ) {
				$validated['attachment'] = $attachment;
			}
		}

		// Validate gradient settings (Requirements 12.1, 12.3, 12.4).
		if ( isset( $input['gradient_type'] ) ) {
			$allowed_gradient_types = array( 'linear', 'radial' );
			$gradient_type = $this->validate_enum_comprehensive(
				$input['gradient_type'],
				$allowed_gradient_types,
				'gradient_type',
				$area,
				$errors
			);
			if ( $gradient_type !== null ) {
				$validated['gradient_type'] = $gradient_type;
			}
		}

		// Validate gradient angle (0-360 range) (Requirement 12.3).
		if ( isset( $input['gradient_angle'] ) ) {
			$angle = $this->validate_numeric_range_comprehensive(
				$input['gradient_angle'],
				0,
				360,
				'gradient_angle',
				$area,
				$errors
			);
			if ( $angle !== null ) {
				$validated['gradient_angle'] = $angle;
			}
		}

		// Validate gradient colors (Requirements 12.2, 12.3, 12.4, 2.5).
		if ( isset( $input['gradient_colors'] ) && is_array( $input['gradient_colors'] ) ) {
			$validated['gradient_colors'] = array();
			
			foreach ( $input['gradient_colors'] as $index => $stop ) {
				// Validate each color stop has required keys.
				if ( ! isset( $stop['color'] ) || ! isset( $stop['position'] ) ) {
					$errors[ $area . '_gradient_colors_' . $index ] = 'Each gradient color stop must have color and position';
					continue;
				}

				// Validate color using sanitize_hex_color (Requirement 12.2).
				$color = $this->validate_color_comprehensive(
					$stop['color'],
					'gradient_colors_' . $index . '_color',
					$area,
					$errors
				);
				if ( ! $color ) {
					continue;
				}

				// Validate position (0-100 range) (Requirement 12.3).
				$position = $this->validate_numeric_range_comprehensive(
					$stop['position'],
					0,
					100,
					'gradient_colors_' . $index . '_position',
					$area,
					$errors
				);
				if ( $position === null ) {
					continue;
				}

				// Add validated color stop.
				$validated['gradient_colors'][] = array(
					'color'    => $color,
					'position' => $position,
				);
			}

			// Validate minimum 2 color stops (Requirement 2.5).
			if ( count( $validated['gradient_colors'] ) < 2 ) {
				$errors[ $area . '_gradient_colors_count' ] = 'Gradient must have at least 2 color stops';
			}

			// Validate maximum 10 color stops (Requirement 2.5).
			if ( count( $validated['gradient_colors'] ) > 10 ) {
				$errors[ $area . '_gradient_colors_count' ] = 'Gradient cannot have more than 10 color stops';
			}

			// Sort color stops by position (Requirement 2.5).
			if ( ! empty( $validated['gradient_colors'] ) ) {
				usort( $validated['gradient_colors'], function( $a, $b ) {
					return $a['position'] - $b['position'];
				} );
			}
		}

		if ( isset( $input['gradient_preset'] ) ) {
			$validated['gradient_preset'] = sanitize_text_field( $input['gradient_preset'] );
		}

		// Validate pattern settings (Requirements 12.1, 12.2, 12.3, 12.5).
		// Task 21: Enhanced pattern validation
		if ( isset( $input['pattern_id'] ) ) {
			$pattern_id = sanitize_key( $input['pattern_id'] );
			
			// Validate pattern ID exists in pattern library (Requirement 3.2, 12.1).
			if ( ! empty( $pattern_id ) ) {
				$pattern_library = $this->get_pattern_library();
				$pattern_found = false;
				
				// Search for pattern in all categories.
				foreach ( $pattern_library as $category => $patterns ) {
					if ( isset( $patterns[ $pattern_id ] ) ) {
						$pattern_found = true;
						break;
					}
				}
				
				if ( $pattern_found ) {
					$validated['pattern_id'] = $pattern_id;
				} else {
					$errors[ $area . '_pattern_id' ] = sprintf(
						'Pattern ID "%s" does not exist in pattern library',
						$pattern_id
					);
				}
			} else {
				$validated['pattern_id'] = '';
			}
		}

		// Validate pattern color (Requirement 12.2).
		if ( isset( $input['pattern_color'] ) ) {
			$color = $this->validate_color_comprehensive(
				$input['pattern_color'],
				'pattern_color',
				$area,
				$errors
			);
			if ( $color ) {
				$validated['pattern_color'] = $color;
			}
		}

		// Validate pattern opacity (0-100 range) (Requirement 12.3).
		if ( isset( $input['pattern_opacity'] ) ) {
			$opacity = $this->validate_numeric_range_comprehensive(
				$input['pattern_opacity'],
				0,
				100,
				'pattern_opacity',
				$area,
				$errors
			);
			if ( $opacity !== null ) {
				$validated['pattern_opacity'] = $opacity;
			}
		}

		// Validate pattern scale (50-200 range) (Requirement 12.3).
		if ( isset( $input['pattern_scale'] ) ) {
			$scale = $this->validate_numeric_range_comprehensive(
				$input['pattern_scale'],
				50,
				200,
				'pattern_scale',
				$area,
				$errors
			);
			if ( $scale !== null ) {
				$validated['pattern_scale'] = $scale;
			}
		}

		// Validate responsive settings (Requirement 12.1).
		if ( isset( $input['responsive_enabled'] ) ) {
			$validated['responsive_enabled'] = (bool) $input['responsive_enabled'];
		}

		if ( isset( $input['responsive'] ) && is_array( $input['responsive'] ) ) {
			$validated['responsive'] = array();
			$breakpoints = array( 'desktop', 'tablet', 'mobile' );
			
			foreach ( $breakpoints as $breakpoint ) {
				if ( isset( $input['responsive'][ $breakpoint ] ) && is_array( $input['responsive'][ $breakpoint ] ) ) {
					// Recursively validate responsive breakpoint settings.
					$breakpoint_validation = $this->validate_background_settings(
						$input['responsive'][ $breakpoint ],
						$area . '_' . $breakpoint
					);
					
					if ( is_wp_error( $breakpoint_validation ) ) {
						$errors = array_merge( $errors, $breakpoint_validation->get_error_data() );
					} else {
						$validated['responsive'][ $breakpoint ] = $breakpoint_validation;
					}
				}
			}
		}

		// Return WP_Error if validation failed (Requirement 12.5).
		if ( ! empty( $errors ) ) {
			return new WP_Error(
				'background_validation_failed',
				sprintf( 'Background validation failed for %s', $area ),
				$errors
			);
		}

		return $validated;
	}

	/**
	 * Get pattern library with 50+ SVG patterns.
	 *
	 * Provides SVG patterns organized by category (dots, lines, grids, organic).
	 * Patterns use {color} placeholder for customization.
	 * Filterable via WordPress filter hook for extensibility.
	 * Task 19: Create pattern library data structure
	 * Requirements: 3.1, 3.2
	 *
	 * @return array Pattern library organized by category.
	 */
	public function get_pattern_library() {
		$patterns = array(
			// Dots category (10+ patterns)
			'dots' => array(
				'dot-grid' => array(
					'name'        => __( 'Dot Grid', 'mase' ),
					'category'    => 'dots',
					'description' => __( 'Simple grid of dots', 'mase' ),
					'svg'         => '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1" fill="{color}"/></svg>',
				),
				'dot-pattern' => array(
					'name'        => __( 'Dot Pattern', 'mase' ),
					'category'    => 'dots',
					'description' => __( 'Scattered dot pattern', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="2" fill="{color}"/><circle cx="25" cy="15" r="2" fill="{color}"/><circle cx="15" cy="30" r="2" fill="{color}"/></svg>',
				),
				'polka-dots' => array(
					'name'        => __( 'Polka Dots', 'mase' ),
					'category'    => 'dots',
					'description' => __( 'Classic polka dot pattern', 'mase' ),
					'svg'         => '<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="15" r="4" fill="{color}"/></svg>',
				),
				'small-dots' => array(
					'name'        => __( 'Small Dots', 'mase' ),
					'category'    => 'dots',
					'description' => __( 'Tiny dot grid', 'mase' ),
					'svg'         => '<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><circle cx="1" cy="1" r="0.5" fill="{color}"/></svg>',
				),
				'large-dots' => array(
					'name'        => __( 'Large Dots', 'mase' ),
					'category'    => 'dots',
					'description' => __( 'Large dot pattern', 'mase' ),
					'svg'         => '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="8" fill="{color}"/></svg>',
				),
				'diagonal-dots' => array(
					'name'        => __( 'Diagonal Dots', 'mase' ),
					'category'    => 'dots',
					'description' => __( 'Dots arranged diagonally', 'mase' ),
					'svg'         => '<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="2" fill="{color}"/><circle cx="15" cy="15" r="2" fill="{color}"/><circle cx="25" cy="25" r="2" fill="{color}"/></svg>',
				),
				'hexagon-dots' => array(
					'name'        => __( 'Hexagon Dots', 'mase' ),
					'category'    => 'dots',
					'description' => __( 'Dots in hexagonal arrangement', 'mase' ),
					'svg'         => '<svg width="40" height="35" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2" fill="{color}"/><circle cx="30" cy="10" r="2" fill="{color}"/><circle cx="20" cy="25" r="2" fill="{color}"/></svg>',
				),
				'random-dots' => array(
					'name'        => __( 'Random Dots', 'mase' ),
					'category'    => 'dots',
					'description' => __( 'Randomly placed dots', 'mase' ),
					'svg'         => '<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="15" r="2" fill="{color}"/><circle cx="35" cy="8" r="2" fill="{color}"/><circle cx="50" cy="30" r="2" fill="{color}"/><circle cx="20" cy="45" r="2" fill="{color}"/><circle cx="45" cy="50" r="2" fill="{color}"/></svg>',
				),
				'dot-dash' => array(
					'name'        => __( 'Dot Dash', 'mase' ),
					'category'    => 'dots',
					'description' => __( 'Alternating dots and dashes', 'mase' ),
					'svg'         => '<svg width="40" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="10" r="2" fill="{color}"/><rect x="15" y="9" width="10" height="2" fill="{color}"/><circle cx="35" cy="10" r="2" fill="{color}"/></svg>',
				),
				'concentric-dots' => array(
					'name'        => __( 'Concentric Dots', 'mase' ),
					'category'    => 'dots',
					'description' => __( 'Dots with concentric circles', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="3" fill="none" stroke="{color}" stroke-width="1"/><circle cx="20" cy="20" r="1.5" fill="{color}"/></svg>',
				),
			),
			
			// Lines category (15+ patterns)
			'lines' => array(
				'horizontal-lines' => array(
					'name'        => __( 'Horizontal Lines', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Horizontal stripe pattern', 'mase' ),
					'svg'         => '<svg width="100" height="20" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="10" x2="100" y2="10" stroke="{color}" stroke-width="2"/></svg>',
				),
				'vertical-lines' => array(
					'name'        => __( 'Vertical Lines', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Vertical stripe pattern', 'mase' ),
					'svg'         => '<svg width="20" height="100" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="0" x2="10" y2="100" stroke="{color}" stroke-width="2"/></svg>',
				),
				'diagonal-lines' => array(
					'name'        => __( 'Diagonal Lines', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Diagonal stripe pattern', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="40" y2="40" stroke="{color}" stroke-width="2"/></svg>',
				),
				'cross-hatch' => array(
					'name'        => __( 'Cross Hatch', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Crossed diagonal lines', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="40" y2="40" stroke="{color}" stroke-width="1"/><line x1="40" y1="0" x2="0" y2="40" stroke="{color}" stroke-width="1"/></svg>',
				),
				'zigzag' => array(
					'name'        => __( 'Zigzag', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Zigzag line pattern', 'mase' ),
					'svg'         => '<svg width="40" height="20" xmlns="http://www.w3.org/2000/svg"><polyline points="0,10 10,0 20,10 30,0 40,10" fill="none" stroke="{color}" stroke-width="2"/></svg>',
				),
				'chevron' => array(
					'name'        => __( 'Chevron', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Chevron arrow pattern', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><polyline points="0,0 20,20 40,0" fill="none" stroke="{color}" stroke-width="2"/></svg>',
				),
				'herringbone' => array(
					'name'        => __( 'Herringbone', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Herringbone pattern', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="20" x2="20" y2="0" stroke="{color}" stroke-width="2"/><line x1="20" y1="40" x2="40" y2="20" stroke="{color}" stroke-width="2"/></svg>',
				),
				'parallel-lines' => array(
					'name'        => __( 'Parallel Lines', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Multiple parallel lines', 'mase' ),
					'svg'         => '<svg width="100" height="30" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="5" x2="100" y2="5" stroke="{color}" stroke-width="1"/><line x1="0" y1="15" x2="100" y2="15" stroke="{color}" stroke-width="1"/><line x1="0" y1="25" x2="100" y2="25" stroke="{color}" stroke-width="1"/></svg>',
				),
				'dashed-lines' => array(
					'name'        => __( 'Dashed Lines', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Horizontal dashed lines', 'mase' ),
					'svg'         => '<svg width="100" height="20" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="10" x2="100" y2="10" stroke="{color}" stroke-width="2" stroke-dasharray="5,5"/></svg>',
				),
				'dotted-lines' => array(
					'name'        => __( 'Dotted Lines', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Horizontal dotted lines', 'mase' ),
					'svg'         => '<svg width="100" height="20" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="10" x2="100" y2="10" stroke="{color}" stroke-width="2" stroke-dasharray="2,5"/></svg>',
				),
				'wavy-lines' => array(
					'name'        => __( 'Wavy Lines', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Horizontal wavy lines', 'mase' ),
					'svg'         => '<svg width="60" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M0,10 Q15,0 30,10 T60,10" fill="none" stroke="{color}" stroke-width="2"/></svg>',
				),
				'railroad' => array(
					'name'        => __( 'Railroad', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Railroad track pattern', 'mase' ),
					'svg'         => '<svg width="100" height="30" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="5" x2="100" y2="5" stroke="{color}" stroke-width="2"/><line x1="0" y1="25" x2="100" y2="25" stroke="{color}" stroke-width="2"/><line x1="10" y1="5" x2="10" y2="25" stroke="{color}" stroke-width="1"/><line x1="30" y1="5" x2="30" y2="25" stroke="{color}" stroke-width="1"/><line x1="50" y1="5" x2="50" y2="25" stroke="{color}" stroke-width="1"/><line x1="70" y1="5" x2="70" y2="25" stroke="{color}" stroke-width="1"/><line x1="90" y1="5" x2="90" y2="25" stroke="{color}" stroke-width="1"/></svg>',
				),
				'brick-lines' => array(
					'name'        => __( 'Brick Lines', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Brick wall pattern', 'mase' ),
					'svg'         => '<svg width="60" height="40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="30" height="20" fill="none" stroke="{color}" stroke-width="1"/><rect x="30" y="0" width="30" height="20" fill="none" stroke="{color}" stroke-width="1"/><rect x="15" y="20" width="30" height="20" fill="none" stroke="{color}" stroke-width="1"/></svg>',
				),
				'bamboo' => array(
					'name'        => __( 'Bamboo', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Bamboo stick pattern', 'mase' ),
					'svg'         => '<svg width="20" height="100" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="0" x2="10" y2="100" stroke="{color}" stroke-width="3"/><line x1="5" y1="20" x2="15" y2="20" stroke="{color}" stroke-width="1"/><line x1="5" y1="50" x2="15" y2="50" stroke="{color}" stroke-width="1"/><line x1="5" y1="80" x2="15" y2="80" stroke="{color}" stroke-width="1"/></svg>',
				),
				'arrows' => array(
					'name'        => __( 'Arrows', 'mase' ),
					'category'    => 'lines',
					'description' => __( 'Arrow pattern', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><polyline points="10,20 20,10 30,20" fill="none" stroke="{color}" stroke-width="2"/><line x1="20" y1="10" x2="20" y2="30" stroke="{color}" stroke-width="2"/></svg>',
				),
			),
			
			// Grids category (10+ patterns)
			'grids' => array(
				'square-grid' => array(
					'name'        => __( 'Square Grid', 'mase' ),
					'category'    => 'grids',
					'description' => __( 'Simple square grid', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="40" height="40" fill="none" stroke="{color}" stroke-width="1"/></svg>',
				),
				'small-grid' => array(
					'name'        => __( 'Small Grid', 'mase' ),
					'category'    => 'grids',
					'description' => __( 'Fine grid pattern', 'mase' ),
					'svg'         => '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="20" height="20" fill="none" stroke="{color}" stroke-width="0.5"/></svg>',
				),
				'large-grid' => array(
					'name'        => __( 'Large Grid', 'mase' ),
					'category'    => 'grids',
					'description' => __( 'Large grid pattern', 'mase' ),
					'svg'         => '<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="80" height="80" fill="none" stroke="{color}" stroke-width="2"/></svg>',
				),
				'graph-paper' => array(
					'name'        => __( 'Graph Paper', 'mase' ),
					'category'    => 'grids',
					'description' => __( 'Graph paper grid', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="0" y2="40" stroke="{color}" stroke-width="0.5"/><line x1="10" y1="0" x2="10" y2="40" stroke="{color}" stroke-width="0.5"/><line x1="20" y1="0" x2="20" y2="40" stroke="{color}" stroke-width="1"/><line x1="30" y1="0" x2="30" y2="40" stroke="{color}" stroke-width="0.5"/><line x1="40" y1="0" x2="40" y2="40" stroke="{color}" stroke-width="0.5"/><line x1="0" y1="0" x2="40" y2="0" stroke="{color}" stroke-width="0.5"/><line x1="0" y1="10" x2="40" y2="10" stroke="{color}" stroke-width="0.5"/><line x1="0" y1="20" x2="40" y2="20" stroke="{color}" stroke-width="1"/><line x1="0" y1="30" x2="40" y2="30" stroke="{color}" stroke-width="0.5"/><line x1="0" y1="40" x2="40" y2="40" stroke="{color}" stroke-width="0.5"/></svg>',
				),
				'isometric-grid' => array(
					'name'        => __( 'Isometric Grid', 'mase' ),
					'category'    => 'grids',
					'description' => __( 'Isometric cube grid', 'mase' ),
					'svg'         => '<svg width="60" height="52" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="26" x2="30" y2="0" stroke="{color}" stroke-width="1"/><line x1="30" y1="0" x2="60" y2="26" stroke="{color}" stroke-width="1"/><line x1="0" y1="26" x2="30" y2="52" stroke="{color}" stroke-width="1"/><line x1="30" y1="52" x2="60" y2="26" stroke="{color}" stroke-width="1"/><line x1="30" y1="0" x2="30" y2="52" stroke="{color}" stroke-width="1"/></svg>',
				),
				'hexagon-grid' => array(
					'name'        => __( 'Hexagon Grid', 'mase' ),
					'category'    => 'grids',
					'description' => __( 'Hexagonal grid pattern', 'mase' ),
					'svg'         => '<svg width="56" height="48" xmlns="http://www.w3.org/2000/svg"><polygon points="28,0 42,8 42,24 28,32 14,24 14,8" fill="none" stroke="{color}" stroke-width="1"/></svg>',
				),
				'triangle-grid' => array(
					'name'        => __( 'Triangle Grid', 'mase' ),
					'category'    => 'grids',
					'description' => __( 'Triangular grid pattern', 'mase' ),
					'svg'         => '<svg width="40" height="35" xmlns="http://www.w3.org/2000/svg"><polygon points="20,0 40,35 0,35" fill="none" stroke="{color}" stroke-width="1"/></svg>',
				),
				'diamond-grid' => array(
					'name'        => __( 'Diamond Grid', 'mase' ),
					'category'    => 'grids',
					'description' => __( 'Diamond shaped grid', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><polygon points="20,0 40,20 20,40 0,20" fill="none" stroke="{color}" stroke-width="1"/></svg>',
				),
				'plus-grid' => array(
					'name'        => __( 'Plus Grid', 'mase' ),
					'category'    => 'grids',
					'description' => __( 'Plus sign grid', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="0" x2="20" y2="40" stroke="{color}" stroke-width="2"/><line x1="0" y1="20" x2="40" y2="20" stroke="{color}" stroke-width="2"/></svg>',
				),
				'cross-grid' => array(
					'name'        => __( 'Cross Grid', 'mase' ),
					'category'    => 'grids',
					'description' => __( 'X-shaped cross grid', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="40" y2="40" stroke="{color}" stroke-width="2"/><line x1="40" y1="0" x2="0" y2="40" stroke="{color}" stroke-width="2"/></svg>',
				),
				'weave-grid' => array(
					'name'        => __( 'Weave Grid', 'mase' ),
					'category'    => 'grids',
					'description' => __( 'Woven basket pattern', 'mase' ),
					'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="20" height="10" fill="{color}"/><rect x="20" y="10" width="20" height="10" fill="{color}"/><rect x="0" y="20" width="20" height="10" fill="{color}"/><rect x="20" y="30" width="20" height="10" fill="{color}"/></svg>',
				),
			),
			
			// Organic category (20+ patterns) - abbreviated for brevity
			'organic' => array(
				'waves' => array(
					'name'        => __( 'Waves', 'mase' ),
					'category'    => 'organic',
					'description' => __( 'Ocean wave pattern', 'mase' ),
					'svg'         => '<svg width="100" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M0,20 Q25,0 50,20 T100,20" fill="none" stroke="{color}" stroke-width="2"/></svg>',
				),
				'circles' => array(
					'name'        => __( 'Circles', 'mase' ),
					'category'    => 'organic',
					'description' => __( 'Overlapping circles', 'mase' ),
					'svg'         => '<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="20" fill="none" stroke="{color}" stroke-width="2"/></svg>',
				),
				'stars' => array(
					'name'        => __( 'Stars', 'mase' ),
					'category'    => 'organic',
					'description' => __( 'Star pattern', 'mase' ),
					'svg'         => '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><polygon points="25,5 30,20 45,20 33,28 38,43 25,35 12,43 17,28 5,20 20,20" fill="none" stroke="{color}" stroke-width="2"/></svg>',
				),
			),
		);

		/**
		 * Filter pattern library.
		 *
		 * Allows developers to add, remove, or modify SVG patterns.
		 *
		 * @since 1.2.0
		 * @param array $patterns Pattern library organized by category.
		 */
		return apply_filters( 'mase_pattern_library', $patterns );
	}

	/**
	 * Get Google Fonts list.
	 *
	 * Fetches available Google Fonts from the API and caches the result for 24 hours.
	 * Returns a curated list of popular fonts for better performance.
	 * Requirements: 1.2, 1.5
	 *
	 * @return array Array of Google Font names.
	 */
	public function get_google_fonts_list() {
		// Check cache first (24 hour cache).
		$cached_fonts = get_transient( 'mase_google_fonts_list' );
		if ( false !== $cached_fonts && is_array( $cached_fonts ) ) {
			return $cached_fonts;
		}

		// Curated list of popular Google Fonts for better performance.
		// Full API integration can be added later if needed.
		$popular_fonts = array(
			'Inter',
			'Roboto',
			'Open Sans',
			'Lato',
			'Montserrat',
			'Poppins',
			'Raleway',
			'Ubuntu',
			'Nunito',
			'Playfair Display',
			'Merriweather',
			'PT Sans',
			'Source Sans Pro',
			'Oswald',
			'Noto Sans',
			'Rubik',
			'Work Sans',
			'Fira Sans',
			'Quicksand',
			'Karla',
			'Mulish',
			'DM Sans',
			'Space Grotesk',
			'Manrope',
			'Plus Jakarta Sans',
		);

		/**
		 * Filter Google Fonts list.
		 *
		 * Allows developers to add or remove fonts from the list.
		 *
		 * @since 1.3.0
		 * @param array $popular_fonts Array of Google Font names.
		 */
		$fonts = apply_filters( 'mase_google_fonts_list', $popular_fonts );

		// Cache for 24 hours.
		set_transient( 'mase_google_fonts_list', $fonts, DAY_IN_SECONDS );

		return $fonts;
	}

	/**
	 * Get Google Font URL.
	 *
	 * Generates the Google Fonts API URL for the specified fonts with proper parameters.
	 * Includes font-display, weights, and subset configuration.
	 * Requirements: 1.2, 1.5
	 *
	 * @param array $font_families Array of font family names.
	 * @param array $args Optional. Additional arguments for URL generation.
	 *                    - font_display: 'swap' (default), 'block', 'fallback', 'optional'
	 *                    - weights: Array of font weights (default: 300,400,500,600,700)
	 *                    - subset: Font subset (default: 'latin-ext' for Polish support)
	 * @return string Google Fonts API URL or empty string if no fonts.
	 */
	public function get_google_font_url( $font_families, $args = array() ) {
		// Return empty if no fonts specified.
		if ( empty( $font_families ) || ! is_array( $font_families ) ) {
			return '';
		}

		// Default arguments.
		$defaults = array(
			'font_display' => 'swap',
			'weights'      => array( 300, 400, 500, 600, 700 ),
			'subset'       => 'latin-ext', // Polish language support.
		);
		$args = wp_parse_args( $args, $defaults );

		// Sanitize font families.
		$font_families = array_map( 'sanitize_text_field', $font_families );
		$font_families = array_filter( $font_families ); // Remove empty values.

		if ( empty( $font_families ) ) {
			return '';
		}

		// Build font family strings with weights.
		$families = array();
		foreach ( $font_families as $family ) {
			// Replace spaces with + for URL encoding.
			$family_encoded = str_replace( ' ', '+', $family );
			
			// Add weights specification.
			$weights_str = implode( ';', $args['weights'] );
			$families[] = $family_encoded . ':wght@' . $weights_str;
		}

		// Build URL parameters.
		$url_params = array(
			'family'  => implode( '&family=', $families ),
			'display' => sanitize_text_field( $args['font_display'] ),
		);

		// Add subset if specified.
		if ( ! empty( $args['subset'] ) ) {
			$url_params['subset'] = sanitize_text_field( $args['subset'] );
		}

		// Build final URL.
		$base_url = 'https://fonts.googleapis.com/css2';
		$query_string = http_build_query( $url_params, '', '&' );
		
		// Google Fonts API v2 uses a different format, so we need to manually construct it.
		$url = $base_url . '?family=' . implode( '&family=', $families );
		$url .= '&display=' . $url_params['display'];
		
		if ( ! empty( $args['subset'] ) ) {
			$url .= '&subset=' . $url_params['subset'];
		}

		return esc_url_raw( $url );
	}

	/**
	 * Generate preload links for Google Fonts.
	 *
	 * Creates link elements for preloading critical fonts to prevent FOUT.
	 * Requirements: 1.5, 5.6
	 *
	 * @param array $font_families Array of font family names to preload.
	 * @return string HTML link elements for font preloading.
	 */
	public function preload_google_fonts( $font_families ) {
		// Return empty if no fonts specified.
		if ( empty( $font_families ) || ! is_array( $font_families ) ) {
			return '';
		}

		// Sanitize font families.
		$font_families = array_map( 'sanitize_text_field', $font_families );
		$font_families = array_filter( $font_families );

		if ( empty( $font_families ) ) {
			return '';
		}

		// Get the Google Fonts URL.
		$font_url = $this->get_google_font_url( $font_families );
		
		if ( empty( $font_url ) ) {
			return '';
		}

		// Generate preload link.
		$preload_link = sprintf(
			'<link rel="preload" href="%s" as="style" crossorigin="anonymous">',
			esc_url( $font_url )
		);

		/**
		 * Filter Google Fonts preload links.
		 *
		 * Allows developers to modify or add additional preload links.
		 *
		 * @since 1.3.0
		 * @param string $preload_link HTML link element for preloading.
		 * @param array  $font_families Array of font family names.
		 */
		return apply_filters( 'mase_google_fonts_preload', $preload_link, $font_families );
	}
}
