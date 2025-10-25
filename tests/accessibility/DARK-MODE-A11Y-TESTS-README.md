# Dark Mode Accessibility Tests

Comprehensive accessibility testing for the MASE dark/light mode toggle feature.

## Requirements Tested

- **5.1-5.7**: Keyboard Accessibility
  - 5.1: Keyboard shortcut (Ctrl/Cmd+Shift+D)
  - 5.2: Enter/Space key activation
  - 5.3: No trigger in input fields
  - 5.4: Screen reader announcements
  - 5.5: Keyboard shortcut support
  - 5.6: FAB keyboard navigation
  - 5.7: Focus indicators and ARIA attributes

- **6.6**: WCAG 2.1 AA Contrast Compliance
  - Minimum 4.5:1 contrast ratio for normal text
  - Minimum 3:1 contrast ratio for large text and UI components

- **9.6-9.7**: Reduced Motion Support
  - 9.6: Animations disabled with prefers-reduced-motion
  - 9.7: Functionality maintained with reduced motion

## Test Files

### 1. Manual Test Page
**File**: `test-dark-mode-accessibility.html`

Interactive HTML page for manual accessibility testing.

**Features**:
- Keyboard navigation checklist
- Screen reader testing guide
- Focus indicator verification
- ARIA attributes inspection
- Contrast ratio calculator
- Reduced motion detection

**How to Use**:
1. Open in browser: `tests/accessibility/test-dark-mode-accessibility.html`
2. Follow the test instructions for each section
3. Check off items as you verify them
4. Use browser DevTools to inspect ARIA attributes
5. Test with screen reader (NVDA, VoiceOver, Orca)

### 2. Automated Test Script
**File**: `test-dark-mode-a11y.js`

Playwright-based automated accessibility tests.

**Tests**:
- Keyboard navigation (Tab, Enter, Space, Ctrl+Shift+D)
- Screen reader support (ARIA labels, aria-pressed, live regions)
- Focus indicators (2px outline, 2px offset)
- ARIA attributes (role, aria-label, aria-pressed)
- Contrast ratios (WCAG 2.1 AA compliance)
- Reduced motion support (transitions disabled, functionality maintained)

**How to Run**:
```bash
# Run all tests
./tests/accessibility/run-dark-mode-a11y-tests.sh

# Or run directly with Node
node tests/accessibility/test-dark-mode-a11y.js
```

### 3. Test Runner Script
**File**: `run-dark-mode-a11y-tests.sh`

Shell script to run automated tests with proper setup.

## Testing Checklist

### Keyboard Navigation
- [ ] FAB is reachable via Tab key
- [ ] Enter key toggles dark mode
- [ ] Space key toggles dark mode
- [ ] Ctrl/Cmd+Shift+D keyboard shortcut works
- [ ] FAB shows visible focus indicator (2px outline, 2px offset)
- [ ] Keyboard shortcut does NOT trigger in input fields

### Screen Reader Support
- [ ] FAB has descriptive aria-label ("Toggle dark mode")
- [ ] FAB has aria-pressed attribute (true/false)
- [ ] Mode change is announced ("Dark mode activated")
- [ ] ARIA live region announces changes
- [ ] Icon changes are hidden from screen readers (aria-hidden="true")

### Focus Indicators
- [ ] FAB focus outline is at least 2px wide
- [ ] Focus outline has 2px offset from FAB
- [ ] Focus indicator visible in light mode
- [ ] Focus indicator visible in dark mode
- [ ] Focus indicator has sufficient contrast (3:1 minimum)

### ARIA Attributes
- [ ] FAB has role="switch" or role="button"
- [ ] FAB has aria-label attribute
- [ ] FAB has aria-pressed attribute
- [ ] aria-pressed updates on toggle (true/false)
- [ ] Icon has aria-hidden="true"
- [ ] ARIA live region exists for announcements

### Contrast Ratios (WCAG 2.1 AA)
- [ ] Light mode admin bar text contrast ≥ 4.5:1
- [ ] Light mode admin menu text contrast ≥ 4.5:1
- [ ] Light mode content text contrast ≥ 4.5:1
- [ ] Dark mode admin bar text contrast ≥ 4.5:1
- [ ] Dark mode admin menu text contrast ≥ 4.5:1
- [ ] Dark mode content text contrast ≥ 4.5:1

### Reduced Motion Support
- [ ] FAB icon rotation animation disabled (0s duration)
- [ ] Color transition duration set to 0s
- [ ] Mode toggle is instant (no smooth transition)
- [ ] FAB hover effects have no animation
- [ ] Functionality still works (mode still toggles)

## Screen Reader Testing

### Windows (NVDA)
1. Install NVDA: https://www.nvaccess.org/download/
2. Start NVDA: Ctrl+Alt+N
3. Navigate to MASE settings page
4. Press Insert+Down Arrow to read content
5. Tab to FAB and verify announcement
6. Press Enter to toggle and verify announcement

### macOS (VoiceOver)
1. Enable VoiceOver: Cmd+F5
2. Navigate to MASE settings page
3. Press VO+A to read all content
4. Tab to FAB and verify announcement
5. Press Enter to toggle and verify announcement

### Linux (Orca)
1. Install Orca: `sudo apt-get install orca`
2. Start Orca: Super+Alt+S
3. Navigate to MASE settings page
4. Press Insert+Down Arrow to read content
5. Tab to FAB and verify announcement
6. Press Enter to toggle and verify announcement

## Reduced Motion Testing

### Windows 10/11
1. Settings → Ease of Access → Display
2. Turn OFF "Show animations in Windows"
3. Or: Settings → Accessibility → Visual effects → Animation effects (OFF)

### macOS
1. System Preferences → Accessibility → Display
2. Check "Reduce motion"

### Linux (GNOME)
1. Settings → Universal Access → Seeing
2. Enable "Reduce animation"

### Browser DevTools (Chrome/Edge)
1. Open DevTools (F12)
2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
3. Type "Emulate CSS prefers-reduced-motion"
4. Select "Emulate CSS prefers-reduced-motion: reduce"

## Contrast Ratio Tools

### Browser DevTools
- Chrome/Edge: DevTools → Elements → Styles → Color picker shows contrast ratio
- Firefox: DevTools → Accessibility → Check for Issues

### Online Tools
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Contrast Ratio: https://contrast-ratio.com/

### Browser Extensions
- WAVE (Web Accessibility Evaluation Tool)
- axe DevTools
- Lighthouse (built into Chrome DevTools)

## Expected Results

### All Tests Should Pass
- ✅ 0 accessibility violations
- ✅ All keyboard navigation works
- ✅ All screen reader announcements work
- ✅ All focus indicators visible
- ✅ All ARIA attributes correct
- ✅ All contrast ratios meet WCAG 2.1 AA
- ✅ Reduced motion support works

### Common Issues to Watch For
- ❌ Missing aria-label on FAB
- ❌ aria-pressed not updating on toggle
- ❌ Focus indicator not visible
- ❌ Contrast ratio below 4.5:1
- ❌ Animations not disabled with reduced motion
- ❌ Keyboard shortcut triggers in input fields

## Troubleshooting

### FAB Not Found
- Ensure dark mode feature is enabled in MASE settings
- Check that mase-admin.js is loaded
- Verify FAB is rendered in DOM

### Keyboard Shortcut Not Working
- Check browser console for JavaScript errors
- Verify event listener is attached
- Test in different input contexts (input field vs. page)

### Screen Reader Not Announcing
- Verify ARIA live region exists in DOM
- Check aria-live attribute is set to "polite" or "assertive"
- Ensure screen reader is running and configured

### Contrast Ratio Failing
- Use browser DevTools color picker to verify
- Check CSS custom properties are applied
- Verify dark mode class is added to body

### Reduced Motion Not Working
- Verify media query is in CSS
- Check browser supports prefers-reduced-motion
- Test with DevTools emulation first

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Support

For issues or questions about accessibility tests:
1. Check the troubleshooting section above
2. Review the requirements document
3. Inspect browser console for errors
4. Test with multiple screen readers
5. Verify system accessibility settings
