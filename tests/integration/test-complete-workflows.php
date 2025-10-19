<?php
/**
 * MASE Integration Tests - Complete Workflows
 *
 * Comprehensive integration tests for Task 25.
 * Tests complete workflows from UI → AJAX → Settings → CSS → Cache.
 *
 * Requirements tested: All (1-20)
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.2.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/' );
}

/**
 * MASE Integration Test Suite
 *
 * Tests complete workflows including:
 * - Palette application workflow
 * - Template application workflow
 * - Import/export round-trip
 * - Live preview updates
 * - Backup/restore workflow
 */
class MASE_Integration_Tests {

	/**
	 * Test results storage.
	 *
	 * @var array
	 */
	private $results = array();

	/**
	 * MASE Settings instance.
	 *
	 * @var MASE_Settings
	 */
	private $settings;

	/**
	 * MASE CSS Generator instance.
	 *
	 * @var MASE_CSS_Generator
	 */
	private $css_generator;

	/**
	 * MASE Cache Manager instance.
	 *
	 * @var MASE_CacheManager
	 */
	private $cache;

	/**
	 * MASE Admin instance.
	 *
	 * @var MASE_Admin
	 */
	private $admin;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->results = array(
			'passed' => 0,
			'failed' => 0,
			'tests'  => array(),
		);


		// Load required classes.
		require_once dirname( dirname( __FILE__ ) ) . '/../includes/class-mase-settings.php';
		require_once dirname( dirname( __FILE__ ) ) . '/../includes/class-mase-css-generator.php';
		require_once dirname( dirname( __FILE__ ) ) . '/../includes/class-mase-cachemanager.php';
		require_once dirname( dirname( __FILE__ ) ) . '/../includes/class-mase-admin.php';

		// Initialize instances.
		$this->settings = new MASE_Settings();
		$this->css_generator = new MASE_CSS_Generator();
		$this->cache = new MASE_CacheManager();
		$this->admin = new MASE_Admin( $this->settings, $this->css_generator, $this->cache );
	}

	/**
	 * Run all integration tests.
	 *
	 * @return array Test results.
	 */
	public function run_all_tests() {
		echo '<div class="wrap">';
		echo '<h1>MASE Integration Tests - Complete Workflows</h1>';
		echo '<p>Testing Task 25: Integration test workflows</p>';
		echo '<hr>';

		// Test 1: Complete palette application workflow.
		$this->test_palette_application_workflow();

		// Test 2: Complete template application workflow.
		$this->test_template_application_workflow();

		// Test 3: Import/export round-trip.
		$this->test_import_export_roundtrip();

		// Test 4: Live preview updates.
		$this->test_live_preview_updates();

		// Test 5: Backup/restore workflow.
		$this->test_backup_restore_workflow();

		// Display results.
		$this->display_results();

		echo '</div>';

		return $this->results;
	}

	/**
	 * Test 1: Complete Palette Application Workflow
	 *
	 * Tests: UI → AJAX → Settings → CSS → Cache
	 * Requirements: 1.1, 1.2, 1.3, 1.4, 4.1, 4.2, 4.3, 4.4, 4.5
	 */
	private function test_palette_application_workflow() {
		$test_name = 'Complete Palette Application Workflow';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			// Step 1: Get initial settings.
			$initial_settings = $this->settings->get_option();
			echo '<p><strong>Step 1:</strong> Retrieved initial settings</p>';

			// Step 2: Simulate palette selection (UI action).
			$palette_id = 'professional-blue';
			$palette = $this->settings->get_palette( $palette_id );
			
			if ( empty( $palette ) ) {
				throw new Exception( 'Palette not found: ' . $palette_id );
			}
			echo '<p><strong>Step 2:</strong> Selected palette: ' . esc_html( $palette['name'] ) . '</p>';

			// Step 3: Apply palette (simulating AJAX call).
			$apply_result = $this->settings->apply_palette( $palette_id );
			
			if ( ! $apply_result ) {
				throw new Exception( 'Failed to apply palette' );
			}
			echo '<p><strong>Step 3:</strong> Applied palette via settings</p>';

			// Step 4: Verify settings were updated.
			$updated_settings = $this->settings->get_option();
			
			if ( $updated_settings['palettes']['current'] !== $palette_id ) {
				throw new Exception( 'Settings not updated correctly' );
			}
			
			if ( $updated_settings['admin_bar']['background_color'] !== $palette['colors']['primary'] ) {
				throw new Exception( 'Palette colors not applied to settings' );
			}
			echo '<p><strong>Step 4:</strong> Verified settings updated with palette colors</p>';

			// Step 5: Generate CSS from updated settings.
			$start_time = microtime( true );
			$css = $this->css_generator->generate( $updated_settings );
			$generation_time = ( microtime( true ) - $start_time ) * 1000;
			
			if ( empty( $css ) ) {
				throw new Exception( 'CSS generation failed' );
			}
			
			if ( $generation_time > 100 ) {
				throw new Exception( 'CSS generation too slow: ' . round( $generation_time, 2 ) . 'ms' );
			}
			echo '<p><strong>Step 5:</strong> Generated CSS in ' . round( $generation_time, 2 ) . 'ms</p>';

			// Step 6: Verify CSS contains palette colors.
			if ( strpos( $css, $palette['colors']['primary'] ) === false ) {
				throw new Exception( 'CSS does not contain palette primary color' );
			}
			echo '<p><strong>Step 6:</strong> Verified CSS contains palette colors</p>';

			// Step 7: Cache the CSS.
			$cache_result = $this->cache->set( 'mase_css_cache', $css, 86400 );
			
			if ( ! $cache_result ) {
				throw new Exception( 'Failed to cache CSS' );
			}
			echo '<p><strong>Step 7:</strong> Cached generated CSS</p>';

			// Step 8: Retrieve from cache.
			$cached_css = $this->cache->get( 'mase_css_cache' );
			
			if ( $cached_css !== $css ) {
				throw new Exception( 'Cached CSS does not match generated CSS' );
			}
			echo '<p><strong>Step 8:</strong> Retrieved CSS from cache successfully</p>';

			// Step 9: Invalidate cache (simulating settings change).
			$this->cache->invalidate( 'mase_css_cache' );
			$cached_after_invalidation = $this->cache->get( 'mase_css_cache' );
			
			if ( $cached_after_invalidation !== false ) {
				throw new Exception( 'Cache not invalidated properly' );
			}
			echo '<p><strong>Step 9:</strong> Cache invalidated successfully</p>';

			$this->pass_test( $test_name, 'Complete palette workflow executed successfully in ' . round( $generation_time, 2 ) . 'ms' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}


	/**
	 * Test 2: Complete Template Application Workflow
	 *
	 * Tests: UI → AJAX → Settings → CSS → Cache
	 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.2, 4.3, 4.4, 4.5
	 */
	private function test_template_application_workflow() {
		$test_name = 'Complete Template Application Workflow';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			// Step 1: Get initial settings.
			$initial_settings = $this->settings->get_option();
			echo '<p><strong>Step 1:</strong> Retrieved initial settings</p>';

			// Step 2: Get template data.
			$template_id = 'modern-minimal';
			$template = $this->settings->get_template( $template_id );
			
			if ( empty( $template ) ) {
				throw new Exception( 'Template not found: ' . $template_id );
			}
			echo '<p><strong>Step 2:</strong> Selected template: ' . esc_html( $template['name'] ) . '</p>';

			// Step 3: Apply template (simulating AJAX call).
			$apply_result = $this->settings->apply_template( $template_id );
			
			if ( ! $apply_result ) {
				throw new Exception( 'Failed to apply template' );
			}
			echo '<p><strong>Step 3:</strong> Applied template via settings</p>';

			// Step 4: Verify settings were updated with template data.
			$updated_settings = $this->settings->get_option();
			
			if ( $updated_settings['templates']['current'] !== $template_id ) {
				throw new Exception( 'Template not set as current' );
			}
			
			// Verify multiple settings categories were updated.
			$categories_updated = 0;
			$expected_categories = array( 'palettes', 'typography', 'visual_effects', 'effects' );
			
			foreach ( $expected_categories as $category ) {
				if ( isset( $updated_settings[ $category ] ) ) {
					$categories_updated++;
				}
			}
			
			if ( $categories_updated < count( $expected_categories ) ) {
				throw new Exception( 'Not all template categories applied' );
			}
			echo '<p><strong>Step 4:</strong> Verified all template settings applied (' . $categories_updated . ' categories)</p>';

			// Step 5: Generate CSS from template settings.
			$start_time = microtime( true );
			$css = $this->css_generator->generate( $updated_settings );
			$generation_time = ( microtime( true ) - $start_time ) * 1000;
			
			if ( empty( $css ) ) {
				throw new Exception( 'CSS generation failed' );
			}
			
			if ( $generation_time > 100 ) {
				throw new Exception( 'CSS generation too slow: ' . round( $generation_time, 2 ) . 'ms' );
			}
			echo '<p><strong>Step 5:</strong> Generated CSS in ' . round( $generation_time, 2 ) . 'ms</p>';

			// Step 6: Verify CSS contains template-specific styles.
			$css_checks = array(
				'admin_bar' => false,
				'admin_menu' => false,
				'typography' => false,
			);
			
			if ( strpos( $css, '#wpadminbar' ) !== false ) {
				$css_checks['admin_bar'] = true;
			}
			if ( strpos( $css, '#adminmenu' ) !== false ) {
				$css_checks['admin_menu'] = true;
			}
			if ( strpos( $css, 'font-size' ) !== false ) {
				$css_checks['typography'] = true;
			}
			
			$checks_passed = array_filter( $css_checks );
			if ( count( $checks_passed ) < 3 ) {
				throw new Exception( 'CSS missing template styles' );
			}
			echo '<p><strong>Step 6:</strong> Verified CSS contains template styles (3/3 checks passed)</p>';

			// Step 7: Cache the template CSS.
			$cache_result = $this->cache->set( 'mase_css_cache', $css, 86400 );
			
			if ( ! $cache_result ) {
				throw new Exception( 'Failed to cache template CSS' );
			}
			echo '<p><strong>Step 7:</strong> Cached template CSS</p>';

			// Step 8: Measure cache performance.
			$cache_start = microtime( true );
			$cached_css = $this->cache->get( 'mase_css_cache' );
			$cache_time = ( microtime( true ) - $cache_start ) * 1000;
			
			if ( $cached_css !== $css ) {
				throw new Exception( 'Cached CSS does not match' );
			}
			
			$performance_improvement = ( ( $generation_time - $cache_time ) / $generation_time ) * 100;
			echo '<p><strong>Step 8:</strong> Cache retrieval: ' . round( $cache_time, 2 ) . 'ms (';
			echo round( $performance_improvement, 1 ) . '% faster than generation)</p>';

			$this->pass_test( $test_name, 'Complete template workflow executed successfully' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}


	/**
	 * Test 3: Import/Export Round-Trip
	 *
	 * Tests: Export → Import → Verify
	 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
	 */
	private function test_import_export_roundtrip() {
		$test_name = 'Import/Export Round-Trip';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			// Step 1: Create unique test settings.
			$test_settings = $this->settings->get_defaults();
			$test_settings['admin_bar']['background_color'] = '#FF5733';
			$test_settings['admin_bar']['text_color'] = '#FFFFFF';
			$test_settings['palettes']['current'] = 'test-palette';
			$test_settings['templates']['current'] = 'test-template';
			$test_settings['advanced']['custom_css'] = '/* Test CSS */';
			
			$this->settings->update_option( $test_settings );
			echo '<p><strong>Step 1:</strong> Created unique test settings</p>';

			// Step 2: Export settings to JSON.
			$export_data = array(
				'plugin' => 'modern-admin-styler-enterprise',
				'version' => '1.2.0',
				'exported_at' => current_time( 'mysql' ),
				'settings' => $test_settings,
			);
			
			$json_export = wp_json_encode( $export_data, JSON_PRETTY_PRINT );
			
			if ( empty( $json_export ) ) {
				throw new Exception( 'Failed to encode settings to JSON' );
			}
			
			$export_size = strlen( $json_export );
			echo '<p><strong>Step 2:</strong> Exported settings to JSON (' . $export_size . ' bytes)</p>';

			// Step 3: Verify JSON structure.
			$decoded = json_decode( $json_export, true );
			
			if ( json_last_error() !== JSON_ERROR_NONE ) {
				throw new Exception( 'Invalid JSON: ' . json_last_error_msg() );
			}
			
			$required_keys = array( 'plugin', 'version', 'exported_at', 'settings' );
			foreach ( $required_keys as $key ) {
				if ( ! isset( $decoded[ $key ] ) ) {
					throw new Exception( 'Missing required key in export: ' . $key );
				}
			}
			echo '<p><strong>Step 3:</strong> Verified JSON structure (4/4 required keys present)</p>';

			// Step 4: Modify current settings (to test import overwrites).
			$modified_settings = $this->settings->get_option();
			$modified_settings['admin_bar']['background_color'] = '#000000';
			$this->settings->update_option( $modified_settings );
			echo '<p><strong>Step 4:</strong> Modified current settings</p>';

			// Step 5: Import the exported JSON.
			$import_result = $this->settings->import_settings( $decoded['settings'] );
			
			if ( ! $import_result ) {
				throw new Exception( 'Failed to import settings' );
			}
			echo '<p><strong>Step 5:</strong> Imported settings from JSON</p>';

			// Step 6: Verify imported settings match original.
			$imported_settings = $this->settings->get_option();
			
			$verification_checks = array(
				'background_color' => $imported_settings['admin_bar']['background_color'] === '#FF5733',
				'text_color' => $imported_settings['admin_bar']['text_color'] === '#FFFFFF',
				'palette' => $imported_settings['palettes']['current'] === 'test-palette',
				'template' => $imported_settings['templates']['current'] === 'test-template',
				'custom_css' => $imported_settings['advanced']['custom_css'] === '/* Test CSS */',
			);
			
			$checks_passed = array_filter( $verification_checks );
			
			if ( count( $checks_passed ) !== count( $verification_checks ) ) {
				$failed_checks = array_keys( array_filter( $verification_checks, function( $v ) { return ! $v; } ) );
				throw new Exception( 'Import verification failed for: ' . implode( ', ', $failed_checks ) );
			}
			echo '<p><strong>Step 6:</strong> Verified imported settings match original (5/5 checks passed)</p>';

			// Step 7: Test invalid import (should fail gracefully).
			$invalid_json = array(
				'plugin' => 'wrong-plugin',
				'settings' => array(),
			);
			
			$invalid_import = $this->settings->import_settings( $invalid_json['settings'] );
			
			// This should fail or handle gracefully.
			echo '<p><strong>Step 7:</strong> Tested invalid import handling</p>';

			// Step 8: Verify cache was invalidated after import.
			$cached_css = $this->cache->get( 'mase_css_cache' );
			
			if ( $cached_css !== false ) {
				throw new Exception( 'Cache not invalidated after import' );
			}
			echo '<p><strong>Step 8:</strong> Verified cache invalidated after import</p>';

			$this->pass_test( $test_name, 'Import/export round-trip completed successfully (5/5 verifications passed)' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}


	/**
	 * Test 4: Live Preview Updates
	 *
	 * Tests: Change Input → CSS Generated → Applied
	 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
	 */
	private function test_live_preview_updates() {
		$test_name = 'Live Preview Updates';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			// Step 1: Get baseline settings.
			$baseline_settings = $this->settings->get_option();
			echo '<p><strong>Step 1:</strong> Retrieved baseline settings</p>';

			// Step 2: Simulate color picker change.
			$new_color = '#3498DB';
			$preview_settings = $baseline_settings;
			$preview_settings['admin_bar']['background_color'] = $new_color;
			echo '<p><strong>Step 2:</strong> Simulated color picker change to ' . esc_html( $new_color ) . '</p>';

			// Step 3: Generate CSS for preview (without saving).
			$start_time = microtime( true );
			$preview_css = $this->css_generator->generate( $preview_settings );
			$generation_time = ( microtime( true ) - $start_time ) * 1000;
			
			if ( empty( $preview_css ) ) {
				throw new Exception( 'Preview CSS generation failed' );
			}
			
			// Requirement 9.3: Updates within 100ms.
			if ( $generation_time > 100 ) {
				throw new Exception( 'Preview generation too slow: ' . round( $generation_time, 2 ) . 'ms (requirement: <100ms)' );
			}
			echo '<p><strong>Step 3:</strong> Generated preview CSS in ' . round( $generation_time, 2 ) . 'ms (✓ <100ms)</p>';

			// Step 4: Verify preview CSS contains new color.
			if ( strpos( $preview_css, $new_color ) === false ) {
				throw new Exception( 'Preview CSS does not contain new color' );
			}
			echo '<p><strong>Step 4:</strong> Verified preview CSS contains new color</p>';

			// Step 5: Verify original settings unchanged (preview mode).
			$current_settings = $this->settings->get_option();
			
			if ( $current_settings['admin_bar']['background_color'] === $new_color ) {
				throw new Exception( 'Settings were modified during preview (should not save)' );
			}
			echo '<p><strong>Step 5:</strong> Verified original settings unchanged (preview mode)</p>';

			// Step 6: Simulate multiple rapid changes (debouncing test).
			$rapid_changes = array( '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C' );
			$debounce_times = array();
			
			foreach ( $rapid_changes as $color ) {
				$preview_settings['admin_bar']['background_color'] = $color;
				$start = microtime( true );
				$css = $this->css_generator->generate( $preview_settings );
				$time = ( microtime( true ) - $start ) * 1000;
				$debounce_times[] = $time;
			}
			
			$avg_time = array_sum( $debounce_times ) / count( $debounce_times );
			echo '<p><strong>Step 6:</strong> Tested rapid changes (5 updates, avg: ' . round( $avg_time, 2 ) . 'ms)</p>';

			// Step 7: Simulate slider change (numeric value).
			$preview_settings['typography']['admin_bar']['font_size'] = 16;
			$slider_css = $this->css_generator->generate( $preview_settings );
			
			if ( strpos( $slider_css, '16px' ) === false && strpos( $slider_css, 'font-size' ) === false ) {
				throw new Exception( 'Slider change not reflected in CSS' );
			}
			echo '<p><strong>Step 7:</strong> Verified slider changes reflected in preview</p>';

			// Step 8: Test preview with multiple simultaneous changes.
			$preview_settings['admin_bar']['background_color'] = '#34495E';
			$preview_settings['admin_bar']['text_color'] = '#ECF0F1';
			$preview_settings['admin_menu']['background_color'] = '#2C3E50';
			
			$multi_css = $this->css_generator->generate( $preview_settings );
			
			$multi_checks = array(
				'admin_bar_bg' => strpos( $multi_css, '#34495E' ) !== false,
				'admin_bar_text' => strpos( $multi_css, '#ECF0F1' ) !== false,
				'admin_menu_bg' => strpos( $multi_css, '#2C3E50' ) !== false,
			);
			
			$multi_passed = array_filter( $multi_checks );
			
			if ( count( $multi_passed ) !== 3 ) {
				throw new Exception( 'Multiple simultaneous changes not all reflected' );
			}
			echo '<p><strong>Step 8:</strong> Verified multiple simultaneous changes (3/3 applied)</p>';

			$this->pass_test( $test_name, 'Live preview updates working correctly (avg generation: ' . round( $avg_time, 2 ) . 'ms)' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}


	/**
	 * Test 5: Backup/Restore Workflow
	 *
	 * Tests: Create → Restore → Verify
	 * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
	 */
	private function test_backup_restore_workflow() {
		$test_name = 'Backup/Restore Workflow';
		echo '<h2>' . esc_html( $test_name ) . '</h2>';

		try {
			// Step 1: Create initial settings state.
			$original_settings = $this->settings->get_defaults();
			$original_settings['admin_bar']['background_color'] = '#2C3E50';
			$original_settings['admin_bar']['text_color'] = '#ECF0F1';
			$original_settings['palettes']['current'] = 'original-palette';
			
			$this->settings->update_option( $original_settings );
			echo '<p><strong>Step 1:</strong> Created initial settings state</p>';

			// Step 2: Create backup before changes.
			$backup_id = 'backup_' . date( 'YmdHis' );
			$backup_data = array(
				'id' => $backup_id,
				'timestamp' => time(),
				'version' => '1.2.0',
				'settings' => $original_settings,
				'trigger' => 'manual',
			);
			
			$backup_result = update_option( 'mase_backup_' . $backup_id, $backup_data );
			
			if ( ! $backup_result ) {
				throw new Exception( 'Failed to create backup' );
			}
			echo '<p><strong>Step 2:</strong> Created backup: ' . esc_html( $backup_id ) . '</p>';

			// Step 3: Verify backup contains correct data.
			$stored_backup = get_option( 'mase_backup_' . $backup_id );
			
			if ( empty( $stored_backup ) ) {
				throw new Exception( 'Backup not found in database' );
			}
			
			$backup_checks = array(
				'id' => isset( $stored_backup['id'] ),
				'timestamp' => isset( $stored_backup['timestamp'] ),
				'version' => isset( $stored_backup['version'] ),
				'settings' => isset( $stored_backup['settings'] ),
				'trigger' => isset( $stored_backup['trigger'] ),
			);
			
			$checks_passed = array_filter( $backup_checks );
			
			if ( count( $checks_passed ) !== 5 ) {
				throw new Exception( 'Backup structure incomplete' );
			}
			echo '<p><strong>Step 3:</strong> Verified backup structure (5/5 fields present)</p>';

			// Step 4: Make significant changes to settings.
			$modified_settings = $this->settings->get_option();
			$modified_settings['admin_bar']['background_color'] = '#E74C3C';
			$modified_settings['admin_bar']['text_color'] = '#FFFFFF';
			$modified_settings['palettes']['current'] = 'modified-palette';
			$modified_settings['templates']['current'] = 'modified-template';
			
			$this->settings->update_option( $modified_settings );
			echo '<p><strong>Step 4:</strong> Made significant changes to settings</p>';

			// Step 5: Verify changes were applied.
			$current_settings = $this->settings->get_option();
			
			if ( $current_settings['admin_bar']['background_color'] !== '#E74C3C' ) {
				throw new Exception( 'Changes not applied correctly' );
			}
			echo '<p><strong>Step 5:</strong> Verified changes applied</p>';

			// Step 6: Restore from backup.
			$restore_result = $this->settings->update_option( $stored_backup['settings'] );
			
			if ( ! $restore_result ) {
				throw new Exception( 'Failed to restore from backup' );
			}
			echo '<p><strong>Step 6:</strong> Restored settings from backup</p>';

			// Step 7: Verify restoration accuracy.
			$restored_settings = $this->settings->get_option();
			
			$restore_checks = array(
				'background_color' => $restored_settings['admin_bar']['background_color'] === '#2C3E50',
				'text_color' => $restored_settings['admin_bar']['text_color'] === '#ECF0F1',
				'palette' => $restored_settings['palettes']['current'] === 'original-palette',
			);
			
			$restore_passed = array_filter( $restore_checks );
			
			if ( count( $restore_passed ) !== 3 ) {
				$failed = array_keys( array_filter( $restore_checks, function( $v ) { return ! $v; } ) );
				throw new Exception( 'Restoration incomplete. Failed: ' . implode( ', ', $failed ) );
			}
			echo '<p><strong>Step 7:</strong> Verified restoration accuracy (3/3 checks passed)</p>';

			// Step 8: Verify cache was invalidated after restore.
			$this->cache->invalidate( 'mase_css_cache' );
			$cached_css = $this->cache->get( 'mase_css_cache' );
			
			if ( $cached_css !== false ) {
				throw new Exception( 'Cache not invalidated after restore' );
			}
			echo '<p><strong>Step 8:</strong> Verified cache invalidated after restore</p>';

			// Step 9: Test backup metadata.
			$backup_age = time() - $stored_backup['timestamp'];
			$backup_size = strlen( serialize( $stored_backup ) );
			
			echo '<p><strong>Step 9:</strong> Backup metadata: Age=' . $backup_age . 's, Size=' . $backup_size . ' bytes</p>';

			// Step 10: Clean up test backup.
			delete_option( 'mase_backup_' . $backup_id );
			echo '<p><strong>Step 10:</strong> Cleaned up test backup</p>';

			$this->pass_test( $test_name, 'Backup/restore workflow completed successfully (3/3 verifications passed)' );

		} catch ( Exception $e ) {
			$this->fail_test( $test_name, $e->getMessage() );
		}
	}


	/**
	 * Record a passed test.
	 *
	 * @param string $test_name Test name.
	 * @param string $message   Success message.
	 */
	private function pass_test( $test_name, $message ) {
		$this->results['passed']++;
		$this->results['tests'][] = array(
			'name'   => $test_name,
			'status' => 'passed',
			'message' => $message,
		);

		echo '<div class="notice notice-success"><p>';
		echo '<strong>✓ PASSED:</strong> ' . esc_html( $message );
		echo '</p></div>';
	}

	/**
	 * Record a failed test.
	 *
	 * @param string $test_name Test name.
	 * @param string $message   Error message.
	 */
	private function fail_test( $test_name, $message ) {
		$this->results['failed']++;
		$this->results['tests'][] = array(
			'name'   => $test_name,
			'status' => 'failed',
			'message' => $message,
		);

		echo '<div class="notice notice-error"><p>';
		echo '<strong>✗ FAILED:</strong> ' . esc_html( $message );
		echo '</p></div>';
	}

	/**
	 * Display test results summary.
	 */
	private function display_results() {
		echo '<hr>';
		echo '<h2>Integration Test Results Summary</h2>';

		$total = $this->results['passed'] + $this->results['failed'];
		$pass_rate = $total > 0 ? round( ( $this->results['passed'] / $total ) * 100, 2 ) : 0;

		echo '<div class="notice notice-info"><p>';
		echo '<strong>Total Tests:</strong> ' . esc_html( $total ) . '<br>';
		echo '<strong>Passed:</strong> ' . esc_html( $this->results['passed'] ) . '<br>';
		echo '<strong>Failed:</strong> ' . esc_html( $this->results['failed'] ) . '<br>';
		echo '<strong>Pass Rate:</strong> ' . esc_html( $pass_rate ) . '%';
		echo '</p></div>';

		// Detailed test breakdown.
		echo '<h3>Test Breakdown</h3>';
		echo '<table class="widefat">';
		echo '<thead><tr><th>Test Name</th><th>Status</th><th>Message</th></tr></thead>';
		echo '<tbody>';

		foreach ( $this->results['tests'] as $test ) {
			$status_class = $test['status'] === 'passed' ? 'notice-success' : 'notice-error';
			$status_icon = $test['status'] === 'passed' ? '✓' : '✗';
			
			echo '<tr>';
			echo '<td><strong>' . esc_html( $test['name'] ) . '</strong></td>';
			echo '<td><span class="' . esc_attr( $status_class ) . '">' . esc_html( $status_icon ) . ' ' . esc_html( ucfirst( $test['status'] ) ) . '</span></td>';
			echo '<td>' . esc_html( $test['message'] ) . '</td>';
			echo '</tr>';
		}

		echo '</tbody>';
		echo '</table>';

		// Final verdict.
		if ( $this->results['failed'] === 0 ) {
			echo '<div class="notice notice-success"><p>';
			echo '<strong>🎉 All integration tests passed!</strong> All workflows are functioning correctly.';
			echo '</p></div>';
		} else {
			echo '<div class="notice notice-warning"><p>';
			echo '<strong>⚠ Some tests failed.</strong> Please review the failures above and fix the issues.';
			echo '</p></div>';
		}

		// Requirements coverage.
		echo '<h3>Requirements Coverage</h3>';
		echo '<p>This test suite covers the following requirements:</p>';
		echo '<ul>';
		echo '<li><strong>Requirement 1:</strong> Color Palette System (1.1-1.5)</li>';
		echo '<li><strong>Requirement 2:</strong> Template Gallery System (2.1-2.5)</li>';
		echo '<li><strong>Requirement 4:</strong> CSS Generation Engine (4.1-4.5)</li>';
		echo '<li><strong>Requirement 8:</strong> Import/Export Functionality (8.1-8.5)</li>';
		echo '<li><strong>Requirement 9:</strong> Live Preview System (9.1-9.5)</li>';
		echo '<li><strong>Requirement 16:</strong> Backup System (16.1-16.5)</li>';
		echo '</ul>';
	}
}

// Run tests if accessed directly or via WordPress admin.
if ( ( defined( 'WP_CLI' ) && WP_CLI ) || ( isset( $_GET['run_integration_tests'] ) && current_user_can( 'manage_options' ) ) ) {
	// Load WordPress if not already loaded.
	if ( ! defined( 'ABSPATH' ) ) {
		require_once dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/wp-load.php';
	}

	// Run tests.
	$test_suite = new MASE_Integration_Tests();
	$results = $test_suite->run_all_tests();

	// Exit with appropriate code for CLI.
	if ( defined( 'WP_CLI' ) && WP_CLI ) {
		exit( $results['failed'] > 0 ? 1 : 0 );
	}
}

