/**
 * Palette Manager Module
 * 
 * Handles palette application, saving, and deletion using API Client.
 * Migrated from legacy mase-admin.js palette manager.
 * 
 * Task 14.3: Update feature modules to use API Client
 * Requirements: 8.1
 * 
 * @module palette-manager
 */

import apiClient from './api-client.js';
import eventBus, { EVENTS } from './event-bus.js';

/**
 * Palette Manager Class
 * 
 * Provides methods for palette operations using the API Client.
 */
class PaletteManager {
  constructor() {
    this.currentPalette = null;
    this.isApplying = false;
  }
  
  /**
   * Apply a color palette
   * 
   * Task 14.3: Use API Client for palette application
   * Requirement 8.1: Handle all WordPress REST API requests
   * 
   * @param {string} paletteId - The palette ID to apply
   * @returns {Promise<Object>} Response from server
   */
  async applyPalette(paletteId) {
    // Prevent duplicate submissions
    if (this.isApplying) {
      console.warn('MASE: Palette application already in progress');
      return Promise.reject(new Error('Palette application already in progress'));
    }
    
    this.isApplying = true;
    
    try {
      // Emit palette apply started event
      eventBus.emit(EVENTS.PALETTE_APPLY_STARTED, { paletteId });
      
      // Use API Client to apply palette
      const response = await apiClient.applyPalette(paletteId);
      
      if (response.success) {
        this.currentPalette = paletteId;
        
        // Emit palette applied event
        eventBus.emit(EVENTS.PALETTE_APPLIED, {
          paletteId,
          response,
        });
        
        console.log('MASE: Palette applied successfully:', paletteId);
      }
      
      return response;
      
    } catch (error) {
      console.error('MASE: Failed to apply palette:', error);
      
      // Emit palette apply failed event
      eventBus.emit(EVENTS.PALETTE_APPLY_FAILED, {
        paletteId,
        error: error.message,
      });
      
      throw error;
      
    } finally {
      this.isApplying = false;
    }
  }
  
  /**
   * Save a custom color palette
   * 
   * Task 14.3: Use API Client for saving custom palette
   * Requirement 8.1: Handle all WordPress REST API requests
   * 
   * @param {string} name - Palette name
   * @param {Object} colors - Object containing color values
   * @returns {Promise<Object>} Response from server
   */
  async saveCustomPalette(name, colors) {
    try {
      // Validate inputs
      if (!name || name.trim() === '') {
        throw new Error('Palette name is required');
      }
      
      if (!colors || Object.keys(colors).length === 0) {
        throw new Error('Please select colors for the palette');
      }
      
      // Emit palette save started event
      eventBus.emit(EVENTS.PALETTE_SAVE_STARTED, { name, colors });
      
      // Use API Client to save custom palette
      const response = await apiClient.saveCustomPalette(name, colors);
      
      if (response.success) {
        // Emit palette saved event
        eventBus.emit(EVENTS.PALETTE_SAVED, {
          name,
          response,
        });
        
        console.log('MASE: Custom palette saved successfully:', name);
      }
      
      return response;
      
    } catch (error) {
      console.error('MASE: Failed to save custom palette:', error);
      
      // Emit palette save failed event
      eventBus.emit(EVENTS.PALETTE_SAVE_FAILED, {
        name,
        error: error.message,
      });
      
      throw error;
    }
  }
  
  /**
   * Delete a custom color palette
   * 
   * Task 14.3: Use API Client for deleting custom palette
   * Requirement 8.1: Handle all WordPress REST API requests
   * 
   * @param {string} paletteId - The palette ID to delete
   * @returns {Promise<Object>} Response from server
   */
  async deleteCustomPalette(paletteId) {
    try {
      // Emit palette delete started event
      eventBus.emit(EVENTS.PALETTE_DELETE_STARTED, { paletteId });
      
      // Use API Client to delete custom palette
      const response = await apiClient.deleteCustomPalette(paletteId);
      
      if (response.success) {
        // Emit palette deleted event
        eventBus.emit(EVENTS.PALETTE_DELETED, {
          paletteId,
          response,
        });
        
        console.log('MASE: Custom palette deleted successfully:', paletteId);
      }
      
      return response;
      
    } catch (error) {
      console.error('MASE: Failed to delete custom palette:', error);
      
      // Emit palette delete failed event
      eventBus.emit(EVENTS.PALETTE_DELETE_FAILED, {
        paletteId,
        error: error.message,
      });
      
      throw error;
    }
  }
  
  /**
   * Get current palette ID
   * 
   * @returns {string|null} Current palette ID
   */
  getCurrentPalette() {
    return this.currentPalette;
  }
}

// Export singleton instance
const paletteManager = new PaletteManager();
export default paletteManager;
