		</table>
		
		<!-- Visual Effects Settings -->
		<h2><?php esc_html_e( 'Visual Effects Settings', 'modern-admin-styler' ); ?></h2>
		<p class="description"><?php esc_html_e( 'Customize border radius and shadow effects for admin interface elements.', 'modern-admin-styler' ); ?></p>
		
		<!-- Shadow Preset Selector -->
		<table class="form-table" role="presentation">
			<tbody>
				<tr>
					<th scope="row">
						<label for="ve-shadow-preset">
							<?php esc_html_e( 'Shadow Preset', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<select 
							id="ve-shadow-preset"
							name="visual_effects[preset]" 
							class="mase-select"
							aria-describedby="ve-shadow-preset-desc"
						>
							<option value="flat" <?php selected( $settings['visual_effects']['preset'] ?? 'flat', 'flat' ); ?>><?php esc_html_e( 'Flat (No Shadows)', 'modern-admin-styler' ); ?></option>
							<option value="subtle" <?php selected( $settings['visual_effects']['preset'] ?? 'flat', 'subtle' ); ?>><?php esc_html_e( 'Subtle', 'modern-admin-styler' ); ?></option>
							<option value="elevated" <?php selected( $settings['visual_effects']['preset'] ?? 'flat', 'elevated' ); ?>><?php esc_html_e( 'Elevated', 'modern-admin-styler' ); ?></option>
							<option value="floating" <?php selected( $settings['visual_effects']['preset'] ?? 'flat', 'floating' ); ?>><?php esc_html_e( 'Floating', 'modern-admin-styler' ); ?></option>
							<option value="custom" <?php selected( $settings['visual_effects']['preset'] ?? 'flat', 'custom' ); ?>><?php esc_html_e( 'Custom', 'modern-admin-styler' ); ?></option>
						</select>
						<p class="description" id="ve-shadow-preset-desc">
							<?php esc_html_e( 'Choose a shadow preset to quickly apply professional effects.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
			</tbody>
		</table>
		
		<!-- Admin Bar Visual Effects -->
		<h3><?php esc_html_e( 'Admin Bar Visual Effects', 'modern-admin-styler' ); ?></h3>
		<table class="form-table" role="presentation">
			<tbody>
				<tr>
					<th scope="row">
						<label for="ve-admin-bar-border-radius">
							<?php esc_html_e( 'Border Radius (px)', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<input 
							type="range" 
							id="ve-admin-bar-border-radius"
							name="visual_effects[admin_bar][border_radius]" 
							class="mase-range mase-ve-input"
							value="<?php echo esc_attr( $settings['visual_effects']['admin_bar']['border_radius'] ?? 0 ); ?>"
							min="0"
							max="30"
							step="1"
							aria-describedby="ve-admin-bar-border-radius-desc"
							aria-valuemin="0"
							aria-valuemax="30"
							aria-valuenow="<?php echo esc_attr( $settings['visual_effects']['admin_bar']['border_radius'] ?? 0 ); ?>"
						/>
						<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['admin_bar']['border_radius'] ?? 0 ); ?>px</span>
						<p class="description" id="ve-admin-bar-border-radius-desc">
							<?php esc_html_e( 'Set the border radius for the admin bar (0-30 pixels).', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<label for="ve-admin-bar-shadow-intensity">
							<?php esc_html_e( 'Shadow Intensity', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<select 
							id="ve-admin-bar-shadow-intensity"
							name="visual_effects[admin_bar][shadow_intensity]" 
							class="mase-select mase-ve-input"
							aria-describedby="ve-admin-bar-shadow-intensity-desc"
						>
							<option value="none" <?php selected( $settings['visual_effects']['admin_bar']['shadow_intensity'] ?? 'none', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
							<option value="subtle" <?php selected( $settings['visual_effects']['admin_bar']['shadow_intensity'] ?? 'none', 'subtle' ); ?>><?php esc_html_e( 'Subtle', 'modern-admin-styler' ); ?></option>
							<option value="medium" <?php selected( $settings['visual_effects']['admin_bar']['shadow_intensity'] ?? 'none', 'medium' ); ?>><?php esc_html_e( 'Medium', 'modern-admin-styler' ); ?></option>
							<option value="strong" <?php selected( $settings['visual_effects']['admin_bar']['shadow_intensity'] ?? 'none', 'strong' ); ?>><?php esc_html_e( 'Strong', 'modern-admin-styler' ); ?></option>
						</select>
						<p class="description" id="ve-admin-bar-shadow-intensity-desc">
							<?php esc_html_e( 'Choose the shadow intensity for the admin bar.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<?php esc_html_e( 'Shadow Direction', 'modern-admin-styler' ); ?>
					</th>
					<td class="mase-shadow-direction">
						<fieldset>
							<legend class="screen-reader-text"><?php esc_html_e( 'Shadow Direction', 'modern-admin-styler' ); ?></legend>
							<label>
								<input type="radio" name="visual_effects[admin_bar][shadow_direction]" value="top" class="mase-ve-input" <?php checked( $settings['visual_effects']['admin_bar']['shadow_direction'] ?? 'bottom', 'top' ); ?> />
								<?php esc_html_e( 'Top', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[admin_bar][shadow_direction]" value="right" class="mase-ve-input" <?php checked( $settings['visual_effects']['admin_bar']['shadow_direction'] ?? 'bottom', 'right' ); ?> />
								<?php esc_html_e( 'Right', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[admin_bar][shadow_direction]" value="bottom" class="mase-ve-input" <?php checked( $settings['visual_effects']['admin_bar']['shadow_direction'] ?? 'bottom', 'bottom' ); ?> />
								<?php esc_html_e( 'Bottom', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[admin_bar][shadow_direction]" value="left" class="mase-ve-input" <?php checked( $settings['visual_effects']['admin_bar']['shadow_direction'] ?? 'bottom', 'left' ); ?> />
								<?php esc_html_e( 'Left', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[admin_bar][shadow_direction]" value="center" class="mase-ve-input" <?php checked( $settings['visual_effects']['admin_bar']['shadow_direction'] ?? 'bottom', 'center' ); ?> />
								<?php esc_html_e( 'Center', 'modern-admin-styler' ); ?>
							</label>
						</fieldset>
						<p class="description">
							<?php esc_html_e( 'Choose the direction of the shadow effect.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<label for="ve-admin-bar-shadow-blur">
							<?php esc_html_e( 'Shadow Blur (px)', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<input 
							type="range" 
							id="ve-admin-bar-shadow-blur"
							name="visual_effects[admin_bar][shadow_blur]" 
							class="mase-range mase-ve-input"
							value="<?php echo esc_attr( $settings['visual_effects']['admin_bar']['shadow_blur'] ?? 10 ); ?>"
							min="0"
							max="30"
							step="1"
							aria-describedby="ve-admin-bar-shadow-blur-desc"
							aria-valuemin="0"
							aria-valuemax="30"
							aria-valuenow="<?php echo esc_attr( $settings['visual_effects']['admin_bar']['shadow_blur'] ?? 10 ); ?>"
						/>
						<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['admin_bar']['shadow_blur'] ?? 10 ); ?>px</span>
						<p class="description" id="ve-admin-bar-shadow-blur-desc">
							<?php esc_html_e( 'Adjust the blur radius of the shadow (0-30 pixels).', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<label for="ve-admin-bar-shadow-color">
							<?php esc_html_e( 'Shadow Color', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<input 
							type="text" 
							id="ve-admin-bar-shadow-color"
							name="visual_effects[admin_bar][shadow_color]" 
							class="mase-color-picker mase-ve-input"
							value="<?php echo esc_attr( $settings['visual_effects']['admin_bar']['shadow_color'] ?? 'rgba(0, 0, 0, 0.15)' ); ?>"
							aria-describedby="ve-admin-bar-shadow-color-desc"
						/>
						<p class="description" id="ve-admin-bar-shadow-color-desc">
							<?php esc_html_e( 'Choose the shadow color with opacity.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Admin Menu Visual Effects -->
		<h3><?php esc_html_e( 'Admin Menu Visual Effects', 'modern-admin-styler' ); ?></h3>
		<table class="form-table" role="presentation">
			<tbody>
				<tr>
					<th scope="row">
						<label for="ve-admin-menu-border-radius">
							<?php esc_html_e( 'Border Radius (px)', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<input 
							type="range" 
							id="ve-admin-menu-border-radius"
							name="visual_effects[admin_menu][border_radius]" 
							class="mase-range mase-ve-input"
							value="<?php echo esc_attr( $settings['visual_effects']['admin_menu']['border_radius'] ?? 0 ); ?>"
							min="0"
							max="30"
							step="1"
							aria-describedby="ve-admin-menu-border-radius-desc"
							aria-valuemin="0"
							aria-valuemax="30"
							aria-valuenow="<?php echo esc_attr( $settings['visual_effects']['admin_menu']['border_radius'] ?? 0 ); ?>"
						/>
						<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['admin_menu']['border_radius'] ?? 0 ); ?>px</span>
						<p class="description" id="ve-admin-menu-border-radius-desc">
							<?php esc_html_e( 'Set the border radius for admin menu items (0-30 pixels).', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<label for="ve-admin-menu-shadow-intensity">
							<?php esc_html_e( 'Shadow Intensity', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<select 
							id="ve-admin-menu-shadow-intensity"
							name="visual_effects[admin_menu][shadow_intensity]" 
							class="mase-select mase-ve-input"
							aria-describedby="ve-admin-menu-shadow-intensity-desc"
						>
							<option value="none" <?php selected( $settings['visual_effects']['admin_menu']['shadow_intensity'] ?? 'none', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
							<option value="subtle" <?php selected( $settings['visual_effects']['admin_menu']['shadow_intensity'] ?? 'none', 'subtle' ); ?>><?php esc_html_e( 'Subtle', 'modern-admin-styler' ); ?></option>
							<option value="medium" <?php selected( $settings['visual_effects']['admin_menu']['shadow_intensity'] ?? 'none', 'medium' ); ?>><?php esc_html_e( 'Medium', 'modern-admin-styler' ); ?></option>
							<option value="strong" <?php selected( $settings['visual_effects']['admin_menu']['shadow_intensity'] ?? 'none', 'strong' ); ?>><?php esc_html_e( 'Strong', 'modern-admin-styler' ); ?></option>
						</select>
						<p class="description" id="ve-admin-menu-shadow-intensity-desc">
							<?php esc_html_e( 'Choose the shadow intensity for admin menu items.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<?php esc_html_e( 'Shadow Direction', 'modern-admin-styler' ); ?>
					</th>
					<td class="mase-shadow-direction">
						<fieldset>
							<legend class="screen-reader-text"><?php esc_html_e( 'Shadow Direction', 'modern-admin-styler' ); ?></legend>
							<label>
								<input type="radio" name="visual_effects[admin_menu][shadow_direction]" value="top" class="mase-ve-input" <?php checked( $settings['visual_effects']['admin_menu']['shadow_direction'] ?? 'bottom', 'top' ); ?> />
								<?php esc_html_e( 'Top', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[admin_menu][shadow_direction]" value="right" class="mase-ve-input" <?php checked( $settings['visual_effects']['admin_menu']['shadow_direction'] ?? 'bottom', 'right' ); ?> />
								<?php esc_html_e( 'Right', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[admin_menu][shadow_direction]" value="bottom" class="mase-ve-input" <?php checked( $settings['visual_effects']['admin_menu']['shadow_direction'] ?? 'bottom', 'bottom' ); ?> />
								<?php esc_html_e( 'Bottom', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[admin_menu][shadow_direction]" value="left" class="mase-ve-input" <?php checked( $settings['visual_effects']['admin_menu']['shadow_direction'] ?? 'bottom', 'left' ); ?> />
								<?php esc_html_e( 'Left', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[admin_menu][shadow_direction]" value="center" class="mase-ve-input" <?php checked( $settings['visual_effects']['admin_menu']['shadow_direction'] ?? 'bottom', 'center' ); ?> />
								<?php esc_html_e( 'Center', 'modern-admin-styler' ); ?>
							</label>
						</fieldset>
						<p class="description">
							<?php esc_html_e( 'Choose the direction of the shadow effect.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<label for="ve-admin-menu-shadow-blur">
							<?php esc_html_e( 'Shadow Blur (px)', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<input 
							type="range" 
							id="ve-admin-menu-shadow-blur"
							name="visual_effects[admin_menu][shadow_blur]" 
							class="mase-range mase-ve-input"
							value="<?php echo esc_attr( $settings['visual_effects']['admin_menu']['shadow_blur'] ?? 10 ); ?>"
							min="0"
							max="30"
							step="1"
							aria-describedby="ve-admin-menu-shadow-blur-desc"
							aria-valuemin="0"
							aria-valuemax="30"
							aria-valuenow="<?php echo esc_attr( $settings['visual_effects']['admin_menu']['shadow_blur'] ?? 10 ); ?>"
						/>
						<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['admin_menu']['shadow_blur'] ?? 10 ); ?>px</span>
						<p class="description" id="ve-admin-menu-shadow-blur-desc">
							<?php esc_html_e( 'Adjust the blur radius of the shadow (0-30 pixels).', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<label for="ve-admin-menu-shadow-color">
							<?php esc_html_e( 'Shadow Color', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<input 
							type="text" 
							id="ve-admin-menu-shadow-color"
							name="visual_effects[admin_menu][shadow_color]" 
							class="mase-color-picker mase-ve-input"
							value="<?php echo esc_attr( $settings['visual_effects']['admin_menu']['shadow_color'] ?? 'rgba(0, 0, 0, 0.15)' ); ?>"
							aria-describedby="ve-admin-menu-shadow-color-desc"
						/>
						<p class="description" id="ve-admin-menu-shadow-color-desc">
							<?php esc_html_e( 'Choose the shadow color with opacity.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Buttons Visual Effects -->
		<h3><?php esc_html_e( 'Buttons Visual Effects', 'modern-admin-styler' ); ?></h3>
		<table class="form-table" role="presentation">
			<tbody>
				<tr>
					<th scope="row">
						<label for="ve-buttons-border-radius">
							<?php esc_html_e( 'Border Radius (px)', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<input 
							type="range" 
							id="ve-buttons-border-radius"
							name="visual_effects[buttons][border_radius]" 
							class="mase-range mase-ve-input"
							value="<?php echo esc_attr( $settings['visual_effects']['buttons']['border_radius'] ?? 3 ); ?>"
							min="0"
							max="30"
							step="1"
							aria-describedby="ve-buttons-border-radius-desc"
							aria-valuemin="0"
							aria-valuemax="30"
							aria-valuenow="<?php echo esc_attr( $settings['visual_effects']['buttons']['border_radius'] ?? 3 ); ?>"
						/>
						<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['buttons']['border_radius'] ?? 3 ); ?>px</span>
						<p class="description" id="ve-buttons-border-radius-desc">
							<?php esc_html_e( 'Set the border radius for buttons (0-30 pixels).', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<label for="ve-buttons-shadow-intensity">
							<?php esc_html_e( 'Shadow Intensity', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<select 
							id="ve-buttons-shadow-intensity"
							name="visual_effects[buttons][shadow_intensity]" 
							class="mase-select mase-ve-input"
							aria-describedby="ve-buttons-shadow-intensity-desc"
						>
							<option value="none" <?php selected( $settings['visual_effects']['buttons']['shadow_intensity'] ?? 'subtle', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
							<option value="subtle" <?php selected( $settings['visual_effects']['buttons']['shadow_intensity'] ?? 'subtle', 'subtle' ); ?>><?php esc_html_e( 'Subtle', 'modern-admin-styler' ); ?></option>
							<option value="medium" <?php selected( $settings['visual_effects']['buttons']['shadow_intensity'] ?? 'subtle', 'medium' ); ?>><?php esc_html_e( 'Medium', 'modern-admin-styler' ); ?></option>
							<option value="strong" <?php selected( $settings['visual_effects']['buttons']['shadow_intensity'] ?? 'subtle', 'strong' ); ?>><?php esc_html_e( 'Strong', 'modern-admin-styler' ); ?></option>
						</select>
						<p class="description" id="ve-buttons-shadow-intensity-desc">
							<?php esc_html_e( 'Choose the shadow intensity for buttons.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<?php esc_html_e( 'Shadow Direction', 'modern-admin-styler' ); ?>
					</th>
					<td class="mase-shadow-direction">
						<fieldset>
							<legend class="screen-reader-text"><?php esc_html_e( 'Shadow Direction', 'modern-admin-styler' ); ?></legend>
							<label>
								<input type="radio" name="visual_effects[buttons][shadow_direction]" value="top" class="mase-ve-input" <?php checked( $settings['visual_effects']['buttons']['shadow_direction'] ?? 'bottom', 'top' ); ?> />
								<?php esc_html_e( 'Top', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[buttons][shadow_direction]" value="right" class="mase-ve-input" <?php checked( $settings['visual_effects']['buttons']['shadow_direction'] ?? 'bottom', 'right' ); ?> />
								<?php esc_html_e( 'Right', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[buttons][shadow_direction]" value="bottom" class="mase-ve-input" <?php checked( $settings['visual_effects']['buttons']['shadow_direction'] ?? 'bottom', 'bottom' ); ?> />
								<?php esc_html_e( 'Bottom', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[buttons][shadow_direction]" value="left" class="mase-ve-input" <?php checked( $settings['visual_effects']['buttons']['shadow_direction'] ?? 'bottom', 'left' ); ?> />
								<?php esc_html_e( 'Left', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[buttons][shadow_direction]" value="center" class="mase-ve-input" <?php checked( $settings['visual_effects']['buttons']['shadow_direction'] ?? 'bottom', 'center' ); ?> />
								<?php esc_html_e( 'Center', 'modern-admin-styler' ); ?>
							</label>
						</fieldset>
						<p class="description">
							<?php esc_html_e( 'Choose the direction of the shadow effect.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<label for="ve-buttons-shadow-blur">
							<?php esc_html_e( 'Shadow Blur (px)', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<input 
							type="range" 
							id="ve-buttons-shadow-blur"
							name="visual_effects[buttons][shadow_blur]" 
							class="mase-range mase-ve-input"
							value="<?php echo esc_attr( $settings['visual_effects']['buttons']['shadow_blur'] ?? 8 ); ?>"
							min="0"
							max="30"
							step="1"
							aria-describedby="ve-buttons-shadow-blur-desc"
							aria-valuemin="0"
							aria-valuemax="30"
							aria-valuenow="<?php echo esc_attr( $settings['visual_effects']['buttons']['shadow_blur'] ?? 8 ); ?>"
						/>
						<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['buttons']['shadow_blur'] ?? 8 ); ?>px</span>
						<p class="description" id="ve-buttons-shadow-blur-desc">
							<?php esc_html_e( 'Adjust the blur radius of the shadow (0-30 pixels).', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<label for="ve-buttons-shadow-color">
							<?php esc_html_e( 'Shadow Color', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<input 
							type="text" 
							id="ve-buttons-shadow-color"
							name="visual_effects[buttons][shadow_color]" 
							class="mase-color-picker mase-ve-input"
							value="<?php echo esc_attr( $settings['visual_effects']['buttons']['shadow_color'] ?? 'rgba(0, 0, 0, 0.1)' ); ?>"
							aria-describedby="ve-buttons-shadow-color-desc"
						/>
						<p class="description" id="ve-buttons-shadow-color-desc">
							<?php esc_html_e( 'Choose the shadow color with opacity.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Form Fields Visual Effects -->
		<h3><?php esc_html_e( 'Form Fields Visual Effects', 'modern-admin-styler' ); ?></h3>
		<table class="form-table" role="presentation">
			<tbody>
				<tr>
					<th scope="row">
						<label for="ve-form-fields-border-radius">
							<?php esc_html_e( 'Border Radius (px)', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<input 
							type="range" 
							id="ve-form-fields-border-radius"
							name="visual_effects[form_fields][border_radius]" 
							class="mase-range mase-ve-input"
							value="<?php echo esc_attr( $settings['visual_effects']['form_fields']['border_radius'] ?? 3 ); ?>"
							min="0"
							max="30"
							step="1"
							aria-describedby="ve-form-fields-border-radius-desc"
							aria-valuemin="0"
							aria-valuemax="30"
							aria-valuenow="<?php echo esc_attr( $settings['visual_effects']['form_fields']['border_radius'] ?? 3 ); ?>"
						/>
						<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['form_fields']['border_radius'] ?? 3 ); ?>px</span>
						<p class="description" id="ve-form-fields-border-radius-desc">
							<?php esc_html_e( 'Set the border radius for form fields (0-30 pixels).', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<label for="ve-form-fields-shadow-intensity">
							<?php esc_html_e( 'Shadow Intensity', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<select 
							id="ve-form-fields-shadow-intensity"
							name="visual_effects[form_fields][shadow_intensity]" 
							class="mase-select mase-ve-input"
							aria-describedby="ve-form-fields-shadow-intensity-desc"
						>
							<option value="none" <?php selected( $settings['visual_effects']['form_fields']['shadow_intensity'] ?? 'none', 'none' ); ?>><?php esc_html_e( 'None', 'modern-admin-styler' ); ?></option>
							<option value="subtle" <?php selected( $settings['visual_effects']['form_fields']['shadow_intensity'] ?? 'none', 'subtle' ); ?>><?php esc_html_e( 'Subtle', 'modern-admin-styler' ); ?></option>
							<option value="medium" <?php selected( $settings['visual_effects']['form_fields']['shadow_intensity'] ?? 'none', 'medium' ); ?>><?php esc_html_e( 'Medium', 'modern-admin-styler' ); ?></option>
							<option value="strong" <?php selected( $settings['visual_effects']['form_fields']['shadow_intensity'] ?? 'none', 'strong' ); ?>><?php esc_html_e( 'Strong', 'modern-admin-styler' ); ?></option>
						</select>
						<p class="description" id="ve-form-fields-shadow-intensity-desc">
							<?php esc_html_e( 'Choose the shadow intensity for form fields.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<?php esc_html_e( 'Shadow Direction', 'modern-admin-styler' ); ?>
					</th>
					<td class="mase-shadow-direction">
						<fieldset>
							<legend class="screen-reader-text"><?php esc_html_e( 'Shadow Direction', 'modern-admin-styler' ); ?></legend>
							<label>
								<input type="radio" name="visual_effects[form_fields][shadow_direction]" value="top" class="mase-ve-input" <?php checked( $settings['visual_effects']['form_fields']['shadow_direction'] ?? 'bottom', 'top' ); ?> />
								<?php esc_html_e( 'Top', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[form_fields][shadow_direction]" value="right" class="mase-ve-input" <?php checked( $settings['visual_effects']['form_fields']['shadow_direction'] ?? 'bottom', 'right' ); ?> />
								<?php esc_html_e( 'Right', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[form_fields][shadow_direction]" value="bottom" class="mase-ve-input" <?php checked( $settings['visual_effects']['form_fields']['shadow_direction'] ?? 'bottom', 'bottom' ); ?> />
								<?php esc_html_e( 'Bottom', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[form_fields][shadow_direction]" value="left" class="mase-ve-input" <?php checked( $settings['visual_effects']['form_fields']['shadow_direction'] ?? 'bottom', 'left' ); ?> />
								<?php esc_html_e( 'Left', 'modern-admin-styler' ); ?>
							</label>
							<label>
								<input type="radio" name="visual_effects[form_fields][shadow_direction]" value="center" class="mase-ve-input" <?php checked( $settings['visual_effects']['form_fields']['shadow_direction'] ?? 'bottom', 'center' ); ?> />
								<?php esc_html_e( 'Center', 'modern-admin-styler' ); ?>
							</label>
						</fieldset>
						<p class="description">
							<?php esc_html_e( 'Choose the direction of the shadow effect.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<label for="ve-form-fields-shadow-blur">
							<?php esc_html_e( 'Shadow Blur (px)', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<input 
							type="range" 
							id="ve-form-fields-shadow-blur"
							name="visual_effects[form_fields][shadow_blur]" 
							class="mase-range mase-ve-input"
							value="<?php echo esc_attr( $settings['visual_effects']['form_fields']['shadow_blur'] ?? 5 ); ?>"
							min="0"
							max="30"
							step="1"
							aria-describedby="ve-form-fields-shadow-blur-desc"
							aria-valuemin="0"
							aria-valuemax="30"
							aria-valuenow="<?php echo esc_attr( $settings['visual_effects']['form_fields']['shadow_blur'] ?? 5 ); ?>"
						/>
						<span class="mase-range-value"><?php echo esc_html( $settings['visual_effects']['form_fields']['shadow_blur'] ?? 5 ); ?>px</span>
						<p class="description" id="ve-form-fields-shadow-blur-desc">
							<?php esc_html_e( 'Adjust the blur radius of the shadow (0-30 pixels).', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<label for="ve-form-fields-shadow-color">
							<?php esc_html_e( 'Shadow Color', 'modern-admin-styler' ); ?>
						</label>
					</th>
					<td>
						<input 
							type="text" 
							id="ve-form-fields-shadow-color"
							name="visual_effects[form_fields][shadow_color]" 
							class="mase-color-picker mase-ve-input"
							value="<?php echo esc_attr( $settings['visual_effects']['form_fields']['shadow_color'] ?? 'rgba(0, 0, 0, 0.05)' ); ?>"
							aria-describedby="ve-form-fields-shadow-color-desc"
						/>
						<p class="description" id="ve-form-fields-shadow-color-desc">
							<?php esc_html_e( 'Choose the shadow color with opacity.', 'modern-admin-styler' ); ?>
						</p>
					</td>
				</tr>
			</tbody>
		</table>
		
		<!-- Mobile Optimization Settings -->
		<h3><?php esc_html_e( 'Mobile Optimization', 'modern-admin-styler' ); ?></h3>
		<table class="form-table" role="presentation">
			<tbody>
				<tr>
					<th scope="row">
						<?php esc_html_e( 'Mobile Shadow Behavior', 'modern-admin-styler' ); ?>
					</th>
					<td>
						<fieldset>
							<legend class="screen-reader-text"><?php esc_html_e( 'Mobile Shadow Behavior', 'modern-admin-styler' ); ?></legend>
							<label for="ve-disable-mobile-shadows">
								<input 
									type="checkbox" 
									id="ve-disable-mobile-shadows"
									name="visual_effects[disable_mobile_shadows]" 
									value="1"
									<?php checked( $settings['visual_effects']['disable_mobile_shadows'] ?? false, true ); ?>
								/>
								<?php esc_html_e( 'Disable shadows on mobile devices', 'modern-admin-styler' ); ?>
							</label>
							<p class="description">
								<?php esc_html_e( 'Improves performance on mobile devices by disabling shadow effects. Border radius effects will remain active.', 'modern-admin-styler' ); ?>
							</p>
						</fieldset>
					</td>
				</tr>
				
				<tr>
					<th scope="row">
						<?php esc_html_e( 'Low-Power Device Detection', 'modern-admin-styler' ); ?>
					</th>
					<td>
						<fieldset>
							<legend class="screen-reader-text"><?php esc_html_e( 'Low-Power Device Detection', 'modern-admin-styler' ); ?></legend>
							<label for="ve-auto-detect-low-power">
								<input 
									type="checkbox" 
									id="ve-auto-detect-low-power"
									name="visual_effects[auto_detect_low_power]" 
									value="1"
									<?php checked( $settings['visual_effects']['auto_detect_low_power'] ?? true, true ); ?>
								/>
								<?php esc_html_e( 'Automatically detect and optimize for low-power devices', 'modern-admin-styler' ); ?>
							</label>
							<p class="description">
								<?php esc_html_e( 'Automatically reduces shadow complexity on devices with limited resources for better performance.', 'modern-admin-styler' ); ?>
							</p>
						</fieldset>
					</td>
				</tr>
			</tbody>
		</table>
		
		<!-- Performance Settings -->
