# Advanced Background System - Technical Documentation

## Overview

The Advanced Background System extends MASE to provide comprehensive background customization for six WordPress admin areas. This document provides technical documentation for developers working with or extending the system.

## Architecture

### System Components

The background system consists of:

1. **Backend (PHP)**
   - Settings Management (`MASE_Settings`)
   - CSS Generation (`MASE_CSS_Generator`)
   - File Upload Handlers (`MASE_Admin`)
   - Validation & Sanitization
   - Cache Management (`MASE_Cache`)

2. **Frontend (JavaScript)**
   - Gradient Builder (`mase-gradient-builder.js`)
   - Pattern Library (`mase-pattern-library.js`)
   - Position Picker (`mase-position-picker.js`)
   - Asset Loader (`mase-asset-loader.js`)
   - Error Recovery (`mase-error-recovery.js`)
   - Compatibility Checks (`mase-compatibility.js`)
   - Accessibility Features (`mase-background-accessibility.js`)

## Security Measures

### File Upload Security (Requirements 12.1, 12.2)

**MIME Type Validation:**
```php
// Validate file type and MIME type match
$allowed_types = array('image/jpeg', 'image/png', 'image/webp', 'image/svg+xml');
$filetype = wp_check_filetype($file['name']);

if (!in_array($filetype['type'], $allowed_types, true)) {
    wp_send_json_error(array('message' => 'Invalid file type'), 400);
}
```

**File Size Validation:**
```php
// Maximum 5MB file size
$max_size = 5 * 1024 * 1024;
if ($file['size'] > $max_size) {
    wp_send_json_error(array('message' => 'File too large'), 400);
}
```


**SVG Sanitization (Requirement 12.4):**
```javascript
/**
 * Sanitize SVG content to prevent XSS attacks
 * Removes: script tags, event handlers, javascript: URLs, data: URLs
 */
sanitizeSVG: function(svg) {
    // Remove script tags
    svg = svg.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers (onclick, onload, etc.)
    svg = svg.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // Remove javascript: URLs
    svg = svg.replace(/javascript:/gi, '');
    
    // Remove data: URLs (except for image/*)
    svg = svg.replace(/data:(?!image\/)[^"'\s]*/gi, '');
    
    return svg;
}
```

**CSRF Protection (Requirement 12.3):**
```php
// All AJAX handlers verify nonce and capability
check_ajax_referer('mase_save_settings', 'nonce');

if (!current_user_can('manage_options')) {
    wp_send_json_error(array('message' => 'Unauthorized'), 403);
}
```

**XSS Prevention (Requirement 12.4):**
```php
// All output is escaped
echo esc_html($pattern['name']);
echo esc_attr($background_config['image_url']);
echo esc_url($attachment_url);
```


## Performance Optimizations

### Lazy Loading (Requirement 7.1)

**Implementation:**
```javascript
/**
 * Lazy load background images using IntersectionObserver
 * Only loads images when they enter the viewport
 */
lazyLoad: function() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    if (src) {
                        img.style.backgroundImage = `url(${src})`;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('[data-src]').forEach(el => observer.observe(el));
    } else {
        // Fallback: load all images immediately
        document.querySelectorAll('[data-src]').forEach(el => {
            el.style.backgroundImage = `url(${el.dataset.src})`;
        });
    }
}
```

### WebP Support with Fallbacks (Requirement 7.2)

**Server-side Detection:**
```php
/**
 * Get optimized image URL with WebP support
 * Detects browser support and returns appropriate format
 */
public function get_optimized_image_url($attachment_id) {
    $supports_webp = strpos($_SERVER['HTTP_ACCEPT'], 'image/webp') !== false;
    
    if ($supports_webp) {
        $webp_url = $this->get_webp_version($attachment_id);
        if ($webp_url) {
            return $webp_url;
        }
    }
    
    return wp_get_attachment_url($attachment_id);
}
```


**Client-side Fallback:**
```css
/* CSS image-set() for automatic fallback */
.background-element {
    background-image: image-set(
        url('image.webp') type('image/webp'),
        url('image.jpg') type('image/jpeg')
    );
}
```

### CSS Generation Performance (Requirement 7.3)

**Optimization Techniques:**
```php
/**
 * Optimized CSS generation with early returns and string concatenation
 * Target: <100ms generation time
 */
private function generate_background_styles($settings) {
    $start_time = microtime(true);
    $css = '';
    
    foreach ($this->background_selectors as $area => $selector) {
        $config = $settings['custom_backgrounds'][$area] ?? array();
        
        // Early return for disabled backgrounds
        if (empty($config['enabled']) || $config['type'] === 'none') {
            continue;
        }
        
        // Use string concatenation instead of array joins
        $css .= $this->generate_area_background_css($config, $selector);
    }
    
    $execution_time = (microtime(true) - $start_time) * 1000;
    if (WP_DEBUG) {
        error_log("MASE: Background CSS generated in {$execution_time}ms");
    }
    
    return $css;
}
```

### Cache Warming (Requirement 7.4)

**Pre-generation Strategy:**
```php
/**
 * Warm cache for both light and dark modes on settings save
 * Reduces first-load latency
 */
public function warm_background_cache($settings) {
    // Generate CSS for light mode
    $light_css = $this->generate_background_styles($settings);
    $this->cache->set('background_css_light', $light_css, 86400);
    
    // Generate CSS for dark mode
    $dark_settings = $this->apply_dark_mode_overrides($settings);
    $dark_css = $this->generate_background_styles($dark_settings);
    $this->cache->set('background_css_dark', $dark_css, 86400);
}
```


### Asset Loading Optimization (Requirement 7.1, 7.3)

**On-Demand Loading:**
```javascript
/**
 * Load pattern library data only when needed
 * Reduces initial page load
 */
loadPatternLibrary: function() {
    if (this.patternsLoaded) {
        return Promise.resolve(this.patterns);
    }
    
    return $.ajax({
        url: maseAdmin.ajaxUrl,
        type: 'POST',
        data: {
            action: 'mase_get_pattern_library',
            nonce: maseAdmin.nonce
        }
    }).then(response => {
        if (response.success) {
            this.patterns = response.data;
            this.patternsLoaded = true;
            return this.patterns;
        }
    });
}
```

**Debouncing (300ms):**
```javascript
/**
 * Debounce live preview updates to prevent excessive redraws
 * Improves performance during rapid input changes
 */
debouncedUpdate: function(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
```

**DOM Query Caching:**
```javascript
/**
 * Cache DOM elements to minimize queries
 * Reduces layout thrashing
 */
initDOMCache: function() {
    this.domCache = {
        $gradientTypes: $('.mase-gradient-type'),
        $angleDials: $('.mase-gradient-angle-dial'),
        $colorStopsContainers: $('.mase-gradient-color-stops'),
        $previews: $('.mase-gradient-preview')
    };
}
```


## Complex Logic Documentation

### Gradient CSS Generation

**Linear Gradients:**
```php
/**
 * Generate linear gradient CSS
 * Supports 2-10 color stops with custom positions and angles
 * 
 * @param array $config Gradient configuration
 * @return string CSS gradient string
 */
private function generate_gradient_background_css($config) {
    $type = $config['gradient_type'] ?? 'linear';
    $angle = intval($config['gradient_angle'] ?? 90);
    $colors = $config['gradient_colors'] ?? array();
    
    // Validate minimum color stops
    if (count($colors) < 2) {
        return '';
    }
    
    // Sort colors by position
    usort($colors, function($a, $b) {
        return $a['position'] - $b['position'];
    });
    
    // Build color stops string
    $stops = array();
    foreach ($colors as $stop) {
        $color = sanitize_hex_color($stop['color']);
        $position = intval($stop['position']);
        $stops[] = "{$color} {$position}%";
    }
    
    $stops_string = implode(', ', $stops);
    
    // Generate gradient based on type
    if ($type === 'radial') {
        return "radial-gradient(circle, {$stops_string})";
    } else {
        return "linear-gradient({$angle}deg, {$stops_string})";
    }
}
```

### Pattern SVG Generation

**Color Replacement:**
```php
/**
 * Generate pattern CSS with custom color
 * Replaces {color} placeholder in SVG and creates data URI
 * 
 * @param array $config Pattern configuration
 * @return string CSS background-image property
 */
private function generate_pattern_background($config) {
    $pattern_id = $config['pattern_id'] ?? '';
    $color = sanitize_hex_color($config['pattern_color'] ?? '#000000');
    $opacity = intval($config['pattern_opacity'] ?? 100) / 100;
    $scale = intval($config['pattern_scale'] ?? 100);
    
    // Get pattern SVG from library
    $pattern_library = $this->get_pattern_library();
    $pattern_svg = $this->find_pattern_svg($pattern_library, $pattern_id);
    
    if (!$pattern_svg) {
        return '';
    }
    
    // Replace color placeholder
    $customized_svg = str_replace('{color}', $color, $pattern_svg);
    
    // Sanitize SVG (security measure)
    $customized_svg = $this->sanitize_svg($customized_svg);
    
    // Create data URI
    $encoded = base64_encode($customized_svg);
    $data_uri = "data:image/svg+xml;base64,{$encoded}";
    
    // Generate CSS
    return "background-image: url('{$data_uri}'); " .
           "background-size: {$scale}%; " .
           "opacity: {$opacity};";
}
```


### Responsive Background Generation

**Media Query CSS:**
```php
/**
 * Generate responsive background CSS with media queries
 * Supports desktop (≥1024px), tablet (768-1023px), mobile (<768px)
 * 
 * @param array $bg_config Background configuration with responsive settings
 * @param string $selector CSS selector for the area
 * @return string Media query CSS
 */
private function generate_responsive_background_css($bg_config, $selector) {
    if (empty($bg_config['responsive_enabled'])) {
        return '';
    }
    
    $css = '';
    $responsive = $bg_config['responsive'] ?? array();
    
    // Desktop styles (default, no media query)
    if (!empty($responsive['desktop'])) {
        $css .= $this->generate_area_background_css($responsive['desktop'], $selector);
    }
    
    // Tablet styles (768px - 1023px)
    if (!empty($responsive['tablet'])) {
        $css .= "@media (min-width: 768px) and (max-width: 1023px) {";
        $css .= $this->generate_area_background_css($responsive['tablet'], $selector);
        $css .= "}";
    }
    
    // Mobile styles (<768px)
    if (!empty($responsive['mobile'])) {
        $css .= "@media (max-width: 767px) {";
        $css .= $this->generate_area_background_css($responsive['mobile'], $selector);
        $css .= "}";
    }
    
    return $css;
}
```

### Image Optimization

**Automatic Resizing:**
```php
/**
 * Optimize background image by resizing if too large
 * Maintains aspect ratio, targets 1920px max width
 * 
 * @param int $attachment_id WordPress attachment ID
 * @return bool Success status
 */
private function optimize_background_image($attachment_id) {
    $file_path = get_attached_file($attachment_id);
    $image_size = getimagesize($file_path);
    
    // Check if resize needed
    if ($image_size[0] <= 1920) {
        return true;
    }
    
    // Use WordPress image editor
    $editor = wp_get_image_editor($file_path);
    
    if (is_wp_error($editor)) {
        error_log("MASE: Image editor error: " . $editor->get_error_message());
        return false;
    }
    
    // Resize maintaining aspect ratio
    $editor->resize(1920, null, false);
    $saved = $editor->save($file_path);
    
    if (is_wp_error($saved)) {
        error_log("MASE: Image save error: " . $saved->get_error_message());
        return false;
    }
    
    // Regenerate metadata
    $metadata = wp_generate_attachment_metadata($attachment_id, $file_path);
    wp_update_attachment_metadata($attachment_id, $metadata);
    
    return true;
}
```


## Error Handling and Recovery

### Upload Error Handling

**Comprehensive Error Messages:**
```php
/**
 * Handle upload errors with specific error messages
 * Provides actionable feedback to users
 */
if (isset($upload['error'])) {
    $error_messages = array(
        UPLOAD_ERR_INI_SIZE => 'File exceeds server upload limit',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds form upload limit',
        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION => 'File upload stopped by extension',
    );
    
    $error_code = $upload['error'];
    $message = $error_messages[$error_code] ?? 'Unknown upload error';
    
    wp_send_json_error(array('message' => $message), 500);
}
```

### Graceful Degradation

**Feature Detection:**
```javascript
/**
 * Detect browser capabilities and provide fallbacks
 * Ensures functionality across all browsers
 */
detectFeatures: function() {
    return {
        fileReader: 'FileReader' in window,
        dragDrop: 'draggable' in document.createElement('div'),
        blendModes: CSS.supports('mix-blend-mode', 'overlay'),
        gradients: CSS.supports('background', 'linear-gradient(red, blue)'),
        webp: this.detectWebP(),
        intersectionObserver: 'IntersectionObserver' in window
    };
},

/**
 * Apply fallbacks for unsupported features
 */
applyFallbacks: function(features) {
    if (!features.fileReader) {
        // Disable drag & drop, use file input only
        $('.mase-upload-zone').addClass('no-drag-drop');
    }
    
    if (!features.blendModes) {
        // Disable blend mode controls
        $('.mase-blend-mode-control').prop('disabled', true);
    }
    
    if (!features.intersectionObserver) {
        // Load all images immediately (no lazy loading)
        this.loadAllImages();
    }
}
```


### Cache Fallback

**Error Recovery:**
```php
/**
 * Fallback to cached CSS on generation error
 * Ensures site remains functional even if CSS generation fails
 */
public function get_background_css($settings, $mode = 'light') {
    try {
        // Attempt to generate fresh CSS
        $css = $this->generate_background_styles($settings);
        
        // Cache the generated CSS
        $cache_key = "background_css_{$mode}";
        $this->cache->set($cache_key, $css, 86400);
        
        return $css;
        
    } catch (Exception $e) {
        // Log error
        error_log("MASE: Background CSS generation error: " . $e->getMessage());
        
        // Attempt to use cached CSS
        $cache_key = "background_css_{$mode}";
        $cached_css = $this->cache->get($cache_key);
        
        if ($cached_css !== false) {
            return $cached_css;
        }
        
        // Last resort: return empty string
        return '';
    }
}
```

## Accessibility Features

### Keyboard Navigation

**Focus Management:**
```javascript
/**
 * Ensure all interactive elements are keyboard accessible
 * Implements WCAG 2.1 AA compliance
 */
initKeyboardNavigation: function() {
    // Pattern selection with keyboard
    $('.mase-pattern-item').on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });
    
    // Gradient preset selection with keyboard
    $('.mase-gradient-preset-item').on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });
    
    // Position picker grid navigation
    $('.mase-position-grid-cell').on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });
}
```


### ARIA Labels

**Screen Reader Support:**
```html
<!-- Color stop with descriptive labels -->
<div class="mase-color-stop" data-index="0">
    <input type="text" 
           class="mase-color-picker" 
           aria-label="Color stop 1 color" />
    <input type="number" 
           class="mase-stop-position" 
           aria-label="Color stop 1 position" />
    <button type="button" 
            class="mase-remove-color-stop" 
            aria-label="Remove color stop 1">
        <span class="dashicons dashicons-no-alt" aria-hidden="true"></span>
    </button>
</div>
```

### Live Announcements

**Dynamic Content Updates:**
```javascript
/**
 * Announce changes to screen readers
 * Uses ARIA live regions for dynamic updates
 */
announceChange: function(message) {
    const $announcer = $('#mase-sr-announcer');
    
    if ($announcer.length === 0) {
        // Create announcer if it doesn't exist
        $('body').append(
            '<div id="mase-sr-announcer" ' +
            'class="screen-reader-text" ' +
            'aria-live="polite" ' +
            'aria-atomic="true"></div>'
        );
    }
    
    // Update announcer text
    $('#mase-sr-announcer').text(message);
    
    // Clear after 1 second
    setTimeout(() => {
        $('#mase-sr-announcer').text('');
    }, 1000);
}
```

## Browser Compatibility

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Feature Support Matrix

| Feature | Chrome | Firefox | Safari | Edge | Fallback |
|---------|--------|---------|--------|------|----------|
| FileReader API | ✓ | ✓ | ✓ | ✓ | File input only |
| Drag & Drop | ✓ | ✓ | ✓ | ✓ | Click to upload |
| Blend Modes | ✓ | ✓ | ✓ | ✓ | Normal mode |
| CSS Gradients | ✓ | ✓ | ✓ | ✓ | Solid color |
| WebP | ✓ | ✓ | ✓ | ✓ | JPG/PNG |
| IntersectionObserver | ✓ | ✓ | ✓ | ✓ | Load all images |


## Data Structures

### Background Configuration

```php
array(
    'enabled' => true,
    'type' => 'gradient', // 'none' | 'image' | 'gradient' | 'pattern'
    
    // Image settings
    'image_url' => 'https://example.com/image.jpg',
    'image_id' => 123,
    'position' => 'center center',
    'size' => 'cover',
    'repeat' => 'no-repeat',
    'attachment' => 'scroll',
    
    // Gradient settings
    'gradient_type' => 'linear',
    'gradient_angle' => 135,
    'gradient_colors' => array(
        array('color' => '#667eea', 'position' => 0),
        array('color' => '#764ba2', 'position' => 100),
    ),
    
    // Pattern settings
    'pattern_id' => 'dot-grid',
    'pattern_color' => '#000000',
    'pattern_opacity' => 50,
    'pattern_scale' => 100,
    
    // Advanced options
    'opacity' => 80,
    'blend_mode' => 'overlay',
    
    // Responsive variations
    'responsive_enabled' => true,
    'responsive' => array(
        'desktop' => array(/* same structure */),
        'tablet' => array(/* same structure */),
        'mobile' => array('type' => 'none'), // Disable on mobile
    ),
)
```

### Pattern Library Structure

```php
array(
    'category_name' => array(
        'pattern_id' => array(
            'name' => 'Pattern Name',
            'category' => 'category_name',
            'description' => 'Pattern description',
            'svg' => '<svg>...</svg>', // With {color} placeholder
        ),
    ),
)
```

### Gradient Preset Structure

```php
array(
    'preset_id' => array(
        'name' => 'Preset Name',
        'type' => 'linear', // or 'radial'
        'angle' => 135,
        'colors' => array(
            array('color' => '#ff6b6b', 'position' => 0),
            array('color' => '#feca57', 'position' => 100),
        ),
    ),
)
```


## WordPress Hooks and Filters

### Available Filters

**Pattern Library:**
```php
/**
 * Filter pattern library to add custom patterns
 * 
 * @param array $patterns Pattern library organized by category
 * @return array Modified pattern library
 */
add_filter('mase_pattern_library', function($patterns) {
    $patterns['custom'] = array(
        'my-pattern' => array(
            'name' => 'My Custom Pattern',
            'category' => 'custom',
            'description' => 'A custom SVG pattern',
            'svg' => '<svg>...</svg>',
        ),
    );
    return $patterns;
});
```

**Gradient Presets:**
```php
/**
 * Filter gradient presets to add custom gradients
 * 
 * @param array $presets Gradient presets organized by category
 * @return array Modified gradient presets
 */
add_filter('mase_gradient_presets', function($presets) {
    $presets['custom'] = array(
        'my-gradient' => array(
            'name' => 'My Custom Gradient',
            'type' => 'linear',
            'angle' => 90,
            'colors' => array(
                array('color' => '#custom1', 'position' => 0),
                array('color' => '#custom2', 'position' => 100),
            ),
        ),
    );
    return $presets;
});
```

**Background Selectors:**
```php
/**
 * Filter background CSS selectors
 * 
 * @param array $selectors Area => CSS selector mapping
 * @return array Modified selectors
 */
add_filter('mase_background_selectors', function($selectors) {
    $selectors['custom_area'] = '.my-custom-selector';
    return $selectors;
});
```

### Available Actions

**After Background Upload:**
```php
/**
 * Action fired after successful background image upload
 * 
 * @param int $attachment_id WordPress attachment ID
 * @param string $area Area identifier
 */
do_action('mase_background_uploaded', $attachment_id, $area);
```

**After Settings Save:**
```php
/**
 * Action fired after background settings are saved
 * 
 * @param array $settings Complete settings array
 */
do_action('mase_background_settings_saved', $settings);
```


## Testing

### Unit Tests

**Settings Validation:**
```php
/**
 * Test background settings validation
 */
public function test_validate_background_settings() {
    $settings = new MASE_Settings();
    
    // Test valid image background
    $valid_image = array(
        'type' => 'image',
        'image_url' => 'https://example.com/image.jpg',
        'position' => 'center center',
        'size' => 'cover',
    );
    $result = $settings->validate_background_settings($valid_image, 'dashboard');
    $this->assertNotWPError($result);
    
    // Test invalid type
    $invalid_type = array('type' => 'invalid');
    $result = $settings->validate_background_settings($invalid_type, 'dashboard');
    $this->assertWPError($result);
}
```

**CSS Generation:**
```php
/**
 * Test gradient CSS generation
 */
public function test_generate_gradient_css() {
    $generator = new MASE_CSS_Generator();
    
    $config = array(
        'gradient_type' => 'linear',
        'gradient_angle' => 90,
        'gradient_colors' => array(
            array('color' => '#667eea', 'position' => 0),
            array('color' => '#764ba2', 'position' => 100),
        ),
    );
    
    $css = $generator->generate_gradient_background_css($config);
    $this->assertStringContainsString('linear-gradient', $css);
    $this->assertStringContainsString('90deg', $css);
}
```

### Integration Tests

**Upload Flow:**
```php
/**
 * Test complete upload flow
 */
public function test_background_upload_flow() {
    // Simulate file upload
    $_FILES['file'] = array(
        'name' => 'test-image.jpg',
        'type' => 'image/jpeg',
        'tmp_name' => '/tmp/test.jpg',
        'size' => 1024 * 1024, // 1MB
    );
    
    // Call upload handler
    $admin = new MASE_Admin();
    $result = $admin->handle_ajax_upload_background_image();
    
    // Verify attachment created
    $this->assertArrayHasKey('attachment_id', $result);
    $this->assertArrayHasKey('url', $result);
}
```


### End-to-End Tests (Playwright)

**Image Upload Test:**
```javascript
test('upload background image', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    
    // Navigate to backgrounds tab
    await page.click('text=Backgrounds');
    
    // Upload image
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-image.jpg');
    
    // Wait for upload to complete
    await page.waitForSelector('.mase-background-preview img');
    
    // Verify image displayed
    const preview = await page.locator('.mase-background-preview img');
    expect(await preview.isVisible()).toBe(true);
});
```

**Gradient Creation Test:**
```javascript
test('create gradient background', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.click('text=Backgrounds');
    
    // Select gradient type
    await page.selectOption('.mase-background-type', 'gradient');
    
    // Set gradient angle
    await page.fill('.mase-gradient-angle-input', '135');
    
    // Add color stop
    await page.click('.mase-add-color-stop');
    
    // Verify preview updated
    const preview = await page.locator('.mase-gradient-preview');
    const bgStyle = await preview.evaluate(el => el.style.background);
    expect(bgStyle).toContain('linear-gradient');
});
```

## Troubleshooting

### Common Issues

**Issue: Background not displaying**
- Check if background is enabled in settings
- Verify CSS selector matches target element
- Check browser console for errors
- Verify cache is cleared

**Issue: Upload fails**
- Check file size (<5MB)
- Verify file type (JPG, PNG, WebP, SVG)
- Check server upload limits
- Verify write permissions

**Issue: Gradient not rendering**
- Verify minimum 2 color stops
- Check color values are valid hex
- Verify browser supports gradients
- Check for CSS syntax errors

**Issue: Pattern not displaying**
- Verify pattern ID exists in library
- Check SVG is valid
- Verify color placeholder replaced
- Check data URI encoding


### Debug Mode

**Enable Debug Logging:**
```php
// In wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

**Debug Output:**
```
MASE: Background CSS generated in 45ms
MASE: Image optimized: 2400x1600 -> 1920x1280
MASE: Cache warmed for light and dark modes
MASE: Pattern 'dot-grid' applied to dashboard
MASE: Gradient with 3 color stops generated
```

## Performance Benchmarks

### Target Metrics

- CSS Generation: <100ms
- Image Upload: <2s (for 5MB file)
- Live Preview Update: <500ms
- Pattern Library Load: <1s
- Cache Hit Rate: >90%

### Optimization Checklist

- [ ] Lazy loading enabled for images
- [ ] WebP format used where supported
- [ ] CSS generation cached
- [ ] DOM queries minimized
- [ ] Debouncing applied to inputs
- [ ] Asset loading optimized
- [ ] Responsive images used

## Migration Guide

### From Legacy Background System

**Step 1: Backup existing settings**
```php
$old_settings = get_option('mase_login_background');
update_option('mase_login_background_backup', $old_settings);
```

**Step 2: Run migration**
```php
$migration = new MASE_Background_Migration();
$migration->migrate_legacy_backgrounds();
```

**Step 3: Verify migration**
```php
$new_settings = get_option('mase_settings');
$backgrounds = $new_settings['custom_backgrounds'];
// Verify login background migrated
if (!empty($backgrounds['login']['image_url'])) {
    echo 'Migration successful';
}
```

## Extending the System

### Adding Custom Background Types

**Step 1: Register new type**
```php
add_filter('mase_background_types', function($types) {
    $types['video'] = 'Video Background';
    return $types;
});
```

**Step 2: Add CSS generation**
```php
add_filter('mase_generate_background_css', function($css, $config, $selector) {
    if ($config['type'] === 'video') {
        $css .= "{$selector} { /* video CSS */ }";
    }
    return $css;
}, 10, 3);
```

**Step 3: Add UI controls**
```php
add_action('mase_background_controls', function($area) {
    echo '<div class="mase-video-controls">...</div>';
});
```


## API Reference

### PHP Classes

#### MASE_Settings

**Methods:**
- `get_background_defaults($area)` - Get default background settings for an area
- `validate_background_settings($input, $area)` - Validate background configuration
- `get_pattern_library()` - Get pattern library data
- `get_gradient_presets()` - Get gradient presets data

#### MASE_CSS_Generator

**Methods:**
- `generate_background_styles($settings)` - Generate CSS for all backgrounds
- `generate_area_background_css($config, $selector)` - Generate CSS for specific area
- `generate_image_background($config)` - Generate image background CSS
- `generate_gradient_background_css($config)` - Generate gradient CSS
- `generate_pattern_background($config)` - Generate pattern CSS
- `generate_responsive_background_css($config, $selector)` - Generate responsive CSS

#### MASE_Admin

**Methods:**
- `handle_ajax_upload_background_image()` - Handle image upload
- `handle_ajax_select_background_image()` - Handle media library selection
- `handle_ajax_remove_background_image()` - Handle background removal
- `optimize_background_image($attachment_id)` - Optimize uploaded image

### JavaScript Modules

#### MASE.gradientBuilder

**Methods:**
- `init()` - Initialize gradient builder
- `addColorStop(area)` - Add new color stop
- `updatePreview(area)` - Update gradient preview
- `getGradientConfig(area)` - Get current gradient configuration
- `generateGradientCSS(config)` - Generate CSS gradient string
- `applyPreset(area, category, presetId)` - Apply gradient preset

#### MASE.patternLibrary

**Methods:**
- `init()` - Initialize pattern library
- `render()` - Render pattern grid
- `selectPattern(patternId)` - Select a pattern
- `getPatternData(patternId)` - Get pattern data
- `updatePatternPreview()` - Update pattern preview with customizations
- `sanitizeSVG(svg)` - Sanitize SVG content

#### MASE.positionPicker

**Methods:**
- `init()` - Initialize position picker
- `setPosition(area, position)` - Set position value
- `getPosition(area)` - Get current position value
- `updatePreview(area)` - Update position preview


## Code Examples

### Example 1: Programmatically Set Background

```php
// Get current settings
$settings = new MASE_Settings();
$current = $settings->get_option();

// Set gradient background for dashboard
$current['custom_backgrounds']['dashboard'] = array(
    'enabled' => true,
    'type' => 'gradient',
    'gradient_type' => 'linear',
    'gradient_angle' => 135,
    'gradient_colors' => array(
        array('color' => '#667eea', 'position' => 0),
        array('color' => '#764ba2', 'position' => 100),
    ),
    'opacity' => 80,
    'blend_mode' => 'overlay',
);

// Save settings
$settings->update_option($current);
```

### Example 2: Add Custom Pattern

```php
add_filter('mase_pattern_library', function($patterns) {
    $patterns['custom']['company-logo'] = array(
        'name' => __('Company Logo', 'my-plugin'),
        'category' => 'custom',
        'description' => __('Company logo pattern', 'my-plugin'),
        'svg' => '<svg width="100" height="100">
            <text x="50" y="50" fill="{color}" text-anchor="middle">LOGO</text>
        </svg>',
    );
    return $patterns;
});
```

### Example 3: Custom Gradient Preset

```php
add_filter('mase_gradient_presets', function($presets) {
    $presets['brand']['company-gradient'] = array(
        'name' => __('Company Gradient', 'my-plugin'),
        'type' => 'linear',
        'angle' => 90,
        'colors' => array(
            array('color' => '#brand-color-1', 'position' => 0),
            array('color' => '#brand-color-2', 'position' => 50),
            array('color' => '#brand-color-3', 'position' => 100),
        ),
    );
    return $presets;
});
```

### Example 4: Listen to Background Events

```javascript
// Listen for pattern selection
$(document).on('mase:patternSelected', function(event, patternId, patternData) {
    console.log('Pattern selected:', patternId);
    // Custom logic here
});

// Listen for gradient changes
$(document).on('mase:gradientChanged', function(event, area, config) {
    console.log('Gradient changed for', area);
    // Custom logic here
});

// Listen for color stop changes
$(document).on('mase:colorStopAdded', function(event, data) {
    console.log('Color stop added:', data);
});
```


## Best Practices

### Performance

1. **Use WebP format** for images when possible
2. **Enable lazy loading** for non-critical backgrounds
3. **Optimize images** before upload (target 1920px width)
4. **Use patterns** instead of images for simple textures
5. **Cache CSS** aggressively (24 hour TTL)
6. **Debounce** all live preview updates
7. **Minimize DOM queries** with caching

### Security

1. **Always validate** file types and MIME types
2. **Sanitize SVG** content before rendering
3. **Verify nonces** on all AJAX requests
4. **Check capabilities** (manage_options)
5. **Escape all output** (esc_html, esc_attr, esc_url)
6. **Limit file sizes** (5MB maximum)
7. **Use WordPress functions** for file handling

### Accessibility

1. **Provide ARIA labels** for all controls
2. **Support keyboard navigation** throughout
3. **Use semantic HTML** elements
4. **Announce changes** to screen readers
5. **Ensure color contrast** meets WCAG AA
6. **Provide focus indicators** for all interactive elements
7. **Test with screen readers** (NVDA, JAWS, VoiceOver)

### Code Quality

1. **Document all methods** with PHPDoc/JSDoc
2. **Follow WordPress coding standards**
3. **Write unit tests** for critical functions
4. **Use meaningful variable names**
5. **Keep functions focused** (single responsibility)
6. **Handle errors gracefully** with fallbacks
7. **Log errors** for debugging

## Changelog

### Version 1.3.0
- Initial release of Advanced Background System
- Support for 6 admin areas
- 3 background types (image, gradient, pattern)
- 50+ SVG patterns
- 20+ gradient presets
- Responsive variations
- Live preview
- Accessibility features
- Performance optimizations

## Credits

**Development Team:**
- Background System Architecture
- Pattern Library Design
- Gradient Builder Implementation
- Performance Optimization
- Security Hardening
- Accessibility Implementation

**Third-Party Libraries:**
- WordPress Color Picker
- jQuery
- IntersectionObserver Polyfill (if needed)

## License

This code is part of the Modern Admin Styler (MASE) plugin and is licensed under GPL v2 or later.

## Support

For issues, questions, or feature requests:
- GitHub Issues: [repository URL]
- Documentation: [documentation URL]
- Support Forum: [forum URL]

---

**Last Updated:** 2024
**Version:** 1.3.0
**Maintained By:** MASE Development Team
