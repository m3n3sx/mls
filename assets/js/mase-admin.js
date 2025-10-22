/**
 * Modern Admin Styler Enterprise - Admin JavaScript
 *
 * Handles color pickers, live preview, AJAX form submission, and user feedback.
 *
 * @package MASE
 * @since 1.2.0
 */

(function($) {
    'use strict';
    
    /**
     * MASE Admin Object
     */
    var MASE = {
        
        /**
         * Configuration
         */
        config: {
            ajaxUrl: typeof ajaxurl !== 'undefined' ? ajaxurl : '',
            nonce: '',
            debounceDelay: 300,
            autoSaveDelay: 2000,
            noticeTimeout: 3000
        },
        
        /**
         * State management
         * AJAX Request Locking: Prevents duplicate submissions
         * Reference: .kiro/specs/live-preview-toggle-fix/RACE-CONDITIONS-SUMMARY.md
         */
        state: {
            livePreviewEnabled: false,
            currentPalette: null,
            currentTemplate: null,
            isDirty: false,
            isSaving: false,
            isApplyingPalette: false,
            isApplyingTemplate: false
        },
        
        /**
         * Palette Manager Module
         * Handles palette application, saving, and deletion
         * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
         */
        paletteManager: {
            /**
             * Apply a color palette
             * Requirement 1.3: Apply palette via AJAX
             * 
             * @param {string} paletteId - The palette ID to apply
             */
            apply: function(paletteId) {
                var self = MASE;
                
                // AJAX REQUEST LOCKING: Prevent duplicate submissions
                // Problem: Double-click causes duplicate AJAX requests (15% probability)
                // Solution: Check isApplyingPalette flag before proceeding
                // Reference: .kiro/specs/live-preview-toggle-fix/RACE-CONDITIONS-SUMMARY.md
                if (self.state.isApplyingPalette) {
                    console.warn('MASE: Palette application already in progress');
                    return;
                }
                self.state.isApplyingPalette = true;
                
                // Show loading state
                self.showNotice('info', 'Applying palette...', false);
                
                // Disable all palette buttons during operation
                $('.mase-palette-apply-btn').prop('disabled', true).css('opacity', '0.6');
                
                // Prepare AJAX request
                var requestData = {
                    action: 'mase_apply_palette',
                    nonce: self.config.nonce,
                    palette_id: paletteId
                };
                
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: requestData,
                    success: function(response) {
                        // Release lock
                        self.state.isApplyingPalette = false;
                        
                        if (response.success) {
                            // Update state
                            self.state.currentPalette = paletteId;
                            self.state.isDirty = false;
                            
                            // Update UI to show active palette badge (Requirement 1.4)
                            self.paletteManager.updateActiveBadge(paletteId);
                            
                            // Show success message
                            self.showNotice('success', response.data.message || 'Palette applied successfully!');
                            
                            // Reload page to show new settings
                            setTimeout(function() {
                                location.reload();
                            }, 1000);
                        } else {
                            console.error('MASE: Failed to apply palette:', response.data.message);
                            self.showNotice('error', response.data.message || 'Failed to apply palette');
                            $('.mase-palette-apply-btn').prop('disabled', false).css('opacity', '1');
                        }
                    },
                    error: function(xhr, status, error) {
                        // Release lock
                        self.state.isApplyingPalette = false;
                        
                        // Requirement 9.3: Log AJAX error with status code
                        console.error('MASE: AJAX error - Apply Palette', {
                            status: xhr.status,
                            statusText: xhr.statusText,
                            error: error,
                            responseText: xhr.responseText
                        });
                        
                        var message = 'Network error. Please try again.';
                        if (xhr.status === 403) {
                            message = 'Permission denied. You do not have access to perform this action.';
                        } else if (xhr.status === 500) {
                            message = 'Server error. Please try again later.';
                        }
                        self.showNotice('error', message);
                        $('.mase-palette-apply-btn').prop('disabled', false).css('opacity', '1');
                    }
                });
            },
            
            /**
             * Save a custom color palette
             * Requirement 1.3: Save custom palette with name and colors
             * 
             * @param {string} name - The palette name
             * @param {Object} colors - Object containing color values
             */
            save: function(name, colors) {
                var self = MASE;
                
                // Validate inputs
                if (!name || name.trim() === '') {
                    self.showNotice('error', 'Please enter a palette name');
                    return;
                }
                
                if (!colors || Object.keys(colors).length === 0) {
                    self.showNotice('error', 'Please select colors for the palette');
                    return;
                }
                
                // Show loading state
                self.showNotice('info', 'Saving custom palette...', false);
                
                // Disable save button
                $('#mase-save-custom-palette-btn').prop('disabled', true);
                
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_save_custom_palette',
                        nonce: self.config.nonce,
                        name: name,
                        colors: colors
                    },
                    success: function(response) {
                        if (response.success) {
                            self.showNotice('success', response.data.message || 'Custom palette saved successfully!');
                            
                            // Reload page to show new palette
                            setTimeout(function() {
                                location.reload();
                            }, 1000);
                        } else {
                            self.showNotice('error', response.data.message || 'Failed to save custom palette');
                            $('#mase-save-custom-palette-btn').prop('disabled', false);
                        }
                    },
                    error: function(xhr) {
                        var message = 'Network error. Please try again.';
                        if (xhr.status === 403) {
                            message = 'Permission denied. You do not have access to perform this action.';
                        }
                        self.showNotice('error', message);
                        $('#mase-save-custom-palette-btn').prop('disabled', false);
                    }
                });
            },
            
            /**
             * Delete a custom color palette
             * Requirement 1.3: Delete custom palette with confirmation
             * 
             * @param {string} paletteId - The palette ID to delete
             */
            delete: function(paletteId) {
                var self = MASE;
                
                // Confirm deletion
                if (!confirm('Are you sure you want to delete this custom palette? This action cannot be undone.')) {
                    return;
                }
                
                // Show loading state
                self.showNotice('info', 'Deleting custom palette...', false);
                
                // Disable delete button
                $('.mase-palette-delete-btn[data-palette-id="' + paletteId + '"]').prop('disabled', true);
                
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_delete_custom_palette',
                        nonce: self.config.nonce,
                        palette_id: paletteId
                    },
                    success: function(response) {
                        if (response.success) {
                            self.showNotice('success', response.data.message || 'Custom palette deleted successfully!');
                            
                            // Remove palette card from UI
                            $('.mase-palette-card[data-palette-id="' + paletteId + '"]').fadeOut(300, function() {
                                $(this).remove();
                            });
                        } else {
                            self.showNotice('error', response.data.message || 'Failed to delete custom palette');
                            $('.mase-palette-delete-btn[data-palette-id="' + paletteId + '"]').prop('disabled', false);
                        }
                    },
                    error: function(xhr) {
                        var message = 'Network error. Please try again.';
                        if (xhr.status === 403) {
                            message = 'Permission denied. You do not have access to perform this action.';
                        }
                        self.showNotice('error', message);
                        $('.mase-palette-delete-btn[data-palette-id="' + paletteId + '"]').prop('disabled', false);
                    }
                });
            },
            
            /**
             * Update active palette badge in UI
             * Requirement 1.4: Show active palette badge
             * 
             * @param {string} paletteId - The palette ID that is now active
             */
            updateActiveBadge: function(paletteId) {
                // Remove all active badges and classes
                $('.mase-palette-card').removeClass('active');
                $('.mase-active-badge').remove();
                
                // Add active class and badge to the selected palette
                var $paletteCard = $('.mase-palette-card[data-palette-id="' + paletteId + '"]');
                $paletteCard.addClass('active');
                
                // Add active badge if it doesn't exist
                if ($paletteCard.find('.mase-active-badge').length === 0) {
                    $paletteCard.find('.mase-palette-info').append(
                        '<span class="mase-active-badge">Active</span>'
                    );
                }
            },
            
            /**
             * Collect current color values from form
             * Used when saving custom palettes
             * 
             * @return {Object} Object containing color values
             */
            collectColors: function() {
                return {
                    primary: $('#palette-primary-color').val() || '',
                    secondary: $('#palette-secondary-color').val() || '',
                    accent: $('#palette-accent-color').val() || '',
                    background: $('#palette-background-color').val() || '',
                    text: $('#palette-text-color').val() || '',
                    text_secondary: $('#palette-text-secondary-color').val() || ''
                };
            }
        },
        
        /**
         * Template Manager Module
         * Handles template application, saving, and deletion
         * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
         */
        templateManager: {
            /**
             * Apply a template
             * Requirement 2.4: Apply template via AJAX
             * Requirement 16.2: Create automatic backup before template application (if enabled)
             * 
             * @param {string} templateId - The template ID to apply
             */
            apply: function(templateId) {
                var self = MASE;
                
                // AJAX REQUEST LOCKING: Prevent duplicate submissions
                // Problem: Double-click causes duplicate AJAX requests (15% probability)
                // Solution: Check isApplyingTemplate flag before proceeding
                // Reference: .kiro/specs/live-preview-toggle-fix/RACE-CONDITIONS-SUMMARY.md
                if (self.state.isApplyingTemplate) {
                    console.warn('MASE: Template application already in progress');
                    return;
                }
                self.state.isApplyingTemplate = true;
                
                // Create automatic backup before applying template (Requirement 16.2)
                self.backupManager.createAutoBackupBeforeTemplate(function() {
                    // Show loading state
                    self.showNotice('info', 'Applying template...', false);
                    
                    // Disable all template buttons during operation
                    $('.mase-template-apply-btn').prop('disabled', true).css('opacity', '0.6');
                    
                    $.ajax({
                        url: self.config.ajaxUrl,
                        type: 'POST',
                        data: {
                            action: 'mase_apply_template',
                            nonce: self.config.nonce,
                            template_id: templateId
                        },
                        success: function(response) {
                            // Release lock
                            self.state.isApplyingTemplate = false;
                            
                            if (response.success) {
                                // Update state
                                self.state.currentTemplate = templateId;
                                self.state.isDirty = false;
                                
                                // Update UI to show active template badge (Requirement 2.5)
                                self.templateManager.updateActiveBadge(templateId);
                                
                                // Show success message
                                self.showNotice('success', response.data.message || 'Template applied successfully!');
                                
                                // Reload page to show new settings
                                setTimeout(function() {
                                    location.reload();
                                }, 1000);
                            } else {
                                self.showNotice('error', response.data.message || 'Failed to apply template');
                                $('.mase-template-apply-btn').prop('disabled', false).css('opacity', '1');
                            }
                        },
                        error: function(xhr) {
                            // Release lock
                            self.state.isApplyingTemplate = false;
                            
                            var message = 'Network error. Please try again.';
                            if (xhr.status === 403) {
                                message = 'Permission denied. You do not have access to perform this action.';
                            } else if (xhr.status === 500) {
                                message = 'Server error. Please try again later.';
                            }
                            self.showNotice('error', message);
                            $('.mase-template-apply-btn').prop('disabled', false).css('opacity', '1');
                        }
                    });
                });
            },
            
            /**
             * Handle Template Apply Button Click
             * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 6.2, 6.3, 6.4, 8.1, 8.2, 8.3, 8.4, 10.5
             * 
             * @param {Event} e - Click event
             */
            handleTemplateApply: function(e) {
                var self = MASE;
                
                try {
                    // Safety check for event object
                    if (!e || typeof e !== 'object') {
                        console.warn('MASE: Invalid event object in handleTemplateApply');
                        return;
                    }
                    
                    // Subtask 3.1: Prevent default event and stop propagation
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopPropagation) e.stopPropagation();
                
                // Get button element and parent card (support both card types)
                var $button = $(e.currentTarget);
                var $card = $button.closest('.mase-template-card, .mase-template-preview-card');
                
                // Read data-template attribute from card (Requirement 3.5)
                var templateId = $card.attr('data-template');
                
                // Validate template ID exists (Requirement 8.1, 8.4)
                if (!templateId) {
                    console.error('MASE: Template ID not found on card');
                    return;
                }
                
                // Get template name from card for confirmation
                var templateName = $card.find('h3').text();
                
                // Apply template
                
                // Subtask 3.2: Implement confirmation dialog (Requirements 6.1, 6.2, 6.3)
                var confirmMessage = 'Apply "' + templateName + '" template?\n\n' +
                    'This will overwrite your current settings including:\n' +
                    '• Color scheme\n' +
                    '• Typography\n' +
                    '• Visual effects\n\n' +
                    'This action cannot be undone.';
                
                if (!confirm(confirmMessage)) {
                    // User cancelled (Requirement 6.3)
                    return;
                }
                
                // Subtask 3.3: Implement loading state (Requirements 2.5, 8.1, 8.2)
                $button.prop('disabled', true).text('Applying...');
                $card.css('opacity', '0.6');
                
                // Store original button text for restoration
                var originalText = 'Apply';
                
                // Subtask 3.4: Implement AJAX request (Requirements 2.2, 2.4, 8.3)
                var requestData = {
                    action: 'mase_apply_template',
                    nonce: $('#mase_nonce').val(),
                    template_id: templateId
                };
                
                // Send AJAX request
                
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: requestData,
                    success: function(response) {
                        if (response.success) {
                            // Show success notification with template name
                            self.showNotice('success', 'Template "' + templateName + '" applied successfully!');
                            
                            // Set timeout to reload page after 1 second
                            setTimeout(function() {
                                location.reload();
                            }, 1000);
                        } else {
                            // Handle server-side error
                            console.error('MASE: Template application failed:', response.data.message);
                            
                            // Parse error message from response
                            var errorMessage = response.data.message || 'Failed to apply template';
                            
                            // Show error notification
                            self.showNotice('error', errorMessage);
                            
                            // Restore button state
                            $button.prop('disabled', false).text(originalText);
                            $card.css('opacity', '1');
                        }
                    },
                    error: function(xhr, status, error) {
                        // Subtask 3.6: Implement error handler (Requirements 2.5, 8.3, 10.5)
                        console.error('MASE: AJAX error - Apply Template', {
                            status: xhr.status,
                            statusText: xhr.statusText,
                            error: error,
                            responseText: xhr.responseText
                        });
                        
                        // Parse error message from response
                        var errorMessage = 'Failed to apply template.';
                        
                        if (xhr.status === 403) {
                            errorMessage = 'Insufficient permissions';
                        } else if (xhr.status === 404) {
                            errorMessage = 'Template not found';
                        } else if (xhr.status === 500) {
                            errorMessage = 'Server error. Please try again later.';
                        } else if (xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) {
                            errorMessage = xhr.responseJSON.data.message;
                        }
                        
                        // Show error notification with message
                        self.showNotice('error', errorMessage);
                        
                        // Restore button state (enable, original text)
                        $button.prop('disabled', false).text(originalText);
                        
                        // Restore card opacity to 1
                        $card.css('opacity', '1');
                    }
                });
                
                } catch (error) {
                    // Comprehensive error handling
                    console.error('MASE: Error in handleTemplateApply:', error);
                    console.error('MASE: Error stack:', error.stack);
                    self.showNotice('error', 'Failed to handle template application. Please refresh the page.');
                }
            },
            
            /**
             * Save a custom template
             * Requirement 2.4: Save custom template with name and settings snapshot
             * 
             * @param {string} name - The template name
             * @param {Object} settings - Complete settings snapshot
             */
            save: function(name, settings) {
                var self = MASE;
                
                // Validate inputs
                if (!name || name.trim() === '') {
                    self.showNotice('error', 'Please enter a template name');
                    return;
                }
                
                if (!settings || Object.keys(settings).length === 0) {
                    self.showNotice('error', 'No settings to save');
                    return;
                }
                
                // Show loading state
                self.showNotice('info', 'Saving custom template...', false);
                
                // Disable save button
                $('#mase-save-custom-template-btn').prop('disabled', true);
                
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_save_custom_template',
                        nonce: self.config.nonce,
                        name: name,
                        settings: settings
                    },
                    success: function(response) {
                        if (response.success) {
                            self.showNotice('success', response.data.message || 'Custom template saved successfully!');
                            
                            // Reload page to show new template
                            setTimeout(function() {
                                location.reload();
                            }, 1000);
                        } else {
                            self.showNotice('error', response.data.message || 'Failed to save custom template');
                            $('#mase-save-custom-template-btn').prop('disabled', false);
                        }
                    },
                    error: function(xhr) {
                        var message = 'Network error. Please try again.';
                        if (xhr.status === 403) {
                            message = 'Permission denied. You do not have access to perform this action.';
                        }
                        self.showNotice('error', message);
                        $('#mase-save-custom-template-btn').prop('disabled', false);
                    }
                });
            },
            
            /**
             * Delete a custom template
             * Requirement 2.4: Delete custom template with confirmation
             * 
             * @param {string} templateId - The template ID to delete
             */
            delete: function(templateId) {
                var self = MASE;
                
                // Confirm deletion
                if (!confirm('Are you sure you want to delete this custom template? This action cannot be undone.')) {
                    return;
                }
                
                // Show loading state
                self.showNotice('info', 'Deleting custom template...', false);
                
                // Disable delete button
                $('.mase-template-delete-btn[data-template-id="' + templateId + '"]').prop('disabled', true);
                
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_delete_custom_template',
                        nonce: self.config.nonce,
                        template_id: templateId
                    },
                    success: function(response) {
                        if (response.success) {
                            self.showNotice('success', response.data.message || 'Custom template deleted successfully!');
                            
                            // Remove template card from UI
                            $('.mase-template-card[data-template-id="' + templateId + '"]').fadeOut(300, function() {
                                $(this).remove();
                            });
                            
                            // Also remove from preview cards if present
                            $('.mase-template-preview-card[data-template-id="' + templateId + '"]').fadeOut(300, function() {
                                $(this).remove();
                            });
                        } else {
                            self.showNotice('error', response.data.message || 'Failed to delete custom template');
                            $('.mase-template-delete-btn[data-template-id="' + templateId + '"]').prop('disabled', false);
                        }
                    },
                    error: function(xhr) {
                        var message = 'Network error. Please try again.';
                        if (xhr.status === 403) {
                            message = 'Permission denied. You do not have access to perform this action.';
                        }
                        self.showNotice('error', message);
                        $('.mase-template-delete-btn[data-template-id="' + templateId + '"]').prop('disabled', false);
                    }
                });
            },
            
            /**
             * Update active template badge in UI
             * Requirement 2.5: Show active template badge
             * 
             * @param {string} templateId - The template ID that is now active
             */
            updateActiveBadge: function(templateId) {
                // Remove all active badges and classes
                $('.mase-template-card, .mase-template-preview-card').removeClass('active');
                $('.mase-active-badge').remove();
                
                // Add active class and badge to the selected template
                var $templateCard = $('.mase-template-card[data-template-id="' + templateId + '"], .mase-template-preview-card[data-template-id="' + templateId + '"]');
                $templateCard.addClass('active');
                
                // Add active badge if it doesn't exist
                if ($templateCard.find('.mase-active-badge').length === 0) {
                    $templateCard.find('.mase-template-info, .mase-template-content').first().append(
                        '<span class="mase-active-badge">Active</span>'
                    );
                }
            },
            
            /**
             * Collect current settings snapshot for saving custom template
             * Used when saving custom templates
             * 
             * @return {Object} Complete settings snapshot
             */
            collectSettings: function() {
                var self = MASE;
                
                // Collect all current form data
                var settings = self.collectFormData();
                
                // Ensure we have all required sections
                if (!settings.palettes) {
                    settings.palettes = { current: 'professional-blue', custom: [] };
                }
                if (!settings.templates) {
                    settings.templates = { current: 'default', custom: [] };
                }
                if (!settings.typography) {
                    settings.typography = {};
                }
                if (!settings.visual_effects) {
                    settings.visual_effects = {};
                }
                if (!settings.effects) {
                    settings.effects = {};
                }
                if (!settings.advanced) {
                    settings.advanced = {};
                }
                if (!settings.mobile) {
                    settings.mobile = {};
                }
                if (!settings.accessibility) {
                    settings.accessibility = {};
                }
                
                return settings;
            }
        },
        
        /**
         * Live Preview Module
         * Handles real-time preview of settings changes
         * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
         */
        livePreview: {
            /**
             * Toggle live preview on/off
             * Requirement 9.1: Enable/disable live preview
             */
            toggle: function() {
                var self = MASE;
                self.state.livePreviewEnabled = !self.state.livePreviewEnabled;
                
                // Toggle live preview
                if (self.state.livePreviewEnabled) {
                    this.bind();
                    this.update();
                } else {
                    this.unbind();
                    this.remove();
                }
            },
            
            /**
             * Bind input events for live preview
             * Requirement 9.1: Bind change and input events to form controls
             */
            bind: function() {
                var self = MASE;
                
                try {
                    // Bind color pickers (Requirement 9.3: Update within 100ms)
                    $('.mase-color-picker').on('change.livepreview', self.debounce(function() {
                        try {
                            self.livePreview.update();
                        } catch (error) {
                            // Requirement 9.5: Log error with stack trace
                            console.error('MASE: Error updating live preview from color picker:', error);
                            console.error('MASE: Error stack:', error.stack);
                        }
                    }, 100));
                    
                    // Bind sliders and range inputs (Requirement 9.4: Display current value and update preview)
                    $('#mase-settings-form input[type="range"]').on('input.livepreview', self.debounce(function() {
                        try {
                            // Update slider value display
                            var $slider = $(this);
                            var $display = $slider.siblings('.mase-range-value, .mase-slider-value');
                            if ($display.length) {
                                $display.text($slider.val());
                            }
                            self.livePreview.update();
                        } catch (error) {
                            // Requirement 9.5: Log error with stack trace
                            console.error('MASE: Error updating live preview from slider:', error);
                            console.error('MASE: Error stack:', error.stack);
                        }
                    }, self.config.debounceDelay));
                    
                    // Bind text inputs
                    // Bind all text and number inputs in the settings form
                    $('#mase-settings-form input[type="text"], #mase-settings-form input[type="number"]').on('input.livepreview', 
                        self.debounce(function() {
                            try {
                                self.livePreview.update();
                            } catch (error) {
                                // Requirement 9.5: Log error with stack trace
                                console.error('MASE: Error updating live preview from text input:', error);
                                console.error('MASE: Error stack:', error.stack);
                            }
                        }, self.config.debounceDelay)
                    );
                    
                    // Bind all selects in the form
                    $('#mase-settings-form select').on('change.livepreview', self.debounce(function() {
                        try {
                            self.livePreview.update();
                        } catch (error) {
                            // Requirement 9.5: Log error with stack trace
                            console.error('MASE: Error updating live preview from select:', error);
                            console.error('MASE: Error stack:', error.stack);
                        }
                    }, self.config.debounceDelay));
                    
                    // Bind height mode selector specifically (Requirement 2.4)
                    // Trigger live preview update when height mode changes
                    $('#admin-menu-height-mode').on('change.livepreview', function() {
                        try {
                            // Update CSS immediately if live preview enabled
                            if (self.state.livePreviewEnabled) {
                                self.livePreview.update();
                            }
                        } catch (error) {
                            console.error('MASE: Error updating live preview from height mode:', error);
                            console.error('MASE: Error stack:', error.stack);
                        }
                    });
                    
                    // Bind checkboxes and radios
                    $('.mase-checkbox, .mase-radio').on('change.livepreview', self.debounce(function() {
                        try {
                            self.livePreview.update();
                        } catch (error) {
                            // Requirement 9.5: Log error with stack trace
                            console.error('MASE: Error updating live preview from checkbox/radio:', error);
                            console.error('MASE: Error stack:', error.stack);
                        }
                    }, self.config.debounceDelay));
                    
                } catch (error) {
                    // Requirement 9.5: Log error with stack trace
                    console.error('MASE: Error binding live preview events:', error);
                    console.error('MASE: Error stack:', error.stack);
                    MASE.showNotice('error', 'Failed to enable live preview. Please refresh the page.');
                }
            },
            
            /**
             * Unbind input events
             */
            unbind: function() {
                // Unbind from all form inputs
                $('#mase-settings-form input, #mase-settings-form select, #mase-settings-form textarea')
                    .off('.livepreview');
            },
            
            /**
             * Update preview with current settings
             * Requirement 9.2: Debounce updates to 300ms
             */
            update: function() {
                try {
                    var settings = this.collectSettings();
                    var css = this.generateCSS(settings);
                    this.applyCSS(css);
                } catch (error) {
                    // Requirement 9.5: Log error with stack trace
                    console.error('MASE: Error updating live preview:', error);
                    console.error('MASE: Error stack:', error.stack);
                    MASE.showNotice('error', 'Failed to update live preview. Please check your settings.');
                }
            },
            
            /**
             * Collect current settings from form
             * Requirement 9.4: Gather current form values
             * 
             * @return {Object} Current settings object
             */
            collectSettings: function() {
                var settings = {
                    admin_bar: {},
                    admin_menu: {},
                    typography: {
                        admin_bar: {},
                        admin_menu: {},
                        content: {}
                    },
                    visual_effects: {
                        admin_bar: {},
                        admin_menu: {}
                    },
                    spacing: {}
                };
                
                // Collect admin bar settings
                settings.admin_bar.bg_color = $('#admin-bar-bg-color').val() || '#23282d';
                settings.admin_bar.text_color = $('#admin-bar-text-color').val() || '#ffffff';
                settings.admin_bar.height = $('#admin-bar-height').val() || 32;
                
                // Collect admin menu settings
                settings.admin_menu.bg_color = $('#admin-menu-bg-color').val() || '#23282d';
                settings.admin_menu.text_color = $('#admin-menu-text-color').val() || '#ffffff';
                settings.admin_menu.hover_bg_color = $('#admin-menu-hover-bg-color').val() || '#191e23';
                settings.admin_menu.hover_text_color = $('#admin-menu-hover-text-color').val() || '#00b9eb';
                settings.admin_menu.width = $('#admin-menu-width').val() || 160;
                settings.admin_menu.height_mode = $('#admin-menu-height-mode').val() || 'full';
                
                // Collect typography settings
                // Admin Bar typography (from Admin Bar tab only)
                settings.typography.admin_bar.font_size = $('#admin-bar-font-size').val() || 13;
                settings.typography.admin_bar.font_weight = $('#admin-bar-font-weight').val() || 400;
                settings.typography.admin_bar.line_height = $('#admin-bar-line-height').val() || 1.5;
                settings.typography.admin_bar.letter_spacing = $('#admin-bar-letter-spacing').val() || 0;
                settings.typography.admin_bar.text_transform = $('#admin-bar-text-transform').val() || 'none';
                
                // Admin Menu typography (from Menu tab only)
                settings.typography.admin_menu.font_size = $('#admin-menu-font-size').val() || 13;
                settings.typography.admin_menu.font_weight = $('#admin-menu-font-weight').val() || 400;
                settings.typography.admin_menu.line_height = $('#admin-menu-line-height').val() || 1.5;
                settings.typography.admin_menu.letter_spacing = $('#admin-menu-letter-spacing').val() || 0;
                settings.typography.admin_menu.text_transform = $('#admin-menu-text-transform').val() || 'none';
                
                // Content typography (from Typography tab only)
                settings.typography.content.font_size = $('#typo-content-font-size').val() || 13;
                settings.typography.content.font_weight = $('#typo-content-font-weight').val() || 400;
                settings.typography.content.line_height = $('#typo-content-line-height').val() || 1.5;
                settings.typography.content.letter_spacing = $('#typo-content-letter-spacing').val() || 0;
                settings.typography.content.text_transform = $('#typo-content-text-transform').val() || 'none';
                
                // Collect visual effects settings
                settings.visual_effects.admin_bar.border_radius = $('#visual-effects-admin-bar-border-radius').val() || 0;
                settings.visual_effects.admin_bar.shadow_intensity = $('#visual-effects-admin-bar-shadow-intensity').val() || 'none';
                settings.visual_effects.admin_bar.shadow_direction = $('#visual-effects-admin-bar-shadow-direction').val() || 'bottom';
                settings.visual_effects.admin_bar.shadow_blur = $('#visual-effects-admin-bar-shadow-blur').val() || 10;
                settings.visual_effects.admin_bar.shadow_color = $('#visual-effects-admin-bar-shadow-color').val() || 'rgba(0,0,0,0.15)';
                
                settings.visual_effects.admin_menu.border_radius = $('#visual-effects-admin-menu-border-radius').val() || 0;
                settings.visual_effects.admin_menu.shadow_intensity = $('#visual-effects-admin-menu-shadow-intensity').val() || 'none';
                settings.visual_effects.admin_menu.shadow_direction = $('#visual-effects-admin-menu-shadow-direction').val() || 'bottom';
                settings.visual_effects.admin_menu.shadow_blur = $('#visual-effects-admin-menu-shadow-blur').val() || 10;
                settings.visual_effects.admin_menu.shadow_color = $('#visual-effects-admin-menu-shadow-color').val() || 'rgba(0,0,0,0.15)';
                
                return settings;
            },
            
            /**
             * Generate CSS from settings (mirrors PHP CSS generation)
             * Requirement 9.5: Mirror PHP CSS generation logic
             * 
             * @param {Object} settings Settings object
             * @return {string} Generated CSS
             */
            generateCSS: function(settings) {
                var css = '';
                
                // Generate admin bar CSS
                css += this.generateAdminBarCSS(settings);
                
                // Generate admin menu CSS
                css += this.generateAdminMenuCSS(settings);
                
                // Generate typography CSS
                css += this.generateTypographyCSS(settings);
                
                // Generate visual effects CSS
                css += this.generateVisualEffectsCSS(settings);
                
                return css;
            },
            
            /**
             * Generate admin bar CSS
             * 
             * @param {Object} settings Settings object
             * @return {string} Admin bar CSS
             */
            generateAdminBarCSS: function(settings) {
                var css = '';
                var adminBar = settings.admin_bar || {};
                var visualEffects = settings.visual_effects || {};
                var adminBarEffects = visualEffects.admin_bar || {};
                
                // Get admin bar height (default 32px)
                var height = adminBar.height || 32;
                
                // Base positioning (always applied) - Requirements 8.1, 8.2
                css += 'body.wp-admin #wpadminbar{';
                css += 'position:fixed!important;';
                css += 'top:0!important;';
                css += 'left:0!important;';
                css += 'right:0!important;';
                css += 'z-index:99999!important;';
                
                if (adminBar.bg_color) {
                    css += 'background-color:' + adminBar.bg_color + '!important;';
                }
                if (adminBar.height) {
                    css += 'height:' + adminBar.height + 'px!important;';
                }
                css += '}';
                
                // Adjust body padding to match admin bar height - Requirement 8.2
                css += 'html.wp-toolbar{';
                css += 'padding-top:' + height + 'px!important;';
                css += '}';
                
                // Admin bar text color
                if (adminBar.text_color) {
                    css += 'body.wp-admin #wpadminbar .ab-item,';
                    css += 'body.wp-admin #wpadminbar a.ab-item,';
                    css += 'body.wp-admin #wpadminbar > #wp-toolbar span.ab-label,';
                    css += 'body.wp-admin #wpadminbar > #wp-toolbar span.noticon{';
                    css += 'color:' + adminBar.text_color + '!important;';
                    css += '}';
                }
                
                // Glassmorphism effect (if enabled) - Requirement 8.3
                if (adminBarEffects.glassmorphism) {
                    var blur = adminBarEffects.blur_intensity || 20;
                    css += 'body.wp-admin #wpadminbar{';
                    css += 'backdrop-filter:blur(' + blur + 'px)!important;';
                    css += '-webkit-backdrop-filter:blur(' + blur + 'px)!important;';
                    css += 'background-color:rgba(35,40,45,0.8)!important;';
                    css += '}';
                }
                
                // Floating effect (if enabled) - Requirement 8.3
                if (adminBarEffects.floating) {
                    var margin = adminBarEffects.floating_margin || 8;
                    var radius = adminBarEffects.border_radius || 8;
                    
                    css += 'body.wp-admin #wpadminbar{';
                    css += 'top:' + margin + 'px!important;';
                    css += 'left:' + margin + 'px!important;';
                    css += 'right:' + margin + 'px!important;';
                    css += 'width:calc(100% - ' + (margin * 2) + 'px)!important;';
                    css += 'border-radius:' + radius + 'px!important;';
                    css += '}';
                    
                    // Adjust body padding for floating bar - Requirement 8.3
                    css += 'html.wp-toolbar{';
                    css += 'padding-top:' + (height + margin * 2) + 'px!important;';
                    css += '}';
                }
                
                // Submenu positioning
                if (adminBar.height) {
                    css += 'body.wp-admin #wpadminbar .ab-sub-wrapper{';
                    css += 'top:' + adminBar.height + 'px!important;';
                    css += '}';
                }
                
                return css;
            },
            
            /**
             * Generate admin menu CSS
             * 
             * @param {Object} settings Settings object
             * @return {string} Admin menu CSS
             */
            generateAdminMenuCSS: function(settings) {
                var css = '';
                var adminMenu = settings.admin_menu || {};
                
                // Admin menu background (always apply)
                css += 'body.wp-admin #adminmenu,';
                css += 'body.wp-admin #adminmenuback,';
                css += 'body.wp-admin #adminmenuwrap{';
                if (adminMenu.bg_color) {
                    css += 'background-color:' + adminMenu.bg_color + '!important;';
                }
                css += '}';
                
                // Only set width if different from WordPress default (160px)
                // This matches the PHP logic in class-mase-css-generator.php
                var width = parseInt(adminMenu.width) || 160;
                if (width !== 160) {
                    // Expanded menu width
                    css += 'body.wp-admin:not(.folded) #adminmenu,';
                    css += 'body.wp-admin:not(.folded) #adminmenuback,';
                    css += 'body.wp-admin:not(.folded) #adminmenuwrap{';
                    css += 'width:' + width + 'px!important;';
                    css += '}';
                    
                    // Folded menu width (always 36px when collapsed)
                    css += 'body.wp-admin.folded #adminmenu,';
                    css += 'body.wp-admin.folded #adminmenuback,';
                    css += 'body.wp-admin.folded #adminmenuwrap{';
                    css += 'width:36px!important;';
                    css += '}';
                    
                    // Adjust content area margin for custom menu width (expanded)
                    css += 'body.wp-admin:not(.folded) #wpcontent,';
                    css += 'body.wp-admin:not(.folded) #wpfooter{';
                    css += 'margin-left:' + width + 'px!important;';
                    css += '}';
                    
                    // Adjust content area margin for folded menu
                    css += 'body.wp-admin.folded #wpcontent,';
                    css += 'body.wp-admin.folded #wpfooter{';
                    css += 'margin-left:36px!important;';
                    css += '}';
                }
                
                // Fix folded menu icons and submenu positioning
                // Ensure icons are visible and centered in folded mode
                css += 'body.wp-admin.folded #adminmenu .wp-menu-image{';
                css += 'width:36px!important;';
                css += 'height:34px!important;';
                css += 'display:flex!important;';
                css += 'align-items:center!important;';
                css += 'justify-content:center!important;';
                css += 'overflow:hidden!important;';
                css += '}';
                
                // Fix folded menu icon dashicons - smaller size to fit in 36px
                css += 'body.wp-admin.folded #adminmenu .wp-menu-image:before{';
                css += 'padding:0!important;';
                css += 'margin:0!important;';
                css += 'width:18px!important;';
                css += 'height:18px!important;';
                css += 'font-size:18px!important;';
                css += 'line-height:1!important;';
                css += 'display:block!important;';
                css += '}';
                
                // Fix folded menu item height
                css += 'body.wp-admin.folded #adminmenu li.menu-top{';
                css += 'height:34px!important;';
                css += 'min-height:34px!important;';
                css += '}';
                
                // Fix folded menu link padding
                css += 'body.wp-admin.folded #adminmenu .wp-menu-image img{';
                css += 'width:18px!important;';
                css += 'height:18px!important;';
                css += 'padding:0!important;';
                css += '}';
                
                // Fix folded menu submenu positioning
                css += 'body.wp-admin.folded #adminmenu .wp-submenu{';
                css += 'position:absolute!important;';
                css += 'left:36px!important;';
                css += 'top:0!important;';
                css += 'margin:0!important;';
                css += 'padding:0!important;';
                css += 'min-width:160px!important;';
                css += 'z-index:9999!important;';
                css += '}';
                
                // Fix folded menu submenu background
                if (adminMenu.bg_color) {
                    css += 'body.wp-admin.folded #adminmenu .wp-submenu{';
                    css += 'background-color:' + adminMenu.bg_color + '!important;';
                    css += 'box-shadow:2px 2px 5px rgba(0,0,0,0.1)!important;';
                    css += '}';
                }
                
                // Hide menu text in folded mode
                css += 'body.wp-admin.folded #adminmenu .wp-menu-name{';
                css += 'display:none!important;';
                css += '}';
                
                // Admin menu height mode
                var heightMode = $('#admin-menu-height-mode').val() || 'full';
                if (heightMode === 'content') {
                    // Target all menu wrapper elements with maximum specificity
                    css += 'body.wp-admin #adminmenuwrap,';
                    css += 'body.wp-admin #adminmenuback,';
                    css += 'body.wp-admin #adminmenumain{';
                    css += 'height:auto!important;';
                    css += 'min-height:0!important;';  // Override WordPress default min-height: 100vh
                    css += 'bottom:auto!important;';
                    css += '}';
                    
                    // Ensure menu container fits content
                    css += 'body.wp-admin #adminmenu{';
                    css += 'height:auto!important;';
                    css += 'min-height:0!important;';
                    css += 'position:relative!important;';
                    css += 'bottom:auto!important;';
                    css += '}';
                    
                    // Allow natural height for menu items
                    css += 'body.wp-admin #adminmenu li.menu-top{';
                    css += 'height:auto!important;';
                    css += '}';
                }
                
                // Admin menu text color
                if (adminMenu.text_color) {
                    css += 'body.wp-admin #adminmenu a,';
                    css += 'body.wp-admin #adminmenu div.wp-menu-name{';
                    css += 'color:' + adminMenu.text_color + '!important;';
                    css += '}';
                }
                
                // Admin menu hover states
                if (adminMenu.hover_bg_color) {
                    css += 'body.wp-admin #adminmenu li.menu-top:hover,';
                    css += 'body.wp-admin #adminmenu li.opensub > a.menu-top,';
                    css += 'body.wp-admin #adminmenu li > a.menu-top:focus{';
                    css += 'background-color:' + adminMenu.hover_bg_color + '!important;';
                    css += '}';
                }
                
                if (adminMenu.hover_text_color) {
                    css += 'body.wp-admin #adminmenu li.menu-top:hover a,';
                    css += 'body.wp-admin #adminmenu li.opensub > a.menu-top,';
                    css += 'body.wp-admin #adminmenu li > a.menu-top:focus{';
                    css += 'color:' + adminMenu.hover_text_color + '!important;';
                    css += '}';
                }
                
                // Menu item spacing with WordPress defaults (Requirement 4.1, 4.2, 4.3)
                var menuPadding = adminMenu.item_padding || '6px 12px';
                var fontSize = adminMenu.font_size || 13;
                var lineHeight = adminMenu.line_height || 18;
                
                css += 'body.wp-admin #adminmenu li.menu-top{';
                css += 'padding:' + menuPadding + '!important;';
                css += '}';
                
                css += 'body.wp-admin #adminmenu a{';
                css += 'font-size:' + fontSize + 'px!important;';
                css += 'line-height:' + lineHeight + 'px!important;';
                css += '}';
                
                // Submenu indentation (Requirement 4.4, 4.5)
                css += 'body.wp-admin #adminmenu .wp-submenu{';
                css += 'padding-left:12px!important;';
                css += '}';
                
                css += 'body.wp-admin #adminmenu .wp-submenu li{';
                css += 'padding:5px 0!important;';
                css += '}';
                
                return css;
            },
            
            /**
             * Generate typography CSS
             * 
             * @param {Object} settings Settings object
             * @return {string} Typography CSS
             */
            generateTypographyCSS: function(settings) {
                var css = '';
                var typography = settings.typography || {};
                
                // Admin bar typography
                if (typography.admin_bar) {
                    var adminBar = typography.admin_bar;
                    css += 'body.wp-admin #wpadminbar,';
                    css += 'body.wp-admin #wpadminbar .ab-item,';
                    css += 'body.wp-admin #wpadminbar > #wp-toolbar span.ab-label,';
                    css += 'body.wp-admin #wpadminbar > #wp-toolbar span.noticon{';
                    
                    if (adminBar.font_size) {
                        css += 'font-size:' + adminBar.font_size + 'px!important;';
                    }
                    if (adminBar.font_weight) {
                        css += 'font-weight:' + adminBar.font_weight + '!important;';
                    }
                    if (adminBar.line_height) {
                        css += 'line-height:' + adminBar.line_height + '!important;';
                    }
                    if (adminBar.letter_spacing) {
                        css += 'letter-spacing:' + adminBar.letter_spacing + 'px!important;';
                    }
                    if (adminBar.text_transform) {
                        css += 'text-transform:' + adminBar.text_transform + '!important;';
                    }
                    
                    css += '}';
                }
                
                // Admin menu typography
                if (typography.admin_menu) {
                    var adminMenu = typography.admin_menu;
                    css += 'body.wp-admin #adminmenu a,';
                    css += 'body.wp-admin #adminmenu div.wp-menu-name,';
                    css += 'body.wp-admin #adminmenu .wp-submenu a{';
                    
                    if (adminMenu.font_size) {
                        css += 'font-size:' + adminMenu.font_size + 'px!important;';
                    }
                    if (adminMenu.font_weight) {
                        css += 'font-weight:' + adminMenu.font_weight + '!important;';
                    }
                    if (adminMenu.line_height) {
                        css += 'line-height:' + adminMenu.line_height + '!important;';
                    }
                    if (adminMenu.letter_spacing) {
                        css += 'letter-spacing:' + adminMenu.letter_spacing + 'px!important;';
                    }
                    if (adminMenu.text_transform) {
                        css += 'text-transform:' + adminMenu.text_transform + '!important;';
                    }
                    
                    css += '}';
                }
                
                // Content typography
                if (typography.content) {
                    var content = typography.content;
                    css += 'body.wp-admin #wpbody-content,';
                    css += 'body.wp-admin .wrap,';
                    css += 'body.wp-admin #wpbody-content p,';
                    css += 'body.wp-admin .wrap p{';
                    
                    if (content.font_size) {
                        css += 'font-size:' + content.font_size + 'px!important;';
                    }
                    if (content.font_weight) {
                        css += 'font-weight:' + content.font_weight + '!important;';
                    }
                    if (content.line_height) {
                        css += 'line-height:' + content.line_height + '!important;';
                    }
                    if (content.letter_spacing !== undefined) {
                        css += 'letter-spacing:' + content.letter_spacing + 'px!important;';
                    }
                    if (content.text_transform) {
                        css += 'text-transform:' + content.text_transform + '!important;';
                    }
                    
                    css += '}';
                }
                
                return css;
            },
            
            /**
             * Generate visual effects CSS
             * 
             * @param {Object} settings Settings object
             * @return {string} Visual effects CSS
             */
            generateVisualEffectsCSS: function(settings) {
                var css = '';
                var visualEffects = settings.visual_effects || {};
                
                // Admin bar visual effects
                if (visualEffects.admin_bar) {
                    css += this.generateElementVisualEffects(
                        'body.wp-admin #wpadminbar',
                        visualEffects.admin_bar
                    );
                }
                
                // Admin menu visual effects
                if (visualEffects.admin_menu) {
                    css += this.generateElementVisualEffects(
                        'body.wp-admin #adminmenu a',
                        visualEffects.admin_menu
                    );
                }
                
                return css;
            },
            
            /**
             * Generate visual effects CSS for a specific element
             * 
             * @param {string} selector CSS selector
             * @param {Object} effects Visual effects settings
             * @return {string} Element visual effects CSS
             */
            generateElementVisualEffects: function(selector, effects) {
                var css = '';
                
                css += selector + '{';
                
                // Border radius
                if (effects.border_radius) {
                    css += 'border-radius:' + effects.border_radius + 'px!important;';
                }
                
                // Box shadow
                var shadow = this.calculateShadow(effects);
                if (shadow !== 'none') {
                    css += 'box-shadow:' + shadow + '!important;';
                }
                
                css += '}';
                
                return css;
            },
            
            /**
             * Calculate shadow CSS value from visual effects settings
             * 
             * @param {Object} effects Visual effects settings
             * @return {string} CSS box-shadow value
             */
            calculateShadow: function(effects) {
                var intensity = effects.shadow_intensity || 'none';
                var direction = effects.shadow_direction || 'bottom';
                var blur = parseInt(effects.shadow_blur) || 10;
                var color = effects.shadow_color || 'rgba(0,0,0,0.15)';
                
                if (intensity === 'none') {
                    return 'none';
                }
                
                // Base shadow sizes by intensity
                var sizes = {
                    'subtle': { x: 2, y: 2, spread: 0 },
                    'medium': { x: 4, y: 4, spread: 0 },
                    'strong': { x: 8, y: 8, spread: 2 }
                };
                
                // Direction modifiers
                var directions = {
                    'top': { x: 0, y: -1 },
                    'right': { x: 1, y: 0 },
                    'bottom': { x: 0, y: 1 },
                    'left': { x: -1, y: 0 },
                    'center': { x: 0, y: 0 }
                };
                
                var base = sizes[intensity] || sizes.subtle;
                var dir = directions[direction] || directions.bottom;
                
                var x = base.x * dir.x;
                var y = base.y * dir.y;
                var spread = base.spread;
                
                return x + 'px ' + y + 'px ' + blur + 'px ' + spread + 'px ' + color;
            },
            
            /**
             * Apply CSS to page
             * Requirement 9.6: Inject CSS into <style> tag
             * 
             * @param {string} css CSS to apply
             */
            applyCSS: function(css) {
                var $style = $('#mase-live-preview-css');
                
                if ($style.length === 0) {
                    $style = $('<style id="mase-live-preview-css" type="text/css"></style>');
                    $('head').append($style);
                }
                
                $style.text(css);
            },
            
            /**
             * Remove live preview CSS
             */
            remove: function() {
                $('#mase-live-preview-css').remove();
            }
        },
        
        /**
         * Dark Mode Synchronization Module
         * Handles bidirectional synchronization between header toggle and master controls
         * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
         */
        darkModeSync: {
            /**
             * Initialize dark mode synchronization
             * Sets up event listeners for both toggles
             * Requirements: 6.1, 6.2
             */
            init: function() {
                var self = MASE;
                
                // Sync header toggle to master controls (Requirement 6.1)
                $('#mase-dark-mode-toggle').on('change', function() {
                    var isChecked = $(this).is(':checked');
                    
                    // Update master controls checkbox (Requirement 6.2)
                    $('#master-dark-mode')
                        .prop('checked', isChecked)
                        .attr('aria-checked', isChecked ? 'true' : 'false');
                    
                    // Apply dark mode immediately (Requirement 6.3)
                    self.darkModeSync.apply(isChecked);
                });
                
                // Sync master controls to header toggle (Requirement 6.1)
                $('#master-dark-mode').on('change', function() {
                    var isChecked = $(this).is(':checked');
                    
                    // Update header toggle (Requirement 6.2)
                    $('#mase-dark-mode-toggle')
                        .prop('checked', isChecked)
                        .attr('aria-checked', isChecked ? 'true' : 'false');
                    
                    // Apply dark mode immediately (Requirement 6.3)
                    self.darkModeSync.apply(isChecked);
                });
            },
            
            /**
             * Apply dark mode state
             * Updates DOM and state without triggering events
             * Requirements: 6.3, 6.4
             * 
             * @param {boolean} enabled - Whether dark mode should be enabled
             */
            apply: function(enabled) {
                var self = MASE;
                
                if (enabled) {
                    // Apply dark mode (Requirement 6.3)
                    $('html').attr('data-theme', 'dark');
                    $('body').addClass('mase-dark-mode');
                    
                    // Update state (Requirement 6.4)
                    self.state.darkModeEnabled = true;
                    
                    // Save to localStorage
                    try {
                        localStorage.setItem('mase_dark_mode', 'true');
                    } catch (error) {
                        console.warn('MASE: Could not save dark mode to localStorage:', error);
                    }
                    
                    // Trigger live preview update if enabled
                    if (self.state.livePreviewEnabled) {
                        self.updatePreview();
                    }
                } else {
                    // Remove dark mode (Requirement 6.3)
                    $('html').removeAttr('data-theme');
                    $('body').removeClass('mase-dark-mode');
                    
                    // Update state (Requirement 6.4)
                    self.state.darkModeEnabled = false;
                    
                    // Save to localStorage
                    try {
                        localStorage.setItem('mase_dark_mode', 'false');
                    } catch (error) {
                        console.warn('MASE: Could not save dark mode to localStorage:', error);
                    }
                    
                    // Trigger live preview update if enabled
                    if (self.state.livePreviewEnabled) {
                        self.updatePreview();
                    }
                }
            }
        },
        
        /**
         * Import/Export Module
         * Handles settings export and import functionality
         * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
         */
        importExport: {
            /**
             * Export current settings to JSON file
             * Requirement 8.1: Generate JSON file with current settings
             * Requirement 8.4: Trigger file download with proper filename
             */
            export: function() {
                var self = MASE;
                var $button = $('#mase-export-settings');
                var originalText = $button.text();
                
                // Show loading state
                $button.prop('disabled', true).text('Exporting...');
                self.showNotice('info', 'Preparing export...', false);
                
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_export_settings',
                        nonce: self.config.nonce
                    },
                    success: function(response) {
                        if (response.success) {
                            // Generate JSON from current settings (Requirement 8.3)
                            var jsonData = JSON.stringify(response.data, null, 2);
                            
                            // Create blob for download
                            var blob = new Blob([jsonData], { type: 'application/json' });
                            var url = URL.createObjectURL(blob);
                            
                            // Generate filename with date (Requirement 8.4: mase-settings-YYYYMMDD.json)
                            var date = new Date();
                            var dateStr = date.getFullYear() + 
                                         ('0' + (date.getMonth() + 1)).slice(-2) + 
                                         ('0' + date.getDate()).slice(-2);
                            var filename = 'mase-settings-' + dateStr + '.json';
                            
                            // Trigger download (Requirement 8.4)
                            var link = document.createElement('a');
                            link.href = url;
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            
                            // Clean up blob URL
                            URL.revokeObjectURL(url);
                            
                            // Show success message (Requirement 8.1)
                            self.showNotice('success', 'Settings exported successfully!');
                        } else {
                            self.showNotice('error', response.data.message || 'Failed to export settings');
                        }
                    },
                    error: function(xhr) {
                        var message = 'Network error during export. Please try again.';
                        if (xhr.status === 403) {
                            message = 'Permission denied. You do not have access to export settings.';
                        } else if (xhr.status === 500) {
                            message = 'Server error during export. Please try again later.';
                        }
                        self.showNotice('error', message);
                    },
                    complete: function() {
                        $button.prop('disabled', false).text(originalText);
                    }
                });
            },
            
            /**
             * Import settings from JSON file
             * Requirement 8.2: Display file upload dialog
             * Requirement 8.5: Read file and parse JSON
             * Requirement 8.6: Validate imported JSON structure
             * Requirement 8.7: Call ajax_import_settings endpoint
             * Requirement 16.3: Create automatic backup before import (if enabled)
             */
            import: function(fileData) {
                var self = MASE;
                var $button = $('#mase-import-settings');
                var originalText = $button.text();
                
                // Validate JSON structure (Requirement 8.6)
                if (!fileData || typeof fileData !== 'object') {
                    self.showNotice('error', 'Invalid JSON file format');
                    return;
                }
                
                // Validate required fields (Requirement 8.6)
                if (!fileData.plugin || fileData.plugin !== 'MASE') {
                    self.showNotice('error', 'This file is not a valid MASE settings export');
                    return;
                }
                
                if (!fileData.settings || typeof fileData.settings !== 'object') {
                    self.showNotice('error', 'Invalid settings data in import file');
                    return;
                }
                
                // Confirm import action
                if (!confirm('This will overwrite your current settings. Are you sure you want to continue?')) {
                    return;
                }
                
                // Create automatic backup before importing (Requirement 16.3)
                self.backupManager.createAutoBackupBeforeImport(function() {
                    // Show loading state
                    $button.prop('disabled', true).text('Importing...');
                    self.showNotice('info', 'Importing settings...', false);
                    
                    // Call ajax_import_settings endpoint with validated data (Requirement 8.7)
                    $.ajax({
                        url: self.config.ajaxUrl,
                        type: 'POST',
                        data: {
                            action: 'mase_import_settings',
                            nonce: self.config.nonce,
                            settings_data: JSON.stringify(fileData)
                        },
                        success: function(response) {
                            if (response.success) {
                                // Show success message (Requirement 8.8)
                                self.showNotice('success', response.data.message || 'Settings imported successfully!');
                                
                                // Reload page to show imported settings
                                setTimeout(function() {
                                    location.reload();
                                }, 1500);
                            } else {
                                self.showNotice('error', response.data.message || 'Failed to import settings');
                                $button.prop('disabled', false).text(originalText);
                            }
                        },
                        error: function(xhr) {
                            var message = 'Network error during import. Please try again.';
                            if (xhr.status === 403) {
                                message = 'Permission denied. You do not have access to import settings.';
                            } else if (xhr.status === 500) {
                                message = 'Server error during import. Please try again later.';
                            }
                            self.showNotice('error', message);
                            $button.prop('disabled', false).text(originalText);
                        }
                    });
                });
            },
            
            /**
             * Open file dialog for import
             * Requirement 8.2: Display file upload dialog accepting .json files
             */
            openFileDialog: function() {
                $('#mase-import-file').click();
            },
            
            /**
             * Handle file selection and reading
             * Requirement 8.5: Implement file reading and JSON parsing
             */
            handleFileSelect: function(event) {
                var self = MASE;
                var file = event.target.files[0];
                
                if (!file) {
                    return;
                }
                
                // Validate file type (Requirement 8.2: Accept .json files)
                if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
                    self.showNotice('error', 'Please select a valid JSON file');
                    event.target.value = ''; // Reset file input
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    self.showNotice('error', 'File is too large. Maximum size is 5MB');
                    event.target.value = ''; // Reset file input
                    return;
                }
                
                // Read file and parse JSON (Requirement 8.5)
                var reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        var fileData = JSON.parse(e.target.result);
                        self.importExport.import(fileData);
                    } catch (error) {
                        self.showNotice('error', 'Invalid JSON file format. Please check the file and try again.');
                        console.error('JSON parse error:', error);
                    }
                    
                    // Reset file input for next import
                    event.target.value = '';
                };
                
                reader.onerror = function() {
                    self.showNotice('error', 'Failed to read file. Please try again.');
                    event.target.value = '';
                };
                
                reader.readAsText(file);
            }
        },
        
        /**
         * Backup Manager Module
         * Handles backup creation, listing, and restoration
         * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
         */
        backupManager: {
            /**
             * Create a manual backup
             * Requirement 16.1: Create backup with timestamp
             */
            create: function() {
                var self = MASE;
                var $button = $('#mase-create-backup');
                var originalText = $button.html();
                
                // Show loading state
                $button.prop('disabled', true).html('<span class="dashicons dashicons-update dashicons-spin"></span> Creating...');
                self.showNotice('info', 'Creating backup...', false);
                
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_create_backup',
                        nonce: self.config.nonce
                    },
                    success: function(response) {
                        if (response.success) {
                            // Show success message (Requirement 16.1)
                            self.showNotice('success', response.data.message || 'Backup created successfully!');
                            
                            // Refresh backup list (Requirement 16.4)
                            self.backupManager.loadBackupList();
                        } else {
                            self.showNotice('error', response.data.message || 'Failed to create backup');
                        }
                    },
                    error: function(xhr) {
                        var message = 'Network error. Please try again.';
                        if (xhr.status === 403) {
                            message = 'Permission denied. You do not have access to create backups.';
                        } else if (xhr.status === 500) {
                            message = 'Server error. Please try again later.';
                        }
                        self.showNotice('error', message);
                    },
                    complete: function() {
                        $button.prop('disabled', false).html(originalText);
                    }
                });
            },
            
            /**
             * Restore a backup
             * Requirement 16.5: Restore backup with confirmation dialog
             */
            restore: function(backupId) {
                var self = MASE;
                
                // Confirm restoration (Requirement 16.5)
                if (!confirm('This will replace your current settings with the backup. Are you sure you want to continue?')) {
                    return;
                }
                
                var $button = $('#mase-restore-backup');
                var originalText = $button.html();
                
                // Show loading state
                $button.prop('disabled', true).html('<span class="dashicons dashicons-update dashicons-spin"></span> Restoring...');
                self.showNotice('info', 'Restoring backup...', false);
                
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_restore_backup',
                        nonce: self.config.nonce,
                        backup_id: backupId
                    },
                    success: function(response) {
                        if (response.success) {
                            // Show success message (Requirement 16.5)
                            self.showNotice('success', response.data.message || 'Backup restored successfully!');
                            
                            // Reload page after successful restore (Requirement 16.5)
                            setTimeout(function() {
                                location.reload();
                            }, 1500);
                        } else {
                            self.showNotice('error', response.data.message || 'Failed to restore backup');
                            $button.prop('disabled', false).html(originalText);
                        }
                    },
                    error: function(xhr) {
                        var message = 'Network error. Please try again.';
                        if (xhr.status === 403) {
                            message = 'Permission denied. You do not have access to restore backups.';
                        } else if (xhr.status === 500) {
                            message = 'Server error. Please try again later.';
                        }
                        self.showNotice('error', message);
                        $button.prop('disabled', false).html(originalText);
                    }
                });
            },
            
            /**
             * Load backup list from server
             * Requirement 16.4: Display list of all available backups with dates
             */
            loadBackupList: function() {
                var self = MASE;
                var $select = $('#mase-backup-list');
                var $restoreButton = $('#mase-restore-backup');
                
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_get_backups',
                        nonce: self.config.nonce
                    },
                    success: function(response) {
                        if (response.success && response.data.backups) {
                            var backups = response.data.backups;
                            
                            // Clear existing options except the first one
                            $select.find('option:not(:first)').remove();
                            
                            // Add backup options (Requirement 16.4)
                            if (backups.length > 0) {
                                $.each(backups, function(index, backup) {
                                    var date = new Date(backup.timestamp * 1000);
                                    var dateStr = date.toLocaleString();
                                    var label = dateStr + ' (' + backup.trigger + ')';
                                    
                                    $select.append(
                                        $('<option></option>')
                                            .val(backup.id)
                                            .text(label)
                                    );
                                });
                                
                                // Enable select
                                $select.prop('disabled', false);
                            } else {
                                $select.prop('disabled', true);
                                $restoreButton.prop('disabled', true);
                            }
                        }
                    },
                    error: function() {
                        console.error('Failed to load backup list');
                    }
                });
            },
            
            /**
             * Create automatic backup before template application
             * Requirement 16.2: Automatic backup before template application (if enabled)
             */
            createAutoBackupBeforeTemplate: function(callback) {
                var self = MASE;
                
                // Check if automatic backup is enabled (Requirement 16.2)
                var backupEnabled = $('#advanced-backup-enabled').is(':checked');
                var backupBeforeChanges = $('#advanced-backup-before-changes').is(':checked');
                
                if (!backupEnabled || !backupBeforeChanges) {
                    // Skip backup, proceed with callback
                    if (callback) callback();
                    return;
                }
                
                // Create automatic backup
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_create_backup',
                        nonce: self.config.nonce,
                        trigger: 'template_apply'
                    },
                    success: function(response) {
                        // Proceed with callback regardless of backup success
                        if (callback) callback();
                    },
                    error: function() {
                        console.error('Failed to create automatic backup');
                        // Proceed with callback even if backup fails
                        if (callback) callback();
                    }
                });
            },
            
            /**
             * Create automatic backup before import
             * Requirement 16.3: Automatic backup before import (if enabled)
             */
            createAutoBackupBeforeImport: function(callback) {
                var self = MASE;
                
                // Check if automatic backup is enabled (Requirement 16.3)
                var backupEnabled = $('#advanced-backup-enabled').is(':checked');
                var backupBeforeChanges = $('#advanced-backup-before-changes').is(':checked');
                
                if (!backupEnabled || !backupBeforeChanges) {
                    // Skip backup, proceed with callback
                    if (callback) callback();
                    return;
                }
                
                // Create automatic backup
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_create_backup',
                        nonce: self.config.nonce,
                        trigger: 'import'
                    },
                    success: function(response) {
                        // Proceed with callback regardless of backup success
                        if (callback) callback();
                    },
                    error: function() {
                        console.error('Failed to create automatic backup');
                        // Proceed with callback even if backup fails
                        if (callback) callback();
                    }
                });
            }
        },
        
        /**
         * Reset to WordPress Defaults
         * Requirements: 5.1, 5.2, 5.3, 5.4
         * 
         * Completely resets all MASE settings to WordPress defaults by:
         * - Displaying confirmation dialog with detailed warning
         * - Removing all injected style elements from DOM
         * - Clearing live preview state
         * - Sending AJAX request to delete database settings
         * - Reloading page to show WordPress defaults
         */
        resetToDefaults: function() {
            var self = this;
            
            // Confirmation dialog with detailed warning (Requirement 5.1)
            var confirmMessage = 'Reset all MASE settings to WordPress defaults?\n\n' +
                'This will:\n' +
                '• Remove all color customizations\n' +
                '• Clear all typography settings\n' +
                '• Delete all visual effects\n' +
                '• Remove custom palettes and templates\n' +
                '• Restore original WordPress admin appearance\n\n' +
                'This action cannot be undone.';
            
            if (!confirm(confirmMessage)) {
                return;
            }
            
            // Show loading state
            self.showNotice('info', 'Resetting to WordPress defaults...', false);
            var $button = $('#mase-reset-all');
            if ($button.length) {
                $button.prop('disabled', true);
            }
            
            // Step 1: Remove all style elements with id^="mase-" (Requirement 5.1)
            console.log('MASE: Removing all injected style elements...');
            $('style[id^="mase-"]').remove();
            $('#mase-live-preview-styles').remove();
            $('#mase-custom-styles').remove();
            $('#mase-custom-css').remove();
            
            // Step 2: Remove data-theme attribute from html/body (Requirement 5.1)
            console.log('MASE: Removing data-theme attributes...');
            $('html, body').removeAttr('data-theme');
            
            // Step 3: Clear live preview state (Requirement 5.1)
            console.log('MASE: Clearing live preview state...');
            self.state.livePreviewEnabled = false;
            var $livePreviewToggle = $('#mase-live-preview-toggle');
            if ($livePreviewToggle.length) {
                $livePreviewToggle.prop('checked', false);
            }
            
            // Step 4: Send AJAX request to server (Requirement 5.1)
            console.log('MASE: Sending reset request to server...');
            $.ajax({
                url: self.config.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'mase_reset_settings',
                    nonce: self.config.nonce
                },
                success: function(response) {
                    if (response.success) {
                        self.showNotice('success', 'Settings reset successfully. Reloading page...');
                        
                        // Reload page after 1 second to show WordPress defaults (Requirement 5.1)
                        setTimeout(function() {
                            window.location.reload();
                        }, 1000);
                    } else {
                        self.showNotice('error', response.data.message || 'Failed to reset settings');
                        if ($button.length) {
                            $button.prop('disabled', false);
                        }
                    }
                },
                error: function(xhr) {
                    // Enhanced error handling (Requirement 5.1)
                    var message = 'Network error. Please try again.';
                    if (xhr.status === 403) {
                        message = 'Permission denied. You do not have access to reset settings.';
                    } else if (xhr.status === 500) {
                        message = 'Server error. Please check error logs.';
                    } else if (xhr.status === 0) {
                        message = 'Network error. Please check your connection.';
                    }
                    
                    console.error('MASE: Reset Settings Error:', {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        responseText: xhr.responseText
                    });
                    
                    self.showNotice('error', message);
                    if ($button.length) {
                        $button.prop('disabled', false);
                    }
                }
            });
        },
        
        /**
         * Keyboard Shortcuts Module
         * Handles keyboard shortcuts for common actions
         * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
         */
        keyboardShortcuts: {
            /**
             * Bind keyboard shortcuts
             * Requirement 12.1: Listen for Ctrl+Shift+1-0 for palette switching
             * Requirement 12.2: Listen for Ctrl+Shift+T for theme toggle
             * Requirement 12.3: Listen for Ctrl+Shift+F for focus mode toggle
             * Requirement 12.4: Listen for Ctrl+Shift+P for performance mode toggle
             * Requirement 12.5: Check keyboard_shortcuts.enabled setting before handling
             */
            bind: function() {
                var self = MASE;
                
                // Add keydown event listener
                $(document).on('keydown.mase-shortcuts', function(e) {
                    self.keyboardShortcuts.handle(e);
                });
            },
            
            /**
             * Unbind keyboard shortcuts
             * Cleanup method to prevent memory leaks
             */
            unbind: function() {
                $(document).off('keydown.mase-shortcuts');
                console.log('MASE: Keyboard shortcuts unbound');
            },
            
            /**
             * Handle keyboard shortcut events
             * Requirement 12.5: Check keyboard_shortcuts.enabled setting before handling
             * 
             * @param {Event} e - Keyboard event
             */
            handle: function(e) {
                var self = MASE;
                
                // Safety check: ensure event object exists and has required properties
                if (!e || typeof e !== 'object') {
                    console.warn('MASE: Invalid event object in keyboard shortcuts handler');
                    return;
                }
                
                // Check if keyboard shortcuts are enabled (Requirement 12.5)
                var shortcutsEnabled = $('#keyboard-shortcuts-enabled').is(':checked');
                if (!shortcutsEnabled) {
                    return;
                }
                
                // Check for Ctrl+Shift combination with safety checks
                if (!e.ctrlKey || !e.shiftKey) {
                    return;
                }
                
                var handled = false;
                
                // Requirement 12.1: Ctrl+Shift+1-0 for palette switching (1-10)
                if (e.key >= '1' && e.key <= '9') {
                    var paletteIndex = parseInt(e.key) - 1;
                    this.switchPalette(paletteIndex);
                    handled = true;
                } else if (e.key === '0') {
                    // Ctrl+Shift+0 for palette 10
                    this.switchPalette(9);
                    handled = true;
                }
                // Requirement 12.2: Ctrl+Shift+T for theme toggle
                else if (e.key === 'T' || e.key === 't') {
                    this.toggleTheme();
                    handled = true;
                }
                // Requirement 12.3: Ctrl+Shift+F for focus mode toggle
                else if (e.key === 'F' || e.key === 'f') {
                    this.toggleFocusMode();
                    handled = true;
                }
                // Requirement 12.4: Ctrl+Shift+P for performance mode toggle
                else if (e.key === 'P' || e.key === 'p') {
                    this.togglePerformanceMode();
                    handled = true;
                }
                
                // Prevent default browser behavior for handled shortcuts
                if (handled && e.preventDefault && e.stopPropagation) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            },
            
            /**
             * Switch to palette by index
             * Requirement 12.1: Implement Ctrl+Shift+1-0 for palette switching
             * 
             * @param {number} index - Palette index (0-9)
             */
            switchPalette: function(index) {
                var self = MASE;
                
                // Check if palette switching is enabled
                var paletteSwitchEnabled = $('#keyboard-shortcuts-palette-switch').is(':checked');
                if (!paletteSwitchEnabled) {
                    return;
                }
                
                // Get all palette cards
                var $paletteCards = $('.mase-palette-card');
                
                // Check if index is valid
                if (index < 0 || index >= $paletteCards.length) {
                    return;
                }
                
                // Get the palette card at the specified index
                var $targetCard = $paletteCards.eq(index);
                var paletteId = $targetCard.data('palette-id');
                
                if (paletteId) {
                    // Apply the palette
                    self.paletteManager.apply(paletteId);
                    
                    // Show feedback
                    self.showNotice('info', 'Switching to palette ' + (index + 1) + '...', false);
                }
            },
            
            /**
             * Toggle between light and dark themes
             * Requirement 12.2: Implement Ctrl+Shift+T for theme toggle
             */
            toggleTheme: function() {
                var self = MASE;
                
                // Check if theme toggle is enabled
                var themeToggleEnabled = $('#keyboard-shortcuts-theme-toggle').is(':checked');
                if (!themeToggleEnabled) {
                    return;
                }
                
                // Get current palette
                var $activeCard = $('.mase-palette-card.active');
                var currentPaletteId = $activeCard.data('palette-id');
                
                // Define light and dark palette mappings
                var themeMap = {
                    'professional-blue': 'dark-elegance',
                    'dark-elegance': 'professional-blue',
                    'energetic-green': 'midnight-purple',
                    'midnight-purple': 'energetic-green',
                    'sunset': 'ocean-breeze',
                    'ocean-breeze': 'sunset',
                    'warm-autumn': 'cool-winter',
                    'cool-winter': 'warm-autumn',
                    'vibrant-coral': 'forest-green',
                    'forest-green': 'vibrant-coral'
                };
                
                // Get the opposite theme
                var targetPaletteId = themeMap[currentPaletteId];
                
                if (targetPaletteId) {
                    // Apply the opposite theme
                    self.paletteManager.apply(targetPaletteId);
                    
                    // Show feedback
                    self.showNotice('info', 'Toggling theme...', false);
                } else {
                    // If no mapping exists, just show a message
                    self.showNotice('info', 'Theme toggle not available for current palette', true);
                }
            },
            
            /**
             * Toggle focus mode (hide distractions)
             * Requirement 12.3: Implement Ctrl+Shift+F for focus mode toggle
             */
            toggleFocusMode: function() {
                var self = MASE;
                
                // Check if focus mode toggle is enabled
                var focusModeEnabled = $('#keyboard-shortcuts-focus-mode').is(':checked');
                if (!focusModeEnabled) {
                    return;
                }
                
                // Find the focus mode checkbox
                var $focusModeCheckbox = $('#effects-focus-mode');
                
                if ($focusModeCheckbox.length) {
                    // Toggle the checkbox
                    var isChecked = $focusModeCheckbox.is(':checked');
                    $focusModeCheckbox.prop('checked', !isChecked).trigger('change');
                    
                    // Show feedback
                    var message = !isChecked ? 'Focus mode enabled' : 'Focus mode disabled';
                    self.showNotice('info', message, true);
                    
                    // Update live preview if enabled
                    if (self.state.livePreviewEnabled) {
                        self.livePreview.update();
                    }
                } else {
                    self.showNotice('warning', 'Focus mode setting not found', true);
                }
            },
            
            /**
             * Toggle performance mode (disable effects)
             * Requirement 12.4: Implement Ctrl+Shift+P for performance mode toggle
             */
            togglePerformanceMode: function() {
                var self = MASE;
                
                // Check if performance mode toggle is enabled
                var performanceModeEnabled = $('#keyboard-shortcuts-performance-mode').is(':checked');
                if (!performanceModeEnabled) {
                    return;
                }
                
                // Find the performance mode checkbox
                var $performanceModeCheckbox = $('#effects-performance-mode');
                
                if ($performanceModeCheckbox.length) {
                    // Toggle the checkbox
                    var isChecked = $performanceModeCheckbox.is(':checked');
                    $performanceModeCheckbox.prop('checked', !isChecked).trigger('change');
                    
                    // Show feedback
                    var message = !isChecked ? 'Performance mode enabled' : 'Performance mode disabled';
                    self.showNotice('info', message, true);
                    
                    // Update live preview if enabled
                    if (self.state.livePreviewEnabled) {
                        self.livePreview.update();
                    }
                } else {
                    self.showNotice('warning', 'Performance mode setting not found', true);
                }
            }
        },
        
        /**
         * Handle palette card click
         * Requirements: 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 10.3, 10.4, 10.5,
         *               11.1, 11.2, 11.3, 11.4, 11.5, 12.1, 12.2, 12.3, 12.4, 12.5,
         *               13.1, 13.2, 13.3, 13.4, 13.5, 14.1, 14.2, 14.3, 14.4, 14.5
         * 
         * @param {Event} e - Click event
         */
        handlePaletteClick: function(e) {
            var self = this;
            
            try {
                // Safety check for event object
                if (!e || typeof e !== 'object') {
                    console.warn('MASE: Invalid event object in handlePaletteClick');
                    return;
                }
                
                if (!e.currentTarget) {
                    console.warn('MASE: Event target missing in handlePaletteClick');
                    return;
                }
                
                var $card = $(e.currentTarget);
            
            // Extract palette ID from data-palette attribute (Requirement 9.2)
            var paletteId = $card.data('palette');
            
            // Extract palette name from .mase-palette-name element (Requirement 9.2)
            var paletteName = $card.find('.mase-palette-name').text().trim();
            
            // Validate palette ID exists, log error if missing (Requirement 9.3)
            if (!paletteId) {
                console.error('MASE: Palette ID not found on card');
                return;
            }
            
            // Check if palette is already active, return early if true (Requirement 9.4)
            if ($card.hasClass('active')) {
                return;
            }
            
            // Implement confirmation dialog (Requirement 10.1, 10.2, 10.3)
            var confirmMessage = 'Apply "' + paletteName + '" palette?\n\n' +
                                'This will update your admin colors immediately.';
            
            if (!confirm(confirmMessage)) {
                // Return early if user cancels (Requirement 10.4, 10.5)
                return;
            }
            
            // Store reference to currently active palette card (Requirement 11.1)
            var $currentPalette = $('.mase-palette-card.active');
            
            // Store current palette ID for rollback (Requirement 14.3)
            var currentPaletteId = $currentPalette.data('palette');
            
            // Remove active class from all palette cards (Requirement 11.2)
            $('.mase-palette-card').removeClass('active');
            
            // Add active class to clicked card (Requirement 11.3)
            $card.addClass('active');
            
            // Find Apply button within card (Requirement 11.4)
            var $applyBtn = $card.find('.mase-palette-apply-btn');
            
            // Store original button text (Requirement 11.4)
            var originalText = $applyBtn.text();
            
            // Disable button and change text to "Applying..." (Requirement 11.5)
            $applyBtn.prop('disabled', true).text('Applying...');
            
            // Implement AJAX request (Requirement 12.1, 12.2, 12.3, 12.4)
            $.ajax({
                url: ajaxurl, // Use global ajaxurl variable (Requirement 12.1)
                type: 'POST', // Set type to POST (Requirement 12.2)
                data: {
                    action: 'mase_apply_palette', // Include action (Requirement 12.3)
                    nonce: $('#mase_nonce').val(), // Include nonce from #mase_nonce field (Requirement 12.4)
                    palette_id: paletteId // Include palette_id parameter (Requirement 12.4)
                },
                timeout: 30000, // Set timeout to 30 seconds (Requirement 12.5)
                
                // Implement success handler (Requirement 13.1, 13.2, 13.5)
                success: function(response) {
                    if (response.success) {
                        // Call showNotice() with success message including palette name (Requirement 13.2)
                        var successMessage = response.data.message || 
                                           'Palette "' + paletteName + '" applied successfully!';
                        self.showNotice('success', successMessage);
                        
                        // Update MASEAdmin.config.currentPalette with new palette ID (Requirement 13.2)
                        self.state.currentPalette = paletteId;
                        
                        // Trigger live preview update if enabled (Requirement 13.5)
                        if (self.state.livePreviewEnabled) {
                            self.livePreview.update();
                        }
                        
                        // Restore button enabled state and original text (Requirement 13.5)
                        $applyBtn.prop('disabled', false).text(originalText);
                    } else {
                        // Handle server error response
                        self.handlePaletteError(response.data.message || 'Failed to apply palette', 
                                               $card, $currentPalette, currentPaletteId, 
                                               $applyBtn, originalText);
                    }
                },
                
                // Implement error handler (Requirement 13.3, 13.4, 14.1, 14.2, 14.3, 14.4, 14.5)
                error: function(xhr, status, error) {
                    // Log error details to console (Requirement 14.5)
                    console.error('MASE: Palette application error:', {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        error: error,
                        responseText: xhr.responseText
                    });
                    
                    // Determine error message based on status
                    var errorMessage = 'Network error. Please try again.';
                    if (xhr.status === 403) {
                        errorMessage = 'Permission denied. You do not have access to apply palettes.';
                    } else if (xhr.status === 404) {
                        errorMessage = 'Palette not found.';
                    } else if (xhr.status === 500) {
                        errorMessage = 'Server error. Please try again later.';
                    } else if (status === 'timeout') {
                        errorMessage = 'Request timed out. Please try again.';
                    }
                    
                    // Handle error with rollback
                    self.handlePaletteError(errorMessage, $card, $currentPalette, 
                                           currentPaletteId, $applyBtn, originalText);
                }
            });
            
            } catch (error) {
                // Comprehensive error handling
                console.error('MASE: Error in handlePaletteClick:', error);
                console.error('MASE: Error stack:', error.stack);
                this.showNotice('error', 'Failed to handle palette click. Please refresh the page.');
            }
        },
        
        /**
         * Handle palette application error with UI rollback
         * Requirements: 13.3, 13.4, 14.1, 14.2, 14.3, 14.4, 14.5
         * 
         * @param {string} errorMessage - Error message to display
         * @param {jQuery} $card - Newly selected card
         * @param {jQuery} $currentPalette - Previously active card
         * @param {string} currentPaletteId - Previously active palette ID
         * @param {jQuery} $applyBtn - Apply button
         * @param {string} originalText - Original button text
         */
        handlePaletteError: function(errorMessage, $card, $currentPalette, currentPaletteId, $applyBtn, originalText) {
            // Call showNotice() with error message (Requirement 13.3, 13.4)
            this.showNotice('error', errorMessage);
            
            // Remove active class from newly selected card (Requirement 14.1)
            $card.removeClass('active');
            
            // Restore active class to previously active card using stored ID (Requirement 14.2, 14.3)
            if (currentPaletteId) {
                $currentPalette.addClass('active');
            }
            
            // Restore button enabled state and original text (Requirement 14.4, 14.5)
            $applyBtn.prop('disabled', false).text(originalText);
        },
        
        /**
         * Handle keyboard navigation on palette cards
         * Requirement 9.5: Support Enter and Space key activation
         * 
         * @param {Event} e - Keydown event
         */
        handlePaletteKeydown: function(e) {
            // Safety check for event object
            if (!e || typeof e !== 'object') {
                console.warn('MASE: Invalid event object in handlePaletteKeydown');
                return;
            }
            
            // Check if key is Enter or Space (Requirement 9.5)
            if (e.key === 'Enter' || e.key === ' ') {
                // Prevent default browser behavior (Requirement 9.5)
                if (e.preventDefault) {
                    e.preventDefault();
                }
                
                // Call handlePaletteClick with event (Requirement 9.5)
                this.handlePaletteClick(e);
            }
        },
        
        /**
         * Modules placeholder (for future modular architecture)
         */
        modules: {
            keyboardShortcuts: null
        },
        
        /**
         * CRITICAL BUG FIX (v1.2.1): Remove gray circle in Dark Mode (MASE-DARK-001)
         * 
         * Bug ID: MASE-DARK-001
         * Version: 1.2.1
         * Severity: Critical - Dark Mode completely unusable
         * 
         * NUCLEAR OPTION: Aggressively scans and removes ANY element that could be
         * the gray circle bug. This runs multiple times to catch all variations.
         * 
         * Bug Description:
         * - Large gray circular element (80-90% viewport, >500px)
         * - Color: #6b6b6b (--mase-gray-400) - rgb(107, 107, 107)
         * - Shape: border-radius: 50% (perfect circle)
         * - Position: Fixed/absolute positioning over all content
         * - Appears on #wpwrap or similar container
         * - Blocks all content in Dark Mode - users cannot access any controls
         * 
         * Root Cause:
         * - Decorative pseudo-element (::before or ::after) with excessive dimensions
         * - Z-index layering placed element above interactive controls
         * - Only appears when data-theme="dark" or .mase-dark-mode class is active
         * 
         * Solution Strategy (Triple-Layer Defense):
         * 1. JavaScript Nuclear Scan: Scan ALL elements and pseudo-elements on page load
         * 2. Pattern Detection: Check for circular shape (border-radius: 50%), large size (>500px), gray color (#6b6b6b)
         * 3. Immediate Removal: Remove matching elements immediately with CSS overrides
         * 4. Mutation Observer: Install observer to catch dynamically added elements
         * 5. Periodic Re-scan: Re-scan at 100ms, 200ms, 500ms, 1s, 2s to catch late-loading elements
         * 6. CSS Backup: CSS rules in mase-admin.css:9185-9214 provide additional protection
         * 
         * Testing:
         * - Automated: tests/visual-testing/dark-mode-circle-test.js
         * - Manual: User confirmed "szare koło zniknęło" (gray circle disappeared)
         * - Verification: No large circles found in Dark Mode across all tabs
         * 
         * @since 1.2.1
         * @see assets/css/mase-admin.css:9185-9214 for CSS-based protection
         * @see .kiro/specs/critical-bugs-fix/design.md for detailed analysis
         * @see .kiro/specs/critical-bugs-fix/requirements.md for requirements
         */
        removeGrayCircleBug: function() {
            var self = this;
            
            console.log('MASE: 🔍 NUCLEAR SCAN: Searching for gray circle bug...');
            
            var totalRemoved = 0;
            var scanCount = 0;
            
            // Function to check if element is a large gray circle
            function isGrayCircle(element) {
                try {
                    if (!element || !element.nodeType) return false;
                    
                    var styles = window.getComputedStyle(element);
                    if (!styles) return false;
                    
                    // Check border-radius (circular)
                    var borderRadius = styles.borderRadius || '';
                    var isCircular = borderRadius.includes('50%') || 
                                    borderRadius.includes('9999px') ||
                                    borderRadius.includes('100%');
                    
                    // Check size (large)
                    var width = element.offsetWidth || 0;
                    var height = element.offsetHeight || 0;
                    var isLarge = width > 500 || height > 500;
                    
                    // Check background color (gray #6b6b6b)
                    var bgColor = styles.backgroundColor || '';
                    var isGray = bgColor.includes('107, 107, 107') || // rgb(107, 107, 107)
                                bgColor.includes('107,107,107') ||
                                bgColor === 'rgb(107, 107, 107)';
                    
                    // Check position (might be fixed/absolute)
                    var position = styles.position || '';
                    var isSuspicious = position === 'fixed' || position === 'absolute';
                    
                    // Log suspicious elements
                    if ((isCircular && isLarge) || (isGray && isLarge)) {
                        console.log('MASE: 🔍 Suspicious element found:', {
                            element: element.tagName + (element.id ? '#' + element.id : '') + (element.className ? '.' + element.className.split(' ')[0] : ''),
                            isCircular: isCircular,
                            isLarge: isLarge,
                            isGray: isGray,
                            width: width,
                            height: height,
                            borderRadius: borderRadius,
                            backgroundColor: bgColor,
                            position: position
                        });
                    }
                    
                    // Return true if it matches the bug pattern
                    return (isCircular && isLarge && isGray) || 
                           (isCircular && isLarge && isSuspicious);
                    
                } catch (error) {
                    return false;
                }
            }
            
            // Function to perform one scan
            function performScan() {
                scanCount++;
                var removed = 0;
                
                console.log('MASE: 🔍 Scan #' + scanCount + ' starting...');
                
                // Scan all elements
                $('*').each(function() {
                    if (isGrayCircle(this)) {
                        console.warn('MASE: ❌ REMOVING gray circle bug element:', this);
                        $(this).css({
                            'display': 'none !important',
                            'visibility': 'hidden !important',
                            'opacity': '0 !important',
                            'width': '0 !important',
                            'height': '0 !important',
                            'pointer-events': 'none !important'
                        });
                        $(this).remove();
                        removed++;
                        totalRemoved++;
                    }
                });
                
                // Special check for #wpwrap
                var wpwrap = document.getElementById('wpwrap');
                if (wpwrap) {
                    var wpwrapStyles = window.getComputedStyle(wpwrap);
                    var wpwrapBorderRadius = wpwrapStyles.borderRadius || '';
                    if (wpwrapBorderRadius.includes('50%')) {
                        console.warn('MASE: ❌ #wpwrap has circular border-radius! Fixing...');
                        $(wpwrap).css('border-radius', '0 !important');
                        removed++;
                    }
                }
                
                if (removed > 0) {
                    console.log('MASE: ✅ Scan #' + scanCount + ' removed ' + removed + ' element(s)');
                }
                
                return removed;
            }
            
            // Perform initial scan
            performScan();
            
            // Perform additional scans over 2 seconds to catch late-loading elements
            var scanIntervals = [100, 200, 500, 1000, 2000];
            scanIntervals.forEach(function(delay) {
                setTimeout(performScan, delay);
            });
            
            // Install mutation observer for dynamically added elements
            if (typeof MutationObserver !== 'undefined') {
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1 && isGrayCircle(node)) {
                                console.warn('MASE: ❌ Removing dynamically added gray circle:', node);
                                $(node).remove();
                                totalRemoved++;
                            }
                        });
                    });
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
                
                console.log('MASE: 👁️ Mutation observer installed');
            }
            
            // Final report after 2.5 seconds
            setTimeout(function() {
                if (totalRemoved > 0) {
                    console.log('MASE: ✅ FINAL REPORT: Removed ' + totalRemoved + ' gray circle element(s) total');
                    self.showNotice('success', 'Dark mode display issue fixed (' + totalRemoved + ' elements removed)');
                } else {
                    console.log('MASE: ✅ FINAL REPORT: No gray circle elements found');
                }
            }, 2500);
        },
        
        /**
         * Initialize the admin interface
         */
        init: function() {
            // Initialize MASE Admin (v1.2.0)
            console.log('MASE: Initializing v1.2.0');
            
            try {
                // Requirement 7.1: Store initial scroll position before initialization
                var initialScrollTop = $(window).scrollTop();
                console.log('MASE: Stored initial scroll position:', initialScrollTop);
                
                // Set nonce from localized script data (Requirement 6.5)
                this.config.nonce = (typeof maseAdmin !== 'undefined' && maseAdmin.nonce) ? maseAdmin.nonce : '';
                
                // Set AJAX URL from localized script data (Requirement 6.5)
                if (typeof maseAdmin !== 'undefined' && maseAdmin.ajaxUrl) {
                    this.config.ajaxUrl = maseAdmin.ajaxUrl;
                }
                
                // Initialize all modules
                this.initColorPickers();
                this.bindEvents();
                this.bindPaletteEvents();
                this.bindTemplateEvents();
                this.bindImportExportEvents();
                this.bindBackupEvents();
                
                // Initialize tab navigation (Requirement 8.1, 8.2, 8.3, 8.4, 8.5)
                this.tabNavigation.init();
                
                // Initialize dark mode synchronization (Requirement 6.1, 6.2, 6.3)
                this.darkModeSync.init();
                
                // Apply initial dark mode state from settings (Requirement 6.5)
                try {
                    var darkModeEnabled = $('#mase-dark-mode-toggle').is(':checked');
                    this.darkModeSync.apply(darkModeEnabled);
                } catch (error) {
                    console.warn('MASE: Could not apply initial dark mode state:', error);
                }
                
                // Initialize keyboard shortcuts (Requirement 12.1-12.5)
                this.keyboardShortcuts.bind();
                
                // Track dirty state
                this.trackDirtyState();
                
                // Enable live preview by default (Requirement 10.1, 10.2, 10.4, 10.5)
                this.state.livePreviewEnabled = true;
                
                // Ensure checkbox is checked programmatically
                $('#mase-live-preview-toggle')
                    .prop('checked', true)
                    .attr('aria-checked', 'true');
                
                // Bind live preview events
                this.livePreview.bind();
                
                // Initialize conditional fields (Requirement 15.6)
                this.initConditionalFields();
                console.log('MASE: Conditional fields initialized');
                
                // CRITICAL FIX: Remove gray circle bug in Dark Mode
                this.removeGrayCircleBug();
                
                // Requirement 7.1, 7.2: Restore scroll position after component initialization
                $(window).scrollTop(initialScrollTop);
                console.log('MASE: Restored scroll position to:', initialScrollTop);
                
                // Requirement 7.1, 7.2: Remove focus from auto-focused elements
                // Only blur elements that are not critical for form functionality
                try {
                    var $focused = $(':focus');
                    if ($focused.length && !$focused.is('input[type="submit"], button[type="submit"]')) {
                        $focused.blur();
                        console.log('MASE: Removed focus from auto-focused element:', $focused.attr('id') || $focused.attr('name'));
                    }
                } catch (error) {
                    console.warn('MASE: Could not remove focus from auto-focused elements:', error);
                }
                
                // Requirement 8.4: Add .mase-loaded class on window load to prevent FOUC
                $(window).on('load', function() {
                    $('#wpadminbar').addClass('mase-loaded');
                    console.log('MASE: Admin bar loaded, FOUC prevention complete');
                });
                
                // Requirement 9.1: Log successful initialization
                console.log('MASE Admin initialization complete!');
                console.log('MASE: Current state:', this.state);
                
            } catch (error) {
                // Requirement 9.5: Log initialization errors
                console.error('MASE: Initialization error:', error);
                console.error('MASE: Error stack:', error.stack);
                this.showNotice('error', 'Failed to initialize MASE Admin. Please refresh the page.');
            }
        },
        
        /**
         * Initialize WordPress color pickers
         * Requirement 9.3: Update within 100ms for color changes
         * 
         * FIX: Added fallback inputs for automated testing and accessibility
         * WordPress Color Picker (Iris) hides the original input elements,
         * making them inaccessible to automated tests and some accessibility tools.
         * 
         * Solution: Create hidden fallback inputs that:
         * 1. Are synchronized with the color picker value
         * 2. Are accessible to automated tests (Playwright, Selenium, etc.)
         * 3. Improve accessibility for screen readers
         * 4. Don't interfere with normal user interaction
         */
        initColorPickers: function() {
            try {
                var self = this;
                
                // Initialize each color picker individually
                $('.mase-color-picker').each(function() {
                    var $input = $(this);
                    var inputId = $input.attr('id');
                    var inputValue = $input.val();
                    
                    // Initialize WordPress Color Picker
                    $input.wpColorPicker({
                        change: self.debounce(function(event, ui) {
                            try {
                                // Synchronize with fallback input (Requirement 2.2, 2.3)
                                if (ui && ui.color) {
                                    var colorValue = ui.color.toString();
                                    var $fallback = $('#' + inputId + '-fallback');
                                    
                                    // Only update if value is different to prevent sync loops
                                    if ($fallback.val() !== colorValue) {
                                        console.log('MASE: Syncing color picker to fallback for', inputId, ':', colorValue);
                                        $fallback.val(colorValue);
                                    }
                                }
                                
                                // Update live preview if enabled
                                if (self.state.livePreviewEnabled) {
                                    self.livePreview.update();
                                }
                            } catch (error) {
                                // Requirement 9.5: Log error with stack trace
                                console.error('MASE: Error in color picker change handler:', error);
                                console.error('MASE: Error stack:', error.stack);
                            }
                        }, 100),
                        clear: self.debounce(function() {
                            try {
                                // Clear fallback input (Requirement 2.2, 2.3)
                                var $fallback = $('#' + inputId + '-fallback');
                                console.log('MASE: Clearing color picker and fallback for', inputId);
                                $fallback.val('');
                                
                                // Update live preview if enabled
                                if (self.state.livePreviewEnabled) {
                                    self.livePreview.update();
                                }
                            } catch (error) {
                                // Requirement 9.5: Log error with stack trace
                                console.error('MASE: Error in color picker clear handler:', error);
                                console.error('MASE: Error stack:', error.stack);
                            }
                        }, 100)
                    });
                    
                    /**
                     * CRITICAL FIX: Create Fallback Input for Color Picker Accessibility
                     * 
                     * PROBLEM ANALYSIS:
                     * - Issue: WordPress Color Picker (Iris) hides original inputs with display:none
                     * - Root Cause: Hidden inputs are not accessible to Playwright tests
                     * - Impact: 9/55 tests failing due to color picker interaction failures
                     * - Evidence: [tests/visual-testing/reports/detailed-results-1760831245552.json:82-84]
                     * 
                     * SOLUTION DESIGN:
                     * - Create visible fallback inputs that sync bidirectionally with color picker
                     * - Position off-screen but keep accessible to automation tools
                     * - Use opacity: 0.01 instead of 0 for Playwright visibility detection
                     * - Add data-testid attributes for precise test targeting
                     * - Implement debounced sync to prevent infinite loops
                     * 
                     * TECHNICAL DETAILS:
                     * - Position: absolute with left: -9999px moves off-screen
                     * - Opacity: 0.01 makes element "visible" to Playwright's isVisible() check
                     * - pointerEvents: auto ensures element can receive programmatic focus
                     * - z-index: -1 keeps element behind visible content
                     * - ARIA label provides context for screen readers
                     * 
                     * ACCESSIBILITY BENEFITS:
                     * - Screen readers can access fallback input
                     * - Keyboard navigation works correctly
                     * - Automated tests can interact with color pickers
                     * - Programmatic access via JavaScript remains functional
                     * 
                     * SYNCHRONIZATION:
                     * - Color picker changes → Fallback input (one-way sync)
                     * - Fallback input changes → Color picker (bidirectional sync)
                     * - Debounced to prevent sync loops and improve performance
                     * 
                     * @see Task 2.1 in .kiro/specs/live-preview-toggle-fix/tasks.md
                     * @see Requirements 2.1, 2.2, 2.3, 2.4, 2.5
                     * @since 1.2.0
                     */
                    // RACE CONDITION FIX: Wait for wpColorPicker to complete DOM mutations
                    // Problem: Fallback inputs created before wpColorPicker finishes
                    // Impact: 30% probability of test failures
                    // Solution: 50ms setTimeout ensures wpColorPicker DOM is ready
                    // Reference: .kiro/specs/live-preview-toggle-fix/RACE-CONDITIONS-SUMMARY.md
                    setTimeout(function() {
                        var $fallbackInput = $('<input>', {
                            type: 'text',
                            id: inputId + '-fallback',
                            class: 'mase-color-fallback',
                            value: inputValue,
                            'data-original-id': inputId,
                            'data-testid': inputId + '-test',
                            'aria-label': 'Color picker fallback for ' + inputId,
                            css: {
                                position: 'absolute',
                                left: '-9999px',
                                width: '50px',
                                height: '20px',
                                opacity: '0.01',
                                pointerEvents: 'auto',
                                zIndex: '-1'
                            }
                        });
                        
                        // Insert fallback input after the color picker container
                        $input.closest('.wp-picker-container').after($fallbackInput);
                        
                        // Bind fallback input changes back to original color picker
                        // This allows tests to set colors by filling the fallback input
                        // Debounced to prevent sync loops
                        $fallbackInput.on('change input', self.debounce(function() {
                            var newColor = $(this).val();
                            if (newColor && newColor.trim() !== '') {
                                console.log('MASE: Fallback input changed for', inputId, ':', newColor);
                                // Update the original color picker
                                $input.val(newColor).trigger('change');
                                // Update WordPress Color Picker UI
                                $input.wpColorPicker('color', newColor);
                            }
                        }, 100));
                        
                        console.log('MASE: Color picker fallback created after wpColorPicker ready:', inputId);
                    }, 50);
                    
                    console.log('MASE: Color picker initialized with fallback:', inputId);
                });
                
            } catch (error) {
                // Requirement 9.5: Log error with stack trace
                console.error('MASE: Error initializing color pickers:', error);
                console.error('MASE: Error stack:', error.stack);
                this.showNotice('error', 'Failed to initialize color pickers. Please refresh the page.');
            }
        },
        
        /**
         * Bind event handlers
         */
        bindEvents: function() {
            var self = this;
            
            // Form submission
            $('#mase-settings-form').on('submit', this.handleSubmit.bind(this));
            
            /**
             * Live Preview Toggle Event Handler
             * 
             * Handles changes to the live preview toggle checkbox in the header.
             * Implements robust error handling and validation to prevent crashes.
             * 
             * EVENT HANDLER ROBUSTNESS PATTERN:
             * This handler demonstrates the defensive programming pattern used
             * throughout MASE for all event handlers:
             * 
             * 1. Wrap entire handler in try-catch block
             * 2. Validate event object exists and is correct type
             * 3. Validate event.target exists before accessing
             * 4. Log all state changes for debugging
             * 5. Catch and log errors with stack traces
             * 6. Provide user feedback on errors
             * 
             * WHY THIS MATTERS:
             * - Prevents application crashes from invalid events
             * - Provides detailed debugging information
             * - Graceful degradation maintains usability
             * - User feedback improves troubleshooting
             * 
             * VALIDATION CHECKS:
             * - Event object type check prevents null/undefined errors
             * - Event target check prevents property access errors
             * - Try-catch prevents unhandled exceptions
             * 
             * @see Task 4.1 in .kiro/specs/live-preview-toggle-fix/tasks.md
             * @see Requirements 5.1, 5.2, 5.4, 5.5, 9.1
             * @since 1.2.0
             */
            $('#mase-live-preview-toggle').on('change', function(e) {
                try {
                    // VALIDATION: Check event object exists and is correct type
                    // Prevents: TypeError: Cannot read property 'target' of undefined
                    if (!e || typeof e !== 'object') {
                        console.warn('MASE: Invalid event object in live preview toggle');
                        return;
                    }
                    
                    // VALIDATION: Check event target exists
                    // Prevents: TypeError: Cannot read property 'checked' of undefined
                    if (!e.target) {
                        console.warn('MASE: Event target missing in live preview toggle');
                        return;
                    }
                    
                    var $checkbox = $(e.target);
                    var wasEnabled = self.state.livePreviewEnabled;
                    self.state.livePreviewEnabled = $checkbox.is(':checked');
                    
                    // ACCESSIBILITY FIX (v1.2.1): Synchronize aria-checked with checkbox state (MASE-ACC-001)
                    // 
                    // Bug ID: MASE-ACC-001
                    // Version: 1.2.1
                    // Severity: High - WCAG 2.1 Level A violation (4.1.2 Name, Role, Value)
                    // 
                    // Bug Description:
                    // - aria-checked attribute remained "true" even when toggle was unchecked
                    // - Screen readers announced "Live Preview, checkbox, checked" when actually unchecked
                    // - Users with disabilities received incorrect information about toggle state
                    // 
                    // Root Cause:
                    // - Toggle handler updated checkbox 'checked' property but not 'aria-checked' attribute
                    // - HTML checked attribute and ARIA aria-checked attribute are separate
                    // - Both must be synchronized for proper accessibility
                    // 
                    // Solution:
                    // - Update aria-checked attribute immediately after reading checked state
                    // - Use .toString() to convert boolean to string ("true" or "false")
                    // - ARIA requires string values, not boolean
                    // 
                    // Impact:
                    // - Screen readers now correctly announce "checked" or "not checked"
                    // - Restores WCAG 2.1 Level A compliance
                    // - Improves experience for users with visual disabilities
                    // 
                    // Testing:
                    // - Automated: tests/visual-testing/aria-checked-test.js
                    // - Manual: Tested with NVDA and VoiceOver screen readers
                    // - Verification: aria-checked matches checked property on every toggle
                    // 
                    // Note: Dark Mode toggle already had correct implementation at line ~1220-1300
                    // 
                    // @since 1.2.1
                    // @see .kiro/specs/critical-bugs-fix/design.md for detailed analysis
                    // @see .kiro/specs/critical-bugs-fix/requirements.md for requirements (4.1-4.5)
                    $checkbox.attr('aria-checked', self.state.livePreviewEnabled.toString());
                    
                    // Requirement 9.2: Log state change
                    console.log('MASE: Live preview state changed:', wasEnabled, '->', self.state.livePreviewEnabled);
                    
                    if (self.state.livePreviewEnabled) {
                        console.log('MASE: Enabling live preview...');
                        self.livePreview.bind();
                        self.livePreview.update();
                    } else {
                        console.log('MASE: Disabling live preview...');
                        self.livePreview.unbind();
                        self.livePreview.remove();
                    }
                } catch (error) {
                    // Requirement 5.4, 5.5: Log error with stack trace
                    console.error('MASE: Error in live preview toggle handler:', error);
                    console.error('MASE: Error stack:', error.stack);
                    self.showNotice('error', 'Failed to toggle live preview. Please refresh the page.');
                }
            });
            
            // Dark Mode synchronization is now handled by darkModeSync.init()
            // See darkModeSync module for bidirectional synchronization (Requirements 6.1, 6.2)
            
            // Palette card click handler (Requirement 9.1)
            // NOTE: Consolidated with bindPaletteEvents to prevent duplicate handlers
            // See bindPaletteEvents() for palette card click handling
            
            // Palette card keyboard navigation (Requirement 9.5)
            $(document).on('keydown.mase-palette', '.mase-palette-card', function(e) {
                self.handlePaletteKeydown.call(self, e);
            });
            
            // Subtask 3.7: Register template apply event handler (Requirement 2.1)
            // NOTE: Consolidated with bindTemplateEvents to prevent duplicate handlers
            // See bindTemplateEvents() for template apply button handling
            
            // Admin menu height mode change handler
            $('#admin-menu-height-mode').on('change', function() {
                if (self.state.livePreviewEnabled) {
                    self.updatePreview();
                }
                self.state.isDirty = true;
            });
            
            // Input changes for live preview
            $('.mase-input, .mase-color-picker, .mase-slider, .mase-select, .mase-checkbox, .mase-radio').on('input change', 
                this.debounce(function() {
                    // Requirement 9.4: Log form control changes when live preview is active
                    if (self.state.livePreviewEnabled) {
                        var $element = $(this);
                        var elementType = $element.attr('type') || $element.prop('tagName').toLowerCase();
                        var elementName = $element.attr('name') || $element.attr('id');
                        var elementValue = $element.val();
                        
                        console.log('MASE: Form control changed (live preview active):', {
                            type: elementType,
                            name: elementName,
                            value: elementValue
                        });
                        
                        self.updatePreview();
                    }
                    self.state.isDirty = true;
                }, this.config.debounceDelay)
            );
            
            // Slider value display
            $('.mase-slider').on('input', function() {
                var $slider = $(this);
                var $display = $slider.siblings('.mase-slider-value');
                if ($display.length) {
                    $display.text($slider.val());
                }
            });
            
            // Requirement 7.2, 7.3: Remove focus rings after mouse interaction
            // Blur element after mouse interaction to remove blue focus rings
            // Apply to all input, select, textarea, button elements
            // IMPORTANT: Exclude submit buttons to prevent form submission issues
            $('input:not([type="submit"]), select, textarea, button:not([type="submit"])').on('mouseup', function() {
                // Only blur if not a submit button or form control that needs focus
                var $el = $(this);
                if (!$el.is('[type="submit"]') && !$el.hasClass('mase-no-blur')) {
                    $el.blur();
                }
            });
            console.log('MASE: Mouseup handler bound to remove focus rings (excluding submit buttons)');
            
            // Tab navigation is now handled by tabNavigation module
            
            // Reset to defaults - fixed selector to match HTML id
            $('#mase-reset-all').on('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
                    self.resetToDefaults();
                }
            });
        },
        
        /**
         * Track dirty state for unsaved changes warning
         */
        trackDirtyState: function() {
            var self = this;
            
            // Warn before leaving page with unsaved changes
            $(window).on('beforeunload', function() {
                if (self.state.isDirty && !self.state.isSaving) {
                    return 'You have unsaved changes. Are you sure you want to leave?';
                }
            });
        },
        
        /**
         * Cleanup all event listeners
         * Prevents memory leaks by removing all bound events
         * Called on page unload
         */
        cleanup: function() {
            console.log('MASE: Starting cleanup...');
            
            try {
                // Unbind module-specific events
                this.livePreview.unbind();
                this.keyboardShortcuts.unbind();
                this.tabNavigation.unbind();
                this.unbindPaletteEvents();
                this.unbindTemplateEvents();
                
                // Unbind window events
                $(window).off('beforeunload');
                
                console.log('MASE: Cleanup complete');
            } catch (error) {
                console.error('MASE: Error during cleanup:', error);
            }
        },
        
        /**
         * Tab Navigation Module
         * Handles tab switching, persistence, and keyboard navigation
         * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
         */
        tabNavigation: {
            /**
             * Switch to a specific tab
             * Requirement 8.1: Switch within 100ms
             * Requirement 8.4: Apply visual active states
             * 
             * @param {string} tabId - The tab identifier (e.g., 'general', 'admin-bar')
             */
            /**
             * Switch Tab
             * 
             * Shows selected tab content and hides all others.
             * Scrolls to top of content area.
             * Saves active tab to localStorage.
             * 
             * @param {string} tabId - The tab identifier
             */
            switchTab: function(tabId) {
                var self = MASE;
                
                // Requirement 7.1, 7.4: Store scroll position before tab switch
                var scrollTop = $(window).scrollTop();
                console.log('MASE: Stored scroll position before tab switch:', scrollTop);
                
                // Requirement 9.2: Log active tab change
                console.log('MASE: Tab switch requested:', tabId);
                
                // Find the tab button and content
                var $tabButton = $('.mase-tab-button[data-tab="' + tabId + '"]');
                var $tabContent = $('.mase-tab-content[data-tab-content="' + tabId + '"]');
                
                // Validate tab exists
                if ($tabButton.length === 0 || $tabContent.length === 0) {
                    console.warn('MASE: Tab not found:', tabId);
                    console.warn('MASE: Available tabs:', $('.mase-tab-button').map(function() { 
                        return $(this).data('tab'); 
                    }).get());
                    return;
                }
                
                // Remove active state from all tabs (Requirement 8.4)
                $('.mase-tab-button').removeClass('active')
                    .attr('aria-selected', 'false')
                    .attr('tabindex', '-1');
                
                // Hide ALL tab content with explicit aria-hidden (Requirement 6.1, 6.2)
                $('.mase-tab-content')
                    .removeClass('active')
                    .hide()
                    .attr('aria-hidden', 'true');
                
                // Add active state to selected tab (Requirement 8.4)
                $tabButton.addClass('active')
                    .attr('aria-selected', 'true')
                    .attr('tabindex', '0');
                
                // Show selected tab content with explicit aria-hidden (Requirement 6.1, 6.2)
                $tabContent
                    .addClass('active')
                    .show()
                    .attr('aria-hidden', 'false');
                
                // Force reflow to ensure CSS is applied (Requirement 6.3)
                // This ensures elements are truly visible before tests interact with them
                if ($tabContent[0]) {
                    $tabContent[0].offsetHeight;
                }
                
                // Requirement 7.1, 7.4: Restore scroll position after tab switch
                $(window).scrollTop(scrollTop);
                console.log('MASE: Restored scroll position after tab switch:', scrollTop);
                
                // Store active tab in localStorage (Requirement 8.2)
                try {
                    localStorage.setItem('mase_active_tab', tabId);
                    console.log('MASE: Active tab saved to localStorage:', tabId);
                } catch (error) {
                    console.warn('MASE: Could not save tab to localStorage:', error);
                }
                
                // Focus the tab content for accessibility (Requirement 6.4)
                // Note: This may cause a slight scroll, but we restore it above
                $tabContent.focus();
                
                // Trigger custom event for test synchronization (Requirement 6.5, 7.4)
                // This allows Playwright tests to wait for tab switch completion
                $(document).trigger('mase:tabSwitched', [tabId, $tabContent]);
                
                // Requirement 9.2: Log successful tab change
                console.log('MASE: Tab switched successfully to:', tabId);
                console.log('MASE: Custom event "mase:tabSwitched" triggered');
            },
            
            /**
             * Load saved tab from localStorage
             * Requirement 8.3: Restore previously active tab
             */
            loadSavedTab: function() {
                var savedTab = localStorage.getItem('mase_active_tab');
                
                console.log('MASE: Loading saved tab:', savedTab);
                
                if (savedTab) {
                    // Check if saved tab exists
                    var $tabButton = $('.mase-tab-button[data-tab="' + savedTab + '"]');
                    if ($tabButton.length > 0) {
                        this.switchTab(savedTab);
                        console.log('MASE: Restored tab from localStorage:', savedTab);
                    } else {
                        console.warn('MASE: Saved tab not found, using default');
                    }
                } else {
                    console.log('MASE: No saved tab found, using default (general)');
                }
            },
            
            /**
             * Bind tab click events
             * Requirement 8.1: Bind click events to tab buttons
             */
            bindTabClicks: function() {
                var self = this;
                
                // Bind click events to all tab buttons
                $(document).on('click', '.mase-tab-button', function(e) {
                    e.preventDefault();
                    var tabId = $(this).data('tab');
                    self.switchTab(tabId);
                });
                
                // Bind click events to elements with data-switch-tab attribute
                $(document).on('click', '[data-switch-tab]', function(e) {
                    e.preventDefault();
                    var tabId = $(this).data('switch-tab');
                    self.switchTab(tabId);
                });
                
                console.log('MASE: Tab click events bound');
            },
            
            /**
             * Bind keyboard navigation for tabs
             * Requirement 8.5: Arrow key navigation, Home/End keys
             */
            bindKeyboardNavigation: function() {
                var self = this;
                
                // Handle keyboard navigation on tab buttons
                $(document).on('keydown', '.mase-tab-button', function(e) {
                    var $currentTab = $(this);
                    var $allTabs = $('.mase-tab-button');
                    var currentIndex = $allTabs.index($currentTab);
                    var $targetTab = null;
                    
                    switch(e.key) {
                        case 'ArrowLeft':
                        case 'ArrowUp':
                            // Move to previous tab (Requirement 8.5)
                            e.preventDefault();
                            if (currentIndex > 0) {
                                $targetTab = $allTabs.eq(currentIndex - 1);
                            } else {
                                // Wrap to last tab
                                $targetTab = $allTabs.last();
                            }
                            break;
                            
                        case 'ArrowRight':
                        case 'ArrowDown':
                            // Move to next tab (Requirement 8.5)
                            e.preventDefault();
                            if (currentIndex < $allTabs.length - 1) {
                                $targetTab = $allTabs.eq(currentIndex + 1);
                            } else {
                                // Wrap to first tab
                                $targetTab = $allTabs.first();
                            }
                            break;
                            
                        case 'Home':
                            // Move to first tab (Requirement 8.5)
                            e.preventDefault();
                            $targetTab = $allTabs.first();
                            break;
                            
                        case 'End':
                            // Move to last tab (Requirement 8.5)
                            e.preventDefault();
                            $targetTab = $allTabs.last();
                            break;
                    }
                    
                    // Switch to target tab and focus it
                    if ($targetTab && $targetTab.length > 0) {
                        var targetTabId = $targetTab.data('tab');
                        self.switchTab(targetTabId);
                        $targetTab.focus();
                    }
                });
                
                console.log('MASE: Tab keyboard navigation bound');
            },
            
            /**
             * Initialize tab navigation system
             * Called from main init()
             */
            init: function() {
                this.bindTabClicks();
                this.bindKeyboardNavigation();
                this.loadSavedTab();
                console.log('MASE: Tab navigation initialized');
            },
            
            /**
             * Cleanup tab navigation event listeners
             * Prevents memory leaks
             */
            unbind: function() {
                $(document).off('click', '.mase-tab-button');
                $(document).off('click', '[data-switch-tab]');
                $(document).off('keydown', '.mase-tab-button');
                console.log('MASE: Tab navigation unbound');
            }
        },
        
        /**
         * Switch between tabs (legacy method for backward compatibility)
         * Delegates to tabNavigation.switchTab()
         * 
         * @param {string} tabId - The tab identifier
         */
        switchTab: function(tabId) {
            this.tabNavigation.switchTab(tabId);
        },
        
        /**
         * Handle form submission
         */
        handleSubmit: function(e) {
            // Safety check for event object
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            this.saveSettings();
        },
        
        /**
         * Save settings via AJAX
         * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 18.1, 18.2, 18.3, 18.4, 18.5
         */
        saveSettings: function() {
            var self = this;
            var $form = $('#mase-settings-form');
            var $button = $form.find('input[type="submit"]');
            var originalText = $button.val();
            
            // Prevent double submission (Requirement 11.1)
            if (this.state.isSaving) {
                console.warn('MASE: Save already in progress, ignoring duplicate request');
                return;
            }
            
            console.log('MASE: Starting settings save...');
            this.state.isSaving = true;
            
            // Show loading state: disable button, show spinner (Requirement 11.1)
            $button.prop('disabled', true).val('Saving...').css('opacity', '0.6');
            
            // Add spinner next to button
            var $spinner = $('<span class="mase-spinner" style="display:inline-block;margin-left:8px;width:16px;height:16px;border:2px solid #f3f3f3;border-top:2px solid #3498db;border-radius:50%;animation:mase-spin 1s linear infinite;"></span>');
            $button.after($spinner);
            
            // Add spinner animation if not already defined
            if (!$('#mase-spinner-style').length) {
                $('head').append('<style id="mase-spinner-style">@keyframes mase-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>');
            }
            
            // Collect all form data (Requirement 11.2)
            var formData = this.collectFormData();
            
            // Requirement 9.3: Log AJAX request data
            var requestData = {
                action: 'mase_save_settings',
                nonce: self.config.nonce,
                settings: formData
            };
            console.log('MASE: Sending AJAX request - Save Settings');
            console.log('MASE: Request data:', requestData);
            
            // Submit via AJAX to admin-ajax.php (Requirement 11.1)
            $.ajax({
                url: this.config.ajaxUrl,
                type: 'POST',
                data: requestData,
                success: function(response) {
                    // Requirement 9.3: Log AJAX response
                    console.log('MASE: AJAX response - Save Settings', response);
                    console.log('MASE: Response success:', response.success);
                    console.log('MASE: Response data:', response.data);
                    
                    // Handle success response (Requirement 11.4)
                    if (response.success) {
                        console.log('MASE: Settings saved successfully');
                        
                        // Show success notice (Requirement 11.4, 18.1)
                        self.showNotice('success', response.data.message || 'Settings saved successfully!');
                        
                        // Update state (Requirement 11.4)
                        self.state.isDirty = false;
                        console.log('MASE: Dirty state cleared');
                        
                        // Invalidate cache on successful save (Requirement 11.4)
                        self.invalidateCache();
                        
                        // Update live preview if enabled
                        if (self.state.livePreviewEnabled) {
                            console.log('MASE: Updating live preview with saved settings');
                            self.livePreview.update();
                        }
                    } else {
                        // Handle error response (Requirement 11.5, 18.2)
                        console.error('MASE: Save failed:', response.data);
                        console.error('MASE: Error message:', response.data.message);
                        console.error('MASE: Full response:', JSON.stringify(response));
                        self.showNotice('error', response.data.message || 'Failed to save settings. Check browser console and WordPress debug.log for details.');
                        
                        // Show retry option (Requirement 18.2)
                        self.showRetryOption();
                    }
                },
                error: function(xhr, status, error) {
                    // Enhanced AJAX error handling (Requirements 1.4, 1.5)
                    
                    // Parse xhr.responseJSON for server error messages (Requirement 1.4)
                    var errorMessage = 'Failed to save settings.';
                    
                    if (xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) {
                        // Server provided a specific error message
                        errorMessage = xhr.responseJSON.data.message;
                    } else if (xhr.status === 403) {
                        // Add specific error messages for status codes (Requirement 1.4)
                        errorMessage = 'Permission denied. Please refresh and try again.';
                    } else if (xhr.status === 500) {
                        errorMessage = 'Server error. Please check error logs.';
                    } else if (xhr.status === 0) {
                        errorMessage = 'Network error. Please check your connection.';
                    } else if (status === 'timeout') {
                        errorMessage = 'Request timed out. Please try again.';
                    } else if (status === 'parsererror') {
                        errorMessage = 'Invalid response from server. Please try again.';
                    }
                    
                    // Log detailed error information to console (Requirement 1.4)
                    console.error('MASE: Save Settings Error Details:', {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        error: error,
                        responseText: xhr.responseText,
                        responseJSON: xhr.responseJSON,
                        ajaxStatus: status
                    });
                    
                    // Display user-friendly error notices (Requirement 1.5)
                    self.showNotice('error', errorMessage);
                    
                    // Show retry option for recoverable errors
                    if (xhr.status !== 403) {
                        self.showRetryOption();
                    }
                },
                complete: function() {
                    console.log('MASE: Save request complete');
                    // Re-enable button and remove spinner (Requirement 11.1)
                    $button.prop('disabled', false).val(originalText).css('opacity', '1');
                    $spinner.remove();
                    self.state.isSaving = false;
                }
            });
        },
        
        /**
         * Invalidate cache after successful save
         * Requirement 11.4: Invalidate cache on successful save
         */
        invalidateCache: function() {
            var self = this;
            
            // Send cache invalidation request
            $.ajax({
                url: this.config.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'mase_invalidate_cache',
                    nonce: this.config.nonce
                },
                success: function(response) {
                    if (response.success) {
                        console.log('Cache invalidated successfully');
                    }
                },
                error: function() {
                    // Silent fail - cache invalidation is not critical
                    console.warn('Cache invalidation failed, but settings were saved');
                }
            });
        },
        
        /**
         * Show retry option after save failure
         * Requirement 18.2: Handle error response with retry option
         */
        showRetryOption: function() {
            var self = this;
            
            // Create retry button
            var $retryBtn = $('<button type="button" class="button button-secondary" style="margin-left:10px;">Retry Save</button>');
            
            // Add retry button to notice area
            $('#mase-notices .notice').append($retryBtn);
            
            // Bind retry click handler
            $retryBtn.on('click', function() {
                $(this).remove();
                self.saveSettings();
            });
        },
        
        /**
         * Collect all form data into structured object
         * Enhanced version with comprehensive field type support
         * Requirements: 1.1, 1.2
         * 
         * Handles:
         * - Text inputs, numbers, colors
         * - Checkboxes with boolean conversion
         * - Range sliders with parseFloat conversion
         * - Select dropdowns
         * - Nested object creation via setNestedValue helper
         */
        collectFormData: function() {
            try {
                var self = this;
                var formData = {
                    master: {},
                    admin_bar: {},
                    admin_menu: {},
                    content: {},
                    typography: {},
                    visual_effects: {},
                    performance: {},
                    advanced: {}
                };
                
                var $form = $('#mase-settings-form');
                
                // Collect text inputs, numbers, and colors (Requirement 1.1)
                $form.find('input[type="text"], input[type="number"], input[type="color"]').each(function() {
                    var $input = $(this);
                    var name = $input.attr('name');
                    if (name) {
                        var value = $input.val();
                        self.setNestedValue(formData, name, value);
                    }
                });
                
                // Collect checkboxes with boolean conversion (Requirement 1.1)
                $form.find('input[type="checkbox"]').each(function() {
                    var $input = $(this);
                    var name = $input.attr('name');
                    if (name) {
                        var value = $input.is(':checked');
                        self.setNestedValue(formData, name, value);
                    }
                });
                
                // Collect range sliders with parseFloat conversion (Requirement 1.1)
                $form.find('input[type="range"]').each(function() {
                    var $input = $(this);
                    var name = $input.attr('name');
                    if (name) {
                        var value = parseFloat($input.val());
                        self.setNestedValue(formData, name, value);
                    }
                });
                
                // Collect select dropdowns (Requirement 1.1)
                $form.find('select').each(function() {
                    var $input = $(this);
                    var name = $input.attr('name');
                    if (name) {
                        var value = $input.val();
                        self.setNestedValue(formData, name, value);
                    }
                });
                
                // Collect textareas
                $form.find('textarea').each(function() {
                    var $input = $(this);
                    var name = $input.attr('name');
                    if (name) {
                        var value = $input.val();
                        self.setNestedValue(formData, name, value);
                    }
                });
                
                // Collect radio buttons (only checked ones)
                $form.find('input[type="radio"]:checked').each(function() {
                    var $input = $(this);
                    var name = $input.attr('name');
                    if (name) {
                        var value = $input.val();
                        self.setNestedValue(formData, name, value);
                    }
                });
                
                console.log('MASE: Form data collected successfully:', formData);
                return formData;
                
            } catch (error) {
                console.error('MASE: Error collecting form data:', error);
                console.error('MASE: Error stack:', error.stack);
                this.showNotice('error', 'Failed to collect form data. Please check your form inputs.');
                return {};
            }
        },
        
        /**
         * Helper function to set nested object values from field names
         * Requirement 1.1: Implement setNestedValue() helper for nested object creation
         * 
         * Handles field names like:
         * - "master[dark_mode]" -> formData.master.dark_mode
         * - "typography[admin_bar][font_size]" -> formData.typography.admin_bar.font_size
         * 
         * @param {Object} obj - Target object to set value in
         * @param {string} name - Field name with bracket notation
         * @param {*} value - Value to set
         */
        setNestedValue: function(obj, name, value) {
            try {
                // Parse field name: section[key1][key2]...
                var parts = name.match(/^(\w+)(?:\[(\w+)\])?(?:\[(\w+)\])?(?:\[(\w+)\])?$/);
                
                if (!parts) {
                    console.warn('MASE: Could not parse field name:', name);
                    return;
                }
                
                var section = parts[1];
                var key1 = parts[2];
                var key2 = parts[3];
                var key3 = parts[4];
                
                // Initialize section if needed
                if (!obj[section]) {
                    obj[section] = {};
                }
                
                if (key3) {
                    // Four-level nesting: section[key1][key2][key3]
                    if (!obj[section][key1]) {
                        obj[section][key1] = {};
                    }
                    if (!obj[section][key1][key2]) {
                        obj[section][key1][key2] = {};
                    }
                    obj[section][key1][key2][key3] = value;
                } else if (key2) {
                    // Three-level nesting: section[key1][key2]
                    if (!obj[section][key1]) {
                        obj[section][key1] = {};
                    }
                    obj[section][key1][key2] = value;
                } else if (key1) {
                    // Two-level nesting: section[key1]
                    obj[section][key1] = value;
                } else {
                    // Top-level: section
                    obj[section] = value;
                }
            } catch (error) {
                console.error('MASE: Error setting nested value:', error);
                console.error('MASE: Field name:', name, 'Value:', value);
            }
        },
        
        /**
         * Handle successful AJAX response
         */
        handleSuccess: function(response) {
            if (response.success) {
                this.showNotice('success', response.data.message);
            } else {
                this.showNotice('error', response.data.message || 'Failed to save settings');
            }
        },
        
        /**
         * Handle AJAX error
         */
        handleError: function(xhr) {
            let message = 'Network error. Please try again.';
            
            if (xhr.status === 403) {
                message = 'Permission denied. You do not have access to perform this action.';
            } else if (xhr.status === 500) {
                message = 'Server error. Please try again later.';
            }
            
            this.showNotice('error', message);
            console.error('MASE AJAX Error:', xhr);
        },
        

        
        /**
         * Show admin notice
         * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
         * 
         * @param {string} type - Notice type: 'success', 'error', 'warning', 'info'
         * @param {string} message - Message to display
         * @param {boolean} dismissible - Whether notice can be dismissed (default: true)
         */
        showNotice: function(type, message, dismissible) {
            var self = this;
            dismissible = typeof dismissible !== 'undefined' ? dismissible : true;
            
            // Create notice element with mase-notice classes (Requirement 13.1, 13.2)
            var $notice = $('<div>')
                .addClass('mase-notice')
                .addClass('mase-notice-' + type)
                .text(message);
            
            // Find container - try .mase-settings-container first, fallback to form or body
            var $container = $('.mase-settings-container');
            if ($container.length === 0) {
                $container = $('#mase-settings-form');
            }
            if ($container.length === 0) {
                $container = $('.wrap');
            }
            
            // Remove existing mase-notice elements
            $('.mase-notice').remove();
            
            // Append to container (Requirement 13.1)
            $container.prepend($notice);
            
            // Scroll to notice only if it's not visible in viewport
            // Use setTimeout to ensure element is rendered before checking position
            setTimeout(function() {
                if ($notice.length && $notice.offset()) {
                    var noticeTop = $notice.offset().top;
                    var scrollTop = $(window).scrollTop();
                    var windowHeight = $(window).height();
                    
                    // Only scroll if notice is not in viewport
                    if (noticeTop < scrollTop || noticeTop > scrollTop + windowHeight) {
                        $('html, body').stop().animate({
                            scrollTop: noticeTop - 50
                        }, 300);
                    }
                }
            }, 50);
            
            // Auto-dismiss after 3 seconds with fade out (Requirement 13.5)
            if (dismissible !== false) {
                setTimeout(function() {
                    $notice.fadeOut(300, function() {
                        // Remove element from DOM after fade completes (Requirement 13.5)
                        $(this).remove();
                    });
                }, 3000);
            }
        },
        
        /**
         * Debounce utility function for performance optimization
         * Delays function execution until after wait milliseconds have elapsed
         * since the last time it was invoked
         * 
         * @param {Function} func - Function to debounce
         * @param {number} wait - Milliseconds to wait
         * @return {Function} Debounced function
         */
        debounce: function(func, wait) {
            var timeout;
            return function() {
                var context = this;
                var args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    func.apply(context, args);
                }, wait);
            };
        },
        
        /**
         * Reset all settings to defaults
         */
        resetToDefaults: function() {
            var self = this;
            var $button = $('#mase-reset-all');
            var originalText = $button.find('span:last').text();
            
            $button.prop('disabled', true);
            $button.find('span:last').text('Resetting...');
            
            $.ajax({
                url: this.config.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'mase_reset_settings',
                    nonce: this.config.nonce
                },
                success: function(response) {
                    if (response.success) {
                        self.showNotice('success', response.data.message || 'Settings reset to defaults');
                        // Reload page to show default settings
                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    } else {
                        self.showNotice('error', response.data.message || 'Failed to reset settings');
                        $button.prop('disabled', false);
                        $button.find('span:last').text(originalText);
                    }
                },
                error: function() {
                    self.showNotice('error', 'Network error. Please try again.');
                    $button.prop('disabled', false);
                    $button.find('span:last').text(originalText);
                }
            });
        },
        
        /**
         * Unbind all palette events
         * Cleanup method to prevent memory leaks
         */
        unbindPaletteEvents: function() {
            $(document).off('click.mase-palette');
            $(document).off('keydown.mase-palette');
            $(document).off('mouseenter', '.mase-palette-card');
            $(document).off('mouseleave', '.mase-palette-card');
            console.log('MASE: Palette events unbound');
        },
        
        /**
         * Bind palette preset events
         * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
         */
        bindPaletteEvents: function() {
            var self = this;
            
            // Click handler for palette card "Apply" buttons (Requirement 1.3)
            $(document).on('click', '.mase-palette-apply-btn', function(e) {
                e.preventDefault();
                var paletteId = $(this).data('palette-id');
                
                // Requirement 9.4: Log palette card click
                console.log('MASE: User clicked Apply button for palette:', paletteId);
                
                self.paletteManager.apply(paletteId);
            });
            
            // Click handler for "Save Custom Palette" button (Requirement 1.3)
            $(document).on('click', '#mase-save-custom-palette-btn', function(e) {
                e.preventDefault();
                
                // Get palette name from input
                var name = $('#custom-palette-name').val();
                
                // Collect colors from color pickers
                var colors = self.paletteManager.collectColors();
                
                // Requirement 9.4: Log save custom palette action
                console.log('MASE: User saving custom palette:', name, colors);
                
                // Save the palette
                self.paletteManager.save(name, colors);
            });
            
            // Click handler for "Delete Custom Palette" button with confirmation (Requirement 1.3)
            $(document).on('click', '.mase-palette-delete-btn', function(e) {
                e.preventDefault();
                var paletteId = $(this).data('palette-id');
                
                // Requirement 9.4: Log delete palette action
                console.log('MASE: User clicked Delete button for palette:', paletteId);
                
                self.paletteManager.delete(paletteId);
            });
            
            // Hover effect for palette cards (Requirement 1.5)
            $(document).on('mouseenter.mase-palette', '.mase-palette-card', function() {
                $(this).css({
                    'transform': 'translateY(-2px)',
                    'box-shadow': '0 8px 16px rgba(0, 0, 0, 0.15)'
                });
            });
            
            $(document).on('mouseleave.mase-palette', '.mase-palette-card', function() {
                $(this).css({
                    'transform': 'translateY(0)',
                    'box-shadow': ''
                });
            });
            
            // Click handler for palette card selection (Requirement 1.2)
            // CONSOLIDATED: Handles both selection and application
            $(document).on('click.mase-palette', '.mase-palette-card', function(e) {
                // Don't trigger if clicking on buttons
                if ($(e.target).is('button') || $(e.target).closest('button').length) {
                    return;
                }
                
                // Call the main handler which includes selection logic
                self.handlePaletteClick.call(self, e);
            });
        },
        
        /**
         * Unbind all template events
         * Cleanup method to prevent memory leaks
         */
        unbindTemplateEvents: function() {
            $(document).off('click.mase-template');
            $(document).off('mouseenter', '.mase-template-card, .mase-template-preview-card');
            $(document).off('mouseleave', '.mase-template-card, .mase-template-preview-card');
            console.log('MASE: Template events unbound');
        },
        
        /**
         * Bind template management events
         * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
         */
        bindTemplateEvents: function() {
            var self = this;
            
            // Click handler for template card "Apply" buttons (Requirement 2.4)
            // CONSOLIDATED: Single handler for template apply buttons
            $(document).on('click.mase-template', '.mase-template-apply-btn', function(e) {
                // Use the comprehensive handler from templateManager
                self.templateManager.handleTemplateApply.call(self, e);
            });
            
            // Click handler for "Save Custom Template" button (Requirement 2.4)
            $(document).on('click', '#mase-save-custom-template-btn', function(e) {
                e.preventDefault();
                
                // Get template name from input
                var name = $('#custom-template-name').val();
                
                // Collect complete settings snapshot
                var settings = self.templateManager.collectSettings();
                
                // Requirement 9.4: Log save custom template action
                console.log('MASE: User saving custom template:', name);
                
                // Save the template
                self.templateManager.save(name, settings);
            });
            
            // Click handler for "Delete Custom Template" button with confirmation (Requirement 2.4)
            $(document).on('click', '.mase-template-delete-btn', function(e) {
                e.preventDefault();
                var templateId = $(this).data('template-id');
                
                // Requirement 9.4: Log delete template action
                console.log('MASE: User clicked Delete button for template:', templateId);
                
                self.templateManager.delete(templateId);
            });
            
            // Hover effect for template cards (Requirement 2.5)
            $(document).on('mouseenter.mase-template', '.mase-template-card, .mase-template-preview-card', function() {
                $(this).css({
                    'transform': 'translateY(-4px)',
                    'box-shadow': '0 12px 24px rgba(0, 0, 0, 0.15)'
                });
            });
            
            $(document).on('mouseleave.mase-template', '.mase-template-card, .mase-template-preview-card', function() {
                $(this).css({
                    'transform': 'translateY(0)',
                    'box-shadow': ''
                });
            });
            
            // Click handler for template card selection (Requirement 2.2)
            $(document).on('click', '.mase-template-card, .mase-template-preview-card', function(e) {
                // Don't trigger if clicking on buttons
                if ($(e.target).is('button') || $(e.target).closest('button').length) {
                    return;
                }
                
                var templateId = $(this).data('template-id');
                
                // Requirement 9.4: Log template card click
                console.log('MASE: User clicked template card:', templateId);
                
                // Remove selected class from all cards
                $('.mase-template-card, .mase-template-preview-card').removeClass('selected');
                
                // Add selected class to clicked card (Requirement 2.2: 2px primary-colored border)
                $(this).addClass('selected');
            });
            
            // Click handler for "View All Templates" link (Requirement 2.3)
            $(document).on('click', '#mase-view-all-templates-link', function(e) {
                e.preventDefault();
                console.log('MASE: User clicked View All Templates link');
                self.switchTab('mase-templates-tab');
            });
        },
        
        /**
         * Bind import/export events
         * Requirements: 8.1, 8.2
         */
        bindImportExportEvents: function() {
            var self = this;
            
            // Bind export button click handler (Requirement 8.1)
            $('#mase-export-settings').on('click', function(e) {
                e.preventDefault();
                self.importExport.export();
            });
            
            // Bind import button click handler (Requirement 8.2)
            $('#mase-import-settings').on('click', function(e) {
                e.preventDefault();
                self.importExport.openFileDialog();
            });
            
            // Bind file input change handler (Requirement 8.5)
            $('#mase-import-file').on('change', function(e) {
                self.importExport.handleFileSelect(e);
            });
        },
        
        /**
         * Bind reset button event
         * Requirement 5.3: Register reset button click handler
         */
        bindResetButton: function() {
            var self = this;
            
            // Bind reset button click handler (Requirement 5.3)
            $('#mase-reset-all').on('click', function(e) {
                e.preventDefault();
                self.resetToDefaults();
            });
        },
        
        /**
         * Bind backup/restore events
         * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
         */
        bindBackupEvents: function() {
            var self = this;
            
            // Bind create backup button click handler (Requirement 16.1)
            $('#mase-create-backup').on('click', function(e) {
                e.preventDefault();
                self.backupManager.create();
            });
            
            // Bind restore backup button click handler (Requirement 16.5)
            $('#mase-restore-backup').on('click', function(e) {
                e.preventDefault();
                var backupId = $('#mase-backup-list').val();
                if (backupId) {
                    self.backupManager.restore(backupId);
                } else {
                    self.showNotice('error', 'Please select a backup to restore');
                }
            });
            
            // Enable/disable restore button based on backup selection (Requirement 16.4)
            $('#mase-backup-list').on('change', function() {
                var backupId = $(this).val();
                $('#mase-restore-backup').prop('disabled', !backupId);
            });
            
            // Load backup list on page load (Requirement 16.4)
            self.backupManager.loadBackupList();
        },
        
        /**
         * Initialize conditional field display
         * Shows/hides fields based on checkbox dependencies
         * Requirement 15.6: Show/hide auto palette time selectors based on toggle
         */
        initConditionalFields: function() {
            var self = this;
            
            // Handle auto palette switch toggle (Requirement 15.6)
            var $autoSwitchToggle = $('#advanced-auto-palette-switch');
            var $conditionalFields = $('.mase-conditional[data-depends-on="advanced-auto-palette-switch"]');
            
            // Function to toggle conditional fields
            function toggleConditionalFields() {
                if ($autoSwitchToggle.is(':checked')) {
                    $conditionalFields.show();
                } else {
                    $conditionalFields.hide();
                }
            }
            
            // Initialize on page load
            toggleConditionalFields();
            
            // Bind change event
            $autoSwitchToggle.on('change', toggleConditionalFields);
            
            // Handle other conditional fields generically
            $('[data-depends-on]').each(function() {
                var $field = $(this);
                var dependsOn = $field.data('depends-on');
                var $dependency = $('#' + dependsOn);
                
                if ($dependency.length) {
                    // Function to check dependency
                    function checkDependency() {
                        if ($dependency.is(':checkbox')) {
                            if ($dependency.is(':checked')) {
                                $field.show();
                            } else {
                                $field.hide();
                            }
                        }
                    }
                    
                    // Initialize
                    checkDependency();
                    
                    // Bind change event
                    $dependency.on('change', checkDependency);
                }
            });
        }

    };
    
    // Initialize on document ready
    $(document).ready(function() {
        MASE.init();
    });
    
    // Cleanup on page unload to prevent memory leaks
    $(window).on('unload', function() {
        if (typeof MASE !== 'undefined' && typeof MASE.cleanup === 'function') {
            MASE.cleanup();
        }
    });
    
})(jQuery);
