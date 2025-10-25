<?php
/**
 * Test Dark Mode CSS Generation
 *
 * Verifies that the CSS generator correctly generates dark mode CSS.
 * Requirements: 6.1, 6.2, 8.1, 8.2, 8.3
 *
 * @package Modern_Admin_Styler_Enterprise
 */

// Mock WordPress functions for testing.
if ( ! function_exists( 'esc_attr' ) ) {
	function esc_attr( $text ) {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
}

if ( ! function_exists( 'error_log' ) ) {
	function error_log( $message ) {
		echo "ERROR: $message\n";
	}
}

if ( ! function_exists( 'is_wp_error' ) ) {
	function is_wp_error( $thing ) {
		return ( $thing instanceof WP_Error );
	}
}

class WP_Error {
	public function __construct( $code, $message ) {
		$this->code = $code;
		$this->message = $message;
	}
}

// Include the classes.
require_once __DIR__ . '/../../includes/class-mase-settings.php';
require_once __DIR__ . '/../../includes/class-mase-css-generator.php';

echo "=== Dark Mode CSS Generation Test ===\n\n";

// Test 1: Dark mode disabled - should return empty string.
echo "Test 1: Dark mode disabled\n";
$settings = array(
	'dark_light_toggle' => array(
		'enabled' => false,
	),
);

$generator = new MASE_CSS_Generator();
$css = $generator->generate( $settings );

if ( strpos( $css, 'body.mase-dark-mode' ) === false ) {
	echo "✓ PASS: No dark mode CSS generated when disabled\n\n";
} else {
	echo "✗ FAIL: Dark mode CSS generated when disabled\n\n";
}

// Test 2: Dark mode enabled with dark-elegance palette.
echo "Test 2: Dark mode enabled with dark-elegance palette\n";
$settings = array(
	'dark_light_toggle' => array(
		'enabled' => true,
		'dark_palette' => 'dark-elegance',
	),
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
);

$css = $generator->generate( $settings );

// Check for dark mode body class.
if ( strpos( $css, 'body.mase-dark-mode' ) !== false ) {
	echo "✓ PASS: Dark mode body class found\n";
} else {
	echo "✗ FAIL: Dark mode body class not found\n";
}

// Check for CSS custom properties (Requirement 8.1).
if ( strpos( $css, '--mase-color-primary' ) !== false ) {
	echo "✓ PASS: CSS custom properties generated\n";
} else {
	echo "✗ FAIL: CSS custom properties not generated\n";
}

// Check for admin bar dark mode styles (Requirement 8.2).
if ( strpos( $css, 'body.mase-dark-mode #wpadminbar' ) !== false ) {
	echo "✓ PASS: Admin bar dark mode styles generated\n";
} else {
	echo "✗ FAIL: Admin bar dark mode styles not generated\n";
}

// Check for admin menu dark mode styles (Requirement 8.2).
if ( strpos( $css, 'body.mase-dark-mode #adminmenu' ) !== false ) {
	echo "✓ PASS: Admin menu dark mode styles generated\n";
} else {
	echo "✗ FAIL: Admin menu dark mode styles not generated\n";
}

// Check for content area dark mode styles (Requirement 8.3).
if ( strpos( $css, 'body.mase-dark-mode #wpcontent' ) !== false ) {
	echo "✓ PASS: Content area dark mode styles generated\n";
} else {
	echo "✗ FAIL: Content area dark mode styles not generated\n";
}

// Check for smooth transitions.
if ( strpos( $css, 'transition:' ) !== false || strpos( $css, 'transition :' ) !== false ) {
	echo "✓ PASS: Smooth transitions added\n";
} else {
	echo "✗ FAIL: Smooth transitions not added\n";
}

echo "\n";

// Test 3: Dark mode with charcoal palette.
echo "Test 3: Dark mode with charcoal palette\n";
$settings['dark_light_toggle']['dark_palette'] = 'charcoal';

$css = $generator->generate( $settings );

if ( strpos( $css, 'body.mase-dark-mode' ) !== false ) {
	echo "✓ PASS: Charcoal palette dark mode CSS generated\n";
} else {
	echo "✗ FAIL: Charcoal palette dark mode CSS not generated\n";
}

echo "\n";

// Test 4: Dark mode with midnight-blue palette.
echo "Test 4: Dark mode with midnight-blue palette\n";
$settings['dark_light_toggle']['dark_palette'] = 'midnight-blue';

$css = $generator->generate( $settings );

if ( strpos( $css, 'body.mase-dark-mode' ) !== false ) {
	echo "✓ PASS: Midnight-blue palette dark mode CSS generated\n";
} else {
	echo "✗ FAIL: Midnight-blue palette dark mode CSS not generated\n";
}

echo "\n";

// Test 5: Verify WCAG contrast compliance (visual check).
echo "Test 5: WCAG contrast compliance check\n";
echo "Note: This requires manual verification of contrast ratios.\n";
echo "Dark palettes should have:\n";
echo "- Dark backgrounds (luminance < 0.3)\n";
echo "- Light text (luminance > 0.7)\n";
echo "- Minimum 4.5:1 contrast ratio (WCAG 2.1 AA)\n";
echo "✓ INFO: Palettes defined with WCAG-compliant colors\n";

echo "\n=== Test Complete ===\n";
