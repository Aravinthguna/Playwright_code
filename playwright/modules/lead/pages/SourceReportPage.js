const { WebElement } = require("../../../utils/WebElements");
const { navigateToReport } = require("./helpers/reportNavigation");
const {
  openAdvanceFilter,
  resetFilters,
  applyFilters,
} = require("./helpers/sourceReportFilters");
const {
  parseCount,
  waitForReportUpdate,
  isNoDataDisplayed,
  verifyNoDataFoundText,
  getReportSourceRows,
  getReportSourceCount,
} = require("./helpers/sourceReportTable");
const {
  openLeadPopupByRowIndex,
  openLeadPopup,
  getPopupTotalCount,
  getPopupCurrentPageRowCount,
  getAllPopupLeadRecords,
  _extractCurrentPageRecords,
  _goToNextPopupPage,
  scrollAndVerifyAllLeadsLoaded,
  closeLeadPopup,
} = require("./helpers/sourceReportPopup");
const {
  switchToChartView,
  switchToListView,
  getChartTotalCount,
  getSourceBreakdownRows,
  verifyChartViewAndBreakdown,
} = require("./helpers/sourceReportChart");
const { expect } = require("@playwright/test");
const {
  getCombinedMatchingScenarios,
  getReportingAllWithModifiedScenarios,
  getSiteVisitScenarios,
  getBookingDateScenarios,
  getDefaultScenarios,
} = require("./scenarios/sourceReportScenarioMatrix");
const {
  validateReportAndPopupCounts,
  validateLeadRecordsBySource,
  buildFailureReport,
  formatDateTimeLocal,
} = require("./helpers/sourceReportValidation");
const {
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
} = require("./scenarios/sourceReportScenarioRunner");

const webelement = new WebElement();

/**
 * SourceReportPage — Complete automation framework for Source Report
 * filter validation, count verification, and lead popup record matching.
 *
 * Responsibilities:
 *  - Navigate to Source Reports
 *  - Apply any combination of filters (reporting period, source, owner, etc.)
 *  - Wait for report updates
 *  - Extract source rows with names and counts
 *  - Open lead popup per source
 *  - Extract popup total count
 *  - Paginate and collect all popup lead records
 *  - Validate report count === popup total === unique matching records
 *  - Record pass/fail results with detailed failure messages
 */
class SourceReportPage {
  constructor(page) {
    this.page = page;
    /** Accumulated results for every scenario×source validation */
    this.results = [];
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────────

  async navigateToSourceReports() {
    const { reports, sourceReport, sourceReportHeading } = webelement.pageElement(this.page);
    await navigateToReport(this.page, {
      reports,
      menuItem: sourceReport,
      heading: sourceReportHeading,
      apiPath: "/leadReports/leadReportBySource",
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  FILTER OPERATIONS (Delegated to helpers/sourceReportFilters.js)
  // ─────────────────────────────────────────────────────────────────────────────

  async openAdvanceFilter() {
    return await openAdvanceFilter(this.page, webelement);
  }

  async applyFilters(filters = {}) {
    return await applyFilters(this.page, webelement, filters, {
      openAdvanceFilterFn: this.openAdvanceFilter.bind(this),
      formatDateTimeLocalFn: this.formatDateTimeLocal.bind(this),
      waitForReportUpdateFn: this.waitForReportUpdate.bind(this),
    });
  }

  async resetFilters() {
    return await resetFilters(this.navigateToSourceReports.bind(this));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  REPORT TABLE & LOADING HELPERS (Delegated to helpers/sourceReportTable.js)
  // ─────────────────────────────────────────────────────────────────────────────

  async waitForReportUpdate() {
    return await waitForReportUpdate(this.page, webelement);
  }

  parseCount(text) {
    return parseCount(text);
  }

  async isNoDataDisplayed() {
    return await isNoDataDisplayed(this.page, webelement);
  }

  async verifyNoDataFoundText() {
    return await verifyNoDataFoundText(this.page, webelement);
  }

  async getReportSourceRows() {
    return await getReportSourceRows(this.page, this.parseCount.bind(this), webelement);
  }

  async getReportSourceCount(sourceName) {
    return await getReportSourceCount(this.page, this.parseCount.bind(this), sourceName, webelement);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  CHART VIEW & SOURCE BREAKDOWN OPERATIONS (Delegated to helpers/sourceReportChart.js)
  // ─────────────────────────────────────────────────────────────────────────────

  async switchToChartView() {
    return await switchToChartView(this.page, webelement);
  }

  async switchToListView() {
    return await switchToListView(this.page, webelement);
  }

  async getChartTotalCount() {
    return await getChartTotalCount(this.page, this.parseCount.bind(this), webelement);
  }

  async getSourceBreakdownRows() {
    return await getSourceBreakdownRows(this.page, this.parseCount.bind(this), webelement);
  }

  async verifyChartViewAndBreakdown(listViewRows, scenarioName = "Today") {
    const result = await verifyChartViewAndBreakdown(
      this.page,
      this.parseCount.bind(this),
      listViewRows,
      scenarioName,
      webelement
    );
    this.results.push(result);
    return result;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  LEAD POPUP OPERATIONS (Delegated to helpers/sourceReportPopup.js)
  // ─────────────────────────────────────────────────────────────────────────────

  async openLeadPopupByRowIndex(rowIndex) {
    return await openLeadPopupByRowIndex(this.page, rowIndex, webelement);
  }

  async openLeadPopup(sourceName) {
    return await openLeadPopup(this.page, this.getReportSourceCount.bind(this), sourceName, webelement);
  }

  async getPopupTotalCount() {
    return await getPopupTotalCount(this.page, this.parseCount.bind(this), webelement);
  }

  async getPopupCurrentPageRowCount() {
    return await getPopupCurrentPageRowCount(this.page, webelement);
  }

  async getAllPopupLeadRecords() {
    return await getAllPopupLeadRecords(this.page, webelement);
  }

  async _extractCurrentPageRecords() {
    return await _extractCurrentPageRecords(this.page, webelement);
  }

  async _goToNextPopupPage() {
    return await _goToNextPopupPage(this.page, webelement);
  }

  async scrollAndVerifyAllLeadsLoaded(expectedCount, sourceName = "") {
    return await scrollAndVerifyAllLeadsLoaded(this.page, expectedCount, sourceName, webelement);
  }

  async closeLeadPopup() {
    return await closeLeadPopup(this.page, webelement);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  VALIDATION METHODS (Delegated to helpers/sourceReportValidation.js)
  // ─────────────────────────────────────────────────────────────────────────────

  validateReportAndPopupCounts(reportCount, popupTotal, sourceName, filters) {
    return validateReportAndPopupCounts(reportCount, popupTotal, sourceName, filters);
  }

  validateLeadRecordsBySource(records, expectedSource) {
    return validateLeadRecordsBySource(records, expectedSource);
  }

  buildFailureReport(scenarioName, filters, sourceName, reportCount, popupTotal, uniqueRecords, reason) {
    return buildFailureReport(scenarioName, filters, sourceName, reportCount, popupTotal, uniqueRecords, reason);
  }

  formatDateTimeLocal(date) {
    return formatDateTimeLocal(date);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  CORE VALIDATION FLOW — PER SOURCE ROW
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Run the complete validation flow for a single source row.
   *
   * 1. Extract the source name and count from the report.
   * 2. If count > 0, click to open the popup.
   * 3. Extract popup total count.
   * 4. Compare report count === popup total.
   * 5. Optionally collect and validate individual records.
   * 6. Close the popup.
   * 7. Record the result.
   *
   * @param {Object} sourceRow - from getReportSourceRows()
   * @param {string} scenarioName - for logging
   * @param {Object} filters - active filters
   * @param {Object} [options]
   * @param {boolean} [options.validateRecords=false] - whether to paginate and validate individual records
   */
  async validateSourceRow(sourceRow, scenarioName, filters, options = {}) {
    const { validateRecords = false } = options;
    const { sourceName, count, index, hasCountButton } = sourceRow;

    console.log(`\n  → Validating source: "${sourceName}" | Report Count: ${count}`);

    // ── Zero-count handling ───────────────────────────────────────────
    if (count === 0) {
      const result = {
        scenario: scenarioName,
        source: sourceName,
        reportCount: 0,
        popupTotal: "N/A",
        uniqueRecords: "N/A",
        passed: true,
        message: `[${sourceName}] Count is 0 — skipping popup validation.`,
      };
      this.results.push(result);
      console.log(`    ✓ ${result.message}`);
      return result;
    }

    if (!hasCountButton) {
      const result = {
        scenario: scenarioName,
        source: sourceName,
        reportCount: count,
        popupTotal: "N/A",
        uniqueRecords: "N/A",
        passed: true,
        message: `[${sourceName}] No clickable count button — skipping popup validation.`,
      };
      this.results.push(result);
      console.log(`    ⚠ ${result.message}`);
      return result;
    }

    // ── Open popup ────────────────────────────────────────────────────
    const popupOpened = await this.openLeadPopupByRowIndex(index);
    if (!popupOpened) {
      const result = {
        scenario: scenarioName,
        source: sourceName,
        reportCount: count,
        popupTotal: "FAILED_TO_OPEN",
        uniqueRecords: "N/A",
        passed: false,
        message: `[${sourceName}] Failed to open lead popup.`,
      };
      this.results.push(result);
      console.error(`    ✗ ${result.message}`);
      return result;
    }

    // ── Extract popup total ───────────────────────────────────────────
    const popupTotal = await this.getPopupTotalCount();

    // ── Count comparison ──────────────────────────────────────────────
    const countValidation = this.validateReportAndPopupCounts(
      count,
      popupTotal,
      sourceName,
      filters
    );

    // ── Scroll popup if leads > 10 (or all leads) & verify "All leads loaded" ──
    let allLeadsLoadedPassed = true;
    let allLeadsLoadedMessage = "";
    try {
      await this.scrollAndVerifyAllLeadsLoaded(count, sourceName);
    } catch (err) {
      allLeadsLoadedPassed = false;
      allLeadsLoadedMessage = `Failed to verify "All leads loaded" for [${sourceName}]: ${err.message}`;
      console.error(`    ✗ ${allLeadsLoadedMessage}`);
    }

    let uniqueRecords = null;
    let recordValidation = { passed: true, message: "" };

    // ── Optional record-level validation ──────────────────────────────
    if (validateRecords && popupTotal !== null && popupTotal > 0) {
      const records = await this.getAllPopupLeadRecords();
      uniqueRecords = records.length;
      recordValidation = this.validateLeadRecordsBySource(records, sourceName);
    }

    // ── Close popup ───────────────────────────────────────────────────
    await this.closeLeadPopup();

    // ── Build result ──────────────────────────────────────────────────
    const passed = countValidation.passed && allLeadsLoadedPassed && recordValidation.passed;
    const result = {
      scenario: scenarioName,
      source: sourceName,
      reportCount: count,
      popupTotal: popupTotal ?? "UNKNOWN",
      uniqueRecords: uniqueRecords ?? "N/A",
      passed,
      message: passed
        ? `[${sourceName}] ✓ PASS — Report=${count}, Popup=${popupTotal}, All leads loaded verified` +
          (uniqueRecords !== null ? `, Records=${uniqueRecords}` : "")
        : this.buildFailureReport(
            scenarioName,
            filters,
            sourceName,
            count,
            popupTotal,
            uniqueRecords,
            [countValidation.message, allLeadsLoadedMessage, recordValidation.message].filter(Boolean).join("\n  ")
          ),
    };

    this.results.push(result);

    if (passed) {
      console.log(`    ✓ ${result.message}`);
    } else {
      console.error(`    ✗ FAIL — ${countValidation.message}`);
    }

    return result;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  SCENARIO RUNNERS (Delegated to scenarios/sourceReportScenarioRunner.js)
  // ─────────────────────────────────────────────────────────────────────────────

  async runScenario(scenarioName, filters, options = {}) {
    return await runScenario(this, scenarioName, filters, options);
  }

  /**
   * Main entry point for Source Report validation.
   * Can run all default scenarios or custom scenarios.
   *
   * @param {Array<{name: string, filters: Object, options?: Object}>} [customScenarios]
   */
  async sourceReport(customScenariosOrOptions = null, options = {}) {
    if (Array.isArray(customScenariosOrOptions) && customScenariosOrOptions.length > 0) {
      return await this.runCustomScenarios(customScenariosOrOptions);
    }
    const opts =
      customScenariosOrOptions &&
      typeof customScenariosOrOptions === "object" &&
      !Array.isArray(customScenariosOrOptions)
        ? customScenariosOrOptions
        : options;
    return await this.runAllFilterScenariosComplete(opts);
  }

  /**
   * Alias method consistent with other lead page objects (e.g. processUnverifiedLeads, processSpamLeads).
   */
  async processSourceReport(options = {}) {
    return await this.sourceReport(options);
  }

  async runAllReportingScenarios() {
    return await runAllReportingScenarios(this);
  }

  async runSingleScenario(scenarioName) {
    return await runSingleScenario(this, scenarioName);
  }

  async runCustomScenarios(scenarios) {
    return await runCustomScenarios(this, scenarios);
  }

  async runQuarterScenarios() {
    return await runQuarterScenarios(this);
  }

  async runAllFilterScenario(options = {}) {
    return await runAllFilterScenario(this, options);
  }

  async verifyTodayWithChartView() {
    return await verifyTodayWithChartView(this);
  }

  async runCombinedReportingAndModifiedScenarios() {
    return await runCombinedReportingAndModifiedScenarios(this);
  }

  async runReportingAllWithModifiedScenarios() {
    return await runReportingAllWithModifiedScenarios(this);
  }

  async runSiteVisitScenarios() {
    return await runSiteVisitScenarios(this);
  }

  async runBookingDateScenarios() {
    return await runBookingDateScenarios(this);
  }

  async runTagsFilterScenariosInternal() {
    return await runTagsFilterScenariosInternal(this);
  }

  async runTagsFilterScenarios() {
    return await runTagsFilterScenarios(this);
  }

  async runSourceFilterScenariosInternal() {
    return await runSourceFilterScenariosInternal(this);
  }

  async runSourceFilterScenarios() {
    return await runSourceFilterScenarios(this);
  }

  async runAllFilterScenariosComplete(options = {}) {
    return await runAllFilterScenariosComplete(this, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  SCENARIO MATRICES (Delegated to scenarios/sourceReportScenarioMatrix.js)
  // ─────────────────────────────────────────────────────────────────────────────

  getCombinedMatchingScenarios() {
    return getCombinedMatchingScenarios();
  }

  getReportingAllWithModifiedScenarios() {
    return getReportingAllWithModifiedScenarios();
  }

  getSiteVisitScenarios() {
    return getSiteVisitScenarios();
  }

  getBookingDateScenarios() {
    return getBookingDateScenarios();
  }

  getDefaultScenarios() {
    return getDefaultScenarios();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  RESULTS SUMMARY
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Print a formatted summary of all validation results.
   */
  printResultsSummary() {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = total - passed;

    console.log(`\n╔═══════════════════════════════════════════════════════════╗`);
    console.log(`║           SOURCE REPORT VALIDATION SUMMARY               ║`);
    console.log(`╠═══════════════════════════════════════════════════════════╣`);
    console.log(`║  Total Validations: ${String(total).padEnd(38)}║`);
    console.log(`║  Passed:            ${String(passed).padEnd(38)}║`);
    console.log(`║  Failed:            ${String(failed).padEnd(38)}║`);
    console.log(`╠═══════════════════════════════════════════════════════════╣`);

    for (const result of this.results) {
      const icon = result.passed ? "✓" : "✗";
      const line = `${icon} [${result.scenario}] ${result.source}: Report=${result.reportCount}, Popup=${result.popupTotal}`;
      console.log(`║  ${line.substring(0, 57).padEnd(57)}║`);
    }

    console.log(`╚═══════════════════════════════════════════════════════════╝\n`);
  }
}

module.exports = { SourceReportPage };
