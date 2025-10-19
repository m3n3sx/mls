<?php
/**
 * MASE Admin Interface Class
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class MASE_Admin {

	private $settings;
	private $generator;
	private $cache;

	public function __construct( MASE_Settings $settings, MASE_CSS_Generator $generator, MASE_CacheManager $cache ) {
		if ( ! is_admin() ) {
			return;
		}

		$this->settings  = $settings;
		$this->generator = $generator;
		$this->cache     = $cache;

		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_head', array( $this, 'inject_custom_css' ), 999 );
		
		// Core settings AJAX handlers.
		add_action( 'wp_ajax_mase_save_settings', array( $this, 'handle_ajax_save_settings' ) );
		add_action( 'wp_ajax_mase_export_settings', array( $this, 'handle_ajax_export_settings' ) );
		add_action( 'wp_ajax_mase_import_settings', array( $this, 'handle_ajax_import_settings' ) );
		
		// Palette AJAX handlers (Requirement 1.3).
		add_action( 'wp_ajax_mase_apply_palette', array( $this, 'ajax_apply_palette' ) );
		add_action( 'wp_ajax_mase_save_custom_palette', array( $this, 'handle_ajax_save_custom_palette' ) );
		add_action( 'wp_ajax_mase_delete_custom_palette', array( $this, 'handle_ajax_delete_custom_palette' ) );
		
		// Template AJAX handlers (Requirement 2.4, 7.1).
		add_action( 'wp_ajax_mase_apply_template', array( $this, 'ajax_apply_template' ) );
		add_action( 'wp_ajax_mase_save_custom_template', array( $this, 'handle_ajax_save_custom_template' ) );
		add_action( 'wp_ajax_mase_delete_custom_template', array( $this, 'handle_ajax_delete_custom_template' ) );
		
		// Backup AJAX handlers (Requirement 16.1, 16.2, 16.3, 16.4, 16.5).
		add_action( 'wp_ajax_mase_create_backup', array( $this, 'handle_ajax_create_backup' ) );
		add_action( 'wp_ajax_mase_restore_backup', array( $this, 'handle_ajax_restore_backup' ) );
		add_action( 'wp_ajax_mase_get_backups', array( $this, 'handle_ajax_get_backups' ) );
		
		// Register mobile optimizer AJAX handlers (Requirement 7.1).
		$mobile_optimizer = new MASE_Mobile_Optimizer();
		add_action( 'wp_ajax_mase_store_device_capabilities', array( $mobile_optimizer, 'handle_store_device_capabilities' ) );
		add_action( 'wp_ajax_mase_store_low_power_detection', array( $mobile_optimizer, 'handle_store_low_power_detection' ) );
	}

	public function add_admin_menu() {
		add_menu_page(
			__( 'Modern Admin Styler', 'mase' ),
			__( 'Admin Styler', 'mase' ),
			'manage_options',
			'mase-settings',
			array( $this, 'render_settings_page' ),
			'dashicons-admin-appearance',
			100
		);
	}

	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', 'mase' ) );
		}
		
		// Get current settings for the form.
		$settings = $this->settings->get_option();
		
		include plugin_dir_path( __FILE__ ) . 'admin-settings-page.php';
	}

	public function enqueue_assets( $hook ) {
		// Conditional loading - only on settings page (Requirement 11.5).
		if ( 'toplevel_page_mase-settings' !== $hook ) {
			return;
		}

		// Enqueue WordPress color picker dependency.
		wp_enqueue_style( 'wp-color-picker' );
		wp_enqueue_script( 'wp-color-picker' );

		// Enqueue mase-admin.css with wp-color-picker dependency (Requirement 11.1).
		wp_enqueue_style(
			'mase-admin',
			plugins_url( '../assets/css/mase-admin.css', __FILE__ ),
			array( 'wp-color-picker' ),
			MASE_VERSION
		);

		// Enqueue mase-palettes.css with mase-admin dependency (Requirement 11.2).
		wp_enqueue_style(
			'mase-palettes',
			plugins_url( '../assets/css/mase-palettes.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue mase-templates.css with mase-admin dependency (Requirement 11.3).
		wp_enqueue_style(
			'mase-templates',
			plugins_url( '../assets/css/mase-templates.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue mase-accessibility.css with mase-admin dependency (Requirement 13.1-13.5).
		wp_enqueue_style(
			'mase-accessibility',
			plugins_url( '../assets/css/mase-accessibility.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue mase-responsive.css with mase-admin dependency (Requirement 7.1-7.5, 19.1-19.5).
		wp_enqueue_style(
			'mase-responsive',
			plugins_url( '../assets/css/mase-responsive.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue mase-admin.js with jquery and wp-color-picker dependencies (Requirement 11.4).
		wp_enqueue_script(
			'mase-admin',
			plugins_url( '../assets/js/mase-admin.js', __FILE__ ),
			array( 'jquery', 'wp-color-picker' ),
			MASE_VERSION,
			true
		);

		// Enqueue mase-admin-live-preview.js for live preview functionality (Requirements: 1.1, 1.2, 1.3, 1.4, 1.5).
		wp_enqueue_script(
			'mase-admin-live-preview',
			plugins_url( '../assets/js/mase-admin-live-preview.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Localize script with data and strings (Requirement 11.4).
		wp_localize_script(
			'mase-admin',
			'maseAdmin',
			array(
				'ajaxUrl'   => admin_url( 'admin-ajax.php' ),
				'nonce'     => wp_create_nonce( 'mase_save_settings' ),
				'palettes'  => $this->get_palettes_data(),
				'templates' => $this->get_templates_data(),
				'strings'   => array(
					'saving'                => __( 'Saving...', 'mase' ),
					'saved'                 => __( 'Settings saved successfully!', 'mase' ),
					'saveFailed'            => __( 'Failed to save settings. Please try again.', 'mase' ),
					'paletteApplied'        => __( 'Palette applied successfully!', 'mase' ),
					'paletteApplyFailed'    => __( 'Failed to apply palette. Please try again.', 'mase' ),
					'templateApplied'       => __( 'Template applied successfully!', 'mase' ),
					'templateApplyFailed'   => __( 'Failed to apply template. Please try again.', 'mase' ),
					'confirmDelete'         => __( 'Are you sure you want to delete this item?', 'mase' ),
					'exportSuccess'         => __( 'Settings exported successfully!', 'mase' ),
					'exportFailed'          => __( 'Failed to export settings. Please try again.', 'mase' ),
					'importSuccess'         => __( 'Settings imported successfully!', 'mase' ),
					'importFailed'          => __( 'Failed to import settings. Please try again.', 'mase' ),
					'invalidFile'           => __( 'Invalid file format. Please select a valid JSON file.', 'mase' ),
					'backupCreated'         => __( 'Backup created successfully!', 'mase' ),
					'backupRestored'        => __( 'Backup restored successfully!', 'mase' ),
					'networkError'          => __( 'Network error. Please check your connection and try again.', 'mase' ),
				),
			)
		);
	}

	/**
	 * Get palettes data for JavaScript.
	 *
	 * Prepares palette data for localization to JavaScript.
	 * Requirement 11.4: Provide palettes data to JavaScript.
	 *
	 * @return array Palettes data.
	 */
	private function get_palettes_data() {
		return $this->settings->get_all_palettes();
	}

	/**
	 * Get templates data for JavaScript.
	 *
	 * Prepares template data for localization to JavaScript.
	 * Requirement 11.4: Provide templates data to JavaScript.
	 *
	 * @return array Templates data.
	 */
	private function get_templates_data() {
		return $this->settings->get_all_templates();
	}


	/**
	 * Inject custom CSS into admin pages.
	 *
	 * Uses advanced caching with automatic generation on cache miss.
	 */
	public function inject_custom_css() {
		try {
			$settings       = $this->settings->get_option();
			$cache_duration = ! empty( $settings['performance']['cache_duration'] ) 
				? absint( $settings['performance']['cache_duration'] ) 
				: 3600;

			// Use advanced cache manager with automatic generation.
			$css = $this->cache->remember(
				'generated_css',
				function() use ( $settings ) {
					$css = $this->generator->generate( $settings );

					// Apply minification if enabled.
					if ( ! empty( $settings['performance']['enable_minification'] ) ) {
						$css = $this->generator->minify( $css );
					}

					return $css;
				},
				$cache_duration
			);

			// Output CSS if we have any.
			if ( ! empty( $css ) ) {
				echo '<style id="mase-custom-css" type="text/css">' . "\n";
				echo $css . "\n";
				echo '</style>' . "\n";
			}

		} catch ( Exception $e ) {
			// Log error and try to use cached CSS as fallback.
			error_log( 'MASE CSS Generation Error: ' . $e->getMessage() );

			// Try to get any cached CSS as fallback.
			$fallback_css = $this->cache->get_cached_css();
			if ( false !== $fallback_css && ! empty( $fallback_css ) ) {
				echo '<style id="mase-custom-css" type="text/css">' . "\n";
				echo $fallback_css . "\n";
				echo '</style>' . "\n";
			}
		}
	}

	/**
	 * Handle AJAX save settings request.
	 */
	public function handle_ajax_save_settings() {
		try {
			// Verify nonce.
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get and validate settings.
			$input = isset( $_POST['settings'] ) ? $_POST['settings'] : array();
			
			// Save settings.
			$result = $this->settings->update_option( $input );

			if ( $result ) {
				// Invalidate cache on successful save.
				$this->cache->invalidate( 'generated_css' );

				wp_send_json_success( array(
					'message' => __( 'Settings saved successfully', 'mase' ),
				) );
			} else {
				wp_send_json_error( array(
					'message' => __( 'Failed to save settings', 'mase' ),
				) );
			}
		} catch ( Exception $e ) {
			error_log( 'MASE Error (save_settings): ' . $e->getMessage() );
			wp_send_json_error( array(
				'message' => __( 'An error occurred. Please try again.', 'mase' ),
			) );
		}
	}

	/**
	 * AJAX Handler: Apply Palette
	 *
	 * Processes palette activation requests with full validation and error handling.
	 * Implements security checks, input validation, palette existence verification,
	 * and cache invalidation.
	 *
	 * @since 1.2.0
	 * @return void Sends JSON response and exits.
	 */
	public function ajax_apply_palette() {
		// Security validation: Verify nonce (Requirement 15.1).
		check_ajax_referer( 'mase_save_settings', 'nonce' );

		// Security validation: Check user capability (Requirement 15.2, 15.3).
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Insufficient permissions', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Input validation: Get and sanitize palette_id (Requirement 16.1, 16.2).
		$palette_id = isset( $_POST['palette_id'] ) ? sanitize_text_field( $_POST['palette_id'] ) : '';

		// Input validation: Check if empty (Requirement 16.5).
		if ( empty( $palette_id ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Palette ID is required', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Validate palette exists (Requirement 16.3, 16.4).
		$palette = $this->settings->get_palette( $palette_id );

		if ( is_wp_error( $palette ) ) {
			wp_send_json_error(
				array(
					'message' => $palette->get_error_message(),
				),
				404
			);
		}

		// Apply palette (Requirement 17.1).
		$result = $this->settings->apply_palette( $palette_id );

		// Check for application errors (Requirement 17.3).
		if ( is_wp_error( $result ) ) {
			wp_send_json_error(
				array(
					'message' => $result->get_error_message(),
				),
				500
			);
		}

		// Clear cache (Requirement 17.2).
		$this->cache->invalidate( 'generated_css' );

		// Return success response (Requirement 17.4, 17.5).
		wp_send_json_success(
			array(
				'message'      => __( 'Palette applied successfully', 'modern-admin-styler' ),
				'palette_id'   => $palette_id,
				'palette_name' => $palette['name'],
			)
		);
	}

	/**
	 * Handle AJAX export settings request.
	 */
	public function handle_ajax_export_settings() {
		try {
			// Verify nonce.
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get current settings.
			$settings = $this->settings->get_option();

			// Prepare export data.
			$export_data = array(
				'plugin'      => 'MASE',
				'version'     => '1.1.0',
				'exported_at' => current_time( 'mysql' ),
				'settings'    => $settings,
			);

			wp_send_json_success( $export_data );
		} catch ( Exception $e ) {
			error_log( 'MASE Error (export_settings): ' . $e->getMessage() );
			wp_send_json_error( array(
				'message' => __( 'An error occurred during export. Please try again.', 'mase' ),
			) );
		}
	}

	/**
	 * Handle AJAX import settings request.
	 * Requirement 8.3: Validate JSON file structure before applying settings.
	 */
	public function handle_ajax_import_settings() {
		try {
			// Verify nonce.
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get import data.
			$import_data = isset( $_POST['settings_data'] ) ? wp_unslash( $_POST['settings_data'] ) : '';

			if ( empty( $import_data ) ) {
				wp_send_json_error( array( 'message' => __( 'No import data provided', 'mase' ) ) );
			}

			// Decode JSON (Requirement 8.3).
			$data = json_decode( $import_data, true );

			if ( ! $data || ! isset( $data['settings'] ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid import data format', 'mase' ) ) );
			}

			// Validate plugin identifier.
			if ( ! isset( $data['plugin'] ) || 'MASE' !== $data['plugin'] ) {
				wp_send_json_error( array( 'message' => __( 'Import data is not from MASE plugin', 'mase' ) ) );
			}

			// Import settings.
			$result = $this->settings->update_option( $data['settings'] );

			if ( $result ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				wp_send_json_success( array(
					'message' => __( 'Settings imported successfully', 'mase' ),
				) );
			} else {
				wp_send_json_error( array(
					'message' => __( 'Failed to import settings', 'mase' ),
				) );
			}
		} catch ( Exception $e ) {
			error_log( 'MASE Error (import_settings): ' . $e->getMessage() );
			wp_send_json_error( array(
				'message' => __( 'An error occurred during import. Please try again.', 'mase' ),
			) );
		}
	}

	/**
	 * Handle AJAX save custom palette request.
	 * Requirement 1.3: Save custom palette with validation.
	 */
	public function handle_ajax_save_custom_palette() {
		try {
			// Verify nonce.
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get palette data.
			$name   = isset( $_POST['name'] ) ? sanitize_text_field( $_POST['name'] ) : '';
			$colors = isset( $_POST['colors'] ) ? $_POST['colors'] : array();

			if ( empty( $name ) ) {
				wp_send_json_error( array( 'message' => __( 'Palette name is required', 'mase' ) ) );
			}

			if ( empty( $colors ) ) {
				wp_send_json_error( array( 'message' => __( 'Palette colors are required', 'mase' ) ) );
			}

			// Save custom palette.
			$palette_id = $this->settings->save_custom_palette( $name, $colors );

			if ( $palette_id ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				wp_send_json_success( array(
					'message'    => __( 'Custom palette saved successfully', 'mase' ),
					'palette_id' => $palette_id,
				) );
			} else {
				wp_send_json_error( array(
					'message' => __( 'Failed to save custom palette', 'mase' ),
				) );
			}
		} catch ( Exception $e ) {
			error_log( 'MASE Error (save_custom_palette): ' . $e->getMessage() );
			wp_send_json_error( array(
				'message' => __( 'An error occurred. Please try again.', 'mase' ),
			) );
		}
	}

	/**
	 * Handle AJAX delete custom palette request.
	 * Requirement 1.3: Delete custom palette with confirmation.
	 */
	public function handle_ajax_delete_custom_palette() {
		try {
			// Verify nonce.
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get palette ID.
			$palette_id = isset( $_POST['palette_id'] ) ? sanitize_text_field( $_POST['palette_id'] ) : '';

			if ( empty( $palette_id ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid palette ID', 'mase' ) ) );
			}

			// Delete custom palette.
			$result = $this->settings->delete_custom_palette( $palette_id );

			if ( $result ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				wp_send_json_success( array(
					'message' => __( 'Custom palette deleted successfully', 'mase' ),
				) );
			} else {
				wp_send_json_error( array(
					'message' => __( 'Failed to delete custom palette', 'mase' ),
				) );
			}
		} catch ( Exception $e ) {
			error_log( 'MASE Error (delete_custom_palette): ' . $e->getMessage() );
			wp_send_json_error( array(
				'message' => __( 'An error occurred. Please try again.', 'mase' ),
			) );
		}
	}

	/**
	 * AJAX Handler: Apply Template
	 *
	 * Applies a complete template and updates all settings.
	 * Implements comprehensive validation, error handling, and cache invalidation.
	 *
	 * @since 1.2.0
	 * @return void Sends JSON response and exits.
	 */
	public function ajax_apply_template() {
		// Security validation: Verify nonce (Requirement 7.2).
		check_ajax_referer( 'mase_save_settings', 'nonce' );

		// Security validation: Check user capability (Requirement 7.3, 10.3).
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Insufficient permissions', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Input validation: Get and sanitize template_id (Requirement 7.1, 10.1).
		$template_id = isset( $_POST['template_id'] ) ? sanitize_text_field( $_POST['template_id'] ) : '';

		// Input validation: Check if empty (Requirement 10.1).
		if ( empty( $template_id ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Template ID is required', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Validate template exists (Requirement 7.4, 10.2).
		$template = $this->settings->get_template( $template_id );

		// Check if result is WP_Error or false (Requirement 10.2).
		if ( is_wp_error( $template ) ) {
			wp_send_json_error(
				array(
					'message' => $template->get_error_message(),
				),
				404
			);
		}

		if ( false === $template ) {
			wp_send_json_error(
				array(
					'message' => __( 'Template not found', 'modern-admin-styler' ),
				),
				404
			);
		}

		// Apply template (Requirement 2.4, 7.4).
		$result = $this->settings->apply_template( $template_id );

		// Check for application errors (Requirement 10.4).
		if ( is_wp_error( $result ) ) {
			wp_send_json_error(
				array(
					'message' => $result->get_error_message(),
				),
				500
			);
		}

		if ( false === $result ) {
			wp_send_json_error(
				array(
					'message' => __( 'Failed to apply template', 'modern-admin-styler' ),
				),
				500
			);
		}

		// Invalidate CSS cache (Requirement 7.5).
		$this->cache->invalidate( 'generated_css' );

		// Return success response (Requirement 7.5).
		wp_send_json_success(
			array(
				'message'       => __( 'Template applied successfully', 'modern-admin-styler' ),
				'template_id'   => $template_id,
				'template_name' => $template['name'],
			)
		);
	}

	/**
	 * Handle AJAX save custom template request.
	 * Requirement 2.4: Save custom template with snapshot creation.
	 */
	public function handle_ajax_save_custom_template() {
		try {
			// Verify nonce.
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get template data.
			$name     = isset( $_POST['name'] ) ? sanitize_text_field( $_POST['name'] ) : '';
			$settings = isset( $_POST['settings'] ) ? $_POST['settings'] : array();

			if ( empty( $name ) ) {
				wp_send_json_error( array( 'message' => __( 'Template name is required', 'mase' ) ) );
			}

			if ( empty( $settings ) ) {
				wp_send_json_error( array( 'message' => __( 'Template settings are required', 'mase' ) ) );
			}

			// Save custom template.
			$template_id = $this->settings->save_custom_template( $name, $settings );

			if ( $template_id ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				wp_send_json_success( array(
					'message'     => __( 'Custom template saved successfully', 'mase' ),
					'template_id' => $template_id,
				) );
			} else {
				wp_send_json_error( array(
					'message' => __( 'Failed to save custom template', 'mase' ),
				) );
			}
		} catch ( Exception $e ) {
			error_log( 'MASE Error (save_custom_template): ' . $e->getMessage() );
			wp_send_json_error( array(
				'message' => __( 'An error occurred. Please try again.', 'mase' ),
			) );
		}
	}

	/**
	 * Handle AJAX delete custom template request.
	 * Requirement 2.4: Delete custom template with confirmation.
	 */
	public function handle_ajax_delete_custom_template() {
		try {
			// Verify nonce.
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get template ID.
			$template_id = isset( $_POST['template_id'] ) ? sanitize_text_field( $_POST['template_id'] ) : '';

			if ( empty( $template_id ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid template ID', 'mase' ) ) );
			}

			// Delete custom template.
			$result = $this->settings->delete_custom_template( $template_id );

			if ( $result ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				wp_send_json_success( array(
					'message' => __( 'Custom template deleted successfully', 'mase' ),
				) );
			} else {
				wp_send_json_error( array(
					'message' => __( 'Failed to delete custom template', 'mase' ),
				) );
			}
		} catch ( Exception $e ) {
			error_log( 'MASE Error (delete_custom_template): ' . $e->getMessage() );
			wp_send_json_error( array(
				'message' => __( 'An error occurred. Please try again.', 'mase' ),
			) );
		}
	}

	/**
	 * Handle AJAX create backup request.
	 * Requirement 16.1: Create backup with timestamp.
	 */
	public function handle_ajax_create_backup() {
		try {
			// Verify nonce.
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get current settings.
			$settings = $this->settings->get_option();

			// Create backup ID with timestamp.
			$backup_id = 'backup_' . gmdate( 'YmdHis' );

			// Prepare backup data.
			$backup_data = array(
				'id'        => $backup_id,
				'timestamp' => time(),
				'version'   => MASE_Settings::PLUGIN_VERSION,
				'settings'  => $settings,
				'trigger'   => 'manual',
			);

			// Store backup.
			$backups = get_option( 'mase_backups', array() );
			$backups[ $backup_id ] = $backup_data;

			// Limit to 10 most recent backups.
			if ( count( $backups ) > 10 ) {
				// Sort by timestamp descending.
				uasort( $backups, function( $a, $b ) {
					return $b['timestamp'] - $a['timestamp'];
				});

				// Keep only 10 most recent.
				$backups = array_slice( $backups, 0, 10, true );
			}

			update_option( 'mase_backups', $backups );

			wp_send_json_success( array(
				'message'   => __( 'Backup created successfully', 'mase' ),
				'backup_id' => $backup_id,
				'timestamp' => $backup_data['timestamp'],
			) );
		} catch ( Exception $e ) {
			error_log( 'MASE Error (create_backup): ' . $e->getMessage() );
			wp_send_json_error( array(
				'message' => __( 'An error occurred. Please try again.', 'mase' ),
			) );
		}
	}

	/**
	 * Handle AJAX restore backup request.
	 * Requirement 16.5: Restore backup with backup ID validation.
	 */
	public function handle_ajax_restore_backup() {
		try {
			// Verify nonce.
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get backup ID.
			$backup_id = isset( $_POST['backup_id'] ) ? sanitize_text_field( $_POST['backup_id'] ) : '';

			if ( empty( $backup_id ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid backup ID', 'mase' ) ) );
			}

			// Get backups.
			$backups = get_option( 'mase_backups', array() );

			if ( ! isset( $backups[ $backup_id ] ) ) {
				wp_send_json_error( array( 'message' => __( 'Backup not found', 'mase' ) ) );
			}

			// Restore settings from backup.
			$backup_data = $backups[ $backup_id ];
			$result = $this->settings->update_option( $backup_data['settings'] );

			if ( $result ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				wp_send_json_success( array(
					'message' => __( 'Backup restored successfully', 'mase' ),
				) );
			} else {
				wp_send_json_error( array(
					'message' => __( 'Failed to restore backup', 'mase' ),
				) );
			}
		} catch ( Exception $e ) {
			error_log( 'MASE Error (restore_backup): ' . $e->getMessage() );
			wp_send_json_error( array(
				'message' => __( 'An error occurred. Please try again.', 'mase' ),
			) );
		}
	}

	/**
	 * Handle AJAX get backups request.
	 * Requirement 16.4: Display list of all available backups with dates.
	 */
	public function handle_ajax_get_backups() {
		try {
			// Verify nonce.
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get backups.
			$backups = get_option( 'mase_backups', array() );

			// Sort by timestamp descending (newest first).
			uasort( $backups, function( $a, $b ) {
				return $b['timestamp'] - $a['timestamp'];
			});

			// Convert to array for JSON response.
			$backup_list = array_values( $backups );

			wp_send_json_success( array(
				'backups' => $backup_list,
			) );
		} catch ( Exception $e ) {
			error_log( 'MASE Error (get_backups): ' . $e->getMessage() );
			wp_send_json_error( array(
				'message' => __( 'An error occurred. Please try again.', 'mase' ),
			) );
		}
	}
}
