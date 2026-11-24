const { WebElement } = require("../../../utils/WebElements");
const webElement = new WebElement();
const exp = require("constants");
const { expect } = require("@playwright/test");
class StockGrant {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
  async goto(url) {
    await this.page.goto(url);
  }
  async stockGrant() {
    const {
      stockbutton,
      checkbox,
      searchButton,
      dotButton,
      grantButton,
      textBox,
      selectCompany,
      addMessageBox,
      acceptGrantButon,
    } = webElement.pageElement(this.page);
    /**********Partner Exange *********************/
    await stockbutton.click();
    await checkbox.nth(1).click();
    await dotButton.click();
    await grantButton.click();
   const phNumberArray = [
  "7650270408",
  "0000000001",
  "7305711581",
  "0000000006",
  "6666666666",
  "7760279160",
  "8220548887",
  "8248673831",
  "9361505487",
  "9686620422",
  "9789593505",
];
function getRandomPhoneNumber() {
  const randomIndex = Math.floor(Math.random() * phNumberArray.length);
  return phNumberArray[randomIndex];
}
const randomPhoneNumber = getRandomPhoneNumber();
await textBox.fill(randomPhoneNumber);
await searchButton.click();
await selectCompany.nth(0).click();
await addMessageBox.fill("hiiiiiiii");
await acceptGrantButon.click();
}
}
module.exports = { StockGrant };
