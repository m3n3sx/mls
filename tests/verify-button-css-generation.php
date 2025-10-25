<?php
/**
 * Verification script for Universal Button Styling System CSS Generation
 * 
 * Tests that all button styling methods are working correctly.
 */

// Load WordPress test environment
require_once __DIR__ . '/../includes/class-mase-settings.php';
require_once __DIR__ . '/../includes/class-mase-css-generator.php';
require_once __DIR__ . '/../includes/class-mase-cache.php';

echo "=== Universal Button Styling System CSS Generation Verification ===\n\n";

// Create test settings with button configuration
$test_settings = array(
	'universal_buttons' => array(
		'primary' => array(
			'normal' => array(
				'bg_type' => 'solid',
				'bg_color' => '#0073aa',
				'gradient_type' => 'linear',
				'gradient_angle' => 90,
				'gradient_colors' => array(
					array('color' => '#0073aa', 'position' => 0),
					array('color' => '#005177', 'position' => 100)
				),
				'text_color' => '#ffffff',
				'border_width' => 1,
				'border_style' => 'solid',
				'border_color' => '#0073aa',
				'border_radius_mode' => 'uniform',
				'border_radius' => 3,
				'border_radius_tl' => 3,
				'border_radius_tr' => 3,
				'border_radius_bl' => 3,
				'border_radius_br' => 3,
				'padding_horizontal' => 12,
				'padding_vertical' => 6,
				'font_size' => 13,
				'font_weight' => 400,
				'text_transform' => 'none',
				'shadow_mode' => 'preset',
				'shadow_preset' => 'subtle',
				'shadow_h_offset' => 0,
				'shadow_v_offset' => 2,
				'shadow_blur' => 4,
				'shadow_spread' => 0,
				'shadow_color' => 'rgba(0,0,0,0.1)',
				'transition_duration' => 200,
				'ripple_effect' => true
			),
			'hover' => array(
				'bg_type' => 'solid',
				'bg_color' => '#005177',
				'gradient_type' => 'linear',
				'gradient_angle' => 90,
				'gradient_colors' => array(),
				'text_color' => '#ffffff',
				'border_width' => 1,
				'border_style' => 'solid',
				'border_color' => '#005177',
				'border_radius_mode' => 'uniform',
				'border_radius' => 3,
				'border_radius_tl' => 3,
				'border_radius_tr' => 3,
				'border_radius_bl' => 3,
				'border_radius_br' => 3,
				'padding_horizontal' => 12,
				'padding_vertical' => 6,
				'font_size' => 13,
				'font_weight' => 400,
				'text_transform' => 'none',
				'shadow_mode' => 'preset',
				'shadow_preset' => 'medium',
				'shadow_h_offset' => 0,
				'shadow_v_offset' => 2,
				'shadow_blur' => 4,
				'shadow_spread' => 0,
				'shadow_color' => 'rgba(0,0,0,0.15)',
				'transition_duration' => 200,
				'ripple_effect' => true
			),
			'active' => array(
				'bg_type' => 'solid',
				'bg_color' => '#004561',
				'gradient_type' => 'linear',
				'gradient_angle' => 90,
				'gradient_colors' => array(),
				'text_color' => '#ffffff',
				'border_width' => 1,
				'border_style' => 'solid',
				'border_color' => '#004561',
				'border_radius_mode' => 'uniform',
				'border_radius' => 3,
				'border_radius_tl' => 3,
				'border_radius_tr' => 3,
				'border_radius_bl' => 3,
				'border_radius_br' => 3,
				'padding_horizontal' => 12,
				'padding_vertical' => 6,
				'font_size' => 13,
				'font_weight' => 400,
				'text_transform' => 'none',
				'shadow_mode' => 'preset',
				'shadow_preset' => 'subtle',
				'shadow_h_offset' => 0,
				'shadow_v_offset' => 2,
				'shadow_blur' => 4,
				'shadow_spread' => 0,
				'shadow_color' => 'rgba(0,0,0,0.1)',
				'transition_duration' => 200,
				'ripple_effect' => true
			),
			'focus' => array(
				'bg_type' => 'solid',
				'bg_color' => '#0073aa',
				'gradient_type' => 'linear',
				'gradient_angle' => 90,
				'gradient_colors' => array(),
				'text_color' => '#ffffff',
				'border_width' => 1,
				'border_style' => 'solid',
				'border_color' => '#00a0d2',
				'border_radius_mode' => 'uniform',
				'border_radius' => 3,
				'border_radius_tl' => 3,
				'border_radius_tr' => 3,
				'border_radius_bl' => 3,
				'border_radius_br' => 3,
				'padding_horizontal' => 12,
				'padding_vertical' => 6,
				'font_size' => 13,
				'font_weight' => 400,
				'text_transform' => 'none',
				'shadow_mode' => 'preset',
				'shadow_preset' => 'subtle',
				'shadow_h_offset' => 0,
				'shadow_v_offset' => 2,
				'shadow_blur' => 4,
				'shadow_spread' => 0,
				'shadow_color' => 'rgba(0,0,0,0.1)',
				'transition_duration' => 200,
				'ripple_effect' => true
			),
			'disabled' => array(
				'bg_type' => 'solid',
				'bg_color' => '#cccccc',
				'gradient_type' => 'linear',
				'gradient_angle' => 90,
				'gradient_colors' => array(),
				'text_color' => '#666666',
				'border_width' => 1,
				'border_style' => 'solid',
				'border_color' => '#cccccc',
				'border_radius_mode' => 'uniform',
				'border_radius' => 3,
				'border_radius_tl' => 3,
				'border_radius_tr' => 3,
				'border_radius_bl' => 3,
				'border_radius_br' => 3,
				'padding_horizontal' => 12,
				'padding_vertical' => 6,
				'font_size' => 13,
				'font_weight' => 400,
				'text_transform' => 'none',
				'shadow_mode' => 'none',
				'shadow_preset' => 'none',
				'shadow_h_offset' => 0,
				'shadow_v_offset' => 0,
				'shadow_blur' => 0,
				'shadow_spread' => 0,
				'shadow_color' => 'rgba(0,0,0,0)',
				'transition_duration' => 200,
				'ripple_effect' => false
			)
		)
	)
);

// Initialize CSS Generator
$generator = new MASE_CSS_Generator();

// Test 1: Generate button styles CSS
echo "Test 1: Generating button styles CSS...\n";
$start_time = microtime(true);

// Use reflection to call private method for testing
$reflection = new ReflectionClass($generator);
$method = $reflection->getMethod('generate_button_styles');
$method->setAccessible(true);
$css = $method->invoke($generator, $test_settings);

$duration = (microtime(true) - $start_time) * 1000;

if (!empty($css)) {
	echo "✓ Button styles CSS generated successfully\n";
	echo "  Duration: " . number_format($duration, 2) . "ms\n";
	echo "  CSS length: " . strlen($css) . " characters\n";
} else {
	echo "✗ Failed to generate button styles CSS\n";
	exit(1);
}

// Test 2: Verify CSS contains expected selectors
echo "\nTest 2: Verifying CSS contains expected selectors...\n";
$expected_selectors = array(
	'.button-primary',
	'.wp-core-ui .button-primary',
	':root',
	'--mase-btn-primary-normal-bg',
	'--mase-btn-primary-normal-text',
);

$all_found = true;
foreach ($expected_selectors as $selector) {
	if (strpos($css, $selector) !== false) {
		echo "✓ Found selector: $selector\n";
	} else {
		echo "✗ Missing selector: $selector\n";
		$all_found = false;
	}
}

if (!$all_found) {
	echo "\n✗ Some expected selectors are missing\n";
	exit(1);
}

// Test 3: Verify ripple animation is included
echo "\nTest 3: Verifying ripple animation CSS...\n";
if (strpos($css, '@keyframes mase-ripple') !== false) {
	echo "✓ Ripple animation keyframes found\n";
} else {
	echo "✗ Ripple animation keyframes missing\n";
	exit(1);
}

if (strpos($css, '.mase-ripple-effect') !== false) {
	echo "✓ Ripple effect class found\n";
} else {
	echo "✗ Ripple effect class missing\n";
	exit(1);
}

// Test 4: Verify mobile responsive CSS
echo "\nTest 4: Verifying mobile responsive CSS...\n";
if (strpos($css, '@media screen and (max-width: 782px)') !== false) {
	echo "✓ Mobile media query found\n";
} else {
	echo "✗ Mobile media query missing\n";
	exit(1);
}

if (strpos($css, 'min-height: 44px') !== false) {
	echo "✓ Minimum touch target size found\n";
} else {
	echo "✗ Minimum touch target size missing\n";
	exit(1);
}

// Test 5: Verify state-specific CSS
echo "\nTest 5: Verifying button state CSS...\n";
$states = array('hover', 'active', 'focus', 'disabled');
foreach ($states as $state) {
	if (strpos($css, ':' . $state) !== false) {
		echo "✓ Found $state state CSS\n";
	} else {
		echo "✗ Missing $state state CSS\n";
		exit(1);
	}
}

// Test 6: Verify accessibility features
echo "\nTest 6: Verifying accessibility features...\n";
if (strpos($css, 'outline: 2px solid') !== false) {
	echo "✓ Focus outline found (accessibility)\n";
} else {
	echo "✗ Focus outline missing\n";
	exit(1);
}

if (strpos($css, 'cursor: not-allowed') !== false) {
	echo "✓ Disabled cursor style found\n";
} else {
	echo "✗ Disabled cursor style missing\n";
	exit(1);
}

// Test 7: Performance check
echo "\nTest 7: Performance check...\n";
if ($duration < 100) {
	echo "✓ Generation time within threshold (<100ms): " . number_format($duration, 2) . "ms\n";
} else {
	echo "⚠ Generation time exceeded threshold: " . number_format($duration, 2) . "ms\n";
}

echo "\n=== All Tests Passed! ===\n";
echo "\nGenerated CSS Preview (first 500 characters):\n";
echo substr($css, 0, 500) . "...\n";

exit(0);
