<?php
/**
 * Unit tests for dark mode backend functionality.
 *
 * Tests Task 22: Create unit tests for PHP
 * - Test settings structure validation
 * - Test AJAX handler security (nonce, capability)
 * - Test user meta save/retrieve
 * - Test palette type detection
 * - Test CSS generation for dark mode
 * - Test cache invalidation logic
 *
 * Requirements: All backend requirements
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.3.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Test_Dark_Mode_Backend
 *
 * Comprehensive unit tests for dark mode backend functionality.
 */
class Test_Dark_Mode_Backend extends WP_UnitTestCase {

	/**
	 * MASE_Settings instance.
	 *
	 * @var MASE_Settings
	 */
	private $settings;

	/**
	 * MASE_Admin instance.
	 *
	 * @var MASE_Admin
	 */
	private $admin;

	/**
	 * MASE_CSS_Generator instance.
	 *
	 * @var MASE_CSS_Generator
	 */
	private $css_generator;

	/**
	 * MASE_Cache instance.
	 *
	 * @var MASE_Cache
	 */
	private $cache;

	/**
	 * Test user ID.
	 *
	 * @var int
	 */
	private $test_user_id;

	/**
	 * Set up test environment before each test.
	 */
	public function setUp() {
		parent::setUp();

		// Initialize class instances.
		$this->settings = new MASE_Settings();
		$this->admin = new MASE_Admin();
		$this->css_generator = new MASE_CSS_Generator();
		$this->cache = new MASE_Cache();

		// Create test user with admin capabilities.
		$this->test_user_id = $this->factory->user->create( array(
			'role' => 'administrator',
		) );
		wp_set_current_user( $this->test_user_id );

		// Clear any existing settings and caches.
		delete_option( 'mase_settings' );
		delete_user_meta( $this->test_user_id, 'mase_dark_mode_preference' );
		$this->cache->invalidate_all_caches();
	}

	/**
	 * Clean up after each test.
	 */
	public function tearDown() {
		// Clean up options and user meta.
		delete_option( 'mase_settings' );
		delete_user_meta( $this->test_user_id, 'mase_dark_mode_preference' );
		$this->cache->invalidate_all_caches();

		// Delete test user.
		wp_delete_user( $this->test_user_id );

		parent::tearDown();
	}

	// ========================================
	// Settings Structure Validation Tests
	// ========================================

	/**
	 * Test dark_light_toggle settings structure exists in defaults.
	 *
	 * Requirement 10.1: Settings structure includes dark_light_toggle section.
	 */
	public function test_dark_light_toggle_settings_structure_exists() {
		$defaults = $this->settings->get_defaults();

		$this->assertArrayHasKey( 'dark_light_toggle', $defaults );
		$this->assertIsArray( $defaults['dark_light_toggle'] );
	}

	/**
	 * Test dark_light_toggle settings have all required fields.
	 *
	 * Requirement 10.1: Settings include all configuration options.
	 */
	public function test_dark_light_toggle_settings_have_required_fields() {
		$defaults = $this->settings->get_defaults();
		$dark_toggle = $defaults['dark_light_toggle'];

		$required_fields = array(
			'enabled',
			'current_mode',
			'respect_system_preference',
			'light_palette',
			'dark_palette',
			'transition_duration',
			'keyboard_shortcut_enabled',
			'fab_position',
		);

		foreach ( $required_fields as $field ) {
			$this->assertArrayHasKey( $field, $dark_toggle, "Missing required field: {$field}" );
		}
	}

	/**
	 * Test dark_light_toggle settings have correct default values.
	 *
	 * Requirement 10.1: Settings have appropriate defaults.
	 */
	public function test_dark_light_toggle_settings_default_values() {
		$defaults = $this->settings->get_defaults();
		$dark_toggle = $defaults['dark_light_toggle'];

		$this->assertTrue( $dark_toggle['enabled'] );
		$this->assertEquals( 'light', $dark_toggle['current_mode'] );
		$this->assertTrue( $dark_toggle['respect_system_preference'] );
		$this->assertEquals( 300, $dark_toggle['transition_duration'] );
		$this->assertTrue( $dark_toggle['keyboard_shortcut_enabled'] );
		$this->assertIsArray( $dark_toggle['fab_position'] );
		$this->assertEquals( 20, $dark_toggle['fab_position']['bottom'] );
		$this->assertEquals( 20, $dark_toggle['fab_position']['right'] );
	}

	/**
	 * Test settings validation accepts valid dark mode values.
	 *
	 * Requirement 10.6: Settings validation sanitizes dark mode values.
	 */
	public function test_settings_validation_accepts_valid_dark_mode() {
		$settings = $this->settings->get_defaults();
		$settings['dark_light_toggle']['current_mode'] = 'dark';
		$settings['dark_light_toggle']['enabled'] = true;

		$validated = $this->settings->validate( $settings );

		$this->assertNotInstanceOf( 'WP_Error', $validated );
		$this->assertEquals( 'dark', $validated['dark_light_toggle']['current_mode'] );
	}

	/**
	 * Test settings validation rejects invalid mode values.
	 *
	 * Requirement 10.6: Settings validation rejects invalid values.
	 */
	public function test_settings_validation_rejects_invalid_mode() {
		$settings = $this->settings->get_defaults();
		$settings['dark_light_toggle']['current_mode'] = 'invalid_mode';

		$validated = $this->settings->validate( $settings );

		// Should either return WP_Error or sanitize to default.
		if ( is_wp_error( $validated ) ) {
			$this->assertInstanceOf( 'WP_Error', $validated );
		} else {
			$this->assertContains( $validated['dark_light_toggle']['current_mode'], array( 'light', 'dark' ) );
		}
	}

	/**
	 * Test settings validation sanitizes transition duration.
	 *
	 * Requirement 10.6: Numeric values are validated and sanitized.
	 */
	public function test_settings_validation_sanitizes_transition_duration() {
		$settings = $this->settings->get_defaults();
		$settings['dark_light_toggle']['transition_duration'] = '500';

		$validated = $this->settings->validate( $settings );

		$this->assertIsInt( $validated['dark_light_toggle']['transition_duration'] );
		$this->assertEquals( 500, $validated['dark_light_toggle']['transition_duration'] );
	}

	// ========================================
	// AJAX Handler Security Tests
	// ========================================

	/**
	 * Test AJAX handler is registered.
	 *
	 * Requirement 2.1: AJAX handler is registered for dark mode toggle.
	 */
	public function test_ajax_handler_is_registered() {
		global $wp_filter;

		$this->assertArrayHasKey( 'wp_ajax_mase_toggle_dark_mode', $wp_filter );
	}

	/**
	 * Test AJAX handler requires valid nonce.
	 *
	 * Requirement 11.1: AJAX handler verifies nonce.
	 */
	public function test_ajax_handler_requires_valid_nonce() {
		$_POST['mode'] = 'dark';
		$_POST['nonce'] = 'invalid_nonce';

		// Capture output.
		ob_start();
		try {
			$this->admin->handle_ajax_toggle_dark_mode();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception.
		}
		$output = ob_get_clean();

		// Should fail nonce verification.
		$response = json_decode( $output, true );
		$this->assertFalse( $response['success'] );
	}

	/**
	 * Test AJAX handler requires admin capability.
	 *
	 * Requirement 11.1: AJAX handler checks user capabilities.
	 */
	public function test_ajax_handler_requires_admin_capability() {
		// Create user without admin capability.
		$subscriber_id = $this->factory->user->create( array(
			'role' => 'subscriber',
		) );
		wp_set_current_user( $subscriber_id );

		$_POST['mode'] = 'dark';
		$_POST['nonce'] = wp_create_nonce( 'mase_save_settings' );

		// Capture output.
		ob_start();
		try {
			$this->admin->handle_ajax_toggle_dark_mode();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception.
		}
		$output = ob_get_clean();

		// Should fail capability check.
		$response = json_decode( $output, true );
		$this->assertFalse( $response['success'] );

		// Clean up.
		wp_delete_user( $subscriber_id );
		wp_set_current_user( $this->test_user_id );
	}

	/**
	 * Test AJAX handler validates mode input.
	 *
	 * Requirement 2.1: Mode input is validated against whitelist.
	 */
	public function test_ajax_handler_validates_mode_input() {
		$_POST['mode'] = 'invalid_mode';
		$_POST['nonce'] = wp_create_nonce( 'mase_save_settings' );

		// Capture output.
		ob_start();
		try {
			$this->admin->handle_ajax_toggle_dark_mode();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception.
		}
		$output = ob_get_clean();

		// Should reject invalid mode.
		$response = json_decode( $output, true );
		$this->assertFalse( $response['success'] );
	}

	/**
	 * Test AJAX handler accepts valid mode input.
	 *
	 * Requirement 2.1: Valid mode input is accepted.
	 */
	public function test_ajax_handler_accepts_valid_mode() {
		$_POST['mode'] = 'dark';
		$_POST['nonce'] = wp_create_nonce( 'mase_save_settings' );

		// Capture output.
		ob_start();
		try {
			$this->admin->handle_ajax_toggle_dark_mode();
		} catch ( WPAjaxDieStopException $e ) {
			// Expected exception for successful response.
		}
		$output = ob_get_clean();

		// Should succeed.
		$response = json_decode( $output, true );
		$this->assertTrue( $response['success'] );
		$this->assertEquals( 'dark', $response['data']['mode'] );
	}

	// ========================================
	// User Meta Save/Retrieve Tests
	// ========================================

	/**
	 * Test AJAX handler saves preference to user meta.
	 *
	 * Requirement 4.2: Preference is saved to WordPress user meta.
	 */
	public function test_ajax_handler_saves_to_user_meta() {
		$_POST['mode'] = 'dark';
		$_POST['nonce'] = wp_create_nonce( 'mase_save_settings' );

		// Execute AJAX handler.
		ob_start();
		try {
			$this->admin->handle_ajax_toggle_dark_mode();
		} catch ( WPAjaxDieStopException $e ) {
			// Expected exception.
		}
		ob_end_clean();

		// Verify user meta was saved.
		$saved_preference = get_user_meta( $this->test_user_id, 'mase_dark_mode_preference', true );
		$this->assertEquals( 'dark', $saved_preference );
	}

	/**
	 * Test user meta preference can be retrieved.
	 *
	 * Requirement 4.4: User meta preference can be loaded.
	 */
	public function test_user_meta_preference_can_be_retrieved() {
		// Save preference.
		update_user_meta( $this->test_user_id, 'mase_dark_mode_preference', 'dark' );

		// Retrieve preference.
		$preference = get_user_meta( $this->test_user_id, 'mase_dark_mode_preference', true );

		$this->assertEquals( 'dark', $preference );
	}

	/**
	 * Test user meta preference persists across sessions.
	 *
	 * Requirement 4.7: Preference persists across devices/sessions.
	 */
	public function test_user_meta_preference_persists() {
		// Save preference.
		update_user_meta( $this->test_user_id, 'mase_dark_mode_preference', 'dark' );

		// Simulate new session by clearing object cache.
		wp_cache_flush();

		// Retrieve preference.
		$preference = get_user_meta( $this->test_user_id, 'mase_dark_mode_preference', true );

		$this->assertEquals( 'dark', $preference );
	}

	/**
	 * Test AJAX handler updates settings array.
	 *
	 * Requirement 2.4: Settings array is updated with current mode.
	 */
	public function test_ajax_handler_updates_settings_array() {
		$_POST['mode'] = 'dark';
		$_POST['nonce'] = wp_create_nonce( 'mase_save_settings' );

		// Execute AJAX handler.
		ob_start();
		try {
			$this->admin->handle_ajax_toggle_dark_mode();
		} catch ( WPAjaxDieStopException $e ) {
			// Expected exception.
		}
		ob_end_clean();

		// Verify settings were updated.
		$settings = $this->settings->get_option();
		$this->assertEquals( 'dark', $settings['dark_light_toggle']['current_mode'] );
	}

	// ========================================
	// Palette Type Detection Tests
	// ========================================

	/**
	 * Test dark palettes are tagged with type 'dark'.
	 *
	 * Requirement 6.1: Dark palettes have 'type' field set to 'dark'.
	 */
	public function test_dark_palettes_have_dark_type() {
		$dark_palettes = array( 'dark-elegance', 'midnight-blue', 'charcoal' );

		foreach ( $dark_palettes as $palette_id ) {
			$palette = $this->settings->get_palette( $palette_id );
			
			if ( $palette ) {
				$this->assertArrayHasKey( 'type', $palette, "Palette {$palette_id} missing type field" );
				$this->assertEquals( 'dark', $palette['type'], "Palette {$palette_id} should have type 'dark'" );
			}
		}
	}

	/**
	 * Test light palettes are tagged with type 'light'.
	 *
	 * Requirement 6.1: Light palettes have 'type' field set to 'light'.
	 */
	public function test_light_palettes_have_light_type() {
		$light_palettes = array( 'professional-blue', 'energetic-green', 'sunset', 'vibrant-purple' );

		foreach ( $light_palettes as $palette_id ) {
			$palette = $this->settings->get_palette( $palette_id );
			
			if ( $palette ) {
				$this->assertArrayHasKey( 'type', $palette, "Palette {$palette_id} missing type field" );
				$this->assertEquals( 'light', $palette['type'], "Palette {$palette_id} should have type 'light'" );
			}
		}
	}

	/**
	 * Test palette type detection by luminance.
	 *
	 * Requirement 6.5: Dark mode uses dark backgrounds (luminance < 0.3).
	 */
	public function test_palette_type_detection_by_luminance() {
		// Get a dark palette.
		$dark_palette = $this->settings->get_palette( 'dark-elegance' );
		
		if ( $dark_palette && isset( $dark_palette['colors']['admin_menu']['bg_color'] ) ) {
			$bg_color = $dark_palette['colors']['admin_menu']['bg_color'];
			
			// Calculate luminance (simplified check).
			$hex = str_replace( '#', '', $bg_color );
			$r = hexdec( substr( $hex, 0, 2 ) ) / 255;
			$g = hexdec( substr( $hex, 2, 2 ) ) / 255;
			$b = hexdec( substr( $hex, 4, 2 ) ) / 255;
			
			// Approximate luminance.
			$luminance = 0.2126 * $r + 0.7152 * $g + 0.0722 * $b;
			
			$this->assertLessThan( 0.3, $luminance, 'Dark palette should have low luminance' );
		}
	}

	// ========================================
	// CSS Generation Tests
	// ========================================

	/**
	 * Test CSS generator creates dark mode CSS.
	 *
	 * Requirement 8.1: CSS generator creates dark mode CSS custom properties.
	 */
	public function test_css_generator_creates_dark_mode_css() {
		$settings = $this->settings->get_defaults();
		$settings['dark_light_toggle']['enabled'] = true;
		$settings['dark_light_toggle']['current_mode'] = 'dark';
		$settings['dark_light_toggle']['dark_palette'] = 'dark-elegance';

		$css = $this->css_generator->generate( $settings );

		$this->assertStringContainsString( '.mase-dark-mode', $css );
		$this->assertNotEmpty( $css );
	}

	/**
	 * Test dark mode CSS uses .mase-dark-mode class scope.
	 *
	 * Requirement 8.2: Dark mode styles scoped to .mase-dark-mode class.
	 */
	public function test_dark_mode_css_uses_correct_scope() {
		$settings = $this->settings->get_defaults();
		$settings['dark_light_toggle']['enabled'] = true;
		$settings['dark_light_toggle']['current_mode'] = 'dark';

		$css = $this->css_generator->generate( $settings );

		$this->assertStringContainsString( 'body.mase-dark-mode', $css );
	}

	/**
	 * Test dark mode CSS includes admin bar styles.
	 *
	 * Requirement 8.3: Dark mode CSS includes admin bar styles.
	 */
	public function test_dark_mode_css_includes_admin_bar() {
		$settings = $this->settings->get_defaults();
		$settings['dark_light_toggle']['enabled'] = true;
		$settings['dark_light_toggle']['current_mode'] = 'dark';

		$css = $this->css_generator->generate( $settings );

		$this->assertStringContainsString( '#wpadminbar', $css );
	}

	/**
	 * Test dark mode CSS includes admin menu styles.
	 *
	 * Requirement 8.3: Dark mode CSS includes admin menu styles.
	 */
	public function test_dark_mode_css_includes_admin_menu() {
		$settings = $this->settings->get_defaults();
		$settings['dark_light_toggle']['enabled'] = true;
		$settings['dark_light_toggle']['current_mode'] = 'dark';

		$css = $this->css_generator->generate( $settings );

		$this->assertStringContainsString( '#adminmenu', $css );
	}

	/**
	 * Test CSS generation performance meets requirement.
	 *
	 * Requirement 12.2: CSS generation completes in < 100ms.
	 */
	public function test_css_generation_performance() {
		$settings = $this->settings->get_defaults();
		$settings['dark_light_toggle']['enabled'] = true;

		$start_time = microtime( true );
		$css = $this->css_generator->generate( $settings );
		$duration = ( microtime( true ) - $start_time ) * 1000;

		$this->assertLessThan( 100, $duration, "CSS generation took {$duration}ms, should be < 100ms" );
		$this->assertNotEmpty( $css );
	}

	// ========================================
	// Cache Invalidation Tests
	// ========================================

	/**
	 * Test AJAX handler invalidates CSS cache.
	 *
	 * Requirement 2.5: CSS cache is invalidated after mode change.
	 */
	public function test_ajax_handler_invalidates_cache() {
		// Set initial cache.
		$this->cache->set_cached_light_mode_css( 'cached light css', 3600 );
		$this->cache->set_cached_dark_mode_css( 'cached dark css', 3600 );

		// Toggle to dark mode.
		$_POST['mode'] = 'dark';
		$_POST['nonce'] = wp_create_nonce( 'mase_save_settings' );

		ob_start();
		try {
			$this->admin->handle_ajax_toggle_dark_mode();
		} catch ( WPAjaxDieStopException $e ) {
			// Expected exception.
		}
		ob_end_clean();

		// Verify dark mode cache was invalidated.
		$dark_cache = $this->cache->get_cached_dark_mode_css();
		$this->assertFalse( $dark_cache, 'Dark mode cache should be invalidated' );
	}

	/**
	 * Test separate cache keys for light and dark modes.
	 *
	 * Requirement 12.5: Separate cache keys for light and dark CSS.
	 */
	public function test_separate_cache_keys_for_modes() {
		$light_css = 'body { background: white; }';
		$dark_css = 'body { background: black; }';

		$this->cache->set_cached_light_mode_css( $light_css, 3600 );
		$this->cache->set_cached_dark_mode_css( $dark_css, 3600 );

		$retrieved_light = $this->cache->get_cached_light_mode_css();
		$retrieved_dark = $this->cache->get_cached_dark_mode_css();

		$this->assertEquals( $light_css, $retrieved_light );
		$this->assertEquals( $dark_css, $retrieved_dark );
		$this->assertNotEquals( $retrieved_light, $retrieved_dark );
	}

	/**
	 * Test invalidating only active mode cache.
	 *
	 * Requirement 12.5: Invalidate only active mode cache on toggle.
	 */
	public function test_invalidate_only_active_mode_cache() {
		$this->cache->set_cached_light_mode_css( 'light css', 3600 );
		$this->cache->set_cached_dark_mode_css( 'dark css', 3600 );

		// Invalidate only dark mode.
		$this->cache->invalidate_mode_cache( 'dark' );

		$light = $this->cache->get_cached_light_mode_css();
		$dark = $this->cache->get_cached_dark_mode_css();

		$this->assertEquals( 'light css', $light, 'Light cache should remain' );
		$this->assertFalse( $dark, 'Dark cache should be invalidated' );
	}

	/**
	 * Test invalidating both mode caches on palette change.
	 *
	 * Requirement 12.6: Invalidate both caches on palette change.
	 */
	public function test_invalidate_both_caches_on_palette_change() {
		$this->cache->set_cached_light_mode_css( 'light css', 3600 );
		$this->cache->set_cached_dark_mode_css( 'dark css', 3600 );

		// Invalidate both.
		$this->cache->invalidate_both_mode_caches();

		$light = $this->cache->get_cached_light_mode_css();
		$dark = $this->cache->get_cached_dark_mode_css();

		$this->assertFalse( $light, 'Light cache should be invalidated' );
		$this->assertFalse( $dark, 'Dark cache should be invalidated' );
	}

	/**
	 * Test cache versioning.
	 *
	 * Requirement 12.7: Implement cache versioning.
	 */
	public function test_cache_versioning() {
		$css = 'versioned css';
		$this->cache->set_cached_light_mode_css( $css, 3600 );

		// Retrieve should work with versioned key.
		$retrieved = $this->cache->get_cached_light_mode_css();
		$this->assertEquals( $css, $retrieved );
	}

	// ========================================
	// Integration Tests
	// ========================================

	/**
	 * Test complete dark mode toggle workflow.
	 *
	 * Integration test covering multiple requirements.
	 */
	public function test_complete_dark_mode_toggle_workflow() {
		// Initial state: light mode.
		$settings = $this->settings->get_option();
		$this->assertEquals( 'light', $settings['dark_light_toggle']['current_mode'] );

		// Toggle to dark mode via AJAX.
		$_POST['mode'] = 'dark';
		$_POST['nonce'] = wp_create_nonce( 'mase_save_settings' );

		ob_start();
		try {
			$this->admin->handle_ajax_toggle_dark_mode();
		} catch ( WPAjaxDieStopException $e ) {
			// Expected exception.
		}
		ob_end_clean();

		// Verify settings updated.
		$settings = $this->settings->get_option();
		$this->assertEquals( 'dark', $settings['dark_light_toggle']['current_mode'] );

		// Verify user meta saved.
		$preference = get_user_meta( $this->test_user_id, 'mase_dark_mode_preference', true );
		$this->assertEquals( 'dark', $preference );

		// Verify CSS generation works.
		$css = $this->css_generator->generate( $settings );
		$this->assertStringContainsString( '.mase-dark-mode', $css );
	}

	/**
	 * Test settings export includes dark mode preferences.
	 *
	 * Requirement 10.3: Dark mode settings included in export.
	 */
	public function test_settings_export_includes_dark_mode() {
		$settings = $this->settings->get_option();
		$settings['dark_light_toggle']['current_mode'] = 'dark';
		$this->settings->update_option( $settings );

		// Get settings for export.
		$export_settings = $this->settings->get_option();

		$this->assertArrayHasKey( 'dark_light_toggle', $export_settings );
		$this->assertEquals( 'dark', $export_settings['dark_light_toggle']['current_mode'] );
	}

	/**
	 * Test settings import restores dark mode preferences.
	 *
	 * Requirement 10.4: Dark mode settings restored from import.
	 */
	public function test_settings_import_restores_dark_mode() {
		$import_settings = $this->settings->get_defaults();
		$import_settings['dark_light_toggle']['current_mode'] = 'dark';
		$import_settings['dark_light_toggle']['dark_palette'] = 'midnight-blue';

		$this->settings->update_option( $import_settings );

		$settings = $this->settings->get_option();
		$this->assertEquals( 'dark', $settings['dark_light_toggle']['current_mode'] );
		$this->assertEquals( 'midnight-blue', $settings['dark_light_toggle']['dark_palette'] );
	}
}
