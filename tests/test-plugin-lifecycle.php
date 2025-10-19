<?php
/**
 * Plugin Lifecycle Test
 * 
 * Tests plugin activation, deactivation, and settings preservation
 * 
 * Usage: php tests/test-plugin-lifecycle.php
 */

class MASE_Plugin_Lifecycle_Test {
    private $test_results = [];
    private $errors = [];
    
    public function __construct() {
        echo "\n";
        echo "╔════════════════════════════════════════════════════════════╗\n";
        echo "║     Plugin Lifecycle Test                                  ║\n";
        echo "╚════════════════════════════════════════════════════════════╝\n";
        echo "\n";
    }
    
    /**
     * Run all lifecycle tests
     */
    public function run() {
        $this->test_plugin_file_exists();
        $this->test_plugin_header();
        $this->test_activation_hook();
        $this->test_deactivation_hook();
        $this->test_class_loading();
        $this->test_settings_preservation();
        $this->test_no_php_errors();
        
        $this->print_summary();
        
        return empty($this->errors);
    }
    
    /**
     * Test plugin file exists
     */
    private function test_plugin_file_exists() {
        $this->section("Plugin File Validation");
        
        $plugin_file = dirname(__FILE__) . '/../modern-admin-styler.php';
        
        if (file_exists($plugin_file)) {
            $this->pass("✓ Plugin file exists");
        } else {
            $this->fail("✗ Plugin file not found");
            return;
        }
        
        // Check file is readable
        if (is_readable($plugin_file)) {
            $this->pass("✓ Plugin file is readable");
        } else {
            $this->fail("✗ Plugin file is not readable");
        }
    }
    
    /**
     * Test plugin header
     */
    private function test_plugin_header() {
        $this->section("Plugin Header Validation");
        
        $plugin_file = dirname(__FILE__) . '/../modern-admin-styler.php';
        $content = file_get_contents($plugin_file);
        
        $required_headers = [
            'Plugin Name:',
            'Plugin URI:',
            'Description:',
            'Version:',
            'Author:',
            'License:',
            'Text Domain:',
        ];
        
        foreach ($required_headers as $header) {
            if (stripos($content, $header) !== false) {
                $this->pass("✓ Header found: $header");
            } else {
                $this->fail("✗ Header missing: $header");
            }
        }
        
        // Check version number
        if (preg_match('/Version:\s*(\d+\.\d+\.\d+)/', $content, $matches)) {
            $version = $matches[1];
            $this->pass("✓ Version number found: $version");
            
            // Check if version is 1.2.0 or higher
            if (version_compare($version, '1.2.0', '>=')) {
                $this->pass("✓ Version is 1.2.0 or higher");
            } else {
                $this->warn("⚠ Version is below 1.2.0: $version");
            }
        } else {
            $this->fail("✗ Version number not found");
        }
    }
    
    /**
     * Test activation hook
     */
    private function test_activation_hook() {
        $this->section("Activation Hook Validation");
        
        $plugin_file = dirname(__FILE__) . '/../modern-admin-styler.php';
        $content = file_get_contents($plugin_file);
        
        if (preg_match('/register_activation_hook/', $content)) {
            $this->pass("✓ Activation hook registered");
        } else {
            $this->warn("⚠ Activation hook not found (may be optional)");
        }
    }
    
    /**
     * Test deactivation hook
     */
    private function test_deactivation_hook() {
        $this->section("Deactivation Hook Validation");
        
        $plugin_file = dirname(__FILE__) . '/../modern-admin-styler.php';
        $content = file_get_contents($plugin_file);
        
        if (preg_match('/register_deactivation_hook/', $content)) {
            $this->pass("✓ Deactivation hook registered");
        } else {
            $this->warn("⚠ Deactivation hook not found (may be optional)");
        }
    }
    
    /**
     * Test class loading
     */
    private function test_class_loading() {
        $this->section("Class Loading Validation");
        
        $plugin_file = dirname(__FILE__) . '/../modern-admin-styler.php';
        $content = file_get_contents($plugin_file);
        
        // Check for class includes/requires
        $required_classes = [
            'MASE_Admin',
            'MASE_Settings',
            'MASE_CSS_Generator',
            'MASE_Cache',
        ];
        
        foreach ($required_classes as $class) {
            $class_file = 'class-' . strtolower(str_replace('_', '-', $class)) . '.php';
            
            if (stripos($content, $class_file) !== false || 
                preg_match('/class\s+' . preg_quote($class, '/') . '\s*\{/', $content)) {
                $this->pass("✓ Class loaded or defined: $class");
            } else {
                $this->warn("⚠ Class may not be loaded: $class");
            }
        }
    }
    
    /**
     * Test settings preservation
     */
    private function test_settings_preservation() {
        $this->section("Settings Preservation Validation");
        
        // Check if settings class has proper methods
        $settings_file = dirname(__FILE__) . '/../includes/class-mase-settings.php';
        
        if (file_exists($settings_file)) {
            $content = file_get_contents($settings_file);
            
            // Check for get_option method
            if (preg_match('/function\s+get_option/', $content)) {
                $this->pass("✓ Settings retrieval method exists");
            } else {
                $this->fail("✗ Settings retrieval method missing");
            }
            
            // Check for update_option method
            if (preg_match('/function\s+update_option/', $content)) {
                $this->pass("✓ Settings update method exists");
            } else {
                $this->fail("✗ Settings update method missing");
            }
            
            // Check for WordPress options API usage
            if (stripos($content, 'get_option') !== false && 
                stripos($content, 'update_option') !== false) {
                $this->pass("✓ Uses WordPress options API for persistence");
            } else {
                $this->warn("⚠ May not use WordPress options API");
            }
        } else {
            $this->fail("✗ Settings class file not found");
        }
    }
    
    /**
     * Test for PHP errors
     */
    private function test_no_php_errors() {
        $this->section("PHP Error Check");
        
        $plugin_file = dirname(__FILE__) . '/../modern-admin-styler.php';
        
        // Run PHP lint
        $output = [];
        $return_var = 0;
        exec("php -l " . escapeshellarg($plugin_file) . " 2>&1", $output, $return_var);
        
        if ($return_var === 0) {
            $this->pass("✓ No PHP syntax errors in main plugin file");
        } else {
            $this->fail("✗ PHP syntax errors found:");
            foreach ($output as $line) {
                echo "    $line\n";
            }
        }
        
        // Check all PHP files in includes
        $includes_dir = dirname(__FILE__) . '/../includes/';
        if (is_dir($includes_dir)) {
            $php_files = glob($includes_dir . '*.php');
            $error_count = 0;
            
            foreach ($php_files as $file) {
                $output = [];
                $return_var = 0;
                exec("php -l " . escapeshellarg($file) . " 2>&1", $output, $return_var);
                
                if ($return_var !== 0) {
                    $error_count++;
                }
            }
            
            if ($error_count === 0) {
                $this->pass("✓ No PHP syntax errors in includes directory (" . count($php_files) . " files)");
            } else {
                $this->fail("✗ PHP syntax errors found in $error_count file(s)");
            }
        }
    }
    
    /**
     * Print section header
     */
    private function section($title) {
        echo "\n";
        echo "┌─────────────────────────────────────────────────────────────┐\n";
        echo "│ " . str_pad($title, 59) . " │\n";
        echo "└─────────────────────────────────────────────────────────────┘\n";
    }
    
    /**
     * Record a pass
     */
    private function pass($message) {
        echo "\033[32m$message\033[0m\n";
        $this->test_results[] = ['status' => 'pass', 'message' => $message];
    }
    
    /**
     * Record a failure
     */
    private function fail($message) {
        echo "\033[31m$message\033[0m\n";
        $this->errors[] = $message;
        $this->test_results[] = ['status' => 'fail', 'message' => $message];
    }
    
    /**
     * Record a warning
     */
    private function warn($message) {
        echo "\033[33m$message\033[0m\n";
        $this->test_results[] = ['status' => 'warn', 'message' => $message];
    }
    
    /**
     * Print summary
     */
    private function print_summary() {
        echo "\n";
        echo "╔════════════════════════════════════════════════════════════╗\n";
        echo "║                    TEST SUMMARY                            ║\n";
        echo "╚════════════════════════════════════════════════════════════╝\n";
        echo "\n";
        
        $total = count($this->test_results);
        $passed = count(array_filter($this->test_results, function($r) { return $r['status'] === 'pass'; }));
        $failed = count($this->errors);
        $warned = count(array_filter($this->test_results, function($r) { return $r['status'] === 'warn'; }));
        
        echo "Total Checks: $total\n";
        echo "\033[32mPassed: $passed\033[0m\n";
        echo "\033[31mFailed: $failed\033[0m\n";
        echo "\033[33mWarnings: $warned\033[0m\n";
        echo "\n";
        
        if ($failed > 0) {
            echo "\033[31m✗ LIFECYCLE TEST FAILED\033[0m\n";
        } else if ($warned > 0) {
            echo "\033[33m⚠ LIFECYCLE TEST PASSED WITH WARNINGS\033[0m\n";
        } else {
            echo "\033[32m✓ ALL LIFECYCLE TESTS PASSED\033[0m\n";
        }
        
        echo "\n";
    }
}

// Run test
$test = new MASE_Plugin_Lifecycle_Test();
$success = $test->run();

exit($success ? 0 : 1);
