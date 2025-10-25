# Mobile Optimizer Error Handling Tests

## Overview

This test suite verifies that the MASE settings save operation is resilient to mobile optimizer failures, ensuring that settings are always saved successfully even when the mobile optimizer encounters errors.

## Requirements Tested

- **Requirement 3.1**: When MASE_Mobile_Optimizer class does not exist, THE MASE_Settings SHALL log a warning and continue saving settings without mobile optimization
- **Requirement 3.2**: When MASE_Mobile_Optimizer::is_mobile() throws an exception, THE MASE_Settings SHALL catch the exception, log the error, and continue saving settings without mobile optimization
- **Requirement 3.3**: When MASE_Mobile_Optimizer::get_optimized_settings() throws an exception, THE MASE_Settings SHALL catch the exception, log the error, and save the unoptimized settings
- **Requirement 3.4**: When mobile optimizer errors occur, THE MASE_Settings SHALL log the specific error message with the prefix "MASE: Mobile optimizer error:"
- **Requirement 3.5**: When mobile optimization is skipped due to errors, THE MASE_Settings SHALL still return true if the core settings were saved successfully

## Test Scenarios

### Test 1: Class Doesn't Exist Handling
Verifies that when the MASE_Mobile_Optimizer class is not available:
- `class_exists()` check is present
- Warning is logged when class doesn't exist
- Code continues execution
- Method returns true after mobile optimizer section

### Test 2: is_mobile() Exception Handling
Verifies that when `is_mobile()` throws an exception:
- Try-catch blocks are present (Exception and Error)
- `method_exists()` check for `is_mobile()` is present
- Error logging uses correct prefix
- Catch blocks continue execution (don't throw or return false)

### Test 3: get_optimized_settings() Exception Handling
Verifies that when `get_optimized_settings()` throws an exception:
- `method_exists()` check for `get_optimized_settings()` is present
- Mobile optimizer code is wrapped in try-catch
- Method returns true after update_option
- Mobile optimizer has internal error handling
- Mobile optimizer returns original settings on error

## Running the Tests

### Command Line

```bash
php tests/test-mobile-optimizer-error-handling.php
```

### Expected Output

```
Mobile Optimizer Error Handling Tests
======================================
Testing Requirements: 3.1, 3.2, 3.3, 3.4, 3.5

Test 1: Class Doesn't Exist Handling
-------------------------------------
✓ class_exists() check present
✓ Warning log present for missing class
✓ Code continues execution when class doesn't exist
✓ Method returns true after mobile optimizer section

Test 2: is_mobile() Exception Handling
---------------------------------------
✓ try block present
✓ catch ( Exception $e ) present
✓ catch ( Error $e ) present
✓ method_exists() check for is_mobile() present
✓ Error logging with 'MASE: Mobile optimizer error:' prefix present
✓ Catch blocks continue execution (don't throw or return false)

Test 3: get_optimized_settings() Exception Handling
----------------------------------------------------
✓ method_exists() check for get_optimized_settings() present
✓ Mobile optimizer code wrapped in try-catch
✓ Method returns true after update_option (Requirement 3.5)
✓ Mobile optimizer has internal error handling
✓ Mobile optimizer returns original settings on error
✓ Code references Requirement 3.5

Test Results Summary
====================

Passed: 3 / 3 tests

✓ All mobile optimizer error handling tests passed!
Settings save operation is resilient to mobile optimizer failures.
```

## Test Implementation

The test performs **code inspection** rather than runtime testing, examining:

1. **Code Structure**: Verifies presence of try-catch blocks, class_exists checks, and method_exists checks
2. **Error Handling**: Confirms proper error logging with correct prefixes
3. **Execution Flow**: Ensures code continues execution after errors
4. **Return Values**: Validates that methods return appropriate values

## Files Tested

- `includes/class-mase-settings.php` - Main settings class with mobile optimizer integration
- `includes/class-mase-mobile-optimizer.php` - Mobile optimizer class with internal error handling

## Success Criteria

All three tests must pass:
- ✓ Class Doesn't Exist Handling [3.1]
- ✓ is_mobile() Exception Handling [3.2, 3.4]
- ✓ get_optimized_settings() Exception Handling [3.3, 3.4, 3.5]

## Error Handling Strategy

The implementation uses a **layered error handling approach**:

1. **Class Existence Check**: `class_exists('MASE_Mobile_Optimizer')`
2. **Method Existence Checks**: `method_exists($mobile_optimizer, 'is_mobile')`
3. **Try-Catch Blocks**: Catch both `Exception` and `Error` (PHP 7+)
4. **Error Logging**: Log errors with "MASE: Mobile optimizer error:" prefix
5. **Graceful Degradation**: Continue save operation without mobile optimization
6. **Success Return**: Always return true if validation passed

## Related Documentation

- [Settings Save Fix Design](../.kiro/specs/settings-save-fix/design.md)
- [Settings Save Fix Requirements](../.kiro/specs/settings-save-fix/requirements.md)
- [Settings Save Fix Tasks](../.kiro/specs/settings-save-fix/tasks.md)
