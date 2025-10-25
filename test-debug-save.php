<?php
/**
 * Quick test script for settings save debugging
 * 
 * Usage: 
 * 1. Place in plugin root directory
 * 2. Run: wp eval-file test-debug-save.php
 * 3. Check output and wp-content/debug.log
 */

// Load WordPress
if (!defined('ABSPATH')) {
    require_once __DIR__ . '/../../../wp-load.php';
}

// Enable error display for this test
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "\n";
echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║  MASE Settings Save Debug Test                             ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n";
echo "\n";

// Check if WP_DEBUG is enabled
echo "1. Checking WordPress Debug Configuration\n";
echo "   WP_DEBUG: " . (defined('WP_DEBUG') && WP_DEBUG ? "✓ ENABLED" : "✗ DISABLED") . "\n";
echo "   WP_DEBUG_LOG: " . (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG ? "✓ ENABLED" : "✗ DISABLED") . "\n";

if (!defined('WP_DEBUG') || !WP_DEBUG) {
    echo "\n   ⚠️  WARNING: WP_DEBUG is not enabled!\n";
    echo "   Add to wp-config.php:\n";
    echo "   define('WP_DEBUG', true);\n";
    echo "   define('WP_DEBUG_LOG', true);\n";
    echo "   define('WP_DEBUG_DISPLAY', false);\n";
}

echo "\n";

// Check if classes exist
echo "2. Checking MASE Classes\n";
$classes = array(
    'MASE_Settings' => class_exists('MASE_Settings'),
    'MASE_Admin' => class_exists('MASE_Admin'),
    'MASE_CSS_Generator' => class_exists('MASE_CSS_Generator'),
    'MASE_CacheManager' => class_exists('MASE_CacheManager'),
);

foreach ($classes as $class => $exists) {
    echo "   " . $class . ": " . ($exists ? "✓ EXISTS" : "✗ NOT FOUND") . "\n";
}

if (in_array(false, $classes, true)) {
    echo "\n   ✗ ERROR: Some classes are missing. Plugin may not be loaded.\n";
    exit(1);
}

echo "\n";

// Test settings save with debugging
echo "3. Testing Settings Save with Debug Logging\n";
echo "   Creating test settings...\n";

$test_settings = array(
    'master' => array(
        'enable' => true,
    ),
    'admin_bar' => array(
        'bg_color' => '#1F2937',
        'text_color' => '#F9FAFB',
        'height' => 32,
    ),
    'admin_menu' => array(
        'bg_color' => '#1F2937',
        'text_color' => '#F9FAFB',
        'width_unit' => 'pixels',
        'width_value' => 160,
        'height_mode' => 'full',
    ),
    'typography' => array(
        'admin_bar' => array(
            'font_size' => 13,
            'font_weight' => 400,
        ),
    ),
);

// Calculate JSON size
$json = json_encode($test_settings);
$json_size = strlen($json);
$json_size_kb = round($json_size / 1024, 2);

echo "   JSON size: " . $json_size . " bytes (" . $json_size_kb . " KB)\n";
echo "   Sections: " . implode(', ', array_keys($test_settings)) . "\n";
echo "\n";

// Simulate the AJAX handler behavior
echo "4. Simulating AJAX Handler (handle_ajax_save_settings)\n";
echo "   ─────────────────────────────────────────────────────────\n";

// Set up $_POST to simulate AJAX request
$_POST['settings'] = $json;
$_POST['action'] = 'mase_save_settings';
$_POST['nonce'] = wp_create_nonce('mase_save_settings');

// Create instances
$settings = new MASE_Settings();
$generator = new MASE_CSS_Generator($settings);
$cache = new MASE_CacheManager();

echo "   Decoding JSON...\n";
$input = json_decode(stripslashes($_POST['settings']), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo "   ✗ JSON decode error: " . json_last_error_msg() . "\n";
    exit(1);
}

echo "   ✓ JSON decoded successfully\n";
echo "   Decoded sections: " . implode(', ', array_keys($input)) . "\n";
echo "\n";

// Log section sizes (like the new debug code does)
echo "   Section sizes:\n";
foreach ($input as $section => $data) {
    if (is_array($data)) {
        $section_json = json_encode($data);
        $section_size_kb = round(strlen($section_json) / 1024, 2);
        echo "   - " . str_pad($section, 15) . ": " . $section_size_kb . " KB\n";
    }
}

echo "\n";

// Test validation
echo "5. Testing Validation\n";
echo "   Calling MASE_Settings::validate()...\n";

$validated = $settings->validate($input);

if (is_wp_error($validated)) {
    echo "   ✗ VALIDATION FAILED\n";
    echo "   Error: " . $validated->get_error_message() . "\n";
    $error_data = $validated->get_error_data();
    if (is_array($error_data)) {
        echo "   Details:\n";
        foreach ($error_data as $field => $error) {
            echo "   - " . $field . ": " . $error . "\n";
        }
    }
    exit(1);
}

echo "   ✓ VALIDATION PASSED\n";
echo "   Validated sections: " . implode(', ', array_keys($validated)) . "\n";
echo "\n";

// Test update_option
echo "6. Testing update_option\n";
echo "   Calling MASE_Settings::update_option()...\n";

$result = $settings->update_option($input);

if ($result) {
    echo "   ✓ UPDATE SUCCESSFUL\n";
} else {
    echo "   ✗ UPDATE FAILED\n";
    exit(1);
}

echo "\n";

// Verify saved data
echo "7. Verifying Saved Data\n";
$saved = $settings->get_option();

$checks = array(
    'admin_bar.bg_color' => '#1F2937',
    'admin_bar.text_color' => '#F9FAFB',
    'admin_bar.height' => 32,
    'admin_menu.width_value' => 160,
    'admin_menu.height_mode' => 'full',
);

$all_passed = true;
foreach ($checks as $path => $expected) {
    $parts = explode('.', $path);
    $value = $saved;
    foreach ($parts as $part) {
        $value = isset($value[$part]) ? $value[$part] : null;
    }
    
    $passed = ($value == $expected);
    $all_passed = $all_passed && $passed;
    
    echo "   " . ($passed ? "✓" : "✗") . " " . str_pad($path, 30) . ": ";
    echo $value . ($passed ? "" : " (expected: " . $expected . ")") . "\n";
}

echo "\n";

// Final summary
echo "╔════════════════════════════════════════════════════════════╗\n";
if ($all_passed) {
    echo "║  ✓ ALL TESTS PASSED                                        ║\n";
} else {
    echo "║  ✗ SOME TESTS FAILED                                       ║\n";
}
echo "╚════════════════════════════════════════════════════════════╝\n";
echo "\n";

// Instructions
echo "Next Steps:\n";
echo "1. Check wp-content/debug.log for detailed server-side logs\n";
echo "2. Look for lines starting with 'MASE:' to see debug output\n";
echo "3. Test in browser with DevTools Console open\n";
echo "4. Run test-save-settings-debug.html for interactive testing\n";
echo "\n";

echo "Debug Log Location:\n";
echo "   " . WP_CONTENT_DIR . "/debug.log\n";
echo "\n";

// Show last few lines of debug.log if it exists
$debug_log = WP_CONTENT_DIR . '/debug.log';
if (file_exists($debug_log)) {
    echo "Last 20 lines of debug.log:\n";
    echo "─────────────────────────────────────────────────────────\n";
    $lines = file($debug_log);
    $last_lines = array_slice($lines, -20);
    foreach ($last_lines as $line) {
        if (strpos($line, 'MASE:') !== false) {
            echo "   " . trim($line) . "\n";
        }
    }
} else {
    echo "⚠️  debug.log not found. Enable WP_DEBUG_LOG in wp-config.php\n";
}

echo "\n";
