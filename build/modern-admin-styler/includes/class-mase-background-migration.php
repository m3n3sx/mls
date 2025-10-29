<?php
/**
 * MASE Background Migration Class
 *
 * Handles migration of background settings for the Advanced Background System.
 * Migrates legacy login page backgrounds and initializes default structure.
 *
 * @package ModernAdminStyler
 * @since 1.3.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Migration class for Advanced Background System.
 *
 * Handles migration from legacy background settings and initialization
 * of the custom_backgrounds structure for new installations.
 */
class MASE_Background_Migration {

	/**
	 * Check if background migration is needed and execute if required.
	 *
	 * Task 42: Implement settings migration.
	 * Requirement 11.1: Initialize default structure for new installations.
	 *
	 * @since 1.3.0
	 * @access public
	 * @static
	 *
	 * @return void
	 */
	public static function maybe_migrate() {
		// Check if migration has already been completed.
		$migration_completed = get_option( 'mase_background_migration_completed', false );

		if ( $migration_completed ) {
			return; // Migration already completed.
		}

		// Log migration start.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'MASE: Starting Advanced Background System migration' );
		}

		// Execute background migration.
		self::migrate_background_settings();

		// Mark migration as complete.
		update_option( 'mase_background_migration_completed', true );

		// Log migration completion.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'MASE: Advanced Background System migration completed successfully' );
		}
	}

	/**
	 * Execute background settings migration.
	 *
	 * Task 42: Migrate login page background if exists.
	 * Task 42: Initialize default structure for new installations.
	 * Requirement 11.1: Extend existing MASE settings structure.
	 *
	 * @since 1.3.0
	 * @access private
	 * @static
	 *
	 * @return void
	 */
	private static function migrate_background_settings() {
		$settings_obj = new MASE_Settings();
		$settings     = $settings_obj->get_option();
		$defaults     = $settings_obj->get_defaults();

		// Check if custom_backgrounds section already exists.
		if ( isset( $settings['custom_backgrounds'] ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Background migration - custom_backgrounds section already exists' );
			}

			// Merge with defaults to ensure all keys exist.
			$settings['custom_backgrounds'] = self::merge_background_defaults(
				$settings['custom_backgrounds'],
				$defaults['custom_backgrounds']
			);
		} else {
			// Initialize with defaults.
			$settings['custom_backgrounds'] = $defaults['custom_backgrounds'];

			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Background migration - initialized custom_backgrounds with defaults' );
			}
		}

		// Migrate legacy login page background if exists.
		$legacy_migrated = self::migrate_legacy_login_background( $settings );

		if ( $legacy_migrated ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Background migration - migrated legacy login background' );
			}
		}

		// Save updated settings.
		$result = $settings_obj->update_option( $settings );

		if ( $result ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Background migration - settings saved successfully' );
			}
		} elseif ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Background migration - WARNING: settings save failed' );
		}

		// Clear cache to force regeneration with new background settings.
		if ( class_exists( 'MASE_CacheManager' ) ) {
			$cache = new MASE_CacheManager();
			$cache->clear_all();

			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'MASE: Background migration - cleared all caches' );
			}
		}
	}

	/**
	 * Migrate legacy login page background settings.
	 *
	 * Task 42: Migrate login page background if exists.
	 * Requirement 11.1: Preserve existing login customization.
	 *
	 * Checks for existing login_customization background settings and
	 * migrates them to the new custom_backgrounds structure.
	 *
	 * @since 1.3.0
	 * @access private
	 * @static
	 *
	 * @param array $settings Current MASE settings array (passed by reference).
	 * @return bool True if legacy settings were found and migrated, false otherwise.
	 */
	private static function migrate_legacy_login_background( &$settings ) {
		$migrated = false;

		// Check if login_customization section exists with background settings.
		if ( ! isset( $settings['login_customization'] ) ) {
			return false;
		}

		$login_settings = $settings['login_customization'];

		// Check for image background.
		if ( isset( $login_settings['background_type'] ) &&
			$login_settings['background_type'] === 'image' &&
			! empty( $login_settings['background_image'] ) ) {

			// Migrate to custom_backgrounds structure.
			$settings['custom_backgrounds']['login']['enabled']   = true;
			$settings['custom_backgrounds']['login']['type']      = 'image';
			$settings['custom_backgrounds']['login']['image_url'] = $login_settings['background_image'];

			// Migrate image properties if they exist.
			if ( isset( $login_settings['background_position'] ) ) {
				$settings['custom_backgrounds']['login']['position'] = $login_settings['background_position'];
			}

			if ( isset( $login_settings['background_size'] ) ) {
				$settings['custom_backgrounds']['login']['size'] = $login_settings['background_size'];
			}

			if ( isset( $login_settings['background_repeat'] ) ) {
				$settings['custom_backgrounds']['login']['repeat'] = $login_settings['background_repeat'];
			}

			$migrated = true;

			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Background migration - migrated login image background: %s',
						$login_settings['background_image']
					)
				);
			}
		}

		// Check for color background (convert to solid color).
		if ( isset( $login_settings['background_type'] ) &&
			$login_settings['background_type'] === 'color' &&
			! empty( $login_settings['background_color'] ) ) {

			// Note: The new system doesn't have a direct "color" type,
			// but we can create a simple gradient with the same color.
			$settings['custom_backgrounds']['login']['enabled']         = true;
			$settings['custom_backgrounds']['login']['type']            = 'gradient';
			$settings['custom_backgrounds']['login']['gradient_type']   = 'linear';
			$settings['custom_backgrounds']['login']['gradient_angle']  = 0;
			$settings['custom_backgrounds']['login']['gradient_colors'] = array(
				array(
					'color'    => $login_settings['background_color'],
					'position' => 0,
				),
				array(
					'color'    => $login_settings['background_color'],
					'position' => 100,
				),
			);

			$migrated = true;

			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Background migration - migrated login color background: %s',
						$login_settings['background_color']
					)
				);
			}
		}

		return $migrated;
	}

	/**
	 * Merge background settings with defaults recursively.
	 *
	 * Task 42: Initialize default structure for new installations.
	 * Requirement 11.1: Ensure all background areas have complete structure.
	 *
	 * Recursively merges existing background settings with defaults to ensure
	 * all required keys exist while preserving user customizations.
	 *
	 * @since 1.3.0
	 * @access private
	 * @static
	 *
	 * @param array $existing Existing background settings.
	 * @param array $defaults Default background settings.
	 * @return array Merged settings with all required keys.
	 */
	private static function merge_background_defaults( $existing, $defaults ) {
		$merged = $defaults;

		foreach ( $existing as $area => $config ) {
			if ( isset( $defaults[ $area ] ) && is_array( $config ) ) {
				// Merge area configuration with defaults.
				$merged[ $area ] = array_merge( $defaults[ $area ], $config );

				// Handle responsive variations if they exist.
				if ( isset( $config['responsive'] ) && is_array( $config['responsive'] ) ) {
					foreach ( $config['responsive'] as $breakpoint => $bp_config ) {
						if ( isset( $defaults[ $area ]['responsive'][ $breakpoint ] ) ) {
							$merged[ $area ]['responsive'][ $breakpoint ] = array_merge(
								$defaults[ $area ]['responsive'][ $breakpoint ],
								$bp_config
							);
						}
					}
				}
			}
		}

		return $merged;
	}

	/**
	 * Get background defaults for a specific area.
	 *
	 * Task 42: Initialize default structure for new installations.
	 * Requirement 11.1: Provide default background configuration.
	 *
	 * Returns the default background configuration structure for a single area.
	 * Used as a fallback when MASE_Settings::get_defaults() is not available.
	 *
	 * @since 1.3.0
	 * @access public
	 * @static
	 *
	 * @param string $area Area identifier (dashboard, admin_menu, post_lists, post_editor, widgets, login).
	 * @return array Default background configuration for the area.
	 */
	public static function get_area_defaults( $area = 'dashboard' ) {
		return array(
			'enabled'            => false,
			'type'               => 'none', // 'image' | 'gradient' | 'pattern' | 'none'

			// Image settings
			'image_url'          => '',
			'image_id'           => 0,
			'position'           => 'center center',
			'size'               => 'cover',
			'size_custom'        => '',
			'repeat'             => 'no-repeat',
			'attachment'         => 'scroll',

			// Gradient settings
			'gradient_type'      => 'linear',
			'gradient_angle'     => 90,
			'gradient_colors'    => array(
				array(
					'color'    => '#667eea',
					'position' => 0,
				),
				array(
					'color'    => '#764ba2',
					'position' => 100,
				),
			),
			'gradient_preset'    => '',

			// Pattern settings
			'pattern_id'         => '',
			'pattern_color'      => '#000000',
			'pattern_opacity'    => 100,
			'pattern_scale'      => 100,

			// Advanced options
			'opacity'            => 100,
			'blend_mode'         => 'normal',

			// Responsive variations
			'responsive_enabled' => false,
			'responsive'         => array(
				'desktop' => array(),
				'tablet'  => array(),
				'mobile'  => array(),
			),
		);
	}

	/**
	 * Reset background settings to defaults.
	 *
	 * Task 42: Provide reset functionality.
	 * Requirement 11.1: Allow resetting backgrounds to defaults.
	 *
	 * Resets all background settings to defaults while preserving other MASE settings.
	 * Optionally clears uploaded background images.
	 *
	 * @since 1.3.0
	 * @access public
	 * @static
	 *
	 * @param bool $clear_uploaded_files Optional. Whether to delete uploaded files. Default false.
	 * @return bool True on success, false on failure.
	 */
	public static function reset_backgrounds( $clear_uploaded_files = false ) {
		$settings_obj = new MASE_Settings();
		$settings     = $settings_obj->get_option();
		$defaults     = $settings_obj->get_defaults();

		// Optional: Clear uploaded files before resetting.
		if ( $clear_uploaded_files && isset( $settings['custom_backgrounds'] ) ) {
			self::clear_background_uploaded_files( $settings['custom_backgrounds'] );
		}

		// Reset custom_backgrounds to defaults.
		$settings['custom_backgrounds'] = $defaults['custom_backgrounds'];

		// Save updated settings.
		$result = $settings_obj->update_option( $settings );

		// Clear cache to force regeneration.
		if ( class_exists( 'MASE_CacheManager' ) ) {
			$cache = new MASE_CacheManager();
			$cache->clear_all();
		}

		// Log reset action.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log(
				sprintf(
					'MASE: Background settings reset to defaults (clear_files: %s)',
					$clear_uploaded_files ? 'true' : 'false'
				)
			);
		}

		return $result;
	}

	/**
	 * Clear uploaded background image files.
	 *
	 * Task 42: Clear uploaded files when resetting.
	 * Requirement 11.1: Clean up uploaded files.
	 *
	 * Removes background image files from the uploads directory for all areas.
	 * Does not delete from media library, only removes file references.
	 *
	 * @since 1.3.0
	 * @access private
	 * @static
	 *
	 * @param array $background_settings Background settings array.
	 * @return void
	 */
	private static function clear_background_uploaded_files( $background_settings ) {
		$areas = array( 'dashboard', 'admin_menu', 'post_lists', 'post_editor', 'widgets', 'login' );

		foreach ( $areas as $area ) {
			if ( ! isset( $background_settings[ $area ] ) ) {
				continue;
			}

			$area_config = $background_settings[ $area ];

			// Clear image file if exists.
			if ( ! empty( $area_config['image_url'] ) ) {
				$image_path = self::get_file_path_from_url( $area_config['image_url'] );
				if ( $image_path && file_exists( $image_path ) ) {
					wp_delete_file( $image_path );

					if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
						error_log(
							sprintf(
								'MASE: Deleted background image file for %s: %s',
								$area,
								$image_path
							)
						);
					}
				}
			}
		}
	}

	/**
	 * Convert file URL to file path.
	 *
	 * Helper method to convert WordPress upload URL to file system path.
	 *
	 * @since 1.3.0
	 * @access private
	 * @static
	 *
	 * @param string $url File URL.
	 * @return string|false File path or false if conversion fails.
	 */
	private static function get_file_path_from_url( $url ) {
		// Get upload directory info.
		$upload_dir = wp_upload_dir();

		// Check if URL is in uploads directory.
		if ( strpos( $url, $upload_dir['baseurl'] ) === 0 ) {
			// Replace base URL with base path.
			$file_path = str_replace( $upload_dir['baseurl'], $upload_dir['basedir'], $url );
			return $file_path;
		}

		return false;
	}
}
