/**
 * ReportGenerator Class
 * 
 * Generates comprehensive HTML reports for visual interactive test results.
 * Includes screenshots, videos, console logs, and summary statistics.
 */

const fs = require('fs').promises;
const path = require('path');

class ReportGenerator {
  /**
   * Constructor
   * @param {Array} results - Array of test result objects
   * @param {Object} config - Test configuration object
   */
  constructor(results, config) {
    this.results = results;
    this.config = config;
    this.reportPath = null;
    this.summary = this.calculateSummary();
  }

  /**
   * Calculate summary statistics from test results
   * @returns {Object} Summary statistics
   */
  calculateSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    
    // Calculate total duration
    const totalDuration = this.results.reduce((sum, r) => sum + (r.duration || 0), 0);
    
    // Group results by tab/category
    const byTab = {};
    this.results.forEach(result => {
      const tab = result.tab || 'unknown';
      if (!byTab[tab]) {
        byTab[tab] = {
          total: 0,
          passed: 0,
          failed: 0,
          skipped: 0,
          tests: []
        };
      }
      byTab[tab].total++;
      byTab[tab][result.status]++;
      byTab[tab].tests.push(result);
    });

    return {
      total,
      passed,
      failed,
      skipped,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(2) : 0,
      duration: totalDuration,
      byTab,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate complete HTML report
   * @returns {Promise<string>} Path to generated report
   */
  async generateReport() {
    try {
      // Ensure report directory exists
      await fs.mkdir(this.config.output.reportDir, { recursive: true });

      // Generate HTML content
      const html = await this.buildHTML();

      // Write report file
      this.reportPath = path.join(
        this.config.output.reportDir,
        this.config.output.reportFile
      );
      await fs.writeFile(this.reportPath, html, 'utf8');

      return this.reportPath;
    } catch (error) {
      throw new Error(`Failed to generate report: ${error.message}`);
    }
  }

  /**
   * Build complete HTML document
   * @returns {Promise<string>} HTML content
   * @private
   */
  async buildHTML() {
    const styles = this.getStyles();
    const scripts = this.getScripts();
    const header = this.buildHeader();
    const navigation = this.buildNavigation();
    const summarySection = this.buildSummarySection();
    const testResults = await this.buildTestResults();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MASE Visual Interactive Test Report</title>
  <style>${styles}</style>
</head>
<body>
  ${header}
  ${navigation}
  <main class="container">
    ${summarySection}
    ${testResults}
  </main>
  <script>${scripts}</script>
</body>
</html>`;
  }

  /**
   * Get CSS styles for the report
   * @returns {string} CSS content
   * @private
   */
  getStyles() {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.6;
        color: #333;
        background: #f5f5f5;
      }

      .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px;
      }

      /* Header */
      header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      header h1 {
        font-size: 2.5em;
        margin-bottom: 10px;
        text-align: center;
      }

      header .subtitle {
        text-align: center;
        opacity: 0.9;
        font-size: 1.1em;
      }

      /* Summary */
      .summary {
        background: white;
        border-radius: 8px;
        padding: 30px;
        margin: 30px 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .summary h2 {
        margin-bottom: 20px;
        color: #667eea;
        border-bottom: 2px solid #667eea;
        padding-bottom: 10px;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .stat-card {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        border-left: 4px solid #667eea;
      }

      .stat-card.passed {
        border-left-color: #28a745;
      }

      .stat-card.failed {
        border-left-color: #dc3545;
      }

      .stat-card.skipped {
        border-left-color: #ffc107;
      }

      .stat-value {
        font-size: 2.5em;
        font-weight: bold;
        margin: 10px 0;
      }

      .stat-label {
        color: #666;
        font-size: 0.9em;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      /* Navigation */
      nav {
        background: white;
        padding: 15px 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .nav-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
      }

      .nav-tab {
        padding: 10px 20px;
        background: #f8f9fa;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 0.9em;
      }

      .nav-tab:hover {
        background: #e9ecef;
      }

      .nav-tab.active {
        background: #667eea;
        color: white;
      }

      .nav-tab .badge {
        display: inline-block;
        margin-left: 5px;
        padding: 2px 8px;
        background: rgba(0,0,0,0.1);
        border-radius: 10px;
        font-size: 0.85em;
      }

      /* Test Results */
      .test-category {
        background: white;
        border-radius: 8px;
        padding: 30px;
        margin: 20px 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        display: none;
      }

      .test-category.active {
        display: block;
      }

      .test-category h2 {
        color: #667eea;
        margin-bottom: 20px;
        border-bottom: 2px solid #667eea;
        padding-bottom: 10px;
      }

      .test-result {
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
        margin: 15px 0;
        transition: all 0.3s;
      }

      .test-result:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .test-result.passed {
        border-left: 4px solid #28a745;
      }

      .test-result.failed {
        border-left: 4px solid #dc3545;
        background: #fff5f5;
      }

      .test-result.skipped {
        border-left: 4px solid #ffc107;
      }

      .test-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .test-title {
        font-size: 1.3em;
        font-weight: bold;
      }

      .test-title .status-icon {
        margin-right: 10px;
      }

      .test-meta {
        display: flex;
        gap: 15px;
        color: #666;
        font-size: 0.9em;
        margin-bottom: 15px;
      }

      .test-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .test-description {
        color: #666;
        margin-bottom: 15px;
        font-style: italic;
      }

      .test-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 15px;
      }

      .tag {
        padding: 4px 12px;
        background: #e9ecef;
        border-radius: 12px;
        font-size: 0.85em;
        color: #495057;
      }

      /* Error Details */
      .error-details {
        background: #fff5f5;
        border: 1px solid #dc3545;
        border-radius: 5px;
        padding: 15px;
        margin: 15px 0;
      }

      .error-details h4 {
        color: #dc3545;
        margin-bottom: 10px;
      }

      .error-message {
        font-family: 'Courier New', monospace;
        background: white;
        padding: 10px;
        border-radius: 3px;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .error-stack {
        font-family: 'Courier New', monospace;
        font-size: 0.85em;
        color: #666;
        margin-top: 10px;
        padding: 10px;
        background: white;
        border-radius: 3px;
        overflow-x: auto;
      }

      /* Console Errors */
      .console-errors {
        background: #fff9e6;
        border: 1px solid #ffc107;
        border-radius: 5px;
        padding: 15px;
        margin: 15px 0;
      }

      .console-errors h4 {
        color: #856404;
        margin-bottom: 10px;
      }

      .console-error {
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
        padding: 8px;
        margin: 5px 0;
        background: white;
        border-radius: 3px;
        border-left: 3px solid #ffc107;
      }

      .console-error.error {
        border-left-color: #dc3545;
      }

      .console-error .timestamp {
        color: #666;
        font-size: 0.85em;
      }

      /* Screenshots */
      .screenshots {
        margin: 20px 0;
      }

      .screenshots h4 {
        margin-bottom: 15px;
        color: #495057;
      }

      .screenshot-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
      }

      .screenshot-item {
        border: 1px solid #dee2e6;
        border-radius: 5px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s;
      }

      .screenshot-item:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateY(-2px);
      }

      .screenshot-item img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        display: block;
      }

      .screenshot-caption {
        padding: 10px;
        background: #f8f9fa;
        font-size: 0.85em;
        text-align: center;
      }

      /* Videos */
      .videos {
        margin: 20px 0;
      }

      .videos h4 {
        margin-bottom: 15px;
        color: #495057;
      }

      .video-player {
        width: 100%;
        max-width: 800px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      /* Modal for full-size screenshots */
      .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 1000;
        justify-content: center;
        align-items: center;
      }

      .modal.active {
        display: flex;
      }

      .modal-content {
        max-width: 90%;
        max-height: 90%;
        position: relative;
      }

      .modal-content img {
        max-width: 100%;
        max-height: 90vh;
        border-radius: 5px;
      }

      .modal-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2em;
        cursor: pointer;
        background: none;
        border: none;
        padding: 10px;
      }

      /* Responsive */
      @media (max-width: 768px) {
        header h1 {
          font-size: 1.8em;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }

        .nav-tabs {
          flex-direction: column;
        }

        .screenshot-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Utilities */
      .text-success { color: #28a745; }
      .text-danger { color: #dc3545; }
      .text-warning { color: #ffc107; }
      .text-muted { color: #6c757d; }

      .mb-2 { margin-bottom: 10px; }
      .mb-3 { margin-bottom: 15px; }
      .mt-2 { margin-top: 10px; }
      .mt-3 { margin-top: 15px; }
    `;
  }

  /**
   * Get JavaScript for interactive features
   * @returns {string} JavaScript content
   * @private
   */
  getScripts() {
    return `
      // Tab navigation
      document.addEventListener('DOMContentLoaded', function() {
        const tabs = document.querySelectorAll('.nav-tab');
        const categories = document.querySelectorAll('.test-category');

        // Show all tests by default
        document.getElementById('all-tests').classList.add('active');
        categories.forEach(cat => cat.classList.add('active'));

        tabs.forEach(tab => {
          tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show/hide categories
            if (targetTab === 'all') {
              categories.forEach(cat => cat.classList.add('active'));
            } else {
              categories.forEach(cat => {
                if (cat.dataset.category === targetTab) {
                  cat.classList.add('active');
                } else {
                  cat.classList.remove('active');
                }
              });
            }
          });
        });

        // Screenshot modal
        const modal = document.getElementById('screenshot-modal');
        const modalImg = document.getElementById('modal-image');
        const closeBtn = document.querySelector('.modal-close');

        document.querySelectorAll('.screenshot-item').forEach(item => {
          item.addEventListener('click', function() {
            const img = this.querySelector('img');
            modalImg.src = img.src;
            modal.classList.add('active');
          });
        });

        if (closeBtn) {
          closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
          });
        }

        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            modal.classList.remove('active');
          }
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
          }
        });
      });
    `;
  }

  /**
   * Build header section
   * @returns {string} HTML content
   * @private
   */
  buildHeader() {
    const date = new Date(this.summary.timestamp);
    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <header>
        <h1>🎨 MASE Visual Interactive Test Report</h1>
        <div class="subtitle">
          Generated on ${formattedDate}
        </div>
      </header>
    `;
  }

  /**
   * Build navigation section
   * @returns {string} HTML content
   * @private
   */
  buildNavigation() {
    const tabs = Object.keys(this.summary.byTab).sort();
    
    const tabButtons = tabs.map(tab => {
      const tabData = this.summary.byTab[tab];
      const displayName = tab.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      return `
        <button class="nav-tab" data-tab="${tab}">
          ${displayName}
          <span class="badge">${tabData.passed}/${tabData.total}</span>
        </button>
      `;
    }).join('');

    return `
      <nav>
        <div class="nav-tabs">
          <button class="nav-tab active" data-tab="all" id="all-tests">
            All Tests
            <span class="badge">${this.summary.passed}/${this.summary.total}</span>
          </button>
          ${tabButtons}
        </div>
      </nav>
    `;
  }

  /**
   * Build summary section
   * @returns {string} HTML content
   * @private
   */
  buildSummarySection() {
    const durationSeconds = (this.summary.duration / 1000).toFixed(2);
    const durationMinutes = (this.summary.duration / 60000).toFixed(2);

    return `
      <section class="summary">
        <h2>📊 Test Execution Summary</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Tests</div>
            <div class="stat-value">${this.summary.total}</div>
          </div>
          <div class="stat-card passed">
            <div class="stat-label">Passed</div>
            <div class="stat-value text-success">${this.summary.passed}</div>
          </div>
          <div class="stat-card failed">
            <div class="stat-label">Failed</div>
            <div class="stat-value text-danger">${this.summary.failed}</div>
          </div>
          <div class="stat-card skipped">
            <div class="stat-label">Skipped</div>
            <div class="stat-value text-warning">${this.summary.skipped}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Pass Rate</div>
            <div class="stat-value">${this.summary.passRate}%</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Duration</div>
            <div class="stat-value">${durationMinutes}m</div>
            <div class="stat-label">${durationSeconds}s</div>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Build test results section
   * @returns {Promise<string>} HTML content
   * @private
   */
  async buildTestResults() {
    const categories = Object.keys(this.summary.byTab).sort();
    
    const categoryHTML = await Promise.all(
      categories.map(async tab => {
        const tabData = this.summary.byTab[tab];
        const displayName = tab.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        const testsHTML = await Promise.all(
          tabData.tests.map(test => this.buildTestResult(test))
        );

        return `
          <section class="test-category" data-category="${tab}">
            <h2>${displayName} Tests</h2>
            <div class="test-meta">
              <span>✅ Passed: ${tabData.passed}</span>
              <span>❌ Failed: ${tabData.failed}</span>
              <span>⊘ Skipped: ${tabData.skipped}</span>
            </div>
            ${testsHTML.join('')}
          </section>
        `;
      })
    );

    // Add modal for full-size screenshots
    const modal = `
      <div id="screenshot-modal" class="modal">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <img id="modal-image" src="" alt="Full size screenshot">
        </div>
      </div>
    `;

    return categoryHTML.join('') + modal;
  }

  /**
   * Build individual test result
   * @param {Object} test - Test result object
   * @returns {Promise<string>} HTML content
   * @private
   */
  async buildTestResult(test) {
    const statusIcon = {
      passed: '✅',
      failed: '❌',
      skipped: '⊘'
    }[test.status] || '?';

    const durationSeconds = ((test.duration || 0) / 1000).toFixed(2);

    const tagsHTML = test.tags && test.tags.length > 0
      ? `<div class="test-tags">${test.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
      : '';

    const errorHTML = test.error ? await this.buildErrorDetails(test.error) : '';
    const consoleErrorsHTML = test.consoleErrors && test.consoleErrors.length > 0
      ? await this.buildConsoleErrors(test.consoleErrors)
      : '';
    const screenshotsHTML = test.screenshots && test.screenshots.length > 0
      ? await this.buildScreenshots(test.screenshots, test.name)
      : '';
    const videosHTML = test.videos && test.videos.length > 0
      ? await this.buildVideos(test.videos)
      : '';

    return `
      <article class="test-result ${test.status}">
        <div class="test-header">
          <div class="test-title">
            <span class="status-icon">${statusIcon}</span>
            ${test.name}
          </div>
        </div>
        <div class="test-meta">
          <span>⏱️ ${durationSeconds}s</span>
          ${test.screenshots ? `<span>📸 ${test.screenshots.length} screenshots</span>` : ''}
          ${test.consoleErrors ? `<span>⚠️ ${test.consoleErrors.length} console errors</span>` : ''}
        </div>
        ${test.description ? `<div class="test-description">${test.description}</div>` : ''}
        ${tagsHTML}
        ${errorHTML}
        ${consoleErrorsHTML}
        ${screenshotsHTML}
        ${videosHTML}
      </article>
    `;
  }

  /**
   * Build error details section
   * @param {Object|string} error - Error object or message
   * @returns {Promise<string>} HTML content
   * @private
   */
  async buildErrorDetails(error) {
    const message = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'object' && error.stack ? error.stack : '';

    return `
      <div class="error-details">
        <h4>❌ Error Details</h4>
        <div class="error-message">${this.escapeHTML(message)}</div>
        ${stack ? `<div class="error-stack">${this.escapeHTML(stack)}</div>` : ''}
      </div>
    `;
  }

  /**
   * Build console errors section
   * @param {Array} consoleErrors - Array of console error objects
   * @returns {Promise<string>} HTML content
   * @private
   */
  async buildConsoleErrors(consoleErrors) {
    const errorsHTML = consoleErrors.map(error => {
      const timestamp = new Date(error.timestamp).toLocaleTimeString();
      const typeClass = error.type === 'error' ? 'error' : 'warning';
      
      return `
        <div class="console-error ${typeClass}">
          <div><strong>[${error.type.toUpperCase()}]</strong> ${this.escapeHTML(error.message)}</div>
          <div class="timestamp">${timestamp}</div>
          ${error.stack ? `<div class="mt-2">${this.escapeHTML(error.stack.split('\n').slice(0, 2).join('\n'))}</div>` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="console-errors">
        <h4>⚠️ Console Errors (${consoleErrors.length})</h4>
        ${errorsHTML}
      </div>
    `;
  }

  /**
   * Build screenshots section
   * @param {Array} screenshots - Array of screenshot objects or paths
   * @param {string} testName - Test name for context
   * @returns {Promise<string>} HTML content
   * @private
   */
  async buildScreenshots(screenshots, testName) {
    // Screenshots can be objects with {name, path, timestamp} or just paths
    const screenshotItems = screenshots.map((screenshot, index) => {
      const screenshotPath = typeof screenshot === 'string' ? screenshot : screenshot.path;
      const screenshotName = typeof screenshot === 'object' && screenshot.name 
        ? screenshot.name 
        : `Screenshot ${index + 1}`;
      
      // Convert absolute path to relative path for HTML
      const relativePath = this.getRelativePath(screenshotPath);

      return `
        <div class="screenshot-item">
          <img src="${relativePath}" alt="${screenshotName}" loading="lazy">
          <div class="screenshot-caption">${screenshotName}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="screenshots">
        <h4>📸 Screenshots (${screenshots.length})</h4>
        <div class="screenshot-grid">
          ${screenshotItems}
        </div>
      </div>
    `;
  }

  /**
   * Build videos section
   * @param {Array} videos - Array of video objects or paths
   * @returns {Promise<string>} HTML content
   * @private
   */
  async buildVideos(videos) {
    const videoItems = videos.map((video, index) => {
      const videoPath = typeof video === 'string' ? video : video.path;
      const relativePath = this.getRelativePath(videoPath);

      return `
        <div class="mb-3">
          <video class="video-player" controls>
            <source src="${relativePath}" type="video/webm">
            <source src="${relativePath}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    }).join('');

    return `
      <div class="videos">
        <h4>🎥 Video Recording</h4>
        ${videoItems}
      </div>
    `;
  }

  /**
   * Get relative path from report directory to resource
   * @param {string} absolutePath - Absolute path to resource
   * @returns {string} Relative path
   * @private
   */
  getRelativePath(absolutePath) {
    if (!absolutePath) return '';
    
    // If already relative, return as-is
    if (!path.isAbsolute(absolutePath)) {
      return absolutePath;
    }

    // Calculate relative path from report directory
    const reportDir = this.config.output.reportDir;
    const relativePath = path.relative(reportDir, absolutePath);
    
    // Convert to forward slashes for HTML
    return relativePath.split(path.sep).join('/');
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   * @private
   */
  escapeHTML(text) {
    if (!text) return '';
    
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }
}

module.exports = ReportGenerator;
