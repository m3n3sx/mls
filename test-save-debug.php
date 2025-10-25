<?php
/**
 * Debug script for testing settings save
 * 
 * Usage: wp eval-file test-save-debug.php
 */

// Load WordPress
require_once __DIR__ . '/../../../wp-load.php';

// Enable error display
error_reporting( E_ALL );
ini_set( 'display_errors', 1 );

echo "=== MASE Settings Save Debug Test ===\n\n";

// Check if classes exist
echo "1. Checking classes...\n";
echo "   MASE_Settings: " . ( class_exists( 'MASE_Settings' ) ? "✓ EXISTS" : "✗ NOT FOUND" ) . "\n";
echo "   MASE_Admin: " . ( class_exists( 'MASE_Admin' ) ? "✓ EXISTS" : "✗ NOT FOUND" ) . "\n";
echo "   MASE_CSS_Generator: " . ( class_exists( 'MASE_CSS_Generator' ) ? "✓ EXISTS" : "✗ NOT FOUND" ) . "\n";
echo "   MASE_CacheManager: " . ( class_exists( 'MASE_CacheManager' ) ? "✓ EXISTS" : "✗ NOT FOUND" ) . "\n";
echo "\n";

// Test settings class
echo "2. Testing MASE_Settings...\n";
$settings = new MASE_Settings();

// Test data - minimal valid settings
$test_data = array(
	'admin_bar' => array(
		'bg_color'   => '#1F2937',
		'text_color' => '#F9FAFB',
		'height'     => 32,
	),
);

echo "   Test data: " . json_encode( $test_data ) . "\n\n";

// Test validation
echo "3. Testing validation...\n";
$validated = $settings->validate( $test_data );

if ( is_wp_error( $validated ) ) {
	echo "   ✗ VALIDATION FAILED\n";
	echo "   Error: " . $validated->get_error_message() . "\n";
	echo "   Details:\n";
	print_r( $validated->get_error_data() );
	exit( 1 );
} else {
	echo "   ✓ VALIDATION PASSED\n";
	echo "   Validated keys: " . implode( ', ', array_keys( $validated ) ) . "\n\n";
}

// Test update_option
echo "4. Testing update_option...\n";
$result = $settings->update_option( $test_data );

if ( $result ) {
	echo "   ✓ UPDATE SUCCESSFUL\n";
} else {
	echo "   ✗ UPDATE FAILED\n";
	exit( 1 );
}

echo "\n";
echo "5. Verifying saved data...\n";
$saved = $settings->get_option();
echo "   Saved admin_bar bg_color: " . $saved['admin_bar']['bg_color'] . "\n";
echo "   Saved admin_bar text_color: " . $saved['admin_bar']['text_color'] . "\n";
echo "   Saved admin_bar height: " . $saved['admin_bar']['height'] . "\n";

echo "\n=== TEST COMPLETED SUCCESSFULLY ===\n";
