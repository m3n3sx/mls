<?php
/**
 * MASE REST API Controller
 *
 * Provides REST API endpoints for modern architecture.
 * Implements Requirement 8.1: REST API endpoints with nonce verification and capability checks.
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.3.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class MASE_REST_API
 *
 * Handles REST API endpoint registration and request processing.
 */
class MASE_REST_API {

	/**
	 * API namespace.
	 *
	 * @var string
	 */
	const NAMESPACE = 'mase/v1';

	/**
	 * Settings instance.
	 *
	 * @var MASE_Settings
	 */
	private $settings;

	/**
	 * Cache manager instance.
	 *
	 * @var MASE_CacheManager
	 */
	private $cache;

	/**
	 * Constructor.
	 *
	 * @param MASE_Settings     $settings Settings instance.
	 * @param MASE_CacheManager $cache    Cache manager instance.
	 */
	public function __construct( MASE_Settings $settings, MASE_CacheManager $cache ) {
		$this->settings = $settings;
		$this->cache    = $cache;

		// Register REST API routes.
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST API routes.
	 *
	 * Requirement 8.1: Register /mase/v1/settings, /templates, /palettes endpoints.
	 *
	 * @return void
	 */
	public function register_routes() {
		// Settings endpoints.
		register_rest_route(
			self::NAMESPACE,
			'/settings',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_settings' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_settings' ),
					'permission_callback' => array( $this, 'check_permissions' ),
					'args'                => $this->get_settings_schema(),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/settings/reset',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'reset_settings' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			)
		);

		// Template endpoints.
		register_rest_route(
			self::NAMESPACE,
			'/templates',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_templates' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/templates/(?P<id>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_template' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
					'id' => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_string( $param );
						},
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/templates/(?P<id>[a-zA-Z0-9_-]+)/apply',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'apply_template' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
					'id' => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_string( $param );
						},
					),
				),
			)
		);

		// Palette endpoints.
		register_rest_route(
			self::NAMESPACE,
			'/palettes',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_palettes' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/palettes/(?P<id>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_palette' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
					'id' => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_string( $param );
						},
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/palettes/(?P<id>[a-zA-Z0-9_-]+)/apply',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'apply_palette' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
					'id' => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_string( $param );
						},
					),
				),
			)
		);
	}

	/**
	 * Check permissions for REST API requests.
	 *
	 * Requirement 8.1: Add nonce verification and capability checks.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return bool|WP_Error True if user has permission, WP_Error otherwise.
	 */
	public function check_permissions( $request ) {
		// Check if user is logged in.
		if ( ! is_user_logged_in() ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'You must be logged in to access this endpoint.', 'mase' ),
				array( 'status' => 401 )
			);
		}

		// Check user capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'You do not have permission to access this endpoint.', 'mase' ),
				array( 'status' => 403 )
			);
		}

		return true;
	}

	/**
	 * Get settings endpoint.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function get_settings( $request ) {
		try {
			$settings = $this->settings->get_option();

			return rest_ensure_response(
				array(
					'success'  => true,
					'settings' => $settings,
				)
			);
		} catch ( Exception $e ) {
			return new WP_Error(
				'rest_error',
				$e->getMessage(),
				array( 'status' => 500 )
			);
		}
	}

	/**
	 * Update settings endpoint.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function update_settings( $request ) {
		try {
			$settings = $request->get_json_params();

			if ( empty( $settings ) ) {
				return new WP_Error(
					'rest_invalid_param',
					__( 'Settings data is required.', 'mase' ),
					array( 'status' => 400 )
				);
			}

			// Update settings.
			$result = $this->settings->update_option( $settings );

			if ( ! $result ) {
				return new WP_Error(
					'rest_error',
					__( 'Failed to update settings.', 'mase' ),
					array( 'status' => 500 )
				);
			}

			// Invalidate cache.
			$this->cache->invalidate( 'generated_css' );

			return rest_ensure_response(
				array(
					'success' => true,
					'message' => __( 'Settings updated successfully.', 'mase' ),
				)
			);
		} catch ( Exception $e ) {
			return new WP_Error(
				'rest_error',
				$e->getMessage(),
				array( 'status' => 500 )
			);
		}
	}

	/**
	 * Reset settings endpoint.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function reset_settings( $request ) {
		try {
			$defaults = $this->settings->get_defaults();
			$result   = $this->settings->update_option( $defaults );

			if ( ! $result ) {
				return new WP_Error(
					'rest_error',
					__( 'Failed to reset settings.', 'mase' ),
					array( 'status' => 500 )
				);
			}

			// Invalidate cache.
			$this->cache->invalidate( 'generated_css' );

			return rest_ensure_response(
				array(
					'success'  => true,
					'message'  => __( 'Settings reset to defaults.', 'mase' ),
					'settings' => $defaults,
				)
			);
		} catch ( Exception $e ) {
			return new WP_Error(
				'rest_error',
				$e->getMessage(),
				array( 'status' => 500 )
			);
		}
	}

	/**
	 * Get templates endpoint.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function get_templates( $request ) {
		try {
			$templates = $this->settings->get_all_templates();

			return rest_ensure_response(
				array(
					'success'   => true,
					'templates' => $templates,
				)
			);
		} catch ( Exception $e ) {
			return new WP_Error(
				'rest_error',
				$e->getMessage(),
				array( 'status' => 500 )
			);
		}
	}

	/**
	 * Get single template endpoint.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function get_template( $request ) {
		try {
			$template_id = $request->get_param( 'id' );
			$template    = $this->settings->get_template( $template_id );

			if ( is_wp_error( $template ) || false === $template ) {
				return new WP_Error(
					'rest_not_found',
					__( 'Template not found.', 'mase' ),
					array( 'status' => 404 )
				);
			}

			return rest_ensure_response(
				array(
					'success'  => true,
					'template' => $template,
				)
			);
		} catch ( Exception $e ) {
			return new WP_Error(
				'rest_error',
				$e->getMessage(),
				array( 'status' => 500 )
			);
		}
	}

	/**
	 * Apply template endpoint.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function apply_template( $request ) {
		try {
			$template_id = $request->get_param( 'id' );

			// Validate template exists.
			$template = $this->settings->get_template( $template_id );

			if ( is_wp_error( $template ) || false === $template ) {
				return new WP_Error(
					'rest_not_found',
					__( 'Template not found.', 'mase' ),
					array( 'status' => 404 )
				);
			}

			// Apply template.
			$result = $this->settings->apply_template( $template_id );

			if ( is_wp_error( $result ) || false === $result ) {
				return new WP_Error(
					'rest_error',
					__( 'Failed to apply template.', 'mase' ),
					array( 'status' => 500 )
				);
			}

			// Invalidate cache.
			$this->cache->invalidate( 'generated_css' );

			return rest_ensure_response(
				array(
					'success'       => true,
					'message'       => __( 'Template applied successfully.', 'mase' ),
					'template_id'   => $template_id,
					'template_name' => $template['name'],
				)
			);
		} catch ( Exception $e ) {
			return new WP_Error(
				'rest_error',
				$e->getMessage(),
				array( 'status' => 500 )
			);
		}
	}

	/**
	 * Get palettes endpoint.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function get_palettes( $request ) {
		try {
			$palettes = $this->settings->get_all_palettes();

			return rest_ensure_response(
				array(
					'success'  => true,
					'palettes' => $palettes,
				)
			);
		} catch ( Exception $e ) {
			return new WP_Error(
				'rest_error',
				$e->getMessage(),
				array( 'status' => 500 )
			);
		}
	}

	/**
	 * Get single palette endpoint.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function get_palette( $request ) {
		try {
			$palette_id = $request->get_param( 'id' );
			$palette    = $this->settings->get_palette( $palette_id );

			if ( is_wp_error( $palette ) || false === $palette ) {
				return new WP_Error(
					'rest_not_found',
					__( 'Palette not found.', 'mase' ),
					array( 'status' => 404 )
				);
			}

			return rest_ensure_response(
				array(
					'success' => true,
					'palette' => $palette,
				)
			);
		} catch ( Exception $e ) {
			return new WP_Error(
				'rest_error',
				$e->getMessage(),
				array( 'status' => 500 )
			);
		}
	}

	/**
	 * Apply palette endpoint.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function apply_palette( $request ) {
		try {
			$palette_id = $request->get_param( 'id' );

			// Validate palette exists.
			$palette = $this->settings->get_palette( $palette_id );

			if ( is_wp_error( $palette ) || false === $palette ) {
				return new WP_Error(
					'rest_not_found',
					__( 'Palette not found.', 'mase' ),
					array( 'status' => 404 )
				);
			}

			// Apply palette.
			$result = $this->settings->apply_palette( $palette_id );

			if ( is_wp_error( $result ) || false === $result ) {
				return new WP_Error(
					'rest_error',
					__( 'Failed to apply palette.', 'mase' ),
					array( 'status' => 500 )
				);
			}

			// Invalidate cache.
			$this->cache->invalidate( 'generated_css' );

			return rest_ensure_response(
				array(
					'success'      => true,
					'message'      => __( 'Palette applied successfully.', 'mase' ),
					'palette_id'   => $palette_id,
					'palette_name' => $palette['name'],
				)
			);
		} catch ( Exception $e ) {
			return new WP_Error(
				'rest_error',
				$e->getMessage(),
				array( 'status' => 500 )
			);
		}
	}

	/**
	 * Get settings schema for validation.
	 *
	 * @return array Settings schema.
	 */
	private function get_settings_schema() {
		return array(
			'type'       => 'object',
			'properties' => array(
				'admin_bar'          => array( 'type' => 'object' ),
				'admin_menu'         => array( 'type' => 'object' ),
				'typography'         => array( 'type' => 'object' ),
				'visual_effects'     => array( 'type' => 'object' ),
				'spacing'            => array( 'type' => 'object' ),
				'palettes'           => array( 'type' => 'object' ),
				'templates'          => array( 'type' => 'object' ),
				'effects'            => array( 'type' => 'object' ),
				'advanced'           => array( 'type' => 'object' ),
				'mobile'             => array( 'type' => 'object' ),
				'accessibility'      => array( 'type' => 'object' ),
				'keyboard_shortcuts' => array( 'type' => 'object' ),
				'performance'        => array( 'type' => 'object' ),
			),
		);
	}
}
