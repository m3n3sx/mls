<?php
/**
 * Settings Save Performance Test
 * 
 * Tests settings save time against the <500ms target (Requirement 4.2)
 * 
 * Usage: php test-settings-save-performance.php
 */

// Simulate WordPress environment
define('ABSPATH', dirname(__FILE__) . '/../../');
define('WP_DEBUG', true);

// Mock WordPress functions
function update_option($option, $value) {
    global $wp_options;
    $wp_options[$option] = $value;
    usleep(rand(1000, 5000)); // Simulate database write (1-5ms)
    return true;
}

function get_option($option, $default = false) {
    global $wp_options;
    return isset($wp_options[$option]) ? $wp_options[$option] : $default;
}

function delete_transient($transient) {
    global $wp_transients;
    unset($wp_transients[$transient]);
    return true;
}

function wp_cache_delete($key, $group = '') {
    return true;
}

// Load required classes
require_once dirname(__FILE__) . '/../../includes/class-mase-settings.php';
require_once dirname(__FILE__) . '/../../includes/class-mase-css-generator.php';
require_once dirname(__FILE__) . '/../../includes/class-mase-cachemanager.php';

class Settings_Save_Performance_Test {
    private $results = [];
    private $iterations = 50;
    private $target_time = 500; // milliseconds
    
    public function run() {
        echo "=== Settings Save Performance Test ===\n\n";
        echo "Target: <{$this->target_time}ms per save\n";
        echo "Iterations: {$this->iterations}\n\n";
        
        $this->test_simple_save();
        $this->test_palette_change();
        $this->test_template_apply();
        $this->test_full_settings_update();
        
        $this->display_results();
        $this->save_results();
        
        return $this->evaluate_pass_fail();
    }
    
    private function test_simple_save() {
        echo "Testing: Simple Save (single field change)...\n";
        
        $settings = new MASE_Settings();
        $times = [];
        
        for ($i = 0; $i < $this->iterations; $i++) {
            $current = $settings->get_option();
            $current['admin_bar']['background_color'] = '#' . substr(md5($i), 0, 6);
            
            $start = microtime(true);
            $settings->update_option($current);
            $end = microtime(true);
            
            $times[] = ($end - $start) * 1000;
        }
        
        $this->results['simple_save'] = $this->calculate_stats($times);
        
        echo "  Average: " . number_format($this->results['simple_save']['avg'], 2) . "ms\n";
        echo "  Status: " . $this->get_status($this->results['simple_save']['avg']) . "\n\n";
    }
    
    private function test_palette_change() {
        echo "Testing: Palette Change (multiple fields)...\n";
        
        $settings = new MASE_Settings();
        $times = [];
        
        $palettes = ['professional-blue', 'energetic-green', 'sunset', 'dark-elegance'];
        
        for ($i = 0; $i < $this->iterations; $i++) {
            $palette_id = $palettes[$i % count($palettes)];
            
            $start = microtime(true);
            $settings->apply_palette($palette_id);
            $end = microtime(true);
            
            $times[] = ($end - $start) * 1000;
        }
        
        $this->results['palette_change'] = $this->calculate_stats($times);
        
        echo "  Average: " . number_format($this->results['palette_change']['avg'], 2) . "ms\n";
        echo "  Status: " . $this->get_status($this->results['palette_change']['avg']) . "\n\n";
    }
    
    private function test_template_apply() {
        echo "Testing: Template Apply (full settings replacement)...\n";
        
        $settings = new MASE_Settings();
        $times = [];
        
        $templates = ['modern-minimal', 'bold-creative', 'elegant-professional'];
        
        for ($i = 0; $i < $this->iterations; $i++) {
            $template_id = $templates[$i % count($templates)];
            
            $start = microtime(true);
            $settings->apply_template($template_id);
            $end = microtime(true);
            
            $times[] = ($end - $start) * 1000;
        }
        
        $this->results['template_apply'] = $this->calculate_stats($times);
        
        echo "  Average: " . number_format($this->results['template_apply']['avg'], 2) . "ms\n";
        echo "  Status: " . $this->get_status($this->results['template_apply']['avg']) . "\n\n";
    }
    
    private function test_full_settings_update() {
        echo "Testing: Full Settings Update (all fields)...\n";
        
        $settings = new MASE_Settings();
        $times = [];
        
        for ($i = 0; $i < $this->iterations; $i++) {
            $full_settings = $this->get_full_settings($i);
            
            $start = microtime(true);
            $settings->update_option($full_settings);
            $end = microtime(true);
            
            $times[] = ($end - $start) * 1000;
        }
        
        $this->results['full_update'] = $this->calculate_stats($times);
        
        echo "  Average: " . number_format($this->results['full_update']['avg'], 2) . "ms\n";
        echo "  Status: " . $this->get_status($this->results['full_update']['avg']) . "\n\n";
    }
    
    private function get_full_settings($seed) {
        return [
            'palettes' => ['current' => 'professional-blue'],
            'admin_bar' => [
                'background_color' => '#' . substr(md5($seed), 0, 6),
                'text_color' => '#FFFFFF',
                'hover_color' => '#357ABD'
            ],
            'admin_menu' => [
                'background_color' => '#2C3E50',
                'text_color' => '#ECF0F1',
                'hover_color' => '#34495E'
            ],
            'visual_effects' => [
                'admin_bar' => [
                    'glassmorphism' => true,
                    'blur_intensity' => 20,
                    'floating' => true
                ]
            ],
            'typography' => [
                'admin_bar' => [
                    'font_size' => 13,
                    'font_weight' => 400
                ]
            ],
            'mobile' => [
                'optimized' => true
            ]
        ];
    }
    
    private function calculate_stats($times) {
        sort($times);
        return [
            'avg' => array_sum($times) / count($times),
            'min' => min($times),
            'max' => max($times),
            'median' => $this->get_median($times),
            'p95' => $this->get_percentile($times, 95),
            'p99' => $this->get_percentile($times, 99)
        ];
    }
    
    private function get_median($array) {
        $count = count($array);
        $middle = floor($count / 2);
        
        if ($count % 2 == 0) {
            return ($array[$middle - 1] + $array[$middle]) / 2;
        }
        
        return $array[$middle];
    }
    
    private function get_percentile($array, $percentile) {
        $index = ceil(($percentile / 100) * count($array)) - 1;
        return $array[$index];
    }
    
    private function get_status($time) {
        if ($time < $this->target_time) {
            return "✅ PASS";
        } elseif ($time < $this->target_time * 1.1) {
            return "⚠️  WARNING";
        } else {
            return "❌ FAIL";
        }
    }
    
    private function display_results() {
        echo "=== Summary ===\n\n";
        
        $all_times = [];
        foreach ($this->results as $test => $times) {
            $all_times[] = $times['avg'];
        }
        
        $overall_avg = array_sum($all_times) / count($all_times);
        
        echo "Overall Average: " . number_format($overall_avg, 2) . "ms\n";
        echo "Target: <{$this->target_time}ms\n";
        echo "Status: " . $this->get_status($overall_avg) . "\n\n";
        
        echo "Detailed Results:\n";
        foreach ($this->results as $test => $times) {
            echo "  " . ucfirst(str_replace('_', ' ', $test)) . ":\n";
            echo "    Average: " . number_format($times['avg'], 2) . "ms\n";
            echo "    Median: " . number_format($times['median'], 2) . "ms\n";
            echo "    95th Percentile: " . number_format($times['p95'], 2) . "ms\n";
            echo "    99th Percentile: " . number_format($times['p99'], 2) . "ms\n";
        }
    }
    
    private function save_results() {
        $results_dir = dirname(__FILE__) . '/performance-results';
        if (!is_dir($results_dir)) {
            mkdir($results_dir, 0755, true);
        }
        
        $filename = $results_dir . '/settings-save-' . date('Ymd-His') . '.json';
        
        $data = [
            'timestamp' => date('Y-m-d H:i:s'),
            'target' => $this->target_time,
            'iterations' => $this->iterations,
            'results' => $this->results,
            'pass' => $this->evaluate_pass_fail()
        ];
        
        file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
        echo "\nResults saved to: $filename\n";
    }
    
    private function evaluate_pass_fail() {
        foreach ($this->results as $times) {
            if ($times['avg'] >= $this->target_time) {
                return false;
            }
        }
        return true;
    }
}

// Run the test
$test = new Settings_Save_Performance_Test();
$passed = $test->run();

exit($passed ? 0 : 1);
