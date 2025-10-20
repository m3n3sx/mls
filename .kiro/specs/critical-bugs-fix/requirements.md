# Requirements Document - Critical Bugs Fix

## Introduction

This document specifies requirements for fixing critical bugs discovered during comprehensive visual testing of the Modern Admin Styler Enterprise (MASE) WordPress plugin v1.2.0. Two critical bugs were identified that block production release:

1. **MASE-DARK-001**: Dark Mode displays huge gray circle covering entire screen
2. **MASE-ACC-001**: Live Preview Toggle aria-checked attribute not synchronized

## Glossary

- **MASE**: Modern Admin Styler Enterprise - WordPress admin styling plugin
- **Dark Mode**: Theme variant with dark backgrounds and light text for reduced eye strain
- **Live Preview Toggle**: Checkbox control that enables/disables real-time preview of style changes
- **aria-checked**: ARIA attribute indicating the checked state of a checkbox for screen readers
- **WCAG 2.1**: Web Content Accessibility Guidelines version 2.1
- **Screen Reader**: Assistive technology that reads web content aloud for visually impaired users
- **Playwright**: Automated browser testing framework used for visual testing
- **Docker**: Containerization platform used for test environment

## Requirements

### Requirement 1: Fix Dark Mode Gray Circle Bug (MASE-DARK-001)

**User Story:** As a user, I want to enable Dark Mode without visual obstructions, so that I can use the admin interface comfortably in low-light conditions.

#### Acceptance Criteria

1. WHEN a user enables Dark Mode via the header toggle, THE System SHALL apply dark theme colors without displaying any large decorative elements
2. WHEN Dark Mode is active, THE System SHALL ensure all content remains visible and accessible
3. WHERE decorative background elements exist, THE System SHALL limit their size to no more than 100px in any dimension
4. WHILE Dark Mode is enabled, THE System SHALL maintain proper z-index layering with content above decorations
5. IF a circular decorative element exists, THEN THE System SHALL position it in a corner or edge location that doesn't obstruct content

### Requirement 2: Identify Dark Mode Circle Element

**User Story:** As a developer, I want to locate the CSS rule causing the gray circle, so that I can apply the appropriate fix.

#### Acceptance Criteria

1. WHEN inspecting the page with Dark Mode enabled, THE System SHALL allow identification of the circular element via browser DevTools
2. WHEN searching CSS files, THE System SHALL reveal selectors containing `[data-theme="dark"]` or `.mase-dark-mode` with circular styling
3. WHERE multiple circular elements exist, THE System SHALL identify which one has dimensions exceeding 100px
4. WHILE reviewing CSS, THE System SHALL check for pseudo-elements (::before, ::after) with `border-radius: 50%`
5. IF the element is JavaScript-generated, THEN THE System SHALL reveal the creation code in mase-admin.js

### Requirement 3: Remove or Resize Dark Mode Circle

**User Story:** As a developer, I want to fix the circular element dimensions, so that Dark Mode becomes usable.

#### Acceptance Criteria

1. WHEN the problematic CSS rule is identified, THE System SHALL either remove the element or resize it to maximum 100px
2. WHEN resizing is chosen, THE System SHALL position the element in a non-obstructive location (corner or edge)
3. WHERE the element is decorative only, THE System SHALL remove it entirely using `display: none`
4. WHILE maintaining visual design, THE System SHALL ensure the fix doesn't break other Dark Mode features
5. IF the element serves a functional purpose, THEN THE System SHALL resize and reposition it appropriately

### Requirement 4: Fix Live Preview Toggle aria-checked Synchronization (MASE-ACC-001)

**User Story:** As a screen reader user, I want the Live Preview toggle to announce its correct state, so that I know whether the feature is enabled or disabled.

#### Acceptance Criteria

1. WHEN a user clicks the Live Preview toggle to disable it, THE System SHALL update aria-checked to "false"
2. WHEN a user clicks the Live Preview toggle to enable it, THE System SHALL update aria-checked to "true"
3. WHERE the checkbox checked property changes, THE System SHALL synchronize the aria-checked attribute immediately
4. WHILE the toggle state changes, THE System SHALL ensure screen readers announce the correct state
5. IF the toggle is programmatically changed, THEN THE System SHALL update aria-checked accordingly

### Requirement 5: Add aria-checked Update to Toggle Handler

**User Story:** As a developer, I want to add aria-checked synchronization to the toggle handler, so that accessibility is maintained.

#### Acceptance Criteria

1. WHEN the Live Preview toggle change event fires, THE System SHALL read the current checked state
2. WHEN the checked state is determined, THE System SHALL set aria-checked to match (true or false as string)
3. WHERE the toggle handler executes, THE System SHALL update aria-checked before any other operations
4. WHILE updating aria-checked, THE System SHALL use jQuery's .attr() method for reliability
5. IF the toggle is in an indeterminate state, THEN THE System SHALL set aria-checked to "false"

### Requirement 6: Verify Dark Mode Toggle aria-checked

**User Story:** As a QA engineer, I want to verify that Dark Mode toggle also has correct aria-checked synchronization, so that both toggles are accessible.

#### Acceptance Criteria

1. WHEN reviewing the Dark Mode toggle handler, THE System SHALL verify aria-checked is updated on state change
2. WHEN testing Dark Mode toggle, THE System SHALL confirm aria-checked matches the checked property
3. WHERE Dark Mode toggle code exists, THE System SHALL ensure it follows the same pattern as Live Preview toggle
4. WHILE both toggles exist, THE System SHALL maintain consistent accessibility implementation
5. IF Dark Mode toggle lacks aria-checked updates, THEN THE System SHALL add them using the same approach

### Requirement 7: Test Dark Mode Visual Appearance

**User Story:** As a QA engineer, I want to verify Dark Mode works correctly after the fix, so that users can use it without issues.

#### Acceptance Criteria

1. WHEN Dark Mode is enabled, THE System SHALL display dark backgrounds and light text throughout the admin interface
2. WHEN all tabs are visited in Dark Mode, THE System SHALL ensure no visual obstructions appear
3. WHERE color palettes are displayed in Dark Mode, THE System SHALL maintain proper contrast and visibility
4. WHILE navigating in Dark Mode, THE System SHALL ensure all interactive elements remain accessible
5. IF any decorative elements exist, THEN THE System SHALL verify they don't obstruct content

### Requirement 8: Test Toggle Accessibility with Screen Reader

**User Story:** As a QA engineer, I want to test toggles with a screen reader, so that I can verify accessibility compliance.

#### Acceptance Criteria

1. WHEN using NVDA or JAWS screen reader, THE System SHALL announce "Live Preview, checkbox, checked" when toggle is on
2. WHEN using NVDA or JAWS screen reader, THE System SHALL announce "Live Preview, checkbox, not checked" when toggle is off
3. WHERE the toggle state changes, THE System SHALL trigger screen reader announcement of the new state
4. WHILE navigating with keyboard, THE System SHALL allow toggling via Space or Enter key
5. IF aria-checked is incorrect, THEN THE System SHALL fail the accessibility test

### Requirement 9: Update Automated Tests for Dark Mode

**User Story:** As a developer, I want automated tests to verify Dark Mode works correctly, so that regressions are caught early.

#### Acceptance Criteria

1. WHEN automated tests run, THE System SHALL include a test that enables Dark Mode
2. WHEN Dark Mode is enabled in tests, THE System SHALL verify no large circular elements are visible
3. WHERE visual regression tests exist, THE System SHALL capture screenshots of Dark Mode for comparison
4. WHILE testing Dark Mode, THE System SHALL verify all tabs and features remain functional
5. IF the gray circle appears in tests, THEN THE System SHALL fail the test with a descriptive error message

### Requirement 10: Update Automated Tests for aria-checked

**User Story:** As a developer, I want automated tests to verify aria-checked synchronization, so that accessibility regressions are prevented.

#### Acceptance Criteria

1. WHEN automated tests run, THE System SHALL include a test that toggles Live Preview on and off
2. WHEN the toggle is clicked, THE System SHALL verify aria-checked matches the checked property
3. WHERE both toggles exist, THE System SHALL test aria-checked synchronization for both
4. WHILE testing accessibility, THE System SHALL use axe-core or similar tool to verify ARIA compliance
5. IF aria-checked is out of sync, THEN THE System SHALL fail the test with details about the mismatch

### Requirement 11: Document Fixes in CHANGELOG

**User Story:** As a user, I want to know what bugs were fixed, so that I can understand what changed in the new version.

#### Acceptance Criteria

1. WHEN the fixes are complete, THE System SHALL add entries to CHANGELOG.md describing both bug fixes
2. WHEN documenting the Dark Mode fix, THE System SHALL explain what was wrong and how it was fixed
3. WHERE the aria-checked fix is documented, THE System SHALL note the accessibility improvement
4. WHILE writing changelog entries, THE System SHALL use clear, non-technical language for users
5. IF breaking changes exist, THEN THE System SHALL clearly mark them in the changelog

### Requirement 12: Update Plugin Version Number

**User Story:** As a developer, I want to increment the version number, so that users know a new version is available.

#### Acceptance Criteria

1. WHEN all fixes are complete and tested, THE System SHALL increment the version from 1.2.0 to 1.2.1
2. WHEN updating the version, THE System SHALL change it in the main plugin file header
3. WHERE version constants exist in code, THE System SHALL update them to match
4. WHILE updating version numbers, THE System SHALL ensure consistency across all files
5. IF a version mismatch exists, THEN THE System SHALL fail the build process

## Constraints

- Must maintain backward compatibility with existing WordPress admin themes
- Must not break existing user workflows or saved settings
- Must follow WordPress coding standards and best practices
- Must maintain WCAG 2.1 Level AA accessibility compliance
- Must work across all major browsers (Chrome, Firefox, Safari, Edge)
- Must not introduce performance regressions
- Must preserve existing visual design in Light Mode
- Must fix bugs without requiring database migrations
- Must be deployable as a patch release (1.2.1)

## Success Criteria

- Dark Mode displays correctly without any large circular obstructions
- All content is visible and accessible in Dark Mode
- Live Preview toggle aria-checked synchronizes correctly
- Dark Mode toggle aria-checked synchronizes correctly (if not already)
- All automated tests pass including new Dark Mode and accessibility tests
- Screen reader testing confirms correct toggle announcements
- Visual regression tests show no unintended changes in Light Mode
- CHANGELOG.md documents both fixes clearly
- Version number updated to 1.2.1
- Plugin ready for production release

## Priority

**P0 (Critical)** - Both bugs block production release:
- MASE-DARK-001: Makes Dark Mode completely unusable
- MASE-ACC-001: Violates WCAG 2.1 accessibility standards

## Related Issues

- Live Preview Toggle Fix spec (completed) - provides context for toggle implementation
- Visual Testing Report - documents the discovery of these bugs
- Dark Mode Bug Report - provides detailed analysis of MASE-DARK-001

## Testing Evidence

- 16 screenshots captured during Playwright testing
- User-provided screenshot showing gray circle in Dark Mode
- Test results showing aria-checked="true" when checked=false
- Docker test environment confirmed both bugs reproducible

