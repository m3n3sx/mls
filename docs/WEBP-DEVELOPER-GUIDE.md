# WebP Support Developer Guide

## Quick Reference

This guide explains how to use the WebP support functionality in the MASE Advanced Background System.

## For Plugin Developers

### Getting Optimized Image URL

```php
// Get MASE_Admin instance
$admin = new MASE_Admin();

// Get optimized URL (WebP if supported, original otherwise)
$optimized_url = $admin->get_optimized_image_url( $attachment_id );

// Use in your code
echo '<div style="background-image: url(' . esc_url( $optimized_url ) . ')"></div>';
```

### Manual WebP Generation

```php
// Generate WebP version of an image
$admin = new MASE_Admin();
$webp_url = $admin->generate_webp_version( $attachment_id );

if ( $webp_url ) {
    // WebP generated successfully
    echo 'WebP URL: ' . $webp_url;
} else {
    // WebP generation failed, use original
    $original_url = wp_get_attachment_url( $attachment_id );
}
```

### Background Settings Structure

```php
$background_config = array(
    'enabled' => true,
    'type' => 'image',
    'image_url' => 'https://example.com/uploads/image.webp',  // Optimized URL
    'original_url' => 'https://example.com/uploads/image.jpg', // Fallback URL
    'image_id' => 123,
    'position' => 'center center',
    'size' => 'cover',
    'repeat' => 'no-repeat',
    'attachment' => 'scroll',
    'opacity' => 100,
    'blend_mode' => 'normal'
);
```

## For Theme Developers

### Using WebP in Custom CSS

```css
/* Method 1: CSS image-set() (recommended) */
.my-element {
    background-image: url('image.jpg'); /* Fallback */
    background-image: -webkit-image-set(
        url('image.webp') 1x,
        url('image.jpg') 1x
    );
    background-image: image-set(
        url('image.webp') type("image/webp"),
        url('image.jpg')
    );
}

/* Method 2: Feature detection with @supports */
.my-element {
    background-image: url('image.jpg');
}

@supports (background-image: image-set(url('test.webp') type("image/webp"))) {
    .my-element {
        background-image: url('image.webp');
    }
}
```

### JavaScript Detection

```javascript
// Detect WebP support
function supportsWebP() {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}

// Use detection
if (supportsWebP()) {
    console.log('Browser supports WebP');
    // Load WebP images
} else {
    console.log('Browser does not support WebP');
    // Load JPG/PNG images
}
```

## For Frontend Developers

### AJAX Response Structure

When uploading or selecting images, the AJAX response includes:

```json
{
    "success": true,
    "data": {
        "message": "Background image uploaded successfully.",
        "attachment_id": 123,
        "url": "https://example.com/uploads/image.webp",
        "original_url": "https://example.com/uploads/image.jpg",
        "thumbnail": "https://example.com/uploads/image-150x150.jpg"
    }
}
```

### Using in JavaScript

```javascript
// After successful upload
$.ajax({
    url: maseAdmin.ajaxUrl,
    type: 'POST',
    data: formData,
    success: function(response) {
        if (response.success) {
            const webpUrl = response.data.url;
            const originalUrl = response.data.original_url;
            
            // Use WebP URL for modern browsers
            // CSS image-set() will handle fallback automatically
            $('.background-preview').css({
                'background-image': 'url(' + webpUrl + ')'
            });
        }
    }
});
```

## Browser Support Matrix

| Browser | Version | WebP Support | Fallback |
|---------|---------|--------------|----------|
| Chrome | 32+ | ✅ Yes | N/A |
| Firefox | 65+ | ✅ Yes | N/A |
| Edge | 18+ | ✅ Yes | N/A |
| Safari | 14+ | ✅ Yes | N/A |
| Safari | 13- | ❌ No | JPG/PNG |
| IE | 11 | ❌ No | JPG/PNG |
| Opera | 19+ | ✅ Yes | N/A |

## Performance Tips

### 1. Optimize Original Images First

```php
// Always optimize before generating WebP
$admin->optimize_background_image( $attachment_id ); // Resize to 1920px
$admin->generate_webp_version( $attachment_id );     // Then generate WebP
```

### 2. Check WebP Existence Before Regenerating

```php
// WebP generation checks if file already exists
// No need to check manually - it's handled automatically
$webp_url = $admin->generate_webp_version( $attachment_id );
```

### 3. Use CSS image-set() for Best Performance

```css
/* Browser automatically chooses best format */
background-image: image-set(
    url('image.webp') type("image/webp"),
    url('image.jpg')
);
```

## Troubleshooting

### WebP Not Generated

**Problem:** WebP version not created after upload.

**Solutions:**
1. Check if GD or Imagick supports WebP:
   ```php
   $editor = wp_get_image_editor( $file_path );
   if ( method_exists( $editor, 'supports_mime_type' ) ) {
       $supports = $editor->supports_mime_type( 'image/webp' );
       echo $supports ? 'Supported' : 'Not supported';
   }
   ```

2. Check error logs:
   ```bash
   tail -f wp-content/debug.log | grep "MASE: WebP"
   ```

3. Verify PHP version (WebP requires PHP 5.5+)

### Browser Not Loading WebP

**Problem:** Browser supports WebP but loads JPG instead.

**Solutions:**
1. Check HTTP_ACCEPT header:
   ```php
   var_dump( $_SERVER['HTTP_ACCEPT'] );
   // Should contain 'image/webp'
   ```

2. Verify CSS syntax:
   ```css
   /* Correct */
   background-image: image-set(url('image.webp') type("image/webp"), url('image.jpg'));
   
   /* Incorrect */
   background-image: image-set(url('image.webp'), url('image.jpg')); /* Missing type() */
   ```

3. Clear browser cache

### File Size Not Reduced

**Problem:** WebP file is same size or larger than original.

**Solutions:**
1. Check original image quality (already compressed images may not benefit)
2. Verify WebP quality settings in WordPress
3. Consider using different source format (PNG converts better than JPG)

## API Reference

### MASE_Admin Methods

#### `get_optimized_image_url( $attachment_id )`

Returns the best image URL based on browser support.

**Parameters:**
- `$attachment_id` (int) - WordPress attachment ID

**Returns:**
- (string) - Optimized image URL (WebP if supported, original otherwise)

**Example:**
```php
$url = $admin->get_optimized_image_url( 123 );
```

#### `generate_webp_version( $attachment_id )`

Generates WebP version of an image.

**Parameters:**
- `$attachment_id` (int) - WordPress attachment ID

**Returns:**
- (string|false) - WebP URL on success, false on failure

**Example:**
```php
$webp_url = $admin->generate_webp_version( 123 );
if ( $webp_url ) {
    echo 'WebP generated: ' . $webp_url;
}
```

## Best Practices

### 1. Always Provide Fallback

```css
/* Good */
background-image: url('image.jpg'); /* Fallback */
background-image: image-set(url('image.webp') type("image/webp"), url('image.jpg'));

/* Bad */
background-image: url('image.webp'); /* No fallback */
```

### 2. Use Appropriate Quality Settings

```php
// WordPress default is 82% quality
// For backgrounds, 75-80% is usually sufficient
add_filter( 'wp_editor_set_quality', function( $quality, $mime_type ) {
    if ( $mime_type === 'image/webp' ) {
        return 75; // Adjust as needed
    }
    return $quality;
}, 10, 2 );
```

### 3. Monitor File Sizes

```php
// Log file sizes for comparison
$original_size = filesize( get_attached_file( $attachment_id ) );
$webp_size = filesize( $webp_path );
$reduction = ( 1 - ( $webp_size / $original_size ) ) * 100;

error_log( sprintf(
    'WebP reduction: %.1f%% (Original: %s, WebP: %s)',
    $reduction,
    size_format( $original_size ),
    size_format( $webp_size )
) );
```

## Additional Resources

- [WebP Documentation](https://developers.google.com/speed/webp)
- [CSS image-set() Specification](https://drafts.csswg.org/css-images-4/#image-set-notation)
- [WordPress Image Editor](https://developer.wordpress.org/reference/classes/wp_image_editor/)
- [Browser Support Data](https://caniuse.com/webp)

## Support

For issues or questions:
1. Check error logs: `wp-content/debug.log`
2. Review implementation: `docs/TASK-31-WEBP-SUPPORT-IMPLEMENTATION.md`
3. Run tests: `tests/test-webp-logic.html`
