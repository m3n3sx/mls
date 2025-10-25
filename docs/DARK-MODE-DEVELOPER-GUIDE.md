# Dark/Light Mode Toggle - Developer Guide

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Reference](#component-reference)
3. [Custom Events](#custom-events)
4. [API Reference](#api-reference)
5. [Extending Dark Mode](#extending-dark-mode)
6. [Code Examples](#code-examples)
7. [Testing](#testing)
8. [Performance Considerations](#performance-considerations)

---

## Architecture Overview

The dark mode system is built with a modular architecture consisting of four main layers:

### 1. UI Layer (FAB Component)

**Location**: `assets/js/mase-admin.js` - `MASE.darkModeToggle` module

**Responsibilities**:
- Render floating action button
- Handle user interactions
- Display tooltips and animations
- Manage visual feedback

### 2. Controller Layer (Dark Mode Controller)

**Location**: `assets/js/mase-admin.js` - Extension of `MASE.darkModeToggle`

**Responsibilities**:
- Manage mode state
- Coordinate between UI, storage, and server
- Handle system preference detection
- Manage transitions and animations
- Emit custom events

### 3. Persistence Layer

**Storage Mechanisms**:
- **localStorage**: Immediate persistence, key: `mase_dark_mode`
- **WordPress User Meta**: Cross-device persistence, key: `mase_dark_mode_preference`
- **AJAX Communication**: Syncs preference to server

### 4. Backend Layer

**PHP Classes**:
- `MASE_Settings`: Settings structure and defaults
- `MASE_Admin`: AJAX handlers and asset enqueuing
- `MASE_CSS_Generator`: Dynamic CSS generation for dark mode

---

## Component Reference

### MASE.darkModeToggle Module

Main JavaScript module for dark mode functionality.

#### Configuration

```javascript
MASE.darkModeToggle = {
    config: {
        fabSelector: '.mase-dark-mode-fab',
        bodyClass: 'mase-dark-mode',
        storageKey: 'mase_dark_mode',
        transitionDuration: 300,
        keyboardShortcut: { ctrl: true, shift: true, key: 'D' }
    }
};
```

#### State

```javascript
state: {
    currentMode: 'light',      // 'light' | 'dark'
    isTransitioning: false,    // Prevents rapid toggling
    systemPreference: null,    // Detected OS preference
    needsSync: false          // Indicates failed AJAX save
}
```


#### Methods

##### init()

Initializes the dark mode system.

```javascript
init: function() {
    this.detectSystemPreference();
    this.loadSavedPreference();
    this.render();
    this.attachEventListeners();
    this.setupKeyboardShortcuts();
    this.watchSystemPreference();
}
```

**Called**: On page load  
**Returns**: void

##### toggle()

Toggles between light and dark modes.

```javascript
toggle: function() {
    const newMode = this.state.currentMode === 'light' ? 'dark' : 'light';
    this.setMode(newMode);
}
```

**Called**: By FAB click, keyboard shortcut  
**Returns**: void

##### setMode(mode)

Sets a specific mode.

```javascript
setMode: function(mode) {
    if (this.state.isTransitioning) return;
    
    this.state.isTransitioning = true;
    this.state.currentMode = mode;
    
    // Update DOM
    document.body.classList.toggle('mase-dark-mode', mode === 'dark');
    
    // Animate icon
    this.animateIcon();
    
    // Save preference
    this.savePreference(mode);
    
    // Emit event
    $(document).trigger('mase:modeChanged', { mode: mode });
    
    // Re-enable after transition
    setTimeout(() => {
        this.state.isTransitioning = false;
        $(document).trigger('mase:transitionComplete', { mode: mode });
    }, this.config.transitionDuration);
}
```

**Parameters**:
- `mode` (string): 'light' or 'dark'

**Returns**: void  
**Emits**: `mase:modeChanged`, `mase:transitionComplete`

##### detectSystemPreference()

Detects the operating system's dark mode preference.

```javascript
detectSystemPreference: function() {
    if (!window.matchMedia) {
        this.state.systemPreference = 'light';
        return 'light';
    }
    
    try {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.state.systemPreference = darkModeQuery.matches ? 'dark' : 'light';
        return this.state.systemPreference;
    } catch (e) {
        console.error('MASE: System preference detection failed', e);
        this.state.systemPreference = 'light';
        return 'light';
    }
}
```

**Returns**: string ('light' or 'dark')

##### watchSystemPreference()

Monitors OS dark mode changes and updates MASE accordingly.

```javascript
watchSystemPreference: function() {
    if (!window.matchMedia) return;
    
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    darkModeQuery.addEventListener('change', (e) => {
        const newPreference = e.matches ? 'dark' : 'light';
        this.state.systemPreference = newPreference;
        
        // Only auto-update if user hasn't manually set preference
        const manualPreference = localStorage.getItem(this.config.storageKey);
        if (!manualPreference && this.config.respectSystemPreference) {
            this.setMode(newPreference);
        }
    });
}
```

**Returns**: void

##### savePreference(mode)

Saves the mode preference to localStorage and WordPress user meta.

```javascript
savePreference: function(mode) {
    // Save to localStorage
    try {
        localStorage.setItem(this.config.storageKey, mode);
    } catch (e) {
        console.warn('MASE: localStorage unavailable', e);
    }
    
    // Save to user meta via AJAX
    $.ajax({
        url: ajaxurl,
        type: 'POST',
        data: {
            action: 'mase_toggle_dark_mode',
            mode: mode,
            nonce: maseData.nonce
        },
        success: (response) => {
            if (response.success) {
                this.state.needsSync = false;
            }
        },
        error: (xhr, status, error) => {
            console.error('MASE: Failed to save preference', error);
            this.state.needsSync = true;
        }
    });
}
```

**Parameters**:
- `mode` (string): 'light' or 'dark'

**Returns**: void

---

## Custom Events

The dark mode system emits custom events that you can listen to in your own code.

### mase:modeChanged

Emitted when the mode changes (light ↔ dark).

**Event Data**:
```javascript
{
    mode: 'dark' // or 'light'
}
```

**Example Usage**:
```javascript
$(document).on('mase:modeChanged', function(event, data) {
    console.log('Mode changed to:', data.mode);
    
    // Your custom logic here
    if (data.mode === 'dark') {
        // Do something when dark mode is activated
    } else {
        // Do something when light mode is activated
    }
});
```

### mase:transitionComplete

Emitted when the color transition animation completes.

**Event Data**:
```javascript
{
    mode: 'dark' // or 'light'
}
```

**Example Usage**:
```javascript
$(document).on('mase:transitionComplete', function(event, data) {
    console.log('Transition complete, now in:', data.mode);
    
    // Safe to perform actions that depend on transition completion
});
```

---

## API Reference

### PHP API

#### MASE_Settings

##### get_defaults()

Returns default settings including dark mode configuration.

```php
public function get_defaults() {
    return [
        'dark_light_toggle' => [
            'enabled' => true,
            'current_mode' => 'light',
            'respect_system_preference' => true,
            'light_palette' => 'professional-blue',
            'dark_palette' => 'dark-elegance',
            'transition_duration' => 300,
            'keyboard_shortcut_enabled' => true,
            'fab_position' => [
                'bottom' => 20,
                'right' => 20
            ]
        ]
    ];
}
```

#### MASE_Admin

##### handle_ajax_toggle_dark_mode()

AJAX handler for dark mode toggle requests.

```php
public function handle_ajax_toggle_dark_mode() {
    // Verify nonce
    check_ajax_referer('mase_save_settings', 'nonce');
    
    // Check capability
    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => 'Unauthorized'], 403);
    }
    
    // Get and validate mode
    $mode = isset($_POST['mode']) ? sanitize_text_field($_POST['mode']) : '';
    if (!in_array($mode, ['light', 'dark'], true)) {
        wp_send_json_error(['message' => 'Invalid mode'], 400);
    }
    
    // Save to user meta
    $user_id = get_current_user_id();
    update_user_meta($user_id, 'mase_dark_mode_preference', $mode);
    
    // Update settings
    $settings = $this->settings->get_option();
    $settings['dark_light_toggle']['current_mode'] = $mode;
    $this->settings->update_option($settings);
    
    // Clear cache
    $this->cache->invalidate('generated_css');
    
    wp_send_json_success([
        'message' => 'Mode saved successfully',
        'mode' => $mode
    ]);
}
```

**AJAX Action**: `mase_toggle_dark_mode`  
**Required Parameters**: `mode`, `nonce`  
**Returns**: JSON response with success/error

#### MASE_CSS_Generator

##### generate_dark_mode_css($settings)

Generates CSS for dark mode.

```php
private function generate_dark_mode_css($settings) {
    $dark_toggle = $settings['dark_light_toggle'] ?? [];
    
    if (!($dark_toggle['enabled'] ?? false)) {
        return '';
    }
    
    $dark_palette_id = $dark_toggle['dark_palette'] ?? 'dark-elegance';
    $dark_palette = $this->settings->get_palette($dark_palette_id);
    
    $css = 'body.mase-dark-mode {';
    $css .= '--mase-bg-primary: ' . $dark_palette['bg_primary'] . ';';
    $css .= '--mase-bg-secondary: ' . $dark_palette['bg_secondary'] . ';';
    $css .= '--mase-text-primary: ' . $dark_palette['text_primary'] . ';';
    $css .= '--mase-text-secondary: ' . $dark_palette['text_secondary'] . ';';
    $css .= '--mase-accent: ' . $dark_palette['accent'] . ';';
    $css .= '}';
    
    $css .= $this->generate_dark_admin_bar_css($dark_palette);
    $css .= $this->generate_dark_admin_menu_css($dark_palette);
    
    return $css;
}
```

**Parameters**:
- `$settings` (array): MASE settings array

**Returns**: string (CSS code)

### JavaScript API

#### MASE.darkModeToggle.getCurrentMode()

Returns the current mode.

```javascript
getCurrentMode: function() {
    return this.state.currentMode;
}
```

**Returns**: string ('light' or 'dark')

#### MASE.darkModeToggle.isTransitioning()

Checks if a transition is in progress.

```javascript
isTransitioning: function() {
    return this.state.isTransitioning;
}
```

**Returns**: boolean

#### MASE.darkModeToggle.getSystemPreference()

Returns the detected system preference.

```javascript
getSystemPreference: function() {
    return this.state.systemPreference;
}
```

**Returns**: string ('light' or 'dark')

---

## Extending Dark Mode

### Adding Custom Dark Mode Styles

You can add your own CSS that responds to dark mode:

```css
/* In your custom CSS */
body.mase-dark-mode .my-custom-element {
    background-color: #2d2d2d;
    color: #e0e0e0;
}

body.mase-dark-mode .my-custom-button {
    background-color: #4a9eff;
    color: #ffffff;
}
```

### Hooking into Mode Changes

Listen to the `mase:modeChanged` event to perform custom actions:

```javascript
jQuery(document).on('mase:modeChanged', function(event, data) {
    // Update your custom UI elements
    if (data.mode === 'dark') {
        jQuery('.my-chart').addClass('dark-theme');
    } else {
        jQuery('.my-chart').removeClass('dark-theme');
    }
});
```

### Creating Custom Dark Palettes Programmatically

```php
// In your plugin or theme
add_filter('mase_color_palettes', function($palettes) {
    $palettes['my-custom-dark'] = [
        'name' => 'My Custom Dark',
        'type' => 'dark',
        'colors' => [
            'bg_primary' => '#1a1a1a',
            'bg_secondary' => '#2d2d2d',
            'text_primary' => '#e0e0e0',
            'text_secondary' => '#b0b0b0',
            'accent' => '#ff6b6b',
            'admin_bar_bg' => '#1a1a1a',
            'admin_bar_text' => '#e0e0e0',
            'admin_menu_bg' => '#2d2d2d',
            'admin_menu_text' => '#e0e0e0',
        ],
        'contrast_ratio' => 7.5,
        'luminance' => 0.15
    ];
    
    return $palettes;
});
```

### Modifying FAB Appearance

```css
/* Custom FAB styling */
.mase-dark-mode-fab {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    width: 60px !important;
    height: 60px !important;
}

.mase-dark-mode-fab:hover {
    transform: scale(1.1) !important;
}
```

### Disabling Dark Mode for Specific Pages

```php
// In your plugin or theme
add_action('admin_enqueue_scripts', function() {
    global $pagenow;
    
    // Disable dark mode on specific pages
    if ($pagenow === 'edit.php' || $pagenow === 'post.php') {
        wp_add_inline_script('mase-admin', '
            if (MASE && MASE.darkModeToggle) {
                MASE.darkModeToggle.config.enabled = false;
                jQuery(".mase-dark-mode-fab").hide();
            }
        ');
    }
}, 100);
```

---

## Code Examples

### Example 1: Custom Mode Toggle Button

Create your own toggle button that works with MASE:

```html
<button id="my-dark-mode-toggle">Toggle Dark Mode</button>
```

```javascript
jQuery(document).ready(function($) {
    $('#my-dark-mode-toggle').on('click', function() {
        if (MASE && MASE.darkModeToggle) {
            MASE.darkModeToggle.toggle();
        }
    });
    
    // Update button text on mode change
    $(document).on('mase:modeChanged', function(event, data) {
        $('#my-dark-mode-toggle').text(
            data.mode === 'dark' ? 'Switch to Light' : 'Switch to Dark'
        );
    });
});
```

### Example 2: Sync Dark Mode with External System

```javascript
// Sync MASE dark mode with your custom system
jQuery(document).ready(function($) {
    // Listen to MASE mode changes
    $(document).on('mase:modeChanged', function(event, data) {
        // Update your external system
        MyExternalSystem.setTheme(data.mode);
    });
    
    // Listen to external system changes
    MyExternalSystem.on('themeChanged', function(theme) {
        // Update MASE
        if (MASE && MASE.darkModeToggle) {
            MASE.darkModeToggle.setMode(theme);
        }
    });
});
```

### Example 3: Conditional Dark Mode Features

```javascript
jQuery(document).ready(function($) {
    $(document).on('mase:modeChanged', function(event, data) {
        if (data.mode === 'dark') {
            // Enable dark mode specific features
            enableNightShift();
            reduceAnimations();
            increaseFontSize();
        } else {
            // Disable dark mode specific features
            disableNightShift();
            restoreAnimations();
            restoreFontSize();
        }
    });
});
```

### Example 4: Programmatic Mode Control

```javascript
// Set mode programmatically
function setDarkModeBasedOnTime() {
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    if (MASE && MASE.darkModeToggle) {
        MASE.darkModeToggle.setMode(isDaytime ? 'light' : 'dark');
    }
}

// Run on page load
jQuery(document).ready(setDarkModeBasedOnTime);
```

---

## Testing

### Unit Tests

Dark mode unit tests are located in `tests/unit/test-dark-mode-*.test.js`.

**Run unit tests**:
```bash
npm run test:unit -- test-dark-mode
```

**Example unit test**:
```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Dark Mode Toggle', () => {
    beforeEach(() => {
        // Setup
        document.body.className = '';
        localStorage.clear();
    });
    
    it('should toggle mode correctly', () => {
        MASE.darkModeToggle.setMode('dark');
        expect(document.body.classList.contains('mase-dark-mode')).toBe(true);
        
        MASE.darkModeToggle.setMode('light');
        expect(document.body.classList.contains('mase-dark-mode')).toBe(false);
    });
    
    it('should save preference to localStorage', () => {
        MASE.darkModeToggle.setMode('dark');
        expect(localStorage.getItem('mase_dark_mode')).toBe('dark');
    });
});
```

### Integration Tests

Integration tests are located in `tests/integration/test-dark-mode-*.html`.

**Run integration tests**:
```bash
npm run test:integration
```

### E2E Tests

E2E tests use Playwright and are located in `tests/e2e/`.

**Run E2E tests**:
```bash
npm run test:e2e
```

**Example E2E test**:
```javascript
test('should toggle dark mode via FAB', async ({ page }) => {
    await page.goto('/wp-admin/');
    
    // Click FAB
    await page.click('.mase-dark-mode-fab');
    
    // Verify dark mode class
    const bodyClass = await page.getAttribute('body', 'class');
    expect(bodyClass).toContain('mase-dark-mode');
    
    // Verify localStorage
    const mode = await page.evaluate(() => localStorage.getItem('mase_dark_mode'));
    expect(mode).toBe('dark');
});
```

---

## Performance Considerations

### Optimization Techniques

1. **Debouncing**: Rapid toggles are prevented by the `isTransitioning` flag
2. **CSS Transitions**: Use GPU-accelerated CSS transitions instead of JavaScript animations
3. **localStorage First**: Check localStorage synchronously before page render to prevent FOUC
4. **Lazy AJAX**: AJAX save doesn't block UI thread
5. **CSS Caching**: Generated dark mode CSS is cached separately

### Performance Targets

- **Mode Toggle**: < 50ms (excluding transition time)
- **CSS Generation**: < 100ms
- **FOUC Prevention**: < 50ms initial mode determination
- **Transition Duration**: 300ms (configurable)

### Monitoring Performance

```javascript
// Profile mode toggle
console.time('Dark Mode Toggle');
MASE.darkModeToggle.toggle();
console.timeEnd('Dark Mode Toggle');

// Profile CSS generation (PHP)
$start = microtime(true);
$css = $this->generate_dark_mode_css($settings);
$duration = (microtime(true) - $start) * 1000;
error_log("CSS Generation: {$duration}ms");
```

### Reducing Performance Impact

1. **Disable Expensive Effects**: Reduce transition duration or disable animations
2. **Use Performance Mode**: Enable MASE Performance Mode to disable expensive effects
3. **Reduce Motion**: Enable `prefers-reduced-motion` in OS settings for instant transitions
4. **Optimize Palettes**: Use simpler color palettes with fewer custom properties

---

## Troubleshooting for Developers

### Debugging Mode Changes

```javascript
// Enable debug logging
MASE.darkModeToggle.debug = true;

// Log all mode changes
jQuery(document).on('mase:modeChanged', function(event, data) {
    console.log('Mode changed:', data);
    console.log('Current state:', MASE.darkModeToggle.state);
});
```

### Inspecting Generated CSS

```javascript
// View generated dark mode CSS
const styleElement = document.getElementById('mase-custom-css');
if (styleElement) {
    console.log(styleElement.textContent);
}
```

### Checking localStorage

```javascript
// Check saved preference
console.log('Saved mode:', localStorage.getItem('mase_dark_mode'));

// Clear preference
localStorage.removeItem('mase_dark_mode');
```

### Verifying AJAX Requests

```javascript
// Monitor AJAX requests
jQuery(document).ajaxComplete(function(event, xhr, settings) {
    if (settings.data && settings.data.includes('mase_toggle_dark_mode')) {
        console.log('Dark mode AJAX response:', xhr.responseJSON);
    }
});
```

---

## Additional Resources

- [Dark Mode User Guide](./DARK-MODE-USER-GUIDE.md)
- [MASE Architecture Documentation](./ARCHITECTURE.md)
- [Event Contracts](./EVENT-CONTRACTS.md)
- [Testing Guide](../tests/README.md)

---

## Contributing

If you'd like to contribute to the dark mode feature:

1. Read the [Architecture Overview](#architecture-overview)
2. Review existing code in `assets/js/mase-admin.js` and `includes/class-mase-*.php`
3. Write tests for new features
4. Follow WordPress and MASE coding standards
5. Submit a pull request with detailed description

---

## Version History

- **v1.2.0**: Initial dark mode implementation
- **v1.2.1**: Bug fixes and performance improvements
- **v1.3.0**: Enhanced system preference detection and custom events

---

## License

This feature is part of Modern Admin Styler Enterprise (MASE) and is licensed under the same terms as the main plugin.
