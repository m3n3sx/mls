# MASE Deployment Scripts

This directory contains scripts for building, deploying, and monitoring the MASE plugin in production.

## Production Build Scripts

### `production-build.sh`
Comprehensive production build script with quality checks.

**Usage**:
```bash
./scripts/production-build.sh
# or
npm run build:production
```

**Features**:
- Verifies prerequisites (Node.js, npm)
- Cleans previous builds
- Installs dependencies
- Runs linting and formatting checks
- Executes full test suite
- Builds optimized production bundle
- Verifies bundle sizes
- Validates build artifacts
- Generates build report

**Output**:
- `dist/` - Production bundles
- `dist/BUILD_REPORT.txt` - Build details

---

### `test-production-build.sh`
Tests and validates the production build locally.

**Usage**:
```bash
./scripts/test-production-build.sh
# or
npm run test:production
```

**Features**:
- Validates manifest.json structure
- Checks file integrity
- Tests module loading
- Verifies performance metrics
- Generates test report

**Output**:
- `dist/TEST_REPORT.txt` - Test results

---

### `check-bundle-size.js`
Validates that bundle sizes meet targets.

**Usage**:
```bash
node scripts/check-bundle-size.js
# or
npm run check-size
```

**Targets**:
- Core bundle: < 30KB
- Preview bundle: < 40KB
- Feature bundles: < 30KB each
- Total: < 100KB

---

## Deployment Scripts

### `deploy-production.sh`
Safely deploys MASE to production with feature flags disabled.

**Usage**:
```bash
./scripts/deploy-production.sh
# or
npm run deploy
```

**Features**:
- Creates automatic backups (files + database)
- Verifies feature flags are disabled
- Deploys plugin files
- Clears caches
- Verifies deployment success
- Tests legacy functionality
- Generates deployment report

**Safety**:
- All modern features disabled by default
- Legacy fallback enabled
- Automatic backup before deployment
- Rollback capability

**Output**:
- `backups/` - Backup files
- `deployment-report-*.txt` - Deployment details

---

### `gradual-rollout.sh`
Manages gradual rollout of modern features with percentage-based enablement.

**Usage**:
```bash
./scripts/gradual-rollout.sh
# or
npm run rollout
```

**Interactive Menu**:
1. Show current status
2. Rollout Preview Engine (10% → 50% → 100%)
3. Rollout State Manager (10% → 50% → 100%)
4. Rollout API Client (10% → 50% → 100%)
5. Rollout remaining features
6. Full automated rollout (all phases)
7. Generate report
8. Exit

**Command Line Options**:
```bash
./scripts/gradual-rollout.sh --status    # Show current status
./scripts/gradual-rollout.sh --report    # Generate report
./scripts/gradual-rollout.sh --auto      # Automated rollout
```

**Features**:
- Percentage-based rollout (10% → 50% → 100%)
- Consistent user hashing
- Automated monitoring during rollout
- Automatic rollback on issues
- Rollout status reporting

---

### `monitor-deployment.sh`
Real-time monitoring and automatic rollback for production deployment.

**Usage**:
```bash
./scripts/monitor-deployment.sh
# or
npm run deploy:monitor
```

**Interactive Menu**:
1. Show current status
2. Start monitoring
3. Generate report
4. Trigger manual rollback
5. Exit

**Command Line Options**:
```bash
./scripts/monitor-deployment.sh --monitor   # Start monitoring
./scripts/monitor-deployment.sh --status    # Show status
./scripts/monitor-deployment.sh --report    # Generate report
./scripts/monitor-deployment.sh --rollback "reason"  # Manual rollback
```

**Features**:
- Real-time error rate monitoring
- Performance metrics tracking
- Automatic rollback triggers
- Manual rollback capability
- Monitoring reports
- Alert notifications

**Automatic Rollback Triggers**:
- Error rate > 5%
- Critical errors detected
- Performance degradation > 20%
- Multiple user complaints

---

## Quick Reference

### Complete Deployment Workflow

```bash
# 1. Build production bundle
npm run build:production

# 2. Test production build
npm run test:production

# 3. Deploy to production
npm run deploy

# 4. Start monitoring
npm run deploy:monitor

# 5. Begin gradual rollout
npm run rollout

# 6. Check status
npm run deploy:status
```

### Emergency Rollback

```bash
# Quick rollback
npm run deploy:rollback

# Or manually
./scripts/monitor-deployment.sh --rollback "Emergency rollback reason"
```

### Check Current Status

```bash
# Deployment status
npm run deploy:status

# Rollout status
npm run rollout:status
```

## NPM Scripts

All scripts are available as npm commands:

```json
{
  "build:production": "bash scripts/production-build.sh",
  "test:production": "bash scripts/test-production-build.sh",
  "build:full": "npm run build:production && npm run test:production",
  "deploy": "bash scripts/deploy-production.sh",
  "deploy:monitor": "bash scripts/monitor-deployment.sh --monitor",
  "deploy:status": "bash scripts/monitor-deployment.sh --status",
  "deploy:rollback": "bash scripts/monitor-deployment.sh --rollback",
  "rollout": "bash scripts/gradual-rollout.sh",
  "rollout:status": "bash scripts/gradual-rollout.sh --status"
}
```

## Prerequisites

### Required
- **Node.js**: v16+ (for build scripts)
- **npm**: v8+ (for package management)
- **Bash**: v4+ (for shell scripts)

### Optional but Recommended
- **WP-CLI**: For WordPress operations (deployment, monitoring)
- **Python 3**: For JSON processing in scripts

### Installation

```bash
# Install Node.js dependencies
npm install

# Make scripts executable
chmod +x scripts/*.sh

# Install WP-CLI (optional)
# See: https://wp-cli.org/
```

## Configuration

### Environment Variables

```bash
# WordPress installation path (for deployment scripts)
export WORDPRESS_PATH="/path/to/wordpress"

# Monitoring interval (seconds)
export MONITOR_INTERVAL=60

# Error threshold (percentage)
export ERROR_THRESHOLD=5

# Performance threshold (percentage)
export PERF_THRESHOLD=20
```

### Feature Flags

Feature flags are managed via WordPress options:
- `mase_feature_flags` - Feature enable/disable
- `mase_feature_rollout_percentages` - Rollout percentages

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build:production
```

### Deployment Issues

```bash
# Check prerequisites
./scripts/deploy-production.sh

# Verify WordPress path
echo $WORDPRESS_PATH

# Check WP-CLI
wp --info
```

### Monitoring Issues

```bash
# Check logs
tail -f wp-content/debug.log

# Verify feature flags
wp option get mase_feature_flags --format=json

# Check rollout percentages
wp option get mase_feature_rollout_percentages --format=json
```

### Rollback Not Working

```bash
# Manual rollback
wp option update mase_feature_flags '{
    "modern_preview_engine": false,
    "legacy_fallback": true
}' --format=json

wp cache flush
```

## Documentation

- **Deployment Checklist**: `docs/DEPLOYMENT-CHECKLIST.md`
- **Issue Response Workflow**: `docs/ISSUE-RESPONSE-WORKFLOW.md`
- **Deployment Summary**: `docs/DEPLOYMENT-SUMMARY.md`
- **Troubleshooting Guide**: `docs/TROUBLESHOOTING-GUIDE.md`

## Support

For issues or questions:
1. Check documentation in `docs/`
2. Review troubleshooting guide
3. Check error logs
4. Contact development team

---

**Note**: Always test in staging environment before production deployment!
