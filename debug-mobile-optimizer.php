<?php
/**
 * Debug script for Mobile Optimizer error
 * 
 * This script tests the Mobile Optimizer instantiation and methods
 * to identify the exact cause of the 500 error.
 */

// Load WordPress
require_once('../../../wp-load.php');

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo '<h1>MASE Mobile Optimizer Debug</h1>';
echo '<pre>';

// Test 1: Check if class exists
echo "\n=== Test 1: Class Existence ===\n";
if (class_exists('MASE_Mobile_Optimizer')) {
    echo "✓ MASE_Mobile_Optimizer class exists\n";
} else {
    echo "✗ MASE_Mobile_Optimizer class NOT found\n";
    echo "Attempting to load manually...\n";
    require_once('includes/class-mase-mobile-optimizer.php');
    if (class_exists('MASE_Mobile_Optimizer')) {
        echo "✓ Class loaded manually\n";
    } else {
        echo "✗ Failed to load class\n";
        die();
    }
}

// Test 2: Check if wp_is_mobile exists
echo "\n=== Test 2: wp_is_mobile() Function ===\n";
if (function_exists('wp_is_mobile')) {
    echo "✓ wp_is_mobile() function exists\n";
    echo "  Result: " . (wp_is_mobile() ? 'true (mobile)' : 'false (desktop)') . "\n";
} else {
    echo "✗ wp_is_mobile() function NOT found\n";
}

// Test 3: Try to instantiate Mobile Optimizer
echo "\n=== Test 3: Instantiation ===\n";
try {
    $mobile_optimizer = new MASE_Mobile_Optimizer();
    echo "✓ MASE_Mobile_Optimizer instantiated successfully\n";
} catch (Exception $e) {
    echo "✗ Exception during instantiation:\n";
    echo "  Message: " . $e->getMessage() . "\n";
    echo "  File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "  Trace:\n" . $e->getTraceAsString() . "\n";
    die();
} catch (Error $e) {
    echo "✗ Error during instantiation:\n";
    echo "  Message: " . $e->getMessage() . "\n";
    echo "  File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "  Trace:\n" . $e->getTraceAsString() . "\n";
    die();
}

// Test 4: Test is_mobile() method
echo "\n=== Test 4: is_mobile() Method ===\n";
try {
    $result = $mobile_optimizer->is_mobile();
    echo "✓ is_mobile() executed successfully\n";
    echo "  Result: " . ($result ? 'true' : 'false') . "\n";
} catch (Exception $e) {
    echo "✗ Exception in is_mobile():\n";
    echo "  Message: " . $e->getMessage() . "\n";
}

// Test 5: Test get_optimized_settings() method
echo "\n=== Test 5: get_optimized_settings() Method ===\n";
$test_settings = array(
    'admin_bar' => array(
        'bg_color' => '#23282d',
        'height' => 32
    ),
    'mobile' => array(
        'optimized' => true,
        'touch_friendly' => true,
        'compact_mode' => false,
        'reduced_effects' => true
    )
);

try {
    $optimized = $mobile_optimizer->get_optimized_settings($test_settings);
    echo "✓ get_optimized_settings() executed successfully\n";
    echo "  Input settings keys: " . implode(', ', array_keys($test_settings)) . "\n";
    echo "  Output settings keys: " . implode(', ', array_keys($optimized)) . "\n";
} catch (Exception $e) {
    echo "✗ Exception in get_optimized_settings():\n";
    echo "  Message: " . $e->getMessage() . "\n";
    echo "  Trace:\n" . $e->getTraceAsString() . "\n";
}

// Test 6: Test MASE_Settings instantiation
echo "\n=== Test 6: MASE_Settings Class ===\n";
if (class_exists('MASE_Settings')) {
    echo "✓ MASE_Settings class exists\n";
    try {
        $settings = new MASE_Settings();
        echo "✓ MASE_Settings instantiated successfully\n";
    } catch (Exception $e) {
        echo "✗ Exception during MASE_Settings instantiation:\n";
        echo "  Message: " . $e->getMessage() . "\n";
    }
} else {
    echo "✗ MASE_Settings class NOT found\n";
}

// Test 7: Test update_option() with minimal data
echo "\n=== Test 7: update_option() Method ===\n";
if (isset($settings)) {
    $minimal_data = array(
        'admin_bar' => array(
            'bg_color' => '#23282d',
            'text_color' => '#ffffff',
            'height' => 32
        )
    );
    
    try {
        echo "Attempting to save minimal settings...\n";
        $result = $settings->update_option($minimal_data);
        echo "✓ update_option() executed\n";
        echo "  Result: " . ($result ? 'true (success)' : 'false (failed)') . "\n";
    } catch (Exception $e) {
        echo "✗ Exception in update_option():\n";
        echo "  Message: " . $e->getMessage() . "\n";
        echo "  File: " . $e->getFile() . ":" . $e->getLine() . "\n";
        echo "  Trace:\n" . $e->getTraceAsString() . "\n";
    } catch (Error $e) {
        echo "✗ Error in update_option():\n";
        echo "  Message: " . $e->getMessage() . "\n";
        echo "  File: " . $e->getFile() . ":" . $e->getLine() . "\n";
        echo "  Trace:\n" . $e->getTraceAsString() . "\n";
    }
}

// Test 8: Check PHP error log
echo "\n=== Test 8: Recent PHP Errors ===\n";
$error_log = ini_get('error_log');
if ($error_log && file_exists($error_log)) {
    echo "Error log location: $error_log\n";
    $lines = file($error_log);
    $recent = array_slice($lines, -20);
    echo "Last 20 lines:\n";
    foreach ($recent as $line) {
        if (stripos($line, 'MASE') !== false) {
            echo "  " . $line;
        }
    }
} else {
    echo "Error log not found or not configured\n";
}

echo "\n=== Debug Complete ===\n";
echo '</pre>';
