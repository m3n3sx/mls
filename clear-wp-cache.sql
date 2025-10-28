-- MASE Plugin - WordPress Database Cache Cleaner
-- This SQL script clears all MASE-related cache from WordPress database
-- 
-- IMPORTANT: Backup your database before running this script!
-- 
-- Usage:
--   mysql -u username -p database_name < clear-wp-cache.sql
-- Or from phpMyAdmin: Import this file

-- Clear MASE CSS transient cache
DELETE FROM wp_options WHERE option_name = '_transient_mase_css_cache';
DELETE FROM wp_options WHERE option_name = '_transient_timeout_mase_css_cache';

-- Clear all MASE transients
DELETE FROM wp_options WHERE option_name LIKE '_transient_mase%';
DELETE FROM wp_options WHERE option_name LIKE '_transient_timeout_mase%';

-- Clear MASE autoload cache (if any)
DELETE FROM wp_options WHERE option_name LIKE 'mase_cache_%';

-- Optimize the options table after deletion
OPTIMIZE TABLE wp_options;

-- Show results
SELECT 'MASE cache cleared successfully!' AS Status;
SELECT COUNT(*) AS 'Remaining MASE options' FROM wp_options WHERE option_name LIKE '%mase%';
