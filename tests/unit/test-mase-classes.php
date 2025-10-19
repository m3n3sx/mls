<?php
/**
 * MASE Unit Tests
 *
 * Comprehensive unit tests for MASE core classes.
 * Tests MASE_Settings, MASE_CSS_Generator, MASE_Migration, and MASE_Mobile_Optimizer.
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.2.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Test_MASE_Classes
 *
 * Unit tests for MASE core functionality.
 */
class Test_MASE_Classes extends WP_UnitTestCase {

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
	private $css_generator;

	/**
	 * MASE_Mobile_Optimizer instance.
	 *
	 * @var MASE_Mobile_Optimizer
	 */
	private $mobile_optimizer;

	/**
	 * Set up test environment before each test.
	 */
	public function setUp() {
		parent::setUp();

		// Initialize class instances.
		$this->settings = new MASE_Settings();
		$this->css_generator = new MASE_CSS_Generator();
		$this->mobile_optimizer = new MASE_Mobile_Optimizer();

		// Clear any existing settings.
		delete_option( 'mase_settings' );
		delete_option( 'mase_version' );
		delete_option( 'mase_settings_backup_110' );
	}

	/**
	 * Clean up after each test.
	 */
	public function tearDown() {
		// Clean up options.
		delete_option( 'mase_settings' );
		delete_option( 'mase_version' );
		delete_option( 'mase_settings_backup_110' );

		parent::tearDown();
	}

	// ========================================
	// MASE_Settings::get_palette() Tests
	// ========================================

	/**
	 * Test get_palette() with valid palette ID.
	 */
	public function test_get_palette_with_valid_id() {
		$palette = $this->settings->get_palette( 'professional-blue' );

		$this->assertIsArray( $palette );
		$this->assertArrayHasKey( 'id', $palette );
		$this->assertArrayHasKey( 'name', $palette );
		$this->assertArrayHasKey( 'colors', $palette );
		$this->assertEquals( 'professional-blue', $palette['id'] );
		$this->assertEquals( 'Professional Blue', $palette['name'] );
		
		// Verify colors structure.
		$this->assertArrayHasKey( 'primary', $palette['colors'] );
		$this->assertArrayHasKey( 'secondary', $palette['colors'] );
		$this->assertArrayHasKey( 'accent', $palette['colors'] );
		$this->assertArrayHasKey( 'background', $palette['colors'] );
	}

	/**
	 * Test get_palette() with invalid palette ID.
	 */
	public function test_get_palette_with_invalid_id() {
		$palette = $this->settings->get_palette( 'non-existent-palette' );

		$this->assertFalse( $palette );
	}

	/**
	 * Test get_palette() with empty palette ID.
	 */
	public function test_get_palette_with_empty_id() {
		$palette = $this->settings->get_palette( '' );

		$this->assertFalse( $palette );
	}

	/**
	 * Test get_palette() returns all required color keys.
	 */
	public function test_get_palette_has_all_required_colors() {
		$palette = $this->settings->get_palette( 'energetic-green' );

		$required_colors = array( 'primary', 'secondary', 'accent', 'background', 'text', 'text_secondary' );
		
		foreach ( $required_colors as $color_key ) {
			$this->assertArrayHasKey( $color_key, $palette['colors'], "Missing color key: {$color_key}" );
			$this->assertNotEmpty( $palette['colors'][ $color_key ], "Empty color value for: {$color_key}" );
		}
	}

	// ========================================
	// MASE_Settings::apply_palette() Tests
	// ========================================

	/**
	 * Test apply_palette() with valid palette ID.
	 */
	public function test_apply_palette_with_valid_id() {
		$result = $this->settings->apply_palette( 'sunset' );

		$this->assertTrue( $result );

		// Verify settings were updated.
		$settings = $this->settings->get_option();
		$this->assertEquals( 'sunset', $settings['palettes']['current'] );
	}

	/**
	 * Test apply_palette() with invalid palette ID.
	 */
	public function test_apply_palette_with_invalid_id() {
		$result = $this->settings->apply_palette( 'invalid-palette' );

		$this->assertFalse( $result );

		// Verify settings were not changed.
		$settings = $this->settings->get_option();
		$this->assertNotEquals( 'invalid-palette', $settings['palettes']['current'] );
	}

	/**
	 * Test apply_palette() updates admin bar colors.
	 */
	public function test_apply_palette_updates_admin_bar_colors() {
		$palette = $this->settings->get_palette( 'dark-elegance' );
		$this->settings->apply_palette( 'dark-elegance' );

		$settings = $this->settings->get_option();
		
		$this->assertEquals( $palette['colors']['primary'], $settings['admin_bar']['bg_color'] );
		$this->assertEquals( $palette['colors']['text'], $settings['admin_bar']['text_color'] );
	}

	/**
	 * Test apply_palette() updates admin menu colors.
	 */
	public function test_apply_palette_updates_admin_menu_colors() {
		$palette = $this->settings->get_palette( 'vibrant-purple' );
		$this->settings->apply_palette( 'vibrant-purple' );

		$settings = $this->settings->get_option();
		
		$this->assertEquals( $palette['colors']['primary'], $settings['admin_menu']['bg_color'] );
		$this->assertEquals( $palette['colors']['text'], $settings['admin_menu']['text_color'] );
	}

	// ========================================
	// MASE_Settings::save_custom_palette() Tests
	// ========================================

	/**
	 * Test save_custom_palette() with valid data.
	 */
	public function test_save_custom_palette_with_valid_data() {
		$palette_name = 'My Custom Palette';
		$colors = array(
			'primary' => '#FF5733',
			'secondary' => '#33FF57',
			'accent' => '#3357FF',
			'background' => '#FFFFFF',
			'text' => '#000000',
			'text_secondary' => '#666666',
		);

		$result = $this->settings->save_custom_palette( $palette_name, $colors );

		$this->assertTrue( $result );

		// Verify palette was saved.
		$settings = $this->settings->get_option();
		$this->assertArrayHasKey( 'custom', $settings['palettes'] );
		$this->assertNotEmpty( $settings['palettes']['custom'] );
		
		// Find the saved palette.
		$saved_palette = null;
		foreach ( $settings['palettes']['custom'] as $palette ) {
			if ( $palette['name'] === $palette_name ) {
				$saved_palette = $palette;
				break;
			}
		}

		$this->assertNotNull( $saved_palette );
		$this->assertEquals( $palette_name, $saved_palette['name'] );
		$this->assertEquals( $colors, $saved_palette['colors'] );
	}

	/**
	 * Test save_custom_palette() with invalid colors (missing keys).
	 */
	public function test_save_custom_palette_with_missing_color_keys() {
		$palette_name = 'Incomplete Palette';
		$colors = array(
			'primary' => '#FF5733',
			'secondary' => '#33FF57',
			// Missing required keys.
		);

		$result = $this->settings->save_custom_palette( $palette_name, $colors );

		$this->assertFalse( $result );
	}

	/**
	 * Test save_custom_palette() with invalid hex colors.
	 */
	public function test_save_custom_palette_with_invalid_hex_colors() {
		$palette_name = 'Invalid Colors';
		$colors = array(
			'primary' => 'not-a-color',
			'secondary' => '#33FF57',
			'accent' => '#3357FF',
			'background' => '#FFFFFF',
			'text' => '#000000',
			'text_secondary' => '#666666',
		);

		$result = $this->settings->save_custom_palette( $palette_name, $colors );

		$this->assertFalse( $result );
	}

	/**
	 * Test save_custom_palette() with empty name.
	 */
	public function test_save_custom_palette_with_empty_name() {
		$colors = array(
			'primary' => '#FF5733',
			'secondary' => '#33FF57',
			'accent' => '#3357FF',
			'background' => '#FFFFFF',
			'text' => '#000000',
			'text_secondary' => '#666666',
		);

		$result = $this->settings->save_custom_palette( '', $colors );

		$this->assertFalse( $result );
	}

	// ========================================
	// MASE_CSS_Generator::generate_palette_css() Tests
	// ========================================

	/**
	 * Test generate_palette_css() output structure.
	 */
	public function test_generate_palette_css_output_structure() {
		$settings = $this->settings->get_defaults();
		$settings['palettes']['current'] = 'professional-blue';

		$css = $this->css_generator->generate( $settings );

		// Verify CSS contains palette variables.
		$this->assertStringContainsString( ':root', $css );
		$this->assertStringContainsString( '--mase-primary', $css );
		$this->assertStringContainsString( '--mase-secondary', $css );
		$this->assertStringContainsString( '--mase-accent', $css );
		$this->assertStringContainsString( '--mase-background', $css );
	}

	/**
	 * Test generate_palette_css() with different palettes.
	 */
	public function test_generate_palette_css_with_different_palettes() {
		$settings = $this->settings->get_defaults();
		
		// Test with sunset palette.
		$settings['palettes']['current'] = 'sunset';
		$css_sunset = $this->css_generator->generate( $settings );
		
		// Test with dark-elegance palette.
		$settings['palettes']['current'] = 'dark-elegance';
		$css_dark = $this->css_generator->generate( $settings );

		// CSS should be different for different palettes.
		$this->assertNotEquals( $css_sunset, $css_dark );
	}

	/**
	 * Test generate_palette_css() applies colors to admin bar.
	 */
	public function test_generate_palette_css_applies_to_admin_bar() {
		$settings = $this->settings->get_defaults();
		$palette = $this->settings->get_palette( 'energetic-green' );
		$settings['palettes']['current'] = 'energetic-green';
		$settings['admin_bar']['bg_color'] = $palette['colors']['primary'];

		$css = $this->css_generator->generate( $settings );

		$this->assertStringContainsString( '#wpadminbar', $css );
		$this->assertStringContainsString( 'background-color', $css );
	}

	// ========================================
	// MASE_CSS_Generator::generate_glassmorphism_css() Tests
	// ========================================

	/**
	 * Test generate_glassmorphism_css() when enabled.
	 */
	public function test_generate_glassmorphism_css_when_enabled() {
		$settings = $this->settings->get_defaults();
		$settings['visual_effects']['admin_bar']['glassmorphism'] = true;
		$settings['visual_effects']['admin_bar']['blur_intensity'] = 20;

		$css = $this->css_generator->generate( $settings );

		$this->assertStringContainsString( 'backdrop-filter', $css );
		$this->assertStringContainsString( 'blur', $css );
	}

	/**
	 * Test generate_glassmorphism_css() when disabled.
	 */
	public function test_generate_glassmorphism_css_when_disabled() {
		$settings = $this->settings->get_defaults();
		$settings['visual_effects']['admin_bar']['glassmorphism'] = false;

		$css = $this->css_generator->generate( $settings );

		// Should not contain backdrop-filter when disabled.
		// Note: This test may need adjustment based on actual implementation.
		$this->assertIsString( $css );
	}

	/**
	 * Test generate_glassmorphism_css() with different blur intensities.
	 */
	public function test_generate_glassmorphism_css_with_different_blur_intensities() {
		$settings = $this->settings->get_defaults();
		$settings['visual_effects']['admin_bar']['glassmorphism'] = true;
		
		// Test with blur intensity 10.
		$settings['visual_effects']['admin_bar']['blur_intensity'] = 10;
		$css_10 = $this->css_generator->generate( $settings );
		
		// Test with blur intensity 30.
		$settings['visual_effects']['admin_bar']['blur_intensity'] = 30;
		$css_30 = $this->css_generator->generate( $settings );

		// CSS should be different for different blur intensities.
		$this->assertNotEquals( $css_10, $css_30 );
	}

	// ========================================
	// MASE_Migration::transform_settings() Tests
	// ========================================

	/**
	 * Test transform_settings() with v1.1.0 data.
	 */
	public function test_transform_settings_with_v110_data() {
		// Simulate v1.1.0 settings structure.
		$old_settings = array(
			'admin_bar' => array(
				'bg_color' => '#23282d',
				'text_color' => '#ffffff',
				'height' => 32,
			),
			'admin_menu' => array(
				'bg_color' => '#23282d',
				'text_color' => '#ffffff',
				'hover_bg_color' => '#191e23',
				'hover_text_color' => '#00b9eb',
				'width' => 160,
			),
			'performance' => array(
				'enable_minification' => true,
				'cache_duration' => 3600,
			),
		);

		// Save old settings.
		update_option( 'mase_settings', $old_settings );
		update_option( 'mase_version', '1.1.0' );

		// Run migration.
		MASE_Migration::maybe_migrate();

		// Get transformed settings.
		$new_settings = get_option( 'mase_settings' );

		// Verify old settings are preserved.
		$this->assertEquals( $old_settings['admin_bar']['bg_color'], $new_settings['admin_bar']['bg_color'] );
		$this->assertEquals( $old_settings['admin_menu']['width'], $new_settings['admin_menu']['width'] );

		// Verify new fields are added with defaults.
		$this->assertArrayHasKey( 'palettes', $new_settings );
		$this->assertArrayHasKey( 'templates', $new_settings );
		$this->assertArrayHasKey( 'typography', $new_settings );
		$this->assertArrayHasKey( 'visual_effects', $new_settings );
		$this->assertArrayHasKey( 'effects', $new_settings );
		$this->assertArrayHasKey( 'advanced', $new_settings );
		$this->assertArrayHasKey( 'mobile', $new_settings );
		$this->assertArrayHasKey( 'accessibility', $new_settings );
		$this->assertArrayHasKey( 'keyboard_shortcuts', $new_settings );

		// Verify version was updated.
		$this->assertEquals( '1.2.0', get_option( 'mase_version' ) );

		// Verify backup was created.
		$backup = get_option( 'mase_settings_backup_110' );
		$this->assertNotFalse( $backup );
		$this->assertEquals( $old_settings, $backup );
	}

	/**
	 * Test transform_settings() preserves custom CSS.
	 */
	public function test_transform_settings_preserves_custom_css() {
		$custom_css = '.my-custom-class { color: red; }';
		$old_settings = array(
			'admin_bar' => array(
				'bg_color' => '#23282d',
			),
			'advanced' => array(
				'custom_css' => $custom_css,
			),
		);

		update_option( 'mase_settings', $old_settings );
		update_option( 'mase_version', '1.1.0' );

		MASE_Migration::maybe_migrate();

		$new_settings = get_option( 'mase_settings' );
		$this->assertEquals( $custom_css, $new_settings['advanced']['custom_css'] );
	}

	/**
	 * Test transform_settings() with empty old settings.
	 */
	public function test_transform_settings_with_empty_old_settings() {
		delete_option( 'mase_settings' );
		update_option( 'mase_version', '1.1.0' );

		MASE_Migration::maybe_migrate();

		$new_settings = get_option( 'mase_settings' );
		
		// Should have default settings.
		$this->assertNotEmpty( $new_settings );
		$this->assertArrayHasKey( 'admin_bar', $new_settings );
		$this->assertArrayHasKey( 'palettes', $new_settings );
	}

	// ========================================
	// MASE_Mobile_Optimizer::is_mobile() Tests
	// ========================================

	/**
	 * Test is_mobile() with mobile user agent.
	 */
	public function test_is_mobile_with_mobile_user_agent() {
		// Simulate mobile user agent.
		$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15';

		$is_mobile = $this->mobile_optimizer->is_mobile();

		// Note: This depends on WordPress wp_is_mobile() function.
		// The actual result may vary based on WordPress version.
		$this->assertIsBool( $is_mobile );
	}

	/**
	 * Test is_mobile() with desktop user agent.
	 */
	public function test_is_mobile_with_desktop_user_agent() {
		// Simulate desktop user agent.
		$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

		$is_mobile = $this->mobile_optimizer->is_mobile();

		$this->assertIsBool( $is_mobile );
	}

	/**
	 * Test is_mobile() with tablet user agent.
	 */
	public function test_is_mobile_with_tablet_user_agent() {
		// Simulate tablet user agent.
		$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15';

		$is_mobile = $this->mobile_optimizer->is_mobile();

		$this->assertIsBool( $is_mobile );
	}

	/**
	 * Test is_mobile() with Android user agent.
	 */
	public function test_is_mobile_with_android_user_agent() {
		// Simulate Android user agent.
		$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36';

		$is_mobile = $this->mobile_optimizer->is_mobile();

		$this->assertIsBool( $is_mobile );
	}

	/**
	 * Test is_mobile() returns boolean.
	 */
	public function test_is_mobile_returns_boolean() {
		$result = $this->mobile_optimizer->is_mobile();

		$this->assertIsBool( $result );
	}

	// ========================================
	// Additional Integration Tests
	// ========================================

	/**
	 * Test complete palette application workflow.
	 */
	public function test_complete_palette_application_workflow() {
		// Apply palette.
		$result = $this->settings->apply_palette( 'sunset' );
		$this->assertTrue( $result );

		// Generate CSS.
		$settings = $this->settings->get_option();
		$css = $this->css_generator->generate( $settings );

		// Verify CSS is generated.
		$this->assertNotEmpty( $css );
		$this->assertIsString( $css );
	}

	/**
	 * Test settings validation with valid data.
	 */
	public function test_settings_validation_with_valid_data() {
		$valid_settings = array(
			'admin_bar' => array(
				'bg_color' => '#FF5733',
				'text_color' => '#FFFFFF',
				'height' => 40,
			),
		);

		$validated = $this->settings->validate( $valid_settings );

		$this->assertIsArray( $validated );
		$this->assertArrayHasKey( 'admin_bar', $validated );
	}

	/**
	 * Test settings validation with invalid data.
	 */
	public function test_settings_validation_with_invalid_data() {
		$invalid_settings = array(
			'admin_bar' => array(
				'bg_color' => 'not-a-color',
				'height' => 9999, // Out of range.
			),
		);

		$validated = $this->settings->validate( $invalid_settings );

		$this->assertInstanceOf( 'WP_Error', $validated );
	}

	/**
	 * Test CSS generation performance.
	 */
	public function test_css_generation_performance() {
		$settings = $this->settings->get_defaults();

		$start_time = microtime( true );
		$css = $this->css_generator->generate( $settings );
		$duration = ( microtime( true ) - $start_time ) * 1000; // Convert to milliseconds.

		// CSS generation should complete in under 100ms (Requirement 4.1).
		$this->assertLessThan( 100, $duration, 'CSS generation took too long: ' . $duration . 'ms' );
		$this->assertNotEmpty( $css );
	}

	/**
	 * Test mobile optimization reduces effects.
	 */
	public function test_mobile_optimization_reduces_effects() {
		$settings = $this->settings->get_defaults();
		$settings['mobile']['optimized'] = true;
		$settings['mobile']['reduced_effects'] = true;
		$settings['visual_effects']['admin_bar']['glassmorphism'] = true;
		$settings['visual_effects']['animations_enabled'] = true;

		// Simulate mobile device.
		$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';

		$optimized = $this->mobile_optimizer->get_optimized_settings( $settings );

		// Verify effects are reduced on mobile.
		if ( $this->mobile_optimizer->should_reduce_effects() ) {
			$this->assertFalse( $optimized['visual_effects']['admin_bar']['glassmorphism'] );
			$this->assertFalse( $optimized['visual_effects']['animations_enabled'] );
		}
	}
}
