/**
 * Animation Timeline Editor Module
 * 
 * Provides a visual timeline editor for creating and managing complex animations.
 * Supports keyframe editing, timeline scrubbing, and animation preview.
 * 
 * Requirements: 14.4
 * 
 * @module animation-timeline
 */

import animations, { Easing, CSSEasing } from './animations.js';

/**
 * Keyframe class representing a single animation keyframe
 */
class Keyframe {
  constructor(time, properties, easing = 'linear') {
    this.time = time; // Time in milliseconds
    this.properties = { ...properties }; // CSS properties
    this.easing = easing; // Easing function for transition to this keyframe
    this.id = `keyframe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clone keyframe
   * @returns {Keyframe} Cloned keyframe
   */
  clone() {
    return new Keyframe(this.time, this.properties, this.easing);
  }

  /**
   * Update keyframe properties
   * @param {Object} updates - Properties to update
   */
  update(updates) {
    if (updates.time !== undefined) this.time = updates.time;
    if (updates.properties !== undefined) this.properties = { ...updates.properties };
    if (updates.easing !== undefined) this.easing = updates.easing;
  }

  /**
   * Convert to Web Animations API format
   * @returns {Object} Keyframe object
   */
  toWebAnimationsFormat() {
    return {
      ...this.properties,
      offset: null, // Will be calculated based on time
      easing: this.easing,
    };
  }
}

/**
 * Animation Track representing a single animated property or element
 */
class AnimationTrack {
  constructor(name, element = null) {
    this.id = `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.name = name;
    this.element = element;
    this.keyframes = [];
    this.enabled = true;
  }

  /**
   * Add keyframe to track
   * @param {Keyframe} keyframe - Keyframe to add
   */
  addKeyframe(keyframe) {
    this.keyframes.push(keyframe);
    this.sortKeyframes();
  }

  /**
   * Remove keyframe from track
   * @param {string} keyframeId - ID of keyframe to remove
   */
  removeKeyframe(keyframeId) {
    this.keyframes = this.keyframes.filter(kf => kf.id !== keyframeId);
  }

  /**
   * Get keyframe by ID
   * @param {string} keyframeId - Keyframe ID
   * @returns {Keyframe|null} Keyframe or null
   */
  getKeyframe(keyframeId) {
    return this.keyframes.find(kf => kf.id === keyframeId) || null;
  }

  /**
   * Sort keyframes by time
   */
  sortKeyframes() {
    this.keyframes.sort((a, b) => a.time - b.time);
  }

  /**
   * Get duration of track
   * @returns {number} Duration in milliseconds
   */
  getDuration() {
    if (this.keyframes.length === 0) return 0;
    return Math.max(...this.keyframes.map(kf => kf.time));
  }

  /**
   * Convert track to Web Animations API format
   * @returns {Array<Object>} Array of keyframe objects
   */
  toWebAnimationsFormat() {
    const duration = this.getDuration();
    
    return this.keyframes.map(kf => {
      const webKf = kf.toWebAnimationsFormat();
      webKf.offset = duration > 0 ? kf.time / duration : 0;
      return webKf;
    });
  }

  /**
   * Clone track
   * @returns {AnimationTrack} Cloned track
   */
  clone() {
    const cloned = new AnimationTrack(this.name, this.element);
    cloned.keyframes = this.keyframes.map(kf => kf.clone());
    cloned.enabled = this.enabled;
    return cloned;
  }
}

/**
 * Animation Timeline Editor
 * 
 * Manages complex animations with multiple tracks and keyframes.
 * Provides timeline scrubbing, keyframe editing, and preview functionality.
 */
class AnimationTimeline {
  constructor(options = {}) {
    this.options = {
      duration: 1000, // Default timeline duration in ms
      loop: false,
      autoplay: false,
      ...options,
    };

    this.tracks = [];
    this.currentTime = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.playbackRate = 1.0;
    
    // Animation instance
    this.animation = null;
    
    // Event listeners
    this.listeners = {
      play: [],
      pause: [],
      stop: [],
      timeupdate: [],
      complete: [],
      trackadded: [],
      trackremoved: [],
      keyframeadded: [],
      keyframeremoved: [],
      keyframeupdated: [],
    };
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Add track to timeline
   * @param {AnimationTrack} track - Track to add
   */
  addTrack(track) {
    this.tracks.push(track);
    this.emit('trackadded', { track });
  }

  /**
   * Remove track from timeline
   * @param {string} trackId - Track ID
   */
  removeTrack(trackId) {
    const track = this.tracks.find(t => t.id === trackId);
    this.tracks = this.tracks.filter(t => t.id !== trackId);
    if (track) {
      this.emit('trackremoved', { track });
    }
  }

  /**
   * Get track by ID
   * @param {string} trackId - Track ID
   * @returns {AnimationTrack|null} Track or null
   */
  getTrack(trackId) {
    return this.tracks.find(t => t.id === trackId) || null;
  }

  /**
   * Add keyframe to track
   * @param {string} trackId - Track ID
   * @param {Keyframe} keyframe - Keyframe to add
   */
  addKeyframe(trackId, keyframe) {
    const track = this.getTrack(trackId);
    if (track) {
      track.addKeyframe(keyframe);
      this.emit('keyframeadded', { track, keyframe });
    }
  }

  /**
   * Remove keyframe from track
   * @param {string} trackId - Track ID
   * @param {string} keyframeId - Keyframe ID
   */
  removeKeyframe(trackId, keyframeId) {
    const track = this.getTrack(trackId);
    if (track) {
      const keyframe = track.getKeyframe(keyframeId);
      track.removeKeyframe(keyframeId);
      if (keyframe) {
        this.emit('keyframeremoved', { track, keyframe });
      }
    }
  }

  /**
   * Update keyframe
   * @param {string} trackId - Track ID
   * @param {string} keyframeId - Keyframe ID
   * @param {Object} updates - Updates to apply
   */
  updateKeyframe(trackId, keyframeId, updates) {
    const track = this.getTrack(trackId);
    if (track) {
      const keyframe = track.getKeyframe(keyframeId);
      if (keyframe) {
        keyframe.update(updates);
        track.sortKeyframes();
        this.emit('keyframeupdated', { track, keyframe });
      }
    }
  }

  /**
   * Get timeline duration
   * @returns {number} Duration in milliseconds
   */
  getDuration() {
    if (this.tracks.length === 0) return this.options.duration;
    return Math.max(...this.tracks.map(t => t.getDuration()), this.options.duration);
  }

  /**
   * Set timeline duration
   * @param {number} duration - Duration in milliseconds
   */
  setDuration(duration) {
    this.options.duration = duration;
  }

  /**
   * Seek to specific time
   * @param {number} time - Time in milliseconds
   */
  seek(time) {
    this.currentTime = Math.max(0, Math.min(time, this.getDuration()));
    
    if (this.animation) {
      this.animation.currentTime = this.currentTime;
    }
    
    this.emit('timeupdate', { currentTime: this.currentTime });
  }

  /**
   * Play timeline
   */
  play() {
    if (this.isPlaying && !this.isPaused) return;

    this.isPlaying = true;
    this.isPaused = false;

    // Build and play animation
    this._buildAndPlayAnimation();

    this.emit('play', { currentTime: this.currentTime });
  }

  /**
   * Pause timeline
   */
  pause() {
    if (!this.isPlaying || this.isPaused) return;

    this.isPaused = true;

    if (this.animation) {
      this.animation.pause();
    }

    this.emit('pause', { currentTime: this.currentTime });
  }

  /**
   * Stop timeline
   */
  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentTime = 0;

    if (this.animation) {
      this.animation.cancel();
      this.animation = null;
    }

    this.emit('stop', {});
  }

  /**
   * Resume timeline
   */
  resume() {
    if (!this.isPaused) return;

    this.isPaused = false;

    if (this.animation) {
      this.animation.play();
    }

    this.emit('play', { currentTime: this.currentTime });
  }

  /**
   * Set playback rate
   * @param {number} rate - Playback rate (1.0 = normal speed)
   */
  setPlaybackRate(rate) {
    this.playbackRate = rate;

    if (this.animation) {
      this.animation.playbackRate = rate;
    }
  }

  /**
   * Build and play animation from tracks
   * @private
   */
  _buildAndPlayAnimation() {
    // Cancel existing animation
    if (this.animation) {
      this.animation.cancel();
    }

    // Get enabled tracks
    const enabledTracks = this.tracks.filter(t => t.enabled && t.element);

    if (enabledTracks.length === 0) {
      console.warn('No enabled tracks with elements to animate');
      return;
    }

    // Create animations for each track
    const trackAnimations = enabledTracks.map(track => {
      const keyframes = track.toWebAnimationsFormat();
      const duration = this.getDuration();

      return track.element.animate(keyframes, {
        duration,
        fill: 'both',
        easing: 'linear', // Easing is per-keyframe
      });
    });

    // Use first animation as reference
    this.animation = trackAnimations[0];
    this.animation.playbackRate = this.playbackRate;

    // Sync current time
    if (this.currentTime > 0) {
      this.animation.currentTime = this.currentTime;
    }

    // Handle animation events
    this.animation.onfinish = () => {
      if (this.options.loop) {
        this.currentTime = 0;
        this.play();
      } else {
        this.isPlaying = false;
        this.currentTime = this.getDuration();
        this.emit('complete', {});
      }
    };

    // Update current time during playback
    const updateTime = () => {
      if (this.isPlaying && !this.isPaused && this.animation) {
        this.currentTime = this.animation.currentTime || 0;
        this.emit('timeupdate', { currentTime: this.currentTime });
        requestAnimationFrame(updateTime);
      }
    };

    requestAnimationFrame(updateTime);
  }

  /**
   * Export timeline to JSON
   * @returns {Object} Timeline data
   */
  export() {
    return {
      version: '1.0',
      duration: this.options.duration,
      loop: this.options.loop,
      tracks: this.tracks.map(track => ({
        id: track.id,
        name: track.name,
        enabled: track.enabled,
        keyframes: track.keyframes.map(kf => ({
          id: kf.id,
          time: kf.time,
          properties: kf.properties,
          easing: kf.easing,
        })),
      })),
    };
  }

  /**
   * Import timeline from JSON
   * @param {Object} data - Timeline data
   * @param {Object} elementMap - Map of track names to elements
   */
  import(data, elementMap = {}) {
    this.stop();
    this.tracks = [];

    this.options.duration = data.duration || 1000;
    this.options.loop = data.loop || false;

    data.tracks.forEach(trackData => {
      const track = new AnimationTrack(trackData.name, elementMap[trackData.name]);
      track.id = trackData.id;
      track.enabled = trackData.enabled;

      trackData.keyframes.forEach(kfData => {
        const keyframe = new Keyframe(kfData.time, kfData.properties, kfData.easing);
        keyframe.id = kfData.id;
        track.addKeyframe(keyframe);
      });

      this.addTrack(track);
    });
  }

  /**
   * Clone timeline
   * @returns {AnimationTimeline} Cloned timeline
   */
  clone() {
    const cloned = new AnimationTimeline(this.options);
    cloned.tracks = this.tracks.map(t => t.clone());
    return cloned;
  }

  /**
   * Clear all tracks
   */
  clear() {
    this.stop();
    this.tracks = [];
    this.currentTime = 0;
  }

  /**
   * Get timeline statistics
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      duration: this.getDuration(),
      trackCount: this.tracks.length,
      enabledTrackCount: this.tracks.filter(t => t.enabled).length,
      totalKeyframes: this.tracks.reduce((sum, t) => sum + t.keyframes.length, 0),
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentTime: this.currentTime,
      playbackRate: this.playbackRate,
    };
  }
}

/**
 * Timeline UI Builder
 * 
 * Creates a visual timeline editor interface
 */
class TimelineUI {
  constructor(timeline, container) {
    this.timeline = timeline;
    this.container = container;
    this.pixelsPerMs = 0.1; // Zoom level
    this.selectedKeyframe = null;
    this.selectedTrack = null;
    
    this._init();
  }

  /**
   * Initialize UI
   * @private
   */
  _init() {
    this.container.innerHTML = '';
    this.container.className = 'mase-timeline-editor';

    // Create toolbar
    this._createToolbar();

    // Create timeline view
    this._createTimelineView();

    // Create properties panel
    this._createPropertiesPanel();

    // Bind events
    this._bindEvents();
  }

  /**
   * Create toolbar
   * @private
   */
  _createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'mase-timeline-toolbar';

    // Play/Pause button
    const playBtn = document.createElement('button');
    playBtn.className = 'mase-timeline-btn mase-timeline-play';
    playBtn.textContent = '▶';
    playBtn.onclick = () => this._togglePlayback();
    toolbar.appendChild(playBtn);

    // Stop button
    const stopBtn = document.createElement('button');
    stopBtn.className = 'mase-timeline-btn mase-timeline-stop';
    stopBtn.textContent = '■';
    stopBtn.onclick = () => this.timeline.stop();
    toolbar.appendChild(stopBtn);

    // Time display
    const timeDisplay = document.createElement('span');
    timeDisplay.className = 'mase-timeline-time';
    timeDisplay.textContent = '0ms / 0ms';
    toolbar.appendChild(timeDisplay);
    this.timeDisplay = timeDisplay;

    // Add track button
    const addTrackBtn = document.createElement('button');
    addTrackBtn.className = 'mase-timeline-btn mase-timeline-add-track';
    addTrackBtn.textContent = '+ Track';
    addTrackBtn.onclick = () => this._addTrack();
    toolbar.appendChild(addTrackBtn);

    this.container.appendChild(toolbar);
    this.playBtn = playBtn;
  }

  /**
   * Create timeline view
   * @private
   */
  _createTimelineView() {
    const timelineView = document.createElement('div');
    timelineView.className = 'mase-timeline-view';

    // Ruler
    const ruler = document.createElement('div');
    ruler.className = 'mase-timeline-ruler';
    timelineView.appendChild(ruler);
    this.ruler = ruler;

    // Tracks container
    const tracksContainer = document.createElement('div');
    tracksContainer.className = 'mase-timeline-tracks';
    timelineView.appendChild(tracksContainer);
    this.tracksContainer = tracksContainer;

    // Playhead
    const playhead = document.createElement('div');
    playhead.className = 'mase-timeline-playhead';
    timelineView.appendChild(playhead);
    this.playhead = playhead;

    this.container.appendChild(timelineView);

    this._updateRuler();
    this._updateTracks();
  }

  /**
   * Create properties panel
   * @private
   */
  _createPropertiesPanel() {
    const panel = document.createElement('div');
    panel.className = 'mase-timeline-properties';
    panel.innerHTML = '<div class="mase-timeline-properties-empty">Select a keyframe to edit</div>';
    this.container.appendChild(panel);
    this.propertiesPanel = panel;
  }

  /**
   * Bind timeline events
   * @private
   */
  _bindEvents() {
    this.timeline.on('play', () => this._onPlay());
    this.timeline.on('pause', () => this._onPause());
    this.timeline.on('stop', () => this._onStop());
    this.timeline.on('timeupdate', (data) => this._onTimeUpdate(data));
    this.timeline.on('trackadded', () => this._updateTracks());
    this.timeline.on('trackremoved', () => this._updateTracks());
    this.timeline.on('keyframeadded', () => this._updateTracks());
    this.timeline.on('keyframeremoved', () => this._updateTracks());
    this.timeline.on('keyframeupdated', () => this._updateTracks());
  }

  /**
   * Toggle playback
   * @private
   */
  _togglePlayback() {
    if (this.timeline.isPlaying && !this.timeline.isPaused) {
      this.timeline.pause();
    } else if (this.timeline.isPaused) {
      this.timeline.resume();
    } else {
      this.timeline.play();
    }
  }

  /**
   * Add new track
   * @private
   */
  _addTrack() {
    const name = prompt('Track name:');
    if (name) {
      const track = new AnimationTrack(name);
      this.timeline.addTrack(track);
    }
  }

  /**
   * Update ruler
   * @private
   */
  _updateRuler() {
    const duration = this.timeline.getDuration();
    const width = duration * this.pixelsPerMs;
    
    this.ruler.innerHTML = '';
    this.ruler.style.width = `${width}px`;

    // Add time markers every 100ms
    for (let time = 0; time <= duration; time += 100) {
      const marker = document.createElement('div');
      marker.className = 'mase-timeline-marker';
      marker.style.left = `${time * this.pixelsPerMs}px`;
      marker.textContent = `${time}ms`;
      this.ruler.appendChild(marker);
    }
  }

  /**
   * Update tracks display
   * @private
   */
  _updateTracks() {
    this.tracksContainer.innerHTML = '';

    this.timeline.tracks.forEach(track => {
      const trackEl = this._createTrackElement(track);
      this.tracksContainer.appendChild(trackEl);
    });

    this._updateRuler();
  }

  /**
   * Create track element
   * @private
   */
  _createTrackElement(track) {
    const trackEl = document.createElement('div');
    trackEl.className = 'mase-timeline-track';
    trackEl.dataset.trackId = track.id;

    // Track header
    const header = document.createElement('div');
    header.className = 'mase-timeline-track-header';
    header.textContent = track.name;
    trackEl.appendChild(header);

    // Track content
    const content = document.createElement('div');
    content.className = 'mase-timeline-track-content';
    content.style.width = `${this.timeline.getDuration() * this.pixelsPerMs}px`;

    // Add keyframes
    track.keyframes.forEach(keyframe => {
      const kfEl = this._createKeyframeElement(keyframe, track);
      content.appendChild(kfEl);
    });

    trackEl.appendChild(content);

    return trackEl;
  }

  /**
   * Create keyframe element
   * @private
   */
  _createKeyframeElement(keyframe, track) {
    const kfEl = document.createElement('div');
    kfEl.className = 'mase-timeline-keyframe';
    kfEl.style.left = `${keyframe.time * this.pixelsPerMs}px`;
    kfEl.dataset.keyframeId = keyframe.id;
    kfEl.dataset.trackId = track.id;
    kfEl.title = `${keyframe.time}ms`;

    kfEl.onclick = (e) => {
      e.stopPropagation();
      this._selectKeyframe(track, keyframe);
    };

    return kfEl;
  }

  /**
   * Select keyframe
   * @private
   */
  _selectKeyframe(track, keyframe) {
    this.selectedTrack = track;
    this.selectedKeyframe = keyframe;
    this._updatePropertiesPanel();
  }

  /**
   * Update properties panel
   * @private
   */
  _updatePropertiesPanel() {
    if (!this.selectedKeyframe || !this.selectedTrack) {
      this.propertiesPanel.innerHTML = '<div class="mase-timeline-properties-empty">Select a keyframe to edit</div>';
      return;
    }

    const kf = this.selectedKeyframe;
    
    this.propertiesPanel.innerHTML = `
      <h3>Keyframe Properties</h3>
      <label>Time (ms): <input type="number" class="mase-kf-time" value="${kf.time}" /></label>
      <label>Easing: <select class="mase-kf-easing">
        ${Object.keys(CSSEasing).map(key => 
          `<option value="${CSSEasing[key]}" ${kf.easing === CSSEasing[key] ? 'selected' : ''}>${key}</option>`
        ).join('')}
      </select></label>
      <h4>Properties</h4>
      <div class="mase-kf-properties">
        ${Object.entries(kf.properties).map(([prop, value]) => 
          `<label>${prop}: <input type="text" data-prop="${prop}" value="${value}" /></label>`
        ).join('')}
      </div>
      <button class="mase-timeline-btn mase-kf-delete">Delete Keyframe</button>
    `;

    // Bind property inputs
    this.propertiesPanel.querySelector('.mase-kf-time').oninput = (e) => {
      this.timeline.updateKeyframe(this.selectedTrack.id, kf.id, { time: parseInt(e.target.value) });
    };

    this.propertiesPanel.querySelector('.mase-kf-easing').onchange = (e) => {
      this.timeline.updateKeyframe(this.selectedTrack.id, kf.id, { easing: e.target.value });
    };

    this.propertiesPanel.querySelectorAll('.mase-kf-properties input').forEach(input => {
      input.oninput = (e) => {
        const prop = e.target.dataset.prop;
        const properties = { ...kf.properties, [prop]: e.target.value };
        this.timeline.updateKeyframe(this.selectedTrack.id, kf.id, { properties });
      };
    });

    this.propertiesPanel.querySelector('.mase-kf-delete').onclick = () => {
      this.timeline.removeKeyframe(this.selectedTrack.id, kf.id);
      this.selectedKeyframe = null;
      this.selectedTrack = null;
      this._updatePropertiesPanel();
    };
  }

  /**
   * Handle play event
   * @private
   */
  _onPlay() {
    this.playBtn.textContent = '⏸';
  }

  /**
   * Handle pause event
   * @private
   */
  _onPause() {
    this.playBtn.textContent = '▶';
  }

  /**
   * Handle stop event
   * @private
   */
  _onStop() {
    this.playBtn.textContent = '▶';
    this._updateTimeDisplay();
    this._updatePlayhead();
  }

  /**
   * Handle time update
   * @private
   */
  _onTimeUpdate(data) {
    this._updateTimeDisplay();
    this._updatePlayhead();
  }

  /**
   * Update time display
   * @private
   */
  _updateTimeDisplay() {
    const current = Math.round(this.timeline.currentTime);
    const total = Math.round(this.timeline.getDuration());
    this.timeDisplay.textContent = `${current}ms / ${total}ms`;
  }

  /**
   * Update playhead position
   * @private
   */
  _updatePlayhead() {
    const position = this.timeline.currentTime * this.pixelsPerMs;
    this.playhead.style.left = `${position}px`;
  }

  /**
   * Set zoom level
   * @param {number} pixelsPerMs - Pixels per millisecond
   */
  setZoom(pixelsPerMs) {
    this.pixelsPerMs = pixelsPerMs;
    this._updateRuler();
    this._updateTracks();
    this._updatePlayhead();
  }

  /**
   * Destroy UI
   */
  destroy() {
    this.container.innerHTML = '';
  }
}

export { AnimationTimeline, AnimationTrack, Keyframe, TimelineUI };
export default AnimationTimeline;
