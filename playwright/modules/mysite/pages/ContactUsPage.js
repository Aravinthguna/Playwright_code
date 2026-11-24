const { WebElement } = require("../../../utils/WebElements");
const { test, expect } = require("@playwright/test");
const exp = require("constants");

const webElement = new WebElement();
class ContactUS {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
  async goto(url) {
    await this.page.goto(url);
  }

  async contactUs() {
    const {
      pageButton,
      contactUsButton,
      contactBanner,
      conatctEditButton,
      conatctTitle,
      contactSubTitle,
      contactDescription,
      contactImageUploadButton,
      imageUpload,
      contactPreview,
      contactpreviewBackButton,
      contactSaveButton,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(1000);
    if (!(await contactUsButton.isVisible())) {
      await pageButton.click();
      try {
        await contactUsButton.waitFor({ state: "visible", timeout: 3000 });
      } catch (e) {
        await pageButton.click();
        await contactUsButton.waitFor({ state: "visible", timeout: 10000 });
      }
    }
    await contactUsButton.click();
    await contactBanner.click();
    await conatctEditButton.click();
    await this.page.waitForTimeout(1000);
    await conatctTitle.fill("Testing Process");
    await expect(conatctTitle).toHaveValue("Testing Process");
    await contactSubTitle.fill("Validate Testing");
    await expect(contactSubTitle).toHaveValue("Validate Testing");
    await contactDescription.fill(
      "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was."
    );
    await expect(contactDescription).toHaveValue(
      "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was."
    );
    await contactImageUploadButton.click();
    const randomImage = Math.floor(Math.random() * 10) + 1;
    await imageUpload.setInputFiles(`playwright/resources/images/pexels${randomImage}.jpg`);
    await contactPreview.click();
    await contactpreviewBackButton.click();
    await contactSaveButton.click();
  }
  async contentSecion() {
    const {
      contentsection,
      contentEditButton,
      contentToggleButton,
      contentTitle,
      contentSubTitle,
      contentDescription,
      contentimageUploadButton,
      contentImageUpload,
      contentBacroundImage,
      backroundImageUploadButton,
      callToAction,
      ButtonTextBox,
      contentPreview,
      contentpreviewBackButton,
      contentSaveButton,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(1000);
    await contentsection.click();
    await contentEditButton.click();
    await this.page.waitForTimeout(1000);
    await contentToggleButton.click();
    await contentTitle.fill("Testing Process");
    await expect(contentTitle).toHaveValue("Testing Process");
    await contentSubTitle.fill("Validate Testing");
    await expect(contentSubTitle).toHaveValue("Validate Testing");
    await contentDescription.fill(
      "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was."
    );
    await expect(contentDescription).toHaveValue(
      "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was."
    );
    await contentimageUploadButton.click();
    const randomImage = Math.floor(Math.random() * 10) + 1;
    await contentImageUpload.setInputFiles(`playwright/resources/images/pexels${randomImage}.jpg`);
    await contentBacroundImage.click();
    const randomImages = Math.floor(Math.random() * 10) + 1;
    await backroundImageUploadButton.setInputFiles(
      `playwright/resources/images/pexels${randomImages}.jpg`
    );
    await callToAction.fill("https://www.google.com");
    await expect(callToAction).toHaveValue("https://www.google.com");

    await ButtonTextBox.fill("Properties");
    await expect(ButtonTextBox).toHaveValue("Properties");
    await contentPreview.click();
    await contentpreviewBackButton.click();
    await contentSaveButton.click();
  }
  async overAllPublish(status) {
    if (status) {
      const { overAllPublishButton } = webElement.pageElement(this.page);
      await overAllPublishButton.click();
    }
  }
}
module.exports = { ContactUS };
