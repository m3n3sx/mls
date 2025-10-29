/**
 * API Client Module
 *
 * Unified WordPress REST API communication with automatic nonce handling,
 * retry logic, and request queuing.
 *
 * @module api-client
 */

/**
 * APIClient class for WordPress REST API communication
 *
 * Features:
 * - Automatic nonce handling and refresh
 * - Request queuing to prevent concurrent modifications
 * - Exponential backoff retry logic
 * - Response validation and error handling
 *
 * Requirements: 8.1, 8.2, 8.3, 8.5
 */
export class APIClient {
  /**
   * Create an API Client instance
   * @param {Object} config - Configuration object
   * @param {string} config.baseURL - Base URL for REST API
   * @param {string} config.nonce - WordPress nonce for authentication
   * @param {number} [config.timeout=30000] - Request timeout in milliseconds
   * @param {number} [config.retries=3] - Number of retry attempts
   * @param {number} [config.retryDelay=1000] - Initial retry delay in milliseconds
   */
  constructor(config = {}) {
    // Validate required configuration
    if (!config.baseURL) {
      throw new Error('APIClient: baseURL is required');
    }
    if (!config.nonce) {
      throw new Error('APIClient: nonce is required');
    }

    // Configuration
    this.config = {
      baseURL: config.baseURL,
      nonce: config.nonce,
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      debug: config.debug || false,
    };

    // Request queue for preventing concurrent modifications
    this.requestQueue = [];
    this.isProcessingQueue = false;

    // Request/response interceptors
    this.requestInterceptors = [];
    this.responseInterceptors = [];

    // Nonce management
    this.onNonceRefresh = null;
    this.isRefreshingNonce = false;
    this.nonceRefreshPromise = null;
  }

  /**
   * Add a request interceptor
   * @param {Function} interceptor - Function to modify request before sending
   * @returns {Function} Function to remove the interceptor
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.requestInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Add a response interceptor
   * @param {Function} interceptor - Function to modify response after receiving
   * @returns {Function} Function to remove the interceptor
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.responseInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Set callback for nonce refresh
   * @param {Function} callback - Function to call when nonce needs refresh
   */
  setNonceRefreshCallback(callback) {
    this.onNonceRefresh = callback;
  }

  /**
   * Update the nonce
   * @param {string} newNonce - New nonce value
   */
  updateNonce(newNonce) {
    this.config.nonce = newNonce;
  }

  /**
   * Make an HTTP request with retry logic
   * @private
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @param {number} [attemptNumber=0] - Current attempt number (for retry logic)
   * @returns {Promise<any>} Response data
   */
  async _request(endpoint, options = {}, attemptNumber = 0) {
    const url = `${this.config.baseURL}${endpoint}`;

    // Build request configuration
    let requestConfig = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': this.config.nonce,
        ...options.headers,
      },
      ...options,
    };

    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      requestConfig = await interceptor(requestConfig);
    }

    // Add body if present
    if (options.body && requestConfig.method !== 'GET') {
      requestConfig.body = JSON.stringify(options.body);
    }

    // Make request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle nonce verification failure
      if (response.status === 403) {
        const data = await response.json().catch(() => ({}));
        if (data.code === 'rest_cookie_invalid_nonce') {
          // Attempt to refresh nonce
          const refreshed = await this._refreshNonce();
          if (refreshed) {
            // Retry the request with new nonce (don't increment attempt counter)
            return this._request(endpoint, options, attemptNumber);
          }
          throw new Error('Nonce verification failed. Please refresh the page.');
        }
      }

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        );
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // Parse response
      let responseData = await response.json();

      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        responseData = await interceptor(responseData);
      }

      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);

      // Determine if error is retryable
      const isRetryable = this._isRetryableError(error);
      const canRetry = attemptNumber < this.config.retries && isRetryable;

      if (canRetry) {
        // Calculate exponential backoff delay
        const delay = this.config.retryDelay * Math.pow(2, attemptNumber);

        // Log retry attempt in development mode
        if (this.config.debug) {
          console.log(
            `APIClient: Retrying request (attempt ${attemptNumber + 1}/${this.config.retries}) after ${delay}ms`,
            { endpoint, error: error.message },
          );
        }

        // Wait before retrying
        await this._sleep(delay);

        // Retry the request
        return this._request(endpoint, options, attemptNumber + 1);
      }

      // Convert error to user-friendly message
      throw this._createUserFriendlyError(error);
    }
  }

  /**
   * Determine if an error is retryable
   * @private
   * @param {Error} error - Error object
   * @returns {boolean} True if error is retryable
   */
  _isRetryableError(error) {
    // Timeout errors are retryable
    if (error.name === 'AbortError') {
      return true;
    }

    // Network errors are retryable
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return true;
    }

    // 5xx server errors are retryable
    if (error.status >= 500 && error.status < 600) {
      return true;
    }

    // 429 Too Many Requests is retryable
    if (error.status === 429) {
      return true;
    }

    // Other errors are not retryable
    return false;
  }

  /**
   * Create user-friendly error message
   * @private
   * @param {Error} error - Original error
   * @returns {Error} Error with user-friendly message
   */
  _createUserFriendlyError(error) {
    // Handle timeout
    if (error.name === 'AbortError') {
      return new Error('Request timeout. Please check your connection and try again.');
    }

    // Handle network errors
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return new Error('Network error. Please check your internet connection and try again.');
    }

    // Handle server errors
    if (error.status >= 500) {
      return new Error('Server error. Please try again later.');
    }

    // Handle rate limiting
    if (error.status === 429) {
      return new Error('Too many requests. Please wait a moment and try again.');
    }

    // Handle authentication errors
    if (error.status === 401 || error.status === 403) {
      return new Error('Authentication failed. Please refresh the page and try again.');
    }

    // Return original error for other cases
    return error;
  }

  /**
   * Sleep for specified milliseconds
   * @private
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current settings from server
   * @returns {Promise<Object>} Settings object
   */
  async getSettings() {
    try {
      const response = await this._request('/settings', {
        method: 'GET',
      });

      // Validate response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid settings response format');
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to load settings: ${error.message}`);
    }
  }

  /**
   * Save settings to server (queued to prevent concurrent modifications)
   * @param {Object} settings - Settings object to save
   * @returns {Promise<Object>} Save response with updated settings
   */
  async saveSettings(settings) {
    // Validate settings object
    if (!settings || typeof settings !== 'object') {
      throw new Error('Invalid settings: must be an object');
    }

    // Queue the request to prevent concurrent modifications
    return this._queueRequest(async () => {
      try {
        const response = await this._request('/settings', {
          method: 'POST',
          body: settings,
        });

        // Validate response
        if (!response || !response.success) {
          throw new Error(response?.message || 'Save operation failed');
        }

        return response;
      } catch (error) {
        throw new Error(`Failed to save settings: ${error.message}`);
      }
    }, 'saveSettings');
  }

  /**
   * Reset settings to defaults
   * @returns {Promise<Object>} Default settings object
   */
  async resetSettings() {
    try {
      const response = await this._request('/settings/reset', {
        method: 'POST',
      });

      // Validate response
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid reset response format');
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to reset settings: ${error.message}`);
    }
  }

  /**
   * Get available templates
   * @returns {Promise<Array>} Array of template objects
   */
  async getTemplates() {
    try {
      const response = await this._request('/templates', {
        method: 'GET',
      });

      // Validate response is an array
      if (!Array.isArray(response)) {
        throw new Error('Invalid templates response: expected array');
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to load templates: ${error.message}`);
    }
  }

  /**
   * Apply a template (queued to prevent concurrent modifications)
   * @param {string} templateId - Template ID to apply
   * @returns {Promise<Object>} Updated settings after template application
   */
  async applyTemplate(templateId) {
    // Validate template ID
    if (!templateId || typeof templateId !== 'string') {
      throw new Error('Invalid template ID: must be a non-empty string');
    }

    // Queue the request to prevent concurrent modifications
    return this._queueRequest(async () => {
      try {
        const response = await this._request(`/templates/${templateId}/apply`, {
          method: 'POST',
        });

        // Validate response
        if (!response || !response.success) {
          throw new Error(response?.message || 'Template application failed');
        }

        return response.settings || response;
      } catch (error) {
        throw new Error(`Failed to apply template: ${error.message}`);
      }
    }, `applyTemplate:${templateId}`);
  }

  /**
   * Get available color palettes
   * @returns {Promise<Array>} Array of palette objects
   */
  async getPalettes() {
    try {
      const response = await this._request('/palettes', {
        method: 'GET',
      });

      // Validate response is an array
      if (!Array.isArray(response)) {
        throw new Error('Invalid palettes response: expected array');
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to load palettes: ${error.message}`);
    }
  }

  /**
   * Apply a color palette (queued to prevent concurrent modifications)
   * @param {string} paletteId - Palette ID to apply
   * @returns {Promise<Object>} Updated color settings after palette application
   */
  async applyPalette(paletteId) {
    // Validate palette ID
    if (!paletteId || typeof paletteId !== 'string') {
      throw new Error('Invalid palette ID: must be a non-empty string');
    }

    // Queue the request to prevent concurrent modifications
    return this._queueRequest(async () => {
      try {
        const response = await this._request(`/palettes/${paletteId}/apply`, {
          method: 'POST',
        });

        // Validate response
        if (!response || !response.success) {
          throw new Error(response?.message || 'Palette application failed');
        }

        return response.colors || response;
      } catch (error) {
        throw new Error(`Failed to apply palette: ${error.message}`);
      }
    }, `applyPalette:${paletteId}`);
  }

  /**
   * Queue a request to prevent concurrent modifications
   * @private
   * @param {Function} requestFn - Function that returns a promise for the request
   * @param {string} [requestId] - Optional request ID for deduplication
   * @returns {Promise<any>} Request result
   */
  async _queueRequest(requestFn, requestId = null) {
    // Check for duplicate request (deduplication)
    if (requestId) {
      const existingRequest = this.requestQueue.find((item) => item.id === requestId);
      if (existingRequest) {
        // Return the existing promise instead of creating a new request
        return existingRequest.promise;
      }
    }

    // Create promise for this request
    const promise = new Promise((resolve, reject) => {
      this.requestQueue.push({
        id: requestId,
        fn: requestFn,
        resolve,
        reject,
        promise: null, // Will be set after creation
      });
    });

    // Store promise reference for deduplication
    if (requestId) {
      const queueItem = this.requestQueue[this.requestQueue.length - 1];
      queueItem.promise = promise;
    }

    // Start processing queue if not already processing
    if (!this.isProcessingQueue) {
      this._processQueue();
    }

    return promise;
  }

  /**
   * Process the request queue sequentially
   * @private
   */
  async _processQueue() {
    if (this.isProcessingQueue) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const item = this.requestQueue.shift();

      try {
        const result = await item.fn();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Clear the request queue (useful for cleanup or cancellation)
   */
  clearQueue() {
    // Reject all pending requests
    this.requestQueue.forEach((item) => {
      item.reject(new Error('Request cancelled: queue cleared'));
    });

    // Clear the queue
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Get the current queue length
   * @returns {number} Number of pending requests
   */
  getQueueLength() {
    return this.requestQueue.length;
  }

  /**
   * Refresh the nonce
   * @private
   * @returns {Promise<boolean>} True if nonce was refreshed successfully
   */
  async _refreshNonce() {
    // If already refreshing, wait for that to complete
    if (this.isRefreshingNonce && this.nonceRefreshPromise) {
      return this.nonceRefreshPromise;
    }

    // If no refresh callback is set, cannot refresh
    if (!this.onNonceRefresh) {
      return false;
    }

    // Start nonce refresh
    this.isRefreshingNonce = true;
    this.nonceRefreshPromise = (async () => {
      try {
        const newNonce = await this.onNonceRefresh();
        if (newNonce && typeof newNonce === 'string') {
          this.updateNonce(newNonce);

          if (this.config.debug) {
            console.log('APIClient: Nonce refreshed successfully');
          }

          return true;
        }
        return false;
      } catch (error) {
        if (this.config.debug) {
          console.error('APIClient: Nonce refresh failed', error);
        }
        return false;
      } finally {
        this.isRefreshingNonce = false;
        this.nonceRefreshPromise = null;
      }
    })();

    return this.nonceRefreshPromise;
  }

  /**
   * Get the current nonce value
   * @returns {string} Current nonce
   */
  getNonce() {
    return this.config.nonce;
  }

  /**
   * Validate nonce format
   * @param {string} nonce - Nonce to validate
   * @returns {boolean} True if nonce is valid format
   */
  static isValidNonce(nonce) {
    // WordPress nonces are typically 10 characters
    return typeof nonce === 'string' && nonce.length >= 10;
  }

  // ============================================================================
  // AI Service Methods
  // ============================================================================

  /**
   * Get AI color palette suggestions
   * @param {Object} context - Context for AI suggestions
   * @param {string[]} [context.brandColors] - Existing brand colors
   * @param {string} [context.industry] - Industry/category
   * @param {string} [context.mood] - Desired mood/tone
   * @param {string} [context.accessibility='AA'] - WCAG level
   * @param {number} [count=3] - Number of suggestions to generate
   * @returns {Promise<Object>} AI suggestions response
   */
  async getAIColorSuggestions(context = {}, count = 3) {
    try {
      const response = await this._request('/ai/colors/suggest', {
        method: 'POST',
        body: {
          context: {
            brandColors: context.brandColors || [],
            industry: context.industry || 'general',
            mood: context.mood || 'professional',
            accessibility: context.accessibility || 'AA',
          },
          count,
        },
      });

      // Validate response structure
      if (!response || !response.success || !Array.isArray(response.suggestions)) {
        throw new Error('Invalid AI color suggestions response format');
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to get AI color suggestions: ${error.message}`);
    }
  }

  /**
   * Get AI typography pairing suggestions
   * @param {Object} context - Context for AI suggestions
   * @param {string} [context.currentFont] - Current font family
   * @param {string} [context.style] - Design style
   * @param {string} [context.readability] - Readability priority
   * @param {string} [context.purpose] - Purpose/use case
   * @param {number} [count=3] - Number of suggestions to generate
   * @returns {Promise<Object>} AI suggestions response
   */
  async getAITypographySuggestions(context = {}, count = 3) {
    try {
      const response = await this._request('/ai/typography/suggest', {
        method: 'POST',
        body: {
          context: {
            currentFont: context.currentFont || null,
            style: context.style || 'modern',
            readability: context.readability || 'high',
            purpose: context.purpose || 'admin-interface',
          },
          count,
        },
      });

      // Validate response structure
      if (!response || !response.success || !Array.isArray(response.suggestions)) {
        throw new Error('Invalid AI typography suggestions response format');
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to get AI typography suggestions: ${error.message}`);
    }
  }

  /**
   * Analyze settings for accessibility improvements
   * @param {Object} settings - Current settings to analyze
   * @returns {Promise<Object>} Accessibility analysis with suggestions
   */
  async analyzeAccessibility(settings) {
    // Validate settings object
    if (!settings || typeof settings !== 'object') {
      throw new Error('Invalid settings: must be an object');
    }

    try {
      const response = await this._request('/ai/accessibility/analyze', {
        method: 'POST',
        body: { settings },
      });

      // Validate response structure
      if (!response || !response.success || !response.analysis) {
        throw new Error('Invalid accessibility analysis response format');
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to analyze accessibility: ${error.message}`);
    }
  }

  /**
   * Get predictive setting recommendations
   * @param {Object} context - Context for predictions
   * @param {string} [context.userRole] - User role
   * @param {string} [context.siteType] - Site type/category
   * @param {Object} [context.previousSettings] - Previous settings
   * @param {Object} [context.usagePatterns] - Usage patterns
   * @returns {Promise<Object>} Predictive recommendations
   */
  async getPredictiveSettings(context = {}) {
    try {
      const response = await this._request('/ai/settings/predict', {
        method: 'POST',
        body: {
          context: {
            userRole: context.userRole || 'administrator',
            siteType: context.siteType || 'general',
            previousSettings: context.previousSettings || {},
            usagePatterns: context.usagePatterns || {},
          },
        },
      });

      // Validate response structure
      if (!response || !response.success || !Array.isArray(response.predictions)) {
        throw new Error('Invalid predictive settings response format');
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to get predictive settings: ${error.message}`);
    }
  }

  /**
   * Apply an AI suggestion
   * @param {string} suggestionId - ID of the suggestion to apply
   * @param {string} suggestionType - Type of suggestion (color-palette, typography, etc.)
   * @returns {Promise<Object>} Updated settings after applying suggestion
   */
  async applyAISuggestion(suggestionId, suggestionType) {
    // Validate parameters
    if (!suggestionId || typeof suggestionId !== 'string') {
      throw new Error('Invalid suggestion ID: must be a non-empty string');
    }
    if (!suggestionType || typeof suggestionType !== 'string') {
      throw new Error('Invalid suggestion type: must be a non-empty string');
    }

    // Queue the request to prevent concurrent modifications
    return this._queueRequest(async () => {
      try {
        const response = await this._request(`/ai/suggestions/${suggestionId}/apply`, {
          method: 'POST',
          body: { type: suggestionType },
        });

        // Validate response
        if (!response || !response.success) {
          throw new Error(response?.message || 'AI suggestion application failed');
        }

        return response;
      } catch (error) {
        throw new Error(`Failed to apply AI suggestion: ${error.message}`);
      }
    }, `applyAISuggestion:${suggestionId}`);
  }

  /**
   * Reject an AI suggestion (provide feedback)
   * @param {string} suggestionId - ID of the suggestion to reject
   * @param {string} [reason] - Optional reason for rejection
   * @returns {Promise<Object>} Rejection confirmation
   */
  async rejectAISuggestion(suggestionId, reason = null) {
    // Validate suggestion ID
    if (!suggestionId || typeof suggestionId !== 'string') {
      throw new Error('Invalid suggestion ID: must be a non-empty string');
    }

    try {
      const response = await this._request(`/ai/suggestions/${suggestionId}/reject`, {
        method: 'POST',
        body: { reason },
      });

      // Validate response
      if (!response || !response.success) {
        throw new Error(response?.message || 'AI suggestion rejection failed');
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to reject AI suggestion: ${error.message}`);
    }
  }

  /**
   * Get AI suggestion history
   * @param {Object} [options] - Query options
   * @param {number} [options.limit=20] - Maximum number of results
   * @param {string} [options.type] - Filter by suggestion type
   * @param {string} [options.status] - Filter by status
   * @returns {Promise<Array>} Array of historical suggestions
   */
  async getAISuggestionHistory(options = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (options.limit) {
        queryParams.append('limit', options.limit);
      }
      if (options.type) {
        queryParams.append('type', options.type);
      }
      if (options.status) {
        queryParams.append('status', options.status);
      }

      const endpoint = `/ai/suggestions/history${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await this._request(endpoint, {
        method: 'GET',
      });

      // Validate response is an array
      if (!Array.isArray(response)) {
        throw new Error('Invalid AI suggestion history response: expected array');
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to load AI suggestion history: ${error.message}`);
    }
  }

  /**
   * Update AI settings/preferences
   * @param {Object} settings - AI settings to update
   * @param {boolean} [settings.enabled] - Enable/disable AI features
   * @param {number} [settings.confidenceThreshold] - Minimum confidence (0-1)
   * @param {boolean} [settings.autoApply] - Auto-apply high-confidence suggestions
   * @param {string[]} [settings.categories] - Enabled suggestion categories
   * @returns {Promise<Object>} Updated AI settings
   */
  async updateAISettings(settings) {
    // Validate settings object
    if (!settings || typeof settings !== 'object') {
      throw new Error('Invalid AI settings: must be an object');
    }

    try {
      const response = await this._request('/ai/settings', {
        method: 'POST',
        body: settings,
      });

      // Validate response
      if (!response || !response.success) {
        throw new Error(response?.message || 'AI settings update failed');
      }

      return response.settings || response;
    } catch (error) {
      throw new Error(`Failed to update AI settings: ${error.message}`);
    }
  }

  /**
   * Get current AI settings/preferences
   * @returns {Promise<Object>} Current AI settings
   */
  async getAISettings() {
    try {
      const response = await this._request('/ai/settings', {
        method: 'GET',
      });

      // Validate response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid AI settings response format');
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to load AI settings: ${error.message}`);
    }
  }

  // ============================================================================
  // WebSocket Methods (Real-time Collaboration)
  // Requirements: 14.2
  // ============================================================================

  /**
   * Connect to WebSocket for real-time updates
   * @param {Object} [options] - WebSocket connection options
   * @param {number} [options.reconnectDelay=1000] - Initial reconnect delay in ms
   * @param {number} [options.maxReconnectDelay=30000] - Maximum reconnect delay in ms
   * @param {number} [options.reconnectAttempts=Infinity] - Maximum reconnect attempts
   * @param {number} [options.heartbeatInterval=30000] - Heartbeat interval in ms
   * @returns {Promise<WebSocket>} Connected WebSocket instance
   */
  async connectWebSocket(options = {}) {
    // WebSocket configuration
    const wsConfig = {
      reconnectDelay: options.reconnectDelay || 1000,
      maxReconnectDelay: options.maxReconnectDelay || 30000,
      reconnectAttempts: options.reconnectAttempts || Infinity,
      heartbeatInterval: options.heartbeatInterval || 30000,
    };

    // Initialize WebSocket state if not exists
    if (!this.ws) {
      this.ws = {
        connection: null,
        isConnecting: false,
        isConnected: false,
        reconnectAttempt: 0,
        reconnectTimer: null,
        heartbeatTimer: null,
        messageHandlers: new Map(),
        presenceHandlers: new Set(),
        config: wsConfig,
      };
    }

    // If already connected, return existing connection
    if (this.ws.isConnected && this.ws.connection) {
      return this.ws.connection;
    }

    // If currently connecting, wait for that to complete
    if (this.ws.isConnecting && this.ws.connectPromise) {
      return this.ws.connectPromise;
    }

    // Start new connection
    this.ws.isConnecting = true;
    this.ws.connectPromise = this._createWebSocketConnection();

    try {
      const connection = await this.ws.connectPromise;
      return connection;
    } finally {
      this.ws.isConnecting = false;
      this.ws.connectPromise = null;
    }
  }

  /**
   * Create WebSocket connection
   * @private
   * @returns {Promise<WebSocket>} Connected WebSocket instance
   */
  _createWebSocketConnection() {
    return new Promise((resolve, reject) => {
      try {
        // Build WebSocket URL from REST API base URL
        const wsUrl = this._buildWebSocketUrl();

        // Create WebSocket connection
        const connection = new WebSocket(wsUrl);

        // Connection opened
        connection.addEventListener('open', () => {
          if (this.config.debug) {
            console.log('APIClient: WebSocket connected');
          }

          this.ws.isConnected = true;
          this.ws.reconnectAttempt = 0;
          this.ws.connection = connection;

          // Authenticate connection
          this._authenticateWebSocket(connection);

          // Start heartbeat
          this._startHeartbeat();

          resolve(connection);
        });

        // Connection closed
        connection.addEventListener('close', (event) => {
          if (this.config.debug) {
            console.log('APIClient: WebSocket closed', event.code, event.reason);
          }

          this.ws.isConnected = false;
          this._stopHeartbeat();

          // Attempt reconnection if not a clean close
          if (event.code !== 1000 && event.code !== 1001) {
            this._scheduleReconnect();
          }
        });

        // Connection error
        connection.addEventListener('error', (error) => {
          if (this.config.debug) {
            console.error('APIClient: WebSocket error', error);
          }

          // If this is during initial connection, reject the promise
          if (this.ws.isConnecting) {
            reject(new Error('WebSocket connection failed'));
          }
        });

        // Message received
        connection.addEventListener('message', (event) => {
          this._handleWebSocketMessage(event.data);
        });

        // Set connection timeout
        const timeout = setTimeout(() => {
          if (!this.ws.isConnected) {
            connection.close();
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000);

        // Clear timeout on connection
        connection.addEventListener('open', () => clearTimeout(timeout));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Build WebSocket URL from REST API base URL
   * @private
   * @returns {string} WebSocket URL
   */
  _buildWebSocketUrl() {
    // Convert HTTP(S) URL to WS(S) URL
    const url = new URL(this.config.baseURL, window.location.origin);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';

    // Add WebSocket path
    url.pathname = url.pathname.replace(/\/wp-json\/mase\/v1\/?$/, '/mase-ws');

    // Add authentication token
    url.searchParams.set('nonce', this.config.nonce);

    return url.toString();
  }

  /**
   * Authenticate WebSocket connection
   * @private
   * @param {WebSocket} connection - WebSocket connection
   */
  _authenticateWebSocket(connection) {
    // Send authentication message
    this._sendWebSocketMessage(connection, {
      type: 'auth',
      nonce: this.config.nonce,
      timestamp: Date.now(),
    });
  }

  /**
   * Start heartbeat to keep connection alive
   * @private
   */
  _startHeartbeat() {
    // Clear existing heartbeat
    this._stopHeartbeat();

    // Send heartbeat at regular intervals
    this.ws.heartbeatTimer = setInterval(() => {
      if (this.ws.isConnected && this.ws.connection) {
        this._sendWebSocketMessage(this.ws.connection, {
          type: 'ping',
          timestamp: Date.now(),
        });
      }
    }, this.ws.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   * @private
   */
  _stopHeartbeat() {
    if (this.ws.heartbeatTimer) {
      clearInterval(this.ws.heartbeatTimer);
      this.ws.heartbeatTimer = null;
    }
  }

  /**
   * Schedule reconnection attempt
   * @private
   */
  _scheduleReconnect() {
    // Check if we've exceeded max attempts
    if (this.ws.reconnectAttempt >= this.ws.config.reconnectAttempts) {
      if (this.config.debug) {
        console.log('APIClient: Max reconnection attempts reached');
      }
      return;
    }

    // Clear existing reconnect timer
    if (this.ws.reconnectTimer) {
      clearTimeout(this.ws.reconnectTimer);
    }

    // Calculate exponential backoff delay
    const delay = Math.min(
      this.ws.config.reconnectDelay * Math.pow(2, this.ws.reconnectAttempt),
      this.ws.config.maxReconnectDelay,
    );

    if (this.config.debug) {
      console.log(
        `APIClient: Reconnecting in ${delay}ms (attempt ${this.ws.reconnectAttempt + 1})`,
      );
    }

    // Schedule reconnection
    this.ws.reconnectTimer = setTimeout(() => {
      this.ws.reconnectAttempt++;
      this.connectWebSocket().catch((error) => {
        if (this.config.debug) {
          console.error('APIClient: Reconnection failed', error);
        }
      });
    }, delay);
  }

  /**
   * Send message through WebSocket
   * @private
   * @param {WebSocket} connection - WebSocket connection
   * @param {Object} message - Message object to send
   */
  _sendWebSocketMessage(connection, message) {
    if (connection.readyState === WebSocket.OPEN) {
      connection.send(JSON.stringify(message));
    }
  }

  /**
   * Handle incoming WebSocket message
   * @private
   * @param {string} data - Message data
   */
  _handleWebSocketMessage(data) {
    try {
      const message = JSON.parse(data);

      // Handle pong response
      if (message.type === 'pong') {
        // Heartbeat acknowledged
        return;
      }

      // Handle presence updates
      if (message.type === 'presence') {
        this._notifyPresenceHandlers(message.data);
        return;
      }

      // Handle state changes
      if (message.type === 'state-change') {
        this._notifyMessageHandlers('state-change', message.data);
        return;
      }

      // Handle generic messages
      if (message.type && this.ws.messageHandlers.has(message.type)) {
        this._notifyMessageHandlers(message.type, message.data);
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('APIClient: Failed to parse WebSocket message', error);
      }
    }
  }

  /**
   * Notify message handlers
   * @private
   * @param {string} type - Message type
   * @param {any} data - Message data
   */
  _notifyMessageHandlers(type, data) {
    const handlers = this.ws.messageHandlers.get(type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          if (this.config.debug) {
            console.error('APIClient: Message handler error', error);
          }
        }
      });
    }
  }

  /**
   * Notify presence handlers
   * @private
   * @param {Object} presenceData - Presence data
   */
  _notifyPresenceHandlers(presenceData) {
    this.ws.presenceHandlers.forEach((handler) => {
      try {
        handler(presenceData);
      } catch (error) {
        if (this.config.debug) {
          console.error('APIClient: Presence handler error', error);
        }
      }
    });
  }

  /**
   * Subscribe to WebSocket messages of a specific type
   * @param {string} messageType - Type of message to subscribe to
   * @param {Function} handler - Handler function to call when message received
   * @returns {Function} Unsubscribe function
   */
  subscribeToMessages(messageType, handler) {
    if (!this.ws) {
      throw new Error('WebSocket not initialized. Call connectWebSocket() first.');
    }

    // Initialize handlers set for this message type
    if (!this.ws.messageHandlers.has(messageType)) {
      this.ws.messageHandlers.set(messageType, new Set());
    }

    // Add handler
    const handlers = this.ws.messageHandlers.get(messageType);
    handlers.add(handler);

    // Return unsubscribe function
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.ws.messageHandlers.delete(messageType);
      }
    };
  }

  /**
   * Subscribe to presence updates (user join/leave/activity)
   * @param {Function} handler - Handler function to call on presence updates
   * @returns {Function} Unsubscribe function
   */
  subscribeToPresence(handler) {
    if (!this.ws) {
      throw new Error('WebSocket not initialized. Call connectWebSocket() first.');
    }

    this.ws.presenceHandlers.add(handler);

    // Return unsubscribe function
    return () => {
      this.ws.presenceHandlers.delete(handler);
    };
  }

  /**
   * Broadcast state change to other connected clients
   * @param {Object} change - State change object
   * @param {string} change.path - Path to changed property
   * @param {any} change.value - New value
   * @param {any} [change.oldValue] - Previous value
   * @param {string} [change.operation] - Operation type (set, delete, etc.)
   * @returns {Promise<void>}
   */
  async broadcastStateChange(change) {
    if (!this.ws || !this.ws.isConnected || !this.ws.connection) {
      throw new Error('WebSocket not connected');
    }

    // Validate change object
    if (!change || typeof change !== 'object' || !change.path) {
      throw new Error('Invalid change object: must include path property');
    }

    // Send state change message
    this._sendWebSocketMessage(this.ws.connection, {
      type: 'state-change',
      data: {
        path: change.path,
        value: change.value,
        oldValue: change.oldValue,
        operation: change.operation || 'set',
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Update presence status
   * @param {Object} status - Presence status
   * @param {string} [status.activity] - Current activity
   * @param {string} [status.location] - Current location/page
   * @param {Object} [status.metadata] - Additional metadata
   * @returns {Promise<void>}
   */
  async updatePresence(status) {
    if (!this.ws || !this.ws.isConnected || !this.ws.connection) {
      throw new Error('WebSocket not connected');
    }

    // Send presence update
    this._sendWebSocketMessage(this.ws.connection, {
      type: 'presence-update',
      data: {
        activity: status.activity || 'active',
        location: status.location || window.location.pathname,
        metadata: status.metadata || {},
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Disconnect WebSocket
   * @param {number} [code=1000] - Close code
   * @param {string} [reason='Client disconnect'] - Close reason
   */
  disconnectWebSocket(code = 1000, reason = 'Client disconnect') {
    if (!this.ws) {
      return;
    }

    // Clear timers
    this._stopHeartbeat();
    if (this.ws.reconnectTimer) {
      clearTimeout(this.ws.reconnectTimer);
      this.ws.reconnectTimer = null;
    }

    // Close connection
    if (this.ws.connection) {
      this.ws.connection.close(code, reason);
      this.ws.connection = null;
    }

    // Reset state
    this.ws.isConnected = false;
    this.ws.isConnecting = false;
    this.ws.reconnectAttempt = 0;

    if (this.config.debug) {
      console.log('APIClient: WebSocket disconnected');
    }
  }

  /**
   * Check if WebSocket is connected
   * @returns {boolean} True if connected
   */
  isWebSocketConnected() {
    return this.ws && this.ws.isConnected && this.ws.connection?.readyState === WebSocket.OPEN;
  }

  /**
   * Get WebSocket connection state
   * @returns {Object} Connection state
   */
  getWebSocketState() {
    if (!this.ws) {
      return {
        connected: false,
        connecting: false,
        reconnectAttempt: 0,
      };
    }

    return {
      connected: this.ws.isConnected,
      connecting: this.ws.isConnecting,
      reconnectAttempt: this.ws.reconnectAttempt,
      readyState: this.ws.connection?.readyState,
    };
  }
}

export default APIClient;
