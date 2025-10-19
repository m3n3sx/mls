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

<div class="wrap mase-settings-wrap">
	<!-- Skip Navigation Link (Requirement 13.5) -->
	<a href="#mase-main-content" class="mase-skip-link">
		<?php esc_html_e( 'Skip to main content', 'modern-admin-styler' ); ?>
	</a>
	
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
							<div class="mase-template-preview-card <?php echo ( $settings['templates']['current'] === $template_id ) ? 'active' : ''; ?>" data-template-id="<?php echo esc_attr( $template_id ); ?>">
								<div class="mase-template-thumbnail">
									<?php if ( ! empty( $template['thumbnail'] ) ) : ?>
										<img src="<?php echo esc_url( $template['thumbnail'] ); ?>" alt="<?php echo esc_attr( $template['name'] ); ?>" />
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
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-border-radius">
										<?php esc_html_e( 'Border Radius (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-bar-border-radius"
										name="visual_effects[admin_bar][border_radius]" 
										value="<?php echo esc_attr( $settings['visual_effects']['admin_bar']['border_radius'] ?? 0 ); ?>"
										min="0"
										max="20"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['admin_bar']['border_radius'] ?? 0 ); ?>px</span>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-bar-shadow">
										<?php esc_html_e( 'Shadow Preset', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-bar-shadow" name="visual_effects[admin_bar][shadow]">
										<option value="none" <?php selected( $settings['visual_effects']['admin_bar']['shadow'] ?? 'none', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
										<option value="flat" <?php selected( $settings['visual_effects']['admin_bar']['shadow'] ?? 'none', 'flat' ); ?>><?php esc_html_e( 'Flat', 'modern-admin-styler' ); ?></option>
										<option value="subtle" <?php selected( $settings['visual_effects']['admin_bar']['shadow'] ?? 'none', 'subtle' ); ?>><?php esc_html_e( 'Subtle', 'modern-admin-styler' ); ?></option>
										<option value="elevated" <?php selected( $settings['visual_effects']['admin_bar']['shadow'] ?? 'none', 'elevated' ); ?>><?php esc_html_e( 'Elevated', 'modern-admin-styler' ); ?></option>
										<option value="floating" <?php selected( $settings['visual_effects']['admin_bar']['shadow'] ?? 'none', 'floating' ); ?>><?php esc_html_e( 'Floating', 'modern-admin-styler' ); ?></option>
									</select>
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
										<?php esc_html_e( 'Width (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="number" 
										id="admin-menu-width"
										name="admin_menu[width]" 
										class="small-text"
										value="<?php echo esc_attr( $settings['admin_menu']['width'] ); ?>"
										min="160"
										max="400"
										step="1"
									/>
									<p class="description"><?php esc_html_e( 'Default: 160px. Range: 160-400px.', 'modern-admin-styler' ); ?></p>
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
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-border-radius">
										<?php esc_html_e( 'Border Radius (px)', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<input 
										type="range" 
										id="admin-menu-border-radius"
										name="visual_effects[admin_menu][border_radius]" 
										value="<?php echo esc_attr( $settings['visual_effects']['admin_menu']['border_radius'] ?? 0 ); ?>"
										min="0"
										max="20"
										step="1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['admin_menu']['border_radius'] ?? 0 ); ?>px</span>
								</div>
							</div>
							
							<div class="mase-setting-row">
								<div class="mase-setting-label">
									<label for="admin-menu-shadow">
										<?php esc_html_e( 'Shadow Preset', 'modern-admin-styler' ); ?>
									</label>
								</div>
								<div class="mase-setting-control">
									<select id="admin-menu-shadow" name="visual_effects[admin_menu][shadow]">
										<option value="none" <?php selected( $settings['visual_effects']['admin_menu']['shadow'] ?? 'none', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
										<option value="flat" <?php selected( $settings['visual_effects']['admin_menu']['shadow'] ?? 'none', 'flat' ); ?>><?php esc_html_e( 'Flat', 'modern-admin-styler' ); ?></option>
										<option value="subtle" <?php selected( $settings['visual_effects']['admin_menu']['shadow'] ?? 'none', 'subtle' ); ?>><?php esc_html_e( 'Subtle', 'modern-admin-styler' ); ?></option>
										<option value="elevated" <?php selected( $settings['visual_effects']['admin_menu']['shadow'] ?? 'none', 'elevated' ); ?>><?php esc_html_e( 'Elevated', 'modern-admin-styler' ); ?></option>
										<option value="floating" <?php selected( $settings['visual_effects']['admin_menu']['shadow'] ?? 'none', 'floating' ); ?>><?php esc_html_e( 'Floating', 'modern-admin-styler' ); ?></option>
									</select>
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

				<!-- Admin Bar Typography (Detailed) -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h3><?php esc_html_e( 'Admin Bar Typography', 'modern-admin-styler' ); ?></h3>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="typo-admin-bar-font-size">
										<?php esc_html_e( 'Font Size (px)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="number" 
										id="typo-admin-bar-font-size"
										name="typography[admin_bar][font_size]" 
										class="small-text"
										value="<?php echo esc_attr( $settings['typography']['admin_bar']['font_size'] ); ?>"
										min="10"
										max="24"
										step="1"
									/>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typo-admin-bar-font-weight">
										<?php esc_html_e( 'Font Weight', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<select id="typo-admin-bar-font-weight" name="typography[admin_bar][font_weight]">
										<option value="300" <?php selected( $settings['typography']['admin_bar']['font_weight'], 300 ); ?>>300 (Light)</option>
										<option value="400" <?php selected( $settings['typography']['admin_bar']['font_weight'], 400 ); ?>>400 (Normal)</option>
										<option value="500" <?php selected( $settings['typography']['admin_bar']['font_weight'], 500 ); ?>>500 (Medium)</option>
										<option value="600" <?php selected( $settings['typography']['admin_bar']['font_weight'], 600 ); ?>>600 (Semi-Bold)</option>
										<option value="700" <?php selected( $settings['typography']['admin_bar']['font_weight'], 700 ); ?>>700 (Bold)</option>
									</select>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typo-admin-bar-line-height">
										<?php esc_html_e( 'Line Height', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="range" 
										id="typo-admin-bar-line-height"
										name="typography[admin_bar][line_height]" 
										value="<?php echo esc_attr( $settings['typography']['admin_bar']['line_height'] ); ?>"
										min="1.0"
										max="2.0"
										step="0.1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['typography']['admin_bar']['line_height'] ); ?></span>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typo-admin-bar-letter-spacing">
										<?php esc_html_e( 'Letter Spacing (px)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="range" 
										id="typo-admin-bar-letter-spacing"
										name="typography[admin_bar][letter_spacing]" 
										value="<?php echo esc_attr( $settings['typography']['admin_bar']['letter_spacing'] ); ?>"
										min="-2"
										max="5"
										step="0.5"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['typography']['admin_bar']['letter_spacing'] ); ?>px</span>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typo-admin-bar-text-transform">
										<?php esc_html_e( 'Text Transform', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<select id="typo-admin-bar-text-transform" name="typography[admin_bar][text_transform]">
										<option value="none" <?php selected( $settings['typography']['admin_bar']['text_transform'], 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
										<option value="uppercase" <?php selected( $settings['typography']['admin_bar']['text_transform'], 'uppercase' ); ?>><?php esc_html_e( 'Uppercase', 'modern-admin-styler' ); ?></option>
										<option value="lowercase" <?php selected( $settings['typography']['admin_bar']['text_transform'], 'lowercase' ); ?>><?php esc_html_e( 'Lowercase', 'modern-admin-styler' ); ?></option>
										<option value="capitalize" <?php selected( $settings['typography']['admin_bar']['text_transform'], 'capitalize' ); ?>><?php esc_html_e( 'Capitalize', 'modern-admin-styler' ); ?></option>
									</select>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Admin Menu Typography (Detailed) -->
				<div class="mase-section">
					<div class="mase-section-header">
						<h3><?php esc_html_e( 'Admin Menu Typography', 'modern-admin-styler' ); ?></h3>
					</div>
					
					<table class="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label for="typo-admin-menu-font-size">
										<?php esc_html_e( 'Font Size (px)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="number" 
										id="typo-admin-menu-font-size"
										name="typography[admin_menu][font_size]" 
										class="small-text"
										value="<?php echo esc_attr( $settings['typography']['admin_menu']['font_size'] ); ?>"
										min="10"
										max="24"
										step="1"
									/>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typo-admin-menu-font-weight">
										<?php esc_html_e( 'Font Weight', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<select id="typo-admin-menu-font-weight" name="typography[admin_menu][font_weight]">
										<option value="300" <?php selected( $settings['typography']['admin_menu']['font_weight'], 300 ); ?>>300 (Light)</option>
										<option value="400" <?php selected( $settings['typography']['admin_menu']['font_weight'], 400 ); ?>>400 (Normal)</option>
										<option value="500" <?php selected( $settings['typography']['admin_menu']['font_weight'], 500 ); ?>>500 (Medium)</option>
										<option value="600" <?php selected( $settings['typography']['admin_menu']['font_weight'], 600 ); ?>>600 (Semi-Bold)</option>
										<option value="700" <?php selected( $settings['typography']['admin_menu']['font_weight'], 700 ); ?>>700 (Bold)</option>
									</select>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typo-admin-menu-line-height">
										<?php esc_html_e( 'Line Height', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="range" 
										id="typo-admin-menu-line-height"
										name="typography[admin_menu][line_height]" 
										value="<?php echo esc_attr( $settings['typography']['admin_menu']['line_height'] ); ?>"
										min="1.0"
										max="2.0"
										step="0.1"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['typography']['admin_menu']['line_height'] ); ?></span>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typo-admin-menu-letter-spacing">
										<?php esc_html_e( 'Letter Spacing (px)', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<input 
										type="range" 
										id="typo-admin-menu-letter-spacing"
										name="typography[admin_menu][letter_spacing]" 
										value="<?php echo esc_attr( $settings['typography']['admin_menu']['letter_spacing'] ); ?>"
										min="-2"
										max="5"
										step="0.5"
									/>
									<span class="mase-range-value"><?php echo esc_html( $settings['typography']['admin_menu']['letter_spacing'] ); ?>px</span>
								</td>
							</tr>
							
							<tr>
								<th scope="row">
									<label for="typo-admin-menu-text-transform">
										<?php esc_html_e( 'Text Transform', 'modern-admin-styler' ); ?>
									</label>
								</th>
								<td>
									<select id="typo-admin-menu-text-transform" name="typography[admin_menu][text_transform]">
										<option value="none" <?php selected( $settings['typography']['admin_menu']['text_transform'], 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
										<option value="uppercase" <?php selected( $settings['typography']['admin_menu']['text_transform'], 'uppercase' ); ?>><?php esc_html_e( 'Uppercase', 'modern-admin-styler' ); ?></option>
										<option value="lowercase" <?php selected( $settings['typography']['admin_menu']['text_transform'], 'lowercase' ); ?>><?php esc_html_e( 'Lowercase', 'modern-admin-styler' ); ?></option>
										<option value="capitalize" <?php selected( $settings['typography']['admin_menu']['text_transform'], 'capitalize' ); ?>><?php esc_html_e( 'Capitalize', 'modern-admin-styler' ); ?></option>
									</select>
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
										<img src="<?php echo esc_url( $template['thumbnail'] ); ?>" alt="<?php echo esc_attr( $template['name'] ); ?>" />
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
