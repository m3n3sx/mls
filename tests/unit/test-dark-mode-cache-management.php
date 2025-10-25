<?php
/**
 * Unit tests for dark mode cache management.
 *
 * Tests separate cache keys for light and dark modes, cache invalidation,
 * cache warming, and cache versioning.
 *
 * Requirements: 12.5, 12.6, 12.7
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.3.0
 */

// Mock WordPress functions for testing.
if ( ! function_exists( 'get_transient' ) ) {
	function get_transient( $key ) {
		global $test_transients;
		return isset( $test_transients[ $key ] ) ? $test_transients[ $key ] : false;
	}
}

if ( ! function_exists( 'set_transient' ) ) {
	function set_transient( $key, $value, $duration ) {
		global $test_transients;
		$test_transients[ $key ] = $value;
		return true;
	}
}

if ( ! function_exists( 'delete_transient' ) ) {
	function delete_transient( $key ) {
		global $test_transients;
		unset( $test_transients[ $key ] );
		return true;
	}
}

// Initialize test transients storage.
global $test_transients;
$test_transients = array();

// Load the cache class.
require_once __DIR__ . '/../../includes/class-mase-cache.php';

/**
 * Test separate cache keys for light and dark modes.
 *
 * Requirement 12.5: Create separate cache keys for light and dark CSS.
 */
function test_separate_cache_keys() {
	global $test_transients;
	$test_transients = array();
	
	$cache = new MASE_Cache();
	
	// Set light mode CSS.
	$light_css = 'body { background: white; }';
	$result = $cache->set_cached_light_mode_css( $light_css, 3600 );
	
	assert( true === $result, 'Light mode CSS should be cached' );
	
	// Set dark mode CSS.
	$dark_css = 'body { background: black; }';
	$result = $cache->set_cached_dark_mode_css( $dark_css, 3600 );
	
	assert( true === $result, 'Dark mode CSS should be cached' );
	
	// Retrieve light mode CSS.
	$retrieved_light = $cache->get_cached_light_mode_css();
	assert( $light_css === $retrieved_light, 'Light mode CSS should be retrieved correctly' );
	
	// Retrieve dark mode CSS.
	$retrieved_dark = $cache->get_cached_dark_mode_css();
	assert( $dark_css === $retrieved_dark, 'Dark mode CSS should be retrieved correctly' );
	
	// Verify they are stored separately.
	assert( $retrieved_light !== $retrieved_dark, 'Light and dark CSS should be different' );
	
	echo "✓ Test separate cache keys passed\n";
}

/**
 * Test invalidating only active mode cache.
 *
 * Requirement 12.5: Invalidate only active mode cache on toggle.
 */
function test_invalidate_mode_cache() {
	global $test_transients;
	$test_transients = array();
	
	$cache = new MASE_Cache();
	
	// Set both mode caches.
	$cache->set_cached_light_mode_css( 'light css', 3600 );
	$cache->set_cached_dark_mode_css( 'dark css', 3600 );
	
	// Invalidate only dark mode.
	$result = $cache->invalidate_mode_cache( 'dark' );
	assert( true === $result, 'Dark mode cache should be invalidated' );
	
	// Verify dark mode is cleared.
	$dark = $cache->get_cached_dark_mode_css();
	assert( false === $dark, 'Dark mode cache should be empty after invalidation' );
	
	// Verify light mode is still cached.
	$light = $cache->get_cached_light_mode_css();
	assert( 'light css' === $light, 'Light mode cache should still exist' );
	
	// Reset and test light mode invalidation.
	$test_transients = array();
	$cache->set_cached_light_mode_css( 'light css', 3600 );
	$cache->set_cached_dark_mode_css( 'dark css', 3600 );
	
	$result = $cache->invalidate_mode_cache( 'light' );
	assert( true === $result, 'Light mode cache should be invalidated' );
	
	// Verify light mode is cleared.
	$light = $cache->get_cached_light_mode_css();
	assert( false === $light, 'Light mode cache should be empty after invalidation' );
	
	// Verify dark mode is still cached.
	$dark = $cache->get_cached_dark_mode_css();
	assert( 'dark css' === $dark, 'Dark mode cache should still exist' );
	
	echo "✓ Test invalidate mode cache passed\n";
}

/**
 * Test invalidating both mode caches.
 *
 * Requirement 12.6: Invalidate both caches on palette change.
 */
function test_invalidate_both_caches() {
	global $test_transients;
	$test_transients = array();
	
	$cache = new MASE_Cache();
	
	// Set both mode caches.
	$cache->set_cached_light_mode_css( 'light css', 3600 );
	$cache->set_cached_dark_mode_css( 'dark css', 3600 );
	
	// Invalidate both.
	$result = $cache->invalidate_both_mode_caches();
	assert( true === $result, 'Both caches should be invalidated' );
	
	// Verify both are cleared.
	$light = $cache->get_cached_light_mode_css();
	$dark = $cache->get_cached_dark_mode_css();
	
	assert( false === $light, 'Light mode cache should be empty' );
	assert( false === $dark, 'Dark mode cache should be empty' );
	
	echo "✓ Test invalidate both caches passed\n";
}

/**
 * Test cache versioning.
 *
 * Requirement 12.7: Implement cache versioning.
 */
function test_cache_versioning() {
	global $test_transients;
	$test_transients = array();
	
	$cache = new MASE_Cache();
	
	// Set cache with current version.
	$cache->set_cached_light_mode_css( 'versioned css', 3600 );
	
	// Verify the key includes version.
	$version = MASE_Cache::CACHE_VERSION;
	$expected_key = 'mase_generated_css_light_v' . $version;
	
	assert( isset( $test_transients[ $expected_key ] ), 'Cache key should include version' );
	assert( 'versioned css' === $test_transients[ $expected_key ], 'Versioned cache should store CSS' );
	
	// Retrieve should work with versioned key.
	$retrieved = $cache->get_cached_light_mode_css();
	assert( 'versioned css' === $retrieved, 'Should retrieve from versioned cache' );
	
	echo "✓ Test cache versioning passed\n";
}

/**
 * Test cache warming functionality.
 *
 * Requirement 12.7: Add cache warming on settings save.
 */
function test_cache_warming() {
	global $test_transients;
	$test_transients = array();
	
	// Mock CSS generator.
	$generator = new class {
		public function generate( $settings ) {
			$mode = isset( $settings['dark_light_toggle']['current_mode'] ) 
				? $settings['dark_light_toggle']['current_mode'] 
				: 'light';
			return 'body { background: ' . $mode . '; }';
		}
	};
	
	$cache = new MASE_Cache();
	$settings = array(
		'performance' => array(
			'cache_duration' => 3600,
		),
	);
	
	// Warm caches.
	$results = $cache->warm_mode_caches( $generator, $settings );
	
	// Verify both modes were warmed.
	assert( isset( $results['light'] ), 'Light mode warming result should exist' );
	assert( isset( $results['dark'] ), 'Dark mode warming result should exist' );
	assert( true === $results['light'], 'Light mode cache should be warmed' );
	assert( true === $results['dark'], 'Dark mode cache should be warmed' );
	
	// Verify caches contain generated CSS.
	$light_css = $cache->get_cached_light_mode_css();
	$dark_css = $cache->get_cached_dark_mode_css();
	
	assert( false !== $light_css, 'Light mode cache should contain CSS' );
	assert( false !== $dark_css, 'Dark mode cache should contain CSS' );
	assert( strpos( $light_css, 'light' ) !== false, 'Light CSS should contain "light"' );
	assert( strpos( $dark_css, 'dark' ) !== false, 'Dark CSS should contain "dark"' );
	
	echo "✓ Test cache warming passed\n";
}

/**
 * Test invalidate_all_caches includes mode caches.
 */
function test_invalidate_all_includes_modes() {
	global $test_transients;
	$test_transients = array();
	
	$cache = new MASE_Cache();
	
	// Set all caches.
	$cache->set_cached_css( 'legacy css', 3600 );
	$cache->set_cached_light_mode_css( 'light css', 3600 );
	$cache->set_cached_dark_mode_css( 'dark css', 3600 );
	$cache->set_cached_visual_effects_css( 'effects css', 3600 );
	
	// Invalidate all.
	$result = $cache->invalidate_all_caches();
	assert( true === $result, 'All caches should be invalidated' );
	
	// Verify all are cleared.
	assert( false === $cache->get_cached_css(), 'Legacy cache should be empty' );
	assert( false === $cache->get_cached_light_mode_css(), 'Light mode cache should be empty' );
	assert( false === $cache->get_cached_dark_mode_css(), 'Dark mode cache should be empty' );
	assert( false === $cache->get_cached_visual_effects_css(), 'Effects cache should be empty' );
	
	echo "✓ Test invalidate all includes modes passed\n";
}

// Run all tests.
echo "Running dark mode cache management tests...\n\n";

try {
	test_separate_cache_keys();
	test_invalidate_mode_cache();
	test_invalidate_both_caches();
	test_cache_versioning();
	test_cache_warming();
	test_invalidate_all_includes_modes();
	
	echo "\n✓ All cache management tests passed!\n";
} catch ( AssertionError $e ) {
	echo "\n✗ Test failed: " . $e->getMessage() . "\n";
	echo "File: " . $e->getFile() . "\n";
	echo "Line: " . $e->getLine() . "\n";
	exit( 1 );
}
