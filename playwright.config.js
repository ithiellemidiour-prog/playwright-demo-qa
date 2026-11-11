// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const enCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: enCI,
  // Pas de relance automatique : un test instable doit se voir, pas se cacher.
  retries: 0,
  workers: enCI ? 2 : undefined,
  reporter: enCI
    ? [['list'], ['html', { open: 'never' }], ['github']]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'firefox',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Firefox'], baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'webkit',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Safari'], baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
