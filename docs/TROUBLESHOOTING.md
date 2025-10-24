# Modern Admin Styler Enterprise (MASE) v1.2.0 - Troubleshooting Guide

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Settings Not Saving](#settings-not-saving)
3. [Visual Issues](#visual-issues)
4. [Performance Problems](#performance-problems)
5. [Import/Export Issues](#importexport-issues)
6. [Browser Compatibility](#browser-compatibility)
7. [Conflict Resolution](#conflict-resolution)
8. [Migration Issues](#migration-issues)
9. [JavaScript Errors](#javascript-errors)
10. [Cache Issues](#cache-issues)

---

## Installation Issues

### Plugin Won't Activate

**Symptoms:**
- Error message when activating
- White screen after activation
- Plugin immediately deactivates

**Solutions:**

1. **Check PHP Version**
   ```bash
   php -v
   ```
   - Requires PHP 7.4 or higher
   - Update PHP if necessary

2. **Check WordPress Version**
   - Requires WordPress 5.8 or higher
   - Update WordPress if necessary

3. **Check for PHP Errors**
   - Enable WP_DEBUG in wp-config.php:
   ```php
   define( 'WP_DEBUG', true );
   define( 'WP_DEBUG_LOG', true );
   ```
   - Check `/wp-content/debug.log` for errors

4. **Memory Limit**
   - Increase PHP memory limit in wp-config.php:
   ```php
   define( 'WP_MEMORY_LIMIT', '256M' );
   ```

5. **File Permissions**
   - Ensure plugin files are readable:
   ```bash
   chmod -R 755 /wp-content/plugins/modern-admin-styler
   ```

### Missing Menu Item

**Symptoms:**
- "Modern Admin Styler" doesn't appear in admin menu

**Solutions:**

1. **Check User Capabilities**
   - Only users with `manage_options` capability can see the menu
   - Typically Administrator role

2. **Clear Cache**
   - Clear WordPress object cache
   - Clear browser cache
   - Refresh the page

3. **Check for Conflicts**
   - Deactivate other plugins temporarily
   - Reactivate MASE
   - Check if menu appears

---

## Settings Not Saving

### Changes Don't Persist

**Symptoms:**
- Settings revert after saving
- "Settings saved" message appears but changes don't apply
- Page refreshes but settings are unchanged

**Solutions:**

1. **Check JavaScript Console**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Look for AJAX errors

2. **Verify Nonce**
   - Nonce expires after 24 hours
   - Refresh the page to get new nonce
   - Try saving again

3. **Check User Permissions**
   - Ensure you have `manage_options` capability
   - Log out and log back in
   - Try with Administrator account

4. **Database Issues**
   - Check if database is writable
   - Verify database connection
   - Check database error log

5. **Server Timeout**
   - Increase PHP max_execution_time:
   ```php
   ini_set( 'max_execution_time', 300 );
   ```

6. **Clear Cache**
   - Clear WordPress cache
   - Clear browser cache
   - Try saving again

### AJAX Request Fails

**Symptoms:**
- "Network error" message
- Settings don't save
- Console shows AJAX error

**Solutions:**

1. **Check AJAX URL**
   - Verify `admin-ajax.php` is accessible
   - Test URL directly: `/wp-admin/admin-ajax.php`

2. **Check Server Logs**
   - Look for PHP errors in error_log
   - Check Apache/Nginx error logs

3. **Disable Security Plugins**
   - Temporarily disable security plugins
   - Try saving again
   - Re-enable and configure exceptions

4. **Check Firewall**
   - Verify firewall isn't blocking AJAX requests
   - Add exception for admin-ajax.php

5. **Increase Timeouts**
   - Increase PHP timeout
   - Increase server timeout
   - Increase AJAX timeout in JavaScript

---

## Visual Issues

### Colors Not Applying

**Symptoms:**
- Selected colors don't show in admin interface
- Palette applies but colors are wrong
- Some colors work, others don't

**Solutions:**

1. **Clear CSS Cache**
   - Save settings again to regenerate CSS
   - Hard refresh browser (Ctrl+Shift+R)
   - Clear WordPress transients

2. **Check CSS Specificity**
   - Another plugin may be overriding styles
   - Use browser DevTools to inspect elements
   - Check which CSS rules are applied

3. **Disable Other Styling Plugins**
   - Deactivate other admin styling plugins
   - Test MASE alone
   - Identify conflicts

4. **Check Generated CSS**
   - View page source
   - Look for `<style id="mase-custom-css">`
   - Verify CSS is present and correct

5. **Browser Extensions**
   - Disable browser extensions (especially ad blockers)
   - Test in incognito/private mode
   - Re-enable extensions one by one

### Glassmorphism Not Working

**Symptoms:**
- No blur effect on admin bar/menu
- Elements are transparent but not blurred
- Works in some browsers but not others

**Solutions:**

1. **Check Browser Support**
   - Glassmorphism requires backdrop-filter support
   - Works in: Chrome 76+, Safari 14+, Edge 79+
   - Doesn't work in: Firefox <103

2. **Enable Browser Feature**
   - Firefox: Enable `layout.css.backdrop-filter.enabled` in about:config
   - Check browser version and update if needed

3. **Fallback Styling**
   - MASE provides automatic fallback
   - Elements will be semi-transparent without blur
   - This is expected behavior in unsupported browsers

4. **GPU Acceleration**
   - Ensure GPU acceleration is enabled in browser
   - Chrome: chrome://settings → Advanced → System
   - Check graphics drivers are up to date

### Floating Effect Not Visible

**Symptoms:**
- Admin bar doesn't appear floating
- No margin at top
- Border radius not visible

**Solutions:**

1. **Check Settings**
   - Verify "Floating Effect" is enabled
   - Check "Floating Margin" value (should be >0)
   - Ensure "Border Radius" is set (recommended 8-12px)

2. **Check for Conflicts**
   - Another plugin may be overriding margin
   - Use DevTools to inspect admin bar
   - Look for conflicting CSS rules

3. **Increase Margin**
   - Try increasing floating margin to 15-20px
   - Add shadow for better visibility
   - Combine with border radius

### Shadows Not Showing

**Symptoms:**
- Shadow preset selected but no shadow visible
- Shadows work in some areas but not others

**Solutions:**

1. **Check Shadow Settings**
   - Verify shadow preset is not "None"
   - Check shadow intensity
   - Ensure shadows aren't disabled on mobile

2. **Check Background**
   - Shadows may not be visible on dark backgrounds
   - Try lighter background color
   - Increase shadow intensity

3. **Browser Rendering**
   - Some browsers render shadows differently
   - Try different shadow preset
   - Check in multiple browsers

4. **Performance Mode**
   - Shadows are disabled in Performance Mode
   - Disable Performance Mode to see shadows

---

## Performance Problems

### Slow Admin Interface

**Symptoms:**
- Admin pages load slowly
- Lag when interacting with controls
- Browser feels sluggish

**Solutions:**

1. **Enable Performance Mode**
   - Navigate to Effects tab
   - Enable "Performance Mode"
   - Or use keyboard shortcut: Ctrl+Shift+P

2. **Reduce Visual Effects**
   - Disable glassmorphism
   - Reduce blur intensity
   - Use simpler shadow presets
   - Disable animations

3. **Check Browser Performance**
   - Close unnecessary tabs
   - Disable browser extensions
   - Clear browser cache
   - Restart browser

4. **Server Performance**
   - Check server resources (CPU, RAM)
   - Optimize WordPress database
   - Enable WordPress caching
   - Use a caching plugin

5. **Reduce Settings Complexity**
   - Use a simpler template
   - Reduce number of custom CSS rules
   - Disable particle effects and 3D effects

### Live Preview Lag

**Symptoms:**
- Delay when adjusting controls in Live Preview
- Browser freezes during preview
- Preview updates slowly

**Solutions:**

1. **Disable Live Preview**
   - Turn off Live Preview
   - Make changes
   - Save and refresh to see results

2. **Increase Debounce Delay**
   - Edit mase-admin.js
   - Increase debounceDelay from 300ms to 500ms or 1000ms

3. **Reduce Complexity**
   - Disable expensive effects temporarily
   - Simplify settings
   - Use Performance Mode

4. **Browser Performance**
   - Close other tabs
   - Disable extensions
   - Use a faster browser (Chrome recommended)

### High Memory Usage

**Symptoms:**
- Browser uses excessive RAM
- System becomes slow
- Browser crashes

**Solutions:**

1. **Disable Particle Effects**
   - Navigate to Effects tab
   - Disable "Particle System"
   - Disable "3D Effects"

2. **Reduce Animations**
   - Disable page animations
   - Disable microanimations
   - Enable Reduced Motion

3. **Clear Cache**
   - Clear browser cache
   - Clear WordPress cache
   - Restart browser

4. **Update Browser**
   - Use latest browser version
   - Update graphics drivers
   - Enable hardware acceleration

---

## Import/Export Issues

### Import Fails

**Symptoms:**
- "Invalid file" error
- Import button doesn't work
- Settings don't apply after import

**Solutions:**

1. **Check File Format**
   - File must be valid JSON
   - File extension must be .json
   - Open file in text editor to verify format

2. **Validate JSON**
   - Use online JSON validator
   - Check for syntax errors
   - Ensure proper encoding (UTF-8)

3. **Check File Size**
   - Large files may timeout
   - Increase PHP upload_max_filesize
   - Increase PHP post_max_size

4. **Re-export Settings**
   - Export settings again from source site
   - Ensure export completed successfully
   - Try importing fresh export

5. **Manual Import**
   - Copy settings from JSON file
   - Paste into browser console:
   ```javascript
   var settings = { /* paste settings here */ };
   MASE.importExport.import(settings);
   ```

### Export Doesn't Download

**Symptoms:**
- Export button doesn't work
- No file downloads
- Browser shows error

**Solutions:**

1. **Check Browser Permissions**
   - Allow downloads from your site
   - Check browser download settings
   - Try different browser

2. **Check JavaScript Console**
   - Look for JavaScript errors
   - Verify MASE object exists
   - Check export function

3. **Manual Export**
   - Open browser console
   - Run: `console.log(JSON.stringify(MASE.state.settings))`
   - Copy output and save as .json file

4. **Server Issues**
   - Check server error logs
   - Verify AJAX endpoint is accessible
   - Check for server-side errors

---

## Browser Compatibility

### Issues in Firefox

**Symptoms:**
- Glassmorphism doesn't work
- Some effects missing
- Layout issues

**Solutions:**

1. **Update Firefox**
   - Glassmorphism requires Firefox 103+
   - Update to latest version
   - Or accept fallback styling

2. **Enable Backdrop Filter**
   - Type `about:config` in address bar
   - Search for `layout.css.backdrop-filter.enabled`
   - Set to `true`

3. **Check Console**
   - Look for CSS warnings
   - Check for unsupported features
   - Use fallback styles

### Issues in Safari

**Symptoms:**
- Colors appear different
- Animations choppy
- Layout shifts

**Solutions:**

1. **Update Safari**
   - Requires Safari 14+
   - Update macOS/iOS
   - Test in latest version

2. **Check Vendor Prefixes**
   - Safari may require -webkit- prefix
   - MASE includes prefixes automatically
   - Check generated CSS

3. **Disable Experimental Features**
   - Some Safari experimental features may conflict
   - Disable in Develop menu
   - Test again

### Issues in Edge

**Symptoms:**
- Similar to Chrome issues
- Some features not working

**Solutions:**

1. **Update Edge**
   - Requires Edge 90+
   - Update to latest version
   - Edge uses Chromium engine

2. **Clear Edge Cache**
   - Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Restart Edge

---

## Conflict Resolution

### Conflict with Other Plugins

**Symptoms:**
- MASE features stop working after activating another plugin
- JavaScript errors in console
- CSS conflicts

**Solutions:**

1. **Identify Conflicting Plugin**
   - Deactivate all other plugins
   - Activate MASE
   - Reactivate plugins one by one
   - Note which plugin causes conflict

2. **Check for Admin Styling Plugins**
   - Deactivate other admin styling plugins
   - Only use one admin styling plugin at a time
   - Or configure plugins to work together

3. **CSS Specificity**
   - MASE uses `body.wp-admin` prefix
   - Other plugins may override with higher specificity
   - Add custom CSS with `!important` if needed

4. **JavaScript Conflicts**
   - Check console for errors
   - Look for jQuery conflicts
   - Ensure jQuery is loaded

5. **Load Order**
   - MASE loads on `admin_enqueue_scripts` priority 10
   - Adjust priority if needed:
   ```php
   add_action( 'admin_enqueue_scripts', 'mase_enqueue', 20 );
   ```

### Conflict with Theme

**Symptoms:**
- Admin styles affected by theme
- Theme CSS loading in admin
- Layout issues

**Solutions:**

1. **Check Theme Admin Styles**
   - Some themes add admin styles
   - Deactivate theme temporarily
   - Test with default WordPress theme

2. **Increase CSS Specificity**
   - Add custom CSS with higher specificity
   - Use `!important` if necessary
   - Report issue to theme developer

3. **Disable Theme Admin Styles**
   - Add to theme's functions.php:
   ```php
   add_action( 'admin_enqueue_scripts', function() {
       wp_dequeue_style( 'theme-admin-style' );
   }, 100 );
   ```

---

## Migration Issues

### Migration Didn't Run

**Symptoms:**
- Upgraded to v1.2.0 but still see v1.1.0 settings
- New features not available
- Version shows 1.1.0

**Solutions:**

1. **Manually Trigger Migration**
   - Deactivate plugin
   - Reactivate plugin
   - Migration runs on activation

2. **Check Version Option**
   - Check database for `mase_version` option
   - Should be '1.2.0' after migration
   - Update manually if needed:
   ```php
   update_option( 'mase_version', '1.2.0' );
   ```

3. **Check Migration Log**
   - Enable WP_DEBUG
   - Check debug.log for migration messages
   - Look for errors

4. **Manual Migration**
   - Export v1.1.0 settings
   - Install fresh v1.2.0
   - Import settings

### Settings Lost After Migration

**Symptoms:**
- Settings reset to defaults after upgrade
- Customizations disappeared
- Backup not found

**Solutions:**

1. **Check Backup**
   - Look for `mase_settings_backup_110` option in database
   - Restore from backup:
   ```php
   $backup = get_option( 'mase_settings_backup_110' );
   update_option( 'mase_settings', $backup );
   ```

2. **Check Database**
   - Verify `mase_settings` option exists
   - Check if data is corrupted
   - Restore from database backup

3. **Restore from Export**
   - If you exported settings before upgrade
   - Import the exported file
   - Settings will be restored

---

## JavaScript Errors

### Console Shows Errors

**Symptoms:**
- JavaScript errors in browser console
- Features not working
- AJAX requests failing

**Solutions:**

1. **Common Errors and Fixes**

   **"MASE is not defined"**
   - mase-admin.js not loaded
   - Check if file exists
   - Check file permissions
   - Clear cache and reload

   **"$ is not defined"**
   - jQuery not loaded
   - MASE requires jQuery
   - Check jQuery is enqueued
   - Check for jQuery conflicts

   **"Uncaught TypeError: Cannot read property"**
   - Object doesn't exist
   - Check if element exists in DOM
   - Add null checks
   - Verify HTML structure

   **"AJAX error"**
   - Check network tab in DevTools
   - Verify AJAX URL is correct
   - Check server response
   - Look for PHP errors

2. **Debug JavaScript**
   - Open DevTools (F12)
   - Go to Sources tab
   - Set breakpoints
   - Step through code
   - Check variable values

3. **Check File Loading**
   - View page source
   - Verify mase-admin.js is included
   - Check file path is correct
   - Verify file is not 404

---

## Cache Issues

### Changes Not Visible

**Symptoms:**
- Saved settings don't apply
- Old CSS still loading
- Changes appear after long delay

**Solutions:**

1. **Clear WordPress Cache**
   ```php
   // Add to wp-config.php temporarily
   define( 'WP_CACHE', false );
   ```

2. **Clear Transients**
   - Delete `mase_css_cache` transient
   - In database or via plugin:
   ```php
   delete_transient( 'mase_css_cache' );
   ```

3. **Clear Browser Cache**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E
   - Or use incognito/private mode

4. **Hard Refresh**
   - Windows: Ctrl+Shift+R or Ctrl+F5
   - Mac: Cmd+Shift+R
   - Forces browser to reload all assets

5. **Clear Server Cache**
   - If using server-level caching (Varnish, Redis)
   - Clear server cache
   - Restart caching service

6. **Disable Caching Temporarily**
   - Deactivate caching plugins
   - Test MASE
   - Reactivate and configure exceptions

---

## Admin Menu Enhancement Issues

### Height Mode Not Persisting

**Symptoms:**
- Height Mode setting reverts to "Full Height" after save
- Selected "Fit to Content" but menu shows full height after page refresh
- Setting appears correct in UI but doesn't apply

**Root Cause:**
This was a known issue in earlier versions where the `height_mode` setting wasn't properly saved to the database. The setting was being lost during the save process.

**Solutions:**

1. **Verify Current Version**
   - Ensure you're running the latest version of MASE
   - The Height Mode persistence issue was fixed in v1.2.0+
   - Update plugin if necessary

2. **Check Settings Save**
   ```php
   // Verify height_mode is in saved settings
   $settings = get_option('mase_settings');
   error_log('Height Mode: ' . ($settings['admin_menu']['height_mode'] ?? 'not set'));
   ```

3. **Manual Fix (if needed)**
   - Open browser console
   - Run:
   ```javascript
   // Force save height mode
   var settings = MASE.state.settings;
   settings.admin_menu.height_mode = 'content'; // or 'full'
   MASE.saveSettings(settings);
   ```

4. **Clear Cache**
   - Clear WordPress transients
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R)
   - Save settings again

5. **Check for Conflicts**
   - Deactivate other admin styling plugins
   - Test Height Mode alone
   - Reactivate plugins one by one

**Verification:**
1. Set Height Mode to "Fit to Content"
2. Click "Save Settings"
3. Refresh the page (F5)
4. Check if menu height is auto (not 100%)
5. Inspect element: should show `height: auto; min-height: 100vh`

**Technical Details:**
- Location: `includes/class-mase-settings.php` line ~142
- The fix ensures `height_mode` is properly validated and saved
- Valid values: 'full' or 'content'
- Default: 'full'

### Submenu Positioning Incorrect

**Symptoms:**
- Submenus don't align with menu edge
- Gap between menu and submenu
- Submenu overlaps with menu
- Submenu position doesn't update when menu width changes

**Root Cause:**
Submenu positioning is calculated dynamically based on menu width. If the calculation is incorrect or not updating, submenus won't align properly.

**Solutions:**

1. **Check Menu Width Setting**
   - Verify menu width is set correctly
   - Default is 160px
   - Range: 160-400px
   - Check in Settings → Menu → Width

2. **Verify Submenu Spacing**
   - Check submenu spacing setting
   - Default is 0px
   - Range: 0-50px
   - Located in Settings → Menu → Submenu Spacing

3. **Check CSS Generation**
   ```php
   // Verify submenu CSS is generated correctly
   $settings = get_option('mase_settings');
   $width = $settings['admin_menu']['width'] ?? 160;
   $spacing = $settings['admin_menu_submenu']['spacing'] ?? 0;
   
   // Expected CSS:
   // #adminmenu .wp-submenu {
   //     left: {$width}px !important;
   //     top: {$spacing}px !important;
   // }
   ```

4. **Inspect Generated CSS**
   - View page source
   - Find `<style id="mase-custom-css">`
   - Look for `#adminmenu .wp-submenu` rules
   - Verify `left` value matches menu width

5. **Clear CSS Cache**
   - Save settings to regenerate CSS
   - Clear WordPress transients:
   ```php
   delete_transient('mase_css_cache');
   ```
   - Hard refresh browser

6. **Check for CSS Conflicts**
   - Use browser DevTools
   - Inspect submenu element
   - Check which CSS rules are applied
   - Look for conflicting `left` or `position` rules

7. **Test Live Preview**
   - Enable Live Preview
   - Change menu width
   - Submenu should reposition immediately
   - If not, check JavaScript console for errors

**Manual Fix:**
```javascript
// Force submenu repositioning
jQuery(document).ready(function($) {
    var width = $('#admin-menu-width').val() || 160;
    var spacing = $('#admin-menu-submenu-spacing').val() || 0;
    $('#adminmenu .wp-submenu').css({
        'left': width + 'px',
        'top': spacing + 'px'
    });
});
```

**Verification:**
1. Set menu width to 200px
2. Save settings
3. Inspect submenu: should show `left: 200px`
4. Change width to 250px
5. Save settings
6. Inspect submenu: should show `left: 250px`

**Technical Details:**
- Location: `includes/class-mase-css-generator.php` method `generate_submenu_positioning_css()`
- Formula: `left = menu_width + spacing_offset`
- Live preview: `assets/js/mase-admin.js` method `updateWidth()`

### Google Fonts Not Loading

**Symptoms:**
- Selected Google Font doesn't appear
- Menu text shows system font instead
- Font loads initially but disappears after refresh
- Console shows font loading errors

**Root Cause:**
Google Fonts are loaded dynamically from Google's CDN. Loading can fail due to network issues, browser blocking, or incorrect font names.

**Solutions:**

1. **Check Internet Connection**
   - Verify internet connectivity
   - Test Google Fonts CDN: https://fonts.googleapis.com/
   - Check if site can access external resources

2. **Verify Font Name**
   - Font names are case-sensitive
   - Check spelling in dropdown
   - Valid format: "Inter", "Roboto", "Open Sans"
   - Invalid: "inter", "ROBOTO", "OpenSans"

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for font loading errors
   - Common errors:
     - `Failed to load resource: net::ERR_BLOCKED_BY_CLIENT` (ad blocker)
     - `Failed to load resource: net::ERR_NAME_NOT_RESOLVED` (DNS issue)
     - `Failed to load resource: 404` (font not found)

4. **Check Browser Extensions**
   - Disable ad blockers temporarily
   - Disable privacy extensions
   - Test in incognito/private mode
   - Re-enable extensions one by one

5. **Check Content Security Policy**
   - Some servers block external fonts
   - Add to .htaccess or server config:
   ```apache
   Header set Content-Security-Policy "font-src 'self' https://fonts.gstatic.com;"
   ```

6. **Clear Font Cache**
   - Navigate to Advanced tab
   - Click "Clear Font Cache"
   - Or manually:
   ```javascript
   localStorage.removeItem('mase_google_fonts_cache');
   ```

7. **Check Generated CSS**
   - View page source
   - Look for `@import url('https://fonts.googleapis.com/...')`
   - Verify font URL is correct
   - Test URL directly in browser

8. **Fallback to System Fonts**
   - If Google Fonts consistently fail
   - Select "System Default" from dropdown
   - Or use system font stack:
   ```css
   font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
   ```

**Manual Font Loading:**
```javascript
// Manually load Google Font
(function() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    
    link.onerror = function() {
        console.error('Failed to load Google Font');
    };
    
    link.onload = function() {
        document.querySelector('#adminmenu').style.fontFamily = '"Inter", sans-serif';
    };
    
    document.head.appendChild(link);
})();
```

**Verification:**
1. Select "Inter" from Font Family dropdown
2. Check browser console for loading messages
3. Inspect menu element
4. Verify `font-family` includes "Inter"
5. Check Network tab for font file requests

**Technical Details:**
- Location: `assets/js/mase-admin.js` method `loadGoogleFont()`
- Fonts load asynchronously to avoid blocking
- Fallback to system fonts on error
- Cache duration: 7 days in localStorage

### Logo Not Displaying

**Symptoms:**
- Uploaded logo doesn't appear in menu
- Logo upload button doesn't work
- Logo shows briefly then disappears
- "Upload failed" error message

**Root Cause:**
Logo upload can fail due to file validation, server configuration, or permission issues.

**Solutions:**

1. **Check File Format**
   - Supported formats: PNG, JPG, SVG
   - File extension must match content type
   - Verify file isn't corrupted
   - Try different file format

2. **Check File Size**
   - Maximum size: 2MB
   - Compress large images
   - Use online tools: TinyPNG, ImageOptim
   - Recommended: < 500KB for performance

3. **Check Upload Permissions**
   - Verify you have `manage_options` capability
   - Check WordPress upload directory is writable:
   ```bash
   chmod 755 /wp-content/uploads
   ```

4. **Check PHP Upload Settings**
   - Verify PHP settings in php.ini:
   ```ini
   upload_max_filesize = 2M
   post_max_size = 8M
   max_execution_time = 300
   ```

5. **Check Server Logs**
   - Enable WP_DEBUG
   - Check /wp-content/debug.log
   - Look for upload errors
   - Check Apache/Nginx error logs

6. **SVG Security Issues**
   - SVG files are sanitized for security
   - Complex SVGs may be rejected
   - Try simpler SVG
   - Or use PNG/JPG instead

7. **Check Logo Enable Toggle**
   - Verify "Enable Logo" is checked
   - Logo won't display if disabled
   - Check in Settings → Menu → Logo

8. **Check Logo URL**
   - Verify logo URL is saved in settings:
   ```php
   $settings = get_option('mase_settings');
   error_log('Logo URL: ' . ($settings['admin_menu']['logo_url'] ?? 'not set'));
   ```

9. **Clear Cache**
   - Clear WordPress cache
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R)

**Manual Upload via Media Library:**
1. Go to Media → Add New
2. Upload logo file
3. Copy file URL
4. Open browser console
5. Run:
```javascript
var settings = MASE.state.settings;
settings.admin_menu.logo_enabled = true;
settings.admin_menu.logo_url = 'YOUR_LOGO_URL_HERE';
MASE.saveSettings(settings);
```

**Verification:**
1. Upload logo file
2. Check for success message
3. Verify logo appears in preview
4. Save settings
5. Refresh page
6. Logo should still be visible

**Technical Details:**
- Location: `includes/class-mase-admin.php` method `handle_logo_upload()`
- Upload handler: WordPress `wp_handle_upload()`
- SVG sanitization: Removes scripts and event handlers
- Security: Nonce verification and capability check

### Icon Colors Not Synchronizing

**Symptoms:**
- Menu icons don't match text color
- Icons stay white when text color changes
- Icon color setting doesn't work
- Some icons change color, others don't

**Root Cause:**
Icon color synchronization depends on the Icon Color Mode setting. In "Auto" mode, icons should match text color. In "Custom" mode, icons use independent color.

**Solutions:**

1. **Check Icon Color Mode**
   - Navigate to Settings → Menu → Icon Colors
   - Verify mode is set correctly:
     - **Auto**: Icons match text color (default)
     - **Custom**: Icons use independent color

2. **Verify CSS Generation**
   ```php
   // Check generated CSS
   $settings = get_option('mase_settings');
   $mode = $settings['admin_menu']['icon_color_mode'] ?? 'auto';
   
   if ($mode === 'auto') {
       $color = $settings['admin_menu']['text_color'];
   } else {
       $color = $settings['admin_menu']['icon_color'];
   }
   
   // Expected CSS:
   // #adminmenu .wp-menu-image,
   // #adminmenu .dashicons {
   //     color: {$color} !important;
   // }
   ```

3. **Check for CSS Conflicts**
   - Use browser DevTools
   - Inspect icon element
   - Check which CSS rules are applied
   - Look for conflicting `color` rules with higher specificity

4. **Clear CSS Cache**
   - Save settings to regenerate CSS
   - Clear WordPress transients
   - Hard refresh browser

5. **Test Live Preview**
   - Enable Live Preview
   - Change text color
   - Icons should update immediately (if in Auto mode)
   - If not, check JavaScript console

6. **Check Icon Selectors**
   - Some plugins use custom icon classes
   - MASE targets: `.wp-menu-image`, `.dashicons`
   - Custom icons may need additional CSS

**Manual Fix:**
```javascript
// Force icon color synchronization
jQuery(document).ready(function($) {
    var textColor = $('#admin-menu-text-color').val();
    $('#adminmenu .wp-menu-image, #adminmenu .dashicons').css('color', textColor);
});
```

**Verification:**
1. Set Icon Color Mode to "Auto"
2. Change text color to red (#ff0000)
3. Icons should turn red
4. Set Icon Color Mode to "Custom"
5. Set icon color to blue (#0000ff)
6. Icons should turn blue (independent of text color)

**Technical Details:**
- Location: `includes/class-mase-css-generator.php` method `generate_menu_icon_color_css()`
- Live preview: `assets/js/mase-admin.js` method `updateTextAndIconColor()`
- Selectors: `#adminmenu .wp-menu-image`, `#adminmenu .dashicons`

## Getting Help

If you've tried these solutions and still have issues:

1. **Gather Information**
   - WordPress version
   - PHP version
   - Browser and version
   - Active plugins list
   - Active theme
   - Error messages
   - Steps to reproduce

2. **Check Debug Log**
   - Enable WP_DEBUG
   - Check /wp-content/debug.log
   - Look for MASE-related errors

3. **Test in Clean Environment**
   - Deactivate all other plugins
   - Switch to default theme
   - Test MASE alone
   - Identify conflicts

4. **Contact Support**
   - Visit plugin repository
   - Submit detailed issue report
   - Include all gathered information
   - Attach screenshots if helpful

---

## Preventive Measures

### Before Making Changes

1. **Create Backup**
   - Export current settings
   - Create manual backup
   - Store backup file safely

2. **Test in Staging**
   - Test major changes in staging environment
   - Verify everything works
   - Then apply to production

3. **Document Changes**
   - Keep notes of customizations
   - Document custom CSS/JS
   - Track palette and template choices

### Regular Maintenance

1. **Keep Updated**
   - Update WordPress regularly
   - Update PHP version
   - Update MASE when new version available

2. **Monitor Performance**
   - Check page load times
   - Monitor server resources
   - Optimize as needed

3. **Clean Up**
   - Remove old backups periodically
   - Clear cache regularly
   - Remove unused custom palettes/templates

---

**Version**: 1.2.0  
**Last Updated**: January 2025
