/**
 * trendReportFilters.js
 *
 * Dedicated filter operations helper for Trend Report automation.
 * Encapsulates advance-filter drawer interactions, option selections,
 * dynamic tag filtering, and report search dispatching.
 *
 * Centralized selectors are reused from playwright/utils/WebElements.js.
 *
 * Supported Filter Categories:
 * 1. Reporting Period (Today, Last N days, This month, Last month, Quarter, This year, Custom range, All)
 * 2. Modified At (None, Today, Last N days, This month, Last month, Quarter, This year, Custom range, All, Reset)
 * 3. Site Visit (None, Today, Last N days, This month, Last month, Quarter, This year, Custom range, All, Reset)
 * 4. Booking Date (None, Today, Last N days, This month, Last month, Quarter, This year, Custom range, All, Reset)
 * 5. Tags (All Tags or individual tag)
 */

const { WebElement } = require("../../../../utils/WebElements");
const { waitForRender } = require("./reportNavigation");
const defaultWebElement = new WebElement();
const { formatDateTimeLocal } = require("./sourceReportValidation");

/**
 * Robustly select an option in a <select> element by label or value or case-insensitive text match.
 *
 * @param {import('@playwright/test').Locator} selectLocator
 * @param {string} optionValueOrLabel
 */
async function selectOptionRobust(selectLocator, optionValueOrLabel) {
  if (optionValueOrLabel === undefined || optionValueOrLabel === null) return;
  const target = String(optionValueOrLabel).trim();

  // Try exact label
  try {
    await selectLocator.selectOption({ label: target }, { timeout: 2000 });
    return;
  } catch {}

  // Try exact value
  try {
    await selectLocator.selectOption({ value: target }, { timeout: 2000 });
    return;
  } catch {}

  // Try case-insensitive / partial text match on option
  try {
    const opt = selectLocator.locator(
      `option:text-matches("${target.replace(/"/g, '\\"')}", "i")`
    );
    const val = await opt.first().getAttribute("value").catch(() => null);
    if (val !== null) {
      await selectLocator.selectOption(val, { timeout: 2000 });
      return;
    }
  } catch {}

  // Fallback direct string
  try {
    await selectLocator.selectOption(target, { timeout: 2000 });
  } catch {}
}

/**
 * Open the Advanced Filters drawer/panel if not already open.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement]
 */
async function openAdvanceFilter(page, webelement = defaultWebElement) {
  const { advanceFilter, reportingPeriod } = (
    webelement || defaultWebElement
  ).pageElement(page);
  const isOpen = await reportingPeriod.isVisible().catch(() => false);
  if (!isOpen) {
    await advanceFilter.waitFor({ state: "visible", timeout: 10000 });
    await advanceFilter.click();
    await reportingPeriod.waitFor({ state: "visible", timeout: 10000 });
  }
}

/**
 * Close the Advanced Filters drawer/panel if open.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement]
 */
async function closeAdvanceFilter(page, webelement = defaultWebElement) {
  const { advanceFilter, reportingPeriod, clcikCloseButton } = (
    webelement || defaultWebElement
  ).pageElement(page);
  const isOpen = await reportingPeriod.isVisible().catch(() => false);
  if (isOpen) {
    if (await clcikCloseButton.first().isVisible().catch(() => false)) {
      await clcikCloseButton.first().click();
    } else {
      await advanceFilter.click().catch(() => {});
    }
    await reportingPeriod
      .waitFor({ state: "hidden", timeout: 5000 })
      .catch(() => {});
  }
}

/**
 * Reset filters using the in-drawer Reset button.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement]
 */
async function resetFilters(page, webelement = defaultWebElement) {
  const { filterResetButton, FilterSearchButton } = (
    webelement || defaultWebElement
  ).pageElement(page);
  await openAdvanceFilter(page, webelement);
  await filterResetButton.waitFor({ state: "visible", timeout: 5000 });
  await filterResetButton.click();
  await waitForRender(page);

  // Apply reset state and wait for report update
  await Promise.all([
    page
      .waitForResponse(
        (r) => r.url().includes("/leadReports/leadReportTrends"),
        { timeout: 10000 }
      )
      .catch(() => null),
    FilterSearchButton.click(),
  ]);
  await waitForRender(page);
}

/**
 * Apply filters to Trend Report.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [webelement]
 * @param {Object} filters
 * @param {Object} [options]
 */
async function applyFilters(
  page,
  webelement = defaultWebElement,
  filters = {},
  options = {}
) {
  const {
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
    FilterSearchButton,
  } = (webelement || defaultWebElement).pageElement(page);

  await openAdvanceFilter(page, webelement);

  // ── 1. Reporting Period ───────────────────────────────────────────────
  if (filters.reportingPeriod) {
    await selectOptionRobust(reportingPeriodSelect, filters.reportingPeriod);

    if (filters.reportingPeriod === "Last N days") {
      const days = filters.reportingDays || filters.days || "7";
      if (await reportingPeriodDaysInput.isVisible().catch(() => false)) {
        await reportingPeriodDaysInput.fill(String(days));
      }
    } else if (filters.reportingPeriod === "Quarter") {
      const q = filters.reportingQuarter || filters.quarter || "Q1";
      const qBtn = reportingPeriodSection
        .locator(`button:has-text("${q}")`)
        .first();
      if (await qBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await qBtn.click();
      }
    } else if (filters.reportingPeriod === "Custom range") {
      const fromDate =
        filters.reportingFromDate ||
        filters.fromDate ||
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const toDate = filters.reportingToDate || filters.toDate || new Date();
      if (await reportingPeriodFromInput.isVisible().catch(() => false)) {
        await reportingPeriodFromInput.fill(formatDateTimeLocal(fromDate));
      }
      if (await reportingPeriodToInput.isVisible().catch(() => false)) {
        await reportingPeriodToInput.fill(formatDateTimeLocal(toDate));
      }
    }
  }

  // ── 2. Modified At ───────────────────────────────────────────────────
  if (filters.modifiedAt !== undefined) {
    const val =
      filters.modifiedAt === "Reset" || filters.modifiedAt === "None"
        ? ""
        : filters.modifiedAt;
    await selectOptionRobust(modifiedAtSelect, val);

    if (filters.modifiedAt === "Last N days") {
      const days = filters.modifiedDays || filters.days || "7";
      if (await modifiedAtDaysInput.isVisible().catch(() => false)) {
        await modifiedAtDaysInput.fill(String(days));
      }
    } else if (filters.modifiedAt === "Quarter") {
      const q = filters.modifiedQuarter || filters.quarter || "Q1";
      const qBtn = modifiedAtSection
        .locator(`button:has-text("${q}")`)
        .first();
      if (await qBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await qBtn.click();
      }
    } else if (filters.modifiedAt === "Custom range") {
      const fromDate =
        filters.modifiedFromDate ||
        filters.fromDate ||
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const toDate = filters.modifiedToDate || filters.toDate || new Date();
      if (await modifiedAtFromInput.isVisible().catch(() => false)) {
        await modifiedAtFromInput.fill(formatDateTimeLocal(fromDate));
      }
      if (await modifiedAtToInput.isVisible().catch(() => false)) {
        await modifiedAtToInput.fill(formatDateTimeLocal(toDate));
      }
    }
  } else {
    // Reset to empty / None if not specified
    const currentVal = await modifiedAtSelect.inputValue().catch(() => "");
    if (currentVal !== "") {
      await modifiedAtSelect.selectOption("").catch(() => {});
    }
  }

  // ── 3. Site Visit ─────────────────────────────────────────────────────
  if (filters.siteVisitSchedule !== undefined) {
    const val =
      filters.siteVisitSchedule === "Reset" ||
      filters.siteVisitSchedule === "None"
        ? ""
        : filters.siteVisitSchedule;
    await selectOptionRobust(siteVisitSelect, val);

    if (filters.siteVisitSchedule === "Last N days") {
      const days = filters.siteVisitDays || filters.days || "7";
      if (await siteVisitDaysInput.isVisible().catch(() => false)) {
        await siteVisitDaysInput.fill(String(days));
      }
    } else if (filters.siteVisitSchedule === "Quarter") {
      const q = filters.siteVisitQuarter || filters.quarter || "Q1";
      const qBtn = siteVisitSection.locator(`button:has-text("${q}")`).first();
      if (await qBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await qBtn.click();
      }
    } else if (filters.siteVisitSchedule === "Custom range") {
      const fromDate =
        filters.siteVisitFromDate ||
        filters.fromDate ||
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const toDate = filters.siteVisitToDate || filters.toDate || new Date();
      if (await siteVisitFromInput.isVisible().catch(() => false)) {
        await siteVisitFromInput.fill(formatDateTimeLocal(fromDate));
      }
      if (await siteVisitToInput.isVisible().catch(() => false)) {
        await siteVisitToInput.fill(formatDateTimeLocal(toDate));
      }
    }
  } else {
    const currentVal = await siteVisitSelect.inputValue().catch(() => "");
    if (currentVal !== "") {
      await siteVisitSelect.selectOption("").catch(() => {});
    }
  }

  // ── 4. Booking Date ───────────────────────────────────────────────────
  if (filters.bookingDate !== undefined) {
    const val =
      filters.bookingDate === "Reset" || filters.bookingDate === "None"
        ? ""
        : filters.bookingDate;
    await selectOptionRobust(bookingDateSelect, val);

    if (filters.bookingDate === "Last N days") {
      const days = filters.bookingDays || filters.days || "7";
      if (await bookingDateDaysInput.isVisible().catch(() => false)) {
        await bookingDateDaysInput.fill(String(days));
      }
    } else if (filters.bookingDate === "Quarter") {
      const q = filters.bookingQuarter || filters.quarter || "Q1";
      const qBtn = bookingDateSection
        .locator(`button:has-text("${q}")`)
        .first();
      if (await qBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await qBtn.click();
      }
    } else if (filters.bookingDate === "Custom range") {
      const fromDate =
        filters.bookingFromDate ||
        filters.fromDate ||
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const toDate = filters.bookingToDate || filters.toDate || new Date();
      if (await bookingDateFromInput.isVisible().catch(() => false)) {
        await bookingDateFromInput.fill(formatDateTimeLocal(fromDate));
      }
      if (await bookingDateToInput.isVisible().catch(() => false)) {
        await bookingDateToInput.fill(formatDateTimeLocal(toDate));
      }
    }
  } else {
    const currentVal = await bookingDateSelect.inputValue().catch(() => "");
    if (currentVal !== "") {
      await bookingDateSelect.selectOption("").catch(() => {});
    }
  }

  // ── 5. Tags ───────────────────────────────────────────────────────────
  if (filters.allTags) {
    if (await allTagsBtn.isVisible().catch(() => false)) {
      await allTagsBtn.scrollIntoViewIfNeeded().catch(() => {});
      await allTagsBtn.click();
    }
  } else if (filters.tag) {
    if (await allTagsBtn.isVisible().catch(() => false)) {
      await allTagsBtn.scrollIntoViewIfNeeded().catch(() => {});
      await allTagsBtn.click();
    }
    const tagBtn = tagsSection
      .locator(`button:has-text("${filters.tag}")`)
      .first();
    if (await tagBtn.isVisible().catch(() => false)) {
      await tagBtn.scrollIntoViewIfNeeded().catch(() => {});
      await tagBtn.click();
    }
  } else {
    // Default ensure All Tags active
    if (await allTagsBtn.isVisible().catch(() => false)) {
      const hasSvg = await allTagsBtn.locator("svg").count().catch(() => 0);
      if (hasSvg === 0) {
        await allTagsBtn.scrollIntoViewIfNeeded().catch(() => {});
        await allTagsBtn.click();
      }
    }
  }

  // ── Apply / Click Search ──────────────────────────────────────────────
  await FilterSearchButton.waitFor({ state: "visible", timeout: 5000 });

  await Promise.all([
    page
      .waitForResponse(
        (r) => r.url().includes("/leadReports/leadReportTrends"),
        { timeout: 10000 }
      )
      .catch(() => null),
    FilterSearchButton.click(),
  ]);

  // Wait for content or empty state to stabilize
  const { spinner, noDataLocator, noDataFound, table, dailyTrends } = (
    webelement || defaultWebElement
  ).pageElement(page);
  await spinner
    .first()
    .waitFor({ state: "hidden", timeout: 2500 })
    .catch(() => {});
  await Promise.race([
    dailyTrends.first().waitFor({ state: "visible", timeout: 6000 }),
    table.first().waitFor({ state: "visible", timeout: 6000 }),
    noDataLocator.first().waitFor({ state: "visible", timeout: 6000 }),
    noDataFound.waitFor({ state: "visible", timeout: 6000 }),
  ]).catch(() => {});
  await waitForRender(page);
}

module.exports = {
  formatDateTimeLocal,
  openAdvanceFilter,
  closeAdvanceFilter,
  resetFilters,
  applyFilters,
};
