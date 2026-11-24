const { WebElement } = require("../../../utils/GuiWebElements");
const webElement = new WebElement();
const path = require("path");

// ─── Helper: generate a unique tag name + description on every run ───────────
function generateTagData() {
  const types = ["Apt", "Villa", "Row", "Plot", "Flat", "House"];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const timestamp = Date.now().toString().slice(-6);
  const randomSuffix = Math.floor(Math.random() * 900) + 100;

  const tagName = `${randomType}_${timestamp}_${randomSuffix}`.slice(0, 25);
  const tagDescription = `Auto generated tag for ${randomType} - ${Date.now()}`;

  return { tagName, tagDescription };
}
// ─────────────────────────────────────────────────────────────────────────────

class createUnit {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
  async goto(url) {
    await this.page.goto(url);
  }
  async addModelDetials() {
    const {
      unitModuleButton,
      unitPageEditButton,
      unitBasePriceTextbox,
      unitPageSaveButton,
      updateBasePrice,
      unitBasePriceTextboxAssert,
      modelCard,
    } = webElement.pageElement(this.page);
    await unitModuleButton.click();
    await this.page.waitForTimeout(500);
    await unitPageEditButton.click();
    const randomNumber = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
    await unitBasePriceTextbox.fill(`${randomNumber.toString()}`);
    await unitPageSaveButton.click();
    await updateBasePrice.click();
  }
  async addSecResaleModelDetials() {
    const {
      unitModuleButton,
      unitPageEditButton,
      unitBasePriceTextbox,
      unitPageSaveButton,
      updateBasePrice,
      unitBasePriceTextboxAssert,
    } = webElement.pageElement(this.page);
    await unitModuleButton.click();
    await this.page.waitForTimeout(500);
    await unitPageEditButton.click();
    const randomNumber =
      Math.floor(Math.random() * (1000000 - 500000 + 1)) + 500000;
    await unitBasePriceTextbox.fill(`${randomNumber.toString()}`);
    await unitPageSaveButton.click();
    await this._confirmBasePriceUpdate(updateBasePrice);
  }
  async addSecRentModelDetials() {
    const {
      unitModuleButton,
      unitPageEditButton,
      unitBasePriceTextbox,
      unitPageSaveButton,
      updateBasePrice,
      unitBasePriceTextboxAssert,
    } = webElement.pageElement(this.page);
    await unitModuleButton.click();
    await this.page.waitForTimeout(500);
    await unitPageEditButton.click();
    const randomNumber =
      Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000;
    await unitBasePriceTextbox.fill(`${randomNumber.toString()}`);
    await unitPageSaveButton.click();
    await this._confirmBasePriceUpdate(updateBasePrice);
  }
  // Saving the base price opens an "Update Base Price" confirmation (the primary
  // flow confirms it in addModelDetials). The secondary flows never confirmed it;
  // the dialog was only discarded by a page reload, so the price was not saved
  // and the reload was needed to get past the dialog. Confirm it when shown.
  async _confirmBasePriceUpdate(updateBasePrice) {
    const prompted = await updateBasePrice
      .waitFor({ state: "visible", timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    if (prompted) {
      await updateBasePrice.click();
      await this._waitForDialogsClosed();
    }
  }

  // Headless UI dialogs (formula builder, custom price, site/floor plan) close
  // asynchronously after Save. Clicking the next tab while one is still open is
  // intercepted by its overlay, so wait until no dialog remains.
  async _waitForDialogsClosed(timeout = 20000) {
    await this.expect(
      this.page.locator('#headlessui-portal-root [role="dialog"]'),
    ).toHaveCount(0, { timeout });
  }

  async navigateToUnit() {
    const { unitModuleButton } = webElement.pageElement(this.page);
    await unitModuleButton.click();
  }

  async addUnit() {
    const {
      addModelButton,
      modelFacingDropdown,
      modelSqftTextbox,
      modelSubmitButton,
      modelBhkDropdown,
      modelBathDropDown,
      modelBalconyDropDown,
      modelWebSiteHeading,
      modelPageTittleHeading,
    } = webElement.pageElement(this.page);
    await addModelButton.click();
    const randomBhkIndex = await Math.floor(
      Math.random() * (await modelBhkDropdown.locator("option").count()),
    );
    await modelBhkDropdown.selectOption({ index: randomBhkIndex });
    const randomFacingIndex = await Math.floor(
      Math.random() * (await modelFacingDropdown.locator("option").count()),
    );
    await modelFacingDropdown.selectOption({ index: randomFacingIndex });
    const randomBath = await Math.floor(
      Math.random() * (await modelBathDropDown.locator("option").count()),
    );
    await modelBathDropDown.selectOption({ index: randomBath });
    const randomBalcony = await Math.floor(
      Math.random() * (await modelBalconyDropDown.locator("option").count()),
    );
    await modelBalconyDropDown.selectOption({ index: randomBalcony });
    const sqftRandom =
      (await Math.floor(Math.random() * (5000 - 1000 + 1))) + 1000;
    await modelSqftTextbox.nth(0).fill(sqftRandom.toString());

    const unitWebSiteHeading = "WebSite";
    const unitPageTittleHeading = "pageTittle";
    await modelWebSiteHeading.fill(`${unitWebSiteHeading} Apartment`);
    await this.expect(modelWebSiteHeading).toHaveValue(
      `${unitWebSiteHeading} Apartment`,
    );
    await modelPageTittleHeading.fill(`${unitPageTittleHeading} Apartment`);
    await this.expect(modelPageTittleHeading).toHaveValue(
      `${unitPageTittleHeading} Apartment`,
    );
    await modelSubmitButton.click();
  }

  async addPlot() {
    const {
      addModelButton,
      modelFacingDropdown,
      modelSqftTextbox,
      modelSubmitButton,
    } = webElement.pageElement(this.page);
    await addModelButton.click();
    const randomFacingIndex = await Math.floor(
      Math.random() * (await modelFacingDropdown.locator("option").count()),
    );
    await modelFacingDropdown.selectOption({ index: randomFacingIndex });
    const sqftRandom =
      (await Math.floor(Math.random() * (5000 - 1000 + 1))) + 1000;
    await modelSqftTextbox.nth(0).fill(sqftRandom.toString());

    await modelSubmitButton.click();
  }
  async navigateToModelPage(i) {
    const { modelCard, modelDetialsButton, unitModuleButton } =
      webElement.pageElement(this.page);
    // The model list does not always refresh after a model is saved (always the
    // case for the secondary single-model flows), so fall back to a reload when
    // the card has not rendered. After reload the Unit tab is selected by default;
    // clicking it while the project is still loading leaves the page stuck, so
    // only click it if the card still does not show up.
    const card = modelCard.nth(i);
    const isCardVisible = (timeout) =>
      card
        .waitFor({ state: "visible", timeout })
        .then(() => true)
        .catch(() => false);
    if (!(await isCardVisible(3000))) {
      await this.page.reload();
      if (!(await isCardVisible(20000))) {
        await unitModuleButton.click();
      }
    }
    await card.click();
    await modelDetialsButton.click();
  }
  async updateUnit() {
    const {
      stockDetialEditButton,
      modelImageUploadButton,
      modelimageUpload,
      modelImageSubmitButton,
      modelPageBhkDropdown,
      modelPageFacingDropdown,
      modelPageSqftTextbox,
      stockdetialSaveButton,
      modelUnitDiscription,
      modelpageBalconyDropDown,
      modelPageBasePricetextBox,
      modelpageBathDropDown,
    } = webElement.pageElement(this.page);
    await stockDetialEditButton.click();

    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.page.getByText("Upload").click();

    const fileChooser = await fileChooserPromise;

    // generate random number from 1 to 10
    const randomModelImageIndex = Math.floor(Math.random() * 10) + 1;

    // build random image path (remove spaces from your file name)
    const filePath = `playwright/resources/images/pexels${randomModelImageIndex}.jpg`;

    await fileChooser.setFiles(filePath);
    const randomBhkIndex = await Math.floor(
      Math.random() * (await modelPageBhkDropdown.locator("option").count()),
    );
    await modelPageBhkDropdown.selectOption({ index: randomBhkIndex });
    const randomFacingIndex = await Math.floor(
      Math.random() * (await modelPageFacingDropdown.locator("option").count()),
    );
    await modelPageFacingDropdown.selectOption({ index: randomFacingIndex });
    const sqftRandom =
      (await Math.floor(Math.random() * (5000 - 1000 + 1))) + 1000;
    await modelPageSqftTextbox.fill(sqftRandom.toString());
    const randomBath = await Math.floor(
      Math.random() * (await modelpageBathDropDown.locator("option").count()),
    );
    await modelpageBathDropDown.selectOption({ index: randomBath });
    const randomBalcony = await Math.floor(
      Math.random() *
        (await modelpageBalconyDropDown.locator("option").count()),
    );
    await modelpageBalconyDropDown.selectOption({ index: randomBalcony });
    const isVisible = await modelUnitDiscription.isVisible();

    if (isVisible) {
      const description =
        "RERA No - TN/35/Building/0023/2025 www.rera.tn.gov.in";
      await modelUnitDiscription.fill(description);
    }
    const randomNumber = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;

    await modelPageBasePricetextBox.fill(`${randomNumber.toString()}`);
    await stockdetialSaveButton.click();
  }

  async UpdateUnitLabelName() {
    const {
      unitLabelNameEditButton,
      unitLabelName,
      unitLabelNameSaveButton,
    } = webElement.pageElement(this.page);

    const isEditVisible = await unitLabelNameEditButton
      .waitFor({ state: "visible", timeout: 8000 })
      .then(() => true)
      .catch(() => false);

    if (isEditVisible) {
      await unitLabelNameEditButton.click();
      const hasUnitInput = await unitLabelName
        .waitFor({ state: "visible", timeout: 5000 })
        .then(() => true)
        .catch(() => false);

      if (hasUnitInput) {
        const randomUnitName = `Unit_${Date.now().toString().slice(-4)}_${Math.floor(Math.random() * 900) + 100}`;
        await unitLabelName.fill(randomUnitName);
        await this.expect(unitLabelName).toHaveValue(randomUnitName);
        await unitLabelNameSaveButton.click();
        await unitLabelNameEditButton.waitFor({ state: "visible", timeout: 10000 });
      } else {
        const isSaveVisible = await unitLabelNameSaveButton.isVisible().catch(() => false);
        if (isSaveVisible) {
          await unitLabelNameSaveButton.click();
          await unitLabelNameEditButton.waitFor({ state: "visible", timeout: 10000 });
        }
      }
    }
  }

  async UpdateModelLabelName() {
    const {
      modelLabelNameEditButton,
      modelLabelName,
      modelLabelNameSaveButton,
    } = webElement.pageElement(this.page);
    await modelLabelNameEditButton.waitFor({ state: "visible", timeout: 10000 });
    await modelLabelNameEditButton.click();
    await modelLabelName.waitFor({ state: "visible", timeout: 10000 });
    const randomModelName = `M_${Date.now().toString().slice(-4)}_${Math.floor(Math.random() * 900) + 100}`;
    await modelLabelName.fill(randomModelName);
    await this.expect(modelLabelName).toHaveValue(randomModelName);
    await modelLabelNameSaveButton.click();
    await modelLabelNameEditButton.waitFor({ state: "visible", timeout: 10000 });
  }
  async updatePlot() {
    const {
      stockDetialEditButton,
      modelImageUploadButton,
      modelimageUpload,
      modelImageSubmitButton,
      modelPageFacingDropdown,
      modelPageSqftTextbox,
      modelPageBasePricetextBox,
      stockdetialSaveButton,
    } = webElement.pageElement(this.page);
    await stockDetialEditButton.click();
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.page.getByText("Upload").click();

    const fileChooser = await fileChooserPromise;

    // generate random number from 1 to 10
    const randomModelImageIndex = Math.floor(Math.random() * 10) + 1;

    // build random image path (remove spaces from your file name)
    const filePath = `playwright/resources/images/pexels${randomModelImageIndex}.jpg`;

    await fileChooser.setFiles(filePath);

    const randomFacingIndex = await Math.floor(
      Math.random() * (await modelPageFacingDropdown.locator("option").count()),
    );
    await modelPageFacingDropdown.selectOption({ index: randomFacingIndex });
    const sqftRandom =
      (await Math.floor(Math.random() * (5000 - 1000 + 1))) + 1000;
    await modelPageSqftTextbox.fill(sqftRandom.toString());
    const randomNumber = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
    await modelPageBasePricetextBox.fill(`${randomNumber.toString()}`);
    await stockdetialSaveButton.click();
  }
  async updateCustomPrice(i) {
    const {
      customEditButton,
      customAddButton,
      customLabelNameTextbox,
      customPriceTypeButton,
      customTypeIncrease,
      changePriceOnRadioButton,
      customYourPriceTextbox,
      customSaveButton,
    } = webElement.pageElement(this.page);
    const isVisible = await customEditButton.isVisible();
    if (isVisible) {
      await customEditButton.click();
    }
    await customAddButton.click();
    await customLabelNameTextbox.fill(`Custom Price ${i + 1}`);
    await customPriceTypeButton.click();
    await customTypeIncrease.click();
    await changePriceOnRadioButton.nth(0).click();
    const randomNumber = (await Math.floor(Math.random() * 10)) + 1;
    await customYourPriceTextbox.fill(`${randomNumber.toString()}`);
    await customSaveButton.click();
    await this._waitForDialogsClosed();
  }
  async createFormula() {
    const {
      formulaBuildButton,
      formulaProceedButton,
      buildBlockButton,
      buildBlockTextbox,
      buildBlockDoneButton,
      formulaSaveButton,
    } = webElement.pageElement(this.page);
    const randomFormula = (await Math.floor(Math.random() * 3)) + 1;
    await formulaBuildButton.click();
    await formulaProceedButton.click();
    await buildBlockButton.click();
    await buildBlockTextbox.fill(`1-${randomFormula + 1}`);
    await buildBlockDoneButton.click();
    await formulaSaveButton.click();
    await this._waitForDialogsClosed();
  }
  async createFormulaApartment() {
    const {
      formulaBuildButton,
      formulaProceedButton,
      buildBlockButton,
      buildBlockTextbox,
      buildBlockDoneButton,
      buildFloorButton,
      buildFloorTextbox,
      buildFloorDoneButton,
      formulaSaveButton,
    } = webElement.pageElement(this.page);
    const randomFormula = (await Math.floor(Math.random() * 3)) + 1;
    await formulaBuildButton.click();
    await formulaProceedButton.click();
    await buildBlockButton.click();
    await buildBlockTextbox.fill(`1-${randomFormula + 1}`);
    await buildBlockDoneButton.click();
    await buildFloorButton.click();
    await buildFloorTextbox.fill(`1-${randomFormula + 1}`);
    await buildFloorDoneButton.click();
    await formulaSaveButton.click();
    await this._waitForDialogsClosed();
  }
  async markOnSite() {
    const {
      sitePlanButton,
      siteUploadButton,
      sitePlanUpload,
      siteUploadDoneButton,
      sitePlanSelect,
      sitePlanSaveButton,
    } = webElement.pageElement(this.page);

    await sitePlanButton.click();
    await this.page.waitForTimeout(500);
    const siteMapVisible = await siteUploadButton.isVisible();
    if (siteMapVisible) {
      await siteUploadButton.click();
      await sitePlanUpload.setInputFiles(
        "playwright/resources/images/sitemap.png",
      );
      await siteUploadDoneButton.click();
    }
    await sitePlanSelect.click();
    await this.page.waitForTimeout(2000);
    await sitePlanSaveButton.click();
    await this._waitForDialogsClosed();
  }
  async markOnfloor() {
    const {
      floorPlanButton,
      floorUploadButton,
      floorPlanUpload,
      floorUploadDoneButton,
      floorPlanSelect,
      floorPlanSaveButton,
    } = webElement.pageElement(this.page);

    await floorPlanButton.click();
    await this.page.waitForTimeout(500);
    const floorMapVisible = await floorUploadButton.isVisible();
    if (floorMapVisible) {
      await floorUploadButton.click();
      await floorPlanUpload.setInputFiles(
        "playwright/resources/images/floor plan.jpg",
      );
      await floorUploadDoneButton.click();
    }
    await floorPlanSelect.click();
    await this.page.waitForTimeout(2000);
    await floorPlanSaveButton.click();
    await this._waitForDialogsClosed();
  }
  // React-controlled textareas ignore a plain fill() and snap back to the
  // prefilled value (e.g. "Globus Arima | Realiti.io"). Wait for that prefills
  // to land, then set value through the native setter + input/change events.
  async _fillField(locator, value) {
    await locator.waitFor({ state: "visible", timeout: 8000 });
    await locator.click();
    await locator.evaluate((el, val) => {
      const proto =
        el.tagName.toLowerCase() === "textarea"
          ? window.HTMLTextAreaElement.prototype
          : window.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
      setter.call(el, val);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }, value);
  }

  async unitSlug() {
    const {
      slugUrnButton,
      EditSlugUrnButton,
      slugTextAreaApart,
      slugSaveButton,
    } = webElement.pageElement(this.page);

    await slugUrnButton.click();
    await this.page
      .getByRole("heading", { name: "Slug" })
      .waitFor({ state: "visible", timeout: 10000 });

    await EditSlugUrnButton.waitFor({ state: "visible", timeout: 10000 });
    await this.expect(EditSlugUrnButton).toBeEnabled();
    await EditSlugUrnButton.click();

    const slugInput = slugTextAreaApart.or(
      this.page.getByRole("textbox", { name: "slugUrn" }),
    );
    await slugInput.waitFor({ state: "visible", timeout: 8000 });

    const slugValue = `testing-project-ongoing-1-5-bhk-${Date.now()}`;
    await this._fillField(slugInput, slugValue);

    await slugSaveButton.click();
    await EditSlugUrnButton.waitFor({ state: "visible", timeout: 15000 });
  }

  async unitSEO() {
    const projectName = "Testing Project";
    const status = "ongoing";
    const description =
      "Test Builder Homes has a reputation for building quality new construction homes. Their satisfied homeowners give them an average rating of 4.4 stars for their beautiful floor plans and affordable upgrades, their skilled craftsmanship, and commitment to customer service on each house they build. You can read all of Test Builder Homes 132 homeowner reviews to learn why they are the right team to build your new home.";
    const location = "coimbatore";
    const bhk = "1.5";

    const {
      seoDetailsButton,
      editSeoButton,
      metaTittle,
      metaKeyword,
      metaDiscription,
      seoImageUpload,
      seoSmbmitButton,
    } = webElement.pageElement(this.page);

    await seoDetailsButton.click();
    await this.page
      .getByRole("heading", { name: "SEO Details" })
      .waitFor({ state: "visible", timeout: 10000 });

    await editSeoButton.waitFor({ state: "visible", timeout: 10000 });
    await this.expect(editSeoButton).toBeEnabled();
    await editSeoButton.click();

    const titleValue = `${projectName} ${status} ${location}`;
    await metaTittle.waitFor({ state: "visible", timeout: 8000 });
    // Prefill from the API overwrites an early fill — wait until it appears.
    await this.expect
      .poll(async () => metaTittle.inputValue(), { timeout: 8000 })
      .not.toEqual("");
    await this.page.waitForTimeout(400);

    await this._fillField(metaTittle, titleValue);
    await this.expect(metaTittle).toHaveValue(titleValue);

    const keywordValue = `${projectName} ${status} ${location} ${bhk} ${description}`;
    await this._fillField(metaKeyword, keywordValue);
    await this._fillField(metaDiscription, keywordValue);

    const imagePath = path.join(
      __dirname,
      "../../../resources/images/pexels3.jpg",
    );
    if ((await seoImageUpload.count()) > 0) {
      await seoImageUpload.setInputFiles(imagePath);
    } else {
      await this.page
        .locator('label:has-text("Upload")')
        .last()
        .setInputFiles(imagePath);
    }
    await this.page.waitForTimeout(500);

    await seoSmbmitButton.click();
    await editSeoButton.waitFor({ state: "visible", timeout: 15000 });
  }

  // ─── Shared image upload helper ─────────────────────────────────────────────
  // Clicks an upload label, waits for #file-upload to attach, sets the file,
  // clicks Submit, then waits for the dialog to close before returning.
  async _uploadImage(uploadLabel) {
    const submitButton = this.page
      .locator('//button[normalize-space()="Submit"]')
      .nth(0);

    await uploadLabel.click();

    const fileInput = this.page.locator("input#file-upload");
    await fileInput.waitFor({ state: "attached", timeout: 10000 });
    await fileInput.setInputFiles(
      path.join(__dirname, "../../../resources/images/pexels1.jpg"),
    );

    await submitButton.click();
    await this.page.waitForTimeout(600);

    await fileInput.waitFor({ state: "detached", timeout: 10000 }).catch(() => {
      /* dialog may hide instead of detach — that is fine */
    });
    await this.page.waitForTimeout(400);
  }

  // ─── Shared save helper ───────────────────────────────────────────────────
  // Clicks Save, then waits for the Edit button to reappear — this signals the
  // panel returned to view-only mode and the save operation is complete.
  async _saveAndVerify(saveButton, editButton) {
    await saveButton.click();

    // The panel transitions from edit-mode (Save/Cancel visible) back to
    // view-mode (Edit button visible) once the save API call finishes.
    await editButton.waitFor({ state: "visible", timeout: 20000 });
  }

  async addUnitContentSection1() {
    const {
      unitContentSection1Button,
      unitContentSectionEditButton,
      unitSectionTitle,
      unitTitle,
      unitSubTitle,
      unitContentImage1,
      unitBackrountImage1,
      unitContentDescriptionTextbox,
      unitContentSectionSaveButton,
    } = webElement.pageElement(this.page);

    await this.page.waitForTimeout(500);
    await unitContentSection1Button.scrollIntoViewIfNeeded();
    await unitContentSection1Button.click();

    // Wait for Edit button inside the Content section 1 panel
    await unitContentSectionEditButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await unitContentSectionEditButton.scrollIntoViewIfNeeded();
    await this.expect(unitContentSectionEditButton).toBeEnabled();
    await unitContentSectionEditButton.click();

    await unitSectionTitle.waitFor({ state: "visible", timeout: 8000 });
    await unitSectionTitle.fill("Unit Content Section 1");
    await this.expect(unitSectionTitle).toHaveValue("Unit Content Section 1");

    await unitTitle.fill("Unit Title 1");
    await this.expect(unitTitle).toHaveValue("Unit Title 1");

    await unitSubTitle.fill("Unit Subtitle 1");
    await this.expect(unitSubTitle).toHaveValue("Unit Subtitle 1");

    await unitContentDescriptionTextbox.fill(
      "Detailed description of unit content section 1.",
    );
    await this.expect(unitContentDescriptionTextbox).toHaveValue(
      "Detailed description of unit content section 1.",
    );

    // Upload Content Image — condition-based waits via helper
    await this._uploadImage(unitContentImage1);

    // Upload Background Image
    await this._uploadImage(unitBackrountImage1);

    // Save and wait until the panel returns to view-mode (Edit button visible)
    // This ensures Section 1 is fully persisted before Section 2 begins.
    await this._saveAndVerify(
      unitContentSectionSaveButton,
      unitContentSectionEditButton,
    );

    // Section 2 reuses the same form inputs; switching too early lets Section 1's
    // state re-initialise into Section 2 (and drop it out of edit mode).
    await this.page.waitForTimeout(2000);
  }

  async addUnitContentSection2() {
    const {
      unitContentSection2Button,
      unitContentSection2EditButton,
      unitSectionTitle,
      unitTitle,
      unitSubTitle,
      unitContentImage1,
      unitBackrountImage1,
      unitContentDescriptionTextbox,
      unitContentSectionSaveButton,
    } = webElement.pageElement(this.page);

    await this.page.waitForTimeout(500);
    await unitContentSection2Button.scrollIntoViewIfNeeded();
    await unitContentSection2Button.click();

    // Wait for Edit button inside the Content section 2 panel
    await unitContentSection2EditButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await this.page.waitForTimeout(1000);
    await unitContentSection2EditButton.scrollIntoViewIfNeeded();
    await this.expect(unitContentSection2EditButton).toBeEnabled();
    await unitContentSection2EditButton.click();

    await unitSectionTitle.waitFor({ state: "visible", timeout: 8000 });
    await unitSectionTitle.click();
    await unitSectionTitle.fill("Unit Content Section 2");
    await this.expect(unitSectionTitle).toHaveValue("Unit Content Section 2");

    await unitTitle.click();
    await unitTitle.fill("Unit Title 2");
    await this.expect(unitTitle).toHaveValue("Unit Title 2");

    await unitSubTitle.click();
    await unitSubTitle.fill("Unit Subtitle 2");
    await this.expect(unitSubTitle).toHaveValue("Unit Subtitle 2");

    await unitContentDescriptionTextbox.fill(
      "Detailed description of unit content section 2.",
    );
    await this.expect(unitContentDescriptionTextbox).toHaveValue(
      "Detailed description of unit content section 2.",
    );

    // Upload Content Image
    await this._uploadImage(unitContentImage1);

    // Upload Background Image
    await this._uploadImage(unitBackrountImage1);

    // Save and wait until the panel returns to view-mode (Edit button visible)
    // This ensures Section 2 is fully persisted before Tag section begins.
    await this._saveAndVerify(
      unitContentSectionSaveButton,
      unitContentSection2EditButton,
    );
  }

  async navigateToProjectPage() {
    const { modelBackButton, galleryModuleButton } = webElement.pageElement(
      this.page,
    );
    await modelBackButton.click();
    await galleryModuleButton
      .waitFor({ state: "visible", timeout: 15000 })
      .catch(() => {});
  }
  async addUnitTags() {
    const {
      unitTagsButton,
      addUnitTagButton,
      tagNameTextbox,
      tagDescriptionTextbox,
      tagSubmitButton,
    } = webElement.pageElement(this.page);

    await this.page.waitForTimeout(500);
    await unitTagsButton.click();

    const { tagName, tagDescription } = generateTagData();

    await addUnitTagButton.click();
    await tagNameTextbox.fill(tagName);
    await this.expect(tagNameTextbox).toHaveValue(tagName);
    await tagDescriptionTextbox.fill(tagDescription);
    await this.expect(tagDescriptionTextbox).toHaveValue(tagDescription);
    await tagSubmitButton.click();
  }
}
module.exports = { createUnit };
