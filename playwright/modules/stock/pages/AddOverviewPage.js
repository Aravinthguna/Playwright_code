const { WebElement } = require("../../../utils/GuiWebElements");
const webElement = new WebElement();
const path = require("path");

const projectName = "Testing Project";
const devName = "KG Builders";
const acres = "9999";
const reraId = "TN66 0001";
const status = "ongoing";
const description =
  "Test Builder Homes has a reputation for building quality new construction homes. Their satisfied homeowners give them an average rating of 4.4 stars for their beautiful floor plans and affordable upgrades, their skilled craftsmanship, and commitment to customer service on each house they build. You can read all of Test Builder Homes 132 homeowner reviews to learn why they are the right team to build your new home.";
const location = "coimbatore";
const bhk = "1.5";
const facing = "EAST";
const sqft = "9988";
const projectWebsiteheading = "Web Luxury";
const projectPageTitle = " Page Luxury";

class addOverview {

  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
  async navigateToOverview() {
    const { overviewModuleButton } = webElement.pageElement(this.page);
    await overviewModuleButton.click();
    await this.page.waitForTimeout(300);
  }
  async addProjectDetials() {
    const time = 500;
    const {
      overviewEditButton,
      overviewProjNameTextbox,
      overviewDevNameTextbox,
      overviewAcresTextbox,
      overviewReraTextbox,
      overviewStatusDropdown,
      overviewDescripTextarea,
      Websiteheading,
      Pagetitleheading,
      overviewImageEditButton,
      overviewImageDeleteButton,
      overviewImageUploadButton,
      overviewProjectImageUploadButton,
      overviewprojectSubmitButton,
      overviewProjectBannerUploadButton,
      overviewImageBannerUploadButton,

      overviewprojectBnnerSubmitButton,
      overviewLocationTextbox,
      overviewLocationMultiDropdown,
      overviewSubmitMultiButton,
      
    } = webElement.pageElement(this.page);
    await overviewEditButton.click();
    await this.page.waitForTimeout(time);
    const type = await this.page
      .locator("//input[@id='type']")
      .getAttribute("value");
    const sale = await this.page
      .locator(
        '//p[@class="text-xs bg-yellow-200 bg-opacity-70 rounded p-1 font-medium"]'
      )
      .textContent();
    await overviewProjNameTextbox.fill(
      `${projectName + " " + sale + " " + type}`
    );
    await this.expect(overviewProjNameTextbox).toHaveValue(
      `${projectName + " " + sale + " " + type}`
    );
    await overviewDevNameTextbox.fill(devName);
    await this.expect(overviewDevNameTextbox).toHaveValue(devName);
    await overviewAcresTextbox.fill(acres);
    await this.expect(overviewAcresTextbox).toHaveValue(acres);
    await overviewReraTextbox.fill(reraId);
    await this.expect(overviewReraTextbox).toHaveValue(reraId);
    const randomBhkIndex = await Math.floor(
      Math.random() * (await overviewStatusDropdown.locator("option").count())
    );
    await overviewStatusDropdown.selectOption({ index: randomBhkIndex });
    await overviewDescripTextarea.fill(description);
    await this.expect(overviewDescripTextarea).toHaveValue(description);
    const isVisible = await overviewImageEditButton.isVisible();
    if (isVisible) {
      await overviewImageEditButton.click();
      await overviewImageDeleteButton.click();
    }
    // 1️⃣ FIRST UPLOAD
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.page.getByText("Upload").nth(0).click();

    const fileChooser = await fileChooserPromise;
    const randomModelImageIndex = Math.floor(Math.random() * 10) + 1;
    const filePath = path.resolve(__dirname, `../../../resources/images/pexels${randomModelImageIndex}.jpg`);
    await fileChooser.setFiles(filePath);

    // 2️⃣ SECOND UPLOAD
    const fileChooserPromise2 = this.page.waitForEvent("filechooser");
    await this.page.getByText("Upload").nth(0).click();

    const fileChooser2 = await fileChooserPromise2;
    const randomModelImageIndex2 = Math.floor(Math.random() * 10) + 1;
    const filePath2 = path.resolve(__dirname, `../../../resources/images/pexels${randomModelImageIndex2}.jpg`);
    await fileChooser2.setFiles(filePath2);

    await Websiteheading.fill(`${projectWebsiteheading + " " + type}`);
    await Pagetitleheading.fill(`${projectPageTitle + " " + type}`);
    await overviewLocationTextbox.fill(location);
    await this.expect(overviewLocationTextbox).toHaveValue(location);
    await this.page.waitForTimeout(500);
    await overviewLocationMultiDropdown.nth(0).click();
    await this.page.waitForTimeout(500);
    await overviewSubmitMultiButton.click();
  }
  async addSecProjectDetials() {
    const {
      overviewEditButton,
      overviewProjNameTextbox,
      overviewDevNameTextbox,
      stockBhkDropdown,
      stockFacingDropdown,
      overviewStatusDropdown,
      overviewDescripTextarea,
      Websiteheading,
      Pagetitleheading,
      overviewImageEditButton,
      overviewImageDeleteButton,
      overviewImageUploadButton,
      overviewProjectImageUploadButton,
      overviewProjectBannerUploadButton,
      overviewImageBannerUploadButton,
      overviewprojectBnnerSubmitButton,
      overviewprojectSubmitButton,
      overviewLocationTextbox,
      overviewLocationMultiDropdown,
      overviewSubmitMultiButton,
      overviewSqftTextbox,
    } = webElement.pageElement(this.page);
    await overviewEditButton.click();
    await this.page.waitForTimeout(500);
    const type = await this.page
      .locator("//input[@id='type']")
      .getAttribute("value");
    const sale = await this.page
      .locator(
        '//p[@class="text-xs bg-yellow-200 bg-opacity-70 rounded p-1 font-medium"]'
      )
      .textContent();
    const listingtype = await this.page
      .locator("#listingType")
      .getAttribute("value");
    await overviewProjNameTextbox.fill(
      `${
        projectName + " " + sale + " " + type + " " + listingtype.toLowerCase()
      }`
    );
    await this.expect(overviewProjNameTextbox).toHaveValue(
      `${
        projectName + " " + sale + " " + type + " " + listingtype.toLowerCase()
      }`
    );
    await overviewDevNameTextbox.fill(devName);
    await this.expect(overviewDevNameTextbox).toHaveValue(devName);
    await stockBhkDropdown.selectOption(bhk);
    await this.expect(stockBhkDropdown).toHaveValue(bhk);
    await stockFacingDropdown.selectOption(facing);
    await this.expect(stockFacingDropdown).toHaveValue(facing);
    await overviewSqftTextbox.fill(sqft);
    await this.expect(overviewSqftTextbox).toHaveValue(sqft);
    const randomBhkIndex = await Math.floor(
      Math.random() * (await overviewStatusDropdown.locator("option").count())
    );
    await overviewStatusDropdown.selectOption({ index: randomBhkIndex });
    await overviewDescripTextarea.fill(description);
    await this.expect(overviewDescripTextarea).toHaveValue(description);
    const isVisible = await overviewImageEditButton.isVisible();
    if (isVisible) {
      await overviewImageEditButton.click();
      await overviewImageDeleteButton.click();
    }
        // 1️⃣ FIRST UPLOAD
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.page.getByText("Upload").nth(0).click();

    const fileChooser = await fileChooserPromise;
    const randomModelImageIndex = Math.floor(Math.random() * 10) + 1;
    const filePath = path.resolve(__dirname, `../../../resources/pexels${randomModelImageIndex}.jpg`);
    await fileChooser.setFiles(filePath);

    // 2️⃣ SECOND UPLOAD
    const fileChooserPromise2 = this.page.waitForEvent("filechooser");
    await this.page.getByText("Upload").nth(0).click();

    const fileChooser2 = await fileChooserPromise2;
    const randomModelImageIndex2 = Math.floor(Math.random() * 10) + 1;
    const filePath2 = path.resolve(__dirname, `../../../resources/pexels${randomModelImageIndex2}.jpg`);
    await fileChooser2.setFiles(filePath2);
    // await overviewImageUploadButton.click();
    // const randomModelImageIndex = (await Math.floor(Math.random() * 10)) + 1;
    // await overviewProjectImageUploadButton.setInputFiles(
    //   `../../../resources/pexels${randomModelImageIndex}.jpg`
    // );
    // await overviewprojectSubmitButton.click();
    // await overviewProjectBannerUploadButton.click();
    // const randomProjectBannermageIndex =
    //   (await Math.floor(Math.random() * 10)) + 1;
    // await overviewImageBannerUploadButton.setInputFiles(
    //   `../../../resources/pexels${randomProjectBannermageIndex}.jpg`
    // );
    // await overviewprojectBnnerSubmitButton.click();
    await Websiteheading.fill(`${projectWebsiteheading + " " + type}`);
    await Pagetitleheading.fill(`${projectPageTitle + " " + type}`);
    await overviewLocationTextbox.fill(location);
    await this.expect(overviewLocationTextbox).toHaveValue(location);
    await this.page.waitForTimeout(500);
    await overviewLocationMultiDropdown.nth(0).click();
    await this.page.waitForTimeout(500);
    await overviewSubmitMultiButton.click();
  }
  async addSecPlotProjectDetials() {
    const {
      overviewEditButton,
      overviewProjNameTextbox,
      overviewDevNameTextbox,
      stockFacingDropdown,
      overviewStatusDropdown,
      overviewDescripTextarea,
      Websiteheading,
      Pagetitleheading,
      overviewImageEditButton,
      overviewImageDeleteButton,
      overviewImageUploadButton,
      overviewProjectImageUploadButton,
      overviewprojectSubmitButton,
      overviewProjectBannerUploadButton,
      overviewImageBannerUploadButton,
      overviewprojectBnnerSubmitButton,
      overviewLocationTextbox,
      overviewLocationMultiDropdown,
      overviewSubmitMultiButton,
      overviewSqftTextbox,
    } = webElement.pageElement(this.page);
    await overviewEditButton.click();
    await this.page.waitForTimeout(500);
    const type = await this.page
      .locator("//input[@id='type']")
      .getAttribute("value");
    const sale = await this.page
      .locator(
        '//p[@class="text-xs bg-yellow-200 bg-opacity-70 rounded p-1 font-medium"]'
      )
      .textContent();
    const listingtype = await this.page
      .locator("#listingType")
      .getAttribute("value");
    await overviewProjNameTextbox.fill(
      `${
        projectName + " " + sale + " " + type + " " + listingtype.toLowerCase()
      }`
    );
    await this.expect(overviewProjNameTextbox).toHaveValue(
      `${
        projectName + " " + sale + " " + type + " " + listingtype.toLowerCase()
      }`
    );
    await overviewDevNameTextbox.fill(devName);
    await this.expect(overviewDevNameTextbox).toHaveValue(devName);
    await stockFacingDropdown.selectOption(facing);
    await this.expect(stockFacingDropdown).toHaveValue(facing);
    await overviewSqftTextbox.fill(sqft);
    await this.expect(overviewSqftTextbox).toHaveValue(sqft);
    const randomBhkIndex = await Math.floor(
      Math.random() * (await overviewStatusDropdown.locator("option").count())
    );
    await overviewStatusDropdown.selectOption({ index: randomBhkIndex });
    await overviewDescripTextarea.fill(description);
    await this.expect(overviewDescripTextarea).toHaveValue(description);
    const isVisible = await overviewImageEditButton.isVisible();
    if (isVisible) {
      await overviewImageEditButton.click();
      await overviewImageDeleteButton.click();
    }
        // 1️⃣ FIRST UPLOAD
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.page.getByText("Upload").nth(0).click();

    const fileChooser = await fileChooserPromise;
    const randomModelImageIndex = Math.floor(Math.random() * 10) + 1;
    const filePath = path.resolve(__dirname, `../../../resources/pexels${randomModelImageIndex}.jpg`);
    await fileChooser.setFiles(filePath);

    // 2️⃣ SECOND UPLOAD
    const fileChooserPromise2 = this.page.waitForEvent("filechooser");
    await this.page.getByText("Upload").nth(0).click();

    const fileChooser2 = await fileChooserPromise2;
    const randomModelImageIndex2 = Math.floor(Math.random() * 10) + 1;
    const filePath2 = path.resolve(__dirname, `../../../resources/pexels${randomModelImageIndex2}.jpg`);
    await fileChooser2.setFiles(filePath2);
    // await overviewImageUploadButton.click();
    // const randomModelImageIndex = (await Math.floor(Math.random() * 10)) + 1;

    // await overviewProjectImageUploadButton.setInputFiles(
    //   `../../../resources/pexels${randomModelImageIndex}.jpg`
    // );
    // await overviewprojectSubmitButton.click();
    // await overviewProjectBannerUploadButton.click();
    // const randomProjectBannermageIndex =
    //   (await Math.floor(Math.random() * 10)) + 1;
    // await overviewImageBannerUploadButton.setInputFiles(
    //   `../../../resources/pexels${randomProjectBannermageIndex}.jpg`
    // );
    // await overviewprojectBnnerSubmitButton.click();
    await Websiteheading.fill(`${projectWebsiteheading + " " + type}`);
    await Pagetitleheading.fill(`${projectPageTitle + " " + type}`);
    await overviewLocationTextbox.fill(location);
    await this.expect(overviewLocationTextbox).toHaveValue(location);
    await this.page.waitForTimeout(500);
    await overviewLocationMultiDropdown.nth(0).click();
    await this.page.waitForTimeout(500);
    await overviewSubmitMultiButton.click();
  }
  async projectPublish(status) {
    if (status) {
      const {
        projectPublishButton,
        publishProceedButton,
        publishMessage,
        overviewModuleButton,
      } = webElement.pageElement(this.page);
      await overviewModuleButton.click();
      await this.page.waitForTimeout(300);
      await projectPublishButton.click();
      await publishProceedButton.click();
      await this.expect(publishMessage).toHaveText(
        "Project published successfully. Please check your respective web store after a few minutes to see your changes."
      );
      await this.page.waitForTimeout(1000);
    }
  }
}
module.exports = { addOverview };
