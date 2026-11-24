/**
 * sourceReportFilters.js
 *
 * Filter operations and handlers for Source Report testing:
 *  - Opening and interacting with Advance Filter panel
 *  - Selecting Reporting Period (Today, Last N days, Quarter, Custom range, All)
 *  - Selecting Modified At options
 *  - Selecting Site Visit Schedule options
 *  - Selecting Booking Date options
 *  - Selecting Tags (All Tags vs individual tag)
 *  - Selecting Sources (All Sources vs individual source)
 *  - Applying filters and waiting for report update
 *  - Resetting filters
 */

const { WebElement } = require("../../../../utils/WebElements");
const defaultWebElement = new WebElement();
const { formatDateTimeLocal } = require("./sourceReportValidation");
const { waitForReportUpdate } = require("./sourceReportTable");

/**
 * Ensures the advance-filter panel is open.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement] - WebElement utility instance
 */
async function openAdvanceFilter(page, webelement = defaultWebElement) {
  const { advanceFilter, reportingPeriod } = (webelement || defaultWebElement).pageElement(page);
  const isFilterOpen = await reportingPeriod.isVisible().catch(() => false);
  if (!isFilterOpen) {
    await advanceFilter.waitFor({ state: "visible", timeout: 10000 });
    await advanceFilter.click();
    await reportingPeriod.waitFor({ state: "visible", timeout: 10000 });
  }
}

/**
 * Reset filters by navigating back to source reports (clean slate).
 *
 * @param {() => Promise<void>} navigateToSourceReportsFn
 */
async function resetFilters(navigateToSourceReportsFn) {
  await navigateToSourceReportsFn();
}

/**
 * Apply a configurable set of filters.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement] - WebElement utility instance
 * @param {Object} filters
 * @param {string} [filters.reportingPeriod]
 * @param {string} [filters.days]
 * @param {string} [filters.quarter]
 * @param {Date}   [filters.fromDate]
 * @param {Date}   [filters.toDate]
 * @param {string} [filters.modifiedAt]
 * @param {string} [filters.siteVisitSchedule]
 * @param {string} [filters.bookingDate]
 * @param {boolean} [filters.allTags]
 * @param {string} [filters.tag]
 * @param {boolean} [filters.allSources]
 * @param {string} [filters.source]
 * @param {Object} [options]
 * @param {() => Promise<void>} [options.openAdvanceFilterFn]
 * @param {(d: Date) => string} [options.formatDateTimeLocalFn]
 * @param {() => Promise<void>} [options.waitForReportUpdateFn]
 */
async function applyFilters(page, webelement = defaultWebElement, filters = {}, options = {}) {
  const openAdvanceFilterFn = options.openAdvanceFilterFn || (() => openAdvanceFilter(page, webelement));
  const formatDateTimeLocalFn = options.formatDateTimeLocalFn || formatDateTimeLocal;
  const waitForReportUpdateFn = options.waitForReportUpdateFn || (() => waitForReportUpdate(page, webelement));

  const {
    reportingPeriod: reportingPeriodEl,
    numberofDays,
    modifiedAt,
    siteVisitSchedule,
    bookingDate,
    FilterSearchButton,
    reportingPeriodSection,
    reportingPeriodSelect,
    reportingPeriodDaysInput,
    reportingPeriodFromInput,
    reportingPeriodToInput,
    modifiedAtSection,
    modifiedAtSelect,
    modifiedAtDaysInput,
    modifiedAtFromInput,
    modifiedAtToInput,
    siteVisitSection,
    siteVisitSelect,
    siteVisitDaysInput,
    siteVisitFromInput,
    siteVisitToInput,
    bookingDateSection,
    bookingDateSelect,
    bookingDateDaysInput,
    bookingDateFromInput,
    bookingDateToInput,
    tagsSection,
    allTagsBtn,
    sourceSection,
    allSourcesBtn,
  } = (webelement || defaultWebElement).pageElement(page);

  await openAdvanceFilterFn();

  // ── 1. Reporting Period ───────────────────────────────────────────────
  if (filters.reportingPeriod) {
    const reportingSelect = reportingPeriodSelect;
    await reportingSelect
      .selectOption({ label: filters.reportingPeriod }, { timeout: 3000 })
      .catch(async () => {
        await reportingSelect.selectOption({ value: filters.reportingPeriod }, { timeout: 3000 }).catch(async () => {
          const opt = reportingSelect.locator(`option:text-matches("${filters.reportingPeriod}", "i")`);
          const val = await opt.first().getAttribute("value").catch(() => null);
          if (val) await reportingSelect.selectOption(val, { timeout: 2000 }).catch(() => {});
        });
      });

    // Sub-options per period type
    if (filters.reportingPeriod === "Last N days") {
      const days = filters.reportingDays || filters.days || "7";
      const daysInput = reportingPeriodDaysInput;
      if (await daysInput.isVisible().catch(() => false)) {
        await daysInput.fill(String(days));
      }
    } else if (filters.reportingPeriod === "Quarter") {
      const q = filters.reportingQuarter || filters.quarter || "Q1";
      const qBtn = reportingPeriodSection.locator(`button:has-text("${q}")`).first();
      if (await qBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await qBtn.click();
      } else {
        const qBtnXPath = reportingPeriodSection.locator(`//button[normalize-space()='${q}']`);
        if (await qBtnXPath.isVisible({ timeout: 1000 }).catch(() => false)) {
          await qBtnXPath.click();
        }
      }
    } else if (filters.reportingPeriod === "Custom range") {
      const fromInput = reportingPeriodFromInput;
      const toInput = reportingPeriodToInput;

      if (
        (await fromInput.isVisible().catch(() => false)) &&
        (await toInput.isVisible().catch(() => false))
      ) {
        const fromDate = filters.reportingFromDate || filters.fromDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const toDate = filters.reportingToDate || filters.toDate || new Date();
        await fromInput.fill(formatDateTimeLocalFn(fromDate));
        await toInput.fill(formatDateTimeLocalFn(toDate));
      }
    }
  }

  // ── 2. Modified At ───────────────────────────────────────────────────
  const modifiedSelect = modifiedAtSelect;
  if (filters.modifiedAt) {
    await modifiedSelect
      .selectOption({ label: filters.modifiedAt }, { timeout: 3000 })
      .catch(async () => {
        await modifiedSelect.selectOption({ value: filters.modifiedAt }, { timeout: 3000 }).catch(async () => {
          const opt = modifiedSelect.locator(`option:text-matches("${filters.modifiedAt}", "i")`);
          const val = await opt.first().getAttribute("value").catch(() => null);
          if (val) await modifiedSelect.selectOption(val, { timeout: 2000 }).catch(() => {});
        });
      });

    // Sub-options for modifiedAt
    if (filters.modifiedAt === "Last N days") {
      const days = filters.modifiedDays || filters.days || "7";
      const daysInput = modifiedAtDaysInput;
      if (await daysInput.isVisible().catch(() => false)) {
        await daysInput.fill(String(days));
      }
    } else if (filters.modifiedAt === "Quarter") {
      const q = filters.modifiedQuarter || filters.quarter || "Q1";
      const qBtn = modifiedAtSection.locator(`button:has-text("${q}")`).first();
      if (await qBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await qBtn.click();
      } else {
        const qBtnXPath = modifiedAtSection.locator(`//button[normalize-space()='${q}']`);
        if (await qBtnXPath.isVisible({ timeout: 1000 }).catch(() => false)) {
          await qBtnXPath.click();
        }
      }
    } else if (filters.modifiedAt === "Custom range") {
      const fromInput = modifiedAtFromInput;
      const toInput = modifiedAtToInput;

      if (
        (await fromInput.isVisible().catch(() => false)) &&
        (await toInput.isVisible().catch(() => false))
      ) {
        const fromDate = filters.modifiedFromDate || filters.fromDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const toDate = filters.modifiedToDate || filters.toDate || new Date();
        await fromInput.fill(formatDateTimeLocalFn(fromDate));
        await toInput.fill(formatDateTimeLocalFn(toDate));
      }
    }
  } else {
    // Ensure modifiedAt is reset to None if not specified in filters
    const currentVal = await modifiedSelect.inputValue().catch(() => "");
    if (currentVal !== "") {
      await modifiedSelect.selectOption("").catch(() => {});
    }
  }

  // ── 3. Site Visit Schedule ───────────────────────────────────────────
  const siteVisitSelectEl = siteVisitSelect;
  if (filters.siteVisitSchedule) {
    if (filters.siteVisitSchedule === "Reset" || filters.siteVisitSchedule === "None") {
      await siteVisitSelectEl.selectOption("").catch(() => {});
    } else {
      await siteVisitSelectEl
        .selectOption({ label: filters.siteVisitSchedule }, { timeout: 3000 })
        .catch(async () => {
          await siteVisitSelectEl.selectOption({ value: filters.siteVisitSchedule }, { timeout: 3000 }).catch(async () => {
            const opt = siteVisitSelectEl.locator(`option:text-matches("${filters.siteVisitSchedule}", "i")`);
            const val = await opt.first().getAttribute("value").catch(() => null);
            if (val) await siteVisitSelectEl.selectOption(val, { timeout: 2000 }).catch(() => {});
          });
        });

      if (filters.siteVisitSchedule === "Last N days") {
        const days = filters.siteVisitDays || filters.days || "7";
        const daysInput = siteVisitDaysInput;
        if (await daysInput.isVisible().catch(() => false)) {
          await daysInput.fill(String(days));
        }
      } else if (filters.siteVisitSchedule === "Quarter") {
        const q = filters.siteVisitQuarter || filters.quarter || "Q1";
        const qBtn = siteVisitSection.locator(`button:has-text("${q}")`).first();
        if (await qBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await qBtn.click();
        } else {
          const qBtnXPath = siteVisitSection.locator(`//button[normalize-space()='${q}']`);
          if (await qBtnXPath.isVisible({ timeout: 1000 }).catch(() => false)) {
            await qBtnXPath.click();
          }
        }
      } else if (filters.siteVisitSchedule === "Custom range") {
        const fromInput = siteVisitFromInput;
        const toInput = siteVisitToInput;

        if (
          (await fromInput.isVisible().catch(() => false)) &&
          (await toInput.isVisible().catch(() => false))
        ) {
          const fromDate = filters.siteVisitFromDate || filters.fromDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const toDate = filters.siteVisitToDate || filters.toDate || new Date();
          await fromInput.fill(formatDateTimeLocalFn(fromDate));
          await toInput.fill(formatDateTimeLocalFn(toDate));
        }
      }
    }
  } else {
    const currentVal = await siteVisitSelectEl.inputValue().catch(() => "");
    if (currentVal !== "") {
      await siteVisitSelectEl.selectOption("").catch(() => {});
    }
  }

  // ── 4. Booking Date ──────────────────────────────────────────────────
  const bookingSelectEl = bookingDateSelect;
  if (filters.bookingDate) {
    if (filters.bookingDate === "Reset" || filters.bookingDate === "None") {
      await bookingSelectEl.selectOption("").catch(() => {});
    } else {
      await bookingSelectEl
        .selectOption({ label: filters.bookingDate }, { timeout: 3000 })
        .catch(async () => {
          await bookingSelectEl.selectOption({ value: filters.bookingDate }, { timeout: 3000 }).catch(async () => {
            const opt = bookingSelectEl.locator(`option:text-matches("${filters.bookingDate}", "i")`);
            const val = await opt.first().getAttribute("value").catch(() => null);
            if (val) await bookingSelectEl.selectOption(val, { timeout: 2000 }).catch(() => {});
          });
        });

      if (filters.bookingDate === "Last N days") {
        const days = filters.bookingDays || filters.days || "7";
        const daysInput = bookingDateDaysInput;
        if (await daysInput.isVisible().catch(() => false)) {
          await daysInput.fill(String(days));
        }
      } else if (filters.bookingDate === "Quarter") {
        const q = filters.bookingQuarter || filters.quarter || "Q1";
        const qBtn = bookingDateSection.locator(`button:has-text("${q}")`).first();
        if (await qBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await qBtn.click();
        } else {
          const qBtnXPath = bookingDateSection.locator(`//button[normalize-space()='${q}']`);
          if (await qBtnXPath.isVisible({ timeout: 1000 }).catch(() => false)) {
            await qBtnXPath.click();
          }
        }
      } else if (filters.bookingDate === "Custom range") {
        const fromInput = bookingDateFromInput;
        const toInput = bookingDateToInput;

        if (
          (await fromInput.isVisible().catch(() => false)) &&
          (await toInput.isVisible().catch(() => false))
        ) {
          const fromDate = filters.bookingFromDate || filters.fromDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const toDate = filters.bookingToDate || filters.toDate || new Date();
          await fromInput.fill(formatDateTimeLocalFn(fromDate));
          await toInput.fill(formatDateTimeLocalFn(toDate));
        }
      }
    }
  } else {
    const currentVal = await bookingSelectEl.inputValue().catch(() => "");
    if (currentVal !== "") {
      await bookingSelectEl.selectOption("").catch(() => {});
    }
  }

  // ── 5. Tags Filter ───────────────────────────────────────────────────
  if (filters.allTags) {
    if (await allTagsBtn.isVisible().catch(() => false)) {
      await allTagsBtn.scrollIntoViewIfNeeded().catch(() => {});
      await allTagsBtn.click();
    }
  } else if (filters.tag) {
    // First ensure All Tags is clicked so any previously selected tags are cleared
    if (await allTagsBtn.isVisible().catch(() => false)) {
      await allTagsBtn.scrollIntoViewIfNeeded().catch(() => {});
      await allTagsBtn.click();
    }
    const tagBtn = tagsSection.locator(`button:has-text("${filters.tag}")`).first();
    if (await tagBtn.isVisible().catch(() => false)) {
      await tagBtn.scrollIntoViewIfNeeded().catch(() => {});
      await tagBtn.click();
    }
  } else {
    // If neither allTags nor a specific tag is requested, ensure All Tags is active to prevent tag leakage
    if (await allTagsBtn.isVisible().catch(() => false)) {
      const hasSvg = await allTagsBtn.locator("svg").count().catch(() => 0);
      if (hasSvg === 0) {
        await allTagsBtn.scrollIntoViewIfNeeded().catch(() => {});
        await allTagsBtn.click();
      }
    }
  }

  // ── 6. Source Filter ─────────────────────────────────────────────────
  if (filters.allSources) {
    if (await allSourcesBtn.isVisible().catch(() => false)) {
      await allSourcesBtn.scrollIntoViewIfNeeded().catch(() => {});
      await allSourcesBtn.click();
    }
  } else if (filters.source && filters.source !== "ALL") {
    // First ensure All Sources is clicked so any previously selected sources are cleared
    if (await allSourcesBtn.isVisible().catch(() => false)) {
      await allSourcesBtn.scrollIntoViewIfNeeded().catch(() => {});
      await allSourcesBtn.click();
    }
    const sourceBtn = sourceSection.locator(`button:has-text("${filters.source}")`).first();
    if (await sourceBtn.isVisible().catch(() => false)) {
      await sourceBtn.scrollIntoViewIfNeeded().catch(() => {});
      await sourceBtn.click();
    }
  } else {
    // If neither allSources nor a specific source is requested, ensure All Sources is active to prevent source leakage
    if (await allSourcesBtn.isVisible().catch(() => false)) {
      const hasSvg = await allSourcesBtn.locator("svg").count().catch(() => 0);
      if (hasSvg === 0) {
        await allSourcesBtn.scrollIntoViewIfNeeded().catch(() => {});
        await allSourcesBtn.click();
      }
    }
  }

  // ── Click Search ─────────────────────────────────────────────────────
  await FilterSearchButton.waitFor({ state: "visible", timeout: 5000 });
  // The previous result table stays visible while the new request is in flight,
  // so a visibility check alone can read stale counts. Wait for the report API.
  await Promise.all([
    page
      .waitForResponse((r) => r.url().includes("/leadReports/leadReportBySource"), { timeout: 20000 })
      .catch(() => null),
    FilterSearchButton.click(),
  ]);

  // Wait for report to re-render
  await waitForReportUpdateFn();
}

module.exports = {
  openAdvanceFilter,
  resetFilters,
  applyFilters,
};
