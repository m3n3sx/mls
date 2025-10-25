<?php
/**
 * Test Background Cache Integration
 * 
 * Verifies that background system properly integrates with MASE cache system:
 * - Cache invalidation on settings save
 * - Cache invalidation on background image upload
 * - Cache invalidation on background image removal
 * - Mode-specific cache keys (light/dark)
 * - Cache warming for both modes
 * 
 * Task 40: Integrate with existing MASE cache system
 * Requirements: 7.4, 7.5
 * 
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.4.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Test Background Cache Integration
 */
class MASE_Background_Cache_Integration_Test {

	/**
	 * Run all tests
	 */
	public static function run_tests() {
		echo "<h1>Background Cache Integration Tests</h1>\n";
		echo "<p>Testing cache invalidation and warming for background system...</p>\n";

		$results = array(
			'cache_keys_exist'           => self::test_cache_keys_exist(),
			'cache_invalidation_methods' => self::test_cache_invalidation_methods(),
			'cache_warming_method'       => self::test_cache_warming_method(),
			'background_upload_cache'    => self::test_background_upload_cache_invalidation(),
			'background_removal_cache'   => self::test_background_removal_cache_invalidation(),
			'settings_save_cache'        => self::test_settings_save_cache_warming(),
		);

		// Display results.
		echo "<h2>Test Results</h2>\n";
		echo "<table border='1' cellpadding='10'>\n";
		echo "<tr><th>Test</th><th>Status</th><th>Details</th></tr>\n";

		$passed = 0;
		$failed = 0;

		foreach ( $results as $test => $result ) {
			$status = $result['passed'] ? '✅ PASS' : '❌ FAIL';
			$color = $result['passed'] ? 'green' : 'red';
			
			echo "<tr>\n";
			echo "<td>" . esc_html( $test ) . "</td>\n";
			echo "<td style='color: $color; font-weight: bold;'>" . esc_html( $status ) . "</td>\n";
			echo "<td>" . esc_html( $result['message'] ) . "</td>\n";
			echo "</tr>\n";

			if ( $result['passed'] ) {
				$passed++;
			} else {
				$failed++;
			}
		}

		echo "</table>\n";

		// Summary.
		echo "<h2>Summary</h2>\n";
		echo "<p><strong>Total Tests:</strong> " . count( $results ) . "</p>\n";
		echo "<p style='color: green;'><strong>Passed:</strong> $passed</p>\n";
		echo "<p style='color: red;'><strong>Failed:</strong> $failed</p>\n";

		if ( $failed === 0 ) {
			echo "<p style='color: green; font-size: 18px; font-weight: bold;'>✅ All tests passed!</p>\n";
		} else {
			echo "<p style='color: red; font-size: 18px; font-weight: bold;'>❌ Some tests failed. Please review.</p>\n";
		}
	}

	/**
	 * Test: Cache keys exist
	 */
	private static function test_cache_keys_exist() {
		$cache = new MASE_Cache();
		
		// Check if mode-specific cache key constants exist.
		$light_key_exists = defined( 'MASE_Cache::LIGHT_MODE_CACHE_KEY' );
		$dark_key_exists = defined( 'MASE_Cache::DARK_MODE_CACHE_KEY' );
		
		$passed = $light_key_exists && $dark_key_exists;
		
		return array(
			'passed' => $passed,
			'message' => $passed 
				? 'Mode-specific cache keys exist (LIGHT_MODE_CACHE_KEY, DARK_MODE_CACHE_KEY)'
				: 'Mode-specific cache keys missing',
		);
	}

	/**
	 * Test: Cache invalidation methods exist
	 */
	private static function test_cache_invalidation_methods() {
		$cache = new MASE_Cache();
		
		// Check if required methods exist.
		$methods = array(
			'invalidate_both_mode_caches',
			'invalidate_light_mode_cache',
			'invalidate_dark_mode_cache',
			'invalidate_mode_cache',
		);
		
		$missing = array();
		foreach ( $methods as $method ) {
			if ( ! method_exists( $cache, $method ) ) {
				$missing[] = $method;
			}
		}
		
		$passed = empty( $missing );
		
		return array(
			'passed' => $passed,
			'message' => $passed 
				? 'All cache invalidation methods exist'
				: 'Missing methods: ' . implode( ', ', $missing ),
		);
	}

	/**
	 * Test: Cache warming method exists and supports backgrounds
	 */
	private static function test_cache_warming_method() {
		$cache = new MASE_Cache();
		
		// Check if warm_mode_caches method exists.
		if ( ! method_exists( $cache, 'warm_mode_caches' ) ) {
			return array(
				'passed' => false,
				'message' => 'warm_mode_caches method does not exist',
			);
		}
		
		// Test cache warming with background settings.
		$generator = new MASE_CSS_Generator();
		$settings = array(
			'custom_backgrounds' => array(
				'dashboard' => array(
					'enabled' => true,
					'type' => 'image',
					'image_url' => 'https://example.com/bg.jpg',
				),
			),
		);
		
		try {
			$results = $cache->warm_mode_caches( $generator, $settings );
			
			// Check if results include background information.
			$has_bg_info = isset( $results['backgrounds'] ) && 
			               isset( $results['backgrounds']['enabled'] ) &&
			               isset( $results['backgrounds']['enabled_areas'] );
			
			$passed = $has_bg_info;
			
			return array(
				'passed' => $passed,
				'message' => $passed 
					? 'Cache warming supports backgrounds (returns background info)'
					: 'Cache warming does not return background information',
			);
		} catch ( Exception $e ) {
			return array(
				'passed' => false,
				'message' => 'Cache warming failed: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Test: Background upload handler invalidates cache
	 */
	private static function test_background_upload_cache_invalidation() {
		// Read the upload handler code to verify cache invalidation.
		$admin_file = MASE_PLUGIN_DIR . 'includes/class-mase-admin.php';
		
		if ( ! file_exists( $admin_file ) ) {
			return array(
				'passed' => false,
				'message' => 'Admin file not found',
			);
		}
		
		$content = file_get_contents( $admin_file );
		
		// Check if upload handler contains cache invalidation.
		$has_upload_handler = strpos( $content, 'function handle_ajax_upload_background_image' ) !== false;
		$has_cache_invalidation = strpos( $content, 'invalidate_both_mode_caches' ) !== false;
		
		// Check if cache invalidation is in the upload handler context.
		$upload_start = strpos( $content, 'function handle_ajax_upload_background_image' );
		$upload_end = strpos( $content, 'function optimize_background_image', $upload_start );
		
		if ( $upload_start !== false && $upload_end !== false ) {
			$upload_section = substr( $content, $upload_start, $upload_end - $upload_start );
			$has_invalidation_in_upload = strpos( $upload_section, 'invalidate_both_mode_caches' ) !== false;
		} else {
			$has_invalidation_in_upload = false;
		}
		
		$passed = $has_upload_handler && $has_cache_invalidation && $has_invalidation_in_upload;
		
		return array(
			'passed' => $passed,
			'message' => $passed 
				? 'Upload handler invalidates cache after successful upload'
				: 'Upload handler missing cache invalidation',
		);
	}

	/**
	 * Test: Background removal handler invalidates cache
	 */
	private static function test_background_removal_cache_invalidation() {
		// Read the removal handler code to verify cache invalidation.
		$admin_file = MASE_PLUGIN_DIR . 'includes/class-mase-admin.php';
		
		if ( ! file_exists( $admin_file ) ) {
			return array(
				'passed' => false,
				'message' => 'Admin file not found',
			);
		}
		
		$content = file_get_contents( $admin_file );
		
		// Check if removal handler contains cache invalidation.
		$has_removal_handler = strpos( $content, 'function handle_ajax_remove_background_image' ) !== false;
		
		// Check if cache invalidation is in the removal handler context.
		$removal_start = strpos( $content, 'function handle_ajax_remove_background_image' );
		
		if ( $removal_start !== false ) {
			// Find the end of the function (next function or end of class).
			$next_function = strpos( $content, 'public function', $removal_start + 10 );
			$removal_end = $next_function !== false ? $next_function : strlen( $content );
			
			$removal_section = substr( $content, $removal_start, $removal_end - $removal_start );
			$has_invalidation_in_removal = strpos( $removal_section, 'invalidate_both_mode_caches' ) !== false;
		} else {
			$has_invalidation_in_removal = false;
		}
		
		$passed = $has_removal_handler && $has_invalidation_in_removal;
		
		return array(
			'passed' => $passed,
			'message' => $passed 
				? 'Removal handler invalidates cache after successful removal'
				: 'Removal handler missing cache invalidation',
		);
	}

	/**
	 * Test: Settings save triggers cache warming
	 */
	private static function test_settings_save_cache_warming() {
		// Read the settings save handler code to verify cache warming.
		$admin_file = MASE_PLUGIN_DIR . 'includes/class-mase-admin.php';
		
		if ( ! file_exists( $admin_file ) ) {
			return array(
				'passed' => false,
				'message' => 'Admin file not found',
			);
		}
		
		$content = file_get_contents( $admin_file );
		
		// Check if save handler contains cache warming.
		$has_save_handler = strpos( $content, 'function handle_ajax_save_settings' ) !== false;
		$has_cache_warming = strpos( $content, 'warm_mode_caches' ) !== false;
		
		// Check if cache warming is in the save handler context.
		$save_start = strpos( $content, 'function handle_ajax_save_settings' );
		
		if ( $save_start !== false ) {
			// Find the end of the function.
			$next_function = strpos( $content, 'public function', $save_start + 10 );
			$save_end = $next_function !== false ? $next_function : strlen( $content );
			
			$save_section = substr( $content, $save_start, $save_end - $save_start );
			$has_warming_in_save = strpos( $save_section, 'warm_mode_caches' ) !== false;
		} else {
			$has_warming_in_save = false;
		}
		
		$passed = $has_save_handler && $has_cache_warming && $has_warming_in_save;
		
		return array(
			'passed' => $passed,
			'message' => $passed 
				? 'Settings save handler triggers cache warming for both modes'
				: 'Settings save handler missing cache warming',
		);
	}
}

// Run tests if accessed directly.
if ( isset( $_GET['run_test'] ) && $_GET['run_test'] === 'background_cache_integration' ) {
	MASE_Background_Cache_Integration_Test::run_tests();
}
