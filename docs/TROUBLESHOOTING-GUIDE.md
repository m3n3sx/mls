# MASE Troubleshooting Guide

## Quick Diagnosis

Use this flowchart to quickly identify your issue:

```
Issue with MASE?
│
├─ Settings not saving?
│  └─ See: Settings Issues
│
├─ Preview not working?
│  └─ See: Preview Issues
│
├─ Colors wrong?
│  └─ See: Color Issues
│
├─ Fonts not loading?
│  └─ See: Typography Issues
│
├─ Slow performance?
│  └─ See: Performance Issues
│
├─ After upgrade?
│  └─ See: Upgrade Issues
│
└─ Something else?
   └─ See: General Troubleshooting
```

## Settings Issues

### Settings Not Saving

**Symptoms**:
- Click "Save Settings" but changes don't persist
- Page reloads but settings revert to previous values
- Error message appears after saving

**Diagnosis**:
1. Check browser console (F12) for JavaScript errors
2. Check Network tab for failed API requests
3. Check WordPress debug log for PHP errors

**Solutions**:

**Solution 1: Permission Issue**
```
Problem: User lacks admin permissions
Fix: Verify current user has 'manage_options' capability
Check: WordPress Users → Your Profile → Role = Administrator
```

**Solution 2: Nonce Expired**
```
Problem: Security nonce expired (session timeout)
Fix: Refresh the page and try again
Prevention: Save more frequently, don't leave page open for hours
```

**Solution 3: Server Error**
```
Problem: PHP error on server side
Check: wp-content/debug.log for errors
Fix: Address specific PHP error (memory limit, syntax error, etc.)
```

**Solution 4: Plugin Conflict**
```
Problem: Another plugin interfering with save
Test: Disable other plugins one by one
Fix: Identify conflicting plugin and report to both plugin authors
```

**Solution 5: Database Issue**
```
Problem: Database connection or write error
Check: WordPress database connection
Fix: Contact hosting provider if database issues persist
```

### Settings Corrupted

**Symptoms**:
- Admin interface looks broken
- Settings page won't load
- PHP errors mentioning MASE

**Solutions**:

**Solution 1: Restore from Backup**
```
1. Navigate to Advanced → Backup & Restore
2. Select most recent backup
3. Click "Restore"
4. Confirm action
```

**Solution 2: Reset to Defaults**
```
1. Navigate to Advanced tab
2. Click "Reset to Defaults"
3. Confirm action
4. Reapply your preferred settings
```

**Solution 3: Manual Database Reset**
```sql
-- Via phpMyAdmin or WP-CLI
DELETE FROM wp_options WHERE option_name = 'mase_settings';
-- Plugin will recreate with defaults on next load
```

## Preview Issues

### Preview Not Updating

**Symptoms**:
- Toggle Live Preview but nothing happens
- Changes don't appear in real-time
- Preview works but is slow

**Diagnosis**:
```javascript
// Open browser console (F12) and run:
console.log('Preview active:', window.MASE?.previewEngine?.isPreviewActive());
console.log('State:', window.MASE?.stateManager?.getState());
```

**Solutions**:

**Solution 1: Preview Not Enabled**
```
Problem: Live Preview toggle is off
Fix: Click "Live Preview" toggle in header
Verify: Toggle should show "ON" state
```

**Solution 2: JavaScript Error**
```
Problem: JavaScript error preventing preview
Check: Browser console (F12) for red errors
Fix: Report error to support with full error message
Workaround: Disable conflicting browser extension
```

**Solution 3: CSS Not Injecting**
```
Problem: CSS generation works but not injecting into DOM
Check: Inspect page, look for <style id="mase-preview-style">
Fix: Clear browser cache, hard refresh (Ctrl+Shift+R)
```

**Solution 4: Performance Issue**
```
Problem: Preview updates are slow
Fix: Enable Performance Mode (Ctrl+Shift+P)
Fix: Reduce glassmorphism blur intensity
Fix: Disable animations temporarily
```

### Preview Stuck

**Symptoms**:
- Preview mode won't turn off
- Can't exit preview
- Preview CSS persists after disabling

**Solutions**:

**Solution 1: Clear Preview**
```
1. Click "Clear Preview" button
2. Or refresh page (F5)
3. Or disable Live Preview toggle
```

**Solution 2: Manual CSS Removal**
```javascript
// Open browser console and run:
document.getElementById('mase-preview-style')?.remove();
```

**Solution 3: Clear Browser Cache**
```
1. Open browser settings
2. Clear browsing data
3. Select "Cached images and files"
4. Clear data
5. Refresh MASE page
```

## Color Issues

### Colors Don't Match Palette

**Symptoms**:
- Applied palette but colors look different
- Some areas have wrong colors
- Colors inconsistent across admin

**Solutions**:

**Solution 1: Palette Not Fully Applied**
```
Problem: Palette previewed but not applied
Fix: Click "Apply" button, not just "Preview"
Verify: Palette card should show "Active" badge
```

**Solution 2: Custom CSS Override**
```
Problem: Custom CSS overriding palette colors
Check: Advanced → Custom CSS for color rules
Fix: Remove or adjust conflicting CSS
```

**Solution 3: Theme Conflict**
```
Problem: WordPress theme adding admin styles
Test: Switch to default WordPress theme temporarily
Fix: Add !important to MASE colors or contact theme author
```

**Solution 4: Browser Extension**
```
Problem: Dark mode extension or color filter
Test: Disable browser extensions
Fix: Whitelist WordPress admin in extension settings
```

### Accessibility Warnings

**Symptoms**:
- Red warning icons next to colors
- "Contrast ratio too low" messages
- Accessibility validation fails

**Understanding**:
```
WCAG 2.1 Standards:
- Level AA: 4.5:1 for normal text, 3:1 for large text
- Level AAA: 7:1 for normal text, 4.5:1 for large text

MASE validates all color combinations automatically
```

**Solutions**:

**Solution 1: Use Suggested Colors**
```
1. Click on warning icon
2. View suggested accessible alternatives
3. Click "Apply Suggestion"
4. Colors automatically adjusted to meet WCAG
```

**Solution 2: Manual Adjustment**
```
1. Use Color System contrast checker
2. Adjust colors until ratio meets standards
3. Lighter text on dark background or vice versa
4. Increase contrast between foreground/background
```

**Solution 3: Choose Different Palette**
```
All built-in palettes are WCAG AA compliant
Apply a different palette that meets your needs
```

## Typography Issues

### Google Fonts Not Loading

**Symptoms**:
- Fonts don't appear
- Fallback fonts used instead
- Console errors about font loading

**Diagnosis**:
```javascript
// Check font loading status
console.log('Fonts loaded:', document.fonts.status);
document.fonts.forEach(font => console.log(font.family, font.status));
```

**Solutions**:

**Solution 1: Incorrect Font Name**
```
Problem: Font name misspelled or wrong format
Correct Format: "Inter:400,700" or "Roboto:300,400,500"
Fix: Verify font name on Google Fonts website
```

**Solution 2: Network Issue**
```
Problem: Can't reach Google Fonts CDN
Check: Internet connection
Check: Firewall or ad blocker blocking fonts.googleapis.com
Fix: Whitelist Google Fonts in firewall/ad blocker
```

**Solution 3: Font Cache Corrupted**
```
Problem: Cached font data is invalid
Fix: Clear font cache in Advanced → Clear Cache
Fix: Clear browser localStorage
```

**Solution 4: Timeout**
```
Problem: Font loading exceeds 3-second timeout
Fix: Check internet speed
Fix: Try a different font (some are larger)
Workaround: Font will fallback to system font
```

### Font Rendering Issues

**Symptoms**:
- Fonts look blurry or pixelated
- Font weight incorrect
- Font spacing wrong

**Solutions**:

**Solution 1: Font Smoothing**
```css
/* Add to Custom CSS */
body.wp-admin {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
```

**Solution 2: Font Weight**
```
Problem: Requested weight not available
Fix: Check which weights are available for font
Fix: Adjust font weight setting to available weight
```

**Solution 3: Line Height**
```
Problem: Text overlapping or too spaced
Fix: Adjust line height in Typography settings
Recommended: 1.4-1.6 for body text, 1.2-1.4 for headings
```

## Performance Issues

### Slow Admin Interface

**Symptoms**:
- Admin pages load slowly
- Preview updates lag
- Interface feels sluggish

**Diagnosis**:
```javascript
// Check performance metrics
performance.getEntriesByType('measure').forEach(m => {
    console.log(m.name, m.duration + 'ms');
});
```

**Solutions**:

**Solution 1: Enable Performance Mode**
```
1. Press Ctrl+Shift+P
2. Or navigate to Effects → Performance Mode
3. Disables expensive visual effects
4. Improves responsiveness
```

**Solution 2: Disable Animations**
```
1. Navigate to Effects tab
2. Disable "Page Animations"
3. Disable "Hover Effects"
4. Reduce animation speed
```

**Solution 3: Reduce Blur**
```
Problem: Glassmorphism blur is expensive
Fix: Reduce blur intensity to 0-10px
Fix: Disable glassmorphism entirely
```

**Solution 4: Clear Caches**
```
1. Advanced → Clear Cache
2. Clear browser cache
3. Clear WordPress object cache
4. Restart browser
```

**Solution 5: Check Server Resources**
```
Problem: Server overloaded or slow
Check: PHP memory limit (should be 256MB+)
Check: Server CPU and RAM usage
Fix: Upgrade hosting plan if needed
```

### Large Bundle Size

**Symptoms**:
- Initial page load is slow
- Large JavaScript files downloading
- Network tab shows big file sizes

**Solutions**:

**Solution 1: Code Splitting Working**
```
This is normal - MASE uses code splitting
Modules load on-demand when needed
Initial bundle should be < 30KB
Feature modules load when tabs clicked
```

**Solution 2: Clear Browser Cache**
```
Old cached bundles may be large
Clear cache to get optimized v2.0 bundles
Hard refresh (Ctrl+Shift+R)
```

**Solution 3: Check Network Speed**
```
Run speed test
If on slow connection, enable Performance Mode
Consider using mobile data saver
```

## Upgrade Issues

### Issues After Upgrading to v2.0

**Symptoms**:
- Settings look different after upgrade
- Features not working as before
- New errors appearing

**Solutions**:

**Solution 1: Clear All Caches**
```
1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear WordPress object cache
3. Clear any CDN cache
4. Hard refresh page (Ctrl+Shift+R)
```

**Solution 2: Check Feature Flags**
```
1. Navigate to Advanced → Feature Flags
2. Verify all modern features are enabled
3. If issues persist, try disabling features one by one
4. Identify which feature causes the issue
```

**Solution 3: Restore from Backup**
```
Automatic backup created before upgrade
1. Navigate to Advanced → Backup & Restore
2. Find backup from before upgrade
3. Click "Restore"
4. Report issue to support
```

**Solution 4: Rollback Plugin Version**
```
Last resort if v2.0 has critical issues:
1. Deactivate MASE plugin
2. Delete plugin files
3. Install previous version from WordPress.org
4. Reactivate plugin
5. Report issue to support
```

### Migration Failed

**Symptoms**:
- Error during upgrade
- Settings lost after upgrade
- Plugin won't activate

**Solutions**:

**Solution 1: Database Backup**
```
If you have database backup:
1. Restore database from backup
2. Reinstall previous plugin version
3. Contact support before retrying upgrade
```

**Solution 2: Manual Migration**
```
1. Export settings from old version (if possible)
2. Reset MASE to defaults
3. Import settings
4. Manually reapply customizations
```

**Solution 3: Fresh Install**
```
If all else fails:
1. Deactivate and delete MASE
2. Reinstall fresh copy
3. Start with default settings
4. Reapply customizations manually
```

## General Troubleshooting

### Enable Debug Mode

```php
// Add to wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);
```

Check logs:
```bash
tail -f wp-content/debug.log
```

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for red errors
4. Copy full error message for support

### Check Network Requests

1. Open Developer Tools (F12)
2. Go to Network tab
3. Reload page
4. Look for failed requests (red)
5. Click failed request to see details

### Test in Incognito Mode

1. Open incognito/private window
2. Login to WordPress admin
3. Test MASE functionality
4. If works in incognito, issue is browser extension or cache

### Disable Other Plugins

1. Deactivate all other plugins
2. Test MASE functionality
3. Reactivate plugins one by one
4. Identify conflicting plugin

### Switch Theme

1. Switch to default WordPress theme (Twenty Twenty-Four)
2. Test MASE functionality
3. If works with default theme, issue is theme conflict

### Check PHP Version

```bash
php -v
```

MASE requires PHP 7.4+
Recommended: PHP 8.0+

### Check WordPress Version

MASE requires WordPress 5.8+
Recommended: Latest WordPress version

### Increase PHP Memory

```php
// Add to wp-config.php
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');
```

### Check File Permissions

```bash
# Plugin directory should be readable
chmod 755 wp-content/plugins/modern-admin-styler
chmod 644 wp-content/plugins/modern-admin-styler/*.php
```

## Getting Help

### Before Contacting Support

Gather this information:

1. **Environment**:
   - WordPress version
   - PHP version
   - MASE version
   - Browser and version
   - Operating system

2. **Issue Details**:
   - Clear description of problem
   - Steps to reproduce
   - Expected vs actual behavior
   - When issue started

3. **Error Messages**:
   - JavaScript console errors
   - PHP error log entries
   - Network request failures
   - Screenshots if applicable

4. **Troubleshooting Tried**:
   - List what you've already tried
   - Results of each attempt
   - Any temporary workarounds

### Contact Channels

1. **GitHub Issues**: https://github.com/your-org/modern-admin-styler/issues
   - Best for: Bug reports, feature requests
   - Include: Full error details, reproduction steps

2. **Support Forum**: WordPress.org support forum
   - Best for: General questions, how-to
   - Include: WordPress and plugin versions

3. **Email Support**: support@example.com
   - Best for: Premium users, urgent issues
   - Include: All gathered information above

### Creating Good Bug Reports

**Good Bug Report Template**:
```
**Environment**
- WordPress: 6.4.1
- MASE: 2.0.0
- PHP: 8.1
- Browser: Chrome 120

**Issue**
Preview not updating when changing colors

**Steps to Reproduce**
1. Navigate to MASE Settings
2. Enable Live Preview
3. Change primary color
4. Preview does not update

**Expected**
Preview should update immediately

**Actual**
No visual change, console shows error:
"TypeError: Cannot read property 'generateCSS' of undefined"

**Tried**
- Cleared browser cache
- Disabled other plugins
- Tested in incognito mode
- Issue persists

**Screenshots**
[Attach console error screenshot]
```

## Quick Fixes

### Reset Everything

```
1. Advanced → Reset to Defaults
2. Clear browser cache
3. Refresh page
4. Reapply settings
```

### Force Refresh

```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### Clear Plugin Cache

```
1. Advanced → Clear Cache
2. Clears font cache
3. Clears settings cache
4. Clears generated CSS
```

### Reinstall Plugin

```
1. Export settings first (backup)
2. Deactivate plugin
3. Delete plugin
4. Reinstall from WordPress.org
5. Activate plugin
6. Import settings
```

## Known Issues

### Firefox Glassmorphism

**Issue**: Glassmorphism blur may not work in older Firefox versions

**Workaround**: Fallback to solid background automatically applied

**Fix**: Update Firefox to latest version

### Safari Font Loading

**Issue**: Some Google Fonts may load slowly in Safari

**Workaround**: Font timeout set to 3 seconds, fallback font used

**Fix**: Use system fonts or different Google Font

### Mobile Performance

**Issue**: Animations may be choppy on older mobile devices

**Workaround**: Performance Mode automatically enabled on low-power devices

**Fix**: Manually disable animations in Effects tab

## Preventive Measures

### Regular Backups

```
1. Export settings monthly
2. Keep backups in safe location
3. Test restore process occasionally
```

### Keep Updated

```
1. Update WordPress regularly
2. Update MASE when new version available
3. Update PHP to supported version
4. Update browser to latest version
```

### Monitor Performance

```
1. Check admin load times periodically
2. Monitor error logs
3. Test after plugin/theme updates
4. Address issues promptly
```

### Best Practices

```
1. Test changes in preview before saving
2. Create backup before major changes
3. Document custom CSS/JS
4. Use feature flags for gradual rollout
5. Report bugs to help improve plugin
```

---

**Last Updated**: October 2025  
**Version**: 2.0.0

For additional help, see:
- [User Guide](USER-GUIDE.md)
- [Developer Guide](DEVELOPER-GUIDE.md)
- [Migration Guide](MIGRATION-GUIDE.md)
- [FAQ](FAQ.md)
