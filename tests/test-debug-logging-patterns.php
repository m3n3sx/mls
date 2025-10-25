<?php
/**
 * Debug Logging Pattern Verification
 * 
 * Task 11: Verify debug logging
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 * 
 * This test verifies that the code contains all required log statements
 * by checking the source files directly.
 */

echo "===========================================\n";
echo "Debug Logging Pattern Verification\n";
echo "Task 11 - Requirements 5.1-5.5\n";
echo "===========================================\n\n";

$test_results = array(
    'passed' => 0,
    'failed' => 0,
    'tests' => array()
);

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

function check_file_contains($file, $pattern, $requirement, $description) {
    if (!file_exists($file)) {
        record_test("$requirement: $description", false, "File not found: $file");
        return false;
    }
    
    $contents = file_get_contents($file);
    $found = strpos($contents, $pattern) !== false;
    
    record_test(
        "$requirement: $description",
        $found,
        $found ? "Found in $file" : "Missing from $file: $pattern"
    );
    
    return $found;
}

echo "--- Checking class-mase-admin.php ---\n";

$admin_file = 'includes/class-mase-admin.php';

// Requirement 5.1: Log POST data keys and settings size
check_file_contains(
    $admin_file,
    "error_log( 'MASE: POST keys: '",
    'Req 5.1',
    'Logs POST data keys'
);

check_file_contains(
    $admin_file,
    'settings_size_kb',
    'Req 5.1',
    'Calculates settings size in KB'
);

check_file_contains(
    $admin_file,
    "error_log( 'MASE: POST settings size:",
    'Req 5.1',
    'Logs settings size'
);

// Requirement 5.2: Log JSON decode success/failure
check_file_contains(
    $admin_file,
    "error_log( 'MASE: JSON decoded successfully' )",
    'Req 5.2',
    'Logs JSON decode success'
);

check_file_contains(
    $admin_file,
    "error_log( 'MASE: JSON decode error:",
    'Req 5.2',
    'Logs JSON decode error'
);

check_file_contains(
    $admin_file,
    'json_last_error_msg()',
    'Req 5.2',
    'Includes JSON error message'
);

// Requirement 5.3: Log sections being validated
check_file_contains(
    $admin_file,
    "error_log( 'MASE: Sections to validate:",
    'Req 5.3',
    'Logs sections before validation'
);

check_file_contains(
    $admin_file,
    "error_log( 'MASE: Calling update_option...' )",
    'Req 5.3',
    'Logs before calling update_option'
);

// Requirement 5.4: Log validation pass/fail status
check_file_contains(
    $admin_file,
    "error_log( 'MASE: Validation status: FAILED' )",
    'Req 5.4',
    'Logs validation failed status'
);

check_file_contains(
    $admin_file,
    "error_log( 'MASE: Validation status: PASSED' )",
    'Req 5.4',
    'Logs validation passed status'
);

check_file_contains(
    $admin_file,
    "error_log( 'MASE: update_option() result:",
    'Req 5.4',
    'Logs update_option result'
);

// Requirement 5.5: Log validation error messages
check_file_contains(
    $admin_file,
    "error_log( 'MASE: Total validation errors:",
    'Req 5.5',
    'Logs total validation error count'
);

check_file_contains(
    $admin_file,
    "error_log( 'MASE: Validation error - '",
    'Req 5.5',
    'Logs individual validation errors'
);

echo "\n--- Checking class-mase-settings.php ---\n";

$settings_file = 'includes/class-mase-settings.php';

// Additional logging in MASE_Settings
check_file_contains(
    $settings_file,
    "error_log( 'MASE: update_option called with sections:",
    'Req 5.3',
    'Logs sections in update_option'
);

check_file_contains(
    $settings_file,
    "error_log( 'MASE: Validation error:",
    'Req 5.4',
    'Logs validation error in update_option'
);

check_file_contains(
    $settings_file,
    "error_log( 'MASE: Validation passed, validated sections:",
    'Req 5.4',
    'Logs validation passed in update_option'
);

check_file_contains(
    $settings_file,
    "error_log( 'MASE: Mobile optimizer",
    'Additional',
    'Logs mobile optimizer status'
);

echo "\n--- Checking Log Message Quality ---\n";

// Check for clear prefixes
check_file_contains(
    $admin_file,
    "'MASE:",
    'Quality',
    'Uses consistent MASE prefix'
);

// Check for structured logging
check_file_contains(
    $admin_file,
    "error_log( '=== MASE: Save Settings Debug ===' )",
    'Quality',
    'Uses structured debug sections'
);

// Check for data inclusion
check_file_contains(
    $admin_file,
    "implode( ', ', array_keys(",
    'Quality',
    'Includes array data in logs'
);

echo "\n===========================================\n";
echo "Test Summary\n";
echo "===========================================\n";
echo "Total Tests: " . ($test_results['passed'] + $test_results['failed']) . "\n";
echo "Passed: " . $test_results['passed'] . "\n";
echo "Failed: " . $test_results['failed'] . "\n";

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
    echo "\nSome logging patterns are missing from the code.\n";
    echo "Please ensure all tasks 1-10 are fully implemented.\n";
    exit(1);
}

echo "\n✓ All required logging patterns found in code!\n";
echo "\nNext steps:\n";
echo "1. Enable WP_DEBUG in wp-config.php\n";
echo "2. Save settings in WordPress admin\n";
echo "3. Run: ./tests/run-debug-logging-verification.sh\n";
echo "4. Verify actual log messages in debug.log\n";

exit(0);
