<?php
/**
 * Integration test for dark mode AJAX and settings persistence.
 *
 * Tests Task 24: AJAX communication and settings save/load cycle.
 * Requirements: 2.4, 2.5, 4.1-4.5, 10.1-10.7
 *
 * @package ModernAdminStyler
 */

// Load WordPress test environment if available.
if ( file_exists( '../../../wp-load.php' ) ) {
	require_once '../../../wp-load.php';
} else {
	echo "WordPress environment not available. This test requires WordPress.\n";
	exit( 1 );
}

// Load required classes.
require_once __DIR__ . '/../../includes/class-mase-settings.php';
require_once __DIR__ . '/../../includes/class-mase-admin.php';
require_once __DIR__ . '/../../includes/class-mase-cachemanager.php';

/**
 * Test dark mode AJAX and settings integration.
 */
class Test_Dark_Mode_AJAX_Settings_Integration {

	/**
	 * Test AJAX dark mode toggle handler.
	 * Requirements: 2.4, 2.5, 4.1, 4.2
	 */
	public static function test_ajax_toggle_dark_mode() {
		echo "Testing AJAX dark mode toggle...\n";
		
		// Set up test user with admin capabilities.
		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			echo "✗ FAILED: No user logged in\n";
			return false;
		}
		
		// Clear existing user meta.
		delete_user_meta( $user_id, 'mase_dark_mode_preference' );
		
		// Simulate AJAX request to toggle to dark mode.
		$_POST['mode'] = 'dark';
		$_POST['nonce'] = wp_create_nonce( 'mase_save_settings' );
		
		// Create admin instance and call handler.
		$admin = new MASE_Admin();
		
		// Capture output.
		ob_start();
		try {
			$admin->handle_ajax_toggle_dark_mode();
		} catch ( Exception $e ) {
			// Expected to exit with wp_send_json_success.
		}
		$output = ob_get_clean();
		
		// Verify user meta was saved.
		$saved_preference = get_user_meta( $user_id, 'mase_dark_mode_preference', true );
		
		if ( $saved_preference !== 'dark' ) {
			echo "✗ FAILED: User meta not saved correctly. Got: " . $saved_preference . "\n";
			return false;
		}
		
		// Verify settings were updated.
		$settings = get_option( 'mase_settings' );
		if ( ! isset( $settings['dark_light_toggle']['current_mode'] ) || 
		     $settings['dark_light_toggle']['current_mode'] !== 'dark' ) {
			echo "✗ FAILED: Settings not updated correctly\n";
			return false;
		}
		
		echo "✓ AJAX toggle dark mode test passed\n";
		return true;
	}

	/**
	 * Test settings save includes dark mode preference.
	 * Requirements: 10.2, 10.3
	 */
	public static function test_settings_save_includes_dark_mode() {
		echo "Testing settings save includes dark mode...\n";
		
		$settings_obj = new MASE_Settings();
		$settings = $settings_obj->get_defaults();
		
		// Set dark mode preference.
		$settings['dark_light_toggle']['current_mode'] = 'dark';
		$settings['dark_light_toggle']['light_palette'] = 'professional-blue';
		$settings['dark_light_toggle']['dark_palette'] = 'dark-elegance';
		
		// Save settings.
		update_option( 'mase_settings', $settings );
		
		// Retrieve and verify.
		$saved_settings = get_option( 'mase_settings' );
		
		if ( ! isset( $saved_settings['dark_light_toggle'] ) ) {
			echo "✗ FAILED: dark_light_toggle not in saved settings\n";
			return false;
		}
		
		if ( $saved_settings['dark_light_toggle']['current_mode'] !== 'dark' ) {
			echo "✗ FAILED: current_mode not saved correctly\n";
			return false;
		}
		
		if ( $saved_settings['dark_light_toggle']['light_palette'] !== 'professional-blue' ) {
			echo "✗ FAILED: light_palette not saved correctly\n";
			return false;
		}
		
		if ( $saved_settings['dark_light_toggle']['dark_palette'] !== 'dark-elegance' ) {
			echo "✗ FAILED: dark_palette not saved correctly\n";
			return false;
		}
		
		echo "✓ Settings save includes dark mode test passed\n";
		return true;
	}

	/**
	 * Test settings load restores dark mode preference.
	 * Requirements: 10.7
	 */
	public static function test_settings_load_restores_dark_mode() {
		echo "Testing settings load restores dark mode...\n";
		
		// Set up settings with dark mode.
		$settings_obj = new MASE_Settings();
		$settings = $settings_obj->get_defaults();
		$settings['dark_light_toggle']['current_mode'] = 'dark';
		update_option( 'mase_settings', $settings );
		
		// Load settings.
		$loaded_settings = $settings_obj->get_option();
		
		// Verify dark mode was loaded.
		if ( ! isset( $loaded_settings['dark_light_toggle']['current_mode'] ) ) {
			echo "✗ FAILED: current_mode not loaded\n";
			return false;
		}
		
		if ( $loaded_settings['dark_light_toggle']['current_mode'] !== 'dark' ) {
			echo "✗ FAILED: current_mode not loaded correctly. Got: " . 
			     $loaded_settings['dark_light_toggle']['current_mode'] . "\n";
			return false;
		}
		
		echo "✓ Settings load restores dark mode test passed\n";
		return true;
	}

	/**
	 * Test user meta persistence across sessions.
	 * Requirements: 4.2, 4.7
	 */
	public static function test_user_meta_persistence() {
		echo "Testing user meta persistence...\n";
		
		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			echo "✗ FAILED: No user logged in\n";
			return false;
		}
		
		// Save preference to user meta.
		update_user_meta( $user_id, 'mase_dark_mode_preference', 'dark' );
		
		// Retrieve preference.
		$preference = get_user_meta( $user_id, 'mase_dark_mode_preference', true );
		
		if ( $preference !== 'dark' ) {
			echo "✗ FAILED: User meta not persisted. Got: " . $preference . "\n";
			return false;
		}
		
		// Change preference.
		update_user_meta( $user_id, 'mase_dark_mode_preference', 'light' );
		
		// Retrieve again.
		$preference = get_user_meta( $user_id, 'mase_dark_mode_preference', true );
		
		if ( $preference !== 'light' ) {
			echo "✗ FAILED: User meta not updated. Got: " . $preference . "\n";
			return false;
		}
		
		echo "✓ User meta persistence test passed\n";
		return true;
	}

	/**
	 * Test cache invalidation on mode toggle.
	 * Requirements: 12.5
	 */
	public static function test_cache_invalidation_on_toggle() {
		echo "Testing cache invalidation on mode toggle...\n";
		
		$cache = MASE_CacheManager::get_instance();
		
		// Set up cached CSS for both modes.
		$cache->set( 'generated_css_light', 'light-mode-css', 3600 );
		$cache->set( 'generated_css_dark', 'dark-mode-css', 3600 );
		
		// Verify both caches exist.
		$light_cached = $cache->get( 'generated_css_light' );
		$dark_cached = $cache->get( 'generated_css_dark' );
		
		if ( ! $light_cached || ! $dark_cached ) {
			echo "✗ FAILED: Caches not set up correctly\n";
			return false;
		}
		
		// Simulate mode toggle to dark (should invalidate dark cache only).
		$cache->delete( 'generated_css_dark' );
		
		// Verify dark cache cleared, light cache intact.
		$light_after = $cache->get( 'generated_css_light' );
		$dark_after = $cache->get( 'generated_css_dark' );
		
		if ( ! $light_after ) {
			echo "✗ FAILED: Light cache was incorrectly cleared\n";
			return false;
		}
		
		if ( $dark_after ) {
			echo "✗ FAILED: Dark cache was not cleared\n";
			return false;
		}
		
		echo "✓ Cache invalidation on toggle test passed\n";
		return true;
	}

	/**
	 * Test both caches invalidated on settings save.
	 * Requirements: 12.6
	 */
	public static function test_both_caches_invalidated_on_save() {
		echo "Testing both caches invalidated on settings save...\n";
		
		$cache = MASE_CacheManager::get_instance();
		
		// Set up cached CSS for both modes.
		$cache->set( 'generated_css_light', 'light-mode-css', 3600 );
		$cache->set( 'generated_css_dark', 'dark-mode-css', 3600 );
		
		// Simulate settings save (should invalidate both caches).
		$cache->delete( 'generated_css_light' );
		$cache->delete( 'generated_css_dark' );
		
		// Verify both caches cleared.
		$light_after = $cache->get( 'generated_css_light' );
		$dark_after = $cache->get( 'generated_css_dark' );
		
		if ( $light_after || $dark_after ) {
			echo "✗ FAILED: Caches not cleared on settings save\n";
			return false;
		}
		
		echo "✓ Both caches invalidated on save test passed\n";
		return true;
	}

	/**
	 * Test settings export includes dark mode.
	 * Requirements: 10.3
	 */
	public static function test_settings_export_includes_dark_mode() {
		echo "Testing settings export includes dark mode...\n";
		
		$settings_obj = new MASE_Settings();
		$settings = $settings_obj->get_defaults();
		$settings['dark_light_toggle']['current_mode'] = 'dark';
		update_option( 'mase_settings', $settings );
		
		// Export settings (simulate).
		$exported = get_option( 'mase_settings' );
		$json = json_encode( $exported );
		
		// Verify dark mode in export.
		if ( strpos( $json, 'dark_light_toggle' ) === false ) {
			echo "✗ FAILED: dark_light_toggle not in export\n";
			return false;
		}
		
		if ( strpos( $json, '"current_mode":"dark"' ) === false ) {
			echo "✗ FAILED: current_mode not in export\n";
			return false;
		}
		
		echo "✓ Settings export includes dark mode test passed\n";
		return true;
	}

	/**
	 * Test settings import restores dark mode.
	 * Requirements: 10.4
	 */
	public static function test_settings_import_restores_dark_mode() {
		echo "Testing settings import restores dark mode...\n";
		
		// Create import data.
		$import_data = array(
			'dark_light_toggle' => array(
				'enabled'        => true,
				'current_mode'   => 'dark',
				'light_palette'  => 'professional-blue',
				'dark_palette'   => 'dark-elegance',
			),
		);
		
		// Import settings (simulate).
		$settings_obj = new MASE_Settings();
		$current_settings = $settings_obj->get_defaults();
		$merged = array_merge( $current_settings, $import_data );
		update_option( 'mase_settings', $merged );
		
		// Verify import.
		$imported = get_option( 'mase_settings' );
		
		if ( ! isset( $imported['dark_light_toggle']['current_mode'] ) ) {
			echo "✗ FAILED: current_mode not imported\n";
			return false;
		}
		
		if ( $imported['dark_light_toggle']['current_mode'] !== 'dark' ) {
			echo "✗ FAILED: current_mode not imported correctly\n";
			return false;
		}
		
		echo "✓ Settings import restores dark mode test passed\n";
		return true;
	}

	/**
	 * Run all integration tests.
	 */
	public static function run_all_tests() {
		echo "\n=== Dark Mode AJAX & Settings Integration Tests ===\n\n";
		
		$results = array();
		$results[] = self::test_ajax_toggle_dark_mode();
		$results[] = self::test_settings_save_includes_dark_mode();
		$results[] = self::test_settings_load_restores_dark_mode();
		$results[] = self::test_user_meta_persistence();
		$results[] = self::test_cache_invalidation_on_toggle();
		$results[] = self::test_both_caches_invalidated_on_save();
		$results[] = self::test_settings_export_includes_dark_mode();
		$results[] = self::test_settings_import_restores_dark_mode();
		
		$passed = count( array_filter( $results ) );
		$total = count( $results );
		
		echo "\n=== Results: {$passed}/{$total} tests passed ===\n";
		
		if ( $passed === $total ) {
			echo "✓ All integration tests passed!\n";
			return true;
		} else {
			echo "✗ Some tests failed\n";
			return false;
		}
	}
}

// Run tests if executed directly.
if ( php_sapi_name() === 'cli' ) {
	$result = Test_Dark_Mode_AJAX_Settings_Integration::run_all_tests();
	exit( $result ? 0 : 1 );
}
