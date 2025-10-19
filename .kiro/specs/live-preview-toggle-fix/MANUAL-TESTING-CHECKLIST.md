# Manual Testing Checklist - Live Preview Toggle Fix

## Overview

This checklist guides you through manual testing of all fixes implemented for the Live Preview toggle functionality. Complete each test in order and document any issues found.

**Test Environment:**
- Browser: Chrome/Firefox/Safari/Edge (test in primary browser first)
- WordPress Admin: Navigate to MASE settings page
- Console: Keep browser DevTools console open throughout testing

---

## 6.1 Toggle Interactions Testing

### Test 6.1.1: Live Preview Toggle - Click Functionality

**Objective:** Verify Live Preview toggle responds to clicks

**Steps:**
1. Open WordPress Admin → Settings → Modern Admin Styler
2. Locate the "Live Preview" toggle in the header (top-right area)
3. Note the current state (checked/unchecked)
4. Click directly on the checkbox
5. Click on the "Live Preview" text label
6. Click on the dashicon (eye icon)

**Expected Results:**
- ✓ Checkbox toggles state on each click
- ✓ State changes immediately (< 100ms)
- ✓ Clicking label toggles checkbox
- ✓ Clicking dashicon area toggles checkbox (pointer-events fix working)
- ✓ No console errors appear

**Verification:**
- [ ] Checkbox responds to direct clicks
- [ ] Label clicks toggle checkbox
- [ ] Dashicon area clicks pass through to checkbox
- [ ] State changes are immediate
- [ ] Console shows no errors

**Console Check:**
Look for these log messages:
```
MASE: Live preview state changed: true -> false
MASE: Disabling live preview...
```

---

### Test 6.1.2: Dark Mode Toggle - Click Functionality

**Objective:** Verify Dark Mode toggle responds to clicks

**Steps:**
1. Locate the "Dark Mode" toggle in the header
2. Note the current state (checked/unchecked)
3. Click directly on the checkbox
4. Click on the "Dark Mode" text label
5. Click on the dashicon (admin-appearance icon)

**Expected Results:**
- ✓ Checkbox toggles state on each click
- ✓ Dark theme applies/removes immediately
- ✓ Clicking label toggles checkbox
- ✓ Clicking dashicon area toggles checkbox
- ✓ No console errors appear

**Verification:**
- [ ] Checkbox responds to direct clicks
- [ ] Label clicks toggle checkbox
- [ ] Dashicon area clicks pass through to checkbox
- [ ] Dark theme applies/removes correctly
- [ ] Console shows no errors

---

### Test 6.1.3: Toggle State Persistence

**Objective:** Verify toggle states persist correctly

**Steps:**
1. Enable Live Preview toggle
2. Enable Dark Mode toggle
3. Click "Save Settings" button
4. Refresh the page
5. Verify both toggles maintain their enabled state

**Expected Results:**
- ✓ Toggle states persist after save
- ✓ Toggle states restore after page refresh
- ✓ No console errors

**Verification:**
- [ ] Live Preview state persists
- [ ] Dark Mode state persists
- [ ] States restore correctly after refresh

---

## 6.2 Color Picker Interactions Testing

### Test 6.2.1: WordPress Color Picker - Basic Interaction

**Objective:** Verify color pickers work correctly

**Steps:**
1. Scroll to "Color Customization" section
2. Click on any color picker (e.g., "Admin Bar Background")
3. Select a new color from the picker
4. Close the color picker
5. Verify the color preview updates

**Expected Results:**
- ✓ Color picker opens on click
- ✓ Color selection updates the preview
- ✓ Color value is saved
- ✓ No console errors

**Verification:**
- [ ] Color picker opens correctly
- [ ] Color selection works
- [ ] Preview updates immediately
- [ ] Console shows no errors

---

### Test 6.2.2: Live Preview with Color Changes

**Objective:** Verify live preview updates when colors change

**Steps:**
1. Enable Live Preview toggle
2. Change "Admin Bar Background" color
3. Observe the admin bar background color in real-time
4. Change "Admin Bar Text" color
5. Observe the admin bar text color in real-time

**Expected Results:**
- ✓ Admin bar background updates immediately
- ✓ Admin bar text color updates immediately
- ✓ Changes are visible without saving
- ✓ No console errors

**Verification:**
- [ ] Live preview updates on color change
- [ ] Updates are immediate (< 100ms)
- [ ] Multiple color changes work correctly
- [ ] Console shows no errors

**Console Check:**
Look for these log messages:
```
MASE: Live preview updating...
```

---

### Test 6.2.3: Fallback Input Synchronization

**Objective:** Verify fallback inputs sync with color pickers

**Steps:**
1. Open browser DevTools → Elements tab
2. Find a color picker input (e.g., `#admin-bar-bg-color`)
3. Look for the fallback input (e.g., `#admin-bar-bg-color-fallback`)
4. Change the color picker value
5. Inspect the fallback input value in DevTools
6. Verify they match

**Expected Results:**
- ✓ Fallback input exists for each color picker
- ✓ Fallback input value syncs with color picker
- ✓ Bidirectional sync works (both directions)
- ✓ No console errors

**Verification:**
- [ ] Fallback inputs exist
- [ ] Values sync correctly
- [ ] Sync is bidirectional
- [ ] Console shows no errors

---

### Test 6.2.4: Keyboard Navigation with Color Pickers

**Objective:** Verify color pickers are keyboard accessible

**Steps:**
1. Use Tab key to navigate to a color picker
2. Press Enter or Space to open the picker
3. Use arrow keys to adjust color
4. Press Tab to navigate within the picker
5. Press Escape to close the picker

**Expected Results:**
- ✓ Color pickers are reachable via Tab
- ✓ Enter/Space opens the picker
- ✓ Arrow keys work within picker
- ✓ Escape closes the picker
- ✓ Focus management is correct

**Verification:**
- [ ] Tab navigation works
- [ ] Keyboard shortcuts work
- [ ] Focus is managed correctly
- [ ] No keyboard traps exist

---

## 6.3 Template Application Testing

### Test 6.3.1: Navigate to Templates Tab

**Objective:** Verify tab navigation works correctly

**Steps:**
1. Click on the "Templates" tab button
2. Verify the Templates tab content becomes visible
3. Verify other tab contents are hidden
4. Check console for tab switch event

**Expected Results:**
- ✓ Templates tab content displays
- ✓ Other tabs are hidden
- ✓ Tab button shows active state
- ✓ Console shows tab switch event
- ✓ No console errors

**Verification:**
- [ ] Tab content displays correctly
- [ ] Tab switching works smoothly
- [ ] Active state is correct
- [ ] Console shows: `MASE: Switched to tab: templates`

---

### Test 6.3.2: Template Apply Buttons - Visibility

**Objective:** Verify all template apply buttons are visible

**Steps:**
1. Ensure you're on the Templates tab
2. Scroll through all template cards
3. Verify each card has a visible "Apply" button
4. Check button styling and positioning

**Expected Results:**
- ✓ All template cards have Apply buttons
- ✓ Buttons are visible (not hidden by CSS)
- ✓ Buttons are positioned correctly
- ✓ Hover states work correctly

**Verification:**
- [ ] All Apply buttons are visible
- [ ] Buttons are properly styled
- [ ] Hover effects work
- [ ] No layout issues

---

### Test 6.3.3: Template Application - Functionality

**Objective:** Verify templates apply correctly

**Steps:**
1. Click "Apply" on the first template (e.g., "Modern Blue")
2. Wait for confirmation message
3. Verify settings update to match template
4. Click "Apply" on a different template
5. Verify settings update again

**Expected Results:**
- ✓ Template applies successfully
- ✓ Success message appears
- ✓ Settings update to template values
- ✓ Multiple templates can be applied
- ✓ No console errors

**Verification:**
- [ ] Templates apply successfully
- [ ] Success messages appear
- [ ] Settings update correctly
- [ ] Multiple applications work
- [ ] Console shows no errors

**Console Check:**
Look for these log messages:
```
MASE: Applying template: modern-blue
MASE: Template applied successfully
```

---

### Test 6.3.4: Template Application with Live Preview

**Objective:** Verify templates work with live preview enabled

**Steps:**
1. Enable Live Preview toggle
2. Navigate to Templates tab
3. Click "Apply" on a template
4. Observe real-time changes in admin interface
5. Verify changes apply immediately

**Expected Results:**
- ✓ Template applies with live preview
- ✓ Changes are visible immediately
- ✓ Admin interface updates in real-time
- ✓ No console errors

**Verification:**
- [ ] Live preview works with templates
- [ ] Changes are immediate
- [ ] Interface updates correctly
- [ ] Console shows no errors

---

## 6.4 Accessibility Audit

### Test 6.4.1: Automated Accessibility Testing

**Objective:** Run automated accessibility audit

**Tools:** axe DevTools, WAVE, or Lighthouse

**Steps:**
1. Install axe DevTools browser extension (if not installed)
2. Open MASE settings page
3. Open axe DevTools panel
4. Click "Scan ALL of my page"
5. Review results for violations

**Expected Results:**
- ✓ No critical accessibility violations
- ✓ ARIA attributes are correct
- ✓ Color contrast meets WCAG AA standards
- ✓ Form labels are properly associated

**Verification:**
- [ ] Zero critical violations
- [ ] ARIA attributes validated
- [ ] Color contrast passes
- [ ] Form labels correct

**Document Issues:**
```
Issue: [Description]
Severity: [Critical/Serious/Moderate/Minor]
Element: [CSS selector]
Recommendation: [How to fix]
```

---

### Test 6.4.2: ARIA Attributes Verification

**Objective:** Verify ARIA attributes are correct

**Steps:**
1. Open DevTools → Elements tab
2. Inspect Live Preview toggle
3. Verify `role="switch"` attribute
4. Verify `aria-checked` updates on toggle
5. Inspect Dark Mode toggle
6. Verify same ARIA attributes

**Expected Results:**
- ✓ Toggles have `role="switch"`
- ✓ `aria-checked` reflects current state
- ✓ `aria-label` provides context
- ✓ Dashicons have `aria-hidden="true"`

**Verification:**
- [ ] role="switch" present
- [ ] aria-checked updates correctly
- [ ] aria-label is descriptive
- [ ] Decorative icons hidden from AT

---

### Test 6.4.3: Screen Reader Testing

**Objective:** Test with screen reader (NVDA/JAWS/VoiceOver)

**Tools:** NVDA (Windows), JAWS (Windows), or VoiceOver (Mac)

**Steps:**
1. Start screen reader
2. Navigate to MASE settings page
3. Tab to Live Preview toggle
4. Listen to announcement
5. Toggle the switch
6. Listen to state change announcement
7. Repeat for Dark Mode toggle

**Expected Results:**
- ✓ Toggle is announced as "switch"
- ✓ Current state is announced (on/off)
- ✓ Label is read correctly
- ✓ State changes are announced
- ✓ No confusing announcements

**Verification:**
- [ ] Toggles announced correctly
- [ ] States are clear
- [ ] Labels are descriptive
- [ ] State changes announced

**Announcement Examples:**
```
Expected: "Live Preview, switch, checked"
Expected: "Dark Mode, switch, not checked"
```

---

### Test 6.4.4: Keyboard Navigation Testing

**Objective:** Verify full keyboard accessibility

**Steps:**
1. Close mouse/trackpad (keyboard only)
2. Press Tab to navigate through page
3. Verify focus indicators are visible
4. Press Space to toggle switches
5. Press Enter on buttons
6. Press Escape to close modals/pickers
7. Verify no keyboard traps

**Expected Results:**
- ✓ All interactive elements reachable via Tab
- ✓ Focus indicators are visible
- ✓ Space toggles switches
- ✓ Enter activates buttons
- ✓ Escape closes overlays
- ✓ No keyboard traps exist
- ✓ Tab order is logical

**Verification:**
- [ ] Tab navigation works completely
- [ ] Focus indicators visible
- [ ] Keyboard shortcuts work
- [ ] No keyboard traps
- [ ] Logical tab order

---

## Summary Checklist

### Critical Functionality
- [ ] Live Preview toggle responds to clicks
- [ ] Dark Mode toggle responds to clicks
- [ ] Dashicon pointer-events fix working
- [ ] Color pickers are functional
- [ ] Live preview updates on color changes
- [ ] Template apply buttons are visible
- [ ] Templates apply successfully

### Accessibility
- [ ] Zero critical accessibility violations
- [ ] ARIA attributes correct
- [ ] Screen reader announces correctly
- [ ] Full keyboard navigation works
- [ ] No keyboard traps

### Performance
- [ ] Toggle response < 100ms
- [ ] Live preview updates < 100ms
- [ ] No console errors
- [ ] No JavaScript exceptions

### Browser Compatibility
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari (if available)
- [ ] Tested in Edge (if available)

---

## Issue Reporting Template

If you find any issues during testing, document them using this template:

```markdown
### Issue: [Brief Description]

**Test:** [Test number and name]
**Severity:** [Critical/High/Medium/Low]
**Browser:** [Browser name and version]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Console Errors:**
```
[Paste any console errors]
```

**Screenshots:**
[Attach screenshots if relevant]

**Additional Notes:**
[Any other relevant information]
```

---

## Completion Criteria

All tests must pass before marking Task 6 as complete:

- ✓ All toggle interactions work correctly
- ✓ All color picker interactions work correctly
- ✓ All template applications work correctly
- ✓ Accessibility audit shows no critical issues
- ✓ Screen reader testing passes
- ✓ Keyboard navigation is fully functional
- ✓ No console errors during any test
- ✓ Tested in at least 2 browsers

**Estimated Testing Time:** 45-60 minutes

---

## Next Steps After Testing

1. Document any issues found
2. Create bug reports for critical issues
3. Mark Task 6 as complete if all tests pass
4. Proceed to Task 7: Run Full Test Suite
