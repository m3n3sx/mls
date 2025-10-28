/**
 * Animation Editor Example
 * 
 * Demonstrates how to use the animation timeline editor and presets library.
 * This file shows example usage patterns for developers.
 * 
 * @module animation-editor-example
 */

import { 
  AnimationTimeline, 
  AnimationTrack, 
  Keyframe, 
  TimelineUI 
} from './animation-timeline.js';

import { 
  AnimationPresetsLibrary, 
  AnimationPreset, 
  PresetBrowserUI 
} from './animation-presets.js';

/**
 * Example 1: Create a simple timeline with keyframes
 */
export function createSimpleTimeline() {
  // Create timeline
  const timeline = new AnimationTimeline({
    duration: 2000,
    loop: false,
  });

  // Get element to animate
  const element = document.querySelector('.my-element');

  // Create track for the element
  const track = new AnimationTrack('My Element', element);

  // Add keyframes
  track.addKeyframe(new Keyframe(0, { opacity: 0, transform: 'translateY(20px)' }, 'ease-out'));
  track.addKeyframe(new Keyframe(500, { opacity: 1, transform: 'translateY(0)' }, 'ease-in-out'));
  track.addKeyframe(new Keyframe(1500, { opacity: 1, transform: 'scale(1.2)' }, 'ease-in-out'));
  track.addKeyframe(new Keyframe(2000, { opacity: 0, transform: 'scale(0.8)' }, 'ease-in'));

  // Add track to timeline
  timeline.addTrack(track);

  // Play timeline
  timeline.play();

  return timeline;
}

/**
 * Example 2: Create timeline with UI editor
 */
export function createTimelineWithUI() {
  // Create timeline
  const timeline = new AnimationTimeline({
    duration: 3000,
    loop: true,
  });

  // Create UI container
  const container = document.getElementById('timeline-editor');

  // Create timeline UI
  const timelineUI = new TimelineUI(timeline, container);

  // Listen to timeline events
  timeline.on('play', () => {
    console.log('Timeline started playing');
  });

  timeline.on('complete', () => {
    console.log('Timeline completed');
  });

  timeline.on('timeupdate', (data) => {
    console.log('Current time:', data.currentTime);
  });

  return { timeline, timelineUI };
}

/**
 * Example 3: Export and import timeline
 */
export function exportImportTimeline(timeline) {
  // Export timeline to JSON
  const timelineData = timeline.export();
  console.log('Exported timeline:', timelineData);

  // Save to localStorage
  localStorage.setItem('my-timeline', JSON.stringify(timelineData));

  // Later, import timeline
  const savedData = JSON.parse(localStorage.getItem('my-timeline'));
  
  // Create new timeline and import
  const newTimeline = new AnimationTimeline();
  
  // Map element names to actual elements
  const elementMap = {
    'My Element': document.querySelector('.my-element'),
  };
  
  newTimeline.import(savedData, elementMap);

  return newTimeline;
}

/**
 * Example 4: Use animation presets
 */
export function useAnimationPresets() {
  // Get presets library (singleton)
  const library = new AnimationPresetsLibrary();

  // Get a specific preset
  const fadeInPreset = library.getPreset('fade-in');

  // Apply preset to element
  const element = document.querySelector('.my-element');
  fadeInPreset.apply(element, {
    duration: 500,
    easing: 'ease-out',
  });

  // Get all presets in a category
  const fadePresets = library.getPresetsByCategory('fade');
  console.log('Fade presets:', fadePresets);

  // Search presets
  const bouncePresets = library.searchPresets('bounce');
  console.log('Bounce presets:', bouncePresets);

  return library;
}

/**
 * Example 5: Create preset browser UI
 */
export function createPresetBrowser() {
  // Get presets library
  const library = new AnimationPresetsLibrary();

  // Create UI container
  const container = document.getElementById('preset-browser');

  // Create preset browser UI
  const browserUI = new PresetBrowserUI(library, container, {
    showPreview: true,
    onSelect: (preset) => {
      console.log('Selected preset:', preset.name);
    },
    onApply: (preset) => {
      console.log('Applying preset:', preset.name);
      
      // Apply to selected elements
      const elements = document.querySelectorAll('.selected-element');
      elements.forEach(element => {
        preset.apply(element);
      });
    },
  });

  return browserUI;
}

/**
 * Example 6: Create custom preset
 */
export function createCustomPreset() {
  const library = new AnimationPresetsLibrary();

  // Create custom preset
  const customPreset = new AnimationPreset(
    'my-custom-animation',
    'My Custom Animation',
    'A custom animation I created',
    'custom',
    [
      { opacity: 0, transform: 'translateX(-100px) rotate(-45deg)' },
      { opacity: 0.5, transform: 'translateX(0) rotate(0deg)', offset: 0.6 },
      { opacity: 1, transform: 'translateX(0) rotate(0deg)' },
    ],
    {
      duration: 800,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      tags: ['custom', 'entrance', 'fancy'],
    }
  );

  // Add to library
  library.addPreset(customPreset);

  // Apply to element
  const element = document.querySelector('.my-element');
  customPreset.apply(element);

  return customPreset;
}

/**
 * Example 7: Convert preset to timeline
 */
export function convertPresetToTimeline() {
  const library = new AnimationPresetsLibrary();
  
  // Get preset
  const preset = library.getPreset('bounce-in');

  // Convert to timeline
  const timeline = preset.toTimeline();

  // Now you can edit it in timeline editor
  const container = document.getElementById('timeline-editor');
  const timelineUI = new TimelineUI(timeline, container);

  return { timeline, timelineUI };
}

/**
 * Example 8: Multi-track animation
 */
export function createMultiTrackAnimation() {
  const timeline = new AnimationTimeline({
    duration: 3000,
  });

  // Create tracks for different elements
  const headerTrack = new AnimationTrack('Header', document.querySelector('.header'));
  headerTrack.addKeyframe(new Keyframe(0, { opacity: 0, transform: 'translateY(-50px)' }));
  headerTrack.addKeyframe(new Keyframe(500, { opacity: 1, transform: 'translateY(0)' }));

  const contentTrack = new AnimationTrack('Content', document.querySelector('.content'));
  contentTrack.addKeyframe(new Keyframe(300, { opacity: 0, transform: 'translateY(20px)' }));
  contentTrack.addKeyframe(new Keyframe(1000, { opacity: 1, transform: 'translateY(0)' }));

  const footerTrack = new AnimationTrack('Footer', document.querySelector('.footer'));
  footerTrack.addKeyframe(new Keyframe(600, { opacity: 0, transform: 'translateY(20px)' }));
  footerTrack.addKeyframe(new Keyframe(1500, { opacity: 1, transform: 'translateY(0)' }));

  // Add all tracks
  timeline.addTrack(headerTrack);
  timeline.addTrack(contentTrack);
  timeline.addTrack(footerTrack);

  // Play timeline
  timeline.play();

  return timeline;
}

/**
 * Example 9: Timeline with playback controls
 */
export function createTimelineWithControls() {
  const timeline = new AnimationTimeline({
    duration: 2000,
    loop: false,
  });

  // Setup timeline...
  const track = new AnimationTrack('Element', document.querySelector('.my-element'));
  track.addKeyframe(new Keyframe(0, { opacity: 0 }));
  track.addKeyframe(new Keyframe(2000, { opacity: 1 }));
  timeline.addTrack(track);

  // Create custom controls
  document.getElementById('play-btn').onclick = () => timeline.play();
  document.getElementById('pause-btn').onclick = () => timeline.pause();
  document.getElementById('stop-btn').onclick = () => timeline.stop();
  document.getElementById('speed-slider').oninput = (e) => {
    timeline.setPlaybackRate(parseFloat(e.target.value));
  };

  // Seek on timeline click
  document.getElementById('timeline-bar').onclick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const time = percent * timeline.getDuration();
    timeline.seek(time);
  };

  return timeline;
}

/**
 * Example 10: Save and load presets library
 */
export function saveLoadPresetsLibrary() {
  const library = new AnimationPresetsLibrary();

  // Add custom presets...
  library.addPreset(new AnimationPreset(
    'custom-1',
    'Custom Animation 1',
    'My first custom animation',
    'custom',
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 300 }
  ));

  // Export library
  const libraryData = library.export();
  localStorage.setItem('animation-presets', JSON.stringify(libraryData));

  // Later, load library
  const savedData = JSON.parse(localStorage.getItem('animation-presets'));
  const newLibrary = new AnimationPresetsLibrary();
  newLibrary.import(savedData);

  return newLibrary;
}

// Export all examples
export default {
  createSimpleTimeline,
  createTimelineWithUI,
  exportImportTimeline,
  useAnimationPresets,
  createPresetBrowser,
  createCustomPreset,
  convertPresetToTimeline,
  createMultiTrackAnimation,
  createTimelineWithControls,
  saveLoadPresetsLibrary,
};
