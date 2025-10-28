# Requirements Document

## Introduction

This specification addresses critical functionality issues in the MASE v1.2.0 template system. The template gallery currently has three major problems: missing thumbnails showing empty placeholders, non-functional Apply buttons that do nothing when clicked, and an oversized gallery layout that consumes excessive screen space. These issues prevent users from effectively browsing and applying design templates, which is a core feature of the plugin.

## Glossary

- **MASE**: Modern Admin Styler Engine - the core system name for the plugin
- **Template System**: Feature that provides complete preset configurations including colors, typography, and visual effects
- **Template Gallery**: Grid-based UI displaying all available templates with preview cards
- **Template Card**: Individual card component showing template preview, name, description, and action buttons
- **Template Thumbnail**: Visual preview image displayed at the top of each template card
- **Apply Button**: Action button on template cards that applies the template configuration to user settings
- **Template Data**: PHP array structure containing template configuration (name, description, colors, thumbnail)
- **AJAX Handler**: Server-side PHP method that processes template application requests
- **Data Attribute**: HTML attribute (data-*) used to store template identifiers for JavaScript access
- **SVG Thumbnail**: Scalable Vector Graphics image generated dynamically for template previews

## Requirements

### Requirement 1

**User Story:** As a WordPress administrator, I want to see visual thumbnails for each template in the gallery, so that I can quickly identify and compare different design options.

#### Acceptance Criteria

1. WHEN the administrator views the Templates tab, THE Template System SHALL display a thumbnail image for each template card
2. THE Template System SHALL generate SVG thumbnails dynamically using the template's primary color as background
3. THE Template System SHALL render the template name as centered text within each thumbnail
4. THE Template System SHALL encode thumbnails as base64 data URIs for efficient inline rendering
5. THE Template System SHALL set thumbnail dimensions to 300x200 pixels in the SVG viewBox

### Requirement 2

**User Story:** As a WordPress administrator, I want the Apply button to work when I click it, so that I can activate my chosen template configuration.

#### Acceptance Criteria

1. WHEN the administrator clicks the Apply button on any template card, THE Template System SHALL send an AJAX request to apply the template within 100 milliseconds
2. THE Template System SHALL display a confirmation dialog before applying the template
3. WHEN the template application succeeds, THE Template System SHALL display a success notification and reload the page within 1000 milliseconds
4. IF the template application fails, THE Template System SHALL display an error notification and restore the button to its original state
5. WHILE the template is being applied, THE Template System SHALL disable the Apply button and display "Applying..." text

### Requirement 3

**User Story:** As a WordPress administrator, I want template cards to have correct HTML attributes, so that JavaScript event handlers can properly identify and process template selections.

#### Acceptance Criteria

1. THE Template Card SHALL include a data-template attribute containing the template identifier
2. THE Template Card SHALL include a data-template-id attribute for backward compatibility
3. THE Template Card SHALL include a role="article" attribute for accessibility
4. THE Template Card SHALL include an aria-label attribute with the template name
5. THE JavaScript Handler SHALL successfully read the template identifier from the data-template attribute

### Requirement 4

**User Story:** As a WordPress administrator, I want the template gallery to use screen space efficiently, so that I can view more content without excessive scrolling.

#### Acceptance Criteria

1. THE Template Gallery SHALL display templates in a 3-column grid on desktop viewports (1400px and wider)
2. THE Template Gallery SHALL display templates in a 2-column grid on medium viewports (900px to 1399px)
3. THE Template Gallery SHALL display templates in a 1-column grid on mobile viewports (below 900px)
4. THE Template Card SHALL limit thumbnail height to 150 pixels
5. THE Template Card SHALL limit description text to 2 lines with ellipsis overflow

### Requirement 5

**User Story:** As a developer, I want the template data structure to include thumbnail properties, so that the frontend can render visual previews consistently.

#### Acceptance Criteria

1. THE Template Data SHALL include a thumbnail property for each template in the get_all_templates() method
2. THE Template Data SHALL generate thumbnails using a dedicated generate_template_thumbnail() method
3. THE generate_template_thumbnail() method SHALL accept template name and primary color as parameters
4. THE generate_template_thumbnail() method SHALL return a base64-encoded SVG data URI
5. THE generate_template_thumbnail() method SHALL sanitize all input parameters to prevent XSS vulnerabilities

### Requirement 6

**User Story:** As a WordPress administrator, I want to confirm template application before it happens, so that I don't accidentally overwrite my current settings.

#### Acceptance Criteria

1. WHEN the administrator clicks Apply, THE Template System SHALL display a confirmation dialog listing what will be changed
2. THE Confirmation Dialog SHALL inform the user that the action cannot be undone
3. THE Confirmation Dialog SHALL list affected settings categories (colors, typography, visual effects)
4. IF the user cancels the confirmation, THE Template System SHALL abort the operation without making changes
5. IF the user confirms, THE Template System SHALL proceed with template application

### Requirement 7

**User Story:** As a developer, I want a PHP AJAX handler for template application, so that the backend can process and persist template configurations.

#### Acceptance Criteria

1. THE MASE Admin Class SHALL register an AJAX action hook for mase_apply_template
2. THE AJAX Handler SHALL verify the WordPress nonce for security validation
3. THE AJAX Handler SHALL check that the current user has manage_options capability
4. THE AJAX Handler SHALL validate that the requested template exists before applying it
5. THE AJAX Handler SHALL invalidate the CSS cache after successfully applying a template

### Requirement 8

**User Story:** As a WordPress administrator, I want visual feedback during template application, so that I understand the system is processing my request.

#### Acceptance Criteria

1. WHEN the Apply button is clicked, THE Template System SHALL disable the button immediately
2. THE Template System SHALL change the button text to "Applying..." during processing
3. THE Template System SHALL reduce the card opacity to 0.6 during processing
4. WHEN the operation completes, THE Template System SHALL restore the button and card to normal state
5. THE Template System SHALL log all template application events to the browser console for debugging

### Requirement 9

**User Story:** As a WordPress administrator, I want the template gallery to hide unnecessary details, so that I can focus on essential information when choosing templates.

#### Acceptance Criteria

1. THE Template Card SHALL hide the features list to conserve vertical space
2. THE Template Card SHALL display only the thumbnail, name, description, and Apply button
3. THE Template Card SHALL limit the total card height to 420 pixels maximum
4. THE Template Card SHALL use compact padding of 16 pixels in the card body
5. THE Template Card SHALL use reduced font sizes (16px for name, 13px for description)

### Requirement 10

**User Story:** As a developer, I want comprehensive error handling in the template system, so that failures are logged and communicated clearly to users.

#### Acceptance Criteria

1. IF the template ID is missing, THE AJAX Handler SHALL return a 400 error with message "Template ID is required"
2. IF the template does not exist, THE AJAX Handler SHALL return a 404 error with message "Template not found"
3. IF the user lacks permissions, THE AJAX Handler SHALL return a 403 error with message "Insufficient permissions"
4. IF template application fails, THE AJAX Handler SHALL return a 500 error with the specific error message
5. THE JavaScript Handler SHALL parse and display error messages from AJAX responses in user-friendly notifications
