/**
 * trendReportScenarioMatrix.js
 *
 * Declarative scenario matrix definitions and generator factories
 * for Trend Report automation testing.
 *
 * Covers:
 * 1. Core Reporting Periods (Today, Last N days, This month, Last month, Quarter Q1-Q4, This year, Custom range, All)
 * 2. Matching Combined Reporting Period & Modified At scenarios
 * 3. Reporting Period "All" with Modified At options
 * 4. Reporting Period "All" with Site Visit options (including Reset)
 * 5. Reporting Period "All" with Booking Date options (including Reset)
 * 6. Tags Filter Scenarios (All Tags & dynamic individual tags)
 */

function getDateRange14Days() {
  const fromDate14 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const toDateNow = new Date();
  return { fromDate14, toDateNow };
}

/**
 * Matching Reporting Period & Modified At combined scenarios.
 */
function getCombinedMatchingScenarios() {
  const { fromDate14, toDateNow } = getDateRange14Days();

  return [
    {
      name: "Reporting: Today | Modified: Today",
      filters: { reportingPeriod: "Today", modifiedAt: "Today" },
    },
    {
      name: "Reporting: Last N Days (7) | Modified: Last N Days (7)",
      filters: {
        reportingPeriod: "Last N days",
        days: "7",
        modifiedAt: "Last N days",
        modifiedDays: "7",
      },
    },
    {
      name: "Reporting: This Month | Modified: This Month",
      filters: { reportingPeriod: "This month", modifiedAt: "This month" },
    },
    {
      name: "Reporting: Last Month | Modified: Last Month",
      filters: { reportingPeriod: "Last month", modifiedAt: "Last month" },
    },
    {
      name: "Reporting: Quarter (Q1) | Modified: Quarter (Q1)",
      filters: {
        reportingPeriod: "Quarter",
        quarter: "Q1",
        modifiedAt: "Quarter",
        modifiedQuarter: "Q1",
      },
    },
    {
      name: "Reporting: Quarter (Q2) | Modified: Quarter (Q2)",
      filters: {
        reportingPeriod: "Quarter",
        quarter: "Q2",
        modifiedAt: "Quarter",
        modifiedQuarter: "Q2",
      },
    },
    {
      name: "Reporting: Quarter (Q3) | Modified: Quarter (Q3)",
      filters: {
        reportingPeriod: "Quarter",
        quarter: "Q3",
        modifiedAt: "Quarter",
        modifiedQuarter: "Q3",
      },
    },
    {
      name: "Reporting: Quarter (Q4) | Modified: Quarter (Q4)",
      filters: {
        reportingPeriod: "Quarter",
        quarter: "Q4",
        modifiedAt: "Quarter",
        modifiedQuarter: "Q4",
      },
    },
    {
      name: "Reporting: This Year | Modified: This Year",
      filters: { reportingPeriod: "This year", modifiedAt: "This year" },
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
    },
    {
      name: "Reporting: All | Modified: All",
      filters: { reportingPeriod: "All", modifiedAt: "All" },
    },
  ];
}

/**
 * Reporting Period "All" paired with each Modified At option.
 */
function getReportingAllWithModifiedScenarios() {
  const { fromDate14, toDateNow } = getDateRange14Days();

  return [
    {
      name: "Reporting: All | Modified: Today",
      filters: { reportingPeriod: "All", modifiedAt: "Today" },
    },
    {
      name: "Reporting: All | Modified: Last N Days (7)",
      filters: {
        reportingPeriod: "All",
        modifiedAt: "Last N days",
        modifiedDays: "7",
      },
    },
    {
      name: "Reporting: All | Modified: This Month",
      filters: { reportingPeriod: "All", modifiedAt: "This month" },
    },
    {
      name: "Reporting: All | Modified: Last Month",
      filters: { reportingPeriod: "All", modifiedAt: "Last month" },
    },
    {
      name: "Reporting: All | Modified: Quarter (Q1)",
      filters: {
        reportingPeriod: "All",
        modifiedAt: "Quarter",
        modifiedQuarter: "Q1",
      },
    },
    {
      name: "Reporting: All | Modified: Quarter (Q2)",
      filters: {
        reportingPeriod: "All",
        modifiedAt: "Quarter",
        modifiedQuarter: "Q2",
      },
    },
    {
      name: "Reporting: All | Modified: Quarter (Q3)",
      filters: {
        reportingPeriod: "All",
        modifiedAt: "Quarter",
        modifiedQuarter: "Q3",
      },
    },
    {
      name: "Reporting: All | Modified: Quarter (Q4)",
      filters: {
        reportingPeriod: "All",
        modifiedAt: "Quarter",
        modifiedQuarter: "Q4",
      },
    },
    {
      name: "Reporting: All | Modified: This Year",
      filters: { reportingPeriod: "All", modifiedAt: "This year" },
    },
    {
      name: "Reporting: All | Modified: Custom Range",
      filters: {
        reportingPeriod: "All",
        modifiedAt: "Custom range",
        modifiedFromDate: fromDate14,
        modifiedToDate: toDateNow,
      },
    },
    {
      name: "Reporting: All | Modified: Reset",
      filters: { reportingPeriod: "All", modifiedAt: "Reset" },
    },
  ];
}

/**
 * Site Visit filter scenarios with Reporting Period "All".
 */
function getSiteVisitScenarios() {
  const { fromDate14, toDateNow } = getDateRange14Days();

  return [
    {
      name: "Reporting: All | Site Visit: Today",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Today" },
    },
    {
      name: "Reporting: All | Site Visit: Last N Days (7)",
      filters: {
        reportingPeriod: "All",
        siteVisitSchedule: "Last N days",
        siteVisitDays: "7",
      },
    },
    {
      name: "Reporting: All | Site Visit: This Month",
      filters: { reportingPeriod: "All", siteVisitSchedule: "This month" },
    },
    {
      name: "Reporting: All | Site Visit: Last Month",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Last month" },
    },
    {
      name: "Reporting: All | Site Visit: Quarter (Q1)",
      filters: {
        reportingPeriod: "All",
        siteVisitSchedule: "Quarter",
        siteVisitQuarter: "Q1",
      },
    },
    {
      name: "Reporting: All | Site Visit: Quarter (Q2)",
      filters: {
        reportingPeriod: "All",
        siteVisitSchedule: "Quarter",
        siteVisitQuarter: "Q2",
      },
    },
    {
      name: "Reporting: All | Site Visit: Quarter (Q3)",
      filters: {
        reportingPeriod: "All",
        siteVisitSchedule: "Quarter",
        siteVisitQuarter: "Q3",
      },
    },
    {
      name: "Reporting: All | Site Visit: Quarter (Q4)",
      filters: {
        reportingPeriod: "All",
        siteVisitSchedule: "Quarter",
        siteVisitQuarter: "Q4",
      },
    },
    {
      name: "Reporting: All | Site Visit: This Year",
      filters: { reportingPeriod: "All", siteVisitSchedule: "This year" },
    },
    {
      name: "Reporting: All | Site Visit: Custom Range",
      filters: {
        reportingPeriod: "All",
        siteVisitSchedule: "Custom range",
        siteVisitFromDate: fromDate14,
        siteVisitToDate: toDateNow,
      },
    },
    {
      name: "Reporting: All | Site Visit: All",
      filters: { reportingPeriod: "All", siteVisitSchedule: "All" },
    },
    {
      name: "Reporting: All | Site Visit: Reset",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Reset" },
    },
  ];
}

/**
 * Booking Date filter scenarios with Reporting Period "All".
 */
function getBookingDateScenarios() {
  const { fromDate14, toDateNow } = getDateRange14Days();

  return [
    {
      name: "Reporting: All | Booking Date: Today",
      filters: { reportingPeriod: "All", bookingDate: "Today" },
    },
    {
      name: "Reporting: All | Booking Date: Last N Days (7)",
      filters: {
        reportingPeriod: "All",
        bookingDate: "Last N days",
        bookingDays: "7",
      },
    },
    {
      name: "Reporting: All | Booking Date: This Month",
      filters: { reportingPeriod: "All", bookingDate: "This month" },
    },
    {
      name: "Reporting: All | Booking Date: Last Month",
      filters: { reportingPeriod: "All", bookingDate: "Last month" },
    },
    {
      name: "Reporting: All | Booking Date: Quarter (Q1)",
      filters: {
        reportingPeriod: "All",
        bookingDate: "Quarter",
        bookingQuarter: "Q1",
      },
    },
    {
      name: "Reporting: All | Booking Date: Quarter (Q2)",
      filters: {
        reportingPeriod: "All",
        bookingDate: "Quarter",
        bookingQuarter: "Q2",
      },
    },
    {
      name: "Reporting: All | Booking Date: Quarter (Q3)",
      filters: {
        reportingPeriod: "All",
        bookingDate: "Quarter",
        bookingQuarter: "Q3",
      },
    },
    {
      name: "Reporting: All | Booking Date: Quarter (Q4)",
      filters: {
        reportingPeriod: "All",
        bookingDate: "Quarter",
        bookingQuarter: "Q4",
      },
    },
    {
      name: "Reporting: All | Booking Date: This Year",
      filters: { reportingPeriod: "All", bookingDate: "This year" },
    },
    {
      name: "Reporting: All | Booking Date: Custom Range",
      filters: {
        reportingPeriod: "All",
        bookingDate: "Custom range",
        bookingFromDate: fromDate14,
        bookingToDate: toDateNow,
      },
    },
    {
      name: "Reporting: All | Booking Date: All",
      filters: { reportingPeriod: "All", bookingDate: "All" },
    },
    {
      name: "Reporting: All | Booking Date: Reset",
      filters: { reportingPeriod: "All", bookingDate: "Reset" },
    },
  ];
}

/**
 * Default matrix scenarios covering:
 * - Core Reporting Periods
 * - Matching Combined Reporting Period & Modified At
 * - Reporting Period "All" with each Modified At option
 * - Reporting Period "All" with all Site Visit options
 * - Reporting Period "All" with all Booking Date options
 */
function getDefaultScenarios() {
  const { fromDate14, toDateNow } = getDateRange14Days();

  return [
    // ── 1. Core Reporting Periods ──
    {
      name: "Reporting Period: Today",
      filters: { reportingPeriod: "Today" },
    },
    {
      name: "Reporting Period: Last N Days (7)",
      filters: { reportingPeriod: "Last N days", days: "7" },
    },
    {
      name: "Reporting Period: This Month",
      filters: { reportingPeriod: "This month" },
    },
    {
      name: "Reporting Period: Last Month",
      filters: { reportingPeriod: "Last month" },
    },
    {
      name: "Reporting Period: Quarter (Q1)",
      filters: { reportingPeriod: "Quarter", quarter: "Q1" },
    },
    {
      name: "Reporting Period: Quarter (Q2)",
      filters: { reportingPeriod: "Quarter", quarter: "Q2" },
    },
    {
      name: "Reporting Period: Quarter (Q3)",
      filters: { reportingPeriod: "Quarter", quarter: "Q3" },
    },
    {
      name: "Reporting Period: Quarter (Q4)",
      filters: { reportingPeriod: "Quarter", quarter: "Q4" },
    },
    {
      name: "Reporting Period: This Year",
      filters: { reportingPeriod: "This year" },
    },
    {
      name: "Reporting Period: Custom Range (14 days)",
      filters: {
        reportingPeriod: "Custom range",
        fromDate: fromDate14,
        toDate: toDateNow,
      },
    },
    {
      name: "Reporting Period: All",
      filters: { reportingPeriod: "All" },
    },

    // ── 2. Matching Combined Reporting Period & Modified At ──
    ...getCombinedMatchingScenarios(),

    // ── 3. Reporting Period "All" with each Modified At option ──
    ...getReportingAllWithModifiedScenarios().filter(
      (s) => s.name !== "Reporting: All | Modified: All"
    ),

    // ── 4. Reporting Period "All" with all Site Visit options ──
    ...getSiteVisitScenarios(),

    // ── 5. Reporting Period "All" with all Booking Date options ──
    ...getBookingDateScenarios(),
  ];
}

/**
 * Dynamic Tags filter scenarios.
 *
 * @param {Array<string>} availableTags
 * @returns {Array<{name: string, filters: Object}>}
 */
function getTagsScenarios(availableTags = []) {
  const scenarios = [
    {
      name: "Tags Filter: All Tags",
      filters: { reportingPeriod: "All", allTags: true },
    },
  ];
  for (const tagName of availableTags) {
    scenarios.push({
      name: `Tags Filter: ${tagName}`,
      filters: { reportingPeriod: "All", tag: tagName },
    });
  }
  return scenarios;
}

module.exports = {
  getDateRange14Days,
  getCombinedMatchingScenarios,
  getReportingAllWithModifiedScenarios,
  getSiteVisitScenarios,
  getBookingDateScenarios,
  getDefaultScenarios,
  getTagsScenarios,
};
