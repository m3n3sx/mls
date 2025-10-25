# Browser Compatibility Guide

## Overview

The MASE Browser Compatibility module (`mase-compatibility.js`) provides comprehensive feature detection and graceful degradation for the Advanced Background System. It ensures the plugin works across different browsers while providing optimal experiences on modern browsers.

## Features Detected

### 1. FileReader API
- **Purpose**: File upload preview functionality
- **Fallback**: Disable preview, show upload without preview
- **Browser Support**: IE10+, All modern browsers

### 2. Drag & Drop API
- **Purpose**: Drag and drop file uploads
- **Fallback**: Click-to-upload only
- **Browser Support**: IE9+, All modern browsers

### 3. CSS Blend Modes
- **Purpose**: Advanced background blending effects
- **Fallback**: Disable blend mode controls, use normal blending
- **Browser Support**: Chrome 35+, Firefox 32+, Safari 8+, Edge 79+

### 4. CSS Gradients
- **Purpose**: Gradient backgrounds
- **Fallback**: Disable gradient builder, hide gradient option
- **Browser Support**: IE10+, All modern browsers

### 5. WebP Image Format
- **Purpose**: Optimized image delivery
- **Fallback**: Use JPG/PNG formats
- **Browser Support**: Chrome 23+, Firefox 65+, Edge 18+, Safari 14+
- **Detection**: Asynchronous (triggers `mase:webp-detected` event)

### 6. IntersectionObserver API
- **Purpose**: Lazy loading for background images
- **Fallback**: Load all images immediately
- **Browser Support**: Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+

### 7. CSS Custom Properties (Variables)
- **Purpose**: Dynamic theming
- **Fallback**: Use inline styles
- **Browser Support**: Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+

## Usage

### Automatic Initialization

The compatibility module initializes automatically on document ready:

```javascript
$(document).ready(function() {
    MASE.compatibility.init();
    MASE.compatibility.showOutdatedBrowserWarning();
});
```

### Checking Feature Support

```javascript
// Check if a specific feature is supported
if (MASE.compatibility.isSupported('fileReader')) {
    // Use FileReader API
} else {
    // Use fallback
}

// Access all features
const features = MASE.compatibility.features;
console.log(features.webp); // true/false
```

### WebP Detection Event

WebP detection is asynchronous. Listen for the event:

```javascript
$(document).on('mase:webp-detected', function(e, supported) {
    if (supported) {
        console.log('WebP is supported');
    } else {
        console.log('WebP is not supported');
    }
});
```

### Browser Information

```javascript
// Get browser name and version
const browserInfo = MASE.compatibility.getBrowserInfo();
console.log(browserInfo.name);    // 'Chrome', 'Firefox', 'Safari', etc.
console.log(browserInfo.version); // '96', '94', etc.

// Check if browser is outdated
if (MASE.compatibility.isOutdatedBrowser()) {
    console.warn('Browser needs updating');
}
```

## Fallback Behaviors

### FileReader Not Supported
- Upload zone preview is hidden
- File uploads still work via standard form submission
- No visual preview of selected images

### Drag & Drop Not Supported
- Drag & drop text is hidden
- Click-to-upload text is shown
- File selection via click still works

### Blend Modes Not Supported
- Blend mode dropdown is disabled
- Set to 'normal' blend mode
- Visual indicator shows feature is unsupported

### Gradients Not Supported
- Gradient builder is disabled
- Gradient option hidden from background type selector
- All gradient controls are disabled

### IntersectionObserver Not Supported
- All background images load immediately
- No lazy loading optimization
- Slightly slower initial page load

### CSS Variables Not Supported
- Body gets `mase-no-css-variables` class
- Inline styles used instead of CSS variables
- Slightly larger CSS output

## Compatibility Notices

### User-Facing Notices

The module automatically displays notices for unsupported features:

```html
<div class="notice notice-warning mase-compatibility-notice">
    <p><strong>Browser Compatibility:</strong> Your browser does not support 
    the following features: Blend modes, CSS gradients. Some functionality 
    may be limited. Please consider updating your browser for the best experience.</p>
</div>
```

### Outdated Browser Warning

For significantly outdated browsers:

```html
<div class="notice notice-error mase-outdated-browser-notice">
    <p><strong>Outdated Browser:</strong> You are using an outdated version 
    of Chrome (45). Please update your browser for the best experience and security.</p>
</div>
```

## Minimum Browser Versions

### Fully Supported (All Features)
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Partially Supported (Some Features)
- Chrome 35-59 (No WebP in older versions)
- Firefox 32-54 (No IntersectionObserver)
- Safari 8-10 (No IntersectionObserver, No WebP)
- Edge 15-78 (Legacy Edge)

### Not Supported
- Internet Explorer (all versions)
- Chrome < 35
- Firefox < 32
- Safari < 8

## CSS Classes

The module adds CSS classes to indicate feature support:

```css
/* WebP support */
body.mase-webp-supported { }
body.mase-webp-not-supported { }

/* CSS Variables support */
body.mase-no-css-variables { }

/* Feature unsupported indicator */
.mase-feature-unsupported {
    opacity: 0.6;
    pointer-events: none;
}

.mase-feature-unsupported::after {
    content: 'Not supported in your browser';
    /* Overlay styling */
}
```

## Testing

### Manual Testing

Open `tests/test-browser-compatibility.html` in different browsers to test:

1. Feature detection results
2. Visual feature tests (gradients, blend modes)
3. Interactive tests (file upload, drag & drop)
4. Browser information display

### Automated Testing

```javascript
// Run all compatibility tests
$('#run-all-tests').click();

// Test specific features
$('#test-webp').click();
$('#test-intersection-observer').click();
$('#test-css-variables').click();
```

## Performance Considerations

### Synchronous Detection
Most features are detected synchronously during initialization:
- FileReader: ~1ms
- Drag & Drop: ~1ms
- Blend Modes: ~2ms
- Gradients: ~2ms
- CSS Variables: ~1ms

Total synchronous detection: ~7ms

### Asynchronous Detection
WebP detection is asynchronous to avoid blocking:
- Detection time: ~10-50ms
- Does not block page rendering
- Triggers event when complete

## Debugging

Enable debug mode to see feature detection results:

```php
// In wp-config.php
define('WP_DEBUG', true);
```

Console output:
```
MASE Compatibility: {
    fileReader: true,
    dragDrop: true,
    blendModes: true,
    gradients: true,
    webp: true,
    intersectionObserver: true,
    cssVariables: true
}
```

## Extending

### Adding New Feature Detection

```javascript
// In mase-compatibility.js
detectFeatures: function() {
    // ... existing detections ...
    
    // Add new feature
    this.features.myNewFeature = this.detectMyNewFeature();
},

detectMyNewFeature: function() {
    // Detection logic
    return 'myFeature' in window;
},

applyFallbacks: function() {
    // ... existing fallbacks ...
    
    // Add fallback
    if (!this.features.myNewFeature) {
        this.disableMyNewFeature();
    }
}
```

### Custom Events

Trigger custom events for feature detection:

```javascript
$(document).trigger('mase:feature-detected', [featureName, supported]);
```

Listen for events:

```javascript
$(document).on('mase:feature-detected', function(e, feature, supported) {
    console.log(feature + ' is ' + (supported ? 'supported' : 'not supported'));
});
```

## Best Practices

1. **Always check feature support** before using advanced features
2. **Provide meaningful fallbacks** for unsupported features
3. **Test in multiple browsers** including older versions
4. **Show clear notices** to users about unsupported features
5. **Degrade gracefully** - never break core functionality
6. **Use progressive enhancement** - start with basic features, add advanced ones

## Troubleshooting

### Feature Detected but Not Working

1. Check browser console for errors
2. Verify feature is actually supported (not just detected)
3. Check for conflicting plugins or themes
4. Test in incognito/private mode

### False Positives

Some browsers may report support but have buggy implementations:
- Test actual functionality, not just detection
- Add runtime error handling
- Provide fallbacks even for "supported" features

### False Negatives

Some features may work but not be detected:
- Update detection logic
- Check for vendor prefixes
- Test with latest browser versions

## Related Files

- `assets/js/modules/mase-compatibility.js` - Main compatibility module
- `assets/css/mase-admin.css` - Compatibility styles
- `tests/test-browser-compatibility.html` - Test suite
- `includes/class-mase-admin.php` - Script enqueuing

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 5.5**: Graceful degradation for unsupported blend modes
- **Requirement 7.2**: WebP support detection with fallbacks

## References

- [MDN: Feature Detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection)
- [Can I Use](https://caniuse.com/) - Browser compatibility tables
- [CSS.supports()](https://developer.mozilla.org/en-US/docs/Web/API/CSS/supports)
- [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
