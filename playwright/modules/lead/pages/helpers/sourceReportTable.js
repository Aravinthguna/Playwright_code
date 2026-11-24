/**
 * sourceReportTable.js
 *
 * Table operations, count parsing, wait/loading helpers, empty-state detection,
 * and report table row extraction for Source Report testing.
 */

const { WebElement } = require("../../../../utils/WebElements");
const defaultWebElement = new WebElement();

/**
 * Safely parse a displayed count string to an integer.
 * Handles formatted numbers like "1,250" and trims whitespace.
 * Throws on unexpected / non-numeric values instead of silently returning 0.
 *
 * @param {string} text - raw text from the UI
 * @returns {number}
 */
function parseCount(text) {
  if (text == null) throw new Error("Count text is null/undefined");
  const cleaned = text.trim().replace(/,/g, "");
  if (cleaned === "" || cleaned === "-") return 0;
  const num = parseInt(cleaned, 10);
  if (isNaN(num)) {
    throw new Error(`Unable to parse count from text: "${text}"`);
  }
  return num;
}

/**
 * Wait for the report table to finish updating after a filter change.
 * Detects spinners, loading overlays, and waits for stable table content.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement] - WebElement utility instance
 */
async function waitForReportUpdate(page, webelement = defaultWebElement) {
  const { spinner, noDataFound, noDataLocator, table } = (
    webelement || defaultWebElement
  ).pageElement(page);

  // Wait for any spinner / loading overlay to disappear
  await spinner
    .first()
    .waitFor({ state: "hidden", timeout: 2500 })
    .catch(() => {
      /* No spinner present — that's OK */
    });

  // Wait for either the table or the "no data" message
  await Promise.race([
    table.first().waitFor({ state: "visible", timeout: 6000 }),
    noDataLocator.first().waitFor({ state: "visible", timeout: 6000 }),
    noDataFound.waitFor({ state: "visible", timeout: 6000 }),
  ]).catch(() => {
    /* Neither appeared — will be handled downstream */
  });
}

/**
 * Check whether the "no data found" state is displayed.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement] - WebElement utility instance
 * @returns {Promise<boolean>}
 */
async function isNoDataDisplayed(page, webelement = defaultWebElement) {
  const { noDataFound, noDataLocator } = (webelement || defaultWebElement).pageElement(page);
  return (
    (await noDataLocator.first().isVisible().catch(() => false)) ||
    (await noDataFound.isVisible().catch(() => false))
  );
}

/**
 * Verify the "No data found for the selected filters" message text.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement] - WebElement utility instance
 * @returns {Promise<string>}
 */
async function verifyNoDataFoundText(page, webelement = defaultWebElement) {
  const { noDataLocator } = (webelement || defaultWebElement).pageElement(page);
  await noDataLocator.first().waitFor({ state: "visible", timeout: 5000 });
  const text = (await noDataLocator.first().textContent())?.trim() || "";
  console.log(`    ✓ Verified empty state text: "${text}"`);
  return text;
}

/**
 * Get all source rows from the report table with their names and counts.
 * Uses atomic page.evaluate() for high-speed single-roundtrip extraction
 * with fallback to locator-based iteration.
 *
 * @param {import('@playwright/test').Page} page
 * @param {(text: string) => number} parseCountFn
 * @param {Object} [webelement] - WebElement utility instance
 * @returns {Promise<Array<{index: number, sourceName: string, countText: string, count: number, hasCountButton: boolean}>>}
 */
async function getReportSourceRows(page, parseCountFn, webelement = defaultWebElement) {
  // Fast path: extract all row data in a single page.evaluate roundtrip
  try {
    const rawRows = await page.evaluate(() => {
      // Find the main report table (not inside a drawer/dialog)
      const tables = Array.from(document.querySelectorAll('table'));
      const mainTable = tables.find(
        (t) => !t.closest('.fixed.inset-0, div[role="dialog"]')
      ) || tables[0];
      if (!mainTable) return null;

      const trs = Array.from(mainTable.querySelectorAll('tbody tr'));
      return trs.map((row, index) => {
        const isVisible = !!(row.offsetWidth || row.offsetHeight || row.getClientRects().length);
        if (!isVisible) return null;

        const firstTd = row.querySelector('td');
        let sourceName = '';
        if (firstTd) {
          const nameEl = firstTd.querySelector('.text-dark-200, span:last-child') || firstTd;
          sourceName = (nameEl.textContent || '').trim();
        }

        const secondTd = row.querySelector('td:nth-child(2)');
        const countBtn = secondTd ? secondTd.querySelector('button') : null;
        const hasCountButton = !!(countBtn && (countBtn.offsetWidth || countBtn.offsetHeight || countBtn.getClientRects().length));
        let countText = '0';
        if (hasCountButton && countBtn) {
          countText = (countBtn.textContent || '0').trim();
        } else if (secondTd) {
          countText = (secondTd.textContent || '0').trim();
        }

        return {
          index,
          sourceName,
          countText,
          hasCountButton,
        };
      }).filter(Boolean);
    });

    if (rawRows !== null) {
      return rawRows.map((r) => {
        let count = 0;
        try {
          count = parseCountFn(r.countText);
        } catch {
          count = 0;
        }
        return {
          index: r.index,
          sourceName: r.sourceName,
          countText: r.countText,
          count,
          hasCountButton: r.hasCountButton,
        };
      });
    }
  } catch {
    // Fallback to locator-based extraction if evaluate encounters any issue
  }

  const { table } = (webelement || defaultWebElement).pageElement(page);
  const rows = table;
  const rowCount = await rows.count();
  const sourceRows = [];

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const isRowVisible = await row.isVisible().catch(() => false);
    if (!isRowVisible) continue;

    // Source name — first column
    const sourceNameEl = row.locator("td").first().locator(".text-dark-200, span").last();
    const sourceName = (await sourceNameEl.textContent().catch(() => ""))?.trim() || "";

    // Count — second column button
    const countButton = row.locator("td:nth-child(2) button");
    const hasCountButton = await countButton.isVisible().catch(() => false);

    let countText = "0";
    let count = 0;

    if (hasCountButton) {
      countText = (await countButton.textContent().catch(() => "0"))?.trim() || "0";
      try {
        count = parseCountFn(countText);
      } catch {
        count = 0;
      }
    }

    sourceRows.push({
      index: i,
      sourceName,
      countText,
      count,
      hasCountButton,
    });
  }

  return sourceRows;
}

/**
 * Get the report count for a specific source name.
 *
 * @param {import('@playwright/test').Page} page
 * @param {(text: string) => number} parseCountFn
 * @param {string} sourceName
 * @param {Object} [webelement] - WebElement utility instance
 * @returns {Promise<{count: number, rowIndex: number} | null>}
 */
async function getReportSourceCount(page, parseCountFn, sourceName, webelement = defaultWebElement) {
  const rows = await getReportSourceRows(page, parseCountFn, webelement);
  const match = rows.find(
    (r) => r.sourceName.toLowerCase() === sourceName.toLowerCase()
  );
  if (!match) return null;
  return { count: match.count, rowIndex: match.index };
}

module.exports = {
  parseCount,
  waitForReportUpdate,
  isNoDataDisplayed,
  verifyNoDataFoundText,
  getReportSourceRows,
  getReportSourceCount,
};
