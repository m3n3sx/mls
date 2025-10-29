# MASE Rollback Procedure

**Version:** 1.2.2  
**Last Updated:** October 28, 2025

## Overview

This document describes the procedure for rolling back MASE to a previous version in case of critical issues after deployment.

## Rollback Triggers

### Automatic Rollback (Immediate)
- Error rate >10%
- Critical functionality completely broken
- Security vulnerability discovered
- Database corruption

### Manual Rollback (Within 1 hour)
- Error rate 5-10%
- Performance degradation >20%
- Multiple user complaints
- Data loss reported

## Pre-Rollback Checklist

Before initiating rollback:

1. **Document the Issue**
   - Error messages
   - Affected users/sites
   - Steps to reproduce
   - Screenshots/logs

2. **Assess Impact**
   - Number of affected users
   - Severity of issue
   - Data loss risk

3. **Notify Stakeholders**
   - Development team
   - Support team
   - Affected users (if applicable)

## Rollback Procedure

### Step 1: Immediate Actions (< 5 minutes)

```bash
# 1. Access WordPress admin
# 2. Navigate to Plugins > Installed Plugins
# 3. Deactivate MASE
# 4. Delete MASE plugin
```

### Step 2: Install Previous Version (< 10 minutes)

**Option A: From WordPress.org**

```bash
# 1. Go to Plugins > Add New
# 2. Search for "Modern Admin Styler Enterprise"
# 3. Click "Install" (will install latest stable version)
# 4. Activate plugin
```

**Option B: From Backup ZIP**

```bash
# 1. Download previous version ZIP
wget https://downloads.wordpress.org/plugin/modern-admin-styler.1.2.1.zip

# 2. Upload via WordPress admin
# Plugins > Add New > Upload Plugin

# 3. Activate plugin
```

**Option C: Via WP-CLI**

```bash
# Deactivate current version
wp plugin deactivate modern-admin-styler

# Install previous version
wp plugin install modern-admin-styler --version=1.2.1 --activate

# Verify installation
wp plugin list | grep modern-admin-styler
```

### Step 3: Verify Settings Preserved (< 5 minutes)

```bash
# Check settings in database
wp option get mase_settings

# Verify in admin interface
# 1. Go to Modern Admin Styler settings
# 2. Check that colors/palettes are preserved
# 3. Test live preview
# 4. Test save functionality
```

### Step 4: Clear Caches (< 2 minutes)

```bash
# Clear WordPress object cache
wp cache flush

# Clear MASE cache
wp option delete mase_css_cache_light
wp option delete mase_css_cache_dark

# Clear browser cache (instruct users)
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)
```

### Step 5: Monitor (30 minutes)

- Check error logs: `tail -f wp-content/debug.log`
- Monitor user reports
- Verify functionality restored
- Check performance metrics

## Settings Preservation

MASE settings are stored in WordPress options table and are **preserved during rollback**:

- Option name: `mase_settings`
- Backup option: `mase_settings_backup_110` (v1.1.0)
- Backup option: `mase_settings_backup_120` (v1.2.0)

Settings are **NOT deleted** when plugin is deactivated or uninstalled (unless explicitly chosen).

## Rollback from SVN (WordPress.org)

If you need to rollback the WordPress.org version:

```bash
# 1. Checkout SVN repository
svn co https://plugins.svn.wordpress.org/modern-admin-styler

# 2. Navigate to directory
cd modern-admin-styler

# 3. Copy previous version to trunk
svn cp tags/1.2.1 trunk --force

# 4. Commit changes
svn ci -m "Rollback to v1.2.1 due to [issue description]"

# 5. Verify on WordPress.org (may take 15-30 minutes)
```

## Post-Rollback Actions

### Immediate (< 1 hour)

1. **Notify Users**
   - Post on WordPress.org support forum
   - Update plugin description (if needed)
   - Send email to affected users

2. **Document Issue**
   - Create GitHub issue
   - Document in CHANGELOG.md
   - Update known issues list

3. **Investigate Root Cause**
   - Review error logs
   - Reproduce issue in staging
   - Identify fix

### Short-term (< 24 hours)

1. **Fix Issue**
   - Develop fix in development environment
   - Test thoroughly
   - Create hotfix branch

2. **Test Fix**
   - Run full test suite
   - Manual testing
   - Staging environment testing

3. **Prepare Hotfix Release**
   - Update version (e.g., 1.2.2.1)
   - Update CHANGELOG.md
   - Create new package

### Long-term (< 1 week)

1. **Deploy Hotfix**
   - Follow normal deployment procedure
   - Monitor closely
   - Communicate with users

2. **Post-Mortem**
   - Document what went wrong
   - Identify prevention measures
   - Update testing procedures

## Rollback Testing

Test rollback procedure quarterly:

```bash
# 1. Install current version in staging
wp plugin install modern-admin-styler --activate

# 2. Configure settings
# (via admin interface)

# 3. Perform rollback
wp plugin deactivate modern-admin-styler
wp plugin install modern-admin-styler --version=1.2.1 --activate

# 4. Verify settings preserved
wp option get mase_settings

# 5. Test functionality
# (via admin interface)

# 6. Document results
# Time taken: ___
# Issues encountered: ___
# Settings preserved: Yes/No
```

## Emergency Contacts

**Development Team:**
- Lead Developer: [Name] - [Email] - [Phone]
- Backend Developer: [Name] - [Email] - [Phone]

**Support Team:**
- Support Lead: [Name] - [Email] - [Phone]

**On-Call:**
- Primary: [Phone]
- Secondary: [Phone]

## Rollback Decision Matrix

| Metric | Green | Yellow | Red (Rollback) |
|--------|-------|--------|----------------|
| Error Rate | < 1% | 1-5% | > 5% |
| Performance | < 10% slower | 10-20% slower | > 20% slower |
| User Reports | 0-2 | 3-5 | > 5 |
| Critical Bugs | 0 | 1-2 minor | 1+ critical |
| Data Loss | None | Potential | Confirmed |

## Version History

| Version | Release Date | Rollback Tested | Notes |
|---------|--------------|-----------------|-------|
| 1.2.2 | 2025-10-28 | Yes | Production deployment |
| 1.2.1 | 2025-10-19 | Yes | Bug fixes |
| 1.2.0 | 2025-01-18 | Yes | Major upgrade |
| 1.1.0 | 2024-12-15 | Yes | Caching system |
| 1.0.0 | 2024-11-01 | N/A | Initial release |

## Appendix

### A. Common Issues and Solutions

**Issue:** Settings not preserved after rollback
**Solution:** Restore from backup option: `wp option get mase_settings_backup_120`

**Issue:** CSS not loading after rollback
**Solution:** Clear cache: `wp option delete mase_css_cache_light mase_css_cache_dark`

**Issue:** Admin interface broken
**Solution:** Deactivate all plugins, reactivate MASE only

### B. Backup Locations

- **Database:** `wp_options` table, key `mase_settings`
- **Backups:** `wp_options` table, keys `mase_settings_backup_*`
- **Files:** Plugin directory `/wp-content/plugins/modern-admin-styler/`

### C. Useful Commands

```bash
# Check current version
wp plugin list | grep modern-admin-styler

# Export settings
wp option get mase_settings > mase-settings-backup.json

# Import settings
wp option update mase_settings "$(cat mase-settings-backup.json)"

# Check error log
tail -100 wp-content/debug.log | grep MASE

# Clear all MASE data (CAUTION!)
wp option delete mase_settings
wp option delete mase_css_cache_light
wp option delete mase_css_cache_dark
```
