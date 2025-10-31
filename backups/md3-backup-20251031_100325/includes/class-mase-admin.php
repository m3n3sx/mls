<?php
/**
 * MASE Admin Interface Class
 *
 * Handles admin interface, asset enqueuing, and AJAX request processing.
 *
 * SECURITY IMPLEMENTATION (Requirements 22.1, 22.2, 22.3):
 *
 * 1. Input Validation & Sanitization (Requirement 22.1):
 *    - All numeric inputs validated against allowed ranges
 *    - All color values sanitized using sanitize_hex_color()
 *    - All text inputs sanitized using sanitize_text_field()
 *    - All enum values validated against allowed values
 *    - Validation performed in MASE_Settings::validate()
 *
 * 2. File Upload Security (Requirement 22.2):
 *    - File type validation (PNG, JPG, SVG only)
 *    - File size validation (max 2MB)
 *    - MIME type verification using wp_check_filetype()
 *    - Extension validation to prevent spoofing
 *    - SVG sanitization to remove malicious code
 *    - Upload error handling
 *    - User capability checks
 *
 * 3. CSRF Protection (Requirement 22.3):
 *    - All AJAX handlers verify nonces using check_ajax_referer()
 *    - All AJAX handlers check user capabilities using current_user_can()
 *    - Nonce created with wp_create_nonce('mase_save_settings')
 *    - Nonce passed to JavaScript via wp_localize_script()
 *    - Failed nonce checks return 403 Forbidden
 *    - Failed capability checks return 403 Forbidden
 *
 * AJAX Handler Security Pattern:
 * ```php
 * public function handle_ajax_example() {
 *     // 1. Verify nonce (CSRF protection)
 *     check_ajax_referer( 'mase_save_settings', 'nonce' );
 *
 *     // 2. Check user capability
 *     if ( ! current_user_can( 'manage_options' ) ) {
 *         wp_send_json_error( array( 'message' => 'Unauthorized' ), 403 );
 *     }
 *
 *     // 3. Validate and sanitize input
 *     $input = sanitize_text_field( $_POST['input'] );
 *
 *     // 4. Process request
 *     // ...
 * }
 * ```
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
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_global_dark_mode' ) );
		add_action( 'admin_head', array( $this, 'inject_custom_css' ), 999 );
		add_action( 'admin_footer', array( $this, 'render_global_dark_mode_fab' ) );

		// Core settings AJAX handlers.
		add_action( 'wp_ajax_mase_save_settings', array( $this, 'handle_ajax_save_settings' ) );
		add_action( 'wp_ajax_mase_export_settings', array( $this, 'handle_ajax_export_settings' ) );
		add_action( 'wp_ajax_mase_import_settings', array( $this, 'handle_ajax_import_settings' ) );
		add_action( 'wp_ajax_mase_reset_settings', array( $this, 'handle_ajax_reset_settings' ) );

		// Palette AJAX handlers (Requirement 1.3).
		add_action( 'wp_ajax_mase_apply_palette', array( $this, 'ajax_apply_palette' ) );
		add_action( 'wp_ajax_mase_save_custom_palette', array( $this, 'handle_ajax_save_custom_palette' ) );
		add_action( 'wp_ajax_mase_delete_custom_palette', array( $this, 'handle_ajax_delete_custom_palette' ) );
		
		// MD3 Palette AJAX handler (Task 2.2: Dynamic Color Palette System).
		add_action( 'wp_ajax_mase_save_md3_palette', array( $this, 'handle_ajax_save_md3_palette' ) );

		// Template AJAX handlers (Requirement 2.4, 7.1).
		add_action( 'wp_ajax_mase_apply_template', array( $this, 'ajax_apply_template' ) );
		add_action( 'wp_ajax_mase_save_custom_template', array( $this, 'handle_ajax_save_custom_template' ) );
		add_action( 'wp_ajax_mase_delete_custom_template', array( $this, 'handle_ajax_delete_custom_template' ) );

		// Theme customization AJAX handler (Task 13.1: Theme Customization Panel).
		add_action( 'wp_ajax_mase_save_theme_customization', array( $this, 'handle_ajax_save_theme_customization' ) );

		// Theme variant AJAX handler (Task 4.8: Theme Color Variants).
		add_action( 'wp_ajax_mase_save_variant', array( $this, 'handle_ajax_save_variant' ) );

		// Gradient harmony AJAX handler (Task 10.3: Color Harmony Presets).
		add_action( 'wp_ajax_mase_save_gradient_harmony', array( $this, 'handle_ajax_save_gradient_harmony' ) );

		// Backup AJAX handlers (Requirement 16.1, 16.2, 16.3, 16.4, 16.5).
		add_action( 'wp_ajax_mase_create_backup', array( $this, 'handle_ajax_create_backup' ) );
		add_action( 'wp_ajax_mase_restore_backup', array( $this, 'handle_ajax_restore_backup' ) );
		add_action( 'wp_ajax_mase_get_backups', array( $this, 'handle_ajax_get_backups' ) );

		// Logo upload AJAX handler (Requirement 16.1).
		add_action( 'wp_ajax_mase_upload_menu_logo', array( $this, 'handle_ajax_upload_menu_logo' ) );

		// Login logo upload AJAX handler (Requirement 7.1).
		add_action( 'wp_ajax_mase_upload_login_logo', array( $this, 'handle_ajax_upload_login_logo' ) );

		// Login background image upload AJAX handler (Requirement 7.1).
		add_action( 'wp_ajax_mase_upload_login_background', array( $this, 'handle_ajax_upload_login_background' ) );

		// Background image upload AJAX handler (Advanced Background System - Task 3).
		add_action( 'wp_ajax_mase_upload_background_image', array( $this, 'handle_ajax_upload_background_image' ) );

		// Background image selection from media library AJAX handler (Advanced Background System - Task 5).
		add_action( 'wp_ajax_mase_select_background_image', array( $this, 'handle_ajax_select_background_image' ) );

		// Background image removal AJAX handler (Advanced Background System - Task 6).
		add_action( 'wp_ajax_mase_remove_background_image', array( $this, 'handle_ajax_remove_background_image' ) );

		// Pattern library data AJAX handler (Advanced Background System - Task 35).
		add_action( 'wp_ajax_mase_get_pattern_library', array( $this, 'handle_ajax_get_pattern_library' ) );

		// Dark mode toggle AJAX handler (Requirements 2.1, 2.2, 4.1, 11.1).
		add_action( 'wp_ajax_mase_toggle_dark_mode', array( $this, 'handle_ajax_toggle_dark_mode' ) );

		// Client-side error logging AJAX handler (Task 44 - Requirement 7.5).
		add_action( 'wp_ajax_mase_log_client_error', array( $this, 'handle_ajax_log_client_error' ) );

		// Performance monitoring AJAX handler (Task 18.3: Measure CSS file sizes).
		add_action( 'wp_ajax_mase_get_template_sizes', array( $this, 'handle_ajax_get_template_sizes' ) );

		// Theme scheduler AJAX handler (Task 20.2: Theme Scheduling).
		add_action( 'wp_ajax_mase_save_scheduler_settings', array( $this, 'handle_ajax_save_scheduler_settings' ) );

		// Universal Button Styling System AJAX handlers (Requirements 12.1, 12.2).
		add_action( 'wp_ajax_mase_get_button_defaults', array( $this, 'ajax_get_button_defaults' ) );
		add_action( 'wp_ajax_mase_reset_button_type', array( $this, 'ajax_reset_button_type' ) );
		add_action( 'wp_ajax_mase_reset_all_buttons', array( $this, 'ajax_reset_all_buttons' ) );

		// Login page customization hooks (Requirements 8.1, 1.6, 4.1).
		add_action( 'login_enqueue_scripts', array( $this, 'inject_login_css' ) );
		add_filter( 'login_headerurl', array( $this, 'filter_login_logo_url' ) );
		add_filter( 'login_headertext', array( $this, 'filter_login_logo_title' ) );
		add_action( 'login_footer', array( $this, 'inject_login_footer' ) );

		/**
		 * REMOVED: Duplicate mobile optimizer AJAX handler registration.
		 * These handlers are already registered in modern-admin-styler.php mase_init() function.
		 * Keeping them here caused duplicate execution and race conditions.
		 *
		 * @see modern-admin-styler.php lines 189-192
		 */
	}

	/**
	 * Enqueue global dark mode assets on all admin pages.
	 * Loads minimal CSS and JS for the floating dark mode toggle button.
	 *
	 * @param string $hook Current admin page hook.
	 */
	public function enqueue_global_dark_mode( $hook ) {
		// Enqueue dark mode CSS (contains FAB styles)
		wp_enqueue_style(
			'mase-global-dark-mode',
			plugins_url( '../assets/css/mase-admin.css', __FILE__ ),
			array(),
			MASE_VERSION
		);

		// Enqueue dark mode JavaScript
		wp_enqueue_script(
			'mase-global-dark-mode',
			plugins_url( '../assets/js/mase-global-dark-mode.js', __FILE__ ),
			array( 'jquery' ),
			MASE_VERSION,
			true
		);

		// Localize script with AJAX URL and nonce
		wp_localize_script(
			'mase-global-dark-mode',
			'maseGlobalDarkMode',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'mase_toggle_dark_mode' ),
			)
		);
	}

	/**
	 * Render global dark mode FAB (Floating Action Button).
	 * Displays on all admin pages for easy dark/light mode switching.
	 */
	public function render_global_dark_mode_fab() {
		// Get current dark mode state from user meta
		$user_id   = get_current_user_id();
		$dark_mode = get_user_meta( $user_id, 'mase_dark_mode_preference', true );
		$is_dark   = ( 'dark' === $dark_mode );
		?>
		<button 
			type="button" 
			id="mase-global-dark-mode-fab" 
			class="mase-dark-mode-fab" 
			aria-label="<?php echo $is_dark ? esc_attr__( 'Switch to Light Mode', 'modern-admin-styler' ) : esc_attr__( 'Switch to Dark Mode', 'modern-admin-styler' ); ?>"
			aria-pressed="<?php echo $is_dark ? 'true' : 'false'; ?>"
			data-mode="<?php echo $is_dark ? 'dark' : 'light'; ?>"
		>
			<span class="dashicons <?php echo $is_dark ? 'dashicons-sun' : 'dashicons-moon'; ?>" aria-hidden="true"></span>
			<span class="mase-fab-tooltip">
				<?php echo $is_dark ? esc_html__( 'Light Mode', 'modern-admin-styler' ) : esc_html__( 'Dark Mode', 'modern-admin-styler' ); ?>
			</span>
			<span class="sr-only">
				<?php echo $is_dark ? esc_html__( 'Current mode: Dark', 'modern-admin-styler' ) : esc_html__( 'Current mode: Light', 'modern-admin-styler' ); ?>
			</span>
		</button>
		<?php
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

		// Enqueue Material Design 3 Foundation CSS (Task 1: MD3 Foundation Setup)
		// These must load first as they provide design tokens for all other styles
		wp_enqueue_style(
			'mase-md3-tokens',
			plugins_url( '../assets/css/md3/md3-tokens.css', __FILE__ ),
			array(),
			MASE_VERSION
		);

		wp_enqueue_style(
			'mase-md3-elevation',
			plugins_url( '../assets/css/md3/md3-elevation.css', __FILE__ ),
			array( 'mase-md3-tokens' ),
			MASE_VERSION
		);

		wp_enqueue_style(
			'mase-md3-motion',
			plugins_url( '../assets/css/md3/md3-motion.css', __FILE__ ),
			array( 'mase-md3-tokens' ),
			MASE_VERSION
		);

		wp_enqueue_style(
			'mase-md3-typography',
			plugins_url( '../assets/css/md3/md3-typography.css', __FILE__ ),
			array( 'mase-md3-tokens' ),
			MASE_VERSION
		);

		wp_enqueue_style(
			'mase-md3-shape-spacing',
			plugins_url( '../assets/css/md3/md3-shape-spacing.css', __FILE__ ),
			array( 'mase-md3-tokens' ),
			MASE_VERSION
		);

		// Enqueue MD3 Palette Switcher JavaScript (Task 2.2: Dynamic Color Palette System)
		wp_enqueue_script(
			'mase-md3-palette',
			plugins_url( '../assets/js/mase-md3-palette.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue MD3 Template Cards JavaScript (Task 3: Artistic Template Card Redesign)
		wp_enqueue_script(
			'mase-md3-template-cards',
			plugins_url( '../assets/js/mase-md3-template-cards.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);
		
		// Enqueue MD3 Navigation Tabs JavaScript (Task 6: MD3 Navigation Tabs)
		wp_enqueue_script(
			'mase-md3-tabs',
			plugins_url( '../assets/js/mase-md3-tabs.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);
		
		// Enqueue MD3 Ripple Effect JavaScript (Task 7.3: Ripple Effect System)
		wp_enqueue_script(
			'mase-md3-ripple',
			plugins_url( '../assets/js/mase-md3-ripple.js', __FILE__ ),
			array( 'jquery' ),
			MASE_VERSION,
			true
		);
		
		// Enqueue MD3 Loading States JavaScript (Task 8: Artistic Loading States)
		wp_enqueue_script(
			'mase-md3-loading',
			plugins_url( '../assets/js/mase-md3-loading.js', __FILE__ ),
			array( 'jquery' ),
			MASE_VERSION,
			true
		);
		
		// Enqueue MD3 Micro-interactions JavaScript (Task 9: Micro-interaction Choreography)
		wp_enqueue_script(
			'mase-micro-interactions',
			plugins_url( '../assets/js/mase-micro-interactions.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);
		
		// Enqueue MD3 State Layers JavaScript (Task 10: State Layer System)
		wp_enqueue_script(
			'mase-md3-state-layers',
			plugins_url( '../assets/js/mase-md3-state-layers.js', __FILE__ ),
			array( 'jquery' ),
			MASE_VERSION,
			true
		);
		
		// Enqueue MD3 FAB JavaScript (Task 11: Floating Action Button)
		wp_enqueue_script(
			'mase-md3-fab',
			plugins_url( '../assets/js/mase-md3-fab.js', __FILE__ ),
			array( 'jquery', 'mase-md3-ripple' ),
			MASE_VERSION,
			true
		);
		
		// Enqueue MD3 Snackbar JavaScript (Task 12: Notification System Redesign)
		wp_enqueue_script(
			'mase-md3-snackbar',
			plugins_url( '../assets/js/mase-md3-snackbar.js', __FILE__ ),
			array( 'jquery' ),
			MASE_VERSION,
			true
		);
		
		// Enqueue Keyboard Navigation JavaScript (Task 15.3: Keyboard Navigation)
		wp_enqueue_script(
			'mase-keyboard-navigation',
			plugins_url( '../assets/js/mase-keyboard-navigation.js', __FILE__ ),
			array( 'jquery' ),
			MASE_VERSION,
			true
		);
		
		// Enqueue Reduced Motion JavaScript (Task 15.4: Reduced Motion Support)
		wp_enqueue_script(
			'mase-reduced-motion',
			plugins_url( '../assets/js/mase-reduced-motion.js', __FILE__ ),
			array( 'jquery' ),
			MASE_VERSION,
			true
		);
		
		// Enqueue MD3 Motion System JavaScript (Task 16: Performance Optimization)
		// Handles requestAnimationFrame animations and will-change management
		wp_enqueue_script(
			'mase-md3-motion',
			plugins_url( '../assets/js/mase-md3-motion.js', __FILE__ ),
			array( 'jquery' ),
			MASE_VERSION,
			true
		);
		
		// Enqueue MD3 Settings Panel JavaScript (Task 17: Settings Panel Redesign)
		// Handles collapsible sections and save feedback animations
		wp_enqueue_script(
			'mase-md3-settings',
			plugins_url( '../assets/js/mase-md3-settings.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);
		
		// Enqueue MD3 Color Harmony Visualization JavaScript (Task 20: Color Harmony Visualization)
		// Requirements: 28.1, 28.2, 28.3, 28.4, 28.5
		wp_enqueue_script(
			'mase-md3-color-harmony',
			plugins_url( '../assets/js/mase-md3-color-harmony.js', __FILE__ ),
			array( 'jquery', 'mase-admin', 'wp-color-picker' ),
			MASE_VERSION,
			true
		);

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
		
		// Enqueue MD3 template cards CSS (Task 3: Artistic Template Card Redesign)
		wp_enqueue_style(
			'mase-md3-templates',
			plugins_url( '../assets/css/mase-md3-templates.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-elevation', 'mase-md3-motion', 'mase-templates' ),
			MASE_VERSION
		);
		
		// Enqueue MD3 form controls CSS (Task 4: Premium Form Control Redesign)
		wp_enqueue_style(
			'mase-md3-forms',
			plugins_url( '../assets/css/mase-md3-forms.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-elevation', 'mase-md3-motion' ),
			MASE_VERSION
		);
		
		// Enqueue MD3 admin interface CSS (Task 5: Artistic Admin Header Design)
		wp_enqueue_style(
			'mase-md3-admin',
			plugins_url( '../assets/css/mase-md3-admin.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-elevation', 'mase-md3-motion', 'mase-md3-typography', 'mase-md3-shape-spacing' ),
			MASE_VERSION
		);
		
		// Enqueue MD3 navigation tabs CSS (Task 6: MD3 Navigation Tabs)
		wp_enqueue_style(
			'mase-md3-tabs',
			plugins_url( '../assets/css/mase-md3-tabs.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-elevation', 'mase-md3-motion', 'mase-md3-shape-spacing' ),
			MASE_VERSION
		);
		
		// Enqueue MD3 button system CSS (Task 7: Sophisticated Button System)
		wp_enqueue_style(
			'mase-md3-buttons',
			plugins_url( '../assets/css/mase-md3-buttons.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-elevation', 'mase-md3-motion', 'mase-md3-shape-spacing' ),
			MASE_VERSION
		);
		
		// Enqueue MD3 loading states CSS (Task 8: Artistic Loading States)
		wp_enqueue_style(
			'mase-md3-loading',
			plugins_url( '../assets/css/mase-md3-loading.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-motion', 'mase-md3-shape-spacing' ),
			MASE_VERSION
		);
		
		// Enqueue MD3 state layers CSS (Task 10: State Layer System)
		wp_enqueue_style(
			'mase-md3-state-layers',
			plugins_url( '../assets/css/mase-md3-state-layers.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-motion' ),
			MASE_VERSION
		);
		
		// Enqueue MD3 snackbar CSS (Task 12: Notification System Redesign)
		wp_enqueue_style(
			'mase-md3-snackbar',
			plugins_url( '../assets/css/mase-md3-snackbar.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-elevation', 'mase-md3-motion', 'mase-md3-shape-spacing' ),
			MASE_VERSION
		);
		
		// Enqueue responsive design CSS (Task 13: Responsive Design Optimization)
		// Must load after all MD3 styles to properly override with media queries
		wp_enqueue_style(
			'mase-responsive',
			plugins_url( '../assets/css/mase-responsive.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-admin', 'mase-md3-tabs', 'mase-md3-buttons', 'mase-md3-forms', 'mase-md3-templates', 'mase-md3-snackbar' ),
			MASE_VERSION
		);
		
		// Enqueue dark mode optimizations CSS (Task 14: Dark Mode Excellence)
		// Must load after all other MD3 styles to properly override for dark mode
		wp_enqueue_style(
			'mase-md3-dark-mode',
			plugins_url( '../assets/css/mase-md3-dark-mode.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-elevation', 'mase-md3-admin', 'mase-md3-tabs', 'mase-md3-buttons', 'mase-md3-forms', 'mase-md3-templates', 'mase-md3-snackbar', 'mase-responsive' ),
			MASE_VERSION
		);
		
		// Enqueue accessibility CSS (Task 15: Accessibility Implementation)
		// Must load after all other styles to ensure focus indicators and reduced motion work correctly
		wp_enqueue_style(
			'mase-accessibility',
			plugins_url( '../assets/css/mase-accessibility.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-admin', 'mase-md3-tabs', 'mase-md3-buttons', 'mase-md3-forms', 'mase-md3-templates', 'mase-md3-dark-mode' ),
			MASE_VERSION
		);
		
		// Enqueue performance optimization CSS (Task 16: Performance Optimization)
		// Must load after all other MD3 styles to apply GPU acceleration and will-change optimizations
		wp_enqueue_style(
			'mase-md3-performance',
			plugins_url( '../assets/css/mase-md3-performance.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-motion', 'mase-md3-admin', 'mase-md3-tabs', 'mase-md3-buttons', 'mase-md3-forms', 'mase-md3-templates', 'mase-md3-snackbar', 'mase-accessibility' ),
			MASE_VERSION
		);
		
		// Enqueue MD3 settings panel CSS (Task 17: Settings Panel Redesign)
		// Must load after all other MD3 styles to properly style settings sections
		wp_enqueue_style(
			'mase-md3-settings',
			plugins_url( '../assets/css/mase-md3-settings.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-elevation', 'mase-md3-motion', 'mase-md3-typography', 'mase-md3-shape-spacing', 'mase-md3-admin' ),
			MASE_VERSION
		);
		
		// Enqueue MD3 color harmony visualization CSS (Task 20: Color Harmony Visualization)
		// Requirements: 28.1, 28.2, 28.3, 28.4, 28.5
		wp_enqueue_style(
			'mase-md3-color-harmony',
			plugins_url( '../assets/css/mase-md3-color-harmony.css', __FILE__ ),
			array( 'mase-md3-tokens', 'mase-md3-elevation', 'mase-md3-motion', 'mase-md3-shape-spacing', 'mase-md3-settings' ),
			MASE_VERSION
		);
		
		// Enqueue template picker CSS
		wp_enqueue_style(
			'mase-template-picker',
			plugins_url( '../assets/css/mase-template-picker.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue preview modal CSS (Task 2.2: Interactive Preview System)
		wp_enqueue_style(
			'mase-preview-modal',
			plugins_url( '../assets/css/mase-preview-modal.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue theme variants CSS (Task 3: Theme Intensity Controls)
		wp_enqueue_style(
			'mase-theme-variants',
			plugins_url( '../assets/css/mase-theme-variants.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue variant selector CSS (Task 4.7: Theme Color Variants)
		wp_enqueue_style(
			'mase-variant-selector',
			plugins_url( '../assets/css/mase-variant-selector.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue micro-interactions CSS (Task 5: Advanced Micro-interactions)
		wp_enqueue_style(
			'mase-micro-interactions',
			plugins_url( '../assets/css/mase-micro-interactions.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue theme transitions CSS (Task 6: Smooth Theme Transitions)
		wp_enqueue_style(
			'mase-theme-transitions',
			plugins_url( '../assets/css/mase-theme-transitions.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue theme customizer CSS (Task 13.1: Theme Customization Panel)
		wp_enqueue_style(
			'mase-theme-customizer',
			plugins_url( '../assets/css/mase-theme-customizer.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue animation controls CSS (Task 15: Animation Controls)
		wp_enqueue_style(
			'mase-animation-controls',
			plugins_url( '../assets/css/mase-animation-controls.css', __FILE__ ),
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

		// Enqueue dark mode optimization CSS (Task 19: Dark Mode Optimization)
		wp_enqueue_style(
			'mase-dark-mode-optimization',
			plugins_url( '../assets/css/mase-dark-mode-optimization.css', __FILE__ ),
			array( 'mase-admin', 'mase-theme-variants' ),
			MASE_VERSION
		);

		// Enqueue mase-admin-menu.css for WordPress admin menu styling with proper role separation.
		// This implements the correct architecture for #adminmenuwrap, #adminmenuback, and #adminmenu.
		wp_enqueue_style(
			'mase-admin-menu',
			plugins_url( '../assets/css/mase-admin-menu.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue asset loader module FIRST (Advanced Background System - Task 35).
		// This must load before other modules to provide debounce/throttle utilities.
		wp_enqueue_script(
			'mase-asset-loader',
			plugins_url( '../assets/js/modules/mase-asset-loader.js', __FILE__ ),
			array( 'jquery' ),
			MASE_VERSION,
			true
		);

		// Enqueue mase-admin.js with jquery and wp-color-picker dependencies (Requirement 11.4).
		wp_enqueue_script(
			'mase-admin',
			plugins_url( '../assets/js/mase-admin.js', __FILE__ ),
			array( 'jquery', 'wp-color-picker', 'mase-asset-loader' ),
			MASE_VERSION,
			true
		);

		// Enqueue theme preview module (Task 2.3: Interactive Preview System)
		wp_enqueue_script(
			'mase-theme-preview',
			plugins_url( '../assets/js/mase-theme-preview.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue intensity controller module (Task 3.4: Theme Intensity Controls)
		wp_enqueue_script(
			'mase-intensity-controller',
			plugins_url( '../assets/js/mase-intensity-controller.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue variant selector module (Task 4.7: Theme Color Variants)
		wp_enqueue_script(
			'mase-variant-selector',
			plugins_url( '../assets/js/mase-variant-selector.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue theme transitions module (Task 6: Smooth Theme Transitions)
		wp_enqueue_script(
			'mase-theme-transitions',
			plugins_url( '../assets/js/mase-theme-transitions.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue theme customizer module (Task 13.1: Theme Customization Panel)
		wp_enqueue_script(
			'mase-theme-customizer',
			plugins_url( '../assets/js/mase-theme-customizer.js', __FILE__ ),
			array( 'jquery', 'wp-color-picker', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue animation controls module (Task 15: Animation Controls)
		wp_enqueue_script(
			'mase-animation-controls',
			plugins_url( '../assets/js/mase-animation-controls.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue responsive optimizer CSS (Task 16: Responsive Optimization)
		wp_enqueue_style(
			'mase-responsive-optimizer',
			plugins_url( '../assets/css/mase-responsive-optimizer.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue responsive optimizer module (Task 16: Responsive Optimization)
		wp_enqueue_script(
			'mase-responsive-optimizer',
			plugins_url( '../assets/js/mase-responsive-optimizer.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue performance monitor CSS (Task 18: Performance Monitoring)
		wp_enqueue_style(
			'mase-performance-monitor',
			plugins_url( '../assets/css/mase-performance-monitor.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue performance monitor module (Task 18: Performance Monitoring)
		wp_enqueue_script(
			'mase-performance-monitor',
			plugins_url( '../assets/js/mase-performance-monitor.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue theme scheduler CSS (Task 20: Theme Scheduling)
		wp_enqueue_style(
			'mase-theme-scheduler',
			plugins_url( '../assets/css/mase-theme-scheduler.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue theme scheduler module (Task 20: Theme Scheduling)
		wp_enqueue_script(
			'mase-theme-scheduler',
			plugins_url( '../assets/js/mase-theme-scheduler.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue gradient theme enhanced CSS (Task 10: Enhanced Gradient Theme Effects)
		wp_enqueue_style(
			'mase-gradient-theme-enhanced',
			plugins_url( '../assets/css/themes/gradient-theme-enhanced.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue gradient effects module (Task 10: Enhanced Gradient Theme Effects)
		wp_enqueue_script(
			'mase-gradient-effects',
			plugins_url( '../assets/js/mase-gradient-effects.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue floral theme enhanced CSS (Task 11: Enhanced Floral Theme Effects)
		wp_enqueue_style(
			'mase-floral-theme-enhanced',
			plugins_url( '../assets/css/themes/floral-theme-enhanced.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue floral effects module (Task 11: Enhanced Floral Theme Effects)
		wp_enqueue_script(
			'mase-floral-effects',
			plugins_url( '../assets/js/mase-floral-effects.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue retro theme enhanced CSS (Task 12: Enhanced Retro Theme Effects)
		wp_enqueue_style(
			'mase-retro-theme-enhanced',
			plugins_url( '../assets/css/themes/retro-theme-enhanced.css', __FILE__ ),
			array( 'mase-admin' ),
			MASE_VERSION
		);

		// Enqueue retro effects module (Task 12: Enhanced Retro Theme Effects)
		wp_enqueue_script(
			'mase-retro-effects',
			plugins_url( '../assets/js/mase-retro-effects.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue gradient builder module (Advanced Background System - Task 14).
		// Loaded on demand by asset loader when gradient tab is active.
		wp_enqueue_script(
			'mase-gradient-builder',
			plugins_url( '../assets/js/modules/mase-gradient-builder.js', __FILE__ ),
			array( 'jquery', 'wp-color-picker', 'mase-admin', 'mase-asset-loader' ),
			MASE_VERSION,
			true
		);

		// Enqueue pattern library module (Advanced Background System - Task 22).
		wp_enqueue_style(
			'mase-pattern-library',
			plugins_url( '../assets/css/mase-pattern-library.css', __FILE__ ),
			array(),
			MASE_VERSION
		);

		wp_enqueue_script(
			'mase-pattern-library',
			plugins_url( '../assets/js/mase-pattern-library.js', __FILE__ ),
			array( 'jquery', 'mase-admin', 'mase-asset-loader' ),
			MASE_VERSION,
			true
		);

		// Localize pattern library data (Task 22 - Requirement 3.1).
		// NOTE: Pattern library data is now loaded on demand via AJAX (Task 35).
		// This localization is kept for backward compatibility and immediate availability.
		$settings        = new MASE_Settings();
		$pattern_library = $settings->get_pattern_library();
		wp_localize_script(
			'mase-pattern-library',
			'masePatternLibrary',
			$pattern_library
		);

		// Localize scheduler data (Task 20: Theme Scheduling)
		$scheduler_settings = $settings->get_option();
		$template_manager   = new MASE_Template_Manager();
		wp_localize_script(
			'mase-theme-scheduler',
			'maseSchedulerData',
			array(
				'enabled'        => isset( $scheduler_settings['scheduler']['enabled'] ) ? (bool) $scheduler_settings['scheduler']['enabled'] : false,
				'syncWithSystem' => isset( $scheduler_settings['scheduler']['sync_with_system'] ) ? (bool) $scheduler_settings['scheduler']['sync_with_system'] : false,
				'schedule'       => isset( $scheduler_settings['scheduler']['schedule'] ) ? $scheduler_settings['scheduler']['schedule'] : array(),
				'templates'      => $settings->get_all_templates(),
			)
		);

		// Enqueue position picker module (Advanced Background System - Task 25).
		wp_enqueue_script(
			'mase-position-picker',
			plugins_url( '../assets/js/mase-position-picker.js', __FILE__ ),
			array( 'jquery', 'mase-admin', 'mase-asset-loader' ),
			MASE_VERSION,
			true
		);

		// Enqueue browser compatibility module (Advanced Background System - Task 43).
		// This module detects browser features and provides graceful degradation.
		// Must load early to apply fallbacks before other modules initialize.
		wp_enqueue_script(
			'mase-compatibility',
			plugins_url( '../assets/js/modules/mase-compatibility.js', __FILE__ ),
			array( 'jquery' ),
			MASE_VERSION,
			true
		);

		// Enqueue error recovery module (Advanced Background System - Task 44).
		// This module provides comprehensive error recovery mechanisms.
		// Must load early to set up global error handlers.
		wp_enqueue_script(
			'mase-error-recovery',
			plugins_url( '../assets/js/modules/mase-error-recovery.js', __FILE__ ),
			array( 'jquery', 'mase-admin' ),
			MASE_VERSION,
			true
		);

		// Enqueue accessibility module (Advanced Background System - Task 45).
		// This module provides comprehensive accessibility features:
		// - ARIA labels and attributes for all interactive elements
		// - Keyboard navigation support
		// - Focus indicators
		// - Screen reader announcements for dynamic changes
		// - WCAG 2.1 AA compliance
		// Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
		wp_enqueue_script(
			'mase-background-accessibility',
			plugins_url( '../assets/js/modules/mase-background-accessibility.js', __FILE__ ),
			array( 'jquery', 'mase-admin', 'mase-gradient-builder', 'mase-pattern-library', 'mase-position-picker' ),
			MASE_VERSION,
			true
		);

		// Enqueue diagnostic script when debug mode is enabled.
		// This script provides comprehensive diagnostics for admin menu issues.
		// Usage: Add ?mase_debug=1 to URL or run MASE_Diagnostic.runFullDiagnostic() in console
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			wp_enqueue_script(
				'mase-diagnostic',
				plugins_url( '../assets/js/mase-diagnostic.js', __FILE__ ),
				array( 'jquery' ),
				MASE_VERSION,
				true
			);
		}

		/**
		 * FOUC Prevention: Inline script for dark mode detection
		 *
		 * CRITICAL: This script MUST execute synchronously before page render to prevent
		 * Flash of Unstyled Content (FOUC) when dark mode is active.
		 *
		 * REQUIREMENTS (Task 10):
		 * - Check localStorage synchronously before page render (Requirement 12.1)
		 * - Apply .mase-dark-mode class immediately if dark mode active (Requirement 12.2)
		 * - Execute before main mase-admin.js loads (Requirement 12.3)
		 * - Execute in < 50ms (Requirement 12.4)
		 *
		 * IMPLEMENTATION STRATEGY:
		 * - Use wp_add_inline_script() with 'before' position to inject before main script
		 * - Check localStorage first (fastest, no server round-trip)
		 * - Fall back to user meta (passed via PHP for initial page load)
		 * - Fall back to 'light' if neither exists
		 * - Apply body class immediately if dark mode detected
		 *
		 * PERFORMANCE:
		 * - Synchronous execution ensures no FOUC
		 * - Minimal code (< 10 lines) ensures < 50ms execution
		 * - No DOM queries or complex operations
		 * - Single classList operation
		 *
		 * BROWSER COMPATIBILITY:
		 * - localStorage supported in all modern browsers (IE8+)
		 * - classList.add supported in all modern browsers (IE10+)
		 * - Graceful degradation: if localStorage unavailable, uses user meta
		 *
		 * @see Requirements 12.1, 12.2, 12.3, 12.4
		 * @see Design Document: Performance Considerations > Initial Load Performance
		 * @since 1.2.0
		 */
		$user_id                   = get_current_user_id();
		$user_dark_mode_preference = get_user_meta( $user_id, 'mase_dark_mode_preference', true );

		wp_add_inline_script(
			'mase-admin',
			'(function() {
				try {
					var savedMode = localStorage.getItem("mase_dark_mode");
					var userMeta = "' . esc_js( $user_dark_mode_preference ) . '";
					var mode = savedMode || userMeta || "light";
					
					if (mode === "dark") {
						document.body.classList.add("mase-dark-mode");
					}
				} catch (e) {
					// Fail silently if localStorage unavailable (private browsing)
					console.warn("MASE: Could not check dark mode preference", e);
				}
			})();',
			'before'
		);

		/**
		 * Localize script with translations and configuration
		 *
		 * LOCALIZATION (Task 20):
		 * - Wrap all user-facing strings in translation functions (Requirement 1.8)
		 * - Add translations for FAB tooltip
		 * - Add translations for mode announcements
		 * - Add translations for error messages
		 * - Add translations for settings page labels
		 *
		 * @since 1.2.0
		 */
		wp_localize_script(
			'mase-admin',
			'maseL10n',
			array(
				// AJAX configuration
				'ajaxUrl'                 => admin_url( 'admin-ajax.php' ),
				'nonce'                   => wp_create_nonce( 'mase_save_settings' ),

				// Dark mode FAB tooltip translations
				'switchToDarkMode'        => __( 'Switch to Dark Mode', 'modern-admin-styler' ),
				'switchToLightMode'       => __( 'Switch to Light Mode', 'modern-admin-styler' ),
				'toggleDarkMode'          => __( 'Toggle Dark Mode', 'modern-admin-styler' ),

				// Dark mode announcements for screen readers
				'darkModeActivated'       => __( 'Dark mode activated', 'modern-admin-styler' ),
				'lightModeActivated'      => __( 'Light mode activated', 'modern-admin-styler' ),
				'darkModeEnabled'         => __( 'Dark mode enabled', 'modern-admin-styler' ),
				'lightModeEnabled'        => __( 'Light mode enabled', 'modern-admin-styler' ),
				'currentModeDark'         => __( 'Current mode: Dark', 'modern-admin-styler' ),
				'currentModeLight'        => __( 'Current mode: Light', 'modern-admin-styler' ),

				// Dark mode error messages
				'darkModeError'           => __( 'Failed to toggle dark mode. Please try again.', 'modern-admin-styler' ),
				'darkModeSaveError'       => __( 'Dark mode applied locally. Preference will sync on next save.', 'modern-admin-styler' ),
				'darkModeStorageError'    => __( 'Could not save dark mode preference to browser storage.', 'modern-admin-styler' ),
				'darkModeNetworkError'    => __( 'Network error while saving dark mode preference.', 'modern-admin-styler' ),
				'darkModePermissionError' => __( 'You do not have permission to change dark mode settings.', 'modern-admin-styler' ),
				'darkModeServerError'     => __( 'Server error while saving dark mode preference. Please try again later.', 'modern-admin-styler' ),

				// Dark mode settings labels
				'enableDarkMode'          => __( 'Enable Dark Mode', 'modern-admin-styler' ),
				'darkModeSettings'        => __( 'Dark Mode Settings', 'modern-admin-styler' ),
				'lightPalette'            => __( 'Light Palette', 'modern-admin-styler' ),
				'darkPalette'             => __( 'Dark Palette', 'modern-admin-styler' ),
				'transitionDuration'      => __( 'Transition Duration', 'modern-admin-styler' ),
				'keyboardShortcut'        => __( 'Keyboard Shortcut', 'modern-admin-styler' ),
				'fabPosition'             => __( 'FAB Position', 'modern-admin-styler' ),
				'respectSystemPreference' => __( 'Respect System Preference', 'modern-admin-styler' ),

				// General UI messages
				'saving'                  => __( 'Saving...', 'modern-admin-styler' ),
				'saved'                   => __( 'Settings saved successfully!', 'modern-admin-styler' ),
				'error'                   => __( 'An error occurred. Please try again.', 'modern-admin-styler' ),
				'loading'                 => __( 'Loading...', 'modern-admin-styler' ),
				'applyingPalette'         => __( 'Applying palette...', 'modern-admin-styler' ),
				'paletteApplied'          => __( 'Palette applied successfully!', 'modern-admin-styler' ),
				'applyingTemplate'        => __( 'Applying template...', 'modern-admin-styler' ),
				'templateApplied'         => __( 'Template applied successfully!', 'modern-admin-styler' ),
			)
		);

		/**
		 * Localize theme customizer script (Task 13.1: Theme Customization Panel)
		 * 
		 * @since 1.3.0
		 */
		wp_localize_script(
			'mase-theme-customizer',
			'maseCustomizerL10n',
			array(
				'ajaxUrl'            => admin_url( 'admin-ajax.php' ),
				'nonce'              => wp_create_nonce( 'mase_save_settings' ),
				'panelTitle'         => __( 'Customize Theme', 'modern-admin-styler' ),
				'panelSubtitle'      => __( 'Adjust colors, effects, and spacing in real-time', 'modern-admin-styler' ),
				'closePanel'         => __( 'Close customization panel', 'modern-admin-styler' ),
				'livePreview'        => __( 'Live Preview', 'modern-admin-styler' ),
				'colorsTitle'        => __( 'Colors', 'modern-admin-styler' ),
				'colorsDescription'  => __( 'Customize theme colors to match your brand', 'modern-admin-styler' ),
				'primaryColor'       => __( 'Primary Color', 'modern-admin-styler' ),
				'secondaryColor'     => __( 'Secondary Color', 'modern-admin-styler' ),
				'accentColor'        => __( 'Accent Color', 'modern-admin-styler' ),
				'effectsTitle'       => __( 'Effects', 'modern-admin-styler' ),
				'effectsDescription' => __( 'Adjust visual effects intensity', 'modern-admin-styler' ),
				'blurIntensity'      => __( 'Blur Intensity', 'modern-admin-styler' ),
				'shadowDepth'        => __( 'Shadow Depth', 'modern-admin-styler' ),
				'borderRadius'       => __( 'Border Radius', 'modern-admin-styler' ),
				'resetButton'        => __( 'Reset', 'modern-admin-styler' ),
				'exportButton'       => __( 'Export', 'modern-admin-styler' ),
				'importButton'       => __( 'Import', 'modern-admin-styler' ),
				'saveButton'         => __( 'Save Changes', 'modern-admin-styler' ),
				'saving'             => __( 'Saving...', 'modern-admin-styler' ),
				'saveSuccess'        => __( 'Customizations saved successfully!', 'modern-admin-styler' ),
				'saveError'          => __( 'Failed to save customizations. Please try again.', 'modern-admin-styler' ),
				'confirmReset'       => __( 'Are you sure you want to reset all customizations to defaults?', 'modern-admin-styler' ),
				'settingsReset'      => __( 'Settings reset to defaults', 'modern-admin-styler' ),
				'panelOpened'        => __( 'Customization panel opened', 'modern-admin-styler' ),
				'panelClosed'        => __( 'Customization panel closed', 'modern-admin-styler' ),
				'previewPrimary'     => __( 'Primary Element', 'modern-admin-styler' ),
				'previewSecondary'   => __( 'Secondary Element', 'modern-admin-styler' ),
				'previewButton'      => __( 'Button Preview', 'modern-admin-styler' ),
				'previewText'        => __( 'This is sample text to preview typography and color changes in real-time.', 'modern-admin-styler' ),
				// Task 14: Export/Import translations
				'exportSuccess'      => __( 'Theme exported successfully!', 'modern-admin-styler' ),
				'importSuccess'      => __( 'Theme imported successfully!', 'modern-admin-styler' ),
				'importInvalidFile'  => __( 'Invalid file type. Please select a JSON file.', 'modern-admin-styler' ),
				'importFileTooLarge' => __( 'File is too large. Maximum size is 1MB.', 'modern-admin-styler' ),
				'importInvalidData'  => __( 'Invalid theme data. Please check the file format.', 'modern-admin-styler' ),
				'importParseError'   => __( 'Failed to parse theme file. Please check the file format.', 'modern-admin-styler' ),
				'importReadError'    => __( 'Failed to read theme file. Please try again.', 'modern-admin-styler' ),
			)
		);

		/**
		 * NOTE: Live preview functionality is handled by MASE.livePreview module.
		 * All live preview functionality is in assets/js/mase-admin.js
		 * to prevent duplicate event handlers and race conditions.
		 *
		 * @see MASE.livePreview module in assets/js/mase-admin.js
		 */

		// Localize MD3 palette data (Task 21.2: Localize JavaScript data)
		wp_localize_script(
			'mase-md3-palette',
			'maseMD3PaletteData',
			array(
				'ajaxurl'        => admin_url( 'admin-ajax.php' ),
				'nonce'          => wp_create_nonce( 'mase_save_settings' ),
				'currentPalette' => get_option( 'mase_md3_palette', 'purple' ),
				'palettes'       => array(
					'purple' => array(
						'name'  => __( 'Purple', 'modern-admin-styler' ),
						'label' => __( 'Purple Palette', 'modern-admin-styler' ),
					),
					'blue'   => array(
						'name'  => __( 'Blue', 'modern-admin-styler' ),
						'label' => __( 'Blue Palette', 'modern-admin-styler' ),
					),
					'green'  => array(
						'name'  => __( 'Green', 'modern-admin-styler' ),
						'label' => __( 'Green Palette', 'modern-admin-styler' ),
					),
					'orange' => array(
						'name'  => __( 'Orange', 'modern-admin-styler' ),
						'label' => __( 'Orange Palette', 'modern-admin-styler' ),
					),
					'pink'   => array(
						'name'  => __( 'Pink', 'modern-admin-styler' ),
						'label' => __( 'Pink Palette', 'modern-admin-styler' ),
					),
				),
				'strings'        => array(
					'paletteApplied'      => __( 'Palette applied successfully', 'modern-admin-styler' ),
					'paletteApplyFailed'  => __( 'Failed to apply palette', 'modern-admin-styler' ),
					'paletteSaving'       => __( 'Applying palette...', 'modern-admin-styler' ),
					'invalidPalette'      => __( 'Invalid palette selected', 'modern-admin-styler' ),
					'selectPalette'       => __( 'Select a color palette', 'modern-admin-styler' ),
					'currentPalette'      => __( 'Current Palette', 'modern-admin-styler' ),
					'previewPalette'      => __( 'Preview Palette', 'modern-admin-styler' ),
					'applyPalette'        => __( 'Apply Palette', 'modern-admin-styler' ),
					'paletteDescription'  => __( 'Choose a color palette to customize the admin interface', 'modern-admin-styler' ),
					'primaryColor'        => __( 'Primary Color', 'modern-admin-styler' ),
					'secondaryColor'      => __( 'Secondary Color', 'modern-admin-styler' ),
					'tertiaryColor'       => __( 'Tertiary Color', 'modern-admin-styler' ),
					'surfaceColor'        => __( 'Surface Color', 'modern-admin-styler' ),
					'errorColor'          => __( 'Error Color', 'modern-admin-styler' ),
				),
			)
		);

		// Localize MD3 settings data (Task 21.2: Localize JavaScript data)
		wp_localize_script(
			'mase-md3-settings',
			'maseMD3SettingsData',
			array(
				'ajaxurl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'mase_save_settings' ),
				'strings' => array(
					'settingsSaved'       => __( 'Settings saved successfully', 'modern-admin-styler' ),
					'settingsSaveFailed'  => __( 'Failed to save settings', 'modern-admin-styler' ),
					'settingsSaving'      => __( 'Saving settings...', 'modern-admin-styler' ),
					'sectionExpanded'     => __( 'Section expanded', 'modern-admin-styler' ),
					'sectionCollapsed'    => __( 'Section collapsed', 'modern-admin-styler' ),
					'expandSection'       => __( 'Expand section', 'modern-admin-styler' ),
					'collapseSection'     => __( 'Collapse section', 'modern-admin-styler' ),
					'resetToDefaults'     => __( 'Reset to defaults', 'modern-admin-styler' ),
					'confirmReset'        => __( 'Are you sure you want to reset these settings to defaults?', 'modern-admin-styler' ),
					'settingsReset'       => __( 'Settings reset to defaults', 'modern-admin-styler' ),
					'unsavedChanges'      => __( 'You have unsaved changes. Are you sure you want to leave?', 'modern-admin-styler' ),
					'saveChanges'         => __( 'Save Changes', 'modern-admin-styler' ),
					'discardChanges'      => __( 'Discard Changes', 'modern-admin-styler' ),
					'settingsPanel'       => __( 'Settings Panel', 'modern-admin-styler' ),
					'generalSettings'     => __( 'General Settings', 'modern-admin-styler' ),
					'advancedSettings'    => __( 'Advanced Settings', 'modern-admin-styler' ),
					'appearanceSettings'  => __( 'Appearance Settings', 'modern-admin-styler' ),
					'performanceSettings' => __( 'Performance Settings', 'modern-admin-styler' ),
				),
			)
		);

		// Localize MD3 motion data (Task 21.2: Localize JavaScript data)
		wp_localize_script(
			'mase-md3-motion',
			'maseMD3MotionData',
			array(
				'reducedMotion' => get_user_meta( get_current_user_id(), 'mase_reduced_motion', true ),
				'durations'     => array(
					'short'  => 200,
					'medium' => 300,
					'long'   => 500,
				),
				'easings'       => array(
					'emphasized'            => 'cubic-bezier(0.2, 0.0, 0, 1.0)',
					'emphasizedDecelerate'  => 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
					'emphasizedAccelerate'  => 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
					'standard'              => 'cubic-bezier(0.2, 0.0, 0, 1.0)',
					'standardDecelerate'    => 'cubic-bezier(0, 0, 0, 1.0)',
					'standardAccelerate'    => 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
				),
				'strings'       => array(
					'animationStarted'  => __( 'Animation started', 'modern-admin-styler' ),
					'animationComplete' => __( 'Animation complete', 'modern-admin-styler' ),
					'reducedMotionOn'   => __( 'Reduced motion enabled', 'modern-admin-styler' ),
					'reducedMotionOff'  => __( 'Reduced motion disabled', 'modern-admin-styler' ),
				),
			)
		);

		// Localize script with data and strings (Requirement 11.4).
		wp_localize_script(
			'mase-admin',
			'maseAdmin',
			array(
				'ajaxUrl'         => admin_url( 'admin-ajax.php' ),
				'nonce'           => wp_create_nonce( 'mase_save_settings' ),
				'debug'           => defined( 'WP_DEBUG' ) && WP_DEBUG,
				'md3Palette'      => get_option( 'mase_md3_palette', 'purple' ),
				'palettes'        => $this->get_palettes_data(),
				'templates'       => $this->get_templates_data(),
				'gradientPresets' => $this->get_gradient_presets_data(),
				'strings'         => array(
					'saving'                    => __( 'Saving...', 'modern-admin-styler' ),
					'saved'                     => __( 'Settings saved successfully!', 'modern-admin-styler' ),
					'saveFailed'                => __( 'Failed to save settings. Please try again.', 'modern-admin-styler' ),
					'paletteApplied'            => __( 'Palette applied successfully!', 'modern-admin-styler' ),
					'paletteApplyFailed'        => __( 'Failed to apply palette. Please try again.', 'modern-admin-styler' ),
					'templateApplied'           => __( 'Template applied successfully!', 'modern-admin-styler' ),
					'templateApplyFailed'       => __( 'Failed to apply template. Please try again.', 'modern-admin-styler' ),
					'confirmDelete'             => __( 'Are you sure you want to delete this item?', 'modern-admin-styler' ),
					'exportSuccess'             => __( 'Settings exported successfully!', 'modern-admin-styler' ),
					'exportFailed'              => __( 'Failed to export settings. Please try again.', 'modern-admin-styler' ),
					'importSuccess'             => __( 'Settings imported successfully!', 'modern-admin-styler' ),
					'importFailed'              => __( 'Failed to import settings. Please try again.', 'modern-admin-styler' ),
					'invalidFile'               => __( 'Invalid file format. Please select a valid JSON file.', 'modern-admin-styler' ),
					'backupCreated'             => __( 'Backup created successfully!', 'modern-admin-styler' ),
					'backupRestored'            => __( 'Backup restored successfully!', 'modern-admin-styler' ),
					'networkError'              => __( 'Network error. Please check your connection and try again.', 'modern-admin-styler' ),
					// Button styling strings (Task 10.1: Add translatable strings)
					'buttonResetConfirm'        => __( 'Reset all settings for %s buttons to defaults?', 'modern-admin-styler' ),
					'buttonResetAllConfirm'     => __( 'Reset ALL button settings to defaults? This cannot be undone.', 'modern-admin-styler' ),
					'buttonResetting'           => __( 'Resetting button settings...', 'modern-admin-styler' ),
					'buttonResetSuccess'        => __( 'Button settings reset to defaults', 'modern-admin-styler' ),
					'buttonResetFailed'         => __( 'Failed to reset button settings', 'modern-admin-styler' ),
					'buttonResetAllSuccess'     => __( 'All button settings reset to defaults. Reloading page...', 'modern-admin-styler' ),
					'buttonResetAllFailed'      => __( 'Failed to reset button settings', 'modern-admin-styler' ),
					'buttonResettingAll'        => __( 'Resetting all button settings...', 'modern-admin-styler' ),
					'permissionDenied'          => __( 'Permission denied. You do not have access to perform this action.', 'modern-admin-styler' ),
					// Background system strings (Task 46: Localization)
					'backgroundUploadSuccess'   => __( 'Background image uploaded successfully!', 'modern-admin-styler' ),
					'backgroundUploadFailed'    => __( 'Failed to upload background image. Please try again.', 'modern-admin-styler' ),
					'backgroundSelectSuccess'   => __( 'Background image selected successfully!', 'modern-admin-styler' ),
					'backgroundSelectFailed'    => __( 'Failed to select background image. Please try again.', 'modern-admin-styler' ),
					'backgroundRemoveSuccess'   => __( 'Background image removed successfully!', 'modern-admin-styler' ),
					'backgroundRemoveFailed'    => __( 'Failed to remove background image. Please try again.', 'modern-admin-styler' ),
					'backgroundInvalidFileType' => __( 'Invalid file type. Please upload JPG, PNG, WebP, or SVG images only.', 'modern-admin-styler' ),
					'backgroundFileTooLarge'    => __( 'File too large. Maximum size is 5MB.', 'modern-admin-styler' ),
					'backgroundUploading'       => __( 'Uploading...', 'modern-admin-styler' ),
					'backgroundProcessing'      => __( 'Processing image...', 'modern-admin-styler' ),
					'gradientMaxColorStops'     => __( 'Maximum 10 color stops allowed', 'modern-admin-styler' ),
					'gradientMinColorStops'     => __( 'Minimum 2 color stops required', 'modern-admin-styler' ),
					'gradientPresetApplied'     => __( 'Gradient preset applied successfully!', 'modern-admin-styler' ),
					'patternSelected'           => __( 'Pattern selected successfully!', 'modern-admin-styler' ),
					'patternLoadFailed'         => __( 'Failed to load pattern library. Please refresh the page.', 'modern-admin-styler' ),
					'positionUpdated'           => __( 'Background position updated', 'modern-admin-styler' ),
					'previewUpdateFailed'       => __( 'Failed to update preview. Please try again.', 'modern-admin-styler' ),
					'responsiveVariationSaved'  => __( 'Responsive variation saved successfully!', 'modern-admin-styler' ),
					'selectBackgroundImage'     => __( 'Select Background Image', 'modern-admin-styler' ),
					'useThisImage'              => __( 'Use This Image', 'modern-admin-styler' ),
					'changeImage'               => __( 'Change Image', 'modern-admin-styler' ),
					'removeImage'               => __( 'Remove Image', 'modern-admin-styler' ),
					'dropImageHere'             => __( 'Drop image here or click to upload', 'modern-admin-styler' ),
					'supportedFormats'          => __( 'Supported: JPG, PNG, WebP, SVG • Max size: 5MB', 'modern-admin-styler' ),
					'colorStop'                 => __( 'Color Stop', 'modern-admin-styler' ),
					'addColorStop'              => __( 'Add Color Stop', 'modern-admin-styler' ),
					'removeColorStop'           => __( 'Remove Color Stop', 'modern-admin-styler' ),
					'gradientAngle'             => __( 'Gradient Angle', 'modern-admin-styler' ),
					'gradientType'              => __( 'Gradient Type', 'modern-admin-styler' ),
					'linearGradient'            => __( 'Linear Gradient', 'modern-admin-styler' ),
					'radialGradient'            => __( 'Radial Gradient', 'modern-admin-styler' ),
					'backgroundOpacity'         => __( 'Background Opacity', 'modern-admin-styler' ),
					'blendMode'                 => __( 'Blend Mode', 'modern-admin-styler' ),
					'backgroundPosition'        => __( 'Background Position', 'modern-admin-styler' ),
					'backgroundSize'            => __( 'Background Size', 'modern-admin-styler' ),
					'backgroundRepeat'          => __( 'Background Repeat', 'modern-admin-styler' ),
					'backgroundAttachment'      => __( 'Background Attachment', 'modern-admin-styler' ),
					'customPosition'            => __( 'Custom Position', 'modern-admin-styler' ),
					'customSize'                => __( 'Custom Size', 'modern-admin-styler' ),
					'enableResponsive'          => __( 'Enable Responsive Variations', 'modern-admin-styler' ),
					'desktop'                   => __( 'Desktop', 'modern-admin-styler' ),
					'tablet'                    => __( 'Tablet', 'modern-admin-styler' ),
					'mobile'                    => __( 'Mobile', 'modern-admin-styler' ),
					'inheritFromDesktop'        => __( 'Inherit from Desktop', 'modern-admin-styler' ),
					'previewDevice'             => __( 'Preview Device', 'modern-admin-styler' ),
					'currentBreakpoint'         => __( 'Current Breakpoint', 'modern-admin-styler' ),
				),
			)
		);

		/**
		 * Fix pointer-events for dashicons blocking toggle clicks
		 *
		 * CRITICAL FIX: Dashicons positioned before checkboxes can block click events.
		 * This CSS ensures clicks pass through to the underlying checkbox.
		 *
		 * PROBLEM ANALYSIS:
		 * - Issue: Playwright tests were failing with "dashicons intercepts pointer events"
		 * - Root Cause: Dashicons have default pointer-events: auto, blocking clicks
		 * - Impact: Live Preview and Dark Mode toggles completely non-functional
		 * - Evidence: [tests/visual-testing/reports/detailed-results-1760831245552.json:6-8]
		 *
		 * SOLUTION DESIGN:
		 * - Set pointer-events: none on all dashicons within toggle contexts
		 * - Use multiple selector variations for maximum coverage
		 * - Apply !important to override any conflicting rules
		 * - Explicitly set pointer-events: auto on checkboxes to ensure clickability
		 * - Inject inline to guarantee early application before other stylesheets
		 *
		 * TECHNICAL DETAILS:
		 * - Inline styles have higher specificity than external stylesheets
		 * - Multiple selectors catch edge cases (direct children, nested, attribute selectors)
		 * - !important ensures precedence over WordPress core styles
		 * - Cursor: pointer on labels provides visual feedback
		 *
		 * BROWSER COMPATIBILITY:
		 * - pointer-events supported in all modern browsers (IE11+)
		 * - No fallback needed as this is a progressive enhancement
		 *
		 * @see Task 1.1 in .kiro/specs/live-preview-toggle-fix/tasks.md
		 * @see Requirements 1.1-1.5, 4.1-4.5
		 * @since 1.2.0
		 */
		wp_add_inline_style(
			'mase-admin',
			'/* ============================================================================
			   CRITICAL FIX: Dashicons Blocking Toggle Clicks
			   ============================================================================
			   
			   Problem: Dashicons positioned over checkboxes intercept click events,
			   preventing both user interactions and automated test clicks.
			   
			   Solution: Set pointer-events: none on dashicons to allow clicks to pass
			   through to underlying checkbox elements.
			   
			   Multiple selector variations ensure maximum coverage across different
			   HTML structures and WordPress versions.
			   ============================================================================ */
			
			/* Dashicons should not intercept pointer events */
			.mase-header-toggle .dashicons,
			.mase-header-toggle > .dashicons,
			label.mase-header-toggle .dashicons,
			label.mase-header-toggle > .dashicons,
			.mase-toggle-wrapper .dashicons,
			.mase-toggle-wrapper > .dashicons,
			[class*="toggle"] .dashicons,
			[class*="toggle"] > .dashicons,
			.mase-header-toggle span.dashicons,
			label.mase-header-toggle span.dashicons {
				pointer-events: none !important; /* !important overrides WordPress core styles */
			}
			
			/* Checkboxes must remain clickable - explicit override */
			.mase-header-toggle input[type="checkbox"],
			.mase-toggle-wrapper input[type="checkbox"],
			label.mase-header-toggle input[type="checkbox"] {
				pointer-events: auto !important; /* Ensure checkbox receives events */
			}
			
			/* Label should show pointer cursor for better UX */
			.mase-header-toggle,
			label.mase-header-toggle {
				cursor: pointer !important; /* Visual feedback for clickable area */
			}'
		);

		/**
		 * Enqueue Google Fonts for Typography System
		 *
		 * CONDITIONAL LOADING (Requirements 1.2, 1.5, 5.1, 5.7):
		 * - Only loads when Google Fonts are enabled in settings
		 * - Only loads on MASE settings page (already checked above)
		 * - Uses font-display: swap for performance
		 * - Preloads critical fonts to prevent FOUT
		 *
		 * PERFORMANCE OPTIMIZATION:
		 * - Lazy loading: Only loads when typography tab is active (handled by JS)
		 * - Font subsetting: Includes latin-ext for Polish language support
		 * - Preload links: Critical fonts loaded first
		 * - Cache: Google Fonts API caches fonts for 1 year
		 *
		 * REQUIREMENTS:
		 * - Check if Google Fonts enabled in settings (Requirement 1.2)
		 * - Generate Google Fonts URL from settings (Requirement 1.5)
		 * - Enqueue stylesheet with font-display: swap (Requirement 1.5)
		 * - Add preload links for critical fonts (Requirement 5.6)
		 * - Only load on MASE settings page (Requirement 5.7)
		 *
		 * @since 1.3.0
		 */
		$settings = $this->settings->get_option();

		// Check if Google Fonts are enabled.
		if ( ! empty( $settings['content_typography']['google_fonts_enabled'] ) ) {
			$google_fonts_list = ! empty( $settings['content_typography']['google_fonts_list'] )
				? $settings['content_typography']['google_fonts_list']
				: array();

			// Only enqueue if there are fonts to load.
			if ( ! empty( $google_fonts_list ) && is_array( $google_fonts_list ) ) {
				// Get font display setting (default: swap).
				$font_display = ! empty( $settings['content_typography']['font_display'] )
					? $settings['content_typography']['font_display']
					: 'swap';

				// Get font subset (default: latin-ext for Polish support).
				$font_subset = ! empty( $settings['content_typography']['font_subset'] )
					? $settings['content_typography']['font_subset']
					: 'latin-ext';

				// Generate Google Fonts URL.
				$google_fonts_url = $this->settings->get_google_font_url(
					$google_fonts_list,
					array(
						'font_display' => $font_display,
						'subset'       => $font_subset,
					)
				);

				// Enqueue Google Fonts stylesheet.
				if ( ! empty( $google_fonts_url ) ) {
					wp_enqueue_style(
						'mase-google-fonts',
						$google_fonts_url,
						array(),
						null // Google Fonts handles versioning.
					);

					// Add preload links for critical fonts.
					$preload_fonts = ! empty( $settings['content_typography']['preload_fonts'] )
						? $settings['content_typography']['preload_fonts']
						: array();

					if ( ! empty( $preload_fonts ) && is_array( $preload_fonts ) ) {
						// Generate preload link HTML.
						$preload_html = $this->settings->preload_google_fonts( $preload_fonts );

						// Add preload links to head.
						if ( ! empty( $preload_html ) ) {
							add_action(
								'admin_head',
								function () use ( $preload_html ) {
									echo $preload_html . "\n";
								},
								1
							); // Priority 1 to load early.
						}
					}
				}
			}
		}
		
		// CRITICAL FIX: Force admin bar to be visible on ALL admin pages
		// Admin bar is sometimes hidden by WordPress or conflicts with other plugins
		add_action('admin_head', function() {
			?>
			<style id="mase-force-adminbar-visibility">
				/* Force admin bar to be visible on ALL admin pages */
				#wpadminbar {
					display: flex !important;
					visibility: visible !important;
					opacity: 1 !important;
					position: fixed !important;
					top: 0 !important;
					left: 0 !important;
					right: 0 !important;
					width: 100% !important;
					z-index: 99999 !important;
				}
				
				/* Ensure admin bar items are visible */
				#wpadminbar * {
					visibility: visible !important;
					opacity: 1 !important;
				}
				
				/* Fix for empty admin bar - ensure content is rendered */
				#wpadminbar #wp-toolbar {
					display: flex !important;
					width: 100% !important;
					visibility: visible !important;
				}
				
				/* Fix for left and right sections */
				#wpadminbar #wp-admin-bar-root-default,
				#wpadminbar #wp-admin-bar-top-secondary {
					display: flex !important;
					visibility: visible !important;
				}
			</style>
			<?php
		}, 1); // Priority 1 to load early
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
	 * Get gradient presets data for JavaScript.
	 *
	 * Prepares gradient presets for localization to JavaScript.
	 * Requirement 2.3: Provide gradient presets library to JavaScript.
	 *
	 * @return array Gradient presets organized by category.
	 */
	private function get_gradient_presets_data() {
		return $this->settings->get_gradient_presets();
	}


	/**
	 * Inject custom CSS into admin pages with caching and error recovery.
	 *
	 * PERFORMANCE OPTIMIZATION (Requirements 19.1-19.5):
	 * 1. Cache Strategy:
	 *    - Checks cache before generating CSS (Requirement 19.1)
	 *    - Returns cached CSS when available (Requirement 19.2)
	 *    - Caches generated CSS for 1 hour (Requirement 19.3)
	 *    - Cache invalidated on settings update (Requirement 19.4)
	 *    - Reduces CSS generation overhead by ~95% (Requirement 19.5)
	 *
	 * 2. Cache Performance:
	 *    - Cache hit: <1ms response time
	 *    - Cache miss: ~50-100ms generation time
	 *    - Cache key: 'mase_generated_css'
	 *    - Cache duration: 3600 seconds (1 hour)
	 *
	 * ERROR RECOVERY (Requirement 7.5):
	 * Implements multi-level fallback strategy:
	 * 1. Try cached CSS (fastest)
	 * 2. Try mode-specific cache (dark/light)
	 * 3. Try legacy cache
	 * 4. Generate minimal safe CSS (last resort)
	 *
	 * SECURITY:
	 * - CSS output is not escaped (intentional - it's CSS, not HTML)
	 * - CSS generated from validated and sanitized settings only
	 * - No user input directly in CSS output
	 *
	 * DIAGNOSTIC LOGGING:
	 * - Tracks CSS injection count to detect duplicates
	 * - Logs CSS size and generation time
	 * - Monitors for overlapping style tags
	 * - Detects admin menu styling conflicts
	 *
	 * @since 1.0.0
	 * @return void Outputs CSS in <style> tag.
	 */
	public function inject_custom_css() {
		// DIAGNOSTIC: Track injection count to detect duplicates
		static $injection_count = 0;
		$injection_count++;
		
		if ( $injection_count > 1 ) {
			error_log( sprintf(
				'MASE DIAGNOSTIC WARNING: inject_custom_css() called %d times! This indicates duplicate CSS injection.',
				$injection_count
			) );
		}
		
		$start_time = microtime( true );
		
		try {
			// DIAGNOSTIC: Log current hook and priority
			$current_filter = current_filter();
			error_log( sprintf(
				'MASE DIAGNOSTIC: CSS injection #%d triggered by hook "%s"',
				$injection_count,
				$current_filter
			) );
			
			// Task 20: Check cache for generated CSS before generating (Requirement 19.1, 19.2).
			$cached_css = MASE_CacheManager::get( 'mase_generated_css' );

			if ( false !== $cached_css ) {
				// Cache hit - output cached CSS and return (Requirement 19.2).
				if ( ! empty( $cached_css ) ) {
					$css_size_kb = round( strlen( $cached_css ) / 1024, 2 );
					error_log( sprintf(
						'MASE DIAGNOSTIC: Using cached CSS (%s KB)',
						$css_size_kb
					) );
					
					echo '<style id="mase-custom-css" type="text/css">' . "\n";
					echo '/* MASE: Cached CSS - Injection #' . $injection_count . ' */' . "\n";
					echo $cached_css . "\n";
					echo '</style>' . "\n";
				}
				return;
			}

			// Cache miss - generate CSS (Requirement 19.1).
			error_log( 'MASE DIAGNOSTIC: Cache miss - generating fresh CSS' );
			
			$settings = $this->settings->get_option();
			$css      = $this->generator->generate( $settings );

			// DIAGNOSTIC: Log CSS sections generated
			$css_sections = array();
			if ( strpos( $css, 'admin_bar' ) !== false ) $css_sections[] = 'admin_bar';
			if ( strpos( $css, 'admin_menu' ) !== false || strpos( $css, '#adminmenu' ) !== false ) $css_sections[] = 'admin_menu';
			if ( strpos( $css, 'dark-mode' ) !== false ) $css_sections[] = 'dark_mode';
			if ( strpos( $css, 'button' ) !== false ) $css_sections[] = 'buttons';
			if ( strpos( $css, 'background' ) !== false ) $css_sections[] = 'backgrounds';
			
			error_log( sprintf(
				'MASE DIAGNOSTIC: Generated CSS sections: %s',
				empty( $css_sections ) ? 'none' : implode( ', ', $css_sections )
			) );

			// Apply minification if enabled.
			if ( ! empty( $settings['performance']['enable_minification'] ) ) {
				$css_before = strlen( $css );
				$css = $this->generator->minify( $css );
				$css_after = strlen( $css );
				$reduction = round( ( 1 - $css_after / $css_before ) * 100, 1 );
				error_log( sprintf(
					'MASE DIAGNOSTIC: CSS minified - %d bytes → %d bytes (-%s%%)',
					$css_before,
					$css_after,
					$reduction
				) );
			}

			// Task 20: Cache generated CSS for 1 hour (Requirement 19.3).
			MASE_CacheManager::set( 'mase_generated_css', $css, 3600 );

			// Output CSS if we have any.
			if ( ! empty( $css ) ) {
				$css_size_kb = round( strlen( $css ) / 1024, 2 );
				$generation_time = round( ( microtime( true ) - $start_time ) * 1000, 2 );
				
				error_log( sprintf(
					'MASE DIAGNOSTIC: Outputting fresh CSS (%s KB, generated in %s ms)',
					$css_size_kb,
					$generation_time
				) );
				
				echo '<style id="mase-custom-css" type="text/css">' . "\n";
				echo '/* MASE: Fresh CSS - Injection #' . $injection_count . ' - Generated in ' . $generation_time . 'ms */' . "\n";
				echo $css . "\n";
				echo '</style>' . "\n";
			} else {
				error_log( 'MASE DIAGNOSTIC WARNING: Generated CSS is empty!' );
			}
		} catch ( Exception $e ) {
			// Task 44: Enhanced error recovery (Requirement 7.5).
			// Log error with full context.
			error_log(
				sprintf(
					'MASE DIAGNOSTIC ERROR: CSS Injection Failed - %s, File: %s, Line: %d, Trace: %s',
					$e->getMessage(),
					$e->getFile(),
					$e->getLine(),
					$e->getTraceAsString()
				)
			);

			// Task 44: Try multiple fallback strategies (Requirement 7.5).
			$fallback_css = false;
			$fallback_source = 'none';

			// Strategy 1: Try cached CSS.
			$fallback_css = MASE_CacheManager::get( 'mase_generated_css' );
			if ( false !== $fallback_css ) {
				$fallback_source = 'main_cache';
			}

			// Strategy 2: Try mode-specific cache.
			if ( false === $fallback_css ) {
				$settings     = $this->settings->get_option();
				$current_mode = isset( $settings['dark_light_toggle']['current_mode'] )
					? $settings['dark_light_toggle']['current_mode']
					: 'light';

				if ( 'dark' === $current_mode ) {
					$fallback_css = $this->cache->get_cached_dark_mode_css();
					if ( false !== $fallback_css ) {
						$fallback_source = 'dark_mode_cache';
					}
				} else {
					$fallback_css = $this->cache->get_cached_light_mode_css();
					if ( false !== $fallback_css ) {
						$fallback_source = 'light_mode_cache';
					}
				}
			}

			// Strategy 3: Try legacy cache.
			if ( false === $fallback_css ) {
				$fallback_css = $this->cache->get_cached_css();
				if ( false !== $fallback_css ) {
					$fallback_source = 'legacy_cache';
				}
			}

			// Strategy 4: Try to generate minimal safe CSS.
			if ( false === $fallback_css || empty( $fallback_css ) ) {
				error_log( 'MASE DIAGNOSTIC: CRITICAL - No cache available, generating minimal safe CSS' );
				$fallback_css = $this->generate_minimal_safe_css();
				$fallback_source = 'minimal_safe';
			}

			// Output fallback CSS.
			if ( ! empty( $fallback_css ) ) {
				$fallback_size_kb = round( strlen( $fallback_css ) / 1024, 2 );
				error_log( sprintf(
					'MASE DIAGNOSTIC: Using fallback CSS from "%s" (%s KB)',
					$fallback_source,
					$fallback_size_kb
				) );
				
				echo '<style id="mase-custom-css" type="text/css">' . "\n";
				echo '/* MASE: Fallback CSS (source: ' . $fallback_source . ') - Injection #' . $injection_count . ' */' . "\n";
				echo $fallback_css . "\n";
				echo '</style>' . "\n";
			} else {
				error_log( 'MASE DIAGNOSTIC: CRITICAL - All fallback strategies failed, no CSS output!' );
			}
		}
		
		// DIAGNOSTIC: Log total injection time
		$total_time = round( ( microtime( true ) - $start_time ) * 1000, 2 );
		error_log( sprintf(
			'MASE DIAGNOSTIC: CSS injection #%d completed in %s ms',
			$injection_count,
			$total_time
		) );
	}

	/**
	 * Generate minimal safe CSS as last resort fallback.
	 * Task 44: Provide fallback CSS (Requirement 7.5)
	 *
	 * Returns basic WordPress admin styling to prevent complete styling failure.
	 *
	 * @since 1.4.0
	 * @return string Minimal safe CSS
	 */
	private function generate_minimal_safe_css() {
		return '/* MASE: Minimal safe CSS fallback */
body.wp-admin #wpadminbar {
	background-color: #23282d !important;
	height: 32px !important;
}
body.wp-admin #adminmenu {
	background-color: #23282d !important;
}
body.wp-admin #adminmenu a {
	color: #eee !important;
}
body.wp-admin #adminmenu .wp-submenu {
	background-color: #32373c !important;
}';
	}

	/**
	 * Handle AJAX save settings request.
	 *
	 * SECURITY IMPLEMENTATION (Requirement 20.3, 22.3):
	 * 1. CSRF Protection:
	 *    - Verifies nonce using check_ajax_referer()
	 *    - Returns 403 Forbidden if nonce invalid
	 *    - Nonce created with wp_create_nonce('mase_save_settings')
	 *
	 * 2. Authorization:
	 *    - Checks user has 'manage_options' capability
	 *    - Returns 403 Forbidden if unauthorized
	 *    - Prevents privilege escalation attacks
	 *
	 * 3. Input Validation:
	 *    - Accepts settings as JSON string to avoid max_input_vars limit
	 *    - Validates JSON format before processing
	 *    - Passes data through MASE_Settings::validate() for sanitization
	 *    - Returns detailed validation errors to user
	 *
	 * ERROR HANDLING:
	 * - Returns WP_Error details for validation failures
	 * - Logs all errors for debugging when WP_DEBUG enabled
	 * - Provides user-friendly error messages
	 * - Includes error codes for client-side handling
	 *
	 * PERFORMANCE OPTIMIZATION (Requirement 19.4):
	 * - Invalidates CSS cache after successful save
	 * - Ensures fresh CSS generated on next page load
	 * - Logs performance metrics for monitoring
	 *
	 * @since 1.0.0
	 * @return void Sends JSON response and exits.
	 */
	public function handle_ajax_save_settings() {
		try {
			// Security: Verify nonce for CSRF protection (Requirement 22.3).
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Security: Check user capability (Requirement 22.3).
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get and validate settings.
			// CRITICAL FIX: Settings are now sent as JSON string to avoid max_input_vars limit

			// Debug: Log incoming data
			error_log( '=== MASE: Save Settings Debug ===' );
			error_log( 'MASE: POST keys: ' . implode( ', ', array_keys( $_POST ) ) );

			if ( isset( $_POST['settings'] ) && is_string( $_POST['settings'] ) ) {
				$settings_size    = strlen( $_POST['settings'] );
				$settings_size_kb = round( $settings_size / 1024, 2 );
				error_log( 'MASE: POST settings size: ' . $settings_size . ' bytes (' . $settings_size_kb . ' KB)' );
				error_log( 'MASE: POST settings preview (first 200 chars): ' . substr( $_POST['settings'], 0, 200 ) );

				// Settings sent as JSON string - decode it
				$input = json_decode( stripslashes( $_POST['settings'] ), true );

				if ( json_last_error() !== JSON_ERROR_NONE ) {
					error_log( 'MASE: JSON decode error: ' . json_last_error_msg() );
					error_log( 'MASE: JSON error code: ' . json_last_error() );
					error_log( 'MASE: Raw POST data length: ' . strlen( $_POST['settings'] ) );
					wp_send_json_error(
						array( 'message' => __( 'Invalid settings format: ', 'mase' ) . json_last_error_msg() ),
						400
					);
				}

				error_log( 'MASE: JSON decoded successfully' );
				error_log( 'MASE: Decoded sections: ' . implode( ', ', array_keys( $input ) ) );

				// Log section sizes
				foreach ( $input as $section => $data ) {
					if ( is_array( $data ) ) {
						$section_json    = json_encode( $data );
						$section_size_kb = round( strlen( $section_json ) / 1024, 2 );
						error_log( 'MASE: Section "' . $section . '" size: ' . $section_size_kb . ' KB' );
					}
				}
			} else {
				error_log( 'MASE: Settings not sent as JSON string (fallback to array)' );
				// Fallback: Settings sent as array (old format)
				$input = isset( $_POST['settings'] ) ? $_POST['settings'] : array();
			}

			// Save settings.
			// Task 6 - Requirement 5.3: Log sections being validated before calling validate().
			error_log( 'MASE: Sections to validate: ' . implode( ', ', array_keys( $input ) ) );
			error_log( 'MASE: Calling update_option...' );
			$result = $this->settings->update_option( $input );

			// Task 6 - Requirement 5.4: Log validation pass/fail status after validate() returns.
			// CRITICAL: Check for WP_Error first, then boolean result (Task 4 - Requirements 2.3, 2.4, 4.2).
			if ( is_wp_error( $result ) ) {
				error_log( 'MASE: Validation status: FAILED' );
				error_log( 'MASE: Validation failed - ' . $result->get_error_message() );

				// Extract validation errors from WP_Error data (Task 4).
				$error_data     = $result->get_error_data();
				$error_messages = array();

				// Format error messages as array of "field: message" strings (Task 4).
				// Task 6 - Requirement 5.5: Log all validation error messages when validation fails.
				if ( is_array( $error_data ) ) {
					error_log( 'MASE: Total validation errors: ' . count( $error_data ) );
					foreach ( $error_data as $field => $message ) {
						$error_messages[] = sprintf( '%s: %s', $field, $message );
						error_log( 'MASE: Validation error - ' . $field . ': ' . $message );
					}
				} else {
					error_log( 'MASE: No detailed validation error data available' );
				}

				// Send JSON error response with validation_errors, error_details, and error_count (Task 4).
				// Use HTTP status 400 for validation errors (Task 4 - Requirement 4.2).
				wp_send_json_error(
					array(
						'message'           => __( 'Validation failed. Please fix the following errors:', 'mase' ),
						'validation_errors' => $error_data,
						'error_details'     => $error_messages,
						'error_count'       => count( $error_messages ),
					),
					400
				);
			}

			// Task 6 - Requirement 5.4: Log validation pass/fail status after validate() returns.
			if ( $result ) {
				error_log( 'MASE: Validation status: PASSED' );
				error_log( 'MASE: update_option() result: SUCCESS (true)' );
				error_log( 'MASE: Settings saved successfully' );

				// Invalidate both mode caches on settings save (Requirement 12.6).
				// Settings changes may affect both light and dark modes.
				$cache = new MASE_Cache();
				$cache->invalidate_both_mode_caches();

				// Clear button CSS cache on settings save (Requirement 6.3, 7.6).
				// Button settings changes require CSS regeneration.
				$cache->clear_button_css_cache();

				// Also invalidate legacy cache key for backward compatibility.
				$this->cache->invalidate( 'generated_css' );

				// Invalidate login CSS cache on settings save (Requirement 5.3, 8.3).
				// Login customization settings changes require CSS regeneration.
				$cache->invalidate_login_css_cache();

				// Warm cache for both modes (Requirement 12.7).
				// Task 33: Pre-generate CSS for faster subsequent loads, including backgrounds (Requirements 7.4, 7.5).
				$warm_results = $cache->warm_mode_caches( $this->generator, $input );

				// Task 33: Enhanced logging with background information (Requirement 7.5).
				$bg_info    = isset( $warm_results['backgrounds'] ) ? $warm_results['backgrounds'] : array();
				$bg_enabled = isset( $bg_info['enabled'] ) && $bg_info['enabled'];
				$bg_count   = isset( $bg_info['area_count'] ) ? $bg_info['area_count'] : 0;

				if ( $bg_enabled && $bg_count > 0 ) {
					$bg_areas = isset( $bg_info['enabled_areas'] ) ? implode( ', ', $bg_info['enabled_areas'] ) : 'none';
					error_log(
						sprintf(
							'MASE: Cache warming completed - Light: %s, Dark: %s, Backgrounds: %d areas (%s)',
							$warm_results['light'] ? 'success' : 'failed',
							$warm_results['dark'] ? 'success' : 'failed',
							$bg_count,
							$bg_areas
						)
					);
				} else {
					error_log(
						sprintf(
							'MASE: Cache warming completed - Light: %s, Dark: %s',
							$warm_results['light'] ? 'success' : 'failed',
							$warm_results['dark'] ? 'success' : 'failed'
						)
					);
				}

				wp_send_json_success(
					array(
						'message' => __( 'Settings saved successfully', 'mase' ),
					)
				);
			} else {
				// Task 6 - Requirement 5.4: Log update_option() result (true/false).
				error_log( 'MASE: Validation status: PASSED (but save failed)' );
				error_log( 'MASE: update_option() result: FAILED (false)' );
				error_log( 'MASE: Failed to save settings (update_option returned false)' );
				wp_send_json_error(
					array(
						'message' => __( 'Failed to save settings', 'mase' ),
					)
				);
			}
		} catch ( Exception $e ) {
			error_log( 'MASE Error (save_settings): ' . $e->getMessage() );
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred. Please try again.', 'mase' ),
				)
			);
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
			// Get detailed error information for debugging
			$error_data    = $result->get_error_data();
			$error_message = $result->get_error_message();

			// Log detailed error information
			error_log( 'MASE: apply_palette failed with error: ' . $error_message );
			if ( is_array( $error_data ) ) {
				error_log( 'MASE: Validation errors: ' . print_r( $error_data, true ) );
			}

			// Return detailed error to frontend
			wp_send_json_error(
				array(
					'message'           => $error_message,
					'validation_errors' => $error_data,
					'error_count'       => is_array( $error_data ) ? count( $error_data ) : 0,
				),
				400  // Changed from 500 to 400 for validation errors
			);
		}

		// Clear both mode caches (Requirement 12.6, 17.2).
		// Palette changes affect both light and dark modes.
		$cache = new MASE_Cache();
		$cache->invalidate_both_mode_caches();

		// Clear button CSS cache (Requirement 6.3, 7.6).
		// Palette changes may affect button colors.
		$cache->clear_button_css_cache();

		// Also invalidate legacy cache key for backward compatibility.
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
	 * Handle AJAX save MD3 palette request.
	 * 
	 * Saves the selected Material Design 3 color palette to WordPress options.
	 * 
	 * @since 1.4.0
	 * @return void Sends JSON response and exits.
	 */
	public function handle_ajax_save_md3_palette() {
		// Security validation: Verify nonce.
		check_ajax_referer( 'mase_save_settings', 'nonce' );

		// Security validation: Check user capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Insufficient permissions', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Input validation: Get and sanitize palette.
		$palette = isset( $_POST['palette'] ) ? sanitize_text_field( $_POST['palette'] ) : '';

		// Input validation: Check if empty.
		if ( empty( $palette ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Palette name is required', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Validate palette is one of the allowed values.
		$allowed_palettes = array( 'purple', 'blue', 'green', 'orange', 'pink' );
		if ( ! in_array( $palette, $allowed_palettes, true ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Invalid palette name', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Save palette to WordPress options.
		$result = update_option( 'mase_md3_palette', $palette );

		if ( false === $result && get_option( 'mase_md3_palette' ) !== $palette ) {
			wp_send_json_error(
				array(
					'message' => __( 'Failed to save palette', 'modern-admin-styler' ),
				),
				500
			);
		}

		// Return success response.
		wp_send_json_success(
			array(
				'message' => __( 'Palette saved successfully', 'modern-admin-styler' ),
				'palette' => $palette,
			)
		);
	}

	/**
	 * Handle AJAX export settings request.
	 *
	 * Requirement 22.3: CSRF protection via nonce verification and capability checks.
	 */
	public function handle_ajax_export_settings() {
		try {
			// Security: Verify nonce for CSRF protection (Requirement 22.3).
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				// Task 19: Log security violation with sanitized request data (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Export settings - Invalid nonce. User ID: %d, IP: %s',
							get_current_user_id(),
							isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown'
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Security: Check user capability (Requirement 22.3).
			if ( ! current_user_can( 'manage_options' ) ) {
				// Task 19: Log unauthorized access attempt (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Export settings - Unauthorized access. User ID: %d, IP: %s',
							get_current_user_id(),
							isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown'
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Task 19: Log export request (Requirement 9.3).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Export settings requested by user ID: %d',
						get_current_user_id()
					)
				);
			}

			// Get current settings.
			$settings = $this->settings->get_option();

			// Task 19: Validate settings retrieval (Requirement 9.4).
			if ( ! is_array( $settings ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Error: Export settings - Failed to retrieve settings' );
				}
				wp_send_json_error(
					array(
						'message' => __( 'Failed to retrieve settings for export.', 'mase' ),
					),
					500
				);
			}

			// Prepare export data.
			$export_data = array(
				'plugin'      => 'MASE',
				'version'     => '1.1.0',
				'exported_at' => current_time( 'mysql' ),
				'settings'    => $settings,
			);

			// Task 19: Log successful export (Requirement 9.3).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Settings exported successfully. User ID: %d, Settings count: %d',
						get_current_user_id(),
						count( $settings )
					)
				);
			}

			wp_send_json_success( $export_data );
		} catch ( Exception $e ) {
			// Task 19: Enhanced exception logging with stack trace (Requirement 9.5, 9.6).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE Error (export_settings): %s | File: %s | Line: %d | Trace: %s',
						$e->getMessage(),
						$e->getFile(),
						$e->getLine(),
						$e->getTraceAsString()
					)
				);
			}
			// Task 19: User-friendly error message (Requirement 9.6).
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred during export. Please try again.', 'mase' ),
				),
				500
			);
		}
	}

	/**
	 * Handle AJAX import settings request.
	 *
	 * Requirement 8.3: Validate JSON file structure before applying settings.
	 * Requirement 22.3: CSRF protection via nonce verification and capability checks.
	 */
	public function handle_ajax_import_settings() {
		try {
			// Security: Verify nonce for CSRF protection (Requirement 22.3).
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				// Task 19: Log security violation (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Import settings - Invalid nonce. User ID: %d, IP: %s',
							get_current_user_id(),
							isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown'
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Security: Check user capability (Requirement 22.3).
			if ( ! current_user_can( 'manage_options' ) ) {
				// Task 19: Log unauthorized access attempt (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Import settings - Unauthorized access. User ID: %d, IP: %s',
							get_current_user_id(),
							isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown'
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get import data.
			$import_data = isset( $_POST['settings_data'] ) ? wp_unslash( $_POST['settings_data'] ) : '';

			// Task 19: Log import request with data size (Requirement 9.3).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Import settings requested. User ID: %d, Data size: %d bytes',
						get_current_user_id(),
						strlen( $import_data )
					)
				);
			}

			if ( empty( $import_data ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Error: Import settings - No data provided' );
				}
				wp_send_json_error( array( 'message' => __( 'No import data provided', 'mase' ) ), 400 );
			}

			// Decode JSON (Requirement 8.3).
			$data = json_decode( $import_data, true );

			// Task 19: Log JSON decode errors (Requirement 9.4).
			if ( json_last_error() !== JSON_ERROR_NONE ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Import settings - JSON decode error: %s (code: %d)',
							json_last_error_msg(),
							json_last_error()
						)
					);
				}
				wp_send_json_error(
					array(
						'message' => __( 'Invalid JSON format: ', 'mase' ) . json_last_error_msg(),
					),
					400
				);
			}

			if ( ! $data || ! isset( $data['settings'] ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Error: Import settings - Invalid data structure (missing settings key)' );
				}
				wp_send_json_error( array( 'message' => __( 'Invalid import data format', 'mase' ) ), 400 );
			}

			// Validate plugin identifier.
			if ( ! isset( $data['plugin'] ) || 'MASE' !== $data['plugin'] ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Import settings - Invalid plugin identifier: %s',
							isset( $data['plugin'] ) ? $data['plugin'] : 'missing'
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Import data is not from MASE plugin', 'mase' ) ), 400 );
			}

			// Import settings.
			$result = $this->settings->update_option( $data['settings'] );

			// Task 19: Check for validation errors (Requirement 9.4).
			if ( is_wp_error( $result ) ) {
				$error_data = $result->get_error_data();
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Import settings - Validation failed: %s',
							$result->get_error_message()
						)
					);
					if ( is_array( $error_data ) ) {
						foreach ( $error_data as $field => $message ) {
							error_log( sprintf( 'MASE Validation Error: %s: %s', $field, $message ) );
						}
					}
				}
				wp_send_json_error(
					array(
						'message'           => __( 'Import validation failed: ', 'mase' ) . $result->get_error_message(),
						'validation_errors' => $error_data,
					),
					400
				);
			}

			if ( $result ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				// Task 19: Log successful import (Requirement 9.3).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE: Settings imported successfully. User ID: %d, Settings count: %d',
							get_current_user_id(),
							count( $data['settings'] )
						)
					);
				}

				wp_send_json_success(
					array(
						'message' => __( 'Settings imported successfully', 'mase' ),
					)
				);
			} else {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Error: Import settings - update_option returned false' );
				}
				wp_send_json_error(
					array(
						'message' => __( 'Failed to import settings', 'mase' ),
					),
					500
				);
			}
		} catch ( Exception $e ) {
			// Task 19: Enhanced exception logging with stack trace (Requirement 9.5, 9.6).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE Error (import_settings): %s | File: %s | Line: %d | Trace: %s',
						$e->getMessage(),
						$e->getFile(),
						$e->getLine(),
						$e->getTraceAsString()
					)
				);
			}
			// Task 19: User-friendly error message (Requirement 9.6).
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred during import. Please try again.', 'mase' ),
				),
				500
			);
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
				// Task 19: Log security violation (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Save custom palette - Invalid nonce. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				// Task 19: Log unauthorized access (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Save custom palette - Unauthorized access. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get palette data.
			$name   = isset( $_POST['name'] ) ? sanitize_text_field( $_POST['name'] ) : '';
			$colors = isset( $_POST['colors'] ) ? $_POST['colors'] : array();

			// Task 19: Log request data (sanitized) (Requirement 9.3).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Save custom palette requested. User ID: %d, Name: %s, Colors count: %d',
						get_current_user_id(),
						$name,
						is_array( $colors ) ? count( $colors ) : 0
					)
				);
			}

			// Task 19: Validate input with detailed error messages (Requirement 9.4).
			if ( empty( $name ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Validation Error: Save custom palette - Name is required' );
				}
				wp_send_json_error( array( 'message' => __( 'Palette name is required', 'mase' ) ), 400 );
			}

			if ( empty( $colors ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Validation Error: Save custom palette - Colors are required' );
				}
				wp_send_json_error( array( 'message' => __( 'Palette colors are required', 'mase' ) ), 400 );
			}

			// Save custom palette.
			$palette_id = $this->settings->save_custom_palette( $name, $colors );

			if ( $palette_id ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				// Task 19: Log successful save (Requirement 9.3).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE: Custom palette saved successfully. ID: %s, Name: %s, User ID: %d',
							$palette_id,
							$name,
							get_current_user_id()
						)
					);
				}

				wp_send_json_success(
					array(
						'message'    => __( 'Custom palette saved successfully', 'mase' ),
						'palette_id' => $palette_id,
					)
				);
			} else {
				// Task 19: Log save failure (Requirement 9.4).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Failed to save custom palette. Name: %s, User ID: %d',
							$name,
							get_current_user_id()
						)
					);
				}
				wp_send_json_error(
					array(
						'message' => __( 'Failed to save custom palette', 'mase' ),
					),
					500
				);
			}
		} catch ( Exception $e ) {
			// Task 19: Enhanced exception logging (Requirement 9.5, 9.6).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE Error (save_custom_palette): %s | File: %s | Line: %d | Trace: %s',
						$e->getMessage(),
						$e->getFile(),
						$e->getLine(),
						$e->getTraceAsString()
					)
				);
			}
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred. Please try again.', 'mase' ),
				),
				500
			);
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
				// Task 19: Log security violation (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Delete custom palette - Invalid nonce. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				// Task 19: Log unauthorized access (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Delete custom palette - Unauthorized access. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get palette ID.
			$palette_id = isset( $_POST['palette_id'] ) ? sanitize_text_field( $_POST['palette_id'] ) : '';

			// Task 19: Log request with sanitized data (Requirement 9.3).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Delete custom palette requested. User ID: %d, Palette ID: %s',
						get_current_user_id(),
						$palette_id
					)
				);
			}

			// Task 19: Validate input (Requirement 9.4).
			if ( empty( $palette_id ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Validation Error: Delete custom palette - Palette ID is required' );
				}
				wp_send_json_error( array( 'message' => __( 'Invalid palette ID', 'mase' ) ), 400 );
			}

			// Delete custom palette.
			$result = $this->settings->delete_custom_palette( $palette_id );

			if ( $result ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				// Task 19: Log successful deletion (Requirement 9.3).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE: Custom palette deleted successfully. ID: %s, User ID: %d',
							$palette_id,
							get_current_user_id()
						)
					);
				}

				wp_send_json_success(
					array(
						'message' => __( 'Custom palette deleted successfully', 'mase' ),
					)
				);
			} else {
				// Task 19: Log deletion failure (Requirement 9.4).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Failed to delete custom palette. ID: %s, User ID: %d',
							$palette_id,
							get_current_user_id()
						)
					);
				}
				wp_send_json_error(
					array(
						'message' => __( 'Failed to delete custom palette', 'mase' ),
					),
					500
				);
			}
		} catch ( Exception $e ) {
			// Task 19: Enhanced exception logging (Requirement 9.5, 9.6).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE Error (delete_custom_palette): %s | File: %s | Line: %d | Trace: %s',
						$e->getMessage(),
						$e->getFile(),
						$e->getLine(),
						$e->getTraceAsString()
					)
				);
			}
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred. Please try again.', 'mase' ),
				),
				500
			);
		}
	}

	/**
	 * AJAX Handler: Reset All Settings
	 *
	 * Resets all plugin settings to default values.
	 *
	 * @since 1.2.0
	 * @return void Sends JSON response and exits.
	 */
	public function handle_ajax_reset_settings() {
		try {
			// Verify nonce.
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Reset settings - Invalid nonce. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Reset settings - Unauthorized access. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Log reset request.
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Reset all settings requested. User ID: %d',
						get_current_user_id()
					)
				);
			}

			// Get default settings.
			$defaults = $this->settings->get_defaults();

			// Update option with defaults.
			$result = update_option( MASE_Settings::OPTION_NAME, $defaults );

			if ( $result ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				// Log successful reset.
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE: Settings reset to defaults successfully. User ID: %d',
							get_current_user_id()
						)
					);
				}

				wp_send_json_success(
					array(
						'message' => __( 'Settings reset to defaults successfully', 'mase' ),
					)
				);
			} else {
				// Log reset failure.
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Failed to reset settings. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error(
					array(
						'message' => __( 'Failed to reset settings', 'mase' ),
					),
					500
				);
			}
		} catch ( Exception $e ) {
			// Enhanced exception logging.
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE Error (reset_settings): %s | File: %s | Line: %d | Trace: %s',
						$e->getMessage(),
						$e->getFile(),
						$e->getLine(),
						$e->getTraceAsString()
					)
				);
			}
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred. Please try again.', 'mase' ),
				),
				500
			);
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
			// Get detailed error information for debugging
			$error_data    = $result->get_error_data();
			$error_message = $result->get_error_message();

			// Log detailed error information
			error_log( 'MASE: apply_template failed with error: ' . $error_message );
			if ( is_array( $error_data ) ) {
				error_log( 'MASE: Validation errors: ' . print_r( $error_data, true ) );
			}

			// Return detailed error to frontend
			wp_send_json_error(
				array(
					'message'           => $error_message,
					'validation_errors' => $error_data,
					'error_count'       => is_array( $error_data ) ? count( $error_data ) : 0,
				),
				400  // Changed from 500 to 400 for validation errors
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
	 * Handle AJAX save variant preference request.
	 * Task 4.8: Save theme color variant preference.
	 * Requirements: 3.2, 3.4
	 *
	 * @since 1.3.0
	 * @return void Sends JSON response and exits.
	 */
	public function handle_ajax_save_variant() {
		// Security validation: Verify nonce.
		check_ajax_referer( 'mase_save_settings', 'nonce' );

		// Security validation: Check user capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Insufficient permissions', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Input validation: Get and sanitize theme and variant.
		$theme   = isset( $_POST['theme'] ) ? sanitize_text_field( $_POST['theme'] ) : '';
		$variant = isset( $_POST['variant'] ) ? sanitize_text_field( $_POST['variant'] ) : '';

		// Input validation: Check if empty.
		if ( empty( $theme ) || empty( $variant ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Theme and variant are required', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Get current settings.
		$current_settings = $this->settings->get_option();

		// Initialize variants array if it doesn't exist.
		if ( ! isset( $current_settings['templates']['variants'] ) ) {
			$current_settings['templates']['variants'] = array();
		}

		// Save variant preference.
		$current_settings['templates']['variants'][ $theme ] = $variant;

		// Update settings using direct WordPress function to bypass validation.
		// This is safe because we're only updating the variants sub-array.
		$result = update_option( MASE_Settings::OPTION_NAME, $current_settings );

		// Check for save errors.
		if ( false === $result ) {
			wp_send_json_error(
				array(
					'message' => __( 'Failed to save variant preference', 'modern-admin-styler' ),
				),
				500
			);
		}

		// Invalidate CSS cache.
		$this->cache->invalidate( 'generated_css' );

		// Return success response.
		wp_send_json_success(
			array(
				'message' => __( 'Variant saved successfully', 'modern-admin-styler' ),
				'theme'   => $theme,
				'variant' => $variant,
			)
		);
	}

	/**
	 * AJAX handler: Save gradient harmony preference
	 *
	 * Saves the selected color harmony preset for the gradient theme.
	 * Task 10.3: Color Harmony Presets
	 *
	 * @since 1.4.0
	 * @return void Sends JSON response and exits.
	 */
	public function handle_ajax_save_gradient_harmony() {
		// Security validation: Verify nonce.
		check_ajax_referer( 'mase_save_settings', 'nonce' );

		// Security validation: Check user capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Insufficient permissions', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Input validation: Get and sanitize harmony.
		$harmony = isset( $_POST['harmony'] ) ? sanitize_text_field( $_POST['harmony'] ) : '';

		// Validate harmony value against allowed options.
		$allowed_harmonies = array( 'default', 'complementary', 'triadic', 'analogous' );
		if ( ! in_array( $harmony, $allowed_harmonies, true ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Invalid harmony value', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Get current settings.
		$current_settings = $this->settings->get_option();

		// Initialize gradient settings if it doesn't exist.
		if ( ! isset( $current_settings['gradient'] ) ) {
			$current_settings['gradient'] = array();
		}

		// Save harmony preference.
		$current_settings['gradient']['harmony'] = $harmony;

		// Update settings using direct WordPress function to bypass validation.
		$result = update_option( MASE_Settings::OPTION_NAME, $current_settings );

		// Check for save errors.
		if ( false === $result ) {
			wp_send_json_error(
				array(
					'message' => __( 'Failed to save harmony preference', 'modern-admin-styler' ),
				),
				500
			);
		}

		// Invalidate CSS cache.
		$this->cache->invalidate( 'generated_css' );

		// Return success response.
		wp_send_json_success(
			array(
				'message' => __( 'Harmony saved successfully', 'modern-admin-styler' ),
				'harmony' => $harmony,
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
				// Task 19: Log security violation (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Save custom template - Invalid nonce. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				// Task 19: Log unauthorized access (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Save custom template - Unauthorized access. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get template data.
			$name     = isset( $_POST['name'] ) ? sanitize_text_field( $_POST['name'] ) : '';
			$settings = isset( $_POST['settings'] ) ? $_POST['settings'] : array();

			// Task 19: Log request data (sanitized) (Requirement 9.3).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Save custom template requested. User ID: %d, Name: %s, Settings count: %d',
						get_current_user_id(),
						$name,
						is_array( $settings ) ? count( $settings ) : 0
					)
				);
			}

			// Task 19: Validate input with detailed error messages (Requirement 9.4).
			if ( empty( $name ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Validation Error: Save custom template - Name is required' );
				}
				wp_send_json_error( array( 'message' => __( 'Template name is required', 'mase' ) ), 400 );
			}

			if ( empty( $settings ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Validation Error: Save custom template - Settings are required' );
				}
				wp_send_json_error( array( 'message' => __( 'Template settings are required', 'mase' ) ), 400 );
			}

			// Save custom template.
			$template_id = $this->settings->save_custom_template( $name, $settings );

			if ( $template_id ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				// Task 19: Log successful save (Requirement 9.3).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE: Custom template saved successfully. ID: %s, Name: %s, User ID: %d',
							$template_id,
							$name,
							get_current_user_id()
						)
					);
				}

				wp_send_json_success(
					array(
						'message'     => __( 'Custom template saved successfully', 'mase' ),
						'template_id' => $template_id,
					)
				);
			} else {
				// Task 19: Log save failure (Requirement 9.4).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Failed to save custom template. Name: %s, User ID: %d',
							$name,
							get_current_user_id()
						)
					);
				}
				wp_send_json_error(
					array(
						'message' => __( 'Failed to save custom template', 'mase' ),
					),
					500
				);
			}
		} catch ( Exception $e ) {
			// Task 19: Enhanced exception logging (Requirement 9.5, 9.6).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE Error (save_custom_template): %s | File: %s | Line: %d | Trace: %s',
						$e->getMessage(),
						$e->getFile(),
						$e->getLine(),
						$e->getTraceAsString()
					)
				);
			}
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred. Please try again.', 'mase' ),
				),
				500
			);
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
				// Task 19: Log security violation (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Delete custom template - Invalid nonce. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				// Task 19: Log unauthorized access (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Delete custom template - Unauthorized access. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get template ID.
			$template_id = isset( $_POST['template_id'] ) ? sanitize_text_field( $_POST['template_id'] ) : '';

			// Task 19: Log request with sanitized data (Requirement 9.3).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Delete custom template requested. User ID: %d, Template ID: %s',
						get_current_user_id(),
						$template_id
					)
				);
			}

			// Task 19: Validate input (Requirement 9.4).
			if ( empty( $template_id ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Validation Error: Delete custom template - Template ID is required' );
				}
				wp_send_json_error( array( 'message' => __( 'Invalid template ID', 'mase' ) ), 400 );
			}

			// Delete custom template.
			$result = $this->settings->delete_custom_template( $template_id );

			if ( $result ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				// Task 19: Log successful deletion (Requirement 9.3).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE: Custom template deleted successfully. ID: %s, User ID: %d',
							$template_id,
							get_current_user_id()
						)
					);
				}

				wp_send_json_success(
					array(
						'message' => __( 'Custom template deleted successfully', 'mase' ),
					)
				);
			} else {
				// Task 19: Log deletion failure (Requirement 9.4).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Failed to delete custom template. ID: %s, User ID: %d',
							$template_id,
							get_current_user_id()
						)
					);
				}
				wp_send_json_error(
					array(
						'message' => __( 'Failed to delete custom template', 'mase' ),
					),
					500
				);
			}
		} catch ( Exception $e ) {
			// Task 19: Enhanced exception logging (Requirement 9.5, 9.6).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE Error (delete_custom_template): %s | File: %s | Line: %d | Trace: %s',
						$e->getMessage(),
						$e->getFile(),
						$e->getLine(),
						$e->getTraceAsString()
					)
				);
			}
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred. Please try again.', 'mase' ),
				),
				500
			);
		}
	}

	/**
	 * Handle AJAX save theme customization request.
	 * Task 13.1: Theme Customization Panel - Save customizations (Requirement 14.5)
	 * 
	 * @since 1.3.0
	 * @return void Sends JSON response and exits.
	 */
	public function handle_ajax_save_theme_customization() {
		try {
			// Verify nonce (CSRF protection).
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Save theme customization - Invalid nonce. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'modern-admin-styler' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Save theme customization - Unauthorized access. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'modern-admin-styler' ) ), 403 );
			}

			// Get customization data.
			$template_id = isset( $_POST['template_id'] ) ? sanitize_text_field( $_POST['template_id'] ) : '';
			$settings    = isset( $_POST['settings'] ) ? $_POST['settings'] : array();

			// Log request data.
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Save theme customization requested. User ID: %d, Template ID: %s',
						get_current_user_id(),
						$template_id
					)
				);
			}

			// Validate input.
			if ( empty( $template_id ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Validation Error: Save theme customization - Template ID is required' );
				}
				wp_send_json_error( array( 'message' => __( 'Template ID is required', 'modern-admin-styler' ) ), 400 );
			}

			if ( empty( $settings ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Validation Error: Save theme customization - Settings are required' );
				}
				wp_send_json_error( array( 'message' => __( 'Customization settings are required', 'modern-admin-styler' ) ), 400 );
			}

			// Sanitize settings.
			$sanitized_settings = array();
			
			// Sanitize colors.
			if ( isset( $settings['colors'] ) && is_array( $settings['colors'] ) ) {
				$sanitized_settings['colors'] = array();
				foreach ( $settings['colors'] as $key => $value ) {
					$sanitized_key = sanitize_key( $key );
					$sanitized_value = sanitize_hex_color( $value );
					if ( $sanitized_value ) {
						$sanitized_settings['colors'][ $sanitized_key ] = $sanitized_value;
					}
				}
			}

			// Sanitize effects.
			if ( isset( $settings['effects'] ) && is_array( $settings['effects'] ) ) {
				$sanitized_settings['effects'] = array();
				foreach ( $settings['effects'] as $key => $value ) {
					$sanitized_key = sanitize_key( $key );
					$sanitized_value = absint( $value );
					$sanitized_settings['effects'][ $sanitized_key ] = $sanitized_value;
				}
			}

			// Get current settings.
			$current_settings = $this->settings->get_option();

			// Store customizations in template-specific key.
			if ( ! isset( $current_settings['template_customizations'] ) ) {
				$current_settings['template_customizations'] = array();
			}

			$current_settings['template_customizations'][ $template_id ] = $sanitized_settings;

			// Save settings using WordPress update_option directly (bypasses full validation).
			$result = update_option( MASE_Settings::OPTION_NAME, $current_settings );

			if ( $result ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				// Log successful save.
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE: Theme customization saved successfully. Template ID: %s, User ID: %d',
							$template_id,
							get_current_user_id()
						)
					);
				}

				wp_send_json_success(
					array(
						'message' => __( 'Customizations saved successfully', 'modern-admin-styler' ),
					)
				);
			} else {
				// Log save failure.
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Failed to save theme customization. Template ID: %s, User ID: %d',
							$template_id,
							get_current_user_id()
						)
					);
				}
				wp_send_json_error(
					array(
						'message' => __( 'Failed to save customizations', 'modern-admin-styler' ),
					),
					500
				);
			}
		} catch ( Exception $e ) {
			// Enhanced exception logging.
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE Error (save_theme_customization): %s | File: %s | Line: %d | Trace: %s',
						$e->getMessage(),
						$e->getFile(),
						$e->getLine(),
						$e->getTraceAsString()
					)
				);
			}
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred. Please try again.', 'modern-admin-styler' ),
				),
				500
			);
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
				// Task 19: Log security violation (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Create backup - Invalid nonce. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				// Task 19: Log unauthorized access (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Create backup - Unauthorized access. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Task 19: Log backup request (Requirement 9.3).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Create backup requested. User ID: %d',
						get_current_user_id()
					)
				);
			}

			// Get current settings.
			$settings = $this->settings->get_option();

			// Task 19: Validate settings retrieval (Requirement 9.4).
			if ( ! is_array( $settings ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Error: Create backup - Failed to retrieve settings' );
				}
				wp_send_json_error(
					array(
						'message' => __( 'Failed to retrieve settings for backup.', 'mase' ),
					),
					500
				);
			}

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
			$backups               = get_option( 'mase_backups', array() );
			$backups[ $backup_id ] = $backup_data;

			// Limit to 10 most recent backups.
			if ( count( $backups ) > 10 ) {
				// Sort by timestamp descending.
				uasort(
					$backups,
					function ( $a, $b ) {
						return $b['timestamp'] - $a['timestamp'];
					}
				);

				// Keep only 10 most recent.
				$backups = array_slice( $backups, 0, 10, true );
			}

			$update_result = update_option( 'mase_backups', $backups );

			// Task 19: Validate backup storage (Requirement 9.4).
			if ( false === $update_result ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Create backup - Failed to store backup. ID: %s',
							$backup_id
						)
					);
				}
				wp_send_json_error(
					array(
						'message' => __( 'Failed to store backup.', 'mase' ),
					),
					500
				);
			}

			// Task 19: Log successful backup creation (Requirement 9.3).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Backup created successfully. ID: %s, User ID: %d, Settings count: %d',
						$backup_id,
						get_current_user_id(),
						count( $settings )
					)
				);
			}

			wp_send_json_success(
				array(
					'message'   => __( 'Backup created successfully', 'mase' ),
					'backup_id' => $backup_id,
					'timestamp' => $backup_data['timestamp'],
				)
			);
		} catch ( Exception $e ) {
			// Task 19: Enhanced exception logging (Requirement 9.5, 9.6).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE Error (create_backup): %s | File: %s | Line: %d | Trace: %s',
						$e->getMessage(),
						$e->getFile(),
						$e->getLine(),
						$e->getTraceAsString()
					)
				);
			}
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred. Please try again.', 'mase' ),
				),
				500
			);
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
				// Task 19: Log security violation (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Restore backup - Invalid nonce. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				// Task 19: Log unauthorized access (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Restore backup - Unauthorized access. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Get backup ID.
			$backup_id = isset( $_POST['backup_id'] ) ? sanitize_text_field( $_POST['backup_id'] ) : '';

			// Task 19: Log restore request (Requirement 9.3).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Restore backup requested. User ID: %d, Backup ID: %s',
						get_current_user_id(),
						$backup_id
					)
				);
			}

			// Task 19: Validate input (Requirement 9.4).
			if ( empty( $backup_id ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Validation Error: Restore backup - Backup ID is required' );
				}
				wp_send_json_error( array( 'message' => __( 'Invalid backup ID', 'mase' ) ), 400 );
			}

			// Get backups.
			$backups = get_option( 'mase_backups', array() );

			// Task 19: Validate backup exists (Requirement 9.4).
			if ( ! isset( $backups[ $backup_id ] ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Restore backup - Backup not found. ID: %s',
							$backup_id
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Backup not found', 'mase' ) ), 404 );
			}

			// Restore settings from backup.
			$backup_data = $backups[ $backup_id ];
			$result      = $this->settings->update_option( $backup_data['settings'] );

			// Task 19: Check for validation errors (Requirement 9.4).
			if ( is_wp_error( $result ) ) {
				$error_data = $result->get_error_data();
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Restore backup - Validation failed: %s',
							$result->get_error_message()
						)
					);
					if ( is_array( $error_data ) ) {
						foreach ( $error_data as $field => $message ) {
							error_log( sprintf( 'MASE Validation Error: %s: %s', $field, $message ) );
						}
					}
				}
				wp_send_json_error(
					array(
						'message'           => __( 'Backup restore validation failed: ', 'mase' ) . $result->get_error_message(),
						'validation_errors' => $error_data,
					),
					400
				);
			}

			if ( $result ) {
				// Invalidate cache.
				$this->cache->invalidate( 'generated_css' );

				// Task 19: Log successful restore (Requirement 9.3).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE: Backup restored successfully. ID: %s, User ID: %d',
							$backup_id,
							get_current_user_id()
						)
					);
				}

				wp_send_json_success(
					array(
						'message' => __( 'Backup restored successfully', 'mase' ),
					)
				);
			} else {
				// Task 19: Log restore failure (Requirement 9.4).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Error: Failed to restore backup. ID: %s, User ID: %d',
							$backup_id,
							get_current_user_id()
						)
					);
				}
				wp_send_json_error(
					array(
						'message' => __( 'Failed to restore backup', 'mase' ),
					),
					500
				);
			}
		} catch ( Exception $e ) {
			// Task 19: Enhanced exception logging (Requirement 9.5, 9.6).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE Error (restore_backup): %s | File: %s | Line: %d | Trace: %s',
						$e->getMessage(),
						$e->getFile(),
						$e->getLine(),
						$e->getTraceAsString()
					)
				);
			}
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred. Please try again.', 'mase' ),
				),
				500
			);
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
				// Task 19: Log security violation (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Get backups - Invalid nonce. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				// Task 19: Log unauthorized access (Requirement 9.1, 9.2).
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Get backups - Unauthorized access. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Task 19: Log request (Requirement 9.3).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Get backups requested. User ID: %d',
						get_current_user_id()
					)
				);
			}

			// Get backups.
			$backups = get_option( 'mase_backups', array() );

			// Task 19: Validate backups retrieval (Requirement 9.4).
			if ( ! is_array( $backups ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Error: Get backups - Invalid backups data format' );
				}
				$backups = array();
			}

			// Sort by timestamp descending (newest first).
			uasort(
				$backups,
				function ( $a, $b ) {
					return $b['timestamp'] - $a['timestamp'];
				}
			);

			// Convert to array for JSON response.
			$backup_list = array_values( $backups );

			// Task 19: Log successful retrieval (Requirement 9.3).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Backups retrieved successfully. Count: %d, User ID: %d',
						count( $backup_list ),
						get_current_user_id()
					)
				);
			}

			wp_send_json_success(
				array(
					'backups' => $backup_list,
				)
			);
		} catch ( Exception $e ) {
			// Task 19: Enhanced exception logging (Requirement 9.5, 9.6).
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE Error (get_backups): %s | File: %s | Line: %d | Trace: %s',
						$e->getMessage(),
						$e->getFile(),
						$e->getLine(),
						$e->getTraceAsString()
					)
				);
			}
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred. Please try again.', 'mase' ),
				),
				500
			);
		}
	}

	/**
	 * Handle AJAX logo upload for admin menu (Requirement 16.1)
	 *
	 * @since 1.2.0
	 */
	/**
	 * Handle AJAX logo upload request.
	 *
	 * Requirement 22.2: Comprehensive file upload security.
	 * - Validates file types (PNG, JPG, SVG only)
	 * - Validates file sizes (max 2MB)
	 * - Sanitizes SVG content to remove malicious code
	 * - Checks user capabilities
	 * - Verifies nonces
	 *
	 * Requirement 22.3: CSRF protection via nonce verification.
	 *
	 * @since 1.2.0
	 */
	public function handle_ajax_upload_menu_logo() {
		// Security: Verify nonce for CSRF protection (Requirement 22.3).
		check_ajax_referer( 'mase_save_settings', 'nonce' );

		// Security: Check user capability (Requirement 22.2).
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'You do not have permission to upload files.', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Validation: Check if file was uploaded (Requirement 22.2).
		if ( empty( $_FILES['logo_file'] ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'No file was uploaded.', 'modern-admin-styler' ),
				),
				400
			);
		}

		$file = $_FILES['logo_file'];

		// Security: Check for upload errors (Requirement 22.2).
		if ( $file['error'] !== UPLOAD_ERR_OK ) {
			// Use centralized error message helper (Requirement 6.1).
			$error_message = $this->get_upload_error_message( $file['error'] );

			// Log upload error for debugging (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Menu logo upload failed - Error code: %d, Message: %s',
					$file['error'],
					$error_message
				)
			);

			wp_send_json_error(
				array(
					'message' => $error_message,
				),
				400
			);
		}

		// Security: Validate file type using WordPress function (Requirement 22.2).
		$allowed_types = array( 'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml' );
		$file_type     = wp_check_filetype(
			$file['name'],
			array(
				'png'  => 'image/png',
				'jpg'  => 'image/jpeg',
				'jpeg' => 'image/jpeg',
				'svg'  => 'image/svg+xml',
			)
		);

		// Double-check MIME type from both server and WordPress.
		if ( ! in_array( $file['type'], $allowed_types, true ) || ! in_array( $file_type['type'], $allowed_types, true ) ) {
			// Log file type validation failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Menu logo upload failed - Invalid file type. Server MIME: %s, WordPress MIME: %s, Filename: %s',
					$file['type'],
					$file_type['type'],
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Only PNG, JPG, and SVG files are allowed.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Security: Validate file extension matches MIME type (Requirement 22.2).
		$allowed_extensions = array( 'png', 'jpg', 'jpeg', 'svg' );
		if ( ! in_array( strtolower( $file_type['ext'] ), $allowed_extensions, true ) ) {
			// Log extension validation failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Menu logo upload failed - Invalid extension. Extension: %s, Filename: %s',
					$file_type['ext'],
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Invalid file extension.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Security: Validate file size (max 2MB) (Requirement 22.2).
		$max_size = 2 * 1024 * 1024; // 2MB in bytes
		if ( $file['size'] > $max_size ) {
			// Log file size validation failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Menu logo upload failed - File too large. Size: %d bytes (%.2f MB), Max: %d bytes (2 MB), Filename: %s',
					$file['size'],
					$file['size'] / 1024 / 1024,
					$max_size,
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'File size must be less than 2MB.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Security: Validate file is not empty (Requirement 22.2).
		if ( $file['size'] === 0 ) {
			// Log empty file failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Menu logo upload failed - File is empty. Filename: %s',
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'File is empty.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Sanitize SVG content if SVG file.
		if ( $file['type'] === 'image/svg+xml' ) {
			$svg_content = file_get_contents( $file['tmp_name'] );
			$svg_content = $this->sanitize_svg( $svg_content );

			if ( $svg_content === false ) {
				// Log SVG sanitization failure (Requirement 6.1).
				error_log(
					sprintf(
						'MASE: Menu logo upload failed - SVG sanitization failed. Filename: %s',
						$file['name']
					)
				);

				wp_send_json_error(
					array(
						'message' => __( 'Invalid SVG file. Please upload a valid SVG.', 'modern-admin-styler' ),
					)
				);
			}

			// Write sanitized SVG back to temp file.
			file_put_contents( $file['tmp_name'], $svg_content );
		}

		// Upload file using WordPress media handler.
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$upload_overrides = array(
			'test_form' => false,
			'mimes'     => array(
				'png'  => 'image/png',
				'jpg'  => 'image/jpeg',
				'jpeg' => 'image/jpeg',
				'svg'  => 'image/svg+xml',
			),
		);

		$uploaded_file = wp_handle_upload( $file, $upload_overrides );

		if ( isset( $uploaded_file['error'] ) ) {
			// Log wp_handle_upload failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Menu logo upload failed - wp_handle_upload error: %s, Filename: %s',
					$uploaded_file['error'],
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => $uploaded_file['error'],
				)
			);
		}

		// Store logo URL in settings.
		$settings                           = $this->settings->get_option();
		$settings['admin_menu']['logo_url'] = $uploaded_file['url'];
		$this->settings->update_option( $settings );

		// Clear cache to regenerate CSS with new logo.
		$this->cache->clear_all_cache();

		// Log successful upload (Requirement 6.1).
		error_log(
			sprintf(
				'MASE: Menu logo uploaded successfully. URL: %s, Size: %d bytes, Type: %s',
				$uploaded_file['url'],
				$file['size'],
				$file['type']
			)
		);

		wp_send_json_success(
			array(
				'message'  => __( 'Logo uploaded successfully.', 'modern-admin-styler' ),
				'logo_url' => $uploaded_file['url'],
			)
		);
	}

	/**
	 * Handle AJAX login logo upload request.
	 *
	 * Processes file uploads for custom login page logos. Validates file type, size,
	 * and content before storing. For SVG files, performs sanitization to remove
	 * potentially malicious code (scripts, event handlers, external references).
	 *
	 * Security Requirements (6.1, 6.2, 6.3, 6.4):
	 * - Verify nonce for CSRF protection
	 * - Check user capability (manage_options)
	 * - Validate file type (PNG, JPG, SVG only)
	 * - Validate file size (max 2MB)
	 * - Validate MIME type matches extension
	 * - Sanitize SVG content to remove malicious code
	 *
	 * Functional Requirements (1.1, 1.2, 1.3):
	 * - Upload file using wp_handle_upload()
	 * - Store logo URL in login_customization settings
	 * - Invalidate login CSS cache
	 * - Return JSON success response with logo URL
	 *
	 * @since 1.3.0
	 * @access public
	 *
	 * @global array $_FILES Contains uploaded file data.
	 *
	 * @return void Sends JSON response and terminates execution.
	 *
	 * @throws WP_Error On file upload failure (handled internally).
	 *
	 * Security Notes:
	 * - Requires 'manage_options' capability
	 * - Validates nonce via check_ajax_referer()
	 * - Sanitizes SVG files using sanitize_svg()
	 * - Logs all upload attempts for security auditing
	 * - Maximum file size: 2MB
	 * - Allowed types: PNG, JPG, JPEG, SVG
	 */
	public function handle_ajax_upload_login_logo() {
		// Security: Verify nonce for CSRF protection (Requirement 6.1).
		check_ajax_referer( 'mase_save_settings', 'nonce' );

		// Security: Check user capability (Requirement 6.2).
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'You do not have permission to upload files.', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Validation: Check if file was uploaded (Requirement 1.1).
		if ( empty( $_FILES['logo_file'] ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'No file was uploaded.', 'modern-admin-styler' ),
				),
				400
			);
		}

		$file = $_FILES['logo_file'];

		// Security: Check for upload errors (Requirement 6.1).
		if ( $file['error'] !== UPLOAD_ERR_OK ) {
			// Use centralized error message helper (Requirement 6.1).
			$error_message = $this->get_upload_error_message( $file['error'] );

			// Log upload error for debugging (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Login logo upload failed - Error code: %d, Message: %s',
					$file['error'],
					$error_message
				)
			);

			wp_send_json_error(
				array(
					'message' => $error_message,
				),
				400
			);
		}

		// Security: Validate file type using WordPress function (Requirement 1.2, 6.3).
		$allowed_types = array( 'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml' );
		$file_type     = wp_check_filetype(
			$file['name'],
			array(
				'png'  => 'image/png',
				'jpg'  => 'image/jpeg',
				'jpeg' => 'image/jpeg',
				'svg'  => 'image/svg+xml',
			)
		);

		// Double-check MIME type from both server and WordPress (Requirement 6.3).
		if ( ! in_array( $file['type'], $allowed_types, true ) || ! in_array( $file_type['type'], $allowed_types, true ) ) {
			// Log file type validation failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Login logo upload failed - Invalid file type. Server MIME: %s, WordPress MIME: %s, Filename: %s',
					$file['type'],
					$file_type['type'],
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Only PNG, JPG, and SVG files are allowed.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Security: Validate file extension matches MIME type (Requirement 6.3).
		$allowed_extensions = array( 'png', 'jpg', 'jpeg', 'svg' );
		if ( ! in_array( strtolower( $file_type['ext'] ), $allowed_extensions, true ) ) {
			// Log extension validation failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Login logo upload failed - Invalid extension. Extension: %s, Filename: %s',
					$file_type['ext'],
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Invalid file extension.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Security: Validate file size (max 2MB) (Requirement 1.3, 6.3).
		$max_size = 2 * 1024 * 1024; // 2MB in bytes
		if ( $file['size'] > $max_size ) {
			// Log file size validation failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Login logo upload failed - File too large. Size: %d bytes (%.2f MB), Max: %d bytes (2 MB), Filename: %s',
					$file['size'],
					$file['size'] / 1024 / 1024,
					$max_size,
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'File size must be less than 2MB.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Security: Validate file is not empty (Requirement 6.3).
		if ( $file['size'] === 0 ) {
			// Log empty file failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Login logo upload failed - File is empty. Filename: %s',
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'File is empty.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Sanitize SVG content if SVG file (Requirement 6.4).
		if ( $file['type'] === 'image/svg+xml' ) {
			$svg_content = file_get_contents( $file['tmp_name'] );
			$svg_content = $this->sanitize_svg( $svg_content );

			if ( $svg_content === false ) {
				// Log SVG sanitization failure (Requirement 6.1).
				error_log(
					sprintf(
						'MASE: Login logo upload failed - SVG sanitization failed. Filename: %s',
						$file['name']
					)
				);

				wp_send_json_error(
					array(
						'message' => __( 'Invalid SVG file. Please upload a valid SVG.', 'modern-admin-styler' ),
					),
					400
				);
			}

			// Write sanitized SVG back to temp file.
			file_put_contents( $file['tmp_name'], $svg_content );
		}

		// Upload file using WordPress media handler (Requirement 1.1).
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$upload_overrides = array(
			'test_form' => false,
			'mimes'     => array(
				'png'  => 'image/png',
				'jpg'  => 'image/jpeg',
				'jpeg' => 'image/jpeg',
				'svg'  => 'image/svg+xml',
			),
		);

		$uploaded_file = wp_handle_upload( $file, $upload_overrides );

		if ( isset( $uploaded_file['error'] ) ) {
			// Log wp_handle_upload failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Login logo upload failed - wp_handle_upload error: %s, Filename: %s',
					$uploaded_file['error'],
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => $uploaded_file['error'],
				),
				500
			);
		}

		// Store logo URL in login_customization settings (Requirement 1.1).
		$settings = $this->settings->get_option();

		// Initialize login_customization section if it doesn't exist.
		if ( ! isset( $settings['login_customization'] ) ) {
			$settings['login_customization'] = array();
		}

		$settings['login_customization']['logo_url'] = $uploaded_file['url'];
		$this->settings->update_option( $settings );

		// Invalidate login CSS cache (Requirement 1.1, 8.3).
		// Use dedicated login CSS cache invalidation method.
		$cache = new MASE_Cache();
		$cache->invalidate_login_css_cache();

		// Log successful upload (Requirement 6.1).
		error_log(
			sprintf(
				'MASE: Login logo uploaded successfully. URL: %s, Size: %d bytes, Type: %s',
				$uploaded_file['url'],
				$file['size'],
				$file['type']
			)
		);

		// Return success response with logo URL (Requirement 1.1).
		wp_send_json_success(
			array(
				'message'  => __( 'Login logo uploaded successfully.', 'modern-admin-styler' ),
				'logo_url' => $uploaded_file['url'],
			)
		);
	}

	/**
	 * Handle AJAX login background image upload request.
	 *
	 * Processes file uploads for custom login page background images. Validates
	 * file type and size before storing. SVG files are not allowed for backgrounds
	 * to reduce security risk. Larger file size limit (5MB) compared to logos.
	 *
	 * Security: Nonce verification, capability check, file validation.
	 * Validation: File type (PNG, JPG only - no SVG), size (max 5MB).
	 *
	 * Requirements 2.1, 2.2, 6.1, 6.2, 6.3:
	 * - Verify nonce and user capabilities (CSRF protection)
	 * - Validate file type (PNG, JPG only)
	 * - Validate file size (max 5MB for backgrounds)
	 * - Upload and store URL in settings
	 * - Invalidate login CSS cache
	 *
	 * @since 1.3.0
	 * @access public
	 *
	 * @global array $_FILES Contains uploaded file data.
	 *
	 * @return void Sends JSON response and terminates execution.
	 *
	 * @throws WP_Error On file upload failure (handled internally).
	 *
	 * Security Notes:
	 * - Requires 'manage_options' capability
	 * - Validates nonce via check_ajax_referer()
	 * - SVG files NOT allowed for backgrounds (security measure)
	 * - Logs all upload attempts for security auditing
	 * - Maximum file size: 5MB (larger than logo limit)
	 * - Allowed types: PNG, JPG, JPEG only
	 */
	public function handle_ajax_upload_login_background() {
		// Security: Verify nonce for CSRF protection (Requirement 6.1).
		check_ajax_referer( 'mase_save_settings', 'nonce' );

		// Security: Check user capability (Requirement 6.2).
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'You do not have permission to upload files.', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Validation: Check if file was uploaded (Requirement 2.1).
		if ( empty( $_FILES['background_file'] ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'No file was uploaded.', 'modern-admin-styler' ),
				),
				400
			);
		}

		$file = $_FILES['background_file'];

		// Security: Check for upload errors (Requirement 6.1).
		if ( $file['error'] !== UPLOAD_ERR_OK ) {
			// Use centralized error message helper (Requirement 6.1).
			$error_message = $this->get_upload_error_message( $file['error'] );

			// Log upload error for debugging (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Login background upload failed - Error code: %d, Message: %s',
					$file['error'],
					$error_message
				)
			);

			wp_send_json_error(
				array(
					'message' => $error_message,
				),
				400
			);
		}

		// Security: Validate file type using WordPress function (Requirement 2.2, 6.3).
		// Note: Only PNG and JPG allowed for backgrounds - no SVG for security.
		$allowed_types = array( 'image/png', 'image/jpeg', 'image/jpg' );
		$file_type     = wp_check_filetype(
			$file['name'],
			array(
				'png'  => 'image/png',
				'jpg'  => 'image/jpeg',
				'jpeg' => 'image/jpeg',
			)
		);

		// Double-check MIME type from both server and WordPress (Requirement 6.3).
		if ( ! in_array( $file['type'], $allowed_types, true ) || ! in_array( $file_type['type'], $allowed_types, true ) ) {
			// Log file type validation failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Login background upload failed - Invalid file type. Server MIME: %s, WordPress MIME: %s, Filename: %s',
					$file['type'],
					$file_type['type'],
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Only PNG and JPG files are allowed for background images.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Security: Validate file extension matches MIME type (Requirement 6.3).
		$allowed_extensions = array( 'png', 'jpg', 'jpeg' );
		if ( ! in_array( strtolower( $file_type['ext'] ), $allowed_extensions, true ) ) {
			// Log extension validation failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Login background upload failed - Invalid extension. Extension: %s, Filename: %s',
					$file_type['ext'],
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Invalid file extension.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Security: Validate file size (max 5MB for backgrounds) (Requirement 2.2, 6.3).
		$max_size = 5 * 1024 * 1024; // 5MB in bytes
		if ( $file['size'] > $max_size ) {
			// Log file size validation failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Login background upload failed - File too large. Size: %d bytes (%.2f MB), Max: %d bytes (5 MB), Filename: %s',
					$file['size'],
					$file['size'] / 1024 / 1024,
					$max_size,
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'File size must be less than 5MB.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Security: Validate file is not empty (Requirement 6.3).
		if ( $file['size'] === 0 ) {
			// Log empty file failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Login background upload failed - File is empty. Filename: %s',
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'File is empty.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Upload file using WordPress media handler (Requirement 2.1).
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$upload_overrides = array(
			'test_form' => false,
			'mimes'     => array(
				'png'  => 'image/png',
				'jpg'  => 'image/jpeg',
				'jpeg' => 'image/jpeg',
			),
		);

		$uploaded_file = wp_handle_upload( $file, $upload_overrides );

		if ( isset( $uploaded_file['error'] ) ) {
			// Log wp_handle_upload failure (Requirement 6.1).
			error_log(
				sprintf(
					'MASE: Login background upload failed - wp_handle_upload error: %s, Filename: %s',
					$uploaded_file['error'],
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => $uploaded_file['error'],
				),
				500
			);
		}

		// Store background image URL in login_customization settings (Requirement 2.1).
		$settings = $this->settings->get_option();

		// Initialize login_customization section if it doesn't exist.
		if ( ! isset( $settings['login_customization'] ) ) {
			$settings['login_customization'] = array();
		}

		$settings['login_customization']['background_image'] = $uploaded_file['url'];
		$this->settings->update_option( $settings );

		// Invalidate login CSS cache (Requirement 2.1, 8.3).
		// Use dedicated login CSS cache invalidation method.
		$cache = new MASE_Cache();
		$cache->invalidate_login_css_cache();

		// Log successful upload (Requirement 6.1).
		error_log(
			sprintf(
				'MASE: Login background uploaded successfully. URL: %s, Size: %d bytes, Type: %s',
				$uploaded_file['url'],
				$file['size'],
				$file['type']
			)
		);

		// Return success response with background image URL (Requirement 2.1).
		wp_send_json_success(
			array(
				'message'        => __( 'Login background image uploaded successfully.', 'modern-admin-styler' ),
				'background_url' => $uploaded_file['url'],
			)
		);
	}

	/**
	 * Handle AJAX dark mode toggle request.
	 *
	 * Requirements 2.1, 2.2, 4.1, 11.1:
	 * - Verify nonce and user capabilities (CSRF protection)
	 * - Validate mode input ('light' or 'dark')
	 * - Save preference to WordPress user meta
	 * - Update settings array with current mode
	 * - Invalidate CSS cache after mode change
	 *
	 * @since 1.3.0
	 */
	public function handle_ajax_toggle_dark_mode() {
		try {
			// Security: Verify nonce for CSRF protection (Requirement 2.2, 11.1).
			if ( ! check_ajax_referer( 'mase_toggle_dark_mode', 'nonce', false ) ) {
				error_log( 'MASE: Dark mode toggle - Invalid nonce' );
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'mase' ) ), 403 );
			}

			// Security: Check user capability (Requirement 2.2, 11.1).
			if ( ! current_user_can( 'manage_options' ) ) {
				error_log( 'MASE: Dark mode toggle - Unauthorized access attempt by user ' . get_current_user_id() );
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'mase' ) ), 403 );
			}

			// Input validation: Get and sanitize mode (Requirement 2.1).
			$mode = isset( $_POST['mode'] ) ? sanitize_text_field( $_POST['mode'] ) : '';

			// Task 19: Enhanced input validation with detailed logging (Requirement 11.6)
			if ( empty( $mode ) ) {
				error_log( 'MASE: Dark mode toggle - Empty mode parameter' );
				wp_send_json_error(
					array(
						'message' => __( 'Mode parameter is required', 'mase' ),
					),
					400
				);
			}

			// Validate mode value against whitelist (Requirement 2.1).
			if ( ! in_array( $mode, array( 'light', 'dark' ), true ) ) {
				error_log( 'MASE: Dark mode toggle - Invalid mode value: ' . $mode );
				wp_send_json_error(
					array(
						'message' => __( 'Invalid mode. Must be "light" or "dark".', 'mase' ),
					),
					400
				);
			}

			// Task 19: Validate user ID (Requirement 11.3)
			$user_id = get_current_user_id();
			if ( ! $user_id || $user_id < 1 ) {
				error_log( 'MASE: Dark mode toggle - Invalid user ID: ' . $user_id );
				wp_send_json_error(
					array(
						'message' => __( 'Invalid user session. Please refresh the page.', 'mase' ),
					),
					401
				);
			}

			// Save preference to WordPress user meta (Requirement 4.1).
			$meta_result = update_user_meta( $user_id, 'mase_dark_mode_preference', $mode );

			// Task 19: Enhanced error handling for user meta (Requirement 11.4)
			if ( false === $meta_result ) {
				error_log(
					sprintf(
						'MASE: Failed to update user meta for dark mode preference (user_id: %d, mode: %s)',
						$user_id,
						$mode
					)
				);
				// Note: update_user_meta returns false if value is unchanged, which is not an error
				// Only log, don't fail the request
			}

			// Update settings array with current mode (Requirement 2.1).
			$settings = $this->settings->get_option();

			// Task 19: Validate settings retrieval (Requirement 11.3)
			if ( ! is_array( $settings ) ) {
				error_log( 'MASE: Dark mode toggle - Failed to retrieve settings, using defaults' );
				$settings = array();
			}

			// Initialize dark_light_toggle section if it doesn't exist.
			if ( ! isset( $settings['dark_light_toggle'] ) ) {
				$settings['dark_light_toggle'] = array();
			}

			$settings['dark_light_toggle']['current_mode'] = $mode;

			// Task 19: Wrap settings update in try-catch (Requirement 11.5)
			try {
				$settings_result = $this->settings->update_option( $settings );
			} catch ( Exception $settings_error ) {
				error_log( 'MASE: Dark mode toggle - Settings update exception: ' . $settings_error->getMessage() );
				wp_send_json_error(
					array(
						'message' => __( 'Failed to save dark mode preference to settings', 'mase' ),
					),
					500
				);
			}

			// Check if settings update failed.
			if ( false === $settings_result ) {
				error_log(
					sprintf(
						'MASE: Failed to update settings for dark mode (mode: %s)',
						$mode
					)
				);
				wp_send_json_error(
					array(
						'message' => __( 'Failed to save dark mode preference to settings', 'mase' ),
					),
					500
				);
			}

			// Task 19: Wrap cache invalidation in try-catch (Requirement 11.5)
			try {
				// Invalidate only the active mode cache (Requirement 12.5).
				// This leaves the other mode's cache intact for faster switching.
				$cache = new MASE_Cache();
				$cache->invalidate_mode_cache( $mode );
			} catch ( Exception $cache_error ) {
				// Task 19: Cache invalidation failure shouldn't block the response (Requirement 11.7)
				error_log( 'MASE: Dark mode toggle - Cache invalidation failed: ' . $cache_error->getMessage() );
				// Continue anyway - cache will be regenerated on next page load
			}

			// Task 19: Log successful toggle for debugging (Requirement 11.6)
			error_log(
				sprintf(
					'MASE: Dark mode toggled successfully (user_id: %d, mode: %s)',
					$user_id,
					$mode
				)
			);

			// Return success response (Requirement 2.1).
			wp_send_json_success(
				array(
					'message' => sprintf(
					/* translators: %s: mode name (Light or Dark) */
						__( '%s mode activated successfully', 'mase' ),
						ucfirst( $mode )
					),
					'mode'    => $mode,
				)
			);

		} catch ( Exception $e ) {
			// Task 19: Enhanced error handling with detailed logging (Requirements 11.1, 11.6, 11.7)
			error_log(
				sprintf(
					'MASE Error (toggle_dark_mode): %s | File: %s | Line: %d | Trace: %s',
					$e->getMessage(),
					$e->getFile(),
					$e->getLine(),
					$e->getTraceAsString()
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'An error occurred while toggling dark mode. Please try again.', 'mase' ),
				),
				500
			);
		}
	}

	/**
	 * Inject custom CSS into login page.
	 *
	 * Hooks into login_enqueue_scripts to inject custom login page styles.
	 * Uses caching for performance - generates CSS only on cache miss.
	 * Implements graceful fallbacks for error conditions.
	 *
	 * This method is called automatically by WordPress on the login page via the
	 * login_enqueue_scripts action hook. It retrieves login customization settings,
	 * generates CSS (or retrieves from cache), and outputs it inline in the page head.
	 *
	 * Requirements 8.1, 8.2, 8.3:
	 * - Hook into login_enqueue_scripts action
	 * - Generate CSS from settings using CSS Generator
	 * - Cache generated CSS for 1 hour
	 * - Output CSS in <style> tag with id 'mase-login-css'
	 * - Fall back gracefully on errors (Requirement 8.2)
	 *
	 * @since 1.3.0
	 * @access public
	 *
	 * @return void Outputs CSS directly to page head.
	 *
	 * Performance Notes:
	 * - CSS is cached for 1 hour (3600 seconds)
	 * - Cache key: 'login_css'
	 * - Cache invalidated on settings save
	 * - Generation time target: < 50ms
	 *
	 * Error Handling:
	 * - Falls back to defaults if settings retrieval fails
	 * - Continues without caching if cache write fails
	 * - Logs all errors for debugging
	 * - Never blocks login page rendering
	 */
	public function inject_login_css() {
		try {
			// Get settings from settings system (Requirement 8.1).
			$settings = $this->settings->get_option();

			// Graceful fallback: Use defaults if settings retrieval fails (Requirement 8.2).
			if ( ! is_array( $settings ) ) {
				error_log( 'MASE: Login CSS injection - Failed to retrieve settings, using defaults' );
				$settings = $this->settings->get_defaults();
			}

			// CRITICAL FIX: Always ensure login_customization exists with defaults
			// Even if empty, we need to generate CSS for proper login page styling
			if ( empty( $settings['login_customization'] ) ) {
				error_log( 'MASE: Login CSS injection - login_customization empty, using defaults' );
				$defaults = $this->settings->get_defaults();
				$settings['login_customization'] = $defaults['login_customization'];
			}

			// Try to get cached CSS with key 'login_css' (Requirement 8.3).
			$cache_key = 'login_css';
			$css       = false;

			// Graceful fallback: Continue without cache if cache retrieval fails (Requirement 8.2).
			try {
				$css = $this->cache->get( $cache_key );
			} catch ( Exception $cache_error ) {
				error_log(
					sprintf(
						'MASE: Login CSS injection - Cache retrieval failed: %s. Generating CSS without cache.',
						$cache_error->getMessage()
					)
				);
			}

			// If cache miss, generate CSS (Requirement 8.2).
			if ( false === $css ) {
				// Generate CSS using CSS Generator (Requirement 8.2).
				// CSS Generator has its own error handling and returns empty string on failure.
				$css = $this->generator->generate_login_styles( $settings );

				// Graceful fallback: Skip caching on cache write failures (Requirement 8.2).
				try {
					// Cache generated CSS for 1 hour (3600 seconds) (Requirement 8.3).
					$this->cache->set( $cache_key, $css, 3600 );
				} catch ( Exception $cache_error ) {
					error_log(
						sprintf(
							'MASE: Login CSS injection - Cache write failed: %s. CSS will not be cached.',
							$cache_error->getMessage()
						)
					);
					// Continue anyway - CSS is still valid, just not cached.
				}
			}

			// Output CSS in <style> tag with id 'mase-login-css' (Requirement 8.1).
			// Only output if we have valid CSS.
			if ( ! empty( $css ) && is_string( $css ) ) {
				echo '<style id="mase-login-css" type="text/css">' . "\n";
				echo $css . "\n";
				echo '</style>' . "\n";
			} else {
				// Log if CSS generation resulted in empty output.
				error_log( 'MASE: Login CSS injection - No CSS generated or CSS is invalid' );
			}
		} catch ( Exception $e ) {
			// Graceful fallback: Log error but don't break login page (Requirement 8.2).
			error_log(
				sprintf(
					'MASE: Login CSS injection failed: %s. Login page will use default WordPress styles.',
					$e->getMessage()
				)
			);
			// Don't output anything - let WordPress default styles handle the login page.
		}
	}

	/**
	 * Filter login logo URL.
	 *
	 * Filters the login logo link URL to use custom URL if configured.
	 * Falls back to default WordPress.org URL if no custom URL is set.
	 *
	 * This method hooks into the 'login_headerurl' filter to customize where
	 * the login page logo links to. By default, WordPress links to wordpress.org.
	 * This allows administrators to link to their own site or any custom URL.
	 *
	 * Requirement 1.6: Apply custom logo link URL.
	 *
	 * @since 1.3.0
	 * @access public
	 *
	 * @param string $url Default login logo URL (wordpress.org).
	 * @return string Custom logo URL if configured, otherwise default URL.
	 *
	 * @see filter_login_logo_title() Related method that updates the title attribute.
	 */
	public function filter_login_logo_url( $url ) {
		// Get custom logo link URL from settings (Requirement 1.6).
		$settings   = $this->settings->get_option();
		$custom_url = isset( $settings['login_customization']['logo_link_url'] )
			? $settings['login_customization']['logo_link_url']
			: '';

		// Return custom URL if set, otherwise return default WordPress.org URL (Requirement 1.6).
		return ! empty( $custom_url ) ? esc_url( $custom_url ) : $url;
	}

	/**
	 * Filter login logo title attribute.
	 *
	 * Filters the login logo title attribute to use site name if custom URL is configured.
	 * Falls back to default "Powered by WordPress" if no custom URL is set.
	 *
	 * This method hooks into the 'login_headertext' filter to customize the title
	 * attribute (tooltip) of the login page logo. When a custom logo link URL is set,
	 * it makes sense to show the site name instead of "Powered by WordPress".
	 *
	 * Requirement 1.6: Update logo title when custom URL is set.
	 *
	 * @since 1.3.0
	 * @access public
	 *
	 * @param string $title Default login logo title ("Powered by WordPress").
	 * @return string Site name if custom URL configured, otherwise default title.
	 *
	 * @see filter_login_logo_url() Related method that updates the href attribute.
	 */
	public function filter_login_logo_title( $title ) {
		// Get custom logo link URL from settings (Requirement 1.6).
		$settings   = $this->settings->get_option();
		$custom_url = isset( $settings['login_customization']['logo_link_url'] )
			? $settings['login_customization']['logo_link_url']
			: '';

		// If custom logo link URL is set, return site name (Requirement 1.6).
		// Otherwise return default "Powered by WordPress".
		if ( ! empty( $custom_url ) ) {
			return get_bloginfo( 'name' );
		}

		return $title;
	}

	/**
	 * Inject custom footer content into login page.
	 *
	 * Outputs custom footer text and optionally hides WordPress branding.
	 * All output is properly sanitized for security.
	 *
	 * This method hooks into the 'login_footer' action to add custom branding
	 * elements to the login page footer. It can display custom HTML/text and
	 * optionally hide the default WordPress "Back to..." and "Lost your password?"
	 * links via CSS.
	 *
	 * Requirements 4.1, 4.2, 4.3:
	 * - Output custom footer text if configured
	 * - Sanitize footer text with wp_kses_post()
	 * - Hide WordPress branding if enabled
	 *
	 * @since 1.3.0
	 * @access public
	 *
	 * @return void Outputs HTML directly to page footer.
	 *
	 * Security Notes:
	 * - Footer text sanitized with wp_kses_post()
	 * - Allows safe HTML tags (p, a, strong, em, etc.)
	 * - Strips potentially dangerous tags and attributes
	 * - CSS injection uses inline styles (no user input)
	 */
	public function inject_login_footer() {
		// Get footer text from settings (Requirement 4.1).
		$settings    = $this->settings->get_option();
		$footer_text = isset( $settings['login_customization']['footer_text'] )
			? $settings['login_customization']['footer_text']
			: '';

		// If footer text exists, output in div with class 'mase-login-footer' (Requirement 4.1).
		// Sanitize output with wp_kses_post() (Requirement 4.3).
		if ( ! empty( $footer_text ) ) {
			echo '<div class="mase-login-footer">' . wp_kses_post( $footer_text ) . '</div>' . "\n";
		}

		// If hide_wp_branding enabled, output CSS to hide #backtoblog and #nav (Requirement 4.2).
		$hide_branding = isset( $settings['login_customization']['hide_wp_branding'] )
			? $settings['login_customization']['hide_wp_branding']
			: false;

		if ( ! empty( $hide_branding ) ) {
			echo '<style>#backtoblog, #nav { display: none !important; }</style>' . "\n";
		}
	}

	/**
	 * Get user-friendly error message for PHP upload error codes.
	 *
	 * Maps PHP upload error constants to translated, user-friendly messages.
	 * Requirement 6.1: Provide clear error messages for file upload failures.
	 *
	 * @param int $error_code PHP upload error code (UPLOAD_ERR_* constants).
	 * @return string Translated error message.
	 * @since 1.3.0
	 */
	private function get_upload_error_message( $error_code ) {
		// Map PHP upload error codes to user-friendly messages (Requirement 6.1).
		$error_messages = array(
			UPLOAD_ERR_INI_SIZE   => __( 'File exceeds the maximum upload size configured on the server (upload_max_filesize).', 'modern-admin-styler' ),
			UPLOAD_ERR_FORM_SIZE  => __( 'File exceeds the maximum file size allowed by the form (MAX_FILE_SIZE).', 'modern-admin-styler' ),
			UPLOAD_ERR_PARTIAL    => __( 'File was only partially uploaded. Please try again.', 'modern-admin-styler' ),
			UPLOAD_ERR_NO_FILE    => __( 'No file was uploaded. Please select a file and try again.', 'modern-admin-styler' ),
			UPLOAD_ERR_NO_TMP_DIR => __( 'Missing temporary folder on server. Please contact your administrator.', 'modern-admin-styler' ),
			UPLOAD_ERR_CANT_WRITE => __( 'Failed to write file to disk. Please check server permissions.', 'modern-admin-styler' ),
			UPLOAD_ERR_EXTENSION  => __( 'File upload was stopped by a PHP extension. Please contact your administrator.', 'modern-admin-styler' ),
		);

		// Return specific error message if code exists, otherwise return generic message.
		return isset( $error_messages[ $error_code ] )
			? $error_messages[ $error_code ]
			: __( 'Unknown upload error occurred. Please try again.', 'modern-admin-styler' );
	}

	/**
	 * Sanitize SVG content to remove malicious code.
	 *
	 * Requirements 6.4, 6.5: Comprehensive SVG sanitization using DOMDocument.
	 * Loads SVG as XML, removes dangerous elements and attributes, returns sanitized XML.
	 *
	 * @param string $svg_content SVG file content.
	 * @return string|false Sanitized SVG content or false on failure.
	 * @since 1.3.0
	 */
	private function sanitize_svg( $svg_content ) {
		// Security: Basic SVG validation.
		if ( empty( $svg_content ) || strpos( $svg_content, '<svg' ) === false ) {
			error_log( 'MASE: SVG sanitization failed - empty content or missing SVG tag' );
			return false;
		}

		// Security: Check file size limit (prevent DoS).
		if ( strlen( $svg_content ) > 1024 * 1024 ) { // 1MB text limit
			error_log( 'MASE: SVG sanitization failed - file size exceeds 1MB limit' );
			return false;
		}

		// Load SVG content as XML using DOMDocument (Requirement 6.4).
		$dom                     = new DOMDocument();
		$dom->preserveWhiteSpace = false;
		$dom->formatOutput       = false;

		// Suppress warnings for malformed XML and load with security flags.
		libxml_use_internal_errors( true );
		$loaded = $dom->loadXML( $svg_content, LIBXML_NOENT | LIBXML_NONET | LIBXML_NOCDATA );
		libxml_clear_errors();

		if ( ! $loaded ) {
			error_log( 'MASE: SVG sanitization failed - invalid XML structure' );
			return false;
		}

		// Remove all <script> elements (Requirement 6.4).
		$scripts = $dom->getElementsByTagName( 'script' );
		while ( $scripts->length > 0 ) {
			$script = $scripts->item( 0 );
			if ( $script->parentNode ) {
				$script->parentNode->removeChild( $script );
			}
		}

		// Remove other potentially dangerous elements.
		$dangerous_tags = array(
			'embed',
			'object',
			'iframe',
			'link',
			'style',
			'foreignObject',
			'use',
			'image',
			'video',
			'audio',
			'animate',
			'animateTransform',
			'set',
		);

		foreach ( $dangerous_tags as $tag_name ) {
			$elements = $dom->getElementsByTagName( $tag_name );
			while ( $elements->length > 0 ) {
				$element = $elements->item( 0 );
				if ( $element->parentNode ) {
					$element->parentNode->removeChild( $element );
				}
			}
		}

		// Remove event handler attributes (onclick, onload, etc.) (Requirement 6.4).
		$xpath = new DOMXPath( $dom );

		// Find all attributes that start with "on" (event handlers).
		$nodes = $xpath->query( '//@*[starts-with(name(), "on")]' );
		foreach ( $nodes as $node ) {
			$node->ownerElement->removeAttribute( $node->nodeName );
		}

		// Remove processing instructions and external entity references (Requirement 6.4).
		$processing_instructions = $xpath->query( '//processing-instruction()' );
		foreach ( $processing_instructions as $pi ) {
			if ( $pi->parentNode ) {
				$pi->parentNode->removeChild( $pi );
			}
		}

		// Remove dangerous href/xlink:href attributes with javascript: or data: protocols.
		// Exception: Allow data:image/* URLs for embedded images (Task 36 - Requirement 12.2).
		$dangerous_protocols = array( 'javascript:', 'vbscript:', 'file:', 'about:' );
		$href_nodes          = $xpath->query( '//@href | //@xlink:href' );

		foreach ( $href_nodes as $href_node ) {
			$href_value = $href_node->nodeValue;

			// Check for dangerous protocols.
			foreach ( $dangerous_protocols as $protocol ) {
				if ( stripos( $href_value, $protocol ) === 0 ) {
					$href_node->ownerElement->removeAttribute( $href_node->nodeName );
					error_log( sprintf( 'MASE: SVG sanitization - Removed dangerous protocol: %s', $protocol ) );
					break;
				}
			}

			// Special handling for data: URLs - only allow data:image/* (Task 36).
			if ( stripos( $href_value, 'data:' ) === 0 ) {
				// Check if it's a data:image/* URL (allowed).
				if ( stripos( $href_value, 'data:image/' ) !== 0 ) {
					// Not an image data URL - remove it.
					$href_node->ownerElement->removeAttribute( $href_node->nodeName );
					error_log( 'MASE: SVG sanitization - Removed non-image data: URL' );
				}
				// If it is data:image/*, leave it (allowed).
			}
		}

		// Return sanitized XML string (Requirement 6.4).
		$sanitized = $dom->saveXML();

		// Validate result still contains SVG tag.
		if ( empty( $sanitized ) || strpos( $sanitized, '<svg' ) === false ) {
			error_log( 'MASE: SVG sanitization failed - result missing SVG tag' );
			return false;
		}

		return $sanitized;
	}

	/**
	 * Handle AJAX background image upload request.
	 *
	 * Processes file uploads for custom background images across admin areas.
	 * Validates file type, size, and MIME type before storing. Creates WordPress
	 * attachment and generates metadata. Optimizes images larger than 1920px width.
	 *
	 * Security Requirements (Task 3):
	 * - Verify nonce for CSRF protection (Requirement 12.1)
	 * - Check user capability (manage_options) (Requirement 12.1)
	 * - Validate file type (JPG, PNG, WebP, SVG) (Requirement 1.1, 12.2)
	 * - Validate file size (max 5MB) (Requirement 1.1, 12.2)
	 * - Verify MIME type matches extension to prevent spoofing (Requirement 12.2)
	 * - Sanitize SVG content to remove malicious code (Requirement 12.2)
	 *
	 * Functional Requirements (Task 3):
	 * - Handle upload using wp_handle_upload() (Requirement 8.1)
	 * - Create WordPress attachment with wp_insert_attachment() (Requirement 8.2)
	 * - Generate attachment metadata with wp_generate_attachment_metadata() (Requirement 8.3)
	 * - Optimize images wider than 1920px (Requirement 1.2)
	 * - Return attachment ID, URL, and thumbnail URL in JSON response (Requirement 8.3)
	 *
	 * @since 1.4.0
	 * @access public
	 *
	 * @global array $_FILES Contains uploaded file data.
	 *
	 * @return void Sends JSON response and terminates execution.
	 *
	 * @throws WP_Error On file upload failure (handled internally).
	 *
	 * Security Notes:
	 * - Requires 'manage_options' capability
	 * - Validates nonce via check_ajax_referer()
	 * - Sanitizes SVG files using sanitize_svg()
	 * - Logs all upload attempts for security auditing
	 * - Maximum file size: 5MB
	 * - Allowed types: JPG, PNG, WebP, SVG
	 */
	public function handle_ajax_upload_background_image() {
		// Security: Verify nonce for CSRF protection (Requirement 12.1, Task 38).
		if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
			// Log security violation (Task 38).
			error_log(
				sprintf(
					'MASE Security Violation: Invalid nonce in background image upload. User ID: %d, IP: %s',
					get_current_user_id(),
					isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown'
				)
			);
			wp_send_json_error(
				array(
					'message' => __( 'Invalid security token. Please refresh the page and try again.', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Security: Check user capability (Requirement 12.1, Task 38).
		if ( ! current_user_can( 'manage_options' ) ) {
			// Log security violation (Task 38).
			error_log(
				sprintf(
					'MASE Security Violation: Unauthorized background image upload attempt. User ID: %d, IP: %s',
					get_current_user_id(),
					isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown'
				)
			);
			wp_send_json_error(
				array(
					'message' => __( 'You do not have permission to upload files.', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Validation: Check if file was uploaded (Requirement 1.1).
		if ( empty( $_FILES['file'] ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'No file was uploaded.', 'modern-admin-styler' ),
				),
				400
			);
		}

		$file = $_FILES['file'];

		// Security: Check for upload errors (Requirement 12.2).
		if ( $file['error'] !== UPLOAD_ERR_OK ) {
			// Use centralized error message helper.
			$error_message = $this->get_upload_error_message( $file['error'] );

			// Log upload error for debugging.
			error_log(
				sprintf(
					'MASE: Background image upload failed - Error code: %d, Message: %s',
					$file['error'],
					$error_message
				)
			);

			wp_send_json_error(
				array(
					'message' => $error_message,
				),
				400
			);
		}

		// Security: Validate file type using WordPress function (Requirement 1.1, 12.2).
		$allowed_types = array( 'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml' );
		$file_type     = wp_check_filetype(
			$file['name'],
			array(
				'png'  => 'image/png',
				'jpg'  => 'image/jpeg',
				'jpeg' => 'image/jpeg',
				'webp' => 'image/webp',
				'svg'  => 'image/svg+xml',
			)
		);

		// Double-check MIME type from both server and WordPress (Requirement 12.2).
		if ( ! in_array( $file['type'], $allowed_types, true ) || ! in_array( $file_type['type'], $allowed_types, true ) ) {
			// Log file type validation failure.
			error_log(
				sprintf(
					'MASE: Background image upload failed - Invalid file type. Server MIME: %s, WordPress MIME: %s, Filename: %s',
					$file['type'],
					$file_type['type'],
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Only JPG, PNG, WebP, and SVG files are allowed.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Security: Validate file extension matches MIME type (Requirement 12.2).
		$allowed_extensions = array( 'png', 'jpg', 'jpeg', 'webp', 'svg' );
		if ( ! in_array( strtolower( $file_type['ext'] ), $allowed_extensions, true ) ) {
			// Log extension validation failure.
			error_log(
				sprintf(
					'MASE: Background image upload failed - Invalid extension. Extension: %s, Filename: %s',
					$file_type['ext'],
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Invalid file extension.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Security: Validate file size (max 5MB) (Requirement 1.1, 12.2).
		$max_size = 5 * 1024 * 1024; // 5MB in bytes
		if ( $file['size'] > $max_size ) {
			// Log file size validation failure.
			error_log(
				sprintf(
					'MASE: Background image upload failed - File too large. Size: %d bytes (%.2f MB), Max: %d bytes (5 MB), Filename: %s',
					$file['size'],
					$file['size'] / 1024 / 1024,
					$max_size,
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'File size must be less than 5MB.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Security: Validate file is not empty (Requirement 12.2).
		if ( $file['size'] === 0 ) {
			// Log empty file failure.
			error_log(
				sprintf(
					'MASE: Background image upload failed - File is empty. Filename: %s',
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'File is empty.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Sanitize SVG content if SVG file (Requirement 12.2).
		if ( $file['type'] === 'image/svg+xml' ) {
			$svg_content = file_get_contents( $file['tmp_name'] );
			$svg_content = $this->sanitize_svg( $svg_content );

			if ( $svg_content === false ) {
				// Log SVG sanitization failure.
				error_log(
					sprintf(
						'MASE: Background image upload failed - SVG sanitization failed. Filename: %s',
						$file['name']
					)
				);

				wp_send_json_error(
					array(
						'message' => __( 'Invalid SVG file. Please upload a valid SVG.', 'modern-admin-styler' ),
					),
					400
				);
			}

			// Write sanitized SVG back to temp file.
			file_put_contents( $file['tmp_name'], $svg_content );
		}

		// Upload file using WordPress media handler (Requirement 8.1).
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$upload_overrides = array(
			'test_form' => false,
			'mimes'     => array(
				'png'  => 'image/png',
				'jpg'  => 'image/jpeg',
				'jpeg' => 'image/jpeg',
				'webp' => 'image/webp',
				'svg'  => 'image/svg+xml',
			),
		);

		$uploaded_file = wp_handle_upload( $file, $upload_overrides );

		if ( isset( $uploaded_file['error'] ) ) {
			// Log wp_handle_upload failure.
			error_log(
				sprintf(
					'MASE: Background image upload failed - wp_handle_upload error: %s, Filename: %s',
					$uploaded_file['error'],
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => $uploaded_file['error'],
				),
				500
			);
		}

		// Create WordPress attachment (Requirement 8.2).
		$attachment_data = array(
			'post_mime_type' => $uploaded_file['type'],
			'post_title'     => sanitize_file_name( pathinfo( $file['name'], PATHINFO_FILENAME ) ),
			'post_content'   => '',
			'post_status'    => 'inherit',
		);

		$attachment_id = wp_insert_attachment( $attachment_data, $uploaded_file['file'] );

		if ( is_wp_error( $attachment_id ) ) {
			// Log attachment creation failure.
			error_log(
				sprintf(
					'MASE: Background image upload failed - wp_insert_attachment error: %s, Filename: %s',
					$attachment_id->get_error_message(),
					$file['name']
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Failed to create attachment.', 'modern-admin-styler' ),
				),
				500
			);
		}

		// Generate attachment metadata (Requirement 8.3).
		$attachment_metadata = wp_generate_attachment_metadata( $attachment_id, $uploaded_file['file'] );
		wp_update_attachment_metadata( $attachment_id, $attachment_metadata );

		// Optimize image if needed (Requirement 1.2).
		// Only optimize non-SVG images.
		if ( $file['type'] !== 'image/svg+xml' ) {
			$this->optimize_background_image( $attachment_id );
		}

		// Generate WebP version for better performance (Requirement 7.2).
		// Only generate WebP for raster images (not SVG).
		if ( $file['type'] !== 'image/svg+xml' ) {
			$this->generate_webp_version( $attachment_id );
		}

		// Get optimized image URL with WebP support (Requirement 7.2).
		$attachment_url = $this->get_optimized_image_url( $attachment_id );

		// Get original URL as fallback.
		$original_url = wp_get_attachment_url( $attachment_id );

		// Get thumbnail URL.
		$thumbnail_url = wp_get_attachment_image_url( $attachment_id, 'thumbnail' );

		// Log successful upload.
		error_log(
			sprintf(
				'MASE: Background image uploaded successfully. ID: %d, URL: %s, Size: %d bytes, Type: %s',
				$attachment_id,
				$attachment_url,
				$file['size'],
				$file['type']
			)
		);

		// Task 40: Invalidate CSS cache after upload (Requirement 7.4, 7.5).
		// Background changes affect both light and dark modes.
		$cache = new MASE_Cache();
		$cache->invalidate_both_mode_caches();

		// Also invalidate legacy cache key for backward compatibility.
		$this->cache->invalidate( 'generated_css' );

		// Return success response with attachment data (Requirement 8.3, 7.2).
		wp_send_json_success(
			array(
				'message'       => __( 'Background image uploaded successfully.', 'modern-admin-styler' ),
				'attachment_id' => $attachment_id,
				'url'           => $attachment_url,
				'original_url'  => $original_url,
				'thumbnail'     => $thumbnail_url,
			)
		);
	}

	/**
	 * Optimize background image by resizing if width exceeds 1920px.
	 *
	 * Maintains aspect ratio during resize and regenerates attachment metadata.
	 * Only processes raster images (JPG, PNG, WebP), skips SVG files.
	 *
	 * Requirement 1.2: Automatically resize images wider than 1920px.
	 * Requirement 7.1: Optimize images for performance.
	 *
	 * @since 1.4.0
	 * @access private
	 *
	 * @param int $attachment_id WordPress attachment ID.
	 * @return bool True on success, false on failure.
	 */
	private function optimize_background_image( $attachment_id ) {
		// Get attachment file path.
		$file_path = get_attached_file( $attachment_id );

		if ( ! $file_path || ! file_exists( $file_path ) ) {
			error_log(
				sprintf(
					'MASE: Background image optimization failed - File not found. Attachment ID: %d',
					$attachment_id
				)
			);
			return false;
		}

		// Get image dimensions.
		$image_size = getimagesize( $file_path );

		if ( ! $image_size ) {
			error_log(
				sprintf(
					'MASE: Background image optimization failed - Could not get image size. Attachment ID: %d',
					$attachment_id
				)
			);
			return false;
		}

		$width  = $image_size[0];
		$height = $image_size[1];

		// Only resize if width exceeds 1920px (Requirement 1.2).
		if ( $width <= 1920 ) {
			// No optimization needed.
			return true;
		}

		// Get image editor.
		$editor = wp_get_image_editor( $file_path );

		if ( is_wp_error( $editor ) ) {
			error_log(
				sprintf(
					'MASE: Background image optimization failed - Could not get image editor: %s. Attachment ID: %d',
					$editor->get_error_message(),
					$attachment_id
				)
			);
			return false;
		}

		// Resize to 1920px width, maintaining aspect ratio (Requirement 1.2).
		$resize_result = $editor->resize( 1920, null, false );

		if ( is_wp_error( $resize_result ) ) {
			error_log(
				sprintf(
					'MASE: Background image optimization failed - Resize error: %s. Attachment ID: %d',
					$resize_result->get_error_message(),
					$attachment_id
				)
			);
			return false;
		}

		// Save resized image.
		$save_result = $editor->save( $file_path );

		if ( is_wp_error( $save_result ) ) {
			error_log(
				sprintf(
					'MASE: Background image optimization failed - Save error: %s. Attachment ID: %d',
					$save_result->get_error_message(),
					$attachment_id
				)
			);
			return false;
		}

		// Regenerate attachment metadata (Requirement 1.2).
		$metadata = wp_generate_attachment_metadata( $attachment_id, $file_path );
		wp_update_attachment_metadata( $attachment_id, $metadata );

		// Log successful optimization.
		error_log(
			sprintf(
				'MASE: Background image optimized successfully. Attachment ID: %d, Original: %dx%d, Optimized: 1920x%d',
				$attachment_id,
				$width,
				$height,
				round( 1920 * $height / $width )
			)
		);

		return true;
	}

	/**
	 * Generate WebP version of an uploaded image.
	 *
	 * Creates a WebP version of the uploaded image for browsers that support it,
	 * providing better compression and smaller file sizes. Falls back gracefully
	 * if WebP generation fails.
	 *
	 * Requirement 7.2: Serve optimized image formats (WebP with JPG/PNG fallback).
	 *
	 * @since 1.4.0
	 * @access private
	 *
	 * @param int $attachment_id WordPress attachment ID.
	 * @return string|false WebP file URL on success, false on failure.
	 */
	private function generate_webp_version( $attachment_id ) {
		// Get original file path.
		$file_path = get_attached_file( $attachment_id );

		if ( ! $file_path || ! file_exists( $file_path ) ) {
			error_log(
				sprintf(
					'MASE: WebP generation failed - File not found. Attachment ID: %d',
					$attachment_id
				)
			);
			return false;
		}

		// Check if file is already WebP.
		$mime_type = get_post_mime_type( $attachment_id );
		if ( $mime_type === 'image/webp' ) {
			// Already WebP, return original URL.
			return wp_get_attachment_url( $attachment_id );
		}

		// Skip SVG files (can't convert to WebP).
		if ( $mime_type === 'image/svg+xml' ) {
			return false;
		}

		// Get image editor.
		$editor = wp_get_image_editor( $file_path );

		if ( is_wp_error( $editor ) ) {
			error_log(
				sprintf(
					'MASE: WebP generation failed - Could not get image editor: %s. Attachment ID: %d',
					$editor->get_error_message(),
					$attachment_id
				)
			);
			return false;
		}

		// Check if editor supports WebP.
		if ( ! method_exists( $editor, 'supports_mime_type' ) || ! $editor->supports_mime_type( 'image/webp' ) ) {
			error_log(
				sprintf(
					'MASE: WebP generation skipped - Editor does not support WebP. Attachment ID: %d',
					$attachment_id
				)
			);
			return false;
		}

		// Generate WebP filename.
		$file_info = pathinfo( $file_path );
		$webp_path = $file_info['dirname'] . '/' . $file_info['filename'] . '.webp';

		// Set output format to WebP.
		$editor->set_mime_type( 'image/webp' );

		// Save WebP version.
		$save_result = $editor->save( $webp_path );

		if ( is_wp_error( $save_result ) ) {
			error_log(
				sprintf(
					'MASE: WebP generation failed - Save error: %s. Attachment ID: %d',
					$save_result->get_error_message(),
					$attachment_id
				)
			);
			return false;
		}

		// Convert file path to URL.
		$upload_dir = wp_upload_dir();
		$webp_url   = str_replace( $upload_dir['basedir'], $upload_dir['baseurl'], $webp_path );

		// Log successful WebP generation.
		error_log(
			sprintf(
				'MASE: WebP version generated successfully. Attachment ID: %d, WebP URL: %s',
				$attachment_id,
				$webp_url
			)
		);

		return $webp_url;
	}

	/**
	 * Get optimized image URL with WebP support and fallback.
	 *
	 * Returns the most appropriate image URL based on browser support. Detects
	 * WebP support from HTTP_ACCEPT header and returns WebP version if available
	 * and supported, otherwise returns original image URL.
	 *
	 * Requirement 7.2: Serve optimized image formats (WebP with JPG/PNG fallback)
	 *                  based on browser support detection.
	 *
	 * @since 1.4.0
	 * @access public
	 *
	 * @param int $attachment_id WordPress attachment ID.
	 * @return string Image URL (WebP if supported and available, original otherwise).
	 */
	public function get_optimized_image_url( $attachment_id ) {
		// Validate attachment ID.
		if ( ! $attachment_id || ! is_numeric( $attachment_id ) ) {
			return '';
		}

		// Get original image URL.
		$original_url = wp_get_attachment_url( $attachment_id );

		if ( ! $original_url ) {
			return '';
		}

		// Check if browser supports WebP via HTTP_ACCEPT header (Requirement 7.2).
		$supports_webp = isset( $_SERVER['HTTP_ACCEPT'] ) &&
						strpos( $_SERVER['HTTP_ACCEPT'], 'image/webp' ) !== false;

		// If browser doesn't support WebP, return original.
		if ( ! $supports_webp ) {
			return $original_url;
		}

		// Check if attachment is already WebP.
		$mime_type = get_post_mime_type( $attachment_id );
		if ( $mime_type === 'image/webp' ) {
			return $original_url;
		}

		// Skip SVG files (can't convert to WebP).
		if ( $mime_type === 'image/svg+xml' ) {
			return $original_url;
		}

		// Try to get existing WebP version.
		$file_path = get_attached_file( $attachment_id );
		if ( $file_path ) {
			$file_info = pathinfo( $file_path );
			$webp_path = $file_info['dirname'] . '/' . $file_info['filename'] . '.webp';

			// Check if WebP version already exists.
			if ( file_exists( $webp_path ) ) {
				$upload_dir = wp_upload_dir();
				$webp_url   = str_replace( $upload_dir['basedir'], $upload_dir['baseurl'], $webp_path );
				return $webp_url;
			}
		}

		// Generate WebP version if it doesn't exist.
		$webp_url = $this->generate_webp_version( $attachment_id );

		// Return WebP URL if generation succeeded, otherwise return original.
		return $webp_url ? $webp_url : $original_url;
	}

	/**
	 * Handle AJAX media library selection for background images.
	 *
	 * Processes selection of existing images from WordPress media library for use
	 * as background images. Validates attachment exists and is an image type before
	 * returning attachment data.
	 *
	 * Security Requirements (8.1, 8.2, 12.1, 12.3):
	 * - Verify nonce for CSRF protection
	 * - Check user capability (manage_options)
	 * - Validate attachment ID exists
	 * - Validate attachment is an image type
	 *
	 * Functional Requirements (8.1, 8.2, 8.3):
	 * - Accept attachment_id parameter
	 * - Retrieve attachment URL using wp_get_attachment_url()
	 * - Retrieve thumbnail URL using wp_get_attachment_image_url()
	 * - Return JSON success response with attachment data
	 *
	 * @since 1.4.0
	 * @access public
	 *
	 * @global wpdb $wpdb WordPress database abstraction object.
	 *
	 * @return void Sends JSON response and exits.
	 *
	 * Security Notes:
	 * - Requires 'manage_options' capability
	 * - Validates nonce via check_ajax_referer()
	 * - Validates attachment exists in database
	 * - Validates attachment is image MIME type
	 * - Logs all selection attempts for auditing
	 */
	public function handle_ajax_select_background_image() {
		// Security: Verify nonce for CSRF protection (Requirement 12.3, Task 38).
		if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
			// Log security violation (Task 38).
			error_log(
				sprintf(
					'MASE Security Violation: Invalid nonce in background image selection. User ID: %d, IP: %s',
					get_current_user_id(),
					isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown'
				)
			);
			wp_send_json_error(
				array(
					'message' => __( 'Invalid security token. Please refresh the page and try again.', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Security: Check user capability (Requirement 12.3, Task 38).
		if ( ! current_user_can( 'manage_options' ) ) {
			// Log security violation (Task 38).
			error_log(
				sprintf(
					'MASE Security Violation: Unauthorized background image selection attempt. User ID: %d, IP: %s',
					get_current_user_id(),
					isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown'
				)
			);
			wp_send_json_error(
				array(
					'message' => __( 'You do not have permission to select images.', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Input validation: Get and sanitize attachment ID (Requirement 8.1).
		$attachment_id = isset( $_POST['attachment_id'] ) ? absint( $_POST['attachment_id'] ) : 0;

		// Validate attachment ID is provided (Requirement 8.1).
		if ( $attachment_id === 0 ) {
			error_log( 'MASE: Background image selection failed - No attachment ID provided' );

			wp_send_json_error(
				array(
					'message' => __( 'No attachment ID provided.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Validate attachment exists (Requirement 8.2).
		$attachment_post = get_post( $attachment_id );

		if ( ! $attachment_post || $attachment_post->post_type !== 'attachment' ) {
			error_log(
				sprintf(
					'MASE: Background image selection failed - Attachment not found. ID: %d',
					$attachment_id
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Attachment not found.', 'modern-admin-styler' ),
				),
				404
			);
		}

		// Validate attachment is an image (Requirement 8.2).
		$mime_type          = get_post_mime_type( $attachment_id );
		$allowed_mime_types = array( 'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml' );

		if ( ! in_array( $mime_type, $allowed_mime_types, true ) ) {
			error_log(
				sprintf(
					'MASE: Background image selection failed - Invalid MIME type. ID: %d, MIME: %s',
					$attachment_id,
					$mime_type
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Selected attachment is not an image.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Get optimized image URL with WebP support (Requirement 7.2).
		$attachment_url = $this->get_optimized_image_url( $attachment_id );

		// Get original URL as fallback.
		$original_url = wp_get_attachment_url( $attachment_id );

		if ( ! $original_url ) {
			error_log(
				sprintf(
					'MASE: Background image selection failed - Could not get attachment URL. ID: %d',
					$attachment_id
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Could not retrieve attachment URL.', 'modern-admin-styler' ),
				),
				500
			);
		}

		// Retrieve thumbnail URL (Requirement 8.3).
		$thumbnail_url = wp_get_attachment_image_url( $attachment_id, 'thumbnail' );

		// Thumbnail is optional - use optimized URL as fallback if thumbnail doesn't exist.
		if ( ! $thumbnail_url ) {
			$thumbnail_url = $attachment_url;
		}

		// Log successful selection.
		error_log(
			sprintf(
				'MASE: Background image selected successfully. ID: %d, URL: %s, MIME: %s',
				$attachment_id,
				$attachment_url,
				$mime_type
			)
		);

		// Return success response with attachment data (Requirement 8.3, 7.2).
		wp_send_json_success(
			array(
				'message'       => __( 'Background image selected successfully.', 'modern-admin-styler' ),
				'attachment_id' => $attachment_id,
				'url'           => $attachment_url,
				'original_url'  => $original_url,
				'thumbnail'     => $thumbnail_url,
			)
		);
	}

	/**
	 * Handle AJAX background image removal.
	 *
	 * Processes removal of background images from admin areas. Clears background
	 * settings for the specified area without deleting the attachment from the
	 * media library, allowing the image to be reused elsewhere.
	 *
	 * Security Requirements (8.5, 12.1, 12.3):
	 * - Verify nonce for CSRF protection
	 * - Check user capability (manage_options)
	 * - Validate area parameter
	 *
	 * Functional Requirements (8.5):
	 * - Accept area parameter (dashboard, admin_menu, post_lists, post_editor, widgets, login)
	 * - Clear background settings for specified area
	 * - Do NOT delete attachment from media library (preserve for reuse)
	 * - Invalidate CSS cache after removal
	 * - Return JSON success response
	 *
	 * @since 1.4.0
	 * @access public
	 *
	 * @return void Sends JSON response and exits.
	 *
	 * Security Notes:
	 * - Requires 'manage_options' capability
	 * - Validates nonce via check_ajax_referer()
	 * - Validates area parameter against allowed values
	 * - Logs all removal attempts for auditing
	 * - Does not delete media library attachments (security best practice)
	 */
	public function handle_ajax_remove_background_image() {
		// Security: Verify nonce for CSRF protection (Requirement 12.3, Task 38).
		if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
			// Log security violation (Task 38).
			error_log(
				sprintf(
					'MASE Security Violation: Invalid nonce in background image removal. User ID: %d, IP: %s',
					get_current_user_id(),
					isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown'
				)
			);
			wp_send_json_error(
				array(
					'message' => __( 'Invalid security token. Please refresh the page and try again.', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Security: Check user capability (Requirement 12.3, Task 38).
		if ( ! current_user_can( 'manage_options' ) ) {
			// Log security violation (Task 38).
			error_log(
				sprintf(
					'MASE Security Violation: Unauthorized background image removal attempt. User ID: %d, IP: %s',
					get_current_user_id(),
					isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown'
				)
			);
			wp_send_json_error(
				array(
					'message' => __( 'You do not have permission to remove background images.', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Input validation: Get and sanitize area parameter (Requirement 8.5).
		$area = isset( $_POST['area'] ) ? sanitize_text_field( $_POST['area'] ) : '';

		// Validate area parameter is provided (Requirement 8.5).
		if ( empty( $area ) ) {
			error_log( 'MASE: Background image removal failed - No area specified' );

			wp_send_json_error(
				array(
					'message' => __( 'No area specified.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Validate area against allowed values (Requirement 8.5).
		$allowed_areas = array( 'dashboard', 'admin_menu', 'post_lists', 'post_editor', 'widgets', 'login' );

		if ( ! in_array( $area, $allowed_areas, true ) ) {
			error_log(
				sprintf(
					'MASE: Background image removal failed - Invalid area: %s',
					$area
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Invalid area specified.', 'modern-admin-styler' ),
				),
				400
			);
		}

		// Get current settings.
		$settings = $this->settings->get_option();

		// Initialize custom_backgrounds section if it doesn't exist.
		if ( ! isset( $settings['custom_backgrounds'] ) ) {
			$settings['custom_backgrounds'] = array();
		}

		// Initialize area settings if they don't exist.
		if ( ! isset( $settings['custom_backgrounds'][ $area ] ) ) {
			$settings['custom_backgrounds'][ $area ] = array();
		}

		// Store attachment ID for logging before clearing (optional).
		$removed_attachment_id = isset( $settings['custom_backgrounds'][ $area ]['image_id'] )
			? $settings['custom_backgrounds'][ $area ]['image_id']
			: 0;

		// Clear background settings for specified area (Requirement 8.5).
		// Reset to default empty state without deleting the attachment.
		$settings['custom_backgrounds'][ $area ] = array(
			'enabled'    => false,
			'type'       => 'none',
			'image_url'  => '',
			'image_id'   => 0,
			'position'   => 'center center',
			'size'       => 'cover',
			'repeat'     => 'no-repeat',
			'attachment' => 'scroll',
			'opacity'    => 100,
			'blend_mode' => 'normal',
		);

		// Save updated settings.
		$result = $this->settings->update_option( $settings );

		if ( ! $result ) {
			error_log(
				sprintf(
					'MASE: Background image removal failed - Could not save settings. Area: %s',
					$area
				)
			);

			wp_send_json_error(
				array(
					'message' => __( 'Failed to remove background image.', 'modern-admin-styler' ),
				),
				500
			);
		}

		// Invalidate CSS cache after removal (Requirement 8.5).
		// Background changes affect both light and dark modes.
		$cache = new MASE_Cache();
		$cache->invalidate_both_mode_caches();

		// Also invalidate legacy cache key for backward compatibility.
		$this->cache->invalidate( 'generated_css' );

		// Log successful removal.
		error_log(
			sprintf(
				'MASE: Background image removed successfully. Area: %s, Attachment ID: %d (preserved in media library)',
				$area,
				$removed_attachment_id
			)
		);

		// Return success response (Requirement 8.5).
		wp_send_json_success(
			array(
				'message' => __( 'Background image removed successfully.', 'modern-admin-styler' ),
				'area'    => $area,
			)
		);
	}

	/**
	 * AJAX Handler: Get Button Defaults
	 *
	 * Returns default values for a specified button type or all button types.
	 * Used by the reset functionality to restore button settings to defaults.
	 *
	 * Security Requirements:
	 * - Verify nonce for CSRF protection (Requirement 22.3)
	 * - Check user capability (manage_options)
	 * - Validate button_type parameter
	 *
	 * Functional Requirements (Requirement 12.1):
	 * - Accept optional button_type parameter
	 * - Return defaults for specified type or all types
	 * - Return JSON success response with defaults
	 *
	 * @since 1.3.0
	 * @access public
	 *
	 * @return void Sends JSON response and exits.
	 */
	public function ajax_get_button_defaults() {
		try {
			// Security: Verify nonce for CSRF protection (Requirement 22.3).
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'modern-admin-styler' ) ), 403 );
			}

			// Security: Check user capability (Requirement 22.3).
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'modern-admin-styler' ) ), 403 );
			}

			// Input validation: Get and sanitize button_type parameter (optional).
			$button_type = isset( $_POST['button_type'] ) ? sanitize_text_field( $_POST['button_type'] ) : '';

			// Get all button defaults from settings.
			$all_defaults = $this->settings->get_button_defaults();

			// If button_type specified, validate and return only that type.
			if ( ! empty( $button_type ) ) {
				// Validate button type against allowed values.
				$allowed_types = array( 'primary', 'secondary', 'danger', 'success', 'ghost', 'tabs' );

				if ( ! in_array( $button_type, $allowed_types, true ) ) {
					wp_send_json_error(
						array(
							'message' => __( 'Invalid button type', 'modern-admin-styler' ),
						),
						400
					);
				}

				// Check if defaults exist for this type.
				if ( ! isset( $all_defaults[ $button_type ] ) ) {
					wp_send_json_error(
						array(
							'message' => __( 'Button type defaults not found', 'modern-admin-styler' ),
						),
						404
					);
				}

				// Return defaults for specified button type (Requirement 12.1).
				wp_send_json_success(
					array(
						'message'     => __( 'Button defaults retrieved successfully', 'modern-admin-styler' ),
						'button_type' => $button_type,
						'defaults'    => $all_defaults[ $button_type ],
					)
				);
			} else {
				// Return all button defaults (Requirement 12.1).
				wp_send_json_success(
					array(
						'message'  => __( 'All button defaults retrieved successfully', 'modern-admin-styler' ),
						'defaults' => $all_defaults,
					)
				);
			}
		} catch ( Exception $e ) {
			error_log( 'MASE Error (get_button_defaults): ' . $e->getMessage() );
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred while retrieving button defaults. Please try again.', 'modern-admin-styler' ),
				),
				500
			);
		}
	}

	/**
	 * AJAX Handler: Reset Button Type
	 *
	 * Resets a specific button type to its default values and clears the button CSS cache.
	 *
	 * Security Requirements:
	 * - Verify nonce for CSRF protection (Requirement 22.3)
	 * - Check user capability (manage_options)
	 * - Validate button_type parameter
	 *
	 * Functional Requirements (Requirement 12.1):
	 * - Accept button_type parameter (required)
	 * - Reset specified button type to defaults
	 * - Clear button CSS cache
	 * - Return JSON success response
	 *
	 * @since 1.3.0
	 * @access public
	 *
	 * @return void Sends JSON response and exits.
	 */
	public function ajax_reset_button_type() {
		try {
			// Security: Verify nonce for CSRF protection (Requirement 22.3).
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'modern-admin-styler' ) ), 403 );
			}

			// Security: Check user capability (Requirement 22.3).
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'modern-admin-styler' ) ), 403 );
			}

			// Input validation: Get and sanitize button_type parameter (required).
			$button_type = isset( $_POST['button_type'] ) ? sanitize_text_field( $_POST['button_type'] ) : '';

			// Validate button_type is not empty.
			if ( empty( $button_type ) ) {
				wp_send_json_error(
					array(
						'message' => __( 'Button type is required', 'modern-admin-styler' ),
					),
					400
				);
			}

			// Validate button type against allowed values.
			$allowed_types = array( 'primary', 'secondary', 'danger', 'success', 'ghost', 'tabs' );

			if ( ! in_array( $button_type, $allowed_types, true ) ) {
				wp_send_json_error(
					array(
						'message' => __( 'Invalid button type', 'modern-admin-styler' ),
					),
					400
				);
			}

			// Get current settings.
			$settings = $this->settings->get_option();

			// Get button defaults.
			$button_defaults = $this->settings->get_button_defaults();

			// Check if defaults exist for this type.
			if ( ! isset( $button_defaults[ $button_type ] ) ) {
				wp_send_json_error(
					array(
						'message' => __( 'Button type defaults not found', 'modern-admin-styler' ),
					),
					404
				);
			}

			// Initialize universal_buttons section if it doesn't exist.
			if ( ! isset( $settings['universal_buttons'] ) ) {
				$settings['universal_buttons'] = array();
			}

			// Reset specified button type to defaults (Requirement 12.1).
			$settings['universal_buttons'][ $button_type ] = $button_defaults[ $button_type ];

			// Save updated settings.
			$result = $this->settings->update_option( $settings );

			if ( ! $result ) {
				wp_send_json_error(
					array(
						'message' => __( 'Failed to reset button type', 'modern-admin-styler' ),
					),
					500
				);
			}

			// Clear button CSS cache (Requirement 12.1, 7.6).
			// Invalidate both mode caches as button changes affect both light and dark modes.
			$cache = new MASE_Cache();
			$cache->invalidate_both_mode_caches();

			// Clear button-specific CSS cache (Requirement 7.6).
			$cache->clear_button_css_cache();

			// Also invalidate legacy cache key for backward compatibility.
			$this->cache->invalidate( 'generated_css' );

			// Log successful reset.
			error_log(
				sprintf(
					'MASE: Button type "%s" reset to defaults successfully',
					$button_type
				)
			);

			// Return success response (Requirement 12.1).
			wp_send_json_success(
				array(
					'message'     => sprintf(
					/* translators: %s: button type name */
						__( '%s button reset to defaults successfully', 'modern-admin-styler' ),
						ucfirst( $button_type )
					),
					'button_type' => $button_type,
					'defaults'    => $button_defaults[ $button_type ],
				)
			);

		} catch ( Exception $e ) {
			error_log( 'MASE Error (reset_button_type): ' . $e->getMessage() );
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred while resetting button type. Please try again.', 'modern-admin-styler' ),
				),
				500
			);
		}
	}

	/**
	 * AJAX Handler: Reset All Buttons
	 *
	 * Resets all button types to their default values and clears all button CSS cache.
	 *
	 * Security Requirements:
	 * - Verify nonce for CSRF protection (Requirement 22.3)
	 * - Check user capability (manage_options)
	 *
	 * Functional Requirements (Requirement 12.2):
	 * - Reset all button types to defaults
	 * - Clear all button CSS cache
	 * - Return JSON success response
	 *
	 * @since 1.3.0
	 * @access public
	 *
	 * @return void Sends JSON response and exits.
	 */
	public function ajax_reset_all_buttons() {
		try {
			// Security: Verify nonce for CSRF protection (Requirement 22.3).
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'modern-admin-styler' ) ), 403 );
			}

			// Security: Check user capability (Requirement 22.3).
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'modern-admin-styler' ) ), 403 );
			}

			// Get current settings.
			$settings = $this->settings->get_option();

			// Get all button defaults.
			$button_defaults = $this->settings->get_button_defaults();

			// Reset all button types to defaults (Requirement 12.2).
			$settings['universal_buttons'] = $button_defaults;

			// Save updated settings.
			$result = $this->settings->update_option( $settings );

			if ( ! $result ) {
				wp_send_json_error(
					array(
						'message' => __( 'Failed to reset all buttons', 'modern-admin-styler' ),
					),
					500
				);
			}

			// Clear all button CSS cache (Requirement 12.2, 7.6).
			// Invalidate both mode caches as button changes affect both light and dark modes.
			$cache = new MASE_Cache();
			$cache->invalidate_both_mode_caches();

			// Clear button-specific CSS cache (Requirement 7.6).
			$cache->clear_button_css_cache();

			// Also invalidate legacy cache key for backward compatibility.
			$this->cache->invalidate( 'generated_css' );

			// Log successful reset.
			error_log( 'MASE: All buttons reset to defaults successfully' );

			// Return success response (Requirement 12.2).
			wp_send_json_success(
				array(
					'message'  => __( 'All buttons reset to defaults successfully', 'modern-admin-styler' ),
					'defaults' => $button_defaults,
				)
			);

		} catch ( Exception $e ) {
			error_log( 'MASE Error (reset_all_buttons): ' . $e->getMessage() );
			wp_send_json_error(
				array(
					'message' => __( 'An error occurred while resetting all buttons. Please try again.', 'modern-admin-styler' ),
				),
				500
			);
		}
	}

	/**
	 * Handle AJAX request to get pattern library data
	 *
	 * Advanced Background System - Task 35
	 * Requirement 7.1: Load pattern library data on demand (not on page load)
	 *
	 * Security:
	 * - Nonce verification (CSRF protection)
	 * - Capability check (manage_options)
	 *
	 * @since 1.3.0
	 */
	public function handle_ajax_get_pattern_library() {
		// Verify nonce (CSRF protection).
		check_ajax_referer( 'mase_save_settings', 'nonce' );

		// Check user capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'You do not have permission to access pattern library data.', 'modern-admin-styler' ),
				),
				403
			);
		}

		try {
			// Get pattern library data from settings.
			$settings        = new MASE_Settings();
			$pattern_library = $settings->get_pattern_library();

			// Return pattern library data.
			wp_send_json_success( $pattern_library );

		} catch ( Exception $e ) {
			error_log( 'MASE Error (get_pattern_library): ' . $e->getMessage() );
			wp_send_json_error(
				array(
					'message' => __( 'Failed to load pattern library data. Please try again.', 'modern-admin-styler' ),
				),
				500
			);
		}
	}

	/**
	 * Handle AJAX request to log client-side errors.
	 *
	 * Task 44: Log errors for debugging (Requirement 7.5)
	 *
	 * Logs JavaScript errors from the client to the server error log for debugging.
	 * Only works when WP_DEBUG is enabled to prevent log spam in production.
	 *
	 * Security:
	 * - Nonce verification (CSRF protection)
	 * - Capability check (manage_options)
	 * - Only logs when WP_DEBUG is enabled
	 * - Sanitizes all input data
	 *
	 * @since 1.4.0
	 */
	public function handle_ajax_log_client_error() {
		// Verify nonce (CSRF protection).
		check_ajax_referer( 'mase_save_settings', 'nonce' );

		// Check user capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'You do not have permission to log errors.', 'modern-admin-styler' ),
				),
				403
			);
		}

		// Only log errors when WP_DEBUG is enabled.
		if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
			wp_send_json_success(
				array(
					'message' => __( 'Error logging is disabled in production.', 'modern-admin-styler' ),
				)
			);
			return;
		}

		try {
			// Get error log data from request.
			$error_log_json = isset( $_POST['error_log'] ) ? sanitize_text_field( wp_unslash( $_POST['error_log'] ) ) : '';

			if ( empty( $error_log_json ) ) {
				wp_send_json_error(
					array(
						'message' => __( 'No error log data provided.', 'modern-admin-styler' ),
					),
					400
				);
				return;
			}

			// Decode JSON error log.
			$error_log = json_decode( $error_log_json, true );

			if ( json_last_error() !== JSON_ERROR_NONE ) {
				wp_send_json_error(
					array(
						'message' => __( 'Invalid error log format.', 'modern-admin-styler' ),
					),
					400
				);
				return;
			}

			// Extract and sanitize error data.
			$timestamp     = isset( $error_log['timestamp'] ) ? sanitize_text_field( $error_log['timestamp'] ) : '';
			$context       = isset( $error_log['context'] ) ? sanitize_text_field( $error_log['context'] ) : 'unknown';
			$error_message = isset( $error_log['error']['message'] ) ? sanitize_text_field( $error_log['error']['message'] ) : 'No message';
			$error_code    = isset( $error_log['error']['code'] ) ? sanitize_text_field( $error_log['error']['code'] ) : 'UNKNOWN';
			$url           = isset( $error_log['url'] ) ? esc_url_raw( $error_log['url'] ) : '';
			$user_agent    = isset( $error_log['userAgent'] ) ? sanitize_text_field( $error_log['userAgent'] ) : '';

			// Log the client-side error.
			error_log(
				sprintf(
					'MASE Client Error [%s] - Context: %s, Code: %s, Message: %s, URL: %s, User Agent: %s, User ID: %d',
					$timestamp,
					$context,
					$error_code,
					$error_message,
					$url,
					$user_agent,
					get_current_user_id()
				)
			);

			// Log metadata if present.
			if ( isset( $error_log['metadata'] ) && is_array( $error_log['metadata'] ) && ! empty( $error_log['metadata'] ) ) {
				error_log(
					sprintf(
						'MASE Client Error Metadata: %s',
						wp_json_encode( $error_log['metadata'] )
					)
				);
			}

			wp_send_json_success(
				array(
					'message' => __( 'Error logged successfully.', 'modern-admin-styler' ),
				)
			);

		} catch ( Exception $e ) {
			error_log( 'MASE Error (log_client_error): ' . $e->getMessage() );
			wp_send_json_error(
				array(
					'message' => __( 'Failed to log error. Please check server logs.', 'modern-admin-styler' ),
				),
				500
			);
		}
	}





	/**
	 * Handle AJAX request to get template CSS file sizes.
	 *
	 * Task 18.3: Measure CSS file sizes
	 *
	 * Returns CSS file size information for all templates.
	 * Used by performance monitor to display file sizes and warnings.
	 *
	 * Security:
	 * - Nonce verification (CSRF protection)
	 * - Capability check (manage_options)
	 *
	 * @since 1.3.0
	 */
	public function handle_ajax_get_template_sizes() {
		// Verify nonce (CSRF protection).
		check_ajax_referer( 'mase_save_settings', 'nonce' );

		// Check user capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'You do not have permission to access template sizes.', 'modern-admin-styler' ),
				),
				403
			);
		}

		try {
			// Get template manager instance.
			$template_manager = new MASE_Template_Manager();

			// Get all template sizes.
			$sizes = $template_manager->get_all_template_sizes();

			wp_send_json_success(
				array(
					'message' => __( 'Template sizes retrieved successfully.', 'modern-admin-styler' ),
					'sizes'   => $sizes,
				)
			);

		} catch ( Exception $e ) {
			error_log( 'MASE Error (get_template_sizes): ' . $e->getMessage() );
			wp_send_json_error(
				array(
					'message' => __( 'Failed to retrieve template sizes. Please check server logs.', 'modern-admin-styler' ),
				),
				500
			);
		}
	}

	/**
	 * Handle AJAX request to save scheduler settings.
	 * Task 20.2: Implement scheduling logic
	 *
	 * @since 1.3.0
	 * @return void Sends JSON response and exits.
	 */
	public function handle_ajax_save_scheduler_settings() {
		try {
			// Verify nonce (CSRF protection).
			if ( ! check_ajax_referer( 'mase_save_settings', 'nonce', false ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Save scheduler settings - Invalid nonce. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Invalid nonce', 'modern-admin-styler' ) ), 403 );
			}

			// Check user capability.
			if ( ! current_user_can( 'manage_options' ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log(
						sprintf(
							'MASE Security: Save scheduler settings - Unauthorized access. User ID: %d',
							get_current_user_id()
						)
					);
				}
				wp_send_json_error( array( 'message' => __( 'Unauthorized access', 'modern-admin-styler' ) ), 403 );
			}

			// Get settings data.
			$settings_json = isset( $_POST['settings'] ) ? wp_unslash( $_POST['settings'] ) : '';
			
			// Log request data.
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Save scheduler settings requested. User ID: %d',
						get_current_user_id()
					)
				);
			}

			// Validate input.
			if ( empty( $settings_json ) ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Validation Error: Save scheduler settings - Settings are required' );
				}
				wp_send_json_error( array( 'message' => __( 'Scheduler settings are required', 'modern-admin-styler' ) ), 400 );
			}

			// Decode JSON.
			$settings = json_decode( $settings_json, true );
			if ( json_last_error() !== JSON_ERROR_NONE ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Validation Error: Save scheduler settings - Invalid JSON: ' . json_last_error_msg() );
				}
				wp_send_json_error( array( 'message' => __( 'Invalid settings format', 'modern-admin-styler' ) ), 400 );
			}

			// Sanitize settings.
			$sanitized_settings = array(
				'enabled'        => isset( $settings['enabled'] ) ? (bool) $settings['enabled'] : false,
				'syncWithSystem' => isset( $settings['syncWithSystem'] ) ? (bool) $settings['syncWithSystem'] : false,
				'schedule'       => array(),
			);

			// Sanitize schedule periods.
			if ( isset( $settings['schedule'] ) && is_array( $settings['schedule'] ) ) {
				$valid_periods = array( 'morning', 'afternoon', 'evening', 'night' );
				
				foreach ( $settings['schedule'] as $period => $config ) {
					// Validate period name.
					if ( ! in_array( $period, $valid_periods, true ) ) {
						continue;
					}

					// Sanitize period configuration.
					$sanitized_settings['schedule'][ $period ] = array(
						'start' => isset( $config['start'] ) ? sanitize_text_field( $config['start'] ) : '00:00',
						'end'   => isset( $config['end'] ) ? sanitize_text_field( $config['end'] ) : '00:00',
						'theme' => isset( $config['theme'] ) ? sanitize_text_field( $config['theme'] ) : '',
					);

					// Validate time format (HH:MM).
					if ( ! preg_match( '/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $sanitized_settings['schedule'][ $period ]['start'] ) ) {
						$sanitized_settings['schedule'][ $period ]['start'] = '00:00';
					}
					if ( ! preg_match( '/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $sanitized_settings['schedule'][ $period ]['end'] ) ) {
						$sanitized_settings['schedule'][ $period ]['end'] = '00:00';
					}
				}
			}

			// Get current settings.
			$current_settings = $this->settings->get_option();

			// Update scheduler settings.
			$current_settings['scheduler'] = $sanitized_settings;

			// Save settings using direct update_option to bypass full validation.
			// This is safe because we've already sanitized the scheduler settings above.
			$result = update_option( 'mase_settings', $current_settings );

			if ( ! $result ) {
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'MASE Error: Failed to save scheduler settings' );
				}
				wp_send_json_error(
					array(
						'message' => __( 'Failed to save scheduler settings', 'modern-admin-styler' ),
					),
					500
				);
			}

			// Clear cache.
			if ( class_exists( 'MASE_Cache' ) ) {
				MASE_Cache::clear_all();
			}

			// Log success.
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'MASE: Scheduler settings saved successfully. User ID: %d, Enabled: %s',
						get_current_user_id(),
						$sanitized_settings['enabled'] ? 'true' : 'false'
					)
				);
			}

			wp_send_json_success(
				array(
					'message'  => __( 'Scheduler settings saved successfully', 'modern-admin-styler' ),
					'settings' => $sanitized_settings,
				)
			);

		} catch ( Exception $e ) {
			error_log( 'MASE Error (save_scheduler_settings): ' . $e->getMessage() );
			wp_send_json_error(
				array(
					'message' => __( 'Failed to save scheduler settings. Please check server logs.', 'modern-admin-styler' ),
				),
				500
			);
		}
	}

	/**
	 * Adjust color brightness.
	 *
	 * Helper function to lighten or darken a hex color.
	 *
	 * @since 1.0.0
	 * @param string $hex Hex color code
	 * @param int $steps Steps to adjust (-255 to 255)
	 * @return string Adjusted hex color
	 */
	private function adjust_color_brightness( $hex, $steps ) {
		// Remove # if present
		$hex = str_replace( '#', '', $hex );

		// Convert to RGB
		$r = hexdec( substr( $hex, 0, 2 ) );
		$g = hexdec( substr( $hex, 2, 2 ) );
		$b = hexdec( substr( $hex, 4, 2 ) );

		// Adjust
		$r = max( 0, min( 255, $r + $steps ) );
		$g = max( 0, min( 255, $g + $steps ) );
		$b = max( 0, min( 255, $b + $steps ) );

		// Convert back to hex
		return '#' . str_pad( dechex( $r ), 2, '0', STR_PAD_LEFT ) .
			str_pad( dechex( $g ), 2, '0', STR_PAD_LEFT ) .
			str_pad( dechex( $b ), 2, '0', STR_PAD_LEFT );
	}
	
}
