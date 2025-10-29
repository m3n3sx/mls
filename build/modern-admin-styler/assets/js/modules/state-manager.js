/**
 * State Manager Module
 *
 * Centralized state management using Zustand with undo/redo capability.
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 *
 * Task 12.3: Emit events on state changes
 * Requirements: 4.2, 9.1
 *
 * @package Modern_Admin_Styler_Enterprise
 * @since 2.0.0
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import eventBus, { EVENTS } from './event-bus.js';
import apiClient from './api-client.js';

/**
 * Default state structure matching WordPress options
 * Based on MASE_Settings::get_defaults()
 */
const getDefaultState = () => ({
  settings: {
    admin_bar: {
      bg_color: '#23282d',
      text_color: '#ffffff',
      height: 32,
    },
    admin_menu: {
      bg_color: '#23282d',
      text_color: '#ffffff',
      hover_bg_color: '#191e23',
      hover_text_color: '#00b9eb',
      width: 160,
    },
    performance: {
      enable_minification: true,
      cache_duration: 3600,
    },
    palettes: {
      current: 'professional-blue',
      custom: [],
    },
    templates: {
      current: 'default',
      custom: [],
    },
    typography: {
      admin_bar: {
        font_size: 13,
        font_weight: 400,
        line_height: 1.5,
        letter_spacing: 0,
        text_transform: 'none',
        font_family: 'system',
      },
      admin_menu: {
        font_size: 13,
        font_weight: 400,
        line_height: 1.5,
        letter_spacing: 0,
        text_transform: 'none',
        font_family: 'system',
      },
      content: {
        font_size: 13,
        font_weight: 400,
        line_height: 1.6,
        letter_spacing: 0,
        text_transform: 'none',
        font_family: 'system',
      },
      google_fonts: 'Inter:300,400,500,600,700',
      enabled: true,
    },
    visual_effects: {
      admin_bar: {
        glassmorphism: false,
        blur_intensity: 20,
        floating: false,
        floating_margin: 8,
        border_radius: 0,
        shadow: 'none',
        shadow_intensity: 'none',
        shadow_direction: 'bottom',
        shadow_blur: 10,
        shadow_color: 'rgba(0, 0, 0, 0.15)',
      },
      admin_menu: {
        glassmorphism: false,
        blur_intensity: 20,
        floating: false,
        floating_margin: 8,
        border_radius: 0,
        shadow: 'none',
        shadow_intensity: 'none',
        shadow_direction: 'bottom',
        shadow_blur: 10,
        shadow_color: 'rgba(0, 0, 0, 0.15)',
      },
      buttons: {
        border_radius: 3,
        shadow_intensity: 'subtle',
        shadow_direction: 'bottom',
        shadow_blur: 8,
        shadow_color: 'rgba(0, 0, 0, 0.1)',
      },
      form_fields: {
        border_radius: 3,
        shadow_intensity: 'none',
        shadow_direction: 'bottom',
        shadow_blur: 5,
        shadow_color: 'rgba(0, 0, 0, 0.05)',
      },
      preset: 'flat',
      disable_mobile_shadows: false,
      auto_detect_low_power: true,
      animations_enabled: true,
      microanimations_enabled: true,
      particle_system: false,
      sound_effects: false,
      '3d_effects': false,
    },
    effects: {
      page_animations: true,
      animation_speed: 300,
      hover_effects: true,
      focus_mode: false,
      performance_mode: false,
    },
    advanced: {
      custom_css: '',
      custom_js: '',
      login_page_enabled: true,
      auto_palette_switch: false,
      auto_palette_times: {
        morning: 'professional-blue',
        afternoon: 'energetic-green',
        evening: 'sunset',
        night: 'dark-elegance',
      },
      backup_enabled: true,
      backup_before_changes: true,
    },
    mobile: {
      optimized: true,
      touch_friendly: true,
      compact_mode: false,
      reduced_effects: true,
    },
    accessibility: {
      high_contrast: false,
      reduced_motion: false,
      focus_indicators: true,
      keyboard_navigation: true,
    },
    keyboard_shortcuts: {
      enabled: true,
      palette_switch: true,
      theme_toggle: true,
      focus_mode: true,
      performance_mode: true,
    },
    spacing: {
      menu_padding: {
        top: 10,
        right: 15,
        bottom: 10,
        left: 15,
        unit: 'px',
      },
      menu_margin: {
        top: 2,
        right: 0,
        bottom: 2,
        left: 0,
        unit: 'px',
      },
      admin_bar_padding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 10,
        unit: 'px',
      },
      submenu_spacing: {
        padding_top: 8,
        padding_right: 12,
        padding_bottom: 8,
        padding_left: 12,
        margin_top: 0,
        offset_left: 0,
        unit: 'px',
      },
      content_margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
        unit: 'px',
      },
      mobile_overrides: {
        enabled: false,
        menu_padding: {
          top: 8,
          right: 12,
          bottom: 8,
          left: 12,
          unit: 'px',
        },
        admin_bar_padding: {
          top: 0,
          right: 8,
          bottom: 0,
          left: 8,
          unit: 'px',
        },
      },
      preset: 'default',
    },
  },
  ui: {
    activeTab: 'admin_bar',
    isDirty: false,
    isPreviewMode: false,
    isSaving: false,
    isLoading: false,
  },
  history: {
    past: [],
    future: [],
  },
  // AI state for AI-powered features
  // Requirements: 14.1, 14.3
  ai: {
    suggestions: {
      colors: [],
      typography: [],
      accessibility: [],
      settings: [],
    },
    loading: {
      colors: false,
      typography: false,
      accessibility: false,
      settings: false,
    },
    errors: {
      colors: null,
      typography: null,
      accessibility: null,
      settings: null,
    },
    settings: {
      enabled: false, // AI features disabled by default
      confidenceThreshold: 0.7, // Minimum confidence (0-1)
      autoApply: false, // Don't auto-apply suggestions
      categories: ['colors', 'typography', 'accessibility', 'settings'],
      dataSharing: false, // Require explicit opt-in for data sharing
    },
    history: [],
  },
});

/**
 * Settings cache for frequently accessed values
 * Task 19.2: Cache frequently accessed settings in memory
 * Requirement 12.1
 */
class SettingsCache {
  constructor() {
    this.cache = new Map();
    this.hitCount = new Map();
    this.maxSize = 100; // Maximum cache entries
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined
   */
  get(key) {
    if (this.cache.has(key)) {
      // Track cache hits
      this.hitCount.set(key, (this.hitCount.get(key) || 0) + 1);
      return this.cache.get(key);
    }
    return undefined;
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   */
  set(key, value) {
    // Evict least frequently used if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLFU();
    }

    this.cache.set(key, value);
    this.hitCount.set(key, 0);
  }

  /**
   * Invalidate cache entry
   * @param {string} key - Cache key to invalidate
   */
  invalidate(key) {
    this.cache.delete(key);
    this.hitCount.delete(key);
  }

  /**
   * Clear entire cache
   * Task 19.2: Implement cache invalidation on state changes
   */
  clear() {
    this.cache.clear();
    this.hitCount.clear();
  }

  /**
   * Evict least frequently used entry
   */
  evictLFU() {
    let minHits = Infinity;
    let leastUsedKey = null;

    for (const [key, hits] of this.hitCount.entries()) {
      if (hits < minHits) {
        minHits = hits;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.invalidate(leastUsedKey);
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.hitCount.entries()).map(([key, hits]) => ({
        key,
        hits,
      })),
    };
  }
}

// Create global settings cache instance
const settingsCache = new SettingsCache();

/**
 * Helper function to get nested value from object using path
 * @param {Object} obj - Object to traverse
 * @param {string} path - Dot-separated path (e.g., 'admin_bar.bg_color')
 * @returns {*} Value at path or undefined
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Helper function to set nested value in object using path
 * @param {Object} obj - Object to modify
 * @param {string} path - Dot-separated path (e.g., 'admin_bar.bg_color')
 * @param {*} value - Value to set
 * @returns {Object} New object with updated value
 */
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();

  // Create a deep copy
  const newObj = JSON.parse(JSON.stringify(obj));

  // Navigate to the parent object
  let current = newObj;
  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }

  // Set the value
  current[lastKey] = value;

  return newObj;
};

/**
 * Validation middleware
 * Validates state updates before applying them
 * Requirement 4.5
 */
const validateMiddleware = (config) => (set, get, api) => {
  return config(
    (args) => {
      // Allow function updates
      if (typeof args === 'function') {
        return set(args);
      }

      // Validate settings updates
      if (args.settings) {
        // Basic validation - can be extended
        const validated = { ...args };

        // Validate color formats (hex colors)
        const validateColor = (color) => {
          if (typeof color === 'string' && color.startsWith('#')) {
            return /^#[0-9A-Fa-f]{6}$/.test(color);
          }
          return true;
        };

        // Add more validation as needed
        // For now, just pass through
      }

      return set(args);
    },
    get,
    api,
  );
};

/**
 * History middleware for undo/redo functionality
 * Requirement 4.3
 */
const historyMiddleware = (config) => (set, get, api) => {
  return config(
    (args) => {
      const state = get();

      // Only track settings changes in history
      if (typeof args === 'object' && args.settings && !args._skipHistory) {
        const newPast = [...state.history.past, state.settings];

        // Limit history to 50 states (Requirement 4.3)
        if (newPast.length > 50) {
          newPast.shift();
        }

        return set({
          ...args,
          history: {
            past: newPast,
            future: [], // Clear future on new change
          },
          ui: {
            ...state.ui,
            isDirty: true,
          },
        });
      }

      return set(args);
    },
    get,
    api,
  );
};

/**
 * Warm settings cache with frequently accessed values
 * Task 19.2: Add cache warming on initialization
 * Requirement 12.1
 *
 * @param {Object} settings - Settings object to warm cache with
 */
const warmSettingsCache = (settings) => {
  // Cache frequently accessed settings paths
  const frequentPaths = [
    'admin_bar',
    'admin_bar.bg_color',
    'admin_bar.text_color',
    'admin_bar.height',
    'admin_menu',
    'admin_menu.bg_color',
    'admin_menu.text_color',
    'admin_menu.width',
    'typography',
    'typography.admin_bar',
    'typography.admin_menu',
    'typography.content',
    'visual_effects',
    'visual_effects.admin_bar',
    'visual_effects.admin_menu',
    'effects',
    'palettes.current',
    'templates.current',
  ];

  for (const path of frequentPaths) {
    const value = getNestedValue(settings, path);
    if (value !== undefined) {
      settingsCache.set(path, value);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('MASE: Settings cache warmed with', frequentPaths.length, 'entries');
  }
};

/**
 * Create the Zustand store with middleware
 * Requirements: 4.1, 4.2
 */
export const useStore = create(
  devtools(
    subscribeWithSelector(
      historyMiddleware(
        validateMiddleware((set, get) => ({
          ...getDefaultState(),

          /**
           * Update settings with nested path support
           * Requirement 4.5
           * Task 12.3: Emit settings:changed event
           * Task 19.2: Invalidate cache on state changes
           *
           * @param {string} path - Dot-separated path (e.g., 'admin_bar.bg_color')
           * @param {*} value - Value to set
           */
          updateSettings: (path, value) => {
            const state = get();
            const newSettings = setNestedValue(state.settings, path, value);

            set({
              settings: newSettings,
            });

            // Invalidate cache for this path (Task 19.2)
            settingsCache.invalidate(path);

            // Also invalidate parent paths
            const pathParts = path.split('.');
            for (let i = 1; i < pathParts.length; i++) {
              const parentPath = pathParts.slice(0, i).join('.');
              settingsCache.invalidate(parentPath);
            }

            // Emit settings changed event (Task 12.3, Requirement 4.2, 9.1)
            eventBus.emitDebounced(
              EVENTS.SETTINGS_CHANGED,
              {
                path,
                value,
                settings: newSettings,
              },
              100,
            );
          },

          /**
           * Update multiple settings at once
           * Task 12.3: Emit settings:changed event
           * Task 19.2: Invalidate cache on state changes
           *
           * @param {Object} updates - Object with settings to update
           */
          updateMultipleSettings: (updates) => {
            const state = get();
            const newSettings = { ...state.settings, ...updates };

            set({
              settings: newSettings,
            });

            // Clear entire cache on bulk updates (Task 19.2)
            settingsCache.clear();

            // Emit settings changed event (Task 12.3, Requirement 4.2, 9.1)
            eventBus.emitDebounced(
              EVENTS.SETTINGS_CHANGED,
              {
                updates,
                settings: newSettings,
              },
              100,
            );
          },

          /**
           * Undo last change
           * Requirement 4.3
           */
          undo: () => {
            const state = get();

            if (state.history.past.length === 0) {
              return;
            }

            const previous = state.history.past[state.history.past.length - 1];
            const newPast = state.history.past.slice(0, -1);

            set({
              settings: previous,
              history: {
                past: newPast,
                future: [state.settings, ...state.history.future],
              },
              _skipHistory: true,
            });
          },

          /**
           * Redo last undone change
           * Requirement 4.3
           */
          redo: () => {
            const state = get();

            if (state.history.future.length === 0) {
              return;
            }

            const next = state.history.future[0];
            const newFuture = state.history.future.slice(1);

            set({
              settings: next,
              history: {
                past: [...state.history.past, state.settings],
                future: newFuture,
              },
              _skipHistory: true,
            });
          },

          /**
           * Reset to default settings
           * Requirement 4.4
           * Task 12.3: Emit settings:reset event
           * Task 19.2: Clear cache on reset
           */
          resetToDefaults: () => {
            const defaults = getDefaultState();

            // Emit reset event before resetting (Task 12.3)
            eventBus.emit(EVENTS.SETTINGS_RESET, {
              previousSettings: get().settings,
            });

            // Clear settings cache (Task 19.2)
            settingsCache.clear();

            set({
              settings: defaults.settings,
              ui: {
                ...get().ui,
                isDirty: true,
              },
            });

            // Emit reset complete event after resetting (Task 12.3)
            eventBus.emit(EVENTS.SETTINGS_RESET_COMPLETE, {
              settings: defaults.settings,
            });
          },

          /**
           * Load settings from server
           * Requirement 4.4, 8.1
           * Task 14.2: Use API Client for loading settings
           * Task 19.2: Add cache warming on initialization
           *
           * @returns {Promise<void>}
           */
          loadFromServer: async () => {
            set({
              ui: {
                ...get().ui,
                isLoading: true,
              },
            });

            try {
              // Use API Client to load settings (Task 14.2)
              const response = await apiClient.getSettings();

              if (response.success && response.data) {
                set({
                  settings: response.data,
                  ui: {
                    ...get().ui,
                    isLoading: false,
                    isDirty: false,
                  },
                  _skipHistory: true,
                });

                // Warm cache with frequently accessed settings (Task 19.2)
                warmSettingsCache(response.data);

                console.log('MASE: Settings loaded successfully from server');
              } else {
                throw new Error(response.message || 'Failed to load settings');
              }
            } catch (error) {
              console.error('MASE: Failed to load settings from server:', error);

              // Fallback to window.maseData if API call fails
              if (window.maseData && window.maseData.settings) {
                console.warn('MASE: Using fallback settings from window.maseData');
                set({
                  settings: window.maseData.settings,
                  ui: {
                    ...get().ui,
                    isLoading: false,
                    isDirty: false,
                  },
                  _skipHistory: true,
                });

                // Warm cache with fallback settings (Task 19.2)
                warmSettingsCache(window.maseData.settings);
              } else {
                set({
                  ui: {
                    ...get().ui,
                    isLoading: false,
                  },
                });
                throw error;
              }
            }
          },

          /**
           * Save settings to server
           * Requirement 4.4, 8.1
           * Task 12.3: Emit save events
           * Task 14.2: Use API Client for saving settings
           *
           * @returns {Promise<void>}
           */
          saveToServer: async () => {
            const state = get();

            if (state.ui.isSaving) {
              console.warn('MASE: Save already in progress');
              return;
            }

            // Emit save started event (Task 12.3)
            eventBus.emit(EVENTS.SETTINGS_SAVE, {
              settings: state.settings,
            });

            set({
              ui: {
                ...state.ui,
                isSaving: true,
              },
            });

            try {
              // Use API Client to save settings (Task 14.2)
              const response = await apiClient.saveSettings(state.settings);

              if (response.success) {
                set({
                  ui: {
                    ...state.ui,
                    isSaving: false,
                    isDirty: false,
                  },
                });

                // Emit save completed event (Task 12.3)
                eventBus.emit(EVENTS.SETTINGS_SAVED, {
                  settings: state.settings,
                  response,
                });

                console.log('MASE: Settings saved successfully to server');
                return response;
              } else {
                throw new Error(response.message || 'Save failed');
              }
            } catch (error) {
              console.error('MASE: Failed to save settings to server:', error);

              set({
                ui: {
                  ...state.ui,
                  isSaving: false,
                },
              });

              // Emit save failed event (Task 12.3)
              eventBus.emit(EVENTS.SETTINGS_SAVE_FAILED, {
                settings: state.settings,
                error: error.message,
              });

              throw error;
            }
          },

          /**
           * Update UI state
           * @param {Object} updates - UI state updates
           */
          updateUI: (updates) => {
            set({
              ui: {
                ...get().ui,
                ...updates,
              },
            });
          },

          /**
           * Get setting value by path
           * Task 19.2: Use cache for frequently accessed settings
           *
           * @param {string} path - Dot-separated path
           * @returns {*} Value at path
           */
          getSetting: (path) => {
            // Check cache first (Task 19.2)
            const cached = settingsCache.get(path);
            if (cached !== undefined) {
              return cached;
            }

            // Get from state and cache it
            const value = getNestedValue(get().settings, path);
            if (value !== undefined) {
              settingsCache.set(path, value);
            }

            return value;
          },

          /**
           * Get cache statistics
           * Task 19.2: Expose cache stats for monitoring
           *
           * @returns {Object} Cache statistics
           */
          getCacheStats: () => {
            return settingsCache.getStats();
          },

          // ============================================================================
          // AI-Related Actions
          // Requirements: 14.1, 14.3
          // ============================================================================

          /**
           * Set AI suggestions for a category
           * @param {string} category - Suggestion category (colors, typography, etc.)
           * @param {Array} suggestions - Array of suggestion objects
           */
          setAISuggestions: (category, suggestions) => {
            const state = get();
            set({
              ai: {
                ...state.ai,
                suggestions: {
                  ...state.ai.suggestions,
                  [category]: suggestions,
                },
                loading: {
                  ...state.ai.loading,
                  [category]: false,
                },
                errors: {
                  ...state.ai.errors,
                  [category]: null,
                },
              },
            });

            // Emit AI suggestion received event
            eventBus.emit(EVENTS.AI_SUGGESTION_RECEIVED, {
              category,
              suggestions,
            });
          },

          /**
           * Set AI loading state for a category
           * @param {string} category - Suggestion category
           * @param {boolean} loading - Loading state
           */
          setAILoading: (category, loading) => {
            const state = get();
            set({
              ai: {
                ...state.ai,
                loading: {
                  ...state.ai.loading,
                  [category]: loading,
                },
              },
            });

            if (loading) {
              eventBus.emit(EVENTS.AI_SUGGESTION_LOADING, { category });
            }
          },

          /**
           * Set AI error for a category
           * @param {string} category - Suggestion category
           * @param {string} error - Error message
           */
          setAIError: (category, error) => {
            const state = get();
            set({
              ai: {
                ...state.ai,
                loading: {
                  ...state.ai.loading,
                  [category]: false,
                },
                errors: {
                  ...state.ai.errors,
                  [category]: error,
                },
              },
            });

            eventBus.emit(EVENTS.AI_SUGGESTION_ERROR, {
              category,
              error,
            });
          },

          /**
           * Apply an AI suggestion
           * @param {string} suggestionId - ID of the suggestion to apply
           * @param {Object} suggestion - Suggestion object
           */
          applyAISuggestion: async (suggestionId, suggestion) => {
            const state = get();

            try {
              // Apply the suggestion via API Client
              const response = await apiClient.applyAISuggestion(suggestionId, suggestion.type);

              if (response.success && response.settings) {
                // Update settings with AI suggestion
                set({
                  settings: response.settings,
                  ai: {
                    ...state.ai,
                    history: [
                      ...state.ai.history,
                      {
                        id: suggestionId,
                        type: suggestion.type,
                        appliedAt: new Date().toISOString(),
                        confidence: suggestion.confidence,
                      },
                    ],
                  },
                });

                // Clear cache after applying AI suggestion
                settingsCache.clear();

                // Emit AI suggestion applied event
                eventBus.emit(EVENTS.AI_SUGGESTION_APPLIED, {
                  suggestionId,
                  suggestion,
                  settings: response.settings,
                });

                return response;
              } else {
                throw new Error(response?.message || 'Failed to apply AI suggestion');
              }
            } catch (error) {
              console.error('MASE: Failed to apply AI suggestion:', error);

              eventBus.emit(EVENTS.AI_SUGGESTION_ERROR, {
                suggestionId,
                error: error.message,
              });

              throw error;
            }
          },

          /**
           * Reject an AI suggestion
           * @param {string} suggestionId - ID of the suggestion to reject
           * @param {string} category - Suggestion category
           * @param {string} [reason] - Optional rejection reason
           */
          rejectAISuggestion: async (suggestionId, category, reason = null) => {
            const state = get();

            try {
              // Send rejection feedback to API
              await apiClient.rejectAISuggestion(suggestionId, reason);

              // Remove suggestion from state
              const updatedSuggestions = state.ai.suggestions[category].filter(
                (s) => s.id !== suggestionId,
              );

              set({
                ai: {
                  ...state.ai,
                  suggestions: {
                    ...state.ai.suggestions,
                    [category]: updatedSuggestions,
                  },
                },
              });

              // Emit AI suggestion rejected event
              eventBus.emit(EVENTS.AI_SUGGESTION_REJECTED, {
                suggestionId,
                category,
                reason,
              });
            } catch (error) {
              console.error('MASE: Failed to reject AI suggestion:', error);
              throw error;
            }
          },

          /**
           * Update AI settings
           * @param {Object} settings - AI settings to update
           */
          updateAISettings: async (settings) => {
            const state = get();

            try {
              // Update AI settings via API
              const response = await apiClient.updateAISettings(settings);

              if (response.success) {
                set({
                  ai: {
                    ...state.ai,
                    settings: {
                      ...state.ai.settings,
                      ...settings,
                    },
                  },
                });

                // Emit AI settings changed event
                eventBus.emit(EVENTS.AI_SETTINGS_CHANGED, {
                  settings,
                });

                return response;
              } else {
                throw new Error(response?.message || 'Failed to update AI settings');
              }
            } catch (error) {
              console.error('MASE: Failed to update AI settings:', error);
              throw error;
            }
          },

          /**
           * Load AI suggestions for a category
           * @param {string} category - Suggestion category
           * @param {Object} context - Context for AI suggestions
           */
          loadAISuggestions: async (category, context = {}) => {
            const state = get();

            // Check if AI is enabled
            if (!state.ai.settings.enabled) {
              console.log('MASE: AI features are disabled');
              return;
            }

            // Set loading state
            get().setAILoading(category, true);

            try {
              let response;

              // Call appropriate API method based on category
              switch (category) {
                case 'colors':
                  response = await apiClient.getAIColorSuggestions(context);
                  break;
                case 'typography':
                  response = await apiClient.getAITypographySuggestions(context);
                  break;
                case 'accessibility':
                  response = await apiClient.analyzeAccessibility(state.settings);
                  break;
                case 'settings':
                  response = await apiClient.getPredictiveSettings(context);
                  break;
                default:
                  throw new Error(`Unknown AI category: ${category}`);
              }

              // Filter suggestions by confidence threshold
              const filteredSuggestions = (
                response.suggestions ||
                response.analysis?.suggestions ||
                response.predictions ||
                []
              ).filter((s) => s.confidence >= state.ai.settings.confidenceThreshold);

              // Set suggestions in state
              get().setAISuggestions(category, filteredSuggestions);

              return filteredSuggestions;
            } catch (error) {
              console.error(`MASE: Failed to load AI suggestions for ${category}:`, error);
              get().setAIError(category, error.message);
              throw error;
            }
          },

          /**
           * Clear AI suggestions for a category
           * @param {string} category - Suggestion category
           */
          clearAISuggestions: (category) => {
            const state = get();
            set({
              ai: {
                ...state.ai,
                suggestions: {
                  ...state.ai.suggestions,
                  [category]: [],
                },
                errors: {
                  ...state.ai.errors,
                  [category]: null,
                },
              },
            });
          },

          /**
           * Get AI suggestion history
           * @returns {Array} AI suggestion history
           */
          getAISuggestionHistory: () => {
            return get().ai.history;
          },

          /**
          getCacheStats: () => {
            return settingsCache.getStats();
          },
          
          /**
           * Clear settings cache
           * Task 19.2: Manual cache clearing
           */
          clearCache: () => {
            settingsCache.clear();
          },

          /**
           * Check if there are changes to undo
           * @returns {boolean}
           */
          canUndo: () => {
            return get().history.past.length > 0;
          },

          /**
           * Check if there are changes to redo
           * @returns {boolean}
           */
          canRedo: () => {
            return get().history.future.length > 0;
          },
        })),
      ),
    ),
    { name: 'MASE Store' },
  ),
);

/**
 * Selectors for efficient subscriptions
 * Requirement 4.2
 */
export const selectors = {
  // Settings selectors
  settings: (state) => state.settings,
  adminBar: (state) => state.settings.admin_bar,
  adminMenu: (state) => state.settings.admin_menu,
  typography: (state) => state.settings.typography,
  visualEffects: (state) => state.settings.visual_effects,
  effects: (state) => state.settings.effects,
  palettes: (state) => state.settings.palettes,
  templates: (state) => state.settings.templates,

  // UI selectors
  ui: (state) => state.ui,
  activeTab: (state) => state.ui.activeTab,
  isDirty: (state) => state.ui.isDirty,
  isPreviewMode: (state) => state.ui.isPreviewMode,
  isSaving: (state) => state.ui.isSaving,
  isLoading: (state) => state.ui.isLoading,

  // History selectors
  canUndo: (state) => state.history.past.length > 0,
  canRedo: (state) => state.history.future.length > 0,
};

/**
 * Setup keyboard shortcuts for undo/redo
 * Requirement 4.3
 */
export const setupKeyboardShortcuts = () => {
  document.addEventListener('keydown', (e) => {
    // Ctrl+Z or Cmd+Z for undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      const state = useStore.getState();
      if (state.canUndo()) {
        state.undo();
      }
    }

    // Ctrl+Y or Cmd+Shift+Z for redo
    if (
      ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
    ) {
      e.preventDefault();
      const state = useStore.getState();
      if (state.canRedo()) {
        state.redo();
      }
    }
  });
};

// ============================================================================
// Operational Transformation (Real-time Collaboration)
// Requirements: 14.2
// ============================================================================

/**
 * Operation types for operational transformation
 */
export const OperationType = {
  SET: 'set',
  DELETE: 'delete',
  INSERT: 'insert',
  MOVE: 'move',
};

/**
 * Operation class for operational transformation
 */
export class Operation {
  constructor(type, path, value, oldValue = null, timestamp = null, clientId = null) {
    this.type = type;
    this.path = path;
    this.value = value;
    this.oldValue = oldValue;
    this.timestamp = timestamp || Date.now();
    this.clientId = clientId || this._generateClientId();
    this.id = `${this.clientId}-${this.timestamp}`;
  }

  /**
   * Generate unique client ID
   * @private
   * @returns {string} Client ID
   */
  _generateClientId() {
    if (typeof window !== 'undefined' && window.maseData?.userId) {
      return `user-${window.maseData.userId}`;
    }
    return `client-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Apply this operation to a state object
   * @param {Object} state - State object to apply operation to
   * @returns {Object} New state with operation applied
   */
  apply(state) {
    switch (this.type) {
      case OperationType.SET:
        return setNestedValue(state, this.path, this.value);

      case OperationType.DELETE:
        return this._deleteValue(state, this.path);

      case OperationType.INSERT:
        return this._insertValue(state, this.path, this.value);

      case OperationType.MOVE:
        return this._moveValue(state, this.path, this.value);

      default:
        throw new Error(`Unknown operation type: ${this.type}`);
    }
  }

  /**
   * Delete value at path
   * @private
   */
  _deleteValue(state, path) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const newState = JSON.parse(JSON.stringify(state));

    let current = newState;
    for (const key of keys) {
      if (!(key in current)) {
        return state;
      }
      current = current[key];
    }

    delete current[lastKey];
    return newState;
  }

  /**
   * Insert value at path (for arrays)
   * @private
   */
  _insertValue(state, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const newState = JSON.parse(JSON.stringify(state));

    let current = newState;
    for (const key of keys) {
      if (!(key in current)) {
        return state;
      }
      current = current[key];
    }

    if (Array.isArray(current[lastKey])) {
      current[lastKey].push(value);
    }

    return newState;
  }

  /**
   * Move value from one path to another
   * @private
   */
  _moveValue(state, fromPath, toPath) {
    const value = getNestedValue(state, fromPath);
    let newState = this._deleteValue(state, fromPath);
    newState = setNestedValue(newState, toPath, value);
    return newState;
  }

  /**
   * Create inverse operation (for undo)
   * @returns {Operation} Inverse operation
   */
  inverse() {
    switch (this.type) {
      case OperationType.SET:
        return new Operation(
          OperationType.SET,
          this.path,
          this.oldValue,
          this.value,
          this.timestamp,
          this.clientId,
        );

      case OperationType.DELETE:
        return new Operation(
          OperationType.SET,
          this.path,
          this.oldValue,
          null,
          this.timestamp,
          this.clientId,
        );

      case OperationType.INSERT:
        return new Operation(
          OperationType.DELETE,
          this.path,
          null,
          this.value,
          this.timestamp,
          this.clientId,
        );

      default:
        throw new Error(`Cannot create inverse for operation type: ${this.type}`);
    }
  }

  /**
   * Serialize operation to JSON
   * @returns {Object} Serialized operation
   */
  toJSON() {
    return {
      type: this.type,
      path: this.path,
      value: this.value,
      oldValue: this.oldValue,
      timestamp: this.timestamp,
      clientId: this.clientId,
      id: this.id,
    };
  }

  /**
   * Deserialize operation from JSON
   * @param {Object} json - Serialized operation
   * @returns {Operation} Operation instance
   */
  static fromJSON(json) {
    return new Operation(
      json.type,
      json.path,
      json.value,
      json.oldValue,
      json.timestamp,
      json.clientId,
    );
  }
}

/**
 * Operational Transformation engine for conflict resolution
 */
export class OTEngine {
  constructor() {
    this.pendingOperations = [];
    this.acknowledgedOperations = [];
    this.maxHistorySize = 100;
  }

  /**
   * Transform two concurrent operations
   * @param {Operation} op1 - First operation
   * @param {Operation} op2 - Second operation
   * @returns {Object} Transformed operations { op1Prime, op2Prime }
   */
  transform(op1, op2) {
    // If operations are on different paths, no transformation needed
    if (!this._pathsConflict(op1.path, op2.path)) {
      return { op1Prime: op1, op2Prime: op2 };
    }

    // If operations are on the same path
    if (op1.path === op2.path) {
      return this._transformSamePath(op1, op2);
    }

    // If one path is a parent of the other
    if (this._isParentPath(op1.path, op2.path)) {
      return this._transformParentChild(op1, op2);
    }

    if (this._isParentPath(op2.path, op1.path)) {
      const result = this._transformParentChild(op2, op1);
      return { op1Prime: result.op2Prime, op2Prime: result.op1Prime };
    }

    // No conflict
    return { op1Prime: op1, op2Prime: op2 };
  }

  /**
   * Check if two paths conflict
   * @private
   */
  _pathsConflict(path1, path2) {
    return path1 === path2 || this._isParentPath(path1, path2) || this._isParentPath(path2, path1);
  }

  /**
   * Check if path1 is a parent of path2
   * @private
   */
  _isParentPath(path1, path2) {
    return path2.startsWith(path1 + '.');
  }

  /**
   * Transform operations on the same path
   * @private
   */
  _transformSamePath(op1, op2) {
    // SET vs SET: Last write wins (based on timestamp)
    if (op1.type === OperationType.SET && op2.type === OperationType.SET) {
      if (op1.timestamp < op2.timestamp) {
        // op2 wins, op1 becomes no-op
        return {
          op1Prime: new Operation(
            OperationType.SET,
            op1.path,
            op2.value,
            op1.oldValue,
            op1.timestamp,
            op1.clientId,
          ),
          op2Prime: op2,
        };
      } else {
        // op1 wins, op2 becomes no-op
        return {
          op1Prime: op1,
          op2Prime: new Operation(
            OperationType.SET,
            op2.path,
            op1.value,
            op2.oldValue,
            op2.timestamp,
            op2.clientId,
          ),
        };
      }
    }

    // DELETE vs SET: SET wins
    if (op1.type === OperationType.DELETE && op2.type === OperationType.SET) {
      return {
        op1Prime: new Operation(
          OperationType.SET,
          op1.path,
          op2.value,
          null,
          op1.timestamp,
          op1.clientId,
        ),
        op2Prime: op2,
      };
    }

    if (op1.type === OperationType.SET && op2.type === OperationType.DELETE) {
      return {
        op1Prime: op1,
        op2Prime: new Operation(
          OperationType.SET,
          op2.path,
          op1.value,
          null,
          op2.timestamp,
          op2.clientId,
        ),
      };
    }

    // Default: no transformation
    return { op1Prime: op1, op2Prime: op2 };
  }

  /**
   * Transform parent-child path operations
   * @private
   */
  _transformParentChild(parent, child) {
    // If parent is deleted, child operation becomes no-op
    if (parent.type === OperationType.DELETE) {
      return {
        op1Prime: parent,
        op2Prime: new Operation(
          OperationType.SET,
          child.path,
          null,
          child.oldValue,
          child.timestamp,
          child.clientId,
        ),
      };
    }

    // If parent is set, child operation may need adjustment
    if (parent.type === OperationType.SET) {
      // Child operation still applies to the new parent value
      return { op1Prime: parent, op2Prime: child };
    }

    // Default: no transformation
    return { op1Prime: parent, op2Prime: child };
  }

  /**
   * Add operation to pending queue
   * @param {Operation} operation - Operation to add
   */
  addPendingOperation(operation) {
    this.pendingOperations.push(operation);
  }

  /**
   * Acknowledge operation (received from server)
   * @param {string} operationId - ID of acknowledged operation
   */
  acknowledgeOperation(operationId) {
    const index = this.pendingOperations.findIndex((op) => op.id === operationId);
    if (index !== -1) {
      const [op] = this.pendingOperations.splice(index, 1);
      this.acknowledgedOperations.push(op);

      // Limit history size
      if (this.acknowledgedOperations.length > this.maxHistorySize) {
        this.acknowledgedOperations.shift();
      }
    }
  }

  /**
   * Transform incoming operation against pending operations
   * @param {Operation} incomingOp - Operation from another client
   * @returns {Operation} Transformed operation
   */
  transformIncoming(incomingOp) {
    let transformedOp = incomingOp;

    // Transform against all pending operations
    for (const pendingOp of this.pendingOperations) {
      const result = this.transform(pendingOp, transformedOp);
      transformedOp = result.op2Prime;
    }

    return transformedOp;
  }

  /**
   * Get pending operations count
   * @returns {number} Number of pending operations
   */
  getPendingCount() {
    return this.pendingOperations.length;
  }

  /**
   * Clear all pending operations
   */
  clearPending() {
    this.pendingOperations = [];
  }

  /**
   * Get operation history
   * @returns {Array} Acknowledged operations
   */
  getHistory() {
    return [...this.acknowledgedOperations];
  }
}

/**
 * Collaborative editing manager
 * Integrates OT engine with state manager and WebSocket
 */
export class CollaborationManager {
  constructor(store, apiClient) {
    this.store = store;
    this.apiClient = apiClient;
    this.otEngine = new OTEngine();
    this.isEnabled = false;
    this.unsubscribers = [];
    this.presenceData = new Map();
  }

  /**
   * Enable collaborative editing
   * @returns {Promise<void>}
   */
  async enable() {
    if (this.isEnabled) {
      return;
    }

    try {
      // Connect WebSocket
      await this.apiClient.connectWebSocket();

      // Subscribe to state changes
      const unsubStateChanges = this.apiClient.subscribeToMessages('state-change', (data) => {
        this._handleRemoteStateChange(data);
      });
      this.unsubscribers.push(unsubStateChanges);

      // Subscribe to presence updates
      const unsubPresence = this.apiClient.subscribeToPresence((data) => {
        this._handlePresenceUpdate(data);
      });
      this.unsubscribers.push(unsubPresence);

      // Subscribe to local state changes
      const unsubLocalChanges = this.store.subscribe(
        (state) => state.settings,
        (settings, prevSettings) => {
          this._handleLocalStateChange(settings, prevSettings);
        },
      );
      this.unsubscribers.push(unsubLocalChanges);

      this.isEnabled = true;

      // Emit collaboration enabled event
      eventBus.emit(EVENTS.COLLABORATION_ENABLED, {
        timestamp: Date.now(),
      });

      console.log('MASE: Collaborative editing enabled');
    } catch (error) {
      console.error('MASE: Failed to enable collaborative editing:', error);
      throw error;
    }
  }

  /**
   * Disable collaborative editing
   */
  disable() {
    if (!this.isEnabled) {
      return;
    }

    // Unsubscribe from all events
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];

    // Disconnect WebSocket
    this.apiClient.disconnectWebSocket();

    // Clear OT engine
    this.otEngine.clearPending();

    this.isEnabled = false;

    // Emit collaboration disabled event
    eventBus.emit(EVENTS.COLLABORATION_DISABLED, {
      timestamp: Date.now(),
    });

    console.log('MASE: Collaborative editing disabled');
  }

  /**
   * Handle local state change
   * @private
   */
  _handleLocalStateChange(settings, prevSettings) {
    if (!this.isEnabled) {
      return;
    }

    // Find changed paths
    const changes = this._findChanges(prevSettings, settings);

    // Create operations for each change
    for (const change of changes) {
      const operation = new Operation(
        OperationType.SET,
        change.path,
        change.newValue,
        change.oldValue,
      );

      // Add to pending operations
      this.otEngine.addPendingOperation(operation);

      // Broadcast to other clients
      this.apiClient
        .broadcastStateChange({
          path: change.path,
          value: change.newValue,
          oldValue: change.oldValue,
          operation: OperationType.SET,
        })
        .catch((error) => {
          console.error('MASE: Failed to broadcast state change:', error);
        });
    }
  }

  /**
   * Handle remote state change
   * @private
   */
  _handleRemoteStateChange(data) {
    if (!this.isEnabled) {
      return;
    }

    // Create operation from remote change
    const remoteOp = new Operation(
      data.operation || OperationType.SET,
      data.path,
      data.value,
      data.oldValue,
      data.timestamp,
      data.clientId,
    );

    // Transform against pending operations
    const transformedOp = this.otEngine.transformIncoming(remoteOp);

    // Apply transformed operation to local state
    const currentState = this.store.getState();
    const newSettings = transformedOp.apply(currentState.settings);

    // Update state without triggering broadcast
    this.store.setState({
      settings: newSettings,
      _skipHistory: true,
    });

    // Emit remote change event
    eventBus.emit(EVENTS.COLLABORATION_REMOTE_CHANGE, {
      path: data.path,
      value: data.value,
      clientId: data.clientId,
      timestamp: data.timestamp,
    });
  }

  /**
   * Handle presence update
   * @private
   */
  _handlePresenceUpdate(data) {
    if (!this.isEnabled) {
      return;
    }

    // Update presence data
    if (data.userId) {
      this.presenceData.set(data.userId, {
        activity: data.activity,
        location: data.location,
        metadata: data.metadata,
        timestamp: data.timestamp,
      });
    }

    // Emit presence update event
    eventBus.emit(EVENTS.COLLABORATION_PRESENCE_UPDATE, {
      userId: data.userId,
      presence: data,
    });
  }

  /**
   * Find changes between two state objects
   * @private
   */
  _findChanges(oldState, newState, path = '') {
    const changes = [];

    // Compare objects recursively
    const compare = (oldObj, newObj, currentPath) => {
      // Handle null/undefined
      if (oldObj === newObj) {
        return;
      }
      if (oldObj === null || newObj === null) {
        changes.push({
          path: currentPath,
          oldValue: oldObj,
          newValue: newObj,
        });
        return;
      }

      // Handle primitives
      if (typeof oldObj !== 'object' || typeof newObj !== 'object') {
        if (oldObj !== newObj) {
          changes.push({
            path: currentPath,
            oldValue: oldObj,
            newValue: newObj,
          });
        }
        return;
      }

      // Handle objects
      const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
      for (const key of allKeys) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        compare(oldObj[key], newObj[key], newPath);
      }
    };

    compare(oldState, newState, path);
    return changes;
  }

  /**
   * Get active collaborators
   * @returns {Array} Array of active collaborators
   */
  getActiveCollaborators() {
    const now = Date.now();
    const activeThreshold = 60000; // 1 minute

    return Array.from(this.presenceData.entries())
      .filter(([_, presence]) => now - presence.timestamp < activeThreshold)
      .map(([userId, presence]) => ({
        userId,
        ...presence,
      }));
  }

  /**
   * Update own presence
   * @param {Object} status - Presence status
   */
  async updatePresence(status) {
    if (!this.isEnabled) {
      return;
    }

    try {
      await this.apiClient.updatePresence(status);
    } catch (error) {
      console.error('MASE: Failed to update presence:', error);
    }
  }

  /**
   * Check if collaborative editing is enabled
   * @returns {boolean}
   */
  isCollaborationEnabled() {
    return this.isEnabled;
  }

  /**
   * Get pending operations count
   * @returns {number}
   */
  getPendingOperationsCount() {
    return this.otEngine.getPendingCount();
  }
}

/**
 * Create global collaboration manager instance
 */
let collaborationManager = null;

/**
 * Get or create collaboration manager
 * @param {Object} store - Zustand store
 * @param {Object} apiClient - API client instance
 * @returns {CollaborationManager}
 */
export const getCollaborationManager = (store, apiClient) => {
  if (!collaborationManager) {
    collaborationManager = new CollaborationManager(store, apiClient);
  }
  return collaborationManager;
};

export default useStore;
