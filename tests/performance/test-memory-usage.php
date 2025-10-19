<?php
/**
 * Memory Usage Performance Test
 * 
 * Tests memory consumption against the <50MB target (Requirement 4.4)
 * 
 * Usage: php test-memory-usage.php
 */

// Simulate WordPress environment
define('ABSPATH', dirname(__FILE__) . '/../../');
define('WP_DEBUG', true);

// Mock WordPress functions
function esc_attr($text) { return htmlspecialchars($text, ENT_QUOTES); }
function esc_html($text) { return htmlspecialchars($text, ENT_QUOTES); }
function update_option($option, $value) { return true; }
function get_option($option, $default = false) { return $default; }

// Load required classes
require_once dirname(__FILE__) . '/../../includes/class-mase-settings.php';
require_once dirname(__FILE__) . '/../../includes/class-mase-css-generator.php';
require_once dirname(__FILE__) . '/../../includes/class-mase-admin.php';

class Memory_Usage_Test {
    private $results = [];
    private $target_memory = 50; // MB
    
    public function run() {
        echo "=== Memory Usage Performance Test ===\n\n";
        echo "Target: <{$this->target_memory}MB\n\n";
        
        $this->test_baseline_memory();
        $this->test_settings_load();
        $this->test_css_generation();
        $this->test_multiple_operations();
        $this->test_peak_memory();
        
        $this->display_results();
        $this->save_results();
        
        return $this->evaluate_pass_fail();
    }
    
    private function test_baseline_memory() {
        echo "Testing: Baseline Memory (before plugin load)...\n";
        
        gc_collect_cycles();
        $baseline = memory_get_usage(true);
        
        $this->results['baseline'] = [
            'bytes' => $baseline,
            'mb' => $baseline / 1024 / 1024
        ];
        
        echo "  Memory: " . number_format($this->results['baseline']['mb'], 2) . "MB\n\n";
    }
    
    private function test_settings_load() {
        echo "Testing: Settings Load...\n";
        
        gc_collect_cycles();
        $before = memory_get_usage(true);
        
        $settings = new MASE_Settings();
        $options = $settings->get_option();
        
        gc_collect_cycles();
        $after = memory_get_usage(true);
        
        $used = $after - $before;
        
        $this->results['settings_load'] = [
            'bytes' => $used,
            'mb' => $used / 1024 / 1024,
            'total_mb' => $after / 1024 / 1024
        ];
        
        echo "  Memory Used: " . number_format($this->results['settings_load']['mb'], 2) . "MB\n";
        echo "  Total Memory: " . number_format($this->results['settings_load']['total_mb'], 2) . "MB\n";
        echo "  Status: " . $this->get_status($this->results['settings_load']['total_mb']) . "\n\n";
    }
    
    private function test_css_generation() {
        echo "Testing: CSS Generation...\n";
        
        gc_collect_cycles();
        $before = memory_get_usage(true);
        
        $generator = new MASE_CSS_Generator();
        $settings = $this->get_full_settings();
        
        // Generate CSS 10 times
        for ($i = 0; $i < 10; $i++) {
            $css = $generator->generate($settings);
        }
        
        gc_collect_cycles();
        $after = memory_get_usage(true);
        
        $used = $after - $before;
        
        $this->results['css_generation'] = [
            'bytes' => $used,
            'mb' => $used / 1024 / 1024,
            'total_mb' => $after / 1024 / 1024
        ];
        
        echo "  Memory Used: " . number_format($this->results['css_generation']['mb'], 2) . "MB\n";
        echo "  Total Memory: " . number_format($this->results['css_generation']['total_mb'], 2) . "MB\n";
        echo "  Status: " . $this->get_status($this->results['css_generation']['total_mb']) . "\n\n";
    }
    
    private function test_multiple_operations() {
        echo "Testing: Multiple Operations (realistic usage)...\n";
        
        gc_collect_cycles();
        $before = memory_get_usage(true);
        
        $settings = new MASE_Settings();
        $generator = new MASE_CSS_Generator();
        
        // Simulate realistic usage
        for ($i = 0; $i < 5; $i++) {
            // Load settings
            $options = $settings->get_option();
            
            // Modify settings
            $options['admin_bar']['background_color'] = '#' . substr(md5($i), 0, 6);
            $settings->update_option($options);
            
            // Generate CSS
            $css = $generator->generate($options);
            
            // Apply palette
            $settings->apply_palette('professional-blue');
            
            // Generate CSS again
            $css = $generator->generate($settings->get_option());
        }
        
        gc_collect_cycles();
        $after = memory_get_usage(true);
        
        $used = $after - $before;
        
        $this->results['multiple_operations'] = [
            'bytes' => $used,
            'mb' => $used / 1024 / 1024,
            'total_mb' => $after / 1024 / 1024
        ];
        
        echo "  Memory Used: " . number_format($this->results['multiple_operations']['mb'], 2) . "MB\n";
        echo "  Total Memory: " . number_format($this->results['multiple_operations']['total_mb'], 2) . "MB\n";
        echo "  Status: " . $this->get_status($this->results['multiple_operations']['total_mb']) . "\n\n";
    }
    
    private function test_peak_memory() {
        echo "Testing: Peak Memory Usage...\n";
        
        $peak = memory_get_peak_usage(true);
        
        $this->results['peak'] = [
            'bytes' => $peak,
            'mb' => $peak / 1024 / 1024
        ];
        
        echo "  Peak Memory: " . number_format($this->results['peak']['mb'], 2) . "MB\n";
        echo "  Status: " . $this->get_status($this->results['peak']['mb']) . "\n\n";
    }
    
    private function get_full_settings() {
        return [
            'palettes' => ['current' => 'professional-blue'],
            'admin_bar' => [
                'background_color' => '#4A90E2',
                'text_color' => '#FFFFFF',
                'hover_color' => '#357ABD'
            ],
            'admin_menu' => [
                'background_color' => '#2C3E50',
                'text_color' => '#ECF0F1',
                'hover_color' => '#34495E',
                'active_color' => '#3498DB'
            ],
            'visual_effects' => [
                'admin_bar' => [
                    'glassmorphism' => true,
                    'blur_intensity' => 20,
                    'floating' => true,
                    'floating_margin' => 8,
                    'border_radius' => 12,
                    'shadow' => 'elevated'
                ],
                'admin_menu' => [
                    'glassmorphism' => true,
                    'blur_intensity' => 15,
                    'shadow' => 'subtle'
                ],
                'animations_enabled' => true,
                'microanimations_enabled' => true
            ],
            'typography' => [
                'admin_bar' => [
                    'font_size' => 13,
                    'font_weight' => 400,
                    'line_height' => 1.5
                ],
                'admin_menu' => [
                    'font_size' => 14,
                    'font_weight' => 400,
                    'line_height' => 1.6
                ]
            ],
            'mobile' => [
                'optimized' => true,
                'touch_friendly' => true
            ]
        ];
    }
    
    private function get_status($memory_mb) {
        if ($memory_mb < $this->target_memory) {
            return "✅ PASS";
        } elseif ($memory_mb < $this->target_memory * 1.1) {
            return "⚠️  WARNING";
        } else {
            return "❌ FAIL";
        }
    }
    
    private function display_results() {
        echo "=== Summary ===\n\n";
        
        echo "Baseline Memory: " . number_format($this->results['baseline']['mb'], 2) . "MB\n";
        echo "Peak Memory: " . number_format($this->results['peak']['mb'], 2) . "MB\n";
        echo "Target: <{$this->target_memory}MB\n";
        echo "Status: " . $this->get_status($this->results['peak']['mb']) . "\n\n";
        
        echo "Memory Breakdown:\n";
        echo "  Settings Load: " . number_format($this->results['settings_load']['mb'], 2) . "MB\n";
        echo "  CSS Generation: " . number_format($this->results['css_generation']['mb'], 2) . "MB\n";
        echo "  Multiple Operations: " . number_format($this->results['multiple_operations']['mb'], 2) . "MB\n";
    }
    
    private function save_results() {
        $results_dir = dirname(__FILE__) . '/performance-results';
        if (!is_dir($results_dir)) {
            mkdir($results_dir, 0755, true);
        }
        
        $filename = $results_dir . '/memory-usage-' . date('Ymd-His') . '.json';
        
        $data = [
            'timestamp' => date('Y-m-d H:i:s'),
            'target' => $this->target_memory,
            'results' => $this->results,
            'pass' => $this->evaluate_pass_fail()
        ];
        
        file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
        echo "\nResults saved to: $filename\n";
    }
    
    private function evaluate_pass_fail() {
        return $this->results['peak']['mb'] < $this->target_memory;
    }
}

// Run the test
$test = new Memory_Usage_Test();
$passed = $test->run();

exit($passed ? 0 : 1);
