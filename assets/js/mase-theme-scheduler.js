/**
 * Theme Scheduler Module
 * Handles time-based theme scheduling
 *
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function ($) {
    'use strict';

    /**
     * Theme Scheduler Class
     */
    class MASEThemeScheduler {
        constructor() {
            this.settings = window.maseSchedulerData || {};
            this.enabled = false;
            this.syncWithSystem = false;
            this.schedule = {
                morning: { start: '06:00', end: '12:00', theme: '' },
                afternoon: { start: '12:00', end: '18:00', theme: '' },
                evening: { start: '18:00', end: '22:00', theme: '' },
                night: { start: '22:00', end: '06:00', theme: '' }
            };
            this.currentPeriod = null;
            this.checkInterval = null;
            this.templates = [];

            this.init();
        }

        /**
         * Initialize scheduler
         */
        init() {
            // Load saved settings
            this.loadSettings();

            // Bind events
            this.bindEvents();

            // Update timeline
            this.updateTimeline();

            // Start checking if enabled
            if (this.enabled) {
                this.startScheduleCheck();
            }

            // Update admin bar indicator
            this.updateAdminBarIndicator();

            console.log('[MASE Scheduler] Initialized', {
                enabled: this.enabled,
                syncWithSystem: this.syncWithSystem,
                schedule: this.schedule
            });
        }

        /**
         * Load settings from WordPress options
         */
        loadSettings() {
            if (this.settings.enabled !== undefined) {
                this.enabled = Boolean(this.settings.enabled);
            }

            if (this.settings.syncWithSystem !== undefined) {
                this.syncWithSystem = Boolean(this.settings.syncWithSystem);
            }

            if (this.settings.schedule) {
                this.schedule = { ...this.schedule, ...this.settings.schedule };
            }

            if (this.settings.templates) {
                this.templates = this.settings.templates;
            }
        }

        /**
         * Bind event handlers
         */
        bindEvents() {
            const self = this;

            // Enable/disable scheduler
            $(document).on('change', '#mase-scheduler-enabled', function () {
                self.enabled = $(this).is(':checked');
                self.toggleScheduler();
            });

            // Sync with system dark mode
            $(document).on('change', '#mase-scheduler-sync-system', function () {
                self.syncWithSystem = $(this).is(':checked');
                self.handleSystemSync();
            });

            // Period theme selection
            $(document).on('change', '.mase-period-theme-select', function () {
                const period = $(this).data('period');
                const theme = $(this).val();
                self.updatePeriodTheme(period, theme);
            });

            // Quick disable button
            $(document).on('click', '.mase-scheduler-disable-btn', function (e) {
                e.preventDefault();
                self.quickDisable();
            });

            // Save scheduler settings
            $(document).on('click', '#mase-save-scheduler', function (e) {
                e.preventDefault();
                self.saveSettings();
            });

            // Listen for system dark mode changes
            if (window.matchMedia) {
                const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                darkModeQuery.addListener(function () {
                    if (self.syncWithSystem) {
                        self.handleSystemSync();
                    }
                });
            }
        }

        /**
         * Toggle scheduler on/off
         */
        toggleScheduler() {
            if (this.enabled) {
                this.startScheduleCheck();
                this.applyCurrentPeriodTheme();
            } else {
                this.stopScheduleCheck();
            }

            this.updateAdminBarIndicator();
            console.log('[MASE Scheduler] Toggled:', this.enabled);
        }

        /**
         * Start checking schedule
         */
        startScheduleCheck() {
            // Check immediately
            this.checkSchedule();

            // Check every minute
            this.checkInterval = setInterval(() => {
                this.checkSchedule();
            }, 60000);

            console.log('[MASE Scheduler] Started checking schedule');
        }

        /**
         * Stop checking schedule
         */
        stopScheduleCheck() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }

            console.log('[MASE Scheduler] Stopped checking schedule');
        }

        /**
         * Check current time and apply appropriate theme
         */
        checkSchedule() {
            const now = new Date();
            const currentTime = this.formatTime(now);
            const period = this.getCurrentPeriod(currentTime);

            if (period !== this.currentPeriod) {
                console.log('[MASE Scheduler] Period changed:', this.currentPeriod, '->', period);
                this.currentPeriod = period;
                this.applyCurrentPeriodTheme();
                this.updateAdminBarIndicator();
            }

            this.updateTimeline();
        }

        /**
         * Get current time period
         */
        getCurrentPeriod(time) {
            const timeMinutes = this.timeToMinutes(time);

            for (const [period, config] of Object.entries(this.schedule)) {
                const startMinutes = this.timeToMinutes(config.start);
                const endMinutes = this.timeToMinutes(config.end);

                // Handle periods that cross midnight
                if (startMinutes > endMinutes) {
                    if (timeMinutes >= startMinutes || timeMinutes < endMinutes) {
                        return period;
                    }
                } else {
                    if (timeMinutes >= startMinutes && timeMinutes < endMinutes) {
                        return period;
                    }
                }
            }

            return 'morning'; // Default
        }

        /**
         * Apply theme for current period
         */
        applyCurrentPeriodTheme() {
            if (!this.enabled || !this.currentPeriod) {
                return;
            }

            const periodConfig = this.schedule[this.currentPeriod];
            if (!periodConfig || !periodConfig.theme) {
                console.log('[MASE Scheduler] No theme configured for period:', this.currentPeriod);
                return;
            }

            const theme = periodConfig.theme;
            console.log('[MASE Scheduler] Applying theme for', this.currentPeriod, ':', theme);

            // Apply theme via AJAX
            this.applyTheme(theme);
        }

        /**
         * Apply theme with smooth transitions
         * Requirement 20.2: Handle theme transitions
         */
        applyTheme(themeId) {
            // Trigger transition start event
            $(document).trigger('mase:theme:apply:start', [{
                templateId: themeId,
                templateName: themeId,
                source: 'scheduler'
            }]);

            $.ajax({
                url: window.ajaxurl || '/wp-admin/admin-ajax.php',
                type: 'POST',
                data: {
                    action: 'mase_apply_template',
                    template_id: themeId,
                    nonce: window.maseAdminData?.nonce || ''
                },
                success: (response) => {
                    if (response.success) {
                        console.log('[MASE Scheduler] Theme applied successfully:', themeId);
                        
                        // Trigger theme change complete event
                        $(document).trigger('mase:theme:apply:complete', [themeId]);
                        
                        // Also trigger legacy event for backward compatibility
                        $(document).trigger('mase:themeChanged', [themeId]);
                        
                        // Show notification
                        this.showNotification('Theme changed to ' + themeId);
                        
                        // Reload page to apply new theme CSS
                        setTimeout(() => {
                            window.location.reload();
                        }, 600); // Wait for transition to complete
                    } else {
                        console.error('[MASE Scheduler] Failed to apply theme:', response.data);
                        
                        // Trigger error event
                        $(document).trigger('mase:theme:apply:error');
                        
                        this.showNotification('Failed to apply theme', 'error');
                    }
                },
                error: (xhr, status, error) => {
                    console.error('[MASE Scheduler] AJAX error:', error);
                    
                    // Trigger error event
                    $(document).trigger('mase:theme:apply:error');
                    
                    this.showNotification('Failed to apply theme', 'error');
                }
            });
        }

        /**
         * Update period theme
         */
        updatePeriodTheme(period, theme) {
            if (this.schedule[period]) {
                this.schedule[period].theme = theme;
                console.log('[MASE Scheduler] Updated', period, 'theme to:', theme);
            }
        }

        /**
         * Handle system dark mode sync
         */
        handleSystemSync() {
            if (!this.syncWithSystem) {
                return;
            }

            const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            console.log('[MASE Scheduler] System dark mode:', isDarkMode);

            // Apply appropriate theme based on system preference
            if (isDarkMode) {
                // Use evening/night themes
                this.applyTheme(this.schedule.evening.theme || this.schedule.night.theme);
            } else {
                // Use morning/afternoon themes
                this.applyTheme(this.schedule.morning.theme || this.schedule.afternoon.theme);
            }
        }

        /**
         * Update timeline visualization
         */
        updateTimeline() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const totalMinutes = hours * 60 + minutes;
            const percentage = (totalMinutes / 1440) * 100; // 1440 minutes in a day

            const $indicator = $('.mase-timeline-current');
            if ($indicator.length) {
                $indicator.css('left', percentage + '%');
            }
        }

        /**
         * Update admin bar indicator
         */
        updateAdminBarIndicator() {
            const $indicator = $('#wp-admin-bar-mase-schedule-indicator');
            if (!$indicator.length) {
                return;
            }

            if (!this.enabled) {
                $indicator.find('.mase-schedule-indicator').addClass('inactive');
                $indicator.find('.mase-schedule-status').text('Inactive');
                return;
            }

            $indicator.find('.mase-schedule-indicator').removeClass('inactive');
            $indicator.find('.mase-schedule-status').text('Active');

            // Show next theme change
            const nextPeriod = this.getNextPeriod();
            if (nextPeriod) {
                const nextTime = this.schedule[nextPeriod].start;
                $indicator.find('.mase-schedule-next').text('Next: ' + nextTime);
            }
        }

        /**
         * Get next period
         */
        getNextPeriod() {
            const now = new Date();
            const currentTime = this.formatTime(now);
            const currentMinutes = this.timeToMinutes(currentTime);

            const periods = ['morning', 'afternoon', 'evening', 'night'];
            for (const period of periods) {
                const startMinutes = this.timeToMinutes(this.schedule[period].start);
                if (startMinutes > currentMinutes) {
                    return period;
                }
            }

            return 'morning'; // Wrap to next day
        }

        /**
         * Quick disable scheduler
         */
        quickDisable() {
            this.enabled = false;
            $('#mase-scheduler-enabled').prop('checked', false);
            this.toggleScheduler();
            this.showNotification('Theme scheduler disabled');
        }

        /**
         * Save scheduler settings
         */
        saveSettings() {
            const settings = {
                enabled: this.enabled,
                syncWithSystem: this.syncWithSystem,
                schedule: this.schedule
            };

            $.ajax({
                url: window.ajaxurl || '/wp-admin/admin-ajax.php',
                type: 'POST',
                data: {
                    action: 'mase_save_scheduler_settings',
                    settings: JSON.stringify(settings),
                    nonce: window.maseAdminData?.nonce || ''
                },
                success: (response) => {
                    if (response.success) {
                        console.log('[MASE Scheduler] Settings saved successfully');
                        this.showNotification('Scheduler settings saved');
                    } else {
                        console.error('[MASE Scheduler] Failed to save settings:', response.data);
                        this.showNotification('Failed to save settings', 'error');
                    }
                },
                error: (xhr, status, error) => {
                    console.error('[MASE Scheduler] AJAX error:', error);
                    this.showNotification('Failed to save settings', 'error');
                }
            });
        }

        /**
         * Show notification
         */
        showNotification(message, type = 'success') {
            // Use WordPress admin notices if available
            if (typeof wp !== 'undefined' && wp.data) {
                wp.data.dispatch('core/notices').createNotice(type, message, {
                    isDismissible: true,
                    type: type
                });
            } else {
                // Fallback to console
                console.log('[MASE Scheduler]', message);
            }
        }

        /**
         * Utility: Format time as HH:MM
         */
        formatTime(date) {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }

        /**
         * Utility: Convert time string to minutes
         */
        timeToMinutes(time) {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        }
    }

    /**
     * Initialize on document ready
     */
    $(document).ready(function () {
        // Only initialize on MASE settings page
        if ($('.mase-scheduler-container').length) {
            window.maseScheduler = new MASEThemeScheduler();
        }
    });

})(jQuery);
