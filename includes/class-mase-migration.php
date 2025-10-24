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
			return;
		}
		
		// Execute migration.
		self::migrate();
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
		$settings = new MASE_Settings();
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
		$current_version = defined( 'MASE_VERSION' ) ? MASE_VERSION : '1.2.1';
		
		// Task 15.2: Compare versions - run migration if settings version is older.
		if ( version_compare( $stored_settings_version, '1.2.1', '>=' ) ) {
			return; // Migration already completed for this version.
		}
		
		// Task 15.2: Log migration start.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( sprintf(
				'MASE: Starting admin bar enhancement migration from settings version %s to %s',
				$stored_settings_version,
				$current_version
			) );
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
			error_log( sprintf(
				'MASE: Admin Bar comprehensive enhancement migration completed successfully. Settings version updated to %s',
				$current_version
			) );
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
		$defaults = $settings_obj->get_defaults();
		
		// Ensure admin_bar array exists.
		if ( ! isset( $settings['admin_bar'] ) ) {
			$settings['admin_bar'] = array();
		}
		
		// NEW: Add gradient background settings (Requirement 5.1, 5.2, 5.3, 5.4, 5.5).
		$gradient_defaults = array(
			'bg_type' => 'solid',
			'gradient_type' => 'linear',
			'gradient_angle' => 90,
			'gradient_colors' => array(
				array( 'color' => '#23282d', 'position' => 0 ),
				array( 'color' => '#32373c', 'position' => 100 ),
			),
		);
		
		foreach ( $gradient_defaults as $key => $value ) {
			if ( ! isset( $settings['admin_bar'][ $key ] ) ) {
				$settings['admin_bar'][ $key ] = $value;
			}
		}
		
		// NEW: Add width controls (Requirement 11.1, 11.2).
		$width_defaults = array(
			'width_unit' => 'percent',
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
			'border_radius' => 0,
			'border_radius_tl' => 0,
			'border_radius_tr' => 0,
			'border_radius_bl' => 0,
			'border_radius_br' => 0,
		);
		
		foreach ( $border_radius_defaults as $key => $value ) {
			if ( ! isset( $settings['admin_bar'][ $key ] ) ) {
				$settings['admin_bar'][ $key ] = $value;
			}
		}
		
		// NEW: Add individual floating margin controls (Requirement 12.1, 12.2).
		$floating_margin_defaults = array(
			'floating_margin_mode' => 'uniform',
			'floating_margin' => 8,
			'floating_margin_top' => 8,
			'floating_margin_right' => 8,
			'floating_margin_bottom' => 8,
			'floating_margin_left' => 8,
		);
		
		foreach ( $floating_margin_defaults as $key => $value ) {
			if ( ! isset( $settings['admin_bar'][ $key ] ) ) {
				$settings['admin_bar'][ $key ] = $value;
			}
		}
		
		// NEW: Add advanced shadow controls (Requirement 10.1, 10.2, 10.3, 10.4).
		$shadow_defaults = array(
			'shadow_mode' => 'preset',
			'shadow_preset' => 'none',
			'shadow_h_offset' => 0,
			'shadow_v_offset' => 4,
			'shadow_blur' => 8,
			'shadow_spread' => 0,
			'shadow_color' => '#000000',
			'shadow_opacity' => 0.15,
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
			'font_family' => 'system',
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
}
