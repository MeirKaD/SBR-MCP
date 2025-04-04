import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { Tool } from './tool.js';

// Take screenshot
const screenshotSchema = z.object({
  fullPage: z.boolean().optional().describe('Whether to take a screenshot of the full page (default: true)')
});

export const screenshot: Tool = {
  schema: {
    name: 'browser_screenshot',
    description: 'Take a screenshot of the current page',
    inputSchema: zodToJsonSchema(screenshotSchema)
  },
  handle: async (context, params) => {
    const { fullPage = true } = screenshotSchema.parse(params || {});
    const page = await context.getPage();
    
    try {
      const buffer = await page.screenshot({ fullPage });
      
      return {
        content: [{
          type: 'image',
          data: buffer.toString('base64'),
          mimeType: 'image/png'
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error taking screenshot: ${error}`
        }],
        isError: true
      };
    }
  }
};

// Get page HTML
export const getHtml: Tool = {
  schema: {
    name: 'browser_get_html',
    description: 'Get the HTML content of the current page',
    inputSchema: zodToJsonSchema(z.object({}))
  },
  handle: async (context) => {
    const page = await context.getPage();
    
    try {
      const html = await page.content();
      
      return {
        content: [{
          type: 'text',
          text: html
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting HTML content: ${error}`
        }],
        isError: true
      };
    }
  }
};

// Export all snapshot tools
export const snapshot = [screenshot, getHtml];