/**
 * API Client Module Tests
 * 
 * Tests for the APIClient class including:
 * - Configuration and initialization
 * - Request/response interceptors
 * - Settings endpoints
 * - Template and palette endpoints
 * - Error handling and retry logic
 * - Request queuing
 * - Nonce handling
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.5, 11.1, 11.4
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import APIClient from '../../assets/js/modules/api-client.js';

describe('APIClient', () => {
  let apiClient;
  let mockFetch;
  const baseURL = 'https://example.com/wp-json/mase/v1';
  const nonce = 'test-nonce-123';

  beforeEach(() => {
    // Mock fetch
    mockFetch = vi.fn();
    global.fetch = mockFetch;

    // Create API client instance
    apiClient = new APIClient({
      baseURL,
      nonce,
      timeout: 5000,
      retries: 2,
      retryDelay: 100,
      debug: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Configuration and Initialization', () => {
    it('should create instance with valid configuration', () => {
      expect(apiClient).toBeDefined();
      expect(apiClient.config.baseURL).toBe(baseURL);
      expect(apiClient.config.nonce).toBe(nonce);
      expect(apiClient.config.timeout).toBe(5000);
      expect(apiClient.config.retries).toBe(2);
    });

    it('should throw error if baseURL is missing', () => {
      expect(() => {
        new APIClient({ nonce });
      }).toThrow('baseURL is required');
    });

    it('should throw error if nonce is missing', () => {
      expect(() => {
        new APIClient({ baseURL });
      }).toThrow('nonce is required');
    });

    it('should use default values for optional config', () => {
      const client = new APIClient({ baseURL, nonce });
      expect(client.config.timeout).toBe(30000);
      expect(client.config.retries).toBe(3);
      expect(client.config.retryDelay).toBe(1000);
    });
  });

  describe('Request/Response Interceptors', () => {
    it('should add request interceptor', () => {
      const interceptor = vi.fn(config => config);
      const remove = apiClient.addRequestInterceptor(interceptor);
      
      expect(apiClient.requestInterceptors).toContain(interceptor);
      expect(typeof remove).toBe('function');
    });

    it('should remove request interceptor', () => {
      const interceptor = vi.fn(config => config);
      const remove = apiClient.addRequestInterceptor(interceptor);
      
      remove();
      expect(apiClient.requestInterceptors).not.toContain(interceptor);
    });

    it('should add response interceptor', () => {
      const interceptor = vi.fn(data => data);
      const remove = apiClient.addResponseInterceptor(interceptor);
      
      expect(apiClient.responseInterceptors).toContain(interceptor);
      expect(typeof remove).toBe('function');
    });
  });

  describe('Settings Endpoints', () => {
    it('should get settings successfully', async () => {
      const mockSettings = { version: '1.0', colors: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockSettings,
      });

      const result = await apiClient.getSettings();
      
      expect(result).toEqual(mockSettings);
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseURL}/settings`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-WP-Nonce': nonce,
          }),
        })
      );
    });

    it('should save settings successfully', async () => {
      const settings = { colors: { primary: '#ff0000' } };
      const mockResponse = { success: true, settings };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await apiClient.saveSettings(settings);
      
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseURL}/settings`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(settings),
        })
      );
    });

    it('should validate settings object', async () => {
      await expect(apiClient.saveSettings(null)).rejects.toThrow('Invalid settings');
      await expect(apiClient.saveSettings('invalid')).rejects.toThrow('Invalid settings');
    });

    it('should reset settings successfully', async () => {
      const mockDefaults = { version: '1.0', colors: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockDefaults,
      });

      const result = await apiClient.resetSettings();
      
      expect(result).toEqual(mockDefaults);
    });
  });

  describe('Template and Palette Endpoints', () => {
    it('should get templates successfully', async () => {
      const mockTemplates = [{ id: 'template1', name: 'Template 1' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockTemplates,
      });

      const result = await apiClient.getTemplates();
      
      expect(result).toEqual(mockTemplates);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should apply template successfully', async () => {
      const templateId = 'template1';
      const mockResponse = { success: true, settings: {} };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await apiClient.applyTemplate(templateId);
      
      expect(result).toBeDefined();
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseURL}/templates/${templateId}/apply`,
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should validate template ID', async () => {
      await expect(apiClient.applyTemplate('')).rejects.toThrow('Invalid template ID');
      await expect(apiClient.applyTemplate(null)).rejects.toThrow('Invalid template ID');
    });

    it('should get palettes successfully', async () => {
      const mockPalettes = [{ id: 'palette1', name: 'Palette 1' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockPalettes,
      });

      const result = await apiClient.getPalettes();
      
      expect(result).toEqual(mockPalettes);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should apply palette successfully', async () => {
      const paletteId = 'palette1';
      const mockResponse = { success: true, colors: {} };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await apiClient.applyPalette(paletteId);
      
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling and Retry Logic', () => {
    it('should retry on network error', async () => {
      // First two attempts fail, third succeeds
      mockFetch
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        });

      const result = await apiClient.getSettings();
      
      expect(result).toBeDefined();
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should retry on 5xx server error', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        });

      const result = await apiClient.getSettings();
      
      expect(result).toBeDefined();
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should not retry on 4xx client error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid request' }),
      });

      await expect(apiClient.getSettings()).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should provide user-friendly error messages', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

      await expect(apiClient.getSettings()).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      mockFetch.mockImplementationOnce(() => {
        const error = new Error('Timeout');
        error.name = 'AbortError';
        return Promise.reject(error);
      });

      await expect(apiClient.getSettings()).rejects.toThrow('timeout');
    });
  });

  describe('Request Queuing', () => {
    it('should queue save requests', async () => {
      let resolveFirst;
      const firstPromise = new Promise(resolve => {
        resolveFirst = resolve;
      });

      mockFetch
        .mockImplementationOnce(() => firstPromise)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        });

      // Start two save requests
      const promise1 = apiClient.saveSettings({ test: 1 });
      const promise2 = apiClient.saveSettings({ test: 2 });

      // Second request should be queued
      expect(apiClient.getQueueLength()).toBeGreaterThan(0);

      // Resolve first request
      resolveFirst({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await Promise.all([promise1, promise2]);
      
      // Queue should be empty after processing
      expect(apiClient.getQueueLength()).toBe(0);
    });

    it('should deduplicate identical requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      // Start two identical template applications
      const promise1 = apiClient.applyTemplate('template1');
      const promise2 = apiClient.applyTemplate('template1');

      const [result1, result2] = await Promise.all([promise1, promise2]);
      
      // Should only make one actual request
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
    });

    it('should clear queue', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      apiClient.saveSettings({ test: 1 });
      apiClient.saveSettings({ test: 2 });

      expect(apiClient.getQueueLength()).toBeGreaterThan(0);

      apiClient.clearQueue();

      expect(apiClient.getQueueLength()).toBe(0);
    });
  });

  describe('Nonce Handling', () => {
    it('should include nonce in requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await apiClient.getSettings();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-WP-Nonce': nonce,
          }),
        })
      );
    });

    it('should update nonce', () => {
      const newNonce = 'new-nonce-456';
      apiClient.updateNonce(newNonce);
      
      expect(apiClient.getNonce()).toBe(newNonce);
    });

    it('should refresh nonce on 403 error', async () => {
      const newNonce = 'refreshed-nonce';
      
      // Set up nonce refresh callback
      apiClient.setNonceRefreshCallback(async () => newNonce);

      // First request fails with nonce error
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 403,
          json: async () => ({ code: 'rest_cookie_invalid_nonce' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        });

      const result = await apiClient.getSettings();

      expect(result).toBeDefined();
      expect(apiClient.getNonce()).toBe(newNonce);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should validate nonce format', () => {
      expect(APIClient.isValidNonce('1234567890')).toBe(true);
      expect(APIClient.isValidNonce('abc')).toBe(false);
      expect(APIClient.isValidNonce('')).toBe(false);
      expect(APIClient.isValidNonce(null)).toBe(false);
    });
  });
});
