# MASE MCP Playwright Server

MCP (Model Context Protocol) server providing Playwright browser automation capabilities for MASE visual testing.

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Start server
npm start
```

## Available Tools

- `launch_browser` - Launch browser instance (chromium/firefox/webkit)
- `navigate` - Navigate to URL
- `screenshot` - Take screenshots
- `click` - Click elements
- `type` - Type text into inputs
- `wait_for_selector` - Wait for elements
- `evaluate` - Execute JavaScript
- `close_browser` - Close browser

## Usage with MCP Client

Configure in your MCP client:

```json
{
  "servers": {
    "mase-playwright": {
      "command": "node",
      "args": ["/path/to/mcp-server/server.js"]
    }
  }
}
```

## MASE Integration

Perfect for automated testing of MASE admin interface:

```javascript
// Launch browser
await launch_browser({ browser: "chromium", headless: false });

// Navigate to WordPress admin
await navigate({ url: "http://localhost/wp-admin" });

// Test MASE settings
await click({ selector: "#mase-palette-professional-blue" });
await screenshot({ path: "palette-test.png" });
```