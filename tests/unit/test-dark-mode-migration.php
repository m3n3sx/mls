<?php
/**
 * Unit tests for dark mode migration logic.
 *
 * Tests Task 17: Add migration logic for existing users.
 * Requirements: 10.5
 *
 * @package ModernAdminStyler
 */

// Mock WordPress functions for testing.
if ( ! function_exists( 'get_option' ) ) {
	function get_option( $option, $default = false ) {
		global $mock_options;
		return isset( $mock_options[ $option ] ) ? $mock_options[ $option ] : $default;
	}
}

if ( ! function_exists( 'update_option' ) ) {
	function update_option( $option, $value ) {
		global $mock_options;
		$mock_options[ $option ] = $value;
		return true;
	}
}

if ( ! function_exists( 'get_current_user_id' ) ) {
	function get_current_user_id() {
		return 1;
	}
}

if ( ! function_exists( 'update_user_meta' ) ) {
	function update_user_meta( $user_id, $meta_key, $meta_value ) {
		global $mock_user_meta;
		if ( ! isset( $mock_user_meta[ $user_id ] ) ) {
			$mock_user_meta[ $user_id ] = array();
		}
		$mock_user_meta[ $user_id ][ $meta_key ] = $meta_value;
		return true;
	}
}

if ( ! function_exists( 'get_user_meta' ) ) {
	function get_user_meta( $user_id, $meta_key, $single = false ) {
		global $mock_user_meta;
		if ( isset( $mock_user_meta[ $user_id ][ $meta_key ] ) ) {
			return $mock_user_meta[ $user_id ][ $meta_key ];
		}
		return $single ? '' : array();
	}
}

if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

if ( ! function_exists( 'error_log' ) ) {
	function error_log( $message ) {
		// Silent for tests.
	}
}

// Load required classes.
require_once __DIR__ . '/../../includes/class-mase-settings.php';
require_once __DIR__ . '/../../includes/class-mase-migration.php';

/**
 * Test dark mode migration logic.
 */
class Test_Dark_Mode_Migration {

	/**
	 * Test that migration detects light palette correctly.
	 */
	public static function test_light_palette_detection() {
		global $mock_options, $mock_user_meta;
		$mock_options = array();
		$mock_user_meta = array();
		
		// Set up settings with a light palette.
		$settings = array(
			'palettes' => array(
				'current' => 'professional-blue',
			),
		);
		$mock_options['mase_settings'] = $settings;
		$mock_options['mase_dark_mode_migration_completed'] = false;
		
		// Run migration.
		MASE_Migration::maybe_migrate_dark_mode_settings();
		
		// Verify settings were updated.
		$updated_settings = get_option( 'mase_settings' );
		
		assert( isset( $updated_settings['dark_light_toggle'] ), 'dark_light_toggle settings should exist' );
		assert( $updated_settings['dark_light_toggle']['current_mode'] === 'light', 'Mode should be light for professional-blue palette' );
		assert( $updated_settings['dark_light_toggle']['light_palette'] === 'professional-blue', 'Light palette should be set to professional-blue' );
		
		// Verify user meta was saved.
		$user_preference = get_user_meta( 1, 'mase_dark_mode_preference', true );
		assert( $user_preference === 'light', 'User preference should be light' );
		
		// Verify migration was marked complete.
		assert( get_option( 'mase_dark_mode_migration_completed' ) === true, 'Migration should be marked complete' );
		
		echo "✓ Light palette detection test passed\n";
	}

	/**
	 * Test that migration detects dark palette correctly.
	 */
	public static function test_dark_palette_detection() {
		global $mock_options, $mock_user_meta;
		$mock_options = array();
		$mock_user_meta = array();
		
		// Set up settings with a dark palette.
		$settings = array(
			'palettes' => array(
				'current' => 'dark-elegance',
			),
		);
		$mock_options['mase_settings'] = $settings;
		$mock_options['mase_dark_mode_migration_completed'] = false;
		
		// Run migration.
		MASE_Migration::maybe_migrate_dark_mode_settings();
		
		// Verify settings were updated.
		$updated_settings = get_option( 'mase_settings' );
		
		assert( isset( $updated_settings['dark_light_toggle'] ), 'dark_light_toggle settings should exist' );
		assert( $updated_settings['dark_light_toggle']['current_mode'] === 'dark', 'Mode should be dark for dark-elegance palette' );
		assert( $updated_settings['dark_light_toggle']['dark_palette'] === 'dark-elegance', 'Dark palette should be set to dark-elegance' );
		
		// Verify user meta was saved.
		$user_preference = get_user_meta( 1, 'mase_dark_mode_preference', true );
		assert( $user_preference === 'dark', 'User preference should be dark' );
		
		echo "✓ Dark palette detection test passed\n";
	}

	/**
	 * Test that migration doesn't run twice.
	 */
	public static function test_migration_runs_once() {
		global $mock_options, $mock_user_meta;
		$mock_options = array();
		$mock_user_meta = array();
		
		// Set up settings.
		$settings = array(
			'palettes' => array(
				'current' => 'professional-blue',
			),
		);
		$mock_options['mase_settings'] = $settings;
		$mock_options['mase_dark_mode_migration_completed'] = false;
		
		// Run migration first time.
		MASE_Migration::maybe_migrate_dark_mode_settings();
		
		// Modify settings to test if migration runs again.
		$updated_settings = get_option( 'mase_settings' );
		$updated_settings['dark_light_toggle']['current_mode'] = 'dark';
		$mock_options['mase_settings'] = $updated_settings;
		
		// Run migration second time.
		MASE_Migration::maybe_migrate_dark_mode_settings();
		
		// Verify mode wasn't changed (migration didn't run).
		$final_settings = get_option( 'mase_settings' );
		assert( $final_settings['dark_light_toggle']['current_mode'] === 'dark', 'Mode should remain dark (migration should not run twice)' );
		
		echo "✓ Migration runs once test passed\n";
	}

	/**
	 * Test luminance calculation for various colors.
	 */
	public static function test_luminance_calculation() {
		// Use reflection to access private method.
		$reflection = new ReflectionClass( 'MASE_Migration' );
		$method = $reflection->getMethod( 'calculate_relative_luminance' );
		$method->setAccessible( true );
		
		// Test white (should be ~1.0).
		$white_luminance = $method->invoke( null, '#ffffff' );
		assert( $white_luminance > 0.9, 'White should have high luminance' );
		
		// Test black (should be ~0.0).
		$black_luminance = $method->invoke( null, '#000000' );
		assert( $black_luminance < 0.1, 'Black should have low luminance' );
		
		// Test dark color (should be < 0.3).
		$dark_luminance = $method->invoke( null, '#1a1a1a' );
		assert( $dark_luminance < 0.3, 'Dark color should have luminance < 0.3' );
		
		// Test light color (should be > 0.3).
		$light_luminance = $method->invoke( null, '#e0e0e0' );
		assert( $light_luminance > 0.3, 'Light color should have luminance > 0.3' );
		
		echo "✓ Luminance calculation test passed\n";
	}

	/**
	 * Test palette luminance detection fallback.
	 */
	public static function test_palette_luminance_detection() {
		global $mock_options, $mock_user_meta;
		$mock_options = array();
		$mock_user_meta = array();
		
		// Create a custom palette without 'type' field.
		$settings = array(
			'palettes' => array(
				'current' => 'custom_test',
				'custom' => array(
					'custom_test' => array(
						'name' => 'Custom Test',
						'admin_bar' => array(
							'bg_color' => '#1a1a1a',
							'text_color' => '#ffffff',
						),
						'admin_menu' => array(
							'bg_color' => '#1a1a1a', // Dark color.
							'text_color' => '#ffffff',
							'hover_bg_color' => '#2a2a2a',
							'hover_text_color' => '#ffffff',
						),
					),
				),
			),
		);
		$mock_options['mase_settings'] = $settings;
		$mock_options['mase_dark_mode_migration_completed'] = false;
		
		// Run migration.
		MASE_Migration::maybe_migrate_dark_mode_settings();
		
		// Verify dark mode was detected based on luminance.
		$updated_settings = get_option( 'mase_settings' );
		assert( $updated_settings['dark_light_toggle']['current_mode'] === 'dark', 'Mode should be dark based on luminance detection' );
		
		echo "✓ Palette luminance detection test passed\n";
	}

	/**
	 * Run all tests.
	 */
	public static function run_all_tests() {
		echo "Running dark mode migration tests...\n\n";
		
		self::test_light_palette_detection();
		self::test_dark_palette_detection();
		self::test_migration_runs_once();
		self::test_luminance_calculation();
		self::test_palette_luminance_detection();
		
		echo "\n✓ All dark mode migration tests passed!\n";
	}
}

// Run tests if executed directly.
if ( php_sapi_name() === 'cli' ) {
	Test_Dark_Mode_Migration::run_all_tests();
}
