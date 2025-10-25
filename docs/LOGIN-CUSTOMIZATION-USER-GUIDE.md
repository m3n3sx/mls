# Login Page Customization - User Guide

## Overview

The Modern Admin Styler (MASE) plugin provides comprehensive login page customization capabilities, allowing you to create a branded login experience that matches your organization's identity. This guide will walk you through all available customization options and best practices.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Logo Customization](#logo-customization)
3. [Background Customization](#background-customization)
4. [Form Styling](#form-styling)
5. [Typography Settings](#typography-settings)
6. [Additional Options](#additional-options)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Accessibility Guidelines](#accessibility-guidelines)

---

## Getting Started

### Accessing Login Customization Settings

1. Log in to your WordPress admin dashboard
2. Navigate to **Settings > Modern Admin Styler**
3. Click on the **Login Page Customization** tab
4. Enable login customization by checking **"Enable Custom Logo"** or configuring background settings

### Quick Start

For a basic branded login page:
1. Upload your company logo (recommended size: 200x200px)
2. Set a background color that matches your brand
3. Adjust form colors for contrast
4. Click **Save Changes**
5. Visit your login page to see the results

---

## Logo Customization

### Uploading a Custom Logo

**Supported Formats:**
- PNG (recommended for transparency)
- JPG/JPEG
- SVG (automatically sanitized for security)

**File Size Limits:**
- Maximum: 2MB
- Recommended: Under 500KB for optimal performance

**Steps:**
1. Check **"Enable Custom Logo"**
2. Click **"Upload Logo"** button
3. Select your logo file from your computer
4. The logo will appear in the preview area
5. Adjust width and height if needed

### Logo Dimensions

**Default Size:** 84x84 pixels (WordPress standard)

**Adjusting Size:**
- Use the **Width** slider (50-400px)
- Use the **Height** slider (50-400px)
- Maintain aspect ratio for best results

**Recommended Sizes:**
- Square logos: 150x150px to 200x200px
- Wide logos: 300x100px to 400x150px
- Tall logos: 100x200px to 150x300px

### Custom Logo Link

By default, the WordPress logo links to wordpress.org. You can customize this:

**Options:**
- Leave empty: Links to wordpress.org (default)
- Enter your site URL: Links to your homepage
- Enter custom URL: Links to any page you specify

**Example:**
```
https://yourcompany.com
```

### Removing a Logo

1. Click the **"Remove"** button next to the logo preview
2. The default WordPress logo will be restored
3. Click **Save Changes** to apply

---

## Background Customization

### Background Types

Choose from three background types:

#### 1. Solid Color

**Best for:** Simple, clean designs

**Steps:**
1. Select **"Color"** as background type
2. Click the color picker
3. Choose your desired color
4. Adjust opacity if needed (0-100%)

**Tips:**
- Use light colors for better form visibility
- Ensure good contrast with form elements
- Consider your brand colors

#### 2. Background Image

**Best for:** Branded, visual experiences

**Supported Formats:**
- PNG
- JPG/JPEG
- Maximum size: 5MB

**Steps:**
1. Select **"Image"** as background type
2. Click **"Upload Background"**
3. Select your image file
4. Configure image settings:
   - **Position:** Center, Top, Bottom, Left, Right
   - **Size:** Cover (fill screen), Contain (fit), Auto (original)
   - **Repeat:** No-repeat (recommended), Repeat, Repeat-X, Repeat-Y
5. Adjust opacity for better form visibility

**Recommended Images:**
- Resolution: 1920x1080px or higher
- File size: Under 2MB for fast loading
- Avoid busy patterns that reduce readability

#### 3. Gradient Background

**Best for:** Modern, dynamic designs

**Types:**
- **Linear:** Straight color transition
- **Radial:** Circular color transition

**Steps:**
1. Select **"Gradient"** as background type
2. Choose gradient type (Linear or Radial)
3. For linear gradients, set the angle (0-360°)
4. Add color stops:
   - Click **"Add Color Stop"**
   - Choose color
   - Set position (0-100%)
5. Adjust opacity if needed

**Popular Gradient Examples:**
- **Sunset:** #FF6B6B (0%) → #FFE66D (100%), 135° angle
- **Ocean:** #667eea (0%) → #764ba2 (100%), 135° angle
- **Forest:** #56ab2f (0%) → #a8e063 (100%), 135° angle

### Background Opacity

Control background transparency (0-100%):
- **100%:** Fully opaque (default)
- **80-90%:** Subtle transparency
- **50-70%:** Moderate transparency
- **Below 50%:** High transparency (may affect readability)

---

## Form Styling

### Form Colors

#### Background Color
- Default: White (#ffffff)
- Recommendation: Light colors for readability
- Consider contrast with page background

#### Border Color
- Default: Light gray (#c3c4c7)
- Use subtle colors for professional look
- Match with your brand colors

#### Text Color
- Default: Dark gray (#2c3338)
- Must have sufficient contrast with form background
- WCAG AA requires 4.5:1 contrast ratio

#### Focus Color
- Default: WordPress blue (#2271b1)
- Highlights active input fields
- Should stand out from other colors

### Border Radius

Control form corner roundness (0-25px):
- **0px:** Sharp corners (traditional)
- **5-10px:** Subtle rounding (modern)
- **15-25px:** Pronounced rounding (friendly)

### Box Shadow

Add depth to the login form:

**Presets:**
- **None:** No shadow (flat design)
- **Default:** Subtle shadow (0 1px 3px)
- **Subtle:** Light shadow (0 2px 4px)
- **Medium:** Moderate shadow (0 4px 8px)
- **Strong:** Prominent shadow (0 8px 16px)

**Recommendations:**
- Use subtle shadows for professional look
- Stronger shadows for emphasis
- Match shadow intensity with design style

### Glassmorphism Effect

Create a modern frosted glass appearance:

**Enable Glassmorphism:**
1. Check **"Enable Glassmorphism Effect"**
2. Adjust blur amount (0-50px)
3. Set opacity (0-100%)

**Settings:**
- **Blur:** 10-20px recommended
- **Opacity:** 70-90% for readability
- **Best with:** Image or gradient backgrounds

**Browser Support:**
- Modern browsers: Full support
- Older browsers: Graceful fallback to solid background

**Tips:**
- Ensure text remains readable
- Test on different backgrounds
- Higher opacity for better readability

---

## Typography Settings

### Label Typography

Customize form labels (Username, Password, etc.):

**Font Family:**
- System: Uses device default fonts (fastest)
- Custom: Enter Google Font name

**Font Size:**
- Default: 14px
- Range: 10-24px
- Recommendation: 12-16px for readability

**Font Weight:**
- Default: 400 (normal)
- Range: 100-900
- Common values: 300 (light), 400 (normal), 600 (semi-bold), 700 (bold)

### Input Typography

Customize input field text:

**Font Family:**
- System: Recommended for consistency
- Custom: Match with label font

**Font Size:**
- Default: 24px
- Range: 16-32px
- Recommendation: 18-24px for easy reading

**Tips:**
- Keep fonts consistent with your site
- Ensure readability on all devices
- Test with actual login credentials

---

## Additional Options

### Custom Footer Text

Add custom branding or information to the login page footer:

**Supported Content:**
- Plain text
- HTML (safe tags only)
- Links
- Copyright notices

**Example:**
```html
<p>&copy; 2024 Your Company. All rights reserved.</p>
<p><a href="https://yourcompany.com/privacy">Privacy Policy</a></p>
```

**Allowed HTML Tags:**
- `<p>`, `<a>`, `<strong>`, `<em>`, `<br>`
- `<span>`, `<div>` (with limited attributes)

**Security:**
- All HTML is sanitized automatically
- Scripts and dangerous tags are removed
- Links are validated

### Hide WordPress Branding

Remove default WordPress links from login page:

**What Gets Hidden:**
- "← Go to [Site Name]" link
- "Lost your password?" link (if enabled)

**When to Use:**
- White-label installations
- Client sites
- Custom branding requirements

**Note:** This only hides the links visually; WordPress functionality remains unchanged.

### Custom CSS

Add advanced styling with custom CSS:

**Use Cases:**
- Fine-tune specific elements
- Add animations
- Override default styles
- Advanced customizations

**Example:**
```css
/* Animate form entrance */
#loginform {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Style remember me checkbox */
.login .forgetmenot label {
    color: #666;
    font-size: 13px;
}
```

**Tips:**
- Test thoroughly before deploying
- Use `!important` sparingly
- Validate CSS syntax
- Consider mobile responsiveness

---

## Best Practices

### Design Guidelines

1. **Maintain Readability**
   - Ensure sufficient color contrast
   - Use legible font sizes
   - Avoid busy backgrounds behind forms

2. **Brand Consistency**
   - Match your website's design
   - Use brand colors and fonts
   - Include company logo

3. **Performance**
   - Optimize images before uploading
   - Keep file sizes reasonable
   - Test load times

4. **Mobile Responsiveness**
   - Test on various screen sizes
   - Ensure touch-friendly elements
   - Verify readability on small screens

### Security Best Practices

1. **Logo Files**
   - Only upload from trusted sources
   - Scan SVG files for malicious code
   - Keep file sizes reasonable

2. **Custom CSS**
   - Avoid inline JavaScript
   - Don't include external resources
   - Test for XSS vulnerabilities

3. **Background Images**
   - Use HTTPS URLs only
   - Host images on your server
   - Avoid hotlinking

### Accessibility Best Practices

1. **Color Contrast**
   - Maintain 4.5:1 ratio for text
   - Use the built-in contrast checker
   - Test with color blindness simulators

2. **Keyboard Navigation**
   - Ensure all elements are keyboard accessible
   - Maintain logical tab order
   - Provide visible focus indicators

3. **Screen Readers**
   - Use descriptive alt text for logos
   - Ensure form labels are properly associated
   - Test with screen reader software

---

## Troubleshooting

### Common Issues

#### Logo Not Displaying

**Symptoms:** Logo upload succeeds but doesn't appear on login page

**Solutions:**
1. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
2. Clear WordPress cache (if using caching plugin)
3. Verify logo URL in settings
4. Check file permissions on uploads directory
5. Try a different image format

#### Background Image Not Loading

**Symptoms:** Background remains default color

**Solutions:**
1. Verify image URL is accessible
2. Check file size (must be under 5MB)
3. Ensure image format is PNG or JPG
4. Clear browser and WordPress cache
5. Check for HTTPS/HTTP mixed content issues

#### Form Text Not Readable

**Symptoms:** Text is hard to read against background

**Solutions:**
1. Increase form background opacity
2. Adjust background image opacity
3. Change text color for better contrast
4. Enable glassmorphism for better separation
5. Use the contrast checker tool

#### Changes Not Appearing

**Symptoms:** Settings saved but login page unchanged

**Solutions:**
1. Clear all caches:
   - Browser cache
   - WordPress object cache
   - Page cache (if using caching plugin)
2. Try incognito/private browsing mode
3. Check if another plugin is overriding styles
4. Verify settings were actually saved
5. Check browser console for errors

#### Upload Fails

**Symptoms:** File upload returns error message

**Solutions:**
1. **"File too large"**
   - Reduce file size (compress image)
   - Logo limit: 2MB
   - Background limit: 5MB

2. **"Invalid file type"**
   - Use PNG, JPG, or SVG only
   - Check file extension matches content
   - Rename file if needed

3. **"Upload failed"**
   - Check server upload limits (php.ini)
   - Verify uploads directory is writable
   - Check available disk space
   - Review server error logs

#### Glassmorphism Not Working

**Symptoms:** Glassmorphism enabled but no blur effect

**Solutions:**
1. Check browser compatibility:
   - Chrome/Edge: Supported
   - Firefox: Supported
   - Safari: Supported
   - IE: Not supported (fallback to solid)
2. Verify backdrop-filter CSS support
3. Ensure background is set (image or gradient)
4. Try increasing blur amount
5. Check for conflicting CSS

### Performance Issues

#### Slow Login Page Load

**Symptoms:** Login page takes long to load

**Solutions:**
1. Optimize background image:
   - Reduce file size
   - Use appropriate dimensions
   - Consider WebP format
2. Disable glassmorphism if not needed
3. Minimize custom CSS
4. Enable caching
5. Use CDN for images

#### High Server Load

**Symptoms:** Server resources spike when accessing login

**Solutions:**
1. Enable CSS caching (automatic)
2. Optimize images
3. Reduce CSS complexity
4. Check for plugin conflicts
5. Monitor server resources

### Browser-Specific Issues

#### Safari Issues

**Problem:** Styles appear different in Safari

**Solutions:**
1. Test with -webkit- prefixes
2. Verify backdrop-filter support
3. Check gradient syntax
4. Test on actual Safari (not just WebKit)

#### Firefox Issues

**Problem:** Glassmorphism not rendering correctly

**Solutions:**
1. Ensure Firefox version is up to date
2. Check backdrop-filter support
3. Verify CSS syntax
4. Test fallback styles

#### Mobile Browser Issues

**Problem:** Login page doesn't look right on mobile

**Solutions:**
1. Test on actual devices
2. Check viewport meta tag
3. Verify responsive CSS
4. Test touch interactions
5. Check font sizes for readability

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

The login customization feature includes built-in accessibility checks:

#### Color Contrast

**Requirements:**
- Normal text: 4.5:1 contrast ratio minimum
- Large text (18pt+): 3:1 contrast ratio minimum

**Built-in Checker:**
- Automatically validates form text/background contrast
- Displays warnings for insufficient contrast
- Suggests alternative colors

**How to Check:**
1. Set your desired colors
2. Look for contrast warnings
3. Adjust colors if needed
4. Aim for 4.5:1 or higher

**Tools:**
- Built-in MASE contrast checker
- WebAIM Contrast Checker
- Browser DevTools accessibility panel

#### Keyboard Navigation

**Requirements:**
- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators

**Testing:**
1. Use Tab key to navigate
2. Verify all fields are reachable
3. Check focus indicators are visible
4. Test form submission with Enter key

#### Screen Reader Compatibility

**Requirements:**
- Descriptive labels for all form fields
- Alt text for logo images
- Proper heading structure

**Testing:**
1. Test with NVDA (Windows) or VoiceOver (Mac)
2. Verify all elements are announced
3. Check form field labels
4. Test error messages

### Accessibility Checklist

Before deploying your customized login page:

- [ ] Text contrast meets 4.5:1 ratio
- [ ] Logo has descriptive alt text
- [ ] All form fields are keyboard accessible
- [ ] Focus indicators are clearly visible
- [ ] Custom CSS doesn't hide important elements
- [ ] Tested with screen reader
- [ ] Tested keyboard-only navigation
- [ ] Form labels are properly associated
- [ ] Error messages are accessible
- [ ] Works without JavaScript (graceful degradation)

---

## Additional Resources

### Related Documentation

- [MASE Developer Guide](DEVELOPER-GUIDE.md)
- [Login Customization Migration Guide](LOGIN-CUSTOMIZATION-MIGRATION.md)
- [MASE Architecture](ARCHITECTURE.md)

### External Resources

- [WordPress Login Customization](https://developer.wordpress.org/reference/hooks/login_enqueue_scripts/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Google Fonts](https://fonts.google.com/)

### Support

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review WordPress debug logs
3. Check browser console for errors
4. Contact plugin support with:
   - WordPress version
   - MASE version
   - Browser and version
   - Steps to reproduce issue
   - Screenshots if applicable

---

## Changelog

### Version 1.3.0
- Initial release of login page customization feature
- Logo upload and customization
- Background customization (color, image, gradient)
- Form styling options
- Glassmorphism effect
- Typography controls
- Custom footer text
- Accessibility features
- Built-in contrast checker

---

## Credits

Modern Admin Styler (MASE) Login Page Customization
- Developed with WordPress best practices
- Follows WCAG 2.1 AA accessibility standards
- Implements WordPress security guidelines
- Optimized for performance

---

*Last Updated: 2024*
*Plugin Version: 1.3.0*
