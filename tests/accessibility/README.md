# Accessibility Testing Suite

This directory contains comprehensive accessibility tests for Modern Admin Styler Enterprise (MASE) v1.2.0.

## Requirements Coverage

This test suite validates:
- **Requirement 13.1**: High contrast mode (WCAG AAA 7:1 contrast ratio)
- **Requirement 13.2**: Reduced motion support
- **Requirement 13.3**: Visible focus indicators (2px outline)
- **Requirement 13.4**: Keyboard navigation
- **Requirement 13.5**: Screen reader support (ARIA labels)

## Test Files

### 1. `test-keyboard-navigation.html`
Tests keyboard navigation through all tabs and controls:
- Tab key navigation
- Arrow key navigation in tab lists
- Enter/Space activation
- Escape key dismissal
- Focus trap in modals

### 2. `test-screen-reader.html`
Tests screen reader compatibility:
- ARIA labels and descriptions
- ARIA live regions for dynamic content
- Semantic HTML structure
- Role attributes
- Alt text for images

### 3. `test-color-contrast.html`
Tests WCAG AA/AAA color contrast:
- Text contrast (4.5:1 minimum for AA)
- Large text contrast (3:1 minimum for AA)
- UI component contrast
- High contrast mode
- Color contrast checker tool

### 4. `test-high-contrast-mode.html`
Tests high contrast mode support:
- Windows High Contrast Mode
- prefers-contrast: high media query
- Border visibility
- Focus indicator enhancement

### 5. `test-reduced-motion.html`
Tests reduced motion preference:
- prefers-reduced-motion media query
- Animation disabling
- Transition disabling
- Transform disabling

### 6. `accessibility-test-checklist.md`
Comprehensive manual testing checklist

### 7. `automated-accessibility-tests.js`
Automated tests using axe-core and Pa11y

## Running Tests

### Manual Testing

1. **Keyboard Navigation**:
   ```bash
   # Open in browser
   open woow-admin/tests/accessibility/test-keyboard-navigation.html
   ```
   - Use Tab to navigate through all controls
   - Use Arrow keys in tab lists
   - Verify all elements are reachable

2. **Screen Reader Testing**:
   - **Windows**: Use NVDA (free)
   - **Mac**: Use VoiceOver (built-in, Cmd+F5)
   - **Linux**: Use Orca
   
   ```bash
   # Open test file
   open woow-admin/tests/accessibility/test-screen-reader.html
   ```

3. **Color Contrast**:
   ```bash
   # Open contrast checker
   open woow-admin/tests/accessibility/test-color-contrast.html
   ```
   - Use built-in contrast checker tool
   - Test all color combinations
   - Verify WCAG AA compliance (4.5:1)

4. **High Contrast Mode**:
   - **Windows**: Settings > Ease of Access > High Contrast
   - **Mac**: System Preferences > Accessibility > Display > Increase Contrast
   
   ```bash
   open woow-admin/tests/accessibility/test-high-contrast-mode.html
   ```

5. **Reduced Motion**:
   - **Windows**: Settings > Ease of Access > Display > Show animations
   - **Mac**: System Preferences > Accessibility > Display > Reduce motion
   
   ```bash
   open woow-admin/tests/accessibility/test-reduced-motion.html
   ```

### Automated Testing

```bash
# Install dependencies
npm install --save-dev axe-core pa11y

# Run automated tests
node woow-admin/tests/accessibility/automated-accessibility-tests.js

# Run with specific URL
node woow-admin/tests/accessibility/automated-accessibility-tests.js http://localhost/wp-admin/admin.php?page=mase-settings
```

## Testing Tools

### Browser Extensions
- **axe DevTools** (Chrome/Firefox): https://www.deque.com/axe/devtools/
- **WAVE** (Chrome/Firefox): https://wave.webaim.org/extension/
- **Lighthouse** (Chrome): Built-in DevTools

### Screen Readers
- **NVDA** (Windows, Free): https://www.nvaccess.org/download/
- **JAWS** (Windows, Commercial): https://www.freedomscientific.com/products/software/jaws/
- **VoiceOver** (Mac, Built-in): Cmd+F5
- **Orca** (Linux, Free): Pre-installed on most distributions

### Color Contrast Tools
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Colour Contrast Analyser**: https://www.tpgi.com/color-contrast-checker/
- Built-in tool in test-color-contrast.html

## WCAG 2.1 Compliance

### Level A (Must Have)
- ✅ Keyboard accessible
- ✅ Text alternatives
- ✅ Adaptable content
- ✅ Distinguishable content

### Level AA (Should Have)
- ✅ Color contrast 4.5:1 for normal text
- ✅ Color contrast 3:1 for large text
- ✅ Resize text up to 200%
- ✅ Multiple ways to navigate
- ✅ Focus visible

### Level AAA (Nice to Have)
- ✅ Color contrast 7:1 (high contrast mode)
- ✅ No timing requirements
- ✅ Enhanced focus indicators

## Common Issues and Solutions

### Issue: Focus not visible
**Solution**: Check mase-accessibility.css focus styles are loaded

### Issue: Screen reader not announcing changes
**Solution**: Verify ARIA live regions are present and have correct politeness level

### Issue: Keyboard trap
**Solution**: Ensure Tab and Shift+Tab work in all contexts, Escape dismisses modals

### Issue: Low contrast
**Solution**: Use color contrast checker, adjust colors to meet 4.5:1 ratio

### Issue: Animations causing issues
**Solution**: Verify prefers-reduced-motion media query is working

## Reporting Issues

When reporting accessibility issues, include:
1. WCAG criterion violated (e.g., 1.4.3 Contrast)
2. Severity (Critical, High, Medium, Low)
3. Steps to reproduce
4. Expected vs actual behavior
5. Browser and assistive technology used
6. Screenshots or screen recordings

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Articles](https://webaim.org/articles/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WordPress Accessibility Handbook](https://make.wordpress.org/accessibility/handbook/)
