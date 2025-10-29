<?php
/**
 * Clear MASE Cache Script
 * 
 * Run this script to clear all MASE caches and force regeneration of CSS.
 * Usage: php clear-mase-cache.php
 */

// Load WordPress
require_once __DIR__ . '/../../../wp-load.php';

// Check if we're in WordPress environment
if (!defined('ABSPATH')) {
    die('WordPress not loaded. Make sure wp-load.php path is correct.');
}

echo "=== MASE Cache Clear Script ===\n\n";

// Load MASE classes
require_once __DIR__ . '/includes/class-mase-cachemanager.php';

// Create cache manager instance
$cache = new MASE_CacheManager();

// Clear all caches
echo "Clearing all MASE caches...\n";
$result = $cache->clear_all();

if ($result) {
    echo "✓ All MASE caches cleared successfully!\n";
} else {
    echo "✗ Failed to clear caches.\n";
}

// Also clear WordPress object cache if available
if (function_exists('wp_cache_flush')) {
    wp_cache_flush();
    echo "✓ WordPress object cache flushed.\n";
}

// Clear specific MASE transients
$cleared = array();
$keys = array('generated_css', 'mase_css', 'mase_settings');

foreach ($keys as $key) {
    if (delete_transient('mase_' . $key)) {
        $cleared[] = $key;
    }
}

if (!empty($cleared)) {
    echo "✓ Cleared specific transients: " . implode(', ', $cleared) . "\n";
}

echo "\n=== Cache Clear Complete ===\n";
echo "Please refresh your WordPress admin page to see changes.\n";
