# Template System Browser Tests - Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Internet connection (for first-time setup)

## Quick Start (3 Steps)

### 1. Install Dependencies

```bash
cd tests/browser-compatibility
npm install
npx playwright install
```

### 2. Run Tests

```bash
# Run all browsers
npx playwright test test-template-system-fixes.js

# Or use the script
./run-template-system-tests.sh
```

### 3. View Results

```bash
# View HTML report
npx playwright show-report

# Or check: test-results/template-system/
```

## Run Specific Browser

```bash
# Chrome only
npx playwright test test-template-system-fixes.js --project=chromium

# Firefox only
npx playwright test test-template-system-fixes.js --project=firefox

# Safari only
npx playwright test test-template-system-fixes.js --project=webkit
```

## Troubleshooting

**Issue:** `playwright: command not found`  
**Fix:** Run `npm install` first

**Issue:** Browsers not installed  
**Fix:** Run `npx playwright install`

**Issue:** Tests fail  
**Fix:** Check `test-results/` for screenshots and logs

## Documentation

- Full checklist: `TEMPLATE-SYSTEM-TEST-CHECKLIST.md`
- Test report: `TEMPLATE-SYSTEM-TEST-REPORT.md`
- Main README: `README.md`
