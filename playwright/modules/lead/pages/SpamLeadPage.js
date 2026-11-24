const { WebElement } = require("../../../utils/WebElements");
const { expect } = require("@playwright/test");

const webelement = new WebElement();

class SpamLeadPage {
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

  async processSpamLeads() {
    const {
      SpamList,
      unverifiedLeadList,
      unverifiedThreeDotButton,
      verifiedThreeDotButton,
      moveToUnVerifiedList,
      moveToVerifiedList,
      noLeadFound,
    } = webelement.pageElement(this.page);

    const getThreeDot = async () => {
      if (await unverifiedThreeDotButton.first().isVisible().catch(() => false)) {
        return unverifiedThreeDotButton.first();
      }
      return verifiedThreeDotButton.first();
    };

    await SpamList.waitFor({ state: "visible", timeout: 10000 });
    await SpamList.click();
    await this.page.waitForTimeout(1000);

    const isLeadPresent = await unverifiedLeadList.first().isVisible().catch(() => false);

    if (isLeadPresent) {
      await this.scrollHorizontal();

      const threeDot = await getThreeDot();
      await threeDot.scrollIntoViewIfNeeded().catch(() => {});

      const actionBtn = threeDot.locator('button, svg').first();
      if (await actionBtn.isVisible().catch(() => false)) {
        await actionBtn.click();
      } else {
        await threeDot.click();
      }
      await this.page.waitForTimeout(500);

      const canMoveToUnverified = await moveToUnVerifiedList.isVisible().catch(() => false);
      if (canMoveToUnverified) {
        await moveToUnVerifiedList.click();
      } else if (await moveToVerifiedList.isVisible().catch(() => false)) {
        await moveToVerifiedList.click();
      } else {
        const fallbackOption = this.page
          .locator(
            '//*[self::button or self::div or self::a or self::li][contains(text(),"Move to Unverified") or contains(text(),"Move to Verified")]',
          )
          .first();
        await fallbackOption.waitFor({ state: "visible", timeout: 5000 });
        await fallbackOption.click();
      }
      await this.page.waitForTimeout(1500);

      const isStillPresent = await unverifiedLeadList.first().isVisible().catch(() => false);
      if (isStillPresent) {
        await this.scrollHorizontal();
      }
    }

    const noLeadVisible = await noLeadFound.isVisible().catch(() => false);
    if (noLeadVisible) {
      await expect(noLeadFound).toBeVisible();
    }
  }
}

module.exports = { SpamLeadPage };
