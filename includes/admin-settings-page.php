<?php
/**
 * Admin Settings Page Template - MASE v1.2.0
 *
 * 8-tab structure with comprehensive customization options:
 * - General: Palettes, Templates, Master Controls
 * - Admin Bar: Colors, Typography, Visual Effects
 * - Menu: Colors, Typography, Visual Effects
 * - Content: Background, Spacing, Layout
 * - Typography: Font controls for all areas
 * - Effects: Animations, Hover, Visual Effects
 * - Templates: Full template gallery
 * - Advanced: Custom CSS/JS, Auto Palette, Backup
 *
 * @package ModernAdminStyler
 * @since 1.2.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Get settings instance
$settings_obj = new MASE_Settings();
$settings     = $settings_obj->get_option();
$palettes     = $settings_obj->get_all_palettes();
$templates    = $settings_obj->get_all_templates();
?>

<div class="wrap mase-settings-wrap" 
	data-mase-version="<?php echo esc_attr( MASE_VERSION ); ?>"
	data-mase-rest-url="<?php echo esc_attr( rest_url( 'mase/v1' ) ); ?>"
	data-mase-nonce="<?php echo esc_attr( wp_create_nonce( 'wp_rest' ) ); ?>">
	
	<!-- Loading State Container (Requirement 10.1) -->
	<div id="mase-loading-overlay" class="mase-loading-overlay" style="display: none;" role="status" aria-live="polite">
		<div class="mase-loading-spinner">
			<span class="dashicons dashicons-update" aria-hidden="true"></span>
			<span class="mase-loading-text"><?php esc_html_e( 'Loading...', 'modern-admin-styler' ); ?></span>
		</div>
	</div>
	
	<!-- Error Boundary Container (Requirement 10.1) -->
	<div id="mase-error-boundary" class="mase-error-boundary" style="display: none;" role="alert" aria-live="assertive">
		<div class="mase-error-content">
			<span class="dashicons dashicons-warning" aria-hidden="true"></span>
			<h3><?php esc_html_e( 'Something went wrong', 'modern-admin-styler' ); ?></h3>
			<p class="mase-error-message"></p>
			<button type="button" class="button button-primary mase-error-reload">
				<?php esc_html_e( 'Reload Page', 'modern-admin-styler' ); ?>
			</button>
		</div>
	</div>
	
	<!-- ARIA Live Region for Dynamic Notices (Requirement 13.5) -->
	<div id="mase-notice-region" class="mase-notice-region" role="status" aria-live="polite" aria-atomic="true"></div>
	
	<!-- Header Section -->
	<div class="mase-header">
		<div class="mase-header-left">
			<h1>
				<?php echo esc_html( get_admin_page_title() ); ?>
				<span class="mase-version-badge">v1.2.0</span>
			</h1>
			<p class="mase-subtitle"><?php esc_html_e( 'Transform your WordPress admin with modern design and powerful customization', 'modern-admin-styler' ); ?></p>
		</div>
		<div class="mase-header-right">
			<!-- Dark Mode Toggle -->
			<label class="mase-header-toggle">
				<input 
					type="checkbox" 
					id="mase-dark-mode-toggle"
					name="mase_dark_mode" 
					value="1"
					<?php checked( $settings['master']['dark_mode'] ?? false, true ); ?>
					role="switch"
					aria-checked="<?php echo ( $settings['master']['dark_mode'] ?? false ) ? 'true' : 'false'; ?>"
					aria-label="<?php esc_attr_e( 'Toggle dark mode for entire admin', 'modern-admin-styler' ); ?>"
				/>
				<span class="dashicons dashicons-admin-appearance" aria-hidden="true"></span>
				<span><?php esc_html_e( 'Dark Mode', 'modern-admin-styler' ); ?></span>
			</label>
			<label class="mase-header-toggle">
				<?php
				// Get live preview setting, default to true (enabled by default)
				// @see Task 11.4 in .kiro/specs/critical-fixes-v1.2.0/tasks.md
				$live_preview_enabled = isset( $settings['master']['live_preview'] ) 
					? (bool) $settings['master']['live_preview'] 
					: true;
				?>
				<input 
					type="checkbox" 
					id="mase-live-preview-toggle"
					name="mase_live_preview" 
					value="1"
					<?php checked( $live_preview_enabled, true ); ?>
					role="switch"
					aria-checked="<?php echo esc_attr( $live_preview_enabled ? 'true' : 'false' ); ?>"
					aria-label="<?php esc_attr_e( 'Toggle live preview mode', 'modern-admin-styler' ); ?>"
				/>
				<span class="dashicons dashicons-visibility" aria-hidden="true"></span>
				<span><?php esc_html_e( 'Live Preview', 'modern-admin-styler' ); ?></span>
			</label>
			<button type="button" id="mase-reset-all" class="button button-secondary" aria-label="<?php esc_attr_e( 'Reset all settings to default values', 'modern-admin-styler' ); ?>">
				<span class="dashicons dashicons-image-rotate" aria-hidden="true"></span>
				<span><?php esc_html_e( 'Reset All', 'modern-admin-styler' ); ?></span>
			</button>
			<button type="submit" form="mase-settings-form" id="mase-save-settings" class="button button-primary" aria-label="<?php esc_attr_e( 'Save all settings', 'modern-admin-styler' ); ?>">
				<span class="dashicons dashicons-saved" aria-hidden="true"></span>
				<span><?php esc_html_e( 'Save Settings', 'modern-admin-styler' ); ?></span>
			</button>
		</div>
	</div>

	<!-- Tab Navigation (Requirement 13.4: Keyboard accessible) -->
	<nav class="mase-tab-nav" role="tablist" aria-label="<?php esc_attr_e( 'Settings navigation', 'modern-admin-styler' ); ?>">
		<button type="button" class="mase-tab-button active" data-tab="general" role="tab" aria-selected="true" aria-controls="tab-general" id="tab-button-general" tabindex="0">
			<span class="dashicons dashicons-admin-home" aria-hidden="true"></span>
			<span class="mase-tab-label"><?php esc_html_e( 'General', 'modern-admin-styler' ); ?></span>
		</button>
		<button type="button" class="mase-tab-button" data-tab="admin-bar" role="tab" aria-selected="false" aria-controls="tab-admin-bar" id="tab-button-admin-bar" tabindex="-1">
			<span class="dashicons dashicons-admin-generic" aria-hidden="true"></span>
			<span class="mase-tab-label"><?php esc_html_e( 'Admin Bar', 'modern-admin-styler' ); ?></span>
		</button>
		<button type="button" class="mase-tab-button" data-tab="menu" role="tab" aria-selected="false" aria-controls="tab-menu" id="tab-button-menu" tabindex="-1">
			<span class="dashicons dashicons-menu" aria-hidden="true"></span>
			<span class="mase-tab-label"><?php esc_html_e( 'Menu', 'modern-admin-styler' ); ?></span>
		</button>
		<button type="button" class="mase-tab-button" data-tab="content" role="tab" aria-selected="false" aria-controls="tab-content" id="tab-button-content" tabindex="-1">
			<span class="dashicons dashicons-layout" aria-hidden="true"></span>
			<span class="mase-tab-label"><?php esc_html_e( 'Content', 'modern-admin-styler' ); ?></span>
		</button>
		<button type="button" class="mase-tab-button" data-tab="typography" role="tab" aria-selected="false" aria-controls="tab-typography" id="tab-button-typography" tabindex="-1">
			<span class="dashicons dashicons-editor-textcolor" aria-hidden="true"></span>
			<span class="mase-tab-label"><?php esc_html_e( 'Typography', 'modern-admin-styler' ); ?></span>
		</button>
		<button type="button" class="mase-tab-button" data-tab="effects" role="tab" aria-selected="false" aria-controls="tab-effects" id="tab-button-effects" tabindex="-1">
			<span class="dashicons dashicons-art" aria-hidden="true"></span>
			<span class="mase-tab-label"><?php esc_html_e( 'Effects', 'modern-admin-styler' ); ?></span>
		</button>
		<button type="button" class="mase-tab-button" data-tab="templates" role="tab" aria-selected="false" aria-controls="tab-templates" id="tab-button-templates" tabindex="-1">
			<span class="dashicons dashicons-portfolio" aria-hidden="true"></span>
			<span class="mase-tab-label"><?php esc_html_e( 'Templates', 'modern-admin-styler' ); ?></span>
		</button>
		<button type="button" class="mase-tab-button" data-tab="advanced" role="tab" aria-selected="false" aria-controls="tab-advanced" id="tab-button-advanced" tabindex="-1">
			<span class="dashicons dashicons-admin-tools" aria-hidden="true"></span>
			<span class="mase-tab-label"><?php esc_html_e( 'Advanced', 'modern-admin-styler' ); ?></span>
		</button>
	</nav>

	<!-- Main Form -->
	<form id="mase-settings-form" method="post" action="" aria-label="<?php esc_attr_e( 'Modern Admin Styler settings form', 'modern-admin-styler' ); ?>">
		<?php wp_nonce_field( 'mase_save_settings', 'mase_nonce' ); ?>
		
		<!-- Tab Content Container -->
		<div class="mase-tab-content-wrapper" id="mase-main-content">
			
			<!-- ============================================ -->
			<!-- GENERAL TAB -->
			<!-- ============================================ -->
			<div class="mase-tab-content active" id="tab-general" data-tab-content="general" role="tabpanel" aria-labelledby="tab-button-general" tabindex="0">
				
				<!-- Color Palettes Section -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Color Palettes', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Choose from 10 professionally designed color schemes. Click to preview, Apply to activate.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<div class="mase-palette-grid" role="group" aria-label="<?php esc_attr_e( 'Color palettes', 'modern-admin-styler' ); ?>">
						<?php foreach ( $palettes as $palette_id => $palette ) : ?>
							<div class="mase-palette-card <?php echo ( $settings['palettes']['current'] === $palette_id ) ? 'active' : ''; ?>" data-palette="<?php echo esc_attr( $palette_id ); ?>" data-palette-id="<?php echo esc_attr( $palette_id ); ?>" role="button" tabindex="0" aria-label="<?php echo esc_attr( sprintf( __( 'Apply %s palette', 'modern-admin-styler' ), $palette['name'] ) ); ?>">
								<div class="mase-palette-preview" role="img" aria-label="<?php echo esc_attr( sprintf( __( 'Color preview for %s palette', 'modern-admin-styler' ), $palette['name'] ) ); ?>">
									<span class="mase-palette-color" style="background-color: <?php echo esc_attr( $palette['colors']['primary'] ); ?>" aria-label="<?php esc_attr_e( 'Primary color', 'modern-admin-styler' ); ?>"></span>
									<span class="mase-palette-color" style="background-color: <?php echo esc_attr( $palette['colors']['secondary'] ); ?>" aria-label="<?php esc_attr_e( 'Secondary color', 'modern-admin-styler' ); ?>"></span>
									<span class="mase-palette-color" style="background-color: <?php echo esc_attr( $palette['colors']['accent'] ); ?>" aria-label="<?php esc_attr_e( 'Accent color', 'modern-admin-styler' ); ?>"></span>
									<span class="mase-palette-color" style="background-color: <?php echo esc_attr( $palette['colors']['background'] ); ?>" aria-label="<?php esc_attr_e( 'Background color', 'modern-admin-styler' ); ?>"></span>
								</div>
								<div class="mase-palette-info">
									<h3 class="mase-palette-name"><?php echo esc_html( $palette['name'] ); ?></h3>
									<?php if ( $settings['palettes']['current'] === $palette_id ) : ?>
										<span class="mase-active-badge" role="status"><?php esc_html_e( 'Active', 'modern-admin-styler' ); ?></span>
									<?php endif; ?>
								</div>
								<div class="mase-palette-actions">
									<button type="button" class="button button-secondary mase-palette-preview-btn" data-palette-id="<?php echo esc_attr( $palette_id ); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'Preview %s palette', 'modern-admin-styler' ), $palette['name'] ) ); ?>">
										<?php esc_html_e( 'Preview', 'modern-admin-styler' ); ?>
									</button>
									<button type="button" class="button button-primary mase-palette-apply-btn" data-palette-id="<?php echo esc_attr( $palette_id ); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'Apply %s palette', 'modern-admin-styler' ), $palette['name'] ) ); ?>">
										<?php esc_html_e( 'Apply', 'modern-admin-styler' ); ?>
									</button>
								</div>
							</div>
						<?php endforeach; ?>
					</div>
				</div>

				<!-- Template Preview Section -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Quick Templates', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Preview of 3 popular templates. View all templates in the Templates tab.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<div class="mase-template-preview-grid">
						<?php
						$preview_templates = array_slice( $templates, 0, 3, true );
						foreach ( $preview_templates as $template_id => $template ) :
							?>
							<div class="mase-template-preview-card <?php echo ( $settings['templates']['current'] === $template_id ) ? 'active' : ''; ?>" data-template="<?php echo esc_attr( $template_id ); ?>" data-template-id="<?php echo esc_attr( $template_id ); ?>">
								<div class="mase-template-thumbnail">
									<?php if ( ! empty( $template['thumbnail'] ) ) : ?>
										<img src="<?php echo esc_attr( $template['thumbnail'] ); ?>" alt="<?php echo esc_attr( $template['name'] ); ?>" />
									<?php else : ?>
										<div class="mase-template-placeholder">
											<span class="dashicons dashicons-admin-appearance"></span>
										</div>
									<?php endif; ?>
									<?php if ( $settings['templates']['current'] === $template_id ) : ?>
										<span class="mase-active-badge"><?php esc_html_e( 'Active', 'modern-admin-styler' ); ?></span>
									<?php endif; ?>
								</div>
								<div class="mase-template-info">
									<h3><?php echo esc_html( $template['name'] ); ?></h3>
									<p class="description"><?php echo esc_html( $template['description'] ); ?></p>
								</div>
								<button type="button" class="button button-primary mase-template-apply-btn" data-template-id="<?php echo esc_attr( $template_id ); ?>">
									<?php esc_html_e( 'Apply Template', 'modern-admin-styler' ); ?>
								</button>
							</div>
						<?php endforeach; ?>
					</div>
					
					<div class="mase-view-all-templates">
						<button type="button" class="button button-secondary" data-switch-tab="templates">
							<?php esc_html_e( 'View All Templates', 'modern-admin-styler' ); ?>
							<span class="dashicons dashicons-arrow-right-alt2"></span>
						</button>
					</div>
				</div>

				<!-- Master Controls Section -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Master Controls', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Global settings that affect the entire admin interface.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="master-enable-plugin">
										<?php esc_html_e( 'Enable Plugin', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="master-enable-plugin"
											name="master[enabled]" 
											value="1"
											<?php checked( $settings['master']['enabled'] ?? true, true ); ?>
											aria-describedby="master-enable-plugin-desc"
											role="switch"
											aria-checked="<?php echo ( $settings['master']['enabled'] ?? true ) ? 'true' : 'false'; ?>"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="master-enable-plugin-desc"><?php esc_html_e( 'Turn off to temporarily disable all customizations without losing your settings.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="master-apply-to-login">
										<?php esc_html_e( 'Apply to Login Page', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="master-apply-to-login"
											name="master[apply_to_login]" 
											value="1"
											<?php checked( $settings['master']['apply_to_login'] ?? false, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['master']['apply_to_login'] ?? false ) ? 'true' : 'false'; ?>"
											aria-describedby="master-apply-to-login-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="master-apply-to-login-desc"><?php esc_html_e( 'Apply your color scheme to the WordPress login page.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="master-dark-mode">
										<?php esc_html_e( 'Dark Mode', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="master-dark-mode"
											name="master[dark_mode]" 
											value="1"
											<?php checked( $settings['master']['dark_mode'] ?? false, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['master']['dark_mode'] ?? false ) ? 'true' : 'false'; ?>"
											aria-describedby="master-dark-mode-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="master-dark-mode-desc"><?php esc_html_e( 'Enable dark mode for the admin interface.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
						</div>
					</div>
				</div>
				
			</div><!-- #tab-general -->


			<!-- ============================================ -->
			<!-- ADMIN BAR TAB -->
			<!-- ============================================ -->
			<div class="mase-tab-content" id="tab-admin-bar" data-tab-content="admin-bar" role="tabpanel" aria-labelledby="tab-button-admin-bar" tabindex="0">
				
				<!-- Admin Bar Colors -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Admin Bar Colors', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Customize the colors of the WordPress admin bar.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-bg-color">
										<?php esc_html_e( 'Background Color', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="text" 
										id="admin-bar-bg-color"
										name="admin_bar[bg_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['admin_bar']['bg_color'] ); ?>"
										data-default-color="#23282d"
									/>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-text-color">
										<?php esc_html_e( 'Text Color', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="text" 
										id="admin-bar-text-color"
										name="admin_bar[text_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['admin_bar']['text_color'] ); ?>"
										data-default-color="#ffffff"
									/>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-hover-color">
										<?php esc_html_e( 'Hover Color', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="text" 
										id="admin-bar-hover-color"
										name="admin_bar[hover_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['admin_bar']['hover_color'] ?? '#0073aa' ); ?>"
										data-default-color="#0073aa"
									/>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-height">
										<?php esc_html_e( 'Height (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="number" 
										id="admin-bar-height"
										name="admin_bar[height]" 
										class="small-text"
										value="<?php echo esc_attr( $settings['admin_bar']['height'] ); ?>"
										min="32"
										max="100"
										step="1"
									/>
									<p class="description"><?php esc_html_e( 'Default: 32px. Range: 32-100px.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Admin Bar Gradient Background (Requirements 5.1, 5.2, 5.3, 5.4, 5.5) -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Background Gradient', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Apply gradient backgrounds to the admin bar.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-bg-type">
										<?php esc_html_e( 'Background Type', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-bar-bg-type" name="admin_bar[bg_type]">
										<option value="solid" <?php selected( $settings['admin_bar']['bg_type'] ?? 'solid', 'solid' ); ?>>
											<?php esc_html_e( 'Solid Color', 'modern-admin-styler' ); ?>
										</option>
										<option value="gradient" <?php selected( $settings['admin_bar']['bg_type'] ?? 'solid', 'gradient' ); ?>>
											<?php esc_html_e( 'Gradient', 'modern-admin-styler' ); ?>
										</option>
									</select>
								</div>
							</div>
							
							<!-- Gradient Controls (shown when bg_type = gradient) -->
							<div class="mase-conditional-group" data-depends-on="admin-bar-bg-type" data-value="gradient" style="display: <?php echo ( isset( $settings['admin_bar']['bg_type'] ) && $settings['admin_bar']['bg_type'] === 'gradient' ) ? 'block' : 'none'; ?>;">
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-gradient-type">
											<?php esc_html_e( 'Gradient Type', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<select id="admin-bar-gradient-type" name="admin_bar[gradient_type]">
											<option value="linear" <?php selected( $settings['admin_bar']['gradient_type'] ?? 'linear', 'linear' ); ?>>
												<?php esc_html_e( 'Linear', 'modern-admin-styler' ); ?>
											</option>
											<option value="radial" <?php selected( $settings['admin_bar']['gradient_type'] ?? 'linear', 'radial' ); ?>>
												<?php esc_html_e( 'Radial', 'modern-admin-styler' ); ?>
											</option>
											<option value="conic" <?php selected( $settings['admin_bar']['gradient_type'] ?? 'linear', 'conic' ); ?>>
												<?php esc_html_e( 'Conic', 'modern-admin-styler' ); ?>
											</option>
										</select>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-gradient-angle">
											<?php esc_html_e( 'Angle (degrees)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-gradient-angle"
											name="admin_bar[gradient_angle]" 
											min="0"
											max="360"
											step="1"
											value="<?php echo esc_attr( $settings['admin_bar']['gradient_angle'] ?? 90 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['gradient_angle'] ?? 90 ); ?>°</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-gradient-color-1">
											<?php esc_html_e( 'Color Stop 1', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="text" 
											id="admin-bar-gradient-color-1"
											name="admin_bar[gradient_colors][0][color]" 
											class="mase-color-picker"
											value="<?php echo esc_attr( $settings['admin_bar']['gradient_colors'][0]['color'] ?? '#23282d' ); ?>"
											data-default-color="#23282d"
										/>
										<input 
											type="hidden" 
											name="admin_bar[gradient_colors][0][position]" 
											value="0"
										/>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-gradient-color-2">
											<?php esc_html_e( 'Color Stop 2', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="text" 
											id="admin-bar-gradient-color-2"
											name="admin_bar[gradient_colors][1][color]" 
											class="mase-color-picker"
											value="<?php echo esc_attr( $settings['admin_bar']['gradient_colors'][1]['color'] ?? '#32373c' ); ?>"
											data-default-color="#32373c"
										/>
										<input 
											type="hidden" 
											name="admin_bar[gradient_colors][1][position]" 
											value="100"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Admin Bar Typography -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Admin Bar Typography', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Customize the typography of the admin bar.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-font-size">
										<?php esc_html_e( 'Font Size (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="number" 
										id="admin-bar-font-size"
										name="typography[admin_bar][font_size]" 
										class="small-text"
										value="<?php echo esc_attr( $settings['typography']['admin_bar']['font_size'] ); ?>"
										min="10"
										max="24"
										step="1"
									/>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-font-weight">
										<?php esc_html_e( 'Font Weight', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-bar-font-weight" name="typography[admin_bar][font_weight]">
										<option value="300" <?php selected( $settings['typography']['admin_bar']['font_weight'], 300 ); ?>>300 (Light)</option>
										<option value="400" <?php selected( $settings['typography']['admin_bar']['font_weight'], 400 ); ?>>400 (Normal)</option>
										<option value="500" <?php selected( $settings['typography']['admin_bar']['font_weight'], 500 ); ?>>500 (Medium)</option>
										<option value="600" <?php selected( $settings['typography']['admin_bar']['font_weight'], 600 ); ?>>600 (Semi-Bold)</option>
										<option value="700" <?php selected( $settings['typography']['admin_bar']['font_weight'], 700 ); ?>>700 (Bold)</option>
									</select>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-line-height">
										<?php esc_html_e( 'Line Height', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-bar-line-height"
										name="typography[admin_bar][line_height]" 
										value="<?php echo esc_attr( $settings['typography']['admin_bar']['line_height'] ); ?>"
										min="1.0"
										max="2.0"
										step="0.1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['typography']['admin_bar']['line_height'] ); ?></span>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-letter-spacing">
										<?php esc_html_e( 'Letter Spacing (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-bar-letter-spacing"
										name="typography[admin_bar][letter_spacing]" 
										value="<?php echo esc_attr( $settings['typography']['admin_bar']['letter_spacing'] ?? 0 ); ?>"
										min="-2"
										max="5"
										step="0.5"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['typography']['admin_bar']['letter_spacing'] ?? 0 ); ?>px</span>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-text-transform">
										<?php esc_html_e( 'Text Transform', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-bar-text-transform" name="typography[admin_bar][text_transform]">
										<option value="none" <?php selected( $settings['typography']['admin_bar']['text_transform'] ?? 'none', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
										<option value="uppercase" <?php selected( $settings['typography']['admin_bar']['text_transform'] ?? 'none', 'uppercase' ); ?>><?php esc_html_e( 'Uppercase', 'modern-admin-styler' ); ?></option>
										<option value="lowercase" <?php selected( $settings['typography']['admin_bar']['text_transform'] ?? 'none', 'lowercase' ); ?>><?php esc_html_e( 'Lowercase', 'modern-admin-styler' ); ?></option>
										<option value="capitalize" <?php selected( $settings['typography']['admin_bar']['text_transform'] ?? 'none', 'capitalize' ); ?>><?php esc_html_e( 'Capitalize', 'modern-admin-styler' ); ?></option>
									</select>
								</div>
							</div>
							
							<!-- NEW: Font Family Selector (Requirement 8.1, 8.4) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-font-family">
										<?php esc_html_e( 'Font Family', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-bar-font-family" name="typography[admin_bar][font_family]">
										<optgroup label="<?php esc_attr_e( 'System Fonts', 'modern-admin-styler' ); ?>">
											<option value="system" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'system' ); ?>><?php esc_html_e( 'System Default', 'modern-admin-styler' ); ?></option>
											<option value="Arial, sans-serif" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'Arial, sans-serif' ); ?>>Arial</option>
											<option value="Helvetica, sans-serif" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'Helvetica, sans-serif' ); ?>>Helvetica</option>
											<option value="Georgia, serif" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'Georgia, serif' ); ?>>Georgia</option>
											<option value="'Courier New', monospace" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', "'Courier New', monospace" ); ?>>Courier New</option>
											<option value="'Times New Roman', serif" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', "'Times New Roman', serif" ); ?>>Times New Roman</option>
										</optgroup>
										<optgroup label="<?php esc_attr_e( 'Google Fonts', 'modern-admin-styler' ); ?>">
											<option value="google:Roboto" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'google:Roboto' ); ?>>Roboto</option>
											<option value="google:Open Sans" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'google:Open Sans' ); ?>>Open Sans</option>
											<option value="google:Lato" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'google:Lato' ); ?>>Lato</option>
											<option value="google:Montserrat" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'google:Montserrat' ); ?>>Montserrat</option>
											<option value="google:Poppins" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'google:Poppins' ); ?>>Poppins</option>
											<option value="google:Inter" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'google:Inter' ); ?>>Inter</option>
											<option value="google:Raleway" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'google:Raleway' ); ?>>Raleway</option>
											<option value="google:Source Sans Pro" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'google:Source Sans Pro' ); ?>>Source Sans Pro</option>
											<option value="google:Nunito" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'google:Nunito' ); ?>>Nunito</option>
											<option value="google:Ubuntu" <?php selected( $settings['typography']['admin_bar']['font_family'] ?? 'system', 'google:Ubuntu' ); ?>>Ubuntu</option>
										</optgroup>
									</select>
									<input type="hidden" id="admin-bar-google-font-url" name="typography[admin_bar][google_font_url]" value="<?php echo esc_attr( $settings['typography']['admin_bar']['google_font_url'] ?? '' ); ?>" />
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Admin Bar Visual Effects -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Admin Bar Visual Effects', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Apply modern visual effects to the admin bar.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-glassmorphism">
										<?php esc_html_e( 'Glassmorphism', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="admin-bar-glassmorphism"
											name="visual_effects[admin_bar][glassmorphism]" 
											value="1"
											<?php checked( $settings['visual_effects']['admin_bar']['glassmorphism'] ?? false, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['visual_effects']['admin_bar']['glassmorphism'] ?? false ) ? 'true' : 'false'; ?>"
											aria-describedby="admin-bar-glassmorphism-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="admin-bar-glassmorphism-desc"><?php esc_html_e( 'Apply frosted glass effect with backdrop blur.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-bar-glassmorphism">
								<div class="mase-setting-label">
									<label for="admin-bar-blur-intensity">
										<?php esc_html_e( 'Blur Intensity (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-bar-blur-intensity"
										name="visual_effects[admin_bar][blur_intensity]" 
										value="<?php echo esc_attr( $settings['visual_effects']['admin_bar']['blur_intensity'] ?? 20 ); ?>"
										min="0"
										max="50"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['admin_bar']['blur_intensity'] ?? 20 ); ?>px</span>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-floating">
										<?php esc_html_e( 'Floating Effect', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="admin-bar-floating"
											name="visual_effects[admin_bar][floating]" 
											value="1"
											<?php checked( $settings['visual_effects']['admin_bar']['floating'] ?? false, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['visual_effects']['admin_bar']['floating'] ?? false ) ? 'true' : 'false'; ?>"
											aria-describedby="admin-bar-floating-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="admin-bar-floating-desc"><?php esc_html_e( 'Add margin to create floating appearance.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-bar-floating">
								<div class="mase-setting-label">
									<label for="admin-bar-floating-margin">
										<?php esc_html_e( 'Floating Margin (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-bar-floating-margin"
										name="visual_effects[admin_bar][floating_margin]" 
										value="<?php echo esc_attr( $settings['visual_effects']['admin_bar']['floating_margin'] ?? 8 ); ?>"
										min="0"
										max="20"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['admin_bar']['floating_margin'] ?? 8 ); ?>px</span>
								</div>
							</div>
							
							<!-- Individual Corner Radius Controls (Requirements 9.1, 9.2, 9.3) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-border-radius-mode">
										<?php esc_html_e( 'Border Radius Mode', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-bar-border-radius-mode" name="admin_bar[border_radius_mode]">
										<option value="uniform" <?php selected( $settings['admin_bar']['border_radius_mode'] ?? 'uniform', 'uniform' ); ?>><?php esc_html_e( 'Uniform', 'modern-admin-styler' ); ?></option>
										<option value="individual" <?php selected( $settings['admin_bar']['border_radius_mode'] ?? 'uniform', 'individual' ); ?>><?php esc_html_e( 'Individual Corners', 'modern-admin-styler' ); ?></option>
									</select>
									<p class="description"><?php esc_html_e( 'Choose between uniform radius for all corners or individual control.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-bar-border-radius-mode" data-value="uniform">
								<div class="mase-setting-label">
									<label for="admin-bar-border-radius">
										<?php esc_html_e( 'All Corners (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-bar-border-radius"
										name="admin_bar[border_radius]" 
										value="<?php echo esc_attr( $settings['admin_bar']['border_radius'] ?? 0 ); ?>"
										min="0"
										max="50"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['border_radius'] ?? 0 ); ?>px</span>
								</div>
							</div>
							
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-bar-border-radius-mode" data-value="individual">
								<div class="mase-setting-label">
									<label for="admin-bar-border-radius-tl">
										<?php esc_html_e( 'Top Left (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-bar-border-radius-tl"
										name="admin_bar[border_radius_tl]" 
										value="<?php echo esc_attr( $settings['admin_bar']['border_radius_tl'] ?? 0 ); ?>"
										min="0"
										max="50"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['border_radius_tl'] ?? 0 ); ?>px</span>
								</div>
							</div>
							
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-bar-border-radius-mode" data-value="individual">
								<div class="mase-setting-label">
									<label for="admin-bar-border-radius-tr">
										<?php esc_html_e( 'Top Right (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-bar-border-radius-tr"
										name="admin_bar[border_radius_tr]" 
										value="<?php echo esc_attr( $settings['admin_bar']['border_radius_tr'] ?? 0 ); ?>"
										min="0"
										max="50"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['border_radius_tr'] ?? 0 ); ?>px</span>
								</div>
							</div>
							
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-bar-border-radius-mode" data-value="individual">
								<div class="mase-setting-label">
									<label for="admin-bar-border-radius-bl">
										<?php esc_html_e( 'Bottom Left (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-bar-border-radius-bl"
										name="admin_bar[border_radius_bl]" 
										value="<?php echo esc_attr( $settings['admin_bar']['border_radius_bl'] ?? 0 ); ?>"
										min="0"
										max="50"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['border_radius_bl'] ?? 0 ); ?>px</span>
								</div>
							</div>
							
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-bar-border-radius-mode" data-value="individual">
								<div class="mase-setting-label">
									<label for="admin-bar-border-radius-br">
										<?php esc_html_e( 'Bottom Right (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-bar-border-radius-br"
										name="admin_bar[border_radius_br]" 
										value="<?php echo esc_attr( $settings['admin_bar']['border_radius_br'] ?? 0 ); ?>"
										min="0"
										max="50"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['border_radius_br'] ?? 0 ); ?>px</span>
								</div>
							</div>
							
							<!-- Advanced Shadow Controls (Requirements 10.1, 10.2, 10.3, 10.4) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-shadow-mode">
										<?php esc_html_e( 'Shadow Mode', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-bar-shadow-mode" name="admin_bar[shadow_mode]">
										<option value="preset" <?php selected( $settings['admin_bar']['shadow_mode'] ?? 'preset', 'preset' ); ?>><?php esc_html_e( 'Preset', 'modern-admin-styler' ); ?></option>
										<option value="custom" <?php selected( $settings['admin_bar']['shadow_mode'] ?? 'preset', 'custom' ); ?>><?php esc_html_e( 'Custom', 'modern-admin-styler' ); ?></option>
									</select>
								</div>
							</div>

							<!-- Preset Shadow Controls (Requirement 10.1) -->
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-bar-shadow-mode" data-value="preset">
								<div class="mase-setting-label">
									<label for="admin-bar-shadow-preset">
										<?php esc_html_e( 'Shadow Preset', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-bar-shadow-preset" name="admin_bar[shadow_preset]">
										<option value="none" <?php selected( $settings['admin_bar']['shadow_preset'] ?? 'none', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
										<option value="subtle" <?php selected( $settings['admin_bar']['shadow_preset'] ?? 'none', 'subtle' ); ?>><?php esc_html_e( 'Subtle', 'modern-admin-styler' ); ?></option>
										<option value="medium" <?php selected( $settings['admin_bar']['shadow_preset'] ?? 'none', 'medium' ); ?>><?php esc_html_e( 'Medium', 'modern-admin-styler' ); ?></option>
										<option value="strong" <?php selected( $settings['admin_bar']['shadow_preset'] ?? 'none', 'strong' ); ?>><?php esc_html_e( 'Strong', 'modern-admin-styler' ); ?></option>
										<option value="dramatic" <?php selected( $settings['admin_bar']['shadow_preset'] ?? 'none', 'dramatic' ); ?>><?php esc_html_e( 'Dramatic', 'modern-admin-styler' ); ?></option>
									</select>
								</div>
							</div>

							<!-- Custom Shadow Controls (Requirements 10.2, 10.3, 10.4) -->
							<div class="mase-conditional" data-depends-on="admin-bar-shadow-mode" data-value="custom">
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-shadow-h-offset">
											<?php esc_html_e( 'Horizontal Offset (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-shadow-h-offset"
											name="admin_bar[shadow_h_offset]"
											value="<?php echo esc_attr( $settings['admin_bar']['shadow_h_offset'] ?? 0 ); ?>"
											min="-50"
											max="50"
											step="1"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['shadow_h_offset'] ?? 0 ); ?>px</span>
									</div>
								</div>

								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-shadow-v-offset">
											<?php esc_html_e( 'Vertical Offset (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-shadow-v-offset"
											name="admin_bar[shadow_v_offset]"
											value="<?php echo esc_attr( $settings['admin_bar']['shadow_v_offset'] ?? 4 ); ?>"
											min="-50"
											max="50"
											step="1"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['shadow_v_offset'] ?? 4 ); ?>px</span>
									</div>
								</div>

								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-shadow-blur">
											<?php esc_html_e( 'Blur Radius (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-shadow-blur"
											name="admin_bar[shadow_blur]"
											value="<?php echo esc_attr( $settings['admin_bar']['shadow_blur'] ?? 8 ); ?>"
											min="0"
											max="100"
											step="1"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['shadow_blur'] ?? 8 ); ?>px</span>
									</div>
								</div>

								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-shadow-spread">
											<?php esc_html_e( 'Spread Radius (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-shadow-spread"
											name="admin_bar[shadow_spread]"
											value="<?php echo esc_attr( $settings['admin_bar']['shadow_spread'] ?? 0 ); ?>"
											min="-50"
											max="50"
											step="1"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['shadow_spread'] ?? 0 ); ?>px</span>
									</div>
								</div>

								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-shadow-color">
											<?php esc_html_e( 'Shadow Color', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="text" 
											id="admin-bar-shadow-color"
											class="mase-color-picker"
											name="admin_bar[shadow_color]"
											value="<?php echo esc_attr( $settings['admin_bar']['shadow_color'] ?? '#000000' ); ?>"
										/>
									</div>
								</div>

								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-shadow-opacity">
											<?php esc_html_e( 'Shadow Opacity', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-shadow-opacity"
											name="admin_bar[shadow_opacity]"
											value="<?php echo esc_attr( $settings['admin_bar']['shadow_opacity'] ?? 0.15 ); ?>"
											min="0"
											max="1"
											step="0.05"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['shadow_opacity'] ?? 0.15 ); ?></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Admin Bar Width Controls (Requirements 11.1, 11.2, 11.3) -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Width Controls', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Control the width of the admin bar in pixels or percentage.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-width-unit">
										<?php esc_html_e( 'Width Unit', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-bar-width-unit" name="admin_bar[width_unit]">
										<option value="percent" <?php selected( $settings['admin_bar']['width_unit'] ?? 'percent', 'percent' ); ?>>
											<?php esc_html_e( 'Percentage (%)', 'modern-admin-styler' ); ?>
										</option>
										<option value="pixels" <?php selected( $settings['admin_bar']['width_unit'] ?? 'percent', 'pixels' ); ?>>
											<?php esc_html_e( 'Pixels (px)', 'modern-admin-styler' ); ?>
										</option>
									</select>
									<p class="description"><?php esc_html_e( 'Choose between percentage or pixel-based width.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Percentage Width Control (shown when width_unit = percent) -->
							<div class="mase-conditional-group" data-depends-on="admin-bar-width-unit" data-value="percent" style="display: <?php echo ( ! isset( $settings['admin_bar']['width_unit'] ) || $settings['admin_bar']['width_unit'] === 'percent' ) ? 'block' : 'none'; ?>;">
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-width-value-percent">
											<?php esc_html_e( 'Width (%)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-width-value-percent"
											name="admin_bar[width_value]" 
											min="50"
											max="100"
											step="1"
											value="<?php echo esc_attr( $settings['admin_bar']['width_value'] ?? 100 ); ?>"
											data-unit="percent"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['width_value'] ?? 100 ); ?>%</span>
										<p class="description"><?php esc_html_e( 'Range: 50-100%. Admin bar will be centered if less than 100%.', 'modern-admin-styler' ); ?></p>
									</div>
								</div>
							</div>
							
							<!-- Pixel Width Control (shown when width_unit = pixels) -->
							<div class="mase-conditional-group" data-depends-on="admin-bar-width-unit" data-value="pixels" style="display: <?php echo ( isset( $settings['admin_bar']['width_unit'] ) && $settings['admin_bar']['width_unit'] === 'pixels' ) ? 'block' : 'none'; ?>;">
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-width-value-pixels">
											<?php esc_html_e( 'Width (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-width-value-pixels"
											name="admin_bar[width_value]" 
											min="800"
											max="3000"
											step="10"
											value="<?php echo esc_attr( $settings['admin_bar']['width_value'] ?? 1920 ); ?>"
											data-unit="pixels"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['width_value'] ?? 1920 ); ?>px</span>
										<p class="description"><?php esc_html_e( 'Range: 800-3000px. Admin bar will be centered.', 'modern-admin-styler' ); ?></p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Individual Floating Margin Controls (Requirements 12.1, 12.2, 12.3) -->
				<div class="mase-section mase-conditional" data-depends-on="admin-bar-floating">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Floating Margins', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Control the margins around the floating admin bar. Only visible when floating mode is enabled.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-floating-margin-mode">
										<?php esc_html_e( 'Margin Mode', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-bar-floating-margin-mode" name="admin_bar[floating_margin_mode]">
										<option value="uniform" <?php selected( $settings['admin_bar']['floating_margin_mode'] ?? 'uniform', 'uniform' ); ?>>
											<?php esc_html_e( 'Uniform', 'modern-admin-styler' ); ?>
										</option>
										<option value="individual" <?php selected( $settings['admin_bar']['floating_margin_mode'] ?? 'uniform', 'individual' ); ?>>
											<?php esc_html_e( 'Individual Sides', 'modern-admin-styler' ); ?>
										</option>
									</select>
									<p class="description"><?php esc_html_e( 'Choose between uniform margin for all sides or individual control.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Uniform Margin Control (shown when floating_margin_mode = uniform) -->
							<div class="mase-conditional-group" data-depends-on="admin-bar-floating-margin-mode" data-value="uniform" style="display: <?php echo ( ! isset( $settings['admin_bar']['floating_margin_mode'] ) || $settings['admin_bar']['floating_margin_mode'] === 'uniform' ) ? 'block' : 'none'; ?>;">
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-floating-margin-uniform">
											<?php esc_html_e( 'All Sides (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-floating-margin-uniform"
											name="admin_bar[floating_margin]" 
											min="0"
											max="100"
											step="1"
											value="<?php echo esc_attr( $settings['admin_bar']['floating_margin'] ?? 8 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['floating_margin'] ?? 8 ); ?>px</span>
										<p class="description"><?php esc_html_e( 'Apply the same margin to all sides.', 'modern-admin-styler' ); ?></p>
									</div>
								</div>
							</div>
							
							<!-- Individual Margin Controls (shown when floating_margin_mode = individual) -->
							<div class="mase-conditional-group" data-depends-on="admin-bar-floating-margin-mode" data-value="individual" style="display: <?php echo ( isset( $settings['admin_bar']['floating_margin_mode'] ) && $settings['admin_bar']['floating_margin_mode'] === 'individual' ) ? 'block' : 'none'; ?>;">
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-floating-margin-top">
											<?php esc_html_e( 'Top (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-floating-margin-top"
											name="admin_bar[floating_margin_top]" 
											min="0"
											max="100"
											step="1"
											value="<?php echo esc_attr( $settings['admin_bar']['floating_margin_top'] ?? 8 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['floating_margin_top'] ?? 8 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-floating-margin-right">
											<?php esc_html_e( 'Right (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-floating-margin-right"
											name="admin_bar[floating_margin_right]" 
											min="0"
											max="100"
											step="1"
											value="<?php echo esc_attr( $settings['admin_bar']['floating_margin_right'] ?? 8 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['floating_margin_right'] ?? 8 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-floating-margin-bottom">
											<?php esc_html_e( 'Bottom (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-floating-margin-bottom"
											name="admin_bar[floating_margin_bottom]" 
											min="0"
											max="100"
											step="1"
											value="<?php echo esc_attr( $settings['admin_bar']['floating_margin_bottom'] ?? 8 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['floating_margin_bottom'] ?? 8 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-bar-floating-margin-left">
											<?php esc_html_e( 'Left (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-bar-floating-margin-left"
											name="admin_bar[floating_margin_left]" 
											min="0"
											max="100"
											step="1"
											value="<?php echo esc_attr( $settings['admin_bar']['floating_margin_left'] ?? 8 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar']['floating_margin_left'] ?? 8 ); ?>px</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Admin Bar Submenu Styling (Requirements 6.1, 6.2, 6.3) -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Submenu Styling', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Customize the appearance of admin bar dropdown submenus.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-submenu-bg-color">
										<?php esc_html_e( 'Background Color', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="text" 
										id="admin-bar-submenu-bg-color"
										name="admin_bar_submenu[bg_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['admin_bar_submenu']['bg_color'] ?? '#32373c' ); ?>"
										data-default-color="#32373c"
									/>
									<p class="description"><?php esc_html_e( 'Background color for submenu dropdowns.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-submenu-border-radius">
										<?php esc_html_e( 'Border Radius (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-bar-submenu-border-radius"
										name="admin_bar_submenu[border_radius]" 
										value="<?php echo esc_attr( $settings['admin_bar_submenu']['border_radius'] ?? 0 ); ?>"
										min="0"
										max="20"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar_submenu']['border_radius'] ?? 0 ); ?>px</span>
									<p class="description"><?php esc_html_e( 'Rounded corners for submenu dropdowns.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-submenu-spacing">
										<?php esc_html_e( 'Spacing from Admin Bar (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-bar-submenu-spacing"
										name="admin_bar_submenu[spacing]" 
										value="<?php echo esc_attr( $settings['admin_bar_submenu']['spacing'] ?? 0 ); ?>"
										min="0"
										max="50"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_bar_submenu']['spacing'] ?? 0 ); ?>px</span>
									<p class="description"><?php esc_html_e( 'Vertical distance between admin bar and submenu.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- NEW: Submenu Font Family Selector (Requirement 8.1, 8.4) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-submenu-font-family">
										<?php esc_html_e( 'Font Family', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-bar-submenu-font-family" name="admin_bar_submenu[font_family]">
										<optgroup label="<?php esc_attr_e( 'System Fonts', 'modern-admin-styler' ); ?>">
											<option value="system" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'system' ); ?>><?php esc_html_e( 'System Default', 'modern-admin-styler' ); ?></option>
											<option value="Arial, sans-serif" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'Arial, sans-serif' ); ?>>Arial</option>
											<option value="Helvetica, sans-serif" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'Helvetica, sans-serif' ); ?>>Helvetica</option>
											<option value="Georgia, serif" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'Georgia, serif' ); ?>>Georgia</option>
											<option value="'Courier New', monospace" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', "'Courier New', monospace" ); ?>>Courier New</option>
											<option value="'Times New Roman', serif" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', "'Times New Roman', serif" ); ?>>Times New Roman</option>
										</optgroup>
										<optgroup label="<?php esc_attr_e( 'Google Fonts', 'modern-admin-styler' ); ?>">
											<option value="google:Roboto" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'google:Roboto' ); ?>>Roboto</option>
											<option value="google:Open Sans" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'google:Open Sans' ); ?>>Open Sans</option>
											<option value="google:Lato" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'google:Lato' ); ?>>Lato</option>
											<option value="google:Montserrat" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'google:Montserrat' ); ?>>Montserrat</option>
											<option value="google:Poppins" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'google:Poppins' ); ?>>Poppins</option>
											<option value="google:Inter" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'google:Inter' ); ?>>Inter</option>
											<option value="google:Raleway" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'google:Raleway' ); ?>>Raleway</option>
											<option value="google:Source Sans Pro" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'google:Source Sans Pro' ); ?>>Source Sans Pro</option>
											<option value="google:Nunito" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'google:Nunito' ); ?>>Nunito</option>
											<option value="google:Ubuntu" <?php selected( $settings['admin_bar_submenu']['font_family'] ?? 'system', 'google:Ubuntu' ); ?>>Ubuntu</option>
										</optgroup>
									</select>
									<p class="description"><?php esc_html_e( 'Font family for submenu text.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
						</div>
					</div>
				</div>
				
			</div><!-- #tab-admin-bar -->


			<!-- ============================================ -->
			<!-- MENU TAB -->
			<!-- ============================================ -->
			<div class="mase-tab-content" id="tab-menu" data-tab-content="menu" role="tabpanel" aria-labelledby="tab-button-menu" tabindex="0">
				
				<!-- Menu Colors -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Menu Colors', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Customize the colors of the admin menu.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-bg-color">
										<?php esc_html_e( 'Background Color', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="text" 
										id="admin-menu-bg-color"
										name="admin_menu[bg_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['admin_menu']['bg_color'] ); ?>"
										data-default-color="#23282d"
									/>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-text-color">
										<?php esc_html_e( 'Text Color', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="text" 
										id="admin-menu-text-color"
										name="admin_menu[text_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['admin_menu']['text_color'] ); ?>"
										data-default-color="#ffffff"
									/>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-hover-bg-color">
										<?php esc_html_e( 'Hover Background Color', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="text" 
										id="admin-menu-hover-bg-color"
										name="admin_menu[hover_bg_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['admin_menu']['hover_bg_color'] ); ?>"
										data-default-color="#0073aa"
									/>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-hover-text-color">
										<?php esc_html_e( 'Hover Text Color', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="text" 
										id="admin-menu-hover-text-color"
										name="admin_menu[hover_text_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['admin_menu']['hover_text_color'] ); ?>"
										data-default-color="#ffffff"
									/>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-width">
										<?php esc_html_e( 'Width', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<div class="mase-control-group">
										<select id="admin-menu-width-unit" name="admin_menu[width_unit]" class="mase-unit-toggle">
											<option value="pixels" <?php selected( $settings['admin_menu']['width_unit'] ?? 'pixels', 'pixels' ); ?>>
												<?php esc_html_e( 'Pixels', 'modern-admin-styler' ); ?>
											</option>
											<option value="percent" <?php selected( $settings['admin_menu']['width_unit'] ?? 'pixels', 'percent' ); ?>>
												<?php esc_html_e( 'Percentage', 'modern-admin-styler' ); ?>
											</option>
										</select>
										<input 
											type="number" 
											id="admin-menu-width"
											name="admin_menu[width_value]" 
											class="small-text"
											value="<?php echo esc_attr( $settings['admin_menu']['width_value'] ?? $settings['admin_menu']['width'] ?? 160 ); ?>"
											min="<?php echo ( isset( $settings['admin_menu']['width_unit'] ) && $settings['admin_menu']['width_unit'] === 'percent' ) ? '50' : '160'; ?>"
											max="<?php echo ( isset( $settings['admin_menu']['width_unit'] ) && $settings['admin_menu']['width_unit'] === 'percent' ) ? '100' : '400'; ?>"
											step="1"
											data-min-pixels="160"
											data-max-pixels="400"
											data-min-percent="50"
											data-max-percent="100"
										/>
										<span class="mase-unit-label">
											<?php echo ( isset( $settings['admin_menu']['width_unit'] ) && $settings['admin_menu']['width_unit'] === 'percent' ) ? '%' : 'px'; ?>
										</span>
									</div>
									<p class="description">
										<span class="mase-width-desc-pixels" style="display: <?php echo ( ! isset( $settings['admin_menu']['width_unit'] ) || $settings['admin_menu']['width_unit'] === 'pixels' ) ? 'inline' : 'none'; ?>;">
											<?php esc_html_e( 'Default: 160px. Range: 160-400px.', 'modern-admin-styler' ); ?>
										</span>
										<span class="mase-width-desc-percent" style="display: <?php echo ( isset( $settings['admin_menu']['width_unit'] ) && $settings['admin_menu']['width_unit'] === 'percent' ) ? 'inline' : 'none'; ?>;">
											<?php esc_html_e( 'Default: 100%. Range: 50-100%.', 'modern-admin-styler' ); ?>
										</span>
									</p>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-height-mode">
										<?php esc_html_e( 'Height Mode', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-height-mode" name="admin_menu[height_mode]">
										<option value="full" <?php selected( $settings['admin_menu']['height_mode'] ?? 'full', 'full' ); ?>><?php esc_html_e( 'Full Height (100%)', 'modern-admin-styler' ); ?></option>
										<option value="content" <?php selected( $settings['admin_menu']['height_mode'] ?? 'full', 'content' ); ?>><?php esc_html_e( 'Fit to Content', 'modern-admin-styler' ); ?></option>
									</select>
									<p class="description"><?php esc_html_e( 'Full Height: Menu spans entire viewport. Fit to Content: Menu height adjusts to menu items.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Menu Gradient Background (Requirements 6.1, 6.2, 6.4) -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Background Gradient', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Apply gradient backgrounds to the admin menu.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-bg-type">
										<?php esc_html_e( 'Background Type', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-bg-type" name="admin_menu[bg_type]">
										<option value="solid" <?php selected( $settings['admin_menu']['bg_type'] ?? 'solid', 'solid' ); ?>>
											<?php esc_html_e( 'Solid Color', 'modern-admin-styler' ); ?>
										</option>
										<option value="gradient" <?php selected( $settings['admin_menu']['bg_type'] ?? 'solid', 'gradient' ); ?>>
											<?php esc_html_e( 'Gradient', 'modern-admin-styler' ); ?>
										</option>
									</select>
								</div>
							</div>
							
							<!-- Gradient Controls (shown when bg_type = gradient) -->
							<div class="mase-conditional-group" data-depends-on="admin-menu-bg-type" data-value="gradient" style="display: <?php echo ( isset( $settings['admin_menu']['bg_type'] ) && $settings['admin_menu']['bg_type'] === 'gradient' ) ? 'block' : 'none'; ?>;">
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-gradient-type">
											<?php esc_html_e( 'Gradient Type', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<select id="admin-menu-gradient-type" name="admin_menu[gradient_type]">
											<option value="linear" <?php selected( $settings['admin_menu']['gradient_type'] ?? 'linear', 'linear' ); ?>>
												<?php esc_html_e( 'Linear', 'modern-admin-styler' ); ?>
											</option>
											<option value="radial" <?php selected( $settings['admin_menu']['gradient_type'] ?? 'linear', 'radial' ); ?>>
												<?php esc_html_e( 'Radial', 'modern-admin-styler' ); ?>
											</option>
											<option value="conic" <?php selected( $settings['admin_menu']['gradient_type'] ?? 'linear', 'conic' ); ?>>
												<?php esc_html_e( 'Conic', 'modern-admin-styler' ); ?>
											</option>
										</select>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-gradient-angle">
											<?php esc_html_e( 'Angle (degrees)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-gradient-angle"
											name="admin_menu[gradient_angle]" 
											min="0"
											max="360"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu']['gradient_angle'] ?? 90 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['gradient_angle'] ?? 90 ); ?>°</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-gradient-color-1">
											<?php esc_html_e( 'Color Stop 1', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="text" 
											id="admin-menu-gradient-color-1"
											name="admin_menu[gradient_colors][0][color]" 
											class="mase-color-picker"
											value="<?php echo esc_attr( $settings['admin_menu']['gradient_colors'][0]['color'] ?? '#23282d' ); ?>"
											data-default-color="#23282d"
										/>
										<input 
											type="hidden" 
											name="admin_menu[gradient_colors][0][position]" 
											value="0"
										/>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-gradient-color-2">
											<?php esc_html_e( 'Color Stop 2', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="text" 
											id="admin-menu-gradient-color-2"
											name="admin_menu[gradient_colors][1][color]" 
											class="mase-color-picker"
											value="<?php echo esc_attr( $settings['admin_menu']['gradient_colors'][1]['color'] ?? '#32373c' ); ?>"
											data-default-color="#32373c"
										/>
										<input 
											type="hidden" 
											name="admin_menu[gradient_colors][1][position]" 
											value="100"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Icon Color Synchronization (Requirement 2.3) -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Icon Color', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Control how menu icons are colored. Auto mode syncs with text color, custom mode allows independent icon color.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-icon-color-mode">
										<?php esc_html_e( 'Icon Color Mode', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-icon-color-mode" name="admin_menu[icon_color_mode]">
										<option value="auto" <?php selected( $settings['admin_menu']['icon_color_mode'] ?? 'auto', 'auto' ); ?>><?php esc_html_e( 'Auto (Sync with Text Color)', 'modern-admin-styler' ); ?></option>
										<option value="custom" <?php selected( $settings['admin_menu']['icon_color_mode'] ?? 'auto', 'custom' ); ?>><?php esc_html_e( 'Custom', 'modern-admin-styler' ); ?></option>
									</select>
									<p class="description"><?php esc_html_e( 'Auto mode automatically matches icon color to text color. Custom mode allows independent icon color selection.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Custom Icon Color (shown when icon_color_mode = custom) -->
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-menu-icon-color-mode" data-value="custom" style="display: <?php echo ( isset( $settings['admin_menu']['icon_color_mode'] ) && $settings['admin_menu']['icon_color_mode'] === 'custom' ) ? 'block' : 'none'; ?>;">
								<div class="mase-setting-label">
									<label for="admin-menu-icon-color">
										<?php esc_html_e( 'Custom Icon Color', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="text" 
										id="admin-menu-icon-color"
										name="admin_menu[icon_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['admin_menu']['icon_color'] ?? '#ffffff' ); ?>"
										data-default-color="#ffffff"
									/>
									<p class="description"><?php esc_html_e( 'Choose a custom color for menu icons.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Menu Item Spacing (Requirement 1.2, 1.3) -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Menu Item Spacing', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Control padding for menu items to create a compact, professional appearance.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-padding-vertical">
										<?php esc_html_e( 'Vertical Padding (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-menu-padding-vertical"
										name="admin_menu[padding_vertical]" 
										value="<?php echo esc_attr( $settings['admin_menu']['padding_vertical'] ?? 10 ); ?>"
										min="5"
										max="30"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['padding_vertical'] ?? 10 ); ?>px</span>
									<p class="description"><?php esc_html_e( 'Default: 10px. Range: 5-30px.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-padding-horizontal">
										<?php esc_html_e( 'Horizontal Padding (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-menu-padding-horizontal"
										name="admin_menu[padding_horizontal]" 
										value="<?php echo esc_attr( $settings['admin_menu']['padding_horizontal'] ?? 15 ); ?>"
										min="5"
										max="30"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['padding_horizontal'] ?? 15 ); ?>px</span>
									<p class="description"><?php esc_html_e( 'Default: 15px. Range: 5-30px.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Menu Typography -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Menu Typography', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Customize the typography of the admin menu.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-font-size">
										<?php esc_html_e( 'Font Size (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="number" 
										id="admin-menu-font-size"
										name="typography[admin_menu][font_size]" 
										class="small-text"
										value="<?php echo esc_attr( $settings['typography']['admin_menu']['font_size'] ); ?>"
										min="10"
										max="24"
										step="1"
									/>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-font-weight">
										<?php esc_html_e( 'Font Weight', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-font-weight" name="typography[admin_menu][font_weight]">
										<option value="300" <?php selected( $settings['typography']['admin_menu']['font_weight'], 300 ); ?>>300 (Light)</option>
										<option value="400" <?php selected( $settings['typography']['admin_menu']['font_weight'], 400 ); ?>>400 (Normal)</option>
										<option value="500" <?php selected( $settings['typography']['admin_menu']['font_weight'], 500 ); ?>>500 (Medium)</option>
										<option value="600" <?php selected( $settings['typography']['admin_menu']['font_weight'], 600 ); ?>>600 (Semi-Bold)</option>
										<option value="700" <?php selected( $settings['typography']['admin_menu']['font_weight'], 700 ); ?>>700 (Bold)</option>
									</select>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-line-height">
										<?php esc_html_e( 'Line Height', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-menu-line-height"
										name="typography[admin_menu][line_height]" 
										value="<?php echo esc_attr( $settings['typography']['admin_menu']['line_height'] ); ?>"
										min="1.0"
										max="2.0"
										step="0.1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['typography']['admin_menu']['line_height'] ); ?></span>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-letter-spacing">
										<?php esc_html_e( 'Letter Spacing (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-menu-letter-spacing"
										name="typography[admin_menu][letter_spacing]" 
										value="<?php echo esc_attr( $settings['typography']['admin_menu']['letter_spacing'] ?? 0 ); ?>"
										min="-2"
										max="5"
										step="0.5"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['typography']['admin_menu']['letter_spacing'] ?? 0 ); ?>px</span>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-text-transform">
										<?php esc_html_e( 'Text Transform', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-text-transform" name="typography[admin_menu][text_transform]">
										<option value="none" <?php selected( $settings['typography']['admin_menu']['text_transform'] ?? 'none', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
										<option value="uppercase" <?php selected( $settings['typography']['admin_menu']['text_transform'] ?? 'none', 'uppercase' ); ?>><?php esc_html_e( 'Uppercase', 'modern-admin-styler' ); ?></option>
										<option value="lowercase" <?php selected( $settings['typography']['admin_menu']['text_transform'] ?? 'none', 'lowercase' ); ?>><?php esc_html_e( 'Lowercase', 'modern-admin-styler' ); ?></option>
										<option value="capitalize" <?php selected( $settings['typography']['admin_menu']['text_transform'] ?? 'none', 'capitalize' ); ?>><?php esc_html_e( 'Capitalize', 'modern-admin-styler' ); ?></option>
									</select>
								</div>
							</div>
							
							<!-- Font Family Control (Requirement 11.1, 11.4, 11.6) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-font-family">
										<?php esc_html_e( 'Font Family', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-font-family" name="typography[admin_menu][font_family]">
										<optgroup label="<?php esc_attr_e( 'System Fonts', 'modern-admin-styler' ); ?>">
											<option value="system" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'system' ); ?>><?php esc_html_e( 'System Default', 'modern-admin-styler' ); ?></option>
											<option value="Arial, sans-serif" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'Arial, sans-serif' ); ?>>Arial</option>
											<option value="Helvetica, sans-serif" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'Helvetica, sans-serif' ); ?>>Helvetica</option>
											<option value="Georgia, serif" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'Georgia, serif' ); ?>>Georgia</option>
											<option value="'Courier New', monospace" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', "'Courier New', monospace" ); ?>>Courier New</option>
											<option value="'Times New Roman', serif" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', "'Times New Roman', serif" ); ?>>Times New Roman</option>
										</optgroup>
										<optgroup label="<?php esc_attr_e( 'Google Fonts', 'modern-admin-styler' ); ?>">
											<option value="google:Roboto" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'google:Roboto' ); ?>>Roboto</option>
											<option value="google:Open Sans" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'google:Open Sans' ); ?>>Open Sans</option>
											<option value="google:Lato" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'google:Lato' ); ?>>Lato</option>
											<option value="google:Montserrat" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'google:Montserrat' ); ?>>Montserrat</option>
											<option value="google:Poppins" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'google:Poppins' ); ?>>Poppins</option>
											<option value="google:Inter" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'google:Inter' ); ?>>Inter</option>
											<option value="google:Raleway" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'google:Raleway' ); ?>>Raleway</option>
											<option value="google:Source Sans Pro" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'google:Source Sans Pro' ); ?>>Source Sans Pro</option>
											<option value="google:Nunito" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'google:Nunito' ); ?>>Nunito</option>
											<option value="google:Ubuntu" <?php selected( $settings['typography']['admin_menu']['font_family'] ?? 'system', 'google:Ubuntu' ); ?>>Ubuntu</option>
										</optgroup>
									</select>
									<input type="hidden" id="admin-menu-google-font-url" name="typography[admin_menu][google_font_url]" value="<?php echo esc_attr( $settings['typography']['admin_menu']['google_font_url'] ?? '' ); ?>" />
									<p class="description"><?php esc_html_e( 'Choose a font family for menu items. Google Fonts are loaded dynamically.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Menu Visual Effects -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Menu Visual Effects', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Apply modern visual effects to the admin menu.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-glassmorphism">
										<?php esc_html_e( 'Glassmorphism', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="admin-menu-glassmorphism"
											name="visual_effects[admin_menu][glassmorphism]" 
											value="1"
											<?php checked( $settings['visual_effects']['admin_menu']['glassmorphism'] ?? false, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['visual_effects']['admin_menu']['glassmorphism'] ?? false ) ? 'true' : 'false'; ?>"
											aria-describedby="admin-menu-glassmorphism-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="admin-menu-glassmorphism-desc"><?php esc_html_e( 'Apply frosted glass effect with backdrop blur.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-menu-glassmorphism">
								<div class="mase-setting-label">
									<label for="admin-menu-blur-intensity">
										<?php esc_html_e( 'Blur Intensity (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-menu-blur-intensity"
										name="visual_effects[admin_menu][blur_intensity]" 
										value="<?php echo esc_attr( $settings['visual_effects']['admin_menu']['blur_intensity'] ?? 20 ); ?>"
										min="0"
										max="50"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['admin_menu']['blur_intensity'] ?? 20 ); ?>px</span>
								</div>
							</div>
							
							<!-- Border Radius Mode (Requirements 12.1, 12.2, 12.3, 12.4) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-border-radius-mode">
										<?php esc_html_e( 'Border Radius Mode', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-border-radius-mode" name="admin_menu[border_radius_mode]">
										<option value="uniform" <?php selected( $settings['admin_menu']['border_radius_mode'] ?? 'uniform', 'uniform' ); ?>>
											<?php esc_html_e( 'Uniform (All Corners)', 'modern-admin-styler' ); ?>
										</option>
										<option value="individual" <?php selected( $settings['admin_menu']['border_radius_mode'] ?? 'uniform', 'individual' ); ?>>
											<?php esc_html_e( 'Individual Corners', 'modern-admin-styler' ); ?>
										</option>
									</select>
									<p class="description"><?php esc_html_e( 'Choose between uniform or individual corner radius.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Uniform Border Radius (shown when mode = uniform) -->
							<div class="mase-setting-row mase-conditional-group" data-depends-on="admin-menu-border-radius-mode" data-value="uniform" style="display: <?php echo ( isset( $settings['admin_menu']['border_radius_mode'] ) && $settings['admin_menu']['border_radius_mode'] === 'individual' ) ? 'none' : 'flex'; ?>;">
								<div class="mase-setting-label">
									<label for="admin-menu-border-radius">
										<?php esc_html_e( 'Border Radius (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-menu-border-radius"
										name="admin_menu[border_radius]" 
										value="<?php echo esc_attr( $settings['admin_menu']['border_radius'] ?? 0 ); ?>"
										min="0"
										max="50"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['border_radius'] ?? 0 ); ?>px</span>
									<p class="description"><?php esc_html_e( 'Uniform corner rounding for all corners (0-50px).', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Individual Border Radius (shown when mode = individual) -->
							<div class="mase-conditional-group" data-depends-on="admin-menu-border-radius-mode" data-value="individual" style="display: <?php echo ( isset( $settings['admin_menu']['border_radius_mode'] ) && $settings['admin_menu']['border_radius_mode'] === 'individual' ) ? 'block' : 'none'; ?>;">
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-border-radius-tl">
											<?php esc_html_e( 'Top-Left Radius (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-border-radius-tl"
											name="admin_menu[border_radius_tl]" 
											min="0"
											max="50"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu']['border_radius_tl'] ?? 0 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['border_radius_tl'] ?? 0 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-border-radius-tr">
											<?php esc_html_e( 'Top-Right Radius (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-border-radius-tr"
											name="admin_menu[border_radius_tr]" 
											min="0"
											max="50"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu']['border_radius_tr'] ?? 0 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['border_radius_tr'] ?? 0 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-border-radius-br">
											<?php esc_html_e( 'Bottom-Right Radius (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-border-radius-br"
											name="admin_menu[border_radius_br]" 
											min="0"
											max="50"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu']['border_radius_br'] ?? 0 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['border_radius_br'] ?? 0 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-border-radius-bl">
											<?php esc_html_e( 'Bottom-Left Radius (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-border-radius-bl"
											name="admin_menu[border_radius_bl]" 
											min="0"
											max="50"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu']['border_radius_bl'] ?? 0 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['border_radius_bl'] ?? 0 ); ?>px</span>
									</div>
								</div>
							</div>
							
							<!-- Shadow Mode (Requirements 13.1, 13.4) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-shadow-mode">
										<?php esc_html_e( 'Shadow Mode', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-shadow-mode" name="admin_menu[shadow_mode]">
										<option value="preset" <?php selected( $settings['admin_menu']['shadow_mode'] ?? 'preset', 'preset' ); ?>>
											<?php esc_html_e( 'Preset Shadows', 'modern-admin-styler' ); ?>
										</option>
										<option value="custom" <?php selected( $settings['admin_menu']['shadow_mode'] ?? 'preset', 'custom' ); ?>>
											<?php esc_html_e( 'Custom Shadow', 'modern-admin-styler' ); ?>
										</option>
									</select>
									<p class="description"><?php esc_html_e( 'Choose between preset shadows or create a custom shadow.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Shadow Preset (shown when mode = preset) (Requirement 13.1) -->
							<div class="mase-setting-row mase-conditional-group" data-depends-on="admin-menu-shadow-mode" data-value="preset" style="display: <?php echo ( isset( $settings['admin_menu']['shadow_mode'] ) && $settings['admin_menu']['shadow_mode'] === 'custom' ) ? 'none' : 'flex'; ?>;">
								<div class="mase-setting-label">
									<label for="admin-menu-shadow-preset">
										<?php esc_html_e( 'Shadow Preset', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-shadow-preset" name="admin_menu[shadow_preset]">
										<option value="none" <?php selected( $settings['admin_menu']['shadow_preset'] ?? 'none', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
										<option value="subtle" <?php selected( $settings['admin_menu']['shadow_preset'] ?? 'none', 'subtle' ); ?>><?php esc_html_e( 'Subtle', 'modern-admin-styler' ); ?></option>
										<option value="medium" <?php selected( $settings['admin_menu']['shadow_preset'] ?? 'none', 'medium' ); ?>><?php esc_html_e( 'Medium', 'modern-admin-styler' ); ?></option>
										<option value="strong" <?php selected( $settings['admin_menu']['shadow_preset'] ?? 'none', 'strong' ); ?>><?php esc_html_e( 'Strong', 'modern-admin-styler' ); ?></option>
										<option value="dramatic" <?php selected( $settings['admin_menu']['shadow_preset'] ?? 'none', 'dramatic' ); ?>><?php esc_html_e( 'Dramatic', 'modern-admin-styler' ); ?></option>
									</select>
									<p class="description"><?php esc_html_e( 'Select from predefined shadow styles.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Custom Shadow Controls (shown when mode = custom) (Requirements 13.2, 13.3) -->
							<div class="mase-conditional-group" data-depends-on="admin-menu-shadow-mode" data-value="custom" style="display: <?php echo ( isset( $settings['admin_menu']['shadow_mode'] ) && $settings['admin_menu']['shadow_mode'] === 'custom' ) ? 'block' : 'none'; ?>;">
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-shadow-h-offset">
											<?php esc_html_e( 'Horizontal Offset (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-shadow-h-offset"
											name="admin_menu[shadow_h_offset]" 
											min="-50"
											max="50"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu']['shadow_h_offset'] ?? 0 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['shadow_h_offset'] ?? 0 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-shadow-v-offset">
											<?php esc_html_e( 'Vertical Offset (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-shadow-v-offset"
											name="admin_menu[shadow_v_offset]" 
											min="-50"
											max="50"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu']['shadow_v_offset'] ?? 4 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['shadow_v_offset'] ?? 4 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-shadow-blur">
											<?php esc_html_e( 'Blur Radius (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-shadow-blur"
											name="admin_menu[shadow_blur]" 
											min="0"
											max="100"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu']['shadow_blur'] ?? 8 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['shadow_blur'] ?? 8 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-shadow-spread">
											<?php esc_html_e( 'Spread Radius (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-shadow-spread"
											name="admin_menu[shadow_spread]" 
											min="-50"
											max="50"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu']['shadow_spread'] ?? 0 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['shadow_spread'] ?? 0 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-shadow-color">
											<?php esc_html_e( 'Shadow Color', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="text" 
											id="admin-menu-shadow-color"
											name="admin_menu[shadow_color]" 
											value="<?php echo esc_attr( $settings['admin_menu']['shadow_color'] ?? '#000000' ); ?>"
											class="mase-color-picker"
											data-alpha-enabled="false"
										/>
										<p class="description"><?php esc_html_e( 'Base color for the shadow.', 'modern-admin-styler' ); ?></p>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-shadow-opacity">
											<?php esc_html_e( 'Shadow Opacity', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-shadow-opacity"
											name="admin_menu[shadow_opacity]" 
											min="0"
											max="1"
											step="0.01"
											value="<?php echo esc_attr( $settings['admin_menu']['shadow_opacity'] ?? 0.15 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( round( ( $settings['admin_menu']['shadow_opacity'] ?? 0.15 ) * 100 ) ); ?>%</span>
									</div>
								</div>
							</div>
							
							<!-- Floating Mode (Requirements 15.1, 15.2, 15.3, 15.4) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-floating">
										<?php esc_html_e( 'Floating Mode', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="admin-menu-floating"
											name="visual_effects[admin_menu][floating]" 
											value="1"
											<?php checked( $settings['visual_effects']['admin_menu']['floating'] ?? false, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['visual_effects']['admin_menu']['floating'] ?? false ) ? 'true' : 'false'; ?>"
											aria-describedby="admin-menu-floating-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="admin-menu-floating-desc"><?php esc_html_e( 'Add margins around the menu to create a floating effect.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Floating Margin Controls (shown when floating is enabled) -->
							<div class="mase-conditional-group" data-depends-on="admin-menu-floating" style="display: <?php echo ( $settings['visual_effects']['admin_menu']['floating'] ?? false ) ? 'block' : 'none'; ?>;">
								<!-- Floating Margin Mode (Requirements 15.1, 15.2) -->
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-floating-margin-mode">
											<?php esc_html_e( 'Margin Mode', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<select id="admin-menu-floating-margin-mode" name="admin_menu[floating_margin_mode]">
											<option value="uniform" <?php selected( $settings['admin_menu']['floating_margin_mode'] ?? 'uniform', 'uniform' ); ?>>
												<?php esc_html_e( 'Uniform', 'modern-admin-styler' ); ?>
											</option>
											<option value="individual" <?php selected( $settings['admin_menu']['floating_margin_mode'] ?? 'uniform', 'individual' ); ?>>
												<?php esc_html_e( 'Individual Sides', 'modern-admin-styler' ); ?>
											</option>
										</select>
										<p class="description"><?php esc_html_e( 'Choose between uniform or individual side margins.', 'modern-admin-styler' ); ?></p>
									</div>
								</div>
								
								<!-- Uniform Margin Control (shown when floating_margin_mode = uniform) (Requirement 15.1) -->
								<div class="mase-conditional-group" data-depends-on="admin-menu-floating-margin-mode" data-value="uniform" style="display: <?php echo ( ! isset( $settings['admin_menu']['floating_margin_mode'] ) || $settings['admin_menu']['floating_margin_mode'] === 'uniform' ) ? 'block' : 'none'; ?>;">
									<div class="mase-setting-row">
										<div class="mase-setting-label">
											<label for="admin-menu-floating-margin-uniform">
												<?php esc_html_e( 'Margin (px)', 'modern-admin-styler' ); ?>
											</label>
										</div>
										<div class="mase-setting-control">
											<input 
												type="range" 
												id="admin-menu-floating-margin-uniform"
												name="admin_menu[floating_margin]" 
												min="0"
												max="100"
												step="1"
												value="<?php echo esc_attr( $settings['admin_menu']['floating_margin'] ?? 8 ); ?>"
											/>
											<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['floating_margin'] ?? 8 ); ?>px</span>
											<p class="description"><?php esc_html_e( 'Apply the same margin to all sides.', 'modern-admin-styler' ); ?></p>
										</div>
									</div>
								</div>
								
								<!-- Individual Margin Controls (shown when floating_margin_mode = individual) (Requirements 15.2, 15.3) -->
								<div class="mase-conditional-group" data-depends-on="admin-menu-floating-margin-mode" data-value="individual" style="display: <?php echo ( isset( $settings['admin_menu']['floating_margin_mode'] ) && $settings['admin_menu']['floating_margin_mode'] === 'individual' ) ? 'block' : 'none'; ?>;">
									<div class="mase-setting-row">
										<div class="mase-setting-label">
											<label for="admin-menu-floating-margin-top">
												<?php esc_html_e( 'Top Margin (px)', 'modern-admin-styler' ); ?>
											</label>
										</div>
										<div class="mase-setting-control">
											<input 
												type="range" 
												id="admin-menu-floating-margin-top"
												name="admin_menu[floating_margin_top]" 
												min="0"
												max="100"
												step="1"
												value="<?php echo esc_attr( $settings['admin_menu']['floating_margin_top'] ?? 8 ); ?>"
											/>
											<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['floating_margin_top'] ?? 8 ); ?>px</span>
										</div>
									</div>
									
									<div class="mase-setting-row">
										<div class="mase-setting-label">
											<label for="admin-menu-floating-margin-right">
												<?php esc_html_e( 'Right Margin (px)', 'modern-admin-styler' ); ?>
											</label>
										</div>
										<div class="mase-setting-control">
											<input 
												type="range" 
												id="admin-menu-floating-margin-right"
												name="admin_menu[floating_margin_right]" 
												min="0"
												max="100"
												step="1"
												value="<?php echo esc_attr( $settings['admin_menu']['floating_margin_right'] ?? 8 ); ?>"
											/>
											<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['floating_margin_right'] ?? 8 ); ?>px</span>
										</div>
									</div>
									
									<div class="mase-setting-row">
										<div class="mase-setting-label">
											<label for="admin-menu-floating-margin-bottom">
												<?php esc_html_e( 'Bottom Margin (px)', 'modern-admin-styler' ); ?>
											</label>
										</div>
										<div class="mase-setting-control">
											<input 
												type="range" 
												id="admin-menu-floating-margin-bottom"
												name="admin_menu[floating_margin_bottom]" 
												min="0"
												max="100"
												step="1"
												value="<?php echo esc_attr( $settings['admin_menu']['floating_margin_bottom'] ?? 8 ); ?>"
											/>
											<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['floating_margin_bottom'] ?? 8 ); ?>px</span>
										</div>
									</div>
									
									<div class="mase-setting-row">
										<div class="mase-setting-label">
											<label for="admin-menu-floating-margin-left">
												<?php esc_html_e( 'Left Margin (px)', 'modern-admin-styler' ); ?>
											</label>
										</div>
										<div class="mase-setting-control">
											<input 
												type="range" 
												id="admin-menu-floating-margin-left"
												name="admin_menu[floating_margin_left]" 
												min="0"
												max="100"
												step="1"
												value="<?php echo esc_attr( $settings['admin_menu']['floating_margin_left'] ?? 8 ); ?>"
											/>
											<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['floating_margin_left'] ?? 8 ); ?>px</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Menu Submenu Styling (Requirements 7.1, 7.2, 7.3, 7.4, 8.1, 8.2) -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Submenu Styling', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Customize the appearance of admin menu dropdown submenus.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-submenu-bg-color">
										<?php esc_html_e( 'Background Color', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="text" 
										id="admin-menu-submenu-bg-color"
										name="admin_menu_submenu[bg_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['admin_menu_submenu']['bg_color'] ?? '#32373c' ); ?>"
										data-default-color="#32373c"
									/>
									<p class="description"><?php esc_html_e( 'Background color for submenu dropdowns.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Border Radius Controls (Requirement 8.1, 8.2) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-submenu-border-radius-mode">
										<?php esc_html_e( 'Border Radius Mode', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-submenu-border-radius-mode" name="admin_menu_submenu[border_radius_mode]">
										<option value="uniform" <?php selected( $settings['admin_menu_submenu']['border_radius_mode'] ?? 'uniform', 'uniform' ); ?>>
											<?php esc_html_e( 'Uniform (All Corners)', 'modern-admin-styler' ); ?>
										</option>
										<option value="individual" <?php selected( $settings['admin_menu_submenu']['border_radius_mode'] ?? 'uniform', 'individual' ); ?>>
											<?php esc_html_e( 'Individual Corners', 'modern-admin-styler' ); ?>
										</option>
									</select>
									<p class="description"><?php esc_html_e( 'Choose between uniform or individual corner radius.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Uniform Border Radius (shown when mode = uniform) -->
							<div class="mase-setting-row mase-conditional-group" data-depends-on="admin-menu-submenu-border-radius-mode" data-value="uniform" style="display: <?php echo ( isset( $settings['admin_menu_submenu']['border_radius_mode'] ) && $settings['admin_menu_submenu']['border_radius_mode'] === 'individual' ) ? 'none' : 'flex'; ?>;">
								<div class="mase-setting-label">
									<label for="admin-menu-submenu-border-radius">
										<?php esc_html_e( 'Border Radius (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-menu-submenu-border-radius"
										name="admin_menu_submenu[border_radius]" 
										min="0"
										max="20"
										step="1"
										value="<?php echo esc_attr( $settings['admin_menu_submenu']['border_radius'] ?? 0 ); ?>"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu_submenu']['border_radius'] ?? 0 ); ?>px</span>
									<p class="description"><?php esc_html_e( 'Uniform corner rounding for all corners (0-20px).', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Individual Border Radius (shown when mode = individual) -->
							<div class="mase-conditional-group" data-depends-on="admin-menu-submenu-border-radius-mode" data-value="individual" style="display: <?php echo ( isset( $settings['admin_menu_submenu']['border_radius_mode'] ) && $settings['admin_menu_submenu']['border_radius_mode'] === 'individual' ) ? 'block' : 'none'; ?>;">
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-submenu-border-radius-tl">
											<?php esc_html_e( 'Top-Left Radius (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-submenu-border-radius-tl"
											name="admin_menu_submenu[border_radius_tl]" 
											min="0"
											max="20"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu_submenu']['border_radius_tl'] ?? 0 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu_submenu']['border_radius_tl'] ?? 0 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-submenu-border-radius-tr">
											<?php esc_html_e( 'Top-Right Radius (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-submenu-border-radius-tr"
											name="admin_menu_submenu[border_radius_tr]" 
											min="0"
											max="20"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu_submenu']['border_radius_tr'] ?? 0 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu_submenu']['border_radius_tr'] ?? 0 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-submenu-border-radius-br">
											<?php esc_html_e( 'Bottom-Right Radius (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-submenu-border-radius-br"
											name="admin_menu_submenu[border_radius_br]" 
											min="0"
											max="20"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu_submenu']['border_radius_br'] ?? 0 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu_submenu']['border_radius_br'] ?? 0 ); ?>px</span>
									</div>
								</div>
								
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="admin-menu-submenu-border-radius-bl">
											<?php esc_html_e( 'Bottom-Left Radius (px)', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<input 
											type="range" 
											id="admin-menu-submenu-border-radius-bl"
											name="admin_menu_submenu[border_radius_bl]" 
											min="0"
											max="20"
											step="1"
											value="<?php echo esc_attr( $settings['admin_menu_submenu']['border_radius_bl'] ?? 0 ); ?>"
										/>
										<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu_submenu']['border_radius_bl'] ?? 0 ); ?>px</span>
									</div>
								</div>
							</div>
							
							<!-- Submenu Spacing Control (Requirement 9.1) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-submenu-spacing">
										<?php esc_html_e( 'Spacing from Menu (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-menu-submenu-spacing"
										name="admin_menu_submenu[spacing]" 
										value="<?php echo esc_attr( $settings['admin_menu_submenu']['spacing'] ?? 0 ); ?>"
										min="0"
										max="50"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu_submenu']['spacing'] ?? 0 ); ?>px</span>
									<p class="description"><?php esc_html_e( 'Vertical distance between menu and submenu.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Submenu Typography (Requirements 10.1, 10.2, 10.3, 10.4, 10.5) -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Submenu Typography', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Customize the typography of submenu items independently from the main menu.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							<!-- Font Size Control (Requirement 10.1) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-submenu-font-size">
										<?php esc_html_e( 'Font Size (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="number" 
										id="admin-menu-submenu-font-size"
										name="admin_menu_submenu[font_size]" 
										class="small-text"
										value="<?php echo esc_attr( $settings['admin_menu_submenu']['font_size'] ?? 13 ); ?>"
										min="10"
										max="24"
										step="1"
									/>
									<p class="description"><?php esc_html_e( 'Font size for submenu items (10-24px).', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Text Color Control (Requirement 10.2) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-submenu-text-color">
										<?php esc_html_e( 'Text Color', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="text" 
										id="admin-menu-submenu-text-color"
										name="admin_menu_submenu[text_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['admin_menu_submenu']['text_color'] ?? '#ffffff' ); ?>"
										data-default-color="#ffffff"
									/>
									<p class="description"><?php esc_html_e( 'Text color for submenu items.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Line Height Control (Requirement 10.3) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-submenu-line-height">
										<?php esc_html_e( 'Line Height', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-menu-submenu-line-height"
										name="admin_menu_submenu[line_height]" 
										value="<?php echo esc_attr( $settings['admin_menu_submenu']['line_height'] ?? 1.5 ); ?>"
										min="1.0"
										max="3.0"
										step="0.1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu_submenu']['line_height'] ?? 1.5 ); ?></span>
									<p class="description"><?php esc_html_e( 'Line height for submenu items (1.0-3.0).', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Letter Spacing Control (Requirement 10.4) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-submenu-letter-spacing">
										<?php esc_html_e( 'Letter Spacing (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-menu-submenu-letter-spacing"
										name="admin_menu_submenu[letter_spacing]" 
										value="<?php echo esc_attr( $settings['admin_menu_submenu']['letter_spacing'] ?? 0 ); ?>"
										min="-2"
										max="5"
										step="0.5"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu_submenu']['letter_spacing'] ?? 0 ); ?>px</span>
									<p class="description"><?php esc_html_e( 'Letter spacing for submenu items (-2 to 5px).', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Text Transform Control (Requirement 10.5) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-submenu-text-transform">
										<?php esc_html_e( 'Text Transform', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-submenu-text-transform" name="admin_menu_submenu[text_transform]">
										<option value="none" <?php selected( $settings['admin_menu_submenu']['text_transform'] ?? 'none', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
										<option value="uppercase" <?php selected( $settings['admin_menu_submenu']['text_transform'] ?? 'none', 'uppercase' ); ?>><?php esc_html_e( 'Uppercase', 'modern-admin-styler' ); ?></option>
										<option value="lowercase" <?php selected( $settings['admin_menu_submenu']['text_transform'] ?? 'none', 'lowercase' ); ?>><?php esc_html_e( 'Lowercase', 'modern-admin-styler' ); ?></option>
										<option value="capitalize" <?php selected( $settings['admin_menu_submenu']['text_transform'] ?? 'none', 'capitalize' ); ?>><?php esc_html_e( 'Capitalize', 'modern-admin-styler' ); ?></option>
									</select>
									<p class="description"><?php esc_html_e( 'Text transformation for submenu items.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Font Family Control (Requirement 11.1) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-submenu-font-family">
										<?php esc_html_e( 'Font Family', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-submenu-font-family" name="admin_menu_submenu[font_family]">
										<optgroup label="<?php esc_attr_e( 'System Fonts', 'modern-admin-styler' ); ?>">
											<option value="system" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'system' ); ?>><?php esc_html_e( 'System Default', 'modern-admin-styler' ); ?></option>
											<option value="Arial, sans-serif" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'Arial, sans-serif' ); ?>>Arial</option>
											<option value="Helvetica, sans-serif" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'Helvetica, sans-serif' ); ?>>Helvetica</option>
											<option value="Georgia, serif" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'Georgia, serif' ); ?>>Georgia</option>
											<option value="'Courier New', monospace" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', "'Courier New', monospace" ); ?>>Courier New</option>
											<option value="'Times New Roman', serif" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', "'Times New Roman', serif" ); ?>>Times New Roman</option>
										</optgroup>
										<optgroup label="<?php esc_attr_e( 'Google Fonts', 'modern-admin-styler' ); ?>">
											<option value="google:Roboto" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'google:Roboto' ); ?>>Roboto</option>
											<option value="google:Open Sans" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'google:Open Sans' ); ?>>Open Sans</option>
											<option value="google:Lato" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'google:Lato' ); ?>>Lato</option>
											<option value="google:Montserrat" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'google:Montserrat' ); ?>>Montserrat</option>
											<option value="google:Poppins" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'google:Poppins' ); ?>>Poppins</option>
											<option value="google:Inter" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'google:Inter' ); ?>>Inter</option>
											<option value="google:Raleway" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'google:Raleway' ); ?>>Raleway</option>
											<option value="google:Source Sans Pro" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'google:Source Sans Pro' ); ?>>Source Sans Pro</option>
											<option value="google:Nunito" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'google:Nunito' ); ?>>Nunito</option>
											<option value="google:Ubuntu" <?php selected( $settings['admin_menu_submenu']['font_family'] ?? 'system', 'google:Ubuntu' ); ?>>Ubuntu</option>
										</optgroup>
									</select>
									<p class="description"><?php esc_html_e( 'Font family for submenu items.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Logo Placement Section (Requirement 16) -->
				<div class="mase-section">
					<div class="mase-section-card">
						<h2><?php esc_html_e( 'Logo Placement', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Add and position a custom logo in the admin menu.', 'modern-admin-styler' ); ?></p>
						
						<div class="mase-settings-group">
							
							<!-- Logo Enable Toggle (Requirement 16.1) -->
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-logo-enabled">
										<?php esc_html_e( 'Enable Logo', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="admin-menu-logo-enabled"
											name="admin_menu[logo_enabled]" 
											value="1"
											<?php checked( $settings['admin_menu']['logo_enabled'] ?? false, true ); ?>
										/>
										<span class="mase-toggle-slider"></span>
									</label>
									<p class="description"><?php esc_html_e( 'Enable custom logo in the admin menu.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Logo Upload Control (Requirement 16.1) -->
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-menu-logo-enabled" style="display: <?php echo ( $settings['admin_menu']['logo_enabled'] ?? false ) ? 'flex' : 'none'; ?>;">
								<div class="mase-setting-label">
									<label for="admin-menu-logo-upload">
										<?php esc_html_e( 'Logo Image', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<div class="mase-logo-upload-wrapper">
										<input 
											type="hidden" 
											id="admin-menu-logo-url"
											name="admin_menu[logo_url]" 
											value="<?php echo esc_attr( $settings['admin_menu']['logo_url'] ?? '' ); ?>"
										/>
										<button 
											type="button" 
											id="admin-menu-logo-upload-btn"
											class="button button-secondary mase-logo-upload-btn"
										>
											<span class="dashicons dashicons-upload"></span>
											<?php esc_html_e( 'Upload Logo', 'modern-admin-styler' ); ?>
										</button>
										<button 
											type="button" 
											id="admin-menu-logo-remove-btn"
											class="button button-secondary mase-logo-remove-btn"
											style="<?php echo empty( $settings['admin_menu']['logo_url'] ) ? 'display: none;' : ''; ?>"
										>
											<span class="dashicons dashicons-no"></span>
											<?php esc_html_e( 'Remove Logo', 'modern-admin-styler' ); ?>
										</button>
										<div id="admin-menu-logo-preview" class="mase-logo-preview" style="<?php echo empty( $settings['admin_menu']['logo_url'] ) ? 'display: none;' : ''; ?>">
											<?php if ( ! empty( $settings['admin_menu']['logo_url'] ) ) : ?>
												<img src="<?php echo esc_url( $settings['admin_menu']['logo_url'] ); ?>" alt="<?php esc_attr_e( 'Menu Logo', 'modern-admin-styler' ); ?>" />
											<?php endif; ?>
										</div>
									</div>
									<p class="description"><?php esc_html_e( 'Upload a logo image (PNG, JPG, or SVG, max 2MB).', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Logo Position Control (Requirement 16.2) -->
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-menu-logo-enabled" style="display: <?php echo ( $settings['admin_menu']['logo_enabled'] ?? false ) ? 'flex' : 'none'; ?>;">
								<div class="mase-setting-label">
									<label for="admin-menu-logo-position">
										<?php esc_html_e( 'Logo Position', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-logo-position" name="admin_menu[logo_position]">
										<option value="top" <?php selected( $settings['admin_menu']['logo_position'] ?? 'top', 'top' ); ?>><?php esc_html_e( 'Top', 'modern-admin-styler' ); ?></option>
										<option value="bottom" <?php selected( $settings['admin_menu']['logo_position'] ?? 'top', 'bottom' ); ?>><?php esc_html_e( 'Bottom', 'modern-admin-styler' ); ?></option>
									</select>
									<p class="description"><?php esc_html_e( 'Position logo at the top or bottom of the menu.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Logo Width Control (Requirement 16.3) -->
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-menu-logo-enabled" style="display: <?php echo ( $settings['admin_menu']['logo_enabled'] ?? false ) ? 'flex' : 'none'; ?>;">
								<div class="mase-setting-label">
									<label for="admin-menu-logo-width">
										<?php esc_html_e( 'Logo Width (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-menu-logo-width"
										name="admin_menu[logo_width]" 
										value="<?php echo esc_attr( $settings['admin_menu']['logo_width'] ?? 100 ); ?>"
										min="20"
										max="200"
										step="5"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['admin_menu']['logo_width'] ?? 100 ); ?>px</span>
									<p class="description"><?php esc_html_e( 'Logo width in pixels (20-200px). Height adjusts automatically.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
							<!-- Logo Alignment Control (Requirement 16.4) -->
							<div class="mase-setting-row mase-conditional" data-depends-on="admin-menu-logo-enabled" style="display: <?php echo ( $settings['admin_menu']['logo_enabled'] ?? false ) ? 'flex' : 'none'; ?>;">
								<div class="mase-setting-label">
									<label for="admin-menu-logo-alignment">
										<?php esc_html_e( 'Logo Alignment', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-logo-alignment" name="admin_menu[logo_alignment]">
										<option value="left" <?php selected( $settings['admin_menu']['logo_alignment'] ?? 'center', 'left' ); ?>><?php esc_html_e( 'Left', 'modern-admin-styler' ); ?></option>
										<option value="center" <?php selected( $settings['admin_menu']['logo_alignment'] ?? 'center', 'center' ); ?>><?php esc_html_e( 'Center', 'modern-admin-styler' ); ?></option>
										<option value="right" <?php selected( $settings['admin_menu']['logo_alignment'] ?? 'center', 'right' ); ?>><?php esc_html_e( 'Right', 'modern-admin-styler' ); ?></option>
									</select>
									<p class="description"><?php esc_html_e( 'Horizontal alignment of the logo.', 'modern-admin-styler' ); ?></p>
								</div>
							</div>
							
						</div>
					</div>
				</div>
				
			</div><!-- #tab-menu -->


			<!-- ============================================ -->
			<!-- CONTENT TAB -->
			<!-- ============================================ -->
			<div class="mase-tab-content" id="tab-content" data-tab-content="content" role="tabpanel" aria-labelledby="tab-button-content" tabindex="0">
				
				<!-- Content Background -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Content Background', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Customize the background of the content area.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="content-bg-color">
										<?php esc_html_e( 'Background Color', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="text" 
										id="content-bg-color"
										name="content[bg_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['content']['bg_color'] ?? '#f0f0f1' ); ?>"
										data-default-color="#f0f0f1"
									/>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="content-text-color">
										<?php esc_html_e( 'Text Color', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="text" 
										id="content-text-color"
										name="content[text_color]" 
										class="mase-color-picker"
										value="<?php echo esc_attr( $settings['content']['text_color'] ?? '#1d2327' ); ?>"
										data-default-color="#1d2327"
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Content Spacing -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Content Spacing', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Adjust padding and margins for the content area.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="content-padding">
										<?php esc_html_e( 'Padding (px)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="range" 
										id="content-padding"
										name="content[padding]" 
										value="<?php echo esc_attr( $settings['content']['padding'] ?? 20 ); ?>"
										min="0"
										max="100"
										step="5"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['content']['padding'] ?? 20 ); ?>px</span>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="content-margin">
										<?php esc_html_e( 'Margin (px)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="range" 
										id="content-margin"
										name="content[margin]" 
										value="<?php echo esc_attr( $settings['content']['margin'] ?? 20 ); ?>"
										min="0"
										max="100"
										step="5"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['content']['margin'] ?? 20 ); ?>px</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Content Layout -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Content Layout', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Control the layout and width of the content area.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="content-max-width">
										<?php esc_html_e( 'Max Width (px)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="number" 
										id="content-max-width"
										name="content[max_width]" 
										class="regular-text"
										value="<?php echo esc_attr( $settings['content']['max_width'] ?? 0 ); ?>"
										min="0"
										max="2000"
										step="10"
									/>
									<p class="description"><?php esc_html_e( 'Set to 0 for no limit. Recommended: 1200-1600px for better readability.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="content-border-radius">
										<?php esc_html_e( 'Border Radius (px)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="range" 
										id="content-border-radius"
										name="content[border_radius]" 
										value="<?php echo esc_attr( $settings['content']['border_radius'] ?? 0 ); ?>"
										min="0"
										max="20"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['content']['border_radius'] ?? 0 ); ?>px</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				
			</div><!-- #tab-content -->

			<!-- ============================================ -->
			<!-- TYPOGRAPHY TAB -->
			<!-- ============================================ -->
			<div class="mase-tab-content" id="tab-typography" data-tab-content="typography" role="tabpanel" aria-labelledby="tab-button-typography" tabindex="0">
				
				<!-- Global Typography -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Global Typography Settings', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Typography settings that apply across all areas.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="typography-font-family">
										<?php esc_html_e( 'Font Family', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<select id="typography-font-family" name="typography[font_family]">
										<option value="system" <?php selected( $settings['typography']['font_family'] ?? 'system', 'system' ); ?>><?php esc_html_e( 'System Default', 'modern-admin-styler' ); ?></option>
										<option value="inter" <?php selected( $settings['typography']['font_family'] ?? 'system', 'inter' ); ?>>Inter</option>
										<option value="roboto" <?php selected( $settings['typography']['font_family'] ?? 'system', 'roboto' ); ?>>Roboto</option>
										<option value="open-sans" <?php selected( $settings['typography']['font_family'] ?? 'system', 'open-sans' ); ?>>Open Sans</option>
										<option value="lato" <?php selected( $settings['typography']['font_family'] ?? 'system', 'lato' ); ?>>Lato</option>
										<option value="montserrat" <?php selected( $settings['typography']['font_family'] ?? 'system', 'montserrat' ); ?>>Montserrat</option>
									</select>
									<p class="description"><?php esc_html_e( 'Google Fonts will be loaded automatically.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typography-enable-google-fonts">
										<?php esc_html_e( 'Enable Google Fonts', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="typography-enable-google-fonts"
											name="typography[enabled]" 
											value="1"
											<?php checked( $settings['typography']['enabled'] ?? true, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['typography']['enabled'] ?? true ) ? 'true' : 'false'; ?>"
											aria-describedby="typography-enable-google-fonts-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="typography-enable-google-fonts-desc"><?php esc_html_e( 'Load fonts from Google Fonts CDN.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Content Typography (Detailed) -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h3><?php esc_html_e( 'Content Typography', 'modern-admin-styler' ); ?></h3>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="typo-content-font-size">
										<?php esc_html_e( 'Font Size (px)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="number" 
										id="typo-content-font-size"
										name="typography[content][font_size]" 
										class="small-text"
										value="<?php echo esc_attr( $settings['typography']['content']['font_size'] ); ?>"
										min="10"
										max="24"
										step="1"
									/>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typo-content-font-weight">
										<?php esc_html_e( 'Font Weight', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<select id="typo-content-font-weight" name="typography[content][font_weight]">
										<option value="300" <?php selected( $settings['typography']['content']['font_weight'], 300 ); ?>>300 (Light)</option>
										<option value="400" <?php selected( $settings['typography']['content']['font_weight'], 400 ); ?>>400 (Normal)</option>
										<option value="500" <?php selected( $settings['typography']['content']['font_weight'], 500 ); ?>>500 (Medium)</option>
										<option value="600" <?php selected( $settings['typography']['content']['font_weight'], 600 ); ?>>600 (Semi-Bold)</option>
										<option value="700" <?php selected( $settings['typography']['content']['font_weight'], 700 ); ?>>700 (Bold)</option>
									</select>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typo-content-line-height">
										<?php esc_html_e( 'Line Height', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="range" 
										id="typo-content-line-height"
										name="typography[content][line_height]" 
										value="<?php echo esc_attr( $settings['typography']['content']['line_height'] ); ?>"
										min="1.0"
										max="2.0"
										step="0.1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['typography']['content']['line_height'] ); ?></span>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typo-content-letter-spacing">
										<?php esc_html_e( 'Letter Spacing (px)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="range" 
										id="typo-content-letter-spacing"
										name="typography[content][letter_spacing]" 
										value="<?php echo esc_attr( $settings['typography']['content']['letter_spacing'] ); ?>"
										min="-2"
										max="5"
										step="0.5"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['typography']['content']['letter_spacing'] ); ?>px</span>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typo-content-text-transform">
										<?php esc_html_e( 'Text Transform', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<select id="typo-content-text-transform" name="typography[content][text_transform]">
										<option value="none" <?php selected( $settings['typography']['content']['text_transform'], 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
										<option value="uppercase" <?php selected( $settings['typography']['content']['text_transform'], 'uppercase' ); ?>><?php esc_html_e( 'Uppercase', 'modern-admin-styler' ); ?></option>
										<option value="lowercase" <?php selected( $settings['typography']['content']['text_transform'], 'lowercase' ); ?>><?php esc_html_e( 'Lowercase', 'modern-admin-styler' ); ?></option>
										<option value="capitalize" <?php selected( $settings['typography']['content']['text_transform'], 'capitalize' ); ?>><?php esc_html_e( 'Capitalize', 'modern-admin-styler' ); ?></option>
									</select>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				
			</div><!-- #tab-typography -->


			<!-- ============================================ -->
			<!-- EFFECTS TAB -->
			<!-- ============================================ -->
			<div class="mase-tab-content" id="tab-effects" data-tab-content="effects" role="tabpanel" aria-labelledby="tab-button-effects" tabindex="0">
				
				<!-- Animation Settings -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Animation Settings', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Control page transitions and animations.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="effects-page-animations">
										<?php esc_html_e( 'Page Animations', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="effects-page-animations"
											name="effects[page_animations]" 
											value="1"
											<?php checked( $settings['effects']['page_animations'] ?? true, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['effects']['page_animations'] ?? true ) ? 'true' : 'false'; ?>"
											aria-describedby="effects-page-animations-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="effects-page-animations-desc"><?php esc_html_e( 'Enable smooth page transitions.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="effects-animation-speed">
										<?php esc_html_e( 'Animation Speed (ms)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="range" 
										id="effects-animation-speed"
										name="effects[animation_speed]" 
										value="<?php echo esc_attr( $settings['effects']['animation_speed'] ?? 300 ); ?>"
										min="100"
										max="1000"
										step="50"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['effects']['animation_speed'] ?? 300 ); ?>ms</span>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="effects-microanimations">
										<?php esc_html_e( 'Micro-animations', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="effects-microanimations"
											name="visual_effects[microanimations_enabled]" 
											value="1"
											<?php checked( $settings['visual_effects']['microanimations_enabled'] ?? true, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['visual_effects']['microanimations_enabled'] ?? true ) ? 'true' : 'false'; ?>"
											aria-describedby="effects-microanimations-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="effects-microanimations-desc"><?php esc_html_e( 'Enable subtle animations on buttons and interactive elements.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Hover Effects -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Hover Effects', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Customize hover interactions.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="effects-hover-effects">
										<?php esc_html_e( 'Enable Hover Effects', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="effects-hover-effects"
											name="effects[hover_effects]" 
											value="1"
											<?php checked( $settings['effects']['hover_effects'] ?? true, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['effects']['hover_effects'] ?? true ) ? 'true' : 'false'; ?>"
											aria-describedby="effects-hover-effects-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="effects-hover-effects-desc"><?php esc_html_e( 'Enable hover effects on menu items and buttons.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Advanced Visual Effects -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Advanced Visual Effects', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Experimental effects that may impact performance.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="effects-particle-system">
										<?php esc_html_e( 'Particle System', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="effects-particle-system"
											name="visual_effects[particle_system]" 
											value="1"
											<?php checked( $settings['visual_effects']['particle_system'] ?? false, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['visual_effects']['particle_system'] ?? false ) ? 'true' : 'false'; ?>"
											aria-describedby="effects-particle-system-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="effects-particle-system-desc"><?php esc_html_e( 'Add animated particles to the background (may impact performance).', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="effects-3d-effects">
										<?php esc_html_e( '3D Effects', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="effects-3d-effects"
											name="visual_effects[3d_effects]" 
											value="1"
											<?php checked( $settings['visual_effects']['3d_effects'] ?? false, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['visual_effects']['3d_effects'] ?? false ) ? 'true' : 'false'; ?>"
											aria-describedby="effects-3d-effects-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="effects-3d-effects-desc"><?php esc_html_e( 'Enable 3D transforms and perspective effects.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="effects-sound-effects">
										<?php esc_html_e( 'Sound Effects', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="effects-sound-effects"
											name="visual_effects[sound_effects]" 
											value="1"
											<?php checked( $settings['visual_effects']['sound_effects'] ?? false, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['visual_effects']['sound_effects'] ?? false ) ? 'true' : 'false'; ?>"
											aria-describedby="effects-sound-effects-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="effects-sound-effects-desc"><?php esc_html_e( 'Play subtle sound effects on interactions.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Performance Mode -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Performance Mode', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Optimize for performance by disabling resource-intensive effects.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="effects-performance-mode">
										<?php esc_html_e( 'Enable Performance Mode', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="effects-performance-mode"
											name="effects[performance_mode]" 
											value="1"
											<?php checked( $settings['effects']['performance_mode'] ?? false, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['effects']['performance_mode'] ?? false ) ? 'true' : 'false'; ?>"
											aria-describedby="effects-performance-mode-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="effects-performance-mode-desc"><?php esc_html_e( 'Disable all animations and effects for maximum performance.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="effects-focus-mode">
										<?php esc_html_e( 'Focus Mode', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="effects-focus-mode"
											name="effects[focus_mode]" 
											value="1"
											<?php checked( $settings['effects']['focus_mode'] ?? false, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['effects']['focus_mode'] ?? false ) ? 'true' : 'false'; ?>"
											aria-describedby="effects-focus-mode-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="effects-focus-mode-desc"><?php esc_html_e( 'Hide distractions and focus on content.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				
			</div><!-- #tab-effects -->

			<!-- ============================================ -->
			<!-- TEMPLATES TAB -->
			<!-- ============================================ -->
			<div class="mase-tab-content" id="tab-templates" data-tab-content="templates" role="tabpanel" aria-labelledby="tab-button-templates" tabindex="0">
				
				<!-- Full Template Gallery -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Template Gallery', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Browse and apply complete design templates. Each template includes colors, typography, and visual effects.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<div class="mase-template-gallery">
						<?php foreach ( $templates as $template_id => $template ) : ?>
							<div class="mase-template-card <?php echo ( $settings['templates']['current'] === $template_id ) ? 'active' : ''; ?>" data-template="<?php echo esc_attr( $template_id ); ?>" data-template-id="<?php echo esc_attr( $template_id ); ?>" role="article" aria-label="<?php echo esc_attr( $template['name'] ); ?>">
								<div class="mase-template-thumbnail">
									<?php if ( ! empty( $template['thumbnail'] ) ) : ?>
										<img src="<?php echo esc_attr( $template['thumbnail'] ); ?>" alt="<?php echo esc_attr( $template['name'] ); ?>" />
									<?php else : ?>
										<div class="mase-template-placeholder">
											<span class="dashicons dashicons-admin-appearance"></span>
										</div>
									<?php endif; ?>
									<?php if ( $settings['templates']['current'] === $template_id ) : ?>
										<span class="mase-active-badge"><?php esc_html_e( 'Active', 'modern-admin-styler' ); ?></span>
									<?php endif; ?>
								</div>
								<div class="mase-template-details">
									<h3><?php echo esc_html( $template['name'] ); ?></h3>
									<p class="description"><?php echo esc_html( $template['description'] ); ?></p>
									<?php if ( ! empty( $template['is_custom'] ) ) : ?>
										<span class="mase-custom-badge"><?php esc_html_e( 'Custom', 'modern-admin-styler' ); ?></span>
									<?php endif; ?>
								</div>
								<div class="mase-template-actions">
									<button type="button" class="button button-secondary mase-template-preview-btn" data-template-id="<?php echo esc_attr( $template_id ); ?>">
										<?php esc_html_e( 'Preview', 'modern-admin-styler' ); ?>
									</button>
									<button type="button" class="button button-primary mase-template-apply-btn" data-template-id="<?php echo esc_attr( $template_id ); ?>">
										<?php esc_html_e( 'Apply', 'modern-admin-styler' ); ?>
									</button>
									<?php if ( ! empty( $template['is_custom'] ) ) : ?>
										<button type="button" class="button button-link-delete mase-template-delete-btn" data-template-id="<?php echo esc_attr( $template_id ); ?>">
											<?php esc_html_e( 'Delete', 'modern-admin-styler' ); ?>
										</button>
									<?php endif; ?>
								</div>
							</div>
						<?php endforeach; ?>
					</div>
				</div>

				<!-- Save Custom Template -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Save Custom Template', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Save your current settings as a custom template for future use.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="custom-template-name">
										<?php esc_html_e( 'Template Name', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="text" 
										id="custom-template-name"
										class="regular-text"
										placeholder="<?php esc_attr_e( 'My Custom Template', 'modern-admin-styler' ); ?>"
									/>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="custom-template-description">
										<?php esc_html_e( 'Description', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<textarea 
										id="custom-template-description"
										class="large-text"
										rows="3"
										placeholder="<?php esc_attr_e( 'Describe your template...', 'modern-admin-styler' ); ?>"
									></textarea>
								</td>
							</tr>
							
							<tr>
								<th scope="row"></th>
								<td>
									<button type="button" id="mase-save-custom-template" class="button button-primary">
										<?php esc_html_e( 'Save as Template', 'modern-admin-styler' ); ?>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				
			</div><!-- #tab-templates -->

			<!-- ============================================ -->
			<!-- ADVANCED TAB -->
			<!-- ============================================ -->
			<div class="mase-tab-content" id="tab-advanced" data-tab-content="advanced" role="tabpanel" aria-labelledby="tab-button-advanced" tabindex="0">
				
				<!-- Custom CSS -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Custom CSS', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Add custom CSS to further customize your admin interface.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="advanced-custom-css">
										<?php esc_html_e( 'Custom CSS Code', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<textarea 
										id="advanced-custom-css"
										name="advanced[custom_css]" 
										class="large-text code"
										rows="10"
										placeholder="/* Add your custom CSS here */"
									><?php echo esc_textarea( $settings['advanced']['custom_css'] ?? '' ); ?></textarea>
									<p class="description"><?php esc_html_e( 'CSS will be sanitized and appended to generated styles.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Custom JavaScript -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Custom JavaScript', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Add custom JavaScript for advanced functionality.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="advanced-custom-js">
										<?php esc_html_e( 'Custom JavaScript Code', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<textarea 
										id="advanced-custom-js"
										name="advanced[custom_js]" 
										class="large-text code"
										rows="10"
										placeholder="// Add your custom JavaScript here"
									><?php echo esc_textarea( $settings['advanced']['custom_js'] ?? '' ); ?></textarea>
									<p class="description">
										<strong><?php esc_html_e( 'Warning:', 'modern-admin-styler' ); ?></strong> 
										<?php esc_html_e( 'Custom JavaScript can break your admin interface. Use with caution.', 'modern-admin-styler' ); ?>
									</p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Auto Palette Switching -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Auto Palette Switching', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Automatically switch color palettes based on time of day.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="advanced-auto-palette-switch">
										<?php esc_html_e( 'Enable Auto Switching', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="advanced-auto-palette-switch"
											name="advanced[auto_palette_switch]" 
											value="1"
											<?php checked( $settings['advanced']['auto_palette_switch'] ?? false, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['advanced']['auto_palette_switch'] ?? false ) ? 'true' : 'false'; ?>"
											aria-describedby="advanced-auto-palette-switch-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="advanced-auto-palette-switch-desc"><?php esc_html_e( 'Automatically change palettes based on time of day.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
							
							<tr class="mase-conditional" data-depends-on="advanced-auto-palette-switch">
								<th scope="row">
									<label for="auto-palette-morning">
										<?php esc_html_e( 'Morning (6:00-11:59)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<select id="auto-palette-morning" name="advanced[auto_palette_times][morning]">
										<?php foreach ( $palettes as $palette_id => $palette ) : ?>
											<option value="<?php echo esc_attr( $palette_id ); ?>" <?php selected( $settings['advanced']['auto_palette_times']['morning'] ?? '', $palette_id ); ?>>
												<?php echo esc_html( $palette['name'] ); ?>
											</option>
										<?php endforeach; ?>
									</select>
								</td>
							</tr>
							
							<tr class="mase-conditional" data-depends-on="advanced-auto-palette-switch">
								<th scope="row">
									<label for="auto-palette-afternoon">
										<?php esc_html_e( 'Afternoon (12:00-17:59)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<select id="auto-palette-afternoon" name="advanced[auto_palette_times][afternoon]">
										<?php foreach ( $palettes as $palette_id => $palette ) : ?>
											<option value="<?php echo esc_attr( $palette_id ); ?>" <?php selected( $settings['advanced']['auto_palette_times']['afternoon'] ?? '', $palette_id ); ?>>
												<?php echo esc_html( $palette['name'] ); ?>
											</option>
										<?php endforeach; ?>
									</select>
								</td>
							</tr>
							
							<tr class="mase-conditional" data-depends-on="advanced-auto-palette-switch">
								<th scope="row">
									<label for="auto-palette-evening">
										<?php esc_html_e( 'Evening (18:00-21:59)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<select id="auto-palette-evening" name="advanced[auto_palette_times][evening]">
										<?php foreach ( $palettes as $palette_id => $palette ) : ?>
											<option value="<?php echo esc_attr( $palette_id ); ?>" <?php selected( $settings['advanced']['auto_palette_times']['evening'] ?? '', $palette_id ); ?>>
												<?php echo esc_html( $palette['name'] ); ?>
											</option>
										<?php endforeach; ?>
									</select>
								</td>
							</tr>
							
							<tr class="mase-conditional" data-depends-on="advanced-auto-palette-switch">
								<th scope="row">
									<label for="auto-palette-night">
										<?php esc_html_e( 'Night (22:00-5:59)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<select id="auto-palette-night" name="advanced[auto_palette_times][night]">
										<?php foreach ( $palettes as $palette_id => $palette ) : ?>
											<option value="<?php echo esc_attr( $palette_id ); ?>" <?php selected( $settings['advanced']['auto_palette_times']['night'] ?? '', $palette_id ); ?>>
												<?php echo esc_html( $palette['name'] ); ?>
											</option>
										<?php endforeach; ?>
									</select>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Backup Controls -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Backup & Restore', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Manage backups of your settings.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="advanced-backup-enabled">
										<?php esc_html_e( 'Enable Automatic Backups', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="advanced-backup-enabled"
											name="advanced[backup_enabled]" 
											value="1"
											<?php checked( $settings['advanced']['backup_enabled'] ?? true, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['advanced']['backup_enabled'] ?? true ) ? 'true' : 'false'; ?>"
											aria-describedby="advanced-backup-enabled-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="advanced-backup-enabled-desc"><?php esc_html_e( 'Automatically create backups before major changes.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="advanced-backup-before-changes">
										<?php esc_html_e( 'Backup Before Changes', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<label class="mase-toggle-switch">
										<input 
											type="checkbox" 
											id="advanced-backup-before-changes"
											name="advanced[backup_before_changes]" 
											value="1"
											<?php checked( $settings['advanced']['backup_before_changes'] ?? true, true ); ?>
											role="switch"
											aria-checked="<?php echo ( $settings['advanced']['backup_before_changes'] ?? true ) ? 'true' : 'false'; ?>"
											aria-describedby="advanced-backup-before-changes-desc"
										/>
										<span class="mase-toggle-slider" aria-hidden="true"></span>
									</label>
									<p class="description" id="advanced-backup-before-changes-desc"><?php esc_html_e( 'Create backup before applying templates or importing settings.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<?php esc_html_e( 'Manual Backup', 'modern-admin-styler' ); ?>
								</th>
								<td>
									<button type="button" id="mase-create-backup" class="button button-secondary">
										<span class="dashicons dashicons-backup"></span>
										<?php esc_html_e( 'Create Backup Now', 'modern-admin-styler' ); ?>
									</button>
									<p class="description"><?php esc_html_e( 'Manually create a backup of current settings.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<?php esc_html_e( 'Restore Backup', 'modern-admin-styler' ); ?>
								</th>
								<td>
									<select id="mase-backup-list" class="regular-text">
										<option value=""><?php esc_html_e( 'Select a backup...', 'modern-admin-styler' ); ?></option>
										<!-- Backups will be populated via AJAX -->
									</select>
									<button type="button" id="mase-restore-backup" class="button button-secondary" disabled>
										<span class="dashicons dashicons-update"></span>
										<?php esc_html_e( 'Restore', 'modern-admin-styler' ); ?>
									</button>
									<p class="description"><?php esc_html_e( 'Restore settings from a previous backup.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Import/Export -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h2><?php esc_html_e( 'Import / Export', 'modern-admin-styler' ); ?></h2>
						<p class="description"><?php esc_html_e( 'Transfer settings between sites.', 'modern-admin-styler' ); ?></p>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<?php esc_html_e( 'Export Settings', 'modern-admin-styler' ); ?>
								</th>
								<td>
									<button type="button" id="mase-export-settings" class="button button-secondary">
										<span class="dashicons dashicons-download"></span>
										<?php esc_html_e( 'Export to JSON', 'modern-admin-styler' ); ?>
									</button>
									<p class="description"><?php esc_html_e( 'Download all settings as a JSON file.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<?php esc_html_e( 'Import Settings', 'modern-admin-styler' ); ?>
								</th>
								<td>
									<input type="file" id="mase-import-file" accept=".json" style="display: none;" />
									<button type="button" id="mase-import-settings" class="button button-secondary">
										<span class="dashicons dashicons-upload"></span>
										<?php esc_html_e( 'Import from JSON', 'modern-admin-styler' ); ?>
									</button>
									<p class="description"><?php esc_html_e( 'Import settings from a JSON file. This will overwrite current settings.', 'modern-admin-styler' ); ?></p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				
			</div><!-- #tab-advanced -->
			
		</div><!-- .mase-tab-content-wrapper -->
		
	</form><!-- #mase-settings-form -->
	
	<!-- Notices Container -->
	<div id="mase-notices-container"></div>
	
</div><!-- .wrap -->
