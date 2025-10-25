# Implementation Plan

## Overview

This implementation plan breaks down the login page customization feature into discrete, manageable coding tasks. Each task builds incrementally on previous work, ensuring the feature can be developed and tested systematically.

## Task List

- [x] 1. Extend settings structure with login customization defaults
  - Add `login_customization` section to `MASE_Settings::get_defaults()`
  - Include all logo, background, form, typography, and additional settings
  - Set WordPress-compatible default values
  - _Requirements: 5.1, 5.2_

- [x] 2. Implement settings validation for login customization
  - [x] 2.1 Add validation logic to `MASE_Settings::validate()`
    - Validate boolean fields (logo_enabled, glassmorphism_enabled, hide_wp_branding)
    - Validate URL fields (logo_url, logo_link_url, background_image)
    - Validate numeric ranges (logo_width 50-400, logo_height 50-400, opacity 0-100)
    - Validate enum fields (background_type, gradient_type, background_size, form_box_shadow)
    - Validate color fields (hex format validation)
    - Sanitize text fields (footer_text with wp_kses_post, custom_css with wp_strip_all_tags)
    - _Requirements: 5.1, 5.2, 6.1_

  - [x] 2.2 Add gradient colors array validation
    - Validate each color stop has 'color' and 'position' keys
    - Validate color format for each stop
    - Validate position is 0-100
    - _Requirements: 2.3, 2.4_

- [x] 3. Create SVG sanitization utility
  - [x] 3.1 Implement `MASE_Admin::sanitize_svg()` method
    - Load SVG content as XML using DOMDocument
    - Remove all `<script>` elements
    - Remove event handler attributes (onclick, onload, etc.)
    - Remove processing instructions and external entity references
    - Return sanitized XML string
    - _Requirements: 6.4, 6.5_

  - [ ]\* 3.2 Add unit tests for SVG sanitization
    - Test script tag removal
    - Test event handler removal
    - Test external entity removal
    - Test valid SVG preservation
    - Test malformed SVG handling
    - _Requirements: 6.4, 6.5_

- [x] 4. Implement login logo upload AJAX handler
  - [x] 4.1 Create `MASE_Admin::handle_ajax_upload_login_logo()` method
    - Verify nonce with `check_ajax_referer()`
    - Check user capability with `current_user_can('manage_options')`
    - Validate file upload exists in `$_FILES['logo_file']`
    - Check for upload errors
    - Validate file type (PNG, JPG, SVG) using `wp_check_filetype()`
    - Validate MIME type matches extension
    - Validate file size (max 2MB)
    - Call `sanitize_svg()` for SVG files
    - Upload file using `wp_handle_upload()`
    - Update settings with logo URL
    - Invalidate login CSS cache
    - Return JSON success response with logo URL
    - _Requirements: 1.1, 1.2, 1.3, 6.1, 6.2, 6.3, 6.4_

  - [x] 4.2 Register AJAX action in `MASE_Admin::__construct()`
    - Add `add_action('wp_ajax_mase_upload_login_logo', ...)`
    - _Requirements: 7.1_

- [x] 5. Implement background image upload AJAX handler
  - [x] 5.1 Create `MASE_Admin::handle_ajax_upload_login_background()` method
    - Similar structure to logo upload handler
    - Validate file type (PNG, JPG only - no SVG)
    - Validate file size (max 5MB for backgrounds)
    - Upload and store URL in settings
    - Invalidate login CSS cache
    - _Requirements: 2.1, 2.2, 6.1, 6.2, 6.3_

  - [x] 5.2 Register AJAX action
    - Add `add_action('wp_ajax_mase_upload_login_background', ...)`
    - _Requirements: 7.1_

- [x] 6. Create CSS generation methods for login page
  - [x] 6.1 Implement `MASE_CSS_Generator::generate_login_styles()` main method
    - Check if login customization is enabled
    - Call sub-methods for each CSS section
    - Concatenate all CSS sections
    - Append custom CSS if provided
    - Return complete CSS string
    - _Requirements: 8.1, 8.2_

  - [x] 6.2 Implement `MASE_CSS_Generator::generate_login_logo_css()` method
    - Generate CSS for `#login h1 a` selector
    - Set background-image to custom logo URL
    - Set width and height from settings
    - Set background-size: contain
    - Set background-position: center
    - _Requirements: 1.4, 1.5_

  - [x] 6.3 Implement `MASE_CSS_Generator::generate_login_background_css()` method
    - Handle three background types: color, image, gradient
    - For color: set background-color on body.login
    - For image: set background-image, background-size, background-position, background-repeat
    - For image with opacity: use ::before pseudo-element
    - For gradient: call `generate_gradient_css()` helper
    - Apply opacity if < 100%
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 6.4 Implement `MASE_CSS_Generator::generate_login_form_css()` method
    - Target `#loginform, #registerform, #lostpasswordform` selectors
    - Set form background color
    - Set border color
    - Set border radius if > 0
    - Apply box shadow from preset
    - Apply glassmorphism effect if enabled (backdrop-filter, opacity, border)
    - Set text color for input fields
    - Set focus state colors
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 6.5 Implement `MASE_CSS_Generator::generate_login_typography_css()` method
    - Set font-family for labels and inputs
    - Set font-size for labels and inputs
    - Set font-weight for labels
    - Apply to appropriate selectors
    - _Requirements: 3.5_

  - [x] 6.6 Implement `MASE_CSS_Generator::generate_login_additional_css()` method
    - Generate custom footer styling if footer_text provided
    - Generate CSS to hide WordPress branding if enabled
    - _Requirements: 4.1, 4.2_

  - [x] 6.7 Implement helper method `MASE_CSS_Generator::get_box_shadow_preset()`
    - Map preset names to box-shadow values
    - Return 'none', 'default', 'subtle', 'medium', or 'strong' shadow
    - _Requirements: 3.3_

  - [x] 6.8 Implement helper method `MASE_CSS_Generator::generate_gradient_css()`
    - Support linear and radial gradients
    - Build color stops string from gradient_colors array
    - Return complete gradient CSS value
    - _Requirements: 2.3, 2.4_

- [x] 7. Implement login page hook integration
  - [x] 7.1 Add hook registrations to `MASE_Admin::__construct()`
    - Add `add_action('login_enqueue_scripts', array($this, 'inject_login_css'))`
    - Add `add_filter('login_headerurl', array($this, 'filter_login_logo_url'))`
    - Add `add_filter('login_headertext', array($this, 'filter_login_logo_title'))`
    - Add `add_action('login_footer', array($this, 'inject_login_footer'))`
    - _Requirements: 8.1, 1.6, 4.1_

  - [x] 7.2 Implement `MASE_Admin::inject_login_css()` method
    - Get settings from `$this->settings->get_option()`
    - Check if login customization is enabled
    - Try to get cached CSS with key 'login_css'
    - If cache miss, generate CSS using `$this->generator->generate_login_styles()`
    - Cache generated CSS for 1 hour
    - Output CSS in `<style>` tag with id 'mase-login-css'
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 7.3 Implement `MASE_Admin::filter_login_logo_url()` method
    - Get custom logo link URL from settings
    - Return custom URL if set, otherwise return default WordPress.org URL
    - _Requirements: 1.6_

  - [x] 7.4 Implement `MASE_Admin::filter_login_logo_title()` method
    - If custom logo link URL is set, return site name from `get_bloginfo('name')`
    - Otherwise return default "Powered by WordPress"
    - _Requirements: 1.6_

  - [x] 7.5 Implement `MASE_Admin::inject_login_footer()` method
    - Get footer text from settings
    - If footer text exists, output in div with class 'mase-login-footer'
    - Sanitize output with `wp_kses_post()`
    - If hide_wp_branding enabled, output CSS to hide #backtoblog and #nav
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 8. Add cache management for login CSS
  - [x] 8.1 Add cache key constant or method
    - Define 'login_css' as cache key
    - _Requirements: 8.3_

  - [x] 8.2 Implement cache invalidation on settings save
    - In upload handlers, call `$this->cache->invalidate('login_css')`
    - In settings save handler, invalidate login CSS cache
    - _Requirements: 5.3, 8.3_

- [x] 9. Create admin interface for login customization
  - [x] 9.1 Add login customization section to admin settings page
    - Add new tab or section in `includes/admin-settings-page.php`
    - Create HTML structure for logo settings
    - Create HTML structure for background settings
    - Create HTML structure for form styling settings
    - Create HTML structure for typography settings
    - Create HTML structure for additional options
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 9.2 Add file upload UI components
    - Create upload button for logo
    - Create upload button for background image
    - Add preview area for uploaded images
    - Add remove button for uploaded files
    - _Requirements: 7.2_

  - [x] 9.3 Add color picker fields
    - Use WordPress color picker for all color fields
    - Add color pickers for background, form colors, text colors
    - _Requirements: 7.2_

  - [x] 9.4 Add slider controls
    - Add slider for logo width/height
    - Add slider for background opacity
    - Add slider for border radius
    - Add slider for glassmorphism blur and opacity
    - _Requirements: 7.2_

  - [x] 9.5 Add dropdown/select fields
    - Add dropdown for background type (color/image/gradient)
    - Add dropdown for gradient type (linear/radial)
    - Add dropdown for background size (cover/contain/auto)
    - Add dropdown for box shadow preset
    - _Requirements: 7.2_

  - [x] 9.6 Add text input fields
    - Add input for custom logo link URL
    - Add textarea for custom footer text
    - Add code editor for custom CSS
    - _Requirements: 7.2_

  - [x] 9.7 Add checkbox toggles
    - Add checkbox for enable custom logo
    - Add checkbox for enable glassmorphism
    - Add checkbox for hide WordPress branding
    - _Requirements: 7.2_

- [x] 10. Implement JavaScript for admin interface
  - [x] 10.1 Create file upload handlers in `assets/js/mase-admin.js`
    - Handle logo file selection
    - Handle background file selection
    - Show upload progress
    - Display preview after upload
    - Handle remove button clicks
    - Make AJAX calls to upload handlers
    - Update hidden input fields with uploaded URLs
    - _Requirements: 7.3_

  - [x] 10.2 Add conditional field visibility
    - Show/hide gradient options based on background type
    - Show/hide glassmorphism options based on checkbox
    - Show/hide custom logo options based on checkbox
    - _Requirements: 7.3_

  - [x] 10.3 Add validation feedback
    - Validate file types before upload
    - Validate file sizes before upload
    - Show error messages for invalid inputs
    - Show success messages after save
    - _Requirements: 7.3_

  - [ ]\* 10.4 Add live preview functionality (optional)
    - Open login page in new window
    - Apply temporary styles for preview
    - Refresh preview on changes
    - _Requirements: 7.4_

- [x] 11. Implement accessibility features
  - [x] 11.1 Add contrast ratio validation
    - Implement `calculate_contrast_ratio()` method
    - Implement `calculate_relative_luminance()` method
    - Check form text/background contrast
    - Display warnings for insufficient contrast (< 4.5:1)
    - _Requirements: 10.1, 10.2_

  - [x] 11.2 Add accessibility warnings in admin interface
    - Show contrast warnings in real-time
    - Suggest alternative colors
    - Warn about low glassmorphism opacity
    - _Requirements: 10.2_

  - [x] 11.3 Ensure keyboard navigation
    - Test all form fields are keyboard accessible
    - Verify tab order is logical
    - Ensure focus indicators are visible
    - _Requirements: 10.3_

  - [x] 11.4 Add ARIA labels and descriptions
    - Add aria-label to upload buttons
    - Add aria-describedby for help text
    - Add role attributes where appropriate
    - _Requirements: 10.4_

- [x] 12. Add error handling and logging
  - [x] 12.1 Implement upload error message helper
    - Create `get_upload_error_message()` method
    - Map PHP upload error codes to user-friendly messages
    - Return translated error messages
    - _Requirements: 6.1_

  - [x] 12.2 Add error logging for file operations
    - Log file upload failures
    - Log SVG sanitization failures
    - Log CSS generation errors
    - Use `error_log()` for debugging
    - _Requirements: 6.1_

  - [x] 12.3 Add graceful fallbacks
    - Fall back to defaults on invalid settings
    - Continue with partial CSS on generation errors
    - Skip caching on cache write failures
    - _Requirements: 8.2_

- [x] 13. Create migration and backward compatibility
  - [x] 13.1 Add version detection
    - Check if login_customization settings exist
    - Detect legacy settings from other plugins (optional)
    - _Requirements: 9.1_

  - [x] 13.2 Implement settings migration (if needed)
    - Migrate legacy settings to MASE format
    - Preserve existing customizations
    - Log migration process
    - _Requirements: 9.2, 9.3_

  - [x] 13.3 Add reset to defaults functionality
    - Create method to reset login customization section
    - Preserve other MASE settings
    - Clear uploaded files (optional)
    - _Requirements: 9.2_

- [ ]\* 14. Write integration tests
  - [ ]\* 14.1 Test file upload flow
    - Test successful logo upload
    - Test successful background upload
    - Test file type validation
    - Test file size validation
    - Test SVG sanitization in upload flow
    - Test settings update after upload
    - Test cache invalidation after upload
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 6.1, 6.2, 6.3, 6.4_

  - [ ]\* 14.2 Test settings save flow
    - Test complete settings save
    - Test partial settings update
    - Test validation during save
    - Test cache invalidation after save
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]\* 14.3 Test login page rendering
    - Test CSS injection on login page
    - Test logo display
    - Test background display (all types)
    - Test form styling application
    - Test custom footer display
    - Test WordPress branding hiding
    - _Requirements: 8.1, 8.2, 1.4, 1.5, 2.5, 2.6, 3.6, 4.1, 4.2_

  - [ ]\* 14.4 Test security measures
    - Test nonce verification
    - Test capability checks
    - Test unauthorized access rejection
    - Test malicious file rejection
    - Test XSS prevention
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]\* 14.5 Test accessibility compliance
    - Test color contrast validation
    - Test keyboard navigation
    - Test screen reader compatibility
    - Test focus indicators
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ]\* 15. Performance testing and optimization
  - [ ]\* 15.1 Test CSS generation performance
    - Measure generation time (target < 50ms)
    - Test cache effectiveness
    - Measure cache hit rate
    - _Requirements: 8.3_

  - [ ]\* 15.2 Test login page load time
    - Test with custom logo
    - Test with background image
    - Test with glassmorphism
    - Measure total load time (target < 2s)
    - _Requirements: 8.3_

  - [ ]\* 15.3 Optimize file uploads
    - Test upload time for 2MB file
    - Test SVG sanitization time
    - Optimize image processing if needed
    - _Requirements: 6.1_

- [ ]\* 16. Browser compatibility testing
  - [ ]\* 16.1 Test in modern browsers
    - Test in Chrome (latest 2 versions)
    - Test in Firefox (latest 2 versions)
    - Test in Safari (latest 2 versions)
    - Test in Edge (latest 2 versions)
    - _Requirements: 8.1_

  - [ ]\* 16.2 Test glassmorphism fallbacks
    - Test backdrop-filter support detection
    - Verify fallback for unsupported browsers
    - Test gradient fallbacks
    - _Requirements: 3.4_

- [x] 17. Documentation and cleanup
  - [x] 17.1 Add inline code documentation
    - Document all new methods with PHPDoc
    - Add parameter descriptions
    - Add return value descriptions
    - Add security notes
    - _Requirements: All_

  - [x] 17.2 Update user documentation
    - Create user guide for login customization
    - Add screenshots of admin interface
    - Document each setting option
    - Add troubleshooting section
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]\* 17.3 Create video tutorial (optional)
    - Record walkthrough of feature
    - Show common customization scenarios
    - Demonstrate file uploads
    - Show preview functionality
    - _Requirements: 7.4_

## Implementation Notes

### Execution Order

Tasks should be executed in the following order for optimal development flow:

1. **Foundation (Tasks 1-3)**: Settings structure, validation, and SVG sanitization
2. **File Uploads (Tasks 4-5)**: AJAX handlers for logo and background uploads
3. **CSS Generation (Task 6)**: All CSS generation methods
4. **Integration (Tasks 7-8)**: WordPress hooks and cache management
5. **Admin Interface (Tasks 9-10)**: UI and JavaScript
6. **Quality Assurance (Tasks 11-16)**: Accessibility, error handling, testing
7. **Finalization (Task 17)**: Documentation and cleanup

### Dependencies

- Task 2 depends on Task 1 (settings structure must exist before validation)
- Task 4 depends on Task 3 (SVG sanitization needed for logo upload)
- Task 6 depends on Task 1 (CSS generation needs settings structure)
- Task 7 depends on Task 6 (hooks need CSS generation methods)
- Task 8 depends on Task 7 (cache management needs injection methods)
- Task 10 depends on Tasks 4-5 (JavaScript needs AJAX handlers)
- Task 11 depends on Task 9 (accessibility features need UI)
- Tasks 14-16 depend on all previous tasks (testing needs complete implementation)

### Testing Strategy

- Unit tests (marked with \*) are optional but recommended for core functionality
- Integration tests should be run after each major task completion
- Manual testing should be performed on actual WordPress login page
- Security testing is critical and should not be skipped

### Performance Targets

- CSS generation: < 50ms
- File upload: < 3s for 2MB file
- Login page load: < 2s total
- Cache hit rate: > 90%

### Security Checklist

- [ ] All AJAX handlers verify nonces
- [ ] All AJAX handlers check user capabilities
- [ ] All file uploads validate type and size
- [ ] SVG files are sanitized
- [ ] All user inputs are sanitized
- [ ] All outputs are escaped
- [ ] SQL injection prevention (N/A - no direct queries)
- [ ] XSS prevention in footer text and custom CSS
