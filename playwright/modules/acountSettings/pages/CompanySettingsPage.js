const { WebElement } = require("../../../utils/WebElements");
const webElement = new WebElement();
const {
  generateRandomName,
  generateRandomEmail,
  generateRandomMobile,
} = require("../../../utils/RandomDataUtils");

class CompanySettingsPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async companySettings() {
    const {
      companyDetailsEditButton,
      companyName,
      companyType,
      wesiteNameDropdown,
      webSiteNameTextBox,
      companyAddressTextBox,
      selectCompanyAddress,
      adressLineOne,
      adressLineTwo,
      adressLineThree,
      CountryTextBox,
      stateTextBox,
      cityTextBox,
      pincodeTextBox,
      secondaryContactNumber,
      secondaryEmail,
      comapnyDetailsSaveButton,
    } = webElement.pageElement(this.page);

    await companyDetailsEditButton.waitFor({ state: "visible", timeout: 30000 });
    await this.expect(
      this.page.locator('p:visible:has-text("Company Details")').first()
    ).toBeVisible();

    await companyDetailsEditButton.click();
    await this.expect(comapnyDetailsSaveButton).toBeVisible();

    const randomCompanyName = `${generateRandomName(6)} ${Math.floor(
      100 + Math.random() * 900
    )}`;
    await companyName.fill(randomCompanyName);

    await companyType.selectOption({ index: 1 }).catch(async () => {
      await companyType.selectOption({ label: "Public Limited Company" });
    });

    const randomWebsite = `www.${generateRandomName(5).toLowerCase()}${Math.floor(
      100 + Math.random() * 900
    )}.com`;
    if (await wesiteNameDropdown.isVisible().catch(() => false)) {
      await wesiteNameDropdown.selectOption("https://").catch(() => {});
    }
    await webSiteNameTextBox.fill(randomWebsite);

    await companyAddressTextBox.fill("Indiranagar");
    const firstOption = selectCompanyAddress.first();
    await firstOption.waitFor({ state: "visible", timeout: 10000 });
    await firstOption.click();
    await this.page.waitForTimeout(1500);

    const addressFields = [
      { loc: adressLineOne, val: "Indiranagar" },
      { loc: adressLineTwo, val: "Indiranagar" },
      { loc: adressLineThree, val: "Near Metro" },
      { loc: CountryTextBox, val: "India" },
      { loc: stateTextBox, val: "Karnataka" },
      { loc: cityTextBox, val: "Bengaluru" },
      { loc: pincodeTextBox, val: "560038" },
    ];
    for (const f of addressFields) {
      const val = await f.loc.inputValue();
      const isEnabled = await f.loc.isEnabled();
      if (isEnabled && (!val || val.trim() === "")) {
        await f.loc.fill(f.val);
      }
    }

    const randomMobile = generateRandomMobile();
    await secondaryContactNumber.fill(randomMobile);

    const randomEmail = generateRandomEmail();
    await secondaryEmail.fill(randomEmail);

    await comapnyDetailsSaveButton.click();
   
  }
}

module.exports = { CompanySettingsPage };
