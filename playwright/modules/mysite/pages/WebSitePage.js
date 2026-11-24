const { WebElement } = require("../../../utils/WebElements");
const { test, expect } = require("@playwright/test");

const webElement = new WebElement();
export class WebSite {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
   async goto(url) {
    await this.page.goto(url);
  }
  async webSiteDetails() {
    const {
      dotSiteButton,
      publishManager,
      publishlog,
      projectSuccessfull,
      mySiteButton1,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);
    if (await publishManager.isVisible()) {
      await publishManager.click();
    }
    if (await publishlog.isVisible()) {
      await publishlog.click();
    }
    // await projectSuccessfull.click();
  }
  async gtm() {
    const {
      GTMTagButton,
      GTMTagEditButton,
      leadConversion,
      GTMTextBox,
      GTMToggleButton,
      GTMSaveButton,
      GTMGoBackButton,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);
    await GTMTagButton.click();
    await GTMTagEditButton.click();
    await leadConversion.click()
    await GTMTextBox.fill("EFGH1324");
    await expect(GTMTextBox).toHaveValue("EFGH1324");
    await GTMToggleButton.click();
    await GTMSaveButton.click();
    await GTMGoBackButton.click()
  }
}

module.exports = { WebSite };
