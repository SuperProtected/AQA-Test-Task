import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { STORAGE_STATE_PATH } from './src/utils/paths';

// Load credentials from .env for local runs. Inside Docker the variables are
// injected by docker compose (env_file), and dotenv never overrides them.
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

export default defineConfig({
  testDir: './tests',
  // Every test changes preferences of the same Wikipedia account, so tests
  // must not run in parallel.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    // open: 'never' so the reporter never blocks a container by starting a web server.
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: 'https://en.wikipedia.org',
    locale: 'en-US',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        // Traces record typed values in plain text: never let the password get into the report.
        trace: 'off',
      },
    },
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE_PATH,
      },
      dependencies: ['setup'],
    },
  ],
});
