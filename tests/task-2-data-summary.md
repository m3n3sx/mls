# Task 2: Palette and Template Data Summary

## Color Palettes (10 Total)

### 1. Professional Blue
- **ID**: `professional-blue`
- **Colors**: Primary #4A90E2, Secondary #50C9C3, Accent #7B68EE
- **Admin Bar**: #4A90E2 / #ffffff
- **Admin Menu**: #1E40AF / #ffffff (hover: #3B82F6 / #E0E7FF)

### 2. Creative Purple
- **ID**: `creative-purple`
- **Colors**: Primary #8B5CF6, Secondary #EC4899, Accent #F59E0B
- **Admin Bar**: #8B5CF6 / #ffffff
- **Admin Menu**: #7C3AED / #ffffff (hover: #8B5CF6 / #EDE9FE)

### 3. Energetic Green
- **ID**: `energetic-green`
- **Colors**: Primary #10B981, Secondary #34D399, Accent #FBBF24
- **Admin Bar**: #10B981 / #ffffff
- **Admin Menu**: #059669 / #ffffff (hover: #10B981 / #D1FAE5)

### 4. Sunset
- **ID**: `sunset`
- **Colors**: Primary #F97316, Secondary #FB923C, Accent #FBBF24
- **Admin Bar**: #F97316 / #ffffff
- **Admin Menu**: #EA580C / #ffffff (hover: #F97316 / #FED7AA)

### 5. Dark Elegance
- **ID**: `dark-elegance`
- **Colors**: Primary #1F2937, Secondary #374151, Accent #60A5FA
- **Admin Bar**: #1F2937 / #F9FAFB
- **Admin Menu**: #111827 / #F9FAFB (hover: #374151 / #60A5FA)

### 6. Ocean Breeze
- **ID**: `ocean-breeze`
- **Colors**: Primary #0EA5E9, Secondary #06B6D4, Accent #22D3EE
- **Admin Bar**: #0EA5E9 / #ffffff
- **Admin Menu**: #0284C7 / #ffffff (hover: #0EA5E9 / #E0F2FE)

### 7. Rose Garden
- **ID**: `rose-garden`
- **Colors**: Primary #E11D48, Secondary #F43F5E, Accent #FB7185
- **Admin Bar**: #E11D48 / #ffffff
- **Admin Menu**: #BE123C / #ffffff (hover: #E11D48 / #FFE4E6)

### 8. Forest Calm
- **ID**: `forest-calm`
- **Colors**: Primary #16A34A, Secondary #22C55E, Accent #84CC16
- **Admin Bar**: #16A34A / #ffffff
- **Admin Menu**: #15803D / #ffffff (hover: #16A34A / #DCFCE7)

### 9. Midnight Blue
- **ID**: `midnight-blue`
- **Colors**: Primary #1E3A8A, Secondary #3B82F6, Accent #60A5FA
- **Admin Bar**: #1E3A8A / #ffffff
- **Admin Menu**: #1E40AF / #ffffff (hover: #3B82F6 / #DBEAFE)

### 10. Golden Hour
- **ID**: `golden-hour`
- **Colors**: Primary #D97706, Secondary #F59E0B, Accent #FBBF24
- **Admin Bar**: #D97706 / #ffffff
- **Admin Menu**: #B45309 / #ffffff (hover: #D97706 / #FEF3C7)

---

## Templates (11 Total)

### 1. WordPress Default
- **ID**: `default`
- **Description**: Classic WordPress admin styling with no modifications
- **Palette**: professional-blue
- **Effects**: No glassmorphism, no floating, no shadows

### 2. Modern Minimal
- **ID**: `modern-minimal`
- **Description**: Clean and minimal design with subtle effects
- **Palette**: professional-blue
- **Effects**: Subtle shadows, 4px border radius

### 3. Glassmorphic
- **ID**: `glassmorphic`
- **Description**: Modern glass effect with blur and transparency
- **Palette**: professional-blue
- **Effects**: Glassmorphism enabled, floating admin bar, elevated shadows

### 4. Dark Mode
- **ID**: `dark-mode`
- **Description**: Elegant dark theme for reduced eye strain
- **Palette**: dark-elegance
- **Effects**: Subtle shadows, no glassmorphism

### 5. Creative Studio
- **ID**: `creative-studio`
- **Description**: Vibrant and creative design for artistic workflows
- **Palette**: creative-purple
- **Effects**: Floating admin bar, elevated shadows, 8px border radius

### 6. Corporate Pro
- **ID**: `corporate-pro`
- **Description**: Professional corporate design with clean lines
- **Palette**: midnight-blue
- **Effects**: Subtle shadows on admin bar only, no border radius

### 7. Nature Inspired
- **ID**: `nature-inspired`
- **Description**: Calming green tones inspired by nature
- **Palette**: forest-calm
- **Effects**: Subtle shadows, 6px/4px border radius

### 8. Sunset Vibes
- **ID**: `sunset-vibes`
- **Description**: Warm sunset colors for evening work sessions
- **Palette**: sunset
- **Effects**: Floating admin bar, elevated shadows, 10px border radius

### 9. Ocean Depth
- **ID**: `ocean-depth`
- **Description**: Cool ocean blues for a refreshing workspace
- **Palette**: ocean-breeze
- **Effects**: Glassmorphism on admin bar, subtle shadows

### 10. Elegant Rose
- **ID**: `elegant-rose`
- **Description**: Sophisticated rose tones for a refined look
- **Palette**: rose-garden
- **Effects**: Subtle shadows, 6px/4px border radius

### 11. Golden Luxury
- **ID**: `golden-luxury`
- **Description**: Luxurious golden tones for premium feel
- **Palette**: golden-hour
- **Effects**: Floating admin bar, elevated shadows, 8px border radius

---

## Data Structure Examples

### Palette Structure
```php
array(
    'id'         => 'professional-blue',
    'name'       => 'Professional Blue',
    'colors'     => array(
        'primary'        => '#4A90E2',
        'secondary'      => '#50C9C3',
        'accent'         => '#7B68EE',
        'background'     => '#F8FAFC',
        'text'           => '#1E293B',
        'text_secondary' => '#64748B',
    ),
    'admin_bar'  => array(
        'bg_color'   => '#4A90E2',
        'text_color' => '#ffffff',
    ),
    'admin_menu' => array(
        'bg_color'         => '#1E40AF',
        'text_color'       => '#ffffff',
        'hover_bg_color'   => '#3B82F6',
        'hover_text_color' => '#E0E7FF',
    ),
    'is_custom'  => false,
)
```

### Template Structure
```php
array(
    'id'          => 'modern-minimal',
    'name'        => 'Modern Minimal',
    'description' => 'Clean and minimal design with subtle effects',
    'thumbnail'   => '',
    'is_custom'   => false,
    'settings'    => array(
        'palettes' => array( 'current' => 'professional-blue' ),
        'typography' => array(
            'admin_bar' => array(
                'font_size'   => 14,
                'font_weight' => 400,
                'line_height' => 1.5,
            ),
            'admin_menu' => array(
                'font_size'   => 13,
                'font_weight' => 400,
                'line_height' => 1.5,
            ),
        ),
        'visual_effects' => array(
            'admin_bar' => array(
                'glassmorphism' => false,
                'floating'      => false,
                'border_radius' => 4,
                'shadow'        => 'subtle',
            ),
            'admin_menu' => array(
                'glassmorphism' => false,
                'floating'      => false,
                'border_radius' => 4,
                'shadow'        => 'subtle',
            ),
        ),
    ),
)
```

## Usage Examples

### Get a Palette
```php
$settings = new MASE_Settings();
$palette = $settings->get_palette( 'professional-blue' );
// Returns palette array or false if not found
```

### Get All Palettes
```php
$all_palettes = $settings->get_all_palettes();
// Returns array of all palettes (default + custom)
```

### Validate Palette ID
```php
$is_valid = $settings->validate_palette_id( 'professional-blue' );
// Returns true if valid, false otherwise
```

### Get a Template
```php
$template = $settings->get_template( 'modern-minimal' );
// Returns template array or false if not found
```

### Get All Templates
```php
$all_templates = $settings->get_all_templates();
// Returns array of all templates (default + custom)
```

### Validate Template ID
```php
$is_valid = $settings->validate_template_id( 'modern-minimal' );
// Returns true if valid, false otherwise
```

### Apply a Palette
```php
$success = $settings->apply_palette( 'creative-purple' );
// Returns true on success, false on failure
```

### Apply a Template
```php
$success = $settings->apply_template( 'glassmorphic' );
// Returns true on success, false on failure
```
