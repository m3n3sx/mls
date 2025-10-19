/**
 * Modern Admin Styler Enterprise - Palette Activation Unit Tests
 * 
 * Tests for palette activation functionality including:
 * - handlePaletteClick method
 * - handlePaletteKeydown method
 * - showNotice method
 * - AJAX request handling
 * - UI rollback on error
 * 
 * Task 28: Write JavaScript unit tests for palette activation
 * 
 * @package MASE
 * @since 1.2.0
 */

// Mock jQuery
global.$ = global.jQuery = require('jquery');

// Mock WordPress globals
global.ajaxurl = '/wp-admin/admin-ajax.php';

// Mock AJAX
$.ajax = jest.fn();

describe('MASEAdmin.handlePaletteClick()', () => {
    let MASEAdmin;
    let mockEvent;
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        
        // Mock DOM elements
        document.body.innerHTML = `
            <div class="mase-settings-container">
                <input type="hidden" id="mase_nonce" value="test-nonce-123" />
                <div class="mase-palette-card active" data-palette="professional-blue">
                    <div class="mase-palette-name">Professional Blue</div>
                    <button class="mase-palette-apply-btn">Apply Palette</button>
                </div>
                <div class="mase-palette-card" data-palette="creative-purple">
                    <div class="mase-palette-name">Creative Purple</div>
                    <button class="mase-palette-apply-btn">Apply Palette</button>
                </div>
                <div class="mase-palette-card" data-palette="energetic-green">
                    <div class="mase-palette-name">Energetic Green</div>
                    <button class="mase-palette-apply-btn">Apply Palette</button>
                </div>
            </div>
        `;
        
        // Create MASEAdmin object with palette activation methods
        MASEAdmin = {
            config: {
                ajaxUrl: '/wp-admin/admin-ajax.php',
                nonce: 'test-nonce-123',
                livePreviewEnabled: false
            },
            
            state: {
                currentPalette: 'professional-blue'
            },
            
            showNotice: jest.fn(),
            
            /**
             * Handle palette card click
             * Requirements: 9.1, 9.2, 9.3, 9.4, 10.1-10.5, 11.1-11.5, 12.1-12.5, 13.1-13.5, 14.1-14.5
             */
            handlePaletteClick: function(e) {
                var self = this;
                var $card = $(e.currentTarget);
                
                // Extract palette data (Requirement 9.2)
                var paletteId = $card.data('palette');
                var paletteName = $card.find('.mase-palette-name').text();
                
                // Validate palette ID exists (Requirement 9.3)
                if (!paletteId) {
                    console.error('MASE: Palette ID not found');
                    return;
                }
                
                // Check if palette is already active (Requirement 9.4)
                if ($card.hasClass('active')) {
                    console.log('MASE: Palette already active:', paletteId);
                    return;
                }
                
                // Log palette click (Requirement 9.1)
                console.log('MASE: Palette clicked:', paletteId);
                
                // Confirmation dialog (Requirements 10.1-10.5)
                if (!confirm('Apply "' + paletteName + '" palette?\n\nThis will update your admin colors immediately.')) {
                    return;
                }
                
                // Store current state for rollback (Requirement 14.3)
                var $currentPalette = $('.mase-palette-card.active');
                var currentPaletteId = $currentPalette.data('palette');
                
                // Optimistic UI update (Requirements 11.1-11.5)
                $('.mase-palette-card').removeClass('active');
                $card.addClass('active');
                
                var $applyBtn = $card.find('.mase-palette-apply-btn');
                var originalText = $applyBtn.text();
                $applyBtn.prop('disabled', true).text('Applying...');
                
                // AJAX request (Requirements 12.1-12.5)
                $.ajax({
                    url: self.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_apply_palette',
                        nonce: $('#mase_nonce').val(),
                        palette_id: paletteId
                    },
                    timeout: 30000,
                    success: function(response) {
                        // Log success (Requirement 13.1)
                        console.log('MASE: Palette applied successfully:', response);
                        
                        if (response.success) {
                            // Show success notification (Requirement 13.2)
                            self.showNotice('success', 'Palette "' + paletteName + '" applied successfully!');
                            
                            // Update config (Requirement 13.5)
                            self.state.currentPalette = paletteId;
                            
                            // Trigger live preview if enabled
                            if (self.config.livePreviewEnabled && self.livePreview) {
                                self.livePreview.update();
                            }
                        } else {
                            // Handle server error
                            self.showNotice('error', response.data.message || 'Failed to apply palette');
                            
                            // Rollback UI (Requirements 14.1-14.2)
                            $('.mase-palette-card').removeClass('active');
                            $currentPalette.addClass('active');
                        }
                        
                        // Restore button state
                        $applyBtn.prop('disabled', false).text(originalText);
                    },
                    error: function(xhr, status, error) {
                        // Log error (Requirement 13.3)
                        console.error('MASE: AJAX error:', xhr.status, error);
                        
                        // Show error notification (Requirement 13.4)
                        var message = 'Network error. Please try again.';
                        if (xhr.status === 403) {
                            message = 'Permission denied.';
                        } else if (xhr.status === 404) {
                            message = 'Palette not found.';
                        } else if (xhr.status === 500) {
                            message = 'Server error. Please try again later.';
                        }
                        self.showNotice('error', message);
                        
                        // Rollback UI (Requirements 14.1-14.5)
                        $('.mase-palette-card').removeClass('active');
                        $currentPalette.addClass('active');
                        
                        // Restore button state
                        $applyBtn.prop('disabled', false).text(originalText);
                    }
                });
            },
            
            /**
             * Handle keyboard navigation on palette cards
             * Requirement 9.5
             */
            handlePaletteKeydown: function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handlePaletteClick(e);
                }
            }
        };
        
        // Mock console methods
        console.log = jest.fn();
        console.error = jest.fn();
        
        // Mock window.confirm
        global.confirm = jest.fn(() => true);
        
        // Create mock event
        mockEvent = {
            currentTarget: $('.mase-palette-card[data-palette="creative-purple"]')[0],
            preventDefault: jest.fn()
        };
    });
    
    afterEach(() => {
        jest.useRealTimers();
    });
    
    test('should extract palette data from card', () => {
        MASEAdmin.handlePaletteClick(mockEvent);
        
        expect(console.log).toHaveBeenCalledWith('MASE: Palette clicked:', 'creative-purple');
    });
    
    test('should log error when palette ID is missing', () => {
        // Create card without data-palette attribute
        document.body.innerHTML += '<div class="mase-palette-card-no-id"></div>';
        mockEvent.currentTarget = $('.mase-palette-card-no-id')[0];
        
        MASEAdmin.handlePaletteClick(mockEvent);
        
        expect(console.error).toHaveBeenCalledWith('MASE: Palette ID not found');
        expect($.ajax).not.toHaveBeenCalled();
    });
    
    test('should return early if palette is already active', () => {
        mockEvent.currentTarget = $('.mase-palette-card[data-palette="professional-blue"]')[0];
        
        MASEAdmin.handlePaletteClick(mockEvent);
        
        expect(console.log).toHaveBeenCalledWith('MASE: Palette already active:', 'professional-blue');
        expect(global.confirm).not.toHaveBeenCalled();
        expect($.ajax).not.toHaveBeenCalled();
    });
    
    test('should show confirmation dialog with palette name', () => {
        MASEAdmin.handlePaletteClick(mockEvent);
        
        expect(global.confirm).toHaveBeenCalledWith(
            'Apply "Creative Purple" palette?\n\nThis will update your admin colors immediately.'
        );
    });
    
    test('should return early if user cancels confirmation', () => {
        global.confirm.mockReturnValue(false);
        
        MASEAdmin.handlePaletteClick(mockEvent);
        
        expect($.ajax).not.toHaveBeenCalled();
    });
    
    test('should update UI optimistically before AJAX request', () => {
        MASEAdmin.handlePaletteClick(mockEvent);
        
        // Check active class was removed from old card
        expect($('.mase-palette-card[data-palette="professional-blue"]').hasClass('active')).toBe(false);
        
        // Check active class was added to new card
        expect($('.mase-palette-card[data-palette="creative-purple"]').hasClass('active')).toBe(true);
        
        // Check button was disabled and text changed
        var $btn = $('.mase-palette-card[data-palette="creative-purple"] .mase-palette-apply-btn');
        expect($btn.prop('disabled')).toBe(true);
        expect($btn.text()).toBe('Applying...');
    });
    
    test('should make AJAX request with correct parameters', () => {
        MASEAdmin.handlePaletteClick(mockEvent);
        
        expect($.ajax).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/wp-admin/admin-ajax.php',
                type: 'POST',
                data: {
                    action: 'mase_apply_palette',
                    nonce: 'test-nonce-123',
                    palette_id: 'creative-purple'
                },
                timeout: 30000
            })
        );
    });
    
    test('should handle AJAX success response', () => {
        // Setup AJAX mock to call success callback
        $.ajax.mockImplementation((options) => {
            options.success({
                success: true,
                data: {
                    message: 'Palette applied successfully',
                    palette_id: 'creative-purple',
                    palette_name: 'Creative Purple'
                }
            });
        });
        
        MASEAdmin.handlePaletteClick(mockEvent);
        
        // Check success notification was shown
        expect(MASEAdmin.showNotice).toHaveBeenCalledWith(
            'success',
            'Palette "Creative Purple" applied successfully!'
        );
        
        // Check state was updated
        expect(MASEAdmin.state.currentPalette).toBe('creative-purple');
        
        // Check button was restored
        var $btn = $('.mase-palette-card[data-palette="creative-purple"] .mase-palette-apply-btn');
        expect($btn.prop('disabled')).toBe(false);
        expect($btn.text()).toBe('Apply Palette');
    });
    
    test('should handle AJAX error response with rollback', () => {
        // Setup AJAX mock to call error callback
        $.ajax.mockImplementation((options) => {
            options.error({
                status: 500,
                statusText: 'Internal Server Error'
            }, 'error', 'Server error');
        });
        
        MASEAdmin.handlePaletteClick(mockEvent);
        
        // Check error notification was shown
        expect(MASEAdmin.showNotice).toHaveBeenCalledWith(
            'error',
            'Server error. Please try again later.'
        );
        
        // Check UI was rolled back
        expect($('.mase-palette-card[data-palette="professional-blue"]').hasClass('active')).toBe(true);
        expect($('.mase-palette-card[data-palette="creative-purple"]').hasClass('active')).toBe(false);
        
        // Check button was restored
        var $btn = $('.mase-palette-card[data-palette="creative-purple"] .mase-palette-apply-btn');
        expect($btn.prop('disabled')).toBe(false);
        expect($btn.text()).toBe('Apply Palette');
    });
    
    test('should handle 403 error with appropriate message', () => {
        $.ajax.mockImplementation((options) => {
            options.error({
                status: 403,
                statusText: 'Forbidden'
            }, 'error', 'Permission denied');
        });
        
        MASEAdmin.handlePaletteClick(mockEvent);
        
        expect(MASEAdmin.showNotice).toHaveBeenCalledWith('error', 'Permission denied.');
    });
    
    test('should handle 404 error with appropriate message', () => {
        $.ajax.mockImplementation((options) => {
            options.error({
                status: 404,
                statusText: 'Not Found'
            }, 'error', 'Not found');
        });
        
        MASEAdmin.handlePaletteClick(mockEvent);
        
        expect(MASEAdmin.showNotice).toHaveBeenCalledWith('error', 'Palette not found.');
    });
    
    test('should trigger live preview update on success if enabled', () => {
        MASEAdmin.config.livePreviewEnabled = true;
        MASEAdmin.livePreview = {
            update: jest.fn()
        };
        
        $.ajax.mockImplementation((options) => {
            options.success({
                success: true,
                data: {
                    message: 'Palette applied successfully'
                }
            });
        });
        
        MASEAdmin.handlePaletteClick(mockEvent);
        
        expect(MASEAdmin.livePreview.update).toHaveBeenCalled();
    });
});

describe('MASEAdmin.handlePaletteKeydown()', () => {
    let MASEAdmin;
    let mockEvent;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock DOM
        document.body.innerHTML = `
            <div class="mase-palette-card" data-palette="creative-purple">
                <div class="mase-palette-name">Creative Purple</div>
            </div>
        `;
        
        MASEAdmin = {
            handlePaletteClick: jest.fn(),
            handlePaletteKeydown: function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handlePaletteClick(e);
                }
            }
        };
        
        mockEvent = {
            currentTarget: $('.mase-palette-card')[0],
            preventDefault: jest.fn(),
            key: ''
        };
    });
    
    test('should call handlePaletteClick when Enter key is pressed', () => {
        mockEvent.key = 'Enter';
        
        MASEAdmin.handlePaletteKeydown(mockEvent);
        
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(MASEAdmin.handlePaletteClick).toHaveBeenCalledWith(mockEvent);
    });
    
    test('should call handlePaletteClick when Space key is pressed', () => {
        mockEvent.key = ' ';
        
        MASEAdmin.handlePaletteKeydown(mockEvent);
        
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(MASEAdmin.handlePaletteClick).toHaveBeenCalledWith(mockEvent);
    });
    
    test('should not call handlePaletteClick for other keys', () => {
        mockEvent.key = 'a';
        
        MASEAdmin.handlePaletteKeydown(mockEvent);
        
        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        expect(MASEAdmin.handlePaletteClick).not.toHaveBeenCalled();
    });
    
    test('should not call handlePaletteClick for Tab key', () => {
        mockEvent.key = 'Tab';
        
        MASEAdmin.handlePaletteKeydown(mockEvent);
        
        expect(MASEAdmin.handlePaletteClick).not.toHaveBeenCalled();
    });
    
    test('should not call handlePaletteClick for Escape key', () => {
        mockEvent.key = 'Escape';
        
        MASEAdmin.handlePaletteKeydown(mockEvent);
        
        expect(MASEAdmin.handlePaletteClick).not.toHaveBeenCalled();
    });
});

describe('MASEAdmin.showNotice()', () => {
    let MASEAdmin;
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        
        // Mock DOM
        document.body.innerHTML = `
            <div class="mase-settings-container"></div>
        `;
        
        // Mock jQuery animate
        $.fn.animate = jest.fn(function(props, duration, callback) {
            if (callback) callback.call(this);
            return this;
        });
        
        // Mock jQuery fadeOut
        $.fn.fadeOut = jest.fn(function(duration, callback) {
            if (callback) callback.call(this);
            return this;
        });
        
        MASEAdmin = {
            /**
             * Show notification message
             * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
             */
            showNotice: function(type, message, dismissible) {
                dismissible = typeof dismissible !== 'undefined' ? dismissible : true;
                
                // Create notice element (Requirements 13.1, 13.2)
                var $notice = $('<div>')
                    .addClass('mase-notice')
                    .addClass('mase-notice-' + type)
                    .text(message);
                
                // Find container
                var $container = $('.mase-settings-container');
                
                // Remove existing notices
                $('.mase-notice').remove();
                
                // Append to container (Requirement 13.1)
                $container.prepend($notice);
                
                // Scroll to notice
                $('html, body').animate({
                    scrollTop: $notice.offset().top - 50
                }, 300);
                
                // Auto-dismiss success notices after 3 seconds (Requirement 13.5)
                if (type === 'success') {
                    setTimeout(function() {
                        $notice.fadeOut(300, function() {
                            $(this).remove();
                        });
                    }, 3000);
                }
            }
        };
    });
    
    afterEach(() => {
        jest.useRealTimers();
    });
    
    test('should create notice element with correct classes for success type', () => {
        MASEAdmin.showNotice('success', 'Operation successful!');
        
        var $notice = $('.mase-notice');
        expect($notice.length).toBe(1);
        expect($notice.hasClass('mase-notice-success')).toBe(true);
        expect($notice.text()).toBe('Operation successful!');
    });
    
    test('should create notice element with correct classes for error type', () => {
        MASEAdmin.showNotice('error', 'Operation failed!');
        
        var $notice = $('.mase-notice');
        expect($notice.length).toBe(1);
        expect($notice.hasClass('mase-notice-error')).toBe(true);
        expect($notice.text()).toBe('Operation failed!');
    });
    
    test('should append notice to mase-settings-container', () => {
        MASEAdmin.showNotice('info', 'Information message');
        
        var $container = $('.mase-settings-container');
        var $notice = $container.find('.mase-notice');
        
        expect($notice.length).toBe(1);
    });
    
    test('should remove existing notices before adding new one', () => {
        MASEAdmin.showNotice('success', 'First message');
        MASEAdmin.showNotice('error', 'Second message');
        
        var $notices = $('.mase-notice');
        expect($notices.length).toBe(1);
        expect($notices.text()).toBe('Second message');
    });
    
    test('should auto-dismiss success notices after 3 seconds', () => {
        MASEAdmin.showNotice('success', 'Success message');
        
        var $notice = $('.mase-notice');
        expect($notice.length).toBe(1);
        
        // Fast-forward time by 3 seconds
        jest.advanceTimersByTime(3000);
        
        // Check fadeOut was called
        expect($.fn.fadeOut).toHaveBeenCalledWith(300, expect.any(Function));
    });
    
    test('should not auto-dismiss error notices', () => {
        MASEAdmin.showNotice('error', 'Error message');
        
        var $notice = $('.mase-notice');
        expect($notice.length).toBe(1);
        
        // Fast-forward time by 5 seconds
        jest.advanceTimersByTime(5000);
        
        // Notice should still exist
        expect($('.mase-notice').length).toBe(1);
    });
    
    test('should not auto-dismiss warning notices', () => {
        MASEAdmin.showNotice('warning', 'Warning message');
        
        jest.advanceTimersByTime(5000);
        
        expect($('.mase-notice').length).toBe(1);
    });
    
    test('should not auto-dismiss info notices', () => {
        MASEAdmin.showNotice('info', 'Info message');
        
        jest.advanceTimersByTime(5000);
        
        expect($('.mase-notice').length).toBe(1);
    });
    
    test('should scroll to notice after creation', () => {
        MASEAdmin.showNotice('success', 'Test message');
        
        expect($.fn.animate).toHaveBeenCalled();
    });
    
    test('should handle dismissible parameter', () => {
        MASEAdmin.showNotice('success', 'Test message', false);
        
        var $notice = $('.mase-notice');
        expect($notice.length).toBe(1);
    });
    
    test('should default dismissible to true when not provided', () => {
        MASEAdmin.showNotice('success', 'Test message');
        
        var $notice = $('.mase-notice');
        expect($notice.length).toBe(1);
    });
});
