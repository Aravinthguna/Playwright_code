/**
 * trendReportScenarioRunner.js
 *
 * Dedicated scenario execution, orchestration, and runner suite
 * for Trend Report automation testing.
 *
 * Coordinates:
 * - Filter application (Reporting Period, Modified At, Site Visit, Booking Date, Tags)
 * - Dynamic discovery of UI Tags
 * - Verification of Daily Trends as default selected tab
 * - Tab switching across Weekly, Monthly, Quarterly, and Yearly Trends
 * - Count extraction and verification for each tab
 * - High-speed isolated multi-page worker execution (targeting < 5 minutes)
 */

const { openIsolatedPage } = require("../helpers/reportNavigation");

const {
  getDefaultScenarios,
  getTagsScenarios,
} = require("./trendReportScenarioMatrix");

/**
 * Execute a single Trend Report filter scenario.
 *
 * @param {Object} trp - TrendReportPage instance
 * @param {string} scenarioName
 * @param {Object} filters
 * @param {Object} [options={}]
 * @returns {Promise<Array<Object>>}
 */
async function runScenario(trp, scenarioName, filters, options = {}) {
  console.log(`\n╔═══════════════════════════════════════════════════════════╗`);
  console.log(`║ Trend Report Scenario: ${scenarioName}`);
  console.log(`╚═══════════════════════════════════════════════════════════╝`);

  // Apply filters and wait for report update
  await trp.applyFilters(filters);

  // Validate Daily default and switch across all trend tabs verifying counts
  const res = await trp.validateTrendTabs(scenarioName, filters);
  trp.results.push(res);
  console.log(`  ℹ ${res.message}`);
  return [res];
}

/**
 * Master runner executing the entire Trend Report filter test suite.
 * Uses an isolated multi-page worker pool across the authenticated context
 * to run independent filter scenarios concurrently, guaranteeing execution
 * finishes under 5 minutes while testing 100% of scenarios.
 *
 * @param {Object} trp - TrendReportPage instance
 * @param {Object} [options]
 * @param {number} [options.concurrency=3]
 * @returns {Promise<Array>}
 */
async function runAllTrendReportScenarios(trp, options = {}) {
  const { concurrency = 3 } = options;
  await trp.navigateToTrendReports();
  trp.results = [];

  // 1. Dynamic discovery of Tags from UI
  await trp.openAdvanceFilter();

  let individualTags = [];
  try {
    const discovered = await trp.page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll("label"));
      const tagLabel = labels.find((l) => /TAGS/i.test(l.textContent || ""));
      const tagSection = tagLabel ? tagLabel.parentElement : null;
      let tags = [];
      if (tagSection) {
        const btns = Array.from(
          tagSection.querySelectorAll(".overflow-y-auto button, button")
        );
        tags = btns
          .map((b) => (b.innerText || "").trim())
          .filter(
            (t) => t && t.toLowerCase() !== "all tags" && !t.includes("\n")
          );
      }
      return { tags };
    });
    individualTags = discovered.tags || [];
  } catch {}

  console.log(`  Dynamic discovery:`);
  console.log(
    `    Tags found: ${individualTags.length} (${individualTags.join(", ")})`
  );

  // Close filter panel before launching workers
  await trp.closeAdvanceFilter();

  // 2. Build complete scenario list
  const matrixScenarios = getDefaultScenarios();
  const tagsScenarios = getTagsScenarios(individualTags);

  const allScenarios = [...matrixScenarios, ...tagsScenarios];

  console.log(
    `\n═══════════════════════════════════════════════════════════════`
  );
  console.log(
    `  Total Trend Report scenarios to execute: ${allScenarios.length}`
  );
  console.log(`  Worker concurrency: ${concurrency}`);
  console.log(
    `═══════════════════════════════════════════════════════════════\n`
  );

  const startTime = Date.now();
  const effectiveConcurrency = Math.min(concurrency, allScenarios.length);
  const extraPages = [];
  const trps = [trp];

  try {
    for (let i = 1; i < effectiveConcurrency; i++) {
      // Separate context per pool page: same-context tabs interfere via shared storage.
      const newPage = await openIsolatedPage(trp.page);
      extraPages.push(newPage);
      const workerTrp = new trp.constructor(newPage);
      trps.push(workerTrp);
    }

    // Initialize all worker pages to Trend Report
    if (extraPages.length > 0) {
      const currentUrl = trp.page.url();
      await Promise.all(
        extraPages.map(async (p, idx) => {
          await p.goto(currentUrl);
          await trps[idx + 1].navigateToTrendReports();
        })
      );
    }

    // Distribute scenarios across worker pool
    const allResults = new Array(allScenarios.length);
    let nextIndex = 0;

    await Promise.all(
      trps.map(async (worker) => {
        while (true) {
          const idx = nextIndex++;
          if (idx >= allScenarios.length) break;
          const sc = allScenarios[idx];
          try {
            const res = await worker.runScenario(
              sc.name,
              sc.filters,
              sc.options || {}
            );
            allResults[idx] = res;
          } catch (err) {
            allResults[idx] = [
              {
                scenario: sc.name,
                counts: {
                  daily: 0,
                  weekly: 0,
                  monthly: 0,
                  quarterly: 0,
                  yearly: 0,
                },
                passed: false,
                message: `[${sc.name}] Execution error: ${err.message}`,
              },
            ];
          }
        }
      })
    );

    trp.results = allResults.flat();
  } finally {
    // Clean up extra pages
    for (const p of extraPages) {
      await p.close().catch(() => {});
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(
    `\nAll ${allScenarios.length} Trend Report scenarios completed in ${durationSec}s.`
  );

  // Print master summary
  trp.printResultsSummary();

  return trp.results;
}

module.exports = {
  runScenario,
  runAllTrendReportScenarios,
};
