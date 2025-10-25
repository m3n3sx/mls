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
	 * Cache key for light mode CSS.
	 *
	 * @var string
	 * @since 1.3.0
	 */
	const LIGHT_MODE_CACHE_KEY = 'mase_generated_css_light';

	/**
	 * Cache key for dark mode CSS.
	 *
	 * @var string
	 * @since 1.3.0
	 */
	const DARK_MODE_CACHE_KEY = 'mase_generated_css_dark';

	/**
	 * Cache key for login page CSS.
	 *
	 * @var string
	 * @since 1.3.0
	 */
	const LOGIN_CSS_CACHE_KEY = 'mase_login_css';

	/**
	 * Cache key for button CSS.
	 *
	 * @var string
	 * @since 1.3.0
	 */
	const BUTTON_CSS_CACHE_KEY = 'mase_button_css';

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
	 * Cache version for invalidation.
	 *
	 * @var string
	 * @since 1.3.0
	 */
	const CACHE_VERSION = '1.3.0';

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
		$result5 = $this->invalidate_light_mode_cache();
		$result6 = $this->invalidate_dark_mode_cache();
		$result7 = $this->invalidate_login_css_cache();
		$result8 = $this->clear_button_css_cache();

		return $result1 && $result2 && $result3 && $result4 && $result5 && $result6 && $result7 && $result8;
	}

	/**
	 * Get cached light mode CSS from transient.
	 *
	 * @return string|false Cached light mode CSS string or false if not found.
	 * @since 1.3.0
	 */
	public function get_cached_light_mode_css() {
		$versioned_key = self::LIGHT_MODE_CACHE_KEY . '_v' . self::CACHE_VERSION;
		return get_transient( $versioned_key );
	}

	/**
	 * Store light mode CSS in transient cache.
	 *
	 * @param string $css      The light mode CSS to cache.
	 * @param int    $duration Cache duration in seconds.
	 * @return bool True on success, false on failure.
	 * @since 1.3.0
	 */
	public function set_cached_light_mode_css( $css, $duration ) {
		$versioned_key = self::LIGHT_MODE_CACHE_KEY . '_v' . self::CACHE_VERSION;
		return set_transient( $versioned_key, $css, $duration );
	}

	/**
	 * Invalidate the light mode CSS cache.
	 *
	 * @return bool True on success, false on failure.
	 * @since 1.3.0
	 */
	public function invalidate_light_mode_cache() {
		$versioned_key = self::LIGHT_MODE_CACHE_KEY . '_v' . self::CACHE_VERSION;
		return delete_transient( $versioned_key );
	}

	/**
	 * Get cached dark mode CSS from transient.
	 *
	 * @return string|false Cached dark mode CSS string or false if not found.
	 * @since 1.3.0
	 */
	public function get_cached_dark_mode_css() {
		$versioned_key = self::DARK_MODE_CACHE_KEY . '_v' . self::CACHE_VERSION;
		return get_transient( $versioned_key );
	}

	/**
	 * Store dark mode CSS in transient cache.
	 *
	 * @param string $css      The dark mode CSS to cache.
	 * @param int    $duration Cache duration in seconds.
	 * @return bool True on success, false on failure.
	 * @since 1.3.0
	 */
	public function set_cached_dark_mode_css( $css, $duration ) {
		$versioned_key = self::DARK_MODE_CACHE_KEY . '_v' . self::CACHE_VERSION;
		return set_transient( $versioned_key, $css, $duration );
	}

	/**
	 * Invalidate the dark mode CSS cache.
	 *
	 * @return bool True on success, false on failure.
	 * @since 1.3.0
	 */
	public function invalidate_dark_mode_cache() {
		$versioned_key = self::DARK_MODE_CACHE_KEY . '_v' . self::CACHE_VERSION;
		return delete_transient( $versioned_key );
	}

	/**
	 * Get cached login page CSS from transient.
	 * 
	 * Retrieves previously generated login page CSS from WordPress transient cache.
	 * Returns false if cache is expired or doesn't exist.
	 *
	 * @since 1.3.0
	 * @access public
	 * 
	 * @return string|false Cached login CSS string or false if not found/expired.
	 * 
	 * @see set_cached_login_css() Method to store login CSS in cache.
	 * @see invalidate_login_css_cache() Method to clear login CSS cache.
	 */
	public function get_cached_login_css() {
		return get_transient( self::LOGIN_CSS_CACHE_KEY );
	}

	/**
	 * Store login page CSS in transient cache.
	 * 
	 * Caches generated login page CSS in WordPress transient for performance.
	 * Typical duration is 1 hour (3600 seconds). Cache is invalidated when
	 * login customization settings are saved.
	 *
	 * @since 1.3.0
	 * @access public
	 * 
	 * @param string $css      The login CSS to cache.
	 * @param int    $duration Cache duration in seconds (default: 3600 = 1 hour).
	 * @return bool True on success, false on failure.
	 * 
	 * @see get_cached_login_css() Method to retrieve cached login CSS.
	 * @see invalidate_login_css_cache() Method to clear login CSS cache.
	 */
	public function set_cached_login_css( $css, $duration ) {
		return set_transient( self::LOGIN_CSS_CACHE_KEY, $css, $duration );
	}

	/**
	 * Invalidate the login page CSS cache.
	 * 
	 * Clears cached login page CSS, forcing regeneration on next login page load.
	 * Should be called whenever login customization settings are saved or files
	 * are uploaded.
	 *
	 * @since 1.3.0
	 * @access public
	 * 
	 * @return bool True on success, false on failure.
	 * 
	 * @see get_cached_login_css() Method to retrieve cached login CSS.
	 * @see set_cached_login_css() Method to store login CSS in cache.
	 */
	public function invalidate_login_css_cache() {
		return delete_transient( self::LOGIN_CSS_CACHE_KEY );
	}

	/**
	 * Get cached button CSS from transient.
	 * 
	 * Retrieves previously generated button CSS from WordPress transient cache.
	 * Returns false if cache is expired or doesn't exist.
	 *
	 * @since 1.3.0
	 * @access public
	 * 
	 * @return string|false Cached button CSS string or false if not found/expired.
	 * 
	 * @see set_cached_button_css() Method to store button CSS in cache.
	 * @see clear_button_css_cache() Method to clear button CSS cache.
	 */
	public function get_cached_button_css() {
		return get_transient( self::BUTTON_CSS_CACHE_KEY );
	}

	/**
	 * Store button CSS in transient cache.
	 * 
	 * Caches generated button CSS in WordPress transient for performance.
	 * Typical duration is 1 hour (3600 seconds). Cache is invalidated when
	 * button settings are saved or reset.
	 *
	 * @since 1.3.0
	 * @access public
	 * 
	 * @param string $css      The button CSS to cache.
	 * @param int    $duration Cache duration in seconds (default: 3600 = 1 hour).
	 * @return bool True on success, false on failure.
	 * 
	 * @see get_cached_button_css() Method to retrieve cached button CSS.
	 * @see clear_button_css_cache() Method to clear button CSS cache.
	 */
	public function set_cached_button_css( $css, $duration ) {
		return set_transient( self::BUTTON_CSS_CACHE_KEY, $css, $duration );
	}

	/**
	 * Clear button CSS cache.
	 * 
	 * Clears cached button CSS, forcing regeneration on next page load.
	 * Should be called whenever button settings are saved or reset.
	 *
	 * @since 1.3.0
	 * @access public
	 * 
	 * @return bool True on success, false on failure.
	 * 
	 * @see get_cached_button_css() Method to retrieve cached button CSS.
	 * @see set_cached_button_css() Method to store button CSS in cache.
	 */
	public function clear_button_css_cache() {
		return delete_transient( self::BUTTON_CSS_CACHE_KEY );
	}

	/**
	 * Invalidate mode-specific cache based on current mode.
	 *
	 * Only invalidates the cache for the specified mode, leaving the other mode's cache intact.
	 * Requirement 12.5: Invalidate only active mode cache on toggle.
	 *
	 * @param string $mode The mode to invalidate ('light' or 'dark').
	 * @return bool True on success, false on failure.
	 * @since 1.3.0
	 */
	public function invalidate_mode_cache( $mode ) {
		if ( 'dark' === $mode ) {
			return $this->invalidate_dark_mode_cache();
		} elseif ( 'light' === $mode ) {
			return $this->invalidate_light_mode_cache();
		}
		return false;
	}

	/**
	 * Invalidate both light and dark mode caches.
	 *
	 * Used when palette changes affect both modes.
	 * Requirement 12.6: Invalidate both caches on palette change.
	 *
	 * @return bool True if both caches were invalidated successfully.
	 * @since 1.3.0
	 */
	public function invalidate_both_mode_caches() {
		$result1 = $this->invalidate_light_mode_cache();
		$result2 = $this->invalidate_dark_mode_cache();
		return $result1 && $result2;
	}

	/**
	 * Warm cache by pre-generating CSS for both modes.
	 *
	 * Requirement 12.7: Add cache warming on settings save.
	 * Task 33: Extended for background CSS warming (Requirements 7.4, 7.5).
	 *
	 * @param MASE_CSS_Generator $generator The CSS generator instance.
	 * @param array              $settings  The settings array.
	 * @return array Results of cache warming with 'light', 'dark', and 'backgrounds' keys.
	 * @since 1.3.0
	 */
	public function warm_mode_caches( $generator, $settings ) {
		$results = array(
			'light'       => false,
			'dark'        => false,
			'backgrounds' => array(),
		);

		try {
			// Task 33: Check if backgrounds are enabled (Requirement 7.4).
			$backgrounds_enabled = isset( $settings['custom_backgrounds'] ) && is_array( $settings['custom_backgrounds'] );
			$enabled_areas = array();

			if ( $backgrounds_enabled ) {
				// Task 33: Identify enabled background areas (Requirement 7.4).
				foreach ( $settings['custom_backgrounds'] as $area => $config ) {
					if ( isset( $config['enabled'] ) && $config['enabled'] && 
					     isset( $config['type'] ) && $config['type'] !== 'none' ) {
						$enabled_areas[] = $area;
					}
				}

				if ( ! empty( $enabled_areas ) ) {
					error_log( sprintf( 
						'MASE: Cache warming - Background areas enabled: %s',
						implode( ', ', $enabled_areas )
					) );
				}
			}

			// Generate and cache light mode CSS.
			$light_settings = $settings;
			if ( ! isset( $light_settings['dark_light_toggle'] ) ) {
				$light_settings['dark_light_toggle'] = array();
			}
			$light_settings['dark_light_toggle']['current_mode'] = 'light';
			
			$light_css = $generator->generate( $light_settings );
			if ( ! empty( $light_css ) ) {
				$cache_duration = isset( $settings['performance']['cache_duration'] ) 
					? absint( $settings['performance']['cache_duration'] ) 
					: 3600;
				$results['light'] = $this->set_cached_light_mode_css( $light_css, $cache_duration );

				// Task 33: Log background CSS warming for light mode (Requirement 7.5).
				if ( $backgrounds_enabled && ! empty( $enabled_areas ) ) {
					error_log( sprintf( 
						'MASE: Cache warming - Light mode CSS includes backgrounds for: %s',
						implode( ', ', $enabled_areas )
					) );
				}
			}

			// Generate and cache dark mode CSS.
			$dark_settings = $settings;
			if ( ! isset( $dark_settings['dark_light_toggle'] ) ) {
				$dark_settings['dark_light_toggle'] = array();
			}
			$dark_settings['dark_light_toggle']['current_mode'] = 'dark';
			
			$dark_css = $generator->generate( $dark_settings );
			if ( ! empty( $dark_css ) ) {
				$cache_duration = isset( $settings['performance']['cache_duration'] ) 
					? absint( $settings['performance']['cache_duration'] ) 
					: 3600;
				$results['dark'] = $this->set_cached_dark_mode_css( $dark_css, $cache_duration );

				// Task 33: Log background CSS warming for dark mode (Requirement 7.5).
				if ( $backgrounds_enabled && ! empty( $enabled_areas ) ) {
					error_log( sprintf( 
						'MASE: Cache warming - Dark mode CSS includes backgrounds for: %s',
						implode( ', ', $enabled_areas )
					) );
				}
			}

			// Task 33: Store background warming results (Requirement 7.5).
			$results['backgrounds'] = array(
				'enabled'       => $backgrounds_enabled,
				'enabled_areas' => $enabled_areas,
				'area_count'    => count( $enabled_areas ),
			);

			// Task 33: Log comprehensive cache warming results (Requirement 7.5).
			if ( $backgrounds_enabled ) {
				error_log( sprintf( 
					'MASE: Cache warming completed - Light: %s, Dark: %s, Background areas: %d (%s)',
					$results['light'] ? 'success' : 'failed',
					$results['dark'] ? 'success' : 'failed',
					count( $enabled_areas ),
					! empty( $enabled_areas ) ? implode( ', ', $enabled_areas ) : 'none'
				) );
			}

		} catch ( Exception $e ) {
			error_log( 'MASE: Cache warming failed: ' . $e->getMessage() );
		}

		return $results;
	}
}
