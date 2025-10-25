<?php
/**
 * Test Task 21: Main Plugin File Verification (Standalone)
 *
 * Verifies the main plugin file without loading WordPress.
 * Checks:
 * - Version 1.2.0 in header and constant
 * - All required class files exist
 * - Proper changelog
 * - File structure
 *
 * @package ModernAdminStyler
 */

echo "=== Task 21: Main Plugin File Verification ===\n\n";

$plugin_dir = dirname( __FILE__ ) . '/../';
$plugin_file = $plugin_dir . 'modern-admin-styler.php';

// Test 1: Verify plugin file exists.
echo "Test 1: Plugin File Existence\n";
if ( file_exists( $plugin_file ) ) {
	echo "✓ modern-admin-styler.php exists\n";
} else {
	echo "✗ modern-admin-styler.php does not exist\n";
	exit( 1 );
}

// Read plugin file content.
$content = file_get_contents( $plugin_file );

// Test 2: Verify version in plugin header.
echo "\nTest 2: Plugin Header Version\n";
if ( preg_match( '/\* Version:\s*(\d+\.\d+\.\d+)/i', $content, $matches ) ) {
	$header_version = $matches[1];
	if ( $header_version === '1.2.0' ) {
		echo "✓ Plugin header version is 1.2.0\n";
	} else {
		echo "✗ Plugin header version is {$header_version}, expected 1.2.0\n";
		exit( 1 );
	}
} else {
	echo "✗ Could not find version in plugin header\n";
	exit( 1 );
}

// Test 3: Verify MASE_VERSION constant.
echo "\nTest 3: MASE_VERSION Constant\n";
if ( preg_match( "/define\s*\(\s*'MASE_VERSION'\s*,\s*'(\d+\.\d+\.\d+)'\s*\)/", $content, $matches ) ) {
	$constant_version = $matches[1];
	if ( $constant_version === '1.2.0' ) {
		echo "✓ MASE_VERSION constant is 1.2.0\n";
	} else {
		echo "✗ MASE_VERSION constant is {$constant_version}, expected 1.2.0\n";
		exit( 1 );
	}
} else {
	echo "✗ Could not find MASE_VERSION constant\n";
	exit( 1 );
}

// Test 4: Verify changelog mentions v1.2.0.
echo "\nTest 4: Changelog\n";
if ( strpos( $content, '1.2.0' ) !== false && strpos( $content, 'Changelog:' ) !== false ) {
	echo "✓ Changelog includes v1.2.0\n";
} else {
	echo "✗ Changelog does not include v1.2.0\n";
	exit( 1 );
}

// Test 5: Verify changelog mentions key features.
echo "\nTest 5: Changelog Features\n";
$features = array(
	'10 color palettes',
	'11 templates',
	'visual effects',
	'mobile optimization',
	'backup/restore',
);

foreach ( $features as $feature ) {
	if ( stripos( $content, $feature ) !== false ) {
		echo "✓ Changelog mentions '{$feature}'\n";
	} else {
		echo "✗ Changelog does not mention '{$feature}'\n";
		exit( 1 );
	}
}

// Test 6: Verify require_once for critical classes.
echo "\nTest 6: Critical Class Includes\n";
$required_classes = array(
	'class-mase-migration.php',
	'class-mase-mobile-optimizer.php',
);

foreach ( $required_classes as $class_file ) {
	if ( strpos( $content, "require_once MASE_PLUGIN_DIR . 'includes/{$class_file}'" ) !== false ) {
		echo "✓ {$class_file} is required\n";
	} else {
		echo "✗ {$class_file} is not required\n";
		exit( 1 );
	}
}

// Test 7: Verify all class files exist.
echo "\nTest 7: Class Files Existence\n";
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
	$path = $plugin_dir . 'includes/' . $file;
	if ( file_exists( $path ) && filesize( $path ) > 0 ) {
		echo "✓ {$file} exists and is not empty\n";
	} else {
		echo "✗ {$file} does not exist or is empty\n";
		exit( 1 );
	}
}

// Test 8: Verify autoloader function exists.
echo "\nTest 8: Autoloader Function\n";
if ( strpos( $content, 'function mase_autoloader' ) !== false ) {
	echo "✓ mase_autoloader function is defined\n";
} else {
	echo "✗ mase_autoloader function is not defined\n";
	exit( 1 );
}

// Test 9: Verify activation/deactivation hooks.
echo "\nTest 9: Plugin Hooks\n";
$hooks = array(
	'register_activation_hook',
	'register_deactivation_hook',
	'mase_activate',
	'mase_deactivate',
	'mase_init',
	'mase_check_migration',
);

foreach ( $hooks as $hook ) {
	if ( strpos( $content, $hook ) !== false ) {
		echo "✓ {$hook} is present\n";
	} else {
		echo "✗ {$hook} is not present\n";
		exit( 1 );
	}
}

// Test 10: Verify migration check is hooked.
echo "\nTest 10: Migration Integration\n";
if ( strpos( $content, "add_action( 'plugins_loaded', 'mase_check_migration', 5 )" ) !== false ) {
	echo "✓ Migration check is hooked to plugins_loaded\n";
} else {
	echo "✗ Migration check is not properly hooked\n";
	exit( 1 );
}

// Test 11: Verify auto palette switching cron.
echo "\nTest 11: Auto Palette Switching\n";
if ( strpos( $content, 'mase_auto_palette_switch' ) !== false ) {
	echo "✓ Auto palette switching cron is configured\n";
} else {
	echo "✗ Auto palette switching cron is not configured\n";
	exit( 1 );
}

// Test 12: Verify requirements are documented.
echo "\nTest 12: Requirements Documentation\n";
$requirements = array( '10.1', '10.2', '10.3', '10.4', '10.5', '15.1', '16.1', '16.4' );
$found_requirements = 0;

foreach ( $requirements as $req ) {
	if ( strpos( $content, $req ) !== false ) {
		$found_requirements++;
	}
}

if ( $found_requirements >= 5 ) {
	echo "✓ Requirements are documented ({$found_requirements} found)\n";
} else {
	echo "✗ Not enough requirements documented ({$found_requirements} found)\n";
	exit( 1 );
}

echo "\n=== All Tests Passed! ===\n";
echo "Task 21 implementation is complete and verified.\n";
echo "\nSummary:\n";
echo "- Plugin version: 1.2.0 ✓\n";
echo "- MASE_VERSION constant: 1.2.0 ✓\n";
echo "- Migration class: Included ✓\n";
echo "- Mobile optimizer: Included ✓\n";
echo "- Changelog: Updated ✓\n";
echo "- All class files: Present ✓\n";
echo "- Requirements: Documented ✓\n";
