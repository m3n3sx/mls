/**
 * Event Adapter Module
 *
 * Bridges legacy jQuery event handlers with modern Event Bus architecture.
 * Provides backward compatibility while migrating to event-driven design.
 *
 * @module event-adapter
 */

import eventBus, { EVENTS } from './event-bus.js';

/**
 * EventAdapter class
 *
 * Converts jQuery event handlers to Event Bus subscriptions.
 * Maintains backward compatibility during migration.
 */
export class EventAdapter {
  constructor() {
    this.subscriptions = [];
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Initialize event adapter
   * Sets up all event subscriptions
   */
  init() {
    if (this.isDevelopment) {
      console.log('[EventAdapter] Initializing event adapter...');
    }

    // Subscribe to all Event Bus events
    this.subscribeToSettingsEvents();
    this.subscribeToPreviewEvents();
    this.subscribeToPaletteEvents();
    this.subscribeToTemplateEvents();
    this.subscribeToDarkModeEvents();
    this.subscribeToTabEvents();
    this.subscribeToBackupEvents();
    this.subscribeToShortcutEvents();
    this.subscribeToErrorEvents();

    if (this.isDevelopment) {
      console.log('[EventAdapter] Event adapter initialized');
    }
  }

  /**
   * Subscribe to settings events
   */
  subscribeToSettingsEvents() {
    // Settings changed - trigger live preview update
    this.subscribe(EVENTS.SETTINGS_CHANGED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Settings changed:', data);
      }
      // Emit preview update event
      eventBus.emitDebounced(EVENTS.PREVIEW_UPDATE, data, 300);
    });

    // Settings save - show loading state
    this.subscribe(EVENTS.SETTINGS_SAVE, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Settings save requested:', data);
      }
      // Legacy code will handle the actual save
    });

    // Settings saved - show success message
    this.subscribe(EVENTS.SETTINGS_SAVED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Settings saved successfully:', data);
      }
      // Legacy code will show success notice
    });

    // Settings save failed - show error message
    this.subscribe(EVENTS.SETTINGS_SAVE_FAILED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Settings save failed:', data);
      }
      // Legacy code will show error notice
    });

    // Settings reset - clear all settings
    this.subscribe(EVENTS.SETTINGS_RESET, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Settings reset requested:', data);
      }
      // Legacy code will handle reset
    });

    // Settings reset complete - reload page
    this.subscribe(EVENTS.SETTINGS_RESET_COMPLETE, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Settings reset complete:', data);
      }
      // Legacy code will reload page
    });
  }

  /**
   * Subscribe to preview events
   */
  subscribeToPreviewEvents() {
    // Preview toggled - enable/disable live preview
    this.subscribe(EVENTS.PREVIEW_TOGGLED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Preview toggled:', data);
      }
      // Legacy code will handle toggle
    });

    // Preview update - regenerate CSS
    this.subscribe(EVENTS.PREVIEW_UPDATE, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Preview update requested:', data);
      }
      // Legacy code will regenerate CSS
    });

    // Preview updated - CSS applied
    this.subscribe(EVENTS.PREVIEW_UPDATED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Preview updated:', data);
      }
    });
  }

  /**
   * Subscribe to palette events
   */
  subscribeToPaletteEvents() {
    // Palette apply - apply color palette
    this.subscribe(EVENTS.PALETTE_APPLY, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Palette apply requested:', data);
      }
      // Legacy code will handle apply
    });

    // Palette applied - update UI
    this.subscribe(EVENTS.PALETTE_APPLIED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Palette applied:', data);
      }
      // Emit settings changed event
      eventBus.emit(EVENTS.SETTINGS_CHANGED, { palette: data });
    });

    // Palette save - save custom palette
    this.subscribe(EVENTS.PALETTE_SAVE, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Palette save requested:', data);
      }
      // Legacy code will handle save
    });

    // Palette saved - update UI
    this.subscribe(EVENTS.PALETTE_SAVED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Palette saved:', data);
      }
    });

    // Palette delete - delete custom palette
    this.subscribe(EVENTS.PALETTE_DELETE, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Palette delete requested:', data);
      }
      // Legacy code will handle delete
    });

    // Palette deleted - update UI
    this.subscribe(EVENTS.PALETTE_DELETED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Palette deleted:', data);
      }
    });
  }

  /**
   * Subscribe to template events
   */
  subscribeToTemplateEvents() {
    // Template apply - apply template
    this.subscribe(EVENTS.TEMPLATE_APPLY, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Template apply requested:', data);
      }
      // Legacy code will handle apply
    });

    // Template applied - update UI
    this.subscribe(EVENTS.TEMPLATE_APPLIED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Template applied:', data);
      }
      // Emit settings changed event
      eventBus.emit(EVENTS.SETTINGS_CHANGED, { template: data });
    });

    // Template save - save custom template
    this.subscribe(EVENTS.TEMPLATE_SAVE, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Template save requested:', data);
      }
      // Legacy code will handle save
    });

    // Template saved - update UI
    this.subscribe(EVENTS.TEMPLATE_SAVED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Template saved:', data);
      }
    });

    // Template delete - delete custom template
    this.subscribe(EVENTS.TEMPLATE_DELETE, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Template delete requested:', data);
      }
      // Legacy code will handle delete
    });

    // Template deleted - update UI
    this.subscribe(EVENTS.TEMPLATE_DELETED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Template deleted:', data);
      }
    });
  }

  /**
   * Subscribe to dark mode events
   */
  subscribeToDarkModeEvents() {
    // Dark mode toggled - toggle dark mode
    this.subscribe(EVENTS.DARK_MODE_TOGGLED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Dark mode toggled:', data);
      }
      // Legacy code will handle toggle
    });

    // Dark mode applied - update UI
    this.subscribe(EVENTS.DARK_MODE_APPLIED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Dark mode applied:', data);
      }
      // Emit settings changed event
      eventBus.emit(EVENTS.SETTINGS_CHANGED, { darkMode: data });
    });
  }

  /**
   * Subscribe to tab events
   */
  subscribeToTabEvents() {
    // Tab switch - switch to tab
    this.subscribe(EVENTS.TAB_SWITCH, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Tab switch requested:', data);
      }
      // Legacy code will handle switch
    });

    // Tab switched - update UI
    this.subscribe(EVENTS.TAB_SWITCHED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Tab switched:', data);
      }
    });
  }

  /**
   * Subscribe to backup events
   */
  subscribeToBackupEvents() {
    // Backup create - create backup
    this.subscribe(EVENTS.BACKUP_CREATE, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Backup create requested:', data);
      }
      // Legacy code will handle create
    });

    // Backup created - update UI
    this.subscribe(EVENTS.BACKUP_CREATED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Backup created:', data);
      }
    });

    // Backup restore - restore backup
    this.subscribe(EVENTS.BACKUP_RESTORE, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Backup restore requested:', data);
      }
      // Legacy code will handle restore
    });

    // Backup restored - reload page
    this.subscribe(EVENTS.BACKUP_RESTORED, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Backup restored:', data);
      }
      // Legacy code will reload page
    });
  }

  /**
   * Subscribe to keyboard shortcut events
   */
  subscribeToShortcutEvents() {
    // Shortcut palette - switch palette
    this.subscribe(EVENTS.SHORTCUT_PALETTE, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Palette shortcut triggered:', data);
      }
      // Legacy code will handle shortcut
    });

    // Shortcut theme - toggle theme
    this.subscribe(EVENTS.SHORTCUT_THEME, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Theme shortcut triggered:', data);
      }
      // Legacy code will handle shortcut
    });

    // Shortcut focus - toggle focus mode
    this.subscribe(EVENTS.SHORTCUT_FOCUS, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Focus shortcut triggered:', data);
      }
      // Legacy code will handle shortcut
    });

    // Shortcut performance - toggle performance mode
    this.subscribe(EVENTS.SHORTCUT_PERFORMANCE, (data) => {
      if (this.isDevelopment) {
        console.log('[EventAdapter] Performance shortcut triggered:', data);
      }
      // Legacy code will handle shortcut
    });
  }

  /**
   * Subscribe to error events
   */
  subscribeToErrorEvents() {
    // Error occurred - log error
    this.subscribe(EVENTS.ERROR_OCCURRED, (data) => {
      console.error('[EventAdapter] Error occurred:', data);
      // Legacy code will show error notice
    });
  }

  /**
   * Subscribe to an event and track subscription
   *
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   */
  subscribe(event, handler) {
    const unsubscribe = eventBus.on(event, handler);
    this.subscriptions.push({ event, unsubscribe });
  }

  /**
   * Unsubscribe from all events
   */
  destroy() {
    if (this.isDevelopment) {
      console.log('[EventAdapter] Destroying event adapter...');
    }

    this.subscriptions.forEach(({ unsubscribe }) => {
      unsubscribe();
    });

    this.subscriptions = [];

    if (this.isDevelopment) {
      console.log('[EventAdapter] Event adapter destroyed');
    }
  }
}

// Create singleton instance
const eventAdapter = new EventAdapter();

export default eventAdapter;
