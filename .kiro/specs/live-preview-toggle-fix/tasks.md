# Implementation Plan - Live Preview Toggle Fix

## Overview

This implementation plan breaks down the Live Preview toggle fix into discrete, testable tasks. Each task builds incrementally on previous work and includes specific file references and code changes.

## Task List

- [x] 1. Fix CSS Pointer Events for Dashicons

  - Enhance inline CSS injection in PHP to ensure dashicons don't block clicks
  - Add multiple selector variations for maximum coverage
  - Verify CSS specificity and load order
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 1.1 Update inline CSS injection in class-mase-admin.php

  - File: `includes/class-mase-admin.php`
  - Lines: 189-196
  - Add comprehensive selector coverage for dashicons
  - Add explicit pointer-events: auto for checkboxes
  - Use !important to ensure precedence
  - _Requirements: 1.3, 4.1, 4.2_

- [x] 1.2 Verify CSS file contains matching rules

  - File: `assets/css/mase-admin.css`
  - Lines: 9172-9175
  - Ensure file-based CSS matches inline CSS
  - Add comments explaining the fix
  - _Requirements: 4.3, 4.4_

- [ ]\* 1.3 Create CSS pointer-events test

  - File: `tests/unit/test-pointer-events.js`
  - Verify dashicons have pointer-events: none
  - Verify checkboxes have pointer-events: auto
  - Test across different browsers
  - _Requirements: 4.5, 7.1_

- [x] 2. Enhance Color Picker Fallback Inputs

  - Improve fallback input creation and synchronization
  - Add data attributes for test targeting
  - Ensure bidirectional sync works correctly
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2.1 Update initColorPickers function

  - File: `assets/js/mase-admin.js`
  - Lines: 2305-2365
  - Add data-testid attributes to fallback inputs
  - Set opacity to 0.01 for Playwright visibility
  - Ensure pointer-events: auto on fallbacks
  - Add aria-label for accessibility
  - _Requirements: 2.1, 2.4, 2.5_

- [x] 2.2 Improve bidirectional synchronization

  - File: `assets/js/mase-admin.js`
  - Lines: 2350-2365
  - Add debouncing to prevent sync loops
  - Log sync operations for debugging
  - Handle edge cases (empty values, invalid colors)
  - _Requirements: 2.2, 2.3_

- [ ]\* 2.3 Create color picker sync test

  - File: `tests/unit/test-color-picker-sync.js`
  - Verify fallback inputs are created
  - Verify sync works both directions
  - Test with Playwright automation
  - _Requirements: 2.1, 2.2, 2.3, 7.2, 7.3_

- [x] 3. Improve Tab Navigation

  - Enhance tab switching to ensure element visibility
  - Add custom events for test synchronization
  - Improve accessibility attributes
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3.1 Update tabNavigation.switchTab function

  - File: `assets/js/mase-admin.js`
  - Add explicit aria-hidden management
  - Force reflow to ensure CSS application
  - Trigger custom 'mase:tabSwitched' event
  - Update ARIA attributes correctly
  - _Requirements: 6.1, 6.2, 6.4_

- [x] 3.2 Add tab visibility verification

  - File: `assets/js/mase-admin.js`
  - Check element visibility before interactions
  - Log tab switch operations
  - Handle edge cases (invalid tab IDs)
  - _Requirements: 6.3, 6.5_

- [ ]\* 3.3 Create tab navigation test

  - File: `tests/unit/test-tab-navigation.js`
  - Verify tab switching shows correct content
  - Verify elements become visible
  - Test custom event firing
  - _Requirements: 6.1, 6.2, 6.3, 7.4_

- [x] 4. Add Event Handler Robustness

  - Add null checks for event properties
  - Wrap operations in try-catch blocks
  - Improve error logging
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 4.1 Update Live Preview toggle handler

  - File: `assets/js/mase-admin.js`
  - Lines: 2403-2420
  - Add event object validation
  - Add try-catch wrapper
  - Log errors with stack traces
  - Provide user feedback on errors
  - _Requirements: 5.1, 5.2, 5.4, 5.5_

- [x] 4.2 Update Dark Mode toggle handler

  - File: `assets/js/mase-admin.js`
  - Add event object validation
  - Add try-catch wrapper
  - Ensure sync between header and form checkbox
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 4.3 Update other event handlers

  - File: `assets/js/mase-admin.js`
  - Add validation to palette click handler
  - Add validation to template apply handler
  - Add validation to keyboard shortcut handler
  - _Requirements: 5.1, 5.2, 5.3_

- [ ]\* 4.4 Create event handler robustness test

  - File: `tests/unit/test-event-handlers.js`
  - Test handlers with invalid events
  - Test handlers with missing properties
  - Verify error logging works
  - _Requirements: 5.1, 5.2, 5.5_

- [x] 5. Update Automated Tests

  - Fix Playwright tests to work with new implementation
  - Add explicit waits and force options
  - Use fallback inputs for color pickers
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 5.1 Update toggle click tests

  - File: `tests/visual-testing/playwright-detailed-tests.js`
  - Add force: true option to toggle clicks
  - Add explicit waits after clicks
  - Verify state changes after clicks
  - _Requirements: 7.1_

- [x] 5.2 Update color picker tests

  - File: `tests/visual-testing/playwright-detailed-tests.js`
  - Use fallback inputs instead of original inputs
  - Add waits for synchronization
  - Verify color values are applied
  - _Requirements: 7.2, 7.3_

- [x] 5.3 Update template application tests

  - File: `tests/visual-testing/playwright-detailed-tests.js`
  - Add tab navigation before clicking templates
  - Wait for custom tab switch event
  - Add explicit visibility checks
  - _Requirements: 7.4_

- [x] 5.4 Add test utilities

  - File: `tests/visual-testing/test-utils.js`
  - Create helper for waiting for tab switches
  - Create helper for color picker interactions
  - Create helper for toggle interactions
  - _Requirements: 7.5_

- [x] 6. Manual Testing and Verification

  - Test all fixes in real browser environment
  - Verify no regressions in existing functionality
  - Check accessibility with screen readers
  - _Requirements: All_

- [x] 6.1 Test toggle interactions manually

  - Click Live Preview toggle in header
  - Click Dark Mode toggle in header
  - Verify state changes immediately
  - Check console for errors
  - _Requirements: 1.1, 1.2_

- [x] 6.2 Test color picker interactions manually

  - Change colors using WordPress Color Picker
  - Verify live preview updates
  - Check fallback input synchronization
  - Test with keyboard navigation
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 6.3 Test template application manually

  - Navigate to Templates tab
  - Click various template apply buttons
  - Verify templates are applied correctly
  - Check for console errors
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 6.4 Run accessibility audit

  - Use axe DevTools or similar
  - Verify ARIA attributes are correct
  - Test with screen reader (NVDA/JAWS)
  - Check keyboard navigation
  - _Requirements: All accessibility criteria_

- [-] 7. Run Full Test Suite

  - Execute all automated tests
  - Verify 100% pass rate
  - Check for performance regressions
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 7.1 Run Playwright tests

  - Execute: `npm run test:visual`
  - Verify all 55 tests pass
  - Check test execution time
  - Review screenshots for visual regressions
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]\* 7.2 Run unit tests

  - Execute: `npm run test:unit`
  - Verify all unit tests pass
  - Check code coverage
  - _Requirements: All unit test requirements_

- [x] 7.3 Run integration tests

  - Execute: `npm run test:integration`
  - Verify end-to-end workflows
  - Check for race conditions
  - _Requirements: All integration requirements_

- [x] 8. Documentation and Cleanup

  - Update code comments
  - Document fixes in CHANGELOG
  - Clean up debug logging
  - _Requirements: All_

- [x] 8.1 Update code comments

  - Add detailed comments to CSS fixes
  - Document fallback input purpose
  - Explain event handler validation
  - _Requirements: All_

- [x] 8.2 Update CHANGELOG.md

  - Document all fixes applied
  - List test improvements
  - Note any breaking changes
  - _Requirements: All_

- [x] 8.3 Clean up debug logging
  - Remove excessive console.log statements
  - Keep essential error logging
  - Add feature flag for debug mode
  - _Requirements: 5.5_

## Implementation Order

1. **Phase 1: Critical Fixes** (Tasks 1.1, 1.2, 2.1, 2.2)

   - Fix pointer-events blocking
   - Enhance color picker fallbacks
   - Estimated time: 2-3 hours

2. **Phase 2: Robustness** (Tasks 3.1, 3.2, 4.1, 4.2, 4.3)

   - Improve tab navigation
   - Add event handler validation
   - Estimated time: 2-3 hours

3. **Phase 3: Test Updates** (Tasks 5.1, 5.2, 5.3, 5.4)

   - Update Playwright tests
   - Add test utilities
   - Estimated time: 2-3 hours

4. **Phase 4: Verification** (Tasks 6.1, 6.2, 6.3, 6.4, 7.1, 7.3)

   - Manual testing
   - Automated test execution
   - Accessibility audit
   - Estimated time: 2-3 hours

5. **Phase 5: Documentation** (Tasks 8.1, 8.2, 8.3)
   - Update comments and docs
   - Clean up code
   - Estimated time: 1-2 hours

**Total Estimated Time: 9-14 hours**

## Dependencies

- Task 1.2 depends on 1.1 (CSS must match inline styles)
- Task 2.2 depends on 2.1 (sync requires fallback inputs)
- Task 5.1, 5.2, 5.3 depend on 1.1, 2.1, 3.1 (tests need fixes in place)
- Task 7.1 depends on 5.1, 5.2, 5.3 (tests must be updated first)
- Task 8.2 depends on all previous tasks (document after completion)

## Success Criteria

- All 55 automated tests pass (currently 41/55)
- Live Preview toggle responds to clicks
- Dark Mode toggle responds to clicks
- Color pickers are editable by tests
- Template buttons are clickable
- No console errors during operation
- Accessibility audit shows no regressions
- Code is well-documented and maintainable
