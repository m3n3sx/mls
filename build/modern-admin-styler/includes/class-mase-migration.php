<?php
/**
 * MASE Migration Class
 *
 * Handles version upgrades and settings migration from v1.1.0 to v1.2.0.
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 *
 * @package ModernAdminStyler
 * @since 1.2.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Migration class for upgrading settings from v1.1.0 to v1.2.0.
 *
 * Detects version changes and automatically migrates settings structure
 * while preserving user customizations.
 */
class MASE_Migration {

	/**
	 * Check if migration is needed and execute if required.
	 *
	 * Requirements: 10.1, 10.2
	 *
	 * @return void
	 */
	public static function maybe_migrate() {
		// Get current stored version.
		$stored_version = get_option( 'mase_version', '0.0.0' );

		// If version is already 1.2.0 or higher, check for admin bar enhancement migration.
		if ( version_compare( $stored_version, '1.2.0', '>=' ) ) {
			// Check if admin bar enhancement migration is needed (Task 15.1).
			self::maybe_migrate_admin_bar_settings();

			// Check if dark mode migration is needed (Task 17).
			self::maybe_migrate_dark_mode_settings();

			// Check if login customization migration is needed (Task 13).
			self::maybe_migrate_login_customization_settings();

			// Check if button system migration is needed (Task 9).
			self::maybe_migrate_to_button_system();

			// Check if background system migration is needed (Task 42).
			self::maybe_migrate_background_system();
			return;
		}

		// Execute migration.
		self::migrate();
	}

	/**
	 * Check if background system migration is needed and execute if required.
	 *
	 * Task 42: Implement settings migration.
	 * Requirement 11.1: Initialize default structure for new installations.
	 *
	 * @since 1.3.0
	 * @access public
	 * @static
	 *
	 * @return void
	 */
	public static function maybe_migrate_background_system() {
		// Ensure the background migration class is loaded.
		if ( ! class_exists( 'MASE_Background_Migration' ) ) {
			require_once MASE_PLUGIN_DIR . 'includes/class-mase-background-migration.php';
		}

		// Execute background migration check.
		MASE_Background_Migration::maybe_migrate();
	}

	/**
	 * Execute migration workflow.
	 *
	 * Requirements: 10.2, 10.3, 10.4, 10.5
	 * Task 15.2: Store version in database and log migration results.
	 *
	 * @return void
	 */
	private static function migrate() {
		$current_version = defined( 'MASE_VERSION' ) ? MASE_VERSION : '1.2.1';

		// Task 15.2: Log migration start.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( sprintf( 'MASE: Starting migration to version %s', $current_version ) );
		}

		// Backup old settings (Requirement 10.3).
		self::backup_old_settings();

		// Transform settings structure (Requirement 10.4).
		self::transform_settings();

		// Task 15.2: Update version number (Requirement 10.5).
		update_option( 'mase_version', $current_version );

		// Task 15.2: Store settings version separately for granular migration tracking.
		update_option( 'mase_settings_version', $current_version );

		// Task 15.2: Log migration completion with results.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( sprintf( 'MASE: Migration to v%s completed successfully.', $current_version ) );
		}
	}

	/**
	 * Backup old settings before migration.
	 *
	 * Requirement 10.3: Store v1.1.0 settings in separate option.
	 *
	 * @return void
	 */
	private static function backup_old_settings() {
		$old_settings = get_option( 'mase_settings', array() );

		if ( ! empty( $old_settings ) ) {
			update_option( 'mase_settings_backup_110', $old_settings );
		}
	}

	/**
	 * Transform settings from v1.1.0 structure to v1.2.0 structure.
	 *
	 * Requirement 10.4: Map old settings to new structure with all new fields.
	 *
	 * @return void
	 */
	private static function transform_settings() {
		$old_settings = get_option( 'mase_settings', array() );

		// If no old settings exist, initialize with defaults.
		if ( empty( $old_settings ) ) {
			$settings = new MASE_Settings();
			$settings->initialize_defaults();
			return;
		}

		// Initialize new settings structure with defaults.
		$settings     = new MASE_Settings();
		$new_settings = $settings->get_defaults();

		// Map old settings to new structure.
		// Preserve admin_bar settings if they exist.
		if ( isset( $old_settings['admin_bar'] ) ) {
			$new_settings['admin_bar'] = array_merge(
				$new_settings['admin_bar'],
				$old_settings['admin_bar']
			);
		}

		// Preserve admin_menu settings if they exist.
		if ( isset( $old_settings['admin_menu'] ) ) {
			$new_settings['admin_menu'] = array_merge(
				$new_settings['admin_menu'],
				$old_settings['admin_menu']
			);
		}

		// Preserve content_area settings if they exist.
		if ( isset( $old_settings['content_area'] ) ) {
			$new_settings['content_area'] = array_merge(
				$new_settings['content_area'],
				$old_settings['content_area']
			);
		}

		// Preserve custom CSS/JS if they exist.
		if ( isset( $old_settings['advanced']['custom_css'] ) ) {
			$new_settings['advanced']['custom_css'] = $old_settings['advanced']['custom_css'];
		}
		if ( isset( $old_settings['advanced']['custom_js'] ) ) {
			$new_settings['advanced']['custom_js'] = $old_settings['advanced']['custom_js'];
		}

		// Save transformed settings.
		update_option( 'mase_settings', $new_settings );

		// Clear cache to force regeneration with new settings.
		$cache = new MASE_CacheManager();
		$cache->clear_all();
	}

	/**
	 * Migrate admin bar settings to include new comprehensive enhancement options.
	 *
	 * Task 15.1: Add defaults for all new admin bar settings while preserving existing values.
	 * Task 15.2: Store settings version in database and compare with current version.
	 * Requirements: All (1.1-13.5)
	 *
	 * @return void
	 */
	public static function maybe_migrate_admin_bar_settings() {
		// Task 15.2: Get stored settings version.
		$stored_settings_version = get_option( 'mase_settings_version', '1.2.0' );
		$current_version         = defined( 'MASE_VERSION' ) ? MASE_VERSION : '1.2.1';

		// Task 15.2: Compare versions - run migration if settings version is older.
		if ( version_compare( $stored_settings_version, '1.2.1', '>=' ) ) {
			return; // Migration already completed for this version.
		}

		// Task 15.2: Log migration start.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log(
				sprintf(
					'MASE: Starting admin bar enhancement migration from settings version %s to %s',
					$stored_settings_version,
					$current_version
				)
			);
		}

		// Get current settings.
		$current_settings = get_option( 'mase_settings', array() );

		// If no settings exist, skip migration (will use defaults).
		if ( empty( $current_settings ) ) {
			// Task 15.2: Update settings version even if no settings exist.
			update_option( 'mase_settings_version', $current_version );
			return;
		}

		// Execute admin bar settings migration.
		self::migrate_admin_bar_settings( $current_settings );

		// Task 15.2: Update settings version to current version.
		update_option( 'mase_settings_version', $current_version );

		// Task 15.2: Log migration completion with results.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log(
				sprintf(
					'MASE: Admin Bar comprehensive enhancement migration completed successfully. Settings version updated to %s',
					$current_version
				)
			);
		}
	}

	/**
	 * Migrate admin bar settings structure.
	 *
	 * Task 15.1: Set defaults for all new settings and preserve existing settings.
	 * Requirements: All (1.1-13.5)
	 *
	 * @param array $settings Current settings array.
	 * @return void
	 */
	private static function migrate_admin_bar_settings( $settings ) {
		$settings_obj = new MASE_Settings();
		$defaults     = $settings_obj->get_defaults();

		// Ensure admin_bar array exists.
		if ( ! isset( $settings['admin_bar'] ) ) {
			$settings['admin_bar'] = array();
		}

		// NEW: Add gradient background settings (Requirement 5.1, 5.2, 5.3, 5.4, 5.5).
		$gradient_defaults = array(
			'bg_type'         => 'solid',
			'gradient_type'   => 'linear',
			'gradient_angle'  => 90,
			'gradient_colors' => array(
				array(
					'color'    => '#23282d',
					'position' => 0,
				),
				array(
					'color'    => '#32373c',
					'position' => 100,
				),
			),
		);

		foreach ( $gradient_defaults as $key => $value ) {
			if ( ! isset( $settings['admin_bar'][ $key ] ) ) {
				$settings['admin_bar'][ $key ] = $value;
			}
		}

		// NEW: Add width controls (Requirement 11.1, 11.2).
		$width_defaults = array(
			'width_unit'  => 'percent',
			'width_value' => 100,
		);

		foreach ( $width_defaults as $key => $value ) {
			if ( ! isset( $settings['admin_bar'][ $key ] ) ) {
				$settings['admin_bar'][ $key ] = $value;
			}
		}

		// NEW: Add individual corner radius controls (Requirement 9.1, 9.2).
		$border_radius_defaults = array(
			'border_radius_mode' => 'uniform',
			'border_radius'      => 0,
			'border_radius_tl'   => 0,
			'border_radius_tr'   => 0,
			'border_radius_bl'   => 0,
			'border_radius_br'   => 0,
		);

		foreach ( $border_radius_defaults as $key => $value ) {
			if ( ! isset( $settings['admin_bar'][ $key ] ) ) {
				$settings['admin_bar'][ $key ] = $value;
			}
		}

		// NEW: Add individual floating margin controls (Requirement 12.1, 12.2).
		$floating_margin_defaults = array(
			'floating_margin_mode'   => 'uniform',
			'floating_margin'        => 8,
			'floating_margin_top'    => 8,
			'floating_margin_right'  => 8,
			'floating_margin_bottom' => 8,
			'floating_margin_left'   => 8,
		);

		foreach ( $floating_margin_defaults as $key => $value ) {
			if ( ! isset( $settings['admin_bar'][ $key ] ) ) {
				$settings['admin_bar'][ $key ] = $value;
			}
		}

		// NEW: Add advanced shadow controls (Requirement 10.1, 10.2, 10.3, 10.4).
		$shadow_defaults = array(
			'shadow_mode'     => 'preset',
			'shadow_preset'   => 'none',
			'shadow_h_offset' => 0,
			'shadow_v_offset' => 4,
			'shadow_blur'     => 8,
			'shadow_spread'   => 0,
			'shadow_color'    => '#000000',
			'shadow_opacity'  => 0.15,
		);

		foreach ( $shadow_defaults as $key => $value ) {
			if ( ! isset( $settings['admin_bar'][ $key ] ) ) {
				$settings['admin_bar'][ $key ] = $value;
			}
		}

		// NEW: Add submenu styling settings (Requirement 6.1, 6.2, 6.3, 7.1-7.5).
		if ( ! isset( $settings['admin_bar_submenu'] ) ) {
			$settings['admin_bar_submenu'] = $defaults['admin_bar_submenu'];
		} else {
			// Merge with defaults to ensure all keys exist.
			$settings['admin_bar_submenu'] = array_merge(
				$defaults['admin_bar_submenu'],
				$settings['admin_bar_submenu']
			);
		}

		// NEW: Add font family to typography settings (Requirement 8.1, 8.2, 8.4, 8.5).
		if ( ! isset( $settings['typography'] ) ) {
			$settings['typography'] = array();
		}

		if ( ! isset( $settings['typography']['admin_bar'] ) ) {
			$settings['typography']['admin_bar'] = array();
		}

		$typography_defaults = array(
			'font_family'     => 'system',
			'google_font_url' => '',
		);

		foreach ( $typography_defaults as $key => $value ) {
			if ( ! isset( $settings['typography']['admin_bar'][ $key ] ) ) {
				$settings['typography']['admin_bar'][ $key ] = $value;
			}
		}

		// Save migrated settings.
		update_option( 'mase_settings', $settings );

		// Clear cache to force regeneration with new settings.
		if ( class_exists( 'MASE_CacheManager' ) ) {
			$cache = new MASE_CacheManager();
			$cache->clear_all();
		}

		// Log migration details.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'MASE: Migrated admin bar settings - added gradient, width, corner radius, floating margin, shadow, and submenu settings.' );
		}
	}

	/**
	 * Migrate dark mode settings for existing users.
	 *
	 * Task 17: Add migration logic for existing users.
	 * Requirement 10.5: Set initial mode based on current palette type.
	 *
	 * Detects current palette luminance and sets initial dark mode preference
	 * based on whether the palette is light or dark.
	 *
	 * @return void
	 */
	public static function maybe_migrate_dark_mode_settings() {
		// Check if migration has already been completed.
		$migration_completed = get_option( 'mase_dark_mode_migration_completed', false );

		if ( $migration_completed ) {
			return; // Migration already completed.
		}

		// Log migration start.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'MASE: Starting dark mode migration for existing users' );
		}

		// Execute dark mode migration.
		self::migrate_dark_mode_settings();

		// Mark migration as complete.
		update_option( 'mase_dark_mode_migration_completed', true );

		// Log migration completion.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'MASE: Dark mode migration completed successfully' );
		}
	}

	/**
	 * Execute dark mode settings migration.
	 *
	 * Task 17: Detect current palette luminance and set initial mode.
	 * Requirement 10.5: Set initial mode based on palette type.
	 *
	 * @return void
	 */
	private static function migrate_dark_mode_settings() {
		$settings_obj = new MASE_Settings();
		$settings     = $settings_obj->get_option();

		// Get current palette ID.
		$current_palette_id = isset( $settings['palettes']['current'] )
			? $settings['palettes']['current']
			: 'professional-blue';

		// Get palette data.
		$palette = $settings_obj->get_palette( $current_palette_id );

		// Determine initial mode based on palette type.
		$initial_mode = 'light'; // Default to light mode.

		if ( ! is_wp_error( $palette ) && isset( $palette['type'] ) ) {
			// Use palette type if available.
			$initial_mode = $palette['type'] === 'dark' ? 'dark' : 'light';

			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Dark mode migration - detected palette "%s" with type "%s", setting mode to "%s"',
						$current_palette_id,
						$palette['type'],
						$initial_mode
					)
				);
			}
		} else {
			// Fallback: Detect luminance from palette colors.
			$initial_mode = self::detect_palette_luminance( $palette, $current_palette_id );
		}

		// Ensure dark_light_toggle settings exist.
		if ( ! isset( $settings['dark_light_toggle'] ) ) {
			$defaults                      = $settings_obj->get_defaults();
			$settings['dark_light_toggle'] = $defaults['dark_light_toggle'];
		}

		// Set initial mode in settings.
		$settings['dark_light_toggle']['current_mode'] = $initial_mode;

		// Set appropriate palette for the mode.
		if ( $initial_mode === 'dark' ) {
			$settings['dark_light_toggle']['dark_palette'] = $current_palette_id;
		} else {
			$settings['dark_light_toggle']['light_palette'] = $current_palette_id;
		}

		// Save updated settings.
		$settings_obj->update_option( $settings );

		// Save preference to user meta for current user.
		$user_id = get_current_user_id();
		if ( $user_id > 0 ) {
			update_user_meta( $user_id, 'mase_dark_mode_preference', $initial_mode );

			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Dark mode migration - saved preference "%s" to user meta for user ID %d',
						$initial_mode,
						$user_id
					)
				);
			}
		}

		// Clear cache to force regeneration with new settings.
		if ( class_exists( 'MASE_CacheManager' ) ) {
			$cache = new MASE_CacheManager();
			$cache->clear_all();
		}
	}

	/**
	 * Detect palette luminance to determine if it's light or dark.
	 *
	 * Task 17: Detect current palette luminance.
	 * Requirement 10.5: Set initial mode based on palette type.
	 *
	 * Calculates relative luminance of the admin menu background color
	 * to determine if the palette is light or dark.
	 *
	 * @param array|WP_Error $palette    Palette data.
	 * @param string         $palette_id Palette ID for logging.
	 * @return string 'light' or 'dark'.
	 */
	private static function detect_palette_luminance( $palette, $palette_id ) {
		// Default to light mode if palette is invalid.
		if ( is_wp_error( $palette ) || ! isset( $palette['admin_menu']['bg_color'] ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Dark mode migration - palette "%s" invalid or missing bg_color, defaulting to light mode',
						$palette_id
					)
				);
			}
			return 'light';
		}

		$bg_color = $palette['admin_menu']['bg_color'];

		// Calculate relative luminance using WCAG formula.
		$luminance = self::calculate_relative_luminance( $bg_color );

		// Threshold: luminance < 0.3 is considered dark.
		$mode = $luminance < 0.3 ? 'dark' : 'light';

		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log(
				sprintf(
					'MASE: Dark mode migration - palette "%s" bg_color "%s" has luminance %.3f, setting mode to "%s"',
					$palette_id,
					$bg_color,
					$luminance,
					$mode
				)
			);
		}

		return $mode;
	}

	/**
	 * Calculate relative luminance of a color.
	 *
	 * Task 17: Detect current palette luminance.
	 * Uses WCAG 2.1 relative luminance formula.
	 *
	 * @param string $hex_color Hex color code (e.g., '#1a2b3c').
	 * @return float Relative luminance (0.0 to 1.0).
	 */
	private static function calculate_relative_luminance( $hex_color ) {
		// Remove # if present.
		$hex_color = ltrim( $hex_color, '#' );

		// Convert hex to RGB.
		if ( strlen( $hex_color ) === 3 ) {
			// Short hex format (#abc -> #aabbcc).
			$r = hexdec( str_repeat( substr( $hex_color, 0, 1 ), 2 ) );
			$g = hexdec( str_repeat( substr( $hex_color, 1, 1 ), 2 ) );
			$b = hexdec( str_repeat( substr( $hex_color, 2, 1 ), 2 ) );
		} else {
			// Full hex format (#aabbcc).
			$r = hexdec( substr( $hex_color, 0, 2 ) );
			$g = hexdec( substr( $hex_color, 2, 2 ) );
			$b = hexdec( substr( $hex_color, 4, 2 ) );
		}

		// Normalize RGB values to 0-1 range.
		$r = $r / 255.0;
		$g = $g / 255.0;
		$b = $b / 255.0;

		// Apply gamma correction.
		$r = ( $r <= 0.03928 ) ? $r / 12.92 : pow( ( $r + 0.055 ) / 1.055, 2.4 );
		$g = ( $g <= 0.03928 ) ? $g / 12.92 : pow( ( $g + 0.055 ) / 1.055, 2.4 );
		$b = ( $b <= 0.03928 ) ? $b / 12.92 : pow( ( $b + 0.055 ) / 1.055, 2.4 );

		// Calculate relative luminance using WCAG formula.
		$luminance = 0.2126 * $r + 0.7152 * $g + 0.0722 * $b;

		return $luminance;
	}

	/**
	 * Check if login customization settings exist.
	 *
	 * Determines whether the login_customization section exists in MASE settings.
	 * Used for version detection and migration decisions.
	 *
	 * Task 13.1: Version detection for login customization.
	 * Requirement 9.1: Check if login_customization settings exist.
	 *
	 * @since 1.3.0
	 * @access public
	 * @static
	 *
	 * @return bool True if login_customization settings exist, false otherwise.
	 */
	public static function has_login_customization() {
		$settings = get_option( 'mase_settings', array() );
		return isset( $settings['login_customization'] );
	}

	/**
	 * Migrate login customization settings for existing users.
	 *
	 * Checks if login customization migration is needed and executes it if necessary.
	 * Migration is run only once per installation. Handles migration from legacy
	 * login customization plugins if detected.
	 *
	 * Task 13: Add migration and backward compatibility for login customization.
	 * Task 13.1: Version detection.
	 * Task 13.2: Settings migration.
	 * Requirements: 9.1, 9.2, 9.3
	 *
	 * @since 1.3.0
	 * @access public
	 * @static
	 *
	 * @return void
	 *
	 * @see migrate_login_customization_settings() Internal method that performs migration.
	 * @see migrate_legacy_login_plugins() Helper method for legacy plugin migration.
	 */
	public static function maybe_migrate_login_customization_settings() {
		// Check if migration has already been completed.
		$migration_completed = get_option( 'mase_login_customization_migration_completed', false );

		if ( $migration_completed ) {
			return; // Migration already completed.
		}

		// Log migration start.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'MASE: Starting login customization migration' );
		}

		// Execute login customization migration.
		self::migrate_login_customization_settings();

		// Mark migration as complete.
		update_option( 'mase_login_customization_migration_completed', true );

		// Log migration completion.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'MASE: Login customization migration completed successfully' );
		}
	}

	/**
	 * Execute login customization settings migration.
	 *
	 * Task 13.2: Implement settings migration.
	 * Requirements: 9.2, 9.3
	 *
	 * Migrates legacy login settings from other plugins (optional) and
	 * ensures all login_customization defaults are set.
	 *
	 * @return void
	 */
	private static function migrate_login_customization_settings() {
		$settings_obj = new MASE_Settings();
		$settings     = $settings_obj->get_option();
		$defaults     = $settings_obj->get_defaults();

		// Check if login_customization section already exists.
		if ( ! isset( $settings['login_customization'] ) ) {
			// Initialize with defaults.
			$settings['login_customization'] = $defaults['login_customization'];

			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Login customization - initialized with default settings' );
			}
		} else {
			// Merge with defaults to ensure all keys exist.
			$settings['login_customization'] = array_merge(
				$defaults['login_customization'],
				$settings['login_customization']
			);

			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Login customization - merged existing settings with defaults' );
			}
		}

		// Optional: Detect and migrate legacy settings from other plugins.
		$legacy_migrated = self::migrate_legacy_login_plugins( $settings );

		if ( $legacy_migrated ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Login customization - migrated legacy plugin settings' );
			}
		}

		// Save updated settings.
		$settings_obj->update_option( $settings );

		// Clear cache to force regeneration with new settings.
		if ( class_exists( 'MASE_CacheManager' ) ) {
			$cache = new MASE_CacheManager();
			$cache->clear_all();

			// Also clear login CSS cache specifically.
			$cache->invalidate( 'login_css' );
		}
	}

	/**
	 * Detect and migrate legacy login settings from other plugins.
	 *
	 * Task 13.1: Detect legacy settings from other plugins (optional).
	 * Task 13.2: Migrate legacy settings to MASE format.
	 * Requirements: 9.1, 9.2, 9.3
	 *
	 * Checks for common login customization plugins and migrates their settings.
	 * Currently supports:
	 * - Custom Login Page Customizer
	 * - LoginPress
	 * - Colorlib Login Customizer
	 *
	 * @param array $settings Current MASE settings array (passed by reference).
	 * @return bool True if legacy settings were found and migrated, false otherwise.
	 */
	private static function migrate_legacy_login_plugins( &$settings ) {
		$migrated = false;

		// Check for Custom Login Page Customizer plugin.
		$clpc_settings = get_option( 'clpc_settings', false );
		if ( $clpc_settings && is_array( $clpc_settings ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Detected Custom Login Page Customizer settings' );
			}

			// Migrate logo.
			if ( ! empty( $clpc_settings['logo_url'] ) ) {
				$settings['login_customization']['logo_enabled'] = true;
				$settings['login_customization']['logo_url']     = $clpc_settings['logo_url'];
			}

			// Migrate background.
			if ( ! empty( $clpc_settings['background_image'] ) ) {
				$settings['login_customization']['background_type']  = 'image';
				$settings['login_customization']['background_image'] = $clpc_settings['background_image'];
			} elseif ( ! empty( $clpc_settings['background_color'] ) ) {
				$settings['login_customization']['background_type']  = 'color';
				$settings['login_customization']['background_color'] = $clpc_settings['background_color'];
			}

			// Migrate form colors.
			if ( ! empty( $clpc_settings['form_bg_color'] ) ) {
				$settings['login_customization']['form_bg_color'] = $clpc_settings['form_bg_color'];
			}

			$migrated = true;
		}

		// Check for LoginPress plugin.
		$loginpress_settings = get_option( 'loginpress_customization', false );
		if ( $loginpress_settings && is_array( $loginpress_settings ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Detected LoginPress settings' );
			}

			// Migrate logo.
			if ( ! empty( $loginpress_settings['setting_logo'] ) ) {
				$settings['login_customization']['logo_enabled'] = true;
				$settings['login_customization']['logo_url']     = $loginpress_settings['setting_logo'];
			}

			// Migrate background.
			if ( ! empty( $loginpress_settings['setting_background_image'] ) ) {
				$settings['login_customization']['background_type']  = 'image';
				$settings['login_customization']['background_image'] = $loginpress_settings['setting_background_image'];
			} elseif ( ! empty( $loginpress_settings['setting_background_color'] ) ) {
				$settings['login_customization']['background_type']  = 'color';
				$settings['login_customization']['background_color'] = $loginpress_settings['setting_background_color'];
			}

			$migrated = true;
		}

		// Check for Colorlib Login Customizer plugin.
		$colorlib_settings = get_option( 'colorlib_login_customizer', false );
		if ( $colorlib_settings && is_array( $colorlib_settings ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Detected Colorlib Login Customizer settings' );
			}

			// Migrate logo.
			if ( ! empty( $colorlib_settings['logo'] ) ) {
				$settings['login_customization']['logo_enabled'] = true;
				$settings['login_customization']['logo_url']     = $colorlib_settings['logo'];
			}

			// Migrate background.
			if ( ! empty( $colorlib_settings['background_image'] ) ) {
				$settings['login_customization']['background_type']  = 'image';
				$settings['login_customization']['background_image'] = $colorlib_settings['background_image'];
			}

			$migrated = true;
		}

		return $migrated;
	}

	/**
	 * Reset login customization settings to defaults.
	 *
	 * Resets only the login_customization section to default values while preserving
	 * all other MASE settings. Optionally clears uploaded logo and background files.
	 *
	 * Task 13.3: Add reset to defaults functionality.
	 * Requirement 9.2: Reset login customization section while preserving other MASE settings.
	 *
	 * @since 1.3.0
	 * @access public
	 * @static
	 *
	 * @param bool $clear_uploaded_files Optional. Whether to delete uploaded files. Default false.
	 * @return bool True on success, false on failure.
	 *
	 * @see clear_login_uploaded_files() Helper method to delete uploaded files.
	 *
	 * Security Notes:
	 * - Requires 'manage_options' capability (should be checked by caller)
	 * - Clears login CSS cache after reset
	 * - Logs reset operation for auditing
	 */
	public static function reset_login_customization( $clear_uploaded_files = false ) {
		$settings_obj = new MASE_Settings();
		$settings     = $settings_obj->get_option();
		$defaults     = $settings_obj->get_defaults();

		// Optional: Clear uploaded files before resetting.
		if ( $clear_uploaded_files && isset( $settings['login_customization'] ) ) {
			self::clear_login_uploaded_files( $settings['login_customization'] );
		}

		// Reset login_customization to defaults.
		$settings['login_customization'] = $defaults['login_customization'];

		// Save updated settings.
		$result = $settings_obj->update_option( $settings );

		// Clear cache to force regeneration.
		if ( class_exists( 'MASE_CacheManager' ) ) {
			$cache = new MASE_CacheManager();
			$cache->invalidate( 'login_css' );
		}

		// Log reset action.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log(
				sprintf(
					'MASE: Login customization reset to defaults (clear_files: %s)',
					$clear_uploaded_files ? 'true' : 'false'
				)
			);
		}

		return $result;
	}

	/**
	 * Clear uploaded files for login customization.
	 *
	 * Task 13.3: Clear uploaded files (optional).
	 * Requirement 9.2: Clear uploaded files when resetting.
	 *
	 * Removes logo and background image files from the uploads directory.
	 *
	 * @param array $login_settings Login customization settings.
	 * @return void
	 */
	private static function clear_login_uploaded_files( $login_settings ) {
		// Clear logo file.
		if ( ! empty( $login_settings['logo_url'] ) ) {
			$logo_path = self::get_file_path_from_url( $login_settings['logo_url'] );
			if ( $logo_path && file_exists( $logo_path ) ) {
				wp_delete_file( $logo_path );

				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE: Deleted login logo file: ' . $logo_path );
				}
			}
		}

		// Clear background image file.
		if ( ! empty( $login_settings['background_image'] ) ) {
			$bg_path = self::get_file_path_from_url( $login_settings['background_image'] );
			if ( $bg_path && file_exists( $bg_path ) ) {
				wp_delete_file( $bg_path );

				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE: Deleted login background file: ' . $bg_path );
				}
			}
		}
	}

	/**
	 * Convert file URL to file path.
	 *
	 * Helper method to convert WordPress upload URL to file system path.
	 *
	 * @param string $url File URL.
	 * @return string|false File path or false if conversion fails.
	 */
	private static function get_file_path_from_url( $url ) {
		// Get upload directory info.
		$upload_dir = wp_upload_dir();

		// Check if URL is in uploads directory.
		if ( strpos( $url, $upload_dir['baseurl'] ) === 0 ) {
			// Replace base URL with base path.
			$file_path = str_replace( $upload_dir['baseurl'], $upload_dir['basedir'], $url );
			return $file_path;
		}

		return false;
	}

	/**
	 * Check if button system migration is needed and execute if required.
	 *
	 * Task 9.1: Create migration method.
	 * Requirement 11.1: Add button defaults if not present.
	 *
	 * @since 1.3.0
	 * @access public
	 * @static
	 *
	 * @return void
	 */
	public static function maybe_migrate_to_button_system() {
		// Check if migration has already been completed.
		$migration_completed = get_option( 'mase_button_system_migration_completed', false );

		if ( $migration_completed ) {
			return; // Migration already completed.
		}

		// Log migration start.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'MASE: Starting Universal Button Styling System migration' );
		}

		// Execute button system migration.
		self::migrate_to_button_system();

		// Mark migration as complete.
		update_option( 'mase_button_system_migration_completed', true );

		// Log migration completion.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'MASE: Universal Button Styling System migration completed successfully' );
		}
	}

	/**
	 * Execute button system migration.
	 *
	 * Task 9.1: Add button defaults if not present.
	 * Task 9.1: Check current plugin version.
	 * Task 9.1: Update plugin version.
	 * Requirement 11.1: Add button defaults to existing settings.
	 *
	 * Adds default button styling settings to existing MASE installations
	 * while preserving all other settings. Creates the universal_buttons
	 * section with defaults for all 6 button types and 5 states.
	 *
	 * @since 1.3.0
	 * @access private
	 * @static
	 *
	 * @return void
	 */
	private static function migrate_to_button_system() {
		// Get current plugin version.
		$current_version = get_option( 'mase_version', '1.2.1' );

		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log(
				sprintf(
					'MASE: Button system migration - current version: %s',
					$current_version
				)
			);
		}

		// Get current settings.
		$settings_obj = new MASE_Settings();
		$settings     = $settings_obj->get_option();

		// Check if universal_buttons section already exists.
		if ( isset( $settings['universal_buttons'] ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Button system migration - universal_buttons section already exists, skipping' );
			}
			return;
		}

		// Get button defaults from MASE_Settings.
		$defaults = $settings_obj->get_defaults();

		// Add button defaults to settings.
		if ( isset( $defaults['universal_buttons'] ) ) {
			$settings['universal_buttons'] = $defaults['universal_buttons'];

			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Button system migration - added universal_buttons section with defaults' );
			}
		} else {
			// Fallback: Create button defaults inline if not available from get_defaults().
			$settings['universal_buttons'] = self::get_button_defaults_fallback();

			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Button system migration - used fallback button defaults' );
			}
		}

		// Save updated settings.
		$result = $settings_obj->update_option( $settings );

		if ( $result ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Button system migration - settings saved successfully' );
			}
		} elseif ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Button system migration - WARNING: settings save failed' );
		}

		// Clear cache to force regeneration with new button settings.
		if ( class_exists( 'MASE_CacheManager' ) ) {
			$cache = new MASE_CacheManager();
			$cache->clear_all();

			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Button system migration - cleared all caches' );
			}
		}

		// Update plugin version to indicate button system is available.
		$new_version = defined( 'MASE_VERSION' ) ? MASE_VERSION : '1.3.0';
		update_option( 'mase_version', $new_version );

		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log(
				sprintf(
					'MASE: Button system migration - updated plugin version to %s',
					$new_version
				)
			);
		}
	}

	/**
	 * Get fallback button defaults.
	 *
	 * Task 9.1: Provide fallback button defaults.
	 * Requirement 11.1: Ensure button defaults are available.
	 *
	 * Provides fallback button defaults in case MASE_Settings::get_defaults()
	 * doesn't include the universal_buttons section yet. This ensures migration
	 * can complete successfully even during development or partial updates.
	 *
	 * @since 1.3.0
	 * @access private
	 * @static
	 *
	 * @return array Button defaults for all types and states.
	 */
	private static function get_button_defaults_fallback() {
		// Default state properties that match WordPress core button styles.
		$default_state = array(
			'bg_type'             => 'solid',
			'bg_color'            => '#0073aa',
			'gradient_type'       => 'linear',
			'gradient_angle'      => 90,
			'gradient_colors'     => array(
				array(
					'color'    => '#0073aa',
					'position' => 0,
				),
				array(
					'color'    => '#005177',
					'position' => 100,
				),
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
			'primary'   => array(
				'normal'   => $default_state,
				'hover'    => array_merge( $default_state, array( 'bg_color' => '#005177' ) ),
				'active'   => array_merge( $default_state, array( 'bg_color' => '#004561' ) ),
				'focus'    => array_merge( $default_state, array( 'border_color' => '#00a0d2' ) ),
				'disabled' => array_merge(
					$default_state,
					array(
						'bg_color'   => '#cccccc',
						'text_color' => '#666666',
					)
				),
			),
			'secondary' => array(
				'normal'   => array_merge(
					$default_state,
					array(
						'bg_color'     => '#f7f7f7',
						'text_color'   => '#555555',
						'border_color' => '#cccccc',
					)
				),
				'hover'    => array_merge(
					$default_state,
					array(
						'bg_color'     => '#fafafa',
						'text_color'   => '#333333',
						'border_color' => '#999999',
					)
				),
				'active'   => array_merge(
					$default_state,
					array(
						'bg_color'     => '#eeeeee',
						'text_color'   => '#333333',
						'border_color' => '#999999',
					)
				),
				'focus'    => array_merge(
					$default_state,
					array(
						'bg_color'     => '#f7f7f7',
						'text_color'   => '#555555',
						'border_color' => '#00a0d2',
					)
				),
				'disabled' => array_merge(
					$default_state,
					array(
						'bg_color'     => '#f7f7f7',
						'text_color'   => '#a0a5aa',
						'border_color' => '#ddd',
					)
				),
			),
			'danger'    => array(
				'normal'   => array_merge(
					$default_state,
					array(
						'bg_color'     => '#dc3232',
						'text_color'   => '#ffffff',
						'border_color' => '#dc3232',
					)
				),
				'hover'    => array_merge(
					$default_state,
					array(
						'bg_color'     => '#c62d2d',
						'text_color'   => '#ffffff',
						'border_color' => '#c62d2d',
					)
				),
				'active'   => array_merge(
					$default_state,
					array(
						'bg_color'     => '#b02828',
						'text_color'   => '#ffffff',
						'border_color' => '#b02828',
					)
				),
				'focus'    => array_merge(
					$default_state,
					array(
						'bg_color'     => '#dc3232',
						'text_color'   => '#ffffff',
						'border_color' => '#ff6b6b',
					)
				),
				'disabled' => array_merge(
					$default_state,
					array(
						'bg_color'     => '#f7c5c5',
						'text_color'   => '#999999',
						'border_color' => '#f7c5c5',
					)
				),
			),
			'success'   => array(
				'normal'   => array_merge(
					$default_state,
					array(
						'bg_color'     => '#46b450',
						'text_color'   => '#ffffff',
						'border_color' => '#46b450',
					)
				),
				'hover'    => array_merge(
					$default_state,
					array(
						'bg_color'     => '#3fa045',
						'text_color'   => '#ffffff',
						'border_color' => '#3fa045',
					)
				),
				'active'   => array_merge(
					$default_state,
					array(
						'bg_color'     => '#388c3b',
						'text_color'   => '#ffffff',
						'border_color' => '#388c3b',
					)
				),
				'focus'    => array_merge(
					$default_state,
					array(
						'bg_color'     => '#46b450',
						'text_color'   => '#ffffff',
						'border_color' => '#7ed684',
					)
				),
				'disabled' => array_merge(
					$default_state,
					array(
						'bg_color'     => '#c5e8c7',
						'text_color'   => '#999999',
						'border_color' => '#c5e8c7',
					)
				),
			),
			'ghost'     => array(
				'normal'   => array_merge(
					$default_state,
					array(
						'bg_color'     => 'transparent',
						'text_color'   => '#0073aa',
						'border_width' => 0,
						'border_style' => 'none',
					)
				),
				'hover'    => array_merge(
					$default_state,
					array(
						'bg_color'     => 'transparent',
						'text_color'   => '#005177',
						'border_width' => 0,
						'border_style' => 'none',
					)
				),
				'active'   => array_merge(
					$default_state,
					array(
						'bg_color'     => 'transparent',
						'text_color'   => '#004561',
						'border_width' => 0,
						'border_style' => 'none',
					)
				),
				'focus'    => array_merge(
					$default_state,
					array(
						'bg_color'     => 'transparent',
						'text_color'   => '#0073aa',
						'border_width' => 0,
						'border_style' => 'none',
					)
				),
				'disabled' => array_merge(
					$default_state,
					array(
						'bg_color'     => 'transparent',
						'text_color'   => '#a0a5aa',
						'border_width' => 0,
						'border_style' => 'none',
					)
				),
			),
			'tabs'      => array(
				'normal'   => array_merge(
					$default_state,
					array(
						'bg_color'     => '#f1f1f1',
						'text_color'   => '#555555',
						'border_color' => '#cccccc',
						'border_width' => 1,
					)
				),
				'hover'    => array_merge(
					$default_state,
					array(
						'bg_color'     => '#ffffff',
						'text_color'   => '#333333',
						'border_color' => '#cccccc',
						'border_width' => 1,
					)
				),
				'active'   => array_merge(
					$default_state,
					array(
						'bg_color'     => '#ffffff',
						'text_color'   => '#000000',
						'border_color' => '#cccccc',
						'border_width' => 1,
					)
				),
				'focus'    => array_merge(
					$default_state,
					array(
						'bg_color'     => '#f1f1f1',
						'text_color'   => '#555555',
						'border_color' => '#00a0d2',
						'border_width' => 1,
					)
				),
				'disabled' => array_merge(
					$default_state,
					array(
						'bg_color'     => '#f1f1f1',
						'text_color'   => '#a0a5aa',
						'border_color' => '#ddd',
						'border_width' => 1,
					)
				),
			),
		);
	}
}
