<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once('../../../wp-load.php');

// Simulate logged in admin
wp_set_current_user(1);

// Simulate AJAX request
$_POST['action'] = 'mase_save_settings';
$_POST['nonce'] = wp_create_nonce('mase_save_settings');
$_POST['settings'] = array(
    'master' => array('enable' => true),
    'admin_bar' => array('bg_color' => '#23282d')
);

define('DOING_AJAX', true);

try {
    do_action('wp_ajax_mase_save_settings');
} catch (Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
