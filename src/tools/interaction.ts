import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { Tool } from './tool.js';

// Click on element
const clickSchema = z.object({
  selector: z.string().describe('CSS selector for the element to click')
});

export const click: Tool = {
  schema: {
    name: 'browser_click',
    description: 'Click on an element',
    inputSchema: zodToJsonSchema(clickSchema)
  },
  handle: async (context, params) => {
    const { selector } = clickSchema.parse(params);
    const page = await context.getPage();
    
    try {
      await page.click(selector);
      
      return {
        content: [{
          type: 'text',
          text: `Successfully clicked element: ${selector}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error clicking element ${selector}: ${error}`
        }],
        isError: true
      };
    }
  }
};

// Type text
const typeSchema = z.object({
  selector: z.string().describe('CSS selector for the element to type into'),
  text: z.string().describe('Text to type'),
  submit: z.boolean().optional().describe('Whether to submit the form after typing (press Enter)')
});

export const type: Tool = {
  schema: {
    name: 'browser_type',
    description: 'Type text into an element',
    inputSchema: zodToJsonSchema(typeSchema)
  },
  handle: async (context, params) => {
    const { selector, text, submit } = typeSchema.parse(params);
    const page = await context.getPage();
    
    try {
      await page.fill(selector, text);
      
      if (submit) {
        await page.press(selector, 'Enter');
      }
      
      return {
        content: [{
          type: 'text',
          text: `Successfully typed "${text}" into element: ${selector}${submit ? ' and submitted the form' : ''}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error typing into element ${selector}: ${error}`
        }],
        isError: true
      };
    }
  }
};

// Wait for element
const waitForSchema = z.object({
  selector: z.string().describe('CSS selector to wait for'),
  timeout: z.number().optional().describe('Maximum time to wait in milliseconds (default: 30000)')
});

export const waitFor: Tool = {
  schema: {
    name: 'browser_wait_for',
    description: 'Wait for an element to be visible on the page',
    inputSchema: zodToJsonSchema(waitForSchema)
  },
  handle: async (context, params) => {
    const { selector, timeout } = waitForSchema.parse(params);
    const page = await context.getPage();
    
    try {
      await page.waitForSelector(selector, { timeout: timeout || 30000 });
      
      return {
        content: [{
          type: 'text',
          text: `Successfully waited for element: ${selector}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error waiting for element ${selector}: ${error}`
        }],
        isError: true
      };
    }
  }
};

// Export all interaction tools
export const interaction = [click, type, waitFor];