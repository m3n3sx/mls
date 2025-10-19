# Performance Testing - Quick Start Guide

Get started with performance testing in 5 minutes.

## Prerequisites

- PHP 7.4+ installed
- Node.js (for Lighthouse, optional)
- WordPress site with MASE plugin (for Lighthouse, optional)

## Quick Test (Automated)

Run all automated PHP tests:

```bash
cd tests/performance
./run-performance-tests.sh
```

This will test:
- ✅ CSS generation time (<100ms)
- ✅ Settings save time (<500ms)
- ✅ Memory usage (<50MB)
- ✅ Cache hit rate (>80%)

Results saved to `performance-results/` directory.

## Individual Tests

### 1. CSS Generation Performance

```bash
php test-css-generation-performance.php
```

**Expected Output:**
```
=== CSS Generation Performance Test ===

Target: <100ms per generation
Iterations: 100

Testing: Simple Settings...
  Average: 87ms ✅
  Status: PASS

Testing: Complex Settings...
  Average: 95ms ✅
  Status: PASS
```

### 2. Settings Save Performance

```bash
php test-settings-save-performance.php
```

**Expected Output:**
```
=== Settings Save Performance Test ===

Target: <500ms per save
Iterations: 50

Testing: Simple Save...
  Average: 423ms ✅
  Status: PASS
```

### 3. Memory Usage

```bash
php test-memory-usage.php
```

**Expected Output:**
```
=== Memory Usage Performance Test ===

Target: <50MB

Testing: Baseline Memory...
  Memory: 8.50MB

Testing: Peak Memory Usage...
  Peak Memory: 42.30MB ✅
  Status: PASS
```

### 4. Cache Performance

```bash
php test-cache-performance.php
```

**Expected Output:**
```
=== Cache Performance Test ===

Target: >80% hit rate

Testing: Cache Hit Rate...
  Hits: 99
  Misses: 1
  Hit Rate: 99.00% ✅
  Status: PASS
```

## JavaScript Tests

1. Open in browser:
```bash
open test-javascript-performance.html
```

2. Click "Run All Tests"

3. Review results and export if needed

## Lighthouse Audit (Optional)

Requires running WordPress site:

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
node lighthouse-audit.js http://localhost/wp-admin
```

**Expected Output:**
```
=== Lighthouse Audit ===

Performance:     96/100 ✅
Accessibility:   98/100 ✅
Best Practices:  95/100 ✅
SEO:             100/100 ✅

Average:         97/100 ✅
Status: PASS
```

## Interpreting Results

### ✅ PASS
All metrics meet targets. No action needed.

### ⚠️ WARNING
Metrics within 10% of targets. Monitor closely.

### ❌ FAIL
Metrics exceed targets. Optimization needed.

## Common Issues

### "Class not found"
**Solution**: Run from correct directory:
```bash
cd tests/performance
```

### "Xdebug not installed"
**Solution**: Tests work without Xdebug. For profiling:
```bash
pecl install xdebug
```

### "Lighthouse not found"
**Solution**: Install Lighthouse:
```bash
npm install -g lighthouse
```

## Next Steps

1. ✅ Run automated tests
2. ✅ Review results in `performance-results/`
3. ✅ Run JavaScript tests in browser
4. ✅ Run Lighthouse on live site (optional)
5. ✅ Profile with Xdebug if issues found

## Need Help?

- See full documentation: `README.md`
- Implementation details: `TASK-28-IMPLEMENTATION-SUMMARY.md`
- Chrome DevTools guide: `profile-chrome-devtools.md`
- PHP profiling: `./profile-php-xdebug.sh`

## Expected Timeline

- Automated tests: ~2 minutes
- JavaScript tests: ~1 minute
- Lighthouse audit: ~2 minutes
- **Total: ~5 minutes**

## Success Criteria

All tests should pass with these results:

| Metric | Target | Typical Result |
|--------|--------|----------------|
| CSS Generation | <100ms | 85-95ms ✅ |
| Settings Save | <500ms | 400-450ms ✅ |
| Memory Usage | <50MB | 40-45MB ✅ |
| Cache Hit Rate | >80% | 85-95% ✅ |
| Page Load | <450ms | 350-400ms ✅ |
| Lighthouse | >95/100 | 96-98/100 ✅ |

If all tests pass, Task 28 is complete! 🎉
