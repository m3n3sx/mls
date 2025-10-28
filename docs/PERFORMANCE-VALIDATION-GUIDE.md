# Performance Validation Guide
## Task 21.3: Performance Validation

**Date:** October 23, 2025  
**Requirements:** 12.1, 12.2, 12.3, 12.4, 12.5

---

## Overview

This guide provides comprehensive performance validation procedures for the MASE plugin to ensure all performance targets are met according to the design requirements.

---

## Performance Targets

### Requirement 12.1: Initial Load Time
**Target:** < 200ms on 3G connection

### Requirement 12.2: Preview Update Latency
**Target:** < 50ms for CSS generation and DOM update

### Requirement 12.3: Code Splitting
**Target:** Modules loaded on demand, not all at once

### Requirement 12.4: Lighthouse Score
**Target:** 90+ performance score

### Requirement 12.5: Bundle Size
**Target:** < 100KB per chunk

---

## 1. Lighthouse Audit (Requirement 12.4)

### 1.1 Production Build Audit

**Prerequisites:**
- Production build created (`npm run build`)
- WordPress instance running with production assets
- No browser extensions enabled
- Incognito/private browsing mode

**Steps:**

1. **Open Chrome DevTools**
   ```
   - Navigate to MASE settings page
   - Press F12 to open DevTools
   - Click "Lighthouse" tab
   ```

2. **Configure Lighthouse**
   ```
   - Mode: Navigation
   - Device: Desktop
   - Categories: Performance, Accessibility, Best Practices
   - Throttling: Simulated throttling
   ```

3. **Run Audit**
   ```
   - Click "Analyze page load"
   - Wait for audit to complete
   - Review results
   ```

4. **Expected Results**
   ```
   Performance Score: ≥ 90
   First Contentful Paint: < 1.8s
   Largest Contentful Paint: < 2.5s
   Total Blocking Time: < 200ms
   Cumulative Layout Shift: < 0.1
   Speed Index: < 3.4s
   ```

5. **Save Report**
   ```
   - Click "Save report" button
   - Save as: lighthouse-report-[date].html
   - Store in: docs/performance/
   ```

### 1.2 Mobile Audit

**Steps:**

1. **Configure Lighthouse for Mobile**
   ```
   - Device: Mobile
   - Network: Slow 4G
   - CPU: 4x slowdown
   ```

2. **Run Audit**
   ```
   - Click "Analyze page load"
   - Wait for audit to complete
   - Review results
   ```

3. **Expected Results**
   ```
   Performance Score: ≥ 85 (mobile typically lower)
   First Contentful Paint: < 2.5s
   Largest Contentful Paint: < 4.0s
   Total Blocking Time: < 300ms
   ```

### 1.3 Lighthouse CI (Automated)

**Setup:**

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse CI
lhci autorun --config=lighthouserc.json
```

**Configuration:** `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:8080/wp-admin/admin.php?page=mase-settings"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "total-blocking-time": ["error", {"maxNumericValue": 200}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    }
  }
}
```

---

## 2. Bundle Size Analysis (Requirement 12.5)

### 2.1 Check Bundle Sizes

**Command:**
```bash
npm run build
npm run check-size
```

**Expected Output:**
```
Bundle Size Analysis
====================
main.js: 28.5 KB (✅ < 100 KB)
vendor.js: 45.2 KB (✅ < 100 KB)
preview.js: 38.7 KB (✅ < 100 KB)
color.js: 22.1 KB (✅ < 100 KB)
typography.js: 18.9 KB (✅ < 100 KB)
animations.js: 15.3 KB (✅ < 100 KB)

Total: 168.7 KB
Status: ✅ All chunks under 100 KB
```

### 2.2 Bundle Analyzer

**Command:**
```bash
npm run analyze
```

**Steps:**

1. **Run Analyzer**
   ```bash
   npm run analyze
   ```

2. **Review Visualization**
   ```
   - Opens browser with bundle visualization
   - Identify large dependencies
   - Look for duplicate code
   - Check for unused code
   ```

3. **Expected Results**
   ```
   - No single dependency > 50 KB
   - No duplicate dependencies
   - Tree shaking working correctly
   - Code splitting effective
   ```

### 2.3 Compression Analysis

**Check Gzip Sizes:**

```bash
# Build production bundle
npm run build

# Check gzipped sizes
find dist -name "*.js" -exec sh -c 'echo "{}: $(gzip -c {} | wc -c) bytes (gzipped)"' \;
```

**Expected Results:**
```
main.js: ~10 KB gzipped
vendor.js: ~15 KB gzipped
preview.js: ~12 KB gzipped
```

---

## 3. Initial Load Time Testing (Requirement 12.1)

### 3.1 Network Throttling Test

**Steps:**

1. **Open Chrome DevTools**
   ```
   - Navigate to MASE settings page
   - Press F12
   - Click "Network" tab
   ```

2. **Configure Throttling**
   ```
   - Click throttling dropdown
   - Select "Slow 3G"
   - Enable "Disable cache"
   ```

3. **Measure Load Time**
   ```
   - Reload page (Ctrl+Shift+R)
   - Wait for page to fully load
   - Check "Load" time in Network tab
   ```

4. **Expected Results**
   ```
   Load Time: < 200ms for JavaScript bundle
   DOMContentLoaded: < 500ms
   Load Event: < 1000ms
   ```

### 3.2 Performance Timeline

**Steps:**

1. **Open Performance Tab**
   ```
   - Press F12
   - Click "Performance" tab
   - Click record button
   ```

2. **Record Page Load**
   ```
   - Reload page
   - Wait for page to fully load
   - Stop recording
   ```

3. **Analyze Timeline**
   ```
   - Check JavaScript execution time
   - Check rendering time
   - Check layout shifts
   - Identify bottlenecks
   ```

4. **Expected Results**
   ```
   JavaScript Execution: < 100ms
   Rendering: < 50ms
   Layout: < 30ms
   Paint: < 20ms
   ```

---

## 4. Preview Update Performance (Requirement 12.2)

### 4.1 CSS Generation Benchmark

**Test Script:** `tests/performance/test-preview-engine-performance.js`

```javascript
import { PreviewEngine } from '@modules/preview-engine';
import { performance } from 'perf_hooks';

describe('Preview Engine Performance', () => {
  it('should generate CSS in < 50ms', () => {
    const engine = new PreviewEngine();
    const settings = {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        // ... full settings
      },
    };
    
    const start = performance.now();
    const css = engine.generateCSS(settings);
    const end = performance.now();
    
    const duration = end - start;
    console.log(`CSS generation took ${duration.toFixed(2)}ms`);
    
    expect(duration).toBeLessThan(50);
  });
});
```

**Run Test:**
```bash
npm test -- tests/performance/test-preview-engine-performance.js
```

**Expected Output:**
```
✅ Preview Engine Performance
  ✅ should generate CSS in < 50ms (12.34ms)
```

### 4.2 Manual Preview Performance Test

**Steps:**

1. **Open MASE Settings Page**
   ```
   - Navigate to MASE settings
   - Open browser DevTools
   - Click "Performance" tab
   ```

2. **Record Preview Updates**
   ```
   - Start recording
   - Make 10 rapid color changes
   - Stop recording
   ```

3. **Analyze Results**
   ```
   - Check each preview update duration
   - Verify all updates < 50ms
   - Check for frame drops
   - Verify 60fps maintained
   ```

4. **Expected Results**
   ```
   Average Update Time: < 30ms
   Max Update Time: < 50ms
   Frame Rate: 60fps
   No dropped frames
   ```

### 4.3 Debouncing Test

**Steps:**

1. **Test Rapid Changes**
   ```
   - Make 20+ rapid changes in 1 second
   - Verify preview updates debounced
   - Verify final state correct
   - Verify no performance degradation
   ```

2. **Expected Results**
   ```
   - Preview updates debounced to ~100ms intervals
   - Final state matches last change
   - No lag or stuttering
   - Browser remains responsive
   ```

---

## 5. Code Splitting Validation (Requirement 12.3)

### 5.1 Lazy Loading Test

**Steps:**

1. **Open Network Tab**
   ```
   - Navigate to MASE settings
   - Open DevTools Network tab
   - Clear network log
   ```

2. **Test Initial Load**
   ```
   - Reload page
   - Check which bundles load initially
   - Verify only core bundles loaded
   ```

3. **Test Feature Loading**
   ```
   - Click "Colors" tab
   - Verify color-system.js loads
   - Click "Typography" tab
   - Verify typography.js loads
   - Click "Effects" tab
   - Verify animations.js loads
   ```

4. **Expected Results**
   ```
   Initial Load:
   - main.js (core)
   - vendor.js (dependencies)
   - state-manager.js
   - event-bus.js
   
   On Demand:
   - color-system.js (when Colors tab clicked)
   - typography.js (when Typography tab clicked)
   - animations.js (when Effects tab clicked)
   ```

### 5.2 Bundle Analysis

**Check Vite Build Output:**

```bash
npm run build
```

**Expected Output:**
```
vite v5.0.10 building for production...
✓ 45 modules transformed.
dist/assets/main-a1b2c3d4.js          28.5 kB │ gzip: 10.2 kB
dist/assets/vendor-e5f6g7h8.js        45.2 kB │ gzip: 15.8 kB
dist/assets/preview-i9j0k1l2.js       38.7 kB │ gzip: 12.4 kB
dist/assets/color-m3n4o5p6.js         22.1 kB │ gzip: 8.1 kB
dist/assets/typography-q7r8s9t0.js    18.9 kB │ gzip: 6.9 kB
dist/assets/animations-u1v2w3x4.js    15.3 kB │ gzip: 5.6 kB
✓ built in 2.34s
```

---

## 6. Memory Usage Profiling (Requirement 12.4)

### 6.1 Memory Leak Detection

**Steps:**

1. **Open Memory Profiler**
   ```
   - Open DevTools
   - Click "Memory" tab
   - Select "Heap snapshot"
   ```

2. **Take Initial Snapshot**
   ```
   - Click "Take snapshot"
   - Label: "Initial"
   ```

3. **Perform Actions**
   ```
   - Make 100+ setting changes
   - Apply 10+ templates
   - Undo/redo 50+ times
   ```

4. **Take Final Snapshot**
   ```
   - Click "Take snapshot"
   - Label: "After 100 changes"
   ```

5. **Compare Snapshots**
   ```
   - Select "Comparison" view
   - Compare "After" to "Initial"
   - Look for growing objects
   - Check for detached DOM nodes
   ```

6. **Expected Results**
   ```
   - Memory growth < 10 MB
   - No detached DOM nodes
   - No growing arrays/objects
   - Garbage collection working
   ```

### 6.2 Extended Session Test

**Steps:**

1. **Start Memory Recording**
   ```
   - Open DevTools Performance tab
   - Enable "Memory" checkbox
   - Start recording
   ```

2. **Simulate Extended Use**
   ```
   - Make 500+ setting changes over 10 minutes
   - Apply templates repeatedly
   - Use undo/redo extensively
   ```

3. **Stop Recording**
   ```
   - Stop recording
   - Analyze memory timeline
   ```

4. **Expected Results**
   ```
   - Memory usage stable (sawtooth pattern)
   - No continuous growth
   - Garbage collection occurring
   - Peak memory < 100 MB
   ```

---

## 7. Slow Network Testing

### 7.1 3G Network Simulation

**Steps:**

1. **Configure Network Throttling**
   ```
   - Open DevTools Network tab
   - Select "Slow 3G" preset
   - Enable "Disable cache"
   ```

2. **Test Page Load**
   ```
   - Reload page
   - Measure load time
   - Check user experience
   ```

3. **Expected Results**
   ```
   - Page usable within 3 seconds
   - Progressive loading visible
   - No blocking resources
   - Graceful degradation
   ```

### 7.2 Offline Handling

**Steps:**

1. **Go Offline**
   ```
   - Open DevTools Network tab
   - Select "Offline"
   ```

2. **Test Functionality**
   ```
   - Try to save settings
   - Verify error message
   - Verify retry option
   ```

3. **Go Online**
   ```
   - Select "Online"
   - Retry save
   - Verify success
   ```

4. **Expected Results**
   ```
   - Offline state detected
   - User-friendly error message
   - Retry mechanism works
   - No data loss
   ```

---

## 8. Device Performance Testing

### 8.1 Low-End Device Simulation

**Steps:**

1. **Configure CPU Throttling**
   ```
   - Open DevTools Performance tab
   - Enable "CPU: 6x slowdown"
   ```

2. **Test Performance**
   ```
   - Make setting changes
   - Measure preview update time
   - Check responsiveness
   ```

3. **Expected Results**
   ```
   - Preview updates < 300ms (6x slower)
   - UI remains responsive
   - No freezing or hanging
   ```

### 8.2 Mobile Device Testing

**Test on Real Devices:**

- [ ] iPhone 8 (older device)
- [ ] iPhone 13 (modern device)
- [ ] Samsung Galaxy S10 (older Android)
- [ ] Samsung Galaxy S22 (modern Android)

**Expected Results:**
```
- Smooth scrolling
- Responsive interactions
- No lag or stuttering
- Battery usage reasonable
```

---

## 9. Performance Monitoring Script

**Create:** `scripts/performance-monitor.js`

```javascript
#!/usr/bin/env node

import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import { writeFileSync } from 'fs';

async function runPerformanceTests() {
  console.log('🚀 Starting Performance Validation...\n');
  
  const results = {
    lighthouse: null,
    bundleSize: null,
    loadTime: null,
    previewPerformance: null,
    memoryUsage: null,
  };
  
  // 1. Lighthouse Audit
  console.log('1️⃣ Running Lighthouse Audit...');
  // Implementation here
  
  // 2. Bundle Size Check
  console.log('2️⃣ Checking Bundle Sizes...');
  // Implementation here
  
  // 3. Load Time Test
  console.log('3️⃣ Testing Load Time...');
  // Implementation here
  
  // 4. Preview Performance
  console.log('4️⃣ Testing Preview Performance...');
  // Implementation here
  
  // 5. Memory Usage
  console.log('5️⃣ Profiling Memory Usage...');
  // Implementation here
  
  // Generate Report
  console.log('\n📊 Generating Performance Report...');
  writeFileSync(
    'PERFORMANCE-REPORT.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('✅ Performance Validation Complete!');
  console.log('📄 Report saved to: PERFORMANCE-REPORT.json');
}

runPerformanceTests().catch(console.error);
```

---

## 10. Performance Checklist

### Bundle Size (Requirement 12.5)
- [ ] All chunks < 100 KB
- [ ] Gzipped sizes reasonable
- [ ] No duplicate dependencies
- [ ] Tree shaking working

### Load Time (Requirement 12.1)
- [ ] Initial load < 200ms on 3G
- [ ] DOMContentLoaded < 500ms
- [ ] No blocking resources
- [ ] Progressive loading

### Preview Performance (Requirement 12.2)
- [ ] CSS generation < 50ms
- [ ] DOM update < 50ms
- [ ] 60fps maintained
- [ ] Debouncing working

### Code Splitting (Requirement 12.3)
- [ ] Modules loaded on demand
- [ ] Initial bundle minimal
- [ ] Lazy loading working
- [ ] No unnecessary code loaded

### Lighthouse Score (Requirement 12.4)
- [ ] Performance score ≥ 90
- [ ] Accessibility score ≥ 90
- [ ] Best practices score ≥ 90
- [ ] No critical issues

### Memory Usage
- [ ] No memory leaks
- [ ] Stable memory usage
- [ ] Garbage collection working
- [ ] Peak memory < 100 MB

### Network Performance
- [ ] Works on 3G
- [ ] Offline handling
- [ ] Retry mechanism
- [ ] No data loss

### Device Performance
- [ ] Works on low-end devices
- [ ] Mobile performance good
- [ ] No lag or stuttering
- [ ] Battery usage reasonable

---

## 11. Performance Report Template

```markdown
# Performance Validation Report

**Date:** [Date]
**Version:** [Version]
**Tester:** [Name]

## Summary

- **Overall Status:** ✅ PASSED / ❌ FAILED
- **Lighthouse Score:** [Score]/100
- **Bundle Size:** [Size] KB
- **Load Time:** [Time] ms
- **Preview Performance:** [Time] ms

## Detailed Results

### 1. Lighthouse Audit
- Performance: [Score]/100
- Accessibility: [Score]/100
- Best Practices: [Score]/100
- FCP: [Time] s
- LCP: [Time] s
- TBT: [Time] ms
- CLS: [Score]

### 2. Bundle Size Analysis
- main.js: [Size] KB
- vendor.js: [Size] KB
- preview.js: [Size] KB
- Total: [Size] KB

### 3. Load Time Testing
- 3G Load Time: [Time] ms
- DOMContentLoaded: [Time] ms
- Load Event: [Time] ms

### 4. Preview Performance
- Average Update: [Time] ms
- Max Update: [Time] ms
- Frame Rate: [FPS] fps

### 5. Memory Usage
- Initial: [Size] MB
- After 100 changes: [Size] MB
- Growth: [Size] MB
- Leaks: None / [Description]

## Issues Found

| Issue | Severity | Status |
|-------|----------|--------|
| | | |

## Recommendations

1. [Recommendation 1]
2. [Recommendation 2]

## Sign-Off

- **Status:** ✅ APPROVED / ❌ REJECTED
- **Date:** [Date]
- **Signature:** [Name]
```

---

**Document Version:** 1.0  
**Last Updated:** October 23, 2025  
**Task:** 21.3 - Performance validation
