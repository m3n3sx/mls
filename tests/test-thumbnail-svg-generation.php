<?php
/**
 * Test Thumbnail SVG Generation
 * 
 * Tests the generate_template_thumbnail() method to verify:
 * - Valid base64 SVG data URI output
 * - XSS prevention with special characters
 * - Invalid color format handling
 * - SVG structure validation
 * 
 * Task 6.1: Test SVG generation
 * Requirements: 1.2, 1.3, 1.4, 5.5
 * 
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.2.0
 */

// Load WordPress environment
require_once dirname( __FILE__ ) . '/../modern-admin-styler.php';

// Test results array
$test_results = array();
$total_tests = 0;
$passed_tests = 0;

/**
 * Run a test and record results
 */
function run_test( $test_name, $test_function ) {
	global $test_results, $total_tests, $passed_tests;
	
	$total_tests++;
	
	try {
		$result = $test_function();
		
		if ( $result['passed'] ) {
			$passed_tests++;
			$test_results[] = array(
				'name' => $test_name,
				'status' => 'PASS',
				'message' => $result['message'],
			);
		} else {
			$test_results[] = array(
				'name' => $test_name,
				'status' => 'FAIL',
				'message' => $result['message'],
			);
		}
	} catch ( Exception $e ) {
		$test_results[] = array(
			'name' => $test_name,
			'status' => 'ERROR',
			'message' => $e->getMessage(),
		);
	}
}

/**
 * Test 1: Valid thumbnail generation with normal input
 */
run_test( 'Test 1: Valid thumbnail generation', function() {
	$settings = new MASE_Settings();
	
	// Use reflection to access private method
	$reflection = new ReflectionClass( $settings );
	$method = $reflection->getMethod( 'generate_template_thumbnail' );
	$method->setAccessible( true );
	
	$result = $method->invoke( $settings, 'Test Template', '#4A90E2' );
	
	// Check if result starts with correct data URI prefix
	if ( strpos( $result, 'data:image/svg+xml;base64,' ) !== 0 ) {
		return array(
			'passed' => false,
			'message' => 'Output does not start with data:image/svg+xml;base64,',
		);
	}
	
	// Decode base64 and verify it's valid SVG
	$base64_data = substr( $result, strlen( 'data:image/svg+xml;base64,' ) );
	$svg_content = base64_decode( $base64_data );
	
	if ( $svg_content === false ) {
		return array(
			'passed' => false,
			'message' => 'Failed to decode base64 data',
		);
	}
	
	// Check SVG structure
	if ( strpos( $svg_content, '<svg' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Decoded content is not valid SVG',
		);
	}
	
	if ( strpos( $svg_content, 'Test Template' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Template name not found in SVG',
		);
	}
	
	if ( strpos( $svg_content, '#4A90E2' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Color not found in SVG',
		);
	}
	
	return array(
		'passed' => true,
		'message' => 'Valid SVG data URI generated with correct structure',
	);
});

/**
 * Test 2: XSS prevention with special characters
 */
run_test( 'Test 2: XSS prevention with script tags', function() {
	$settings = new MASE_Settings();
	
	$reflection = new ReflectionClass( $settings );
	$method = $reflection->getMethod( 'generate_template_thumbnail' );
	$method->setAccessible( true );
	
	$malicious_name = 'Test<script>alert("XSS")</script>Template';
	$result = $method->invoke( $settings, $malicious_name, '#FF0000' );
	
	// Decode and check
	$base64_data = substr( $result, strlen( 'data:image/svg+xml;base64,' ) );
	$svg_content = base64_decode( $base64_data );
	
	// Should NOT contain script tags
	if ( strpos( $svg_content, '<script>' ) !== false ) {
		return array(
			'passed' => false,
			'message' => 'XSS vulnerability: script tags not sanitized',
		);
	}
	
	// Should contain escaped version
	if ( strpos( $svg_content, '&lt;script&gt;' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Script tags not properly escaped',
		);
	}
	
	return array(
		'passed' => true,
		'message' => 'XSS attack prevented: script tags properly escaped',
	);
});

/**
 * Test 3: Invalid color format handling
 */
run_test( 'Test 3: Invalid color format fallback', function() {
	$settings = new MASE_Settings();
	
	$reflection = new ReflectionClass( $settings );
	$method = $reflection->getMethod( 'generate_template_thumbnail' );
	$method->setAccessible( true );
	
	// Test with invalid color
	$result = $method->invoke( $settings, 'Test Template', 'invalid-color' );
	
	$base64_data = substr( $result, strlen( 'data:image/svg+xml;base64,' ) );
	$svg_content = base64_decode( $base64_data );
	
	// Should use fallback color #4A90E2
	if ( strpos( $svg_content, '#4A90E2' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Fallback color not applied for invalid input',
		);
	}
	
	return array(
		'passed' => true,
		'message' => 'Invalid color handled with fallback #4A90E2',
	);
});

/**
 * Test 4: Color without # prefix
 */
run_test( 'Test 4: Color without # prefix', function() {
	$settings = new MASE_Settings();
	
	$reflection = new ReflectionClass( $settings );
	$method = $reflection->getMethod( 'generate_template_thumbnail' );
	$method->setAccessible( true );
	
	$result = $method->invoke( $settings, 'Test Template', 'FF5733' );
	
	$base64_data = substr( $result, strlen( 'data:image/svg+xml;base64,' ) );
	$svg_content = base64_decode( $base64_data );
	
	// Should contain the color with # prefix
	if ( strpos( $svg_content, '#FF5733' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Color without # prefix not handled correctly',
		);
	}
	
	return array(
		'passed' => true,
		'message' => 'Color without # prefix handled correctly',
	);
});

/**
 * Test 5: SVG dimensions
 */
run_test( 'Test 5: SVG dimensions (300x200)', function() {
	$settings = new MASE_Settings();
	
	$reflection = new ReflectionClass( $settings );
	$method = $reflection->getMethod( 'generate_template_thumbnail' );
	$method->setAccessible( true );
	
	$result = $method->invoke( $settings, 'Test Template', '#4A90E2' );
	
	$base64_data = substr( $result, strlen( 'data:image/svg+xml;base64,' ) );
	$svg_content = base64_decode( $base64_data );
	
	// Check for correct dimensions
	if ( strpos( $svg_content, 'width="300"' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'SVG width is not 300',
		);
	}
	
	if ( strpos( $svg_content, 'height="200"' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'SVG height is not 200',
		);
	}
	
	if ( strpos( $svg_content, 'viewBox="0 0 300 200"' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'SVG viewBox is incorrect',
		);
	}
	
	return array(
		'passed' => true,
		'message' => 'SVG has correct dimensions (300x200)',
	);
});

/**
 * Test 6: Text styling and positioning
 */
run_test( 'Test 6: Text styling and positioning', function() {
	$settings = new MASE_Settings();
	
	$reflection = new ReflectionClass( $settings );
	$method = $reflection->getMethod( 'generate_template_thumbnail' );
	$method->setAccessible( true );
	
	$result = $method->invoke( $settings, 'Test Template', '#4A90E2' );
	
	$base64_data = substr( $result, strlen( 'data:image/svg+xml;base64,' ) );
	$svg_content = base64_decode( $base64_data );
	
	// Check text positioning (centered)
	if ( strpos( $svg_content, 'x="150"' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Text x position is not centered (150)',
		);
	}
	
	if ( strpos( $svg_content, 'y="100"' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Text y position is not centered (100)',
		);
	}
	
	// Check text styling
	if ( strpos( $svg_content, 'text-anchor="middle"' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Text anchor is not middle',
		);
	}
	
	if ( strpos( $svg_content, 'fill="white"' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Text fill is not white',
		);
	}
	
	// Check text shadow for contrast
	if ( strpos( $svg_content, 'text-shadow' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Text shadow not applied',
		);
	}
	
	return array(
		'passed' => true,
		'message' => 'Text is properly styled and positioned',
	);
});

/**
 * Test 7: Special characters in template name
 */
run_test( 'Test 7: Special characters handling', function() {
	$settings = new MASE_Settings();
	
	$reflection = new ReflectionClass( $settings );
	$method = $reflection->getMethod( 'generate_template_thumbnail' );
	$method->setAccessible( true );
	
	$special_name = 'Template & "Quotes" <Test>';
	$result = $method->invoke( $settings, $special_name, '#4A90E2' );
	
	$base64_data = substr( $result, strlen( 'data:image/svg+xml;base64,' ) );
	$svg_content = base64_decode( $base64_data );
	
	// Should contain escaped entities
	if ( strpos( $svg_content, '&amp;' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Ampersand not properly escaped',
		);
	}
	
	if ( strpos( $svg_content, '&quot;' ) === false && strpos( $svg_content, '&#034;' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Quotes not properly escaped',
		);
	}
	
	return array(
		'passed' => true,
		'message' => 'Special characters properly escaped',
	);
});

/**
 * Test 8: Empty template name
 */
run_test( 'Test 8: Empty template name', function() {
	$settings = new MASE_Settings();
	
	$reflection = new ReflectionClass( $settings );
	$method = $reflection->getMethod( 'generate_template_thumbnail' );
	$method->setAccessible( true );
	
	$result = $method->invoke( $settings, '', '#4A90E2' );
	
	// Should still generate valid SVG
	if ( strpos( $result, 'data:image/svg+xml;base64,' ) !== 0 ) {
		return array(
			'passed' => false,
			'message' => 'Failed to generate SVG with empty name',
		);
	}
	
	$base64_data = substr( $result, strlen( 'data:image/svg+xml;base64,' ) );
	$svg_content = base64_decode( $base64_data );
	
	if ( strpos( $svg_content, '<svg' ) === false ) {
		return array(
			'passed' => false,
			'message' => 'Invalid SVG structure with empty name',
		);
	}
	
	return array(
		'passed' => true,
		'message' => 'Empty template name handled gracefully',
	);
});

// Output results
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Thumbnail SVG Generation Tests - Task 6.1</title>
	<style>
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			max-width: 1200px;
			margin: 40px auto;
			padding: 20px;
			background: #f5f5f5;
		}
		.header {
			background: white;
			padding: 30px;
			border-radius: 8px;
			margin-bottom: 30px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		}
		h1 {
			margin: 0 0 10px 0;
			color: #2c3e50;
		}
		.summary {
			display: flex;
			gap: 20px;
			margin: 20px 0;
		}
		.summary-card {
			flex: 1;
			padding: 20px;
			background: white;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		}
		.summary-card h3 {
			margin: 0 0 10px 0;
			color: #7f8c8d;
			font-size: 14px;
			text-transform: uppercase;
		}
		.summary-card .value {
			font-size: 36px;
			font-weight: bold;
			color: #2c3e50;
		}
		.summary-card.pass .value {
			color: #27ae60;
		}
		.summary-card.fail .value {
			color: #e74c3c;
		}
		.test-results {
			background: white;
			border-radius: 8px;
			padding: 30px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		}
		.test-item {
			padding: 20px;
			margin-bottom: 15px;
			border-radius: 6px;
			border-left: 4px solid #95a5a6;
		}
		.test-item.pass {
			background: #d5f4e6;
			border-left-color: #27ae60;
		}
		.test-item.fail {
			background: #fadbd8;
			border-left-color: #e74c3c;
		}
		.test-item.error {
			background: #fff3cd;
			border-left-color: #f39c12;
		}
		.test-name {
			font-weight: 600;
			font-size: 16px;
			margin-bottom: 8px;
			color: #2c3e50;
		}
		.test-status {
			display: inline-block;
			padding: 4px 12px;
			border-radius: 4px;
			font-size: 12px;
			font-weight: 600;
			margin-left: 10px;
		}
		.test-status.pass {
			background: #27ae60;
			color: white;
		}
		.test-status.fail {
			background: #e74c3c;
			color: white;
		}
		.test-status.error {
			background: #f39c12;
			color: white;
		}
		.test-message {
			color: #555;
			line-height: 1.6;
		}
		.requirements {
			background: #ecf0f1;
			padding: 15px;
			border-radius: 6px;
			margin-top: 20px;
		}
		.requirements h3 {
			margin: 0 0 10px 0;
			color: #2c3e50;
			font-size: 14px;
		}
		.requirements ul {
			margin: 0;
			padding-left: 20px;
		}
		.requirements li {
			color: #555;
			margin-bottom: 5px;
		}
	</style>
</head>
<body>
	<div class="header">
		<h1>🧪 Thumbnail SVG Generation Tests</h1>
		<p><strong>Task 6.1:</strong> Test SVG generation</p>
		<p><strong>Requirements:</strong> 1.2, 1.3, 1.4, 5.5</p>
	</div>

	<div class="summary">
		<div class="summary-card">
			<h3>Total Tests</h3>
			<div class="value"><?php echo $total_tests; ?></div>
		</div>
		<div class="summary-card pass">
			<h3>Passed</h3>
			<div class="value"><?php echo $passed_tests; ?></div>
		</div>
		<div class="summary-card fail">
			<h3>Failed</h3>
			<div class="value"><?php echo $total_tests - $passed_tests; ?></div>
		</div>
		<div class="summary-card <?php echo ( $passed_tests === $total_tests ) ? 'pass' : 'fail'; ?>">
			<h3>Success Rate</h3>
			<div class="value"><?php echo $total_tests > 0 ? round( ( $passed_tests / $total_tests ) * 100 ) : 0; ?>%</div>
		</div>
	</div>

	<div class="test-results">
		<h2>Test Results</h2>
		<?php foreach ( $test_results as $result ) : ?>
			<div class="test-item <?php echo strtolower( $result['status'] ); ?>">
				<div class="test-name">
					<?php echo esc_html( $result['name'] ); ?>
					<span class="test-status <?php echo strtolower( $result['status'] ); ?>">
						<?php echo esc_html( $result['status'] ); ?>
					</span>
				</div>
				<div class="test-message">
					<?php echo esc_html( $result['message'] ); ?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>

	<div class="requirements">
		<h3>Requirements Tested:</h3>
		<ul>
			<li><strong>1.2:</strong> Generate SVG thumbnails dynamically using template's primary color</li>
			<li><strong>1.3:</strong> Render template name as centered text within thumbnail</li>
			<li><strong>1.4:</strong> Encode thumbnails as base64 data URIs</li>
			<li><strong>5.5:</strong> Sanitize all input parameters to prevent XSS vulnerabilities</li>
		</ul>
	</div>
</body>
</html>
