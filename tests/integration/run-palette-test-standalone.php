<?php
/**
 * Standalone Test Runner for Palette Activation Integration Tests
 *
 * This script loads WordPress with minimal plugins to avoid conflicts,
 * then runs the palette activation integration tests.
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.2.0
 */

// Determine WordPress root directory.
$wp_root = dirname( dirname( dirname( __DIR__ ) ) );

// Check if WordPress exists.
if ( ! file_exists( $wp_root . '/wp-load.php' ) ) {
	echo "Error: WordPress not found at: $wp_root\n";
	echo "Please run this script from the plugin directory.\n";
	exit( 1 );
}

// Define ABSPATH before loading WordPress.
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', $wp_root . '/' );
}

// Disable problematic plugins during test.
if ( ! defined( 'WP_PLUGIN_DIR' ) ) {
	define( 'WP_PLUGIN_DIR', $wp_root . '/wp-content/plugins' );
}

// Load WordPress with error suppression for plugin conflicts.
error_reporting( E_ERROR | E_PARSE );

try {
	// Load WordPress.
	require_once $wp_root . '/wp-load.php';
	
	// Restore error reporting.
	error_reporting( E_ALL );
	
	echo "WordPress loaded successfully.\n\n";
	
	// Check if our plugin classes are available.
	$required_files = array(
		ABSPATH . 'wp-content/plugins/woow-admin/includes/class-mase-settings.php',
		ABSPATH . 'wp-content/plugins/woow-admin/includes/class-mase-css-generator.php',
		ABSPATH . 'wp-content/plugins/woow-admin/includes/class-mase-cachemanager.php',
		ABSPATH . 'wp-content/plugins/woow-admin/includes/class-mase-admin.php',
	);
	
	foreach ( $required_files as $file ) {
		if ( ! file_exists( $file ) ) {
			echo "Error: Required file not found: $file\n";
			exit( 1 );
		}
	}
	
	// Load the test file.
	$test_file = __DIR__ . '/test-palette-activation-flow.php';
	
	if ( ! file_exists( $test_file ) ) {
		echo "Error: Test file not found: $test_file\n";
		exit( 1 );
	}
	
	// Set the flag to run tests.
	$_GET['run_palette_activation_tests'] = '1';
	
	// Include and run the test.
	require_once $test_file;
	
} catch ( Exception $e ) {
	echo "Error loading WordPress: " . $e->getMessage() . "\n";
	exit( 1 );
}
