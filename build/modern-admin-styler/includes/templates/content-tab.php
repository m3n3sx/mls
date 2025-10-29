<?php
/**
 * Content Tab Template
 *
 * Styling dla content areas w WordPressie - typography, colors, spacing
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 13.1, 13.2, 13.3, 13.4, 13.5
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.2.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Get current settings
$current_settings = isset( $settings ) ? $settings : array();
$content_settings = isset( $current_settings['content'] ) ? $current_settings['content'] : array();
$typography       = isset( $content_settings['typography'] ) ? $content_settings['typography'] : array();
$colors           = isset( $content_settings['colors'] ) ? $content_settings['colors'] : array();
$spacing          = isset( $content_settings['spacing'] ) ? $content_settings['spacing'] : array();
?>

<!-- Content Tab Content - no wrapper div needed, already wrapped in admin-settings-page.php -->
<div class="mase-section">
	<div class="mase-section-header">
		<h2><?php esc_html_e( 'Content Styling', 'mase' ); ?></h2>
		<p class="description"><?php esc_html_e( 'Customize typography, colors, and spacing for WordPress admin content areas.', 'mase' ); ?></p>
	</div>
</div>

	<!-- Typography Section -->
	<div class="mase-section">
		<h3><?php esc_html_e( 'Content Typography', 'mase' ); ?></h3>
		
		<div class="mase-control-group">
			<label for="content_font_family">
				<?php esc_html_e( 'Font Family', 'mase' ); ?>
			</label>
			<select id="content_font_family" name="content[typography][font_family]" class="mase-select">
				<option value="system" <?php selected( isset( $typography['font_family'] ) ? $typography['font_family'] : 'system', 'system' ); ?>>
					<?php esc_html_e( 'System Font', 'mase' ); ?>
				</option>
				<option value="Arial" <?php selected( isset( $typography['font_family'] ) ? $typography['font_family'] : '', 'Arial' ); ?>>
					Arial
				</option>
				<option value="Georgia" <?php selected( isset( $typography['font_family'] ) ? $typography['font_family'] : '', 'Georgia' ); ?>>
					Georgia
				</option>
				<option value="Times New Roman" <?php selected( isset( $typography['font_family'] ) ? $typography['font_family'] : '', 'Times New Roman' ); ?>>
					Times New Roman
				</option>
				<option value="Verdana" <?php selected( isset( $typography['font_family'] ) ? $typography['font_family'] : '', 'Verdana' ); ?>>
					Verdana
				</option>
				<option value="Helvetica" <?php selected( isset( $typography['font_family'] ) ? $typography['font_family'] : '', 'Helvetica' ); ?>>
					Helvetica
				</option>
			</select>
			<p class="mase-control-description">
				<?php esc_html_e( 'Choose the font family for content text.', 'mase' ); ?>
			</p>
		</div>

		<div class="mase-control-group">
			<label for="content_font_size">
				<?php esc_html_e( 'Font Size', 'mase' ); ?>
			</label>
			<input 
				type="range" 
				id="content_font_size" 
				name="content[typography][font_size]" 
				min="12" 
				max="24" 
				step="1"
				value="<?php echo esc_attr( isset( $typography['font_size'] ) ? $typography['font_size'] : 14 ); ?>"
				class="mase-range-slider"
			>
			<span class="mase-range-value">
				<?php echo esc_html( isset( $typography['font_size'] ) ? $typography['font_size'] : 14 ); ?>px
			</span>
		</div>

		<div class="mase-control-group">
			<label for="content_line_height">
				<?php esc_html_e( 'Line Height', 'mase' ); ?>
			</label>
			<input 
				type="range" 
				id="content_line_height" 
				name="content[typography][line_height]" 
				min="1.0" 
				max="2.5" 
				step="0.1"
				value="<?php echo esc_attr( isset( $typography['line_height'] ) ? $typography['line_height'] : 1.6 ); ?>"
				class="mase-range-slider"
			>
			<span class="mase-range-value">
				<?php echo esc_html( isset( $typography['line_height'] ) ? $typography['line_height'] : 1.6 ); ?>
			</span>
		</div>
	</div>

	<!-- Colors Section -->
	<div class="mase-section">
		<h3><?php esc_html_e( 'Content Colors', 'mase' ); ?></h3>
		
		<div class="mase-control-group">
			<label for="content_text_color">
				<?php esc_html_e( 'Text Color', 'mase' ); ?>
			</label>
			<input 
				type="text" 
				id="content_text_color" 
				name="content[colors][text]" 
				class="mase-color-picker" 
				value="<?php echo esc_attr( isset( $colors['text'] ) ? $colors['text'] : '#333333' ); ?>"
			>
			<p class="mase-control-description">
				<?php esc_html_e( 'Main text color for content areas.', 'mase' ); ?>
			</p>
		</div>

		<div class="mase-control-group">
			<label for="content_link_color">
				<?php esc_html_e( 'Link Color', 'mase' ); ?>
			</label>
			<input 
				type="text" 
				id="content_link_color" 
				name="content[colors][link]" 
				class="mase-color-picker" 
				value="<?php echo esc_attr( isset( $colors['link'] ) ? $colors['link'] : '#0073aa' ); ?>"
			>
			<p class="mase-control-description">
				<?php esc_html_e( 'Color for links in content areas.', 'mase' ); ?>
			</p>
		</div>

		<div class="mase-control-group">
			<label for="content_heading_color">
				<?php esc_html_e( 'Heading Color', 'mase' ); ?>
			</label>
			<input 
				type="text" 
				id="content_heading_color" 
				name="content[colors][heading]" 
				class="mase-color-picker" 
				value="<?php echo esc_attr( isset( $colors['heading'] ) ? $colors['heading'] : '#23282d' ); ?>"
			>
			<p class="mase-control-description">
				<?php esc_html_e( 'Color for headings (h1-h6) in content areas.', 'mase' ); ?>
			</p>
		</div>
	</div>

	<!-- Spacing Section -->
	<div class="mase-section">
		<h3><?php esc_html_e( 'Content Spacing', 'mase' ); ?></h3>
		
		<div class="mase-control-group">
			<label for="content_paragraph_margin">
				<?php esc_html_e( 'Paragraph Margin', 'mase' ); ?>
			</label>
			<input 
				type="range" 
				id="content_paragraph_margin" 
				name="content[spacing][paragraph_margin]" 
				min="0" 
				max="30" 
				step="1"
				value="<?php echo esc_attr( isset( $spacing['paragraph_margin'] ) ? $spacing['paragraph_margin'] : 16 ); ?>"
				class="mase-range-slider"
			>
			<span class="mase-range-value">
				<?php echo esc_html( isset( $spacing['paragraph_margin'] ) ? $spacing['paragraph_margin'] : 16 ); ?>px
			</span>
			<p class="mase-control-description">
				<?php esc_html_e( 'Bottom margin for paragraphs.', 'mase' ); ?>
			</p>
		</div>

		<div class="mase-control-group">
			<label for="content_heading_margin">
				<?php esc_html_e( 'Heading Margin', 'mase' ); ?>
			</label>
			<input 
				type="range" 
				id="content_heading_margin" 
				name="content[spacing][heading_margin]" 
				min="0" 
				max="50" 
				step="1"
				value="<?php echo esc_attr( isset( $spacing['heading_margin'] ) ? $spacing['heading_margin'] : 20 ); ?>"
				class="mase-range-slider"
			>
			<span class="mase-range-value">
				<?php echo esc_html( isset( $spacing['heading_margin'] ) ? $spacing['heading_margin'] : 20 ); ?>px
			</span>
			<p class="mase-control-description">
				<?php esc_html_e( 'Bottom margin for headings.', 'mase' ); ?>
			</p>
		</div>
	</div>

	<!-- Preview Section -->
	<div class="mase-section mase-preview-section">
		<h3><?php esc_html_e( 'Preview', 'mase' ); ?></h3>
		<div class="mase-content-preview">
			<h2><?php esc_html_e( 'Sample Heading', 'mase' ); ?></h2>
			<p>
				<?php esc_html_e( 'This is a sample paragraph to preview your content styling. You can see how the font size, line height, and colors will look in the WordPress admin.', 'mase' ); ?>
			</p>
			<p>
				<a href="#"><?php esc_html_e( 'Sample Link', 'mase' ); ?></a>
			</p>
		</div>
	</div>
