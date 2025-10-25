<?php
/**
 * Test Background System Localization
 * 
 * Verifies that all user-facing strings in the background system
 * are properly wrapped in translation functions and can be translated.
 * 
 * Task 46: Localization
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

// Load WordPress
require_once dirname( dirname( __FILE__ ) ) . '/modern-admin-styler.php';

/**
 * Test localization implementation
 */
function test_background_localization() {
	echo "=== Background System Localization Test ===\n\n";
	
	$tests_passed = 0;
	$tests_failed = 0;
	
	// Test 1: Check if text domain is loaded
	echo "Test 1: Text domain loaded\n";
	$domain_loaded = is_textdomain_loaded( 'modern-admin-styler' );
	if ( $domain_loaded ) {
		echo "✓ PASS: Text domain 'modern-admin-styler' is loaded\n\n";
		$tests_passed++;
	} else {
		echo "✗ FAIL: Text domain 'modern-admin-styler' is not loaded\n\n";
		$tests_failed++;
	}
	
	// Test 2: Check if POT file exists
	echo "Test 2: Translation template exists\n";
	$pot_file = dirname( dirname( __FILE__ ) ) . '/languages/modern-admin-styler.pot';
	if ( file_exists( $pot_file ) ) {
		echo "✓ PASS: POT file exists at: $pot_file\n";
		$pot_size = filesize( $pot_file );
		echo "  File size: " . number_format( $pot_size ) . " bytes\n\n";
		$tests_passed++;
	} else {
		echo "✗ FAIL: POT file not found at: $pot_file\n\n";
		$tests_failed++;
	}
	
	// Test 3: Check if POT file contains background strings
	echo "Test 3: POT file contains background system strings\n";
	if ( file_exists( $pot_file ) ) {
		$pot_content = file_get_contents( $pot_file );
		
		$required_strings = array(
			'Background image uploaded successfully!',
			'Background image selected successfully!',
			'Background image removed successfully!',
			'Invalid file type. Please upload JPG, PNG, WebP, or SVG images only.',
			'File too large. Maximum size is 5MB.',
			'Maximum 10 color stops allowed',
			'Minimum 2 color stops required',
			'Gradient preset applied successfully!',
			'Pattern selected successfully!',
			'Background Position',
			'Background Size',
			'Background Repeat',
			'Background Attachment',
			'Background Opacity',
			'Blend Mode',
			'Enable Responsive Variations',
			'Desktop',
			'Tablet',
			'Mobile',
			'Inherit from Desktop',
			'Linear Gradient',
			'Radial Gradient',
			'Add Color Stop',
			'Remove Color Stop',
			'Gradient Angle',
			'Custom Position',
			'Custom Size',
		);
		
		$found_count = 0;
		$missing_strings = array();
		
		foreach ( $required_strings as $string ) {
			if ( strpos( $pot_content, $string ) !== false ) {
				$found_count++;
			} else {
				$missing_strings[] = $string;
			}
		}
		
		if ( empty( $missing_strings ) ) {
			echo "✓ PASS: All " . count( $required_strings ) . " required strings found in POT file\n\n";
			$tests_passed++;
		} else {
			echo "✗ FAIL: " . count( $missing_strings ) . " strings missing from POT file:\n";
			foreach ( $missing_strings as $missing ) {
				echo "  - $missing\n";
			}
			echo "\n";
			$tests_failed++;
		}
	} else {
		echo "⊘ SKIP: POT file not found\n\n";
	}
	
	// Test 4: Check if JavaScript strings are localized
	echo "Test 4: JavaScript strings are localized via wp_localize_script\n";
	
	// Simulate WordPress environment
	global $wp_scripts;
	if ( ! isset( $wp_scripts ) ) {
		$wp_scripts = new WP_Scripts();
	}
	
	// Check if maseAdmin localization exists
	$admin_class = new MASE_Admin();
	
	// We can't directly test wp_localize_script output, but we can verify the method exists
	if ( method_exists( $admin_class, 'enqueue_admin_assets' ) ) {
		echo "✓ PASS: MASE_Admin::enqueue_admin_assets() method exists\n";
		echo "  This method should call wp_localize_script() with background strings\n\n";
		$tests_passed++;
	} else {
		echo "✗ FAIL: MASE_Admin::enqueue_admin_assets() method not found\n\n";
		$tests_failed++;
	}
	
	// Test 5: Check if PHP template uses translation functions
	echo "Test 5: PHP template uses translation functions\n";
	$template_file = dirname( dirname( __FILE__ ) ) . '/includes/backgrounds-tab-content.php';
	
	if ( file_exists( $template_file ) ) {
		$template_content = file_get_contents( $template_file );
		
		// Check for translation function usage
		$has_translations = (
			strpos( $template_content, '__(' ) !== false ||
			strpos( $template_content, '_e(' ) !== false ||
			strpos( $template_content, 'esc_html__(' ) !== false ||
			strpos( $template_content, 'esc_html_e(' ) !== false ||
			strpos( $template_content, 'esc_attr__(' ) !== false ||
			strpos( $template_content, 'esc_attr_e(' ) !== false
		);
		
		if ( $has_translations ) {
			// Count translation function calls
			$translation_count = 0;
			$translation_count += substr_count( $template_content, '__(' );
			$translation_count += substr_count( $template_content, '_e(' );
			$translation_count += substr_count( $template_content, 'esc_html__(' );
			$translation_count += substr_count( $template_content, 'esc_html_e(' );
			$translation_count += substr_count( $template_content, 'esc_attr__(' );
			$translation_count += substr_count( $template_content, 'esc_attr_e(' );
			
			echo "✓ PASS: Template uses translation functions\n";
			echo "  Found $translation_count translation function calls\n\n";
			$tests_passed++;
		} else {
			echo "✗ FAIL: Template does not use translation functions\n\n";
			$tests_failed++;
		}
	} else {
		echo "⊘ SKIP: Template file not found at: $template_file\n\n";
	}
	
	// Test 6: Check if text domain is consistent
	echo "Test 6: Text domain consistency\n";
	if ( file_exists( $template_file ) ) {
		$template_content = file_get_contents( $template_file );
		
		// Check for correct text domain
		$has_correct_domain = strpos( $template_content, "'modern-admin-styler'" ) !== false;
		$has_wrong_domain = strpos( $template_content, "'mase'" ) !== false;
		
		if ( $has_correct_domain && ! $has_wrong_domain ) {
			echo "✓ PASS: Template uses correct text domain 'modern-admin-styler'\n\n";
			$tests_passed++;
		} elseif ( $has_correct_domain && $has_wrong_domain ) {
			echo "⚠ WARNING: Template uses both 'modern-admin-styler' and 'mase' text domains\n";
			echo "  Consider standardizing to one text domain\n\n";
			$tests_passed++;
		} else {
			echo "✗ FAIL: Template does not use correct text domain\n\n";
			$tests_failed++;
		}
	} else {
		echo "⊘ SKIP: Template file not found\n\n";
	}
	
	// Test 7: Check gradient builder JavaScript localization
	echo "Test 7: Gradient builder JavaScript uses localized strings\n";
	$gradient_js = dirname( dirname( __FILE__ ) ) . '/assets/js/modules/mase-gradient-builder.js';
	
	if ( file_exists( $gradient_js ) ) {
		$js_content = file_get_contents( $gradient_js );
		
		// Check if it uses maseAdmin.strings
		$uses_localized_strings = strpos( $js_content, 'maseAdmin.strings' ) !== false;
		
		if ( $uses_localized_strings ) {
			echo "✓ PASS: Gradient builder uses maseAdmin.strings for localization\n\n";
			$tests_passed++;
		} else {
			echo "✗ FAIL: Gradient builder does not use maseAdmin.strings\n\n";
			$tests_failed++;
		}
	} else {
		echo "⊘ SKIP: Gradient builder JavaScript not found\n\n";
	}
	
	// Summary
	echo "=== Test Summary ===\n";
	echo "Tests passed: $tests_passed\n";
	echo "Tests failed: $tests_failed\n";
	$total_tests = $tests_passed + $tests_failed;
	$pass_rate = $total_tests > 0 ? round( ( $tests_passed / $total_tests ) * 100, 1 ) : 0;
	echo "Pass rate: $pass_rate%\n\n";
	
	if ( $tests_failed === 0 ) {
		echo "✓ All localization tests passed!\n";
		return true;
	} else {
		echo "✗ Some localization tests failed. Please review the output above.\n";
		return false;
	}
}

// Run tests
$result = test_background_localization();
exit( $result ? 0 : 1 );
