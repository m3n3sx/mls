# Implementation Plan

## Overview

This implementation plan breaks down the dark/light mode toggle feature into discrete, manageable coding tasks. Each task is designed to be completed in a single session and builds incrementally on previous work. Tasks are ordered to establish core functionality first, then add enhancements.

## Task Execution Strategy

**IMPORTANT:** Tasks should be executed automatically one after another, each in a new session. The implementation follows a test-driven approach where possible, with early validation of core functionality.

## Tasks

- [x] 1. Add dark mode settings structure to MASE_Settings
  - Extend `get_defaults()` method in `includes/class-mase-settings.php`
  - Add `dark_light_toggle` section with all configuration options
  - Add validation rules in `validate()` method for dark mode settings
  - Add dark mode palette definitions (dark-elegance, midnight-blue, charcoal)
  - Tag existing palettes with 'type' field ('light' or 'dark')
  - _Requirements: 6.1, 6.2, 10.1_

- [x] 2. Create AJAX handler for dark mode toggle
  - Add `handle_ajax_toggle_dark_mode()` method in `includes/class-mase-admin.php`
  - Implement nonce verification and capability checks
  - Validate mode input ('light' or 'dark')
  - Save preference to WordPress user meta
  - Update settings array with current mode
  - Invalidate CSS cache after mode change
  - Register AJAX action in constructor
  - _Requirements: 2.1, 2.2, 4.1, 11.1_

- [x] 3. Extend CSS generator for dark mode
  - Add `generate_dark_mode_css()` method in `includes/class-mase-css-generator.php`
  - Generate CSS custom properties for dark mode colors
  - Create dark mode styles scoped to `.mase-dark-mode` body class
  - Apply dark palette colors to admin bar, admin menu, content area
  - Ensure WCAG 2.1 AA contrast compliance (4.5:1 minimum)
  - Add dark mode CSS to main `generate()` method output
  - _Requirements: 6.1, 6.2, 8.1, 8.2, 8.3_

- [x] 4. Create FAB component HTML and CSS
  - Add FAB styles to `assets/css/mase-admin.css`
  - Position FAB in bottom-right corner (fixed positioning)
  - Style sun/moon icons using WordPress Dashicons
  - Add hover effects and tooltip styles
  - Create rotation animation for icon toggle
  - Add smooth color transitions (0.3s ease-in-out)
  - Implement responsive positioning for mobile devices
  - Add reduced motion support for accessibility
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 9.1, 9.2, 9.3_

- [x] 5. Implement dark mode JavaScript controller
  - Create `MASE.darkModeToggle` module in `assets/js/mase-admin.js`
  - Implement `init()` method to initialize dark mode system
  - Add `detectSystemPreference()` using matchMedia API
  - Implement `loadSavedPreference()` from localStorage and user meta
  - Create `setMode()` method to apply mode changes
  - Add `toggle()` method for switching between modes
  - Implement `animateIcon()` for FAB icon rotation
  - Add state management (currentMode, isTransitioning, systemPreference)
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_

- [x] 6. Implement FAB rendering and event handling
  - Add `render()` method to create FAB DOM element
  - Implement `attachEventListeners()` for click events
  - Add `updateIcon()` to switch between sun/moon icons
  - Implement `showTooltip()` and `hideTooltip()` methods
  - Add click handler to call `toggle()` method
  - Prevent rapid clicking during transitions
  - Update ARIA attributes (aria-label, aria-pressed)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 1.8_

- [x] 7. Implement persistence layer
  - Add `savePreference()` method to save to localStorage
  - Implement AJAX call to save to WordPress user meta
  - Add error handling for localStorage failures
  - Implement retry logic for failed AJAX requests
  - Add `needsSync` flag for offline changes
  - Create `syncPreference()` to retry failed saves
  - Handle storage quota exceeded errors
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 11.1, 11.2_

- [x] 8. Implement keyboard shortcuts
  - Add `setupKeyboardShortcuts()` method
  - Detect Ctrl/Cmd+Shift+D key combination
  - Prevent shortcut in input fields and textareas
  - Call `toggle()` when shortcut triggered
  - Add visual feedback (animate FAB)
  - Support both Windows (Ctrl) and Mac (Cmd) modifiers
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 9. Implement system preference detection and monitoring
  - Enhance `detectSystemPreference()` with error handling
  - Add `watchSystemPreference()` to monitor OS changes
  - Implement matchMedia change listener
  - Auto-update mode when system preference changes (if no manual override)
  - Add `respectSystemPreference` setting check
  - Log detection results for debugging
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 10. Add inline script for FOUC prevention
  - Create inline script in `includes/class-mase-admin.php`
  - Check localStorage synchronously before page render
  - Apply `.mase-dark-mode` class immediately if dark mode active
  - Add script before main mase-admin.js loads
  - Ensure script executes in < 50ms
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 11. Integrate with live preview system
  - Add dark mode support to `MASE.livePreview` module
  - Implement temporary mode changes during preview
  - Restore saved mode when exiting preview
  - Update preview on mode change
  - Trigger `mase:previewUpdated` event
  - Prevent saving during preview mode
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 12. Implement custom events system
  - Emit `mase:modeChanged` event on mode toggle
  - Emit `mase:transitionComplete` event after animation
  - Pass mode data in event payload
  - Document event structure for developers
  - Add event listeners for debugging
  - _Requirements: 2.7, 9.6_

- [x] 13. Add screen reader announcements
  - Create `announceToScreenReader()` method
  - Add ARIA live region for announcements
  - Announce mode changes ("Dark mode activated")
  - Update FAB aria-pressed attribute
  - Update FAB aria-label dynamically
  - Add sr-only text for current mode
  - _Requirements: 5.4, 5.7_

- [x] 14. Implement reduced motion support
  - Add CSS media query for prefers-reduced-motion
  - Set transition-duration to 0s when reduced motion preferred
  - Disable icon rotation animation
  - Keep instant mode switching functional
  - Test with browser accessibility settings
  - _Requirements: 9.6, 9.7_

- [x] 15. Add settings page UI controls
  - Add dark mode section to admin settings page
  - Create enable/disable toggle
  - Add light palette selector
  - Add dark palette selector
  - Add transition duration slider
  - Add keyboard shortcut enable/disable
  - Add FAB position controls
  - Wire up to existing settings save system
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [x] 16. Implement cache management
  - Create separate cache keys for light and dark CSS
  - Invalidate only active mode cache on toggle
  - Invalidate both caches on palette change
  - Add cache warming on settings save
  - Implement cache versioning
  - _Requirements: 12.5, 12.6, 12.7_

- [x] 17. Add migration logic for existing users
  - Create migration function in `includes/class-mase-migration.php`
  - Detect current palette luminance
  - Set initial mode based on palette type
  - Save preference to user meta
  - Mark migration as complete
  - Run migration on plugin update
  - _Requirements: 10.5_

- [x] 18. Create dark mode color palettes
  - Define 'dark-elegance' palette (default dark)
  - Define 'midnight-blue' palette
  - Define 'charcoal' palette
  - Ensure WCAG AAA contrast (7:1) for all palettes
  - Test readability of all text elements
  - Add palette previews to settings page
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 19. Implement error handling and fallbacks
  - Add try-catch blocks to all critical methods
  - Implement fallback CSS for generation failures
  - Handle localStorage unavailable gracefully
  - Add AJAX error handlers with user-friendly messages
  - Implement automatic retry for transient failures
  - Log all errors to console for debugging
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [x] 20. Add localization support
  - Wrap all user-facing strings in `wp_localize_script()`
  - Add translations for FAB tooltip
  - Add translations for mode announcements
  - Add translations for error messages
  - Add translations for settings page labels
  - Create POT file for translators
  - _Requirements: 1.8_

- [x] 21. Optimize performance
  - Profile mode toggle execution time (target < 50ms)
  - Profile CSS generation time (target < 100ms)
  - Implement debouncing for rapid toggles
  - Minimize DOM manipulations
  - Use CSS transforms for animations (GPU acceleration)
  - Lazy load dark mode CSS if not needed
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [x] 22. Create unit tests for PHP
  - Test settings structure validation
  - Test AJAX handler security (nonce, capability)
  - Test user meta save/retrieve
  - Test palette type detection
  - Test CSS generation for dark mode
  - Test cache invalidation logic
  - _Requirements: All backend requirements_

- [x] 23. Create unit tests for JavaScript
  - Test mode toggle logic
  - Test localStorage operations
  - Test system preference detection
  - Test keyboard shortcut handling
  - Test event emission
  - Test error handling
  - _Requirements: All frontend requirements_

- [x] 24. Create integration tests
  - Test dark mode with live preview
  - Test settings save/load cycle
  - Test preference sync across tabs
  - Test AJAX communication
  - Test cache integration
  - Test migration logic
  - _Requirements: 7.1-7.7, 10.1-10.7_

- [x] 25. Create visual regression tests
  - Test FAB rendering and positioning
  - Test icon changes (sun/moon)
  - Test color transitions
  - Test animation smoothness
  - Test responsive behavior
  - Test reduced motion mode
  - _Requirements: 1.1-1.8, 9.1-9.7_

- [x] 26. Create accessibility tests
  - Test keyboard navigation
  - Test screen reader announcements
  - Test focus indicators
  - Test ARIA attributes
  - Test contrast ratios (WCAG 2.1 AA)
  - Test reduced motion support
  - _Requirements: 5.1-5.7, 6.6, 9.6-9.7_

- [x] 27. Create browser compatibility tests
  - Test in Chrome, Firefox, Safari, Edge
  - Test localStorage support
  - Test matchMedia API support
  - Test CSS custom properties
  - Test on Windows, Mac, Linux
  - Test on mobile devices (iOS, Android)
  - _Requirements: 11.6, 12.1-12.7_

- [x] 28. Add documentation
  - Document FAB usage in user guide
  - Document keyboard shortcuts
  - Document settings options
  - Add developer documentation for events
  - Add code comments for all methods
  - Create troubleshooting guide
  - _Requirements: All requirements_

## Notes

- Each task should be completed and tested before moving to the next
- Tasks 1-3 establish the backend foundation
- Tasks 4-10 implement core frontend functionality
- Tasks 11-17 add integrations and enhancements
- Tasks 18-21 focus on polish and optimization
- Tasks 22-27 ensure quality through testing
- Task 28 provides documentation

## Success Criteria

- All tasks completed and marked as done
- All tests passing
- Dark mode toggle works on all admin pages
- Mode persists across sessions and devices
- Performance targets met (< 50ms toggle, < 100ms CSS generation)
- WCAG 2.1 AA accessibility compliance
- No console errors or warnings
- Smooth animations and transitions
- Keyboard shortcuts functional
- Screen reader support working
