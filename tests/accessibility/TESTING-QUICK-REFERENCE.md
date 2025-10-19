# Accessibility Testing - Quick Reference Card

## 🎯 5-Minute Test Suite

### 1️⃣ Keyboard Test (1 min)
```bash
open test-keyboard-navigation.html
```
- Press **Tab** → All elements reachable?
- Press **Arrow keys** in tabs → Navigation works?
- Press **Escape** in modal → Closes?

**Pass:** ✅ No keyboard traps, all elements accessible

---

### 2️⃣ Screen Reader Test (2 min)
```bash
# Windows: Ctrl+Alt+N (NVDA)
# Mac: Cmd+F5 (VoiceOver)
open test-screen-reader.html
```
- Navigate with screen reader
- All labels announced?
- Live regions working?

**Pass:** ✅ All content announced correctly

---

### 3️⃣ Contrast Test (1 min)
```bash
open test-color-contrast.html
```
- Check all 10 palettes
- All show green "PASS"?
- Ratios ≥ 4.5:1?

**Pass:** ✅ All palettes meet WCAG AA

---

### 4️⃣ High Contrast (30 sec)
```bash
# Windows: Left Alt + Left Shift + Print Screen
# Mac: System Prefs → Accessibility → Display → Increase contrast
open test-high-contrast-mode.html
```
- Borders visible (2px)?
- Text readable?
- Focus indicators enhanced (3px)?

**Pass:** ✅ All content visible and enhanced

---

### 5️⃣ Reduced Motion (30 sec)
```bash
# Windows: Settings → Ease of Access → Display → Animations OFF
# Mac: System Prefs → Accessibility → Display → Reduce motion ON
open test-reduced-motion.html
```
- Animations stopped?
- Transitions instant?
- No motion on hover?

**Pass:** ✅ All motion disabled

---

## 📋 Quick Checklist

```
□ Keyboard navigation works
□ Screen reader announces all content
□ Color contrast ≥ 4.5:1
□ High contrast mode works
□ Reduced motion works
```

---

## 🔧 System Settings

### Windows
- **High Contrast:** Left Alt + Left Shift + Print Screen
- **Reduced Motion:** Settings → Ease of Access → Display → Show animations (OFF)
- **Screen Reader:** Ctrl+Alt+N (NVDA)

### Mac
- **High Contrast:** System Prefs → Accessibility → Display → Increase contrast
- **Reduced Motion:** System Prefs → Accessibility → Display → Reduce motion
- **Screen Reader:** Cmd+F5 (VoiceOver)

### Linux
- **High Contrast:** Settings → Universal Access → High Contrast
- **Reduced Motion:** Settings → Universal Access → Reduce animation
- **Screen Reader:** Super+Alt+S (Orca)

---

## 🆘 Quick Fixes

| Issue | Solution |
|-------|----------|
| Focus not visible | Check mase-accessibility.css is loaded |
| Screen reader silent | Verify ARIA labels in HTML |
| Low contrast | Use contrast checker tool |
| Animations running | Enable reduced motion in system |

---

## 📊 Pass Criteria

- ✅ All interactive elements keyboard accessible
- ✅ No keyboard traps
- ✅ All content announced by screen readers
- ✅ Color contrast ≥ 4.5:1 (WCAG AA)
- ✅ High contrast mode working (7:1)
- ✅ Reduced motion working (no animations)

---

## 🤖 Automated Test

```bash
node automated-accessibility-tests.js
```

**Expected:** 8/8 tests passed

---

## 📚 Full Docs

- `README.md` - Complete guide
- `accessibility-test-checklist.md` - 200+ points
- `QUICK-START.md` - Detailed 5-min guide
- `TASK-27-COMPLETION-REPORT.md` - Full report

---

## ✅ Requirements

- **13.1** High contrast (7:1) ✅
- **13.2** Reduced motion ✅
- **13.3** Focus indicators (2px) ✅
- **13.4** Keyboard navigation ✅
- **13.5** Screen reader support ✅

---

**Print this card and keep it handy!** 📄
