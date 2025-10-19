<?php
/**
 * Verify Task 2 Implementation
 *
 * Simple verification script that checks palette and template data definitions.
 *
 * @package Modern_Admin_Styler_Enterprise
 */

// Mock WordPress functions for standalone testing.
if ( ! function_exists( 'sanitize_hex_color' ) ) {
	function sanitize_hex_color( $color ) {
		if ( preg_match( '/^#[a-f0-9]{6}$/i', $color ) ) {
			return $color;
		}
		return false;
	}
}

if ( ! function_exists( 'sanitize_text_field' ) ) {
	function sanitize_text_field( $str ) {
		return strip_tags( $str );
	}
}

if ( ! function_exists( 'sanitize_title' ) ) {
	function sanitize_title( $title ) {
		return strtolower( str_replace( ' ', '-', $title ) );
	}
}

if ( ! function_exists( 'sanitize_textarea_field' ) ) {
	function sanitize_textarea_field( $str ) {
		return strip_tags( $str );
	}
}

if ( ! function_exists( 'wp_kses_post' ) ) {
	function wp_kses_post( $data ) {
		return $data;
	}
}

if ( ! function_exists( 'absint' ) ) {
	function absint( $maybeint ) {
		return abs( intval( $maybeint ) );
	}
}

if ( ! function_exists( 'get_option' ) ) {
	function get_option( $option, $default = false ) {
		return $default;
	}
}

if ( ! function_exists( 'update_option' ) ) {
	function update_option( $option, $value ) {
		return true;
	}
}

if ( ! function_exists( 'current_time' ) ) {
	function current_time( $type ) {
		if ( $type === 'timestamp' ) {
			return time();
		}
		return date( $type );
	}
}

if ( ! class_exists( 'WP_Error' ) ) {
	class WP_Error {
		private $errors = array();
		private $error_data = array();

		public function __construct( $code = '', $message = '', $data = '' ) {
			if ( ! empty( $code ) ) {
				$this->errors[ $code ] = array( $message );
				if ( ! empty( $data ) ) {
					$this->error_data[ $code ] = $data;
				}
			}
		}

		public function get_error_data( $code = '' ) {
			if ( empty( $code ) ) {
				$code = $this->get_error_code();
			}
			return isset( $this->error_data[ $code ] ) ? $this->error_data[ $code ] : null;
		}

		public function get_error_code() {
			$codes = array_keys( $this->errors );
			return empty( $codes ) ? '' : $codes[0];
		}
	}
}

if ( ! function_exists( 'is_wp_error' ) ) {
	function is_wp_error( $thing ) {
		return ( $thing instanceof WP_Error );
	}
}

// Load the MASE_Settings class.
require_once dirname( __DIR__ ) . '/includes/class-mase-settings.php';

echo "=== Task 2: Palette and Template Data Definitions - Verification ===\n\n";

$settings = new MASE_Settings();

// Test 1: Check palette count.
echo "Test 1: Palette Count\n";
$palettes = $settings->get_all_palettes();
$palette_count = count( $palettes );
echo "  Expected: 10 palettes\n";
echo "  Found: {$palette_count} palettes\n";
echo "  Status: " . ( $palette_count === 10 ? "✓ PASS" : "✗ FAIL" ) . "\n\n";

// Test 2: List all palette IDs and names.
echo "Test 2: Palette IDs and Names\n";
foreach ( $palettes as $id => $palette ) {
	echo "  - {$id}: {$palette['name']}\n";
}
echo "\n";

// Test 3: Check palette structure.
echo "Test 3: Palette Structure Validation\n";
$palette_structure_valid = true;
foreach ( $palettes as $id => $palette ) {
	$required_keys = array( 'id', 'name', 'colors', 'admin_bar', 'admin_menu', 'is_custom' );
	foreach ( $required_keys as $key ) {
		if ( ! isset( $palette[ $key ] ) ) {
			echo "  ✗ Palette '{$id}' missing key: {$key}\n";
			$palette_structure_valid = false;
		}
	}
}
echo "  Status: " . ( $palette_structure_valid ? "✓ PASS - All palettes have correct structure" : "✗ FAIL - Some palettes have issues" ) . "\n\n";

// Test 4: Check template count.
echo "Test 4: Template Count\n";
$templates = $settings->get_all_templates();
$template_count = count( $templates );
echo "  Expected: 11 templates\n";
echo "  Found: {$template_count} templates\n";
echo "  Status: " . ( $template_count === 11 ? "✓ PASS" : "✗ FAIL" ) . "\n\n";

// Test 5: List all template IDs and names.
echo "Test 5: Template IDs and Names\n";
foreach ( $templates as $id => $template ) {
	echo "  - {$id}: {$template['name']}\n";
}
echo "\n";

// Test 6: Check template structure.
echo "Test 6: Template Structure Validation\n";
$template_structure_valid = true;
foreach ( $templates as $id => $template ) {
	$required_keys = array( 'id', 'name', 'description', 'is_custom', 'settings' );
	foreach ( $required_keys as $key ) {
		if ( ! isset( $template[ $key ] ) ) {
			echo "  ✗ Template '{$id}' missing key: {$key}\n";
			$template_structure_valid = false;
		}
	}
}
echo "  Status: " . ( $template_structure_valid ? "✓ PASS - All templates have correct structure" : "✗ FAIL - Some templates have issues" ) . "\n\n";

// Test 7: Test get_palette() helper method.
echo "Test 7: get_palette() Helper Method\n";
$test_palette = $settings->get_palette( 'professional-blue' );
$get_palette_works = $test_palette !== false && isset( $test_palette['name'] );
echo "  Testing get_palette('professional-blue')\n";
echo "  Status: " . ( $get_palette_works ? "✓ PASS - Returns palette data" : "✗ FAIL" ) . "\n\n";

// Test 8: Test get_template() helper method.
echo "Test 8: get_template() Helper Method\n";
$test_template = $settings->get_template( 'modern-minimal' );
$get_template_works = $test_template !== false && isset( $test_template['name'] );
echo "  Testing get_template('modern-minimal')\n";
echo "  Status: " . ( $get_template_works ? "✓ PASS - Returns template data" : "✗ FAIL" ) . "\n\n";

// Test 9: Test palette ID validation.
echo "Test 9: Palette ID Validation\n";
$valid_palette = $settings->validate_palette_id( 'professional-blue' );
$invalid_palette = $settings->validate_palette_id( 'non-existent' );
$validation_works = $valid_palette === true && $invalid_palette === false;
echo "  Valid ID 'professional-blue': " . ( $valid_palette ? "✓ Accepted" : "✗ Rejected" ) . "\n";
echo "  Invalid ID 'non-existent': " . ( ! $invalid_palette ? "✓ Rejected" : "✗ Accepted" ) . "\n";
echo "  Status: " . ( $validation_works ? "✓ PASS" : "✗ FAIL" ) . "\n\n";

// Test 10: Test template ID validation.
echo "Test 10: Template ID Validation\n";
$valid_template = $settings->validate_template_id( 'modern-minimal' );
$invalid_template = $settings->validate_template_id( 'non-existent' );
$validation_works = $valid_template === true && $invalid_template === false;
echo "  Valid ID 'modern-minimal': " . ( $valid_template ? "✓ Accepted" : "✗ Rejected" ) . "\n";
echo "  Invalid ID 'non-existent': " . ( ! $invalid_template ? "✓ Rejected" : "✗ Accepted" ) . "\n";
echo "  Status: " . ( $validation_works ? "✓ PASS" : "✗ FAIL" ) . "\n\n";

// Summary.
$total_tests = 10;
$passed_tests = 0;

if ( $palette_count === 10 ) $passed_tests++;
if ( $palette_structure_valid ) $passed_tests++;
if ( $template_count === 11 ) $passed_tests++;
if ( $template_structure_valid ) $passed_tests++;
if ( $get_palette_works ) $passed_tests++;
if ( $get_template_works ) $passed_tests++;
if ( $valid_palette && ! $invalid_palette ) $passed_tests++;
if ( $valid_template && ! $invalid_template ) $passed_tests++;

// Count tests 2 and 5 as passed (they're informational).
$passed_tests += 2;

echo "=== SUMMARY ===\n";
echo "Tests Passed: {$passed_tests}/{$total_tests}\n";
echo "Status: " . ( $passed_tests === $total_tests ? "✓ ALL TESTS PASSED" : "✗ SOME TESTS FAILED" ) . "\n";
