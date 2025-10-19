# Performance Testing Suite

This directory contains comprehensive performance tests for MASE v1.2.0.

## Performance Targets

Based on Requirements 4.1-4.5 and 17.1-17.5:

- **CSS Generation Time**: <100ms
- **Settings Save Time**: <500ms
- **Page Load Time**: <450ms
- **Memory Usage**: <50MB
- **Cache Hit Rate**: >80%
- **Lighthouse Score**: >95/100

## Test Files

### PHP Performance Tests

1. **test-css-generation-performance.php** - Measures CSS generation time
2. **test-settings-save-performance.php** - Measures settings save operations
3. **test-memory-usage.php** - Monitors memory consumption
4. **test-cache-performance.php** - Measures cache hit rates

### JavaScript Performance Tests

5. **test-javascript-performance.html** - Profiles JavaScript execution
6. **lighthouse-audit.js** - Automated Lighthouse testing

### Profiling Scripts

7. **profile-php-xdebug.sh** - PHP profiling with Xdebug
8. **profile-chrome-devtools.md** - Chrome DevTools profiling guide

## Running Tests

### Quick Test (All PHP Tests)
```bash
cd tests/performance
./run-performance-tests.sh
```

### Individual Tests
```bash
# CSS Generation
php test-css-generation-performance.php

# Settings Save
php test-settings-save-performance.php

# Memory Usage
php test-memory-usage.php

# Cache Performance
php test-cache-performance.php
```

### JavaScript Tests
```bash
# Open in browser
open test-javascript-performance.html

# Run Lighthouse (requires Node.js)
npm install -g lighthouse
node lighthouse-audit.js
```

### Profiling
```bash
# PHP Profiling with Xdebug
./profile-php-xdebug.sh

# Chrome DevTools - see profile-chrome-devtools.md
```

## Test Results

Results are saved to `performance-results/` directory with timestamps:
- `css-generation-YYYYMMDD-HHMMSS.json`
- `settings-save-YYYYMMDD-HHMMSS.json`
- `memory-usage-YYYYMMDD-HHMMSS.json`
- `cache-performance-YYYYMMDD-HHMMSS.json`
- `lighthouse-YYYYMMDD-HHMMSS.json`

## Interpreting Results

### Pass Criteria

✅ **PASS** - All metrics meet or exceed targets
⚠️ **WARNING** - Metrics within 10% of targets
❌ **FAIL** - Metrics exceed targets by >10%

### Example Output

```
=== CSS Generation Performance ===
Average Time: 87ms ✅
Min Time: 65ms
Max Time: 112ms
Target: <100ms
Status: PASS

=== Settings Save Performance ===
Average Time: 423ms ✅
Target: <500ms
Status: PASS

=== Memory Usage ===
Peak Memory: 42MB ✅
Target: <50MB
Status: PASS

=== Cache Hit Rate ===
Hit Rate: 87% ✅
Target: >80%
Status: PASS
```

## Continuous Monitoring

For production monitoring, see `../monitoring/performance-monitor.php`
