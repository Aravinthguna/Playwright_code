/**
 * PipelineFunnelPage.js
 *
 * Comprehensive automation page object for the Pipeline Funnel Report.
 * Reuses existing Source Report helper functions and WebElements where possible.
 */

const { WebElement } = require("../../../utils/WebElements");
const { navigateToReport, waitForRender } = require("./helpers/reportNavigation");
const {
  openAdvanceFilter,
  closeAdvanceFilter,
  resetFilters,
  applyFilters,
} = require("./helpers/pipelineFunnelFilters");
const {
  parseCount,
  waitForReportUpdate,
  isNoDataDisplayed,
  verifyNoDataFoundText,
  getReportSourceRows,
} = require("./helpers/sourceReportTable");
const {
  openLeadPopupByRowIndex,
  getPopupTotalCount,
  scrollAndVerifyAllLeadsLoaded,
  closeLeadPopup,
} = require("./helpers/sourceReportPopup");
const {
  validateReportAndPopupCounts,
  buildFailureReport,
  formatDateTimeLocal,
} = require("./helpers/sourceReportValidation");
const {
  runScenario,
  runAllPipelineFunnelScenarios,
} = require("./scenarios/pipelineFunnelScenarioRunner");

const webelement = new WebElement();

class PipelineFunnelPage {
  constructor(page) {
    this.page = page;
    this.results = [];
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────────

  async navigateToPipelineFunnel() {
    const { reports, pipelineFunnel, pipelineFunnelHeading } = webelement.pageElement(this.page);
    await navigateToReport(this.page, {
      reports,
      menuItem: pipelineFunnel,
      heading: pipelineFunnelHeading,
      apiPath: "getPipelineReport",
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  FILTER OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────────

  async openAdvanceFilter() {
    return await openAdvanceFilter(this.page, webelement);
  }

  async closeAdvanceFilter() {
    return await closeAdvanceFilter(this.page, webelement);
  }

  async resetFilters() {
    return await resetFilters(this.page, webelement);
  }

  async applyFilters(filters = {}, options = {}) {
    return await applyFilters(this.page, webelement, filters, options);
  }

  formatDateTimeLocal(date) {
    return formatDateTimeLocal(date);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  REPORT TABLE & LOADING HELPERS
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

  async getEmployeePerformanceRows() {
    return await getReportSourceRows(this.page, parseCount, webelement);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  LEAD POPUP / MODAL OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────────

  async openLeadPopup(rowIndex) {
    const { table, popupContainer } = webelement.pageElement(this.page);
    const row = table.nth(rowIndex);
    const countButton = row.locator("td:nth-child(2) button");

    const hasBtn = await countButton.isVisible().catch(() => false);
    if (!hasBtn) return false;

    // The popup loads its leads via /communication/getAllLeads (verified by network
    // capture). The previous matcher never matched, so every popup waited out the
    // full timeout before reading counts.
    await Promise.all([
      this.page
        .waitForResponse((r) => r.url().includes("/communication/getAllLeads"), {
          timeout: 30000,
        })
        .catch(() => null),
      countButton.click({ timeout: 5000 }).catch(async () => {
        await this.page.waitForTimeout(300);
        await this.page
          .locator("table tbody tr")
          .nth(rowIndex)
          .locator("td:nth-child(2) button")
          .click({ timeout: 5000 });
      }),
    ]);

    const popupVisible = await popupContainer
      .waitFor({ state: "visible", timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    await waitForRender(this.page);
    return popupVisible;
  }

  async getPopupTotalCount() {
    return await getPopupTotalCount(this.page, parseCount, webelement);
  }

  async scrollAndVerifyAllLeadsLoaded(expectedCount, managerName) {
    return await scrollAndVerifyAllLeadsLoaded(
      this.page,
      expectedCount,
      managerName,
      webelement,
    );
  }

  async closeLeadPopup() {
    return await closeLeadPopup(this.page, webelement);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  ROW VALIDATION
  // ─────────────────────────────────────────────────────────────────────────────

  async validateEmployeeRow(row, scenarioName, filters, options = {}) {
    const {
      sourceName: managerName,
      count: reportCount,
      index: rowIndex,
      hasCountButton,
    } = row;

    console.log(
      `\n  → Validating Employee: "${managerName}" | Total Leads: ${reportCount}`,
    );

    // If reportCount is 0 or row doesn't have a count button
    if (reportCount === 0 || !hasCountButton) {
      const result = {
        scenario: scenarioName,
        manager: managerName,
        reportCount,
        popupTotal: hasCountButton ? 0 : "N/A",
        passed: true,
        message: `[${managerName}] Verified count = ${reportCount}. No popup verification required.`,
      };
      this.results.push(result);
      console.log(`    ℹ ${result.message}`);
      return result;
    }

    // 1. Open popup
    const opened = await this.openLeadPopup(rowIndex);
    if (!opened) {
      const result = {
        scenario: scenarioName,
        manager: managerName,
        reportCount,
        popupTotal: null,
        passed: false,
        message: `[${managerName}] Failed to open lead popup for row ${rowIndex}.`,
      };
      this.results.push(result);
      console.log(`    ✗ ${result.message}`);
      return result;
    }

    // 2. Read popup total count
    const popupTotal = await this.getPopupTotalCount();

    // 3. Compare report count vs popup count
    const countCheck = validateReportAndPopupCounts(
      reportCount,
      popupTotal,
      managerName,
      filters,
    );

    // 4. Verify "All leads loaded"
    let allLeadsLoaded = true;
    try {
      allLeadsLoaded = await this.scrollAndVerifyAllLeadsLoaded(
        reportCount,
        managerName,
      );
    } catch (e) {
      const allLoadedEl = this.page
        .locator('.fixed.inset-0, div[role="dialog"]')
        .first()
        .getByText("All leads loaded", { exact: false })
        .first();
      allLeadsLoaded = await allLoadedEl
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      if (!allLeadsLoaded) {
        console.warn(
          `    ⚠ Could not verify "All leads loaded" for "${managerName}": ${e.message}`,
        );
      }
    }

    // 5. Close popup
    await this.closeLeadPopup();

    const passed = countCheck.passed && allLeadsLoaded;
    const result = {
      scenario: scenarioName,
      manager: managerName,
      reportCount,
      popupTotal,
      passed,
      message: passed
        ? `[${managerName}] ✓ PASS — Table=${reportCount}, Drawer=${popupTotal}`
        : buildFailureReport(
            scenarioName,
            filters,
            managerName,
            reportCount,
            popupTotal,
            "N/A",
            countCheck.message +
              (allLeadsLoaded
                ? ""
                : "\n'All leads loaded' verification failed"),
          ),
    };

    this.results.push(result);
    console.log(passed ? `    ✓ ${result.message}` : `    ✗ ${result.message}`);
    return result;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  SCENARIO RUNNERS
  // ─────────────────────────────────────────────────────────────────────────────

  async runScenario(scenarioName, filters, options = {}) {
    return await runScenario(this, scenarioName, filters, options);
  }

  async pipelineFunnel(options = {}) {
    return await runAllPipelineFunnelScenarios(this, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  REPORTING / SUMMARY
  // ─────────────────────────────────────────────────────────────────────────────

  printResultsSummary() {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;

    console.log(
      `\n╔═══════════════════════════════════════════════════════════════╗`,
    );
    console.log(
      `║        PIPELINE FUNNEL REPORT VALIDATION SUMMARY              ║`,
    );
    console.log(
      `╠═══════════════════════════════════════════════════════════════╣`,
    );
    console.log(`║  Total Validations: ${String(total).padEnd(42)}║`);
    console.log(`║  Passed:            ${String(passed).padEnd(42)}║`);
    console.log(`║  Failed:            ${String(failed).padEnd(42)}║`);
    console.log(
      `╠═══════════════════════════════════════════════════════════════╣`,
    );

    for (const r of this.results.slice(0, 30)) {
      const statusIcon = r.passed ? "✓" : "✗";
      const line = `  ${statusIcon} [${r.scenario}] ${r.manager}: Report=${r.reportCount}, Drawer=${r.popupTotal}`;
      console.log(`║${line.slice(0, 62).padEnd(63)}║`);
    }
    if (this.results.length > 30) {
      console.log(
        `║  ... and ${this.results.length - 30} more validations`.padEnd(64) +
          "║",
      );
    }

    console.log(
      `╚═══════════════════════════════════════════════════════════════╝\n`,
    );
  }
}

module.exports = { PipelineFunnelPage };
