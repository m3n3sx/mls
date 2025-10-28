# Design Document

## Overview

This design document outlines the complete enhancement of the Modern Admin Styler Enterprise (MASE) WordPress plugin. The system addresses critical architectural issues with settings persistence, implements missing features, and establishes a robust foundation for future development. The design follows WordPress coding standards, implements comprehensive security measures, and ensures maintainability through modular architecture.

### Design Goals

1. **Reliability**: Fix critical bugs in settings persistence and validation
2. **Completeness**: Implement all missing features (Content Tab, Universal Buttons, CSS generation)
3. **Performance**: Optimize live preview and CSS generation with caching
4. **Maintainability**: Establish clear separation of concerns and modular architecture
5. **Security**: Implement comprehensive input validation, sanitization, and CSRF protection
6. **User Experience**: Provide real-time feedback, live preview, and intuitive controls

### Key Design Decisions

**Decision 1: Selective Validation**
- **Rationale**: Current validation blocks saves when unrelated sections have issues
- **Solution**: Validate only sections present in submitted data
- **Impact**: Allows partial updates without full validation overhead

**Decision 2: Direct Settings Bypass for Palettes/Templates**
- **Rationale**: Palette/template application should not trigger full validation
- **Solution**: Use `update_option()` directly instead of `Settings::update_option()`
- **Impact**: Faster application, no validation conflicts

**Decision 3: Modular JavaScript Architecture**
- **Rationale**: Current monolithic structure makes maintenance difficult
- **Solution**: Separate concerns into modules (livePreview, paletteManager, etc.)
- **Impact**: Better testability, easier debugging, clearer code organization

**Decision 4: CSS Injection for Live Preview**
- **Rationale**: Page reload breaks user flow during configuration
- **Solution**: Inject `<style>` elements dynamically with unique IDs
- **Impact**: Instant visual feedback without page reload

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     WordPress Admin                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  MASE_Admin Class                            │
│  - Asset Enqueuing                                           │
│  - AJAX Handler Registration                                 │
│  - Settings Page Rendering                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        │              │               │              │
┌───────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐ ┌────▼─────┐
│   Settings   │ │   CSS    │ │    Cache    │ │  AJAX    │
│   Manager    │ │ Generator│ │   Manager   │ │ Handlers │
└──────────────┘ └──────────┘ └─────────────┘ └──────────┘
```

### Data Flow

**Settings Save Flow:**
```
User Form Submit → JavaScript Validation → AJAX Request → 
Nonce Verification → Capability Check → Settings Validation → 
Database Update → Cache Invalidation → Success Response → 
UI Update → Page Reload (optional)
```

**Live Preview Flow:**
```
Control Change → Event Handler → Collect Values → 
Generate CSS → Inject Style Element → Visual Update
```

**Palette Application Flow:**
```
Palette Selection → AJAX Request → Nonce Verification → 
Direct Database Update (bypass validation) → Cache Clear → 
Success Response → Page Reload
```


## Components and Interfaces

### PHP Components

#### 1. MASE_Settings Class

**Purpose**: Centralized settings management with validation and defaults

**Key Methods**:
- `get_option($key = null, $default = null)`: Retrieve settings with defaults
- `update_option($data)`: Validate and persist settings
- `validate($input)`: Selective validation of submitted sections
- `get_defaults()`: Return complete default settings structure
- `get_button_defaults()`: Return universal button defaults
- `get_background_defaults()`: Return background system defaults

**Validation Strategy**:
```php
public function validate($input) {
    $validated = array();
    $errors = array();
    
    // CRITICAL: Only validate sections present in input
    foreach ($input as $section_key => $section_data) {
        // Skip empty/unchanged sections
        if (!is_array($section_data) || empty($section_data)) {
            continue;
        }
        
        // Validate section
        $result = $this->validate_section($section_key, $section_data);
        
        if (is_wp_error($result)) {
            $errors = array_merge($errors, $result->get_error_data());
        } else {
            $validated[$section_key] = $result;
        }
    }
    
    if (!empty($errors)) {
        return new WP_Error('validation_failed', 'Validation failed', $errors);
    }
    
    return $validated;
}
```

**Section Validators**:
- `validate_admin_bar($data)`: Validate admin bar settings
- `validate_admin_menu($data)`: Validate admin menu settings
- `validate_custom_backgrounds($data)`: Validate background configurations
- `validate_universal_buttons($data)`: Validate button styling
- `validate_content($data)`: Validate content styling

#### 2. MASE_Admin Class

**Purpose**: Admin interface management and AJAX request handling

**Key Methods**:
- `add_admin_menu()`: Register settings page in WordPress admin
- `render_settings_page()`: Render main settings interface
- `enqueue_assets($hook)`: Conditionally load CSS/JS assets
- `inject_custom_css()`: Output generated CSS in admin head
- `handle_ajax_save_settings()`: Process settings save requests
- `ajax_apply_palette()`: Apply color palette
- `ajax_apply_template()`: Apply template
- `handle_ajax_upload_background_image()`: Process background uploads

**AJAX Handler Pattern**:
```php
public function handle_ajax_save_settings() {
    // 1. Verify nonce (CSRF protection)
    check_ajax_referer('mase_save_settings', 'nonce');
    
    // 2. Check user capability
    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => 'Unauthorized'), 403);
    }
    
    // 3. Parse and sanitize input
    $form_data = $_POST['form_data'] ?? '';
    $parsed_data = array();
    parse_str($form_data, $parsed_data);
    
    // 4. Process through settings manager
    $result = $this->settings->update_option($parsed_data);
    
    // 5. Return response
    if (is_wp_error($result)) {
        wp_send_json_error(array(
            'message' => $result->get_error_message(),
            'errors' => $result->get_error_data()
        ));
    } else {
        wp_send_json_success(array(
            'message' => 'Settings saved successfully'
        ));
    }
}
```

#### 3. MASE_CSS_Generator Class

**Purpose**: Generate CSS from settings data

**Key Methods**:
- `generateCSS($settings)`: Main CSS generation entry point
- `generateAdminBarCSS($settings)`: Generate admin bar styles
- `generateAdminMenuCSS($settings)`: Generate admin menu styles
- `generateUniversalButtonsCSS($settings)`: Generate button styles
- `generateContentCSS($settings)`: Generate content area styles
- `generateBackgroundCSS($settings)`: Generate background styles
- `generateButtonStateCSS($type, $state, $settings)`: Generate button state CSS
- `getButtonSelectors($type)`: Map button types to WordPress selectors
- `getButtonPseudoClass($state)`: Map states to CSS pseudo-classes

**CSS Generation Strategy**:
```php
public function generateUniversalButtonsCSS($settings) {
    $css = '';
    $button_settings = $settings['universal_buttons'] ?? array();
    
    foreach ($button_settings as $type => $type_settings) {
        foreach ($type_settings as $state => $state_settings) {
            $selectors = $this->getButtonSelectors($type);
            $pseudo_class = $this->getButtonPseudoClass($state);
            
            foreach ($selectors as $selector) {
                $full_selector = $selector . $pseudo_class;
                $css .= $full_selector . ' {';
                $css .= 'background-color: ' . $state_settings['bg_color'] . ' !important;';
                $css .= 'color: ' . $state_settings['text_color'] . ' !important;';
                $css .= 'border: ' . $state_settings['border_width'] . 'px solid ' . 
                        $state_settings['border_color'] . ' !important;';
                $css .= 'border-radius: ' . $state_settings['border_radius'] . 'px !important;';
                $css .= 'padding: ' . $state_settings['padding_vertical'] . 'px ' . 
                        $state_settings['padding_horizontal'] . 'px !important;';
                $css .= 'font-size: ' . $state_settings['font_size'] . 'px !important;';
                $css .= 'font-weight: ' . $state_settings['font_weight'] . ' !important;';
                $css .= '}';
            }
        }
    }
    
    return $css;
}
```

#### 4. MASE_CacheManager Class

**Purpose**: Performance optimization through caching

**Key Methods**:
- `get($key)`: Retrieve cached value
- `set($key, $value, $expiration)`: Store value in cache
- `delete($key)`: Remove cached value
- `flush()`: Clear all cached values

**Cache Strategy**:
- Cache generated CSS (key: `mase_generated_css`)
- Cache settings queries (key: `mase_settings`)
- Invalidate on settings update
- Use WordPress transients API


### JavaScript Components

#### 1. MASE Core Module

**Purpose**: Main initialization and coordination

**Structure**:
```javascript
var MASE = {
    config: {
        ajaxUrl: '',
        nonce: '',
        debounceDelay: 300,
        autoSaveDelay: 2000
    },
    
    state: {
        livePreviewEnabled: false,
        currentPalette: null,
        currentTemplate: null,
        isDirty: false,
        isSaving: false
    },
    
    init: function() {
        this.initColorPickers();
        this.initTabs();
        this.initFormHandlers();
        this.livePreview.init();
        this.paletteManager.init();
        this.templateManager.init();
        this.buttonManager.init();
        this.contentManager.init();
        this.backgroundManager.init();
    }
};
```

#### 2. Live Preview Module

**Purpose**: Real-time visual feedback for setting changes

**Key Methods**:
- `init()`: Initialize live preview system
- `enable()`: Enable live preview mode
- `disable()`: Disable live preview mode
- `bind()`: Attach event listeners to controls
- `unbind()`: Remove event listeners
- `updateCSS(id, css)`: Inject or update style element
- `updateHeightMode(mode)`: Update admin menu height
- `updateButtonPreview(type, state)`: Update button styling
- `updateContentPreview()`: Update content area styling
- `updateBackgroundPreview(area, settings)`: Update background styling

**Implementation Strategy**:
```javascript
livePreview: {
    init: function() {
        var self = MASE;
        
        // Bind toggle switch
        $('#mase-live-preview-toggle').on('change', function() {
            if ($(this).is(':checked')) {
                self.livePreview.enable();
            } else {
                self.livePreview.disable();
            }
        });
    },
    
    enable: function() {
        var self = MASE;
        self.state.livePreviewEnabled = true;
        this.bind();
        self.showNotice('info', 'Live preview enabled');
    },
    
    bind: function() {
        var self = MASE;
        
        // Height mode
        $(document).on('change', 'input[name="admin_menu[height_mode]"]', function() {
            self.livePreview.updateHeightMode($(this).val());
        });
        
        // Color pickers
        $(document).on('change', '.mase-color-picker', function() {
            self.livePreview.updateColors();
        });
        
        // Range sliders
        $(document).on('input', 'input[type="range"]', function() {
            self.livePreview.updateFromRange($(this));
        });
        
        // Button controls
        $(document).on('change input', '.mase-button-control', function() {
            var type = $(this).data('button-type');
            var state = $(this).data('button-state');
            self.livePreview.updateButtonPreview(type, state);
        });
    },
    
    updateCSS: function(id, css) {
        var styleId = 'mase-live-preview-' + id;
        var $existingStyle = $('#' + styleId);
        
        if ($existingStyle.length) {
            $existingStyle.html(css);
        } else {
            $('<style>')
                .attr('id', styleId)
                .html(css)
                .appendTo('head');
        }
    },
    
    updateHeightMode: function(mode) {
        var css = '';
        
        if (mode === 'content') {
            css = '#adminmenuwrap, #adminmenuback {' +
                  'height: auto !important;' +
                  'min-height: auto !important;' +
                  '}';
        } else {
            css = '#adminmenuwrap, #adminmenuback {' +
                  'height: 100vh !important;' +
                  'min-height: 100vh !important;' +
                  '}';
        }
        
        this.updateCSS('admin-menu-height', css);
    }
}
```

#### 3. Button Manager Module

**Purpose**: Universal button styling management

**Key Methods**:
- `init()`: Initialize button controls
- `initTypeSelector()`: Handle button type switching
- `initStateSelector()`: Handle button state switching
- `collectButtonProperties(type, state)`: Gather all button properties
- `generateButtonCSS(type, state, properties)`: Generate CSS for button
- `updatePreviewButton(type, state)`: Update preview button appearance
- `resetButtonType(type)`: Reset button type to defaults
- `resetAllButtons()`: Reset all buttons to defaults

**Button Type Mapping**:
```javascript
buttonSelectors: {
    'primary': ['.button-primary', '.wp-core-ui .button-primary'],
    'secondary': ['.button', '.button-secondary', '.wp-core-ui .button'],
    'danger': ['.button.delete', '.button-link-delete'],
    'success': ['.button.button-primary.button-hero'],
    'ghost': ['.button-link'],
    'tabs': ['.nav-tab', '.wp-filter .filter-links li a']
}
```

#### 4. Content Manager Module

**Purpose**: Content area styling management

**Key Methods**:
- `init()`: Initialize content controls
- `updateContentPreview()`: Generate and apply content CSS
- `collectContentSettings()`: Gather typography, colors, spacing values
- `generateContentCSS(settings)`: Generate CSS for content areas

**Content Selectors**:
```javascript
contentSelectors: {
    typography: '.wrap, .wrap p, .wrap div, .wrap td',
    links: '.wrap a',
    headings: '.wrap h1, .wrap h2, .wrap h3, .wrap h4, .wrap h5, .wrap h6',
    paragraphs: '.wrap p'
}
```

#### 5. Background Manager Module

**Purpose**: Advanced background system management

**Key Methods**:
- `init()`: Initialize background controls
- `handleImageUpload(area)`: Process background image upload
- `handleImageSelect(area)`: Handle media library selection
- `handleImageRemove(area)`: Remove background image
- `updateBackgroundPreview(area)`: Update background preview
- `buildGradientCSS(colors, type, angle)`: Generate gradient CSS
- `getBackgroundSelector(area)`: Map area to CSS selector

**Background Area Mapping**:
```javascript
backgroundSelectors: {
    'dashboard': '.wrap',
    'admin_menu': '#adminmenuwrap',
    'post_lists': '.wp-list-table',
    'post_editor': '#post-body',
    'widgets': '.widgets-holder-wrap',
    'login': 'body.login'
}
```

#### 6. Debug Logger Module

**Purpose**: Comprehensive debugging and error tracking

**Key Methods**:
- `log(message, data)`: Log informational message
- `error(message, error)`: Log error with stack trace
- `ajax(action, data, response)`: Log AJAX operation
- `settings(section, values)`: Log settings changes

**Implementation**:
```javascript
var MASE_DEBUG = {
    enabled: true,
    
    log: function(message, data) {
        if (!this.enabled) return;
        console.log('[MASE DEBUG] ' + message, data || '');
    },
    
    error: function(message, error) {
        if (!this.enabled) return;
        console.error('[MASE ERROR] ' + message, error || '');
        if (error && error.stack) {
            console.error('[MASE STACK]', error.stack);
        }
    },
    
    ajax: function(action, data, response) {
        if (!this.enabled) return;
        console.group('[MASE AJAX] ' + action);
        console.log('Request:', data);
        console.log('Response:', response);
        console.groupEnd();
    }
};
```


## Data Models

### Settings Data Structure

```php
array(
    'admin_bar' => array(
        'bg_color' => '#23282d',
        'text_color' => '#ffffff',
        'height' => 32
    ),
    
    'admin_menu' => array(
        'bg_color' => '#23282d',
        'text_color' => '#ffffff',
        'hover_bg_color' => '#191e23',
        'hover_text_color' => '#00b9eb',
        'width' => 160,
        'height_mode' => 'full', // 'full' | 'content'
        'padding_vertical' => 10,
        'padding_horizontal' => 15
    ),
    
    'universal_buttons' => array(
        'primary' => array(
            'normal' => array(
                'bg_type' => 'solid',
                'bg_color' => '#0073aa',
                'text_color' => '#ffffff',
                'border_width' => 1,
                'border_color' => '#0073aa',
                'border_radius' => 3,
                'padding_horizontal' => 12,
                'padding_vertical' => 6,
                'font_size' => 13,
                'font_weight' => 400
            ),
            'hover' => array(/* ... */),
            'active' => array(/* ... */),
            'focus' => array(/* ... */),
            'disabled' => array(/* ... */)
        ),
        'secondary' => array(/* ... */),
        'danger' => array(/* ... */),
        'success' => array(/* ... */),
        'ghost' => array(/* ... */),
        'tabs' => array(/* ... */)
    ),
    
    'content' => array(
        'typography' => array(
            'font_size' => 14,
            'font_family' => 'system',
            'line_height' => 1.6
        ),
        'colors' => array(
            'text' => '#333333',
            'link' => '#0073aa',
            'heading' => '#23282d'
        ),
        'spacing' => array(
            'paragraph_margin' => 16,
            'heading_margin' => 20
        )
    ),
    
    'custom_backgrounds' => array(
        'dashboard' => array(
            'enabled' => false,
            'type' => 'none', // 'none' | 'image' | 'gradient' | 'pattern'
            'image_url' => '',
            'image_id' => 0,
            'position' => 'center center',
            'size' => 'cover',
            'repeat' => 'no-repeat',
            'opacity' => 100,
            'gradient_type' => 'linear',
            'gradient_angle' => 90,
            'gradient_colors' => array(
                array('color' => '#667eea', 'position' => 0),
                array('color' => '#764ba2', 'position' => 100)
            )
        ),
        'admin_menu' => array(/* ... */),
        'post_lists' => array(/* ... */),
        'post_editor' => array(/* ... */),
        'widgets' => array(/* ... */),
        'login' => array(/* ... */)
    )
)
```

### AJAX Request/Response Formats

**Save Settings Request**:
```javascript
{
    action: 'mase_save_settings',
    nonce: 'abc123...',
    form_data: 'admin_bar[bg_color]=%2323282d&admin_bar[text_color]=%23ffffff...'
}
```

**Save Settings Response (Success)**:
```json
{
    "success": true,
    "data": {
        "message": "Settings saved successfully"
    }
}
```

**Save Settings Response (Error)**:
```json
{
    "success": false,
    "data": {
        "message": "Validation failed",
        "errors": {
            "admin_bar.height": "Height must be between 20 and 60",
            "admin_menu.width": "Width must be between 160 and 400"
        }
    }
}
```

**Apply Palette Request**:
```javascript
{
    action: 'mase_apply_palette',
    nonce: 'abc123...',
    palette_id: 'professional-blue'
}
```

**Upload Background Request**:
```javascript
{
    action: 'mase_upload_background_image',
    nonce: 'abc123...',
    area: 'dashboard',
    file: File // FormData
}
```

**Upload Background Response**:
```json
{
    "success": true,
    "data": {
        "message": "Background uploaded successfully",
        "image_url": "https://example.com/wp-content/uploads/2024/01/bg.jpg",
        "image_id": 123
    }
}
```

## Error Handling

### PHP Error Handling

**Validation Errors**:
```php
// Return WP_Error with detailed error data
return new WP_Error(
    'validation_failed',
    'Validation failed',
    array(
        'admin_bar.height' => 'Height must be between 20 and 60',
        'admin_menu.width' => 'Width must be between 160 and 400'
    )
);
```

**AJAX Error Responses**:
```php
// Unauthorized
wp_send_json_error(array('message' => 'Unauthorized'), 403);

// Validation failed
wp_send_json_error(array(
    'message' => 'Validation failed',
    'errors' => $validation_errors
), 400);

// Server error
wp_send_json_error(array('message' => 'Internal server error'), 500);
```

**Exception Handling**:
```php
try {
    // Process request
    $result = $this->process_data($data);
} catch (Exception $e) {
    error_log('MASE: Error in process_data: ' . $e->getMessage());
    wp_send_json_error(array('message' => 'Internal server error'), 500);
}
```

### JavaScript Error Handling

**AJAX Error Handler**:
```javascript
$.ajax({
    url: self.config.ajaxUrl,
    type: 'POST',
    data: requestData,
    success: function(response) {
        if (response.success) {
            self.showNotice('success', response.data.message);
        } else {
            self.showNotice('error', response.data.message);
            console.error('MASE: Server error:', response.data);
        }
    },
    error: function(xhr, status, error) {
        MASE_DEBUG.error('AJAX request failed', {
            status: xhr.status,
            statusText: xhr.statusText,
            error: error,
            responseText: xhr.responseText
        });
        
        var message = 'Network error. Please try again.';
        if (xhr.status === 403) {
            message = 'Permission denied';
        } else if (xhr.status === 500) {
            message = 'Server error. Please try again later.';
        }
        
        self.showNotice('error', message);
    }
});
```

**Global Error Handler**:
```javascript
window.addEventListener('error', function(event) {
    MASE_DEBUG.error('Global error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});
```


## Testing Strategy

### Unit Testing

**PHP Unit Tests** (using PHPUnit):

1. **Settings Validation Tests**
   - Test selective validation (only validates present sections)
   - Test validation error aggregation
   - Test default value merging
   - Test each section validator independently

2. **CSS Generation Tests**
   - Test button CSS generation for all types/states
   - Test content CSS generation
   - Test background CSS generation
   - Test gradient CSS syntax
   - Test selector mapping

3. **Cache Manager Tests**
   - Test cache set/get/delete operations
   - Test cache expiration
   - Test cache invalidation on settings update

**JavaScript Unit Tests** (using Jest):

1. **Live Preview Tests**
   - Test CSS injection/update
   - Test height mode CSS generation
   - Test button preview CSS generation
   - Test content preview CSS generation
   - Test background preview CSS generation

2. **Form Handling Tests**
   - Test form serialization
   - Test AJAX request formatting
   - Test response handling
   - Test error handling

3. **State Management Tests**
   - Test state initialization
   - Test state updates
   - Test dirty flag management
   - Test AJAX locking flags

### Integration Testing

**End-to-End Tests** (using Playwright):

1. **Settings Save Flow**
   - Navigate to settings page
   - Change multiple settings
   - Click save button
   - Verify success message
   - Reload page
   - Verify settings persisted

2. **Live Preview Flow**
   - Enable live preview toggle
   - Change height mode
   - Verify visual update without page reload
   - Change button color
   - Verify button preview updates
   - Disable live preview
   - Verify no further updates

3. **Palette Application Flow**
   - Navigate to palettes tab
   - Click apply on palette
   - Verify confirmation dialog
   - Confirm application
   - Verify success message
   - Verify page reload
   - Verify palette applied

4. **Background Upload Flow**
   - Navigate to backgrounds tab
   - Select dashboard area
   - Upload image file
   - Verify upload progress
   - Verify preview updates
   - Save settings
   - Verify background persisted

### Manual Testing Checklist

**Browser Compatibility**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Functionality Tests**:
- [ ] Settings save in each tab
- [ ] Live preview for all controls
- [ ] Height mode switching
- [ ] Color palette application
- [ ] Template application
- [ ] Button styling (all types/states)
- [ ] Content styling
- [ ] Background upload
- [ ] Gradient builder
- [ ] Pattern library

**Error Scenarios**:
- [ ] Invalid file upload
- [ ] Network error during save
- [ ] Validation error display
- [ ] Permission denied error
- [ ] Concurrent save attempts

**Performance Tests**:
- [ ] Page load time < 2s
- [ ] Live preview update < 100ms
- [ ] Settings save < 1s
- [ ] CSS generation < 500ms

## Security Considerations

### Input Validation

**Numeric Values**:
```php
// Validate range
if ($height < 20 || $height > 60) {
    return new WP_Error('invalid_height', 'Height must be between 20 and 60');
}

// Sanitize
$height = absint($height);
```

**Color Values**:
```php
// Sanitize hex color
$color = sanitize_hex_color($input_color);

// Validate format
if (!preg_match('/^#[a-f0-9]{6}$/i', $color)) {
    return new WP_Error('invalid_color', 'Invalid color format');
}
```

**Enum Values**:
```php
// Validate against allowed values
$allowed_modes = array('full', 'content');
if (!in_array($mode, $allowed_modes, true)) {
    return new WP_Error('invalid_mode', 'Invalid height mode');
}
```

**Text Values**:
```php
// Sanitize text
$name = sanitize_text_field($input_name);

// Validate length
if (strlen($name) > 100) {
    return new WP_Error('name_too_long', 'Name must be 100 characters or less');
}
```

### File Upload Security

**File Type Validation**:
```php
// Check file extension
$allowed_types = array('jpg', 'jpeg', 'png', 'svg', 'webp');
$file_ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

if (!in_array($file_ext, $allowed_types, true)) {
    return new WP_Error('invalid_type', 'Invalid file type');
}

// Verify MIME type
$file_type = wp_check_filetype($filename);
if (!$file_type['type']) {
    return new WP_Error('invalid_mime', 'Invalid MIME type');
}
```

**File Size Validation**:
```php
// Check file size (max 5MB)
$max_size = 5 * 1024 * 1024; // 5MB in bytes

if ($file_size > $max_size) {
    return new WP_Error('file_too_large', 'File size exceeds 5MB limit');
}
```

**SVG Sanitization**:
```php
// Sanitize SVG content to remove malicious code
if ($file_ext === 'svg') {
    $svg_content = file_get_contents($file_path);
    $svg_content = $this->sanitize_svg($svg_content);
    file_put_contents($file_path, $svg_content);
}
```

### CSRF Protection

**Nonce Generation**:
```php
// In MASE_Admin::enqueue_assets()
wp_localize_script('mase-admin', 'maseAdmin', array(
    'ajaxUrl' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('mase_save_settings')
));
```

**Nonce Verification**:
```php
// In every AJAX handler
public function handle_ajax_save_settings() {
    // Verify nonce
    check_ajax_referer('mase_save_settings', 'nonce');
    
    // Check capability
    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => 'Unauthorized'), 403);
    }
    
    // Process request...
}
```

### Output Escaping

**HTML Output**:
```php
// Escape text
echo esc_html($setting_value);

// Escape attributes
echo '<input value="' . esc_attr($setting_value) . '">';

// Escape URLs
echo '<a href="' . esc_url($link_url) . '">Link</a>';
```

**JavaScript Output**:
```php
// Escape for JavaScript
echo '<script>var value = "' . esc_js($setting_value) . '";</script>';
```

**CSS Output**:
```php
// Sanitize CSS
echo '<style>' . wp_strip_all_tags($css_content) . '</style>';
```

### SQL Injection Prevention

**Use WordPress Database API**:
```php
// CORRECT: Use $wpdb->prepare()
$results = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->options} WHERE option_name = %s",
        $option_name
    )
);

// WRONG: Direct SQL concatenation
$results = $wpdb->get_results(
    "SELECT * FROM {$wpdb->options} WHERE option_name = '$option_name'"
);
```

**Use WordPress Options API**:
```php
// Preferred: Use WordPress functions
$value = get_option('mase_settings');
update_option('mase_settings', $value);
```


## Performance Optimization

### CSS Generation Caching

**Strategy**: Cache generated CSS to avoid redundant processing

**Implementation**:
```php
public function inject_custom_css() {
    // Try to get cached CSS
    $cached_css = $this->cache->get('mase_generated_css');
    
    if ($cached_css !== false) {
        echo '<style id="mase-custom-css">' . $cached_css . '</style>';
        return;
    }
    
    // Generate CSS
    $settings = $this->settings->get_option();
    $css = $this->generator->generateCSS($settings);
    
    // Cache for 1 hour
    $this->cache->set('mase_generated_css', $css, 3600);
    
    // Output CSS
    echo '<style id="mase-custom-css">' . $css . '</style>';
}
```

**Cache Invalidation**:
```php
public function update_option($data) {
    // Validate and save
    $result = update_option(self::OPTION_NAME, $validated);
    
    // Invalidate CSS cache
    $this->cache->delete('mase_generated_css');
    
    return $result;
}
```

### Live Preview Debouncing

**Strategy**: Limit preview updates during rapid control changes

**Implementation**:
```javascript
livePreview: {
    debounceTimers: {},
    
    updateWithDebounce: function(key, callback, delay) {
        var self = this;
        
        // Clear existing timer
        if (this.debounceTimers[key]) {
            clearTimeout(this.debounceTimers[key]);
        }
        
        // Set new timer
        this.debounceTimers[key] = setTimeout(function() {
            callback.call(self);
            delete self.debounceTimers[key];
        }, delay || MASE.config.debounceDelay);
    },
    
    bind: function() {
        var self = MASE;
        
        // Debounce range slider updates
        $(document).on('input', 'input[type="range"]', function() {
            var $input = $(this);
            self.livePreview.updateWithDebounce('range-' + $input.attr('id'), function() {
                self.livePreview.updateFromRange($input);
            });
        });
    }
}
```

### Asset Loading Optimization

**Conditional Loading**:
```php
public function enqueue_assets($hook) {
    // Only load on settings page
    if ('toplevel_page_mase-settings' !== $hook) {
        return;
    }
    
    // Enqueue assets...
}
```

**Dependency Management**:
```php
// Ensure correct load order
wp_enqueue_script(
    'mase-admin',
    plugins_url('../assets/js/mase-admin.js', __FILE__),
    array('jquery', 'wp-color-picker'), // Dependencies
    MASE_VERSION,
    true // Load in footer
);
```

**Minification** (for production):
```php
$suffix = (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG) ? '' : '.min';

wp_enqueue_script(
    'mase-admin',
    plugins_url('../assets/js/mase-admin' . $suffix . '.js', __FILE__),
    array('jquery', 'wp-color-picker'),
    MASE_VERSION,
    true
);
```

### Database Query Optimization

**Batch Operations**:
```php
// GOOD: Single database operation
update_option('mase_settings', $all_settings);

// BAD: Multiple database operations
update_option('mase_admin_bar', $admin_bar_settings);
update_option('mase_admin_menu', $admin_menu_settings);
update_option('mase_buttons', $button_settings);
```

**Transient Caching**:
```php
// Cache expensive queries
$gradient_presets = get_transient('mase_gradient_presets');

if ($gradient_presets === false) {
    $gradient_presets = $this->generate_gradient_presets();
    set_transient('mase_gradient_presets', $gradient_presets, DAY_IN_SECONDS);
}
```

### Memory Management

**Unset Large Variables**:
```php
public function generateCSS($settings) {
    $css = '';
    
    // Generate CSS sections
    $css .= $this->generateAdminBarCSS($settings);
    $css .= $this->generateAdminMenuCSS($settings);
    $css .= $this->generateUniversalButtonsCSS($settings);
    
    // Unset settings to free memory
    unset($settings);
    
    return $css;
}
```

**Limit Array Sizes**:
```php
// Limit gradient color stops
if (count($gradient_colors) > 10) {
    $gradient_colors = array_slice($gradient_colors, 0, 10);
}
```

## Deployment Considerations

### Version Migration

**Migration System**:
```php
class MASE_Migration {
    public function migrate() {
        $current_version = get_option('mase_version', '0.0.0');
        
        if (version_compare($current_version, '1.2.0', '<')) {
            $this->migrate_to_1_2_0();
        }
        
        update_option('mase_version', MASE_VERSION);
    }
    
    private function migrate_to_1_2_0() {
        $settings = get_option('mase_settings', array());
        
        // Add new default sections
        if (!isset($settings['universal_buttons'])) {
            $settings['universal_buttons'] = $this->get_button_defaults();
        }
        
        if (!isset($settings['content'])) {
            $settings['content'] = $this->get_content_defaults();
        }
        
        update_option('mase_settings', $settings);
    }
}
```

### Backward Compatibility

**Graceful Degradation**:
```php
// Support old setting structure
$height_mode = $settings['admin_menu']['height_mode'] ?? 
               $settings['admin_menu']['height'] ?? 
               'full';
```

**Feature Detection**:
```javascript
// Check if feature exists before using
if (typeof MASE.livePreview !== 'undefined') {
    MASE.livePreview.init();
}
```

### Rollback Strategy

**Backup Before Update**:
```php
public function update_option($data) {
    // Create backup before update
    $current_settings = get_option(self::OPTION_NAME);
    update_option(self::OPTION_NAME . '_backup', $current_settings);
    
    // Perform update
    $result = update_option(self::OPTION_NAME, $validated);
    
    return $result;
}
```

**Restore from Backup**:
```php
public function restore_backup() {
    $backup = get_option(self::OPTION_NAME . '_backup');
    
    if ($backup) {
        update_option(self::OPTION_NAME, $backup);
        return true;
    }
    
    return false;
}
```

### Production Checklist

**Before Deployment**:
- [ ] Run all unit tests
- [ ] Run integration tests
- [ ] Test in all supported browsers
- [ ] Verify database migrations
- [ ] Check error logging
- [ ] Verify cache invalidation
- [ ] Test rollback procedure
- [ ] Review security measures
- [ ] Verify performance benchmarks
- [ ] Update documentation

**After Deployment**:
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify user feedback
- [ ] Monitor database queries
- [ ] Check cache hit rates
- [ ] Verify AJAX success rates

## Future Enhancements

### Planned Features

1. **Import/Export System**
   - Export settings as JSON
   - Import settings from file
   - Share configurations between sites

2. **Preset Library**
   - Curated design presets
   - Community-contributed presets
   - One-click preset application

3. **Advanced Typography**
   - Google Fonts integration
   - Custom font uploads
   - Font pairing suggestions

4. **Animation System**
   - Transition effects
   - Hover animations
   - Page load animations

5. **Responsive Design**
   - Mobile-specific settings
   - Tablet breakpoint controls
   - Device preview mode

### Technical Debt

1. **Code Refactoring**
   - Extract validation logic into separate classes
   - Implement repository pattern for settings
   - Create service layer for business logic

2. **Testing Coverage**
   - Increase unit test coverage to 80%
   - Add visual regression tests
   - Implement automated accessibility tests

3. **Documentation**
   - API documentation
   - Developer guide
   - User manual

4. **Performance**
   - Implement lazy loading for tabs
   - Add service worker for offline support
   - Optimize image uploads with compression

