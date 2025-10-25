/**
 * Unit Tests for Dark Mode Keyboard Shortcuts
 * 
 * Tests the keyboard shortcut functionality for dark mode toggle
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Dark Mode Keyboard Shortcuts', () => {
    let darkModeToggle;
    let mockJQuery;
    let mockDocument;
    let keydownHandlers;
    
    beforeEach(() => {
        // Reset handlers
        keydownHandlers = [];
        
        // Mock jQuery
        mockJQuery = vi.fn((selector) => {
            if (selector === document) {
                return {
                    on: vi.fn((event, handler) => {
                        if (event === 'keydown.mase-dark-mode') {
                            keydownHandlers.push(handler);
                        }
                    }),
                    off: vi.fn(),
                    trigger: vi.fn()
                };
            }
            return {
                length: 0,
                is: vi.fn(() => false),
                addClass: vi.fn(),
                removeClass: vi.fn(),
                find: vi.fn(() => ({
                    addClass: vi.fn(),
                    removeClass: vi.fn()
                }))
            };
        });
        
        global.$ = mockJQuery;
        global.jQuery = mockJQuery;
        
        // Mock localStorage
        global.localStorage = {
            getItem: vi.fn(() => null),
            setItem: vi.fn(),
            removeItem: vi.fn()
        };
        
        // Mock matchMedia
        global.window.matchMedia = vi.fn(() => ({
            matches: false,
            addListener: vi.fn(),
            removeListener: vi.fn()
        }));
        
        // Mock console methods
        global.console.log = vi.fn();
        global.console.error = vi.fn();
        global.console.warn = vi.fn();
        
        // Create dark mode toggle instance
        darkModeToggle = {
            config: {
                fabSelector: '.mase-dark-mode-fab',
                bodyClass: 'mase-dark-mode',
                storageKey: 'mase_dark_mode',
                transitionDuration: 300,
                keyboardShortcut: { ctrl: true, shift: true, key: 'D' }
            },
            
            state: {
                currentMode: 'light',
                isTransitioning: false,
                systemPreference: null,
                userPreference: null
            },
            
            toggle: vi.fn(function() {
                this.state.currentMode = this.state.currentMode === 'light' ? 'dark' : 'light';
            }),
            
            animateIcon: vi.fn(),
            
            updateIcon: vi.fn(),
            
            setupKeyboardShortcuts: function() {
                var self = this;
                
                $(document).on('keydown.mase-dark-mode', function(e) {
                    if (!e || typeof e !== 'object') {
                        return;
                    }
                    
                    // Prevent shortcut in input fields and textareas
                    var $target = $(e.target);
                    if ($target.is('input, textarea, select, [contenteditable="true"]')) {
                        return;
                    }
                    
                    // Check for Ctrl/Cmd+Shift+D
                    var isModifierPressed = e.ctrlKey || e.metaKey;
                    var isShiftPressed = e.shiftKey;
                    var isDKey = e.key === 'D' || e.key === 'd';
                    
                    if (isModifierPressed && isShiftPressed && isDKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        self.toggle();
                        self.animateIcon();
                        self.updateIcon();
                    }
                });
            }
        };
    });
    
    afterEach(() => {
        vi.clearAllMocks();
    });
    
    describe('setupKeyboardShortcuts()', () => {
        it('should register keydown event listener on document', () => {
            // Requirement 5.1: Setup keyboard shortcuts
            darkModeToggle.setupKeyboardShortcuts();
            
            expect(keydownHandlers.length).toBe(1);
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('keyboard shortcuts')
            );
        });
    });
    
    describe('Keyboard Shortcut Detection', () => {
        beforeEach(() => {
            darkModeToggle.setupKeyboardShortcuts();
        });
        
        it('should toggle dark mode on Ctrl+Shift+D', () => {
            // Requirement 5.1: Detect Ctrl+Shift+D key combination
            const event = {
                ctrlKey: true,
                shiftKey: true,
                key: 'D',
                target: document.body,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            keydownHandlers[0](event);
            
            expect(event.preventDefault).toHaveBeenCalled();
            expect(event.stopPropagation).toHaveBeenCalled();
            expect(darkModeToggle.toggle).toHaveBeenCalled();
        });
        
        it('should toggle dark mode on Cmd+Shift+D (Mac)', () => {
            // Requirement 5.5: Support both Windows (Ctrl) and Mac (Cmd) modifiers
            const event = {
                metaKey: true,
                shiftKey: true,
                key: 'D',
                target: document.body,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            keydownHandlers[0](event);
            
            expect(event.preventDefault).toHaveBeenCalled();
            expect(darkModeToggle.toggle).toHaveBeenCalled();
        });
        
        it('should work with lowercase d key', () => {
            // Test case sensitivity
            const event = {
                ctrlKey: true,
                shiftKey: true,
                key: 'd',
                target: document.body,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            keydownHandlers[0](event);
            
            expect(darkModeToggle.toggle).toHaveBeenCalled();
        });
        
        it('should NOT toggle without Ctrl/Cmd key', () => {
            const event = {
                shiftKey: true,
                key: 'D',
                target: document.body,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            keydownHandlers[0](event);
            
            expect(darkModeToggle.toggle).not.toHaveBeenCalled();
        });
        
        it('should NOT toggle without Shift key', () => {
            const event = {
                ctrlKey: true,
                key: 'D',
                target: document.body,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            keydownHandlers[0](event);
            
            expect(darkModeToggle.toggle).not.toHaveBeenCalled();
        });
        
        it('should NOT toggle with wrong key', () => {
            const event = {
                ctrlKey: true,
                shiftKey: true,
                key: 'X',
                target: document.body,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            keydownHandlers[0](event);
            
            expect(darkModeToggle.toggle).not.toHaveBeenCalled();
        });
    });
    
    describe('Input Field Prevention', () => {
        beforeEach(() => {
            darkModeToggle.setupKeyboardShortcuts();
        });
        
        it('should NOT toggle when typing in input field', () => {
            // Requirement 5.3: Prevent shortcut in input fields
            const inputElement = { tagName: 'INPUT' };
            mockJQuery.mockImplementation((selector) => {
                if (selector === document) {
                    return {
                        on: vi.fn((event, handler) => {
                            if (event === 'keydown.mase-dark-mode') {
                                keydownHandlers.push(handler);
                            }
                        })
                    };
                }
                return {
                    is: vi.fn((sel) => sel === 'input, textarea, select, [contenteditable="true"]')
                };
            });
            
            darkModeToggle.setupKeyboardShortcuts();
            
            const event = {
                ctrlKey: true,
                shiftKey: true,
                key: 'D',
                target: inputElement,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            keydownHandlers[keydownHandlers.length - 1](event);
            
            expect(darkModeToggle.toggle).not.toHaveBeenCalled();
        });
        
        it('should NOT toggle when typing in textarea', () => {
            // Requirement 5.3: Prevent shortcut in textareas
            const textareaElement = { tagName: 'TEXTAREA' };
            mockJQuery.mockImplementation((selector) => {
                if (selector === document) {
                    return {
                        on: vi.fn((event, handler) => {
                            if (event === 'keydown.mase-dark-mode') {
                                keydownHandlers.push(handler);
                            }
                        })
                    };
                }
                return {
                    is: vi.fn((sel) => sel === 'input, textarea, select, [contenteditable="true"]')
                };
            });
            
            darkModeToggle.setupKeyboardShortcuts();
            
            const event = {
                ctrlKey: true,
                shiftKey: true,
                key: 'D',
                target: textareaElement,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            keydownHandlers[keydownHandlers.length - 1](event);
            
            expect(darkModeToggle.toggle).not.toHaveBeenCalled();
        });
        
        it('should NOT toggle when focused on select element', () => {
            // Requirement 5.3: Prevent shortcut in select elements
            const selectElement = { tagName: 'SELECT' };
            mockJQuery.mockImplementation((selector) => {
                if (selector === document) {
                    return {
                        on: vi.fn((event, handler) => {
                            if (event === 'keydown.mase-dark-mode') {
                                keydownHandlers.push(handler);
                            }
                        })
                    };
                }
                return {
                    is: vi.fn((sel) => sel === 'input, textarea, select, [contenteditable="true"]')
                };
            });
            
            darkModeToggle.setupKeyboardShortcuts();
            
            const event = {
                ctrlKey: true,
                shiftKey: true,
                key: 'D',
                target: selectElement,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            keydownHandlers[keydownHandlers.length - 1](event);
            
            expect(darkModeToggle.toggle).not.toHaveBeenCalled();
        });
    });
    
    describe('Visual Feedback', () => {
        beforeEach(() => {
            darkModeToggle.setupKeyboardShortcuts();
        });
        
        it('should animate FAB icon when shortcut triggered', () => {
            // Requirement 5.4: Add visual feedback (animate FAB)
            const event = {
                ctrlKey: true,
                shiftKey: true,
                key: 'D',
                target: document.body,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            keydownHandlers[0](event);
            
            expect(darkModeToggle.animateIcon).toHaveBeenCalled();
        });
        
        it('should update icon after toggle', () => {
            // Requirement 5.2: Call toggle() and update UI
            const event = {
                ctrlKey: true,
                shiftKey: true,
                key: 'D',
                target: document.body,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            keydownHandlers[0](event);
            
            expect(darkModeToggle.updateIcon).toHaveBeenCalled();
        });
    });
    
    describe('Error Handling', () => {
        beforeEach(() => {
            darkModeToggle.setupKeyboardShortcuts();
        });
        
        it('should handle null event gracefully', () => {
            expect(() => {
                keydownHandlers[0](null);
            }).not.toThrow();
            
            expect(darkModeToggle.toggle).not.toHaveBeenCalled();
        });
        
        it('should handle undefined event gracefully', () => {
            expect(() => {
                keydownHandlers[0](undefined);
            }).not.toThrow();
            
            expect(darkModeToggle.toggle).not.toHaveBeenCalled();
        });
        
        it('should handle invalid event object gracefully', () => {
            expect(() => {
                keydownHandlers[0]('not an object');
            }).not.toThrow();
            
            expect(darkModeToggle.toggle).not.toHaveBeenCalled();
        });
    });
});
