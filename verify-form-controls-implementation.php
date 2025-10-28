<?php
/**
 * Verification script for form controls implementation
 * Task 12: Extend settings storage for form controls
 */

// Load WordPress
require_once __DIR__ . '/../../../wp-load.php';

// Load MASE Settings class
require_once __DIR__ . '/includes/class-mase-settings.php';

echo "=== Form Controls Implementation Verification ===\n\n";

// Test 1: Check if get_defaults includes form_controls
echo "Test 1: Checking if form_controls exists in defaults...\n";
$settings = new MASE_Settings();
$defaults = $settings->get_option();

if ( isset( $defaults['form_controls'] ) ) {
	echo "✓ PASS: form_controls section exists in defaults\n";
	echo "  Control types found: " . implode( ', ', array_keys( $defaults['form_controls'] ) ) . "\n";
} else {
	echo "✗ FAIL: form_controls section not found in defaults\n";
	exit( 1 );
}

// Test 2: Verify all control types are present
echo "\nTest 2: Verifying all control types are present...\n";
$expected_types = array( 'text_inputs', 'textareas', 'selects', 'checkboxes', 'radios', 'file_uploads', 'search_fields' );
$missing_types = array();

foreach ( $expected_types as $type ) {
	if ( ! isset( $defaults['form_controls'][ $type ] ) ) {
		$missing_types[] = $type;
	}
}

if ( empty( $missing_types ) ) {
	echo "✓ PASS: All 7 control types are present\n";
} else {
	echo "✗ FAIL: Missing control types: " . implode( ', ', $missing_types ) . "\n";
	exit( 1 );
}

// Test 3: Verify text_inputs has required properties
echo "\nTest 3: Verifying text_inputs has required properties...\n";
$required_props = array( 'bg_color', 'text_color', 'border_color', 'border_radius', 'font_size' );
$missing_props = array();

foreach ( $required_props as $prop ) {
	if ( ! isset( $defaults['form_controls']['text_inputs'][ $prop ] ) ) {
		$missing_props[] = $prop;
	}
}

if ( empty( $missing_props ) ) {
	echo "✓ PASS: text_inputs has all required properties\n";
} else {
	echo "✗ FAIL: text_inputs missing properties: " . implode( ', ', $missing_props ) . "\n";
	exit( 1 );
}

// Test 4: Verify checkboxes has size property
echo "\nTest 4: Verifying checkboxes has size property...\n";
if ( isset( $defaults['form_controls']['checkboxes']['size'] ) ) {
	$size = $defaults['form_controls']['checkboxes']['size'];
	echo "✓ PASS: checkboxes has size property (value: {$size}px)\n";
} else {
	echo "✗ FAIL: checkboxes missing size property\n";
	exit( 1 );
}

// Test 5: Test validation with valid data
echo "\nTest 5: Testing validation with valid data...\n";
$valid_input = array(
	'form_controls' => array(
		'text_inputs' => array(
			'bg_color' => '#ffffff',
			'border_radius' => 4,
			'font_size' => 14,
		),
		'checkboxes' => array(
			'size' => 16,
			'check_animation' => 'slide',
		),
	),
);

$validated = $settings->validate( $valid_input );

if ( ! is_wp_error( $validated ) && isset( $validated['form_controls'] ) ) {
	echo "✓ PASS: Valid data passed validation\n";
} else {
	echo "✗ FAIL: Valid data failed validation\n";
	if ( is_wp_error( $validated ) ) {
		echo "  Error: " . $validated->get_error_message() . "\n";
	}
	exit( 1 );
}

// Test 6: Test validation with invalid border_radius (out of range)
echo "\nTest 6: Testing validation with invalid border_radius (out of range)...\n";
$invalid_input = array(
	'form_controls' => array(
		'text_inputs' => array(
			'border_radius' => 30, // Should fail: max is 25
		),
	),
);

$validated = $settings->validate( $invalid_input );

if ( is_wp_error( $validated ) ) {
	echo "✓ PASS: Invalid border_radius correctly rejected\n";
	$errors = $validated->get_error_data();
	if ( isset( $errors['form_controls_text_inputs_border_radius'] ) ) {
		echo "  Error message: " . $errors['form_controls_text_inputs_border_radius'] . "\n";
	}
} else {
	echo "✗ FAIL: Invalid border_radius was not rejected\n";
	exit( 1 );
}

// Test 7: Test validation with invalid checkbox size (out of range)
echo "\nTest 7: Testing validation with invalid checkbox size (out of range)...\n";
$invalid_input = array(
	'form_controls' => array(
		'checkboxes' => array(
			'size' => 30, // Should fail: max is 24
		),
	),
);

$validated = $settings->validate( $invalid_input );

if ( is_wp_error( $validated ) ) {
	echo "✓ PASS: Invalid checkbox size correctly rejected\n";
	$errors = $validated->get_error_data();
	if ( isset( $errors['form_controls_checkboxes_size'] ) ) {
		echo "  Error message: " . $errors['form_controls_checkboxes_size'] . "\n";
	}
} else {
	echo "✗ FAIL: Invalid checkbox size was not rejected\n";
	exit( 1 );
}

// Test 8: Test validation with invalid animation enum
echo "\nTest 8: Testing validation with invalid animation enum...\n";
$invalid_input = array(
	'form_controls' => array(
		'checkboxes' => array(
			'check_animation' => 'invalid', // Should fail: must be slide, fade, bounce, or none
		),
	),
);

$validated = $settings->validate( $invalid_input );

if ( is_wp_error( $validated ) ) {
	echo "✓ PASS: Invalid animation enum correctly rejected\n";
	$errors = $validated->get_error_data();
	if ( isset( $errors['form_controls_checkboxes_check_animation'] ) ) {
		echo "  Error message: " . $errors['form_controls_checkboxes_check_animation'] . "\n";
	}
} else {
	echo "✗ FAIL: Invalid animation enum was not rejected\n";
	exit( 1 );
}

// Test 9: Test validation with invalid font size (out of range)
echo "\nTest 9: Testing validation with invalid font size (out of range)...\n";
$invalid_input = array(
	'form_controls' => array(
		'text_inputs' => array(
			'font_size' => 8, // Should fail: min is 10
		),
	),
);

$validated = $settings->validate( $invalid_input );

if ( is_wp_error( $validated ) ) {
	echo "✓ PASS: Invalid font size correctly rejected\n";
	$errors = $validated->get_error_data();
	if ( isset( $errors['form_controls_text_inputs_font_size'] ) ) {
		echo "  Error message: " . $errors['form_controls_text_inputs_font_size'] . "\n";
	}
} else {
	echo "✗ FAIL: Invalid font size was not rejected\n";
	exit( 1 );
}

echo "\n=== All Tests Passed! ===\n";
echo "\nImplementation Summary:\n";
echo "- Added form_controls section to get_defaults()\n";
echo "- Created get_form_controls_defaults() method with 7 control types\n";
echo "- Added validate_form_controls() method with comprehensive validation\n";
echo "- Validation includes:\n";
echo "  * Border width range (0-5px)\n";
echo "  * Border radius range (0-25px)\n";
echo "  * Font size range (10-18px)\n";
echo "  * Checkbox/radio size range (12-24px)\n";
echo "  * Padding range (3-25px horizontal, 5-25px vertical)\n";
echo "  * Height range (20-60px)\n";
echo "  * Color values (hex format)\n";
echo "  * Animation enum (slide, fade, bounce, none)\n";
echo "  * Returns WP_Error with detailed messages on validation failure\n";

exit( 0 );
