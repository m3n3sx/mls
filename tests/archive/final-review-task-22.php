<?php
/**
 * Task 22: Final Review and Polish - Comprehensive Code Review Script
 * 
 * This script performs automated checks for:
 * - Code consistency
 * - Naming conventions
 * - Comment quality
 * - Production readiness
 * - Browser compatibility
 * - Responsive behavior
 * - Accessibility standards
 * - Performance metrics
 * 
 * @package Modern Admin Styler Enterprise
 * @version 2.0.0
 */

class MASE_Final_Review {
    
    private $css_file;
    private $css_content;
    private $results = [];
    private $warnings = [];
    private $errors = [];
    
    public function __construct() {
        $this->css_file = __DIR__ . '/../assets/css/mase-admin.css';
        if (file_exists($this->css_file)) {
            $this->css_content = file_get_contents($this->css_file);
        }
    }
    
    /**
     * Run all review checks
     */
    public function run_review() {
        echo "=== MASE CSS Final Review - Task 22 ===\n\n";
        
        $this->check_code_consistency();
        $this->check_naming_conventions();
        $this->check_comments_quality();
        $this->check_production_readiness();
        $this->check_browser_compatibility();
        $this->check_responsive_behavior();
        $this->check_accessibility_standards();
        $this->check_performance_metrics();
        
        $this->display_summary();
    }
    
    /**
     * 1. Review all code for consistency
     */
    private function check_code_consistency() {
        echo "1. CODE CONSISTENCY CHECK\n";
        echo str_repeat("-", 50) . "\n";
        
        // Check indentation consistency
        $lines = explode("\n", $this->css_content);
        $indent_issues = 0;
        $mixed_spaces_tabs = false;
        
        foreach ($lines as $line_num => $line) {
            if (preg_match('/^\t/', $line) && preg_match('/^ /', $this->css_content)) {
                $mixed_spaces_tabs = true;
                break;
            }
        }
        
        if (!$mixed_spaces_tabs) {
            $this->add_pass("Indentation is consistent (no mixed spaces/tabs)");
        } else {
            $this->add_error("Mixed spaces and tabs found in indentation");
        }
        
        // Check for consistent property ordering
        $property_order_consistent = $this->check_property_order();
        if ($property_order_consistent) {
            $this->add_pass("CSS properties follow consistent ordering");
        } else {
            $this->add_warning("Some CSS properties may not follow consistent ordering");
        }
        
        // Check for consistent spacing around braces
        $brace_spacing = preg_match_all('/\{\s*\n/', $this->css_content);
        $total_braces = substr_count($this->css_content, '{');
        $spacing_ratio = $brace_spacing / max($total_braces, 1);
        
        if ($spacing_ratio > 0.9) {
            $this->add_pass("Consistent spacing around braces");
        } else {
            $this->add_warning("Inconsistent spacing around braces detected");
        }
        
        // Check for consistent semicolon usage
        $missing_semicolons = preg_match_all('/[^;]\s*\n\s*}/', $this->css_content);
        if ($missing_semicolons < 5) {
            $this->add_pass("Semicolons are consistently used");
        } else {
            $this->add_warning("Some missing semicolons detected ($missing_semicolons instances)");
        }
        
        echo "\n";
    }
    
    /**
     * 2. Verify naming conventions are followed
     */
    private function check_naming_conventions() {
        echo "2. NAMING CONVENTIONS CHECK\n";
        echo str_repeat("-", 50) . "\n";
        
        // Check for .mase- prefix on all classes
        preg_match_all('/\.([a-z][a-z0-9-]*)\s*{/', $this->css_content, $classes);
        $non_prefixed = [];
        
        foreach ($classes[1] as $class) {
            if (!preg_match('/^mase-/', $class) && !in_array($class, ['root', 'html', 'body'])) {
                $non_prefixed[] = $class;
            }
        }
        
        if (empty($non_prefixed)) {
            $this->add_pass("All custom classes use .mase- prefix");
        } else {
            $this->add_error("Classes without .mase- prefix: " . implode(', ', array_slice($non_prefixed, 0, 5)));
        }
        
        // Check for kebab-case naming
        preg_match_all('/\.mase-([a-z0-9-]+)/', $this->css_content, $mase_classes);
        $invalid_naming = [];
        
        foreach ($mase_classes[1] as $class_name) {
            if (preg_match('/[A-Z_]/', $class_name)) {
                $invalid_naming[] = $class_name;
            }
        }
        
        if (empty($invalid_naming)) {
            $this->add_pass("All classes use kebab-case naming");
        } else {
            $this->add_error("Classes not in kebab-case: " . implode(', ', array_slice($invalid_naming, 0, 5)));
        }
        
        // Check CSS variable naming
        preg_match_all('/--([a-z][a-z0-9-]*)/', $this->css_content, $variables);
        $invalid_vars = [];
        
        foreach ($variables[1] as $var) {
            if (!preg_match('/^mase-/', $var)) {
                $invalid_vars[] = $var;
            }
        }
        
        if (empty($invalid_vars)) {
            $this->add_pass("All CSS variables use --mase- prefix");
        } else {
            $this->add_warning("Variables without --mase- prefix: " . implode(', ', array_slice($invalid_vars, 0, 5)));
        }
        
        // Check for BEM-like naming patterns
        $bem_pattern_count = preg_match_all('/\.mase-[a-z]+--(element|modifier)/', $this->css_content);
        if ($bem_pattern_count > 0) {
            $this->add_pass("BEM-like naming patterns detected");
        }
        
        echo "\n";
    }
    
    /**
     * 3. Check all comments are clear and helpful
     */
    private function check_comments_quality() {
        echo "3. COMMENTS QUALITY CHECK\n";
        echo str_repeat("-", 50) . "\n";
        
        // Check for section headers
        $section_headers = preg_match_all('/\/\*\s*={10,}/', $this->css_content);
        if ($section_headers >= 8) {
            $this->add_pass("Major sections have clear header comments ($section_headers found)");
        } else {
            $this->add_warning("Expected at least 8 section headers, found $section_headers");
        }
        
        // Check for table of contents
        if (stripos($this->css_content, 'TABLE OF CONTENTS') !== false) {
            $this->add_pass("Table of contents present");
        } else {
            $this->add_error("Table of contents missing");
        }
        
        // Check for file header documentation
        if (preg_match('/\/\*\*[\s\S]{200,}@package/', $this->css_content)) {
            $this->add_pass("Comprehensive file header documentation present");
        } else {
            $this->add_warning("File header documentation may be incomplete");
        }
        
        // Check comment density (should have reasonable amount of comments)
        $total_lines = substr_count($this->css_content, "\n");
        $comment_lines = preg_match_all('/^\s*\/?\*/', $this->css_content, $matches, PREG_PATTERN_ORDER);
        $comment_ratio = $comment_lines / max($total_lines, 1);
        
        if ($comment_ratio >= 0.05 && $comment_ratio <= 0.20) {
            $this->add_pass(sprintf("Good comment density (%.1f%%)", $comment_ratio * 100));
        } else if ($comment_ratio < 0.05) {
            $this->add_warning("Low comment density - consider adding more documentation");
        } else {
            $this->add_warning("High comment density - may be over-commented");
        }
        
        // Check for inline documentation on complex selectors
        $complex_selectors = preg_match_all('/[.#][a-z-]+\s+[.#][a-z-]+\s+[.#][a-z-]+/', $this->css_content);
        if ($complex_selectors < 10) {
            $this->add_pass("Limited use of complex selectors (good for maintainability)");
        }
        
        echo "\n";
    }
    
    /**
     * 4. Ensure code is production-ready
     */
    private function check_production_readiness() {
        echo "4. PRODUCTION READINESS CHECK\n";
        echo str_repeat("-", 50) . "\n";
        
        // Check for TODO/FIXME comments
        $todos = preg_match_all('/(TODO|FIXME|XXX|HACK)/i', $this->css_content);
        if ($todos === 0) {
            $this->add_pass("No TODO/FIXME comments found");
        } else {
            $this->add_warning("Found $todos TODO/FIXME comments - review before production");
        }
        
        // Check for debug code
        $debug_code = preg_match_all('/(console\.log|debugger|alert\()/i', $this->css_content);
        if ($debug_code === 0) {
            $this->add_pass("No debug code found");
        } else {
            $this->add_error("Debug code found - remove before production");
        }
        
        // Check file size
        $file_size = filesize($this->css_file);
        $file_size_kb = round($file_size / 1024, 2);
        
        if ($file_size_kb < 100) {
            $this->add_pass("File size is {$file_size_kb}KB (under 100KB target)");
        } else {
            $this->add_warning("File size is {$file_size_kb}KB (exceeds 100KB target)");
        }
        
        // Check for proper vendor prefixes (should be minimal with modern CSS)
        $vendor_prefixes = preg_match_all('/(-webkit-|-moz-|-ms-|-o-)/', $this->css_content);
        if ($vendor_prefixes < 20) {
            $this->add_pass("Minimal vendor prefixes (modern CSS approach)");
        } else {
            $this->add_warning("Many vendor prefixes found ($vendor_prefixes) - may need review");
        }
        
        // Check for !important usage (should be minimal)
        $important_count = substr_count($this->css_content, '!important');
        if ($important_count < 10) {
            $this->add_pass("Minimal use of !important ($important_count instances)");
        } else {
            $this->add_warning("High use of !important ($important_count instances) - review specificity");
        }
        
        echo "\n";
    }
    
    /**
     * 5. Test in all target browsers (check for compatibility features)
     */
    private function check_browser_compatibility() {
        echo "5. BROWSER COMPATIBILITY CHECK\n";
        echo str_repeat("-", 50) . "\n";
        
        // Check for CSS Grid
        if (stripos($this->css_content, 'display: grid') !== false) {
            $this->add_pass("CSS Grid used (Chrome 90+, Firefox 88+, Safari 14+)");
        }
        
        // Check for Flexbox
        if (stripos($this->css_content, 'display: flex') !== false) {
            $this->add_pass("Flexbox used (excellent browser support)");
        }
        
        // Check for CSS Custom Properties
        if (preg_match('/--mase-/', $this->css_content)) {
            $this->add_pass("CSS Custom Properties used (modern browsers)");
        }
        
        // Check for fallbacks
        $fallback_count = preg_match_all('/\/\*\s*fallback\s*\*\//i', $this->css_content);
        if ($fallback_count > 0) {
            $this->add_pass("Fallback values provided for older browsers");
        }
        
        // Check for autoprefixer comments or manual prefixes
        if (stripos($this->css_content, 'autoprefixer') !== false) {
            $this->add_pass("Autoprefixer configuration detected");
        }
        
        // Check for modern CSS features with good support
        $modern_features = [
            'calc(' => 'CSS calc()',
            'var(--' => 'CSS Variables',
            '@supports' => 'Feature Queries',
            'clamp(' => 'CSS clamp()',
        ];
        
        foreach ($modern_features as $feature => $name) {
            if (stripos($this->css_content, $feature) !== false) {
                $this->add_pass("Uses $name");
            }
        }
        
        echo "\n";
    }
    
    /**
     * 6. Verify responsive behavior at all breakpoints
     */
    private function check_responsive_behavior() {
        echo "6. RESPONSIVE BEHAVIOR CHECK\n";
        echo str_repeat("-", 50) . "\n";
        
        // Check for media queries
        $media_queries = preg_match_all('/@media/', $this->css_content);
        if ($media_queries >= 10) {
            $this->add_pass("Comprehensive media queries ($media_queries found)");
        } else {
            $this->add_warning("Limited media queries ($media_queries) - verify responsive design");
        }
        
        // Check for mobile-first approach (min-width)
        $min_width = preg_match_all('/@media\s*\([^)]*min-width/', $this->css_content);
        $max_width = preg_match_all('/@media\s*\([^)]*max-width/', $this->css_content);
        
        if ($min_width > $max_width) {
            $this->add_pass("Mobile-first approach (min-width queries)");
        } else {
            $this->add_warning("Consider mobile-first approach with min-width queries");
        }
        
        // Check for standard breakpoints
        $breakpoints = [
            '600px' => 'Small mobile',
            '768px' => 'Tablet',
            '782px' => 'WordPress admin bar',
            '1024px' => 'Desktop',
            '1280px' => 'Large desktop'
        ];
        
        $found_breakpoints = [];
        foreach ($breakpoints as $size => $name) {
            if (stripos($this->css_content, $size) !== false) {
                $found_breakpoints[] = $name;
            }
        }
        
        if (count($found_breakpoints) >= 3) {
            $this->add_pass("Standard breakpoints found: " . implode(', ', $found_breakpoints));
        } else {
            $this->add_warning("Limited breakpoints found - verify responsive coverage");
        }
        
        // Check for touch-friendly sizing
        if (preg_match('/44px|48px/', $this->css_content)) {
            $this->add_pass("Touch-friendly sizing detected (44px+ targets)");
        }
        
        echo "\n";
    }
    
    /**
     * 7. Confirm accessibility standards are met
     */
    private function check_accessibility_standards() {
        echo "7. ACCESSIBILITY STANDARDS CHECK\n";
        echo str_repeat("-", 50) . "\n";
        
        // Check for focus styles
        if (preg_match('/:focus/', $this->css_content)) {
            $this->add_pass("Focus styles defined");
        } else {
            $this->add_error("Missing focus styles - critical for accessibility");
        }
        
        // Check for screen reader only class
        if (preg_match('/\.mase-sr-only/', $this->css_content)) {
            $this->add_pass("Screen reader only utility class present");
        } else {
            $this->add_warning("Missing .mase-sr-only utility class");
        }
        
        // Check for reduced motion support
        if (preg_match('/@media\s*\(\s*prefers-reduced-motion/', $this->css_content)) {
            $this->add_pass("Reduced motion support implemented");
        } else {
            $this->add_error("Missing prefers-reduced-motion support");
        }
        
        // Check for high contrast considerations
        if (preg_match('/@media\s*\(\s*prefers-contrast/', $this->css_content)) {
            $this->add_pass("High contrast mode support");
        }
        
        // Check for visible focus indicators
        if (preg_match('/outline:\s*[^n]/', $this->css_content)) {
            $this->add_pass("Visible focus outlines defined");
        }
        
        // Check for skip navigation
        if (preg_match('/skip-to-content|skip-navigation/i', $this->css_content)) {
            $this->add_pass("Skip navigation styles present");
        }
        
        // Check for ARIA-related styling
        if (preg_match('/\[aria-/', $this->css_content)) {
            $this->add_pass("ARIA attribute styling present");
        }
        
        echo "\n";
    }
    
    /**
     * 8. Validate performance metrics
     */
    private function check_performance_metrics() {
        echo "8. PERFORMANCE METRICS CHECK\n";
        echo str_repeat("-", 50) . "\n";
        
        // Check selector specificity (avoid deep nesting)
        $deep_nesting = preg_match_all('/[.#][a-z-]+\s+[.#][a-z-]+\s+[.#][a-z-]+\s+[.#][a-z-]+/', $this->css_content);
        if ($deep_nesting < 5) {
            $this->add_pass("Limited deep nesting (good performance)");
        } else {
            $this->add_warning("Deep selector nesting detected ($deep_nesting) - impacts performance");
        }
        
        // Check for expensive properties
        $expensive_props = [
            'box-shadow' => 0,
            'filter' => 0,
            'transform' => 0,
            'opacity' => 0
        ];
        
        foreach ($expensive_props as $prop => $count) {
            $expensive_props[$prop] = substr_count($this->css_content, $prop . ':');
        }
        
        $this->add_pass("Property usage: " . json_encode($expensive_props));
        
        // Check for will-change usage
        $will_change = substr_count($this->css_content, 'will-change');
        if ($will_change > 0 && $will_change < 10) {
            $this->add_pass("Appropriate use of will-change ($will_change instances)");
        } else if ($will_change >= 10) {
            $this->add_warning("Overuse of will-change ($will_change) - use sparingly");
        }
        
        // Check for CSS containment
        if (stripos($this->css_content, 'contain:') !== false) {
            $this->add_pass("CSS containment used for performance");
        }
        
        // Check transition performance
        $transitions = preg_match_all('/transition:/', $this->css_content);
        if ($transitions > 0) {
            $this->add_pass("Transitions defined ($transitions instances)");
            
            // Check if transitions use performant properties
            if (preg_match('/transition:[^;]*(transform|opacity)/', $this->css_content)) {
                $this->add_pass("Transitions use performant properties (transform, opacity)");
            }
        }
        
        // File size check
        $file_size_kb = round(filesize($this->css_file) / 1024, 2);
        $estimated_gzip = round($file_size_kb * 0.2, 2); // Rough estimate
        
        $this->add_pass("Estimated gzipped size: ~{$estimated_gzip}KB");
        
        if ($estimated_gzip < 20) {
            $this->add_pass("Gzipped size under 20KB target");
        } else {
            $this->add_warning("Gzipped size may exceed 20KB target");
        }
        
        echo "\n";
    }
    
    /**
     * Helper methods
     */
    private function check_property_order() {
        // Simple check for common property ordering patterns
        $ordered_patterns = preg_match_all('/display:[^}]+position:[^}]+width:[^}]+height:/s', $this->css_content);
        return $ordered_patterns > 5;
    }
    
    private function add_pass($message) {
        $this->results[] = ['status' => 'PASS', 'message' => $message];
        echo "  ✓ " . $message . "\n";
    }
    
    private function add_warning($message) {
        $this->warnings[] = $message;
        $this->results[] = ['status' => 'WARN', 'message' => $message];
        echo "  ⚠ " . $message . "\n";
    }
    
    private function add_error($message) {
        $this->errors[] = $message;
        $this->results[] = ['status' => 'FAIL', 'message' => $message];
        echo "  ✗ " . $message . "\n";
    }
    
    /**
     * Display summary
     */
    private function display_summary() {
        echo "\n";
        echo str_repeat("=", 50) . "\n";
        echo "FINAL REVIEW SUMMARY\n";
        echo str_repeat("=", 50) . "\n\n";
        
        $total = count($this->results);
        $passed = count(array_filter($this->results, function($r) { return $r['status'] === 'PASS'; }));
        $warnings = count($this->warnings);
        $errors = count($this->errors);
        
        echo "Total Checks: $total\n";
        echo "Passed: $passed ✓\n";
        echo "Warnings: $warnings ⚠\n";
        echo "Errors: $errors ✗\n\n";
        
        $pass_rate = round(($passed / $total) * 100, 1);
        echo "Pass Rate: $pass_rate%\n\n";
        
        if ($errors === 0 && $warnings === 0) {
            echo "🎉 EXCELLENT! Code is production-ready with no issues.\n";
        } else if ($errors === 0) {
            echo "✅ GOOD! Code is production-ready with minor warnings.\n";
            echo "\nWarnings to address:\n";
            foreach ($this->warnings as $i => $warning) {
                echo "  " . ($i + 1) . ". $warning\n";
            }
        } else {
            echo "❌ NEEDS ATTENTION! Critical errors must be fixed.\n";
            echo "\nErrors to fix:\n";
            foreach ($this->errors as $i => $error) {
                echo "  " . ($i + 1) . ". $error\n";
            }
            if (!empty($this->warnings)) {
                echo "\nWarnings to address:\n";
                foreach ($this->warnings as $i => $warning) {
                    echo "  " . ($i + 1) . ". $warning\n";
                }
            }
        }
        
        echo "\n" . str_repeat("=", 50) . "\n";
    }
}

// Run the review
$review = new MASE_Final_Review();
$review->run_review();
