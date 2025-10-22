<?php
/**
 * Debug script to test save settings
 * 
 * Usage: Access via browser to see what's happening
 * Delete this file after debugging
 */

// Load WordPress
require_once( 'wp-load.php' );

// Check if user is admin
if ( ! current_user_can( 'manage_options' ) ) {
	die( 'Access denied' );
}

echo '<h1>MASE Save Settings Debug</h1>';

// Enable error display
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Get current settings
$settings = new MASE_Settings();
$current = $settings->get_option();

echo '<h2>Current Settings:</h2>';
echo '<pre>';
print_r( $current );
echo '</pre>';

// Try to save with minimal data
echo '<h2>Testing Save with Minimal Data:</h2>';

$test_data = array(
	'admin_bar' => array(
		'bg_color' => '#23282d',
		'text_color' => '#ffffff',
		'height' => 32,
	),
	'admin_menu' => array(
		'bg_color' => '#23282d',
		'text_color' => '#ffffff',
		'hover_bg_color' => '#191e23',
		'hover_text_color' => '#00b9eb',
		'width' => 160,
		'height_mode' => 'full',
	),
);

echo '<h3>Test Data:</h3>';
echo '<pre>';
print_r( $test_data );
echo '</pre>';

echo '<h3>Attempting Save...</h3>';
$result = $settings->update_option( $test_data );

echo '<h3>Result:</h3>';
echo '<p><strong>' . ( $result ? 'SUCCESS' : 'FAILED' ) . '</strong></p>';

if ( ! $result ) {
	echo '<p style="color: red;">Check wp-content/debug.log for error details</p>';
}

echo '<hr>';
echo '<h2>Recent Error Log (last 50 lines):</h2>';
$log_file = WP_CONTENT_DIR . '/debug.log';
if ( file_exists( $log_file ) ) {
	$lines = file( $log_file );
	$recent = array_slice( $lines, -50 );
	echo '<pre style="background: #f0f0f0; padding: 10px; overflow: auto; max-height: 400px;">';
	echo esc_html( implode( '', $recent ) );
	echo '</pre>';
} else {
	echo '<p>No debug.log file found. Enable WP_DEBUG_LOG in wp-config.php</p>';
}

echo '<hr>';
echo '<p><a href="' . admin_url( 'admin.php?page=modern-admin-styler' ) . '">Back to MASE Settings</a></p>';
