# Quick Start: Admin Bar Enhancement Visual Tests

## 1. Prerequisites Check

```bash
# Check Node.js
node --version  # Should be v14+

# Check WordPress
curl -I http://localhost/wp-login.php  # Should return 200 OK
```

## 2. Install Dependencies

```bash
cd tests/visual-testing
npm install
npx playwright install chromium
```

## 3. Run Tests

```bash
./run-adminbar-enhancement-test.sh
```

## 4. View Results

Open the HTML report in your browser:
```bash
# Latest report
open reports/adminbar-enhancement-test-*.html
```

## What Gets Tested

✅ **Text & Icon Alignment** - Heights: 32px, 50px, 100px  
✅ **Icon Color Sync** - Colors: Red, Green, Blue, Yellow  
✅ **Floating Mode** - Various height/margin combinations  
✅ **Gradients** - Linear (4 angles), Radial, Conic  
✅ **Submenu Styling** - Background, radius, spacing, typography  

## Expected Duration

⏱️ **~2-3 minutes** for complete test suite

## Troubleshooting

**WordPress not running?**
```bash
docker-compose up -d
```

**Login fails?**
Edit `adminbar-enhancement-test.js` and update credentials.

**Tests timeout?**
Increase `CONFIG.timeout` in the test file.

## Output Files

📸 **Screenshots**: `screenshots/adminbar-*.png`  
📊 **HTML Report**: `reports/adminbar-enhancement-test-*.html`  
📄 **JSON Data**: `reports/adminbar-enhancement-test-*.json`  

## Success Criteria

All 5 test suites should show **PASSED** status:
- 18.1 Text and Icon Alignment ✅
- 18.2 Icon Color Synchronization ✅
- 18.3 Floating Mode Layout ✅
- 18.4 Gradient Backgrounds ✅
- 18.5 Submenu Styling ✅
