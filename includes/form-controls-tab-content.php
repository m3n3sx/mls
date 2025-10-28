<?php
/**
 * Form Controls Tab Content
 *
 * Provides UI for customizing form controls appearance:
 * - Text Inputs Styling
 * - Textareas Styling
 * - Select Dropdowns Styling
 * - Checkboxes Styling
 * - Radio Buttons Styling
 * - File Uploads Styling
 * - Search Fields Styling
 * - Interactive States (Focus, Hover, Error, Disabled)
 *
 * @package ModernAdminStyler
 * @since 1.3.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Get current settings
$form_settings = $settings['form_controls'] ?? array();

// Define control types
$control_types = array(
	'text_inputs'   => array(
		'label'       => __( 'Text Inputs', 'modern-admin-styler' ),
		'description' => __( 'Style text, email, URL, number, and password inputs.', 'modern-admin-styler' ),
		'icon'        => 'dashicons-edit',
	),
	'textareas'     => array(
		'label'       => __( 'Textareas', 'modern-admin-styler' ),
		'description' => __( 'Style multi-line text input areas.', 'modern-admin-styler' ),
		'icon'        => 'dashicons-editor-alignleft',
	),
	'selects'       => array(
		'label'       => __( 'Select Dropdowns', 'modern-admin-styler' ),
		'description' => __( 'Style dropdown select menus.', 'modern-admin-styler' ),
		'icon'        => 'dashicons-arrow-down-alt2',
	),
	'checkboxes'    => array(
		'label'       => __( 'Checkboxes', 'modern-admin-styler' ),
		'description' => __( 'Style checkbox inputs with custom checkmarks.', 'modern-admin-styler' ),
		'icon'        => 'dashicons-yes',
	),
	'radios'        => array(
		'label'       => __( 'Radio Buttons', 'modern-admin-styler' ),
		'description' => __( 'Style radio button inputs.', 'modern-admin-styler' ),
		'icon'        => 'dashicons-marker',
	),
	'file_uploads'  => array(
		'label'       => __( 'File Uploads', 'modern-admin-styler' ),
		'description' => __( 'Style file upload fields and dropzones.', 'modern-admin-styler' ),
		'icon'        => 'dashicons-upload',
	),
	'search_fields' => array(
		'label'       => __( 'Search Fields', 'modern-admin-styler' ),
		'description' => __( 'Style search input fields with icons.', 'modern-admin-styler' ),
		'icon'        => 'dashicons-search',
	),
);
?>

<!-- Form Controls Tab Content -->
<div class="mase-form-controls-wrapper">
	
	<!-- Tab Introduction -->
	<div class="mase-section">
		<div class="mase-section-header">
			<h2><?php esc_html_e( 'Form Controls Customization', 'modern-admin-styler' ); ?></h2>
			<p class="description">
				<?php esc_html_e( 'Customize the appearance of all form inputs and controls throughout the WordPress admin. Configure colors, borders, typography, and interactive states for a consistent branded experience.', 'modern-admin-styler' ); ?>
			</p>
		</div>
	</div>

	<!-- Control Type Selector -->
	<div class="mase-section">
		<div class="mase-form-control-selector">
			<?php foreach ( $control_types as $control_id => $control_type ) : ?>
				<button type="button" class="button mase-control-selector-btn <?php echo $control_id === 'text_inputs' ? 'active' : ''; ?>" data-control-target="<?php echo esc_attr( $control_id ); ?>" aria-pressed="<?php echo $control_id === 'text_inputs' ? 'true' : 'false'; ?>">
					<span class="dashicons <?php echo esc_attr( $control_type['icon'] ); ?>" aria-hidden="true"></span>
					<span><?php echo esc_html( $control_type['label'] ); ?></span>
				</button>
			<?php endforeach; ?>
		</div>
	</div>

	<!-- Basic Styling Section (Common to all control types) -->
	<div class="mase-section mase-form-control-section" id="form-control-basic-styling">
		<div class="mase-section-card">
			<h3><?php esc_html_e( 'Basic Styling', 'modern-admin-styler' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Configure basic appearance properties for the selected control type.', 'modern-admin-styler' ); ?></p>
			
			<!-- Background Colors -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-bg-color"><?php esc_html_e( 'Background Color (Normal)', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="form-control-bg-color" name="form_controls[text_inputs][bg_color]" value="<?php echo esc_attr( $form_settings['text_inputs']['bg_color'] ?? '#ffffff' ); ?>" class="mase-color-picker form-control-style" data-control-type="text_inputs" data-property="bg_color" />
				</div>
			</div>

			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-bg-color-focus"><?php esc_html_e( 'Background Color (Focus)', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="form-control-bg-color-focus" name="form_controls[text_inputs][bg_color_focus]" value="<?php echo esc_attr( $form_settings['text_inputs']['bg_color_focus'] ?? '#ffffff' ); ?>" class="mase-color-picker form-control-style" data-control-type="text_inputs" data-property="bg_color_focus" />
				</div>
			</div>

			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-bg-color-disabled"><?php esc_html_e( 'Background Color (Disabled)', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="form-control-bg-color-disabled" name="form_controls[text_inputs][bg_color_disabled]" value="<?php echo esc_attr( $form_settings['text_inputs']['bg_color_disabled'] ?? '#f7f7f7' ); ?>" class="mase-color-picker form-control-style" data-control-type="text_inputs" data-property="bg_color_disabled" />
				</div>
			</div>

			<!-- Text Colors -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-text-color"><?php esc_html_e( 'Text Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="form-control-text-color" name="form_controls[text_inputs][text_color]" value="<?php echo esc_attr( $form_settings['text_inputs']['text_color'] ?? '#32373c' ); ?>" class="mase-color-picker form-control-style" data-control-type="text_inputs" data-property="text_color" />
				</div>
			</div>

			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-placeholder-color"><?php esc_html_e( 'Placeholder Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="form-control-placeholder-color" name="form_controls[text_inputs][placeholder_color]" value="<?php echo esc_attr( $form_settings['text_inputs']['placeholder_color'] ?? '#7e8993' ); ?>" class="mase-color-picker form-control-style" data-control-type="text_inputs" data-property="placeholder_color" />
				</div>
			</div>

			<!-- Border Width -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label><?php esc_html_e( 'Border Width', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Set border width for each side (0-5px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<div class="mase-border-width-controls">
						<input type="number" name="form_controls[text_inputs][border_width_top]" min="0" max="5" value="<?php echo esc_attr( $form_settings['text_inputs']['border_width_top'] ?? 1 ); ?>" placeholder="<?php esc_attr_e( 'Top', 'modern-admin-styler' ); ?>" class="form-control-style" data-control-type="text_inputs" data-property="border_width_top" />
						<input type="number" name="form_controls[text_inputs][border_width_right]" min="0" max="5" value="<?php echo esc_attr( $form_settings['text_inputs']['border_width_right'] ?? 1 ); ?>" placeholder="<?php esc_attr_e( 'Right', 'modern-admin-styler' ); ?>" class="form-control-style" data-control-type="text_inputs" data-property="border_width_right" />
						<input type="number" name="form_controls[text_inputs][border_width_bottom]" min="0" max="5" value="<?php echo esc_attr( $form_settings['text_inputs']['border_width_bottom'] ?? 1 ); ?>" placeholder="<?php esc_attr_e( 'Bottom', 'modern-admin-styler' ); ?>" class="form-control-style" data-control-type="text_inputs" data-property="border_width_bottom" />
						<input type="number" name="form_controls[text_inputs][border_width_left]" min="0" max="5" value="<?php echo esc_attr( $form_settings['text_inputs']['border_width_left'] ?? 1 ); ?>" placeholder="<?php esc_attr_e( 'Left', 'modern-admin-styler' ); ?>" class="form-control-style" data-control-type="text_inputs" data-property="border_width_left" />
					</div>
				</div>
			</div>

			<!-- Border Color -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-border-color"><?php esc_html_e( 'Border Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="form-control-border-color" name="form_controls[text_inputs][border_color]" value="<?php echo esc_attr( $form_settings['text_inputs']['border_color'] ?? '#8c8f94' ); ?>" class="mase-color-picker form-control-style" data-control-type="text_inputs" data-property="border_color" />
				</div>
			</div>

			<!-- Border Radius -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-border-radius"><?php esc_html_e( 'Border Radius', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Rounded corners (0-25px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<input type="range" id="form-control-border-radius" name="form_controls[text_inputs][border_radius]" min="0" max="25" value="<?php echo esc_attr( $form_settings['text_inputs']['border_radius'] ?? 4 ); ?>" class="form-control-style" data-control-type="text_inputs" data-property="border_radius" />
					<span class="mase-range-value"><?php echo esc_html( $form_settings['text_inputs']['border_radius'] ?? 4 ); ?>px</span>
				</div>
			</div>

			<!-- Padding -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label><?php esc_html_e( 'Padding', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Inner spacing (horizontal: 5-25px, vertical: 3-15px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<div class="mase-padding-controls">
						<input type="number" name="form_controls[text_inputs][padding_horizontal]" min="5" max="25" value="<?php echo esc_attr( $form_settings['text_inputs']['padding_horizontal'] ?? 12 ); ?>" placeholder="<?php esc_attr_e( 'Horizontal', 'modern-admin-styler' ); ?>" class="form-control-style" data-control-type="text_inputs" data-property="padding_horizontal" />
						<input type="number" name="form_controls[text_inputs][padding_vertical]" min="3" max="15" value="<?php echo esc_attr( $form_settings['text_inputs']['padding_vertical'] ?? 8 ); ?>" placeholder="<?php esc_attr_e( 'Vertical', 'modern-admin-styler' ); ?>" class="form-control-style" data-control-type="text_inputs" data-property="padding_vertical" />
					</div>
				</div>
			</div>

			<!-- Height -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-height-mode"><?php esc_html_e( 'Height', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<select id="form-control-height-mode" name="form_controls[text_inputs][height_mode]" class="form-control-style" data-control-type="text_inputs" data-property="height_mode">
						<option value="auto" <?php selected( $form_settings['text_inputs']['height_mode'] ?? 'auto', 'auto' ); ?>><?php esc_html_e( 'Auto', 'modern-admin-styler' ); ?></option>
						<option value="custom" <?php selected( $form_settings['text_inputs']['height_mode'] ?? 'auto', 'custom' ); ?>><?php esc_html_e( 'Custom', 'modern-admin-styler' ); ?></option>
					</select>
					<input type="number" name="form_controls[text_inputs][height_custom]" min="20" max="60" value="<?php echo esc_attr( $form_settings['text_inputs']['height_custom'] ?? 40 ); ?>" placeholder="<?php esc_attr_e( 'px', 'modern-admin-styler' ); ?>" class="form-control-style" data-control-type="text_inputs" data-property="height_custom" data-show-when="height_mode=custom" />
				</div>
			</div>
		</div>
	</div>

	<!-- Typography Section -->
	<div class="mase-section mase-form-control-section" id="form-control-typography">
		<div class="mase-section-card">
			<h3><?php esc_html_e( 'Typography', 'modern-admin-styler' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Configure font properties for form controls.', 'modern-admin-styler' ); ?></p>
			
			<!-- Font Family -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-font-family"><?php esc_html_e( 'Font Family', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<select id="form-control-font-family" name="form_controls[text_inputs][font_family]" class="form-control-style" data-control-type="text_inputs" data-property="font_family">
						<option value="system" <?php selected( $form_settings['text_inputs']['font_family'] ?? 'system', 'system' ); ?>><?php esc_html_e( 'System Font', 'modern-admin-styler' ); ?></option>
						<option value="Inter" <?php selected( $form_settings['text_inputs']['font_family'] ?? 'system', 'Inter' ); ?>>Inter</option>
						<option value="Roboto" <?php selected( $form_settings['text_inputs']['font_family'] ?? 'system', 'Roboto' ); ?>>Roboto</option>
						<option value="Open Sans" <?php selected( $form_settings['text_inputs']['font_family'] ?? 'system', 'Open Sans' ); ?>>Open Sans</option>
					</select>
				</div>
			</div>

			<!-- Font Size -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-font-size"><?php esc_html_e( 'Font Size', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Text size (10-18px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<input type="range" id="form-control-font-size" name="form_controls[text_inputs][font_size]" min="10" max="18" value="<?php echo esc_attr( $form_settings['text_inputs']['font_size'] ?? 14 ); ?>" class="form-control-style" data-control-type="text_inputs" data-property="font_size" />
					<span class="mase-range-value"><?php echo esc_html( $form_settings['text_inputs']['font_size'] ?? 14 ); ?>px</span>
				</div>
			</div>

			<!-- Font Weight -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-font-weight"><?php esc_html_e( 'Font Weight', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<select id="form-control-font-weight" name="form_controls[text_inputs][font_weight]" class="form-control-style" data-control-type="text_inputs" data-property="font_weight">
						<option value="400" <?php selected( $form_settings['text_inputs']['font_weight'] ?? 400, 400 ); ?>><?php esc_html_e( 'Regular', 'modern-admin-styler' ); ?></option>
						<option value="500" <?php selected( $form_settings['text_inputs']['font_weight'] ?? 400, 500 ); ?>><?php esc_html_e( 'Medium', 'modern-admin-styler' ); ?></option>
						<option value="600" <?php selected( $form_settings['text_inputs']['font_weight'] ?? 400, 600 ); ?>><?php esc_html_e( 'Semi-Bold', 'modern-admin-styler' ); ?></option>
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- Interactive States Section -->
	<div class="mase-section mase-form-control-section" id="form-control-states">
		<div class="mase-section-card">
			<h3><?php esc_html_e( 'Interactive States', 'modern-admin-styler' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Configure appearance for different interaction states.', 'modern-admin-styler' ); ?></p>
			
			<!-- Focus State -->
			<div class="mase-state-group">
				<h4><?php esc_html_e( 'Focus State', 'modern-admin-styler' ); ?></h4>
				
				<div class="mase-setting-row">
					<div class="mase-setting-label">
						<label for="form-control-border-color-focus"><?php esc_html_e( 'Border Color', 'modern-admin-styler' ); ?></label>
					</div>
					<div class="mase-setting-control">
						<input type="text" id="form-control-border-color-focus" name="form_controls[text_inputs][border_color_focus]" value="<?php echo esc_attr( $form_settings['text_inputs']['border_color_focus'] ?? '#007cba' ); ?>" class="mase-color-picker form-control-style" data-control-type="text_inputs" data-property="border_color_focus" />
					</div>
				</div>

				<div class="mase-setting-row">
					<div class="mase-setting-label">
						<label for="form-control-focus-glow"><?php esc_html_e( 'Glow Effect', 'modern-admin-styler' ); ?></label>
						<p class="description"><?php esc_html_e( 'CSS box-shadow for focus glow.', 'modern-admin-styler' ); ?></p>
					</div>
					<div class="mase-setting-control">
						<input type="text" id="form-control-focus-glow" name="form_controls[text_inputs][focus_glow]" value="<?php echo esc_attr( $form_settings['text_inputs']['focus_glow'] ?? '0 0 0 2px rgba(0,124,186,0.2)' ); ?>" placeholder="0 0 0 2px rgba(0,124,186,0.2)" class="form-control-style" data-control-type="text_inputs" data-property="focus_glow" />
					</div>
				</div>
			</div>

			<!-- Hover State -->
			<div class="mase-state-group">
				<h4><?php esc_html_e( 'Hover State', 'modern-admin-styler' ); ?></h4>
				
				<div class="mase-setting-row">
					<div class="mase-setting-label">
						<label for="form-control-border-color-hover"><?php esc_html_e( 'Border Color', 'modern-admin-styler' ); ?></label>
					</div>
					<div class="mase-setting-control">
						<input type="text" id="form-control-border-color-hover" name="form_controls[text_inputs][border_color_hover]" value="<?php echo esc_attr( $form_settings['text_inputs']['border_color_hover'] ?? '#6c7781' ); ?>" class="mase-color-picker form-control-style" data-control-type="text_inputs" data-property="border_color_hover" />
					</div>
				</div>
			</div>

			<!-- Error State -->
			<div class="mase-state-group">
				<h4><?php esc_html_e( 'Error State', 'modern-admin-styler' ); ?></h4>
				
				<div class="mase-setting-row">
					<div class="mase-setting-label">
						<label for="form-control-border-color-error"><?php esc_html_e( 'Border Color', 'modern-admin-styler' ); ?></label>
					</div>
					<div class="mase-setting-control">
						<input type="text" id="form-control-border-color-error" name="form_controls[text_inputs][border_color_error]" value="<?php echo esc_attr( $form_settings['text_inputs']['border_color_error'] ?? '#dc3232' ); ?>" class="mase-color-picker form-control-style" data-control-type="text_inputs" data-property="border_color_error" />
					</div>
				</div>

				<div class="mase-setting-row">
					<div class="mase-setting-label">
						<label for="form-control-bg-color-error"><?php esc_html_e( 'Background Tint', 'modern-admin-styler' ); ?></label>
					</div>
					<div class="mase-setting-control">
						<input type="text" id="form-control-bg-color-error" name="form_controls[text_inputs][bg_color_error]" value="<?php echo esc_attr( $form_settings['text_inputs']['bg_color_error'] ?? '#fff5f5' ); ?>" class="mase-color-picker form-control-style" data-control-type="text_inputs" data-property="bg_color_error" />
					</div>
				</div>
			</div>

			<!-- Disabled State -->
			<div class="mase-state-group">
				<h4><?php esc_html_e( 'Disabled State', 'modern-admin-styler' ); ?></h4>
				
				<div class="mase-setting-row">
					<div class="mase-setting-label">
						<label for="form-control-disabled-opacity"><?php esc_html_e( 'Opacity', 'modern-admin-styler' ); ?></label>
						<p class="description"><?php esc_html_e( 'Transparency level (0-100%).', 'modern-admin-styler' ); ?></p>
					</div>
					<div class="mase-setting-control">
						<input type="range" id="form-control-disabled-opacity" name="form_controls[text_inputs][disabled_opacity]" min="0" max="100" value="<?php echo esc_attr( $form_settings['text_inputs']['disabled_opacity'] ?? 60 ); ?>" class="form-control-style" data-control-type="text_inputs" data-property="disabled_opacity" />
						<span class="mase-range-value"><?php echo esc_html( $form_settings['text_inputs']['disabled_opacity'] ?? 60 ); ?>%</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Special Controls Section (Checkboxes/Radios) -->
	<div class="mase-section mase-form-control-section mase-special-controls" id="form-control-checkbox-radio" data-show-for="checkboxes,radios" style="display: none;">
		<div class="mase-section-card">
			<h3><?php esc_html_e( 'Checkbox/Radio Styling', 'modern-admin-styler' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Customize the appearance of checkboxes and radio buttons.', 'modern-admin-styler' ); ?></p>
			
			<!-- Size -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-checkbox-size"><?php esc_html_e( 'Size', 'modern-admin-styler' ); ?></label>
					<p class="description"><?php esc_html_e( 'Control size (12-24px).', 'modern-admin-styler' ); ?></p>
				</div>
				<div class="mase-setting-control">
					<input type="range" id="form-control-checkbox-size" name="form_controls[checkboxes][size]" min="12" max="24" value="<?php echo esc_attr( $form_settings['checkboxes']['size'] ?? 16 ); ?>" class="form-control-style" data-control-type="checkboxes" data-property="size" />
					<span class="mase-range-value"><?php echo esc_html( $form_settings['checkboxes']['size'] ?? 16 ); ?>px</span>
				</div>
			</div>

			<!-- Check Color -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-check-color"><?php esc_html_e( 'Check/Dot Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="form-control-check-color" name="form_controls[checkboxes][check_color]" value="<?php echo esc_attr( $form_settings['checkboxes']['check_color'] ?? '#ffffff' ); ?>" class="mase-color-picker form-control-style" data-control-type="checkboxes" data-property="check_color" />
				</div>
			</div>

			<!-- Check Animation -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-check-animation"><?php esc_html_e( 'Check Animation', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<select id="form-control-check-animation" name="form_controls[checkboxes][check_animation]" class="form-control-style" data-control-type="checkboxes" data-property="check_animation">
						<option value="slide" <?php selected( $form_settings['checkboxes']['check_animation'] ?? 'slide', 'slide' ); ?>><?php esc_html_e( 'Slide', 'modern-admin-styler' ); ?></option>
						<option value="fade" <?php selected( $form_settings['checkboxes']['check_animation'] ?? 'slide', 'fade' ); ?>><?php esc_html_e( 'Fade', 'modern-admin-styler' ); ?></option>
						<option value="bounce" <?php selected( $form_settings['checkboxes']['check_animation'] ?? 'slide', 'bounce' ); ?>><?php esc_html_e( 'Bounce', 'modern-admin-styler' ); ?></option>
						<option value="none" <?php selected( $form_settings['checkboxes']['check_animation'] ?? 'slide', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- Special Controls Section (Select Dropdowns) -->
	<div class="mase-section mase-form-control-section mase-special-controls" id="form-control-select" data-show-for="selects" style="display: none;">
		<div class="mase-section-card">
			<h3><?php esc_html_e( 'Select Dropdown Styling', 'modern-admin-styler' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Customize the appearance of select dropdown menus.', 'modern-admin-styler' ); ?></p>
			
			<!-- Arrow Icon -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-arrow-icon"><?php esc_html_e( 'Arrow Icon', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<select id="form-control-arrow-icon" name="form_controls[selects][arrow_icon]" class="form-control-style" data-control-type="selects" data-property="arrow_icon">
						<option value="default" <?php selected( $form_settings['selects']['arrow_icon'] ?? 'default', 'default' ); ?>><?php esc_html_e( 'Default', 'modern-admin-styler' ); ?></option>
						<option value="chevron" <?php selected( $form_settings['selects']['arrow_icon'] ?? 'default', 'chevron' ); ?>><?php esc_html_e( 'Chevron', 'modern-admin-styler' ); ?></option>
						<option value="caret" <?php selected( $form_settings['selects']['arrow_icon'] ?? 'default', 'caret' ); ?>><?php esc_html_e( 'Caret', 'modern-admin-styler' ); ?></option>
					</select>
				</div>
			</div>

			<!-- Dropdown Background -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-dropdown-bg"><?php esc_html_e( 'Dropdown Background', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="form-control-dropdown-bg" name="form_controls[selects][dropdown_bg_color]" value="<?php echo esc_attr( $form_settings['selects']['dropdown_bg_color'] ?? '#ffffff' ); ?>" class="mase-color-picker form-control-style" data-control-type="selects" data-property="dropdown_bg_color" />
				</div>
			</div>

			<!-- Option Hover Color -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-option-hover"><?php esc_html_e( 'Option Hover Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="form-control-option-hover" name="form_controls[selects][option_hover_color]" value="<?php echo esc_attr( $form_settings['selects']['option_hover_color'] ?? '#f0f0f0' ); ?>" class="mase-color-picker form-control-style" data-control-type="selects" data-property="option_hover_color" />
				</div>
			</div>
		</div>
	</div>

	<!-- Special Controls Section (File Uploads) -->
	<div class="mase-section mase-form-control-section mase-special-controls" id="form-control-file-upload" data-show-for="file_uploads" style="display: none;">
		<div class="mase-section-card">
			<h3><?php esc_html_e( 'File Upload Styling', 'modern-admin-styler' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Customize the appearance of file upload fields.', 'modern-admin-styler' ); ?></p>
			
			<!-- Dropzone Background -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-dropzone-bg"><?php esc_html_e( 'Dropzone Background', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="form-control-dropzone-bg" name="form_controls[file_uploads][dropzone_bg_color]" value="<?php echo esc_attr( $form_settings['file_uploads']['dropzone_bg_color'] ?? '#f9f9f9' ); ?>" class="mase-color-picker form-control-style" data-control-type="file_uploads" data-property="dropzone_bg_color" />
				</div>
			</div>

			<!-- Progress Bar Color -->
			<div class="mase-setting-row">
				<div class="mase-setting-label">
					<label for="form-control-progress-color"><?php esc_html_e( 'Progress Bar Color', 'modern-admin-styler' ); ?></label>
				</div>
				<div class="mase-setting-control">
					<input type="text" id="form-control-progress-color" name="form_controls[file_uploads][progress_color]" value="<?php echo esc_attr( $form_settings['file_uploads']['progress_color'] ?? '#007cba' ); ?>" class="mase-color-picker form-control-style" data-control-type="file_uploads" data-property="progress_color" />
				</div>
			</div>
		</div>
	</div>

</div><!-- .mase-form-controls-wrapper -->
