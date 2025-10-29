/**
 * MASE Asset Loader Module
 *
 * Handles on-demand loading of JavaScript modules and data to optimize performance.
 * Task 35: Optimize frontend asset loading
 * Requirements: 7.1, 7.3
 *
 * Features:
 * - Load pattern library data on demand (not on page load)
 * - Load gradient builder JS only when gradient tab is active
 * - Debounce live preview updates (300ms)
 * - Throttle scroll events for lazy loading (200ms)
 * - Minimize DOM queries using caching
 *
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function ($) {
  'use strict';

  // Ensure MASE namespace exists
  window.MASE = window.MASE || {};

  /**
   * Asset Loader Module
   */
  MASE.assetLoader = {
    /**
     * Loaded modules registry
     */
    loadedModules: {},

    /**
     * Loading promises for modules
     */
    loadingPromises: {},

    /**
     * Cached DOM elements
     */
    domCache: {},

    /**
     * Initialize asset loader
     */
    init: function () {
      console.log('MASE: Initializing asset loader');

      // Initialize DOM cache
      this.initDOMCache();

      // Set up lazy module loading
      this.setupLazyLoading();

      console.log('MASE: Asset loader initialized');
    },

    /**
     * Initialize DOM cache to minimize queries
     * Requirement 7.3: Minimize DOM queries using caching
     */
    initDOMCache: function () {
      this.domCache = {
        $window: $(window),
        $document: $(document),
        $body: $('body'),
        $adminPage: $('.mase-admin-page'),
        $tabs: $('.mase-tab'),
        $tabContents: $('.mase-tab-content'),
        $backgroundsTab: $('#mase-backgrounds-tab'),
        $backgroundsContent: $('#mase-backgrounds-content'),
        $gradientControls: $('.mase-background-gradient-controls'),
        $patternControls: $('.mase-background-pattern-controls'),
        $livePreviewToggle: $('#mase-live-preview-toggle'),
        $saveButton: $('#mase-save-settings'),
      };

      console.log(
        'MASE: DOM cache initialized with',
        Object.keys(this.domCache).length,
        'elements',
      );
    },

    /**
     * Get cached DOM element
     *
     * @param {string} key - Cache key
     * @return {jQuery} Cached jQuery object
     */
    getCached: function (key) {
      if (!this.domCache[key]) {
        console.warn('MASE: DOM cache miss for key:', key);
        return $();
      }
      return this.domCache[key];
    },

    /**
     * Update cached DOM element
     *
     * @param {string} key - Cache key
     * @param {jQuery} $element - jQuery object to cache
     */
    updateCache: function (key, $element) {
      this.domCache[key] = $element;
    },

    /**
     * Clear DOM cache (useful after dynamic content changes)
     */
    clearCache: function () {
      this.domCache = {};
      this.initDOMCache();
    },

    /**
     * Set up lazy loading for modules
     * Requirement 7.1: Load modules on demand
     */
    setupLazyLoading: function () {
      const self = this;

      // Load gradient builder when gradient tab is clicked
      $(document).on('click', '[data-tab="backgrounds"]', function () {
        self.loadGradientBuilderIfNeeded();
      });

      // Load gradient builder when gradient type is selected
      $(document).on('change', '.mase-background-type-select', function () {
        const type = $(this).val();
        if (type === 'gradient') {
          self.loadGradientBuilderIfNeeded();
        } else if (type === 'pattern') {
          self.loadPatternLibraryIfNeeded();
        }
      });

      // Load pattern library when pattern tab is active
      $(document).on('click', '.mase-pattern-tab', function () {
        self.loadPatternLibraryIfNeeded();
      });

      console.log('MASE: Lazy loading configured');
    },

    /**
     * Load gradient builder module if not already loaded
     * Requirement 7.1: Load gradient builder JS only when gradient tab is active
     */
    loadGradientBuilderIfNeeded: function () {
      if (this.loadedModules.gradientBuilder) {
        console.log('MASE: Gradient builder already loaded');
        return Promise.resolve();
      }

      if (this.loadingPromises.gradientBuilder) {
        console.log('MASE: Gradient builder loading in progress');
        return this.loadingPromises.gradientBuilder;
      }

      console.log('MASE: Loading gradient builder module');

      // Check if module is already available (loaded via enqueue)
      if (typeof MASE.gradientBuilder !== 'undefined') {
        this.loadedModules.gradientBuilder = true;
        console.log('MASE: Gradient builder module already available');
        return Promise.resolve();
      }

      // Module will be loaded via WordPress enqueue system
      // This function just marks it as needed and initializes it
      const promise = new Promise((resolve, reject) => {
        // Wait for module to be available
        const checkInterval = setInterval(() => {
          if (typeof MASE.gradientBuilder !== 'undefined') {
            clearInterval(checkInterval);

            // Initialize the module
            if (typeof MASE.gradientBuilder.init === 'function') {
              MASE.gradientBuilder.init();
            }

            this.loadedModules.gradientBuilder = true;
            delete this.loadingPromises.gradientBuilder;

            console.log('MASE: Gradient builder module loaded and initialized');
            resolve();
          }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          delete this.loadingPromises.gradientBuilder;
          console.error('MASE: Gradient builder module load timeout');
          reject(new Error('Gradient builder load timeout'));
        }, 5000);
      });

      this.loadingPromises.gradientBuilder = promise;
      return promise;
    },

    /**
     * Load pattern library data if not already loaded
     * Requirement 7.1: Load pattern library data on demand (not on page load)
     */
    loadPatternLibraryIfNeeded: function () {
      if (this.loadedModules.patternLibrary) {
        console.log('MASE: Pattern library already loaded');
        return Promise.resolve();
      }

      if (this.loadingPromises.patternLibrary) {
        console.log('MASE: Pattern library loading in progress');
        return this.loadingPromises.patternLibrary;
      }

      console.log('MASE: Loading pattern library data');

      // Check if data is already available (loaded via wp_localize_script)
      if (typeof masePatternLibrary !== 'undefined') {
        this.loadedModules.patternLibrary = true;

        // Initialize pattern library module if available
        if (
          typeof MASE.patternLibrary !== 'undefined' &&
          typeof MASE.patternLibrary.init === 'function'
        ) {
          MASE.patternLibrary.init();
        }

        console.log('MASE: Pattern library data already available');
        return Promise.resolve();
      }

      // Load pattern library data via AJAX
      const promise = $.ajax({
        url: window.maseAdmin ? window.maseAdmin.ajaxUrl : ajaxurl,
        type: 'POST',
        data: {
          action: 'mase_get_pattern_library',
          nonce: window.maseAdmin ? window.maseAdmin.nonce : '',
        },
      })
        .then((response) => {
          if (response.success && response.data) {
            // Store pattern library data globally
            window.masePatternLibrary = response.data;

            // Initialize pattern library module if available
            if (typeof MASE.patternLibrary !== 'undefined') {
              MASE.patternLibrary.patterns = response.data;
              if (typeof MASE.patternLibrary.init === 'function') {
                MASE.patternLibrary.init();
              }
            }

            this.loadedModules.patternLibrary = true;
            delete this.loadingPromises.patternLibrary;

            console.log('MASE: Pattern library data loaded via AJAX');
            return response.data;
          } else {
            throw new Error('Failed to load pattern library data');
          }
        })
        .catch((error) => {
          delete this.loadingPromises.patternLibrary;
          console.error('MASE: Failed to load pattern library:', error);
          throw error;
        });

      this.loadingPromises.patternLibrary = promise;
      return promise;
    },

    /**
     * Debounce function
     * Requirement 7.3: Debounce live preview updates (300ms)
     *
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Execute immediately on first call
     * @return {Function} Debounced function
     */
    debounce: function (func, wait, immediate) {
      let timeout;

      return function executedFunction() {
        const context = this;
        const args = arguments;

        const later = function () {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
        };

        const callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) {
          func.apply(context, args);
        }
      };
    },

    /**
     * Throttle function
     * Requirement 7.3: Throttle scroll events for lazy loading (200ms)
     *
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @return {Function} Throttled function
     */
    throttle: function (func, limit) {
      let inThrottle;
      let lastFunc;
      let lastRan;

      return function () {
        const context = this;
        const args = arguments;

        if (!inThrottle) {
          func.apply(context, args);
          lastRan = Date.now();
          inThrottle = true;
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(
            function () {
              if (Date.now() - lastRan >= limit) {
                func.apply(context, args);
                lastRan = Date.now();
              }
            },
            Math.max(limit - (Date.now() - lastRan), 0),
          );
        }
      };
    },

    /**
     * Create debounced live preview update function
     * Requirement 7.3: Debounce live preview updates (300ms)
     *
     * @return {Function} Debounced update function
     */
    createDebouncedPreviewUpdate: function () {
      return this.debounce(function (area) {
        if (window.MASE && window.MASE.livePreview && window.MASE.livePreview.enabled) {
          if (typeof MASE.livePreview.updateBackground === 'function') {
            MASE.livePreview.updateBackground(area);
          }
        }
      }, 300);
    },

    /**
     * Create throttled scroll handler for lazy loading
     * Requirement 7.3: Throttle scroll events for lazy loading (200ms)
     *
     * @param {Function} callback - Scroll callback function
     * @return {Function} Throttled scroll handler
     */
    createThrottledScrollHandler: function (callback) {
      return this.throttle(callback, 200);
    },

    /**
     * Preload critical modules
     * Called when user is likely to need them soon
     */
    preloadCriticalModules: function () {
      console.log('MASE: Preloading critical modules');

      // Preload gradient builder if backgrounds tab is visible
      if (this.getCached('$backgroundsTab').is(':visible')) {
        this.loadGradientBuilderIfNeeded();
      }
    },

    /**
     * Get module load status
     *
     * @param {string} moduleName - Module name
     * @return {boolean} True if module is loaded
     */
    isModuleLoaded: function (moduleName) {
      return !!this.loadedModules[moduleName];
    },

    /**
     * Get all loaded modules
     *
     * @return {Array} Array of loaded module names
     */
    getLoadedModules: function () {
      return Object.keys(this.loadedModules);
    },
  };

  // Initialize on document ready
  $(document).ready(function () {
    MASE.assetLoader.init();
  });
})(jQuery);
