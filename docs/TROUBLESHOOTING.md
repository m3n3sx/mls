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
