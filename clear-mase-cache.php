<?php
/**
 * Clear MASE Cache Script
 * 
 * Run this file directly in browser to clear all MASE caches.
 * URL: http://your-site.com/wp-content/plugins/modern-admin-styler/clear-mase-cache.php
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if user is admin
if (!current_user_can('manage_options')) {
    die('Access denied. You must be an administrator.');
}

// Clear all MASE transients
$cleared = array();

// Clear generated CSS cache
if (delete_transient('mase_generated_css')) {
    $cleared[] = 'generated_css';
}

// Clear CacheManager caches
global $wpdb;
$deleted = $wpdb->query(
    "DELETE FROM {$wpdb->options} 
     WHERE option_name LIKE '_transient_mase_%' 
     OR option_name LIKE '_transient_timeout_mase_%'"
);

echo '<h1>MASE Cache Cleared</h1>';
echo '<p>Cleared transients: ' . implode(', ', $cleared) . '</p>';
echo '<p>Deleted ' . $deleted . ' cache entries from database.</p>';
echo '<p><a href="' . admin_url('admin.php?page=mase-settings') . '">Go to MASE Settings</a></p>';
