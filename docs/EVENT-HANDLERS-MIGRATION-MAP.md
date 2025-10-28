# Event Handlers Migration Map

## Overview

This document maps all jQuery event handlers in the legacy `mase-admin.js` file to their new Event Bus-based architecture. This is part of Task 12: Migrate event handlers to Event Bus.

**Status**: Task 12.1 Complete - All event handlers identified and documented
**Date**: 2025-01-23
**Requirements**: 9.1

## Event Handler Categories

### 1. Form Input Events (Live Preview)

**Purpose**: Update live preview when form inputs change

| Selector | Event | Handler | Module | Dependencies |
|----------|-------|---------|--------|--------------|
| `.mase-color-picker` | `change.livepreview` | `livePreview.update()` | livePreview | state-manager |
| `#mase-settings-form input[type="range"]` | `input.livepreview` | `livePreview.update()` | livePreview | state-manager |
| `#mase-settings-form input[type="text"]` | `input.livepreview` | `livePreview.update()` | livePreview | state-manager |
| `#mase-settings-form input[type="number"]` | `input.livepreview` | `livePreview.update()` | livePreview | state-manager |
| `#mase-settings-form select` | `change.livepreview` | `livePreview.update()` | livePreview | state-manager |
| `#admin-menu-height-mode` | `change.livepreview` | `livePreview.update()` | livePreview | state-manager |
| `.mase-checkbox, .mase-radio` | `change.livepreview` | `livePreview.update()` | livePreview | state-manager |

**Migration Strategy**: 
- Convert to Event Bus events: `settings:changed`, `preview:update`
- State Manager emits `settings:changed` on any setting update
- Preview Engine subscribes to `settings:changed` and regenerates CSS

### 2. UI Toggle Events

**Purpose**: Toggle features on/off

| Selector | Event | Handler | Module | Dependencies |
|----------|-------|---------|--------|--------------|
| `#mase-live-preview-toggle` | `change` | Toggle live preview | livePreview | state-manager |
| `#mase-dark-mode-toggle` | `change` | Sync dark mode | darkModeSync | state-manager |
| `#master-dark-mode` | `change` | Sync dark mode | darkModeSync | state-manager |

**Migration Strategy**:
- Convert to Event Bus events: `preview:toggled`, `darkMode:toggled`
- State Manager emits events when UI state changes
- Modules subscribe to toggle events and update accordingly

### 3. Palette Management Events

**Purpose**: Apply, save, and delete color palettes

| Selector | Event | Handler | Module | Dependencies |
|----------|-------|---------|--------|--------------|
| `.mase-palette-apply-btn` | `click` | `paletteManager.apply()` | paletteManager | api-client, state-manager |
| `.mase-palette-card` | `click.mase-palette` | `handlePaletteClick()` | paletteManager | api-client, state-manager |
| `.mase-palette-card` | `keydown.mase-palette` | `handlePaletteKeydown()` | paletteManager | api-client, state-manager |
| `.mase-palette-card` | `mouseenter.mase-palette` | Hover effect | paletteManager | - |
| `.mase-palette-card` | `mouseleave.mase-palette` | Hover effect | paletteManager | - |
| `#mase-save-custom-palette-btn` | `click` | `paletteManager.save()` | paletteManager | api-client, state-manager |
| `.mase-palette-delete-btn` | `click` | `paletteManager.delete()` | paletteManager | api-client, state-manager |

**Migration Strategy**:
- Convert to Event Bus events: `palette:apply`, `palette:save`, `palette:delete`, `palette:applied`
- API Client handles AJAX requests
- State Manager updates on successful palette application
- Event Bus broadcasts `palette:applied` for UI updates

### 4. Template Management Events

**Purpose**: Apply, save, and delete templates

| Selector | Event | Handler | Module | Dependencies |
|----------|-------|---------|--------|--------------|
| `.mase-template-apply-btn` | `click.mase-template` | `templateManager.handleTemplateApply()` | templateManager | api-client, state-manager |
| `.mase-template-card` | `mouseenter.mase-template` | Hover effect | templateManager | - |
| `.mase-template-card` | `mouseleave.mase-template` | Hover effect | templateManager | - |
| `#mase-save-custom-template-btn` | `click` | `templateManager.save()` | templateManager | api-client, state-manager |
| `.mase-template-delete-btn` | `click` | `templateManager.delete()` | templateManager | api-client, state-manager |

**Migration Strategy**:
- Convert to Event Bus events: `template:apply`, `template:save`, `template:delete`, `template:applied`
- API Client handles AJAX requests
- State Manager updates on successful template application
- Event Bus broadcasts `template:applied` for UI updates

### 5. Import/Export Events

**Purpose**: Import and export settings

| Selector | Event | Handler | Module | Dependencies |
|----------|-------|---------|--------|--------------|
| `#mase-export-settings` | `click` | `importExport.export()` | importExport | api-client |
| `#mase-import-settings` | `click` | `importExport.openFileDialog()` | importExport | api-client, state-manager |
| `#mase-import-file` | `change` | `importExport.handleFileSelect()` | importExport | api-client, state-manager |

**Migration Strategy**:
- Convert to Event Bus events: `settings:export`, `settings:import`, `settings:imported`
- API Client handles file operations
- State Manager updates on successful import
- Event Bus broadcasts `settings:imported` for UI refresh

### 6. Backup Management Events

**Purpose**: Create and restore backups

| Selector | Event | Handler | Module | Dependencies |
|----------|-------|---------|--------|--------------|
| `#mase-create-backup` | `click` | `backupManager.create()` | backupManager | api-client |
| `#mase-restore-backup` | `click` | `backupManager.restore()` | backupManager | api-client, state-manager |
| `#mase-backup-list` | `change` | Enable restore button | backupManager | - |

**Migration Strategy**:
- Convert to Event Bus events: `backup:create`, `backup:restore`, `backup:created`, `backup:restored`
- API Client handles backup operations
- State Manager updates on successful restore
- Event Bus broadcasts `backup:restored` for UI refresh

### 7. Tab Navigation Events

**Purpose**: Switch between settings tabs

| Selector | Event | Handler | Module | Dependencies |
|----------|-------|---------|--------|--------------|
| `.mase-tab-button` | `click` | `tabNavigation.switchTab()` | tabNavigation | - |
| `[data-switch-tab]` | `click` | `tabNavigation.switchTab()` | tabNavigation | - |
| `.mase-tab-button` | `keydown` | Keyboard navigation | tabNavigation | - |

**Migration Strategy**:
- Convert to Event Bus events: `tab:switch`, `tab:switched`
- Tab Navigation module emits `tab:switched` when tab changes
- Other modules can subscribe to load tab-specific content

### 8. Keyboard Shortcuts Events

**Purpose**: Handle keyboard shortcuts

| Selector | Event | Handler | Module | Dependencies |
|----------|-------|---------|--------|--------------|
| `document` | `keydown.mase-shortcuts` | `keyboardShortcuts.handle()` | keyboardShortcuts | paletteManager, darkModeSync |

**Migration Strategy**:
- Convert to Event Bus events: `shortcut:palette`, `shortcut:theme`, `shortcut:focus`, `shortcut:performance`
- Keyboard Shortcuts module emits events
- Other modules subscribe to shortcut events

### 9. Form Submission Events

**Purpose**: Save settings to server

| Selector | Event | Handler | Module | Dependencies |
|----------|-------|---------|--------|--------------|
| `#mase-settings-form` | `submit` | `handleSubmit()` | MASE | api-client, state-manager |

**Migration Strategy**:
- Convert to Event Bus events: `settings:save`, `settings:saved`, `settings:saveFailed`
- State Manager emits `settings:save` when form submitted
- API Client handles save operation
- Event Bus broadcasts `settings:saved` or `settings:saveFailed`

### 10. Utility Events

**Purpose**: Miscellaneous UI interactions

| Selector | Event | Handler | Module | Dependencies |
|----------|-------|---------|--------|--------------|
| `.mase-slider` | `input` | Update slider value display | MASE | - |
| `input, select, textarea, button` | `mouseup` | Remove focus rings | MASE | - |
| `#mase-reset-all` | `click` | `resetToDefaults()` | MASE | api-client, state-manager |
| `window` | `beforeunload` | Warn unsaved changes | MASE | state-manager |
| `window` | `load` | Add `.mase-loaded` class | MASE | - |
| Color picker fallback | `change input` | Sync with color picker | MASE | - |

**Migration Strategy**:
- Convert to Event Bus events: `settings:reset`, `settings:resetComplete`
- State Manager emits `settings:reset` when reset requested
- API Client handles reset operation
- Event Bus broadcasts `settings:resetComplete` for UI refresh

## Event Bus Event Types

Based on the analysis above, here are the Event Bus event types to implement:

### Settings Events
- `settings:changed` - Any setting value changed
- `settings:save` - Save settings requested
- `settings:saved` - Settings saved successfully
- `settings:saveFailed` - Settings save failed
- `settings:reset` - Reset to defaults requested
- `settings:resetComplete` - Reset completed
- `settings:export` - Export settings requested
- `settings:import` - Import settings requested
- `settings:imported` - Settings imported successfully

### Preview Events
- `preview:toggled` - Live preview toggled on/off
- `preview:update` - Preview update requested
- `preview:updated` - Preview updated successfully

### Palette Events
- `palette:apply` - Apply palette requested
- `palette:applied` - Palette applied successfully
- `palette:save` - Save custom palette requested
- `palette:saved` - Custom palette saved
- `palette:delete` - Delete palette requested
- `palette:deleted` - Palette deleted

### Template Events
- `template:apply` - Apply template requested
- `template:applied` - Template applied successfully
- `template:save` - Save custom template requested
- `template:saved` - Custom template saved
- `template:delete` - Delete template requested
- `template:deleted` - Template deleted

### Dark Mode Events
- `darkMode:toggled` - Dark mode toggled on/off
- `darkMode:applied` - Dark mode state applied

### Tab Events
- `tab:switch` - Tab switch requested
- `tab:switched` - Tab switched successfully

### Backup Events
- `backup:create` - Create backup requested
- `backup:created` - Backup created successfully
- `backup:restore` - Restore backup requested
- `backup:restored` - Backup restored successfully

### Keyboard Shortcut Events
- `shortcut:palette` - Palette shortcut triggered
- `shortcut:theme` - Theme toggle shortcut triggered
- `shortcut:focus` - Focus mode shortcut triggered
- `shortcut:performance` - Performance mode shortcut triggered

### Error Events
- `error:occurred` - Error occurred in any module

## Module Dependencies

### Current Dependencies (Tight Coupling)
- `livePreview` → `state-manager` (direct access)
- `paletteManager` → `api-client`, `state-manager` (direct access)
- `templateManager` → `api-client`, `state-manager` (direct access)
- `importExport` → `api-client`, `state-manager` (direct access)
- `backupManager` → `api-client` (direct access)
- `darkModeSync` → `state-manager` (direct access)
- `keyboardShortcuts` → `paletteManager`, `darkModeSync` (direct access)

### New Dependencies (Event Bus)
- All modules → `event-bus` (subscribe/emit)
- No direct module-to-module dependencies
- Loose coupling via events

## Migration Phases

### Phase 1: State Manager Events (Task 12.3)
1. Update State Manager to emit events on state changes
2. Add event types for all state mutations
3. Document event contracts

### Phase 2: Refactor Handlers (Task 12.2)
1. Convert direct function calls to event emissions
2. Update handlers to subscribe to events
3. Remove tight coupling between components

### Phase 3: Testing
1. Test event propagation across modules
2. Test event ordering and timing
3. Test error isolation

## Notes

- All event handlers use jQuery's `.on()` method
- Many handlers use namespaced events (e.g., `.livepreview`, `.mase-palette`)
- Some handlers use event delegation with `$(document).on()`
- Debouncing is used for high-frequency events (input, change)
- Error handling is implemented with try-catch blocks
- AJAX request locking prevents duplicate submissions

## References

- Requirements: 9.1, 9.2
- Design: Event Bus Module (design.md)
- Tasks: 12.1, 12.2, 12.3
