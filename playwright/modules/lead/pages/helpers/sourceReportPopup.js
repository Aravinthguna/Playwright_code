/**
 * sourceReportPopup.js
 *
 * Popup / modal operations for Source Report testing:
 *  - Opening and closing lead popup drawer
 *  - Total lead count extraction and fallback patterns
 *  - Multi-page lead record collection and deduplication
 *  - Lazy-load batch scrolling with infinite-scroll verification ("All leads loaded")
 */

const { expect } = require("@playwright/test");
const { WebElement } = require("../../../../utils/WebElements");
const defaultWebElement = new WebElement();

/**
 * Open the lead popup by clicking the count button in the specified source row.
 *
 * @param {import('@playwright/test').Page} page
 * @param {number} rowIndex - zero-based row index in the table
 * @param {Object} [webelement] - WebElement utility instance
 * @returns {Promise<boolean>} true if popup opened
 */
async function openLeadPopupByRowIndex(
  page,
  rowIndex,
  webelement = defaultWebElement,
) {
  const { table, popupContainer } = (
    webelement || defaultWebElement
  ).pageElement(page);
  const rows = table;
  const row = rows.nth(rowIndex);
  const countButton = row.locator("td:nth-child(2) button");

  const hasBtn = await countButton.isVisible().catch(() => false);
  if (!hasBtn) return false;

  // Wait for the popup's own lead request so counts are not read from a
  // still-loading (or previous) drawer.
  await Promise.all([
    page
      .waitForResponse((r) => r.url().includes("/communication/getAllLeads"), { timeout: 30000 })
      .catch(() => null),
    countButton.click(),
  ]);

  // Wait for popup/drawer to appear without fixed wait
  const popupVisible = await popupContainer
    .waitFor({ state: "visible", timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  return popupVisible;
}

/**
 * Open the lead popup for a named source row.
 *
 * @param {import('@playwright/test').Page} page
 * @param {(name: string) => Promise<{count: number, rowIndex: number}|null>} getReportSourceCountFn
 * @param {string} sourceName
 * @param {Object} [webelement] - WebElement utility instance
 * @returns {Promise<boolean>}
 */
async function openLeadPopup(
  page,
  getReportSourceCountFn,
  sourceName,
  webelement = defaultWebElement,
) {
  const info = await getReportSourceCountFn(sourceName);
  if (!info) {
    console.warn(
      `[SourceReport] Source "${sourceName}" not found in report table.`,
    );
    return false;
  }
  return openLeadPopupByRowIndex(page, info.rowIndex, webelement);
}

/**
 * Read the total lead count displayed in the popup/drawer.
 * Looks for common patterns: "Total: 12", "12 Leads", "Showing 1-10 of 12", etc.
 *
 * @param {import('@playwright/test').Page} page
 * @param {(text: string) => number} parseCountFn
 * @param {Object} [webelement] - WebElement utility instance
 * @returns {Promise<number|null>}
 */
async function getPopupTotalCount(
  page,
  parseCountFn,
  webelement = defaultWebElement,
) {
  // Fast path: inspect drawer header / container text for total count patterns in a single evaluate
  try {
    const extracted = await page.evaluate(() => {
      const drawer = document.querySelector(
        '.fixed.inset-0, div[role="dialog"]',
      );
      if (!drawer) return null;
      const text = drawer.innerText || "";
      // Check patterns: "Total: 12", "12 Leads", "Showing 1-10 of 12", etc.
      const m =
        text.match(/(?:Total[:\s-]+|of\s+)(\d[\d,]*)/i) ||
        text.match(/(\d[\d,]*)\s+leads?/i);
      if (m && m[1]) return m[1];

      // Check badges or counts in header
      const badge = drawer.querySelector(
        '[class*="badge"], [class*="count"], [class*="total"], h2, h3',
      );
      if (badge) {
        const bText = badge.textContent || "";
        const nums = bText.match(/[\d,]+/g);
        if (nums && nums.length > 0) return nums[nums.length - 1];
      }
      return null;
    });
    if (extracted) {
      try {
        return parseCountFn(extracted);
      } catch {}
    }
  } catch {}

  const { totalPatterns, popupRows, noLeads } = (
    webelement || defaultWebElement
  ).pageElement(page);

  // Strategy 1: Look for an explicit total-count element in the popup
  for (const pattern of totalPatterns) {
    const isVis = await pattern
      .first()
      .isVisible()
      .catch(() => false);
    if (isVis) {
      const text = await pattern
        .first()
        .textContent()
        .catch(() => "");
      // Extract the last number in the text (usually the total)
      const numbers = text.match(/[\d,]+/g);
      if (numbers && numbers.length > 0) {
        const lastNum = numbers[numbers.length - 1];
        try {
          return parseCountFn(lastNum);
        } catch {
          continue;
        }
      }
    }
  }

  // Strategy 2: Count visible table rows inside the popup as fallback
  const rowCount = await popupRows.count().catch(() => 0);
  if (rowCount > 0) {
    return rowCount;
  }

  // Strategy 3: Look for "No leads found" or empty-state
  if (
    await noLeads
      .first()
      .isVisible()
      .catch(() => false)
  ) {
    return 0;
  }

  return null;
}

/**
 * Get the number of lead rows visible on the current page inside the popup.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement] - WebElement utility instance
 * @returns {Promise<number>}
 */
async function getPopupCurrentPageRowCount(
  page,
  webelement = defaultWebElement,
) {
  const { rows } = (webelement || defaultWebElement).pageElement(page);
  return await rows.count().catch(() => 0);
}

/**
 * Retrieve all lead records from the popup, handling pagination.
 * Returns an array of record objects with available fields.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement] - WebElement utility instance
 * @returns {Promise<Array<{name: string, source: string, date: string, rawText: string}>>}
 */
async function getAllPopupLeadRecords(page, webelement = defaultWebElement) {
  const allRecords = [];
  const seenIds = new Set();
  let pageNum = 1;
  const maxPages = 50; // safety limit

  while (pageNum <= maxPages) {
    const pageRecords = await _extractCurrentPageRecords(page, webelement);

    for (const record of pageRecords) {
      // Deduplicate by a composite key (name + rawText)
      const key = `${record.name}|${record.rawText}`.toLowerCase();
      if (!seenIds.has(key)) {
        seenIds.add(key);
        allRecords.push(record);
      }
    }

    // Check for next-page button
    const hasNextPage = await _goToNextPopupPage(page, webelement);
    if (!hasNextPage) break;
    pageNum++;
    await page.waitForTimeout(800);
  }

  return allRecords;
}

/**
 * Extract lead records from the currently visible page in the popup.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement] - WebElement utility instance
 * @returns {Promise<Array<{name: string, source: string, date: string, status: string, rawText: string}>>}
 */
async function _extractCurrentPageRecords(
  page,
  webelement = defaultWebElement,
) {
  const { popupLeadRows, items } = (
    webelement || defaultWebElement
  ).pageElement(page);

  // Scroll to bottom then back to top to ensure all lazy-loaded content is visible
  await page.evaluate(() => {
    const drawer =
      document.querySelector(".fixed.inset-0") ||
      document.querySelector('div[role="dialog"]') ||
      document.body;
    drawer.scrollTop = drawer.scrollHeight;
  });
  await page.waitForTimeout(400);

  await page.evaluate(() => {
    const drawer =
      document.querySelector(".fixed.inset-0") ||
      document.querySelector('div[role="dialog"]') ||
      document.body;
    drawer.scrollTop = 0;
  });
  await page.waitForTimeout(400);

  const records = [];

  // Try table rows first
  const rows = popupLeadRows;
  const rowCount = await rows.count().catch(() => 0);

  if (rowCount > 0) {
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const cells = row.locator("td");
      const cellCount = await cells.count().catch(() => 0);

      const cellTexts = [];
      for (let c = 0; c < cellCount; c++) {
        const text =
          (
            await cells
              .nth(c)
              .textContent()
              .catch(() => "")
          )?.trim() || "";
        cellTexts.push(text);
      }

      records.push({
        name: cellTexts[0] || "",
        source: cellTexts[1] || "",
        date: cellTexts[2] || "",
        status: cellTexts[3] || "",
        rawText: cellTexts.join(" | "),
      });
    }
  } else {
    // Fallback: try card/list-item layout
    const itemCount = await items.count().catch(() => 0);

    for (let i = 0; i < itemCount; i++) {
      const text =
        (
          await items
            .nth(i)
            .textContent()
            .catch(() => "")
        )?.trim() || "";
      records.push({
        name: text.substring(0, 50),
        source: "",
        date: "",
        status: "",
        rawText: text,
      });
    }
  }

  return records;
}

/**
 * Attempt to navigate to the next page in the popup pagination.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement] - WebElement utility instance
 * @returns {Promise<boolean>} true if navigation occurred
 */
async function _goToNextPopupPage(page, webelement = defaultWebElement) {
  const { nextSelectors } = (webelement || defaultWebElement).pageElement(page);

  for (const selector of nextSelectors) {
    const btn = selector.first();
    const isVisible = await btn.isVisible().catch(() => false);
    if (!isVisible) continue;

    const isDisabled = await btn.isDisabled().catch(() => true);
    if (isDisabled) return false;

    await btn.click();
    await page.waitForTimeout(500);
    return true;
  }

  return false;
}

/**
 * Scroll down inside the lead popup until all leads are loaded.
 * If leads are more than 10 (or any count > 0), scrolls repeatedly to fetch
 * lazy-loaded batches until all leads are loaded and the text "All leads loaded" is displayed.
 * Verifies the "All leads loaded" text.
 *
 * @param {import('@playwright/test').Page} page
 * @param {number} expectedCount - total leads expected in the popup
 * @param {string} [sourceName=""] - source name for logging
 * @param {Object} [webelement] - WebElement utility instance
 * @returns {Promise<boolean>}
 */
async function scrollAndVerifyAllLeadsLoaded(
  page,
  expectedCount,
  sourceName = "",
  webelement = defaultWebElement,
) {
  // Scope "All leads loaded" strictly to the ACTIVE popup/drawer so that stale
  // DOM text left behind by a previously-closed popup (from an earlier scenario
  // in the same full-suite run) cannot cause a false early-exit or a false
  // assertion failure.  The page-scoped `allLeadsLoadedEl` from WebElements
  // matches ANY element on the page — including hidden remnants — which made
  // the check pass immediately (skipping the scroll) and then fail at the final
  // toBeVisible() because the stale element had already become hidden when the
  // new popup opened.
  const popupSelector =
    '.fixed.inset-0, div[role="dialog"], [class*="drawer"], [class*="modal"]';

  // Build a locator scoped to the first visible popup/drawer element.
  const allLeadsLoadedEl = page
    .locator(popupSelector)
    .first()
    .getByText("All leads loaded", { exact: false })
    .first();

  // Helper: re-query the active popup's "All leads loaded" text each time so we
  // never read from a detached/closed popup element.
  const isLoadedInActivePopup = async () => {
    try {
      return await page
        .locator(popupSelector)
        .filter({ hasText: "All leads loaded" })
        .first()
        .isVisible();
    } catch {
      return false;
    }
  };

  // Early check: if all leads are already loaded (very common when count <= 10), avoid scrolling entirely
  let isAllLoaded = await isLoadedInActivePopup();
  if (!isAllLoaded && expectedCount <= 10) {
    // Give a brief moment for the popup to settle before the first check
    await page.waitForTimeout(300).catch(() => {});
    isAllLoaded = await isLoadedInActivePopup();
  }

  // Progress-based lazy-load scrolling. A fixed attempt budget (previously
  // 40 x 250ms) ran out for 30–90 lead popups when the server was slower under
  // parallel load. Instead keep scrolling while new batches keep arriving
  // (scroll height grows) and give each batch up to 10s; stop after 2
  // consecutive batches that bring nothing new, or immediately when the drawer
  // shows its empty state (a definitive answer — no point scrolling).
  const getScrollHeight = () =>
    page.evaluate(() => {
      const modal = document.querySelector(
        '.fixed.inset-0, div[role="dialog"], [class*="drawer"], [class*="modal"]',
      );
      if (!modal) return -1;
      const scrollTarget = modal.querySelector(".overflow-y-auto") || modal;
      return scrollTarget.scrollHeight;
    });

  const isEmptyState = () =>
    page
      .evaluate(() => {
        const modal = document.querySelector(
          '.fixed.inset-0, div[role="dialog"], [class*="drawer"], [class*="modal"]',
        );
        return !!modal && /No leads found|No data found/i.test(modal.innerText || "");
      })
      .catch(() => false);

  let stalls = 0;
  while (!isAllLoaded && stalls < 2) {
    const previousHeight = await getScrollHeight();
    if (previousHeight < 0) break; // popup gone — the final assertion reports it
    const progressed = await page
      .waitForFunction(
        (prevHeight) => {
          const modal = document.querySelector(
            '.fixed.inset-0, div[role="dialog"], [class*="drawer"], [class*="modal"]',
          );
          if (!modal) return true;
          const text = modal.innerText || "";
          if (text.includes("All leads loaded") || /No leads found|No data found/i.test(text)) return true;
          const scrollTarget = modal.querySelector(".overflow-y-auto") || modal;
          // Keep nudging to the bottom so the infinite-scroll trigger fires.
          scrollTarget.scrollTop = scrollTarget.scrollHeight;
          return scrollTarget.scrollHeight > prevHeight;
        },
        previousHeight,
        { polling: 200, timeout: 10000 },
      )
      .then(() => true)
      .catch(() => false);
    stalls = progressed ? 0 : stalls + 1;
    isAllLoaded = await isLoadedInActivePopup();
    if (!isAllLoaded && (await isEmptyState())) break;
  }

  // Verify "All leads loaded" text is visible
  if (!isAllLoaded && !(await isLoadedInActivePopup())) {
    // Collect what the drawer actually shows so a failure is diagnosable.
    const state = await page
      .evaluate(() => {
        const modal = document.querySelector(
          '.fixed.inset-0, div[role="dialog"], [class*="drawer"], [class*="modal"]',
        );
        if (!modal) return { modal: false };
        const scrollTarget = modal.querySelector(".overflow-y-auto") || modal;
        const text = (modal.innerText || "").trim();
        return {
          modal: true,
          rows: modal.querySelectorAll("tbody tr").length,
          scrollHeight: scrollTarget.scrollHeight,
          clientHeight: scrollTarget.clientHeight,
          scrollTop: Math.round(scrollTarget.scrollTop),
          tail: text.slice(-160).replace(/\s+/g, " "),
          // "No data found / Try adjusting your filters" = the popup's lead API
          // failed (seen: HTTP 400 {"code":524,"message":"API timed out"} under load);
          // "No leads found / No leads matched this filter" = API returned an empty
          // list although the header total is > 0 (data inconsistency).
          diagnosis: /Try adjusting your filters/i.test(text)
            ? "lead API error/timeout (backend)"
            : /No leads matched this filter/i.test(text)
              ? "header total > 0 but lead list empty (app data)"
              : "lead list did not finish loading",
        };
      })
      .catch((e) => ({ error: e.message }));
    console.warn(
      `    ⚠ [${sourceName}] "All leads loaded" not shown (expected ${expectedCount}); drawer state: ${JSON.stringify(state)}`,
    );
  }
  await expect(allLeadsLoadedEl).toBeVisible({ timeout: 5000 });
  const text = (
    await allLeadsLoadedEl.textContent().catch(() => "All leads loaded")
  )?.trim();
  console.log(
    `    ✓ Verified text in popup: "${text}" (${expectedCount} leads loaded for "${sourceName}")`,
  );

  return true;
}

/**
 * Close the lead popup/drawer safely.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement] - WebElement utility instance
 */
async function closeLeadPopup(page, webelement = defaultWebElement) {
  const { clcikCloseButton, fallbackSelectors, popupContainer } = (
    webelement || defaultWebElement
  ).pageElement(page);

  if (
    await clcikCloseButton
      .first()
      .isVisible()
      .catch(() => false)
  ) {
    // A normal click() waits for the button to be "stable", i.e. for the
    // drawer's slide-in animation to finish — 100-650ms per popup, ~2 min per
    // worker on Source Report. Dispatching the click event directly closes it
    // immediately; fall back to a real click if the drawer did not close.
    await clcikCloseButton.first().dispatchEvent("click");
    const closed = await popupContainer
      .waitFor({ state: "hidden", timeout: 1500 })
      .then(() => true)
      .catch(() => false);
    if (!closed && (await clcikCloseButton.first().isVisible().catch(() => false))) {
      await clcikCloseButton.first().click();
    }
  } else {
    // Fallback close selectors
    for (const btn of fallbackSelectors) {
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        break;
      }
    }
  }

  // Wait for popup/drawer to close without fixed sleep
  await popupContainer
    .waitFor({ state: "hidden", timeout: 3000 })
    .catch(() => {});
}

module.exports = {
  openLeadPopupByRowIndex,
  openLeadPopup,
  getPopupTotalCount,
  getPopupCurrentPageRowCount,
  getAllPopupLeadRecords,
  _extractCurrentPageRecords,
  _goToNextPopupPage,
  scrollAndVerifyAllLeadsLoaded,
  closeLeadPopup,
};
