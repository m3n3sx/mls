# Modern Admin Styler Enterprise (MASE) v1.2.0 - Hooks & Filters Reference

## Table of Contents

1. [Actions](#actions)
2. [Filters](#filters)
3. [Usage Examples](#usage-examples)
4. [Best Practices](#best-practices)

---

## Actions

Actions allow you to execute code at specific points in MASE's execution.

### `mase_before_settings_save`

Fires before settings are saved to the database.

**Parameters:**
- `$settings` (array) - Settings about to be saved

**Usage:**
```php
add_action( 'mase_before_settings_save', function( $settings ) {
    // Log settings changes
    error_log( 'MASE settings being saved: ' . print_r( $settings, true ) );
    
    // Trigger external API
    wp_remote_post( 'https://api.example.com/update', array(
        'body' => json_encode( $settings )
    ) );
} );
```

**Use Cases:**
- Logging settings changes
- Triggering external APIs
- Validating settings before save
- Creating custom backups

---

### `mase_after_settings_save`

Fires after settings are successfully saved.

**Parameters:**
- `$settings` (array) - Settings that were saved

**Usage:**
```php
add_action( 'mase_after_settings_save', function( $settings ) {
    // Clear related caches
    wp_cache_flush();
    
    // Send notification
    wp_mail( 
        get_option( 'admin_email' ),
        'MASE Settings Updated',
        'Settings were successfully updated.'
    );
} );
```

**Use Cases:**
- Clearing related caches
- Sending notifications
- Updating external systems
- Triggering dependent processes

---

### `mase_palette_applied`

Fires when a color palette is applied.

**Parameters:**
- `$palette_id` (string) - ID of the applied palette
- `$palette_data` (array) - Palette color data

**Usage:**
```php
add_action( 'mase_palette_applied', function( $palette_id, $palette_data ) {
    // Track palette usage
    $usage = get_option( 'mase_palette_usage', array() );
    $usage[ $palette_id ] = ( $usage[ $palette_id ] ?? 0 ) + 1;
    update_option( 'mase_palette_usage', $usage );
    
    // Log palette change
    error_log( "Palette changed to: {$palette_id}" );
}, 10, 2 );
```

**Use Cases:**
- Tracking palette usage
- Analytics and reporting
- Triggering palette-specific actions
- Logging changes

---

### `mase_template_applied`

Fires when a template is applied.

**Parameters:**
- `$template_id` (string) - ID of the applied template
- `$template_data` (array) - Complete template data

**Usage:**
```php
add_action( 'mase_template_applied', function( $template_id, $template_data ) {
    // Create automatic backup
    $backup_id = 'auto_' . time();
    $backups = get_option( 'mase_backups', array() );
    $backups[ $backup_id ] = array(
        'id' => $backup_id,
        'timestamp' => time(),
        'trigger' => 'template_applied',
        'template_id' => $template_id,
        'settings' => get_option( 'mase_settings' )
    );
    update_option( 'mase_backups', $backups );
}, 10, 2 );
```

**Use Cases:**
- Creating automatic backups
- Tracking template usage
- Triggering template-specific actions
- Logging template changes

---

### `mase_cache_cleared`

Fires when the CSS cache is cleared.

**Parameters:** None

**Usage:**
```php
add_action( 'mase_cache_cleared', function() {
    // Clear related caches
    wp_cache_flush();
    
    // Clear CDN cache
    if ( function_exists( 'cloudflare_purge_cache' ) ) {
        cloudflare_purge_cache();
    }
    
    // Log cache clear
    error_log( 'MASE cache cleared at ' . current_time( 'mysql' ) );
} );
```

**Use Cases:**
- Clearing related caches
- Purging CDN cache
- Logging cache operations
- Triggering cache-dependent processes

---

### `mase_backup_created`

Fires when a backup is created.

**Parameters:**
- `$backup_id` (string) - Unique backup identifier
- `$backup_data` (array) - Complete backup data

**Usage:**
```php
add_action( 'mase_backup_created', function( $backup_id, $backup_data ) {
    // Store backup externally
    $backup_dir = WP_CONTENT_DIR . '/mase-backups';
    if ( ! file_exists( $backup_dir ) ) {
        mkdir( $backup_dir, 0755, true );
    }
    
    file_put_contents( 
        "{$backup_dir}/{$backup_id}.json",
        json_encode( $backup_data, JSON_PRETTY_PRINT )
    );
    
    // Send notification
    wp_mail(
        get_option( 'admin_email' ),
        'MASE Backup Created',
        "Backup {$backup_id} was created successfully."
    );
}, 10, 2 );
```

**Use Cases:**
- Storing backups externally
- Sending notifications
- Logging backup operations
- Syncing backups to cloud storage

---

### `mase_backup_restored`

Fires after a backup is restored.

**Parameters:**
- `$backup_id` (string) - ID of the restored backup
- `$restored_settings` (array) - Settings that were restored

**Usage:**
```php
add_action( 'mase_backup_restored', function( $backup_id, $restored_settings ) {
    // Log restoration
    error_log( "Backup {$backup_id} restored at " . current_time( 'mysql' ) );
    
    // Clear caches
    delete_transient( 'mase_css_cache' );
    wp_cache_flush();
    
    // Send notification
    wp_mail(
        get_option( 'admin_email' ),
        'MASE Backup Restored',
        "Backup {$backup_id} was restored successfully."
    );
}, 10, 2 );
```

**Use Cases:**
- Logging restorations
- Clearing caches after restore
- Sending notifications
- Triggering post-restore actions

---

### `mase_settings_imported`

Fires after settings are imported.

**Parameters:**
- `$imported_settings` (array) - Settings that were imported

**Usage:**
```php
add_action( 'mase_settings_imported', function( $imported_settings ) {
    // Validate imported settings
    $settings_obj = new MASE_Settings();
    $validated = $settings_obj->validate( $imported_settings );
    
    if ( is_wp_error( $validated ) ) {
        error_log( 'Imported settings validation failed: ' . $validated->get_error_message() );
    }
    
    // Log import
    error_log( 'Settings imported at ' . current_time( 'mysql' ) );
} );
```

**Use Cases:**
- Validating imported settings
- Logging imports
- Triggering post-import actions
- Sending notifications

---

### `mase_settings_exported`

Fires when settings are exported.

**Parameters:**
- `$exported_settings` (array) - Settings that were exported

**Usage:**
```php
add_action( 'mase_settings_exported', function( $exported_settings ) {
    // Log export
    error_log( 'Settings exported at ' . current_time( 'mysql' ) );
    
    // Track export count
    $export_count = get_option( 'mase_export_count', 0 );
    update_option( 'mase_export_count', $export_count + 1 );
} );
```

**Use Cases:**
- Logging exports
- Tracking export usage
- Analytics and reporting

---

### `mase_migration_complete`

Fires after version migration completes.

**Parameters:**
- `$old_version` (string) - Previous version number
- `$new_version` (string) - New version number

**Usage:**
```php
add_action( 'mase_migration_complete', function( $old_version, $new_version ) {
    // Log migration
    error_log( "MASE migrated from {$old_version} to {$new_version}" );
    
    // Send notification
    wp_mail(
        get_option( 'admin_email' ),
        'MASE Migration Complete',
        "Successfully migrated from {$old_version} to {$new_version}."
    );
    
    // Clear all caches
    wp_cache_flush();
    delete_transient( 'mase_css_cache' );
}, 10, 2 );
```

**Use Cases:**
- Logging migrations
- Sending notifications
- Clearing caches after migration
- Triggering post-migration actions

---

### `mase_custom_palette_saved`

Fires when a custom palette is saved.

**Parameters:**
- `$palette_id` (string) - ID of the custom palette
- `$palette_data` (array) - Palette data

**Usage:**
```php
add_action( 'mase_custom_palette_saved', function( $palette_id, $palette_data ) {
    // Log custom palette creation
    error_log( "Custom palette created: {$palette_id}" );
    
    // Track custom palette count
    $custom_count = get_option( 'mase_custom_palette_count', 0 );
    update_option( 'mase_custom_palette_count', $custom_count + 1 );
}, 10, 2 );
```

**Use Cases:**
- Logging custom palette creation
- Tracking usage
- Analytics

---

### `mase_custom_template_saved`

Fires when a custom template is saved.

**Parameters:**
- `$template_id` (string) - ID of the custom template
- `$template_data` (array) - Template data

**Usage:**
```php
add_action( 'mase_custom_template_saved', function( $template_id, $template_data ) {
    // Log custom template creation
    error_log( "Custom template created: {$template_id}" );
    
    // Store template externally
    $template_dir = WP_CONTENT_DIR . '/mase-templates';
    if ( ! file_exists( $template_dir ) ) {
        mkdir( $template_dir, 0755, true );
    }
    
    file_put_contents(
        "{$template_dir}/{$template_id}.json",
        json_encode( $template_data, JSON_PRETTY_PRINT )
    );
}, 10, 2 );
```

**Use Cases:**
- Logging custom template creation
- Storing templates externally
- Sharing templates

---

## Filters

Filters allow you to modify data before it's used by MASE.

### `mase_default_settings`

Filters the default settings array.

**Parameters:**
- `$defaults` (array) - Default settings

**Returns:** array - Modified default settings

**Usage:**
```php
add_filter( 'mase_default_settings', function( $defaults ) {
    // Add custom section
    $defaults['custom_section'] = array(
        'enabled' => true,
        'option1' => 'value1',
        'option2' => 'value2'
    );
    
    // Modify existing defaults
    $defaults['admin_bar']['bg_color'] = '#1e1e1e';
    
    return $defaults;
} );
```

**Use Cases:**
- Adding custom settings sections
- Modifying default values
- Setting site-specific defaults

---

### `mase_validated_settings`

Filters settings after validation.

**Parameters:**
- `$validated` (array) - Validated settings
- `$input` (array) - Raw input data

**Returns:** array - Modified validated settings

**Usage:**
```php
add_filter( 'mase_validated_settings', function( $validated, $input ) {
    // Add custom validation
    if ( isset( $input['custom_section'] ) ) {
        $validated['custom_section'] = array();
        
        if ( isset( $input['custom_section']['option1'] ) ) {
            $validated['custom_section']['option1'] = 
                sanitize_text_field( $input['custom_section']['option1'] );
        }
        
        if ( isset( $input['custom_section']['option2'] ) ) {
            $value = absint( $input['custom_section']['option2'] );
            if ( $value >= 0 && $value <= 100 ) {
                $validated['custom_section']['option2'] = $value;
            }
        }
    }
    
    return $validated;
}, 10, 2 );
```

**Use Cases:**
- Adding custom validation
- Sanitizing custom fields
- Enforcing business rules

---

### `mase_generated_css`

Filters the generated CSS before caching.

**Parameters:**
- `$css` (string) - Generated CSS
- `$settings` (array) - Current settings

**Returns:** string - Modified CSS

**Usage:**
```php
add_filter( 'mase_generated_css', function( $css, $settings ) {
    // Append custom CSS
    $css .= "\n/* Custom CSS */\n";
    $css .= "body.wp-admin .custom-element {\n";
    $css .= "    color: #ff0000;\n";
    $css .= "    font-size: 16px;\n";
    $css .= "}\n";
    
    // Modify existing CSS
    if ( isset( $settings['custom_section']['enabled'] ) && $settings['custom_section']['enabled'] ) {
        $css .= "\n/* Custom Section Styles */\n";
        $css .= ".custom-section { display: block; }\n";
    }
    
    return $css;
}, 10, 2 );
```

**Use Cases:**
- Adding custom CSS
- Modifying generated CSS
- Conditional CSS based on settings

---

### `mase_palettes`

Filters the available color palettes.

**Parameters:**
- `$palettes` (array) - Array of palettes

**Returns:** array - Modified palettes array

**Usage:**
```php
add_filter( 'mase_palettes', function( $palettes ) {
    // Add custom palette
    $palettes['my-brand'] = array(
        'id' => 'my-brand',
        'name' => 'My Brand Colors',
        'colors' => array(
            'primary' => '#1A73E8',
            'secondary' => '#34A853',
            'accent' => '#FBBC04',
            'background' => '#FFFFFF',
            'text' => '#202124',
            'text_secondary' => '#5F6368'
        ),
        'is_custom' => false,
        'created_at' => null
    );
    
    // Remove a palette
    unset( $palettes['vibrant-coral'] );
    
    // Modify existing palette
    $palettes['professional-blue']['name'] = 'Corporate Blue';
    
    return $palettes;
} );
```

**Use Cases:**
- Adding brand-specific palettes
- Removing unwanted palettes
- Modifying palette names or colors

---

### `mase_templates`

Filters the available templates.

**Parameters:**
- `$templates` (array) - Array of templates

**Returns:** array - Modified templates array

**Usage:**
```php
add_filter( 'mase_templates', function( $templates ) {
    // Add custom template
    $templates['my-template'] = array(
        'id' => 'my-template',
        'name' => 'My Custom Template',
        'description' => 'A custom template for my site',
        'thumbnail' => plugin_dir_url( __FILE__ ) . 'images/my-template.png',
        'settings' => array(
            'palettes' => array( 'current' => 'my-brand' ),
            'typography' => array( /* ... */ ),
            'visual_effects' => array( /* ... */ ),
            // ... complete settings
        ),
        'is_custom' => false,
        'created_at' => null
    );
    
    return $templates;
} );
```

**Use Cases:**
- Adding custom templates
- Removing unwanted templates
- Modifying template settings

---

### `mase_css_cache_duration`

Filters the CSS cache duration in seconds.

**Parameters:**
- `$duration` (int) - Cache duration in seconds (default: 86400 = 24 hours)

**Returns:** int - Modified cache duration

**Usage:**
```php
add_filter( 'mase_css_cache_duration', function( $duration ) {
    // Increase cache duration to 48 hours
    return 48 * HOUR_IN_SECONDS;
    
    // Or decrease to 1 hour for development
    // return HOUR_IN_SECONDS;
} );
```

**Use Cases:**
- Adjusting cache duration for performance
- Shorter duration for development
- Longer duration for production

---

### `mase_mobile_optimized_settings`

Filters settings after mobile optimization.

**Parameters:**
- `$settings` (array) - Optimized settings
- `$is_mobile` (bool) - Whether device is mobile

**Returns:** array - Modified settings

**Usage:**
```php
add_filter( 'mase_mobile_optimized_settings', function( $settings, $is_mobile ) {
    if ( $is_mobile ) {
        // Further optimize for mobile
        $settings['visual_effects']['animations_enabled'] = false;
        $settings['visual_effects']['particle_system'] = false;
        $settings['visual_effects']['3d_effects'] = false;
        
        // Increase touch targets
        $settings['admin_bar']['height'] = 44;
    }
    
    return $settings;
}, 10, 2 );
```

**Use Cases:**
- Custom mobile optimizations
- Device-specific settings
- Performance tuning

---

### `mase_backup_retention_count`

Filters the number of backups to retain.

**Parameters:**
- `$count` (int) - Number of backups to keep (default: 10)

**Returns:** int - Modified retention count

**Usage:**
```php
add_filter( 'mase_backup_retention_count', function( $count ) {
    // Keep 20 backups instead of 10
    return 20;
    
    // Or keep only 5 for limited storage
    // return 5;
} );
```

**Use Cases:**
- Adjusting backup retention
- Managing storage space
- Compliance requirements

---

### `mase_import_validation_rules`

Filters validation rules for imported settings.

**Parameters:**
- `$rules` (array) - Validation rules

**Returns:** array - Modified validation rules

**Usage:**
```php
add_filter( 'mase_import_validation_rules', function( $rules ) {
    // Add custom validation rule
    $rules['custom_section'] = array(
        'type' => 'array',
        'required' => false,
        'fields' => array(
            'option1' => array( 'type' => 'string' ),
            'option2' => array( 'type' => 'integer', 'min' => 0, 'max' => 100 )
        )
    );
    
    return $rules;
} );
```

**Use Cases:**
- Adding validation for custom fields
- Enforcing import rules
- Data integrity

---

### `mase_keyboard_shortcuts`

Filters available keyboard shortcuts.

**Parameters:**
- `$shortcuts` (array) - Array of keyboard shortcuts

**Returns:** array - Modified shortcuts array

**Usage:**
```php
add_filter( 'mase_keyboard_shortcuts', function( $shortcuts ) {
    // Add custom shortcut
    $shortcuts['custom_action'] = array(
        'key' => 'Ctrl+Shift+C',
        'description' => 'Custom Action',
        'callback' => 'myCustomAction'
    );
    
    // Modify existing shortcut
    $shortcuts['theme_toggle']['key'] = 'Ctrl+Shift+D';
    
    return $shortcuts;
} );
```

**Use Cases:**
- Adding custom shortcuts
- Modifying existing shortcuts
- Disabling shortcuts

---

## Usage Examples

### Example 1: Brand-Specific Palette

```php
// Add your brand palette
add_filter( 'mase_palettes', function( $palettes ) {
    $palettes['acme-brand'] = array(
        'id' => 'acme-brand',
        'name' => 'ACME Brand',
        'colors' => array(
            'primary' => '#E74C3C',
            'secondary' => '#3498DB',
            'accent' => '#F39C12',
            'background' => '#ECF0F1',
            'text' => '#2C3E50',
            'text_secondary' => '#7F8C8D'
        ),
        'is_custom' => false
    );
    return $palettes;
} );

// Auto-apply on activation
add_action( 'admin_init', function() {
    $settings = new MASE_Settings();
    $current = $settings->get_option( 'palettes' );
    
    if ( $current['current'] === 'professional-blue' ) {
        $settings->apply_palette( 'acme-brand' );
    }
} );
```

### Example 2: External Backup Storage

```php
// Store backups in cloud storage
add_action( 'mase_backup_created', function( $backup_id, $backup_data ) {
    // Upload to S3
    if ( class_exists( 'S3_Uploads' ) ) {
        $s3 = new S3_Uploads();
        $s3->upload(
            "mase-backups/{$backup_id}.json",
            json_encode( $backup_data )
        );
    }
}, 10, 2 );

// Restore from cloud storage
add_action( 'mase_backup_restored', function( $backup_id ) {
    // Log restoration
    error_log( "Restored backup {$backup_id} from cloud storage" );
} );
```

### Example 3: Custom CSS Based on User Role

```php
add_filter( 'mase_generated_css', function( $css, $settings ) {
    $user = wp_get_current_user();
    
    if ( in_array( 'editor', $user->roles ) ) {
        // Custom CSS for editors
        $css .= "\n/* Editor Styles */\n";
        $css .= "body.wp-admin #wpadminbar { background: #8E44AD; }\n";
    }
    
    if ( in_array( 'author', $user->roles ) ) {
        // Custom CSS for authors
        $css .= "\n/* Author Styles */\n";
        $css .= "body.wp-admin #wpadminbar { background: #27AE60; }\n";
    }
    
    return $css;
}, 10, 2 );
```

### Example 4: Analytics Integration

```php
// Track palette changes
add_action( 'mase_palette_applied', function( $palette_id ) {
    // Send to Google Analytics
    if ( function_exists( 'ga_send_event' ) ) {
        ga_send_event( 'MASE', 'Palette Applied', $palette_id );
    }
} );

// Track template changes
add_action( 'mase_template_applied', function( $template_id ) {
    // Send to Google Analytics
    if ( function_exists( 'ga_send_event' ) ) {
        ga_send_event( 'MASE', 'Template Applied', $template_id );
    }
} );
```

---

## Best Practices

### 1. Always Return Values in Filters

```php
// GOOD
add_filter( 'mase_palettes', function( $palettes ) {
    $palettes['custom'] = array( /* ... */ );
    return $palettes; // Always return
} );

// BAD
add_filter( 'mase_palettes', function( $palettes ) {
    $palettes['custom'] = array( /* ... */ );
    // Missing return statement
} );
```

### 2. Use Appropriate Priority

```php
// Run early (priority 5)
add_filter( 'mase_default_settings', 'my_defaults', 5 );

// Run late (priority 20)
add_filter( 'mase_generated_css', 'my_css', 20 );

// Default priority is 10
```

### 3. Check for Existence

```php
add_filter( 'mase_palettes', function( $palettes ) {
    // Check if palette exists before modifying
    if ( isset( $palettes['professional-blue'] ) ) {
        $palettes['professional-blue']['name'] = 'Corporate Blue';
    }
    return $palettes;
} );
```

### 4. Validate Input

```php
add_filter( 'mase_validated_settings', function( $validated, $input ) {
    if ( isset( $input['custom_field'] ) ) {
        // Validate before adding
        $value = absint( $input['custom_field'] );
        if ( $value >= 0 && $value <= 100 ) {
            $validated['custom_field'] = $value;
        }
    }
    return $validated;
}, 10, 2 );
```

### 5. Document Your Hooks

```php
/**
 * Add custom brand palette.
 *
 * @param array $palettes Existing palettes.
 * @return array Modified palettes with brand palette.
 */
add_filter( 'mase_palettes', function( $palettes ) {
    // Implementation
    return $palettes;
} );
```

---

**Version**: 1.2.0  
**Last Updated**: January 2025
