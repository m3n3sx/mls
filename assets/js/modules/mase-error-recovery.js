/**
 * MASE Error Recovery Module
 * 
 * Provides comprehensive error recovery mechanisms for the Advanced Background System.
 * Task 44: Implement error recovery (Requirement 7.5)
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - User-friendly error messages
 * - Fallback strategies
 * - Error logging for debugging
 * - Network error detection
 * - Upload progress tracking
 * 
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.4.0
 */

(function($) {
    'use strict';

    // Initialize MASE namespace if not exists
    window.MASE = window.MASE || {};

    /**
     * Error Recovery Module
     * Task 44: Comprehensive error recovery (Requirement 7.5)
     */
    MASE.errorRecovery = {
        /**
         * Maximum retry attempts for failed operations
         */
        maxRetries: 3,

        /**
         * Base delay for exponential backoff (milliseconds)
         */
        baseDelay: 1000,

        /**
         * Active retry operations tracking
         */
        activeRetries: {},

        /**
         * Initialize error recovery module
         */
        init: function() {
            console.log('MASE: Error recovery module initialized');
            
            // Set up global AJAX error handler
            this.setupGlobalErrorHandler();
            
            // Set up network status monitoring
            this.setupNetworkMonitoring();
        },

        /**
         * Set up global AJAX error handler
         * Task 44: Handle network errors gracefully (Requirement 7.5)
         */
        setupGlobalErrorHandler: function() {
            $(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
                // Only handle MASE-related AJAX calls
                if (ajaxSettings.url && ajaxSettings.url.indexOf('mase_') !== -1) {
                    console.error('MASE: AJAX error detected', {
                        url: ajaxSettings.url,
                        status: jqXHR.status,
                        error: thrownError
                    });
                }
            });
        },

        /**
         * Set up network status monitoring
         * Task 44: Detect network issues (Requirement 7.5)
         */
        setupNetworkMonitoring: function() {
            var self = this;

            // Monitor online/offline events
            window.addEventListener('online', function() {
                console.log('MASE: Network connection restored');
                self.showNotice('Network connection restored. You can continue working.', 'success');
            });

            window.addEventListener('offline', function() {
                console.log('MASE: Network connection lost');
                self.showNotice('Network connection lost. Changes will be saved when connection is restored.', 'warning');
            });
        },

        /**
         * Retry failed operation with exponential backoff
         * Task 44: Provide retry mechanisms (Requirement 7.5)
         * 
         * @param {Function} operation - Function to retry
         * @param {Object} options - Retry options
         * @returns {Promise} Promise that resolves when operation succeeds or max retries reached
         */
        retryOperation: function(operation, options) {
            var self = this;
            options = options || {};
            
            var maxRetries = options.maxRetries || this.maxRetries;
            var baseDelay = options.baseDelay || this.baseDelay;
            var operationId = options.operationId || 'operation_' + Date.now();
            var onRetry = options.onRetry || function() {};
            var onError = options.onError || function() {};

            // Track this retry operation
            this.activeRetries[operationId] = {
                attempts: 0,
                maxRetries: maxRetries,
                startTime: Date.now()
            };

            return new Promise(function(resolve, reject) {
                function attempt(retryCount) {
                    self.activeRetries[operationId].attempts = retryCount;

                    operation()
                        .then(function(result) {
                            // Success - clean up and resolve
                            delete self.activeRetries[operationId];
                            console.log('MASE: Operation succeeded', {
                                operationId: operationId,
                                attempts: retryCount + 1
                            });
                            resolve(result);
                        })
                        .catch(function(error) {
                            console.error('MASE: Operation failed', {
                                operationId: operationId,
                                attempt: retryCount + 1,
                                maxRetries: maxRetries,
                                error: error
                            });

                            if (retryCount < maxRetries) {
                                // Calculate exponential backoff delay
                                var delay = baseDelay * Math.pow(2, retryCount);
                                
                                console.log('MASE: Retrying operation in ' + delay + 'ms', {
                                    operationId: operationId,
                                    attempt: retryCount + 2,
                                    delay: delay
                                });

                                // Notify about retry
                                onRetry(retryCount + 1, maxRetries, delay);

                                // Retry after delay
                                setTimeout(function() {
                                    attempt(retryCount + 1);
                                }, delay);
                            } else {
                                // Max retries reached - clean up and reject
                                delete self.activeRetries[operationId];
                                console.error('MASE: Operation failed after max retries', {
                                    operationId: operationId,
                                    attempts: maxRetries + 1
                                });
                                onError(error);
                                reject(error);
                            }
                        });
                }

                // Start first attempt
                attempt(0);
            });
        },

        /**
         * Upload file with retry and progress tracking
         * Task 44: Handle upload failures gracefully (Requirement 7.5)
         * 
         * @param {File} file - File to upload
         * @param {Object} options - Upload options
         * @returns {Promise} Promise that resolves with upload result
         */
        uploadWithRetry: function(file, options) {
            var self = this;
            options = options || {};

            var area = options.area || 'dashboard';
            var onProgress = options.onProgress || function() {};
            var onRetry = options.onRetry || function() {};

            // Validate file before upload
            var validation = this.validateFile(file);
            if (!validation.valid) {
                return Promise.reject({
                    message: validation.message,
                    code: 'VALIDATION_ERROR'
                });
            }

            // Create upload operation
            var uploadOperation = function() {
                return new Promise(function(resolve, reject) {
                    var formData = new FormData();
                    formData.append('action', 'mase_upload_background_image');
                    formData.append('nonce', maseAdmin.nonce);
                    formData.append('area', area);
                    formData.append('file', file);

                    $.ajax({
                        url: maseAdmin.ajaxUrl,
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        xhr: function() {
                            var xhr = new window.XMLHttpRequest();
                            
                            // Upload progress tracking
                            xhr.upload.addEventListener('progress', function(e) {
                                if (e.lengthComputable) {
                                    var percentComplete = (e.loaded / e.total) * 100;
                                    onProgress(percentComplete);
                                }
                            }, false);

                            return xhr;
                        },
                        success: function(response) {
                            if (response.success) {
                                resolve(response.data);
                            } else {
                                reject({
                                    message: response.data.message || 'Upload failed',
                                    code: 'SERVER_ERROR',
                                    response: response
                                });
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            var errorMessage = self.getAjaxErrorMessage(jqXHR, textStatus, errorThrown);
                            reject({
                                message: errorMessage,
                                code: self.getErrorCode(jqXHR.status),
                                status: jqXHR.status,
                                textStatus: textStatus,
                                errorThrown: errorThrown
                            });
                        }
                    });
                });
            };

            // Retry upload with exponential backoff
            return this.retryOperation(uploadOperation, {
                maxRetries: 2, // Fewer retries for uploads (they're expensive)
                baseDelay: 2000, // Longer delay for uploads
                operationId: 'upload_' + area + '_' + Date.now(),
                onRetry: function(attempt, maxRetries, delay) {
                    onRetry(attempt, maxRetries);
                    self.showNotice(
                        'Upload failed. Retrying (' + attempt + '/' + maxRetries + ')...',
                        'warning'
                    );
                },
                onError: function(error) {
                    self.showNotice(
                        'Upload failed after ' + (self.maxRetries + 1) + ' attempts: ' + error.message,
                        'error'
                    );
                }
            });
        },

        /**
         * Validate file before upload
         * Task 44: Validate files client-side (Requirement 7.5)
         * 
         * @param {File} file - File to validate
         * @returns {Object} Validation result with valid boolean and message
         */
        validateFile: function(file) {
            // Check if file exists
            if (!file) {
                return {
                    valid: false,
                    message: 'No file selected'
                };
            }

            // Check file type
            var allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
            if (allowedTypes.indexOf(file.type) === -1) {
                return {
                    valid: false,
                    message: 'Invalid file type. Only JPG, PNG, WebP, and SVG files are allowed.'
                };
            }

            // Check file size (5MB max)
            var maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                return {
                    valid: false,
                    message: 'File size exceeds 5MB limit. Current size: ' + this.formatFileSize(file.size)
                };
            }

            // Check if file is empty
            if (file.size === 0) {
                return {
                    valid: false,
                    message: 'File is empty'
                };
            }

            return {
                valid: true,
                message: 'File is valid'
            };
        },

        /**
         * Get user-friendly AJAX error message
         * Task 44: Show user-friendly error messages (Requirement 7.5)
         * 
         * @param {Object} jqXHR - jQuery XHR object
         * @param {string} textStatus - Status text
         * @param {string} errorThrown - Error thrown
         * @returns {string} User-friendly error message
         */
        getAjaxErrorMessage: function(jqXHR, textStatus, errorThrown) {
            // Network error
            if (textStatus === 'timeout') {
                return 'Request timed out. Please check your connection and try again.';
            }

            if (textStatus === 'abort') {
                return 'Request was cancelled. Please try again.';
            }

            if (textStatus === 'error' && jqXHR.status === 0) {
                return 'Network error. Please check your internet connection.';
            }

            // HTTP status codes
            switch (jqXHR.status) {
                case 400:
                    return 'Invalid request. Please check your input and try again.';
                case 401:
                    return 'Session expired. Please refresh the page and try again.';
                case 403:
                    return 'Permission denied. You do not have access to perform this action.';
                case 404:
                    return 'Resource not found. Please refresh the page and try again.';
                case 413:
                    return 'File too large. Please upload a smaller file.';
                case 500:
                    return 'Server error. Please try again later.';
                case 502:
                case 503:
                case 504:
                    return 'Server temporarily unavailable. Please try again in a few moments.';
                default:
                    return errorThrown || 'An error occurred. Please try again.';
            }
        },

        /**
         * Get error code from HTTP status
         * Task 44: Categorize errors for logging (Requirement 7.5)
         * 
         * @param {number} status - HTTP status code
         * @returns {string} Error code
         */
        getErrorCode: function(status) {
            if (status === 0) return 'NETWORK_ERROR';
            if (status >= 400 && status < 500) return 'CLIENT_ERROR';
            if (status >= 500) return 'SERVER_ERROR';
            return 'UNKNOWN_ERROR';
        },

        /**
         * Format file size for display
         * 
         * @param {number} bytes - File size in bytes
         * @returns {string} Formatted file size
         */
        formatFileSize: function(bytes) {
            if (bytes === 0) return '0 Bytes';
            
            var k = 1024;
            var sizes = ['Bytes', 'KB', 'MB', 'GB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        },

        /**
         * Show user notification
         * Task 44: Show user-friendly error messages (Requirement 7.5)
         * 
         * @param {string} message - Message to display
         * @param {string} type - Message type (success, error, warning, info)
         */
        showNotice: function(message, type) {
            type = type || 'info';

            // Use MASE.showNotice if available
            if (typeof MASE.showNotice === 'function') {
                MASE.showNotice(message, type);
                return;
            }

            // Fallback to console
            console.log('MASE Notice [' + type + ']: ' + message);

            // Try to show WordPress admin notice
            var noticeClass = 'notice notice-' + type;
            if (type === 'error') {
                noticeClass = 'notice notice-error';
            }

            var $notice = $('<div class="' + noticeClass + ' is-dismissible"><p>' + message + '</p></div>');
            $('.wrap h1').after($notice);

            // Auto-dismiss after 5 seconds
            setTimeout(function() {
                $notice.fadeOut(function() {
                    $(this).remove();
                });
            }, 5000);
        },

        /**
         * Log error for debugging
         * Task 44: Log errors for debugging (Requirement 7.5)
         * 
         * @param {string} context - Error context
         * @param {Object} error - Error object
         * @param {Object} metadata - Additional metadata
         */
        logError: function(context, error, metadata) {
            var errorLog = {
                timestamp: new Date().toISOString(),
                context: context,
                error: {
                    message: error.message || error,
                    code: error.code || 'UNKNOWN',
                    stack: error.stack || null
                },
                metadata: metadata || {},
                userAgent: navigator.userAgent,
                url: window.location.href
            };

            console.error('MASE Error Log:', errorLog);

            // Send to server if debug mode is enabled
            if (maseAdmin && maseAdmin.debug) {
                $.ajax({
                    url: maseAdmin.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'mase_log_client_error',
                        nonce: maseAdmin.nonce,
                        error_log: JSON.stringify(errorLog)
                    },
                    // Don't retry error logging
                    error: function() {
                        console.warn('MASE: Failed to send error log to server');
                    }
                });
            }
        }
    };

    // Initialize on document ready
    $(document).ready(function() {
        MASE.errorRecovery.init();
    });

})(jQuery);
