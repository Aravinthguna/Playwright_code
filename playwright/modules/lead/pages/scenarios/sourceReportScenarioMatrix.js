/**
 * sourceReportScenarioMatrix.js
 *
 * Declarative scenario matrix definitions and generator factories
 * for Source Report automation testing.
 *
 * Covers:
 * 1. Core Reporting Periods (Today, Last N days, This month, Last month, Q1..Q4, This year, Custom range, All)
 * 2. Matching Combined Reporting Period & Modified At scenarios
 * 3. Reporting Period "All" with Modified At options
 * 4. Reporting Period "All" with Site Visit options (including Reset)
 * 5. Reporting Period "All" with Booking Date options (including Reset)
 */

function getDateRange14Days() {
  const fromDate14 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const toDateNow = new Date();
  return { fromDate14, toDateNow };
}

/**
 * Returns matching Reporting Period & Modified At combined scenarios.
 * @returns {Array<{name: string, filters: Object, options: Object}>}
 */
function getCombinedMatchingScenarios() {
  const { fromDate14, toDateNow } = getDateRange14Days();

  return [
    {
      name: "Reporting: Today | Modified: Today",
      filters: { reportingPeriod: "Today", modifiedAt: "Today" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: Last N Days | Modified: Last N Days",
      filters: {
        reportingPeriod: "Last N days",
        days: "7",
        modifiedAt: "Last N days",
        modifiedDays: "7",
      },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: This Month | Modified: This Month",
      filters: { reportingPeriod: "This month", modifiedAt: "This month" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: Last Month | Modified: Last Month",
      filters: { reportingPeriod: "Last month", modifiedAt: "Last month" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: Quarter (Q1) | Modified: Quarter (Q1)",
      filters: {
        reportingPeriod: "Quarter",
        quarter: "Q1",
        modifiedAt: "Quarter",
        modifiedQuarter: "Q1",
      },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: Quarter (Q2) | Modified: Quarter (Q2)",
      filters: {
        reportingPeriod: "Quarter",
        quarter: "Q2",
        modifiedAt: "Quarter",
        modifiedQuarter: "Q2",
      },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: Quarter (Q3) | Modified: Quarter (Q3)",
      filters: {
        reportingPeriod: "Quarter",
        quarter: "Q3",
        modifiedAt: "Quarter",
        modifiedQuarter: "Q3",
      },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: Quarter (Q4) | Modified: Quarter (Q4)",
      filters: {
        reportingPeriod: "Quarter",
        quarter: "Q4",
        modifiedAt: "Quarter",
        modifiedQuarter: "Q4",
      },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: This Year | Modified: This Year",
      filters: { reportingPeriod: "This year", modifiedAt: "This year" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: Custom Range | Modified: Custom Range",
      filters: {
        reportingPeriod: "Custom range",
        fromDate: fromDate14,
        toDate: toDateNow,
        modifiedAt: "Custom range",
        modifiedFromDate: fromDate14,
        modifiedToDate: toDateNow,
      },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Modified: All",
      filters: { reportingPeriod: "All", modifiedAt: "All" },
      options: { validateChartView: true },
    },
  ];
}

/**
 * Returns Reporting Period "All" paired with each Modified At option.
 * @returns {Array<{name: string, filters: Object, options: Object}>}
 */
function getReportingAllWithModifiedScenarios() {
  const { fromDate14, toDateNow } = getDateRange14Days();

  return [
    {
      name: "Reporting: All | Modified: Today",
      filters: { reportingPeriod: "All", modifiedAt: "Today" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Modified: Last N Days",
      filters: { reportingPeriod: "All", modifiedAt: "Last N days", modifiedDays: "7" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Modified: This Month",
      filters: { reportingPeriod: "All", modifiedAt: "This month" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Modified: Last Month",
      filters: { reportingPeriod: "All", modifiedAt: "Last month" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Modified: This Year",
      filters: { reportingPeriod: "All", modifiedAt: "This year" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Modified: Custom Range",
      filters: {
        reportingPeriod: "All",
        modifiedAt: "Custom range",
        modifiedFromDate: fromDate14,
        modifiedToDate: toDateNow,
      },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Modified: All",
      filters: { reportingPeriod: "All", modifiedAt: "All" },
      options: { validateChartView: true },
    },
  ];
}

/**
 * Returns Site Visit filter scenarios with Reporting Period "All":
 * Today, Last N days (7), This month, Last month, Quarter (Q1..Q4), This year, Custom range, All, Reset.
 * @returns {Array<{name: string, filters: Object, options: Object}>}
 */
function getSiteVisitScenarios() {
  const { fromDate14, toDateNow } = getDateRange14Days();

  return [
    {
      name: "Reporting: All | Site Visit: Today",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Today" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Site Visit: Last N Days",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Last N days", siteVisitDays: "7" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Site Visit: This Month",
      filters: { reportingPeriod: "All", siteVisitSchedule: "This month" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Site Visit: Last Month",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Last month" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Site Visit: Quarter (Q1)",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Quarter", siteVisitQuarter: "Q1" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Site Visit: Quarter (Q2)",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Quarter", siteVisitQuarter: "Q2" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Site Visit: Quarter (Q3)",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Quarter", siteVisitQuarter: "Q3" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Site Visit: Quarter (Q4)",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Quarter", siteVisitQuarter: "Q4" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Site Visit: This Year",
      filters: { reportingPeriod: "All", siteVisitSchedule: "This year" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Site Visit: Custom Range",
      filters: {
        reportingPeriod: "All",
        siteVisitSchedule: "Custom range",
        siteVisitFromDate: fromDate14,
        siteVisitToDate: toDateNow,
      },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Site Visit: All",
      filters: { reportingPeriod: "All", siteVisitSchedule: "All" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Site Visit: Reset",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Reset" },
      options: { validateChartView: true },
    },
  ];
}

/**
 * Returns Booking Date filter scenarios with Reporting Period "All":
 * Today, Last N days (7), This month, Last month, Quarter (Q1..Q4), This year, Custom range, All, Reset.
 * @returns {Array<{name: string, filters: Object, options: Object}>}
 */
function getBookingDateScenarios() {
  const { fromDate14, toDateNow } = getDateRange14Days();

  return [
    {
      name: "Reporting: All | Booking Date: Today",
      filters: { reportingPeriod: "All", bookingDate: "Today" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Booking Date: Last N Days",
      filters: { reportingPeriod: "All", bookingDate: "Last N days", bookingDays: "7" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Booking Date: This Month",
      filters: { reportingPeriod: "All", bookingDate: "This month" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Booking Date: Last Month",
      filters: { reportingPeriod: "All", bookingDate: "Last month" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Booking Date: Quarter (Q1)",
      filters: { reportingPeriod: "All", bookingDate: "Quarter", bookingQuarter: "Q1" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Booking Date: Quarter (Q2)",
      filters: { reportingPeriod: "All", bookingDate: "Quarter", bookingQuarter: "Q2" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Booking Date: Quarter (Q3)",
      filters: { reportingPeriod: "All", bookingDate: "Quarter", bookingQuarter: "Q3" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Booking Date: Quarter (Q4)",
      filters: { reportingPeriod: "All", bookingDate: "Quarter", bookingQuarter: "Q4" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Booking Date: This Year",
      filters: { reportingPeriod: "All", bookingDate: "This year" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Booking Date: Custom Range",
      filters: {
        reportingPeriod: "All",
        bookingDate: "Custom range",
        bookingFromDate: fromDate14,
        bookingToDate: toDateNow,
      },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Booking Date: All",
      filters: { reportingPeriod: "All", bookingDate: "All" },
      options: { validateChartView: true },
    },
    {
      name: "Reporting: All | Booking Date: Reset",
      filters: { reportingPeriod: "All", bookingDate: "Reset" },
      options: { validateChartView: true },
    },
  ];
}

/**
 * Returns the complete scenario matrix covering:
 * 1. Core Reporting Periods
 * 2. Matching Combined Reporting Period & Modified At scenarios
 * 3. Reporting Period "All" with each Modified At option
 * 4. Reporting Period "All" with all Site Visit options
 * 5. Reporting Period "All" with all Booking Date options
 *
 * @returns {Array<{name: string, filters: Object, options: Object}>}
 */
function getDefaultScenarios() {
  const { fromDate14, toDateNow } = getDateRange14Days();

  return [
    // ── 1. Core Reporting Periods ──
    {
      name: "Today",
      filters: { reportingPeriod: "Today" },
      options: { validateChartView: true },
    },
    {
      name: "Last N Days (7)",
      filters: { reportingPeriod: "Last N days", days: "7" },
      options: { validateChartView: true },
    },
    {
      name: "This Month",
      filters: { reportingPeriod: "This month" },
      options: { validateChartView: true },
    },
    {
      name: "Last Month",
      filters: { reportingPeriod: "Last month" },
      options: { validateChartView: true },
    },
    {
      name: "Quarter (Q1)",
      filters: { reportingPeriod: "Quarter", quarter: "Q1" },
      options: { validateChartView: true },
    },
    {
      name: "Quarter (Q2)",
      filters: { reportingPeriod: "Quarter", quarter: "Q2" },
      options: { validateChartView: true },
    },
    {
      name: "Quarter (Q3)",
      filters: { reportingPeriod: "Quarter", quarter: "Q3" },
      options: { validateChartView: true },
    },
    {
      name: "Quarter (Q4)",
      filters: { reportingPeriod: "Quarter", quarter: "Q4" },
      options: { validateChartView: true },
    },
    {
      name: "This Year",
      filters: { reportingPeriod: "This year" },
      options: { validateChartView: true },
    },
    {
      name: "Custom Range (14 days)",
      filters: {
        reportingPeriod: "Custom range",
        fromDate: fromDate14,
        toDate: toDateNow,
      },
      options: { validateChartView: true },
    },
    {
      name: "All",
      filters: { reportingPeriod: "All" },
      options: { validateChartView: true },
    },

    // ── 2. Matching Combined Reporting Period & Modified At ──
    ...getCombinedMatchingScenarios(),

    // ── 3. Reporting Period "All" with each Modified At option ──
    ...getReportingAllWithModifiedScenarios().filter(
      (s) => s.name !== "Reporting: All | Modified: All" // Avoid duplicate of All+All
    ),

    // ── 4. Reporting Period "All" with all Site Visit options ──
    ...getSiteVisitScenarios(),

    // ── 5. Reporting Period "All" with all Booking Date options ──
    ...getBookingDateScenarios(),
  ];
}

module.exports = {
  getCombinedMatchingScenarios,
  getReportingAllWithModifiedScenarios,
  getSiteVisitScenarios,
  getBookingDateScenarios,
  getDefaultScenarios,
};
