<?php
/**
 * Plugin Name: Modern Admin Styler Enterprise
 * Plugin URI: https://github.com/m3n3sx/MASE
 * Description: Enterprise-grade WordPress admin styling plugin with clean, maintainable architecture. Features: 10 color palettes, 11 templates, advanced visual effects, mobile optimization, import/export, backup/restore, live preview.
 * Version: 1.2.0
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * Author: MASE Development Team
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: modern-admin-styler
 * Domain Path: /languages
 *
 * Changelog:
 * 1.2.0 - Major upgrade with 10 color palettes, 11 templates, visual effects system,
 *         mobile optimization, backup/restore, keyboard shortcuts, accessibility features,
 *         auto palette switching, and comprehensive settings migration from v1.1.0
 * 1.1.0 - Initial release with 5 color palettes, import/export, caching, live preview
 *
 * @package ModernAdminStyler
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Current plugin version.
 */
define( 'MASE_VERSION', '1.2.0' );

/**
 * Plugin directory path.
 */
define( 'MASE_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Plugin directory URL.
 */
define( 'MASE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * PSR-4 Autoloader for MASE classes.
 *
 * Automatically loads class files from the includes directory when a class
 * is instantiated. Follows PSR-4 naming conventions.
 *
 * @param string $class_name The fully-qualified class name.
 * @return void
 */
function mase_autoloader( $class_name ) {
	// Only autoload classes in the MASE namespace.
	if ( strpos( $class_name, 'MASE_' ) !== 0 ) {
		return;
	}

	// Convert class name to file name (MASE_Settings -> class-mase-settings.php).
	$file = 'class-' . strtolower( str_replace( '_', '-', $class_name ) ) . '.php';
	$path = MASE_PLUGIN_DIR . 'includes/' . $file;

	// Load the class file if it exists.
	if ( file_exists( $path ) ) {
		require_once $path;
	}
}

// Register the autoloader.
spl_autoload_register( 'mase_autoloader' );

/**
 * Manually require critical classes that need early loading.
 * These classes are loaded before WordPress hooks to ensure proper initialization.
 */
require_once MASE_PLUGIN_DIR . 'includes/class-mase-migration.php';
require_once MASE_PLUGIN_DIR . 'includes/class-mase-mobile-optimizer.php';

/**
 * Run migration check on plugin load.
 * Requirement 10.1: Detect current version and execute migration if needed.
 * Requirement 10.2: Execute migration script automatically when upgrading from v1.1.0.
 */
add_action( 'plugins_loaded', 'mase_check_migration', 5 );

/**
 * Check and run migration if needed.
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 *
 * @return void
 */
function mase_check_migration() {
	// Only run migration check in admin context.
	if ( ! is_admin() ) {
		return;
	}
	
	// Run migration check (will only execute if version upgrade detected).
	MASE_Migration::maybe_migrate();
}

/**
 * Plugin activation hook.
 *
 * Checks WordPress version requirements and initializes default settings.
 * Prevents activation if WordPress version is below 5.0.
 * Requirement 15.1: Schedule hourly cron job for auto palette switching.
 *
 * @return void
 */
function mase_activate() {
	// Check WordPress version requirement.
	if ( version_compare( get_bloginfo( 'version' ), '5.0', '<' ) ) {
		deactivate_plugins( plugin_basename( __FILE__ ) );
		wp_die(
			esc_html__( 'Modern Admin Styler Enterprise requires WordPress 5.0 or higher.', 'modern-admin-styler' ),
			esc_html__( 'Plugin Activation Error', 'modern-admin-styler' ),
			array( 'back_link' => true )
		);
	}

	// Initialize default settings on activation.
	$settings = new MASE_Settings();
	$settings->initialize_defaults();
	
	// Schedule hourly cron job for auto palette switching (Requirement 15.1).
	if ( ! wp_next_scheduled( 'mase_auto_palette_switch' ) ) {
		wp_schedule_event( time(), 'hourly', 'mase_auto_palette_switch' );
	}
}

// Register activation hook.
register_activation_hook( __FILE__, 'mase_activate' );

/**
 * Plugin deactivation hook.
 *
 * Cleans up transients but preserves settings in options table.
 * Requirement 15.1: Clear scheduled cron job on deactivation.
 *
 * @return void
 */
function mase_deactivate() {
	// Clean up all MASE caches.
	$cache = new MASE_CacheManager();
	$cache->clear_all();
	
	// Clear scheduled cron job (Requirement 15.1).
	$timestamp = wp_next_scheduled( 'mase_auto_palette_switch' );
	if ( $timestamp ) {
		wp_unschedule_event( $timestamp, 'mase_auto_palette_switch' );
	}
}

// Register deactivation hook.
register_deactivation_hook( __FILE__, 'mase_deactivate' );

/**
 * Initialize the plugin.
 *
 * Instantiates core classes and sets up the plugin functionality.
 * Only runs in admin context.
 *
 * @return void
 */
function mase_init() {
	// Only initialize in admin context.
	if ( ! is_admin() ) {
		return;
	}

	// Instantiate core classes with dependency injection.
	$settings  = new MASE_Settings();
	$generator = new MASE_CSS_Generator();
	$cache     = new MASE_CacheManager();
	$admin     = new MASE_Admin( $settings, $generator, $cache );
	
	// Initialize mobile optimizer (Requirement 16.1, 16.4).
	$mobile_optimizer = new MASE_Mobile_Optimizer();
	
	// Display degradation notice if applicable (Requirement 16.4).
	add_action( 'admin_notices', array( $mobile_optimizer, 'display_degradation_notice' ) );
	
	// Enqueue detection script (Requirement 16.1).
	add_action( 'admin_enqueue_scripts', array( $mobile_optimizer, 'enqueue_detection_script' ) );
	
	// Register AJAX handler for low-power detection (Requirement 16.1).
	add_action( 'wp_ajax_mase_store_low_power_detection', array( $mobile_optimizer, 'handle_store_low_power_detection' ) );
	
	// Register AJAX handler for device capabilities reporting.
	add_action( 'wp_ajax_mase_report_device_capabilities', array( $mobile_optimizer, 'handle_report_device_capabilities' ) );
}

// Hook into plugins_loaded to initialize the plugin.
add_action( 'plugins_loaded', 'mase_init' );

/**
 * Cron callback for auto palette switching.
 *
 * Checks if auto-switching is enabled and applies appropriate palette based on time.
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5
 *
 * @return void
 */
function mase_auto_palette_switch_callback() {
	$settings = new MASE_Settings();
	
	// Check if auto-switching is enabled (Requirement 15.2).
	$options = $settings->get_option();
	if ( ! isset( $options['advanced']['auto_palette_switch'] ) || 
	     ! $options['advanced']['auto_palette_switch'] ) {
		return;
	}
	
	// Execute auto palette switch (Requirements 15.3, 15.4).
	$result = $settings->auto_switch_palette();
	
	// Log palette switch for debugging (Requirement 15.5).
	if ( $result && defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		$current_hour = intval( current_time( 'H' ) );
		$palette_id = $settings->get_palette_for_time( $current_hour );
		error_log( sprintf(
			'MASE: Auto palette switch executed at %s. Applied palette: %s',
			current_time( 'Y-m-d H:i:s' ),
			$palette_id
		) );
	}
}

// Register cron callback (Requirement 15.1).
add_action( 'mase_auto_palette_switch', 'mase_auto_palette_switch_callback' );
