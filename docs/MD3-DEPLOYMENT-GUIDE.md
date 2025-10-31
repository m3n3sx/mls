# Material Design 3 Deployment Guide

## Overview

This guide covers the deployment process for the Material Design 3 transformation of the Modern Admin Styler plugin.

## Deployment Workflow

### 1. Minify Assets (Task 24.1)

Minify all MD3 CSS and JavaScript files for production.

```bash
# Minify all MD3 assets
npm run minify:md3

# Test minified assets
npm run test:minified

# Or do both
npm run minify:all
```

**What gets minified:**
- 17 MD3 CSS files (tokens, components, themes)
- 11 MD3 JavaScript files (interactions, state management)

**Results:**
- CSS: ~183 KB → ~108 KB (41% reduction)
- JS: ~99 KB → ~38 KB (62% reduction)
- Total: ~282 KB → ~146 KB (48% reduction)

### 2. Create Backup (Task 24.2)

Create a complete backup before deployment.

```bash
# Create backup
npm run backup:md3

# List backups
npm run backup:list
```

**Backup includes:**
- All MD3 CSS files (original and minified)
- All MD3 JavaScript files (original and minified)
- PHP files (class-mase-admin.php, admin-settings-page.php)
- Documentation (MD3-*.md files)
- Spec files (.kiro/specs/material-design-3-transformation/)
- Scripts (minification and test scripts)
- Backup metadata (BACKUP_INFO.txt)
- Rollback procedure (ROLLBACK_PROCEDURE.md)

**Backup format:**
- Directory: `backups/md3-backup-YYYYMMDD_HHMMSS/`
- Archive: `backups/md3-backup-YYYYMMDD_HHMMSS.tar.gz`
- Checksum: `backups/md3-backup-YYYYMMDD_HHMMSS.tar.gz.sha256`

### 3. Deploy to Production (Task 24.3)

Deploy MD3 transformation to production.

```bash
# Prepare for deployment (minify + test + backup)
npm run deploy:prepare

# Deploy to production
npm run deploy:md3
```

**Deployment process:**
1. Pre-deployment checks (minified files, PHP syntax)
2. Create backup
3. Deploy MD3 assets (CSS, JS, PHP)
4. Clear caches (WordPress, MASE)
5. Verify deployment
6. Setup monitoring
7. Generate deployment report

## Manual Deployment Steps

If not in a WordPress environment, follow these manual steps:

### 1. Prepare Assets

```bash
npm run deploy:prepare
```

### 2. Copy Files to WordPress

```bash
# Set your WordPress path
WORDPRESS_PATH="/path/to/wordpress"
PLUGIN_PATH="$WORDPRESS_PATH/wp-content/plugins/modern-admin-styler"

# Copy MD3 CSS files
cp -r assets/css/md3/*.min.css "$PLUGIN_PATH/assets/css/md3/"
cp assets/css/mase-md3-*.min.css "$PLUGIN_PATH/assets/css/"

# Copy MD3 JavaScript files
cp assets/js/mase-md3*.min.js "$PLUGIN_PATH/assets/js/"

# Copy PHP files
cp includes/class-mase-admin.php "$PLUGIN_PATH/includes/"
cp includes/admin-settings-page.php "$PLUGIN_PATH/includes/"
```

### 3. Clear Caches

```bash
# WordPress caches
wp cache flush
wp transient delete --all

# MASE caches
wp option delete mase_css_cache
wp option delete mase_settings_cache
```

### 4. Verify Deployment

1. Log into WordPress admin
2. Navigate to MASE settings page
3. Verify MD3 interface loads correctly
4. Test key functionality:
   - Color palette switching
   - Template application
   - Settings save
   - Live preview
5. Check browser console for errors
6. Test on multiple browsers

## Rollback Procedure

If issues occur after deployment:

### 1. Locate Latest Backup

```bash
# Find latest backup
cat backups/latest-md3-backup.txt

# Or list all backups
ls -lh backups/md3-backup-*.tar.gz
```

### 2. Extract Backup

```bash
# Extract backup
cd backups
tar -xzf md3-backup-YYYYMMDD_HHMMSS.tar.gz
cd md3-backup-YYYYMMDD_HHMMSS
```

### 3. Follow Rollback Procedure

```bash
# Read rollback instructions
cat ROLLBACK_PROCEDURE.md

# Follow the step-by-step instructions in the document
```

### 4. Verify Restoration

1. Clear all caches
2. Test admin interface
3. Verify functionality
4. Check for errors

## Post-Deployment Checklist

- [ ] Admin interface loads correctly
- [ ] No JavaScript errors in console
- [ ] No PHP errors in debug.log
- [ ] Color palette switching works
- [ ] Template application works
- [ ] Settings save correctly
- [ ] Live preview functions
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on mobile devices
- [ ] User feedback collected

## Monitoring

### Error Logs

```bash
# WordPress debug log
tail -f wp-content/debug.log

# PHP error log
tail -f /var/log/php-error.log

# Apache/Nginx error log
tail -f /var/log/apache2/error.log
# or
tail -f /var/log/nginx/error.log
```

### Browser Console

1. Open browser DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed requests
4. Check Performance tab for slow operations

### Performance Metrics

Monitor these metrics:
- Page load time (target: < 2s)
- Time to interactive (target: < 3s)
- First contentful paint (target: < 1s)
- Animation FPS (target: 60fps)

## Troubleshooting

### Issue: Styles not loading

**Symptoms:**
- Admin interface looks broken
- MD3 styles not applied

**Solution:**
1. Clear all caches (WordPress, browser, CDN)
2. Verify CSS files exist: `ls -la assets/css/mase-md3-*.min.css`
3. Check file permissions: `chmod 644 assets/css/*.css`
4. Check browser console for 404 errors
5. Regenerate CSS cache: Delete `mase_css_cache` option

### Issue: JavaScript errors

**Symptoms:**
- Interactions not working
- Console shows errors

**Solution:**
1. Check browser console for specific errors
2. Verify JS files exist: `ls -la assets/js/mase-md3*.min.js`
3. Check file permissions: `chmod 644 assets/js/*.js`
4. Clear browser cache completely
5. Test in incognito/private mode

### Issue: White screen (WSOD)

**Symptoms:**
- Blank white screen
- No content displayed

**Solution:**
1. Enable WordPress debug mode: `define('WP_DEBUG', true);`
2. Check PHP error log: `tail -f /var/log/php-error.log`
3. Verify PHP syntax: `php -l includes/class-mase-admin.php`
4. Check file permissions: `chmod 644 includes/*.php`
5. Rollback to previous version if needed

### Issue: Performance degradation

**Symptoms:**
- Slow page loads
- Laggy animations

**Solution:**
1. Check browser Performance tab
2. Verify minified files are being used
3. Enable caching (WordPress, browser, CDN)
4. Optimize database queries
5. Check for JavaScript errors blocking execution

## NPM Scripts Reference

```bash
# Minification
npm run minify:md3          # Minify MD3 assets
npm run test:minified       # Test minified assets
npm run minify:all          # Minify and test

# Backup
npm run backup:md3          # Create MD3 backup
npm run backup:list         # List backups

# Deployment
npm run deploy:prepare      # Prepare for deployment
npm run deploy:md3          # Deploy to production
```

## Files Created

### Scripts
- `scripts/minify-md3-assets.cjs` - Minification script
- `scripts/test-minified-assets.cjs` - Minified asset validation
- `scripts/create-md3-backup.sh` - Backup creation script
- `scripts/deploy-md3-production.sh` - Production deployment script

### Documentation
- `docs/MD3-DEPLOYMENT-GUIDE.md` - This guide

### Backups
- `backups/md3-backup-YYYYMMDD_HHMMSS/` - Backup directory
- `backups/md3-backup-YYYYMMDD_HHMMSS.tar.gz` - Backup archive
- `backups/md3-backup-YYYYMMDD_HHMMSS.tar.gz.sha256` - Checksum

### Logs
- `deployment-md3-YYYYMMDD-HHMMSS.log` - Deployment log
- `deployment-md3-report-YYYYMMDD-HHMMSS.txt` - Deployment report

## Support

For issues or questions:
1. Check this deployment guide
2. Review MD3 documentation in `docs/MD3-*.md`
3. Check spec files in `.kiro/specs/material-design-3-transformation/`
4. Review deployment logs
5. Contact development team

## Next Steps

After successful deployment:
1. Monitor for 24-48 hours
2. Gather user feedback
3. Address any issues promptly
4. Document lessons learned
5. Plan future enhancements
