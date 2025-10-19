<?php
/**
 * MASE Mobile Optimizer Class
 *
 * Handles mobile device detection, low-power device detection,
 * and graceful degradation for visual effects.
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.2.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class MASE_Mobile_Optimizer
 *
 * Detects mobile and low-power devices and manages graceful degradation.
 */
class MASE_Mobile_Optimizer {

	/**
	 * Detect if current device is mobile.
	 * Uses WordPress wp_is_mobile() function (Requirement 9.1).
	 *
	 * @return bool True if mobile device, false otherwise.
	 */
	public function is_mobile() {
		return wp_is_mobile();
	}

	/**
	 * Detect if current device is low-power.
	 * Uses client-side detection via JavaScript and server-side heuristics (Requirement 16.1).
	 *
	 * @return bool True if low-power device detected, false otherwise.
	 */
	public function is_low_power_device() {
		// Check for stored low-power detection result.
		$stored_result = get_transient( 'mase_low_power_device_' . get_current_user_id() );
		if ( false !== $stored_result ) {
			return (bool) $stored_result;
		}

		// Server-side heuristics for low-power device detection.
		$user_agent = isset( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '';

		// Check for common low-power device indicators.
		$low_power_indicators = array(
			'Android 4',
			'Android 5',
			'iPhone 5',
			'iPhone 6',
			'iPad 2',
			'iPad 3',
			'iPad 4',
			'iPod',
		);

		foreach ( $low_power_indicators as $indicator ) {
			if ( stripos( $user_agent, $indicator ) !== false ) {
				// Cache result for 1 hour.
				set_transient( 'mase_low_power_device_' . get_current_user_id(), true, HOUR_IN_SECONDS );
				return true;
			}
		}

		// Default to false if no indicators found.
		set_transient( 'mase_low_power_device_' . get_current_user_id(), false, HOUR_IN_SECONDS );
		return false;
	}

	/**
	 * Check if effects should be reduced based on device and settings.
	 * Requirement 7.3: Disable expensive visual effects on mobile when reduced effects mode is enabled.
	 *
	 * @return bool True if effects should be reduced, false otherwise.
	 */
	public function should_reduce_effects() {
		// Check if mobile device.
		if ( ! $this->is_mobile() ) {
			return false;
		}

		// Get current settings.
		$settings_obj = new MASE_Settings();
		$settings = $settings_obj->get_option();

		// Check if reduced effects mode is enabled for mobile.
		$mobile_settings = isset( $settings['mobile'] ) ? $settings['mobile'] : array();
		if ( isset( $mobile_settings['reduced_effects'] ) && $mobile_settings['reduced_effects'] ) {
			return true;
		}

		// Check if low-power device detected.
		if ( $this->is_low_power_device() ) {
			return true;
		}

		return false;
	}

	/**
	 * Get optimized settings for mobile devices.
	 * Requirement 7.1: Apply mobile-optimized styles automatically.
	 * Requirement 7.2: Increase touch target sizes to minimum 44px × 44px.
	 * Requirement 7.3: Disable expensive visual effects on mobile.
	 * Requirement 7.4: Reduce padding and spacing by 25% in compact mode.
	 *
	 * @param array $settings Original settings array.
	 * @return array Optimized settings for mobile devices.
	 */
	public function get_optimized_settings( $settings ) {
		// If not mobile, return original settings.
		if ( ! $this->is_mobile() ) {
			return $settings;
		}

		$optimized = $settings;
		$mobile_settings = isset( $settings['mobile'] ) ? $settings['mobile'] : array();

		// Apply mobile optimization if enabled (Requirement 7.1).
		if ( isset( $mobile_settings['optimized'] ) && $mobile_settings['optimized'] ) {
			
			// Increase touch target sizes (Requirement 7.2).
			if ( isset( $mobile_settings['touch_friendly'] ) && $mobile_settings['touch_friendly'] ) {
				// Increase admin bar height for better touch targets.
				if ( isset( $optimized['admin_bar']['height'] ) ) {
					$optimized['admin_bar']['height'] = max( 44, $optimized['admin_bar']['height'] );
				}

				// Increase admin menu item height.
				if ( isset( $optimized['admin_menu']['item_height'] ) ) {
					$optimized['admin_menu']['item_height'] = max( 44, $optimized['admin_menu']['item_height'] );
				}
			}

			// Reduce padding and spacing in compact mode (Requirement 7.4).
			if ( isset( $mobile_settings['compact_mode'] ) && $mobile_settings['compact_mode'] ) {
				// Reduce admin bar padding by 25%.
				if ( isset( $optimized['admin_bar']['padding'] ) ) {
					$optimized['admin_bar']['padding'] = (int) ( $optimized['admin_bar']['padding'] * 0.75 );
				}

				// Reduce admin menu padding by 25%.
				if ( isset( $optimized['admin_menu']['padding'] ) ) {
					$optimized['admin_menu']['padding'] = (int) ( $optimized['admin_menu']['padding'] * 0.75 );
				}

				// Reduce content area padding by 25%.
				if ( isset( $optimized['content']['padding'] ) ) {
					$optimized['content']['padding'] = (int) ( $optimized['content']['padding'] * 0.75 );
				}
			}

			// Disable expensive visual effects (Requirement 7.3).
			if ( $this->should_reduce_effects() ) {
				// Disable glassmorphism (blur effects).
				if ( isset( $optimized['visual_effects']['admin_bar']['glassmorphism'] ) ) {
					$optimized['visual_effects']['admin_bar']['glassmorphism'] = false;
				}
				if ( isset( $optimized['visual_effects']['admin_menu']['glassmorphism'] ) ) {
					$optimized['visual_effects']['admin_menu']['glassmorphism'] = false;
				}

				// Disable shadows.
				if ( isset( $optimized['visual_effects']['admin_bar']['shadow'] ) ) {
					$optimized['visual_effects']['admin_bar']['shadow'] = 'none';
				}
				if ( isset( $optimized['visual_effects']['admin_menu']['shadow'] ) ) {
					$optimized['visual_effects']['admin_menu']['shadow'] = 'none';
				}

				// Disable animations.
				if ( isset( $optimized['visual_effects']['animations_enabled'] ) ) {
					$optimized['visual_effects']['animations_enabled'] = false;
				}
				if ( isset( $optimized['visual_effects']['microanimations_enabled'] ) ) {
					$optimized['visual_effects']['microanimations_enabled'] = false;
				}

				// Disable particle system.
				if ( isset( $optimized['visual_effects']['particle_system'] ) ) {
					$optimized['visual_effects']['particle_system'] = false;
				}

				// Disable 3D effects.
				if ( isset( $optimized['visual_effects']['3d_effects'] ) ) {
					$optimized['visual_effects']['3d_effects'] = false;
				}
			}
		}

		return $optimized;
	}

	/**
	 * Get device capabilities information.
	 * Requirement 7.1: Detect device capabilities for optimization decisions.
	 *
	 * @return array Device capabilities information.
	 */
	public function get_device_capabilities() {
		$capabilities = array(
			'is_mobile'           => $this->is_mobile(),
			'is_low_power'        => $this->is_low_power_device(),
			'should_reduce_effects' => $this->should_reduce_effects(),
			'user_agent'          => isset( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '',
			'viewport_width'      => 0, // Will be set by JavaScript.
			'device_memory'       => 0, // Will be set by JavaScript.
			'hardware_concurrency' => 0, // Will be set by JavaScript.
			'connection_type'     => '', // Will be set by JavaScript.
			'save_data'           => false, // Will be set by JavaScript.
		);

		// Try to get stored client-side capabilities.
		$stored_capabilities = get_transient( 'mase_device_capabilities_' . get_current_user_id() );
		if ( false !== $stored_capabilities && is_array( $stored_capabilities ) ) {
			$capabilities = array_merge( $capabilities, $stored_capabilities );
		}

		return $capabilities;
	}

	/**
	 * Check if shadows should be disabled based on device and settings.
	 * Requirement 16.2: Provide option to disable shadows.
	 * Requirement 16.1: Auto-detect low-power devices.
	 *
	 * @param array $settings Visual effects settings.
	 * @return bool True if shadows should be disabled, false otherwise.
	 */
	public function should_disable_shadows( $settings ) {
		$visual_effects = isset( $settings['visual_effects'] ) ? $settings['visual_effects'] : array();

		// Check manual setting (Requirement 16.2).
		if ( isset( $visual_effects['disable_mobile_shadows'] ) && $visual_effects['disable_mobile_shadows'] ) {
			return $this->is_mobile();
		}

		// Check auto-detection setting (Requirement 16.1).
		if ( isset( $visual_effects['auto_detect_low_power'] ) && $visual_effects['auto_detect_low_power'] ) {
			return $this->is_low_power_device();
		}

		return false;
	}

	/**
	 * Display admin notice for degradation mode.
	 * Requirement 16.4: Notify user when degradation occurs.
	 */
	public function display_degradation_notice() {
		// Only show on MASE settings page.
		$screen = get_current_screen();
		if ( ! $screen || 'settings_page_mase-settings' !== $screen->id ) {
			return;
		}

		$settings = new MASE_Settings();
		$current_settings = $settings->get_option();

		// Check if degradation is active.
		if ( ! $this->should_disable_shadows( $current_settings ) ) {
			return;
		}

		// Determine reason for degradation.
		$reason = '';
		if ( $this->is_mobile() && isset( $current_settings['visual_effects']['disable_mobile_shadows'] ) && 
			 $current_settings['visual_effects']['disable_mobile_shadows'] ) {
			$reason = 'mobile device detected';
		} elseif ( $this->is_low_power_device() ) {
			$reason = 'low-power device detected';
		}

		if ( empty( $reason ) ) {
			return;
		}

		?>
		<div class="notice notice-info is-dismissible">
			<p>
				<strong>MASE Performance Mode:</strong> 
				Shadow effects have been disabled due to <?php echo esc_html( $reason ); ?> 
				to maintain optimal performance. Border radius effects remain active.
			</p>
			<p>
				<a href="<?php echo esc_url( admin_url( 'options-general.php?page=mase-settings#visual-effects' ) ); ?>">
					Manage visual effects settings
				</a>
			</p>
		</div>
		<?php
	}

	/**
	 * Enqueue client-side low-power detection script.
	 * Uses JavaScript to detect device capabilities (Requirement 16.1).
	 */
	public function enqueue_detection_script() {
		// Only enqueue on admin pages.
		if ( ! is_admin() ) {
			return;
		}

		wp_add_inline_script(
			'mase-admin',
			$this->get_detection_script(),
			'after'
		);
	}

	/**
	 * Get client-side detection script.
	 * Detects low-power devices and device capabilities using JavaScript APIs (Requirement 16.1, 7.1).
	 *
	 * @return string JavaScript code for detection.
	 */
	private function get_detection_script() {
		return "
		(function() {
			'use strict';
			
			// Detect device capabilities and low-power device using JavaScript APIs
			function detectDeviceCapabilities() {
				var isLowPower = false;
				var capabilities = {
					viewport_width: window.innerWidth || document.documentElement.clientWidth,
					device_memory: navigator.deviceMemory || 0,
					hardware_concurrency: navigator.hardwareConcurrency || 0,
					connection_type: '',
					save_data: false
				};
				
				// Check for Save-Data header support
				if (navigator.connection) {
					if (navigator.connection.saveData) {
						isLowPower = true;
						capabilities.save_data = true;
					}
					if (navigator.connection.effectiveType) {
						capabilities.connection_type = navigator.connection.effectiveType;
					}
				}
				
				// Check for reduced motion preference (often indicates low-power mode)
				if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
					isLowPower = true;
				}
				
				// Check device memory (if available)
				if (navigator.deviceMemory && navigator.deviceMemory < 4) {
					isLowPower = true;
				}
				
				// Check hardware concurrency (CPU cores)
				if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
					isLowPower = true;
				}
				
				// Send results to server
				jQuery.post(ajaxurl, {
					action: 'mase_store_device_capabilities',
					nonce: jQuery('#mase_nonce').val(),
					is_low_power: isLowPower,
					capabilities: capabilities
				});
			}
			
			// Run detection on page load
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', detectDeviceCapabilities);
			} else {
				detectDeviceCapabilities();
			}
		})();
		";
	}

	/**
	 * Handle AJAX request to store device capabilities.
	 * Requirement 16.1: Store client-side detection result.
	 * Requirement 7.1: Store device capabilities for optimization.
	 */
	public function handle_store_device_capabilities() {
		// Verify nonce.
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'mase_nonce' ) ) {
			wp_send_json_error( array( 'message' => 'Invalid nonce' ) );
		}

		// Check user capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => 'Insufficient permissions' ) );
		}

		// Store low-power detection result.
		$is_low_power = isset( $_POST['is_low_power'] ) && $_POST['is_low_power'];
		set_transient( 'mase_low_power_device_' . get_current_user_id(), $is_low_power, HOUR_IN_SECONDS );

		// Store device capabilities.
		if ( isset( $_POST['capabilities'] ) && is_array( $_POST['capabilities'] ) ) {
			$capabilities = array(
				'viewport_width'       => isset( $_POST['capabilities']['viewport_width'] ) ? intval( $_POST['capabilities']['viewport_width'] ) : 0,
				'device_memory'        => isset( $_POST['capabilities']['device_memory'] ) ? floatval( $_POST['capabilities']['device_memory'] ) : 0,
				'hardware_concurrency' => isset( $_POST['capabilities']['hardware_concurrency'] ) ? intval( $_POST['capabilities']['hardware_concurrency'] ) : 0,
				'connection_type'      => isset( $_POST['capabilities']['connection_type'] ) ? sanitize_text_field( $_POST['capabilities']['connection_type'] ) : '',
				'save_data'            => isset( $_POST['capabilities']['save_data'] ) && $_POST['capabilities']['save_data'],
			);

			set_transient( 'mase_device_capabilities_' . get_current_user_id(), $capabilities, HOUR_IN_SECONDS );
		}

		wp_send_json_success( array( 'message' => 'Device capabilities stored' ) );
	}

	/**
	 * Handle AJAX request to store low-power detection result.
	 * Requirement 16.1: Store client-side detection result.
	 * @deprecated Use handle_store_device_capabilities() instead.
	 */
	public function handle_store_low_power_detection() {
		// Verify nonce.
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'mase_nonce' ) ) {
			wp_send_json_error( array( 'message' => 'Invalid nonce' ) );
		}

		// Check user capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => 'Insufficient permissions' ) );
		}

		// Store detection result.
		$is_low_power = isset( $_POST['is_low_power'] ) && $_POST['is_low_power'];
		set_transient( 'mase_low_power_device_' . get_current_user_id(), $is_low_power, HOUR_IN_SECONDS );

		wp_send_json_success( array( 'message' => 'Low-power detection stored' ) );
	}
}
