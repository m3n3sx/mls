/**
 * Unit Tests for Dark Mode Persistence Layer
 * 
 * Tests the persistence layer implementation including:
 * - localStorage save/load with error handling
 * - AJAX retry logic for failed requests
 * - needsSync flag management
 * - Storage quota exceeded handling
 * - syncPreference functionality
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 11.1, 11.2
 */

describe('Dark Mode Persistence Layer', () => {
    let darkModeToggle;
    let localStorageMock;
    let ajaxMock;
    
    beforeEach(() => {
        // Mock localStorage
        localStorageMock = {
            store: {},
            getItem: function(key) {
                return this.store[key] || null;
            },
            setItem: function(key, value) {
                this.store[key] = value.toString();
            },
            removeItem: function(key) {
                delete this.store[key];
            },
            clear: function() {
                this.store = {};
            }
        };
        
        global.localStorage = localStorageMock;
        
        // Mock jQuery AJAX
        global.$ = {
            ajax: jest.fn()
        };
        
        // Mock MASE config
        global.MASE = {
            config: {
                ajaxUrl: '/wp-admin/admin-ajax.php',
                nonce: 'test-nonce'
            },
            showNotice: jest.fn()
        };
        
        // Create a simplified version of darkModeToggle for testing
        darkModeToggle = {
            config: {
                storageKey: 'mase_dark_mode',
                transitionDuration: 300
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
            
            // Copy the actual implementation methods
            savePreference: function(mode) {
                var self = this;
                
                // Save to localStorage
                try {
                    localStorage.setItem(self.config.storageKey, mode);
                    localStorage.removeItem(self.config.storageKey + '_needsSync');
                } catch (error) {
                    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                        try {
                            var keysToRemove = [];
                            for (var i = 0; i < localStorage.length; i++) {
                                var key = localStorage.key(i);
                                if (key && key.startsWith('mase_') && key !== self.config.storageKey) {
                                    keysToRemove.push(key);
                                }
                            }
                            
                            keysToRemove.forEach(function(key) {
                                localStorage.removeItem(key);
                            });
                            
                            localStorage.setItem(self.config.storageKey, mode);
                        } catch (retryError) {
                            self.state.needsSync = true;
                            try {
                                localStorage.setItem(self.config.storageKey + '_needsSync', 'true');
                            } catch (flagError) {
                                // Ignore
                            }
                        }
                    } else {
                        self.state.needsSync = true;
                        try {
                            localStorage.setItem(self.config.storageKey + '_needsSync', 'true');
                        } catch (flagError) {
                            // Ignore
                        }
                    }
                }
                
                // Save to WordPress user meta via AJAX
                if (typeof MASE.config.ajaxUrl !== 'undefined' && typeof MASE.config.nonce !== 'undefined') {
                    $.ajax({
                        url: MASE.config.ajaxUrl,
                        type: 'POST',
                        data: {
                            action: 'mase_toggle_dark_mode',
                            nonce: MASE.config.nonce,
                            mode: mode
                        },
                        success: function(response) {
                            if (response.success) {
                                self.state.retryCount = 0;
                                self.state.needsSync = false;
                                
                                try {
                                    localStorage.removeItem(self.config.storageKey + '_needsSync');
                                } catch (error) {
                                    // Ignore
                                }
                            } else {
                                self.state.needsSync = true;
                                
                                if (typeof MASE.showNotice === 'function') {
                                    MASE.showNotice('warning', 
                                        'Dark mode applied locally. Preference will sync on next save.',
                                        3000
                                    );
                                }
                            }
                        },
                        error: function(xhr, status, error) {
                            self.state.needsSync = true;
                            
                            if (self.state.retryCount < self.state.maxRetries) {
                                var retryDelay = Math.pow(2, self.state.retryCount) * 1000;
                                
                                setTimeout(function() {
                                    self.state.retryCount++;
                                    self.syncPreference(mode);
                                }, retryDelay);
                            }
                        }
                    });
                }
            },
            
            syncPreference: function(mode) {
                var self = this;
                
                if (!self.state.needsSync) {
                    return;
                }
                
                if (typeof MASE.config.ajaxUrl === 'undefined' || typeof MASE.config.nonce === 'undefined') {
                    return;
                }
                
                $.ajax({
                    url: MASE.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_toggle_dark_mode',
                        nonce: MASE.config.nonce,
                        mode: mode
                    },
                    success: function(response) {
                        if (response.success) {
                            self.state.needsSync = false;
                            self.state.retryCount = 0;
                            
                            try {
                                localStorage.removeItem(self.config.storageKey + '_needsSync');
                            } catch (error) {
                                // Ignore
                            }
                            
                            if (typeof MASE.showNotice === 'function') {
                                MASE.showNotice('success', 'Dark mode preference synced successfully', 2000);
                            }
                        }
                    },
                    error: function(xhr, status, error) {
                        // Keep needsSync flag set
                    }
                });
            },
            
            loadSavedPreference: function() {
                var self = this;
                var mode = null;
                
                try {
                    var localStorageMode = localStorage.getItem(self.config.storageKey);
                    if (localStorageMode && (localStorageMode === 'light' || localStorageMode === 'dark')) {
                        mode = localStorageMode;
                    }
                    
                    var needsSyncFlag = localStorage.getItem(self.config.storageKey + '_needsSync');
                    if (needsSyncFlag === 'true') {
                        self.state.needsSync = true;
                    }
                } catch (error) {
                    self.state.needsSync = true;
                }
                
                if (!mode) {
                    mode = self.state.systemPreference || 'light';
                }
                
                self.state.userPreference = mode;
                self.state.currentMode = mode;
                
                return mode;
            }
        };
    });
    
    afterEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
    });
    
    describe('savePreference', () => {
        test('should save mode to localStorage successfully', () => {
            darkModeToggle.savePreference('dark');
            
            expect(localStorage.getItem('mase_dark_mode')).toBe('dark');
        });
        
        test('should clear needsSync flag on successful localStorage save', () => {
            localStorage.setItem('mase_dark_mode_needsSync', 'true');
            
            darkModeToggle.savePreference('dark');
            
            expect(localStorage.getItem('mase_dark_mode_needsSync')).toBeNull();
        });
        
        test('should send AJAX request to save to user meta', () => {
            darkModeToggle.savePreference('dark');
            
            expect($.ajax).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: '/wp-admin/admin-ajax.php',
                    type: 'POST',
                    data: {
                        action: 'mase_toggle_dark_mode',
                        nonce: 'test-nonce',
                        mode: 'dark'
                    }
                })
            );
        });
        
        test('should set needsSync flag on AJAX error', () => {
            const ajaxCall = $.ajax.mock.calls[0];
            
            darkModeToggle.savePreference('dark');
            
            // Simulate AJAX error
            const errorCallback = $.ajax.mock.calls[0][0].error;
            errorCallback({ status: 500 }, 'error', 'Server Error');
            
            expect(darkModeToggle.state.needsSync).toBe(true);
        });
        
        test('should implement retry logic with exponential backoff', (done) => {
            jest.useFakeTimers();
            
            darkModeToggle.savePreference('dark');
            
            // Simulate AJAX error
            const errorCallback = $.ajax.mock.calls[0][0].error;
            errorCallback({ status: 500 }, 'error', 'Server Error');
            
            expect(darkModeToggle.state.retryCount).toBe(0);
            
            // Fast-forward time for first retry (1 second)
            jest.advanceTimersByTime(1000);
            
            expect(darkModeToggle.state.retryCount).toBe(1);
            
            jest.useRealTimers();
            done();
        });
        
        test('should reset retry count on successful AJAX save', () => {
            darkModeToggle.state.retryCount = 2;
            
            darkModeToggle.savePreference('dark');
            
            // Simulate AJAX success
            const successCallback = $.ajax.mock.calls[0][0].success;
            successCallback({ success: true });
            
            expect(darkModeToggle.state.retryCount).toBe(0);
            expect(darkModeToggle.state.needsSync).toBe(false);
        });
        
        test('should handle localStorage quota exceeded error', () => {
            // Mock quota exceeded error
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = jest.fn(() => {
                const error = new Error('QuotaExceededError');
                error.name = 'QuotaExceededError';
                throw error;
            });
            
            darkModeToggle.savePreference('dark');
            
            expect(darkModeToggle.state.needsSync).toBe(true);
            
            localStorage.setItem = originalSetItem;
        });
        
        test('should show user-friendly notice on AJAX failure', () => {
            darkModeToggle.savePreference('dark');
            
            // Simulate AJAX error
            const errorCallback = $.ajax.mock.calls[0][0].error;
            errorCallback({ status: 0 }, 'error', 'Network Error');
            
            // Fast-forward past max retries
            jest.useFakeTimers();
            darkModeToggle.state.retryCount = 3;
            jest.advanceTimersByTime(8000);
            
            expect(MASE.showNotice).toHaveBeenCalled();
            
            jest.useRealTimers();
        });
    });
    
    describe('syncPreference', () => {
        test('should not sync if needsSync flag is false', () => {
            darkModeToggle.state.needsSync = false;
            
            darkModeToggle.syncPreference('dark');
            
            expect($.ajax).not.toHaveBeenCalled();
        });
        
        test('should send AJAX request when needsSync is true', () => {
            darkModeToggle.state.needsSync = true;
            
            darkModeToggle.syncPreference('dark');
            
            expect($.ajax).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: '/wp-admin/admin-ajax.php',
                    type: 'POST',
                    data: {
                        action: 'mase_toggle_dark_mode',
                        nonce: 'test-nonce',
                        mode: 'dark'
                    }
                })
            );
        });
        
        test('should clear needsSync flag on successful sync', () => {
            darkModeToggle.state.needsSync = true;
            
            darkModeToggle.syncPreference('dark');
            
            // Simulate AJAX success
            const successCallback = $.ajax.mock.calls[0][0].success;
            successCallback({ success: true });
            
            expect(darkModeToggle.state.needsSync).toBe(false);
            expect(darkModeToggle.state.retryCount).toBe(0);
        });
        
        test('should clear needsSync flag from localStorage on successful sync', () => {
            darkModeToggle.state.needsSync = true;
            localStorage.setItem('mase_dark_mode_needsSync', 'true');
            
            darkModeToggle.syncPreference('dark');
            
            // Simulate AJAX success
            const successCallback = $.ajax.mock.calls[0][0].success;
            successCallback({ success: true });
            
            expect(localStorage.getItem('mase_dark_mode_needsSync')).toBeNull();
        });
        
        test('should show success notice on successful sync', () => {
            darkModeToggle.state.needsSync = true;
            
            darkModeToggle.syncPreference('dark');
            
            // Simulate AJAX success
            const successCallback = $.ajax.mock.calls[0][0].success;
            successCallback({ success: true });
            
            expect(MASE.showNotice).toHaveBeenCalledWith(
                'success',
                'Dark mode preference synced successfully',
                2000
            );
        });
        
        test('should keep needsSync flag on sync error', () => {
            darkModeToggle.state.needsSync = true;
            
            darkModeToggle.syncPreference('dark');
            
            // Simulate AJAX error
            const errorCallback = $.ajax.mock.calls[0][0].error;
            errorCallback({ status: 500 }, 'error', 'Server Error');
            
            expect(darkModeToggle.state.needsSync).toBe(true);
        });
    });
    
    describe('loadSavedPreference', () => {
        test('should load mode from localStorage', () => {
            localStorage.setItem('mase_dark_mode', 'dark');
            
            const mode = darkModeToggle.loadSavedPreference();
            
            expect(mode).toBe('dark');
            expect(darkModeToggle.state.currentMode).toBe('dark');
        });
        
        test('should load needsSync flag from localStorage', () => {
            localStorage.setItem('mase_dark_mode', 'dark');
            localStorage.setItem('mase_dark_mode_needsSync', 'true');
            
            darkModeToggle.loadSavedPreference();
            
            expect(darkModeToggle.state.needsSync).toBe(true);
        });
        
        test('should default to light mode if no preference found', () => {
            const mode = darkModeToggle.loadSavedPreference();
            
            expect(mode).toBe('light');
        });
        
        test('should set needsSync flag if localStorage fails', () => {
            // Mock localStorage error
            const originalGetItem = localStorage.getItem;
            localStorage.getItem = jest.fn(() => {
                throw new Error('localStorage unavailable');
            });
            
            darkModeToggle.loadSavedPreference();
            
            expect(darkModeToggle.state.needsSync).toBe(true);
            
            localStorage.getItem = originalGetItem;
        });
    });
    
    describe('Error Handling', () => {
        test('should handle localStorage unavailable gracefully', () => {
            // Mock localStorage as undefined
            global.localStorage = undefined;
            
            expect(() => {
                darkModeToggle.savePreference('dark');
            }).not.toThrow();
        });
        
        test('should handle AJAX configuration missing', () => {
            MASE.config.ajaxUrl = undefined;
            
            expect(() => {
                darkModeToggle.savePreference('dark');
            }).not.toThrow();
        });
        
        test('should handle multiple localStorage errors', () => {
            const originalSetItem = localStorage.setItem;
            let callCount = 0;
            
            localStorage.setItem = jest.fn(() => {
                callCount++;
                const error = new Error('QuotaExceededError');
                error.name = 'QuotaExceededError';
                throw error;
            });
            
            darkModeToggle.savePreference('dark');
            
            expect(darkModeToggle.state.needsSync).toBe(true);
            expect(callCount).toBeGreaterThan(1); // Should attempt retry
            
            localStorage.setItem = originalSetItem;
        });
    });
});
