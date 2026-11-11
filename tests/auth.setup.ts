import fs from 'node:fs';
import { expect, test as setup } from '@playwright/test';
import { WikiApi } from '../src/api/WikiApi';
import { LoginPage } from '../src/pages/LoginPage';
import { credentials } from '../src/utils/env';
import { STORAGE_STATE_PATH } from '../src/utils/paths';

const MANUAL_CAPTCHA_TIMEOUT = 5 * 60_000;

const CAPTCHA_HINT = `Wikipedia requested a CAPTCHA (hCaptcha) for this login. It has to be solved by a human:
  run "npm run auth" once - a browser window opens with the credentials pre-filled, solve the CAPTCHA there.
  The session is saved to playwright/.auth/user.json and reused by all later runs (including Docker).`;

/** MediaWiki stores user names with an upper-case first letter and spaces instead of underscores. */
const isSameUser = (a: string, b: string) =>
  a.replace(/_/g, ' ').trim().toLowerCase() === b.replace(/_/g, ' ').trim().toLowerCase();

// Start from the session saved by a previous run, if there is one.
setup.use({ storageState: fs.existsSync(STORAGE_STATE_PATH) ? STORAGE_STATE_PATH : undefined });

/**
 * Provides the precondition "the user is logged in" for the test project:
 * logs in through the UI (or reuses a still valid session) and saves the cookies to a file.
 */
setup('authenticate as Wikipedia user', async ({ page, headless }) => {
  if (!headless) {
    // Headed run ("npm run auth"): leave time for a human to solve a CAPTCHA
    // and make sure the window is in front (a background window throttles rendering).
    setup.setTimeout(MANUAL_CAPTCHA_TIMEOUT + 60_000);
    await page.bringToFront();
  }

  const api = new WikiApi(page.request);
  const loginPage = new LoginPage(page);
  const logoutLink = page.locator('#pt-logout');

  const currentUser = await api.getCurrentUser();
  if (!currentUser.isAnonymous && isSameUser(currentUser.name, credentials.username)) {
    console.log(`Reusing the saved session of "${currentUser.name}".`);
    await page.context().storageState({ path: STORAGE_STATE_PATH });
    return;
  }
  await page.context().clearCookies();

  await setup.step('Log in through the UI', async () => {
    await loginPage.open();
    await loginPage.login(credentials.username, credentials.password);
    // Either we are redirected back to Wikipedia as a logged-in user, or the form shows an error.
    await expect(logoutLink.or(loginPage.errorMessage)).toBeAttached({ timeout: 30_000 });
  });

  if (await loginPage.captcha.count()) {
    if (headless) throw new Error(CAPTCHA_HINT);

    await setup.step('Wait for a human to solve the CAPTCHA', async () => {
      await page.bringToFront();
      console.log('Wikipedia requested a CAPTCHA: solve it in the opened browser window (5 min timeout)...');
      await loginPage.submitPassword(credentials.password);
      await expect(logoutLink).toBeAttached({ timeout: MANUAL_CAPTCHA_TIMEOUT });
    });
  }

  if (await loginPage.errorMessage.isVisible()) {
    throw new Error(`Login failed: ${await loginPage.errorMessage.innerText()}`);
  }

  const loggedInUser = await api.getCurrentUser();
  expect(loggedInUser.isAnonymous, 'User must be logged in after the login flow').toBe(false);
  expect(isSameUser(loggedInUser.name, credentials.username)).toBe(true);

  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
