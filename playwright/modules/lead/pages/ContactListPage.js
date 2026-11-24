const { WebElement } = require("../../../utils/WebElements");
const { expect } = require("@playwright/test");

const webelement = new WebElement();

class ContactListPage {
  constructor(page) {
    this.page = page;
  }

  async processContactList() {
    const { contactList, contactListScroll } = webelement.pageElement(this.page);

    await contactList.waitFor({ state: "visible", timeout: 10000 });
    await contactList.click();
    await this.page.waitForTimeout(1000);

    const isContactListVisible = await contactListScroll.isVisible().catch(() => false);

    if (isContactListVisible) {
      await this.page.evaluate(() => {
        const tbody = document.querySelector("tbody.divide-y.divide-slate-100") || document.querySelector("tbody");
        const container = tbody?.closest(".overflow-y-auto") || tbody?.parentElement?.parentElement || document.documentElement;
        container.scrollTop = container.scrollHeight;
      });
      await this.page.waitForTimeout(1000);

      await this.page.evaluate(() => {
        const tbody = document.querySelector("tbody.divide-y.divide-slate-100") || document.querySelector("tbody");
        const container = tbody?.closest(".overflow-y-auto") || tbody?.parentElement?.parentElement || document.documentElement;
        container.scrollTop = 0;
      });
      await this.page.waitForTimeout(1000);
    }
  }
}

module.exports = { ContactListPage };
