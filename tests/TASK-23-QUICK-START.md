# Task 23: PHP Unit Tests - Quick Start Guide

## Running the Tests

### Basic Execution

```bash
# Run all unit tests
phpunit tests/unit/test-mase-classes.php

# Run specific test
phpunit --filter test_get_palette_with_valid_id tests/unit/test-mase-classes.php

# Run with verbose output
phpunit --verbose tests/unit/test-mase-classes.php
```

### Test Categories

```bash
# Run only MASE_Settings tests
phpunit --filter test_get_palette tests/unit/test-mase-classes.php
phpunit --filter test_apply_palette tests/unit/test-mase-classes.php
phpunit --filter test_save_custom_palette tests/unit/test-mase-classes.php

# Run only CSS Generator tests
phpunit --filter test_generate_palette_css tests/unit/test-mase-classes.php
phpunit --filter test_generate_glassmorphism_css tests/unit/test-mase-classes.php

# Run only Migration tests
phpunit --filter test_transform_settings tests/unit/test-mase-classes.php

# Run only Mobile Optimizer tests
phpunit --filter test_is_mobile tests/unit/test-mase-classes.php
```

## Test Coverage

**Total Tests:** 35 test methods covering:
- MASE_Settings (12 tests)
- MASE_CSS_Generator (6 tests)
- MASE_Migration (3 tests)
- MASE_Mobile_Optimizer (5 tests)
- Integration tests (5 tests)
- Performance tests (4 tests)

## Expected Results

All tests should pass with green output. Performance test validates CSS generation < 100ms.
