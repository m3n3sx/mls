# Material Design 3 Snackbar System Guide

## Overview

The MD3 Snackbar system provides beautiful, accessible notifications following Material Design 3 principles. It replaces the old notice system with a modern, animated snackbar component.

## Features

- **Material Design 3 Styling**: Follows MD3 design tokens, elevation, and motion
- **Multiple Variants**: Success, error, info, and default styles
- **Smooth Animations**: Slide-in from bottom (300ms) and fade-out
- **Auto-dismiss**: Configurable duration with 4-second default
- **Queue Management**: Multiple notifications are queued and shown sequentially
- **Action Buttons**: Optional action button with callback support
- **Accessibility**: ARIA live regions, keyboard navigation, screen reader support
- **Dark Mode**: Full dark mode support with appropriate color adjustments
- **Responsive**: Adapts to mobile screens

## Requirements Implemented

- **Requirement 18.1**: Snackbar-style notifications at bottom of screen
- **Requirement 18.2**: Success (green), error (red), and info (blue) variants
- **Requirement 18.3**: Slide-in animation from bottom (300ms)
- **Requirement 18.4**: Auto-dismiss after 4 seconds with fade-out
- **Requirement 18.5**: Elevation-3 shadow and rounded corners

## Usage

### Basic Usage

```javascript
// Show success notification
MASESnackbar.success('Settings saved successfully!');

// Show error notification
MASESnackbar.error('Failed to save settings.');

// Show info notification
MASESnackbar.info('Changes will take effect after reload.');
```

### Advanced Usage

```javascript
// Show with custom options
MASESnackbar.show({
    message: 'Template applied successfully',
    type: 'success',
    duration: 6000,
    actionText: 'View',
    actionCallback: function() {
        console.log('Action clicked');
    }
});

// Persistent notification (no auto-dismiss)
MASESnackbar.show({
    message: 'Important message',
    type: 'info',
    duration: 0  // Won't auto-dismiss
});
```

### jQuery Plugin

```javascript
// Using jQuery plugin syntax
$('#mase-snackbar').maseSnackbar('success', 'Operation completed!');
$('#mase-snackbar').maseSnackbar('error', 'Something went wrong');
$('#mase-snackbar').maseSnackbar('hide');
```

## API Reference

### MASESnackbar.show(options)

Shows a snackbar notification with custom options.

**Parameters:**
- `options.message` (string, required): Message text to display
- `options.type` (string): Notification type - 'success', 'error', 'info', or 'default'
- `options.duration` (number): Auto-dismiss duration in milliseconds (default: 4000, 0 = no auto-dismiss)
- `options.actionText` (string): Text for action button (optional)
- `options.actionCallback` (function): Callback when action button is clicked (optional)
- `options.icon` (string): Custom icon class (optional, auto-detected from type)

### MASESnackbar.success(message, options)

Shows a success notification (green).

**Parameters:**
- `message` (string): Success message
- `options` (object): Additional options (optional)

### MASESnackbar.error(message, options)

Shows an error notification (red).

**Parameters:**
- `message` (string): Error message
- `options` (object): Additional options (optional)

**Note:** Error notifications have a longer default duration (6 seconds).

### MASESnackbar.info(message, options)

Shows an info notification (blue).

**Parameters:**
- `message` (string): Info message
- `options` (object): Additional options (optional)

### MASESnackbar.hide()

Manually hides the current snackbar.

## Integration with Existing Code

The snackbar system is automatically integrated with the existing `MASE.showNotice()` function. All existing code that uses `showNotice()` will automatically use the new snackbar system:

```javascript
// This automatically uses the snackbar
MASE.showNotice('success', 'Settings saved!');
MASE.showNotice('error', 'Failed to save');
```

## Queue Management

When multiple notifications are triggered rapidly, they are automatically queued and shown sequentially:

```javascript
// These will be shown one after another
MASESnackbar.success('First notification');
MASESnackbar.info('Second notification');
MASESnackbar.error('Third notification');
```

## Accessibility

The snackbar system includes comprehensive accessibility features:

- **ARIA Live Regions**: Notifications are announced to screen readers
- **Keyboard Navigation**: Close button is keyboard accessible
- **Focus Management**: Proper focus indicators on interactive elements
- **Semantic HTML**: Uses appropriate ARIA roles and attributes
- **Reduced Motion**: Respects `prefers-reduced-motion` preference

## Dark Mode

The snackbar automatically adapts to dark mode:

```css
:root[data-theme="dark"] .mase-snackbar {
    /* Dark mode colors applied automatically */
}
```

## Responsive Design

On mobile devices (< 768px), the snackbar:
- Spans full width with margins
- Adjusts positioning for better visibility
- Maintains touch-friendly button sizes

## Testing

A visual test page is available at:
```
tests/visual-testing/md3-snackbar-test.html
```

Open this file in a browser to test:
- All notification variants
- Action buttons
- Queue management
- Custom durations
- Dark mode support

## Files

### CSS
- `assets/css/mase-md3-snackbar.css` - Snackbar styles

### JavaScript
- `assets/js/mase-md3-snackbar.js` - Snackbar functionality

### HTML
- Snackbar container added to `includes/admin-settings-page.php`

### Integration
- Enqueued in `includes/class-mase-admin.php`
- Integrated with `assets/js/mase-admin.js`

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Performance

- Minimal JavaScript footprint (< 7KB)
- GPU-accelerated animations
- Efficient queue management
- No memory leaks

## Future Enhancements

Potential future improvements:
- Swipe to dismiss on mobile
- Custom positioning options
- Progress bar for long operations
- Multiple snackbars simultaneously
- Sound notifications (optional)
