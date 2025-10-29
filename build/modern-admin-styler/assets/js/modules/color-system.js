/**
 * Color System Module
 *
 * Manages color palettes, accessibility validation, and color transformations.
 * Provides WCAG 2.1 contrast ratio calculations and color space conversions.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4
 *
 * @module color-system
 */

import eventBus, { EVENTS } from './event-bus.js';
import { useStore } from './state-manager.js';

/**
 * ColorSystem class for color management and accessibility
 *
 * Features:
 * - Color space conversions (hex, RGB, HSL)
 * - WCAG 2.1 contrast ratio calculations
 * - Accessible color suggestions
 * - Palette generation algorithms
 * - Palette application with state management
 */
export class ColorSystem {
  constructor(options = {}) {
    this.isDevelopment = options.isDevelopment || process.env.NODE_ENV === 'development';
    this.minContrastRatio = 4.5; // WCAG AA for normal text
    this.minContrastRatioLarge = 3.0; // WCAG AA for large text
    this.minContrastRatioAAA = 7.0; // WCAG AAA for normal text
  }

  /**
   * Convert hex color to RGB
   * Requirement 5.3
   *
   * @param {string} hex - Hex color (e.g., '#ff0000' or 'ff0000')
   * @returns {{r: number, g: number, b: number}} RGB object
   */
  hexToRgb(hex) {
    // Remove # if present
    const cleanHex = hex.replace(/^#/, '');

    // Validate hex format
    if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      throw new Error(`Invalid hex color: ${hex}`);
    }

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return { r, g, b };
  }

  /**
   * Convert RGB to hex color
   * Requirement 5.3
   *
   * @param {number} r - Red (0-255)
   * @param {number} g - Green (0-255)
   * @param {number} b - Blue (0-255)
   * @returns {string} Hex color with # prefix
   */
  rgbToHex(r, g, b) {
    // Clamp values to 0-255
    r = Math.max(0, Math.min(255, Math.round(r)));
    g = Math.max(0, Math.min(255, Math.round(g)));
    b = Math.max(0, Math.min(255, Math.round(b)));

    const toHex = (n) => n.toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Convert RGB to HSL
   * Requirement 5.3
   *
   * @param {{r: number, g: number, b: number}} rgb - RGB object (0-255)
   * @returns {{h: number, s: number, l: number}} HSL object (h: 0-360, s: 0-100, l: 0-100)
   */
  rgbToHsl({ r, g, b }) {
    // Normalize RGB values to 0-1
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
      // Calculate saturation
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

      // Calculate hue
      switch (max) {
        case r:
          h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / delta + 2) / 6;
          break;
        case b:
          h = ((r - g) / delta + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * Convert HSL to RGB
   * Requirement 5.3
   *
   * @param {{h: number, s: number, l: number}} hsl - HSL object (h: 0-360, s: 0-100, l: 0-100)
   * @returns {{r: number, g: number, b: number}} RGB object (0-255)
   */
  hslToRgb({ h, s, l }) {
    // Normalize values
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    if (s === 0) {
      // Achromatic (gray)
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) {
          t += 1;
        }
        if (t > 1) {
          t -= 1;
        }
        if (t < 1 / 6) {
          return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
          return q;
        }
        if (t < 2 / 3) {
          return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  /**
   * Parse color string to RGB
   * Supports hex, rgb(), rgba(), hsl(), hsla()
   * Requirement 5.3
   *
   * @param {string} color - Color string
   * @returns {{r: number, g: number, b: number}} RGB object
   */
  parseColor(color) {
    if (!color || typeof color !== 'string') {
      throw new Error('Invalid color input');
    }

    const trimmed = color.trim();

    // Hex color
    if (trimmed.startsWith('#')) {
      return this.hexToRgb(trimmed);
    }

    // RGB/RGBA
    const rgbMatch = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1], 10),
        g: parseInt(rgbMatch[2], 10),
        b: parseInt(rgbMatch[3], 10),
      };
    }

    // HSL/HSLA
    const hslMatch = trimmed.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/);
    if (hslMatch) {
      return this.hslToRgb({
        h: parseInt(hslMatch[1], 10),
        s: parseInt(hslMatch[2], 10),
        l: parseInt(hslMatch[3], 10),
      });
    }

    throw new Error(`Unsupported color format: ${color}`);
  }

  /**
   * Format RGB to CSS string
   * Requirement 5.3
   *
   * @param {{r: number, g: number, b: number}} rgb - RGB object
   * @param {number} [alpha] - Optional alpha value (0-1)
   * @returns {string} CSS color string
   */
  formatRgb({ r, g, b }, alpha) {
    if (alpha !== undefined) {
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Format HSL to CSS string
   * Requirement 5.3
   *
   * @param {{h: number, s: number, l: number}} hsl - HSL object
   * @param {number} [alpha] - Optional alpha value (0-1)
   * @returns {string} CSS color string
   */
  formatHsl({ h, s, l }, alpha) {
    if (alpha !== undefined) {
      return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
    }
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  /**
   * Validate color format
   * Requirement 5.3
   *
   * @param {string} color - Color string
   * @returns {boolean} True if valid
   */
  isValidColor(color) {
    try {
      this.parseColor(color);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Calculate relative luminance for WCAG contrast
   * Requirement 5.1
   *
   * @private
   * @param {{r: number, g: number, b: number}} rgb - RGB object
   * @returns {number} Relative luminance (0-1)
   */
  _getRelativeLuminance({ r, g, b }) {
    // Normalize to 0-1
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    // Calculate luminance using WCAG formula
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Calculate WCAG 2.1 contrast ratio between two colors
   * Requirement 5.1
   *
   * @param {string} color1 - First color (any supported format)
   * @param {string} color2 - Second color (any supported format)
   * @returns {number} Contrast ratio (1-21)
   */
  getContrastRatio(color1, color2) {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);

    const l1 = this._getRelativeLuminance(rgb1);
    const l2 = this._getRelativeLuminance(rgb2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Check if color combination meets WCAG accessibility standards
   * Requirement 5.1, 5.4
   *
   * @param {string} foreground - Foreground color
   * @param {string} background - Background color
   * @param {'AA' | 'AAA'} [level='AA'] - WCAG level
   * @param {boolean} [isLargeText=false] - Is large text (18pt+ or 14pt+ bold)
   * @returns {boolean} True if accessible
   */
  isAccessible(foreground, background, level = 'AA', isLargeText = false) {
    const ratio = this.getContrastRatio(foreground, background);

    if (level === 'AAA') {
      return isLargeText ? ratio >= 4.5 : ratio >= 7.0;
    }

    // AA level (default)
    return isLargeText ? ratio >= 3.0 : ratio >= 4.5;
  }

  /**
   * Suggest accessible color by adjusting lightness
   * Requirement 5.1, 5.4
   *
   * @param {string} baseColor - Color to adjust
   * @param {string} backgroundColor - Background color to contrast against
   * @param {'AA' | 'AAA'} [level='AA'] - Target WCAG level
   * @param {boolean} [isLargeText=false] - Is large text
   * @returns {string} Adjusted color in hex format
   */
  suggestAccessibleColor(baseColor, backgroundColor, level = 'AA', isLargeText = false) {
    const targetRatio = level === 'AAA' ? (isLargeText ? 4.5 : 7.0) : isLargeText ? 3.0 : 4.5;

    const rgb = this.parseColor(baseColor);
    const hsl = this.rgbToHsl(rgb);

    // Try adjusting lightness
    const adjustedHsl = { ...hsl };
    let currentRatio = this.getContrastRatio(baseColor, backgroundColor);

    // Determine if we need to go lighter or darker
    const bgLuminance = this._getRelativeLuminance(this.parseColor(backgroundColor));
    const shouldGoLighter = bgLuminance < 0.5;

    // Binary search for optimal lightness
    let minL = shouldGoLighter ? hsl.l : 0;
    let maxL = shouldGoLighter ? 100 : hsl.l;
    let iterations = 0;
    const maxIterations = 20;

    while (iterations < maxIterations && Math.abs(currentRatio - targetRatio) > 0.1) {
      adjustedHsl.l = Math.round((minL + maxL) / 2);

      const adjustedRgb = this.hslToRgb(adjustedHsl);
      const adjustedHex = this.rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
      currentRatio = this.getContrastRatio(adjustedHex, backgroundColor);

      if (currentRatio < targetRatio) {
        if (shouldGoLighter) {
          minL = adjustedHsl.l;
        } else {
          maxL = adjustedHsl.l;
        }
      } else {
        if (shouldGoLighter) {
          maxL = adjustedHsl.l;
        } else {
          minL = adjustedHsl.l;
        }
      }

      iterations++;
    }

    const finalRgb = this.hslToRgb(adjustedHsl);
    return this.rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b);
  }

  /**
   * Generate complementary color (opposite on color wheel)
   * Requirement 5.2
   *
   * @param {string} color - Base color
   * @returns {string} Complementary color in hex format
   */
  generateComplementary(color) {
    const rgb = this.parseColor(color);
    const hsl = this.rgbToHsl(rgb);

    // Rotate hue by 180 degrees
    const complementaryHsl = {
      h: (hsl.h + 180) % 360,
      s: hsl.s,
      l: hsl.l,
    };

    const complementaryRgb = this.hslToRgb(complementaryHsl);
    return this.rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b);
  }

  /**
   * Generate analogous colors (adjacent on color wheel)
   * Requirement 5.2
   *
   * @param {string} color - Base color
   * @param {number} [angle=30] - Angle offset in degrees
   * @returns {string[]} Array of two analogous colors in hex format
   */
  generateAnalogous(color, angle = 30) {
    const rgb = this.parseColor(color);
    const hsl = this.rgbToHsl(rgb);

    const analogous1Hsl = {
      h: (hsl.h + angle) % 360,
      s: hsl.s,
      l: hsl.l,
    };

    const analogous2Hsl = {
      h: (hsl.h - angle + 360) % 360,
      s: hsl.s,
      l: hsl.l,
    };

    const analogous1Rgb = this.hslToRgb(analogous1Hsl);
    const analogous2Rgb = this.hslToRgb(analogous2Hsl);

    return [
      this.rgbToHex(analogous1Rgb.r, analogous1Rgb.g, analogous1Rgb.b),
      this.rgbToHex(analogous2Rgb.r, analogous2Rgb.g, analogous2Rgb.b),
    ];
  }

  /**
   * Generate triadic colors (evenly spaced on color wheel)
   * Requirement 5.2
   *
   * @param {string} color - Base color
   * @returns {string[]} Array of two triadic colors in hex format
   */
  generateTriadic(color) {
    const rgb = this.parseColor(color);
    const hsl = this.rgbToHsl(rgb);

    const triadic1Hsl = {
      h: (hsl.h + 120) % 360,
      s: hsl.s,
      l: hsl.l,
    };

    const triadic2Hsl = {
      h: (hsl.h + 240) % 360,
      s: hsl.s,
      l: hsl.l,
    };

    const triadic1Rgb = this.hslToRgb(triadic1Hsl);
    const triadic2Rgb = this.hslToRgb(triadic2Hsl);

    return [
      this.rgbToHex(triadic1Rgb.r, triadic1Rgb.g, triadic1Rgb.b),
      this.rgbToHex(triadic2Rgb.r, triadic2Rgb.g, triadic2Rgb.b),
    ];
  }

  /**
   * Apply color palette to settings
   * Requirement 5.2
   *
   * @param {string} paletteId - Palette identifier
   * @returns {Promise<void>}
   */
  async applyPalette(paletteId) {
    const store = useStore.getState();

    // Get palette data (will be from API in future)
    const palette = this._getPaletteById(paletteId);

    if (!palette) {
      throw new Error(`Palette not found: ${paletteId}`);
    }

    if (this.isDevelopment) {
      console.log(`[ColorSystem] Applying palette: ${paletteId}`, palette);
    }

    // Update settings with palette colors
    store.updateSettings('admin_bar.bg_color', palette.colors.primary);
    store.updateSettings('admin_bar.text_color', palette.colors.text);
    store.updateSettings('admin_menu.bg_color', palette.colors.secondary);
    store.updateSettings('admin_menu.text_color', palette.colors.text);
    store.updateSettings('admin_menu.hover_bg_color', palette.colors.accent);

    // Update current palette
    store.updateSettings('palettes.current', paletteId);

    // Emit event
    eventBus.emit(EVENTS.COLOR_SELECTED, {
      paletteId,
      palette,
    });

    if (this.isDevelopment) {
      console.log(`[ColorSystem] Palette applied: ${paletteId}`);
    }
  }

  /**
   * Get palette by ID
   * @private
   * @param {string} paletteId - Palette identifier
   * @returns {Object|null} Palette object or null
   */
  _getPaletteById(paletteId) {
    // Built-in palettes
    const palettes = {
      'professional-blue': {
        id: 'professional-blue',
        name: 'Professional Blue',
        colors: {
          primary: '#1e3a8a',
          secondary: '#1e40af',
          accent: '#3b82f6',
          background: '#ffffff',
          text: '#ffffff',
        },
      },
      'energetic-green': {
        id: 'energetic-green',
        name: 'Energetic Green',
        colors: {
          primary: '#065f46',
          secondary: '#047857',
          accent: '#10b981',
          background: '#ffffff',
          text: '#ffffff',
        },
      },
      sunset: {
        id: 'sunset',
        name: 'Sunset',
        colors: {
          primary: '#dc2626',
          secondary: '#ea580c',
          accent: '#f59e0b',
          background: '#ffffff',
          text: '#ffffff',
        },
      },
      'dark-elegance': {
        id: 'dark-elegance',
        name: 'Dark Elegance',
        colors: {
          primary: '#1f2937',
          secondary: '#374151',
          accent: '#6b7280',
          background: '#111827',
          text: '#f9fafb',
        },
      },
    };

    return palettes[paletteId] || null;
  }
}

// Create singleton instance
const colorSystem = new ColorSystem({
  isDevelopment: process.env.NODE_ENV === 'development',
});

export default colorSystem;
