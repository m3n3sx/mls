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
		
		<!-- Responsive Preview Controls (Task 29 - Requirement 6.4) -->
		<div class="mase-responsive-preview-controls">
			<div class="mase-preview-controls-header">
				<h3><?php esc_html_e( 'Preview Device', 'modern-admin-styler' ); ?></h3>
				<p class="description">
					<?php esc_html_e( 'Switch between device sizes to preview responsive background variations.', 'modern-admin-styler' ); ?>
				</p>
			</div>
			
			<div class="mase-device-preview-buttons">
				<!-- Desktop Button -->
				<button 
					type="button" 
					class="button mase-device-preview-btn active" 
					data-device="desktop"
					aria-pressed="true"
					aria-label="<?php esc_attr_e( 'Preview desktop view (1024px and above)', 'modern-admin-styler' ); ?>"
				>
					<span class="dashicons dashicons-desktop" aria-hidden="true"></span>
					<span class="mase-device-label"><?php esc_html_e( 'Desktop', 'modern-admin-styler' ); ?></span>
				</button>
				
				<!-- Tablet Button -->
				<button 
					type="button" 
					class="button mase-device-preview-btn" 
					data-device="tablet"
					aria-pressed="false"
					aria-label="<?php esc_attr_e( 'Preview tablet view (768px to 1023px)', 'modern-admin-styler' ); ?>"
				>
					<span class="dashicons dashicons-tablet" aria-hidden="true"></span>
					<span class="mase-device-label"><?php esc_html_e( 'Tablet', 'modern-admin-styler' ); ?></span>
				</button>
				
				<!-- Mobile Button -->
				<button 
					type="button" 
					class="button mase-device-preview-btn" 
					data-device="mobile"
					aria-pressed="false"
					aria-label="<?php esc_attr_e( 'Preview mobile view (below 768px)', 'modern-admin-styler' ); ?>"
				>
					<span class="dashicons dashicons-smartphone" aria-hidden="true"></span>
					<span class="mase-device-label"><?php esc_html_e( 'Mobile', 'modern-admin-styler' ); ?></span>
				</button>
			</div>
			
			<!-- Breakpoint Indicator -->
			<div 
				class="mase-breakpoint-indicator device-desktop" 
				role="status" 
				aria-live="polite"
				aria-label="<?php esc_attr_e( 'Current preview device: Desktop (≥1024px)', 'modern-admin-styler' ); ?>"
			>
				<span class="dashicons dashicons-visibility" aria-hidden="true"></span>
				<span class="mase-breakpoint-label"><?php esc_html_e( 'Desktop (≥1024px)', 'modern-admin-styler' ); ?></span>
			</div>
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

						<!-- Position Picker (Task 25 - Requirements 9.1, 9.2, 9.3, 9.4, 9.5) -->
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label for="bg-position-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Background Position', 'modern-admin-styler' ); ?>
								</label>
							</div>
							<div class="mase-setting-control">
								<!-- 3x3 Position Grid (Requirement 9.1) -->
								<div class="mase-position-picker-grid" data-area="<?php echo esc_attr( $area_id ); ?>">
									<?php
									$current_position = $area_settings['position'] ?? 'center center';
									$grid_positions = array(
										array( 'value' => 'left top', 'label' => __( 'Top Left', 'modern-admin-styler' ) ),
										array( 'value' => 'center top', 'label' => __( 'Top Center', 'modern-admin-styler' ) ),
										array( 'value' => 'right top', 'label' => __( 'Top Right', 'modern-admin-styler' ) ),
										array( 'value' => 'left center', 'label' => __( 'Center Left', 'modern-admin-styler' ) ),
										array( 'value' => 'center center', 'label' => __( 'Center', 'modern-admin-styler' ) ),
										array( 'value' => 'right center', 'label' => __( 'Center Right', 'modern-admin-styler' ) ),
										array( 'value' => 'left bottom', 'label' => __( 'Bottom Left', 'modern-admin-styler' ) ),
										array( 'value' => 'center bottom', 'label' => __( 'Bottom Center', 'modern-admin-styler' ) ),
										array( 'value' => 'right bottom', 'label' => __( 'Bottom Right', 'modern-admin-styler' ) ),
									);
									
									foreach ( $grid_positions as $position ) :
										$is_selected = ( $current_position === $position['value'] );
									?>
									<button 
										type="button"
										class="mase-position-grid-cell <?php echo $is_selected ? 'selected' : ''; ?>"
										data-position="<?php echo esc_attr( $position['value'] ); ?>"
										data-area="<?php echo esc_attr( $area_id ); ?>"
										aria-label="<?php echo esc_attr( $position['label'] ); ?>"
										aria-pressed="<?php echo $is_selected ? 'true' : 'false'; ?>"
										title="<?php echo esc_attr( $position['label'] ); ?>"
									>
										<span class="mase-position-cell-dot" aria-hidden="true"></span>
									</button>
									<?php endforeach; ?>
								</div>

								<!-- Custom Position Inputs (Requirement 9.3) -->
								<div class="mase-custom-position-inputs">
									<label class="mase-custom-position-label">
										<?php esc_html_e( 'Custom Position:', 'modern-admin-styler' ); ?>
									</label>
									<div class="mase-custom-position-fields">
										<div class="mase-custom-position-field">
											<label for="bg-position-x-<?php echo esc_attr( $area_id ); ?>" class="screen-reader-text">
												<?php esc_html_e( 'Horizontal position (X)', 'modern-admin-styler' ); ?>
											</label>
											<input 
												type="number" 
												id="bg-position-x-<?php echo esc_attr( $area_id ); ?>"
												class="mase-position-x"
												data-area="<?php echo esc_attr( $area_id ); ?>"
												placeholder="50"
												min="0"
												max="100"
												step="1"
												aria-label="<?php esc_attr_e( 'Horizontal position percentage (0-100)', 'modern-admin-styler' ); ?>"
											/>
											<span class="mase-input-suffix">% X</span>
										</div>
										<div class="mase-custom-position-field">
											<label for="bg-position-y-<?php echo esc_attr( $area_id ); ?>" class="screen-reader-text">
												<?php esc_html_e( 'Vertical position (Y)', 'modern-admin-styler' ); ?>
											</label>
											<input 
												type="number" 
												id="bg-position-y-<?php echo esc_attr( $area_id ); ?>"
												class="mase-position-y"
												data-area="<?php echo esc_attr( $area_id ); ?>"
												placeholder="50"
												min="0"
												max="100"
												step="1"
												aria-label="<?php esc_attr_e( 'Vertical position percentage (0-100)', 'modern-admin-styler' ); ?>"
											/>
											<span class="mase-input-suffix">% Y</span>
										</div>
									</div>
								</div>

								<!-- Hidden field for position value (Requirement 9.2) -->
								<input 
									type="hidden" 
									id="bg-position-<?php echo esc_attr( $area_id ); ?>"
									name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][position]"
									class="mase-background-position"
									data-area="<?php echo esc_attr( $area_id ); ?>"
									value="<?php echo esc_attr( $current_position ); ?>"
								/>

								<p class="description">
									<?php esc_html_e( 'Click a position in the grid or enter custom X/Y percentages (0-100).', 'modern-admin-styler' ); ?>
								</p>
							</div>
						</div>

						<!-- Background Size (Task 26 - Requirement 5.4) -->
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label for="bg-size-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Background Size', 'modern-admin-styler' ); ?>
								</label>
							</div>
							<div class="mase-setting-control">
								<select 
									id="bg-size-<?php echo esc_attr( $area_id ); ?>"
									name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][size]"
									class="mase-background-size"
									data-area="<?php echo esc_attr( $area_id ); ?>"
									aria-describedby="bg-size-desc-<?php echo esc_attr( $area_id ); ?>"
								>
									<option value="cover" <?php selected( $area_settings['size'] ?? 'cover', 'cover' ); ?>>
										<?php esc_html_e( 'Cover (Fill entire area)', 'modern-admin-styler' ); ?>
									</option>
									<option value="contain" <?php selected( $area_settings['size'] ?? 'cover', 'contain' ); ?>>
										<?php esc_html_e( 'Contain (Fit within area)', 'modern-admin-styler' ); ?>
									</option>
									<option value="auto" <?php selected( $area_settings['size'] ?? 'cover', 'auto' ); ?>>
										<?php esc_html_e( 'Auto (Original size)', 'modern-admin-styler' ); ?>
									</option>
									<option value="custom" <?php selected( $area_settings['size'] ?? 'cover', 'custom' ); ?>>
										<?php esc_html_e( 'Custom', 'modern-admin-styler' ); ?>
									</option>
								</select>
								
								<!-- Custom Size Input (shown when size = custom) -->
								<div 
									class="mase-custom-size-input" 
									style="display: <?php echo ( ( $area_settings['size'] ?? 'cover' ) === 'custom' ) ? 'block' : 'none'; ?>; margin-top: 8px;"
								>
									<input 
										type="text" 
										name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][size_custom]"
										class="mase-background-size-custom"
										data-area="<?php echo esc_attr( $area_id ); ?>"
										value="<?php echo esc_attr( $area_settings['size_custom'] ?? '100% auto' ); ?>"
										placeholder="100% auto"
										aria-label="<?php esc_attr_e( 'Custom background size (e.g., 100% auto, 200px 150px)', 'modern-admin-styler' ); ?>"
									/>
									<p class="description">
										<?php esc_html_e( 'Enter custom size (e.g., "100% auto", "200px 150px").', 'modern-admin-styler' ); ?>
									</p>
								</div>
								
								<p class="description" id="bg-size-desc-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Control how the background image is sized within the area.', 'modern-admin-styler' ); ?>
								</p>
							</div>
						</div>

						<!-- Background Repeat (Task 26 - Requirement 5.4) -->
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label for="bg-repeat-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Background Repeat', 'modern-admin-styler' ); ?>
								</label>
							</div>
							<div class="mase-setting-control">
								<select 
									id="bg-repeat-<?php echo esc_attr( $area_id ); ?>"
									name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][repeat]"
									class="mase-background-repeat"
									data-area="<?php echo esc_attr( $area_id ); ?>"
									aria-describedby="bg-repeat-desc-<?php echo esc_attr( $area_id ); ?>"
								>
									<option value="no-repeat" <?php selected( $area_settings['repeat'] ?? 'no-repeat', 'no-repeat' ); ?>>
										<?php esc_html_e( 'No Repeat', 'modern-admin-styler' ); ?>
									</option>
									<option value="repeat" <?php selected( $area_settings['repeat'] ?? 'no-repeat', 'repeat' ); ?>>
										<?php esc_html_e( 'Repeat (Both directions)', 'modern-admin-styler' ); ?>
									</option>
									<option value="repeat-x" <?php selected( $area_settings['repeat'] ?? 'no-repeat', 'repeat-x' ); ?>>
										<?php esc_html_e( 'Repeat Horizontally', 'modern-admin-styler' ); ?>
									</option>
									<option value="repeat-y" <?php selected( $area_settings['repeat'] ?? 'no-repeat', 'repeat-y' ); ?>>
										<?php esc_html_e( 'Repeat Vertically', 'modern-admin-styler' ); ?>
									</option>
								</select>
								<p class="description" id="bg-repeat-desc-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Control whether and how the background image repeats.', 'modern-admin-styler' ); ?>
								</p>
							</div>
						</div>

						<!-- Background Attachment (Task 26 - Requirement 5.4) -->
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label for="bg-attachment-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Background Attachment', 'modern-admin-styler' ); ?>
								</label>
							</div>
							<div class="mase-setting-control">
								<select 
									id="bg-attachment-<?php echo esc_attr( $area_id ); ?>"
									name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][attachment]"
									class="mase-background-attachment"
									data-area="<?php echo esc_attr( $area_id ); ?>"
									aria-describedby="bg-attachment-desc-<?php echo esc_attr( $area_id ); ?>"
								>
									<option value="scroll" <?php selected( $area_settings['attachment'] ?? 'scroll', 'scroll' ); ?>>
										<?php esc_html_e( 'Scroll (Moves with content)', 'modern-admin-styler' ); ?>
									</option>
									<option value="fixed" <?php selected( $area_settings['attachment'] ?? 'scroll', 'fixed' ); ?>>
										<?php esc_html_e( 'Fixed (Stays in place)', 'modern-admin-styler' ); ?>
									</option>
								</select>
								<p class="description" id="bg-attachment-desc-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Control whether the background scrolls with the page or stays fixed.', 'modern-admin-styler' ); ?>
								</p>
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

					<!-- Advanced Properties (Task 26 - Requirements 5.1, 5.2, 5.3) -->
					<!-- These apply to all background types -->
					<div 
						class="mase-background-advanced-properties"
						style="display: <?php echo ( $bg_type !== 'none' ) ? 'block' : 'none'; ?>;"
					>
						<div class="mase-section-divider">
							<h4><?php esc_html_e( 'Advanced Properties', 'modern-admin-styler' ); ?></h4>
						</div>

						<!-- Opacity Slider (Task 26 - Requirement 5.1) -->
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label for="bg-opacity-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Background Opacity', 'modern-admin-styler' ); ?>
								</label>
							</div>
							<div class="mase-setting-control">
								<div class="mase-slider-control">
									<input 
										type="range" 
										id="bg-opacity-<?php echo esc_attr( $area_id ); ?>"
										name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][opacity]"
										class="mase-background-opacity-slider"
										data-area="<?php echo esc_attr( $area_id ); ?>"
										min="0"
										max="100"
										step="1"
										value="<?php echo esc_attr( $area_settings['opacity'] ?? 100 ); ?>"
										aria-describedby="bg-opacity-desc-<?php echo esc_attr( $area_id ); ?>"
										aria-valuemin="0"
										aria-valuemax="100"
										aria-valuenow="<?php echo esc_attr( $area_settings['opacity'] ?? 100 ); ?>"
										aria-valuetext="<?php echo esc_attr( ( $area_settings['opacity'] ?? 100 ) . '%' ); ?>"
									/>
									<div class="mase-slider-value">
										<span class="mase-background-opacity-value"><?php echo esc_html( $area_settings['opacity'] ?? 100 ); ?></span>%
									</div>
								</div>
								<p class="description" id="bg-opacity-desc-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Control the transparency of the background (0% = fully transparent, 100% = fully opaque).', 'modern-admin-styler' ); ?>
								</p>
							</div>
						</div>

						<!-- Blend Mode (Task 26 - Requirement 5.2) -->
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label for="bg-blend-mode-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Blend Mode', 'modern-admin-styler' ); ?>
								</label>
							</div>
							<div class="mase-setting-control">
								<select 
									id="bg-blend-mode-<?php echo esc_attr( $area_id ); ?>"
									name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][blend_mode]"
									class="mase-background-blend-mode"
									data-area="<?php echo esc_attr( $area_id ); ?>"
									aria-describedby="bg-blend-mode-desc-<?php echo esc_attr( $area_id ); ?>"
								>
									<option value="normal" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'normal' ); ?>>
										<?php esc_html_e( 'Normal', 'modern-admin-styler' ); ?>
									</option>
									<option value="multiply" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'multiply' ); ?>>
										<?php esc_html_e( 'Multiply', 'modern-admin-styler' ); ?>
									</option>
									<option value="screen" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'screen' ); ?>>
										<?php esc_html_e( 'Screen', 'modern-admin-styler' ); ?>
									</option>
									<option value="overlay" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'overlay' ); ?>>
										<?php esc_html_e( 'Overlay', 'modern-admin-styler' ); ?>
									</option>
									<option value="darken" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'darken' ); ?>>
										<?php esc_html_e( 'Darken', 'modern-admin-styler' ); ?>
									</option>
									<option value="lighten" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'lighten' ); ?>>
										<?php esc_html_e( 'Lighten', 'modern-admin-styler' ); ?>
									</option>
									<option value="color-dodge" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'color-dodge' ); ?>>
										<?php esc_html_e( 'Color Dodge', 'modern-admin-styler' ); ?>
									</option>
									<option value="color-burn" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'color-burn' ); ?>>
										<?php esc_html_e( 'Color Burn', 'modern-admin-styler' ); ?>
									</option>
									<option value="hard-light" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'hard-light' ); ?>>
										<?php esc_html_e( 'Hard Light', 'modern-admin-styler' ); ?>
									</option>
									<option value="soft-light" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'soft-light' ); ?>>
										<?php esc_html_e( 'Soft Light', 'modern-admin-styler' ); ?>
									</option>
									<option value="difference" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'difference' ); ?>>
										<?php esc_html_e( 'Difference', 'modern-admin-styler' ); ?>
									</option>
									<option value="exclusion" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'exclusion' ); ?>>
										<?php esc_html_e( 'Exclusion', 'modern-admin-styler' ); ?>
									</option>
									<option value="hue" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'hue' ); ?>>
										<?php esc_html_e( 'Hue', 'modern-admin-styler' ); ?>
									</option>
									<option value="saturation" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'saturation' ); ?>>
										<?php esc_html_e( 'Saturation', 'modern-admin-styler' ); ?>
									</option>
									<option value="color" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'color' ); ?>>
										<?php esc_html_e( 'Color', 'modern-admin-styler' ); ?>
									</option>
									<option value="luminosity" <?php selected( $area_settings['blend_mode'] ?? 'normal', 'luminosity' ); ?>>
										<?php esc_html_e( 'Luminosity', 'modern-admin-styler' ); ?>
									</option>
								</select>
								<p class="description" id="bg-blend-mode-desc-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Control how the background blends with underlying content. Normal is the default.', 'modern-admin-styler' ); ?>
								</p>
							</div>
						</div>
					</div>

					<!-- Responsive Variations (Task 27 - Requirements 6.1, 6.2, 6.3, 6.4, 6.5) -->
					<div 
						class="mase-background-responsive-section"
						style="display: <?php echo ( $bg_type !== 'none' ) ? 'block' : 'none'; ?>;"
					>
						<div class="mase-section-divider">
							<h4><?php esc_html_e( 'Responsive Variations', 'modern-admin-styler' ); ?></h4>
						</div>

						<!-- Responsive Toggle (Requirement 6.1) -->
						<div class="mase-setting-row">
							<div class="mase-setting-label">
								<label for="bg-responsive-enabled-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Enable Responsive Variations', 'modern-admin-styler' ); ?>
								</label>
							</div>
							<div class="mase-setting-control">
								<label class="mase-toggle-switch">
									<input 
										type="checkbox" 
										id="bg-responsive-enabled-<?php echo esc_attr( $area_id ); ?>"
										name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][responsive_enabled]"
										value="1"
										<?php checked( $area_settings['responsive_enabled'] ?? false, true ); ?>
										class="mase-responsive-toggle"
										data-area="<?php echo esc_attr( $area_id ); ?>"
										role="switch"
										aria-checked="<?php echo ( $area_settings['responsive_enabled'] ?? false ) ? 'true' : 'false'; ?>"
										aria-describedby="bg-responsive-desc-<?php echo esc_attr( $area_id ); ?>"
									/>
									<span class="mase-toggle-slider" aria-hidden="true"></span>
								</label>
								<p class="description" id="bg-responsive-desc-<?php echo esc_attr( $area_id ); ?>">
									<?php esc_html_e( 'Configure different backgrounds for desktop, tablet, and mobile screens.', 'modern-admin-styler' ); ?>
								</p>
							</div>
						</div>

						<!-- Responsive Breakpoint Tabs (Requirements 6.1, 6.2, 6.4) -->
						<div 
							class="mase-responsive-breakpoints"
							style="display: <?php echo ( $area_settings['responsive_enabled'] ?? false ) ? 'block' : 'none'; ?>;"
							data-area="<?php echo esc_attr( $area_id ); ?>"
						>
							<!-- Breakpoint Tab Navigation -->
							<div class="mase-breakpoint-tabs" role="tablist" aria-label="<?php esc_attr_e( 'Responsive breakpoint tabs', 'modern-admin-styler' ); ?>">
								<button 
									type="button"
									class="mase-breakpoint-tab active"
									data-breakpoint="desktop"
									data-area="<?php echo esc_attr( $area_id ); ?>"
									role="tab"
									aria-selected="true"
									aria-controls="breakpoint-desktop-<?php echo esc_attr( $area_id ); ?>"
									id="tab-desktop-<?php echo esc_attr( $area_id ); ?>"
								>
									<span class="dashicons dashicons-desktop" aria-hidden="true"></span>
									<?php esc_html_e( 'Desktop', 'modern-admin-styler' ); ?>
									<span class="mase-breakpoint-range">(≥1024px)</span>
								</button>
								<button 
									type="button"
									class="mase-breakpoint-tab"
									data-breakpoint="tablet"
									data-area="<?php echo esc_attr( $area_id ); ?>"
									role="tab"
									aria-selected="false"
									aria-controls="breakpoint-tablet-<?php echo esc_attr( $area_id ); ?>"
									id="tab-tablet-<?php echo esc_attr( $area_id ); ?>"
								>
									<span class="dashicons dashicons-tablet" aria-hidden="true"></span>
									<?php esc_html_e( 'Tablet', 'modern-admin-styler' ); ?>
									<span class="mase-breakpoint-range">(768-1023px)</span>
								</button>
								<button 
									type="button"
									class="mase-breakpoint-tab"
									data-breakpoint="mobile"
									data-area="<?php echo esc_attr( $area_id ); ?>"
									role="tab"
									aria-selected="false"
									aria-controls="breakpoint-mobile-<?php echo esc_attr( $area_id ); ?>"
									id="tab-mobile-<?php echo esc_attr( $area_id ); ?>"
								>
									<span class="dashicons dashicons-smartphone" aria-hidden="true"></span>
									<?php esc_html_e( 'Mobile', 'modern-admin-styler' ); ?>
									<span class="mase-breakpoint-range">(<768px)</span>
								</button>
							</div>

							<!-- Breakpoint Content Panels (Requirement 6.3) -->
							<?php
							$breakpoints = array( 'desktop', 'tablet', 'mobile' );
							foreach ( $breakpoints as $breakpoint ) :
								$responsive_settings = $area_settings['responsive'][ $breakpoint ] ?? array();
								$responsive_type = $responsive_settings['type'] ?? $bg_type;
								$is_active = ( $breakpoint === 'desktop' );
							?>
							<div 
								class="mase-breakpoint-panel <?php echo $is_active ? 'active' : ''; ?>"
								id="breakpoint-<?php echo esc_attr( $breakpoint ); ?>-<?php echo esc_attr( $area_id ); ?>"
								data-breakpoint="<?php echo esc_attr( $breakpoint ); ?>"
								data-area="<?php echo esc_attr( $area_id ); ?>"
								role="tabpanel"
								aria-labelledby="tab-<?php echo esc_attr( $breakpoint ); ?>-<?php echo esc_attr( $area_id ); ?>"
								style="display: <?php echo $is_active ? 'block' : 'none'; ?>;"
							>
								<div class="mase-breakpoint-info">
									<p class="description">
										<?php
										switch ( $breakpoint ) {
											case 'desktop':
												esc_html_e( 'Configure background for desktop screens (1024px and wider). This is the default configuration.', 'modern-admin-styler' );
												break;
											case 'tablet':
												esc_html_e( 'Configure background for tablet screens (768px to 1023px wide).', 'modern-admin-styler' );
												break;
											case 'mobile':
												esc_html_e( 'Configure background for mobile screens (less than 768px wide).', 'modern-admin-styler' );
												break;
										}
										?>
									</p>
								</div>

								<!-- Background Type Selector for Breakpoint -->
								<div class="mase-setting-row">
									<div class="mase-setting-label">
										<label for="bg-type-<?php echo esc_attr( $area_id ); ?>-<?php echo esc_attr( $breakpoint ); ?>">
											<?php esc_html_e( 'Background Type', 'modern-admin-styler' ); ?>
										</label>
									</div>
									<div class="mase-setting-control">
										<select 
											id="bg-type-<?php echo esc_attr( $area_id ); ?>-<?php echo esc_attr( $breakpoint ); ?>"
											name="custom_backgrounds[<?php echo esc_attr( $area_id ); ?>][responsive][<?php echo esc_attr( $breakpoint ); ?>][type]"
											class="mase-responsive-background-type"
											data-area="<?php echo esc_attr( $area_id ); ?>"
											data-breakpoint="<?php echo esc_attr( $breakpoint ); ?>"
										>
											<option value="inherit" <?php selected( $responsive_type, 'inherit' ); ?>>
												<?php esc_html_e( 'Inherit from Desktop', 'modern-admin-styler' ); ?>
											</option>
											<option value="none" <?php selected( $responsive_type, 'none' ); ?>>
												<?php esc_html_e( 'None (Disabled)', 'modern-admin-styler' ); ?>
											</option>
											<option value="image" <?php selected( $responsive_type, 'image' ); ?>>
												<?php esc_html_e( 'Image Upload', 'modern-admin-styler' ); ?>
											</option>
											<option value="gradient" <?php selected( $responsive_type, 'gradient' ); ?>>
												<?php esc_html_e( 'Gradient', 'modern-admin-styler' ); ?>
											</option>
											<option value="pattern" <?php selected( $responsive_type, 'pattern' ); ?>>
												<?php esc_html_e( 'SVG Pattern', 'modern-admin-styler' ); ?>
											</option>
										</select>
										<p class="description">
											<?php esc_html_e( 'Choose "Inherit" to use desktop settings, "None" to disable background on this screen size, or select a different background type.', 'modern-admin-styler' ); ?>
										</p>
									</div>
								</div>

								<!-- Responsive-specific controls would go here -->
								<!-- For MVP, we'll show a message that custom controls per breakpoint will be in next phase -->
								<div 
									class="mase-responsive-custom-controls"
									style="display: <?php echo ( $responsive_type !== 'inherit' && $responsive_type !== 'none' ) ? 'block' : 'none'; ?>;"
								>
									<div class="mase-notice mase-notice-info">
										<p>
											<?php esc_html_e( 'Custom background controls for each breakpoint will be available in the next phase. For now, you can enable/disable backgrounds per screen size.', 'modern-admin-styler' ); ?>
										</p>
									</div>
								</div>

							</div><!-- .mase-breakpoint-panel -->
							<?php endforeach; ?>

						</div><!-- .mase-responsive-breakpoints -->
					</div><!-- .mase-background-responsive-section -->

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
