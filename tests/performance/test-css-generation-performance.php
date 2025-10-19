<?php
/**
 * CSS Generation Performance Test
 * 
 * Tests CSS generation time against the <100ms target (Requirement 4.1)
 * 
 * Usage: php test-css-generation-performance.php
 */

// Simulate WordPress environment
define('ABSPATH', dirname(__FILE__) . '/../../');
define('WP_DEBUG', true);

// Mock WordPress functions
if (!function_exists('esc_attr')) {
    function esc_attr($text) { return htmlspecialchars($text, ENT_QUOTES); }
}
if (!function_exists('esc_html')) {
    function esc_html($text) { return htmlspecialchars($text, ENT_QUOTES); }
}

// Load the CSS Generator class
require_once dirname(__FILE__) . '/../../includes/class-mase-css-generator.php';

class CSS_Generation_Performance_Test {
    private $results = [];
    private $iterations = 100;
    private $target_time = 100; // milliseconds
    
    public function run() {
        echo "=== CSS Generation Performance Test ===\n\n";
        echo "Target: <{$this->target_time}ms per generation\n";
        echo "Iterations: {$this->iterations}\n\n";
        
        $this->test_simple_settings();
        $this->test_complex_settings();
        $this->test_all_features_enabled();
        $this->test_minimal_settings();
        
        $this->display_results();
        $this->save_results();
        
        return $this->evaluate_pass_fail();
    }
    
    private function test_simple_settings() {
        echo "Testing: Simple Settings (basic colors only)...\n";
        
        $settings = [
            'palettes' => [
                'current' => 'professional-blue'
            ],
            'admin_bar' => [
                'background_color' => '#4A90E2',
                'text_color' => '#FFFFFF'
            ],
            'admin_menu' => [
                'background_color' => '#2C3E50',
                'text_color' => '#ECF0F1'
            ]
        ];
        
        $times = $this->measure_generation($settings);
        $this->results['simple'] = $times;
        
        echo "  Average: " . number_format($times['avg'], 2) . "ms\n";
        echo "  Min: " . number_format($times['min'], 2) . "ms\n";
        echo "  Max: " . number_format($times['max'], 2) . "ms\n";
        echo "  Status: " . $this->get_status($times['avg']) . "\n\n";
    }
    
    private function test_complex_settings() {
        echo "Testing: Complex Settings (with visual effects)...\n";
        
        $settings = [
            'palettes' => ['current' => 'professional-blue'],
            'admin_bar' => [
                'background_color' => '#4A90E2',
                'text_color' => '#FFFFFF'
            ],
            'admin_menu' => [
                'background_color' => '#2C3E50',
                'text_color' => '#ECF0F1'
            ],
            'visual_effects' => [
                'admin_bar' => [
                    'glassmorphism' => true,
                    'blur_intensity' => 20,
                    'floating' => true,
                    'floating_margin' => 8,
                    'border_radius' => 12,
                    'shadow' => 'subtle'
                ],
                'admin_menu' => [
                    'glassmorphism' => true,
                    'blur_intensity' => 15,
                    'shadow' => 'elevated'
                ]
            ],
            'typography' => [
                'admin_bar' => [
                    'font_size' => 13,
                    'font_weight' => 400,
                    'line_height' => 1.5
                ]
            ]
        ];
        
        $times = $this->measure_generation($settings);
        $this->results['complex'] = $times;
        
        echo "  Average: " . number_format($times['avg'], 2) . "ms\n";
        echo "  Min: " . number_format($times['min'], 2) . "ms\n";
        echo "  Max: " . number_format($times['max'], 2) . "ms\n";
        echo "  Status: " . $this->get_status($times['avg']) . "\n\n";
    }
    
    private function test_all_features_enabled() {
        echo "Testing: All Features Enabled (maximum complexity)...\n";
        
        $settings = $this->get_full_settings();
        $times = $this->measure_generation($settings);
        $this->results['all_features'] = $times;
        
        echo "  Average: " . number_format($times['avg'], 2) . "ms\n";
        echo "  Min: " . number_format($times['min'], 2) . "ms\n";
        echo "  Max: " . number_format($times['max'], 2) . "ms\n";
        echo "  Status: " . $this->get_status($times['avg']) . "\n\n";
    }
    
    private function test_minimal_settings() {
        echo "Testing: Minimal Settings (empty array)...\n";
        
        $settings = [];
        $times = $this->measure_generation($settings);
        $this->results['minimal'] = $times;
        
        echo "  Average: " . number_format($times['avg'], 2) . "ms\n";
        echo "  Min: " . number_format($times['min'], 2) . "ms\n";
        echo "  Max: " . number_format($times['max'], 2) . "ms\n";
        echo "  Status: " . $this->get_status($times['avg']) . "\n\n";
    }
    
    private function measure_generation($settings) {
        $generator = new MASE_CSS_Generator();
        $times = [];
        
        // Warm-up run
        $generator->generate($settings);
        
        // Actual measurements
        for ($i = 0; $i < $this->iterations; $i++) {
            $start = microtime(true);
            $css = $generator->generate($settings);
            $end = microtime(true);
            
            $times[] = ($end - $start) * 1000; // Convert to milliseconds
        }
        
        return [
            'avg' => array_sum($times) / count($times),
            'min' => min($times),
            'max' => max($times),
            'median' => $this->get_median($times),
            'p95' => $this->get_percentile($times, 95),
            'p99' => $this->get_percentile($times, 99)
        ];
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
                    'shadow' => 'subtle',
                    'border_radius' => 8
                ],
                'animations_enabled' => true,
                'microanimations_enabled' => true
            ],
            'typography' => [
                'admin_bar' => [
                    'font_size' => 13,
                    'font_weight' => 400,
                    'line_height' => 1.5,
                    'letter_spacing' => 0
                ],
                'admin_menu' => [
                    'font_size' => 14,
                    'font_weight' => 400,
                    'line_height' => 1.6
                ],
                'content' => [
                    'font_size' => 14,
                    'font_weight' => 400,
                    'line_height' => 1.6
                ]
            ],
            'mobile' => [
                'optimized' => true,
                'touch_friendly' => true,
                'compact_mode' => false
            ],
            'advanced' => [
                'custom_css' => '/* Custom CSS */'
            ]
        ];
    }
    
    private function get_median($array) {
        sort($array);
        $count = count($array);
        $middle = floor($count / 2);
        
        if ($count % 2 == 0) {
            return ($array[$middle - 1] + $array[$middle]) / 2;
        }
        
        return $array[$middle];
    }
    
    private function get_percentile($array, $percentile) {
        sort($array);
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
        
        $filename = $results_dir . '/css-generation-' . date('Ymd-His') . '.json';
        
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
$test = new CSS_Generation_Performance_Test();
$passed = $test->run();

exit($passed ? 0 : 1);
