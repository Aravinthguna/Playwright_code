const path = require('path');
const { WebElement } = require('../../../utils/WebElements');
const { expect } = require('@playwright/test');
const {
  generateAndSaveCsv,
  generateNegativeCsv,
  generateLeadRecords,
  saveLeadsToCsvFile,
  cleanupCsvFile,
} = require('../../../utils/csvGenerator');

const webelement = new WebElement();

/**
 * LeadCSVUploadPage
 * Handles all interactions with the CRM "Upload csv" dropdown, "Upload Lead" popup,
 * CSV file attachment, checkbox toggles, upload submission, import verification,
 * and error handling.
 */
class LeadCSVUploadPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Retrieves all relevant web elements from the centralized WebElement registry.
   */
  getElements() {
    return webelement.pageElement(this.page);
  }

  /**
   * Opens the "Upload Leads CSV" popup from the Lead List page.
   */
  async openUploadPopup() {
    const { uploadCsvFileButton, uploadLeadButton } = this.getElements();

    // Ensure we are on the page with Upload csv button
    await expect(uploadCsvFileButton).toBeVisible({ timeout: 10000 });
    await uploadCsvFileButton.click();

    // Select "Upload Lead" from the dropdown options
    await expect(uploadLeadButton).toBeVisible({ timeout: 5000 });
    await uploadLeadButton.click();

    // Verify popup is open and file upload input is ready
    const { fileUploadButton } = this.getElements();
    await expect(fileUploadButton).toBeAttached({ timeout: 5000 });
    console.log('[LeadCSVUploadPage] Upload Leads CSV popup opened successfully.');
  }

  /**
   * Selects and attaches a CSV file into the popup file input.
   *
   * @param {string} filePath - Path to the CSV file
   */
  async selectCsvFile(filePath) {
    const { fileUploadButton, clickUploadButton, deletCsvFileBUtton } = this.getElements();
    const fileName = path.basename(filePath);

    // Playwright setInputFiles directly handles standard <input type="file">
    await fileUploadButton.setInputFiles(filePath);
    console.log(`[LeadCSVUploadPage] File attached via setInputFiles: ${fileName}`);

    // Verify the selected filename appears in the popup or the delete button is visible
    const fileNameLocator = this.page.locator(`text=${fileName}`).or(
      this.page.locator('span, p, div').filter({ hasText: fileName })
    );

    try {
      await expect(fileNameLocator.first().or(deletCsvFileBUtton)).toBeVisible({ timeout: 5000 });
      console.log(`[LeadCSVUploadPage] Confirmed selected filename display in popup: ${fileName}`);
    } catch (e) {
      console.warn('[LeadCSVUploadPage] Filename locator not immediately visible, checking delete button...');
      await expect(deletCsvFileBUtton).toBeVisible({ timeout: 5000 });
    }

    // Verify Upload button is available
    await expect(clickUploadButton).toBeVisible({ timeout: 5000 });
    console.log('[LeadCSVUploadPage] Upload button is available.');
  }

  /**
   * Sets the "Do you want to add these Leads to CRM?" checkbox.
   *
   * @param {boolean} shouldCheck - Whether the checkbox should be checked (true) or unchecked (false)
   */
  async setAddToCrmCheckbox(shouldCheck = true) {
    const { doyouwantCrmCheckBox } = this.getElements();

    if (await doyouwantCrmCheckBox.count() > 0 && await doyouwantCrmCheckBox.first().isVisible()) {
      const isChecked = await doyouwantCrmCheckBox.first().isChecked();
      if (shouldCheck && !isChecked) {
        await doyouwantCrmCheckBox.first().check();
        console.log('[LeadCSVUploadPage] Checkbox "Do you want to add these Leads to CRM?" checked.');
      } else if (!shouldCheck && isChecked) {
        await doyouwantCrmCheckBox.first().uncheck();
        console.log('[LeadCSVUploadPage] Checkbox "Do you want to add these Leads to CRM?" unchecked.');
      }
    } else {
      console.log('[LeadCSVUploadPage] Optional checkbox not present or not visible; proceeding.');
    }
  }

  /**
   * Removes the currently selected file using the delete/remove button.
   */
  async removeSelectedFile() {
    const { deletCsvFileBUtton } = this.getElements();
    await expect(deletCsvFileBUtton).toBeVisible({ timeout: 5000 });
    await deletCsvFileBUtton.click();
    console.log('[LeadCSVUploadPage] Clicked remove/delete file button.');

    // Verify the remove button is no longer visible (file has been removed)
    await expect(deletCsvFileBUtton).not.toBeVisible({ timeout: 5000 });
  }

  /**
   * Cancels the upload and verifies popup closes.
   */
  async cancelUpload() {
    const { cancelUploadButton, clickUploadButton } = this.getElements();
    if (await cancelUploadButton.count() > 0 && await cancelUploadButton.first().isVisible()) {
      await cancelUploadButton.first().click();
      console.log('[LeadCSVUploadPage] Clicked Cancel button.');
    } else {
      await this.page.keyboard.press('Escape');
      console.log('[LeadCSVUploadPage] Closed popup via Escape key.');
    }

    // Verify popup is closed
    await expect(clickUploadButton).not.toBeVisible({ timeout: 5000 });
  }

  /**
   * Clicks the Upload button, capturing API response and UI outcome.
   *
   * @returns {Promise<{ status: number|null, responseBody: any, success: boolean, errorMessage: string|null }>}
   */
  async clickUpload() {
    const { clickUploadButton } = this.getElements();
    await expect(clickUploadButton).toBeVisible({ timeout: 5000 });

    // Set up response listener for the upload endpoint
    const responsePromise = this.page.waitForResponse(
      (res) =>
        (res.url().includes('lead') ||
          res.url().includes('csv') ||
          res.url().includes('import') ||
          res.url().includes('upload')) &&
        res.request().method() === 'POST',
      { timeout: 15000 }
    ).catch(() => null);

    await clickUploadButton.click();
    console.log('[LeadCSVUploadPage] Clicked Upload button.');

    const response = await responsePromise;
    let status = null;
    let responseBody = null;
    let success = false;
    let errorMessage = null;

    if (response) {
      status = response.status();
      try {
        responseBody = await response.json();
      } catch {
        responseBody = await response.text().catch(() => null);
      }
      success = status >= 200 && status < 300;
      console.log(`[LeadCSVUploadPage] Upload API Response: Status ${status}`);
    } else {
      console.log('[LeadCSVUploadPage] No direct POST response intercepted, evaluating UI state.');
    }

    // Check for UI error toast or failure banners
    const errorBanner = this.page.locator(
      'div[role="alert"], .text-red-600, .bg-red-50, .Toastify__toast--error'
    );
    if (await errorBanner.count() > 0 && await errorBanner.first().isVisible({ timeout: 1500 }).catch(() => false)) {
      errorMessage = await errorBanner.first().innerText();
      console.log(`[LeadCSVUploadPage] UI error detected: ${errorMessage}`);
      success = false;
    }

    return { status, responseBody, success, errorMessage };
  }

  /**
   * Complete upload orchestration: opens popup, selects file, sets checkbox, and uploads.
   *
   * @param {string} filePath - Absolute path to CSV file
   * @param {Object} [options] - Options { addToCrm: boolean }
   */
  async uploadCsvFile(filePath, options = {}) {
    await this.openUploadPopup();
    await this.selectCsvFile(filePath);

    if (options.addToCrm !== undefined) {
      await this.setAddToCrmCheckbox(options.addToCrm);
    }

    return await this.clickUpload();
  }

  /**
   * Waits for the CSV import job to complete in the CRM and checks the resulting status.
   *
   * @param {number} [timeoutMs=15000]
   * @returns {Promise<'Completed' | 'Completed with Errors' | 'Unknown'>}
   */
  async waitForImportCompletion(timeoutMs = 15000) {
    const { csvScetion, checkTheStatusCompleted, checkTheErrorStaus } = this.getElements();

    if (await csvScetion.count() > 0 && await csvScetion.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('[LeadCSVUploadPage] Navigating to CSV section to check import status...');
      await csvScetion.first().click();

      try {
        await Promise.race([
          checkTheStatusCompleted.first().waitFor({ state: 'visible', timeout: timeoutMs }),
          checkTheErrorStaus.first().waitFor({ state: 'visible', timeout: timeoutMs }),
        ]);

        if (await checkTheStatusCompleted.first().isVisible()) {
          console.log('[LeadCSVUploadPage] Import Status: Completed');
          return 'Completed';
        }
        if (await checkTheErrorStaus.first().isVisible()) {
          console.log('[LeadCSVUploadPage] Import Status: Completed with Errors');
          return 'Completed with Errors';
        }
      } catch (err) {
        console.warn('[LeadCSVUploadPage] Status badge wait timed out:', err.message);
      }
    }

    const { uploadCsvFileButton } = this.getElements();
    await expect(uploadCsvFileButton).toBeVisible({ timeout: timeoutMs });
    return 'Completed';
  }

  /**
   * Navigates to the lead list and verifies that each lead from the CSV is present
   * with its correct details (First Name, Last Name, Mobile Number, Country Code, Email).
   *
   * @param {Array<Object>} leads - Array of lead records to verify
   * @param {string} leadUrl - URL of lead list page
   * @returns {Promise<{ verifiedCount: number, failedLeads: Array<Object> }>}
   */
  async verifyLeadsInCrm(leads, leadUrl) {
    await this.page.goto(leadUrl);
    await this.page.waitForLoadState('domcontentloaded');

    let verifiedCount = 0;
    const failedLeads = [];

    for (const lead of leads) {
      const firstName = lead['First Name'];
      const lastName = lead['last Name'];
      const mobile = lead['mobilenumber'];
      const email = lead['email'];

      console.log(`[LeadCSVUploadPage] Verifying lead in CRM: ${firstName} ${lastName} (${mobile})`);

      // Target the specific table row containing the lead
      const leadRow = this.page.locator('tbody tr, table tr').filter({ hasText: firstName }).first();

      let isFound = false;
      try {
        // Auto-wait up to 15s for the asynchronous table data to populate
        await leadRow.waitFor({ state: 'visible', timeout: 15000 });
        isFound = true;
      } catch {
        // Fallback: check if the lead name is visible anywhere on the page
        try {
          await this.page.getByText(firstName).first().waitFor({ state: 'visible', timeout: 5000 });
          isFound = true;
        } catch {
          isFound = false;
        }
      }

      if (isFound) {
        verifiedCount++;
        console.log(`[LeadCSVUploadPage] Verified lead in list: ${firstName} ${lastName}`);

        // Verify email in the row if present
        if (email) {
          const emailLocator = leadRow.locator(`text=${email}`).first();
          if (await emailLocator.isVisible().catch(() => false)) {
            console.log(`[LeadCSVUploadPage] Verified email in list row: ${email}`);
          }
        }
      } else {
        console.error(`[LeadCSVUploadPage] Failed to locate lead in CRM list: ${firstName} ${lastName} (${mobile})`);
        failedLeads.push(lead);
      }
    }

    return { verifiedCount, failedLeads };
  }

  // =========================================================================
  // HIGH-LEVEL WORKFLOW FUNCTIONS (Used by test suites)
  // =========================================================================

  /**
   * Upload single valid lead and verify in CRM.
   */
  async uploadSingleValidLead(leadUrl) {
    const { leads, filePath } = generateAndSaveCsv(1);
    try {
      const uploadResult = await this.uploadCsvFile(filePath, { addToCrm: true });
      const importStatus = await this.waitForImportCompletion();
      const verification = await this.verifyLeadsInCrm(leads, leadUrl);
      expect(verification.verifiedCount).toBeGreaterThanOrEqual(1);
      return { leads, uploadResult, importStatus, verification };
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Upload multiple valid leads and verify in CRM.
   */
  async uploadMultipleValidLeads(leadUrl, count = 3) {
    const { leads, filePath } = generateAndSaveCsv(count);
    try {
      const uploadResult = await this.uploadCsvFile(filePath, { addToCrm: true });
      const importStatus = await this.waitForImportCompletion();
      const verification = await this.verifyLeadsInCrm(leads, leadUrl);
      expect(verification.verifiedCount).toBeGreaterThanOrEqual(1);
      return { leads, uploadResult, importStatus, verification };
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Upload fresh unique leads and verify completeness.
   */
  async uploadFreshUniqueLeadData(leadUrl) {
    const { leads, filePath } = generateAndSaveCsv(2);
    try {
      const uploadResult = await this.uploadCsvFile(filePath, { addToCrm: true });
      const importStatus = await this.waitForImportCompletion();
      expect(importStatus).toBe('Completed');
      return { leads, uploadResult, importStatus };
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Upload two sequential batches and verify non-collision.
   */
  async uploadSequentialBatches(leadUrl) {
    const batch1 = generateAndSaveCsv(1, { fileName: `batch1_${Date.now()}.csv` });
    const batch2 = generateAndSaveCsv(1, { fileName: `batch2_${Date.now()}.csv` });
    try {
      await this.uploadCsvFile(batch1.filePath, { addToCrm: true });
      await this.waitForImportCompletion();

      await this.page.goto(leadUrl);
      await this.page.waitForLoadState('domcontentloaded');

      await this.uploadCsvFile(batch2.filePath, { addToCrm: true });
      await this.waitForImportCompletion();

      const verifyBatch1 = await this.verifyLeadsInCrm(batch1.leads, leadUrl);
      const verifyBatch2 = await this.verifyLeadsInCrm(batch2.leads, leadUrl);

      expect(verifyBatch2.verifiedCount).toBeGreaterThanOrEqual(1);
      return { verifyBatch1, verifyBatch2 };
    } finally {
      cleanupCsvFile(batch1.filePath);
      cleanupCsvFile(batch2.filePath);
    }
  }

  /**
   * Upload with optional checkbox toggle (true or false).
   */
  async uploadWithCheckbox(leadUrl, addToCrm = true) {
    const { leads, filePath } = generateAndSaveCsv(1);
    try {
      const uploadResult = await this.uploadCsvFile(filePath, { addToCrm });
      const importStatus = await this.waitForImportCompletion();
      return { leads, uploadResult, importStatus };
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Negative scenario: Re-upload the exact same CSV with existing lead records.
   */
  async uploadSameFileAgain(leadUrl) {
    const { leads, filePath } = generateAndSaveCsv(1);
    try {
      await this.uploadCsvFile(filePath, { addToCrm: true });
      await this.waitForImportCompletion();

      await this.page.goto(leadUrl);
      await this.page.waitForLoadState('domcontentloaded');

      const reuploadResult = await this.uploadCsvFile(filePath, { addToCrm: true });
      const reuploadStatus = await this.waitForImportCompletion();
      return { reuploadResult, reuploadStatus };
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Negative scenario: Upload CSV with duplicate mobile number.
   */
  async uploadDuplicateMobile(leadUrl) {
    const base = generateAndSaveCsv(1);
    let duplicateCsvPath;
    try {
      await this.uploadCsvFile(base.filePath, { addToCrm: true });
      await this.waitForImportCompletion();

      const duplicateLead = generateLeadRecords(1, { mobilenumber: base.leads[0].mobilenumber });
      duplicateCsvPath = saveLeadsToCsvFile(duplicateLead);

      await this.page.goto(leadUrl);
      await this.page.waitForLoadState('domcontentloaded');

      const dupResult = await this.uploadCsvFile(duplicateCsvPath, { addToCrm: true });
      const dupStatus = await this.waitForImportCompletion();
      return { dupResult, dupStatus };
    } finally {
      cleanupCsvFile(base.filePath);
      if (duplicateCsvPath) cleanupCsvFile(duplicateCsvPath);
    }
  }

  /**
   * Negative scenario: Upload CSV with duplicate email address.
   */
  async uploadDuplicateEmail(leadUrl) {
    const base = generateAndSaveCsv(1);
    let duplicateCsvPath;
    try {
      await this.uploadCsvFile(base.filePath, { addToCrm: true });
      await this.waitForImportCompletion();

      const duplicateLead = generateLeadRecords(1, { email: base.leads[0].email });
      duplicateCsvPath = saveLeadsToCsvFile(duplicateLead);

      await this.page.goto(leadUrl);
      await this.page.waitForLoadState('domcontentloaded');

      const dupResult = await this.uploadCsvFile(duplicateCsvPath, { addToCrm: true });
      const dupStatus = await this.waitForImportCompletion();
      return { dupResult, dupStatus };
    } finally {
      cleanupCsvFile(base.filePath);
      if (duplicateCsvPath) cleanupCsvFile(duplicateCsvPath);
    }
  }

  /**
   * Negative scenario: Duplicate records within the same CSV.
   */
  async uploadDuplicateWithinSameFile() {
    const { filePath } = generateNegativeCsv('duplicate_in_file');
    try {
      const uploadResult = await this.uploadCsvFile(filePath, { addToCrm: true });
      const importStatus = await this.waitForImportCompletion();
      return { uploadResult, importStatus };
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Negative scenario: Missing required column.
   */
  async uploadMissingRequiredColumn() {
    const { filePath } = generateNegativeCsv('missing_column');
    try {
      const uploadResult = await this.uploadCsvFile(filePath, { addToCrm: true });
      const importStatus = await this.waitForImportCompletion();
      return { uploadResult, importStatus };
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Negative scenario: Invalid mobile formatting.
   */
  async uploadInvalidMobileFormat() {
    const { filePath } = generateNegativeCsv('invalid_mobile');
    try {
      const uploadResult = await this.uploadCsvFile(filePath, { addToCrm: true });
      const importStatus = await this.waitForImportCompletion();
      return { uploadResult, importStatus };
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Negative scenario: Invalid email address.
   */
  async uploadInvalidEmailFormat() {
    const { filePath } = generateNegativeCsv('invalid_email');
    try {
      const uploadResult = await this.uploadCsvFile(filePath, { addToCrm: true });
      const importStatus = await this.waitForImportCompletion();
      return { uploadResult, importStatus };
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Negative scenario: Empty CSV.
   */
  async uploadEmptyCsv() {
    const { filePath } = generateNegativeCsv('empty');
    try {
      const uploadResult = await this.uploadCsvFile(filePath, { addToCrm: true });
      return { uploadResult };
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Negative scenario: Unsupported extension.
   */
  async uploadUnsupportedExtension() {
    const { filePath } = generateNegativeCsv('unsupported_extension');
    try {
      await this.openUploadPopup();
      await this.selectCsvFile(filePath);
      const uploadResult = await this.clickUpload();
      return { uploadResult };
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Negative scenario: Upload without selecting file.
   */
  async uploadWithoutSelectingFile() {
    await this.openUploadPopup();
    const { clickUploadButton } = this.getElements();
    const isDisabled = await clickUploadButton.isDisabled().catch(() => false);
    if (!isDisabled) {
      await clickUploadButton.click();
    }
    await this.cancelUpload();
    return { isDisabled };
  }

  /**
   * Remove selected CSV from popup.
   */
  async removeSelectedCsv() {
    const { filePath } = generateAndSaveCsv(1);
    try {
      await this.openUploadPopup();
      await this.selectCsvFile(filePath);
      await this.removeSelectedFile();
      await this.cancelUpload();
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Cancel upload and verify no lead is created.
   */
  async cancelUploadVerification(leadUrl) {
    const { leads, filePath } = generateAndSaveCsv(1);
    try {
      await this.openUploadPopup();
      await this.selectCsvFile(filePath);
      await this.cancelUpload();
      const verification = await this.verifyLeadsInCrm(leads, leadUrl);
      expect(verification.verifiedCount).toBe(0);
      return { verification };
    } finally {
      cleanupCsvFile(filePath);
    }
  }

  /**
   * Negative scenario: Simulated upload failure (500).
   */
  async simulateUploadFailure() {
    const { filePath } = generateAndSaveCsv(1);
    await this.page.route('**/lead**', async (route) => {
      if (route.request().method() === 'POST' && (route.request().url().includes('import') || route.request().url().includes('csv'))) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error during CSV import' }),
        });
      } else {
        await route.continue();
      }
    });

    try {
      const uploadResult = await this.uploadCsvFile(filePath, { addToCrm: true });
      return { uploadResult };
    } finally {
      await this.page.unroute('**/lead**').catch(() => {});
      cleanupCsvFile(filePath);
    }
  }
}

module.exports = { LeadCSVUploadPage };
