# MASE Accessibility Test Suite

Comprehensive accessibility testing for the Modern Admin Styler Enterprise (MASE) visual redesign.

## Overview

This test suite verifies WCAG 2.1 Level AA compliance for the MASE settings page redesign. It includes automated tests for:

1. **Color Contrast Verification** - Ensures all text and interactive elements meet minimum contrast ratios
2. **Keyboard Navigation** - Verifies all functionality is accessible via keyboard
3. **Screen Reader Compatibility** - Checks semantic HTML and ARIA attributes

## Requirements

- Node.js 14+
- Playwright
- WordPress installation with MASE plugin

## Installation

```bash
# Install dependencies
npm install playwright

# Or if using the project's package.json
npm install
```

## Running Tests

### Run All Tests

```bash
node tests/accessibility/run-all-tests.js
```

### Run Individual Tests

```bash
# Color contrast only
node tests/accessibility/contrast-verification.js

# Keyboard navigation only
node tests/accessibility/keyboard-navigation.js

# Screen reader compatibility only
node tests/accessibility/screen-reader-test.js
```

### Environment Variables

Set the WordPress base URL if different from default:

```bash
export WP_BASE_URL=http://localhost:8080
node tests/accessibility/run-all-tests.js
```

## Test Details

### 1. Color Contrast Verification

**File:** `contrast-verification.js`

**Tests:**
- Verifies all text meets 4.5:1 contrast ratio (WCAG AA)
- Verifies large text meets 3:1 contrast ratio
- Verifies interactive elements meet 3:1 contrast ratio
- Tests both light mode and dark mode

**WCAG Requirements:**
- Normal text (< 18px or < 14px bold): 4.5:1 minimum
- Large text (≥ 18px or ≥ 14px bold): 3:1 minimum
- Interactive elements (borders, icons): 3:1 minimum

**Output:**
- Lists all tested elements with their contrast ratios
- Identifies elements that fail to meet requirements
- Provides color values for failed elements

### 2. Keyboard Navigation

**File:** `keyboard-navigation.js`

**Tests:**
- All interactive elements are reachable via Tab key
- Focus indicators are visible on all focusable elements
- Tab order follows logical visual order
- No keyboard traps exist
- Enter/Space keys activate buttons and controls

**Requirements:**
- All interactive elements must be keyboard accessible
- Focus indicators must be clearly visible (WCAG 2.4.7)
- Tab order must be logical and predictable
- Users must be able to navigate away from all elements

**Output:**
- Lists all interactive elements in tab order
- Identifies elements without focus indicators
- Reports keyboard traps if found
- Verifies tab order logic

### 3. Screen Reader Compatibility

**File:** `screen-reader-test.js`

**Tests:**
- Semantic HTML structure (proper heading hierarchy)
- Form labels (all inputs have associated labels)
- ARIA attributes (valid and properly referenced)
- Image alt text (all images have alt attributes)
- Accessible names for interactive elements

**Requirements:**
- Proper heading hierarchy (no skipped levels)
- All form inputs have labels
- ARIA attributes reference existing IDs
- Images have alt text or role="presentation"
- Buttons and links have accessible names

**Output:**
- Reports semantic structure issues
- Lists unlabeled form inputs
- Identifies invalid ARIA attributes
- Reports images without alt text

## Understanding Results

### Passing Tests

```
✓ PASSED: All tests passed
```

All accessibility requirements are met. The redesign maintains WCAG 2.1 Level AA compliance.

### Failing Tests

```
✗ FAILED: Some tests failed
```

Review the detailed output to identify specific issues. Each failed test includes:
- Element selector or description
- Specific issue (e.g., contrast ratio, missing label)
- Recommended fix

## Common Issues and Fixes

### Low Contrast

**Issue:** Text or interactive element has insufficient contrast

**Fix:**
1. Identify the element and its colors from test output
2. Use a contrast checker tool (e.g., WebAIM Contrast Checker)
3. Adjust colors in `assets/css/mase-admin.css`
4. Update CSS custom properties in `:root` or `:root[data-theme="dark"]`

**Example:**
```css
/* Before: Insufficient contrast */
--mase-text-secondary: #999999;

/* After: Meets WCAG AA */
--mase-text-secondary: #646970;
```

### Missing Focus Indicator

**Issue:** Interactive element has no visible focus indicator

**Fix:**
1. Add focus styles to the element
2. Use outline or box-shadow for visibility
3. Ensure focus indicator has sufficient contrast

**Example:**
```css
.mase-button:focus {
  outline: 2px solid var(--mase-primary);
  outline-offset: 2px;
}

/* Or using box-shadow */
.mase-button:focus {
  box-shadow: 0 0 0 3px var(--mase-primary-light);
}
```

### Unlabeled Form Input

**Issue:** Form input has no associated label

**Fix:**
1. Add a `<label>` element with `for` attribute
2. Or add `aria-label` attribute to input
3. Or wrap input in `<label>` element

**Example:**
```html
<!-- Option 1: Separate label -->
<label for="setting-name">Setting Name</label>
<input type="text" id="setting-name" name="setting_name">

<!-- Option 2: aria-label -->
<input type="text" name="setting_name" aria-label="Setting Name">

<!-- Option 3: Wrapped label -->
<label>
  Setting Name
  <input type="text" name="setting_name">
</label>
```

### Invalid ARIA Attribute

**Issue:** ARIA attribute references non-existent ID

**Fix:**
1. Ensure referenced ID exists in the DOM
2. Or remove the ARIA attribute if not needed
3. Or use aria-label instead

**Example:**
```html
<!-- Before: Invalid reference -->
<button aria-labelledby="non-existent-id">Click</button>

<!-- After: Valid reference -->
<span id="button-label">Click Me</span>
<button aria-labelledby="button-label">Click</button>

<!-- Or use aria-label -->
<button aria-label="Click Me">Click</button>
```

## Manual Testing

While these automated tests cover many accessibility issues, manual testing is still recommended:

### Screen Reader Testing

1. **NVDA (Windows - Free)**
   - Download from https://www.nvaccess.org/
   - Navigate through MASE settings page
   - Verify all content is announced correctly
   - Test form controls and buttons

2. **JAWS (Windows - Commercial)**
   - Industry standard screen reader
   - Test if available in your organization

3. **VoiceOver (macOS - Built-in)**
   - Enable in System Preferences > Accessibility
   - Use Cmd+F5 to toggle
   - Navigate with VO keys (Control+Option)

### Keyboard Testing

1. Unplug mouse or don't use it
2. Navigate entire page using only keyboard:
   - Tab: Move forward
   - Shift+Tab: Move backward
   - Enter: Activate buttons/links
   - Space: Toggle checkboxes/buttons
   - Arrow keys: Navigate within components
3. Verify all functionality is accessible
4. Check focus indicators are always visible

### Visual Testing

1. Test with browser zoom at 200%
2. Test with Windows High Contrast Mode
3. Test with browser dark mode
4. Verify text remains readable at all sizes

## Integration with CI/CD

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Accessibility Tests
  run: |
    npm install
    node tests/accessibility/run-all-tests.js
```

## Reporting Issues

When reporting accessibility issues, include:

1. Test output showing the failure
2. Browser and version
3. Operating system
4. Steps to reproduce
5. Screenshots if applicable

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Keyboard Accessibility](https://webaim.org/articles/keyboard/)
- [Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

## Requirements Mapping

These tests verify the following requirements from the visual redesign spec:

- **Requirement 11.1:** Color contrast ratios (WCAG 2.1 AA)
- **Requirement 11.2:** Keyboard navigation and focus indicators
- **Requirement 11.3:** Screen reader compatibility and semantic HTML
- **Requirement 11.4:** Reduced motion preferences (manual testing)
- **Requirement 11.5:** Semantic HTML structure

## License

GPL-2.0+
