/**
 * pipelineFunnelScenarioMatrix.js
 *
 * Declarative scenario matrix definitions and generator factories
 * for Pipeline Funnel Report automation testing.
 *
 * Covers:
 * 1. Core Reporting Periods (Today, Last N days, This month, Last month, Quarter, This year, Custom range, All)
 * 2. Matching Combined Reporting Period & Modified At scenarios
 * 3. Reporting Period "All" with Modified At options
 * 4. Reporting Period "All" with Site Visit options (including Reset)
 * 5. Reporting Period "All" with Booking Date options (including Reset)
 * 6. Tags filter scenarios
 * 7. Pipeline filter scenarios (Default, Each pipeline, Switching, Combined, Reset)
 * 8. Created By filter scenarios (Default, Each staff member, Switching, Combined with Pipeline, Combined with other filters, Reset)
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
      filters: { reportingPeriod: "All", modifiedAt: "Last N days", modifiedDays: "7" },
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
      filters: { reportingPeriod: "All", siteVisitSchedule: "Last N days", siteVisitDays: "7" },
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
      filters: { reportingPeriod: "All", siteVisitSchedule: "Quarter", siteVisitQuarter: "Q1" },
    },
    {
      name: "Reporting: All | Site Visit: Quarter (Q2)",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Quarter", siteVisitQuarter: "Q2" },
    },
    {
      name: "Reporting: All | Site Visit: Quarter (Q3)",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Quarter", siteVisitQuarter: "Q3" },
    },
    {
      name: "Reporting: All | Site Visit: Quarter (Q4)",
      filters: { reportingPeriod: "All", siteVisitSchedule: "Quarter", siteVisitQuarter: "Q4" },
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
      filters: { reportingPeriod: "All", bookingDate: "Last N days", bookingDays: "7" },
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
      filters: { reportingPeriod: "All", bookingDate: "Quarter", bookingQuarter: "Q1" },
    },
    {
      name: "Reporting: All | Booking Date: Quarter (Q2)",
      filters: { reportingPeriod: "All", bookingDate: "Quarter", bookingQuarter: "Q2" },
    },
    {
      name: "Reporting: All | Booking Date: Quarter (Q3)",
      filters: { reportingPeriod: "All", bookingDate: "Quarter", bookingQuarter: "Q3" },
    },
    {
      name: "Reporting: All | Booking Date: Quarter (Q4)",
      filters: { reportingPeriod: "All", bookingDate: "Quarter", bookingQuarter: "Q4" },
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
 * Pipeline filter scenarios (Section 8 of prompt).
 *
 * @param {Array<string>} pipelineNames
 */
function getPipelineScenarios(pipelineNames = []) {
  const scenarios = [
    // Scenario 1: Default Pipeline Selection (Pre-Sales)
    {
      name: "Pipeline Filter: Default Selection (Pre-Sales)",
      filters: { reportingPeriod: "All", pipeline: "Pre- Sales" },
    },
  ];

  // Scenario 2: Select Each Available Pipeline
  for (const name of pipelineNames) {
    if (name && name !== "Pre- Sales") {
      scenarios.push({
        name: `Pipeline Filter: ${name}`,
        filters: { reportingPeriod: "All", pipeline: name },
      });
    }
  }

  // Scenario 3: Switch Between Pipelines
  scenarios.push({
    name: "Pipeline Filter: Switch Between Pipelines",
    filters: { reportingPeriod: "All", pipeline: pipelineNames[1] || "Sales Engagement" },
  });

  // Scenario 4: Pipeline Combined with Other Filters
  scenarios.push(
    {
      name: "Pipeline Combined: Last 30 Days + Modified This Month + Pipeline",
      filters: {
        reportingPeriod: "Last N days",
        days: "30",
        modifiedAt: "This month",
        pipeline: pipelineNames[0] || "Pre- Sales",
      },
    },
    {
      name: "Pipeline Combined: All + Site Visit All + Pipeline",
      filters: {
        reportingPeriod: "All",
        siteVisitSchedule: "All",
        pipeline: pipelineNames[1] || "Sales Engagement",
      },
    },
    {
      name: "Pipeline Combined: All + All Tags + Pipeline",
      filters: {
        reportingPeriod: "All",
        allTags: true,
        pipeline: pipelineNames[0] || "Pre- Sales",
      },
    }
  );

  // Scenario 5: Pipeline Reset Behavior
  scenarios.push({
    name: "Pipeline Filter: Reset Behavior",
    filters: {
      reportingPeriod: "All",
      resetPipelineToDefault: true,
    },
  });

  return scenarios;
}

/**
 * Created By (Lead Owner) filter scenarios (Section 9 of prompt).
 *
 * @param {Array<string>} staffNames
 * @param {Array<string>} pipelineNames
 */
function getCreatedByScenarios(staffNames = [], pipelineNames = []) {
  const scenarios = [
    // Scenario 1: Default Staff Selection (All Team Members)
    {
      name: "Created By Filter: Default Selection (All Team Members)",
      filters: { reportingPeriod: "All", createdBy: "All Team Members" },
    },
  ];

  // Scenario 2: Select Each Staff Member
  for (const staff of staffNames) {
    if (staff && staff !== "All Team Members") {
      scenarios.push({
        name: `Created By Filter: ${staff}`,
        filters: { reportingPeriod: "All", createdBy: staff },
      });
    }
  }

  // Scenario 3: Switch Between Staff Members
  if (staffNames.length >= 3) {
    scenarios.push({
      name: `Created By Filter: Switch to ${staffNames[2]}`,
      filters: { reportingPeriod: "All", createdBy: staffNames[2] },
    });
  }

  // Scenario 4: Created By Combined with Pipeline
  const samplePipeline = pipelineNames[1] || "Sales Engagement";
  const sampleStaff = staffNames.find((s) => s && s !== "All Team Members") || "Pooja Bhat";
  scenarios.push({
    name: `Created By Combined: Pipeline (${samplePipeline}) + Staff (${sampleStaff})`,
    filters: {
      reportingPeriod: "All",
      pipeline: samplePipeline,
      createdBy: sampleStaff,
    },
  });

  // Scenario 5: Created By Combined with Other Filters
  scenarios.push(
    {
      name: "Created By Combined: Last 30 Days + Modified + Staff",
      filters: {
        reportingPeriod: "Last N days",
        days: "30",
        modifiedAt: "This month",
        createdBy: sampleStaff,
      },
    },
    {
      name: "Created By Combined: All + Site Visit + Booking Date + Staff",
      filters: {
        reportingPeriod: "All",
        siteVisitSchedule: "All",
        bookingDate: "All",
        createdBy: sampleStaff,
      },
    }
  );

  // Scenario 6: Created By Reset Behavior
  scenarios.push({
    name: "Created By Filter: Reset Behavior",
    filters: {
      reportingPeriod: "All",
      createdBy: "Reset",
      resetPipelineToDefault: true,
    },
  });

  return scenarios;
}

/**
 * Returns baseline matrix scenarios for Pipeline Funnel Report.
 */
function getDefaultScenarios() {
  const { fromDate14, toDateNow } = getDateRange14Days();

  return [
    // ── 1. Core Reporting Periods ──
    {
      name: "Today",
      filters: { reportingPeriod: "Today" },
    },
    {
      name: "Last N Days (7)",
      filters: { reportingPeriod: "Last N days", days: "7" },
    },
    {
      name: "Last N Days (30)",
      filters: { reportingPeriod: "Last N days", days: "30" },
    },
    {
      name: "This Month",
      filters: { reportingPeriod: "This month" },
    },
    {
      name: "Last Month",
      filters: { reportingPeriod: "Last month" },
    },
    {
      name: "Quarter (Q1)",
      filters: { reportingPeriod: "Quarter", quarter: "Q1" },
    },
    {
      name: "Quarter (Q2)",
      filters: { reportingPeriod: "Quarter", quarter: "Q2" },
    },
    {
      name: "Quarter (Q3)",
      filters: { reportingPeriod: "Quarter", quarter: "Q3" },
    },
    {
      name: "Quarter (Q4)",
      filters: { reportingPeriod: "Quarter", quarter: "Q4" },
    },
    {
      name: "This Year",
      filters: { reportingPeriod: "This year" },
    },
    {
      name: "Custom Range (14 days)",
      filters: {
        reportingPeriod: "Custom range",
        fromDate: fromDate14,
        toDate: toDateNow,
      },
    },
    {
      name: "All",
      filters: { reportingPeriod: "All" },
    },

    // ── 2. Matching Combined Reporting Period & Modified At ──
    ...getCombinedMatchingScenarios(),

    // ── 3. Reporting Period "All" with each Modified At option ──
    ...getReportingAllWithModifiedScenarios(),

    // ── 4. Reporting Period "All" with all Site Visit options ──
    ...getSiteVisitScenarios(),

    // ── 5. Reporting Period "All" with all Booking Date options ──
    ...getBookingDateScenarios(),
  ];
}

module.exports = {
  getDateRange14Days,
  getCombinedMatchingScenarios,
  getReportingAllWithModifiedScenarios,
  getSiteVisitScenarios,
  getBookingDateScenarios,
  getPipelineScenarios,
  getCreatedByScenarios,
  getDefaultScenarios,
};
