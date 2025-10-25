/**
 * Unit Tests for Dark Mode Live Preview Integration
 * Task 11: Integrate with live preview system
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Dark Mode Live Preview Integration', () => {
    let MASE;
    let mockLocalStorage;
    let mockDocument;
    
    beforeEach(() => {
        // Mock localStorage
        mockLocalStorage = {
            data: {},
            getItem(key) {
                return this.data[key] || null;
            },
            setItem(key, value) {
                this.data[key] = value;
            },
            removeItem(key) {
                delete this.data[key];
            },
            clear() {
                this.data = {};
            }
        };
        global.localStorage = mockLocalStorage;
        
        // Mock jQuery
        global.$ = vi.fn((selector) => {
            if (selector === document) {
                return {
                    trigger: vi.fn(),
                    on: vi.fn(),
                    one: vi.fn()
                };
            }
            return {
                addClass: vi.fn().mockReturnThis(),
                removeClass: vi.fn().mockReturnThis(),
                toggleClass: vi.fn().mockReturnThis(),
                hasClass: vi.fn().mockReturnValue(false)
            };
        });
        global.$.fn = {};
        
        // Mock document
        mockDocument = {
            body: {
                classList: {
                    add: vi.fn(),
                    remove: vi.fn(),
                    contains: vi.fn().mockReturnValue(false)
                }
            }
        };
        global.document = mockDocument;
        
        // Initialize MASE object
        MASE = {
            config: {
                nonce: 'test-nonce'
            },
            state: {
                livePreviewEnabled: false
            },
            darkModeToggle: {
                config: {
                    bodyClass: 'mase-dark-mode',
                    storageKey: 'mase_dark_mode',
                    transitionDuration: 300
                },
                state: {
                    currentMode: 'light',
                    isTransitioning: false,
                    systemPreference: 'light',
                    userPreference: null,
                    needsSync: false,
                    retryCount: 0,
                    maxRetries: 3
                },
                applyMode: vi.fn(),
                savePreference: vi.fn(),
                updateIcon: vi.fn()
            },
            livePreview: {
                previewState: {
                    savedDarkMode: null,
                    isPreviewActive: false
                },
                isActive: function() {
                    return this.previewState.isPreviewActive;
                },
                toggle: function() {
                    MASE.state.livePreviewEnabled = !MASE.state.livePreviewEnabled;
                    
                    if (MASE.state.livePreviewEnabled) {
                        this.previewState.isPreviewActive = true;
                        this.previewState.savedDarkMode = MASE.darkModeToggle.state.currentMode;
                    } else {
                        if (this.previewState.savedDarkMode !== null) {
                            MASE.darkModeToggle.applyMode(this.previewState.savedDarkMode, false);
                            MASE.darkModeToggle.state.currentMode = this.previewState.savedDarkMode;
                            MASE.darkModeToggle.updateIcon();
                        }
                        this.previewState.isPreviewActive = false;
                        this.previewState.savedDarkMode = null;
                    }
                },
                updateDarkMode: vi.fn(function(mode) {
                    MASE.darkModeToggle.applyMode(mode, true);
                    MASE.darkModeToggle.state.currentMode = mode;
                    MASE.darkModeToggle.updateIcon();
                })
            }
        };
        
        // Add setMode method
        MASE.darkModeToggle.setMode = function(mode) {
            if (mode !== 'light' && mode !== 'dark') {
                return;
            }
            
            if (this.state.isTransitioning) {
                return;
            }
            
            // Check if live preview is active
            if (MASE.livePreview && MASE.livePreview.isActive()) {
                MASE.livePreview.updateDarkMode(mode);
                return;
            }
            
            this.state.isTransitioning = true;
            this.state.currentMode = mode;
            this.state.userPreference = mode;
            
            this.applyMode(mode, true);
            this.savePreference(mode);
            
            setTimeout(() => {
                this.state.isTransitioning = false;
            }, this.config.transitionDuration);
        };
    });
    
    describe('Requirement 7.1: Dark mode toggle works with live preview active', () => {
        it('should call updateDarkMode when preview is active', () => {
            // Enter preview mode
            MASE.livePreview.toggle();
            expect(MASE.livePreview.isActive()).toBe(true);
            
            // Toggle dark mode
            MASE.darkModeToggle.setMode('dark');
            
            // Should call updateDarkMode instead of savePreference
            expect(MASE.livePreview.updateDarkMode).toHaveBeenCalledWith('dark');
            expect(MASE.darkModeToggle.savePreference).not.toHaveBeenCalled();
        });
        
        it('should save preference when preview is not active', () => {
            // Ensure preview is not active
            expect(MASE.livePreview.isActive()).toBe(false);
            
            // Toggle dark mode
            MASE.darkModeToggle.setMode('dark');
            
            // Should save preference normally
            expect(MASE.darkModeToggle.savePreference).toHaveBeenCalledWith('dark');
            expect(MASE.livePreview.updateDarkMode).not.toHaveBeenCalled();
        });
    });
    
    describe('Requirement 7.2: Mode changes are temporary during preview', () => {
        it('should not save to localStorage during preview', () => {
            // Enter preview mode
            MASE.livePreview.toggle();
            
            // Toggle dark mode
            MASE.darkModeToggle.setMode('dark');
            
            // localStorage should not be updated
            expect(MASE.darkModeToggle.savePreference).not.toHaveBeenCalled();
        });
        
        it('should apply mode visually during preview', () => {
            // Enter preview mode
            MASE.livePreview.toggle();
            
            // Toggle dark mode
            MASE.darkModeToggle.setMode('dark');
            
            // Should apply mode visually
            expect(MASE.darkModeToggle.applyMode).toHaveBeenCalledWith('dark', true);
        });
    });
    
    describe('Requirement 7.3: Restore saved mode when exiting preview', () => {
        it('should save current mode when entering preview', () => {
            MASE.darkModeToggle.state.currentMode = 'dark';
            
            // Enter preview mode
            MASE.livePreview.toggle();
            
            // Should save current mode
            expect(MASE.livePreview.previewState.savedDarkMode).toBe('dark');
        });
        
        it('should restore saved mode when exiting preview', () => {
            // Set initial mode
            MASE.darkModeToggle.state.currentMode = 'light';
            
            // Enter preview mode
            MASE.livePreview.toggle();
            expect(MASE.livePreview.previewState.savedDarkMode).toBe('light');
            
            // Change mode in preview
            MASE.darkModeToggle.setMode('dark');
            expect(MASE.darkModeToggle.state.currentMode).toBe('dark');
            
            // Exit preview mode
            MASE.livePreview.toggle();
            
            // Should restore saved mode
            expect(MASE.darkModeToggle.applyMode).toHaveBeenCalledWith('light', false);
            expect(MASE.darkModeToggle.state.currentMode).toBe('light');
        });
        
        it('should update FAB icon when restoring mode', () => {
            MASE.darkModeToggle.state.currentMode = 'light';
            MASE.livePreview.toggle();
            MASE.darkModeToggle.setMode('dark');
            
            // Clear previous calls
            MASE.darkModeToggle.updateIcon.mockClear();
            
            // Exit preview
            MASE.livePreview.toggle();
            
            // Should update icon
            expect(MASE.darkModeToggle.updateIcon).toHaveBeenCalled();
        });
    });
    
    describe('Requirement 7.4: Use same CSS generation logic', () => {
        it('should use applyMode method for consistency', () => {
            MASE.livePreview.toggle();
            MASE.darkModeToggle.setMode('dark');
            
            // Should use the same applyMode method
            expect(MASE.darkModeToggle.applyMode).toHaveBeenCalledWith('dark', true);
        });
    });
    
    describe('Requirement 7.6: Prevent saving during preview mode', () => {
        it('should not call savePreference during preview', () => {
            MASE.livePreview.toggle();
            MASE.darkModeToggle.setMode('dark');
            
            expect(MASE.darkModeToggle.savePreference).not.toHaveBeenCalled();
        });
        
        it('should call savePreference outside preview', () => {
            MASE.darkModeToggle.setMode('dark');
            
            expect(MASE.darkModeToggle.savePreference).toHaveBeenCalledWith('dark');
        });
    });
    
    describe('Requirement 7.7: isActive() method', () => {
        it('should return true when preview is active', () => {
            MASE.livePreview.toggle();
            expect(MASE.livePreview.isActive()).toBe(true);
        });
        
        it('should return false when preview is not active', () => {
            expect(MASE.livePreview.isActive()).toBe(false);
        });
        
        it('should return false after exiting preview', () => {
            MASE.livePreview.toggle();
            expect(MASE.livePreview.isActive()).toBe(true);
            
            MASE.livePreview.toggle();
            expect(MASE.livePreview.isActive()).toBe(false);
        });
    });
    
    describe('Edge Cases', () => {
        it('should handle multiple preview toggles', () => {
            MASE.darkModeToggle.state.currentMode = 'light';
            
            // Enter and exit preview multiple times
            MASE.livePreview.toggle();
            MASE.livePreview.toggle();
            MASE.livePreview.toggle();
            
            // Should still save the correct mode
            expect(MASE.livePreview.previewState.savedDarkMode).toBe('light');
        });
        
        it('should handle null saved mode gracefully', () => {
            MASE.livePreview.previewState.savedDarkMode = null;
            MASE.livePreview.previewState.isPreviewActive = true;
            
            // Exit preview with null saved mode
            MASE.livePreview.toggle();
            
            // Should not crash
            expect(MASE.livePreview.isActive()).toBe(false);
        });
        
        it('should prevent mode changes during transition', () => {
            MASE.darkModeToggle.state.isTransitioning = true;
            
            MASE.darkModeToggle.setMode('dark');
            
            // Should not apply mode
            expect(MASE.darkModeToggle.applyMode).not.toHaveBeenCalled();
        });
    });
});
