/**
 * authFixture.js
 *
 * `test` extended with a worker-scoped `authPage`: one API login and one
 * authenticated page per worker, reused by every test that worker runs.
 *
 * Why a fixture instead of a file-level `test.beforeAll`: Playwright keeps
 * tests that share a file-level beforeAll together in contiguous chunks
 * (to avoid re-running the hook), so long adjacent tests — the four lead
 * reports — ended up queued on the same worker while other workers idled.
 * A worker-scoped fixture gives the same "log in once per worker" behaviour
 * while letting every test be scheduled independently.
 */
const base = require("@playwright/test");
const { createAuthenticatedPage } = require("../config/env.config");

const test = base.test.extend({
  authPage: [
    async ({ browser, playwright }, use) => {
      const request = await playwright.request.newContext();
      const page = await createAuthenticatedPage(browser, request);
      await use(page);
      await page.context().close().catch(() => {});
      await request.dispose();
    },
    { scope: "worker" },
  ],
});

module.exports = { test, expect: base.expect };
