#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { chromium } from 'playwright';

class PlaywrightMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'mase-playwright-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.browsers = new Map();
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'launch_browser',
          description: 'Launch a browser instance',
          inputSchema: {
            type: 'object',
            properties: {
              headless: { type: 'boolean', default: true }
            }
          }
        },
        {
          name: 'navigate',
          description: 'Navigate to a URL',
          inputSchema: {
            type: 'object',
            properties: {
              url: { type: 'string' },
              waitUntil: { type: 'string', enum: ['load', 'domcontentloaded', 'networkidle'], default: 'load' }
            },
            required: ['url']
          }
        },
        {
          name: 'screenshot',
          description: 'Take a screenshot',
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string' },
              fullPage: { type: 'boolean', default: false },
              selector: { type: 'string' }
            }
          }
        },
        {
          name: 'click',
          description: 'Click an element',
          inputSchema: {
            type: 'object',
            properties: {
              selector: { type: 'string' }
            },
            required: ['selector']
          }
        },
        {
          name: 'type',
          description: 'Type text into an element',
          inputSchema: {
            type: 'object',
            properties: {
              selector: { type: 'string' },
              text: { type: 'string' }
            },
            required: ['selector', 'text']
          }
        },
        {
          name: 'wait_for_selector',
          description: 'Wait for an element to appear',
          inputSchema: {
            type: 'object',
            properties: {
              selector: { type: 'string' },
              timeout: { type: 'number', default: 30000 }
            },
            required: ['selector']
          }
        },
        {
          name: 'evaluate',
          description: 'Execute JavaScript in the page',
          inputSchema: {
            type: 'object',
            properties: {
              script: { type: 'string' }
            },
            required: ['script']
          }
        },
        {
          name: 'close_browser',
          description: 'Close the browser instance',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'launch_browser':
            return await this.launchBrowser(args);
          case 'navigate':
            return await this.navigate(args);
          case 'screenshot':
            return await this.screenshot(args);
          case 'click':
            return await this.click(args);
          case 'type':
            return await this.type(args);
          case 'wait_for_selector':
            return await this.waitForSelector(args);
          case 'evaluate':
            return await this.evaluate(args);
          case 'close_browser':
            return await this.closeBrowser();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ]
        };
      }
    });
  }

  async launchBrowser(args) {
    const { headless = true } = args;
    
    const browserInstance = await chromium.launch({ headless });
    const context = await browserInstance.newContext();
    const page = await context.newPage();

    this.browsers.set('current', { browser: browserInstance, context, page });

    return {
      content: [
        {
          type: 'text',
          text: 'Browser launched successfully'
        }
      ]
    };
  }

  async navigate(args) {
    const { url, waitUntil = 'load' } = args;
    const current = this.browsers.get('current');
    
    if (!current) {
      throw new Error('No browser instance found. Launch a browser first.');
    }

    await current.page.goto(url, { waitUntil });

    return {
      content: [
        {
          type: 'text',
          text: `Navigated to ${url}`
        }
      ]
    };
  }

  async screenshot(args) {
    const { path, fullPage = false, selector } = args;
    const current = this.browsers.get('current');
    
    if (!current) {
      throw new Error('No browser instance found. Launch a browser first.');
    }

    let screenshotOptions = { path, fullPage };
    
    if (selector) {
      const element = await current.page.locator(selector);
      await element.screenshot({ path });
    } else {
      await current.page.screenshot(screenshotOptions);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Screenshot saved to ${path}`
        }
      ]
    };
  }

  async click(args) {
    const { selector } = args;
    const current = this.browsers.get('current');
    
    if (!current) {
      throw new Error('No browser instance found. Launch a browser first.');
    }

    await current.page.click(selector);

    return {
      content: [
        {
          type: 'text',
          text: `Clicked element: ${selector}`
        }
      ]
    };
  }

  async type(args) {
    const { selector, text } = args;
    const current = this.browsers.get('current');
    
    if (!current) {
      throw new Error('No browser instance found. Launch a browser first.');
    }

    await current.page.fill(selector, text);

    return {
      content: [
        {
          type: 'text',
          text: `Typed "${text}" into ${selector}`
        }
      ]
    };
  }

  async waitForSelector(args) {
    const { selector, timeout = 30000 } = args;
    const current = this.browsers.get('current');
    
    if (!current) {
      throw new Error('No browser instance found. Launch a browser first.');
    }

    await current.page.waitForSelector(selector, { timeout });

    return {
      content: [
        {
          type: 'text',
          text: `Element found: ${selector}`
        }
      ]
    };
  }

  async evaluate(args) {
    const { script } = args;
    const current = this.browsers.get('current');
    
    if (!current) {
      throw new Error('No browser instance found. Launch a browser first.');
    }

    const result = await current.page.evaluate(script);

    return {
      content: [
        {
          type: 'text',
          text: `Script result: ${JSON.stringify(result)}`
        }
      ]
    };
  }

  async closeBrowser() {
    const current = this.browsers.get('current');
    
    if (!current) {
      throw new Error('No browser instance found.');
    }

    await current.browser.close();
    this.browsers.delete('current');

    return {
      content: [
        {
          type: 'text',
          text: 'Browser closed successfully'
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new PlaywrightMCPServer();
server.run().catch(console.error);