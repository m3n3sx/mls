/**
 * Unit Tests for Dark Mode System Preference Detection and Monitoring
 * Task 9: System preference detection and monitoring
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */

describe('Dark Mode System Preference Detection and Monitoring', function() {
    
    let darkModeToggle;
    let matchMediaMock;
    let listeners = [];
    
    beforeEach(function() {
        // Reset listeners array
        listeners = [];
        
        // Mock matchMedia
        matchMediaMock = {
            matches: false,
            media: '(prefers-color-scheme: dark)',
            addEventListener: function(event, handler) {
                listeners.push({ event: event, handler: handler, type: 'addEventListener' });
            },
            addListener: function(handler) {
                listeners.push({ handler: handler, type: 'addListener' });
            },
            removeEventListener: function(event, handler) {
                listeners = listeners.filter(l => l.handler !== handler);
            },
            removeListener: function(handler) {
                listeners = listeners.filter(l => l.handler !== handler);
            }
        };
        
        window.matchMedia = function(query) {
            return matchMediaMock;
        };
        
        // Mock localStorage
        window.localStorage = {
            data: {},
            getItem: function(key) {
                return this.data[key] || null;
            },
            setItem: function(key, value) {
                this.data[key] = value;
            },
            removeItem: function(key) {
                delete this.data[key];
            },
            clear: function() {
                this.data = {};
            }
        };
        
        // Mock console methods
        console.log = jasmine.createSpy('log');
        console.warn = jasmine.createSpy('warn');
        console.error = jasmine.createSpy('error');
        
        // Create a fresh instance of darkModeToggle
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
            }
        };
        
        // Copy methods from MASE.darkModeToggle
        darkModeToggle.detectSystemPreference = MASE.darkModeToggle.detectSystemPreference;
        darkModeToggle.watchSystemPreference = MASE.darkModeToggle.watchSystemPreference;
        darkModeToggle.handleSystemPreferenceChange = MASE.darkModeToggle.handleSystemPreferenceChange;
        darkModeToggle.shouldRespectSystemPreference = MASE.darkModeToggle.shouldRespectSystemPreference;
        darkModeToggle.setMode = jasmine.createSpy('setMode');
    });
    
    afterEach(function() {
        listeners = [];
        delete window.matchMedia;
        delete window.localStorage;
    });
    
    describe('detectSystemPreference()', function() {
        
        it('should detect dark mode preference', function() {
            // Requirement 3.1, 3.2
            matchMediaMock.matches = true;
            
            var result = darkModeToggle.detectSystemPreference();
            
            expect(result).toBe('dark');
            expect(darkModeToggle.state.systemPreference).toBe('dark');
            expect(console.log).toHaveBeenCalledWith(
                'MASE: System preference detected:',
                'dark',
                jasmine.objectContaining({
                    matches: true,
                    supported: true
                })
            );
        });
        
        it('should detect light mode preference', function() {
            // Requirement 3.1, 3.3
            matchMediaMock.matches = false;
            
            var result = darkModeToggle.detectSystemPreference();
            
            expect(result).toBe('light');
            expect(darkModeToggle.state.systemPreference).toBe('light');
            expect(console.log).toHaveBeenCalledWith(
                'MASE: System preference detected:',
                'light',
                jasmine.objectContaining({
                    matches: false,
                    supported: true
                })
            );
        });
        
        it('should handle matchMedia not supported', function() {
            // Requirement 3.6
            delete window.matchMedia;
            
            var result = darkModeToggle.detectSystemPreference();
            
            expect(result).toBe('light');
            expect(darkModeToggle.state.systemPreference).toBe('light');
            expect(console.warn).toHaveBeenCalledWith(
                'MASE: matchMedia not supported, defaulting to light mode'
            );
        });
        
        it('should handle invalid matchMedia query', function() {
            // Enhanced error handling
            window.matchMedia = function() {
                return { matches: undefined };
            };
            
            var result = darkModeToggle.detectSystemPreference();
            
            expect(result).toBe('light');
            expect(darkModeToggle.state.systemPreference).toBe('light');
            expect(console.warn).toHaveBeenCalledWith(
                'MASE: matchMedia query invalid, defaulting to light mode'
            );
        });
        
        it('should handle detection errors', function() {
            // Enhanced error handling
            window.matchMedia = function() {
                throw new Error('Test error');
            };
            
            var result = darkModeToggle.detectSystemPreference();
            
            expect(result).toBe('light');
            expect(darkModeToggle.state.systemPreference).toBe('light');
            expect(console.error).toHaveBeenCalledWith(
                'MASE: System preference detection failed:',
                jasmine.any(Error)
            );
        });
        
        it('should log detection results for debugging', function() {
            // Requirement 3.6
            matchMediaMock.matches = true;
            
            darkModeToggle.detectSystemPreference();
            
            expect(console.log).toHaveBeenCalledWith(
                'MASE: System preference detected:',
                'dark',
                jasmine.objectContaining({
                    matches: true,
                    media: '(prefers-color-scheme: dark)',
                    supported: true
                })
            );
        });
    });
    
    describe('watchSystemPreference()', function() {
        
        it('should setup addEventListener for modern browsers', function() {
            // Task 9: Implement matchMedia change listener
            darkModeToggle.watchSystemPreference();
            
            expect(listeners.length).toBe(1);
            expect(listeners[0].type).toBe('addEventListener');
            expect(listeners[0].event).toBe('change');
            expect(console.log).toHaveBeenCalledWith(
                'MASE: System preference monitoring enabled (addEventListener)'
            );
        });
        
        it('should fallback to addListener for older browsers', function() {
            // Task 9: Support older browsers
            delete matchMediaMock.addEventListener;
            
            darkModeToggle.watchSystemPreference();
            
            expect(listeners.length).toBe(1);
            expect(listeners[0].type).toBe('addListener');
            expect(console.log).toHaveBeenCalledWith(
                'MASE: System preference monitoring enabled (addListener)'
            );
        });
        
        it('should handle matchMedia not supported', function() {
            delete window.matchMedia;
            
            darkModeToggle.watchSystemPreference();
            
            expect(console.warn).toHaveBeenCalledWith(
                'MASE: matchMedia not supported, cannot watch system preference changes'
            );
        });
        
        it('should handle setup errors', function() {
            window.matchMedia = function() {
                throw new Error('Test error');
            };
            
            darkModeToggle.watchSystemPreference();
            
            expect(console.error).toHaveBeenCalledWith(
                'MASE: Failed to setup system preference monitoring:',
                jasmine.any(Error)
            );
        });
        
        it('should warn if no listener method available', function() {
            delete matchMediaMock.addEventListener;
            delete matchMediaMock.addListener;
            
            darkModeToggle.watchSystemPreference();
            
            expect(console.warn).toHaveBeenCalledWith(
                'MASE: No method available to watch system preference changes'
            );
        });
    });
    
    describe('handleSystemPreferenceChange()', function() {
        
        beforeEach(function() {
            darkModeToggle.state.systemPreference = 'light';
        });
        
        it('should update system preference when changed to dark', function() {
            // Requirement 3.4
            var event = { matches: true };
            
            darkModeToggle.handleSystemPreferenceChange(event);
            
            expect(darkModeToggle.state.systemPreference).toBe('dark');
            expect(console.log).toHaveBeenCalledWith(
                'MASE: System preference changed:',
                jasmine.objectContaining({
                    from: 'light',
                    to: 'dark',
                    matches: true
                })
            );
        });
        
        it('should update system preference when changed to light', function() {
            // Requirement 3.4
            darkModeToggle.state.systemPreference = 'dark';
            var event = { matches: false };
            
            darkModeToggle.handleSystemPreferenceChange(event);
            
            expect(darkModeToggle.state.systemPreference).toBe('light');
            expect(console.log).toHaveBeenCalledWith(
                'MASE: System preference changed:',
                jasmine.objectContaining({
                    from: 'dark',
                    to: 'light',
                    matches: false
                })
            );
        });
        
        it('should auto-update mode when no manual preference exists', function() {
            // Requirement 3.4
            darkModeToggle.state.userPreference = null;
            var event = { matches: true };
            
            darkModeToggle.handleSystemPreferenceChange(event);
            
            expect(darkModeToggle.setMode).toHaveBeenCalledWith('dark');
            expect(console.log).toHaveBeenCalledWith(
                'MASE: Auto-updating mode to match system preference:',
                'dark'
            );
        });
        
        it('should ignore system preference change if user has manual preference', function() {
            // Requirement 3.5
            darkModeToggle.state.systemPreference = 'light';
            darkModeToggle.state.userPreference = 'dark';
            var event = { matches: true };
            
            darkModeToggle.handleSystemPreferenceChange(event);
            
            expect(darkModeToggle.setMode).not.toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith(
                'MASE: User has manual preference, ignoring system preference change'
            );
        });
        
        it('should handle errors gracefully', function() {
            var event = { matches: true };
            darkModeToggle.setMode = function() {
                throw new Error('Test error');
            };
            
            darkModeToggle.handleSystemPreferenceChange(event);
            
            expect(console.error).toHaveBeenCalledWith(
                'MASE: Error handling system preference change:',
                jasmine.any(Error)
            );
        });
    });
    
    describe('shouldRespectSystemPreference()', function() {
        
        beforeEach(function() {
            darkModeToggle.state.systemPreference = 'light';
            darkModeToggle.state.userPreference = null;
            window.maseAdmin = {
                darkMode: {
                    respectSystemPreference: true
                }
            };
        });
        
        afterEach(function() {
            delete window.maseAdmin;
        });
        
        it('should return true when no manual preference exists', function() {
            // Requirement 3.4
            var result = darkModeToggle.shouldRespectSystemPreference();
            
            expect(result).toBe(true);
            expect(console.log).toHaveBeenCalledWith(
                'MASE: No manual preference detected, respecting system preference'
            );
        });
        
        it('should return false when user has manual preference different from system', function() {
            // Requirement 3.5
            darkModeToggle.state.userPreference = 'dark';
            darkModeToggle.state.systemPreference = 'light';
            
            var result = darkModeToggle.shouldRespectSystemPreference();
            
            expect(result).toBe(false);
            expect(console.log).toHaveBeenCalledWith(
                'MASE: User has manual preference different from system:',
                jasmine.objectContaining({
                    userPreference: 'dark',
                    systemPreference: 'light'
                })
            );
        });
        
        it('should return false when respectSystemPreference setting is disabled', function() {
            // Task 9: Check respectSystemPreference setting
            window.maseAdmin.darkMode.respectSystemPreference = false;
            
            var result = darkModeToggle.shouldRespectSystemPreference();
            
            expect(result).toBe(false);
            expect(console.log).toHaveBeenCalledWith(
                'MASE: respectSystemPreference setting is disabled'
            );
        });
        
        it('should return false when localStorage has manual preference', function() {
            // Requirement 3.5
            darkModeToggle.state.systemPreference = 'light';
            localStorage.setItem('mase_dark_mode', 'dark');
            
            var result = darkModeToggle.shouldRespectSystemPreference();
            
            expect(result).toBe(false);
            expect(console.log).toHaveBeenCalledWith(
                'MASE: localStorage has manual preference different from system'
            );
        });
        
        it('should return true when user preference matches system preference', function() {
            darkModeToggle.state.userPreference = 'light';
            darkModeToggle.state.systemPreference = 'light';
            
            var result = darkModeToggle.shouldRespectSystemPreference();
            
            expect(result).toBe(true);
        });
        
        it('should handle localStorage errors gracefully', function() {
            localStorage.getItem = function() {
                throw new Error('Test error');
            };
            
            var result = darkModeToggle.shouldRespectSystemPreference();
            
            expect(console.warn).toHaveBeenCalledWith(
                'MASE: Could not check localStorage for manual preference:',
                jasmine.any(Error)
            );
            // Should still return true if no other manual preference detected
            expect(result).toBe(true);
        });
        
        it('should default to true when maseAdmin is not defined', function() {
            delete window.maseAdmin;
            
            var result = darkModeToggle.shouldRespectSystemPreference();
            
            expect(result).toBe(true);
        });
    });
    
    describe('Integration: System preference monitoring', function() {
        
        it('should auto-update mode when system preference changes and no manual override', function() {
            // Full integration test
            darkModeToggle.state.systemPreference = 'light';
            darkModeToggle.state.userPreference = null;
            darkModeToggle.watchSystemPreference();
            
            // Simulate system preference change to dark
            var event = { matches: true };
            listeners[0].handler(event);
            
            expect(darkModeToggle.state.systemPreference).toBe('dark');
            expect(darkModeToggle.setMode).toHaveBeenCalledWith('dark');
        });
        
        it('should not auto-update mode when user has manual preference', function() {
            // Full integration test
            darkModeToggle.state.systemPreference = 'light';
            darkModeToggle.state.userPreference = 'light';
            darkModeToggle.watchSystemPreference();
            
            // Simulate system preference change to dark
            var event = { matches: true };
            listeners[0].handler(event);
            
            expect(darkModeToggle.state.systemPreference).toBe('dark');
            expect(darkModeToggle.setMode).not.toHaveBeenCalled();
        });
    });
});
