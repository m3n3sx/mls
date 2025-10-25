<?php
/**
 * Integration test for dark mode migration.
 *
 * Tests Task 17: Add migration logic for existing users.
 * Requirements: 10.5
 *
 * This test verifies that the migration runs correctly on plugin update.
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
require_once __DIR__ . '/../../includes/class-mase-migration.php';
require_once __DIR__ . '/../../includes/class-mase-cachemanager.php';

/**
 * Test dark mode migration integration.
 */
class Test_Dark_Mode_Migration_Integration {

	/**
	 * Test migration with light palette.
	 */
	public static function test_migration_with_light_palette() {
		echo "Testing migration with light palette...\n";
		
		// Reset migration flag.
		delete_option( 'mase_dark_mode_migration_completed' );
		
		// Set up settings with light palette.
		$settings_obj = new MASE_Settings();
		$settings = $settings_obj->get_defaults();
		$settings['palettes']['current'] = 'professional-blue';
		update_option( 'mase_settings', $settings );
		
		// Run migration.
		MASE_Migration::maybe_migrate_dark_mode_settings();
		
		// Verify results.
		$updated_settings = get_option( 'mase_settings' );
		
		if ( ! isset( $updated_settings['dark_light_toggle'] ) ) {
			echo "✗ FAILED: dark_light_toggle settings not created\n";
			return false;
		}
		
		if ( $updated_settings['dark_light_toggle']['current_mode'] !== 'light' ) {
			echo "✗ FAILED: Mode should be 'light', got: " . $updated_settings['dark_light_toggle']['current_mode'] . "\n";
			return false;
		}
		
		if ( $updated_settings['dark_light_toggle']['light_palette'] !== 'professional-blue' ) {
			echo "✗ FAILED: Light palette should be 'professional-blue', got: " . $updated_settings['dark_light_toggle']['light_palette'] . "\n";
			return false;
		}
		
		// Verify user meta.
		$user_id = get_current_user_id();
		$user_preference = get_user_meta( $user_id, 'mase_dark_mode_preference', true );
		
		if ( $user_preference !== 'light' ) {
			echo "✗ FAILED: User preference should be 'light', got: " . $user_preference . "\n";
			return false;
		}
		
		// Verify migration flag.
		if ( ! get_option( 'mase_dark_mode_migration_completed' ) ) {
			echo "✗ FAILED: Migration flag not set\n";
			return false;
		}
		
		echo "✓ Light palette migration test passed\n";
		return true;
	}

	/**
	 * Test migration with dark palette.
	 */
	public static function test_migration_with_dark_palette() {
		echo "Testing migration with dark palette...\n";
		
		// Reset migration flag.
		delete_option( 'mase_dark_mode_migration_completed' );
		
		// Set up settings with dark palette.
		$settings_obj = new MASE_Settings();
		$settings = $settings_obj->get_defaults();
		$settings['palettes']['current'] = 'dark-elegance';
		update_option( 'mase_settings', $settings );
		
		// Run migration.
		MASE_Migration::maybe_migrate_dark_mode_settings();
		
		// Verify results.
		$updated_settings = get_option( 'mase_settings' );
		
		if ( $updated_settings['dark_light_toggle']['current_mode'] !== 'dark' ) {
			echo "✗ FAILED: Mode should be 'dark', got: " . $updated_settings['dark_light_toggle']['current_mode'] . "\n";
			return false;
		}
		
		if ( $updated_settings['dark_light_toggle']['dark_palette'] !== 'dark-elegance' ) {
			echo "✗ FAILED: Dark palette should be 'dark-elegance', got: " . $updated_settings['dark_light_toggle']['dark_palette'] . "\n";
			return false;
		}
		
		// Verify user meta.
		$user_id = get_current_user_id();
		$user_preference = get_user_meta( $user_id, 'mase_dark_mode_preference', true );
		
		if ( $user_preference !== 'dark' ) {
			echo "✗ FAILED: User preference should be 'dark', got: " . $user_preference . "\n";
			return false;
		}
		
		echo "✓ Dark palette migration test passed\n";
		return true;
	}

	/**
	 * Test that migration doesn't run twice.
	 */
	public static function test_migration_idempotency() {
		echo "Testing migration idempotency...\n";
		
		// Reset migration flag.
		delete_option( 'mase_dark_mode_migration_completed' );
		
		// Set up settings.
		$settings_obj = new MASE_Settings();
		$settings = $settings_obj->get_defaults();
		$settings['palettes']['current'] = 'professional-blue';
		update_option( 'mase_settings', $settings );
		
		// Run migration first time.
		MASE_Migration::maybe_migrate_dark_mode_settings();
		
		// Get settings after first migration.
		$first_settings = get_option( 'mase_settings' );
		$first_mode = $first_settings['dark_light_toggle']['current_mode'];
		
		// Manually change mode to test if migration overwrites.
		$first_settings['dark_light_toggle']['current_mode'] = 'dark';
		update_option( 'mase_settings', $first_settings );
		
		// Run migration second time (should not execute).
		MASE_Migration::maybe_migrate_dark_mode_settings();
		
		// Verify mode wasn't changed back.
		$second_settings = get_option( 'mase_settings' );
		
		if ( $second_settings['dark_light_toggle']['current_mode'] !== 'dark' ) {
			echo "✗ FAILED: Migration ran twice and overwrote manual changes\n";
			return false;
		}
		
		echo "✓ Migration idempotency test passed\n";
		return true;
	}

	/**
	 * Run all integration tests.
	 */
	public static function run_all_tests() {
		echo "\n=== Dark Mode Migration Integration Tests ===\n\n";
		
		$results = array();
		$results[] = self::test_migration_with_light_palette();
		$results[] = self::test_migration_with_dark_palette();
		$results[] = self::test_migration_idempotency();
		
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
	$result = Test_Dark_Mode_Migration_Integration::run_all_tests();
	exit( $result ? 0 : 1 );
}
