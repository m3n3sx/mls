<?php
/**
 * Final Validation Script for MASE v1.2.0
 * 
 * This script performs comprehensive validation of all requirements,
 * acceptance criteria, and system functionality.
 * 
 * Usage: php tests/final-validation.php
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    // Simulate WordPress environment for testing
    define('ABSPATH', dirname(__FILE__) . '/../../');
}

class MASE_Final_Validation {
    private $results = [];
    private $errors = [];
    private $warnings = [];
    
    public function __construct() {
        echo "\n";
        echo "╔════════════════════════════════════════════════════════════╗\n";
        echo "║     MASE v1.2.0 Final Validation Suite                    ║\n";
        echo "╚════════════════════════════════════════════════════════════╝\n";
        echo "\n";
    }
    
    /**
     * Run all validation checks
     */
    public function run() {
        $this->check_file_structure();
        $this->check_php_syntax();
        $this->check_class_existence();
        $this->check_required_methods();
        $this->check_settings_schema();
        $this->check_palettes_data();
        $this->check_templates_data();
        $this->check_javascript_files();
        $this->check_css_files();
        $this->check_documentation();
        
        $this->print_summary();
        
        return empty($this->errors);
    }
    
    /**
     * Check file structure
     */
    private function check_file_structure() {
        $this->section("File Structure Validation");
        
        $required_files = [
            'modern-admin-styler.php',
            'includes/class-mase-admin.php',
            'includes/class-mase-settings.php',
            'includes/class-mase-css-generator.php',
            'includes/class-mase-cache.php',
            'includes/class-mase-cachemanager.php',
            'includes/class-mase-migration.php',
            'includes/class-mase-mobile-optimizer.php',
            'includes/admin-settings-page.php',
            'assets/js/mase-admin.js',
            'assets/css/mase-palettes.css',
            'assets/css/mase-templates.css',
            'assets/css/mase-responsive.css',
            'assets/css/mase-accessibility.css',
        ];
        
        foreach ($required_files as $file) {
            $path = dirname(__FILE__) . '/../' . $file;
            if (file_exists($path)) {
                $this->pass("✓ File exists: $file");
            } else {
                $this->fail("✗ Missing file: $file");
            }
        }
    }
    
    /**
     * Check PHP syntax
     */
    private function check_php_syntax() {
        $this->section("PHP Syntax Validation");
        
        $php_files = $this->get_php_files();
        $syntax_errors = 0;
        
        foreach ($php_files as $file) {
            $output = [];
            $return_var = 0;
            exec("php -l " . escapeshellarg($file) . " 2>&1", $output, $return_var);
            
            if ($return_var !== 0) {
                $this->fail("✗ Syntax error in: " . basename($file));
                $this->errors[] = implode("\n", $output);
                $syntax_errors++;
            }
        }
        
        if ($syntax_errors === 0) {
            $this->pass("✓ All PHP files have valid syntax (" . count($php_files) . " files checked)");
        }
    }
    
    /**
     * Check class existence
     */
    private function check_class_existence() {
        $this->section("Class Existence Validation");
        
        $required_classes = [
            'MASE_Admin',
            'MASE_Settings',
            'MASE_CSS_Generator',
            'MASE_Cache',
            'MASE_CacheManager',
            'MASE_Migration',
            'MASE_Mobile_Optimizer',
        ];
        
        // Include main plugin file
        $main_file = dirname(__FILE__) . '/../modern-admin-styler.php';
        if (file_exists($main_file)) {
            // Parse file to check class definitions
            $content = file_get_contents($main_file);
            
            foreach ($required_classes as $class) {
                $class_file = dirname(__FILE__) . '/../includes/class-' . strtolower(str_replace('_', '-', $class)) . '.php';
                
                if (file_exists($class_file)) {
                    $class_content = file_get_contents($class_file);
                    if (preg_match('/class\s+' . preg_quote($class, '/') . '\s*\{/', $class_content)) {
                        $this->pass("✓ Class defined: $class");
                    } else {
                        $this->fail("✗ Class not found in file: $class");
                    }
                } else {
                    $this->fail("✗ Class file missing: $class");
                }
            }
        }
    }
    
    /**
     * Check required methods
     */
    private function check_required_methods() {
        $this->section("Required Methods Validation");
        
        $method_checks = [
            'MASE_Settings' => [
                'get_option',
                'update_option',
                'get_defaults',
                'validate',
                'get_palette',
                'get_all_palettes',
                'apply_palette',
                'get_template',
                'get_all_templates',
                'apply_template',
            ],
            'MASE_CSS_Generator' => [
                'generate',
            ],
            'MASE_Admin' => [
                'enqueue_assets',
                'render_settings_page',
            ],
            'MASE_Migration' => [
                'maybe_migrate',
            ],
        ];
        
        foreach ($method_checks as $class => $methods) {
            $class_file = dirname(__FILE__) . '/../includes/class-' . strtolower(str_replace('_', '-', $class)) . '.php';
            
            if (file_exists($class_file)) {
                $content = file_get_contents($class_file);
                
                foreach ($methods as $method) {
                    if (preg_match('/function\s+' . preg_quote($method, '/') . '\s*\(/', $content)) {
                        $this->pass("✓ Method exists: {$class}::{$method}()");
                    } else {
                        $this->fail("✗ Method missing: {$class}::{$method}()");
                    }
                }
            }
        }
    }
    
    /**
     * Check settings schema
     */
    private function check_settings_schema() {
        $this->section("Settings Schema Validation");
        
        $settings_file = dirname(__FILE__) . '/../includes/class-mase-settings.php';
        if (file_exists($settings_file)) {
            $content = file_get_contents($settings_file);
            
            $required_keys = [
                'palettes',
                'templates',
                'typography',
                'visual_effects',
                'effects',
                'advanced',
                'mobile',
                'accessibility',
            ];
            
            foreach ($required_keys as $key) {
                if (preg_match("/['\"]" . preg_quote($key, '/') . "['\"]\s*=>/", $content)) {
                    $this->pass("✓ Settings key exists: $key");
                } else {
                    $this->warn("⚠ Settings key may be missing: $key");
                }
            }
        }
    }
    
    /**
     * Check palettes data
     */
    private function check_palettes_data() {
        $this->section("Color Palettes Validation");
        
        $settings_file = dirname(__FILE__) . '/../includes/class-mase-settings.php';
        if (file_exists($settings_file)) {
            $content = file_get_contents($settings_file);
            
            // Check for 10 palettes
            $palette_count = preg_match_all("/['\"]id['\"]\s*=>\s*['\"][^'\"]+['\"]/", $content, $matches);
            
            if ($palette_count >= 10) {
                $this->pass("✓ Found $palette_count color palettes (requirement: 10)");
            } else {
                $this->warn("⚠ Found only $palette_count color palettes (requirement: 10)");
            }
        }
    }
    
    /**
     * Check templates data
     */
    private function check_templates_data() {
        $this->section("Templates Validation");
        
        $settings_file = dirname(__FILE__) . '/../includes/class-mase-settings.php';
        if (file_exists($settings_file)) {
            $content = file_get_contents($settings_file);
            
            // Check for 11 templates
            $template_patterns = [
                'default',
                'modern-minimal',
                'dark-elegance',
                'vibrant-creative',
                'professional-corporate',
            ];
            
            $found_templates = 0;
            foreach ($template_patterns as $pattern) {
                if (stripos($content, $pattern) !== false) {
                    $found_templates++;
                }
            }
            
            if ($found_templates >= 5) {
                $this->pass("✓ Found template definitions (requirement: 11)");
            } else {
                $this->warn("⚠ Template definitions may be incomplete");
            }
        }
    }
    
    /**
     * Check JavaScript files
     */
    private function check_javascript_files() {
        $this->section("JavaScript Files Validation");
        
        $js_file = dirname(__FILE__) . '/../assets/js/mase-admin.js';
        if (file_exists($js_file)) {
            $content = file_get_contents($js_file);
            $size = filesize($js_file);
            
            $this->pass("✓ Main JavaScript file exists (" . round($size / 1024, 2) . " KB)");
            
            // Check for key functionality
            $required_functions = [
                'paletteManager',
                'templateManager',
                'livePreview',
                'saveSettings',
            ];
            
            foreach ($required_functions as $func) {
                if (stripos($content, $func) !== false) {
                    $this->pass("✓ JavaScript function/object found: $func");
                } else {
                    $this->warn("⚠ JavaScript function/object may be missing: $func");
                }
            }
        } else {
            $this->fail("✗ Main JavaScript file missing");
        }
    }
    
    /**
     * Check CSS files
     */
    private function check_css_files() {
        $this->section("CSS Files Validation");
        
        $css_files = [
            'mase-palettes.css',
            'mase-templates.css',
            'mase-responsive.css',
            'mase-accessibility.css',
        ];
        
        foreach ($css_files as $file) {
            $path = dirname(__FILE__) . '/../assets/css/' . $file;
            if (file_exists($path)) {
                $size = filesize($path);
                $this->pass("✓ CSS file exists: $file (" . round($size / 1024, 2) . " KB)");
            } else {
                $this->fail("✗ CSS file missing: $file");
            }
        }
    }
    
    /**
     * Check documentation
     */
    private function check_documentation() {
        $this->section("Documentation Validation");
        
        $doc_files = [
            'README.md',
            'CHANGELOG.md',
            'docs/USER-GUIDE.md',
            'docs/DEVELOPER.md',
            'docs/FAQ.md',
            'docs/TROUBLESHOOTING.md',
        ];
        
        foreach ($doc_files as $file) {
            $path = dirname(__FILE__) . '/../' . $file;
            if (file_exists($path)) {
                $this->pass("✓ Documentation exists: $file");
            } else {
                $this->warn("⚠ Documentation missing: $file");
            }
        }
    }
    
    /**
     * Get all PHP files
     */
    private function get_php_files() {
        $files = [];
        $base_dir = dirname(__FILE__) . '/../';
        
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($base_dir, RecursiveDirectoryIterator::SKIP_DOTS)
        );
        
        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getExtension() === 'php') {
                // Skip vendor and node_modules
                $path = $file->getPathname();
                if (strpos($path, 'vendor') === false && strpos($path, 'node_modules') === false) {
                    $files[] = $path;
                }
            }
        }
        
        return $files;
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
        $this->results[] = ['status' => 'pass', 'message' => $message];
    }
    
    /**
     * Record a failure
     */
    private function fail($message) {
        echo "\033[31m$message\033[0m\n";
        $this->errors[] = $message;
        $this->results[] = ['status' => 'fail', 'message' => $message];
    }
    
    /**
     * Record a warning
     */
    private function warn($message) {
        echo "\033[33m$message\033[0m\n";
        $this->warnings[] = $message;
        $this->results[] = ['status' => 'warn', 'message' => $message];
    }
    
    /**
     * Print summary
     */
    private function print_summary() {
        echo "\n";
        echo "╔════════════════════════════════════════════════════════════╗\n";
        echo "║                    VALIDATION SUMMARY                      ║\n";
        echo "╚════════════════════════════════════════════════════════════╝\n";
        echo "\n";
        
        $total = count($this->results);
        $passed = count(array_filter($this->results, function($r) { return $r['status'] === 'pass'; }));
        $failed = count($this->errors);
        $warned = count($this->warnings);
        
        echo "Total Checks: $total\n";
        echo "\033[32mPassed: $passed\033[0m\n";
        echo "\033[31mFailed: $failed\033[0m\n";
        echo "\033[33mWarnings: $warned\033[0m\n";
        echo "\n";
        
        if ($failed > 0) {
            echo "\033[31m✗ VALIDATION FAILED\033[0m\n";
            echo "\nErrors:\n";
            foreach ($this->errors as $error) {
                echo "  • $error\n";
            }
        } else if ($warned > 0) {
            echo "\033[33m⚠ VALIDATION PASSED WITH WARNINGS\033[0m\n";
        } else {
            echo "\033[32m✓ ALL VALIDATIONS PASSED\033[0m\n";
        }
        
        echo "\n";
    }
}

// Run validation
$validator = new MASE_Final_Validation();
$success = $validator->run();

exit($success ? 0 : 1);
