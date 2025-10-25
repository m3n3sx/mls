<?php
/**
 * Direct test of settings save without AJAX
 * Run this file directly in browser to see exact error
 */

// Load WordPress
$wp_load_paths = array(
    '../../../wp-load.php',
    '../../wp-load.php',
    '../wp-load.php',
    'wp-load.php'
);

$wp_loaded = false;
foreach ($wp_load_paths as $path) {
    if (file_exists($path)) {
        require_once($path);
        $wp_loaded = true;
        break;
    }
}

if (!$wp_loaded) {
    die('Could not find wp-load.php');
}

// Enable all error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

?>
<!DOCTYPE html>
<html>
<head>
    <title>Direct Save Test</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #f0f0f0; }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
        pre { background: white; padding: 15px; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <h1>MASE Direct Save Test</h1>
    
    <?php
    echo "<h2>Step 1: Check Classes</h2>";
    echo "<pre>";
    
    if (class_exists('MASE_Settings')) {
        echo "<span class='success'>✓ MASE_Settings exists</span>\n";
    } else {
        echo "<span class='error'>✗ MASE_Settings NOT found</span>\n";
        die('</pre></body></html>');
    }
    
    if (class_exists('MASE_Mobile_Optimizer')) {
        echo "<span class='success'>✓ MASE_Mobile_Optimizer exists</span>\n";
    } else {
        echo "<span class='error'>✗ MASE_Mobile_Optimizer NOT found</span>\n";
    }
    
    echo "</pre>";
    
    echo "<h2>Step 2: Instantiate Classes</h2>";
    echo "<pre>";
    
    try {
        $settings = new MASE_Settings();
        echo "<span class='success'>✓ MASE_Settings instantiated</span>\n";
    } catch (Exception $e) {
        echo "<span class='error'>✗ Exception: " . $e->getMessage() . "</span>\n";
        echo $e->getTraceAsString();
        die('</pre></body></html>');
    } catch (Error $e) {
        echo "<span class='error'>✗ Error: " . $e->getMessage() . "</span>\n";
        echo $e->getTraceAsString();
        die('</pre></body></html>');
    }
    
    try {
        $mobile_opt = new MASE_Mobile_Optimizer();
        echo "<span class='success'>✓ MASE_Mobile_Optimizer instantiated</span>\n";
    } catch (Exception $e) {
        echo "<span class='error'>✗ Exception: " . $e->getMessage() . "</span>\n";
        echo $e->getTraceAsString();
    } catch (Error $e) {
        echo "<span class='error'>✗ Error: " . $e->getMessage() . "</span>\n";
        echo $e->getTraceAsString();
    }
    
    echo "</pre>";
    
    echo "<h2>Step 3: Test Minimal Save</h2>";
    echo "<pre>";
    
    $test_data = array(
        'admin_bar' => array(
            'bg_color' => '#23282d',
            'text_color' => '#ffffff',
            'height' => 32
        )
    );
    
    echo "<span class='info'>Test data:</span>\n";
    print_r($test_data);
    echo "\n";
    
    try {
        echo "<span class='info'>Calling update_option()...</span>\n";
        $result = $settings->update_option($test_data);
        
        if ($result) {
            echo "<span class='success'>✓ Save successful!</span>\n";
        } else {
            echo "<span class='error'>✗ Save returned false</span>\n";
        }
    } catch (Exception $e) {
        echo "<span class='error'>✗ Exception during save:</span>\n";
        echo "Message: " . $e->getMessage() . "\n";
        echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
        echo "Trace:\n" . $e->getTraceAsString() . "\n";
    } catch (Error $e) {
        echo "<span class='error'>✗ Fatal Error during save:</span>\n";
        echo "Message: " . $e->getMessage() . "\n";
        echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
        echo "Trace:\n" . $e->getTraceAsString() . "\n";
    }
    
    echo "</pre>";
    
    echo "<h2>Step 4: Check Error Log</h2>";
    echo "<pre>";
    
    // Try to read WordPress debug log
    $debug_log = WP_CONTENT_DIR . '/debug.log';
    if (file_exists($debug_log)) {
        $lines = file($debug_log);
        $mase_lines = array_filter($lines, function($line) {
            return stripos($line, 'MASE') !== false;
        });
        
        if (!empty($mase_lines)) {
            echo "<span class='info'>Recent MASE errors:</span>\n";
            foreach (array_slice($mase_lines, -10) as $line) {
                echo htmlspecialchars($line);
            }
        } else {
            echo "<span class='info'>No MASE errors in debug.log</span>\n";
        }
    } else {
        echo "<span class='info'>No debug.log found. Enable WP_DEBUG_LOG in wp-config.php</span>\n";
    }
    
    echo "</pre>";
    ?>
    
    <h2>Conclusion</h2>
    <p>If you see this message, the script completed without fatal errors.</p>
    <p>Check the output above for any issues.</p>
    
</body>
</html>
