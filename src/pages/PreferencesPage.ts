import type { Locator, Page } from '@playwright/test';
import type { InterfaceLanguage } from '../data/languages';
import { BasePage } from './BasePage';

/** Special:Preferences. */
export class PreferencesPage extends BasePage {
  /** Searchable "Language" field (Codex lookup) in "User profile" › "Internationalisation". */
  readonly languageCombobox: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.languageCombobox = page.locator('.mw-htmlform-field-HTMLSelectLanguageField').getByRole('combobox');
    this.saveButton = page.locator('#prefcontrol').getByRole('button');
  }

  tab(name: string): Locator {
    return this.page.getByRole('tab', { name, exact: true });
  }

  /** A section of the form (a <fieldset>, exposed as a "group" named by its legend). */
  section(name: string): Locator {
    return this.page.getByRole('group', { name, exact: true });
  }

  /**
   * Confirmation after saving. MediaWiki renders it as a message box and then converts it
   * into a toast notification, so the check is by its visible text.
   */
  savedNotice(text: string): Locator {
    return this.page.getByText(text, { exact: true }).filter({ visible: true }).first();
  }

  async openTab(name: string): Promise<void> {
    await this.tab(name).click();
  }

  /** Types the language code into the search field and picks the matching option. */
  async selectInterfaceLanguage(language: InterfaceLanguage): Promise<void> {
    await this.languageCombobox.click();
    await this.languageCombobox.fill(language.code);
    await this.page.getByRole('option', { name: language.optionLabel, exact: true }).click();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}
