import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';

const API_PATH = '/w/api.php';

/** Anonymous users get this placeholder instead of a real CSRF token. */
const ANONYMOUS_TOKEN = '+\\';

/** Identifies automated API traffic, as asked by the Wikimedia API etiquette. */
const API_HEADERS = { 'Api-User-Agent': 'wikipedia-interface-language-e2e (Playwright AQA test task)' };

export interface CurrentUser {
  name: string;
  isAnonymous: boolean;
}

/**
 * Thin wrapper over the MediaWiki Action API.
 * It shares cookies with the browser context, so it acts as the logged-in user.
 * Used for fast and reliable preconditions / cleanup, not for the checks of the test case.
 */
export class WikiApi {
  constructor(private readonly request: APIRequestContext) {}

  async getCurrentUser(): Promise<CurrentUser> {
    const body = await this.query({ meta: 'userinfo' });
    const { name, anon } = body.query.userinfo;
    return { name, isAnonymous: anon === true };
  }

  async getInterfaceLanguage(): Promise<string> {
    const body = await this.query({ meta: 'userinfo', uiprop: 'options' });
    return body.query.userinfo.options.language;
  }

  async setInterfaceLanguage(languageCode: string): Promise<void> {
    const token = await this.getCsrfToken();
    const response = await this.request.post(API_PATH, {
      headers: API_HEADERS,
      form: {
        action: 'options',
        optionname: 'language',
        optionvalue: languageCode,
        token,
        format: 'json',
        formatversion: '2',
      },
    });
    expect(await this.json(response), `Could not set interface language to "${languageCode}"`).toMatchObject({
      options: 'success',
    });
  }

  private async getCsrfToken(): Promise<string> {
    const body = await this.query({ meta: 'tokens', type: 'csrf' });
    const token: string | undefined = body.query?.tokens?.csrftoken;
    if (!token || token === ANONYMOUS_TOKEN) {
      throw new Error('MediaWiki API treats the session as anonymous: the user is not logged in.');
    }
    return token;
  }

  private async query(params: Record<string, string>) {
    const response = await this.request.get(API_PATH, {
      headers: API_HEADERS,
      params: { action: 'query', format: 'json', formatversion: '2', ...params },
    });
    return this.json(response);
  }

  private async json(response: APIResponse) {
    expect(response.ok(), `${response.url()} responded with HTTP ${response.status()}`).toBeTruthy();
    return response.json();
  }
}
