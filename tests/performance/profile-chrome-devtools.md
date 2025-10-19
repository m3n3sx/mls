# Chrome DevTools Profiling Guide

This guide explains how to profile JavaScript execution using Chrome DevTools (Requirement 17.3).

## Prerequisites

- Google Chrome or Chromium browser
- WordPress site running with MASE plugin active
- Admin access to WordPress

## Step-by-Step Instructions

### 1. Open Chrome DevTools

1. Navigate to your WordPress admin page: `http://your-site.com/wp-admin`
2. Open DevTools:
   - **Windows/Linux**: Press `F12` or `Ctrl+Shift+I`
   - **macOS**: Press `Cmd+Option+I`
3. Click on the **Performance** tab

### 2. Configure Recording Settings

1. Click the **Settings** gear icon in the Performance tab
2. Enable these options:
   - ✅ Screenshots
   - ✅ Memory
   - ✅ Web Vitals
3. Set CPU throttling to **4x slowdown** (to simulate slower devices)
4. Set Network throttling to **Fast 3G** (optional)

### 3. Record Performance Profile

#### Option A: Page Load Profile

1. Click the **Reload** button (circular arrow) in the Performance tab
2. Wait for the page to fully load
3. The recording will stop automatically
4. DevTools will display the performance timeline

#### Option B: Interaction Profile

1. Click the **Record** button (circle) in the Performance tab
2. Perform actions in MASE settings:
   - Apply a color palette
   - Change typography settings
   - Toggle visual effects
   - Save settings
3. Click **Stop** button after 5-10 seconds

### 4. Analyze Results

#### Main Metrics to Check

Look at the **Summary** tab at the bottom:

- **Loading**: Time spent loading resources
- **Scripting**: JavaScript execution time (should be <450ms total)
- **Rendering**: Time spent rendering the page
- **Painting**: Time spent painting pixels
- **System**: Browser overhead
- **Idle**: Idle time

#### Performance Targets

✅ **PASS** - Meets all targets:
- Total JavaScript execution: <450ms
- Main thread blocking: <200ms
- Long tasks (>50ms): <5 occurrences
- Frame rate: >30fps during interactions

⚠️ **WARNING** - Within 10% of targets

❌ **FAIL** - Exceeds targets by >10%

#### Key Areas to Investigate

1. **Main Thread Activity**
   - Look for long yellow bars (JavaScript execution)
   - Identify functions taking >50ms
   - Check for layout thrashing (purple bars)

2. **Call Tree**
   - Click on a yellow bar to see the call stack
   - Identify MASE functions:
     - `MASE.init()`
     - `MASE.paletteManager.apply()`
     - `MASE.livePreview.update()`
     - `MASE.saveSettings()`

3. **Bottom-Up View**
   - Shows functions sorted by self-time
   - Identify the most expensive operations
   - Look for optimization opportunities

4. **Event Log**
   - Shows all events in chronological order
   - Useful for tracking AJAX requests
   - Check for excessive event listeners

### 5. Identify Performance Issues

#### Common Issues

**Issue**: Long JavaScript execution (>100ms blocks)
- **Cause**: Heavy DOM manipulation or complex calculations
- **Solution**: Break into smaller chunks, use requestAnimationFrame

**Issue**: Forced reflow/layout thrashing
- **Cause**: Reading layout properties after writing
- **Solution**: Batch DOM reads and writes

**Issue**: Excessive event listeners
- **Cause**: Not removing event listeners properly
- **Solution**: Use event delegation, clean up listeners

**Issue**: Large bundle size
- **Cause**: Including unnecessary code
- **Solution**: Code splitting, lazy loading

### 6. Measure Specific Functions

#### Using Performance API

Add this code to measure specific functions:

```javascript
// Measure CSS generation
performance.mark('css-gen-start');
var css = MASE.livePreview.generateCSS(settings);
performance.mark('css-gen-end');
performance.measure('CSS Generation', 'css-gen-start', 'css-gen-end');

// View results
var measures = performance.getEntriesByType('measure');
console.table(measures);
```

#### Using Console Timing

```javascript
console.time('Settings Save');
MASE.saveSettings();
console.timeEnd('Settings Save');
```

### 7. Memory Profiling

1. Switch to the **Memory** tab in DevTools
2. Select **Heap snapshot**
3. Click **Take snapshot**
4. Perform actions in MASE settings
5. Take another snapshot
6. Compare snapshots to find memory leaks

#### Memory Targets

- **Heap size**: <50MB
- **Memory growth**: <5MB per interaction
- **Detached DOM nodes**: <10

### 8. Network Profiling

1. Switch to the **Network** tab
2. Reload the page or perform actions
3. Check AJAX requests:
   - `admin-ajax.php?action=mase_save_settings`
   - Response time should be <500ms
   - Payload size should be <100KB

### 9. Export Results

#### Export Performance Profile

1. Right-click in the Performance tab
2. Select **Save profile...**
3. Save as `mase-performance-YYYYMMDD.json`
4. Share with team or compare with previous profiles

#### Export Screenshots

1. Click the **Screenshots** checkbox
2. Record profile
3. Right-click on any screenshot
4. Select **Save as...**

### 10. Automated Testing

Use Puppeteer for automated performance testing:

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Start tracing
  await page.tracing.start({
    path: 'mase-trace.json',
    screenshots: true
  });
  
  // Navigate and interact
  await page.goto('http://localhost/wp-admin');
  await page.click('#mase-palette-1');
  await page.click('#mase-save-settings');
  
  // Stop tracing
  await page.tracing.stop();
  
  await browser.close();
})();
```

## Performance Checklist

Use this checklist when profiling:

- [ ] Total JavaScript execution <450ms
- [ ] No long tasks >50ms
- [ ] Frame rate >30fps during interactions
- [ ] Memory usage <50MB
- [ ] No memory leaks (stable heap size)
- [ ] AJAX requests <500ms
- [ ] No excessive DOM manipulation
- [ ] No layout thrashing
- [ ] Event listeners properly cleaned up
- [ ] No console errors or warnings

## Interpreting Results

### Good Performance Profile

```
Loading:    120ms (27%)
Scripting:  180ms (40%)  ✅ <450ms
Rendering:   80ms (18%)
Painting:    40ms (9%)
System:      20ms (4%)
Idle:        10ms (2%)
Total:      450ms
```

### Poor Performance Profile

```
Loading:    200ms (20%)
Scripting:  650ms (65%)  ❌ >450ms
Rendering:  100ms (10%)
Painting:    30ms (3%)
System:      20ms (2%)
Idle:         0ms (0%)
Total:     1000ms
```

## Resources

- [Chrome DevTools Performance Documentation](https://developer.chrome.com/docs/devtools/performance/)
- [Web Vitals](https://web.dev/vitals/)
- [JavaScript Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)

## Tips

1. **Always test on slower devices** - Use CPU throttling
2. **Test with realistic data** - Use production-like settings
3. **Compare before/after** - Save profiles for comparison
4. **Focus on user interactions** - Profile common workflows
5. **Automate when possible** - Use Puppeteer for regression testing
