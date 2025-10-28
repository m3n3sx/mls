# Login Customization Migration Guide

## Overview

The MASE plugin includes automatic migration functionality for login customization settings. This ensures backward compatibility when upgrading from older versions or migrating from other login customization plugins.

## Automatic Migration

Migration runs automatically when:
- The plugin is activated or updated
- An administrator accesses the WordPress admin area
- The `mase_login_customization_migration_completed` flag is not set

## What Gets Migrated

### 1. Version Detection (Task 13.1)

The migration system checks if `login_customization` settings exist:

```php
// Check if settings exist
$has_settings = MASE_Migration::has_login_customization();
```

### 2. Settings Migration (Task 13.2)

The system automatically:
- Initializes login customization settings with defaults if they don't exist
- Merges existing settings with new defaults to ensure all fields are present
- Preserves user customizations during the merge process
- Logs the migration process for debugging

### 3. Legacy Plugin Migration (Optional)

The migration system can detect and migrate settings from:
- **Custom Login Page Customizer** - Logo, background, form colors
- **LoginPress** - Logo, background images
- **Colorlib Login Customizer** - Logo, background

Migration is automatic and non-destructive. Original plugin settings remain unchanged.

## Manual Reset

### Reset to Defaults

To reset login customization settings to defaults:

```php
// Reset without clearing uploaded files
MASE_Migration::reset_login_customization( false );

// Reset and clear uploaded files
MASE_Migration::reset_login_customization( true );
```

**Warning:** Resetting with `$clear_uploaded_files = true` will permanently delete uploaded logo and background images.

### What Gets Reset

When resetting to defaults:
- All login customization settings return to WordPress defaults
- Other MASE settings (admin bar, menu, etc.) are preserved
- Optionally, uploaded files can be removed from the server

## Migration Logging

When `WP_DEBUG` is enabled, migration events are logged:

```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
```

Log messages include:
- Migration start/completion
- Settings detection results
- Legacy plugin detection
- File operations (if clearing uploads)

Example log output:
```
MASE: Starting login customization migration
MASE: Login customization - initialized with default settings
MASE: Detected LoginPress settings
MASE: Login customization - migrated legacy plugin settings
MASE: Login customization migration completed successfully
```

## Migration Flags

The system uses WordPress options to track migration status:

- `mase_login_customization_migration_completed` - Set to `true` after successful migration
- `mase_settings_version` - Tracks the settings structure version

To force re-migration (for testing):
```php
delete_option( 'mase_login_customization_migration_completed' );
```

## Troubleshooting

### Migration Not Running

If migration doesn't run automatically:

1. Check if the flag is already set:
   ```php
   $completed = get_option( 'mase_login_customization_migration_completed' );
   echo $completed ? 'Already migrated' : 'Not migrated';
   ```

2. Force migration by deleting the flag:
   ```php
   delete_option( 'mase_login_customization_migration_completed' );
   ```

3. Reload any admin page to trigger migration

### Settings Not Preserved

If settings are lost after migration:

1. Check the backup (created automatically):
   ```php
   $backup = get_option( 'mase_settings_backup_110' );
   print_r( $backup );
   ```

2. Check debug logs for migration errors

3. Manually restore from backup if needed

### Legacy Plugin Settings Not Detected

If settings from another plugin aren't migrated:

1. Verify the plugin was active before migration
2. Check if the plugin uses standard WordPress options
3. Review debug logs for detection messages
4. The plugin may use a custom storage method not supported

## Developer Notes

### Adding New Legacy Plugin Support

To add support for another login customization plugin:

1. Identify the plugin's option name
2. Map the plugin's settings to MASE format
3. Add detection and migration logic to `migrate_legacy_login_plugins()`

Example:
```php
// Check for Example Plugin
$example_settings = get_option( 'example_plugin_settings', false );
if ( $example_settings && is_array( $example_settings ) ) {
    // Map settings
    if ( ! empty( $example_settings['logo'] ) ) {
        $settings['login_customization']['logo_enabled'] = true;
        $settings['login_customization']['logo_url'] = $example_settings['logo'];
    }
    $migrated = true;
}
```

### Testing Migration

Use the provided test script:

```bash
php tests/test-login-customization-migration.php
```

This verifies:
- Version detection works
- Settings structure is correct
- Reset functionality works
- Migration flags are set properly

## Best Practices

1. **Always backup** before major updates
2. **Test migration** on a staging site first
3. **Enable debug logging** during migration
4. **Document custom modifications** for easier troubleshooting
5. **Keep uploaded files** backed up separately

## Related Documentation

- [Login Page Customization User Guide](./USER-GUIDE.md)
- [MASE Migration System](./MIGRATION-GUIDE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
