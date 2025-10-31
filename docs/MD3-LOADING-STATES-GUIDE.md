# Material Design 3 Loading States Guide

## Overview

The MD3 Loading States system provides a comprehensive set of loading animations and transitions following Material Design 3 principles. This includes shimmer effects, circular progress indicators, success animations, and smooth state transitions.

## Features

- **Shimmer Loading Effects**: Gradient-based skeleton screens for content loading
- **Circular Progress Indicators**: Spinning progress indicators in multiple sizes and colors
- **Success Animations**: Delightful checkmark animations with expanding circles
- **Loading State Transitions**: Smooth transitions between loading and loaded states
- **Component-Specific States**: Loading states for buttons, cards, and form fields
- **Accessibility**: Full support for `prefers-reduced-motion`
- **Dark Mode**: Optimized for both light and dark themes

## CSS Classes

### Shimmer Loading

```html
<!-- Basic shimmer -->
<div class="mase-loading-shimmer mase-skeleton-text"></div>

<!-- Skeleton components -->
<div class="mase-loading-shimmer mase-skeleton-heading"></div>
<div class="mase-loading-shimmer mase-skeleton-card"></div>
<div class="mase-loading-shimmer mase-skeleton-button"></div>
<div class="mase-loading-shimmer mase-skeleton-avatar"></div>

<!-- Complete skeleton screen -->
<div class="mase-skeleton-container">
    <div class="mase-loading-shimmer mase-skeleton-heading"></div>
    <div class="mase-loading-shimmer mase-skeleton-text"></div>
    <div class="mase-loading-shimmer mase-skeleton-text"></div>
    <div class="mase-loading-shimmer mase-skeleton-button"></div>
</div>
```

### Circular Progress

```html
<!-- Default progress (48px) -->
<div class="mase-progress-circular"></div>

<!-- Size variants -->
<div class="mase-progress-circular mase-progress-circular--small"></div>
<div class="mase-progress-circular mase-progress-circular--medium"></div>
<div class="mase-progress-circular mase-progress-circular--large"></div>

<!-- Color variants -->
<div class="mase-progress-circular mase-progress-circular--secondary"></div>
<div class="mase-progress-circular mase-progress-circular--tertiary"></div>
<div class="mase-progress-circular mase-progress-circular--error"></div>

<!-- With label -->
<div class="mase-progress-labeled">
    <div class="mase-progress-circular"></div>
    <div class="mase-progress-label">Loading...</div>
</div>

<!-- Centered -->
<div class="mase-progress-center">
    <div class="mase-progress-circular"></div>
</div>
```

### Success Animations

```html
<!-- Basic success checkmark -->
<div class="mase-success-checkmark mase-success-animation"></div>

<!-- With message -->
<div class="mase-success-checkmark mase-success-animation"></div>
<div class="mase-success-message">
    <div class="mase-success-title">Success!</div>
    <div class="mase-success-description">Your changes have been saved.</div>
</div>

<!-- With expanding circle -->
<div class="mase-success-expanding">
    <div class="mase-success-checkmark mase-success-animation"></div>
</div>
```

### Component Loading States

```html
<!-- Button loading -->
<button class="mase-button-filled mase-button-loading">
    Save Settings
</button>

<!-- Card loading -->
<div class="mase-card-loading">
    <!-- Card content -->
</div>

<!-- Field loading -->
<div class="mase-field-loading">
    <input type="text" />
</div>
```

### Loading Overlay

```html
<div class="mase-loading-container">
    <div class="mase-loading-overlay">
        <div class="mase-progress-labeled">
            <div class="mase-progress-circular"></div>
            <div class="mase-progress-label">Loading content...</div>
        </div>
    </div>
    <!-- Your content here -->
</div>
```

## JavaScript API

The `MASE_MD3_Loading` object provides programmatic control over loading states.

### Show Shimmer

```javascript
// Show shimmer on an element
MASE_MD3_Loading.showShimmer('#my-element', {
    height: '16px',
    width: '100%',
    className: 'mase-skeleton-text',
    replace: true
});
```

### Show Progress Indicator

```javascript
// Show circular progress
MASE_MD3_Loading.showProgress('#container', {
    size: 'medium',      // 'small', 'medium', 'large'
    color: 'primary',    // 'primary', 'secondary', 'tertiary', 'error'
    label: 'Loading...', // Optional label text
    center: true         // Center in container
});
```

### Show Success Animation

```javascript
// Show success with message
MASE_MD3_Loading.showSuccess('#container', {
    title: 'Success!',
    description: 'Your changes have been saved.',
    expanding: true,     // Use expanding circle effect
    duration: 2000       // Auto-remove after 2 seconds (0 = don't remove)
});
```

### Loading Overlay

```javascript
// Show overlay
const overlay = MASE_MD3_Loading.showOverlay('#container', {
    label: 'Loading...',
    size: 'medium'
});

// Hide overlay
MASE_MD3_Loading.hideOverlay('#container', function() {
    console.log('Overlay hidden');
});
```

### Button Loading State

```javascript
// Show button loading
MASE_MD3_Loading.showButtonLoading('#save-button');

// Hide button loading
MASE_MD3_Loading.hideButtonLoading('#save-button');
```

### Card Loading State

```javascript
// Show card loading
MASE_MD3_Loading.showCardLoading('.template-card');

// Hide card loading
MASE_MD3_Loading.hideCardLoading('.template-card');
```

### Field Loading State

```javascript
// Show field loading
MASE_MD3_Loading.showFieldLoading('.form-field');

// Hide field loading
MASE_MD3_Loading.hideFieldLoading('.form-field');
```

### Create Skeleton Screen

```javascript
// Create complete skeleton
MASE_MD3_Loading.createSkeleton('#container', {
    heading: true,
    lines: 3,
    button: true,
    avatar: false
});
```

### Transition to Content

```javascript
// Smooth transition from loading to content
MASE_MD3_Loading.transitionToContent('#container', '#content', function() {
    console.log('Transition complete');
});
```

## Usage Examples

### AJAX Request with Loading State

```javascript
jQuery(document).ready(function($) {
    $('#save-button').on('click', function() {
        const $button = $(this);
        
        // Show button loading
        MASE_MD3_Loading.showButtonLoading($button);
        
        // Make AJAX request
        $.ajax({
            url: ajaxurl,
            method: 'POST',
            data: {
                action: 'mase_save_settings',
                nonce: maseData.nonce,
                settings: getFormData()
            },
            success: function(response) {
                // Hide button loading
                MASE_MD3_Loading.hideButtonLoading($button);
                
                // Show success animation
                MASE_MD3_Loading.showSuccess('#message-container', {
                    title: 'Settings Saved!',
                    description: 'Your changes have been applied.',
                    duration: 3000
                });
            },
            error: function() {
                MASE_MD3_Loading.hideButtonLoading($button);
                // Show error message
            }
        });
    });
});
```

### Loading Content with Overlay

```javascript
function loadTemplates() {
    const $container = $('#templates-container');
    
    // Show loading overlay
    MASE_MD3_Loading.showOverlay($container, {
        label: 'Loading templates...',
        size: 'large'
    });
    
    // Fetch templates
    $.ajax({
        url: ajaxurl,
        method: 'GET',
        data: { action: 'mase_get_templates' },
        success: function(response) {
            // Hide overlay and show content
            MASE_MD3_Loading.hideOverlay($container, function() {
                $container.html(response.html);
                $container.find('.template-card').addClass('mase-content-loaded');
            });
        }
    });
}
```

### Skeleton Screen While Loading

```javascript
function loadUserProfile() {
    const $container = $('#profile-container');
    
    // Show skeleton screen
    MASE_MD3_Loading.createSkeleton($container, {
        avatar: true,
        heading: true,
        lines: 4,
        button: true
    });
    
    // Fetch profile data
    $.ajax({
        url: ajaxurl,
        method: 'GET',
        data: { action: 'mase_get_profile' },
        success: function(response) {
            // Replace skeleton with actual content
            $container.html(response.html);
            $container.find('.profile-content').addClass('mase-content-loaded');
        }
    });
}
```

## Design Tokens

The loading states use the following MD3 design tokens:

- `--md-surface-variant`: Shimmer base color
- `--md-surface`: Shimmer highlight color
- `--md-primary`: Progress indicator color
- `--md-primary-container`: Success checkmark background
- `--md-on-primary-container`: Success checkmark icon color
- `--md-duration-medium-2`: Standard transition duration (300ms)
- `--md-duration-long-2`: Long animation duration (500ms)
- `--md-easing-emphasized`: Emphasized easing curve

## Accessibility

### Reduced Motion Support

All animations respect the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
    /* All animations are disabled or reduced to instant transitions */
}
```

### Screen Reader Support

Loading states should include appropriate ARIA attributes:

```html
<div role="status" aria-live="polite" aria-label="Loading content">
    <div class="mase-progress-circular"></div>
    <span class="sr-only">Loading, please wait...</span>
</div>
```

## Performance

- All animations use GPU-accelerated properties (`transform`, `opacity`)
- `will-change` is applied during animations and removed after
- Shimmer animations use CSS gradients for optimal performance
- Loading overlays use `position: absolute` to avoid layout shifts

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Testing

Visual tests are available at:
- `tests/visual-testing/md3-loading-states-test.html`

## Requirements Fulfilled

This implementation fulfills the following requirements from the Material Design 3 Transformation spec:

- **Requirement 8.1**: Shimmer loading effect with gradient animation
- **Requirement 8.2**: Skeleton screens for content loading states
- **Requirement 8.3**: Circular progress indicator with primary color
- **Requirement 8.4**: Smooth fade-in for loaded content
- **Requirement 8.5**: Success animation with scale effect

## Related Documentation

- [MD3 Motion System](./MD3-MOTION-SYSTEM.md)
- [MD3 Design Tokens](./MD3-DESIGN-TOKENS.md)
- [Accessibility Guide](./ACCESSIBILITY-VERIFICATION-GUIDE.md)
