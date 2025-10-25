<?php
require_once('../../../wp-load.php');
$_POST['nonce'] = wp_create_nonce('mase_save_settings');
$_POST['settings'] = array('master' => array('enable' => true));
$_REQUEST['action'] = 'mase_save_settings';
do_action('wp_ajax_mase_save_settings');
