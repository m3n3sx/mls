# Button System Migration Implementation

## Overview

Task 9 implementation adds automatic migration support for the Universal Button Styling System. The migration ensures existing MASE installations receive button styling defaults without breaking existing functionality.

## Implementation Details

### Migration Method

**Location:** `includes/class-mase-migration.php`

**Method:** `MASE_Migration::migrate_to_button_system()`

**Purpose:** Adds `universal_buttons` section to existing settings with defaults for all 6 button types and 5 states.

### Migration Flow

```
WordPress Load
    ↓
plugins_loaded hook (priority 5)
    ↓
mase_check_migration()
    ↓
MASE_Migration::maybe_migrate()
    ↓
MASE_Migration::maybe_migrate_to_button_system()
    ↓
MASE_Migration::migrate_to_button_system()
```

### Key Features

1. **Version Detection**: Checks current plugin version before running migration
2. **Idempotent**: Migration runs only once per installation (tracked via `mase_button_system_migration_completed` option)
3. **Non-Destructive**: Preserves all existing settings while adding button defaults
4. **Fallback Support**: Includes inline button defaults if `MASE_Settings::get_defaults()` doesn't have them yet
5. **Cache Clearing**: Automatically clears all caches after migration
6. **Logging**: Comprehensive WP_DEBUG logging for troubleshooting

### Button Types Migrated

- **Primary**: WordPress primary buttons (.button-primary)
- **Secondary**: Standard buttons (.button)
- **Danger**: Delete/destructive buttons (.button.delete, .submitdelete)
- **Success**: Success/confirmation buttons (.button.button-large)
- **Ghost**: Link-style buttons (.button-link)
- **Tabs**: Navigation tabs (.nav-tab)

### Button States

Each button type includes 5 states:
- Normal
- Hover
- Active
- Focus
- Disabled

### Properties Per State

Each state includes 25+ properties:
- Background (solid/gradient)
- Text color
- Border (width, style, color, radius)
- Padding (horizontal, vertical)
- Typography (size, weight, transform)
- Effects (shadow, transition, ripple)

## Testing

### Manual Testing

1. Install MASE v1.2.1 (without button system)
2. Configure some settings
3. Update to v1.3.0 (with button system)
4. Verify `universal_buttons` section exists in settings
5. Verify existing settings are preserved
6. Verify button styles apply correctly

### Automated Testing

Run the migration test script:

```bash
php tests/test-button-system-migration.php
```

**Test Coverage:**
- Migration method existence
- Integration with `maybe_migrate()`
- Button section creation
- All button types present
- All button states present
- All required properties present
- Migration completion flag
- Idempotent behavior (doesn't run twice)
- Version tracking

## Migration Completion Tracking

**Option Name:** `mase_button_system_migration_completed`

**Value:** `true` (after successful migration)

**Purpose:** Prevents migration from running multiple times

## Version Tracking

**Option Name:** `mase_version`

**Updated To:** Current MASE_VERSION constant (e.g., '1.3.0')

**Purpose:** Tracks plugin version for future migrations

## Logging

When `WP_DEBUG` is enabled, the migration logs:

1. Migration start
2. Current plugin version
3. Whether universal_buttons section already exists
4. Whether defaults were added successfully
5. Whether fallback defaults were used
6. Settings save result
7. Cache clearing confirmation
8. Version update confirmation
9. Migration completion

**Example Log Output:**

```
MASE: Starting Universal Button Styling System migration
MASE: Button system migration - current version: 1.2.1
MASE: Button system migration - added universal_buttons section with defaults
MASE: Button system migration - settings saved successfully
MASE: Button system migration - cleared all caches
MASE: Button system migration - updated plugin version to 1.3.0
MASE: Universal Button Styling System migration completed successfully
```

## Rollback

If migration causes issues:

1. Delete the completion flag:
   ```php
   delete_option('mase_button_system_migration_completed');
   ```

2. Remove the universal_buttons section:
   ```php
   $settings = get_option('mase_settings');
   unset($settings['universal_buttons']);
   update_option('mase_settings', $settings);
   ```

3. Clear caches:
   ```php
   $cache = new MASE_CacheManager();
   $cache->clear_all();
   ```

## Requirements Satisfied

✅ **Requirement 11.1**: Add button defaults if not present
- Migration checks for `universal_buttons` section
- Adds complete button defaults from `MASE_Settings::get_defaults()`
- Includes fallback defaults if needed

✅ **Task 9.1**: Create migration method
- `migrate_to_button_system()` method implemented
- Checks current plugin version
- Adds button defaults
- Updates plugin version
- Logs all operations

✅ **Task 9.2**: Hook migration into plugin activation
- Migration integrated into `MASE_Migration::maybe_migrate()`
- Called automatically via `plugins_loaded` hook
- Runs on every plugin load (but executes only once)
- Logs migration results

## Files Modified

1. **includes/class-mase-migration.php**
   - Added `maybe_migrate_to_button_system()` method
   - Added `migrate_to_button_system()` method
   - Added `get_button_defaults_fallback()` method
   - Updated `maybe_migrate()` to call button system migration

2. **modern-admin-styler.php**
   - No changes needed (migration hook already exists)

## Files Created

1. **tests/test-button-system-migration.php**
   - Comprehensive migration test script
   - 10 test cases covering all migration aspects

2. **docs/BUTTON-SYSTEM-MIGRATION.md**
   - This documentation file

## Next Steps

After migration is complete, users can:

1. Navigate to MASE Settings → Universal Buttons tab
2. Customize button styles for each type and state
3. Use live preview to see changes in real-time
4. Save settings to apply button styles site-wide

## Support

If migration fails:

1. Check WordPress debug log for error messages
2. Verify MASE_Settings class is loaded
3. Verify MASE_CacheManager class is loaded
4. Check database for `mase_button_system_migration_completed` option
5. Manually run migration test script for diagnostics
