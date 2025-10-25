# Event Contracts Documentation

## Overview

This document defines the contracts for all Event Bus events in the MASE system. Each event has a specific payload structure that subscribers can rely on.

**Status**: Task 12.3 Complete - Event contracts documented
**Date**: 2025-01-23
**Requirements**: 4.2, 9.1

## Event Contract Format

Each event contract includes:
- **Event Name**: The event identifier
- **Emitted By**: Which module emits this event
- **Payload**: The data structure passed with the event
- **When**: When the event is emitted
- **Subscribers**: Which modules typically subscribe to this event

## Settings Events

### `settings:changed`

**Emitted By**: State Manager

**Payload**:
```javascript
{
  path?: string,           // Dot-separated path (e.g., 'admin_bar.bg_color')
  value?: any,             // New value at path
  updates?: Object,        // Multiple settings updates
  settings: Object         // Complete settings object after change
}
```

**When**: After any setting value is updated via `updateSettings()` or `updateMultipleSettings()`

**Subscribers**: Preview Engine, Event Adapter

**Debounced**: Yes (100ms)

---

### `settings:save`

**Emitted By**: State Manager

**Payload**:
```javascript
{
  settings: Object         // Settings being saved
}
```

**When**: Before save operation starts

**Subscribers**: Event Adapter, UI components (loading states)

---

### `settings:saved`

**Emitted By**: State Manager

**Payload**:
```javascript
{
  settings: Object,        // Settings that were saved
  response: Object         // Server response
}
```

**When**: After successful save operation

**Subscribers**: Event Adapter, UI components (success messages)

---

### `settings:saveFailed`

**Emitted By**: State Manager

**Payload**:
```javascript
{
  settings: Object,        // Settings that failed to save
  error: string            // Error message
}
```

**When**: After failed save operation

**Subscribers**: Event Adapter, UI components (error messages)

---

### `settings:reset`

**Emitted By**: State Manager

**Payload**:
```javascript
{
  previousSettings: Object // Settings before reset
}
```

**When**: Before reset to defaults operation

**Subscribers**: Event Adapter, Backup Manager (auto-backup)

---

### `settings:resetComplete`

**Emitted By**: State Manager

**Payload**:
```javascript
{
  settings: Object         // Default settings after reset
}
```

**When**: After reset to defaults operation completes

**Subscribers**: Event Adapter, UI components (reload page)

---

### `settings:export`

**Emitted By**: Import/Export Module

**Payload**:
```javascript
{
  settings: Object,        // Settings being exported
  filename: string         // Export filename
}
```

**When**: When export operation starts

**Subscribers**: Event Adapter

---

### `settings:import`

**Emitted By**: Import/Export Module

**Payload**:
```javascript
{
  fileData: Object,        // Imported file data
  filename: string         // Import filename
}
```

**When**: When import operation starts

**Subscribers**: Event Adapter, Backup Manager (auto-backup)

---

### `settings:imported`

**Emitted By**: Import/Export Module

**Payload**:
```javascript
{
  settings: Object,        // Imported settings
  filename: string         // Import filename
}
```

**When**: After successful import operation

**Subscribers**: Event Adapter, UI components (reload page)

---

## Preview Events

### `preview:toggled`

**Emitted By**: Preview Engine

**Payload**:
```javascript
{
  enabled: boolean         // Whether preview is now enabled
}
```

**When**: When live preview is toggled on/off

**Subscribers**: Event Adapter, UI components (toggle state)

---

### `preview:update`

**Emitted By**: Event Adapter (in response to `settings:changed`)

**Payload**:
```javascript
{
  settings: Object         // Current settings to preview
}
```

**When**: When settings change and preview needs update

**Subscribers**: Preview Engine

**Debounced**: Yes (300ms via Event Adapter)

---

### `preview:updated`

**Emitted By**: Preview Engine

**Payload**:
```javascript
{
  css: string,             // Generated CSS
  duration: number         // Generation time in ms
}
```

**When**: After CSS is generated and applied

**Subscribers**: Event Adapter, Performance Monitor

---

## Palette Events

### `palette:apply`

**Emitted By**: Palette Manager

**Payload**:
```javascript
{
  paletteId: string,       // Palette ID to apply
  paletteName: string      // Palette display name
}
```

**When**: When palette application is requested

**Subscribers**: Event Adapter, API Client

---

### `palette:applied`

**Emitted By**: Palette Manager

**Payload**:
```javascript
{
  paletteId: string,       // Applied palette ID
  paletteName: string,     // Applied palette name
  colors: Object           // Palette colors
}
```

**When**: After successful palette application

**Subscribers**: Event Adapter, State Manager, UI components

---

### `palette:save`

**Emitted By**: Palette Manager

**Payload**:
```javascript
{
  name: string,            // Custom palette name
  colors: Object           // Palette colors
}
```

**When**: When custom palette save is requested

**Subscribers**: Event Adapter, API Client

---

### `palette:saved`

**Emitted By**: Palette Manager

**Payload**:
```javascript
{
  paletteId: string,       // Saved palette ID
  name: string,            // Palette name
  colors: Object           // Palette colors
}
```

**When**: After successful custom palette save

**Subscribers**: Event Adapter, UI components (reload page)

---

### `palette:delete`

**Emitted By**: Palette Manager

**Payload**:
```javascript
{
  paletteId: string        // Palette ID to delete
}
```

**When**: When palette deletion is requested

**Subscribers**: Event Adapter, API Client

---

### `palette:deleted`

**Emitted By**: Palette Manager

**Payload**:
```javascript
{
  paletteId: string        // Deleted palette ID
}
```

**When**: After successful palette deletion

**Subscribers**: Event Adapter, UI components (remove from UI)

---

## Template Events

### `template:apply`

**Emitted By**: Template Manager

**Payload**:
```javascript
{
  templateId: string,      // Template ID to apply
  templateName: string     // Template display name
}
```

**When**: When template application is requested

**Subscribers**: Event Adapter, API Client, Backup Manager (auto-backup)

---

### `template:applied`

**Emitted By**: Template Manager

**Payload**:
```javascript
{
  templateId: string,      // Applied template ID
  templateName: string,    // Applied template name
  settings: Object         // Template settings
}
```

**When**: After successful template application

**Subscribers**: Event Adapter, State Manager, UI components

---

### `template:save`

**Emitted By**: Template Manager

**Payload**:
```javascript
{
  name: string,            // Custom template name
  settings: Object         // Template settings snapshot
}
```

**When**: When custom template save is requested

**Subscribers**: Event Adapter, API Client

---

### `template:saved`

**Emitted By**: Template Manager

**Payload**:
```javascript
{
  templateId: string,      // Saved template ID
  name: string,            // Template name
  settings: Object         // Template settings
}
```

**When**: After successful custom template save

**Subscribers**: Event Adapter, UI components (reload page)

---

### `template:delete`

**Emitted By**: Template Manager

**Payload**:
```javascript
{
  templateId: string       // Template ID to delete
}
```

**When**: When template deletion is requested

**Subscribers**: Event Adapter, API Client

---

### `template:deleted`

**Emitted By**: Template Manager

**Payload**:
```javascript
{
  templateId: string       // Deleted template ID
}
```

**When**: After successful template deletion

**Subscribers**: Event Adapter, UI components (remove from UI)

---

## Dark Mode Events

### `darkMode:toggled`

**Emitted By**: Dark Mode Sync Module

**Payload**:
```javascript
{
  enabled: boolean         // Whether dark mode is now enabled
}
```

**When**: When dark mode is toggled on/off

**Subscribers**: Event Adapter, UI components

---

### `darkMode:applied`

**Emitted By**: Dark Mode Sync Module

**Payload**:
```javascript
{
  enabled: boolean,        // Dark mode state
  source: string           // 'header' or 'master' toggle
}
```

**When**: After dark mode state is applied to DOM

**Subscribers**: Event Adapter, State Manager

---

## Tab Events

### `tab:switch`

**Emitted By**: Tab Navigation Module

**Payload**:
```javascript
{
  tabId: string,           // Tab ID to switch to
  previousTabId: string    // Previous active tab ID
}
```

**When**: When tab switch is requested

**Subscribers**: Event Adapter

---

### `tab:switched`

**Emitted By**: Tab Navigation Module

**Payload**:
```javascript
{
  tabId: string,           // New active tab ID
  previousTabId: string    // Previous active tab ID
}
```

**When**: After tab switch completes

**Subscribers**: Event Adapter, UI components (load tab content)

---

## Backup Events

### `backup:create`

**Emitted By**: Backup Manager

**Payload**:
```javascript
{
  trigger: string          // 'manual', 'template_apply', or 'import'
}
```

**When**: When backup creation is requested

**Subscribers**: Event Adapter, API Client

---

### `backup:created`

**Emitted By**: Backup Manager

**Payload**:
```javascript
{
  backupId: string,        // Created backup ID
  timestamp: number,       // Backup timestamp
  trigger: string          // Backup trigger
}
```

**When**: After successful backup creation

**Subscribers**: Event Adapter, UI components (update backup list)

---

### `backup:restore`

**Emitted By**: Backup Manager

**Payload**:
```javascript
{
  backupId: string         // Backup ID to restore
}
```

**When**: When backup restoration is requested

**Subscribers**: Event Adapter, API Client

---

### `backup:restored`

**Emitted By**: Backup Manager

**Payload**:
```javascript
{
  backupId: string,        // Restored backup ID
  settings: Object         // Restored settings
}
```

**When**: After successful backup restoration

**Subscribers**: Event Adapter, State Manager, UI components (reload page)

---

## Keyboard Shortcut Events

### `shortcut:palette`

**Emitted By**: Keyboard Shortcuts Module

**Payload**:
```javascript
{
  paletteIndex: number     // Palette index (0-9)
}
```

**When**: When palette shortcut (Ctrl+Shift+1-0) is triggered

**Subscribers**: Event Adapter, Palette Manager

---

### `shortcut:theme`

**Emitted By**: Keyboard Shortcuts Module

**Payload**:
```javascript
{
  currentPaletteId: string // Current palette ID
}
```

**When**: When theme toggle shortcut (Ctrl+Shift+T) is triggered

**Subscribers**: Event Adapter, Palette Manager

---

### `shortcut:focus`

**Emitted By**: Keyboard Shortcuts Module

**Payload**:
```javascript
{
  enabled: boolean         // New focus mode state
}
```

**When**: When focus mode shortcut (Ctrl+Shift+F) is triggered

**Subscribers**: Event Adapter, State Manager

---

### `shortcut:performance`

**Emitted By**: Keyboard Shortcuts Module

**Payload**:
```javascript
{
  enabled: boolean         // New performance mode state
}
```

**When**: When performance mode shortcut (Ctrl+Shift+P) is triggered

**Subscribers**: Event Adapter, State Manager

---

## Error Events

### `error:occurred`

**Emitted By**: Event Bus (automatically on handler errors)

**Payload**:
```javascript
{
  event: string,           // Event that triggered the error
  listenerEvent: string,   // Listener event pattern
  error: Error,            // Error object
  handler: string          // Handler function name
}
```

**When**: When an event handler throws an error

**Subscribers**: Event Adapter, Error Tracking Service

---

## Wildcard Subscriptions

The Event Bus supports wildcard subscriptions for monitoring groups of events:

### `settings:*`
Matches all settings events: `settings:changed`, `settings:save`, `settings:saved`, etc.

### `palette:*`
Matches all palette events: `palette:apply`, `palette:applied`, `palette:save`, etc.

### `template:*`
Matches all template events: `template:apply`, `template:applied`, `template:save`, etc.

### `*`
Matches all events (use with caution - high frequency)

## Event Timing

### Debounced Events
These events are debounced to prevent excessive emissions:
- `settings:changed` - 100ms debounce
- `preview:update` - 300ms debounce (via Event Adapter)

### Immediate Events
These events are emitted immediately:
- All save/load events
- All apply/delete events
- All error events
- All shortcut events

## Event Ordering

Events are emitted in this order for common operations:

### Settings Save
1. `settings:save`
2. `settings:saved` (on success) OR `settings:saveFailed` (on error)

### Settings Reset
1. `settings:reset`
2. `settings:resetComplete`

### Palette Application
1. `palette:apply`
2. `palette:applied`
3. `settings:changed` (triggered by Event Adapter)
4. `preview:update` (triggered by Event Adapter)

### Template Application
1. `backup:create` (if auto-backup enabled)
2. `backup:created`
3. `template:apply`
4. `template:applied`
5. `settings:changed` (triggered by Event Adapter)
6. `preview:update` (triggered by Event Adapter)

## Migration Notes

### Legacy Compatibility
The Event Adapter bridges legacy jQuery event handlers with the Event Bus. During migration:
- Legacy code continues to work unchanged
- Modern modules subscribe to Event Bus events
- Event Adapter translates between the two systems

### Gradual Migration Path
1. **Phase 1** (Complete): Event Bus and Event Adapter implemented
2. **Phase 2** (Complete): State Manager emits events
3. **Phase 3** (In Progress): Refactor legacy handlers to emit events
4. **Phase 4** (Future): Remove Event Adapter once migration complete

## Testing

### Event Flow Testing
Test event propagation:
```javascript
// Subscribe to event
const unsubscribe = eventBus.on('settings:changed', (data) => {
  console.log('Settings changed:', data);
});

// Trigger event
stateManager.updateSettings('admin_bar.bg_color', '#ff0000');

// Verify event was emitted
// Cleanup
unsubscribe();
```

### Event Isolation Testing
Test error isolation:
```javascript
// Subscribe with failing handler
eventBus.on('test:event', () => {
  throw new Error('Handler failed');
});

// Subscribe with working handler
eventBus.on('test:event', (data) => {
  console.log('This should still run:', data);
});

// Emit event - second handler should still execute
eventBus.emit('test:event', { test: true });
```

## References

- Requirements: 4.2, 9.1, 9.2
- Design: Event Bus Module (design.md)
- Tasks: 12.1, 12.2, 12.3
- Implementation: event-bus.js, event-adapter.js, state-manager.js
