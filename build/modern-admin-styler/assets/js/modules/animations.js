/**
 * Animations Module
 *
 * Visual effects and micro-interactions using Web Animations API.
 * Provides smooth 60fps animations with reduced motion support.
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 *
 * @module animations
 */

/**
 * Easing functions library
 * Requirement 7.3
 *
 * Provides natural motion curves for animations.
 * All functions take a value t (0-1) and return eased value (0-1).
 */
export const Easing = {
  /**
   * Linear easing (no easing)
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  linear: (t) => t,

  /**
   * Ease in (accelerating from zero velocity)
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeIn: (t) => t * t,

  /**
   * Ease out (decelerating to zero velocity)
   * Requirement 7.3
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeOut: (t) => t * (2 - t),

  /**
   * Ease in-out (accelerating then decelerating)
   * Requirement 7.3
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  /**
   * Ease in quadratic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeInQuad: (t) => t * t,

  /**
   * Ease out quadratic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeOutQuad: (t) => t * (2 - t),

  /**
   * Ease in-out quadratic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  /**
   * Ease in cubic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeInCubic: (t) => t * t * t,

  /**
   * Ease out cubic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeOutCubic: (t) => --t * t * t + 1,

  /**
   * Ease in-out cubic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

  /**
   * Ease in quartic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeInQuart: (t) => t * t * t * t,

  /**
   * Ease out quartic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeOutQuart: (t) => 1 - --t * t * t * t,

  /**
   * Ease in-out quartic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),

  /**
   * Ease in quintic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeInQuint: (t) => t * t * t * t * t,

  /**
   * Ease out quintic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeOutQuint: (t) => 1 + --t * t * t * t * t,

  /**
   * Ease in-out quintic
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  easeInOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t),

  /**
   * Spring easing (bouncy effect)
   * Requirement 7.3
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  spring: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  /**
   * Bounce easing (bouncing effect)
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  bounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },

  /**
   * Elastic easing (elastic effect)
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased value (0-1)
   */
  elastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },

  /**
   * Create custom cubic-bezier easing function
   * Requirement 7.3
   *
   * @param {number} x1 - First control point x
   * @param {number} y1 - First control point y
   * @param {number} x2 - Second control point x
   * @param {number} y2 - Second control point y
   * @returns {Function} Easing function
   */
  cubicBezier: (x1, y1, x2, y2) => {
    // Simplified cubic bezier implementation
    // For production, consider using a library like bezier-easing
    return (t) => {
      // Newton-Raphson iteration for cubic bezier
      const epsilon = 1e-6;
      let x = t;

      for (let i = 0; i < 8; i++) {
        const z =
          x * x * x * (1 - x1) +
          3 * x * x * (1 - x) * x1 +
          3 * x * (1 - x) * (1 - x) * 0 +
          (1 - x) * (1 - x) * (1 - x) * 0 -
          t;
        if (Math.abs(z) < epsilon) {
          break;
        }
        const dz =
          3 * x * x * (x2 - x1) + 6 * x * (1 - x) * (x1 - 0) + 3 * (1 - x) * (1 - x) * (0 - 0);
        if (Math.abs(dz) < epsilon) {
          break;
        }
        x = x - z / dz;
      }

      return (
        x * x * x * (1 - y2) +
        3 * x * x * (1 - x) * y2 +
        3 * x * (1 - x) * (1 - x) * y1 +
        (1 - x) * (1 - x) * (1 - x) * 0
      );
    };
  },
};

/**
 * CSS easing function names mapped to cubic-bezier values
 * Can be used directly with Web Animations API
 */
export const CSSEasing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
};

/**
 * Animations class managing visual effects and micro-interactions
 *
 * Features:
 * - Web Animations API for 60fps performance
 * - Respects prefers-reduced-motion
 * - Common animation presets (fadeIn, fadeOut, slideIn)
 * - Animation control methods (play, pause, cancel)
 * - Easing functions library
 * - Animation queuing for sequential animations
 * - GPU-accelerated transforms
 * - Maximum 500ms duration limit
 */
class Animations {
  constructor(options = {}) {
    this.options = {
      maxDuration: 500, // Maximum animation duration in ms (Requirement 7.5)
      defaultDuration: 300,
      defaultEasing: 'ease-in-out',
      respectReducedMotion: true,
      ...options,
    };

    // Animation queue for sequential animations
    this.animationQueue = [];
    this.isProcessingQueue = false;

    // Active animations registry
    this.activeAnimations = new Map();

    // Check for reduced motion preference
    this.reducedMotionEnabled = this._checkReducedMotion();

    // Listen for reduced motion changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', () => {
        this.reducedMotionEnabled = this._checkReducedMotion();
      });
    }
  }

  /**
   * Check if user prefers reduced motion
   * Requirement 7.1
   *
   * @private
   * @returns {boolean} True if reduced motion is preferred
   */
  _checkReducedMotion() {
    if (!this.options.respectReducedMotion) {
      return false;
    }

    if (window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    return false;
  }

  /**
   * Get effective duration based on reduced motion setting
   *
   * @private
   * @param {number} duration - Requested duration
   * @returns {number} Effective duration (0 if reduced motion enabled)
   */
  _getEffectiveDuration(duration) {
    if (this.reducedMotionEnabled) {
      return 0; // Instant transition
    }

    // Enforce maximum duration limit (Requirement 7.5)
    return Math.min(duration, this.options.maxDuration);
  }

  /**
   * Animate element with Web Animations API
   * Requirement 7.2
   *
   * @param {Element} element - DOM element to animate
   * @param {Array<Object>} keyframes - Animation keyframes
   * @param {Object} options - Animation options
   * @returns {Animation} Web Animation instance
   */
  animate(element, keyframes, options = {}) {
    if (!element || !(element instanceof Element)) {
      throw new Error('Invalid element provided to animate()');
    }

    if (!Array.isArray(keyframes) || keyframes.length === 0) {
      throw new Error('Keyframes must be a non-empty array');
    }

    // Merge options with defaults
    const animationOptions = {
      duration: this._getEffectiveDuration(options.duration || this.options.defaultDuration),
      easing: options.easing || this.options.defaultEasing,
      fill: options.fill || 'forwards',
      iterations: options.iterations || 1,
      ...options,
    };

    // Create animation using Web Animations API
    const animation = element.animate(keyframes, animationOptions);

    // Store animation reference
    const animationId = `${element.id || 'element'}-${Date.now()}`;
    this.activeAnimations.set(animationId, animation);

    // Clean up when animation finishes
    animation.onfinish = () => {
      this.activeAnimations.delete(animationId);
      if (options.onFinish) {
        options.onFinish();
      }
    };

    // Handle animation cancellation
    animation.oncancel = () => {
      this.activeAnimations.delete(animationId);
      if (options.onCancel) {
        options.onCancel();
      }
    };

    return animation;
  }

  /**
   * Fade in animation preset
   * Requirement 7.2
   *
   * @param {Element} element - Element to fade in
   * @param {Object} options - Animation options
   * @returns {Animation} Web Animation instance
   */
  fadeIn(element, options = {}) {
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];

    return this.animate(element, keyframes, {
      duration: options.duration || this.options.defaultDuration,
      easing: options.easing || 'ease-out',
      ...options,
    });
  }

  /**
   * Fade out animation preset
   * Requirement 7.2
   *
   * @param {Element} element - Element to fade out
   * @param {Object} options - Animation options
   * @returns {Animation} Web Animation instance
   */
  fadeOut(element, options = {}) {
    const keyframes = [{ opacity: 1 }, { opacity: 0 }];

    return this.animate(element, keyframes, {
      duration: options.duration || this.options.defaultDuration,
      easing: options.easing || 'ease-in',
      ...options,
    });
  }

  /**
   * Slide in animation preset
   * Requirement 7.2
   * Uses GPU-accelerated transforms (Requirement 7.4)
   *
   * @param {Element} element - Element to slide in
   * @param {string} direction - Direction: 'up', 'down', 'left', 'right'
   * @param {Object} options - Animation options
   * @returns {Animation} Web Animation instance
   */
  slideIn(element, direction = 'up', options = {}) {
    const distance = options.distance || 20;

    let keyframes;
    switch (direction) {
      case 'up':
        keyframes = [
          { transform: `translateY(${distance}px)`, opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ];
        break;
      case 'down':
        keyframes = [
          { transform: `translateY(-${distance}px)`, opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ];
        break;
      case 'left':
        keyframes = [
          { transform: `translateX(${distance}px)`, opacity: 0 },
          { transform: 'translateX(0)', opacity: 1 },
        ];
        break;
      case 'right':
        keyframes = [
          { transform: `translateX(-${distance}px)`, opacity: 0 },
          { transform: 'translateX(0)', opacity: 1 },
        ];
        break;
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }

    return this.animate(element, keyframes, {
      duration: options.duration || this.options.defaultDuration,
      easing: options.easing || 'ease-out',
      ...options,
    });
  }

  /**
   * Slide out animation preset
   * Uses GPU-accelerated transforms (Requirement 7.4)
   *
   * @param {Element} element - Element to slide out
   * @param {string} direction - Direction: 'up', 'down', 'left', 'right'
   * @param {Object} options - Animation options
   * @returns {Animation} Web Animation instance
   */
  slideOut(element, direction = 'up', options = {}) {
    const distance = options.distance || 20;

    let keyframes;
    switch (direction) {
      case 'up':
        keyframes = [
          { transform: 'translateY(0)', opacity: 1 },
          { transform: `translateY(-${distance}px)`, opacity: 0 },
        ];
        break;
      case 'down':
        keyframes = [
          { transform: 'translateY(0)', opacity: 1 },
          { transform: `translateY(${distance}px)`, opacity: 0 },
        ];
        break;
      case 'left':
        keyframes = [
          { transform: 'translateX(0)', opacity: 1 },
          { transform: `translateX(-${distance}px)`, opacity: 0 },
        ];
        break;
      case 'right':
        keyframes = [
          { transform: 'translateX(0)', opacity: 1 },
          { transform: `translateX(${distance}px)`, opacity: 0 },
        ];
        break;
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }

    return this.animate(element, keyframes, {
      duration: options.duration || this.options.defaultDuration,
      easing: options.easing || 'ease-in',
      ...options,
    });
  }

  /**
   * Scale animation preset
   * Uses GPU-accelerated transforms (Requirement 7.4)
   *
   * @param {Element} element - Element to scale
   * @param {number} from - Starting scale (default: 0.8)
   * @param {number} to - Ending scale (default: 1)
   * @param {Object} options - Animation options
   * @returns {Animation} Web Animation instance
   */
  scale(element, from = 0.8, to = 1, options = {}) {
    const keyframes = [
      { transform: `scale(${from})`, opacity: 0 },
      { transform: `scale(${to})`, opacity: 1 },
    ];

    return this.animate(element, keyframes, {
      duration: options.duration || this.options.defaultDuration,
      easing: options.easing || 'ease-out',
      ...options,
    });
  }

  /**
   * Play animation (resume if paused)
   *
   * @param {Animation} animation - Animation instance
   */
  play(animation) {
    if (animation && typeof animation.play === 'function') {
      animation.play();
    }
  }

  /**
   * Pause animation
   *
   * @param {Animation} animation - Animation instance
   */
  pause(animation) {
    if (animation && typeof animation.pause === 'function') {
      animation.pause();
    }
  }

  /**
   * Cancel animation
   *
   * @param {Animation} animation - Animation instance
   */
  cancel(animation) {
    if (animation && typeof animation.cancel === 'function') {
      animation.cancel();
    }
  }

  /**
   * Reverse animation
   *
   * @param {Animation} animation - Animation instance
   */
  reverse(animation) {
    if (animation && typeof animation.reverse === 'function') {
      animation.reverse();
    }
  }

  /**
   * Finish animation immediately
   *
   * @param {Animation} animation - Animation instance
   */
  finish(animation) {
    if (animation && typeof animation.finish === 'function') {
      animation.finish();
    }
  }

  /**
   * Cancel all active animations
   */
  cancelAll() {
    this.activeAnimations.forEach((animation) => {
      this.cancel(animation);
    });
    this.activeAnimations.clear();
  }

  /**
   * Get count of active animations
   *
   * @returns {number} Number of active animations
   */
  getActiveCount() {
    return this.activeAnimations.size;
  }

  /**
   * Check if reduced motion is enabled
   * Requirement 7.1
   *
   * @returns {boolean} True if reduced motion is enabled
   */
  respectsReducedMotion() {
    return this.reducedMotionEnabled;
  }

  /**
   * Enable or disable reduced motion
   * Requirement 7.1
   *
   * @param {boolean} enabled - Whether to enable reduced motion
   */
  setReducedMotion(enabled) {
    this.reducedMotionEnabled = enabled;
  }

  /**
   * Provide instant transition as alternative to animation
   * Requirement 7.1
   *
   * @param {Element} element - Element to transition
   * @param {Object} finalState - Final CSS state
   */
  instantTransition(element, finalState) {
    if (!element || !(element instanceof Element)) {
      throw new Error('Invalid element provided to instantTransition()');
    }

    // Apply final state immediately
    Object.keys(finalState).forEach((property) => {
      element.style[property] = finalState[property];
    });
  }

  /**
   * Animate with automatic reduced motion fallback
   * Requirement 7.1
   *
   * @param {Element} element - Element to animate
   * @param {Array<Object>} keyframes - Animation keyframes
   * @param {Object} options - Animation options
   * @returns {Animation|null} Web Animation instance or null if instant
   */
  animateWithFallback(element, keyframes, options = {}) {
    if (this.reducedMotionEnabled) {
      // Apply final state instantly
      const finalKeyframe = keyframes[keyframes.length - 1];
      this.instantTransition(element, finalKeyframe);

      // Call onFinish callback if provided
      if (options.onFinish) {
        options.onFinish();
      }

      return null;
    }

    return this.animate(element, keyframes, options);
  }

  /**
   * Set animation duration
   *
   * @param {number} duration - Duration in milliseconds
   */
  setAnimationDuration(duration) {
    this.options.defaultDuration = Math.min(duration, this.options.maxDuration);
  }

  /**
   * Get current animation duration
   *
   * @returns {number} Duration in milliseconds
   */
  getAnimationDuration() {
    return this.options.defaultDuration;
  }

  /**
   * Get effective duration (considering reduced motion)
   *
   * @param {number} duration - Requested duration
   * @returns {number} Effective duration
   */
  getEffectiveDuration(duration) {
    return this._getEffectiveDuration(duration);
  }

  /**
   * Queue animation for sequential execution
   * Requirement 7.4
   *
   * @param {Function} animationFn - Function that returns an Animation
   * @returns {Promise<void>} Promise that resolves when animation completes
   */
  queueAnimation(animationFn) {
    return new Promise((resolve, reject) => {
      this.animationQueue.push({
        fn: animationFn,
        resolve,
        reject,
      });

      if (!this.isProcessingQueue) {
        this._processAnimationQueue();
      }
    });
  }

  /**
   * Process animation queue sequentially
   * Requirement 7.4
   *
   * @private
   */
  async _processAnimationQueue() {
    if (this.animationQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;

    const { fn, resolve, reject } = this.animationQueue.shift();

    try {
      const animation = fn();

      if (animation && typeof animation.finished === 'object') {
        // Wait for animation to finish
        await animation.finished;
        resolve();
      } else {
        // No animation (e.g., reduced motion)
        resolve();
      }
    } catch (error) {
      reject(error);
    }

    // Process next animation in queue
    this._processAnimationQueue();
  }

  /**
   * Clear animation queue
   */
  clearQueue() {
    this.animationQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Animate sequence of elements
   * Requirement 7.4
   *
   * @param {Array<Object>} sequence - Array of {element, keyframes, options}
   * @param {Object} sequenceOptions - Sequence options
   * @returns {Promise<void>} Promise that resolves when sequence completes
   */
  async animateSequence(sequence, sequenceOptions = {}) {
    const { stagger = 0, onStepComplete } = sequenceOptions;

    for (let i = 0; i < sequence.length; i++) {
      const { element, keyframes, options } = sequence[i];

      await this.queueAnimation(() => {
        return this.animate(element, keyframes, options);
      });

      if (onStepComplete) {
        onStepComplete(i, sequence.length);
      }

      // Add stagger delay between animations
      if (stagger > 0 && i < sequence.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, stagger));
      }
    }
  }

  /**
   * Ensure 60fps performance by using GPU-accelerated properties
   * Requirement 7.4
   *
   * @param {Element} element - Element to optimize
   */
  optimizeForPerformance(element) {
    if (!element || !(element instanceof Element)) {
      return;
    }

    // Enable GPU acceleration
    element.style.willChange = 'transform, opacity';
    element.style.transform = 'translateZ(0)';
  }

  /**
   * Clean up performance optimizations
   *
   * @param {Element} element - Element to clean up
   */
  cleanupPerformanceOptimizations(element) {
    if (!element || !(element instanceof Element)) {
      return;
    }

    element.style.willChange = 'auto';
    element.style.transform = '';
  }

  /**
   * Measure animation performance
   *
   * @param {Function} animationFn - Animation function to measure
   * @returns {Promise<Object>} Performance metrics
   */
  async measurePerformance(animationFn) {
    const startTime = performance.now();
    let frameCount = 0;
    let measuring = true;

    // Count frames during animation
    const countFrames = () => {
      if (measuring) {
        frameCount++;
        requestAnimationFrame(countFrames);
      }
    };

    requestAnimationFrame(countFrames);

    try {
      const animation = animationFn();

      if (animation && typeof animation.finished === 'object') {
        await animation.finished;
      }
    } finally {
      measuring = false;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const fps = duration > 0 ? (frameCount / duration) * 1000 : 0;

    return {
      duration,
      frameCount,
      fps,
      targetFps: 60,
      meetsTarget: fps >= 55, // Allow 5fps tolerance
    };
  }

  /**
   * Batch multiple animations to run simultaneously
   * More efficient than running separately
   *
   * @param {Array<Function>} animationFns - Array of animation functions
   * @returns {Promise<Array<Animation>>} Promise resolving to array of animations
   */
  async batchAnimations(animationFns) {
    const animations = animationFns.map((fn) => fn());

    // Wait for all animations to complete
    await Promise.all(
      animations
        .filter((anim) => anim && typeof anim.finished === 'object')
        .map((anim) => anim.finished),
    );

    return animations;
  }

  /**
   * Cancel conflicting animations on element
   * Requirement 7.4
   *
   * @param {Element} element - Element to check
   */
  cancelConflictingAnimations(element) {
    if (!element || !(element instanceof Element)) {
      return;
    }

    // Get all animations on element
    const elementAnimations = element.getAnimations();

    // Cancel all existing animations
    elementAnimations.forEach((animation) => {
      animation.cancel();
    });
  }

  /**
   * Get statistics about animations
   *
   * @returns {Object} Animation statistics
   */
  getStats() {
    return {
      activeAnimations: this.activeAnimations.size,
      queuedAnimations: this.animationQueue.length,
      isProcessingQueue: this.isProcessingQueue,
      reducedMotionEnabled: this.reducedMotionEnabled,
      defaultDuration: this.options.defaultDuration,
      maxDuration: this.options.maxDuration,
    };
  }
}

// Create singleton instance
const animations = new Animations();

export default animations;
export { Animations };
