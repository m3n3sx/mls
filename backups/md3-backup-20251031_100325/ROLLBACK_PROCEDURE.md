# MD3 Transformation Rollback Procedure

## Overview

This document provides step-by-step instructions for rolling back the Material Design 3 transformation to the backed-up state.

## Prerequisites

- SSH/terminal access to the server
- Backup files in this directory
- WordPress admin access

## Rollback Steps

### 1. Stop WordPress (Optional but Recommended)

```bash
# If using maintenance mode plugin
wp maintenance-mode activate

# Or create maintenance file manually
touch .maintenance
```

### 2. Restore CSS Files

```bash
# Restore MD3 token files
cp -r assets/css/md3/* /path/to/wordpress/wp-content/plugins/modern-admin-styler/assets/css/md3/

# Restore MD3 component CSS
cp assets/css/mase-md3-*.css /path/to/wordpress/wp-content/plugins/modern-admin-styler/assets/css/
```

### 3. Restore JavaScript Files

```bash
# Restore MD3 JavaScript files
cp assets/js/mase-md3*.js /path/to/wordpress/wp-content/plugins/modern-admin-styler/assets/js/
```

### 4. Restore PHP Files

```bash
# Restore admin class
cp includes/class-mase-admin.php /path/to/wordpress/wp-content/plugins/modern-admin-styler/includes/

# Restore settings page
cp includes/admin-settings-page.php /path/to/wordpress/wp-content/plugins/modern-admin-styler/includes/
```

### 5. Clear Caches

```bash
# Clear WordPress object cache
wp cache flush

# Clear MASE cache
wp option delete mase_css_cache
wp option delete mase_settings_cache

# Clear browser cache (instruct users)
```

### 6. Verify Restoration

1. Log into WordPress admin
2. Navigate to MASE settings page
3. Verify interface displays correctly
4. Test key functionality:
   - Color palette switching
   - Template application
   - Settings save
   - Live preview

### 7. Re-enable WordPress

```bash
# If using maintenance mode plugin
wp maintenance-mode deactivate

# Or remove maintenance file
rm .maintenance
```

## Verification Checklist

- [ ] All MD3 CSS files restored
- [ ] All MD3 JavaScript files restored
- [ ] PHP files restored
- [ ] Caches cleared
- [ ] Admin interface loads correctly
- [ ] No JavaScript errors in console
- [ ] Settings can be saved
- [ ] Live preview works
- [ ] No PHP errors in debug log

## Troubleshooting

### Issue: White screen after rollback

**Solution:**
1. Check PHP error log: `tail -f /var/log/php-error.log`
2. Verify file permissions: `chmod 644 includes/*.php`
3. Check for syntax errors: `php -l includes/class-mase-admin.php`

### Issue: Styles not loading

**Solution:**
1. Clear all caches (WordPress, browser, CDN)
2. Verify CSS files exist: `ls -la assets/css/mase-md3-*.css`
3. Check file permissions: `chmod 644 assets/css/*.css`
4. Regenerate CSS cache: Delete `mase_css_cache` option

### Issue: JavaScript errors

**Solution:**
1. Check browser console for specific errors
2. Verify JS files exist: `ls -la assets/js/mase-md3*.js`
3. Check file permissions: `chmod 644 assets/js/*.js`
4. Clear browser cache completely

## Emergency Contact

If rollback fails, contact:
- Development team
- System administrator
- WordPress support

## Post-Rollback

1. Document what went wrong
2. Review logs for errors
3. Plan corrective actions
4. Test in staging before re-deploying

