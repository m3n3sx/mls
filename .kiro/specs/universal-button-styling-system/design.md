# Design Document

## Overview

The Universal Button Styling System extends MASE to provide comprehensive customization of all WordPress admin button types. The system follows MASE's established architectural patterns: settings stored in nested arrays, validation through dedicated methods, CSS generation via the CSS Generator class, and real-time preview through the JavaScript live preview system.

### Design Goals

1. **Comprehensive Coverage**: Style all WordPress core button types (Primary, Secondary, Danger, Success, Ghost, Tabs)
2. **Granular Control**: Provide detailed controls for colors, typography, borders, padding, states, and effects
3. **Accessibility First**: Enforce WCAG 2.1 Level AA compliance with contrast checking and focus indicators
4. **Performance**: Generate CSS efficiently (<100ms) with proper caching
5. **Consistency**: Follow existing MASE patterns for maintainability
6. **Extensibility**: Allow future addition of new button types or properties

### Key Features

- 6 button type categories with independent styling
- 5 button states (normal, hover, active, focus, disabled)
- Gradient background support
- Individual border radius control
- Box shadow with presets and custom values
- Typography controls (size, weight, transform)
- Ripple effect animation
- Live preview with real-time updates
- Reset to defaults functionality
- Mobile responsive adjustments

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    WordPress Admin Panel                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              MASE Settings Page                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │     Universal Buttons Tab                       │  │  │
│  │  │  ┌──────────────────────────────────────────┐   │  │  │
│  │  │  │  Button Type Selector (Tabs)             │   │  │  │
│  │  │  │  [Primary][Secondary][Danger][Success]   │   │  │  │
│  │  │  └──────────────────────────────────────────┘   │  │  │
│  │  │  ┌──────────────────────────────────────────┐   │  │  │
│  │  │  │  State Selector                          │   │  │  │
│  │  │  │  [Normal][Hover][Active][Focus][Disabled]│   │  │  │
│  │  │  └──────────────────────────────────────────┘   │  │  │
│  │  │  ┌──────────────────────────────────────────┐   │  │  │
│  │  │  │  Property Controls                       │   │  │  │
│  │  │  │  • Background (Color/Gradient)           │   │  │  │
│  │  │  │  • Text Color                            │   │  │  │
│  │  │  │  • Border (Width, Style, Color, Radius)  │   │  │  │
│  │  │  │  • Padding (Horizontal, Vertical)        │   │  │  │
│  │  │  │  • Typography (Size, Weight, Transform)  │   │  │  │
│  │  │  │  • Effects (Shadow, Transition, Ripple)  │   │  │  │
│  │  │  └──────────────────────────────────────────┘   │  │  │
│  │  │  ┌──────────────────────────────────────────┐   │  │  │
│  │  │  │  Live Preview Area                       │   │  │  │
│  │  │  │  [Sample Buttons in All States]          │   │  │  │
│  │  │  └──────────────────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Backend Architecture                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  MASE_Settings                                        │  │
│  │  • get_defaults() - Button defaults                  │  │
│  │  • validate() - Main validation router               │  │
│  │  • validate_buttons() - Button-specific validation   │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  MASE_CSS_Generator                                   │  │
│  │  • generate() - Main CSS generation                  │  │
│  │  • generate_button_styles() - Button CSS generation  │  │
│  │  • generate_button_type_css() - Per-type CSS         │  │
│  │  • generate_button_state_css() - Per-state CSS       │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  mase-admin.js                                        │  │
│  │  • buttonStyler module                                │  │
│  │  • updateLivePreview() - Real-time updates           │  │
│  │  • updateButtonPreview() - Button-specific preview   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```


### Data Flow

```
User Interaction → JavaScript Event Handler → Live Preview Update
                                            ↓
                                    AJAX Request (on save)
                                            ↓
                                    MASE_Settings::validate()
                                            ↓
                                    MASE_Settings::validate_buttons()
                                            ↓
                                    WordPress Options Table
                                            ↓
                                    MASE_CSS_Generator::generate()
                                            ↓
                                    MASE_CSS_Generator::generate_button_styles()
                                            ↓
                                    CSS Output → WordPress Admin
```

## Components and Interfaces

### 1. Settings Structure (MASE_Settings)

#### Data Model

The button settings will be stored in a nested array structure under the key `universal_buttons`:

```php
'universal_buttons' => array(
    'primary' => array(
        'normal' => array(
            'bg_type' => 'solid',  // 'solid' | 'gradient'
            'bg_color' => '#0073aa',
            'gradient_type' => 'linear',  // 'linear' | 'radial'
            'gradient_angle' => 90,  // 0-360
            'gradient_colors' => array(
                array('color' => '#0073aa', 'position' => 0),
                array('color' => '#005177', 'position' => 100)
            ),
            'text_color' => '#ffffff',
            'border_width' => 1,  // 0-5px
            'border_style' => 'solid',  // 'solid' | 'dashed' | 'dotted' | 'none'
            'border_color' => '#0073aa',
            'border_radius_mode' => 'uniform',  // 'uniform' | 'individual'
            'border_radius' => 3,  // 0-25px
            'border_radius_tl' => 3,
            'border_radius_tr' => 3,
            'border_radius_bl' => 3,
            'border_radius_br' => 3,
            'padding_horizontal' => 12,  // 5-30px
            'padding_vertical' => 6,  // 3-20px
            'font_size' => 13,  // 11-18px
            'font_weight' => 400,  // 300, 400, 500, 600, 700
            'text_transform' => 'none',  // 'none' | 'uppercase' | 'lowercase' | 'capitalize'
            'shadow_mode' => 'preset',  // 'preset' | 'custom' | 'none'
            'shadow_preset' => 'subtle',  // 'none' | 'subtle' | 'medium' | 'strong'
            'shadow_h_offset' => 0,
            'shadow_v_offset' => 2,
            'shadow_blur' => 4,
            'shadow_spread' => 0,
            'shadow_color' => 'rgba(0,0,0,0.1)',
            'transition_duration' => 200,  // 0-1000ms
            'ripple_effect' => false
        ),
        'hover' => array(/* same structure */),
        'active' => array(/* same structure */),
        'focus' => array(/* same structure */),
        'disabled' => array(/* same structure */)
    ),
    'secondary' => array(/* same structure as primary */),
    'danger' => array(/* same structure as primary */),
    'success' => array(/* same structure as primary */),
    'ghost' => array(/* same structure as primary */),
    'tabs' => array(/* same structure as primary */)
)
```


#### Default Values Method

Extend `MASE_Settings::get_defaults()` to include button defaults:

```php
public function get_defaults() {
    return array(
        // ... existing defaults ...
        'universal_buttons' => $this->get_button_defaults()
    );
}

private function get_button_defaults() {
    $default_state = array(
        'bg_type' => 'solid',
        'bg_color' => '#0073aa',
        'gradient_type' => 'linear',
        'gradient_angle' => 90,
        'gradient_colors' => array(
            array('color' => '#0073aa', 'position' => 0),
            array('color' => '#005177', 'position' => 100)
        ),
        'text_color' => '#ffffff',
        'border_width' => 1,
        'border_style' => 'solid',
        'border_color' => '#0073aa',
        'border_radius_mode' => 'uniform',
        'border_radius' => 3,
        'border_radius_tl' => 3,
        'border_radius_tr' => 3,
        'border_radius_bl' => 3,
        'border_radius_br' => 3,
        'padding_horizontal' => 12,
        'padding_vertical' => 6,
        'font_size' => 13,
        'font_weight' => 400,
        'text_transform' => 'none',
        'shadow_mode' => 'preset',
        'shadow_preset' => 'subtle',
        'shadow_h_offset' => 0,
        'shadow_v_offset' => 2,
        'shadow_blur' => 4,
        'shadow_spread' => 0,
        'shadow_color' => 'rgba(0,0,0,0.1)',
        'transition_duration' => 200,
        'ripple_effect' => false
    );

    return array(
        'primary' => array(
            'normal' => $default_state,
            'hover' => array_merge($default_state, array('bg_color' => '#005177')),
            'active' => array_merge($default_state, array('bg_color' => '#004561')),
            'focus' => array_merge($default_state, array('border_color' => '#00a0d2')),
            'disabled' => array_merge($default_state, array('bg_color' => '#cccccc', 'text_color' => '#666666'))
        ),
        'secondary' => array(/* WordPress secondary button defaults */),
        'danger' => array(/* Red/destructive button defaults */),
        'success' => array(/* Green/success button defaults */),
        'ghost' => array(/* Transparent/link button defaults */),
        'tabs' => array(/* Navigation tab defaults */)
    );
}
```

### 2. Validation (MASE_Settings)

#### Main Validation Router

Update `MASE_Settings::validate()` to route button validation:

```php
public function validate( $input ) {
    $validated = array();
    $errors = array();

    // ... existing validation ...

    // Validate universal buttons
    if ( isset( $input['universal_buttons'] ) ) {
        $button_validation = $this->validate_buttons( $input['universal_buttons'] );
        if ( is_wp_error( $button_validation ) ) {
            $errors['universal_buttons'] = $button_validation->get_error_message();
        } else {
            $validated['universal_buttons'] = $button_validation;
        }
    }

    // ... rest of validation ...
}
```


#### Button Validation Method

New method `MASE_Settings::validate_buttons()`:

```php
private function validate_buttons( $buttons ) {
    $validated = array();
    $errors = array();

    $button_types = array('primary', 'secondary', 'danger', 'success', 'ghost', 'tabs');
    $button_states = array('normal', 'hover', 'active', 'focus', 'disabled');

    foreach ( $button_types as $type ) {
        if ( ! isset( $buttons[ $type ] ) ) {
            continue;
        }

        $validated[ $type ] = array();

        foreach ( $button_states as $state ) {
            if ( ! isset( $buttons[ $type ][ $state ] ) ) {
                continue;
            }

            $state_data = $buttons[ $type ][ $state ];
            $validated_state = array();

            // Validate bg_type
            $validated_state['bg_type'] = $this->validate_enum(
                $state_data['bg_type'] ?? 'solid',
                array('solid', 'gradient'),
                'solid'
            );

            // Validate colors
            $validated_state['bg_color'] = $this->validate_color(
                $state_data['bg_color'] ?? '#0073aa',
                '#0073aa'
            );
            $validated_state['text_color'] = $this->validate_color(
                $state_data['text_color'] ?? '#ffffff',
                '#ffffff'
            );
            $validated_state['border_color'] = $this->validate_color(
                $state_data['border_color'] ?? '#0073aa',
                '#0073aa'
            );

            // Validate gradient settings
            $validated_state['gradient_type'] = $this->validate_enum(
                $state_data['gradient_type'] ?? 'linear',
                array('linear', 'radial'),
                'linear'
            );
            $validated_state['gradient_angle'] = $this->validate_numeric_range(
                $state_data['gradient_angle'] ?? 90,
                0,
                360,
                90
            );
            $validated_state['gradient_colors'] = $this->validate_gradient_colors(
                $state_data['gradient_colors'] ?? array()
            );

            // Validate border properties
            $validated_state['border_width'] = $this->validate_numeric_range(
                $state_data['border_width'] ?? 1,
                0,
                5,
                1
            );
            $validated_state['border_style'] = $this->validate_enum(
                $state_data['border_style'] ?? 'solid',
                array('solid', 'dashed', 'dotted', 'none'),
                'solid'
            );

            // Validate border radius
            $validated_state['border_radius_mode'] = $this->validate_enum(
                $state_data['border_radius_mode'] ?? 'uniform',
                array('uniform', 'individual'),
                'uniform'
            );
            $validated_state['border_radius'] = $this->validate_numeric_range(
                $state_data['border_radius'] ?? 3,
                0,
                25,
                3
            );
            $validated_state['border_radius_tl'] = $this->validate_numeric_range(
                $state_data['border_radius_tl'] ?? 3,
                0,
                25,
                3
            );
            $validated_state['border_radius_tr'] = $this->validate_numeric_range(
                $state_data['border_radius_tr'] ?? 3,
                0,
                25,
                3
            );
            $validated_state['border_radius_bl'] = $this->validate_numeric_range(
                $state_data['border_radius_bl'] ?? 3,
                0,
                25,
                3
            );
            $validated_state['border_radius_br'] = $this->validate_numeric_range(
                $state_data['border_radius_br'] ?? 3,
                0,
                25,
                3
            );

            // Validate padding
            $validated_state['padding_horizontal'] = $this->validate_numeric_range(
                $state_data['padding_horizontal'] ?? 12,
                5,
                30,
                12
            );
            $validated_state['padding_vertical'] = $this->validate_numeric_range(
                $state_data['padding_vertical'] ?? 6,
                3,
                20,
                6
            );

            // Validate typography
            $validated_state['font_size'] = $this->validate_numeric_range(
                $state_data['font_size'] ?? 13,
                11,
                18,
                13
            );
            $validated_state['font_weight'] = $this->validate_enum(
                $state_data['font_weight'] ?? 400,
                array(300, 400, 500, 600, 700),
                400
            );
            $validated_state['text_transform'] = $this->validate_enum(
                $state_data['text_transform'] ?? 'none',
                array('none', 'uppercase', 'lowercase', 'capitalize'),
                'none'
            );

            // Validate shadow
            $validated_state['shadow_mode'] = $this->validate_enum(
                $state_data['shadow_mode'] ?? 'preset',
                array('preset', 'custom', 'none'),
                'preset'
            );
            $validated_state['shadow_preset'] = $this->validate_enum(
                $state_data['shadow_preset'] ?? 'subtle',
                array('none', 'subtle', 'medium', 'strong'),
                'subtle'
            );
            $validated_state['shadow_h_offset'] = intval( $state_data['shadow_h_offset'] ?? 0 );
            $validated_state['shadow_v_offset'] = intval( $state_data['shadow_v_offset'] ?? 2 );
            $validated_state['shadow_blur'] = $this->validate_numeric_range(
                $state_data['shadow_blur'] ?? 4,
                0,
                50,
                4
            );
            $validated_state['shadow_spread'] = intval( $state_data['shadow_spread'] ?? 0 );
            $validated_state['shadow_color'] = sanitize_text_field(
                $state_data['shadow_color'] ?? 'rgba(0,0,0,0.1)'
            );

            // Validate effects
            $validated_state['transition_duration'] = $this->validate_numeric_range(
                $state_data['transition_duration'] ?? 200,
                0,
                1000,
                200
            );
            $validated_state['ripple_effect'] = $this->validate_boolean(
                $state_data['ripple_effect'] ?? false
            );

            // Accessibility check: Enforce minimum contrast ratio
            $contrast_check = $this->check_button_contrast(
                $validated_state['bg_color'],
                $validated_state['text_color']
            );
            if ( ! $contrast_check['passes'] ) {
                $errors[ $type . '_' . $state . '_contrast' ] = sprintf(
                    'Button %s %s state has insufficient contrast ratio: %.2f (minimum 4.5:1 required)',
                    $type,
                    $state,
                    $contrast_check['ratio']
                );
            }

            $validated[ $type ][ $state ] = $validated_state;
        }
    }

    if ( ! empty( $errors ) ) {
        return new WP_Error( 'button_validation_failed', 'Button validation failed', $errors );
    }

    return $validated;
}
```


#### Accessibility Contrast Checker

New helper method for WCAG compliance:

```php
private function check_button_contrast( $bg_color, $text_color ) {
    // Convert hex to RGB
    $bg_rgb = $this->hex_to_rgb( $bg_color );
    $text_rgb = $this->hex_to_rgb( $text_color );

    // Calculate relative luminance
    $bg_luminance = $this->calculate_luminance( $bg_rgb );
    $text_luminance = $this->calculate_luminance( $text_rgb );

    // Calculate contrast ratio
    $lighter = max( $bg_luminance, $text_luminance );
    $darker = min( $bg_luminance, $text_luminance );
    $ratio = ( $lighter + 0.05 ) / ( $darker + 0.05 );

    return array(
        'ratio' => $ratio,
        'passes' => $ratio >= 4.5  // WCAG AA requirement
    );
}

private function calculate_luminance( $rgb ) {
    $r = $rgb['r'] / 255;
    $g = $rgb['g'] / 255;
    $b = $rgb['b'] / 255;

    $r = $r <= 0.03928 ? $r / 12.92 : pow( ( $r + 0.055 ) / 1.055, 2.4 );
    $g = $g <= 0.03928 ? $g / 12.92 : pow( ( $g + 0.055 ) / 1.055, 2.4 );
    $b = $b <= 0.03928 ? $b / 12.92 : pow( ( $b + 0.055 ) / 1.055, 2.4 );

    return 0.2126 * $r + 0.7152 * $g + 0.0722 * $b;
}

private function hex_to_rgb( $hex ) {
    $hex = ltrim( $hex, '#' );
    if ( strlen( $hex ) === 3 ) {
        $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
    }
    return array(
        'r' => hexdec( substr( $hex, 0, 2 ) ),
        'g' => hexdec( substr( $hex, 2, 2 ) ),
        'b' => hexdec( substr( $hex, 4, 2 ) )
    );
}
```

### 3. CSS Generation (MASE_CSS_Generator)

#### Main Generation Method

Update `MASE_CSS_Generator::generate_css_internal()` to include button styles:

```php
private function generate_css_internal( $settings ) {
    $css = '';

    // ... existing CSS generation ...

    // Generate button styles
    $css .= $this->generate_button_styles( $settings );

    return $css;
}
```

#### Button Styles Generation

New method `MASE_CSS_Generator::generate_button_styles()`:

```php
private function generate_button_styles( $settings ) {
    try {
        $buttons = isset( $settings['universal_buttons'] ) ? $settings['universal_buttons'] : array();
        
        if ( empty( $buttons ) ) {
            return '';
        }

        $css = '';

        // Generate CSS custom properties for easier management
        $css .= $this->generate_button_css_variables( $buttons );

        // Generate styles for each button type
        $button_types = array(
            'primary' => array('.button-primary', '.wp-core-ui .button-primary'),
            'secondary' => array('.button', '.wp-core-ui .button'),
            'danger' => array('.button.delete', '.submitdelete'),
            'success' => array('.button.button-large'),
            'ghost' => array('.button-link'),
            'tabs' => array('.nav-tab', '.nav-tab-active')
        );

        foreach ( $button_types as $type => $selectors ) {
            if ( ! isset( $buttons[ $type ] ) ) {
                continue;
            }

            $css .= $this->generate_button_type_css( $type, $selectors, $buttons[ $type ] );
        }

        // Generate ripple effect animation if enabled
        $css .= $this->generate_ripple_animation_css( $buttons );

        return $css;

    } catch ( Exception $e ) {
        error_log( sprintf( 'MASE: Button styles generation failed: %s', $e->getMessage() ) );
        return '';
    }
}
```


#### CSS Variables Generation

```php
private function generate_button_css_variables( $buttons ) {
    $css = ':root {';

    foreach ( $buttons as $type => $states ) {
        foreach ( $states as $state => $props ) {
            $prefix = '--mase-btn-' . $type . '-' . $state;
            
            $css .= $prefix . '-bg: ' . $props['bg_color'] . ';';
            $css .= $prefix . '-text: ' . $props['text_color'] . ';';
            $css .= $prefix . '-border: ' . $props['border_color'] . ';';
            $css .= $prefix . '-shadow: ' . $this->get_shadow_value( $props ) . ';';
        }
    }

    $css .= '}';
    return $css;
}
```

#### Button Type CSS Generation

```php
private function generate_button_type_css( $type, $selectors, $states ) {
    $css = '';
    $selector_string = implode( ', ', $selectors );

    // Normal state
    if ( isset( $states['normal'] ) ) {
        $css .= $selector_string . ' {';
        $css .= $this->generate_button_state_properties( $states['normal'] );
        $css .= '}';
    }

    // Hover state
    if ( isset( $states['hover'] ) ) {
        $hover_selectors = array_map( function( $sel ) {
            return $sel . ':hover';
        }, $selectors );
        $css .= implode( ', ', $hover_selectors ) . ' {';
        $css .= $this->generate_button_state_properties( $states['hover'] );
        $css .= '}';
    }

    // Active state
    if ( isset( $states['active'] ) ) {
        $active_selectors = array_map( function( $sel ) {
            return $sel . ':active';
        }, $selectors );
        $css .= implode( ', ', $active_selectors ) . ' {';
        $css .= $this->generate_button_state_properties( $states['active'] );
        $css .= '}';
    }

    // Focus state
    if ( isset( $states['focus'] ) ) {
        $focus_selectors = array_map( function( $sel ) {
            return $sel . ':focus';
        }, $selectors );
        $css .= implode( ', ', $focus_selectors ) . ' {';
        $css .= $this->generate_button_state_properties( $states['focus'] );
        // Ensure visible focus indicator for accessibility
        $css .= 'outline: 2px solid ' . $states['focus']['border_color'] . ' !important;';
        $css .= 'outline-offset: 2px !important;';
        $css .= '}';
    }

    // Disabled state
    if ( isset( $states['disabled'] ) ) {
        $disabled_selectors = array_map( function( $sel ) {
            return $sel . ':disabled, ' . $sel . '[disabled]';
        }, $selectors );
        $css .= implode( ', ', $disabled_selectors ) . ' {';
        $css .= $this->generate_button_state_properties( $states['disabled'] );
        $css .= 'cursor: not-allowed !important;';
        $css .= 'opacity: 0.6 !important;';
        $css .= '}';
    }

    return $css;
}
```

#### Button State Properties

```php
private function generate_button_state_properties( $props ) {
    $css = '';

    // Background
    if ( $props['bg_type'] === 'gradient' ) {
        $css .= $this->generate_button_gradient_background( $props );
    } else {
        $css .= 'background-color: ' . $props['bg_color'] . ' !important;';
    }

    // Text color
    $css .= 'color: ' . $props['text_color'] . ' !important;';

    // Border
    if ( $props['border_width'] > 0 && $props['border_style'] !== 'none' ) {
        $css .= 'border: ' . $props['border_width'] . 'px ' . $props['border_style'] . ' ' . $props['border_color'] . ' !important;';
    } else {
        $css .= 'border: none !important;';
    }

    // Border radius
    if ( $props['border_radius_mode'] === 'individual' ) {
        $css .= sprintf(
            'border-radius: %dpx %dpx %dpx %dpx !important;',
            $props['border_radius_tl'],
            $props['border_radius_tr'],
            $props['border_radius_br'],
            $props['border_radius_bl']
        );
    } else {
        $css .= 'border-radius: ' . $props['border_radius'] . 'px !important;';
    }

    // Padding
    $css .= sprintf(
        'padding: %dpx %dpx !important;',
        $props['padding_vertical'],
        $props['padding_horizontal']
    );

    // Typography
    $css .= 'font-size: ' . $props['font_size'] . 'px !important;';
    $css .= 'font-weight: ' . $props['font_weight'] . ' !important;';
    $css .= 'text-transform: ' . $props['text_transform'] . ' !important;';

    // Shadow
    if ( $props['shadow_mode'] !== 'none' ) {
        $shadow_value = $this->get_button_shadow_value( $props );
        if ( $shadow_value !== 'none' ) {
            $css .= 'box-shadow: ' . $shadow_value . ' !important;';
        }
    }

    // Transition
    if ( $props['transition_duration'] > 0 ) {
        $css .= 'transition: all ' . $props['transition_duration'] . 'ms ease !important;';
    }

    // Ripple effect positioning
    if ( $props['ripple_effect'] ) {
        $css .= 'position: relative !important;';
        $css .= 'overflow: hidden !important;';
    }

    return $css;
}
```


#### Helper Methods

```php
private function generate_button_gradient_background( $props ) {
    $gradient_type = $props['gradient_type'];
    $gradient_angle = $props['gradient_angle'];
    $gradient_colors = $props['gradient_colors'];

    $color_stops = array();
    foreach ( $gradient_colors as $stop ) {
        $color_stops[] = $stop['color'] . ' ' . $stop['position'] . '%';
    }
    $color_stops_str = implode( ', ', $color_stops );

    if ( $gradient_type === 'radial' ) {
        return 'background: radial-gradient(circle, ' . $color_stops_str . ') !important;';
    } else {
        return 'background: linear-gradient(' . $gradient_angle . 'deg, ' . $color_stops_str . ') !important;';
    }
}

private function get_button_shadow_value( $props ) {
    if ( $props['shadow_mode'] === 'preset' ) {
        $presets = array(
            'none' => 'none',
            'subtle' => '0 1px 2px rgba(0,0,0,0.1)',
            'medium' => '0 2px 4px rgba(0,0,0,0.15)',
            'strong' => '0 4px 8px rgba(0,0,0,0.2)'
        );
        return $presets[ $props['shadow_preset'] ] ?? 'none';
    } else {
        return sprintf(
            '%dpx %dpx %dpx %dpx %s',
            $props['shadow_h_offset'],
            $props['shadow_v_offset'],
            $props['shadow_blur'],
            $props['shadow_spread'],
            $props['shadow_color']
        );
    }
}

private function generate_ripple_animation_css( $buttons ) {
    // Check if any button has ripple effect enabled
    $ripple_enabled = false;
    foreach ( $buttons as $type => $states ) {
        foreach ( $states as $state => $props ) {
            if ( $props['ripple_effect'] ) {
                $ripple_enabled = true;
                break 2;
            }
        }
    }

    if ( ! $ripple_enabled ) {
        return '';
    }

    // Generate ripple animation CSS
    $css = '@keyframes mase-ripple {';
    $css .= '0% { transform: scale(0); opacity: 1; }';
    $css .= '100% { transform: scale(4); opacity: 0; }';
    $css .= '}';

    $css .= '.mase-ripple-effect {';
    $css .= 'position: absolute !important;';
    $css .= 'border-radius: 50% !important;';
    $css .= 'background: rgba(255, 255, 255, 0.6) !important;';
    $css .= 'animation: mase-ripple 600ms ease-out !important;';
    $css .= 'pointer-events: none !important;';
    $css .= '}';

    return $css;
}
```

#### Mobile Responsive Adjustments

```php
private function generate_button_mobile_css( $buttons ) {
    $css = '@media screen and (max-width: 782px) {';

    foreach ( $buttons as $type => $states ) {
        if ( ! isset( $states['normal'] ) ) {
            continue;
        }

        $props = $states['normal'];
        
        // Adjust font size for mobile
        $mobile_font_size = max( 14, $props['font_size'] );
        
        // Ensure minimum touch target size (44x44px)
        $mobile_padding_v = max( 10, $props['padding_vertical'] );
        $mobile_padding_h = max( 12, $props['padding_horizontal'] );

        $selectors = $this->get_button_selectors( $type );
        $selector_string = implode( ', ', $selectors );

        $css .= $selector_string . ' {';
        $css .= 'font-size: ' . $mobile_font_size . 'px !important;';
        $css .= 'padding: ' . $mobile_padding_v . 'px ' . $mobile_padding_h . 'px !important;';
        $css .= 'min-height: 44px !important;';
        $css .= 'min-width: 44px !important;';
        $css .= '}';
    }

    $css .= '}';
    return $css;
}

private function get_button_selectors( $type ) {
    $selector_map = array(
        'primary' => array('.button-primary', '.wp-core-ui .button-primary'),
        'secondary' => array('.button', '.wp-core-ui .button'),
        'danger' => array('.button.delete', '.submitdelete'),
        'success' => array('.button.button-large'),
        'ghost' => array('.button-link'),
        'tabs' => array('.nav-tab', '.nav-tab-active')
    );
    return $selector_map[ $type ] ?? array();
}
```


### 4. JavaScript Live Preview (mase-admin.js)

#### Button Styler Module

New module in `mase-admin.js`:

```javascript
buttonStyler: {
    /**
     * Initialize button styler
     */
    init: function() {
        var self = MASE;
        
        // Bind button type tab switching
        $('.mase-button-type-tab').on('click', function(e) {
            e.preventDefault();
            self.buttonStyler.switchButtonType($(this).data('button-type'));
        });
        
        // Bind button state tab switching
        $('.mase-button-state-tab').on('click', function(e) {
            e.preventDefault();
            self.buttonStyler.switchButtonState($(this).data('button-state'));
        });
        
        // Bind property controls to live preview
        $('.mase-button-control').on('change input', function() {
            self.buttonStyler.updatePreview();
        });
        
        // Bind reset buttons
        $('.mase-button-reset').on('click', function(e) {
            e.preventDefault();
            var type = $(this).data('button-type');
            self.buttonStyler.resetButtonType(type);
        });
        
        $('.mase-button-reset-all').on('click', function(e) {
            e.preventDefault();
            self.buttonStyler.resetAllButtons();
        });
        
        // Bind ripple effect to preview buttons
        self.buttonStyler.initRippleEffect();
    },
    
    /**
     * Switch active button type tab
     */
    switchButtonType: function(type) {
        $('.mase-button-type-tab').removeClass('active');
        $('.mase-button-type-tab[data-button-type="' + type + '"]').addClass('active');
        
        $('.mase-button-type-panel').removeClass('active');
        $('.mase-button-type-panel[data-button-type="' + type + '"]').addClass('active');
        
        this.updatePreview();
    },
    
    /**
     * Switch active button state tab
     */
    switchButtonState: function(state) {
        $('.mase-button-state-tab').removeClass('active');
        $('.mase-button-state-tab[data-button-state="' + state + '"]').addClass('active');
        
        $('.mase-button-state-panel').removeClass('active');
        $('.mase-button-state-panel[data-button-state="' + state + '"]').addClass('active');
        
        this.updatePreview();
    },
    
    /**
     * Update live preview
     */
    updatePreview: function() {
        var self = MASE;
        var activeType = $('.mase-button-type-tab.active').data('button-type');
        var activeState = $('.mase-button-state-tab.active').data('button-state');
        
        // Collect current values from form
        var props = self.buttonStyler.collectProperties(activeType, activeState);
        
        // Generate CSS for preview
        var css = self.buttonStyler.generatePreviewCSS(activeType, activeState, props);
        
        // Apply CSS to preview button
        var $previewButton = $('.mase-button-preview[data-button-type="' + activeType + '"]');
        $previewButton.attr('style', css);
        
        // Update preview in all states
        self.buttonStyler.updateAllStatesPreviews(activeType);
    },
    
    /**
     * Collect property values from form
     */
    collectProperties: function(type, state) {
        var prefix = 'mase_button_' + type + '_' + state + '_';
        
        return {
            bg_type: $('#' + prefix + 'bg_type').val(),
            bg_color: $('#' + prefix + 'bg_color').val(),
            gradient_type: $('#' + prefix + 'gradient_type').val(),
            gradient_angle: $('#' + prefix + 'gradient_angle').val(),
            gradient_colors: this.collectGradientColors(type, state),
            text_color: $('#' + prefix + 'text_color').val(),
            border_width: $('#' + prefix + 'border_width').val(),
            border_style: $('#' + prefix + 'border_style').val(),
            border_color: $('#' + prefix + 'border_color').val(),
            border_radius_mode: $('#' + prefix + 'border_radius_mode').val(),
            border_radius: $('#' + prefix + 'border_radius').val(),
            border_radius_tl: $('#' + prefix + 'border_radius_tl').val(),
            border_radius_tr: $('#' + prefix + 'border_radius_tr').val(),
            border_radius_bl: $('#' + prefix + 'border_radius_bl').val(),
            border_radius_br: $('#' + prefix + 'border_radius_br').val(),
            padding_horizontal: $('#' + prefix + 'padding_horizontal').val(),
            padding_vertical: $('#' + prefix + 'padding_vertical').val(),
            font_size: $('#' + prefix + 'font_size').val(),
            font_weight: $('#' + prefix + 'font_weight').val(),
            text_transform: $('#' + prefix + 'text_transform').val(),
            shadow_mode: $('#' + prefix + 'shadow_mode').val(),
            shadow_preset: $('#' + prefix + 'shadow_preset').val(),
            shadow_h_offset: $('#' + prefix + 'shadow_h_offset').val(),
            shadow_v_offset: $('#' + prefix + 'shadow_v_offset').val(),
            shadow_blur: $('#' + prefix + 'shadow_blur').val(),
            shadow_spread: $('#' + prefix + 'shadow_spread').val(),
            shadow_color: $('#' + prefix + 'shadow_color').val(),
            transition_duration: $('#' + prefix + 'transition_duration').val(),
            ripple_effect: $('#' + prefix + 'ripple_effect').is(':checked')
        };
    },
    
    /**
     * Generate CSS for preview
     */
    generatePreviewCSS: function(type, state, props) {
        var css = '';
        
        // Background
        if (props.bg_type === 'gradient') {
            css += this.generateGradientCSS(props);
        } else {
            css += 'background-color: ' + props.bg_color + ';';
        }
        
        // Text color
        css += 'color: ' + props.text_color + ';';
        
        // Border
        if (props.border_width > 0 && props.border_style !== 'none') {
            css += 'border: ' + props.border_width + 'px ' + props.border_style + ' ' + props.border_color + ';';
        } else {
            css += 'border: none;';
        }
        
        // Border radius
        if (props.border_radius_mode === 'individual') {
            css += 'border-radius: ' + props.border_radius_tl + 'px ' + props.border_radius_tr + 'px ' + 
                   props.border_radius_br + 'px ' + props.border_radius_bl + 'px;';
        } else {
            css += 'border-radius: ' + props.border_radius + 'px;';
        }
        
        // Padding
        css += 'padding: ' + props.padding_vertical + 'px ' + props.padding_horizontal + 'px;';
        
        // Typography
        css += 'font-size: ' + props.font_size + 'px;';
        css += 'font-weight: ' + props.font_weight + ';';
        css += 'text-transform: ' + props.text_transform + ';';
        
        // Shadow
        if (props.shadow_mode !== 'none') {
            var shadowValue = this.getShadowValue(props);
            if (shadowValue !== 'none') {
                css += 'box-shadow: ' + shadowValue + ';';
            }
        }
        
        // Transition
        if (props.transition_duration > 0) {
            css += 'transition: all ' + props.transition_duration + 'ms ease;';
        }
        
        return css;
    },
    
    /**
     * Generate gradient CSS
     */
    generateGradientCSS: function(props) {
        var colors = props.gradient_colors;
        var colorStops = colors.map(function(stop) {
            return stop.color + ' ' + stop.position + '%';
        }).join(', ');
        
        if (props.gradient_type === 'radial') {
            return 'background: radial-gradient(circle, ' + colorStops + ');';
        } else {
            return 'background: linear-gradient(' + props.gradient_angle + 'deg, ' + colorStops + ');';
        }
    },
    
    /**
     * Get shadow value
     */
    getShadowValue: function(props) {
        if (props.shadow_mode === 'preset') {
            var presets = {
                'none': 'none',
                'subtle': '0 1px 2px rgba(0,0,0,0.1)',
                'medium': '0 2px 4px rgba(0,0,0,0.15)',
                'strong': '0 4px 8px rgba(0,0,0,0.2)'
            };
            return presets[props.shadow_preset] || 'none';
        } else {
            return props.shadow_h_offset + 'px ' + props.shadow_v_offset + 'px ' + 
                   props.shadow_blur + 'px ' + props.shadow_spread + 'px ' + props.shadow_color;
        }
    },
    
    /**
     * Initialize ripple effect
     */
    initRippleEffect: function() {
        $(document).on('click', '.mase-button-preview', function(e) {
            var $button = $(this);
            var rippleEnabled = $button.data('ripple-enabled');
            
            if (!rippleEnabled) {
                return;
            }
            
            var $ripple = $('<span class="mase-ripple-effect"></span>');
            var btnOffset = $button.offset();
            var x = e.pageX - btnOffset.left;
            var y = e.pageY - btnOffset.top;
            
            $ripple.css({
                left: x + 'px',
                top: y + 'px',
                width: '10px',
                height: '10px'
            });
            
            $button.append($ripple);
            
            setTimeout(function() {
                $ripple.remove();
            }, 600);
        });
    },
    
    /**
     * Reset button type to defaults
     */
    resetButtonType: function(type) {
        if (!confirm('Reset all settings for ' + type + ' buttons to defaults?')) {
            return;
        }
        
        // Load defaults via AJAX
        $.ajax({
            url: MASE.config.ajaxUrl,
            type: 'POST',
            data: {
                action: 'mase_get_button_defaults',
                nonce: MASE.config.nonce,
                button_type: type
            },
            success: function(response) {
                if (response.success) {
                    // Populate form with defaults
                    MASE.buttonStyler.populateForm(type, response.data.defaults);
                    MASE.buttonStyler.updatePreview();
                    MASE.showNotice('success', 'Button settings reset to defaults');
                }
            }
        });
    },
    
    /**
     * Reset all buttons to defaults
     */
    resetAllButtons: function() {
        if (!confirm('Reset ALL button settings to defaults? This cannot be undone.')) {
            return;
        }
        
        $.ajax({
            url: MASE.config.ajaxUrl,
            type: 'POST',
            data: {
                action: 'mase_reset_all_buttons',
                nonce: MASE.config.nonce
            },
            success: function(response) {
                if (response.success) {
                    location.reload();
                }
            }
        });
    }
}
```


## Data Models

### Button Settings Schema

```typescript
interface ButtonSettings {
    primary: ButtonTypeSettings;
    secondary: ButtonTypeSettings;
    danger: ButtonTypeSettings;
    success: ButtonTypeSettings;
    ghost: ButtonTypeSettings;
    tabs: ButtonTypeSettings;
}

interface ButtonTypeSettings {
    normal: ButtonStateProperties;
    hover: ButtonStateProperties;
    active: ButtonStateProperties;
    focus: ButtonStateProperties;
    disabled: ButtonStateProperties;
}

interface ButtonStateProperties {
    // Background
    bg_type: 'solid' | 'gradient';
    bg_color: string;  // hex color
    gradient_type: 'linear' | 'radial';
    gradient_angle: number;  // 0-360
    gradient_colors: GradientStop[];
    
    // Text
    text_color: string;  // hex color
    
    // Border
    border_width: number;  // 0-5
    border_style: 'solid' | 'dashed' | 'dotted' | 'none';
    border_color: string;  // hex color
    border_radius_mode: 'uniform' | 'individual';
    border_radius: number;  // 0-25
    border_radius_tl: number;  // 0-25
    border_radius_tr: number;  // 0-25
    border_radius_bl: number;  // 0-25
    border_radius_br: number;  // 0-25
    
    // Spacing
    padding_horizontal: number;  // 5-30
    padding_vertical: number;  // 3-20
    
    // Typography
    font_size: number;  // 11-18
    font_weight: 300 | 400 | 500 | 600 | 700;
    text_transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    
    // Effects
    shadow_mode: 'preset' | 'custom' | 'none';
    shadow_preset: 'none' | 'subtle' | 'medium' | 'strong';
    shadow_h_offset: number;
    shadow_v_offset: number;
    shadow_blur: number;  // 0-50
    shadow_spread: number;
    shadow_color: string;  // rgba or hex
    transition_duration: number;  // 0-1000ms
    ripple_effect: boolean;
}

interface GradientStop {
    color: string;  // hex color
    position: number;  // 0-100
}
```

### CSS Selector Mapping

```php
private $button_selector_map = array(
    'primary' => array(
        '.button-primary',
        '.wp-core-ui .button-primary',
        'input[type="submit"].button-primary',
        'button.button-primary'
    ),
    'secondary' => array(
        '.button',
        '.wp-core-ui .button',
        'input[type="button"]',
        'input[type="submit"]',
        'button.button'
    ),
    'danger' => array(
        '.button.delete',
        '.submitdelete',
        'a.submitdelete',
        '.button-link-delete'
    ),
    'success' => array(
        '.button.button-large',
        '.button-hero',
        '.button.updated-message'
    ),
    'ghost' => array(
        '.button-link',
        '.button-link-delete',
        'button.button-link'
    ),
    'tabs' => array(
        '.nav-tab',
        '.nav-tab-active',
        'a.nav-tab',
        'h2.nav-tab-wrapper a'
    )
);
```

## Error Handling

### Validation Errors

```php
// Example validation error structure
array(
    'universal_buttons' => array(
        'primary_normal_contrast' => 'Button primary normal state has insufficient contrast ratio: 3.2 (minimum 4.5:1 required)',
        'secondary_hover_bg_color' => 'Invalid hex color format',
        'danger_active_border_width' => 'Border width must be between 0 and 5'
    )
)
```

### CSS Generation Errors

```php
try {
    $css = $this->generate_button_styles( $settings );
} catch ( Exception $e ) {
    error_log( sprintf( 'MASE: Button styles generation failed: %s', $e->getMessage() ) );
    // Return cached CSS or empty string as graceful degradation
    return $this->get_cached_button_css();
}
```

### JavaScript Errors

```javascript
try {
    MASE.buttonStyler.updatePreview();
} catch (error) {
    console.error('MASE: Button preview update failed:', error);
    MASE.showNotice('error', 'Failed to update button preview');
}
```

## Testing Strategy

### Unit Tests

1. **Settings Validation Tests** (`tests/unit/test-button-validation.php`)
   - Test each validation method with valid/invalid inputs
   - Test contrast ratio calculations
   - Test gradient color validation
   - Test numeric range validation

2. **CSS Generation Tests** (`tests/unit/test-button-css-generation.php`)
   - Test CSS output for each button type
   - Test CSS output for each button state
   - Test gradient CSS generation
   - Test shadow CSS generation
   - Test mobile responsive CSS

3. **JavaScript Tests** (`tests/unit/test-button-styler.test.js`)
   - Test property collection
   - Test CSS generation
   - Test live preview updates
   - Test ripple effect

### Integration Tests

1. **Settings Save/Load** (`tests/integration/test-button-settings-flow.php`)
   - Test complete save flow
   - Test settings retrieval
   - Test defaults merging

2. **Live Preview** (`tests/integration/test-button-live-preview.html`)
   - Test real-time updates
   - Test state switching
   - Test type switching

3. **AJAX Endpoints** (`tests/integration/test-button-ajax.php`)
   - Test reset button type endpoint
   - Test reset all buttons endpoint
   - Test get defaults endpoint

### Accessibility Tests

1. **Contrast Ratio Tests** (`tests/accessibility/test-button-contrast.php`)
   - Test WCAG AA compliance
   - Test contrast calculation accuracy

2. **Keyboard Navigation** (`tests/accessibility/test-button-keyboard.html`)
   - Test focus indicators
   - Test keyboard accessibility

3. **Screen Reader** (`tests/accessibility/test-button-screen-reader.html`)
   - Test ARIA labels
   - Test button state announcements

### Browser Compatibility Tests

1. **Cross-Browser CSS** (`tests/browser-compatibility/test-button-styles.js`)
   - Test in Chrome, Firefox, Safari, Edge
   - Test gradient rendering
   - Test shadow rendering
   - Test transitions

2. **Mobile Responsive** (`tests/browser-compatibility/test-button-mobile.js`)
   - Test touch targets
   - Test mobile font sizes
   - Test mobile padding


## Performance Considerations

### CSS Generation Optimization

1. **String Concatenation**: Use string concatenation instead of array joins for better performance
2. **Caching**: Cache generated CSS with mode-specific keys (light/dark)
3. **Lazy Loading**: Only generate CSS for enabled button types
4. **Minification**: Remove unnecessary whitespace in production

```php
// Performance target: <100ms for complete button CSS generation
private function generate_button_styles( $settings ) {
    $start_time = microtime( true );
    
    // ... CSS generation ...
    
    $duration = ( microtime( true ) - $start_time ) * 1000;
    if ( $duration > 100 ) {
        error_log( sprintf( 'MASE: Button CSS generation exceeded threshold: %.2fms', $duration ) );
    }
    
    return $css;
}
```

### JavaScript Performance

1. **Debouncing**: Debounce live preview updates (300ms)
2. **Event Delegation**: Use event delegation for dynamic elements
3. **Throttling**: Throttle scroll/resize events if needed

```javascript
// Debounced preview update
var debouncedUpdate = _.debounce(function() {
    MASE.buttonStyler.updatePreview();
}, 300);

$('.mase-button-control').on('change input', debouncedUpdate);
```

### Database Optimization

1. **Single Option**: Store all button settings in one option to minimize queries
2. **Autoload**: Set autoload to 'no' for button settings if they're large
3. **Transients**: Use transients for computed values (e.g., contrast ratios)

## Security Considerations

### Input Sanitization

1. **Colors**: Use `sanitize_hex_color()` for hex colors, validate rgba format
2. **Numbers**: Use `absint()` for positive integers, `intval()` for signed integers
3. **Enums**: Validate against whitelist of allowed values
4. **URLs**: Use `esc_url_raw()` for gradient image URLs (if supported)

### Output Escaping

1. **CSS**: Escape all user-provided values in CSS output
2. **HTML**: Use `esc_attr()` for HTML attributes, `esc_html()` for text content
3. **JavaScript**: Use `wp_json_encode()` for data passed to JavaScript

### Nonce Verification

```php
// AJAX endpoint example
public function ajax_reset_button_type() {
    check_ajax_referer( 'mase_nonce', 'nonce' );
    
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( array( 'message' => 'Insufficient permissions' ) );
    }
    
    // ... process request ...
}
```

## Migration Strategy

### Backward Compatibility

1. **Existing Settings**: Don't break existing MASE installations
2. **Default Values**: Provide sensible defaults that match WordPress core styles
3. **Gradual Adoption**: Allow users to enable button styling per type

### Migration Path

```php
public function migrate_to_button_system() {
    $current_version = get_option( 'mase_version', '1.0.0' );
    
    if ( version_compare( $current_version, '1.3.0', '<' ) ) {
        // Add button defaults to existing settings
        $settings = get_option( 'mase_settings', array() );
        
        if ( ! isset( $settings['universal_buttons'] ) ) {
            $settings['universal_buttons'] = $this->get_button_defaults();
            update_option( 'mase_settings', $settings );
        }
        
        update_option( 'mase_version', '1.3.0' );
    }
}
```

## Deployment Checklist

### Pre-Deployment

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Accessibility tests passing (WCAG AA)
- [ ] Browser compatibility verified (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive tests passing
- [ ] Performance benchmarks met (<100ms CSS generation)
- [ ] Security audit completed
- [ ] Code review completed
- [ ] Documentation updated

### Deployment Steps

1. **Backup**: Create database backup before deployment
2. **Migration**: Run migration script to add button defaults
3. **Cache Clear**: Clear all MASE caches
4. **Verification**: Verify button styles apply correctly
5. **Rollback Plan**: Have rollback procedure ready

### Post-Deployment

- [ ] Monitor error logs for issues
- [ ] Verify button styles in production
- [ ] Test live preview functionality
- [ ] Verify accessibility compliance
- [ ] Monitor performance metrics
- [ ] Collect user feedback

## Future Enhancements

### Phase 2 Features

1. **Button Presets**: Pre-configured button style sets (Material, Flat, Neumorphic)
2. **Animation Library**: Additional button animations (pulse, bounce, shake)
3. **Icon Support**: Add icon controls for buttons with icons
4. **Custom Button Types**: Allow users to define custom button types
5. **Import/Export**: Export button styles as JSON for sharing
6. **A/B Testing**: Built-in A/B testing for button styles
7. **Analytics Integration**: Track button click rates by style

### Technical Debt

1. **Refactor CSS Generation**: Consider using CSS-in-JS library for better maintainability
2. **TypeScript Migration**: Migrate JavaScript to TypeScript for better type safety
3. **Component Library**: Extract button styler into reusable component
4. **API Endpoints**: Create REST API endpoints for button management

## References

### WordPress Standards

- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
- [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)

### Accessibility

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### CSS

- [CSS Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient)
- [CSS Box Shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

### Performance

- [PHP Performance Best Practices](https://www.php.net/manual/en/features.performance.php)
- [JavaScript Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [WordPress Performance](https://developer.wordpress.org/advanced-administration/performance/)
