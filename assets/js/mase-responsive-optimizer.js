/**
 * Modern Admin Styler - Responsive Optimization Module
 * 
 * Handles mobile animation scaling, touch interactions, and GPU detection
 * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
 * 
 * @package MASE
 * @since 1.3.0
 */

(function ($) {
    'use strict';

    /**
     * MASE Responsive Optimizer
     */
    window.MASE_ResponsiveOptimizer = {
        /**
         * Configuration
         */
        config: {
            mobileBreakpoint: 768,
            tabletBreakpoint: 1024,
            touchDevice: false,
            lowEndDevice: false,
            performanceModeEnabled: false
        },

        /**
         * Device capabilities
         */
        capabilities: {
            gpu: 'unknown',
            cores: navigator.hardwareConcurrency || 2,
            memory: navigator.deviceMemory || 4,
            connection: null
        },

        /**
         * Initialize responsive optimizer
         * Requirements: 16.1, 16.2, 16.3
         */
        init: function () {
            console.log('[MASE Responsive] Initializing responsive optimizer');

            // Detect device capabilities
            this.detectDeviceCapabilities();

            // Detect touch device
            this.detectTouchDevice();

            // Apply mobile optimizations if needed
            this.applyMobileOptimizations();

            // Apply touch optimizations if needed
            this.applyTouchOptimizations();

            // Setup resize handler
            this.setupResizeHandler();

            // Setup performance monitoring
            this.setupPerformanceMonitoring();

            console.log('[MASE Responsive] Initialization complete', {
                isMobile: this.isMobile(),
                isTablet: this.isTablet(),
                isTouchDevice: this.config.touchDevice,
                isLowEndDevice: this.config.lowEndDevice,
                gpu: this.capabilities.gpu
            });
        },

        /**
         * Detect device capabilities
         * Requirement 16.5: Detect low-end devices
         */
        detectDeviceCapabilities: function () {
            // Detect GPU capabilities
            this.detectGPU();

            // Detect if device is low-end based on multiple factors
            var isLowEnd = false;

            // Check memory (< 4GB is considered low-end)
            if (this.capabilities.memory < 4) {
                isLowEnd = true;
                console.log('[MASE Responsive] Low memory detected:', this.capabilities.memory + 'GB');
            }

            // Check CPU cores (< 4 cores is considered low-end)
            if (this.capabilities.cores < 4) {
                isLowEnd = true;
                console.log('[MASE Responsive] Low CPU cores detected:', this.capabilities.cores);
            }

            // Check connection speed
            if (navigator.connection) {
                this.capabilities.connection = navigator.connection.effectiveType;
                if (navigator.connection.effectiveType === 'slow-2g' || 
                    navigator.connection.effectiveType === '2g') {
                    isLowEnd = true;
                    console.log('[MASE Responsive] Slow connection detected:', navigator.connection.effectiveType);
                }
            }

            this.config.lowEndDevice = isLowEnd;

            // Auto-enable Performance Mode on low-end devices
            // Requirement 16.5: Auto-enable Performance Mode
            if (isLowEnd && !this.config.performanceModeEnabled) {
                this.enablePerformanceMode(true);
                this.showPerformanceRecommendation();
            }
        },

        /**
         * Detect GPU capabilities
         * Requirement 16.5: Detect GPU capabilities
         */
        detectGPU: function () {
            try {
                var canvas = document.createElement('canvas');
                var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                
                if (gl) {
                    var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                        console.log('[MASE Responsive] GPU detected:', renderer);
                        
                        // Check for low-end GPU indicators
                        var lowEndIndicators = ['intel', 'hd graphics', 'uhd graphics', 'iris'];
                        var isLowEndGPU = lowEndIndicators.some(function(indicator) {
                            return renderer.toLowerCase().indexOf(indicator) !== -1;
                        });
                        
                        this.capabilities.gpu = isLowEndGPU ? 'low-end' : 'capable';
                    } else {
                        this.capabilities.gpu = 'capable';
                    }
                } else {
                    this.capabilities.gpu = 'none';
                    console.log('[MASE Responsive] No WebGL support detected');
                }
            } catch (e) {
                console.log('[MASE Responsive] GPU detection failed:', e);
                this.capabilities.gpu = 'unknown';
            }
        },

        /**
         * Detect touch device
         * Requirement 16.4: Detect touch devices
         */
        detectTouchDevice: function () {
            this.config.touchDevice = (
                ('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0)
            );
            
            if (this.config.touchDevice) {
                document.documentElement.classList.add('mase-touch-device');
                console.log('[MASE Responsive] Touch device detected');
            }
        },

        /**
         * Check if current viewport is mobile
         */
        isMobile: function () {
            return window.innerWidth < this.config.mobileBreakpoint;
        },

        /**
         * Check if current viewport is tablet
         */
        isTablet: function () {
            return window.innerWidth >= this.config.mobileBreakpoint && 
                   window.innerWidth < this.config.tabletBreakpoint;
        },

        /**
         * Apply mobile optimizations
         * Requirements: 16.1, 16.2, 16.3
         */
        applyMobileOptimizations: function () {
            if (!this.isMobile()) {
                return;
            }

            console.log('[MASE Responsive] Applying mobile optimizations');

            // Add mobile class to root
            document.documentElement.classList.add('mase-mobile-device');

            // Reduce animation complexity (Requirement 16.1)
            this.reduceAnimationComplexity();

            // Disable particle effects (Requirement 16.2)
            this.disableParticleEffects();

            // Reduce blur effects (Requirement 16.3)
            this.reduceBlurEffects();
        },

        /**
         * Reduce animation complexity on mobile
         * Requirement 16.1: Reduce animation complexity by 50%
         */
        reduceAnimationComplexity: function () {
            // Set CSS custom property for animation speed multiplier
            document.documentElement.style.setProperty('--mase-mobile-animation-speed', '0.5');
            
            // Reduce animation iterations
            document.documentElement.style.setProperty('--mase-mobile-animation-iterations', '1');
            
            console.log('[MASE Responsive] Animation complexity reduced for mobile');
        },

        /**
         * Disable particle effects on mobile
         * Requirement 16.2: Disable particle effects on mobile
         */
        disableParticleEffects: function () {
            // Hide all particle systems
            var particleElements = document.querySelectorAll(
                '.mase-particles, ' +
                '.mase-particle-system, ' +
                '[class*="particle"]'
            );
            
            particleElements.forEach(function(element) {
                element.style.display = 'none';
            });
            
            // Set CSS custom property to disable particles
            document.documentElement.style.setProperty('--mase-particles-enabled', '0');
            
            console.log('[MASE Responsive] Particle effects disabled for mobile');
        },

        /**
         * Reduce blur effects on mobile
         * Requirement 16.3: Reduce blur effects on mobile for performance
         */
        reduceBlurEffects: function () {
            // Reduce backdrop-filter blur by 70%
            document.documentElement.style.setProperty('--mase-mobile-blur-reduction', '0.3');
            
            // Reduce box-shadow blur
            document.documentElement.style.setProperty('--mase-mobile-shadow-blur', '0.5');
            
            console.log('[MASE Responsive] Blur effects reduced for mobile');
        },

        /**
         * Apply touch optimizations
         * Requirement 16.4: Optimize for touch interactions
         */
        applyTouchOptimizations: function () {
            if (!this.config.touchDevice) {
                return;
            }

            console.log('[MASE Responsive] Applying touch optimizations');

            // Use simpler transitions on touch devices
            this.simplifyTransitions();

            // Increase touch target sizes (handled via CSS)
            // Remove hover-only effects
            this.removeHoverEffects();
        },

        /**
         * Simplify transitions on touch devices
         * Requirement 16.4: Use simpler transitions on touch devices
         */
        simplifyTransitions: function () {
            // Set CSS custom property for simplified transitions
            document.documentElement.style.setProperty('--mase-touch-transition-duration', '150ms');
            document.documentElement.style.setProperty('--mase-touch-transition-timing', 'ease-out');
            
            console.log('[MASE Responsive] Transitions simplified for touch devices');
        },

        /**
         * Remove hover-only effects on touch devices
         * Requirement 16.4: Remove hover-only effects
         */
        removeHoverEffects: function () {
            // Disable hover effects via CSS class
            document.documentElement.classList.add('mase-no-hover');
            
            console.log('[MASE Responsive] Hover effects removed for touch devices');
        },

        /**
         * Enable Performance Mode
         * Requirement 16.5: Auto-enable Performance Mode on low-end devices
         */
        enablePerformanceMode: function (auto) {
            this.config.performanceModeEnabled = true;
            document.documentElement.setAttribute('data-performance-mode', 'true');
            
            console.log('[MASE Responsive] Performance Mode enabled' + (auto ? ' (auto)' : ''));
            
            // Trigger event for other modules
            $(document).trigger('mase:performance-mode:enabled', { auto: auto });
        },

        /**
         * Disable Performance Mode
         */
        disablePerformanceMode: function () {
            this.config.performanceModeEnabled = false;
            document.documentElement.setAttribute('data-performance-mode', 'false');
            
            console.log('[MASE Responsive] Performance Mode disabled');
            
            // Trigger event for other modules
            $(document).trigger('mase:performance-mode:disabled');
        },

        /**
         * Show performance recommendation
         * Requirement 16.5: Show performance recommendations
         */
        showPerformanceRecommendation: function () {
            var message = 'Performance Mode has been automatically enabled for optimal experience on your device.';
            
            // Show notice if MASE object exists
            if (window.MASE && typeof window.MASE.showNotice === 'function') {
                window.MASE.showNotice('info', message);
            } else {
                console.log('[MASE Responsive] ' + message);
            }
        },

        /**
         * Setup resize handler
         */
        setupResizeHandler: function () {
            var self = this;
            var resizeTimeout;
            
            $(window).on('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    self.handleResize();
                }, 250);
            });
        },

        /**
         * Handle window resize
         */
        handleResize: function () {
            var wasMobile = document.documentElement.classList.contains('mase-mobile-device');
            var isMobileNow = this.isMobile();
            
            if (wasMobile !== isMobileNow) {
                if (isMobileNow) {
                    this.applyMobileOptimizations();
                } else {
                    this.removeMobileOptimizations();
                }
            }
        },

        /**
         * Remove mobile optimizations
         */
        removeMobileOptimizations: function () {
            console.log('[MASE Responsive] Removing mobile optimizations');
            
            document.documentElement.classList.remove('mase-mobile-device');
            
            // Reset CSS custom properties
            document.documentElement.style.removeProperty('--mase-mobile-animation-speed');
            document.documentElement.style.removeProperty('--mase-mobile-animation-iterations');
            document.documentElement.style.removeProperty('--mase-particles-enabled');
            document.documentElement.style.removeProperty('--mase-mobile-blur-reduction');
            document.documentElement.style.removeProperty('--mase-mobile-shadow-blur');
            
            // Re-enable particle effects
            var particleElements = document.querySelectorAll(
                '.mase-particles, ' +
                '.mase-particle-system, ' +
                '[class*="particle"]'
            );
            
            particleElements.forEach(function(element) {
                element.style.display = '';
            });
        },

        /**
         * Setup performance monitoring
         */
        setupPerformanceMonitoring: function () {
            var self = this;
            
            // Monitor FPS if available
            if (window.requestAnimationFrame) {
                var lastTime = performance.now();
                var frames = 0;
                var fpsCheckInterval = 1000; // Check every second
                
                function checkFPS() {
                    frames++;
                    var currentTime = performance.now();
                    
                    if (currentTime >= lastTime + fpsCheckInterval) {
                        var fps = Math.round((frames * 1000) / (currentTime - lastTime));
                        
                        // If FPS drops below 30 and Performance Mode is not enabled, suggest it
                        if (fps < 30 && !self.config.performanceModeEnabled && !self.config.lowEndDevice) {
                            console.warn('[MASE Responsive] Low FPS detected:', fps);
                            self.config.lowEndDevice = true;
                            self.enablePerformanceMode(true);
                            self.showPerformanceRecommendation();
                        }
                        
                        frames = 0;
                        lastTime = currentTime;
                    }
                    
                    requestAnimationFrame(checkFPS);
                }
                
                // Start monitoring after a delay to avoid initial load spikes
                setTimeout(function() {
                    requestAnimationFrame(checkFPS);
                }, 3000);
            }
        }
    };

    /**
     * Initialize on document ready
     */
    $(document).ready(function () {
        MASE_ResponsiveOptimizer.init();
    });

})(jQuery);
