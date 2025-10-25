/**
 * Color System Module Tests
 * 
 * Tests for color conversions, accessibility checking, and palette generation.
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ColorSystem } from '../../assets/js/modules/color-system.js';

describe('ColorSystem', () => {
  let colorSystem;

  beforeEach(() => {
    colorSystem = new ColorSystem({ isDevelopment: false });
  });

  describe('Color Conversions', () => {
    describe('hexToRgb', () => {
      it('should convert hex to RGB correctly', () => {
        expect(colorSystem.hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
        expect(colorSystem.hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
        expect(colorSystem.hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
        expect(colorSystem.hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
        expect(colorSystem.hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      });

      it('should handle hex without # prefix', () => {
        expect(colorSystem.hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      });

      it('should throw error for invalid hex', () => {
        expect(() => colorSystem.hexToRgb('#gg0000')).toThrow('Invalid hex color');
        expect(() => colorSystem.hexToRgb('#ff00')).toThrow('Invalid hex color');
      });
    });

    describe('rgbToHex', () => {
      it('should convert RGB to hex correctly', () => {
        expect(colorSystem.rgbToHex(255, 0, 0)).toBe('#ff0000');
        expect(colorSystem.rgbToHex(0, 255, 0)).toBe('#00ff00');
        expect(colorSystem.rgbToHex(0, 0, 255)).toBe('#0000ff');
        expect(colorSystem.rgbToHex(255, 255, 255)).toBe('#ffffff');
        expect(colorSystem.rgbToHex(0, 0, 0)).toBe('#000000');
      });

      it('should clamp values to 0-255 range', () => {
        expect(colorSystem.rgbToHex(300, 0, 0)).toBe('#ff0000');
        expect(colorSystem.rgbToHex(-10, 0, 0)).toBe('#000000');
      });

      it('should round decimal values', () => {
        expect(colorSystem.rgbToHex(127.5, 127.5, 127.5)).toBe('#808080');
      });
    });

    describe('rgbToHsl', () => {
      it('should convert RGB to HSL correctly', () => {
        const red = colorSystem.rgbToHsl({ r: 255, g: 0, b: 0 });
        expect(red.h).toBe(0);
        expect(red.s).toBe(100);
        expect(red.l).toBe(50);

        const gray = colorSystem.rgbToHsl({ r: 128, g: 128, b: 128 });
        expect(gray.h).toBe(0);
        expect(gray.s).toBe(0);
        expect(gray.l).toBeCloseTo(50, 0);
      });
    });

    describe('hslToRgb', () => {
      it('should convert HSL to RGB correctly', () => {
        const red = colorSystem.hslToRgb({ h: 0, s: 100, l: 50 });
        expect(red.r).toBe(255);
        expect(red.g).toBe(0);
        expect(red.b).toBe(0);

        const gray = colorSystem.hslToRgb({ h: 0, s: 0, l: 50 });
        expect(gray.r).toBeCloseTo(128, 0);
        expect(gray.g).toBeCloseTo(128, 0);
        expect(gray.b).toBeCloseTo(128, 0);
      });
    });

    describe('parseColor', () => {
      it('should parse hex colors', () => {
        expect(colorSystem.parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      });

      it('should parse rgb colors', () => {
        expect(colorSystem.parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
      });

      it('should parse rgba colors', () => {
        expect(colorSystem.parseColor('rgba(255, 0, 0, 0.5)')).toEqual({ r: 255, g: 0, b: 0 });
      });

      it('should parse hsl colors', () => {
        const result = colorSystem.parseColor('hsl(0, 100%, 50%)');
        expect(result.r).toBe(255);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
      });

      it('should throw error for invalid format', () => {
        expect(() => colorSystem.parseColor('invalid')).toThrow('Unsupported color format');
      });
    });

    describe('isValidColor', () => {
      it('should validate color formats', () => {
        expect(colorSystem.isValidColor('#ff0000')).toBe(true);
        expect(colorSystem.isValidColor('rgb(255, 0, 0)')).toBe(true);
        expect(colorSystem.isValidColor('hsl(0, 100%, 50%)')).toBe(true);
        expect(colorSystem.isValidColor('invalid')).toBe(false);
      });
    });
  });

  describe('Accessibility Checking', () => {
    describe('getContrastRatio', () => {
      it('should calculate contrast ratio correctly', () => {
        // Black on white should be 21:1
        const blackWhite = colorSystem.getContrastRatio('#000000', '#ffffff');
        expect(blackWhite).toBeCloseTo(21, 0);

        // White on white should be 1:1
        const whiteWhite = colorSystem.getContrastRatio('#ffffff', '#ffffff');
        expect(whiteWhite).toBeCloseTo(1, 0);

        // Should be symmetric
        const ratio1 = colorSystem.getContrastRatio('#ff0000', '#ffffff');
        const ratio2 = colorSystem.getContrastRatio('#ffffff', '#ff0000');
        expect(ratio1).toBeCloseTo(ratio2, 2);
      });
    });

    describe('isAccessible', () => {
      it('should check WCAG AA compliance for normal text', () => {
        // Black on white passes AA (21:1 > 4.5:1)
        expect(colorSystem.isAccessible('#000000', '#ffffff', 'AA', false)).toBe(true);

        // Light gray on white fails AA
        expect(colorSystem.isAccessible('#cccccc', '#ffffff', 'AA', false)).toBe(false);
      });

      it('should check WCAG AA compliance for large text', () => {
        // Lower threshold for large text (3:1)
        const ratio = colorSystem.getContrastRatio('#767676', '#ffffff');
        expect(ratio).toBeGreaterThan(3);
        expect(colorSystem.isAccessible('#767676', '#ffffff', 'AA', true)).toBe(true);
      });

      it('should check WCAG AAA compliance', () => {
        // AAA requires 7:1 for normal text
        expect(colorSystem.isAccessible('#000000', '#ffffff', 'AAA', false)).toBe(true);
        expect(colorSystem.isAccessible('#595959', '#ffffff', 'AAA', false)).toBe(false);
      });
    });

    describe('suggestAccessibleColor', () => {
      it('should suggest accessible color for dark background', () => {
        const suggested = colorSystem.suggestAccessibleColor('#333333', '#000000', 'AA', false);
        const ratio = colorSystem.getContrastRatio(suggested, '#000000');
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('should suggest accessible color for light background', () => {
        const suggested = colorSystem.suggestAccessibleColor('#cccccc', '#ffffff', 'AA', false);
        const ratio = colorSystem.getContrastRatio(suggested, '#ffffff');
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('should meet AAA standards when requested', () => {
        const suggested = colorSystem.suggestAccessibleColor('#666666', '#ffffff', 'AAA', false);
        const ratio = colorSystem.getContrastRatio(suggested, '#ffffff');
        expect(ratio).toBeGreaterThanOrEqual(7.0);
      });
    });
  });

  describe('Palette Generation', () => {
    describe('generateComplementary', () => {
      it('should generate complementary color', () => {
        const complementary = colorSystem.generateComplementary('#ff0000');
        const rgb = colorSystem.hexToRgb(complementary);
        const hsl = colorSystem.rgbToHsl(rgb);
        
        // Complementary should be 180 degrees opposite
        const originalHsl = colorSystem.rgbToHsl(colorSystem.hexToRgb('#ff0000'));
        expect(Math.abs(hsl.h - originalHsl.h)).toBeCloseTo(180, 0);
      });
    });

    describe('generateAnalogous', () => {
      it('should generate two analogous colors', () => {
        const analogous = colorSystem.generateAnalogous('#ff0000');
        expect(analogous).toHaveLength(2);
        expect(analogous[0]).toMatch(/^#[0-9a-f]{6}$/);
        expect(analogous[1]).toMatch(/^#[0-9a-f]{6}$/);
      });

      it('should use custom angle', () => {
        const analogous = colorSystem.generateAnalogous('#ff0000', 45);
        expect(analogous).toHaveLength(2);
      });
    });

    describe('generateTriadic', () => {
      it('should generate two triadic colors', () => {
        const triadic = colorSystem.generateTriadic('#ff0000');
        expect(triadic).toHaveLength(2);
        expect(triadic[0]).toMatch(/^#[0-9a-f]{6}$/);
        expect(triadic[1]).toMatch(/^#[0-9a-f]{6}$/);
      });

      it('should be 120 degrees apart', () => {
        const triadic = colorSystem.generateTriadic('#ff0000');
        const originalHsl = colorSystem.rgbToHsl(colorSystem.hexToRgb('#ff0000'));
        const triadic1Hsl = colorSystem.rgbToHsl(colorSystem.hexToRgb(triadic[0]));
        const triadic2Hsl = colorSystem.rgbToHsl(colorSystem.hexToRgb(triadic[1]));
        
        expect(Math.abs(triadic1Hsl.h - originalHsl.h)).toBeCloseTo(120, 0);
        expect(Math.abs(triadic2Hsl.h - originalHsl.h)).toBeCloseTo(240, 0);
      });
    });
  });

  describe('Color Formatting', () => {
    describe('formatRgb', () => {
      it('should format RGB without alpha', () => {
        expect(colorSystem.formatRgb({ r: 255, g: 0, b: 0 })).toBe('rgb(255, 0, 0)');
      });

      it('should format RGBA with alpha', () => {
        expect(colorSystem.formatRgb({ r: 255, g: 0, b: 0 }, 0.5)).toBe('rgba(255, 0, 0, 0.5)');
      });
    });

    describe('formatHsl', () => {
      it('should format HSL without alpha', () => {
        expect(colorSystem.formatHsl({ h: 0, s: 100, l: 50 })).toBe('hsl(0, 100%, 50%)');
      });

      it('should format HSLA with alpha', () => {
        expect(colorSystem.formatHsl({ h: 0, s: 100, l: 50 }, 0.5)).toBe('hsla(0, 100%, 50%, 0.5)');
      });
    });
  });
});
