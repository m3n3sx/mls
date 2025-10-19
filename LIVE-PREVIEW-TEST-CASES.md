# Live Preview Toggle - Verification Test Cases

## Test Environment Setup

**Prerequisites:**
- WordPress admin access
- Modern Admin Styler Enterprise v1.2.0 installed
- Browser with developer tools (Chrome/Firefox recommended)
- Console logging enabled

**Test URL:** `/wp-admin/admin.php?page=mase-settings`

---

## Test Case 1: Initial State Verification

**Objective:** Verify live preview is enabled by default

**Steps:**
1. Navigate to MASE settings page
2. Open browser developer console (F12)
3. Observe page load console logs
4. Check toggle checkbox state
5. Verify live preview CSS tag exists

**Expected Results:**
```
✓ Console shows: "MASE: Enabling live preview by default..."
✓ Console shows: "MASE: Live Preview enabled by default"
✓ Toggle checkbox is CHECKED
✓ Toggle has aria-checked="true"
✓ DOM contains: <style id="mase-live-preview-css">
✓ Console shows only ONE initialization (not duplicate)
```

**Pass Criteria:**
- Toggle is checked on page load
- Live preview CSS tag exists
- No duplicate initialization messages
- No JavaScript errors in console

---

## Test Case 2: Toggle Disable Functionality

**Objective:** Verify toggle can disable live preview

**Steps:**
1. Start with live preview enabled (default state)
2. Click the "Live Preview" toggle to uncheck it
3. Observe console logs
4. Check DOM for CSS tag
5. Change a color picker value
6. Verify no preview update occurs

**Expected Results:**
```
✓ Console shows: "MASE: Live preview state changed: true -> false"
✓ Console shows: "MASE: Disabling live preview..."
✓ Console shows: "MASE: Unbinding live preview events..."
✓ Console shows: "MASE: Removing live preview CSS..."
✓ Toggle checkbox is UNCHECKED
✓ Toggle has aria-checked="false"
✓ DOM does NOT contain: <style id="mase-live-preview-css">
✓ Color changes do NOT trigger preview updates
```

**Pass Criteria:**
- Toggle unchecks successfully
- Live preview CSS tag is removed
- Color changes don't update preview
- Console shows proper state transition
- No JavaScript errors

---

## Test Case 3: Toggle Enable Functionality

**Objective:** Verify toggle can re-enable live preview

**Steps:**
1. Start with live preview disabled (from Test Case 2)
2. Click the "Live Preview" toggle to check it
3. Observe console logs
4. Check DOM for CSS tag
5. Change a color picker value
6. Verify preview updates within 100ms

**Expected Results:**
```
✓ Console shows: "MASE: Live preview state changed: false -> true"
✓ Console shows: "MASE: Enabling live preview..."
✓ Console shows: "MASE: Binding live preview events..."
✓ Toggle checkbox is CHECKED
✓ Toggle has aria-checked="true"
✓ DOM contains: <style id="mase-live-preview-css">
✓ Color changes trigger preview updates
✓ Updates occur within 100ms (debounced)
```

**Pass Criteria:**
- Toggle checks successfully
- Live preview CSS tag is created
- Color changes update preview in real-time
- Console shows proper state transition
- No JavaScript errors

---

## Test Case 4: Live Preview Update Verification

**Objective:** Verify live preview updates CSS correctly

**Steps:**
1. Enable live preview toggle
2. Navigate to "Admin Bar" tab
3. Change "Background Color" picker to #FF0000 (red)
4. Observe admin bar background color
5. Check live preview CSS content
6. Change "Text Color" picker to #FFFFFF (white)
7. Observe admin bar text color

**Expected Results:**
```
✓ Admin bar background changes to red immediately
✓ Live preview CSS contains: background-color:#FF0000!important
✓ Admin bar text changes to white immediately
✓ Live preview CSS contains: color:#FFFFFF!important
✓ Changes occur within 100ms of color picker change
✓ No page reload required
```

**Pass Criteria:**
- Visual changes appear immediately
- CSS is injected into #mase-live-preview-css tag
- No flickering or delays
- Colors match picker values exactly

---

## Test Case 5: Multiple Toggle Clicks

**Objective:** Verify toggle handles rapid state changes

**Steps:**
1. Click toggle OFF
2. Immediately click toggle ON
3. Immediately click toggle OFF
4. Immediately click toggle ON
5. Wait 1 second
6. Observe final state and console logs

**Expected Results:**
```
✓ Toggle ends in ON state (last click)
✓ Console shows 4 state change messages
✓ No duplicate event handler warnings
✓ No race condition errors
✓ Live preview CSS tag exists (final state)
✓ System is stable and responsive
```

**Pass Criteria:**
- Toggle responds to all clicks
- Final state matches last click
- No errors or warnings
- No memory leaks or hanging handlers

---

## Test Case 6: Event Handler Uniqueness

**Objective:** Verify only ONE event handler is bound

**Steps:**
1. Open browser console
2. Navigate to MASE settings page
3. Run this JavaScript in console:
```javascript
// Get all event handlers for the toggle
var toggle = document.getElementById('mase-live-preview-toggle');
var events = $._data(toggle, 'events');
console.log('Change event handlers:', events.change ? events.change.length : 0);
```
4. Observe the count

**Expected Results:**
```
✓ Console shows: "Change event handlers: 1"
✓ Only ONE handler bound to toggle
✓ No duplicate MASEAdmin object exists
✓ Only MASE object is initialized
```

**Pass Criteria:**
- Exactly 1 event handler
- No duplicate handlers
- No conflicting objects

---

## Test Case 7: Console Error Check

**Objective:** Verify no JavaScript errors occur

**Steps:**
1. Clear browser console
2. Navigate to MASE settings page
3. Enable/disable toggle 5 times
4. Change multiple color pickers
5. Switch between tabs
6. Review console for errors

**Expected Results:**
```
✓ No JavaScript errors
✓ No undefined variable warnings
✓ No "Cannot read property" errors
✓ No race condition warnings
✓ Only informational logs present
```

**Pass Criteria:**
- Zero errors in console
- Zero warnings (except informational)
- Clean execution throughout

---

## Test Case 8: State Persistence (If Implemented)

**Objective:** Verify toggle state persists across page reloads

**Steps:**
1. Disable live preview toggle
2. Reload the page (F5)
3. Check toggle state
4. Enable live preview toggle
5. Reload the page (F5)
6. Check toggle state

**Expected Results:**
```
✓ Disabled state persists after reload
✓ Enabled state persists after reload
✓ State is saved to localStorage or settings
✓ No state reset to default
```

**Pass Criteria:**
- State persists correctly
- No unexpected resets
- Consistent behavior

**Note:** This test may fail if persistence is not implemented. Check if `localStorage.getItem('mase_live_preview')` exists.

---

## Test Case 9: Accessibility Verification

**Objective:** Verify toggle is accessible

**Steps:**
1. Navigate to toggle using Tab key
2. Verify focus indicator is visible
3. Press Space bar to toggle
4. Verify state changes
5. Check aria-checked attribute
6. Test with screen reader (optional)

**Expected Results:**
```
✓ Toggle is keyboard accessible
✓ Focus indicator is visible
✓ Space bar toggles state
✓ aria-checked updates correctly
✓ role="switch" is present
✓ aria-label is descriptive
```

**Pass Criteria:**
- Full keyboard accessibility
- Proper ARIA attributes
- Screen reader compatible

---

## Test Case 10: Performance Verification

**Objective:** Verify live preview doesn't cause performance issues

**Steps:**
1. Enable live preview
2. Open browser Performance tab
3. Start recording
4. Change 10 different color pickers rapidly
5. Stop recording
6. Analyze performance metrics

**Expected Results:**
```
✓ No memory leaks detected
✓ Debouncing prevents excessive updates
✓ CPU usage remains reasonable
✓ No layout thrashing
✓ Smooth 60fps performance
```

**Pass Criteria:**
- Updates are debounced (300ms)
- No performance degradation
- Efficient CSS injection

---

## Regression Test Suite

Run all tests after applying fix:

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1. Initial State | ⬜ | Default enabled |
| 2. Toggle Disable | ⬜ | Turns off preview |
| 3. Toggle Enable | ⬜ | Turns on preview |
| 4. Preview Updates | ⬜ | CSS changes apply |
| 5. Multiple Clicks | ⬜ | No race conditions |
| 6. Handler Uniqueness | ⬜ | Single handler only |
| 7. Console Errors | ⬜ | Zero errors |
| 8. State Persistence | ⬜ | Optional feature |
| 9. Accessibility | ⬜ | Keyboard + ARIA |
| 10. Performance | ⬜ | No degradation |

---

## Automated Test Script (Optional)

```javascript
// Run in browser console for quick verification
(function() {
    console.log('=== MASE Live Preview Test Suite ===');
    
    // Test 1: Check for duplicate objects
    var hasMASE = typeof MASE !== 'undefined';
    var hasMASEAdmin = typeof MASEAdmin !== 'undefined';
    console.log('✓ MASE object exists:', hasMASE);
    console.log('✓ MASEAdmin object exists:', hasMASEAdmin);
    console.log(hasMASEAdmin ? '⚠️  WARNING: Duplicate object detected!' : '✓ No duplicates');
    
    // Test 2: Check event handler count
    var toggle = document.getElementById('mase-live-preview-toggle');
    if (toggle) {
        var events = $._data(toggle, 'events');
        var handlerCount = events && events.change ? events.change.length : 0;
        console.log('✓ Event handlers bound:', handlerCount);
        console.log(handlerCount === 1 ? '✓ Single handler (correct)' : '⚠️  WARNING: Multiple handlers!');
    }
    
    // Test 3: Check live preview state
    if (typeof MASE !== 'undefined') {
        console.log('✓ Live preview enabled:', MASE.state.livePreviewEnabled);
        console.log('✓ Toggle checked:', $('#mase-live-preview-toggle').is(':checked'));
    }
    
    // Test 4: Check for CSS tag
    var cssTag = document.getElementById('mase-live-preview-css');
    console.log('✓ Live preview CSS tag exists:', !!cssTag);
    
    console.log('=== Test Suite Complete ===');
})();
```

---

## Bug Report Template

If tests fail, use this template:

```markdown
**Test Case:** [Number and Name]
**Status:** FAILED
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Console Errors:** [Copy any errors]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Screenshots:** [Attach if relevant]
**Browser:** [Chrome/Firefox/Safari + version]
**WordPress Version:** [Version number]
**MASE Version:** 1.2.0
```

---

## Success Criteria Summary

All tests must pass for fix to be considered successful:

- ✅ Toggle enables/disables preview correctly
- ✅ Only ONE event handler bound
- ✅ No duplicate object initialization
- ✅ No JavaScript console errors
- ✅ Live preview updates work correctly
- ✅ Performance is acceptable
- ✅ Accessibility requirements met
- ✅ No race conditions or conflicts

---

**Document Version:** 1.0  
**Last Updated:** October 19, 2025  
**Test Coverage:** 10 test cases covering functionality, performance, and accessibility
