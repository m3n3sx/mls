# Design Document: Advanced Background System

## Overview

The Advanced Background System extends MASE to provide comprehensive background customization for six WordPress admin areas. The system supports three background types (images, gradients, patterns) with advanced controls (opacity, blend modes, positioning, responsive variations) while maintaining performance through lazy loading and optimized delivery.

### Design Goals

1. **Seamless Integration**: Leverage existing MASE infrastructure (settings, CSS generation, validation, caching)
2. **Performance First**: Lazy loading, optimized images, efficient CSS generation (<100ms)
3. **User Experience**: Live preview, visual tools, intuitive interface
4. **Extensibility**: Modular architecture allowing future background types
5. **Security**: Comprehensive validation, sanitization, CSRF protection

### Key Features

- 6 independent admin areas with custom backgrounds
- 3 background types: images, gradients, patterns
- Advanced controls: opacity, blend modes, positioning, attachment
- Responsive variations for desktop/tablet/mobile
- 50+ SVG pattern library
- 20+ gradient presets
- WordPress Media Library integration
- Visual position picker and gradient builder
- Live preview with real-time updates

## Architecture

### System Components

```
Advanced Background System
├── Backend (PHP)
│   ├── Settings Management (MASE_Settings)
│   ├── CSS Generation (MASE_CSS_Generator)
│   ├── File Upload Handlers (MASE_Admin)
│   ├── Validation & Sanitization (MASE_Settings)
│   └── Cache Management (MASE_Cache)
└── Frontend (JavaScript)
    ├── Upload Interface (mase-backgrounds.js)
    ├── Live Preview (mase-admin.js)
    ├── Gradient Builder (mase-gradient-builder.js)
    ├── Pattern Browser (mase-pattern-library.js)
    └── Position Picker (mase-position-picker.js)
```


### Integration with Existing MASE Architecture

The system integrates with existing MASE components:

**MASE_Settings** (`includes/class-mase-settings.php`)
- Extends `get_defaults()` with `custom_backgrounds` section
- Adds `validate_background_settings()` method
- Stores settings in existing WordPress options table
- Uses existing `array_merge_recursive_distinct()` for defaults merging

**MASE_CSS_Generator** (`includes/class-mase-css-generator.php`)
- Adds `generate_background_styles()` method
- Integrates with existing `generate()` workflow
- Uses existing minification and caching
- Follows existing CSS generation patterns

**MASE_Admin** (`includes/class-mase-admin.php`)
- Adds AJAX handlers for background uploads
- Reuses existing nonce verification pattern
- Follows existing security model (check_ajax_referer + current_user_can)
- Integrates with existing asset enqueuing

**MASE_Cache** (`includes/class-mase-cache.php`)
- Uses existing cache invalidation on settings save
- Leverages existing mode-specific caching (light/dark)
- Follows existing cache warming strategy

## Data Models

### Background Configuration Structure

```php
'custom_backgrounds' => array(
    'dashboard' => array(
        'enabled' => true,
        'type' => 'image', // 'image' | 'gradient' | 'pattern' | 'none'
        
        // Image settings
        'image_url' => '',
        'image_id' => 0, // WordPress attachment ID
        'position' => 'center center',
        'size' => 'cover', // 'cover' | 'contain' | 'auto' | 'custom'
        'size_custom' => '', // e.g., '100% auto'
        'repeat' => 'no-repeat', // 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
        'attachment' => 'scroll', // 'scroll' | 'fixed'
        
        // Gradient settings
        'gradient_type' => 'linear', // 'linear' | 'radial'
        'gradient_angle' => 90, // 0-360 degrees
        'gradient_colors' => array(
            array('color' => '#667eea', 'position' => 0),
            array('color' => '#764ba2', 'position' => 100),
        ),
        'gradient_preset' => '', // preset ID or empty for custom
        
        // Pattern settings
        'pattern_id' => '', // pattern identifier
        'pattern_color' => '#000000',
        'pattern_opacity' => 100, // 0-100
        'pattern_scale' => 100, // 50-200
        
        // Advanced options
        'opacity' => 100, // 0-100
        'blend_mode' => 'normal', // CSS blend mode value
        
        // Responsive variations
        'responsive_enabled' => false,
        'responsive' => array(
            'desktop' => array(/* same structure as parent */),
            'tablet' => array(/* same structure as parent */),
            'mobile' => array(/* same structure as parent */),
        ),
    ),
    'admin_menu' => array(/* same structure */),
    'post_lists' => array(/* same structure */),
    'post_editor' => array(/* same structure */),
    'widgets' => array(/* same structure */),
    'login' => array(/* same structure */),
)
```


### Pattern Library Structure

```php
'pattern_library' => array(
    'dots' => array(
        'dot-grid' => array(
            'name' => 'Dot Grid',
            'svg' => '<svg>...</svg>',
            'category' => 'dots',
        ),
        'dot-pattern' => array(/* ... */),
        // 10+ dot patterns
    ),
    'lines' => array(
        'diagonal-lines' => array(/* ... */),
        'horizontal-stripes' => array(/* ... */),
        // 10+ line patterns
    ),
    'grids' => array(
        'square-grid' => array(/* ... */),
        'hex-grid' => array(/* ... */),
        // 10+ grid patterns
    ),
    'organic' => array(
        'waves' => array(/* ... */),
        'circles' => array(/* ... */),
        // 20+ organic patterns
    ),
)
```

### Gradient Presets Structure

```php
'gradient_presets' => array(
    'sunset' => array(
        'name' => 'Sunset',
        'type' => 'linear',
        'angle' => 135,
        'colors' => array(
            array('color' => '#ff6b6b', 'position' => 0),
            array('color' => '#feca57', 'position' => 100),
        ),
    ),
    'ocean' => array(
        'name' => 'Ocean',
        'type' => 'linear',
        'angle' => 180,
        'colors' => array(
            array('color' => '#667eea', 'position' => 0),
            array('color' => '#764ba2', 'position' => 100),
        ),
    ),
    // 20+ presets
)
```

## Components and Interfaces

### Backend Components

#### 1. Settings Extension (MASE_Settings)

**New Methods:**

```php
/**
 * Get background defaults for a specific area
 * @param string $area Area identifier
 * @return array Default background settings
 */
public function get_background_defaults( $area )

/**
 * Validate background settings
 * @param array $input Background settings to validate
 * @param string $area Area identifier
 * @return array|WP_Error Validated settings or error
 */
public function validate_background_settings( $input, $area )

/**
 * Get pattern library
 * @return array Pattern library data
 */
public function get_pattern_library()

/**
 * Get gradient presets
 * @return array Gradient presets data
 */
public function get_gradient_presets()
```

**Integration Points:**
- Extends `get_defaults()` to include `custom_backgrounds`
- Extends `validate()` to call `validate_background_settings()`
- Uses existing sanitization helpers


#### 2. CSS Generation (MASE_CSS_Generator)

**New Methods:**

```php
/**
 * Generate background styles for all areas
 * @param array $settings Full settings array
 * @return string Generated CSS
 */
private function generate_background_styles( $settings )

/**
 * Generate CSS for a specific background area
 * @param array $bg_config Background configuration
 * @param string $selector CSS selector for the area
 * @return string Generated CSS
 */
private function generate_area_background_css( $bg_config, $selector )

/**
 * Generate image background CSS
 * @param array $config Image configuration
 * @return string CSS properties
 */
private function generate_image_background( $config )

/**
 * Generate gradient background CSS
 * @param array $config Gradient configuration
 * @return string CSS properties
 */
private function generate_gradient_background_css( $config )

/**
 * Generate pattern background CSS
 * @param array $config Pattern configuration
 * @return string CSS properties
 */
private function generate_pattern_background( $config )

/**
 * Generate responsive background CSS
 * @param array $bg_config Background configuration with responsive settings
 * @param string $selector CSS selector
 * @return string Media query CSS
 */
private function generate_responsive_background_css( $bg_config, $selector )
```

**CSS Selector Mapping:**

```php
private $background_selectors = array(
    'dashboard' => '#wpbody-content',
    'admin_menu' => '#adminmenu',
    'post_lists' => '.wp-list-table',
    'post_editor' => '#post-body',
    'widgets' => '.postbox',
    'login' => 'body.login',
);
```

**Integration:**
- Called from existing `generate_css_internal()` method
- Uses existing `hex_to_rgb()` helper
- Follows existing CSS concatenation pattern
- Respects existing minification settings


#### 3. File Upload Handlers (MASE_Admin)

**New AJAX Handlers:**

```php
/**
 * Handle background image upload
 * Security: Nonce verification + capability check
 * Validation: File type, size, MIME type
 * Processing: Resize if needed, optimize
 */
public function handle_ajax_upload_background_image()

/**
 * Handle background image selection from media library
 * Security: Nonce verification + capability check
 * Validation: Attachment exists and is image
 */
public function handle_ajax_select_background_image()

/**
 * Handle background image removal
 * Security: Nonce verification + capability check
 * Note: Does not delete from media library
 */
public function handle_ajax_remove_background_image()
```

**Upload Security Pattern:**

```php
public function handle_ajax_upload_background_image() {
    // 1. CSRF Protection
    check_ajax_referer( 'mase_save_settings', 'nonce' );
    
    // 2. Capability Check
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( array( 'message' => 'Unauthorized' ), 403 );
    }
    
    // 3. File Validation
    $allowed_types = array( 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml' );
    $max_size = 5 * 1024 * 1024; // 5MB
    
    if ( empty( $_FILES['file'] ) ) {
        wp_send_json_error( array( 'message' => 'No file uploaded' ), 400 );
    }
    
    $file = $_FILES['file'];
    
    // Check file size
    if ( $file['size'] > $max_size ) {
        wp_send_json_error( array( 'message' => 'File too large' ), 400 );
    }
    
    // Verify MIME type
    $filetype = wp_check_filetype( $file['name'] );
    if ( ! in_array( $filetype['type'], $allowed_types, true ) ) {
        wp_send_json_error( array( 'message' => 'Invalid file type' ), 400 );
    }
    
    // 4. Handle Upload
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';
    
    $upload = wp_handle_upload( $file, array( 'test_form' => false ) );
    
    if ( isset( $upload['error'] ) ) {
        wp_send_json_error( array( 'message' => $upload['error'] ), 500 );
    }
    
    // 5. Create Attachment
    $attachment_id = wp_insert_attachment( array(
        'post_mime_type' => $upload['type'],
        'post_title' => sanitize_file_name( $file['name'] ),
        'post_content' => '',
        'post_status' => 'inherit',
    ), $upload['file'] );
    
    // 6. Generate Metadata
    $metadata = wp_generate_attachment_metadata( $attachment_id, $upload['file'] );
    wp_update_attachment_metadata( $attachment_id, $metadata );
    
    // 7. Optimize if Needed
    $this->optimize_background_image( $attachment_id );
    
    // 8. Return Success
    wp_send_json_success( array(
        'attachment_id' => $attachment_id,
        'url' => wp_get_attachment_url( $attachment_id ),
        'thumbnail' => wp_get_attachment_image_url( $attachment_id, 'thumbnail' ),
    ) );
}

/**
 * Optimize background image (resize if > 1920px width)
 */
private function optimize_background_image( $attachment_id ) {
    $file_path = get_attached_file( $attachment_id );
    $image_size = getimagesize( $file_path );
    
    if ( $image_size[0] > 1920 ) {
        $editor = wp_get_image_editor( $file_path );
        if ( ! is_wp_error( $editor ) ) {
            $editor->resize( 1920, null, false );
            $editor->save( $file_path );
            
            // Regenerate metadata
            $metadata = wp_generate_attachment_metadata( $attachment_id, $file_path );
            wp_update_attachment_metadata( $attachment_id, $metadata );
        }
    }
}
```


### Frontend Components

#### 1. Background Upload Interface (mase-backgrounds.js)

**Module Structure:**

```javascript
MASE.backgrounds = {
    /**
     * Initialize background upload interfaces
     */
    init: function() {
        this.initUploadZones();
        this.initMediaLibrary();
        this.initRemoveButtons();
    },
    
    /**
     * Initialize drag & drop upload zones
     */
    initUploadZones: function() {
        $('.mase-background-upload-zone').each(function() {
            const $zone = $(this);
            const area = $zone.data('area');
            
            // Drag & drop handlers
            $zone.on('dragover', function(e) {
                e.preventDefault();
                $zone.addClass('mase-drag-over');
            });
            
            $zone.on('dragleave', function() {
                $zone.removeClass('mase-drag-over');
            });
            
            $zone.on('drop', function(e) {
                e.preventDefault();
                $zone.removeClass('mase-drag-over');
                
                const files = e.originalEvent.dataTransfer.files;
                if (files.length > 0) {
                    MASE.backgrounds.uploadFile(files[0], area);
                }
            });
            
            // Click to upload
            $zone.on('click', function() {
                MASE.backgrounds.openMediaLibrary(area);
            });
        });
    },
    
    /**
     * Upload file via AJAX
     */
    uploadFile: function(file, area) {
        // Validate file
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(file.type)) {
            MASE.showNotice('Invalid file type', 'error');
            return;
        }
        
        if (file.size > maxSize) {
            MASE.showNotice('File too large (max 5MB)', 'error');
            return;
        }
        
        // Show progress
        const $zone = $('.mase-background-upload-zone[data-area="' + area + '"]');
        $zone.addClass('mase-uploading');
        
        // Prepare form data
        const formData = new FormData();
        formData.append('action', 'mase_upload_background_image');
        formData.append('nonce', maseAdmin.nonce);
        formData.append('area', area);
        formData.append('file', file);
        
        // Upload
        $.ajax({
            url: maseAdmin.ajaxUrl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    MASE.backgrounds.updatePreview(area, response.data);
                    MASE.showNotice('Image uploaded successfully', 'success');
                } else {
                    MASE.showNotice(response.data.message, 'error');
                }
            },
            error: function() {
                MASE.showNotice('Upload failed', 'error');
            },
            complete: function() {
                $zone.removeClass('mase-uploading');
            }
        });
    },
    
    /**
     * Open WordPress media library
     */
    openMediaLibrary: function(area) {
        if (this.mediaFrame) {
            this.mediaFrame.open();
            return;
        }
        
        this.mediaFrame = wp.media({
            title: 'Select Background Image',
            button: { text: 'Use Image' },
            multiple: false,
            library: { type: 'image' }
        });
        
        this.mediaFrame.on('select', function() {
            const attachment = this.mediaFrame.state().get('selection').first().toJSON();
            MASE.backgrounds.selectFromLibrary(area, attachment);
        }.bind(this));
        
        this.mediaFrame.open();
    },
    
    /**
     * Handle media library selection
     */
    selectFromLibrary: function(area, attachment) {
        $.ajax({
            url: maseAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'mase_select_background_image',
                nonce: maseAdmin.nonce,
                area: area,
                attachment_id: attachment.id
            },
            success: function(response) {
                if (response.success) {
                    MASE.backgrounds.updatePreview(area, response.data);
                    MASE.showNotice('Image selected successfully', 'success');
                }
            }
        });
    },
    
    /**
     * Update preview after upload/selection
     */
    updatePreview: function(area, data) {
        const $preview = $('.mase-background-preview[data-area="' + area + '"]');
        $preview.find('img').attr('src', data.thumbnail);
        $preview.find('.mase-background-url').val(data.url);
        $preview.find('.mase-background-id').val(data.attachment_id);
        $preview.show();
        
        // Trigger live preview update
        if (MASE.livePreview && MASE.livePreview.enabled) {
            MASE.livePreview.updateBackground(area);
        }
    }
};
```


#### 2. Gradient Builder (mase-gradient-builder.js)

**Module Structure:**

```javascript
MASE.gradientBuilder = {
    currentArea: null,
    
    init: function() {
        this.initTypeSelector();
        this.initAngleControl();
        this.initColorStops();
        this.initPresets();
    },
    
    /**
     * Initialize gradient type selector (linear/radial)
     */
    initTypeSelector: function() {
        $('.mase-gradient-type').on('change', function() {
            const type = $(this).val();
            const area = $(this).closest('.mase-background-config').data('area');
            MASE.gradientBuilder.updateGradientType(area, type);
        });
    },
    
    /**
     * Initialize angle control with visual dial
     */
    initAngleControl: function() {
        $('.mase-gradient-angle-dial').each(function() {
            const $dial = $(this);
            const $input = $dial.siblings('.mase-gradient-angle-input');
            
            // Draggable dial
            $dial.on('mousedown', function(e) {
                e.preventDefault();
                const startAngle = parseInt($input.val());
                const startY = e.pageY;
                
                $(document).on('mousemove.gradient-dial', function(e) {
                    const deltaY = startY - e.pageY;
                    let newAngle = startAngle + deltaY;
                    newAngle = ((newAngle % 360) + 360) % 360; // Normalize 0-360
                    
                    $input.val(newAngle).trigger('change');
                    $dial.css('transform', 'rotate(' + newAngle + 'deg)');
                });
                
                $(document).on('mouseup.gradient-dial', function() {
                    $(document).off('.gradient-dial');
                });
            });
        });
        
        // Input change handler
        $('.mase-gradient-angle-input').on('change', function() {
            const angle = parseInt($(this).val());
            const $dial = $(this).siblings('.mase-gradient-angle-dial');
            $dial.css('transform', 'rotate(' + angle + 'deg)');
            
            const area = $(this).closest('.mase-background-config').data('area');
            MASE.gradientBuilder.updatePreview(area);
        });
    },
    
    /**
     * Initialize color stops management
     */
    initColorStops: function() {
        // Add color stop
        $('.mase-add-color-stop').on('click', function() {
            const area = $(this).closest('.mase-background-config').data('area');
            MASE.gradientBuilder.addColorStop(area);
        });
        
        // Remove color stop
        $(document).on('click', '.mase-remove-color-stop', function() {
            const area = $(this).closest('.mase-background-config').data('area');
            $(this).closest('.mase-color-stop').remove();
            MASE.gradientBuilder.updatePreview(area);
        });
        
        // Color/position change
        $(document).on('change', '.mase-color-stop input', function() {
            const area = $(this).closest('.mase-background-config').data('area');
            MASE.gradientBuilder.updatePreview(area);
        });
    },
    
    /**
     * Add new color stop
     */
    addColorStop: function(area) {
        const $container = $('.mase-color-stops[data-area="' + area + '"]');
        const stopCount = $container.find('.mase-color-stop').length;
        
        if (stopCount >= 10) {
            MASE.showNotice('Maximum 10 color stops allowed', 'warning');
            return;
        }
        
        const position = stopCount > 0 ? 100 / (stopCount + 1) * stopCount : 50;
        
        const $stop = $('<div class="mase-color-stop">' +
            '<input type="text" class="mase-color-picker" value="#667eea">' +
            '<input type="number" class="mase-stop-position" value="' + position + '" min="0" max="100">' +
            '<button type="button" class="mase-remove-color-stop">×</button>' +
            '</div>');
        
        $container.append($stop);
        $stop.find('.mase-color-picker').wpColorPicker();
        
        this.updatePreview(area);
    },
    
    /**
     * Update gradient preview
     */
    updatePreview: function(area) {
        const config = this.getGradientConfig(area);
        const css = this.generateGradientCSS(config);
        
        $('.mase-gradient-preview[data-area="' + area + '"]').css('background', css);
        
        // Trigger live preview
        if (MASE.livePreview && MASE.livePreview.enabled) {
            MASE.livePreview.updateBackground(area);
        }
    },
    
    /**
     * Get current gradient configuration
     */
    getGradientConfig: function(area) {
        const $config = $('.mase-background-config[data-area="' + area + '"]');
        
        const type = $config.find('.mase-gradient-type').val();
        const angle = parseInt($config.find('.mase-gradient-angle-input').val());
        
        const colors = [];
        $config.find('.mase-color-stop').each(function() {
            colors.push({
                color: $(this).find('.mase-color-picker').val(),
                position: parseInt($(this).find('.mase-stop-position').val())
            });
        });
        
        return { type, angle, colors };
    },
    
    /**
     * Generate CSS gradient string
     */
    generateGradientCSS: function(config) {
        const colorStops = config.colors
            .map(stop => stop.color + ' ' + stop.position + '%')
            .join(', ');
        
        if (config.type === 'radial') {
            return 'radial-gradient(circle, ' + colorStops + ')';
        } else {
            return 'linear-gradient(' + config.angle + 'deg, ' + colorStops + ')';
        }
    },
    
    /**
     * Initialize gradient presets
     */
    initPresets: function() {
        $('.mase-gradient-preset').on('click', function() {
            const presetId = $(this).data('preset');
            const area = $(this).closest('.mase-background-config').data('area');
            MASE.gradientBuilder.applyPreset(area, presetId);
        });
    },
    
    /**
     * Apply gradient preset
     */
    applyPreset: function(area, presetId) {
        // Fetch preset data from localized script
        const preset = maseAdmin.gradientPresets[presetId];
        if (!preset) return;
        
        // Update UI
        const $config = $('.mase-background-config[data-area="' + area + '"]');
        $config.find('.mase-gradient-type').val(preset.type).trigger('change');
        $config.find('.mase-gradient-angle-input').val(preset.angle).trigger('change');
        
        // Clear existing color stops
        $config.find('.mase-color-stops').empty();
        
        // Add preset color stops
        preset.colors.forEach(stop => {
            this.addColorStopWithValues(area, stop.color, stop.position);
        });
        
        this.updatePreview(area);
    }
};
```


#### 3. Pattern Library Browser (mase-pattern-library.js)

**Module Structure:**

```javascript
MASE.patternLibrary = {
    init: function() {
        this.initPatternGrid();
        this.initPatternControls();
        this.initPatternSearch();
    },
    
    /**
     * Initialize pattern grid display
     */
    initPatternGrid: function() {
        $('.mase-pattern-item').on('click', function() {
            const patternId = $(this).data('pattern-id');
            const area = $(this).closest('.mase-background-config').data('area');
            
            // Update selection
            $(this).addClass('selected').siblings().removeClass('selected');
            
            // Apply pattern
            MASE.patternLibrary.applyPattern(area, patternId);
        });
    },
    
    /**
     * Initialize pattern controls (color, opacity, scale)
     */
    initPatternControls: function() {
        // Pattern color
        $('.mase-pattern-color').on('change', function() {
            const area = $(this).closest('.mase-background-config').data('area');
            MASE.patternLibrary.updatePattern(area);
        });
        
        // Pattern opacity
        $('.mase-pattern-opacity').on('input', function() {
            const value = $(this).val();
            $(this).siblings('.mase-pattern-opacity-value').text(value + '%');
            
            const area = $(this).closest('.mase-background-config').data('area');
            MASE.patternLibrary.updatePattern(area);
        });
        
        // Pattern scale
        $('.mase-pattern-scale').on('input', function() {
            const value = $(this).val();
            $(this).siblings('.mase-pattern-scale-value').text(value + '%');
            
            const area = $(this).closest('.mase-background-config').data('area');
            MASE.patternLibrary.updatePattern(area);
        });
    },
    
    /**
     * Apply selected pattern
     */
    applyPattern: function(area, patternId) {
        const $config = $('.mase-background-config[data-area="' + area + '"]');
        $config.find('.mase-pattern-id').val(patternId);
        
        this.updatePattern(area);
    },
    
    /**
     * Update pattern preview
     */
    updatePattern: function(area) {
        const config = this.getPatternConfig(area);
        const svg = this.generatePatternSVG(config);
        
        // Create data URI
        const dataUri = 'data:image/svg+xml;base64,' + btoa(svg);
        
        // Update preview
        $('.mase-pattern-preview[data-area="' + area + '"]').css({
            'background-image': 'url(' + dataUri + ')',
            'background-size': config.scale + '%',
            'opacity': config.opacity / 100
        });
        
        // Trigger live preview
        if (MASE.livePreview && MASE.livePreview.enabled) {
            MASE.livePreview.updateBackground(area);
        }
    },
    
    /**
     * Get current pattern configuration
     */
    getPatternConfig: function(area) {
        const $config = $('.mase-background-config[data-area="' + area + '"]');
        
        return {
            patternId: $config.find('.mase-pattern-id').val(),
            color: $config.find('.mase-pattern-color').val(),
            opacity: parseInt($config.find('.mase-pattern-opacity').val()),
            scale: parseInt($config.find('.mase-pattern-scale').val())
        };
    },
    
    /**
     * Generate pattern SVG with custom color
     */
    generatePatternSVG: function(config) {
        // Get base SVG from pattern library
        const pattern = maseAdmin.patternLibrary[config.patternId];
        if (!pattern) return '';
        
        // Replace color placeholder with custom color
        return pattern.svg.replace(/\{color\}/g, config.color);
    },
    
    /**
     * Initialize pattern search/filter
     */
    initPatternSearch: function() {
        $('.mase-pattern-search').on('input', function() {
            const query = $(this).val().toLowerCase();
            
            $('.mase-pattern-item').each(function() {
                const name = $(this).data('pattern-name').toLowerCase();
                const category = $(this).data('pattern-category').toLowerCase();
                
                if (name.includes(query) || category.includes(query)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
        
        // Category filter
        $('.mase-pattern-category-filter').on('change', function() {
            const category = $(this).val();
            
            if (category === 'all') {
                $('.mase-pattern-item').show();
            } else {
                $('.mase-pattern-item').each(function() {
                    if ($(this).data('pattern-category') === category) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }
        });
    }
};
```


#### 4. Position Picker (mase-position-picker.js)

**Module Structure:**

```javascript
MASE.positionPicker = {
    init: function() {
        this.initGridPicker();
        this.initCustomPosition();
    },
    
    /**
     * Initialize 3x3 grid position picker
     */
    initGridPicker: function() {
        $('.mase-position-grid-cell').on('click', function() {
            const position = $(this).data('position');
            const area = $(this).closest('.mase-background-config').data('area');
            
            // Update selection
            $(this).addClass('selected').siblings().removeClass('selected');
            
            // Update hidden input
            $('.mase-background-position[data-area="' + area + '"]').val(position);
            
            // Update preview
            MASE.positionPicker.updatePreview(area);
        });
    },
    
    /**
     * Initialize custom position inputs
     */
    initCustomPosition: function() {
        $('.mase-position-x, .mase-position-y').on('input', function() {
            const area = $(this).closest('.mase-background-config').data('area');
            const x = $('.mase-position-x[data-area="' + area + '"]').val();
            const y = $('.mase-position-y[data-area="' + area + '"]').val();
            
            // Update position value
            const position = x + '% ' + y + '%';
            $('.mase-background-position[data-area="' + area + '"]').val(position);
            
            // Clear grid selection
            $('.mase-position-grid-cell').removeClass('selected');
            
            // Update preview
            MASE.positionPicker.updatePreview(area);
        });
    },
    
    /**
     * Update background position preview
     */
    updatePreview: function(area) {
        const position = $('.mase-background-position[data-area="' + area + '"]').val();
        
        $('.mase-background-preview[data-area="' + area + '"]').css('background-position', position);
        
        // Trigger live preview
        if (MASE.livePreview && MASE.livePreview.enabled) {
            MASE.livePreview.updateBackground(area);
        }
    }
};
```

#### 5. Live Preview Integration (mase-admin.js extension)

**Extension to existing MASE.livePreview module:**

```javascript
MASE.livePreview.updateBackground = function(area) {
    if (!this.enabled) return;
    
    const config = this.getBackgroundConfig(area);
    const selector = this.getAreaSelector(area);
    
    // Generate CSS based on background type
    let css = '';
    
    switch (config.type) {
        case 'image':
            css = this.generateImageCSS(config);
            break;
        case 'gradient':
            css = MASE.gradientBuilder.generateGradientCSS(config);
            break;
        case 'pattern':
            css = this.generatePatternCSS(config);
            break;
        case 'none':
            css = 'none';
            break;
    }
    
    // Apply to preview iframe or current page
    if (this.$previewFrame) {
        this.$previewFrame.contents().find(selector).css({
            'background': css,
            'opacity': config.opacity / 100,
            'mix-blend-mode': config.blend_mode
        });
    } else {
        $(selector).css({
            'background': css,
            'opacity': config.opacity / 100,
            'mix-blend-mode': config.blend_mode
        });
    }
};

MASE.livePreview.getBackgroundConfig = function(area) {
    const $config = $('.mase-background-config[data-area="' + area + '"]');
    
    return {
        type: $config.find('.mase-background-type').val(),
        image_url: $config.find('.mase-background-url').val(),
        position: $config.find('.mase-background-position').val(),
        size: $config.find('.mase-background-size').val(),
        repeat: $config.find('.mase-background-repeat').val(),
        attachment: $config.find('.mase-background-attachment').val(),
        opacity: parseInt($config.find('.mase-background-opacity').val()),
        blend_mode: $config.find('.mase-background-blend-mode').val()
    };
};

MASE.livePreview.getAreaSelector = function(area) {
    const selectors = {
        'dashboard': '#wpbody-content',
        'admin_menu': '#adminmenu',
        'post_lists': '.wp-list-table',
        'post_editor': '#post-body',
        'widgets': '.postbox',
        'login': 'body.login'
    };
    
    return selectors[area] || '';
};
```


## Error Handling

### Backend Error Handling

**File Upload Errors:**
```php
// File size exceeded
if ( $file['size'] > $max_size ) {
    wp_send_json_error( array(
        'message' => sprintf( 
            __( 'File size exceeds maximum allowed size of %s', 'mase' ),
            size_format( $max_size )
        )
    ), 400 );
}

// Invalid file type
if ( ! in_array( $filetype['type'], $allowed_types, true ) ) {
    wp_send_json_error( array(
        'message' => __( 'Invalid file type. Allowed: JPG, PNG, WebP, SVG', 'mase' )
    ), 400 );
}

// Upload failed
if ( isset( $upload['error'] ) ) {
    wp_send_json_error( array(
        'message' => sprintf( __( 'Upload failed: %s', 'mase' ), $upload['error'] )
    ), 500 );
}
```

**Validation Errors:**
```php
// Invalid opacity value
if ( $opacity < 0 || $opacity > 100 ) {
    $errors['opacity'] = __( 'Opacity must be between 0 and 100', 'mase' );
}

// Invalid blend mode
$valid_blend_modes = array( 'normal', 'multiply', 'screen', 'overlay', /* ... */ );
if ( ! in_array( $blend_mode, $valid_blend_modes, true ) ) {
    $errors['blend_mode'] = __( 'Invalid blend mode', 'mase' );
}

// Invalid gradient angle
if ( $angle < 0 || $angle > 360 ) {
    $errors['gradient_angle'] = __( 'Gradient angle must be between 0 and 360', 'mase' );
}
```

### Frontend Error Handling

**Upload Errors:**
```javascript
// File validation
if (!allowedTypes.includes(file.type)) {
    MASE.showNotice('Invalid file type. Please upload JPG, PNG, WebP, or SVG.', 'error');
    return;
}

if (file.size > maxSize) {
    MASE.showNotice('File too large. Maximum size is 5MB.', 'error');
    return;
}

// AJAX error
$.ajax({
    // ...
    error: function(xhr, status, error) {
        let message = 'Upload failed. Please try again.';
        
        if (xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) {
            message = xhr.responseJSON.data.message;
        }
        
        MASE.showNotice(message, 'error');
    }
});
```

**Graceful Degradation:**
```javascript
// Browser compatibility check
if (!window.FileReader) {
    $('.mase-background-upload-zone').hide();
    $('.mase-background-fallback-message').show();
}

// localStorage availability
try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
} catch (e) {
    // Disable features requiring localStorage
    console.warn('localStorage not available, some features disabled');
}
```


## Testing Strategy

### Unit Tests

**Backend Tests (PHPUnit):**

```php
class MASE_Background_Settings_Test extends WP_UnitTestCase {
    
    public function test_validate_background_image_settings() {
        $settings = new MASE_Settings();
        
        $input = array(
            'type' => 'image',
            'image_url' => 'https://example.com/image.jpg',
            'position' => 'center center',
            'size' => 'cover',
            'repeat' => 'no-repeat',
            'opacity' => 80,
            'blend_mode' => 'overlay'
        );
        
        $result = $settings->validate_background_settings( $input, 'dashboard' );
        
        $this->assertNotWPError( $result );
        $this->assertEquals( 'image', $result['type'] );
        $this->assertEquals( 80, $result['opacity'] );
    }
    
    public function test_validate_gradient_settings() {
        $settings = new MASE_Settings();
        
        $input = array(
            'type' => 'gradient',
            'gradient_type' => 'linear',
            'gradient_angle' => 135,
            'gradient_colors' => array(
                array( 'color' => '#667eea', 'position' => 0 ),
                array( 'color' => '#764ba2', 'position' => 100 )
            )
        );
        
        $result = $settings->validate_background_settings( $input, 'dashboard' );
        
        $this->assertNotWPError( $result );
        $this->assertEquals( 'gradient', $result['type'] );
        $this->assertCount( 2, $result['gradient_colors'] );
    }
    
    public function test_reject_invalid_opacity() {
        $settings = new MASE_Settings();
        
        $input = array(
            'type' => 'image',
            'opacity' => 150 // Invalid
        );
        
        $result = $settings->validate_background_settings( $input, 'dashboard' );
        
        $this->assertWPError( $result );
    }
}

class MASE_Background_CSS_Test extends WP_UnitTestCase {
    
    public function test_generate_image_background_css() {
        $generator = new MASE_CSS_Generator();
        
        $settings = array(
            'custom_backgrounds' => array(
                'dashboard' => array(
                    'enabled' => true,
                    'type' => 'image',
                    'image_url' => 'https://example.com/bg.jpg',
                    'position' => 'center center',
                    'size' => 'cover',
                    'repeat' => 'no-repeat',
                    'opacity' => 100,
                    'blend_mode' => 'normal'
                )
            )
        );
        
        $css = $generator->generate( $settings );
        
        $this->assertStringContainsString( '#wpbody-content', $css );
        $this->assertStringContainsString( 'background-image', $css );
        $this->assertStringContainsString( 'https://example.com/bg.jpg', $css );
    }
    
    public function test_generate_gradient_background_css() {
        $generator = new MASE_CSS_Generator();
        
        $settings = array(
            'custom_backgrounds' => array(
                'admin_menu' => array(
                    'enabled' => true,
                    'type' => 'gradient',
                    'gradient_type' => 'linear',
                    'gradient_angle' => 90,
                    'gradient_colors' => array(
                        array( 'color' => '#667eea', 'position' => 0 ),
                        array( 'color' => '#764ba2', 'position' => 100 )
                    )
                )
            )
        );
        
        $css = $generator->generate( $settings );
        
        $this->assertStringContainsString( '#adminmenu', $css );
        $this->assertStringContainsString( 'linear-gradient', $css );
        $this->assertStringContainsString( '90deg', $css );
    }
}
```

**Frontend Tests (Jest):**

```javascript
describe('MASE.backgrounds', () => {
    test('validates file type correctly', () => {
        const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
        
        expect(MASE.backgrounds.validateFile(validFile)).toBe(true);
        expect(MASE.backgrounds.validateFile(invalidFile)).toBe(false);
    });
    
    test('validates file size correctly', () => {
        const smallFile = new File(['x'.repeat(1024)], 'small.jpg', { type: 'image/jpeg' });
        const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
        
        expect(MASE.backgrounds.validateFile(smallFile)).toBe(true);
        expect(MASE.backgrounds.validateFile(largeFile)).toBe(false);
    });
});

describe('MASE.gradientBuilder', () => {
    test('generates correct linear gradient CSS', () => {
        const config = {
            type: 'linear',
            angle: 135,
            colors: [
                { color: '#667eea', position: 0 },
                { color: '#764ba2', position: 100 }
            ]
        };
        
        const css = MASE.gradientBuilder.generateGradientCSS(config);
        
        expect(css).toContain('linear-gradient');
        expect(css).toContain('135deg');
        expect(css).toContain('#667eea 0%');
        expect(css).toContain('#764ba2 100%');
    });
    
    test('generates correct radial gradient CSS', () => {
        const config = {
            type: 'radial',
            colors: [
                { color: '#ff6b6b', position: 0 },
                { color: '#feca57', position: 100 }
            ]
        };
        
        const css = MASE.gradientBuilder.generateGradientCSS(config);
        
        expect(css).toContain('radial-gradient');
        expect(css).toContain('circle');
    });
});
```


### Integration Tests

**File Upload Flow:**
```php
class MASE_Background_Upload_Test extends WP_Ajax_UnitTestCase {
    
    public function test_upload_background_image() {
        // Setup
        $this->_setRole( 'administrator' );
        
        // Create test image
        $file = array(
            'name' => 'test-bg.jpg',
            'type' => 'image/jpeg',
            'tmp_name' => '/tmp/test-bg.jpg',
            'size' => 1024 * 500, // 500KB
            'error' => 0
        );
        
        $_FILES['file'] = $file;
        $_POST['nonce'] = wp_create_nonce( 'mase_save_settings' );
        $_POST['area'] = 'dashboard';
        
        // Execute
        try {
            $this->_handleAjax( 'mase_upload_background_image' );
        } catch ( WPAjaxDieContinueException $e ) {
            // Expected
        }
        
        // Assert
        $response = json_decode( $this->_last_response, true );
        $this->assertTrue( $response['success'] );
        $this->assertArrayHasKey( 'attachment_id', $response['data'] );
        $this->assertArrayHasKey( 'url', $response['data'] );
    }
    
    public function test_reject_oversized_file() {
        $this->_setRole( 'administrator' );
        
        $file = array(
            'name' => 'large.jpg',
            'type' => 'image/jpeg',
            'size' => 6 * 1024 * 1024, // 6MB - exceeds limit
            'error' => 0
        );
        
        $_FILES['file'] = $file;
        $_POST['nonce'] = wp_create_nonce( 'mase_save_settings' );
        
        try {
            $this->_handleAjax( 'mase_upload_background_image' );
        } catch ( WPAjaxDieStopException $e ) {
            // Expected
        }
        
        $response = json_decode( $this->_last_response, true );
        $this->assertFalse( $response['success'] );
        $this->assertStringContainsString( 'too large', $response['data']['message'] );
    }
}
```

**End-to-End Tests (Playwright):**

```javascript
test('upload and apply background image', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    
    // Navigate to backgrounds tab
    await page.click('text=Backgrounds');
    
    // Select dashboard area
    await page.click('[data-area="dashboard"]');
    
    // Upload image
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-assets/background.jpg');
    
    // Wait for upload
    await page.waitForSelector('.mase-background-preview img');
    
    // Verify preview
    const previewSrc = await page.getAttribute('.mase-background-preview img', 'src');
    expect(previewSrc).toContain('background.jpg');
    
    // Save settings
    await page.click('button:has-text("Save Settings")');
    await page.waitForSelector('.mase-notice-success');
    
    // Verify applied
    await page.goto('/wp-admin/');
    const bgImage = await page.evaluate(() => {
        return window.getComputedStyle(document.querySelector('#wpbody-content')).backgroundImage;
    });
    expect(bgImage).toContain('background.jpg');
});

test('create and apply gradient', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=mase-settings');
    await page.click('text=Backgrounds');
    
    // Select gradient type
    await page.selectOption('[data-area="admin_menu"] .mase-background-type', 'gradient');
    
    // Set gradient angle
    await page.fill('.mase-gradient-angle-input', '135');
    
    // Add color stops
    await page.click('.mase-add-color-stop');
    await page.fill('.mase-color-stop:nth-child(1) .mase-color-picker', '#667eea');
    await page.fill('.mase-color-stop:nth-child(2) .mase-color-picker', '#764ba2');
    
    // Verify live preview
    const previewBg = await page.evaluate(() => {
        return window.getComputedStyle(document.querySelector('.mase-gradient-preview')).background;
    });
    expect(previewBg).toContain('linear-gradient');
    expect(previewBg).toContain('135deg');
    
    // Save and verify
    await page.click('button:has-text("Save Settings")');
    await page.waitForSelector('.mase-notice-success');
});
```


## Performance Considerations

### Image Optimization

**Automatic Resizing:**
```php
private function optimize_background_image( $attachment_id ) {
    $file_path = get_attached_file( $attachment_id );
    $image_size = getimagesize( $file_path );
    
    // Resize if width > 1920px
    if ( $image_size[0] > 1920 ) {
        $editor = wp_get_image_editor( $file_path );
        
        if ( ! is_wp_error( $editor ) ) {
            $editor->resize( 1920, null, false );
            $editor->save( $file_path );
            
            // Regenerate metadata
            $metadata = wp_generate_attachment_metadata( $attachment_id, $file_path );
            wp_update_attachment_metadata( $attachment_id, $metadata );
        }
    }
}
```

**Lazy Loading:**
```javascript
// Lazy load background images not in viewport
MASE.backgrounds.lazyLoad = function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const $element = $(entry.target);
                const bgUrl = $element.data('bg-url');
                
                if (bgUrl) {
                    $element.css('background-image', 'url(' + bgUrl + ')');
                    observer.unobserve(entry.target);
                }
            }
        });
    });
    
    $('.mase-lazy-bg').each(function() {
        observer.observe(this);
    });
};
```

**WebP Support:**
```php
private function get_optimized_image_url( $attachment_id ) {
    // Check if browser supports WebP
    $supports_webp = isset( $_SERVER['HTTP_ACCEPT'] ) && 
                     strpos( $_SERVER['HTTP_ACCEPT'], 'image/webp' ) !== false;
    
    if ( $supports_webp ) {
        // Try to get WebP version
        $webp_url = $this->get_webp_version( $attachment_id );
        if ( $webp_url ) {
            return $webp_url;
        }
    }
    
    // Fallback to original
    return wp_get_attachment_url( $attachment_id );
}
```

### CSS Generation Performance

**Target: <100ms generation time**

**Optimization Strategies:**

1. **String Concatenation** (faster than array joins in PHP)
```php
$css = '';
$css .= 'selector { property: value; }';
// vs
$css_array[] = 'selector { property: value; }';
$css = implode( '', $css_array );
```

2. **Conditional Generation** (skip empty/disabled backgrounds)
```php
foreach ( $areas as $area => $config ) {
    if ( ! $config['enabled'] || $config['type'] === 'none' ) {
        continue; // Skip
    }
    
    $css .= $this->generate_area_background_css( $config, $selectors[$area] );
}
```

3. **Cache Warming** (pre-generate on save)
```php
// After settings save
$cache->warm_mode_caches( $generator, $settings );
```

4. **Minification** (reduce CSS size)
```php
if ( $settings['performance']['enable_minification'] ) {
    $css = $this->minify( $css );
}
```

### Caching Strategy

**Multi-Level Caching:**

1. **Mode-Specific Cache** (light/dark)
```php
$cache_key = 'mase_css_' . $current_mode;
$cached = get_transient( $cache_key );
```

2. **Area-Specific Cache** (optional for large sites)
```php
$cache_key = 'mase_bg_' . $area . '_' . $current_mode;
```

3. **Cache Invalidation**
```php
// On settings save
$cache->invalidate_both_mode_caches();

// On background change
$cache->invalidate_background_cache( $area );
```

### Frontend Performance

**Debounced Live Preview:**
```javascript
MASE.livePreview.updateBackground = _.debounce(function(area) {
    // Update logic
}, 300); // Wait 300ms after last change
```

**Throttled Scroll Events:**
```javascript
$(window).on('scroll', _.throttle(function() {
    MASE.backgrounds.lazyLoad();
}, 200)); // Max once per 200ms
```

**Asset Loading:**
```javascript
// Load pattern library on demand
MASE.patternLibrary.loadLibrary = function() {
    if (this.loaded) return;
    
    $.getJSON(maseAdmin.patternLibraryUrl, function(data) {
        MASE.patternLibrary.patterns = data;
        MASE.patternLibrary.loaded = true;
        MASE.patternLibrary.render();
    });
};
```


## Security Considerations

### Input Validation

**File Upload Security:**
```php
// 1. Verify file type by MIME and extension
$filetype = wp_check_filetype( $file['name'] );
$allowed_types = array( 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml' );

if ( ! in_array( $filetype['type'], $allowed_types, true ) ) {
    wp_send_json_error( array( 'message' => 'Invalid file type' ), 400 );
}

// 2. Verify extension matches MIME type (prevent spoofing)
$extension = pathinfo( $file['name'], PATHINFO_EXTENSION );
$mime_to_ext = array(
    'image/jpeg' => array( 'jpg', 'jpeg' ),
    'image/png' => array( 'png' ),
    'image/webp' => array( 'webp' ),
    'image/svg+xml' => array( 'svg' ),
);

if ( ! in_array( strtolower( $extension ), $mime_to_ext[ $filetype['type'] ], true ) ) {
    wp_send_json_error( array( 'message' => 'File extension does not match type' ), 400 );
}

// 3. Sanitize SVG content (remove scripts, event handlers)
if ( $filetype['type'] === 'image/svg+xml' ) {
    $svg_content = file_get_contents( $file['tmp_name'] );
    $sanitized = $this->sanitize_svg( $svg_content );
    file_put_contents( $file['tmp_name'], $sanitized );
}
```

**SVG Sanitization:**
```php
private function sanitize_svg( $svg_content ) {
    // Remove script tags
    $svg_content = preg_replace( '/<script\b[^>]*>(.*?)<\/script>/is', '', $svg_content );
    
    // Remove event handlers
    $svg_content = preg_replace( '/\s*on\w+\s*=\s*["\'][^"\']*["\']/i', '', $svg_content );
    
    // Remove javascript: URLs
    $svg_content = preg_replace( '/javascript:/i', '', $svg_content );
    
    // Remove data: URLs (except for images)
    $svg_content = preg_replace( '/data:(?!image\/)/i', '', $svg_content );
    
    return $svg_content;
}
```

**Settings Validation:**
```php
public function validate_background_settings( $input, $area ) {
    $validated = array();
    $errors = array();
    
    // Validate type
    $valid_types = array( 'none', 'image', 'gradient', 'pattern' );
    if ( isset( $input['type'] ) && in_array( $input['type'], $valid_types, true ) ) {
        $validated['type'] = $input['type'];
    } else {
        $errors['type'] = 'Invalid background type';
    }
    
    // Validate opacity (0-100)
    if ( isset( $input['opacity'] ) ) {
        $opacity = absint( $input['opacity'] );
        if ( $opacity >= 0 && $opacity <= 100 ) {
            $validated['opacity'] = $opacity;
        } else {
            $errors['opacity'] = 'Opacity must be between 0 and 100';
        }
    }
    
    // Validate blend mode
    $valid_blend_modes = array(
        'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
        'color-dodge', 'color-burn', 'hard-light', 'soft-light',
        'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'
    );
    if ( isset( $input['blend_mode'] ) && in_array( $input['blend_mode'], $valid_blend_modes, true ) ) {
        $validated['blend_mode'] = $input['blend_mode'];
    }
    
    // Validate image URL (if type is image)
    if ( $validated['type'] === 'image' && isset( $input['image_url'] ) ) {
        $url = esc_url_raw( $input['image_url'] );
        if ( filter_var( $url, FILTER_VALIDATE_URL ) ) {
            $validated['image_url'] = $url;
        } else {
            $errors['image_url'] = 'Invalid image URL';
        }
    }
    
    // Validate gradient colors
    if ( $validated['type'] === 'gradient' && isset( $input['gradient_colors'] ) ) {
        $colors = array();
        foreach ( $input['gradient_colors'] as $stop ) {
            if ( isset( $stop['color'] ) && isset( $stop['position'] ) ) {
                $color = sanitize_hex_color( $stop['color'] );
                $position = absint( $stop['position'] );
                
                if ( $color && $position >= 0 && $position <= 100 ) {
                    $colors[] = array(
                        'color' => $color,
                        'position' => $position
                    );
                }
            }
        }
        
        if ( count( $colors ) >= 2 ) {
            $validated['gradient_colors'] = $colors;
        } else {
            $errors['gradient_colors'] = 'At least 2 color stops required';
        }
    }
    
    if ( ! empty( $errors ) ) {
        return new WP_Error( 'validation_failed', 'Validation failed', $errors );
    }
    
    return $validated;
}
```

### CSRF Protection

**All AJAX handlers follow this pattern:**
```php
public function handle_ajax_upload_background_image() {
    // 1. Verify nonce
    check_ajax_referer( 'mase_save_settings', 'nonce' );
    
    // 2. Check capability
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( array( 'message' => 'Unauthorized' ), 403 );
    }
    
    // 3. Process request
    // ...
}
```

### XSS Prevention

**Output Escaping:**
```php
// In admin template
<input 
    type="text" 
    value="<?php echo esc_attr( $settings['custom_backgrounds']['dashboard']['image_url'] ); ?>"
>

<div style="background-image: url(<?php echo esc_url( $bg_url ); ?>)"></div>
```

**JavaScript Escaping:**
```javascript
// Use jQuery text() instead of html() for user input
$('.mase-pattern-name').text(patternName); // Safe

// Sanitize before inserting HTML
const sanitized = $('<div>').text(userInput).html();
```

### SQL Injection Prevention

**Use WordPress APIs:**
```php
// GOOD: Using WordPress options API
update_option( 'mase_settings', $validated_settings );

// GOOD: Using prepared statements (if custom queries needed)
$wpdb->prepare( 
    "SELECT * FROM {$wpdb->prefix}mase_backgrounds WHERE area = %s",
    $area 
);

// BAD: Direct SQL (never do this)
// $wpdb->query( "SELECT * FROM table WHERE area = '$area'" );
```


## Migration and Compatibility

### Backward Compatibility

**Settings Migration:**
```php
class MASE_Background_Migration {
    
    /**
     * Migrate from old background settings (if any exist)
     */
    public function migrate_legacy_backgrounds() {
        $settings = get_option( 'mase_settings', array() );
        
        // Check if already migrated
        if ( isset( $settings['custom_backgrounds'] ) ) {
            return;
        }
        
        // Initialize new structure
        $settings['custom_backgrounds'] = $this->get_default_backgrounds();
        
        // Migrate any existing background settings
        // (e.g., from login customization)
        if ( isset( $settings['login_customization']['background_image'] ) ) {
            $settings['custom_backgrounds']['login']['type'] = 'image';
            $settings['custom_backgrounds']['login']['image_url'] = 
                $settings['login_customization']['background_image'];
        }
        
        update_option( 'mase_settings', $settings );
    }
    
    private function get_default_backgrounds() {
        $default = array(
            'enabled' => false,
            'type' => 'none',
            'opacity' => 100,
            'blend_mode' => 'normal'
        );
        
        return array(
            'dashboard' => $default,
            'admin_menu' => $default,
            'post_lists' => $default,
            'post_editor' => $default,
            'widgets' => $default,
            'login' => $default,
        );
    }
}
```

### Browser Compatibility

**Feature Detection:**
```javascript
MASE.backgrounds.checkCompatibility = function() {
    const features = {
        fileReader: typeof FileReader !== 'undefined',
        dragDrop: 'draggable' in document.createElement('div'),
        blendModes: CSS.supports('mix-blend-mode', 'overlay'),
        gradients: CSS.supports('background', 'linear-gradient(#fff, #000)'),
        webp: false // Detected async
    };
    
    // Detect WebP support
    const webp = new Image();
    webp.onload = webp.onerror = function() {
        features.webp = (webp.height === 2);
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    
    return features;
};

// Graceful degradation
if (!MASE.backgrounds.checkCompatibility().blendModes) {
    $('.mase-blend-mode-control').hide();
    $('.mase-blend-mode-notice').show();
}
```

**CSS Fallbacks:**
```css
/* Gradient fallback for older browsers */
.mase-background-gradient {
    background-color: #667eea; /* Fallback solid color */
    background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Blend mode fallback */
.mase-background-overlay {
    mix-blend-mode: overlay;
    /* Fallback: reduce opacity instead */
    opacity: 0.8;
}

/* WebP with fallback */
.mase-background-image {
    background-image: url('background.jpg');
    background-image: image-set(
        url('background.webp') type('image/webp'),
        url('background.jpg') type('image/jpeg')
    );
}
```

### Plugin Conflicts

**Namespace Isolation:**
```javascript
// Wrap in IIFE to avoid global pollution
(function($) {
    'use strict';
    
    // All code in MASE namespace
    window.MASE = window.MASE || {};
    MASE.backgrounds = {
        // ...
    };
    
})(jQuery);
```

**CSS Specificity:**
```css
/* High specificity to override theme styles */
body.wp-admin #wpbody-content.mase-custom-background {
    background-image: var(--mase-bg-image) !important;
}

/* Use custom properties for easy override */
:root {
    --mase-bg-image: url('...');
    --mase-bg-opacity: 1;
}
```

**Hook Priority:**
```php
// Enqueue assets late to ensure dependencies loaded
add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ), 20 );

// Inject CSS very late to override other plugins
add_action( 'admin_head', array( $this, 'inject_custom_css' ), 999 );
```


## Implementation Phases

### Phase 1: Core Infrastructure (Week 1)

**Backend:**
- Extend `MASE_Settings::get_defaults()` with `custom_backgrounds` structure
- Implement `validate_background_settings()` method
- Add basic CSS generation for image backgrounds
- Create upload AJAX handler

**Frontend:**
- Create basic admin UI structure
- Implement file upload interface
- Add basic live preview

**Deliverables:**
- Image backgrounds working for all 6 areas
- Basic validation and security
- Simple upload interface

### Phase 2: Gradient System (Week 2)

**Backend:**
- Implement gradient CSS generation
- Add gradient validation
- Create gradient presets data structure

**Frontend:**
- Build gradient builder UI
- Implement angle control with visual dial
- Add color stop management
- Create preset selector

**Deliverables:**
- Full gradient support (linear/radial)
- 20+ gradient presets
- Visual gradient builder

### Phase 3: Pattern Library (Week 3)

**Backend:**
- Create pattern library data structure
- Implement pattern CSS generation
- Add pattern validation

**Frontend:**
- Build pattern browser UI
- Implement pattern search/filter
- Add pattern customization controls (color, opacity, scale)

**Deliverables:**
- 50+ SVG patterns
- Pattern browser with categories
- Pattern customization

### Phase 4: Advanced Features (Week 4)

**Backend:**
- Implement responsive variations
- Add advanced CSS properties (opacity, blend modes)
- Optimize image processing

**Frontend:**
- Add position picker (3x3 grid + custom)
- Implement responsive controls
- Add advanced property controls
- Enhance live preview

**Deliverables:**
- Visual position picker
- Responsive variations
- Advanced styling controls
- Polished live preview

### Phase 5: Optimization & Testing (Week 5)

**Backend:**
- Implement lazy loading
- Add WebP support
- Optimize CSS generation
- Cache warming

**Frontend:**
- Optimize asset loading
- Add loading states
- Implement error handling
- Performance tuning

**Testing:**
- Unit tests (PHPUnit)
- Integration tests
- E2E tests (Playwright)
- Performance testing
- Security audit

**Deliverables:**
- <100ms CSS generation
- Lazy loading working
- Comprehensive test coverage
- Security hardened

### Phase 6: Documentation & Polish (Week 6)

**Documentation:**
- User guide
- Developer documentation
- API documentation
- Migration guide

**Polish:**
- UI/UX refinements
- Accessibility improvements
- Browser compatibility testing
- Final bug fixes

**Deliverables:**
- Complete documentation
- Polished UI
- WCAG 2.1 AA compliant
- Production ready


## API Reference

### PHP API

**MASE_Settings Methods:**

```php
/**
 * Get background configuration for a specific area
 * 
 * @param string $area Area identifier (dashboard, admin_menu, etc.)
 * @return array Background configuration
 */
public function get_background_config( $area )

/**
 * Update background configuration for a specific area
 * 
 * @param string $area Area identifier
 * @param array $config Background configuration
 * @return bool Success status
 */
public function update_background_config( $area, $config )

/**
 * Get pattern library
 * 
 * @return array Pattern library with all patterns organized by category
 */
public function get_pattern_library()

/**
 * Get gradient presets
 * 
 * @return array Gradient presets with configurations
 */
public function get_gradient_presets()

/**
 * Validate background settings
 * 
 * @param array $input Settings to validate
 * @param string $area Area identifier
 * @return array|WP_Error Validated settings or error
 */
public function validate_background_settings( $input, $area )
```

**MASE_CSS_Generator Methods:**

```php
/**
 * Generate background CSS for all areas
 * 
 * @param array $settings Full settings array
 * @return string Generated CSS
 */
private function generate_background_styles( $settings )

/**
 * Generate CSS for specific background area
 * 
 * @param array $config Background configuration
 * @param string $selector CSS selector
 * @return string Generated CSS
 */
private function generate_area_background_css( $config, $selector )
```

**MASE_Admin AJAX Handlers:**

```php
/**
 * Handle background image upload
 * 
 * POST params:
 * - nonce: Security nonce
 * - area: Area identifier
 * - file: Uploaded file
 * 
 * Response:
 * - success: bool
 * - data: { attachment_id, url, thumbnail }
 */
public function handle_ajax_upload_background_image()

/**
 * Handle media library selection
 * 
 * POST params:
 * - nonce: Security nonce
 * - area: Area identifier
 * - attachment_id: WordPress attachment ID
 * 
 * Response:
 * - success: bool
 * - data: { attachment_id, url, thumbnail }
 */
public function handle_ajax_select_background_image()

/**
 * Handle background removal
 * 
 * POST params:
 * - nonce: Security nonce
 * - area: Area identifier
 * 
 * Response:
 * - success: bool
 */
public function handle_ajax_remove_background_image()
```

### JavaScript API

**MASE.backgrounds Module:**

```javascript
/**
 * Initialize background system
 */
MASE.backgrounds.init()

/**
 * Upload file for specific area
 * 
 * @param {File} file - File object to upload
 * @param {string} area - Area identifier
 */
MASE.backgrounds.uploadFile(file, area)

/**
 * Open WordPress media library
 * 
 * @param {string} area - Area identifier
 */
MASE.backgrounds.openMediaLibrary(area)

/**
 * Update preview after change
 * 
 * @param {string} area - Area identifier
 * @param {Object} data - Background data
 */
MASE.backgrounds.updatePreview(area, data)
```

**MASE.gradientBuilder Module:**

```javascript
/**
 * Initialize gradient builder
 */
MASE.gradientBuilder.init()

/**
 * Add color stop to gradient
 * 
 * @param {string} area - Area identifier
 */
MASE.gradientBuilder.addColorStop(area)

/**
 * Update gradient preview
 * 
 * @param {string} area - Area identifier
 */
MASE.gradientBuilder.updatePreview(area)

/**
 * Get gradient configuration
 * 
 * @param {string} area - Area identifier
 * @return {Object} Gradient configuration
 */
MASE.gradientBuilder.getGradientConfig(area)

/**
 * Generate CSS gradient string
 * 
 * @param {Object} config - Gradient configuration
 * @return {string} CSS gradient value
 */
MASE.gradientBuilder.generateGradientCSS(config)

/**
 * Apply gradient preset
 * 
 * @param {string} area - Area identifier
 * @param {string} presetId - Preset identifier
 */
MASE.gradientBuilder.applyPreset(area, presetId)
```

**MASE.patternLibrary Module:**

```javascript
/**
 * Initialize pattern library
 */
MASE.patternLibrary.init()

/**
 * Apply pattern to area
 * 
 * @param {string} area - Area identifier
 * @param {string} patternId - Pattern identifier
 */
MASE.patternLibrary.applyPattern(area, patternId)

/**
 * Update pattern preview
 * 
 * @param {string} area - Area identifier
 */
MASE.patternLibrary.updatePattern(area)

/**
 * Get pattern configuration
 * 
 * @param {string} area - Area identifier
 * @return {Object} Pattern configuration
 */
MASE.patternLibrary.getPatternConfig(area)

/**
 * Generate pattern SVG with custom color
 * 
 * @param {Object} config - Pattern configuration
 * @return {string} SVG markup
 */
MASE.patternLibrary.generatePatternSVG(config)
```

**MASE.positionPicker Module:**

```javascript
/**
 * Initialize position picker
 */
MASE.positionPicker.init()

/**
 * Update position preview
 * 
 * @param {string} area - Area identifier
 */
MASE.positionPicker.updatePreview(area)
```

### WordPress Hooks

**Actions:**

```php
/**
 * Fires after background settings are saved
 * 
 * @param string $area Area identifier
 * @param array $config Background configuration
 */
do_action( 'mase_background_saved', $area, $config );

/**
 * Fires after background image is uploaded
 * 
 * @param int $attachment_id WordPress attachment ID
 * @param string $area Area identifier
 */
do_action( 'mase_background_image_uploaded', $attachment_id, $area );

/**
 * Fires before background CSS is generated
 * 
 * @param array $settings Full settings array
 */
do_action( 'mase_before_background_css_generation', $settings );

/**
 * Fires after background CSS is generated
 * 
 * @param string $css Generated CSS
 * @param array $settings Full settings array
 */
do_action( 'mase_after_background_css_generation', $css, $settings );
```

**Filters:**

```php
/**
 * Filter background configuration before save
 * 
 * @param array $config Background configuration
 * @param string $area Area identifier
 * @return array Modified configuration
 */
apply_filters( 'mase_background_config', $config, $area );

/**
 * Filter generated background CSS
 * 
 * @param string $css Generated CSS
 * @param array $config Background configuration
 * @param string $area Area identifier
 * @return string Modified CSS
 */
apply_filters( 'mase_background_css', $css, $config, $area );

/**
 * Filter pattern library
 * 
 * @param array $patterns Pattern library
 * @return array Modified pattern library
 */
apply_filters( 'mase_pattern_library', $patterns );

/**
 * Filter gradient presets
 * 
 * @param array $presets Gradient presets
 * @return array Modified presets
 */
apply_filters( 'mase_gradient_presets', $presets );

/**
 * Filter allowed file types for background upload
 * 
 * @param array $types Allowed MIME types
 * @return array Modified types
 */
apply_filters( 'mase_background_allowed_types', $types );

/**
 * Filter maximum upload file size
 * 
 * @param int $size Maximum size in bytes
 * @return int Modified size
 */
apply_filters( 'mase_background_max_size', $size );
```

## Conclusion

The Advanced Background System provides comprehensive background customization for WordPress admin areas while maintaining performance, security, and seamless integration with existing MASE infrastructure. The modular architecture allows for future extensions and the phased implementation approach ensures stable, incremental delivery.

Key achievements:
- 6 independent admin areas with custom backgrounds
- 3 background types (images, gradients, patterns)
- Advanced controls (opacity, blend modes, positioning, responsive)
- Performance optimized (<100ms CSS generation, lazy loading)
- Security hardened (validation, sanitization, CSRF protection)
- Comprehensive testing strategy
- Full API documentation
- Backward compatible

The system is designed to be maintainable, extensible, and user-friendly while adhering to WordPress coding standards and best practices.
