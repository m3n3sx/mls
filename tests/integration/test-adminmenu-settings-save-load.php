<?php
/**
 * Integration Tests for Admin Menu Settings Save/Load
 * 
 * Tests settings persistence for all admin menu enhancements
 * 
 * @package ModernAdminStyler
 */

// Mock WordPress functions
if (!function_exists('get_option')) {
    function get_option($option, $default = false) {
        global $mock_options;
        return isset($mock_options[$option]) ? $mock_options[$option] : $default;
    }
}

if (!function_exists('update_option')) {
    function update_option($option, $value) {
        global $mock_options;
        $mock_options[$option] = $value;
        return true;
    }
}

if (!function_exists('sanitize_text_field')) {
    function sanitize_text_field($str) { return strip_tags($str); }
}

if (!function_exists('sanitize_hex_color')) {
    function sanitize_hex_color($color) { 
        return preg_match('/^#[a-f0-9]{6}$/i', $color) ? $color : ''; 
    }
}

if (!function_exists('absint')) {
    function absint($value) { return abs(intval($value)); }
}

if (!function_exists('esc_url_raw')) {
    function esc_url_raw($url) { return filter_var($url, FILTER_SANITIZE_URL); }
}

// Load required classes
require_once __DIR__ . '/../../includes/class-mase-settings.php';

class MASE_AdminMenu_Settings_Integration_Test {
    private $settings;
    private $test_results = [];
    
    public function __construct() {
        $this->settings = new MASE_Settings();
    }
    
    /**
     * Run all integration tests
     */
    public function run_all_tests() {
        echo "=== Admin Menu Settings Integration Tests ===\n\n";
        
        $this->test_height_mode_persistence();
        $this->test_padding_settings_save_load();
        $this->test_icon_color_settings_save_load();
        $this->test_gradient_settings_save_load();
        $this->test_border_radius_settings_save_load();
        $this->test_shadow_settings_save_load();
        $this->test_floating_margin_settings_save_load();
        $this->test_submenu_settings_save_load();
        $this->test_logo_settings_save_load();
        $this->test_width_unit_settings_save_load();
        
        $this->print_summary();
    }
    
    /**
     * Test Height Mode persistence (Requirement 4.1, 4.2)
     */
    private function test_height_mode_persistence() {
        // Save settings with height_mode = 'content'
        $input = [
            'admin_menu' => [
                'height_mode' => 'content'
            ]
        ];
        
        $saved = $this->settings->save_settings($input);
        $this->assert_true(isset($saved['admin_menu']['height_mode']), 
            'Height Mode saved in settings');
        $this->assert_equals($saved['admin_menu']['height_mode'], 'content',
            'Height Mode value is "content"');
        
        // Load settings and verify persistence
        $loaded = $this->settings->get_settings();
        $this->assert_equals($loaded['admin_menu']['height_mode'], 'content',
            'Height Mode persists after load');
    }
    
    /**
     * Test padding settings save/load (Requirement 1.2)
     */
    private function test_padding_settings_save_load() {
        $input = [
            'admin_menu' => [
                'padding_vertical' => 12,
                'padding_horizontal' => 18
            ]
        ];
        
        $saved = $this->settings->save_settings($input);
        $this->assert_equals($saved['admin_menu']['padding_vertical'], 12,
            'Vertical padding saved');
        $this->assert_equals($saved['admin_menu']['padding_horizontal'], 18,
            'Horizontal padding saved');
        
        $loaded = $this->settings->get_settings();
        $this->assert_equals($loaded['admin_menu']['padding_vertical'], 12,
            'Vertical padding persists');
        $this->assert_equals($loaded['admin_menu']['padding_horizontal'], 18,
            'Horizontal padding persists');
    }
    
    /**
     * Test icon color settings save/load (Requirement 2.3)
     */
    private function test_icon_color_settings_save_load() {
        $input = [
            'admin_menu' => [
                'icon_color_mode' => 'custom',
                'icon_color' => '#00a0d2'
            ]
        ];
        
        $saved = $this->settings->save_settings($input);
        $this->assert_equals($saved['admin_menu']['icon_color_mode'], 'custom',
            'Icon color mode saved');
        $this->assert_equals($saved['admin_menu']['icon_color'], '#00a0d2',
            'Custom icon color saved');
    }
    
    /**
     * Test gradient settings save/load (Requirement 6.1, 6.2, 6.4)
     */
    private function test_gradient_settings_save_load() {
        $input = [
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
        
        $saved = $this->settings->save_settings($input);
        $this->assert_equals($saved['admin_menu']['bg_type'], 'gradient',
            'Background type saved as gradient');
        $this->assert_equals($saved['admin_menu']['gradient_type'], 'linear',
            'Gradient type saved');
        $this->assert_equals($saved['admin_menu']['gradient_angle'], 90,
            'Gradient angle saved');
        $this->assert_true(is_array($saved['admin_menu']['gradient_colors']),
            'Gradient colors array saved');
    }
    
    /**
     * Test border radius settings save/load (Requirement 12.1, 12.2, 12.3)
     */
    private function test_border_radius_settings_save_load() {
        $input = [
            'admin_menu' => [
                'border_radius_mode' => 'individual',
                'border_radius_tl' => 10,
                'border_radius_tr' => 5,
                'border_radius_bl' => 0,
                'border_radius_br' => 15
            ]
        ];
        
        $saved = $this->settings->save_settings($input);
        $this->assert_equals($saved['admin_menu']['border_radius_mode'], 'individual',
            'Border radius mode saved');
        $this->assert_equals($saved['admin_menu']['border_radius_tl'], 10,
            'Top-left radius saved');
        $this->assert_equals($saved['admin_menu']['border_radius_br'], 15,
            'Bottom-right radius saved');
    }
    
    /**
     * Test shadow settings save/load (Requirement 13.1, 13.2, 13.3)
     */
    private function test_shadow_settings_save_load() {
        $input = [
            'admin_menu' => [
                'shadow_mode' => 'custom',
                'shadow_h_offset' => 2,
                'shadow_v_offset' => 4,
                'shadow_blur' => 8,
                'shadow_spread' => 0,
                'shadow_color' => 'rgba(0,0,0,0.2)'
            ]
        ];
        
        $saved = $this->settings->save_settings($input);
        $this->assert_equals($saved['admin_menu']['shadow_mode'], 'custom',
            'Shadow mode saved');
        $this->assert_equals($saved['admin_menu']['shadow_h_offset'], 2,
            'Shadow horizontal offset saved');
        $this->assert_equals($saved['admin_menu']['shadow_blur'], 8,
            'Shadow blur saved');
    }
    
    /**
     * Test floating margin settings save/load (Requirement 15.1, 15.2, 15.3)
     */
    private function test_floating_margin_settings_save_load() {
        $input = [
            'admin_menu' => [
                'floating' => true,
                'floating_margin_mode' => 'individual',
                'floating_margin_top' => 10,
                'floating_margin_right' => 8,
                'floating_margin_bottom' => 10,
                'floating_margin_left' => 8
            ]
        ];
        
        $saved = $this->settings->save_settings($input);
        $this->assert_true($saved['admin_menu']['floating'],
            'Floating mode saved');
        $this->assert_equals($saved['admin_menu']['floating_margin_mode'], 'individual',
            'Floating margin mode saved');
        $this->assert_equals($saved['admin_menu']['floating_margin_top'], 10,
            'Top margin saved');
    }
    
    /**
     * Test submenu settings save/load (Requirements 7.1, 8.1, 9.1, 10.1-10.5)
     */
    private function test_submenu_settings_save_load() {
        $input = [
            'admin_menu_submenu' => [
                'bg_color' => '#32373c',
                'border_radius_mode' => 'uniform',
                'border_radius' => 4,
                'spacing' => 10,
                'font_size' => 12,
                'text_color' => '#ffffff',
                'line_height' => 1.5,
                'letter_spacing' => 0.5,
                'text_transform' => 'uppercase'
            ]
        ];
        
        $saved = $this->settings->save_settings($input);
        $this->assert_equals($saved['admin_menu_submenu']['bg_color'], '#32373c',
            'Submenu background color saved');
        $this->assert_equals($saved['admin_menu_submenu']['spacing'], 10,
            'Submenu spacing saved');
        $this->assert_equals($saved['admin_menu_submenu']['font_size'], 12,
            'Submenu font size saved');
        $this->assert_equals($saved['admin_menu_submenu']['text_transform'], 'uppercase',
            'Submenu text transform saved');
    }
    
    /**
     * Test logo settings save/load (Requirement 16.1, 16.2, 16.3, 16.4)
     */
    private function test_logo_settings_save_load() {
        $input = [
            'admin_menu' => [
                'logo_enabled' => true,
                'logo_url' => 'https://example.com/logo.png',
                'logo_position' => 'top',
                'logo_width' => 100,
                'logo_alignment' => 'center'
            ]
        ];
        
        $saved = $this->settings->save_settings($input);
        $this->assert_true($saved['admin_menu']['logo_enabled'],
            'Logo enabled saved');
        $this->assert_equals($saved['admin_menu']['logo_position'], 'top',
            'Logo position saved');
        $this->assert_equals($saved['admin_menu']['logo_width'], 100,
            'Logo width saved');
    }
    
    /**
     * Test width unit settings save/load (Requirement 14.1, 14.2, 14.3)
     */
    private function test_width_unit_settings_save_load() {
        $input = [
            'admin_menu' => [
                'width' => 200,
                'width_unit' => 'px'
            ]
        ];
        
        $saved = $this->settings->save_settings($input);
        $this->assert_equals($saved['admin_menu']['width'], 200,
            'Width value saved');
        $this->assert_equals($saved['admin_menu']['width_unit'], 'px',
            'Width unit saved');
    }
    
    /**
     * Assert true
     */
    private function assert_true($condition, $test_name) {
        $this->record_result($test_name, $condition,
            $condition ? '✓ True' : '✗ False');
    }
    
    /**
     * Assert equals
     */
    private function assert_equals($actual, $expected, $test_name) {
        $passed = $actual === $expected;
        $message = $passed 
            ? "✓ Expected: $expected, Got: $actual"
            : "✗ Expected: $expected, Got: $actual";
        $this->record_result($test_name, $passed, $message);
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
    }
}

// Run tests if executed directly
if (php_sapi_name() === 'cli') {
    $test = new MASE_AdminMenu_Settings_Integration_Test();
    $test->run_all_tests();
}
