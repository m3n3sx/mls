# MASE Integration Tests

## Overview

This directory contains comprehensive integration tests for Modern Admin Styler Enterprise (MASE) v1.2.0. These tests verify complete workflows from UI interactions through AJAX calls, settings updates, CSS generation, and caching.

## Test Coverage

### Task 25: Complete Workflow Integration Tests

**File:** `test-complete-workflows.php`

Tests five complete workflows as specified in Task 25:

#### 1. Complete Palette Application Workflow
**Requirements:** 1.1, 1.2, 1.3, 1.4, 4.1, 4.2, 4.3, 4.4, 4.5

Tests the complete flow:
- UI palette selection
- AJAX request simulation
- Settings update
- CSS generation (<100ms requirement)
- Cache storage
- Cache retrieval
- Cache invalidation

**Steps:**
1. Retrieve initial settings
2. Select palette (professional-blue)
3. Apply palette via settings
4. Verify settings updated with palette colors
5. Generate CSS and measure performance
6. Verify CSS contains palette colors
7. Cache the generated CSS
8. Retrieve from cache
9. Invalidate cache on change

#### 2. Complete Template Application Workflow
**Requirements:** 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.2, 4.3, 4.4, 4.5

Tests the complete flow:
- Template selection
- Multi-category settings update
- CSS generation with template styles
- Cache performance measurement
- Performance improvement calculation

**Steps:**
1. Retrieve initial settings
2. Select template (modern-minimal)
3. Apply template via settings
4. Verify all template categories applied
5. Generate CSS and measure performance
6. Verify CSS contains template-specific styles
7. Cache the template CSS
8. Measure cache performance vs generation

#### 3. Import/Export Round-Trip
**Requirements:** 8.1, 8.2, 8.3, 8.4, 8.5

Tests the complete flow:
- Settings export to JSON
- JSON structure validation
- Settings import
- Data integrity verification
- Invalid import handling

**Steps:**
1. Create unique test settings
2. Export settings to JSON
3. Verify JSON structure
4. Modify current settings
5. Import the exported JSON
6. Verify imported settings match original (5 checks)
7. Test invalid import handling
8. Verify cache invalidation after import

#### 4. Live Preview Updates
**Requirements:** 9.1, 9.2, 9.3, 9.4, 9.5

Tests the complete flow:
- Color picker changes
- CSS generation speed (<100ms)
- Preview without saving
- Rapid change handling (debouncing)
- Multiple simultaneous changes

**Steps:**
1. Retrieve baseline settings
2. Simulate color picker change
3. Generate preview CSS (<100ms requirement)
4. Verify preview CSS contains new color
5. Verify original settings unchanged
6. Test rapid changes (5 updates)
7. Verify slider changes
8. Test multiple simultaneous changes (3 properties)

#### 5. Backup/Restore Workflow
**Requirements:** 16.1, 16.2, 16.3, 16.4, 16.5

Tests the complete flow:
- Backup creation
- Backup structure validation
- Settings modification
- Restoration from backup
- Cache invalidation

**Steps:**
1. Create initial settings state
2. Create backup with metadata
3. Verify backup structure (5 fields)
4. Make significant changes
5. Verify changes applied
6. Restore from backup
7. Verify restoration accuracy (3 checks)
8. Verify cache invalidation
9. Check backup metadata
10. Clean up test backup

## Running Tests

### Via WordPress Admin

1. Navigate to the test file URL:
   ```
   /wp-content/plugins/woow-admin/tests/integration/test-complete-workflows.php?run_integration_tests=1
   ```

2. Ensure you're logged in as an administrator

3. View the test results in your browser

### Via WP-CLI

```bash
wp eval-file wp-content/plugins/woow-admin/tests/integration/test-complete-workflows.php
```

### Via Test Runner Script

```bash
./tests/integration/run-integration-tests.sh
```

## Test Results

Each test provides detailed step-by-step output showing:
- ✓ Passed steps with timing information
- ✗ Failed steps with error messages
- Performance metrics (CSS generation time, cache performance)
- Verification checks (X/Y checks passed)

### Example Output

```
Complete Palette Application Workflow
======================================
Step 1: Retrieved initial settings
Step 2: Selected palette: Professional Blue
Step 3: Applied palette via settings
Step 4: Verified settings updated with palette colors
Step 5: Generated CSS in 45.23ms
Step 6: Verified CSS contains palette colors
Step 7: Cached generated CSS
Step 8: Retrieved CSS from cache successfully
Step 9: Cache invalidated successfully

✓ PASSED: Complete palette workflow executed successfully in 45.23ms
```

## Performance Benchmarks

The tests verify the following performance requirements:

- **CSS Generation:** <100ms (Requirement 4.1)
- **Live Preview Updates:** <100ms (Requirement 9.3)
- **Settings Save:** <500ms (Requirement 17.2)
- **Cache Hit Rate:** >80% (Requirement 17.3)

## Requirements Mapping

| Test | Requirements Covered | Status |
|------|---------------------|--------|
| Palette Application | 1.1-1.5, 4.1-4.5 | ✅ Complete |
| Template Application | 2.1-2.5, 4.1-4.5 | ✅ Complete |
| Import/Export | 8.1-8.5 | ✅ Complete |
| Live Preview | 9.1-9.5 | ✅ Complete |
| Backup/Restore | 16.1-16.5 | ✅ Complete |

## Test Structure

Each test follows this pattern:

```php
private function test_workflow_name() {
    $test_name = 'Workflow Name';
    echo '<h2>' . esc_html( $test_name ) . '</h2>';
    
    try {
        // Step 1: Setup
        // Step 2: Action
        // Step 3: Verification
        // ... more steps
        
        $this->pass_test( $test_name, 'Success message' );
        
    } catch ( Exception $e ) {
        $this->fail_test( $test_name, $e->getMessage() );
    }
}
```

## Adding New Tests

To add new integration tests:

1. Create a new test method following the naming convention `test_*_workflow()`
2. Add detailed step-by-step logging
3. Include try-catch error handling
4. Verify all requirements are tested
5. Add performance measurements where applicable
6. Update this README with the new test documentation

### Example Template

```php
/**
 * Test X: New Workflow Name
 *
 * Tests: Step 1 → Step 2 → Step 3
 * Requirements: X.1, X.2, X.3
 */
private function test_new_workflow() {
    $test_name = 'New Workflow Name';
    echo '<h2>' . esc_html( $test_name ) . '</h2>';
    
    try {
        // Step 1: Description
        // Implementation
        echo '<p><strong>Step 1:</strong> Description</p>';
        
        // Step 2: Description
        // Implementation
        echo '<p><strong>Step 2:</strong> Description</p>';
        
        $this->pass_test( $test_name, 'Success message' );
        
    } catch ( Exception $e ) {
        $this->fail_test( $test_name, $e->getMessage() );
    }
}
```

## Troubleshooting

### Tests Not Running

1. Ensure WordPress is properly loaded
2. Check file permissions
3. Verify user has `manage_options` capability
4. Check PHP error logs

### Test Failures

1. Review the specific error message
2. Check that all required classes are loaded
3. Verify database connectivity
4. Ensure no conflicting plugins

### Performance Issues

1. Check server resources
2. Verify database optimization
3. Review cache configuration
4. Check for slow queries

## Dependencies

Required classes:
- `MASE_Settings`
- `MASE_CSS_Generator`
- `MASE_CacheManager`
- `MASE_Admin`

Required WordPress functions:
- `get_option()` / `update_option()` / `delete_option()`
- `current_user_can()`
- `wp_json_encode()` / `json_decode()`
- `esc_html()` / `esc_attr()`

## Related Documentation

- [Task 25 Implementation Summary](../TASK-25-IMPLEMENTATION-SUMMARY.md)
- [Requirements Document](../../.kiro/specs/mase-v1.2-complete-upgrade/requirements.md)
- [Design Document](../../.kiro/specs/mase-v1.2-complete-upgrade/design.md)
- [Main Plugin Documentation](../../README.md)

## Support

For issues or questions about integration tests:
1. Check this README
2. Review test implementation
3. Consult requirements and design documents
4. Check WordPress debug logs

---

**Last Updated:** Task 25 Implementation  
**Test Count:** 5 complete workflow tests  
**Coverage:** Requirements 1, 2, 4, 8, 9, 16
