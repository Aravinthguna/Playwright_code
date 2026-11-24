const { WebElement } = require("../../../utils/WebElements");
const { expect } = require("@playwright/test");

const webelement = new WebElement();

class CallManagerPage {
  constructor(page) {
    this.page = page;
  }

  async processCallManagerSection() {
    const {
      callMAnager,
      todayList,
      missedcall,
      callHistory,
      csvScetion,
    } = webelement.pageElement(this.page);

    await callMAnager.waitFor({ state: "visible", timeout: 10000 });
    await callMAnager.click();
    await this.page.waitForTimeout(1000);

    await todayList.waitFor({ state: "visible", timeout: 10000 });
    await todayList.click();
    await this.page.waitForTimeout(1000);

    await missedcall.waitFor({ state: "visible", timeout: 10000 });
    await missedcall.click();
    await this.page.waitForTimeout(1000);

    await callHistory.waitFor({ state: "visible", timeout: 10000 });
    await callHistory.click();
    await this.page.waitForTimeout(1000);

    await missedcall.waitFor({ state: "visible", timeout: 10000 });
    await missedcall.click();
    await this.page.waitForTimeout(1000);

    await csvScetion.waitFor({ state: "visible", timeout: 10000 });
    await csvScetion.click();
    await this.page.waitForTimeout(1000);
  }
}

module.exports = { CallManagerPage };
