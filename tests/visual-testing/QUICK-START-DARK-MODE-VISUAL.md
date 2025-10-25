# Quick Start: Dark Mode Visual Regression Tests

Run comprehensive visual tests for the dark mode toggle feature in under 5 minutes.

## Prerequisites Check

```bash
# 1. Check Node.js is installed
node --version  # Should be v14 or higher

# 2. Check WordPress is running
curl -I http://localhost/wp-login.php  # Should return 200 OK

# 3. Verify MASE plugin is active
# Visit: http://localhost/wp-admin/plugins.php
```

## Installation (One-Time Setup)

```bash
cd tests/visual-testing
npm install
npx playwright install chromium
```

## Run Tests

### Option 1: Quick Run (Headless)
```bash
./run-dark-mode-visual-regression.sh
```

### Option 2: Watch Tests Run (Headed)
```bash
./run-dark-mode-visual-regression.sh --headed
```

### Option 3: Direct Node Execution
```bash
node dark-mode-visual-regression-test.js
```

## Expected Output

```
🎨 Starting Dark Mode Visual Regression Tests...

📍 Test 1: FAB Rendering and Positioning...
  ✓ FAB Rendering and Positioning

🌓 Test 2: Icon Changes (Sun/Moon)...
  ✓ Icon Changes

🎨 Test 3: Color Transitions...
  ✓ Color Transitions

✨ Test 4: Animation Smoothness...
  ✓ Animation Smoothness

📱 Test 5: Responsive Behavior...
  ✓ Responsive Behavior

♿ Test 6: Reduced Motion Mode...
  ✓ Reduced Motion Mode

============================================================
Test Suite: PASSED
Passed: 6
Failed: 0
============================================================

📊 View detailed report in: reports/
📸 View screenshots in: screenshots/
```

## View Results

### HTML Report (Recommended)
```bash
# Open the latest report in your browser
open reports/dark-mode-visual-regression-*.html
```

### Screenshots
```bash
# View all screenshots
ls -lh screenshots/dark-mode-visual-*.png
```

### JSON Results
```bash
# View raw test data
cat reports/dark-mode-visual-regression-*.json | jq
```

## Test Coverage Summary

| Test | Requirements | Checks |
|------|--------------|--------|
| FAB Rendering | 1.1, 1.2, 1.6 | 6 checks |
| Icon Changes | 1.2, 1.7 | 3 checks |
| Color Transitions | 9.1, 9.2 | 4 checks |
| Animation Smoothness | 1.7, 9.2-9.5 | 5 checks |
| Responsive Behavior | 1.5 | 9 checks (3 viewports) |
| Reduced Motion | 9.6, 9.7 | 5 checks |

**Total:** 32 automated visual checks

## Common Issues

### WordPress Not Running
```
⚠️  Warning: WordPress may not be running
```
**Fix:** Start WordPress with `docker-compose up` or your local server

### Login Failed
```
⚠️  Login may have failed
```
**Fix:** Update credentials in test file or use admin/admin123

### FAB Not Found
```
❌ FAB not found in DOM
```
**Fix:** Enable dark mode feature in MASE settings

## Next Steps

1. ✅ Run visual regression tests
2. 📊 Review HTML report
3. 📸 Inspect screenshots
4. 🔄 Run accessibility tests: `./run-dark-mode-accessibility-tests.sh`
5. 🌐 Run browser compatibility tests: `./run-dark-mode-browser-tests.sh`

## Full Documentation

See [DARK-MODE-VISUAL-REGRESSION-README.md](./DARK-MODE-VISUAL-REGRESSION-README.md) for complete documentation.
