<?php
/**
 * Dashboard Widgets Tab Content
 *
 * Provides UI for customizing dashboard widgets appearance:
 * - Widget Container Styling
 * - Widget Header Styling
 * - Widget Content Styling
 * - Specific Widget Overrides
 * - Advanced Effects (Glassmorphism, Hover Animations)
 * - Responsive Layout Controls
 *
 * @package ModernAdminStyler
 * @since 1.3.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Get current settings
$widget_settings = $settings['dashboard_widgets'] ?? array();

// Define widget types for specific overrides
$widget_types = array(
	'dashboard_right_now'   => array(
		'label'       => __( 'At a Glance', 'modern-admin-styler' ),
		'description' => __( 'The "At a Glance" widget showing site statistics.', 'modern-admin-styler' ),
		'icon'        => 'dashicons-dashboard',
	),
	'dashboard_activity'    => array(
		'label'       => __( 'Activity', 'modern-admin-styler' ),
		'description' => __( 'The activity widget showing recent posts and comments.', 'modern-admin-styler' ),
		'icon'        => 'dashicons-admin-comments',
	),
	'dashboard_quick_press' => array(
		'label'       => __( 'Quick Draft', 'modern-admin-styler' ),
		'description' => __( 'The quick draft widget for creating posts.', 'modern-admin-styler' ),
		'icon'        => 'dashicons-edit',
	),
	'dashboard_primary'     => array(
		'label'       => __( 'WordPress Events and News', 'modern-admin-styler' ),
		'description' => __( 'The WordPress news and events widget.', 'modern-admin-styler' ),
		'icon'        => 'dashicons-wordpress',
	),
);
?>

<!-- Dashboard Widgets Tab Content -->
<div class="mase-widgets-wrapper">
	
	<!-- Tab Introduction -->
	<div class="mase-section">
		<div class="mase-section-header">
			<h2><?php esc_html_e( 'Dashboard Widgets Customization', 'modern-admin-styler' ); ?></h2>
			<p class="description">
				<?php esc_html_e( 'Customize the appearance of dashboard widgets with advanced styling options. Configure container, header, and content styles, or override specific widgets individually.', 'modern-admin-styler' ); ?>
			</p>
		</div>
	</div>

	<!-- Widget Selector Tabs -->
	<div class="mase-section">
		<div class="mase-widget-selector">
			<button type="button" class="button mase-widget-selector-btn active" data-widget-target="container" aria-pressed="true">
				<span class="dashicons dashicons-admin-generic" aria-hidden="true"></span>
				<span><?php esc_html_e( 'All Widgets', 'modern-admin-styler' ); ?></span>
			</button>
			<button type="button" class="button mase-widget-selector-btn" data-widget-target="header" aria-pressed="false">
				<span class="dashicons dashicons-editor-bold" aria-hidden="true"></span>
				<span><?php esc_html_e( 'Widget Headers', 'modern-admin-styler' ); ?></span>
			</button>
			<button type="button" class="button mase-widget-selector-btn" data-widget-target="content" aria-pressed="false">
				<span class="dashicons dashicons-editor-alignleft" aria-hidden="true"></span>
				<span><?php esc_html_e( 'Widget Content', 'modern-admin-styler' ); ?></span>
			</button>
			<button type="button" class="button mase-widget-selector-btn" data-widget-target="specific" aria-pressed="false">
				<span class="dashicons dashicons-admin-settings" aria-hidden="true"></span>
				<span><?php esc_html_e( 'Specific Widgets', 'modern-admin-styler' ); ?></span>
			</button>
		</div>
	</div>

	<!-- Container Styling Section -->
	<div class="mase-section mase-widget-section" id="widget-section-container" data-widget-section="container">
		<div class="mase-section-card">
			<h3><?php esc_html_e( 'Container Styling', 'modern-admin-styler' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Customize the appearance of all widget containers (.postbox).', 'modern-admin-styler' ); ?></p>
			
			<!-- Background Type -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-container-bg-type"><?php esc_html_e( 'Background Type', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<select id="widget-container-bg-type" name="dashboard_widgets[container][bg_type]" class="widget-style-control">
						<option value="solid" <?php selected( $widget_settings['container']['bg_type'] ?? 'solid', 'solid' ); ?>><?php esc_html_e( 'Solid Color', 'modern-admin-styler' ); ?></option>
						<option value="gradient" <?php selected( $widget_settings['container']['bg_type'] ?? 'solid', 'gradient' ); ?>><?php esc_html_e( 'Gradient', 'modern-admin-styler' ); ?></option>
						<option value="transparent" <?php selected( $widget_settings['container']['bg_type'] ?? 'solid', 'transparent' ); ?>><?php esc_html_e( 'Transparent', 'modern-admin-styler' ); ?></option>
					</select>
				</div>
			</div>

			<!-- Background Color (shown when bg_type is solid) -->
			<div class="mase-setting-row" data-show-when="bg_type=solid">
				<div class="mase-setting-label">
					<label for="widget-container-bg-color"><?php esc_html_e( 'Background Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="widget-container-bg-color" name="dashboard_widgets[container][bg_color]" value="<?php echo esc_attr( $widget_settings['container']['bg_color'] ?? '#ffffff' ); ?>" class="mase-color-picker widget-style-control" />
				</div>
			</div>

			<!-- Gradient Controls (shown when bg_type is gradient) -->
			<div class="mase-setting-row" data-show-when="bg_type=gradient">
				<div class="mase-setting-label">
					<label><?php esc_html_e( 'Gradient Settings', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Configure gradient colors and direction.', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<div class="mase-gradient-builder">
						<div class="mase-gradient-type">
							<label>
								<input type="radio" name="dashboard_widgets[container][gradient_type]" value="linear" <?php checked( $widget_settings['container']['gradient_type'] ?? 'linear', 'linear' ); ?> />
								<?php esc_html_e( 'Linear', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="dashboard_widgets[container][gradient_type]" value="radial" <?php checked( $widget_settings['container']['gradient_type'] ?? 'linear', 'radial' ); ?> />
								<?php esc_html_e( 'Radial', 'modern-admin-styler' ); ?>
							</label>
						</div>
						<div class="mase-gradient-angle">
							<label for="widget-gradient-angle"><?php esc_html_e( 'Angle', 'modern-admin-styler' ); ?></label>
							<input type="range" id="widget-gradient-angle" name="dashboard_widgets[container][gradient_angle]" min="0" max="360" value="<?php echo esc_attr( $widget_settings['container']['gradient_angle'] ?? 90 ); ?>" />
							<span class="mase-range-value"><?php echo esc_html( $widget_settings['container']['gradient_angle'] ?? 90 ); ?>°</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Border Width -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label><?php esc_html_e( 'Border Width', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Set border width for each side (0-10px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<div class="mase-border-width-controls">
						<input type="number" name="dashboard_widgets[container][border_width_top]" min="0" max="10" value="<?php echo esc_attr( $widget_settings['container']['border_width_top'] ?? 1 ); ?>" placeholder="<?php esc_attr_e( 'Top', 'modern-admin-styler' ); ?>" class="widget-style-control" />
						<input type="number" name="dashboard_widgets[container][border_width_right]" min="0" max="10" value="<?php echo esc_attr( $widget_settings['container']['border_width_right'] ?? 1 ); ?>" placeholder="<?php esc_attr_e( 'Right', 'modern-admin-styler' ); ?>" class="widget-style-control" />
						<input type="number" name="dashboard_widgets[container][border_width_bottom]" min="0" max="10" value="<?php echo esc_attr( $widget_settings['container']['border_width_bottom'] ?? 1 ); ?>" placeholder="<?php esc_attr_e( 'Bottom', 'modern-admin-styler' ); ?>" class="widget-style-control" />
						<input type="number" name="dashboard_widgets[container][border_width_left]" min="0" max="10" value="<?php echo esc_attr( $widget_settings['container']['border_width_left'] ?? 1 ); ?>" placeholder="<?php esc_attr_e( 'Left', 'modern-admin-styler' ); ?>" class="widget-style-control" />
					</div>
				</div>
			</div>

			<!-- Border Color -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-container-border-color"><?php esc_html_e( 'Border Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="widget-container-border-color" name="dashboard_widgets[container][border_color]" value="<?php echo esc_attr( $widget_settings['container']['border_color'] ?? '#cccccc' ); ?>" class="mase-color-picker widget-style-control" />
				</div>
			</div>

			<!-- Border Radius -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-container-border-radius"><?php esc_html_e( 'Border Radius', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Rounded corners (0-50px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<input type="range" id="widget-container-border-radius" name="dashboard_widgets[container][border_radius]" min="0" max="50" value="<?php echo esc_attr( $widget_settings['container']['border_radius'] ?? 4 ); ?>" class="widget-style-control" />
					<span class="mase-range-value"><?php echo esc_html( $widget_settings['container']['border_radius'] ?? 4 ); ?>px</span>
				</div>
			</div>

			<!-- Box Shadow Preset -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-container-shadow"><?php esc_html_e( 'Box Shadow', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<select id="widget-container-shadow" name="dashboard_widgets[container][shadow_preset]" class="widget-style-control">
						<option value="none" <?php selected( $widget_settings['container']['shadow_preset'] ?? 'subtle', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
						<option value="subtle" <?php selected( $widget_settings['container']['shadow_preset'] ?? 'subtle', 'subtle' ); ?>><?php esc_html_e( 'Subtle', 'modern-admin-styler' ); ?></option>
						<option value="medium" <?php selected( $widget_settings['container']['shadow_preset'] ?? 'subtle', 'medium' ); ?>><?php esc_html_e( 'Medium', 'modern-admin-styler' ); ?></option>
						<option value="strong" <?php selected( $widget_settings['container']['shadow_preset'] ?? 'subtle', 'strong' ); ?>><?php esc_html_e( 'Strong', 'modern-admin-styler' ); ?></option>
					</select>
				</div>
			</div>

			<!-- Padding -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label><?php esc_html_e( 'Padding', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Inner spacing (5-50px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<div class="mase-spacing-controls">
						<input type="number" name="dashboard_widgets[container][padding_top]" min="5" max="50" value="<?php echo esc_attr( $widget_settings['container']['padding_top'] ?? 12 ); ?>" placeholder="<?php esc_attr_e( 'Top', 'modern-admin-styler' ); ?>" class="widget-style-control" />
						<input type="number" name="dashboard_widgets[container][padding_right]" min="5" max="50" value="<?php echo esc_attr( $widget_settings['container']['padding_right'] ?? 12 ); ?>" placeholder="<?php esc_attr_e( 'Right', 'modern-admin-styler' ); ?>" class="widget-style-control" />
						<input type="number" name="dashboard_widgets[container][padding_bottom]" min="5" max="50" value="<?php echo esc_attr( $widget_settings['container']['padding_bottom'] ?? 12 ); ?>" placeholder="<?php esc_attr_e( 'Bottom', 'modern-admin-styler' ); ?>" class="widget-style-control" />
						<input type="number" name="dashboard_widgets[container][padding_left]" min="5" max="50" value="<?php echo esc_attr( $widget_settings['container']['padding_left'] ?? 12 ); ?>" placeholder="<?php esc_attr_e( 'Left', 'modern-admin-styler' ); ?>" class="widget-style-control" />
					</div>
				</div>
			</div>

			<!-- Margin -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label><?php esc_html_e( 'Margin', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Outer spacing (0-30px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<div class="mase-spacing-controls">
						<input type="number" name="dashboard_widgets[container][margin_top]" min="0" max="30" value="<?php echo esc_attr( $widget_settings['container']['margin_top'] ?? 0 ); ?>" placeholder="<?php esc_attr_e( 'Top', 'modern-admin-styler' ); ?>" class="widget-style-control" />
						<input type="number" name="dashboard_widgets[container][margin_right]" min="0" max="30" value="<?php echo esc_attr( $widget_settings['container']['margin_right'] ?? 0 ); ?>" placeholder="<?php esc_attr_e( 'Right', 'modern-admin-styler' ); ?>" class="widget-style-control" />
						<input type="number" name="dashboard_widgets[container][margin_bottom]" min="0" max="30" value="<?php echo esc_attr( $widget_settings['container']['margin_bottom'] ?? 20 ); ?>" placeholder="<?php esc_attr_e( 'Bottom', 'modern-admin-styler' ); ?>" class="widget-style-control" />
						<input type="number" name="dashboard_widgets[container][margin_left]" min="0" max="30" value="<?php echo esc_attr( $widget_settings['container']['margin_left'] ?? 0 ); ?>" placeholder="<?php esc_attr_e( 'Left', 'modern-admin-styler' ); ?>" class="widget-style-control" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Header Styling Section -->
	<div class="mase-section mase-widget-section" id="widget-section-header" data-widget-section="header" style="display: none;">
		<div class="mase-section-card">
			<h3><?php esc_html_e( 'Header Styling', 'modern-admin-styler' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Customize the appearance of widget headers (.postbox .hndle).', 'modern-admin-styler' ); ?></p>
			
			<!-- Header Background Color -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-header-bg-color"><?php esc_html_e( 'Background Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="widget-header-bg-color" name="dashboard_widgets[header][bg_color]" value="<?php echo esc_attr( $widget_settings['header']['bg_color'] ?? '#f5f5f5' ); ?>" class="mase-color-picker widget-style-control" />
				</div>
			</div>

			<!-- Header Font Size -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-header-font-size"><?php esc_html_e( 'Font Size', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Header text size (12-24px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<input type="range" id="widget-header-font-size" name="dashboard_widgets[header][font_size]" min="12" max="24" value="<?php echo esc_attr( $widget_settings['header']['font_size'] ?? 14 ); ?>" class="widget-style-control" />
					<span class="mase-range-value"><?php echo esc_html( $widget_settings['header']['font_size'] ?? 14 ); ?>px</span>
				</div>
			</div>

			<!-- Header Font Weight -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-header-font-weight"><?php esc_html_e( 'Font Weight', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<select id="widget-header-font-weight" name="dashboard_widgets[header][font_weight]" class="widget-style-control">
						<option value="400" <?php selected( $widget_settings['header']['font_weight'] ?? 600, 400 ); ?>><?php esc_html_e( 'Regular', 'modern-admin-styler' ); ?></option>
						<option value="500" <?php selected( $widget_settings['header']['font_weight'] ?? 600, 500 ); ?>><?php esc_html_e( 'Medium', 'modern-admin-styler' ); ?></option>
						<option value="600" <?php selected( $widget_settings['header']['font_weight'] ?? 600, 600 ); ?>><?php esc_html_e( 'Semi-Bold', 'modern-admin-styler' ); ?></option>
						<option value="700" <?php selected( $widget_settings['header']['font_weight'] ?? 600, 700 ); ?>><?php esc_html_e( 'Bold', 'modern-admin-styler' ); ?></option>
					</select>
				</div>
			</div>

			<!-- Header Text Color -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-header-text-color"><?php esc_html_e( 'Text Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="widget-header-text-color" name="dashboard_widgets[header][text_color]" value="<?php echo esc_attr( $widget_settings['header']['text_color'] ?? '#23282d' ); ?>" class="mase-color-picker widget-style-control" />
				</div>
			</div>

			<!-- Header Border Bottom -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-header-border-bottom"><?php esc_html_e( 'Border Bottom Width', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="number" id="widget-header-border-bottom" name="dashboard_widgets[header][border_bottom_width]" min="0" max="5" value="<?php echo esc_attr( $widget_settings['header']['border_bottom_width'] ?? 1 ); ?>" class="widget-style-control" />
					<span class="unit">px</span>
				</div>
			</div>

			<!-- Header Border Color -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-header-border-color"><?php esc_html_e( 'Border Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="widget-header-border-color" name="dashboard_widgets[header][border_bottom_color]" value="<?php echo esc_attr( $widget_settings['header']['border_bottom_color'] ?? '#e0e0e0' ); ?>" class="mase-color-picker widget-style-control" />
				</div>
			</div>
		</div>
	</div>

	<!-- Content Styling Section -->
	<div class="mase-section mase-widget-section" id="widget-section-content" data-widget-section="content" style="display: none;">
		<div class="mase-section-card">
			<h3><?php esc_html_e( 'Content Styling', 'modern-admin-styler' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Customize the appearance of widget content areas (.postbox .inside).', 'modern-admin-styler' ); ?></p>
			
			<!-- Content Background Color -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-content-bg-color"><?php esc_html_e( 'Background Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="widget-content-bg-color" name="dashboard_widgets[content][bg_color]" value="<?php echo esc_attr( $widget_settings['content']['bg_color'] ?? 'transparent' ); ?>" class="mase-color-picker widget-style-control" />
				</div>
			</div>

			<!-- Content Font Size -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-content-font-size"><?php esc_html_e( 'Font Size', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Content text size (10-18px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<input type="range" id="widget-content-font-size" name="dashboard_widgets[content][font_size]" min="10" max="18" value="<?php echo esc_attr( $widget_settings['content']['font_size'] ?? 13 ); ?>" class="widget-style-control" />
					<span class="mase-range-value"><?php echo esc_html( $widget_settings['content']['font_size'] ?? 13 ); ?>px</span>
				</div>
			</div>

			<!-- Content Text Color -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-content-text-color"><?php esc_html_e( 'Text Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="widget-content-text-color" name="dashboard_widgets[content][text_color]" value="<?php echo esc_attr( $widget_settings['content']['text_color'] ?? '#555555' ); ?>" class="mase-color-picker widget-style-control" />
				</div>
			</div>

			<!-- Link Color -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-content-link-color"><?php esc_html_e( 'Link Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="widget-content-link-color" name="dashboard_widgets[content][link_color]" value="<?php echo esc_attr( $widget_settings['content']['link_color'] ?? '#0073aa' ); ?>" class="mase-color-picker widget-style-control" />
				</div>
			</div>

			<!-- Link Hover Color -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-content-link-hover-color"><?php esc_html_e( 'Link Hover Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="widget-content-link-hover-color" name="dashboard_widgets[content][link_hover_color]" value="<?php echo esc_attr( $widget_settings['content']['link_hover_color'] ?? '#005177' ); ?>" class="mase-color-picker widget-style-control" />
				</div>
			</div>

			<!-- List Style -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-content-list-style"><?php esc_html_e( 'List Style', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<select id="widget-content-list-style" name="dashboard_widgets[content][list_style]" class="widget-style-control">
						<option value="disc" <?php selected( $widget_settings['content']['list_style'] ?? 'disc', 'disc' ); ?>><?php esc_html_e( 'Disc', 'modern-admin-styler' ); ?></option>
						<option value="circle" <?php selected( $widget_settings['content']['list_style'] ?? 'disc', 'circle' ); ?>><?php esc_html_e( 'Circle', 'modern-admin-styler' ); ?></option>
						<option value="square" <?php selected( $widget_settings['content']['list_style'] ?? 'disc', 'square' ); ?>><?php esc_html_e( 'Square', 'modern-admin-styler' ); ?></option>
						<option value="none" <?php selected( $widget_settings['content']['list_style'] ?? 'disc', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- Advanced Effects Section -->
	<div class="mase-section">
		<div class="mase-section-card">
			<details class="mase-widget-advanced-effects">
				<summary>
					<h3><?php esc_html_e( 'Advanced Effects', 'modern-admin-styler' ); ?></h3>
					<span class="dashicons dashicons-arrow-down-alt2" aria-hidden="true"></span>
				</summary>
				
				<div class="mase-advanced-effects-content">
					<!-- Glassmorphism -->
					<div class="mase-setting-row">
						<div class="mase-setting-label">
							<label for="widget-glassmorphism">
								<?php esc_html_e( 'Glassmorphism Effect', 'modern-admin-styler' ); ?>
							</label>
							<p class="description"><?php esc_html_e( 'Apply a frosted glass effect with backdrop blur.', 'modern-admin-styler' ); ?></p>
						</div>
						<div class="mase-setting-control">
							<label class="mase-toggle-switch">
								<input type="checkbox" id="widget-glassmorphism" name="dashboard_widgets[glassmorphism]" value="1" <?php checked( $widget_settings['glassmorphism'] ?? false, true ); ?> class="widget-style-control" />
								<span class="mase-toggle-slider" aria-hidden="true"></span>
							</label>
						</div>
					</div>

					<!-- Blur Intensity (shown when glassmorphism is enabled) -->
					<div class="mase-setting-row" data-show-when="glassmorphism=true">
						<div class="mase-setting-label">
							<label for="widget-blur-intensity"><?php esc_html_e( 'Blur Intensity', 'modern-admin-styler' ); ?></label>
							<p class="description"><?php esc_html_e( 'Backdrop blur strength (0-30px).', 'modern-admin-styler' ); ?></p>
						</div>
						<div class="mase-setting-control">
							<input type="range" id="widget-blur-intensity" name="dashboard_widgets[blur_intensity]" min="0" max="30" value="<?php echo esc_attr( $widget_settings['blur_intensity'] ?? 10 ); ?>" class="widget-style-control" />
							<span class="mase-range-value"><?php echo esc_html( $widget_settings['blur_intensity'] ?? 10 ); ?>px</span>
						</div>
					</div>

					<!-- Hover Animation -->
					<div class="mase-setting-row">
						<div class="mase-setting-label">
							<label for="widget-hover-animation"><?php esc_html_e( 'Hover Animation', 'modern-admin-styler' ); ?></label>
							<p class="description"><?php esc_html_e( 'Animation effect when hovering over widgets.', 'modern-admin-styler' ); ?></p>
						</div>
						<div class="mase-setting-control">
							<select id="widget-hover-animation" name="dashboard_widgets[hover_animation]" class="widget-style-control">
								<option value="none" <?php selected( $widget_settings['hover_animation'] ?? 'none', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
								<option value="lift" <?php selected( $widget_settings['hover_animation'] ?? 'none', 'lift' ); ?>><?php esc_html_e( 'Lift', 'modern-admin-styler' ); ?></option>
								<option value="glow" <?php selected( $widget_settings['hover_animation'] ?? 'none', 'glow' ); ?>><?php esc_html_e( 'Glow', 'modern-admin-styler' ); ?></option>
								<option value="scale" <?php selected( $widget_settings['hover_animation'] ?? 'none', 'scale' ); ?>><?php esc_html_e( 'Scale', 'modern-admin-styler' ); ?></option>
							</select>
						</div>
					</div>
				</div>
			</details>
		</div>
	</div>

	<!-- Responsive Layout Section -->
	<div class="mase-section">
		<div class="mase-section-card">
			<h3><?php esc_html_e( 'Responsive Layout', 'modern-admin-styler' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Configure how widgets are displayed on different screen sizes.', 'modern-admin-styler' ); ?></p>
			
			<!-- Mobile Stack -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-mobile-stack">
						<?php esc_html_e( 'Stack Widgets on Mobile', 'modern-admin-styler' ); ?>
					</label>
					<p class="description"><?php esc_html_e( 'Display widgets in a single column on mobile devices.', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<label class="mase-toggle-switch">
						<input type="checkbox" id="widget-mobile-stack" name="dashboard_widgets[responsive][mobile_stack]" value="1" <?php checked( $widget_settings['responsive']['mobile_stack'] ?? true, true ); ?> />
						<span class="mase-toggle-slider" aria-hidden="true"></span>
					</label>
				</div>
			</div>

			<!-- Tablet Columns -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-tablet-columns"><?php esc_html_e( 'Tablet Columns', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Number of columns on tablet devices (768px-1023px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<select id="widget-tablet-columns" name="dashboard_widgets[responsive][tablet_columns]">
						<option value="1" <?php selected( $widget_settings['responsive']['tablet_columns'] ?? 2, 1 ); ?>><?php esc_html_e( '1 Column', 'modern-admin-styler' ); ?></option>
						<option value="2" <?php selected( $widget_settings['responsive']['tablet_columns'] ?? 2, 2 ); ?>><?php esc_html_e( '2 Columns', 'modern-admin-styler' ); ?></option>
					</select>
				</div>
			</div>

			<!-- Desktop Columns -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="widget-desktop-columns"><?php esc_html_e( 'Desktop Columns', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Number of columns on desktop devices (≥1024px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<select id="widget-desktop-columns" name="dashboard_widgets[responsive][desktop_columns]">
						<option value="2" <?php selected( $widget_settings['responsive']['desktop_columns'] ?? 3, 2 ); ?>><?php esc_html_e( '2 Columns', 'modern-admin-styler' ); ?></option>
						<option value="3" <?php selected( $widget_settings['responsive']['desktop_columns'] ?? 3, 3 ); ?>><?php esc_html_e( '3 Columns', 'modern-admin-styler' ); ?></option>
						<option value="4" <?php selected( $widget_settings['responsive']['desktop_columns'] ?? 3, 4 ); ?>><?php esc_html_e( '4 Columns', 'modern-admin-styler' ); ?></option>
					</select>
				</div>
			</div>
		</div>
	</div>

</div><!-- .mase-widgets-wrapper -->
