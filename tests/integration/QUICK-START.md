# Quick Start: Palette Activation Integration Tests

## TL;DR

**Test File:** `tests/integration/test-palette-activation-flow.php`  
**Status:** ✅ Ready to run  
**Test Count:** 7 scenarios, 41 steps

---

## Fastest Way to Validate

```bash
# Validate structure (no WordPress needed)
php tests/integration/test-palette-activation-mock.php
```

**Expected Output:**
```
✓ Test structure is valid
✓ All required methods present
✓ 7 test scenarios ready
```

---

## Run Actual Tests

### Option 1: Browser (Recommended)
1. Open browser
2. Navigate to: `/wp-content/plugins/woow-admin/tests/integration/test-palette-activation-flow.php?run_palette_activation_tests=1`
3. Must be logged in as admin

### Option 2: Standalone PHP
```bash
php tests/integration/run-palette-test-standalone.php
```

### Option 3: WP-CLI (May have conflicts)
```bash
wp eval-file tests/integration/test-palette-activation-flow.php
```

---

## What Gets Tested

1. ✅ Complete palette activation (10 steps)
2. ✅ Invalid nonce error
3. ✅ Missing capability error
4. ✅ Missing palette ID error
5. ✅ Non-existent palette error
6. ✅ Cache invalidation
7. ✅ Settings persistence

---

## Expected Results

```
Total Tests: 7
Passed: 7
Failed: 0
Pass Rate: 100%
```

---

## Troubleshooting

**Problem:** WP-CLI error with LiteSpeed Cache  
**Solution:** Use browser method instead

**Problem:** Test file not found  
**Solution:** Run from plugin root directory

**Problem:** Permission denied  
**Solution:** Login as administrator

---

## More Info

- Full docs: `tests/integration/PALETTE-ACTIVATION-TEST-README.md`
- Completion summary: `tests/TASK-30-COMPLETION-SUMMARY.md`
- Integration tests: `tests/integration/README.md`
