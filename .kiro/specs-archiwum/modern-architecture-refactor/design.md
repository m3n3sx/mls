# Design Document

## Overview

This design document outlines the modernization of the MASE plugin architecture from a monolithic 3000+ line JavaScript file to a modular, scalable system. The refactoring introduces modern JavaScript tooling (Vite bundler), clear separation of concerns through ES6 modules, centralized state management, and a foundation for advanced features while maintaining full backwards compatibility.

### Design Goals

1. **Modularity**: Break monolithic code into focused, single-responsibility modules
2. **Maintainability**: Clear interfaces and separation of concerns for easier updates
3. **Performance**: Equal or better performance through code splitting and optimization
4. **Testability**: Unit-testable components with comprehensive test coverage
5. **Future-Proof**: Architecture ready for AI, collaboration, and advanced features
6. **Progressive Migration**: Incremental refactoring without breaking existing functionality

### Key Architectural Decisions

- **Vite over Webpack**: Faster development builds, simpler configuration, native ES modules
- **Zustand over Redux**: Lighter weight, simpler API, better TypeScript support
- **Vitest over Jest**: Native ES modules, faster execution, Vite integration
- **Hybrid Preview**: Keep client-side generation, add REST API for complex features
- **Optional TypeScript**: Gradual adoption without forcing full migration

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     WordPress Admin                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MASE Main Entry Point                     │
│                     (main-admin.js)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
       ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
       │ State Manager│  │  Event Bus   │  │  API Client  │
       │  (Zustand)   │  │ (PubSub)     │  │ (REST/WS)    │
       └──────────────┘  └──────────────┘  └──────────────┘
                │                │                │
        ┌───────┴────────┬───────┴────────┬───────┴────────┐
        ▼                ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Preview Engine│ │Color System  │ │ Typography   │ │ Animations   │
│(CSS Gen)     │ │(Palettes)    │ │(Fonts)       │ │(Effects)     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
        │                │                │                │
        └────────────────┴────────────────┴────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   DOM / Browser  │
                    └──────────────────┘
```

### Module Dependency Graph

```
main-admin.js
├── state-manager.js (no dependencies)
├── event-bus.js (no dependencies)
├── api-client.js
│   └── state-manager.js
├── preview-engine.js
│   ├── state-manager.js
│   └── event-bus.js
├── color-system.js
│   ├── state-manager.js
│   └── event-bus.js
├── typography.js
│   ├── state-manager.js
│   └── event-bus.js
└── animations.js
    ├── state-manager.js
    └── event-bus.js
```

## Components and Interfaces

### 1. State Manager Module

**Purpose**: Centralized state management with undo/redo capability

**File**: `assets/js/modules/state-manager.js`

**Interface**:
```javascript
// State structure
interface MASEState {
  settings: {
    colors: ColorSettings;
    typography: TypographySettings;
    effects: EffectSettings;
    templates: TemplateSettings;
  };
  ui: {
    activeTab: string;
    isDirty: boolean;
    isPreviewMode: boolean;
  };
  history: {
    past: MASEState[];
    future: MASEState[];
  };
}

// Public API
export const useStore = create((set, get) => ({
  // State
  settings: initialSettings,
  ui: initialUI,
  history: { past: [], future: [] },
  
  // Actions
  updateSettings: (path, value) => void,
  undo: () => void,
  redo: () => void,
  resetToDefaults: () => void,
  loadFromServer: () => Promise<void>,
  saveToServer: () => Promise<void>,
}));
```

**Key Features**:
- Immutable state updates using Zustand
- Automatic history tracking for undo/redo
- Selective subscriptions to prevent unnecessary re-renders
- Middleware for persistence and validation

### 2. Event Bus Module

**Purpose**: Decoupled communication between modules

**File**: `assets/js/modules/event-bus.js`

**Interface**:
```javascript
class EventBus {
  // Subscribe to events
  on(event: string, handler: Function): UnsubscribeFn;
  
  // Subscribe once
  once(event: string, handler: Function): UnsubscribeFn;
  
  // Publish events
  emit(event: string, data?: any): void;
  
  // Remove all listeners for event
  off(event: string): void;
  
  // Clear all listeners
  clear(): void;
}

// Event types
const EVENTS = {
  SETTINGS_CHANGED: 'settings:changed',
  PREVIEW_UPDATE: 'preview:update',
  COLOR_SELECTED: 'color:selected',
  TEMPLATE_APPLIED: 'template:applied',
  SAVE_STARTED: 'save:started',
  SAVE_COMPLETED: 'save:completed',
  ERROR_OCCURRED: 'error:occurred',
};
```

**Key Features**:
- Namespaced events to prevent conflicts
- Error isolation - one handler failure doesn't affect others
- Development mode logging for debugging
- Wildcard subscriptions for monitoring

### 3. API Client Module

**Purpose**: Unified WordPress REST API communication

**File**: `assets/js/modules/api-client.js`

**Interface**:
```javascript
class APIClient {
  // Settings endpoints
  getSettings(): Promise<Settings>;
  saveSettings(settings: Settings): Promise<SaveResponse>;
  resetSettings(): Promise<Settings>;
  
  // Template endpoints
  getTemplates(): Promise<Template[]>;
  applyTemplate(templateId: string): Promise<Settings>;
  
  // Palette endpoints
  getPalettes(): Promise<Palette[]>;
  applyPalette(paletteId: string): Promise<ColorSettings>;
  
  // Future: WebSocket support
  connectWebSocket(): WebSocket;
  subscribeToChanges(callback: Function): UnsubscribeFn;
}

// Configuration
const config = {
  baseURL: window.maseData.restUrl,
  nonce: window.maseData.nonce,
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
};
```

**Key Features**:
- Automatic nonce handling and refresh
- Request queuing to prevent conflicts
- Exponential backoff retry logic
- Response validation and error handling
- Future WebSocket support for real-time features

### 4. Preview Engine Module

**Purpose**: Real-time CSS generation and DOM injection

**File**: `assets/js/modules/preview-engine.js`

**Interface**:
```javascript
class PreviewEngine {
  // Initialize preview system
  init(): void;
  
  // Generate CSS from current state
  generateCSS(settings: Settings): string;
  
  // Apply CSS to DOM
  applyCSS(css: string): void;
  
  // Toggle preview mode
  togglePreview(enabled: boolean): void;
  
  // Get current preview state
  isPreviewActive(): boolean;
  
  // Clear preview and restore defaults
  clearPreview(): void;
}

// CSS Generation pipeline
const pipeline = [
  generateColorVariables,
  generateTypographyRules,
  generateLayoutRules,
  generateEffectRules,
  optimizeCSS,
];
```

**Key Features**:
- Sub-50ms CSS generation using template literals
- CSS custom properties for dynamic theming
- Incremental updates - only regenerate changed sections
- CSS minification in production
- Fallback to server-side for complex calculations

### 5. Color System Module

**Purpose**: Color management with accessibility validation

**File**: `assets/js/modules/color-system.js`

**Interface**:
```javascript
class ColorSystem {
  // Color conversion
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
  
  // Apply palette
  applyPalette(paletteId: string): Promise<void>;
}
```

**Key Features**:
- WCAG 2.1 contrast ratio calculations
- Automatic accessible color suggestions
- Color space conversions (hex, RGB, HSL, LCH)
- Palette generation algorithms
- Color blindness simulation (future)

### 6. Typography Module

**Purpose**: Font loading and text scaling

**File**: `assets/js/modules/typography.js`

**Interface**:
```javascript
class Typography {
  // Font loading
  loadFont(family: string, weights: number[]): Promise<void>;
  loadGoogleFont(family: string): Promise<void>;
  
  // Font management
  getFontStack(family: string): string;
  isFontLoaded(family: string): boolean;
  
  // Fluid typography
  calculateFluidSize(min: number, max: number, viewport: number): string;
  generateFluidCSS(settings: TypographySettings): string;
  
  // Apply typography settings
  applyTypography(settings: TypographySettings): void;
}
```

**Key Features**:
- Asynchronous Google Fonts loading with Font Loading API
- System font fallbacks with similar metrics
- Fluid typography with clamp() CSS function
- Font caching in localStorage (7 days)
- FOUT (Flash of Unstyled Text) prevention

### 7. Animation Module

**Purpose**: Visual effects and micro-interactions

**File**: `assets/js/modules/animations.js`

**Interface**:
```javascript
class Animations {
  // Animation control
  animate(element: Element, keyframes: Keyframe[], options: AnimationOptions): Animation;
  fadeIn(element: Element, duration?: number): Animation;
  fadeOut(element: Element, duration?: number): Animation;
  slideIn(element: Element, direction: 'up' | 'down' | 'left' | 'right'): Animation;
  
  // Easing functions
  easeInOut(t: number): number;
  easeOut(t: number): number;
  spring(t: number): number;
  
  // Preferences
  respectsReducedMotion(): boolean;
  setAnimationDuration(duration: number): void;
}
```

**Key Features**:
- Web Animations API for 60fps performance
- Respects prefers-reduced-motion
- Easing function library
- Animation queuing and cancellation
- GPU-accelerated transforms

### 8. Main Admin Module

**Purpose**: Application initialization and coordination

**File**: `assets/js/modules/main-admin.js`

**Interface**:
```javascript
class MASEAdmin {
  // Lifecycle
  init(): Promise<void>;
  destroy(): void;
  
  // Module registration
  registerModule(name: string, module: Module): void;
  getModule(name: string): Module;
  
  // Feature flags
  isFeatureEnabled(feature: string): boolean;
  enableFeature(feature: string): void;
  
  // Legacy compatibility
  getLegacyAPI(): LegacyAPI;
}

// Initialization sequence
async function init() {
  // 1. Initialize core modules
  await initStateManager();
  await initEventBus();
  await initAPIClient();
  
  // 2. Load settings from server
  await loadSettings();
  
  // 3. Initialize feature modules
  await initPreviewEngine();
  await initColorSystem();
  await initTypography();
  await initAnimations();
  
  // 4. Setup UI event handlers
  setupEventHandlers();
  
  // 5. Emit ready event
  eventBus.emit('mase:ready');
}
```

## Data Models

### Settings Data Model

```javascript
interface Settings {
  version: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    adminBar: ColorScheme;
    menu: ColorScheme;
    content: ColorScheme;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    headingFont: string;
    headingWeight: number;
  };
  effects: {
    borderRadius: number;
    shadows: boolean;
    animations: boolean;
    transitions: boolean;
  };
  templates: {
    active: string | null;
    custom: CustomTemplate[];
  };
  advanced: {
    customCSS: string;
    performance: PerformanceSettings;
  };
}

interface ColorScheme {
  background: string;
  text: string;
  hover: string;
  active: string;
}
```

### Template Data Model

```javascript
interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  settings: Partial<Settings>;
  category: 'light' | 'dark' | 'colorful' | 'minimal';
  tags: string[];
  author: string;
  version: string;
}
```

### Palette Data Model

```javascript
interface Palette {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  accessibility: {
    wcagLevel: 'AA' | 'AAA';
    contrastRatios: Record<string, number>;
  };
}
```

## Error Handling

### Error Types

```javascript
class MASEError extends Error {
  constructor(message, code, context) {
    super(message);
    this.code = code;
    this.context = context;
    this.timestamp = Date.now();
  }
}

// Error codes
const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  STATE_ERROR: 'STATE_ERROR',
  MODULE_ERROR: 'MODULE_ERROR',
  API_ERROR: 'API_ERROR',
};
```

### Error Handling Strategy

1. **Module Level**: Try-catch blocks with specific error handling
2. **API Level**: Retry logic with exponential backoff
3. **State Level**: Validation before state updates, rollback on failure
4. **UI Level**: User-friendly error messages, recovery suggestions
5. **Global Level**: Error boundary catches unhandled errors, logs to console

### Error Recovery

```javascript
// Automatic recovery strategies
const recoveryStrategies = {
  NETWORK_ERROR: () => retryWithBackoff(),
  VALIDATION_ERROR: () => resetToLastValid(),
  STATE_ERROR: () => reloadFromServer(),
  MODULE_ERROR: () => reinitializeModule(),
  API_ERROR: () => showUserError(),
};
```

## Testing Strategy

### Unit Testing (Vitest)

**Coverage Target**: 80% minimum

**Test Structure**:
```javascript
// Example: state-manager.test.js
describe('StateManager', () => {
  describe('updateSettings', () => {
    it('should update nested settings correctly', () => {
      const store = createStore();
      store.updateSettings('colors.primary', '#ff0000');
      expect(store.getState().settings.colors.primary).toBe('#ff0000');
    });
    
    it('should add to history on update', () => {
      const store = createStore();
      const initialLength = store.getState().history.past.length;
      store.updateSettings('colors.primary', '#ff0000');
      expect(store.getState().history.past.length).toBe(initialLength + 1);
    });
  });
  
  describe('undo/redo', () => {
    it('should restore previous state on undo', () => {
      // Test implementation
    });
  });
});
```

**Test Categories**:
- State management operations
- Color system calculations
- CSS generation logic
- API client request/response handling
- Event bus pub/sub functionality

### Integration Testing (Vitest)

**Test Scenarios**:
- Module initialization sequence
- State changes triggering preview updates
- API save/load workflows
- Template application end-to-end
- Error recovery flows

### E2E Testing (Playwright)

**Critical User Workflows**:
1. Load admin page → Change color → See preview → Save settings
2. Apply template → Verify all settings updated → Undo → Verify rollback
3. Change typography → Preview updates → Save → Reload page → Verify persistence
4. Network failure during save → Retry → Success → Verify data integrity
5. Multiple rapid changes → Debounced preview updates → Final state correct

**Test Configuration**:
```javascript
// playwright.config.js
export default {
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:8080/wp-admin',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
};
```

### Performance Testing

**Metrics to Track**:
- Initial bundle load time (< 200ms on 3G)
- Preview update latency (< 50ms)
- Memory usage over time (no leaks)
- CSS generation time (< 20ms)
- API response times (< 500ms)

**Tools**:
- Lighthouse CI for automated audits
- Chrome DevTools Performance profiler
- Bundle analyzer for size optimization

## Migration Strategy

### Phase 1: Foundation (Week 1-2)

**Goal**: Setup build system and core modules without breaking existing functionality

**Tasks**:
1. Setup Vite build configuration
2. Create module structure and empty implementations
3. Implement State Manager with Zustand
4. Implement Event Bus
5. Setup testing infrastructure (Vitest + Playwright)
6. Create feature flags for gradual rollout

**Success Criteria**:
- Build system generates bundles successfully
- All existing functionality still works via legacy code
- Tests run and pass
- Feature flags toggle between legacy/modern

### Phase 2: Preview Engine (Week 3-4)

**Goal**: Migrate CSS generation to new Preview Engine module

**Tasks**:
1. Extract CSS generation logic from legacy code
2. Implement Preview Engine module
3. Add comprehensive unit tests
4. Implement feature flag to toggle implementations
5. Performance testing and optimization
6. Gradual rollout with monitoring

**Success Criteria**:
- Preview Engine generates identical CSS to legacy
- Performance equal or better than legacy
- All preview tests pass
- No user-reported issues during rollout

### Phase 3: Feature Modules (Week 5-6)

**Goal**: Migrate Color System, Typography, and Animations

**Tasks**:
1. Implement Color System module with accessibility checks
2. Implement Typography module with font loading
3. Implement Animations module with reduced motion support
4. Migrate event handlers to use Event Bus
5. Integration testing across modules
6. Feature flag rollout

**Success Criteria**:
- All feature modules functional
- Module communication via Event Bus working
- Integration tests pass
- User workflows unaffected

### Phase 4: API Client (Week 7-8)

**Goal**: Centralize all WordPress REST API communication

**Tasks**:
1. Implement API Client module
2. Migrate all AJAX calls to API Client
3. Add request queuing and retry logic
4. Implement error handling and recovery
5. E2E testing of save/load workflows
6. Feature flag rollout

**Success Criteria**:
- All API calls go through API Client
- Error handling robust and user-friendly
- No data loss or corruption
- E2E tests pass

### Phase 5: Legacy Removal (Week 9-10)

**Goal**: Remove legacy code and finalize migration

**Tasks**:
1. Remove feature flags and legacy code paths
2. Remove old mase-admin.js monolith
3. Update documentation
4. Final performance audit
5. Comprehensive regression testing
6. Production deployment

**Success Criteria**:
- No legacy code remains
- All tests pass
- Performance targets met
- Documentation complete
- Zero critical bugs in production

## Rollback Strategy

### Per-Phase Rollback

Each migration phase includes:
1. **Feature Flag**: Instant toggle back to legacy implementation
2. **Database Backup**: Settings snapshot before phase deployment
3. **Code Backup**: Git tag for each phase completion
4. **Monitoring**: Error tracking and user feedback collection

### Rollback Triggers

Automatic rollback if:
- Error rate exceeds 5% of requests
- Performance degrades by more than 20%
- Critical functionality breaks
- User reports exceed threshold

### Rollback Procedure

```javascript
// Emergency rollback
1. Set feature flag: MASE_USE_LEGACY = true
2. Clear browser caches
3. Restore database snapshot if needed
4. Notify users of temporary rollback
5. Investigate and fix issues
6. Re-deploy with fixes
```

## Performance Optimization

### Bundle Optimization

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['zustand'],
          'preview': ['./src/modules/preview-engine.js'],
          'color': ['./src/modules/color-system.js'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
};
```

### Code Splitting Strategy

- **Core Bundle**: State Manager, Event Bus, Main Admin (< 30KB)
- **Preview Bundle**: Preview Engine, CSS generation (< 40KB)
- **Features Bundle**: Color, Typography, Animations (< 30KB)
- **API Bundle**: API Client, networking (< 20KB)

### Lazy Loading

```javascript
// Load modules on demand
const loadColorSystem = () => import('./modules/color-system.js');
const loadTypography = () => import('./modules/typography.js');
const loadAnimations = () => import('./modules/animations.js');

// Load when user interacts with feature
document.querySelector('#color-tab').addEventListener('click', async () => {
  const { ColorSystem } = await loadColorSystem();
  // Initialize color system
});
```

### Caching Strategy

1. **Browser Cache**: Aggressive caching with versioned filenames
2. **Service Worker**: Cache static assets (future enhancement)
3. **LocalStorage**: Cache fonts and frequently accessed data
4. **Memory Cache**: In-memory cache for computed values

## Security Considerations

### Input Validation

```javascript
// Validate all user inputs
function validateColorInput(color) {
  const hexRegex = /^#[0-9A-Fa-f]{6}$/;
  if (!hexRegex.test(color)) {
    throw new MASEError('Invalid color format', 'VALIDATION_ERROR');
  }
  return color;
}

// Sanitize custom CSS
function sanitizeCustomCSS(css) {
  // Remove dangerous patterns
  const dangerous = ['javascript:', 'expression(', '@import'];
  let sanitized = css;
  dangerous.forEach(pattern => {
    sanitized = sanitized.replace(new RegExp(pattern, 'gi'), '');
  });
  return sanitized;
}
```

### XSS Prevention

- Escape all user-generated content before DOM insertion
- Use textContent instead of innerHTML where possible
- Sanitize custom CSS to prevent CSS injection
- Validate all API responses before processing

### CSRF Protection

- Include WordPress nonce in all API requests
- Verify nonce on server-side for all mutations
- Refresh nonce automatically when expired
- Use WordPress REST API authentication

## Future Enhancements

### AI-Powered Features

**Architecture Support**:
- API Client ready for AI service endpoints
- State Manager can store AI suggestions
- Event Bus can broadcast AI events
- Preview Engine can apply AI-generated styles

**Potential Features**:
- AI color palette suggestions based on brand
- Automatic accessibility improvements
- Smart typography pairing recommendations
- Predictive settings based on usage patterns

### Real-Time Collaboration

**Architecture Support**:
- API Client supports WebSocket connections
- State Manager implements operational transformation
- Event Bus broadcasts changes to all clients
- Conflict resolution strategies in place

**Potential Features**:
- Multiple admins editing simultaneously
- Live cursor positions and selections
- Change history with author attribution
- Collaborative template creation

### Advanced Animations

**Architecture Support**:
- Animation Module extensible with plugins
- Timeline-based animation sequencing
- Keyframe editor integration ready
- Performance monitoring built-in

**Potential Features**:
- Visual animation timeline editor
- Custom easing curve designer
- Animation presets library
- Scroll-triggered animations

## Deployment Considerations

### Build Process

```bash
# Development
npm run dev          # Start Vite dev server with HMR

# Production
npm run build        # Build optimized bundles
npm run preview      # Preview production build locally
npm run test         # Run all tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

### WordPress Integration

```php
// Enqueue modern bundles
function mase_enqueue_modern_assets() {
    $manifest = json_decode(
        file_get_contents(MASE_PATH . '/dist/manifest.json'),
        true
    );
    
    wp_enqueue_script(
        'mase-modern',
        MASE_URL . '/dist/' . $manifest['main.js'],
        [],
        MASE_VERSION,
        true
    );
    
    wp_localize_script('mase-modern', 'maseData', [
        'restUrl' => rest_url('mase/v1'),
        'nonce' => wp_create_nonce('wp_rest'),
        'features' => get_option('mase_feature_flags', []),
    ]);
}
```

### Version Management

- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog generation from git commits
- Automated version bumping in CI/CD
- Database migration scripts for breaking changes

### Monitoring and Analytics

- Error tracking with Sentry or similar
- Performance monitoring with Web Vitals
- Usage analytics (opt-in)
- Feature flag analytics for rollout decisions
