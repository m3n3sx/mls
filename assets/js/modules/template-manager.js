/**
 * Template Manager Module
 * 
 * Handles template application, saving, and deletion using API Client.
 * Migrated from legacy mase-admin.js template manager.
 * 
 * Task 14.3: Update feature modules to use API Client
 * Requirements: 8.1
 * 
 * @module template-manager
 */

import apiClient from './api-client.js';
import eventBus, { EVENTS } from './event-bus.js';

/**
 * Template Manager Class
 * 
 * Provides methods for template operations using the API Client.
 */
class TemplateManager {
  constructor() {
    this.currentTemplate = null;
    this.isApplying = false;
  }
  
  /**
   * Apply a template
   * 
   * Task 14.3: Use API Client for template application
   * Requirement 8.1: Handle all WordPress REST API requests
   * 
   * @param {string} templateId - The template ID to apply
   * @returns {Promise<Object>} Response from server
   */
  async applyTemplate(templateId) {
    // Prevent duplicate submissions
    if (this.isApplying) {
      console.warn('MASE: Template application already in progress');
      return Promise.reject(new Error('Template application already in progress'));
    }
    
    this.isApplying = true;
    
    try {
      // Emit template apply started event
      eventBus.emit(EVENTS.TEMPLATE_APPLY_STARTED, { templateId });
      
      // Use API Client to apply template
      const response = await apiClient.applyTemplate(templateId);
      
      if (response.success) {
        this.currentTemplate = templateId;
        
        // Emit template applied event
        eventBus.emit(EVENTS.TEMPLATE_APPLIED, {
          templateId,
          response,
        });
        
        console.log('MASE: Template applied successfully:', templateId);
      }
      
      return response;
      
    } catch (error) {
      console.error('MASE: Failed to apply template:', error);
      
      // Emit template apply failed event
      eventBus.emit(EVENTS.TEMPLATE_APPLY_FAILED, {
        templateId,
        error: error.message,
      });
      
      throw error;
      
    } finally {
      this.isApplying = false;
    }
  }
  
  /**
   * Save a custom template
   * 
   * Task 14.3: Use API Client for saving custom template
   * Requirement 8.1: Handle all WordPress REST API requests
   * 
   * @param {string} name - Template name
   * @param {Object} settings - Complete settings snapshot
   * @returns {Promise<Object>} Response from server
   */
  async saveCustomTemplate(name, settings) {
    try {
      // Validate inputs
      if (!name || name.trim() === '') {
        throw new Error('Template name is required');
      }
      
      if (!settings || Object.keys(settings).length === 0) {
        throw new Error('No settings to save');
      }
      
      // Emit template save started event
      eventBus.emit(EVENTS.TEMPLATE_SAVE_STARTED, { name, settings });
      
      // Use API Client to save custom template
      const response = await apiClient.saveCustomTemplate(name, settings);
      
      if (response.success) {
        // Emit template saved event
        eventBus.emit(EVENTS.TEMPLATE_SAVED, {
          name,
          response,
        });
        
        console.log('MASE: Custom template saved successfully:', name);
      }
      
      return response;
      
    } catch (error) {
      console.error('MASE: Failed to save custom template:', error);
      
      // Emit template save failed event
      eventBus.emit(EVENTS.TEMPLATE_SAVE_FAILED, {
        name,
        error: error.message,
      });
      
      throw error;
    }
  }
  
  /**
   * Delete a custom template
   * 
   * Task 14.3: Use API Client for deleting custom template
   * Requirement 8.1: Handle all WordPress REST API requests
   * 
   * @param {string} templateId - The template ID to delete
   * @returns {Promise<Object>} Response from server
   */
  async deleteCustomTemplate(templateId) {
    try {
      // Emit template delete started event
      eventBus.emit(EVENTS.TEMPLATE_DELETE_STARTED, { templateId });
      
      // Use API Client to delete custom template
      const response = await apiClient.deleteCustomTemplate(templateId);
      
      if (response.success) {
        // Emit template deleted event
        eventBus.emit(EVENTS.TEMPLATE_DELETED, {
          templateId,
          response,
        });
        
        console.log('MASE: Custom template deleted successfully:', templateId);
      }
      
      return response;
      
    } catch (error) {
      console.error('MASE: Failed to delete custom template:', error);
      
      // Emit template delete failed event
      eventBus.emit(EVENTS.TEMPLATE_DELETE_FAILED, {
        templateId,
        error: error.message,
      });
      
      throw error;
    }
  }
  
  /**
   * Get current template ID
   * 
   * @returns {string|null} Current template ID
   */
  getCurrentTemplate() {
    return this.currentTemplate;
  }
}

// Export singleton instance
const templateManager = new TemplateManager();
export default templateManager;
