# Design Document

## Overview

This document outlines the technical design for implementing a global dark/light mode toggle feature in the Modern Admin Styler (MASE) plugin. The feature provides a Floating Action Button (FAB) accessible from any WordPress admin page, allowing users to seamlessly switch between light and dark color schemes with smooth animations, system preference detection, and persistent storage across sessions.

The implementation integrates with MASE's existing architecture including the settings management system, CSS generator, live preview functionality, and caching layer. The design prioritizes performance, accessibility, and user experience while maintaining backward compatibility with existing features.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WordPress Admin                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              FAB Component (UI Layer)                  │  │
│  │  • Floating Button                                     │  │
│  │  • Icon Animation                                      │  │
│  │  • Tooltip                                             │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Dark Mode Controller (JS Layer)                │  │
│  │  • Toggle Logic                                        │  │
│  │  • System Detection                                    │  │
│  │  • Keyboard Shortcuts                                  │  │
│  │  • Event Management                                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Persistence Layer (Storage)                    │  │
│  │  • localStorage (immediate)                            │  │
│  │  • WordPress User Meta (persistent)                    │  │
│  │  • AJAX Communication                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         PHP Backend (Server Layer)                     │  │
│  │  • MASE_Settings                                       │  │
│  │  • MASE_Admin (AJAX Handlers)                          │  │
│  │  • MASE_CSS_Generator                                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Click FAB
     ↓
Toggle Mode (JS)
     ↓
Update DOM Class (.mase-dark-mode)
     ↓
Apply CSS Transitions (0.3s)
     ↓
Save to localStorage (immediate)
     ↓
AJAX Request to Server
     ↓
Save to User Meta (persistent)
     ↓
Trigger Custom Event (mase:modeChanged)
```

## Components and Interfaces

### 1. FAB Component (Frontend)

**Location:** `assets/js/mase-admin.js` - New module `MASE.darkModeToggle`

**Responsibilities:**
- Render floating action button in bottom-right corner
- Display sun/moon icon based on current mode
- Show tooltip on hover
- Handle click events
- Animate icon rotation on mode change
- Respond to keyboard shortcuts

**Interface:**
```javascript
MASE.darkModeToggle = {
    // Configuration
    config: {
        fabSelector: '.mase-dark-mode-fab',
        bodyClass: 'mase-dark-mode',
        storageKey: 'mase_dark_mode',
        transitionDuration: 300,
        keyboardShortcut: { ctrl: true, shift: true, key: 'D' }
    },
    
    // State
    state: {
        currentMode: 'light', // 'light' | 'dark'
        isTransitioning: false,
        systemPreference: null
    },
    
    // Methods
    init: function() {},
    render: function() {},
    toggle: function() {},
    setMode: function(mode) {},
    detectSystemPreference: function() {},
    savePreference: function(mode) {},
    handleKeyboard: function(event) {},
    animateIcon: function() {}
};
```

### 2. Dark Mode Controller (Frontend)

**Location:** `assets/js/mase-admin.js` - Extension of `MASE.darkModeToggle`

**Responsibilities:**
- Manage mode state
- Coordinate between UI, storage, and server
- Handle system preference detection
- Manage transitions and animations
- Emit custom events

**Key Methods:**


```javascript
// Initialize dark mode system
init: function() {
    this.detectSystemPreference();
    this.loadSavedPreference();
    this.render();
    this.attachEventListeners();
    this.setupKeyboardShortcuts();
}

// Toggle between modes
toggle: function() {
    const newMode = this.state.currentMode === 'light' ? 'dark' : 'light';
    this.setMode(newMode);
}

// Set specific mode
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

### 3. Settings Integration (Backend)

**Location:** `includes/class-mase-settings.php`

**Responsibilities:**
- Define dark mode settings structure
- Provide default values
- Validate dark mode preferences
- Store dark and light palette configurations

**Settings Structure:**
```php
'dark_light_toggle' => array(
    'enabled' => true,
    'current_mode' => 'light', // 'light' | 'dark'
    'respect_system_preference' => true,
    'light_palette' => 'professional-blue',
    'dark_palette' => 'dark-elegance',
    'transition_duration' => 300, // milliseconds
    'keyboard_shortcut_enabled' => true,
    'fab_position' => array(
        'bottom' => 20, // pixels from bottom
        'right' => 20   // pixels from right
    )
)
```

### 4. AJAX Handler (Backend)

**Location:** `includes/class-mase-admin.php`

**Responsibilities:**
- Handle dark mode toggle requests
- Validate nonce and capabilities
- Save preference to user meta
- Return success/error responses

**Handler Method:**
```php
public function handle_ajax_toggle_dark_mode() {
    // Verify nonce
    check_ajax_referer('mase_save_settings', 'nonce');
    
    // Check capability
    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => 'Unauthorized'), 403);
    }
    
    // Get and validate mode
    $mode = isset($_POST['mode']) ? sanitize_text_field($_POST['mode']) : '';
    if (!in_array($mode, array('light', 'dark'), true)) {
        wp_send_json_error(array('message' => 'Invalid mode'), 400);
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
    
    wp_send_json_success(array(
        'message' => 'Mode saved successfully',
        'mode' => $mode
    ));
}
```

### 5. CSS Generator Extension (Backend)

**Location:** `includes/class-mase-css-generator.php`

**Responsibilities:**
- Generate dark mode CSS variables
- Create mode-specific color palettes
- Apply dark mode styles when `.mase-dark-mode` class is present
- Ensure WCAG contrast compliance

**New Method:**
```php
private function generate_dark_mode_css($settings) {
    $dark_toggle = isset($settings['dark_light_toggle']) 
        ? $settings['dark_light_toggle'] 
        : array();
    
    if (!isset($dark_toggle['enabled']) || !$dark_toggle['enabled']) {
        return '';
    }
    
    $css = '';
    
    // Get dark palette
    $dark_palette_id = isset($dark_toggle['dark_palette']) 
        ? $dark_toggle['dark_palette'] 
        : 'dark-elegance';
    
    $dark_palette = $this->settings->get_palette($dark_palette_id);
    
    // Generate dark mode CSS variables
    $css .= 'body.mase-dark-mode {';
    $css .= '--mase-bg-primary: ' . $dark_palette['bg_primary'] . ';';
    $css .= '--mase-bg-secondary: ' . $dark_palette['bg_secondary'] . ';';
    $css .= '--mase-text-primary: ' . $dark_palette['text_primary'] . ';';
    $css .= '--mase-text-secondary: ' . $dark_palette['text_secondary'] . ';';
    $css .= '--mase-accent: ' . $dark_palette['accent'] . ';';
    $css .= '}';
    
    // Apply dark mode to admin elements
    $css .= $this->generate_dark_admin_bar_css($dark_palette);
    $css .= $this->generate_dark_admin_menu_css($dark_palette);
    
    return $css;
}
```

## Data Models

### 1. Dark Mode Settings Model

**Storage:** WordPress option `mase_settings['dark_light_toggle']`

```php
array(
    'enabled' => boolean,
    'current_mode' => string, // 'light' | 'dark'
    'respect_system_preference' => boolean,
    'light_palette' => string, // palette ID
    'dark_palette' => string, // palette ID
    'transition_duration' => integer, // milliseconds
    'keyboard_shortcut_enabled' => boolean,
    'fab_position' => array(
        'bottom' => integer, // pixels
        'right' => integer   // pixels
    )
)
```

### 2. User Preference Model

**Storage:** WordPress user meta `mase_dark_mode_preference`

```php
// Value: 'light' | 'dark' | null (null = use system preference)
update_user_meta($user_id, 'mase_dark_mode_preference', 'dark');
```

### 3. Dark Mode Palette Model

**Storage:** Extension of existing palette structure in `mase_settings['palettes']`

```php
'dark-elegance' => array(
    'name' => 'Dark Elegance',
    'type' => 'dark', // NEW: 'light' | 'dark'
    'colors' => array(
        'bg_primary' => '#1a1a1a',
        'bg_secondary' => '#2d2d2d',
        'text_primary' => '#e0e0e0',
        'text_secondary' => '#b0b0b0',
        'accent' => '#4a9eff',
        'admin_bar_bg' => '#1a1a1a',
        'admin_bar_text' => '#e0e0e0',
        'admin_menu_bg' => '#2d2d2d',
        'admin_menu_text' => '#e0e0e0',
        'admin_menu_hover_bg' => '#3a3a3a',
        'admin_menu_hover_text' => '#4a9eff'
    ),
    'contrast_ratio' => 7.5, // WCAG AAA
    'luminance' => 0.15 // Dark mode indicator
)
```

## Error Handling

### 1. AJAX Request Failures

**Scenario:** Network error or server timeout during mode save

**Handling:**
```javascript
// In MASE.darkModeToggle.savePreference()
$.ajax({
    // ... request config
    error: function(xhr, status, error) {
        console.error('MASE: Failed to save dark mode preference', {
            status: xhr.status,
            error: error
        });
        
        // Visual mode change persists (localStorage)
        // Show non-blocking notice
        MASE.showNotice('warning', 
            'Dark mode applied locally. Preference will sync on next save.',
            3000
        );
        
        // Retry on next user interaction
        MASE.darkModeToggle.state.needsSync = true;
    }
});
```

### 2. localStorage Unavailable

**Scenario:** Private browsing or storage quota exceeded

**Handling:**
```javascript
try {
    localStorage.setItem('mase_dark_mode', mode);
} catch (e) {
    console.warn('MASE: localStorage unavailable, using user meta only');
    // Fall back to user meta only
    // Mode will load from server on page refresh
}
```

### 3. CSS Generation Failure

**Scenario:** Dark palette not found or CSS generator error

**Handling:**
```php
try {
    $css = $this->generate_dark_mode_css($settings);
} catch (Exception $e) {
    error_log('MASE: Dark mode CSS generation failed: ' . $e->getMessage());
    
    // Use fallback inline styles
    $css = $this->get_fallback_dark_mode_css();
}

private function get_fallback_dark_mode_css() {
    return 'body.mase-dark-mode {
        background-color: #1a1a1a !important;
        color: #e0e0e0 !important;
    }
    body.mase-dark-mode #wpadminbar {
        background-color: #1a1a1a !important;
        color: #e0e0e0 !important;
    }
    body.mase-dark-mode #adminmenu {
        background-color: #2d2d2d !important;
        color: #e0e0e0 !important;
    }';
}
```

### 4. System Preference Detection Failure

**Scenario:** Browser doesn't support `prefers-color-scheme`

**Handling:**
```javascript
detectSystemPreference: function() {
    if (!window.matchMedia) {
        console.warn('MASE: matchMedia not supported, defaulting to light mode');
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

## Testing Strategy

### 1. Unit Tests

**PHP Unit Tests** (`tests/unit/test-dark-mode-settings.php`):
- Test settings structure validation
- Test palette type detection (light/dark)
- Test user meta save/retrieve
- Test AJAX handler security (nonce, capability)

**JavaScript Unit Tests** (`tests/unit/test-dark-mode-toggle.js`):
- Test mode toggle logic
- Test localStorage operations
- Test system preference detection
- Test keyboard shortcut handling

### 2. Integration Tests

**Live Preview Integration** (`tests/integration/test-dark-mode-live-preview.html`):
- Test dark mode toggle with live preview active
- Verify preview updates immediately
- Verify settings don't save until explicit save

**Settings Save/Load** (`tests/integration/test-dark-mode-settings-save-load.php`):
- Test saving dark mode preference
- Test loading preference on page load
- Test preference sync across tabs

### 3. Visual Tests

**FAB Component** (`tests/visual-testing/dark-mode-fab-test.js`):
- Verify FAB renders in correct position
- Verify icon changes (sun/moon)
- Verify tooltip displays
- Verify animation on toggle

**Color Transitions** (`tests/visual-testing/dark-mode-transitions-test.js`):
- Verify smooth color transitions (0.3s)
- Verify no flash of unstyled content
- Verify icon rotation animation

### 4. Accessibility Tests

**Keyboard Navigation** (`tests/accessibility/test-dark-mode-keyboard.js`):
- Test Ctrl/Cmd+Shift+D shortcut
- Test FAB focus indicator
- Test Enter/Space key on FAB
- Test screen reader announcements

**Contrast Compliance** (`tests/accessibility/test-dark-mode-contrast.js`):
- Verify WCAG 2.1 AA compliance (4.5:1)
- Test all color combinations
- Verify text readability

### 5. Browser Compatibility Tests

**Cross-Browser** (`tests/browser-compatibility/test-dark-mode-browser-compat.js`):
- Chrome, Firefox, Safari, Edge
- Test localStorage support
- Test matchMedia support
- Test CSS custom properties

**Responsive** (`tests/browser-compatibility/test-dark-mode-responsive.js`):
- Test FAB position on mobile
- Test touch interactions
- Test reduced motion preference

## Performance Considerations

### 1. Initial Load Performance

**Goal:** Mode determination < 50ms

**Strategy:**
- Inline critical dark mode detection script in `<head>`
- Check localStorage synchronously before page render
- Apply `.mase-dark-mode` class immediately to prevent FOUC

```php
// In includes/class-mase-admin.php::enqueue_assets()
wp_add_inline_script('mase-admin', '
(function() {
    var savedMode = localStorage.getItem("mase_dark_mode");
    var userMeta = "' . get_user_meta(get_current_user_id(), 'mase_dark_mode_preference', true) . '";
    var mode = savedMode || userMeta || "light";
    
    if (mode === "dark") {
        document.body.classList.add("mase-dark-mode");
    }
})();
', 'before');
```

### 2. Toggle Performance

**Goal:** Visual update < 50ms (excluding transition time)

**Strategy:**
- Use CSS class toggle (fast DOM operation)
- Debounce AJAX save to prevent rapid requests
- Use CSS transitions for smooth visual change

### 3. CSS Generation Performance

**Goal:** Dark mode CSS generation < 100ms

**Strategy:**
- Cache generated dark mode CSS separately
- Invalidate only when palette changes
- Use string concatenation (not array joins)

### 4. Memory Management

**Strategy:**
- Remove event listeners on cleanup
- Clear transition timeouts
- Limit localStorage writes

## Security Considerations

### 1. CSRF Protection

- All AJAX requests verify nonce: `check_ajax_referer('mase_save_settings', 'nonce')`
- Nonce passed via `wp_localize_script()`
- Failed nonce returns 403 Forbidden

### 2. Capability Checks

- All AJAX handlers check: `current_user_can('manage_options')`
- User meta updates verify user ID
- Failed capability returns 403 Forbidden

### 3. Input Validation

- Mode value validated against whitelist: `['light', 'dark']`
- Palette IDs sanitized: `sanitize_text_field()`
- Numeric values validated: `absint()`, range checks

### 4. XSS Prevention

- All output escaped: `esc_html()`, `esc_attr()`, `esc_js()`
- CSS values sanitized before injection
- No user input directly in CSS

## Integration with Existing Systems

### 1. Live Preview System

**Integration Point:** `MASE.livePreview` module in `assets/js/mase-admin.js`

**Behavior:**
- Dark mode toggle works independently of live preview
- When live preview active, dark mode changes are temporary
- Exiting preview restores saved mode preference
- Preview updates trigger `mase:previewUpdated` event

**Implementation:**
```javascript
// In MASE.darkModeToggle.setMode()
if (MASE.livePreview && MASE.livePreview.isActive()) {
    // Temporary mode change for preview
    MASE.livePreview.updateDarkMode(mode);
} else {
    // Permanent mode change
    this.savePreference(mode);
}
```

### 2. Palette System

**Integration Point:** `MASE.paletteManager` module

**Behavior:**
- Each palette tagged as 'light' or 'dark' type
- Switching modes automatically applies corresponding palette
- Custom palettes can specify light/dark variants
- Palette changes update both light and dark configurations

### 3. Settings Export/Import

**Integration Point:** `includes/class-mase-admin.php::handle_ajax_export_settings()`

**Behavior:**
- Dark mode settings included in export
- Import restores dark mode preference
- Palette associations preserved
- User meta preference separate from global settings

### 4. Cache System

**Integration Point:** `includes/class-mase-cache.php`

**Behavior:**
- Dark mode CSS cached separately: `generated_css_dark`
- Light mode CSS cached separately: `generated_css_light`
- Mode toggle invalidates only active mode cache
- Palette change invalidates both caches

## Accessibility Features

### 1. Keyboard Navigation

- **Shortcut:** Ctrl/Cmd+Shift+D toggles mode
- **FAB Focus:** Visible focus indicator (2px outline)
- **Enter/Space:** Activates FAB when focused
- **Tab Order:** FAB included in natural tab order

### 2. Screen Reader Support

```html
<button class="mase-dark-mode-fab" 
        aria-label="Toggle dark mode" 
        aria-pressed="false"
        role="switch">
    <span class="dashicons dashicons-sun" aria-hidden="true"></span>
    <span class="sr-only">Current mode: Light</span>
</button>
```

**Announcements:**
```javascript
// After mode change
var announcement = mode === 'dark' 
    ? 'Dark mode activated' 
    : 'Light mode activated';
    
$('<div role="status" aria-live="polite" class="sr-only">')
    .text(announcement)
    .appendTo('body')
    .delay(1000)
    .remove();
```

### 3. Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
    .mase-dark-mode-fab,
    body.mase-dark-mode,
    body.mase-dark-mode * {
        transition-duration: 0s !important;
        animation-duration: 0s !important;
    }
}
```

### 4. High Contrast Mode

- Dark mode palettes meet WCAG AAA (7:1 contrast)
- Light mode palettes meet WCAG AA (4.5:1 contrast)
- User can override with custom high-contrast palette

## Migration Strategy

### 1. Existing Users

**First Load After Update:**
1. Check for existing color preferences
2. Determine if current palette is light or dark
3. Set initial mode based on palette luminance
4. Save preference to user meta
5. No visual change for existing users

### 2. New Users

**First Load:**
1. Detect system preference (`prefers-color-scheme`)
2. Apply corresponding mode
3. Save preference to localStorage and user meta
4. Show welcome tooltip on FAB

### 3. Backward Compatibility

- Existing palettes work without modification
- New 'type' field optional (auto-detected from luminance)
- Settings structure extends, doesn't replace
- Old exports import successfully (defaults applied)

## Future Enhancements

### 1. Auto-Schedule Mode Switching

- Switch to dark mode at sunset
- Switch to light mode at sunrise
- User-configurable schedule
- Geolocation-based timing

### 2. Per-Page Mode Preferences

- Remember mode per admin page
- Different modes for different contexts
- Smart mode suggestions

### 3. Custom Dark Palettes

- User-created dark mode palettes
- Automatic light-to-dark conversion
- Luminance inversion algorithm

### 4. Ambient Light Sensor

- Detect room brightness
- Auto-switch based on ambient light
- Requires browser API support

## Technical Decisions and Rationale

### 1. Why CSS Class Toggle vs. Inline Styles?

**Decision:** Use `.mase-dark-mode` body class

**Rationale:**
- Better performance (single class toggle vs. multiple style updates)
- Easier to override with custom CSS
- Cleaner separation of concerns
- Supports CSS transitions natively

### 2. Why localStorage + User Meta?

**Decision:** Dual storage strategy

**Rationale:**
- localStorage: Immediate persistence, no server round-trip
- User Meta: Cross-device sync, survives cache clear
- Fallback chain: localStorage → User Meta → System Preference

### 3. Why Separate Light/Dark Palettes?

**Decision:** Don't auto-invert colors

**Rationale:**
- Manual dark palettes look better (designed, not algorithmic)
- Allows fine-tuning contrast ratios
- Prevents accessibility issues from auto-inversion
- Gives designers full control

### 4. Why FAB vs. Settings Toggle?

**Decision:** Floating Action Button

**Rationale:**
- Always accessible (no need to open settings)
- Familiar pattern (mobile apps use FABs)
- Quick toggle encourages usage
- Doesn't clutter existing UI

## Conclusion

This design provides a comprehensive, performant, and accessible dark mode implementation that integrates seamlessly with MASE's existing architecture. The dual storage strategy ensures reliability, the FAB provides excellent UX, and the separate palette system maintains design quality.

The implementation prioritizes:
- **Performance:** < 50ms mode determination, < 100ms CSS generation
- **Accessibility:** WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- **Reliability:** Fallback strategies, error handling, graceful degradation
- **User Experience:** Smooth transitions, system preference detection, persistent preferences

Next steps: Create implementation tasks and begin development.
