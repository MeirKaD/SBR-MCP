// In src/context.ts

import * as playwright from 'playwright';

export class BrowserContext {
  private _options: { cdpEndpoint: string };
  private _browser: playwright.Browser | null = null;
  private _page: playwright.Page | null = null;
  private _browserClosed: boolean = false;
  
  constructor(options: { cdpEndpoint: string }) {
    this._options = options;
  }

  async getBrowser(): Promise<playwright.Browser> {
    try {
      if (this._browser) {
        try {
          await this._browser.contexts();
        } catch (error) {
          console.error('Browser connection lost, reconnecting...');
          this._browser = null;
          this._page = null;
          this._browserClosed = true;
        }
      }
      
      if (!this._browser) {
        console.error('Connecting to Bright Data Scraping Browser...');
        this._browser = await playwright.chromium.connectOverCDP(this._options.cdpEndpoint);
        this._browserClosed = false;
        
        this._browser.on('disconnected', () => {
          console.error('Browser disconnected');
          this._browser = null;
          this._page = null;
          this._browserClosed = true;
        });
        
        console.error('Connected to Bright Data Scraping Browser');
      }
      
      return this._browser;
    } catch (error) {
      console.error('Error connecting to browser:', error);
      this._browser = null;
      this._page = null;
      this._browserClosed = true;
      throw error;
    }
  }

  async getPage(): Promise<playwright.Page> {
    try {
      if (this._browserClosed || !this._page) {
        const browser = await this.getBrowser();
        
        const existingContexts = browser.contexts();
        if (existingContexts.length === 0) {
          const context = await browser.newContext();
          this._page = await context.newPage();
        } else {
          const existingPages = existingContexts[0]?.pages();
          
          if (existingPages && existingPages.length > 0) {
            this._page = existingPages[0];
          } else {
            this._page = await existingContexts[0].newPage();
          }
        }
        
        this._browserClosed = false;
        
        this._page.once('close', () => {
          this._page = null;
        });
      }
      
      return this._page;
    } catch (error) {
      console.error('Error getting page:', error);
      this._browser = null;
      this._page = null;
      this._browserClosed = true;
      throw error;
    }
  }

  async close() {
    if (this._browser) {
      try {
        await this._browser.close();
      } catch (error) {
        console.error('Error closing browser:', error);
      }
      this._browser = null;
      this._page = null;
      this._browserClosed = true;
    }
  }
}