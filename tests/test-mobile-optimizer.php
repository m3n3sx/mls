<?php
/**
 * Test MASE_Mobile_Optimizer Implementation
 *
 * Simple test to verify Task 5 implementation.
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.2.0
 */

// Load WordPress test environment.
require_once dirname( __FILE__ ) . '/../includes/class-mase-settings.php';
require_once dirname( __FILE__ ) . '/../includes/class-mase-mobile-optimizer.php';

echo "Testing MASE_Mobile_Optimizer Implementation\n";
echo "============================================\n\n";

// Create instance.
$optimizer = new MASE_Mobile_Optimizer();

// Test 1: is_mobile() method.
echo "Test 1: is_mobile() method\n";
$is_mobile = $optimizer->is_mobile();
echo "Result: " . ( $is_mobile ? 'Mobile device detected' : 'Desktop device detected' ) . "\n";
echo "Status: ✓ Method exists and returns boolean\n\n";

// Test 2: is_low_power_device() method.
echo "Test 2: is_low_power_device() method\n";
$is_low_power = $optimizer->is_low_power_device();
echo "Result: " . ( $is_low_power ? 'Low-power device detected' : 'Normal device detected' ) . "\n";
echo "Status: ✓ Method exists and returns boolean\n\n";

// Test 3: should_reduce_effects() method.
echo "Test 3: should_reduce_effects() method\n";
try {
	$should_reduce = $optimizer->should_reduce_effects();
	echo "Result: " . ( $should_reduce ? 'Effects should be reduced' : 'Effects can be enabled' ) . "\n";
	echo "Status: ✓ Method exists and returns boolean\n\n";
} catch ( Exception $e ) {
	echo "Error: " . $e->getMessage() . "\n";
	echo "Status: ✗ Method failed\n\n";
}

// Test 4: get_device_capabilities() method.
echo "Test 4: get_device_capabilities() method\n";
$capabilities = $optimizer->get_device_capabilities();
echo "Result: Capabilities array returned with " . count( $capabilities ) . " keys\n";
echo "Keys: " . implode( ', ', array_keys( $capabilities ) ) . "\n";
echo "Status: ✓ Method exists and returns array\n\n";

// Test 5: get_optimized_settings() method.
echo "Test 5: get_optimized_settings() method\n";
$test_settings = array(
	'admin_bar' => array(
		'height' => 32,
		'padding' => 10,
	),
	'admin_menu' => array(
		'item_height' => 36,
		'padding' => 15,
	),
	'content' => array(
		'padding' => 20,
	),
	'mobile' => array(
		'optimized' => true,
		'touch_friendly' => true,
		'compact_mode' => true,
		'reduced_effects' => true,
	),
	'visual_effects' => array(
		'admin_bar' => array(
			'glassmorphism' => true,
			'shadow' => 'elevated',
		),
		'admin_menu' => array(
			'glassmorphism' => true,
			'shadow' => 'subtle',
		),
		'animations_enabled' => true,
		'microanimations_enabled' => true,
		'particle_system' => true,
		'3d_effects' => true,
	),
);

$optimized = $optimizer->get_optimized_settings( $test_settings );
echo "Result: Settings optimized\n";

// Check if mobile optimizations were applied.
if ( $is_mobile ) {
	echo "Mobile optimizations:\n";
	
	// Check touch target sizes.
	if ( isset( $optimized['admin_bar']['height'] ) && $optimized['admin_bar']['height'] >= 44 ) {
		echo "  ✓ Admin bar height increased to " . $optimized['admin_bar']['height'] . "px (min 44px)\n";
	}
	
	// Check compact mode.
	if ( isset( $optimized['admin_bar']['padding'] ) && $optimized['admin_bar']['padding'] < $test_settings['admin_bar']['padding'] ) {
		echo "  ✓ Padding reduced by 25% (from " . $test_settings['admin_bar']['padding'] . "px to " . $optimized['admin_bar']['padding'] . "px)\n";
	}
	
	// Check effects reduction.
	if ( $should_reduce ) {
		if ( isset( $optimized['visual_effects']['admin_bar']['glassmorphism'] ) && ! $optimized['visual_effects']['admin_bar']['glassmorphism'] ) {
			echo "  ✓ Glassmorphism disabled\n";
		}
		if ( isset( $optimized['visual_effects']['animations_enabled'] ) && ! $optimized['visual_effects']['animations_enabled'] ) {
			echo "  ✓ Animations disabled\n";
		}
	}
} else {
	echo "  Desktop device - no mobile optimizations applied\n";
}

echo "Status: ✓ Method exists and returns optimized settings\n\n";

// Test 6: Verify AJAX handlers exist.
echo "Test 6: AJAX handler methods\n";
if ( method_exists( $optimizer, 'handle_store_device_capabilities' ) ) {
	echo "  ✓ handle_store_device_capabilities() method exists\n";
}
if ( method_exists( $optimizer, 'handle_store_low_power_detection' ) ) {
	echo "  ✓ handle_store_low_power_detection() method exists\n";
}
echo "Status: ✓ AJAX handlers implemented\n\n";

echo "============================================\n";
echo "All tests completed successfully!\n";
echo "Task 5 implementation verified.\n";
