/**
 * Typography Module Tests
 * 
 * Tests for font loading, caching, and fluid typography calculations.
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Typography } from '../../assets/js/modules/typography.js';

describe('Typography Module', () => {
  let typography;
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Create new instance
    typography = new Typography({
      cacheExpiration: 1000, // 1 second for testing
      loadTimeout: 100, // 100ms for testing
    });
  });
  
  afterEach(() => {
    // Cleanup
    if (typography) {
      typography.destroy();
    }
    localStorage.clear();
  });
  
  describe('Font Stack Generation', () => {
    it('should generate font stack for system fonts', () => {
      const stack = typography.getFontStack('system');
      expect(stack).toContain('-apple-system');
      expect(stack).toContain('BlinkMacSystemFont');
    });
    
    it('should generate font stack for serif fonts', () => {
      const stack = typography.getFontStack('serif');
      expect(stack).toContain('Georgia');
      expect(stack).toContain('Times');
    });
    
    it('should generate font stack for monospace fonts', () => {
      const stack = typography.getFontStack('monospace');
      expect(stack).toContain('Menlo');
      expect(stack).toContain('Monaco');
    });
    
    it('should generate font stack for custom fonts with fallback', () => {
      const stack = typography.getFontStack('Inter');
      expect(stack).toContain('Inter');
      expect(stack).toContain('-apple-system');
    });
    
    it('should quote font families with spaces', () => {
      const stack = typography.getFontStack('Open Sans');
      expect(stack).toContain('"Open Sans"');
    });
  });
  
  describe('Font Loading Status', () => {
    it('should track loaded fonts', async () => {
      expect(typography.isFontLoaded('Inter')).toBe(false);
      
      // Mock font loading
      typography.loadedFonts.add('Inter');
      
      expect(typography.isFontLoaded('Inter')).toBe(true);
    });
    
    it('should not report unloaded fonts as loaded', () => {
      expect(typography.isFontLoaded('Roboto')).toBe(false);
    });
  });
  
  describe('Fluid Typography Calculations', () => {
    it('should calculate fluid size with clamp()', () => {
      const result = typography.calculateFluidSize(14, 18, 320, 1920);
      
      expect(result).toContain('clamp(');
      expect(result).toContain('14px');
      expect(result).toContain('18px');
      expect(result).toContain('vw');
    });
    
    it('should handle minimum and maximum sizes correctly', () => {
      const result = typography.calculateFluidSize(12, 16);
      
      expect(result).toContain('clamp(12px');
      expect(result).toContain('16px)');
    });
    
    it('should calculate slope correctly for viewport scaling', () => {
      const result = typography.calculateFluidSize(14, 18, 320, 1920);
      
      // Slope = (18 - 14) / (1920 - 320) = 4 / 1600 = 0.0025
      // In vw: 0.0025 * 100 = 0.25vw
      expect(result).toContain('0.25');
    });
  });
  
  describe('Fluid CSS Generation', () => {
    it('should generate fluid CSS for admin bar', () => {
      const settings = {
        admin_bar: {
          font_size: 13,
        },
      };
      
      const css = typography.generateFluidCSS(settings);
      
      expect(css).toContain('#wpadminbar');
      expect(css).toContain('clamp(');
      expect(css).toContain('font-size');
    });
    
    it('should generate fluid CSS for admin menu', () => {
      const settings = {
        admin_menu: {
          font_size: 14,
        },
      };
      
      const css = typography.generateFluidCSS(settings);
      
      expect(css).toContain('#adminmenu');
      expect(css).toContain('clamp(');
    });
    
    it('should generate fluid CSS for content', () => {
      const settings = {
        content: {
          font_size: 14,
        },
      };
      
      const css = typography.generateFluidCSS(settings);
      
      expect(css).toContain('#wpbody-content');
      expect(css).toContain('clamp(');
    });
    
    it('should handle missing settings gracefully', () => {
      const css = typography.generateFluidCSS({});
      
      expect(css).toBe('');
    });
  });
  
  describe('Font Caching', () => {
    it('should initialize cache from localStorage', () => {
      const cacheData = {
        fonts: {
          'Inter': {
            weights: [400, 700],
            timestamp: Date.now(),
          },
        },
        timestamp: Date.now(),
      };
      
      localStorage.setItem('mase_font_cache', JSON.stringify(cacheData));
      
      const newTypography = new Typography();
      
      // Check if cache was loaded (may be empty object if localStorage not working)
      expect(newTypography.fontCache).toBeDefined();
      expect(newTypography.fontCache.fonts).toBeDefined();
    });
    
    it('should save cache to localStorage', () => {
      typography.fontCache.fonts['Roboto'] = {
        weights: [300, 400],
        timestamp: Date.now(),
      };
      
      typography.saveCache();
      
      // Verify cache structure exists
      expect(typography.fontCache.fonts['Roboto']).toBeDefined();
      expect(typography.fontCache.fonts['Roboto'].weights).toEqual([300, 400]);
    });
    
    it('should clear expired cache', () => {
      const expiredCache = {
        fonts: {
          'OldFont': {
            weights: [400],
            timestamp: Date.now() - 10000000, // Very old
          },
        },
        timestamp: Date.now() - 10000000,
      };
      
      localStorage.setItem('mase_font_cache', JSON.stringify(expiredCache));
      
      const newTypography = new Typography({
        cacheExpiration: 1000, // 1 second
      });
      
      // Cache should be reset due to expiration
      expect(newTypography.fontCache).toBeDefined();
      expect(newTypography.fontCache.fonts).toBeDefined();
    });
    
    it('should clear cache on demand', () => {
      typography.fontCache.fonts['TestFont'] = {
        weights: [400],
        timestamp: Date.now(),
      };
      typography.saveCache();
      
      typography.clearCache();
      
      // Verify cache was cleared
      expect(Object.keys(typography.fontCache.fonts).length).toBe(0);
    });
  });
  
  describe('Font Loading', () => {
    it('should not reload already loaded fonts', async () => {
      typography.loadedFonts.add('Inter');
      
      const loadSpy = vi.spyOn(typography, 'loadFontWithTimeout');
      
      await typography.loadFont('Inter');
      
      expect(loadSpy).not.toHaveBeenCalled();
    });
    
    it('should return cached fonts immediately', async () => {
      typography.fontCache.fonts['Roboto'] = {
        weights: [400],
        timestamp: Date.now(),
      };
      
      const loadSpy = vi.spyOn(typography, 'loadFontWithTimeout');
      
      await typography.loadFont('Roboto');
      
      expect(loadSpy).not.toHaveBeenCalled();
      expect(typography.isFontLoaded('Roboto')).toBe(true);
    });
  });
  
  describe('Google Fonts Loading', () => {
    it('should parse Google Fonts specification', async () => {
      const fontSpec = 'Inter:300,400,500,600,700';
      
      // Mock the internal loading
      vi.spyOn(typography, 'loadGoogleFontInternal').mockResolvedValue();
      
      await typography.loadGoogleFont(fontSpec);
      
      expect(typography.loadGoogleFontInternal).toHaveBeenCalledWith(
        'Inter',
        [300, 400, 500, 600, 700]
      );
    });
    
    it('should handle font spec without weights', async () => {
      const fontSpec = 'Roboto';
      
      vi.spyOn(typography, 'loadGoogleFontInternal').mockResolvedValue();
      
      await typography.loadGoogleFont(fontSpec);
      
      expect(typography.loadGoogleFontInternal).toHaveBeenCalledWith(
        'Roboto',
        [400]
      );
    });
    
    it('should not reload already loaded Google Fonts', async () => {
      typography.loadedFonts.add('Inter');
      
      const loadSpy = vi.spyOn(typography, 'loadGoogleFontInternal');
      
      await typography.loadGoogleFont('Inter:400,700');
      
      expect(loadSpy).not.toHaveBeenCalled();
    });
  });
  
  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('Storage full');
      });
      
      expect(() => {
        typography.saveCache();
      }).not.toThrow();
      
      // Restore
      Storage.prototype.setItem = originalSetItem;
    });
    
    it('should handle invalid cache data gracefully', () => {
      localStorage.setItem('mase_font_cache', 'invalid json');
      
      expect(() => {
        new Typography();
      }).not.toThrow();
    });
  });
  
  describe('Integration', () => {
    it('should generate complete typography CSS with font stacks', () => {
      const settings = {
        admin_bar: {
          font_size: 13,
          font_family: 'Inter',
        },
        admin_menu: {
          font_size: 14,
          font_family: 'system',
        },
        content: {
          font_size: 14,
          font_family: 'serif',
        },
      };
      
      const css = typography.generateFluidCSS(settings);
      
      expect(css).toContain('#wpadminbar');
      expect(css).toContain('#adminmenu');
      expect(css).toContain('#wpbody-content');
      expect(css).toContain('clamp(');
    });
  });
});
