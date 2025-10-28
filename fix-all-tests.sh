#!/bin/bash

# Admin Bar fields
find tests/visual-interactive/scenarios/admin-bar -name "*.spec.cjs" -exec sed -i \
  -e 's/admin_bar\[bg_color\]/admin-bar-bg-color/g' \
  -e 's/admin_bar\[text_color\]/admin-bar-text-color/g' \
  -e 's/admin_bar\[hover_color\]/admin-bar-hover-color/g' \
  -e 's/admin_bar\[height\]/admin-bar-height/g' \
  -e 's/admin_bar\[bg_type\]/admin-bar-bg-type/g' \
  -e 's/admin_bar\[gradient_type\]/admin-bar-gradient-type/g' \
  -e 's/admin_bar\[gradient_angle\]/admin-bar-gradient-angle/g' \
  -e 's/admin_bar\[gradient_color_1\]/admin-bar-gradient-color-1/g' \
  -e 's/admin_bar\[gradient_color_2\]/admin-bar-gradient-color-2/g' \
  -e 's/admin_bar\[font_size\]/admin-bar-font-size/g' \
  -e 's/admin_bar\[font_weight\]/admin-bar-font-weight/g' \
  -e 's/admin_bar\[font_family\]/admin-bar-font-family/g' \
  -e 's/admin_bar\[line_height\]/admin-bar-line-height/g' \
  {} \;

# Menu fields
find tests/visual-interactive/scenarios/menu -name "*.spec.cjs" -exec sed -i \
  -e 's/admin_menu\[bg_color\]/admin-menu-bg-color/g' \
  -e 's/admin_menu\[text_color\]/admin-menu-text-color/g' \
  -e 's/admin_menu\[hover_color\]/admin-menu-hover-color/g' \
  -e 's/admin_menu\[height\]/admin-menu-height/g' \
  -e 's/admin_menu\[font_size\]/admin-menu-font-size/g' \
  {} \;

# Content fields - already done

# Typography fields
find tests/visual-interactive/scenarios/typography -name "*.spec.cjs" -exec sed -i \
  -e 's/typography\[global\]\[font_size\]/global-font-size/g' \
  -e 's/typography\[global\]\[font_family\]/global-font-family/g' \
  {} \;

# Buttons fields
find tests/visual-interactive/scenarios/buttons -name "*.spec.cjs" -exec sed -i \
  -e 's/buttons\[primary\]\[bg_color\]/primary-button-bg-color/g' \
  -e 's/buttons\[primary\]\[text_color\]/primary-button-text-color/g' \
  -e 's/buttons\[secondary\]\[bg_color\]/secondary-button-bg-color/g' \
  -e 's/buttons\[secondary\]\[text_color\]/secondary-button-text-color/g' \
  {} \;

# Effects fields
find tests/visual-interactive/scenarios/effects -name "*.spec.cjs" -exec sed -i \
  -e 's/effects\[animations\]\[enabled\]/animations-enabled/g' \
  -e 's/effects\[transitions\]\[duration\]/transition-duration/g' \
  {} \;

# Backgrounds fields
find tests/visual-interactive/scenarios/backgrounds -name "*.spec.cjs" -exec sed -i \
  -e 's/backgrounds\[type\]/background-type/g' \
  -e 's/backgrounds\[color\]/background-color/g' \
  -e 's/backgrounds\[image\]/background-image/g' \
  {} \;

echo "All tests updated!"
