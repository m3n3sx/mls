# Design Document

## Overview

This design document addresses four critical functionality issues in WOOW-ADMIN v1.2.0 that prevent core features from working. The solution involves implementing missing JavaScript functionality, correcting HTML structure, adding dark mode support, and fixing element ID mismatches. The design follows a modular approach with clear separation of concerns between JavaScript event handling, CSS theming, and HTML structure.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    WordPress Admin Page                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─── HTML Structure Layer
                              │    ├─ admin-settings-page.php
                              │    ├─ Card-based layout
                              │    └─ Correct element IDs
                              │
                              ├─── JavaScript Layer
                              │    ├─ mase-admin.js
                              │    ├─ Event handlers
                              │    ├─ Live preview engine
                              │    └─ AJAX communications
                              │
                              ├─── CSS Layer
                              │    ├─ mase-admin.css
                              │    ├─ Light theme variables
                              │    ├─ Dark theme variables
                              │    └─ Card layout styles
                              │
                              └─── PHP Backend Layer
                                   ├─ class-mase-admin.php
                                   ├─ AJAX handlers
                                   └─ Settings persistence
```

### Data Flow

```
User Interaction → JavaScript Event Handler → Live Preview Engine → CSS Variable Update → Visual Feedback
                                            ↓
                                      AJAX Request → PHP Handler → Database → Response → UI Update
```

## Components and Interfaces

### 1. JavaScript Handler (mase-admin.js)

**Purpose:** Manage all client-side interactions, live preview, and AJAX communications

**Key Modules:**

#### 1.1 MASEAdmin Object
```javascript
const MASEAdmin = {
    config: {
        livePreviewEnabled: boolean,  // Default: true (enabled by default)
        debounceDelay: number,
        previewFrame: null
    },
    
    state: {
        isDirty: boolean,
        currentPalette: string,
        currentTemplate: string
    },
    
    init(): void,
    bindEvents(): void,
    toggleLivePreview(): void,
    updateLivePreview(): void,
    saveSettings(): void,
    toggleDarkMode(): void
}
```

**Default Live Preview Initialization:**
The `init()` method will enable live preview by default to provide immediate visual feedback:
```javascript
init: function() {
    console.log('MASE Admin initializing...');
    
    // Enable live preview by default
    this.config.livePreviewEnabled = true;
    
    // Ensure checkbox is checked
    $('#mase-live-preview-toggle')
        .prop('checked', true)
        .attr('aria-checked', 'true');
    
    console.log('MASE: Live Preview enabled by default');
    
    // Initialize components
    this.bindEvents();
    this.initColorPickers();
    this.initSliders();
    this.loadSavedTab();
    
    console.log('MASE Admin initialized successfully');
}
```

#### 1.2 Live Preview Engine
```javascript
livePreview: {
    toggle(): void,
    bind(): void,
    unbind(): void,
    update(): void,
    collectSettings(): Object,
    generateCSS(settings): string,
    applyCSS(css): void
}
```

**Event Bindings:**
- `#mase-live-preview-toggle` → `change` → `toggleLivePreview()`
- `#master-dark-mode` → `change` → `toggleDarkMode()`
- `.mase-color-picker` → `change` → `updateLivePreview()` (debounced 100ms)
- `input[type="range"]` → `input` → `updateLivePreview()` (debounced 300ms)
- `#mase-save-settings` → `click` → `saveSettings()`
- `.mase-tab` → `click` → `switchTab()`

**CSS Generation Logic:**
```javascript
generatePreviewCSS(formData) {
    // Collect form values
    // Generate CSS rules for:
    // - Admin bar colors and dimensions
    // - Admin menu colors and dimensions
    // - Typography settings
    // - Visual effects
    // Return <style> tag with !important rules
}
```

### 2. HTML Structure (admin-settings-page.php)

**Current Problem:** Uses `<table>` elements for layout
**Solution:** Implement card-based layout system

**New Structure:**
```html
<div class="mase-admin-wrap">
    <div class="mase-header">
        <div class="mase-header-left">
            <h1>Title</h1>
        </div>
        <div class="mase-header-right">
            <input type="checkbox" 
                   id="mase-live-preview-toggle" 
                   checked 
                   role="switch"
                   aria-checked="true"
                   aria-label="Toggle live preview mode" />
            <input type="checkbox" id="master-dark-mode" />
            <button id="mase-save-settings">Save</button>
        </div>
    </div>
    
    <nav class="mase-tab-nav">
        <button class="mase-tab" data-tab="general">General</button>
        <!-- More tabs -->
    </nav>
    
    <div class="mase-tab-content-wrapper">
        <div class="mase-tab-content active" data-tab-content="general">
            <div class="mase-section-card">
                <h3>Section Title</h3>
                <div class="mase-settings-group">
                    <div class="mase-setting-row">
                        <label class="mase-setting-label">Label</label>
                        <div class="mase-setting-control">
                            <input type="text" />
                            <p class="description">Help text</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

**Element ID Corrections:**
- ✅ `id="mase-live-preview-toggle"` (currently missing or incorrect)
- ✅ `id="master-dark-mode"` (currently exists)
- ✅ `id="mase-save-settings"` (needs verification)

### 3. CSS Theme System (mase-admin.css)

**Light Theme (Default):**
```css
:root {
    --mase-primary: #0073aa;
    --mase-primary-hover: #005a87;
    --mase-bg-main: #f0f0f1;
    --mase-bg-secondary: #ffffff;
    --mase-surface: #ffffff;
    --mase-text-primary: #1d2327;
    --mase-text-secondary: #50575e;
    --mase-border-color: #c3c4c7;
}
```

**Dark Theme:**
```css
:root[data-theme="dark"] {
    --mase-primary: #4a9eff;
    --mase-primary-hover: #6cb0ff;
    --mase-bg-main: #1a1a1a;
    --mase-bg-secondary: #2d2d2d;
    --mase-surface: #2d2d2d;
    --mase-text-primary: #e0e0e0;
    --mase-text-secondary: #b0b0b0;
    --mase-border-color: #3a3a3a;
}
```

**Card Layout Styles:**
```css
.mase-section-card {
    background: var(--mase-surface);
    border: 1px solid var(--mase-border-color);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.mase-setting-row {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 16px;
    align-items: start;
    padding: 16px 0;
    border-bottom: 1px solid var(--mase-border-color);
}

.mase-setting-row:last-child {
    border-bottom: none;
}
```

### 4. PHP Backend (class-mase-admin.php)

**Current State:** AJAX handlers exist but JavaScript doesn't call them properly

**Required Modifications:**
```php
public function enqueue_assets( $hook ) {
    // Ensure mase-admin.js is enqueued with correct dependencies
    wp_enqueue_script(
        'mase-admin',
        plugins_url( '../assets/js/mase-admin.js', __FILE__ ),
        array( 'jquery', 'wp-color-picker' ),
        MASE_VERSION,
        true
    );
    
    // Localize script with nonce and AJAX URL
    wp_localize_script(
        'mase-admin',
        'maseAdmin',
        array(
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'nonce'   => wp_create_nonce( 'mase_save_settings' ),
        )
    );
}
```

**AJAX Handler for Settings Save:**
```php
public function handle_ajax_save_settings() {
    // Verify nonce
    check_ajax_referer( 'mase_save_settings', 'nonce' );
    
    // Check permissions
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( 'Unauthorized' );
    }
    
    // Get settings from POST
    $settings = $_POST['settings'];
    
    // Validate and sanitize
    $validated = $this->settings->validate( $settings );
    
    // Save to database
    $result = $this->settings->update_option( $validated );
    
    // Invalidate cache
    $this->cache->invalidate( 'generated_css' );
    
    // Return response
    wp_send_json_success( array(
        'message' => 'Settings saved successfully'
    ) );
}
```

## Data Models

### Settings Object Structure
```javascript
{
    master: {
        enabled: boolean,
        dark_mode: boolean,
        apply_to_login: boolean
    },
    admin_bar: {
        bg_color: string,      // hex color
        text_color: string,    // hex color
        height: number         // pixels
    },
    admin_menu: {
        bg_color: string,
        text_color: string,
        hover_bg_color: string,
        hover_text_color: string,
        width: number
    },
    typography: {
        admin_bar: {
            font_size: number,
            font_weight: number,
            line_height: number
        },
        admin_menu: {
            font_size: number,
            font_weight: number,
            line_height: number
        }
    },
    visual_effects: {
        admin_bar: {
            border_radius: number,
            shadow_intensity: string
        },
        admin_menu: {
            border_radius: number,
            shadow_intensity: string
        }
    }
}
```

### Live Preview CSS Template
```javascript
const cssTemplate = `
<style id="mase-preview-css">
    #wpadminbar {
        background: ${settings.admin_bar.bg_color} !important;
        height: ${settings.admin_bar.height}px !important;
    }
    
    #wpadminbar * {
        color: ${settings.admin_bar.text_color} !important;
    }
    
    #adminmenuwrap,
    #adminmenu {
        background: ${settings.admin_menu.bg_color} !important;
        width: ${settings.admin_menu.width}px !important;
    }
    
    #adminmenu a {
        color: ${settings.admin_menu.text_color} !important;
    }
    
    #adminmenu li:hover {
        background: ${settings.admin_menu.hover_bg_color} !important;
    }
</style>
`;
```

## Error Handling

### JavaScript Error Handling
```javascript
try {
    // Operation
} catch (error) {
    console.error('MASE Error:', error);
    MASEAdmin.showNotice('An error occurred. Please try again.', 'error');
}
```

### AJAX Error Handling
```javascript
$.ajax({
    // ... config
    success: function(response) {
        if (response.success) {
            MASEAdmin.showNotice(response.data.message, 'success');
        } else {
            MASEAdmin.showNotice(response.data.message, 'error');
        }
    },
    error: function(xhr, status, error) {
        let message = 'Network error. Please try again.';
        if (xhr.status === 403) {
            message = 'Permission denied.';
        } else if (xhr.status === 500) {
            message = 'Server error. Please try again later.';
        }
        MASEAdmin.showNotice(message, 'error');
    }
});
```

### PHP Error Handling
```php
try {
    // Operation
} catch ( Exception $e ) {
    error_log( 'MASE Error: ' . $e->getMessage() );
    wp_send_json_error( array(
        'message' => __( 'An error occurred. Please try again.', 'mase' )
    ) );
}
```

## Testing Strategy

### Unit Tests
1. **JavaScript Functions**
   - Test `collectFormData()` returns correct object structure
   - Test `generatePreviewCSS()` produces valid CSS
   - Test `debounce()` utility delays execution correctly
   - Test `toggleDarkMode()` sets correct attributes

2. **PHP Functions**
   - Test `handle_ajax_save_settings()` validates nonce
   - Test `handle_ajax_save_settings()` checks permissions
   - Test settings validation and sanitization
   - Test cache invalidation on save

### Integration Tests
1. **Live Preview Flow**
   - Enable live preview toggle
   - Change color picker value
   - Verify CSS is applied within 300ms
   - Verify preview CSS has !important rules

2. **Dark Mode Flow**
   - Toggle dark mode checkbox
   - Verify `data-theme="dark"` attribute is set
   - Verify localStorage is updated
   - Reload page and verify dark mode persists

3. **Settings Save Flow**
   - Modify multiple settings
   - Click save button
   - Verify AJAX request is sent with nonce
   - Verify success notification appears
   - Verify settings persist after page reload

### Browser Compatibility Tests
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Test localStorage API
- Test CSS custom properties
- Test AJAX/Fetch API

### Accessibility Tests
- Keyboard navigation through tabs
- Screen reader announcements for live regions
- Focus management on modal/notice display
- Color contrast ratios (WCAG AA)

## Dual Live Preview System Conflict Resolution

### Problem Analysis

The plugin currently loads TWO separate live preview systems simultaneously:

1. **System 1**: `mase-admin.js` creates `MASE.livePreview` object
2. **System 2**: `mase-admin-live-preview.js` creates `MASEAdmin.livePreview` object

Both systems:
- Bind to the same `#mase-live-preview-toggle` element
- Execute in `$(document).ready()` causing race conditions
- The last system to initialize "wins" and overwrites the previous handler

### Root Causes

1. **Duplicate Enqueue**: Lines 130-148 in `class-mase-admin.php` enqueue both files
2. **Dashicon Blocking**: Dashicon positioned BEFORE checkbox blocks click events
3. **Hardcoded State**: `checked` attribute hardcoded in HTML instead of dynamic

### Solution Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Single Live Preview System                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─── PHP Layer (class-mase-admin.php)
                              │    ├─ Enqueue ONLY mase-admin.js
                              │    ├─ Add inline CSS for pointer-events fix
                              │    └─ Remove mase-admin-live-preview.js enqueue
                              │
                              ├─── HTML Layer (admin-settings-page.php)
                              │    ├─ Move dashicon inside <label>
                              │    ├─ Dynamic checked attribute from settings
                              │    └─ Proper ARIA attributes
                              │
                              └─── JavaScript Layer (mase-admin.js)
                                   ├─ Single MASE.livePreview object
                                   ├─ Bind once to toggle element
                                   └─ No race conditions
```

### Implementation Details

#### Step 1: Disable Conflicting File
In `class-mase-admin.php` (lines ~140-148):
```php
/** 
 * TEMPORARILY DISABLED: Conflicts with MASE.livePreview in mase-admin.js
 * TODO: Consolidate live preview systems into single implementation
 */
/*
wp_enqueue_script(
    'mase-admin-live-preview',
    plugins_url( '../assets/js/mase-admin-live-preview.js', __FILE__ ),
    array( 'jquery', 'mase-admin' ),
    MASE_VERSION,
    true
);
*/
```

#### Step 2: Add Pointer Events Fix
In `class-mase-admin.php` (after line ~170, after `wp_localize_script`):
```php
// Force pointer-events fix for dashicons blocking toggles
wp_add_inline_style( 
    'mase-admin', 
    '.mase-toggle-wrapper .dashicons,
     .mase-header-toggle .dashicons,
     [class*="toggle"] .dashicons {
         pointer-events: none !important;
     }' 
);
```

#### Step 3: Fix HTML Structure
In `admin-settings-page.php` (lines ~70-80):
```html
<!-- BEFORE (problematic): -->
<div class="mase-header-toggle">
    <span class="dashicons dashicons-visibility"></span>
    <input type="checkbox" id="mase-live-preview-toggle" checked />
    <label for="mase-live-preview-toggle">Live Preview</label>
</div>

<!-- AFTER (fixed): -->
<div class="mase-header-toggle">
    <input type="checkbox" 
           id="mase-live-preview-toggle" 
           <?php checked( $settings['master']['live_preview'] ?? true, true ); ?>
           role="switch"
           aria-checked="<?php echo esc_attr( $settings['master']['live_preview'] ?? true ? 'true' : 'false' ); ?>"
           aria-label="<?php esc_attr_e('Toggle live preview mode', 'modern-admin-styler'); ?>" />
    <label for="mase-live-preview-toggle">
        <span class="dashicons dashicons-visibility"></span>
        Live Preview
    </label>
</div>
```

Benefits of new structure:
- Clicking dashicon = clicking label = toggling checkbox (native HTML behavior)
- No JavaScript required for icon click handling
- Better accessibility

## Default Live Preview Feature

### Overview
Live preview will be enabled by default when the settings page loads, providing immediate visual feedback to users without requiring manual activation.

### Implementation Approach

#### HTML Changes
The live preview checkbox in `admin-settings-page.php` will include dynamic `checked` attribute:
```html
<input type="checkbox" 
       class="mase-toggle-input"
       id="mase-live-preview-toggle"
       name="mase_live_preview" 
       value="1"
       <?php checked( $settings['master']['live_preview'] ?? true, true ); ?>
       role="switch"
       aria-checked="<?php echo esc_attr( $settings['master']['live_preview'] ?? true ? 'true' : 'false' ); ?>"
       aria-label="<?php esc_attr_e('Toggle live preview mode', 'modern-admin-styler'); ?>" />
```

#### JavaScript Changes
The `init()` method in `mase-admin.js` will:
1. Set `config.livePreviewEnabled = true` by default
2. Ensure the checkbox is checked programmatically
3. Update ARIA attributes for accessibility
4. Log the default state to console

```javascript
init: function() {
    console.log('MASE Admin initializing...');
    
    // Enable live preview by default
    this.config.livePreviewEnabled = true;
    
    // Ensure checkbox is checked
    $('#mase-live-preview-toggle')
        .prop('checked', true)
        .attr('aria-checked', 'true');
    
    console.log('MASE: Live Preview enabled by default');
    
    // Initialize components
    this.bindEvents();
    this.initColorPickers();
    this.initSliders();
    this.loadSavedTab();
    
    console.log('MASE Admin initialized successfully');
}
```

### User Experience Benefits
- **Immediate Feedback**: Users see changes instantly without needing to discover the toggle
- **Reduced Friction**: Eliminates an extra step in the workflow
- **Better Discovery**: Users naturally understand the live preview feature is available
- **Consistent Behavior**: Matches user expectations from modern admin interfaces

### Backward Compatibility
Users who prefer to disable live preview can still uncheck the toggle. The preference is not persisted to localStorage, so each page load starts with live preview enabled.

## Performance Considerations

### Debouncing
- Color picker changes: 100ms debounce
- Slider changes: 300ms debounce
- Text input changes: 300ms debounce

### CSS Injection
- Remove existing `#mase-preview-css` before injecting new
- Use single `<style>` tag to minimize DOM operations
- Apply `!important` rules to override WordPress defaults

### AJAX Optimization
- Disable save button during request
- Show loading state immediately
- Cache AJAX responses where appropriate
- Implement request cancellation for rapid changes

### LocalStorage Usage
- Store dark mode preference: `mase_dark_mode`
- Store active tab: `mase_active_tab`
- Limit storage to essential preferences only

## Security Considerations

### Nonce Verification
- All AJAX requests must include nonce
- Verify nonce on server side before processing
- Generate new nonce on page load

### Capability Checks
- Verify `manage_options` capability for all operations
- Return 403 error for unauthorized requests

### Input Sanitization
- Sanitize all color values (hex format validation)
- Sanitize numeric inputs (min/max validation)
- Escape all output in HTML

### XSS Prevention
- Use `esc_attr()` for HTML attributes
- Use `esc_html()` for text content
- Use `wp_kses()` for rich content

## Migration Strategy

### Phase 1: JavaScript Implementation
1. Create complete `mase-admin.js` file
2. Implement all event handlers
3. Implement live preview engine
4. Test in isolation with mock data

### Phase 2: HTML Structure Update
1. Update `admin-settings-page.php` with card layout
2. Fix element IDs
3. Ensure proper ARIA attributes
4. Test accessibility

### Phase 3: CSS Theme System
1. Add dark mode CSS variables
2. Add card layout styles
3. Test theme switching
4. Verify localStorage persistence

### Phase 4: PHP Backend Verification
1. Verify AJAX handlers exist
2. Verify script enqueuing
3. Verify nonce generation
4. Test end-to-end flow

### Phase 5: Integration Testing
1. Test all features together
2. Test cross-browser compatibility
3. Test performance
4. Fix any issues found

## Rollback Plan

If critical issues are discovered:
1. Disable live preview feature via PHP constant
2. Revert to table-based layout if card layout causes issues
3. Disable dark mode if theme switching fails
4. Keep existing AJAX handlers as fallback

## Documentation Updates

### User Documentation
- How to use live preview
- How to enable dark mode
- How to navigate tabs
- How to save settings

### Developer Documentation
- JavaScript API reference
- CSS custom properties reference
- PHP filter/action hooks
- Extension points for third-party developers
