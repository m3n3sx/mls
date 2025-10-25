<?php
/**
 * Verify Template Thumbnails
 * 
 * Quick verification script to check if templates have thumbnails
 * Run this from WordPress admin or via CLI
 */

// Load WordPress
require_once dirname(__FILE__) . '/modern-admin-styler.php';

// Get settings instance
$settings = new MASE_Settings();

// Get all templates
$templates = $settings->get_all_templates();

echo "<!DOCTYPE html>\n";
echo "<html><head><title>Template Thumbnail Verification</title>\n";
echo "<style>\n";
echo "body { font-family: sans-serif; max-width: 1200px; margin: 40px auto; padding: 20px; background: #f5f5f5; }\n";
echo ".header { background: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }\n";
echo ".template-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }\n";
echo ".template-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n";
echo ".template-thumbnail { width: 100%; height: 200px; background: #e0e0e0; }\n";
echo ".template-thumbnail img { width: 100%; height: 100%; object-fit: cover; }\n";
echo ".template-info { padding: 15px; }\n";
echo ".template-name { font-weight: 600; margin: 0 0 8px 0; }\n";
echo ".template-status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }\n";
echo ".status-success { background: #27ae60; color: white; }\n";
echo ".status-error { background: #e74c3c; color: white; }\n";
echo ".summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }\n";
echo "</style>\n";
echo "</head><body>\n";

echo "<div class='header'>\n";
echo "<h1>Template Thumbnail Verification</h1>\n";
echo "<p>Task 6.2: Verify all templates have thumbnails</p>\n";
echo "</div>\n";

// Count templates with/without thumbnails
$total = count($templates);
$with_thumbnails = 0;
$without_thumbnails = 0;

foreach ($templates as $template) {
	if (!empty($template['thumbnail']) && strpos($template['thumbnail'], 'data:image/svg+xml;base64,') === 0) {
		$with_thumbnails++;
	} else {
		$without_thumbnails++;
	}
}

// Summary
echo "<div class='summary'>\n";
echo "<h2>Summary</h2>\n";
echo "<p><strong>Total Templates:</strong> $total</p>\n";
echo "<p><strong>With Thumbnails:</strong> $with_thumbnails</p>\n";
echo "<p><strong>Without Thumbnails:</strong> $without_thumbnails</p>\n";
echo "<p><strong>Status:</strong> ";
if ($without_thumbnails === 0) {
	echo "<span class='template-status status-success'>✓ ALL PASS</span>";
} else {
	echo "<span class='template-status status-error'>✗ SOME MISSING</span>";
}
echo "</p>\n";
echo "</div>\n";

// Display templates
echo "<div class='template-grid'>\n";

foreach ($templates as $template_id => $template) {
	$has_thumbnail = !empty($template['thumbnail']) && strpos($template['thumbnail'], 'data:image/svg+xml;base64,') === 0;
	
	echo "<div class='template-card'>\n";
	echo "<div class='template-thumbnail'>\n";
	
	if ($has_thumbnail) {
		echo "<img src='" . esc_attr($template['thumbnail']) . "' alt='" . esc_attr($template['name']) . "' />\n";
	} else {
		echo "<div style='display: flex; align-items: center; justify-content: center; height: 100%; color: #999;'>\n";
		echo "<span style='font-size: 48px;'>❌</span>\n";
		echo "</div>\n";
	}
	
	echo "</div>\n";
	echo "<div class='template-info'>\n";
	echo "<h3 class='template-name'>" . esc_html($template['name']) . "</h3>\n";
	echo "<p style='font-size: 12px; color: #666; margin: 0 0 8px 0;'>ID: " . esc_html($template_id) . "</p>\n";
	
	if ($has_thumbnail) {
		echo "<span class='template-status status-success'>✓ Has Thumbnail</span>\n";
		
		// Show thumbnail data length
		$data_length = strlen($template['thumbnail']);
		echo "<p style='font-size: 11px; color: #999; margin: 8px 0 0 0;'>Data URI length: " . number_format($data_length) . " bytes</p>\n";
	} else {
		echo "<span class='template-status status-error'>✗ Missing Thumbnail</span>\n";
	}
	
	echo "</div>\n";
	echo "</div>\n";
}

echo "</div>\n";

echo "</body></html>\n";
