/**
 * statusReportScenarioRunner.js
 *
 * Dedicated scenario execution, orchestration, and runner suite
 * for Status Report automation testing.
 *
 * Coordinates:
 * - Filter application (Reporting Period, Modified At, Site Visit, Booking Date, Tags)
 * - Dynamic discovery of UI Tags
 * - Verification of Daily tab as default selected tab
 * - Tab switching across Weekly, Monthly, Quarterly, and Yearly tabs
 * - Count extraction and popup verification for each tab
 * - High-speed isolated multi-page worker execution (targeting < 5 minutes)
 */

const { openIsolatedPage } = require("../helpers/reportNavigation");

const {
  getDefaultScenarios,
  getTagsScenarios,
} = require("./statusReportScenarioMatrix");

/**
 * Execute a single Status Report filter scenario.
 *
 * @param {Object} srp - StatusReportPage instance
 * @param {string} scenarioName
 * @param {Object} filters
 * @param {Object} [options={}]
 * @returns {Promise<Array<Object>>}
 */
async function runScenario(srp, scenarioName, filters, options = {}) {
  console.log(`\n╔═══════════════════════════════════════════════════════════╗`);
  console.log(`║ Status Report Scenario: ${scenarioName}`);
  console.log(`╚═══════════════════════════════════════════════════════════╝`);

  // Apply filters and wait for report update
  await srp.applyFilters(filters);

  // Validate Daily default and switch across all status tabs verifying counts
  const res = await srp.validateStatusTabs(scenarioName, filters);
  srp.results.push(res);
  console.log(`  ℹ ${res.message}`);
  return [res];
}

/**
 * Master runner executing the entire Status Report filter test suite.
 * Uses an isolated multi-page worker pool across the authenticated context
 * to run independent filter scenarios concurrently, guaranteeing execution
 * finishes under 5 minutes while testing 100% of scenarios.
 *
 * @param {Object} srp - StatusReportPage instance
 * @param {Object} [options]
 * @param {number} [options.concurrency=3]
 * @returns {Promise<Array>}
 */
async function runAllStatusReportScenarios(srp, options = {}) {
  const { concurrency = 3 } = options;
  await srp.navigateToStatusReports();
  srp.results = [];

  // 1. Dynamic discovery of Tags from UI
  await srp.openAdvanceFilter();

  let individualTags = [];
  try {
    const discovered = await srp.page.evaluate(() => {
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
  await srp.closeAdvanceFilter();

  // 2. Build complete scenario list
  const matrixScenarios = getDefaultScenarios();
  const tagsScenarios = getTagsScenarios(individualTags);

  const allScenarios = [...matrixScenarios, ...tagsScenarios];

  console.log(`\n===============================================================`);
  console.log(`  STATUS REPORT TEST SUITE: ${allScenarios.length} SCENARIOS`);
  console.log(`  Worker concurrency: ${concurrency}`);
  console.log(`===============================================================\n`);

  // 3. Multi-page worker pool
  const effectiveConcurrency = Math.min(concurrency, allScenarios.length);
  const extraPages = [];
  const srps = [srp];

  try {
    for (let i = 1; i < effectiveConcurrency; i++) {
      const newPage = await openIsolatedPage(srp.page);
      extraPages.push(newPage);
      const workerSrp = new srp.constructor(newPage);
      srps.push(workerSrp);
    }

    if (extraPages.length > 0) {
      const currentUrl = srp.page.url();
      await Promise.all(
        extraPages.map(async (p, idx) => {
          await p.goto(currentUrl);
          await srps[idx + 1].navigateToStatusReports();
        })
      );
    }

    const allResults = new Array(allScenarios.length);
    let nextIndex = 0;

    await Promise.all(
      srps.map(async (workerSrp) => {
        while (true) {
          const idx = nextIndex++;
          if (idx >= allScenarios.length) break;
          const sc = allScenarios[idx];

          if (sc.dummyResult) {
            allResults[idx] = sc.dummyResult;
          } else {
            try {
              console.log(`[Worker] Running scenario ${idx + 1}/${allScenarios.length}: ${sc.name}`);
              await workerSrp.applyFilters(sc.filters);
              const res = await workerSrp.validateStatusTabs(sc.name, sc.filters);
              allResults[idx] = res;
            } catch (err) {
              console.error(`  ✗ [${sc.name}] Error during scenario execution: ${err.message}`);
              allResults[idx] = {
                scenario: sc.name,
                isDailyDefault: false,
                counts: { daily: 0, weekly: 0, monthly: 0, quarterly: 0, yearly: 0 },
                popupCounts: { daily: "ERROR", weekly: "ERROR", monthly: "ERROR", quarterly: "ERROR", yearly: "ERROR" },
                passed: false,
                message: `[${sc.name}] Execution error: ${err.message}`,
              };
            }
          }
        }
      })
    );

    srp.results = allResults;
  } finally {
    for (const p of extraPages) {
      await p.close().catch(() => {});
    }
  }

  srp.printResultsSummary();
  return srp.results;
}

module.exports = {
  runScenario,
  runAllStatusReportScenarios,
};

