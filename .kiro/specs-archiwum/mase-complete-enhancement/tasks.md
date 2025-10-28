# Implementation Plan

## Task Overview

This implementation plan contains only the remaining tasks needed to complete the MASE enhancement. Tasks already implemented have been removed. Each task builds incrementally and includes specific file references and requirements.

---

## Phase 1: Settings Persistence System ✅ COMPLETED

- [x] 1. Fix Settings Validation Logic - COMPLETED: Selective validation implemented in `includes/class-mase-settings.php`

- [x] 2. Fix AJAX Handler for Settings Save - COMPLETED: `handle_ajax_save_settings()` fully implemented in `includes/class-mase-admin.php`

- [x] 3. Fix JavaScript Form Submission - COMPLETED: `saveSettings()` method working in `assets/js/mase-admin.js`

---

## Phase 2: Live Preview System ✅ COMPLETED

- [x] 4. Create Live Preview Module Structure - COMPLETED: `livePreview` module exists in `assets/js/mase-admin.js`

- [x] 5. Implement Height Mode Live Preview - COMPLETED: `updateHeightMode()` method implemented

- [x] 6. Implement Live Preview Event Binding - COMPLETED: Event binding operational for all controls

---

## Phase 3: Content Tab ✅ COMPLETED

- [x] 7. Create Content Tab Template - COMPLETED: `includes/templates/content-tab.php` exists with full UI

- [x] 8. Implement Content Tab JavaScript - COMPLETED: `MASE.contentManager` module implemented

- [x] 9. Implement Content Preview Updates - COMPLETED: Live preview working for content controls

---

## Phase 4: Universal Button System

- [x] 10. Implement Button Controls UI

Complete the Universal Buttons tab with all necessary controls for each button type and state.

- Verify button type/state tabs exist in `includes/admin-settings-page.php` (already present)
- Add control panels for each button type (primary, secondary, danger, success, ghost, tabs)
- For each state (normal, hover, active, focus, disabled), add controls:
  - Background type selector (solid/gradient)
  - Background color picker
  - Text color picker
  - Border width, color, radius controls
  - Padding (horizontal/vertical) sliders
  - Font size and weight controls
- Add preview button for each type showing current styling
- Use data attributes `data-button-type` and `data-button-state` on all controls
- _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 11. Implement Button Manager JavaScript Module

Create the JavaScript module to handle button styling and preview.

- Create `buttonManager` object in `assets/js/mase-admin.js`
- Implement `init()` method to initialize button controls
- Implement `initTypeSelector()` to handle button type tab switching
- Implement `initStateSelector()` to handle button state tab switching
- Implement `collectButtonProperties(type, state)` to gather all control values
- Implement `updateButtonPreview(type, state)` to update preview button appearance
- Implement `getButtonSelectors(type)` to map types to WordPress CSS selectors:
  - primary: `.button-primary`, `.wp-core-ui .button-primary`
  - secondary: `.button`, `.button-secondary`, `.wp-core-ui .button`
  - danger: `.button.delete`, `.button-link-delete`
  - success: `.button.button-primary.button-hero`
  - ghost: `.button-link`
  - tabs: `.nav-tab`, `.wp-filter .filter-links li a`
- When live preview enabled, inject CSS for all matching buttons in admin
- _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 15.1, 15.2, 15.3, 15.4, 15.5, 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

---

## Phase 5: CSS Generation

- [x] 12. Complete Universal Buttons CSS Generation

The method exists but needs full implementation for all button types and states.

- Complete `generate_universal_buttons_css()` in `includes/class-mase-css-generator.php`
- Implement `generate_button_state_css($type, $state, $settings)` helper method
- Implement `get_button_selectors($type)` method (same mapping as JavaScript)
- Implement `get_button_pseudo_class($state)` method to map states to CSS pseudo-classes:
  - normal: '' (no pseudo-class)
  - hover: ':hover'
  - active: ':active'
  - focus: ':focus'
  - disabled: ':disabled'
- Generate CSS for all properties: background, text color, border, padding, typography
- Support both solid colors and gradient backgrounds
- Include transition properties for smooth state changes
- _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 13. Complete Content CSS Generation

The method exists but needs full implementation.

- Complete `generate_content_css()` in `includes/class-mase-css-generator.php`
- Generate typography CSS targeting `.wrap` elements:
  - font-size, font-family, line-height
- Generate color CSS:
  - Text color for `.wrap`, `.wrap p`, `.wrap div`
  - Link color for `.wrap a`
  - Heading color for `.wrap h1, .wrap h2, .wrap h3, .wrap h4, .wrap h5, .wrap h6`
- Generate spacing CSS:
  - Paragraph margins for `.wrap p`
  - Heading margins for `.wrap h1, .wrap h2, .wrap h3, .wrap h4, .wrap h5, .wrap h6`
- _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 14. Integrate CSS Generation Methods

Ensure new CSS generation methods are called from main CSS generation.

- Verify `generate_css_internal()` in `includes/class-mase-css-generator.php` calls:
  - `generate_universal_buttons_css($settings)`
  - `generate_content_css($settings)`
- Ensure proper concatenation of all CSS sections
- Verify existing CSS generation (admin bar, admin menu, backgrounds, login) still works
- _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

---

## Phase 6: Background System Enhancements

- [x] 15. Implement Background Live Preview

Add live preview for background changes (if not already implemented).

- Check if `updateBackgroundPreview(area, settings)` exists in livePreview module
- If not, implement method to generate CSS for backgrounds:
  - Image backgrounds: url, position, size, repeat, opacity
  - Gradient backgrounds: use `buildGradientCSS()` helper
  - Clear backgrounds: remove background styling
- Implement `getBackgroundSelector(area)` to map areas to selectors:
  - dashboard: `.wrap`
  - admin_menu: `#adminmenuwrap`
  - post_lists: `.wp-list-table`
  - post_editor: `#post-body`
  - widgets: `.widgets-holder-wrap`
  - login: `body.login`
- _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 16. Implement Gradient CSS Builder

Create helper method for gradient CSS generation.

- Implement `buildGradientCSS(colors, type, angle)` in livePreview module
- Support linear gradients with angle parameter
- Support radial gradients
- Format color stops with positions: `color position%`
- Return complete CSS gradient value: `linear-gradient(angle, stops)` or `radial-gradient(stops)`
- _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

---

## Phase 7: Debugging System

- [x] 17. Create Debug Logger Module

Add comprehensive debugging tools to JavaScript.

- Create `MASE_DEBUG` object at top of `assets/js/mase-admin.js` (before MASE object)
- Implement `log(message, data)` method with console.log output prefixed with `[MASE DEBUG]`
- Implement `error(message, error)` method with console.error and stack trace
- Implement `ajax(action, data, response)` method with grouped console output
- Implement `settings(section, values)` method to log settings changes
- Add `enabled` flag (default true) to control debug output
- All methods should check `enabled` flag before outputting
- _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 18. Integrate Debug Logging

Use debug logger throughout JavaScript code.

- Replace existing `console.log` calls with `MASE_DEBUG.log`
- Replace existing `console.error` calls with `MASE_DEBUG.error`
- Add `MASE_DEBUG.ajax` calls in all AJAX success/error handlers
- Add `MASE_DEBUG.settings` calls when settings change
- Log live preview updates with `MASE_DEBUG.log`
- Log state changes (live preview enabled/disabled, tab switches)
- _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 19. Enhance PHP Error Logging

Verify and enhance error logging in PHP AJAX handlers.

- Verify all AJAX handlers have try-catch blocks
- Ensure `error_log()` is used when WP_DEBUG is enabled
- Log request data for debugging (sanitized)
- Log validation errors with field names and messages
- Log exception messages and traces
- Ensure user-friendly error messages in JSON responses (don't expose internal details)
- _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

---

## Phase 8: Performance Optimization

- [x] 20. Implement CSS Caching

Add caching to CSS generation to improve performance.

- Modify `inject_custom_css()` in `includes/class-mase-admin.php`
- Check cache for generated CSS before generating: `MASE_CacheManager::get('mase_generated_css')`
- If cached CSS exists, output it and return
- If not cached, generate CSS and cache it: `MASE_CacheManager::set('mase_generated_css', $css, 3600)`
- Ensure cache is invalidated in `update_option()` method of `MASE_Settings`
- _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [x] 21. Implement Live Preview Debouncing

Add debouncing to limit preview updates during rapid changes.

- Add `debounceTimers` object to livePreview module
- Implement `updateWithDebounce(key, callback, delay)` method
- Use `setTimeout` and `clearTimeout` to debounce updates
- Apply debouncing to range slider input events (300ms delay)
- Apply debouncing to color picker changes (300ms delay)
- Use configurable delay from `MASE.config.debounceDelay` (default 300ms)
- _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

---

## Phase 9: Testing and Documentation

- [x] 22. Add Code Documentation

Document all new code with clear comments.

- Add PHPDoc blocks to all new PHP methods (button CSS generation, content CSS generation)
- Add JSDoc blocks to all new JavaScript methods (buttonManager, debug logger)
- Document complex logic with inline comments
- Document security measures (nonce verification, sanitization)
- Document performance optimizations (caching, debouncing)
- _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7_

- [x] 23. Verify WordPress Standards Compliance

Ensure all new code follows WordPress coding standards.

- Verify all inputs are sanitized (button settings, content settings)
- Verify all outputs are escaped (button preview, content preview)
- Verify nonces are used for all AJAX requests
- Verify capability checks are in place
- Verify internationalization functions are used for all user-facing text
- Run PHP_CodeSniffer with WordPress ruleset on modified files
- _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7_

---

## Notes

**Completed Phases:**

- Phase 1: Settings Persistence System ✅
- Phase 2: Live Preview System ✅
- Phase 3: Content Tab ✅

**Remaining Work:**

- Phase 4: Universal Button System (UI + JavaScript)
- Phase 5: CSS Generation (Complete button & content CSS)
- Phase 6: Background System Enhancements (Live preview)
- Phase 7: Debugging System (Debug logger)
- Phase 8: Performance Optimization (Caching & debouncing)
- Phase 9: Testing and Documentation

**Testing:** All testing tasks (22-26 from original plan) should be performed after implementation is complete, not as separate implementation tasks.
