# MASE Accessibility Audit Test

Automated accessibility testing using axe-core to verify WCAG 2.1 Level AA compliance.

## Overview

This test uses axe-core (the industry-standard accessibility testing engine) to audit the MASE settings page for accessibility violations. It tests both Light and Dark modes to ensure comprehensive coverage.

## Requirements Coverage

- **Requirement 10.3**: Automated accessibility testing with axe-core
- **Requirement 10.4**: WCAG 2.1 Level AA compliance verification

## Bug Fixes Verified

- **MASE-ACC-001**: Live Preview Toggle aria-checked synchronization
- **MASE-DARK-001**: Dark Mode visual accessibility (no obstructions)

## What It Tests

### WCAG 2.1 Standards

- **Level A**: Basic accessibility requirements
- **Level AA**: Enhanced accessibility requirements (target compliance level)

### Specific Checks

1. **Keyboard Navigation**
   - All interactive elements are keyboard accessible
   - Tab order is logical
   - No keyboard traps

2. **ARIA Attributes**
   - Valid ARIA roles
   - Proper ARIA labels
   - Correct ARIA states (checked, expanded, etc.)

3. **Color Contrast**
   - Text meets 4.5:1 contrast ratio
   - Large text meets 3:1 contrast ratio
   - UI components meet 3:1 contrast ratio

4. **Semantic HTML**
   - Proper heading hierarchy
   - Landmark regions
   - Form labels

5. **Focus Indicators**
   - Visible focus indicators
   - Sufficient contrast for focus states

6. **Screen Reader Support**
   - Alternative text for images
   - Descriptive link text
   - Form field labels

## Usage

### Quick Start

```bash
# Run the test
./run-axe-audit.sh

# Or run directly with Node.js
node axe-audit-test.js
```

### Prerequisites

1. **WordPress Environment**: Running at `http://localhost`
2. **MASE Plugin**: Installed and activated
3. **Node.js**: Version 14 or higher
4. **Playwright**: Installed (auto-installed by script)

### Test Workflow

1. **Login**: Authenticates to WordPress admin
2. **Navigate**: Goes to MASE settings page
3. **Inject axe-core**: Loads axe-core library from CDN
4. **Light Mode Audit**: Runs full accessibility audit
5. **Enable Dark Mode**: Toggles Dark Mode on
6. **Dark Mode Audit**: Runs audit again in Dark Mode
7. **Bug Fix Verification**: Tests specific bug fixes
8. **Generate Report**: Creates HTML and JSON reports

## Output

### Console Output

```
♿ Starting MASE Accessibility Audit Test...

🔐 Logging in to WordPress...
✓ Logged in successfully

📍 Navigating to MASE settings page...
✓ MASE settings page loaded

💉 Injecting axe-core library...
✓ axe-core injected successfully

🔍 Running accessibility audit in Light Mode...
  Violations: 0
  Passes: 47
  Incomplete: 2

  ✓ No violations in Light Mode

🌙 Enabling Dark Mode...
✓ Dark Mode enabled

🔍 Running accessibility audit in Dark Mode...
  Violations: 0
  Passes: 47
  Incomplete: 2

  ✓ No violations in Dark Mode

🐛 Verifying specific bug fixes...
  Testing MASE-ACC-001: Live Preview Toggle aria-checked...
    ✓ Live Preview toggle aria-checked synchronizes correctly

✅ TEST PASSED: 0 accessibility violations found

📊 Generating accessibility report...
✓ HTML Report: tests/accessibility/reports/accessibility-audit-1234567890.html
✓ JSON Results: tests/accessibility/reports/accessibility-audit-1234567890.json
```

### HTML Report

The test generates a comprehensive HTML report with:

- **Summary Dashboard**: Total violations by severity
- **Light Mode Results**: Detailed violations in Light Mode
- **Dark Mode Results**: Detailed violations in Dark Mode
- **Bug Fix Verification**: Status of specific bug fixes
- **Violation Details**: 
  - Description and help text
  - WCAG criteria violated
  - Affected HTML elements
  - Remediation guidance

### JSON Report

Machine-readable JSON output for CI/CD integration:

```json
{
  "timestamp": "2025-10-19T20:00:00.000Z",
  "testName": "MASE Accessibility Audit",
  "status": "PASSED",
  "summary": {
    "totalViolations": 0,
    "criticalViolations": 0,
    "seriousViolations": 0,
    "moderateViolations": 0,
    "minorViolations": 0
  },
  "audits": [...]
}
```

## Violation Severity Levels

### Critical
- Blocks access for users with disabilities
- Must be fixed immediately
- Examples: Missing alt text, keyboard traps

### Serious
- Significantly impacts accessibility
- Should be fixed soon
- Examples: Poor color contrast, missing labels

### Moderate
- Noticeable accessibility issues
- Should be addressed
- Examples: Suboptimal heading hierarchy

### Minor
- Minor accessibility improvements
- Nice to have
- Examples: Missing lang attribute on elements

## Integration with CI/CD

### Exit Codes

- `0`: All tests passed (0 violations)
- `1`: Tests failed (violations found) or error occurred

### Example GitHub Actions

```yaml
- name: Run Accessibility Audit
  run: |
    cd tests/accessibility
    ./run-axe-audit.sh
```

### Example GitLab CI

```yaml
accessibility-audit:
  script:
    - cd tests/accessibility
    - ./run-axe-audit.sh
  artifacts:
    paths:
      - tests/accessibility/reports/
    when: always
```

## Troubleshooting

### Test Fails to Connect

**Problem**: Cannot connect to WordPress

**Solution**:
```bash
# Check if WordPress is running
curl http://localhost/wp-admin/

# Start WordPress if needed
docker-compose up -d
```

### axe-core Not Loading

**Problem**: axe-core fails to inject

**Solution**:
- Check internet connection (CDN access required)
- Or download axe-core locally and modify script

### Login Fails

**Problem**: Cannot login to WordPress

**Solution**:
- Verify credentials in test file (default: admin/admin123)
- Update credentials if different:
  ```javascript
  await page.fill('#user_login', 'your-username');
  await page.fill('#user_pass', 'your-password');
  ```

### Violations Found

**Problem**: Test reports accessibility violations

**Solution**:
1. Open HTML report to see details
2. Review each violation's description and help text
3. Fix the issues in MASE code
4. Re-run the test to verify fixes

## Best Practices

### When to Run

- **Before Commits**: Catch issues early
- **Before Releases**: Ensure compliance
- **After UI Changes**: Verify no regressions
- **Regular Schedule**: Weekly or monthly audits

### Interpreting Results

1. **Focus on Critical/Serious**: Fix high-impact issues first
2. **Check All Modes**: Test both Light and Dark modes
3. **Verify Fixes**: Re-run after making changes
4. **Document Exceptions**: If violations can't be fixed, document why

### Maintaining Tests

- **Update axe-core**: Keep library version current
- **Add New Checks**: Test new features as added
- **Review Incomplete**: Investigate items marked "incomplete"
- **Monitor Trends**: Track violation counts over time

## Related Tests

- **aria-checked-test.js**: Specific test for toggle synchronization
- **dark-mode-circle-test.js**: Visual test for Dark Mode
- **automated-accessibility-tests.js**: Comprehensive accessibility suite

## Resources

- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Playwright Documentation](https://playwright.dev/)
- [MASE Requirements Document](../../.kiro/specs/critical-bugs-fix/requirements.md)

## Support

For issues or questions:
1. Check the HTML report for detailed violation information
2. Review WCAG guidelines for remediation guidance
3. Consult axe-core documentation for rule details
4. Open an issue in the MASE repository
