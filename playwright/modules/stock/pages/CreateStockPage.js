const { WebElement } = require("../../../utils/GuiWebElements");
const webElement = new WebElement();

const projectName = "Test";
const reraId = "Rera";
const location = "Rs puram";
const bhk = "2.5";
const facing = "WEST";
const sqft = "1999";
const projectWebsiteHeading="Wesite Apart"
 const projectPageTitle="Page"

class createStock {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
  async waitForStockPageReady() {
    const tryAgainButton = this.page.getByRole('button', { name: 'Try Again' });
    const refreshButton = this.page.getByRole('button', { name: 'Refresh Page' });

    for (let attempt = 1; attempt <= 3; attempt++) {
      if (await tryAgainButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`⚠️  Stock error boundary detected — clicking Try Again (attempt ${attempt})`);
        await tryAgainButton.click();
        await this.page.waitForTimeout(2000);
        continue;
      }
      if (await refreshButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`⚠️  Stock error boundary detected — reloading page (attempt ${attempt})`);
        await this.page.reload({ waitUntil: 'networkidle' });
        await this.page.waitForTimeout(2000);
        continue;
      }
      break; // Page loaded OK
    }
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: 'networkidle' });

    // Guard: detect unexpected redirects (e.g. auth failure → realiti.io)
    const currentUrl = this.page.url();
    const knownDomains = ['devin.realiti.tech', 'stageapp.realitiindia.com', 'app.realiti.io'];
    const isOnExpectedDomain = knownDomains.some(domain => currentUrl.includes(domain));
    if (!isOnExpectedDomain) {
      throw new Error(
        `❌ Navigation redirected to unexpected URL: ${currentUrl}\n` +
        `Expected to stay on: ${url}\n` +
        `Possible causes: session cookie not sent (HTTP vs HTTPS), expired session, or server-side auth redirect.`
      );
    }

    // Handle "Stock failed to load" error boundary
    await this.waitForStockPageReady();
  }
  async createApartment() {
    const {
      addStockButton,
      stockSaleRadioButton,
      stockTypeRadioButton,
      projectNameTextbox,
      reraIdTextbox,
      WebSiteHeading,
      PageTitleheading,
      stockLocationTextbox,
      stockLocationDropdown,
      stockSubmitButton,
    } = webElement.pageElement(this.page);

    await addStockButton.click();
    await stockSaleRadioButton.nth(0).click();
    await this.expect(stockSaleRadioButton.first()).toBeChecked();
    await stockTypeRadioButton.nth(0).click();
    await this.expect(stockTypeRadioButton.nth(0)).toBeFocused();
    await projectNameTextbox.fill(`${projectName} Primary Apartment`);
    await this.expect(projectNameTextbox).toHaveValue(
      `${projectName} Primary Apartment`
    );
    await reraIdTextbox.fill(reraId);
    await this.expect(reraIdTextbox).toHaveValue(reraId);
    await stockLocationTextbox.fill(location);
    await this.expect(stockLocationTextbox).toHaveValue(location);
    await this.page.waitForTimeout(1000);
    await stockLocationDropdown.nth(0).click();
    await this.page.waitForTimeout(500);
    await stockSubmitButton.nth(1).click();
    await this.page.waitForTimeout(500);
  }
  async createVilla() {
    const {
      addStockButton,
      stockSaleRadioButton,
      stockTypeRadioButton,
      projectNameTextbox,
      reraIdTextbox,
      stockLocationTextbox,
      stockLocationDropdown,
      stockSubmitButton,
    } = webElement.pageElement(this.page);
    await addStockButton.click();
    await stockSaleRadioButton.nth(0).click();
    await this.expect(stockSaleRadioButton.nth(0)).toBeChecked();
    await stockTypeRadioButton.nth(1).click();
    await this.expect(stockTypeRadioButton.nth(1)).toBeFocused();
    await projectNameTextbox.fill(`${projectName} Primary Villa`);
    await this.expect(projectNameTextbox).toHaveValue(
      `${projectName} Primary Villa`
    );
    await reraIdTextbox.fill(reraId);
    await this.expect(reraIdTextbox).toHaveValue(reraId);
    await stockLocationTextbox.fill(location);
    await this.expect(stockLocationTextbox).toHaveValue(location);
    await this.page.waitForTimeout(1000);
    await stockLocationDropdown.nth(0).click();
    await this.page.waitForTimeout(500);
    await stockSubmitButton.nth(1).click();
    await this.page.waitForTimeout(500);
  }
  async createRowhouse() {
    const {
      addStockButton,
      stockSaleRadioButton,
      stockTypeRadioButton,
      projectNameTextbox,
      reraIdTextbox,
      stockLocationTextbox,
      stockLocationDropdown,
      stockSubmitButton,
    } = webElement.pageElement(this.page);
    await addStockButton.click();
    await stockSaleRadioButton.nth(0).click();
    await this.expect(stockSaleRadioButton.nth(0)).toBeChecked();
    await stockTypeRadioButton.nth(2).click();
    await this.expect(stockTypeRadioButton.nth(2)).toBeFocused();
    await projectNameTextbox.fill(`${projectName} Primary Rowhouse`);
    await this.expect(projectNameTextbox).toHaveValue(
      `${projectName} Primary Rowhouse`
    );
    await reraIdTextbox.fill(reraId);
    await this.expect(reraIdTextbox).toHaveValue(reraId);
    await stockLocationTextbox.fill(location);
    await this.expect(stockLocationTextbox).toHaveValue(location);
    await this.page.waitForTimeout(1000);
    await stockLocationDropdown.nth(0).click();
    await this.page.waitForTimeout(500);
    await stockSubmitButton.nth(1).click();
    await this.page.waitForTimeout(500);
  }
  async createPlot() {
    const {
      addStockButton,
      stockSaleRadioButton,
      stockTypeRadioButton,
      projectNameTextbox,
      reraIdTextbox,
      stockLocationTextbox,
      stockLocationDropdown,
      stockSubmitButton,
    } = webElement.pageElement(this.page);
    await addStockButton.click();
    await stockSaleRadioButton.nth(0).click();
    await this.expect(stockSaleRadioButton.nth(0)).toBeChecked();
    await stockTypeRadioButton.nth(3).click();
    await this.expect(stockTypeRadioButton.nth(3)).toBeFocused();
    await projectNameTextbox.fill(`${projectName} Primary Plot`);
    await this.expect(projectNameTextbox).toHaveValue(
      `${projectName} Primary Plot`
    );
    await reraIdTextbox.fill(reraId);
    await this.expect(reraIdTextbox).toHaveValue(reraId);
    await stockLocationTextbox.fill(location);
    await this.expect(stockLocationTextbox).toHaveValue(location);
    await this.page.waitForTimeout(1000);
    await stockLocationDropdown.nth(0).click();
    await this.page.waitForTimeout(500);
    await stockSubmitButton.nth(1).click();
    await this.page.waitForTimeout(500);
  }
  async createSecondaryResaleFlat() {
    const {
      addStockButton,
      stockSaleRadioButton,
      stockTypeRadioButton,
      stockLocationTextbox,
      stockLocationDropdown,
      stockSubmitButton,
      projectLinkButton,
      forRentOrResaleRadioButton,
      stockSqftTextbox,
      stockBhkDropdown,
      stockFacingDropdown,
    } = webElement.pageElement(this.page);
    await addStockButton.click();
    await stockSaleRadioButton.nth(1).click();
    await this.expect(stockSaleRadioButton.nth(1)).toBeChecked();
    await stockTypeRadioButton.nth(0).click();
    await this.expect(stockTypeRadioButton.nth(0)).toBeFocused();
    await forRentOrResaleRadioButton.nth(0).click();
    await this.expect(forRentOrResaleRadioButton.nth(0)).toBeFocused();
    await stockSqftTextbox.fill(sqft);
    await this.expect(stockSqftTextbox).toHaveValue(sqft);
    await stockBhkDropdown.selectOption(bhk);
    await this.expect(stockBhkDropdown).toHaveValue(bhk);
    await stockFacingDropdown.selectOption(facing);
    await this.expect(stockFacingDropdown).toHaveValue(facing);
    await stockLocationTextbox.fill(location);
    await this.expect(stockLocationTextbox).toHaveValue(location);
    await this.page.waitForTimeout(1000);
    await stockLocationDropdown.nth(0).click();
    await this.page.waitForTimeout(500);
    await stockSubmitButton.nth(1).click();
    await this.page.waitForTimeout(500);
    await projectLinkButton.click();
  }
  async createSecondaryResaleHouse() {
    const {
      addStockButton,
      stockSaleRadioButton,
      stockTypeRadioButton,
      stockLocationTextbox,
      stockLocationDropdown,
      stockSubmitButton,
      projectLinkButton,
      forRentOrResaleRadioButton,
      stockSqftTextbox,
      stockBhkDropdown,
      stockFacingDropdown,
    } = webElement.pageElement(this.page);
    await addStockButton.click();
    await stockSaleRadioButton.nth(1).click();
    await this.expect(stockSaleRadioButton.nth(1)).toBeChecked();
    await stockTypeRadioButton.nth(1).click();
    await this.expect(stockTypeRadioButton.nth(1)).toBeFocused();
    await forRentOrResaleRadioButton.nth(0).click();
    await this.expect(forRentOrResaleRadioButton.nth(0)).toBeFocused();
    await stockSqftTextbox.fill(sqft);
    await this.expect(stockSqftTextbox).toHaveValue(sqft);
    await stockBhkDropdown.selectOption(bhk);
    await this.expect(stockBhkDropdown).toHaveValue(bhk);
    await stockFacingDropdown.selectOption(facing);
    await this.expect(stockFacingDropdown).toHaveValue(facing);
    await stockLocationTextbox.fill(location);
    await this.expect(stockLocationTextbox).toHaveValue(location);
    await this.page.waitForTimeout(1000);
    await stockLocationDropdown.nth(0).click();
    await this.page.waitForTimeout(500);
    await stockSubmitButton.nth(1).click();
    await this.page.waitForTimeout(500);
    await projectLinkButton.click();
  }
  async createSecondaryResalePlot() {
    const {
      addStockButton,
      stockSaleRadioButton,
      stockTypeRadioButton,
      stockLocationTextbox,
      stockLocationDropdown,
      stockSubmitButton,
      projectLinkButton,
      forRentOrResaleRadioButton,
      stockSqftTextbox,
      stockFacingDropdown,
    } = webElement.pageElement(this.page);
    await addStockButton.click();
    await stockSaleRadioButton.nth(1).click();
    await this.expect(stockSaleRadioButton.nth(1)).toBeChecked();
    await stockTypeRadioButton.nth(2).click();
    await this.expect(stockTypeRadioButton.nth(2)).toBeFocused();
    await forRentOrResaleRadioButton.nth(0).click();
    await this.expect(forRentOrResaleRadioButton.nth(0)).toBeFocused();
    await stockSqftTextbox.fill(sqft);
    await this.expect(stockSqftTextbox).toHaveValue(sqft);
    await stockFacingDropdown.selectOption(facing);
    await this.expect(stockFacingDropdown).toHaveValue(facing);
    await stockLocationTextbox.fill(location);
    await this.expect(stockLocationTextbox).toHaveValue(location);
    await this.page.waitForTimeout(1000);
    await stockLocationDropdown.nth(0).click();
    await this.page.waitForTimeout(500);
    await stockSubmitButton.nth(1).click();
    await this.page.waitForTimeout(500);
    await projectLinkButton.click();
  }
  async createSecondaryRentFlat() {
    const {
      addStockButton,
      stockSaleRadioButton,
      stockTypeRadioButton,
      stockLocationTextbox,
      stockLocationDropdown,
      stockSubmitButton,
      projectLinkButton,
      forRentOrResaleRadioButton,
      stockSqftTextbox,
      stockBhkDropdown,
      stockFacingDropdown,
    } = webElement.pageElement(this.page);
    await addStockButton.click();
    await stockSaleRadioButton.nth(1).click();
    await this.expect(stockSaleRadioButton.nth(1)).toBeChecked();
    await stockTypeRadioButton.nth(0).click();
    await this.expect(stockTypeRadioButton.nth(0)).toBeFocused();
    await forRentOrResaleRadioButton.nth(1).click();
    await this.expect(forRentOrResaleRadioButton.nth(1)).toBeFocused();
    await stockSqftTextbox.fill(sqft);
    await this.expect(stockSqftTextbox).toHaveValue(sqft);
    await stockBhkDropdown.selectOption(bhk);
    await this.expect(stockBhkDropdown).toHaveValue(bhk);
    await stockFacingDropdown.selectOption(facing);
    await this.expect(stockFacingDropdown).toHaveValue(facing);
    await stockLocationTextbox.fill(location);
    await this.expect(stockLocationTextbox).toHaveValue(location);
    await this.page.waitForTimeout(1000);
    await stockLocationDropdown.nth(0).click();
    await this.page.waitForTimeout(500);
    await stockSubmitButton.nth(1).click();
    await this.page.waitForTimeout(500);
    await projectLinkButton.click();
  }
  async createSecondaryRentHouse() {
    const {
      addStockButton,
      stockSaleRadioButton,
      stockTypeRadioButton,
      stockLocationTextbox,
      stockLocationDropdown,
      stockSubmitButton,
      projectLinkButton,
      forRentOrResaleRadioButton,
      stockSqftTextbox,
      stockBhkDropdown,
      stockFacingDropdown,
    } = webElement.pageElement(this.page);
    await addStockButton.click();
    await stockSaleRadioButton.nth(1).click();
    await this.expect(stockSaleRadioButton.nth(1)).toBeChecked();
    await stockTypeRadioButton.nth(1).click();
    await this.expect(stockTypeRadioButton.nth(1)).toBeFocused();
    await forRentOrResaleRadioButton.nth(1).click();
    await this.expect(forRentOrResaleRadioButton.nth(1)).toBeFocused();
    await stockSqftTextbox.fill(sqft);
    await this.expect(stockSqftTextbox).toHaveValue(sqft);
    await stockBhkDropdown.selectOption(bhk);
    await this.expect(stockBhkDropdown).toHaveValue(bhk);
    await stockFacingDropdown.selectOption(facing);
    await this.expect(stockFacingDropdown).toHaveValue(facing);
    await stockLocationTextbox.fill(location);
    await this.expect(stockLocationTextbox).toHaveValue(location);
    await this.page.waitForTimeout(1000);
    await stockLocationDropdown.nth(0).click();
    await this.page.waitForTimeout(500);
    await stockSubmitButton.nth(1).click();
    await this.page.waitForTimeout(500);
    await projectLinkButton.click();
  }
  async projectBack() {
    const { projectBackButton } = webElement.pageElement(this.page);
    await projectBackButton.click();
  }
}
module.exports = { createStock };
