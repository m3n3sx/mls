<?php
/**
 * Test Task 2: Palette and Template Data Definitions
 *
 * Verifies that palette and template data structures are correctly defined.
 *
 * @package Modern_Admin_Styler_Enterprise
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Load the MASE_Settings class.
require_once dirname( __DIR__ ) . '/includes/class-mase-settings.php';

/**
 * Test Task 2 Implementation
 */
class Test_Task_2_Palette_Template_Data {

	/**
	 * MASE_Settings instance.
	 *
	 * @var MASE_Settings
	 */
	private $settings;

	/**
	 * Test results.
	 *
	 * @var array
	 */
	private $results = array();

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->settings = new MASE_Settings();
	}

	/**
	 * Run all tests.
	 *
	 * @return array Test results.
	 */
	public function run_tests() {
		echo "<h1>Task 2: Palette and Template Data Definitions - Test Results</h1>\n";

		$this->test_palette_count();
		$this->test_palette_structure();
		$this->test_palette_helper_methods();
		$this->test_palette_validation();
		$this->test_template_count();
		$this->test_template_structure();
		$this->test_template_helper_methods();
		$this->test_template_validation();

		$this->display_results();

		return $this->results;
	}

	/**
	 * Test that 10 palettes are defined.
	 */
	private function test_palette_count() {
		$palettes = $this->settings->get_all_palettes();
		$count = count( $palettes );

		$this->add_result(
			'Palette Count',
			$count === 10,
			"Expected 10 palettes, found {$count}",
			array( 'count' => $count )
		);
	}

	/**
	 * Test palette data structure.
	 */
	private function test_palette_structure() {
		$palettes = $this->settings->get_all_palettes();
		$required_keys = array( 'id', 'name', 'colors', 'admin_bar', 'admin_menu', 'is_custom' );
		$required_color_keys = array( 'primary', 'secondary', 'accent', 'background', 'text', 'text_secondary' );
		$all_valid = true;
		$errors = array();

		foreach ( $palettes as $palette_id => $palette ) {
			// Check required keys.
			foreach ( $required_keys as $key ) {
				if ( ! isset( $palette[ $key ] ) ) {
					$all_valid = false;
					$errors[] = "Palette '{$palette_id}' missing key: {$key}";
				}
			}

			// Check colors structure.
			if ( isset( $palette['colors'] ) ) {
				foreach ( $required_color_keys as $color_key ) {
					if ( ! isset( $palette['colors'][ $color_key ] ) ) {
						$all_valid = false;
						$errors[] = "Palette '{$palette_id}' missing color: {$color_key}";
					}
				}
			}

			// Check admin_bar structure.
			if ( isset( $palette['admin_bar'] ) ) {
				if ( ! isset( $palette['admin_bar']['bg_color'] ) || ! isset( $palette['admin_bar']['text_color'] ) ) {
					$all_valid = false;
					$errors[] = "Palette '{$palette_id}' has invalid admin_bar structure";
				}
			}

			// Check admin_menu structure.
			if ( isset( $palette['admin_menu'] ) ) {
				$menu_keys = array( 'bg_color', 'text_color', 'hover_bg_color', 'hover_text_color' );
				foreach ( $menu_keys as $menu_key ) {
					if ( ! isset( $palette['admin_menu'][ $menu_key ] ) ) {
						$all_valid = false;
						$errors[] = "Palette '{$palette_id}' missing admin_menu key: {$menu_key}";
					}
				}
			}
		}

		$this->add_result(
			'Palette Structure',
			$all_valid,
			$all_valid ? 'All palettes have correct structure' : 'Some palettes have structural issues',
			array( 'errors' => $errors )
		);
	}

	/**
	 * Test palette helper methods.
	 */
	private function test_palette_helper_methods() {
		// Test get_palette().
		$palette = $this->settings->get_palette( 'professional-blue' );
		$get_palette_works = $palette !== false && isset( $palette['name'] );

		// Test get_all_palettes().
		$all_palettes = $this->settings->get_all_palettes();
		$get_all_works = is_array( $all_palettes ) && count( $all_palettes ) > 0;

		// Test with invalid ID.
		$invalid_palette = $this->settings->get_palette( 'non-existent-palette' );
		$invalid_returns_false = $invalid_palette === false;

		$all_methods_work = $get_palette_works && $get_all_works && $invalid_returns_false;

		$this->add_result(
			'Palette Helper Methods',
			$all_methods_work,
			$all_methods_work ? 'All helper methods work correctly' : 'Some helper methods failed',
			array(
				'get_palette' => $get_palette_works,
				'get_all_palettes' => $get_all_works,
				'invalid_returns_false' => $invalid_returns_false,
			)
		);
	}

	/**
	 * Test palette ID validation.
	 */
	private function test_palette_validation() {
		// Test valid palette IDs.
		$valid_ids = array( 'professional-blue', 'creative-purple', 'energetic-green' );
		$all_valid = true;

		foreach ( $valid_ids as $id ) {
			if ( ! $this->settings->validate_palette_id( $id ) ) {
				$all_valid = false;
			}
		}

		// Test invalid palette IDs.
		$invalid_ids = array( 'non-existent', '', null, 123 );
		$all_invalid_rejected = true;

		foreach ( $invalid_ids as $id ) {
			if ( $this->settings->validate_palette_id( $id ) ) {
				$all_invalid_rejected = false;
			}
		}

		$validation_works = $all_valid && $all_invalid_rejected;

		$this->add_result(
			'Palette ID Validation',
			$validation_works,
			$validation_works ? 'Palette ID validation works correctly' : 'Palette ID validation has issues',
			array(
				'valid_ids_accepted' => $all_valid,
				'invalid_ids_rejected' => $all_invalid_rejected,
			)
		);
	}

	/**
	 * Test that 11 templates are defined.
	 */
	private function test_template_count() {
		$templates = $this->settings->get_all_templates();
		$count = count( $templates );

		$this->add_result(
			'Template Count',
			$count === 11,
			"Expected 11 templates, found {$count}",
			array( 'count' => $count )
		);
	}

	/**
	 * Test template data structure.
	 */
	private function test_template_structure() {
		$templates = $this->settings->get_all_templates();
		$required_keys = array( 'id', 'name', 'description', 'thumbnail', 'is_custom', 'settings' );
		$all_valid = true;
		$errors = array();

		foreach ( $templates as $template_id => $template ) {
			// Check required keys.
			foreach ( $required_keys as $key ) {
				if ( ! isset( $template[ $key ] ) ) {
					$all_valid = false;
					$errors[] = "Template '{$template_id}' missing key: {$key}";
				}
			}

			// Check settings structure.
			if ( isset( $template['settings'] ) ) {
				if ( ! is_array( $template['settings'] ) ) {
					$all_valid = false;
					$errors[] = "Template '{$template_id}' has invalid settings structure";
				}
			}
		}

		$this->add_result(
			'Template Structure',
			$all_valid,
			$all_valid ? 'All templates have correct structure' : 'Some templates have structural issues',
			array( 'errors' => $errors )
		);
	}

	/**
	 * Test template helper methods.
	 */
	private function test_template_helper_methods() {
		// Test get_template().
		$template = $this->settings->get_template( 'modern-minimal' );
		$get_template_works = $template !== false && isset( $template['name'] );

		// Test get_all_templates().
		$all_templates = $this->settings->get_all_templates();
		$get_all_works = is_array( $all_templates ) && count( $all_templates ) > 0;

		// Test with invalid ID.
		$invalid_template = $this->settings->get_template( 'non-existent-template' );
		$invalid_returns_false = $invalid_template === false;

		$all_methods_work = $get_template_works && $get_all_works && $invalid_returns_false;

		$this->add_result(
			'Template Helper Methods',
			$all_methods_work,
			$all_methods_work ? 'All helper methods work correctly' : 'Some helper methods failed',
			array(
				'get_template' => $get_template_works,
				'get_all_templates' => $get_all_works,
				'invalid_returns_false' => $invalid_returns_false,
			)
		);
	}

	/**
	 * Test template ID validation.
	 */
	private function test_template_validation() {
		// Test valid template IDs.
		$valid_ids = array( 'default', 'modern-minimal', 'glassmorphic' );
		$all_valid = true;

		foreach ( $valid_ids as $id ) {
			if ( ! $this->settings->validate_template_id( $id ) ) {
				$all_valid = false;
			}
		}

		// Test invalid template IDs.
		$invalid_ids = array( 'non-existent', '', null, 123 );
		$all_invalid_rejected = true;

		foreach ( $invalid_ids as $id ) {
			if ( $this->settings->validate_template_id( $id ) ) {
				$all_invalid_rejected = false;
			}
		}

		$validation_works = $all_valid && $all_invalid_rejected;

		$this->add_result(
			'Template ID Validation',
			$validation_works,
			$validation_works ? 'Template ID validation works correctly' : 'Template ID validation has issues',
			array(
				'valid_ids_accepted' => $all_valid,
				'invalid_ids_rejected' => $all_invalid_rejected,
			)
		);
	}

	/**
	 * Add test result.
	 *
	 * @param string $test_name Test name.
	 * @param bool   $passed    Whether test passed.
	 * @param string $message   Result message.
	 * @param array  $details   Additional details.
	 */
	private function add_result( $test_name, $passed, $message, $details = array() ) {
		$this->results[] = array(
			'test'    => $test_name,
			'passed'  => $passed,
			'message' => $message,
			'details' => $details,
		);
	}

	/**
	 * Display test results.
	 */
	private function display_results() {
		$total = count( $this->results );
		$passed = 0;

		echo "<h2>Test Summary</h2>\n";
		echo "<table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%;'>\n";
		echo "<tr><th>Test</th><th>Status</th><th>Message</th><th>Details</th></tr>\n";

		foreach ( $this->results as $result ) {
			if ( $result['passed'] ) {
				$passed++;
			}

			$status_color = $result['passed'] ? 'green' : 'red';
			$status_text = $result['passed'] ? '✓ PASS' : '✗ FAIL';

			echo "<tr>\n";
			echo "<td>{$result['test']}</td>\n";
			echo "<td style='color: {$status_color}; font-weight: bold;'>{$status_text}</td>\n";
			echo "<td>{$result['message']}</td>\n";
			echo "<td><pre>" . htmlspecialchars( print_r( $result['details'], true ) ) . "</pre></td>\n";
			echo "</tr>\n";
		}

		echo "</table>\n";

		$percentage = ( $passed / $total ) * 100;
		echo "<h3>Results: {$passed}/{$total} tests passed ({$percentage}%)</h3>\n";

		if ( $passed === $total ) {
			echo "<p style='color: green; font-weight: bold; font-size: 18px;'>✓ All tests passed! Task 2 implementation is complete.</p>\n";
		} else {
			echo "<p style='color: red; font-weight: bold; font-size: 18px;'>✗ Some tests failed. Please review the implementation.</p>\n";
		}
	}
}

// Run tests if accessed directly.
if ( ! defined( 'PHPUNIT_RUNNING' ) ) {
	$test = new Test_Task_2_Palette_Template_Data();
	$test->run_tests();
}
