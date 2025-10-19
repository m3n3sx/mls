# Design Document

## Overview

The MASE v1.2.0 upgrade transforms the plugin from a basic admin customizer into a comprehensive, enterprise-grade styling system. The design integrates features from three previous implementations (WOOW, KURWA, MAS5) while maintaining the existing architecture's strengths: PSR-4 autoloading, dependency injection, and caching.

The upgrade introduces a modular frontend architecture with 8 tabbed sections, a real-time preview system, and comprehensive AJAX communication. The backend extends the existing settings schema, enhances the CSS generator with visual effects support, and adds migration capabilities for seamless upgrades.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     WordPress Admin                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              MASE Admin Interface                      │  │
│  │  ┌─────────┬─────────┬─────────┬─────────┬─────────┐  │  │
│  │  │ General │Admin Bar│  Menu   │ Content │Typography│  │  │
│  │  └─────────┴─────────┴─────────┴─────────┴─────────┘  │  │
│  │  ┌─────────┬─────────┬─────────┐                      │  │
│  │  │ Effects │Templates│Advanced │                      │  │
│  │  └─────────┴─────────┴─────────┘                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ▲                                  │
│                           │ AJAX                             │
│                           ▼                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              MASE Backend (PHP)                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │MASE_Settings │  │MASE_CSS_Gen  │  │MASE_Cache   │  │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │MASE_Admin    │  │MASE_Migration│  │MASE_Mobile  │  │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ▲                                  │
│                           │                                  │
│                           ▼                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              WordPress Options API                     │  │
│  │  • mase_settings (main settings)                       │  │
│  │  • mase_version (version tracking)                     │  │
│  │  • mase_settings_backup_110 (migration backup)         │  │
│  │  • mase_css_cache (transient, 24h TTL)                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Action (e.g., Apply Palette)
    │
    ▼
JavaScript Event Handler (mase-admin.js)
    │
    ├─► Live Preview? ──Yes──► Generate CSS in JS ──► Apply to DOM
    │                                                      │
    └─► Save? ──Yes──► AJAX Request ──────────────────────┤
                           │                               │
                           ▼                               │
                    MASE_Admin::ajax_apply_palette()      │
                           │                               │
                           ├─► Verify Nonce               │
                           ├─► Check Capabilities         │
                           ├─► Validate Input             │
                           │                               │
                           ▼                               │
                    MASE_Settings::apply_palette()        │
                           │                               │
                           ├─► Update Settings             │
                           ├─► Invalidate Cache           │
                           │                               │
                           ▼                               │
                    MASE_CSS_Generator::generate()        │
                           │                               │
                           ├─► Generate CSS                │
                           ├─► Cache Result                │
                           │                               │
                           ▼                               │
                    JSON Response ──────────────────────────┤
                           │                               │
                           ▼                               │
                    JavaScript Success Handler            │
                           │                               │
                           ├─► Show Success Notice         │
                           ├─► Update UI State             │
                           └─► Refresh Preview ◄───────────┘
```

## Components and Interfaces

### 1. MASE_Settings (Extended)

**Purpose:** Manages all plugin settings with validation, sanitization, and helper methods.

**Key Methods:**

```php
class MASE_Settings {
    // Existing methods
    public function get_option(): array
    public function update_option(array $settings): bool
    public function get_defaults(): array
    public function validate(array $settings): array
    public function reset_to_defaults(): bool
    
    // NEW: Palette management
    public function get_palette(string $palette_id): array
    public function get_all_palettes(): array
    public function apply_palette(string $palette_id): bool
    public function save_custom_palette(string $name, array $colors): bool
    public function delete_custom_palette(string $palette_id): bool
    
    // NEW: Template management
    public function get_template(string $template_id): array
    public function get_all_templates(): array
    public function apply_template(string $template_id): bool
    public function save_custom_template(string $name, array $settings): bool
    public function delete_custom_template(string $template_id): bool
    
    // NEW: Auto palette switching
    public function auto_switch_palette(): void
    public function get_palette_for_time(int $hour): string
}
```

**Settings Schema Extensions:**

```php
[
    // Existing settings...
    'admin_bar' => [...],
    'admin_menu' => [...],
    'performance' => [...],
    
    // NEW: Color Palettes
    'palettes' => [
        'current' => 'professional-blue',
        'custom' => [] // Array of user-created palettes
    ],
    
    // NEW: Templates
    'templates' => [
        'current' => 'default',
        'custom' => [] // Array of user-created templates
    ],
    
    // NEW: Extended Typography
    'typography' => [
        'admin_bar' => [
            'font_size' => 13,
            'font_weight' => 400,
            'line_height' => 1.5,
            'letter_spacing' => 0,
            'text_transform' => 'none',
            'font_family' => 'system'
        ],
        'admin_menu' => [...],
        'content' => [...],
        'google_fonts' => 'Inter:300,400,500,600,700',
        'enabled' => true
    ],
    
    // NEW: Visual Effects
    'visual_effects' => [
        'admin_bar' => [
            'glassmorphism' => true,
            'blur_intensity' => 20,
            'floating' => true,
            'floating_margin' => 8,
            'border_radius' => 12,
            'shadow' => 'subtle'
        ],
        'admin_menu' => [...],
        'animations_enabled' => true,
        'microanimations_enabled' => true,
        'particle_system' => false,
        'sound_effects' => false,
        '3d_effects' => false
    ],
    
    // NEW: Effects Settings
    'effects' => [
        'page_animations' => true,
        'animation_speed' => 300,
        'hover_effects' => true,
        'focus_mode' => false,
        'performance_mode' => false
    ],
    
    // NEW: Advanced
    'advanced' => [
        'custom_css' => '',
        'custom_js' => '',
        'login_page_enabled' => true,
        'auto_palette_switch' => false,
        'auto_palette_times' => [
            'morning' => 'professional-blue',
            'afternoon' => 'energetic-green',
            'evening' => 'sunset',
            'night' => 'dark-elegance'
        ],
        'backup_enabled' => true,
        'backup_before_changes' => true
    ],
    
    // NEW: Mobile
    'mobile' => [
        'optimized' => true,
        'touch_friendly' => true,
        'compact_mode' => false,
        'reduced_effects' => true
    ],
    
    // NEW: Accessibility
    'accessibility' => [
        'high_contrast' => false,
        'reduced_motion' => false,
        'focus_indicators' => true,
        'keyboard_navigation' => true
    ],
    
    // NEW: Keyboard Shortcuts
    'keyboard_shortcuts' => [
        'enabled' => true,
        'palette_switch' => true,
        'theme_toggle' => true,
        'focus_mode' => true,
        'performance_mode' => true
    ]
]
```

### 2. MASE_CSS_Generator (Extended)

**Purpose:** Generates CSS from settings, including new visual effects and typography.

**Key Methods:**

```php
class MASE_CSS_Generator {
    // Existing methods
    public function generate(array $settings): string
    public function minify(string $css): string
    
    // NEW: Component generators
    private function generate_palette_css(array $settings): string
    private function generate_typography_css(array $settings): string
    private function generate_glassmorphism_css(array $settings): string
    private function generate_floating_elements_css(array $settings): string
    private function generate_shadows_css(array $settings): string
    private function generate_animations_css(array $settings): string
    private function generate_microanimations_css(array $settings): string
    private function generate_particle_css(array $settings): string
    private function generate_3d_css(array $settings): string
    private function generate_mobile_css(array $settings): string
    private function generate_custom_css(array $settings): string
}
```

**CSS Generation Strategy:**

1. **CSS Variables First:** Generate CSS custom properties for all colors, spacing, and effects
2. **Component-Based:** Generate CSS for each component (admin bar, menu, content) separately
3. **Conditional Generation:** Only generate CSS for enabled features
4. **Mobile-First:** Base styles for mobile, then media queries for larger screens
5. **Performance:** Use efficient selectors, limit nesting to 3 levels

**Example Output:**

```css
/* CSS Variables */
:root {
    --mase-primary: #4A90E2;
    --mase-secondary: #50C9C3;
    --mase-accent: #7B68EE;
    --mase-background: #F8FAFC;
    --mase-blur: 20px;
    --mase-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Admin Bar with Glassmorphism */
body.wp-admin #wpadminbar {
    backdrop-filter: blur(var(--mase-blur));
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: var(--mase-shadow);
}

/* Floating Effect */
body.wp-admin #wpadminbar {
    margin-top: 8px;
    border-radius: 12px;
}
```

### 3. MASE_Admin (Extended)

**Purpose:** Handles admin UI, asset enqueuing, and AJAX endpoints.

**New AJAX Endpoints:**

```php
class MASE_Admin {
    // NEW: Palette endpoints
    public function ajax_apply_palette(): void
    public function ajax_save_custom_palette(): void
    public function ajax_delete_custom_palette(): void
    
    // NEW: Template endpoints
    public function ajax_apply_template(): void
    public function ajax_save_custom_template(): void
    public function ajax_delete_custom_template(): void
    
    // NEW: Utility endpoints
    public function ajax_generate_preview(): void
    public function ajax_auto_palette_switch(): void
    public function ajax_create_backup(): void
    public function ajax_restore_backup(): void
    public function ajax_import_settings(): void
    public function ajax_export_settings(): void
}
```

**Asset Enqueuing Strategy:**

```php
public function enqueue_assets($hook) {
    if ('toplevel_page_mase-settings' !== $hook) {
        return;
    }
    
    // CSS files
    wp_enqueue_style('mase-admin', ..., ['wp-color-picker']);
    wp_enqueue_style('mase-palettes', ...);
    wp_enqueue_style('mase-templates', ...);
    
    // JavaScript files
    wp_enqueue_script('mase-admin', ..., ['jquery', 'wp-color-picker']);
    
    // Localize script with data
    wp_localize_script('mase-admin', 'maseAdmin', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('mase_save_settings'),
        'palettes' => $this->get_palettes_data(),
        'templates' => $this->get_templates_data(),
        'strings' => [
            'saving' => __('Saving...', 'mase'),
            'saved' => __('Settings saved!', 'mase'),
            // ... more strings
        ]
    ]);
}
```

### 4. MASE_Migration (New)

**Purpose:** Handles version upgrades and settings migration.

**Interface:**

```php
class MASE_Migration {
    const OLD_VERSION = '1.1.0';
    const NEW_VERSION = '1.2.0';
    const VERSION_OPTION = 'mase_version';
    
    public static function maybe_migrate(): void
    private static function migrate(): void
    private static function transform_settings(array $old): array
    private static function backup_old_settings(array $old): void
    private static function log_migration(string $message): void
}
```

**Migration Strategy:**

1. **Version Detection:** Check current version from WordPress options
2. **Backup:** Store old settings in separate option before migration
3. **Transform:** Map old settings to new structure, add defaults for new fields
4. **Validate:** Ensure transformed settings pass validation
5. **Update:** Save new settings and update version number
6. **Log:** Record migration in error_log for debugging

### 5. MASE_Mobile_Optimizer (New)

**Purpose:** Detects mobile devices and optimizes settings accordingly.

**Interface:**

```php
class MASE_Mobile_Optimizer {
    public function is_mobile(): bool
    public function is_low_power_device(): bool
    public function get_optimized_settings(array $settings): array
    public function should_reduce_effects(): bool
    public function get_device_capabilities(): array
}
```

**Optimization Strategy:**

- Detect mobile via user agent and screen size
- Disable expensive effects (blur, shadows, animations) on low-power devices
- Increase touch target sizes to 44px minimum
- Reduce spacing and padding for compact layouts
- Use simpler CSS (no transforms, no filters)

### 6. Frontend JavaScript Architecture

**File Structure:**

```
assets/js/
├── mase-admin.js (main entry point, ~2000 lines)
├── modules/
│   ├── palette-manager.js
│   ├── template-manager.js
│   ├── live-preview.js
│   ├── import-export.js
│   └── keyboard-shortcuts.js
└── utils/
    ├── ajax.js
    ├── validation.js
    └── dom-helpers.js
```

**Main JavaScript Structure:**

```javascript
(function($) {
    'use strict';
    
    var MASE = {
        // Configuration
        config: {
            ajaxUrl: maseAdmin.ajaxUrl,
            nonce: maseAdmin.nonce,
            debounceDelay: 300
        },
        
        // State management
        state: {
            livePreviewEnabled: false,
            currentPalette: null,
            currentTemplate: null,
            isDirty: false
        },
        
        // Modules
        paletteManager: {...},
        templateManager: {...},
        livePreview: {...},
        importExport: {...},
        keyboardShortcuts: {...},
        
        // Core methods
        init: function() {...},
        bindEvents: function() {...},
        saveSettings: function() {...},
        showNotice: function(message, type) {...},
        debounce: function(func, wait) {...}
    };
    
    // Initialize on document ready
    $(document).ready(function() {
        MASE.init();
    });
    
})(jQuery);
```

**Live Preview Implementation:**

```javascript
livePreview: {
    enabled: false,
    
    toggle: function() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            this.bindInputs();
        } else {
            this.unbindInputs();
        }
    },
    
    bindInputs: function() {
        var self = this;
        $('.mase-color-picker').on('change', MASE.debounce(function() {
            self.updatePreview();
        }, MASE.config.debounceDelay));
        
        $('.mase-slider').on('input', MASE.debounce(function() {
            self.updatePreview();
        }, MASE.config.debounceDelay));
    },
    
    updatePreview: function() {
        var settings = this.collectSettings();
        var css = this.generateCSS(settings);
        this.applyCSS(css);
    },
    
    generateCSS: function(settings) {
        // Mirror PHP CSS generation logic in JavaScript
        var css = '';
        css += this.generatePaletteCSS(settings);
        css += this.generateTypographyCSS(settings);
        // ... more generators
        return css;
    },
    
    applyCSS: function(css) {
        var $style = $('#mase-live-preview-css');
        if ($style.length === 0) {
            $style = $('<style id="mase-live-preview-css"></style>');
            $('head').append($style);
        }
        $style.text(css);
    }
}
```

## Data Models

### Palette Data Model

```php
[
    'id' => 'professional-blue',
    'name' => 'Professional Blue',
    'colors' => [
        'primary' => '#4A90E2',
        'secondary' => '#50C9C3',
        'accent' => '#7B68EE',
        'background' => '#F8FAFC',
        'text' => '#1E293B',
        'text_secondary' => '#64748B'
    ],
    'is_custom' => false,
    'created_at' => null
]
```

### Template Data Model

```php
[
    'id' => 'modern-minimal',
    'name' => 'Modern Minimal',
    'description' => 'Clean and minimal design with subtle effects',
    'thumbnail' => 'path/to/thumbnail.png',
    'settings' => [
        'palettes' => ['current' => 'professional-blue'],
        'typography' => [...],
        'visual_effects' => [...],
        // ... complete settings snapshot
    ],
    'is_custom' => false,
    'created_at' => null
]
```

### Backup Data Model

```php
[
    'id' => 'backup_20250117_143022',
    'timestamp' => 1705501822,
    'version' => '1.2.0',
    'settings' => [...], // Complete settings snapshot
    'trigger' => 'manual' // or 'auto', 'template_apply', 'import'
]
```

## Error Handling

### PHP Error Handling Strategy

```php
try {
    // Operation
    $result = $this->settings->apply_palette($palette_id);
    
    if (!$result) {
        throw new Exception('Failed to apply palette');
    }
    
    wp_send_json_success([
        'message' => __('Palette applied successfully!', 'mase')
    ]);
    
} catch (Exception $e) {
    // Log error
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('MASE Error: ' . $e->getMessage());
    }
    
    // Return user-friendly error
    wp_send_json_error([
        'message' => __('Failed to apply palette. Please try again.', 'mase')
    ]);
}
```

### JavaScript Error Handling Strategy

```javascript
saveSettings: function() {
    var self = this;
    var data = this.collectFormData();
    
    $.ajax({
        url: this.config.ajaxUrl,
        type: 'POST',
        data: data,
        beforeSend: function() {
            self.showNotice('Saving...', 'info');
            self.disableSaveButton();
        },
        success: function(response) {
            if (response.success) {
                self.showNotice(response.data.message, 'success');
                self.state.isDirty = false;
            } else {
                self.showNotice(response.data.message, 'error');
            }
        },
        error: function(xhr, status, error) {
            // Network error
            self.showNotice('Network error. Please check your connection and try again.', 'error');
            console.error('MASE AJAX Error:', error);
        },
        complete: function() {
            self.enableSaveButton();
        }
    });
}
```

## Testing Strategy

### Unit Testing

**PHP Unit Tests (PHPUnit):**
- Test each class method in isolation
- Mock WordPress functions using WP_Mock
- Test validation logic with valid and invalid inputs
- Test CSS generation output
- Test migration logic

**JavaScript Unit Tests (Jest):**
- Test utility functions (debounce, validation)
- Test CSS generation in JavaScript
- Test state management
- Test event handlers

### Integration Testing

**PHP Integration Tests:**
- Test complete save workflow (AJAX → Settings → CSS → Cache)
- Test palette application end-to-end
- Test template application end-to-end
- Test import/export workflow
- Test migration from v1.1.0

**JavaScript Integration Tests:**
- Test form submission workflow
- Test live preview updates
- Test keyboard shortcuts
- Test import/export UI

### End-to-End Testing

**Manual Testing Checklist:**
1. Install plugin on fresh WordPress
2. Verify default settings load correctly
3. Apply each of 10 palettes, verify colors change
4. Apply each of 11 templates, verify complete transformation
5. Test live preview with various settings
6. Export settings, import on different site
7. Test on mobile device (touch, responsive)
8. Test keyboard shortcuts
9. Test accessibility with screen reader
10. Upgrade from v1.1.0, verify migration

**Browser Testing:**
- Chrome 90+ (Windows, Mac, Linux)
- Firefox 88+ (Windows, Mac, Linux)
- Safari 14+ (Mac, iOS)
- Edge 90+ (Windows)

### Performance Testing

**Metrics to Measure:**
- CSS generation time (target: <100ms)
- Settings save time (target: <500ms)
- Page load time with plugin active (target: <450ms)
- Memory usage (target: <50MB)
- Cache hit rate (target: >80%)

**Tools:**
- PHP profiling with Xdebug
- JavaScript profiling with Chrome DevTools
- WordPress Query Monitor plugin
- Lighthouse for page performance

## Security Considerations

### Input Validation

- Validate all color values (hex, rgba)
- Validate numeric ranges (font sizes, margins, etc.)
- Validate file uploads (JSON only, max 1MB)
- Sanitize all text inputs
- Escape all output

### AJAX Security

- Verify nonce on every AJAX request
- Check user capabilities (manage_options)
- Rate limit AJAX requests (max 10/minute)
- Validate request origin
- Use wp_send_json_* functions

### Custom Code Security

- Sanitize custom CSS with wp_kses_post()
- Warn users about custom JavaScript risks
- Disable custom JS execution if WP_DEBUG is false
- Log all custom code changes
- Provide option to disable custom code

### Data Security

- Store settings in WordPress options (encrypted at rest)
- Don't expose sensitive data in JavaScript
- Use secure random for backup IDs
- Implement backup retention policy (max 10 backups)
- Provide option to delete all data on uninstall

## Performance Optimizations

### Caching Strategy

1. **CSS Caching:** Cache generated CSS for 24 hours
2. **Transient API:** Use WordPress transients for cache storage
3. **Cache Invalidation:** Invalidate on settings save, palette change, template change
4. **Conditional Generation:** Only regenerate CSS when settings change
5. **Lazy Loading:** Load templates and palettes data only when needed

### Code Optimization

1. **Minimize Database Queries:** Batch operations, use caching
2. **Efficient Selectors:** Limit CSS nesting to 3 levels
3. **Debouncing:** Debounce live preview updates (300ms)
4. **Code Splitting:** Split large files into modules
5. **Minification:** Minify CSS in production

### Asset Optimization

1. **Conditional Loading:** Only load assets on settings page
2. **Dependency Management:** Properly declare script dependencies
3. **Inline Critical CSS:** Inline small CSS snippets
4. **Defer Non-Critical JS:** Defer JavaScript loading where possible
5. **Image Optimization:** Optimize template thumbnails

## Browser Compatibility

### CSS Features

- **CSS Variables:** Supported in all modern browsers, provide fallbacks
- **Backdrop Filter:** Not supported in Firefox <103, provide fallback
- **Grid Layout:** Supported in all modern browsers
- **Flexbox:** Supported in all modern browsers
- **Transforms:** Supported in all modern browsers

### JavaScript Features

- **ES5 Syntax:** Use ES5 for maximum compatibility
- **jQuery:** Use jQuery for DOM manipulation (included in WordPress)
- **AJAX:** Use jQuery.ajax() for compatibility
- **No Arrow Functions:** Avoid ES6+ syntax
- **No let/const:** Use var for variable declarations

### Graceful Degradation

```css
/* Backdrop filter with fallback */
.admin-bar {
    background: rgba(255, 255, 255, 0.9); /* Fallback */
}

@supports (backdrop-filter: blur(10px)) {
    .admin-bar {
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.1);
    }
}
```

## Deployment Strategy

### Version Bump

1. Update version in main plugin file header
2. Update MASE_VERSION constant
3. Update version in README.md
4. Update changelog

### Migration Preparation

1. Test migration script on v1.1.0 installation
2. Verify backup creation before migration
3. Test rollback procedure
4. Document migration process

### Release Checklist

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version numbers updated
- [ ] Migration tested
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Browser testing completed
- [ ] Accessibility testing completed

### Rollback Plan

If critical issues are discovered after release:

1. Provide v1.1.0 download link
2. Document rollback procedure
3. Restore settings from backup
4. Investigate and fix issues
5. Release hotfix version
