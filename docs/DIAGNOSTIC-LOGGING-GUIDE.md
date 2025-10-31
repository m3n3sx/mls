# MASE Diagnostic Logging Guide

**Version:** 1.0.0  
**Last Updated:** October 30, 2025  
**Purpose:** Track CSS generation and identify admin menu styling issues

---

## Overview

Enhanced logging has been added to MASE to diagnose potential CSS conflicts, duplicate injections, and admin menu overlapping issues. This guide explains how to use the diagnostic tools.

---

## 1. Server-Side Logging (PHP)

### Enable WordPress Debug Mode

Add to `wp-config.php`:

```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
```

### Log File Location

```
wp-content/debug.log
```

### What Gets Logged

#### CSS Injection Tracking

```
MASE DIAGNOSTIC: CSS injection #1 triggered by hook "admin_head"
MASE DIAGNOSTIC: Using cached CSS (28.45 KB)
MASE DIAGNOSTIC: CSS injection #1 completed in 1.23 ms
```

**Key Metrics:**
- Injection count (detects duplicates)
- Hook name (identifies trigger)
- CSS source (cached vs fresh)
- CSS size in KB
- Execution time in ms

#### CSS Generation Tracking

```
MASE DIAGNOSTIC: Starting CSS generation...
MASE DIAGNOSTIC: Admin bar CSS generated (1234 bytes)
MASE DIAGNOSTIC: Admin menu CSS generated (5678 bytes) - Contains #adminmenu: YES
MASE DIAGNOSTIC: CSS generation completed in 87.45ms (threshold: 100ms, within threshold: YES)
MASE DIAGNOSTIC: Total CSS size: 28.45 KB (29132 bytes)
MASE DIAGNOSTIC: Top CSS sections: admin_menu: 5.54 KB (19.5%), buttons: 4.23 KB (14.9%)
MASE DIAGNOSTIC: Admin styling present - Menu: YES, Bar: YES
```

**Key Metrics:**
- Section-by-section generation
- Admin menu CSS presence
- Total generation time
- CSS size breakdown
- Top 5 largest sections

#### Error Recovery

```
MASE DIAGNOSTIC ERROR: CSS Injection Failed - Exception message, File: path/to/file.php, Line: 123
MASE DIAGNOSTIC: Using fallback CSS from "main_cache" (28.45 KB)
```

**Fallback Sources:**
1. `main_cache` - Primary cache
2. `dark_mode_cache` - Dark mode specific
3. `light_mode_cache` - Light mode specific
4. `legacy_cache` - Backward compatibility
5. `minimal_safe` - Last resort fallback

### Warning Indicators

#### Duplicate Injection

```
MASE DIAGNOSTIC WARNING: inject_custom_css() called 2 times! This indicates duplicate CSS injection.
```

**Action:** Check for duplicate `admin_head` hooks

#### Empty CSS

```
MASE DIAGNOSTIC WARNING: Admin menu CSS is EMPTY!
MASE DIAGNOSTIC WARNING: Generated CSS is empty!
```

**Action:** Check settings and CSS generator methods

#### Performance Issues

```
MASE DIAGNOSTIC WARNING: CSS generation exceeded threshold: 125.67ms > 100ms
```

**Action:** Review CSS complexity or enable caching

---

## 2. Client-Side Diagnostics (JavaScript)

### Automatic Diagnostic

Add `?mase_debug=1` to any admin URL:

```
https://yoursite.com/wp-admin/?mase_debug=1
```

The diagnostic will run automatically after 1 second.

### Manual Diagnostic

1. Open any WordPress admin page
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run:

```javascript
MASE_Diagnostic.runFullDiagnostic()
```

### Diagnostic Output

#### Style Tags Check

```
--- STYLE TAGS CHECK ---
Total <style> tags: 15
MASE <style> tags: 1
  [1] ID: mase-custom-css, Size: 28.45 KB, Comment: /* MASE: Cached CSS - Injection #1 */
```

**Expected:** 1 MASE style tag  
**Warning:** Multiple MASE style tags indicate duplicate injection

#### Admin Menu Check

```
--- ADMIN MENU CHECK ---
✓ #adminmenu found
Computed styles:
  background: rgb(35, 40, 45)
  background-color: rgb(35, 40, 45)
  display: block
  visibility: visible
  opacity: 1
  z-index: 9990
  position: fixed
Menu items: 12
✓ Dashboard items: 1
Position:
  top: 32px
  left: 0px
  width: 160px
  height: 768px
```

**Expected:** 1 Dashboard item  
**Warning:** Multiple Dashboard items indicate duplicate menu elements

#### CSS Conflicts Check

```
--- CSS CONFLICTS CHECK ---
Rules targeting #adminmenu: 8
  [1] #adminmenu
      Source: https://yoursite.com/wp-admin/css/colors.css
  [2] body.wp-admin #adminmenu
      Source: inline
```

**Expected:** < 10 rules  
**Warning:** Many rules suggest potential conflicts

#### Overlapping Elements Check

```
--- OVERLAPPING ELEMENTS CHECK ---
✓ No overlapping elements detected
```

**Warning:** Elements with high z-index overlapping menu

---

## 3. Diagnostic Workflow

### Step 1: Enable Logging

```php
// wp-config.php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
```

### Step 2: Clear All Caches

```bash
# Clear WordPress object cache
wp cache flush

# Clear MASE CSS cache
wp option delete mase_generated_css
wp option delete mase_cached_light_mode_css
wp option delete mase_cached_dark_mode_css

# Clear browser cache
# Ctrl+Shift+Delete (Chrome/Firefox)
```

### Step 3: Reproduce Issue

1. Navigate to WordPress admin
2. Observe admin menu behavior
3. Note any visual issues

### Step 4: Collect Diagnostics

#### Server-Side

```bash
# View last 100 lines of debug log
tail -n 100 wp-content/debug.log

# Filter MASE messages only
grep "MASE DIAGNOSTIC" wp-content/debug.log

# Count injection calls
grep "CSS injection #" wp-content/debug.log | wc -l
```

#### Client-Side

```javascript
// Run in browser console
MASE_Diagnostic.runFullDiagnostic()
```

### Step 5: Analyze Results

#### Check for Duplicate Injection

```bash
grep "inject_custom_css() called" wp-content/debug.log
```

**Expected:** No warnings  
**Issue:** Multiple calls indicate duplicate hooks

#### Check CSS Generation

```bash
grep "Admin menu CSS generated" wp-content/debug.log
```

**Expected:** Non-zero bytes with `#adminmenu: YES`  
**Issue:** Empty or missing admin menu CSS

#### Check Performance

```bash
grep "CSS generation completed" wp-content/debug.log
```

**Expected:** < 100ms  
**Issue:** Slow generation may cause timeouts

---

## 4. Common Issues & Solutions

### Issue: Multiple MASE Style Tags

**Symptoms:**
```
MASE DIAGNOSTIC WARNING: inject_custom_css() called 2 times!
```

**Diagnosis:**
```bash
grep "CSS injection #" wp-content/debug.log
```

**Solution:**
1. Check for duplicate `add_action('admin_head')` calls
2. Verify no other plugins hooking into MASE
3. Check theme functions.php for conflicts

### Issue: Empty Admin Menu CSS

**Symptoms:**
```
MASE DIAGNOSTIC WARNING: Admin menu CSS is EMPTY!
```

**Diagnosis:**
```bash
grep "Admin menu CSS generated" wp-content/debug.log
```

**Solution:**
1. Check admin menu settings are configured
2. Verify `generate_admin_menu_css()` method exists
3. Check for exceptions during generation

### Issue: Overlapping Menu Elements

**Symptoms:**
- Multiple Dashboard items
- Duplicate menu entries
- Visual overlaps

**Diagnosis:**
```javascript
MASE_Diagnostic.checkAdminMenu()
MASE_Diagnostic.checkOverlappingElements()
```

**Solution:**
1. Check for plugin conflicts (disable other admin plugins)
2. Verify z-index values are correct
3. Check for theme admin CSS overrides

### Issue: Slow CSS Generation

**Symptoms:**
```
MASE DIAGNOSTIC WARNING: CSS generation exceeded threshold: 125.67ms > 100ms
```

**Diagnosis:**
```bash
grep "Top CSS sections" wp-content/debug.log
```

**Solution:**
1. Identify largest CSS sections
2. Enable CSS minification
3. Reduce complexity in large sections
4. Enable caching

---

## 5. Reporting Issues

When reporting admin menu issues, include:

### Server-Side Logs

```bash
# Extract MASE diagnostics
grep "MASE DIAGNOSTIC" wp-content/debug.log > mase-diagnostics.txt
```

### Client-Side Diagnostics

```javascript
// Run and copy output
MASE_Diagnostic.runFullDiagnostic()
```

### Environment Info

- WordPress version
- MASE version
- Active theme
- Active plugins
- Browser and version
- PHP version

### Screenshots

1. Admin menu showing issue
2. Browser DevTools Console
3. Browser DevTools Elements (inspect #adminmenu)

---

## 6. Advanced Debugging

### Monitor CSS Injection in Real-Time

```javascript
// Add to browser console
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeName === 'STYLE' && node.id && node.id.includes('mase')) {
        console.log('MASE style tag added:', node.id, node.textContent.length, 'bytes');
      }
    });
  });
});

observer.observe(document.head, { childList: true });
```

### Track CSS Rule Changes

```javascript
// Monitor #adminmenu style changes
const adminMenu = document.querySelector('#adminmenu');
const observer = new MutationObserver(() => {
  const styles = window.getComputedStyle(adminMenu);
  console.log('Admin menu styles changed:', {
    background: styles.backgroundColor,
    zIndex: styles.zIndex,
    display: styles.display
  });
});

observer.observe(adminMenu, { attributes: true, attributeFilter: ['style', 'class'] });
```

### Capture All CSS Rules for #adminmenu

```javascript
const sheets = Array.from(document.styleSheets);
const rules = [];

sheets.forEach(sheet => {
  try {
    Array.from(sheet.cssRules || []).forEach(rule => {
      if (rule.selectorText && rule.selectorText.includes('#adminmenu')) {
        rules.push({
          selector: rule.selectorText,
          source: sheet.href || 'inline',
          css: rule.cssText
        });
      }
    });
  } catch (e) {
    // Cross-origin, skip
  }
});

console.table(rules);
```

---

## 7. Performance Monitoring

### CSS Generation Metrics

```bash
# Average generation time
grep "CSS generation completed" wp-content/debug.log | \
  grep -oP '\d+\.\d+ms' | \
  awk '{sum+=$1; count++} END {print "Average:", sum/count, "ms"}'

# Cache hit rate
total=$(grep "CSS injection #1" wp-content/debug.log | wc -l)
cached=$(grep "Using cached CSS" wp-content/debug.log | wc -l)
echo "Cache hit rate: $(($cached * 100 / $total))%"
```

### CSS Size Tracking

```bash
# Track CSS size over time
grep "Total CSS size" wp-content/debug.log | \
  grep -oP '\d+\.\d+ KB' | \
  tail -n 10
```

---

## 8. Cleanup

### Disable Logging

```php
// wp-config.php
define( 'WP_DEBUG', false );
define( 'WP_DEBUG_LOG', false );
```

### Clear Log File

```bash
# Backup first
cp wp-content/debug.log wp-content/debug.log.backup

# Clear
> wp-content/debug.log
```

### Remove Diagnostic Script

The diagnostic script only loads when `WP_DEBUG` is enabled, so disabling debug mode automatically removes it.

---

## Support

For additional help:
- Check `docs/TROUBLESHOOTING.md`
- Review `docs/CSS-FILE-ANALYSIS-BASELINE.md`
- Contact support with diagnostic output

---

**End of Diagnostic Logging Guide**
