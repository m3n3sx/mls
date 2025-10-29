<?php
/**
 * CSS Generation Benchmark
 * 
 * Measures CSS generation performance
 * Target: <100ms
 */

// Load WordPress
$wp_load = dirname( __FILE__ ) . '/../../../../../wp-load.php';
if ( ! file_exists( $wp_load ) ) {
	$wp_load = dirname( __FILE__ ) . '/../../../../../../wp-load.php';
}
if ( ! file_exists( $wp_load ) ) {
	die( "Error: Cannot find wp-load.php\n" );
}
require_once $wp_load;

// Load MASE classes
require_once dirname( __FILE__ ) . '/../../includes/class-mase-settings.php';
require_once dirname( __FILE__ ) . '/../../includes/class-mase-css-generator.php';
require_once dirname( __FILE__ ) . '/../../includes/class-mase-cachemanager.php';

echo "========================================\n";
echo "CSS Generation Benchmark\n";
echo "========================================\n\n";

// Initialize classes
$settings  = new MASE_Settings();
$generator = new MASE_CSS_Generator();

// Get current settings
$options = $settings->get_option();

// Clear cache to test actual generation time
$cache = new MASE_CacheManager();
$cache->clear_all();

// Warm up (first run may be slower)
$generator->generate( $options );

// Run benchmark (10 iterations)
$iterations = 10;
$times      = array();

echo "Running $iterations iterations...\n\n";

for ( $i = 1; $i <= $iterations; $i++ ) {
	$start = microtime( true );
	$css   = $generator->generate( $options );
	$end   = microtime( true );
	
	$time_ms = ( $end - $start ) * 1000;
	$times[] = $time_ms;
	
	printf( "Iteration %2d: %6.2f ms\n", $i, $time_ms );
}

echo "\n";
echo "========================================\n";
echo "Results:\n";
echo "========================================\n";

$avg = array_sum( $times ) / count( $times );
$min = min( $times );
$max = max( $times );

printf( "Average: %.2f ms\n", $avg );
printf( "Min:     %.2f ms\n", $min );
printf( "Max:     %.2f ms\n", $max );
printf( "CSS Size: %d bytes\n", strlen( $css ) );

echo "\n";

// Check against target
$target = 100;
if ( $avg < $target ) {
	echo "✓ PASS: Average time ({$avg}ms) is below target ({$target}ms)\n";
	exit( 0 );
} else {
	echo "✗ FAIL: Average time ({$avg}ms) exceeds target ({$target}ms)\n";
	exit( 1 );
}
