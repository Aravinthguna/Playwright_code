const { WebElement } = require("../../../utils/GuiWebElements");
const webElement = new WebElement();
const path = require("path");

class Collections {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async collection(collectionCount = 3) {
    const {
      stocksMenuButton,
      collectionButton,
      addCollectionButton,
      collectionName,
      collectionDescription,
      colectionImageUploadFile,
      imageUpload,
      collectionImageSaveButton,
      collectionSaveButton,
      filterButton,
      projectTypesCategory,
      selectTypes,
      bedrooms,
      SelectBhk,
      collectionAcceptButon,
      addListCollectionButton,
      collection3DotButton,
      addmoreButton,
      pinCollcetion,
    } = webElement.pageElement(this.page);

    await stocksMenuButton.click();
    await collectionButton.click();

    const collectionNames = [
      "Horizon Rows",
      "The Metro Edge",
      "Skyline Residences",
      "Vista Luna",
      "Urban Heights",
      "Pearl Gardens",
      "Emerald Vistas",
      "Golden Gate Suites",
      "Silver Oak Residences",
      "Sapphire Heights",
    ];

    const collectionDescriptions = [
      "Alex Trebek's fun TV quiz game. Woven silk pyjamas exchanged for blue quartz. Brawny gods just.",
      "A stunning collection of premium residences crafted for modern urban living and unparalleled comfort.",
      "Experience luxury redefined with world-class amenities, breathtaking views, and sophisticated design.",
      "Where tranquility meets elegance — a curated selection of homes for the discerning homeowner.",
      "Discover your dream home in our exclusive collection of thoughtfully designed living spaces.",
    ];
    const filterCombinations = [[0], [1], [0, 1], [1, 2], [0, 2]];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    for (let i = 0; i < collectionCount; i++) {
      await addCollectionButton.click();
      const fileChooserPromise = this.page.waitForEvent("filechooser");
      await colectionImageUploadFile.click();
       const randomImage= Math.floor(Math.random() *5)+ 1;
        await imageUpload.setInputFiles(path.join(__dirname, `../../../resources/images/pexels${randomImage}.jpg`));



      //await imageUpload.setInputFile("../../../resources/pexels11.jpg");
      await collectionImageSaveButton.nth(1).click();
      await collectionSaveButton.nth(0).click();
      await filterButton.click();
      const filterCombo = pick(filterCombinations);
      console.log(`   🔍 Applying filter indexes: [${filterCombo.join(", ")}]`);
      await projectTypesCategory.click();
      for (const idx of filterCombo) {
        await selectTypes.nth(idx).click();
      }
      await collectionAcceptButon.click();
      await addListCollectionButton.click();
      await this.page.locator('//button[normalize-space()="Go Back"]').click();
      await collection3DotButton.first().click();
      await addmoreButton.click();
      await addListCollectionButton.click();
      await this.page.locator('//button[normalize-space()="Go Back"]').click();
    }
    // await pinCollcetion.nth(0).click();
  }
}

module.exports = { Collections };
