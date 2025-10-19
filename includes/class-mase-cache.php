<?php
/**
 * MASE Cache Management Class
 *
 * Handles CSS caching using WordPress transients.
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class MASE_Cache
 *
 * Manages CSS caching with WordPress transients.
 */
class MASE_Cache {

	/**
	 * Cache key for storing generated CSS.
	 *
	 * @var string
	 */
	const CACHE_KEY = 'mase_generated_css';

	/**
	 * Cache key for visual effects CSS.
	 *
	 * @var string
	 */
	const VISUAL_EFFECTS_CACHE_KEY = 'mase_visual_effects_css';

	/**
	 * Cache key for typography CSS.
	 *
	 * @var string
	 */
	const TYPOGRAPHY_CACHE_KEY = 'mase_typography_css';

	/**
	 * Cache key for spacing CSS.
	 *
	 * @var string
	 */
	const SPACING_CACHE_KEY = 'mase_spacing_css';

	/**
	 * Get cached CSS from transient.
	 *
	 * @return string|false Cached CSS string or false if not found.
	 */
	public function get_cached_css() {
		return get_transient( self::CACHE_KEY );
	}

	/**
	 * Store CSS in transient cache.
	 *
	 * @param string $css      The CSS to cache.
	 * @param int    $duration Cache duration in seconds.
	 * @return bool True on success, false on failure.
	 */
	public function set_cached_css( $css, $duration ) {
		return set_transient( self::CACHE_KEY, $css, $duration );
	}

	/**
	 * Invalidate the CSS cache.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function invalidate_cache() {
		return delete_transient( self::CACHE_KEY );
	}

	/**
	 * Get cached visual effects CSS from transient.
	 *
	 * @return string|false Cached visual effects CSS string or false if not found.
	 */
	public function get_cached_visual_effects_css() {
		return get_transient( self::VISUAL_EFFECTS_CACHE_KEY );
	}

	/**
	 * Store visual effects CSS in transient cache.
	 *
	 * @param string $css      The visual effects CSS to cache.
	 * @param int    $duration Cache duration in seconds.
	 * @return bool True on success, false on failure.
	 */
	public function set_cached_visual_effects_css( $css, $duration ) {
		return set_transient( self::VISUAL_EFFECTS_CACHE_KEY, $css, $duration );
	}

	/**
	 * Invalidate the visual effects CSS cache.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function invalidate_visual_effects_cache() {
		return delete_transient( self::VISUAL_EFFECTS_CACHE_KEY );
	}

	/**
	 * Get cached typography CSS from transient.
	 *
	 * @return string|false Cached typography CSS string or false if not found.
	 */
	public function get_cached_typography_css() {
		return get_transient( self::TYPOGRAPHY_CACHE_KEY );
	}

	/**
	 * Store typography CSS in transient cache.
	 *
	 * @param string $css      The typography CSS to cache.
	 * @param int    $duration Cache duration in seconds.
	 * @return bool True on success, false on failure.
	 */
	public function set_cached_typography_css( $css, $duration ) {
		return set_transient( self::TYPOGRAPHY_CACHE_KEY, $css, $duration );
	}

	/**
	 * Invalidate the typography CSS cache.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function invalidate_typography_cache() {
		return delete_transient( self::TYPOGRAPHY_CACHE_KEY );
	}

	/**
	 * Get cached spacing CSS from transient.
	 *
	 * @return string|false Cached spacing CSS string or false if not found.
	 */
	public function get_cached_spacing_css() {
		return get_transient( self::SPACING_CACHE_KEY );
	}

	/**
	 * Store spacing CSS in transient cache.
	 *
	 * @param string $css      The spacing CSS to cache.
	 * @param int    $duration Cache duration in seconds.
	 * @return bool True on success, false on failure.
	 */
	public function set_cached_spacing_css( $css, $duration ) {
		return set_transient( self::SPACING_CACHE_KEY, $css, $duration );
	}

	/**
	 * Invalidate the spacing CSS cache.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function invalidate_spacing_cache() {
		return delete_transient( self::SPACING_CACHE_KEY );
	}

	/**
	 * Invalidate a specific cache key.
	 *
	 * Generic method to invalidate any cache by key.
	 *
	 * @param string $key Cache key to invalidate (without 'mase_' prefix).
	 * @return bool True on success, false on failure.
	 * @since 1.2.0
	 */
	public function invalidate( $key ) {
		return delete_transient( 'mase_' . $key );
	}

	/**
	 * Invalidate all CSS caches.
	 *
	 * @return bool True if all caches were invalidated successfully.
	 */
	public function invalidate_all_caches() {
		$result1 = $this->invalidate_cache();
		$result2 = $this->invalidate_visual_effects_cache();
		$result3 = $this->invalidate_typography_cache();
		$result4 = $this->invalidate_spacing_cache();

		return $result1 && $result2 && $result3 && $result4;
	}
}
