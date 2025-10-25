# Quick Start: Dark Mode Browser Compatibility Tests

## 🚀 Run Tests in 3 Steps

### Step 1: Install Dependencies
```bash
cd tests/browser-compatibility
npm install
npx playwright install
```

### Step 2: Run Tests
```bash
# All browsers
./run-dark-mode-tests.sh

# Or specific browser
./run-dark-mode-tests.sh chrome
./run-dark-mode-tests.sh firefox
./run-dark-mode-tests.sh safari
```

### Step 3: View Results
The HTML report opens automatically, or open manually:
```bash
open test-results/html-report/index.html
```

## 📊 What Gets Tested

✅ **localStorage Support** - Save/restore preferences  
✅ **matchMedia API** - System preference detection  
✅ **CSS Custom Properties** - Dark mode styling  
✅ **Mobile Devices** - iOS Safari, Android Chrome  
✅ **Touch Events** - Mobile interaction  
✅ **Accessibility** - ARIA attributes, keyboard nav  
✅ **Performance** - Toggle speed, memory usage  
✅ **Cross-Browser** - Chrome, Firefox, Safari, Edge  

## 🎯 Quick Commands

```bash
# All browsers, all tests
npx playwright test test-dark-mode-cross-browser.js

# Chrome only
npx playwright test test-dark-mode-cross-browser.js --project=chromium

# Firefox only
npx playwright test test-dark-mode-cross-browser.js --project=firefox

# Safari only
npx playwright test test-dark-mode-cross-browser.js --project=webkit

# Mobile Safari
npx playwright test test-dark-mode-cross-browser.js --project=mobile-safari

# Mobile Chrome
npx playwright test test-dark-mode-cross-browser.js --project=mobile-chrome

# See browser window (headed mode)
npx playwright test test-dark-mode-cross-browser.js --headed

# Debug mode (step through tests)
npx playwright test test-dark-mode-cross-browser.js --debug

# Run specific test
npx playwright test test-dark-mode-cross-browser.js -g "localStorage"
```

## 📱 Mobile Testing

Tests automatically run on emulated devices:
- iPhone SE (375x667)
- iPhone 12 (390x844)
- iPhone 12 Pro Max (428x926)
- Samsung Galaxy S21 (360x800)
- iPad Mini (768x1024)
- iPad Pro (1024x1366)

## 🔍 Troubleshooting

**Tests fail?**
```bash
# Reinstall browsers
npx playwright install --force

# Clear cache
rm -rf test-results/
```

**Need more details?**
```bash
# Verbose output
DEBUG=pw:api npx playwright test test-dark-mode-cross-browser.js
```

**Want to see what's happening?**
```bash
# Headed mode (shows browser)
npx playwright test test-dark-mode-cross-browser.js --headed --project=chromium
```

## 📈 Expected Results

All tests should pass with:
- ✓ localStorage API supported
- ✓ matchMedia API supported
- ✓ CSS custom properties work
- ✓ Dark mode toggles correctly
- ✓ Preferences persist
- ✓ WCAG AA contrast ratios met
- ✓ No JavaScript errors
- ✓ Toggle speed < 100ms
- ✓ Memory increase < 2MB

## 📚 More Information

See [DARK-MODE-BROWSER-COMPAT-README.md](./DARK-MODE-BROWSER-COMPAT-README.md) for:
- Detailed test descriptions
- Manual testing checklist
- CI/CD integration
- Performance benchmarks
- Known browser limitations

## 🆘 Need Help?

1. Check `test-results/html-report/index.html` for detailed results
2. Look for screenshots in `test-results/dark-mode/`
3. Review console output for error messages
4. Check browser console (F12) for JavaScript errors
5. See full README for troubleshooting guide
