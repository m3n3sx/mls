# Modern Admin Styler Enterprise (MASE) v2.0.0 - User Guide

## Table of Contents

1. [Introduction](#introduction)
2. [What's New in v2.0](#whats-new-in-v20)
3. [Getting Started](#getting-started)
4. [Dark/Light Mode Toggle](#darklight-mode-toggle)
5. [Color Palettes](#color-palettes)
6. [Templates](#templates)
7. [Admin Bar Customization](#admin-bar-customization)
8. [Menu Customization](#menu-customization)
9. [Typography Settings](#typography-settings)
10. [Visual Effects](#visual-effects)
11. [Advanced Features](#advanced-features)
12. [Keyboard Shortcuts](#keyboard-shortcuts)
13. [Import/Export](#import-export)
14. [Backup & Restore](#backup-restore)
15. [Troubleshooting](#troubleshooting-guide)

---

## Introduction

Modern Admin Styler Enterprise (MASE) is a comprehensive WordPress plugin that transforms your admin interface with modern design patterns, professional color schemes, and powerful customization options. Version 2.0.0 introduces a completely rebuilt modern architecture with improved performance, enhanced features, and a foundation for future AI-powered capabilities.

### Key Features

- **Dark/Light Mode Toggle** - Seamless switching with system preference detection
- **10 Professional Color Palettes** - One-click color schemes with accessibility validation
- **11 Complete Templates** - Pre-configured designs covering all settings
- **Real-Time Preview** - Instant visual feedback with sub-50ms updates
- **Smart Color System** - Automatic contrast checking and accessible color suggestions
- **Advanced Typography** - Google Fonts with intelligent loading and caching
- **Smooth Animations** - 60fps animations with reduced motion support
- **Visual Effects** - Glassmorphism, floating elements, shadows, and micro-interactions
- **Mobile Optimized** - Responsive design with touch-friendly controls
- **Accessibility** - WCAG 2.1 AA/AAA compliant with full keyboard navigation
- **Undo/Redo** - 50-state history for safe experimentation
- **Import/Export** - Share configurations across sites
- **Backup/Restore** - Automatic backups before major changes
- **Performance Optimized** - Code splitting and lazy loading for fast load times

## What's New in v2.0

Version 2.0.0 represents a complete architectural overhaul of MASE, bringing modern JavaScript practices, improved performance, and enhanced user experience.

### Major Improvements

#### 🚀 Performance Enhancements
- **Faster Load Times**: Initial load reduced by 40% through code splitting
- **Instant Preview Updates**: CSS generation optimized to < 50ms
- **Smart Caching**: Fonts and settings cached for faster subsequent loads
- **Lazy Loading**: Feature modules load on-demand when needed

#### 🎨 Enhanced Color System
- **Accessibility Validation**: Automatic WCAG 2.1 contrast ratio checking
- **Smart Suggestions**: Get accessible color alternatives automatically
- **Color Palette Generation**: Create complementary, analogous, and triadic palettes
- **Real-Time Feedback**: See accessibility warnings as you adjust colors

#### ✍️ Advanced Typography
- **Google Fonts Integration**: Seamless loading with 7-day caching
- **Fluid Typography**: Responsive text scaling based on viewport
- **Font Loading Optimization**: Asynchronous loading with fallback fonts
- **FOUT Prevention**: Smooth font transitions without layout shifts

#### ✨ Smooth Animations
- **60fps Performance**: GPU-accelerated animations for buttery smooth motion
- **Reduced Motion Support**: Respects user accessibility preferences
- **Easing Library**: Professional easing functions for natural motion
- **Animation Queuing**: Coordinated animations without conflicts

#### 🔄 Undo/Redo System
- **50-State History**: Experiment freely with extensive undo capability
- **Keyboard Shortcuts**: Ctrl+Z to undo, Ctrl+Y to redo
- **Visual Feedback**: Clear indicators of undo/redo availability
- **Smart History**: Automatically manages history size for performance

#### 🛡️ Improved Reliability
- **Error Recovery**: Automatic retry with exponential backoff
- **Request Queuing**: Prevents concurrent save conflicts
- **Validation**: Client and server-side validation for data integrity
- **Graceful Degradation**: Fallbacks ensure functionality even if features fail

### Under the Hood

For developers and technically curious users:

- **Modern Architecture**: Modular ES6+ JavaScript with clear separation of concerns
- **State Management**: Centralized state with Zustand for predictable updates
- **Event-Driven**: Decoupled modules communicate via Event Bus
- **REST API**: Modern REST endpoints replace legacy AJAX
- **Build System**: Vite for fast development and optimized production builds
- **Testing**: Comprehensive unit, integration, and E2E test coverage
- **Documentation**: Complete architecture and developer documentation

### Backwards Compatibility

Version 2.0.0 maintains full backwards compatibility:
- All existing settings are preserved during upgrade
- No changes to user interface or workflows
- Custom CSS and JavaScript continue to work
- All WordPress hooks and filters maintained
- Existing templates and palettes unchanged

### Migration Notes

The upgrade to v2.0.0 is automatic and seamless:
1. Plugin updates via WordPress admin
2. Settings automatically migrated to new format
3. Automatic backup created before migration
4. No manual intervention required
5. Rollback available if needed (see Advanced → Feature Flags)

---

## Getting Started

### Installation

1. Upload the plugin folder to `/wp-content/plugins/`
2. Activate through the 'Plugins' menu in WordPress
3. Navigate to **Modern Admin Styler** in the admin menu

### First Steps

1. **Choose a Palette**: Start by selecting one of the 10 color palettes in the General tab
2. **Apply a Template**: Or apply a complete template for instant transformation
3. **Enable Live Preview**: Toggle live preview to see changes in real-time
4. **Customize**: Fine-tune colors, typography, and effects to match your brand
5. **Save**: Click "Save Settings" to apply your changes permanently

### Interface Overview

The settings page is organized into 8 tabs:

- **General**: Color palettes, templates, and master controls
- **Admin Bar**: Customize the top admin bar
- **Menu**: Customize the left sidebar menu
- **Content**: Background, spacing, and layout
- **Typography**: Font controls for all areas
- **Effects**: Animations and visual effects
- **Templates**: Full template gallery
- **Advanced**: Custom CSS/JS, auto palette switching, backups, dark mode settings

---

## Dark/Light Mode Toggle

MASE includes a powerful dark/light mode toggle that allows you to seamlessly switch between light and dark color schemes. This feature reduces eye strain, improves readability in different lighting conditions, and provides a modern admin experience.

### Quick Start

1. **Look for the FAB**: A circular button appears in the bottom-right corner of your admin interface
2. **Click to Toggle**: Click the button to switch between light and dark modes
3. **Use Keyboard Shortcut**: Press `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (Mac) to toggle
4. **Your Preference is Saved**: The mode persists across page loads and sessions

### Features

- **Floating Action Button (FAB)**: Always-accessible toggle in bottom-right corner
- **Keyboard Shortcut**: Quick toggle with Ctrl/Cmd+Shift+D
- **System Preference Detection**: Automatically matches your OS dark mode setting
- **Persistent Preferences**: Saved across sessions and devices
- **Smooth Transitions**: Professional 0.3-second color transitions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance**: Sub-50ms toggle time for instant response

### Dark Mode Palettes

MASE includes three professionally designed dark mode palettes:

1. **Dark Elegance** (Default): Comfortable charcoal with light blue accents
2. **Midnight Blue**: Professional navy with sky blue accents
3. **Charcoal**: Maximum contrast with purple accents (OLED-friendly)

All dark palettes meet WCAG AAA contrast standards (7:1+) for optimal readability.

### Configuring Dark Mode

Navigate to **Modern Admin Styler** → **Advanced** tab → **Dark Mode Settings**:

- **Enable/Disable**: Turn the dark mode feature on or off
- **Light Palette**: Choose the palette for light mode
- **Dark Palette**: Choose the palette for dark mode
- **Transition Duration**: Adjust animation speed (100-1000ms)
- **Keyboard Shortcut**: Enable or disable Ctrl/Cmd+Shift+D
- **Respect System Preference**: Auto-match OS dark mode setting
- **FAB Position**: Adjust button placement

### Keyboard Shortcuts

- **Toggle Dark Mode**: `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (Mac)
- **Tab to FAB**: Press Tab repeatedly to focus the FAB
- **Activate FAB**: Press Enter or Space when FAB is focused

### System Preference Detection

When enabled, MASE automatically detects your operating system's dark mode preference:

- **First Load**: Checks OS preference and applies matching mode
- **Auto-Update**: Updates when you change OS dark mode (if no manual preference set)
- **Manual Override**: Your manual toggle takes precedence over OS setting

To reset to system preference, clear your manual preference in browser settings or reset MASE settings.

### Troubleshooting

**FAB Not Visible**:
- Check if dark mode is enabled in Advanced → Dark Mode Settings
- Adjust FAB position if hidden behind other elements
- Check browser console for JavaScript errors

**Colors Not Changing**:
- Verify a dark palette is selected in settings
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check for CSS conflicts with other plugins

**Preference Not Saving**:
- Ensure browser allows localStorage
- Check AJAX save completes successfully (Network tab in DevTools)
- Verify you have admin permissions

For detailed troubleshooting, see the [Dark Mode Troubleshooting Guide](./DARK-MODE-TROUBLESHOOTING.md).

### Additional Resources

- [Dark Mode User Guide](./DARK-MODE-USER-GUIDE.md) - Comprehensive guide
- [Dark Mode Developer Guide](./DARK-MODE-DEVELOPER-GUIDE.md) - For developers
- [Dark Mode Troubleshooting](./DARK-MODE-TROUBLESHOOTING.md) - Detailed troubleshooting

---

## Color Palettes

MASE includes 10 professionally designed color palettes, each optimized for different use cases.

### Available Palettes

#### 1. Professional Blue
- **Primary**: #4A90E2 (Bright Blue)
- **Secondary**: #50C9C3 (Teal)
- **Accent**: #7B68EE (Medium Slate Blue)
- **Background**: #F8FAFC (Light Gray)
- **Use Case**: Corporate websites, business dashboards, professional services
- **Best For**: Clean, trustworthy, professional appearance

#### 2. Energetic Green
- **Primary**: #10B981 (Emerald Green)
- **Secondary**: #34D399 (Light Green)
- **Accent**: #F59E0B (Amber)
- **Background**: #F0FDF4 (Mint Cream)
- **Use Case**: Environmental sites, health & wellness, growth-focused businesses
- **Best For**: Fresh, energetic, growth-oriented feel

#### 3. Creative Purple
- **Primary**: #8B5CF6 (Violet)
- **Secondary**: #A78BFA (Light Purple)
- **Accent**: #EC4899 (Pink)
- **Background**: #FAF5FF (Lavender Blush)
- **Use Case**: Creative agencies, design studios, artistic portfolios
- **Best For**: Creative, innovative, artistic expression

#### 4. Warm Sunset
- **Primary**: #F97316 (Orange)
- **Secondary**: #FB923C (Light Orange)
- **Accent**: #EF4444 (Red)
- **Background**: #FFF7ED (Peach Puff)
- **Use Case**: Food & beverage, entertainment, lifestyle blogs
- **Best For**: Warm, inviting, energetic atmosphere

#### 5. Ocean Blue
- **Primary**: #0EA5E9 (Sky Blue)
- **Secondary**: #06B6D4 (Cyan)
- **Accent**: #3B82F6 (Blue)
- **Background**: #F0F9FF (Alice Blue)
- **Use Case**: Travel, maritime, technology, SaaS products
- **Best For**: Calm, trustworthy, tech-forward feel

#### 6. Forest Green
- **Primary**: #059669 (Green)
- **Secondary**: #10B981 (Emerald)
- **Accent**: #84CC16 (Lime)
- **Background**: #F0FDF4 (Honeydew)
- **Use Case**: Environmental, outdoor, sustainability-focused sites
- **Best For**: Natural, eco-friendly, organic feel

#### 7. Royal Purple
- **Primary**: #7C3AED (Purple)
- **Secondary**: #A78BFA (Light Purple)
- **Accent**: #C084FC (Orchid)
- **Background**: #FAF5FF (Lavender)
- **Use Case**: Luxury brands, premium services, exclusive content
- **Best For**: Elegant, sophisticated, premium feel

#### 8. Monochrome
- **Primary**: #374151 (Dark Gray)
- **Secondary**: #6B7280 (Gray)
- **Accent**: #9CA3AF (Light Gray)
- **Background**: #F9FAFB (Off White)
- **Use Case**: Minimalist sites, photography, content-focused blogs
- **Best For**: Clean, minimal, distraction-free interface

#### 9. Dark Elegance
- **Primary**: #1F2937 (Charcoal)
- **Secondary**: #374151 (Dark Gray)
- **Accent**: #60A5FA (Light Blue)
- **Background**: #111827 (Almost Black)
- **Use Case**: Dark mode enthusiasts, gaming, tech sites
- **Best For**: Modern, sleek, eye-friendly dark interface

#### 10. Vibrant Coral
- **Primary**: #F43F5E (Rose)
- **Secondary**: #FB7185 (Pink)
- **Accent**: #FBBF24 (Yellow)
- **Background**: #FFF1F2 (Rose White)
- **Use Case**: Fashion, beauty, lifestyle, creative content
- **Best For**: Bold, vibrant, attention-grabbing design

### How to Apply a Palette

1. Navigate to the **General** tab
2. Browse the palette grid
3. Click **Preview** to see the palette without saving
4. Click **Apply** to activate the palette
5. The active palette will show an "Active" badge
6. Click **Save Settings** to make changes permanent

### Creating Custom Palettes

1. Adjust colors in the Admin Bar and Menu tabs
2. Click **Save as Custom Palette**
3. Enter a name for your palette
4. Your custom palette appears in the palette grid
5. Custom palettes can be edited or deleted

---

## Templates

MASE includes 11 complete templates that configure all settings for instant transformation.

### Available Templates

#### 1. Default
- **Description**: WordPress default styling with minimal customization
- **Palette**: Professional Blue
- **Effects**: None
- **Best For**: Users who want WordPress defaults with slight improvements

#### 2. Modern Minimal
- **Description**: Clean, minimal design with subtle effects
- **Palette**: Monochrome
- **Effects**: Subtle shadows, minimal animations
- **Best For**: Content-focused sites, blogs, documentation

#### 3. Corporate Professional
- **Description**: Professional business appearance with trust-building colors
- **Palette**: Professional Blue
- **Effects**: Elevated shadows, smooth animations
- **Best For**: Corporate websites, business dashboards, B2B services

#### 4. Creative Studio
- **Description**: Bold, creative design with vibrant colors and effects
- **Palette**: Creative Purple
- **Effects**: Glassmorphism, floating elements, animations
- **Best For**: Design agencies, creative portfolios, artistic sites

#### 5. Dark Mode Pro
- **Description**: Sleek dark interface with blue accents
- **Palette**: Dark Elegance
- **Effects**: Subtle glow, smooth transitions
- **Best For**: Dark mode enthusiasts, gaming, tech sites

#### 6. Eco Friendly
- **Description**: Natural, organic design with green tones
- **Palette**: Forest Green
- **Effects**: Soft shadows, gentle animations
- **Best For**: Environmental sites, sustainability, organic products

#### 7. Luxury Premium
- **Description**: Elegant, sophisticated design with premium feel
- **Palette**: Royal Purple
- **Effects**: Elevated shadows, smooth animations, glassmorphism
- **Best For**: Luxury brands, premium services, exclusive content

#### 8. Energetic Startup
- **Description**: Fresh, energetic design for growth-focused businesses
- **Palette**: Energetic Green
- **Effects**: Floating elements, dynamic animations
- **Best For**: Startups, SaaS products, growth-focused businesses

#### 9. Warm & Welcoming
- **Description**: Inviting design with warm sunset colors
- **Palette**: Warm Sunset
- **Effects**: Soft shadows, gentle animations
- **Best For**: Food & beverage, hospitality, lifestyle blogs

#### 10. Tech Forward
- **Description**: Modern, tech-focused design with blue tones
- **Palette**: Ocean Blue
- **Effects**: Glassmorphism, floating elements, smooth animations
- **Best For**: Technology companies, SaaS products, startups

#### 11. Bold & Vibrant
- **Description**: Eye-catching design with coral and pink tones
- **Palette**: Vibrant Coral
- **Effects**: Strong shadows, dynamic animations
- **Best For**: Fashion, beauty, lifestyle, creative content

### How to Apply a Template

1. Navigate to the **Templates** tab (or view quick preview in General tab)
2. Browse template cards with thumbnails and descriptions
3. Click **Apply Template** on your chosen template
4. Confirm the action (this will overwrite current settings)
5. The template is applied instantly
6. Click **Save Settings** to make changes permanent

### Creating Custom Templates

1. Configure all settings to your liking
2. Click **Save as Custom Template**
3. Enter a name and description
4. Your custom template appears in the gallery
5. Custom templates can be edited or deleted

---

## Admin Bar Customization

The admin bar is the top horizontal bar in WordPress admin.

### Colors

- **Background Color**: Main background color of the admin bar
- **Text Color**: Color of text and icons
- **Hover Color**: Color when hovering over items

### Typography

- **Font Size**: 10-24px (default: 13px)
- **Font Weight**: 300-700 (default: 400)
- **Line Height**: 1.0-2.0 (default: 1.5)

### Visual Effects

#### Glassmorphism
- Creates a frosted glass effect with backdrop blur
- **Blur Intensity**: 0-50px (default: 20px)
- Works best with semi-transparent backgrounds
- May not work in older Firefox versions (fallback provided)

#### Floating Effect
- Adds top margin to create floating appearance
- **Floating Margin**: 0-20px (default: 8px)
- Combines well with border radius and shadows

#### Border Radius
- Rounds the corners of the admin bar
- **Range**: 0-20px (default: 0px)
- Recommended: 8-12px for modern look

#### Shadow Presets
- **None**: No shadow
- **Flat**: Minimal shadow for subtle depth
- **Subtle**: Light shadow for gentle elevation
- **Elevated**: Medium shadow for clear separation
- **Floating**: Strong shadow for floating effect

---

## Menu Customization

The admin menu is the left sidebar navigation. MASE provides comprehensive customization options including spacing optimization, gradient backgrounds, Google Fonts, submenu styling, and logo placement.

### Colors

#### Basic Colors
- **Background Color**: Main background of the menu
- **Text Color**: Color of menu item text
- **Hover Background**: Background when hovering over items
- **Hover Text**: Text color when hovering

#### Background Type
Choose between solid color or gradient backgrounds:

**Solid Background**
- Single color background
- Simple and performant
- Best for traditional designs

**Gradient Background**
- Multiple color stops with smooth transitions
- Three gradient types available:
  - **Linear**: Straight line gradient with adjustable angle (0-360°)
  - **Radial**: Circular gradient from center outward
  - **Conic**: Circular gradient rotating around center
- Add multiple color stops for complex gradients
- Angle control for linear gradients (0° = top to bottom, 90° = left to right)
- Live preview updates as you adjust colors and angles

**How to Use Gradients**:
1. Set Background Type to "Gradient"
2. Choose gradient type (Linear, Radial, or Conic)
3. Add color stops (minimum 2, click + to add more)
4. For linear gradients, adjust angle slider
5. Preview updates in real-time
6. Save when satisfied

#### Icon Colors
Control menu icon colors independently:

- **Auto Mode** (default): Icons automatically match text color
- **Custom Mode**: Set independent icon color
  - Useful for creating visual hierarchy
  - Icons can contrast with text for better visibility

### Dimensions

#### Width Controls
- **Range**: 160-400px (default: 160px)
- **Unit Toggle**: Switch between pixels and percentage
  - Pixels: Fixed width (100-400px)
  - Percentage: Responsive width (50-100%)
- Width changes automatically update submenu positioning
- Content area margin adjusts automatically

#### Menu Item Spacing
Optimize menu item padding for compact or spacious layouts:

- **Vertical Padding**: 5-30px (default: 10px)
  - Controls top and bottom spacing within menu items
  - Smaller values create compact menus
  - Larger values improve touch targets
- **Horizontal Padding**: 5-30px (default: 15px)
  - Controls left and right spacing within menu items
  - Affects menu item width and text positioning
- Live preview shows spacing changes immediately
- Recommended: 8-12px vertical, 12-18px horizontal for modern look

#### Height Mode
Control how menu height is calculated:

- **Full Height** (default): Menu spans 100% of viewport height
  - Best for sites with many menu items
  - Ensures menu is always visible
  - Traditional WordPress behavior
- **Fit to Content**: Menu height adjusts to content
  - Best for sites with few menu items
  - Creates cleaner appearance
  - Reduces wasted space
- **Fixed**: Setting now persists correctly after save and page refresh
- Live preview toggles between modes instantly

### Typography

#### Font Controls
- **Font Size**: 10-24px (default: 13px)
- **Font Weight**: 300-700 (default: 400)
- **Line Height**: 1.0-2.0 (default: 1.5)
- **Letter Spacing**: -2px to 5px (default: 0)
- **Text Transform**: None, Uppercase, Lowercase, Capitalize

#### Google Fonts Integration
Select from popular Google Fonts for menu typography:

**Available Fonts**:
- System Default (no external loading)
- Inter - Modern, highly legible
- Roboto - Clean, professional
- Open Sans - Friendly, readable
- Lato - Warm, stable
- Montserrat - Geometric, modern
- Poppins - Geometric, friendly
- Raleway - Elegant, thin
- Source Sans Pro - Professional
- Nunito - Rounded, friendly
- Plus 10+ more options

**How to Use**:
1. Select font from Font Family dropdown
2. Font loads automatically without page reload
3. Preview updates immediately
4. Fonts are cached for 7 days for performance
5. Fallback to system fonts if loading fails

**Performance Notes**:
- Fonts load asynchronously
- Only selected weights are loaded
- Cached after first load
- No impact on page speed after initial load

### Visual Effects

#### Border Radius (Corner Rounding)
Control menu corner rounding with precision:

**Uniform Mode**:
- Single slider controls all four corners
- Range: 0-50px
- Quick and simple
- Best for consistent rounding

**Individual Mode**:
- Four separate sliders for each corner:
  - Top Left
  - Top Right
  - Bottom Left
  - Bottom Right
- Range: 0-50px per corner
- Create unique shapes
- Asymmetric designs possible

**Recommended Values**:
- 0px: Sharp corners (traditional)
- 8-12px: Subtle modern look
- 16-24px: Pronounced rounding
- 30-50px: Pill-shaped edges

#### Shadow Effects
Add depth with customizable shadows:

**Preset Mode** (recommended):
- **None**: No shadow
- **Subtle**: Light shadow (0 2px 4px rgba(0,0,0,0.1))
- **Medium**: Moderate shadow (0 4px 8px rgba(0,0,0,0.15))
- **Strong**: Pronounced shadow (0 8px 16px rgba(0,0,0,0.2))
- **Dramatic**: Heavy shadow (0 12px 24px rgba(0,0,0,0.3))

**Custom Mode** (advanced):
- **Horizontal Offset**: -50px to 50px
- **Vertical Offset**: -50px to 50px
- **Blur Radius**: 0-100px
- **Spread Radius**: -50px to 50px
- **Shadow Color**: Any color with opacity
- **Opacity**: 0-100%

**Tips**:
- Start with presets for quick results
- Use custom mode for precise control
- Combine with floating mode for elevated effect
- Darker shadows work better with light backgrounds

#### Floating Mode
Create a floating menu effect with margins:

**Uniform Margins**:
- Single slider controls all sides
- Range: 0-100px
- Quick setup
- Symmetrical floating effect

**Individual Margins**:
- Four separate sliders:
  - Top Margin
  - Right Margin
  - Bottom Margin
  - Left Margin
- Range: 0-100px per side
- Asymmetric positioning
- Fine-tuned placement

**Best Practices**:
- Combine with border radius for modern look
- Add shadow for depth
- Use 8-16px margins for subtle effect
- Use 20-40px margins for dramatic floating

#### Glassmorphism
Create frosted glass effect:
- **Enable/Disable**: Toggle glassmorphism effect
- **Blur Intensity**: 0-50px (default: 20px)
- Works best with semi-transparent backgrounds
- Requires backdrop-filter support (modern browsers)
- Fallback provided for older browsers

### Submenu Customization

Style submenus independently from the main menu:

#### Submenu Colors
- **Background Color**: Independent from main menu background
- **Text Color**: Independent from main menu text
- Allows visual distinction between menu levels
- Can match or contrast with main menu

#### Submenu Border Radius
Control submenu corner rounding:

**Uniform Mode**:
- Single slider for all corners
- Range: 0-20px
- Quick and consistent

**Individual Mode**:
- Four separate corner controls
- Range: 0-20px per corner
- Unique submenu shapes

#### Submenu Spacing
Control distance between menu and submenus:

- **Range**: 0-50px (default: 0px)
- Adjusts vertical offset from parent menu item
- Creates visual separation
- Useful for floating menu designs
- Live preview shows positioning changes
- Automatically maintains alignment with parent items

#### Submenu Typography
Independent typography controls for submenu items:

- **Font Size**: 10-24px (default: 13px)
- **Font Family**: System fonts or Google Fonts (independent from main menu)
- **Text Color**: Independent color control
- **Line Height**: 1.0-3.0 (default: 1.5)
- **Letter Spacing**: -2px to 5px (default: 0)
- **Text Transform**: None, Uppercase, Lowercase, Capitalize

**Use Cases**:
- Smaller font size for visual hierarchy
- Different font family for distinction
- Lighter text color for secondary items
- Tighter line height for compact submenus

### Logo Placement

Add custom branding to your admin menu:

#### Logo Upload
- **Supported Formats**: PNG, JPG, SVG
- **Maximum Size**: 2MB
- **Security**: SVG content is sanitized
- **Upload Process**:
  1. Click "Upload Logo" button
  2. Select image file
  3. Logo appears immediately in preview
  4. Save settings to persist

#### Logo Position
- **Top**: Logo appears above menu items
  - Best for branding
  - First thing users see
  - Traditional placement
- **Bottom**: Logo appears below menu items
  - Subtle branding
  - Doesn't interfere with navigation
  - Modern placement

#### Logo Size
- **Width Control**: 20-200px (default: 100px)
- Aspect ratio maintained automatically
- Responsive sizing
- Preview updates in real-time

#### Logo Alignment
- **Left**: Aligns logo to left edge
- **Center**: Centers logo horizontally
- **Right**: Aligns logo to right edge
- Works with any logo width

#### Logo Removal
- Click "Remove Logo" button
- Logo disappears from preview
- Logo URL cleared from settings
- Can upload new logo anytime

**Best Practices**:
- Use SVG for crisp display at any size
- Optimize images before upload
- Keep file size under 500KB for performance
- Use transparent backgrounds for PNG/SVG
- Test logo at different menu widths
- Ensure logo is readable at small sizes

### Dynamic Submenu Positioning

Submenus automatically position correctly based on menu width:

- **Automatic Calculation**: Submenu left position = menu width
- **Width Changes**: Submenu repositions when menu width changes
- **Spacing Offset**: Additional spacing applied if configured
- **Live Updates**: Preview shows positioning changes immediately
- **No Overlap**: Submenus never overlap with menu
- **No Gaps**: Submenus align perfectly with menu edge

**Examples**:
- Menu width 160px → Submenu at left: 160px
- Menu width 200px → Submenu at left: 200px
- Menu width 250px + 10px spacing → Submenu at left: 250px, top: 10px

### Live Preview

All menu customization options update in real-time:

- **Color Changes**: Instant background, text, and icon color updates
- **Dimension Changes**: Width, padding, and spacing update immediately
- **Typography Changes**: Font changes apply without reload
- **Visual Effects**: Shadows, borders, and floating effects preview instantly
- **Submenu Changes**: Positioning and styling update in real-time
- **Logo Changes**: Upload, position, and size changes show immediately

**How to Use Live Preview**:
1. Enable "Live Preview" toggle in header
2. Make changes to any menu setting
3. See changes instantly without saving
4. Experiment freely
5. Click "Save Settings" when satisfied
6. Or refresh page to discard changes

### Troubleshooting Menu Issues

#### Height Mode Not Persisting
**Problem**: Height Mode reverts to "Full Height" after save

**Solution**:
1. Verify you clicked "Save Settings" after changing
2. Check browser console for save errors
3. Clear browser cache and try again
4. Check WordPress debug log for PHP errors
5. Ensure you have admin permissions

**Technical Note**: This was a known issue in earlier versions where the height_mode setting wasn't properly saved to the database. This has been fixed in the current version.

#### Submenu Positioning Incorrect
**Problem**: Submenus don't align with menu edge

**Solution**:
1. Check menu width setting is correct
2. Verify submenu spacing is set as intended
3. Clear browser cache
4. Disable conflicting plugins temporarily
5. Check for custom CSS overriding positioning

**Technical Note**: Submenu position is calculated as: `left = menu_width + spacing_offset`. If positioning seems wrong, verify these values in the settings.

#### Google Fonts Not Loading
**Problem**: Selected Google Font doesn't appear

**Solution**:
1. Check internet connection
2. Verify font name is correct in dropdown
3. Check browser console for loading errors
4. Try a different font to isolate issue
5. Clear font cache (Advanced → Clear Cache)
6. Check if browser blocks Google Fonts (privacy extensions)

**Technical Note**: Fonts load asynchronously from Google Fonts CDN. If loading fails, the system falls back to system fonts. Check browser console for specific error messages.

#### Logo Not Displaying
**Problem**: Uploaded logo doesn't appear

**Solution**:
1. Verify logo is enabled (toggle switch)
2. Check file format is PNG, JPG, or SVG
3. Ensure file size is under 2MB
4. Try uploading a different image
5. Check browser console for upload errors
6. Verify logo URL is saved in settings

**Technical Note**: Logo upload uses WordPress media handling. If upload fails, check PHP upload_max_filesize and post_max_size settings in php.ini.

#### Icons Not Changing Color
**Problem**: Menu icons don't match text color

**Solution**:
1. Check Icon Color Mode setting
2. If "Auto" mode, icons should match text color
3. If "Custom" mode, set icon color explicitly
4. Clear browser cache
5. Check for custom CSS overriding icon colors

**Technical Note**: In Auto mode, icon color is synchronized with text color. In Custom mode, icon color is independent. Check the CSS generator output if colors don't match expectations.

---

## Typography Settings

Control fonts across all areas of the admin interface.

### Areas

- **Admin Bar**: Top bar typography
- **Admin Menu**: Sidebar menu typography
- **Content**: Main content area typography

### Controls (for each area)

- **Font Size**: 10-32px
- **Font Weight**: 300 (Light), 400 (Normal), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- **Line Height**: 1.0-2.5
- **Letter Spacing**: -2px to 5px
- **Text Transform**: None, Uppercase, Lowercase, Capitalize
- **Font Family**: System fonts or Google Fonts

### Google Fonts

1. Enable Google Fonts in Typography tab
2. Enter font family (e.g., "Inter:300,400,500,600,700")
3. Font loads from Google Fonts CDN
4. Applies to selected areas

---

## Visual Effects

Modern visual effects to enhance your admin interface.

### Page Animations

- Smooth transitions between pages
- **Animation Speed**: 100-1000ms (default: 300ms)
- Disable for better performance on slower devices

### Hover Effects

- Interactive feedback on hover
- Smooth color transitions
- Scale and transform effects

### Focus Mode

- Hides distractions for focused work
- Keyboard shortcut: Ctrl+Shift+F
- Minimizes sidebar and admin bar

### Performance Mode

- Disables expensive visual effects
- Improves performance on slower devices
- Keyboard shortcut: Ctrl+Shift+P
- Automatically enabled on low-power devices

---

## Advanced Features

### Custom CSS

Add your own CSS to extend the plugin:

1. Navigate to **Advanced** tab
2. Enter CSS in the Custom CSS textarea
3. CSS is sanitized and appended to generated styles
4. Use `body.wp-admin` prefix for specificity

Example:
```css
body.wp-admin #wpadminbar {
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
```

### Custom JavaScript

Add custom JavaScript (use with caution):

1. Navigate to **Advanced** tab
2. Enter JavaScript in the Custom JS textarea
3. Code executes after plugin initialization
4. Security warning displayed

Example:
```javascript
jQuery(document).ready(function($) {
    console.log('Custom MASE script loaded');
});
```

### Auto Palette Switching

Automatically change palettes based on time of day:

1. Enable **Auto Palette Switch** in Advanced tab
2. Select palettes for each time period:
   - **Morning** (6:00-11:59)
   - **Afternoon** (12:00-17:59)
   - **Evening** (18:00-21:59)
   - **Night** (22:00-5:59)
3. Palette switches automatically every hour
4. Useful for reducing eye strain

---

## Keyboard Shortcuts

Speed up your workflow with keyboard shortcuts.

### Available Shortcuts

- **Ctrl+Shift+1-0**: Switch to palette 1-10
- **Ctrl+Shift+T**: Toggle between light and dark themes
- **Ctrl+Shift+F**: Toggle focus mode
- **Ctrl+Shift+P**: Toggle performance mode

### Enabling/Disabling

1. Navigate to **Advanced** tab
2. Toggle **Enable Keyboard Shortcuts**
3. Individual shortcuts can be disabled

---

## Import/Export

Share configurations across sites or create backups.

### Export Settings

1. Click **Export** button in header or Advanced tab
2. JSON file downloads automatically
3. Filename format: `mase-settings-YYYYMMDD.json`
4. Contains all current settings

### Import Settings

1. Click **Import** button in Advanced tab
2. Select a `.json` file from your computer
3. Settings are validated before import
4. Invalid files are rejected with error message
5. Successful import shows confirmation
6. Automatic backup created before import (if enabled)

### Use Cases

- **Backup**: Export before making major changes
- **Sharing**: Share configurations with team members
- **Migration**: Move settings between staging and production
- **Templates**: Create and share custom configurations

---

## Backup & Restore

Automatic and manual backups protect your settings.

### Automatic Backups

Backups are created automatically:

- Before applying a template
- Before importing settings
- Before major version upgrades

### Manual Backups

1. Navigate to **Advanced** tab
2. Click **Create Backup**
3. Backup is saved with timestamp
4. Maximum 10 backups retained

### Restore from Backup

1. View backup list in Advanced tab
2. Each backup shows date and time
3. Click **Restore** on desired backup
4. Confirm the action
5. Page refreshes with restored settings

### Backup Management

- Backups stored in WordPress options
- Each backup includes complete settings snapshot
- Old backups automatically deleted (keeps 10 most recent)
- Backups survive plugin deactivation

---

## Tips & Best Practices

### Performance

- Use Performance Mode on slower devices
- Disable animations if experiencing lag
- Enable caching for faster load times
- Reduce blur intensity for better performance

### Accessibility

- Enable High Contrast mode for better visibility
- Enable Reduced Motion for users sensitive to animations
- Use keyboard navigation for efficiency
- Ensure Focus Indicators are enabled

### Mobile

- Mobile optimization is automatic
- Touch targets are enlarged on mobile devices
- Effects are reduced on low-power devices
- Compact mode available for smaller screens

### Workflow

1. Start with a template close to your desired look
2. Use Live Preview to experiment without saving
3. Make incremental changes and save frequently
4. Create backups before major changes
5. Export settings once you're happy with the result

---

## Troubleshooting Guide

### Common Issues

#### Preview Not Updating

**Symptoms**: Changes don't appear in preview mode

**Solutions**:
1. Check if Live Preview is enabled (toggle in header)
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache
4. Check browser console for JavaScript errors
5. Disable browser extensions that might interfere

#### Settings Not Saving

**Symptoms**: Changes revert after page reload

**Solutions**:
1. Check for error messages after clicking Save
2. Verify you have admin permissions
3. Check browser console for network errors
4. Try disabling other plugins temporarily
5. Check WordPress debug log for PHP errors

#### Slow Performance

**Symptoms**: Admin interface feels sluggish

**Solutions**:
1. Enable Performance Mode (Ctrl+Shift+P)
2. Disable animations in Effects tab
3. Reduce glassmorphism blur intensity
4. Clear font cache (Advanced → Clear Cache)
5. Check for conflicting plugins

#### Colors Look Wrong

**Symptoms**: Colors don't match palette preview

**Solutions**:
1. Check if custom CSS is overriding colors
2. Verify palette is fully applied (not just previewed)
3. Clear browser cache
4. Check for theme conflicts
5. Try resetting to defaults and reapplying

#### Fonts Not Loading

**Symptoms**: Google Fonts don't appear

**Solutions**:
1. Check internet connection
2. Verify font name is correct (e.g., "Inter:400,700")
3. Clear font cache (Advanced → Clear Cache)
4. Check browser console for loading errors
5. Try a different font family

#### Accessibility Warnings

**Symptoms**: Color contrast warnings appear

**Solutions**:
1. Use suggested accessible colors
2. Adjust colors manually to meet WCAG standards
3. Use Color System's contrast checker
4. Apply a different palette
5. Enable High Contrast mode

### Advanced Troubleshooting

#### Enable Debug Mode

1. Edit `wp-config.php`
2. Add: `define('WP_DEBUG', true);`
3. Add: `define('WP_DEBUG_LOG', true);`
4. Check `wp-content/debug.log` for errors

#### Check Feature Flags

If experiencing issues after upgrade:

1. Navigate to Advanced → Feature Flags
2. Try disabling modern features one at a time
3. Identify which feature causes the issue
4. Report to support with details

#### Reset to Defaults

If all else fails:

1. Navigate to Advanced tab
2. Click "Reset to Defaults"
3. Confirm the action
4. Reapply your preferred palette/template

### Getting Help

If you can't resolve the issue:

1. **Check Documentation**:
   - [FAQ](FAQ.md) - Frequently asked questions
   - [Troubleshooting](TROUBLESHOOTING.md) - Detailed troubleshooting
   - [Developer Guide](DEVELOPER-GUIDE.md) - Technical documentation

2. **Gather Information**:
   - WordPress version
   - MASE version
   - Browser and version
   - Error messages (console and PHP logs)
   - Steps to reproduce

3. **Contact Support**:
   - GitHub Issues: Report bugs and feature requests
   - Support Forum: Community help and discussions
   - Email Support: Direct support for premium users

4. **Provide Details**:
   - Describe the issue clearly
   - Include error messages
   - List steps to reproduce
   - Mention any recent changes
   - Include browser console output

---

## Support

For additional help:

- **Documentation**: [Architecture](ARCHITECTURE.md) | [Developer Guide](DEVELOPER-GUIDE.md) | [Migration Guide](MIGRATION-GUIDE.md)
- **FAQ**: [Frequently Asked Questions](FAQ.md)
- **Troubleshooting**: [Detailed Troubleshooting Guide](TROUBLESHOOTING.md)
- **GitHub**: Report issues and contribute
- **Support Forum**: Community discussions

---

## Appendix: Feature Flags

Advanced users can control which modern features are enabled via Feature Flags in the Advanced tab.

### Available Flags

| Flag | Feature | Status | Recommended |
|------|---------|--------|-------------|
| Modern Preview | Enhanced CSS generation | Stable | ✅ Enabled |
| Modern Color System | Accessibility validation | Stable | ✅ Enabled |
| Modern Typography | Google Fonts integration | Stable | ✅ Enabled |
| Modern Animations | Smooth animations | Stable | ✅ Enabled |
| Modern API Client | REST API communication | Stable | ✅ Enabled |

### When to Disable Features

- **Compatibility Issues**: If a feature conflicts with another plugin
- **Performance**: On very slow servers or devices
- **Debugging**: To isolate which feature causes an issue
- **Preference**: If you prefer legacy behavior

### How to Manage

1. Navigate to Advanced → Feature Flags
2. Toggle checkboxes to enable/disable
3. Click Save Settings
4. Refresh page to apply changes

**Note**: Disabling features reverts to legacy implementation. All functionality remains available, just using older code.

---

**Version**: 2.0.0  
**Last Updated**: October 2025  
**Architecture**: Modern Modular (v2.0+)
