const path = require("path");
const { WebElement } = require("../../../utils/WebElements");
const webElement = new WebElement();
const {
  generateRandomCin,
  generateRandomGst,
  generateRandomPan,
} = require("../../../utils/RandomDataUtils");

class KycDetailsPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  async goto(url) {
    await this.page.goto(url);
  }

  /**
   * Complete KYC Details scenario:
   * 1. Open Account Settings
   * 2. Click KYC Details
   * 3. Click Edit
   * 4. Enter a random CIN number & upload CIN PDF
   * 5. Enter a random GST number & upload GST PDF
   * 6. Enter a random PAN number & upload PAN PDF
   * 7. Click Save
   * 8. Verify the save operation is successful
   */
  async kycDetails() {
    const {
      kycDetails,
      kycDetailsEditButton,
      cinNumberTextBox,
      gstNumberTextBox,
      panNumberTextBox,
      cinNumberUploadbutton,
      gstNumberUploadbutton,
      panNumberUploadbutton,
      kycDetailsSaveButton,
    } = webElement.pageElement(this.page);

    // 1 & 2. Open Account Settings and Click KYC Details tab
    await kycDetails.waitFor({ state: "visible", timeout: 30000 });
    await kycDetails.click();

    // 3. Click Edit
    await kycDetailsEditButton.waitFor({ state: "visible", timeout: 30000 });
    await kycDetailsEditButton.click();
    await this.expect(kycDetailsSaveButton).toBeVisible();

    // Resource PDF paths
    const cinPdfPath = path.resolve(__dirname, "../../../resources/pdf/CIN NUMBER.pdf");
    const gstPdfPath = path.resolve(__dirname, "../../../resources/pdf/GST NUMBER.pdf");
    const panPdfPath = path.resolve(__dirname, "../../../resources/pdf/PAN NUMBER.pdf");

    // 4. Enter a random CIN number & upload CIN PDF
    const randomCin = generateRandomCin();
    await cinNumberTextBox.fill(randomCin);
    await this.expect(cinNumberTextBox).toHaveValue(randomCin);
    await cinNumberUploadbutton.setInputFiles(cinPdfPath);

    // 5. Enter a random GST number & upload GST PDF
    const randomPan = generateRandomPan();
    const randomGst = generateRandomGst(randomPan);
    await gstNumberTextBox.fill(randomGst);
    await this.expect(gstNumberTextBox).toHaveValue(randomGst);
    await gstNumberUploadbutton.setInputFiles(gstPdfPath);

    // 6. Enter a random PAN number & upload PAN PDF
    await panNumberTextBox.fill(randomPan);
    await this.expect(panNumberTextBox).toHaveValue(randomPan);
    await panNumberUploadbutton.setInputFiles(panPdfPath);

    // 7. Click Save and verify successful update
    await kycDetailsSaveButton.click();
    await kycDetailsEditButton.waitFor({ state: "visible", timeout: 30000 });
    await this.expect(kycDetailsEditButton).toBeVisible();
  }
}

module.exports = { KycDetailsPage };
