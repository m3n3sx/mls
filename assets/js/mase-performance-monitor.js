/**
 * MASE Performance Monitor
 * 
 * Monitors and displays performance metrics including FPS counter,
 * memory usage, and provides performance recommendations.
 * 
 * Requirements: 18.1, 18.2, 18.4, 18.5
 * 
 * @package MASE
 * @since 1.3.0
 */

(function ($) {
    'use strict';

    /**
     * Performance Monitor Module
     */
    window.MASE_PerformanceMonitor = {
        /**
         * Configuration
         */
        config: {
            enabled: false,
            showInAdminBar: false,
            sampleInterval: 1000, // 1 second
            fpsThreshold: {
                good: 55,
                medium: 30,
                poor: 30
            }
        },

        /**
         * State
         */
        state: {
            fps: 0,
            avgFps: 0,
            minFps: 60,
            maxFps: 0,
            frameCount: 0,
            lastTime: 0,
            samples: [],
            maxSamples: 60,
            isMonitoring: false,
            animationFrameId: null
        },

        /**
         * Initialize performance monitor
         * Requirement 18.2: Initialize FPS monitoring
         */
        init: function () {
            var self = this;

            // Check if performance monitoring is enabled in settings
            var settings = window.maseSettings || {};
            this.config.enabled = settings.performance_monitoring_enabled || false;
            this.config.showInAdminBar = settings.show_fps_in_admin_bar || false;

            if (!this.config.enabled) {
                return;
            }

            // Create UI elements
            this.createUI();

            // Start monitoring
            this.startMonitoring();

            // Add toggle button to admin bar if enabled
            if (this.config.showInAdminBar) {
                this.addAdminBarIndicator();
            }

            // Log initialization
            if (window.MASE_DEBUG) {
                MASE_DEBUG.log('Performance Monitor: Initialized');
            }
        },

        /**
         * Create UI elements for performance display
         * Requirement 18.2: Display FPS in admin bar (optional)
         */
        createUI: function () {
            // Create performance panel
            var $panel = $('<div>', {
                id: 'mase-performance-panel',
                class: 'mase-performance-panel',
                html: `
                    <div class="mase-perf-header">
                        <span class="mase-perf-title">Performance</span>
                        <button class="mase-perf-close" aria-label="Close">&times;</button>
                    </div>
                    <div class="mase-perf-content">
                        <div class="mase-perf-metric">
                            <span class="mase-perf-label">FPS:</span>
                            <span class="mase-perf-value" id="mase-fps-current">--</span>
                            <span class="mase-perf-rating" id="mase-fps-rating"></span>
                        </div>
                        <div class="mase-perf-metric">
                            <span class="mase-perf-label">Avg:</span>
                            <span class="mase-perf-value" id="mase-fps-avg">--</span>
                        </div>
                        <div class="mase-perf-metric">
                            <span class="mase-perf-label">Min:</span>
                            <span class="mase-perf-value" id="mase-fps-min">--</span>
                        </div>
                        <div class="mase-perf-metric">
                            <span class="mase-perf-label">Max:</span>
                            <span class="mase-perf-value" id="mase-fps-max">--</span>
                        </div>
                    </div>
                `
            });

            // Add to body
            $('body').append($panel);

            // Bind close button
            $panel.find('.mase-perf-close').on('click', function () {
                $panel.hide();
            });

            // Make panel draggable if jQuery UI is available
            if ($.fn.draggable) {
                $panel.draggable({ handle: '.mase-perf-header' });
            }
        },

        /**
         * Add FPS indicator to admin bar
         * Requirement 18.2: Display FPS in admin bar (optional)
         */
        addAdminBarIndicator: function () {
            var $adminBar = $('#wpadminbar');
            if ($adminBar.length === 0) {
                return;
            }

            // Create admin bar item
            var $item = $('<li>', {
                id: 'wp-admin-bar-mase-fps',
                html: `
                    <a class="ab-item" href="#" id="mase-fps-indicator">
                        <span class="ab-icon dashicons dashicons-performance"></span>
                        <span class="ab-label">FPS: <span id="mase-fps-display">--</span></span>
                    </a>
                `
            });

            // Add to admin bar
            $adminBar.find('#wp-admin-bar-root-default').append($item);

            // Toggle panel on click
            $('#mase-fps-indicator').on('click', function (e) {
                e.preventDefault();
                $('#mase-performance-panel').toggle();
            });
        },

        /**
         * Start FPS monitoring
         * Requirement 18.2: Log performance metrics
         */
        startMonitoring: function () {
            if (this.state.isMonitoring) {
                return;
            }

            this.state.isMonitoring = true;
            this.state.lastTime = performance.now();
            this.state.frameCount = 0;

            // Start animation frame loop
            this.measureFrame();

            // Log start
            if (window.MASE_DEBUG) {
                MASE_DEBUG.log('Performance Monitor: Started monitoring');
            }
        },

        /**
         * Stop FPS monitoring
         */
        stopMonitoring: function () {
            if (!this.state.isMonitoring) {
                return;
            }

            this.state.isMonitoring = false;

            if (this.state.animationFrameId) {
                cancelAnimationFrame(this.state.animationFrameId);
                this.state.animationFrameId = null;
            }

            // Log stop
            if (window.MASE_DEBUG) {
                MASE_DEBUG.log('Performance Monitor: Stopped monitoring');
            }
        },

        /**
         * Measure frame rate
         * Uses requestAnimationFrame for accurate FPS measurement
         */
        measureFrame: function () {
            var self = this;

            if (!this.state.isMonitoring) {
                return;
            }

            var currentTime = performance.now();
            var deltaTime = currentTime - this.state.lastTime;

            this.state.frameCount++;

            // Update FPS every second
            if (deltaTime >= this.config.sampleInterval) {
                // Calculate FPS
                var fps = Math.round((this.state.frameCount * 1000) / deltaTime);
                this.state.fps = fps;

                // Update min/max
                if (fps < this.state.minFps) {
                    this.state.minFps = fps;
                }
                if (fps > this.state.maxFps) {
                    this.state.maxFps = fps;
                }

                // Add to samples for average calculation
                this.state.samples.push(fps);
                if (this.state.samples.length > this.state.maxSamples) {
                    this.state.samples.shift();
                }

                // Calculate average
                var sum = this.state.samples.reduce(function (a, b) { return a + b; }, 0);
                this.state.avgFps = Math.round(sum / this.state.samples.length);

                // Update UI
                this.updateUI();

                // Reset counters
                this.state.frameCount = 0;
                this.state.lastTime = currentTime;
            }

            // Continue measuring
            this.state.animationFrameId = requestAnimationFrame(function () {
                self.measureFrame();
            });
        },

        /**
         * Update UI with current metrics
         */
        updateUI: function () {
            // Update performance panel
            $('#mase-fps-current').text(this.state.fps);
            $('#mase-fps-avg').text(this.state.avgFps);
            $('#mase-fps-min').text(this.state.minFps);
            $('#mase-fps-max').text(this.state.maxFps);

            // Update rating
            var rating = this.getFPSRating(this.state.fps);
            var $ratingEl = $('#mase-fps-rating');
            $ratingEl.text(rating.label)
                .removeClass('good medium poor')
                .addClass(rating.class);

            // Update admin bar if enabled
            if (this.config.showInAdminBar) {
                $('#mase-fps-display').text(this.state.fps);
            }
        },

        /**
         * Get FPS rating
         * Requirement 18.2: Calculate performance impact
         * 
         * @param {number} fps - Current FPS
         * @return {Object} Rating object with label and class
         */
        getFPSRating: function (fps) {
            if (fps >= this.config.fpsThreshold.good) {
                return { label: 'Good', class: 'good' };
            } else if (fps >= this.config.fpsThreshold.medium) {
                return { label: 'Medium', class: 'medium' };
            } else {
                return { label: 'Poor', class: 'poor' };
            }
        },

        /**
         * Get current performance metrics
         * Requirement 18.2: Measure average FPS
         * 
         * @return {Object} Performance metrics
         */
        getMetrics: function () {
            return {
                fps: this.state.fps,
                avgFps: this.state.avgFps,
                minFps: this.state.minFps,
                maxFps: this.state.maxFps,
                rating: this.getFPSRating(this.state.avgFps)
            };
        },

        /**
         * Log performance metrics to console
         * Requirement 18.2: Log performance metrics
         */
        logMetrics: function () {
            var metrics = this.getMetrics();

            if (window.MASE_DEBUG) {
                MASE_DEBUG.log('Performance Metrics:', {
                    'Current FPS': metrics.fps,
                    'Average FPS': metrics.avgFps,
                    'Min FPS': metrics.minFps,
                    'Max FPS': metrics.maxFps,
                    'Rating': metrics.rating.label
                });
            }

            return metrics;
        },

        /**
         * Reset metrics
         */
        resetMetrics: function () {
            this.state.fps = 0;
            this.state.avgFps = 0;
            this.state.minFps = 60;
            this.state.maxFps = 0;
            this.state.samples = [];

            this.updateUI();

            if (window.MASE_DEBUG) {
                MASE_DEBUG.log('Performance Monitor: Metrics reset');
            }
        },

        /**
         * Enable performance monitoring
         */
        enable: function () {
            this.config.enabled = true;
            this.startMonitoring();
        },

        /**
         * Disable performance monitoring
         */
        disable: function () {
            this.config.enabled = false;
            this.stopMonitoring();
        }
    };

    /**
     * Initialize on document ready
     */
    $(document).ready(function () {
        // Auto-initialize if on MASE settings page
        if ($('body').hasClass('toplevel_page_modern-admin-styler')) {
            MASE_PerformanceMonitor.init();
        }
    });

})(jQuery);

        /**
         * Theme Performance Ratings
         * Requirement 18.2: Calculate performance impact for each theme
         */
        themeRatings: {
            'terminal': {
                impact: 'medium',
                score: 65,
                description: 'Moderate effects with scanlines and glow'
            },
            'gaming': {
                impact: 'high',
                score: 45,
                description: 'Heavy effects with particles and RGB cycling'
            },
            'glass': {
                impact: 'high',
                score: 50,
                description: 'Intensive blur and backdrop filters'
            },
            'gradient': {
                impact: 'medium',
                score: 60,
                description: 'Animated gradients with moderate complexity'
            },
            'floral': {
                impact: 'medium',
                score: 70,
                description: 'Organic animations with floating elements'
            },
            'retro': {
                impact: 'medium',
                score: 55,
                description: 'VHS effects and chromatic aberration'
            },
            'professional': {
                impact: 'low',
                score: 85,
                description: 'Minimal effects, optimized performance'
            },
            'minimal': {
                impact: 'low',
                score: 90,
                description: 'Clean design with minimal animations'
            }
        },

        /**
         * Get performance rating for a theme
         * Requirement 18.2: Display rating (Low, Medium, High)
         * 
         * @param {string} themeId - Theme identifier
         * @return {Object} Rating object with impact, score, and description
         */
        getThemeRating: function (themeId) {
            return this.themeRatings[themeId] || {
                impact: 'unknown',
                score: 0,
                description: 'Performance data not available'
            };
        },

        /**
         * Add performance badges to template cards
         * Requirement 18.2: Show in template card
         */
        addPerformanceBadges: function () {
            var self = this;

            $('.mase-template-card, .mase-template-preview-card').each(function () {
                var $card = $(this);
                var templateId = $card.attr('data-template');

                if (!templateId) {
                    return;
                }

                // Get rating for this theme
                var rating = self.getThemeRating(templateId);

                // Check if badge already exists
                if ($card.find('.mase-perf-badge').length > 0) {
                    return;
                }

                // Create performance badge
                var $badge = $('<div>', {
                    class: 'mase-perf-badge mase-perf-badge-' + rating.impact,
                    html: `
                        <span class="mase-perf-badge-icon">⚡</span>
                        <span class="mase-perf-badge-label">${rating.impact.charAt(0).toUpperCase() + rating.impact.slice(1)} Impact</span>
                        <span class="mase-perf-badge-score">${rating.score}/100</span>
                    `,
                    attr: {
                        'title': rating.description,
                        'aria-label': 'Performance: ' + rating.impact + ' impact, score ' + rating.score + ' out of 100'
                    }
                });

                // Add badge to card
                var $cardHeader = $card.find('.mase-template-info, .mase-template-header');
                if ($cardHeader.length > 0) {
                    $cardHeader.append($badge);
                } else {
                    $card.prepend($badge);
                }
            });

            if (window.MASE_DEBUG) {
                MASE_DEBUG.log('Performance Monitor: Added performance badges to template cards');
            }
        },

        /**
         * Detect system capabilities
         * Requirement 18.4: Analyze system capabilities
         * 
         * @return {Object} System capability information
         */
        detectSystemCapabilities: function () {
            var capabilities = {
                deviceMemory: navigator.deviceMemory || 'unknown',
                hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
                connection: 'unknown',
                deviceType: 'desktop',
                gpuTier: 'unknown'
            };

            // Detect connection type
            if (navigator.connection) {
                capabilities.connection = navigator.connection.effectiveType || 'unknown';
            }

            // Detect device type
            var userAgent = navigator.userAgent.toLowerCase();
            if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
                capabilities.deviceType = 'mobile';
            }

            // Estimate GPU tier based on available info
            if (capabilities.deviceMemory !== 'unknown' && capabilities.hardwareConcurrency !== 'unknown') {
                if (capabilities.deviceMemory >= 8 && capabilities.hardwareConcurrency >= 8) {
                    capabilities.gpuTier = 'high';
                } else if (capabilities.deviceMemory >= 4 && capabilities.hardwareConcurrency >= 4) {
                    capabilities.gpuTier = 'medium';
                } else {
                    capabilities.gpuTier = 'low';
                }
            }

            return capabilities;
        },

        /**
         * Get recommended themes based on system capabilities
         * Requirement 18.4: Suggest appropriate themes
         * 
         * @return {Array} Array of recommended theme IDs
         */
        getRecommendedThemes: function () {
            var capabilities = this.detectSystemCapabilities();
            var recommended = [];

            // High-end systems can handle any theme
            if (capabilities.gpuTier === 'high') {
                recommended = ['gaming', 'glass', 'gradient', 'terminal', 'floral', 'retro', 'professional', 'minimal'];
            }
            // Medium systems should avoid heavy themes
            else if (capabilities.gpuTier === 'medium') {
                recommended = ['gradient', 'terminal', 'floral', 'retro', 'professional', 'minimal'];
            }
            // Low-end systems should use lightweight themes
            else {
                recommended = ['professional', 'minimal'];
            }

            // Mobile devices should use optimized themes
            if (capabilities.deviceType === 'mobile') {
                recommended = ['professional', 'minimal', 'terminal'];
            }

            return recommended;
        },

        /**
         * Get performance recommendation based on current metrics
         * Requirement 18.4: Recommend Performance Mode if needed
         * 
         * @return {Object} Recommendation object
         */
        getRecommendation: function () {
            var metrics = this.getMetrics();
            var capabilities = this.detectSystemCapabilities();
            var recommendedThemes = this.getRecommendedThemes();
            
            var recommendation = {
                message: '',
                action: '',
                severity: 'info',
                themes: recommendedThemes,
                capabilities: capabilities
            };

            if (metrics.avgFps < 30) {
                recommendation.message = 'Performance is poor (' + metrics.avgFps + ' FPS). ';
                
                if (capabilities.gpuTier === 'low' || capabilities.deviceType === 'mobile') {
                    recommendation.message += 'Your device has limited resources. We recommend using the Professional or Minimal themes and enabling Performance Mode.';
                } else {
                    recommendation.message += 'Consider enabling Performance Mode or choosing a lighter theme.';
                }
                
                recommendation.action = 'enable_performance_mode';
                recommendation.severity = 'error';
            } else if (metrics.avgFps < 45) {
                recommendation.message = 'Performance could be improved (' + metrics.avgFps + ' FPS). ';
                
                if (capabilities.gpuTier === 'medium') {
                    recommendation.message += 'Try using themes like Gradient, Terminal, or Professional for better performance.';
                } else {
                    recommendation.message += 'Try reducing animation intensity or enabling Performance Mode.';
                }
                
                recommendation.action = 'reduce_intensity';
                recommendation.severity = 'warning';
            } else if (metrics.avgFps < 55) {
                recommendation.message = 'Performance is acceptable (' + metrics.avgFps + ' FPS) but could be optimized.';
                recommendation.action = 'optimize';
                recommendation.severity = 'info';
            } else {
                recommendation.message = 'Performance is excellent (' + metrics.avgFps + ' FPS)! Your system can handle any theme.';
                recommendation.action = 'none';
                recommendation.severity = 'success';
            }

            return recommendation;
        },

        /**
         * Fetch and display CSS file sizes for templates
         * Requirement 18.3: Display in theme info
         */
        fetchTemplateSizes: function () {
            var self = this;

            $.ajax({
                url: window.maseL10n ? maseL10n.ajaxUrl : ajaxurl,
                type: 'POST',
                data: {
                    action: 'mase_get_template_sizes',
                    nonce: window.maseL10n ? maseL10n.nonce : ''
                },
                success: function (response) {
                    if (response.success && response.data.sizes) {
                        self.displayTemplateSizes(response.data.sizes);
                    }
                },
                error: function (xhr, status, error) {
                    if (window.MASE_DEBUG) {
                        MASE_DEBUG.error('Failed to fetch template sizes:', error);
                    }
                }
            });
        },

        /**
         * Display CSS file sizes on template cards
         * Requirement 18.3: Display in theme info, Warn if size exceeds threshold
         * 
         * @param {Object} sizes - Template sizes indexed by template ID
         */
        displayTemplateSizes: function (sizes) {
            $('.mase-template-card, .mase-template-preview-card').each(function () {
                var $card = $(this);
                var templateId = $card.attr('data-template');

                if (!templateId || !sizes[templateId]) {
                    return;
                }

                var sizeInfo = sizes[templateId];

                // Check if size info already exists
                if ($card.find('.mase-css-size-info').length > 0) {
                    return;
                }

                // Create size info element
                var $sizeInfo = $('<div>', {
                    class: 'mase-css-size-info' + (sizeInfo.warning ? ' mase-css-size-warning' : ''),
                    html: `
                        <span class="mase-css-size-icon">📄</span>
                        <span class="mase-css-size-label">CSS Size:</span>
                        <span class="mase-css-size-value">${sizeInfo.formatted}</span>
                        ${sizeInfo.warning ? '<span class="mase-css-size-warning-icon" title="Large file size may impact performance">⚠️</span>' : ''}
                    `,
                    attr: {
                        'title': sizeInfo.warning ? 'Warning: Large CSS file (>' + sizeInfo.kb + ' KB) may impact performance' : 'CSS file size: ' + sizeInfo.formatted
                    }
                });

                // Add to card footer or create footer if it doesn't exist
                var $cardFooter = $card.find('.mase-template-footer, .mase-template-info');
                if ($cardFooter.length > 0) {
                    $cardFooter.append($sizeInfo);
                } else {
                    $card.append($sizeInfo);
                }
            });

            if (window.MASE_DEBUG) {
                MASE_DEBUG.log('Performance Monitor: Added CSS size info to template cards');
            }
        },

        /**
         * Show performance recommendation notification
         * Requirement 18.4: Suggest appropriate themes
         */
        showRecommendation: function () {
            var recommendation = this.getRecommendation();

            // Build recommended themes HTML
            var themesHtml = '';
            if (recommendation.themes && recommendation.themes.length > 0 && recommendation.severity !== 'success') {
                themesHtml = '<div class="mase-perf-recommended-themes">';
                themesHtml += '<strong>Recommended themes:</strong> ';
                themesHtml += recommendation.themes.map(function(theme) {
                    return '<span class="mase-perf-theme-tag">' + theme.charAt(0).toUpperCase() + theme.slice(1) + '</span>';
                }).join(' ');
                themesHtml += '</div>';
            }

            // Build system info HTML
            var systemInfoHtml = '';
            if (recommendation.capabilities) {
                var cap = recommendation.capabilities;
                systemInfoHtml = '<div class="mase-perf-system-info">';
                systemInfoHtml += '<small>';
                systemInfoHtml += 'Device: ' + cap.deviceType;
                if (cap.gpuTier !== 'unknown') {
                    systemInfoHtml += ' | GPU: ' + cap.gpuTier;
                }
                if (cap.deviceMemory !== 'unknown') {
                    systemInfoHtml += ' | RAM: ' + cap.deviceMemory + 'GB';
                }
                systemInfoHtml += '</small>';
                systemInfoHtml += '</div>';
            }

            // Create notification element
            var $notification = $('<div>', {
                class: 'mase-perf-notification mase-perf-notification-' + recommendation.severity,
                html: `
                    <div class="mase-perf-notification-content">
                        <span class="mase-perf-notification-icon">ℹ️</span>
                        <div class="mase-perf-notification-body">
                            <span class="mase-perf-notification-message">${recommendation.message}</span>
                            ${themesHtml}
                            ${systemInfoHtml}
                        </div>
                    </div>
                    <button class="mase-perf-notification-close" aria-label="Close">&times;</button>
                `
            });

            // Add to body
            $('body').append($notification);

            // Show notification
            setTimeout(function () {
                $notification.addClass('active');
            }, 100);

            // Bind close button
            $notification.find('.mase-perf-notification-close').on('click', function () {
                $notification.removeClass('active');
                setTimeout(function () {
                    $notification.remove();
                }, 300);
            });

            // Auto-hide after 15 seconds (longer for recommendations)
            setTimeout(function () {
                if ($notification.hasClass('active')) {
                    $notification.removeClass('active');
                    setTimeout(function () {
                        $notification.remove();
                    }, 300);
                }
            }, 15000);
        },

        /**
         * Highlight recommended themes on template cards
         * Requirement 18.4: Suggest appropriate themes
         */
        highlightRecommendedThemes: function () {
            var recommendedThemes = this.getRecommendedThemes();

            $('.mase-template-card, .mase-template-preview-card').each(function () {
                var $card = $(this);
                var templateId = $card.attr('data-template');

                if (!templateId) {
                    return;
                }

                // Remove existing recommendation badge
                $card.find('.mase-recommended-badge').remove();

                // Add recommendation badge if theme is recommended
                if (recommendedThemes.indexOf(templateId) !== -1) {
                    var $badge = $('<div>', {
                        class: 'mase-recommended-badge',
                        html: '<span class="dashicons dashicons-yes-alt"></span> Recommended',
                        attr: {
                            'title': 'This theme is recommended for your system',
                            'aria-label': 'Recommended theme for your system'
                        }
                    });

                    var $cardHeader = $card.find('.mase-template-info, .mase-template-header');
                    if ($cardHeader.length > 0) {
                        $cardHeader.prepend($badge);
                    } else {
                        $card.prepend($badge);
                    }
                }
            });

            if (window.MASE_DEBUG) {
                MASE_DEBUG.log('Performance Monitor: Highlighted recommended themes', recommendedThemes);
            }
        }
    };

    /**
     * Initialize on document ready
     */
    $(document).ready(function () {
        // Auto-initialize if on MASE settings page
        if ($('body').hasClass('toplevel_page_mase-settings')) {
            MASE_PerformanceMonitor.init();

            // Add performance badges to template cards after a short delay
            // to ensure cards are rendered
            setTimeout(function () {
                MASE_PerformanceMonitor.addPerformanceBadges();
                MASE_PerformanceMonitor.fetchTemplateSizes();
                MASE_PerformanceMonitor.highlightRecommendedThemes();
            }, 500);

            // Show recommendation after 30 seconds of monitoring
            setTimeout(function () {
                if (MASE_PerformanceMonitor.state.samples.length > 10) {
                    MASE_PerformanceMonitor.showRecommendation();
                }
            }, 30000);
        }
    });

})(jQuery);
