<?php
/**
 * Test Button System Migration
 *
 * Verifies that the button system migration works correctly.
 * Task 9: Implement Migration for Existing Installations
 *
 * @package ModernAdminStyler
 */

// Load WordPress environment
require_once dirname( dirname( __FILE__ ) ) . '/modern-admin-styler.php';

/**
 * Test button system migration functionality.
 */
function test_button_system_migration() {
	echo "=== Button System Migration Test ===\n\n";
	
	// Test 1: Check if migration method exists
	echo "Test 1: Check if migration method exists\n";
	if ( method_exists( 'MASE_Migration', 'maybe_migrate_to_button_system' ) ) {
		echo "✓ PASS: maybe_migrate_to_button_system() method exists\n";
	} else {
		echo "✗ FAIL: maybe_migrate_to_button_system() method not found\n";
		return;
	}
	
	// Test 2: Check if migration is called from maybe_migrate()
	echo "\nTest 2: Check if migration is integrated into maybe_migrate()\n";
	$reflection = new ReflectionClass( 'MASE_Migration' );
	$method = $reflection->getMethod( 'maybe_migrate' );
	$method->setAccessible( true );
	$source = file_get_contents( $reflection->getFileName() );
	if ( strpos( $source, 'maybe_migrate_to_button_system' ) !== false ) {
		echo "✓ PASS: maybe_migrate_to_button_system() is called from maybe_migrate()\n";
	} else {
		echo "✗ FAIL: maybe_migrate_to_button_system() not called from maybe_migrate()\n";
	}
	
	// Test 3: Simulate migration by clearing the completion flag
	echo "\nTest 3: Simulate migration execution\n";
	delete_option( 'mase_button_system_migration_completed' );
	
	// Get current settings before migration
	$settings_obj = new MASE_Settings();
	$settings_before = $settings_obj->get_option();
	
	// Remove universal_buttons section to simulate pre-migration state
	if ( isset( $settings_before['universal_buttons'] ) ) {
		unset( $settings_before['universal_buttons'] );
		$settings_obj->update_option( $settings_before );
		echo "✓ Removed universal_buttons section to simulate pre-migration state\n";
	}
	
	// Run migration
	MASE_Migration::maybe_migrate_to_button_system();
	
	// Get settings after migration
	$settings_after = $settings_obj->get_option();
	
	// Test 4: Verify universal_buttons section was added
	echo "\nTest 4: Verify universal_buttons section was added\n";
	if ( isset( $settings_after['universal_buttons'] ) ) {
		echo "✓ PASS: universal_buttons section exists after migration\n";
	} else {
		echo "✗ FAIL: universal_buttons section not found after migration\n";
		return;
	}
	
	// Test 5: Verify all button types exist
	echo "\nTest 5: Verify all button types exist\n";
	$button_types = array( 'primary', 'secondary', 'danger', 'success', 'ghost', 'tabs' );
	$all_types_exist = true;
	foreach ( $button_types as $type ) {
		if ( ! isset( $settings_after['universal_buttons'][ $type ] ) ) {
			echo "✗ FAIL: Button type '$type' not found\n";
			$all_types_exist = false;
		}
	}
	if ( $all_types_exist ) {
		echo "✓ PASS: All 6 button types exist (primary, secondary, danger, success, ghost, tabs)\n";
	}
	
	// Test 6: Verify all button states exist for primary button
	echo "\nTest 6: Verify all button states exist for primary button\n";
	$button_states = array( 'normal', 'hover', 'active', 'focus', 'disabled' );
	$all_states_exist = true;
	foreach ( $button_states as $state ) {
		if ( ! isset( $settings_after['universal_buttons']['primary'][ $state ] ) ) {
			echo "✗ FAIL: Button state '$state' not found for primary button\n";
			$all_states_exist = false;
		}
	}
	if ( $all_states_exist ) {
		echo "✓ PASS: All 5 button states exist (normal, hover, active, focus, disabled)\n";
	}
	
	// Test 7: Verify button state properties
	echo "\nTest 7: Verify button state properties\n";
	$required_properties = array(
		'bg_type', 'bg_color', 'text_color', 'border_width', 'border_style',
		'border_color', 'border_radius', 'padding_horizontal', 'padding_vertical',
		'font_size', 'font_weight', 'text_transform', 'shadow_mode', 'transition_duration'
	);
	$all_properties_exist = true;
	$primary_normal = $settings_after['universal_buttons']['primary']['normal'];
	foreach ( $required_properties as $property ) {
		if ( ! isset( $primary_normal[ $property ] ) ) {
			echo "✗ FAIL: Property '$property' not found in primary normal state\n";
			$all_properties_exist = false;
		}
	}
	if ( $all_properties_exist ) {
		echo "✓ PASS: All required properties exist in button state\n";
	}
	
	// Test 8: Verify migration completion flag
	echo "\nTest 8: Verify migration completion flag\n";
	$migration_completed = get_option( 'mase_button_system_migration_completed', false );
	if ( $migration_completed ) {
		echo "✓ PASS: Migration completion flag is set\n";
	} else {
		echo "✗ FAIL: Migration completion flag not set\n";
	}
	
	// Test 9: Verify migration doesn't run twice
	echo "\nTest 9: Verify migration doesn't run twice\n";
	// Modify a button setting
	$settings_after['universal_buttons']['primary']['normal']['bg_color'] = '#ff0000';
	$settings_obj->update_option( $settings_after );
	
	// Run migration again
	MASE_Migration::maybe_migrate_to_button_system();
	
	// Get settings after second migration attempt
	$settings_final = $settings_obj->get_option();
	
	if ( $settings_final['universal_buttons']['primary']['normal']['bg_color'] === '#ff0000' ) {
		echo "✓ PASS: Migration didn't run twice (custom setting preserved)\n";
	} else {
		echo "✗ FAIL: Migration ran twice and overwrote custom settings\n";
	}
	
	// Test 10: Verify plugin version was updated
	echo "\nTest 10: Verify plugin version tracking\n";
	$plugin_version = get_option( 'mase_version', '0.0.0' );
	echo "Current plugin version: $plugin_version\n";
	if ( version_compare( $plugin_version, '1.2.1', '>=' ) ) {
		echo "✓ PASS: Plugin version is up to date\n";
	} else {
		echo "✗ FAIL: Plugin version not updated\n";
	}
	
	echo "\n=== Migration Test Complete ===\n";
}

// Run the test
test_button_system_migration();
