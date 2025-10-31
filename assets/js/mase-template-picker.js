/**
 * MASE Template Picker
 * Handles theme template selection and application
 */

(function($) {
    'use strict';

    const MASETemplatePicker = {
        initialized: false,
        
        init: function() {
            if (this.initialized) {
                console.log('MASE Template Picker: Already initialized');
                return;
            }
            
            console.log('MASE Template Picker: Initializing...');
            this.bindEvents();
            this.loadTemplates();
            this.initialized = true;
        },

        bindEvents: function() {
            $(document).on('click', '.mase-template-apply-btn', this.handleApplyClick.bind(this));
        },

        loadTemplates: function() {
            if (!window.maseAdmin || !window.maseAdmin.themeTemplates) {
                console.log('MASE: No theme templates data available');
                return;
            }

            const templates = window.maseAdmin.themeTemplates;
            const activeTemplate = window.maseAdmin.activeTemplate;
            const container = $('#mase-template-picker-grid');

            if (!container.length) {
                console.log('MASE: Template picker container not found');
                return;
            }

            container.empty();

            $.each(templates, function(id, template) {
                const isActive = id === activeTemplate;
                
                const card = $('<div>')
                    .addClass('mase-template-card')
                    .attr('data-template-id', id)
                    .toggleClass('active', isActive);

                const preview = $('<div>')
                    .addClass('mase-template-preview')
                    .addClass(template.css_class);

                const info = $('<div>')
                    .addClass('mase-template-info');

                const name = $('<h3>')
                    .addClass('mase-template-name')
                    .text(template.name);

                const description = $('<p>')
                    .addClass('mase-template-description')
                    .text(template.description);

                const badge = $('<span>')
                    .addClass('mase-template-category-badge')
                    .text(template.category);

                if (isActive) {
                    const activeBadge = $('<span>')
                        .addClass('mase-template-active-badge')
                        .text('Active');
                    info.append(activeBadge);
                }

                const actions = $('<div>')
                    .addClass('mase-template-actions');

                const applyBtn = $('<button>')
                    .attr('type', 'button')
                    .addClass('button button-primary mase-template-apply-btn')
                    .text(isActive ? 'Active' : 'Apply')
                    .prop('disabled', isActive);

                actions.append(applyBtn);

                info.append(name, description, badge);
                card.append(preview, info, actions);
                container.append(card);
            });

            console.log('MASE: Loaded ' + Object.keys(templates).length + ' templates');
        },

        handleApplyClick: function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = $(e.currentTarget);
            const card = button.closest('.mase-template-card');
            const templateId = card.data('template-id');

            if (button.prop('disabled') || card.hasClass('active')) {
                return;
            }

            this.applyTemplate(templateId, button);
        },

        applyTemplate: function(templateId, button) {
            const card = button.closest('.mase-template-card');
            const originalText = button.text();
            
            $.ajax({
                url: window.maseAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'mase_apply_theme_template',
                    nonce: window.maseAdmin.nonce,
                    template_id: templateId
                },
                beforeSend: function() {
                    card.addClass('loading');
                    button.prop('disabled', true).text('Applying...');
                },
                success: function(response) {
                    if (response.success) {
                        // Update UI
                        $('.mase-template-card').removeClass('active');
                        $('.mase-template-apply-btn').prop('disabled', false).text('Apply');
                        
                        card.addClass('active');
                        button.text('Active');
                        
                        // Show success message
                        MASETemplatePicker.showNotice('success', 'Template applied successfully! Reloading...');
                        
                        // Reload page to apply template
                        setTimeout(function() {
                            window.location.reload();
                        }, 1500);
                    } else {
                        button.prop('disabled', false).text(originalText);
                        MASETemplatePicker.showNotice('error', response.data && response.data.message ? response.data.message : 'Failed to apply template');
                    }
                },
                error: function(xhr, status, error) {
                    button.prop('disabled', false).text(originalText);
                    console.error('MASE Template Error:', error);
                    MASETemplatePicker.showNotice('error', 'Network error occurred. Please try again.');
                },
                complete: function() {
                    card.removeClass('loading');
                }
            });
        },

        showNotice: function(type, message) {
            const notice = $('<div>')
                .addClass('notice notice-' + type + ' is-dismissible')
                .append($('<p>').text(message));

            $('.wrap > h1').after(notice);

            setTimeout(function() {
                notice.fadeOut(function() {
                    $(this).remove();
                });
            }, 3000);
        }
    };

    // Initialize when DOM is ready
    $(document).ready(function() {
        console.log('MASE Template Picker: DOM Ready');
        
        // Try immediate initialization
        const container = $('#mase-template-picker-grid');
        console.log('Container found:', container.length > 0);
        
        if (container.length > 0) {
            MASETemplatePicker.init();
        } else {
            console.log('MASE Template Picker: Container not found, setting up tab listener...');
        }
        
        // Also listen for tab changes (in case Templates tab is not active initially)
        $(document).on('click', '[data-tab="templates"]', function() {
            console.log('MASE Template Picker: Templates tab clicked');
            setTimeout(function() {
                if (!MASETemplatePicker.initialized) {
                    MASETemplatePicker.init();
                }
            }, 100);
        });
        
        // Fallback: Try again after a delay
        setTimeout(function() {
            if (!MASETemplatePicker.initialized) {
                const retryContainer = $('#mase-template-picker-grid');
                console.log('MASE Template Picker: Retry - Container found:', retryContainer.length > 0);
                if (retryContainer.length > 0) {
                    MASETemplatePicker.init();
                }
            }
        }, 1000);
    });
    
    // Make it globally accessible for debugging
    window.MASETemplatePicker = MASETemplatePicker;

})(jQuery);
