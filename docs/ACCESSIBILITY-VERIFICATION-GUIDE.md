# MASE Accessibility Verification Guide

## Overview

This document provides guidance for verifying WCAG 2.1 Level AA accessibility compliance for the MASE visual redesign. It covers automated testing, manual testing procedures, and remediation strategies.

## Automated Test Suite

### Location

All accessibility tests are located in `tests/accessibility/`:

- `contrast-verification.js` - Color contrast testing
- `keyboard-navigation.js` - Keyboard accessibility testing
- `screen-reader-test.js` - Screen reader compatibility testing
- `run-all-tests.js` - Master test runner
- `README.md` - Detailed test documentation

### Running Tests

```bash
# Run all accessibility tests
node tests/accessibility/run-all-tests.js

# Run individual tests
node tests/accessibility/contrast-verification.js
node tests/accessibility/keyboard-navigation.js
node tests/accessibility/screen-reader-test.js
```

### Test Coverage

#### 1. Color Contrast Verification (Requirement 11.1)

**What it tests:**
- All text against backgrounds (4.5:1 minimum for normal text)
- Large text against backgrounds (3:1 minimum for 18px+ or 14px+ bold)
- Interactive element contrast (3:1 minimum for borders, icons)
- Both light mode and dark mode

**Elements tested:**
- Header text and badges
- Tab navigation labels
- Section headings and descriptions
- Form labels and helper text
- Button text
- Link text
- Palette and template card text

**How it works:**
1. Navigates to MASE settings page
2. Extracts computed color values for each element
3. Calculates contrast ratios using WCAG formula
4. Compares against WCAG AA requirements
5. Reports pass/fail for each element

#### 2. Keyboard Navigation (Requirement 11.2)

**What it tests:**
- All interactive elements are reachable via Tab key
- Focus indicators are visible on all focusable elements
- Tab order follows logical visual order
- No keyboard traps exist
- Enter/Space keys activate buttons

**Elements tested:**
- Buttons (primary, secondary, icon buttons)
- Links
- Form inputs (text, select, textarea)
- Toggle switches
- Color pickers
- Range sliders
- Tab navigation

**How it works:**
1. Navigates to MASE settings page
2. Simulates Tab key presses to move through elements
3. Checks for visible focus indicators on each element
4. Verifies tab order matches visual layout
5. Tests button activation with Enter key
6. Detects keyboard traps

#### 3. Screen Reader Compatibility (Requirement 11.3)

**What it tests:**
- Semantic HTML structure (proper heading hierarchy)
- Form labels (all inputs have associated labels)
- ARIA attributes (valid and properly referenced)
- Image alt text
- Accessible names for interactive elements

**Elements tested:**
- Heading hierarchy (h1-h6)
- Form inputs and their labels
- ARIA attributes (aria-label, aria-labelledby, aria-describedby)
- Images
- Buttons and links

**How it works:**
1. Navigates to MASE settings page
2. Analyzes DOM structure for semantic HTML
3. Checks all form inputs for associated labels
4. Validates ARIA attributes and references
5. Verifies images have alt text
6. Reports any accessibility issues

## Manual Testing Procedures

### Screen Reader Testing

#### NVDA (Windows - Free)

1. **Installation:**
   - Download from https://www.nvaccess.org/
   - Install and restart computer
   - NVDA will start automatically

2. **Basic Navigation:**
   - `Insert + Down Arrow` - Read next item
   - `Insert + Up Arrow` - Read previous item
   - `H` - Jump to next heading
   - `B` - Jump to next button
   - `F` - Jump to next form field
   - `Tab` - Move to next interactive element

3. **Testing Checklist:**
   - [ ] Page title is announced
   - [ ] All headings are announced with correct level
   - [ ] All form labels are announced
   - [ ] Button purposes are clear
   - [ ] Tab navigation is announced
   - [ ] Color picker values are announced
   - [ ] Toggle switch states are announced
   - [ ] Error messages are announced

#### VoiceOver (macOS - Built-in)

1. **Activation:**
   - `Cmd + F5` to toggle VoiceOver
   - Or System Preferences > Accessibility > VoiceOver

2. **Basic Navigation:**
   - `VO + Right Arrow` - Next item (VO = Control + Option)
   - `VO + Left Arrow` - Previous item
   - `VO + H` - Next heading
   - `VO + Command + H` - Headings menu
   - `Tab` - Next interactive element

3. **Testing Checklist:**
   - Same as NVDA checklist above

### Keyboard Testing

#### Complete Keyboard Navigation Test

1. **Setup:**
   - Unplug mouse or commit to not using it
   - Open MASE settings page
   - Start at top of page

2. **Navigation Test:**
   - [ ] Press Tab to move through all interactive elements
   - [ ] Verify focus indicator is visible on each element
   - [ ] Verify tab order is logical (top to bottom, left to right)
   - [ ] Press Shift+Tab to move backward
   - [ ] Verify you can reach all buttons, links, and form controls

3. **Activation Test:**
   - [ ] Press Enter on buttons - should activate
   - [ ] Press Space on buttons - should activate
   - [ ] Press Space on checkboxes - should toggle
   - [ ] Type in text inputs - should work
   - [ ] Use arrow keys in select dropdowns - should work
   - [ ] Press Escape to close modals/dropdowns - should work

4. **Trap Test:**
   - [ ] Navigate through entire page
   - [ ] Verify you can always move forward and backward
   - [ ] Verify no element "traps" focus
   - [ ] Verify you can reach browser address bar (Ctrl+L or Cmd+L)

### Visual Testing

#### Zoom Testing

1. **Browser Zoom:**
   - [ ] Test at 100% zoom (baseline)
   - [ ] Test at 150% zoom
   - [ ] Test at 200% zoom (WCAG requirement)
   - [ ] Verify no content is cut off
   - [ ] Verify no horizontal scrolling (except for specific components)
   - [ ] Verify text remains readable

2. **Text Zoom:**
   - [ ] Use browser text-only zoom
   - [ ] Test at 200% text size
   - [ ] Verify layout doesn't break
   - [ ] Verify text doesn't overlap

#### High Contrast Mode

1. **Windows High Contrast:**
   - Enable: Alt + Left Shift + Print Screen
   - [ ] Test all four high contrast themes
   - [ ] Verify all text is visible
   - [ ] Verify all borders are visible
   - [ ] Verify focus indicators are visible

2. **Browser Dark Mode:**
   - [ ] Enable browser/OS dark mode
   - [ ] Verify MASE dark mode activates
   - [ ] Verify all content is readable
   - [ ] Verify sufficient contrast in dark mode

## Common Issues and Fixes

### Issue: Low Contrast Text

**Symptoms:**
- Text is difficult to read
- Automated test reports contrast ratio below 4.5:1

**Fix:**
```css
/* Adjust text color or background color */
:root {
  --mase-text-secondary: #646970; /* Darker gray for better contrast */
}

/* Or adjust background */
:root {
  --mase-surface: #ffffff; /* Ensure pure white background */
}
```

**Verification:**
- Run contrast verification test
- Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

### Issue: Missing Focus Indicator

**Symptoms:**
- Can't see which element has focus when using Tab key
- Automated test reports missing focus indicator

**Fix:**
```css
/* Add visible focus indicator */
.mase-button:focus,
.mase-tab:focus,
input:focus,
select:focus {
  outline: 2px solid var(--mase-primary);
  outline-offset: 2px;
}

/* Or use box-shadow for rounded elements */
.mase-toggle-switch:focus-within {
  box-shadow: 0 0 0 3px var(--mase-primary-light);
}
```

**Verification:**
- Tab through page and verify focus is always visible
- Run keyboard navigation test

### Issue: Unlabeled Form Input

**Symptoms:**
- Screen reader doesn't announce input purpose
- Automated test reports missing label

**Fix:**
```html
<!-- Add label element -->
<label for="setting-name">Setting Name</label>
<input type="text" id="setting-name" name="setting_name">

<!-- Or use aria-label -->
<input type="text" name="setting_name" aria-label="Setting Name">
```

**Verification:**
- Test with screen reader
- Run screen reader compatibility test

### Issue: Illogical Tab Order

**Symptoms:**
- Tab key jumps around page unexpectedly
- Tab order doesn't match visual layout

**Fix:**
```css
/* Remove positive tabindex values */
/* WRONG: */
<button tabindex="5">Button</button>

/* RIGHT: */
<button>Button</button>

/* Or use tabindex="0" to include in natural order */
<div tabindex="0" role="button">Custom Button</div>
```

**Verification:**
- Tab through page and verify order is logical
- Run keyboard navigation test

### Issue: Keyboard Trap

**Symptoms:**
- Can't tab out of a component
- Focus gets stuck in a modal or dropdown

**Fix:**
```javascript
// Ensure Escape key closes modals
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    previousFocusElement.focus(); // Return focus
  }
});

// Ensure Tab wraps around in modals
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const focusableElements = modal.querySelectorAll('button, a, input, select');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
});
```

**Verification:**
- Test keyboard navigation through component
- Run keyboard navigation test

## WCAG 2.1 Level AA Requirements

### Perceivable

- **1.4.3 Contrast (Minimum):** Text has 4.5:1 contrast, large text has 3:1 contrast ✓
- **1.4.11 Non-text Contrast:** UI components have 3:1 contrast ✓

### Operable

- **2.1.1 Keyboard:** All functionality available via keyboard ✓
- **2.1.2 No Keyboard Trap:** Focus can move away from all components ✓
- **2.4.3 Focus Order:** Focus order is logical and meaningful ✓
- **2.4.7 Focus Visible:** Keyboard focus indicator is visible ✓

### Understandable

- **3.2.4 Consistent Identification:** Components are identified consistently ✓
- **3.3.2 Labels or Instructions:** Form inputs have labels ✓

### Robust

- **4.1.2 Name, Role, Value:** UI components have accessible names ✓
- **4.1.3 Status Messages:** Status messages are announced to screen readers ✓

## Testing Schedule

### During Development

- Run automated tests after each CSS change
- Test keyboard navigation after adding new interactive elements
- Verify focus indicators are visible

### Before Deployment

- Run complete automated test suite
- Perform manual keyboard testing
- Test with at least one screen reader (NVDA or VoiceOver)
- Test with browser zoom at 200%
- Test in high contrast mode

### After Deployment

- Run automated tests in production
- Monitor user feedback for accessibility issues
- Conduct periodic manual testing

## Resources

### Tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)

### Guidelines

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/articles/)

### Screen Readers

- [NVDA Download](https://www.nvaccess.org/download/)
- [JAWS Trial](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver Guide](https://www.apple.com/accessibility/voiceover/)

## Reporting Issues

When reporting accessibility issues, include:

1. **Issue Description:** Clear description of the problem
2. **WCAG Criterion:** Which WCAG criterion is violated
3. **Test Results:** Output from automated tests
4. **Steps to Reproduce:** How to reproduce the issue
5. **Expected Behavior:** What should happen
6. **Actual Behavior:** What actually happens
7. **Screenshots:** Visual evidence if applicable
8. **Browser/OS:** Testing environment details

## Conclusion

Accessibility is not a one-time task but an ongoing commitment. Regular testing and user feedback help ensure MASE remains accessible to all users, regardless of their abilities or assistive technologies.

For questions or assistance with accessibility testing, refer to the test suite README at `tests/accessibility/README.md`.
