# Implementation Plan

- [x] 1. Add CSS override rules to fix word-breaking and padding issues
  - Modify `generate_admin_menu_css()` method in `includes/class-mase-css-generator.php`
  - Add CSS rules to reset `word-break`, `overflow-wrap`, `hyphens`, and `-ms-word-break` on `#adminmenu div.wp-menu-name`
  - Add CSS rule to reset padding on `#adminmenu li.menu-top`
  - Place override rules at the beginning of menu CSS generation for proper cascade
  - _Requirements: 1.1, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4_

- [x] 2. Implement conditional padding CSS generation
  - [x] 2.1 Add padding validation helper method
    - Create `validate_menu_padding()` private method in `MASE_CSS_Generator` class
    - Implement range validation (vertical: 0-20px, horizontal: 0-40px)
    - Add logging for out-of-range values
    - Return capped values instead of rejecting
    - _Requirements: 4.1, 4.5_
  
  - [x] 2.2 Modify `generate_menu_item_padding_css()` method
    - Check if `padding_vertical` or `padding_horizontal` settings exist before applying
    - Use validation helper to cap padding values
    - Only generate CSS when padding is explicitly configured
    - Skip CSS generation if padding matches WordPress defaults
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 3. Enhance diagnostic logging for menu CSS generation
  - [x] 3.1 Add logging to `generate_admin_menu_css()` method
    - Log when override CSS is applied
    - Log menu settings being used (padding, colors, width)
    - Log which CSS generation methods are called
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 3.2 Add logging to `generate_menu_item_padding_css()` method
    - Log padding values being applied
    - Log when padding CSS is skipped (not configured)
    - Log validation warnings for out-of-range values
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [ ]* 4. Add unit tests for padding validation
  - Create test file `tests/unit/test-menu-padding-validation.php`
  - Test padding validation with various inputs (0, 10, 25, 50, -5)
  - Test conditional CSS generation (with/without padding settings)
  - Test override CSS is always generated
  - _Requirements: 4.5_

- [ ]* 5. Create visual regression test for menu layout
  - Create test file `tests/e2e/admin-menu-layout-fix.spec.js`
  - Capture baseline screenshot of default WordPress menu
  - Apply MASE styling and capture screenshot
  - Test with various padding values
  - Test in folded and expanded menu states
  - Verify no text wrapping or overflow issues
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5_
