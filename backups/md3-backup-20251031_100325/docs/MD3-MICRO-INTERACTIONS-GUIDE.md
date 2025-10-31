# Material Design 3 Micro-interactions Guide

## Overview

This guide documents the Material Design 3 micro-interaction system implemented in Modern Admin Styler. These delightful animations enhance user experience by providing visual feedback for all interactive elements.

## Implementation

**Files:**
- `assets/css/mase-micro-interactions.css` - Animation styles
- `assets/js/mase-micro-interactions.js` - Animation orchestration

**Requirements Addressed:**
- Requirement 9.1: Icon hover animations
- Requirement 9.2: Card lift effects
- Requirement 9.3: Color transitions
- Requirement 9.4: Notification animations
- Requirement 9.5: Form submission animations

## Features

### 9.1 Icon Hover Animations

All interactive icons scale to 1.1x on hover with a 200ms smooth transition.

**Supported Icons:**
- Generic icons (`.mase-icon`, `.dashicons`)
- Help icons (`.mase-help-icon`) - scale + rotate 15deg
- Close icons (`.mase-close-icon`) - scale + rotate 90deg
- Settings icons (`.mase-settings-icon`) - scale + rotate 45deg

**CSS:**
```css
.mase-icon:hover {
    transform: scale(1.1);
    transition: transform 200ms var(--md-easing-standard);
}
```

**Usage:**
```html
<button>
    <span class="dashicons mase-icon"></span>
    Click me
</button>
```

### 9.2 Card Lift Effect

Cards lift on hover with coordinated transform and shadow expansion.

**Effect:**
- Translate: -4px vertical
- Scale: 1.02
- Shadow: Elevation 1 → Elevation 3
- Easing: Emphasized curve

**CSS:**
```css
.mase-template-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--md-elevation-3);
    transition: all 300ms var(--md-easing-emphasized);
}
```

**Supported Elements:**
- `.mase-template-card`
- `.mase-palette-card`
- `.mase-settings-card`
- Any element with `*-card` class (unless `.no-lift`)

### 9.3 Color Transitions

Smooth color transitions for all interactive elements.

**Properties:**
- Color
- Background color
- Border color

**Duration:** 200ms
**Easing:** Standard curve

**CSS:**
```css
button, a, input {
    transition: 
        color 200ms var(--md-easing-standard),
        background-color 200ms var(--md-easing-standard),
        border-color 200ms var(--md-easing-standard);
}
```

### 9.4 Notification Animations

Engaging animations for notifications and alerts.

**Success Notifications:**
- Slide in from bottom (300ms)
- Bounce animation (500ms)
- Auto-dismiss after 4 seconds
- Fade out on dismiss (300ms)

**Error Notifications:**
- Slide in from bottom (300ms)
- Shake animation (400ms)
- Manual dismiss only

**CSS:**
```css
@keyframes slideInFromBottom {
    from {
        transform: translateY(100px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes successBounce {
    0%, 100% { transform: translateY(0) scale(1); }
    25% { transform: translateY(-8px) scale(1.02); }
    50% { transform: translateY(0) scale(1); }
    75% { transform: translateY(-4px) scale(1.01); }
}
```

**JavaScript API:**
```javascript
// Show notification
MASEMicroInteractions.showNotification(
    'Success message',
    'success', // or 'error', 'info'
    4000 // duration in ms
);

// Dismiss notification
MASEMicroInteractions.dismissNotification($notification);
```

### 9.5 Form Submission Animation

Expanding circle success animation for form submissions.

**States:**
1. **Submitting** - Button scales down (0.95), shows loading spinner
2. **Success** - Expanding circle animation, button scales up (1.05 → 1.0)
3. **Error** - Remove loading state, show error notification

**CSS:**
```css
@keyframes expandingCircle {
    0% {
        width: 0;
        height: 0;
        opacity: 1;
    }
    50% {
        width: 200%;
        height: 200%;
        opacity: 0.8;
    }
    100% {
        width: 300%;
        height: 300%;
        opacity: 0;
    }
}
```

**JavaScript Integration:**
```javascript
// In AJAX success handler
if (window.MASEMicroInteractions) {
    window.MASEMicroInteractions.triggerFormSuccess($button);
}

// In AJAX error handler
if (window.MASEMicroInteractions) {
    window.MASEMicroInteractions.triggerFormError($button);
}
```

## Performance Optimization

### GPU Acceleration

All animations use GPU-accelerated properties:
- `transform` (instead of `top`, `left`, `width`, `height`)
- `opacity`

**CSS:**
```css
.mase-animated {
    will-change: transform, opacity;
    transform: translateZ(0);
    backface-visibility: hidden;
}

/* Remove will-change when not animating */
.mase-animated:not(:hover):not(:active):not(.animating) {
    will-change: auto;
}
```

### Reduced Motion Support

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

## Testing

**Visual Test File:**
`tests/visual-testing/md3-micro-interactions-test.html`

**Test Coverage:**
1. Icon hover animations (all variants)
2. Card lift effects
3. Color transitions on buttons
4. Success/error/info notifications
5. Form submission animation

**To Run Tests:**
1. Open test file in browser
2. Interact with each section
3. Verify animations are smooth (60fps)
4. Test with reduced motion enabled

## Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Fallbacks:**
- Older browsers: Instant transitions (no animation)
- Reduced motion: Instant transitions
- All functionality preserved

## Accessibility

**WCAG 2.1 AA Compliance:**
- ✅ Respects `prefers-reduced-motion`
- ✅ Animations don't interfere with screen readers
- ✅ Focus indicators remain visible during animations
- ✅ No flashing content (seizure risk)
- ✅ All interactions keyboard accessible

**Screen Reader Support:**
- Animations are purely visual
- No content changes during animations
- ARIA labels remain accurate
- Focus management preserved

## Integration with Existing Code

The micro-interactions system integrates seamlessly with existing MASE code:

**Admin Settings Save:**
```javascript
// In assets/js/mase-admin.js saveSettings()
if (response.success) {
    // Trigger success animation
    if (window.MASEMicroInteractions) {
        window.MASEMicroInteractions.triggerFormSuccess($button);
    }
    // ... rest of success handler
}
```

**Palette Application:**
```javascript
// Automatically works with existing palette cards
// No code changes needed - CSS handles it
```

**Template Application:**
```javascript
// Automatically works with existing template cards
// No code changes needed - CSS handles it
```

## Customization

### Adjusting Animation Duration

Edit CSS custom properties in `md3-motion.css`:

```css
:root {
    --md-duration-short-4: 200ms;  /* Icon animations */
    --md-duration-medium-2: 300ms; /* Card lifts */
    --md-duration-long-2: 500ms;   /* Form submissions */
}
```

### Disabling Specific Animations

Add `.no-hover` or `.no-lift` classes:

```html
<!-- Disable icon animation -->
<span class="dashicons no-hover"></span>

<!-- Disable card lift -->
<div class="mase-template-card no-lift"></div>
```

### Custom Notification Duration

```javascript
// Show notification for 10 seconds
MASEMicroInteractions.showNotification(
    'Custom message',
    'info',
    10000 // 10 seconds
);

// Show notification indefinitely (manual dismiss only)
MASEMicroInteractions.showNotification(
    'Important message',
    'error',
    0 // 0 = no auto-dismiss
);
```

## Troubleshooting

### Animations Not Working

1. **Check CSS is loaded:**
   ```javascript
   console.log(document.querySelector('link[href*="mase-micro-interactions.css"]'));
   ```

2. **Check JS is loaded:**
   ```javascript
   console.log(window.MASEMicroInteractions);
   ```

3. **Check for CSS conflicts:**
   - Look for `!important` overrides
   - Check for conflicting `transition` properties

### Animations Janky/Slow

1. **Check FPS in DevTools:**
   - Open Performance tab
   - Record interaction
   - Look for dropped frames

2. **Reduce animation complexity:**
   - Disable expensive effects
   - Use simpler easing curves
   - Reduce animation duration

3. **Check GPU acceleration:**
   ```css
   /* Ensure GPU acceleration */
   .animated-element {
       transform: translateZ(0);
       will-change: transform;
   }
   ```

### Notifications Not Appearing

1. **Check notification container:**
   ```javascript
   // Container should exist or be created
   jQuery('.mase-notification-container').length
   ```

2. **Check z-index:**
   ```css
   .mase-notification {
       z-index: 10000; /* Should be high enough */
   }
   ```

3. **Check for JavaScript errors:**
   - Open browser console
   - Look for errors when triggering notification

## Future Enhancements

Potential improvements for future versions:

1. **Staggered animations** - Animate multiple elements in sequence
2. **Gesture support** - Swipe to dismiss notifications
3. **Custom easing curves** - User-defined animation curves
4. **Animation playground** - Visual editor for animations
5. **Performance monitoring** - Real-time FPS display

## References

- [Material Design 3 Motion](https://m3.material.io/styles/motion)
- [MDN: CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [MDN: CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)
- [WCAG 2.1: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
