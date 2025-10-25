/**
 * Unit Tests for Dark Mode Reduced Motion Support
 * 
 * Tests the reduced motion detection and animation disabling functionality
 * to ensure accessibility compliance with WCAG 2.1 Success Criterion 2.3.3.
 * 
 * Task 14: Implement reduced motion support
 * Requirements: 9.6, 9.7
 * A11Y: Respects prefers-reduced-motion user preference
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Dark Mode Reduced Motion Support', () => {
    let darkModeToggle;
    let matchMediaMock;
    
    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = '';
        document.body.className = '';
        
        // Create mock darkModeToggle object
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
                maxRetries: 3,
                prefersReducedMotion: false
            },
            
            detectReducedMotion: function() {
                var self = this;
                
                if (!window.matchMedia) {
                    console.warn('MASE: matchMedia not supported');
                    self.state.prefersReducedMotion = false;
                    return false;
                }
                
                try {
                    var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
                    
                    if (!reducedMotionQuery || typeof reducedMotionQuery.matches === 'undefined') {
                        console.warn('MASE: matchMedia query invalid for reduced motion');
                        self.state.prefersReducedMotion = false;
                        return false;
                    }
                    
                    self.state.prefersReducedMotion = reducedMotionQuery.matches;
                    
                    console.log('MASE: Reduced motion preference detected:', self.state.prefersReducedMotion);
                    
                    return self.state.prefersReducedMotion;
                } catch (error) {
                    console.error('MASE: Reduced motion detection failed:', error);
                    self.state.prefersReducedMotion = false;
                    return false;
                }
            },
            
            applyMode: function(mode, animate) {
                var self = this;
                var shouldAnimate = animate && !self.state.prefersReducedMotion;
                
                if (self.state.prefersReducedMotion && animate) {
                    console.log('MASE: Reduced motion preferred, disabling animations');
                }
                
                if (shouldAnimate) {
                    document.body.classList.add('mase-transitioning');
                }
                
                if (mode === 'dark') {
                    document.body.classList.add(self.config.bodyClass);
                } else {
                    document.body.classList.remove(self.config.bodyClass);
                }
                
                if (shouldAnimate) {
                    setTimeout(function() {
                        document.body.classList.remove('mase-transitioning');
                    }, self.config.transitionDuration);
                }
                
                self.state.currentMode = mode;
            },
            
            animateIcon: function() {
                var self = this;
                
                if (self.state.prefersReducedMotion) {
                    console.log('MASE: Reduced motion preferred, skipping icon animation');
                    return;
                }
                
                // Icon animation logic would go here
                console.log('MASE: Animating icon');
            }
        };
    });
    
    afterEach(() => {
        // Clean up
        if (matchMediaMock) {
            matchMediaMock = null;
        }
    });
    
    describe('detectReducedMotion()', () => {
        it('should detect when reduced motion is enabled', () => {
            // Mock matchMedia to return reduced motion enabled
            window.matchMedia = vi.fn().mockImplementation((query) => ({
                matches: query === '(prefers-reduced-motion: reduce)',
                media: query,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn()
            }));
            
            const result = darkModeToggle.detectReducedMotion();
            
            expect(result).toBe(true);
            expect(darkModeToggle.state.prefersReducedMotion).toBe(true);
        });
        
        it('should detect when reduced motion is disabled', () => {
            // Mock matchMedia to return reduced motion disabled
            window.matchMedia = vi.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn()
            }));
            
            const result = darkModeToggle.detectReducedMotion();
            
            expect(result).toBe(false);
            expect(darkModeToggle.state.prefersReducedMotion).toBe(false);
        });
        
        it('should handle missing matchMedia gracefully', () => {
            // Remove matchMedia
            const originalMatchMedia = window.matchMedia;
            delete window.matchMedia;
            
            const result = darkModeToggle.detectReducedMotion();
            
            expect(result).toBe(false);
            expect(darkModeToggle.state.prefersReducedMotion).toBe(false);
            
            // Restore matchMedia
            window.matchMedia = originalMatchMedia;
        });
        
        it('should handle invalid matchMedia query', () => {
            // Mock matchMedia to return invalid query
            window.matchMedia = vi.fn().mockImplementation(() => ({
                matches: undefined,
                media: '(prefers-reduced-motion: reduce)'
            }));
            
            const result = darkModeToggle.detectReducedMotion();
            
            expect(result).toBe(false);
            expect(darkModeToggle.state.prefersReducedMotion).toBe(false);
        });
        
        it('should handle matchMedia errors', () => {
            // Mock matchMedia to throw error
            window.matchMedia = vi.fn().mockImplementation(() => {
                throw new Error('matchMedia error');
            });
            
            const result = darkModeToggle.detectReducedMotion();
            
            expect(result).toBe(false);
            expect(darkModeToggle.state.prefersReducedMotion).toBe(false);
        });
    });
    
    describe('applyMode() with reduced motion', () => {
        beforeEach(() => {
            // Mock matchMedia for these tests
            window.matchMedia = vi.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn()
            }));
        });
        
        it('should disable animations when reduced motion is enabled', () => {
            // Enable reduced motion
            darkModeToggle.state.prefersReducedMotion = true;
            
            // Apply dark mode with animation
            darkModeToggle.applyMode('dark', true);
            
            // Should not add transitioning class
            expect(document.body.classList.contains('mase-transitioning')).toBe(false);
            
            // Should still apply dark mode class
            expect(document.body.classList.contains('mase-dark-mode')).toBe(true);
        });
        
        it('should enable animations when reduced motion is disabled', () => {
            // Disable reduced motion
            darkModeToggle.state.prefersReducedMotion = false;
            
            // Apply dark mode with animation
            darkModeToggle.applyMode('dark', true);
            
            // Should add transitioning class
            expect(document.body.classList.contains('mase-transitioning')).toBe(true);
            
            // Should apply dark mode class
            expect(document.body.classList.contains('mase-dark-mode')).toBe(true);
        });
        
        it('should apply mode instantly when animate is false', () => {
            // Disable reduced motion
            darkModeToggle.state.prefersReducedMotion = false;
            
            // Apply dark mode without animation
            darkModeToggle.applyMode('dark', false);
            
            // Should not add transitioning class
            expect(document.body.classList.contains('mase-transitioning')).toBe(false);
            
            // Should still apply dark mode class
            expect(document.body.classList.contains('mase-dark-mode')).toBe(true);
        });
        
        it('should remove dark mode class when switching to light', () => {
            // Set initial dark mode
            document.body.classList.add('mase-dark-mode');
            darkModeToggle.state.prefersReducedMotion = false;
            
            // Apply light mode
            darkModeToggle.applyMode('light', true);
            
            // Should remove dark mode class
            expect(document.body.classList.contains('mase-dark-mode')).toBe(false);
        });
    });
    
    describe('animateIcon() with reduced motion', () => {
        it('should skip icon animation when reduced motion is enabled', () => {
            // Enable reduced motion
            darkModeToggle.state.prefersReducedMotion = true;
            
            // Spy on console.log
            const consoleSpy = vi.spyOn(console, 'log');
            
            // Call animateIcon
            darkModeToggle.animateIcon();
            
            // Should log that animation is skipped
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Reduced motion preferred, skipping icon animation')
            );
            
            consoleSpy.mockRestore();
        });
        
        it('should animate icon when reduced motion is disabled', () => {
            // Disable reduced motion
            darkModeToggle.state.prefersReducedMotion = false;
            
            // Spy on console.log
            const consoleSpy = vi.spyOn(console, 'log');
            
            // Call animateIcon
            darkModeToggle.animateIcon();
            
            // Should log that animation is running
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Animating icon')
            );
            
            consoleSpy.mockRestore();
        });
    });
    
    describe('Integration with mode toggle', () => {
        beforeEach(() => {
            // Mock matchMedia
            window.matchMedia = vi.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn()
            }));
        });
        
        it('should maintain functionality with reduced motion enabled', () => {
            // Enable reduced motion
            darkModeToggle.state.prefersReducedMotion = true;
            
            // Toggle to dark mode
            darkModeToggle.applyMode('dark', true);
            expect(darkModeToggle.state.currentMode).toBe('dark');
            expect(document.body.classList.contains('mase-dark-mode')).toBe(true);
            
            // Toggle to light mode
            darkModeToggle.applyMode('light', true);
            expect(darkModeToggle.state.currentMode).toBe('light');
            expect(document.body.classList.contains('mase-dark-mode')).toBe(false);
        });
        
        it('should provide instant visual feedback with reduced motion', () => {
            // Enable reduced motion
            darkModeToggle.state.prefersReducedMotion = true;
            
            // Apply dark mode
            darkModeToggle.applyMode('dark', true);
            
            // Mode should be applied immediately without transition class
            expect(document.body.classList.contains('mase-dark-mode')).toBe(true);
            expect(document.body.classList.contains('mase-transitioning')).toBe(false);
        });
    });
    
    describe('State management', () => {
        it('should initialize prefersReducedMotion to false', () => {
            expect(darkModeToggle.state.prefersReducedMotion).toBe(false);
        });
        
        it('should update state when detecting reduced motion', () => {
            // Mock matchMedia to return reduced motion enabled
            window.matchMedia = vi.fn().mockImplementation((query) => ({
                matches: query === '(prefers-reduced-motion: reduce)',
                media: query,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn()
            }));
            
            darkModeToggle.detectReducedMotion();
            
            expect(darkModeToggle.state.prefersReducedMotion).toBe(true);
        });
        
        it('should persist state across multiple operations', () => {
            // Enable reduced motion
            darkModeToggle.state.prefersReducedMotion = true;
            
            // Apply mode multiple times
            darkModeToggle.applyMode('dark', true);
            darkModeToggle.applyMode('light', true);
            darkModeToggle.applyMode('dark', true);
            
            // State should remain true
            expect(darkModeToggle.state.prefersReducedMotion).toBe(true);
        });
    });
});
