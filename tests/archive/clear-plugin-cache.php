<?php
/**
 * MASE Cache Cleaner
 * 
 * This script clears all MASE plugin caches including:
 * - WordPress transients (mase_css_cache)
 * - WordPress options cache
 * - Object cache (if available)
 * 
 * Usage: php clear-plugin-cache.php
 * Or run from WordPress admin by loading this file
 */

// Determine if running from CLI or WordPress
$is_cli = php_sapi_name() === 'cli';

if ($is_cli) {
    // CLI mode - load WordPress
    $wp_load_paths = [
        __DIR__ . '/../../../wp-load.php',
        __DIR__ . '/../../../../wp-load.php',
        __DIR__ . '/../../../../../wp-load.php',
    ];
    
    $wp_loaded = false;
    foreach ($wp_load_paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            $wp_loaded = true;
            break;
        }
    }
    
    if (!$wp_loaded) {
        die("Error: Could not find wp-load.php. Please run this script from the plugin directory.\n");
    }
} else {
    // Web mode - check if WordPress is loaded
    if (!defined('ABSPATH')) {
        die('Error: WordPress not loaded. Please run this script through WordPress or CLI.');
    }
}

// Colors for CLI output
$colors = [
    'red' => "\033[0;31m",
    'green' => "\033[0;32m",
    'yellow' => "\033[1;33m",
    'blue' => "\033[0;34m",
    'reset' => "\033[0m",
];

// Output functions
function output($message, $color = null) {
    global $is_cli, $colors;
    
    if ($is_cli) {
        if ($color && isset($colors[$color])) {
            echo $colors[$color] . $message . $colors['reset'] . "\n";
        } else {
            echo $message . "\n";
        }
    } else {
        $style = '';
        if ($color === 'green') $style = 'color: green;';
        if ($color === 'red') $style = 'color: red;';
        if ($color === 'yellow') $style = 'color: orange;';
        if ($color === 'blue') $style = 'color: blue;';
        
        echo "<p style='$style'>" . esc_html($message) . "</p>";
    }
}

function output_header($message) {
    global $is_cli;
    
    if ($is_cli) {
        output(str_repeat('=', 60), 'blue');
        output($message, 'blue');
        output(str_repeat('=', 60), 'blue');
    } else {
        echo "<h2>" . esc_html($message) . "</h2>";
    }
}

// Start cache clearing
output_header('MASE Plugin Cache Cleaner');
output('Starting cache cleanup...', 'blue');
output('');

$cleared_count = 0;
$errors = [];

// 1. Clear CSS transient cache
output('1. Clearing CSS transient cache...', 'blue');
try {
    $result = delete_transient('mase_css_cache');
    if ($result) {
        output('   ✓ CSS transient cache cleared', 'green');
        $cleared_count++;
    } else {
        output('   ℹ CSS transient cache was already empty', 'yellow');
    }
} catch (Exception $e) {
    $error = 'Error clearing CSS transient: ' . $e->getMessage();
    output('   ✗ ' . $error, 'red');
    $errors[] = $error;
}

// 2. Clear all MASE-related transients
output('');
output('2. Clearing all MASE transients...', 'blue');
try {
    global $wpdb;
    
    // Get all transients starting with _transient_mase
    $transients = $wpdb->get_col(
        "SELECT option_name FROM {$wpdb->options} 
         WHERE option_name LIKE '_transient_mase%' 
         OR option_name LIKE '_transient_timeout_mase%'"
    );
    
    if (!empty($transients)) {
        foreach ($transients as $transient) {
            // Remove _transient_ or _transient_timeout_ prefix
            $key = str_replace(['_transient_timeout_', '_transient_'], '', $transient);
            delete_transient($key);
        }
        output('   ✓ Cleared ' . count($transients) . ' MASE transients', 'green');
        $cleared_count += count($transients);
    } else {
        output('   ℹ No MASE transients found', 'yellow');
    }
} catch (Exception $e) {
    $error = 'Error clearing MASE transients: ' . $e->getMessage();
    output('   ✗ ' . $error, 'red');
    $errors[] = $error;
}

// 3. Clear WordPress object cache (if available)
output('');
output('3. Clearing WordPress object cache...', 'blue');
try {
    if (function_exists('wp_cache_flush')) {
        $result = wp_cache_flush();
        if ($result) {
            output('   ✓ Object cache flushed', 'green');
            $cleared_count++;
        } else {
            output('   ℹ Object cache flush returned false', 'yellow');
        }
    } else {
        output('   ℹ Object cache not available', 'yellow');
    }
} catch (Exception $e) {
    $error = 'Error flushing object cache: ' . $e->getMessage();
    output('   ✗ ' . $error, 'red');
    $errors[] = $error;
}

// 4. Clear MASE settings cache (if using cache manager)
output('');
output('4. Clearing MASE settings cache...', 'blue');
try {
    // Check if MASE_CacheManager class exists
    if (class_exists('MASE_CacheManager')) {
        $cache_manager = new MASE_CacheManager();
        $cache_manager->clear_all();
        output('   ✓ MASE CacheManager cleared', 'green');
        $cleared_count++;
    } else {
        output('   ℹ MASE_CacheManager class not found', 'yellow');
    }
} catch (Exception $e) {
    $error = 'Error clearing MASE CacheManager: ' . $e->getMessage();
    output('   ✗ ' . $error, 'red');
    $errors[] = $error;
}

// 5. Clear opcache (if available)
output('');
output('5. Clearing PHP opcache...', 'blue');
try {
    if (function_exists('opcache_reset')) {
        opcache_reset();
        output('   ✓ PHP opcache cleared', 'green');
        $cleared_count++;
    } else {
        output('   ℹ PHP opcache not available', 'yellow');
    }
} catch (Exception $e) {
    $error = 'Error clearing opcache: ' . $e->getMessage();
    output('   ✗ ' . $error, 'red');
    $errors[] = $error;
}

// 6. Clear rewrite rules cache
output('');
output('6. Flushing rewrite rules...', 'blue');
try {
    flush_rewrite_rules(false);
    output('   ✓ Rewrite rules flushed', 'green');
    $cleared_count++;
} catch (Exception $e) {
    $error = 'Error flushing rewrite rules: ' . $e->getMessage();
    output('   ✗ ' . $error, 'red');
    $errors[] = $error;
}

// Summary
output('');
output_header('Cache Cleanup Summary');

if (empty($errors)) {
    output('✓ Cache cleanup completed successfully!', 'green');
    output('✓ Total operations: ' . $cleared_count, 'green');
} else {
    output('⚠ Cache cleanup completed with errors', 'yellow');
    output('✓ Successful operations: ' . $cleared_count, 'green');
    output('✗ Errors: ' . count($errors), 'red');
    output('');
    output('Error details:', 'red');
    foreach ($errors as $error) {
        output('  - ' . $error, 'red');
    }
}

output('');
output('Next steps:', 'blue');
output('1. Reload your WordPress admin page');
output('2. Go to MASE settings page');
output('3. Verify that settings are loading correctly');
output('4. CSS will be regenerated on next page load');
output('');

// Additional info
output('Cache locations:', 'blue');
output('- Transients: wp_options table (_transient_mase*)');
output('- Object cache: WordPress object cache (if available)');
output('- CSS cache: Transient (mase_css_cache)');
output('- Settings: wp_options table (mase_settings)');
output('');

if ($is_cli) {
    exit(0);
} else {
    echo "<hr>";
    echo "<p><a href='" . admin_url('admin.php?page=mase-settings') . "'>Go to MASE Settings</a></p>";
    echo "<p><a href='" . admin_url('plugins.php') . "'>Go to Plugins</a></p>";
}
