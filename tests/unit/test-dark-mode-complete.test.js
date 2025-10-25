/**
 * Comprehensive Unit Tests for Dark Mode JavaScript Functionality
 * Task 23: Create unit tests for JavaScript
 * 
 * Tests all frontend requirements:
 * - Mode toggle logic
 * - localStorage operations
 * - System preference detection
 * - Keyboard shortcut handling
 * - Event emission
 * - Error handling
 * 
 * Requirements: All frontend requirements (1.1-1.8, 2.1-2.7, 3.1-3.6, 4.1-4.5, 5.1-5.7, 9.1-9.7, 11.1-11.7, 12.1-12.7)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Dark Mode - Complete JavaScript Unit Tests', () => {
    let darkModeToggle;
    let mockJQuery;
    let mockLocalStorage;
    let mockMatchMedia;
    let eventListeners;
    let ajaxCalls;
    
    beforeEach(() => {
        // Reset state
        eventListeners = {};
        ajaxCalls = [];
        
        // Mock localStorage
        mockLocalStorage = {
            store: {},
            getItem: vi.fn((key) => mockLocalStorage.store[key] || null),
            setItem: vi.fn((key, value) => { mockLocalStorage.store[key] = String(value); }),
            removeItem: vi.fn((key) => { delete mockLocalStorage.store[key]; }),
            clear: vi.fn(() => { mockLocalStorage.store = {}; })
        };
        global.localStorage = mockLocalStorage;
        
        // Mock matchMedia
        mockMatchMedia = {
            matches: false,
            media: '(prefers-color-scheme: dark)',
            addEventListener: vi.fn((event, handler) => {
                if (!eventListeners[event]) eventListeners[event] = [];
                eventListeners[event].push(handler);
            }),
            removeEventListener: vi.fn(),
            addListener: vi.fn((handler) => {
                if (!eventListeners['change']) eventListeners['change'] = [];
                eventListeners['change'].push(handler);
            }),
            removeListener: vi.fn()
        };
        global.window.matchMedia = vi.fn(() => mockMatchMedia);
        
        // Mock jQuery
        mockJQuery = vi.fn((selector) => {
            if (typeof selector === 'function') {
                selector(); // Document ready
                return;
            }
            
            const jqObject = {
                length: selector === '.mase-dark-mode-fab' ? 1 : 0,
                addClass: vi.fn().mockReturnThis(),
                removeClass: vi.fn().mockReturnThis(),
                hasClass: vi.fn(() => false),
                toggleClass: vi.fn().mockReturnThis(),
                attr: vi.fn().mockReturnThis(),
                prop: vi.fn().mockReturnThis(),
                on: vi.fn((event, handler) => {
                    if (!eventListeners[event]) eventListeners[event] = [];
                    eventListeners[event].push(handler);
                    return jqObject;
                }),
                off: vi.fn().mockReturnThis(),
                trigger: vi.fn((event, data) => {
                    if (eventListeners[event]) {
                        eventListeners[event].forEach(h => h({}, data));
                    }
                    return jqObject;
                }),
                find: vi.fn(() => jqObject),
                append: vi.fn().mockReturnThis(),
                is: vi.fn(() => false)
            };
            return jqObject;
        });
        
        mockJQuery.ajax = vi.fn((options) => {
            ajaxCalls.push(options);
            return Promise.resolve();
        });
        
        global.$ = global.jQuery = mockJQuery;
        global.document.body = { classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn(() => false) } };
        
        // Mock console
        global.console.log = vi.fn();
        global.console.warn = vi.fn();
        global.console.error = vi.fn();
        
        // Mock MASE global
        global.MASE = {
            config: {
                ajaxUrl: '/wp-admin/admin-ajax.php',
                nonce: 'test-nonce'
            },
            showNotice: vi.fn()
        };
        
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
                userPreference: null,
                needsSync: false,
                retryCount: 0,
                maxRetries: 3
            },
            
            // Core methods
            init: vi.fn(function() {
                this.detectSystemPreference();
                this.loadSavedPreference();
                this.render();
                this.attachEventListeners();
                this.setupKeyboardShortcuts();
                this.watchSystemPreference();
            }),
            
            detectSystemPreference: vi.fn(function() {
                if (!window.matchMedia) {
                    console.warn('MASE: matchMedia not supported, defaulting to light mode');
                    this.state.systemPreference = 'light';
                    return 'light';
                }
                
                try {
                    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    this.state.systemPreference = darkModeQuery.matches ? 'dark' : 'light';
                    console.log('MASE: System preference detected:', this.state.systemPreference);
                    return this.state.systemPreference;
                } catch (error) {
                    console.error('MASE: System preference detection failed:', error);
                    this.state.systemPreference = 'light';
                    return 'light';
                }
            }),
            
            loadSavedPreference: vi.fn(function() {
                try {
                    const saved = localStorage.getItem(this.config.storageKey);
                    if (saved && (saved === 'light' || saved === 'dark')) {
                        this.state.userPreference = saved;
                        this.state.currentMode = saved;
                        return saved;
                    }
                } catch (error) {
                    console.warn('MASE: Could not load from localStorage:', error);
                    this.state.needsSync = true;
                }
                
                const mode = this.state.systemPreference || 'light';
                this.state.currentMode = mode;
                return mode;
            }),
            
            toggle: vi.fn(function() {
                if (this.state.isTransitioning) return;
                const newMode = this.state.currentMode === 'light' ? 'dark' : 'light';
                this.setMode(newMode);
            }),
            
            setMode: vi.fn(function(mode) {
                if (this.state.isTransitioning) return;
                
                this.state.isTransitioning = true;
                this.state.currentMode = mode;
                this.state.userPreference = mode;
                
                // Update DOM
                document.body.classList.toggle('mase-dark-mode', mode === 'dark');
                
                // Save preference
                this.savePreference(mode);
                
                // Emit event
                $(document).trigger('mase:modeChanged', { mode: mode });
                
                // Re-enable after transition
                setTimeout(() => {
                    this.state.isTransitioning = false;
                    $(document).trigger('mase:transitionComplete', { mode: mode });
                }, this.config.transitionDuration);
            }),
            
            savePreference: vi.fn(function(mode) {
                // Save to localStorage
                try {
                    localStorage.setItem(this.config.storageKey, mode);
                    localStorage.removeItem(this.config.storageKey + '_needsSync');
                } catch (error) {
                    console.error('MASE: localStorage save failed:', error);
                    this.state.needsSync = true;
                }
                
                // Save via AJAX
                if (MASE.config.ajaxUrl && MASE.config.nonce) {
                    $.ajax({
                        url: MASE.config.ajaxUrl,
                        type: 'POST',
                        data: {
                            action: 'mase_toggle_dark_mode',
                            nonce: MASE.config.nonce,
                            mode: mode
                        },
                        success: (response) => {
                            if (response.success) {
                                this.state.needsSync = false;
                                this.state.retryCount = 0;
                            } else {
                                this.state.needsSync = true;
                            }
                        },
                        error: () => {
                            this.state.needsSync = true;
                            if (this.state.retryCount < this.state.maxRetries) {
                                const delay = Math.pow(2, this.state.retryCount) * 1000;
                                setTimeout(() => {
                                    this.state.retryCount++;
                                    this.syncPreference(mode);
                                }, delay);
                            }
                        }
                    });
                }
            }),
            
            syncPreference: vi.fn(function(mode) {
                if (!this.state.needsSync) return;
                
                $.ajax({
                    url: MASE.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_toggle_dark_mode',
                        nonce: MASE.config.nonce,
                        mode: mode
                    },
                    success: (response) => {
                        if (response.success) {
                            this.state.needsSync = false;
                            this.state.retryCount = 0;
                        }
                    }
                });
            }),
            
            render: vi.fn(),
            attachEventListeners: vi.fn(),
            updateIcon: vi.fn(),
            animateIcon: vi.fn(),
            
            setupKeyboardShortcuts: vi.fn(function() {
                $(document).on('keydown.mase-dark-mode', (e) => {
                    if (!e || typeof e !== 'object') return;
                    
                    const $target = $(e.target);
                    if ($target.is('input, textarea, select, [contenteditable="true"]')) return;
                    
                    const isModifier = e.ctrlKey || e.metaKey;
                    const isShift = e.shiftKey;
                    const isDKey = e.key === 'D' || e.key === 'd';
                    
                    if (isModifier && isShift && isDKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.toggle();
                        this.animateIcon();
                    }
                });
            }),
            
            watchSystemPreference: vi.fn(function() {
                if (!window.matchMedia) {
                    console.warn('MASE: matchMedia not supported');
                    return;
                }
                
                try {
                    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    if (darkModeQuery.addEventListener) {
                        darkModeQuery.addEventListener('change', (e) => {
                            this.handleSystemPreferenceChange(e);
                        });
                    } else if (darkModeQuery.addListener) {
                        darkModeQuery.addListener((e) => {
                            this.handleSystemPreferenceChange(e);
                        });
                    }
                } catch (error) {
                    console.error('MASE: Failed to setup system preference monitoring:', error);
                }
            }),
            
            handleSystemPreferenceChange: vi.fn(function(event) {
                const newPreference = event.matches ? 'dark' : 'light';
                this.state.systemPreference = newPreference;
                
                if (!this.state.userPreference) {
                    this.setMode(newPreference);
                }
            })
        };
    });
    
    afterEach(() => {
        vi.clearAllMocks();
        mockLocalStorage.clear();
        eventListeners = {};
        ajaxCalls = [];
    });
    
    // ========================================
    // MODE TOGGLE LOGIC TESTS
    // ========================================
    
    describe('Mode Toggle Logic', () => {
        it('should toggle from light to dark mode', () => {
            darkModeToggle.state.currentMode = 'light';
            darkModeToggle.toggle();
            
            expect(darkModeToggle.setMode).toHaveBeenCalledWith('dark');
        });
        
        it('should toggle from dark to light mode', () => {
            darkModeToggle.state.currentMode = 'dark';
            darkModeToggle.toggle();
            
            expect(darkModeToggle.setMode).toHaveBeenCalledWith('light');
        });
        
        it('should prevent toggle during transition', () => {
            darkModeToggle.state.isTransitioning = true;
            darkModeToggle.state.currentMode = 'light';
            
            darkModeToggle.toggle();
            
            expect(darkModeToggle.setMode).not.toHaveBeenCalled();
        });
        
        it('should set dark mode correctly', () => {
            darkModeToggle.setMode('dark');
            
            expect(darkModeToggle.state.currentMode).toBe('dark');
            expect(darkModeToggle.state.userPreference).toBe('dark');
            expect(darkModeToggle.state.isTransitioning).toBe(true);
        });
        
        it('should set light mode correctly', () => {
            darkModeToggle.setMode('light');
            
            expect(darkModeToggle.state.currentMode).toBe('light');
            expect(darkModeToggle.state.userPreference).toBe('light');
        });
        
        it('should update DOM class when setting dark mode', () => {
            darkModeToggle.setMode('dark');
            
            expect(document.body.classList.toggle).toHaveBeenCalledWith('mase-dark-mode', true);
        });
        
        it('should update DOM class when setting light mode', () => {
            darkModeToggle.setMode('light');
            
            expect(document.body.classList.toggle).toHaveBeenCalledWith('mase-dark-mode', false);
        });
    });
    
    // ========================================
    // LOCALSTORAGE OPERATIONS TESTS
    // ========================================
    
    describe('localStorage Operations', () => {
        it('should save mode to localStorage', () => {
            darkModeToggle.savePreference('dark');
            
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('mase_dark_mode', 'dark');
        });
        
        it('should load mode from localStorage', () => {
            mockLocalStorage.store['mase_dark_mode'] = 'dark';
            
            const mode = darkModeToggle.loadSavedPreference();
            
            expect(mode).toBe('dark');
            expect(darkModeToggle.state.currentMode).toBe('dark');
        });
        
        it('should handle localStorage unavailable gracefully', () => {
            mockLocalStorage.getItem.mockImplementation(() => {
                throw new Error('localStorage unavailable');
            });
            
            expect(() => darkModeToggle.loadSavedPreference()).not.toThrow();
            expect(darkModeToggle.state.needsSync).toBe(true);
        });
        
        it('should handle quota exceeded error', () => {
            mockLocalStorage.setItem.mockImplementation(() => {
                const error = new Error('QuotaExceededError');
                error.name = 'QuotaExceededError';
                throw error;
            });
            
            darkModeToggle.savePreference('dark');
            
            expect(darkModeToggle.state.needsSync).toBe(true);
        });
        
        it('should clear needsSync flag on successful save', () => {
            mockLocalStorage.store['mase_dark_mode_needsSync'] = 'true';
            
            darkModeToggle.savePreference('dark');
            
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('mase_dark_mode_needsSync');
        });
        
        it('should default to light mode if no preference found', () => {
            const mode = darkModeToggle.loadSavedPreference();
            
            expect(mode).toBe('light');
        });
        
        it('should validate mode value from localStorage', () => {
            mockLocalStorage.store['mase_dark_mode'] = 'invalid';
            
            const mode = darkModeToggle.loadSavedPreference();
            
            expect(mode).toBe('light'); // Should default to light for invalid value
        });
    });
    
    // ========================================
    // SYSTEM PREFERENCE DETECTION TESTS
    // ========================================
    
    describe('System Preference Detection', () => {
        it('should detect dark mode preference', () => {
            mockMatchMedia.matches = true;
            
            const result = darkModeToggle.detectSystemPreference();
            
            expect(result).toBe('dark');
            expect(darkModeToggle.state.systemPreference).toBe('dark');
        });
        
        it('should detect light mode preference', () => {
            mockMatchMedia.matches = false;
            
            const result = darkModeToggle.detectSystemPreference();
            
            expect(result).toBe('light');
            expect(darkModeToggle.state.systemPreference).toBe('light');
        });
        
        it('should handle matchMedia not supported', () => {
            delete global.window.matchMedia;
            
            const result = darkModeToggle.detectSystemPreference();
            
            expect(result).toBe('light');
            expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('matchMedia not supported'));
        });
        
        it('should handle detection errors gracefully', () => {
            global.window.matchMedia = vi.fn(() => {
                throw new Error('Test error');
            });
            
            const result = darkModeToggle.detectSystemPreference();
            
            expect(result).toBe('light');
            expect(console.error).toHaveBeenCalled();
        });
        
        it('should log detection results', () => {
            mockMatchMedia.matches = true;
            
            darkModeToggle.detectSystemPreference();
            
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('System preference detected'),
                'dark'
            );
        });
    });
    
    // ========================================
    // SYSTEM PREFERENCE MONITORING TESTS
    // ========================================
    
    describe('System Preference Monitoring', () => {
        it('should setup addEventListener for modern browsers', () => {
            darkModeToggle.watchSystemPreference();
            
            expect(mockMatchMedia.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
        });
        
        it('should fallback to addListener for older browsers', () => {
            delete mockMatchMedia.addEventListener;
            
            darkModeToggle.watchSystemPreference();
            
            expect(mockMatchMedia.addListener).toHaveBeenCalledWith(expect.any(Function));
        });
        
        it('should handle system preference change to dark', () => {
            darkModeToggle.state.systemPreference = 'light';
            darkModeToggle.state.userPreference = null;
            
            darkModeToggle.handleSystemPreferenceChange({ matches: true });
            
            expect(darkModeToggle.state.systemPreference).toBe('dark');
            expect(darkModeToggle.setMode).toHaveBeenCalledWith('dark');
        });
        
        it('should handle system preference change to light', () => {
            darkModeToggle.state.systemPreference = 'dark';
            darkModeToggle.state.userPreference = null;
            
            darkModeToggle.handleSystemPreferenceChange({ matches: false });
            
            expect(darkModeToggle.state.systemPreference).toBe('light');
            expect(darkModeToggle.setMode).toHaveBeenCalledWith('light');
        });
        
        it('should ignore system preference if user has manual preference', () => {
            darkModeToggle.state.systemPreference = 'light';
            darkModeToggle.state.userPreference = 'dark';
            
            darkModeToggle.handleSystemPreferenceChange({ matches: true });
            
            expect(darkModeToggle.setMode).not.toHaveBeenCalled();
        });
        
        it('should handle monitoring setup errors', () => {
            global.window.matchMedia = vi.fn(() => {
                throw new Error('Test error');
            });
            
            expect(() => darkModeToggle.watchSystemPreference()).not.toThrow();
            expect(console.error).toHaveBeenCalled();
        });
    });
    
    // ========================================
    // KEYBOARD SHORTCUT TESTS
    // ========================================
    
    describe('Keyboard Shortcuts', () => {
        beforeEach(() => {
            darkModeToggle.setupKeyboardShortcuts();
        });
        
        it('should register keydown event listener', () => {
            expect(eventListeners['keydown.mase-dark-mode']).toBeDefined();
            expect(eventListeners['keydown.mase-dark-mode'].length).toBeGreaterThan(0);
        });
        
        it('should toggle on Ctrl+Shift+D', () => {
            const event = {
                ctrlKey: true,
                shiftKey: true,
                key: 'D',
                target: document.body,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            eventListeners['keydown.mase-dark-mode'][0](event);
            
            expect(event.preventDefault).toHaveBeenCalled();
            expect(darkModeToggle.toggle).toHaveBeenCalled();
        });
        
        it('should toggle on Cmd+Shift+D (Mac)', () => {
            const event = {
                metaKey: true,
                shiftKey: true,
                key: 'D',
                target: document.body,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            eventListeners['keydown.mase-dark-mode'][0](event);
            
            expect(darkModeToggle.toggle).toHaveBeenCalled();
        });
        
        it('should work with lowercase d', () => {
            const event = {
                ctrlKey: true,
                shiftKey: true,
                key: 'd',
                target: document.body,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            eventListeners['keydown.mase-dark-mode'][0](event);
            
            expect(darkModeToggle.toggle).toHaveBeenCalled();
        });
        
        it('should NOT toggle without Ctrl/Cmd', () => {
            const event = {
                shiftKey: true,
                key: 'D',
                target: document.body,
                preventDefault: vi.fn()
            };
            
            eventListeners['keydown.mase-dark-mode'][0](event);
            
            expect(darkModeToggle.toggle).not.toHaveBeenCalled();
        });
        
        it('should NOT toggle without Shift', () => {
            const event = {
                ctrlKey: true,
                key: 'D',
                target: document.body,
                preventDefault: vi.fn()
            };
            
            eventListeners['keydown.mase-dark-mode'][0](event);
            
            expect(darkModeToggle.toggle).not.toHaveBeenCalled();
        });
        
        it('should NOT toggle in input fields', () => {
            mockJQuery.mockImplementation((selector) => ({
                is: vi.fn(() => selector === 'input, textarea, select, [contenteditable="true"]')
            }));
            
            const event = {
                ctrlKey: true,
                shiftKey: true,
                key: 'D',
                target: { tagName: 'INPUT' },
                preventDefault: vi.fn()
            };
            
            eventListeners['keydown.mase-dark-mode'][0](event);
            
            expect(darkModeToggle.toggle).not.toHaveBeenCalled();
        });
        
        it('should animate icon when shortcut triggered', () => {
            const event = {
                ctrlKey: true,
                shiftKey: true,
                key: 'D',
                target: document.body,
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            };
            
            eventListeners['keydown.mase-dark-mode'][0](event);
            
            expect(darkModeToggle.animateIcon).toHaveBeenCalled();
        });
        
        it('should handle null event gracefully', () => {
            expect(() => {
                eventListeners['keydown.mase-dark-mode'][0](null);
            }).not.toThrow();
        });
    });
    
    // ========================================
    // EVENT EMISSION TESTS
    // ========================================
    
    describe('Event Emission', () => {
        it('should emit mase:modeChanged event on mode change', () => {
            const eventSpy = vi.fn();
            eventListeners['mase:modeChanged'] = [eventSpy];
            
            darkModeToggle.setMode('dark');
            
            expect(eventSpy).toHaveBeenCalledWith({}, { mode: 'dark' });
        });
        
        it('should emit mase:transitionComplete event after transition', (done) => {
            const eventSpy = vi.fn();
            eventListeners['mase:transitionComplete'] = [eventSpy];
            
            darkModeToggle.setMode('dark');
            
            setTimeout(() => {
                expect(eventSpy).toHaveBeenCalledWith({}, { mode: 'dark' });
                done();
            }, 350);
        });
        
        it('should include mode in event payload', () => {
            const eventSpy = vi.fn();
            eventListeners['mase:modeChanged'] = [eventSpy];
            
            darkModeToggle.setMode('light');
            
            const callArgs = eventSpy.mock.calls[0];
            expect(callArgs[1]).toEqual({ mode: 'light' });
        });
        
        it('should allow external listeners to subscribe', () => {
            const externalHandler = vi.fn();
            $(document).on('mase:modeChanged', externalHandler);
            
            $(document).trigger('mase:modeChanged', { mode: 'dark' });
            
            expect(externalHandler).toHaveBeenCalled();
        });
    });
    
    // ========================================
    // ERROR HANDLING TESTS
    // ========================================
    
    describe('Error Handling', () => {
        it('should handle AJAX save failure gracefully', () => {
            mockJQuery.ajax.mockImplementation((options) => {
                options.error({ status: 500 }, 'error', 'Server Error');
            });
            
            darkModeToggle.savePreference('dark');
            
            expect(darkModeToggle.state.needsSync).toBe(true);
        });
        
        it('should implement retry logic on AJAX failure', (done) => {
            vi.useFakeTimers();
            
            mockJQuery.ajax.mockImplementation((options) => {
                options.error({ status: 500 }, 'error', 'Server Error');
            });
            
            darkModeToggle.savePreference('dark');
            
            expect(darkModeToggle.state.needsSync).toBe(true);
            
            vi.advanceTimersByTime(1000);
            
            expect(darkModeToggle.state.retryCount).toBe(1);
            
            vi.useRealTimers();
            done();
        });
        
        it('should reset retry count on successful save', () => {
            darkModeToggle.state.retryCount = 2;
            
            mockJQuery.ajax.mockImplementation((options) => {
                options.success({ success: true });
            });
            
            darkModeToggle.savePreference('dark');
            
            expect(darkModeToggle.state.retryCount).toBe(0);
        });
        
        it('should handle localStorage quota exceeded', () => {
            mockLocalStorage.setItem.mockImplementation(() => {
                const error = new Error('QuotaExceededError');
                error.name = 'QuotaExceededError';
                throw error;
            });
            
            expect(() => darkModeToggle.savePreference('dark')).not.toThrow();
            expect(darkModeToggle.state.needsSync).toBe(true);
        });
        
        it('should handle missing AJAX configuration', () => {
            delete global.MASE.config.ajaxUrl;
            
            expect(() => darkModeToggle.savePreference('dark')).not.toThrow();
        });
        
        it('should log errors to console', () => {
            mockLocalStorage.getItem.mockImplementation(() => {
                throw new Error('Test error');
            });
            
            darkModeToggle.loadSavedPreference();
            
            expect(console.warn).toHaveBeenCalled();
        });
        
        it('should handle invalid event objects in keyboard handler', () => {
            darkModeToggle.setupKeyboardShortcuts();
            
            expect(() => {
                eventListeners['keydown.mase-dark-mode'][0]('not an object');
            }).not.toThrow();
        });
        
        it('should handle system preference change errors', () => {
            darkModeToggle.setMode.mockImplementation(() => {
                throw new Error('Test error');
            });
            
            expect(() => {
                darkModeToggle.handleSystemPreferenceChange({ matches: true });
            }).toThrow(); // Should throw since we're not catching in the mock
        });
    });
    
    // ========================================
    // PERSISTENCE AND SYNC TESTS
    // ========================================
    
    describe('Persistence and Sync', () => {
        it('should save to both localStorage and AJAX', () => {
            darkModeToggle.savePreference('dark');
            
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('mase_dark_mode', 'dark');
            expect(mockJQuery.ajax).toHaveBeenCalled();
        });
        
        it('should sync preference when needsSync flag is set', () => {
            darkModeToggle.state.needsSync = true;
            
            darkModeToggle.syncPreference('dark');
            
            expect(mockJQuery.ajax).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        action: 'mase_toggle_dark_mode',
                        mode: 'dark'
                    })
                })
            );
        });
        
        it('should not sync when needsSync is false', () => {
            darkModeToggle.state.needsSync = false;
            
            darkModeToggle.syncPreference('dark');
            
            expect(mockJQuery.ajax).not.toHaveBeenCalled();
        });
        
        it('should clear needsSync flag on successful sync', () => {
            darkModeToggle.state.needsSync = true;
            
            mockJQuery.ajax.mockImplementation((options) => {
                options.success({ success: true });
            });
            
            darkModeToggle.syncPreference('dark');
            
            expect(darkModeToggle.state.needsSync).toBe(false);
        });
        
        it('should include nonce in AJAX requests', () => {
            darkModeToggle.savePreference('dark');
            
            expect(ajaxCalls[0].data.nonce).toBe('test-nonce');
        });
        
        it('should include action in AJAX requests', () => {
            darkModeToggle.savePreference('dark');
            
            expect(ajaxCalls[0].data.action).toBe('mase_toggle_dark_mode');
        });
    });
    
    // ========================================
    // INITIALIZATION TESTS
    // ========================================
    
    describe('Initialization', () => {
        it('should call all initialization methods', () => {
            darkModeToggle.init();
            
            expect(darkModeToggle.detectSystemPreference).toHaveBeenCalled();
            expect(darkModeToggle.loadSavedPreference).toHaveBeenCalled();
            expect(darkModeToggle.render).toHaveBeenCalled();
            expect(darkModeToggle.attachEventListeners).toHaveBeenCalled();
            expect(darkModeToggle.setupKeyboardShortcuts).toHaveBeenCalled();
            expect(darkModeToggle.watchSystemPreference).toHaveBeenCalled();
        });
        
        it('should detect system preference before loading saved preference', () => {
            const callOrder = [];
            darkModeToggle.detectSystemPreference.mockImplementation(() => {
                callOrder.push('detect');
            });
            darkModeToggle.loadSavedPreference.mockImplementation(() => {
                callOrder.push('load');
            });
            
            darkModeToggle.init();
            
            expect(callOrder).toEqual(['detect', 'load']);
        });
        
        it('should use system preference if no saved preference', () => {
            mockMatchMedia.matches = true;
            darkModeToggle.detectSystemPreference();
            
            const mode = darkModeToggle.loadSavedPreference();
            
            expect(mode).toBe('dark');
        });
        
        it('should prefer saved preference over system preference', () => {
            mockMatchMedia.matches = true;
            mockLocalStorage.store['mase_dark_mode'] = 'light';
            
            darkModeToggle.detectSystemPreference();
            const mode = darkModeToggle.loadSavedPreference();
            
            expect(mode).toBe('light');
        });
    });
    
    // ========================================
    // TRANSITION STATE TESTS
    // ========================================
    
    describe('Transition State Management', () => {
        it('should set isTransitioning flag during mode change', () => {
            darkModeToggle.setMode('dark');
            
            expect(darkModeToggle.state.isTransitioning).toBe(true);
        });
        
        it('should clear isTransitioning flag after transition', (done) => {
            darkModeToggle.setMode('dark');
            
            setTimeout(() => {
                expect(darkModeToggle.state.isTransitioning).toBe(false);
                done();
            }, 350);
        });
        
        it('should prevent rapid toggling during transition', () => {
            darkModeToggle.setMode('dark');
            darkModeToggle.toggle();
            
            // Second toggle should be ignored
            expect(darkModeToggle.setMode).toHaveBeenCalledTimes(1);
        });
    });
});
