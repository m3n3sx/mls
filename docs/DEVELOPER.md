# Modern Admin Styler Enterprise (MASE) v1.2.0 - Developer Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Hooks & Filters](#hooks--filters)
3. [Extending the Plugin](#extending-the-plugin)
4. [Creating Custom Palettes](#creating-custom-palettes)
5. [Creating Custom Templates](#creating-custom-templates)
6. [CSS Generation](#css-generation)
7. [AJAX Endpoints](#ajax-endpoints)
8. [JavaScript API](#javascript-api)
9. [Database Schema](#database-schema)
10. [Testing](#testing)

---

## Architecture Overview

MASE follows a clean, modular architecture with clear separation of concerns.

### Core Classes

```
MASE_Settings          - Settings management, validation, defaults
MASE_CSS_Generator     - CSS generation from settings
MASE_Admin             - Admin UI, asset enqueuing, AJAX handlers
MASE_Cache             - Multi-level caching system
MASE_Migration         - Version upgrades and data migration
MASE_Mobile_Optimizer  - Mobile device detection and optimization
```

### File Structure

```
modern-admin-styler/
├── modern-admin-styler.php          # Main plugin file
├── includes/                         # PHP classes
│   ├── class-mase-settings.php
│   ├── class-mase-css-generator.php
│   ├── class-mase-admin.php
│   ├── class-mase-cache.php
│   ├── class-mase-migration.php
│   ├── class-mase-mobile-optimizer.php
│   └── admin-settings-page.php      # Settings page template
├── assets/
│   ├── css/
│   │   ├── mase-admin.css           # Admin interface styles
│   │   ├── mase-palettes.css        # Palette card styles
│   │   ├── mase-templates.css       # Template gallery styles
│   │   ├── mase-responsive.css      # Responsive styles
│   │   └── mase-accessibility.css   # Accessibility styles
│   └── js/
│       └── mase-admin.js            # Main JavaScript file
├── docs/                             # Documentation
└── tests/                            # Test suite
```

### Data Flow

```
User Input → JavaScript → AJAX → PHP Handler → Settings Validation
→ Settings Storage → Cache Invalidation → CSS Generation → CSS Cache
→ Response → JavaScript → UI Update
```

---

## Hooks & Filters

MASE provides numerous hooks and filters for customization.

### Actions

#### `mase_before_settings_save`
Fires before settings are saved.

```php
do_action( 'mase_before_settings_save', array $settings );
```

**Parameters:**
- `$settings` (array) - Settings about to be saved

**Example:**
```php
add_action( 'mase_before_settings_save', function( $settings ) {
    // Log settings changes
    error_log( 'MASE settings being saved: ' . print_r( $settings, true ) );
} );
```

#### `mase_after_settings_save`
Fires after settings are successfully saved.

```php
do_action( 'mase_after_settings_save', array $settings );
```

**Example:**
```php
add_action( 'mase_after_settings_save', function( $settings ) {
    // Trigger external API update
    wp_remote_post( 'https://api.example.com/update', array(
        'body' => json_encode( $settings )
    ) );
} );
```

#### `mase_palette_applied`
Fires when a palette is applied.

```php
do_action( 'mase_palette_applied', string $palette_id, array $palette_data );
```

**Parameters:**
- `$palette_id` (string) - ID of the applied palette
- `$palette_data` (array) - Palette color data

**Example:**
```php
add_action( 'mase_palette_applied', function( $palette_id, $palette_data ) {
    // Track palette usage
    update_option( 'mase_last_palette', $palette_id );
} );
```

#### `mase_template_applied`
Fires when a template is applied.

```php
do_action( 'mase_template_applied', string $template_id, array $template_data );
```

**Example:**
```php
add_action( 'mase_template_applied', function( $template_id, $template_data ) {
    // Send notification
    wp_mail( 
        get_option( 'admin_email' ),
        'Template Applied',
        "Template {$template_id} was applied."
    );
} );
```

#### `mase_cache_cleared`
Fires when the CSS cache is cleared.

```php
do_action( 'mase_cache_cleared' );
```

**Example:**
```php
add_action( 'mase_cache_cleared', function() {
    // Clear related caches
    wp_cache_flush();
} );
```

#### `mase_backup_created`
Fires when a backup is created.

```php
do_action( 'mase_backup_created', string $backup_id, array $backup_data );
```

**Example:**
```php
add_action( 'mase_backup_created', function( $backup_id, $backup_data ) {
    // Store backup externally
    file_put_contents( 
        "/backups/{$backup_id}.json",
        json_encode( $backup_data )
    );
} );
```

#### `mase_settings_imported`
Fires after settings are imported.

```php
do_action( 'mase_settings_imported', array $imported_settings );
```

#### `mase_migration_complete`
Fires after version migration completes.

```php
do_action( 'mase_migration_complete', string $old_version, string $new_version );
```

### Filters

#### `mase_default_settings`
Filters the default settings array.

```php
apply_filters( 'mase_default_settings', array $defaults );
```

**Example:**
```php
add_filter( 'mase_default_settings', function( $defaults ) {
    // Add custom default values
    $defaults['custom_section'] = array(
        'custom_option' => 'custom_value'
    );
    return $defaults;
} );
```

#### `mase_validated_settings`
Filters settings after validation.

```php
apply_filters( 'mase_validated_settings', array $validated, array $input );
```

**Example:**
```php
add_filter( 'mase_validated_settings', function( $validated, $input ) {
    // Add custom validation
    if ( isset( $input['custom_field'] ) ) {
        $validated['custom_field'] = sanitize_text_field( $input['custom_field'] );
    }
    return $validated;
}, 10, 2 );
```

#### `mase_generated_css`
Filters the generated CSS before caching.

```php
apply_filters( 'mase_generated_css', string $css, array $settings );
```

**Example:**
```php
add_filter( 'mase_generated_css', function( $css, $settings ) {
    // Append custom CSS
    $css .= "\n/* Custom CSS */\n";
    $css .= "body.wp-admin { font-family: 'Custom Font'; }";
    return $css;
}, 10, 2 );
```

#### `mase_palettes`
Filters the available palettes.

```php
apply_filters( 'mase_palettes', array $palettes );
```

**Example:**
```php
add_filter( 'mase_palettes', function( $palettes ) {
    // Add custom palette
    $palettes['custom-brand'] = array(
        'id' => 'custom-brand',
        'name' => 'Custom Brand',
        'colors' => array(
            'primary' => '#FF6B6B',
            'secondary' => '#4ECDC4',
            'accent' => '#FFE66D',
            'background' => '#F7FFF7',
            'text' => '#2C3E50',
            'text_secondary' => '#7F8C8D'
        ),
        'is_custom' => false
    );
    return $palettes;
} );
```

#### `mase_templates`
Filters the available templates.

```php
apply_filters( 'mase_templates', array $templates );
```

**Example:**
```php
add_filter( 'mase_templates', function( $templates ) {
    // Add custom template
    $templates['custom-template'] = array(
        'id' => 'custom-template',
        'name' => 'Custom Template',
        'description' => 'My custom template',
        'thumbnail' => '',
        'settings' => array(
            // Complete settings array
        ),
        'is_custom' => false
    );
    return $templates;
} );
```

#### `mase_css_cache_duration`
Filters the CSS cache duration in seconds.

```php
apply_filters( 'mase_css_cache_duration', int $duration );
```

**Example:**
```php
add_filter( 'mase_css_cache_duration', function( $duration ) {
    // Increase cache duration to 48 hours
    return 48 * HOUR_IN_SECONDS;
} );
```

#### `mase_mobile_optimized_settings`
Filters settings after mobile optimization.

```php
apply_filters( 'mase_mobile_optimized_settings', array $settings, bool $is_mobile );
```

**Example:**
```php
add_filter( 'mase_mobile_optimized_settings', function( $settings, $is_mobile ) {
    if ( $is_mobile ) {
        // Further optimize for mobile
        $settings['visual_effects']['animations_enabled'] = false;
    }
    return $settings;
}, 10, 2 );
```

#### `mase_backup_retention_count`
Filters the number of backups to retain.

```php
apply_filters( 'mase_backup_retention_count', int $count );
```

**Example:**
```php
add_filter( 'mase_backup_retention_count', function( $count ) {
    // Keep 20 backups instead of 10
    return 20;
} );
```

---

## Extending the Plugin

### Adding Custom Settings Sections

1. **Add to defaults:**

```php
add_filter( 'mase_default_settings', function( $defaults ) {
    $defaults['my_section'] = array(
        'option1' => 'value1',
        'option2' => 'value2'
    );
    return $defaults;
} );
```

2. **Add validation:**

```php
add_filter( 'mase_validated_settings', function( $validated, $input ) {
    if ( isset( $input['my_section'] ) ) {
        $validated['my_section'] = array();
        
        if ( isset( $input['my_section']['option1'] ) ) {
            $validated['my_section']['option1'] = 
                sanitize_text_field( $input['my_section']['option1'] );
        }
    }
    return $validated;
}, 10, 2 );
```

3. **Add CSS generation:**

```php
add_filter( 'mase_generated_css', function( $css, $settings ) {
    if ( isset( $settings['my_section'] ) ) {
        $css .= "\n/* My Custom Section */\n";
        $css .= ".my-element { color: {$settings['my_section']['option1']}; }";
    }
    return $css;
}, 10, 2 );
```

### Creating Custom AJAX Endpoints

```php
add_action( 'wp_ajax_mase_custom_action', function() {
    // Verify nonce
    check_ajax_referer( 'mase_save_settings', 'nonce' );
    
    // Check capabilities
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( array(
            'message' => 'Insufficient permissions'
        ) );
    }
    
    // Process request
    $data = $_POST['data'] ?? array();
    
    // Validate and sanitize
    $validated = sanitize_text_field( $data );
    
    // Perform action
    $result = update_option( 'my_custom_option', $validated );
    
    // Return response
    if ( $result ) {
        wp_send_json_success( array(
            'message' => 'Action completed successfully'
        ) );
    } else {
        wp_send_json_error( array(
            'message' => 'Action failed'
        ) );
    }
} );
```

### Adding Custom JavaScript Modules

```javascript
(function($) {
    'use strict';
    
    // Extend MASE object
    MASE.customModule = {
        init: function() {
            this.bindEvents();
        },
        
        bindEvents: function() {
            $(document).on('click', '.my-button', this.handleClick.bind(this));
        },
        
        handleClick: function(e) {
            e.preventDefault();
            
            $.ajax({
                url: MASE.config.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'mase_custom_action',
                    nonce: MASE.config.nonce,
                    data: 'my_data'
                },
                success: function(response) {
                    if (response.success) {
                        MASE.showNotice(response.data.message, 'success');
                    }
                }
            });
        }
    };
    
    // Initialize on document ready
    $(document).ready(function() {
        MASE.customModule.init();
    });
    
})(jQuery);
```

---

## Creating Custom Palettes

### Programmatically

```php
add_filter( 'mase_palettes', function( $palettes ) {
    $palettes['my-brand'] = array(
        'id' => 'my-brand',
        'name' => 'My Brand Colors',
        'colors' => array(
            'primary' => '#1A73E8',      // Brand primary
            'secondary' => '#34A853',    // Brand secondary
            'accent' => '#FBBC04',       // Brand accent
            'background' => '#FFFFFF',   // Background
            'text' => '#202124',         // Text color
            'text_secondary' => '#5F6368' // Secondary text
        ),
        'is_custom' => false,
        'created_at' => null
    );
    return $palettes;
} );
```

### Via Settings API

```php
$settings = new MASE_Settings();
$result = $settings->save_custom_palette( 'My Brand', array(
    'primary' => '#1A73E8',
    'secondary' => '#34A853',
    'accent' => '#FBBC04',
    'background' => '#FFFFFF',
    'text' => '#202124',
    'text_secondary' => '#5F6368'
) );
```

### Color Guidelines

- **Primary**: Main brand color, used for primary actions
- **Secondary**: Supporting color, used for secondary elements
- **Accent**: Highlight color, used for emphasis
- **Background**: Main background color
- **Text**: Primary text color (ensure 4.5:1 contrast with background)
- **Text Secondary**: Secondary text color (ensure 3:1 contrast with background)

---

## Creating Custom Templates

### Programmatically

```php
add_filter( 'mase_templates', function( $templates ) {
    $templates['my-template'] = array(
        'id' => 'my-template',
        'name' => 'My Custom Template',
        'description' => 'A custom template for my site',
        'thumbnail' => plugin_dir_url( __FILE__ ) . 'images/my-template.png',
        'settings' => array(
            'palettes' => array(
                'current' => 'my-brand'
            ),
            'typography' => array(
                'admin_bar' => array(
                    'font_size' => 14,
                    'font_weight' => 500,
                    'line_height' => 1.5
                ),
                // ... more typography settings
            ),
            'visual_effects' => array(
                'admin_bar' => array(
                    'glassmorphism' => true,
                    'blur_intensity' => 20,
                    'floating' => true,
                    'floating_margin' => 8,
                    'border_radius' => 12,
                    'shadow' => 'elevated'
                ),
                // ... more visual effects
            ),
            // ... complete settings array
        ),
        'is_custom' => false,
        'created_at' => null
    );
    return $templates;
} );
```

### Via Settings API

```php
$settings = new MASE_Settings();
$current_settings = $settings->get_option();

$result = $settings->save_custom_template( 
    'My Template',
    $current_settings
);
```

---

## CSS Generation

### How It Works

1. Settings are passed to `MASE_CSS_Generator::generate()`
2. Generator calls component-specific methods
3. Each method generates CSS for its component
4. CSS is concatenated and minified
5. Result is cached for 24 hours

### Component Generators

```php
class MASE_CSS_Generator {
    public function generate( $settings ) {
        $css = '';
        
        // CSS Variables
        $css .= $this->generate_palette_css( $settings );
        
        // Components
        $css .= $this->generate_admin_bar_css( $settings );
        $css .= $this->generate_admin_menu_css( $settings );
        $css .= $this->generate_typography_css( $settings );
        $css .= $this->generate_visual_effects_css( $settings );
        
        // Responsive
        $css .= $this->generate_mobile_css( $settings );
        
        // Custom
        $css .= $this->generate_custom_css( $settings );
        
        return $this->minify( $css );
    }
}
```

### Adding Custom CSS Generation

```php
add_filter( 'mase_generated_css', function( $css, $settings ) {
    // Add custom CSS based on settings
    if ( isset( $settings['my_section']['enabled'] ) && $settings['my_section']['enabled'] ) {
        $css .= "\n/* My Custom CSS */\n";
        $css .= "body.wp-admin .my-element {\n";
        $css .= "    color: {$settings['my_section']['color']};\n";
        $css .= "    font-size: {$settings['my_section']['size']}px;\n";
        $css .= "}\n";
    }
    return $css;
}, 10, 2 );
```

---

## AJAX Endpoints

### Available Endpoints

All endpoints require:
- Valid nonce (`mase_save_settings`)
- `manage_options` capability

#### `mase_save_settings`
Saves all settings.

**Request:**
```javascript
{
    action: 'mase_save_settings',
    nonce: 'nonce_value',
    settings: { /* settings object */ }
}
```

**Response:**
```javascript
{
    success: true,
    data: {
        message: 'Settings saved successfully!'
    }
}
```

#### `mase_apply_palette`
Applies a color palette.

**Request:**
```javascript
{
    action: 'mase_apply_palette',
    nonce: 'nonce_value',
    palette_id: 'professional-blue'
}
```

#### `mase_apply_template`
Applies a complete template.

**Request:**
```javascript
{
    action: 'mase_apply_template',
    nonce: 'nonce_value',
    template_id: 'modern-minimal'
}
```

#### `mase_import_settings`
Imports settings from JSON.

**Request:**
```javascript
{
    action: 'mase_import_settings',
    nonce: 'nonce_value',
    settings: { /* imported settings */ }
}
```

#### `mase_create_backup`
Creates a manual backup.

**Request:**
```javascript
{
    action: 'mase_create_backup',
    nonce: 'nonce_value'
}
```

#### `mase_restore_backup`
Restores from a backup.

**Request:**
```javascript
{
    action: 'mase_restore_backup',
    nonce: 'nonce_value',
    backup_id: 'backup_20250117_143022'
}
```

---

## JavaScript API

### MASE Object

The global `MASE` object provides access to all functionality.

```javascript
MASE = {
    config: {
        ajaxUrl: string,
        nonce: string,
        debounceDelay: number
    },
    
    state: {
        livePreviewEnabled: boolean,
        currentPalette: string,
        currentTemplate: string,
        isDirty: boolean
    },
    
    // Modules
    paletteManager: object,
    templateManager: object,
    livePreview: object,
    importExport: object,
    keyboardShortcuts: object,
    
    // Core methods
    init: function(),
    bindEvents: function(),
    saveSettings: function(),
    showNotice: function(message, type),
    debounce: function(func, wait)
}
```

### Using the API

```javascript
// Show a notice
MASE.showNotice('Operation completed', 'success');

// Apply a palette
MASE.paletteManager.apply('professional-blue');

// Enable live preview
MASE.livePreview.toggle();

// Export settings
MASE.importExport.export();

// Save settings
MASE.saveSettings();
```

---

## Database Schema

### Options

#### `mase_settings`
Main settings storage.

**Type**: Array  
**Autoload**: Yes

**Structure:**
```php
array(
    'admin_bar' => array(...),
    'admin_menu' => array(...),
    'palettes' => array(...),
    'templates' => array(...),
    'typography' => array(...),
    'visual_effects' => array(...),
    'effects' => array(...),
    'advanced' => array(...),
    'mobile' => array(...),
    'accessibility' => array(...),
    'keyboard_shortcuts' => array(...),
    'spacing' => array(...)
)
```

#### `mase_version`
Current plugin version.

**Type**: String  
**Example**: `'1.2.0'`

#### `mase_css_cache`
Cached generated CSS.

**Type**: Transient (24 hours)  
**Structure:**
```php
array(
    'css' => string,
    'generated_at' => int,
    'settings_hash' => string
)
```

#### `mase_settings_backup_110`
Backup of v1.1.0 settings (created during migration).

**Type**: Array

#### `mase_backups`
Array of manual backups.

**Type**: Array  
**Structure:**
```php
array(
    'backup_20250117_143022' => array(
        'id' => 'backup_20250117_143022',
        'timestamp' => 1705501822,
        'version' => '1.2.0',
        'settings' => array(...),
        'trigger' => 'manual'
    ),
    // ... more backups
)
```

---

## Testing

### Running Tests

```bash
# PHP Unit Tests
cd tests
./run-unit-tests.sh

# Integration Tests
./run-integration-tests.sh

# All Tests
./run-tests.sh
```

### Writing Tests

#### PHP Unit Test Example

```php
class Test_MASE_Settings extends WP_UnitTestCase {
    
    public function test_get_palette() {
        $settings = new MASE_Settings();
        $palette = $settings->get_palette( 'professional-blue' );
        
        $this->assertIsArray( $palette );
        $this->assertEquals( 'professional-blue', $palette['id'] );
        $this->assertArrayHasKey( 'colors', $palette );
    }
    
    public function test_apply_palette() {
        $settings = new MASE_Settings();
        $result = $settings->apply_palette( 'professional-blue' );
        
        $this->assertTrue( $result );
        
        $current_settings = $settings->get_option();
        $this->assertEquals( 'professional-blue', $current_settings['palettes']['current'] );
    }
}
```

#### JavaScript Test Example

```javascript
describe('MASE.paletteManager', function() {
    
    it('should apply palette', function() {
        spyOn($, 'ajax');
        
        MASE.paletteManager.apply('professional-blue');
        
        expect($.ajax).toHaveBeenCalledWith(
            jasmine.objectContaining({
                data: jasmine.objectContaining({
                    action: 'mase_apply_palette',
                    palette_id: 'professional-blue'
                })
            })
        );
    });
});
```

---

## Best Practices

### Performance

- Cache generated CSS for 24 hours
- Use transients for temporary data
- Minimize database queries
- Debounce live preview updates
- Lazy load templates and palettes

### Security

- Always verify nonces
- Check user capabilities
- Validate all inputs
- Sanitize all outputs
- Escape all HTML
- Use prepared statements

### Code Quality

- Follow WordPress Coding Standards
- Add docblocks to all functions
- Use type hints where possible
- Write unit tests for new features
- Keep functions small and focused

### Compatibility

- Test on WordPress 5.8+
- Test on PHP 7.4+
- Test in all major browsers
- Provide fallbacks for unsupported features
- Maintain backward compatibility

---

## Resources

- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Version**: 1.2.0  
**Last Updated**: January 2025
