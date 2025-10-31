# Accessibility Quick Reference

## Quick Test Commands

```bash
# Run all tests
node tests/accessibility/run-all-tests.js

# Individual tests
node tests/accessibility/contrast-verification.js
node tests/accessibility/keyboard-navigation.js
node tests/accessibility/screen-reader-test.js
```

## WCAG AA Requirements Checklist

### Color Contrast
- [ ] Normal text: 4.5:1 minimum
- [ ] Large text (18px+ or 14px+ bold): 3:1 minimum
- [ ] Interactive elements: 3:1 minimum
- [ ] Test both light and dark modes

### Keyboard Navigation
- [ ] All interactive elements reachable via Tab
- [ ] Focus indicators visible on all elements
- [ ] Tab order is logical
- [ ] No keyboard traps
- [ ] Enter/Space activate buttons

### Screen Reader
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] All form inputs have labels
- [ ] ARIA attributes are valid
- [ ] Images have alt text
- [ ] Buttons/links have accessible names

## Common CSS Fixes

### Add Focus Indicator
```css
.element:focus {
  outline: 2px solid var(--mase-primary);
  outline-offset: 2px;
}
```

### Improve Contrast
```css
:root {
  --mase-text-secondary: #646970; /* Darker for better contrast */
}
```

### Hide Decorative Elements from Screen Readers
```html
<img src="decorative.png" alt="" role="presentation">
```

## Testing Keyboard Shortcuts

- `Tab` - Next element
- `Shift + Tab` - Previous element
- `Enter` - Activate button/link
- `Space` - Activate button/toggle
- `Escape` - Close modal/dropdown
- `Arrow Keys` - Navigate within component

## Screen Reader Shortcuts

### NVDA (Windows)
- `Insert + Down Arrow` - Read next
- `H` - Next heading
- `B` - Next button
- `F` - Next form field

### VoiceOver (macOS)
- `VO + Right Arrow` - Next (VO = Ctrl + Option)
- `VO + H` - Next heading
- `Tab` - Next interactive element

## Resources

- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Full Documentation](./README.md)
