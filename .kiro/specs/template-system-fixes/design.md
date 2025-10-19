# Design Document

## Overview

This design addresses three critical bugs in the MASE v1.2.0 template system: missing thumbnails, non-functional Apply buttons, and an oversized gallery layout. The solution involves modifying the PHP backend to generate SVG thumbnails, fixing HTML data attributes for JavaScript compatibility, implementing a complete JavaScript event handler with AJAX integration, adding a PHP AJAX endpoint, and optimizing CSS for a more compact gallery display.

## Architecture

### Component Interaction Flow

```
User clicks Apply button
    ↓
JavaScript Handler (mase-admin.js)
    ↓
Confirmation Dialog
    ↓
AJAX Request to WordPress
    ↓
PHP AJAX Handler (class-mase-admin.php)
    ↓
Settings Manager (class-mase-settings.php)
    ↓
Database Update
    ↓
Cache Invalidation
    ↓
Success Response
    ↓
Page Reload with New Template
```

### Data Flow

```
PHP: get_all_templates()
    ↓
Generate SVG thumbnails dynamically
    ↓
Render HTML with data-template attribute
    ↓
JavaScript reads data-template on click
    ↓
AJAX sends template_id to backend
    ↓
Backend applies template settings
    ↓
Frontend reloads to show changes
```

## Components and Interfaces

### 1. Template Data Generator (PHP)

**File:** `includes/class-mase-settings.php`

**Methods:**

```php
/**
 * Get All Templates
 * 
 * Returns all built-in and custom templates with thumbnails.
 * Modified to include thumbnail generation.
 * 
 * @return array Templates data with thumbnails
 */
public function get_all_templates()

/**
 * Generate Template Thumbnail
 * 
 * Creates an SVG thumbnail with template name and primary color.
 * Uses base64 encoding for inline data URI.
 * 
 * @param string $name Template name
 * @param string $color Primary color (hex)
 * @return string Base64-encoded SVG data URI
 */
private function generate_template_thumbnail($name, $color)
```

**Thumbnail Generation Logic:**
- Extract primary color from template's palette settings
- Create 300x200px SVG with colored background
- Center template name as white text with shadow
- Encode as base64 data URI
- Sanitize all inputs to prevent XSS

**SVG Structure:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
  <rect fill="{color}" width="300" height="200"/>
  <text x="50%" y="50%" text-anchor="middle" fill="white">
    {template_name}
  </text>
</svg>
```

### 2. HTML Template Card (PHP)

**File:** `includes/admin-settings-page.php`

**Changes:**
- Add `data-template` attribute (primary identifier for JavaScript)
- Keep `data-template-id` for backward compatibility
- Add `role="article"` for accessibility
- Add `aria-label` with template name

**Updated Structure:**
```html
<div class="mase-template-card" 
     data-template="{template_id}"
     data-template-id="{template_id}"
     role="article"
     aria-label="{template_name}">
  <div class="mase-template-thumbnail">
    <img src="{thumbnail_data_uri}" alt="{template_name}" />
  </div>
  <div class="mase-template-details">
    <h3>{template_name}</h3>
    <p>{description}</p>
  </div>
  <div class="mase-template-actions">
    <button class="mase-template-apply-btn" 
            data-template-id="{template_id}">
      Apply
    </button>
  </div>
</div>
```

### 3. JavaScript Event Handler

**File:** `assets/js/mase-admin.js`

**New Method:**
```javascript
/**
 * Handle Template Apply Button Click
 * 
 * Processes template application with confirmation and AJAX.
 * 
 * @param {Event} e Click event
 */
handleTemplateApply: function(e) {
  // 1. Prevent default and stop propagation
  // 2. Get template ID from data-template attribute
  // 3. Validate template ID exists
  // 4. Get template name for confirmation dialog
  // 5. Show confirmation dialog with details
  // 6. If confirmed, disable button and show loading state
  // 7. Send AJAX request
  // 8. Handle success: show notification, reload page
  // 9. Handle error: show error, restore button state
}
```

**Event Registration:**
```javascript
// In bindEvents() method
$(document).on('click', '.mase-template-apply-btn', 
  this.handleTemplateApply.bind(this));
```

**AJAX Request Structure:**
```javascript
$.ajax({
  url: ajaxurl,
  type: 'POST',
  data: {
    action: 'mase_apply_template',
    nonce: $('#mase_nonce').val(),
    template_id: templateId
  },
  success: function(response) { /* ... */ },
  error: function(xhr, status, error) { /* ... */ }
})
```

**Confirmation Dialog Content:**
```
Apply "{template_name}" template?

This will overwrite your current settings including:
• Color scheme
• Typography
• Visual effects

This action cannot be undone.
```

### 4. PHP AJAX Handler

**File:** `includes/class-mase-admin.php`

**New Method:**
```php
/**
 * AJAX Handler: Apply Template
 * 
 * Applies a complete template and updates all settings.
 * 
 * @since 1.2.0
 */
public function ajax_apply_template() {
  // 1. Verify nonce
  // 2. Check user capabilities (manage_options)
  // 3. Sanitize and validate template_id
  // 4. Get template data from settings
  // 5. Validate template exists
  // 6. Apply template via settings->apply_template()
  // 7. Invalidate CSS cache
  // 8. Return success response with template info
  // 9. Handle errors with appropriate HTTP status codes
}
```

**Hook Registration:**
```php
// In constructor
add_action('wp_ajax_mase_apply_template', 
  array($this, 'ajax_apply_template'));
```

**Response Format:**
```php
// Success
wp_send_json_success(array(
  'message' => 'Template applied successfully',
  'template_id' => $template_id,
  'template_name' => $template['name']
));

// Error
wp_send_json_error(array(
  'message' => 'Error message'
), $http_status_code);
```

### 5. CSS Gallery Optimization

**File:** `assets/css/mase-templates.css`

**Changes:**

```css
/* Reduce grid columns from 4 to 3 */
.mase-template-gallery {
  grid-template-columns: repeat(3, 1fr);
  gap: 20px; /* Reduced from 24px */
}

/* Responsive breakpoints */
@media (max-width: 1400px) {
  .mase-template-gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .mase-template-gallery {
    grid-template-columns: 1fr;
  }
}

/* Reduce card size */
.mase-template-card {
  max-height: 420px;
  overflow: hidden;
}

/* Reduce thumbnail height */
.mase-template-thumbnail {
  height: 150px; /* Reduced from 200px */
}

/* Compact card body */
.mase-template-card-body {
  padding: 16px; /* Reduced from 20px */
}

/* Smaller typography */
.mase-template-name {
  font-size: 16px; /* Reduced from 18px */
}

.mase-template-description {
  font-size: 13px; /* Reduced from 14px */
  /* Limit to 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hide features list */
.mase-template-features {
  display: none;
}
```

## Data Models

### Template Data Structure

```php
array(
  'template_id' => array(
    'id' => 'template_id',
    'name' => 'Template Name',
    'description' => 'Template description',
    'thumbnail' => 'data:image/svg+xml;base64,...', // NEW
    'is_custom' => false,
    'settings' => array(
      'palettes' => array(...),
      'typography' => array(...),
      'visual_effects' => array(...),
      // ... other settings
    )
  )
)
```

### AJAX Request Payload

```javascript
{
  action: 'mase_apply_template',
  nonce: 'wp_nonce_value',
  template_id: 'template_id_string'
}
```

### AJAX Response Payload

```javascript
// Success
{
  success: true,
  data: {
    message: 'Template applied successfully',
    template_id: 'template_id',
    template_name: 'Template Name'
  }
}

// Error
{
  success: false,
  data: {
    message: 'Error description'
  }
}
```

## Error Handling

### Client-Side (JavaScript)

**Error Scenarios:**

1. **Missing Template ID**
   - Detection: `!templateId` check
   - Action: Log error to console, abort operation
   - User Feedback: None (silent fail with console log)

2. **User Cancels Confirmation**
   - Detection: `!confirm()` returns false
   - Action: Abort operation
   - User Feedback: None (expected behavior)

3. **AJAX Network Error**
   - Detection: `error` callback triggered
   - Action: Parse error, restore button state
   - User Feedback: Error notification with message

4. **AJAX Response Error**
   - Detection: `response.success === false`
   - Action: Extract error message, restore button state
   - User Feedback: Error notification with server message

**Error Messages:**
```javascript
// Network errors
if (xhr.status === 403) {
  message = 'Insufficient permissions';
} else if (xhr.status === 404) {
  message = 'Template not found';
} else if (xhr.status === 500) {
  message = 'Server error. Please try again later.';
} else {
  message = 'Failed to apply template.';
}
```

### Server-Side (PHP)

**Error Scenarios:**

1. **Invalid Nonce**
   - Detection: `check_ajax_referer()` fails
   - Response: WordPress handles automatically (403)
   - Message: 'Security check failed'

2. **Insufficient Permissions**
   - Detection: `!current_user_can('manage_options')`
   - Response: `wp_send_json_error(..., 403)`
   - Message: 'Insufficient permissions'

3. **Missing Template ID**
   - Detection: `empty($template_id)`
   - Response: `wp_send_json_error(..., 400)`
   - Message: 'Template ID is required'

4. **Template Not Found**
   - Detection: `is_wp_error($template)` or `!$template`
   - Response: `wp_send_json_error(..., 404)`
   - Message: 'Template not found'

5. **Application Failure**
   - Detection: `is_wp_error($result)`
   - Response: `wp_send_json_error(..., 500)`
   - Message: Specific error from WP_Error

**Error Handling Flow:**
```php
try {
  // Verify nonce (throws on failure)
  check_ajax_referer('mase_save_settings', 'nonce');
  
  // Check permissions
  if (!current_user_can('manage_options')) {
    wp_send_json_error(array(
      'message' => __('Insufficient permissions', 'modern-admin-styler')
    ), 403);
  }
  
  // Validate input
  $template_id = sanitize_text_field($_POST['template_id'] ?? '');
  if (empty($template_id)) {
    wp_send_json_error(array(
      'message' => __('Template ID is required', 'modern-admin-styler')
    ), 400);
  }
  
  // Get template
  $template = $this->settings->get_template($template_id);
  if (is_wp_error($template) || !$template) {
    wp_send_json_error(array(
      'message' => __('Template not found', 'modern-admin-styler')
    ), 404);
  }
  
  // Apply template
  $result = $this->settings->apply_template($template_id);
  if (is_wp_error($result)) {
    wp_send_json_error(array(
      'message' => $result->get_error_message()
    ), 500);
  }
  
  // Success
  $this->cache->invalidate('generated_css');
  wp_send_json_success(array(
    'message' => __('Template applied successfully', 'modern-admin-styler'),
    'template_id' => $template_id,
    'template_name' => $template['name']
  ));
  
} catch (Exception $e) {
  wp_send_json_error(array(
    'message' => $e->getMessage()
  ), 500);
}
```

## Testing Strategy

### Unit Tests

**PHP Tests:**

1. **Test `generate_template_thumbnail()`**
   - Input: Valid name and color
   - Expected: Valid base64 SVG data URI
   - Verify: Starts with `data:image/svg+xml;base64,`

2. **Test `generate_template_thumbnail()` with XSS attempt**
   - Input: Name with `<script>` tags
   - Expected: Sanitized output
   - Verify: No script tags in decoded SVG

3. **Test `get_all_templates()` includes thumbnails**
   - Expected: All templates have `thumbnail` property
   - Verify: Each thumbnail is non-empty string

4. **Test `ajax_apply_template()` with valid data**
   - Mock: Valid nonce, user capabilities, template ID
   - Expected: Success response
   - Verify: Settings updated, cache invalidated

5. **Test `ajax_apply_template()` with invalid template**
   - Mock: Valid nonce, invalid template ID
   - Expected: 404 error response
   - Verify: Error message matches

**JavaScript Tests:**

1. **Test `handleTemplateApply()` reads data-template**
   - Setup: Mock card with data-template attribute
   - Action: Click Apply button
   - Verify: Correct template ID extracted

2. **Test `handleTemplateApply()` shows confirmation**
   - Setup: Mock confirm() function
   - Action: Click Apply button
   - Verify: confirm() called with correct message

3. **Test `handleTemplateApply()` sends AJAX request**
   - Setup: Mock $.ajax()
   - Action: Confirm and apply
   - Verify: AJAX called with correct parameters

4. **Test `handleTemplateApply()` handles success**
   - Setup: Mock successful AJAX response
   - Action: Apply template
   - Verify: Success notification shown, page reloads

5. **Test `handleTemplateApply()` handles error**
   - Setup: Mock failed AJAX response
   - Action: Apply template
   - Verify: Error notification shown, button restored

### Integration Tests

1. **Test Complete Template Application Flow**
   - Navigate to Templates tab
   - Click Apply on a template
   - Confirm dialog
   - Verify: Success notification appears
   - Verify: Page reloads
   - Verify: Template is marked as active
   - Verify: Settings reflect template configuration

2. **Test Thumbnail Display**
   - Navigate to Templates tab
   - Verify: All template cards show thumbnails
   - Verify: No placeholder icons visible
   - Verify: Thumbnails have correct colors

3. **Test Gallery Responsiveness**
   - Desktop (1920px): 3 columns
   - Tablet (1024px): 2 columns
   - Mobile (375px): 1 column
   - Verify: Cards resize appropriately

4. **Test Error Handling**
   - Simulate network error
   - Verify: Error notification appears
   - Verify: Button returns to normal state
   - Verify: User can retry

### Manual Testing Checklist

- [ ] All templates display thumbnails (no placeholders)
- [ ] Thumbnails show correct colors and names
- [ ] Clicking Apply shows confirmation dialog
- [ ] Confirmation dialog lists affected settings
- [ ] Canceling confirmation aborts operation
- [ ] Confirming applies template successfully
- [ ] Success notification appears
- [ ] Page reloads after application
- [ ] Applied template is marked as active
- [ ] Gallery shows 3 columns on desktop
- [ ] Gallery shows 2 columns on tablet
- [ ] Gallery shows 1 column on mobile
- [ ] Cards are smaller and more compact
- [ ] Description text truncates to 2 lines
- [ ] Features list is hidden
- [ ] Apply button disables during operation
- [ ] Button text changes to "Applying..."
- [ ] Card opacity reduces during operation
- [ ] Error messages display correctly
- [ ] Console logs show debug information
- [ ] No JavaScript errors in console
- [ ] Works in Chrome, Firefox, Safari
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader announces template names

## Performance Considerations

### SVG Thumbnail Generation

**Optimization:**
- Generate thumbnails on-demand (not stored in database)
- Use base64 encoding for inline rendering (no HTTP requests)
- SVG is lightweight (~500 bytes per thumbnail)
- No external image files needed

**Performance Impact:**
- Minimal: 11 templates × 500 bytes = ~5.5 KB total
- Generated once per page load
- Cached in browser after first load

### AJAX Request Optimization

**Debouncing:**
- Not needed (single click action)
- Button disabled during operation prevents duplicate requests

**Response Size:**
- Success response: ~200 bytes
- Error response: ~150 bytes
- Minimal network overhead

### CSS Optimization

**Changes:**
- Reduced grid gap: Saves ~4px per card
- Smaller thumbnails: Reduces rendering area by 25%
- Hidden features list: Eliminates ~50px per card
- Text truncation: Prevents layout shifts

**Impact:**
- Faster initial render
- Less scrolling required
- Better mobile performance

## Security Considerations

### XSS Prevention

**Template Name Sanitization:**
```php
// In generate_template_thumbnail()
$name = esc_html($name);
```

**Color Validation:**
```php
// Remove # and validate hex
$color_clean = str_replace('#', '', $color);
if (!preg_match('/^[0-9A-Fa-f]{6}$/', $color_clean)) {
  $color_clean = '4A90E2'; // Default fallback
}
```

**HTML Output Escaping:**
```php
// In admin-settings-page.php
data-template="<?php echo esc_attr($template_id); ?>"
aria-label="<?php echo esc_attr($template['name']); ?>"
```

### CSRF Protection

**Nonce Verification:**
```php
// In ajax_apply_template()
check_ajax_referer('mase_save_settings', 'nonce');
```

**JavaScript Nonce Inclusion:**
```javascript
nonce: $('#mase_nonce').val()
```

### Authorization

**Capability Check:**
```php
if (!current_user_can('manage_options')) {
  wp_send_json_error(array(
    'message' => __('Insufficient permissions', 'modern-admin-styler')
  ), 403);
}
```

### Input Validation

**Template ID Sanitization:**
```php
$template_id = sanitize_text_field($_POST['template_id'] ?? '');
```

**Existence Validation:**
```php
$template = $this->settings->get_template($template_id);
if (!$template || is_wp_error($template)) {
  // Return 404 error
}
```

## Accessibility Features

### Keyboard Navigation

**Focus Management:**
- Template cards are focusable (tabindex="0")
- Apply buttons receive focus
- Confirmation dialog is keyboard-accessible

**Keyboard Shortcuts:**
- Tab: Navigate between cards
- Enter/Space: Activate Apply button
- Escape: Close confirmation dialog (browser default)

### Screen Reader Support

**ARIA Attributes:**
```html
<div class="mase-template-card"
     role="article"
     aria-label="Apply {template_name} template">
```

**Button Labels:**
```html
<button aria-label="Apply {template_name} template">
  Apply
</button>
```

**Status Announcements:**
- Success/error notifications use ARIA live regions
- Loading state announced via button text change

### Visual Indicators

**Focus Styles:**
```css
.mase-template-card:focus-visible {
  outline: 2px solid var(--mase-primary);
  outline-offset: 2px;
}
```

**Loading State:**
- Button disabled (visual + functional)
- Text changes to "Applying..."
- Card opacity reduced to 0.6

### Color Contrast

**Thumbnail Text:**
- White text on colored background
- Text shadow for improved contrast
- Meets WCAG AA standards

## Browser Compatibility

### Supported Browsers

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

### Polyfills Not Required

- Base64 encoding: Native support in all modern browsers
- SVG: Native support in all modern browsers
- AJAX: jQuery handles cross-browser compatibility
- CSS Grid: Native support in all modern browsers

### Fallbacks

**SVG Not Supported (IE11):**
- Placeholder icon displays instead
- Functionality remains intact

**CSS Grid Not Supported:**
- Falls back to flexbox layout
- Single column on older browsers

## Migration Strategy

### Backward Compatibility

**Data Attributes:**
- Keep both `data-template` and `data-template-id`
- JavaScript uses `data-template` (new)
- Legacy code can still use `data-template-id`

**Template Data Structure:**
- Add `thumbnail` property (non-breaking)
- Existing templates continue to work
- Empty thumbnails show placeholder

### Deployment Steps

1. **Deploy PHP Changes**
   - Update `class-mase-settings.php`
   - Add `generate_template_thumbnail()` method
   - Update `get_all_templates()` to include thumbnails

2. **Deploy HTML Changes**
   - Update `admin-settings-page.php`
   - Add `data-template` attribute
   - Add accessibility attributes

3. **Deploy JavaScript Changes**
   - Update `mase-admin.js`
   - Add `handleTemplateApply()` method
   - Register event handler

4. **Deploy PHP AJAX Handler**
   - Update `class-mase-admin.php`
   - Add `ajax_apply_template()` method
   - Register AJAX hook

5. **Deploy CSS Changes**
   - Update `mase-templates.css`
   - Reduce gallery size
   - Optimize card layout

6. **Clear Caches**
   - WordPress object cache
   - Browser cache (version bump)
   - CDN cache (if applicable)

### Rollback Plan

**If Issues Occur:**

1. **Revert PHP Changes**
   - Restore previous `class-mase-settings.php`
   - Templates will show placeholders (acceptable)

2. **Revert JavaScript Changes**
   - Restore previous `mase-admin.js`
   - Apply buttons won't work (requires fix)

3. **Revert CSS Changes**
   - Restore previous `mase-templates.css`
   - Gallery will be larger (acceptable)

**Critical Path:**
- JavaScript handler is most critical
- Must be deployed with PHP AJAX handler
- CSS changes are cosmetic (can be delayed)

## Future Enhancements

### Potential Improvements

1. **Template Preview Modal**
   - Show full-screen preview before applying
   - Allow users to see changes without committing

2. **Template Thumbnails from Screenshots**
   - Capture actual admin interface screenshots
   - Store as image files for better visual representation

3. **Template Categories**
   - Group templates by style (Modern, Classic, Dark, etc.)
   - Add filter/search functionality

4. **Template Ratings**
   - Allow users to rate templates
   - Show popularity indicators

5. **Template Sharing**
   - Export custom templates as JSON
   - Import templates from other sites

### Technical Debt

**Current Limitations:**
- SVG thumbnails are basic (text only)
- No template preview before applying
- No undo functionality
- Gallery pagination not implemented (11 templates is manageable)

**Recommended Refactoring:**
- Extract template manager into separate class
- Add template validation layer
- Implement template versioning
- Add template migration system
