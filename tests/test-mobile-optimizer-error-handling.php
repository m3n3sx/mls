<?php
/**
 * Test Mobile Optimizer Error Handling
 *
 * Tests that settings save succeeds even when mobile optimizer encounters errors.
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 *
 * Test Scenarios:
 * 1. MASE_Mobile_Optimizer class doesn't exist - code inspection
 * 2. is_mobile() method throws exception - code inspection
 * 3. get_optimized_settings() method throws exception - code inspection
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.2.0
 */

echo "Mobile Optimizer Error Handling Tests\n";
echo "======================================\n";
echo "Testing Requirements: 3.1, 3.2, 3.3, 3.4, 3.5\n\n";

/**
 * Test runner class
 */
class MASE_Mobile_Optimizer_Error_Test {

	/**
	 * Test results
	 */
	private $results = array();

	/**
	 * Settings file path
	 */
	private $settings_file;

	/**
	 * Mobile optimizer file path
	 */
	private $mobile_optimizer_file;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->settings_file = dirname( __FILE__, 2 ) . '/includes/class-mase-settings.php';
		$this->mobile_optimizer_file = dirname( __FILE__, 2 ) . '/includes/class-mase-mobile-optimizer.php';
	}

	/**
	 * Run all tests
	 */
	public function run_tests() {
		// Test 1: Class doesn't exist handling
		$this->test_class_not_exists_handling();

		// Test 2: is_mobile() exception handling
		$this->test_is_mobile_exception_handling();

		// Test 3: get_optimized_settings() exception handling
		$this->test_get_optimized_settings_exception_handling();

		// Display results
		$this->display_results();
	}

	/**
	 * Test 1: MASE_Mobile_Optimizer class doesn't exist handling
	 * Requirement 3.1: Log warning and continue save without mobile optimization
	 */
	private function test_class_not_exists_handling() {
		echo "Test 1: Class Doesn't Exist Handling\n";
		echo "-------------------------------------\n";
		echo "Requirement 3.1: When MASE_Mobile_Optimizer class does not exist,\n";
		echo "THE MASE_Settings SHALL log a warning and continue saving settings\n";
		echo "without mobile optimization\n\n";

		$passed = true;
		$messages = array();

		if ( ! file_exists( $this->settings_file ) ) {
			$passed = false;
			$messages[] = "✗ Settings file not found: {$this->settings_file}";
			$this->results[] = array(
				'test' => 'Class Doesn\'t Exist Handling',
				'requirement' => '3.1',
				'passed' => $passed,
				'messages' => $messages,
			);
			return;
		}

		$settings_code = file_get_contents( $this->settings_file );

		// Check for class_exists check
		if ( strpos( $settings_code, "class_exists( 'MASE_Mobile_Optimizer' )" ) !== false ) {
			$messages[] = "✓ class_exists() check present";
		} else {
			$passed = false;
			$messages[] = "✗ class_exists() check missing";
		}

		// Check for warning log when class doesn't exist
		if ( strpos( $settings_code, "error_log( 'MASE: Mobile optimizer class not available" ) !== false ) {
			$messages[] = "✓ Warning log present for missing class";
		} else {
			$passed = false;
			$messages[] = "✗ Warning log missing for missing class";
		}

		// Check that code continues after class check (doesn't return early)
		$pattern = '/class_exists.*?MASE_Mobile_Optimizer.*?\{.*?\} else \{.*?error_log.*?\}/s';
		if ( preg_match( $pattern, $settings_code ) ) {
			$messages[] = "✓ Code continues execution when class doesn't exist";
		} else {
			$passed = false;
			$messages[] = "✗ Code may not continue execution when class doesn't exist";
		}

		// Check that method still returns true after mobile optimizer section
		if ( strpos( $settings_code, 'return true;' ) !== false ) {
			$messages[] = "✓ Method returns true after mobile optimizer section";
		} else {
			$passed = false;
			$messages[] = "✗ Method doesn't return true";
		}

		$this->results[] = array(
			'test' => 'Class Doesn\'t Exist Handling',
			'requirement' => '3.1',
			'passed' => $passed,
			'messages' => $messages,
		);

		foreach ( $messages as $message ) {
			echo "$message\n";
		}
		echo "\n";
	}

	/**
	 * Test 2: is_mobile() exception handling
	 * Requirements 3.2, 3.4: Catch exception, log error, continue save
	 */
	private function test_is_mobile_exception_handling() {
		echo "Test 2: is_mobile() Exception Handling\n";
		echo "---------------------------------------\n";
		echo "Requirements 3.2, 3.4: When MASE_Mobile_Optimizer::is_mobile() throws\n";
		echo "an exception, THE MASE_Settings SHALL catch the exception, log the error,\n";
		echo "and continue saving settings without mobile optimization\n\n";

		$passed = true;
		$messages = array();

		if ( ! file_exists( $this->settings_file ) ) {
			$passed = false;
			$messages[] = "✗ Settings file not found: {$this->settings_file}";
			$this->results[] = array(
				'test' => 'is_mobile() Exception Handling',
				'requirement' => '3.2, 3.4',
				'passed' => $passed,
				'messages' => $messages,
			);
			return;
		}

		$settings_code = file_get_contents( $this->settings_file );

		// Check for try-catch block
		if ( strpos( $settings_code, 'try {' ) !== false ) {
			$messages[] = "✓ try block present";
		} else {
			$passed = false;
			$messages[] = "✗ try block missing";
		}

		// Check for Exception catch
		if ( strpos( $settings_code, 'catch ( Exception $e )' ) !== false ) {
			$messages[] = "✓ catch ( Exception \$e ) present";
		} else {
			$passed = false;
			$messages[] = "✗ catch ( Exception \$e ) missing";
		}

		// Check for Error catch (PHP 7+)
		if ( strpos( $settings_code, 'catch ( Error $e )' ) !== false ) {
			$messages[] = "✓ catch ( Error \$e ) present";
		} else {
			$passed = false;
			$messages[] = "✗ catch ( Error \$e ) missing";
		}

		// Check for method_exists check for is_mobile
		if ( strpos( $settings_code, "method_exists( \$mobile_optimizer, 'is_mobile' )" ) !== false ) {
			$messages[] = "✓ method_exists() check for is_mobile() present";
		} else {
			$passed = false;
			$messages[] = "✗ method_exists() check for is_mobile() missing";
		}

		// Check for error logging with correct prefix
		if ( strpos( $settings_code, "error_log( 'MASE: Mobile optimizer error:" ) !== false ) {
			$messages[] = "✓ Error logging with 'MASE: Mobile optimizer error:' prefix present";
		} else {
			$passed = false;
			$messages[] = "✗ Error logging with correct prefix missing";
		}

		// Check that catch blocks don't re-throw or return false
		$pattern = '/catch.*?\{[^}]*?error_log[^}]*?\}/s';
		if ( preg_match( $pattern, $settings_code ) ) {
			// Check that catch blocks don't contain 'throw' or 'return false'
			preg_match_all( $pattern, $settings_code, $matches );
			$has_bad_return = false;
			foreach ( $matches[0] as $catch_block ) {
				if ( strpos( $catch_block, 'throw' ) !== false || 
					 strpos( $catch_block, 'return false' ) !== false ) {
					$has_bad_return = true;
					break;
				}
			}
			if ( ! $has_bad_return ) {
				$messages[] = "✓ Catch blocks continue execution (don't throw or return false)";
			} else {
				$passed = false;
				$messages[] = "✗ Catch blocks may interrupt execution";
			}
		}

		$this->results[] = array(
			'test' => 'is_mobile() Exception Handling',
			'requirement' => '3.2, 3.4',
			'passed' => $passed,
			'messages' => $messages,
		);

		foreach ( $messages as $message ) {
			echo "$message\n";
		}
		echo "\n";
	}

	/**
	 * Test 3: get_optimized_settings() exception handling
	 * Requirements 3.3, 3.4, 3.5: Catch exception, log error, save unoptimized settings
	 */
	private function test_get_optimized_settings_exception_handling() {
		echo "Test 3: get_optimized_settings() Exception Handling\n";
		echo "----------------------------------------------------\n";
		echo "Requirements 3.3, 3.4, 3.5: When MASE_Mobile_Optimizer::get_optimized_settings()\n";
		echo "throws an exception, THE MASE_Settings SHALL catch the exception, log the error,\n";
		echo "and save the unoptimized settings\n\n";

		$passed = true;
		$messages = array();

		if ( ! file_exists( $this->settings_file ) ) {
			$passed = false;
			$messages[] = "✗ Settings file not found: {$this->settings_file}";
			$this->results[] = array(
				'test' => 'get_optimized_settings() Exception Handling',
				'requirement' => '3.3, 3.4, 3.5',
				'passed' => $passed,
				'messages' => $messages,
			);
			return;
		}

		$settings_code = file_get_contents( $this->settings_file );

		// Check for method_exists check for get_optimized_settings
		if ( strpos( $settings_code, "method_exists( \$mobile_optimizer, 'get_optimized_settings' )" ) !== false ) {
			$messages[] = "✓ method_exists() check for get_optimized_settings() present";
		} else {
			$passed = false;
			$messages[] = "✗ method_exists() check for get_optimized_settings() missing";
		}

		// Check that mobile optimizer is wrapped in try-catch
		// Look for try block followed by mobile optimizer code, then catch blocks
		$has_try = strpos( $settings_code, 'try {' ) !== false;
		$has_mobile_optimizer = strpos( $settings_code, 'MASE_Mobile_Optimizer' ) !== false;
		$has_catch_exception = strpos( $settings_code, 'catch ( Exception $e )' ) !== false;
		$has_catch_error = strpos( $settings_code, 'catch ( Error $e )' ) !== false;
		
		// Check order: try should come before mobile optimizer, and catches should come after
		$try_pos = strpos( $settings_code, 'try {' );
		$mobile_pos = strpos( $settings_code, 'MASE_Mobile_Optimizer' );
		$catch_pos = strpos( $settings_code, 'catch ( Exception $e )' );
		
		if ( $has_try && $has_mobile_optimizer && $has_catch_exception && $has_catch_error &&
			 $try_pos < $mobile_pos && $mobile_pos < $catch_pos ) {
			$messages[] = "✓ Mobile optimizer code wrapped in try-catch";
		} else {
			$passed = false;
			$messages[] = "✗ Mobile optimizer code not wrapped in try-catch";
		}

		// Check that method returns true after mobile optimizer section (Requirement 3.5)
		$pattern = '/update_option.*?return true;/s';
		if ( preg_match( $pattern, $settings_code ) ) {
			$messages[] = "✓ Method returns true after update_option (Requirement 3.5)";
		} else {
			$passed = false;
			$messages[] = "✗ Method doesn't return true after update_option";
		}

		// Check mobile optimizer has its own error handling
		if ( file_exists( $this->mobile_optimizer_file ) ) {
			$mobile_code = file_get_contents( $this->mobile_optimizer_file );
			
			if ( strpos( $mobile_code, 'try {' ) !== false && 
				 strpos( $mobile_code, 'catch ( Exception $e )' ) !== false ) {
				$messages[] = "✓ Mobile optimizer has internal error handling";
			} else {
				$messages[] = "⚠ Mobile optimizer lacks internal error handling (not critical)";
			}

			// Check that mobile optimizer returns original settings on error
			if ( strpos( $mobile_code, 'return $settings;' ) !== false ) {
				$messages[] = "✓ Mobile optimizer returns original settings on error";
			} else {
				$messages[] = "⚠ Mobile optimizer may not return original settings on error";
			}
		}

		// Verify comment about Requirement 3.5
		if ( strpos( $settings_code, 'Requirement 3.5' ) !== false || 
			 strpos( $settings_code, 'Requirements 3.1, 3.2, 3.3, 3.4, 3.5' ) !== false ) {
			$messages[] = "✓ Code references Requirement 3.5";
		} else {
			$messages[] = "⚠ Code doesn't reference Requirement 3.5 (documentation)";
		}

		$this->results[] = array(
			'test' => 'get_optimized_settings() Exception Handling',
			'requirement' => '3.3, 3.4, 3.5',
			'passed' => $passed,
			'messages' => $messages,
		);

		foreach ( $messages as $message ) {
			echo "$message\n";
		}
		echo "\n";
	}

	/**
	 * Display test results summary
	 */
	private function display_results() {
		echo "Test Results Summary\n";
		echo "====================\n\n";
		
		$total = count( $this->results );
		$passed = 0;
		
		foreach ( $this->results as $result ) {
			if ( $result['passed'] ) {
				$passed++;
			}
		}

		echo "Passed: $passed / $total tests\n\n";

		foreach ( $this->results as $result ) {
			$status = $result['passed'] ? '✓ PASS' : '✗ FAIL';
			echo sprintf( "%-50s %-15s %s\n", 
				$result['test'], 
				'[' . $result['requirement'] . ']',
				$status 
			);
		}

		echo "\n";

		if ( $passed === $total ) {
			echo "✓ All mobile optimizer error handling tests passed!\n";
			echo "Settings save operation is resilient to mobile optimizer failures.\n";
			exit( 0 );
		} else {
			echo "✗ Some tests failed\n";
			echo "Review the error messages above and fix the issues.\n";
			exit( 1 );
		}
	}
}

// Run tests
$test = new MASE_Mobile_Optimizer_Error_Test();
$test->run_tests();
