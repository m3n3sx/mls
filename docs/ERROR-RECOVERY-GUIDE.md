# Error Recovery System Guide

## Overview

The MASE Error Recovery System provides comprehensive error handling and recovery mechanisms for the Advanced Background System. It ensures graceful degradation and user-friendly error messages when operations fail.

**Task 44: Implement error recovery (Requirement 7.5)**

## Features

### 1. Automatic Retry with Exponential Backoff

Failed operations are automatically retried with increasing delays:

- **First retry**: 1 second delay
- **Second retry**: 2 seconds delay  
- **Third retry**: 4 seconds delay
- **Maximum retries**: 3 attempts (configurable)

### 2. Fallback to Cached CSS

When CSS generation fails, the system falls back through multiple strategies:

1. **Mode-specific cache**: Try cached CSS for current mode (light/dark)
2. **Legacy cache**: Try general cached CSS
3. **Minimal safe CSS**: Generate basic WordPress admin styling

### 3. Upload Error Recovery

File uploads include comprehensive error handling:

- **Client-side validation**: File type, size, and content validation before upload
- **Progress tracking**: Real-time upload progress feedback
- **Retry mechanism**: Automatic retry on network failures
- **User-friendly messages**: Clear error messages for all failure scenarios

### 4. Network Status Monitoring

The system monitors network connectivity:

- **Online/offline detection**: Automatic detection of network status changes
- **User notifications**: Alerts when connection is lost or restored
- **Graceful degradation**: Operations queue when offline

### 5. Error Logging

Comprehensive error logging for debugging:

- **Client-side errors**: JavaScript errors logged to server (when WP_DEBUG enabled)
- **Server-side errors**: PHP errors logged with full context
- **Error categorization**: Errors categorized by type (network, validation, server)

## Usage

### JavaScript Error Recovery

#### Upload with Retry

```javascript
// Upload file with automatic retry
MASE.errorRecovery.uploadWithRetry(file, {
    area: 'dashboard',
    onProgress: function(percent) {
        console.log('Upload progress: ' + percent + '%');
    },
    onRetry: function(attempt, maxRetries) {
        console.log('Retrying upload (' + attempt + '/' + maxRetries + ')');
    }
})
.then(function(result) {
    console.log('Upload successful:', result);
})
.catch(function(error) {
    console.error('Upload failed:', error);
});
```

#### Retry Any Operation

```javascript
// Retry any async operation
MASE.errorRecovery.retryOperation(
    function() {
        return $.ajax({
            url: maseAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'mase_some_action',
                nonce: maseAdmin.nonce
            }
        });
    },
    {
        maxRetries: 3,
        baseDelay: 1000,
        onRetry: function(attempt, maxRetries, delay) {
            console.log('Retry ' + attempt + '/' + maxRetries + ' in ' + delay + 'ms');
        },
        onError: function(error) {
            console.error('Operation failed:', error);
        }
    }
)
.then(function(result) {
    console.log('Success:', result);
})
.catch(function(error) {
    console.error('Failed after retries:', error);
});
```

#### Validate File Before Upload

```javascript
// Validate file client-side
var validation = MASE.errorRecovery.validateFile(file);

if (!validation.valid) {
    console.error('Validation failed:', validation.message);
    return;
}

// Proceed with upload
```

#### Log Client-Side Errors

```javascript
// Log error for debugging
MASE.errorRecovery.logError('background_upload', error, {
    area: 'dashboard',
    fileSize: file.size,
    fileType: file.type
});
```

### PHP Error Recovery

#### CSS Generation with Fallback

```php
try {
    // Generate CSS
    $css = $this->generator->generate( $settings );
} catch ( Exception $e ) {
    // Log error
    error_log( 'CSS generation failed: ' . $e->getMessage() );
    
    // Try cached CSS
    $cache = new MASE_Cache();
    $css = $cache->get_cached_css();
    
    // Fallback to minimal safe CSS
    if ( false === $css ) {
        $css = $this->generate_minimal_safe_css();
    }
}
```

#### Upload Error Handling

```php
// Check upload errors
if ( $file['error'] !== UPLOAD_ERR_OK ) {
    $error_message = $this->get_upload_error_message( $file['error'] );
    
    error_log( sprintf(
        'Upload failed - Error code: %d, Message: %s',
        $file['error'],
        $error_message
    ) );
    
    wp_send_json_error( array(
        'message' => $error_message,
    ), 400 );
}
```

## Error Messages

### User-Friendly Messages

All error messages are translated and user-friendly:

- **Network errors**: "Network error. Please check your internet connection."
- **Timeout**: "Request timed out. Please check your connection and try again."
- **Permission denied**: "Permission denied. You do not have access to perform this action."
- **File too large**: "File size exceeds 5MB limit. Current size: X.XX MB"
- **Invalid file type**: "Invalid file type. Only JPG, PNG, WebP, and SVG files are allowed."

### Error Codes

Errors are categorized for logging:

- `NETWORK_ERROR`: Network connectivity issues
- `CLIENT_ERROR`: Client-side validation or request errors (4xx)
- `SERVER_ERROR`: Server-side processing errors (5xx)
- `VALIDATION_ERROR`: File or input validation failures
- `UNKNOWN_ERROR`: Unclassified errors

## Configuration

### Retry Settings

Configure retry behavior:

```javascript
// Set maximum retries
MASE.errorRecovery.maxRetries = 3;

// Set base delay (milliseconds)
MASE.errorRecovery.baseDelay = 1000;
```

### Cache Duration

Configure cache duration in settings:

```php
$settings['performance']['cache_duration'] = 3600; // 1 hour
```

## Debugging

### Enable Debug Mode

Enable WordPress debug mode to see detailed error logs:

```php
// wp-config.php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
```

### View Error Logs

Check error logs:

```bash
# WordPress debug log
tail -f wp-content/debug.log

# Server error log (location varies)
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log
```

### Client-Side Error Logging

Client-side errors are automatically logged to the server when WP_DEBUG is enabled:

```javascript
// Errors are automatically logged
try {
    // Some operation
} catch (error) {
    MASE.errorRecovery.logError('operation_name', error, {
        additionalContext: 'value'
    });
}
```

## Best Practices

### 1. Always Validate Input

Validate files and data before processing:

```javascript
// Client-side validation
var validation = MASE.errorRecovery.validateFile(file);
if (!validation.valid) {
    MASE.errorRecovery.showNotice(validation.message, 'error');
    return;
}
```

### 2. Provide User Feedback

Show progress and status to users:

```javascript
MASE.errorRecovery.uploadWithRetry(file, {
    onProgress: function(percent) {
        // Update progress bar
        $('.upload-progress').css('width', percent + '%');
    },
    onRetry: function(attempt, maxRetries) {
        // Show retry message
        MASE.errorRecovery.showNotice(
            'Upload failed. Retrying (' + attempt + '/' + maxRetries + ')...',
            'warning'
        );
    }
});
```

### 3. Log Errors for Debugging

Always log errors with context:

```php
error_log( sprintf(
    'MASE: Operation failed - Context: %s, Error: %s, User: %d',
    $context,
    $error->getMessage(),
    get_current_user_id()
) );
```

### 4. Use Fallback Strategies

Implement multiple fallback strategies:

```php
// Try primary method
$result = $this->primary_method();

// Fallback to secondary method
if ( false === $result ) {
    $result = $this->secondary_method();
}

// Fallback to minimal safe method
if ( false === $result ) {
    $result = $this->minimal_safe_method();
}
```

## Troubleshooting

### Upload Failures

**Problem**: Uploads fail repeatedly

**Solutions**:
1. Check file size (max 5MB)
2. Check file type (JPG, PNG, WebP, SVG only)
3. Check server upload limits (`upload_max_filesize`, `post_max_size`)
4. Check disk space on server
5. Check file permissions on upload directory

### CSS Generation Failures

**Problem**: CSS not generating

**Solutions**:
1. Check error logs for specific error
2. Verify settings are valid
3. Clear all caches
4. Check PHP memory limit
5. Verify file permissions

### Network Errors

**Problem**: Frequent network errors

**Solutions**:
1. Check internet connection
2. Check server connectivity
3. Increase timeout settings
4. Check firewall rules
5. Verify AJAX URL is correct

## Security Considerations

### Nonce Verification

All AJAX requests verify nonces:

```php
check_ajax_referer( 'mase_save_settings', 'nonce' );
```

### Capability Checks

All operations check user capabilities:

```php
if ( ! current_user_can( 'manage_options' ) ) {
    wp_send_json_error( array( 'message' => 'Unauthorized' ), 403 );
}
```

### Input Sanitization

All input is sanitized:

```php
$input = sanitize_text_field( wp_unslash( $_POST['input'] ) );
```

### File Validation

Files are validated for type, size, and content:

```php
// Type validation
$allowed_types = array( 'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml' );
if ( ! in_array( $file['type'], $allowed_types, true ) ) {
    wp_send_json_error( array( 'message' => 'Invalid file type' ), 400 );
}

// Size validation
if ( $file['size'] > 5 * 1024 * 1024 ) {
    wp_send_json_error( array( 'message' => 'File too large' ), 400 );
}

// SVG sanitization
if ( $file['type'] === 'image/svg+xml' ) {
    $svg_content = $this->sanitize_svg( file_get_contents( $file['tmp_name'] ) );
}
```

## Performance Impact

The error recovery system is designed for minimal performance impact:

- **Retry delays**: Only occur on failures (exponential backoff)
- **Cache fallbacks**: Fast memory/database lookups
- **Client-side validation**: Prevents unnecessary server requests
- **Error logging**: Only when WP_DEBUG enabled

## Related Documentation

- [Advanced Background System Design](../specs/advanced-background-system/design.md)
- [Browser Compatibility Guide](BROWSER-COMPATIBILITY-GUIDE.md)
- [WebP Support Implementation](WEBP-DEVELOPER-GUIDE.md)
- [Performance Optimization](PERFORMANCE-OPTIMIZATION.md)

## Support

For issues or questions:

1. Check error logs (`wp-content/debug.log`)
2. Review this documentation
3. Check browser console for JavaScript errors
4. Enable WP_DEBUG for detailed logging
5. Contact support with error logs and context
