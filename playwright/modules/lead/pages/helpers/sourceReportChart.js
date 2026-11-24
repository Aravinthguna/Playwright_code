/**
 * sourceReportChart.js
 *
 * Chart View operations, Donut SVG count extraction, Source Breakdown row
 * extraction, and three-way count reconciliation for Source Report testing.
 */

const { WebElement } = require("../../../../utils/WebElements");
const defaultWebElement = new WebElement();

/**
 * Switch to Chart View by clicking the "Chart View" button.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement]
 */
async function switchToChartView(page, webelement = defaultWebElement) {
  const { chartViewBtn, distributionHeading, chartTotalLeadsHeading } = (
    webelement || defaultWebElement
  ).pageElement(page);

  await chartViewBtn.waitFor({ state: "visible", timeout: 5000 });
  await chartViewBtn.click();

  // Verify "Lead Source Distribution" header
  await distributionHeading.first().waitFor({ state: "visible", timeout: 8000 });
  console.log('  ✓ Verified "Lead Source Distribution" section in Chart View');

  await chartTotalLeadsHeading.waitFor({ state: "visible", timeout: 5000 });
}

/**
 * Switch back to List View by clicking the "List View" button.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement]
 */
async function switchToListView(page, webelement = defaultWebElement) {
  const { listViewBtn, table, noDataLocator } = (webelement || defaultWebElement).pageElement(page);

  await listViewBtn.waitFor({ state: "visible", timeout: 5000 });
  await listViewBtn.click();
  await Promise.race([
    table.first().waitFor({ state: "visible", timeout: 8000 }),
    noDataLocator.first().waitFor({ state: "visible", timeout: 8000 }),
  ]).catch(() => {});
  console.log('  ✓ Switched back to List View');
}

/**
 * Extract the Total Leads count displayed at the center of the Donut Chart SVG.
 *
 * @param {import('@playwright/test').Page} page
 * @param {(text: string) => number} parseCountFn
 * @param {Object} [webelement]
 * @returns {Promise<number>}
 */
async function getChartTotalCount(page, parseCountFn, webelement = defaultWebElement) {
  const { countEl } = (webelement || defaultWebElement).pageElement(page);
  await countEl.waitFor({ state: "visible", timeout: 5000 });
  const countText = (await countEl.textContent())?.trim() || "0";
  return parseCountFn(countText);
}

/**
 * Scroll down to the Source Breakdown section and extract all rows with names and counts.
 * Uses atomic page.evaluate() for high-speed single-roundtrip extraction
 * with fallback to locator-based iteration.
 *
 * @param {import('@playwright/test').Page} page
 * @param {(text: string) => number} parseCountFn
 * @param {Object} [webelement]
 * @returns {Promise<Array<{index: number, sourceName: string, countText: string, count: number, hasCountButton: boolean}>>}
 */
async function getSourceBreakdownRows(page, parseCountFn, webelement = defaultWebElement) {
  const { breakdownH3, table } = (webelement || defaultWebElement).pageElement(page);

  await breakdownH3.first().scrollIntoViewIfNeeded();
  console.log('  ✓ Scrolled to "Source Breakdown" section');

  // Fast path: extract all breakdown rows in a single page.evaluate roundtrip
  try {
    const rawRows = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h3, h2, div')).find(
        (el) => /Source\s+Breakdown/i.test(el.textContent || '')
      );
      const container = heading ? heading.closest('section, div.space-y-4, div') || document : document;
      const tbl = container.querySelector('table') || document.querySelector('table');
      if (!tbl) return null;

      const trs = Array.from(tbl.querySelectorAll('tbody tr'));
      return trs.map((row, index) => {
        const isVisible = !!(row.offsetWidth || row.offsetHeight || row.getClientRects().length);
        if (!isVisible) return null;

        const firstTd = row.querySelector('td');
        let sourceName = '';
        if (firstTd) {
          const nameEl = firstTd.querySelector('.text-dark-200, span:last-child') || firstTd;
          sourceName = (nameEl.textContent || firstTd.innerText || '').trim();
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

    if (rawRows !== null && rawRows.length > 0) {
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
  } catch {}

  const rows = table;
  const rowCount = await rows.count();
  const breakdownRows = [];

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const isVisible = await row.isVisible().catch(() => false);
    if (!isVisible) continue;

    const sourceNameEl = row.locator("td").first().locator(".text-dark-200, span").last();
    let sourceName = (await sourceNameEl.textContent().catch(() => ""))?.trim() || "";
    if (!sourceName) {
      sourceName = (await row.locator("td").first().innerText().catch(() => ""))?.trim() || "";
    }

    const countButton = row.locator("td:nth-child(2) button");
    const hasCountButton = await countButton.isVisible().catch(() => false);
    const countText = hasCountButton
      ? (await countButton.textContent().catch(() => "0"))?.trim() || "0"
      : (await row.locator("td:nth-child(2)").textContent().catch(() => "0"))?.trim() || "0";

    let count = 0;
    try {
      count = parseCountFn(countText);
    } catch {
      count = 0;
    }

    breakdownRows.push({
      index: i,
      sourceName,
      countText,
      count,
      hasCountButton,
    });
  }

  return breakdownRows;
}

/**
 * Verify Chart View and Source Breakdown against List View data:
 * 1. Go to Chart View -> verify donut SVG Total Leads count matches List View total.
 * 2. Scroll to Source Breakdown -> verify each source count matches List View.
 * 3. Reconcile total counts across List View, Chart View, and Source Breakdown.
 * 4. Switch back to List View.
 *
 * @param {import('@playwright/test').Page} page
 * @param {(text: string) => number} parseCountFn
 * @param {Array} listViewRows - extracted rows from List View
 * @param {string} [scenarioName="Today"]
 * @param {Object} [webelement]
 * @returns {Promise<Object>} validation result
 */
async function verifyChartViewAndBreakdown(
  page,
  parseCountFn,
  listViewRows,
  scenarioName = "Today",
  webelement = defaultWebElement
) {
  console.log(`\n--- [${scenarioName}] Verifying Chart View & Source Breakdown ---`);

  // 1. Calculate List View Total
  const listViewTotal = listViewRows.reduce((sum, r) => sum + r.count, 0);

  // 2. Switch to Chart View
  await switchToChartView(page, webelement);

  // 3. Extract and verify Donut Chart Total Leads count
  const chartTotal = await getChartTotalCount(page, parseCountFn, webelement);
  console.log(`  Chart View Total Leads: ${chartTotal} (List View Total: ${listViewTotal})`);
  if (chartTotal !== listViewTotal) {
    const err = `Chart total mismatch for [${scenarioName}]: Chart View = ${chartTotal}, List View = ${listViewTotal}`;
    console.error(`  ✗ ${err}`);
    throw new Error(err);
  }
  console.log(`  ✓ Chart View Total Leads (${chartTotal}) matches List View Total (${listViewTotal})`);

  // 4. Scroll down to Source Breakdown and extract rows
  const breakdownRows = await getSourceBreakdownRows(page, parseCountFn, webelement);
  console.log(`  Found ${breakdownRows.length} rows in Source Breakdown`);

  let breakdownTotal = 0;
  for (const bRow of breakdownRows) {
    breakdownTotal += bRow.count;
    const matched = listViewRows.find(
      (lRow) => lRow.sourceName.toLowerCase() === bRow.sourceName.toLowerCase()
    );
    if (matched && matched.count === bRow.count) {
      console.log(`    ✓ Source Breakdown: "${bRow.sourceName}" -> Count = ${bRow.count} (Matches List View)`);
    } else {
      const err = `Source count mismatch for "${bRow.sourceName}": Source Breakdown = ${bRow.count}, List View = ${matched?.count}`;
      console.error(`    ✗ ${err}`);
      throw new Error(err);
    }
  }

  // 5. Verify Breakdown Total
  if (breakdownTotal !== listViewTotal) {
    const err = `Source Breakdown total mismatch for [${scenarioName}]: Breakdown = ${breakdownTotal}, List View = ${listViewTotal}`;
    console.error(`  ✗ ${err}`);
    throw new Error(err);
  }

  // 6. 3-Way Reconciliation Summary
  console.log(`\n╔═══════════════════════════════════════════════════════════╗`);
  console.log(`║      TOTALS RECONCILIATION (${scenarioName.padEnd(20)}) ║`);
  console.log(`╠═══════════════════════════════════════════════════════════╣`);
  console.log(`║  List View Total:          ${String(listViewTotal).padEnd(30)}║`);
  console.log(`║  Chart View Total:         ${String(chartTotal).padEnd(30)}║`);
  console.log(`║  Source Breakdown Total:   ${String(breakdownTotal).padEnd(30)}║`);
  console.log(`║  Status:                   MATCH VERIFIED ✓              ║`);
  console.log(`╚═══════════════════════════════════════════════════════════╝\n`);

  // 7. Switch back to List View
  await switchToListView(page, webelement);

  return {
    scenario: scenarioName,
    source: "CHART_AND_BREAKDOWN",
    reportCount: listViewTotal,
    popupTotal: chartTotal,
    uniqueRecords: breakdownTotal,
    passed: true,
    message: `[${scenarioName}] Chart View (${chartTotal}) & Source Breakdown (${breakdownTotal}) match List View (${listViewTotal})`,
  };
}

module.exports = {
  switchToChartView,
  switchToListView,
  getChartTotalCount,
  getSourceBreakdownRows,
  verifyChartViewAndBreakdown,
};
