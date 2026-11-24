const { WebElement } = require("../../../utils/GuiWebElements");
const webElement = new WebElement();
const path = require("path");

const projectName = "Testing Project";
const status = "ongoing";
const description =
  "Test Builder Homes has a reputation for building quality new construction homes. Their satisfied homeowners give them an average rating of 4.4 stars for their beautiful floor plans and affordable upgrades, their skilled craftsmanship, and commitment to customer service on each house they build. You can read all of Test Builder Homes 132 homeowner reviews to learn why they are the right team to build your new home.";
const location = "coimbatore";
const bhk = "1.5";
const SEO_IMAGE = path.join(
  __dirname,
  "../../../resources/images/pexels3.jpg",
);

class addSEODetails {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  async navigateTOSeo() {
    const { seoButton } = webElement.pageElement(this.page);
    await seoButton.scrollIntoViewIfNeeded();
    await seoButton.click();
    await this.page
      .getByRole("heading", { name: "SEO Details" })
      .waitFor({ state: "visible", timeout: 10000 });
  }

  async _fillField(locator, value) {
    await locator.waitFor({ state: "visible", timeout: 8000 });
    await locator.click();
    await locator.evaluate((el, val) => {
      const proto =
        el.tagName.toLowerCase() === "textarea"
          ? window.HTMLTextAreaElement.prototype
          : window.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
      setter.call(el, val);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }, value);
  }

  async _uploadMetaImage() {
    const fileInput = this.page.locator("#modelImg");
    const uploadLabel = this.page
      .locator('label:has-text("Upload")')
      .last();

    if ((await fileInput.count()) > 0) {
      await fileInput.setInputFiles(SEO_IMAGE);
    } else {
      await uploadLabel.setInputFiles(SEO_IMAGE);
    }
    await this.page.waitForTimeout(500);
  }

  async addSeo() {
    const {
      seoEditButton,
      googleAnalytics,
      googleTagManager,
      metaTitle,
      ProjectSlug,
      metaKeywords,
      metaDescription,
      saveSeoButton,
    } = webElement.pageElement(this.page);

    await seoEditButton.waitFor({ state: "visible", timeout: 10000 });
    await this.expect(seoEditButton).toBeEnabled();
    await seoEditButton.click();

    await googleAnalytics.waitFor({ state: "visible", timeout: 8000 });
    await this._fillField(googleAnalytics, "UA-123456789-1");
    await this._fillField(googleTagManager, "GTM-ABCDEFG");

    const titleValue = `${projectName} ${status} ${location}`;
    await this._fillField(metaTitle, titleValue);

    const slugValue = `testing-project-${status}-${Date.now()}`;
    await this._fillField(ProjectSlug, slugValue);

    const keywordValue = `${projectName} ${status} ${location} ${bhk} ${description}`;
    await this._fillField(metaKeywords, keywordValue);
    await this._fillField(metaDescription, keywordValue);

    await this._uploadMetaImage();

    await saveSeoButton.click();
    await seoEditButton.waitFor({ state: "visible", timeout: 15000 });
    await this.page.waitForTimeout(300);
  }
}

module.exports = { addSEODetails };
