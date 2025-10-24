/**
 * Typography Module
 * 
 * Font loading, text scaling, and typography management.
 * Handles Google Fonts loading with caching and fallbacks.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 * 
 * @module typography
 */

import { useStore } from './state-manager.js';
import eventBus from './event-bus.js';

/**
 * Typography Class
 * 
 * Manages font loading, caching, and fluid typography calculations.
 * Integrates with Font Loading API for optimal performance.
 */
export class Typography {
  /**
   * Constructor
   * 
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      cacheExpiration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      loadTimeout: 3000, // 3 seconds timeout
      googleFontsApiUrl: 'https://fonts.googleapis.com/css2',
      cacheVersion: window.maseData?.version || '1.0.0', // Version for cache invalidation
      ...options,
    };
    
    // Track loaded fonts
    this.loadedFonts = new Set();
    this.loadingFonts = new Map(); // font -> Promise
    this.fontCache = this.initializeCache();
    
    // Font Loading API support detection
    this.supportsFontLoadingAPI = 'fonts' in document;
    
    // Unsubscribe function for state changes
    this.unsubscribe = null;
    
    // System font stacks
    this.systemFontStacks = {
      system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
      serif: 'Georgia, "Times New Roman", Times, serif',
      monospace: 'Menlo, Monaco, Consolas, "Courier New", monospace',
    };
  }
  
  /**
   * Initialize font cache from localStorage
   * Requirement 6.4: Implement font caching in localStorage
   * Task 19.1: Cache invalidation on version change
   * 
   * @returns {Object} Font cache object
   */
  initializeCache() {
    try {
      const cached = localStorage.getItem('mase_font_cache');
      if (cached) {
        const cache = JSON.parse(cached);
        
        // Check if cache version matches current version (Task 19.1)
        if (cache.version !== this.options.cacheVersion) {
          console.log('MASE Typography: Cache version mismatch, invalidating cache');
          this.clearCache();
          return {
            fonts: {},
            timestamp: Date.now(),
            version: this.options.cacheVersion,
          };
        }
        
        // Check if cache is expired (7-day expiration)
        if (cache.timestamp && Date.now() - cache.timestamp < this.options.cacheExpiration) {
          return cache;
        } else {
          console.log('MASE Typography: Cache expired, clearing');
        }
      }
    } catch (error) {
      console.warn('MASE Typography: Failed to load font cache:', error);
    }
    
    return {
      fonts: {},
      timestamp: Date.now(),
      version: this.options.cacheVersion,
    };
  }
  
  /**
   * Save font cache to localStorage
   * Requirement 6.4: Cache loaded fonts in browser storage for 7 days
   * Task 19.1: Include version in cache for invalidation
   */
  saveCache() {
    try {
      this.fontCache.timestamp = Date.now();
      this.fontCache.version = this.options.cacheVersion;
      localStorage.setItem('mase_font_cache', JSON.stringify(this.fontCache));
    } catch (error) {
      console.warn('MASE Typography: Failed to save font cache:', error);
    }
  }
  
  /**
   * Initialize the Typography module
   * 
   * Sets up state subscriptions and loads initial fonts.
   */
  init() {
    // Subscribe to typography state changes
    this.subscribeToStateChanges();
    
    // Load initial fonts from state
    const state = useStore.getState();
    if (state.settings.typography) {
      this.loadFontsFromSettings(state.settings.typography);
    }
    
    eventBus.emit('typography:initialized');
  }
  
  /**
   * Subscribe to typography state changes
   * Requirement 6.1: Subscribe to typography state changes
   */
  subscribeToStateChanges() {
    // Debounce timer for rapid updates
    let debounceTimer = null;
    const debounceDelay = 300; // 300ms debounce
    
    this.unsubscribe = useStore.subscribe(
      (state) => state.settings.typography,
      (typography, previousTypography) => {
        // Debounce rapid updates
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        
        debounceTimer = setTimeout(() => {
          this.loadFontsFromSettings(typography);
        }, debounceDelay);
      }
    );
  }
  
  /**
   * Load fonts from typography settings
   * 
   * @param {Object} typography - Typography settings
   */
  async loadFontsFromSettings(typography) {
    try {
      // Load Google Fonts if specified
      if (typography.google_fonts && typography.enabled) {
        await this.loadGoogleFont(typography.google_fonts);
      }
      
      // Load custom fonts for each area
      const areas = ['admin_bar', 'admin_menu', 'content'];
      for (const area of areas) {
        if (typography[area] && typography[area].font_family) {
          const family = typography[area].font_family;
          
          // Skip system fonts
          if (family === 'system' || family === 'serif' || family === 'monospace') {
            continue;
          }
          
          // Load custom font
          await this.loadFont(family);
        }
      }
      
      eventBus.emit('typography:fonts-loaded', {
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('MASE Typography: Error loading fonts from settings:', error);
      eventBus.emit('typography:error', { error, phase: 'load-from-settings' });
    }
  }
  
  /**
   * Load a font family
   * Requirement 6.1: Implement Font Loading API integration
   * Requirement 6.2: Add 3-second timeout with fallback
   * 
   * @param {string} family - Font family name
   * @param {Array<number>} weights - Font weights to load (default: [400])
   * @returns {Promise<void>}
   */
  async loadFont(family, weights = [400]) {
    // Check if already loaded
    if (this.loadedFonts.has(family)) {
      return Promise.resolve();
    }
    
    // Check if currently loading
    if (this.loadingFonts.has(family)) {
      return this.loadingFonts.get(family);
    }
    
    // Check cache
    if (this.fontCache.fonts[family]) {
      this.loadedFonts.add(family);
      return Promise.resolve();
    }
    
    // Create loading promise
    const loadingPromise = this.loadFontWithTimeout(family, weights);
    this.loadingFonts.set(family, loadingPromise);
    
    try {
      await loadingPromise;
      this.loadedFonts.add(family);
      
      // Update cache
      this.fontCache.fonts[family] = {
        weights,
        timestamp: Date.now(),
      };
      this.saveCache();
      
      eventBus.emit('typography:font-loaded', { family, weights });
    } catch (error) {
      console.warn(`MASE Typography: Failed to load font ${family}:`, error);
      eventBus.emit('typography:font-load-failed', { family, error });
    } finally {
      this.loadingFonts.delete(family);
    }
  }
  
  /**
   * Load font with timeout
   * Requirement 6.2: Add 3-second timeout with fallback
   * 
   * @param {string} family - Font family name
   * @param {Array<number>} weights - Font weights
   * @returns {Promise<void>}
   */
  async loadFontWithTimeout(family, weights) {
    return Promise.race([
      this.loadFontInternal(family, weights),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Font loading timeout')), this.options.loadTimeout)
      ),
    ]);
  }
  
  /**
   * Internal font loading implementation
   * 
   * @param {string} family - Font family name
   * @param {Array<number>} weights - Font weights
   * @returns {Promise<void>}
   */
  async loadFontInternal(family, weights) {
    if (this.supportsFontLoadingAPI) {
      // Use Font Loading API
      const promises = weights.map(weight => {
        const fontFace = new FontFace(family, `local("${family}")`, { weight });
        return fontFace.load().then(loadedFace => {
          document.fonts.add(loadedFace);
        });
      });
      
      await Promise.all(promises);
    } else {
      // Fallback: Create style element with @font-face
      // This is a simplified fallback - in production, you'd load from Google Fonts
      console.warn('MASE Typography: Font Loading API not supported, using fallback');
    }
  }
  
  /**
   * Load Google Font
   * Requirement 6.1: Create Google Fonts loader
   * Requirement 6.2: Asynchronous loading without blocking page render
   * 
   * @param {string} fontSpec - Google Fonts specification (e.g., "Inter:300,400,500,600,700")
   * @returns {Promise<void>}
   */
  async loadGoogleFont(fontSpec) {
    if (!fontSpec) {
      return Promise.resolve();
    }
    
    // Parse font specification
    const [family, weightsStr] = fontSpec.split(':');
    const weights = weightsStr ? weightsStr.split(',').map(w => parseInt(w)) : [400];
    
    // Check if already loaded
    if (this.loadedFonts.has(family)) {
      return Promise.resolve();
    }
    
    // Check if currently loading
    if (this.loadingFonts.has(family)) {
      return this.loadingFonts.get(family);
    }
    
    // Check cache
    if (this.fontCache.fonts[family]) {
      this.loadedFonts.add(family);
      return Promise.resolve();
    }
    
    // Create loading promise
    const loadingPromise = this.loadGoogleFontInternal(family, weights);
    this.loadingFonts.set(family, loadingPromise);
    
    try {
      await loadingPromise;
      this.loadedFonts.add(family);
      
      // Update cache
      this.fontCache.fonts[family] = {
        weights,
        source: 'google',
        timestamp: Date.now(),
      };
      this.saveCache();
      
      eventBus.emit('typography:google-font-loaded', { family, weights });
    } catch (error) {
      console.warn(`MASE Typography: Failed to load Google Font ${family}:`, error);
      eventBus.emit('typography:font-load-failed', { family, error, source: 'google' });
    } finally {
      this.loadingFonts.delete(family);
    }
  }
  
  /**
   * Internal Google Font loading implementation
   * 
   * @param {string} family - Font family name
   * @param {Array<number>} weights - Font weights
   * @returns {Promise<void>}
   */
  async loadGoogleFontInternal(family, weights) {
    return new Promise((resolve, reject) => {
      // Create link element for Google Fonts
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${this.options.googleFontsApiUrl}?family=${encodeURIComponent(family)}:wght@${weights.join(';')}&display=swap`;
      
      // Set timeout
      const timeout = setTimeout(() => {
        reject(new Error('Google Font loading timeout'));
      }, this.options.loadTimeout);
      
      // Handle load success
      link.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      // Handle load error
      link.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Google Font loading failed'));
      };
      
      // Append to head
      document.head.appendChild(link);
    });
  }
  
  /**
   * Get font stack with fallbacks
   * Requirement 6.5: Create font stack generator with fallbacks
   * 
   * @param {string} family - Primary font family
   * @returns {string} Complete font stack
   */
  getFontStack(family) {
    // Check if it's a system font keyword
    if (this.systemFontStacks[family]) {
      return this.systemFontStacks[family];
    }
    
    // Build font stack with fallbacks
    const fallback = this.systemFontStacks.system;
    
    // Quote family name if it contains spaces
    const quotedFamily = family.includes(' ') ? `"${family}"` : family;
    
    return `${quotedFamily}, ${fallback}`;
  }
  
  /**
   * Check if font is loaded
   * Requirement 6.5: Implement font loaded status checking
   * 
   * @param {string} family - Font family name
   * @returns {boolean} True if font is loaded
   */
  isFontLoaded(family) {
    return this.loadedFonts.has(family);
  }
  
  /**
   * Calculate fluid typography size
   * Requirement 6.3: Create fluid size calculation using clamp()
   * 
   * @param {number} minSize - Minimum font size in px
   * @param {number} maxSize - Maximum font size in px
   * @param {number} minViewport - Minimum viewport width in px (default: 320)
   * @param {number} maxViewport - Maximum viewport width in px (default: 1920)
   * @returns {string} CSS clamp() value
   */
  calculateFluidSize(minSize, maxSize, minViewport = 320, maxViewport = 1920) {
    // Calculate slope
    const slope = (maxSize - minSize) / (maxViewport - minViewport);
    
    // Calculate y-intercept
    const yIntercept = minSize - slope * minViewport;
    
    // Build clamp() expression
    // clamp(min, preferred, max)
    const preferred = `${yIntercept.toFixed(4)}px + ${(slope * 100).toFixed(4)}vw`;
    
    return `clamp(${minSize}px, ${preferred}, ${maxSize}px)`;
  }
  
  /**
   * Generate fluid typography CSS
   * Requirement 6.3: Generate responsive typography CSS
   * 
   * @param {Object} settings - Typography settings
   * @returns {string} Fluid typography CSS
   */
  generateFluidCSS(settings) {
    let css = '';
    
    // Admin bar fluid typography
    if (settings.admin_bar && settings.admin_bar.font_size) {
      const minSize = Math.max(11, settings.admin_bar.font_size - 2);
      const maxSize = settings.admin_bar.font_size + 1;
      const fluidSize = this.calculateFluidSize(minSize, maxSize);
      
      css += `body.wp-admin #wpadminbar{font-size:${fluidSize}!important;}`;
    }
    
    // Admin menu fluid typography
    if (settings.admin_menu && settings.admin_menu.font_size) {
      const minSize = Math.max(11, settings.admin_menu.font_size - 2);
      const maxSize = settings.admin_menu.font_size + 1;
      const fluidSize = this.calculateFluidSize(minSize, maxSize);
      
      css += `body.wp-admin #adminmenu a{font-size:${fluidSize}!important;}`;
    }
    
    // Content fluid typography
    if (settings.content && settings.content.font_size) {
      const minSize = Math.max(12, settings.content.font_size - 2);
      const maxSize = settings.content.font_size + 2;
      const fluidSize = this.calculateFluidSize(minSize, maxSize);
      
      css += `body.wp-admin #wpbody-content{font-size:${fluidSize}!important;}`;
    }
    
    return css;
  }
  
  /**
   * Apply typography settings
   * Requirement 6.1: Trigger font loading on changes
   * 
   * @param {Object} settings - Typography settings
   */
  async applyTypography(settings) {
    try {
      // Load fonts
      await this.loadFontsFromSettings(settings);
      
      // Generate and apply CSS
      const css = this.generateFluidCSS(settings);
      
      // Emit event for preview engine to pick up
      eventBus.emit('typography:applied', {
        css,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('MASE Typography: Error applying typography:', error);
      eventBus.emit('typography:error', { error, phase: 'apply' });
    }
  }
  
  /**
   * Clear font cache
   * Task 19.1: Reset cache with current version
   */
  clearCache() {
    try {
      localStorage.removeItem('mase_font_cache');
      this.fontCache = {
        fonts: {},
        timestamp: Date.now(),
        version: this.options.cacheVersion,
      };
      
      eventBus.emit('typography:cache-cleared');
    } catch (error) {
      console.warn('MASE Typography: Failed to clear font cache:', error);
    }
  }
  
  /**
   * Destroy the Typography module
   * 
   * Cleans up subscriptions and resources.
   */
  destroy() {
    // Unsubscribe from state changes
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    
    // Clear loading promises
    this.loadingFonts.clear();
    
    eventBus.emit('typography:destroyed');
  }
}

// Create and export singleton instance
const typography = new Typography();
export default typography;
