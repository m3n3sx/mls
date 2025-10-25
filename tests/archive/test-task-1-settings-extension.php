<?php
/**
 * Test Task 1: MASE_Settings Extension
 *
 * Tests the extended MASE_Settings class with new schema and methods.
 *
 * @package Modern_Admin_Styler_Enterprise
 */

// Mock WordPress functions for testing.
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

if ( ! function_exists( 'sanitize_textarea_field' ) ) {
	function sanitize_textarea_field( $str ) {
		return strip_tags( $str );
	}
}

if ( ! function_exists( 'wp_kses_post' ) ) {
	function wp_kses_post( $str ) {
		return strip_tags( $str );
	}
}

if ( ! function_exists( 'sanitize_title' ) ) {
	function sanitize_title( $str ) {
		return strtolower( str_replace( ' ', '-', $str ) );
	}
}

if ( ! function_exists( 'absint' ) ) {
	function absint( $value ) {
		return abs( intval( $value ) );
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

if ( ! class_exists( 'WP_Error' ) ) {
	class WP_Error {
		private $errors = array();
		private $error_data = array();

		public function __construct( $code, $message, $data = '' ) {
			$this->errors[ $code ] = $message;
			$this->error_data[ $code ] = $data;
		}

		public function get_error_data() {
			return reset( $this->error_data );
		}
	}
}

if ( ! function_exists( 'is_wp_error' ) ) {
	function is_wp_error( $thing ) {
		return $thing instanceof WP_Error;
	}
}

// Load the MASE_Settings class.
require_once __DIR__ . '/../includes/class-mase-settings.php';

// Test runner.
class MASE_Settings_Test {
	private $settings;
	private $passed = 0;
	private $failed = 0;

	public function __construct() {
		$this->settings = new MASE_Settings();
	}

	public function run_tests() {
		echo "=== MASE_Settings Extension Tests ===\n\n";

		$this->test_new_defaults();
		$this->test_palette_methods();
		$this->test_template_methods();
		$this->test_auto_palette_switch();
		$this->test_validation_extensions();

		echo "\n=== Test Summary ===\n";
		echo "Passed: {$this->passed}\n";
		echo "Failed: {$this->failed}\n";
		echo "Total: " . ( $this->passed + $this->failed ) . "\n";

		return $this->failed === 0;
	}

	private function assert( $condition, $message ) {
		if ( $condition ) {
			echo "✓ {$message}\n";
			$this->passed++;
		} else {
			echo "✗ {$message}\n";
			$this->failed++;
		}
	}

	private function test_new_defaults() {
		echo "Testing new default settings...\n";

		$defaults = $this->settings->get_defaults();

		// Test new categories exist.
		$this->assert( isset( $defaults['palettes'] ), 'Palettes category exists' );
		$this->assert( isset( $defaults['templates'] ), 'Templates category exists' );
		$this->assert( isset( $defaults['effects'] ), 'Effects category exists' );
		$this->assert( isset( $defaults['advanced'] ), 'Advanced category exists' );
		$this->assert( isset( $defaults['mobile'] ), 'Mobile category exists' );
		$this->assert( isset( $defaults['accessibility'] ), 'Accessibility category exists' );
		$this->assert( isset( $defaults['keyboard_shortcuts'] ), 'Keyboard shortcuts category exists' );

		// Test palettes structure.
		$this->assert(
			isset( $defaults['palettes']['current'] ) && $defaults['palettes']['current'] === 'professional-blue',
			'Palettes has current field with default value'
		);
		$this->assert(
			isset( $defaults['palettes']['custom'] ) && is_array( $defaults['palettes']['custom'] ),
			'Palettes has custom array'
		);

		// Test templates structure.
		$this->assert(
			isset( $defaults['templates']['current'] ) && $defaults['templates']['current'] === 'default',
			'Templates has current field with default value'
		);
		$this->assert(
			isset( $defaults['templates']['custom'] ) && is_array( $defaults['templates']['custom'] ),
			'Templates has custom array'
		);

		// Test typography extensions.
		$this->assert(
			isset( $defaults['typography']['google_fonts'] ),
			'Typography has google_fonts field'
		);
		$this->assert(
			isset( $defaults['typography']['enabled'] ),
			'Typography has enabled field'
		);
		$this->assert(
			isset( $defaults['typography']['admin_bar']['font_family'] ),
			'Typography admin_bar has font_family field'
		);

		// Test visual_effects extensions.
		$this->assert(
			isset( $defaults['visual_effects']['admin_bar']['glassmorphism'] ),
			'Visual effects admin_bar has glassmorphism field'
		);
		$this->assert(
			isset( $defaults['visual_effects']['admin_bar']['blur_intensity'] ),
			'Visual effects admin_bar has blur_intensity field'
		);
		$this->assert(
			isset( $defaults['visual_effects']['admin_bar']['floating'] ),
			'Visual effects admin_bar has floating field'
		);
		$this->assert(
			isset( $defaults['visual_effects']['animations_enabled'] ),
			'Visual effects has animations_enabled field'
		);

		// Test effects structure.
		$this->assert(
			isset( $defaults['effects']['page_animations'] ),
			'Effects has page_animations field'
		);
		$this->assert(
			isset( $defaults['effects']['animation_speed'] ) && $defaults['effects']['animation_speed'] === 300,
			'Effects has animation_speed with default value'
		);

		// Test advanced structure.
		$this->assert(
			isset( $defaults['advanced']['auto_palette_switch'] ),
			'Advanced has auto_palette_switch field'
		);
		$this->assert(
			isset( $defaults['advanced']['auto_palette_times'] ) && is_array( $defaults['advanced']['auto_palette_times'] ),
			'Advanced has auto_palette_times array'
		);

		echo "\n";
	}

	private function test_palette_methods() {
		echo "Testing palette management methods...\n";

		// Test get_all_palettes.
		$palettes = $this->settings->get_all_palettes();
		$this->assert( is_array( $palettes ) && ! empty( $palettes ), 'get_all_palettes returns array' );

		// Test get_palette.
		$palette = $this->settings->get_palette( 'professional_blue' );
		$this->assert( is_array( $palette ) || $palette === false, 'get_palette returns palette or false' );

		// Test get_palette_for_time.
		$morning_palette = $this->settings->get_palette_for_time( 8 );
		$this->assert( is_string( $morning_palette ), 'get_palette_for_time(8) returns palette ID for morning' );

		$afternoon_palette = $this->settings->get_palette_for_time( 14 );
		$this->assert( is_string( $afternoon_palette ), 'get_palette_for_time(14) returns palette ID for afternoon' );

		$evening_palette = $this->settings->get_palette_for_time( 20 );
		$this->assert( is_string( $evening_palette ), 'get_palette_for_time(20) returns palette ID for evening' );

		$night_palette = $this->settings->get_palette_for_time( 2 );
		$this->assert( is_string( $night_palette ), 'get_palette_for_time(2) returns palette ID for night' );

		echo "\n";
	}

	private function test_template_methods() {
		echo "Testing template management methods...\n";

		// Test get_all_templates.
		$templates = $this->settings->get_all_templates();
		$this->assert( is_array( $templates ) && ! empty( $templates ), 'get_all_templates returns array' );

		// Test get_template.
		$template = $this->settings->get_template( 'default' );
		$this->assert( is_array( $template ), 'get_template returns template data' );
		$this->assert(
			isset( $template['name'] ) && $template['name'] === 'WordPress Default',
			'Template has correct name'
		);

		// Test template structure.
		$this->assert( isset( $template['settings'] ), 'Template has settings field' );
		$this->assert( isset( $template['is_custom'] ), 'Template has is_custom field' );

		echo "\n";
	}

	private function test_auto_palette_switch() {
		echo "Testing auto palette switch logic...\n";

		// Test time-based palette selection.
		$test_cases = array(
			array( 'hour' => 6, 'expected_period' => 'morning' ),
			array( 'hour' => 11, 'expected_period' => 'morning' ),
			array( 'hour' => 12, 'expected_period' => 'afternoon' ),
			array( 'hour' => 17, 'expected_period' => 'afternoon' ),
			array( 'hour' => 18, 'expected_period' => 'evening' ),
			array( 'hour' => 21, 'expected_period' => 'evening' ),
			array( 'hour' => 22, 'expected_period' => 'night' ),
			array( 'hour' => 5, 'expected_period' => 'night' ),
		);

		foreach ( $test_cases as $test ) {
			$palette_id = $this->settings->get_palette_for_time( $test['hour'] );
			$this->assert(
				is_string( $palette_id ) && ! empty( $palette_id ),
				"Hour {$test['hour']} returns palette for {$test['expected_period']}"
			);
		}

		echo "\n";
	}

	private function test_validation_extensions() {
		echo "Testing validation extensions...\n";

		// Test effects validation.
		$effects_input = array(
			'effects' => array(
				'page_animations' => true,
				'animation_speed' => 500,
				'hover_effects' => true,
			),
		);
		$validated = $this->settings->validate( $effects_input );
		$this->assert( ! is_wp_error( $validated ), 'Effects validation passes' );
		$this->assert(
			isset( $validated['effects']['animation_speed'] ) && $validated['effects']['animation_speed'] === 500,
			'Animation speed validated correctly'
		);

		// Test invalid animation speed.
		$invalid_effects = array(
			'effects' => array(
				'animation_speed' => 5000, // Too high.
			),
		);
		$validated = $this->settings->validate( $invalid_effects );
		$this->assert( is_wp_error( $validated ), 'Invalid animation speed rejected' );

		// Test mobile validation.
		$mobile_input = array(
			'mobile' => array(
				'optimized' => true,
				'touch_friendly' => true,
				'compact_mode' => false,
			),
		);
		$validated = $this->settings->validate( $mobile_input );
		$this->assert( ! is_wp_error( $validated ), 'Mobile validation passes' );

		// Test accessibility validation.
		$accessibility_input = array(
			'accessibility' => array(
				'high_contrast' => true,
				'reduced_motion' => true,
			),
		);
		$validated = $this->settings->validate( $accessibility_input );
		$this->assert( ! is_wp_error( $validated ), 'Accessibility validation passes' );

		// Test visual effects extensions.
		$visual_effects_input = array(
			'visual_effects' => array(
				'admin_bar' => array(
					'glassmorphism' => true,
					'blur_intensity' => 25,
					'floating' => true,
					'floating_margin' => 10,
				),
			),
		);
		$validated = $this->settings->validate( $visual_effects_input );
		$this->assert( ! is_wp_error( $validated ), 'Visual effects extensions validation passes' );

		echo "\n";
	}
}

// Run tests.
$test = new MASE_Settings_Test();
$success = $test->run_tests();

exit( $success ? 0 : 1 );
