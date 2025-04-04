import type { BrowserContext } from '../context.js';
import type { Resource } from './resource.js';

export const pageContent: Resource = {
  schema: {
    uri: 'browser://content',
    name: 'Page Content',
    description: 'HTML content of the current page',
    mimeType: 'text/html'
  },
  
  read: async (context: BrowserContext, uri: string) => {
    const page = await context.getPage();
    const content = await page.content();
    
    return [{
      uri,
      mimeType: 'text/html',
      text: content
    }];
  }
};