/**
 * Material Design 3 Motion System
 * 
 * Animation orchestration using requestAnimationFrame for optimal performance.
 * Manages will-change properties and provides smooth 60fps animations.
 * 
 * Requirements: 22.1, 22.2, 22.5
 * 
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function($) {
    'use strict';

    /**
     * Motion Manager Class
     * Handles animation orchestration and performance optimization
     */
    class MotionManager {
        constructor() {
            this.animatingElements = new Set();
            this.rafId = null;
            this.isLowEndDevice = this.detectLowEndDevice();
            
            this.init();
        }

        /**
         * Initialize motion system
         */
        init() {
            // Add device class for CSS optimizations
            if (this.isLowEndDevice) {
                document.documentElement.classList.add('md-low-end-device');
            }

            // Set up animation observers
            this.setupAnimationObservers();
            
            // Set up will-change management
            this.setupWillChangeManagement();
            
            // Set up RAF-based animations
            this.setupRAFAnimations();
            
            console.log('MD3 Motion System initialized', {
                lowEndDevice: this.isLowEndDevice
            });
        }

        /**
         * Detect low-end devices for performance optimization
         * Requirement 22.5
         */
        detectLowEndDevice() {
            // Check for low memory
            if (navigator.deviceMemory && navigator.deviceMemory < 4) {
                return true;
            }

            // Check for slow CPU (hardware concurrency)
            if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
                return true;
            }

            // Check for reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return true;
            }

            // Check for mobile device
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // Mobile devices get more conservative treatment
                return navigator.deviceMemory ? navigator.deviceMemory < 6 : true;
            }

            return false;
        }

        /**
         * Set up animation observers to manage will-change
         * Requirement 22.1, 22.4
         */
        setupAnimationObservers() {
            const self = this;

            // Observe animation start
            $(document).on('animationstart', function(e) {
                const element = e.target;
                element.classList.add('animating');
                self.animatingElements.add(element);
            });

            // Observe animation end
            $(document).on('animationend', function(e) {
                const element = e.target;
                element.classList.remove('animating');
                element.classList.add('animation-complete');
                self.animatingElements.delete(element);
                
                // Remove will-change after animation completes (Requirement 22.4)
                setTimeout(() => {
                    element.classList.remove('animation-complete');
                }, 100);
            });

            // Observe transition start
            $(document).on('transitionstart', function(e) {
                const element = e.target;
                element.classList.add('animating');
                self.animatingElements.add(element);
            });

            // Observe transition end
            $(document).on('transitionend', function(e) {
                const element = e.target;
                element.classList.remove('animating');
                self.animatingElements.delete(element);
            });
        }

        /**
         * Set up will-change management for hover effects
         * Requirement 22.1, 22.4
         */
        setupWillChangeManagement() {
            const self = this;

            // Template cards
            $('.mase-template-card').on('mouseenter', function() {
                if (!self.isLowEndDevice) {
                    this.style.willChange = 'transform, box-shadow';
                }
            }).on('mouseleave', function() {
                // Remove will-change after hover ends (Requirement 22.4)
                setTimeout(() => {
                    this.style.willChange = 'auto';
                }, 300);
            });

            // Buttons
            $('.mase-button-filled, .mase-button-outlined, .mase-button-text').on('mouseenter', function() {
                if (!self.isLowEndDevice) {
                    this.style.willChange = 'transform, box-shadow';
                }
            }).on('mouseleave', function() {
                setTimeout(() => {
                    this.style.willChange = 'auto';
                }, 300);
            });

            // Tabs
            $('.mase-md3-tab').on('mouseenter', function() {
                if (!self.isLowEndDevice) {
                    this.style.willChange = 'transform, background-color';
                }
            }).on('mouseleave', function() {
                setTimeout(() => {
                    this.style.willChange = 'auto';
                }, 200);
            });

            // Toggle switches
            $('.mase-toggle').on('mouseenter', function() {
                if (!self.isLowEndDevice) {
                    this.style.willChange = 'background-color, border-color';
                }
            }).on('mouseleave', function() {
                setTimeout(() => {
                    this.style.willChange = 'auto';
                }, 300);
            });
        }

        /**
         * Set up requestAnimationFrame-based animations
         * Requirement 22.2
         */
        setupRAFAnimations() {
            const self = this;

            // Smooth scroll animations using RAF
            $('.md-use-raf').each(function() {
                const element = this;
                let startTime = null;
                let isAnimating = false;

                $(element).on('click', function(e) {
                    if (isAnimating) return;
                    
                    isAnimating = true;
                    startTime = null;

                    function animate(timestamp) {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;
                        const duration = 300;

                        if (progress < duration) {
                            // Continue animation
                            self.rafId = requestAnimationFrame(animate);
                        } else {
                            // Animation complete
                            isAnimating = false;
                            element.style.willChange = 'auto';
                        }
                    }

                    element.style.willChange = 'transform, opacity';
                    self.rafId = requestAnimationFrame(animate);
                });
            });
        }

        /**
         * Animate element with RAF for smooth 60fps
         * Requirement 22.1, 22.2
         * 
         * @param {HTMLElement} element - Element to animate
         * @param {Object} options - Animation options
         */
        animateWithRAF(element, options = {}) {
            const {
                duration = 300,
                easing = 'easeOutCubic',
                properties = {},
                onComplete = null
            } = options;

            if (this.isLowEndDevice) {
                // Skip animation on low-end devices
                Object.keys(properties).forEach(prop => {
                    element.style[prop] = properties[prop].to;
                });
                if (onComplete) onComplete();
                return;
            }

            const startTime = performance.now();
            const startValues = {};

            // Get starting values
            Object.keys(properties).forEach(prop => {
                const computed = window.getComputedStyle(element);
                startValues[prop] = parseFloat(computed[prop]) || properties[prop].from;
            });

            // Set will-change (Requirement 22.1)
            element.style.willChange = Object.keys(properties).join(', ');
            element.classList.add('animating');

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Apply easing
                const easedProgress = this.easingFunctions[easing](progress);

                // Update properties
                Object.keys(properties).forEach(prop => {
                    const start = startValues[prop];
                    const end = properties[prop].to;
                    const current = start + (end - start) * easedProgress;
                    element.style[prop] = current + (properties[prop].unit || '');
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Animation complete - remove will-change (Requirement 22.4)
                    element.classList.remove('animating');
                    setTimeout(() => {
                        element.style.willChange = 'auto';
                    }, 100);
                    
                    if (onComplete) onComplete();
                }
            };

            requestAnimationFrame(animate);
        }

        /**
         * Easing functions for smooth animations
         * Requirement 22.2
         */
        easingFunctions = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            // MD3 emphasized easing
            emphasized: t => {
                // cubic-bezier(0.2, 0.0, 0, 1.0)
                return this.cubicBezier(t, 0.2, 0.0, 0, 1.0);
            },
            // MD3 standard easing
            standard: t => {
                // cubic-bezier(0.2, 0.0, 0, 1.0)
                return this.cubicBezier(t, 0.2, 0.0, 0, 1.0);
            }
        };

        /**
         * Cubic bezier implementation
         */
        cubicBezier(t, p1x, p1y, p2x, p2y) {
            const cx = 3 * p1x;
            const bx = 3 * (p2x - p1x) - cx;
            const ax = 1 - cx - bx;
            
            const cy = 3 * p1y;
            const by = 3 * (p2y - p1y) - cy;
            const ay = 1 - cy - by;
            
            const sampleCurveX = t => ((ax * t + bx) * t + cx) * t;
            const sampleCurveY = t => ((ay * t + by) * t + cy) * t;
            
            // Binary search for t
            let t0 = 0;
            let t1 = 1;
            let t2 = t;
            
            for (let i = 0; i < 8; i++) {
                const x2 = sampleCurveX(t2);
                if (Math.abs(x2 - t) < 0.001) break;
                if (x2 < t) t0 = t2;
                else t1 = t2;
                t2 = (t1 + t0) / 2;
            }
            
            return sampleCurveY(t2);
        }

        /**
         * Profile animation performance
         * Requirement 22.5
         */
        profileAnimation(name, callback) {
            const startTime = performance.now();
            let frameCount = 0;
            let lastFrameTime = startTime;

            const measureFrame = () => {
                const currentTime = performance.now();
                const frameDuration = currentTime - lastFrameTime;
                const fps = 1000 / frameDuration;
                
                frameCount++;
                lastFrameTime = currentTime;

                // Log if FPS drops below 60
                if (fps < 55) {
                    console.warn(`Animation "${name}" FPS drop:`, fps.toFixed(2));
                }

                if (callback && callback() !== false) {
                    requestAnimationFrame(measureFrame);
                } else {
                    const totalTime = currentTime - startTime;
                    const avgFps = (frameCount / totalTime) * 1000;
                    console.log(`Animation "${name}" complete:`, {
                        totalTime: totalTime.toFixed(2) + 'ms',
                        frames: frameCount,
                        avgFps: avgFps.toFixed(2)
                    });
                }
            };

            requestAnimationFrame(measureFrame);
        }

        /**
         * Batch DOM reads and writes to avoid layout thrashing
         * Requirement 22.2
         */
        batchDOMOperations(reads, writes) {
            // Perform all reads first
            const readResults = reads.map(fn => fn());
            
            // Then perform all writes
            requestAnimationFrame(() => {
                writes.forEach((fn, index) => fn(readResults[index]));
            });
        }

        /**
         * Clean up
         */
        destroy() {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
            this.animatingElements.clear();
        }
    }

    /**
     * Initialize on document ready
     */
    $(document).ready(function() {
        // Create global motion manager instance
        window.maseMotionManager = new MotionManager();

        // Example: Profile template card hover animation
        if (window.location.search.includes('debug=performance')) {
            $('.mase-template-card').on('mouseenter', function() {
                const card = this;
                window.maseMotionManager.profileAnimation('template-card-hover', function() {
                    return card.matches(':hover');
                });
            });
        }
    });

})(jQuery);
