# Production Deployment Checklist

**Task 22: Production deployment**  
**Requirements: 2.3, 2.5, 10.3, 15.1, 15.2, 15.3, 15.4**

This checklist ensures a safe and successful production deployment of the modernized MASE architecture.

## Pre-Deployment Checklist

### Task 22.1: Create Production Build

- [ ] **Clean Environment**
  ```bash
  rm -rf dist node_modules
  npm install
  ```

- [ ] **Run Code Quality Checks**
  ```bash
  npm run lint
  npm run format:check
  ```

- [ ] **Run Full Test Suite**
  ```bash
  npm run test
  npm run test:coverage
  npm run test:e2e
  ```

- [ ] **Build Production Bundle**
  ```bash
  npm run build
  # or use comprehensive script:
  npm run build:production
  ```

- [ ] **Verify Bundle Sizes**
  ```bash
  npm run check-size
  ```
  - Core bundle: < 30KB ✓
  - Preview bundle: < 40KB ✓
  - Feature bundles: < 30KB each ✓
  - Total: < 100KB ✓

- [ ] **Test Production Build Locally**
  ```bash
  npm run test:production
  ```

- [ ] **Review Build Reports**
  - Check `dist/BUILD_REPORT.txt`
  - Check `dist/TEST_REPORT.txt`
  - Verify all artifacts present

- [ ] **Manual Testing in Local WordPress**
  - Install build in local WordPress
  - Test all core functionality
  - Verify no console errors
  - Check network requests
  - Test on different browsers

### Task 22.2: Deploy with Feature Flags Disabled

- [ ] **Backup Production Database**
  ```bash
  # Create database backup before deployment
  wp db export backup-$(date +%Y%m%d-%H%M%S).sql
  ```

- [ ] **Backup Production Files**
  ```bash
  # Create plugin backup
  tar -czf mase-backup-$(date +%Y%m%d-%H%M%S).tar.gz modern-admin-styler/
  ```

- [ ] **Verify Feature Flags Configuration**
  - Check `includes/class-mase-feature-flags.php`
  - Ensure all modern features are disabled by default:
    ```php
    'MASE_MODERN_PREVIEW' => false,
    'MASE_MODERN_STATE' => false,
    'MASE_MODERN_API' => false,
    'MASE_MODERN_EVENTS' => false,
    ```

- [ ] **Deploy to Production**
  ```bash
  # Upload plugin files
  # - Upload dist/ directory
  # - Upload includes/ directory
  # - Upload assets/ directory
  # - Upload modern-admin-styler.php
  ```

- [ ] **Verify Legacy Functionality**
  - Test color palette changes
  - Test template application
  - Test settings save/load
  - Test typography changes
  - Test all admin tabs
  - Verify no JavaScript errors

- [ ] **Monitor Initial Deployment**
  - Check error logs: `tail -f wp-content/debug.log`
  - Monitor browser console for errors
  - Check network requests
  - Verify page load times

- [ ] **User Acceptance Testing**
  - Have admin users test core workflows
  - Collect feedback on any issues
  - Document any unexpected behavior

### Task 22.3: Gradual Feature Rollout

#### Phase 1: Preview Engine (10% of users)

- [ ] **Enable for Test Group**
  ```php
  // In WordPress admin or via code
  update_option('mase_feature_flags', [
      'MASE_MODERN_PREVIEW' => true,  // Enable for 10%
      'MASE_MODERN_STATE' => false,
      'MASE_MODERN_API' => false,
      'MASE_MODERN_EVENTS' => false,
  ]);
  ```

- [ ] **Implement Percentage Rollout**
  ```php
  // Add to class-mase-feature-flags.php
  public function should_enable_for_user($feature) {
      $user_id = get_current_user_id();
      $rollout_percentage = $this->get_rollout_percentage($feature);
      $user_hash = crc32($user_id . $feature) % 100;
      return $user_hash < $rollout_percentage;
  }
  ```

- [ ] **Monitor Preview Engine (24-48 hours)**
  - Error rate < 1% ✓
  - Performance within 10% of baseline ✓
  - No critical bugs reported ✓
  - User feedback positive ✓

- [ ] **Collect Metrics**
  - CSS generation time
  - Preview update latency
  - JavaScript errors
  - User feedback

#### Phase 2: Preview Engine (50% of users)

- [ ] **Increase Rollout**
  ```php
  // Increase to 50%
  $this->set_rollout_percentage('MASE_MODERN_PREVIEW', 50);
  ```

- [ ] **Monitor (24-48 hours)**
  - Error rate stable ✓
  - Performance stable ✓
  - No new issues ✓

#### Phase 3: Preview Engine (100% of users)

- [ ] **Full Rollout**
  ```php
  update_option('mase_feature_flags', [
      'MASE_MODERN_PREVIEW' => true,  // 100%
  ]);
  ```

- [ ] **Monitor (48-72 hours)**
  - Verify all users on modern preview
  - Check for any edge cases
  - Collect final feedback

#### Phase 4: Remaining Features

- [ ] **Enable State Manager (10% → 50% → 100%)**
  - Follow same rollout process
  - Monitor state persistence
  - Test undo/redo functionality

- [ ] **Enable API Client (10% → 50% → 100%)**
  - Monitor API requests
  - Check error handling
  - Verify retry logic

- [ ] **Enable Event Bus (10% → 50% → 100%)**
  - Monitor event flow
  - Check module communication
  - Verify error isolation

### Task 22.4: Monitor and Respond to Issues

#### Error Tracking Setup

- [ ] **Configure Error Logging**
  ```php
  // In wp-config.php
  define('WP_DEBUG', true);
  define('WP_DEBUG_LOG', true);
  define('WP_DEBUG_DISPLAY', false);
  ```

- [ ] **Setup Error Monitoring Service** (Optional)
  - Sentry, Rollbar, or similar
  - Configure JavaScript error tracking
  - Configure PHP error tracking

- [ ] **Create Monitoring Dashboard**
  - Error rate by feature
  - Performance metrics
  - User feedback
  - Rollback triggers

#### Monitoring Metrics

- [ ] **Performance Metrics**
  - Initial load time: < 200ms on 3G ✓
  - Preview update: < 50ms ✓
  - API response time: < 500ms ✓
  - Memory usage: No leaks ✓

- [ ] **Error Metrics**
  - JavaScript errors: < 1% of page loads ✓
  - API errors: < 2% of requests ✓
  - State errors: < 0.5% of updates ✓

- [ ] **User Metrics**
  - User feedback: Positive ✓
  - Support tickets: No increase ✓
  - Feature usage: Normal patterns ✓

#### Rollback Procedures

- [ ] **Prepare Rollback Plan**
  ```bash
  # Quick rollback script
  #!/bin/bash
  # 1. Disable feature flags
  wp option update mase_feature_flags '{"MASE_MODERN_PREVIEW":false}'
  
  # 2. Clear caches
  wp cache flush
  
  # 3. Restore backup if needed
  # tar -xzf mase-backup-YYYYMMDD-HHMMSS.tar.gz
  ```

- [ ] **Rollback Triggers**
  - Error rate > 5% for any feature
  - Performance degradation > 20%
  - Critical functionality broken
  - Multiple user complaints

- [ ] **Rollback Execution**
  1. Disable affected feature flag immediately
  2. Clear all caches
  3. Notify users of temporary rollback
  4. Investigate root cause
  5. Fix issue in development
  6. Re-test thoroughly
  7. Re-deploy with fix

#### Issue Response Workflow

- [ ] **Critical Issues (P0)**
  - Response time: < 1 hour
  - Resolution time: < 4 hours
  - Action: Immediate rollback if needed

- [ ] **High Priority Issues (P1)**
  - Response time: < 4 hours
  - Resolution time: < 24 hours
  - Action: Disable feature if widespread

- [ ] **Medium Priority Issues (P2)**
  - Response time: < 24 hours
  - Resolution time: < 1 week
  - Action: Fix in next release

- [ ] **Low Priority Issues (P3)**
  - Response time: < 1 week
  - Resolution time: < 1 month
  - Action: Add to backlog

## Post-Deployment Checklist

### Week 1

- [ ] **Daily Monitoring**
  - Check error logs daily
  - Review performance metrics
  - Monitor user feedback
  - Track feature adoption

- [ ] **User Communication**
  - Announce new features (if visible)
  - Provide documentation updates
  - Collect user feedback

### Week 2-4

- [ ] **Weekly Review**
  - Analyze error trends
  - Review performance data
  - Assess feature adoption
  - Plan next rollout phase

### Month 1

- [ ] **Comprehensive Review**
  - Full performance audit
  - User satisfaction survey
  - Technical debt assessment
  - Plan for legacy code removal (Task 23)

## Success Criteria

### Technical Success

- ✅ All bundles meet size targets
- ✅ Performance meets or exceeds baseline
- ✅ Error rate < 1%
- ✅ All tests passing
- ✅ No critical bugs

### User Success

- ✅ No increase in support tickets
- ✅ Positive user feedback
- ✅ No workflow disruptions
- ✅ Feature adoption growing

### Business Success

- ✅ Zero downtime deployment
- ✅ Smooth rollout process
- ✅ Foundation for future features
- ✅ Technical debt reduced

## Rollback Decision Matrix

| Metric | Green | Yellow | Red (Rollback) |
|--------|-------|--------|----------------|
| Error Rate | < 1% | 1-5% | > 5% |
| Performance | < 10% slower | 10-20% slower | > 20% slower |
| User Feedback | Positive | Mixed | Negative |
| Critical Bugs | 0 | 1-2 minor | 1+ critical |

## Contact Information

**Deployment Team:**
- Lead Developer: [Name]
- DevOps: [Name]
- QA Lead: [Name]

**Emergency Contacts:**
- On-call Developer: [Phone]
- System Admin: [Phone]

## Documentation

- Architecture: `docs/ARCHITECTURE.md`
- Migration Guide: `docs/MIGRATION-GUIDE.md`
- Troubleshooting: `docs/TROUBLESHOOTING-GUIDE.md`
- User Guide: `docs/USER-GUIDE.md`

## Notes

- Keep this checklist updated with lessons learned
- Document any deviations from the plan
- Share feedback with the team
- Celebrate successful milestones! 🎉
