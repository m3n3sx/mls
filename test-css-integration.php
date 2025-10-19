<?php
/**
 * MASE CSS Integration Test
 * 
 * Quick verification that the new CSS framework is properly integrated
 * 
 * @package MASE
 * @version 2.0.0
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Test Results
 */
$test_results = array(
    'css_file_exists' => false,
    'css_file_readable' => false,
    'css_valid_syntax' => false,
    'css_variables_defined' => false,
    'responsive_breakpoints' => false,
    'accessibility_features' => false,
    'file_size' => 0,
    'line_count' => 0,
);

// Test 1: Check if CSS file exists
$css_file = plugin_dir_path( __FILE__ ) . 'assets/css/mase-admin.css';
$test_results['css_file_exists'] = file_exists( $css_file );

if ( $test_results['css_file_exists'] ) {
    // Test 2: Check if file is readable
    $test_results['css_file_readable'] = is_readable( $css_file );
    
    if ( $test_results['css_file_readable'] ) {
        $css_content = file_get_contents( $css_file );
        
        // Test 3: Get file stats
        $test_results['file_size'] = filesize( $css_file );
        $test_results['line_count'] = substr_count( $css_content, "\n" ) + 1;
        
        // Test 4: Check for CSS variables
        $test_results['css_variables_defined'] = (
            strpos( $css_content, '--mase-primary' ) !== false &&
            strpos( $css_content, '--mase-space-' ) !== false &&
            strpos( $css_content, '--mase-font-' ) !== false
        );
        
        // Test 5: Check for responsive breakpoints
        $test_results['responsive_breakpoints'] = (
            strpos( $css_content, '@media screen and (max-width: 782px)' ) !== false &&
            strpos( $css_content, '@media screen and (max-width: 600px)' ) !== false
        );
        
        // Test 6: Check for accessibility features
        $test_results['accessibility_features'] = (
            strpos( $css_content, '@media (prefers-contrast: high)' ) !== false &&
            strpos( $css_content, '@media (prefers-reduced-motion: reduce)' ) !== false &&
            strpos( $css_content, 'min-height: 44px' ) !== false // Touch targets
        );
        
        // Test 7: Basic CSS syntax validation
        $test_results['css_valid_syntax'] = (
            substr_count( $css_content, '{' ) === substr_count( $css_content, '}' )
        );
    }
}

// Display results
?>
<!DOCTYPE html>
<html>
<head>
    <title>MASE CSS Integration Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .test-container {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3338;
            margin-top: 0;
        }
        .test-result {
            display: flex;
            align-items: center;
            padding: 12px;
            margin: 8px 0;
            border-radius: 4px;
            background: #f9f9f9;
        }
        .test-result.pass {
            background: #e7f7ed;
            border-left: 4px solid #00a32a;
        }
        .test-result.fail {
            background: #fcf0f1;
            border-left: 4px solid #d63638;
        }
        .status {
            font-weight: bold;
            margin-right: 12px;
            min-width: 60px;
        }
        .pass .status {
            color: #00a32a;
        }
        .fail .status {
            color: #d63638;
        }
        .stats {
            margin-top: 30px;
            padding: 20px;
            background: #f0f6fc;
            border-radius: 4px;
            border-left: 4px solid #0073aa;
        }
        .stats h2 {
            margin-top: 0;
            color: #0073aa;
        }
        .stat-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #d0e4f5;
        }
        .stat-item:last-child {
            border-bottom: none;
        }
        .summary {
            margin-top: 30px;
            padding: 20px;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 500;
        }
        .summary.success {
            background: #e7f7ed;
            color: #00a32a;
            border: 2px solid #00a32a;
        }
        .summary.warning {
            background: #fef8ee;
            color: #f0b849;
            border: 2px solid #f0b849;
        }
    </style>
</head>
<body>
    <div class="test-container">
        <h1>🧪 MASE CSS Integration Test</h1>
        <p>Testing the new CSS framework integration...</p>
        
        <?php foreach ( $test_results as $test_name => $result ) : ?>
            <?php if ( is_bool( $result ) ) : ?>
                <div class="test-result <?php echo $result ? 'pass' : 'fail'; ?>">
                    <span class="status"><?php echo $result ? '✓ PASS' : '✗ FAIL'; ?></span>
                    <span><?php echo ucwords( str_replace( '_', ' ', $test_name ) ); ?></span>
                </div>
            <?php endif; ?>
        <?php endforeach; ?>
        
        <div class="stats">
            <h2>📊 File Statistics</h2>
            <div class="stat-item">
                <span>File Size:</span>
                <strong><?php echo number_format( $test_results['file_size'] / 1024, 2 ); ?> KB</strong>
            </div>
            <div class="stat-item">
                <span>Line Count:</span>
                <strong><?php echo number_format( $test_results['line_count'] ); ?> lines</strong>
            </div>
            <div class="stat-item">
                <span>File Path:</span>
                <code><?php echo esc_html( $css_file ); ?></code>
            </div>
        </div>
        
        <?php
        $all_passed = array_reduce(
            array_filter( $test_results, 'is_bool' ),
            function( $carry, $item ) {
                return $carry && $item;
            },
            true
        );
        ?>
        
        <div class="summary <?php echo $all_passed ? 'success' : 'warning'; ?>">
            <?php if ( $all_passed ) : ?>
                ✅ All tests passed! The CSS framework is properly integrated and ready for use.
            <?php else : ?>
                ⚠️ Some tests failed. Please review the results above and fix any issues.
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
