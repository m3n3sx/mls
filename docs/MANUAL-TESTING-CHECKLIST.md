# Manual Testing Checklist
## Task 21.2: Comprehensive Manual Testing

**Date:** October 23, 2025  
**Requirements:** 10.1, 10.2

---

## Overview

This checklist provides a comprehensive manual testing guide for the MASE plugin to ensure all user workflows function correctly across different WordPress versions, themes, and plugins, with proper accessibility support.

---

## Testing Environment Setup

### Required Test Environments

- [ ] **WordPress 6.0** - Minimum supported version
- [ ] **WordPress 6.1** - Previous major version
- [ ] **WordPress 6.2** - Current stable version
- [ ] **WordPress 6.3** - Latest version

### Required Themes

- [ ] **Twenty Twenty-Three** - Default block theme
- [ ] **Twenty Twenty-Two** - Previous default theme
- [ ] **Astra** - Popular third-party theme
- [ ] **GeneratePress** - Popular lightweight theme

### Required Plugins (Compatibility Testing)

- [ ] **WooCommerce** - E-commerce plugin
- [ ] **Yoast SEO** - SEO plugin
- [ ] **Elementor** - Page builder
- [ ] **Contact Form 7** - Forms plugin

### Browsers

- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)

### Screen Readers (Accessibility)

- [ ] **NVDA** (Windows)
- [ ] **JAWS** (Windows)
- [ ] **VoiceOver** (macOS)

---

## 1. Core Functionality Testing

### 1.1 Plugin Installation and Activation

- [ ] Install plugin from ZIP file
- [ ] Activate plugin successfully
- [ ] Verify no PHP errors in debug log
- [ ] Verify admin menu item appears
- [ ] Verify settings page loads correctly

**Expected Result:** Plugin installs and activates without errors

---

### 1.2 Settings Page Load

- [ ] Navigate to MASE settings page
- [ ] Verify all tabs load (Colors, Typography, Effects, Templates, Advanced)
- [ ] Verify no JavaScript console errors
- [ ] Verify all UI elements render correctly
- [ ] Verify loading states display properly

**Expected Result:** Settings page loads completely with all UI elements visible

---

### 1.3 Color Settings

#### Basic Color Changes

- [ ] Change primary color
- [ ] Change secondary color
- [ ] Change accent color
- [ ] Change background color
- [ ] Change text color
- [ ] Verify live preview updates immediately
- [ ] Save settings
- [ ] Reload page and verify persistence

**Expected Result:** Color changes apply immediately in preview and persist after save

#### Admin Bar Colors

- [ ] Change admin bar background color
- [ ] Change admin bar text color
- [ ] Change admin bar hover color
- [ ] Verify preview updates
- [ ] Save and verify persistence

**Expected Result:** Admin bar colors update correctly

#### Menu Colors

- [ ] Change menu background color
- [ ] Change menu text color
- [ ] Change menu hover color
- [ ] Change menu active color
- [ ] Verify preview updates
- [ ] Save and verify persistence

**Expected Result:** Menu colors update correctly

#### Content Area Colors

- [ ] Change content background color
- [ ] Change content text color
- [ ] Verify preview updates
- [ ] Save and verify persistence

**Expected Result:** Content area colors update correctly

---

### 1.4 Typography Settings

#### Font Family

- [ ] Change heading font to Google Font (e.g., "Roboto")
- [ ] Verify font loads in preview
- [ ] Change body font to different Google Font (e.g., "Open Sans")
- [ ] Verify font loads in preview
- [ ] Save settings
- [ ] Reload page and verify fonts persist

**Expected Result:** Fonts load correctly and persist after save

#### Font Sizes

- [ ] Increase base font size
- [ ] Decrease base font size
- [ ] Verify preview updates
- [ ] Save and verify persistence

**Expected Result:** Font sizes update correctly

#### Line Height

- [ ] Increase line height
- [ ] Decrease line height
- [ ] Verify preview updates
- [ ] Save and verify persistence

**Expected Result:** Line height updates correctly

#### Heading Weights

- [ ] Change heading font weight
- [ ] Verify preview updates
- [ ] Save and verify persistence

**Expected Result:** Heading weights update correctly

---

### 1.5 Visual Effects

#### Border Radius

- [ ] Increase border radius
- [ ] Decrease border radius to 0
- [ ] Verify preview updates
- [ ] Save and verify persistence

**Expected Result:** Border radius updates correctly

#### Shadows

- [ ] Enable shadows
- [ ] Disable shadows
- [ ] Verify preview updates
- [ ] Save and verify persistence

**Expected Result:** Shadows toggle correctly

#### Animations

- [ ] Enable animations
- [ ] Disable animations
- [ ] Verify preview updates
- [ ] Save and verify persistence

**Expected Result:** Animations toggle correctly

#### Transitions

- [ ] Enable transitions
- [ ] Disable transitions
- [ ] Verify preview updates
- [ ] Save and verify persistence

**Expected Result:** Transitions toggle correctly

---

### 1.6 Template System

#### Template Application

- [ ] Browse available templates
- [ ] Preview template (hover or click preview button)
- [ ] Apply template
- [ ] Verify all settings update correctly
- [ ] Save settings
- [ ] Reload page and verify persistence

**Expected Result:** Template applies all settings correctly

#### Template Undo

- [ ] Apply a template
- [ ] Click undo (Ctrl+Z or undo button)
- [ ] Verify settings revert to previous state
- [ ] Save settings
- [ ] Verify persistence

**Expected Result:** Undo reverts template changes correctly

#### Multiple Templates

- [ ] Apply first template
- [ ] Apply second template
- [ ] Apply third template
- [ ] Verify each template applies correctly
- [ ] Use undo to revert through templates
- [ ] Verify undo history works correctly

**Expected Result:** Multiple templates can be applied and undone

---

### 1.7 Color Palette System

#### Palette Selection

- [ ] Browse available color palettes
- [ ] Preview palette (hover or click preview button)
- [ ] Apply palette
- [ ] Verify all color settings update
- [ ] Save settings
- [ ] Reload page and verify persistence

**Expected Result:** Palette applies all colors correctly

#### Accessibility Warnings

- [ ] Apply palette with low contrast
- [ ] Verify accessibility warning appears
- [ ] Apply palette with good contrast
- [ ] Verify no warning appears

**Expected Result:** Accessibility warnings display for low-contrast palettes

---

### 1.8 Advanced Settings

#### Custom CSS

- [ ] Add custom CSS rules
- [ ] Verify preview updates
- [ ] Save settings
- [ ] Reload page and verify custom CSS applies

**Expected Result:** Custom CSS applies correctly

#### Performance Settings

- [ ] Enable/disable caching
- [ ] Enable/disable minification
- [ ] Save settings
- [ ] Verify settings persist

**Expected Result:** Performance settings save correctly

---

### 1.9 Import/Export

#### Export Settings

- [ ] Click export button
- [ ] Verify JSON file downloads
- [ ] Open JSON file and verify structure
- [ ] Verify all settings included

**Expected Result:** Settings export to valid JSON file

#### Import Settings

- [ ] Click import button
- [ ] Select previously exported JSON file
- [ ] Verify settings import correctly
- [ ] Verify preview updates
- [ ] Save settings
- [ ] Reload page and verify persistence

**Expected Result:** Settings import correctly from JSON file

---

### 1.10 Reset to Defaults

- [ ] Make multiple setting changes
- [ ] Click "Reset to Defaults" button
- [ ] Confirm reset action
- [ ] Verify all settings revert to defaults
- [ ] Verify preview updates
- [ ] Save settings
- [ ] Reload page and verify defaults persist

**Expected Result:** All settings reset to default values

---

## 2. Live Preview Testing

### 2.1 Preview Toggle

- [ ] Enable live preview
- [ ] Make setting changes
- [ ] Verify preview updates immediately
- [ ] Disable live preview
- [ ] Make setting changes
- [ ] Verify preview does not update
- [ ] Enable preview again
- [ ] Verify preview updates with current settings

**Expected Result:** Preview toggle controls preview updates

---

### 2.2 Preview Performance

- [ ] Make rapid color changes (10+ changes quickly)
- [ ] Verify preview updates smoothly without lag
- [ ] Verify no JavaScript errors
- [ ] Verify browser remains responsive

**Expected Result:** Preview handles rapid changes without performance issues

---

### 2.3 Preview Accuracy

- [ ] Apply various settings
- [ ] Compare preview to actual admin interface
- [ ] Verify preview matches actual appearance
- [ ] Test on different admin pages
- [ ] Verify consistency across pages

**Expected Result:** Preview accurately reflects actual appearance

---

## 3. Save/Load Testing

### 3.1 Settings Persistence

- [ ] Make setting changes
- [ ] Save settings
- [ ] Reload page
- [ ] Verify all settings persist correctly
- [ ] Navigate to different admin page
- [ ] Return to MASE settings
- [ ] Verify settings still correct

**Expected Result:** Settings persist across page reloads and navigation

---

### 3.2 Concurrent Save Prevention

- [ ] Open MASE settings in two browser tabs
- [ ] Make different changes in each tab
- [ ] Try to save from both tabs simultaneously
- [ ] Verify only one save succeeds
- [ ] Verify appropriate error message displays

**Expected Result:** Concurrent saves prevented with clear error message

---

### 3.3 Network Failure Handling

- [ ] Make setting changes
- [ ] Disable network (browser DevTools)
- [ ] Try to save settings
- [ ] Verify error message displays
- [ ] Re-enable network
- [ ] Retry save
- [ ] Verify save succeeds

**Expected Result:** Network failures handled gracefully with retry option

---

## 4. Undo/Redo Testing

### 4.1 Basic Undo/Redo

- [ ] Make setting change #1
- [ ] Make setting change #2
- [ ] Make setting change #3
- [ ] Press Ctrl+Z (or undo button)
- [ ] Verify change #3 reverted
- [ ] Press Ctrl+Z again
- [ ] Verify change #2 reverted
- [ ] Press Ctrl+Y (or redo button)
- [ ] Verify change #2 restored

**Expected Result:** Undo/redo works correctly for multiple changes

---

### 4.2 Undo History Limit

- [ ] Make 60+ setting changes
- [ ] Try to undo all changes
- [ ] Verify undo stops at 50 changes (history limit)
- [ ] Verify appropriate message displays

**Expected Result:** Undo history limited to 50 states

---

### 4.3 Undo After Save

- [ ] Make setting changes
- [ ] Save settings
- [ ] Press Ctrl+Z
- [ ] Verify undo still works after save
- [ ] Verify preview updates

**Expected Result:** Undo works after saving

---

## 5. WordPress Version Compatibility

### 5.1 WordPress 6.0 Testing

- [ ] Install WordPress 6.0
- [ ] Install and activate MASE plugin
- [ ] Test all core functionality
- [ ] Verify no compatibility issues

**Expected Result:** Plugin works correctly on WordPress 6.0

---

### 5.2 WordPress 6.1 Testing

- [ ] Install WordPress 6.1
- [ ] Install and activate MASE plugin
- [ ] Test all core functionality
- [ ] Verify no compatibility issues

**Expected Result:** Plugin works correctly on WordPress 6.1

---

### 5.3 WordPress 6.2 Testing

- [ ] Install WordPress 6.2
- [ ] Install and activate MASE plugin
- [ ] Test all core functionality
- [ ] Verify no compatibility issues

**Expected Result:** Plugin works correctly on WordPress 6.2

---

### 5.4 WordPress 6.3 Testing

- [ ] Install WordPress 6.3
- [ ] Install and activate MASE plugin
- [ ] Test all core functionality
- [ ] Verify no compatibility issues

**Expected Result:** Plugin works correctly on WordPress 6.3

---

## 6. Theme Compatibility

### 6.1 Twenty Twenty-Three

- [ ] Activate Twenty Twenty-Three theme
- [ ] Test MASE plugin functionality
- [ ] Verify styling applies correctly
- [ ] Verify no visual conflicts

**Expected Result:** Plugin works correctly with Twenty Twenty-Three

---

### 6.2 Twenty Twenty-Two

- [ ] Activate Twenty Twenty-Two theme
- [ ] Test MASE plugin functionality
- [ ] Verify styling applies correctly
- [ ] Verify no visual conflicts

**Expected Result:** Plugin works correctly with Twenty Twenty-Two

---

### 6.3 Astra Theme

- [ ] Activate Astra theme
- [ ] Test MASE plugin functionality
- [ ] Verify styling applies correctly
- [ ] Verify no visual conflicts

**Expected Result:** Plugin works correctly with Astra

---

### 6.4 GeneratePress Theme

- [ ] Activate GeneratePress theme
- [ ] Test MASE plugin functionality
- [ ] Verify styling applies correctly
- [ ] Verify no visual conflicts

**Expected Result:** Plugin works correctly with GeneratePress

---

## 7. Plugin Compatibility

### 7.1 WooCommerce

- [ ] Install and activate WooCommerce
- [ ] Test MASE plugin functionality
- [ ] Verify no conflicts
- [ ] Test WooCommerce admin pages
- [ ] Verify MASE styling applies

**Expected Result:** Plugin works correctly with WooCommerce

---

### 7.2 Yoast SEO

- [ ] Install and activate Yoast SEO
- [ ] Test MASE plugin functionality
- [ ] Verify no conflicts
- [ ] Test Yoast SEO admin pages
- [ ] Verify MASE styling applies

**Expected Result:** Plugin works correctly with Yoast SEO

---

### 7.3 Elementor

- [ ] Install and activate Elementor
- [ ] Test MASE plugin functionality
- [ ] Verify no conflicts
- [ ] Test Elementor editor
- [ ] Verify MASE styling applies to admin areas

**Expected Result:** Plugin works correctly with Elementor

---

### 7.4 Contact Form 7

- [ ] Install and activate Contact Form 7
- [ ] Test MASE plugin functionality
- [ ] Verify no conflicts
- [ ] Test Contact Form 7 admin pages
- [ ] Verify MASE styling applies

**Expected Result:** Plugin works correctly with Contact Form 7

---

## 8. Accessibility Testing (Requirement 10.2)

### 8.1 Keyboard Navigation

- [ ] Navigate settings page using only keyboard (Tab, Shift+Tab, Enter, Space)
- [ ] Verify all interactive elements accessible
- [ ] Verify focus indicators visible
- [ ] Verify tab order logical
- [ ] Verify no keyboard traps

**Expected Result:** All functionality accessible via keyboard

---

### 8.2 Screen Reader Testing (NVDA)

- [ ] Launch NVDA screen reader
- [ ] Navigate MASE settings page
- [ ] Verify all labels read correctly
- [ ] Verify form fields announced properly
- [ ] Verify buttons and links announced
- [ ] Verify state changes announced (e.g., "Preview enabled")

**Expected Result:** All content accessible to NVDA users

---

### 8.3 Screen Reader Testing (JAWS)

- [ ] Launch JAWS screen reader
- [ ] Navigate MASE settings page
- [ ] Verify all labels read correctly
- [ ] Verify form fields announced properly
- [ ] Verify buttons and links announced
- [ ] Verify state changes announced

**Expected Result:** All content accessible to JAWS users

---

### 8.4 Screen Reader Testing (VoiceOver)

- [ ] Launch VoiceOver screen reader (macOS)
- [ ] Navigate MASE settings page
- [ ] Verify all labels read correctly
- [ ] Verify form fields announced properly
- [ ] Verify buttons and links announced
- [ ] Verify state changes announced

**Expected Result:** All content accessible to VoiceOver users

---

### 8.5 Color Contrast

- [ ] Use browser DevTools to check color contrast ratios
- [ ] Verify all text meets WCAG AA standards (4.5:1 for normal text)
- [ ] Verify all interactive elements meet standards
- [ ] Test with various color palettes
- [ ] Verify accessibility warnings display for low contrast

**Expected Result:** All color combinations meet WCAG AA standards

---

### 8.6 Focus Management

- [ ] Tab through all interactive elements
- [ ] Verify focus moves logically
- [ ] Open modal dialogs
- [ ] Verify focus trapped in modal
- [ ] Close modal
- [ ] Verify focus returns to trigger element

**Expected Result:** Focus management follows accessibility best practices

---

### 8.7 ARIA Attributes

- [ ] Inspect HTML with browser DevTools
- [ ] Verify ARIA labels present on all interactive elements
- [ ] Verify ARIA roles correct
- [ ] Verify ARIA states update correctly (e.g., aria-checked)
- [ ] Verify ARIA live regions announce changes

**Expected Result:** ARIA attributes properly implemented

---

## 9. Error Handling

### 9.1 Invalid Input Handling

- [ ] Enter invalid color value (e.g., "invalid")
- [ ] Verify error message displays
- [ ] Verify invalid value not saved
- [ ] Enter valid value
- [ ] Verify error clears

**Expected Result:** Invalid inputs rejected with clear error messages

---

### 9.2 Network Error Handling

- [ ] Disable network
- [ ] Try to save settings
- [ ] Verify error message displays
- [ ] Verify retry option available
- [ ] Re-enable network
- [ ] Retry save
- [ ] Verify save succeeds

**Expected Result:** Network errors handled gracefully

---

### 9.3 Server Error Handling

- [ ] Simulate server error (500 response)
- [ ] Try to save settings
- [ ] Verify error message displays
- [ ] Verify user-friendly message shown
- [ ] Verify retry option available

**Expected Result:** Server errors handled gracefully

---

## 10. Performance Testing

### 10.1 Page Load Performance

- [ ] Clear browser cache
- [ ] Load MASE settings page
- [ ] Measure page load time (should be < 2 seconds)
- [ ] Verify no performance warnings in console
- [ ] Check Network tab for slow requests

**Expected Result:** Page loads quickly without performance issues

---

### 10.2 Preview Update Performance

- [ ] Make rapid setting changes
- [ ] Verify preview updates within 50ms
- [ ] Verify no lag or stuttering
- [ ] Verify browser remains responsive

**Expected Result:** Preview updates quickly without lag

---

### 10.3 Memory Usage

- [ ] Open browser DevTools Performance tab
- [ ] Record memory usage
- [ ] Make 100+ setting changes
- [ ] Stop recording
- [ ] Verify no memory leaks
- [ ] Verify memory usage stable

**Expected Result:** No memory leaks detected

---

## 11. Mobile/Responsive Testing

### 11.1 Mobile Devices

- [ ] Test on iPhone (Safari)
- [ ] Test on Android phone (Chrome)
- [ ] Verify responsive layout
- [ ] Verify touch interactions work
- [ ] Verify all functionality accessible

**Expected Result:** Plugin works correctly on mobile devices

---

### 11.2 Tablet Devices

- [ ] Test on iPad (Safari)
- [ ] Test on Android tablet (Chrome)
- [ ] Verify responsive layout
- [ ] Verify touch interactions work
- [ ] Verify all functionality accessible

**Expected Result:** Plugin works correctly on tablet devices

---

## 12. Security Testing

### 12.1 Nonce Verification

- [ ] Open browser DevTools Network tab
- [ ] Make setting changes and save
- [ ] Verify nonce included in request
- [ ] Try to replay request without nonce
- [ ] Verify request rejected

**Expected Result:** Nonce verification prevents unauthorized requests

---

### 12.2 Capability Checks

- [ ] Log in as non-admin user
- [ ] Try to access MASE settings page
- [ ] Verify access denied
- [ ] Verify appropriate error message

**Expected Result:** Only administrators can access settings

---

### 12.3 XSS Prevention

- [ ] Enter JavaScript code in custom CSS field (e.g., `<script>alert('XSS')</script>`)
- [ ] Save settings
- [ ] Reload page
- [ ] Verify script not executed
- [ ] Verify code sanitized

**Expected Result:** XSS attempts prevented

---

## Testing Summary

### Completion Checklist

- [ ] All core functionality tests passed
- [ ] All WordPress version tests passed
- [ ] All theme compatibility tests passed
- [ ] All plugin compatibility tests passed
- [ ] All accessibility tests passed
- [ ] All error handling tests passed
- [ ] All performance tests passed
- [ ] All security tests passed

### Issues Found

| Issue # | Description | Severity | Status |
|---------|-------------|----------|--------|
| | | | |

### Test Results Summary

- **Total Tests:** [Count]
- **Passed:** [Count]
- **Failed:** [Count]
- **Blocked:** [Count]

### Sign-Off

- **Tester Name:** ___________________
- **Date:** ___________________
- **Status:** ☐ PASSED ☐ FAILED ☐ BLOCKED

---

**Document Version:** 1.0  
**Last Updated:** October 23, 2025  
**Task:** 21.2 - Perform manual testing
