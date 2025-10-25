<?php
/**
 * Backgrounds Tab Content - Advanced Background System
 *
 * Provides UI for customizing backgrounds across 6 admin areas:
 * - Dashboard Main Area
 * - Admin Menu
 * - Post/Page Lists
 * - Post Editor
 * - Widget Areas
 * - Login Page
 *
 * Supports 3 background types:
 * - Image uploads (with Media Library integration)
 * - Gradients (with visual builder)
 * - SVG Patterns (from pattern library)
 *
 * @package ModernAdminStyler
 * @since 1.3.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Get current settings
$bg_settings = $settings['custom_backgrounds'] ?? array();

// Define admin areas with labels and descriptions
$admin_areas = array(
	'dashboard'   => array(
		'label'       => __( 'Dashboard Main Area', 'modern-admin-styler' ),
		'description' => __( 'Customize the background of the main dashboard content area (#wpbody-content).', 'modern-admin-styler' ),
		'icon'        => 'dashicons-dashboard',
	),
	'admin_menu'  => array(
		'label'       => __( 'Admin Menu', 'modern-admin-styler' ),
		'description' => __( 'Customize the background of the left sidebar admin menu (#adminmenu).', 'modern-admin-styler' ),
		'icon'        => 'dashicons-menu',
	),
	'post_lists'  => array(
		'label'       => __( 'Post/Page Lists', 'modern-admin-styler' ),
		'description' => __( 'Customize the background of post and page list tables (.wp-list-table).', 'modern-admin-styler' ),
		'icon'        => 'dashicons-list-view',
	),
	'post_editor' => array(
		'label'       => __( 'Post Editor', 'modern-admin-styler' ),
		'description' => __( 'Customize the background of the post/page editor area (#post-body).', 'modern-admin-styler' ),
		'icon'        => 'dashicons-edit',
	),
	'widgets'     => array(
		'label'       => __( 'Widget Areas', 'modern-admin-styler' ),
		'description' => __( 'Customize the background of widget boxes and meta boxes (.postbox).', 'modern-admin-styler' ),
		'icon'        => 'dashicons-admin-generic',
	),
	'login'       => array(
		'label'       => __( 'Login Page', 'modern-admin-styler' ),
		'description' => __( 'Customize the background of the WordPress login page (body.login).', 'modern-admin-styler' ),
		'icon'        => 'dashicons-lock',
	),
);
?>

<!-- Backgrounds Tab Content -->
<div class="mase-backgrounds-wrapper">
	
	<!-- Tab Introduction -->
	<div class="mase-section">
		<div class="mase-section-header">
			<h2><?php esc_html_e( 'Custom Backgrounds', 'modern-admin-styler' ); ?></h2>
			<p class="description">
				<?php esc_html_e( 'Customize backgrounds for different admin areas with images, gradients, or patterns. Each area can be configured independently with advanced styling options.', 'modern-admin-styler' ); ?>
			</p>
		</div>
	</div>

	<!-- Admin Areas Accordion -->
	<div class="mase-backgrounds-accordion">
		<?php foreach ( $admin_areas as $area_id => $area_config ) : 
			$area_settings = $bg_settings[ $area_id ] ?? array();
			$is_enabled = $area_settings['enabled'] ?? false;
			$bg_type = $area_settings['type'] ?? 'none';
		?>
		
		<div class="mase-background-area-section" data-area="<?php echo esc_attr( $area_id ); ?>">
			
			<!-- Area Header -->
			<div class="mase-background-area-header">
				<div class="mase-background-area-title">
					<span class="dashicons <?php echo esc_attr( $area_config['icon'] ); ?>" aria-hidden="true"></span>
					<h3><?php echo esc_html( $area_config['label'] ); ?></h3>
					<?php if ( $is_enabled ) : ?>
						<span class="mase-badge mase-badge-success" role="status">
							<?php esc_html_e( 'Enabled', 'modern-admin-styler' ); ?>
						</span>
					<?php endif; ?>
				</div>
				<div class="mase-background-area-controls">
					<!-- Enable/Disable Toggle -->
					<label class="mase-toggle-switch" aria-label="<?php echo esc_attr( sprintf( __( 'Enable background for %s', 'modern-admin-styler' ), $area_config['label'] ) ); ?>">
						<input 
							type="checkbox" 
							name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][enabled]"
							value="1"
							<?php checked( $is_enabled, true ); ?>
							class="mase-background-enable-toggle"
							data-area="<?php echo esc_attr( $area_id ); ?>"
							role="switch"
							aria-checked="<?php echo $is_enabled ? 'true' : 'false'; ?>"
						/>
						<span class="mase-toggle-slider" aria-hidden="true"></span>
					</label>
					<!-- Expand/Collapse Button -->
					<button 
						type="button" 
						class="mase-background-area-toggle"
						aria-expanded="false"
						aria-controls="background-area-content-<?php echo esc_attr( $area_id ); ?>"
						aria-label="<?php echo esc_attr( sprintf( __( 'Toggle %s settings', 'modern-admin-styler' ), $area_config['label'] ) ); ?>"
					>
						<span class="dashicons dashicons-arrow-down-alt2" aria-hidden="true"></span>
					</button>
				</div>
			</div>

			<!-- Area Content (Collapsible) -->
			<div 
				class="mase-background-area-content" 
				id="background-area-content-<?php echo esc_attr( $area_id ); ?>"
				style="display: none;"
			>
				<div class="mase-background-config" data-area="<?php echo esc_attr( $area_id ); ?>">
					
					<p class="description"><?php echo esc_html( $area_config['description'] ); ?></p>

					<!-- Background Type Selector -->
					<div class="mase-setting-row">
						<div class="mase-setting-label">
							<label for="bg-type-<?php echo esc_attr( $area_id ); ?>">
								<?php esc_html_e( 'Background Type', 'modern-admin-styler' ); ?>
							</label>
						</div>
						<div class="mase-setting-control">
							<select 
								id="bg-type-<?php echo esc_attr( $area_id ); ?>"
								name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][type]"
								class="mase-background-type-selector"
								data-area="<?php echo esc_attr( $area_id ); ?>"
								aria-describedby="bg-type-desc-<?php echo esc_attr( $area_id ); ?>"
							>
								<option value="none" <?php selected( $bg_type, 'none' ); ?>>
									<?php esc_html_e( 'None (Disabled)', 'modern-admin-styler' ); ?>
								</option>
								<option value="image" <?php selected( $bg_type, 'image' ); ?>>
									<?php esc_html_e( 'Image Upload', 'modern-admin-styler' ); ?>
								</option>
								<option value="gradient" <?php selected( $bg_type, 'gradient' ); ?>>
									<?php esc_html_e( 'Gradient', 'modern-admin-styler' ); ?>
								</option>
								<option value="pattern" <?php selected( $bg_type, 'pattern' ); ?>>
									<?php esc_html_e( 'SVG Pattern', 'modern-admin-styler' ); ?>
								</option>
							</select>
							<p class="description" id="bg-type-desc-<?php echo esc_attr( $area_id ); ?>">
								<?php esc_html_e( 'Choose the type of background to apply to this area.', 'modern-admin-styler' ); ?>
							</p>
						</div>
					</div>

					<!-- Image Background Controls (shown when type = image) -->
					<div 
						class="mase-background-type-controls mase-background-image-controls" 
						data-type="image"
						style="display: <?php echo ( $bg_type === 'image' ) ? 'block' : 'none'; ?>;"
					>
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label><?php esc_html_e( 'Background Image', 'modern-admin-styler' ); ?></label>
							</div>
							<div class="mase-setting-control">
								
								<!-- Drag & Drop Upload Zone -->
								<div 
									class="mase-background-upload-zone" 
									data-area="<?php echo esc_attr( $area_id ); ?>"
									style="display: <?php echo empty( $area_settings['image_url'] ) ? 'block' : 'none'; ?>;"
									role="button"
									tabindex="0"
									aria-label="<?php esc_attr_e( 'Upload or select background image. Click to open media library or drag and drop an image file.', 'modern-admin-styler' ); ?>"
								>
									<div class="mase-upload-zone-content">
										<span class="dashicons dashicons-cloud-upload" aria-hidden="true"></span>
										<p class="mase-upload-zone-text">
											<strong><?php esc_html_e( 'Drop image here or click to upload', 'modern-admin-styler' ); ?></strong>
										</p>
										<p class="mase-upload-zone-hint">
											<?php esc_html_e( 'Supported: JPG, PNG, WebP, SVG • Max size: 5MB', 'modern-admin-styler' ); ?>
										</p>
									</div>
									
									<!-- Hidden file input for click-to-upload -->
									<input 
										type="file" 
										class="mase-background-file-input"
										accept="image/jpeg,image/png,image/webp,image/svg+xml"
										data-area="<?php echo esc_attr( $area_id ); ?>"
										style="display: none;"
										aria-hidden="true"
									/>
									
									<!-- Upload Progress Indicator -->
									<div class="mase-upload-progress" style="display: none;">
										<div class="mase-upload-progress-bar">
											<div class="mase-upload-progress-fill" style="width: 0%;"></div>
										</div>
										<p class="mase-upload-progress-text">
											<?php esc_html_e( 'Uploading...', 'modern-admin-styler' ); ?>
											<span class="mase-upload-progress-percent">0%</span>
										</p>
									</div>
								</div>
								
								<!-- Validation Error Display -->
								<div 
									class="mase-upload-error" 
									data-area="<?php echo esc_attr( $area_id ); ?>"
									style="display: none;"
									role="alert"
									aria-live="assertive"
								>
									<span class="dashicons dashicons-warning" aria-hidden="true"></span>
									<span class="mase-upload-error-message"></span>
								</div>
								
								<!-- Image Preview (shown when image is selected) -->
								<div 
									class="mase-background-image-preview" 
									data-area="<?php echo esc_attr( $area_id ); ?>"
									style="display: <?php echo ! empty( $area_settings['image_url'] ) ? 'block' : 'none'; ?>;"
								>
									<div class="mase-preview-thumbnail">
										<?php if ( ! empty( $area_settings['image_url'] ) ) : ?>
											<img src="<?php echo esc_url( $area_settings['image_url'] ); ?>" alt="<?php esc_attr_e( 'Background preview', 'modern-admin-styler' ); ?>" />
										<?php endif; ?>
									</div>
									<div class="mase-preview-actions">
										<button 
											type="button" 
											class="button button-secondary mase-change-image-btn"
											data-area="<?php echo esc_attr( $area_id ); ?>"
											aria-label="<?php esc_attr_e( 'Change background image', 'modern-admin-styler' ); ?>"
										>
											<span class="dashicons dashicons-edit" aria-hidden="true"></span>
											<?php esc_html_e( 'Change Image', 'modern-admin-styler' ); ?>
										</button>
										<button 
											type="button" 
											class="button button-link-delete mase-remove-image-btn"
											data-area="<?php echo esc_attr( $area_id ); ?>"
											aria-label="<?php esc_attr_e( 'Remove background image', 'modern-admin-styler' ); ?>"
										>
											<span class="dashicons dashicons-no-alt" aria-hidden="true"></span>
											<?php esc_html_e( 'Remove', 'modern-admin-styler' ); ?>
										</button>
									</div>
								</div>

								<!-- Hidden fields for image data -->
								<input 
									type="hidden" 
									name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][image_url]"
									class="mase-background-image-url"
									value="<?php echo esc_attr( $area_settings['image_url'] ?? '' ); ?>"
								/>
								<input 
									type="hidden" 
									name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][image_id]"
									class="mase-background-image-id"
									value="<?php echo esc_attr( $area_settings['image_id'] ?? 0 ); ?>"
								/>
							</div>
						</div>
					</div>

					<!-- Gradient Background Controls (shown when type = gradient) -->
					<div 
						class="mase-background-type-controls mase-background-gradient-controls" 
						data-type="gradient"
						style="display: <?php echo ( $bg_type === 'gradient' ) ? 'block' : 'none'; ?>;"
					>
						<!-- Gradient Type Selector -->
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label for="gradient-type-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Gradient Type', 'modern-admin-styler' ); ?>
								</label>
							</div>
							<div class="mase-setting-control">
								<select 
									id="gradient-type-<?php echo esc_attr( $area_id ); ?>"
									name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][gradient_type]"
									class="mase-gradient-type"
									data-area="<?php echo esc_attr( $area_id ); ?>"
								>
									<option value="linear" <?php selected( $area_settings['gradient_type'] ?? 'linear', 'linear' ); ?>>
										<?php esc_html_e( 'Linear Gradient', 'modern-admin-styler' ); ?>
									</option>
									<option value="radial" <?php selected( $area_settings['gradient_type'] ?? 'linear', 'radial' ); ?>>
										<?php esc_html_e( 'Radial Gradient', 'modern-admin-styler' ); ?>
									</option>
								</select>
								<p class="description">
									<?php esc_html_e( 'Choose between linear (directional) or radial (circular) gradient.', 'modern-admin-styler' ); ?>
								</p>
							</div>
						</div>

						<!-- Angle Control (for linear gradients only) -->
						<div 
							class="mase-setting-row mase-gradient-angle-row" 
							style="display: <?php echo ( ( $area_settings['gradient_type'] ?? 'linear' ) === 'linear' ) ? 'flex' : 'none'; ?>;"
						>
							<div class="mase-setting-label">
								<label for="gradient-angle-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Gradient Angle', 'modern-admin-styler' ); ?>
								</label>
							</div>
							<div class="mase-setting-control">
								<div class="mase-gradient-angle-control">
									<!-- Visual Dial -->
									<div class="mase-gradient-angle-dial-container">
										<div 
											class="mase-gradient-angle-dial" 
											data-area="<?php echo esc_attr( $area_id ); ?>"
											style="transform: rotate(<?php echo esc_attr( $area_settings['gradient_angle'] ?? 90 ); ?>deg);"
											role="img"
											aria-label="<?php esc_attr_e( 'Gradient angle visual indicator', 'modern-admin-styler' ); ?>"
										>
											<div class="mase-dial-pointer"></div>
										</div>
									</div>
									<!-- Numeric Input -->
									<div class="mase-gradient-angle-input-container">
										<input 
											type="number" 
											id="gradient-angle-<?php echo esc_attr( $area_id ); ?>"
											name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][gradient_angle]"
											class="mase-gradient-angle-input"
											data-area="<?php echo esc_attr( $area_id ); ?>"
											value="<?php echo esc_attr( $area_settings['gradient_angle'] ?? 90 ); ?>"
											min="0"
											max="360"
											step="1"
											aria-describedby="gradient-angle-desc-<?php echo esc_attr( $area_id ); ?>"
										/>
										<span class="mase-input-suffix">°</span>
									</div>
								</div>
								<p class="description" id="gradient-angle-desc-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Set the gradient direction (0-360 degrees). Drag the dial or enter a value.', 'modern-admin-styler' ); ?>
								</p>
							</div>
						</div>

						<!-- Color Stops -->
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label><?php esc_html_e( 'Color Stops', 'modern-admin-styler' ); ?></label>
							</div>
							<div class="mase-setting-control">
								<div class="mase-gradient-color-stops" data-area="<?php echo esc_attr( $area_id ); ?>">
									<?php
									// Get existing color stops or use defaults
									$color_stops = $area_settings['gradient_colors'] ?? array(
										array( 'color' => '#667eea', 'position' => 0 ),
										array( 'color' => '#764ba2', 'position' => 100 ),
									);
									
									foreach ( $color_stops as $index => $stop ) :
									?>
									<div class="mase-color-stop" data-index="<?php echo esc_attr( $index ); ?>">
										<div class="mase-color-stop-color">
											<input 
												type="text" 
												name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][gradient_colors][<?php echo esc_attr( $index ); ?>][color]"
												class="mase-color-picker"
												value="<?php echo esc_attr( $stop['color'] ); ?>"
												data-default-color="<?php echo esc_attr( $stop['color'] ); ?>"
												aria-label="<?php echo esc_attr( sprintf( __( 'Color stop %d color', 'modern-admin-styler' ), $index + 1 ) ); ?>"
											/>
										</div>
										<div class="mase-color-stop-position">
											<input 
												type="number" 
												name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][gradient_colors][<?php echo esc_attr( $index ); ?>][position]"
												class="mase-stop-position"
												value="<?php echo esc_attr( $stop['position'] ); ?>"
												min="0"
												max="100"
												step="1"
												aria-label="<?php echo esc_attr( sprintf( __( 'Color stop %d position', 'modern-admin-styler' ), $index + 1 ) ); ?>"
											/>
											<span class="mase-input-suffix">%</span>
										</div>
										<button 
											type="button" 
											class="button button-link-delete mase-remove-color-stop"
											data-area="<?php echo esc_attr( $area_id ); ?>"
											aria-label="<?php echo esc_attr( sprintf( __( 'Remove color stop %d', 'modern-admin-styler' ), $index + 1 ) ); ?>"
											<?php echo ( count( $color_stops ) <= 2 ) ? 'disabled' : ''; ?>
										>
											<span class="dashicons dashicons-no-alt" aria-hidden="true"></span>
										</button>
									</div>
									<?php endforeach; ?>
								</div>
								
								<button 
									type="button" 
									class="button button-secondary mase-add-color-stop"
									data-area="<?php echo esc_attr( $area_id ); ?>"
									<?php echo ( count( $color_stops ) >= 10 ) ? 'disabled' : ''; ?>
								>
									<span class="dashicons dashicons-plus-alt" aria-hidden="true"></span>
									<?php esc_html_e( 'Add Color Stop', 'modern-admin-styler' ); ?>
								</button>
								
								<p class="description">
									<?php esc_html_e( 'Add 2-10 color stops to create your gradient. Adjust position (0-100%) for each color.', 'modern-admin-styler' ); ?>
								</p>
							</div>
						</div>

						<!-- Gradient Presets -->
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label><?php esc_html_e( 'Gradient Presets', 'modern-admin-styler' ); ?></label>
							</div>
							<div class="mase-setting-control">
								<!-- Category Filter -->
								<div class="mase-gradient-preset-filter">
									<select 
										class="mase-gradient-category-filter" 
										data-area="<?php echo esc_attr( $area_id ); ?>"
										aria-label="<?php esc_attr_e( 'Filter gradient presets by category', 'modern-admin-styler' ); ?>"
									>
										<option value="all"><?php esc_html_e( 'All Categories', 'modern-admin-styler' ); ?></option>
										<option value="warm"><?php esc_html_e( 'Warm', 'modern-admin-styler' ); ?></option>
										<option value="cool"><?php esc_html_e( 'Cool', 'modern-admin-styler' ); ?></option>
										<option value="vibrant"><?php esc_html_e( 'Vibrant', 'modern-admin-styler' ); ?></option>
										<option value="subtle"><?php esc_html_e( 'Subtle', 'modern-admin-styler' ); ?></option>
										<option value="nature"><?php esc_html_e( 'Nature', 'modern-admin-styler' ); ?></option>
										<option value="radial"><?php esc_html_e( 'Radial', 'modern-admin-styler' ); ?></option>
									</select>
								</div>
								
								<!-- Preset Grid -->
								<div 
									class="mase-gradient-preset-grid" 
									data-area="<?php echo esc_attr( $area_id ); ?>"
									role="list"
									aria-label="<?php esc_attr_e( 'Gradient preset options', 'modern-admin-styler' ); ?>"
								>
									<!-- Presets will be populated via JavaScript -->
								</div>
								
								<p class="description">
									<?php esc_html_e( 'Click a preset to apply it instantly. You can customize the colors after applying.', 'modern-admin-styler' ); ?>
								</p>
							</div>
						</div>

						<!-- Gradient Preview -->
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label><?php esc_html_e( 'Gradient Preview', 'modern-admin-styler' ); ?></label>
							</div>
							<div class="mase-setting-control">
								<div 
									class="mase-gradient-preview" 
									data-area="<?php echo esc_attr( $area_id ); ?>"
									role="img"
									aria-label="<?php esc_attr_e( 'Live gradient preview', 'modern-admin-styler' ); ?>"
								>
									<!-- Preview will be updated via JavaScript -->
								</div>
								<p class="description">
									<?php esc_html_e( 'Live preview of your gradient configuration.', 'modern-admin-styler' ); ?>
								</p>
							</div>
						</div>
					</div>

					<!-- Pattern Background Controls (shown when type = pattern) -->
					<div 
						class="mase-background-type-controls mase-background-pattern-controls" 
						data-type="pattern"
						style="display: <?php echo ( $bg_type === 'pattern' ) ? 'block' : 'none'; ?>;"
					>
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label><?php esc_html_e( 'Pattern Selection', 'modern-admin-styler' ); ?></label>
							</div>
							<div class="mase-setting-control">
								<p class="description">
									<?php esc_html_e( 'Pattern library will be available in the next phase. For now, you can enable this type to prepare for pattern support.', 'modern-admin-styler' ); ?>
								</p>
							</div>
						</div>
					</div>

					<!-- Preview Container -->
					<div class="mase-background-preview-container" data-area="<?php echo esc_attr( $area_id ); ?>">
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label><?php esc_html_e( 'Preview', 'modern-admin-styler' ); ?></label>
							</div>
							<div class="mase-setting-control">
								<div class="mase-background-preview-box" data-area="<?php echo esc_attr( $area_id ); ?>">
									<p class="description">
										<?php esc_html_e( 'Background preview will appear here when configured.', 'modern-admin-styler' ); ?>
									</p>
								</div>
							</div>
						</div>
					</div>

				</div><!-- .mase-background-config -->
			</div><!-- .mase-background-area-content -->

		</div><!-- .mase-background-area-section -->

		<?php endforeach; ?>
	</div><!-- .mase-backgrounds-accordion -->

</div><!-- .mase-backgrounds-wrapper -->
