<?php
/**
 * Cache Performance Test
 * 
 * Tests cache hit rate against the >80% target (Requirement 4.5)
 * 
 * Usage: php test-cache-performance.php
 */

// Simulate WordPress environment
define('ABSPATH', dirname(__FILE__) . '/../../');
define('WP_DEBUG', true);

// Mock WordPress transient functions
$wp_transients = [];

function set_transient($transient, $value, $expiration) {
    global $wp_transients;
    $wp_transients[$transient] = [
        'value' => $value,
        'expiration' => time() + $expiration
    ];
    return true;
}

function get_transient($transient) {
    global $wp_transients;
    if (!isset($wp_transients[$transient])) {
        return false;
    }
    
    if ($wp_transients[$transient]['expiration'] < time()) {
        unset($wp_transients[$transient]);
        return false;
    }
    
    return $wp_transients[$transient]['value'];
}

function delete_transient($transient) {
    global $wp_transients;
    unset($wp_transients[$transient]);
    return true;
}

// Load required classes
require_once dirname(__FILE__) . '/../../includes/class-mase-cachemanager.php';
require_once dirname(__FILE__) . '/../../includes/class-mase-css-generator.php';

class Cache_Performance_Test {
    private $results = [];
    private $target_hit_rate = 80; // percent
    private $cache_manager;
    
    public function __construct() {
        $this->cache_manager = new MASE_CacheManager();
    }
    
    public function run() {
        echo "=== Cache Performance Test ===\n\n";
        echo "Target: >{$this->target_hit_rate}% hit rate\n\n";
        
        $this->test_cache_hits();
        $this->test_cache_invalidation();
        $this->test_realistic_usage();
        $this->test_cache_efficiency();
        
        $this->display_results();
        $this->save_results();
        
        return $this->evaluate_pass_fail();
    }
    
    private function test_cache_hits() {
        echo "Testing: Cache Hit Rate (repeated reads)...\n";
        
        $hits = 0;
        $misses = 0;
        $total_requests = 100;
        
        // First request - should be a miss
        $css = $this->cache_manager->get_cached_css();
        if ($css === false) {
            $misses++;
            // Generate and cache
            $css = $this->generate_css();
            $this->cache_manager->set_cached_css($css);
        } else {
            $hits++;
        }
        
        // Subsequent requests - should be hits
        for ($i = 1; $i < $total_requests; $i++) {
            $css = $this->cache_manager->get_cached_css();
            if ($css === false) {
                $misses++;
                $css = $this->generate_css();
                $this->cache_manager->set_cached_css($css);
            } else {
                $hits++;
            }
        }
        
        $hit_rate = ($hits / $total_requests) * 100;
        
        $this->results['cache_hits'] = [
            'hits' => $hits,
            'misses' => $misses,
            'total' => $total_requests,
            'hit_rate' => $hit_rate
        ];
        
        echo "  Hits: $hits\n";
        echo "  Misses: $misses\n";
        echo "  Hit Rate: " . number_format($hit_rate, 2) . "%\n";
        echo "  Status: " . $this->get_status($hit_rate) . "\n\n";
    }
    
    private function test_cache_invalidation() {
        echo "Testing: Cache Invalidation (settings changes)...\n";
        
        $hits = 0;
        $misses = 0;
        $invalidations = 0;
        
        // Initial cache
        $this->cache_manager->set_cached_css($this->generate_css());
        
        // 10 reads, 1 invalidation, 10 reads pattern
        for ($round = 0; $round < 5; $round++) {
            // 10 reads (should be hits)
            for ($i = 0; $i < 10; $i++) {
                $css = $this->cache_manager->get_cached_css();
                if ($css === false) {
                    $misses++;
                    $css = $this->generate_css();
                    $this->cache_manager->set_cached_css($css);
                } else {
                    $hits++;
                }
            }
            
            // Invalidate cache (simulate settings change)
            $this->cache_manager->invalidate_cache();
            $invalidations++;
            
            // Next read will be a miss
            $css = $this->cache_manager->get_cached_css();
            if ($css === false) {
                $misses++;
                $css = $this->generate_css();
                $this->cache_manager->set_cached_css($css);
            } else {
                $hits++;
            }
        }
        
        $total = $hits + $misses;
        $hit_rate = ($hits / $total) * 100;
        
        $this->results['cache_invalidation'] = [
            'hits' => $hits,
            'misses' => $misses,
            'invalidations' => $invalidations,
            'total' => $total,
            'hit_rate' => $hit_rate
        ];
        
        echo "  Hits: $hits\n";
        echo "  Misses: $misses\n";
        echo "  Invalidations: $invalidations\n";
        echo "  Hit Rate: " . number_format($hit_rate, 2) . "%\n";
        echo "  Status: " . $this->get_status($hit_rate) . "\n\n";
    }
    
    private function test_realistic_usage() {
        echo "Testing: Realistic Usage Pattern...\n";
        
        $hits = 0;
        $misses = 0;
        
        // Simulate realistic usage:
        // - 80% page loads (cache hits)
        // - 15% settings views (cache hits)
        // - 5% settings changes (cache misses + invalidation)
        
        $operations = [
            'page_load' => 80,
            'settings_view' => 15,
            'settings_change' => 5
        ];
        
        $total_operations = 200;
        
        // Initial cache
        $this->cache_manager->set_cached_css($this->generate_css());
        
        for ($i = 0; $i < $total_operations; $i++) {
            $rand = rand(1, 100);
            
            if ($rand <= $operations['page_load']) {
                // Page load - should be cache hit
                $css = $this->cache_manager->get_cached_css();
                if ($css === false) {
                    $misses++;
                    $css = $this->generate_css();
                    $this->cache_manager->set_cached_css($css);
                } else {
                    $hits++;
                }
            } elseif ($rand <= $operations['page_load'] + $operations['settings_view']) {
                // Settings view - should be cache hit
                $css = $this->cache_manager->get_cached_css();
                if ($css === false) {
                    $misses++;
                    $css = $this->generate_css();
                    $this->cache_manager->set_cached_css($css);
                } else {
                    $hits++;
                }
            } else {
                // Settings change - invalidate cache
                $this->cache_manager->invalidate_cache();
                $css = $this->cache_manager->get_cached_css();
                $misses++; // This will be a miss
                $css = $this->generate_css();
                $this->cache_manager->set_cached_css($css);
            }
        }
        
        $total = $hits + $misses;
        $hit_rate = ($hits / $total) * 100;
        
        $this->results['realistic_usage'] = [
            'hits' => $hits,
            'misses' => $misses,
            'total' => $total,
            'hit_rate' => $hit_rate
        ];
        
        echo "  Hits: $hits\n";
        echo "  Misses: $misses\n";
        echo "  Hit Rate: " . number_format($hit_rate, 2) . "%\n";
        echo "  Status: " . $this->get_status($hit_rate) . "\n\n";
    }
    
    private function test_cache_efficiency() {
        echo "Testing: Cache Efficiency (time savings)...\n";
        
        $iterations = 50;
        
        // Measure time without cache
        $start = microtime(true);
        for ($i = 0; $i < $iterations; $i++) {
            $css = $this->generate_css();
        }
        $time_without_cache = (microtime(true) - $start) * 1000;
        
        // Measure time with cache
        $this->cache_manager->set_cached_css($this->generate_css());
        $start = microtime(true);
        for ($i = 0; $i < $iterations; $i++) {
            $css = $this->cache_manager->get_cached_css();
        }
        $time_with_cache = (microtime(true) - $start) * 1000;
        
        $time_saved = $time_without_cache - $time_with_cache;
        $efficiency = ($time_saved / $time_without_cache) * 100;
        
        $this->results['cache_efficiency'] = [
            'time_without_cache' => $time_without_cache,
            'time_with_cache' => $time_with_cache,
            'time_saved' => $time_saved,
            'efficiency' => $efficiency
        ];
        
        echo "  Time Without Cache: " . number_format($time_without_cache, 2) . "ms\n";
        echo "  Time With Cache: " . number_format($time_with_cache, 2) . "ms\n";
        echo "  Time Saved: " . number_format($time_saved, 2) . "ms\n";
        echo "  Efficiency: " . number_format($efficiency, 2) . "%\n\n";
    }
    
    private function generate_css() {
        // Simulate CSS generation
        usleep(rand(50000, 100000)); // 50-100ms
        return "/* Generated CSS */\nbody { color: #000; }";
    }
    
    private function get_status($hit_rate) {
        if ($hit_rate > $this->target_hit_rate) {
            return "✅ PASS";
        } elseif ($hit_rate > $this->target_hit_rate * 0.9) {
            return "⚠️  WARNING";
        } else {
            return "❌ FAIL";
        }
    }
    
    private function display_results() {
        echo "=== Summary ===\n\n";
        
        $all_hit_rates = [
            $this->results['cache_hits']['hit_rate'],
            $this->results['cache_invalidation']['hit_rate'],
            $this->results['realistic_usage']['hit_rate']
        ];
        
        $overall_hit_rate = array_sum($all_hit_rates) / count($all_hit_rates);
        
        echo "Overall Hit Rate: " . number_format($overall_hit_rate, 2) . "%\n";
        echo "Target: >{$this->target_hit_rate}%\n";
        echo "Status: " . $this->get_status($overall_hit_rate) . "\n\n";
        
        echo "Detailed Results:\n";
        echo "  Cache Hits Test: " . number_format($this->results['cache_hits']['hit_rate'], 2) . "%\n";
        echo "  Cache Invalidation Test: " . number_format($this->results['cache_invalidation']['hit_rate'], 2) . "%\n";
        echo "  Realistic Usage Test: " . number_format($this->results['realistic_usage']['hit_rate'], 2) . "%\n";
        echo "  Cache Efficiency: " . number_format($this->results['cache_efficiency']['efficiency'], 2) . "%\n";
    }
    
    private function save_results() {
        $results_dir = dirname(__FILE__) . '/performance-results';
        if (!is_dir($results_dir)) {
            mkdir($results_dir, 0755, true);
        }
        
        $filename = $results_dir . '/cache-performance-' . date('Ymd-His') . '.json';
        
        $data = [
            'timestamp' => date('Y-m-d H:i:s'),
            'target' => $this->target_hit_rate,
            'results' => $this->results,
            'pass' => $this->evaluate_pass_fail()
        ];
        
        file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
        echo "\nResults saved to: $filename\n";
    }
    
    private function evaluate_pass_fail() {
        $all_hit_rates = [
            $this->results['cache_hits']['hit_rate'],
            $this->results['cache_invalidation']['hit_rate'],
            $this->results['realistic_usage']['hit_rate']
        ];
        
        $overall_hit_rate = array_sum($all_hit_rates) / count($all_hit_rates);
        
        return $overall_hit_rate > $this->target_hit_rate;
    }
}

// Run the test
$test = new Cache_Performance_Test();
$passed = $test->run();

exit($passed ? 0 : 1);
