/**
 * Event Bus Module
 *
 * Decoupled communication system between modules using pub/sub pattern.
 * Provides event namespacing, wildcard subscriptions, and error isolation.
 *
 * @module event-bus
 */

/**
 * EventBus class implementing publish-subscribe pattern
 *
 * Features:
 * - Event namespacing (e.g., 'settings:changed')
 * - Wildcard subscriptions (e.g., 'settings:*')
 * - Error isolation - handler failures don't affect other subscribers
 * - Development mode logging
 * - Performance optimized for <5ms delivery
 * - Event queuing for high-frequency events
 * - Debouncing helper for rapid events
 */
export class EventBus {
  constructor(options = {}) {
    this.listeners = new Map();
    this.onceListeners = new Map();
    this.isDevelopment = options.isDevelopment || process.env.NODE_ENV === 'development';
    this.eventQueue = [];
    this.isProcessingQueue = false;
    this.debounceTimers = new Map();
  }

  /**
   * Subscribe to an event
   *
   * @param {string} event - Event name (supports namespacing and wildcards)
   * @param {Function} handler - Event handler function
   * @returns {Function} Unsubscribe function
   */
  on(event, handler) {
    if (typeof event !== 'string' || !event) {
      throw new Error('Event name must be a non-empty string');
    }
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event).push(handler);

    if (this.isDevelopment) {
      console.log(`[EventBus] Subscribed to: ${event}`);
    }

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first emission)
   *
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   * @returns {Function} Unsubscribe function
   */
  once(event, handler) {
    if (typeof event !== 'string' || !event) {
      throw new Error('Event name must be a non-empty string');
    }
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }

    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, []);
    }

    this.onceListeners.get(event).push(handler);

    if (this.isDevelopment) {
      console.log(`[EventBus] Subscribed once to: ${event}`);
    }

    // Return unsubscribe function
    return () => {
      const handlers = this.onceListeners.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Unsubscribe from an event
   *
   * @param {string} event - Event name
   * @param {Function} [handler] - Specific handler to remove (if omitted, removes all)
   */
  off(event, handler) {
    if (handler) {
      // Remove specific handler
      const handlers = this.listeners.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
          if (this.isDevelopment) {
            console.log(`[EventBus] Unsubscribed from: ${event}`);
          }
        }
      }

      const onceHandlers = this.onceListeners.get(event);
      if (onceHandlers) {
        const index = onceHandlers.indexOf(handler);
        if (index > -1) {
          onceHandlers.splice(index, 1);
        }
      }
    } else {
      // Remove all handlers for event
      this.listeners.delete(event);
      this.onceListeners.delete(event);
      if (this.isDevelopment) {
        console.log(`[EventBus] Removed all listeners for: ${event}`);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   *
   * @param {string} event - Event name
   * @param {*} [data] - Event data
   */
  emit(event, data) {
    const startTime = performance.now();

    if (this.isDevelopment) {
      console.log(`[EventBus] Emitting: ${event}`, data);
    }

    // Get matching listeners (including wildcards)
    const matchingListeners = this._getMatchingListeners(event);
    const matchingOnceListeners = this._getMatchingOnceListeners(event);

    // Execute regular listeners with error isolation
    matchingListeners.forEach(({ event: listenerEvent, handler }) => {
      this._executeHandler(handler, data, event, listenerEvent);
    });

    // Execute once listeners with error isolation
    matchingOnceListeners.forEach(({ event: listenerEvent, handler }) => {
      this._executeHandler(handler, data, event, listenerEvent);
      // Remove once listener after execution
      const handlers = this.onceListeners.get(listenerEvent);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    });

    const duration = performance.now() - startTime;

    if (this.isDevelopment) {
      console.log(`[EventBus] Event ${event} delivered in ${duration.toFixed(2)}ms`);
    }

    // Warn if delivery exceeds 5ms requirement
    if (duration > 5) {
      console.warn(
        `[EventBus] Event ${event} delivery took ${duration.toFixed(2)}ms (exceeds 5ms target)`,
      );
    }
  }

  /**
   * Emit event with queuing for high-frequency events
   *
   * @param {string} event - Event name
   * @param {*} [data] - Event data
   */
  emitQueued(event, data) {
    this.eventQueue.push({ event, data, timestamp: Date.now() });

    if (!this.isProcessingQueue) {
      this._processQueue();
    }
  }

  /**
   * Emit event with debouncing for rapid events
   *
   * @param {string} event - Event name
   * @param {*} [data] - Event data
   * @param {number} [delay=100] - Debounce delay in milliseconds
   */
  emitDebounced(event, data, delay = 100) {
    // Clear existing timer for this event
    if (this.debounceTimers.has(event)) {
      clearTimeout(this.debounceTimers.get(event));
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.emit(event, data);
      this.debounceTimers.delete(event);
    }, delay);

    this.debounceTimers.set(event, timer);
  }

  /**
   * Clear all listeners
   */
  clear() {
    this.listeners.clear();
    this.onceListeners.clear();
    this.eventQueue = [];
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();

    if (this.isDevelopment) {
      console.log('[EventBus] Cleared all listeners');
    }
  }

  /**
   * Get all matching listeners for an event (including wildcards)
   *
   * @private
   * @param {string} event - Event name
   * @returns {Array} Array of {event, handler} objects
   */
  _getMatchingListeners(event) {
    const matches = [];

    // Exact match
    const exactHandlers = this.listeners.get(event);
    if (exactHandlers) {
      exactHandlers.forEach((handler) => {
        matches.push({ event, handler });
      });
    }

    // Wildcard matches
    const eventParts = event.split(':');
    this.listeners.forEach((handlers, listenerEvent) => {
      if (this._isWildcardMatch(listenerEvent, eventParts)) {
        handlers.forEach((handler) => {
          matches.push({ event: listenerEvent, handler });
        });
      }
    });

    return matches;
  }

  /**
   * Get all matching once listeners for an event (including wildcards)
   *
   * @private
   * @param {string} event - Event name
   * @returns {Array} Array of {event, handler} objects
   */
  _getMatchingOnceListeners(event) {
    const matches = [];

    // Exact match
    const exactHandlers = this.onceListeners.get(event);
    if (exactHandlers) {
      exactHandlers.forEach((handler) => {
        matches.push({ event, handler });
      });
    }

    // Wildcard matches
    const eventParts = event.split(':');
    this.onceListeners.forEach((handlers, listenerEvent) => {
      if (this._isWildcardMatch(listenerEvent, eventParts)) {
        handlers.forEach((handler) => {
          matches.push({ event: listenerEvent, handler });
        });
      }
    });

    return matches;
  }

  /**
   * Check if listener event pattern matches emitted event
   *
   * @private
   * @param {string} listenerEvent - Listener event pattern (may contain wildcards)
   * @param {Array} eventParts - Emitted event parts split by ':'
   * @returns {boolean} True if matches
   */
  _isWildcardMatch(listenerEvent, eventParts) {
    if (!listenerEvent.includes('*')) {
      return false; // No wildcard, already handled by exact match
    }

    const listenerParts = listenerEvent.split(':');

    // Check if patterns match
    for (let i = 0; i < listenerParts.length; i++) {
      if (listenerParts[i] === '*') {
        // Wildcard matches any single part
        if (i >= eventParts.length) {
          return false;
        }
      } else if (listenerParts[i] !== eventParts[i]) {
        return false;
      }
    }

    // If listener has fewer parts than event, it doesn't match
    // Unless last part is wildcard
    if (listenerParts.length < eventParts.length) {
      return listenerParts[listenerParts.length - 1] === '*';
    }

    return true;
  }

  /**
   * Execute handler with error isolation
   *
   * @private
   * @param {Function} handler - Event handler
   * @param {*} data - Event data
   * @param {string} event - Event name
   * @param {string} listenerEvent - Listener event pattern
   */
  _executeHandler(handler, data, event, listenerEvent) {
    try {
      handler(data, event);
    } catch (error) {
      // Error isolation - log but continue to other subscribers
      console.error(
        `[EventBus] Error in handler for ${listenerEvent} (triggered by ${event}):`,
        error,
      );

      // Emit error event for monitoring
      if (event !== EVENTS.ERROR_OCCURRED) {
        this.emit(EVENTS.ERROR_OCCURRED, {
          event,
          listenerEvent,
          error,
          handler: handler.name || 'anonymous',
        });
      }
    }
  }

  /**
   * Process queued events
   *
   * @private
   */
  _processQueue() {
    if (this.eventQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;

    // Process events in batches using requestAnimationFrame for optimal performance
    requestAnimationFrame(() => {
      const batchSize = 10;
      const batch = this.eventQueue.splice(0, batchSize);

      batch.forEach(({ event, data }) => {
        this.emit(event, data);
      });

      // Continue processing if more events in queue
      if (this.eventQueue.length > 0) {
        this._processQueue();
      } else {
        this.isProcessingQueue = false;
      }
    });
  }

  /**
   * Get listener count for an event
   *
   * @param {string} event - Event name
   * @returns {number} Number of listeners
   */
  getListenerCount(event) {
    const regularCount = this.listeners.get(event)?.length || 0;
    const onceCount = this.onceListeners.get(event)?.length || 0;
    return regularCount + onceCount;
  }

  /**
   * Get all registered events
   *
   * @returns {Array<string>} Array of event names
   */
  getEvents() {
    const events = new Set([...this.listeners.keys(), ...this.onceListeners.keys()]);
    return Array.from(events);
  }
}

/**
 * Predefined event types for MASE system
 */
export const EVENTS = {
  // Settings Events
  SETTINGS_CHANGED: 'settings:changed',
  SETTINGS_SAVE: 'settings:save',
  SETTINGS_SAVED: 'settings:saved',
  SETTINGS_SAVE_FAILED: 'settings:saveFailed',
  SETTINGS_RESET: 'settings:reset',
  SETTINGS_RESET_COMPLETE: 'settings:resetComplete',
  SETTINGS_EXPORT: 'settings:export',
  SETTINGS_IMPORT: 'settings:import',
  SETTINGS_IMPORTED: 'settings:imported',

  // Preview Events
  PREVIEW_TOGGLED: 'preview:toggled',
  PREVIEW_UPDATE: 'preview:update',
  PREVIEW_UPDATED: 'preview:updated',

  // Palette Events
  PALETTE_APPLY: 'palette:apply',
  PALETTE_APPLY_STARTED: 'palette:applyStarted',
  PALETTE_APPLIED: 'palette:applied',
  PALETTE_APPLY_FAILED: 'palette:applyFailed',
  PALETTE_SAVE: 'palette:save',
  PALETTE_SAVE_STARTED: 'palette:saveStarted',
  PALETTE_SAVED: 'palette:saved',
  PALETTE_SAVE_FAILED: 'palette:saveFailed',
  PALETTE_DELETE: 'palette:delete',
  PALETTE_DELETE_STARTED: 'palette:deleteStarted',
  PALETTE_DELETED: 'palette:deleted',
  PALETTE_DELETE_FAILED: 'palette:deleteFailed',

  // Template Events
  TEMPLATE_APPLY: 'template:apply',
  TEMPLATE_APPLY_STARTED: 'template:applyStarted',
  TEMPLATE_APPLIED: 'template:applied',
  TEMPLATE_APPLY_FAILED: 'template:applyFailed',
  TEMPLATE_SAVE: 'template:save',
  TEMPLATE_SAVE_STARTED: 'template:saveStarted',
  TEMPLATE_SAVED: 'template:saved',
  TEMPLATE_SAVE_FAILED: 'template:saveFailed',
  TEMPLATE_DELETE: 'template:delete',
  TEMPLATE_DELETE_STARTED: 'template:deleteStarted',
  TEMPLATE_DELETED: 'template:deleted',
  TEMPLATE_DELETE_FAILED: 'template:deleteFailed',

  // Dark Mode Events
  DARK_MODE_TOGGLED: 'darkMode:toggled',
  DARK_MODE_APPLIED: 'darkMode:applied',

  // Tab Events
  TAB_SWITCH: 'tab:switch',
  TAB_SWITCHED: 'tab:switched',

  // Backup Events
  BACKUP_CREATE: 'backup:create',
  BACKUP_CREATED: 'backup:created',
  BACKUP_RESTORE: 'backup:restore',
  BACKUP_RESTORED: 'backup:restored',

  // Keyboard Shortcut Events
  SHORTCUT_PALETTE: 'shortcut:palette',
  SHORTCUT_THEME: 'shortcut:theme',
  SHORTCUT_FOCUS: 'shortcut:focus',
  SHORTCUT_PERFORMANCE: 'shortcut:performance',

  // Error Events
  ERROR_OCCURRED: 'error:occurred',

  // MASE Admin Lifecycle Events
  MASE_READY: 'mase:ready',
  MASE_INITIALIZED: 'mase:initialized',
  MASE_DESTROY: 'mase:destroy',
  MODULE_LOADED: 'module:loaded', // Task 18.2: Lazy loading event

  // AI Events (Task 25.2)
  // Requirements: 14.1, 14.3
  AI_SUGGESTION_RECEIVED: 'ai:suggestion:received',
  AI_SUGGESTION_APPLIED: 'ai:suggestion:applied',
  AI_SUGGESTION_REJECTED: 'ai:suggestion:rejected',
  AI_SUGGESTION_LOADING: 'ai:suggestion:loading',
  AI_SUGGESTION_ERROR: 'ai:suggestion:error',
  AI_SETTINGS_CHANGED: 'ai:settings:changed',
  AI_ANALYSIS_COMPLETE: 'ai:analysis:complete',
  AI_PREDICTION_RECEIVED: 'ai:prediction:received',

  // Collaboration Events (Task 26)
  // Requirements: 14.2
  COLLABORATION_ENABLED: 'collaboration:enabled',
  COLLABORATION_DISABLED: 'collaboration:disabled',
  COLLABORATION_REMOTE_CHANGE: 'collaboration:remoteChange',
  COLLABORATION_PRESENCE_UPDATE: 'collaboration:presenceUpdate',
  COLLABORATION_USER_JOINED: 'collaboration:userJoined',
  COLLABORATION_USER_LEFT: 'collaboration:userLeft',
  COLLABORATION_CONFLICT: 'collaboration:conflict',
  COLLABORATION_SYNC_COMPLETE: 'collaboration:syncComplete',

  // Legacy compatibility (deprecated)
  COLOR_SELECTED: 'color:selected',
  SAVE_STARTED: 'save:started',
  SAVE_COMPLETED: 'save:completed',
};

// Create singleton instance
const eventBus = new EventBus({
  isDevelopment: process.env.NODE_ENV === 'development',
});

export default eventBus;
