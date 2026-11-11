import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Any regular wiki page, e.g. Main_Page. */
export class ArticlePage extends BasePage {
  readonly readTab: Locator;
  readonly historyTab: Locator;
  readonly searchInput: Locator;
  /** Page content; its `lang` is the content language, independent of the interface language. */
  readonly content: Locator;

  constructor(page: Page) {
    super(page);
    this.readTab = page.locator('#ca-view');
    this.historyTab = page.locator('#ca-history');
    this.searchInput = page.locator('#searchInput');
    this.content = page.locator('#mw-content-text > .mw-parser-output');
  }

  async open(title: string): Promise<void> {
    await this.page.goto(`/wiki/${encodeURIComponent(title)}`);
  }
}
