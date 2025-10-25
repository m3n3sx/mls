<?php
/**
 * Integration Test for MASE
 *
 * Tests the complete workflow: Settings → CSS Generation → Caching
 *
 * @package Modern_Admin_Styler_Enterprise
 */

// Load WordPress
require_once dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/wp-load.php';

// Load MASE classes
require_once dirname( __DIR__ ) . '/includes/class-mase-settings.php';
require_once dirname( __DIR__ ) . '/includes/class-mase-css-generator.php';
require_once dirname( __DIR__ ) . '/includes/class-mase-cache.php';

echo "=== MASE Integration Test ===\n\n";

// Test 1: Settings Save/Load
echo "Test 1: Settings Save and Load\n";
$settings = new MASE_Settings();

$test_data = array(
	'admin_bar' => array(
		'bg_color' => '#ff0000',
		'text_color' => '#ffffff',
		'height' => 40,
	),
	'admin_menu' => array(
		'bg_color' => '#00ff00',
		'text_color' => '#000000',
		'hover_bg_color' => '#0000ff',
		'hover_text_color' => '#ffffff',
		'width' => 200,
	),
	'performance' => array(
		'enable_minification' => true,
		'cache_duration' => 7200,
	),
);

$save_result = $settings->update_option( $test_data );
$loaded_data = $settings->get_option();

$test1_pass = $save_result && $loaded_data['admin_bar']['bg_color'] === '#ff0000';
echo "Save result: " . ( $save_result ? 'Success' : 'Failed' ) . "\n";
echo "Load result: " . ( $loaded_data['admin_bar']['bg_color'] === '#ff0000' ? 'Success' : 'Failed' ) . "\n";
echo "Status: " . ( $test1_pass ? '✅ PASS' : '❌ FAIL' ) . "\n\n";

// Test 2: CSS Generation
echo "Test 2: CSS Generation\n";
$generator = new MASE_CSS_Generator();
$css = $generator->generate( $loaded_data );

$has_admin_bar = strpos( $css, '#wpadminbar' ) !== false;
$has_admin_menu = strpos( $css, '#adminmenu' ) !== false;
$has_colors = strpos( $css, '#ff0000' ) !== false;

echo "Contains admin bar styles: " . ( $has_admin_bar ? 'Yes' : 'No' ) . "\n";
echo "Contains admin menu styles: " . ( $has_admin_menu ? 'Yes' : 'No' ) . "\n";
echo "Contains custom colors: " . ( $has_colors ? 'Yes' : 'No' ) . "\n";
echo "Status: " . ( $has_admin_bar && $has_admin_menu && $has_colors ? '✅ PASS' : '❌ FAIL' ) . "\n\n";

// Test 3: Caching
echo "Test 3: CSS Caching\n";
$cache = new MASE_Cache();

// Clear any existing cache
$cache->invalidate_cache();

// Set cache
$cache_set = $cache->set_cached_css( $css, 3600 );
$cached_css = $cache->get_cached_css();

$cache_works = $cache_set && $cached_css === $css;
echo "Cache set: " . ( $cache_set ? 'Success' : 'Failed' ) . "\n";
echo "Cache retrieve: " . ( $cached_css === $css ? 'Success' : 'Failed' ) . "\n";
echo "Status: " . ( $cache_works ? '✅ PASS' : '❌ FAIL' ) . "\n\n";

// Test 4: Cache Invalidation
echo "Test 4: Cache Invalidation\n";
$invalidate_result = $cache->invalidate_cache();
$after_invalidate = $cache->get_cached_css();

$invalidate_works = $invalidate_result && $after_invalidate === false;
echo "Invalidation: " . ( $invalidate_result ? 'Success' : 'Failed' ) . "\n";
echo "Cache cleared: " . ( $after_invalidate === false ? 'Yes' : 'No' ) . "\n";
echo "Status: " . ( $invalidate_works ? '✅ PASS' : '❌ FAIL' ) . "\n\n";

// Test 5: Validation
echo "Test 5: Input Validation\n";
$invalid_data = array(
	'admin_bar' => array(
		'bg_color' => 'invalid-color',
		'text_color' => '#ffffff',
		'height' => 1000, // Out of range
	),
);

$validated = $settings->validate( $invalid_data );
$validation_works = is_wp_error( $validated );

echo "Invalid color rejected: " . ( $validation_works ? 'Yes' : 'No' ) . "\n";
echo "Status: " . ( $validation_works ? '✅ PASS' : '❌ FAIL' ) . "\n\n";

// Cleanup - restore defaults
$settings->reset_to_defaults();

echo "=== Test Complete ===\n";
