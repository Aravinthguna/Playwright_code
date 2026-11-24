const { WebElement } = require("../../../utils/WebElements");
const { test, expect } = require("@playwright/test");
const {
  getRandomDate,
  getRandomDateTimeFormatted,
  getCurrentDateTimeFormatted,
  getCurrentDateFormatted,
  getRandomDateTime,
} = require("../../../utils/DateUtils");

const webelement = new WebElement();
class LeadActivites {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  /**
   * Ensures reliable textarea filling by:
   * 1. Validating that the textarea is neither disabled nor read-only (failing early with descriptive errors)
   * 2. First trying a direct fill()
   * 3. Falling back to sequential character input if the value doesn't match
   * 4. Verifying the final value matches the expected text
   * Needed because some textareas have validation or masks that prevent direct filling
   */
  async _fillActivityTextarea(textareaLocator, text) {
    await textareaLocator.waitFor({ state: "visible" });

    // Guard against disabled or read-only textareas to fail early with clear diagnosis
    if (await textareaLocator.isDisabled().catch(() => false)) {
      throw new Error("[LeadActivitiesPage] Cannot fill textarea: target element is disabled.");
    }

    const isReadOnly = await textareaLocator
      .evaluate((el) => Boolean(el.readOnly || el.hasAttribute("readonly")))
      .catch(() => false);
    if (isReadOnly) {
      throw new Error("[LeadActivitiesPage] Cannot fill textarea: target element is marked as read-only.");
    }

    await textareaLocator.click();
    await textareaLocator.clear().catch(() => {});
    await textareaLocator.fill(text);
    if ((await textareaLocator.inputValue().catch(() => "")) !== text) {
      await textareaLocator.fill("");
      await textareaLocator.pressSequentially(text, { delay: 10 });
    }
    await expect(textareaLocator).toHaveValue(text);
  }

  /**
   * Open a Headless-UI style menu and pick an option. All these menus share the
   * `//div[@role="none"]//div` option locator, so after picking we wait for the
   * menu to close — otherwise the next lookup could hit the closing menu's items.
   */
  async _pickMenuOption(trigger, options, index) {
    await trigger.click();
    const option = options.nth(index);
    await option.waitFor({ state: "visible", timeout: 10000 });
    // A normal click waits for the menu's opening transition to finish (stable);
    // a forced click during the transition can miss and leave the menu open
    // over the next field. Force only as a fallback.
    await option.click({ timeout: 5000 }).catch(() => option.click({ force: true }));
    const closed = await options
      .first()
      .waitFor({ state: "hidden", timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    if (!closed) {
      // The selection did not register — pick the option once more.
      await option.click({ timeout: 5000 }).catch(() => option.click({ force: true }));
      await options.first().waitFor({ state: "hidden", timeout: 5000 });
    }
  }

  /**
   * Click an activity's final save button and wait for the save to be persisted
   * (updateLeadActivity OK) and for the activity list to refresh
   * (getleadactivity), which is when the form resets. Replaces a fixed 1s sleep
   * that was too short when the refresh took ~5s, letting the next scenario's
   * input be wiped by the late form reset.
   */
  async _saveActivity(saveButton) {
    const saved = this.page.waitForResponse(
      (r) => r.url().includes("/communication/updateLeadActivity"),
      { timeout: 30000 },
    );
    const refreshed = this.page
      .waitForResponse((r) => r.url().includes("/communication/getleadactivity"), {
        timeout: 30000,
      })
      .catch(() => null);
    await saveButton.click();
    const response = await saved;
    expect(response.ok(), `updateLeadActivity returned HTTP ${response.status()}`).toBeTruthy();
    await refreshed;
  }

  async notePageDetails() {
    const {
      leadBackButon,
      navigateLeadID,
      clickNoteField,
      textAreaField,
      clickReminder,
      datepickerField,
      reminderSaveButton,
      activityVisibilityButton,
      selectActivity,
      submitActivityButton,
      noteSubmitButton,
    } = await webelement.pageElement(this.page);
    /***********  NOTE Page Elements ********************/
    //await leadBackButon.click()
    await navigateLeadID.nth(0).click();

    await this.page.waitForTimeout(300);

    const noteTab = this.page
      .locator(
        '//div[contains(@class,"overflow-x-auto")]//div[contains(text(),"Note") or contains(.,"Note")]',
      )
      .first();
    if (await noteTab.isVisible().catch(() => false)) {
      await noteTab.click();
    } else {
      await clickNoteField.nth(0).click();
    }
    await this.page.waitForTimeout(500);

    const rendontext = "Enquiry Form Note ";
    const noteText = `${rendontext}Successfully [${Date.now().toString().slice(-4)}]`;
    await this._fillActivityTextarea(textAreaField, noteText);
    await clickReminder.click();

    const dateTime = getRandomDateTimeFormatted();
    await datepickerField.fill(dateTime); // Example: "02/09/2026, 12:00 AM"
    await expect(datepickerField).toHaveValue(dateTime);
    await reminderSaveButton.click();
    await activityVisibilityButton.click();
    await selectActivity.nth(1).click();
    await submitActivityButton.nth(0).click();
    await this._saveActivity(noteSubmitButton);
  }
  async tellCallDetails() {
    const {
      clickTelecallField,
      telecallTextArea,
      edittelecallDatepicker,
      telecallTypeDropDown,
      telecallSubType,
      mobileTypes,
      mobileSubTypes,
      activityVisibility,
      selectActivitysub,
      submitActivity,
      telecallReminderButton,
      telecallDataPickerField,
      reminderDateSubmitButton,
      telecallSaveButton,
    } = webelement.pageElement(this.page);

    // ---- 1. Define the 7 scenarios as data (indices map to .nth()) ----
    const scenarios = [
      {
        mobileSubType: 1,
        telecallType: 1,
        visibility: 1,
        label: "Incoming - Phone - Stock Provider",
      },
      {
        mobileSubType: 2,
        telecallType: 1,
        visibility: 0,
        label: "Incoming - WhatsApp - Private",
      },
      {
        mobileSubType: 1,
        telecallType: 1,
        visibility: 0,
        label: "Incoming - WhatsApp - Private (dup case)",
      },
      {
        mobileSubType: 1,
        telecallType: 3,
        visibility: 0,
        label: "Incoming - Others - Private",
      },
      {
        mobileSubType: 1,
        telecallType: 1,
        visibility: 0,
        label: "Outgoing - Phone - Private",
      },
      {
        mobileSubType: 2,
        telecallType: 1,
        visibility: 0,
        label: "Outgoing - WhatsApp - Private",
      },
      {
        mobileSubType: 1,
        telecallType: 3,
        visibility: 0,
        label: "Outgoing - Others - Private",
      },
    ];

    await this.page.waitForTimeout(300);

    // ---- 2. One loop drives all scenarios through the same steps ----
    for (const [index, scenario] of scenarios.entries()) {
      await test.step(`TeleCall Scenario ${index + 1}: ${scenario.label}`, async () => {
        const telecallTab = this.page
          .locator(
            '//div[contains(@class,"overflow-x-auto")]//div[contains(text(),"Tele Call") or contains(.,"Tele Call")]',
          )
          .first();
        if (await telecallTab.isVisible().catch(() => false)) {
          await telecallTab.click();
        } else {
          await clickTelecallField.nth(1).click();
        }
        await this.page.waitForTimeout(500);

        const telecallText = `Enquiry from TeleCall successfully - ${scenario.label} [${Date.now().toString().slice(-4)}]`;
        await telecallTextArea.scrollIntoViewIfNeeded().catch(() => {});
        await this._fillActivityTextarea(telecallTextArea, telecallText);

        const date = getCurrentDateFormatted();
        await edittelecallDatepicker.fill(date);
        await expect(edittelecallDatepicker).toHaveValue(date);

        await this._pickMenuOption(telecallTypeDropDown.nth(3), telecallSubType, scenario.telecallType);

        await this._pickMenuOption(mobileTypes.nth(2), mobileSubTypes, scenario.mobileSubType);

        await activityVisibility.click();
        await this.page.waitForTimeout(300);
        await selectActivitysub.nth(scenario.visibility).click({ force: true });
        await this.page.waitForTimeout(300);

        await submitActivity.nth(0).click();
        await this.page.waitForTimeout(500);
        await telecallReminderButton.click();
        await this.page.waitForTimeout(300);

        const date1 = getCurrentDateTimeFormatted();
        await telecallDataPickerField.fill(date1);
        await expect(telecallDataPickerField).toHaveValue(date1);

        await reminderDateSubmitButton.click();
        await this.page.waitForTimeout(500);
        await this._saveActivity(telecallSaveButton);
      });
    }
  }
  async videoCallDetails() {
    const {
      clickvideocallfield,
      videoCalltextArea,
      editVideocallDatepicker,
      videocallType,
      videocallSubType,
      videcallMobileType,
      videocallMobileSubType,
      videoActivityVisibility,
      videoActivitySubType,
      videoActivitySubmitButton,
      videoReminder,
      videoReminderdateField,
      reminderDateSubmitbutton,
      videocallSaveButton,
    } = webelement.pageElement(this.page);

    // ---- Define all scenarios as data ----
    const scenarios = [
      {
        mobileSubType: 1,
        videocallType: 1,
        visibility: 1,
        label: "Incoming - Phone - Stock Provider",
      },
      {
        mobileSubType: 1,
        videocallType: 2,
        visibility: 0,
        label: "Incoming - WhatsApp - Private",
      },
      {
        mobileSubType: 1,
        videocallType: 2,
        visibility: 0,
        label: "Incoming - WhatsApp - Private (dup)",
      },
      {
        mobileSubType: 1,
        videocallType: 3,
        visibility: 0,
        label: "Incoming - Others - Private",
      },
      {
        mobileSubType: 2,
        videocallType: 1,
        visibility: 0,
        label: "Outgoing - Phone - Private",
      },
      {
        mobileSubType: 2,
        videocallType: 2,
        visibility: 0,
        label: "Outgoing - WhatsApp - Private",
      },
      {
        mobileSubType: 2,
        videocallType: 3,
        visibility: 0,
        label: "Outgoing - Others - Private",
      },
      {
        mobileSubType: 2,
        videocallType: 4,
        visibility: 0,
        label: "Outgoing - Gmeet - Private",
      },
      {
        mobileSubType: 2,
        videocallType: 5,
        visibility: 0,
        label: "Outgoing - Zoom - Private",
      },
      {
        mobileSubType: 1,
        videocallType: 4,
        visibility: 0,
        label: "Incoming - Gmeet - Private",
      },
      {
        mobileSubType: 1,
        videocallType: 5,
        visibility: 0,
        label: "Incoming - Zoom - Private",
      },
    ];

    await this.page.waitForTimeout(300);

    // ---- One loop drives every scenario through the same steps ----
    for (const [index, scenario] of scenarios.entries()) {
      await test.step(`VideoCall Scenario ${index + 1}: ${scenario.label}`, async () => {
        const videocallTab = this.page
          .locator(
            '//div[contains(@class,"overflow-x-auto")]//div[contains(text(),"Video Call") or contains(.,"Video Call")]',
          )
          .first();
        if (await videocallTab.isVisible().catch(() => false)) {
          await videocallTab.click();
        } else {
          await clickvideocallfield.nth(2).click();
        }
        await this.page.waitForTimeout(500);

        const videoText = `Enquiry from VideoCall successfully - ${scenario.label} [${Date.now().toString().slice(-4)}]`;
        await videoCalltextArea.scrollIntoViewIfNeeded().catch(() => {});
        await this._fillActivityTextarea(videoCalltextArea, videoText);

        const date = getCurrentDateFormatted();
        await editVideocallDatepicker.fill(date);
        await expect(editVideocallDatepicker).toHaveValue(date);
        await this._pickMenuOption(videocallType.nth(3), videocallSubType, scenario.videocallType);

        await this._pickMenuOption(videcallMobileType.nth(2), videocallMobileSubType, scenario.mobileSubType);

        await videoActivityVisibility.click();
        await this.page.waitForTimeout(300);
        await videoActivitySubType.nth(scenario.visibility).click({ force: true });
        await this.page.waitForTimeout(300);

        await videoActivitySubmitButton.nth(0).click();
        await this.page.waitForTimeout(500);
        await videoReminder.click();
        await this.page.waitForTimeout(300);

        const date1 = getCurrentDateTimeFormatted();
        await videoReminderdateField.fill(date1);
        await expect(videoReminderdateField).toHaveValue(date1);

        await reminderDateSubmitbutton.click();
        await this.page.waitForTimeout(500);
        await this._saveActivity(videocallSaveButton);
      });
    }
  }
  async mailDetails() {
    const {
      clickMailField,
      mailTextArea,
      editMailDatepicker,
      mailType,
      mailSubType,
      mailActivityVisibility,
      mailActivitySubType,
      mailActivitySubmitButton,
      maillReminderButton,
      mailRemindDatePicker,
      maillReminderSaveButton,
      mailSaveButton,
    } = webelement.pageElement(this.page);

    const scenarios = [
      { mailSubType: 1, visibility: 0, label: "Phone - Stock Provider" },
      {
        mailSubType: 2,
        visibility: 1,
        label: "Phone - Stock Provider (Outgoing variant)",
      },
    ];
    await this.page.waitForTimeout(300);

    // ---- One loop drives every scenario through the same steps ----
    for (const [index, scenario] of scenarios.entries()) {
      await test.step(`Mail Scenario ${index + 1}: ${scenario.label}`, async () => {
        const mailTab = this.page
          .locator(
            '//div[contains(@class,"overflow-x-auto")]//div[contains(text(),"Mail") or contains(.,"Mail")]',
          )
          .first();
        if (await mailTab.isVisible().catch(() => false)) {
          await mailTab.click();
        } else {
          await clickMailField.nth(3).click();
        }
        await this.page.waitForTimeout(500);

        const mailText = `Enquiry from Mail successfully - ${scenario.label} [${Date.now().toString().slice(-4)}]`;
        await mailTextArea.scrollIntoViewIfNeeded().catch(() => {});
        await this._fillActivityTextarea(mailTextArea, mailText);

        const date = getCurrentDateFormatted();
        await editMailDatepicker.fill(date);
        await expect(editMailDatepicker).toHaveValue(date);
        await this._pickMenuOption(mailType.nth(2), mailSubType, scenario.mailSubType);

        await mailActivityVisibility.click();
        await this.page.waitForTimeout(300);
        await mailActivitySubType.nth(scenario.visibility).click({ force: true });
        await this.page.waitForTimeout(300);

        await mailActivitySubmitButton.nth(0).click();
        await this.page.waitForTimeout(500);
        await maillReminderButton.click();
        await this.page.waitForTimeout(300);

        const date1 = getCurrentDateTimeFormatted();
        await mailRemindDatePicker.fill(date1);
        await expect(mailRemindDatePicker).toHaveValue(date1);

        await maillReminderSaveButton.click();
        await this.page.waitForTimeout(500);
        await this._saveActivity(mailSaveButton);
      });
    }
  }
  async messageDetails() {
    const {
      clickMessageField,
      messageTextArea,
      editMessageDatepicker,
      messageType,
      messageSubType,
      messageMobileType,
      messageSubMobileType,
      messageActivityVisibility,
      messageActivitySubType,
      messageActivitySubmitButton,
      messageRemindeButton,
      messageReminDate,
      messageSaveButton,
      messageReminderSubmitButton,
    } = webelement.pageElement(this.page);

    const scenarios = [
      {
        messageType: 2,
        mobileSubType: 1,
        visibility: 1,
        label: "Incoming - Phone - Stock Provider",
      },
      {
        messageType: 1,
        mobileSubType: 1,
        visibility: 0,
        label: "Incoming - WhatsApp - Private",
      },
      {
        messageType: 1,
        mobileSubType: 1,
        visibility: 0,
        label: "Incoming - WhatsApp - Private (dup)",
      },
      {
        messageType: 3,
        mobileSubType: 1,
        visibility: 0,
        label: "Incoming - Others - Private",
      },
      {
        messageType: 2,
        mobileSubType: 2,
        visibility: 0,
        label: "Outgoing - Phone - Private",
      },
      {
        messageType: 1,
        mobileSubType: 2,
        visibility: 0,
        label: "Outgoing - WhatsApp - Private",
      },
      {
        messageType: 3,
        mobileSubType: 2,
        visibility: 0,
        label: "Outgoing - Others - Private",
      },
    ];

    for (const [index, scenario] of scenarios.entries()) {
      await test.step(`Message Scenario ${index + 1}: ${scenario.label}`, async () => {
        const messageTab = this.page
          .locator(
            '//div[contains(@class,"overflow-x-auto")]//div[contains(text(),"Message") or contains(.,"Message")]',
          )
          .first();
        if (await messageTab.isVisible().catch(() => false)) {
          await messageTab.click();
        } else {
          await clickMessageField.nth(4).click();
        }
        await this.page.waitForTimeout(500);

        const msgText = `Enquiry from Message successfully - ${scenario.label} [${Date.now().toString().slice(-4)}]`;
        await messageTextArea.scrollIntoViewIfNeeded().catch(() => {});
        await this._fillActivityTextarea(messageTextArea, msgText);

        const date = getCurrentDateFormatted();
        await editMessageDatepicker.fill(date);
        await expect(editMessageDatepicker).toHaveValue(date);

        await this._pickMenuOption(messageType.nth(2), messageSubType, scenario.messageType);

        await this._pickMenuOption(messageMobileType.nth(3), messageSubMobileType, scenario.mobileSubType);

        await messageActivityVisibility.click();
        await this.page.waitForTimeout(300);
        await messageActivitySubType.nth(scenario.visibility).click({ force: true });
        await this.page.waitForTimeout(300);

        await messageActivitySubmitButton.nth(0).click();
        await this.page.waitForTimeout(500);

        // Wait for the reminder button itself to be actionable, not just present
        await messageRemindeButton.waitFor({ state: "visible" });
        await messageRemindeButton.click({ trial: false });
        await this.page.waitForTimeout(300);

        const formattedDate1 = getCurrentDateTimeFormatted();
        await messageReminDate.fill(formattedDate1);
        await expect(messageReminDate).toHaveValue(formattedDate1);

        await messageSaveButton.click();
        await this.page.waitForTimeout(500);
        await this._saveActivity(messageReminderSubmitButton);
      });
    }
  }
  async directMessageDetails() {
    const {
      clickDirectMetting,
      directTextArea,
      directReminderButton,
      directReminDate,
      directReminderSaveButton,
      directReminderSubmitButton,
      directActivityVisibility,
      directActivitySubType,
      directActivitySubmitButton,
      clickUpcommingremainder,
      editUpcommingremainder,
      editUpcomeReminderTextArea,
      remineActivityVisibility,
      upremineSelectActivity,
      upremineSubmitButton,
      upremineSaveButton,
      closeUpCommingReminder,
    } = webelement.pageElement(this.page);

    // 1. Click the Direct Meeting tab
    const directMeetingTab = this.page
      .locator(
        '//div[contains(@class,"overflow-x-auto")]//div[contains(text(),"Direct") or contains(.,"Direct")]',
      )
      .or(this.page.getByText("Direct Meeting", { exact: false }))
      .first();

    await directMeetingTab.scrollIntoViewIfNeeded().catch(() => {});
    if (await directMeetingTab.isVisible().catch(() => false)) {
      await directMeetingTab.click();
    } else {
      await clickDirectMetting.nth(5).click();
    }
    await this.page.waitForTimeout(500);

    // 2. Enter the text
    const meetingText = `Enquiry from DirectMeeting successfully [${Date.now().toString().slice(-4)}]`;
    await directTextArea.scrollIntoViewIfNeeded().catch(() => {});
    await this._fillActivityTextarea(directTextArea, meetingText);

    // 3. Click directReminderButton
    await directReminderButton.click();

    // 4. Select random date
    const dateTime = getRandomDateTime();
    await directReminDate.fill(dateTime); // e.g., "02/09/2026, 12:00 AM"
    await expect(directReminDate).toHaveValue(dateTime);

    // 5. Click the directReminderSaveButton
    await directReminderSaveButton.click();
    await this.page.waitForTimeout(300);

    // 6. Click directActivityVisibility
    await directActivityVisibility.click();
    await this.page.waitForTimeout(300);

    // 7. Select directActivitySubType
    await directActivitySubType.nth(0).click({ force: true });
    await this.page.waitForTimeout(300);

    // 8. Click the directActivitySubmitButton
    await directActivitySubmitButton.click();
    await this.page.waitForTimeout(300);

    // 9. Click directReminderSubmitButton
    await this._saveActivity(directReminderSubmitButton);
    // await clickUpcommingremainder.click();
    // await editUpcommingremainder.nth(0).click();
    // await editUpcomeReminderTextArea.nth(0).fill("intersted");
    // await remineActivityVisibility.nth(1).click();
    // await upremineSelectActivity.nth(1).click();
    // await upremineSubmitButton.nth(0).click();
    // await upremineSaveButton.nth(1).click();
    // await closeUpCommingReminder.click();
  }
  async addInterstedStock() {
    const {
      clickInterstedStock,
      addInterestStock,
      selectInsterestStocks,
      addInterstedStockButton,
      addNewInterestStock,
      clickFilterTag,
      projectNameField,
      projectNameTextArea,
      companyNameField,
      companyNametextArea,
      projectLocationField,
      projectLocationTextArea,
      projectCategoryField,
      ProjectSaleType,
      projectCategory,
      projectType,
      projectTypes,
      unitTypeField,
      ownedUnit,
      sharedUnit,
      acceptGrantButon,
      selectunitType,
      bedRoomField,
      selectBhk,
      facingField,
      selectFacing,
      areaField,
      minimumRange,
      maximumRange,
      priceField,
      minimumPrice,
      maximumPrice,
      AmenitiesField,
      convenienceField,
      environmentField,
      leisureField,
      safetyField,
      sportsField,
      neighbourhoodsField,
      selectNeighbourhoodsField,
      statusField,
      selectstatusField,
      acceptButton,
      grantSendButton,
      bookAUnitButton,
      SelectUnitRadioBuuton,
      bookingButton,
      SelectUnit,
      book1Unit,
      bookingAmountButton,
      paymentdate,
      confirmBookingButton,
    } = webelement.pageElement(this.page);

    await this.page.waitForTimeout(300);

    // 1. Click Interested Stock tab
    await clickInterstedStock.waitFor({ state: "visible" });
    await clickInterstedStock.click();
    console.log("Clicked: INTERESTED STOCK tab");
    await this.page.waitForTimeout(500);

    // 2. Click Add New Interested Stock / Add Interested Stock
    if (await addNewInterestStock.count() > 0 && await addNewInterestStock.isVisible()) {
      await addNewInterestStock.click();
      console.log("Clicked: Add new interest button");
    } else {
      await addInterestStock.waitFor({ state: "visible" });
      await addInterestStock.click();
      console.log("Clicked: Add Interested Stock button");
    }
    await this.page.waitForTimeout(500);

    // 3. Open Filter
    await clickFilterTag.waitFor({ state: "visible" });
    await clickFilterTag.click();
    console.log("Clicked: Open Filter");
    await this.page.waitForTimeout(300);

    // 4. Apply required filter (Unit Type - Owned / Shared)
    await unitTypeField.waitFor({ state: "visible" });
    await unitTypeField.click();
    await this.page.waitForTimeout(300);

    let isSharedUnitSelected = false;
    const ownedUnitCount = await ownedUnit.count();
    const sharedUnitCount = await sharedUnit.count();

    if (ownedUnitCount > 0 && await ownedUnit.isVisible()) {
      await ownedUnit.click();
      console.log("Selected Filter: Owned Unit");
      isSharedUnitSelected = false;
    } else if (sharedUnitCount > 0 && await sharedUnit.isVisible()) {
      await sharedUnit.click();
      console.log("Selected Filter: Shared Unit");
      isSharedUnitSelected = true;
    }

    await acceptButton.waitFor({ state: "visible" });
    await acceptButton.click();
    console.log("Clicked: Accept Filter");
    await this.page.waitForTimeout(500);

    // 5. Select Stock
    await selectInsterestStocks.nth(0).waitFor({ state: "visible" });
    await selectInsterestStocks.nth(0).click();
    console.log("Selected: First stock item");

    // 6. Click Add Interested Stock
    await addInterstedStockButton.waitFor({ state: "visible" });
    await addInterstedStockButton.click();
    console.log("Clicked: Add Interested Stock confirmation button");
    await this.page.waitForTimeout(1000);

    // If Shared Unit was selected, handle grant button if present
    if (isSharedUnitSelected) {
      const grantButtonCount = await acceptGrantButon.count();
      if (grantButtonCount > 0 && await acceptGrantButon.isVisible()) {
        await acceptGrantButon.click();
        if (await grantSendButton.count() > 0 && await grantSendButton.isVisible()) {
          await grantSendButton.click();
        }
        console.log("Accepted grant button for Shared Unit");
        await this.page.waitForTimeout(500);
      }
    }

    // 7. Stock appears under Interested Stock -> Click Book
    // Select unit radio or unit card if visible
    if (await SelectUnitRadioBuuton.count() > 0 && await SelectUnitRadioBuuton.first().isVisible()) {
      await SelectUnitRadioBuuton.first().check();
      console.log("Selected: Unit radio button");
      await this.page.waitForTimeout(300);
    } else if (await SelectUnit.count() > 0 && await SelectUnit.first().isVisible()) {
      await SelectUnit.first().click();
      console.log("Selected: Unit card");
      await this.page.waitForTimeout(300);
    }

    // Click Book / Book a Unit button
    const bookUnitBtn = this.page.locator("//button[normalize-space()='Book a Unit'] | //button[normalize-space()='Book']");
    if (await bookingButton.count() > 0 && await bookingButton.first().isVisible()) {
      await bookingButton.first().click();
      console.log("Clicked: Book a Unit");
      await this.page.waitForTimeout(500);
    } else if (await bookUnitBtn.count() > 0 && await bookUnitBtn.first().isVisible()) {
      await bookUnitBtn.first().click();
      console.log("Clicked: Book button");
      await this.page.waitForTimeout(500);
    } else if (await book1Unit.count() > 0 && await book1Unit.first().isVisible()) {
      await book1Unit.first().click();
      console.log("Clicked: Book 1 Unit button");
      await this.page.waitForTimeout(500);
    }

    // If unit selection radio appears after clicking Book a Unit, select unit and click Book 1 Unit
    if (await SelectUnitRadioBuuton.count() > 0 && await SelectUnitRadioBuuton.first().isVisible()) {
      await SelectUnitRadioBuuton.first().check();
      console.log("Selected: Unit radio button in modal");
      await this.page.waitForTimeout(300);
      if (await book1Unit.count() > 0 && await book1Unit.first().isVisible()) {
        await book1Unit.first().click();
        console.log("Clicked: Book 1 Unit button");
        await this.page.waitForTimeout(500);
      }
    }

    // 8. Enter Payment Amount
    await bookingAmountButton.waitFor({ state: "visible" });
    await bookingAmountButton.fill("10000");
    console.log("Entered payment amount: 10000");
    await this.page.waitForTimeout(300);

    // 9. Enter Payment Date
    const todayDate = getCurrentDateFormatted();
    await paymentdate.waitFor({ state: "visible" });
    await paymentdate.fill(todayDate);
    console.log(`Entered payment date: ${todayDate}`);
    await this.page.waitForTimeout(300);

    // 10. Click Confirm
    await confirmBookingButton.waitFor({ state: "visible" });
    await confirmBookingButton.click();
    console.log("Clicked: Confirm Booking");

    // 11. Unit gets booked & Booking tab automatically opens
    // 12. Verify Booking tab / booked unit
    await this.page.waitForTimeout(2000);
    await expect(bookAUnitButton).toBeVisible();
    console.log("Verified: Booking tab automatically opened and is visible");
  }
}

module.exports = { LeadActivites };
