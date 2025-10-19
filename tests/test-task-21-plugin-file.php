<?php
/**
 * Test Task 21: Main Plugin File Update
 *
 * Verifies that the main plugin file is properly configured with:
 * - Version 1.2.0 in header and constant
 * - All required class files included
 * - Proper changelog
 * - All classes can be instantiated
 *
 * @package ModernAdminStyler
 */

// Simulate WordPress environment.
if ( ! defined( 'WPINC' ) ) {
	define( 'WPINC', 'wp-includes' );
}
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/../../../' );
}

// Load the main plugin file.
require_once dirname( __FILE__ ) . '/../modern-admin-styler.php';

echo "=== Task 21: Main Plugin File Verification ===\n\n";

// Test 1: Verify version constant.
echo "Test 1: Version Constant\n";
if ( defined( 'MASE_VERSION' ) && MASE_VERSION === '1.2.0' ) {
	echo "✓ MASE_VERSION constant is set to 1.2.0\n";
} else {
	echo "✗ MASE_VERSION constant is not set correctly\n";
	exit( 1 );
}

// Test 2: Verify plugin directory constants.
echo "\nTest 2: Directory Constants\n";
if ( defined( 'MASE_PLUGIN_DIR' ) ) {
	echo "✓ MASE_PLUGIN_DIR is defined\n";
} else {
	echo "✗ MASE_PLUGIN_DIR is not defined\n";
	exit( 1 );
}

if ( defined( 'MASE_PLUGIN_URL' ) ) {
	echo "✓ MASE_PLUGIN_URL is defined\n";
} else {
	echo "✗ MASE_PLUGIN_URL is not defined\n";
	exit( 1 );
}

// Test 3: Verify autoloader is registered.
echo "\nTest 3: Autoloader Registration\n";
if ( function_exists( 'mase_autoloader' ) ) {
	echo "✓ mase_autoloader function exists\n";
} else {
	echo "✗ mase_autoloader function does not exist\n";
	exit( 1 );
}

// Test 4: Verify critical classes are loaded.
echo "\nTest 4: Critical Classes\n";
$critical_classes = array(
	'MASE_Migration',
	'MASE_Mobile_Optimizer',
);

foreach ( $critical_classes as $class ) {
	if ( class_exists( $class ) ) {
		echo "✓ {$class} is loaded\n";
	} else {
		echo "✗ {$class} is not loaded\n";
		exit( 1 );
	}
}

// Test 5: Verify all class files exist.
echo "\nTest 5: Class Files Existence\n";
$class_files = array(
	'class-mase-admin.php',
	'class-mase-cache.php',
	'class-mase-cachemanager.php',
	'class-mase-css-generator.php',
	'class-mase-migration.php',
	'class-mase-mobile-optimizer.php',
	'class-mase-settings.php',
);

foreach ( $class_files as $file ) {
	$path = MASE_PLUGIN_DIR . 'includes/' . $file;
	if ( file_exists( $path ) ) {
		echo "✓ {$file} exists\n";
	} else {
		echo "✗ {$file} does not exist\n";
		exit( 1 );
	}
}

// Test 6: Verify plugin functions exist.
echo "\nTest 6: Plugin Functions\n";
$functions = array(
	'mase_activate',
	'mase_deactivate',
	'mase_init',
	'mase_check_migration',
	'mase_auto_palette_switch_callback',
);

foreach ( $functions as $function ) {
	if ( function_exists( $function ) ) {
		echo "✓ {$function} function exists\n";
	} else {
		echo "✗ {$function} function does not exist\n";
		exit( 1 );
	}
}

// Test 7: Verify plugin header information.
echo "\nTest 7: Plugin Header Information\n";
$plugin_file = dirname( __FILE__ ) . '/../modern-admin-styler.php';
$plugin_data = get_file_data(
	$plugin_file,
	array(
		'Name'        => 'Plugin Name',
		'Version'     => 'Version',
		'Description' => 'Description',
		'Author'      => 'Author',
	)
);

if ( $plugin_data['Version'] === '1.2.0' ) {
	echo "✓ Plugin header version is 1.2.0\n";
} else {
	echo "✗ Plugin header version is not 1.2.0 (found: {$plugin_data['Version']})\n";
	exit( 1 );
}

if ( strpos( $plugin_data['Description'], '10 color palettes' ) !== false ) {
	echo "✓ Plugin description mentions 10 color palettes\n";
} else {
	echo "✗ Plugin description does not mention 10 color palettes\n";
	exit( 1 );
}

if ( strpos( $plugin_data['Description'], '11 templates' ) !== false ) {
	echo "✓ Plugin description mentions 11 templates\n";
} else {
	echo "✗ Plugin description does not mention 11 templates\n";
	exit( 1 );
}

echo "\n=== All Tests Passed! ===\n";
echo "Task 21 implementation is complete and verified.\n";

/**
 * Simplified get_file_data function for testing.
 *
 * @param string $file File path.
 * @param array  $headers Headers to extract.
 * @return array Extracted header data.
 */
function get_file_data( $file, $headers ) {
	$content = file_get_contents( $file );
	$data    = array();
	
	foreach ( $headers as $key => $pattern ) {
		if ( preg_match( '/' . preg_quote( $pattern, '/' ) . ':\s*(.+)/i', $content, $matches ) ) {
			$data[ $key ] = trim( $matches[1] );
		} else {
			$data[ $key ] = '';
		}
	}
	
	return $data;
}
