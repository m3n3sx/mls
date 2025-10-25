# Quick Start: Responsive Testing

Fast guide to running responsive tests for Admin Bar enhancements.

## 1. Install Dependencies (First Time Only)

```bash
cd tests/browser-compatibility
npm install
```

## 2. Run All Responsive Tests

```bash
./run-responsive-tests.sh
```

## 3. Run Specific Tests

### Mobile Only
```bash
npx playwright test test-adminbar-responsive.js --grep "Mobile"
```

### Tablet Only
```bash
npx playwright test test-adminbar-responsive.js --grep "Tablet"
```

### Desktop Only
```bash
npx playwright test test-adminbar-responsive.js --grep "Desktop"
```

## 4. View Results

```bash
# List results
ls test-results/responsive/

# View JSON results
cat test-results/responsive/iphone-375-*.json

# View screenshots
open test-results/responsive/*.png
```

## What Gets Tested

✅ **Mobile (360px, 375px)**
- Touch targets ≥44px
- Font size ≥14px
- No horizontal overflow
- Admin bar height: 48px

✅ **Tablet (768px, 800px)**
- Proper layout
- Admin bar height: 40px
- Touch-friendly elements

✅ **Desktop (1366px, 1920px, 2560px)**
- Standard layout
- Admin bar height: 32px
- All features work

## Expected Results

All tests should **PASS** ✓

If any test fails:
1. Check the error message
2. View the screenshot
3. Verify the specific requirement
4. Fix the issue and re-run

## Common Issues

### Touch Targets Too Small (Mobile)
- Increase element height to ≥44px
- Add padding to clickable areas

### Layout Overflow
- Check max-width constraints
- Verify responsive CSS breakpoints

### Wrong Height
- Check media query breakpoints
- Verify CSS is applied correctly

## Next Steps

After responsive tests pass:
- Run browser compatibility tests
- Run visual regression tests
- Test on real devices if possible

## Full Documentation

See [RESPONSIVE-TESTS-README.md](./RESPONSIVE-TESTS-README.md) for complete details.
