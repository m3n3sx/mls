<?php
/**
 * MASE Integration Tests - Admin Bar Settings Save and Load
 *
 * Tests for Task 17.1: Settings save and load functionality
 * Tests all new Admin Bar enhancement settings.
 *
 * Requirements tested: All (1-13)
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.2.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/' );
}

/**
 * Admin Bar Settings Save/Load Integration Test Suite
 */
class MASE_AdminBar_Settings_SaveLoad_Tests {

	private $results = array();
	private $settings;

	public function __construct() {
		$this->results = array(
			'passed' => 0,
			'failed' => 0,
			'tests'  => array(),
		);

		// Load required classes.
		require_once dirname( dirname( __FILE__ ) ) . '/../includes/class-mase-settings.php';
		$this->settings = new MASE_Settings();
	}

	/**
	 * Run all tests for Task 17.1
	 */
	public function run_all_tests() {
		echo '<div class="wrap">';
		echo '<h1>MASE Admin Bar Settings Save/Load Tests</h1>';
		echo '<p>Testing Task 17.1: Settings save and load functionality</p>';
		echo '<hr>';

		$this->test_gradient_settings_save_load();
		$this->test_width_settings_save_load();
		$this->test_corner_radius_settings_save_load();
		$this->test_shadow_settings_save_load();
		$this->test_floating_margin_settings_save_load();
		$this->test_submenu_settings_save_load();
		$this->test_font_family_settings_save_load();
		$this->test_default_values();
		$this->test_backward_compatibility();

		$this->display_results();
		echo '</div>';

		return $this->results;
	}

	/**
	 * Test 1: Gradient Background Settings Save/Load
	 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
	 */
	private function test_gradient_settings_save_load() {
		$test_name = 'Gradient Background Settings Save/Load';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			// Create test settings with gradient configuration.
			$test_settings = $this->settings->get_option();
			$test_settings['admin_bar']['bg_type'] = 'gradient';
			$test_settings['admin_bar']['gradient_type'] = 'linear';
			$test_settings['admin_bar']['gradient_angle'] = 135;
			$test_settings['admin_bar']['gradient_colors'] = array(
				array( 'color' => '#667eea', 'position' => 0 ),
				array( 'color' => '#764ba2', 'position' => 100 ),
			);

			// Save settings.
			$save_result = $this->settings->update_option( $test_settings );
			if ( ! $save_result ) {
				throw new Exception( 'Failed to save gradient settings' );
			}
			echo '<p><strong>Step 1:</strong> Saved gradient settings</p>';

			// Load settings from database.
			$loaded_settings = $this->settings->get_option();

			// Verify all gradient properties.
			$checks = array(
				'bg_type' => $loaded_settings['admin_bar']['bg_type'] === 'gradient',
				'gradient_type' => $loaded_settings['admin_bar']['gradient_type'] === 'linear',
				'gradient_angle' => $loaded_settings['admin_bar']['gradient_angle'] === 135,
				'gradient_colors_count' => count( $loaded_settings['admin_bar']['gradient_colors'] ) === 2,
				'color_1' => $loaded_settings['admin_bar']['gradient_colors'][0]['color'] === '#667eea',
				'color_2' => $loaded_settings['admin_bar']['gradient_colors'][1]['color'] === '#764ba2',
			);

			$passed = array_filter( $checks );
			if ( count( $passed ) !== count( $checks ) ) {
				$failed = array_keys( array_diff_key( $checks, $passed ) );
				throw new Exception( 'Gradient verification failed: ' . implode( ', ', $failed ) );
			}

			echo '<p><strong>Step 2:</strong> Verified all gradient properties (6/6 checks passed)</p>';
			$this->pass_test( $test_name, 'Gradient settings saved and loaded correctly' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}

	/**
	 * Test 2: Width Settings Save/Load
	 * Requirements: 11.1, 11.2
	 */
	private function test_width_settings_save_load() {
		$test_name = 'Width Settings Save/Load';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			$test_settings = $this->settings->get_option();
			$test_settings['admin_bar']['width_unit'] = 'pixels';
			$test_settings['admin_bar']['width_value'] = 1600;

			$save_result = $this->settings->update_option( $test_settings );
			if ( ! $save_result ) {
				throw new Exception( 'Failed to save width settings' );
			}

			$loaded_settings = $this->settings->get_option();

			if ( $loaded_settings['admin_bar']['width_unit'] !== 'pixels' ||
			     $loaded_settings['admin_bar']['width_value'] !== 1600 ) {
				throw new Exception( 'Width settings not preserved' );
			}

			$this->pass_test( $test_name, 'Width settings saved and loaded correctly' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}

	/**
	 * Test 3: Individual Corner Radius Settings Save/Load
	 * Requirements: 9.1, 9.2
	 */
	private function test_corner_radius_settings_save_load() {
		$test_name = 'Individual Corner Radius Settings Save/Load';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			$test_settings = $this->settings->get_option();
			$test_settings['admin_bar']['border_radius_mode'] = 'individual';
			$test_settings['admin_bar']['border_radius_tl'] = 10;
			$test_settings['admin_bar']['border_radius_tr'] = 20;
			$test_settings['admin_bar']['border_radius_bl'] = 5;
			$test_settings['admin_bar']['border_radius_br'] = 15;

			$save_result = $this->settings->update_option( $test_settings );
			if ( ! $save_result ) {
				throw new Exception( 'Failed to save corner radius settings' );
			}

			$loaded_settings = $this->settings->get_option();

			$checks = array(
				'mode' => $loaded_settings['admin_bar']['border_radius_mode'] === 'individual',
				'tl' => $loaded_settings['admin_bar']['border_radius_tl'] === 10,
				'tr' => $loaded_settings['admin_bar']['border_radius_tr'] === 20,
				'bl' => $loaded_settings['admin_bar']['border_radius_bl'] === 5,
				'br' => $loaded_settings['admin_bar']['border_radius_br'] === 15,
			);

			$passed = array_filter( $checks );
			if ( count( $passed ) !== 5 ) {
				throw new Exception( 'Corner radius verification failed' );
			}

			$this->pass_test( $test_name, 'Corner radius settings saved and loaded correctly (5/5 checks)' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}

	/**
	 * Test 4: Advanced Shadow Settings Save/Load
	 * Requirements: 10.1, 10.2, 10.3, 10.4
	 */
	private function test_shadow_settings_save_load() {
		$test_name = 'Advanced Shadow Settings Save/Load';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			$test_settings = $this->settings->get_option();
			$test_settings['admin_bar']['shadow_mode'] = 'custom';
			$test_settings['admin_bar']['shadow_h_offset'] = 5;
			$test_settings['admin_bar']['shadow_v_offset'] = 10;
			$test_settings['admin_bar']['shadow_blur'] = 20;
			$test_settings['admin_bar']['shadow_spread'] = 2;
			$test_settings['admin_bar']['shadow_color'] = '#000000';
			$test_settings['admin_bar']['shadow_opacity'] = 0.25;

			$save_result = $this->settings->update_option( $test_settings );
			if ( ! $save_result ) {
				throw new Exception( 'Failed to save shadow settings' );
			}

			$loaded_settings = $this->settings->get_option();

			$checks = array(
				'mode' => $loaded_settings['admin_bar']['shadow_mode'] === 'custom',
				'h_offset' => $loaded_settings['admin_bar']['shadow_h_offset'] === 5,
				'v_offset' => $loaded_settings['admin_bar']['shadow_v_offset'] === 10,
				'blur' => $loaded_settings['admin_bar']['shadow_blur'] === 20,
				'spread' => $loaded_settings['admin_bar']['shadow_spread'] === 2,
				'color' => $loaded_settings['admin_bar']['shadow_color'] === '#000000',
				'opacity' => $loaded_settings['admin_bar']['shadow_opacity'] === 0.25,
			);

			$passed = array_filter( $checks );
			if ( count( $passed ) !== 7 ) {
				throw new Exception( 'Shadow verification failed' );
			}

			$this->pass_test( $test_name, 'Shadow settings saved and loaded correctly (7/7 checks)' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}

	/**
	 * Test 5: Individual Floating Margin Settings Save/Load
	 * Requirements: 12.1, 12.2
	 */
	private function test_floating_margin_settings_save_load() {
		$test_name = 'Individual Floating Margin Settings Save/Load';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			$test_settings = $this->settings->get_option();
			$test_settings['admin_bar']['floating_margin_mode'] = 'individual';
			$test_settings['admin_bar']['floating_margin_top'] = 10;
			$test_settings['admin_bar']['floating_margin_right'] = 15;
			$test_settings['admin_bar']['floating_margin_bottom'] = 20;
			$test_settings['admin_bar']['floating_margin_left'] = 25;

			$save_result = $this->settings->update_option( $test_settings );
			if ( ! $save_result ) {
				throw new Exception( 'Failed to save floating margin settings' );
			}

			$loaded_settings = $this->settings->get_option();

			$checks = array(
				'mode' => $loaded_settings['admin_bar']['floating_margin_mode'] === 'individual',
				'top' => $loaded_settings['admin_bar']['floating_margin_top'] === 10,
				'right' => $loaded_settings['admin_bar']['floating_margin_right'] === 15,
				'bottom' => $loaded_settings['admin_bar']['floating_margin_bottom'] === 20,
				'left' => $loaded_settings['admin_bar']['floating_margin_left'] === 25,
			);

			$passed = array_filter( $checks );
			if ( count( $passed ) !== 5 ) {
				throw new Exception( 'Floating margin verification failed' );
			}

			$this->pass_test( $test_name, 'Floating margin settings saved and loaded correctly (5/5 checks)' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}

	/**
	 * Test 6: Submenu Settings Save/Load
	 * Requirements: 6.1, 6.2, 6.3, 7.1-7.5
	 */
	private function test_submenu_settings_save_load() {
		$test_name = 'Submenu Settings Save/Load';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			$test_settings = $this->settings->get_option();
			$test_settings['admin_bar_submenu'] = array(
				'bg_color' => '#2c3e50',
				'border_radius' => 8,
				'spacing' => 10,
				'font_size' => 14,
				'text_color' => '#ecf0f1',
				'line_height' => 1.6,
				'letter_spacing' => 0.5,
				'text_transform' => 'uppercase',
				'font_family' => 'Roboto',
			);

			$save_result = $this->settings->update_option( $test_settings );
			if ( ! $save_result ) {
				throw new Exception( 'Failed to save submenu settings' );
			}

			$loaded_settings = $this->settings->get_option();

			$checks = array(
				'bg_color' => $loaded_settings['admin_bar_submenu']['bg_color'] === '#2c3e50',
				'border_radius' => $loaded_settings['admin_bar_submenu']['border_radius'] === 8,
				'spacing' => $loaded_settings['admin_bar_submenu']['spacing'] === 10,
				'font_size' => $loaded_settings['admin_bar_submenu']['font_size'] === 14,
				'text_color' => $loaded_settings['admin_bar_submenu']['text_color'] === '#ecf0f1',
				'line_height' => $loaded_settings['admin_bar_submenu']['line_height'] === 1.6,
				'letter_spacing' => $loaded_settings['admin_bar_submenu']['letter_spacing'] === 0.5,
				'text_transform' => $loaded_settings['admin_bar_submenu']['text_transform'] === 'uppercase',
				'font_family' => $loaded_settings['admin_bar_submenu']['font_family'] === 'Roboto',
			);

			$passed = array_filter( $checks );
			if ( count( $passed ) !== 9 ) {
				throw new Exception( 'Submenu verification failed' );
			}

			$this->pass_test( $test_name, 'Submenu settings saved and loaded correctly (9/9 checks)' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}

	/**
	 * Test 7: Font Family Settings Save/Load
	 * Requirements: 8.1, 8.2, 8.4
	 */
	private function test_font_family_settings_save_load() {
		$test_name = 'Font Family Settings Save/Load';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			$test_settings = $this->settings->get_option();
			$test_settings['typography']['admin_bar']['font_family'] = 'Poppins';
			$test_settings['typography']['admin_bar']['google_font_url'] = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';

			$save_result = $this->settings->update_option( $test_settings );
			if ( ! $save_result ) {
				throw new Exception( 'Failed to save font family settings' );
			}

			$loaded_settings = $this->settings->get_option();

			if ( $loaded_settings['typography']['admin_bar']['font_family'] !== 'Poppins' ||
			     $loaded_settings['typography']['admin_bar']['google_font_url'] !== 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap' ) {
				throw new Exception( 'Font family settings not preserved' );
			}

			$this->pass_test( $test_name, 'Font family settings saved and loaded correctly' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}

	/**
	 * Test 8: Default Values
	 * Verify all new settings have proper defaults
	 */
	private function test_default_values() {
		$test_name = 'Default Values Test';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			// Clear settings to test defaults.
			delete_option( MASE_Settings::OPTION_NAME );

			$defaults = $this->settings->get_option();

			$required_defaults = array(
				'admin_bar.bg_type' => 'solid',
				'admin_bar.width_unit' => 'percent',
				'admin_bar.width_value' => 100,
				'admin_bar.border_radius_mode' => 'uniform',
				'admin_bar.floating_margin_mode' => 'uniform',
				'admin_bar.shadow_mode' => 'preset',
			);

			$missing = array();
			foreach ( $required_defaults as $path => $expected ) {
				$parts = explode( '.', $path );
				$value = $defaults;
				foreach ( $parts as $part ) {
					if ( ! isset( $value[ $part ] ) ) {
						$missing[] = $path;
						break;
					}
					$value = $value[ $part ];
				}
			}

			if ( ! empty( $missing ) ) {
				throw new Exception( 'Missing default values: ' . implode( ', ', $missing ) );
			}

			$this->pass_test( $test_name, 'All default values present (6/6 checks)' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}

	/**
	 * Test 9: Backward Compatibility
	 * Ensure existing settings are preserved when new settings added
	 */
	private function test_backward_compatibility() {
		$test_name = 'Backward Compatibility Test';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			// Simulate old settings without new fields.
			$old_settings = array(
				'admin_bar' => array(
					'bg_color' => '#23282d',
					'text_color' => '#ffffff',
					'height' => 32,
				),
			);

			update_option( MASE_Settings::OPTION_NAME, $old_settings );

			// Load settings (should merge with defaults).
			$merged_settings = $this->settings->get_option();

			// Verify old settings preserved.
			if ( $merged_settings['admin_bar']['bg_color'] !== '#23282d' ||
			     $merged_settings['admin_bar']['text_color'] !== '#ffffff' ||
			     $merged_settings['admin_bar']['height'] !== 32 ) {
				throw new Exception( 'Old settings not preserved' );
			}

			// Verify new defaults added.
			if ( ! isset( $merged_settings['admin_bar']['bg_type'] ) ||
			     ! isset( $merged_settings['admin_bar']['width_unit'] ) ) {
				throw new Exception( 'New defaults not added' );
			}

			$this->pass_test( $test_name, 'Backward compatibility maintained' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}

	private function pass_test( $test_name, $message ) {
		$this->results['passed']++;
		$this->results['tests'][] = array(
			'name'   => $test_name,
			'status' => 'passed',
			'message' => $message,
		);
		echo '<div class="notice notice-success"><p><strong>✓ PASSED:</strong> ' . esc_html( $message ) . '</p></div>';
	}

	private function fail_test( $test_name, $message ) {
		$this->results['failed']++;
		$this->results['tests'][] = array(
			'name'   => $test_name,
			'status' => 'failed',
			'message' => $message,
		);
		echo '<div class="notice notice-error"><p><strong>✗ FAILED:</strong> ' . esc_html( $message ) . '</p></div>';
	}

	private function display_results() {
		echo '<hr><h2>Test Results Summary</h2>';
		$total = $this->results['passed'] + $this->results['failed'];
		$pass_rate = $total > 0 ? round( ( $this->results['passed'] / $total ) * 100, 2 ) : 0;

		echo '<div class="notice notice-info"><p>';
		echo '<strong>Total Tests:</strong> ' . esc_html( $total ) . '<br>';
		echo '<strong>Passed:</strong> ' . esc_html( $this->results['passed'] ) . '<br>';
		echo '<strong>Failed:</strong> ' . esc_html( $this->results['failed'] ) . '<br>';
		echo '<strong>Pass Rate:</strong> ' . esc_html( $pass_rate ) . '%';
		echo '</p></div>';

		if ( $this->results['failed'] === 0 ) {
			echo '<div class="notice notice-success"><p><strong>🎉 All tests passed!</strong></p></div>';
		}
	}
}

// Run tests.
if ( isset( $_GET['run_adminbar_saveload_tests'] ) && current_user_can( 'manage_options' ) ) {
	if ( ! defined( 'ABSPATH' ) ) {
		require_once dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/wp-load.php';
	}
	$test_suite = new MASE_AdminBar_Settings_SaveLoad_Tests();
	$test_suite->run_all_tests();
}
