# Design Document - MASE Critical Bugs Comprehensive Fix

## Overview

This design addresses 8 critical bugs in the MASE plugin through targeted fixes to JavaScript event handlers, CSS styling, and AJAX communication. The solution maintains backward compatibility while fixing core functionality issues that prevent proper operation.

### Design Principles

1. **Minimal Invasiveness** - Fix only what's broken without refactoring working code
2. **Evidence-Based** - Each fix targets a specific, verified issue with file/line references
3. **Backward Compatibility** - Maintain existing API contracts and data structures
4. **Progressive Enhancement** - Ensure graceful degradation if features fail
5. **Performance** - Avoid adding unnecessary DOM operations or event listeners

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     MASE Admin Interface                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Settings   │  │  Live Preview│  │  Dark Mode   │      │
│  │     Save     │  │    Engine    │  │     Sync     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  MASE Core JS  │                        │
│                    │  (mase-admin.js)│                       │
│                    └───────┬────────┘                        │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │             │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐     │
│  │  Form Data   │  │  CSS Engine  │  │  Event       │     │
│  │  Collection  │  │  Generator   │  │  Handlers    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Interaction → Event Handler → State Update → CSS Generation → DOM Update
                                         ↓
                                    AJAX Request → Server → Database
```


## Components and Interfaces

### 1. Settings Save System

**Current Issue:** Form data collection incomplete, AJAX error handling insufficient

**Location:** `assets/js/mase-admin.js` (lines need to be identified)

**Root Cause Analysis:**
- Missing form field selectors in data collection
- Inadequate error response parsing
- No validation before AJAX submission

**Solution Design:**

```javascript
// Enhanced form data collection
collectFormData: function() {
    var data = {
        master: {},
        admin_bar: {},
        admin_menu: {},
        content: {},
        typography: {},
        visual_effects: {},
        performance: {}
    };
    
    // Collect all input types systematically
    // Text inputs, numbers, colors
    $('input[type="text"], input[type="number"], input[type="color"]').each(function() {
        var name = $(this).attr('name');
        if (name) {
            setNestedValue(data, name, $(this).val());
        }
    });
    
    // Checkboxes (boolean values)
    $('input[type="checkbox"]').each(function() {
        var name = $(this).attr('name');
        if (name) {
            setNestedValue(data, name, $(this).is(':checked'));
        }
    });
    
    // Range sliders
    $('input[type="range"]').each(function() {
        var name = $(this).attr('name');
        if (name) {
            setNestedValue(data, name, parseFloat($(this).val()));
        }
    });
    
    // Select dropdowns
    $('select').each(function() {
        var name = $(this).attr('name');
        if (name) {
            setNestedValue(data, name, $(this).val());
        }
    });
    
    return data;
}
```

**Error Handling Enhancement:**

```javascript
error: function(xhr, status, error) {
    var errorMessage = 'Failed to save settings.';
    
    // Parse server response
    if (xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) {
        errorMessage = xhr.responseJSON.data.message;
    } else if (xhr.status === 403) {
        errorMessage = 'Permission denied. Please refresh and try again.';
    } else if (xhr.status === 500) {
        errorMessage = 'Server error. Please check error logs.';
    } else if (xhr.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
    }
    
    self.showNotice('error', errorMessage);
    console.error('MASE Save Error:', {
        status: xhr.status,
        statusText: xhr.statusText,
        responseText: xhr.responseText
    });
}
```


### 2. Admin Menu Height Mode Fix

**Current Issue:** "Fit to Content" option doesn't work - menu stays at 100% height

**Location:** 
- `assets/js/mase-admin.js:1070-1078` - CSS generation logic
- `includes/class-mase-css-generator.php:176-182` - Server-side CSS generation

**Root Cause Analysis:**
- CSS specificity issue - WordPress core styles override MASE styles
- Missing !important declarations where needed
- Incomplete selector coverage

**Current Code (Broken):**
```javascript
// Line 1070-1078 in mase-admin.js
var heightMode = $('#admin-menu-height-mode').val() || 'full';

if (heightMode === 'content') {
    css += 'body.wp-admin #adminmenuwrap,';
    css += 'body.wp-admin #adminmenuback {';
    css += '  height: auto !important;';
    css += '  min-height: 100vh;';
    css += '}';
}
```

**Problem:** WordPress applies `height: 100%` with higher specificity

**Solution Design:**

```javascript
// Enhanced CSS generation with proper specificity
if (heightMode === 'content') {
    // Target both wrapper and background with maximum specificity
    css += 'body.wp-admin #adminmenuwrap,';
    css += 'body.wp-admin #adminmenuback,';
    css += 'body.wp-admin #adminmenumain {';
    css += '  height: auto !important;';
    css += '  min-height: 0 !important;';  // Override min-height: 100vh
    css += '}';
    
    // Ensure menu container fits content
    css += 'body.wp-admin #adminmenu {';
    css += '  height: auto !important;';
    css += '  min-height: 0 !important;';
    css += '}';
    
    // Allow natural height for menu items
    css += 'body.wp-admin #adminmenu li.menu-top {';
    css += '  height: auto !important;';
    css += '}';
}
```

**Server-Side Fix (class-mase-css-generator.php):**

```php
// Line 176-182 - Enhanced version
if ( 'content' === $height_mode ) {
    $css .= 'body.wp-admin #adminmenuwrap,';
    $css .= 'body.wp-admin #adminmenuback,';
    $css .= 'body.wp-admin #adminmenumain {';
    $css .= '  height: auto !important;';
    $css .= '  min-height: 0 !important;';
    $css .= '}';
    
    $css .= 'body.wp-admin #adminmenu {';
    $css .= '  height: auto !important;';
    $css .= '  min-height: 0 !important;';
    $css .= '}';
}
```


### 3. Slider Visual Rendering Fix

**Current Issue:** Sliders show only circle (thumb) without track/rail

**Location:** `assets/css/mase-admin.css` - Missing slider styles

**Root Cause Analysis:**
- CSS references `.mase-range-value` but no styles for `input[type="range"]`
- Browser default slider styles are suppressed by reset
- No custom track/thumb styling provided

**Evidence from admin-settings-page.php:**
```php
// Line 447 - Slider markup exists
<input 
    type="range" 
    id="admin-bar-line-height"
    name="typography[admin_bar][line_height]" 
    value="<?php echo esc_attr( $settings['typography']['admin_bar']['line_height'] ); ?>"
    min="1.0"
    max="2.0"
    step="0.1"
/>
<span class="mase-range-value"><?php echo esc_html( $settings['typography']['admin_bar']['line_height'] ); ?></span>
```

**Solution Design:**

Add comprehensive slider styling to `assets/css/mase-admin.css`:

```css
/* Slider Base Styles */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: var(--mase-gray-200);
  border-radius: var(--mase-radius-full);
  outline: none;
  transition: background var(--mase-transition-base);
}

/* Slider Track - Webkit (Chrome, Safari, Edge) */
input[type="range"]::-webkit-slider-track {
  width: 100%;
  height: 6px;
  background: var(--mase-gray-200);
  border-radius: var(--mase-radius-full);
}

/* Slider Track - Firefox */
input[type="range"]::-moz-range-track {
  width: 100%;
  height: 6px;
  background: var(--mase-gray-200);
  border-radius: var(--mase-radius-full);
}

/* Slider Thumb - Webkit */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--mase-primary);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: var(--mase-shadow-sm);
  transition: all var(--mase-transition-base);
}

/* Slider Thumb - Firefox */
input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--mase-primary);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: var(--mase-shadow-sm);
  transition: all var(--mase-transition-base);
}

/* Hover States */
input[type="range"]:hover {
  background: var(--mase-gray-300);
}

input[type="range"]:hover::-webkit-slider-thumb {
  background: var(--mase-primary-hover);
  transform: scale(1.1);
}

input[type="range"]:hover::-moz-range-thumb {
  background: var(--mase-primary-hover);
  transform: scale(1.1);
}

/* Focus States */
input[type="range"]:focus {
  outline: none;
}

input[type="range"]:focus::-webkit-slider-thumb {
  box-shadow: var(--mase-shadow-focus);
}

input[type="range"]:focus::-moz-range-thumb {
  box-shadow: var(--mase-shadow-focus);
}

/* Value Display */
.mase-range-value {
  display: inline-block;
  min-width: 50px;
  padding: var(--mase-space-xs) var(--mase-space-sm);
  margin-left: var(--mase-space-sm);
  background: var(--mase-gray-100);
  border-radius: var(--mase-radius-sm);
  font-size: var(--mase-font-size-sm);
  font-weight: var(--mase-font-weight-medium);
  text-align: center;
  color: var(--mase-text);
}
```


### 4. Default Menu Spacing Fix

**Current Issue:** Default menu appears oversized/compressed with incorrect spacing

**Location:** `assets/js/mase-admin.js` - CSS generation for admin menu

**Root Cause Analysis:**
- Custom spacing values don't match WordPress defaults
- Missing or incorrect padding/margin values
- Font size inconsistencies

**WordPress Default Values:**
- Menu item padding: `6px 12px`
- Font size: `13px`
- Line height: `18px`
- Submenu indent: `12px`

**Solution Design:**

```javascript
// In generateAdminMenuCSS function
function generateAdminMenuCSS(settings) {
    var css = '';
    
    // Use WordPress default spacing when no custom values set
    var menuPadding = settings.admin_menu.item_padding || '6px 12px';
    var fontSize = settings.admin_menu.font_size || 13;
    var lineHeight = settings.admin_menu.line_height || 18;
    
    css += 'body.wp-admin #adminmenu li.menu-top {';
    css += '  padding: ' + menuPadding + ';';
    css += '}';
    
    css += 'body.wp-admin #adminmenu a {';
    css += '  font-size: ' + fontSize + 'px;';
    css += '  line-height: ' + lineHeight + 'px;';
    css += '}';
    
    // Submenu indentation
    css += 'body.wp-admin #adminmenu .wp-submenu {';
    css += '  padding-left: 12px;';
    css += '}';
    
    css += 'body.wp-admin #adminmenu .wp-submenu li {';
    css += '  padding: 5px 0;';
    css += '}';
    
    return css;
}
```

**Default Settings Update (class-mase-settings.php):**

```php
// Ensure defaults match WordPress
'admin_menu' => array(
    'bg_color'          => '#23282d',
    'text_color'        => '#ffffff',
    'hover_bg_color'    => '#0073aa',
    'hover_text_color'  => '#00b9eb',
    'width'             => 160,
    'height_mode'       => 'full',
    'item_padding'      => '6px 12px',  // WordPress default
    'font_size'         => 13,          // WordPress default
    'line_height'       => 18,          // WordPress default
),
```


### 5. Reset to WordPress Defaults

**Current Issue:** Reset button doesn't fully restore WordPress defaults

**Location:** `assets/js/mase-admin.js` - Reset handler (needs to be added/fixed)

**Root Cause Analysis:**
- Incomplete cleanup of injected styles
- Live preview CSS not removed
- Settings not fully cleared from database

**Solution Design:**

```javascript
// Complete reset implementation
resetToDefaults: function() {
    var self = MASE;
    
    // Confirmation dialog
    var confirmMessage = 'Reset all MASE settings to WordPress defaults?\n\n' +
        'This will:\n' +
        '• Remove all color customizations\n' +
        '• Clear all typography settings\n' +
        '• Delete all visual effects\n' +
        '• Remove custom palettes and templates\n\n' +
        'This action cannot be undone.';
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Show loading state
    self.showNotice('info', 'Resetting to WordPress defaults...', false);
    $('#mase-reset-all').prop('disabled', true);
    
    // Step 1: Remove all injected style elements
    $('style[id^="mase-"]').remove();
    $('#mase-live-preview-styles').remove();
    $('#mase-custom-styles').remove();
    
    // Step 2: Remove data-theme attribute
    $('html, body').removeAttr('data-theme');
    
    // Step 3: Clear live preview state
    self.state.livePreviewEnabled = false;
    $('#mase-live-preview-toggle').prop('checked', false);
    
    // Step 4: Send AJAX request to clear database settings
    $.ajax({
        url: self.config.ajaxUrl,
        type: 'POST',
        data: {
            action: 'mase_reset_settings',
            nonce: self.config.nonce
        },
        success: function(response) {
            if (response.success) {
                self.showNotice('success', 'Settings reset successfully. Reloading page...');
                
                // Reload page after 1 second to show WordPress defaults
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            } else {
                self.showNotice('error', response.data.message || 'Failed to reset settings');
                $('#mase-reset-all').prop('disabled', false);
            }
        },
        error: function(xhr) {
            var message = 'Network error. Please try again.';
            if (xhr.status === 403) {
                message = 'Permission denied.';
            }
            self.showNotice('error', message);
            $('#mase-reset-all').prop('disabled', false);
        }
    });
}
```

**Server-Side Handler (class-mase-admin.php):**

```php
// Add AJAX handler for reset
public function handle_reset_settings() {
    // Verify nonce
    check_ajax_referer( 'mase_nonce', 'nonce' );
    
    // Check permissions
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( array( 'message' => 'Insufficient permissions' ) );
    }
    
    // Delete all MASE options
    delete_option( 'mase_settings' );
    delete_option( 'mase_custom_palettes' );
    delete_option( 'mase_custom_templates' );
    
    // Clear cache
    if ( class_exists( 'MASE_Cache' ) ) {
        MASE_Cache::clear_all();
    }
    
    wp_send_json_success( array( 'message' => 'Settings reset successfully' ) );
}
```


### 6. Dark Mode Synchronization

**Current Issue:** Dark mode toggles don't synchronize between header and settings form

**Location:** 
- `includes/admin-settings-page.php:52-62` - Header toggle
- `includes/admin-settings-page.php:238-252` - Master controls toggle

**Root Cause Analysis:**
- Two separate checkbox inputs with different IDs
- No event listener connecting the two controls
- State changes don't propagate between controls

**Current Markup:**
```html
<!-- Header toggle -->
<input type="checkbox" id="mase-dark-mode-toggle" name="mase_dark_mode" />

<!-- Master controls toggle -->
<input type="checkbox" id="master-dark-mode" name="master[dark_mode]" />
```

**Solution Design:**

```javascript
// Dark mode synchronization handler
darkModeSync: {
    init: function() {
        var self = MASE;
        
        // Sync header toggle to master controls
        $('#mase-dark-mode-toggle').on('change', function() {
            var isChecked = $(this).is(':checked');
            
            // Update master controls checkbox
            $('#master-dark-mode').prop('checked', isChecked)
                .attr('aria-checked', isChecked ? 'true' : 'false');
            
            // Apply dark mode immediately
            self.darkModeSync.apply(isChecked);
        });
        
        // Sync master controls to header toggle
        $('#master-dark-mode').on('change', function() {
            var isChecked = $(this).is(':checked');
            
            // Update header toggle
            $('#mase-dark-mode-toggle').prop('checked', isChecked)
                .attr('aria-checked', isChecked ? 'true' : 'false');
            
            // Apply dark mode immediately
            self.darkModeSync.apply(isChecked);
        });
    },
    
    apply: function(enabled) {
        if (enabled) {
            // Apply dark mode
            $('html').attr('data-theme', 'dark');
            
            // Update state
            MASE.state.darkModeEnabled = true;
            
            // Trigger live preview update if enabled
            if (MASE.state.livePreviewEnabled) {
                MASE.updatePreview();
            }
        } else {
            // Remove dark mode
            $('html').removeAttr('data-theme');
            
            // Update state
            MASE.state.darkModeEnabled = false;
            
            // Trigger live preview update if enabled
            if (MASE.state.livePreviewEnabled) {
                MASE.updatePreview();
            }
        }
    }
}
```

**Initialization:**

```javascript
// In MASE.init()
jQuery(document).ready(function($) {
    // ... existing initialization ...
    
    // Initialize dark mode sync
    MASE.darkModeSync.init();
    
    // Apply initial dark mode state from settings
    var darkModeEnabled = $('#mase-dark-mode-toggle').is(':checked');
    MASE.darkModeSync.apply(darkModeEnabled);
});
```


### 7. Scroll Position Stability

**Current Issue:** Page jumps during load, blue focus rings appear on interactions

**Location:** 
- `assets/js/mase-admin.js` - Initialization code
- `assets/css/mase-admin.css` - Focus state styling

**Root Cause Analysis:**
- Auto-focus on form elements during initialization
- Default browser focus outlines (blue rings) not suppressed
- Event handlers triggering scroll events

**Solution Design:**

**JavaScript Fix:**

```javascript
// Prevent scroll jumps during initialization
init: function() {
    var self = MASE;
    
    // Store initial scroll position
    var scrollTop = $(window).scrollTop();
    
    // Initialize components without triggering focus
    self.initializeColorPickers();
    self.initializeSliders();
    self.initializeTabs();
    
    // Restore scroll position after initialization
    $(window).scrollTop(scrollTop);
    
    // Remove focus from any auto-focused elements
    $(':focus').blur();
}

// Remove focus rings after interaction
$('input, select, textarea, button').on('mouseup', function() {
    $(this).blur();
});

// Prevent scroll on programmatic focus
$('input, select, textarea').on('focus', function(e) {
    // Don't scroll to focused element
    e.preventDefault();
    
    // Store scroll position
    var scrollTop = $(window).scrollTop();
    
    // Allow focus but restore scroll
    setTimeout(function() {
        $(window).scrollTop(scrollTop);
    }, 0);
});
```

**CSS Fix:**

```css
/* Remove default focus outlines */
input:focus,
select:focus,
textarea:focus,
button:focus {
  outline: none;
}

/* Add subtle focus indicator for accessibility */
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
button:focus-visible {
  box-shadow: 0 0 0 2px var(--mase-primary-light);
  outline: none;
}

/* Prevent blue rings on click */
*:focus {
  outline: none;
}

/* Keyboard navigation focus (for accessibility) */
*:focus-visible {
  outline: 2px solid var(--mase-primary);
  outline-offset: 2px;
}

/* Remove focus ring after mouse interaction */
.mase-no-focus-ring:focus {
  outline: none !important;
  box-shadow: none !important;
}
```

**Prevent Scroll Jump on Tab Switch:**

```javascript
// Tab switching without scroll
$('.mase-tab-button').on('click', function(e) {
    e.preventDefault();
    
    // Store scroll position
    var scrollTop = $(window).scrollTop();
    
    // Switch tab
    var tabId = $(this).data('tab');
    self.switchTab(tabId);
    
    // Restore scroll position
    $(window).scrollTop(scrollTop);
});
```


### 8. Admin Bar Position Stability

**Current Issue:** Admin bar shifts position during page refresh

**Location:** 
- `assets/js/mase-admin.js` - CSS generation for admin bar
- `includes/class-mase-css-generator.php` - Server-side admin bar CSS

**Root Cause Analysis:**
- CSS applied after page render causes layout shift
- Glassmorphism/floating effects alter positioning
- Z-index conflicts during page load

**Solution Design:**

**Critical CSS Inline Loading:**

```php
// In class-mase-admin.php - enqueue_admin_assets()
public function enqueue_admin_assets() {
    // Generate critical admin bar CSS inline to prevent FOUC
    $critical_css = $this->generate_critical_css();
    
    // Output critical CSS in <head> before other styles
    add_action( 'admin_head', function() use ( $critical_css ) {
        echo '<style id="mase-critical-css">' . $critical_css . '</style>';
    }, 1 ); // Priority 1 to load early
    
    // ... rest of asset enqueuing ...
}

private function generate_critical_css() {
    $settings = $this->settings->get_option();
    $css = '';
    
    // Admin bar positioning (critical for layout)
    $css .= '#wpadminbar {';
    $css .= '  position: fixed !important;';
    $css .= '  top: 0 !important;';
    $css .= '  left: 0 !important;';
    $css .= '  right: 0 !important;';
    $css .= '  z-index: 99999 !important;';
    $css .= '}';
    
    // Prevent layout shift
    $css .= 'html.wp-toolbar {';
    $css .= '  padding-top: 32px !important;';
    $css .= '}';
    
    return $css;
}
```

**Enhanced Admin Bar CSS Generation:**

```javascript
// In generateAdminBarCSS function
function generateAdminBarCSS(settings) {
    var css = '';
    
    // Base positioning (always applied)
    css += '#wpadminbar {';
    css += '  position: fixed !important;';
    css += '  top: 0 !important;';
    css += '  left: 0 !important;';
    css += '  right: 0 !important;';
    css += '  z-index: 99999 !important;';
    
    // Apply custom colors
    if (settings.admin_bar.bg_color) {
        css += '  background-color: ' + settings.admin_bar.bg_color + ' !important;';
    }
    
    // Apply height
    var height = settings.admin_bar.height || 32;
    css += '  height: ' + height + 'px !important;';
    css += '}';
    
    // Adjust body padding to match admin bar height
    css += 'html.wp-toolbar {';
    css += '  padding-top: ' + height + 'px !important;';
    css += '}';
    
    // Glassmorphism effect (if enabled)
    if (settings.visual_effects.admin_bar.glassmorphism) {
        var blur = settings.visual_effects.admin_bar.blur_intensity || 20;
        css += '#wpadminbar {';
        css += '  backdrop-filter: blur(' + blur + 'px) !important;';
        css += '  -webkit-backdrop-filter: blur(' + blur + 'px) !important;';
        css += '  background-color: rgba(35, 40, 45, 0.8) !important;';
        css += '}';
    }
    
    // Floating effect (if enabled)
    if (settings.visual_effects.admin_bar.floating) {
        var margin = settings.visual_effects.admin_bar.floating_margin || 8;
        var radius = settings.visual_effects.admin_bar.border_radius || 8;
        
        css += '#wpadminbar {';
        css += '  top: ' + margin + 'px !important;';
        css += '  left: ' + margin + 'px !important;';
        css += '  right: ' + margin + 'px !important;';
        css += '  width: calc(100% - ' + (margin * 2) + 'px) !important;';
        css += '  border-radius: ' + radius + 'px !important;';
        css += '}';
        
        // Adjust body padding for floating bar
        css += 'html.wp-toolbar {';
        css += '  padding-top: ' + (height + margin * 2) + 'px !important;';
        css += '}';
    }
    
    return css;
}
```

**Prevent Flash of Unstyled Content (FOUC):**

```css
/* Add to mase-admin.css */
/* Prevent admin bar flash during load */
#wpadminbar {
  opacity: 0;
  transition: opacity 0.1s ease;
}

#wpadminbar.mase-loaded {
  opacity: 1;
}
```

```javascript
// Mark admin bar as loaded after styles applied
$(window).on('load', function() {
    $('#wpadminbar').addClass('mase-loaded');
});
```


## Data Models

### Settings Schema

```javascript
{
  master: {
    enabled: boolean,
    dark_mode: boolean,
    live_preview: boolean,
    apply_to_login: boolean
  },
  admin_bar: {
    bg_color: string,      // hex color
    text_color: string,    // hex color
    hover_color: string,   // hex color
    height: number         // pixels
  },
  admin_menu: {
    bg_color: string,
    text_color: string,
    hover_bg_color: string,
    hover_text_color: string,
    width: number,
    height_mode: 'full' | 'content',
    item_padding: string,  // CSS padding value
    font_size: number,     // pixels
    line_height: number    // pixels
  },
  typography: {
    admin_bar: {
      font_size: number,
      font_weight: number,
      line_height: number,
      letter_spacing: number,
      text_transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    }
    // ... other areas
  },
  visual_effects: {
    admin_bar: {
      glassmorphism: boolean,
      blur_intensity: number,
      floating: boolean,
      floating_margin: number,
      border_radius: number,
      shadow: 'none' | 'flat' | 'raised' | 'floating'
    }
    // ... other areas
  }
}
```

## Error Handling

### AJAX Error Responses

```javascript
// Standard error response format
{
  success: false,
  data: {
    message: string,      // User-friendly error message
    code: string,         // Error code for debugging
    details: object       // Additional error details
  }
}
```

### Error Scenarios

1. **Network Failure** (status 0)
   - Message: "Network error. Please check your connection."
   - Action: Retry button, check network status

2. **Permission Denied** (status 403)
   - Message: "Permission denied. Please refresh and try again."
   - Action: Refresh page, check user capabilities

3. **Server Error** (status 500)
   - Message: "Server error. Please check error logs."
   - Action: Log to console, notify admin

4. **Validation Error** (status 400)
   - Message: Specific validation error from server
   - Action: Highlight invalid fields, show inline errors

## Testing Strategy

### Unit Tests

1. **Form Data Collection**
   - Test all input types collected correctly
   - Test nested object structure creation
   - Test empty/null value handling

2. **CSS Generation**
   - Test each CSS function returns valid CSS
   - Test specificity overrides work
   - Test dark mode variable substitution

3. **State Management**
   - Test dark mode sync between controls
   - Test live preview state updates
   - Test AJAX request locking

### Integration Tests

1. **Settings Save Flow**
   - Test complete save operation
   - Test error handling and recovery
   - Test success notification display

2. **Reset Functionality**
   - Test complete settings reset
   - Test style element removal
   - Test page reload after reset

3. **Dark Mode Toggle**
   - Test bidirectional synchronization
   - Test CSS variable updates
   - Test persistence across page loads

### Visual Regression Tests

1. **Slider Rendering**
   - Verify track visible
   - Verify thumb visible and draggable
   - Verify value display updates

2. **Admin Menu Height**
   - Verify "Fit to Content" mode works
   - Verify "Full Height" mode works
   - Verify smooth transition between modes

3. **Admin Bar Position**
   - Verify no layout shift on load
   - Verify floating effect positioning
   - Verify glassmorphism rendering

### Browser Compatibility Tests

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Test all fixes in each browser to ensure cross-browser compatibility.

## Performance Considerations

1. **CSS Injection**
   - Use single `<style>` element for all live preview CSS
   - Debounce live preview updates (300ms)
   - Minimize DOM queries with caching

2. **Event Handlers**
   - Use event delegation where possible
   - Debounce slider value updates
   - Throttle scroll event handlers

3. **AJAX Requests**
   - Implement request locking to prevent duplicates
   - Use proper loading states
   - Cache form data collection results

## Security Considerations

1. **Nonce Verification**
   - All AJAX requests must include valid nonce
   - Server must verify nonce before processing

2. **Input Sanitization**
   - Sanitize all user inputs on server side
   - Validate color values (hex format)
   - Validate numeric ranges

3. **Capability Checks**
   - Verify `manage_options` capability
   - Check user permissions before database operations

4. **XSS Prevention**
   - Escape all output in PHP templates
   - Use `esc_attr()`, `esc_html()`, `esc_url()`
   - Sanitize CSS values before injection
