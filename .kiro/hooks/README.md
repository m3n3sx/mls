# MASE Agent Hooks v3.0

Automated validation and monitoring hooks for MASE v1.2.0 development with Kiro.

## 📋 Overview

These hooks provide automatic checkpoints and validation during development to ensure code quality, security, performance, and maintainability.

## 🎯 Available Hooks

### Pre-Commit Hooks (Before Changes)

#### `before-file-create.kiro.hook`
**Trigger:** beforeFileCreate  
**Purpose:** Validate before creating new file

**Checks:**
- File count against 20 file limit
- File naming convention
- File doesn't already exist
- No similar files (avoid duplication)
- Correct directory location

#### `before-method-add.kiro.hook`
**Trigger:** beforeMethodAdd  
**Purpose:** Validate before adding method to class

**Checks:**
- Method count against 10 method limit
- Method naming convention
- No similar methods exist
- Single responsibility maintained
- Parameter count ≤5

### Validation Hooks (Automatic - On Save)

#### `validate-file-size.kiro.hook`
**Trigger:** On file save  
**Purpose:** Prevent files from exceeding 500 line limit

**Thresholds:**
- 300 lines: ℹ️ INFO
- 400 lines: ⚠️ WARNING
- 450 lines: 🚨 URGENT
- 500 lines: ❌ FAIL (blocks commit)

#### `validate-security.kiro.hook`
**Trigger:** On PHP file save  
**Purpose:** Ensure security best practices

**Checks:**
- Nonce verification on AJAX
- Capability checks
- Input sanitization
- Output escaping
- No SQL injection risks

#### `validate-performance.kiro.hook`
**Trigger:** On file save  
**Purpose:** Prevent performance issues

**Checks:**
- No N+1 query problems
- Caching implemented
- Efficient algorithms
- Memory usage

#### `validate-naming.kiro.hook`
**Trigger:** On file save  
**Purpose:** Maintain naming conventions

**Conventions:**
- PHP Classes: `MASE_PascalCase`
- PHP Methods: `snake_case`
- PHP Variables: `$snake_case`
- PHP Constants: `SCREAMING_SNAKE_CASE`
- JS Objects: `PascalCase`
- JS Variables: `camelCase`
- CSS Classes: `.mase-kebab-case`

#### `validate-test-coverage.kiro.hook`
**Trigger:** On PHP file save  
**Purpose:** Ensure adequate test coverage (≥70%)

**Checks:**
- Test file exists
- All public methods tested
- Coverage meets threshold

### Monitoring Hooks (Continuous)

#### `monitor-file-count.kiro.hook`
**Trigger:** On workspace change  
**Purpose:** Track file count against 20 file limit

**Thresholds:**
- 0-14 files: ✅ HEALTHY
- 15-17 files: ℹ️ MONITOR
- 18-19 files: ⚠️ WARNING
- 20 files: 🚨 CRITICAL

### Post-Commit Hooks (After Changes)

#### `after-file-create.kiro.hook`
**Trigger:** afterFileCreate  
**Purpose:** Validate file completeness after creation

**Checks:**
- ABSPATH check present
- File and class docblocks
- Class naming convention
- Required methods implemented
- Security checks in place
- Test file created
- Autoloader compatibility

#### `after-method-add.kiro.hook`
**Trigger:** afterMethodAdd  
**Purpose:** Validate method integration after addition

**Checks:**
- Method docblock complete
- Error handling implemented
- Security checks (if public)
- Unit test exists
- Method is called/used
- Performance acceptable

#### `after-feature-complete.kiro.hook`
**Trigger:** afterFeatureComplete  
**Purpose:** Comprehensive production readiness check

**Checks:**
- All files under size limits
- Code quality standards
- Security audit passed
- Performance acceptable
- Tests passing (≥70% coverage)
- Documentation complete
- Browser compatibility
- Accessibility compliance
- Manual testing done

### Manual Hooks

#### `before-commit-checklist.kiro.hook`
**Trigger:** manual  
**Purpose:** Comprehensive pre-commit validation

**Checks:**
- Code quality
- Security
- Performance
- Testing
- Documentation
- WordPress standards

## 🚀 Usage

### Automatic Hooks

Automatic hooks run when you save files. No action needed.

### Manual Hooks

Run before committing:

```bash
# Run pre-commit checklist
kiro hook run before-commit-checklist

# Run specific validation
kiro hook run validate-security includes/class-mase-admin.php

# Run all hooks for a file
kiro hook run-all includes/class-mase-settings.php
```

### In Kiro Chat

You can also trigger hooks via chat:

```
Run security validation on class-mase-admin.php
```

```
Check file count status
```

```
Run pre-commit checklist
```

## 📊 Reports

### Daily Report

Automatically generated at 18:00 (configurable):

```
📊 DAILY HOOK REPORT - 2025-01-18

Files Changed: 3
Hook Triggers: 47
✅ Passed: 42
⚠️ Warnings: 5
❌ Failed: 0

Performance:
✅ CSS generation: 67ms
✅ Memory usage: 45MB

Test Coverage: 74% ✅

Next Actions:
1. Refactor class-mase-palette-manager.php
2. Add missing test
```

### Feature Complete Report

Generated when feature is complete:

```
✅ PASS: Palette Manager feature complete

Files (3 total):
✅ class-mase-palette-manager.php (287 lines)
✅ class-mase-palette-generator.php (198 lines)
✅ palette-grid-component.php (156 lines)

Tests: 12/12 passing ✅
Coverage: 78% ✅
Security: No vulnerabilities ✅
Performance: All targets met ✅

Status: READY FOR REVIEW
```

## ⚙️ Configuration

Edit `.kiro/hooks-config.yml` to customize:

```yaml
hooks:
  validation:
    validate_file_size:
      enabled: true
      thresholds:
        warning: 400
        fail: 500
```

### Enable/Disable Hooks

```yaml
hooks:
  validation:
    validate_security:
      enabled: false  # Disable this hook
```

### Adjust Thresholds

```yaml
thresholds:
  file_size:
    warning: 350  # Lower threshold
    fail: 450     # Lower limit
```

## 🚨 Alerts

### Critical Alerts

Hooks can block commits for critical issues:

#### Architecture Limit Reached
```
🚨 CRITICAL: File count at limit (20/20)
CANNOT ADD MORE FILES WITHOUT REFACTORING
```

#### Security Vulnerability
```
🚨 CRITICAL: Missing capability check
File: class-mase-admin.php
Line: 234
Status: BLOCK COMMIT UNTIL FIXED
```

#### Performance Degradation
```
⚠️ HIGH: CSS generation time increased 116%
Current: 145ms (was: 67ms)
Threshold: 100ms exceeded by 45ms
```

## 📖 Hook Development

### Creating New Hooks

1. Create `.kiro.hook` file in `.kiro/hooks/`
2. Define trigger and file pattern
3. Write validation prompt
4. Add to `hooks-config.yml`

Example:

```json
{
  "name": "my-custom-hook",
  "description": "Custom validation",
  "version": "1.0.0",
  "trigger": "onFileSave",
  "filePattern": "**/*.php",
  "enabled": true,
  "prompt": "Your validation prompt here..."
}
```

## 🔧 Troubleshooting

### Hook Not Running

1. Check if enabled in `hooks-config.yml`
2. Verify file pattern matches
3. Check Kiro logs

### False Positives

1. Review hook configuration
2. Adjust thresholds if needed
3. Add exceptions in config

### Performance Issues

1. Disable non-critical hooks
2. Adjust trigger frequency
3. Optimize hook prompts

## 📚 Best Practices

1. **Run before-commit-checklist** before every commit
2. **Address warnings immediately** - don't accumulate
3. **Review daily reports** to track trends
4. **Adjust thresholds** based on project needs
5. **Keep hooks updated** with project evolution

## 🔗 Related Documentation

- [MASE Development Guide](../.kiro/steering/steering.md)
- [Agent Hooks Specification](./AGENT-HOOKS-SPEC.md)
- [Hooks Configuration](../hooks-config.yml)

## 📝 Version History

- **v3.0.0** (2025-01-18): Initial Kiro integration
  - 7 validation hooks
  - 1 monitoring hook
  - 1 pre-commit hook
  - Comprehensive configuration

## 🤝 Contributing

To add new hooks:

1. Follow hook template
2. Add to hooks-config.yml
3. Document in this README
4. Test thoroughly
5. Submit for review

---

**Version:** 3.0.0  
**Last Updated:** 2025-01-18  
**Maintainer:** MASE Development Team
