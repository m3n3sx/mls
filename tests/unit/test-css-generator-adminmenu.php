<?php
/**
 * Unit Tests for Admin Menu CSS Generator
 * 
 * Tests all CSS generation methods for admin menu enhancements
 * 
 * @package ModernAdminStyler
 */

// Mock WordPress functions for testing
if (!function_exists('esc_attr')) {
    function esc_attr($text) { return htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); }
}
if (!function_exists('sanitize_hex_color')) {
    function sanitize_hex_color($color) { return preg_match('/^#[a-f0-9]{6}$/i', $color) ? $color : ''; }
}

// Load the CSS Generator class
require_once __DIR__ . '/../../includes/class-mase-css-generator.php';

class MASE_CSS_Generator_AdminMenu_Test {
    private $generator;
    private $test_results = [];
    
    public function __construct() {
        $this->generator = new MASE_CSS_Generator();
    }
    
    /**
     * Run all tests
     */
    public function run_all_tests() {
        echo "=== Admin Menu CSS Generator Unit Tests ===\n\n";
        
        $this->test_menu_item_padding_css();
        $this->test_icon_color_css_auto_mode();
        $this->test_icon_color_css_custom_mode();
        $this->test_submenu_positioning_css();
        $this->test_height_mode_full_css();
        $this->test_height_mode_content_css();
        $this->test_gradient_background_linear();
        $this->test_gradient_background_radial();
        $this->test_border_radius_uniform();
        $this->test_border_radius_individual();
        $this->test_shadow_preset_css();
        $this->test_shadow_custom_css();
        $this->test_floating_margin_uniform();
        $this->test_floating_margin_individual();
        $this->test_submenu_background_css();
        $this->test_submenu_border_radius_css();
        $this->test_submenu_typography_css();
        $this->test_logo_placement_css();
        
        $this->print_summary();
    }
    
    /**
     * Test menu item padding CSS generation
     */
    private function test_menu_item_padding_css() {
        $settings = [
            'admin_menu' => [
                'padding_vertical' => 12,
                'padding_horizontal' => 18
            ]
        ];
        
        $css = $this->call_private_method('generate_menu_item_padding_css', [$settings['admin_menu']]);
        
        $this->assert_contains($css, 'padding: 12px 18px', 'Menu item padding CSS');
        $this->assert_contains($css, '#adminmenu li.menu-top > a', 'Menu item selector');
    }
    
    /**
     * Test icon color CSS in auto mode
     */
    private function test_icon_color_css_auto_mode() {
        $settings = [
            'admin_menu' => [
                'icon_color_mode' => 'auto',
                'text_color' => '#ffffff'
            ]
        ];
        
        $css = $this->call_private_method('generate_menu_icon_color_css', [$settings['admin_menu']]);
        
        $this->assert_contains($css, 'color: #ffffff', 'Icon color matches text color in auto mode');
        $this->assert_contains($css, '.wp-menu-image', 'Icon selector present');
    }
    
    /**
     * Test icon color CSS in custom mode
     */
    private function test_icon_color_css_custom_mode() {
        $settings = [
            'admin_menu' => [
                'icon_color_mode' => 'custom',
                'icon_color' => '#00a0d2',
                'text_color' => '#ffffff'
            ]
        ];
        
        $css = $this->call_private_method('generate_menu_icon_color_css', [$settings['admin_menu']]);
        
        $this->assert_contains($css, 'color: #00a0d2', 'Icon color uses custom color');
        $this->assert_not_contains($css, '#ffffff', 'Icon color does not use text color');
    }
    
    /**
     * Test submenu positioning CSS
     */
    private function test_submenu_positioning_css() {
        $settings = [
            'admin_menu' => [
                'width' => 200
            ],
            'admin_menu_submenu' => [
                'spacing' => 10
            ]
        ];
        
        $css = $this->call_private_method('generate_submenu_positioning_css', [$settings]);
        
        $this->assert_contains($css, 'left: 200px', 'Submenu left position matches menu width');
        $this->assert_contains($css, 'top: 10px', 'Submenu top spacing applied');
    }
    
    /**
     * Test Height Mode full CSS
     */
    private function test_height_mode_full_css() {
        $settings = [
            'admin_menu' => [
                'height_mode' => 'full'
            ]
        ];
        
        $css = $this->call_private_method('generate_height_mode_css', [$settings['admin_menu']]);
        
        $this->assert_contains($css, 'height: 100%', 'Full height mode CSS');
        $this->assert_not_contains($css, 'min-height', 'No min-height in full mode');
    }
    
    /**
     * Test Height Mode content CSS
     */
    private function test_height_mode_content_css() {
        $settings = [
            'admin_menu' => [
                'height_mode' => 'content'
            ]
        ];
        
        $css = $this->call_private_method('generate_height_mode_css', [$settings['admin_menu']]);
        
        $this->assert_contains($css, 'height: auto', 'Content height mode uses auto');
        $this->assert_contains($css, 'min-height: 100vh', 'Content height mode has min-height');
    }
    
    /**
     * Test linear gradient background CSS
     */
    private function test_gradient_background_linear() {
        $settings = [
            'admin_menu' => [
                'bg_type' => 'gradient',
                'gradient_type' => 'linear',
                'gradient_angle' => 90,
                'gradient_colors' => [
                    ['color' => '#23282d', 'position' => 0],
                    ['color' => '#32373c', 'position' => 100]
                ]
            ]
        ];
        
        $css = $this->call_private_method('generate_gradient_background', [$settings['admin_menu']]);
        
        $this->assert_contains($css, 'linear-gradient', 'Linear gradient type');
        $this->assert_contains($css, '90deg', 'Gradient angle');
        $this->assert_contains($css, '#23282d', 'First gradient color');
        $this->assert_contains($css, '#32373c', 'Second gradient color');
    }
    
    /**
     * Test radial gradient background CSS
     */
    private function test_gradient_background_radial() {
        $settings = [
            'admin_menu' => [
                'bg_type' => 'gradient',
                'gradient_type' => 'radial',
                'gradient_colors' => [
                    ['color' => '#23282d', 'position' => 0],
                    ['color' => '#32373c', 'position' => 100]
                ]
            ]
        ];
        
        $css = $this->call_private_method('generate_gradient_background', [$settings['admin_menu']]);
        
        $this->assert_contains($css, 'radial-gradient', 'Radial gradient type');
    }
    
    /**
     * Test uniform border radius CSS
     */
    private function test_border_radius_uniform() {
        $settings = [
            'admin_menu' => [
                'border_radius_mode' => 'uniform',
                'border_radius' => 8
            ]
        ];
        
        $css = $this->call_private_method('generate_border_radius_css', [$settings['admin_menu']]);
        
        $this->assert_contains($css, 'border-radius: 8px', 'Uniform border radius');
    }
    
    /**
     * Test individual border radius CSS
     */
    private function test_border_radius_individual() {
        $settings = [
            'admin_menu' => [
                'border_radius_mode' => 'individual',
                'border_radius_tl' => 10,
                'border_radius_tr' => 5,
                'border_radius_bl' => 0,
                'border_radius_br' => 15
            ]
        ];
        
        $css = $this->call_private_method('generate_border_radius_css', [$settings['admin_menu']]);
        
        $this->assert_contains($css, '10px 5px 15px 0px', 'Individual corner radius values');
    }
    
    /**
     * Test shadow preset CSS
     */
    private function test_shadow_preset_css() {
        $settings = [
            'admin_menu' => [
                'shadow_mode' => 'preset',
                'shadow_preset' => 'medium'
            ]
        ];
        
        $css = $this->call_private_method('generate_shadow_css', [$settings['admin_menu']]);
        
        $this->assert_contains($css, 'box-shadow', 'Shadow CSS present');
        $this->assert_not_empty($css, 'Shadow preset generates CSS');
    }
    
    /**
     * Test custom shadow CSS
     */
    private function test_shadow_custom_css() {
        $settings = [
            'admin_menu' => [
                'shadow_mode' => 'custom',
                'shadow_h_offset' => 2,
                'shadow_v_offset' => 4,
                'shadow_blur' => 8,
                'shadow_spread' => 0,
                'shadow_color' => 'rgba(0,0,0,0.2)'
            ]
        ];
        
        $css = $this->call_private_method('generate_shadow_css', [$settings['admin_menu']]);
        
        $this->assert_contains($css, '2px 4px 8px 0px', 'Custom shadow values');
        $this->assert_contains($css, 'rgba(0,0,0,0.2)', 'Custom shadow color');
    }
    
    /**
     * Test uniform floating margin CSS
     */
    private function test_floating_margin_uniform() {
        $settings = [
            'admin_menu' => [
                'floating' => true,
                'floating_margin_mode' => 'uniform',
                'floating_margin' => 10
            ]
        ];
        
        $css = $this->call_private_method('generate_floating_css', [$settings['admin_menu']]);
        
        $this->assert_contains($css, 'margin: 10px', 'Uniform floating margin');
    }
    
    /**
     * Test individual floating margin CSS
     */
    private function test_floating_margin_individual() {
        $settings = [
            'admin_menu' => [
                'floating' => true,
                'floating_margin_mode' => 'individual',
                'floating_margin_top' => 10,
                'floating_margin_right' => 8,
                'floating_margin_bottom' => 10,
                'floating_margin_left' => 8
            ]
        ];
        
        $css = $this->call_private_method('generate_floating_css', [$settings['admin_menu']]);
        
        $this->assert_contains($css, '10px 8px 10px 8px', 'Individual floating margins');
    }
    
    /**
     * Test submenu background CSS
     */
    private function test_submenu_background_css() {
        $settings = [
            'admin_menu_submenu' => [
                'bg_color' => '#32373c'
            ]
        ];
        
        $css = $this->call_private_method('generate_menu_submenu_css', [$settings]);
        
        $this->assert_contains($css, 'background-color: #32373c', 'Submenu background color');
        $this->assert_contains($css, '.wp-submenu', 'Submenu selector');
    }
    
    /**
     * Test submenu border radius CSS
     */
    private function test_submenu_border_radius_css() {
        $settings = [
            'admin_menu_submenu' => [
                'border_radius_mode' => 'uniform',
                'border_radius' => 4
            ]
        ];
        
        $css = $this->call_private_method('generate_menu_submenu_css', [$settings]);
        
        $this->assert_contains($css, 'border-radius: 4px', 'Submenu border radius');
    }
    
    /**
     * Test submenu typography CSS
     */
    private function test_submenu_typography_css() {
        $settings = [
            'admin_menu_submenu' => [
                'font_size' => 12,
                'text_color' => '#ffffff',
                'line_height' => 1.5,
                'letter_spacing' => 0.5,
                'text_transform' => 'uppercase'
            ]
        ];
        
        $css = $this->call_private_method('generate_menu_submenu_css', [$settings]);
        
        $this->assert_contains($css, 'font-size: 12px', 'Submenu font size');
        $this->assert_contains($css, 'color: #ffffff', 'Submenu text color');
        $this->assert_contains($css, 'line-height: 1.5', 'Submenu line height');
        $this->assert_contains($css, 'letter-spacing: 0.5px', 'Submenu letter spacing');
        $this->assert_contains($css, 'text-transform: uppercase', 'Submenu text transform');
    }
    
    /**
     * Test logo placement CSS
     */
    private function test_logo_placement_css() {
        $settings = [
            'admin_menu' => [
                'logo_enabled' => true,
                'logo_url' => 'https://example.com/logo.png',
                'logo_position' => 'top',
                'logo_width' => 100,
                'logo_alignment' => 'center'
            ]
        ];
        
        $css = $this->call_private_method('generate_menu_logo_css', [$settings['admin_menu']]);
        
        $this->assert_contains($css, 'width: 100px', 'Logo width');
        $this->assert_contains($css, 'text-align: center', 'Logo alignment');
        $this->assert_not_empty($css, 'Logo CSS generated');
    }
    
    /**
     * Call private method using reflection
     */
    private function call_private_method($method_name, $args = []) {
        try {
            $reflection = new ReflectionClass($this->generator);
            $method = $reflection->getMethod($method_name);
            $method->setAccessible(true);
            return $method->invokeArgs($this->generator, $args);
        } catch (Exception $e) {
            return "ERROR: Method $method_name not found or failed: " . $e->getMessage();
        }
    }
    
    /**
     * Assert that string contains substring
     */
    private function assert_contains($haystack, $needle, $test_name) {
        $passed = strpos($haystack, $needle) !== false;
        $this->record_result($test_name, $passed, 
            $passed ? "✓ Contains '$needle'" : "✗ Missing '$needle'");
    }
    
    /**
     * Assert that string does not contain substring
     */
    private function assert_not_contains($haystack, $needle, $test_name) {
        $passed = strpos($haystack, $needle) === false;
        $this->record_result($test_name, $passed,
            $passed ? "✓ Does not contain '$needle'" : "✗ Unexpectedly contains '$needle'");
    }
    
    /**
     * Assert that string is not empty
     */
    private function assert_not_empty($value, $test_name) {
        $passed = !empty($value);
        $this->record_result($test_name, $passed,
            $passed ? "✓ Not empty" : "✗ Empty value");
    }
    
    /**
     * Record test result
     */
    private function record_result($test_name, $passed, $message) {
        $this->test_results[] = [
            'name' => $test_name,
            'passed' => $passed,
            'message' => $message
        ];
        
        $status = $passed ? '✓ PASS' : '✗ FAIL';
        echo "$status: $test_name - $message\n";
    }
    
    /**
     * Print test summary
     */
    private function print_summary() {
        $total = count($this->test_results);
        $passed = count(array_filter($this->test_results, function($r) { return $r['passed']; }));
        $failed = $total - $passed;
        
        echo "\n=== Test Summary ===\n";
        echo "Total: $total\n";
        echo "Passed: $passed\n";
        echo "Failed: $failed\n";
        echo "Success Rate: " . round(($passed / $total) * 100, 2) . "%\n";
        
        if ($failed > 0) {
            echo "\nFailed Tests:\n";
            foreach ($this->test_results as $result) {
                if (!$result['passed']) {
                    echo "  - {$result['name']}: {$result['message']}\n";
                }
            }
        }
    }
}

// Run tests if executed directly
if (php_sapi_name() === 'cli') {
    $test = new MASE_CSS_Generator_AdminMenu_Test();
    $test->run_all_tests();
}
