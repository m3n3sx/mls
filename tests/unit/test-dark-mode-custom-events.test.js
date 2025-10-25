/**
 * Unit Tests for Dark Mode Custom Events System
 * Task 12: Implement custom events system
 * Requirements: 2.7, 9.6
 * 
 * Tests:
 * - mase:modeChanged event emission
 * - mase:transitionComplete event emission
 * - Event payload structure
 * - Event listener registration
 * - Debug logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Dark Mode Custom Events System', () => {
    let darkModeToggle;
    let eventListeners;
    
    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '<div id="wpwrap"></div>';
        
        // Mock jQuery
        global.$ = global.jQuery = vi.fn((selector) => {
            if (selector === document) {
                return {
                    on: vi.fn((event, handler) => {
                        if (!eventListeners[event]) {
                            eventListeners[event] = [];
                        }
                        eventListeners[event].push(handler);
                    }),
                    trigger: vi.fn((event, data) => {
                        if (eventListeners[event]) {
                            eventListeners[event].forEach(handler => handler({}, data));
                        }
                    })
                };
            }
            return {
                length: 0,
                addClass: vi.fn(),
                removeClass: vi.fn(),
                on: vi.fn(),
                trigger: vi.fn()
            };
        });
        
        // Reset event listeners
        eventListeners = {};
        
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
                transitionDuration: 300
            },
            state: {
                currentMode: 'light',
                isTransitioning: false,
                systemPreference: 'light',
                userPreference: null
            },
            setupEventListeners: function() {
                var self = this;
                
                // Debug listener for mase:modeChanged event
                $(document).on('mase:modeChanged', function(event, data) {
                    console.log('MASE Event: modeChanged', {
                        mode: data.mode,
                        timestamp: new Date().toISOString(),
                        currentState: {
                            currentMode: self.state.currentMode,
                            isTransitioning: self.state.isTransitioning,
                            systemPreference: self.state.systemPreference,
                            userPreference: self.state.userPreference
                        }
                    });
                });
                
                // Debug listener for mase:transitionComplete event
                $(document).on('mase:transitionComplete', function(event, data) {
                    console.log('MASE Event: transitionComplete', {
                        mode: data.mode,
                        timestamp: new Date().toISOString(),
                        transitionDuration: self.config.transitionDuration + 'ms',
                        currentState: {
                            currentMode: self.state.currentMode,
                            isTransitioning: self.state.isTransitioning
                        }
                    });
                });
                
                console.log('MASE: Event listeners for debugging initialized');
                console.log('MASE: Available custom events:', [
                    'mase:modeChanged - Emitted when mode toggles',
                    'mase:transitionComplete - Emitted after transition animation'
                ]);
            }
        };
    });
    
    afterEach(() => {
        vi.clearAllMocks();
    });
    
    describe('setupEventListeners', () => {
        it('should register event listeners for mase:modeChanged', () => {
            // Act
            darkModeToggle.setupEventListeners();
            
            // Assert
            expect(eventListeners['mase:modeChanged']).toBeDefined();
            expect(eventListeners['mase:modeChanged'].length).toBe(1);
        });
        
        it('should register event listeners for mase:transitionComplete', () => {
            // Act
            darkModeToggle.setupEventListeners();
            
            // Assert
            expect(eventListeners['mase:transitionComplete']).toBeDefined();
            expect(eventListeners['mase:transitionComplete'].length).toBe(1);
        });
        
        it('should log initialization message', () => {
            // Act
            darkModeToggle.setupEventListeners();
            
            // Assert
            expect(console.log).toHaveBeenCalledWith('MASE: Event listeners for debugging initialized');
            expect(console.log).toHaveBeenCalledWith('MASE: Available custom events:', [
                'mase:modeChanged - Emitted when mode toggles',
                'mase:transitionComplete - Emitted after transition animation'
            ]);
        });
    });
    
    describe('mase:modeChanged event', () => {
        beforeEach(() => {
            darkModeToggle.setupEventListeners();
        });
        
        it('should emit event with correct payload when mode changes to dark', () => {
            // Arrange
            const eventData = { mode: 'dark' };
            darkModeToggle.state.currentMode = 'dark';
            
            // Act
            $(document).trigger('mase:modeChanged', eventData);
            
            // Assert
            expect(console.log).toHaveBeenCalledWith(
                'MASE Event: modeChanged',
                expect.objectContaining({
                    mode: 'dark',
                    currentState: expect.objectContaining({
                        currentMode: 'dark'
                    })
                })
            );
        });
        
        it('should emit event with correct payload when mode changes to light', () => {
            // Arrange
            const eventData = { mode: 'light' };
            darkModeToggle.state.currentMode = 'light';
            
            // Act
            $(document).trigger('mase:modeChanged', eventData);
            
            // Assert
            expect(console.log).toHaveBeenCalledWith(
                'MASE Event: modeChanged',
                expect.objectContaining({
                    mode: 'light',
                    currentState: expect.objectContaining({
                        currentMode: 'light'
                    })
                })
            );
        });
        
        it('should include timestamp in event data', () => {
            // Arrange
            const eventData = { mode: 'dark' };
            
            // Act
            $(document).trigger('mase:modeChanged', eventData);
            
            // Assert
            expect(console.log).toHaveBeenCalledWith(
                'MASE Event: modeChanged',
                expect.objectContaining({
                    timestamp: expect.any(String)
                })
            );
        });
        
        it('should include current state in event data', () => {
            // Arrange
            const eventData = { mode: 'dark' };
            darkModeToggle.state.currentMode = 'dark';
            darkModeToggle.state.isTransitioning = true;
            darkModeToggle.state.systemPreference = 'light';
            darkModeToggle.state.userPreference = 'dark';
            
            // Act
            $(document).trigger('mase:modeChanged', eventData);
            
            // Assert
            expect(console.log).toHaveBeenCalledWith(
                'MASE Event: modeChanged',
                expect.objectContaining({
                    currentState: {
                        currentMode: 'dark',
                        isTransitioning: true,
                        systemPreference: 'light',
                        userPreference: 'dark'
                    }
                })
            );
        });
    });
    
    describe('mase:transitionComplete event', () => {
        beforeEach(() => {
            darkModeToggle.setupEventListeners();
        });
        
        it('should emit event with correct payload after transition', () => {
            // Arrange
            const eventData = { mode: 'dark' };
            darkModeToggle.state.currentMode = 'dark';
            darkModeToggle.state.isTransitioning = false;
            
            // Act
            $(document).trigger('mase:transitionComplete', eventData);
            
            // Assert
            expect(console.log).toHaveBeenCalledWith(
                'MASE Event: transitionComplete',
                expect.objectContaining({
                    mode: 'dark',
                    transitionDuration: '300ms',
                    currentState: expect.objectContaining({
                        currentMode: 'dark',
                        isTransitioning: false
                    })
                })
            );
        });
        
        it('should include timestamp in event data', () => {
            // Arrange
            const eventData = { mode: 'light' };
            
            // Act
            $(document).trigger('mase:transitionComplete', eventData);
            
            // Assert
            expect(console.log).toHaveBeenCalledWith(
                'MASE Event: transitionComplete',
                expect.objectContaining({
                    timestamp: expect.any(String)
                })
            );
        });
        
        it('should include transition duration in event data', () => {
            // Arrange
            const eventData = { mode: 'dark' };
            darkModeToggle.config.transitionDuration = 500;
            
            // Act
            $(document).trigger('mase:transitionComplete', eventData);
            
            // Assert
            expect(console.log).toHaveBeenCalledWith(
                'MASE Event: transitionComplete',
                expect.objectContaining({
                    transitionDuration: '500ms'
                })
            );
        });
    });
    
    describe('Event payload structure', () => {
        it('should have mode property in mase:modeChanged payload', () => {
            // Arrange
            darkModeToggle.setupEventListeners();
            const eventData = { mode: 'dark' };
            
            // Act
            $(document).trigger('mase:modeChanged', eventData);
            
            // Assert
            const logCall = console.log.mock.calls.find(call => 
                call[0] === 'MASE Event: modeChanged'
            );
            expect(logCall[1]).toHaveProperty('mode');
            expect(logCall[1].mode).toBe('dark');
        });
        
        it('should have mode property in mase:transitionComplete payload', () => {
            // Arrange
            darkModeToggle.setupEventListeners();
            const eventData = { mode: 'light' };
            
            // Act
            $(document).trigger('mase:transitionComplete', eventData);
            
            // Assert
            const logCall = console.log.mock.calls.find(call => 
                call[0] === 'MASE Event: transitionComplete'
            );
            expect(logCall[1]).toHaveProperty('mode');
            expect(logCall[1].mode).toBe('light');
        });
    });
    
    describe('Developer integration', () => {
        it('should allow external listeners to subscribe to mase:modeChanged', () => {
            // Arrange
            const externalHandler = vi.fn();
            $(document).on('mase:modeChanged', externalHandler);
            
            // Act
            $(document).trigger('mase:modeChanged', { mode: 'dark' });
            
            // Assert
            expect(externalHandler).toHaveBeenCalledWith(
                expect.anything(),
                { mode: 'dark' }
            );
        });
        
        it('should allow external listeners to subscribe to mase:transitionComplete', () => {
            // Arrange
            const externalHandler = vi.fn();
            $(document).on('mase:transitionComplete', externalHandler);
            
            // Act
            $(document).trigger('mase:transitionComplete', { mode: 'light' });
            
            // Assert
            expect(externalHandler).toHaveBeenCalledWith(
                expect.anything(),
                { mode: 'light' }
            );
        });
    });
});
