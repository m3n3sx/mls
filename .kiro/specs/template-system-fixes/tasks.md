# Implementation Plan

- [x] 1. Add thumbnail generation to template data

  - Implement `generate_template_thumbnail()` method in `class-mase-settings.php`
  - Update `get_all_templates()` to include thumbnails for each template
  - Extract primary color from each template's palette settings
  - Generate SVG thumbnails with template name and color
  - Encode thumbnails as base64 data URIs
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 1.1 Create `generate_template_thumbnail()` method

  - Write private method in `MASE_Settings` class
  - Accept `$name` and `$color` parameters
  - Sanitize color input (remove #, validate hex format)
  - Escape template name to prevent XSS
  - Generate 300x200px SVG with colored background
  - Add centered white text with template name
  - Apply text shadow for better contrast
  - Encode SVG as base64 data URI
  - Return data URI string
  - _Requirements: 1.2, 1.3, 1.4, 5.2, 5.3, 5.4, 5.5_

- [x] 1.2 Update `get_all_templates()` to add thumbnails

  - Locate `get_all_templates()` method around line 2422
  - For each template in the array, add thumbnail generation call
  - Extract primary color from template's palette settings
  - Call `generate_template_thumbnail()` with template name and color
  - Assign returned data URI to `thumbnail` property
  - Verify all 11 templates receive thumbnails
  - _Requirements: 1.1, 1.5, 5.1_

- [x] 2. Fix HTML attributes for JavaScript compatibility

  - Update template card HTML in `admin-settings-page.php`
  - Add `data-template` attribute as primary identifier
  - Keep `data-template-id` for backward compatibility
  - Add `role="article"` for accessibility
  - Add `aria-label` with template name
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2.1 Update template card div attributes

  - Locate template card div around line 1666 in `admin-settings-page.php`
  - Add `data-template="<?php echo esc_attr($template_id); ?>"`
  - Keep existing `data-template-id` attribute
  - Add `role="article"`
  - Add `aria-label="<?php echo esc_attr($template['name']); ?>"`
  - Verify proper escaping for security
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Implement JavaScript Apply button handler

  - Add `handleTemplateApply()` method to `MASEAdmin` object in `mase-admin.js`
  - Implement confirmation dialog with settings details
  - Send AJAX request to apply template
  - Handle success with notification and page reload
  - Handle errors with notification and button restoration
  - Register event handler in `bindEvents()` method
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 6.2, 6.3, 6.4, 8.1, 8.2, 8.3, 8.4, 10.5_

- [x] 3.1 Create `handleTemplateApply()` method

  - Add method to `MASEAdmin` object (around line 400)
  - Prevent default event and stop propagation
  - Get button element and parent card
  - Read `data-template` attribute from card
  - Validate template ID exists (log error if missing)
  - Get template name from card for confirmation
  - Log template apply action to console
  - _Requirements: 2.1, 3.5, 8.1, 8.4_

- [x] 3.2 Implement confirmation dialog

  - Build confirmation message with template name
  - List affected settings (colors, typography, visual effects)
  - Add warning that action cannot be undone
  - Show native confirm() dialog
  - Return early if user cancels
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 3.3 Implement loading state

  - Disable Apply button immediately after confirmation
  - Change button text to "Applying..."
  - Set card opacity to 0.6
  - _Requirements: 2.5, 8.1, 8.2_

- [x] 3.4 Implement AJAX request

  - Build AJAX request to `ajaxurl`
  - Set action to `mase_apply_template`
  - Include nonce from `$('#mase_nonce').val()`
  - Include template_id parameter
  - Log AJAX request data to console
  - _Requirements: 2.2, 2.4, 8.3_

- [x] 3.5 Implement success handler

  - Log successful response to console
  - Show success notification with template name
  - Set timeout to reload page after 1 second
  - _Requirements: 2.3, 8.2_

- [x] 3.6 Implement error handler

  - Log error details to console
  - Parse error message from response
  - Show error notification with message
  - Restore button state (enable, original text)
  - Restore card opacity to 1
  - _Requirements: 2.5, 8.3, 10.5_

- [x] 3.7 Register event handler

  - Add event binding in `bindEvents()` method
  - Use delegated event: `$(document).on('click', '.mase-template-apply', ...)`
  - Bind `this` context with `.bind(this)`
  - _Requirements: 2.1_

- [x] 4. Create PHP AJAX handler for template application

  - Add `ajax_apply_template()` method to `MASE_Admin` class
  - Verify nonce and user capabilities
  - Validate and sanitize template ID
  - Get template data and validate existence
  - Apply template via settings manager
  - Invalidate CSS cache
  - Return success response with template info
  - Handle all error cases with appropriate HTTP status codes
  - Register AJAX hook in constructor
  - _Requirements: 2.4, 7.1, 7.2, 7.3, 7.4, 7.5, 10.1, 10.2, 10.3, 10.4_

- [x] 4.1 Create `ajax_apply_template()` method

  - Add public method to `MASE_Admin` class
  - Add PHPDoc comment with description and @since tag
  - Verify nonce with `check_ajax_referer('mase_save_settings', 'nonce')`
  - Check user capability with `current_user_can('manage_options')`
  - Return 403 error if permission denied
  - _Requirements: 7.2, 7.3, 10.3_

- [x] 4.2 Validate template ID input

  - Get template_id from `$_POST['template_id']`
  - Sanitize with `sanitize_text_field()`
  - Check if empty
  - Return 400 error if missing
  - _Requirements: 7.1, 10.1_

- [x] 4.3 Get and validate template data

  - Call `$this->settings->get_template($template_id)`
  - Check if result is `WP_Error` or false
  - Return 404 error if template not found
  - Extract error message if `WP_Error`
  - _Requirements: 7.4, 10.2_

- [x] 4.4 Apply template and handle result

  - Call `$this->settings->apply_template($template_id)`
  - Check if result is `WP_Error`
  - Return 500 error if application fails
  - Extract error message from `WP_Error`
  - _Requirements: 2.4, 7.4, 10.4_

- [x] 4.5 Invalidate cache and return success

  - Call `$this->cache->invalidate('generated_css')`
  - Build success response array with message, template_id, template_name
  - Call `wp_send_json_success()` with response data
  - _Requirements: 7.5_

- [x] 4.6 Register AJAX hook

  - Add hook registration in `MASE_Admin` constructor
  - Use `add_action('wp_ajax_mase_apply_template', array($this, 'ajax_apply_template'))`
  - Place near other template AJAX hooks (around line 43)
  - _Requirements: 7.1_

- [x] 5. Optimize CSS for compact gallery layout

  - Update `mase-templates.css` to reduce gallery size
  - Change grid from 4 columns to 3 columns
  - Reduce card dimensions and spacing
  - Limit thumbnail height to 150px
  - Compact card body padding
  - Reduce typography sizes
  - Limit description to 2 lines with ellipsis
  - Hide features list
  - Add responsive breakpoints
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 5.1 Update gallery grid layout

  - Locate `.mase-template-gallery` styles (around line 50)
  - Change `grid-template-columns` from `repeat(4, 1fr)` to `repeat(3, 1fr)`
  - Reduce `gap` from 24px to 20px
  - _Requirements: 4.1, 9.1_

- [x] 5.2 Add responsive breakpoints

  - Add `@media (max-width: 1400px)` with 2 columns
  - Add `@media (max-width: 900px)` with 1 column
  - _Requirements: 4.2, 9.2_

- [x] 5.3 Reduce card dimensions

  - Add `max-height: 420px` to `.mase-template-card`
  - Add `overflow: hidden` to prevent content overflow
  - _Requirements: 4.3, 9.3_

- [x] 5.4 Reduce thumbnail height

  - Change `.mase-template-thumbnail` height from 200px to 150px
  - Keep `width: 100%` and `object-fit: cover`
  - _Requirements: 4.4, 9.4_

- [x] 5.5 Compact card body and typography

  - Reduce `.mase-template-card-body` padding from 20px to 16px
  - Reduce `.mase-template-name` font-size from 18px to 16px
  - Reduce `.mase-template-description` font-size from 14px to 13px
  - Reduce description margin-bottom from 16px to 12px
  - _Requirements: 4.5, 9.5_

- [x] 5.6 Limit description text

  - Add `display: -webkit-box` to `.mase-template-description`
  - Add `-webkit-line-clamp: 2`
  - Add `-webkit-box-orient: vertical`
  - Add `overflow: hidden`
  - _Requirements: 4.5, 9.5_

- [x] 5.7 Hide features list

  - Add `.mase-template-features { display: none; }`
  - _Requirements: 9.5_

- [x] 6. Test thumbnail generation and display

  - Verify all templates have thumbnails in PHP
  - Check thumbnail data URIs are valid base64 SVG
  - Verify thumbnails display correctly in browser
  - Test with different template colors
  - Verify no placeholder icons are visible
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 6.1 Test SVG generation

  - Call `generate_template_thumbnail()` with test data
  - Verify output starts with `data:image/svg+xml;base64,`
  - Decode base64 and verify SVG structure
  - Test with special characters in name (XSS prevention)
  - Test with invalid color formats
  - _Requirements: 1.2, 1.3, 1.4, 5.5_

- [x] 6.2 Test thumbnail display in UI

  - Navigate to Templates tab in WordPress admin
  - Verify all 11 templates show thumbnails
  - Verify no placeholder icons visible
  - Verify thumbnail colors match template palettes
  - Verify template names are readable on thumbnails
  - _Requirements: 1.1, 1.5_

- [x] 7. Test Apply button functionality

  - Click Apply button on a template
  - Verify confirmation dialog appears
  - Verify dialog shows correct template name
  - Test canceling confirmation
  - Test confirming and applying template
  - Verify success notification appears
  - Verify page reloads
  - Verify template is marked as active
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 6.2, 6.3_

- [x] 7.1 Test confirmation dialog

  - Click Apply button
  - Verify dialog shows template name
  - Verify dialog lists affected settings
  - Verify warning about irreversibility
  - Click Cancel and verify operation aborts
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 7.2 Test successful application

  - Click Apply and confirm
  - Verify button disables and shows "Applying..."
  - Verify card opacity reduces
  - Verify success notification appears
  - Verify page reloads after 1 second
  - Verify template is marked as active after reload
  - _Requirements: 2.3, 2.5, 8.1, 8.2_

- [x] 7.3 Test error handling

  - Simulate network error (disconnect network)
  - Click Apply and confirm
  - Verify error notification appears
  - Verify button returns to normal state
  - Verify card opacity returns to 1
  - _Requirements: 2.5, 8.3, 10.5_

- [x] 8. Test gallery layout and responsiveness

  - View gallery on desktop (1920px width)
  - Verify 3 columns display
  - View gallery on tablet (1024px width)
  - Verify 2 columns display
  - View gallery on mobile (375px width)
  - Verify 1 column displays
  - Verify cards are compact and properly sized
  - Verify description text truncates to 2 lines
  - Verify features list is hidden
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 8.1 Test desktop layout

  - Set browser width to 1920px
  - Verify 3 template cards per row
  - Verify gap between cards is 20px
  - Verify cards are properly aligned
  - _Requirements: 4.1, 9.1_

- [x] 8.2 Test tablet layout

  - Set browser width to 1024px
  - Verify 2 template cards per row
  - Verify responsive breakpoint triggers correctly
  - _Requirements: 4.2, 9.2_

- [x] 8.3 Test mobile layout

  - Set browser width to 375px
  - Verify 1 template card per row
  - Verify cards stack vertically
  - Verify touch targets are adequate (44px minimum)
  - _Requirements: 4.2, 9.2_

- [x] 8.4 Test card compactness

  - Measure card height (should be ≤420px)
  - Verify thumbnail height is 150px
  - Verify description truncates to 2 lines
  - Verify features list is not visible
  - _Requirements: 4.3, 4.4, 4.5, 9.3, 9.4, 9.5_

- [x] 9. Test accessibility and keyboard navigation

  - Test keyboard navigation with Tab key
  - Test Apply button activation with Enter/Space
  - Verify focus indicators are visible
  - Test with screen reader
  - Verify ARIA attributes are present
  - _Requirements: 3.3, 3.4_

- [x] 9.1 Test keyboard navigation

  - Press Tab to navigate between template cards
  - Verify focus moves to each card
  - Verify focus indicators are visible (outline)
  - Press Enter on focused card
  - Verify Apply button activates
  - _Requirements: 3.3, 3.4_

- [x] 9.2 Test screen reader support

  - Enable screen reader (NVDA, JAWS, or VoiceOver)
  - Navigate to Templates tab
  - Verify template names are announced
  - Verify role="article" is recognized
  - Verify aria-label provides context
  - _Requirements: 3.3, 3.4_

- [x] 10. Test security and error handling

  - Test with invalid nonce
  - Test with insufficient permissions
  - Test with missing template ID
  - Test with non-existent template
  - Verify appropriate error messages
  - Verify console logs show debug information
  - _Requirements: 7.2, 7.3, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 10.1 Test nonce verification

  - Modify nonce value in browser console
  - Click Apply button
  - Verify 403 error response
  - Verify error notification appears
  - _Requirements: 7.2, 10.3_

- [x] 10.2 Test permission check

  - Test as user without manage_options capability
  - Click Apply button
  - Verify 403 error response
  - Verify "Insufficient permissions" message
  - _Requirements: 7.3, 10.3_

- [x] 10.3 Test invalid template ID

  - Modify data-template attribute to invalid value
  - Click Apply button
  - Verify 404 error response
  - Verify "Template not found" message
  - _Requirements: 10.2_

- [x] 10.4 Test console logging

  - Open browser console
  - Click Apply button
  - Verify template ID is logged
  - Verify AJAX request data is logged
  - Verify AJAX response is logged
  - _Requirements: 8.1, 8.3, 8.4_

- [x] 11. Cross-browser compatibility testing

  - Test in Chrome (latest version)
  - Test in Firefox (latest version)
  - Test in Safari (latest version)
  - Test in Edge (latest version)
  - Verify all functionality works consistently
  - Verify CSS renders correctly
  - Verify no JavaScript errors
  - _Requirements: All_

- [x] 11.1 Test in Chrome

  - Navigate to Templates tab
  - Test Apply button functionality
  - Verify thumbnails display correctly
  - Verify gallery layout is correct
  - Check console for errors
  - _Requirements: All_

- [x] 11.2 Test in Firefox

  - Navigate to Templates tab
  - Test Apply button functionality
  - Verify thumbnails display correctly
  - Verify gallery layout is correct
  - Check console for errors
  - _Requirements: All_

- [x] 11.3 Test in Safari

  - Navigate to Templates tab
  - Test Apply button functionality
  - Verify thumbnails display correctly
  - Verify gallery layout is correct
  - Check console for errors
  - _Requirements: All_
