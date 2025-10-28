/**
 * TestHelpers Class
 * 
 * Provides reusable helper functions for visual interactive testing of the
 * Modern Admin Styler (MASE) WordPress plugin.
 */

class TestHelpers {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   * @param {Object} config - Test configuration object
   */
  constructor(page, config) {
    this.page = page;
    this.config = config;
    this.screenshots = [];
    this.consoleErrors = [];
    this.startTime = Date.now();

    // Initialize console monitoring if enabled
    if (config.console?.monitorErrors) {
      this.startConsoleMonitoring();
    }
  }

  // ============================================================================
  // NAVIGATION HELPERS
  // ============================================================================

  /**
   * Login to WordPress admin
   * @param {string} username - WordPress username (optional, uses config default)
   * @param {string} password - WordPress password (optional, uses config default)
   * @returns {Promise<void>}
   */
  async loginToWordPress(username = null, password = null) {
    const user = username || this.config.wordpress.credentials.username;
    const pass = password || this.config.wordpress.credentials.password;
    const baseURL = this.config.wordpress.baseURL;

    try {
      // Navigate to login page
      await this.page.goto(`${baseURL}/wp-login.php`, {
        waitUntil: 'networkidle',
        timeout: this.config.timeouts.navigation
      });

      // Fill login form
      await this.page.fill('#user_login', user);
      await this.page.fill('#user_pass', pass);

      // Click login button
      await this.page.click('#wp-submit');

      // Wait for admin bar to appear (indicates successful login)
      await this.page.waitForSelector('#wpadminbar', {
        state: 'visible',
        timeout: this.config.timeouts.navigation
      });

      // Wait for page to stabilize
      await this.page.waitForLoadState('domcontentloaded');
    } catch (error) {
      throw new Error(`Failed to login to WordPress: ${error.message}`);
    }
  }

  /**
   * Navigate to MASE settings page
   * @returns {Promise<void>}
   */
  async navigateToSettings() {
    const baseURL = this.config.wordpress.baseURL;
    const settingsPage = this.config.wordpress.settingsPage;

    try {
      await this.page.goto(`${baseURL}${settingsPage}`, {
        waitUntil: 'networkidle',
        timeout: this.config.timeouts.navigation
      });

      // Wait for settings page to load - check for any MASE element
      await this.page.waitForSelector('#mase-settings-form, .mase-tab, .wrap', {
        timeout: this.config.timeouts.element
      });
    } catch (error) {
      throw new Error(`Failed to navigate to settings page: ${error.message}`);
    }
  }

  /**
   * Navigate to a specific tab in MASE settings
   * @param {string} tabName - Tab name (e.g., 'admin-bar', 'menu', 'content')
   * @returns {Promise<void>}
   */
  async navigateToTab(tabName) {
    try {
      // Map tab names to their data attributes or IDs
      const tabSelector = `[data-tab="${tabName}"], #${tabName}-tab`;

      // Click the tab
      await this.page.click(tabSelector, {
        timeout: this.config.timeouts.element
      });

      // Wait for tab content to be visible
      const contentSelector = `[data-tab-content="${tabName}"], #${tabName}-content`;
      await this.page.waitForSelector(contentSelector, {
        state: 'visible',
        timeout: this.config.timeouts.element
      });

      // Small delay to ensure tab is fully loaded
      await this.pause(300);
    } catch (error) {
      throw new Error(`Failed to navigate to tab "${tabName}": ${error.message}`);
    }
  }

  /**
   * Reload the current page
   * @returns {Promise<void>}
   */
  async reloadPage() {
    await this.page.reload({
      waitUntil: 'networkidle',
      timeout: this.config.timeouts.navigation
    });
  }

  // ============================================================================
  // SETTING MANIPULATION HELPERS
  // ============================================================================

  /**
   * Change a setting value
   * @param {string} fieldName - Field name or selector
   * @param {*} value - Value to set
   * @returns {Promise<void>}
   */
  async changeSetting(fieldName, value) {
    try {
      // Build selector - try name attribute first, then ID
      let selector = `[name="${fieldName}"]`;
      let element = await this.page.$(selector);

      if (!element) {
        selector = `#${fieldName}`;
        element = await this.page.$(selector);
      }

      if (!element) {
        throw new Error(`Field not found: ${fieldName}`);
      }

      // Check if this is a WordPress Color Picker
      const hasColorPicker = await element.evaluate(el =>
        el.classList.contains('mase-color-picker') || el.classList.contains('wp-color-picker')
      );

      if (hasColorPicker) {
        // WordPress Color Picker - use jQuery to set value and trigger wpColorPicker
        await this.page.evaluate(({ sel, val }) => {
          const $input = jQuery(sel);
          $input.val(val);
          if ($input.wpColorPicker) {
            $input.wpColorPicker('color', val);
          }
          $input.trigger('change');
        }, { sel: selector, val: value });

        // Wait for color picker to update
        await this.page.waitForTimeout(300);
      } else {
        // Get element type
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        const inputType = await element.evaluate(el => el.type);

        // Handle different input types
        if (tagName === 'input') {
          if (inputType === 'checkbox' || inputType === 'radio') {
            // Checkbox or radio button
            const isChecked = await element.isChecked();
            const shouldCheck = Boolean(value);

            if (isChecked !== shouldCheck) {
              await element.click();
            }
          } else {
            // Text, number, etc.
            await element.fill(String(value));
          }
        } else if (tagName === 'select') {
          // Select dropdown
          await element.selectOption(String(value));
        } else if (tagName === 'textarea') {
          // Textarea
          await element.fill(String(value));
        } else {
          throw new Error(`Unsupported element type: ${tagName}`);
        }
      }

      // Wait for Live Preview if enabled
      if (this.config.livePreview?.enableByDefault) {
        await this.waitForLivePreview();
      }
    } catch (error) {
      throw new Error(`Failed to change setting "${fieldName}": ${error.message}`);
    }
  }

  /**
   * Save settings via AJAX
   * @returns {Promise<void>}
   */
  async saveSettings() {
    try {
      // Click save button
      const saveButton = await this.page.$('.mase-save-settings, #submit, [type="submit"]');
      if (!saveButton) {
        throw new Error('Save button not found');
      }

      await saveButton.click();

      // Wait for AJAX to complete
      await this.waitForAjaxComplete();

      // Wait for success message or just wait a bit
      try {
        await this.page.waitForSelector('.notice-success, .updated, .mase-notice-success', {
          timeout: 3000
        });
      } catch (e) {
        // Success message might not appear, that's okay
        await this.page.waitForTimeout(1000);
      }
    } catch (error) {
      throw new Error(`Failed to save settings: ${error.message}`);
    }
  }

  /**
   * Verify a setting value matches expected value
   * @param {string} fieldName - Field name or selector
   * @param {*} expectedValue - Expected value
   * @returns {Promise<boolean>}
   */
  async verifySetting(fieldName, expectedValue) {
    try {
      let selector = `[name="${fieldName}"]`;
      let element = await this.page.$(selector);

      if (!element) {
        selector = `#${fieldName}`;
        element = await this.page.$(selector);
      }

      if (!element) {
        throw new Error(`Field not found: ${fieldName}`);
      }

      const tagName = await element.evaluate(el => el.tagName.toLowerCase());
      const inputType = await element.evaluate(el => el.type);

      let actualValue;

      if (tagName === 'input') {
        if (inputType === 'checkbox' || inputType === 'radio') {
          actualValue = await element.isChecked();
        } else {
          actualValue = await element.inputValue();
        }
      } else if (tagName === 'select') {
        actualValue = await element.inputValue();
      } else if (tagName === 'textarea') {
        actualValue = await element.inputValue();
      }

      return actualValue === String(expectedValue);
    } catch (error) {
      throw new Error(`Failed to verify setting "${fieldName}": ${error.message}`);
    }
  }

  /**
   * Reset settings to defaults (placeholder - implementation depends on MASE)
   * @returns {Promise<void>}
   */
  async resetSettings() {
    // This would need to be implemented based on MASE's reset functionality
    console.warn('resetSettings() not yet implemented');
  }

  // ============================================================================
  // LIVE PREVIEW HELPERS
  // ============================================================================

  /**
   * Enable Live Preview
   * @returns {Promise<void>}
   */
  async enableLivePreview() {
    try {
      const toggle = await this.page.$('#mase-live-preview-toggle, [data-live-preview-toggle]');
      if (!toggle) {
        throw new Error('Live Preview toggle not found');
      }

      const isChecked = await toggle.isChecked();
      if (!isChecked) {
        await toggle.click();
        await this.pause(this.config.livePreview?.enableWait || 500);
      }
    } catch (error) {
      throw new Error(`Failed to enable Live Preview: ${error.message}`);
    }
  }

  /**
   * Disable Live Preview
   * @returns {Promise<void>}
   */
  async disableLivePreview() {
    try {
      const toggle = await this.page.$('#mase-live-preview-toggle, [data-live-preview-toggle]');
      if (!toggle) {
        throw new Error('Live Preview toggle not found');
      }

      const isChecked = await toggle.isChecked();
      if (isChecked) {
        await toggle.click();
        await this.pause(this.config.livePreview?.enableWait || 500);
      }
    } catch (error) {
      throw new Error(`Failed to disable Live Preview: ${error.message}`);
    }
  }

  /**
   * Wait for Live Preview to update
   * @param {number} timeout - Timeout in milliseconds (optional)
   * @returns {Promise<void>}
   */
  async waitForLivePreview(timeout = null) {
    const waitTime = timeout || this.config.timeouts?.livePreview || 1000;
    await this.pause(waitTime);
  }

  // ============================================================================
  // VISUAL VERIFICATION HELPERS
  // ============================================================================

  /**
   * Take a screenshot
   * @param {string} name - Screenshot name
   * @param {Object} options - Screenshot options
   * @returns {Promise<string>} - Path to screenshot
   */
  async takeScreenshot(name, options = {}) {
    try {
      const timestamp = Date.now();
      const filename = `${name}-${timestamp}.${this.config.output.screenshotFormat}`;
      const path = `${this.config.output.screenshotsDir}/${filename}`;

      const screenshotOptions = {
        path,
        fullPage: options.fullPage || false,
        ...options
      };

      // Only add quality for JPEG format
      if (this.config.output.screenshotFormat === 'jpeg' && this.config.output.screenshotQuality) {
        screenshotOptions.quality = this.config.output.screenshotQuality;
      }

      await this.page.screenshot(screenshotOptions);

      this.screenshots.push({
        name,
        path,
        timestamp: new Date().toISOString()
      });

      return path;
    } catch (error) {
      console.error(`Failed to take screenshot "${name}": ${error.message}`);
      return null;
    }
  }

  /**
   * Get computed style of an element
   * @param {string} selector - Element selector
   * @param {string} property - CSS property name
   * @returns {Promise<string>} - Computed style value
   */
  async getComputedStyle(selector, property) {
    try {
      return await this.page.$eval(selector, (el, prop) => {
        return window.getComputedStyle(el).getPropertyValue(prop);
      }, property);
    } catch (error) {
      throw new Error(`Failed to get computed style for "${selector}": ${error.message}`);
    }
  }

  /**
   * Verify color matches expected value (supports RGB, hex, color names)
   * @param {string} selector - Element selector
   * @param {string} expectedColor - Expected color value
   * @param {string} property - CSS property (default: 'background-color')
   * @returns {Promise<boolean>}
   */
  async verifyColor(selector, expectedColor, property = 'background-color') {
    try {
      const actualColor = await this.getComputedStyle(selector, property);

      // Normalize colors to RGB for comparison
      const normalizedActual = this.normalizeColor(actualColor);
      const normalizedExpected = this.normalizeColor(expectedColor);

      return normalizedActual === normalizedExpected;
    } catch (error) {
      throw new Error(`Failed to verify color: ${error.message}`);
    }
  }

  /**
   * Normalize color to RGB format for comparison
   * @param {string} color - Color in any format
   * @returns {string} - Normalized RGB string
   */
  normalizeColor(color) {
    // Remove whitespace
    color = color.trim();

    // If already in rgb() format, extract values
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      return `${rgbMatch[1]},${rgbMatch[2]},${rgbMatch[3]}`;
    }

    // If in hex format, convert to RGB
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `${r},${g},${b}`;
    }

    // Return as-is for other formats
    return color;
  }

  /**
   * Verify element visibility
   * @param {string} selector - Element selector
   * @param {boolean} shouldBeVisible - Expected visibility state
   * @returns {Promise<boolean>}
   */
  async verifyVisibility(selector, shouldBeVisible = true) {
    try {
      const element = await this.page.$(selector);
      if (!element) {
        return !shouldBeVisible;
      }

      const isVisible = await element.isVisible();
      return isVisible === shouldBeVisible;
    } catch (error) {
      throw new Error(`Failed to verify visibility: ${error.message}`);
    }
  }

  // ============================================================================
  // CONSOLE MONITORING
  // ============================================================================

  /**
   * Start monitoring browser console for errors
   */
  startConsoleMonitoring() {
    this.page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();

      // Check if error should be ignored
      const shouldIgnore = this.config.console.ignorePatterns.some(pattern =>
        pattern.test(text)
      );

      if (!shouldIgnore && (type === 'error' || type === 'warning')) {
        this.consoleErrors.push({
          type,
          message: text,
          timestamp: new Date().toISOString()
        });
      }

      // Log to console if debug mode enabled
      if (this.config.debug?.logConsole) {
        console.log(`[Browser ${type}]`, text);
      }
    });

    this.page.on('pageerror', error => {
      this.consoleErrors.push({
        type: 'error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

      if (this.config.debug?.verbose) {
        console.error('[Page Error]', error);
      }
    });
  }

  /**
   * Get all console errors
   * @returns {Array} - Array of console error objects
   */
  getConsoleErrors() {
    return [...this.consoleErrors];
  }

  /**
   * Clear console errors
   */
  clearConsoleErrors() {
    this.consoleErrors = [];
  }

  // ============================================================================
  // AJAX HELPERS
  // ============================================================================

  /**
   * Wait for all AJAX requests to complete
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForAjaxComplete(timeout = null) {
    const maxWait = timeout || this.config.timeouts.ajax;
    const startTime = Date.now();

    try {
      await this.page.waitForFunction(
        () => {
          // Check if jQuery is available and no active AJAX requests
          return typeof jQuery !== 'undefined' && jQuery.active === 0;
        },
        { timeout: maxWait }
      );
    } catch (error) {
      const elapsed = Date.now() - startTime;
      console.warn(`AJAX wait timeout after ${elapsed}ms`);
    }
  }

  /**
   * Wait for a specific AJAX response
   * @param {string|RegExp} urlPattern - URL pattern to match
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Response>}
   */
  async waitForResponse(urlPattern, timeout = null) {
    const maxWait = timeout || this.config.timeouts.ajax;

    return await this.page.waitForResponse(
      response => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        } else {
          return urlPattern.test(url);
        }
      },
      { timeout: maxWait }
    );
  }

  // ============================================================================
  // ASSERTION HELPERS
  // ============================================================================

  /**
   * Assertion helpers
   */
  assert = {
    /**
     * Assert two values are equal
     */
    equals: (actual, expected, message = '') => {
      if (actual !== expected) {
        throw new Error(
          `Assertion failed: ${message}\nExpected: ${expected}\nActual: ${actual}`
        );
      }
    },

    /**
     * Assert string contains substring
     */
    contains: (actual, substring, message = '') => {
      if (!String(actual).includes(substring)) {
        throw new Error(
          `Assertion failed: ${message}\nExpected "${actual}" to contain "${substring}"`
        );
      }
    },

    /**
     * Assert value is true
     */
    isTrue: (value, message = '') => {
      if (value !== true) {
        throw new Error(`Assertion failed: ${message}\nExpected true, got ${value}`);
      }
    },

    /**
     * Assert value is false
     */
    isFalse: (value, message = '') => {
      if (value !== false) {
        throw new Error(`Assertion failed: ${message}\nExpected false, got ${value}`);
      }
    }
  };


  // ============================================================================
  // PALETTE OPERATION HELPERS
  // ============================================================================

  /**
   * Apply a color palette
   * @param {string} paletteId - Palette ID or name
   * @returns {Promise<void>}
   */
  async applyPalette(paletteId) {
    try {
      // Navigate to palettes section if not already there
      const paletteSelector = `[data-palette-id="${paletteId}"], .palette-item[data-id="${paletteId}"]`;

      // Find and click the palette
      const palette = await this.page.$(paletteSelector);
      if (!palette) {
        throw new Error(`Palette not found: ${paletteId}`);
      }

      // Click apply button for the palette
      const applyButton = await palette.$('.apply-palette, [data-action="apply"]');
      if (!applyButton) {
        throw new Error(`Apply button not found for palette: ${paletteId}`);
      }

      await applyButton.click();

      // Wait for AJAX to complete
      await this.waitForAjaxComplete();

      // Wait for success notification
      await this.page.waitForSelector('.notice-success, .updated', {
        timeout: this.config.timeouts.save
      });

      // Verify "Active" badge appears
      await this.page.waitForSelector(`${paletteSelector} .active-badge, ${paletteSelector}.active`, {
        timeout: this.config.timeouts.element
      });
    } catch (error) {
      throw new Error(`Failed to apply palette "${paletteId}": ${error.message}`);
    }
  }

  /**
   * Save a custom color palette
   * @param {string} name - Palette name
   * @param {Object} colors - Color values object
   * @returns {Promise<void>}
   */
  async saveCustomPalette(name, colors) {
    try {
      // Click "Save Custom Palette" button
      const saveButton = await this.page.$('.save-custom-palette, [data-action="save-palette"]');
      if (!saveButton) {
        throw new Error('Save custom palette button not found');
      }

      await saveButton.click();

      // Wait for dialog/modal
      await this.page.waitForSelector('.palette-dialog, .modal', {
        timeout: this.config.timeouts.element
      });

      // Fill palette name
      await this.page.fill('[name="palette_name"], #palette-name', name);

      // Fill color values if provided
      if (colors) {
        for (const [key, value] of Object.entries(colors)) {
          await this.changeSetting(key, value);
        }
      }

      // Click save in dialog
      const dialogSaveButton = await this.page.$('.palette-dialog .save, .modal .save');
      await dialogSaveButton.click();

      // Wait for AJAX
      await this.waitForAjaxComplete();

      // Verify palette appears in list
      await this.page.waitForSelector(`[data-palette-name="${name}"]`, {
        timeout: this.config.timeouts.element
      });
    } catch (error) {
      throw new Error(`Failed to save custom palette "${name}": ${error.message}`);
    }
  }

  /**
   * Delete a custom palette
   * @param {string} paletteId - Palette ID
   * @returns {Promise<void>}
   */
  async deleteCustomPalette(paletteId) {
    try {
      const paletteSelector = `[data-palette-id="${paletteId}"]`;

      // Find delete button
      const deleteButton = await this.page.$(`${paletteSelector} .delete-palette, ${paletteSelector} [data-action="delete"]`);
      if (!deleteButton) {
        throw new Error(`Delete button not found for palette: ${paletteId}`);
      }

      await deleteButton.click();

      // Handle confirmation dialog if present
      const confirmButton = await this.page.$('.confirm-delete, [data-confirm="yes"]');
      if (confirmButton) {
        await confirmButton.click();
      }

      // Wait for AJAX
      await this.waitForAjaxComplete();

      // Verify palette removed from list
      await this.page.waitForSelector(paletteSelector, {
        state: 'hidden',
        timeout: this.config.timeouts.element
      });
    } catch (error) {
      throw new Error(`Failed to delete palette "${paletteId}": ${error.message}`);
    }
  }

  // ============================================================================
  // TEMPLATE OPERATION HELPERS
  // ============================================================================

  /**
   * Apply a template
   * @param {string} templateId - Template ID or name
   * @returns {Promise<void>}
   */
  async applyTemplate(templateId) {
    try {
      const templateSelector = `[data-template-id="${templateId}"], .template-item[data-id="${templateId}"]`;

      // Find and click the template
      const template = await this.page.$(templateSelector);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      // Click apply button
      const applyButton = await template.$('.apply-template, [data-action="apply"]');
      if (!applyButton) {
        throw new Error(`Apply button not found for template: ${templateId}`);
      }

      await applyButton.click();

      // Wait for confirmation dialog
      await this.page.waitForSelector('.template-confirm-dialog, .confirm-dialog', {
        timeout: this.config.timeouts.element
      });

      // Click confirm button
      const confirmButton = await this.page.$('.confirm-apply, [data-confirm="yes"]');
      if (confirmButton) {
        await confirmButton.click();
      }

      // Wait for AJAX
      await this.waitForAjaxComplete();

      // Wait for success notification
      await this.page.waitForSelector('.notice-success, .updated', {
        timeout: this.config.timeouts.save
      });

      // Verify "Active" badge appears
      await this.page.waitForSelector(`${templateSelector} .active-badge, ${templateSelector}.active`, {
        timeout: this.config.timeouts.element
      });
    } catch (error) {
      throw new Error(`Failed to apply template "${templateId}": ${error.message}`);
    }
  }

  /**
   * Save a custom template
   * @param {string} name - Template name
   * @param {Object} settings - Settings object (optional)
   * @returns {Promise<void>}
   */
  async saveCustomTemplate(name, settings = null) {
    try {
      // Click "Save Custom Template" button
      const saveButton = await this.page.$('.save-custom-template, [data-action="save-template"]');
      if (!saveButton) {
        throw new Error('Save custom template button not found');
      }

      await saveButton.click();

      // Wait for dialog
      await this.page.waitForSelector('.template-dialog, .modal', {
        timeout: this.config.timeouts.element
      });

      // Fill template name
      await this.page.fill('[name="template_name"], #template-name', name);

      // Click save in dialog
      const dialogSaveButton = await this.page.$('.template-dialog .save, .modal .save');
      await dialogSaveButton.click();

      // Wait for AJAX
      await this.waitForAjaxComplete();

      // Verify template appears in list
      await this.page.waitForSelector(`[data-template-name="${name}"]`, {
        timeout: this.config.timeouts.element
      });
    } catch (error) {
      throw new Error(`Failed to save custom template "${name}": ${error.message}`);
    }
  }

  /**
   * Delete a custom template
   * @param {string} templateId - Template ID
   * @returns {Promise<void>}
   */
  async deleteCustomTemplate(templateId) {
    try {
      const templateSelector = `[data-template-id="${templateId}"]`;

      // Find delete button
      const deleteButton = await this.page.$(`${templateSelector} .delete-template, ${templateSelector} [data-action="delete"]`);
      if (!deleteButton) {
        throw new Error(`Delete button not found for template: ${templateId}`);
      }

      await deleteButton.click();

      // Handle confirmation dialog
      const confirmButton = await this.page.$('.confirm-delete, [data-confirm="yes"]');
      if (confirmButton) {
        await confirmButton.click();
      }

      // Wait for AJAX
      await this.waitForAjaxComplete();

      // Verify template removed
      await this.page.waitForSelector(templateSelector, {
        state: 'hidden',
        timeout: this.config.timeouts.element
      });
    } catch (error) {
      throw new Error(`Failed to delete template "${templateId}": ${error.message}`);
    }
  }

  // ============================================================================
  // IMPORT/EXPORT HELPERS
  // ============================================================================

  /**
   * Export settings to JSON file
   * @returns {Promise<string>} - Path to downloaded file
   */
  async exportSettings() {
    try {
      // Set up download listener
      const downloadPromise = this.page.waitForEvent('download', {
        timeout: this.config.timeouts.save
      });

      // Click export button
      const exportButton = await this.page.$('.export-settings, [data-action="export"]');
      if (!exportButton) {
        throw new Error('Export button not found');
      }

      await exportButton.click();

      // Wait for download
      const download = await downloadPromise;
      const path = await download.path();

      return path;
    } catch (error) {
      throw new Error(`Failed to export settings: ${error.message}`);
    }
  }

  /**
   * Import settings from JSON file
   * @param {string} filePath - Path to JSON file
   * @returns {Promise<void>}
   */
  async importSettings(filePath) {
    try {
      // Find file input
      const fileInput = await this.page.$('input[type="file"][name="import_file"], #import-file');
      if (!fileInput) {
        throw new Error('Import file input not found');
      }

      // Upload file
      await fileInput.setInputFiles(filePath);

      // Click import button
      const importButton = await this.page.$('.import-settings, [data-action="import"]');
      if (importButton) {
        await importButton.click();
      }

      // Wait for AJAX
      await this.waitForAjaxComplete();

      // Wait for success notification
      await this.page.waitForSelector('.notice-success, .updated', {
        timeout: this.config.timeouts.save
      });
    } catch (error) {
      throw new Error(`Failed to import settings: ${error.message}`);
    }
  }

  /**
   * Create a backup
   * @returns {Promise<string>} - Backup ID
   */
  async createBackup() {
    try {
      // Click create backup button
      const backupButton = await this.page.$('.create-backup, [data-action="backup"]');
      if (!backupButton) {
        throw new Error('Create backup button not found');
      }

      await backupButton.click();

      // Wait for AJAX
      await this.waitForAjaxComplete();

      // Wait for success notification
      await this.page.waitForSelector('.notice-success, .updated', {
        timeout: this.config.timeouts.save
      });

      // Get backup ID from the newly created backup item
      const backupItem = await this.page.$('.backup-item:first-child, [data-backup]:first-child');
      const backupId = await backupItem.getAttribute('data-backup-id');

      return backupId;
    } catch (error) {
      throw new Error(`Failed to create backup: ${error.message}`);
    }
  }

  /**
   * Restore from a backup
   * @param {string} backupId - Backup ID
   * @returns {Promise<void>}
   */
  async restoreBackup(backupId) {
    try {
      const backupSelector = `[data-backup-id="${backupId}"]`;

      // Find restore button
      const restoreButton = await this.page.$(`${backupSelector} .restore-backup, ${backupSelector} [data-action="restore"]`);
      if (!restoreButton) {
        throw new Error(`Restore button not found for backup: ${backupId}`);
      }

      await restoreButton.click();

      // Handle confirmation dialog
      const confirmButton = await this.page.$('.confirm-restore, [data-confirm="yes"]');
      if (confirmButton) {
        await confirmButton.click();
      }

      // Wait for AJAX
      await this.waitForAjaxComplete();

      // Wait for success notification
      await this.page.waitForSelector('.notice-success, .updated', {
        timeout: this.config.timeouts.save
      });
    } catch (error) {
      throw new Error(`Failed to restore backup "${backupId}": ${error.message}`);
    }
  }

  // ============================================================================
  // RESPONSIVE VIEWPORT HELPERS
  // ============================================================================

  /**
   * Standard viewport sizes for responsive testing
   */
  static VIEWPORTS = {
    desktop: { width: 1920, height: 1080, name: 'Desktop' },
    tablet: { width: 768, height: 1024, name: 'Tablet' },
    mobile: { width: 375, height: 667, name: 'Mobile' }
  };

  /**
   * Set viewport size for responsive testing
   * @param {string|Object} viewport - Viewport name ('desktop', 'tablet', 'mobile') or custom size object
   * @returns {Promise<void>}
   */
  async setViewport(viewport) {
    try {
      let viewportConfig;

      // If string, use predefined viewport
      if (typeof viewport === 'string') {
        viewportConfig = TestHelpers.VIEWPORTS[viewport.toLowerCase()];
        if (!viewportConfig) {
          throw new Error(`Unknown viewport: ${viewport}. Available: desktop, tablet, mobile`);
        }
      } else if (typeof viewport === 'object' && viewport.width && viewport.height) {
        // Custom viewport object
        viewportConfig = viewport;
      } else {
        throw new Error('Invalid viewport parameter. Use viewport name or {width, height} object');
      }

      // Set viewport size
      await this.page.setViewportSize({
        width: viewportConfig.width,
        height: viewportConfig.height
      });

      // Wait for layout to stabilize
      await this.pause(500);

      if (this.config.debug?.verbose) {
        const name = viewportConfig.name || `${viewportConfig.width}x${viewportConfig.height}`;
        console.log(`📱 Viewport set to: ${name} (${viewportConfig.width}x${viewportConfig.height})`);
      }
    } catch (error) {
      throw new Error(`Failed to set viewport: ${error.message}`);
    }
  }

  /**
   * Get current viewport size
   * @returns {Promise<Object>} - Current viewport dimensions
   */
  async getViewport() {
    return await this.page.viewportSize();
  }

  /**
   * Test at multiple viewport sizes
   * @param {Function} testFn - Test function to execute at each viewport
   * @param {Array<string>} viewports - Array of viewport names (default: all)
   * @returns {Promise<Object>} - Results for each viewport
   */
  async testAtViewports(testFn, viewports = ['desktop', 'tablet', 'mobile']) {
    const results = {};

    for (const viewport of viewports) {
      try {
        await this.setViewport(viewport);
        const result = await testFn(viewport);
        results[viewport] = { success: true, result };
      } catch (error) {
        results[viewport] = { success: false, error: error.message };
      }
    }

    return results;
  }

  // ============================================================================
  // PAUSE HELPERS (for interactive mode)
  // ============================================================================

  /**
   * Pause execution for a specified duration
   * @param {number} duration - Duration in milliseconds
   * @returns {Promise<void>}
   */
  async pause(duration) {
    await new Promise(resolve => setTimeout(resolve, duration));
  }

  /**
   * Pause for manual inspection (interactive mode)
   * @param {string} message - Message to display
   * @returns {Promise<void>}
   */
  async pauseForInspection(message = 'Paused for inspection') {
    if (this.config.execution?.mode === 'interactive') {
      console.log(`\n⏸️  ${message}`);
      console.log('Press Enter to continue...\n');

      // Wait for user input (this would need to be implemented with readline in Node.js)
      // For now, just pause for the inspection timeout
      await this.pause(this.config.timeouts.inspection);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get test execution duration
   * @returns {number} - Duration in milliseconds
   */
  getDuration() {
    return Date.now() - this.startTime;
  }

  /**
   * Get all screenshots taken during test
   * @returns {Array} - Array of screenshot objects
   */
  getScreenshots() {
    return [...this.screenshots];
  }

  /**
   * Check if test has console errors
   * @returns {boolean}
   */
  hasConsoleErrors() {
    return this.consoleErrors.length > 0;
  }

  /**
   * Get test summary
   * @returns {Object} - Test summary object
   */
  getSummary() {
    return {
      duration: this.getDuration(),
      screenshots: this.screenshots.length,
      consoleErrors: this.consoleErrors.length,
      hasErrors: this.hasConsoleErrors()
    };
  }
}

// Export the TestHelpers class
module.exports = TestHelpers;
