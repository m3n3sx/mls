/**
 * Main Admin Module
 * 
 * Application initialization and coordination for MASE plugin.
 * Manages module lifecycle and provides legacy compatibility.
 * 
 * Task 16: Implement Main Admin module
 * Requirements: 1.1, 1.2, 10.1, 10.4, 10.5
 * 
 * @module main-admin
 */

import { useStore, setupKeyboardShortcuts } from './state-manager.js';
import eventBus, { EVENTS } from './event-bus.js';
import apiClient from './api-client.js';
import eventAdapter from './event-adapter.js';
import { initializeUI } from './ui-init.js';

// Lazy-loaded modules (Task 18.2)
// These modules are loaded on demand to reduce initial bundle size
// Requirement 12.3
let previewEngine = null;
let colorSystem = null;
let typography = null;
let animations = null;
let paletteManager = null;
let templateManager = null;

/**
 * Lazy loading functions for feature modules (Task 18.2)
 * Load modules on demand to reduce initial bundle size
 * Requirement 12.3
 */
const lazyLoadModules = {
  /**
   * Load Preview Engine module on demand
   * @returns {Promise<Object>} Preview Engine module
   */
  async loadPreviewEngine() {
    if (!previewEngine) {
      const module = await import('./preview-engine.js');
      previewEngine = module.default;
    }
    return previewEngine;
  },
  
  /**
   * Load Color System module on demand
   * @returns {Promise<Object>} Color System module
   */
  async loadColorSystem() {
    if (!colorSystem) {
      const module = await import('./color-system.js');
      colorSystem = module.default;
    }
    return colorSystem;
  },
  
  /**
   * Load Typography module on demand
   * @returns {Promise<Object>} Typography module
   */
  async loadTypography() {
    if (!typography) {
      const module = await import('./typography.js');
      typography = module.default;
    }
    return typography;
  },
  
  /**
   * Load Animations module on demand
   * @returns {Promise<Object>} Animations module
   */
  async loadAnimations() {
    if (!animations) {
      const module = await import('./animations.js');
      animations = module.default;
    }
    return animations;
  },
  
  /**
   * Load Palette Manager module on demand
   * @returns {Promise<Object>} Palette Manager module
   */
  async loadPaletteManager() {
    if (!paletteManager) {
      const module = await import('./palette-manager.js');
      paletteManager = module.default;
    }
    return paletteManager;
  },
  
  /**
   * Load Template Manager module on demand
   * @returns {Promise<Object>} Template Manager module
   */
  async loadTemplateManager() {
    if (!templateManager) {
      const module = await import('./template-manager.js');
      templateManager = module.default;
    }
    return templateManager;
  },
};

/**
 * MASE Admin Class
 * 
 * Coordinates modern module initialization and lifecycle management.
 * Provides legacy compatibility layer for backwards compatibility.
 * 
 * Task 16.1: Create MASEAdmin class with initialization
 * Task 16.2: Implement module initialization sequence
 * Task 16.4: Implement legacy compatibility layer
 * Task 18.2: Implement lazy loading for feature modules
 * 
 * Requirements: 1.1, 1.2, 12.3
 */
export class MASEAdmin {
  constructor() {
    // Module registry (Task 16.1)
    this.modules = new Map();
    
    // Initialization state
    this.initialized = false;
    this.initializationError = null;
    
    // Legacy compatibility (Task 16.4)
    this.legacyAPI = null;
    
    // Module lifecycle hooks
    this.lifecycleHooks = {
      beforeInit: [],
      afterInit: [],
      beforeDestroy: [],
      afterDestroy: [],
    };
    
    // Lazy loading state (Task 18.2)
    this.lazyLoadedModules = new Set();
    
    // Setup lazy loading event listeners (Task 18.2)
    this._setupLazyLoadingListeners();
  }
  
  /**
   * Setup lazy loading event listeners
   * Task 18.2: Load modules on demand when tabs are clicked
   * Requirement 12.3
   * @private
   */
  _setupLazyLoadingListeners() {
    // Wait for DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this._setupTabNavigation();
        this._attachTabListeners();
      });
    } else {
      this._setupTabNavigation();
      this._attachTabListeners();
    }
  }
  
  /**
   * Setup basic tab navigation functionality
   * Handles tab switching and content visibility
   * @private
   */
  _setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.mase-tab-button');
    const tabContents = document.querySelectorAll('.mase-tab-content');
    
    if (tabButtons.length === 0 || tabContents.length === 0) {
      console.warn('MASE: Tab navigation elements not found');
      return;
    }
    
    // Add click handlers to tab buttons
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = button.getAttribute('data-tab');
        
        if (!tabName) {
          console.warn('MASE: Tab button missing data-tab attribute', button);
          return;
        }
        
        // Update button states
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
          btn.setAttribute('tabindex', '-1');
        });
        
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        button.setAttribute('tabindex', '0');
        
        // Update content visibility
        tabContents.forEach(content => {
          content.classList.remove('active');
          content.style.display = 'none';
        });
        
        const targetContent = document.getElementById(`tab-${tabName}`);
        if (targetContent) {
          targetContent.classList.add('active');
          targetContent.style.display = 'block';
          targetContent.focus();
        } else {
          console.warn(`MASE: Tab content not found for: tab-${tabName}`);
        }
        
        // Emit tab change event
        eventBus.emit(EVENTS.TAB_SWITCHED, {
          tab: tabName,
          timestamp: Date.now(),
        });
      });
      
      // Keyboard navigation
      button.addEventListener('keydown', (e) => {
        let targetButton = null;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const currentIndex = Array.from(tabButtons).indexOf(button);
          targetButton = tabButtons[currentIndex + 1] || tabButtons[0];
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const currentIndex = Array.from(tabButtons).indexOf(button);
          targetButton = tabButtons[currentIndex - 1] || tabButtons[tabButtons.length - 1];
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetButton = tabButtons[0];
        } else if (e.key === 'End') {
          e.preventDefault();
          targetButton = tabButtons[tabButtons.length - 1];
        }
        
        if (targetButton) {
          targetButton.click();
          targetButton.focus();
        }
      });
    });
    
    console.log('MASE: Tab navigation initialized');
  }
  
  /**
   * Attach tab click listeners for lazy loading
   * Task 18.2: Load Color System when color tab clicked
   * Task 18.2: Load Typography when typography tab clicked
   * Task 18.2: Load Animations when effects tab clicked
   * Requirement 12.3
   * @private
   */
  _attachTabListeners() {
    // Color tab - lazy load Color System
    const colorTab = document.querySelector('[data-tab="colors"]');
    if (colorTab) {
      colorTab.addEventListener('click', async () => {
        if (!this.lazyLoadedModules.has('colorSystem')) {
          console.log('MASE: Lazy loading Color System...');
          await this._lazyLoadColorSystem();
        }
      }, { once: true });
    }
    
    // Typography tab - lazy load Typography
    const typographyTab = document.querySelector('[data-tab="typography"]');
    if (typographyTab) {
      typographyTab.addEventListener('click', async () => {
        if (!this.lazyLoadedModules.has('typography')) {
          console.log('MASE: Lazy loading Typography...');
          await this._lazyLoadTypography();
        }
      }, { once: true });
    }
    
    // Effects tab - lazy load Animations
    const effectsTab = document.querySelector('[data-tab="effects"]');
    if (effectsTab) {
      effectsTab.addEventListener('click', async () => {
        if (!this.lazyLoadedModules.has('animations')) {
          console.log('MASE: Lazy loading Animations...');
          await this._lazyLoadAnimations();
        }
      }, { once: true });
    }
    
    // Templates tab - lazy load Template Manager
    const templatesTab = document.querySelector('[data-tab="templates"]');
    if (templatesTab) {
      templatesTab.addEventListener('click', async () => {
        if (!this.lazyLoadedModules.has('templateManager')) {
          console.log('MASE: Lazy loading Template Manager...');
          await this._lazyLoadTemplateManager();
        }
      }, { once: true });
    }
  }
  
  /**
   * Lazy load Color System module
   * Task 18.2: Load Color System on demand when color tab clicked
   * Requirement 12.3
   * @private
   */
  async _lazyLoadColorSystem() {
    try {
      const module = await lazyLoadModules.loadColorSystem();
      
      this.registerModule('colorSystem', module, {
        description: 'Color management and accessibility',
        lazyLoaded: true,
      });
      
      this.lazyLoadedModules.add('colorSystem');
      console.log('MASE: Color System lazy loaded successfully');
      
      // Emit event
      eventBus.emit(EVENTS.MODULE_LOADED, {
        module: 'colorSystem',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('MASE: Failed to lazy load Color System:', error);
    }
  }
  
  /**
   * Lazy load Typography module
   * Task 18.2: Load Typography on demand when typography tab clicked
   * Requirement 12.3
   * @private
   */
  async _lazyLoadTypography() {
    try {
      const module = await lazyLoadModules.loadTypography();
      
      // Initialize the typography module
      if (module && typeof module.init === 'function') {
        module.init();
      }
      
      this.registerModule('typography', module, {
        description: 'Font loading and text scaling',
        lazyLoaded: true,
      });
      
      this.lazyLoadedModules.add('typography');
      console.log('MASE: Typography lazy loaded successfully');
      
      // Emit event
      eventBus.emit(EVENTS.MODULE_LOADED, {
        module: 'typography',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('MASE: Failed to lazy load Typography:', error);
    }
  }
  
  /**
   * Lazy load Animations module
   * Task 18.2: Load Animations on demand when effects tab clicked
   * Requirement 12.3
   * @private
   */
  async _lazyLoadAnimations() {
    try {
      const module = await lazyLoadModules.loadAnimations();
      
      this.registerModule('animations', module, {
        description: 'Visual effects and micro-interactions',
        lazyLoaded: true,
      });
      
      this.lazyLoadedModules.add('animations');
      console.log('MASE: Animations lazy loaded successfully');
      
      // Emit event
      eventBus.emit(EVENTS.MODULE_LOADED, {
        module: 'animations',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('MASE: Failed to lazy load Animations:', error);
    }
  }
  
  /**
   * Lazy load Template Manager module
   * @private
   */
  async _lazyLoadTemplateManager() {
    try {
      const module = await lazyLoadModules.loadTemplateManager();
      
      this.registerModule('templateManager', module, {
        description: 'Template management',
        lazyLoaded: true,
      });
      
      this.lazyLoadedModules.add('templateManager');
      console.log('MASE: Template Manager lazy loaded successfully');
      
      // Emit event
      eventBus.emit(EVENTS.MODULE_LOADED, {
        module: 'templateManager',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('MASE: Failed to lazy load Template Manager:', error);
    }
  }
  
  /**
   * Register a module
   * Task 16.1: Implement module registration system
   * Requirement 1.2
   * 
   * @param {string} name - Module name
   * @param {Object} module - Module instance
   * @param {Object} options - Registration options
   */
  registerModule(name, module, options = {}) {
    if (!name || typeof name !== 'string') {
      throw new Error('Module name must be a non-empty string');
    }
    
    if (!module || typeof module !== 'object') {
      throw new Error('Module must be an object');
    }
    
    if (this.modules.has(name)) {
      console.warn(`MASE: Module "${name}" is already registered, replacing...`);
    }
    
    this.modules.set(name, {
      instance: module,
      options: {
        required: options.required || false,
        dependencies: options.dependencies || [],
        ...options,
      },
    });
    
    console.log(`MASE: Module "${name}" registered successfully`);
  }
  
  /**
   * Get a registered module
   * Task 16.1: Implement module registration system
   * Requirement 1.2
   * 
   * @param {string} name - Module name
   * @returns {Object|null} Module instance or null
   */
  getModule(name) {
    const moduleData = this.modules.get(name);
    return moduleData ? moduleData.instance : null;
  }
  
  /**
   * Check if module is registered
   * 
   * @param {string} name - Module name
   * @returns {boolean} True if module is registered
   */
  hasModule(name) {
    return this.modules.has(name);
  }
  
  /**
   * Add lifecycle hook
   * Task 16.1: Create module lifecycle management
   * Requirement 1.1
   * 
   * @param {string} hook - Hook name (beforeInit, afterInit, beforeDestroy, afterDestroy)
   * @param {Function} callback - Callback function
   * @returns {Function} Function to remove the hook
   */
  addLifecycleHook(hook, callback) {
    if (!this.lifecycleHooks[hook]) {
      throw new Error(`Invalid lifecycle hook: ${hook}`);
    }
    
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }
    
    this.lifecycleHooks[hook].push(callback);
    
    // Return function to remove the hook
    return () => {
      const index = this.lifecycleHooks[hook].indexOf(callback);
      if (index > -1) {
        this.lifecycleHooks[hook].splice(index, 1);
      }
    };
  }
  
  /**
   * Execute lifecycle hooks
   * @private
   * @param {string} hook - Hook name
   * @param {*} data - Data to pass to hooks
   */
  async _executeLifecycleHooks(hook, data) {
    const hooks = this.lifecycleHooks[hook] || [];
    
    for (const callback of hooks) {
      try {
        await callback(data);
      } catch (error) {
        console.error(`MASE: Error in ${hook} hook:`, error);
      }
    }
  }
  
  /**
   * Initialize MASE Admin
   * 
   * Task 16.2: Implement module initialization sequence
   * Requirements: 1.1
   * 
   * Initialization sequence:
   * 1. Initialize State Manager first
   * 2. Initialize Event Bus second
   * 3. Initialize API Client third
   * 4. Load settings from server
   * 5. Initialize feature modules (Preview, Color, Typography, Animations)
   * 6. Setup UI event handlers
   * 7. Emit ready event
   */
  async init() {
    if (this.initialized) {
      console.warn('MASE: Already initialized');
      return;
    }
    
    try {
      console.log('MASE: Initializing modern architecture...');
      
      // Execute beforeInit hooks
      await this._executeLifecycleHooks('beforeInit', {});
      
      // Task 16.2: Initialize core modules in sequence
      
      // 1. Initialize State Manager first (Requirement 1.1)
      await this._initStateManager();
      
      // 2. Initialize Event Bus second (Requirement 1.1)
      await this._initEventBus();
      
      // 3. Initialize API Client third (Requirement 1.1)
      await this._initAPIClient();
      
      // 4. Load settings from server (Requirement 1.1)
      await this._loadSettings();
      
      // 5. Initialize feature modules based on feature flags (Task 16.3)
      await this._initFeatureModules();
      
      // 6. Setup UI event handlers (Requirement 1.1)
      await this._setupUIEventHandlers();
      
      // 7. Setup legacy compatibility layer (Task 16.4)
      this._setupLegacyCompatibility();
      
      this.initialized = true;
      console.log('MASE: Modern architecture initialized successfully');
      
      // Execute afterInit hooks
      await this._executeLifecycleHooks('afterInit', {
        modules: Array.from(this.modules.keys()),
      });
      
      // 8. Emit ready event (Requirement 1.1)
      eventBus.emit(EVENTS.MASE_READY, {
        modules: Array.from(this.modules.keys()),
        timestamp: Date.now(),
      });
      
    } catch (error) {
      console.error('MASE: Error during initialization:', error);
      this.initializationError = error;
      
      // Requirement 10.3: Add fallback logic if modern fails
      this.handleInitializationError(error);
    }
  }
  
  /**
   * Initialize State Manager
   * Task 16.2: Initialize State Manager first
   * @private
   */
  async _initStateManager() {
    console.log('MASE: Initializing State Manager...');
    
    try {
      // Register State Manager module
      this.registerModule('stateManager', useStore, {
        required: true,
        description: 'Centralized state management with undo/redo',
      });
      
      // Setup keyboard shortcuts for undo/redo
      setupKeyboardShortcuts();
      
      console.log('MASE: State Manager initialized successfully');
    } catch (error) {
      console.error('MASE: Failed to initialize State Manager:', error);
      throw error;
    }
  }
  
  /**
   * Initialize Event Bus
   * Task 16.2: Initialize Event Bus second
   * @private
   */
  async _initEventBus() {
    console.log('MASE: Initializing Event Bus...');
    
    try {
      // Register Event Bus module
      this.registerModule('eventBus', eventBus, {
        required: true,
        description: 'Decoupled module communication',
      });
      
      // Initialize Event Adapter (bridges legacy and modern)
      if (eventAdapter && typeof eventAdapter.init === 'function') {
        eventAdapter.init();
        this.registerModule('eventAdapter', eventAdapter, {
          description: 'Legacy-modern event bridge',
        });
      }
      
      console.log('MASE: Event Bus initialized successfully');
    } catch (error) {
      console.error('MASE: Failed to initialize Event Bus:', error);
      throw error;
    }
  }
  
  /**
   * Initialize API Client
   * Task 16.2: Initialize API Client third
   * @private
   */
  async _initAPIClient() {
    console.log('MASE: Initializing API Client...');
    
    try {
      // Register API Client module
      this.registerModule('apiClient', apiClient, {
        required: true,
        description: 'WordPress REST API communication',
      });
      
      console.log('MASE: API Client initialized successfully');
    } catch (error) {
      console.error('MASE: Failed to initialize API Client:', error);
      throw error;
    }
  }
  
  /**
   * Load settings from server
   * Task 16.2: Load settings from server
   * @private
   */
  async _loadSettings() {
    console.log('MASE: Loading settings from server...');
    
    try {
      const store = useStore.getState();
      await store.loadFromServer();
      
      console.log('MASE: Settings loaded successfully');
    } catch (error) {
      console.warn('MASE: Failed to load settings from server, using defaults:', error);
      // Don't throw - continue with default settings
    }
  }
  
  /**
   * Initialize feature modules
   * Task 16.2: Initialize feature modules
   * Task 18.2: Use lazy loading for feature modules
   * Requirements: 12.3
   * @private
   */
  async _initFeatureModules() {
    console.log('MASE: Initializing feature modules...');
    
    // Initialize Preview Engine eagerly as it's needed immediately
    await this._initPreviewEngine();
    
    // Initialize Palette Manager eagerly (needed for initial UI)
    await this._initPaletteManager();
    
    // Note: Color System, Typography, Animations, and Template Manager
    // are lazy loaded when their respective tabs are clicked (Task 18.2)
    // This reduces initial bundle size and improves load time (Requirement 12.3)
    
    console.log('MASE: Core feature modules initialized, others will lazy load on demand');
  }
  
  /**
   * Initialize Preview Engine module
   * Task 18.2: Load Preview Engine eagerly (needed immediately)
   * @private
   */
  async _initPreviewEngine() {
    try {
      console.log('MASE: Initializing Preview Engine...');
      
      // Load Preview Engine module
      const module = await lazyLoadModules.loadPreviewEngine();
      
      // Initialize the preview engine
      if (module && typeof module.init === 'function') {
        module.init();
      }
      
      // Register module
      this.registerModule('previewEngine', module, {
        description: 'Real-time CSS generation and preview',
      });
      
      // Enable preview by default if legacy was enabled
      if (window.MASE && window.MASE.state && window.MASE.state.livePreviewEnabled) {
        module.togglePreview(true);
      }
      
      console.log('MASE: Preview Engine initialized successfully');
    } catch (error) {
      console.error('MASE: Failed to initialize Preview Engine:', error);
    }
  }
  
  /**
   * Initialize Palette Manager
   * Task 18.2: Load Palette Manager eagerly (needed for initial UI)
   * @private
   */
  async _initPaletteManager() {
    try {
      console.log('MASE: Initializing Palette Manager...');
      
      // Load Palette Manager module
      const module = await lazyLoadModules.loadPaletteManager();
      
      // Register module
      this.registerModule('paletteManager', module, {
        description: 'Color palette management',
      });
      
      console.log('MASE: Palette Manager initialized successfully');
    } catch (error) {
      console.error('MASE: Failed to initialize Palette Manager:', error);
    }
  }
  
  /**
   * Setup UI event handlers
   * Task 16.2: Setup UI event handlers
   * @private
   */
  async _setupUIEventHandlers() {
    console.log('MASE: Setting up UI event handlers...');
    
    try {
      // Event handlers are set up by individual modules
      // This method is a placeholder for future centralized UI setup
      
      console.log('MASE: UI event handlers set up successfully');
    } catch (error) {
      console.error('MASE: Failed to setup UI event handlers:', error);
    }
  }
  
  /**
   * Setup legacy compatibility layer
   * Task 16.4: Implement legacy compatibility layer
   * Requirements: 10.1, 10.4, 10.5
   * 
   * Creates a global MASE object for backwards compatibility with plugins
   * that may depend on the legacy API.
   * @private
   */
  _setupLegacyCompatibility() {
    console.log('MASE: Setting up legacy compatibility layer...');
    
    try {
      // Create legacy API wrapper (Task 16.4)
      this.legacyAPI = this._createLegacyAPI();
      
      // Expose global MASE object for plugins (Task 16.4, Requirement 10.4)
      if (typeof window !== 'undefined') {
        // Preserve existing legacy MASE object if present
        const existingMASE = window.MASE || {};
        
        // Merge modern API with legacy
        window.MASE = {
          ...existingMASE,
          modern: this.legacyAPI,
          // Expose modules for debugging
          modules: this.modules,
          // Expose admin instance
          admin: this,
        };
        
        // Add deprecation warnings for legacy API usage (Task 16.4, Requirement 10.5)
        this._addDeprecationWarnings();
      }
      
      console.log('MASE: Legacy compatibility layer set up successfully');
    } catch (error) {
      console.error('MASE: Failed to setup legacy compatibility:', error);
    }
  }
  
  /**
   * Create legacy API wrapper
   * Task 16.4: Create legacy API wrapper for backwards compatibility
   * Requirement 10.4
   * @private
   * @returns {Object} Legacy API object
   */
  _createLegacyAPI() {
    const self = this;
    
    return {
      // State management
      getState: () => {
        const store = self.getModule('stateManager');
        return store ? store.getState() : null;
      },
      
      updateSettings: (path, value) => {
        const store = self.getModule('stateManager');
        if (store) {
          const state = store.getState();
          state.updateSettings(path, value);
        }
      },
      
      saveSettings: async () => {
        const store = self.getModule('stateManager');
        if (store) {
          const state = store.getState();
          return await state.saveToServer();
        }
      },
      
      // Preview control
      togglePreview: (enabled) => {
        const preview = self.getModule('previewEngine');
        if (preview && typeof preview.togglePreview === 'function') {
          preview.togglePreview(enabled);
        }
      },
      
      // Template operations
      applyTemplate: async (templateId) => {
        const templates = self.getModule('templateManager');
        if (templates) {
          return await templates.applyTemplate(templateId);
        }
      },
      
      // Palette operations
      applyPalette: async (paletteId) => {
        const palettes = self.getModule('paletteManager');
        if (palettes) {
          return await palettes.applyPalette(paletteId);
        }
      },
      
      // Event system
      on: (event, handler) => {
        const bus = self.getModule('eventBus');
        if (bus) {
          return bus.on(event, handler);
        }
      },
      
      emit: (event, data) => {
        const bus = self.getModule('eventBus');
        if (bus) {
          bus.emit(event, data);
        }
      },
      
      // Module access
      getModule: (name) => self.getModule(name),
      

    };
  }
  

  

  
  /**
   * Handle initialization errors
   * 
   * @param {Error} error - Initialization error
   */
  handleInitializationError(error) {
    console.error('MASE: Initialization failed:', error);
    
    // Track error for monitoring
    if (window.maseAdmin && window.maseAdmin.trackError) {
      window.maseAdmin.trackError('initialization_failed', {
        error: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Check if modern features are active
   * 
   * @returns {boolean} True if any modern features are active
   */
  isModernMode() {
    return this.modules.size > 0;
  }
  
  /**
   * Get all registered module names
   * 
   * @returns {string[]} Array of module names
   */
  getModuleNames() {
    return Array.from(this.modules.keys());
  }
  
  /**
   * Get module count
   * 
   * @returns {number} Number of registered modules
   */
  getModuleCount() {
    return this.modules.size;
  }
  

  
  /**
   * Get Event Bus instance
   * 
   * Provides access to Event Bus for external modules.
   * 
   * @returns {EventBus} Event Bus instance
   */
  getEventBus() {
    return eventBus;
  }
  
  /**
   * Get State Manager instance
   * 
   * Provides access to State Manager for external modules.
   * 
   * @returns {Object} State Manager instance
   */
  getStateManager() {
    return this.getModule('stateManager');
  }
  
  /**
   * Get API Client instance
   * 
   * Provides access to API Client for external modules.
   * 
   * @returns {Object} API Client instance
   */
  getAPIClient() {
    return this.getModule('apiClient');
  }
  
  /**
   * Get initialization status
   * 
   * @returns {Object} Initialization status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      error: this.initializationError,
      moduleCount: this.modules.size,
      modules: Array.from(this.modules.keys()),
      legacyCompatibility: this.legacyAPI !== null,
    };
  }
  
  /**
   * Destroy and cleanup
   * Task 16.1: Create module lifecycle management
   * Requirement 1.1
   */
  async destroy() {
    if (!this.initialized) {
      console.warn('MASE: Not initialized, nothing to destroy');
      return;
    }
    
    console.log('MASE: Destroying MASE Admin...');
    
    try {
      // Execute beforeDestroy hooks
      await this._executeLifecycleHooks('beforeDestroy', {});
      
      // Emit destroy event
      eventBus.emit(EVENTS.MASE_DESTROY, {
        timestamp: Date.now(),
      });
      
      // Destroy all modules in reverse order
      const moduleNames = Array.from(this.modules.keys()).reverse();
      
      for (const name of moduleNames) {
        const moduleData = this.modules.get(name);
        const module = moduleData.instance;
        
        if (module && typeof module.destroy === 'function') {
          try {
            await module.destroy();
            console.log(`MASE: Module "${name}" destroyed`);
          } catch (error) {
            console.error(`MASE: Error destroying module "${name}":`, error);
          }
        }
      }
      
      // Clear modules
      this.modules.clear();
      this.initialized = false;
      this.initializationError = null;
      
      // Clear legacy API
      if (typeof window !== 'undefined' && window.MASE) {
        delete window.MASE.modern;
        delete window.MASE.modules;
        delete window.MASE.admin;
      }
      
      // Execute afterDestroy hooks
      await this._executeLifecycleHooks('afterDestroy', {});
      
      console.log('MASE: MASE Admin destroyed successfully');
      
    } catch (error) {
      console.error('MASE: Error during destruction:', error);
      throw error;
    }
  }
}

/**
 * Global MASE Admin instance
 */
let maseAdminInstance = null;

/**
 * Initialize MASE Admin when DOM is ready
 * 
 * Task 16.2: Implement module initialization sequence
 * Requirements: 1.1
 */
if (typeof window !== 'undefined') {
  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMASE);
  } else {
    // DOM already loaded
    initializeMASE();
  }
}

/**
 * Initialize MASE function
 * 
 * Creates and initializes the MASE Admin instance.
 * Task 16.2: Implement module initialization sequence
 */
async function initializeMASE() {
  try {
    // Only initialize on MASE settings page
    if (!document.getElementById('mase-settings-form')) {
      console.log('MASE: Not on settings page, skipping initialization');
      return;
    }
    
    // Initialize UI components first (color pickers, sliders, etc.)
    initializeUI();
    
    console.log('MASE: Starting initialization...');
    
    // Create instance
    maseAdminInstance = new MASEAdmin();
    
    // Initialize (Task 16.2)
    await maseAdminInstance.init();
    
    // Expose globally for debugging and external access
    if (typeof window !== 'undefined') {
      // Always expose for plugins that may need it
      window.maseAdmin = maseAdminInstance;
      window.maseEventBus = eventBus; // Expose event bus for UI components
      
      // Additional debug exposure in dev mode
      if (window.maseAdmin?.debug) {
        window.maseModern = maseAdminInstance;
        console.log('MASE: Debug mode enabled - instance available as window.maseAdmin and window.maseModern');
      }
    }
    
    console.log('MASE: Initialization complete');
    
  } catch (error) {
    console.error('MASE: Failed to initialize modern architecture:', error);
    
    // Track error for monitoring
    if (window.maseAdmin && window.maseAdmin.trackError) {
      window.maseAdmin.trackError('initialization_failed', {
        error: error.message,
        stack: error.stack,
        timestamp: Date.now(),
      });
    }
  }
}

/**
 * Export singleton instance getter
 * 
 * @returns {MASEAdmin|null} MASE Admin instance or null
 */
export function getMASEAdmin() {
  return maseAdminInstance;
}

/**
 * Check if MASE Admin is initialized
 * 
 * @returns {boolean} True if initialized
 */
export function isInitialized() {
  return maseAdminInstance !== null && maseAdminInstance.initialized;
}

/**
 * Get initialization status
 * 
 * @returns {Object} Status object
 */
export function getStatus() {
  if (!maseAdminInstance) {
    return {
      initialized: false,
      error: null,
      moduleCount: 0,
      modules: [],
    };
  }
  
  return maseAdminInstance.getStatus();
}

/**
 * Reinitialize MASE Admin
 * Useful for testing or recovery from errors
 * 
 * @returns {Promise<void>}
 */
export async function reinitialize() {
  if (maseAdminInstance) {
    await maseAdminInstance.destroy();
    maseAdminInstance = null;
  }
  
  await initializeMASE();
}

export default MASEAdmin;
