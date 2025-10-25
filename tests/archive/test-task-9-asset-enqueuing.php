<?php
/**
 * Test Task 9: Asset Enqueuing in MASE_Admin
 *
 * Verifies that all CSS and JS files are properly enqueued with correct dependencies.
 *
 * @package Modern_Admin_Styler_Enterprise
 */

// Mock WordPress functions for testing.
if ( ! function_exists( 'plugins_url' ) ) {
	function plugins_url( $path, $file ) {
		return 'http://example.com/wp-content/plugins/mase' . $path;
	}
}

if ( ! function_exists( 'admin_url' ) ) {
	function admin_url( $path ) {
		return 'http://example.com/wp-admin/' . $path;
	}
}

if ( ! function_exists( 'wp_create_nonce' ) ) {
	function wp_create_nonce( $action ) {
		return 'test_nonce_' . $action;
	}
}

if ( ! function_exists( '__' ) ) {
	function __( $text, $domain ) {
		return $text;
	}
}

// Track enqueued assets.
$enqueued_styles = array();
$enqueued_scripts = array();
$localized_scripts = array();

function wp_enqueue_style( $handle, $src = '', $deps = array(), $ver = false, $media = 'all' ) {
	global $enqueued_styles;
	$enqueued_styles[ $handle ] = array(
		'src'  => $src,
		'deps' => $deps,
		'ver'  => $ver,
	);
}

function wp_enqueue_script( $handle, $src = '', $deps = array(), $ver = false, $in_footer = false ) {
	global $enqueued_scripts;
	$enqueued_scripts[ $handle ] = array(
		'src'       => $src,
		'deps'      => $deps,
		'ver'       => $ver,
		'in_footer' => $in_footer,
	);
}

function wp_localize_script( $handle, $object_name, $data ) {
	global $localized_scripts;
	$localized_scripts[ $handle ] = array(
		'object_name' => $object_name,
		'data'        => $data,
	);
}

// Mock classes.
class MASE_Settings {
	public function get_all_palettes() {
		return array(
			'professional-blue' => array(
				'id'   => 'professional-blue',
				'name' => 'Professional Blue',
			),
		);
	}

	public function get_all_templates() {
		return array(
			'default' => array(
				'id'   => 'default',
				'name' => 'Default',
			),
		);
	}
}

class MASE_CSS_Generator {}
class MASE_CacheManager {}

// Load the class.
require_once __DIR__ . '/../includes/class-mase-admin.php';

// Create instance.
$settings = new MASE_Settings();
$generator = new MASE_CSS_Generator();
$cache = new MASE_CacheManager();
$admin = new MASE_Admin( $settings, $generator, $cache );

// Test enqueue_assets method.
echo "Testing Task 9: Asset Enqueuing\n";
echo "================================\n\n";

// Simulate being on the settings page.
$admin->enqueue_assets( 'toplevel_page_mase-settings' );

// Verify CSS files are enqueued.
echo "CSS Files Enqueued:\n";
echo "-------------------\n";

$required_styles = array(
	'wp-color-picker' => array( 'deps' => array() ),
	'mase-admin'      => array( 'deps' => array( 'wp-color-picker' ) ),
	'mase-palettes'   => array( 'deps' => array( 'mase-admin' ) ),
	'mase-templates'  => array( 'deps' => array( 'mase-admin' ) ),
);

$css_pass = true;
foreach ( $required_styles as $handle => $expected ) {
	if ( isset( $enqueued_styles[ $handle ] ) ) {
		$style = $enqueued_styles[ $handle ];
		$deps_match = $style['deps'] === $expected['deps'];
		$status = $deps_match ? '✓' : '✗';
		echo "{$status} {$handle}: " . ( $deps_match ? 'PASS' : 'FAIL (deps mismatch)' ) . "\n";
		if ( ! $deps_match ) {
			echo "   Expected deps: " . implode( ', ', $expected['deps'] ) . "\n";
			echo "   Actual deps: " . implode( ', ', $style['deps'] ) . "\n";
			$css_pass = false;
		}
	} else {
		echo "✗ {$handle}: FAIL (not enqueued)\n";
		$css_pass = false;
	}
}

echo "\n";

// Verify JS files are enqueued.
echo "JS Files Enqueued:\n";
echo "------------------\n";

$required_scripts = array(
	'wp-color-picker' => array( 'deps' => array() ),
	'mase-admin'      => array( 'deps' => array( 'jquery', 'wp-color-picker' ) ),
);

$js_pass = true;
foreach ( $required_scripts as $handle => $expected ) {
	if ( isset( $enqueued_scripts[ $handle ] ) ) {
		$script = $enqueued_scripts[ $handle ];
		$deps_match = $script['deps'] === $expected['deps'];
		$status = $deps_match ? '✓' : '✗';
		echo "{$status} {$handle}: " . ( $deps_match ? 'PASS' : 'FAIL (deps mismatch)' ) . "\n";
		if ( ! $deps_match ) {
			echo "   Expected deps: " . implode( ', ', $expected['deps'] ) . "\n";
			echo "   Actual deps: " . implode( ', ', $script['deps'] ) . "\n";
			$js_pass = false;
		}
	} else {
		echo "✗ {$handle}: FAIL (not enqueued)\n";
		$js_pass = false;
	}
}

echo "\n";

// Verify localized script data.
echo "Localized Script Data:\n";
echo "----------------------\n";

$localize_pass = true;
if ( isset( $localized_scripts['mase-admin'] ) ) {
	$localized = $localized_scripts['mase-admin'];
	
	// Check object name.
	if ( $localized['object_name'] === 'maseAdmin' ) {
		echo "✓ Object name: PASS (maseAdmin)\n";
	} else {
		echo "✗ Object name: FAIL (expected 'maseAdmin', got '{$localized['object_name']}')\n";
		$localize_pass = false;
	}
	
	// Check required data keys.
	$required_keys = array( 'ajaxUrl', 'nonce', 'palettes', 'templates', 'strings' );
	foreach ( $required_keys as $key ) {
		if ( isset( $localized['data'][ $key ] ) ) {
			echo "✓ Data key '{$key}': PASS\n";
		} else {
			echo "✗ Data key '{$key}': FAIL (missing)\n";
			$localize_pass = false;
		}
	}
	
	// Check strings.
	$required_strings = array(
		'saving', 'saved', 'saveFailed', 'paletteApplied', 'paletteApplyFailed',
		'templateApplied', 'templateApplyFailed', 'confirmDelete', 'exportSuccess',
		'exportFailed', 'importSuccess', 'importFailed', 'invalidFile',
		'backupCreated', 'backupRestored', 'networkError',
	);
	
	$missing_strings = array();
	foreach ( $required_strings as $string_key ) {
		if ( ! isset( $localized['data']['strings'][ $string_key ] ) ) {
			$missing_strings[] = $string_key;
		}
	}
	
	if ( empty( $missing_strings ) ) {
		echo "✓ All required strings: PASS (" . count( $required_strings ) . " strings)\n";
	} else {
		echo "✗ Missing strings: FAIL (" . implode( ', ', $missing_strings ) . ")\n";
		$localize_pass = false;
	}
} else {
	echo "✗ Script localization: FAIL (not localized)\n";
	$localize_pass = false;
}

echo "\n";

// Test conditional loading.
echo "Conditional Loading:\n";
echo "--------------------\n";

// Reset tracking arrays.
$enqueued_styles = array();
$enqueued_scripts = array();
$localized_scripts = array();

// Simulate being on a different page.
$admin->enqueue_assets( 'index.php' );

$conditional_pass = empty( $enqueued_styles ) && empty( $enqueued_scripts );
if ( $conditional_pass ) {
	echo "✓ Conditional loading: PASS (no assets on other pages)\n";
} else {
	echo "✗ Conditional loading: FAIL (assets enqueued on wrong page)\n";
}

echo "\n";

// Final summary.
echo "Summary:\n";
echo "========\n";
$all_pass = $css_pass && $js_pass && $localize_pass && $conditional_pass;
if ( $all_pass ) {
	echo "✓ ALL TESTS PASSED\n";
	echo "\nTask 9 implementation is complete and correct!\n";
	exit( 0 );
} else {
	echo "✗ SOME TESTS FAILED\n";
	echo "\nPlease review the failures above.\n";
	exit( 1 );
}
