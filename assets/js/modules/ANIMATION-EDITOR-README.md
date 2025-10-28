# Animation Editor Documentation

This document describes the advanced animation features added to the MASE plugin, including the animation timeline editor and presets library.

## Overview

The animation editor provides two main features:

1. **Animation Timeline Editor** - A visual timeline editor for creating complex, multi-track animations with keyframe editing
2. **Animation Presets Library** - A collection of pre-built animation presets with a browser UI for easy discovery and application

## Requirements

These features fulfill Requirement 14.4 from the modern architecture refactor specification.

## Modules

### animation-timeline.js

Provides timeline-based animation sequencing with visual editing capabilities.

**Key Classes:**
- `AnimationTimeline` - Main timeline controller
- `AnimationTrack` - Individual animation track for an element
- `Keyframe` - Single keyframe with properties and easing
- `TimelineUI` - Visual timeline editor interface

**Features:**
- Multi-track animations
- Keyframe editing (add, remove, update)
- Timeline scrubbing and playback controls
- Export/import timeline data
- Visual timeline editor with ruler and playhead
- Properties panel for keyframe editing

### animation-presets.js

Provides a library of pre-built animation presets organized by category.

**Key Classes:**
- `AnimationPresetsLibrary` - Preset collection manager
- `AnimationPreset` - Individual animation preset
- `PresetBrowserUI` - Visual preset browser interface

**Features:**
- 30+ built-in animation presets
- Organized by category (fade, slide, scale, rotate, bounce, etc.)
- Search and filter presets
- Preview animations before applying
- Create custom presets
- Export/import preset libraries

## Built-in Presets

### Fade Animations
- `fade-in` - Smoothly fade element into view
- `fade-out` - Smoothly fade element out of view
- `fade-in-up` - Fade in while sliding up
- `fade-in-down` - Fade in while sliding down

### Slide Animations
- `slide-in-left` - Slide element in from the left
- `slide-in-right` - Slide element in from the right
- `slide-out-left` - Slide element out to the left
- `slide-out-right` - Slide element out to the right

### Scale Animations
- `scale-in` - Scale element from small to normal
- `scale-out` - Scale element from normal to small
- `zoom-in` - Zoom element in dramatically
- `zoom-out` - Zoom element out dramatically

### Rotate Animations
- `rotate-in` - Rotate element into view
- `rotate-out` - Rotate element out of view

### Bounce Animations
- `bounce-in` - Bounce element into view
- `bounce` - Bounce element in place

### Attention Seekers
- `shake` - Shake element horizontally
- `wobble` - Wobble element with rotation
- `pulse` - Pulse element with scale
- `heartbeat` - Heartbeat pulse effect

### Flip Animations
- `flip-in-x` - Flip element in along X axis
- `flip-in-y` - Flip element in along Y axis

### Special Effects
- `roll-in` - Roll element in from the left
- `roll-out` - Roll element out to the right
- `swing` - Swing element like a pendulum
- `rubber-band` - Stretch and snap like a rubber band
- `jello` - Jello-like wobble effect

## Usage Examples

### Basic Timeline Usage

```javascript
import { AnimationTimeline, AnimationTrack, Keyframe } from './animation-timeline.js';

// Create timeline
const timeline = new AnimationTimeline({
  duration: 2000,
  loop: false,
});

// Get element
const element = document.querySelector('.my-element');

// Create track
const track = new AnimationTrack('My Element', element);

// Add keyframes
track.addKeyframe(new Keyframe(0, { opacity: 0, transform: 'translateY(20px)' }));
track.addKeyframe(new Keyframe(1000, { opacity: 1, transform: 'translateY(0)' }));

// Add track to timeline
timeline.addTrack(track);

// Play
timeline.play();
```

### Timeline with UI Editor

```javascript
import { AnimationTimeline, TimelineUI } from './animation-timeline.js';

// Create timeline
const timeline = new AnimationTimeline();

// Create UI
const container = document.getElementById('timeline-editor');
const timelineUI = new TimelineUI(timeline, container);

// Listen to events
timeline.on('play', () => console.log('Playing'));
timeline.on('timeupdate', (data) => console.log('Time:', data.currentTime));
```

### Using Animation Presets

```javascript
import { AnimationPresetsLibrary } from './animation-presets.js';

// Get library
const library = new AnimationPresetsLibrary();

// Get preset
const fadeIn = library.getPreset('fade-in');

// Apply to element
const element = document.querySelector('.my-element');
fadeIn.apply(element, {
  duration: 500,
  easing: 'ease-out',
});
```

### Preset Browser UI

```javascript
import { AnimationPresetsLibrary, PresetBrowserUI } from './animation-presets.js';

// Create library and UI
const library = new AnimationPresetsLibrary();
const container = document.getElementById('preset-browser');

const browserUI = new PresetBrowserUI(library, container, {
  showPreview: true,
  onSelect: (preset) => {
    console.log('Selected:', preset.name);
  },
  onApply: (preset) => {
    // Apply to selected elements
    const elements = document.querySelectorAll('.selected');
    elements.forEach(el => preset.apply(el));
  },
});
```

### Creating Custom Presets

```javascript
import { AnimationPreset, AnimationPresetsLibrary } from './animation-presets.js';

const library = new AnimationPresetsLibrary();

// Create custom preset
const customPreset = new AnimationPreset(
  'my-animation',
  'My Custom Animation',
  'A custom animation',
  'custom',
  [
    { opacity: 0, transform: 'scale(0)' },
    { opacity: 1, transform: 'scale(1.1)', offset: 0.7 },
    { opacity: 1, transform: 'scale(1)' },
  ],
  {
    duration: 600,
    easing: 'ease-out',
    tags: ['custom', 'entrance'],
  }
);

// Add to library
library.addPreset(customPreset);
```

### Multi-Track Animation

```javascript
import { AnimationTimeline, AnimationTrack, Keyframe } from './animation-timeline.js';

const timeline = new AnimationTimeline({ duration: 3000 });

// Create tracks for different elements
const header = new AnimationTrack('Header', document.querySelector('.header'));
header.addKeyframe(new Keyframe(0, { opacity: 0, transform: 'translateY(-50px)' }));
header.addKeyframe(new Keyframe(500, { opacity: 1, transform: 'translateY(0)' }));

const content = new AnimationTrack('Content', document.querySelector('.content'));
content.addKeyframe(new Keyframe(300, { opacity: 0 }));
content.addKeyframe(new Keyframe(1000, { opacity: 1 }));

// Add tracks
timeline.addTrack(header);
timeline.addTrack(content);

// Play
timeline.play();
```

### Export/Import Timeline

```javascript
// Export
const timelineData = timeline.export();
localStorage.setItem('my-timeline', JSON.stringify(timelineData));

// Import
const savedData = JSON.parse(localStorage.getItem('my-timeline'));
const newTimeline = new AnimationTimeline();

// Map element names to actual elements
const elementMap = {
  'Header': document.querySelector('.header'),
  'Content': document.querySelector('.content'),
};

newTimeline.import(savedData, elementMap);
```

## API Reference

### AnimationTimeline

**Constructor Options:**
- `duration` (number) - Timeline duration in milliseconds
- `loop` (boolean) - Whether to loop the animation
- `autoplay` (boolean) - Whether to start playing automatically

**Methods:**
- `addTrack(track)` - Add animation track
- `removeTrack(trackId)` - Remove track by ID
- `getTrack(trackId)` - Get track by ID
- `addKeyframe(trackId, keyframe)` - Add keyframe to track
- `removeKeyframe(trackId, keyframeId)` - Remove keyframe
- `updateKeyframe(trackId, keyframeId, updates)` - Update keyframe
- `play()` - Play timeline
- `pause()` - Pause timeline
- `stop()` - Stop timeline
- `resume()` - Resume playback
- `seek(time)` - Seek to specific time
- `setPlaybackRate(rate)` - Set playback speed
- `getDuration()` - Get timeline duration
- `export()` - Export to JSON
- `import(data, elementMap)` - Import from JSON

**Events:**
- `play` - Timeline started playing
- `pause` - Timeline paused
- `stop` - Timeline stopped
- `timeupdate` - Current time updated
- `complete` - Timeline completed
- `trackadded` - Track added
- `trackremoved` - Track removed
- `keyframeadded` - Keyframe added
- `keyframeremoved` - Keyframe removed
- `keyframeupdated` - Keyframe updated

### AnimationPresetsLibrary

**Methods:**
- `addPreset(preset)` - Add preset to library
- `removePreset(presetId)` - Remove preset
- `getPreset(presetId)` - Get preset by ID
- `getAllPresets()` - Get all presets
- `getPresetsByCategory(category)` - Get presets by category
- `getPresetsByTag(tag)` - Get presets by tag
- `searchPresets(query)` - Search presets
- `getCategories()` - Get all categories
- `getAllTags()` - Get all tags
- `export()` - Export library to JSON
- `import(data)` - Import library from JSON

### AnimationPreset

**Constructor:**
```javascript
new AnimationPreset(id, name, description, category, keyframes, options)
```

**Methods:**
- `apply(element, customOptions)` - Apply preset to element
- `toTimeline()` - Convert to timeline format
- `clone()` - Clone preset

## Styling

The animation editor includes comprehensive CSS styles in `assets/css/mase-animation-editor.css`.

**Key CSS Classes:**
- `.mase-timeline-editor` - Timeline editor container
- `.mase-timeline-toolbar` - Toolbar with controls
- `.mase-timeline-view` - Timeline view area
- `.mase-timeline-track` - Individual track
- `.mase-timeline-keyframe` - Keyframe marker
- `.mase-preset-browser` - Preset browser container
- `.mase-preset-card` - Preset card
- `.mase-preset-preview-panel` - Preview panel

The styles include:
- Responsive design
- Dark mode support
- Hover and active states
- Smooth transitions

## Integration with MASE

To integrate the animation editor into MASE:

1. Import modules in `main-admin.js`
2. Enqueue CSS file in PHP
3. Add UI containers to admin page
4. Initialize timeline/preset browser as needed

Example integration:

```javascript
// In main-admin.js
import { AnimationTimeline, TimelineUI } from './animation-timeline.js';
import { AnimationPresetsLibrary, PresetBrowserUI } from './animation-presets.js';

// Initialize when needed
const initAnimationEditor = () => {
  const timeline = new AnimationTimeline();
  const timelineUI = new TimelineUI(
    timeline, 
    document.getElementById('mase-timeline-editor')
  );

  const library = new AnimationPresetsLibrary();
  const browserUI = new PresetBrowserUI(
    library,
    document.getElementById('mase-preset-browser')
  );
};
```

## Performance Considerations

- Timeline uses Web Animations API for 60fps performance
- GPU-accelerated transforms (translateX, translateY, scale, rotate, opacity)
- Efficient keyframe interpolation
- Minimal DOM manipulation
- Debounced UI updates during playback

## Browser Support

- Chrome/Edge 84+
- Firefox 75+
- Safari 13.1+
- Requires Web Animations API support

## Future Enhancements

Potential future additions:
- Bezier curve editor for custom easing
- Animation recording from live interactions
- Preset thumbnails/previews
- Animation templates
- Collaborative editing
- Export to CSS animations
- Import from other animation tools

## Examples

See `animation-editor-example.js` for complete working examples of all features.

## License

Part of the Modern Admin Styler (MASE) WordPress plugin.
