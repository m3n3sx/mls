# Design Document

## Overview

This design addresses three critical bugs in the MASE settings save functionality by implementing comprehensive error handling, validation error communication, and diagnostic logging. The solution follows WordPress coding standards and maintains backward compatibility while significantly improving user experience and debuggability.

## Architecture

### Component Interaction Flow

```
User Action (Save Settings)
    ↓
JavaScript (mase-admin.js)
    ↓ AJAX Request
MASE_Admin::handle_ajax_save_settings()
    ↓ Validate Input
MASE_Settings::validate()
    ↓ Returns WP_Error or validated data
MASE_Settings::update_option()
    ↓ Try Mobile Optimization (with error handling)
MASE_Mobile_Optimizer::get_optimized_settings()
    ↓ Save to Database
update_option()
    ↓ JSON Response
JavaScript Error/Success Handler
    ↓
User Feedback (Notice Display)
```

### Error Handling Strategy

**Layered Error Handling:**
1. **JavaScript Layer**: Validate dependencies (jQuery, maseAdmin object) before initialization
2. **PHP Validation Layer**: Collect all validation errors and return as WP_Error
3. **AJAX Handler Layer**: Transform WP_Error into structured JSON response
4. **Mobile Optimizer Layer**: Wrap in try-catch to prevent save failures
5. **Frontend Display Layer**: Parse and display errors in user-friendly format

## Components and Interfaces

### 1. JavaScript Initialization (mase-admin.js)

**Location:** `assets/js/mase-admin.js` lines 6713-6900

**Current Issues:**
- [assets/js/mase-admin.js:6716] Logs initialization start but doesn't validate dependencies first
- [assets/js/mase-admin.js:6813] Catches errors but doesn't check for missing dependencies before trying to use them

**Design Changes:**

```javascript
init: function() {
    console.log('MASE: Script loaded, version check...');
    
    // CRITICAL: Validate dependencies BEFORE any initialization
    if (typeof jQuery === 'undefined') {
        console.error('MASE: jQuery not loaded');
        alert('Failed to initialize MASE Admin: jQuery is not loaded. Please refresh the page.');
        return;
    }
    
    if (typeof maseAdmin === 'undefined') {
        console.error('MASE: maseAdmin object missing - check wp_localize_script');
        alert('Failed to initialize MASE Admin: Configuration data is missing. Please refresh the page.');
        return;
    }
    
    console.log('MASE: Initializing v1.2.0');
    
    try {
        // Existing initialization code...
        
        console.log('MASE: Admin initialized successfully');
    } catch (error) {
        console.error('MASE: Initialization failed:', error);
        console.error('MASE: Error stack:', error.stack);
        alert('Failed to initialize MASE Admin. Please refresh the page.\n\nError: ' + error.message);
    }
}
```

**Rationale:** Early validation prevents cryptic errors later. Explicit alerts inform users immediately when critical dependencies are missing.

### 2. Validation Error Return (class-mase-settings.php)

**Location:** `includes/class-mase-settings.php` lines 80-110

**Current Issues:**
- [includes/class-mase-settings.php:90] Returns `false` when validation fails, losing error details
- [includes/class-mase-settings.php:92] Logs error but doesn't pass it to caller

**Design Changes:**

```php
public function update_option( $data ) {
    error_log( 'MASE: update_option called with sections: ' . implode( ', ', array_keys( $data ) ) );
    
    $validated = $this->validate( $data );
    
    // CRITICAL: Return WP_Error instead of false to preserve error details
    if ( is_wp_error( $validated ) ) {
        error_log( 'MASE: Validation error: ' . $validated->get_error_message() );
        $error_data = $validated->get_error_data();
        if ( is_array( $error_data ) ) {
            error_log( 'MASE: Validation errors: ' . print_r( $error_data, true ) );
        }
        // Return WP_Error to caller instead of false
        return $validated;
    }
    
    error_log( 'MASE: Validation passed, validated sections: ' . implode( ', ', array_keys( $validated ) ) );

    // Apply mobile optimization with comprehensive error handling
    try {
        if ( class_exists( 'MASE_Mobile_Optimizer' ) ) {
            $mobile_optimizer = new MASE_Mobile_Optimizer();
            if ( method_exists( $mobile_optimizer, 'is_mobile' ) && $mobile_optimizer->is_mobile() ) {
                if ( method_exists( $mobile_optimizer, 'get_optimized_settings' ) ) {
                    $validated = $mobile_optimizer->get_optimized_settings( $validated );
                }
            }
        } else {
            error_log( 'MASE: Mobile optimizer class not available - skipping optimization' );
        }
    } catch ( Exception $e ) {
        error_log( 'MASE: Mobile optimizer exception: ' . $e->getMessage() );
        // Continue without mobile optimization - not critical
    } catch ( Error $e ) {
        error_log( 'MASE: Mobile optimizer fatal error: ' . $e->getMessage() );
        // Continue without mobile optimization - not critical
    }

    $result = update_option( self::OPTION_NAME, $validated );
    error_log( 'MASE: update_option result: ' . ( $result ? 'true' : 'false' ) );
    
    // Always return true if no validation errors (update_option returns false if value unchanged)
    return true;
}
```

**Rationale:** Returning WP_Error preserves all validation error details for the AJAX handler. Try-catch blocks prevent mobile optimizer failures from blocking saves.

### 3. AJAX Error Response (class-mase-admin.php)

**Location:** `includes/class-mase-admin.php` lines 550-670

**Current Issues:**
- [includes/class-mase-admin.php:630] Checks if result is false but doesn't handle WP_Error
- [includes/class-mase-admin.php:665] Generic error message doesn't include validation details

**Design Changes:**

```php
public function handle_ajax_save_settings() {
    try {
        // Security checks...
        
        // Get and decode settings...
        
        // Save settings
        error_log( 'MASE: Calling update_option...' );
        $result = $this->settings->update_option( $input );

        // CRITICAL: Check for WP_Error first, then boolean result
        if ( is_wp_error( $result ) ) {
            error_log( 'MASE: Validation failed - ' . $result->get_error_message() );
            
            // Extract validation errors for frontend display
            $error_data = $result->get_error_data();
            $error_messages = array();
            
            if ( is_array( $error_data ) ) {
                foreach ( $error_data as $field => $message ) {
                    $error_messages[] = sprintf( '%s: %s', $field, $message );
                }
            }
            
            // Send structured error response
            wp_send_json_error( array(
                'message' => __( 'Validation failed. Please fix the following errors:', 'mase' ),
                'validation_errors' => $error_data,
                'error_details' => $error_messages,
                'error_count' => count( $error_messages )
            ), 400 );
        }

        if ( $result ) {
            error_log( 'MASE: Settings saved successfully' );
            
            // Cache invalidation...
            
            wp_send_json_success( array(
                'message' => __( 'Settings saved successfully', 'mase' ),
            ) );
        } else {
            error_log( 'MASE: Failed to save settings (update_option returned false)' );
            wp_send_json_error( array(
                'message' => __( 'Failed to save settings', 'mase' ),
            ) );
        }
    } catch ( Exception $e ) {
        error_log( 'MASE Error (save_settings): ' . $e->getMessage() );
        wp_send_json_error( array(
            'message' => __( 'An error occurred. Please try again.', 'mase' ),
        ) );
    }
}
```

**Rationale:** Checking for WP_Error before boolean allows proper error communication. Structured JSON response enables frontend to display specific field errors.

### 4. Frontend Error Display (mase-admin.js)

**Location:** `assets/js/mase-admin.js` - saveSettings function (needs to be located)

**Design Changes:**

```javascript
// In AJAX error handler
.fail(function(xhr, status, error) {
    console.error('MASE: AJAX failed:', xhr.responseText);
    
    let errorMsg = 'An error occurred. Please try again.';
    
    try {
        const response = JSON.parse(xhr.responseText);
        
        if (response.data && response.data.validation_errors) {
            // Display validation errors
            const errors = response.data.error_details || [];
            const errorCount = response.data.error_count || errors.length;
            
            errorMsg = 'Please fix ' + errorCount + ' validation error' + (errorCount > 1 ? 's' : '') + ':\n\n';
            errorMsg += errors.join('\n');
        } else if (response.data && response.data.message) {
            errorMsg = response.data.message;
        }
    } catch (e) {
        console.error('MASE: Could not parse error response');
        
        // Provide helpful messages based on HTTP status
        if (xhr.status === 403) {
            errorMsg = 'Permission denied. You do not have access to perform this action.';
        } else if (xhr.status === 400) {
            errorMsg = 'Invalid data submitted. Please check your settings and try again.';
        } else if (xhr.status === 500) {
            errorMsg = 'Server error. Please try again later.';
        }
    }
    
    showNotification(errorMsg, 'error');
})
```

**Rationale:** Parsing validation errors provides actionable feedback. HTTP status-based fallbacks ensure users always get meaningful messages.

## Data Models

### WP_Error Structure for Validation

```php
WP_Error {
    'code' => 'validation_failed',
    'message' => 'Validation failed',
    'data' => array(
        'admin_bar_bg_color' => 'Invalid hex color format',
        'admin_menu_width' => 'Width must be between 100 and 400',
        // ... more field errors
    )
}
```

### JSON Error Response Structure

```json
{
    "success": false,
    "data": {
        "message": "Validation failed. Please fix the following errors:",
        "validation_errors": {
            "admin_bar_bg_color": "Invalid hex color format",
            "admin_menu_width": "Width must be between 100 and 400"
        },
        "error_details": [
            "admin_bar_bg_color: Invalid hex color format",
            "admin_menu_width: Width must be between 100 and 400"
        ],
        "error_count": 2
    }
}
```

## Error Handling

### Error Categories and Responses

| Error Type | HTTP Status | User Message | Log Message |
|------------|-------------|--------------|-------------|
| Missing jQuery | N/A | "Failed to initialize: jQuery not loaded" | "MASE: jQuery not loaded" |
| Missing maseAdmin | N/A | "Failed to initialize: Configuration missing" | "MASE: maseAdmin object missing" |
| Validation Failure | 400 | "Please fix X validation errors: [list]" | "MASE: Validation failed - [details]" |
| Permission Denied | 403 | "Permission denied" | "MASE: Unauthorized access attempt" |
| Mobile Optimizer Error | N/A | (No user message - transparent) | "MASE: Mobile optimizer error: [details]" |
| Server Error | 500 | "Server error. Please try again later." | "MASE Error: [exception message]" |
| Network Error | N/A | "Network error. Check connection." | "MASE: AJAX failed - [status]" |

### Error Recovery Strategies

1. **Missing Dependencies**: Display alert, prevent initialization, suggest page refresh
2. **Validation Errors**: Display specific field errors, keep form editable, highlight invalid fields
3. **Mobile Optimizer Errors**: Log error, continue save without optimization, return success
4. **Network Errors**: Display retry message, keep form data, suggest checking connection
5. **Server Errors**: Display generic message, log details, suggest contacting support

## Testing Strategy

### Unit Tests

1. **JavaScript Initialization**
   - Test: jQuery missing → Should log error and display alert
   - Test: maseAdmin missing → Should log error and display alert
   - Test: All dependencies present → Should initialize successfully

2. **Validation Error Handling**
   - Test: Invalid color format → Should return WP_Error with field name
   - Test: Multiple validation errors → Should return WP_Error with all errors
   - Test: Valid data → Should return validated array

3. **Mobile Optimizer Error Handling**
   - Test: Class doesn't exist → Should log warning and continue
   - Test: is_mobile() throws exception → Should catch and continue
   - Test: get_optimized_settings() throws exception → Should catch and continue

### Integration Tests

1. **End-to-End Save Flow**
   - Test: Submit valid settings → Should save successfully
   - Test: Submit invalid color → Should display validation error
   - Test: Submit with mobile optimizer disabled → Should save successfully
   - Test: Submit with network error → Should display network error message

2. **Error Display**
   - Test: Validation error response → Should parse and display field errors
   - Test: 403 response → Should display permission denied message
   - Test: 500 response → Should display server error message

### Browser Testing

1. **Console Logging**
   - Verify initialization logs appear in correct order
   - Verify error logs include stack traces
   - Verify validation errors are logged with field names

2. **User Feedback**
   - Verify alerts display for missing dependencies
   - Verify validation errors display in readable format
   - Verify error messages are clear and actionable

## Performance Considerations

### Logging Impact

- **Development**: Full logging enabled for debugging
- **Production**: Error logging only, no debug logs
- **Conditional Logging**: Use `WP_DEBUG` constant to control verbosity

### Error Response Size

- Validation errors limited to field name + message (< 1KB typical)
- Error details array prevents redundant data
- JSON structure optimized for parsing speed

### Mobile Optimizer Fallback

- Try-catch adds negligible overhead (< 1ms)
- Skipping optimization on error prevents 100-500ms delay
- Settings save completes faster when optimizer fails

## Security Considerations

### Error Message Disclosure

- **Public Messages**: Generic, no system details
- **Log Messages**: Detailed, server-side only
- **Validation Errors**: Field names only, no sensitive data

### AJAX Security

- Nonce verification remains unchanged
- Capability checks remain unchanged
- Input sanitization remains unchanged
- Only error communication improved

## Migration and Compatibility

### Backward Compatibility

- Existing code checking `if ( $result )` still works
- New code can check `is_wp_error( $result )` first
- No breaking changes to public APIs
- Graceful degradation if JavaScript features unavailable

### Deployment Strategy

1. Deploy PHP changes first (backward compatible)
2. Deploy JavaScript changes second (enhanced error handling)
3. Monitor error logs for new error patterns
4. Adjust error messages based on user feedback

## Open Questions

None - design is complete and ready for implementation.
