/**
 * AI Suggestions Module
 * 
 * UI components and logic for displaying and managing AI-powered suggestions.
 * Requirements: 14.1, 14.3
 * 
 * @module ai-suggestions
 */

import eventBus, { EVENTS } from './event-bus.js';
import useStore from './state-manager.js';

/**
 * AISuggestions class for managing AI suggestion UI
 */
export class AISuggestions {
  constructor(options = {}) {
    this.container = options.container || null;
    this.isDevelopment = options.isDevelopment || process.env.NODE_ENV === 'development';
    this.unsubscribers = [];
  }

  /**
   * Initialize AI suggestions UI
   */
  init() {
    if (!this.container) {
      console.error('AISuggestions: Container element not provided');
      return;
    }

    // Subscribe to AI events
    this.subscribeToEvents();

    // Render initial state
    this.render();

    if (this.isDevelopment) {
      console.log('AISuggestions: Initialized');
    }
  }

  /**
   * Subscribe to AI-related events
   */
  subscribeToEvents() {
    // Suggestion received
    this.unsubscribers.push(
      eventBus.on(EVENTS.AI_SUGGESTION_RECEIVED, (data) => {
        this.handleSuggestionReceived(data);
      })
    );

    // Suggestion applied
    this.unsubscribers.push(
      eventBus.on(EVENTS.AI_SUGGESTION_APPLIED, (data) => {
        this.handleSuggestionApplied(data);
      })
    );

    // Suggestion rejected
    this.unsubscribers.push(
      eventBus.on(EVENTS.AI_SUGGESTION_REJECTED, (data) => {
        this.handleSuggestionRejected(data);
      })
    );

    // Loading state
    this.unsubscribers.push(
      eventBus.on(EVENTS.AI_SUGGESTION_LOADING, (data) => {
        this.handleLoadingState(data);
      })
    );

    // Error state
    this.unsubscribers.push(
      eventBus.on(EVENTS.AI_SUGGESTION_ERROR, (data) => {
        this.handleError(data);
      })
    );
  }

  /**
   * Render AI suggestions UI
   */
  render() {
    const state = useStore.getState();
    const aiState = state.ai;

    // Check if AI is enabled
    if (!aiState.settings.enabled) {
      this.renderDisabledState();
      return;
    }

    // Render suggestions for each category
    const html = `
      <div class="mase-ai-suggestions">
        <div class="mase-ai-suggestions__header">
          <h2>AI Suggestions</h2>
          <button class="mase-ai-suggestions__refresh" data-action="refresh">
            <span class="dashicons dashicons-update"></span>
            Refresh
          </button>
          <button class="mase-ai-suggestions__settings" data-action="settings">
            <span class="dashicons dashicons-admin-generic"></span>
          </button>
        </div>
        
        <div class="mase-ai-suggestions__categories">
          ${this.renderCategory('colors', 'Color Palettes', aiState)}
          ${this.renderCategory('typography', 'Typography', aiState)}
          ${this.renderCategory('accessibility', 'Accessibility', aiState)}
          ${this.renderCategory('settings', 'Settings', aiState)}
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  /**
   * Render disabled state
   */
  renderDisabledState() {
    const html = `
      <div class="mase-ai-suggestions mase-ai-suggestions--disabled">
        <div class="mase-ai-suggestions__empty">
          <span class="dashicons dashicons-lightbulb"></span>
          <h3>AI Suggestions Disabled</h3>
          <p>Enable AI features in settings to get intelligent suggestions for colors, typography, and more.</p>
          <button class="button button-primary" data-action="enable-ai">
            Enable AI Features
          </button>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  /**
   * Render a suggestion category
   * @param {string} category - Category name
   * @param {string} title - Category title
   * @param {Object} aiState - AI state from store
   * @returns {string} HTML string
   */
  renderCategory(category, title, aiState) {
    const suggestions = aiState.suggestions[category] || [];
    const loading = aiState.loading[category];
    const error = aiState.errors[category];

    if (loading) {
      return this.renderLoadingState(category, title);
    }

    if (error) {
      return this.renderErrorState(category, title, error);
    }

    if (suggestions.length === 0) {
      return this.renderEmptyState(category, title);
    }

    return `
      <div class="mase-ai-category" data-category="${category}">
        <h3 class="mase-ai-category__title">${title}</h3>
        <div class="mase-ai-category__suggestions">
          ${suggestions.map(s => this.renderSuggestion(s, category)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render a single suggestion
   * @param {Object} suggestion - Suggestion object
   * @param {string} category - Category name
   * @returns {string} HTML string
   */
  renderSuggestion(suggestion, category) {
    const confidencePercent = Math.round(suggestion.confidence * 100);
    const confidenceClass = this.getConfidenceClass(suggestion.confidence);

    return `
      <div class="mase-ai-suggestion" data-suggestion-id="${suggestion.id}">
        <div class="mase-ai-suggestion__header">
          <h4 class="mase-ai-suggestion__title">
            ${this.getCategoryIcon(category)}
            ${suggestion.name || 'Suggestion'}
          </h4>
          <span class="mase-ai-suggestion__confidence ${confidenceClass}">
            ${confidencePercent}%
          </span>
        </div>
        
        <div class="mase-ai-suggestion__content">
          ${this.renderSuggestionContent(suggestion, category)}
        </div>
        
        <div class="mase-ai-suggestion__reasoning">
          <p>${suggestion.reasoning}</p>
        </div>
        
        <div class="mase-ai-suggestion__actions">
          <button class="button button-secondary" data-action="preview" data-suggestion-id="${suggestion.id}">
            Preview
          </button>
          <button class="button button-primary" data-action="apply" data-suggestion-id="${suggestion.id}" data-category="${category}">
            Apply
          </button>
          <button class="button" data-action="dismiss" data-suggestion-id="${suggestion.id}" data-category="${category}">
            Dismiss
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render suggestion content based on type
   * @param {Object} suggestion - Suggestion object
   * @param {string} category - Category name
   * @returns {string} HTML string
   */
  renderSuggestionContent(suggestion, category) {
    switch (category) {
      case 'colors':
        return this.renderColorPalette(suggestion.colors);
      case 'typography':
        return this.renderTypography(suggestion.fonts);
      case 'accessibility':
        return this.renderAccessibility(suggestion);
      case 'settings':
        return this.renderSettingPrediction(suggestion);
      default:
        return '';
    }
  }

  /**
   * Render color palette
   * @param {Object} colors - Color object
   * @returns {string} HTML string
   */
  renderColorPalette(colors) {
    return `
      <div class="mase-ai-color-palette">
        ${Object.entries(colors).map(([name, color]) => `
          <div class="mase-ai-color-swatch">
            <div class="mase-ai-color-swatch__color" style="background-color: ${color}"></div>
            <div class="mase-ai-color-swatch__label">${name}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Render typography suggestion
   * @param {Object} fonts - Fonts object
   * @returns {string} HTML string
   */
  renderTypography(fonts) {
    return `
      <div class="mase-ai-typography">
        <div class="mase-ai-typography__item">
          <strong>Heading:</strong> ${fonts.heading.family} ${fonts.heading.weight}
        </div>
        <div class="mase-ai-typography__item">
          <strong>Body:</strong> ${fonts.body.family} ${fonts.body.weight}
        </div>
      </div>
    `;
  }

  /**
   * Render accessibility suggestion
   * @param {Object} suggestion - Suggestion object
   * @returns {string} HTML string
   */
  renderAccessibility(suggestion) {
    return `
      <div class="mase-ai-accessibility">
        <div class="mase-ai-accessibility__severity mase-ai-accessibility__severity--${suggestion.severity}">
          ${suggestion.severity.toUpperCase()}
        </div>
        <div class="mase-ai-accessibility__impact">
          ${suggestion.impact}
        </div>
      </div>
    `;
  }

  /**
   * Render setting prediction
   * @param {Object} suggestion - Suggestion object
   * @returns {string} HTML string
   */
  renderSettingPrediction(suggestion) {
    return `
      <div class="mase-ai-setting">
        <div class="mase-ai-setting__name">${suggestion.setting}</div>
        <div class="mase-ai-setting__change">
          <span class="mase-ai-setting__old">${suggestion.currentValue}</span>
          <span class="dashicons dashicons-arrow-right-alt"></span>
          <span class="mase-ai-setting__new">${suggestion.recommendedValue}</span>
        </div>
        <div class="mase-ai-setting__impact">${suggestion.impact}</div>
      </div>
    `;
  }

  /**
   * Render loading state
   * @param {string} category - Category name
   * @param {string} title - Category title
   * @returns {string} HTML string
   */
  renderLoadingState(category, title) {
    return `
      <div class="mase-ai-category mase-ai-category--loading" data-category="${category}">
        <h3 class="mase-ai-category__title">${title}</h3>
        <div class="mase-ai-loading">
          <div class="mase-ai-loading__spinner"></div>
          <p>Generating AI suggestions...</p>
        </div>
      </div>
    `;
  }

  /**
   * Render error state
   * @param {string} category - Category name
   * @param {string} title - Category title
   * @param {string} error - Error message
   * @returns {string} HTML string
   */
  renderErrorState(category, title, error) {
    return `
      <div class="mase-ai-category mase-ai-category--error" data-category="${category}">
        <h3 class="mase-ai-category__title">${title}</h3>
        <div class="mase-ai-error">
          <span class="dashicons dashicons-warning"></span>
          <p>${error}</p>
          <button class="button" data-action="retry" data-category="${category}">
            Retry
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render empty state
   * @param {string} category - Category name
   * @param {string} title - Category title
   * @returns {string} HTML string
   */
  renderEmptyState(category, title) {
    return `
      <div class="mase-ai-category mase-ai-category--empty" data-category="${category}">
        <h3 class="mase-ai-category__title">${title}</h3>
        <div class="mase-ai-empty">
          <p>No suggestions available</p>
          <button class="button" data-action="generate" data-category="${category}">
            Generate Suggestions
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Get confidence class based on value
   * @param {number} confidence - Confidence value (0-1)
   * @returns {string} CSS class
   */
  getConfidenceClass(confidence) {
    if (confidence >= 0.9) return 'mase-ai-confidence--high';
    if (confidence >= 0.7) return 'mase-ai-confidence--medium';
    return 'mase-ai-confidence--low';
  }

  /**
   * Get category icon
   * @param {string} category - Category name
   * @returns {string} HTML string
   */
  getCategoryIcon(category) {
    const icons = {
      colors: 'dashicons-art',
      typography: 'dashicons-editor-textcolor',
      accessibility: 'dashicons-universal-access',
      settings: 'dashicons-admin-settings',
    };

    return `<span class="dashicons ${icons[category] || 'dashicons-lightbulb'}"></span>`;
  }

  /**
   * Attach event listeners to UI elements
   */
  attachEventListeners() {
    // Apply suggestion
    this.container.querySelectorAll('[data-action="apply"]').forEach(button => {
      button.addEventListener('click', (e) => {
        const suggestionId = e.target.dataset.suggestionId;
        const category = e.target.dataset.category;
        this.applySuggestion(suggestionId, category);
      });
    });

    // Dismiss suggestion
    this.container.querySelectorAll('[data-action="dismiss"]').forEach(button => {
      button.addEventListener('click', (e) => {
        const suggestionId = e.target.dataset.suggestionId;
        const category = e.target.dataset.category;
        this.dismissSuggestion(suggestionId, category);
      });
    });

    // Preview suggestion
    this.container.querySelectorAll('[data-action="preview"]').forEach(button => {
      button.addEventListener('click', (e) => {
        const suggestionId = e.target.dataset.suggestionId;
        this.previewSuggestion(suggestionId);
      });
    });

    // Generate suggestions
    this.container.querySelectorAll('[data-action="generate"]').forEach(button => {
      button.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        this.generateSuggestions(category);
      });
    });

    // Retry
    this.container.querySelectorAll('[data-action="retry"]').forEach(button => {
      button.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        this.generateSuggestions(category);
      });
    });

    // Refresh all
    const refreshButton = this.container.querySelector('[data-action="refresh"]');
    if (refreshButton) {
      refreshButton.addEventListener('click', () => {
        this.refreshAll();
      });
    }

    // Settings
    const settingsButton = this.container.querySelector('[data-action="settings"]');
    if (settingsButton) {
      settingsButton.addEventListener('click', () => {
        this.openSettings();
      });
    }

    // Enable AI
    const enableButton = this.container.querySelector('[data-action="enable-ai"]');
    if (enableButton) {
      enableButton.addEventListener('click', () => {
        this.enableAI();
      });
    }
  }

  /**
   * Apply a suggestion
   * @param {string} suggestionId - Suggestion ID
   * @param {string} category - Category name
   */
  async applySuggestion(suggestionId, category) {
    const state = useStore.getState();
    const suggestion = state.ai.suggestions[category].find(s => s.id === suggestionId);

    if (!suggestion) {
      console.error('AISuggestions: Suggestion not found', suggestionId);
      return;
    }

    try {
      await state.applyAISuggestion(suggestionId, suggestion);
      this.render(); // Re-render after applying
    } catch (error) {
      console.error('AISuggestions: Failed to apply suggestion', error);
      alert(`Failed to apply suggestion: ${error.message}`);
    }
  }

  /**
   * Dismiss a suggestion
   * @param {string} suggestionId - Suggestion ID
   * @param {string} category - Category name
   */
  async dismissSuggestion(suggestionId, category) {
    const state = useStore.getState();

    try {
      await state.rejectAISuggestion(suggestionId, category);
      this.render(); // Re-render after dismissing
    } catch (error) {
      console.error('AISuggestions: Failed to dismiss suggestion', error);
    }
  }

  /**
   * Preview a suggestion
   * @param {string} suggestionId - Suggestion ID
   */
  previewSuggestion(suggestionId) {
    // TODO: Implement preview functionality
    console.log('AISuggestions: Preview suggestion', suggestionId);
  }

  /**
   * Generate suggestions for a category
   * @param {string} category - Category name
   */
  async generateSuggestions(category) {
    const state = useStore.getState();

    try {
      await state.loadAISuggestions(category);
      this.render(); // Re-render after loading
    } catch (error) {
      console.error(`AISuggestions: Failed to generate ${category} suggestions`, error);
    }
  }

  /**
   * Refresh all suggestions
   */
  async refreshAll() {
    const state = useStore.getState();
    const categories = state.ai.settings.categories;

    for (const category of categories) {
      try {
        await state.loadAISuggestions(category);
      } catch (error) {
        console.error(`AISuggestions: Failed to refresh ${category}`, error);
      }
    }

    this.render();
  }

  /**
   * Open AI settings
   */
  openSettings() {
    // TODO: Implement settings modal
    console.log('AISuggestions: Open settings');
  }

  /**
   * Enable AI features
   */
  async enableAI() {
    const state = useStore.getState();

    try {
      await state.updateAISettings({ enabled: true });
      this.render();
    } catch (error) {
      console.error('AISuggestions: Failed to enable AI', error);
      alert(`Failed to enable AI features: ${error.message}`);
    }
  }

  /**
   * Handle suggestion received event
   * @param {Object} data - Event data
   */
  handleSuggestionReceived(data) {
    if (this.isDevelopment) {
      console.log('AISuggestions: Suggestion received', data);
    }
    this.render();
  }

  /**
   * Handle suggestion applied event
   * @param {Object} data - Event data
   */
  handleSuggestionApplied(data) {
    if (this.isDevelopment) {
      console.log('AISuggestions: Suggestion applied', data);
    }
    // Show success message
    this.showNotification('Suggestion applied successfully', 'success');
    this.render();
  }

  /**
   * Handle suggestion rejected event
   * @param {Object} data - Event data
   */
  handleSuggestionRejected(data) {
    if (this.isDevelopment) {
      console.log('AISuggestions: Suggestion rejected', data);
    }
    this.render();
  }

  /**
   * Handle loading state
   * @param {Object} data - Event data
   */
  handleLoadingState(data) {
    if (this.isDevelopment) {
      console.log('AISuggestions: Loading', data);
    }
    this.render();
  }

  /**
   * Handle error
   * @param {Object} data - Event data
   */
  handleError(data) {
    console.error('AISuggestions: Error', data);
    this.showNotification(data.error, 'error');
    this.render();
  }

  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info)
   */
  showNotification(message, type = 'info') {
    // TODO: Implement notification system or use WordPress notices
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  /**
   * Destroy the AI suggestions UI
   */
  destroy() {
    // Unsubscribe from all events
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
    this.unsubscribers = [];

    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }

    if (this.isDevelopment) {
      console.log('AISuggestions: Destroyed');
    }
  }
}

export default AISuggestions;
