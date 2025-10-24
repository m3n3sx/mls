# Design Document

## Overview

This document outlines the technical design for comprehensive Admin Menu (Left Menu) enhancements in the Modern Admin Styler (MASE) plugin. The design addresses spacing issues, implements live preview for all options, fixes submenu positioning, resolves Height Mode persistence, adds gradient backgrounds, submenu customization, advanced typography with Google Fonts, and logo placement functionality.

The implementation follows MASE's existing architecture with CSS generation in `class-mase-css-generator.php`, live preview in `assets/js/mase-admin.js`, and settings UI in `includes/admin-settings-page.php`.

## Architecture

### Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Settings Page                       │
│  (includes/admin-settings-page.php)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Menu Tab                                             │  │
│  │  - Colors Section (ENHANCED)                          │  │
│  │  - Typography Section (ENHANCED)                      │  │
│  │  - Visual Effects Section (ENHANCED)                  │  │
│  │  - Gradient Background Section (NEW)                  │  │
│  │  - Submenu Styling Section (NEW)                      │  │
│  │  - Advanced Options Section (NEW)                     │  │
│  │  - Logo Placement Section (NEW)                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              JavaScript Live Preview Engine                  │
│  (assets/js/mase-admin.js)                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  adminMenuPreview Module                              │  │
│  │  - Color updates → updateMenuColors()                 │  │
│  │  - Dimension updates → updateMenuDimensions()         │  │
│  │  - Typography → updateMenuTypography()                │  │
│  │  - Effects → updateMenuEffects()                      │  │
│  │  - Submenu positioning → updateSubmenuPosition()      │  │
│  │  - Google Fonts → loadGoogleFont()                    │  │
│  │  - Logo → updateLogoDisplay()                         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                CSS Generator                                 │
│  (includes/class-mase-css-generator.php)                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  generate_admin_menu_css()                           │  │
│  │  - Base styles (colors, dimensions)                  │  │
│  │  - Typography styles                                 │  │
│  │  - Visual effects (glassmorphism, shadows)           │  │
│  │  - Gradient backgrounds (NEW)                        │  │
│  │  - Submenu styles (NEW)                              │  │
│  │  - Logo positioning (NEW)                            │  │
│  │  - Dynamic submenu positioning (FIXED)               │  │
│  │  - Height Mode persistence (FIXED)                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. User interacts with settings controls
2. JavaScript event listener captures change
3. Live preview updates DOM styles immediately
4. On save, settings sent to PHP backend via AJAX
5. CSS Generator creates optimized CSS
6. CSS cached and enqueued on admin pages


## Components and Interfaces

### 1. Settings Data Structure

Extend existing `$settings['admin_menu']` array with new properties:

```php
$settings['admin_menu'] = [
    // Existing properties
    'bg_color' => '#23282d',
    'text_color' => '#ffffff',
    'hover_bg_color' => '#0073aa',
    'hover_text_color' => '#ffffff',
    'width' => 160,
    'height_mode' => 'full', // 'full' | 'content' (FIXED: now persists)
    
    // NEW: Gradient background
    'bg_type' => 'solid', // 'solid' | 'gradient'
    'gradient_type' => 'linear', // 'linear' | 'radial' | 'conic'
    'gradient_angle' => 90, // 0-360 degrees
    'gradient_colors' => [
        ['color' => '#23282d', 'position' => 0],
        ['color' => '#32373c', 'position' => 100]
    ],
    
    // ENHANCED: Padding controls (Requirement 1)
    'padding_vertical' => 10, // 5-30 pixels
    'padding_horizontal' => 15, // 5-30 pixels
    
    // NEW: Icon color controls (Requirement 2)
    'icon_color_mode' => 'auto', // 'auto' | 'custom'
    'icon_color' => '#ffffff', // used when mode is 'custom'
    
    // NEW: Corner radius (individual)
    'border_radius_mode' => 'uniform', // 'uniform' | 'individual'
    'border_radius' => 0, // uniform value
    'border_radius_tl' => 0, // top-left
    'border_radius_tr' => 0, // top-right
    'border_radius_bl' => 0, // bottom-left
    'border_radius_br' => 0, // bottom-right
    
    // NEW: Floating margins (individual)
    'floating' => false,
    'floating_margin_mode' => 'uniform', // 'uniform' | 'individual'
    'floating_margin' => 8, // uniform value
    'floating_margin_top' => 8,
    'floating_margin_right' => 8,
    'floating_margin_bottom' => 8,
    'floating_margin_left' => 8,
    
    // NEW: Advanced shadows
    'shadow_mode' => 'preset', // 'preset' | 'custom'
    'shadow_preset' => 'none', // 'none' | 'subtle' | 'medium' | 'strong' | 'dramatic'
    'shadow_h_offset' => 0,
    'shadow_v_offset' => 4,
    'shadow_blur' => 8,
    'shadow_spread' => 0,
    'shadow_color' => 'rgba(0,0,0,0.15)',
    'shadow_opacity' => 0.15,
    
    // NEW: Logo placement
    'logo_enabled' => false,
    'logo_url' => '',
    'logo_position' => 'top', // 'top' | 'bottom'
    'logo_width' => 100, // 20-200 pixels
    'logo_alignment' => 'center', // 'left' | 'center' | 'right'
];

$settings['admin_menu_submenu'] = [
    // NEW: Submenu styling (Requirements 7, 8, 9, 10)
    'bg_color' => '#32373c',
    'border_radius_mode' => 'uniform',
    'border_radius' => 0,
    'border_radius_tl' => 0,
    'border_radius_tr' => 0,
    'border_radius_bl' => 0,
    'border_radius_br' => 0,
    'spacing' => 0, // distance from menu
    
    // NEW: Submenu typography
    'font_size' => 13,
    'text_color' => '#ffffff',
    'line_height' => 1.5,
    'letter_spacing' => 0,
    'text_transform' => 'none',
    'font_family' => 'system' // or Google Font name
];

$settings['typography']['admin_menu'] = [
    // Existing properties
    'font_size' => 13,
    'font_weight' => 400,
    'line_height' => 1.5,
    'letter_spacing' => 0,
    'text_transform' => 'none',
    
    // NEW: Font family (Requirement 11)
    'font_family' => 'system', // 'system' | Google Font name
    'google_font_url' => '' // populated if Google Font selected
];

$settings['visual_effects']['admin_menu'] = [
    // Existing properties
    'glassmorphism' => false,
    'blur_intensity' => 20,
    'border_radius' => 0,
    'shadow_preset' => 'none',
];
```


### 2. CSS Generator Methods

Enhance `class-mase-css-generator.php` with new/updated methods:

```php
/**
 * Generate admin menu CSS with all enhancements
 */
private function generate_admin_menu_css( $settings ) {
    $css = '';
    $menu = $settings['admin_menu'] ?? [];
    
    // Base selector
    $css .= '#adminmenu, #adminmenuback, #adminmenuwrap {';
    
    // Background (solid or gradient)
    if ( ($menu['bg_type'] ?? 'solid') === 'gradient' ) {
        $css .= $this->generate_gradient_background( $menu );
    } else {
        $css .= 'background-color: ' . $menu['bg_color'] . ' !important;';
    }
    
    // Width
    $width = $menu['width'] ?? 160;
    $css .= 'width: ' . $width . 'px !important;';
    
    // Border radius
    $css .= $this->generate_border_radius_css( $menu );
    
    // Shadow
    $css .= $this->generate_shadow_css( $menu );
    
    // Floating mode
    if ( $menu['floating'] ?? false ) {
        $css .= $this->generate_floating_css( $menu );
    }
    
    $css .= '}';
    
    // Menu items with optimized padding (Requirement 1)
    $css .= $this->generate_menu_item_padding_css( $menu );
    
    // Icon color synchronization (Requirement 2)
    $css .= $this->generate_menu_icon_color_css( $menu );
    
    // Dynamic submenu positioning (Requirement 3)
    $css .= $this->generate_submenu_positioning_css( $menu );
    
    // Height Mode (Requirement 4)
    $css .= $this->generate_height_mode_css( $menu );
    
    // Submenu styles (Requirements 7, 8, 9, 10)
    $css .= $this->generate_menu_submenu_css( $settings );
    
    // Logo placement (Requirement 16)
    $css .= $this->generate_menu_logo_css( $menu );
    
    return $css;
}

/**
 * Generate menu item padding CSS (Requirement 1)
 */
private function generate_menu_item_padding_css( $menu ) {
    $v_padding = $menu['padding_vertical'] ?? 10;
    $h_padding = $menu['padding_horizontal'] ?? 15;
    
    return "#adminmenu li.menu-top > a {
        padding: {$v_padding}px {$h_padding}px !important;
    }";
}

/**
 * Generate icon color CSS (Requirement 2)
 */
private function generate_menu_icon_color_css( $menu ) {
    $mode = $menu['icon_color_mode'] ?? 'auto';
    
    if ( $mode === 'auto' ) {
        $color = $menu['text_color'] ?? '#ffffff';
    } else {
        $color = $menu['icon_color'] ?? '#ffffff';
    }
    
    return "#adminmenu .wp-menu-image,
            #adminmenu .wp-menu-image:before,
            #adminmenu .dashicons {
        color: {$color} !important;
    }";
}

/**
 * Generate dynamic submenu positioning (Requirement 3)
 */
private function generate_submenu_positioning_css( $menu ) {
    $width = $menu['width'] ?? 160;
    $spacing = $settings['admin_menu_submenu']['spacing'] ?? 0;
    
    return "#adminmenu .wp-submenu {
        left: {$width}px !important;
        top: {$spacing}px !important;
    }";
}

/**
 * Generate Height Mode CSS (Requirement 4)
 */
private function generate_height_mode_css( $menu ) {
    $mode = $menu['height_mode'] ?? 'full';
    
    if ( $mode === 'content' ) {
        return "#adminmenuback, #adminmenuwrap {
            height: auto !important;
            min-height: 100vh;
        }";
    }
    
    return "#adminmenuback, #adminmenuwrap {
        height: 100% !important;
    }";
}
```


### 3. Live Preview JavaScript

Enhance `assets/js/mase-admin.js` with adminMenuPreview module:

```javascript
// Admin Menu Live Preview Module
adminMenuPreview: {
    init: function() {
        // Color controls
        $('#admin-menu-bg-color').on('change', this.updateBackgroundColor);
        $('#admin-menu-text-color').on('change', this.updateTextAndIconColor);
        $('#admin-menu-hover-bg-color').on('change', this.updateHoverColor);
        
        // Dimension controls
        $('#admin-menu-width').on('input', this.updateWidth);
        $('#admin-menu-padding-vertical').on('input', this.updatePadding);
        $('#admin-menu-padding-horizontal').on('input', this.updatePadding);
        
        // Typography controls
        $('#admin-menu-font-size').on('input', this.updateFontSize);
        $('#admin-menu-font-weight').on('change', this.updateFontWeight);
        $('#admin-menu-line-height').on('input', this.updateLineHeight);
        $('#admin-menu-letter-spacing').on('input', this.updateLetterSpacing);
        $('#admin-menu-text-transform').on('change', this.updateTextTransform);
        $('#admin-menu-font-family').on('change', this.updateFontFamily);
        
        // Visual effects (Requirement 5)
        $('#admin-menu-height-mode').on('change', this.updateHeightMode);
        $('#admin-menu-glassmorphism').on('change', this.updateGlassmorphism);
        $('#admin-menu-blur-intensity').on('input', this.updateBlurIntensity);
        $('#admin-menu-border-radius').on('input', this.updateBorderRadius);
        $('#admin-menu-shadow-preset').on('change', this.updateShadow);
        $('#admin-menu-floating').on('change', this.updateFloating);
        
        // Gradient controls (Requirement 6)
        $('#admin-menu-bg-type').on('change', this.updateBackgroundType);
        $('#admin-menu-gradient-angle').on('input', this.updateGradientAngle);
        $('.admin-menu-gradient-color').on('change', this.updateGradient);
        
        // Submenu controls
        $('#admin-menu-submenu-bg-color').on('change', this.updateSubmenuBgColor);
        $('#admin-menu-submenu-spacing').on('input', this.updateSubmenuSpacing);
        $('#admin-menu-submenu-border-radius').on('input', this.updateSubmenuBorderRadius);
        
        // Logo controls
        $('#admin-menu-logo-enabled').on('change', this.updateLogoVisibility);
        $('#admin-menu-logo-position').on('change', this.updateLogoPosition);
        $('#admin-menu-logo-width').on('input', this.updateLogoSize);
    },
    
    /**
     * Update menu width and recalculate submenu position (Requirement 3)
     */
    updateWidth: function(e) {
        const width = $(e.target).val();
        
        // Update menu width
        $('#adminmenu, #adminmenuback, #adminmenuwrap').css('width', width + 'px');
        
        // Recalculate submenu position
        const spacing = parseInt($('#admin-menu-submenu-spacing').val()) || 0;
        $('#adminmenu .wp-submenu').css({
            'left': width + 'px',
            'top': spacing + 'px'
        });
        
        // Adjust content area
        $('#wpcontent, #wpfooter').css('margin-left', width + 'px');
    },
    
    /**
     * Update text and icon color synchronization (Requirement 2)
     */
    updateTextAndIconColor: function(e) {
        const color = $(e.target).val();
        const iconMode = $('#admin-menu-icon-color-mode').val();
        
        // Update text color
        $('#adminmenu a, #adminmenu .wp-menu-name').css('color', color);
        
        // Update icon color if in auto mode
        if (iconMode === 'auto') {
            $('#adminmenu .wp-menu-image, #adminmenu .dashicons').css('color', color);
        }
    },
    
    /**
     * Update Height Mode (Requirement 4, 5)
     */
    updateHeightMode: function(e) {
        const mode = $(e.target).val();
        
        if (mode === 'content') {
            $('#adminmenuback, #adminmenuwrap').css({
                'height': 'auto',
                'min-height': '100vh'
            });
        } else {
            $('#adminmenuback, #adminmenuwrap').css('height', '100%');
        }
    },
    
    /**
     * Update submenu spacing (Requirement 9)
     */
    updateSubmenuSpacing: function(e) {
        const spacing = $(e.target).val();
        const width = parseInt($('#admin-menu-width').val()) || 160;
        
        $('#adminmenu .wp-submenu').css({
            'top': spacing + 'px',
            'left': width + 'px'
        });
    },
    
    /**
     * Load Google Font dynamically (Requirement 11)
     */
    loadGoogleFont: function(fontName) {
        // Check if already loaded
        if ($('link[href*="' + fontName + '"]').length > 0) {
            $('#adminmenu').css('font-family', '"' + fontName + '", sans-serif');
            return;
        }
        
        // Create link element
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=' + 
                    fontName.replace(' ', '+') + ':wght@300;400;500;600;700&display=swap';
        
        link.onerror = function() {
            console.error('MASE: Failed to load Google Font:', fontName);
            MASE.showNotice('error', 'Failed to load font. Using fallback.');
            $('#adminmenu').css('font-family', 'system-ui, sans-serif');
        };
        
        link.onload = function() {
            $('#adminmenu').css('font-family', '"' + fontName + '", sans-serif');
        };
        
        document.head.appendChild(link);
    },
    
    /**
     * Update logo display (Requirement 16)
     */
    updateLogoVisibility: function(e) {
        const enabled = $(e.target).is(':checked');
        
        if (enabled) {
            $('.mase-menu-logo').show();
        } else {
            $('.mase-menu-logo').hide();
        }
    }
}
```


## Data Models

### Settings Schema

```typescript
interface AdminMenuSettings {
    // Colors
    bg_color: string;
    text_color: string;
    hover_bg_color: string;
    hover_text_color: string;
    
    // Dimensions
    width: number; // 160-400
    padding_vertical: number; // 5-30
    padding_horizontal: number; // 5-30
    height_mode: 'full' | 'content';
    
    // Background
    bg_type: 'solid' | 'gradient';
    gradient_type?: 'linear' | 'radial' | 'conic';
    gradient_angle?: number; // 0-360
    gradient_colors?: Array<{color: string, position: number}>;
    
    // Icons
    icon_color_mode: 'auto' | 'custom';
    icon_color?: string;
    
    // Border Radius
    border_radius_mode: 'uniform' | 'individual';
    border_radius?: number; // 0-50
    border_radius_tl?: number;
    border_radius_tr?: number;
    border_radius_bl?: number;
    border_radius_br?: number;
    
    // Floating
    floating: boolean;
    floating_margin_mode: 'uniform' | 'individual';
    floating_margin?: number; // 0-100
    floating_margin_top?: number;
    floating_margin_right?: number;
    floating_margin_bottom?: number;
    floating_margin_left?: number;
    
    // Shadows
    shadow_mode: 'preset' | 'custom';
    shadow_preset?: 'none' | 'subtle' | 'medium' | 'strong' | 'dramatic';
    shadow_h_offset?: number;
    shadow_v_offset?: number;
    shadow_blur?: number;
    shadow_spread?: number;
    shadow_color?: string;
    shadow_opacity?: number;
    
    // Logo
    logo_enabled: boolean;
    logo_url?: string;
    logo_position?: 'top' | 'bottom';
    logo_width?: number; // 20-200
    logo_alignment?: 'left' | 'center' | 'right';
}

interface AdminMenuSubmenuSettings {
    bg_color: string;
    border_radius_mode: 'uniform' | 'individual';
    border_radius?: number;
    border_radius_tl?: number;
    border_radius_tr?: number;
    border_radius_bl?: number;
    border_radius_br?: number;
    spacing: number; // 0-50
    
    // Typography
    font_size: number; // 10-24
    text_color: string;
    line_height: number; // 1.0-3.0
    letter_spacing: number; // -2 to 5
    text_transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    font_family: string;
}

interface AdminMenuTypography {
    font_size: number; // 10-24
    font_weight: number; // 300-700
    line_height: number; // 1.0-2.0
    letter_spacing: number; // -2 to 5
    text_transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    font_family: string;
    google_font_url?: string;
}
```

## Error Handling

### CSS Generation Errors

```php
try {
    $css = $this->generate_admin_menu_css( $settings );
} catch ( Exception $e ) {
    error_log( 'MASE: Admin Menu CSS generation failed: ' . $e->getMessage() );
    
    // Return cached CSS if available
    $cached = $this->cache->get_cached_css();
    if ( $cached ) {
        return $cached;
    }
    
    // Fallback to default styles
    return $this->get_default_admin_menu_css();
}
```

### Live Preview Errors

```javascript
try {
    MASE.adminMenuPreview.updateWidth(e);
} catch (error) {
    console.error('MASE: Live preview error:', error);
    MASE.showNotice('error', 'Preview update failed. Please refresh the page.');
}
```

### Google Font Loading Errors

```javascript
link.onerror = function() {
    console.error('MASE: Failed to load Google Font:', fontName);
    MASE.showNotice('error', 'Failed to load font. Using fallback.');
    $('#adminmenu').css('font-family', 'system-ui, sans-serif');
};
```

### Logo Upload Errors

```php
// Validate file type
$allowed_types = ['image/png', 'image/jpeg', 'image/svg+xml'];
if ( ! in_array( $file['type'], $allowed_types ) ) {
    return new WP_Error( 'invalid_file_type', 
        __( 'Only PNG, JPG, and SVG files are allowed.', 'modern-admin-styler' ) );
}

// Validate file size (max 2MB)
if ( $file['size'] > 2 * 1024 * 1024 ) {
    return new WP_Error( 'file_too_large', 
        __( 'File size must be less than 2MB.', 'modern-admin-styler' ) );
}
```


## Testing Strategy

### Unit Tests

1. **CSS Generator Tests**
   - Test gradient CSS generation for menu
   - Test individual corner radius CSS
   - Test individual margin CSS
   - Test shadow CSS generation
   - Test submenu positioning calculation
   - Test Height Mode CSS output
   - Test logo CSS generation

2. **JavaScript Tests**
   - Test live preview updates for all controls
   - Test Google Font loading
   - Test submenu position recalculation
   - Test icon color synchronization
   - Test Height Mode toggle
   - Test logo display toggle

### Integration Tests

1. **Settings Save/Load**
   - Save all new menu settings
   - Load and verify settings persist
   - Test Height Mode persistence (Requirement 4)
   - Test default values

2. **Live Preview**
   - Test all controls update preview in real-time
   - Test submenu positioning updates with width changes
   - Test icon color updates with text color
   - Test Height Mode visual changes
   - Test glassmorphism, blur, shadows, border radius

3. **Submenu Tests**
   - Test submenu positioning at different menu widths
   - Test submenu spacing adjustments
   - Test submenu styling independence

### Visual Tests

1. **Spacing Tests**
   - Verify menu item padding at different values
   - Verify compact appearance with reduced padding
   - Verify consistent spacing across all items

2. **Submenu Positioning Tests**
   - Verify submenu aligns at menu width (160px, 200px, 300px)
   - Verify submenu spacing offset works correctly
   - Verify no overlap or gaps

3. **Height Mode Tests**
   - Verify "full height" spans viewport
   - Verify "fit to content" adjusts to menu items
   - Verify persistence after save and refresh

4. **Logo Tests**
   - Verify logo displays at top/bottom positions
   - Verify logo alignment (left, center, right)
   - Verify logo sizing maintains aspect ratio

### Browser Compatibility Tests

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

### CSS Generation

- Cache generated CSS for 1 hour
- Invalidate cache on settings save
- Use string concatenation (not array joins)
- Target: <10ms generation time

### Live Preview

- Debounce slider inputs (300ms)
- Use CSS transforms for animations
- Minimize DOM queries
- Cache jQuery selectors

### Google Fonts

- Load fonts asynchronously
- Cache font URLs in localStorage
- Limit to 2 font weights per family
- Use font-display: swap

### Logo Images

- Optimize images on upload
- Generate responsive sizes
- Use lazy loading
- Cache logo URLs

## Migration Strategy

### Backward Compatibility

All new settings have default values that maintain current behavior:

```php
$defaults = [
    'admin_menu' => [
        'bg_type' => 'solid',
        'padding_vertical' => 10,
        'padding_horizontal' => 15,
        'icon_color_mode' => 'auto',
        'border_radius_mode' => 'uniform',
        'border_radius' => 0,
        'floating' => false,
        'floating_margin_mode' => 'uniform',
        'floating_margin' => 8,
        'shadow_mode' => 'preset',
        'shadow_preset' => 'none',
        'logo_enabled' => false,
        'height_mode' => 'full' // Ensure default is set
    ],
    'admin_menu_submenu' => [
        'bg_color' => '#32373c',
        'border_radius_mode' => 'uniform',
        'border_radius' => 0,
        'spacing' => 0,
        'font_size' => 13,
        'text_color' => '#ffffff',
        'line_height' => 1.5,
        'letter_spacing' => 0,
        'text_transform' => 'none',
        'font_family' => 'system'
    ]
];
```

### Database Updates

No schema changes required. New settings stored in existing options table.

### Height Mode Fix

Ensure Height Mode setting is properly saved and loaded:

```php
// In MASE_Settings::save_settings()
if ( isset( $input['admin_menu']['height_mode'] ) ) {
    $sanitized['admin_menu']['height_mode'] = 
        in_array( $input['admin_menu']['height_mode'], ['full', 'content'] ) 
        ? $input['admin_menu']['height_mode'] 
        : 'full';
}
```


## Security Considerations

### Input Validation

```php
// Sanitize color values
$bg_color = sanitize_hex_color( $input['bg_color'] );

// Validate numeric ranges
$width = max( 160, min( 400, absint( $input['width'] ) ) );
$padding_v = max( 5, min( 30, absint( $input['padding_vertical'] ) ) );
$padding_h = max( 5, min( 30, absint( $input['padding_horizontal'] ) ) );

// Sanitize font family
$font_family = sanitize_text_field( $input['font_family'] );

// Validate gradient angle
$angle = max( 0, min( 360, absint( $input['gradient_angle'] ) ) );

// Validate logo URL
$logo_url = esc_url_raw( $input['logo_url'] );

// Validate enum values
$height_mode = in_array( $input['height_mode'], ['full', 'content'] ) 
    ? $input['height_mode'] 
    : 'full';
```

### XSS Prevention

```php
// Escape output
echo esc_attr( $settings['admin_menu']['bg_color'] );
echo esc_html( $settings['admin_menu']['font_family'] );
echo esc_url( $settings['admin_menu']['logo_url'] );

// Sanitize CSS
$css = wp_strip_all_tags( $css );
```

### CSRF Protection

All AJAX requests include nonce verification:

```javascript
$.ajax({
    url: MASE.config.ajaxUrl,
    data: {
        action: 'mase_save_settings',
        nonce: MASE.config.nonce,
        settings: settings
    }
});
```

### File Upload Security

```php
// Validate file type
$allowed_types = ['image/png', 'image/jpeg', 'image/svg+xml'];
$file_type = wp_check_filetype( $file['name'] );

if ( ! in_array( $file_type['type'], $allowed_types ) ) {
    return new WP_Error( 'invalid_file_type', 
        __( 'Only PNG, JPG, and SVG files are allowed.', 'modern-admin-styler' ) );
}

// Sanitize SVG content
if ( $file_type['type'] === 'image/svg+xml' ) {
    $svg_content = file_get_contents( $file['tmp_name'] );
    $svg_content = $this->sanitize_svg( $svg_content );
}

// Check user capabilities
if ( ! current_user_can( 'manage_options' ) ) {
    return new WP_Error( 'insufficient_permissions', 
        __( 'You do not have permission to upload files.', 'modern-admin-styler' ) );
}
```

## Accessibility

### Keyboard Navigation

- All controls focusable with Tab
- Sliders adjustable with arrow keys
- Color pickers accessible via keyboard
- Logo upload accessible via keyboard
- ARIA labels on all inputs

### Screen Reader Support

```html
<label for="admin-menu-width">
    Menu Width
    <span class="screen-reader-text">in pixels, range 160 to 400</span>
</label>
<input type="number" id="admin-menu-width" 
       aria-valuemin="160" aria-valuemax="400" 
       aria-valuenow="160" aria-label="Admin menu width in pixels" />

<label for="admin-menu-height-mode">
    Height Mode
    <span class="screen-reader-text">Choose between full height or fit to content</span>
</label>
<select id="admin-menu-height-mode" 
        aria-label="Menu height mode selection">
    <option value="full">Full Height (100%)</option>
    <option value="content">Fit to Content</option>
</select>
```

### Color Contrast

- All text meets WCAG AA standards (4.5:1)
- Focus indicators have 3:1 contrast
- Error states clearly visible
- Logo alt text required

### Focus Management

```javascript
// Ensure focus is maintained when toggling conditional fields
$('#admin-menu-bg-type').on('change', function() {
    if ($(this).val() === 'gradient') {
        $('#admin-menu-gradient-angle').focus();
    }
});
```

## Documentation

### User Guide

Add section to `docs/USER-GUIDE.md`:

- How to optimize menu item spacing
- How to use gradient backgrounds for menu
- How to select Google Fonts for menu
- How to configure individual corners
- How to use floating mode for menu
- How to style submenus independently
- How to add and position a logo
- How to fix Height Mode persistence

### Developer Guide

Add section to `docs/DEVELOPER-GUIDE.md`:

- CSS generation architecture for menu
- Live preview system for menu
- Adding new font sources
- Extending gradient types
- Logo upload and processing
- Submenu positioning calculations

### Troubleshooting Guide

Add section to `docs/TROUBLESHOOTING.md`:

- Height Mode not persisting → Check settings save/load
- Submenu positioning incorrect → Verify width calculation
- Icons not changing color → Check icon color mode
- Google Font not loading → Check network and console
- Logo not displaying → Verify file upload and URL

