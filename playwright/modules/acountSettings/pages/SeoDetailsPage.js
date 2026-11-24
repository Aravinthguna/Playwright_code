const path = require("path");
const { WebElement } = require("../../../utils/WebElements");
const webElement = new WebElement();

class SeoDetailsPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  async goto(url) {
    await this.page.goto(url);
  }

  /**
   * Complete SEO Details scenario:
   * 1. Open Account Settings
   * 2. Click SEO Details
   * 3. Click Edit
   * 4. Enter Meta Title text
   * 5. Enter Meta Keyword text
   * 6. Enter Meta Description text
   * 7. Upload a Meta Image
   * 8. Click Save
   * 9. Verify the save operation is successful
   */
  async seoDetails() {
    const {
      seoDeatilsButton,
      seoDetailsEditButton,
      metaTitle,
      metaKeyword,
      metaDescription,
      metaImageUpload,
      deleteMetaImage,
      deleteButton,
      seoDetailsSaveButton,
    } = webElement.pageElement(this.page);

    // 1 & 2. Open Account Settings and Click SEO Details tab
    await seoDeatilsButton.waitFor({ state: "visible", timeout: 30000 });
    await seoDeatilsButton.click();

    // 3. Click Edit
    await seoDetailsEditButton.waitFor({ state: "visible", timeout: 30000 });
    await seoDetailsEditButton.click();
    await this.expect(seoDetailsSaveButton).toBeVisible();

    // 4. Enter Meta Title text
    const titleText = `Real Estate Innovations ${Math.floor(100 + Math.random() * 900)}`;
    await metaTitle.fill(titleText);
    await this.expect(metaTitle).toHaveValue(titleText);

    // 5. Enter Meta Keyword text
    const keywordText = `Apartments, Luxury Homes, Real Estate, Properties ${Date.now()}`;
    await metaKeyword.fill(keywordText);
    await this.expect(metaKeyword).toHaveValue(keywordText);

    // 6. Enter Meta Description text
    const descText = `Explore premium modern apartments and properties with world-class amenities ${Date.now()}`;
    await metaDescription.fill(descText);
    await this.expect(metaDescription).toHaveValue(descText);

    // 7. Upload a Meta Image
    const metaImagePath = path.resolve(
      __dirname,
      "../../../resources/images/pexels3.jpg"
    );

    const existingImage = this.page
      .locator('span:has-text("Meta Image")')
      .locator("..")
      .locator("img")
      .first();

    if (await existingImage.isVisible().catch(() => false)) {
      await existingImage.hover();
      if (await deleteMetaImage.isVisible().catch(() => false)) {
        await deleteMetaImage.click({ force: true });
        await deleteButton.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
        if (await deleteButton.isVisible().catch(() => false)) {
          await deleteButton.click();
          await deleteButton.waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
        }
      }
    }

    if (await metaImageUpload.isVisible().catch(() => false)) {
      await metaImageUpload.setInputFiles(metaImagePath);
    } else {
      const fileInput = this.page.locator("#modelImg, input[type='file']").first();
      if ((await fileInput.count()) > 0) {
        await fileInput.setInputFiles(metaImagePath);
      }
    }

    // Wait for any image processing to finish before saving
    await this.page
      .locator('text="Processing image..."')
      .waitFor({ state: "hidden", timeout: 15000 })
      .catch(() => {});
    await this.page.waitForTimeout(1000);

    // 8. Click Save
    await seoDetailsSaveButton.click();

    // 9. Verify the save operation is successful
    await seoDetailsEditButton.waitFor({ state: "visible", timeout: 30000 });
    await this.expect(seoDetailsEditButton).toBeVisible();
  }
}

module.exports = { SeoDetailsPage };
