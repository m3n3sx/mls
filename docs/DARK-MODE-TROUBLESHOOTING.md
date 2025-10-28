# Dark/Light Mode Toggle - Troubleshooting Guide

## Table of Contents

1. [Common Issues](#common-issues)
2. [FAB (Floating Action Button) Issues](#fab-floating-action-button-issues)
3. [Color and Palette Issues](#color-and-palette-issues)
4. [Persistence Issues](#persistence-issues)
5. [System Preference Issues](#system-preference-issues)
6. [Performance Issues](#performance-issues)
7. [Accessibility Issues](#accessibility-issues)
8. [Browser Compatibility](#browser-compatibility)
9. [Advanced Troubleshooting](#advanced-troubleshooting)

---

## Common Issues

### Dark Mode Not Working at All

**Symptoms**:
- FAB doesn't appear
- Clicking FAB doesn't change colors
- Dark mode setting has no effect

**Diagnostic Steps**:

1. **Check if Feature is Enabled**
   ```javascript
   // Open browser console (F12) and run:
   console.log('Dark mode enabled:', maseData.settings.dark_light_toggle.enabled);
   ```

2. **Check JavaScript Console for Errors**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for MASE-related errors
   - Common errors:
     - "MASE is not defined" - JavaScript not loaded
     - "Cannot read property 'darkModeToggle'" - Module not initialized

3. **Verify Settings Structure**
   ```javascript
   // Check if dark mode settings exist
   console.log('Dark mode settings:', maseData.settings.dark_light_toggle);
   ```

**Solutions**:

1. **Enable Dark Mode in Settings**
   - Navigate to **Modern Admin Styler** → **Advanced** tab
   - Find **Dark Mode Settings** section
   - Check **Enable Dark Mode Toggle**
   - Click **Save Settings**

2. **Clear Cache and Reload**
   ```bash
   # Clear WordPress cache
   # Then hard refresh browser
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

3. **Check for JavaScript Conflicts**
   - Deactivate other plugins temporarily
   - Test dark mode
   - Reactivate plugins one by one to identify conflict

4. **Verify File Permissions**
   ```bash
   # Ensure JavaScript files are readable
   chmod 644 /wp-content/plugins/modern-admin-styler/assets/js/mase-admin.js
   ```

---

## FAB (Floating Action Button) Issues

### FAB Not Visible

**Symptoms**:
- FAB doesn't appear on admin pages
- FAB is hidden behind other elements
- FAB appears briefly then disappears

**Diagnostic Steps**:

1. **Check if FAB Exists in DOM**
   ```javascript
   // Open browser console and run:
   console.log('FAB exists:', document.querySelector('.mase-dark-mode-fab') !== null);
   ```

2. **Check FAB Visibility**
   ```javascript
   // Check computed styles
   var fab = document.querySelector('.mase-dark-mode-fab');
   if (fab) {
       var styles = window.getComputedStyle(fab);
       console.log('Display:', styles.display);
       console.log('Visibility:', styles.visibility);
       console.log('Opacity:', styles.opacity);
       console.log('Z-index:', styles.zIndex);
   }
   ```

**Solutions**:

1. **Check Z-Index Conflicts**
   - Use browser DevTools to inspect FAB
   - Check if another element has higher z-index
   - Add custom CSS to increase FAB z-index:
   ```css
   .mase-dark-mode-fab {
       z-index: 999999 !important;
   }
   ```

2. **Adjust FAB Position**
   - Navigate to **Modern Admin Styler** → **Advanced** tab
   - Find **FAB Position** settings
   - Adjust **Bottom** and **Right** values
   - Move FAB away from conflicting elements

3. **Check for CSS Conflicts**
   ```javascript
   // Find elements with high z-index
   var elements = document.querySelectorAll('*');
   var highZIndex = [];
   elements.forEach(function(el) {
       var z = window.getComputedStyle(el).zIndex;
       if (z && parseInt(z) > 100000) {
           highZIndex.push({element: el, zIndex: z});
       }
   });
   console.log('High z-index elements:', highZIndex);
   ```

4. **Force FAB Visibility**
   ```javascript
   // Temporary fix to make FAB visible
   var fab = document.querySelector('.mase-dark-mode-fab');
   if (fab) {
       fab.style.display = 'flex';
       fab.style.visibility = 'visible';
       fab.style.opacity = '1';
       fab.style.zIndex = '999999';
   }
   ```

### FAB Not Clickable

**Symptoms**:
- FAB is visible but doesn't respond to clicks
- Cursor doesn't change to pointer on hover
- No visual feedback when clicking

**Diagnostic Steps**:

1. **Check Pointer Events**
   ```javascript
   var fab = document.querySelector('.mase-dark-mode-fab');
   if (fab) {
       console.log('Pointer events:', window.getComputedStyle(fab).pointerEvents);
   }
   ```

2. **Check for Overlapping Elements**
   ```javascript
   // Check what element is at FAB position
   var fab = document.querySelector('.mase-dark-mode-fab');
   if (fab) {
       var rect = fab.getBoundingClientRect();
       var centerX = rect.left + rect.width / 2;
       var centerY = rect.top + rect.height / 2;
       var topElement = document.elementFromPoint(centerX, centerY);
       console.log('Element at FAB position:', topElement);
   }
   ```

**Solutions**:

1. **Enable Pointer Events**
   ```css
   .mase-dark-mode-fab {
       pointer-events: auto !important;
   }
   ```

2. **Remove Overlapping Elements**
   - Identify overlapping element from diagnostic
   - Adjust its z-index or position
   - Or increase FAB z-index

3. **Check Event Listeners**
   ```javascript
   // Verify click handler is attached
   var fab = document.querySelector('.mase-dark-mode-fab');
   if (fab) {
       console.log('Has click listener:', fab.onclick !== null || 
                   fab.addEventListener !== undefined);
   }
   ```

4. **Manually Attach Click Handler**
   ```javascript
   // If click handler is missing, attach manually
   jQuery('.mase-dark-mode-fab').off('click').on('click', function() {
       if (MASE && MASE.darkModeToggle) {
           MASE.darkModeToggle.toggle();
       }
   });
   ```

### FAB Icon Not Changing

**Symptoms**:
- FAB icon stays as sun or moon
- Icon doesn't rotate when toggling
- Icon changes but doesn't match current mode

**Diagnostic Steps**:

1. **Check Current Mode**
   ```javascript
   console.log('Current mode:', MASE.darkModeToggle.state.currentMode);
   console.log('Body has dark class:', document.body.classList.contains('mase-dark-mode'));
   ```

2. **Check Icon Elements**
   ```javascript
   var sunIcon = document.querySelector('.mase-dark-mode-fab .dashicons-sun');
   var moonIcon = document.querySelector('.mase-dark-mode-fab .dashicons-moon');
   console.log('Sun icon exists:', sunIcon !== null);
   console.log('Moon icon exists:', moonIcon !== null);
   ```

**Solutions**:

1. **Force Icon Update**
   ```javascript
   // Manually update icon based on current mode
   var mode = document.body.classList.contains('mase-dark-mode') ? 'dark' : 'light';
   var fab = document.querySelector('.mase-dark-mode-fab');
   if (fab) {
       fab.innerHTML = mode === 'dark' 
           ? '<span class="dashicons dashicons-sun"></span>'
           : '<span class="dashicons dashicons-moon"></span>';
   }
   ```

2. **Check CSS Transitions**
   ```css
   /* Ensure icon rotation animation works */
   .mase-dark-mode-fab .dashicons {
       transition: transform 0.3s ease-in-out;
   }
   
   .mase-dark-mode-fab.rotating .dashicons {
       transform: rotate(360deg);
   }
   ```

3. **Verify Dashicons Loaded**
   ```javascript
   // Check if Dashicons font is loaded
   var dashiconsLoaded = document.querySelector('link[href*="dashicons"]') !== null;
   console.log('Dashicons loaded:', dashiconsLoaded);
   ```

---

## Color and Palette Issues

### Colors Not Changing

**Symptoms**:
- FAB icon changes but colors stay the same
- Some colors change, others don't
- Transition is incomplete

**Diagnostic Steps**:

1. **Check Body Class**
   ```javascript
   console.log('Dark mode class:', document.body.classList.contains('mase-dark-mode'));
   ```

2. **Check Generated CSS**
   ```javascript
   var styleElement = document.getElementById('mase-custom-css');
   if (styleElement) {
       console.log('Dark mode CSS present:', 
                   styleElement.textContent.includes('mase-dark-mode'));
   }
   ```

3. **Check CSS Variables**
   ```javascript
   var styles = window.getComputedStyle(document.body);
   console.log('Primary color:', styles.getPropertyValue('--mase-bg-primary'));
   console.log('Text color:', styles.getPropertyValue('--mase-text-primary'));
   ```

**Solutions**:

1. **Clear CSS Cache**
   - Save settings to regenerate CSS
   - Clear WordPress transients:
   ```php
   delete_transient('mase_css_cache');
   delete_transient('mase_css_cache_dark');
   ```
   - Hard refresh browser (Ctrl+Shift+R)

2. **Verify Dark Palette Selected**
   - Navigate to **Modern Admin Styler** → **Advanced** tab
   - Check **Dark Palette** dropdown
   - Select a dark palette (Dark Elegance, Midnight Blue, or Charcoal)
   - Click **Save Settings**

3. **Check for CSS Conflicts**
   ```javascript
   // Find conflicting CSS rules
   var element = document.querySelector('#wpadminbar');
   var styles = window.getComputedStyle(element);
   console.log('Background color:', styles.backgroundColor);
   console.log('Color source:', styles.getPropertyValue('background-color'));
   ```

4. **Force Dark Mode Colors**
   ```css
   /* Add to Custom CSS as temporary fix */
   body.mase-dark-mode #wpadminbar {
       background-color: #1a1a1a !important;
       color: #e0e0e0 !important;
   }
   
   body.mase-dark-mode #adminmenu {
       background-color: #2d2d2d !important;
       color: #e0e0e0 !important;
   }
   ```

### Wrong Colors in Dark Mode

**Symptoms**:
- Dark mode uses light colors
- Colors are inverted incorrectly
- Contrast is too low

**Diagnostic Steps**:

1. **Check Palette Type**
   ```javascript
   var settings = maseData.settings;
   var darkPaletteId = settings.dark_light_toggle.dark_palette;
   console.log('Dark palette ID:', darkPaletteId);
   ```

2. **Check Palette Colors**
   ```javascript
   // View dark palette colors
   var palette = maseData.palettes[darkPaletteId];
   console.log('Dark palette colors:', palette);
   ```

**Solutions**:

1. **Select Correct Dark Palette**
   - Ensure you're using a palette designed for dark mode
   - Dark palettes have `type: 'dark'`
   - Available dark palettes:
     - Dark Elegance
     - Midnight Blue
     - Charcoal

2. **Create Custom Dark Palette**
   - Switch to dark mode
   - Customize colors in Admin Bar and Menu tabs
   - Use dark backgrounds (luminance < 0.3)
   - Use light text (luminance > 0.7)
   - Click **Save as Custom Palette**

3. **Check Contrast Ratios**
   ```javascript
   // Calculate contrast ratio
   function getContrast(color1, color2) {
       // Simplified contrast calculation
       // Use browser DevTools Accessibility panel for accurate results
   }
   ```

---

## Persistence Issues

### Preference Not Saving

**Symptoms**:
- Mode resets to light after page reload
- Preference doesn't sync across devices
- Mode changes but doesn't persist

**Diagnostic Steps**:

1. **Check localStorage**
   ```javascript
   console.log('localStorage mode:', localStorage.getItem('mase_dark_mode'));
   ```

2. **Check User Meta**
   ```php
   // In WordPress admin or via plugin
   $user_id = get_current_user_id();
   $preference = get_user_meta($user_id, 'mase_dark_mode_preference', true);
   error_log('User dark mode preference: ' . $preference);
   ```

3. **Check AJAX Response**
   - Open DevTools (F12)
   - Go to Network tab
   - Toggle dark mode
   - Find `admin-ajax.php` request
   - Check response status and data

**Solutions**:

1. **Enable localStorage**
   - Check browser settings allow localStorage
   - Not in private/incognito mode
   - Try different browser

2. **Check AJAX Save**
   ```javascript
   // Monitor AJAX requests
   jQuery(document).ajaxComplete(function(event, xhr, settings) {
       if (settings.data && settings.data.includes('mase_toggle_dark_mode')) {
           console.log('Dark mode AJAX response:', xhr.responseJSON);
       }
   });
   ```

3. **Manually Save Preference**
   ```javascript
   // Force save to localStorage
   localStorage.setItem('mase_dark_mode', 'dark'); // or 'light'
   
   // Force save to user meta via AJAX
   jQuery.post(ajaxurl, {
       action: 'mase_toggle_dark_mode',
       mode: 'dark',
       nonce: maseData.nonce
   }, function(response) {
       console.log('Save response:', response);
   });
   ```

4. **Check Server Permissions**
   ```php
   // Verify user can save settings
   if (!current_user_can('manage_options')) {
       error_log('User lacks manage_options capability');
   }
   ```

### Preference Syncing Issues

**Symptoms**:
- Different modes on different devices
- Mode doesn't sync after login
- localStorage and user meta out of sync

**Diagnostic Steps**:

1. **Check Sync Status**
   ```javascript
   console.log('Needs sync:', MASE.darkModeToggle.state.needsSync);
   ```

2. **Compare Storage Values**
   ```javascript
   var localMode = localStorage.getItem('mase_dark_mode');
   var userMetaMode = maseData.userMeta.dark_mode_preference;
   console.log('localStorage:', localMode);
   console.log('User meta:', userMetaMode);
   console.log('Match:', localMode === userMetaMode);
   ```

**Solutions**:

1. **Force Sync**
   ```javascript
   // Sync localStorage to user meta
   var mode = localStorage.getItem('mase_dark_mode');
   if (mode && MASE.darkModeToggle) {
       MASE.darkModeToggle.savePreference(mode);
   }
   ```

2. **Clear and Resync**
   ```javascript
   // Clear localStorage and reload from user meta
   localStorage.removeItem('mase_dark_mode');
   location.reload();
   ```

3. **Manual Sync Across Devices**
   - Set preference on Device A
   - Wait 5 seconds for AJAX to complete
   - Log in on Device B
   - Preference should load from user meta

---

## System Preference Issues

### System Preference Not Detected

**Symptoms**:
- MASE doesn't match OS dark mode
- System preference changes don't update MASE
- Always starts in light mode

**Diagnostic Steps**:

1. **Check Browser Support**
   ```javascript
   console.log('matchMedia supported:', typeof window.matchMedia === 'function');
   console.log('prefers-color-scheme supported:', 
               window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all');
   ```

2. **Check OS Preference**
   ```javascript
   var darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
   console.log('OS prefers dark:', darkModeQuery.matches);
   ```

3. **Check MASE Setting**
   ```javascript
   console.log('Respect system preference:', 
               maseData.settings.dark_light_toggle.respect_system_preference);
   ```

**Solutions**:

1. **Enable Respect System Preference**
   - Navigate to **Modern Admin Styler** → **Advanced** tab
   - Check **Respect System Preference**
   - Click **Save Settings**

2. **Clear Manual Preference**
   ```javascript
   // Remove manual preference to allow system detection
   localStorage.removeItem('mase_dark_mode');
   location.reload();
   ```

3. **Update Browser**
   - System preference detection requires:
     - Chrome 76+
     - Firefox 67+
     - Safari 12.1+
     - Edge 79+
   - Update browser if needed

4. **Check OS Setting**
   - **Windows 10/11**: Settings → Personalization → Colors → Choose your color
   - **macOS**: System Preferences → General → Appearance
   - **Linux (GNOME)**: Settings → Appearance → Style

### System Preference Monitoring Not Working

**Symptoms**:
- Initial detection works but changes don't update
- Have to refresh page to see OS changes
- Monitoring stops after some time

**Diagnostic Steps**:

1. **Check Event Listener**
   ```javascript
   var darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
   console.log('Has change listener:', darkModeQuery.onchange !== null);
   ```

2. **Test Manual Change**
   ```javascript
   // Simulate OS change
   var darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
   darkModeQuery.dispatchEvent(new Event('change'));
   ```

**Solutions**:

1. **Reinitialize Monitoring**
   ```javascript
   if (MASE && MASE.darkModeToggle) {
       MASE.darkModeToggle.watchSystemPreference();
   }
   ```

2. **Check for Manual Override**
   ```javascript
   // Manual preference overrides system monitoring
   var hasManualPreference = localStorage.getItem('mase_dark_mode') !== null;
   console.log('Has manual preference:', hasManualPreference);
   
   // Clear to re-enable system monitoring
   if (hasManualPreference) {
       localStorage.removeItem('mase_dark_mode');
       location.reload();
   }
   ```

---

## Performance Issues

### Slow Transitions

**Symptoms**:
- Color transitions are laggy
- Browser freezes during toggle
- Animations are choppy

**Diagnostic Steps**:

1. **Check Transition Duration**
   ```javascript
   console.log('Transition duration:', 
               maseData.settings.dark_light_toggle.transition_duration);
   ```

2. **Profile Performance**
   ```javascript
   console.time('Dark Mode Toggle');
   MASE.darkModeToggle.toggle();
   console.timeEnd('Dark Mode Toggle');
   ```

**Solutions**:

1. **Reduce Transition Duration**
   - Navigate to **Modern Admin Styler** → **Advanced** tab
   - Reduce **Transition Duration** to 100-200ms
   - Click **Save Settings**

2. **Enable Performance Mode**
   - Navigate to **Effects** tab
   - Enable **Performance Mode**
   - This disables expensive visual effects

3. **Enable Reduced Motion**
   - Enable `prefers-reduced-motion` in OS settings
   - MASE automatically disables transitions
   - Transitions become instant (0s duration)

4. **Disable Expensive Effects**
   ```css
   /* Add to Custom CSS */
   * {
       transition: none !important;
       animation: none !important;
   }
   ```

### High Memory Usage

**Symptoms**:
- Browser uses excessive RAM
- System becomes slow
- Browser crashes

**Diagnostic Steps**:

1. **Check Memory Usage**
   - Open DevTools (F12)
   - Go to Performance tab
   - Take heap snapshot
   - Look for memory leaks

2. **Check Event Listeners**
   ```javascript
   // Count event listeners
   var listeners = getEventListeners(document);
   console.log('Total listeners:', Object.keys(listeners).length);
   ```

**Solutions**:

1. **Clear Event Listeners**
   ```javascript
   // Remove duplicate listeners
   jQuery(document).off('mase:modeChanged');
   jQuery(document).off('mase:transitionComplete');
   ```

2. **Reload Page**
   - Simple page reload often fixes memory issues
   - Close other tabs to free memory

3. **Update Browser**
   - Use latest browser version
   - Update graphics drivers
   - Enable hardware acceleration

---

## Accessibility Issues

### Screen Reader Not Announcing Changes

**Symptoms**:
- Mode changes silently
- No announcement when toggling
- ARIA attributes not updating

**Diagnostic Steps**:

1. **Check ARIA Attributes**
   ```javascript
   var fab = document.querySelector('.mase-dark-mode-fab');
   if (fab) {
       console.log('aria-label:', fab.getAttribute('aria-label'));
       console.log('aria-pressed:', fab.getAttribute('aria-pressed'));
       console.log('role:', fab.getAttribute('role'));
   }
   ```

2. **Check Live Region**
   ```javascript
   var liveRegion = document.querySelector('[role="status"][aria-live="polite"]');
   console.log('Live region exists:', liveRegion !== null);
   ```

**Solutions**:

1. **Verify ARIA Attributes**
   ```javascript
   // Manually set ARIA attributes
   var fab = document.querySelector('.mase-dark-mode-fab');
   if (fab) {
       fab.setAttribute('role', 'switch');
       fab.setAttribute('aria-label', 'Toggle dark mode');
       var isDark = document.body.classList.contains('mase-dark-mode');
       fab.setAttribute('aria-pressed', isDark ? 'true' : 'false');
   }
   ```

2. **Create Live Region**
   ```javascript
   // Add live region for announcements
   var liveRegion = document.createElement('div');
   liveRegion.setAttribute('role', 'status');
   liveRegion.setAttribute('aria-live', 'polite');
   liveRegion.className = 'sr-only';
   document.body.appendChild(liveRegion);
   
   // Announce mode change
   jQuery(document).on('mase:modeChanged', function(event, data) {
       liveRegion.textContent = data.mode === 'dark' 
           ? 'Dark mode activated' 
           : 'Light mode activated';
   });
   ```

### Keyboard Navigation Issues

**Symptoms**:
- Can't tab to FAB
- Enter/Space doesn't activate FAB
- Focus indicator not visible

**Diagnostic Steps**:

1. **Check Tab Index**
   ```javascript
   var fab = document.querySelector('.mase-dark-mode-fab');
   console.log('tabindex:', fab.getAttribute('tabindex'));
   ```

2. **Check Focus Styles**
   ```javascript
   var fab = document.querySelector('.mase-dark-mode-fab');
   fab.focus();
   var styles = window.getComputedStyle(fab, ':focus');
   console.log('Focus outline:', styles.outline);
   ```

**Solutions**:

1. **Set Tab Index**
   ```javascript
   var fab = document.querySelector('.mase-dark-mode-fab');
   fab.setAttribute('tabindex', '0');
   ```

2. **Add Focus Styles**
   ```css
   .mase-dark-mode-fab:focus {
       outline: 2px solid #4a9eff !important;
       outline-offset: 2px !important;
   }
   ```

3. **Add Keyboard Handler**
   ```javascript
   jQuery('.mase-dark-mode-fab').on('keydown', function(e) {
       if (e.key === 'Enter' || e.key === ' ') {
           e.preventDefault();
           MASE.darkModeToggle.toggle();
       }
   });
   ```

---

## Browser Compatibility

### Issues in Firefox

**Symptoms**:
- Some effects missing
- Layout issues
- Performance problems

**Solutions**:

1. **Update Firefox**
   - Requires Firefox 67+ for system preference detection
   - Update to latest version

2. **Check Console for Warnings**
   - Look for CSS warnings
   - Check for unsupported features

3. **Use Fallback Styles**
   - MASE provides automatic fallbacks
   - Accept that some effects may not work

### Issues in Safari

**Symptoms**:
- Colors appear different
- Animations choppy
- Layout shifts

**Solutions**:

1. **Update Safari**
   - Requires Safari 12.1+ for system preference detection
   - Update macOS/iOS

2. **Check Vendor Prefixes**
   - Safari may require -webkit- prefix
   - MASE includes prefixes automatically

3. **Disable Experimental Features**
   - Some Safari experimental features may conflict
   - Disable in Develop menu

---

## Advanced Troubleshooting

### Debug Mode

Enable debug logging for detailed information:

```javascript
// Enable debug mode
MASE.darkModeToggle.debug = true;

// Log all events
jQuery(document).on('mase:modeChanged', function(event, data) {
    console.log('Mode changed:', data);
    console.log('State:', MASE.darkModeToggle.state);
});

jQuery(document).on('mase:transitionComplete', function(event, data) {
    console.log('Transition complete:', data);
});
```

### Reset Dark Mode

Complete reset of dark mode feature:

```javascript
// Clear all dark mode data
localStorage.removeItem('mase_dark_mode');
document.body.classList.remove('mase-dark-mode');
document.querySelector('html').removeAttr('data-theme');

// Reset to light mode
if (MASE && MASE.darkModeToggle) {
    MASE.darkModeToggle.setMode('light');
}

// Reload page
location.reload();
```

### Export Debug Information

Collect debug information for support:

```javascript
// Collect debug info
var debugInfo = {
    mode: MASE.darkModeToggle.state.currentMode,
    systemPreference: MASE.darkModeToggle.state.systemPreference,
    isTransitioning: MASE.darkModeToggle.state.isTransitioning,
    needsSync: MASE.darkModeToggle.state.needsSync,
    localStorage: localStorage.getItem('mase_dark_mode'),
    bodyClass: document.body.classList.contains('mase-dark-mode'),
    fabExists: document.querySelector('.mase-dark-mode-fab') !== null,
    settings: maseData.settings.dark_light_toggle,
    browser: navigator.userAgent
};

console.log('Debug Info:', JSON.stringify(debugInfo, null, 2));

// Copy to clipboard
copy(JSON.stringify(debugInfo, null, 2));
```

---

## Getting Help

If you've tried these solutions and still have issues:

1. **Gather Information**
   - WordPress version
   - PHP version
   - Browser and version
   - Active plugins list
   - Error messages
   - Debug information (see above)

2. **Check Documentation**
   - [Dark Mode User Guide](./DARK-MODE-USER-GUIDE.md)
   - [Dark Mode Developer Guide](./DARK-MODE-DEVELOPER-GUIDE.md)
   - [Main Troubleshooting Guide](./TROUBLESHOOTING.md)

3. **Search Issues**
   - Check GitHub issues for similar problems
   - Search WordPress support forums

4. **Contact Support**
   - Submit detailed issue report
   - Include debug information
   - Attach screenshots if helpful

---

## Preventive Measures

### Before Making Changes

1. **Export Settings**
   - Create backup before customizing
   - Store backup file safely

2. **Test in Staging**
   - Test changes in staging environment
   - Verify everything works
   - Then apply to production

3. **Document Customizations**
   - Keep notes of custom CSS/JS
   - Track palette choices
   - Document any workarounds

### Regular Maintenance

1. **Clear Cache Regularly**
   - Clear WordPress cache weekly
   - Clear browser cache monthly

2. **Update Regularly**
   - Keep MASE updated
   - Update WordPress and PHP
   - Update browser

3. **Monitor Performance**
   - Check browser console for errors
   - Monitor page load times
   - Watch for memory leaks

---

## Additional Resources

- [Dark Mode User Guide](./DARK-MODE-USER-GUIDE.md)
- [Dark Mode Developer Guide](./DARK-MODE-DEVELOPER-GUIDE.md)
- [MASE User Guide](./USER-GUIDE.md)
- [Main Troubleshooting Guide](./TROUBLESHOOTING.md)
- [GitHub Issues](https://github.com/your-org/modern-admin-styler/issues)
