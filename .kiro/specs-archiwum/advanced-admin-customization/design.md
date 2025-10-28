# Design Document

## Overview

This design document specifies the implementation of three advanced customization features for MASE:
1. Content Typography System
2. Dashboard Widgets Customization  
3. Advanced Input Fields & Forms System

The design maintains full compatibility with existing MASE architecture including the live preview system, settings save mechanism, validation framework, and CSS generation pipeline.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WordPress Admin                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MASE Settings Page                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Typography   │  │   Widgets    │  │  Form Fields │     │
│  │   Tab        │  │     Tab      │  │     Tab      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Live Preview System (mase-admin.js)             │
│  • Debounced updates (300ms)                                 │
│  • Real-time CSS injection                                   │
│  • No page reload required                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│           Settings Save System (MASE_Settings)               │
│  • Full validation via validate()                            │
│  • Uses update_option() with validation                      │
│  • Returns WP_Error on failure                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│          CSS Generation (MASE_CSS_Generator)                 │
│  • Mode-specific caching (light/dark)                        │
│  • String concatenation for performance                      │
│  • < 100ms generation time                                   │
└─────────────────────────────────────────────────────────────┘
```


### Integration Points

#### 1. Settings Storage (MASE_Settings)

**Extension Strategy:**
- Add new sections to `get_defaults()` method
- Extend `validate()` method with new validation rules
- Use existing `update_option()` for saves (with full validation)
- Maintain backward compatibility with existing settings

**New Settings Sections:**
```php
'content_typography' => array(
    'body_text' => array(/* properties */),
    'headings' => array('h1' => array(/* properties */), /* h2-h6 */),
    'comments' => array(/* properties */),
    'widgets' => array(/* properties */),
    'meta' => array(/* properties */),
    'tables' => array(/* properties */),
    'notices' => array(/* properties */),
    'google_fonts_enabled' => true,
    'google_fonts_list' => array(),
    'font_display' => 'swap',
    'preload_fonts' => array()
),
'dashboard_widgets' => array(
    'container' => array(/* styling */),
    'header' => array(/* styling */),
    'content' => array(/* styling */),
    'specific_widgets' => array(
        'dashboard_right_now' => array(/* overrides */),
        'dashboard_activity' => array(/* overrides */),
        /* other widgets */
    ),
    'responsive' => array(
        'mobile_stack' => true,
        'tablet_columns' => 2,
        'desktop_columns' => 3
    )
),
'form_controls' => array(
    'text_inputs' => array(/* styling */),
    'textareas' => array(/* styling */),
    'selects' => array(/* styling */),
    'checkboxes' => array(/* styling */),
    'radios' => array(/* styling */),
    'file_uploads' => array(/* styling */),
    'search_fields' => array(/* styling */)
)
```


#### 2. CSS Generation (MASE_CSS_Generator)

**Extension Strategy:**
- Add new private methods for each feature
- Call from existing `generate_css_internal()` method
- Use string concatenation for performance
- Maintain < 100ms generation time target

**New Methods:**
```php
private function generate_content_typography_css( $settings ) {
    // Generate typography CSS for all content areas
    // Include Google Fonts @import if enabled
    // Generate heading hierarchy CSS
    // Apply responsive font scaling
}

private function generate_dashboard_widgets_css( $settings ) {
    // Generate widget container CSS
    // Generate widget header CSS
    // Generate widget content CSS
    // Generate specific widget overrides
    // Generate responsive layout CSS
}

private function generate_form_controls_css( $settings ) {
    // Generate text input CSS
    // Generate textarea CSS
    // Generate select dropdown CSS
    // Generate checkbox/radio CSS
    // Generate file upload CSS
    // Generate state-specific CSS (hover, focus, error, disabled)
}
```

**CSS Selector Strategy:**
```css
/* Typography - High specificity to override WordPress defaults */
body.wp-admin .wp-editor-area,
body.wp-admin .block-editor-writing-flow { /* content typography */ }

body.wp-admin .comment-content { /* comment typography */ }

body.wp-admin h1, body.wp-admin h2, /* ... */ { /* heading hierarchy */ }

/* Dashboard Widgets - Target specific widget containers */
body.wp-admin .postbox { /* widget container */ }
body.wp-admin .postbox .hndle { /* widget header */ }
body.wp-admin .postbox .inside { /* widget content */ }
body.wp-admin #dashboard_right_now { /* specific widget */ }

/* Form Controls - High specificity for WordPress override */
body.wp-admin input[type="text"],
body.wp-admin input[type="email"],
body.wp-admin input[type="url"] { /* text inputs */ }

body.wp-admin textarea { /* textareas */ }

body.wp-admin select { /* select dropdowns */ }

body.wp-admin input[type="checkbox"] { /* checkboxes */ }
```


#### 3. Live Preview System (mase-admin.js)

**Extension Strategy:**
- Add new event handlers to existing `MASE.livePreview` module
- Use existing debounce mechanism (300ms delay)
- Follow existing pattern: collect values → generate CSS → inject into page
- No modifications to save system

**New Preview Handlers:**
```javascript
MASE.livePreview = {
    // Existing handlers...
    
    // NEW: Typography preview handlers
    initTypographyPreview: function() {
        // Font family changes
        $('.typography-font-family').on('change', function() {
            MASE.livePreview.debounce(function() {
                MASE.livePreview.updateTypographyPreview();
            });
        });
        
        // Font size, weight, spacing changes
        $('.typography-property').on('input', function() {
            MASE.livePreview.debounce(function() {
                MASE.livePreview.updateTypographyPreview();
            });
        });
        
        // Google Fonts loading
        $('.google-font-selector').on('change', function() {
            MASE.livePreview.loadGoogleFont($(this).val());
        });
    },
    
    updateTypographyPreview: function() {
        var css = MASE.livePreview.generateTypographyCSS();
        MASE.livePreview.injectCSS('typography-preview', css);
    },
    
    loadGoogleFont: function(fontFamily) {
        // Dynamically load Google Font
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=' + 
                    encodeURIComponent(fontFamily) + ':wght@300;400;500;600;700&display=swap';
        document.head.appendChild(link);
    },
    
    // NEW: Widget preview handlers
    initWidgetPreview: function() {
        $('.widget-style-control').on('input change', function() {
            MASE.livePreview.debounce(function() {
                MASE.livePreview.updateWidgetPreview();
            });
        });
    },
    
    updateWidgetPreview: function() {
        var css = MASE.livePreview.generateWidgetCSS();
        MASE.livePreview.injectCSS('widget-preview', css);
    },
    
    // NEW: Form control preview handlers
    initFormControlPreview: function() {
        $('.form-control-style').on('input change', function() {
            MASE.livePreview.debounce(function() {
                MASE.livePreview.updateFormControlPreview();
            });
        });
    },
    
    updateFormControlPreview: function() {
        var css = MASE.livePreview.generateFormControlCSS();
        MASE.livePreview.injectCSS('form-control-preview', css);
    }
};
```


#### 4. Validation System (MASE_Settings::validate)

**Extension Strategy:**
- Add new validation methods for each feature
- Call from existing `validate()` method
- Return WP_Error with detailed messages on failure
- Follow existing validation patterns

**New Validation Methods:**
```php
private function validate_content_typography( $typography ) {
    $errors = array();
    
    // Validate font sizes (8-72px)
    if ( isset( $typography['body_text']['font_size'] ) ) {
        $size = absint( $typography['body_text']['font_size'] );
        if ( $size < 8 || $size > 72 ) {
            $errors[] = 'Font size must be between 8 and 72 pixels';
        }
    }
    
    // Validate line height (0.8-3.0)
    if ( isset( $typography['body_text']['line_height'] ) ) {
        $height = floatval( $typography['body_text']['line_height'] );
        if ( $height < 0.8 || $height > 3.0 ) {
            $errors[] = 'Line height must be between 0.8 and 3.0';
        }
    }
    
    // Validate letter spacing (-5px to 10px)
    if ( isset( $typography['body_text']['letter_spacing'] ) ) {
        $spacing = intval( $typography['body_text']['letter_spacing'] );
        if ( $spacing < -5 || $spacing > 10 ) {
            $errors[] = 'Letter spacing must be between -5 and 10 pixels';
        }
    }
    
    // Validate font weight (100-900)
    if ( isset( $typography['body_text']['font_weight'] ) ) {
        $weight = absint( $typography['body_text']['font_weight'] );
        if ( $weight < 100 || $weight > 900 || $weight % 100 !== 0 ) {
            $errors[] = 'Font weight must be 100, 200, 300, 400, 500, 600, 700, 800, or 900';
        }
    }
    
    // Validate text transform enum
    $valid_transforms = array( 'none', 'uppercase', 'lowercase', 'capitalize' );
    if ( isset( $typography['body_text']['text_transform'] ) ) {
        if ( ! in_array( $typography['body_text']['text_transform'], $valid_transforms, true ) ) {
            $errors[] = 'Invalid text transform value';
        }
    }
    
    // Validate Google Fonts list
    if ( isset( $typography['google_fonts_list'] ) && is_array( $typography['google_fonts_list'] ) ) {
        foreach ( $typography['google_fonts_list'] as $font ) {
            if ( ! is_string( $font ) || empty( $font ) ) {
                $errors[] = 'Invalid Google Font name';
            }
        }
    }
    
    if ( ! empty( $errors ) ) {
        return new WP_Error( 'typography_validation_failed', implode( '; ', $errors ) );
    }
    
    return $typography;
}

private function validate_dashboard_widgets( $widgets ) {
    $errors = array();
    
    // Validate border width (0-10px)
    if ( isset( $widgets['container']['border_width'] ) ) {
        $width = absint( $widgets['container']['border_width'] );
        if ( $width > 10 ) {
            $errors[] = 'Border width must be between 0 and 10 pixels';
        }
    }
    
    // Validate border radius (0-50px)
    if ( isset( $widgets['container']['border_radius'] ) ) {
        $radius = absint( $widgets['container']['border_radius'] );
        if ( $radius > 50 ) {
            $errors[] = 'Border radius must be between 0 and 50 pixels';
        }
    }
    
    // Validate header font size (12-24px)
    if ( isset( $widgets['header']['font_size'] ) ) {
        $size = absint( $widgets['header']['font_size'] );
        if ( $size < 12 || $size > 24 ) {
            $errors[] = 'Header font size must be between 12 and 24 pixels';
        }
    }
    
    // Validate responsive columns (1-4)
    if ( isset( $widgets['responsive']['desktop_columns'] ) ) {
        $cols = absint( $widgets['responsive']['desktop_columns'] );
        if ( $cols < 1 || $cols > 4 ) {
            $errors[] = 'Desktop columns must be between 1 and 4';
        }
    }
    
    if ( ! empty( $errors ) ) {
        return new WP_Error( 'widget_validation_failed', implode( '; ', $errors ) );
    }
    
    return $widgets;
}

private function validate_form_controls( $controls ) {
    $errors = array();
    
    // Validate border width (0-5px)
    if ( isset( $controls['text_inputs']['border_width'] ) ) {
        $width = absint( $controls['text_inputs']['border_width'] );
        if ( $width > 5 ) {
            $errors[] = 'Border width must be between 0 and 5 pixels';
        }
    }
    
    // Validate border radius (0-25px)
    if ( isset( $controls['text_inputs']['border_radius'] ) ) {
        $radius = absint( $controls['text_inputs']['border_radius'] );
        if ( $radius > 25 ) {
            $errors[] = 'Border radius must be between 0 and 25 pixels';
        }
    }
    
    // Validate font size (10-18px)
    if ( isset( $controls['text_inputs']['font_size'] ) ) {
        $size = absint( $controls['text_inputs']['font_size'] );
        if ( $size < 10 || $size > 18 ) {
            $errors[] = 'Font size must be between 10 and 18 pixels';
        }
    }
    
    // Validate checkbox size (12-24px)
    if ( isset( $controls['checkboxes']['size'] ) ) {
        $size = absint( $controls['checkboxes']['size'] );
        if ( $size < 12 || $size > 24 ) {
            $errors[] = 'Checkbox size must be between 12 and 24 pixels';
        }
    }
    
    // Validate colors
    $color_fields = array( 'bg_color', 'text_color', 'border_color', 'placeholder_color' );
    foreach ( $color_fields as $field ) {
        if ( isset( $controls['text_inputs'][ $field ] ) ) {
            $color = sanitize_hex_color( $controls['text_inputs'][ $field ] );
            if ( ! $color ) {
                $errors[] = "Invalid color value for {$field}";
            }
        }
    }
    
    if ( ! empty( $errors ) ) {
        return new WP_Error( 'form_control_validation_failed', implode( '; ', $errors ) );
    }
    
    return $controls;
}
```


## Components and Interfaces

### 1. Content Typography System

#### UI Components

**Typography Tab Structure:**
```html
<div class="mase-tab-content" id="typography-tab">
    <!-- Area Selector -->
    <div class="typography-area-selector">
        <button data-area="body_text">Body Text</button>
        <button data-area="headings">Headings</button>
        <button data-area="comments">Comments</button>
        <button data-area="widgets">Widgets</button>
        <button data-area="meta">Meta</button>
        <button data-area="tables">Tables</button>
        <button data-area="notices">Notices</button>
    </div>
    
    <!-- Typography Controls -->
    <div class="typography-controls">
        <!-- Font Family -->
        <div class="control-group">
            <label>Font Family</label>
            <select class="typography-font-family">
                <option value="system">System Font</option>
                <optgroup label="Google Fonts">
                    <!-- Populated dynamically -->
                </optgroup>
            </select>
        </div>
        
        <!-- Font Size -->
        <div class="control-group">
            <label>Font Size</label>
            <input type="range" min="8" max="72" class="typography-property" data-property="font_size">
            <input type="number" min="8" max="72" class="typography-property-value">
            <span class="unit">px</span>
        </div>
        
        <!-- Line Height -->
        <div class="control-group">
            <label>Line Height</label>
            <input type="range" min="0.8" max="3.0" step="0.1" class="typography-property" data-property="line_height">
            <input type="number" min="0.8" max="3.0" step="0.1" class="typography-property-value">
        </div>
        
        <!-- Letter Spacing -->
        <div class="control-group">
            <label>Letter Spacing</label>
            <input type="range" min="-5" max="10" class="typography-property" data-property="letter_spacing">
            <input type="number" min="-5" max="10" class="typography-property-value">
            <span class="unit">px</span>
        </div>
        
        <!-- Font Weight -->
        <div class="control-group">
            <label>Font Weight</label>
            <select class="typography-property" data-property="font_weight">
                <option value="100">Thin (100)</option>
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi-Bold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="900">Black (900)</option>
            </select>
        </div>
        
        <!-- Text Transform -->
        <div class="control-group">
            <label>Text Transform</label>
            <select class="typography-property" data-property="text_transform">
                <option value="none">None</option>
                <option value="uppercase">UPPERCASE</option>
                <option value="lowercase">lowercase</option>
                <option value="capitalize">Capitalize</option>
            </select>
        </div>
        
        <!-- Advanced Options (Collapsible) -->
        <details class="typography-advanced">
            <summary>Advanced Options</summary>
            
            <!-- Text Shadow -->
            <div class="control-group">
                <label>Text Shadow</label>
                <input type="text" class="typography-property" data-property="text_shadow" 
                       placeholder="2px 2px 4px rgba(0,0,0,0.3)">
            </div>
            
            <!-- Ligatures -->
            <div class="control-group">
                <label>
                    <input type="checkbox" class="typography-property" data-property="ligatures">
                    Enable Ligatures
                </label>
            </div>
            
            <!-- Drop Caps -->
            <div class="control-group">
                <label>
                    <input type="checkbox" class="typography-property" data-property="drop_caps">
                    Enable Drop Caps
                </label>
            </div>
        </details>
    </div>
    
    <!-- Heading Hierarchy (shown when "Headings" area selected) -->
    <div class="heading-hierarchy" style="display:none;">
        <div class="scale-ratio-selector">
            <label>Scale Ratio</label>
            <select class="heading-scale-ratio">
                <option value="1.125">Minor Second (1.125)</option>
                <option value="1.200">Minor Third (1.200)</option>
                <option value="1.250">Major Third (1.250)</option>
                <option value="1.333">Perfect Fourth (1.333)</option>
                <option value="1.414">Augmented Fourth (1.414)</option>
                <option value="1.500">Perfect Fifth (1.500)</option>
                <option value="1.618">Golden Ratio (1.618)</option>
            </select>
        </div>
        
        <!-- Individual heading controls H1-H6 -->
        <div class="heading-controls">
            <!-- Repeated for each heading level -->
        </div>
    </div>
    
    <!-- Google Fonts Settings -->
    <div class="google-fonts-settings">
        <label>
            <input type="checkbox" name="google_fonts_enabled">
            Enable Google Fonts
        </label>
        
        <div class="font-display-setting">
            <label>Font Display Strategy</label>
            <select name="font_display">
                <option value="swap">Swap (Recommended)</option>
                <option value="block">Block</option>
                <option value="fallback">Fallback</option>
                <option value="optional">Optional</option>
            </select>
        </div>
        
        <div class="preload-fonts">
            <label>Preload Critical Fonts</label>
            <input type="text" name="preload_fonts" placeholder="Inter, Roboto">
            <small>Comma-separated list of fonts to preload</small>
        </div>
    </div>
</div>
```


### 2. Dashboard Widgets Customization

#### UI Components

**Widgets Tab Structure:**
```html
<div class="mase-tab-content" id="widgets-tab">
    <!-- Widget Selector -->
    <div class="widget-selector">
        <button data-widget="container">All Widgets</button>
        <button data-widget="header">Widget Headers</button>
        <button data-widget="content">Widget Content</button>
        <button data-widget="dashboard_right_now">Right Now</button>
        <button data-widget="dashboard_activity">Activity</button>
        <button data-widget="dashboard_quick_press">Quick Draft</button>
        <button data-widget="dashboard_primary">WordPress News</button>
    </div>
    
    <!-- Container Styling -->
    <div class="widget-container-controls">
        <h3>Container Styling</h3>
        
        <!-- Background -->
        <div class="control-group">
            <label>Background Type</label>
            <select class="widget-style-control" data-property="bg_type">
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient</option>
                <option value="transparent">Transparent</option>
            </select>
        </div>
        
        <div class="bg-color-control" data-show-when="bg_type=solid">
            <label>Background Color</label>
            <input type="text" class="color-picker widget-style-control" data-property="bg_color">
        </div>
        
        <div class="gradient-control" data-show-when="bg_type=gradient">
            <!-- Gradient builder (reuse existing gradient builder module) -->
        </div>
        
        <!-- Border -->
        <div class="control-group">
            <label>Border Width</label>
            <div class="border-width-controls">
                <input type="number" min="0" max="10" class="widget-style-control" 
                       data-property="border_width_top" placeholder="Top">
                <input type="number" min="0" max="10" class="widget-style-control" 
                       data-property="border_width_right" placeholder="Right">
                <input type="number" min="0" max="10" class="widget-style-control" 
                       data-property="border_width_bottom" placeholder="Bottom">
                <input type="number" min="0" max="10" class="widget-style-control" 
                       data-property="border_width_left" placeholder="Left">
            </div>
        </div>
        
        <div class="control-group">
            <label>Border Color</label>
            <input type="text" class="color-picker widget-style-control" data-property="border_color">
        </div>
        
        <!-- Border Radius -->
        <div class="control-group">
            <label>Border Radius</label>
            <div class="border-radius-mode">
                <label>
                    <input type="radio" name="border_radius_mode" value="uniform" checked>
                    Uniform
                </label>
                <label>
                    <input type="radio" name="border_radius_mode" value="individual">
                    Individual Corners
                </label>
            </div>
            
            <div class="uniform-radius" data-show-when="border_radius_mode=uniform">
                <input type="range" min="0" max="50" class="widget-style-control" data-property="border_radius">
                <input type="number" min="0" max="50" class="widget-style-control-value">
                <span class="unit">px</span>
            </div>
            
            <div class="individual-radius" data-show-when="border_radius_mode=individual">
                <input type="number" min="0" max="50" placeholder="Top-Left">
                <input type="number" min="0" max="50" placeholder="Top-Right">
                <input type="number" min="0" max="50" placeholder="Bottom-Right">
                <input type="number" min="0" max="50" placeholder="Bottom-Left">
            </div>
        </div>
        
        <!-- Box Shadow -->
        <div class="control-group">
            <label>Box Shadow</label>
            <select class="widget-style-control" data-property="shadow_preset">
                <option value="none">None</option>
                <option value="subtle">Subtle</option>
                <option value="medium">Medium</option>
                <option value="strong">Strong</option>
                <option value="custom">Custom</option>
            </select>
        </div>
        
        <div class="custom-shadow" data-show-when="shadow_preset=custom">
            <!-- Custom shadow controls (reuse existing shadow controls) -->
        </div>
        
        <!-- Padding & Margin -->
        <div class="control-group">
            <label>Padding</label>
            <div class="spacing-controls">
                <input type="number" min="5" max="50" placeholder="Top">
                <input type="number" min="5" max="50" placeholder="Right">
                <input type="number" min="5" max="50" placeholder="Bottom">
                <input type="number" min="5" max="50" placeholder="Left">
            </div>
        </div>
    </div>
    
    <!-- Header Styling -->
    <div class="widget-header-controls">
        <h3>Header Styling</h3>
        
        <!-- Background -->
        <div class="control-group">
            <label>Header Background</label>
            <input type="text" class="color-picker widget-style-control" data-property="header_bg_color">
        </div>
        
        <!-- Typography -->
        <div class="control-group">
            <label>Font Size</label>
            <input type="range" min="12" max="24" class="widget-style-control" data-property="header_font_size">
            <input type="number" min="12" max="24" class="widget-style-control-value">
            <span class="unit">px</span>
        </div>
        
        <div class="control-group">
            <label>Font Weight</label>
            <select class="widget-style-control" data-property="header_font_weight">
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semi-Bold</option>
                <option value="700">Bold</option>
            </select>
        </div>
        
        <div class="control-group">
            <label>Text Color</label>
            <input type="text" class="color-picker widget-style-control" data-property="header_text_color">
        </div>
        
        <!-- Border Bottom -->
        <div class="control-group">
            <label>Border Bottom</label>
            <input type="number" min="0" max="5" class="widget-style-control" data-property="header_border_bottom">
            <input type="text" class="color-picker widget-style-control" data-property="header_border_color">
        </div>
    </div>
    
    <!-- Advanced Effects -->
    <details class="widget-advanced-effects">
        <summary>Advanced Effects</summary>
        
        <!-- Glassmorphism -->
        <div class="control-group">
            <label>
                <input type="checkbox" class="widget-style-control" data-property="glassmorphism">
                Enable Glassmorphism
            </label>
        </div>
        
        <div class="glassmorphism-controls" data-show-when="glassmorphism=true">
            <label>Blur Intensity</label>
            <input type="range" min="0" max="30" class="widget-style-control" data-property="blur_intensity">
        </div>
        
        <!-- Hover Animations -->
        <div class="control-group">
            <label>Hover Animation</label>
            <select class="widget-style-control" data-property="hover_animation">
                <option value="none">None</option>
                <option value="lift">Lift</option>
                <option value="glow">Glow</option>
                <option value="scale">Scale</option>
            </select>
        </div>
    </details>
    
    <!-- Responsive Layout -->
    <div class="widget-responsive-layout">
        <h3>Responsive Layout</h3>
        
        <div class="control-group">
            <label>
                <input type="checkbox" name="mobile_stack" checked>
                Stack widgets on mobile
            </label>
        </div>
        
        <div class="control-group">
            <label>Tablet Columns</label>
            <select name="tablet_columns">
                <option value="1">1 Column</option>
                <option value="2" selected>2 Columns</option>
            </select>
        </div>
        
        <div class="control-group">
            <label>Desktop Columns</label>
            <select name="desktop_columns">
                <option value="2">2 Columns</option>
                <option value="3" selected>3 Columns</option>
                <option value="4">4 Columns</option>
            </select>
        </div>
    </div>
</div>
```


### 3. Advanced Input Fields & Forms System

#### UI Components

**Form Controls Tab Structure:**
```html
<div class="mase-tab-content" id="form-controls-tab">
    <!-- Control Type Selector -->
    <div class="form-control-selector">
        <button data-control="text_inputs">Text Inputs</button>
        <button data-control="textareas">Textareas</button>
        <button data-control="selects">Select Dropdowns</button>
        <button data-control="checkboxes">Checkboxes</button>
        <button data-control="radios">Radio Buttons</button>
        <button data-control="file_uploads">File Uploads</button>
        <button data-control="search_fields">Search Fields</button>
    </div>
    
    <!-- Basic Styling -->
    <div class="form-control-basic-styling">
        <h3>Basic Styling</h3>
        
        <!-- Background Colors -->
        <div class="control-group">
            <label>Background Color (Normal)</label>
            <input type="text" class="color-picker form-control-style" data-property="bg_color">
        </div>
        
        <div class="control-group">
            <label>Background Color (Focus)</label>
            <input type="text" class="color-picker form-control-style" data-property="bg_color_focus">
        </div>
        
        <div class="control-group">
            <label>Background Color (Disabled)</label>
            <input type="text" class="color-picker form-control-style" data-property="bg_color_disabled">
        </div>
        
        <!-- Text Colors -->
        <div class="control-group">
            <label>Text Color</label>
            <input type="text" class="color-picker form-control-style" data-property="text_color">
        </div>
        
        <div class="control-group">
            <label>Placeholder Color</label>
            <input type="text" class="color-picker form-control-style" data-property="placeholder_color">
        </div>
        
        <!-- Border -->
        <div class="control-group">
            <label>Border Width</label>
            <div class="border-width-controls">
                <input type="number" min="0" max="5" class="form-control-style" 
                       data-property="border_width_top" placeholder="Top">
                <input type="number" min="0" max="5" class="form-control-style" 
                       data-property="border_width_right" placeholder="Right">
                <input type="number" min="0" max="5" class="form-control-style" 
                       data-property="border_width_bottom" placeholder="Bottom">
                <input type="number" min="0" max="5" class="form-control-style" 
                       data-property="border_width_left" placeholder="Left">
            </div>
        </div>
        
        <div class="control-group">
            <label>Border Color</label>
            <input type="text" class="color-picker form-control-style" data-property="border_color">
        </div>
        
        <!-- Border Radius -->
        <div class="control-group">
            <label>Border Radius</label>
            <input type="range" min="0" max="25" class="form-control-style" data-property="border_radius">
            <input type="number" min="0" max="25" class="form-control-style-value">
            <span class="unit">px</span>
        </div>
        
        <!-- Padding -->
        <div class="control-group">
            <label>Padding</label>
            <div class="padding-controls">
                <input type="number" min="5" max="25" class="form-control-style" 
                       data-property="padding_horizontal" placeholder="Horizontal">
                <input type="number" min="3" max="15" class="form-control-style" 
                       data-property="padding_vertical" placeholder="Vertical">
            </div>
        </div>
        
        <!-- Height & Width -->
        <div class="control-group">
            <label>Height</label>
            <select class="form-control-style" data-property="height_mode">
                <option value="auto">Auto</option>
                <option value="custom">Custom</option>
            </select>
            <input type="number" class="form-control-style" data-property="height_custom" 
                   data-show-when="height_mode=custom" placeholder="px">
        </div>
    </div>
    
    <!-- Typography -->
    <div class="form-control-typography">
        <h3>Typography</h3>
        
        <div class="control-group">
            <label>Font Family</label>
            <select class="form-control-style" data-property="font_family">
                <option value="system">System Font</option>
                <!-- Google Fonts options -->
            </select>
        </div>
        
        <div class="control-group">
            <label>Font Size</label>
            <input type="range" min="10" max="18" class="form-control-style" data-property="font_size">
            <input type="number" min="10" max="18" class="form-control-style-value">
            <span class="unit">px</span>
        </div>
        
        <div class="control-group">
            <label>Font Weight</label>
            <select class="form-control-style" data-property="font_weight">
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semi-Bold</option>
            </select>
        </div>
    </div>
    
    <!-- Interactive States -->
    <div class="form-control-states">
        <h3>Interactive States</h3>
        
        <!-- Focus State -->
        <div class="state-group">
            <h4>Focus State</h4>
            
            <div class="control-group">
                <label>Border Color</label>
                <input type="text" class="color-picker form-control-style" data-property="border_color_focus">
            </div>
            
            <div class="control-group">
                <label>Glow Effect</label>
                <input type="text" class="form-control-style" data-property="focus_glow" 
                       placeholder="0 0 0 2px rgba(0,124,186,0.2)">
            </div>
        </div>
        
        <!-- Hover State -->
        <div class="state-group">
            <h4>Hover State</h4>
            
            <div class="control-group">
                <label>Border Color</label>
                <input type="text" class="color-picker form-control-style" data-property="border_color_hover">
            </div>
        </div>
        
        <!-- Error State -->
        <div class="state-group">
            <h4>Error State</h4>
            
            <div class="control-group">
                <label>Border Color</label>
                <input type="text" class="color-picker form-control-style" data-property="border_color_error">
            </div>
            
            <div class="control-group">
                <label>Background Tint</label>
                <input type="text" class="color-picker form-control-style" data-property="bg_color_error">
            </div>
        </div>
        
        <!-- Disabled State -->
        <div class="state-group">
            <h4>Disabled State</h4>
            
            <div class="control-group">
                <label>Opacity</label>
                <input type="range" min="0" max="100" class="form-control-style" data-property="disabled_opacity">
                <span class="value"></span>%
            </div>
        </div>
    </div>
    
    <!-- Special Controls (shown based on selected control type) -->
    <div class="checkbox-radio-controls" data-show-for="checkboxes,radios">
        <h3>Checkbox/Radio Styling</h3>
        
        <div class="control-group">
            <label>Size</label>
            <input type="range" min="12" max="24" class="form-control-style" data-property="size">
            <input type="number" min="12" max="24" class="form-control-style-value">
            <span class="unit">px</span>
        </div>
        
        <div class="control-group">
            <label>Check Color</label>
            <input type="text" class="color-picker form-control-style" data-property="check_color">
        </div>
        
        <div class="control-group">
            <label>Check Animation</label>
            <select class="form-control-style" data-property="check_animation">
                <option value="slide">Slide</option>
                <option value="fade">Fade</option>
                <option value="bounce">Bounce</option>
            </select>
        </div>
    </div>
    
    <div class="select-controls" data-show-for="selects">
        <h3>Select Dropdown Styling</h3>
        
        <div class="control-group">
            <label>Custom Arrow Icon</label>
            <select class="form-control-style" data-property="arrow_icon">
                <option value="default">Default</option>
                <option value="chevron">Chevron</option>
                <option value="caret">Caret</option>
                <option value="custom">Custom SVG</option>
            </select>
        </div>
        
        <div class="control-group">
            <label>Dropdown Background</label>
            <input type="text" class="color-picker form-control-style" data-property="dropdown_bg_color">
        </div>
        
        <div class="control-group">
            <label>Option Hover Color</label>
            <input type="text" class="color-picker form-control-style" data-property="option_hover_color">
        </div>
    </div>
    
    <div class="file-upload-controls" data-show-for="file_uploads">
        <h3>File Upload Styling</h3>
        
        <div class="control-group">
            <label>Drag & Drop Area Background</label>
            <input type="text" class="color-picker form-control-style" data-property="dropzone_bg_color">
        </div>
        
        <div class="control-group">
            <label>Progress Bar Color</label>
            <input type="text" class="color-picker form-control-style" data-property="progress_color">
        </div>
    </div>
</div>
```


## Data Models

### Typography Settings Model

```php
array(
    'content_typography' => array(
        // Body text settings
        'body_text' => array(
            'font_family'      => 'Inter',           // string: font name or 'system'
            'google_font_url'  => '',                // string: Google Fonts URL if applicable
            'font_size'        => 16,                // int: 8-72 pixels
            'line_height'      => 1.6,               // float: 0.8-3.0
            'letter_spacing'   => 0,                 // int: -5 to 10 pixels
            'word_spacing'     => 0,                 // int: -5 to 10 pixels
            'font_weight'      => 400,               // int: 100-900 (multiples of 100)
            'font_style'       => 'normal',          // enum: 'normal', 'italic', 'oblique'
            'text_transform'   => 'none',            // enum: 'none', 'uppercase', 'lowercase', 'capitalize'
            'text_shadow'      => '',                // string: CSS text-shadow value
            'text_stroke'      => '',                // string: CSS text-stroke value
            'ligatures'        => true,              // bool: enable font ligatures
            'drop_caps'        => false,             // bool: enable drop caps for paragraphs
            'font_variant'     => 'normal',          // enum: 'normal', 'small-caps', 'oldstyle-nums'
            'text_rendering'   => 'optimizeLegibility', // enum: 'auto', 'optimizeSpeed', 'optimizeLegibility', 'geometricPrecision'
        ),
        
        // Heading hierarchy settings
        'headings' => array(
            'scale_ratio' => 1.250,                  // float: 1.125, 1.200, 1.250, 1.333, 1.414, 1.500, 1.618
            'h1' => array(
                'font_size'      => 32,              // int: calculated from scale ratio or custom
                'font_weight'    => 700,
                'line_height'    => 1.2,
                'letter_spacing' => -0.5,
                'text_transform' => 'none',
                'font_family'    => 'inherit',       // 'inherit' or custom font
            ),
            'h2' => array(/* same structure as h1 */),
            'h3' => array(/* same structure as h1 */),
            'h4' => array(/* same structure as h1 */),
            'h5' => array(/* same structure as h1 */),
            'h6' => array(/* same structure as h1 */),
        ),
        
        // Area-specific settings (comments, widgets, meta, tables, notices)
        'comments' => array(/* same structure as body_text */),
        'widgets'  => array(/* same structure as body_text */),
        'meta'     => array(/* same structure as body_text */),
        'tables'   => array(/* same structure as body_text */),
        'notices'  => array(/* same structure as body_text */),
        
        // Google Fonts configuration
        'google_fonts_enabled' => true,              // bool: enable Google Fonts integration
        'google_fonts_list'    => array('Inter', 'Roboto'), // array: list of Google Fonts to load
        'font_display'         => 'swap',            // enum: 'auto', 'block', 'swap', 'fallback', 'optional'
        'preload_fonts'        => array('Inter'),    // array: fonts to preload for performance
        'font_subset'          => 'latin-ext',       // string: font subset (latin, latin-ext, cyrillic, etc.)
    )
)
```

### Dashboard Widgets Settings Model

```php
array(
    'dashboard_widgets' => array(
        // Global container settings
        'container' => array(
            'bg_type'            => 'solid',         // enum: 'solid', 'gradient', 'transparent'
            'bg_color'           => '#ffffff',       // string: hex color
            'gradient_type'      => 'linear',        // enum: 'linear', 'radial'
            'gradient_angle'     => 90,              // int: 0-360 degrees
            'gradient_colors'    => array(           // array: gradient color stops
                array('color' => '#ffffff', 'position' => 0),
                array('color' => '#f0f0f0', 'position' => 100),
            ),
            'border_width_top'    => 1,              // int: 0-10 pixels
            'border_width_right'  => 1,
            'border_width_bottom' => 1,
            'border_width_left'   => 1,
            'border_style'        => 'solid',        // enum: 'solid', 'dashed', 'dotted', 'double'
            'border_color'        => '#cccccc',      // string: hex color
            'border_radius_mode'  => 'uniform',      // enum: 'uniform', 'individual'
            'border_radius'       => 4,              // int: 0-50 pixels (uniform mode)
            'border_radius_tl'    => 4,              // int: 0-50 pixels (individual mode)
            'border_radius_tr'    => 4,
            'border_radius_br'    => 4,
            'border_radius_bl'    => 4,
            'shadow_preset'       => 'subtle',       // enum: 'none', 'subtle', 'medium', 'strong', 'custom'
            'shadow_h_offset'     => 0,              // int: -50 to 50 pixels (custom mode)
            'shadow_v_offset'     => 2,
            'shadow_blur'         => 4,
            'shadow_spread'       => 0,
            'shadow_color'        => 'rgba(0,0,0,0.1)', // string: rgba color
            'padding_top'         => 12,             // int: 5-50 pixels
            'padding_right'       => 12,
            'padding_bottom'      => 12,
            'padding_left'        => 12,
            'margin_top'          => 0,              // int: 0-30 pixels
            'margin_right'        => 0,
            'margin_bottom'      => 20,
            'margin_left'         => 0,
        ),
        
        // Header settings
        'header' => array(
            'bg_color'           => '#f5f5f5',       // string: hex color
            'font_size'          => 14,              // int: 12-24 pixels
            'font_weight'        => 600,             // int: 400-700
            'text_color'         => '#23282d',       // string: hex color
            'text_transform'     => 'none',          // enum: 'none', 'uppercase', 'lowercase', 'capitalize'
            'border_bottom_width' => 1,              // int: 0-5 pixels
            'border_bottom_color' => '#e0e0e0',      // string: hex color
            'icon_color'         => 'inherit',       // string: 'inherit' or hex color
            'icon_size'          => 16,              // int: 12-24 pixels
            'height'             => 'auto',          // string: 'auto' or custom px value
        ),
        
        // Content area settings
        'content' => array(
            'bg_color'           => 'transparent',   // string: hex color or 'transparent'
            'font_size'          => 13,              // int: 10-18 pixels
            'text_color'         => '#555555',       // string: hex color
            'link_color'         => '#0073aa',       // string: hex color
            'link_hover_color'   => '#005177',       // string: hex color
            'list_style'         => 'disc',          // enum: 'disc', 'circle', 'square', 'none'
            'list_spacing'       => 8,               // int: 0-20 pixels
        ),
        
        // Specific widget overrides
        'specific_widgets' => array(
            'dashboard_right_now' => array(
                // Override any container/header/content settings
                'container' => array(/* overrides */),
                'header'    => array(/* overrides */),
                'content'   => array(/* overrides */),
            ),
            'dashboard_activity' => array(/* same structure */),
            'dashboard_quick_press' => array(/* same structure */),
            'dashboard_primary' => array(/* same structure */),
        ),
        
        // Advanced effects
        'glassmorphism'      => false,               // bool: enable glassmorphism effect
        'blur_intensity'     => 10,                  // int: 0-30 pixels
        'hover_animation'    => 'none',              // enum: 'none', 'lift', 'glow', 'scale'
        'hover_lift_distance' => 4,                  // int: 0-10 pixels
        'hover_scale_factor' => 1.02,                // float: 1.0-1.1
        
        // Responsive layout
        'responsive' => array(
            'mobile_stack'       => true,            // bool: stack widgets on mobile
            'tablet_columns'     => 2,               // int: 1-2
            'desktop_columns'    => 3,               // int: 2-4
        ),
    )
)
```


### Form Controls Settings Model

```php
array(
    'form_controls' => array(
        // Text inputs settings
        'text_inputs' => array(
            'bg_color'           => '#ffffff',       // string: hex color
            'bg_color_focus'     => '#ffffff',       // string: hex color
            'bg_color_disabled'  => '#f7f7f7',       // string: hex color
            'text_color'         => '#32373c',       // string: hex color
            'placeholder_color'  => '#7e8993',       // string: hex color
            'border_width_top'   => 1,               // int: 0-5 pixels
            'border_width_right' => 1,
            'border_width_bottom' => 1,
            'border_width_left'  => 1,
            'border_color'       => '#8c8f94',       // string: hex color
            'border_color_focus' => '#007cba',       // string: hex color
            'border_color_hover' => '#6c7781',       // string: hex color
            'border_color_error' => '#dc3232',       // string: hex color
            'border_radius'      => 4,               // int: 0-25 pixels
            'padding_horizontal' => 12,              // int: 5-25 pixels
            'padding_vertical'   => 8,               // int: 3-15 pixels
            'height_mode'        => 'auto',          // enum: 'auto', 'custom'
            'height_custom'      => 40,              // int: 20-60 pixels
            'font_family'        => 'system',        // string: font name or 'system'
            'font_size'          => 14,              // int: 10-18 pixels
            'font_weight'        => 400,             // int: 400-600
            'focus_glow'         => '0 0 0 2px rgba(0,124,186,0.2)', // string: CSS box-shadow
            'disabled_opacity'   => 60,              // int: 0-100 percent
        ),
        
        // Textareas settings (same structure as text_inputs plus:)
        'textareas' => array(
            // All text_inputs properties plus:
            'min_height'         => 100,             // int: 50-300 pixels
            'resize'             => 'vertical',      // enum: 'none', 'both', 'horizontal', 'vertical'
            'line_height'        => 1.6,             // float: 1.0-2.0
        ),
        
        // Select dropdowns settings
        'selects' => array(
            // All text_inputs properties plus:
            'arrow_icon'         => 'default',       // enum: 'default', 'chevron', 'caret', 'custom'
            'arrow_custom_svg'   => '',              // string: custom SVG code
            'dropdown_bg_color'  => '#ffffff',       // string: hex color
            'dropdown_border_color' => '#8c8f94',    // string: hex color
            'option_hover_color' => '#f0f0f0',       // string: hex color
            'option_selected_color' => '#007cba',    // string: hex color
        ),
        
        // Checkboxes settings
        'checkboxes' => array(
            'size'               => 16,              // int: 12-24 pixels
            'bg_color'           => '#ffffff',       // string: hex color
            'bg_color_checked'   => '#007cba',       // string: hex color
            'border_color'       => '#8c8f94',       // string: hex color
            'border_color_checked' => '#007cba',     // string: hex color
            'check_color'        => '#ffffff',       // string: hex color (checkmark color)
            'border_radius'      => 2,               // int: 0-8 pixels
            'check_animation'    => 'slide',         // enum: 'slide', 'fade', 'bounce', 'none'
            'custom_icon'        => false,           // bool: use custom checkmark icon
            'custom_icon_svg'    => '',              // string: custom SVG code
        ),
        
        // Radio buttons settings (similar to checkboxes)
        'radios' => array(
            'size'               => 16,              // int: 12-24 pixels
            'bg_color'           => '#ffffff',       // string: hex color
            'bg_color_checked'   => '#007cba',       // string: hex color
            'border_color'       => '#8c8f94',       // string: hex color
            'border_color_checked' => '#007cba',     // string: hex color
            'dot_color'          => '#ffffff',       // string: hex color (radio dot color)
            'dot_size'           => 8,               // int: 4-16 pixels
            'check_animation'    => 'fade',          // enum: 'slide', 'fade', 'bounce', 'none'
        ),
        
        // File uploads settings
        'file_uploads' => array(
            'dropzone_bg_color'  => '#f9f9f9',       // string: hex color
            'dropzone_border_color' => '#8c8f94',    // string: hex color
            'dropzone_border_style' => 'dashed',     // enum: 'solid', 'dashed', 'dotted'
            'dropzone_hover_bg_color' => '#f0f0f0',  // string: hex color
            'progress_color'     => '#007cba',       // string: hex color
            'progress_bg_color'  => '#e0e0e0',       // string: hex color
            'file_type_icons'    => true,            // bool: show file type icons
            'button_style'       => 'primary',       // enum: 'primary', 'secondary', 'custom'
        ),
        
        // Search fields settings (extends text_inputs)
        'search_fields' => array(
            // All text_inputs properties plus:
            'icon_position'      => 'left',          // enum: 'left', 'right', 'none'
            'icon_color'         => '#7e8993',       // string: hex color
            'clear_button'       => true,            // bool: show clear button
            'clear_button_color' => '#7e8993',       // string: hex color
        ),
    )
)
```

## Error Handling

### Validation Errors

**Typography Validation Errors:**
- Font size out of range (8-72px)
- Line height out of range (0.8-3.0)
- Letter spacing out of range (-5px to 10px)
- Font weight invalid (must be 100-900, multiples of 100)
- Invalid text transform value
- Invalid Google Font name
- Scale ratio out of range

**Widget Validation Errors:**
- Border width out of range (0-10px)
- Border radius out of range (0-50px)
- Header font size out of range (12-24px)
- Invalid responsive column count (1-4)
- Invalid shadow preset value
- Invalid hover animation value

**Form Control Validation Errors:**
- Border width out of range (0-5px)
- Border radius out of range (0-25px)
- Font size out of range (10-18px)
- Checkbox/radio size out of range (12-24px)
- Invalid color value (must be valid hex)
- Invalid animation value

### Error Response Format

```php
// Validation error response
return new WP_Error(
    'validation_failed',
    'Settings validation failed',
    array(
        'validation_errors' => array(
            'content_typography.body_text.font_size' => 'Font size must be between 8 and 72 pixels',
            'dashboard_widgets.container.border_width_top' => 'Border width must be between 0 and 10 pixels',
        ),
        'error_details' => 'Multiple validation errors occurred. Please check your input values.',
    )
);
```

### JavaScript Error Handling

```javascript
// AJAX error handler
$.ajax({
    // ... request config
    error: function(xhr, status, error) {
        var message = 'An error occurred. Please try again.';
        
        // Parse validation errors from response
        try {
            var response = JSON.parse(xhr.responseText);
            if (response && response.data && response.data.validation_errors) {
                // Display validation errors to user
                MASE.showValidationErrors(response.data.validation_errors);
                return;
            }
        } catch (e) {
            // JSON parse failed, use generic message
        }
        
        // Handle HTTP status codes
        if (xhr.status === 403) {
            message = 'Permission denied. You do not have access to perform this action.';
        } else if (xhr.status === 500) {
            message = 'Server error. Please try again later.';
        }
        
        MASE.showNotice('error', message);
    }
});
```


## Testing Strategy

### Unit Tests

**PHP Unit Tests:**
1. Test `MASE_Settings::validate_content_typography()` with valid and invalid inputs
2. Test `MASE_Settings::validate_dashboard_widgets()` with valid and invalid inputs
3. Test `MASE_Settings::validate_form_controls()` with valid and invalid inputs
4. Test `MASE_CSS_Generator::generate_content_typography_css()` output
5. Test `MASE_CSS_Generator::generate_dashboard_widgets_css()` output
6. Test `MASE_CSS_Generator::generate_form_controls_css()` output
7. Test Google Fonts URL generation and sanitization
8. Test heading hierarchy scale ratio calculations
9. Test responsive layout CSS generation
10. Test color contrast validation for accessibility

**JavaScript Unit Tests:**
1. Test typography preview CSS generation
2. Test widget preview CSS generation
3. Test form control preview CSS generation
4. Test Google Font loading mechanism
5. Test debounce functionality for live preview
6. Test validation error display
7. Test state management for control types
8. Test conditional field visibility logic

### Integration Tests

**Settings Save Integration:**
1. Test complete settings save flow with typography settings
2. Test complete settings save flow with widget settings
3. Test complete settings save flow with form control settings
4. Test validation error handling and WP_Error return
5. Test cache invalidation after settings save
6. Test settings merge with existing settings (no data loss)

**Live Preview Integration:**
1. Test typography changes reflect in real-time
2. Test widget changes reflect in real-time
3. Test form control changes reflect in real-time
4. Test debounce prevents excessive updates
5. Test preview CSS injection and removal
6. Test preview state persistence during tab switching

**CSS Generation Integration:**
1. Test CSS generation with all three features enabled
2. Test CSS generation performance (< 100ms target)
3. Test CSS specificity overrides WordPress defaults
4. Test responsive CSS media queries
5. Test dark mode compatibility
6. Test cache hit/miss scenarios

### Accessibility Tests

**WCAG 2.1 AA Compliance:**
1. Test color contrast ratios for all text/background combinations
2. Test keyboard navigation for all controls
3. Test screen reader announcements for live preview changes
4. Test focus indicators visibility
5. Test touch target sizes (min 44px)
6. Test reduced motion preferences
7. Test ARIA labels and attributes
8. Test form validation error announcements

### Browser Compatibility Tests

**Cross-Browser Testing:**
1. Test in Chrome (latest)
2. Test in Firefox (latest)
3. Test in Safari (latest)
4. Test in Edge (latest)
5. Test Google Fonts loading across browsers
6. Test CSS custom properties support
7. Test backdrop-filter support (glassmorphism)
8. Test CSS Grid support (responsive layouts)

### Performance Tests

**Load Time Testing:**
1. Test initial page load time with features enabled
2. Test Google Fonts loading impact
3. Test CSS generation time (target < 100ms)
4. Test live preview update time (target < 50ms)
5. Test memory usage with multiple preview updates
6. Test cache effectiveness

**Optimization Validation:**
1. Verify font-display: swap is applied
2. Verify critical fonts are preloaded
3. Verify font subsetting is working
4. Verify CSS is minified in production
5. Verify debounce is preventing excessive updates
6. Verify conditional asset loading

### Manual Testing Checklist

**Typography System:**
- [ ] Change font family and verify preview
- [ ] Adjust font size slider and verify preview
- [ ] Change line height and verify preview
- [ ] Test heading hierarchy with different scale ratios
- [ ] Enable Google Fonts and verify loading
- [ ] Test font preloading
- [ ] Save settings and verify persistence
- [ ] Test with different admin areas (comments, widgets, etc.)

**Dashboard Widgets:**
- [ ] Change widget container background and verify preview
- [ ] Adjust border radius and verify preview
- [ ] Apply box shadow presets and verify preview
- [ ] Enable glassmorphism and verify effect
- [ ] Test hover animations
- [ ] Change responsive layout columns
- [ ] Test specific widget overrides
- [ ] Save settings and verify persistence

**Form Controls:**
- [ ] Change text input background and verify preview
- [ ] Adjust border properties and verify preview
- [ ] Test focus state styling
- [ ] Test error state styling
- [ ] Customize checkbox/radio appearance
- [ ] Test select dropdown custom arrow
- [ ] Test file upload drag & drop styling
- [ ] Save settings and verify persistence

**Integration Testing:**
- [ ] Test all three features together
- [ ] Verify no conflicts between features
- [ ] Test with existing MASE features (palettes, templates)
- [ ] Test with dark mode enabled
- [ ] Test settings export/import
- [ ] Test backup/restore functionality

## Performance Considerations

### Initial Load Performance

**Optimization Strategies:**
1. **Conditional Asset Loading**: Only load assets on MASE settings page
2. **Lazy Loading**: Load Google Fonts only when typography tab is active
3. **Font Subsetting**: Load only required character sets (latin-ext for Polish)
4. **Critical Font Preloading**: Preload fonts used above the fold
5. **CSS Minification**: Minify generated CSS in production
6. **Cache Strategy**: Use mode-specific caching (light/dark)

**Performance Targets:**
- Initial page load: < 2 seconds
- CSS generation: < 100ms
- Live preview update: < 50ms
- Google Font loading: < 500ms (with font-display: swap)

### Runtime Performance

**Debouncing Strategy:**
```javascript
// Debounce live preview updates to prevent excessive DOM manipulation
var debounceTimer;
function debounce(callback, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, delay || 300);
}

// Usage
$('.typography-property').on('input', function() {
    debounce(function() {
        MASE.livePreview.updateTypographyPreview();
    }, 300);
});
```

**CSS Injection Optimization:**
```javascript
// Reuse style element instead of creating new ones
var styleElements = {};

function injectCSS(id, css) {
    if (!styleElements[id]) {
        styleElements[id] = document.createElement('style');
        styleElements[id].id = 'mase-preview-' + id;
        document.head.appendChild(styleElements[id]);
    }
    styleElements[id].textContent = css;
}
```

### Memory Management

**Cleanup Strategy:**
1. Remove event listeners when tab is switched
2. Clear debounce timers on page unload
3. Remove injected style elements when preview is disabled
4. Limit Google Fonts cache to 10 most recent fonts
5. Clear validation error messages after 5 seconds

## Security Considerations

### Input Sanitization

**PHP Sanitization:**
```php
// Sanitize typography settings
$typography['body_text']['font_family'] = sanitize_text_field( $typography['body_text']['font_family'] );
$typography['body_text']['font_size'] = absint( $typography['body_text']['font_size'] );
$typography['body_text']['line_height'] = floatval( $typography['body_text']['line_height'] );
$typography['body_text']['text_color'] = sanitize_hex_color( $typography['body_text']['text_color'] );

// Sanitize Google Fonts list
if ( is_array( $typography['google_fonts_list'] ) ) {
    $typography['google_fonts_list'] = array_map( 'sanitize_text_field', $typography['google_fonts_list'] );
}

// Sanitize custom CSS (if allowed)
if ( current_user_can( 'unfiltered_html' ) ) {
    $typography['custom_css'] = wp_kses_post( $typography['custom_css'] );
} else {
    $typography['custom_css'] = ''; // Strip all HTML for non-admin users
}
```

**JavaScript Sanitization:**
```javascript
// Escape user input before injecting into CSS
function escapeCSS(value) {
    return value.replace(/[<>"']/g, function(match) {
        return '\\' + match.charCodeAt(0).toString(16) + ' ';
    });
}

// Usage
var fontFamily = escapeCSS($('.typography-font-family').val());
var css = 'body { font-family: ' + fontFamily + '; }';
```

### CSRF Protection

**Nonce Verification:**
```php
// All AJAX handlers must verify nonce
public function handle_ajax_save_typography() {
    check_ajax_referer( 'mase_save_settings', 'nonce' );
    
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( array( 'message' => 'Unauthorized' ), 403 );
    }
    
    // Process request...
}
```

### XSS Prevention

**Output Escaping:**
```php
// Escape all output in admin templates
<input type="text" 
       value="<?php echo esc_attr( $settings['content_typography']['body_text']['font_family'] ); ?>"
       class="typography-font-family">

<div class="preview-text">
    <?php echo esc_html( $settings['content_typography']['body_text']['sample_text'] ); ?>
</div>
```

### SQL Injection Prevention

**Prepared Statements:**
```php
// Use WordPress database abstraction (already handles escaping)
$settings = get_option( 'mase_settings', array() );
update_option( 'mase_settings', $validated_settings );

// Never use direct SQL queries for settings
// BAD: $wpdb->query( "UPDATE wp_options SET option_value = '$settings' WHERE option_name = 'mase_settings'" );
```

## Deployment Checklist

### Pre-Deployment

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Accessibility tests passing (WCAG 2.1 AA)
- [ ] Browser compatibility tests passing
- [ ] Performance tests meeting targets
- [ ] Security audit completed
- [ ] Code review completed
- [ ] Documentation updated

### Deployment Steps

1. **Backup Current Settings**: Create automatic backup before deployment
2. **Deploy Code**: Upload new files to production
3. **Run Migrations**: Execute any database migrations (if needed)
4. **Clear Caches**: Invalidate all MASE caches
5. **Verify Settings**: Confirm existing settings are preserved
6. **Test Core Features**: Verify palettes, templates, and live preview still work
7. **Test New Features**: Verify typography, widgets, and form controls work
8. **Monitor Errors**: Check error logs for any issues

### Post-Deployment

- [ ] Verify no JavaScript errors in console
- [ ] Verify no PHP errors in logs
- [ ] Verify settings save correctly
- [ ] Verify live preview works
- [ ] Verify Google Fonts load correctly
- [ ] Verify responsive layouts work
- [ ] Verify accessibility features work
- [ ] Monitor performance metrics

### Rollback Plan

If issues are detected:
1. Restore previous code version
2. Restore settings backup
3. Clear caches
4. Verify rollback successful
5. Investigate and fix issues
6. Re-deploy when ready
