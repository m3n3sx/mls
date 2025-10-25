# Dark Mode Toggle - Manual Browser Testing Checklist

## Purpose

This checklist covers manual testing scenarios that complement automated tests. Use this for final validation before release.

---

## Desktop Browsers

### Google Chrome (Windows/Mac/Linux)

**Version Tested:** ___________  
**OS:** ___________  
**Date:** ___________  
**Tester:** ___________

#### Basic Functionality
- [ ] Dark mode toggle button visible in header
- [ ] Clicking toggle switches to dark mode
- [ ] Clicking again switches back to light mode
- [ ] Toggle icon changes (sun ↔ moon)
- [ ] Smooth color transition (no flicker)
- [ ] All UI elements update (admin bar, menu, content)

#### Persistence
- [ ] Dark mode preference saves to localStorage
- [ ] Preference persists after page refresh
- [ ] Preference persists after browser restart
- [ ] Preference syncs across tabs

#### System Preference
- [ ] Detects OS dark mode preference on first load
- [ ] Auto-updates when OS preference changes (if no manual override)
- [ ] Manual preference overrides system preference

#### Performance
- [ ] Toggle responds instantly (< 100ms)
- [ ] No lag or stuttering during transition
- [ ] No memory leaks after multiple toggles
- [ ] DevTools Console shows no errors

#### Accessibility
- [ ] Toggle has proper ARIA attributes
- [ ] Keyboard navigation works (Tab to focus)
- [ ] Space/Enter activates toggle
- [ ] Focus indicator visible
- [ ] Screen reader announces mode changes

**Notes/Issues:**
```
[Add any observations or issues here]
```

---

### Mozilla Firefox (Windows/Mac/Linux)

**Version Tested:** ___________  
**OS:** ___________  
**Date:** ___________  
**Tester:** ___________

#### Basic Functionality
- [ ] Dark mode toggle button visible in header
- [ ] Clicking toggle switches to dark mode
- [ ] Clicking again switches back to light mode
- [ ] Toggle icon changes (sun ↔ moon)
- [ ] Smooth color transition (no flicker)
- [ ] All UI elements update (admin bar, menu, content)

#### Persistence
- [ ] Dark mode preference saves to localStorage
- [ ] Preference persists after page refresh
- [ ] Preference persists after browser restart
- [ ] Preference syncs across tabs

#### System Preference
- [ ] Detects OS dark mode preference on first load
- [ ] Auto-updates when OS preference changes (if no manual override)
- [ ] Manual preference overrides system preference

#### Performance
- [ ] Toggle responds instantly (< 100ms)
- [ ] No lag or stuttering during transition
- [ ] No memory leaks after multiple toggles
- [ ] Browser Console shows no errors

#### Accessibility
- [ ] Toggle has proper ARIA attributes
- [ ] Keyboard navigation works (Tab to focus)
- [ ] Space/Enter activates toggle
- [ ] Focus indicator visible
- [ ] Screen reader announces mode changes

**Notes/Issues:**
```
[Add any observations or issues here]
```

---

### Safari (macOS)

**Version Tested:** ___________  
**OS:** ___________  
**Date:** ___________  
**Tester:** ___________

#### Basic Functionality
- [ ] Dark mode toggle button visible in header
- [ ] Clicking toggle switches to dark mode
- [ ] Clicking again switches back to light mode
- [ ] Toggle icon changes (sun ↔ moon)
- [ ] Smooth color transition (no flicker)
- [ ] All UI elements update (admin bar, menu, content)

#### Persistence
- [ ] Dark mode preference saves to localStorage
- [ ] Preference persists after page refresh
- [ ] Preference persists after browser restart
- [ ] Preference syncs across tabs

#### System Preference
- [ ] Detects macOS dark mode preference on first load
- [ ] Auto-updates when macOS preference changes (if no manual override)
- [ ] Manual preference overrides system preference

#### Performance
- [ ] Toggle responds instantly (< 100ms)
- [ ] No lag or stuttering during transition
- [ ] No memory leaks after multiple toggles
- [ ] Web Inspector shows no errors

#### Accessibility
- [ ] Toggle has proper ARIA attributes
- [ ] Keyboard navigation works (Tab to focus)
- [ ] Space/Enter activates toggle
- [ ] Focus indicator visible
- [ ] VoiceOver announces mode changes

**Safari-Specific Tests:**
- [ ] Webkit prefixes work correctly
- [ ] Private browsing mode works (localStorage may be limited)
- [ ] Works with Safari's Reader Mode

**Notes/Issues:**
```
[Add any observations or issues here]
```

---

### Microsoft Edge (Windows)

**Version Tested:** ___________  
**OS:** ___________  
**Date:** ___________  
**Tester:** ___________

#### Basic Functionality
- [ ] Dark mode toggle button visible in header
- [ ] Clicking toggle switches to dark mode
- [ ] Clicking again switches back to light mode
- [ ] Toggle icon changes (sun ↔ moon)
- [ ] Smooth color transition (no flicker)
- [ ] All UI elements update (admin bar, menu, content)

#### Persistence
- [ ] Dark mode preference saves to localStorage
- [ ] Preference persists after page refresh
- [ ] Preference persists after browser restart
- [ ] Preference syncs across tabs

#### System Preference
- [ ] Detects Windows dark mode preference on first load
- [ ] Auto-updates when Windows preference changes (if no manual override)
- [ ] Manual preference overrides system preference

#### Performance
- [ ] Toggle responds instantly (< 100ms)
- [ ] No lag or stuttering during transition
- [ ] No memory leaks after multiple toggles
- [ ] DevTools shows no errors

#### Accessibility
- [ ] Toggle has proper ARIA attributes
- [ ] Keyboard navigation works (Tab to focus)
- [ ] Space/Enter activates toggle
- [ ] Focus indicator visible
- [ ] Narrator announces mode changes

**Notes/Issues:**
```
[Add any observations or issues here]
```

---

## Mobile Devices

### iOS Safari (iPhone)

**Device:** ___________  
**iOS Version:** ___________  
**Date:** ___________  
**Tester:** ___________

#### Basic Functionality
- [ ] Dark mode toggle button visible and tappable
- [ ] Tapping toggle switches to dark mode
- [ ] Tapping again switches back to light mode
- [ ] Toggle icon changes (sun ↔ moon)
- [ ] Smooth color transition (no flicker)
- [ ] All UI elements update

#### Touch Interaction
- [ ] Toggle responds to tap immediately
- [ ] No double-tap required
- [ ] Touch target size adequate (44x44pt minimum)
- [ ] Works with VoiceOver gestures

#### Persistence
- [ ] Dark mode preference saves
- [ ] Preference persists after closing Safari
- [ ] Preference persists after device restart

#### Orientation
- [ ] Works in portrait mode
- [ ] Works in landscape mode
- [ ] Preference persists during orientation change

#### System Preference
- [ ] Detects iOS dark mode preference
- [ ] Auto-updates when iOS preference changes
- [ ] Manual preference overrides system preference

#### Performance
- [ ] Toggle responds instantly on device
- [ ] Smooth animations (60fps)
- [ ] No lag or stuttering
- [ ] No console errors (use Safari Remote Debugging)

**iOS-Specific Tests:**
- [ ] Works with iOS Safari's Reader Mode
- [ ] Works with iOS Safari's Private Browsing
- [ ] Works with iOS Safari's Desktop Mode
- [ ] Handles iOS Safari's bounce scrolling

**Notes/Issues:**
```
[Add any observations or issues here]
```

---

### iOS Safari (iPad)

**Device:** ___________  
**iOS Version:** ___________  
**Date:** ___________  
**Tester:** ___________

#### Basic Functionality
- [ ] Dark mode toggle button visible and tappable
- [ ] Tapping toggle switches to dark mode
- [ ] Tapping again switches back to light mode
- [ ] Toggle icon changes (sun ↔ moon)
- [ ] Smooth color transition (no flicker)
- [ ] All UI elements update

#### Touch Interaction
- [ ] Toggle responds to tap immediately
- [ ] Works with Apple Pencil
- [ ] Works with Magic Keyboard
- [ ] Works with trackpad/mouse (iPadOS 13.4+)

#### Split View / Multitasking
- [ ] Works in Split View mode
- [ ] Works in Slide Over mode
- [ ] Preference persists across multitasking

**Notes/Issues:**
```
[Add any observations or issues here]
```

---

### Android Chrome (Phone)

**Device:** ___________  
**Android Version:** ___________  
**Chrome Version:** ___________  
**Date:** ___________  
**Tester:** ___________

#### Basic Functionality
- [ ] Dark mode toggle button visible and tappable
- [ ] Tapping toggle switches to dark mode
- [ ] Tapping again switches back to light mode
- [ ] Toggle icon changes (sun ↔ moon)
- [ ] Smooth color transition (no flicker)
- [ ] All UI elements update

#### Touch Interaction
- [ ] Toggle responds to tap immediately
- [ ] No double-tap required
- [ ] Touch target size adequate (48x48dp minimum)
- [ ] Works with TalkBack gestures

#### Persistence
- [ ] Dark mode preference saves
- [ ] Preference persists after closing Chrome
- [ ] Preference persists after device restart

#### Orientation
- [ ] Works in portrait mode
- [ ] Works in landscape mode
- [ ] Preference persists during orientation change

#### System Preference
- [ ] Detects Android dark mode preference
- [ ] Auto-updates when Android preference changes
- [ ] Manual preference overrides system preference

#### Performance
- [ ] Toggle responds instantly on device
- [ ] Smooth animations (60fps)
- [ ] No lag or stuttering
- [ ] No console errors (use Chrome Remote Debugging)

**Android-Specific Tests:**
- [ ] Works with Chrome's Data Saver mode
- [ ] Works with Chrome's Lite mode
- [ ] Works with Chrome's Desktop mode
- [ ] Handles Android's back button correctly

**Notes/Issues:**
```
[Add any observations or issues here]
```

---

### Android Chrome (Tablet)

**Device:** ___________  
**Android Version:** ___________  
**Chrome Version:** ___________  
**Date:** ___________  
**Tester:** ___________

#### Basic Functionality
- [ ] Dark mode toggle button visible and tappable
- [ ] Tapping toggle switches to dark mode
- [ ] Tapping again switches back to light mode
- [ ] Toggle icon changes (sun ↔ moon)
- [ ] Smooth color transition (no flicker)
- [ ] All UI elements update

#### Multi-Window
- [ ] Works in split-screen mode
- [ ] Works in pop-up window mode
- [ ] Preference persists across windows

**Notes/Issues:**
```
[Add any observations or issues here]
```

---

## System Preference Testing

### macOS

**Version:** ___________  
**Date:** ___________  
**Tester:** ___________

#### System Preference Detection
1. Open System Preferences → General
2. Set Appearance to "Light"
3. Open WordPress admin (no manual preference set)
4. [ ] Admin loads in light mode
5. Change Appearance to "Dark"
6. [ ] Admin automatically switches to dark mode
7. Manually toggle dark mode in admin
8. Change system Appearance again
9. [ ] Admin ignores system change (manual override active)

**Notes/Issues:**
```
[Add any observations or issues here]
```

---

### Windows 10/11

**Version:** ___________  
**Date:** ___________  
**Tester:** ___________

#### System Preference Detection
1. Open Settings → Personalization → Colors
2. Set "Choose your color" to "Light"
3. Open WordPress admin (no manual preference set)
4. [ ] Admin loads in light mode
5. Change to "Dark"
6. [ ] Admin automatically switches to dark mode
7. Manually toggle dark mode in admin
8. Change system color again
9. [ ] Admin ignores system change (manual override active)

**Notes/Issues:**
```
[Add any observations or issues here]
```

---

### Linux (GNOME)

**Distribution:** ___________  
**GNOME Version:** ___________  
**Date:** ___________  
**Tester:** ___________

#### System Preference Detection
1. Open Settings → Appearance
2. Set to "Light"
3. Open WordPress admin (no manual preference set)
4. [ ] Admin loads in light mode
5. Change to "Dark"
6. [ ] Admin automatically switches to dark mode
7. Manually toggle dark mode in admin
8. Change system appearance again
9. [ ] Admin ignores system change (manual override active)

**Notes/Issues:**
```
[Add any observations or issues here]
```

---

## Accessibility Testing

### Screen Readers

#### NVDA (Windows)
- [ ] Toggle button announced correctly
- [ ] Mode changes announced
- [ ] ARIA attributes read correctly
- [ ] Keyboard navigation works

#### JAWS (Windows)
- [ ] Toggle button announced correctly
- [ ] Mode changes announced
- [ ] ARIA attributes read correctly
- [ ] Keyboard navigation works

#### VoiceOver (macOS/iOS)
- [ ] Toggle button announced correctly
- [ ] Mode changes announced
- [ ] ARIA attributes read correctly
- [ ] Keyboard/gesture navigation works

#### TalkBack (Android)
- [ ] Toggle button announced correctly
- [ ] Mode changes announced
- [ ] ARIA attributes read correctly
- [ ] Gesture navigation works

### Keyboard Navigation

- [ ] Tab key focuses toggle
- [ ] Shift+Tab moves focus backward
- [ ] Space key activates toggle
- [ ] Enter key activates toggle
- [ ] Focus indicator clearly visible
- [ ] Focus order logical

### High Contrast Mode

**Windows High Contrast:**
- [ ] Toggle visible in high contrast mode
- [ ] Colors meet contrast requirements
- [ ] Focus indicators visible

**macOS Increase Contrast:**
- [ ] Toggle visible with increased contrast
- [ ] Colors meet contrast requirements
- [ ] Focus indicators visible

### Reduced Motion

**Test with prefers-reduced-motion:**
- [ ] Transitions disabled or instant
- [ ] Icon rotation disabled
- [ ] Functionality still works
- [ ] No jarring changes

---

## Performance Testing

### Toggle Speed
1. Open browser DevTools Performance tab
2. Start recording
3. Toggle dark mode 10 times
4. Stop recording
5. [ ] Average toggle time < 100ms
6. [ ] No long tasks (> 50ms)
7. [ ] No layout thrashing

### Memory Usage
1. Open browser DevTools Memory tab
2. Take heap snapshot
3. Toggle dark mode 50 times
4. Take another heap snapshot
5. [ ] Memory increase < 2MB
6. [ ] No detached DOM nodes
7. [ ] No memory leaks

### Network
- [ ] No unnecessary network requests on toggle
- [ ] AJAX save request completes successfully
- [ ] Handles network errors gracefully

---

## Edge Cases

### Rapid Toggling
- [ ] Handles rapid clicking without errors
- [ ] Doesn't break after 100+ toggles
- [ ] No race conditions
- [ ] No visual glitches

### localStorage Limits
1. Fill localStorage with data
2. Try to toggle dark mode
3. [ ] Handles quota exceeded gracefully
4. [ ] Shows appropriate error message
5. [ ] Functionality degrades gracefully

### Private/Incognito Mode
- [ ] Toggle works in private browsing
- [ ] localStorage available (or fallback works)
- [ ] No errors in console

### Multiple Tabs
1. Open admin in two tabs
2. Toggle dark mode in tab 1
3. [ ] Tab 2 updates automatically (if implemented)
4. [ ] No conflicts between tabs

### Browser Extensions
Test with common extensions:
- [ ] Ad blockers (uBlock Origin, AdBlock Plus)
- [ ] Privacy extensions (Privacy Badger, Ghostery)
- [ ] Dark mode extensions (Dark Reader)
- [ ] No conflicts or errors

---

## Visual Regression

### Color Accuracy
- [ ] Dark mode colors match design specs
- [ ] Light mode colors match design specs
- [ ] Contrast ratios meet WCAG AA (4.5:1)
- [ ] No color bleeding or artifacts

### Layout Stability
- [ ] No layout shift during toggle
- [ ] No content reflow
- [ ] No scrollbar appearance/disappearance
- [ ] No element position changes

### Animation Quality
- [ ] Smooth color transitions (0.3s)
- [ ] Icon rotation smooth (360deg)
- [ ] No stuttering or jank
- [ ] Consistent across browsers

---

## Summary

**Total Tests:** _____  
**Passed:** _____  
**Failed:** _____  
**Blocked:** _____  

**Critical Issues:**
```
[List any critical issues that block release]
```

**Minor Issues:**
```
[List any minor issues that can be addressed later]
```

**Recommendations:**
```
[Any recommendations for improvements]
```

**Sign-off:**
- [ ] All critical tests passed
- [ ] No blocking issues
- [ ] Ready for release

**Tester Signature:** ___________  
**Date:** ___________
