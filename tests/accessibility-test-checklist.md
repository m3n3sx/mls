# MASE CSS Accessibility Test Checklist

## Overview

This comprehensive checklist ensures the Modern Admin Styler Enterprise (MASE) CSS framework meets WCAG 2.1 Level AA accessibility standards. Complete all tests to verify keyboard navigation, screen reader support, color contrast, and reduced motion features.

**Requirements Coverage:** 10.1-10.6, 9.7

---

## 1. Keyboard Navigation Tests

### 1.1 Tab Navigation
**Requirement:** 10.1, 10.3

- [ ] **Test 1.1.1:** Press `Tab` from the top of the page
  - Expected: Focus moves to the first interactive element
  - Expected: "Skip to main content" link appears and is visible
  - Pass/Fail: ___________

- [ ] **Test 1.1.2:** Continue pressing `Tab` through all elements
  - Expected: Focus moves through all interactive elements in logical order
  - Expected: Tab order follows visual layout (left-to-right, top-to-bottom)
  - Pass/Fail: ___________

- [ ] **Test 1.1.3:** Press `Shift + Tab` to navigate backward
  - Expected: Focus moves backward through elements in reverse order
  - Expected: Focus indicators remain visible throughout
  - Pass/Fail: ___________

- [ ] **Test 1.1.4:** Tab through header action buttons
  - Expected: All buttons (Export, Import, Reset, Save) are focusable
  - Expected: Live Preview toggle is focusable
  - Pass/Fail: ___________

### 1.2 Focus Indicators
**Requirement:** 10.2

- [ ] **Test 1.2.1:** Focus on any button
  - Expected: 2px solid blue outline appears
  - Expected: 2px offset from button edge
  - Expected: Outline color is #0073aa
  - Pass/Fail: ___________

- [ ] **Test 1.2.2:** Focus on text input
  - Expected: Border color changes to #0073aa
  - Expected: Box shadow appears (0 0 0 3px rgba(0, 115, 170, 0.1))
  - Pass/Fail: ___________

- [ ] **Test 1.2.3:** Focus on toggle switch
  - Expected: 2px outline appears around toggle container
  - Expected: Outline is clearly visible
  - Pass/Fail: ___________

- [ ] **Test 1.2.4:** Focus on slider
  - Expected: Slider thumb has visible focus indicator
  - Expected: Outline is distinct from hover state
  - Pass/Fail: ___________

- [ ] **Test 1.2.5:** Focus on tab navigation
  - Expected: Focused tab has visible outline
  - Expected: Outline is visible even on active tab
  - Pass/Fail: ___________

### 1.3 Keyboard Activation
**Requirement:** 10.1

- [ ] **Test 1.3.1:** Focus on button and press `Enter`
  - Expected: Button activates
  - Expected: Visual feedback provided
  - Pass/Fail: ___________

- [ ] **Test 1.3.2:** Focus on button and press `Space`
  - Expected: Button activates
  - Expected: Same behavior as Enter key
  - Pass/Fail: ___________

- [ ] **Test 1.3.3:** Focus on toggle and press `Space`
  - Expected: Toggle switches state
  - Expected: Visual state change is immediate
  - Pass/Fail: ___________

- [ ] **Test 1.3.4:** Focus on tab and press `Enter` or `Space`
  - Expected: Tab becomes active
  - Expected: Content area updates
  - Pass/Fail: ___________

### 1.4 Skip Navigation
**Requirement:** 10.7

- [ ] **Test 1.4.1:** Press `Tab` from page top
  - Expected: "Skip to main content" link appears
  - Expected: Link is visually distinct and readable
  - Pass/Fail: ___________

- [ ] **Test 1.4.2:** Activate skip link with `Enter`
  - Expected: Focus moves to main content area
  - Expected: Header and navigation are bypassed
  - Pass/Fail: ___________

---

## 2. Screen Reader Support Tests

### 2.1 Screen Reader Only Content
**Requirement:** 10.4, 13.2

- [ ] **Test 2.1.1:** Inspect elements with `.mase-sr-only` class
  - Expected: Content is hidden visually (position: absolute, clip)
  - Expected: Content is still in DOM and accessible to screen readers
  - Expected: Width and height are 1px
  - Pass/Fail: ___________

- [ ] **Test 2.1.2:** Test with screen reader (NVDA/JAWS/VoiceOver)
  - Expected: Screen reader announces `.mase-sr-only` content
  - Expected: Sighted users do not see the content
  - Pass/Fail: ___________

### 2.2 ARIA Labels
**Requirement:** 10.4

- [ ] **Test 2.2.1:** Inspect icon-only buttons
  - Expected: All icon-only buttons have `aria-label` attribute
  - Expected: Labels are descriptive (e.g., "Save settings", "Delete item")
  - Pass/Fail: ___________

- [ ] **Test 2.2.2:** Test with screen reader
  - Expected: Screen reader announces button purpose from aria-label
  - Expected: Icon emoji is ignored or announced appropriately
  - Pass/Fail: ___________

- [ ] **Test 2.2.3:** Check Live Preview toggle
  - Expected: Toggle has associated label text
  - Expected: Screen reader announces "Live Preview" and state
  - Pass/Fail: ___________

### 2.3 Live Regions
**Requirement:** 10.6

- [ ] **Test 2.3.1:** Inspect notice components
  - Expected: Notices have `role="status"` or `role="alert"`
  - Expected: Success/info notices use `aria-live="polite"`
  - Expected: Error notices use `aria-live="assertive"`
  - Pass/Fail: ___________

- [ ] **Test 2.3.2:** Trigger a success notice
  - Expected: Screen reader announces the message
  - Expected: Announcement doesn't interrupt current reading
  - Pass/Fail: ___________

- [ ] **Test 2.3.3:** Trigger an error notice
  - Expected: Screen reader announces immediately
  - Expected: User is alerted to the error
  - Pass/Fail: ___________

### 2.4 Semantic HTML
**Requirement:** 10.6

- [ ] **Test 2.4.1:** Inspect page structure
  - Expected: Proper use of `<nav>`, `<main>`, `<section>`, `<header>`
  - Expected: Headings follow logical hierarchy (h1 → h2 → h3)
  - Pass/Fail: ___________

- [ ] **Test 2.4.2:** Check form elements
  - Expected: All inputs have associated `<label>` elements
  - Expected: Labels use `for` attribute or wrap inputs
  - Pass/Fail: ___________

- [ ] **Test 2.4.3:** Verify button elements
  - Expected: Clickable elements use `<button>` not `<div>`
  - Expected: Links use `<a>` with proper `href`
  - Pass/Fail: ___________

---

## 3. Color Contrast Tests

### 3.1 Text Contrast
**Requirement:** 10.5

- [ ] **Test 3.1.1:** Primary text (#1e1e1e on #ffffff)
  - Tool: WebAIM Contrast Checker or browser DevTools
  - Expected: Contrast ratio ≥ 4.5:1 (WCAG AA)
  - Actual ratio: ___________
  - Pass/Fail: ___________

- [ ] **Test 3.1.2:** Secondary text (#646970 on #ffffff)
  - Expected: Contrast ratio ≥ 4.5:1
  - Actual ratio: ___________
  - Pass/Fail: ___________

- [ ] **Test 3.1.3:** Link text (#0073aa on #ffffff)
  - Expected: Contrast ratio ≥ 4.5:1
  - Actual ratio: ___________
  - Pass/Fail: ___________

- [ ] **Test 3.1.4:** Button text (white on #0073aa)
  - Expected: Contrast ratio ≥ 4.5:1
  - Actual ratio: ___________
  - Pass/Fail: ___________

- [ ] **Test 3.1.5:** Error text (#d63638 on #ffffff)
  - Expected: Contrast ratio ≥ 4.5:1
  - Actual ratio: ___________
  - Pass/Fail: ___________

### 3.2 UI Component Contrast
**Requirement:** 10.5

- [ ] **Test 3.2.1:** Input borders (#9ca3af on #ffffff)
  - Expected: Contrast ratio ≥ 3:1 (WCAG AA for UI components)
  - Actual ratio: ___________
  - Pass/Fail: ___________

- [ ] **Test 3.2.2:** Toggle switch background (off state: #d1d5db)
  - Expected: Contrast ratio ≥ 3:1 against white background
  - Actual ratio: ___________
  - Pass/Fail: ___________

- [ ] **Test 3.2.3:** Card borders (#e5e7eb on #ffffff)
  - Expected: Contrast ratio ≥ 3:1
  - Actual ratio: ___________
  - Pass/Fail: ___________

- [ ] **Test 3.2.4:** Tab borders and separators
  - Expected: Contrast ratio ≥ 3:1
  - Actual ratio: ___________
  - Pass/Fail: ___________

### 3.3 Focus Indicator Contrast
**Requirement:** 10.2

- [ ] **Test 3.3.1:** Focus outline on light backgrounds
  - Expected: Blue outline (#0073aa) has ≥ 3:1 contrast
  - Actual ratio: ___________
  - Pass/Fail: ___________

- [ ] **Test 3.3.2:** Focus outline on primary buttons
  - Expected: Outline visible against button background
  - Expected: Sufficient contrast with surrounding area
  - Pass/Fail: ___________

### 3.4 High Contrast Mode
**Requirement:** 10.5

- [ ] **Test 3.4.1:** Enable Windows High Contrast Mode
  - Expected: All text remains readable
  - Expected: Borders and outlines are visible
  - Pass/Fail: ___________

- [ ] **Test 3.4.2:** Test with browser high contrast extension
  - Expected: Interface remains usable
  - Expected: No information is lost
  - Pass/Fail: ___________

---

## 4. Reduced Motion Tests

### 4.1 Reduced Motion Detection
**Requirement:** 9.7

- [ ] **Test 4.1.1:** Check CSS for `@media (prefers-reduced-motion: reduce)`
  - Expected: Media query is present in CSS
  - Expected: Covers all animated elements
  - Pass/Fail: ___________

- [ ] **Test 4.1.2:** Verify animation properties are disabled
  - Expected: `animation-duration: 0.01ms !important`
  - Expected: `transition-duration: 0.01ms !important`
  - Expected: `animation-iteration-count: 1 !important`
  - Pass/Fail: ___________

### 4.2 Operating System Settings
**Requirement:** 9.7

- [ ] **Test 4.2.1:** Windows - Enable "Show animations"
  - Path: Settings → Ease of Access → Display → Show animations (OFF)
  - Expected: All animations stop
  - Expected: State changes are instant
  - Pass/Fail: ___________

- [ ] **Test 4.2.2:** macOS - Enable "Reduce motion"
  - Path: System Preferences → Accessibility → Display → Reduce motion (ON)
  - Expected: All animations stop
  - Expected: Functionality remains intact
  - Pass/Fail: ___________

- [ ] **Test 4.2.3:** Linux - Reduce animation
  - Path: Settings → Universal Access → Reduce animation (ON)
  - Expected: All animations stop
  - Pass/Fail: ___________

### 4.3 Browser DevTools Testing
**Requirement:** 9.7

- [ ] **Test 4.3.1:** Chrome DevTools
  - Open DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion: reduce
  - Expected: All animations stop immediately
  - Pass/Fail: ___________

- [ ] **Test 4.3.2:** Firefox DevTools
  - Open DevTools → Accessibility → Simulate → prefers-reduced-motion: reduce
  - Expected: All animations stop immediately
  - Pass/Fail: ___________

### 4.4 Component-Specific Tests
**Requirement:** 9.7

- [ ] **Test 4.4.1:** Button hover effects
  - Normal: Button lifts with transform
  - Reduced: No transform, instant color change only
  - Pass/Fail: ___________

- [ ] **Test 4.4.2:** Toggle switch animation
  - Normal: Smooth slide transition (200ms)
  - Reduced: Instant position change
  - Pass/Fail: ___________

- [ ] **Test 4.4.3:** Slider movement
  - Normal: Smooth value transition
  - Reduced: Instant value update
  - Pass/Fail: ___________

- [ ] **Test 4.4.4:** Tab switching
  - Normal: Background color fades (200ms)
  - Reduced: Instant color change
  - Pass/Fail: ___________

- [ ] **Test 4.4.5:** Notice appearance
  - Normal: Slide-in animation
  - Reduced: Instant appearance
  - Pass/Fail: ___________

- [ ] **Test 4.4.6:** Loading states
  - Normal: Spinning animation
  - Reduced: Gentle pulsing or static indicator
  - Pass/Fail: ___________

### 4.5 Functionality Verification
**Requirement:** 9.7

- [ ] **Test 4.5.1:** All features work without animations
  - Expected: No functionality is lost
  - Expected: State changes are clear despite being instant
  - Pass/Fail: ___________

- [ ] **Test 4.5.2:** Focus indicators remain visible
  - Expected: Focus outlines still appear
  - Expected: Keyboard navigation unaffected
  - Pass/Fail: ___________

- [ ] **Test 4.5.3:** Hover states provide feedback
  - Expected: Color changes still occur
  - Expected: Visual feedback is immediate
  - Pass/Fail: ___________

---

## 5. Additional Accessibility Tests

### 5.1 Form Labels and Instructions

- [ ] **Test 5.1.1:** All form inputs have visible labels
  - Expected: Every input has associated label text
  - Expected: Labels are positioned clearly
  - Pass/Fail: ___________

- [ ] **Test 5.1.2:** Helper text is associated with inputs
  - Expected: Helper text uses `aria-describedby`
  - Expected: Screen readers announce helper text
  - Pass/Fail: ___________

- [ ] **Test 5.1.3:** Error messages are accessible
  - Expected: Errors use `aria-invalid="true"`
  - Expected: Error text is associated with input
  - Pass/Fail: ___________

### 5.2 Touch Target Size

- [ ] **Test 5.2.1:** Mobile touch targets
  - Expected: All interactive elements ≥ 44px × 44px
  - Expected: Adequate spacing between targets
  - Pass/Fail: ___________

- [ ] **Test 5.2.2:** Toggle switches on mobile
  - Expected: Toggle container is at least 44px wide
  - Expected: Easy to tap without mistakes
  - Pass/Fail: ___________

### 5.3 Zoom and Reflow

- [ ] **Test 5.3.1:** Zoom to 200%
  - Expected: All content remains visible
  - Expected: No horizontal scrolling required
  - Expected: Text remains readable
  - Pass/Fail: ___________

- [ ] **Test 5.3.2:** Zoom to 400%
  - Expected: Content reflows appropriately
  - Expected: Functionality is maintained
  - Pass/Fail: ___________

---

## Testing Tools

### Recommended Tools

1. **Contrast Checkers:**
   - WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
   - Chrome DevTools: Inspect element → Accessibility pane
   - Colour Contrast Analyser (CCA): Desktop application

2. **Screen Readers:**
   - **Windows:** NVDA (free) or JAWS
   - **macOS:** VoiceOver (built-in, Cmd+F5)
   - **Linux:** Orca
   - **Mobile:** TalkBack (Android), VoiceOver (iOS)

3. **Browser Extensions:**
   - axe DevTools (Chrome/Firefox)
   - WAVE (Web Accessibility Evaluation Tool)
   - Lighthouse (Chrome DevTools)
   - Accessibility Insights

4. **Keyboard Testing:**
   - No special tools needed
   - Use Tab, Shift+Tab, Enter, Space, Escape keys
   - Test in all major browsers

5. **Reduced Motion:**
   - Browser DevTools (Chrome, Firefox)
   - OS accessibility settings
   - prefers-reduced-motion media query

---

## Test Summary

### Overall Results

- **Total Tests:** _____ / _____
- **Passed:** _____
- **Failed:** _____
- **Pass Rate:** _____%

### Critical Issues Found

1. _______________________________________
2. _______________________________________
3. _______________________________________

### Recommendations

1. _______________________________________
2. _______________________________________
3. _______________________________________

### Sign-Off

- **Tester Name:** _______________________
- **Date:** _______________________
- **Browser(s) Tested:** _______________________
- **Screen Reader(s) Tested:** _______________________
- **Overall Assessment:** ☐ Pass  ☐ Fail  ☐ Pass with Minor Issues

---

## Notes

- All tests should be performed in multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on both desktop and mobile devices
- Document any issues with screenshots or screen recordings
- Retest after fixing any failed tests
- Keep this checklist updated as new features are added

**Last Updated:** 2025-10-17
**Version:** 2.0.0
