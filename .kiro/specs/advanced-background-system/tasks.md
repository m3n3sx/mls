# Implementation Plan: Advanced Background System

## Overview

This implementation plan breaks down the Advanced Background System into discrete, manageable coding tasks. Each task builds incrementally on previous tasks, with all code integrated into the existing MASE architecture. Tasks are organized by implementation phase with clear objectives and requirement references.

## Task Structure

- Top-level tasks represent major features or components
- Sub-tasks detail specific implementation steps
- Tasks marked with `*` are optional (testing, documentation)
- Each task references specific requirements from requirements.md
- All tasks assume requirements.md and design.md context is available

---

## Phase 1: Core Infrastructure

- [x] 1. Extend settings structure for background system
  - Add `custom_backgrounds` section to `MASE_Settings::get_defaults()`
  - Define default configuration for all 6 admin areas (dashboard, admin_menu, post_lists, post_editor, widgets, login)
  - Include all background types (image, gradient, pattern, none) with default values
  - Ensure backward compatibility with existing settings structure
  - _Requirements: 1.1, 4.1, 11.1_

- [x] 2. Implement background settings validation
  - Create `validate_background_settings()` method in `MASE_Settings`
  - Validate background type (image, gradient, pattern, none)
  - Validate opacity (0-100 range)
  - Validate blend modes against allowed CSS values
  - Validate image URLs using `esc_url_raw()` and `filter_var()`
  - Validate gradient colors using `sanitize_hex_color()`
  - Validate gradient angles (0-360 range)
  - Validate pattern IDs against pattern library
  - Return `WP_Error` on validation failure with specific error messages
  - _Requirements: 1.4, 5.1, 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 3. Create file upload AJAX handler
  - Add `handle_ajax_upload_background_image()` method to `MASE_Admin`
  - Implement nonce verification using `check_ajax_referer()`
  - Check user capability with `current_user_can('manage_options')`
  - Validate file type (JPG, PNG, WebP, SVG) using `wp_check_filetype()`
  - Validate file size (max 5MB)
  - Verify MIME type matches extension to prevent spoofing
  - Handle upload using `wp_handle_upload()`
  - Create WordPress attachment with `wp_insert_attachment()`
  - Generate attachment metadata with `wp_generate_attachment_metadata()`
  - Return attachment ID, URL, and thumbnail URL in JSON response
  - _Requirements: 1.1, 1.2, 8.1, 8.2, 8.3, 12.1, 12.2_

- [x] 4. Implement image optimization
  - Create `optimize_background_image()` private method in `MASE_Admin`
  - Check image dimensions using `getimagesize()`
  - Resize images wider than 1920px using `wp_get_image_editor()`
  - Maintain aspect ratio during resize
  - Regenerate attachment metadata after optimization
  - Log optimization actions for debugging
  - _Requirements: 1.2, 7.1_

- [x] 5. Implement media library selection handler
  - Add `handle_ajax_select_background_image()` method to `MASE_Admin`
  - Verify nonce and user capability
  - Validate attachment ID exists and is an image
  - Retrieve attachment URL and thumbnail using WordPress functions
  - Return attachment data in JSON response
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 6. Implement background removal handler
  - Add `handle_ajax_remove_background_image()` method to `MASE_Admin`
  - Verify nonce and user capability
  - Clear background settings for specified area
  - Do not delete attachment from media library (preserve for reuse)
  - Invalidate CSS cache after removal
  - Return success response
  - _Requirements: 8.5_

- [x] 7. Create basic CSS generation for image backgrounds
  - Add `generate_background_styles()` method to `MASE_CSS_Generator`
  - Define selector mapping for all 6 areas (dashboard, admin_menu, post_lists, post_editor, widgets, login)
  - Create `generate_area_background_css()` method for individual areas
  - Implement `generate_image_background()` method
  - Generate CSS for background-image, background-position, background-size, background-repeat, background-attachment
  - Apply opacity using rgba or opacity property
  - Apply blend mode using mix-blend-mode property
  - Skip disabled or 'none' type backgrounds
  - Integrate with existing `generate_css_internal()` method
  - _Requirements: 1.1, 1.3, 4.1, 5.1, 5.2_

- [x] 8. Create basic admin UI structure
  - Create `backgrounds-tab-content.php` template file in `includes/`
  - Add "Backgrounds" tab to admin settings page
  - Create accordion sections for each of 6 admin areas
  - Add background type selector (none, image, gradient, pattern) for each area
  - Add enable/disable toggle for each area
  - Include area preview containers
  - Use WordPress admin UI classes for consistency
  - _Requirements: 4.1, 9.1_

- [x] 9. Implement file upload interface
  - Create upload zone HTML with drag & drop support
  - Add file input for click-to-upload
  - Display upload progress indicator
  - Show uploaded image preview with thumbnail
  - Add "Remove" button for uploaded images
  - Display file validation errors
  - Style using existing MASE admin CSS patterns
  - _Requirements: 1.1, 9.2_

- [ ]\* 9.1 Write unit tests for file upload validation
  - Test file type validation (valid: JPG, PNG, WebP, SVG; invalid: others)
  - Test file size validation (max 5MB)
  - Test MIME type verification
  - Test extension spoofing prevention
  - _Requirements: 1.1, 1.4, 12.1, 12.2_

- [x] 10. Implement basic live preview
  - Extend `MASE.livePreview` module in `mase-admin.js`
  - Add `updateBackground()` method for background changes
  - Add `getBackgroundConfig()` method to read current settings
  - Add `getAreaSelector()` method for selector mapping
  - Apply background changes to preview iframe or current page
  - Debounce updates to prevent excessive redraws (300ms)
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

---

## Phase 2: Gradient System

- [x] 11. Implement gradient CSS generation
  - Create `generate_gradient_background_css()` method in `MASE_CSS_Generator`
  - Support linear gradients with angle (0-360 degrees)
  - Support radial gradients (circle, ellipse)
  - Generate color stops from gradient_colors array
  - Format CSS gradient string correctly
  - Handle edge cases (missing colors, invalid angles)
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 12. Add gradient validation
  - Extend `validate_background_settings()` for gradient type
  - Validate gradient_type (linear, radial)
  - Validate gradient_angle (0-360)
  - Validate gradient_colors array (min 2, max 10 color stops)
  - Validate each color stop (color hex, position 0-100)
  - Sort color stops by position
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 13. Create gradient presets data structure
  - Add `get_gradient_presets()` method to `MASE_Settings`
  - Define 20+ gradient presets with names, types, angles, and colors
  - Organize presets by category (warm, cool, vibrant, subtle, etc.)
  - Include popular gradients (sunset, ocean, forest, etc.)
  - Make presets filterable via WordPress filter hook
  - _Requirements: 2.3_

- [x] 14. Build gradient builder UI
  - Create gradient builder section in backgrounds tab
  - Add gradient type selector (linear/radial)
  - Add angle control with visual dial for linear gradients
  - Create color stops container with add/remove buttons
  - Add gradient preview area showing live gradient
  - Style using MASE admin CSS
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 15. Implement angle control with visual dial
  - Create draggable dial element for angle selection
  - Bind mousedown/mousemove/mouseup events for drag interaction
  - Update angle input value during drag
  - Rotate dial visual to match angle
  - Allow direct input in angle field
  - Sync dial rotation with input changes
  - _Requirements: 2.4_

- [x] 16. Add color stop management
  - Create `MASE.gradientBuilder` module in new `mase-gradient-builder.js` file
  - Implement `addColorStop()` method (max 10 stops)
  - Implement color stop removal
  - Initialize WordPress color picker for each stop
  - Add position slider (0-100%) for each stop
  - Update preview on any color/position change
  - Validate minimum 2 color stops
  - _Requirements: 2.2, 2.5_

- [x] 17. Create gradient preset selector
  - Display gradient presets in grid layout
  - Show visual preview for each preset
  - Add click handler to apply preset
  - Populate gradient builder with preset values on selection
  - Add preset category filter
  - Localize preset data via `wp_localize_script()`
  - _Requirements: 2.3_

- [x] 18. Integrate gradient builder with live preview
  - Call `MASE.livePreview.updateBackground()` on gradient changes
  - Generate CSS gradient string in JavaScript
  - Apply gradient to preview area in real-time
  - Handle both linear and radial gradients
  - _Requirements: 2.4, 10.1_

- [ ]\* 18.1 Write unit tests for gradient CSS generation
  - Test linear gradient CSS output
  - Test radial gradient CSS output
  - Test color stop formatting
  - Test angle normalization
  - _Requirements: 2.1, 2.2_

---

## Phase 3: Pattern Library

- [x] 19. Create pattern library data structure
  - Add `get_pattern_library()` method to `MASE_Settings`
  - Define 50+ SVG patterns organized by category (dots, lines, grids, organic)
  - Store patterns as SVG strings with color placeholder `{color}`
  - Include pattern metadata (name, category, description)
  - Make library filterable via WordPress filter hook
  - _Requirements: 3.1, 3.2_

- [x] 20. Implement pattern CSS generation
  - Create `generate_pattern_background()` method in `MASE_CSS_Generator`
  - Replace color placeholder in SVG with custom color
  - Encode SVG as data URI (base64)
  - Apply pattern as background-image
  - Set background-size based on scale (50-200%)
  - Apply pattern opacity
  - _Requirements: 3.1, 3.3, 3.4_

- [x] 21. Add pattern validation
  - Extend `validate_background_settings()` for pattern type
  - Validate pattern_id exists in pattern library
  - Validate pattern_color is valid hex color
  - Validate pattern_opacity (0-100)
  - Validate pattern_scale (50-200)
  - _Requirements: 3.2, 3.3, 12.1_

- [x] 22. Build pattern browser UI
  - Create `MASE.patternLibrary` module in new `mase-pattern-library.js` file
  - Display patterns in grid layout with visual previews
  - Add pattern search/filter by name or category
  - Add category dropdown filter
  - Highlight selected pattern
  - Show pattern name on hover
  - _Requirements: 3.1, 3.5_

- [x] 23. Implement pattern customization controls
  - Add color picker for pattern color
  - Add opacity slider (0-100%)
  - Add scale slider (50-200%)
  - Update pattern preview on control changes
  - Display current values next to sliders
  - _Requirements: 3.2, 3.3_

- [x] 24. Integrate pattern library with live preview
  - Generate pattern SVG with custom color in JavaScript
  - Create data URI from SVG
  - Apply pattern to preview area
  - Update on color, opacity, or scale changes
  - _Requirements: 3.4, 10.1_

- [ ]\* 24.1 Write unit tests for pattern generation
  - Test SVG color replacement
  - Test data URI encoding
  - Test pattern scaling
  - Test pattern opacity
  - _Requirements: 3.1, 3.3, 3.4_

---

## Phase 4: Advanced Features

- [x] 25. Implement visual position picker
  - Create `MASE.positionPicker` module in new `mase-position-picker.js` file
  - Build 3x3 grid for standard positions (top-left, top-center, top-right, center-left, center, center-right, bottom-left, bottom-center, bottom-right)
  - Add click handlers for grid cells
  - Highlight selected position
  - Update hidden position input value
  - Add custom position inputs (X%, Y%)
  - Clear grid selection when using custom inputs
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 26. Add advanced property controls
  - Add opacity slider (0-100%) for all background types
  - Add blend mode dropdown with all CSS blend modes
  - Add attachment selector (scroll/fixed)
  - Add size selector (cover, contain, auto, custom)
  - Add repeat selector (no-repeat, repeat, repeat-x, repeat-y)
  - Update live preview on any control change
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 27. Implement responsive variations
  - Add responsive toggle for each area
  - Create breakpoint tabs (desktop ≥1024px, tablet 768-1023px, mobile <768px)
  - Duplicate background controls for each breakpoint
  - Allow different background types per breakpoint
  - Allow disabling backgrounds on specific breakpoints
  - Generate media query CSS for responsive variations
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 28. Generate responsive CSS
  - Create `generate_responsive_background_css()` method in `MASE_CSS_Generator`
  - Generate @media queries for tablet and mobile breakpoints
  - Apply breakpoint-specific background settings
  - Handle 'none' type to disable backgrounds on specific screens
  - Ensure desktop styles are default (no media query)
  - _Requirements: 6.1, 6.5_

- [x] 29. Add responsive preview toggle
  - Add device preview buttons (desktop, tablet, mobile)
  - Resize preview iframe to match selected device
  - Apply responsive background settings to preview
  - Show current breakpoint indicator
  - _Requirements: 6.4_

- [ ]\* 29.1 Write integration tests for responsive backgrounds
  - Test media query generation
  - Test breakpoint-specific settings
  - Test background disable on mobile
  - Test preview device switching
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

---

## Phase 5: Optimization & Performance

- [x] 30. Implement lazy loading for background images
  - Add `lazyLoad()` method to `MASE.backgrounds` module
  - Use IntersectionObserver API for viewport detection
  - Store image URL in data attribute initially
  - Load image when element enters viewport
  - Apply loaded class after image loads
  - Provide fallback for browsers without IntersectionObserver
  - _Requirements: 7.1, 7.2_

- [x] 31. Add WebP support with fallbacks
  - Create `get_optimized_image_url()` method in `MASE_Admin`
  - Detect WebP support from HTTP_ACCEPT header
  - Generate WebP versions of uploaded images
  - Return WebP URL if supported, original otherwise
  - Use CSS image-set() for client-side fallback
  - _Requirements: 7.2_

- [x] 32. Optimize CSS generation performance
  - Profile `generate_background_styles()` execution time
  - Use string concatenation instead of array joins
  - Skip disabled/none backgrounds early
  - Minimize redundant calculations
  - Target <100ms generation time
  - Log performance metrics in debug mode
  - _Requirements: 7.3, 7.4_

- [x] 33. Implement cache warming
  - Extend cache warming in `MASE_Cache` for background CSS
  - Pre-generate CSS for both light and dark modes on settings save
  - Warm cache for all enabled background areas
  - Log cache warming results
  - _Requirements: 7.4, 7.5_

- [x] 34. Add loading states and error handling
  - Show spinner during file upload
  - Display progress bar for large uploads
  - Show error messages for failed uploads
  - Handle network errors gracefully
  - Provide retry option on failure
  - Show success confirmation after upload
  - _Requirements: 7.5_

- [x] 35. Optimize frontend asset loading
  - Load pattern library data on demand (not on page load)
  - Load gradient builder JS only when gradient tab is active
  - Debounce live preview updates (300ms)
  - Throttle scroll events for lazy loading (200ms)
  - Minimize DOM queries using caching
  - _Requirements: 7.1, 7.3_

- [ ]\* 35.1 Write performance tests
  - Test CSS generation time (<100ms)
  - Test lazy loading functionality
  - Test WebP detection and fallback
  - Test cache warming
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

---

## Phase 6: Security & Validation

- [x] 36. Implement SVG sanitization
  - Create `sanitize_svg()` method in `MASE_Admin`
  - Remove <script> tags from SVG content
  - Remove event handlers (onclick, onload, etc.)
  - Remove javascript: URLs
  - Remove data: URLs (except image/\*)
  - Validate SVG structure
  - Log sanitization actions
  - _Requirements: 12.2, 12.4_

- [x] 37. Add comprehensive input validation
  - Validate all numeric inputs (opacity, angles, positions, scales)
  - Validate all color inputs using `sanitize_hex_color()`
  - Validate all URL inputs using `esc_url_raw()`
  - Validate enum values against allowed lists
  - Return specific error messages for each validation failure
  - _Requirements: 12.1, 12.3, 12.5_

- [x] 38. Implement CSRF protection for all AJAX handlers
  - Verify nonce in all background-related AJAX handlers
  - Check user capability (manage_options) in all handlers
  - Return 403 Forbidden on security failures
  - Log security violations
  - _Requirements: 12.3_

- [x] 39. Add XSS prevention
  - Escape all output in admin templates using `esc_attr()`, `esc_html()`, `esc_url()`
  - Use jQuery `.text()` instead of `.html()` for user input
  - Sanitize before inserting HTML
  - Validate and sanitize all JavaScript data
  - _Requirements: 12.4_

- [ ]\* 39.1 Write security tests
  - Test file type spoofing prevention
  - Test SVG script injection prevention
  - Test CSRF protection
  - Test XSS prevention
  - Test SQL injection prevention (if custom queries used)
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

---

## Phase 7: Integration & Polish

- [x] 40. Integrate with existing MASE cache system
  - Invalidate background CSS cache on settings save
  - Invalidate cache on background image upload/removal
  - Use mode-specific cache keys (light/dark)
  - Implement cache warming for both modes
  - _Requirements: 7.4, 7.5_

- [x] 41. Add WordPress Media Library integration
  - Use `wp.media()` JavaScript API
  - Configure media frame for image selection
  - Filter library to show only images
  - Handle media selection callback
  - Display selected image metadata
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 42. Implement settings migration
  - Create `MASE_Background_Migration` class
  - Add migration method for legacy background settings
  - Migrate login page background if exists
  - Initialize default structure for new installations
  - Run migration on plugin update
  - _Requirements: 11.1_

- [x] 43. Add browser compatibility checks
  - Implement feature detection for FileReader, drag & drop, blend modes, gradients
  - Detect WebP support asynchronously
  - Show fallback UI for unsupported features
  - Provide graceful degradation
  - Add compatibility notices where needed
  - _Requirements: 5.5, 7.2_

- [x] 44. Implement error recovery
  - Add fallback to cached CSS on generation error
  - Handle upload failures gracefully
  - Provide retry mechanisms
  - Log errors for debugging
  - Show user-friendly error messages
  - _Requirements: 7.5_

- [x] 45. Add accessibility improvements
  - Add ARIA labels to all interactive elements
  - Ensure keyboard navigation works for all controls
  - Add focus indicators
  - Provide screen reader announcements for dynamic changes
  - Test with screen readers
  - Ensure WCAG 2.1 AA compliance
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 46. Localize all user-facing strings
  - Wrap all strings in translation functions (`__()`, `_e()`, `esc_html__()`)
  - Add text domain 'mase' to all strings
  - Create translation template (.pot file)
  - Localize JavaScript strings via `wp_localize_script()`
  - Test with different languages
  - _Requirements: All user-facing requirements_

- [x] 47. Add inline documentation
  - Document all PHP methods with PHPDoc blocks
  - Document all JavaScript functions with JSDoc blocks
  - Add code comments for complex logic
  - Document security measures
  - Document performance optimizations
  - _Requirements: All requirements_

- [ ]\* 47.1 Create user documentation
  - Write user guide for background system
  - Create screenshots for each feature
  - Document common use cases
  - Add troubleshooting section
  - _Requirements: All requirements_

- [ ]\* 47.2 Create developer documentation
  - Document API methods and hooks
  - Provide code examples
  - Document extension points
  - Create architecture diagrams
  - _Requirements: All requirements_

---

## Phase 8: Testing & Quality Assurance

- [ ]\* 48. Write comprehensive unit tests
  - Test settings validation (all background types)
  - Test CSS generation (images, gradients, patterns)
  - Test file upload validation
  - Test image optimization
  - Test SVG sanitization
  - Test responsive CSS generation
  - Achieve >80% code coverage
  - _Requirements: All requirements_

- [ ]\* 49. Write integration tests
  - Test complete upload flow (file → attachment → settings → CSS)
  - Test media library selection flow
  - Test gradient creation flow
  - Test pattern application flow
  - Test settings save and cache invalidation
  - Test responsive variations
  - _Requirements: All requirements_

- [ ]\* 50. Write end-to-end tests (Playwright)
  - Test image upload and application
  - Test gradient creation and preview
  - Test pattern selection and customization
  - Test position picker interaction
  - Test responsive preview switching
  - Test live preview updates
  - Test settings save and persistence
  - Test all 6 admin areas
  - _Requirements: All requirements_

- [ ]\* 51. Perform security audit
  - Test file upload security (type spoofing, size limits)
  - Test SVG sanitization (script injection)
  - Test CSRF protection (all AJAX handlers)
  - Test XSS prevention (all output)
  - Test input validation (all fields)
  - Test capability checks (all handlers)
  - Document security measures
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]\* 52. Perform performance testing
  - Measure CSS generation time (target <100ms)
  - Test lazy loading effectiveness
  - Measure page load impact
  - Test cache hit rates
  - Profile JavaScript performance
  - Optimize bottlenecks
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]\* 53. Test browser compatibility
  - Test in Chrome, Firefox, Safari, Edge
  - Test on Windows, macOS, Linux
  - Test responsive design on mobile devices
  - Test feature detection and fallbacks
  - Document browser support matrix
  - _Requirements: 5.5, 7.2_

- [ ]\* 54. Perform accessibility testing
  - Test with screen readers (NVDA, JAWS, VoiceOver)
  - Test keyboard navigation
  - Test focus indicators
  - Test color contrast
  - Validate ARIA labels
  - Run automated accessibility audits (axe, WAVE)
  - Achieve WCAG 2.1 AA compliance
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

---

## Implementation Notes

### Task Execution Order

1. **Sequential Dependencies**: Tasks within each phase should be completed in order as they build on each other
2. **Phase Dependencies**: Complete Phase 1 before Phase 2, Phase 2 before Phase 3, etc.
3. **Optional Tasks**: Tasks marked with `*` are optional and can be skipped for MVP, but recommended for production
4. **Testing Tasks**: Optional testing tasks should be executed after their corresponding feature tasks

### Context Requirements

- All tasks assume access to requirements.md and design.md
- Developers should review existing MASE code patterns before implementation
- Follow WordPress coding standards and MASE conventions
- Use existing MASE infrastructure (settings, CSS generator, cache, admin)

### Success Criteria

- All non-optional tasks completed and working
- CSS generation <100ms
- All security measures implemented
- Live preview working smoothly
- All 6 admin areas support all 3 background types
- Settings persist correctly
- Cache invalidation working
- No console errors
- Responsive design working

### Optional Task Recommendations

For MVP (Minimum Viable Product):

- Skip all testing tasks initially
- Skip documentation tasks initially
- Focus on core functionality (tasks 1-47)

For Production Release:

- Complete all testing tasks (48-54)
- Complete all documentation tasks (47.1, 47.2)
- Achieve >80% test coverage
- Pass security audit
- Achieve WCAG 2.1 AA compliance

### Estimated Timeline

- Phase 1 (Core Infrastructure): 1 week
- Phase 2 (Gradient System): 1 week
- Phase 3 (Pattern Library): 1 week
- Phase 4 (Advanced Features): 1 week
- Phase 5 (Optimization): 1 week
- Phase 6 (Security): 3 days
- Phase 7 (Integration): 4 days
- Phase 8 (Testing): 1 week (if optional tasks included)

**Total: 6-7 weeks** (including optional testing tasks)
**MVP: 5 weeks** (excluding optional tasks)
