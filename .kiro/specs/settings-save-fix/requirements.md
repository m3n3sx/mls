# Requirements Document

## Introduction

This spec addresses critical bugs preventing users from saving settings in the Modern Admin Styler (MASE) plugin. Users are experiencing three error messages: "Failed to initialize MASE Admin", "Please fix 2 validation errors before saving", and general save failures. The root causes are: inadequate JavaScript initialization error handling, validation errors not being communicated to the frontend, and mobile optimizer conflicts.

## Glossary

- **MASE_Admin**: PHP class responsible for admin interface, asset enqueuing, and AJAX request processing
- **MASE_Settings**: PHP class handling settings storage, retrieval, validation, and defaults
- **MASE_Mobile_Optimizer**: PHP class that optimizes settings for mobile devices
- **Validation Error**: A WP_Error object containing field-specific validation failures
- **AJAX Handler**: Server-side function processing asynchronous JavaScript requests
- **Frontend**: Client-side JavaScript code running in the user's browser
- **Nonce**: WordPress security token for CSRF protection
- **wp_localize_script**: WordPress function passing PHP data to JavaScript

## Requirements

### Requirement 1: JavaScript Initialization Diagnostics

**User Story:** As a plugin user, I want clear error messages when JavaScript fails to initialize, so that I can understand what went wrong and report issues effectively.

#### Acceptance Criteria

1. WHEN the mase-admin.js script loads, THE MASE_Admin SHALL log the script version and initialization start time to the browser console
2. WHEN jQuery is not available, THE MASE_Admin SHALL log an error message "MASE: jQuery not loaded" and display a user-friendly alert
3. WHEN maseAdmin localized object is missing, THE MASE_Admin SHALL log an error message "MASE: maseAdmin object missing - check wp_localize_script" and display a user-friendly alert
4. WHEN initialization completes successfully, THE MASE_Admin SHALL log "MASE: Admin initialized successfully" to the browser console
5. WHEN initialization fails with an exception, THE MASE_Admin SHALL log the error message and stack trace, then display an alert to the user

### Requirement 2: Validation Error Communication

**User Story:** As a plugin user, I want to see specific validation errors when my settings fail to save, so that I can correct the invalid values and successfully save my configuration.

#### Acceptance Criteria

1. WHEN validation fails in MASE_Settings::validate(), THE MASE_Settings SHALL return a WP_Error object containing all field-specific error messages
2. WHEN MASE_Settings::update_option() receives a WP_Error from validate(), THE MASE_Settings SHALL return the WP_Error object to the caller instead of returning false
3. WHEN MASE_Admin::handle_ajax_save_settings() receives a WP_Error from update_option(), THE MASE_Admin SHALL extract error messages and error data from the WP_Error object
4. WHEN validation errors exist, THE MASE_Admin SHALL send a JSON error response with HTTP status 400 containing the validation error messages and field names
5. WHEN the JavaScript receives a validation error response, THE MASE_Admin SHALL parse the error details and display each validation error to the user in a readable format

### Requirement 3: Mobile Optimizer Error Handling

**User Story:** As a plugin user, I want settings to save successfully even if the mobile optimizer encounters errors, so that my configuration is not lost due to optional optimization features.

#### Acceptance Criteria

1. WHEN MASE_Mobile_Optimizer class does not exist, THE MASE_Settings SHALL log a warning and continue saving settings without mobile optimization
2. WHEN MASE_Mobile_Optimizer::is_mobile() throws an exception, THE MASE_Settings SHALL catch the exception, log the error, and continue saving settings without mobile optimization
3. WHEN MASE_Mobile_Optimizer::get_optimized_settings() throws an exception, THE MASE_Settings SHALL catch the exception, log the error, and save the unoptimized settings
4. WHEN mobile optimizer errors occur, THE MASE_Settings SHALL log the specific error message with the prefix "MASE: Mobile optimizer error:"
5. WHEN mobile optimization is skipped due to errors, THE MASE_Settings SHALL still return true if the core settings were saved successfully

### Requirement 4: Enhanced AJAX Error Responses

**User Story:** As a plugin user, I want detailed error messages when AJAX requests fail, so that I can understand whether the issue is with permissions, network connectivity, or invalid data.

#### Acceptance Criteria

1. WHEN an AJAX request fails with HTTP 403, THE MASE_Admin SHALL display the message "Permission denied. You do not have access to perform this action."
2. WHEN an AJAX request fails with HTTP 400, THE MASE_Admin SHALL display the validation error details from the response data
3. WHEN an AJAX request fails with HTTP 500, THE MASE_Admin SHALL display the message "Server error. Please try again later."
4. WHEN an AJAX request fails with a network error, THE MASE_Admin SHALL display the message "Network error. Please check your connection and try again."
5. WHEN the response contains validation_errors data, THE MASE_Admin SHALL format and display each field error with the field name and error message

### Requirement 5: Settings Save Debugging

**User Story:** As a plugin developer or support technician, I want comprehensive logging during the settings save process, so that I can diagnose save failures quickly and accurately.

#### Acceptance Criteria

1. WHEN handle_ajax_save_settings() is called, THE MASE_Admin SHALL log the incoming POST data keys and settings data size in kilobytes
2. WHEN JSON decoding occurs, THE MASE_Admin SHALL log whether decoding succeeded or failed with the specific JSON error message
3. WHEN validation is called, THE MASE_Admin SHALL log the sections being validated and whether validation passed or failed
4. WHEN validation fails, THE MASE_Admin SHALL log all validation error messages with field names
5. WHEN update_option() is called, THE MASE_Admin SHALL log whether the save operation succeeded or failed with the return value
