# MASE v1.2.0 - Quick Test Reference Card

## 🚀 Quick Start

```bash
# Open the main test suite
open .kiro/specs/critical-fixes-v1.2.0/integration-test-suite.html
```

Click **"Run All Tests"** → Wait 2-3 seconds → Review results

## ✅ Expected Results

All sections should show **PASS** (green):
- ✅ 9.1 Live Preview Functionality
- ✅ 9.2 Dark Mode Functionality  
- ✅ 9.3 Settings Save Functionality
- ✅ 9.4 Tab Navigation
- ✅ 9.5 Card Layout Responsiveness
- ✅ 9.6 Cross-Browser Compatibility
- ✅ 9.7 Error Handling

## 🧪 Individual Test Files

| Test | File | Quick Check |
|------|------|-------------|
| **Live Preview** | `test-live-preview.html` | Toggle on → Change color → See update |
| **Dark Mode** | `test-dark-mode.html` | Toggle on → See dark theme → Reload → Still dark |
| **AJAX Save** | `test-ajax-save.html` | Click tests → See green PASS |
| **Tab Navigation** | `test-tab-navigation.html` | Click tabs → Content switches |
| **Card Layout** | `test-card-layout.html` | Resize window → Cards adapt |
| **Console Logging** | `test-console-logging.html` | Open console → See logs |
| **Script Enqueuing** | `test-script-enqueuing.php` | Load in WP → Check source |

## 🔍 Quick Validation

### 1. Live Preview (30 seconds)
```
1. Open test-live-preview.html
2. Check "Enable Live Preview"
3. Change admin bar color
4. Verify color updates immediately
✅ PASS if color changes in real-time
```

### 2. Dark Mode (30 seconds)
```
1. Open test-dark-mode.html
2. Toggle dark mode ON
3. Verify dark colors applied
4. Reload page
5. Verify dark mode persists
✅ PASS if dark mode stays after reload
```

### 3. Settings Save (30 seconds)
```
1. Open test-ajax-save.html
2. Click "Run Test" buttons
3. Verify all show PASS
✅ PASS if all tests green
```

### 4. Tab Navigation (30 seconds)
```
1. Open test-tab-navigation.html
2. Click different tabs
3. Verify content switches
4. Reload page
5. Verify last tab is active
✅ PASS if tab persists after reload
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Tests not running | Check browser console (F12) |
| MASE not found | Verify mase-admin.js is loaded |
| All tests fail | Clear cache and reload |
| Some tests fail | Review console for specific errors |

## 📊 Success Criteria

**All tests pass when:**
- ✅ No red "FAIL" indicators
- ✅ All sections show green "PASS"
- ✅ Console shows "All tests completed"
- ✅ No JavaScript errors in console

## 🎯 Critical Checks

Must verify these work:
1. ✅ Live preview updates in real-time
2. ✅ Dark mode persists after reload
3. ✅ Tabs switch and persist
4. ✅ No console errors

## 📱 Browser Testing

Test in each browser:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

## ⚡ Performance Checks

Expected timings:
- Live preview update: < 300ms
- Tab switch: < 100ms
- Dark mode toggle: < 100ms

## 🔗 Quick Links

- **Main Suite:** `integration-test-suite.html`
- **Full Guide:** `TASK-9-TESTING-GUIDE.md`
- **Summary:** `TASK-9-IMPLEMENTATION-SUMMARY.md`

## 📝 Report Template

```
Test Date: [DATE]
Browser: [BROWSER VERSION]
Results: [PASS/FAIL]

Failed Tests:
- [List any failures]

Notes:
- [Any observations]
```

---

**Total Test Time:** ~5 minutes for complete validation  
**Minimum Test Time:** ~2 minutes for automated suite only
