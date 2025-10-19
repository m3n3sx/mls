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
		
		// If version is already 1.2.0 or higher, no migration needed.
		if ( version_compare( $stored_version, '1.2.0', '>=' ) ) {
			return;
		}
		
		// Execute migration.
		self::migrate();
	}

	/**
	 * Execute migration workflow.
	 *
	 * Requirements: 10.2, 10.3, 10.4, 10.5
	 *
	 * @return void
	 */
	private static function migrate() {
		// Backup old settings (Requirement 10.3).
		self::backup_old_settings();
		
		// Transform settings structure (Requirement 10.4).
		self::transform_settings();
		
		// Update version number (Requirement 10.5).
		update_option( 'mase_version', '1.2.0' );
		
		// Log migration completion.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'MASE: Migration to v1.2.0 completed successfully.' );
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
}
