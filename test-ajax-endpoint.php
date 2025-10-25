<?php
/**
 * Test AJAX endpoint to debug what's being received
 * 
 * Add to wp-config.php:
 * define('WP_DEBUG', true);
 * define('WP_DEBUG_LOG', true);
 * define('WP_DEBUG_DISPLAY', false);
 */

add_action('wp_ajax_mase_test_endpoint', function() {
    error_log('=== MASE TEST ENDPOINT CALLED ===');
    error_log('$_POST keys: ' . implode(', ', array_keys($_POST)));
    error_log('$_POST dump: ' . print_r($_POST, true));
    
    if (isset($_POST['settings'])) {
        error_log('settings type: ' . gettype($_POST['settings']));
        if (is_string($_POST['settings'])) {
            error_log('settings string length: ' . strlen($_POST['settings']));
            error_log('settings first 100 chars: ' . substr($_POST['settings'], 0, 100));
        }
    }
    
    wp_send_json_success(array(
        'message' => 'Test endpoint works!',
        'post_keys' => array_keys($_POST),
        'settings_type' => isset($_POST['settings']) ? gettype($_POST['settings']) : 'not set'
    ));
});

// Register on init
add_action('init', function() {
    error_log('MASE: Test endpoint registered');
});
