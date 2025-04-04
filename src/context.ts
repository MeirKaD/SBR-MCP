import * as playwright from 'playwright';

export class BrowserContext {
  private _options: { cdpEndpoint: string };
  private _browser: playwright.Browser | null = null;
  private _page: playwright.Page | null = null;
  
  constructor(options: { cdpEndpoint: string }) {
    this._options = options;
  }

  async getBrowser(): Promise<playwright.Browser> {
    if (!this._browser) {
      console.error('Connecting to Bright Data Scraping Browser...');
      this._browser = await playwright.chromium.connectOverCDP(this._options.cdpEndpoint);
      console.error('Connected to Bright Data Scraping Browser');
    }
    return this._browser;
  }

  async getPage(): Promise<playwright.Page> {
    if (!this._page) {
      const browser = await this.getBrowser();
      const existingPages = browser.contexts()[0]?.pages();
      
      if (existingPages && existingPages.length > 0) {
        this._page = existingPages[0];
      } else {
        this._page = await browser.newPage();
      }
    }
    return this._page;
  }

  async close() {
    if (this._browser) {
      await this._browser.close();
      this._browser = null;
      this._page = null;
    }
  }
}