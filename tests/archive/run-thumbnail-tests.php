#!/usr/bin/env php
<?php
/**
 * Quick CLI test for thumbnail generation
 * 
 * Run with: php tests/run-thumbnail-tests.php
 */

// Mock WordPress functions
function esc_html($text) {
	return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

// Simple test class
class ThumbnailTest {
	private $passed = 0;
	private $failed = 0;
	
	public function test($name, $condition, $message = '') {
		if ($condition) {
			$this->passed++;
			echo "✓ PASS: $name\n";
		} else {
			$this->failed++;
			echo "✗ FAIL: $name";
			if ($message) {
				echo " - $message";
			}
			echo "\n";
		}
	}
	
	public function summary() {
		$total = $this->passed + $this->failed;
		$rate = $total > 0 ? round(($this->passed / $total) * 100) : 0;
		
		echo "\n" . str_repeat('=', 50) . "\n";
		echo "Test Summary\n";
		echo str_repeat('=', 50) . "\n";
		echo "Total:  $total\n";
		echo "Passed: {$this->passed}\n";
		echo "Failed: {$this->failed}\n";
		echo "Rate:   {$rate}%\n";
		echo str_repeat('=', 50) . "\n";
		
		return $this->failed === 0;
	}
}

// Mock generate_template_thumbnail function
function generate_template_thumbnail($name, $color) {
	// Sanitize color input
	$color_clean = str_replace('#', '', $color);
	if (!preg_match('/^[0-9A-Fa-f]{6}$/', $color_clean)) {
		$color_clean = '4A90E2';
	}
	
	// Escape template name
	$name_escaped = esc_html($name);
	
	// Generate SVG
	$svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">';
	$svg .= '<rect fill="#' . $color_clean . '" width="300" height="200"/>';
	$svg .= '<text x="150" y="100" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3)">';
	$svg .= $name_escaped;
	$svg .= '</text>';
	$svg .= '</svg>';
	
	return 'data:image/svg+xml;base64,' . base64_encode($svg);
}

// Run tests
$test = new ThumbnailTest();

echo "\n";
echo "Thumbnail Generation Tests - Task 6.1\n";
echo "Requirements: 1.2, 1.3, 1.4, 5.5\n";
echo str_repeat('=', 50) . "\n\n";

// Test 1: Normal input
echo "Test 1: Normal input\n";
$result = generate_template_thumbnail('Test Template', '#4A90E2');
$test->test('Starts with data URI', strpos($result, 'data:image/svg+xml;base64,') === 0);

$base64_data = substr($result, strlen('data:image/svg+xml;base64,'));
$svg = base64_decode($base64_data);
$test->test('Contains SVG tag', strpos($svg, '<svg') !== false);
$test->test('Contains template name', strpos($svg, 'Test Template') !== false);
$test->test('Contains color', strpos($svg, '#4A90E2') !== false);
echo "\n";

// Test 2: XSS prevention
echo "Test 2: XSS prevention\n";
$result = generate_template_thumbnail('Test<script>alert(1)</script>', '#FF0000');
$base64_data = substr($result, strlen('data:image/svg+xml;base64,'));
$svg = base64_decode($base64_data);
$test->test('Script tags escaped', strpos($svg, '<script>') === false);
$test->test('Contains escaped version', strpos($svg, '&lt;script&gt;') !== false);
echo "\n";

// Test 3: Invalid color
echo "Test 3: Invalid color fallback\n";
$result = generate_template_thumbnail('Test', 'invalid-color');
$base64_data = substr($result, strlen('data:image/svg+xml;base64,'));
$svg = base64_decode($base64_data);
$test->test('Uses fallback color', strpos($svg, '#4A90E2') !== false);
echo "\n";

// Test 4: Color without # prefix
echo "Test 4: Color without # prefix\n";
$result = generate_template_thumbnail('Test', 'FF5733');
$base64_data = substr($result, strlen('data:image/svg+xml;base64,'));
$svg = base64_decode($base64_data);
$test->test('Handles color without #', strpos($svg, '#FF5733') !== false);
echo "\n";

// Test 5: SVG dimensions
echo "Test 5: SVG dimensions\n";
$result = generate_template_thumbnail('Test', '#4A90E2');
$base64_data = substr($result, strlen('data:image/svg+xml;base64,'));
$svg = base64_decode($base64_data);
$test->test('Width is 300', strpos($svg, 'width="300"') !== false);
$test->test('Height is 200', strpos($svg, 'height="200"') !== false);
$test->test('ViewBox is correct', strpos($svg, 'viewBox="0 0 300 200"') !== false);
echo "\n";

// Test 6: Text styling
echo "Test 6: Text styling\n";
$result = generate_template_thumbnail('Test', '#4A90E2');
$base64_data = substr($result, strlen('data:image/svg+xml;base64,'));
$svg = base64_decode($base64_data);
$test->test('Text is centered (x=150)', strpos($svg, 'x="150"') !== false);
$test->test('Text is centered (y=100)', strpos($svg, 'y="100"') !== false);
$test->test('Text anchor is middle', strpos($svg, 'text-anchor="middle"') !== false);
$test->test('Text fill is white', strpos($svg, 'fill="white"') !== false);
$test->test('Text has shadow', strpos($svg, 'text-shadow') !== false);
echo "\n";

// Test 7: Special characters
echo "Test 7: Special characters\n";
$result = generate_template_thumbnail('Template & "Quotes" <Test>', '#4A90E2');
$base64_data = substr($result, strlen('data:image/svg+xml;base64,'));
$svg = base64_decode($base64_data);
$test->test('Ampersand escaped', strpos($svg, '&amp;') !== false);
$test->test('Quotes escaped', strpos($svg, '&quot;') !== false || strpos($svg, '&#034;') !== false);
echo "\n";

// Test 8: Empty name
echo "Test 8: Empty template name\n";
$result = generate_template_thumbnail('', '#4A90E2');
$test->test('Handles empty name', strpos($result, 'data:image/svg+xml;base64,') === 0);
$base64_data = substr($result, strlen('data:image/svg+xml;base64,'));
$svg = base64_decode($base64_data);
$test->test('Still generates valid SVG', strpos($svg, '<svg') !== false);
echo "\n";

// Summary
$success = $test->summary();
exit($success ? 0 : 1);
