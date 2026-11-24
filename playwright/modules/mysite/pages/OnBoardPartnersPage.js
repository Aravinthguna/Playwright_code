const { WebElement } = require("../../../utils/WebElements");
const { expect } = require("@playwright/test");
const webElement = new WebElement();
 class OnBoardPartners {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
 async goto(url) {
    await this.page.goto(url);
  }
  async onBoardPartners() {
    const {
     pageButton,
      onBoardPartnerButton,
      editOnBoardPartner,
      onBoardPartnerToggleButton,
      buttonLabelName,
      partnerTypeBroker,
      partnerTypeBuilder,
      partnerTittle,
      partnerMessage,
      previewOnBoardPartne,
      previewOnBoardPartneBackButton,
      saveOnBoardPartne,
      overAllPublishButton,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(1000);
    if (!(await onBoardPartnerButton.isVisible())) {
      await pageButton.click();
      try {
        await onBoardPartnerButton.waitFor({ state: "visible", timeout: 3000 });
      } catch (e) {
        await pageButton.click();
        await onBoardPartnerButton.waitFor({ state: "visible", timeout: 10000 });
      }
    }
    await onBoardPartnerButton.click();
    await editOnBoardPartner.click();
    await onBoardPartnerToggleButton.click();
    await buttonLabelName.fill("The quick, brown fox");
  //  await partnerTypeBroker.first().click();
    await partnerTittle.fill(
      "The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. "
    );
    await expect(partnerTittle).toHaveValue("The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. ");
    await partnerMessage.fill(
      "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. "
    );
    await expect(partnerMessage).toHaveValue("A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. ");
    await previewOnBoardPartne.click();
    await previewOnBoardPartneBackButton.click();
    await saveOnBoardPartne.click();
  }
  
}
module.exports = { OnBoardPartners };
