-- MASE Cache Clear SQL Script
-- Run this in your WordPress database to clear all MASE caches

-- Clear transients (cache)
DELETE FROM wp_options WHERE option_name LIKE '_transient_mase_%';
DELETE FROM wp_options WHERE option_name LIKE '_transient_timeout_mase_%';

-- Clear specific MASE caches
DELETE FROM wp_options WHERE option_name = 'mase_generated_css';
DELETE FROM wp_options WHERE option_name = '_transient_mase_generated_css';
DELETE FROM wp_options WHERE option_name = '_transient_timeout_mase_generated_css';
DELETE FROM wp_options WHERE option_name = '_transient_mase_light_mode_css';
DELETE FROM wp_options WHERE option_name = '_transient_timeout_mase_light_mode_css';
DELETE FROM wp_options WHERE option_name = '_transient_mase_dark_mode_css';
DELETE FROM wp_options WHERE option_name = '_transient_timeout_mase_dark_mode_css';
DELETE FROM wp_options WHERE option_name = '_transient_mase_login_css';
DELETE FROM wp_options WHERE option_name = '_transient_timeout_mase_login_css';
DELETE FROM wp_options WHERE option_name = '_transient_mase_button_css';
DELETE FROM wp_options WHERE option_name = '_transient_timeout_mase_button_css';

-- Show results
SELECT 'Cache cleared successfully!' AS status;
