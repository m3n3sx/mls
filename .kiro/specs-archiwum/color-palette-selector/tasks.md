# Implementation Plan

- [x] 1. Create base palette selector structure

  - Add new section comment in mase-admin.css for "Color Palette Selector"
  - Create `.mase-palette-selector` container styles
  - Create `.mase-palette-grid` with CSS Grid layout for desktop (5 columns)
  - Set grid gap to 16px using var(--mase-space-base)
  - Add margin spacing using var(--mase-space-xl)
  - _Requirements: 1.1, 1.5_

- [x] 2. Implement palette card base styles

  - Create `.mase-palette-card` with flexbox column layout
  - Apply white background using var(--mase-surface)
  - Add 1px solid border using #e5e7eb (var(--mase-border-light))
  - Set border-radius to 8px using var(--mase-radius-lg)
  - Apply 16px padding using var(--mase-space-base)
  - Add box-shadow using var(--mase-shadow-base)
  - Set transition to all 200ms ease using var(--mase-transition-base)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Create palette card header layout

  - Create `.mase-palette-card-header` with flexbox layout
  - Set justify-content to space-between
  - Set align-items to center
  - Add margin-bottom of 12px using var(--mase-space-md)
  - Set min-height to 24px for badge alignment
  - _Requirements: 2.1_

- [x] 4. Style palette name text

  - Create `.mase-palette-name` styles
  - Set font-size to 14px using var(--mase-font-size-base)
  - Set font-weight to 600 using var(--mase-font-weight-semibold)
  - Apply color using var(--mase-text)
  - Set line-height to 1.4
  - Add flex: 1 for proper spacing
  - Add text overflow handling (ellipsis after 2 lines)
  - _Requirements: 2.1_

- [x] 5. Create active badge styles

  - Create `.mase-palette-badge` with inline-flex display
  - Set padding to 4px 8px using var(--mase-space-xs) and var(--mase-space-sm)
  - Apply background color using var(--mase-primary)
  - Set text color to white
  - Set font-size to 11px using var(--mase-font-size-xs)
  - Set font-weight to 600 using var(--mase-font-weight-semibold)
  - Apply border-radius of 4px using var(--mase-radius-base)
  - Add text-transform: uppercase
  - Add letter-spacing: 0.5px
  - _Requirements: 5.1, 5.4, 5.5_

- [x] 6. Implement color preview container

  - Create `.mase-palette-colors` with flexbox layout
  - Set justify-content to center
  - Set align-items to center
  - Add gap of 4px using var(--mase-space-xs)
  - Set padding to 12px 0 using var(--mase-space-md)
  - Add flex-wrap: wrap for responsiveness
  - _Requirements: 2.2, 2.5_

- [x] 7. Style individual color circles

  - Create `.mase-palette-color` styles
  - Set width and height to 40px
  - Apply border-radius: 50% using var(--mase-radius-full)
  - Add 2px solid white border
  - Apply box-shadow using var(--mase-shadow-sm)
  - Set display to inline-block
  - Add flex-shrink: 0
  - Set transition for transform using var(--mase-transition-base)
  - _Requirements: 2.3, 2.4_

- [x] 8. Create apply button styles

  - Create `.mase-palette-apply-btn` styles
  - Set width to 100%
  - Apply padding of 8px 16px using var(--mase-space-sm) and var(--mase-space-base)
  - Set background to var(--mase-primary)
  - Set color to white
  - Remove border
  - Apply border-radius of 4px using var(--mase-radius-base)
  - Set font-size to 14px using var(--mase-font-size-base)
  - Set font-weight to 500 using var(--mase-font-weight-medium)
  - Add cursor: pointer
  - Set transition using var(--mase-transition-base)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9. Implement hover states

  - Add `.mase-palette-card:hover` with increased box-shadow (0 4px 12px rgba(0,0,0,0.15))
  - Add transform: translateY(-2px) to card hover
  - Add `.mase-palette-color:hover` with transform: scale(1.1)
  - Add increased box-shadow to color circle hover
  - Add `.mase-palette-apply-btn:hover` with background var(--mase-primary-hover)
  - Add transform: translateY(-1px) to button hover
  - Add box-shadow to button hover
  - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [x] 10. Create active card state styles

  - Add `.mase-palette-card.active` with 2px solid border using var(--mase-primary)
  - Apply background color #f0f6fc to active cards
  - Add enhanced box-shadow with primary color tint
  - Show `.mase-palette-badge` only on active cards
  - _Requirements: 5.2, 5.3_

- [x] 11. Implement focus states for accessibility

  - Add `.mase-palette-apply-btn:focus` with 2px outline using var(--mase-primary)
  - Set outline-offset to 2px
  - Add `.mase-palette-card:focus-within` for keyboard navigation
  - Ensure focus indicators are visible and meet WCAG standards
  - _Requirements: 4.3, 6.3_

- [x] 12. Create tablet responsive styles (768px-1024px)

  - Add media query for tablet breakpoint
  - Change grid to 3 columns using grid-template-columns
  - Maintain all other card styles
  - _Requirements: 1.3_

- [x] 13. Create mobile responsive styles (<768px)

  - Add media query for mobile breakpoint
  - Change grid to 2 columns using grid-template-columns
  - Reduce card padding to 12px
  - Reduce color circle size to 32px width and height
  - Reduce palette name font-size to 13px using var(--mase-font-size-sm)
  - Ensure touch targets remain at least 44px for buttons
  - _Requirements: 1.4, 7.1, 7.2, 7.3, 7.5_

- [x] 14. Add reduced motion support

  - Add @media (prefers-reduced-motion: reduce) query
  - Remove transform animations from hover states
  - Set transition-duration to 0.01ms for all palette elements
  - Maintain layout without animations
  - _Requirements: 7.4_

- [x] 15. Create disabled button state

  - Add `.mase-palette-apply-btn:disabled` styles
  - Set background to var(--mase-border)
  - Add cursor: not-allowed
  - Set opacity to 0.6
  - Remove hover effects when disabled
  - _Requirements: 6.3_

- [x] 16. Add CSS comments and documentation

  - Add section header comment for palette selector
  - Document each component with inline comments
  - Add comments for responsive breakpoints
  - Document color values and their purposes
  - Add usage examples in comments
  - _Requirements: All_

- [x] 17. Create HTML example template

  - Create example HTML structure showing all 10 palettes
  - Include proper data attributes for palette IDs
  - Show active state example
  - Include inline color styles for each palette
  - Add comments explaining structure
  - _Requirements: 8.1-8.10_

- [x] 18. Validate CSS syntax and compatibility
  - Run CSS through validator
  - Check for browser compatibility issues
  - Verify all CSS variables are defined
  - Test fallback values
  - Ensure no syntax errors
  - _Requirements: All_

## Palette Activation Implementation

- [x] 19. Update HTML data attributes in palette cards

  - Open `includes/admin-settings-page.php`
  - Locate palette card rendering (around line 75-90)
  - Add `data-palette` attribute with palette ID value
  - Keep existing `data-palette-id` for backward compatibility
  - Add `role="button"` for accessibility
  - Add `tabindex="0"` to enable keyboard focus
  - Add `aria-label` with translated "Apply [name] palette" text
  - Use `esc_attr()` for all attribute values
  - Use `sprintf()` and `__()` for translatable aria-label
  - _Requirements: 9.2, 19.1, 19.2, 19.3, 19.4, 19.5, 20.1, 20.2, 20.3, 20.4, 20.5_

- [x] 20. Create JavaScript palette click handler

  - [x] 20.1 Add handlePaletteClick method to MASEAdmin object

    - Open `assets/js/mase-admin.js`
    - Add method after existing methods (around line 300)
    - Extract palette ID from `data-palette` attribute
    - Extract palette name from `.mase-palette-name` element
    - Validate palette ID exists, log error if missing
    - Check if palette is already active, return early if true
    - Log palette click to console for debugging
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 20.2 Implement confirmation dialog

    - Use browser `confirm()` function
    - Include palette name in confirmation message
    - Include explanation that colors will update immediately
    - Return early if user cancels
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 20.3 Implement optimistic UI update

    - Store reference to currently active palette card
    - Store current palette ID for rollback
    - Remove `active` class from all palette cards
    - Add `active` class to clicked card
    - Find Apply button within card
    - Store original button text
    - Disable button and change text to "Applying..."
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 20.4 Implement AJAX request

    - Use jQuery `$.ajax()` method
    - Set URL to `ajaxurl` global variable
    - Set type to 'POST'
    - Include action: 'mase_apply_palette'
    - Include nonce from `#mase_nonce` field value
    - Include palette_id parameter
    - Set timeout to 30 seconds
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 20.5 Implement success handler

    - Log success response to console
    - Call `showNotice()` with success message including palette name
    - Update `MASEAdmin.config.currentPalette` with new palette ID
    - Trigger live preview update if `config.livePreviewEnabled` is true
    - Restore button enabled state and original text
    - _Requirements: 13.1, 13.2, 13.5_

  - [x] 20.6 Implement error handler
    - Log error details to console
    - Call `showNotice()` with error message
    - Remove `active` class from newly selected card
    - Restore `active` class to previously active card using stored ID
    - Restore button enabled state and original text
    - _Requirements: 13.3, 13.4, 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 21. Add keyboard navigation support

  - Add `handlePaletteKeydown` method to MASEAdmin object
  - Check if key is Enter or Space
  - Prevent default browser behavior
  - Call `handlePaletteClick` with event
  - _Requirements: 9.5_

- [x] 22. Create notification display method

  - Add `showNotice` method to MASEAdmin object
  - Accept message and type ('success' or 'error') parameters
  - Create div with classes `mase-notice` and `mase-notice-{type}`
  - Set text content to message
  - Append to `.mase-settings-container`
  - For success type, auto-dismiss after 3 seconds with fade out
  - Remove element from DOM after fade completes
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 23. Register event handlers

  - Open `assets/js/mase-admin.js`
  - Locate `bindEvents` method (around line 100)
  - Add event delegation for palette card clicks using `$(document).on('click', '.mase-palette-card', ...)`
  - Bind to `handlePaletteClick` method with proper context
  - Add event delegation for palette card keydown
  - Bind to `handlePaletteKeydown` method with proper context
  - _Requirements: 9.1, 9.5_

- [x] 24. Create PHP AJAX handler method

  - [x] 24.1 Add ajax_apply_palette method to MASE_Admin class

    - Open `includes/class-mase-admin.php`
    - Add method after existing methods (around line 200)
    - Add PHPDoc comment with description and @since tag
    - _Requirements: 18.3_

  - [x] 24.2 Implement security validation

    - Call `check_ajax_referer('mase_save_settings', 'nonce')`
    - Check `current_user_can('manage_options')`
    - Return 403 error with `wp_send_json_error()` if capability check fails
    - Include error message using `__()` for translation
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 24.3 Implement input validation

    - Get palette_id from `$_POST['palette_id']`
    - Sanitize with `sanitize_text_field()`
    - Check if empty
    - Return 400 error with `wp_send_json_error()` if empty
    - Include error message using `__()` for translation
    - _Requirements: 16.1, 16.2, 16.5_

  - [x] 24.4 Validate palette exists

    - Call `$this->settings->get_palette($palette_id)`
    - Check if result is `WP_Error` using `is_wp_error()`
    - Return 404 error with `wp_send_json_error()` if not found
    - Include error message from WP_Error object
    - _Requirements: 16.3, 16.4_

  - [x] 24.5 Apply palette and clear cache

    - Call `$this->settings->apply_palette($palette_id)`
    - Check if result is `WP_Error`
    - Return 500 error with `wp_send_json_error()` if application fails
    - Call `$this->cache->invalidate('generated_css')`
    - _Requirements: 17.1, 17.2, 17.3_

  - [x] 24.6 Return success response
    - Call `wp_send_json_success()` with data array
    - Include success message using `__()` for translation
    - Include palette_id in response
    - Include palette name from palette data
    - _Requirements: 17.4, 17.5_

- [x] 25. Register AJAX action hook

  - Open `includes/class-mase-admin.php`
  - Locate constructor method (around line 50)
  - Add `add_action('wp_ajax_mase_apply_palette', array($this, 'ajax_apply_palette'))`
  - Place with other action hooks
  - Do not add `wp_ajax_nopriv` hook (authenticated users only)
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [x] 26. Add Settings class methods (if not existing)

  - [x] 26.1 Add get_palette method

    - Open `includes/class-mase-settings.php`
    - Check if `get_palette` method exists
    - If not, add method that accepts palette_id parameter
    - Call `get_all_palettes()` to retrieve palette list
    - Check if palette_id exists in array
    - Return `WP_Error` if not found
    - Return palette data array if found
    - _Requirements: 16.3, 16.4_

  - [x] 26.2 Add apply_palette method
    - Check if `apply_palette` method exists
    - If not, add method that accepts palette_id parameter
    - Call `get_palette()` to validate palette exists
    - Return error if palette not found
    - Update 'current_palette' setting with palette_id
    - Loop through palette colors and update settings
    - Call `save()` method to persist changes
    - Return result of save operation
    - _Requirements: 17.1_

- [x] 27. Add Cache class invalidate method (if not existing)

  - Open `includes/class-mase-cache.php` or `includes/class-mase-cachemanager.php`
  - Check if `invalidate` method exists
  - If not, add method that accepts cache key parameter
  - Call `delete_transient('mase_' . $key)`
  - Return result of delete operation
  - _Requirements: 17.2_

- [x] 28. Write JavaScript unit tests

  - Create test file `tests/unit/test-palette-activation.test.js`
  - Test handlePaletteClick with valid palette data
  - Test handlePaletteClick with missing palette ID
  - Test handlePaletteClick with already active palette
  - Test handlePaletteClick user cancels confirmation
  - Test AJAX success response handling
  - Test AJAX error response handling
  - Test UI rollback on error
  - Test showNotice with success type
  - Test showNotice with error type
  - Test handlePaletteKeydown with Enter key
  - Test handlePaletteKeydown with Space key
  - _Requirements: All JavaScript requirements_

- [x] 29. Write PHP unit tests

  - Create test file `tests/unit/test-palette-activation.php`
  - Test ajax_apply_palette with valid data
  - Test ajax_apply_palette with invalid nonce
  - Test ajax_apply_palette without manage_options capability
  - Test ajax_apply_palette with missing palette_id
  - Test ajax_apply_palette with empty palette_id
  - Test ajax_apply_palette with non-existent palette
  - Test ajax_apply_palette with palette application failure
  - Test cache invalidation is called
  - Test success response format
  - Test error response formats
  - _Requirements: All PHP requirements_

- [x] 30. Create integration test

  - Create test file `tests/integration/test-palette-activation-flow.php`
  - Set up test WordPress environment
  - Create test user with manage_options capability
  - Render palette selector HTML
  - Simulate palette card click
  - Verify AJAX request is sent with correct data
  - Verify server processes request successfully
  - Verify settings are updated
  - Verify cache is cleared
  - Verify success response is returned
  - Test error scenarios (invalid nonce, missing capability, etc.)
  - _Requirements: All requirements_

- [x] 31. Manual testing checklist
  - Test in Chrome, Firefox, Safari, Edge browsers
  - Test on desktop, tablet, and mobile viewports
  - Test clicking different palette cards
  - Test clicking already active palette (should do nothing)
  - Test canceling confirmation dialog
  - Test with slow network (throttle to 3G)
  - Test keyboard navigation (Tab, Enter, Space)
  - Test with screen reader (NVDA or JAWS)
  - Test error scenarios (disconnect network during request)
  - Verify success notifications appear and auto-dismiss
  - Verify error notifications appear and persist
  - Verify UI rollback on error
  - Verify palette persists after page reload
  - _Requirements: All requirements_
