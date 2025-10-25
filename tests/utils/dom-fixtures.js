/**
 * DOM Fixtures for Component Testing
 * 
 * Provides reusable DOM structures for testing MASE components
 * without requiring a full WordPress environment
 */

/**
 * Create MASE admin wrapper structure
 */
export function createMASEAdminWrapper() {
  const wrapper = document.createElement('div');
  wrapper.className = 'mase-admin-wrapper';
  wrapper.innerHTML = `
    <div class="mase-header">
      <h1>Modern Admin Styler</h1>
      <div class="mase-header-actions">
        <button class="mase-save-btn">Save Settings</button>
        <button class="mase-reset-btn">Reset to Defaults</button>
      </div>
    </div>
    <div class="mase-tabs">
      <button class="mase-tab active" data-tab="admin-bar">Admin Bar</button>
      <button class="mase-tab" data-tab="admin-menu">Admin Menu</button>
      <button class="mase-tab" data-tab="content">Content</button>
      <button class="mase-tab" data-tab="typography">Typography</button>
      <button class="mase-tab" data-tab="effects">Effects</button>
      <button class="mase-tab" data-tab="templates">Templates</button>
      <button class="mase-tab" data-tab="advanced">Advanced</button>
    </div>
    <div class="mase-content">
      <div id="admin-bar-tab" class="mase-tab-content active"></div>
      <div id="admin-menu-tab" class="mase-tab-content"></div>
      <div id="content-tab" class="mase-tab-content"></div>
      <div id="typography-tab" class="mase-tab-content"></div>
      <div id="effects-tab" class="mase-tab-content"></div>
      <div id="templates-tab" class="mase-tab-content"></div>
      <div id="advanced-tab" class="mase-tab-content"></div>
    </div>
    <div id="mase-notices"></div>
  `;
  return wrapper;
}

/**
 * Create color picker input
 */
export function createColorPicker(id, value = '#0073aa') {
  const container = document.createElement('div');
  container.className = 'mase-color-picker-container';
  container.innerHTML = `
    <label for="${id}">Color</label>
    <input type="text" id="${id}" class="mase-color-picker" value="${value}" />
  `;
  return container;
}

/**
 * Create palette card
 */
export function createPaletteCard(paletteId, paletteName, isActive = false) {
  const card = document.createElement('div');
  card.className = `mase-palette-card${isActive ? ' active' : ''}`;
  card.setAttribute('data-palette-id', paletteId);
  card.innerHTML = `
    <div class="mase-palette-header">
      <h3>${paletteName}</h3>
      ${isActive ? '<span class="mase-badge active">Active</span>' : ''}
    </div>
    <div class="mase-palette-colors">
      <div class="mase-color-swatch" style="background-color: #0073aa;"></div>
      <div class="mase-color-swatch" style="background-color: #23282d;"></div>
      <div class="mase-color-swatch" style="background-color: #00a0d2;"></div>
    </div>
    <div class="mase-palette-actions">
      <button class="mase-palette-preview-btn" data-palette-id="${paletteId}">Preview</button>
      <button class="mase-palette-apply-btn" data-palette-id="${paletteId}">Apply</button>
    </div>
  `;
  return card;
}

/**
 * Create template card
 */
export function createTemplateCard(templateId, templateName, isActive = false) {
  const card = document.createElement('div');
  card.className = `mase-template-card${isActive ? ' active' : ''}`;
  card.setAttribute('data-template-id', templateId);
  card.innerHTML = `
    <div class="mase-template-thumbnail">
      <img src="/assets/thumbnails/${templateId}.png" alt="${templateName}" />
    </div>
    <div class="mase-template-info">
      <h3>${templateName}</h3>
      <p>Template description</p>
      ${isActive ? '<span class="mase-badge active">Active</span>' : ''}
    </div>
    <div class="mase-template-actions">
      <button class="mase-template-preview-btn" data-template-id="${templateId}">Preview</button>
      <button class="mase-template-apply-btn" data-template-id="${templateId}">Apply</button>
    </div>
  `;
  return card;
}

/**
 * Create toggle switch
 */
export function createToggleSwitch(id, label, checked = false) {
  const container = document.createElement('div');
  container.className = 'mase-toggle-container';
  container.innerHTML = `
    <label class="mase-toggle">
      <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} />
      <span class="mase-toggle-slider"></span>
      <span class="mase-toggle-label">${label}</span>
    </label>
  `;
  return container;
}

/**
 * Create slider input
 */
export function createSlider(id, label, min = 0, max = 100, value = 50) {
  const container = document.createElement('div');
  container.className = 'mase-slider-container';
  container.innerHTML = `
    <label for="${id}">${label}</label>
    <input type="range" id="${id}" class="mase-slider" min="${min}" max="${max}" value="${value}" />
    <span class="mase-slider-value">${value}</span>
  `;
  return container;
}

/**
 * Create notice element
 */
export function createNotice(type = 'info', message = 'Test notice', dismissible = true) {
  const notice = document.createElement('div');
  notice.className = `mase-notice mase-notice-${type}${dismissible ? ' is-dismissible' : ''}`;
  notice.innerHTML = `
    <p>${message}</p>
    ${dismissible ? '<button class="mase-notice-dismiss">×</button>' : ''}
  `;
  return notice;
}

/**
 * Create WordPress admin bar
 */
export function createWordPressAdminBar() {
  const adminBar = document.createElement('div');
  adminBar.id = 'wpadminbar';
  adminBar.className = 'nojq';
  adminBar.innerHTML = `
    <div class="quicklinks">
      <ul id="wp-admin-bar-root-default">
        <li id="wp-admin-bar-wp-logo">
          <a href="/wp-admin/">WordPress</a>
        </li>
        <li id="wp-admin-bar-site-name">
          <a href="/">Site Name</a>
        </li>
      </ul>
      <ul id="wp-admin-bar-top-secondary">
        <li id="wp-admin-bar-my-account">
          <a href="/wp-admin/profile.php">Admin</a>
        </li>
      </ul>
    </div>
  `;
  return adminBar;
}

/**
 * Create WordPress admin menu
 */
export function createWordPressAdminMenu() {
  const adminMenu = document.createElement('div');
  adminMenu.id = 'adminmenu';
  adminMenu.innerHTML = `
    <ul>
      <li class="menu-top">
        <a href="/wp-admin/">Dashboard</a>
      </li>
      <li class="menu-top">
        <a href="/wp-admin/edit.php">Posts</a>
      </li>
      <li class="menu-top">
        <a href="/wp-admin/edit.php?post_type=page">Pages</a>
      </li>
      <li class="menu-top">
        <a href="/wp-admin/admin.php?page=modern-admin-styler">MASE</a>
      </li>
    </ul>
  `;
  return adminMenu;
}

/**
 * Create hidden nonce input
 */
export function createNonceInput(value = 'test-nonce-12345') {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.id = 'mase_nonce';
  input.name = 'mase_nonce';
  input.value = value;
  return input;
}

/**
 * Setup complete MASE admin page
 */
export function setupMASEAdminPage() {
  document.body.innerHTML = '';
  document.body.appendChild(createWordPressAdminBar());
  document.body.appendChild(createWordPressAdminMenu());
  document.body.appendChild(createMASEAdminWrapper());
  document.body.appendChild(createNonceInput());
}

/**
 * Cleanup DOM after tests
 */
export function cleanupDOM() {
  document.body.innerHTML = '';
}

/**
 * Wait for element to appear in DOM
 */
export function waitForElement(selector, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Simulate user click event
 */
export function simulateClick(element) {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  element.dispatchEvent(event);
}

/**
 * Simulate user input event
 */
export function simulateInput(element, value) {
  element.value = value;
  const event = new Event('input', {
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
}

/**
 * Simulate user change event
 */
export function simulateChange(element, value) {
  element.value = value;
  const event = new Event('change', {
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
}
