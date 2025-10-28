/**
 * Test Orchestrator
 * 
 * Manages test discovery, loading, filtering, and execution for visual interactive tests.
 * Supports multiple execution modes: interactive, headless, and debug.
 */

const fs = require('fs').promises;
const path = require('path');

class TestOrchestrator {
  constructor(config) {
    this.config = config;
    this.scenarios = [];
    this.results = [];
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Get execution summary statistics
   */
  getSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const duration = this.endTime ? this.endTime - this.startTime : 0;

    return {
      total,
      passed,
      failed,
      skipped,
      duration,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(2) : 0
    };
  }

  /**
   * Reset orchestrator state
   */
  reset() {
    this.scenarios = [];
    this.results = [];
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Discover all test scenario files in the scenarios directory
   * Recursively scans directories and loads test metadata
   * 
   * @param {string} directory - Directory to scan for test files
   * @returns {Promise<Array>} Array of discovered test file paths
   */
  async discoverTests(directory = null) {
    const scenariosDir = directory || path.join(__dirname, 'scenarios');
    const testFiles = [];

    try {
      await this._scanDirectory(scenariosDir, testFiles);
      
      if (this.config.verbose) {
        console.log(`\n📁 Discovered ${testFiles.length} test files`);
      }

      return testFiles;
    } catch (error) {
      console.error(`❌ Error discovering tests: ${error.message}`);
      throw error;
    }
  }

  /**
   * Recursively scan directory for test files
   * 
   * @param {string} dir - Directory to scan
   * @param {Array} testFiles - Array to collect test file paths
   * @private
   */
  async _scanDirectory(dir, testFiles) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          await this._scanDirectory(fullPath, testFiles);
        } else if (entry.isFile() && (entry.name.endsWith('.spec.js') || entry.name.endsWith('.spec.cjs'))) {
          // Found a test file
          testFiles.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist yet, that's okay
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Load test metadata from a scenario file
   * 
   * @param {string} filePath - Path to test scenario file
   * @returns {Promise<Object>} Test metadata
   * @private
   */
  async _loadTestMetadata(filePath) {
    try {
      const scenario = require(filePath);
      
      return {
        filePath,
        name: scenario.name || path.basename(filePath, '.spec.js'),
        description: scenario.description || '',
        tab: scenario.tab || 'unknown',
        tags: scenario.tags || [],
        requirements: scenario.requirements || [],
        estimatedDuration: scenario.estimatedDuration || 5000,
        dependencies: scenario.dependencies || [],
        priority: scenario.priority || 'medium',
        execute: scenario.execute
      };
    } catch (error) {
      console.error(`⚠️  Failed to load test metadata from ${filePath}: ${error.message}`);
      return null;
    }
  }

  /**
   * Load test scenarios with optional filtering
   * 
   * @param {Object} filters - Filter criteria
   * @param {string} filters.tab - Filter by tab name
   * @param {string} filters.test - Filter by test name (partial match)
   * @param {Array<string>} filters.tags - Filter by tags (any match)
   * @param {Array<string>} filters.excludeTags - Exclude tests with these tags
   * @returns {Promise<Array>} Array of loaded test scenarios
   */
  async loadScenarios(filters = {}) {
    // Discover all test files
    const testFiles = await this.discoverTests();

    // Load metadata for all tests
    const scenarios = [];
    for (const filePath of testFiles) {
      const metadata = await this._loadTestMetadata(filePath);
      if (metadata && metadata.execute) {
        scenarios.push(metadata);
      }
    }

    // Apply filters
    let filteredScenarios = scenarios;

    // Validate and apply tab filter
    if (filters.tab) {
      const tabFilter = filters.tab.toLowerCase();
      filteredScenarios = filteredScenarios.filter(s => 
        s.tab && s.tab.toLowerCase() === tabFilter
      );
      
      if (this.config.verbose) {
        console.log(`🔍 Filtered by tab "${filters.tab}": ${filteredScenarios.length} tests`);
      }
    }

    // Validate and apply test name filter
    if (filters.test) {
      const testFilter = filters.test.toLowerCase();
      filteredScenarios = filteredScenarios.filter(s => 
        s.name && s.name.toLowerCase().includes(testFilter)
      );
      
      if (this.config.verbose) {
        console.log(`🔍 Filtered by test name "${filters.test}": ${filteredScenarios.length} tests`);
      }
    }

    // Validate and apply tag filters (include)
    if (filters.tags && filters.tags.length > 0) {
      filteredScenarios = filteredScenarios.filter(s => 
        s.tags && s.tags.some(tag => 
          filters.tags.some(filterTag => 
            tag.toLowerCase() === filterTag.toLowerCase()
          )
        )
      );
      
      if (this.config.verbose) {
        console.log(`🔍 Filtered by tags [${filters.tags.join(', ')}]: ${filteredScenarios.length} tests`);
      }
    }

    // Validate and apply tag filters (exclude)
    if (filters.excludeTags && filters.excludeTags.length > 0) {
      filteredScenarios = filteredScenarios.filter(s => 
        !s.tags || !s.tags.some(tag => 
          filters.excludeTags.some(excludeTag => 
            tag.toLowerCase() === excludeTag.toLowerCase()
          )
        )
      );
      
      if (this.config.verbose) {
        console.log(`🔍 Excluded tags [${filters.excludeTags.join(', ')}]: ${filteredScenarios.length} tests`);
      }
    }

    // Validate filter results
    if (filteredScenarios.length === 0 && scenarios.length > 0) {
      console.warn('⚠️  No tests matched the filter criteria');
    }

    this.scenarios = filteredScenarios;
    return filteredScenarios;
  }

  /**
   * Execute loaded test scenarios
   * 
   * @param {Object} page - Playwright page object
   * @param {Object} helpers - TestHelpers instance
   * @returns {Promise<Array>} Array of test results
   */
  async executeScenarios(page, helpers) {
    this.startTime = Date.now();
    this.results = [];

    if (this.scenarios.length === 0) {
      console.log('⚠️  No scenarios to execute');
      this.endTime = Date.now();
      return this.results;
    }

    console.log(`\n🚀 Executing ${this.scenarios.length} test scenarios\n`);

    for (let i = 0; i < this.scenarios.length; i++) {
      const scenario = this.scenarios[i];
      const result = await this._executeScenario(scenario, page, helpers, i + 1);
      this.results.push(result);

      // Display progress
      const summary = this.getSummary();
      console.log(`\n📊 Progress: ${i + 1}/${this.scenarios.length} | ✓ ${summary.passed} | ✗ ${summary.failed} | ⊘ ${summary.skipped}\n`);

      // Stop on first failure if failFast is enabled
      if (this.config.failFast && result.status === 'failed') {
        console.log('🛑 Stopping execution due to test failure (failFast enabled)');
        break;
      }
    }

    this.endTime = Date.now();
    return this.results;
  }

  /**
   * Execute a single test scenario
   * 
   * @param {Object} scenario - Test scenario metadata
   * @param {Object} page - Playwright page object
   * @param {Object} helpers - TestHelpers instance
   * @param {number} index - Test index for display
   * @returns {Promise<Object>} Test result
   * @private
   */
  async _executeScenario(scenario, page, helpers, index) {
    const startTime = Date.now();
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📝 Test ${index}: ${scenario.name}`);
    console.log(`   Tab: ${scenario.tab} | Tags: [${scenario.tags.join(', ')}]`);
    console.log(`   ${scenario.description}`);
    console.log(`${'='.repeat(80)}\n`);

    const result = {
      name: scenario.name,
      description: scenario.description,
      tab: scenario.tab,
      tags: scenario.tags,
      status: 'passed',
      duration: 0,
      startTime: new Date(startTime).toISOString(),
      endTime: null,
      screenshots: [],
      videos: [],
      consoleErrors: [],
      assertions: [],
      error: null
    };

    try {
      // Setup: Clear console errors before test
      helpers.clearConsoleErrors();

      // Execute the test scenario
      const scenarioResult = await scenario.execute(page, helpers);

      // Collect results from scenario
      if (scenarioResult) {
        result.screenshots = scenarioResult.screenshots || helpers.screenshots || [];
        result.assertions = scenarioResult.assertions || [];
      }

      // Collect console errors
      result.consoleErrors = helpers.getConsoleErrors();

      // Check if test passed
      if (scenarioResult && scenarioResult.passed === false) {
        result.status = 'failed';
        result.error = scenarioResult.error || 'Test returned passed: false';
      } else if (result.consoleErrors.some(e => e.type === 'error')) {
        // Consider test failed if critical console errors occurred
        result.status = 'failed';
        result.error = 'Critical JavaScript errors detected';
      }

      console.log(`\n✅ Test passed: ${scenario.name}`);

    } catch (error) {
      result.status = 'failed';
      result.error = {
        message: error.message,
        stack: error.stack
      };

      console.error(`\n❌ Test failed: ${scenario.name}`);
      console.error(`   Error: ${error.message}`);

      // Take failure screenshot
      try {
        const screenshotName = `${scenario.name.replace(/\s+/g, '-')}-failure`;
        await helpers.takeScreenshot(screenshotName);
        result.screenshots.push(screenshotName);
      } catch (screenshotError) {
        console.error(`   Failed to capture failure screenshot: ${screenshotError.message}`);
      }

      // Collect console errors
      result.consoleErrors = helpers.getConsoleErrors();
    }

    // Teardown: Calculate duration
    const endTime = Date.now();
    result.duration = endTime - startTime;
    result.endTime = new Date(endTime).toISOString();

    console.log(`   Duration: ${(result.duration / 1000).toFixed(2)}s`);

    return result;
  }

  /**
   * Run tests in interactive mode
   * Includes slow motion delays and visual pauses for inspection
   * 
   * @param {Object} page - Playwright page object
   * @param {Object} helpers - TestHelpers instance
   * @returns {Promise<Array>} Array of test results
   */
  async runInteractive(page, helpers) {
    console.log('\n🎭 Running in INTERACTIVE mode');
    console.log('   - Browser window visible');
    console.log('   - Slow motion enabled');
    console.log('   - Visual pauses for inspection');
    console.log('   - Detailed progress information\n');

    // Set slow motion delay if configured
    if (this.config.slowMo && this.config.slowMo > 0) {
      console.log(`⏱️  Slow motion delay: ${this.config.slowMo}ms between actions\n`);
    }

    // Execute scenarios with interactive enhancements
    const originalExecute = this._executeScenario.bind(this);
    this._executeScenario = async (scenario, page, helpers, index) => {
      // Add visual pause before test
      if (this.config.pauseBeforeTest) {
        console.log(`\n⏸️  Pausing before test. Press Enter to continue...`);
        await helpers.pauseForInspection('Ready to start test?');
      }

      // Execute the test
      const result = await originalExecute(scenario, page, helpers, index);

      // Add visual pause after test for inspection
      if (this.config.pauseAfterTest) {
        console.log(`\n⏸️  Test complete. Inspect the results. Press Enter to continue...`);
        await helpers.pauseForInspection('Ready for next test?');
      } else {
        // Add automatic delay for visual inspection
        const inspectionDelay = this.config.inspectionDelay || 2000;
        console.log(`\n👀 Pausing ${inspectionDelay}ms for visual inspection...`);
        await helpers.pause(inspectionDelay);
      }

      // Pause on failure if configured
      if (result.status === 'failed' && this.config.pauseOnFailure) {
        console.log(`\n🛑 Test failed. Pausing for inspection. Press Enter to continue...`);
        await helpers.pauseForInspection('Inspect failure and continue?');
      }

      return result;
    };

    // Execute all scenarios
    return await this.executeScenarios(page, helpers);
  }

  /**
   * Run tests in headless mode
   * Optimized for speed with minimal logging
   * 
   * @param {Object} page - Playwright page object
   * @param {Object} helpers - TestHelpers instance
   * @returns {Promise<Array>} Array of test results
   */
  async runHeadless(page, helpers) {
    console.log('\n🤖 Running in HEADLESS mode');
    console.log('   - No browser window');
    console.log('   - Fast execution');
    console.log('   - Minimal logging\n');

    // Disable verbose logging for speed
    const originalVerbose = this.config.verbose;
    this.config.verbose = false;

    // Execute scenarios
    const results = await this.executeScenarios(page, helpers);

    // Restore verbose setting
    this.config.verbose = originalVerbose;

    return results;
  }

  /**
   * Run tests in debug mode
   * Step-by-step execution with verbose logging
   * 
   * @param {Object} page - Playwright page object
   * @param {Object} helpers - TestHelpers instance
   * @returns {Promise<Array>} Array of test results
   */
  async runDebug(page, helpers) {
    console.log('\n🐛 Running in DEBUG mode');
    console.log('   - Browser window visible');
    console.log('   - Step-by-step execution');
    console.log('   - Verbose logging');
    console.log('   - Console error highlighting\n');

    // Enable verbose logging
    this.config.verbose = true;

    // Execute scenarios with debug enhancements
    const originalExecute = this._executeScenario.bind(this);
    this._executeScenario = async (scenario, page, helpers, index) => {
      console.log(`\n🔍 DEBUG: Starting test "${scenario.name}"`);
      console.log(`   File: ${scenario.filePath}`);
      console.log(`   Requirements: [${scenario.requirements.join(', ')}]`);
      console.log(`   Dependencies: [${scenario.dependencies.join(', ')}]`);
      console.log(`   Estimated duration: ${scenario.estimatedDuration}ms\n`);

      // Pause before test
      console.log(`⏸️  Press Enter to start test...`);
      await helpers.pauseForInspection('Start test?');

      // Execute the test
      const result = await originalExecute(scenario, page, helpers, index);

      // Display detailed results
      console.log(`\n📋 DEBUG: Test Results`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Duration: ${result.duration}ms`);
      console.log(`   Screenshots: ${result.screenshots.length}`);
      console.log(`   Console Errors: ${result.consoleErrors.length}`);
      console.log(`   Assertions: ${result.assertions.length}`);

      // Highlight console errors
      if (result.consoleErrors.length > 0) {
        console.log(`\n⚠️  Console Errors Detected:`);
        result.consoleErrors.forEach((error, i) => {
          console.log(`   ${i + 1}. [${error.type}] ${error.message}`);
          if (error.stack) {
            console.log(`      ${error.stack.split('\n')[0]}`);
          }
        });
      }

      // Display error details if failed
      if (result.status === 'failed' && result.error) {
        console.log(`\n❌ Error Details:`);
        if (typeof result.error === 'string') {
          console.log(`   ${result.error}`);
        } else {
          console.log(`   Message: ${result.error.message}`);
          if (result.error.stack) {
            console.log(`   Stack: ${result.error.stack.split('\n').slice(0, 3).join('\n   ')}`);
          }
        }
      }

      // Pause after test
      console.log(`\n⏸️  Press Enter to continue to next test...`);
      await helpers.pauseForInspection('Continue?');

      return result;
    };

    // Execute all scenarios
    return await this.executeScenarios(page, helpers);
  }
}

module.exports = TestOrchestrator;
