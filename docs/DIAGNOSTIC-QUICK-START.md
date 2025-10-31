# MASE Diagnostic Quick Start

**Quick reference for diagnosing admin menu issues**

---

## 🚀 Quick Diagnostic (2 minutes)

### Step 1: Enable Debug Mode

Add to `wp-config.php`:
```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
```

### Step 2: Run Browser Diagnostic

1. Open WordPress admin
2. Press F12 (DevTools)
3. Go to Console tab
4. Run:
```javascript
MASE_Diagnostic.runFullDiagnostic()
```

### Step 3: Check Server Logs

```bash
tail -n 50 wp-content/debug.log | grep "MASE DIAGNOSTIC"
```

---

## 🔍 What to Look For

### ✅ GOOD (No Issues)

**Browser Console:**
```
Total <style> tags: 15
MASE <style> tags: 1
✓ #adminmenu found
Menu items: 12
✓ Dashboard items: 1
✓ No overlapping elements detected
✓ No critical issues detected
```

**Server Log:**
```
MASE DIAGNOSTIC: CSS injection #1 triggered by hook "admin_head"
MASE DIAGNOSTIC: Using cached CSS (28.45 KB)
MASE DIAGNOSTIC: Admin menu CSS generated (5678 bytes) - Contains #adminmenu: YES
MASE DIAGNOSTIC: CSS injection #1 completed in 1.23 ms
```

### ⚠️ WARNING (Potential Issues)

**Browser Console:**
```
⚠️ WARNING: Multiple MASE style tags detected!
⚠️ WARNING: 2 Dashboard items found (expected 1)
⚠️ WARNING: 15 elements overlap with #adminmenu
```

**Server Log:**
```
MASE DIAGNOSTIC WARNING: inject_custom_css() called 2 times!
MASE DIAGNOSTIC WARNING: Admin menu CSS is EMPTY!
MASE DIAGNOSTIC WARNING: CSS generation exceeded threshold: 125.67ms > 100ms
```

---

## 🛠️ Quick Fixes

### Issue: Multiple Style Tags

**Fix:**
```bash
# Clear all caches
wp cache flush
wp option delete mase_generated_css

# Reload admin page
```

### Issue: Empty Admin Menu CSS

**Fix:**
1. Go to MASE Settings
2. Configure Admin Menu colors
3. Click "Save Settings"
4. Reload admin page

### Issue: Overlapping Elements

**Fix:**
1. Disable other admin styling plugins
2. Test in incognito mode
3. Clear browser cache (Ctrl+Shift+Delete)

---

## 📊 Key Metrics

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| MASE style tags | 1 | 2 | 3+ |
| Dashboard items | 1 | 2 | 3+ |
| CSS generation time | <50ms | 50-100ms | >100ms |
| CSS size | <50KB | 50-100KB | >100KB |
| Injection count | 1 | 2 | 3+ |

---

## 🔗 Full Documentation

See `docs/DIAGNOSTIC-LOGGING-GUIDE.md` for complete details.

---

## 📞 Support Checklist

When reporting issues, provide:

- [ ] Browser console output from `MASE_Diagnostic.runFullDiagnostic()`
- [ ] Server log: `grep "MASE DIAGNOSTIC" wp-content/debug.log`
- [ ] Screenshot of admin menu issue
- [ ] WordPress version
- [ ] MASE version
- [ ] Active plugins list
- [ ] Browser and version

---

**Quick Start Complete!**
