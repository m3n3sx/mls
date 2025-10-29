/**
 * Module Exports
 *
 * Central export point for all MASE modules.
 * Provides clean imports throughout the application.
 *
 * @module index
 */

// Core modules
export { default as MASEAdmin } from './main-admin.js';
export { useStore } from './state-manager.js';
export { default as EventBus, EVENTS } from './event-bus.js';
export { default as EventAdapter } from './event-adapter.js';
export { default as APIClient } from './api-client.js';

// Feature modules
export { default as PreviewEngine } from './preview-engine.js';
export { default as ColorSystem } from './color-system.js';
export { default as Typography } from './typography.js';
export { default as Animations, Easing, CSSEasing } from './animations.js';
export { default as TemplateManager } from './template-manager.js';
export { default as PaletteManager } from './palette-manager.js';
export { default as AISuggestions } from './ai-suggestions.js';

// Animation editor modules
export {
  default as AnimationTimeline,
  AnimationTrack,
  Keyframe,
  TimelineUI,
} from './animation-timeline.js';
export {
  default as AnimationPresets,
  AnimationPresetsLibrary,
  AnimationPreset,
  PresetBrowserUI,
} from './animation-presets.js';

// UI initialization
export { initializeUI } from './ui-init.js';
