# Accessibility Testing - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Keyboard Navigation Test (1 minute)
```bash
open woow-admin/tests/accessibility/test-keyboard-navigation.html
```
- Press **Tab** to navigate through all controls
- Use **Arrow keys** in the tab list
- Verify all elements are reachable
- Check that focus indicators are visible (2px outline)

**Expected Result:** ✅ All elements keyboard accessible, no traps

---

### Step 2: Screen Reader Test (2 minutes)

**Windows (NVDA):**
```bash
# Start NVDA: Ctrl+Alt+N
open woow-admin/tests/accessibility/test-screen-reader.html
# Read all: Insert+Down Arrow
```

**Mac (VoiceOver):**
```bash
# Start VoiceOver: Cmd+F5
open woow-admin/tests/accessibility/test-screen-reader.html
# Read all: VO+A (Ctrl+Option+A)
```

**Expected Result:** ✅ All content announced correctly

---

### Step 3: Color Contrast Test (1 minute)
```bash
open woow-admin/tests/accessibility/test-color-contrast.html
```
- Use the interactive contrast checker
- Verify all 10 palettes show green "PASS" badges
- Check that all ratios are ≥ 4.5:1

**Expected Result:** ✅ All palettes meet WCAG AA (4.5:1)

---

### Step 4: High Contrast Mode Test (30 seconds)

**Enable High Contrast:**
- **Windows:** Left Alt + Left Shift + Print Screen
- **Mac:** System Preferences → Accessibility → Display → Increase contrast

```bash
open woow-admin/tests/accessibility/test-high-contrast-mode.html
```

**Expected Result:** ✅ All borders visible, text readable, focus indicators enhanced

---

### Step 5: Reduced Motion Test (30 seconds)

**Enable Reduced Motion:**
- **Windows:** Settings → Ease of Access → Display → Show animations (OFF)
- **Mac:** System Preferences → Accessibility → Display → Reduce motion (ON)

```bash
open woow-admin/tests/accessibility/test-reduced-motion.html
```

**Expected Result:** ✅ All animations stopped, transitions instant

---

## 📋 Checklist (Print This)

```
□ Keyboard Navigation
  □ Tab key works
  □ Arrow keys work in tabs
  □ No keyboard traps
  □ Focus indicators visible

□ Screen Reader
  □ All labels announced
  □ ARIA live regions work
  □ Semantic HTML correct

□ Color Contrast
  □ All palettes ≥ 4.5:1
  □ Text readable
  □ UI components visible

□ High Contrast Mode
  □ Borders visible (2px)
  □ Text contrast 7:1
  □ Focus indicators 3px

□ Reduced Motion
  □ Animations disabled
  □ Transitions instant
  □ No motion on hover
```

---

## 🤖 Automated Tests (Optional)

```bash
# Run all automated tests
node woow-admin/tests/accessibility/automated-accessibility-tests.js

# View report
open woow-admin/tests/accessibility/reports/accessibility-report-*.html
```

---

## ✅ Pass Criteria

All tests must show:
- ✅ Green checkmarks or "PASS" status
- ✅ No keyboard traps
- ✅ All content accessible
- ✅ Contrast ratios ≥ 4.5:1
- ✅ High contrast mode working
- ✅ Reduced motion working

---

## 🆘 Troubleshooting

### Issue: Focus indicators not visible
**Solution:** Check that `mase-accessibility.css` is loaded

### Issue: Screen reader not announcing
**Solution:** Verify ARIA labels are present in HTML

### Issue: Contrast too low
**Solution:** Use the contrast checker tool to adjust colors

### Issue: Animations still running
**Solution:** Verify reduced motion is enabled in system settings

---

## 📚 Full Documentation

For detailed testing instructions, see:
- `README.md` - Complete testing guide
- `accessibility-test-checklist.md` - 200+ point checklist
- `TASK-27-COMPLETION-REPORT.md` - Full completion report

---

## 🎯 Requirements Covered

- ✅ **Requirement 13.1:** High contrast mode (7:1)
- ✅ **Requirement 13.2:** Reduced motion
- ✅ **Requirement 13.3:** Focus indicators (2px)
- ✅ **Requirement 13.4:** Keyboard navigation
- ✅ **Requirement 13.5:** Screen reader support

---

**Total Time:** ~5 minutes  
**Difficulty:** Easy  
**Tools Needed:** Web browser, keyboard, screen reader (optional)
