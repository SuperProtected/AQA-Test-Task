import { DEFAULT_LANGUAGE, TARGET_LANGUAGES } from '../src/data/languages';
import { expect, test } from '../src/fixtures/test';

/**
 * TC-01: An authorised user switches the interface language in Preferences.
 * The test case is described in README.md. The user is logged in by tests/auth.setup.ts.
 */
test.describe('Preferences › User profile › Internationalisation', () => {
  test.beforeEach(async ({ wikiApi }) => {
    // Precondition: the interface language is English. It is set via the API so that
    // an interrupted previous run cannot leave the account in another language.
    await wikiApi.setInterfaceLanguage(DEFAULT_LANGUAGE.code);
  });

  test.afterEach(async ({ wikiApi }) => {
    // Postcondition: restore the default language for the next runs.
    await wikiApi.setInterfaceLanguage(DEFAULT_LANGUAGE.code);
  });

  for (const language of TARGET_LANGUAGES) {
    test(`TC-01: authorised user switches the interface language to "${language.optionLabel}"`,
      { tag: ['@smoke', '@preferences'] }, async ({ page, articlePage, preferencesPage, wikiApi }) => {
        const initial = DEFAULT_LANGUAGE.ui;
        const expected = language.ui;

        await test.step('1. Open "Preferences" from the user menu', async () => {
          await articlePage.open('Main_Page');
          await articlePage.openPreferencesFromUserMenu();

          await expect(page).toHaveURL(/\/wiki\/Special:Preferences/);
          await expect(preferencesPage.heading).toHaveText(initial.preferencesHeading);
        });

        await test.step('2. Open the "User profile" tab and find the "Internationalisation" section', async () => {
          await preferencesPage.openTab(initial.userProfileTab);

          await expect(preferencesPage.tab(initial.userProfileTab)).toHaveAttribute('aria-selected', 'true');
          await expect(preferencesPage.section(initial.internationalisationSection)).toBeVisible();
          await expect(preferencesPage.languageCombobox).toHaveValue(DEFAULT_LANGUAGE.nativeName);
        });

        await test.step(`3. Select "${language.optionLabel}" in the "Language" field`, async () => {
          await preferencesPage.selectInterfaceLanguage(language);

          await expect(preferencesPage.languageCombobox).toHaveValue(language.nativeName);
          await expect(preferencesPage.saveButton).toBeEnabled();
        });

        await test.step('4. Click "Save"', async () => {
          await preferencesPage.save();
        });

        await test.step('Expected: Preferences page is displayed in the selected language', async () => {
          await expect(preferencesPage.html).toHaveAttribute('lang', language.code);
          await expect(preferencesPage.savedNotice(expected.savedNotice)).toBeVisible();
          await expect(preferencesPage.heading).toHaveText(expected.preferencesHeading);
          await expect(preferencesPage.tab(expected.userProfileTab)).toHaveAttribute('aria-selected', 'true');
          await expect(preferencesPage.section(expected.internationalisationSection)).toBeVisible();
          await expect(preferencesPage.saveButton).toHaveText(expected.saveButton);
          expect(await wikiApi.getInterfaceLanguage(), 'Saved "language" preference').toBe(language.code);

          await test.info().attach(`Preferences (${language.code})`, {
            body: await page.screenshot(),
            contentType: 'image/png',
          });
        });

        await test.step('Expected: other pages also use the selected interface language', async () => {
          await articlePage.open('Main_Page');

          await expect(articlePage.html).toHaveAttribute('lang', language.code);
          await expect(articlePage.readTab).toHaveText(expected.readTab);
          await expect(articlePage.historyTab).toHaveText(expected.historyTab);
          await expect(articlePage.searchInput).toHaveAttribute('placeholder', expected.searchPlaceholder);
          // Only the interface is translated; the article content stays in English.
          await expect(articlePage.content).toHaveAttribute('lang', DEFAULT_LANGUAGE.code);

          await test.info().attach(`Main page (${language.code})`, {
            body: await page.screenshot(),
            contentType: 'image/png',
          });
        });
      },
    );
  }
});
