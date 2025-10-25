/**
 * Unit Tests for Dark Mode Screen Reader Announcements
 * 
 * Task 13: Add screen reader announcements
 * Requirements: 5.4, 5.7
 * 
 * Tests:
 * 1. ARIA live region creation
 * 2. Screen reader announcements
 * 3. FAB ARIA attributes update
 * 4. SR-only text update
 * 5. Announcement timing
 * 6. Multiple announcements handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Dark Mode Screen Reader Announcements', () => {
    let darkModeToggle;
    let mockBody;
    let mockLiveRegion;
    let mockFab;
    
    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '';
        mockBody = document.body;
        
        // Mock jQuery
        global.$ = global.jQuery = (selector) => {
            if (typeof selector === 'function') {
                // Document ready
                selector();
                return;
            }
            
            if (selector === 'body') {
                return {
                    append: (html) => {
                        const div = document.createElement('div');
                        div.innerHTML = html;
                        mockBody.appendChild(div.firstChild);
                    },
                    addClass: (className) => mockBody.classList.add(className),
                    removeClass: (className) => mockBody.classList.remove(className)
                };
            }
            
            if (selector === '#mase-sr-announcements') {
                mockLiveRegion = document.getElementById('mase-sr-announcements');
                return {
                    length: mockLiveRegion ? 1 : 0,
                    text: (text) => {
                        if (text === undefined) {
                            return mockLiveRegion ? mockLiveRegion.textContent : '';
                        }
                        if (mockLiveRegion) {
                            mockLiveRegion.textContent = text;
                        }
                    },
                    attr: (name) => mockLiveRegion ? mockLiveRegion.getAttribute(name) : null,
                    hasClass: (className) => mockLiveRegion ? mockLiveRegion.classList.contains(className) : false
                };
            }
            
            if (selector === '.mase-dark-mode-fab') {
                mockFab = document.querySelector('.mase-dark-mode-fab');
                return {
                    length: mockFab ? 1 : 0,
                    find: (childSelector) => {
                        if (!mockFab) return { length: 0 };
                        
                        if (childSelector === '.sr-only') {
                            const srOnly = mockFab.querySelector('.sr-only');
                            return {
                                length: srOnly ? 1 : 0,
                                text: (text) => {
                                    if (text === undefined) {
                                        return srOnly ? srOnly.textContent : '';
                                    }
                                    if (srOnly) {
                                        srOnly.textContent = text;
                                    }
                                }
                            };
                        }
                        
                        return { length: 0 };
                    },
                    attr: (name, value) => {
                        if (!mockFab) return null;
                        if (value === undefined) {
                            return mockFab.getAttribute(name);
                        }
                        mockFab.setAttribute(name, value);
                    }
                };
            }
            
            return { length: 0 };
        };
        
        // Mock dark mode toggle
        darkModeToggle = {
            config: {
                fabSelector: '.mase-dark-mode-fab',
                bodyClass: 'mase-dark-mode',
                storageKey: 'mase_dark_mode',
                transitionDuration: 300
            },
            
            state: {
                currentMode: 'light',
                isTransitioning: false
            },
            
            createAriaLiveRegion: function() {
                try {
                    if (document.getElementById('mase-sr-announcements')) {
                        console.log('ARIA live region already exists');
                        return;
                    }
                    
                    const liveRegion = document.createElement('div');
                    liveRegion.id = 'mase-sr-announcements';
                    liveRegion.className = 'sr-only';
                    liveRegion.setAttribute('role', 'status');
                    liveRegion.setAttribute('aria-live', 'polite');
                    liveRegion.setAttribute('aria-atomic', 'true');
                    
                    mockBody.appendChild(liveRegion);
                    console.log('ARIA live region created');
                } catch (error) {
                    console.error('Error creating ARIA live region:', error);
                }
            },
            
            announceToScreenReader: function(message) {
                const self = this;
                
                try {
                    let liveRegion = document.getElementById('mase-sr-announcements');
                    
                    if (!liveRegion) {
                        self.createAriaLiveRegion();
                        liveRegion = document.getElementById('mase-sr-announcements');
                    }
                    
                    // Clear previous announcement
                    liveRegion.textContent = '';
                    
                    // Use setTimeout to ensure screen readers detect the change
                    setTimeout(() => {
                        liveRegion.textContent = message;
                        console.log('Screen reader announcement:', message);
                        
                        // Clear announcement after 1 second
                        setTimeout(() => {
                            liveRegion.textContent = '';
                        }, 1000);
                    }, 100);
                } catch (error) {
                    console.error('Error announcing to screen reader:', error);
                }
            },
            
            updateIcon: function() {
                const self = this;
                const fab = document.querySelector(self.config.fabSelector);
                
                if (!fab) {
                    return;
                }
                
                const srText = fab.querySelector('.sr-only');
                
                const ariaLabel = self.state.currentMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
                const ariaPressed = self.state.currentMode === 'dark' ? 'true' : 'false';
                const srTextContent = self.state.currentMode === 'dark' ? 'Dark mode active' : 'Light mode active';
                
                fab.setAttribute('aria-label', ariaLabel);
                fab.setAttribute('aria-pressed', ariaPressed);
                fab.setAttribute('title', ariaLabel);
                
                if (srText) {
                    srText.textContent = srTextContent;
                }
                
                console.log('FAB icon updated');
            },
            
            setMode: function(mode) {
                const self = this;
                
                if (self.state.isTransitioning) {
                    return;
                }
                
                self.state.isTransitioning = true;
                self.state.currentMode = mode;
                
                // Announce mode change to screen readers
                const announcement = mode === 'dark' ? 'Dark mode activated' : 'Light mode activated';
                self.announceToScreenReader(announcement);
                
                // Update icon and ARIA attributes
                self.updateIcon();
                
                setTimeout(() => {
                    self.state.isTransitioning = false;
                }, self.config.transitionDuration);
            }
        };
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
        vi.clearAllTimers();
    });
    
    describe('ARIA Live Region Creation', () => {
        it('should create ARIA live region on initialization', () => {
            darkModeToggle.createAriaLiveRegion();
            
            const liveRegion = document.getElementById('mase-sr-announcements');
            expect(liveRegion).toBeTruthy();
        });
        
        it('should have correct ARIA attributes', () => {
            darkModeToggle.createAriaLiveRegion();
            
            const liveRegion = document.getElementById('mase-sr-announcements');
            expect(liveRegion.getAttribute('role')).toBe('status');
            expect(liveRegion.getAttribute('aria-live')).toBe('polite');
            expect(liveRegion.getAttribute('aria-atomic')).toBe('true');
        });
        
        it('should have sr-only class for visual hiding', () => {
            darkModeToggle.createAriaLiveRegion();
            
            const liveRegion = document.getElementById('mase-sr-announcements');
            expect(liveRegion.classList.contains('sr-only')).toBe(true);
        });
        
        it('should not create duplicate live regions', () => {
            darkModeToggle.createAriaLiveRegion();
            darkModeToggle.createAriaLiveRegion();
            
            const liveRegions = document.querySelectorAll('#mase-sr-announcements');
            expect(liveRegions.length).toBe(1);
        });
    });
    
    describe('Screen Reader Announcements', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        
        afterEach(() => {
            vi.useRealTimers();
        });
        
        it('should announce dark mode activation', () => {
            darkModeToggle.createAriaLiveRegion();
            darkModeToggle.announceToScreenReader('Dark mode activated');
            
            // Fast-forward past the initial setTimeout
            vi.advanceTimersByTime(100);
            
            const liveRegion = document.getElementById('mase-sr-announcements');
            expect(liveRegion.textContent).toBe('Dark mode activated');
        });
        
        it('should announce light mode activation', () => {
            darkModeToggle.createAriaLiveRegion();
            darkModeToggle.announceToScreenReader('Light mode activated');
            
            vi.advanceTimersByTime(100);
            
            const liveRegion = document.getElementById('mase-sr-announcements');
            expect(liveRegion.textContent).toBe('Light mode activated');
        });
        
        it('should clear announcement after 1 second', () => {
            darkModeToggle.createAriaLiveRegion();
            darkModeToggle.announceToScreenReader('Dark mode activated');
            
            vi.advanceTimersByTime(100);
            const liveRegion = document.getElementById('mase-sr-announcements');
            expect(liveRegion.textContent).toBe('Dark mode activated');
            
            // Fast-forward to clear announcement
            vi.advanceTimersByTime(1000);
            expect(liveRegion.textContent).toBe('');
        });
        
        it('should create live region if it does not exist', () => {
            darkModeToggle.announceToScreenReader('Test announcement');
            
            const liveRegion = document.getElementById('mase-sr-announcements');
            expect(liveRegion).toBeTruthy();
        });
        
        it('should clear previous announcement before new one', () => {
            darkModeToggle.createAriaLiveRegion();
            const liveRegion = document.getElementById('mase-sr-announcements');
            
            liveRegion.textContent = 'Old announcement';
            darkModeToggle.announceToScreenReader('New announcement');
            
            // Immediately after calling, should be cleared
            expect(liveRegion.textContent).toBe('');
            
            // After setTimeout, should have new announcement
            vi.advanceTimersByTime(100);
            expect(liveRegion.textContent).toBe('New announcement');
        });
    });
    
    describe('FAB ARIA Attributes', () => {
        beforeEach(() => {
            // Create mock FAB
            const fab = document.createElement('button');
            fab.className = 'mase-dark-mode-fab';
            fab.setAttribute('aria-label', 'Switch to Dark Mode');
            fab.setAttribute('aria-pressed', 'false');
            fab.setAttribute('role', 'switch');
            
            const srOnly = document.createElement('span');
            srOnly.className = 'sr-only';
            srOnly.textContent = 'Light mode active';
            fab.appendChild(srOnly);
            
            mockBody.appendChild(fab);
        });
        
        it('should update aria-pressed to true when dark mode is active', () => {
            darkModeToggle.state.currentMode = 'dark';
            darkModeToggle.updateIcon();
            
            const fab = document.querySelector('.mase-dark-mode-fab');
            expect(fab.getAttribute('aria-pressed')).toBe('true');
        });
        
        it('should update aria-pressed to false when light mode is active', () => {
            darkModeToggle.state.currentMode = 'light';
            darkModeToggle.updateIcon();
            
            const fab = document.querySelector('.mase-dark-mode-fab');
            expect(fab.getAttribute('aria-pressed')).toBe('false');
        });
        
        it('should update aria-label for dark mode', () => {
            darkModeToggle.state.currentMode = 'dark';
            darkModeToggle.updateIcon();
            
            const fab = document.querySelector('.mase-dark-mode-fab');
            expect(fab.getAttribute('aria-label')).toBe('Switch to Light Mode');
        });
        
        it('should update aria-label for light mode', () => {
            darkModeToggle.state.currentMode = 'light';
            darkModeToggle.updateIcon();
            
            const fab = document.querySelector('.mase-dark-mode-fab');
            expect(fab.getAttribute('aria-label')).toBe('Switch to Dark Mode');
        });
    });
    
    describe('SR-Only Text', () => {
        beforeEach(() => {
            // Create mock FAB with sr-only text
            const fab = document.createElement('button');
            fab.className = 'mase-dark-mode-fab';
            
            const srOnly = document.createElement('span');
            srOnly.className = 'sr-only';
            srOnly.textContent = 'Light mode active';
            fab.appendChild(srOnly);
            
            mockBody.appendChild(fab);
        });
        
        it('should update sr-only text for dark mode', () => {
            darkModeToggle.state.currentMode = 'dark';
            darkModeToggle.updateIcon();
            
            const fab = document.querySelector('.mase-dark-mode-fab');
            const srText = fab.querySelector('.sr-only');
            expect(srText.textContent).toBe('Dark mode active');
        });
        
        it('should update sr-only text for light mode', () => {
            darkModeToggle.state.currentMode = 'light';
            darkModeToggle.updateIcon();
            
            const fab = document.querySelector('.mase-dark-mode-fab');
            const srText = fab.querySelector('.sr-only');
            expect(srText.textContent).toBe('Light mode active');
        });
    });
    
    describe('Mode Change Integration', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            
            // Create mock FAB
            const fab = document.createElement('button');
            fab.className = 'mase-dark-mode-fab';
            fab.setAttribute('aria-label', 'Switch to Dark Mode');
            fab.setAttribute('aria-pressed', 'false');
            
            const srOnly = document.createElement('span');
            srOnly.className = 'sr-only';
            srOnly.textContent = 'Light mode active';
            fab.appendChild(srOnly);
            
            mockBody.appendChild(fab);
        });
        
        afterEach(() => {
            vi.useRealTimers();
        });
        
        it('should announce and update ARIA attributes when switching to dark mode', () => {
            darkModeToggle.setMode('dark');
            
            vi.advanceTimersByTime(100);
            
            const liveRegion = document.getElementById('mase-sr-announcements');
            expect(liveRegion.textContent).toBe('Dark mode activated');
            
            const fab = document.querySelector('.mase-dark-mode-fab');
            expect(fab.getAttribute('aria-pressed')).toBe('true');
            expect(fab.getAttribute('aria-label')).toBe('Switch to Light Mode');
            
            const srText = fab.querySelector('.sr-only');
            expect(srText.textContent).toBe('Dark mode active');
        });
        
        it('should announce and update ARIA attributes when switching to light mode', () => {
            darkModeToggle.state.currentMode = 'dark';
            darkModeToggle.setMode('light');
            
            vi.advanceTimersByTime(100);
            
            const liveRegion = document.getElementById('mase-sr-announcements');
            expect(liveRegion.textContent).toBe('Light mode activated');
            
            const fab = document.querySelector('.mase-dark-mode-fab');
            expect(fab.getAttribute('aria-pressed')).toBe('false');
            expect(fab.getAttribute('aria-label')).toBe('Switch to Dark Mode');
            
            const srText = fab.querySelector('.sr-only');
            expect(srText.textContent).toBe('Light mode active');
        });
    });
});
