<?php
/**
 * MASE Palette Activation Unit Tests
 *
 * Comprehensive unit tests for palette activation AJAX handler functionality.
 * Tests security validation, input validation, palette application, and error handling.
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.2.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Test_Palette_Activation
 *
 * Unit tests for MASE palette activation functionality.
 */
class Test_Palette_Activation extends WP_UnitTestCase {

	/**
	 * MASE_Admin instance.
	 *
	 * @var MASE_Admin
	 */
	private $admin;

	/**
	 * MASE_Settings instance.
	 *
	 * @var MASE_Settings
	 */
	private $settings;

	/**
	 * MASE_CSS_Generator instance.
	 *
	 * @var MASE_CSS_Generator
	 */
	private $generator;

	/**
	 * MASE_CacheManager instance.
	 *
	 * @var MASE_CacheManager
	 */
	private $cache;

	/**
	 * Test user ID with manage_options capability.
	 *
	 * @var int
	 */
	private $admin_user_id;

	/**
	 * Test user ID without manage_options capability.
	 *
	 * @var int
	 */
	private $subscriber_user_id;

	/**
	 * Set up test environment before each test.
	 */
	public function setUp() {
		parent::setUp();

		// Initialize class instances.
		$this->settings  = new MASE_Settings();
		$this->generator = new MASE_CSS_Generator();
		$this->cache     = new MASE_CacheManager();
		$this->admin     = new MASE_Admin( $this->settings, $this->generator, $this->cache );

		// Create test users.
		$this->admin_user_id = $this->factory->user->create( array(
			'role' => 'administrator',
		) );

		$this->subscriber_user_id = $this->factory->user->create( array(
			'role' => 'subscriber',
		) );

		// Clear any existing settings.
		delete_option( 'mase_settings' );
		delete_transient( 'mase_generated_css' );

		// Initialize default settings.
		$this->settings->initialize_defaults();
	}

	/**
	 * Clean up after each test.
	 */
	public function tearDown() {
		// Clean up options and transients.
		delete_option( 'mase_settings' );
		delete_transient( 'mase_generated_css' );

		// Reset current user.
		wp_set_current_user( 0 );

		parent::tearDown();
	}

	// ========================================
	// Test ajax_apply_palette with valid data
	// ========================================

	/**
	 * Test ajax_apply_palette with valid data.
	 *
	 * Verifies that a valid palette can be applied successfully.
	 */
	public function test_ajax_apply_palette_with_valid_data() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		// Set up POST data.
		$_POST['nonce']      = wp_create_nonce( 'mase_save_settings' );
		$_POST['palette_id'] = 'sunset';

		// Capture output.
		ob_start();
		
		try {
			$this->admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_success.
		}
		
		$output = ob_get_clean();

		// Parse JSON response.
		$response = json_decode( $output, true );

		// Verify response structure.
		$this->assertIsArray( $response );
		$this->assertTrue( $response['success'] );
		$this->assertArrayHasKey( 'data', $response );
		$this->assertArrayHasKey( 'message', $response['data'] );
		$this->assertArrayHasKey( 'palette_id', $response['data'] );
		$this->assertArrayHasKey( 'palette_name', $response['data'] );

		// Verify palette was applied.
		$this->assertEquals( 'sunset', $response['data']['palette_id'] );
		$this->assertEquals( 'Sunset', $response['data']['palette_name'] );

		// Verify settings were updated.
		$settings = $this->settings->get_option();
		$this->assertEquals( 'sunset', $settings['palettes']['current'] );
	}

	// ========================================
	// Test ajax_apply_palette with invalid nonce
	// ========================================

	/**
	 * Test ajax_apply_palette with invalid nonce.
	 *
	 * Verifies that requests with invalid nonce are rejected.
	 */
	public function test_ajax_apply_palette_with_invalid_nonce() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		// Set up POST data with invalid nonce.
		$_POST['nonce']      = 'invalid_nonce';
		$_POST['palette_id'] = 'sunset';

		// Expect wp_die to be called.
		$this->expectException( 'WPAjaxDieStopException' );

		$this->admin->ajax_apply_palette();
	}

	// ========================================
	// Test ajax_apply_palette without manage_options capability
	// ========================================

	/**
	 * Test ajax_apply_palette without manage_options capability.
	 *
	 * Verifies that users without manage_options capability are rejected.
	 */
	public function test_ajax_apply_palette_without_manage_options_capability() {
		// Set current user to subscriber (no manage_options capability).
		wp_set_current_user( $this->subscriber_user_id );

		// Set up POST data.
		$_POST['nonce']      = wp_create_nonce( 'mase_save_settings' );
		$_POST['palette_id'] = 'sunset';

		// Capture output.
		ob_start();
		
		try {
			$this->admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_error.
		}
		
		$output = ob_get_clean();

		// Parse JSON response.
		$response = json_decode( $output, true );

		// Verify error response.
		$this->assertIsArray( $response );
		$this->assertFalse( $response['success'] );
		$this->assertArrayHasKey( 'data', $response );
		$this->assertArrayHasKey( 'message', $response['data'] );
		$this->assertStringContainsString( 'Insufficient permissions', $response['data']['message'] );
	}

	// ========================================
	// Test ajax_apply_palette with missing palette_id
	// ========================================

	/**
	 * Test ajax_apply_palette with missing palette_id.
	 *
	 * Verifies that requests without palette_id are rejected.
	 */
	public function test_ajax_apply_palette_with_missing_palette_id() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		// Set up POST data without palette_id.
		$_POST['nonce'] = wp_create_nonce( 'mase_save_settings' );
		// Intentionally not setting $_POST['palette_id'].

		// Capture output.
		ob_start();
		
		try {
			$this->admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_error.
		}
		
		$output = ob_get_clean();

		// Parse JSON response.
		$response = json_decode( $output, true );

		// Verify error response.
		$this->assertIsArray( $response );
		$this->assertFalse( $response['success'] );
		$this->assertArrayHasKey( 'data', $response );
		$this->assertArrayHasKey( 'message', $response['data'] );
		$this->assertStringContainsString( 'Palette ID is required', $response['data']['message'] );
	}

	// ========================================
	// Test ajax_apply_palette with empty palette_id
	// ========================================

	/**
	 * Test ajax_apply_palette with empty palette_id.
	 *
	 * Verifies that requests with empty palette_id are rejected.
	 */
	public function test_ajax_apply_palette_with_empty_palette_id() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		// Set up POST data with empty palette_id.
		$_POST['nonce']      = wp_create_nonce( 'mase_save_settings' );
		$_POST['palette_id'] = '';

		// Capture output.
		ob_start();
		
		try {
			$this->admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_error.
		}
		
		$output = ob_get_clean();

		// Parse JSON response.
		$response = json_decode( $output, true );

		// Verify error response.
		$this->assertIsArray( $response );
		$this->assertFalse( $response['success'] );
		$this->assertArrayHasKey( 'data', $response );
		$this->assertArrayHasKey( 'message', $response['data'] );
		$this->assertStringContainsString( 'Palette ID is required', $response['data']['message'] );
	}

	// ========================================
	// Test ajax_apply_palette with non-existent palette
	// ========================================

	/**
	 * Test ajax_apply_palette with non-existent palette.
	 *
	 * Verifies that requests for non-existent palettes are rejected.
	 */
	public function test_ajax_apply_palette_with_non_existent_palette() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		// Set up POST data with non-existent palette_id.
		$_POST['nonce']      = wp_create_nonce( 'mase_save_settings' );
		$_POST['palette_id'] = 'non-existent-palette';

		// Capture output.
		ob_start();
		
		try {
			$this->admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_error.
		}
		
		$output = ob_get_clean();

		// Parse JSON response.
		$response = json_decode( $output, true );

		// Verify error response.
		$this->assertIsArray( $response );
		$this->assertFalse( $response['success'] );
		$this->assertArrayHasKey( 'data', $response );
		$this->assertArrayHasKey( 'message', $response['data'] );
		$this->assertStringContainsString( 'Palette not found', $response['data']['message'] );
	}

	// ========================================
	// Test ajax_apply_palette with palette application failure
	// ========================================

	/**
	 * Test ajax_apply_palette with palette application failure.
	 *
	 * Verifies that palette application failures are handled correctly.
	 * This test simulates a failure by using a mock settings object.
	 */
	public function test_ajax_apply_palette_with_palette_application_failure() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		// Create a mock settings object that returns error on apply_palette.
		$mock_settings = $this->getMockBuilder( 'MASE_Settings' )
			->setMethods( array( 'get_palette', 'apply_palette' ) )
			->getMock();

		// Mock get_palette to return valid palette.
		$mock_settings->method( 'get_palette' )
			->willReturn( array(
				'id'   => 'sunset',
				'name' => 'Sunset',
			) );

		// Mock apply_palette to return WP_Error.
		$mock_settings->method( 'apply_palette' )
			->willReturn( new WP_Error( 'palette_save_failed', 'Failed to save palette settings' ) );

		// Create admin instance with mock settings.
		$mock_admin = new MASE_Admin( $mock_settings, $this->generator, $this->cache );

		// Set up POST data.
		$_POST['nonce']      = wp_create_nonce( 'mase_save_settings' );
		$_POST['palette_id'] = 'sunset';

		// Capture output.
		ob_start();
		
		try {
			$mock_admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_error.
		}
		
		$output = ob_get_clean();

		// Parse JSON response.
		$response = json_decode( $output, true );

		// Verify error response.
		$this->assertIsArray( $response );
		$this->assertFalse( $response['success'] );
		$this->assertArrayHasKey( 'data', $response );
		$this->assertArrayHasKey( 'message', $response['data'] );
		$this->assertStringContainsString( 'Failed to save palette settings', $response['data']['message'] );
	}

	// ========================================
	// Test cache invalidation is called
	// ========================================

	/**
	 * Test cache invalidation is called.
	 *
	 * Verifies that cache is invalidated after successful palette application.
	 */
	public function test_cache_invalidation_is_called() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		// Set a cached CSS value.
		set_transient( 'mase_generated_css', 'cached_css_content', 3600 );

		// Verify cache exists before applying palette.
		$cached_before = get_transient( 'mase_generated_css' );
		$this->assertNotFalse( $cached_before );

		// Set up POST data.
		$_POST['nonce']      = wp_create_nonce( 'mase_save_settings' );
		$_POST['palette_id'] = 'energetic-green';

		// Capture output.
		ob_start();
		
		try {
			$this->admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_success.
		}
		
		$output = ob_get_clean();

		// Parse JSON response.
		$response = json_decode( $output, true );

		// Verify success.
		$this->assertTrue( $response['success'] );

		// Verify cache was invalidated.
		$cached_after = get_transient( 'mase_generated_css' );
		$this->assertFalse( $cached_after );
	}

	// ========================================
	// Test success response format
	// ========================================

	/**
	 * Test success response format.
	 *
	 * Verifies that success response contains all required fields.
	 */
	public function test_success_response_format() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		// Set up POST data.
		$_POST['nonce']      = wp_create_nonce( 'mase_save_settings' );
		$_POST['palette_id'] = 'creative-purple';

		// Capture output.
		ob_start();
		
		try {
			$this->admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_success.
		}
		
		$output = ob_get_clean();

		// Parse JSON response.
		$response = json_decode( $output, true );

		// Verify response structure.
		$this->assertIsArray( $response );
		$this->assertArrayHasKey( 'success', $response );
		$this->assertTrue( $response['success'] );
		
		$this->assertArrayHasKey( 'data', $response );
		$this->assertIsArray( $response['data'] );
		
		// Verify required data fields.
		$this->assertArrayHasKey( 'message', $response['data'] );
		$this->assertIsString( $response['data']['message'] );
		$this->assertNotEmpty( $response['data']['message'] );
		
		$this->assertArrayHasKey( 'palette_id', $response['data'] );
		$this->assertEquals( 'creative-purple', $response['data']['palette_id'] );
		
		$this->assertArrayHasKey( 'palette_name', $response['data'] );
		$this->assertEquals( 'Creative Purple', $response['data']['palette_name'] );
	}

	// ========================================
	// Test error response formats
	// ========================================

	/**
	 * Test error response format for missing palette_id.
	 *
	 * Verifies that error responses contain proper structure.
	 */
	public function test_error_response_format_missing_palette_id() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		// Set up POST data without palette_id.
		$_POST['nonce'] = wp_create_nonce( 'mase_save_settings' );

		// Capture output.
		ob_start();
		
		try {
			$this->admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_error.
		}
		
		$output = ob_get_clean();

		// Parse JSON response.
		$response = json_decode( $output, true );

		// Verify error response structure.
		$this->assertIsArray( $response );
		$this->assertArrayHasKey( 'success', $response );
		$this->assertFalse( $response['success'] );
		
		$this->assertArrayHasKey( 'data', $response );
		$this->assertIsArray( $response['data'] );
		
		$this->assertArrayHasKey( 'message', $response['data'] );
		$this->assertIsString( $response['data']['message'] );
		$this->assertNotEmpty( $response['data']['message'] );
	}

	/**
	 * Test error response format for insufficient permissions.
	 *
	 * Verifies that permission errors return proper structure.
	 */
	public function test_error_response_format_insufficient_permissions() {
		// Set current user to subscriber.
		wp_set_current_user( $this->subscriber_user_id );

		// Set up POST data.
		$_POST['nonce']      = wp_create_nonce( 'mase_save_settings' );
		$_POST['palette_id'] = 'sunset';

		// Capture output.
		ob_start();
		
		try {
			$this->admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_error.
		}
		
		$output = ob_get_clean();

		// Parse JSON response.
		$response = json_decode( $output, true );

		// Verify error response structure.
		$this->assertIsArray( $response );
		$this->assertFalse( $response['success'] );
		$this->assertArrayHasKey( 'data', $response );
		$this->assertArrayHasKey( 'message', $response['data'] );
		$this->assertStringContainsString( 'Insufficient permissions', $response['data']['message'] );
	}

	/**
	 * Test error response format for non-existent palette.
	 *
	 * Verifies that palette not found errors return proper structure.
	 */
	public function test_error_response_format_palette_not_found() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		// Set up POST data with non-existent palette.
		$_POST['nonce']      = wp_create_nonce( 'mase_save_settings' );
		$_POST['palette_id'] = 'invalid-palette-id';

		// Capture output.
		ob_start();
		
		try {
			$this->admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_error.
		}
		
		$output = ob_get_clean();

		// Parse JSON response.
		$response = json_decode( $output, true );

		// Verify error response structure.
		$this->assertIsArray( $response );
		$this->assertFalse( $response['success'] );
		$this->assertArrayHasKey( 'data', $response );
		$this->assertArrayHasKey( 'message', $response['data'] );
		$this->assertStringContainsString( 'Palette not found', $response['data']['message'] );
	}

	// ========================================
	// Additional integration tests
	// ========================================

	/**
	 * Test applying multiple palettes in sequence.
	 *
	 * Verifies that multiple palette applications work correctly.
	 */
	public function test_apply_multiple_palettes_in_sequence() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		$palettes = array( 'sunset', 'energetic-green', 'dark-elegance' );

		foreach ( $palettes as $palette_id ) {
			// Set up POST data.
			$_POST['nonce']      = wp_create_nonce( 'mase_save_settings' );
			$_POST['palette_id'] = $palette_id;

			// Capture output.
			ob_start();
			
			try {
				$this->admin->ajax_apply_palette();
			} catch ( WPAjaxDieContinueException $e ) {
				// Expected exception from wp_send_json_success.
			}
			
			$output = ob_get_clean();

			// Parse JSON response.
			$response = json_decode( $output, true );

			// Verify success.
			$this->assertTrue( $response['success'] );
			$this->assertEquals( $palette_id, $response['data']['palette_id'] );

			// Verify settings were updated.
			$settings = $this->settings->get_option();
			$this->assertEquals( $palette_id, $settings['palettes']['current'] );
		}
	}

	/**
	 * Test palette application updates admin bar colors.
	 *
	 * Verifies that applying a palette updates admin bar colors.
	 */
	public function test_palette_application_updates_admin_bar_colors() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		// Get palette data.
		$palette = $this->settings->get_palette( 'ocean-breeze' );

		// Set up POST data.
		$_POST['nonce']      = wp_create_nonce( 'mase_save_settings' );
		$_POST['palette_id'] = 'ocean-breeze';

		// Capture output.
		ob_start();
		
		try {
			$this->admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_success.
		}
		
		ob_get_clean();

		// Verify admin bar colors were updated.
		$settings = $this->settings->get_option();
		$this->assertEquals( $palette['admin_bar']['bg_color'], $settings['admin_bar']['bg_color'] );
		$this->assertEquals( $palette['admin_bar']['text_color'], $settings['admin_bar']['text_color'] );
	}

	/**
	 * Test palette application updates admin menu colors.
	 *
	 * Verifies that applying a palette updates admin menu colors.
	 */
	public function test_palette_application_updates_admin_menu_colors() {
		// Set current user to admin.
		wp_set_current_user( $this->admin_user_id );

		// Get palette data.
		$palette = $this->settings->get_palette( 'rose-garden' );

		// Set up POST data.
		$_POST['nonce']      = wp_create_nonce( 'mase_save_settings' );
		$_POST['palette_id'] = 'rose-garden';

		// Capture output.
		ob_start();
		
		try {
			$this->admin->ajax_apply_palette();
		} catch ( WPAjaxDieContinueException $e ) {
			// Expected exception from wp_send_json_success.
		}
		
		ob_get_clean();

		// Verify admin menu colors were updated.
		$settings = $this->settings->get_option();
		$this->assertEquals( $palette['admin_menu']['bg_color'], $settings['admin_menu']['bg_color'] );
		$this->assertEquals( $palette['admin_menu']['text_color'], $settings['admin_menu']['text_color'] );
		$this->assertEquals( $palette['admin_menu']['hover_bg_color'], $settings['admin_menu']['hover_bg_color'] );
		$this->assertEquals( $palette['admin_menu']['hover_text_color'], $settings['admin_menu']['hover_text_color'] );
	}
}
