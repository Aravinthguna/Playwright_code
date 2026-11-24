/**
 * sourceReportValidation.js
 *
 * Validation helpers, count comparison, lead source record matching,
 * formatted failure reports, and date formatting for Source Report testing.
 */

/**
 * Compare report count with popup total and return validation result.
 *
 * @param {number} reportCount
 * @param {number|null} popupTotal
 * @param {string} sourceName
 * @param {Object} filters - active filters for context
 * @returns {{passed: boolean, message: string}}
 */
function validateReportAndPopupCounts(reportCount, popupTotal, sourceName, filters) {
  if (popupTotal === null) {
    return {
      passed: false,
      message:
        `[${sourceName}] Could not extract popup total count.\n` +
        `  Report Count: ${reportCount}\n` +
        `  Popup Total: UNKNOWN\n` +
        `  Filters: ${JSON.stringify(filters)}`,
    };
  }

  if (reportCount !== popupTotal) {
    return {
      passed: false,
      message:
        `[${sourceName}] Count MISMATCH between report and popup.\n` +
        `  Report Count: ${reportCount}\n` +
        `  Popup Total: ${popupTotal}\n` +
        `  Filters: ${JSON.stringify(filters)}`,
    };
  }

  return {
    passed: true,
    message:
      `[${sourceName}] Counts match. Report=${reportCount}, Popup=${popupTotal}`,
  };
}

/**
 * Validate that lead records match the expected source name.
 *
 * @param {Array} records - lead records from the popup
 * @param {string} expectedSource - the expected source name
 * @returns {{passed: boolean, message: string, mismatches: Array}}
 */
function validateLeadRecordsBySource(records, expectedSource) {
  if (!records || records.length === 0) {
    return {
      passed: true,
      message: `No records to validate for source "${expectedSource}".`,
      mismatches: [],
    };
  }

  const mismatches = [];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    // Only validate if the source field is actually populated
    if (
      record.source &&
      record.source.toLowerCase() !== expectedSource.toLowerCase()
    ) {
      mismatches.push({
        index: i,
        expected: expectedSource,
        actual: record.source,
        record: record.rawText,
      });
    }
  }

  if (mismatches.length > 0) {
    return {
      passed: false,
      message:
        `[${expectedSource}] ${mismatches.length}/${records.length} records have wrong source.\n` +
        mismatches
          .slice(0, 5)
          .map((m) => `  Row ${m.index}: expected "${m.expected}", got "${m.actual}"`)
          .join("\n"),
      mismatches,
    };
  }

  return {
    passed: true,
    message: `All ${records.length} records match source "${expectedSource}".`,
    mismatches: [],
  };
}

/**
 * Build a detailed failure report string.
 *
 * @param {string} scenarioName
 * @param {Object} filters
 * @param {string} sourceName
 * @param {number} reportCount
 * @param {number|null} popupTotal
 * @param {number|string} uniqueRecords
 * @param {string} reason
 * @returns {string}
 */
function buildFailureReport(scenarioName, filters, sourceName, reportCount, popupTotal, uniqueRecords, reason) {
  return [
    ``,
    `══════════════════════════════════════════`,
    `  SCENARIO FAILURE REPORT`,
    `══════════════════════════════════════════`,
    `Scenario:            ${scenarioName}`,
    `Source:               ${sourceName}`,
    ``,
    `Filters Applied:`,
    ...Object.entries(filters).map(([k, v]) => `  ${k}: ${v instanceof Date ? v.toISOString() : v}`),
    ``,
    `Report Count:         ${reportCount}`,
    `Popup Total:          ${popupTotal ?? "UNKNOWN"}`,
    `Unique Records:       ${uniqueRecords ?? "N/A"}`,
    ``,
    `Result: FAIL`,
    ``,
    `Reason:`,
    `  ${reason}`,
    `══════════════════════════════════════════`,
    ``,
  ].join("\n");
}

/**
 * Format a Date object for datetime-local input fields (YYYY-MM-DDTHH:mm).
 *
 * @param {Date} date
 * @returns {string}
 */
function formatDateTimeLocal(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

module.exports = {
  validateReportAndPopupCounts,
  validateLeadRecordsBySource,
  buildFailureReport,
  formatDateTimeLocal,
};
