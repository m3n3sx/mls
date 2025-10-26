# Login Page Customization - Design Document

## Overview

This document outlines the technical design for implementing advanced WordPress login page customization in the MASE plugin. The feature enables administrators to fully customize the wp-login.php appearance including logos, backgrounds, form styling, and branding elements while maintaining WordPress security standards and MASE architectural patterns.

### Design Goals

1. **Security First**: All file uploads, user inputs, and AJAX operations must follow WordPress security best practices
2. **Architectural Consistency**: Leverage existing MASE patterns for settings, CSS generation, and AJAX handlers
3. **Performance**: Minimize impact on login page load time through efficient CSS generation and caching
4. **Accessibility**: Ensure all customizations maintain WCAG 2.1 AA compliance
5. **User Experience**: Provide intuitive admin interface with real-time previews where feasible

### Integration Points

The feature integrates with existing MASE components:
- **Settings System** (`class-mase-settings.php`): Store and validate login customization settings
- **CSS Generator** (`class-mase-css-generator.php`): Generate login page styles dynamically
- **Admin Interface** (`class-mase-admin.php`): Handle AJAX requests and file uploads
- **Cache System** (`class-mase-cache.php`): Cache generated login CSS for performance

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    WordPress Login Page                      │
│                      (wp-login.php)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ login_enqueue_scripts hook
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MASE_Admin::inject_login_css()                  │
│  - Hooks into login_enqueue_scripts                         │
│  - Retrieves login settings                                 │
│  - Generates/caches CSS                                     │
│  - Injects custom styles                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         MASE_CSS_Generator::generate_login_styles()          │
│  - Generates logo CSS                                       │
│  - Generates background CSS                                 │
│  - Generates form styling CSS                               │
│  - Generates custom CSS injection                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MASE_Cache::get_cached_login_css()              │
│  - Caches generated CSS                                     │
│  - Invalidates on settings change                           │
└─────────────────────────────────────────────────────────────┘
```


### Data Flow

```
Admin Interface → AJAX Handler → Settings Validation → Database Storage
                                                              ↓
Login Page Load → Hook Trigger → CSS Generator → Cache → Style Injection
```

1. **Configuration Phase** (Admin Interface):
   - Administrator configures login customizations in MASE settings
   - File uploads processed through secure AJAX handlers
   - Settings validated and stored in WordPress options table

2. **Rendering Phase** (Login Page):
   - WordPress loads wp-login.php
   - MASE hooks into `login_enqueue_scripts`
   - CSS generated from settings (or retrieved from cache)
   - Styles injected into login page `<head>`

## Components and Interfaces

### 1. Settings Structure

Add new `login_customization` section to `MASE_Settings::get_defaults()`:

```php
'login_customization' => array(
    // Logo Settings
    'logo_enabled'        => false,
    'logo_url'            => '',
    'logo_width'          => 84,  // WordPress default
    'logo_height'         => 84,
    'logo_link_url'       => '',  // Empty = wordpress.org (default)
    
    // Background Settings
    'background_type'     => 'color',  // 'color' | 'image' | 'gradient'
    'background_color'    => '#f0f0f1', // WordPress default
    'background_image'    => '',
    'background_position' => 'center center',
    'background_size'     => 'cover',  // 'cover' | 'contain' | 'auto'
    'background_repeat'   => 'no-repeat',
    'background_opacity'  => 100,
    
    // Gradient Settings (when background_type = 'gradient')
    'gradient_type'       => 'linear',  // 'linear' | 'radial'
    'gradient_angle'      => 135,
    'gradient_colors'     => array(
        array('color' => '#667eea', 'position' => 0),
        array('color' => '#764ba2', 'position' => 100),
    ),
    
    // Form Styling
    'form_bg_color'       => '#ffffff',
    'form_border_color'   => '#c3c4c7',
    'form_border_radius'  => 0,
    'form_box_shadow'     => 'default',  // 'none' | 'default' | 'subtle' | 'medium' | 'strong'
    'form_text_color'     => '#2c3338',
    'form_focus_color'    => '#2271b1',
    
    // Glassmorphism Effect
    'glassmorphism_enabled' => false,
    'glassmorphism_blur'    => 10,
    'glassmorphism_opacity' => 80,
    
    // Typography
    'label_font_family'   => 'system',
    'label_font_size'     => 14,
    'label_font_weight'   => 400,
    'input_font_family'   => 'system',
    'input_font_size'     => 24,
    
    // Additional Elements
    'footer_text'         => '',
    'hide_wp_branding'    => false,
    'custom_css'          => '',
    'remember_me_style'   => 'default',  // 'default' | 'custom'
),
```


### 2. Validation Rules

Extend `MASE_Settings::validate()` with login customization validation:

```php
// Validate login_customization section
if (isset($input['login_customization'])) {
    $validated['login_customization'] = array();
    $login = $input['login_customization'];
    
    // Boolean fields
    $validated['login_customization']['logo_enabled'] = 
        isset($login['logo_enabled']) ? (bool)$login['logo_enabled'] : false;
    
    // URL fields (sanitize and validate)
    if (isset($login['logo_url'])) {
        $validated['login_customization']['logo_url'] = esc_url_raw($login['logo_url']);
    }
    
    // Numeric fields with ranges
    if (isset($login['logo_width'])) {
        $width = absint($login['logo_width']);
        $validated['login_customization']['logo_width'] = 
            ($width >= 50 && $width <= 400) ? $width : 84;
    }
    
    // Enum fields (whitelist validation)
    if (isset($login['background_type'])) {
        $type = sanitize_text_field($login['background_type']);
        $validated['login_customization']['background_type'] = 
            in_array($type, ['color', 'image', 'gradient'], true) ? $type : 'color';
    }
    
    // Color fields
    if (isset($login['background_color'])) {
        $color = sanitize_hex_color($login['background_color']);
        $validated['login_customization']['background_color'] = 
            $color ? $color : '#f0f0f1';
    }
    
    // Opacity (0-100)
    if (isset($login['background_opacity'])) {
        $opacity = absint($login['background_opacity']);
        $validated['login_customization']['background_opacity'] = 
            ($opacity >= 0 && $opacity <= 100) ? $opacity : 100;
    }
    
    // Custom CSS (sanitize but allow CSS)
    if (isset($login['custom_css'])) {
        $validated['login_customization']['custom_css'] = 
            wp_strip_all_tags($login['custom_css']);
    }
    
    // Text fields (sanitize HTML)
    if (isset($login['footer_text'])) {
        $validated['login_customization']['footer_text'] = 
            wp_kses_post($login['footer_text']);
    }
}
```

### 3. AJAX Handlers

Add new AJAX handlers to `MASE_Admin` class:

#### 3.1 Logo Upload Handler

```php
/**
 * Handle login logo upload
 * 
 * Security: Nonce verification, capability check, file validation
 * Validation: File type (PNG, JPG, SVG), size (max 2MB), SVG sanitization
 */
public function handle_ajax_upload_login_logo() {
    // Verify nonce
    check_ajax_referer('mase_save_settings', 'nonce');
    
    // Check capability
    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => __('Unauthorized', 'mase')], 403);
    }
    
    // Validate file upload
    if (empty($_FILES['logo_file'])) {
        wp_send_json_error(['message' => __('No file uploaded', 'mase')], 400);
    }
    
    $file = $_FILES['logo_file'];
    
    // Check upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        wp_send_json_error(['message' => $this->get_upload_error_message($file['error'])], 400);
    }
    
    // Validate file type
    $allowed_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    $file_type = wp_check_filetype($file['name'], [
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'svg'  => 'image/svg+xml',
    ]);
    
    if (!in_array($file['type'], $allowed_types, true) || 
        !in_array($file_type['type'], $allowed_types, true)) {
        wp_send_json_error(['message' => __('Only PNG, JPG, and SVG files allowed', 'mase')], 400);
    }
    
    // Validate file size (2MB max)
    if ($file['size'] > 2 * 1024 * 1024) {
        wp_send_json_error(['message' => __('File must be less than 2MB', 'mase')], 400);
    }
    
    // Sanitize SVG if applicable
    if ($file['type'] === 'image/svg+xml') {
        $svg_content = file_get_contents($file['tmp_name']);
        $svg_content = $this->sanitize_svg($svg_content);
        
        if ($svg_content === false) {
            wp_send_json_error(['message' => __('Invalid SVG file', 'mase')], 400);
        }
        
        file_put_contents($file['tmp_name'], $svg_content);
    }
    
    // Upload file
    require_once ABSPATH . 'wp-admin/includes/file.php';
    $uploaded = wp_handle_upload($file, ['test_form' => false]);
    
    if (isset($uploaded['error'])) {
        wp_send_json_error(['message' => $uploaded['error']], 500);
    }
    
    // Update settings
    $settings = $this->settings->get_option();
    $settings['login_customization']['logo_url'] = $uploaded['url'];
    $this->settings->update_option($settings);
    
    // Clear cache
    $this->cache->invalidate('login_css');
    
    wp_send_json_success([
        'message' => __('Logo uploaded successfully', 'mase'),
        'logo_url' => $uploaded['url'],
    ]);
}
```


#### 3.2 Background Image Upload Handler

```php
/**
 * Handle login background image upload
 * 
 * Security: Nonce verification, capability check, file validation
 * Validation: File type (PNG, JPG), size (max 5MB)
 */
public function handle_ajax_upload_login_background() {
    // Similar structure to logo upload
    // Max size: 5MB (larger for background images)
    // Allowed types: PNG, JPG only (no SVG for backgrounds)
    
    check_ajax_referer('mase_save_settings', 'nonce');
    
    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => __('Unauthorized', 'mase')], 403);
    }
    
    // Validate file (PNG/JPG only, max 5MB)
    // Upload and store URL in settings['login_customization']['background_image']
    // Clear cache
}
```

#### 3.3 SVG Sanitization

```php
/**
 * Sanitize SVG content to remove malicious code
 * 
 * Removes: script tags, event handlers, external references
 * Uses: DOMDocument for XML parsing
 */
private function sanitize_svg($svg_content) {
    // Load SVG as XML
    $dom = new DOMDocument();
    $dom->loadXML($svg_content, LIBXML_NOERROR | LIBXML_NOWARNING);
    
    // Remove script elements
    $scripts = $dom->getElementsByTagName('script');
    while ($scripts->length > 0) {
        $scripts->item(0)->parentNode->removeChild($scripts->item(0));
    }
    
    // Remove event handler attributes
    $xpath = new DOMXPath($dom);
    $nodes = $xpath->query('//@*[starts-with(name(), "on")]');
    foreach ($nodes as $node) {
        $node->ownerElement->removeAttribute($node->nodeName);
    }
    
    // Remove external entity references
    $nodes = $xpath->query('//processing-instruction()');
    foreach ($nodes as $node) {
        $node->parentNode->removeChild($node);
    }
    
    return $dom->saveXML();
}
```

### 4. CSS Generation

Add new method to `MASE_CSS_Generator` class:

```php
/**
 * Generate login page CSS
 * 
 * @param array $settings Full settings array
 * @return string Generated CSS for login page
 */
public function generate_login_styles($settings) {
    $login = isset($settings['login_customization']) ? 
        $settings['login_customization'] : array();
    
    $css = '';
    
    // Logo styling
    if (!empty($login['logo_enabled']) && !empty($login['logo_url'])) {
        $css .= $this->generate_login_logo_css($login);
    }
    
    // Background styling
    $css .= $this->generate_login_background_css($login);
    
    // Form styling
    $css .= $this->generate_login_form_css($login);
    
    // Typography
    $css .= $this->generate_login_typography_css($login);
    
    // Additional elements
    $css .= $this->generate_login_additional_css($login);
    
    // Custom CSS injection
    if (!empty($login['custom_css'])) {
        $css .= "\n/* Custom CSS */\n" . $login['custom_css'];
    }
    
    return $css;
}
```


#### 4.1 Logo CSS Generation

```php
private function generate_login_logo_css($login) {
    $logo_url = esc_url($login['logo_url']);
    $width = isset($login['logo_width']) ? absint($login['logo_width']) : 84;
    $height = isset($login['logo_height']) ? absint($login['logo_height']) : 84;
    
    $css = '';
    
    // Replace WordPress logo with custom logo
    $css .= '#login h1 a {';
    $css .= 'background-image: url(' . $logo_url . ') !important;';
    $css .= 'width: ' . $width . 'px !important;';
    $css .= 'height: ' . $height . 'px !important;';
    $css .= 'background-size: contain !important;';
    $css .= 'background-position: center !important;';
    $css .= '}';
    
    return $css;
}
```

#### 4.2 Background CSS Generation

```php
private function generate_login_background_css($login) {
    $type = isset($login['background_type']) ? $login['background_type'] : 'color';
    $opacity = isset($login['background_opacity']) ? absint($login['background_opacity']) / 100 : 1;
    
    $css = 'body.login {';
    
    switch ($type) {
        case 'image':
            if (!empty($login['background_image'])) {
                $css .= 'background-image: url(' . esc_url($login['background_image']) . ') !important;';
                $css .= 'background-size: ' . esc_attr($login['background_size']) . ' !important;';
                $css .= 'background-position: ' . esc_attr($login['background_position']) . ' !important;';
                $css .= 'background-repeat: ' . esc_attr($login['background_repeat']) . ' !important;';
                
                if ($opacity < 1) {
                    $css .= 'position: relative;';
                    $css .= '}';
                    $css .= 'body.login::before {';
                    $css .= 'content: "";';
                    $css .= 'position: absolute;';
                    $css .= 'top: 0; left: 0; right: 0; bottom: 0;';
                    $css .= 'background: inherit;';
                    $css .= 'opacity: ' . $opacity . ';';
                    $css .= 'z-index: -1;';
                }
            }
            break;
            
        case 'gradient':
            $gradient_css = $this->generate_gradient_css($login);
            $css .= 'background: ' . $gradient_css . ' !important;';
            break;
            
        case 'color':
        default:
            $color = isset($login['background_color']) ? $login['background_color'] : '#f0f0f1';
            $css .= 'background-color: ' . esc_attr($color) . ' !important;';
            break;
    }
    
    $css .= '}';
    
    return $css;
}
```

#### 4.3 Form Styling CSS Generation

```php
private function generate_login_form_css($login) {
    $css = '';
    
    // Form container
    $css .= '#loginform, #registerform, #lostpasswordform {';
    
    if (isset($login['form_bg_color'])) {
        $css .= 'background-color: ' . esc_attr($login['form_bg_color']) . ' !important;';
    }
    
    if (isset($login['form_border_color'])) {
        $css .= 'border-color: ' . esc_attr($login['form_border_color']) . ' !important;';
    }
    
    if (isset($login['form_border_radius'])) {
        $radius = absint($login['form_border_radius']);
        if ($radius > 0) {
            $css .= 'border-radius: ' . $radius . 'px !important;';
        }
    }
    
    // Box shadow
    if (isset($login['form_box_shadow'])) {
        $shadow = $this->get_box_shadow_preset($login['form_box_shadow']);
        if ($shadow !== 'none') {
            $css .= 'box-shadow: ' . $shadow . ' !important;';
        }
    }
    
    // Glassmorphism effect
    if (!empty($login['glassmorphism_enabled'])) {
        $blur = isset($login['glassmorphism_blur']) ? absint($login['glassmorphism_blur']) : 10;
        $opacity = isset($login['glassmorphism_opacity']) ? absint($login['glassmorphism_opacity']) / 100 : 0.8;
        
        $css .= 'backdrop-filter: blur(' . $blur . 'px) !important;';
        $css .= '-webkit-backdrop-filter: blur(' . $blur . 'px) !important;';
        $css .= 'background-color: rgba(255, 255, 255, ' . $opacity . ') !important;';
        $css .= 'border: 1px solid rgba(255, 255, 255, 0.3) !important;';
    }
    
    $css .= '}';
    
    // Input fields
    $css .= '#loginform input[type="text"], #loginform input[type="password"],';
    $css .= '#registerform input[type="text"], #registerform input[type="email"] {';
    
    if (isset($login['form_text_color'])) {
        $css .= 'color: ' . esc_attr($login['form_text_color']) . ' !important;';
    }
    
    $css .= '}';
    
    // Focus state
    if (isset($login['form_focus_color'])) {
        $css .= '#loginform input:focus, #registerform input:focus {';
        $css .= 'border-color: ' . esc_attr($login['form_focus_color']) . ' !important;';
        $css .= 'box-shadow: 0 0 0 1px ' . esc_attr($login['form_focus_color']) . ' !important;';
        $css .= '}';
    }
    
    return $css;
}
```


#### 4.4 Helper Methods

```php
private function get_box_shadow_preset($preset) {
    $presets = array(
        'none'    => 'none',
        'default' => '0 1px 3px rgba(0, 0, 0, 0.13)',
        'subtle'  => '0 2px 4px rgba(0, 0, 0, 0.1)',
        'medium'  => '0 4px 8px rgba(0, 0, 0, 0.15)',
        'strong'  => '0 8px 16px rgba(0, 0, 0, 0.2)',
    );
    
    return isset($presets[$preset]) ? $presets[$preset] : $presets['default'];
}

private function generate_gradient_css($login) {
    $type = isset($login['gradient_type']) ? $login['gradient_type'] : 'linear';
    $angle = isset($login['gradient_angle']) ? absint($login['gradient_angle']) : 135;
    $colors = isset($login['gradient_colors']) ? $login['gradient_colors'] : array();
    
    if (empty($colors)) {
        $colors = array(
            array('color' => '#667eea', 'position' => 0),
            array('color' => '#764ba2', 'position' => 100),
        );
    }
    
    $color_stops = array();
    foreach ($colors as $stop) {
        $color = esc_attr($stop['color']);
        $position = absint($stop['position']);
        $color_stops[] = $color . ' ' . $position . '%';
    }
    
    $stops_str = implode(', ', $color_stops);
    
    if ($type === 'radial') {
        return 'radial-gradient(circle, ' . $stops_str . ')';
    }
    
    return 'linear-gradient(' . $angle . 'deg, ' . $stops_str . ')';
}
```

### 5. Login Page Hook Integration

Add hook registration to `MASE_Admin::__construct()`:

```php
// Login page customization hooks
add_action('login_enqueue_scripts', array($this, 'inject_login_css'));
add_filter('login_headerurl', array($this, 'filter_login_logo_url'));
add_filter('login_headertext', array($this, 'filter_login_logo_title'));
add_filter('login_footer', array($this, 'inject_login_footer'));
```

Implement hook methods:

```php
/**
 * Inject custom CSS into login page
 */
public function inject_login_css() {
    $settings = $this->settings->get_option();
    
    // Check if login customization is enabled
    if (empty($settings['login_customization']['logo_enabled']) && 
        empty($settings['login_customization']['background_type'])) {
        return;
    }
    
    // Try to get cached CSS
    $cache_key = 'login_css';
    $css = $this->cache->get($cache_key);
    
    if ($css === false) {
        // Generate CSS
        $css = $this->generator->generate_login_styles($settings);
        
        // Cache for 1 hour
        $this->cache->set($cache_key, $css, 3600);
    }
    
    if (!empty($css)) {
        echo '<style id="mase-login-css">' . $css . '</style>';
    }
}

/**
 * Filter login logo URL
 */
public function filter_login_logo_url($url) {
    $settings = $this->settings->get_option();
    $custom_url = isset($settings['login_customization']['logo_link_url']) ? 
        $settings['login_customization']['logo_link_url'] : '';
    
    return !empty($custom_url) ? esc_url($custom_url) : $url;
}

/**
 * Filter login logo title attribute
 */
public function filter_login_logo_title($title) {
    $settings = $this->settings->get_option();
    $custom_url = isset($settings['login_customization']['logo_link_url']) ? 
        $settings['login_customization']['logo_link_url'] : '';
    
    if (!empty($custom_url)) {
        return get_bloginfo('name');
    }
    
    return $title;
}

/**
 * Inject custom footer content
 */
public function inject_login_footer() {
    $settings = $this->settings->get_option();
    $footer_text = isset($settings['login_customization']['footer_text']) ? 
        $settings['login_customization']['footer_text'] : '';
    
    if (!empty($footer_text)) {
        echo '<div class="mase-login-footer">' . wp_kses_post($footer_text) . '</div>';
    }
    
    // Hide WordPress branding if enabled
    if (!empty($settings['login_customization']['hide_wp_branding'])) {
        echo '<style>#backtoblog, #nav { display: none !important; }</style>';
    }
}
```


## Data Models

### Settings Schema

```php
array(
    'login_customization' => array(
        // Logo Configuration
        'logo_enabled'        => bool,      // Enable custom logo
        'logo_url'            => string,    // URL to uploaded logo
        'logo_width'          => int,       // 50-400px
        'logo_height'         => int,       // 50-400px
        'logo_link_url'       => string,    // Custom link URL (optional)
        
        // Background Configuration
        'background_type'     => enum,      // 'color' | 'image' | 'gradient'
        'background_color'    => string,    // Hex color
        'background_image'    => string,    // URL to uploaded image
        'background_position' => string,    // CSS background-position
        'background_size'     => enum,      // 'cover' | 'contain' | 'auto'
        'background_repeat'   => enum,      // 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
        'background_opacity'  => int,       // 0-100
        
        // Gradient Configuration
        'gradient_type'       => enum,      // 'linear' | 'radial'
        'gradient_angle'      => int,       // 0-360 degrees
        'gradient_colors'     => array(     // Array of color stops
            array(
                'color'    => string,       // Hex color
                'position' => int,          // 0-100 percent
            ),
        ),
        
        // Form Styling
        'form_bg_color'       => string,    // Hex color
        'form_border_color'   => string,    // Hex color
        'form_border_radius'  => int,       // 0-25px
        'form_box_shadow'     => enum,      // 'none' | 'default' | 'subtle' | 'medium' | 'strong'
        'form_text_color'     => string,    // Hex color
        'form_focus_color'    => string,    // Hex color
        
        // Glassmorphism
        'glassmorphism_enabled' => bool,
        'glassmorphism_blur'    => int,     // 0-50px
        'glassmorphism_opacity' => int,     // 0-100
        
        // Typography
        'label_font_family'   => string,    // 'system' or Google Font name
        'label_font_size'     => int,       // 10-24px
        'label_font_weight'   => int,       // 100-900
        'input_font_family'   => string,
        'input_font_size'     => int,       // 16-32px
        
        // Additional Elements
        'footer_text'         => string,    // HTML allowed (wp_kses_post)
        'hide_wp_branding'    => bool,
        'custom_css'          => string,    // Raw CSS (sanitized)
        'remember_me_style'   => enum,      // 'default' | 'custom'
    ),
)
```

### File Upload Response

```json
{
    "success": true,
    "data": {
        "message": "Logo uploaded successfully",
        "logo_url": "https://example.com/wp-content/uploads/2024/01/logo.png",
        "file_size": 45678,
        "file_type": "image/png"
    }
}
```

### Validation Error Response

```json
{
    "success": false,
    "data": {
        "message": "Validation failed",
        "errors": {
            "logo_width": "Width must be between 50 and 400 pixels",
            "background_opacity": "Opacity must be between 0 and 100"
        }
    }
}
```

## Error Handling

### File Upload Errors

1. **Invalid File Type**
   - Error Code: 400
   - Message: "Only PNG, JPG, and SVG files are allowed"
   - Action: Display error, allow retry

2. **File Too Large**
   - Error Code: 400
   - Message: "File must be less than 2MB (logo) or 5MB (background)"
   - Action: Display error with size limit, suggest compression

3. **SVG Sanitization Failed**
   - Error Code: 400
   - Message: "Invalid SVG file. Please upload a valid SVG without scripts"
   - Action: Display error, suggest alternative format

4. **Upload Failed**
   - Error Code: 500
   - Message: "Failed to upload file. Please try again"
   - Action: Log error, display generic message, allow retry

### Validation Errors

1. **Invalid Color Format**
   - Fallback: Use default color
   - Log: Warning level
   - User Feedback: None (silent fallback)

2. **Out of Range Value**
   - Fallback: Clamp to valid range
   - Log: Warning level
   - User Feedback: None (silent correction)

3. **Invalid Enum Value**
   - Fallback: Use default value
   - Log: Warning level
   - User Feedback: None (silent fallback)

### CSS Generation Errors

1. **Missing Settings**
   - Fallback: Use defaults from `get_defaults()`
   - Log: Info level
   - User Impact: None

2. **Invalid CSS Syntax**
   - Fallback: Skip invalid CSS, continue with valid parts
   - Log: Warning level
   - User Impact: Partial styling applied

3. **Cache Write Failed**
   - Fallback: Continue without caching
   - Log: Warning level
   - User Impact: Slower subsequent loads


## Testing Strategy

### Unit Tests

1. **Settings Validation Tests**
   - Test valid inputs pass validation
   - Test invalid inputs are rejected or corrected
   - Test boundary values (min/max ranges)
   - Test enum value validation
   - Test color format validation
   - Test URL sanitization

2. **SVG Sanitization Tests**
   - Test script tag removal
   - Test event handler removal
   - Test external entity removal
   - Test valid SVG preservation
   - Test malformed SVG handling

3. **CSS Generation Tests**
   - Test logo CSS generation
   - Test background CSS generation (all types)
   - Test gradient CSS generation
   - Test form styling CSS generation
   - Test glassmorphism CSS generation
   - Test custom CSS injection

### Integration Tests

1. **File Upload Flow**
   - Test successful logo upload
   - Test successful background upload
   - Test file type validation
   - Test file size validation
   - Test SVG sanitization in upload flow
   - Test settings update after upload
   - Test cache invalidation after upload

2. **Settings Save Flow**
   - Test complete settings save
   - Test partial settings update
   - Test validation during save
   - Test cache invalidation after save

3. **Login Page Rendering**
   - Test CSS injection on login page
   - Test logo display
   - Test background display
   - Test form styling application
   - Test custom footer display
   - Test WordPress branding hiding

### Security Tests

1. **AJAX Handler Security**
   - Test nonce verification
   - Test capability checks
   - Test unauthorized access rejection
   - Test CSRF protection

2. **File Upload Security**
   - Test malicious file rejection
   - Test file type spoofing prevention
   - Test SVG XSS prevention
   - Test path traversal prevention

3. **Input Sanitization**
   - Test XSS prevention in text fields
   - Test SQL injection prevention
   - Test CSS injection prevention
   - Test HTML sanitization in footer text

### Accessibility Tests

1. **Color Contrast**
   - Test form text/background contrast
   - Test label visibility
   - Test focus indicator visibility
   - Test error message visibility

2. **Keyboard Navigation**
   - Test tab order preservation
   - Test focus indicators
   - Test keyboard-only login flow

3. **Screen Reader Compatibility**
   - Test logo alt text
   - Test form label associations
   - Test error message announcements

### Performance Tests

1. **CSS Generation Performance**
   - Test generation time < 50ms
   - Test cache effectiveness
   - Test cache hit rate

2. **Login Page Load Time**
   - Test with custom logo
   - Test with background image
   - Test with glassmorphism
   - Test total load time < 2s

3. **File Upload Performance**
   - Test upload time for 2MB file
   - Test SVG sanitization time
   - Test concurrent uploads

### Browser Compatibility Tests

1. **Modern Browsers**
   - Chrome (latest 2 versions)
   - Firefox (latest 2 versions)
   - Safari (latest 2 versions)
   - Edge (latest 2 versions)

2. **Features to Test**
   - Backdrop-filter (glassmorphism)
   - CSS gradients
   - Custom properties
   - SVG rendering

3. **Fallbacks**
   - Glassmorphism fallback for unsupported browsers
   - Gradient fallback to solid color

## Performance Considerations

### CSS Generation Optimization

1. **Caching Strategy**
   - Cache generated CSS for 1 hour
   - Invalidate on settings change
   - Separate cache key for login CSS
   - Use transients for WordPress compatibility

2. **Generation Efficiency**
   - Use string concatenation (faster than array joins)
   - Minimize conditional checks
   - Pre-compute common values
   - Target < 50ms generation time

3. **CSS Size Optimization**
   - Minify generated CSS
   - Remove unnecessary whitespace
   - Combine similar selectors
   - Target < 10KB uncompressed

### File Upload Optimization

1. **Image Processing**
   - Use WordPress image functions
   - Generate thumbnails if needed
   - Optimize uploaded images
   - Consider WebP conversion

2. **SVG Optimization**
   - Remove unnecessary metadata
   - Simplify paths where possible
   - Remove comments
   - Maintain visual quality

### Login Page Load Optimization

1. **Critical CSS**
   - Inline essential styles
   - Defer non-critical styles
   - Minimize render-blocking CSS

2. **Asset Loading**
   - Use WordPress asset enqueue system
   - Set appropriate cache headers
   - Enable browser caching

## Security Considerations

### Input Validation

1. **Whitelist Approach**
   - Validate enum values against whitelist
   - Reject unknown values
   - Use strict type checking

2. **Range Validation**
   - Enforce min/max for numeric values
   - Clamp out-of-range values
   - Log validation failures

3. **Format Validation**
   - Validate color formats (hex, rgb, rgba)
   - Validate URL formats
   - Validate CSS syntax

### File Upload Security

1. **Type Validation**
   - Check file extension
   - Verify MIME type
   - Validate file content
   - Prevent type spoofing

2. **Size Limits**
   - Enforce maximum file sizes
   - Check available disk space
   - Prevent DoS via large uploads

3. **Content Sanitization**
   - Remove scripts from SVG
   - Remove event handlers
   - Remove external references
   - Validate XML structure

### Output Escaping

1. **CSS Output**
   - Escape user-provided values
   - Validate CSS syntax
   - Prevent CSS injection

2. **HTML Output**
   - Use wp_kses_post for footer text
   - Escape attributes
   - Sanitize URLs

3. **JavaScript Context**
   - Escape JSON data
   - Use wp_localize_script
   - Validate data types

### Access Control

1. **Capability Checks**
   - Require 'manage_options' capability
   - Check on every AJAX request
   - Verify user session

2. **Nonce Verification**
   - Generate nonce for AJAX requests
   - Verify nonce on server
   - Use action-specific nonces

3. **Rate Limiting**
   - Limit upload frequency
   - Prevent brute force
   - Log suspicious activity


## Accessibility Compliance

### WCAG 2.1 AA Requirements

1. **Color Contrast (1.4.3)**
   - Validate text/background contrast ratio ≥ 4.5:1
   - Provide contrast checker in admin interface
   - Display warnings for insufficient contrast
   - Suggest alternative colors

2. **Focus Visible (2.4.7)**
   - Maintain visible focus indicators
   - Ensure custom styles don't hide focus
   - Test keyboard navigation
   - Provide high-contrast focus option

3. **Keyboard Navigation (2.1.1)**
   - All interactive elements keyboard accessible
   - Logical tab order
   - No keyboard traps
   - Test with keyboard only

4. **Text Alternatives (1.1.1)**
   - Logo alt text
   - Background image descriptions
   - Icon labels
   - Error messages

### Implementation

```php
/**
 * Validate color contrast ratio
 * 
 * @param string $foreground Foreground color (hex)
 * @param string $background Background color (hex)
 * @return float Contrast ratio
 */
private function calculate_contrast_ratio($foreground, $background) {
    $fg_rgb = $this->hex_to_rgb($foreground);
    $bg_rgb = $this->hex_to_rgb($background);
    
    $fg_luminance = $this->calculate_relative_luminance($fg_rgb);
    $bg_luminance = $this->calculate_relative_luminance($bg_rgb);
    
    $lighter = max($fg_luminance, $bg_luminance);
    $darker = min($fg_luminance, $bg_luminance);
    
    return ($lighter + 0.05) / ($darker + 0.05);
}

/**
 * Calculate relative luminance
 * 
 * @param array $rgb RGB values
 * @return float Relative luminance
 */
private function calculate_relative_luminance($rgb) {
    $r = $rgb['r'] / 255;
    $g = $rgb['g'] / 255;
    $b = $rgb['b'] / 255;
    
    $r = ($r <= 0.03928) ? $r / 12.92 : pow(($r + 0.055) / 1.055, 2.4);
    $g = ($g <= 0.03928) ? $g / 12.92 : pow(($g + 0.055) / 1.055, 2.4);
    $b = ($b <= 0.03928) ? $b / 12.92 : pow(($b + 0.055) / 1.055, 2.4);
    
    return 0.2126 * $r + 0.7152 * $g + 0.0722 * $b;
}

/**
 * Validate contrast and provide feedback
 * 
 * @param array $settings Login customization settings
 * @return array Validation results with warnings
 */
public function validate_accessibility($settings) {
    $warnings = array();
    
    // Check form text/background contrast
    if (isset($settings['form_text_color']) && isset($settings['form_bg_color'])) {
        $ratio = $this->calculate_contrast_ratio(
            $settings['form_text_color'],
            $settings['form_bg_color']
        );
        
        if ($ratio < 4.5) {
            $warnings[] = sprintf(
                __('Form text contrast ratio is %.2f:1. WCAG AA requires 4.5:1 minimum.', 'mase'),
                $ratio
            );
        }
    }
    
    // Check glassmorphism readability
    if (!empty($settings['glassmorphism_enabled'])) {
        $opacity = isset($settings['glassmorphism_opacity']) ? 
            absint($settings['glassmorphism_opacity']) : 80;
        
        if ($opacity < 70) {
            $warnings[] = __('Glassmorphism opacity below 70% may reduce text readability.', 'mase');
        }
    }
    
    return array(
        'valid' => empty($warnings),
        'warnings' => $warnings,
    );
}
```

## Migration and Backward Compatibility

### Version Detection

```php
/**
 * Check if login customization settings exist
 * 
 * @return bool True if settings exist
 */
private function has_login_customization() {
    $settings = $this->settings->get_option();
    return isset($settings['login_customization']);
}

/**
 * Migrate legacy login settings if they exist
 * 
 * @return bool True if migration performed
 */
public function migrate_legacy_login_settings() {
    // Check for legacy settings from other plugins
    // Migrate to MASE format if found
    // Return true if migration performed
    
    return false;
}
```

### Default Values

All settings have sensible defaults that match WordPress core styling:
- Logo: WordPress default logo (if custom not set)
- Background: #f0f0f1 (WordPress default)
- Form: White background, standard borders
- Typography: System fonts, WordPress sizes

### Rollback Strategy

1. **Settings Backup**
   - Automatic backup before applying changes
   - Manual backup option
   - Restore from backup

2. **Reset to Defaults**
   - Reset individual sections
   - Reset all login customizations
   - Preserve other MASE settings

## Admin Interface Design

### Settings Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  Login Page Customization                               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─ Logo Settings ─────────────────────────────────┐   │
│  │  ☑ Enable Custom Logo                           │   │
│  │  [Upload Logo] [Remove]                          │   │
│  │  Preview: [logo image]                           │   │
│  │  Width: [84] px  Height: [84] px                 │   │
│  │  Custom Link URL: [________________]             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ Background Settings ────────────────────────────┐   │
│  │  Type: ○ Color  ○ Image  ○ Gradient             │   │
│  │                                                   │   │
│  │  [Color Picker: #f0f0f1]                         │   │
│  │  or                                               │   │
│  │  [Upload Background] [Remove]                    │   │
│  │  Position: [dropdown]  Size: [dropdown]          │   │
│  │  Opacity: [slider 0-100%]                        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ Form Styling ───────────────────────────────────┐   │
│  │  Background: [color picker]                       │   │
│  │  Border: [color picker]                           │   │
│  │  Border Radius: [slider 0-25px]                   │   │
│  │  Box Shadow: [dropdown]                           │   │
│  │  ☐ Enable Glassmorphism Effect                   │   │
│  │    Blur: [slider]  Opacity: [slider]             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ Additional Options ─────────────────────────────┐   │
│  │  Custom Footer Text: [textarea]                   │   │
│  │  ☐ Hide WordPress Branding                       │   │
│  │  Custom CSS: [code editor]                        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [Save Changes]  [Reset to Defaults]  [Preview]         │
└─────────────────────────────────────────────────────────┘
```

### JavaScript Interactions

1. **File Upload**
   - Drag-and-drop support
   - Click to browse
   - Progress indicator
   - Preview after upload
   - Remove button

2. **Live Preview**
   - Open login page in new tab
   - Apply temporary styles
   - Refresh on changes

3. **Color Picker**
   - WordPress color picker
   - Hex input
   - Opacity slider
   - Recent colors

4. **Validation Feedback**
   - Inline error messages
   - Success notifications
   - Warning indicators
   - Accessibility warnings

## Deployment Checklist

### Pre-Deployment

- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] Security audit completed
- [ ] Accessibility audit completed
- [ ] Performance benchmarks met
- [ ] Browser compatibility verified
- [ ] Documentation updated
- [ ] Translation strings extracted

### Deployment Steps

1. **Database Migration**
   - Add default settings to `get_defaults()`
   - No database schema changes required
   - Settings stored in existing options table

2. **File Structure**
   - No new files required
   - Modifications to existing files only
   - Upload directory already exists

3. **Cache Invalidation**
   - Clear all MASE caches
   - Clear WordPress object cache
   - Clear page caches if applicable

4. **Testing**
   - Test on staging environment
   - Verify login page rendering
   - Test file uploads
   - Verify settings save/load

### Post-Deployment

- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify cache effectiveness
- [ ] Test on production login page
- [ ] Gather user feedback
- [ ] Monitor support requests

## Future Enhancements

### Phase 2 Features

1. **Advanced Typography**
   - Google Fonts integration
   - Font weight variants
   - Line height control
   - Letter spacing

2. **Animation Effects**
   - Form entrance animations
   - Hover effects
   - Transition timing

3. **Multiple Themes**
   - Save multiple login themes
   - Quick theme switching
   - Theme preview gallery

4. **Responsive Design**
   - Mobile-specific settings
   - Tablet optimizations
   - Breakpoint controls

5. **A/B Testing**
   - Test different designs
   - Track conversion rates
   - Analytics integration

### Technical Debt

1. **Code Refactoring**
   - Extract CSS generation to separate classes
   - Improve error handling
   - Add more unit test coverage

2. **Performance Optimization**
   - Implement CSS minification
   - Add image optimization
   - Improve cache strategy

3. **Documentation**
   - Add inline code documentation
   - Create user guide
   - Add video tutorials

