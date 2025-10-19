# Task 18: Auto Palette Switching - Implementation Summary

## Overview
Implemented automatic palette switching functionality that changes color palettes based on time of day using WordPress cron jobs.

## Requirements Addressed
- **15.1**: Schedule hourly cron job for palette check
- **15.2**: Implement cron callback to call MASE_Settings::auto_switch_palette()
- **15.3**: Implement time-based palette selection logic
- **15.4**: Apply selected palette automatically
- **15.5**: Log palette switches for debugging

## Implementation Details

### 1. Cron Job Registration (Requirement 15.1)

#### Activation Hook
**File**: `modern-admin-styler.php`

Added cron job scheduling in the `mase_activate()` function:

```php
// Schedule hourly cron job for auto palette switching (Requirement 15.1).
if ( ! wp_next_scheduled( 'mase_auto_palette_switch' ) ) {
    wp_schedule_event( time(), 'hourly', 'mase_auto_palette_switch' );
}
```

**Features**:
- Checks if cron job is already scheduled to avoid duplicates
- Uses WordPress `wp_schedule_event()` with 'hourly' recurrence
- Hook name: `mase_auto_palette_switch`

#### Deactivation Hook
**File**: `modern-admin-styler.php`

Added cron job cleanup in the `mase_deactivate()` function:

```php
// Clear scheduled cron job (Requirement 15.1).
$timestamp = wp_next_scheduled( 'mase_auto_palette_switch' );
if ( $timestamp ) {
    wp_unschedule_event( $timestamp, 'mase_auto_palette_switch' );
}
```

**Features**:
- Removes scheduled cron job on plugin deactivation
- Prevents orphaned cron jobs
- Clean plugin deactivation

### 2. Cron Callback Implementation (Requirement 15.2)

**File**: `modern-admin-styler.php`

Created `mase_auto_palette_switch_callback()` function:

```php
function mase_auto_palette_switch_callback() {
    $settings = new MASE_Settings();
    
    // Check if auto-switching is enabled (Requirement 15.2).
    $options = $settings->get_option();
    if ( ! isset( $options['advanced']['auto_palette_switch'] ) || 
         ! $options['advanced']['auto_palette_switch'] ) {
        return;
    }
    
    // Execute auto palette switch (Requirements 15.3, 15.4).
    $result = $settings->auto_switch_palette();
    
    // Log palette switch for debugging (Requirement 15.5).
    if ( $result && defined( 'WP_DEBUG' ) && WP_DEBUG ) {
        $current_hour = intval( current_time( 'H' ) );
        $palette_id = $settings->get_palette_for_time( $current_hour );
        error_log( sprintf(
            'MASE: Auto palette switch executed at %s. Applied palette: %s',
            current_time( 'Y-m-d H:i:s' ),
            $palette_id
        ) );
    }
}

// Register cron callback (Requirement 15.1).
add_action( 'mase_auto_palette_switch', 'mase_auto_palette_switch_callback' );
```

**Features**:
- Checks if auto-switching is enabled before proceeding
- Calls `MASE_Settings::auto_switch_palette()` method
- Logs successful palette switches when WP_DEBUG is enabled
- Includes timestamp and palette ID in log messages
- Registered to WordPress action hook

### 3. Time-Based Palette Selection (Requirements 15.3, 15.4)

**Note**: The `auto_switch_palette()` and `get_palette_for_time()` methods already existed in `MASE_Settings` class from previous tasks.

#### auto_switch_palette() Method
**File**: `includes/class-mase-settings.php` (lines 2948-2976)

```php
public function auto_switch_palette() {
    $settings = $this->get_option();
    
    // Check if auto-switching is enabled.
    if ( ! isset( $settings['advanced']['auto_palette_switch'] ) || 
         ! $settings['advanced']['auto_palette_switch'] ) {
        return false;
    }

    $current_hour = intval( current_time( 'H' ) );
    $palette_id = $this->get_palette_for_time( $current_hour );
    
    // Check if palette needs to change.
    $current_palette = isset( $settings['palettes']['current'] ) ? 
                       $settings['palettes']['current'] : '';
    
    if ( $palette_id === $current_palette ) {
        return false;
    }

    // Apply the palette for current time.
    return $this->apply_palette( $palette_id );
}
```

**Features**:
- Checks if auto-switching is enabled
- Gets current hour using WordPress `current_time()` function
- Determines appropriate palette for current time
- Avoids unnecessary palette changes if already active
- Applies palette automatically using existing `apply_palette()` method

#### get_palette_for_time() Method
**File**: `includes/class-mase-settings.php` (lines 2978-3003)

```php
public function get_palette_for_time( $hour ) {
    $settings = $this->get_option();
    $time_palettes = isset( $settings['advanced']['auto_palette_times'] ) ? 
                     $settings['advanced']['auto_palette_times'] : array();

    // Default time periods.
    if ( $hour >= 6 && $hour < 12 ) {
        // Morning: 6:00-11:59.
        return isset( $time_palettes['morning'] ) ? 
               $time_palettes['morning'] : 'professional-blue';
    } elseif ( $hour >= 12 && $hour < 18 ) {
        // Afternoon: 12:00-17:59.
        return isset( $time_palettes['afternoon'] ) ? 
               $time_palettes['afternoon'] : 'energetic-green';
    } elseif ( $hour >= 18 && $hour < 22 ) {
        // Evening: 18:00-21:59.
        return isset( $time_palettes['evening'] ) ? 
               $time_palettes['evening'] : 'warm-orange';
    } else {
        // Night: 22:00-5:59.
        return isset( $time_palettes['night'] ) ? 
               $time_palettes['night'] : 'creative-purple';
    }
}
```

**Time Period Mapping**:
- **Morning**: 6:00-11:59 → Default: professional-blue
- **Afternoon**: 12:00-17:59 → Default: energetic-green
- **Evening**: 18:00-21:59 → Default: warm-orange
- **Night**: 22:00-5:59 → Default: creative-purple

### 4. Debug Logging (Requirement 15.5)

**File**: `modern-admin-styler.php`

Implemented in the cron callback:

```php
if ( $result && defined( 'WP_DEBUG' ) && WP_DEBUG ) {
    $current_hour = intval( current_time( 'H' ) );
    $palette_id = $settings->get_palette_for_time( $current_hour );
    error_log( sprintf(
        'MASE: Auto palette switch executed at %s. Applied palette: %s',
        current_time( 'Y-m-d H:i:s' ),
        $palette_id
    ) );
}
```

**Features**:
- Only logs when WP_DEBUG is enabled
- Includes timestamp of palette switch
- Includes palette ID that was applied
- Uses WordPress `error_log()` function
- Formatted log message for easy debugging

### 5. UI Toggle and Selectors

**Note**: The UI elements already existed in `admin-settings-page.php` from previous tasks.

#### Enable/Disable Toggle
**File**: `includes/admin-settings-page.php` (lines 1787-1806)

```php
<label class="mase-toggle-switch">
    <input 
        type="checkbox" 
        id="advanced-auto-palette-switch"
        name="advanced[auto_palette_switch]" 
        value="1"
        <?php checked( $settings['advanced']['auto_palette_switch'] ?? false, true ); ?>
    />
    <span class="mase-toggle-slider"></span>
</label>
```

#### Time-Based Palette Selectors
**File**: `includes/admin-settings-page.php` (lines 1808-1877)

Four dropdown selectors for:
- Morning (6:00-11:59)
- Afternoon (12:00-17:59)
- Evening (18:00-21:59)
- Night (22:00-5:59)

Each selector:
- Lists all available palettes
- Saves to `advanced[auto_palette_times][period]`
- Has conditional display based on toggle state

### 6. Conditional Field Display

**File**: `assets/js/mase-admin.js`

Added `initConditionalFields()` method:

```javascript
initConditionalFields: function() {
    var self = this;
    
    // Handle auto palette switch toggle (Requirement 15.6)
    var $autoSwitchToggle = $('#advanced-auto-palette-switch');
    var $conditionalFields = $('.mase-conditional[data-depends-on="advanced-auto-palette-switch"]');
    
    // Function to toggle conditional fields
    function toggleConditionalFields() {
        if ($autoSwitchToggle.is(':checked')) {
            $conditionalFields.show();
        } else {
            $conditionalFields.hide();
        }
    }
    
    // Initialize on page load
    toggleConditionalFields();
    
    // Bind change event
    $autoSwitchToggle.on('change', toggleConditionalFields);
    
    // Handle other conditional fields generically
    $('[data-depends-on]').each(function() {
        var $field = $(this);
        var dependsOn = $field.data('depends-on');
        var $dependency = $('#' + dependsOn);
        
        if ($dependency.length) {
            function checkDependency() {
                if ($dependency.is(':checkbox')) {
                    if ($dependency.is(':checked')) {
                        $field.show();
                    } else {
                        $field.hide();
                    }
                }
            }
            
            checkDependency();
            $dependency.on('change', checkDependency);
        }
    });
}
```

**Features**:
- Shows time selectors when toggle is ON
- Hides time selectors when toggle is OFF
- Updates dynamically on toggle change
- Generic implementation for other conditional fields
- Called in `init()` method

## Files Modified

### 1. modern-admin-styler.php
- Added cron job scheduling in `mase_activate()`
- Added cron job cleanup in `mase_deactivate()`
- Created `mase_auto_palette_switch_callback()` function
- Registered action hook for cron callback

### 2. assets/js/mase-admin.js
- Added `initConditionalFields()` method
- Called `initConditionalFields()` in `init()` method
- Implemented show/hide logic for conditional fields

## Testing

### Manual Testing Steps

1. **Activate Plugin**:
   ```bash
   wp plugin activate modern-admin-styler
   wp cron event list
   # Verify 'mase_auto_palette_switch' is scheduled
   ```

2. **Test UI Toggle**:
   - Go to Admin Styler → Advanced tab
   - Toggle "Enable Auto Switching" OFF → time selectors hidden
   - Toggle "Enable Auto Switching" ON → time selectors visible

3. **Configure Time Palettes**:
   - Select different palettes for each time period
   - Save settings
   - Reload page and verify selections persist

4. **Test Cron Execution**:
   ```bash
   # Enable WP_DEBUG in wp-config.php
   wp cron event run mase_auto_palette_switch
   # Check debug.log for palette switch messages
   ```

5. **Test Time-Based Switching**:
   - Set different palettes for morning/afternoon/evening/night
   - Wait for hourly cron or trigger manually
   - Verify palette changes based on current time

6. **Deactivate Plugin**:
   ```bash
   wp plugin deactivate modern-admin-styler
   wp cron event list
   # Verify 'mase_auto_palette_switch' is removed
   ```

### Test File
Created comprehensive test file: `tests/test-task-18-auto-palette-switching.html`

## Verification Checklist

- [x] Cron job scheduled on plugin activation
- [x] Cron job removed on plugin deactivation
- [x] Cron callback checks if auto-switching is enabled
- [x] Cron callback calls auto_switch_palette() method
- [x] Time-based palette selection logic implemented
- [x] Palette applied automatically based on time
- [x] Debug logging when WP_DEBUG is enabled
- [x] UI toggle for enabling/disabling auto switching
- [x] UI selectors for time-based palette assignments
- [x] Conditional field display based on toggle state
- [x] Settings validation for auto_palette_times array
- [x] Settings persistence across page loads

## Integration Points

### With Existing Code
- Uses existing `MASE_Settings::auto_switch_palette()` method
- Uses existing `MASE_Settings::get_palette_for_time()` method
- Uses existing `MASE_Settings::apply_palette()` method
- Uses existing UI elements in admin-settings-page.php
- Uses existing settings validation in MASE_Settings

### WordPress Integration
- Uses WordPress cron system (`wp_schedule_event`, `wp_unschedule_event`)
- Uses WordPress time functions (`current_time()`)
- Uses WordPress logging (`error_log()`)
- Uses WordPress activation/deactivation hooks
- Uses WordPress action hooks

## Performance Considerations

1. **Cron Efficiency**:
   - Returns early if auto-switching is disabled
   - Avoids unnecessary palette changes if already active
   - Runs hourly (not too frequent)

2. **Database Queries**:
   - Single settings query per cron execution
   - Uses existing palette application logic
   - No additional database overhead

3. **Logging**:
   - Only logs when WP_DEBUG is enabled
   - Minimal log message size
   - No performance impact in production

## Security Considerations

1. **Cron Security**:
   - Uses WordPress cron system (secure by default)
   - No external cron access required
   - Callback function is internal

2. **Settings Validation**:
   - Uses existing validation in MASE_Settings
   - Palette IDs validated before application
   - No user input in cron callback

3. **Logging Security**:
   - Only logs when WP_DEBUG is enabled
   - No sensitive data in log messages
   - Uses WordPress error_log()

## Conclusion

Task 18 has been successfully implemented with all requirements met:

1. ✅ Cron job registration for hourly palette checks
2. ✅ Cron callback implementation
3. ✅ Time-based palette selection logic
4. ✅ Automatic palette application
5. ✅ Debug logging for troubleshooting
6. ✅ UI toggle for enabling/disabling
7. ✅ UI selectors for time-based assignments
8. ✅ Conditional field display

The implementation integrates seamlessly with existing code and follows WordPress best practices for cron jobs, logging, and settings management.
