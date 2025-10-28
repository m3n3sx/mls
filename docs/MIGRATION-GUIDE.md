# MASE Migration Guide

## Overview

This guide documents the migration from the legacy monolithic architecture to the modern modular system. The migration follows a phased approach using feature flags to enable gradual rollout with minimal risk.

## Table of Contents

1. [Migration Strategy](#migration-strategy)
2. [Migration Phases](#migration-phases)
3. [Feature Flags](#feature-flags)
4. [Rollback Procedures](#rollback-procedures)
5. [Breaking Changes](#breaking-changes)
6. [Testing During Migration](#testing-during-migration)
7. [Monitoring and Validation](#monitoring-and-validation)

## Migration Strategy

### Principles

1. **Incremental Migration**: Migrate one module at a time, not all at once
2. **Feature Flags**: Use flags to toggle between legacy and modern implementations
3. **Backwards Compatibility**: Maintain existing functionality throughout migration
4. **Rollback Ready**: Every phase can be rolled back instantly
5. **Validation First**: Comprehensive testing before each phase rollout
6. **User Transparency**: Migration should be invisible to end users

### Timeline

- **Phase 1**: Foundation Setup (Weeks 1-2)
- **Phase 2**: Preview Engine Migration (Weeks 3-4)
- **Phase 3**: Feature Modules Migration (Weeks 5-6)
- **Phase 4**: API Client Implementation (Weeks 7-8)
- **Phase 5**: Main Admin Integration (Weeks 9-10)
- **Phase 6**: Performance Optimization (Weeks 11-12)
- **Phase 7**: Documentation and Deployment (Week 13)
- **Phase 8**: Legacy Code Removal (Week 14)

### Risk Mitigation

- **Database Backups**: Before each phase deployment
- **Feature Flags**: Instant rollback capability
- **Monitoring**: Error tracking and performance metrics
- **Staged Rollout**: 10% → 50% → 100% user adoption
- **Communication**: Clear documentation and team updates

## Migration Phases

### Phase 1: Foundation Setup ✅ COMPLETED

**Goal**: Setup build system and core modules without breaking existing functionality

**Changes**:
- ✅ Vite build configuration
- ✅ Module directory structure
- ✅ State Manager with Zustand
- ✅ Event Bus implementation
- ✅ Testing infrastructure (Vitest + Playwright)
- ✅ Feature flag system

**Feature Flags**: None (infrastructure only)

**Validation**:
- ✅ Build system generates bundles successfully
- ✅ All existing functionality works via legacy code
- ✅ Tests run and pass
- ✅ No user-facing changes

**Rollback**: Not needed (no user-facing changes)

---

### Phase 2: Preview Engine Migration ✅ COMPLETED

**Goal**: Migrate CSS generation to new Preview Engine module

**Changes**:
- ✅ Extract CSS generation logic from legacy code
- ✅ Implement Preview Engine module
- ✅ Add comprehensive unit tests
- ✅ Implement feature flag toggle
- ✅ Performance testing and optimization

**Feature Flag**: `MASE_MODERN_PREVIEW`

**Validation**:
- ✅ Preview Engine generates identical CSS to legacy
- ✅ Performance equal or better than legacy
- ✅ All preview tests pass
- ✅ No visual differences in admin interface

**Rollback Procedure**:
```php
// Set feature flag to false
update_option('mase_feature_flags', [
  'MASE_MODERN_PREVIEW' => false,
]);

// Clear browser caches
// Verify legacy preview works
```

---

### Phase 3: Feature Modules Migration ✅ COMPLETED

**Goal**: Migrate Color System, Typography, and Animations

**Changes**:
- ✅ Implement Color System module with accessibility checks
- ✅ Implement Typography module with font loading
- ✅ Implement Animations module with reduced motion support
- ✅ Migrate event handlers to use Event Bus
- ✅ Integration testing across modules

**Feature Flags**:
- `MASE_MODERN_COLOR_SYSTEM`
- `MASE_MODERN_TYPOGRAPHY`
- `MASE_MODERN_ANIMATIONS`

**Validation**:
- ✅ All feature modules functional
- ✅ Module communication via Event Bus working
- ✅ Integration tests pass
- ✅ User workflows unaffected

**Rollback Procedure**:
```php
// Disable all feature module flags
update_option('mase_feature_flags', [
  'MASE_MODERN_COLOR_SYSTEM' => false,
  'MASE_MODERN_TYPOGRAPHY' => false,
  'MASE_MODERN_ANIMATIONS' => false,
]);
```

---

### Phase 4: API Client Implementation ✅ COMPLETED

**Goal**: Centralize all WordPress REST API communication

**Changes**:
- ✅ Implement API Client module
- ✅ Migrate all AJAX calls to API Client
- ✅ Add request queuing and retry logic
- ✅ Implement error handling and recovery
- ✅ E2E testing of save/load workflows

**Feature Flag**: `MASE_MODERN_API_CLIENT`

**Validation**:
- ✅ All API calls go through API Client
- ✅ Error handling robust and user-friendly
- ✅ No data loss or corruption
- ✅ E2E tests pass

**Rollback Procedure**:
```php
// Disable API Client flag
update_option('mase_feature_flags', [
  'MASE_MODERN_API_CLIENT' => false,
]);

// Verify legacy AJAX handlers work
// Check for any queued requests
```

---

### Phase 5: Main Admin Integration ✅ COMPLETED

**Goal**: Complete integration of all modern modules

**Changes**:
- ✅ Implement Main Admin module with initialization
- ✅ Update WordPress PHP integration
- ✅ Create REST API endpoints
- ✅ Update admin settings page template
- ✅ Implement legacy compatibility layer

**Feature Flag**: `MASE_MODERN_ADMIN`

**Validation**:
- ✅ Complete initialization sequence works
- ✅ All modules load and communicate correctly
- ✅ WordPress integration functional
- ✅ Legacy compatibility maintained

**Rollback Procedure**:
```php
// Disable main admin flag
update_option('mase_feature_flags', [
  'MASE_MODERN_ADMIN' => false,
]);

// This disables all modern modules
// Legacy system takes over completely
```

---

### Phase 6: Performance Optimization ✅ COMPLETED

**Goal**: Optimize bundle sizes and loading performance

**Changes**:
- ✅ Configure Vite code splitting
- ✅ Implement lazy loading for feature modules
- ✅ Optimize bundle sizes
- ✅ Implement caching strategies
- ✅ Performance testing

**Feature Flags**: None (optimization only)

**Validation**:
- ✅ Initial load time < 200ms on 3G
- ✅ Preview update latency < 50ms
- ✅ Lighthouse score 90+
- ✅ Bundle sizes meet targets

**Rollback**: Not needed (optimizations don't break functionality)

---

### Phase 7: Documentation and Deployment 🔄 IN PROGRESS

**Goal**: Create comprehensive documentation and deploy to production

**Changes**:
- 🔄 Document module architecture
- 🔄 Create developer guide
- 🔄 Create migration guide (this document)
- 🔄 Update user documentation
- ⏳ Final testing and validation
- ⏳ Production deployment

**Feature Flags**: All flags remain for gradual rollout

**Validation**:
- ⏳ All documentation complete and accurate
- ⏳ Complete test suite passes
- ⏳ Manual testing across browsers
- ⏳ Performance validation

**Deployment Steps**:
1. Deploy with all feature flags disabled
2. Monitor for 24 hours
3. Enable Preview Engine for 10% of users
4. Monitor for 48 hours
5. Increase to 50% if no issues
6. Monitor for 48 hours
7. Enable for 100% of users
8. Enable remaining features incrementally

---

### Phase 8: Legacy Code Removal ⏳ PENDING

**Goal**: Remove legacy code and feature flags

**Changes**:
- ⏳ Remove all feature flag checks
- ⏳ Remove legacy code paths
- ⏳ Delete old mase-admin.js monolith
- ⏳ Clean up codebase
- ⏳ Final regression testing

**Feature Flags**: All removed

**Validation**:
- ⏳ Complete test suite passes
- ⏳ Manual testing of all features
- ⏳ No functionality lost
- ⏳ Performance maintained

**Rollback**: Not possible (legacy code removed)
- **Mitigation**: Thorough testing before this phase
- **Backup**: Git tag before legacy removal

## Feature Flags

### Overview

Feature flags enable toggling between legacy and modern implementations without code deployment. This allows instant rollback if issues are discovered.

### Available Flags

| Flag | Purpose | Status | Default |
|------|---------|--------|---------|
| `MASE_MODERN_PREVIEW` | Preview Engine module | ✅ Stable | `true` |
| `MASE_MODERN_COLOR_SYSTEM` | Color System module | ✅ Stable | `true` |
| `MASE_MODERN_TYPOGRAPHY` | Typography module | ✅ Stable | `true` |
| `MASE_MODERN_ANIMATIONS` | Animations module | ✅ Stable | `true` |
| `MASE_MODERN_API_CLIENT` | API Client module | ✅ Stable | `true` |
| `MASE_MODERN_ADMIN` | Main Admin integration | ✅ Stable | `true` |

### Managing Feature Flags

**Via WordPress Admin**:
1. Navigate to MASE Settings → Advanced
2. Scroll to "Feature Flags" section
3. Toggle checkboxes to enable/disable features
4. Click "Save Settings"

**Via PHP**:
```php
// Get all flags
$flags = get_option('mase_feature_flags', []);

// Update specific flag
$flags['MASE_MODERN_PREVIEW'] = false;
update_option('mase_feature_flags', $flags);

// Check if flag is enabled
$enabled = MASE_Feature_Flags::is_enabled('MASE_MODERN_PREVIEW');
```

**Via WP-CLI**:
```bash
# Get flag value
wp option get mase_feature_flags --format=json

# Update flag
wp option patch update mase_feature_flags MASE_MODERN_PREVIEW false

# Enable all flags
wp option update mase_feature_flags '{"MASE_MODERN_PREVIEW":true,"MASE_MODERN_COLOR_SYSTEM":true}' --format=json
```

### Feature Flag Implementation

**PHP Side**:
```php
// includes/class-mase-feature-flags.php
class MASE_Feature_Flags {
  public static function is_enabled($flag) {
    $flags = get_option('mase_feature_flags', []);
    return isset($flags[$flag]) && $flags[$flag] === true;
  }
}

// includes/class-mase-admin.php
public function enqueue_admin_assets() {
  if (MASE_Feature_Flags::is_enabled('MASE_MODERN_ADMIN')) {
    // Enqueue modern bundles
    wp_enqueue_script('mase-modern', ...);
  } else {
    // Enqueue legacy script
    wp_enqueue_script('mase-admin', ...);
  }
}
```

**JavaScript Side**:
```javascript
// assets/js/modules/feature-flags.js
export function isFeatureEnabled(flag) {
  return window.maseData?.features?.[flag] === true;
}

// Usage in modules
if (isFeatureEnabled('MASE_MODERN_PREVIEW')) {
  // Use modern Preview Engine
  previewEngine.generateCSS(settings);
} else {
  // Use legacy CSS generation
  legacyGenerateCSS(settings);
}
```

## Rollback Procedures

### Immediate Rollback (< 5 minutes)

**When to use**: Critical bug discovered, data loss, or major functionality broken

**Steps**:

1. **Disable feature flag via WordPress admin**:
   - Navigate to MASE Settings → Advanced → Feature Flags
   - Uncheck the problematic feature flag
   - Click "Save Settings"

2. **Or disable via WP-CLI** (faster):
   ```bash
   wp option patch update mase_feature_flags MASE_MODERN_PREVIEW false
   ```

3. **Clear caches**:
   ```bash
   # WordPress object cache
   wp cache flush
   
   # Browser cache (instruct users)
   # Ctrl+Shift+R (hard refresh)
   ```

4. **Verify legacy functionality**:
   - Test critical workflows
   - Check error logs
   - Monitor user reports

5. **Communicate**:
   - Notify team of rollback
   - Update status page if public-facing
   - Document issue for investigation

### Partial Rollback (< 15 minutes)

**When to use**: Issue affects specific module but not entire system

**Steps**:

1. **Identify problematic module**:
   - Check error logs
   - Review user reports
   - Test in isolation

2. **Disable specific feature flag**:
   ```php
   // Only disable problematic module
   $flags = get_option('mase_feature_flags', []);
   $flags['MASE_MODERN_COLOR_SYSTEM'] = false; // Example
   update_option('mase_feature_flags', $flags);
   ```

3. **Keep other modern modules enabled**:
   - Preview Engine can stay enabled
   - API Client can stay enabled
   - Only rollback what's broken

4. **Test integration**:
   - Verify modern/legacy modules work together
   - Check for edge cases
   - Monitor for new issues

### Full Rollback (< 30 minutes)

**When to use**: Multiple issues, cascading failures, or uncertain root cause

**Steps**:

1. **Disable all modern features**:
   ```php
   update_option('mase_feature_flags', [
     'MASE_MODERN_PREVIEW' => false,
     'MASE_MODERN_COLOR_SYSTEM' => false,
     'MASE_MODERN_TYPOGRAPHY' => false,
     'MASE_MODERN_ANIMATIONS' => false,
     'MASE_MODERN_API_CLIENT' => false,
     'MASE_MODERN_ADMIN' => false,
   ]);
   ```

2. **Clear all caches**:
   ```bash
   wp cache flush
   wp transient delete --all
   ```

3. **Restore database backup** (if data corruption):
   ```bash
   wp db import backup-before-migration.sql
   ```

4. **Verify complete legacy operation**:
   - Test all critical workflows
   - Check all admin pages
   - Verify settings persistence
   - Test with different user roles

5. **Investigate and fix**:
   - Review error logs
   - Reproduce issue in development
   - Fix and test thoroughly
   - Plan re-deployment

### Database Rollback

**When to use**: Data corruption or settings incompatibility

**Prerequisites**:
- Database backup taken before migration phase
- Backup verified and accessible

**Steps**:

1. **Stop WordPress** (prevent new writes):
   ```bash
   # Put site in maintenance mode
   wp maintenance-mode activate
   ```

2. **Backup current database** (just in case):
   ```bash
   wp db export rollback-backup-$(date +%Y%m%d-%H%M%S).sql
   ```

3. **Restore from backup**:
   ```bash
   wp db import backup-before-phase-X.sql
   ```

4. **Verify restoration**:
   ```bash
   wp db check
   wp option get mase_settings
   ```

5. **Disable modern features**:
   ```bash
   wp option update mase_feature_flags '{}' --format=json
   ```

6. **Reactivate site**:
   ```bash
   wp maintenance-mode deactivate
   ```

7. **Test thoroughly**:
   - Verify all settings restored
   - Test critical workflows
   - Check user data integrity

### Code Rollback

**When to use**: Bug in deployed code, need to revert to previous version

**Steps**:

1. **Identify last known good version**:
   ```bash
   git log --oneline
   # Find commit before problematic deployment
   ```

2. **Create rollback branch**:
   ```bash
   git checkout -b rollback-to-v1.1.0
   git reset --hard v1.1.0
   ```

3. **Deploy rolled back code**:
   ```bash
   npm run build
   ./create-release-package.sh
   # Deploy package to production
   ```

4. **Verify deployment**:
   - Check version number in admin
   - Test critical functionality
   - Monitor error logs

5. **Communicate**:
   - Notify team of code rollback
   - Document issue
   - Plan fix and re-deployment

## Breaking Changes

### From Legacy to Modern

**JavaScript API Changes**:

| Legacy | Modern | Migration |
|--------|--------|-----------|
| `window.MASE.settings` | `useStore.getState().settings` | Use State Manager |
| `jQuery.ajax()` | `apiClient.request()` | Use API Client |
| Direct function calls | Event Bus | Emit/subscribe to events |
| Global variables | Module imports | Import from modules |

**Event Name Changes**:

| Legacy | Modern |
|--------|--------|
| `mase-settings-changed` | `settings:changed` |
| `mase-preview-update` | `preview:update` |
| `mase-color-selected` | `color:selected` |

**CSS Class Changes**:

No CSS class changes - all classes remain backwards compatible.

**PHP API Changes**:

No breaking changes in PHP API. All existing hooks and filters maintained.

### Deprecation Warnings

**JavaScript Console Warnings**:
```javascript
// Legacy API usage triggers warnings
console.warn('DEPRECATED: window.MASE.settings is deprecated. Use State Manager instead.');
console.warn('DEPRECATED: Direct AJAX calls are deprecated. Use API Client instead.');
```

**PHP Deprecation Notices**:
```php
// Legacy hooks trigger notices
_deprecated_function('mase_legacy_hook', '2.0.0', 'mase_modern_hook');
```

### Migration Path for Custom Code

**If you have custom JavaScript**:

```javascript
// Old way (deprecated)
window.MASE.settings.colors.primary = '#ff0000';
jQuery.ajax({
  url: ajaxurl,
  data: { action: 'mase_save_settings' }
});

// New way (recommended)
import { useStore } from './modules/state-manager.js';
import { apiClient } from './modules/api-client.js';

useStore.getState().updateSettings('colors.primary', '#ff0000');
await apiClient.saveSettings(settings);
```

**If you have custom PHP hooks**:

```php
// Old way (still works, but deprecated)
add_action('mase_before_save', 'my_custom_function');

// New way (recommended)
add_action('mase_rest_before_save', 'my_custom_function');
```

## Testing During Migration

### Pre-Migration Testing

**Before each phase**:

1. **Run complete test suite**:
   ```bash
   npm run test
   ```

2. **Manual testing checklist**:
   - [ ] Load admin page
   - [ ] Change color settings
   - [ ] Preview updates correctly
   - [ ] Save settings
   - [ ] Reload page, verify persistence
   - [ ] Apply template
   - [ ] Apply palette
   - [ ] Change typography
   - [ ] Test undo/redo
   - [ ] Test reset to defaults

3. **Performance baseline**:
   ```bash
   npm run test:performance
   ```
   - Record metrics for comparison

4. **Browser compatibility**:
   - Test in Chrome, Firefox, Safari
   - Test on Windows, Mac, Linux

### During Migration Testing

**After enabling feature flag**:

1. **Smoke tests** (< 5 minutes):
   - Load admin page
   - Change one setting
   - Verify preview updates
   - Save and reload

2. **Regression tests** (< 15 minutes):
   - Run automated test suite
   - Check for new errors in console
   - Verify no visual differences

3. **Performance tests** (< 10 minutes):
   - Compare metrics to baseline
   - Check for performance regressions
   - Verify targets met

### Post-Migration Testing

**After phase completion**:

1. **Full test suite**:
   ```bash
   npm run test
   npm run test:e2e
   ```

2. **Extended manual testing**:
   - Test all workflows
   - Test edge cases
   - Test error scenarios
   - Test with different user roles

3. **Performance validation**:
   - Run Lighthouse audits
   - Profile JavaScript execution
   - Check memory usage
   - Verify bundle sizes

4. **User acceptance testing**:
   - Have team members test
   - Collect feedback
   - Address issues before wider rollout

## Monitoring and Validation

### Error Monitoring

**JavaScript Errors**:
```javascript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service
  if (window.errorTracker) {
    errorTracker.captureException(event.error);
  }
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  if (window.errorTracker) {
    errorTracker.captureException(event.reason);
  }
});
```

**PHP Errors**:
```php
// Enable error logging
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Monitor debug.log
tail -f wp-content/debug.log
```

### Performance Monitoring

**Key Metrics**:
- Initial load time
- Preview update latency
- API response times
- Memory usage
- Bundle sizes

**Monitoring Tools**:
- Lighthouse CI for automated audits
- Chrome DevTools Performance profiler
- WordPress Query Monitor plugin
- Custom performance logging

**Performance Logging**:
```javascript
// Log performance metrics
performance.mark('preview-start');
previewEngine.generateCSS(settings);
performance.mark('preview-end');
performance.measure('preview-generation', 'preview-start', 'preview-end');

const measure = performance.getEntriesByName('preview-generation')[0];
console.log('Preview generation took:', measure.duration, 'ms');
```

### User Feedback

**Collect Feedback**:
- Add feedback form in admin
- Monitor support tickets
- Check user reviews
- Conduct user surveys

**Feedback Channels**:
- WordPress admin notice with feedback link
- Support email
- GitHub issues
- User forum

### Success Criteria

**Phase is successful when**:
- ✅ All automated tests pass
- ✅ No increase in error rate
- ✅ Performance targets met
- ✅ No user-reported critical bugs
- ✅ Positive user feedback
- ✅ Team approval to proceed

**Phase requires rollback when**:
- ❌ Error rate exceeds 5%
- ❌ Performance degrades > 20%
- ❌ Critical functionality broken
- ❌ Data loss or corruption
- ❌ Multiple user complaints
- ❌ Security vulnerability discovered

## Communication Plan

### Internal Communication

**Before each phase**:
- Team meeting to review plan
- Document expected changes
- Assign responsibilities
- Schedule deployment time

**During deployment**:
- Real-time updates in team chat
- Monitor error logs together
- Quick decision-making on issues

**After deployment**:
- Post-mortem meeting
- Document lessons learned
- Update migration guide
- Plan next phase

### User Communication

**For major phases**:
- Advance notice (1 week)
- Clear explanation of changes
- Expected benefits
- How to report issues

**During issues**:
- Transparent status updates
- Estimated resolution time
- Workarounds if available
- Apology for inconvenience

**After resolution**:
- Explanation of what happened
- What was done to fix it
- Steps to prevent recurrence
- Thank users for patience

## Conclusion

This migration guide provides a comprehensive roadmap for transitioning from the legacy monolithic architecture to the modern modular system. By following the phased approach with feature flags, we can migrate incrementally with minimal risk and instant rollback capability.

**Key Takeaways**:
- Migration is incremental, not all-at-once
- Feature flags enable instant rollback
- Comprehensive testing at each phase
- User experience remains consistent
- Documentation and communication are critical

**Current Status**: Phase 7 (Documentation) in progress

**Next Steps**: Complete documentation, final testing, production deployment

For questions or issues during migration, contact the development team or refer to the [Developer Guide](./DEVELOPER-GUIDE.md).
