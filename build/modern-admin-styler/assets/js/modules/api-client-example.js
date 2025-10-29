/**
 * API Client Usage Example
 *
 * This file demonstrates how to use the APIClient module
 * in the MASE plugin.
 *
 * @module api-client-example
 */

import APIClient from './api-client.js';

/**
 * Initialize API Client with WordPress data
 *
 * @example
 * // In WordPress, data is passed via wp_localize_script
 * const apiClient = initializeAPIClient();
 */
export function initializeAPIClient() {
  // Get configuration from WordPress localized data
  const config = {
    baseURL: window.maseData?.restUrl || '/wp-json/mase/v1',
    nonce: window.maseData?.nonce || '',
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
    debug: window.maseData?.debug || false,
  };

  // Create API client instance
  const apiClient = new APIClient(config);

  // Setup nonce refresh callback
  apiClient.setNonceRefreshCallback(async () => {
    // In a real implementation, this would fetch a new nonce from the server
    // For now, we'll just return null to indicate refresh is not available
    console.warn('Nonce refresh not implemented. Please refresh the page.');
    return null;
  });

  // Add request interceptor for logging (development only)
  if (config.debug) {
    apiClient.addRequestInterceptor(async (requestConfig) => {
      console.log('API Request:', requestConfig);
      return requestConfig;
    });

    apiClient.addResponseInterceptor(async (responseData) => {
      console.log('API Response:', responseData);
      return responseData;
    });
  }

  return apiClient;
}

/**
 * Example: Load settings from server
 */
export async function loadSettings(apiClient) {
  try {
    const settings = await apiClient.getSettings();
    console.log('Settings loaded:', settings);
    return settings;
  } catch (error) {
    console.error('Failed to load settings:', error.message);
    throw error;
  }
}

/**
 * Example: Save settings to server
 */
export async function saveSettings(apiClient, settings) {
  try {
    const response = await apiClient.saveSettings(settings);
    console.log('Settings saved:', response);
    return response;
  } catch (error) {
    console.error('Failed to save settings:', error.message);
    throw error;
  }
}

/**
 * Example: Apply a template
 */
export async function applyTemplate(apiClient, templateId) {
  try {
    const settings = await apiClient.applyTemplate(templateId);
    console.log('Template applied:', settings);
    return settings;
  } catch (error) {
    console.error('Failed to apply template:', error.message);
    throw error;
  }
}

/**
 * Example: Apply a color palette
 */
export async function applyPalette(apiClient, paletteId) {
  try {
    const colors = await apiClient.applyPalette(paletteId);
    console.log('Palette applied:', colors);
    return colors;
  } catch (error) {
    console.error('Failed to apply palette:', error.message);
    throw error;
  }
}

/**
 * Example: Complete workflow with error handling
 */
export async function completeWorkflow() {
  // Initialize API client
  const apiClient = initializeAPIClient();

  try {
    // Load current settings
    const currentSettings = await loadSettings(apiClient);

    // Modify settings
    const updatedSettings = {
      ...currentSettings,
      colors: {
        ...currentSettings.colors,
        primary: '#ff0000',
      },
    };

    // Save updated settings
    await saveSettings(apiClient, updatedSettings);

    // Apply a template
    await applyTemplate(apiClient, 'modern-dark');

    // Apply a color palette
    await applyPalette(apiClient, 'ocean-blue');

    console.log('Workflow completed successfully');
  } catch (error) {
    console.error('Workflow failed:', error.message);

    // Show user-friendly error message
    if (window.maseAdmin?.showNotice) {
      window.maseAdmin.showNotice(error.message, 'error');
    }
  }
}

// Export for use in other modules
export default {
  initializeAPIClient,
  loadSettings,
  saveSettings,
  applyTemplate,
  applyPalette,
  completeWorkflow,
};
