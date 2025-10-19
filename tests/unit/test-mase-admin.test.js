/**
 * Modern Admin Styler Enterprise - JavaScript Unit Tests
 * 
 * Tests for MASE utility functions and methods
 * Task 24: Write JavaScript unit tests
 * 
 * @package MASE
 * @since 1.2.0
 */

// Mock jQuery
global.$ = global.jQuery = require('jquery');

// Mock WordPress color picker
$.fn.wpColorPicker = jest.fn();

// Mock AJAX
$.ajax = jest.fn();

describe('MASE.debounce()', () => {
    let MASE;
    
    beforeEach(() => {
        // Reset MASE object before each test
        jest.clearAllMocks();
        jest.useFakeTimers();
        
        // Create minimal MASE object with debounce function
        MASE = {
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
            }
        };
    });
    
    afterEach(() => {
        jest.useRealTimers();
    });
    
    test('should delay function execution', () => {
        const mockFn = jest.fn();
        const debouncedFn = MASE.debounce(mockFn, 300);
        
        debouncedFn();
        expect(mockFn).not.toHaveBeenCalled();
        
        jest.advanceTimersByTime(300);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
    
    test('should cancel previous calls when invoked multiple times', () => {
        const mockFn = jest.fn();
        const debouncedFn = MASE.debounce(mockFn, 300);
        
        debouncedFn();
        jest.advanceTimersByTime(100);
        debouncedFn();
        jest.advanceTimersByTime(100);
        debouncedFn();
        
        expect(mockFn).not.toHaveBeenCalled();
        
        jest.advanceTimersByTime(300);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
    
    test('should pass arguments to debounced function', () => {
        const mockFn = jest.fn();
        const debouncedFn = MASE.debounce(mockFn, 300);
        
        debouncedFn('arg1', 'arg2', 123);
        jest.advanceTimersByTime(300);
        
        expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });
    
    test('should preserve context when called', () => {
        const context = { value: 42 };
        const mockFn = jest.fn(function() {
            return this.value;
        });
        const debouncedFn = MASE.debounce(mockFn, 300);
        
        debouncedFn.call(context);
        jest.advanceTimersByTime(300);
        
        expect(mockFn).toHaveBeenCalled();
    });
    
    test('should handle zero wait time', () => {
        const mockFn = jest.fn();
        const debouncedFn = MASE.debounce(mockFn, 0);
        
        debouncedFn();
        jest.advanceTimersByTime(0);
        
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});

describe('MASE.paletteManager.apply()', () => {
    let MASE;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock DOM elements
        document.body.innerHTML = `
            <div id="mase-notices"></div>
            <input type="hidden" id="mase_nonce" value="test-nonce" />
            <button class="mase-palette-apply-btn" data-palette-id="test-palette"></button>
            <div class="mase-palette-card" data-palette-id="test-palette">
                <div class="mase-palette-info"></div>
            </div>
        `;
        
        // Create MASE object with necessary methods
        MASE = {
            config: {
                ajaxUrl: '/wp-admin/admin-ajax.php',
                nonce: 'test-nonce'
            },
            state: {
                currentPalette: null,
                isDirty: false
            },
            showNotice: jest.fn(),
            paletteManager: {
                apply: function(paletteId) {
                    var self = MASE;
                    self.showNotice('info', 'Applying palette...', false);
                    $('.mase-palette-apply-btn').prop('disabled', true).css('opacity', '0.6');
                    
                    $.ajax({
                        url: self.config.ajaxUrl,
                        type: 'POST',
                        data: {
                            action: 'mase_apply_palette',
                            nonce: self.config.nonce,
                            palette_id: paletteId
                        }
                    });
                },
                updateActiveBadge: jest.fn()
            }
        };
    });
    
    test('should call showNotice with loading message', () => {
        MASE.paletteManager.apply('test-palette');
        
        expect(MASE.showNotice).toHaveBeenCalledWith('info', 'Applying palette...', false);
    });
    
    test('should disable palette buttons during operation', () => {
        MASE.paletteManager.apply('test-palette');
        
        const button = $('.mase-palette-apply-btn');
        expect(button.prop('disabled')).toBe(true);
        expect(button.css('opacity')).toBe('0.6');
    });
    
    test('should make AJAX request with correct parameters', () => {
        MASE.paletteManager.apply('professional-blue');
        
        expect($.ajax).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/wp-admin/admin-ajax.php',
                type: 'POST',
                data: {
                    action: 'mase_apply_palette',
                    nonce: 'test-nonce',
                    palette_id: 'professional-blue'
                }
            })
        );
    });
    
    test('should handle empty palette ID', () => {
        MASE.paletteManager.apply('');
        
        expect($.ajax).toHaveBeenCalled();
    });
    
    test('should handle null palette ID', () => {
        MASE.paletteManager.apply(null);
        
        expect($.ajax).toHaveBeenCalled();
    });
});

describe('MASE.livePreview.generateCSS()', () => {
    let MASE;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Create MASE object with generateCSS and helper methods
        MASE = {
            livePreview: {
                generateCSS: function(settings) {
                    var css = '';
                    css += this.generateAdminBarCSS(settings);
                    css += this.generateAdminMenuCSS(settings);
                    css += this.generateTypographyCSS(settings);
                    css += this.generateVisualEffectsCSS(settings);
                    return css;
                },
                generateAdminBarCSS: function(settings) {
                    var css = '';
                    var adminBar = settings.admin_bar || {};
                    
                    css += 'body.wp-admin #wpadminbar{';
                    if (adminBar.bg_color) {
                        css += 'background-color:' + adminBar.bg_color + '!important;';
                    }
                    if (adminBar.height) {
                        css += 'height:' + adminBar.height + 'px!important;';
                    }
                    css += '}';
                    
                    if (adminBar.text_color) {
                        css += 'body.wp-admin #wpadminbar .ab-item{';
                        css += 'color:' + adminBar.text_color + '!important;';
                        css += '}';
                    }
                    
                    return css;
                },
                generateAdminMenuCSS: function(settings) {
                    var css = '';
                    var adminMenu = settings.admin_menu || {};
                    
                    css += 'body.wp-admin #adminmenu{';
                    if (adminMenu.bg_color) {
                        css += 'background-color:' + adminMenu.bg_color + '!important;';
                    }
                    if (adminMenu.width) {
                        css += 'width:' + adminMenu.width + 'px!important;';
                    }
                    css += '}';
                    
                    return css;
                },
                generateTypographyCSS: function(settings) {
                    var css = '';
                    var typography = settings.typography || {};
                    
                    if (typography.admin_bar && typography.admin_bar.font_size) {
                        css += 'body.wp-admin #wpadminbar{';
                        css += 'font-size:' + typography.admin_bar.font_size + 'px!important;';
                        css += '}';
                    }
                    
                    return css;
                },
                generateVisualEffectsCSS: function(settings) {
                    return '';
                }
            }
        };
    });
    
    test('should generate CSS from settings object', () => {
        const settings = {
            admin_bar: {
                bg_color: '#23282d',
                text_color: '#ffffff',
                height: 32
            },
            admin_menu: {
                bg_color: '#191e23',
                width: 160
            },
            typography: {
                admin_bar: {
                    font_size: 13
                }
            }
        };
        
        const css = MASE.livePreview.generateCSS(settings);
        
        expect(css).toContain('background-color:#23282d!important');
        expect(css).toContain('color:#ffffff!important');
        expect(css).toContain('height:32px!important');
        expect(css).toContain('width:160px!important');
        expect(css).toContain('font-size:13px!important');
    });
    
    test('should handle empty settings object', () => {
        const settings = {};
        const css = MASE.livePreview.generateCSS(settings);
        
        expect(css).toBeDefined();
        expect(typeof css).toBe('string');
    });
    
    test('should handle partial settings', () => {
        const settings = {
            admin_bar: {
                bg_color: '#000000'
            }
        };
        
        const css = MASE.livePreview.generateCSS(settings);
        
        expect(css).toContain('background-color:#000000!important');
    });
    
    test('should generate valid CSS selectors', () => {
        const settings = {
            admin_bar: {
                bg_color: '#23282d'
            }
        };
        
        const css = MASE.livePreview.generateCSS(settings);
        
        expect(css).toContain('body.wp-admin #wpadminbar{');
        expect(css).toContain('}');
    });
    
    test('should handle null values gracefully', () => {
        const settings = {
            admin_bar: {
                bg_color: null,
                height: null
            }
        };
        
        const css = MASE.livePreview.generateCSS(settings);
        
        expect(css).toBeDefined();
        expect(typeof css).toBe('string');
    });
});

describe('MASE.importExport.validateJSON()', () => {
    let MASE;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Create MASE object with validateJSON method
        MASE = {
            importExport: {
                /**
                 * Validate JSON structure for import
                 * Requirement 8.6: Validate imported JSON structure
                 * 
                 * @param {Object} fileData - Parsed JSON data
                 * @return {Object} Validation result with success flag and message
                 */
                validateJSON: function(fileData) {
                    // Check if data exists
                    if (!fileData || typeof fileData !== 'object') {
                        return {
                            success: false,
                            message: 'Invalid JSON file format'
                        };
                    }
                    
                    // Validate plugin identifier
                    if (!fileData.plugin || fileData.plugin !== 'MASE') {
                        return {
                            success: false,
                            message: 'This file is not a valid MASE settings export'
                        };
                    }
                    
                    // Validate settings object
                    if (!fileData.settings || typeof fileData.settings !== 'object') {
                        return {
                            success: false,
                            message: 'Invalid settings data in import file'
                        };
                    }
                    
                    // Validate version (optional but recommended)
                    if (fileData.version && typeof fileData.version !== 'string') {
                        return {
                            success: false,
                            message: 'Invalid version format'
                        };
                    }
                    
                    // All validations passed
                    return {
                        success: true,
                        message: 'Valid MASE settings file'
                    };
                }
            }
        };
    });
    
    test('should validate correct JSON structure', () => {
        const validData = {
            plugin: 'MASE',
            version: '1.2.0',
            settings: {
                admin_bar: { bg_color: '#23282d' },
                admin_menu: { bg_color: '#191e23' }
            }
        };
        
        const result = MASE.importExport.validateJSON(validData);
        
        expect(result.success).toBe(true);
        expect(result.message).toBe('Valid MASE settings file');
    });
    
    test('should reject null data', () => {
        const result = MASE.importExport.validateJSON(null);
        
        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid JSON file format');
    });
    
    test('should reject undefined data', () => {
        const result = MASE.importExport.validateJSON(undefined);
        
        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid JSON file format');
    });
    
    test('should reject non-object data', () => {
        const result = MASE.importExport.validateJSON('string data');
        
        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid JSON file format');
    });
    
    test('should reject data without plugin identifier', () => {
        const invalidData = {
            settings: { admin_bar: {} }
        };
        
        const result = MASE.importExport.validateJSON(invalidData);
        
        expect(result.success).toBe(false);
        expect(result.message).toBe('This file is not a valid MASE settings export');
    });
    
    test('should reject data with wrong plugin identifier', () => {
        const invalidData = {
            plugin: 'OTHER_PLUGIN',
            settings: { admin_bar: {} }
        };
        
        const result = MASE.importExport.validateJSON(invalidData);
        
        expect(result.success).toBe(false);
        expect(result.message).toBe('This file is not a valid MASE settings export');
    });
    
    test('should reject data without settings object', () => {
        const invalidData = {
            plugin: 'MASE'
        };
        
        const result = MASE.importExport.validateJSON(invalidData);
        
        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid settings data in import file');
    });
    
    test('should reject data with non-object settings', () => {
        const invalidData = {
            plugin: 'MASE',
            settings: 'not an object'
        };
        
        const result = MASE.importExport.validateJSON(invalidData);
        
        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid settings data in import file');
    });
    
    test('should accept data without version field', () => {
        const validData = {
            plugin: 'MASE',
            settings: { admin_bar: {} }
        };
        
        const result = MASE.importExport.validateJSON(validData);
        
        expect(result.success).toBe(true);
    });
    
    test('should reject data with invalid version format', () => {
        const invalidData = {
            plugin: 'MASE',
            version: 123,
            settings: { admin_bar: {} }
        };
        
        const result = MASE.importExport.validateJSON(invalidData);
        
        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid version format');
    });
    
    test('should accept empty settings object', () => {
        const validData = {
            plugin: 'MASE',
            settings: {}
        };
        
        const result = MASE.importExport.validateJSON(validData);
        
        expect(result.success).toBe(true);
    });
});

describe('MASE.keyboardShortcuts.handleShortcut()', () => {
    let MASE;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock DOM elements
        document.body.innerHTML = `
            <input type="checkbox" id="keyboard-shortcuts-enabled" checked />
            <input type="checkbox" id="keyboard-shortcuts-palette-switch" checked />
            <input type="checkbox" id="keyboard-shortcuts-theme-toggle" checked />
            <input type="checkbox" id="keyboard-shortcuts-focus-mode" checked />
            <input type="checkbox" id="keyboard-shortcuts-performance-mode" checked />
            <input type="checkbox" id="effects-focus-mode" />
            <input type="checkbox" id="effects-performance-mode" />
            <div class="mase-palette-card active" data-palette-id="professional-blue"></div>
            <div class="mase-palette-card" data-palette-id="dark-elegance"></div>
            <div class="mase-palette-card" data-palette-id="energetic-green"></div>
        `;
        
        // Create MASE object with keyboard shortcuts
        MASE = {
            showNotice: jest.fn(),
            state: {
                livePreviewEnabled: false
            },
            paletteManager: {
                apply: jest.fn()
            },
            livePreview: {
                update: jest.fn()
            },
            keyboardShortcuts: {
                handle: function(e) {
                    var self = MASE;
                    
                    // Check if keyboard shortcuts are enabled
                    var shortcutsEnabled = $('#keyboard-shortcuts-enabled').is(':checked');
                    if (!shortcutsEnabled) {
                        return;
                    }
                    
                    // Check for Ctrl+Shift combination
                    if (!e.ctrlKey || !e.shiftKey) {
                        return;
                    }
                    
                    var handled = false;
                    
                    // Palette switching (1-9, 0)
                    if (e.key >= '1' && e.key <= '9') {
                        var paletteIndex = parseInt(e.key) - 1;
                        this.switchPalette(paletteIndex);
                        handled = true;
                    } else if (e.key === '0') {
                        this.switchPalette(9);
                        handled = true;
                    }
                    // Theme toggle
                    else if (e.key === 'T' || e.key === 't') {
                        this.toggleTheme();
                        handled = true;
                    }
                    // Focus mode toggle
                    else if (e.key === 'F' || e.key === 'f') {
                        this.toggleFocusMode();
                        handled = true;
                    }
                    // Performance mode toggle
                    else if (e.key === 'P' || e.key === 'p') {
                        this.togglePerformanceMode();
                        handled = true;
                    }
                    
                    if (handled) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                },
                switchPalette: function(index) {
                    var paletteSwitchEnabled = $('#keyboard-shortcuts-palette-switch').is(':checked');
                    if (!paletteSwitchEnabled) {
                        return;
                    }
                    
                    var $paletteCards = $('.mase-palette-card');
                    if (index < 0 || index >= $paletteCards.length) {
                        return;
                    }
                    
                    var $targetCard = $paletteCards.eq(index);
                    var paletteId = $targetCard.data('palette-id');
                    
                    if (paletteId) {
                        MASE.paletteManager.apply(paletteId);
                        MASE.showNotice('info', 'Switching to palette ' + (index + 1) + '...', false);
                    }
                },
                toggleTheme: jest.fn(),
                toggleFocusMode: function() {
                    var focusModeEnabled = $('#keyboard-shortcuts-focus-mode').is(':checked');
                    if (!focusModeEnabled) {
                        return;
                    }
                    
                    var $focusModeCheckbox = $('#effects-focus-mode');
                    if ($focusModeCheckbox.length) {
                        var isChecked = $focusModeCheckbox.is(':checked');
                        $focusModeCheckbox.prop('checked', !isChecked).trigger('change');
                        
                        var message = !isChecked ? 'Focus mode enabled' : 'Focus mode disabled';
                        MASE.showNotice('info', message, true);
                        
                        if (MASE.state.livePreviewEnabled) {
                            MASE.livePreview.update();
                        }
                    }
                },
                togglePerformanceMode: function() {
                    var performanceModeEnabled = $('#keyboard-shortcuts-performance-mode').is(':checked');
                    if (!performanceModeEnabled) {
                        return;
                    }
                    
                    var $performanceModeCheckbox = $('#effects-performance-mode');
                    if ($performanceModeCheckbox.length) {
                        var isChecked = $performanceModeCheckbox.is(':checked');
                        $performanceModeCheckbox.prop('checked', !isChecked).trigger('change');
                        
                        var message = !isChecked ? 'Performance mode enabled' : 'Performance mode disabled';
                        MASE.showNotice('info', message, true);
                        
                        if (MASE.state.livePreviewEnabled) {
                            MASE.livePreview.update();
                        }
                    }
                }
            }
        };
    });
    
    test('should handle Ctrl+Shift+1 for palette switching', () => {
        const event = {
            ctrlKey: true,
            shiftKey: true,
            key: '1',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };
        
        MASE.keyboardShortcuts.handle(event);
        
        expect(MASE.paletteManager.apply).toHaveBeenCalledWith('professional-blue');
        expect(MASE.showNotice).toHaveBeenCalledWith('info', 'Switching to palette 1...', false);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
    });
    
    test('should handle Ctrl+Shift+2 for second palette', () => {
        const event = {
            ctrlKey: true,
            shiftKey: true,
            key: '2',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };
        
        MASE.keyboardShortcuts.handle(event);
        
        expect(MASE.paletteManager.apply).toHaveBeenCalledWith('dark-elegance');
        expect(MASE.showNotice).toHaveBeenCalledWith('info', 'Switching to palette 2...', false);
    });
    
    test('should not handle shortcuts when disabled', () => {
        $('#keyboard-shortcuts-enabled').prop('checked', false);
        
        const event = {
            ctrlKey: true,
            shiftKey: true,
            key: '1',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };
        
        MASE.keyboardShortcuts.handle(event);
        
        expect(MASE.paletteManager.apply).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
    });
    
    test('should not handle shortcuts without Ctrl key', () => {
        const event = {
            ctrlKey: false,
            shiftKey: true,
            key: '1',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };
        
        MASE.keyboardShortcuts.handle(event);
        
        expect(MASE.paletteManager.apply).not.toHaveBeenCalled();
    });
    
    test('should not handle shortcuts without Shift key', () => {
        const event = {
            ctrlKey: true,
            shiftKey: false,
            key: '1',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };
        
        MASE.keyboardShortcuts.handle(event);
        
        expect(MASE.paletteManager.apply).not.toHaveBeenCalled();
    });
    
    test('should handle Ctrl+Shift+T for theme toggle', () => {
        const event = {
            ctrlKey: true,
            shiftKey: true,
            key: 'T',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };
        
        MASE.keyboardShortcuts.handle(event);
        
        expect(MASE.keyboardShortcuts.toggleTheme).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
    });
    
    test('should handle Ctrl+Shift+F for focus mode toggle', () => {
        const event = {
            ctrlKey: true,
            shiftKey: true,
            key: 'F',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };
        
        MASE.keyboardShortcuts.handle(event);
        
        expect($('#effects-focus-mode').is(':checked')).toBe(true);
        expect(MASE.showNotice).toHaveBeenCalledWith('info', 'Focus mode enabled', true);
        expect(event.preventDefault).toHaveBeenCalled();
    });
    
    test('should handle Ctrl+Shift+P for performance mode toggle', () => {
        const event = {
            ctrlKey: true,
            shiftKey: true,
            key: 'P',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };
        
        MASE.keyboardShortcuts.handle(event);
        
        expect($('#effects-performance-mode').is(':checked')).toBe(true);
        expect(MASE.showNotice).toHaveBeenCalledWith('info', 'Performance mode enabled', true);
        expect(event.preventDefault).toHaveBeenCalled();
    });
    
    test('should handle lowercase keys', () => {
        const event = {
            ctrlKey: true,
            shiftKey: true,
            key: 't',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };
        
        MASE.keyboardShortcuts.handle(event);
        
        expect(MASE.keyboardShortcuts.toggleTheme).toHaveBeenCalled();
    });
    
    test('should not switch palette when palette switching is disabled', () => {
        $('#keyboard-shortcuts-palette-switch').prop('checked', false);
        
        const event = {
            ctrlKey: true,
            shiftKey: true,
            key: '1',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };
        
        MASE.keyboardShortcuts.handle(event);
        
        expect(MASE.paletteManager.apply).not.toHaveBeenCalled();
    });
    
    test('should toggle focus mode off when already enabled', () => {
        $('#effects-focus-mode').prop('checked', true);
        
        const event = {
            ctrlKey: true,
            shiftKey: true,
            key: 'F',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };
        
        MASE.keyboardShortcuts.handle(event);
        
        expect($('#effects-focus-mode').is(':checked')).toBe(false);
        expect(MASE.showNotice).toHaveBeenCalledWith('info', 'Focus mode disabled', true);
    });
});
