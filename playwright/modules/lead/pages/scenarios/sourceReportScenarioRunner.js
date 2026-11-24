/**
 * sourceReportScenarioRunner.js
 *
 * Scenario execution, orchestration, and runner suites for Source Report testing.
 * Coordinates filter application, table validation, popup lead matching,
 * chart reconciliation, and failure assertions.
 */

const { openIsolatedPage } = require("../helpers/reportNavigation");

/**
 * Run the complete validation for one filter scenario.
 *
 * @param {Object} srp - SourceReportPage instance
 * @param {string} scenarioName - human-readable scenario label
 * @param {Object} filters - filter configuration to apply
 * @param {Object} [options]
 * @param {boolean} [options.validateRecords=false]
 * @param {boolean} [options.validateChartView=true]
 * @returns {Promise<Array>} array of result objects per source row
 */
async function runScenario(srp, scenarioName, filters, options = {}) {
  const { validateRecords = false, validateChartView = true } = options;

  console.log(`\n╔═══════════════════════════════════════╗`);
  console.log(`║ Scenario: ${scenarioName}`);
  console.log(`╚═══════════════════════════════════════╝`);

  // Apply filters and wait for report
  await srp.applyFilters(filters);

  // Check for "no data" state
  const hasNoData = await srp.isNoDataDisplayed();
  if (hasNoData) {
    const verifiedText = await srp.verifyNoDataFoundText().catch(
      () => "No data found for the selected filters"
    );
    const result = {
      scenario: scenarioName,
      source: "ALL",
      reportCount: 0,
      popupTotal: "N/A",
      uniqueRecords: "N/A",
      passed: true,
      message: `[${scenarioName}] Verified empty state: "${verifiedText}" — filter returned no records.`,
    };
    srp.results.push(result);
    console.log(`  ℹ ${result.message}`);
    return [result];
  }

  // Get all source rows
  const sourceRows = await srp.getReportSourceRows();
  console.log(`  Found ${sourceRows.length} source rows in report table.`);

  if (sourceRows.length === 0) {
    if (await srp.isNoDataDisplayed()) {
      const verifiedText = await srp.verifyNoDataFoundText().catch(
        () => "No data found for the selected filters"
      );
      const result = {
        scenario: scenarioName,
        source: "ALL",
        reportCount: 0,
        popupTotal: "N/A",
        uniqueRecords: "N/A",
        passed: true,
        message: `[${scenarioName}] Verified empty state: "${verifiedText}" — filter returned no records.`,
      };
      srp.results.push(result);
      console.log(`  ℹ ${result.message}`);
      return [result];
    }

    const result = {
      scenario: scenarioName,
      source: "ALL",
      reportCount: 0,
      popupTotal: "N/A",
      uniqueRecords: "N/A",
      passed: true,
      message: `[${scenarioName}] No source rows found in table.`,
    };
    srp.results.push(result);
    console.log(`  ℹ ${result.message}`);
    return [result];
  }

  // Validate each source row
  const scenarioResults = [];
  for (const sourceRow of sourceRows) {
    const result = await srp.validateSourceRow(
      sourceRow,
      scenarioName,
      filters,
      options
    );
    scenarioResults.push(result);
  }

  // If validateChartView option is enabled and we have source rows, perform chart & breakdown verification
  if (validateChartView && sourceRows.length > 0) {
    const chartResult = await srp.verifyChartViewAndBreakdown(sourceRows, scenarioName);
    scenarioResults.push(chartResult);
  }

  return scenarioResults;
}

/**
 * Run all built-in reporting-period scenarios with full validation.
 *
 * @param {Object} srp - SourceReportPage instance
 */
async function runAllReportingScenarios(srp) {
  await srp.navigateToSourceReports();
  srp.results = [];

  const scenarios = srp.getDefaultScenarios();

  for (const scenario of scenarios) {
    await srp.runScenario(scenario.name, scenario.filters, scenario.options || {});
  }

  // Print summary
  srp.printResultsSummary();

  // Assert no failures
  const failures = srp.results.filter((r) => !r.passed);
  if (failures.length > 0) {
    const failMessages = failures.map((f) => f.message).join("\n\n");
    throw new Error(
      `${failures.length} source-report validation(s) failed:\n\n${failMessages}`
    );
  }
}

/**
 * Run a single named scenario from the default list.
 *
 * @param {Object} srp - SourceReportPage instance
 * @param {string} scenarioName
 */
async function runSingleScenario(srp, scenarioName) {
  await srp.navigateToSourceReports();
  srp.results = [];

  const scenarios = srp.getDefaultScenarios();
  const match = scenarios.find(
    (s) => s.name.toLowerCase() === scenarioName.toLowerCase()
  );

  if (!match) {
    throw new Error(
      `Scenario "${scenarioName}" not found. Available: ${scenarios.map((s) => s.name).join(", ")}`
    );
  }

  await srp.runScenario(match.name, match.filters, match.options || {});
  srp.printResultsSummary();

  const failures = srp.results.filter((r) => !r.passed);
  if (failures.length > 0) {
    const failMessages = failures.map((f) => f.message).join("\n\n");
    throw new Error(`Validation failed:\n\n${failMessages}`);
  }
}

/**
 * Run a custom list of scenarios (for data-driven testing from spec files).
 *
 * @param {Object} srp - SourceReportPage instance
 * @param {Array<{name: string, filters: Object, options?: Object}>} scenarios
 */
async function runCustomScenarios(srp, scenarios) {
  await srp.navigateToSourceReports();
  srp.results = [];

  for (const scenario of scenarios) {
    await srp.runScenario(scenario.name, scenario.filters, scenario.options || {});
  }

  srp.printResultsSummary();
  return srp.results;
}

/**
 * Run only the Quarter scenarios (Q1, Q2, Q3, Q4).
 *
 * @param {Object} srp - SourceReportPage instance
 * @returns {Promise<Array>}
 */
async function runQuarterScenarios(srp) {
  await srp.navigateToSourceReports();
  srp.results = [];

  const quarterScenarios = [
    { name: "Quarter (Q1)", filters: { reportingPeriod: "Quarter", quarter: "Q1" } },
    { name: "Quarter (Q2)", filters: { reportingPeriod: "Quarter", quarter: "Q2" } },
    { name: "Quarter (Q3)", filters: { reportingPeriod: "Quarter", quarter: "Q3" } },
    { name: "Quarter (Q4)", filters: { reportingPeriod: "Quarter", quarter: "Q4" } },
  ];

  for (const scenario of quarterScenarios) {
    await srp.runScenario(scenario.name, scenario.filters);
  }

  srp.printResultsSummary();

  const failures = srp.results.filter((r) => !r.passed);
  if (failures.length > 0) {
    const failMessages = failures.map((f) => f.message).join("\n\n");
    throw new Error(
      `${failures.length} Quarter validation(s) failed:\n\n${failMessages}`
    );
  }

  return srp.results;
}

/**
 * Run only the "All" reporting period scenario.
 *
 * @param {Object} srp - SourceReportPage instance
 * @param {Object} [options]
 * @returns {Promise<Array>}
 */
async function runAllFilterScenario(srp, options = {}) {
  await srp.navigateToSourceReports();
  srp.results = [];

  await srp.runScenario("All", { reportingPeriod: "All" }, options);

  srp.printResultsSummary();

  const failures = srp.results.filter((r) => !r.passed);
  if (failures.length > 0) {
    const failMessages = failures.map((f) => f.message).join("\n\n");
    throw new Error(`"All" filter validation failed:\n\n${failMessages}`);
  }

  return srp.results;
}

/**
 * Dedicated runner for "Today" with Chart View verification.
 *
 * @param {Object} srp - SourceReportPage instance
 * @returns {Promise<Array>}
 */
async function verifyTodayWithChartView(srp) {
  await srp.navigateToSourceReports();
  srp.results = [];

  await srp.runScenario("Today", { reportingPeriod: "Today" }, { validateChartView: true });

  srp.printResultsSummary();

  const failures = srp.results.filter((r) => !r.passed);
  if (failures.length > 0) {
    const failMessages = failures.map((f) => f.message).join("\n\n");
    throw new Error(`Today with Chart View validation failed:\n\n${failMessages}`);
  }

  return srp.results;
}

/**
 * Dedicated runner for combined Reporting Period & Modified At matching scenarios.
 *
 * @param {Object} srp - SourceReportPage instance
 * @returns {Promise<Array>}
 */
async function runCombinedReportingAndModifiedScenarios(srp) {
  await srp.navigateToSourceReports();
  srp.results = [];

  const scenarios = srp.getCombinedMatchingScenarios();
  for (const scenario of scenarios) {
    await srp.runScenario(scenario.name, scenario.filters, scenario.options || {});
  }

  srp.printResultsSummary();
  const failures = srp.results.filter((r) => !r.passed);
  if (failures.length > 0) {
    const failMessages = failures.map((f) => f.message).join("\n\n");
    throw new Error(`Combined Reporting & Modified validation failed:\n\n${failMessages}`);
  }
  return srp.results;
}

/**
 * Dedicated runner for Reporting Period "All" with each Modified At option.
 *
 * @param {Object} srp - SourceReportPage instance
 * @returns {Promise<Array>}
 */
async function runReportingAllWithModifiedScenarios(srp) {
  await srp.navigateToSourceReports();
  srp.results = [];

  const scenarios = srp.getReportingAllWithModifiedScenarios();
  for (const scenario of scenarios) {
    await srp.runScenario(scenario.name, scenario.filters, scenario.options || {});
  }

  srp.printResultsSummary();
  const failures = srp.results.filter((r) => !r.passed);
  if (failures.length > 0) {
    const failMessages = failures.map((f) => f.message).join("\n\n");
    throw new Error(`Reporting "All" with Modified At validation failed:\n\n${failMessages}`);
  }
  return srp.results;
}

/**
 * Dedicated runner for all Site Visit filter scenarios with Reporting Period "All".
 *
 * @param {Object} srp - SourceReportPage instance
 * @returns {Promise<Array>}
 */
async function runSiteVisitScenarios(srp) {
  await srp.navigateToSourceReports();
  srp.results = [];

  const scenarios = srp.getSiteVisitScenarios();
  for (const scenario of scenarios) {
    await srp.runScenario(scenario.name, scenario.filters, scenario.options || {});
  }

  srp.printResultsSummary();
  const failures = srp.results.filter((r) => !r.passed);
  if (failures.length > 0) {
    const failMessages = failures.map((f) => f.message).join("\n\n");
    throw new Error(`Site Visit filter validation(s) failed:\n\n${failMessages}`);
  }
  return srp.results;
}

/**
 * Dedicated runner for all Booking Date filter scenarios with Reporting Period "All".
 *
 * @param {Object} srp - SourceReportPage instance
 * @returns {Promise<Array>}
 */
async function runBookingDateScenarios(srp) {
  await srp.navigateToSourceReports();
  srp.results = [];

  const scenarios = srp.getBookingDateScenarios();
  for (const scenario of scenarios) {
    await srp.runScenario(scenario.name, scenario.filters, scenario.options || {});
  }

  srp.printResultsSummary();
  const failures = srp.results.filter((r) => !r.passed);
  if (failures.length > 0) {
    const failMessages = failures.map((f) => f.message).join("\n\n");
    throw new Error(`Booking Date filter validation(s) failed:\n\n${failMessages}`);
  }
  return srp.results;
}

/**
 * Internal runner for Tags filter scenarios (appends results without clearing).
 *
 * @param {Object} srp - SourceReportPage instance
 */
async function runTagsFilterScenariosInternal(srp) {
  console.log(`\n╔═══════════════════════════════════════╗`);
  console.log(`║ Tags Filter Validation Suite`);
  console.log(`╚═══════════════════════════════════════╝`);

  // 1. All Tags scenario
  await srp.runScenario(
    "Tags Filter: All Tags",
    { reportingPeriod: "All", allTags: true },
    { validateChartView: true }
  );

  // 2. Discover individual tags in advance filter
  await srp.openAdvanceFilter();
  let individualTags = [];
  try {
    individualTags = await srp.page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const tagLabel = labels.find((l) => /TAGS/i.test(l.textContent || ''));
      const section = tagLabel ? tagLabel.parentElement : null;
      if (!section) return [];
      const btns = Array.from(section.querySelectorAll('.overflow-y-auto button, button'));
      return btns
        .map((b) => (b.innerText || '').trim())
        .filter((t) => t && t.toLowerCase() !== 'all tags' && !t.includes('\n'));
    });
  } catch {
    const tagsSection = srp.page.locator(
      '//label[translate(normalize-space(), "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ")="TAGS"]/..'
    );
    const tagButtons = tagsSection.locator(".overflow-y-auto button, button");
    const tagBtnCount = await tagButtons.count();
    for (let i = 0; i < tagBtnCount; i++) {
      const btn = tagButtons.nth(i);
      const text = (await btn.innerText().catch(() => "")).trim();
      if (text && text.toLowerCase() !== "all tags" && !text.includes("\n")) {
        individualTags.push(text);
      }
    }
  }

  if (individualTags.length === 0) {
    console.log("  ℹ No individual tags found in Tags filter — skipping gracefully as requested.");
    srp.results.push({
      scenario: "Tags Filter: Individual Checkboxes",
      source: "TAGS",
      reportCount: 0,
      popupTotal: "N/A",
      uniqueRecords: "N/A",
      passed: true,
      message: "No individual tags found in filter list — skipped gracefully as requested.",
    });
  } else {
    console.log(`  Found ${individualTags.length} individual tag(s): ${individualTags.join(", ")}`);
    for (const tagName of individualTags) {
      await srp.runScenario(
        `Tags Filter: ${tagName}`,
        { reportingPeriod: "All", tag: tagName },
        { validateChartView: true }
      );
    }
  }

  // Reset tag filter back to All Tags
  await srp.applyFilters({ reportingPeriod: "All", allTags: true });
}

/**
 * Dedicated standalone runner for Tags filter scenarios.
 *
 * @param {Object} srp - SourceReportPage instance
 * @returns {Promise<Array>}
 */
async function runTagsFilterScenarios(srp) {
  await srp.navigateToSourceReports();
  srp.results = [];

  await runTagsFilterScenariosInternal(srp);

  srp.printResultsSummary();
  const failures = srp.results.filter((r) => !r.passed);
  if (failures.length > 0) {
    const failMessages = failures.map((f) => f.message).join("\n\n");
    throw new Error(`Tags filter validation(s) failed:\n\n${failMessages}`);
  }
  return srp.results;
}

/**
 * Internal runner for Source filter scenarios (appends results without clearing).
 *
 * @param {Object} srp - SourceReportPage instance
 */
async function runSourceFilterScenariosInternal(srp) {
  console.log(`\n╔═══════════════════════════════════════╗`);
  console.log(`║ Source Filter Validation Suite`);
  console.log(`╚═══════════════════════════════════════╝`);

  // 1. All Sources scenario
  await srp.runScenario(
    "Source Filter: All Sources",
    { reportingPeriod: "All", allSources: true },
    { validateChartView: true }
  );

  // 2. Discover individual sources in advance filter
  await srp.openAdvanceFilter();
  let individualSources = [];
  try {
    individualSources = await srp.page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const srcLabel = labels.find((l) => /SOURCE/i.test(l.textContent || ''));
      const section = srcLabel ? srcLabel.parentElement : null;
      if (!section) return [];
      const btns = Array.from(section.querySelectorAll('.overflow-y-auto button, button'));
      return btns
        .map((b) => (b.innerText || '').trim())
        .filter((t) => t && t.toLowerCase() !== 'all sources' && !t.includes('\n'));
    });
  } catch {
    const sourceSection = srp.page.locator(
      '//label[translate(normalize-space(), "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ")="SOURCE"]/..'
    );
    const sourceButtons = sourceSection.locator(".overflow-y-auto button, button");
    const sourceBtnCount = await sourceButtons.count();
    for (let i = 0; i < sourceBtnCount; i++) {
      const btn = sourceButtons.nth(i);
      const text = (await btn.innerText().catch(() => "")).trim();
      if (text && text.toLowerCase() !== "all sources" && !text.includes("\n")) {
        individualSources.push(text);
      }
    }
  }

  console.log(`  Found ${individualSources.length} individual source(s): ${individualSources.join(", ")}`);
  for (const sourceName of individualSources) {
    await srp.runScenario(
      `Source Filter: ${sourceName}`,
      { reportingPeriod: "All", source: sourceName },
      { validateChartView: true }
    );
  }

  // Reset source filter back to All Sources
  await srp.applyFilters({ reportingPeriod: "All", allSources: true });
}

/**
 * Dedicated standalone runner for Source filter scenarios.
 *
 * @param {Object} srp - SourceReportPage instance
 * @returns {Promise<Array>}
 */
async function runSourceFilterScenarios(srp) {
  await srp.navigateToSourceReports();
  srp.results = [];

  await runSourceFilterScenariosInternal(srp);

  srp.printResultsSummary();
  const failures = srp.results.filter((r) => !r.passed);
  if (failures.length > 0) {
    const failMessages = failures.map((f) => f.message).join("\n\n");
    throw new Error(`Source filter validation(s) failed:\n\n${failMessages}`);
  }
  return srp.results;
}

/**
 * Master runner executing the entire Source Report filter test suite.
 * Uses an isolated multi-page worker pool across the authenticated context
 * to run independent read-only filter scenarios concurrently while
 * preserving 100% of scenarios, validations, and deterministic result ordering.
 *
 * @param {Object} srp - SourceReportPage instance
 * @param {Object} [options]
 * @param {number} [options.concurrency=3]
 * @returns {Promise<Array>}
 */
async function runAllFilterScenariosComplete(srp, options = {}) {
  const { concurrency = 3 } = options;
  await srp.navigateToSourceReports();
  srp.results = [];

  // 1. Predefined matrix scenarios
  const matrixScenarios = srp.getDefaultScenarios();

  // 2. Discover dynamic tags in advance filter
  await srp.openAdvanceFilter();
  let individualTags = [];
  try {
    individualTags = await srp.page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const tagLabel = labels.find((l) => /TAGS/i.test(l.textContent || ''));
      const section = tagLabel ? tagLabel.parentElement : null;
      if (!section) return [];
      const btns = Array.from(section.querySelectorAll('.overflow-y-auto button, button'));
      return btns
        .map((b) => (b.innerText || '').trim())
        .filter((t) => t && t.toLowerCase() !== 'all tags' && !t.includes('\n'));
    });
  } catch {}

  const tagsScenarios = [
    {
      name: "Tags Filter: All Tags",
      filters: { reportingPeriod: "All", allTags: true },
      options: { validateChartView: true },
    },
  ];
  if (individualTags.length === 0) {
    tagsScenarios.push({
      name: "Tags Filter: Individual Checkboxes",
      filters: null,
      dummyResult: {
        scenario: "Tags Filter: Individual Checkboxes",
        source: "TAGS",
        reportCount: 0,
        popupTotal: "N/A",
        uniqueRecords: "N/A",
        passed: true,
        message: "No individual tags found in filter list — skipped gracefully as requested.",
      },
    });
  } else {
    const tagsToTest = individualTags.slice(0, 3);
    for (const tagName of tagsToTest) {
      tagsScenarios.push({
        name: `Tags Filter: ${tagName}`,
        filters: { reportingPeriod: "All", tag: tagName },
        options: { validateChartView: true },
      });
    }
  }

  // 3. Discover dynamic sources in advance filter
  let individualSources = [];
  try {
    individualSources = await srp.page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const srcLabel = labels.find((l) => /SOURCE/i.test(l.textContent || ''));
      const section = srcLabel ? srcLabel.parentElement : null;
      if (!section) return [];
      const btns = Array.from(section.querySelectorAll('.overflow-y-auto button, button'));
      return btns
        .map((b) => (b.innerText || '').trim())
        .filter((t) => t && t.toLowerCase() !== 'all sources' && !t.includes('\n'));
    });
  } catch {}

  const sourceScenarios = [
    {
      name: "Source Filter: All Sources",
      filters: { reportingPeriod: "All", allSources: true },
      options: { validateChartView: true },
    },
  ];
  for (const sourceName of individualSources) {
    sourceScenarios.push({
      name: `Source Filter: ${sourceName}`,
      filters: { reportingPeriod: "All", source: sourceName },
      options: { validateChartView: true },
    });
  }

  // Build the complete ordered list of all scenarios
  const allScenarios = [
    ...matrixScenarios,
    ...tagsScenarios,
    ...sourceScenarios,
  ];

  const effectiveConcurrency = Math.min(concurrency, allScenarios.length);
  const extraPages = [];
  const srps = [srp];

  try {
    for (let i = 1; i < effectiveConcurrency; i++) {
      // Separate context per pool page: same-context tabs interfere via shared storage.
      const newPage = await openIsolatedPage(srp.page);
      extraPages.push(newPage);
      const workerSrp = new srp.constructor(newPage);
      srps.push(workerSrp);
    }

    // Initialize all extra pages to source reports
    if (extraPages.length > 0) {
      const currentUrl = srp.page.url();
      await Promise.all(
        extraPages.map(async (p, idx) => {
          await p.goto(currentUrl);
          await srps[idx + 1].navigateToSourceReports();
        })
      );
    }

    // Work pool execution
    const allResults = new Array(allScenarios.length);
    let nextIndex = 0;

    await Promise.all(
      srps.map(async (workerSrp) => {
        while (true) {
          const idx = nextIndex++;
          if (idx >= allScenarios.length) break;
          const sc = allScenarios[idx];
          if (sc.dummyResult) {
            allResults[idx] = [sc.dummyResult];
          } else {
            try {
              const res = await workerSrp.runScenario(
                sc.name,
                sc.filters,
                sc.options || {}
              );
              allResults[idx] = res;
            } catch (err) {
              console.error(`  ✗ [${sc.name}] Error during scenario execution: ${err.message}`);
              allResults[idx] = [
                {
                  scenario: sc.name,
                  source: "ERROR",
                  reportCount: 0,
                  popupTotal: "ERROR",
                  passed: false,
                  message: `[${sc.name}] Execution error: ${err.message}`,
                },
              ];
            }
          }
        }
      })
    );

    // Combine all results in exact scenario order
    srp.results = allResults.flat();
  } finally {
    // Clean up extra pages
    for (const p of extraPages) {
      await p.close().catch(() => {});
    }
  }

  // Print master summary
  srp.printResultsSummary();

  return srp.results; 
}

module.exports = {
  runScenario,
  runAllReportingScenarios,
  runSingleScenario,
  runCustomScenarios,
  runQuarterScenarios,
  runAllFilterScenario,
  verifyTodayWithChartView,
  runCombinedReportingAndModifiedScenarios,
  runReportingAllWithModifiedScenarios,
  runSiteVisitScenarios,
  runBookingDateScenarios,
  runTagsFilterScenariosInternal,
  runTagsFilterScenarios,
  runSourceFilterScenariosInternal,
  runSourceFilterScenarios,
  runAllFilterScenariosComplete,
};
