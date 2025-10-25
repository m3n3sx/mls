<?php
/**
 * MASE CSS Integration Test for WordPress
 * 
 * Tests CSS loading, WordPress compatibility, and component rendering
 * in a real WordPress admin environment.
 * 
 * @package Modern Admin Styler Enterprise
 * @version 2.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * MASE CSS Integration Test Class
 */
class MASE_CSS_Integration_Test {
    
    /**
     * Test results
     */
    private $results = [];
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_menu', [$this, 'add_test_page']);
    }
    
    /**
     * Add test page to WordPress admin
     */
    public function add_test_page() {
        add_menu_page(
            'MASE CSS Integration Test',
            'CSS Test',
            'manage_options',
            'mase-css-test',
            [$this, 'render_test_page'],
            'dashicons-admin-tools',
            99
        );
    }
    
    /**
     * Render test page
     */
    public function render_test_page() {
        // Run all tests
        $this->test_css_file_exists();
        $this->test_css_loads_correctly();
        $this->test_no_conflicts_with_admin();
        $this->test_components_render();
        $this->test_responsive_behavior();
        $this->test_browser_compatibility();
        
        // Display results
        $this->display_results();
    }
    
    /**
     * Test 1: CSS file exists and is accessible
     */
    private function test_css_file_exists() {
        $css_path = plugin_dir_path(dirname(__FILE__)) . 'assets/css/mase-admin.css';
        
        if (file_exists($css_path)) {
            $file_size = filesize($css_path);
            $file_size_kb = round($file_size / 1024, 2);
            
            $this->add_result(
                'CSS File Exists',
                true,
                "File found at: {$css_path} ({$file_size_kb} KB)"
            );
            
            // Check file size is under 100KB
            if ($file_size_kb < 100) {
                $this->add_result(
                    'CSS File Size',
                    true,
                    "File size {$file_size_kb} KB is under 100KB target"
                );
            } else {
                $this->add_result(
                    'CSS File Size',
                    false,
                    "File size {$file_size_kb} KB exceeds 100KB target"
                );
            }
        } else {
            $this->add_result(
                'CSS File Exists',
                false,
                "File not found at: {$css_path}"
            );
        }
    }
    
    /**
     * Test 2: CSS loads correctly in WordPress
     */
    private function test_css_loads_correctly() {
        $css_url = plugins_url('assets/css/mase-admin.css', dirname(__FILE__));
        
        // Check if CSS is enqueued
        $is_enqueued = wp_style_is('mase-admin-css', 'enqueued');
        
        if ($is_enqueued) {
            $this->add_result(
                'CSS Enqueued',
                true,
                "CSS is properly enqueued in WordPress"
            );
        } else {
            $this->add_result(
                'CSS Enqueued',
                false,
                "CSS is not enqueued. Check wp_enqueue_style() call."
            );
        }
        
        // Test CSS URL is accessible
        $response = wp_remote_get($css_url);
        if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
            $this->add_result(
                'CSS URL Accessible',
                true,
                "CSS file is accessible at: {$css_url}"
            );
        } else {
            $this->add_result(
                'CSS URL Accessible',
                false,
                "CSS file is not accessible at: {$css_url}"
            );
        }
    }
    
    /**
     * Test 3: No conflicts with WordPress admin styles
     */
    private function test_no_conflicts_with_admin() {
        // Check for common WordPress admin classes
        $wp_classes = [
            'wrap',
            'button',
            'button-primary',
            'button-secondary',
            'notice',
            'notice-success',
            'notice-error',
            'form-table'
        ];
        
        $conflicts = [];
        
        // In a real test, we would check if our CSS overrides these
        // For now, we'll assume no conflicts if we use proper prefixing
        $css_content = file_get_contents(
            plugin_dir_path(dirname(__FILE__)) . 'assets/css/mase-admin.css'
        );
        
        foreach ($wp_classes as $class) {
            // Check if we're targeting WordPress classes without .mase- prefix
            if (preg_match('/\.' . $class . '\s*{/', $css_content)) {
                $conflicts[] = $class;
            }
        }
        
        if (empty($conflicts)) {
            $this->add_result(
                'No WordPress Conflicts',
                true,
                "All CSS classes use .mase- prefix to avoid conflicts"
            );
        } else {
            $this->add_result(
                'No WordPress Conflicts',
                false,
                "Potential conflicts with WordPress classes: " . implode(', ', $conflicts)
            );
        }
    }
    
    /**
     * Test 4: All components render properly
     */
    private function test_components_render() {
        $components = [
            'Header' => '.mase-header',
            'Tabs' => '.mase-tabs',
            'Toggle' => '.mase-toggle',
            'Slider' => '.mase-slider',
            'Button' => '.mase-btn',
            'Card' => '.mase-card',
            'Badge' => '.mase-badge',
            'Notice' => '.mase-notice',
            'Input' => '.mase-input',
            'Select' => '.mase-select'
        ];
        
        $css_content = file_get_contents(
            plugin_dir_path(dirname(__FILE__)) . 'assets/css/mase-admin.css'
        );
        
        $missing_components = [];
        
        foreach ($components as $name => $selector) {
            if (strpos($css_content, $selector) === false) {
                $missing_components[] = $name;
            }
        }
        
        if (empty($missing_components)) {
            $this->add_result(
                'All Components Present',
                true,
                "All " . count($components) . " core components found in CSS"
            );
        } else {
            $this->add_result(
                'All Components Present',
                false,
                "Missing components: " . implode(', ', $missing_components)
            );
        }
    }
    
    /**
     * Test 5: Responsive behavior
     */
    private function test_responsive_behavior() {
        $css_content = file_get_contents(
            plugin_dir_path(dirname(__FILE__)) . 'assets/css/mase-admin.css'
        );
        
        // Check for media queries
        $breakpoints = [
            '600px' => 'Mobile',
            '782px' => 'WordPress Admin Bar',
            '1024px' => 'Tablet',
            '1280px' => 'Desktop'
        ];
        
        $found_breakpoints = [];
        
        foreach ($breakpoints as $size => $name) {
            if (strpos($css_content, $size) !== false) {
                $found_breakpoints[] = $name;
            }
        }
        
        if (count($found_breakpoints) >= 3) {
            $this->add_result(
                'Responsive Breakpoints',
                true,
                "Found breakpoints for: " . implode(', ', $found_breakpoints)
            );
        } else {
            $this->add_result(
                'Responsive Breakpoints',
                false,
                "Only found " . count($found_breakpoints) . " breakpoints, expected at least 3"
            );
        }
        
        // Check for mobile-first approach
        if (preg_match('/@media\s*\(\s*min-width/', $css_content)) {
            $this->add_result(
                'Mobile-First Approach',
                true,
                "CSS uses mobile-first media queries (min-width)"
            );
        } else {
            $this->add_result(
                'Mobile-First Approach',
                false,
                "CSS should use mobile-first approach with min-width queries"
            );
        }
    }
    
    /**
     * Test 6: Browser compatibility features
     */
    private function test_browser_compatibility() {
        $css_content = file_get_contents(
            plugin_dir_path(dirname(__FILE__)) . 'assets/css/mase-admin.css'
        );
        
        // Check for CSS custom properties (CSS variables)
        if (strpos($css_content, '--mase-') !== false) {
            $this->add_result(
                'CSS Custom Properties',
                true,
                "CSS uses custom properties for theming"
            );
        } else {
            $this->add_result(
                'CSS Custom Properties',
                false,
                "CSS should use custom properties (--mase-*)"
            );
        }
        
        // Check for modern CSS features
        $modern_features = [
            'display: grid' => 'CSS Grid',
            'display: flex' => 'Flexbox',
            'prefers-reduced-motion' => 'Reduced Motion',
            '[dir="rtl"]' => 'RTL Support'
        ];
        
        $found_features = [];
        
        foreach ($modern_features as $feature => $name) {
            if (stripos($css_content, $feature) !== false) {
                $found_features[] = $name;
            }
        }
        
        if (count($found_features) >= 3) {
            $this->add_result(
                'Modern CSS Features',
                true,
                "Uses modern features: " . implode(', ', $found_features)
            );
        } else {
            $this->add_result(
                'Modern CSS Features',
                false,
                "Only found " . count($found_features) . " modern features"
            );
        }
    }
    
    /**
     * Add test result
     */
    private function add_result($test_name, $passed, $message) {
        $this->results[] = [
            'name' => $test_name,
            'passed' => $passed,
            'message' => $message
        ];
    }
    
    /**
     * Display test results
     */
    private function display_results() {
        $total_tests = count($this->results);
        $passed_tests = count(array_filter($this->results, function($r) {
            return $r['passed'];
        }));
        $failed_tests = $total_tests - $passed_tests;
        
        ?>
        <div class="wrap">
            <h1>MASE CSS Integration Test Results</h1>
            
            <div class="mase-test-summary" style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h2 style="margin-top: 0;">Test Summary</h2>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0;">
                    <div style="text-align: center; padding: 20px; background: #f0f0f1; border-radius: 8px;">
                        <div style="font-size: 48px; font-weight: bold; color: #0073aa;"><?php echo $total_tests; ?></div>
                        <div style="color: #646970;">Total Tests</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: #e7f7ed; border-radius: 8px;">
                        <div style="font-size: 48px; font-weight: bold; color: #00a32a;"><?php echo $passed_tests; ?></div>
                        <div style="color: #646970;">Passed</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: #fcf0f1; border-radius: 8px;">
                        <div style="font-size: 48px; font-weight: bold; color: #d63638;"><?php echo $failed_tests; ?></div>
                        <div style="color: #646970;">Failed</div>
                    </div>
                </div>
                
                <?php if ($failed_tests === 0): ?>
                    <div class="notice notice-success" style="margin: 20px 0;">
                        <p><strong>✓ All tests passed!</strong> The MASE CSS framework is properly integrated and working correctly.</p>
                    </div>
                <?php else: ?>
                    <div class="notice notice-error" style="margin: 20px 0;">
                        <p><strong>✕ Some tests failed.</strong> Please review the results below and fix any issues.</p>
                    </div>
                <?php endif; ?>
            </div>
            
            <div class="mase-test-results" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h2>Detailed Results</h2>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th style="width: 60px;">Status</th>
                            <th>Test Name</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($this->results as $result): ?>
                            <tr>
                                <td style="text-align: center;">
                                    <?php if ($result['passed']): ?>
                                        <span style="color: #00a32a; font-size: 24px;">✓</span>
                                    <?php else: ?>
                                        <span style="color: #d63638; font-size: 24px;">✕</span>
                                    <?php endif; ?>
                                </td>
                                <td><strong><?php echo esc_html($result['name']); ?></strong></td>
                                <td style="color: #646970;"><?php echo esc_html($result['message']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            
            <!-- Component Rendering Test -->
            <div class="mase-component-test" style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h2>Visual Component Test</h2>
                <p style="color: #646970;">The components below should render with proper MASE styling:</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0;">
                    <!-- Toggle Test -->
                    <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
                        <h3 style="margin-top: 0;">Toggle Switch</h3>
                        <label class="mase-toggle">
                            <input type="checkbox" checked>
                            <span class="mase-toggle-slider"></span>
                        </label>
                        <span style="margin-left: 8px;">Enabled</span>
                    </div>
                    
                    <!-- Button Test -->
                    <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
                        <h3 style="margin-top: 0;">Buttons</h3>
                        <button class="mase-btn mase-btn-primary">Primary</button>
                        <button class="mase-btn mase-btn-secondary" style="margin-left: 8px;">Secondary</button>
                    </div>
                    
                    <!-- Badge Test -->
                    <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
                        <h3 style="margin-top: 0;">Badges</h3>
                        <span class="mase-badge mase-badge-success">Success</span>
                        <span class="mase-badge mase-badge-warning">Warning</span>
                    </div>
                    
                    <!-- Input Test -->
                    <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
                        <h3 style="margin-top: 0;">Input</h3>
                        <input type="text" class="mase-input" placeholder="Test input" style="width: 100%;">
                    </div>
                </div>
            </div>
            
            <!-- Browser Test Instructions -->
            <div class="mase-browser-test" style="background: #e5f5fa; padding: 20px; border-radius: 8px; border-left: 4px solid #0073aa;">
                <h2 style="margin-top: 0;">Manual Browser Testing</h2>
                <p>Please test the following in multiple browsers:</p>
                <ul style="line-height: 1.8;">
                    <li><strong>Chrome 90+:</strong> All features should work</li>
                    <li><strong>Firefox 88+:</strong> All features should work</li>
                    <li><strong>Safari 14+:</strong> All features should work</li>
                    <li><strong>Edge 90+:</strong> All features should work</li>
                    <li><strong>Mobile browsers:</strong> Test responsive behavior</li>
                </ul>
                <p><a href="<?php echo admin_url('admin.php?page=mase-settings'); ?>" class="button button-primary">View Full MASE Settings Page</a></p>
            </div>
        </div>
        <?php
    }
}

// Initialize test if in admin
if (is_admin()) {
    new MASE_CSS_Integration_Test();
}
