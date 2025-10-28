# Dark/Light Mode Toggle - User Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Using the FAB (Floating Action Button)](#using-the-fab-floating-action-button)
4. [Keyboard Shortcuts](#keyboard-shortcuts)
5. [Settings Configuration](#settings-configuration)
6. [Dark Mode Palettes](#dark-mode-palettes)
7. [System Preference Detection](#system-preference-detection)
8. [Troubleshooting](#troubleshooting)

---

## Introduction

The Dark/Light Mode Toggle feature allows you to seamlessly switch between light and dark color schemes in the WordPress admin interface. This feature is designed to reduce eye strain, improve readability in different lighting conditions, and provide a modern, customizable admin experience.

### Key Features

- **Floating Action Button (FAB)**: Always-accessible toggle button in the bottom-right corner
- **Keyboard Shortcut**: Quick toggle with Ctrl/Cmd+Shift+D
- **System Preference Detection**: Automatically matches your operating system's dark mode setting
- **Persistent Preferences**: Your choice is saved across sessions and devices
- **Smooth Transitions**: Professional 0.3-second color transitions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance**: Sub-50ms toggle time for instant response

---

## Getting Started

### Enabling Dark Mode

The dark mode toggle is enabled by default after installing MASE. You can start using it immediately:

1. **Look for the FAB**: A circular button appears in the bottom-right corner of your admin interface
2. **Click to Toggle**: Click the button to switch between light and dark modes
3. **Watch the Transition**: Colors smoothly transition over 0.3 seconds
4. **Your Preference is Saved**: The mode persists across page loads and sessions

### First-Time Setup

When you first use MASE with dark mode enabled:

1. **System Detection**: MASE checks your operating system's dark mode preference
2. **Auto-Apply**: If your OS is in dark mode, MASE starts in dark mode
3. **Manual Override**: Click the FAB to override the system preference
4. **Preference Saved**: Your manual choice takes precedence over system settings

---

## Using the FAB (Floating Action Button)

### What is the FAB?

The FAB is a circular button that floats in the bottom-right corner of your admin interface. It provides quick access to the dark mode toggle from any admin page.

### FAB Icons

- **Sun Icon** (☀️): Displayed when in light mode. Click to switch to dark mode.
- **Moon Icon** (🌙): Displayed when in dark mode. Click to switch to light mode.

### FAB Tooltip

Hover over the FAB to see a tooltip:
- **"Switch to Dark Mode"**: When in light mode
- **"Switch to Light Mode"**: When in dark mode

### FAB Behavior

- **Always Visible**: The FAB appears on all WordPress admin pages
- **Fixed Position**: Stays in the bottom-right corner even when scrolling
- **High Z-Index**: Always visible above other elements
- **Responsive**: Adjusts position on mobile devices to avoid UI conflicts
- **Animation**: Icon rotates 360° when toggling modes

### Mobile Considerations

On mobile devices (viewport width < 768px):
- FAB position adjusts to avoid overlapping with mobile UI elements
- Touch-friendly size for easy tapping
- Tooltip may not appear on touch devices (tap to toggle directly)

---

## Keyboard Shortcuts

### Toggle Dark Mode

**Windows/Linux**: `Ctrl + Shift + D`  
**Mac**: `Cmd + Shift + D`

This keyboard shortcut works from anywhere in the WordPress admin interface.

### Shortcut Behavior

- **Instant Toggle**: Switches mode immediately
- **Visual Feedback**: FAB animates to confirm the action
- **Screen Reader Announcement**: Mode change is announced to screen readers
- **Input Field Protection**: Shortcut doesn't trigger when typing in input fields or textareas

### FAB Keyboard Navigation

The FAB is fully keyboard accessible:

1. **Tab to FAB**: Press Tab repeatedly until the FAB receives focus
2. **Visible Focus Indicator**: A 2px outline appears when focused
3. **Activate with Enter or Space**: Press Enter or Space to toggle mode
4. **Screen Reader Support**: FAB has proper ARIA labels and role

---

## Settings Configuration

### Accessing Dark Mode Settings

1. Navigate to **Modern Admin Styler** in the admin menu
2. Click on the **Advanced** tab
3. Scroll to the **Dark Mode Settings** section

### Available Settings

#### Enable/Disable Dark Mode Toggle

- **Setting**: Enable Dark Mode Toggle
- **Default**: Enabled
- **Description**: Turn the entire dark mode feature on or off
- **Effect**: When disabled, the FAB is hidden and dark mode is unavailable

#### Light Mode Palette

- **Setting**: Light Palette
- **Default**: Professional Blue
- **Options**: All available light palettes
- **Description**: The color palette used when in light mode
- **Effect**: Changes the colors applied in light mode

#### Dark Mode Palette

- **Setting**: Dark Palette
- **Default**: Dark Elegance
- **Options**: All available dark palettes
- **Description**: The color palette used when in dark mode
- **Effect**: Changes the colors applied in dark mode

#### Transition Duration

- **Setting**: Transition Duration
- **Range**: 100-1000ms
- **Default**: 300ms
- **Description**: How long color transitions take when switching modes
- **Effect**: Longer durations create slower, more gradual transitions

#### Keyboard Shortcut

- **Setting**: Enable Keyboard Shortcut
- **Default**: Enabled
- **Description**: Enable or disable the Ctrl/Cmd+Shift+D shortcut
- **Effect**: When disabled, only the FAB can toggle dark mode

#### Respect System Preference

- **Setting**: Respect System Preference
- **Default**: Enabled
- **Description**: Automatically match your OS dark mode setting
- **Effect**: When enabled and no manual preference is set, MASE follows your OS

#### FAB Position

- **Setting**: FAB Position
- **Options**: 
  - Bottom: 20px (default)
  - Right: 20px (default)
- **Range**: 0-100px for each side
- **Description**: Adjust the FAB's position from the bottom and right edges
- **Effect**: Customize FAB placement to avoid conflicts with other UI elements

### Saving Settings

1. Make your desired changes in the Dark Mode Settings section
2. Scroll to the top or bottom of the page
3. Click **Save Settings**
4. A success message confirms your settings are saved
5. Changes apply immediately

---

## Dark Mode Palettes

MASE includes three professionally designed dark mode palettes optimized for low-light viewing.

### 1. Dark Elegance (Default)

- **Primary**: #1F2937 (Charcoal)
- **Secondary**: #374151 (Dark Gray)
- **Accent**: #60A5FA (Light Blue)
- **Background**: #111827 (Almost Black)
- **Text**: #E0E0E0 (Light Gray)
- **Use Case**: General purpose, comfortable for extended use
- **Contrast Ratio**: 7.5:1 (WCAG AAA)

### 2. Midnight Blue

- **Primary**: #0F172A (Deep Navy)
- **Secondary**: #1E293B (Navy)
- **Accent**: #38BDF8 (Sky Blue)
- **Background**: #020617 (Almost Black)
- **Text**: #F1F5F9 (Off White)
- **Use Case**: Professional, tech-focused environments
- **Contrast Ratio**: 8.2:1 (WCAG AAA)

### 3. Charcoal

- **Primary**: #18181B (Charcoal)
- **Secondary**: #27272A (Dark Gray)
- **Accent**: #A78BFA (Purple)
- **Background**: #09090B (True Black)
- **Text**: #FAFAFA (White)
- **Use Case**: Maximum contrast, OLED-friendly
- **Contrast Ratio**: 9.1:1 (WCAG AAA)

### Choosing a Dark Palette

1. Navigate to **Modern Admin Styler** → **Advanced** tab
2. Find **Dark Mode Settings** section
3. Click the **Dark Palette** dropdown
4. Select your preferred palette
5. Click **Save Settings**
6. Switch to dark mode to see the new palette

### Custom Dark Palettes

You can create custom dark palettes:

1. Switch to dark mode
2. Customize colors in the **Admin Bar** and **Menu** tabs
3. Click **Save as Custom Palette**
4. Enter a name (e.g., "My Dark Theme")
5. Your custom palette appears in the Dark Palette dropdown

**Tips for Custom Dark Palettes**:
- Use dark backgrounds (luminance < 0.3)
- Use light text (luminance > 0.7)
- Maintain contrast ratio of at least 4.5:1 (WCAG AA)
- Test readability of all text elements
- Avoid pure black (#000000) - use near-black for better readability

---

## System Preference Detection

### What is System Preference Detection?

MASE can automatically detect your operating system's dark mode setting and match it. This creates a consistent experience across your OS and WordPress admin.

### How It Works

1. **First Load**: When you first use MASE, it checks your OS preference
2. **Auto-Apply**: If your OS is in dark mode, MASE starts in dark mode
3. **No Manual Preference**: This only happens if you haven't manually set a preference
4. **Manual Override**: Once you click the FAB, your manual choice takes precedence

### Enabling/Disabling System Preference

1. Navigate to **Modern Admin Styler** → **Advanced** tab
2. Find **Dark Mode Settings** section
3. Toggle **Respect System Preference**
4. Click **Save Settings**

**When Enabled**:
- MASE follows your OS dark mode setting (if no manual preference exists)
- Automatically updates when you change your OS setting
- Provides a seamless experience across your system

**When Disabled**:
- MASE uses the default light mode (unless you manually toggle)
- OS changes don't affect MASE
- Useful if you want different modes for OS and WordPress

### Checking Your OS Dark Mode Setting

**Windows 10/11**:
1. Settings → Personalization → Colors
2. Choose your color: Light or Dark

**macOS**:
1. System Preferences → General
2. Appearance: Light or Dark

**Linux (GNOME)**:
1. Settings → Appearance
2. Style: Light or Dark

### System Preference Monitoring

When **Respect System Preference** is enabled and you haven't manually set a preference:

- MASE monitors your OS setting in real-time
- When you change your OS dark mode, MASE updates automatically
- No page refresh required
- Smooth transition to the new mode

**To Reset to System Preference**:
1. Clear your manual preference by clearing browser localStorage
2. Or reset MASE settings to defaults
3. MASE will revert to following your OS preference

---

## Troubleshooting

### Dark Mode Not Working

**Symptoms**:
- FAB doesn't appear
- Clicking FAB doesn't change colors
- Dark mode doesn't persist after page reload

**Solutions**:

1. **Check if Dark Mode is Enabled**
   - Navigate to **Modern Admin Styler** → **Advanced** tab
   - Verify **Enable Dark Mode Toggle** is checked
   - Save settings if needed

2. **Clear Browser Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely
   - Reload the page

3. **Check JavaScript Console**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Look for MASE-related errors

4. **Verify Settings Saved**
   - Check if settings save successfully
   - Look for success message after saving
   - Try saving again if needed

### FAB Not Visible

**Symptoms**:
- FAB doesn't appear on admin pages
- FAB is hidden behind other elements

**Solutions**:

1. **Check Z-Index Conflicts**
   - Another plugin may have higher z-index
   - Use browser DevTools to inspect FAB
   - Add custom CSS to increase z-index:
   ```css
   .mase-dark-mode-fab {
       z-index: 999999 !important;
   }
   ```

2. **Check FAB Position**
   - Navigate to **Modern Admin Styler** → **Advanced** tab
   - Adjust **FAB Position** settings
   - Move FAB away from conflicting elements

3. **Check for Plugin Conflicts**
   - Deactivate other plugins temporarily
   - Check if FAB appears
   - Reactivate plugins one by one to identify conflict

### Colors Not Changing

**Symptoms**:
- FAB icon changes but colors stay the same
- Some colors change, others don't
- Transition is incomplete

**Solutions**:

1. **Clear CSS Cache**
   - Save settings to regenerate CSS
   - Clear WordPress transients
   - Hard refresh browser

2. **Check Dark Palette**
   - Verify a dark palette is selected
   - Navigate to **Modern Admin Styler** → **Advanced** tab
   - Select a dark palette from dropdown
   - Save settings

3. **Check for CSS Conflicts**
   - Another plugin may override colors
   - Use browser DevTools to inspect elements
   - Check which CSS rules are applied
   - Add custom CSS with higher specificity if needed

### Keyboard Shortcut Not Working

**Symptoms**:
- Ctrl/Cmd+Shift+D doesn't toggle mode
- Shortcut works sometimes but not always

**Solutions**:

1. **Check if Shortcut is Enabled**
   - Navigate to **Modern Admin Styler** → **Advanced** tab
   - Verify **Enable Keyboard Shortcut** is checked
   - Save settings if needed

2. **Check for Conflicts**
   - Another plugin or browser extension may use the same shortcut
   - Try disabling extensions temporarily
   - Check browser console for errors

3. **Check Focus Context**
   - Shortcut doesn't work in input fields or textareas (by design)
   - Click outside input fields and try again
   - Ensure page has focus (not DevTools)

### Preference Not Persisting

**Symptoms**:
- Mode resets to light after page reload
- Preference doesn't sync across devices
- Mode changes but doesn't save

**Solutions**:

1. **Check localStorage**
   - Open browser DevTools (F12)
   - Go to Application tab → Local Storage
   - Look for `mase_dark_mode` key
   - If missing, localStorage may be disabled

2. **Check User Meta**
   - Preference should save to WordPress user meta
   - Check if AJAX save completes successfully
   - Look for success message in console

3. **Check Browser Settings**
   - Ensure cookies and localStorage are enabled
   - Check if browser is in private/incognito mode
   - Try a different browser

4. **Check Server Response**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Toggle dark mode
   - Check AJAX request to `admin-ajax.php`
   - Verify response is successful (200 OK)

### System Preference Not Detected

**Symptoms**:
- MASE doesn't match OS dark mode
- System preference changes don't update MASE
- Always starts in light mode

**Solutions**:

1. **Check if Respect System Preference is Enabled**
   - Navigate to **Modern Admin Styler** → **Advanced** tab
   - Verify **Respect System Preference** is checked
   - Save settings if needed

2. **Clear Manual Preference**
   - Your manual preference overrides system preference
   - To reset, clear localStorage:
   ```javascript
   localStorage.removeItem('mase_dark_mode');
   ```
   - Or reset MASE settings to defaults

3. **Check Browser Support**
   - System preference detection requires `prefers-color-scheme` support
   - Works in: Chrome 76+, Firefox 67+, Safari 12.1+, Edge 79+
   - Update browser if needed

4. **Check OS Setting**
   - Verify your OS is actually in dark mode
   - See [Checking Your OS Dark Mode Setting](#checking-your-os-dark-mode-setting)

### Slow Transitions

**Symptoms**:
- Color transitions are laggy
- Browser freezes during toggle
- Animations are choppy

**Solutions**:

1. **Reduce Transition Duration**
   - Navigate to **Modern Admin Styler** → **Advanced** tab
   - Reduce **Transition Duration** to 100-200ms
   - Save settings

2. **Enable Performance Mode**
   - Navigate to **Effects** tab
   - Enable **Performance Mode**
   - This disables expensive visual effects

3. **Check Browser Performance**
   - Close unnecessary tabs
   - Disable browser extensions
   - Restart browser

4. **Enable Reduced Motion**
   - If you have `prefers-reduced-motion` enabled in your OS
   - MASE automatically disables transitions
   - Transitions become instant (0s duration)

### Accessibility Issues

**Symptoms**:
- Screen reader doesn't announce mode changes
- FAB not keyboard accessible
- Focus indicator not visible

**Solutions**:

1. **Check Screen Reader Support**
   - MASE announces mode changes to screen readers
   - Ensure screen reader is running
   - Check ARIA live region is present in DOM

2. **Check Keyboard Navigation**
   - Tab to FAB (may require multiple Tab presses)
   - Press Enter or Space to toggle
   - Check for visible focus indicator (2px outline)

3. **Check ARIA Attributes**
   - FAB should have `role="switch"`
   - FAB should have `aria-label="Toggle dark mode"`
   - FAB should have `aria-pressed="true"` or `"false"`
   - Use browser DevTools to inspect attributes

4. **Report Accessibility Issues**
   - If you encounter accessibility problems
   - Please report them so we can fix them
   - Include details about your assistive technology

---

## Best Practices

### When to Use Dark Mode

**Recommended**:
- Working in low-light environments
- Extended admin sessions (reduces eye strain)
- Late-night work
- Personal preference for dark interfaces
- OLED displays (saves battery)

**Consider Light Mode**:
- Bright environments
- Detailed color work (light mode may show colors more accurately)
- Printing or screenshots (light backgrounds print better)
- Accessibility needs (some users find light mode more readable)

### Customizing Dark Mode

1. **Start with a Preset**: Choose Dark Elegance, Midnight Blue, or Charcoal
2. **Fine-Tune Colors**: Adjust colors in Admin Bar and Menu tabs
3. **Test Readability**: Ensure all text is readable
4. **Check Contrast**: Use browser DevTools to verify contrast ratios
5. **Save as Custom**: Save your customization as a custom palette

### Syncing Across Devices

Your dark mode preference syncs across devices automatically:

1. **Preference Saved to User Meta**: Stored in WordPress database
2. **Available on All Devices**: Log in from any device to see your preference
3. **localStorage as Backup**: Provides instant loading on the same device

**Note**: If you use different browsers or clear cookies, you may need to toggle dark mode once on each browser to sync the preference.

---

## Keyboard Shortcuts Reference

| Shortcut | Action | Notes |
|----------|--------|-------|
| `Ctrl+Shift+D` (Win/Linux) | Toggle dark mode | Works from any admin page |
| `Cmd+Shift+D` (Mac) | Toggle dark mode | Works from any admin page |
| `Tab` | Navigate to FAB | May require multiple presses |
| `Enter` or `Space` | Activate FAB | When FAB has focus |

---

## Additional Resources

- [Dark Mode Developer Documentation](./DARK-MODE-DEVELOPER-GUIDE.md)
- [Dark Mode Troubleshooting Guide](./TROUBLESHOOTING.md#dark-mode-issues)
- [MASE User Guide](./USER-GUIDE.md)
- [Accessibility Guide](./USER-GUIDE.md#accessibility)

---

## Feedback and Support

If you have questions, suggestions, or issues with the dark mode feature:

1. Check this guide and the [Troubleshooting](#troubleshooting) section
2. Review the [main Troubleshooting Guide](./TROUBLESHOOTING.md)
3. Check the [GitHub Issues](https://github.com/your-org/modern-admin-styler/issues)
4. Submit a new issue with detailed information

We're constantly improving the dark mode feature based on user feedback!
