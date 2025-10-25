<?php
/**
 * Debug Logging Verification Test
 * 
 * Task 11: Verify debug logging
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 * 
 * This test verifies that all expected log messages appear in debug.log
 * when WP_DEBUG is enabled and settings are saved.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Enable WP_DEBUG in wp-config.php:
 *    define('WP_DEBUG', true);
 *    define('WP_DEBUG_LOG', true);
 *    define('WP_DEBUG_DISPLAY', false);
 * 
 * 2. Clear existing debug.log:
 *    rm wp-content/debug.log
 * 
 * 3. Run this test:
 *    php tests/test-debug-logging-verification.php
 * 
 * 4. Check debug.log for expected messages
 */

// Simulate WordPress environment
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/../');
}

// Test configuration
$test_results = array(
    'passed' => 0,
    'failed' => 0,
    'tests' => array()
);

/**
 * Record test result
 */
function record_test($name, $passed, $message = '') {
    global $test_results;
    
    $test_results['tests'][] = array(
        'name' => $name,
        'passed' => $passed,
        'message' => $message
    );
    
    if ($passed) {
        $test_results['passed']++;
        echo "✓ PASS: $name\n";
    } else {
        $test_results['failed']++;
        echo "✗ FAIL: $name\n";
        if ($message) {
            echo "  Message: $message\n";
        }
    }
}

/**
 * Check if debug.log exists and is readable
 */
function check_debug_log_exists() {
    $debug_log_path = ABSPATH . 'wp-content/debug.log';
    
    if (!file_exists($debug_log_path)) {
        record_test('Debug log file exists', false, 'File not found at: ' . $debug_log_path);
        return false;
    }
    
    if (!is_readable($debug_log_path)) {
        record_test('Debug log file readable', false, 'File exists but is not readable');
        return false;
    }
    
    record_test('Debug log file exists and readable', true);
    return $debug_log_path;
}

/**
 * Read debug log contents
 */
function read_debug_log($path) {
    $contents = file_get_contents($path);
    if ($contents === false) {
        record_test('Read debug log contents', false, 'Failed to read file');
        return false;
    }
    
    record_test('Read debug log contents', true, 'Read ' . strlen($contents) . ' bytes');
    return $contents;
}

/**
 * Verify log message exists
 */
function verify_log_message($log_contents, $pattern, $requirement, $description) {
    $found = preg_match('/' . preg_quote($pattern, '/') . '/i', $log_contents);
    
    record_test(
        "Requirement $requirement: $description",
        $found,
        $found ? "Found: $pattern" : "Missing: $pattern"
    );
    
    return $found;
}

/**
 * Verify log message with regex pattern
 */
function verify_log_pattern($log_contents, $regex, $requirement, $description) {
    $found = preg_match($regex, $log_contents, $matches);
    
    $message = $found ? "Found: " . (isset($matches[0]) ? $matches[0] : 'match') : "Missing pattern";
    
    record_test(
        "Requirement $requirement: $description",
        $found,
        $message
    );
    
    return $found;
}

echo "===========================================\n";
echo "Debug Logging Verification Test\n";
echo "Task 11 - Requirements 5.1, 5.2, 5.3, 5.4, 5.5\n";
echo "===========================================\n\n";

// Check if debug log exists
$debug_log_path = check_debug_log_exists();
if (!$debug_log_path) {
    echo "\nERROR: Cannot proceed without debug.log file\n";
    echo "Please ensure:\n";
    echo "1. WP_DEBUG is enabled in wp-config.php\n";
    echo "2. WP_DEBUG_LOG is enabled\n";
    echo "3. You have saved settings at least once\n";
    exit(1);
}

// Read debug log
$log_contents = read_debug_log($debug_log_path);
if (!$log_contents) {
    echo "\nERROR: Cannot read debug.log contents\n";
    exit(1);
}

echo "\n--- Testing Requirement 5.1: Log POST data keys and settings size ---\n";

// Requirement 5.1: Log incoming POST data keys and settings data size
verify_log_message(
    $log_contents,
    'MASE: POST keys:',
    '5.1',
    'Logs POST data keys'
);

verify_log_pattern(
    $log_contents,
    '/MASE: POST settings size: \d+ bytes \(\d+\.?\d* KB\)/',
    '5.1',
    'Logs settings data size in kilobytes'
);

echo "\n--- Testing Requirement 5.2: Log JSON decode success/failure ---\n";

// Requirement 5.2: Log JSON decode success/failure
$has_decode_success = verify_log_message(
    $log_contents,
    'MASE: JSON decoded successfully',
    '5.2',
    'Logs JSON decode success'
);

$has_decode_error = verify_log_message(
    $log_contents,
    'MASE: JSON decode error:',
    '5.2',
    'Logs JSON decode error (if occurred)'
);

// At least one should be present
if (!$has_decode_success && !$has_decode_error) {
    record_test(
        'Requirement 5.2: JSON decode logging',
        false,
        'Neither success nor error message found'
    );
}

echo "\n--- Testing Requirement 5.3: Log sections being validated ---\n";

// Requirement 5.3: Log sections being validated
verify_log_message(
    $log_contents,
    'MASE: Sections to validate:',
    '5.3',
    'Logs sections being validated before validate() call'
);

verify_log_message(
    $log_contents,
    'MASE: update_option called with sections:',
    '5.3',
    'Logs sections in update_option()'
);

echo "\n--- Testing Requirement 5.4: Log validation pass/fail status ---\n";

// Requirement 5.4: Log validation pass/fail status
$has_validation_passed = verify_log_message(
    $log_contents,
    'MASE: Validation status: PASSED',
    '5.4',
    'Logs validation passed status'
);

$has_validation_failed = verify_log_message(
    $log_contents,
    'MASE: Validation status: FAILED',
    '5.4',
    'Logs validation failed status (if occurred)'
);

// At least one should be present
if (!$has_validation_passed && !$has_validation_failed) {
    record_test(
        'Requirement 5.4: Validation status logging',
        false,
        'Neither passed nor failed status found'
    );
}

echo "\n--- Testing Requirement 5.5: Log validation error messages ---\n";

// Requirement 5.5: Log all validation error messages when validation fails
if ($has_validation_failed) {
    verify_log_message(
        $log_contents,
        'MASE: Validation error -',
        '5.5',
        'Logs validation error messages with field names'
    );
    
    verify_log_pattern(
        $log_contents,
        '/MASE: Total validation errors: \d+/',
        '5.5',
        'Logs total validation error count'
    );
} else {
    echo "  (Skipped - no validation failures in log)\n";
    record_test(
        'Requirement 5.5: Validation error logging',
        true,
        'No validation errors to log (validation passed)'
    );
}

echo "\n--- Testing Additional Logging ---\n";

// Additional important log messages
verify_log_message(
    $log_contents,
    'MASE: Calling update_option...',
    'Additional',
    'Logs before calling update_option()'
);

verify_log_pattern(
    $log_contents,
    '/MASE: update_option\(\) result: (SUCCESS|FAILED)/',
    'Additional',
    'Logs update_option() result'
);

verify_log_message(
    $log_contents,
    'MASE: Settings saved successfully',
    'Additional',
    'Logs successful save completion'
);

echo "\n--- Testing Log Message Clarity ---\n";

// Check for clear and actionable messages
$clear_messages = array(
    'MASE: POST keys:' => 'POST data keys are logged',
    'MASE: JSON decoded successfully' => 'JSON decode success is clear',
    'MASE: Validation status:' => 'Validation status is explicit',
    'MASE: Settings saved successfully' => 'Success message is clear'
);

foreach ($clear_messages as $pattern => $description) {
    verify_log_message($log_contents, $pattern, 'Clarity', $description);
}

echo "\n--- Testing Log Message Data Inclusion ---\n";

// Verify logs include relevant data
verify_log_pattern(
    $log_contents,
    '/MASE: Decoded sections: [a-z_,\s]+/',
    'Data',
    'Logs include section names'
);

verify_log_pattern(
    $log_contents,
    '/MASE: Section "[a-z_]+" size: \d+\.?\d* KB/',
    'Data',
    'Logs include section sizes'
);

echo "\n===========================================\n";
echo "Test Summary\n";
echo "===========================================\n";
echo "Total Tests: " . ($test_results['passed'] + $test_results['failed']) . "\n";
echo "Passed: " . $test_results['passed'] . "\n";
echo "Failed: " . $test_results['failed'] . "\n";
echo "Success Rate: " . round(($test_results['passed'] / ($test_results['passed'] + $test_results['failed'])) * 100, 2) . "%\n";

if ($test_results['failed'] > 0) {
    echo "\n--- Failed Tests ---\n";
    foreach ($test_results['tests'] as $test) {
        if (!$test['passed']) {
            echo "✗ " . $test['name'] . "\n";
            if ($test['message']) {
                echo "  " . $test['message'] . "\n";
            }
        }
    }
    echo "\nSome tests failed. Please review the debug.log file and ensure:\n";
    echo "1. WP_DEBUG is enabled\n";
    echo "2. Settings have been saved at least once\n";
    echo "3. All code changes from tasks 1-10 are implemented\n";
    exit(1);
}

echo "\n✓ All debug logging tests passed!\n";
echo "\nDebug log location: $debug_log_path\n";
echo "Log file size: " . filesize($debug_log_path) . " bytes\n";

exit(0);
