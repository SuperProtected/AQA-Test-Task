import type { Locator, Page } from '@playwright/test';

/**
 * Elements shared by every Wikipedia page (Vector 2022 skin).
 *
 * Structural elements are located by stable MediaWiki ids instead of text:
 * the whole point of the tests is that the interface text changes with the language.
 */
export abstract class BasePage {
  /** `<html lang="…">` reflects the interface (user) language. */
  readonly html: Locator;
  readonly heading: Locator;
  readonly personalToolsToggle: Locator;
  readonly preferencesLink: Locator;
  /** Present (inside the collapsed user menu) only for logged-in users. */
  readonly logoutLink: Locator;

  constructor(protected readonly page: Page) {
    this.html = page.locator('html');
    this.heading = page.locator('#firstHeading');
    this.personalToolsToggle = page.locator('#vector-user-links-dropdown-checkbox');
    this.preferencesLink = page.locator('#pt-preferences a');
    this.logoutLink = page.locator('#pt-logout');
  }

  async openPreferencesFromUserMenu(): Promise<void> {
    await this.personalToolsToggle.click();
    await this.preferencesLink.click();
  }
}
