<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once('../../../wp-load.php');

$_POST['nonce'] = wp_create_nonce('mase_save_settings');
$_POST['settings'] = array('master' => array('enable' => true));

$settings = new MASE_Settings();
$generator = new MASE_CSS_Generator();
$cache = new MASE_CacheManager();
$admin = new MASE_Admin($settings, $generator, $cache);

$admin->handle_ajax_save_settings();
