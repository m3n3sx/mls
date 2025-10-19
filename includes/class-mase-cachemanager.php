<?php
/**
 * MASE Advanced Cache Manager
 *
 * Multi-level caching system with memory cache and transients.
 * Based on LAS CacheManager with MASE simplifications.
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.1.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class MASE_CacheManager
 *
 * Advanced caching with memory cache layer and performance metrics.
 */
class MASE_CacheManager {

	/**
	 * Cache key prefix.
	 *
	 * @var string
	 */
	const CACHE_PREFIX = 'mase_';

	/**
	 * Memory cache storage.
	 *
	 * @var array
	 */
	private $memory_cache = array();

	/**
	 * Performance metrics.
	 *
	 * @var array
	 */
	private $metrics = array(
		'hits'            => 0,
		'misses'          => 0,
		'generation_time' => 0,
		'memory_usage'    => 0,
	);

	/**
	 * Remember a value with caching.
	 *
	 * Tries memory cache first, then transients, then generates new value.
	 *
	 * @param string   $key      Cache key.
	 * @param callable $callback Function to generate value if not cached.
	 * @param int      $ttl      Time to live in seconds.
	 * @return mixed Cached or generated value.
	 */
	public function remember( $key, $callback, $ttl = 3600 ) {
		$full_key = self::CACHE_PREFIX . $key;

		// Try memory cache first (fastest).
		if ( isset( $this->memory_cache[ $full_key ] ) ) {
			$data = $this->memory_cache[ $full_key ];
			if ( $data['expires'] > time() ) {
				$this->metrics['hits']++;
				return $data['value'];
			}
			// Expired, remove from memory.
			unset( $this->memory_cache[ $full_key ] );
		}

		// Try transients (persistent cache).
		$cached = get_transient( $full_key );
		if ( false !== $cached ) {
			$this->metrics['hits']++;
			// Store in memory for faster access next time.
			$this->memory_cache[ $full_key ] = array(
				'value'   => $cached,
				'expires' => time() + $ttl,
			);
			return $cached;
		}

		// Cache miss - generate new value.
		$this->metrics['misses']++;
		$start_time = microtime( true );

		$value = is_callable( $callback ) ? call_user_func( $callback ) : null;

		$this->metrics['generation_time'] = microtime( true ) - $start_time;

		// Store in both caches.
		set_transient( $full_key, $value, $ttl );
		$this->memory_cache[ $full_key ] = array(
			'value'   => $value,
			'expires' => time() + $ttl,
		);

		return $value;
	}

	/**
	 * Invalidate a specific cache key.
	 *
	 * @param string $key Cache key to invalidate.
	 * @return bool True on success, false on failure.
	 */
	public function invalidate( $key ) {
		$full_key = self::CACHE_PREFIX . $key;

		// Remove from memory cache.
		unset( $this->memory_cache[ $full_key ] );

		// Remove from transients.
		return delete_transient( $full_key );
	}

	/**
	 * Get performance metrics.
	 *
	 * @return array Performance metrics.
	 */
	public function get_metrics() {
		$this->metrics['memory_usage'] = strlen( serialize( $this->memory_cache ) );
		return $this->metrics;
	}

	/**
	 * Clear all MASE caches.
	 *
	 * @return bool True on success.
	 */
	public function clear_all() {
		global $wpdb;

		// Clear memory cache.
		$this->memory_cache = array();

		// Clear all transients with our prefix.
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
				'_transient_' . self::CACHE_PREFIX . '%',
				'_transient_timeout_' . self::CACHE_PREFIX . '%'
			)
		);

		return true;
	}

	/**
	 * Get cache statistics.
	 *
	 * @return array Cache statistics.
	 */
	public function get_stats() {
		$total_requests = $this->metrics['hits'] + $this->metrics['misses'];
		$hit_rate       = $total_requests > 0 ? ( $this->metrics['hits'] / $total_requests ) * 100 : 0;

		return array(
			'hits'            => $this->metrics['hits'],
			'misses'          => $this->metrics['misses'],
			'total_requests'  => $total_requests,
			'hit_rate'        => round( $hit_rate, 2 ),
			'generation_time' => round( $this->metrics['generation_time'] * 1000, 2 ), // Convert to ms.
			'memory_usage'    => $this->format_bytes( $this->metrics['memory_usage'] ),
		);
	}

	/**
	 * Format bytes to human-readable format.
	 *
	 * @param int $bytes Bytes to format.
	 * @return string Formatted string.
	 */
	private function format_bytes( $bytes ) {
		$units = array( 'B', 'KB', 'MB', 'GB' );
		$bytes = max( $bytes, 0 );
		$pow   = floor( ( $bytes ? log( $bytes ) : 0 ) / log( 1024 ) );
		$pow   = min( $pow, count( $units ) - 1 );
		$bytes /= pow( 1024, $pow );

		return round( $bytes, 2 ) . ' ' . $units[ $pow ];
	}
}
