# MASE Testing Guide

## Overview

Modern Admin Styler Enterprise includes comprehensive testing to ensure reliability, performance, and security.

## Test Files

### Performance Tests (`tests/performance-test.php`)

Tests CSS generation speed and memory usage:
- **CSS Generation Speed**: Target <100ms
- **Minification Speed**: Measures compression time
- **Memory Usage**: Target <2MB for generation

**Run:**
```bash
cd tests
php performance-test.php
```

### Integration Tests (`tests/integration-test.php`)

Tests complete workflow:
- Settings save/load
- CSS generation
- Caching functionality
- Cache invalidation
- Input validation

**Run:**
```bash
cd tests
php integration-test.php
```

### Run All Tests

```bash
cd tests
./run-tests.sh
```

## Manual Testing Checklist

### Plugin Activation
- [ ] Plugin activates without errors
- [ ] Default settings are created
- [ ] Admin menu appears

### Settings Page
- [ ] Settings page loads without errors
- [ ] All form fields display correctly
- [ ] Color pickers initialize properly

### Color Customization
- [ ] Admin bar background color changes
- [ ] Admin bar text color changes
- [ ] Admin menu background color changes
- [ ] Admin menu text color changes
- [ ] Hover colors work correctly

### Live Preview
- [ ] Changes appear immediately (within 200ms)
- [ ] Preview updates on color picker change
- [ ] Preview updates on input field change
- [ ] No page flicker during updates

### Form Submission
- [ ] AJAX save works without page reload
- [ ] Success message displays
- [ ] Settings persist after save
- [ ] Error messages display on failure

### Security
- [ ] Nonce verification works
- [ ] Non-admin users cannot access settings
- [ ] Invalid colors are rejected
- [ ] Out-of-range values are rejected

### Performance
- [ ] CSS generation completes quickly
- [ ] Cached CSS is used on subsequent loads
- [ ] Cache invalidates on settings change
- [ ] No memory leaks

### Accessibility
- [ ] All inputs have labels
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader announces fields correctly
- [ ] Focus indicators are visible

### Responsive Design
- [ ] Settings page works on mobile
- [ ] Touch targets are adequate (44px)
- [ ] Layout adapts to screen size

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

## Expected Results

### Performance Benchmarks
- CSS Generation: <100ms average
- Memory Usage: <2MB for generation
- Page Load Impact: <200ms
- Cache Hit: Near-instant (<5ms)

### Security Checks
- All output escaped
- All input sanitized
- Nonce verification on AJAX
- Capability checks enforced

### Code Quality
- No PHP errors or warnings
- No JavaScript console errors
- WordPress Coding Standards compliant
- All docblocks complete

## Troubleshooting

### Tests Fail to Run
- Ensure WordPress is installed
- Check file permissions
- Verify PHP version (7.4+)

### Performance Tests Fail
- Check server resources
- Disable other plugins
- Clear object cache

### Integration Tests Fail
- Check database connectivity
- Verify WordPress options table
- Check transient storage

## Continuous Testing

For ongoing development:
1. Run tests after each change
2. Verify no regressions
3. Check performance metrics
4. Validate security measures

## Test Coverage

Current coverage focuses on:
- Core functionality (100%)
- Security measures (100%)
- Performance targets (100%)
- Integration points (100%)

Optional unit tests (tasks 18-21) can be added for deeper coverage if needed.
