/**
 * Animation Presets Library Module
 *
 * Provides a collection of pre-built animation presets and a browser UI
 * for discovering and applying animations.
 *
 * Requirements: 14.4
 *
 * @module animation-presets
 */

import animations, { Easing, CSSEasing } from './animations.js';
import { AnimationTimeline, AnimationTrack, Keyframe } from './animation-timeline.js';

/**
 * Animation Preset class
 */
class AnimationPreset {
  constructor(id, name, description, category, keyframes, options = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.keyframes = keyframes;
    this.options = {
      duration: 300,
      easing: 'ease-in-out',
      ...options,
    };
    this.tags = options.tags || [];
    this.thumbnail = options.thumbnail || null;
  }

  /**
   * Apply preset to element
   * @param {Element} element - Element to animate
   * @param {Object} customOptions - Custom options to override defaults
   * @returns {Animation} Web Animation instance
   */
  apply(element, customOptions = {}) {
    const options = { ...this.options, ...customOptions };
    return animations.animate(element, this.keyframes, options);
  }

  /**
   * Convert to timeline format
   * @returns {Object} Timeline data
   */
  toTimeline() {
    const timeline = new AnimationTimeline({
      duration: this.options.duration,
      loop: this.options.loop || false,
    });

    const track = new AnimationTrack(this.name);

    // Convert keyframes to timeline format
    const duration = this.options.duration;
    this.keyframes.forEach((kf, index) => {
      const time = (index / (this.keyframes.length - 1)) * duration;
      const keyframe = new Keyframe(time, kf, this.options.easing);
      track.addKeyframe(keyframe);
    });

    timeline.addTrack(track);
    return timeline;
  }

  /**
   * Clone preset
   * @returns {AnimationPreset} Cloned preset
   */
  clone() {
    return new AnimationPreset(
      this.id,
      this.name,
      this.description,
      this.category,
      [...this.keyframes],
      { ...this.options },
    );
  }
}

/**
 * Animation Presets Library
 *
 * Collection of pre-built animation presets organized by category
 */
class AnimationPresetsLibrary {
  constructor() {
    this.presets = new Map();
    this.categories = new Set();

    // Initialize with built-in presets
    this._initializeBuiltInPresets();
  }

  /**
   * Initialize built-in animation presets
   * @private
   */
  _initializeBuiltInPresets() {
    // Fade animations
    this.addPreset(
      new AnimationPreset(
        'fade-in',
        'Fade In',
        'Smoothly fade element into view',
        'fade',
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 300, easing: 'ease-out', tags: ['entrance', 'basic'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'fade-out',
        'Fade Out',
        'Smoothly fade element out of view',
        'fade',
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 300, easing: 'ease-in', tags: ['exit', 'basic'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'fade-in-up',
        'Fade In Up',
        'Fade in while sliding up',
        'fade',
        [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 400, easing: 'ease-out', tags: ['entrance', 'slide'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'fade-in-down',
        'Fade In Down',
        'Fade in while sliding down',
        'fade',
        [
          { opacity: 0, transform: 'translateY(-20px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 400, easing: 'ease-out', tags: ['entrance', 'slide'] },
      ),
    );

    // Slide animations
    this.addPreset(
      new AnimationPreset(
        'slide-in-left',
        'Slide In Left',
        'Slide element in from the left',
        'slide',
        [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }],
        { duration: 400, easing: 'ease-out', tags: ['entrance'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'slide-in-right',
        'Slide In Right',
        'Slide element in from the right',
        'slide',
        [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }],
        { duration: 400, easing: 'ease-out', tags: ['entrance'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'slide-out-left',
        'Slide Out Left',
        'Slide element out to the left',
        'slide',
        [{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }],
        { duration: 400, easing: 'ease-in', tags: ['exit'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'slide-out-right',
        'Slide Out Right',
        'Slide element out to the right',
        'slide',
        [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }],
        { duration: 400, easing: 'ease-in', tags: ['exit'] },
      ),
    );

    // Scale animations
    this.addPreset(
      new AnimationPreset(
        'scale-in',
        'Scale In',
        'Scale element from small to normal',
        'scale',
        [
          { transform: 'scale(0.8)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        { duration: 300, easing: 'ease-out', tags: ['entrance', 'zoom'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'scale-out',
        'Scale Out',
        'Scale element from normal to small',
        'scale',
        [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(0.8)', opacity: 0 },
        ],
        { duration: 300, easing: 'ease-in', tags: ['exit', 'zoom'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'zoom-in',
        'Zoom In',
        'Zoom element in dramatically',
        'scale',
        [
          { transform: 'scale(0)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        {
          duration: 400,
          easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          tags: ['entrance', 'zoom', 'bounce'],
        },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'zoom-out',
        'Zoom Out',
        'Zoom element out dramatically',
        'scale',
        [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(0)', opacity: 0 },
        ],
        { duration: 400, easing: 'ease-in', tags: ['exit', 'zoom'] },
      ),
    );

    // Rotate animations
    this.addPreset(
      new AnimationPreset(
        'rotate-in',
        'Rotate In',
        'Rotate element into view',
        'rotate',
        [
          { transform: 'rotate(-180deg) scale(0.8)', opacity: 0 },
          { transform: 'rotate(0deg) scale(1)', opacity: 1 },
        ],
        { duration: 500, easing: 'ease-out', tags: ['entrance', 'spin'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'rotate-out',
        'Rotate Out',
        'Rotate element out of view',
        'rotate',
        [
          { transform: 'rotate(0deg) scale(1)', opacity: 1 },
          { transform: 'rotate(180deg) scale(0.8)', opacity: 0 },
        ],
        { duration: 500, easing: 'ease-in', tags: ['exit', 'spin'] },
      ),
    );

    // Bounce animations
    this.addPreset(
      new AnimationPreset(
        'bounce-in',
        'Bounce In',
        'Bounce element into view',
        'bounce',
        [
          { transform: 'scale(0)', opacity: 0 },
          { transform: 'scale(1.1)', opacity: 1, offset: 0.6 },
          { transform: 'scale(0.95)', offset: 0.8 },
          { transform: 'scale(1)' },
        ],
        { duration: 500, easing: 'ease-out', tags: ['entrance', 'playful'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'bounce',
        'Bounce',
        'Bounce element in place',
        'bounce',
        [
          { transform: 'translateY(0)' },
          { transform: 'translateY(-20px)', offset: 0.3 },
          { transform: 'translateY(0)', offset: 0.5 },
          { transform: 'translateY(-10px)', offset: 0.7 },
          { transform: 'translateY(0)' },
        ],
        { duration: 600, easing: 'ease-in-out', tags: ['attention', 'playful'] },
      ),
    );

    // Shake animations
    this.addPreset(
      new AnimationPreset(
        'shake',
        'Shake',
        'Shake element horizontally',
        'attention',
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-10px)', offset: 0.2 },
          { transform: 'translateX(10px)', offset: 0.4 },
          { transform: 'translateX(-10px)', offset: 0.6 },
          { transform: 'translateX(10px)', offset: 0.8 },
          { transform: 'translateX(0)' },
        ],
        { duration: 500, easing: 'ease-in-out', tags: ['attention', 'error'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'wobble',
        'Wobble',
        'Wobble element with rotation',
        'attention',
        [
          { transform: 'rotate(0deg)' },
          { transform: 'rotate(-5deg)', offset: 0.25 },
          { transform: 'rotate(5deg)', offset: 0.5 },
          { transform: 'rotate(-5deg)', offset: 0.75 },
          { transform: 'rotate(0deg)' },
        ],
        { duration: 500, easing: 'ease-in-out', tags: ['attention', 'playful'] },
      ),
    );

    // Pulse animations
    this.addPreset(
      new AnimationPreset(
        'pulse',
        'Pulse',
        'Pulse element with scale',
        'attention',
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.05)', offset: 0.5 },
          { transform: 'scale(1)' },
        ],
        { duration: 400, easing: 'ease-in-out', tags: ['attention', 'subtle'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'heartbeat',
        'Heartbeat',
        'Heartbeat pulse effect',
        'attention',
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.1)', offset: 0.14 },
          { transform: 'scale(1)', offset: 0.28 },
          { transform: 'scale(1.1)', offset: 0.42 },
          { transform: 'scale(1)', offset: 0.7 },
        ],
        { duration: 1000, easing: 'ease-in-out', tags: ['attention', 'playful'] },
      ),
    );

    // Flip animations
    this.addPreset(
      new AnimationPreset(
        'flip-in-x',
        'Flip In X',
        'Flip element in along X axis',
        'flip',
        [
          { transform: 'perspective(400px) rotateX(-90deg)', opacity: 0 },
          { transform: 'perspective(400px) rotateX(0deg)', opacity: 1 },
        ],
        { duration: 500, easing: 'ease-out', tags: ['entrance', '3d'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'flip-in-y',
        'Flip In Y',
        'Flip element in along Y axis',
        'flip',
        [
          { transform: 'perspective(400px) rotateY(-90deg)', opacity: 0 },
          { transform: 'perspective(400px) rotateY(0deg)', opacity: 1 },
        ],
        { duration: 500, easing: 'ease-out', tags: ['entrance', '3d'] },
      ),
    );

    // Roll animations
    this.addPreset(
      new AnimationPreset(
        'roll-in',
        'Roll In',
        'Roll element in from the left',
        'special',
        [
          { transform: 'translateX(-100%) rotate(-120deg)', opacity: 0 },
          { transform: 'translateX(0) rotate(0deg)', opacity: 1 },
        ],
        { duration: 600, easing: 'ease-out', tags: ['entrance', 'playful'] },
      ),
    );

    this.addPreset(
      new AnimationPreset(
        'roll-out',
        'Roll Out',
        'Roll element out to the right',
        'special',
        [
          { transform: 'translateX(0) rotate(0deg)', opacity: 1 },
          { transform: 'translateX(100%) rotate(120deg)', opacity: 0 },
        ],
        { duration: 600, easing: 'ease-in', tags: ['exit', 'playful'] },
      ),
    );

    // Swing animations
    this.addPreset(
      new AnimationPreset(
        'swing',
        'Swing',
        'Swing element like a pendulum',
        'special',
        [
          { transform: 'rotate(0deg)', transformOrigin: 'top center' },
          { transform: 'rotate(15deg)', transformOrigin: 'top center', offset: 0.2 },
          { transform: 'rotate(-10deg)', transformOrigin: 'top center', offset: 0.4 },
          { transform: 'rotate(5deg)', transformOrigin: 'top center', offset: 0.6 },
          { transform: 'rotate(-5deg)', transformOrigin: 'top center', offset: 0.8 },
          { transform: 'rotate(0deg)', transformOrigin: 'top center' },
        ],
        { duration: 800, easing: 'ease-in-out', tags: ['attention', 'playful'] },
      ),
    );

    // Rubber band animation
    this.addPreset(
      new AnimationPreset(
        'rubber-band',
        'Rubber Band',
        'Stretch and snap like a rubber band',
        'special',
        [
          { transform: 'scale(1)' },
          { transform: 'scaleX(1.25) scaleY(0.75)', offset: 0.3 },
          { transform: 'scaleX(0.75) scaleY(1.25)', offset: 0.4 },
          { transform: 'scaleX(1.15) scaleY(0.85)', offset: 0.5 },
          { transform: 'scaleX(0.95) scaleY(1.05)', offset: 0.65 },
          { transform: 'scaleX(1.05) scaleY(0.95)', offset: 0.75 },
          { transform: 'scale(1)' },
        ],
        { duration: 800, easing: 'ease-in-out', tags: ['attention', 'playful'] },
      ),
    );

    // Jello animation
    this.addPreset(
      new AnimationPreset(
        'jello',
        'Jello',
        'Jello-like wobble effect',
        'special',
        [
          { transform: 'skewX(0deg) skewY(0deg)' },
          { transform: 'skewX(-12.5deg) skewY(-12.5deg)', offset: 0.222 },
          { transform: 'skewX(6.25deg) skewY(6.25deg)', offset: 0.333 },
          { transform: 'skewX(-3.125deg) skewY(-3.125deg)', offset: 0.444 },
          { transform: 'skewX(1.5625deg) skewY(1.5625deg)', offset: 0.555 },
          { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)', offset: 0.666 },
          { transform: 'skewX(0.390625deg) skewY(0.390625deg)', offset: 0.777 },
          { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)', offset: 0.888 },
          { transform: 'skewX(0deg) skewY(0deg)' },
        ],
        { duration: 800, easing: 'ease-in-out', tags: ['attention', 'playful'] },
      ),
    );
  }

  /**
   * Add preset to library
   * @param {AnimationPreset} preset - Preset to add
   */
  addPreset(preset) {
    this.presets.set(preset.id, preset);
    this.categories.add(preset.category);
  }

  /**
   * Remove preset from library
   * @param {string} presetId - Preset ID
   */
  removePreset(presetId) {
    this.presets.delete(presetId);
  }

  /**
   * Get preset by ID
   * @param {string} presetId - Preset ID
   * @returns {AnimationPreset|null} Preset or null
   */
  getPreset(presetId) {
    return this.presets.get(presetId) || null;
  }

  /**
   * Get all presets
   * @returns {Array<AnimationPreset>} Array of presets
   */
  getAllPresets() {
    return Array.from(this.presets.values());
  }

  /**
   * Get presets by category
   * @param {string} category - Category name
   * @returns {Array<AnimationPreset>} Array of presets
   */
  getPresetsByCategory(category) {
    return this.getAllPresets().filter((p) => p.category === category);
  }

  /**
   * Get presets by tag
   * @param {string} tag - Tag name
   * @returns {Array<AnimationPreset>} Array of presets
   */
  getPresetsByTag(tag) {
    return this.getAllPresets().filter((p) => p.tags.includes(tag));
  }

  /**
   * Search presets
   * @param {string} query - Search query
   * @returns {Array<AnimationPreset>} Array of matching presets
   */
  searchPresets(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAllPresets().filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  }

  /**
   * Get all categories
   * @returns {Array<string>} Array of category names
   */
  getCategories() {
    return Array.from(this.categories);
  }

  /**
   * Get all tags
   * @returns {Array<string>} Array of unique tags
   */
  getAllTags() {
    const tags = new Set();
    this.getAllPresets().forEach((preset) => {
      preset.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }

  /**
   * Export library to JSON
   * @returns {Object} Library data
   */
  export() {
    return {
      version: '1.0',
      presets: this.getAllPresets().map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        keyframes: p.keyframes,
        options: p.options,
      })),
    };
  }

  /**
   * Import library from JSON
   * @param {Object} data - Library data
   */
  import(data) {
    data.presets.forEach((presetData) => {
      const preset = new AnimationPreset(
        presetData.id,
        presetData.name,
        presetData.description,
        presetData.category,
        presetData.keyframes,
        presetData.options,
      );
      this.addPreset(preset);
    });
  }
}

/**
 * Preset Browser UI
 *
 * Visual browser for discovering and applying animation presets
 */
class PresetBrowserUI {
  constructor(library, container, options = {}) {
    this.library = library;
    this.container = container;
    this.options = {
      onSelect: null,
      onApply: null,
      showPreview: true,
      ...options,
    };

    this.selectedPreset = null;
    this.currentCategory = 'all';
    this.searchQuery = '';

    this._init();
  }

  /**
   * Initialize UI
   * @private
   */
  _init() {
    this.container.innerHTML = '';
    this.container.className = 'mase-preset-browser';

    // Create header
    this._createHeader();

    // Create filters
    this._createFilters();

    // Create preset grid
    this._createPresetGrid();

    // Create preview panel
    if (this.options.showPreview) {
      this._createPreviewPanel();
    }

    // Initial render
    this._renderPresets();
  }

  /**
   * Create header
   * @private
   */
  _createHeader() {
    const header = document.createElement('div');
    header.className = 'mase-preset-browser-header';
    header.innerHTML = `
      <h2>Animation Presets</h2>
      <input type="text" class="mase-preset-search" placeholder="Search presets..." />
    `;

    const searchInput = header.querySelector('.mase-preset-search');
    searchInput.oninput = (e) => {
      this.searchQuery = e.target.value;
      this._renderPresets();
    };

    this.container.appendChild(header);
  }

  /**
   * Create filters
   * @private
   */
  _createFilters() {
    const filters = document.createElement('div');
    filters.className = 'mase-preset-filters';

    // Category filter
    const categories = ['all', ...this.library.getCategories()];
    categories.forEach((category) => {
      const btn = document.createElement('button');
      btn.className = 'mase-preset-filter-btn';
      btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      btn.dataset.category = category;

      if (category === this.currentCategory) {
        btn.classList.add('active');
      }

      btn.onclick = () => {
        this.currentCategory = category;
        filters
          .querySelectorAll('.mase-preset-filter-btn')
          .forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this._renderPresets();
      };

      filters.appendChild(btn);
    });

    this.container.appendChild(filters);
  }

  /**
   * Create preset grid
   * @private
   */
  _createPresetGrid() {
    const grid = document.createElement('div');
    grid.className = 'mase-preset-grid';
    this.container.appendChild(grid);
    this.presetGrid = grid;
  }

  /**
   * Create preview panel
   * @private
   */
  _createPreviewPanel() {
    const panel = document.createElement('div');
    panel.className = 'mase-preset-preview-panel';
    panel.innerHTML = `
      <h3>Preview</h3>
      <div class="mase-preset-preview-stage">
        <div class="mase-preset-preview-element">Preview</div>
      </div>
      <div class="mase-preset-preview-controls">
        <button class="mase-preset-preview-btn">Play Preview</button>
        <button class="mase-preset-apply-btn">Apply to Selection</button>
      </div>
      <div class="mase-preset-preview-info"></div>
    `;

    this.container.appendChild(panel);
    this.previewPanel = panel;
    this.previewElement = panel.querySelector('.mase-preset-preview-element');
    this.previewInfo = panel.querySelector('.mase-preset-preview-info');

    // Bind preview button
    panel.querySelector('.mase-preset-preview-btn').onclick = () => {
      if (this.selectedPreset) {
        this._playPreview();
      }
    };

    // Bind apply button
    panel.querySelector('.mase-preset-apply-btn').onclick = () => {
      if (this.selectedPreset && this.options.onApply) {
        this.options.onApply(this.selectedPreset);
      }
    };
  }

  /**
   * Render presets
   * @private
   */
  _renderPresets() {
    this.presetGrid.innerHTML = '';

    // Get filtered presets
    let presets =
      this.currentCategory === 'all'
        ? this.library.getAllPresets()
        : this.library.getPresetsByCategory(this.currentCategory);

    // Apply search filter
    if (this.searchQuery) {
      presets = this.library.searchPresets(this.searchQuery);
    }

    // Render preset cards
    presets.forEach((preset) => {
      const card = this._createPresetCard(preset);
      this.presetGrid.appendChild(card);
    });

    if (presets.length === 0) {
      this.presetGrid.innerHTML = '<div class="mase-preset-empty">No presets found</div>';
    }
  }

  /**
   * Create preset card
   * @private
   */
  _createPresetCard(preset) {
    const card = document.createElement('div');
    card.className = 'mase-preset-card';
    card.dataset.presetId = preset.id;

    card.innerHTML = `
      <div class="mase-preset-card-preview">
        <div class="mase-preset-card-icon">▶</div>
      </div>
      <div class="mase-preset-card-info">
        <h4>${preset.name}</h4>
        <p>${preset.description}</p>
        <div class="mase-preset-card-tags">
          ${preset.tags.map((tag) => `<span class="mase-preset-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;

    card.onclick = () => {
      this._selectPreset(preset);
    };

    return card;
  }

  /**
   * Select preset
   * @private
   */
  _selectPreset(preset) {
    this.selectedPreset = preset;

    // Update selected state
    this.presetGrid.querySelectorAll('.mase-preset-card').forEach((card) => {
      card.classList.remove('selected');
    });

    const selectedCard = this.presetGrid.querySelector(`[data-preset-id="${preset.id}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }

    // Update preview info
    if (this.options.showPreview) {
      this._updatePreviewInfo();
    }

    // Callback
    if (this.options.onSelect) {
      this.options.onSelect(preset);
    }
  }

  /**
   * Update preview info
   * @private
   */
  _updatePreviewInfo() {
    if (!this.selectedPreset) {
      return;
    }

    const preset = this.selectedPreset;
    this.previewInfo.innerHTML = `
      <h4>${preset.name}</h4>
      <p>${preset.description}</p>
      <p><strong>Duration:</strong> ${preset.options.duration}ms</p>
      <p><strong>Easing:</strong> ${preset.options.easing}</p>
      <p><strong>Category:</strong> ${preset.category}</p>
    `;
  }

  /**
   * Play preview
   * @private
   */
  _playPreview() {
    if (!this.selectedPreset) {
      return;
    }

    // Reset element
    this.previewElement.style.cssText = '';

    // Apply animation
    this.selectedPreset.apply(this.previewElement);
  }

  /**
   * Get selected preset
   * @returns {AnimationPreset|null} Selected preset or null
   */
  getSelectedPreset() {
    return this.selectedPreset;
  }

  /**
   * Refresh UI
   */
  refresh() {
    this._renderPresets();
  }

  /**
   * Destroy UI
   */
  destroy() {
    this.container.innerHTML = '';
  }
}

// Create singleton library instance
const presetsLibrary = new AnimationPresetsLibrary();

export { AnimationPresetsLibrary, AnimationPreset, PresetBrowserUI };
export default presetsLibrary;
