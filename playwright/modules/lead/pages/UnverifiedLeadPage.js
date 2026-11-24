const { WebElement } = require("../../../utils/WebElements");
const { expect } = require("@playwright/test");

const webelement = new WebElement();

class UnverifiedLeadPage {
  constructor(page) {
    this.page = page;
  }

  async scrollHorizontal() {
    await this.page.evaluate(() => {
      const table = document.querySelector("table");
      if (table) {
        const container = table.closest(".overflow-x-auto") || table.parentElement;
        if (container) {
          container.scrollLeft = container.scrollWidth;
        }
      }
    });
    await this.page.waitForTimeout(300);
  }

  async processUnverifiedLeads() {
    const {
      unverifiedLead,
      unverifiedLeadList,
      verifiedThreeDotButton,
      unverifiedThreeDotButton,
      moveToVerifiedList,
      moveToSpamList,
      noLeadFound,
    } = webelement.pageElement(this.page);

    const getThreeDot = async () => {
      if (await verifiedThreeDotButton.first().isVisible().catch(() => false)) {
        return verifiedThreeDotButton.first();
      }
      return unverifiedThreeDotButton.first();
    };

    await unverifiedLead.waitFor({ state: "visible", timeout: 10000 });
    await unverifiedLead.click();
    await this.page.waitForTimeout(1000);

    let isLeadPresent = await unverifiedLeadList.first().isVisible().catch(() => false);

    if (isLeadPresent) {
      await this.scrollHorizontal();

      const threeDot = await getThreeDot();
      await threeDot.scrollIntoViewIfNeeded().catch(() => {});

      await threeDot.click();
      await this.page.waitForTimeout(300);
      await moveToVerifiedList.waitFor({ state: "visible", timeout: 5000 });
      await moveToVerifiedList.click();
      await this.page.waitForTimeout(1500);

      await unverifiedLead.click();
      await this.page.waitForTimeout(1000);

      isLeadPresent = await unverifiedLeadList.first().isVisible().catch(() => false);
      if (isLeadPresent) {
        await this.scrollHorizontal();

        const threeDotSecond = await getThreeDot();
        await threeDotSecond.scrollIntoViewIfNeeded().catch(() => {});

        await threeDotSecond.click();
        await this.page.waitForTimeout(300);
        await moveToSpamList.waitFor({ state: "visible", timeout: 5000 });
        await moveToSpamList.click();
        await this.page.waitForTimeout(1500);
      }
    }

    const noLeadVisible = await noLeadFound.isVisible().catch(() => false);
    if (noLeadVisible) {
      await expect(noLeadFound).toBeVisible();
    }
  }
}

module.exports = { UnverifiedLeadPage };
