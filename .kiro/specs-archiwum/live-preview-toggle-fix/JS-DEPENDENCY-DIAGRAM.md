# JavaScript Dependency Diagram
## MASE Plugin Architecture Visualization

## Module Dependency Graph

```mermaid
graph TD
    %% Root namespace
    MASE[MASE Root Namespace]
    
    %% Core modules
    CONFIG[config<br/>Configuration]
    STATE[state<br/>Application State]
    
    %% Feature modules
    PALETTE[paletteManager<br/>Palette CRUD]
    TEMPLATE[templateManager<br/>Template CRUD]
    LIVE[livePreview<br/>Real-time Preview]
    IMPORT[importExport<br/>Import/Export]
    BACKUP[backupManager<br/>Backup/Restore]
    KEYBOARD[keyboardShortcuts<br/>Keyboard Nav]
    TAB[tabNavigation<br/>Tab Switching]
    
    %% Utility functions
    NOTICE[showNotice<br/>Notifications]
    DEBOUNCE[debounce<br/>Performance]
    
    %% Dependencies
    MASE --> CONFIG
    MASE --> STATE
    MASE --> PALETTE
    MASE --> TEMPLATE
    MASE --> LIVE
    MASE --> IMPORT
    MASE --> BACKUP
    MASE --> KEYBOARD
    MASE --> TAB
    MASE --> NOTICE
    MASE --> DEBOUNCE
    
    %% Module dependencies
    PALETTE --> CONFIG
    PALETTE --> STATE
    PALETTE --> NOTICE
    
    TEMPLATE --> CONFIG
    TEMPLATE --> STATE
    TEMPLATE --> BACKUP
    TEMPLATE --> NOTICE
    
    LIVE --> CONFIG
    LIVE --> STATE
    LIVE --> DEBOUNCE
    LIVE --> NOTICE
    
    IMPORT --> CONFIG
    IMPORT --> BACKUP
    IMPORT --> NOTICE
    
    BACKUP --> CONFIG
    BACKUP --> NOTICE
    
    KEYBOARD --> CONFIG
    KEYBOARD --> STATE
    KEYBOARD --> PALETTE
    KEYBOARD --> NOTICE
    
    TAB --> NOTICE
    
    %% Styling
    classDef core fill:#4CAF50,stroke:#2E7D32,color:#fff
    classDef feature fill:#2196F3,stroke:#1565C0,color:#fff
    classDef utility fill:#FF9800,stroke:#E65100,color:#fff
    
    class CONFIG,STATE core
    class PALETTE,TEMPLATE,LIVE,IMPORT,BACKUP,KEYBOARD,TAB feature
    class NOTICE,DEBOUNCE utility
```

## Initialization Sequence

```mermaid
sequenceDiagram
    participant Browser
    participant jQuery
    participant MASE
    participant Modules
    participant DOM
    
    Browser->>jQuery: DOM Ready Event
    jQuery->>MASE: $(document).ready()
    MASE->>MASE: init()
    
    Note over MASE: Phase 1: Configuration
    MASE->>MASE: Set nonce from maseAdmin
    MASE->>MASE: Set AJAX URL
    
    Note over MASE: Phase 2: State Restoration
    MASE->>localStorage: getItem('mase_dark_mode')
    localStorage-->>MASE: 'true' or 'false'
    MASE->>DOM: Apply dark mode if enabled
    
    Note over MASE: Phase 3: UI Initialization
    MASE->>MASE: initColorPickers()
    MASE->>DOM: Initialize WordPress Color Pickers
    MASE->>DOM: Create fallback inputs
    
    Note over MASE: Phase 4: Event Binding
    MASE->>MASE: bindEvents()
    MASE->>MASE: bindPaletteEvents()
    MASE->>MASE: bindTemplateEvents()
    MASE->>MASE: bindImportExportEvents()
    MASE->>MASE: bindBackupEvents()
    
    Note over MASE: Phase 5: Module Initialization
    MASE->>Modules: tabNavigation.init()
    Modules->>localStorage: getItem('mase_active_tab')
    Modules->>DOM: Switch to saved tab
    
    MASE->>Modules: keyboardShortcuts.bind()
    Modules->>DOM: Bind keyboard event listeners
    
    Note over MASE: Phase 6: Feature Activation
    MASE->>MASE: state.livePreviewEnabled = true
    MASE->>Modules: livePreview.bind()
    Modules->>DOM: Bind input change listeners
    
    MASE->>MASE: initConditionalFields()
    MASE->>DOM: Show/hide conditional fields
    
    MASE->>Browser: console.log('Initialization complete')
```

## Event Flow Diagram

```mermaid
flowchart TD
    START([User Action])
    
    %% Event types
    CLICK{Event Type?}
    CHANGE{Event Type?}
    KEYDOWN{Event Type?}
    
    START --> CLICK
    START --> CHANGE
    START --> KEYDOWN
    
    %% Click events
    CLICK -->|Palette Card| PALETTE_CLICK[handlePaletteClick]
    CLICK -->|Template Button| TEMPLATE_CLICK[handleTemplateApply]
    CLICK -->|Tab Button| TAB_CLICK[tabNavigation.switchTab]
    CLICK -->|Save Button| SAVE_CLICK[saveSettings]
    
    %% Change events
    CHANGE -->|Live Preview Toggle| LIVE_TOGGLE[Toggle livePreview]
    CHANGE -->|Dark Mode Toggle| DARK_TOGGLE[toggleDarkMode]
    CHANGE -->|Color Picker| COLOR_CHANGE[Update Preview]
    CHANGE -->|Input Field| INPUT_CHANGE[Mark Dirty]
    
    %% Keydown events
    KEYDOWN -->|Ctrl+Shift+1-0| PALETTE_SHORTCUT[Switch Palette]
    KEYDOWN -->|Ctrl+Shift+T| THEME_SHORTCUT[Toggle Theme]
    KEYDOWN -->|Arrow Keys| TAB_NAV[Navigate Tabs]
    KEYDOWN -->|Enter/Space| ACTIVATE[Activate Element]
    
    %% AJAX calls
    PALETTE_CLICK --> AJAX1[AJAX: mase_apply_palette]
    TEMPLATE_CLICK --> AJAX2[AJAX: mase_apply_template]
    SAVE_CLICK --> AJAX3[AJAX: mase_save_settings]
    
    %% Responses
    AJAX1 --> SUCCESS1{Success?}
    AJAX2 --> SUCCESS2{Success?}
    AJAX3 --> SUCCESS3{Success?}
    
    SUCCESS1 -->|Yes| RELOAD1[Reload Page]
    SUCCESS1 -->|No| ERROR1[Show Error]
    
    SUCCESS2 -->|Yes| RELOAD2[Reload Page]
    SUCCESS2 -->|No| ERROR2[Show Error]
    
    SUCCESS3 -->|Yes| NOTICE1[Show Success]
    SUCCESS3 -->|No| ERROR3[Show Error]
    
    %% Live preview updates
    LIVE_TOGGLE -->|Enabled| BIND[livePreview.bind]
    LIVE_TOGGLE -->|Disabled| UNBIND[livePreview.unbind]
    
    COLOR_CHANGE --> PREVIEW_CHECK{Live Preview?}
    INPUT_CHANGE --> PREVIEW_CHECK
    
    PREVIEW_CHECK -->|Enabled| UPDATE[livePreview.update]
    PREVIEW_CHECK -->|Disabled| SKIP[Skip Update]
    
    UPDATE --> GENERATE[Generate CSS]
    GENERATE --> INJECT[Inject <style> tag]
    
    %% State updates
    DARK_TOGGLE --> STATE1[Update state.darkMode]
    STATE1 --> STORAGE1[localStorage.setItem]
    STATE1 --> DOM1[Update DOM attributes]
    
    TAB_CLICK --> STATE2[Update active tab]
    STATE2 --> STORAGE2[localStorage.setItem]
    STATE2 --> DOM2[Show/hide content]
    
    %% End states
    RELOAD1 --> END([Complete])
    RELOAD2 --> END
    NOTICE1 --> END
    ERROR1 --> END
    ERROR2 --> END
    ERROR3 --> END
    SKIP --> END
    INJECT --> END
    DOM1 --> END
    DOM2 --> END
    
    %% Styling
    classDef ajax fill:#FF5722,stroke:#D84315,color:#fff
    classDef success fill:#4CAF50,stroke:#2E7D32,color:#fff
    classDef error fill:#F44336,stroke:#C62828,color:#fff
    classDef state fill:#9C27B0,stroke:#6A1B9A,color:#fff
    
    class AJAX1,AJAX2,AJAX3 ajax
    class RELOAD1,RELOAD2,NOTICE1 success
    class ERROR1,ERROR2,ERROR3 error
    class STATE1,STATE2,STORAGE1,STORAGE2 state
```

## State Management Flow

```mermaid
stateDiagram-v2
    [*] --> Initialized: MASE.init()
    
    Initialized --> LivePreviewOff: Default State
    Initialized --> DarkModeOff: Default State
    Initialized --> NoPalette: Default State
    Initialized --> NoTemplate: Default State
    Initialized --> Clean: Default State
    Initialized --> NotSaving: Default State
    
    %% Live Preview States
    LivePreviewOff --> LivePreviewOn: Toggle ON
    LivePreviewOn --> LivePreviewOff: Toggle OFF
    
    LivePreviewOn --> Updating: Input Change
    Updating --> LivePreviewOn: CSS Applied
    
    %% Dark Mode States
    DarkModeOff --> DarkModeOn: Toggle ON
    DarkModeOn --> DarkModeOff: Toggle OFF
    
    DarkModeOn --> LocalStorage: Save Preference
    DarkModeOff --> LocalStorage: Save Preference
    LocalStorage --> DarkModeOn: Restore ON
    LocalStorage --> DarkModeOff: Restore OFF
    
    %% Palette States
    NoPalette --> PaletteSelected: Apply Palette
    PaletteSelected --> PaletteApplying: AJAX Request
    PaletteApplying --> PaletteActive: Success
    PaletteApplying --> PaletteSelected: Error (Rollback)
    PaletteActive --> PaletteSelected: Apply Different
    
    %% Template States
    NoTemplate --> TemplateSelected: Apply Template
    TemplateSelected --> TemplateApplying: AJAX Request
    TemplateApplying --> TemplateActive: Success
    TemplateApplying --> TemplateSelected: Error (Rollback)
    TemplateActive --> TemplateSelected: Apply Different
    
    %% Dirty State
    Clean --> Dirty: Input Change
    Dirty --> Clean: Save Success
    Dirty --> Dirty: More Changes
    
    %% Saving State
    NotSaving --> Saving: Save Triggered
    Saving --> NotSaving: Save Complete
    Saving --> Saving: Duplicate Request (Blocked)
    
    %% State Properties
    note right of LivePreviewOn
        state.livePreviewEnabled = true
    end note
    
    note right of DarkModeOn
        localStorage: mase_dark_mode = 'true'
    end note
    
    note right of PaletteActive
        state.currentPalette = 'palette-id'
    end note
    
    note right of TemplateActive
        state.currentTemplate = 'template-id'
    end note
    
    note right of Dirty
        state.isDirty = true
    end note
    
    note right of Saving
        state.isSaving = true
        (Prevents race conditions)
    end note
```

## Module Communication Pattern

```mermaid
graph LR
    %% User actions
    USER([User Action])
    
    %% Event handlers
    HANDLER[Event Handler]
    
    %% Module calls
    MODULE1[Module A]
    MODULE2[Module B]
    MODULE3[Module C]
    
    %% Utilities
    UTIL1[showNotice]
    UTIL2[debounce]
    
    %% State
    STATE[(MASE.state)]
    
    %% AJAX
    AJAX[WordPress AJAX]
    
    %% Flow
    USER --> HANDLER
    HANDLER --> MODULE1
    
    MODULE1 --> STATE
    MODULE1 --> MODULE2
    MODULE1 --> UTIL1
    MODULE1 --> AJAX
    
    MODULE2 --> STATE
    MODULE2 --> MODULE3
    MODULE2 --> UTIL2
    
    MODULE3 --> STATE
    MODULE3 --> UTIL1
    
    AJAX --> MODULE1
    
    %% Styling
    classDef user fill:#E91E63,stroke:#880E4F,color:#fff
    classDef handler fill:#9C27B0,stroke:#4A148C,color:#fff
    classDef module fill:#2196F3,stroke:#0D47A1,color:#fff
    classDef util fill:#FF9800,stroke:#E65100,color:#fff
    classDef state fill:#4CAF50,stroke:#1B5E20,color:#fff
    classDef ajax fill:#F44336,stroke:#B71C1C,color:#fff
    
    class USER user
    class HANDLER handler
    class MODULE1,MODULE2,MODULE3 module
    class UTIL1,UTIL2 util
    class STATE state
    class AJAX ajax
```

## Error Handling Flow

```mermaid
flowchart TD
    START([Function Call])
    
    TRY{Try Block?}
    START --> TRY
    
    TRY -->|Yes| EXECUTE[Execute Function Logic]
    TRY -->|No| EXECUTE_UNSAFE[Execute Without Protection]
    
    EXECUTE --> ERROR{Error Occurs?}
    EXECUTE_UNSAFE --> ERROR
    
    ERROR -->|No| SUCCESS[Return Success]
    ERROR -->|Yes - Protected| CATCH[Catch Block]
    ERROR -->|Yes - Unprotected| CRASH[Unhandled Exception]
    
    CATCH --> LOG[console.error with stack trace]
    LOG --> NOTICE[showNotice error message]
    NOTICE --> ROLLBACK{Rollback Needed?}
    
    ROLLBACK -->|Yes| RESTORE[Restore Previous State]
    ROLLBACK -->|No| SKIP_ROLLBACK[Skip Rollback]
    
    RESTORE --> GRACEFUL[Graceful Degradation]
    SKIP_ROLLBACK --> GRACEFUL
    
    CRASH --> UI_BREAK[UI Breaks]
    UI_BREAK --> USER_CONFUSED[User Confused]
    
    SUCCESS --> END([Complete])
    GRACEFUL --> END
    USER_CONFUSED --> END
    
    %% Styling
    classDef protected fill:#4CAF50,stroke:#2E7D32,color:#fff
    classDef unprotected fill:#F44336,stroke:#C62828,color:#fff
    classDef recovery fill:#FF9800,stroke:#E65100,color:#fff
    
    class TRY,EXECUTE,CATCH,LOG,NOTICE protected
    class EXECUTE_UNSAFE,CRASH,UI_BREAK,USER_CONFUSED unprotected
    class ROLLBACK,RESTORE,GRACEFUL recovery
```

## Memory Leak Analysis

```mermaid
flowchart TD
    START([Page Load])
    
    INIT[MASE.init]
    START --> INIT
    
    %% Event binding
    INIT --> BIND1[Bind Palette Events]
    INIT --> BIND2[Bind Template Events]
    INIT --> BIND3[Bind Tab Events]
    INIT --> BIND4[Bind Keyboard Events]
    INIT --> BIND5[Bind Live Preview Events]
    
    %% Memory allocation
    BIND1 --> MEM1[Memory: 19 delegated listeners]
    BIND2 --> MEM2[Memory: 12 direct listeners]
    BIND3 --> MEM3[Memory: Tab navigation]
    BIND4 --> MEM4[Memory: Keyboard shortcuts]
    BIND5 --> MEM5[Memory: Live preview listeners]
    
    %% User session
    MEM1 --> SESSION[User Session]
    MEM2 --> SESSION
    MEM3 --> SESSION
    MEM4 --> SESSION
    MEM5 --> SESSION
    
    SESSION --> HOURS[Hours Pass...]
    
    %% Cleanup check
    HOURS --> CLEANUP{Cleanup Called?}
    
    CLEANUP -->|Yes - Live Preview Only| PARTIAL[livePreview.unbind]
    CLEANUP -->|No - All Others| LEAK[Memory Leak]
    
    PARTIAL --> FREED1[Free: Live preview listeners]
    PARTIAL --> LEAK2[Leak: All other listeners]
    
    LEAK --> ACCUMULATE[Memory Accumulates]
    LEAK2 --> ACCUMULATE
    
    ACCUMULATE --> SLOW[Browser Slows Down]
    SLOW --> CRASH_RISK[Potential Tab Crash]
    
    FREED1 --> PARTIAL_OK[Partial Cleanup OK]
    
    %% Recommendations
    CRASH_RISK --> REC1[Recommendation: Add unbind methods]
    PARTIAL_OK --> REC2[Recommendation: Cleanup all modules]
    
    REC1 --> END([End Session])
    REC2 --> END
    
    %% Styling
    classDef good fill:#4CAF50,stroke:#2E7D32,color:#fff
    classDef bad fill:#F44336,stroke:#C62828,color:#fff
    classDef warning fill:#FF9800,stroke:#E65100,color:#fff
    
    class FREED1,PARTIAL_OK good
    class LEAK,LEAK2,ACCUMULATE,SLOW,CRASH_RISK bad
    class PARTIAL,REC1,REC2 warning
```

---

## Legend

### Node Colors

- 🟢 **Green**: Core modules, successful operations
- 🔵 **Blue**: Feature modules, normal flow
- 🟠 **Orange**: Utility functions, warnings
- 🔴 **Red**: AJAX calls, errors, memory leaks
- 🟣 **Purple**: State management, event handlers

### Relationship Types

- **Solid Arrow** (→): Direct dependency or call
- **Dashed Arrow** (⇢): Conditional dependency
- **Bidirectional** (↔): Mutual dependency

---

## Key Insights from Diagrams

### 1. Clean Dependency Tree
- No circular dependencies
- Clear hierarchy: Core → Features → Utilities
- Easy to trace data flow

### 2. Centralized State
- All state in `MASE.state` object
- Modules read/write state directly
- No state synchronization mechanism

### 3. Event-Driven Architecture
- Heavy use of jQuery event delegation
- Delegated events for dynamic content
- Direct bindings for static elements

### 4. Memory Leak Risk
- Only live preview events are cleaned up
- All other listeners persist forever
- Potential for memory accumulation

### 5. Error Handling Gaps
- Only 10.2% of functions protected
- Unhandled exceptions can crash UI
- Need comprehensive try-catch coverage

---

**Generated:** 2025-10-19  
**Tool:** Mermaid Diagrams  
**Source:** `assets/js/mase-admin.js`
