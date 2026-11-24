/**
 * reportNavigation.js
 *
 * Shared sidebar navigation for the Lead → Reports sub-pages
 * (Source, Pipeline Funnel, Team, Trend). Replaces four copies of the same
 * click-and-sleep sequence with condition-based waits:
 *   - the Reports submenu item becoming visible after expanding "Reports"
 *   - the report's initial API response (so a later Search response cannot be
 *     overtaken by the initial unfiltered load)
 *   - the report heading becoming visible
 */

const { ENVS, ENV_INDEX } = require("../../../../config/env.config");

/**
 * @param {import('@playwright/test').Page} page
 * @param {Object} opts
 * @param {import('@playwright/test').Locator} opts.reports    - sidebar "Reports" entry
 * @param {import('@playwright/test').Locator} opts.menuItem   - the report's submenu entry
 * @param {import('@playwright/test').Locator} opts.heading    - heading shown once the report renders
 * @param {string} opts.apiPath - substring of the report's data API URL
 */
async function navigateToReport(page, { reports, menuItem, heading, apiPath }) {
  if (heading && (await heading.first().isVisible().catch(() => false))) {
    return;
  }

  if (!(await menuItem.isVisible().catch(() => false))) {
    // Right after a page.goto() the SPA sidebar may still be rendering — give it
    // time before deciding we are on the wrong page.
    const onLeadShell = await reports
      .waitFor({ state: "visible", timeout: 10000 })
      .then(() => true)
      .catch(() => false);
    if (!onLeadShell) {
      const env = ENVS[ENV_INDEX];
      await page.goto(env.leadUrl || env.url, { waitUntil: "domcontentloaded" });
    }
    await reports.waitFor({ state: "visible", timeout: 15000 });
    await reports.scrollIntoViewIfNeeded().catch(() => {});
    await reports.click();
    // The submenu toggles; if the first click collapsed an already-open menu, open it again.
    const opened = await menuItem
      .waitFor({ state: "visible", timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    if (!opened) {
      await reports.click();
      await menuItem.waitFor({ state: "visible", timeout: 10000 });
    }
  }

  await Promise.all([
    page
      .waitForResponse((r) => r.url().includes(apiPath), { timeout: 20000 })
      .catch(() => null),
    menuItem.click(),
  ]);
  await heading.first().waitFor({ state: "visible", timeout: 15000 });
}

/**
 * Wait until the browser has painted the current React commit. Used after a
 * client-side state change (tab switch, filter reset) or after a report API
 * response has been received, instead of a fixed sleep.
 *
 * @param {import('@playwright/test').Page} page
 */
async function waitForRender(page) {
  await page
    .evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
    .catch(() => {});
}

/**
 * Track every request to `apiPath` on `page` so a caller can wait for the
 * report data to settle.
 *
 * Why: the Pipeline Funnel page re-fetches getPipelineReport on EVERY filter
 * change (each select / input), not on Search. When the test changed filters
 * ~40ms apart, two requests overlapped; if the older one (e.g. without the new
 * "Site Visit: Today" filter) answered last, the app rendered it and the table
 * showed stale counts (Ak Ak = 7) while the drawer, using the real filters,
 * showed "Showing 0 of 7 leads". Settling after each change keeps requests
 * strictly sequential, like a human user.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} apiPath - substring of the API URL to track
 */
function trackApi(page, apiPath) {
  const inFlight = new Set();
  let seq = 0;
  let lastStartedSeq = 0;
  let lastFinishedSeq = 0;
  let lastActivity = Date.now();
  const ids = new Map();
  const onRequest = (req) => {
    if (!req.url().includes(apiPath)) return;
    ids.set(req, ++seq);
    lastStartedSeq = seq;
    inFlight.add(req);
    lastActivity = Date.now();
  };
  const onDone = (req) => {
    if (!inFlight.delete(req)) return;
    lastFinishedSeq = ids.get(req);
    lastActivity = Date.now();
  };
  page.on("request", onRequest);
  page.on("requestfinished", onDone);
  page.on("requestfailed", onDone);

  return {
    /** Wait until nothing is in flight and nothing new started for `quietMs`. */
    async settle({ quietMs = 250, timeout = 20000 } = {}) {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        if (inFlight.size === 0 && Date.now() - lastActivity >= quietMs) return true;
        await new Promise((r) => setTimeout(r, 50));
      }
      return false;
    },
    /** True if the newest request was NOT the last to answer (UI may be stale). */
    answeredOutOfOrder() {
      return lastStartedSeq > 0 && lastFinishedSeq !== lastStartedSeq;
    },
    get requestCount() {
      return seq;
    },
    stop() {
      page.off("request", onRequest);
      page.off("requestfinished", onDone);
      page.off("requestfailed", onDone);
    },
  };
}

/**
 * Run `action` and wait until every request to `apiPath` started during it has
 * finished, plus a quiet window.
 *
 * @returns {Promise<boolean>} true if settled
 */
async function runAndWaitForApiSettled(page, apiPath, action, { quietMs = 500, timeout = 20000 } = {}) {
  const api = trackApi(page, apiPath);
  try {
    await action();
    return await api.settle({ quietMs, timeout });
  } finally {
    api.stop();
  }
}

/**
 * Open an extra page for a scenario worker pool in its OWN browser context,
 * carrying over the authenticated session (cookies/storage) of `page`.
 *
 * Tabs that share one context share localStorage, and the app syncs state
 * across tabs — one tab's navigation/filter change re-routes the others to
 * /lead, which broke "All leads loaded" checks and heading waits in the
 * pools. Separate contexts are isolated (verified: 87/87 popups OK vs.
 * failures with shared-context tabs).
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<import('@playwright/test').Page>} page whose context closes with it
 */
async function openIsolatedPage(page) {
  const context = page.context();
  const storageState = await context.storageState();
  const isolated = await context.browser().newContext({ storageState });
  const newPage = await isolated.newPage();
  newPage.once("close", () => isolated.close().catch(() => {}));
  return newPage;
}

module.exports = { navigateToReport, waitForRender, trackApi, runAndWaitForApiSettled, openIsolatedPage };
