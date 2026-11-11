import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Special:UserLogin. Wikipedia redirects it to the central login on auth.wikimedia.org. */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  /** hCaptcha widget that Wikipedia adds to the form when it wants extra verification. */
  readonly captcha: Locator;

  constructor(page: Page) {
    super(page);
    const form = page.locator('form[name="userlogin"]');
    this.usernameInput = form.getByLabel('Username');
    this.passwordInput = form.getByLabel('Password');
    this.rememberMeCheckbox = form.getByLabel('Keep me logged in');
    this.loginButton = form.getByRole('button', { name: 'Log in' });
    this.errorMessage = form.getByRole('alert');
    this.captcha = form.locator('#h-captcha');
  }

  async open(): Promise<void> {
    await this.page.goto('/wiki/Special:UserLogin?returnto=Main_Page');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.submitPassword(password);
  }

  /** The password field is empty after the form is re-rendered (e.g. when a CAPTCHA is requested). */
  async submitPassword(password: string): Promise<void> {
    await fillSecret(this.passwordInput, password);
    // A long-lived session lets later runs (incl. Docker) reuse it without a new login.
    await this.rememberMeCheckbox.check();
    await this.loginButton.click();
  }
}

/**
 * Playwright prints typed values in step titles (`Fill "…"`), which end up in the HTML report.
 * A secret is therefore set via evaluate(), whose step title is just "Evaluate".
 */
async function fillSecret(input: Locator, secret: string): Promise<void> {
  await input.evaluate((element: HTMLInputElement, value) => {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, secret);
}
