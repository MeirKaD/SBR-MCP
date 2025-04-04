import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { Tool } from './tool.js';

// Navigate to URL
const navigateSchema = z.object({
  url: z.string().describe('The URL to navigate to')
});

export const navigate: Tool = {
  schema: {
    name: 'browser_navigate',
    description: 'Navigate to a URL',
    inputSchema: zodToJsonSchema(navigateSchema)
  },
  handle: async (context, params) => {
    const { url } = navigateSchema.parse(params);
    const page = await context.getPage();
    
    try {
      await page.goto(url, { timeout: 120000, waitUntil: 'domcontentloaded' });
      
      return {
        content: [{
          type: 'text',
          text: `Successfully navigated to ${url}\nTitle: ${await page.title()}\nURL: ${page.url()}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error navigating to ${url}: ${error}`
        }],
        isError: true
      };
    }
  }
};

// Go back
export const goBack: Tool = {
  schema: {
    name: 'browser_go_back',
    description: 'Go back to the previous page',
    inputSchema: zodToJsonSchema(z.object({}))
  },
  handle: async (context) => {
    const page = await context.getPage();
    
    try {
      await page.goBack();
      
      return {
        content: [{
          type: 'text',
          text: `Successfully navigated back\nTitle: ${await page.title()}\nURL: ${page.url()}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error navigating back: ${error}`
        }],
        isError: true
      };
    }
  }
};

// Go forward
export const goForward: Tool = {
  schema: {
    name: 'browser_go_forward',
    description: 'Go forward to the next page',
    inputSchema: zodToJsonSchema(z.object({}))
  },
  handle: async (context) => {
    const page = await context.getPage();
    
    try {
      await page.goForward();
      
      return {
        content: [{
          type: 'text',
          text: `Successfully navigated forward\nTitle: ${await page.title()}\nURL: ${page.url()}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error navigating forward: ${error}`
        }],
        isError: true
      };
    }
  }
};

// Export all navigation tools
export const navigation = [navigate, goBack, goForward];