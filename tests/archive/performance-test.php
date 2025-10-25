<?php
/**
 * Performance Test for MASE CSS Generation
 *
 * Tests CSS generation speed to ensure <100ms target is met.
 *
 * @package Modern_Admin_Styler_Enterprise
 */

// Load WordPress
require_once dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/wp-load.php';

// Load MASE classes
require_once dirname( __DIR__ ) . '/includes/class-mase-settings.php';
require_once dirname( __DIR__ ) . '/includes/class-mase-css-generator.php';

echo "=== MASE Performance Test ===\n\n";

// Initialize
$settings = new MASE_Settings();
$generator = new MASE_CSS_Generator();
$test_settings = $settings->get_defaults();

// Test 1: CSS Generation Speed
echo "Test 1: CSS Generation Speed\n";
echo "Target: <100ms\n";

$iterations = 100;
$total_time = 0;

for ( $i = 0; $i < $iterations; $i++ ) {
	$start = microtime( true );
	$css = $generator->generate( $test_settings );
	$end = microtime( true );
	$total_time += ( $end - $start ) * 1000; // Convert to milliseconds
}

$avg_time = $total_time / $iterations;
$status = $avg_time < 100 ? '✅ PASS' : '❌ FAIL';

echo "Average time: " . number_format( $avg_time, 2 ) . "ms\n";
echo "Status: $status\n\n";

// Test 2: CSS Minification Speed
echo "Test 2: CSS Minification Speed\n";
$css = $generator->generate( $test_settings );

$start = microtime( true );
$minified = $generator->minify( $css );
$end = microtime( true );
$minify_time = ( $end - $start ) * 1000;

echo "Minification time: " . number_format( $minify_time, 2 ) . "ms\n";
echo "Original size: " . strlen( $css ) . " bytes\n";
echo "Minified size: " . strlen( $minified ) . " bytes\n";
echo "Reduction: " . number_format( ( 1 - strlen( $minified ) / strlen( $css ) ) * 100, 1 ) . "%\n\n";

// Test 3: Memory Usage
echo "Test 3: Memory Usage\n";
echo "Target: <10MB plugin load\n";

$mem_start = memory_get_usage();
$css = $generator->generate( $test_settings );
$mem_end = memory_get_usage();
$mem_used = ( $mem_end - $mem_start ) / 1024 / 1024; // Convert to MB

$mem_status = $mem_used < 2 ? '✅ PASS' : '❌ FAIL';
echo "Memory used for generation: " . number_format( $mem_used, 2 ) . "MB\n";
echo "Status: $mem_status\n\n";

echo "=== Test Complete ===\n";
