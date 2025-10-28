/**
 * Preview Engine Module
 * 
 * Handles real-time CSS generation and DOM injection for live preview functionality.
 * Migrated from legacy mase-admin.js livePreview module.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4
 * 
 * @package MASE
 * @since 2.0.0
 */

import { useStore } from './state-manager.js';
import eventBus from './event-bus.js';
import typography from './typography.js';

/**
 * PreviewEngine Class
 * 
 * Generates CSS from application state and injects it into the DOM
 * for real-time preview of styling changes.
 */
class PreviewEngine {
  /**
   * Constructor
   */
  constructor() {
    this.styleElementId = 'mase-live-preview-css';
    this.styleElement = null;
    this.isActive = false;
    this.unsubscribe = null;
    
    // CSS generation pipeline
    this.pipeline = [
      this.generateAdminBarCSS.bind(this),
      this.generateAdminMenuCSS.bind(this),
      this.generateTypographyCSS.bind(this),
      this.generateVisualEffectsCSS.bind(this)
    ];
    
    // Cache for incremental updates
    // Requirement 3.3: Implement incremental CSS updates
    // Task 19.3: Cache generated CSS for unchanged settings
    this.cssCache = {
      adminBar: '',
      adminMenu: '',
      typography: '',
      visualEffects: '',
      full: '', // Full CSS cache
      settingsHash: null, // Hash of settings for cache validation
    };
    
    // Previous settings for change detection
    this.previousSettings = null;
    
    // Cache statistics
    this.cacheStats = {
      hits: 0,
      misses: 0,
      generations: 0,
    };
  }
  
  /**
   * Initialize the Preview Engine
   * 
   * Sets up the style element and subscribes to state changes.
   * Requirement 3.1: Initialize preview system
   * Task 19.3: Subscribe to settings reset events
   */
  init() {
    // Create style element if it doesn't exist
    this.styleElement = document.getElementById(this.styleElementId);
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.id = this.styleElementId;
      this.styleElement.type = 'text/css';
      document.head.appendChild(this.styleElement);
    }
    
    // Subscribe to state changes
    this.subscribeToStateChanges();
    
    // Subscribe to settings reset events (Task 19.3)
    eventBus.on('settings:reset', () => {
      this.clearCSSCache();
    });
    
    eventBus.on('settings:reset-complete', () => {
      this.clearCSSCache();
    });
    
    // Emit initialization event
    eventBus.emit('preview:initialized');
  }
  
  /**
   * Subscribe to state changes
   * 
   * Listens for relevant state changes and triggers CSS regeneration.
   * Implements debouncing for rapid updates.
   * 
   * Requirement 3.2: Subscribe to state changes
   * Requirement 4.2: Trigger CSS regeneration on relevant changes
   * Requirement 3.5: Debounce rapid updates for performance
   */
  subscribeToStateChanges() {
    // Debounce timer for rapid updates
    let debounceTimer = null;
    const debounceDelay = 100; // 100ms debounce
    
    // Subscribe to settings changes in the store
    this.unsubscribe = useStore.subscribe(
      (state) => state.settings,
      (settings, previousSettings) => {
        // Only regenerate if preview is active
        if (!this.isActive) {
          return;
        }
        
        // Debounce rapid updates
        // Requirement 3.5: Debounce rapid updates for performance
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        
        debounceTimer = setTimeout(() => {
          try {
            this.update(settings);
            
            // Emit state change event
            eventBus.emit('preview:state-changed', {
              timestamp: Date.now(),
              hasChanges: true
            });
          } catch (error) {
            console.error('MASE Preview Engine: Error updating from state change:', error);
            eventBus.emit('preview:error', { 
              error, 
              phase: 'state-update' 
            });
          }
        }, debounceDelay);
      }
    );
  }
  
  /**
   * Generate hash of settings for cache validation
   * Task 19.3: Cache generated CSS for unchanged settings
   * 
   * @param {Object} settings - Settings object
   * @returns {string} Hash of settings
   */
  generateSettingsHash(settings) {
    // Simple hash function for settings
    const str = JSON.stringify(settings);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }
  
  /**
   * Generate CSS from settings
   * 
   * Runs the CSS generation pipeline to create complete CSS output.
   * Supports incremental updates for better performance.
   * 
   * Requirement 3.1: Generate CSS from current state
   * Requirement 3.2: Sub-50ms CSS generation
   * Requirement 3.3: Implement incremental CSS updates
   * Task 19.3: Cache generated CSS for unchanged settings
   * 
   * @param {Object} settings - Settings object from state
   * @param {boolean} forceFullGeneration - Force full CSS generation (skip incremental)
   * @returns {string} Generated CSS
   */
  generateCSS(settings, forceFullGeneration = false) {
    const startTime = performance.now();
    
    try {
      // Check if settings haven't changed (Task 19.3)
      const settingsHash = this.generateSettingsHash(settings);
      if (!forceFullGeneration && this.cssCache.settingsHash === settingsHash && this.cssCache.full) {
        this.cacheStats.hits++;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('MASE Preview Engine: Using cached CSS (cache hit)');
        }
        
        return this.cssCache.full;
      }
      
      this.cacheStats.misses++;
      this.cacheStats.generations++;
      
      let css = '';
      
      // Incremental update: only regenerate changed sections
      if (!forceFullGeneration && this.previousSettings) {
        css += this.generateIncrementalCSS(settings);
      } else {
        // Full generation
        css += this.generateAdminBarCSS(settings);
        css += this.generateAdminMenuCSS(settings);
        css += this.generateTypographyCSS(settings);
        css += this.generateVisualEffectsCSS(settings);
        
        // Update cache
        this.cssCache.adminBar = this.generateAdminBarCSS(settings);
        this.cssCache.adminMenu = this.generateAdminMenuCSS(settings);
        this.cssCache.typography = this.generateTypographyCSS(settings);
        this.cssCache.visualEffects = this.generateVisualEffectsCSS(settings);
      }
      
      // Store current settings for next comparison
      this.previousSettings = JSON.parse(JSON.stringify(settings));
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log performance in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log(`MASE Preview Engine: CSS generated in ${duration.toFixed(2)}ms`);
        
        // Warn if generation exceeds 50ms requirement
        if (duration > 50) {
          console.warn(`MASE Preview Engine: CSS generation exceeded 50ms target (${duration.toFixed(2)}ms)`);
        }
      }
      
      // Minify CSS in production
      // Requirement 3.3: Add CSS minification for production
      if (process.env.NODE_ENV === 'production') {
        css = this.minifyCSS(css);
      }
      
      // Cache the generated CSS (Task 19.3)
      this.cssCache.full = css;
      this.cssCache.settingsHash = settingsHash;
      
      return css;
    } catch (error) {
      console.error('MASE Preview Engine: Error generating CSS:', error);
      eventBus.emit('preview:error', { error, phase: 'generation' });
      return '';
    }
  }
  
  /**
   * Generate incremental CSS updates
   * 
   * Only regenerates CSS for sections that have changed.
   * Requirement 3.3: Implement incremental CSS updates (only changed sections)
   * 
   * @param {Object} settings - Current settings
   * @returns {string} Generated CSS
   */
  generateIncrementalCSS(settings) {
    let css = '';
    
    // Check which sections changed
    const adminBarChanged = JSON.stringify(settings.admin_bar) !== 
                           JSON.stringify(this.previousSettings.admin_bar);
    const adminMenuChanged = JSON.stringify(settings.admin_menu) !== 
                            JSON.stringify(this.previousSettings.admin_menu);
    const typographyChanged = JSON.stringify(settings.typography) !== 
                             JSON.stringify(this.previousSettings.typography);
    const visualEffectsChanged = JSON.stringify(settings.visual_effects) !== 
                                JSON.stringify(this.previousSettings.visual_effects);
    
    // Regenerate only changed sections
    if (adminBarChanged) {
      this.cssCache.adminBar = this.generateAdminBarCSS(settings);
    }
    if (adminMenuChanged) {
      this.cssCache.adminMenu = this.generateAdminMenuCSS(settings);
    }
    if (typographyChanged) {
      this.cssCache.typography = this.generateTypographyCSS(settings);
    }
    if (visualEffectsChanged) {
      this.cssCache.visualEffects = this.generateVisualEffectsCSS(settings);
    }
    
    // Combine all cached CSS
    css = this.cssCache.adminBar + 
          this.cssCache.adminMenu + 
          this.cssCache.typography + 
          this.cssCache.visualEffects;
    
    return css;
  }
  
  /**
   * Minify CSS
   * 
   * Removes whitespace and comments for production builds.
   * Requirement 3.3: Add CSS minification for production
   * 
   * @param {string} css - CSS to minify
   * @returns {string} Minified CSS
   */
  minifyCSS(css) {
    return css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove whitespace around selectors and properties
      .replace(/\s*([{}:;,])\s*/g, '$1')
      // Remove newlines
      .replace(/\n/g, '')
      // Remove multiple spaces
      .replace(/\s+/g, ' ')
      // Trim
      .trim();
  }
  
  /**
   * Generate CSS custom properties
   * 
   * Creates CSS custom properties (variables) for dynamic theming.
   * Requirement 3.3: Add CSS custom properties for dynamic theming
   * 
   * @param {Object} settings - Settings object
   * @returns {string} CSS custom properties
   */
  generateCSSCustomProperties(settings) {
    const adminBar = settings.admin_bar || {};
    const adminMenu = settings.admin_menu || {};
    
    let css = ':root{';
    
    // Admin bar custom properties
    if (adminBar.bg_color) {
      css += `--mase-admin-bar-bg:${adminBar.bg_color};`;
    }
    if (adminBar.text_color) {
      css += `--mase-admin-bar-text:${adminBar.text_color};`;
    }
    if (adminBar.height) {
      css += `--mase-admin-bar-height:${adminBar.height}px;`;
    }
    
    // Admin menu custom properties
    if (adminMenu.bg_color) {
      css += `--mase-admin-menu-bg:${adminMenu.bg_color};`;
    }
    if (adminMenu.text_color) {
      css += `--mase-admin-menu-text:${adminMenu.text_color};`;
    }
    if (adminMenu.hover_bg_color) {
      css += `--mase-admin-menu-hover-bg:${adminMenu.hover_bg_color};`;
    }
    if (adminMenu.hover_text_color) {
      css += `--mase-admin-menu-hover-text:${adminMenu.hover_text_color};`;
    }
    if (adminMenu.width) {
      css += `--mase-admin-menu-width:${adminMenu.width}px;`;
    }
    
    css += '}';
    
    return css;
  }
  
  /**
   * Apply CSS to the DOM
   * 
   * Injects generated CSS into the style element.
   * Creates the style element if it doesn't exist.
   * 
   * Requirement 3.2: Inject generated CSS into DOM without page reload
   * Requirement 3.4: Create style element injection logic
   * 
   * @param {string} css - CSS string to apply
   */
  applyCSS(css) {
    try {
      // Ensure style element exists
      if (!this.styleElement) {
        this.styleElement = document.getElementById(this.styleElementId);
        
        // Create if still doesn't exist
        if (!this.styleElement) {
          this.styleElement = document.createElement('style');
          this.styleElement.id = this.styleElementId;
          this.styleElement.type = 'text/css';
          document.head.appendChild(this.styleElement);
        }
      }
      
      // Inject CSS
      this.styleElement.textContent = css;
      
      // Emit event for successful CSS application
      eventBus.emit('preview:applied', { 
        cssLength: css.length,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('MASE Preview Engine: Error applying CSS:', error);
      eventBus.emit('preview:error', { error, phase: 'application' });
    }
  }
  
  /**
   * Update preview with current settings
   * 
   * Generates and applies CSS from the provided settings.
   * Emits update event for tracking.
   * 
   * Requirement 4.2: Trigger CSS regeneration on relevant changes
   * 
   * @param {Object} settings - Settings object from state
   */
  update(settings) {
    const startTime = performance.now();
    
    try {
      const css = this.generateCSS(settings);
      this.applyCSS(css);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Emit update event
      eventBus.emit('preview:updated', {
        duration,
        cssLength: css.length,
        timestamp: Date.now()
      });
      
      // Warn if update is slow
      if (duration > 50 && process.env.NODE_ENV === 'development') {
        console.warn(`MASE Preview Engine: Update took ${duration.toFixed(2)}ms (target: <50ms)`);
      }
    } catch (error) {
      console.error('MASE Preview Engine: Error during update:', error);
      eventBus.emit('preview:error', { error, phase: 'update' });
    }
  }
  
  /**
   * Force update preview
   * 
   * Manually triggers a preview update with current state.
   * Useful for external triggers or refresh actions.
   * 
   * @param {boolean} forceFullGeneration - Force full CSS regeneration
   */
  forceUpdate(forceFullGeneration = false) {
    if (!this.isActive) {
      console.warn('MASE Preview Engine: Cannot force update - preview is not active');
      return;
    }
    
    const settings = useStore.getState().settings;
    
    if (forceFullGeneration) {
      // Clear cache to force full regeneration
      this.previousSettings = null;
      this.cssCache = {
        adminBar: '',
        adminMenu: '',
        typography: '',
        visualEffects: ''
      };
    }
    
    this.update(settings);
    
    eventBus.emit('preview:force-updated', {
      forceFullGeneration,
      timestamp: Date.now()
    });
  }
  
  /**
   * Toggle preview mode
   * 
   * Enables or disables live preview functionality.
   * Updates UI state and manages CSS injection.
   * 
   * Requirement 3.4: Implement preview mode toggle
   * Requirement 3.4: Add preview state management
   * 
   * @param {boolean} enabled - Whether preview should be enabled
   */
  togglePreview(enabled) {
    const previousState = this.isActive;
    this.isActive = enabled;
    
    if (enabled) {
      // Generate and apply CSS immediately
      const settings = useStore.getState().settings;
      this.update(settings);
      
      // Update UI state
      this.updatePreviewUI(true);
      
      eventBus.emit('preview:enabled', { 
        previousState,
        timestamp: Date.now()
      });
    } else {
      // Clear preview CSS
      this.clearPreview();
      
      // Update UI state
      this.updatePreviewUI(false);
      
      eventBus.emit('preview:disabled', { 
        previousState,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Update preview UI state
   * 
   * Updates UI elements to reflect preview state.
   * Requirement 3.4: Add preview state management
   * 
   * @param {boolean} enabled - Whether preview is enabled
   */
  updatePreviewUI(enabled) {
    // Update body class for CSS targeting
    if (enabled) {
      document.body.classList.add('mase-preview-active');
    } else {
      document.body.classList.remove('mase-preview-active');
    }
    
    // Update preview toggle button if it exists
    const toggleButton = document.getElementById('mase-preview-toggle');
    if (toggleButton) {
      toggleButton.setAttribute('aria-pressed', enabled.toString());
      toggleButton.classList.toggle('active', enabled);
    }
  }
  
  /**
   * Check if preview is active
   * 
   * @returns {boolean} Whether preview is currently active
   */
  isPreviewActive() {
    return this.isActive;
  }
  
  /**
   * Clear preview and restore defaults
   * 
   * Removes all preview CSS from the DOM and resets cache.
   * Requirement 3.4: Implement clear preview functionality
   * Task 19.3: Clear cache on settings reset
   */
  clearPreview() {
    if (this.styleElement) {
      this.styleElement.textContent = '';
    }
    
    // Clear CSS cache (Task 19.3)
    this.clearCSSCache();
    
    eventBus.emit('preview:cleared', { 
      timestamp: Date.now()
    });
  }
  
  /**
   * Clear CSS cache
   * Task 19.3: Clear cache on settings reset
   * Requirement 3.3, 12.2
   */
  clearCSSCache() {
    this.cssCache = {
      adminBar: '',
      adminMenu: '',
      typography: '',
      visualEffects: '',
      full: '',
      settingsHash: null,
    };
    
    // Clear previous settings
    this.previousSettings = null;
    
    // Reset cache stats
    this.cacheStats = {
      hits: 0,
      misses: 0,
      generations: 0,
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('MASE Preview Engine: CSS cache cleared');
    }
    
    eventBus.emit('preview:cache-cleared', {
      timestamp: Date.now(),
    });
  }
  
  /**
   * Get CSS cache statistics
   * Task 19.3: Expose cache stats for monitoring
   * 
   * @returns {Object} Cache statistics
   */
  getCSSCacheStats() {
    const hitRate = this.cacheStats.hits + this.cacheStats.misses > 0
      ? (this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses) * 100).toFixed(2)
      : 0;
    
    return {
      ...this.cacheStats,
      hitRate: `${hitRate}%`,
      cacheSize: this.cssCache.full.length,
      hasCachedCSS: !!this.cssCache.full,
    };
  }
  
  /**
   * Destroy the Preview Engine
   * 
   * Cleans up subscriptions and removes style element.
   */
  destroy() {
    // Unsubscribe from state changes
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    
    // Remove style element
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = null;
    }
    
    this.isActive = false;
    eventBus.emit('preview:destroyed');
  }
  
  /**
   * Generate Admin Bar CSS
   * 
   * Generates CSS for WordPress admin bar styling.
   * Migrated from legacy mase-admin.js generateAdminBarCSS.
   * 
   * Requirement 3.2: Migrate color variable generation
   * 
   * @param {Object} settings - Settings object
   * @returns {string} Admin bar CSS
   */
  generateAdminBarCSS(settings) {
    const adminBar = settings.admin_bar || {};
    const visualEffects = settings.visual_effects || {};
    const adminBarEffects = visualEffects.admin_bar || {};
    
    let css = '';
    
    // Get admin bar height (default 32px)
    const height = adminBar.height || 32;
    
    // Base positioning (always applied)
    css += `body.wp-admin #wpadminbar{
      position:fixed!important;
      top:0!important;
      left:0!important;
      right:0!important;
      z-index:99999!important;`;
    
    if (adminBar.bg_color) {
      css += `background-color:${adminBar.bg_color}!important;`;
    }
    if (adminBar.height) {
      css += `height:${adminBar.height}px!important;`;
    }
    css += '}';
    
    // Adjust body padding to match admin bar height
    css += `html.wp-toolbar{
      padding-top:${height}px!important;
    }`;
    
    // Admin bar text color
    if (adminBar.text_color) {
      css += `body.wp-admin #wpadminbar .ab-item,
        body.wp-admin #wpadminbar a.ab-item,
        body.wp-admin #wpadminbar > #wp-toolbar span.ab-label,
        body.wp-admin #wpadminbar > #wp-toolbar span.noticon{
        color:${adminBar.text_color}!important;
      }`;
    }
    
    // Glassmorphism effect (if enabled)
    if (adminBarEffects.glassmorphism) {
      const blur = adminBarEffects.blur_intensity || 20;
      css += `body.wp-admin #wpadminbar{
        backdrop-filter:blur(${blur}px)!important;
        -webkit-backdrop-filter:blur(${blur}px)!important;
        background-color:rgba(35,40,45,0.8)!important;
      }`;
    } else {
      // Explicitly disable glassmorphism when turned off
      css += `body.wp-admin #wpadminbar{
        backdrop-filter:none!important;
        -webkit-backdrop-filter:none!important;
      }`;
    }
    
    // Floating effect (if enabled)
    if (adminBarEffects.floating) {
      const margin = adminBarEffects.floating_margin || 8;
      const radius = adminBarEffects.border_radius || 8;
      
      css += `body.wp-admin #wpadminbar{
        top:${margin}px!important;
        left:${margin}px!important;
        right:${margin}px!important;
        width:calc(100% - ${margin * 2}px)!important;
        border-radius:${radius}px!important;
      }`;
      
      // Adjust body padding for floating bar
      css += `html.wp-toolbar{
        padding-top:${height + margin * 2}px!important;
      }`;
    } else {
      // Explicitly disable floating when turned off
      css += `body.wp-admin #wpadminbar{
        top:0!important;
        left:0!important;
        right:0!important;
        width:100%!important;
        border-radius:0!important;
      }`;
    }
    
    // Submenu positioning
    if (adminBar.height) {
      css += `body.wp-admin #wpadminbar .ab-sub-wrapper{
        top:${adminBar.height}px!important;
      }`;
    }
    
    return css;
  }
  
  /**
   * Generate Admin Menu CSS
   * 
   * Generates CSS for WordPress admin menu styling.
   * Migrated from legacy mase-admin.js generateAdminMenuCSS.
   * 
   * Requirement 3.2: Migrate layout rules generation
   * 
   * @param {Object} settings - Settings object
   * @returns {string} Admin menu CSS
   */
  generateAdminMenuCSS(settings) {
    const adminMenu = settings.admin_menu || {};
    
    let css = '';
    
    // Admin menu background (always apply)
    css += `body.wp-admin #adminmenu,
      body.wp-admin #adminmenuback,
      body.wp-admin #adminmenuwrap{`;
    if (adminMenu.bg_color) {
      css += `background-color:${adminMenu.bg_color}!important;`;
    }
    css += '}';
    
    // Only set width if different from WordPress default (160px)
    const width = parseInt(adminMenu.width) || 160;
    if (width !== 160) {
      // Expanded menu width
      css += `body.wp-admin:not(.folded) #adminmenu,
        body.wp-admin:not(.folded) #adminmenuback,
        body.wp-admin:not(.folded) #adminmenuwrap{
        width:${width}px!important;
      }`;
      
      // Folded menu width (always 36px when collapsed)
      css += `body.wp-admin.folded #adminmenu,
        body.wp-admin.folded #adminmenuback,
        body.wp-admin.folded #adminmenuwrap{
        width:36px!important;
      }`;
      
      // Adjust content area margin for custom menu width (expanded)
      css += `body.wp-admin:not(.folded) #wpcontent,
        body.wp-admin:not(.folded) #wpfooter{
        margin-left:${width}px!important;
      }`;
      
      // Adjust content area margin for folded menu
      css += `body.wp-admin.folded #wpcontent,
        body.wp-admin.folded #wpfooter{
        margin-left:36px!important;
      }`;
    }
    
    // Fix folded menu icons and submenu positioning
    css += `body.wp-admin.folded #adminmenu .wp-menu-image{
      width:36px!important;
      height:34px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      overflow:hidden!important;
    }`;
    
    // Fix folded menu icon dashicons
    css += `body.wp-admin.folded #adminmenu .wp-menu-image:before{
      padding:0!important;
      margin:0!important;
      width:18px!important;
      height:18px!important;
      font-size:18px!important;
      line-height:1!important;
      display:block!important;
    }`;
    
    // Fix folded menu item height
    css += `body.wp-admin.folded #adminmenu li.menu-top{
      height:34px!important;
      min-height:34px!important;
    }`;
    
    // Fix folded menu link padding
    css += `body.wp-admin.folded #adminmenu .wp-menu-image img{
      width:18px!important;
      height:18px!important;
      padding:0!important;
    }`;
    
    // Fix folded menu submenu positioning
    css += `body.wp-admin.folded #adminmenu .wp-submenu{
      position:absolute!important;
      left:36px!important;
      top:0!important;
      margin:0!important;
      padding:0!important;
      min-width:160px!important;
      z-index:9999!important;
    }`;
    
    // Fix folded menu submenu background
    if (adminMenu.bg_color) {
      css += `body.wp-admin.folded #adminmenu .wp-submenu{
        background-color:${adminMenu.bg_color}!important;
        box-shadow:2px 2px 5px rgba(0,0,0,0.1)!important;
      }`;
    }
    
    // Hide menu text in folded mode
    css += `body.wp-admin.folded #adminmenu .wp-menu-name{
      display:none!important;
    }`;
    
    // Admin menu height mode
    const heightMode = adminMenu.height_mode || 'full';
    if (heightMode === 'content') {
      css += `body.wp-admin #adminmenuwrap,
        body.wp-admin #adminmenuback,
        body.wp-admin #adminmenumain{
        height:auto!important;
        min-height:0!important;
        bottom:auto!important;
      }`;
      
      css += `body.wp-admin #adminmenu{
        height:auto!important;
        min-height:0!important;
        position:relative!important;
        bottom:auto!important;
      }`;
      
      css += `body.wp-admin #adminmenu li.menu-top{
        height:auto!important;
      }`;
    }
    
    // Admin menu text color
    if (adminMenu.text_color) {
      css += `body.wp-admin #adminmenu a,
        body.wp-admin #adminmenu div.wp-menu-name{
        color:${adminMenu.text_color}!important;
      }`;
    }
    
    // Admin menu hover states
    if (adminMenu.hover_bg_color) {
      css += `body.wp-admin #adminmenu li.menu-top:hover,
        body.wp-admin #adminmenu li.opensub > a.menu-top,
        body.wp-admin #adminmenu li > a.menu-top:focus{
        background-color:${adminMenu.hover_bg_color}!important;
      }`;
    }
    
    if (adminMenu.hover_text_color) {
      css += `body.wp-admin #adminmenu li.menu-top:hover a,
        body.wp-admin #adminmenu li.opensub > a.menu-top,
        body.wp-admin #adminmenu li > a.menu-top:focus{
        color:${adminMenu.hover_text_color}!important;
      }`;
    }
    
    // Menu item spacing
    const menuPadding = adminMenu.item_padding || '6px 12px';
    const fontSize = adminMenu.font_size || 13;
    const lineHeight = adminMenu.line_height || 18;
    
    css += `body.wp-admin #adminmenu li.menu-top{
      padding:${menuPadding}!important;
    }`;
    
    css += `body.wp-admin #adminmenu a{
      font-size:${fontSize}px!important;
      line-height:${lineHeight}px!important;
    }`;
    
    // Submenu indentation
    css += `body.wp-admin #adminmenu .wp-submenu{
      padding-left:12px!important;
    }`;
    
    css += `body.wp-admin #adminmenu .wp-submenu li{
      padding:5px 0!important;
    }`;
    
    return css;
  }
  
  /**
   * Generate Typography CSS
   * 
   * Generates CSS for typography settings across admin areas.
   * Migrated from legacy mase-admin.js generateTypographyCSS.
   * Integrates with Typography module for fluid typography and font loading.
   * 
   * Requirement 3.2: Migrate typography rules generation
   * Requirement 6.1: Update preview with new typography
   * 
   * @param {Object} settings - Settings object
   * @returns {string} Typography CSS
   */
  generateTypographyCSS(settings) {
    const typographySettings = settings.typography || {};
    
    let css = '';
    
    // Admin bar typography
    if (typographySettings.admin_bar) {
      const adminBar = typographySettings.admin_bar;
      css += `body.wp-admin #wpadminbar,
        body.wp-admin #wpadminbar .ab-item,
        body.wp-admin #wpadminbar > #wp-toolbar span.ab-label,
        body.wp-admin #wpadminbar > #wp-toolbar span.noticon{`;
      
      if (adminBar.font_size) {
        css += `font-size:${adminBar.font_size}px!important;`;
      }
      if (adminBar.font_weight) {
        css += `font-weight:${adminBar.font_weight}!important;`;
      }
      if (adminBar.line_height) {
        css += `line-height:${adminBar.line_height}!important;`;
      }
      if (adminBar.letter_spacing) {
        css += `letter-spacing:${adminBar.letter_spacing}px!important;`;
      }
      if (adminBar.text_transform) {
        css += `text-transform:${adminBar.text_transform}!important;`;
      }
      if (adminBar.font_family) {
        const fontStack = typography.getFontStack(adminBar.font_family);
        css += `font-family:${fontStack}!important;`;
      }
      
      css += '}';
    }
    
    // Admin menu typography
    if (typographySettings.admin_menu) {
      const adminMenu = typographySettings.admin_menu;
      css += `body.wp-admin #adminmenu a,
        body.wp-admin #adminmenu div.wp-menu-name,
        body.wp-admin #adminmenu .wp-submenu a{`;
      
      if (adminMenu.font_size) {
        css += `font-size:${adminMenu.font_size}px!important;`;
      }
      if (adminMenu.font_weight) {
        css += `font-weight:${adminMenu.font_weight}!important;`;
      }
      if (adminMenu.line_height) {
        css += `line-height:${adminMenu.line_height}!important;`;
      }
      if (adminMenu.letter_spacing) {
        css += `letter-spacing:${adminMenu.letter_spacing}px!important;`;
      }
      if (adminMenu.text_transform) {
        css += `text-transform:${adminMenu.text_transform}!important;`;
      }
      if (adminMenu.font_family) {
        const fontStack = typography.getFontStack(adminMenu.font_family);
        css += `font-family:${fontStack}!important;`;
      }
      
      css += '}';
    }
    
    // Content typography
    if (typographySettings.content) {
      const content = typographySettings.content;
      css += `body.wp-admin #wpbody-content,
        body.wp-admin .wrap,
        body.wp-admin #wpbody-content p,
        body.wp-admin .wrap p{`;
      
      if (content.font_size) {
        css += `font-size:${content.font_size}px!important;`;
      }
      if (content.font_weight) {
        css += `font-weight:${content.font_weight}!important;`;
      }
      if (content.line_height) {
        css += `line-height:${content.line_height}!important;`;
      }
      if (content.letter_spacing !== undefined) {
        css += `letter-spacing:${content.letter_spacing}px!important;`;
      }
      if (content.text_transform) {
        css += `text-transform:${content.text_transform}!important;`;
      }
      if (content.font_family) {
        const fontStack = typography.getFontStack(content.font_family);
        css += `font-family:${fontStack}!important;`;
      }
      
      css += '}';
    }
    
    // Add fluid typography CSS if Typography module is available
    // Requirement 6.3: Implement viewport-based scaling
    if (typeof typography !== 'undefined' && typography.generateFluidCSS) {
      try {
        css += typography.generateFluidCSS(typographySettings);
      } catch (error) {
        console.warn('MASE Preview Engine: Failed to generate fluid typography CSS:', error);
      }
    }
    
    return css;
  }
  
  /**
   * Generate Visual Effects CSS
   * 
   * Generates CSS for visual effects like shadows and border radius.
   * Migrated from legacy mase-admin.js generateVisualEffectsCSS.
   * 
   * Requirement 3.2: Migrate effect rules generation
   * 
   * @param {Object} settings - Settings object
   * @returns {string} Visual effects CSS
   */
  generateVisualEffectsCSS(settings) {
    const visualEffects = settings.visual_effects || {};
    
    let css = '';
    
    // Admin bar visual effects
    if (visualEffects.admin_bar) {
      css += this.generateElementVisualEffects(
        'body.wp-admin #wpadminbar',
        visualEffects.admin_bar
      );
    }
    
    // Admin menu visual effects
    if (visualEffects.admin_menu) {
      css += this.generateElementVisualEffects(
        'body.wp-admin #adminmenu a',
        visualEffects.admin_menu
      );
    }
    
    return css;
  }
  
  /**
   * Generate visual effects CSS for a specific element
   * 
   * Helper method to generate border radius and shadow effects.
   * 
   * @param {string} selector - CSS selector
   * @param {Object} effects - Visual effects settings
   * @returns {string} Element visual effects CSS
   */
  generateElementVisualEffects(selector, effects) {
    let css = `${selector}{`;
    
    // Border radius
    if (effects.border_radius) {
      css += `border-radius:${effects.border_radius}px!important;`;
    }
    
    // Box shadow
    const shadow = this.calculateShadow(effects);
    if (shadow !== 'none') {
      css += `box-shadow:${shadow}!important;`;
    }
    
    css += '}';
    
    return css;
  }
  
  /**
   * Calculate shadow CSS value from visual effects settings
   * 
   * Generates box-shadow value based on intensity, direction, blur, and color.
   * 
   * @param {Object} effects - Visual effects settings
   * @returns {string} CSS box-shadow value
   */
  calculateShadow(effects) {
    const intensity = effects.shadow_intensity || 'none';
    const direction = effects.shadow_direction || 'bottom';
    const blur = parseInt(effects.shadow_blur) || 10;
    const color = effects.shadow_color || 'rgba(0,0,0,0.15)';
    
    if (intensity === 'none') {
      return 'none';
    }
    
    // Base shadow sizes by intensity
    const sizes = {
      'subtle': { x: 2, y: 2, spread: 0 },
      'medium': { x: 4, y: 4, spread: 0 },
      'strong': { x: 8, y: 8, spread: 2 }
    };
    
    // Direction modifiers
    const directions = {
      'top': { x: 0, y: -1 },
      'right': { x: 1, y: 0 },
      'bottom': { x: 0, y: 1 },
      'left': { x: -1, y: 0 },
      'center': { x: 0, y: 0 }
    };
    
    const base = sizes[intensity] || sizes.subtle;
    const dir = directions[direction] || directions.bottom;
    
    const x = base.x * dir.x;
    const y = base.y * dir.y;
    const spread = base.spread;
    
    return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
  }
}

// Create and export singleton instance
const previewEngine = new PreviewEngine();
export default previewEngine;
