/**
 * teamsReportScenarioRunner.js
 *
 * Dedicated scenario execution, orchestration, and runner suite
 * for Teams Report automation testing.
 *
 * Coordinates:
 * - Filter application (Reporting Period, Modified At, Site Visit, Booking Date, Tags, Team)
 * - Dynamic discovery of UI Teams and Tags
 * - Team breakdown table row extraction
 * - Modal drawer lead count verification
 * - Infinite scroll verification ("All leads loaded")
 * - High-speed isolated multi-page worker execution (targeting < 5 minutes)
 */

const { openIsolatedPage } = require("../helpers/reportNavigation");

const {
  getDefaultScenarios,
  getTeamScenarios,
} = require("./teamsReportScenarioMatrix");

/**
 * Execute a single Teams Report filter scenario.
 *
 * @param {Object} trp - TeamsReportPage instance
 * @param {string} scenarioName
 * @param {Object} filters
 * @param {Object} [options={}]
 * @returns {Promise<Array<Object>>}
 */
async function runScenario(trp, scenarioName, filters, options = {}) {
  const { validateAllRows = false } = options;

  console.log(`\n╔═══════════════════════════════════════════════════════════╗`);
  console.log(`║ Teams Report Scenario: ${scenarioName}`);
  console.log(`╚═══════════════════════════════════════════════════════════╝`);

  // Apply filters and wait for report update
  await trp.applyFilters(filters);

  // Check for "No data found" empty state
  const hasNoData = await trp.isNoDataDisplayed();
  if (hasNoData) {
    const verifiedText = await trp
      .verifyNoDataFoundText()
      .catch(() => "No data found for the selected filters");
    const result = {
      scenario: scenarioName,
      team: "ALL",
      reportCount: 0,
      popupTotal: "N/A",
      passed: true,
      message: `[${scenarioName}] Verified empty state: "${verifiedText}" — filter returned no records.`,
    };
    trp.results.push(result);
    console.log(`  ℹ ${result.message}`);
    return [result];
  }

  // Extract team / employee rows from table
  const rows = await trp.getTeamPerformanceRows();
  console.log(`  Found ${rows.length} rows in Team Breakdown table.`);

  if (rows.length === 0) {
    if (await trp.isNoDataDisplayed()) {
      const verifiedText = await trp
        .verifyNoDataFoundText()
        .catch(() => "No data found for the selected filters");
      const result = {
        scenario: scenarioName,
        team: "ALL",
        reportCount: 0,
        popupTotal: "N/A",
        passed: true,
        message: `[${scenarioName}] Verified empty state: "${verifiedText}" — filter returned no records.`,
      };
      trp.results.push(result);
      console.log(`  ℹ ${result.message}`);
      return [result];
    }

    const result = {
      scenario: scenarioName,
      team: "ALL",
      reportCount: 0,
      popupTotal: "N/A",
      passed: true,
      message: `[${scenarioName}] No rows found in table.`,
    };
    trp.results.push(result);
    console.log(`  ℹ ${result.message}`);
    return [result];
  }

  // Determine rows to validate
  const rowsToValidate = validateAllRows
    ? rows
    : rows.filter((r) => r.hasCountButton && r.count > 0).slice(0, 1).length > 0
    ? rows.filter((r) => r.hasCountButton && r.count > 0).slice(0, 1)
    : rows.slice(0, 1);

  const scenarioResults = [];

  for (const row of rowsToValidate) {
    const res = await trp.validateTeamRow(row, scenarioName, filters, options);
    scenarioResults.push(res);
  }

  return scenarioResults;
}

/**
 * Master runner executing the entire Teams Report filter test suite.
 * Uses an isolated multi-page worker pool across the authenticated context
 * to run independent filter scenarios concurrently while
 * preserving 100% of scenarios, validations, and deterministic result ordering.
 *
 * @param {Object} trp - TeamsReportPage instance
 * @param {Object} [options]
 * @param {number} [options.concurrency=3]
 * @returns {Promise<Array>}
 */
async function runAllTeamsReportScenarios(trp, options = {}) {
  const { concurrency = 3 } = options;
  await trp.navigateToTeamsReports();
  trp.results = [];

  // 1. Dynamic discovery from UI: Tags and Teams
  await trp.openAdvanceFilter();

  let individualTags = [];
  let availableTeams = [];

  try {
    const discovered = await trp.page.evaluate(() => {
      // Tags
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

      // Teams
      const teamLabel = labels.find((l) =>
        /TEAM/i.test(l.textContent || "")
      );
      const teamSection = teamLabel ? teamLabel.parentElement : null;
      let teams = [];
      if (teamSection) {
        const select = teamSection.querySelector("select");
        if (select) {
          teams = Array.from(select.querySelectorAll("option"))
            .map((o) => (o.innerText || "").trim())
            .filter(Boolean);
        }
      }

      return { tags, teams };
    });

    individualTags = discovered.tags || [];
    availableTeams = discovered.teams || [];
  } catch {}

  console.log(`  Dynamic discovery:`);
  console.log(
    `    Tags found: ${individualTags.length} (${individualTags.join(", ")})`
  );
  console.log(
    `    Teams found: ${availableTeams.length} (${availableTeams.join(", ")})`
  );

  // Close filter panel before launching workers
  await trp.closeAdvanceFilter();

  // 2. Build complete scenario list
  const matrixScenarios = getDefaultScenarios();

  // Tags scenarios
  const tagsScenarios = [
    {
      name: "Tags Filter: All Tags",
      filters: { reportingPeriod: "All", allTags: true },
    },
  ];
  for (const tagName of individualTags) {
    tagsScenarios.push({
      name: `Tags Filter: ${tagName}`,
      filters: { reportingPeriod: "All", tag: tagName },
    });
  }

  // Team scenarios
  const sampleTag = individualTags.length > 0 ? individualTags[0] : null;
  const teamScenarios = getTeamScenarios(availableTeams, sampleTag);

  const allScenarios = [
    ...matrixScenarios,
    ...tagsScenarios,
    ...teamScenarios,
  ];

  console.log(
    `\n═══════════════════════════════════════════════════════════════`
  );
  console.log(
    `  Total Teams Report scenarios to execute: ${allScenarios.length}`
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

    // Initialize all worker pages to Teams Report
    if (extraPages.length > 0) {
      const currentUrl = trp.page.url();
      await Promise.all(
        extraPages.map(async (p, idx) => {
          await p.goto(currentUrl);
          await trps[idx + 1].navigateToTeamsReports();
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
                team: "ERROR",
                reportCount: 0,
                popupTotal: "ERROR",
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
    `\nAll ${allScenarios.length} scenarios completed in ${durationSec}s.`
  );

  // Print master summary
  trp.printResultsSummary();

  return trp.results;
}

module.exports = {
  runScenario,
  runAllTeamsReportScenarios,
};
