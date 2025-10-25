# Quick Start: Dark Mode Accessibility Testing

Fast guide to run accessibility tests for MASE dark mode toggle.

## 🚀 Quick Run

```bash
# Run automated tests
./tests/accessibility/run-dark-mode-a11y-tests.sh
```

## 📋 Manual Testing (5 minutes)

1. **Open Test Page**
   ```
   Open: tests/accessibility/test-dark-mode-accessibility.html
   ```

2. **Keyboard Navigation** (1 min)
   - Press `Tab` to reach FAB
   - Press `Enter` to toggle
   - Press `Ctrl+Shift+D` to toggle via shortcut
   - Verify focus indicator visible

3. **Screen Reader** (2 min)
   - Start screen reader (NVDA: Ctrl+Alt+N, VoiceOver: Cmd+F5)
   - Tab to FAB
   - Verify "Toggle dark mode" announced
   - Press Enter
   - Verify "Dark mode activated" announced

4. **Reduced Motion** (1 min)
   - Open DevTools (F12)
   - Press Ctrl+Shift+P
   - Type "reduced motion"
   - Select "Emulate CSS prefers-reduced-motion: reduce"
   - Toggle dark mode
   - Verify instant transition (no animation)

5. **Contrast** (1 min)
   - Toggle to dark mode
   - Open DevTools → Elements
   - Inspect text elements
   - Verify contrast ratio ≥ 4.5:1

## ✅ Pass Criteria

- All keyboard shortcuts work
- Screen reader announces mode changes
- Focus indicator visible (2px outline)
- Contrast ratios ≥ 4.5:1
- Animations disabled with reduced motion

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| FAB not found | Enable dark mode in MASE settings |
| Shortcut not working | Check browser console for errors |
| No announcements | Verify ARIA live region exists |
| Low contrast | Check CSS custom properties |
| Animations still running | Verify @media query in CSS |

## 📊 Expected Output

```
♿ Starting Dark Mode Accessibility Tests...

🎹 Test 1: Keyboard Navigation
  ✓ FAB reachable via Tab
  ✓ Enter key toggles mode
  ✓ Space key toggles mode
  ✓ Keyboard shortcut works
  ✓ Focus indicator visible

🔊 Test 2: Screen Reader Support
  ✓ FAB has aria-label
  ✓ FAB has aria-pressed
  ✓ aria-pressed updates
  ✓ ARIA live region exists
  ✓ Icon has aria-hidden

🎯 Test 3: Focus Indicators
  ✓ Focus indicator in light mode
  ✓ Focus indicator in dark mode

🏷️  Test 4: ARIA Attributes
  ✓ Valid role
  ✓ aria-label present
  ✓ aria-pressed present

🎨 Test 5: Contrast Ratios
  ✓ Light mode contrast: 12.63:1
  ✓ Dark mode contrast: 11.82:1

🎬 Test 6: Reduced Motion
  ✓ Transitions reduced
  ✓ Functionality still works

============================================================
TEST SUMMARY
============================================================
Total Tests: 20
Passed: 20 ✓
Failed: 0 ✗
Success Rate: 100%

✅ ALL ACCESSIBILITY TESTS PASSED!
```

## 📚 Full Documentation

See `DARK-MODE-A11Y-TESTS-README.md` for complete testing guide.
