import { test as base } from '@playwright/test';
import { WikiApi } from '../api/WikiApi';
import { ArticlePage } from '../pages/ArticlePage';
import { PreferencesPage } from '../pages/PreferencesPage';

type Fixtures = {
  wikiApi: WikiApi;
  articlePage: ArticlePage;
  preferencesPage: PreferencesPage;
};

export const test = base.extend<Fixtures>({
  // Shares cookies with the browser context, i.e. acts as the logged-in user.
  wikiApi: async ({ page }, use) => use(new WikiApi(page.request)),
  articlePage: async ({ page }, use) => use(new ArticlePage(page)),
  preferencesPage: async ({ page }, use) => use(new PreferencesPage(page)),
});

export { expect } from '@playwright/test';
