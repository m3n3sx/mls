/**
 * Test Utilities Index
 * 
 * Central export point for all test utilities
 */

// WordPress API Mocks
export {
  mockSettings,
  mockTemplates,
  mockPalettes,
  createMockAPIClient,
  createMockAPIClientWithErrors,
  mockWordPressRestAPI,
  resetAPIMocks,
} from './wordpress-api-mocks.js';

// DOM Fixtures
export {
  createMASEAdminWrapper,
  createColorPicker,
  createPaletteCard,
  createTemplateCard,
  createToggleSwitch,
  createSlider,
  createNotice,
  createWordPressAdminBar,
  createWordPressAdminMenu,
  createNonceInput,
  setupMASEAdminPage,
  cleanupDOM,
  waitForElement,
  simulateClick,
  simulateInput,
  simulateChange,
} from './dom-fixtures.js';

// Test Data Generators
export {
  generateRandomColor,
  generateRandomSettings,
  generateTemplate,
  generatePalette,
  generateTemplates,
  generatePalettes,
  generateColorScheme,
  generateTypographySettings,
  generateEffectsSettings,
  generateAPIResponse,
  generateAPIError,
  generateStateHistory,
  generateCSS,
  generateCSSProperties,
  generateEventData,
  generateUserAction,
  generatePerformanceMetrics,
  generateAccessibilityReport,
  generateWordPressUser,
  generateNonce,
} from './test-data-generators.js';
