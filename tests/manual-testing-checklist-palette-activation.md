# Manual Testing Checklist - Color Palette Selector & Activation

## Overview
This document provides a comprehensive manual testing checklist for the MASE color palette selector and activation functionality. Follow each section systematically to ensure all features work correctly across different browsers, devices, and scenarios.

**Test Environment Requirements:**
- WordPress installation with MASE plugin active
- Admin user account with `manage_options` capability
- Multiple browsers installed (Chrome, Firefox, Safari, Edge)
- Browser DevTools for network throttling
- Screen reader software (NVDA or JAWS) for accessibility testing

---

## 1. Browser Compatibility Testing

### 1.1 Chrome Testing
- [ ] Navigate to MASE settings page
- [ ] Verify palette grid displays correctly (5 columns on desktop)
- [ ] Verify all 10 palette cards render properly
- [ ] Verify color circles display correct colors
- [ ] Verify active badge appears on current palette
- [ ] Click a non-active palette card
- [ ] Verify confirmation dialog appears
- [ ] Confirm and verify palette applies successfully
- [ ] Verify success notification appears and auto-dismisses after 3 seconds
- [ ] Reload page and verify palette persists

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 1.2 Firefox Testing
- [ ] Navigate to MASE settings page
- [ ] Verify palette grid displays correctly
- [ ] Verify hover effects work smoothly
- [ ] Click a palette card to activate
- [ ] Verify confirmation dialog appears
- [ ] Confirm and verify palette applies
- [ ] Verify notification styling is correct
- [ ] Test keyboard navigation (Tab through cards)
- [ ] Press Enter on focused card
- [ ] Verify activation works via keyboard

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 1.3 Safari Testing
- [ ] Navigate to MASE settings page
- [ ] Verify CSS Grid layout renders correctly
- [ ] Verify border-radius and shadows display properly
- [ ] Click a palette card
- [ ] Verify confirmation dialog (native Safari style)
- [ ] Confirm and verify palette applies
- [ ] Verify transitions and animations work
- [ ] Test on macOS Safari (latest version)
- [ ] Test on iOS Safari if available

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 1.4 Edge Testing
- [ ] Navigate to MASE settings page
- [ ] Verify all visual elements render correctly
- [ ] Verify hover states work
- [ ] Click a palette card
- [ ] Verify confirmation dialog appears
- [ ] Confirm and verify palette applies
- [ ] Verify success notification displays
- [ ] Test keyboard navigation
- [ ] Verify focus indicators are visible

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

## 2. Responsive Design Testing

### 2.1 Desktop (>1024px)
- [ ] Set viewport to 1920x1080
- [ ] Verify 5-column grid layout
- [ ] Verify card spacing is consistent (16px gaps)
- [ ] Verify color circles are 40px diameter
- [ ] Verify font sizes are correct (14px for palette name)
- [ ] Hover over cards and verify lift effect
- [ ] Hover over color circles and verify scale effect
- [ ] Click and activate a palette
- [ ] Verify all interactions work smoothly

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 2.2 Tablet (768px - 1024px)
- [ ] Set viewport to 768x1024 (iPad portrait)
- [ ] Verify 3-column grid layout
- [ ] Verify cards resize appropriately
- [ ] Verify spacing remains consistent
- [ ] Verify all text remains readable
- [ ] Test touch interactions (if on actual tablet)
- [ ] Click/tap a palette card
- [ ] Verify confirmation dialog is readable
- [ ] Verify activation works correctly

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 2.3 Mobile (<768px)
- [ ] Set viewport to 375x667 (iPhone SE)
- [ ] Verify 2-column grid layout
- [ ] Verify card padding reduced to 12px
- [ ] Verify color circles reduced to 32px diameter
- [ ] Verify palette name font size reduced to 13px
- [ ] Verify touch targets are at least 44px (Apply button)
- [ ] Tap a palette card
- [ ] Verify confirmation dialog is usable on small screen
- [ ] Confirm and verify palette applies
- [ ] Verify notification is readable on mobile

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 2.4 Extra Small Mobile (320px)
- [ ] Set viewport to 320x568 (iPhone 5/SE)
- [ ] Verify 2-column grid still works
- [ ] Verify no horizontal scrolling
- [ ] Verify all content remains accessible
- [ ] Verify buttons remain tappable
- [ ] Test palette activation
- [ ] Verify notification doesn't overflow

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

## 3. Functional Testing

### 3.1 Clicking Different Palette Cards
- [ ] Identify currently active palette (has "Active" badge)
- [ ] Click on "Professional Blue" palette
- [ ] Verify confirmation dialog shows correct palette name
- [ ] Confirm and verify it activates
- [ ] Click on "Creative Purple" palette
- [ ] Verify confirmation dialog appears
- [ ] Confirm and verify it activates
- [ ] Click on "Energetic Green" palette
- [ ] Verify activation works
- [ ] Test at least 5 different palettes
- [ ] Verify each palette applies correctly

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 3.2 Clicking Already Active Palette
- [ ] Identify currently active palette (has "Active" badge)
- [ ] Click on the active palette card
- [ ] Verify NO confirmation dialog appears
- [ ] Verify console shows "Palette already active" message
- [ ] Verify no AJAX request is sent (check Network tab)
- [ ] Verify UI remains unchanged
- [ ] Verify no notification appears

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 3.3 Canceling Confirmation Dialog
- [ ] Click on a non-active palette card
- [ ] Verify confirmation dialog appears
- [ ] Click "Cancel" button
- [ ] Verify dialog closes
- [ ] Verify no AJAX request is sent (check Network tab)
- [ ] Verify active palette remains unchanged
- [ ] Verify no notification appears
- [ ] Verify UI returns to previous state

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 3.4 Success Notification Behavior
- [ ] Click and activate a palette
- [ ] Confirm the dialog
- [ ] Verify success notification appears
- [ ] Verify notification includes palette name
- [ ] Verify notification has green/success styling
- [ ] Start timer when notification appears
- [ ] Verify notification auto-dismisses after ~3 seconds
- [ ] Verify notification fades out smoothly
- [ ] Verify notification is removed from DOM after fade

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 3.5 Palette Persistence After Reload
- [ ] Note currently active palette
- [ ] Click and activate a different palette
- [ ] Confirm and wait for success notification
- [ ] Reload the page (F5 or Cmd+R)
- [ ] Verify the newly activated palette shows "Active" badge
- [ ] Verify the correct palette is marked as active
- [ ] Verify settings were persisted to database

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

## 4. Network Testing

### 4.1 Slow Network (3G Throttling)
- [ ] Open DevTools → Network tab
- [ ] Set throttling to "Slow 3G"
- [ ] Click on a palette card
- [ ] Confirm the dialog
- [ ] Verify "Applying..." text appears on button
- [ ] Verify button is disabled during request
- [ ] Wait for request to complete (may take several seconds)
- [ ] Verify success notification appears after delay
- [ ] Verify palette activates correctly
- [ ] Verify button returns to normal state

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 4.2 Network Disconnection During Request
- [ ] Open DevTools → Network tab
- [ ] Click on a palette card
- [ ] Confirm the dialog
- [ ] Immediately set Network to "Offline" (before request completes)
- [ ] Verify error notification appears
- [ ] Verify error message is helpful
- [ ] Verify UI rolls back to previous active palette
- [ ] Verify previously active palette shows "Active" badge again
- [ ] Verify button returns to enabled state
- [ ] Check console for error details

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 4.3 Request Timeout
- [ ] Open DevTools → Network tab
- [ ] Set throttling to "Slow 3G"
- [ ] Click on a palette card
- [ ] Confirm the dialog
- [ ] Wait for timeout (30 seconds)
- [ ] Verify error notification appears
- [ ] Verify UI rolls back correctly
- [ ] Verify error is logged to console

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

## 5. Keyboard Navigation Testing

### 5.1 Tab Navigation
- [ ] Click in browser address bar to reset focus
- [ ] Press Tab repeatedly to navigate through page
- [ ] Verify focus moves to first palette card
- [ ] Verify focus indicator is clearly visible
- [ ] Continue pressing Tab
- [ ] Verify focus moves through all palette cards in order
- [ ] Verify focus indicator remains visible on each card
- [ ] Verify tab order is logical (left to right, top to bottom)

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 5.2 Enter Key Activation
- [ ] Tab to a non-active palette card
- [ ] Verify card has visible focus indicator
- [ ] Press Enter key
- [ ] Verify confirmation dialog appears
- [ ] Press Enter again to confirm (or Tab to OK and press Enter)
- [ ] Verify palette activates
- [ ] Verify success notification appears
- [ ] Verify activation works identically to mouse click

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 5.3 Space Key Activation
- [ ] Tab to a non-active palette card
- [ ] Verify card has visible focus indicator
- [ ] Press Space key
- [ ] Verify confirmation dialog appears
- [ ] Confirm the dialog
- [ ] Verify palette activates
- [ ] Verify success notification appears
- [ ] Verify Space key works identically to Enter key

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 5.4 Shift+Tab Reverse Navigation
- [ ] Tab to a palette card in the middle of the grid
- [ ] Press Shift+Tab
- [ ] Verify focus moves backward to previous card
- [ ] Continue pressing Shift+Tab
- [ ] Verify focus moves backward through all cards
- [ ] Verify focus indicators remain visible

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

## 6. Screen Reader Testing

### 6.1 NVDA Testing (Windows)
- [ ] Start NVDA screen reader
- [ ] Navigate to MASE settings page
- [ ] Tab to first palette card
- [ ] Verify NVDA announces: "Apply [Palette Name] palette, button"
- [ ] Verify palette name is announced clearly
- [ ] Tab through several palette cards
- [ ] Verify each card is announced with correct name
- [ ] Tab to active palette card
- [ ] Verify active state is communicated (check for "Active" badge announcement)
- [ ] Press Enter on a non-active card
- [ ] Verify confirmation dialog is announced
- [ ] Confirm and verify success notification is announced

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 6.2 JAWS Testing (Windows)
- [ ] Start JAWS screen reader
- [ ] Navigate to MASE settings page
- [ ] Tab to first palette card
- [ ] Verify JAWS announces: "Apply [Palette Name] palette, button"
- [ ] Tab through palette cards
- [ ] Verify each card is announced correctly
- [ ] Verify role="button" is recognized
- [ ] Press Enter to activate a palette
- [ ] Verify confirmation dialog is accessible
- [ ] Verify success notification is announced

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 6.3 VoiceOver Testing (macOS/iOS)
- [ ] Enable VoiceOver (Cmd+F5 on Mac)
- [ ] Navigate to MASE settings page
- [ ] Use VoiceOver navigation to reach palette cards
- [ ] Verify palette cards are announced correctly
- [ ] Verify aria-label is read properly
- [ ] Activate a palette using VoiceOver
- [ ] Verify confirmation dialog is accessible
- [ ] Verify notifications are announced

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

## 7. Error Scenario Testing

### 7.1 Invalid Nonce Error
**Setup:** Requires modifying nonce value in browser DevTools
- [ ] Open DevTools → Console
- [ ] Run: `$('#mase_nonce').val('invalid_nonce')`
- [ ] Click on a palette card
- [ ] Confirm the dialog
- [ ] Verify error notification appears
- [ ] Verify error message mentions security/permission issue
- [ ] Verify UI rolls back to previous active palette
- [ ] Verify error is logged to console

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 7.2 Missing Palette ID Error
**Setup:** Requires modifying HTML in browser DevTools
- [ ] Open DevTools → Elements
- [ ] Find a palette card element
- [ ] Remove the `data-palette` attribute
- [ ] Click on that palette card
- [ ] Verify error is logged to console: "Palette ID not found"
- [ ] Verify no confirmation dialog appears
- [ ] Verify no AJAX request is sent
- [ ] Verify no notification appears

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 7.3 Server Error Response
**Setup:** Requires server-side modification or network interception
- [ ] Simulate server returning 500 error
- [ ] Click on a palette card
- [ ] Confirm the dialog
- [ ] Verify error notification appears
- [ ] Verify error message is displayed to user
- [ ] Verify UI rolls back correctly
- [ ] Verify previously active palette is restored
- [ ] Verify error details are logged to console

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 7.4 Non-Existent Palette Error
**Setup:** Requires modifying palette ID in browser DevTools
- [ ] Open DevTools → Elements
- [ ] Find a palette card element
- [ ] Change `data-palette` to "non-existent-palette"
- [ ] Click on that palette card
- [ ] Confirm the dialog
- [ ] Verify error notification appears
- [ ] Verify error message mentions palette not found
- [ ] Verify UI rolls back correctly

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

## 8. UI Rollback Testing

### 8.1 Rollback on Network Error
- [ ] Note currently active palette
- [ ] Click on a different palette card
- [ ] Confirm the dialog
- [ ] Verify new palette shows "Active" badge immediately
- [ ] Verify button shows "Applying..."
- [ ] Disconnect network before request completes
- [ ] Verify error notification appears
- [ ] Verify "Active" badge returns to original palette
- [ ] Verify new palette no longer shows "Active" badge
- [ ] Verify button returns to normal state

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 8.2 Rollback on Server Error
- [ ] Note currently active palette
- [ ] Simulate server error (if possible)
- [ ] Click on a different palette card
- [ ] Confirm the dialog
- [ ] Verify optimistic UI update occurs
- [ ] Wait for error response
- [ ] Verify error notification appears
- [ ] Verify UI rolls back to previous state
- [ ] Verify original palette shows "Active" badge
- [ ] Verify button state is restored

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

## 9. Visual and Interaction Testing

### 9.1 Hover Effects
- [ ] Hover over a palette card
- [ ] Verify card lifts slightly (translateY(-2px))
- [ ] Verify box-shadow increases
- [ ] Verify transition is smooth (200ms)
- [ ] Hover over color circles
- [ ] Verify circles scale to 110%
- [ ] Verify transition is smooth
- [ ] Hover over Apply button
- [ ] Verify background color darkens
- [ ] Verify button lifts slightly

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 9.2 Active State Visual Indicators
- [ ] Identify active palette card
- [ ] Verify card has 2px blue border (#0073aa)
- [ ] Verify card has light blue background (#f0f6fc)
- [ ] Verify "Active" badge is visible in top-right
- [ ] Verify badge has blue background with white text
- [ ] Verify badge text is "ACTIVE" (uppercase)
- [ ] Verify active card stands out from other cards

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 9.3 Loading State
- [ ] Set network to "Slow 3G" in DevTools
- [ ] Click on a palette card
- [ ] Confirm the dialog
- [ ] Immediately observe the Apply button
- [ ] Verify button text changes to "Applying..."
- [ ] Verify button is disabled (cursor: not-allowed)
- [ ] Verify button cannot be clicked again
- [ ] Wait for request to complete
- [ ] Verify button returns to "Apply Palette" text
- [ ] Verify button is re-enabled

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 9.4 Reduced Motion Support
- [ ] Open browser settings
- [ ] Enable "Reduce motion" or "prefers-reduced-motion"
  - **Windows:** Settings → Ease of Access → Display → Show animations
  - **macOS:** System Preferences → Accessibility → Display → Reduce motion
  - **DevTools:** Rendering → Emulate CSS media feature prefers-reduced-motion
- [ ] Reload MASE settings page
- [ ] Hover over palette cards
- [ ] Verify no transform animations occur
- [ ] Verify transitions are minimal or instant
- [ ] Click and activate a palette
- [ ] Verify functionality still works
- [ ] Verify no motion sickness-inducing animations

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

## 10. Console and Network Monitoring

### 10.1 Console Messages
- [ ] Open DevTools → Console
- [ ] Clear console
- [ ] Click on a palette card
- [ ] Verify console shows: "MASE: Palette clicked: [palette-id]"
- [ ] Confirm the dialog
- [ ] Verify console shows success message
- [ ] Click on already active palette
- [ ] Verify console shows: "MASE: Palette already active: [palette-id]"
- [ ] Verify no JavaScript errors appear
- [ ] Verify no warnings appear

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 10.2 Network Requests
- [ ] Open DevTools → Network tab
- [ ] Filter by "XHR" or "Fetch"
- [ ] Click on a palette card
- [ ] Confirm the dialog
- [ ] Verify AJAX request appears in Network tab
- [ ] Click on the request to inspect
- [ ] Verify URL is `admin-ajax.php`
- [ ] Verify Method is "POST"
- [ ] Verify Request Payload includes:
  - `action: mase_apply_palette`
  - `nonce: [valid nonce]`
  - `palette_id: [selected palette]`
- [ ] Verify Response is JSON with success: true
- [ ] Verify Response includes palette_id and palette_name

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

## 11. Cross-Browser Consistency

### 11.1 Visual Consistency
- [ ] Take screenshots in Chrome, Firefox, Safari, Edge
- [ ] Compare grid layouts across browsers
- [ ] Verify color circles render identically
- [ ] Verify borders and shadows are consistent
- [ ] Verify fonts render similarly
- [ ] Verify spacing is consistent
- [ ] Note any significant differences

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 11.2 Functional Consistency
- [ ] Test palette activation in each browser
- [ ] Verify confirmation dialogs work in all browsers
- [ ] Verify AJAX requests succeed in all browsers
- [ ] Verify notifications display correctly in all browsers
- [ ] Verify keyboard navigation works in all browsers
- [ ] Verify error handling works in all browsers

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

## 12. Edge Cases

### 12.1 Rapid Clicking
- [ ] Click on a palette card
- [ ] Immediately click on another palette card (before first completes)
- [ ] Verify system handles rapid clicks gracefully
- [ ] Verify no race conditions occur
- [ ] Verify only one request is processed
- [ ] Verify UI state remains consistent

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 12.2 Multiple Browser Tabs
- [ ] Open MASE settings in two browser tabs
- [ ] Activate a palette in Tab 1
- [ ] Switch to Tab 2
- [ ] Reload Tab 2
- [ ] Verify Tab 2 shows the newly activated palette
- [ ] Activate a different palette in Tab 2
- [ ] Switch to Tab 1
- [ ] Reload Tab 1
- [ ] Verify Tab 1 shows the palette from Tab 2

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

### 12.3 Long Palette Names
**Setup:** Requires modifying palette name in code temporarily
- [ ] Create a palette with very long name (50+ characters)
- [ ] Verify name truncates with ellipsis
- [ ] Verify card layout doesn't break
- [ ] Verify confirmation dialog shows full name
- [ ] Verify notification shows full or truncated name appropriately

**Result:** ☐ Pass ☐ Fail  
**Notes:**

---

## Summary

### Overall Test Results
- **Total Tests:** 60+
- **Passed:** ___
- **Failed:** ___
- **Blocked:** ___
- **Not Tested:** ___

### Critical Issues Found
1. 
2. 
3. 

### Minor Issues Found
1. 
2. 
3. 

### Browser-Specific Issues
- **Chrome:** 
- **Firefox:** 
- **Safari:** 
- **Edge:** 

### Recommendations
1. 
2. 
3. 

### Sign-Off
- **Tester Name:** _______________
- **Date:** _______________
- **Overall Status:** ☐ Approved ☐ Approved with Issues ☐ Rejected

---

## Notes
- This checklist should be completed by a human tester
- Each section can be tested independently
- Document all issues with screenshots when possible
- Use browser DevTools extensively for debugging
- Test on real devices when possible, not just emulators
- Retest failed items after fixes are applied
