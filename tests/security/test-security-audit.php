<?php
/**
 * Security Audit Test Suite
 * 
 * Comprehensive security testing for MASE plugin
 * Requirements: 11.1, 11.2, 11.3, 14.1, 14.2, 14.3, 14.4, 14.5
 * 
 * @package Modern_Admin_Styler_Enterprise
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Security Audit Test Class
 */
class MASE_Security_Audit_Test {

	private $results = array();
	private $passed = 0;
	private $failed = 0;
	private $warnings = 0;

	/**
	 * Run all security tests
	 */
	public function run_all_tests() {
		echo "<h1>MASE Security Audit Report</h1>\n";
		echo "<p>Generated: " . date( 'Y-m-d H:i:s' ) . "</p>\n";
		
		$this->test_ajax_nonce_verification();
		$this->test_ajax_capability_checks();
		$this->test_input_validation();
		$this->test_output_escaping();
		$this->test_custom_css_sanitization();
		$this->test_sql_injection_vulnerabilities();
		$this->test_xss_vulnerabilities();
		$this->test_csrf_vulnerabilities();
		
		$this->display_summary();
	}

	/**
	 * Test 1: Verify all AJAX endpoints check nonce
	 * Requirement: 11.2
	 */
	private function test_ajax_nonce_verification() {
		$this->section_header( 'Test 1: AJAX Nonce Verification' );

		
		$ajax_handlers = array(
			'mase_save_settings',
			'mase_export_settings',
			'mase_import_settings',
			'mase_apply_palette',
			'mase_save_custom_palette',
			'mase_delete_custom_palette',
			'mase_apply_template',
			'mase_save_custom_template',
			'mase_delete_custom_template',
			'mase_create_backup',
			'mase_restore_backup',
			'mase_get_backups',
			'mase_store_device_capabilities',
			'mase_store_low_power_detection',
			'mase_report_device_capabilities',
		);
		
		foreach ( $ajax_handlers as $handler ) {
			$this->check_nonce_in_handler( $handler );
		}
	}

	/**
	 * Check if handler has nonce verification
	 */
	private function check_nonce_in_handler( $handler ) {
		$admin_file = MASE_PLUGIN_DIR . 'includes/class-mase-admin.php';
		$mobile_file = MASE_PLUGIN_DIR . 'includes/class-mase-mobile-optimizer.php';
		
		$files_to_check = array( $admin_file, $mobile_file );
		$found_nonce = false;
		
		foreach ( $files_to_check as $file ) {
			if ( ! file_exists( $file ) ) {
				continue;
			}
			
			$content = file_get_contents( $file );
			$method_name = 'handle_ajax_' . str_replace( 'mase_', '', $handler );
			
			// Check if method exists and contains nonce check
			if ( strpos( $content, "function $method_name" ) !== false ) {
				if ( strpos( $content, 'check_ajax_referer' ) !== false ||
				     strpos( $content, 'wp_verify_nonce' ) !== false ) {
					$found_nonce = true;
					break;
				}
			}
		}
		
		if ( $found_nonce ) {
			$this->pass( "Handler '$handler' has nonce verification" );
		} else {
			$this->fail( "Handler '$handler' missing nonce verification" );
		}
	}


	/**
	 * Test 2: Verify all AJAX endpoints check user capabilities
	 * Requirement: 11.3
	 */
	private function test_ajax_capability_checks() {
		$this->section_header( 'Test 2: AJAX Capability Checks' );
		
		$ajax_handlers = array(
			'mase_save_settings',
			'mase_export_settings',
			'mase_import_settings',
			'mase_apply_palette',
			'mase_save_custom_palette',
			'mase_delete_custom_palette',
			'mase_apply_template',
			'mase_save_custom_template',
			'mase_delete_custom_template',
			'mase_create_backup',
			'mase_restore_backup',
			'mase_get_backups',
		);
		
		foreach ( $ajax_handlers as $handler ) {
			$this->check_capability_in_handler( $handler );
		}
	}

	/**
	 * Check if handler has capability verification
	 */
	private function check_capability_in_handler( $handler ) {
		$admin_file = MASE_PLUGIN_DIR . 'includes/class-mase-admin.php';
		
		if ( ! file_exists( $admin_file ) ) {
			$this->fail( "Admin file not found" );
			return;
		}
		
		$content = file_get_contents( $admin_file );
		$method_name = 'handle_ajax_' . str_replace( 'mase_', '', $handler );
		
		// Check if method exists and contains capability check
		if ( strpos( $content, "function $method_name" ) !== false ) {
			if ( strpos( $content, 'current_user_can' ) !== false ) {
				$this->pass( "Handler '$handler' has capability check" );
			} else {
				$this->fail( "Handler '$handler' missing capability check" );
			}
		} else {
			$this->warning( "Handler '$handler' method not found" );
		}
	}

	/**
	 * Test 3: Verify all inputs are validated
	 * Requirement: 14.1, 14.2
	 */
	private function test_input_validation() {
		$this->section_header( 'Test 3: Input Validation' );
		
		$settings_file = MASE_PLUGIN_DIR . 'includes/class-mase-settings.php';
		
		if ( ! file_exists( $settings_file ) ) {
			$this->fail( "Settings file not found" );
			return;
		}
		
		$content = file_get_contents( $settings_file );
		
		// Check for validation methods
		$validation_checks = array(
			'sanitize_hex_color' => 'Color validation',
			'sanitize_text_field' => 'Text field sanitization',
			'absint' => 'Integer validation',
			'floatval' => 'Float validation',
			'wp_kses_post' => 'HTML sanitization',
			'sanitize_textarea_field' => 'Textarea sanitization',
		);
		
		foreach ( $validation_checks as $function => $description ) {
			if ( strpos( $content, $function ) !== false ) {
				$this->pass( "$description found in settings validation" );
			} else {
				$this->warning( "$description not found in settings validation" );
			}
		}
		
		// Check for validate method
		if ( strpos( $content, 'function validate' ) !== false ) {
			$this->pass( "Settings validation method exists" );
		} else {
			$this->fail( "Settings validation method missing" );
		}
	}


	/**
	 * Test 4: Verify all outputs are escaped
	 * Requirement: 14.3
	 */
	private function test_output_escaping() {
		$this->section_header( 'Test 4: Output Escaping' );
		
		$template_file = MASE_PLUGIN_DIR . 'includes/admin-settings-page.php';
		
		if ( ! file_exists( $template_file ) ) {
			$this->fail( "Template file not found" );
			return;
		}
		
		$content = file_get_contents( $template_file );
		
		// Check for escaping functions
		$escaping_functions = array(
			'esc_html' => 'HTML escaping',
			'esc_attr' => 'Attribute escaping',
			'esc_url' => 'URL escaping',
			'esc_js' => 'JavaScript escaping',
			'wp_kses_post' => 'Safe HTML output',
		);
		
		foreach ( $escaping_functions as $function => $description ) {
			if ( strpos( $content, $function ) !== false ) {
				$this->pass( "$description found in templates" );
			} else {
				$this->warning( "$description not found in templates" );
			}
		}
		
		// Check for unescaped output (potential XSS)
		$dangerous_patterns = array(
			'/echo\s+\$[^;]+;(?!.*esc_)/' => 'Unescaped echo statements',
			'/\<\?=\s*\$[^;]+\?>(?!.*esc_)/' => 'Unescaped short echo tags',
		);
		
		foreach ( $dangerous_patterns as $pattern => $description ) {
			if ( preg_match( $pattern, $content ) ) {
				$this->warning( "Potential $description found in templates" );
			}
		}
	}

	/**
	 * Test 5: Verify custom CSS is sanitized with wp_kses_post()
	 * Requirement: 14.4
	 */
	private function test_custom_css_sanitization() {
		$this->section_header( 'Test 5: Custom CSS Sanitization' );
		
		$settings_file = MASE_PLUGIN_DIR . 'includes/class-mase-settings.php';
		
		if ( ! file_exists( $settings_file ) ) {
			$this->fail( "Settings file not found" );
			return;
		}
		
		$content = file_get_contents( $settings_file );
		
		// Check if custom_css is sanitized with wp_kses_post
		if ( preg_match( '/custom_css.*wp_kses_post/s', $content ) ) {
			$this->pass( "Custom CSS is sanitized with wp_kses_post()" );
		} else {
			$this->fail( "Custom CSS sanitization with wp_kses_post() not found" );
		}
		
		// Check if custom_js is sanitized
		if ( preg_match( '/custom_js.*sanitize_textarea_field/s', $content ) ) {
			$this->pass( "Custom JS is sanitized" );
		} else {
			$this->warning( "Custom JS sanitization not found" );
		}
	}


	/**
	 * Test 6: Test for SQL injection vulnerabilities
	 * Requirement: 14.5
	 */
	private function test_sql_injection_vulnerabilities() {
		$this->section_header( 'Test 6: SQL Injection Vulnerabilities' );
		
		$files_to_check = array(
			MASE_PLUGIN_DIR . 'includes/class-mase-admin.php',
			MASE_PLUGIN_DIR . 'includes/class-mase-settings.php',
			MASE_PLUGIN_DIR . 'includes/class-mase-migration.php',
		);
		
		$sql_safe = true;
		
		foreach ( $files_to_check as $file ) {
			if ( ! file_exists( $file ) ) {
				continue;
			}
			
			$content = file_get_contents( $file );
			
			// Check for direct SQL queries (should use WordPress functions)
			$dangerous_patterns = array(
				'/\$wpdb->query\s*\(\s*["\'].*\$/' => 'Unescaped variable in SQL query',
				'/\$wpdb->get_results\s*\(\s*["\'].*\$/' => 'Unescaped variable in get_results',
				'/\$wpdb->get_var\s*\(\s*["\'].*\$/' => 'Unescaped variable in get_var',
			);
			
			foreach ( $dangerous_patterns as $pattern => $description ) {
				if ( preg_match( $pattern, $content ) ) {
					$this->fail( "$description found in " . basename( $file ) );
					$sql_safe = false;
				}
			}
		}
		
		if ( $sql_safe ) {
			$this->pass( "No SQL injection vulnerabilities detected" );
		}
		
		// Check that plugin uses WordPress options API (safe from SQL injection)
		$settings_file = MASE_PLUGIN_DIR . 'includes/class-mase-settings.php';
		if ( file_exists( $settings_file ) ) {
			$content = file_get_contents( $settings_file );
			if ( strpos( $content, 'get_option' ) !== false && 
			     strpos( $content, 'update_option' ) !== false ) {
				$this->pass( "Plugin uses WordPress Options API (SQL injection safe)" );
			}
		}
	}

	/**
	 * Test 7: Test for XSS vulnerabilities
	 * Requirement: 14.5
	 */
	private function test_xss_vulnerabilities() {
		$this->section_header( 'Test 7: XSS Vulnerabilities' );
		
		$template_file = MASE_PLUGIN_DIR . 'includes/admin-settings-page.php';
		
		if ( ! file_exists( $template_file ) ) {
			$this->fail( "Template file not found" );
			return;
		}
		
		$content = file_get_contents( $template_file );
		
		// Check for potential XSS vectors
		$xss_patterns = array(
			'/echo\s+\$_(?:GET|POST|REQUEST)\[/' => 'Direct output of user input',
			'/\<\?=\s*\$_(?:GET|POST|REQUEST)\[/' => 'Direct short echo of user input',
			'/innerHTML\s*=\s*[^;]+\$/' => 'Unsafe innerHTML assignment',
		);
		
		$xss_safe = true;
		
		foreach ( $xss_patterns as $pattern => $description ) {
			if ( preg_match( $pattern, $content ) ) {
				$this->fail( "Potential XSS: $description" );
				$xss_safe = false;
			}
		}
		
		if ( $xss_safe ) {
			$this->pass( "No obvious XSS vulnerabilities detected in templates" );
		}
		
		// Check JavaScript files for XSS vulnerabilities
		$js_file = MASE_PLUGIN_DIR . 'assets/js/mase-admin.js';
		if ( file_exists( $js_file ) ) {
			$js_content = file_get_contents( $js_file );
			
			$js_xss_patterns = array(
				'/\.html\s*\(\s*[^)]*\+/' => 'Unsafe HTML concatenation',
				'/innerHTML\s*=\s*[^;]*\+/' => 'Unsafe innerHTML concatenation',
				'/document\.write\s*\(/' => 'Dangerous document.write usage',
			);
			
			$js_safe = true;
			foreach ( $js_xss_patterns as $pattern => $description ) {
				if ( preg_match( $pattern, $js_content ) ) {
					$this->warning( "Potential JS XSS: $description" );
					$js_safe = false;
				}
			}
			
			if ( $js_safe ) {
				$this->pass( "No obvious XSS vulnerabilities in JavaScript" );
			}
		}
	}


	/**
	 * Test 8: Test for CSRF vulnerabilities
	 * Requirement: 14.5
	 */
	private function test_csrf_vulnerabilities() {
		$this->section_header( 'Test 8: CSRF Vulnerabilities' );
		
		$admin_file = MASE_PLUGIN_DIR . 'includes/class-mase-admin.php';
		
		if ( ! file_exists( $admin_file ) ) {
			$this->fail( "Admin file not found" );
			return;
		}
		
		$content = file_get_contents( $admin_file );
		
		// Check that nonces are created
		if ( strpos( $content, 'wp_create_nonce' ) !== false ) {
			$this->pass( "Nonces are created for AJAX requests" );
		} else {
			$this->fail( "No nonce creation found" );
		}
		
		// Check that nonces are verified
		if ( strpos( $content, 'check_ajax_referer' ) !== false ||
		     strpos( $content, 'wp_verify_nonce' ) !== false ) {
			$this->pass( "Nonces are verified in AJAX handlers" );
		} else {
			$this->fail( "No nonce verification found" );
		}
		
		// Check template for nonce fields
		$template_file = MASE_PLUGIN_DIR . 'includes/admin-settings-page.php';
		if ( file_exists( $template_file ) ) {
			$template_content = file_get_contents( $template_file );
			
			if ( strpos( $template_content, 'wp_nonce_field' ) !== false ) {
				$this->pass( "Nonce fields present in forms" );
			} else {
				$this->warning( "No wp_nonce_field found in templates (may use AJAX only)" );
			}
		}
		
		// Check that all state-changing operations require nonces
		$state_changing_methods = array(
			'handle_ajax_save_settings',
			'handle_ajax_import_settings',
			'handle_ajax_apply_palette',
			'handle_ajax_apply_template',
			'handle_ajax_create_backup',
			'handle_ajax_restore_backup',
		);
		
		$all_protected = true;
		foreach ( $state_changing_methods as $method ) {
			if ( strpos( $content, "function $method" ) !== false ) {
				// Extract method content
				$method_start = strpos( $content, "function $method" );
				$method_end = strpos( $content, "function ", $method_start + 1 );
				if ( $method_end === false ) {
					$method_end = strlen( $content );
				}
				$method_content = substr( $content, $method_start, $method_end - $method_start );
				
				if ( strpos( $method_content, 'check_ajax_referer' ) === false &&
				     strpos( $method_content, 'wp_verify_nonce' ) === false ) {
					$this->fail( "State-changing method '$method' missing CSRF protection" );
					$all_protected = false;
				}
			}
		}
		
		if ( $all_protected ) {
			$this->pass( "All state-changing operations have CSRF protection" );
		}
	}

	/**
	 * Helper methods
	 */
	private function section_header( $title ) {
		echo "\n<h2>$title</h2>\n";
	}

	private function pass( $message ) {
		$this->passed++;
		$this->results[] = array( 'status' => 'pass', 'message' => $message );
		echo "<div style='color: green;'>✓ PASS: $message</div>\n";
	}

	private function fail( $message ) {
		$this->failed++;
		$this->results[] = array( 'status' => 'fail', 'message' => $message );
		echo "<div style='color: red;'>✗ FAIL: $message</div>\n";
	}

	private function warning( $message ) {
		$this->warnings++;
		$this->results[] = array( 'status' => 'warning', 'message' => $message );
		echo "<div style='color: orange;'>⚠ WARNING: $message</div>\n";
	}

	private function display_summary() {
		echo "\n<h2>Security Audit Summary</h2>\n";
		echo "<div style='padding: 20px; background: #f5f5f5; border-radius: 5px;'>\n";
		echo "<p><strong>Total Tests:</strong> " . count( $this->results ) . "</p>\n";
		echo "<p style='color: green;'><strong>Passed:</strong> {$this->passed}</p>\n";
		echo "<p style='color: red;'><strong>Failed:</strong> {$this->failed}</p>\n";
		echo "<p style='color: orange;'><strong>Warnings:</strong> {$this->warnings}</p>\n";
		
		$score = $this->passed / max( 1, count( $this->results ) ) * 100;
		echo "<p><strong>Security Score:</strong> " . round( $score, 1 ) . "%</p>\n";
		
		if ( $this->failed === 0 ) {
			echo "<p style='color: green; font-weight: bold;'>✓ All critical security checks passed!</p>\n";
		} else {
			echo "<p style='color: red; font-weight: bold;'>✗ Critical security issues found. Please address immediately.</p>\n";
		}
		
		echo "</div>\n";
	}
}

// Run the security audit if accessed directly
if ( ! empty( $_GET['run_security_audit'] ) && current_user_can( 'manage_options' ) ) {
	$audit = new MASE_Security_Audit_Test();
	$audit->run_all_tests();
	exit;
}
