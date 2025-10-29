# MASE Modern Architecture - Modules

This directory contains the modular JavaScript architecture for the Modern Admin Styler plugin.

## Module Overview

### Core Modules

- **main-admin.js** - Application initialization and coordination
- **state-manager.js** - Centralized state management with Zustand
- **event-bus.js** - Decoupled module communication via pub/sub
- **api-client.js** - WordPress REST API communication

### Feature Modules

- **preview-engine.js** - Real-time CSS generation and DOM injection
- **color-system.js** - Color management with accessibility validation
- **typography.js** - Font loading and text scaling
- **animations.js** - Visual effects and micro-interactions

## Module Dependencies

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

## Usage

Import modules using clean syntax:

```javascript
import { MASEAdmin, useStore, EventBus, EVENTS } from '@modules';
```

Or import specific modules:

```javascript
import PreviewEngine from '@modules/preview-engine.js';
import ColorSystem from '@modules/color-system.js';
```

## Implementation Status

All modules are currently placeholders. They will be implemented incrementally according to the migration plan:

- **Phase 1**: State Manager, Event Bus, Testing Infrastructure
- **Phase 2**: Preview Engine
- **Phase 3**: Color System, Typography, Animations
- **Phase 4**: API Client
- **Phase 5**: Main Admin Integration

## Development

See the main project README and design documentation for:
- Architecture details
- Implementation guidelines
- Testing requirements
- Migration strategy
