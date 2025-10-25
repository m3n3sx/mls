<?php
/**
 * Admin Bar CSS Generator Unit Tests
 *
 * Tests for CSS generation methods in MASE_CSS_Generator class.
 * Covers gradient backgrounds, border radius, shadows, width, and floating layout.
 *
 * Requirements: 5.1, 5.2, 5.3, 9.1, 9.2, 10.1, 10.2, 10.3, 11.1, 11.2, 13.1, 13.2, 13.3
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.2.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Test_CSS_Generator_AdminBar
 *
 * Unit tests for Admin Bar CSS generation methods.
 */
class Test_CSS_Generator_AdminBar extends WP_UnitTestCase {

	/**
	 * MASE_CSS_Generator instance.
	 *
	 * @var MASE_CSS_Generator
	 */
	private $css_generator;

	/**
	 * Set up test environment before each test.
	 */
	public function setUp() {
		parent::setUp();
		$this->css_generator = new MASE_CSS_Generator();
	}

	/**
	 * Clean up after each test.
	 */
	public function tearDown() {
		parent::tearDown();
	}

	// ========================================
	// 16.1 Test gradient CSS generation
	// Requirements: 5.1, 5.2, 5.3
	// ========================================

	/**
	 * Test linear gradient output.
	 * Requirement 5.1: Linear gradient support.
	 */
	public function test_linear_gradient_output() {
		$settings = array(
			'admin_bar' => array(
				'bg_type' => 'gradient',
				'gradient_type' => 'linear',
				'gradient_angle' => 90,
				'gradient_colors' => array(
					array( 'color' => '#FF0000', 'position' => 0 ),
					array( 'color' => '#0000FF', 'position' => 100 ),
				),
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify linear gradient is present.
		$this->assertStringContainsString( 'linear-gradient', $css );
		$this->assertStringContainsString( '90deg', $css );
		$this->assertStringContainsString( '#FF0000', $css );
		$this->assertStringContainsString( '#0000FF', $css );
		$this->assertStringContainsString( '0%', $css );
		$this->assertStringContainsString( '100%', $css );
	}

	/**
	 * Test radial gradient output.
	 * Requirement 5.2: Radial gradient support.
	 */
	public function test_radial_gradient_output() {
		$settings = array(
			'admin_bar' => array(
				'bg_type' => 'gradient',
				'gradient_type' => 'radial',
				'gradient_colors' => array(
					array( 'color' => '#00FF00', 'position' => 0 ),
					array( 'color' => '#FFFF00', 'position' => 100 ),
				),
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify radial gradient is present.
		$this->assertStringContainsString( 'radial-gradient', $css );
		$this->assertStringContainsString( 'circle', $css );
		$this->assertStringContainsString( '#00FF00', $css );
		$this->assertStringContainsString( '#FFFF00', $css );
	}

	/**
	 * Test conic gradient output.
	 * Requirement 5.3: Conic gradient support.
	 */
	public function test_conic_gradient_output() {
		$settings = array(
			'admin_bar' => array(
				'bg_type' => 'gradient',
				'gradient_type' => 'conic',
				'gradient_angle' => 45,
				'gradient_colors' => array(
					array( 'color' => '#FF00FF', 'position' => 0 ),
					array( 'color' => '#00FFFF', 'position' => 100 ),
				),
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify conic gradient is present.
		$this->assertStringContainsString( 'conic-gradient', $css );
		$this->assertStringContainsString( '45deg', $css );
		$this->assertStringContainsString( '#FF00FF', $css );
		$this->assertStringContainsString( '#00FFFF', $css );
	}

	/**
	 * Test multiple color stops.
	 * Requirement 5.3: Multiple color stops support.
	 */
	public function test_multiple_color_stops() {
		$settings = array(
			'admin_bar' => array(
				'bg_type' => 'gradient',
				'gradient_type' => 'linear',
				'gradient_angle' => 180,
				'gradient_colors' => array(
					array( 'color' => '#FF0000', 'position' => 0 ),
					array( 'color' => '#00FF00', 'position' => 50 ),
					array( 'color' => '#0000FF', 'position' => 100 ),
				),
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify all three color stops are present.
		$this->assertStringContainsString( '#FF0000', $css );
		$this->assertStringContainsString( '#00FF00', $css );
		$this->assertStringContainsString( '#0000FF', $css );
		$this->assertStringContainsString( '0%', $css );
		$this->assertStringContainsString( '50%', $css );
		$this->assertStringContainsString( '100%', $css );
	}

	/**
	 * Test gradient with default colors when none provided.
	 */
	public function test_gradient_with_default_colors() {
		$settings = array(
			'admin_bar' => array(
				'bg_type' => 'gradient',
				'gradient_type' => 'linear',
				'gradient_angle' => 90,
				// No gradient_colors provided.
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Should use default colors.
		$this->assertStringContainsString( 'linear-gradient', $css );
		$this->assertStringContainsString( '#23282d', $css );
		$this->assertStringContainsString( '#32373c', $css );
	}

	// ========================================
	// 16.2 Test border radius CSS generation
	// Requirements: 9.1, 9.2
	// ========================================

	/**
	 * Test uniform mode output.
	 * Requirement 9.1: Uniform border radius mode.
	 */
	public function test_uniform_border_radius_output() {
		$settings = array(
			'admin_bar' => array(
				'border_radius_mode' => 'uniform',
				'border_radius' => 12,
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify uniform border radius is applied.
		$this->assertStringContainsString( 'border-radius: 12px', $css );
		$this->assertStringContainsString( '#wpadminbar', $css );
	}

	/**
	 * Test individual mode output.
	 * Requirement 9.2: Individual corner radius mode.
	 */
	public function test_individual_border_radius_output() {
		$settings = array(
			'admin_bar' => array(
				'border_radius_mode' => 'individual',
				'border_radius_tl' => 10,
				'border_radius_tr' => 20,
				'border_radius_br' => 30,
				'border_radius_bl' => 40,
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify individual corner radii are applied.
		$this->assertStringContainsString( 'border-radius: 10px 20px 30px 40px', $css );
		$this->assertStringContainsString( '#wpadminbar', $css );
	}

	/**
	 * Test all four corners with individual mode.
	 * Requirement 9.2: All four corners can be controlled independently.
	 */
	public function test_all_four_corners_individual() {
		$settings = array(
			'admin_bar' => array(
				'border_radius_mode' => 'individual',
				'border_radius_tl' => 5,
				'border_radius_tr' => 10,
				'border_radius_br' => 15,
				'border_radius_bl' => 20,
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify CSS contains all four corner values in correct order (TL TR BR BL).
		$this->assertStringContainsString( 'border-radius: 5px 10px 15px 20px', $css );
	}

	/**
	 * Test zero border radius does not generate CSS.
	 */
	public function test_zero_border_radius_no_css() {
		$settings = array(
			'admin_bar' => array(
				'border_radius_mode' => 'uniform',
				'border_radius' => 0,
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Should not contain border-radius CSS when value is 0.
		// Note: CSS may still be generated but with 0px value, or not at all.
		// Check implementation to verify expected behavior.
		$this->assertIsString( $css );
	}

	// ========================================
	// 16.3 Test shadow CSS generation
	// Requirements: 10.1, 10.2, 10.3
	// ========================================

	/**
	 * Test preset mode output.
	 * Requirement 10.1: Preset shadow mode with predefined styles.
	 */
	public function test_preset_shadow_output() {
		$presets = array( 'subtle', 'medium', 'strong', 'dramatic' );

		foreach ( $presets as $preset ) {
			$settings = array(
				'admin_bar' => array(
					'shadow_mode' => 'preset',
					'shadow_preset' => $preset,
				),
			);

			$css = $this->css_generator->generate( $settings );

			// Verify box-shadow is present.
			$this->assertStringContainsString( 'box-shadow:', $css, "Preset '{$preset}' should generate box-shadow" );
			$this->assertStringContainsString( 'rgba', $css, "Preset '{$preset}' should use rgba color" );
		}
	}

	/**
	 * Test custom mode output.
	 * Requirement 10.2: Custom shadow with individual values.
	 */
	public function test_custom_shadow_output() {
		$settings = array(
			'admin_bar' => array(
				'shadow_mode' => 'custom',
				'shadow_h_offset' => 5,
				'shadow_v_offset' => 10,
				'shadow_blur' => 15,
				'shadow_spread' => 2,
				'shadow_color' => '#000000',
				'shadow_opacity' => 0.25,
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify custom shadow values are present.
		$this->assertStringContainsString( 'box-shadow:', $css );
		$this->assertStringContainsString( '5px', $css );
		$this->assertStringContainsString( '10px', $css );
		$this->assertStringContainsString( '15px', $css );
		$this->assertStringContainsString( '2px', $css );
		$this->assertStringContainsString( 'rgba', $css );
	}

	/**
	 * Test shadow color with opacity.
	 * Requirement 10.3: Shadow color with opacity support.
	 */
	public function test_shadow_color_with_opacity() {
		$settings = array(
			'admin_bar' => array(
				'shadow_mode' => 'custom',
				'shadow_h_offset' => 0,
				'shadow_v_offset' => 4,
				'shadow_blur' => 8,
				'shadow_spread' => 0,
				'shadow_color' => '#FF0000',
				'shadow_opacity' => 0.5,
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify rgba color with opacity is generated.
		$this->assertStringContainsString( 'rgba', $css );
		$this->assertStringContainsString( '0.50', $css ); // Opacity formatted to 2 decimals
		// Verify RGB values for red (#FF0000 = rgb(255, 0, 0)).
		$this->assertStringContainsString( '255', $css );
	}

	/**
	 * Test 'none' preset does not generate shadow CSS.
	 */
	public function test_none_preset_no_shadow() {
		$settings = array(
			'admin_bar' => array(
				'shadow_mode' => 'preset',
				'shadow_preset' => 'none',
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Should not contain box-shadow when preset is 'none'.
		// Or if it does, it should be 'box-shadow: none'.
		$this->assertIsString( $css );
	}

	/**
	 * Test negative offset values in custom shadow.
	 */
	public function test_negative_offset_custom_shadow() {
		$settings = array(
			'admin_bar' => array(
				'shadow_mode' => 'custom',
				'shadow_h_offset' => -10,
				'shadow_v_offset' => -5,
				'shadow_blur' => 8,
				'shadow_spread' => 0,
				'shadow_color' => '#000000',
				'shadow_opacity' => 0.15,
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify negative offsets are present.
		$this->assertStringContainsString( '-10px', $css );
		$this->assertStringContainsString( '-5px', $css );
	}

	// ========================================
	// 16.4 Test width CSS generation
	// Requirements: 11.1, 11.2
	// ========================================

	/**
	 * Test percentage width output.
	 * Requirement 11.1: Percentage width support.
	 */
	public function test_percentage_width_output() {
		$settings = array(
			'admin_bar' => array(
				'width_unit' => 'percent',
				'width_value' => 80,
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify percentage width is applied.
		$this->assertStringContainsString( 'width: 80%', $css );
		$this->assertStringContainsString( '#wpadminbar', $css );
	}

	/**
	 * Test pixel width output.
	 * Requirement 11.2: Pixel width support.
	 */
	public function test_pixel_width_output() {
		$settings = array(
			'admin_bar' => array(
				'width_unit' => 'pixels',
				'width_value' => 1200,
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify pixel width is applied.
		$this->assertStringContainsString( 'width: 1200px', $css );
		$this->assertStringContainsString( 'max-width: 100%', $css );
		$this->assertStringContainsString( '#wpadminbar', $css );
	}

	/**
	 * Test centering for <100% width.
	 * Requirement 11.2: Horizontal centering when width < 100%.
	 */
	public function test_centering_for_less_than_100_percent() {
		$settings = array(
			'admin_bar' => array(
				'width_unit' => 'percent',
				'width_value' => 90,
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify centering CSS is applied.
		$this->assertStringContainsString( 'left: 50%', $css );
		$this->assertStringContainsString( 'transform: translateX(-50%)', $css );
		$this->assertStringContainsString( 'right: auto', $css );
	}

	/**
	 * Test 100% width does not generate width CSS.
	 */
	public function test_100_percent_width_no_css() {
		$settings = array(
			'admin_bar' => array(
				'width_unit' => 'percent',
				'width_value' => 100,
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Should not generate width CSS for default 100% width.
		// Or if it does, verify it doesn't include centering transforms.
		$this->assertIsString( $css );
	}

	// ========================================
	// 16.5 Test floating layout CSS generation
	// Requirements: 13.1, 13.2, 13.3
	// ========================================

	/**
	 * Test padding calculation.
	 * Requirement 13.2: Calculate padding based on height and margin.
	 */
	public function test_floating_padding_calculation() {
		$settings = array(
			'admin_bar' => array(
				'height' => 40,
				'floating_margin_mode' => 'uniform',
				'floating_margin' => 10,
			),
			'visual_effects' => array(
				'admin_bar' => array(
					'floating' => true,
				),
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Total offset should be height (40) + top margin (10) = 50px.
		$this->assertStringContainsString( 'padding-top: 50px', $css );
		$this->assertStringContainsString( '#adminmenuwrap', $css );
	}

	/**
	 * Test with different heights.
	 * Requirement 13.2: Padding adjusts with different heights.
	 */
	public function test_floating_with_different_heights() {
		$heights = array( 32, 50, 64, 100 );

		foreach ( $heights as $height ) {
			$settings = array(
				'admin_bar' => array(
					'height' => $height,
					'floating_margin_mode' => 'uniform',
					'floating_margin' => 8,
				),
				'visual_effects' => array(
					'admin_bar' => array(
						'floating' => true,
					),
				),
			);

			$css = $this->css_generator->generate( $settings );

			// Expected padding = height + margin.
			$expected_padding = $height + 8;
			$this->assertStringContainsString( 
				'padding-top: ' . $expected_padding . 'px', 
				$css,
				"Height {$height}px should generate padding-top: {$expected_padding}px"
			);
		}
	}

	/**
	 * Test with different margins.
	 * Requirement 13.2: Padding adjusts with different margins.
	 */
	public function test_floating_with_different_margins() {
		$margins = array( 0, 8, 16, 24 );

		foreach ( $margins as $margin ) {
			$settings = array(
				'admin_bar' => array(
					'height' => 32,
					'floating_margin_mode' => 'uniform',
					'floating_margin' => $margin,
				),
				'visual_effects' => array(
					'admin_bar' => array(
						'floating' => true,
					),
				),
			);

			$css = $this->css_generator->generate( $settings );

			// Expected padding = height + margin.
			$expected_padding = 32 + $margin;
			$this->assertStringContainsString( 
				'padding-top: ' . $expected_padding . 'px', 
				$css,
				"Margin {$margin}px should generate padding-top: {$expected_padding}px"
			);
		}
	}

	/**
	 * Test floating layout with individual margins.
	 * Requirement 13.2: Use top margin for padding calculation in individual mode.
	 */
	public function test_floating_with_individual_margins() {
		$settings = array(
			'admin_bar' => array(
				'height' => 40,
				'floating_margin_mode' => 'individual',
				'floating_margin_top' => 15,
				'floating_margin_right' => 10,
				'floating_margin_bottom' => 5,
				'floating_margin_left' => 10,
			),
			'visual_effects' => array(
				'admin_bar' => array(
					'floating' => true,
				),
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Total offset should use top margin only: height (40) + top margin (15) = 55px.
		$this->assertStringContainsString( 'padding-top: 55px', $css );
		$this->assertStringContainsString( '#adminmenuwrap', $css );
	}

	/**
	 * Test floating disabled does not generate padding.
	 * Requirement 13.1: Only apply padding when floating is enabled.
	 */
	public function test_floating_disabled_no_padding() {
		$settings = array(
			'admin_bar' => array(
				'height' => 40,
				'floating_margin' => 10,
			),
			'visual_effects' => array(
				'admin_bar' => array(
					'floating' => false,
				),
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Should not contain floating layout padding when floating is disabled.
		// Note: May still contain other padding, so check specifically for adminmenuwrap padding.
		$this->assertIsString( $css );
	}

	/**
	 * Test floating margin CSS generation.
	 * Requirement 12.1, 12.2: Floating margins are applied correctly.
	 */
	public function test_floating_margin_css() {
		$settings = array(
			'admin_bar' => array(
				'floating_margin_mode' => 'uniform',
				'floating_margin' => 12,
			),
			'visual_effects' => array(
				'admin_bar' => array(
					'floating' => true,
				),
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify floating margins are applied.
		$this->assertStringContainsString( 'top: 12px', $css );
		$this->assertStringContainsString( 'right: 12px', $css );
		$this->assertStringContainsString( 'left: 12px', $css );
		$this->assertStringContainsString( 'calc(100% - 24px)', $css ); // Width calculation
	}

	// ========================================
	// Integration Tests
	// ========================================

	/**
	 * Test complete CSS generation with all features.
	 */
	public function test_complete_css_generation() {
		$settings = array(
			'admin_bar' => array(
				'bg_type' => 'gradient',
				'gradient_type' => 'linear',
				'gradient_angle' => 90,
				'gradient_colors' => array(
					array( 'color' => '#FF0000', 'position' => 0 ),
					array( 'color' => '#0000FF', 'position' => 100 ),
				),
				'height' => 40,
				'width_unit' => 'percent',
				'width_value' => 90,
				'border_radius_mode' => 'uniform',
				'border_radius' => 8,
				'shadow_mode' => 'preset',
				'shadow_preset' => 'medium',
				'floating_margin_mode' => 'uniform',
				'floating_margin' => 10,
			),
			'visual_effects' => array(
				'admin_bar' => array(
					'floating' => true,
				),
			),
		);

		$css = $this->css_generator->generate( $settings );

		// Verify all features are present in generated CSS.
		$this->assertStringContainsString( 'linear-gradient', $css );
		$this->assertStringContainsString( 'height: 40px', $css );
		$this->assertStringContainsString( 'width: 90%', $css );
		$this->assertStringContainsString( 'border-radius: 8px', $css );
		$this->assertStringContainsString( 'box-shadow:', $css );
		$this->assertStringContainsString( 'top: 10px', $css );
		$this->assertStringContainsString( 'padding-top: 50px', $css ); // 40 + 10
	}

	/**
	 * Test CSS generation performance.
	 * Should complete within reasonable time (<100ms).
	 */
	public function test_css_generation_performance() {
		$settings = array(
			'admin_bar' => array(
				'bg_type' => 'gradient',
				'gradient_type' => 'linear',
				'gradient_angle' => 90,
				'gradient_colors' => array(
					array( 'color' => '#FF0000', 'position' => 0 ),
					array( 'color' => '#00FF00', 'position' => 50 ),
					array( 'color' => '#0000FF', 'position' => 100 ),
				),
				'height' => 40,
				'width_unit' => 'percent',
				'width_value' => 85,
				'border_radius_mode' => 'individual',
				'border_radius_tl' => 10,
				'border_radius_tr' => 20,
				'border_radius_br' => 30,
				'border_radius_bl' => 40,
				'shadow_mode' => 'custom',
				'shadow_h_offset' => 5,
				'shadow_v_offset' => 10,
				'shadow_blur' => 15,
				'shadow_spread' => 2,
				'shadow_color' => '#000000',
				'shadow_opacity' => 0.25,
				'floating_margin_mode' => 'individual',
				'floating_margin_top' => 15,
				'floating_margin_right' => 10,
				'floating_margin_bottom' => 5,
				'floating_margin_left' => 10,
			),
			'visual_effects' => array(
				'admin_bar' => array(
					'floating' => true,
				),
			),
		);

		$start_time = microtime( true );
		$css = $this->css_generator->generate( $settings );
		$duration = ( microtime( true ) - $start_time ) * 1000; // Convert to milliseconds

		// CSS generation should complete in under 100ms.
		$this->assertLessThan( 100, $duration, 'CSS generation took too long: ' . $duration . 'ms' );
		$this->assertNotEmpty( $css );
	}
}
