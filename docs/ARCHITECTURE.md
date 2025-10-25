# MASE Modern Architecture Documentation

## Overview

The Modern Admin Styler (MASE) plugin has been refactored from a monolithic 3000+ line JavaScript file into a modular, scalable architecture. This document describes the module structure, responsibilities, interfaces, and data flow.

## Architecture Principles

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Loose Coupling**: Modules communicate via Event Bus, not direct dependencies
3. **Centralized State**: Single source of truth via State Manager
4. **Progressive Enhancement**: Feature flags enable gradual rollout
5. **Testability**: All modules are unit-testable in isolation

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     WordPress Admin                          │
│                  (wp-admin/admin.php)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  PHP Layer (Server-Side)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ MASE_Admin   │  │MASE_Settings │  │ MASE_REST_API│     │
│  │ (Asset Load) │  │ (CRUD Ops)   │  │ (Endpoints)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (wp_localize_script)
┌─────────────────────────────────────────────────────────────┐
│                JavaScript Layer (Client-Side)                │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            MASE Main Entry Point                     │   │
│  │              (main-admin.js)                         │   │
│  │  - Initialization sequence                           │   │
│  │  - Module registration                               │   │
│  │  - Feature flag integration                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│                ┌─────────────┼─────────────┐               │
│                ▼             ▼             ▼               │
│       ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│       │State Manager │  │  Event Bus   │  │  API Client  ││
│       │  (Zustand)   │  │  (PubSub)    │  │  (REST)      ││
│       │              │  │              │  │              ││
│       │ - Settings   │  │ - Subscribe  │  │ - GET/POST   ││
│       │ - UI State   │  │ - Publish    │  │ - Retry      ││
│       │ - History    │  │ - Namespace  │  │ - Queue      ││
│       └──────────────┘  └──────────────┘  └──────────────┘│
│                │                │                │          │
│        ┌───────┴────────┬───────┴────────┬───────┴────────┐│
│        ▼                ▼                ▼                ▼│
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ │Preview Engine│ │Color System  │ │ Typography   │ │ Animations   │
│ │              │ │              │ │              │ │              │
│ │ - CSS Gen    │ │ - Palettes   │ │ - Font Load  │ │ - Effects    │
│ │ - DOM Inject │ │ - Contrast   │ │ - Fluid Type │ │ - Easing     │
│ │ - Toggle     │ │ - A11y Check │ │ - Caching    │ │ - Reduced    │
│ │              │ │              │ │              │ │   Motion     │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
│        │                │                │                │          │
│        └────────────────┴────────────────┴────────────────┘          │
│                              │                                        │
└──────────────────────────────┼────────────────────────────────────────┘
                              ▼
                    ┌──────────────────┐
                    │   DOM / Browser  │
                    │  - CSS Injection │
                    │  - Event Handling│
                    │  - Font Loading  │
                    └──────────────────┘
```

## Module Dependency Graph

```
main-admin.js (Entry Point)
│
├── state-manager.js (Foundation - No Dependencies)
│   └── Zustand library
│
├── event-bus.js (Foundation - No Dependencies)
│
├── api-client.js
│   └── state-manager.js (for loading states)
│
├── preview-engine.js
│   ├── state-manager.js (subscribes to settings changes)
│   └── event-bus.js (emits preview events)
│
├── color-system.js
│   ├── state-manager.js (reads/writes color settings)
│   └── event-bus.js (emits color events)
│
├── typography.js
│   ├── state-manager.js (reads/writes typography settings)
│   └── event-bus.js (emits font loaded events)
│
├── animations.js
│   ├── state-manager.js (reads animation preferences)
│   └── event-bus.js (emits animation events)
│
├── palette-manager.js
│   ├── state-manager.js
│   ├── event-bus.js
│   ├── api-client.js
│   └── color-system.js
│
└── template-manager.js
    ├── state-manager.js
    ├── event-bus.js
    └── api-client.js
```

## Core Modules

### 1. State Manager (`state-manager.js`)

**Responsibility**: Centralized state management with undo/redo capability

**Key Features**:
- Single source of truth for all application state
- Immutable state updates using Zustand
- Automatic history tracking (50 states)
- Selective subscriptions to prevent unnecessary re-renders
- Persistence to WordPress options via API Client

**State Structure**:
```javascript
{
  settings: {
    colors: { primary, secondary, accent, ... },
    typography: { fontFamily, fontSize, ... },
    effects: { borderRadius, shadows, ... },
    templates: { active, custom },
    advanced: { customCSS, performance }
  },
  ui: {
    activeTab: string,
    isDirty: boolean,
    isPreviewMode: boolean,
    loading: boolean
  },
  history: {
    past: MASEState[],
    future: MASEState[]
  }
}
```

**Public API**:
```javascript
// State access
const state = useStore.getState();
const settings = useStore(state => state.settings);

// State updates
updateSettings(path, value)  // Update nested setting
undo()                       // Restore previous state
redo()                       // Restore next state
resetToDefaults()            // Reset all settings

// Persistence
loadFromServer()             // Load from WordPress
saveToServer()               // Save to WordPress (debounced)
```

**Dependencies**: None (foundation module)

**Used By**: All feature modules

---

### 2. Event Bus (`event-bus.js`)

**Responsibility**: Decoupled communication between modules

**Key Features**:
- Publish-subscribe pattern
- Event namespacing to prevent conflicts
- Error isolation (one handler failure doesn't affect others)
- Development mode logging
- Wildcard subscriptions for monitoring

**Event Types**:
```javascript
EVENTS = {
  // Settings
  'settings:changed',
  'settings:loaded',
  'settings:saved',
  'settings:reset',
  
  // Preview
  'preview:update',
  'preview:toggled',
  'preview:cleared',
  
  // Colors
  'color:selected',
  'palette:applied',
  'palette:preview',
  
  // Typography
  'font:loading',
  'font:loaded',
  'font:failed',
  
  // Templates
  'template:applied',
  'template:preview',
  
  // System
  'mase:ready',
  'mase:error',
  'save:started',
  'save:completed',
  'save:failed'
}
```

**Public API**:
```javascript
// Subscribe to events
const unsubscribe = eventBus.on('event:name', (data) => {
  // Handle event
});

// Subscribe once
eventBus.once('event:name', handler);

// Publish events
eventBus.emit('event:name', { data });

// Unsubscribe
unsubscribe();
eventBus.off('event:name');

// Clear all
eventBus.clear();
```

**Dependencies**: None (foundation module)

**Used By**: All feature modules

---

### 3. API Client (`api-client.js`)

**Responsibility**: Unified WordPress REST API communication

**Key Features**:
- Automatic nonce handling and refresh
- Request queuing to prevent conflicts
- Exponential backoff retry logic (3 attempts)
- Response validation and error handling
- Request deduplication
- Future WebSocket support

**Endpoints**:
```javascript
// Settings
GET    /wp-json/mase/v1/settings
POST   /wp-json/mase/v1/settings
DELETE /wp-json/mase/v1/settings (reset)

// Templates
GET    /wp-json/mase/v1/templates
POST   /wp-json/mase/v1/templates/:id/apply

// Palettes
GET    /wp-json/mase/v1/palettes
POST   /wp-json/mase/v1/palettes/:id/apply
```

**Public API**:
```javascript
// Settings
await apiClient.getSettings()
await apiClient.saveSettings(settings)
await apiClient.resetSettings()

// Templates
await apiClient.getTemplates()
await apiClient.applyTemplate(templateId)

// Palettes
await apiClient.getPalettes()
await apiClient.applyPalette(paletteId)

// Configuration
apiClient.setTimeout(ms)
apiClient.setRetries(count)
```

**Dependencies**: 
- `state-manager.js` (for loading states)

**Used By**: 
- `state-manager.js` (persistence)
- `palette-manager.js` (palette operations)
- `template-manager.js` (template operations)

---

## Feature Modules

### 4. Preview Engine (`preview-engine.js`)

**Responsibility**: Real-time CSS generation and DOM injection

**Key Features**:
- Sub-50ms CSS generation using template literals
- CSS custom properties for dynamic theming
- Incremental updates (only regenerate changed sections)
- CSS minification in production
- Preview mode toggle

**CSS Generation Pipeline**:
```javascript
[Settings] 
  → generateColorVariables()
  → generateTypographyRules()
  → generateLayoutRules()
  → generateEffectRules()
  → optimizeCSS()
  → [CSS String]
  → injectIntoDOM()
```

**Public API**:
```javascript
previewEngine.init()
previewEngine.generateCSS(settings)
previewEngine.applyCSS(css)
previewEngine.togglePreview(enabled)
previewEngine.isPreviewActive()
previewEngine.clearPreview()
```

**Dependencies**:
- `state-manager.js` (subscribes to settings changes)
- `event-bus.js` (emits preview events)

**Performance Targets**:
- CSS generation: < 50ms
- DOM injection: < 10ms
- Total preview update: < 60ms

---

### 5. Color System (`color-system.js`)

**Responsibility**: Color management with accessibility validation

**Key Features**:
- WCAG 2.1 contrast ratio calculations
- Automatic accessible color suggestions
- Color space conversions (hex, RGB, HSL)
- Palette generation algorithms
- Accessibility warnings

**Public API**:
```javascript
// Conversions
colorSystem.hexToRgb(hex)
colorSystem.rgbToHsl(rgb)
colorSystem.hslToRgb(hsl)

// Accessibility
colorSystem.getContrastRatio(color1, color2)
colorSystem.isAccessible(color1, color2, 'AA')
colorSystem.suggestAccessibleColor(base, background)

// Palette generation
colorSystem.generateComplementary(color)
colorSystem.generateAnalogous(color)
colorSystem.generateTriadic(color)

// Apply palette
colorSystem.applyPalette(paletteId)
```

**Dependencies**:
- `state-manager.js` (reads/writes color settings)
- `event-bus.js` (emits color events)

**Accessibility Standards**:
- WCAG 2.1 Level AA: 4.5:1 for normal text, 3:1 for large text
- WCAG 2.1 Level AAA: 7:1 for normal text, 4.5:1 for large text

---

### 6. Typography (`typography.js`)

**Responsibility**: Font loading and text scaling

**Key Features**:
- Asynchronous Google Fonts loading with Font Loading API
- System font fallbacks with similar metrics
- Fluid typography with clamp() CSS function
- Font caching in localStorage (7 days)
- FOUT (Flash of Unstyled Text) prevention
- 3-second timeout with fallback

**Public API**:
```javascript
// Font loading
await typography.loadFont(family, weights)
await typography.loadGoogleFont(family)

// Font management
typography.getFontStack(family)
typography.isFontLoaded(family)

// Fluid typography
typography.calculateFluidSize(min, max, viewport)
typography.generateFluidCSS(settings)

// Apply settings
typography.applyTypography(settings)
```

**Dependencies**:
- `state-manager.js` (reads/writes typography settings)
- `event-bus.js` (emits font loaded events)

**Caching Strategy**:
- Cache key: `mase_font_${family}_${version}`
- Expiration: 7 days
- Storage: localStorage
- Invalidation: Version change or manual clear

---

### 7. Animations (`animations.js`)

**Responsibility**: Visual effects and micro-interactions

**Key Features**:
- Web Animations API for 60fps performance
- Respects prefers-reduced-motion
- Easing function library
- Animation queuing and cancellation
- GPU-accelerated transforms
- Maximum 500ms duration

**Public API**:
```javascript
// Animation control
animations.animate(element, keyframes, options)
animations.fadeIn(element, duration)
animations.fadeOut(element, duration)
animations.slideIn(element, direction)

// Easing functions
animations.easeInOut(t)
animations.easeOut(t)
animations.spring(t)

// Preferences
animations.respectsReducedMotion()
animations.setAnimationDuration(duration)
```

**Dependencies**:
- `state-manager.js` (reads animation preferences)
- `event-bus.js` (emits animation events)

**Performance Targets**:
- 60fps (16.67ms per frame)
- GPU-accelerated properties only (transform, opacity)
- No layout thrashing

---

### 8. Palette Manager (`palette-manager.js`)

**Responsibility**: Palette selection and application

**Key Features**:
- Palette preview before apply
- Accessibility validation
- Custom palette creation
- Integration with Color System

**Public API**:
```javascript
paletteManager.getPalettes()
paletteManager.previewPalette(paletteId)
paletteManager.applyPalette(paletteId)
paletteManager.clearPreview()
paletteManager.createCustomPalette(colors)
```

**Dependencies**:
- `state-manager.js`
- `event-bus.js`
- `api-client.js`
- `color-system.js`

---

### 9. Template Manager (`template-manager.js`)

**Responsibility**: Template selection and application

**Key Features**:
- Template preview before apply
- Template categories and filtering
- Custom template creation
- Template import/export

**Public API**:
```javascript
templateManager.getTemplates()
templateManager.previewTemplate(templateId)
templateManager.applyTemplate(templateId)
templateManager.clearPreview()
templateManager.createCustomTemplate(settings)
templateManager.exportTemplate(templateId)
templateManager.importTemplate(data)
```

**Dependencies**:
- `state-manager.js`
- `event-bus.js`
- `api-client.js`

---

## Data Flow

### 1. User Changes Setting

```
User Input (DOM Event)
  ↓
Event Handler
  ↓
State Manager.updateSettings(path, value)
  ↓
State Updated (Zustand)
  ↓
Event Bus.emit('settings:changed', { path, value })
  ↓
Preview Engine (subscribed)
  ↓
Generate CSS
  ↓
Inject into DOM
  ↓
Visual Update
```

### 2. Apply Template

```
User Clicks "Apply Template"
  ↓
Template Manager.applyTemplate(id)
  ↓
API Client.applyTemplate(id)
  ↓
REST API: POST /mase/v1/templates/:id/apply
  ↓
Server Returns Settings
  ↓
State Manager.updateSettings(settings)
  ↓
Event Bus.emit('template:applied', { id, settings })
  ↓
Preview Engine Updates
  ↓
Visual Update
```

### 3. Save Settings

```
User Clicks "Save"
  ↓
State Manager.saveToServer()
  ↓
API Client.saveSettings(settings)
  ↓
Request Queue (prevent concurrent saves)
  ↓
REST API: POST /mase/v1/settings
  ↓
Server Validates & Saves
  ↓
Success Response
  ↓
Event Bus.emit('save:completed')
  ↓
UI Shows Success Message
```

### 4. Undo/Redo

```
User Presses Ctrl+Z
  ↓
State Manager.undo()
  ↓
Restore Previous State from History
  ↓
Event Bus.emit('settings:changed', { source: 'undo' })
  ↓
Preview Engine Updates
  ↓
Visual Update
```

## Initialization Sequence

```javascript
// 1. Load WordPress Admin Page
// 2. PHP enqueues modern bundles
// 3. JavaScript loads

async function init() {
  // Phase 1: Core modules (no dependencies)
  initStateManager();
  initEventBus();
  
  // Phase 2: API Client (depends on State Manager)
  initAPIClient();
  
  // Phase 3: Load settings from server
  await stateManager.loadFromServer();
  
  // Phase 4: Feature modules (depend on core)
  initPreviewEngine();
  initColorSystem();
  initTypography();
  initAnimations();
  initPaletteManager();
  initTemplateManager();
  
  // Phase 5: UI event handlers
  setupEventHandlers();
  
  // Phase 6: Ready
  eventBus.emit('mase:ready');
  console.log('MASE initialized successfully');
}
```

## Module Interfaces

### State Manager Interface

```typescript
interface StateManager {
  // State access
  getState(): MASEState;
  subscribe(selector: Function, callback: Function): UnsubscribeFn;
  
  // State updates
  updateSettings(path: string, value: any): void;
  undo(): void;
  redo(): void;
  resetToDefaults(): void;
  
  // Persistence
  loadFromServer(): Promise<void>;
  saveToServer(): Promise<void>;
  
  // History
  canUndo(): boolean;
  canRedo(): boolean;
  getHistory(): { past: MASEState[], future: MASEState[] };
}
```

### Event Bus Interface

```typescript
interface EventBus {
  on(event: string, handler: Function): UnsubscribeFn;
  once(event: string, handler: Function): UnsubscribeFn;
  emit(event: string, data?: any): void;
  off(event: string): void;
  clear(): void;
}
```

### API Client Interface

```typescript
interface APIClient {
  // Settings
  getSettings(): Promise<Settings>;
  saveSettings(settings: Settings): Promise<SaveResponse>;
  resetSettings(): Promise<Settings>;
  
  // Templates
  getTemplates(): Promise<Template[]>;
  applyTemplate(templateId: string): Promise<Settings>;
  
  // Palettes
  getPalettes(): Promise<Palette[]>;
  applyPalette(paletteId: string): Promise<ColorSettings>;
  
  // Configuration
  setTimeout(ms: number): void;
  setRetries(count: number): void;
}
```

### Preview Engine Interface

```typescript
interface PreviewEngine {
  init(): void;
  generateCSS(settings: Settings): string;
  applyCSS(css: string): void;
  togglePreview(enabled: boolean): void;
  isPreviewActive(): boolean;
  clearPreview(): void;
}
```

### Color System Interface

```typescript
interface ColorSystem {
  // Conversions
  hexToRgb(hex: string): RGB;
  rgbToHsl(rgb: RGB): HSL;
  hslToRgb(hsl: HSL): RGB;
  
  // Accessibility
  getContrastRatio(color1: string, color2: string): number;
  isAccessible(color1: string, color2: string, level: 'AA' | 'AAA'): boolean;
  suggestAccessibleColor(base: string, background: string): string;
  
  // Palette operations
  generateComplementary(color: string): string;
  generateAnalogous(color: string): string[];
  generateTriadic(color: string): string[];
  applyPalette(paletteId: string): Promise<void>;
}
```

### Typography Interface

```typescript
interface Typography {
  // Font loading
  loadFont(family: string, weights: number[]): Promise<void>;
  loadGoogleFont(family: string): Promise<void>;
  
  // Font management
  getFontStack(family: string): string;
  isFontLoaded(family: string): boolean;
  
  // Fluid typography
  calculateFluidSize(min: number, max: number, viewport: number): string;
  generateFluidCSS(settings: TypographySettings): string;
  
  // Apply settings
  applyTypography(settings: TypographySettings): void;
}
```

### Animations Interface

```typescript
interface Animations {
  // Animation control
  animate(element: Element, keyframes: Keyframe[], options: AnimationOptions): Animation;
  fadeIn(element: Element, duration?: number): Animation;
  fadeOut(element: Element, duration?: number): Animation;
  slideIn(element: Element, direction: Direction): Animation;
  
  // Easing functions
  easeInOut(t: number): number;
  easeOut(t: number): number;
  spring(t: number): number;
  
  // Preferences
  respectsReducedMotion(): boolean;
  setAnimationDuration(duration: number): void;
}
```

## Communication Patterns

### 1. Direct Method Calls
Use for synchronous operations within same module:
```javascript
const rgb = colorSystem.hexToRgb('#ff0000');
```

### 2. State Subscriptions
Use for reacting to state changes:
```javascript
useStore.subscribe(
  state => state.settings.colors,
  (colors) => {
    previewEngine.generateCSS({ colors });
  }
);
```

### 3. Event Bus
Use for cross-module communication:
```javascript
// Publisher
eventBus.emit('palette:applied', { paletteId, colors });

// Subscriber
eventBus.on('palette:applied', ({ paletteId, colors }) => {
  console.log('Palette applied:', paletteId);
});
```

### 4. API Calls
Use for server communication:
```javascript
const settings = await apiClient.getSettings();
await apiClient.saveSettings(settings);
```

## Error Handling

### Module-Level Error Handling

Each module implements try-catch blocks:
```javascript
class PreviewEngine {
  generateCSS(settings) {
    try {
      // CSS generation logic
      return css;
    } catch (error) {
      console.error('CSS generation failed:', error);
      eventBus.emit('mase:error', {
        module: 'PreviewEngine',
        method: 'generateCSS',
        error
      });
      return ''; // Fallback
    }
  }
}
```

### Event Bus Error Isolation

Event handlers are isolated:
```javascript
emit(event, data) {
  this.listeners[event]?.forEach(handler => {
    try {
      handler(data);
    } catch (error) {
      console.error(`Event handler failed for ${event}:`, error);
      // Continue to next handler
    }
  });
}
```

### API Client Retry Logic

Automatic retry with exponential backoff:
```javascript
async request(url, options) {
  let lastError;
  for (let i = 0; i < this.retries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      await this.delay(Math.pow(2, i) * 1000);
    }
  }
  throw lastError;
}
```

## Performance Considerations

### Bundle Sizes
- Core bundle: < 30KB (State Manager, Event Bus, Main Admin)
- Preview bundle: < 40KB (Preview Engine, CSS generation)
- Features bundle: < 30KB (Color, Typography, Animations)
- API bundle: < 20KB (API Client, networking)
- **Total**: < 120KB (gzipped)

### Code Splitting
```javascript
// Lazy load feature modules
const loadColorSystem = () => import('./modules/color-system.js');
const loadTypography = () => import('./modules/typography.js');
```

### Caching Strategy
1. **Browser Cache**: Versioned filenames for aggressive caching
2. **LocalStorage**: Fonts cached for 7 days
3. **Memory Cache**: Computed CSS cached until settings change

### Performance Targets
- Initial load: < 200ms on 3G
- Preview update: < 50ms
- CSS generation: < 20ms
- API response: < 500ms
- Lighthouse score: 90+

## Security

### Input Validation
All user inputs validated before processing:
```javascript
function validateColorInput(color) {
  const hexRegex = /^#[0-9A-Fa-f]{6}$/;
  if (!hexRegex.test(color)) {
    throw new Error('Invalid color format');
  }
  return color;
}
```

### XSS Prevention
- Use `textContent` instead of `innerHTML`
- Sanitize custom CSS
- Escape all user-generated content

### CSRF Protection
- WordPress nonce in all API requests
- Server-side nonce verification
- Automatic nonce refresh

## Testing Strategy

### Unit Tests (Vitest)
- Test each module in isolation
- Mock dependencies
- 80%+ code coverage

### Integration Tests (Vitest)
- Test module interactions
- Test data flow
- Test error scenarios

### E2E Tests (Playwright)
- Test critical user workflows
- Test across browsers
- Test error recovery

## Future Enhancements

### AI Features
- Architecture supports AI service endpoints
- State Manager can store AI suggestions
- Event Bus can broadcast AI events

### Real-Time Collaboration
- API Client supports WebSocket connections
- State Manager implements operational transformation
- Conflict resolution strategies in place

### Advanced Animations
- Animation Module extensible with plugins
- Timeline-based animation sequencing
- Keyframe editor integration ready

## References

- [Requirements Document](../requirements.md)
- [Design Document](../design.md)
- [Developer Guide](./DEVELOPER-GUIDE.md)
- [Migration Guide](./MIGRATION-GUIDE.md)
