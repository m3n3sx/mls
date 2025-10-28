# Task 8: Accessibility Testing - Quick Start Guide

## Quick Test (5 minutes)

### 1. Open Test File
```bash
# Open in browser
open tests/test-dark-mode-accessibility.html
# or
firefox tests/test-dark-mode-accessibility.html
```

### 2. Run Automated Tests
1. Click "Run Automated Tests" button
2. Verify all tests pass (green checkmarks)

### 3. Keyboard Test
1. Press `Tab` key to navigate to dark mode toggle
2. Verify you see a blue outline (focus indicator)
3. Press `Space` to toggle dark mode
4. Verify page turns dark
5. Press `Space` again to toggle back

### 4. ARIA Attributes Test
1. Click "Check ARIA Attributes" button
2. Verify:
   - role: "switch"
   - aria-checked: "false" or "true"
   - aria-label: "Toggle dark mode for entire admin"

## Full Test (30 minutes)

### Keyboard Navigation
- [ ] Tab to toggle
- [ ] Focus indicator visible
- [ ] Space key toggles
- [ ] Enter key toggles

### Screen Reader (Optional)
**NVDA (Windows)**:
1. Download: https://www.nvaccess.org/
2. Start: Ctrl+Alt+N
3. Tab to toggle
4. Listen for: "Toggle dark mode for entire admin, switch, not checked"

**VoiceOver (Mac)**:
1. Enable: Cmd+F5
2. Navigate: Ctrl+Option+Arrow keys
3. Listen for announcements

### Export Results
1. Complete all manual tests
2. Check off items in checklists
3. Click "Export Results as JSON"
4. Save file for documentation

## Expected Results

### Automated Tests (Should All Pass)
✅ Toggle has role="switch"
✅ Toggle has aria-checked attribute
✅ aria-checked matches checked state
✅ Toggle has aria-label attribute
✅ aria-label is descriptive
✅ Toggle can receive focus
✅ Decorative icon has aria-hidden="true"

### Manual Tests
✅ Keyboard navigation works
✅ Focus indicator visible in light mode
✅ Focus indicator visible in dark mode
✅ Space key toggles dark mode
✅ Enter key toggles dark mode
✅ Screen reader announces correctly

## Bug Fix Verification

### Test Notification Issue (Fixed)
1. Open test file
2. Toggle dark mode on
3. Verify NO gray circle appears
4. Verify notification appears at top
5. Verify notification fades out after 3 seconds

**Before Fix**: Gray circle appeared, scroll animation issues
**After Fix**: Clean notification display, no scroll issues

## Common Issues

### Issue: Focus indicator not visible
**Solution**: Check browser zoom level, try different browser

### Issue: Screen reader not announcing
**Solution**: 
- Ensure screen reader is running
- Try refreshing page
- Check browser compatibility

### Issue: Keyboard not working
**Solution**:
- Click on page first to give it focus
- Check if JavaScript is enabled
- Try different browser

## Files Created
- `tests/test-dark-mode-accessibility.html` - Main test file
- `.kiro/specs/header-dark-mode-toggle/TASK-8-COMPLETION-SUMMARY.md` - Full documentation

## Files Modified
- `assets/js/mase-admin.js` - Fixed showNotice scroll bug

## Next Task
Task 9: Test Responsive Behavior
