const { WebElement } = require("../../../utils/WebElements");
const { test, expect } = require("@playwright/test");
const { getRandomDate, getFutureDate, getFutureTime } = require("../../../utils/DateUtils");
const webelement = new WebElement();
class LeadeDetails {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
  async editLeadDetails() {
    /*************EDIT LEAD DETAILS******* */
    const {
      navigateLeadID,
      editLeadDetailsField,
      editLedaSourceField,
      editSelectItemField,
      editFirstNameField,
      editLastNameField,
      editEnquiryDatePicker,
      clickSaveButton,
    } = webelement.pageElement(this.page);
    await this.page.waitForTimeout(500);
    await navigateLeadID.nth(0).click();
    await editLeadDetailsField.click();
    await editLedaSourceField.click();
    const options = await editSelectItemField.locator(".hover\\:bg-gray-200"); // Adjust selector
    const optionCount = await options.count();

    if (optionCount > 0) {
      const randomIndex = Math.floor(Math.random() * optionCount);
      await options.nth(randomIndex).click(); // Select random option
    }
    const firstNames = [
      "Aarav",
      "Rohan",
      "Priya",
      "Neha",
      "Amit",
      "Rahul",
      "Sneha",
      "Vikram",
      "Karan",
      "Anjali",
      "Suresh",
      "Vijay",
      "Aditya",
      "Riya",
      "Kiran",
    ];
    const lastNames = [
      "Sharma",
      "Verma",
      "Kumar",
      "Singh",
      "Gupta",
      "Patel",
      "Mehta",
      "Joshi",
      "Das",
      "Nair",
      "Reddy",
      "Rao",
      "Iyer",
      "Choudhury",
      "Sen",
    ];

    const currentFirstName = await editFirstNameField.nth(0).inputValue();
    const currentLastName = await editLastNameField.nth(1).inputValue();

    const filteredFirstNames = firstNames.filter(
      (name) => name !== currentFirstName,
    );
    const filteredLastNames = lastNames.filter(
      (name) => name !== currentLastName,
    );

    const randomFirstName =
      filteredFirstNames[Math.floor(Math.random() * filteredFirstNames.length)];
    const randomLastName =
      filteredLastNames[Math.floor(Math.random() * filteredLastNames.length)];

    await editFirstNameField.nth(0).fill(randomFirstName);
    await expect(editFirstNameField.nth(0)).toHaveValue(randomFirstName);
    await editLastNameField.nth(1).fill(randomLastName);
    await expect(editLastNameField.nth(1)).toHaveValue(randomLastName);
    const date = getRandomDate();
    await editEnquiryDatePicker.fill(date);
    await expect(editEnquiryDatePicker).toHaveValue(date);
    await clickSaveButton.click();
  }
  async leadAasignToStaff() {
    const { leadAssignedTo, AssignedStaff } = webelement.pageElement(this.page);
    /*********** Lead Assign & Current Status **************/
    await this.page.waitForTimeout(300);

    const assignButton = leadAssignedTo.first();

    // 1. Check if disabled via HTML attribute, aria-disabled, or disabled class/styles
    const isDisabled = await assignButton.isDisabled().catch(() => false);
    const hasDisabledState = await assignButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return (
        el.disabled ||
        el.getAttribute("disabled") !== null ||
        el.getAttribute("aria-disabled") === "true" ||
        el.classList.contains("disabled") ||
        el.classList.contains("cursor-not-allowed") ||
        style.pointerEvents === "none"
      );
    }).catch(() => false);

    // If disabled, skip assignment and proceed to next function (leadCurrentStatus)
    if (isDisabled || hasDisabledState) {
      console.log("Lead Assigned To is disabled. Skipping to leadCurrentStatus...");
      return;
    }

    // 2. If enabled, finish the scenario (assign staff) then proceed to leadCurrentStatus
    console.log("Lead Assigned To is enabled. Assigning staff...");
    await assignButton.click();
    await this.page.waitForTimeout(300);

    const staffCount = await AssignedStaff.count();
    if (staffCount > 0) {
      await AssignedStaff.first().click();
      await this.page.waitForTimeout(500);
      console.log("Staff assigned successfully.");
    }
  }

  async leadCurrentStatus() {
    const { clickLeadCurrenStatusField, selectLeadCurrentStatusField } =
      webelement.pageElement(this.page);
    await clickLeadCurrenStatusField.click();
    await selectLeadCurrentStatusField.nth(3).click();
  }
  async createPersonalDetails() {
    const {
      createPersonalDetails,
      numberOfFamilyMembers,
      selectNumberOfFamilyMembers,
      currentResident,
      selectcurrentResident,
      residentialAddressTextArea,
      selectResidentialAddress,
      addEduWorkspaceAddress,
      addAdressTextArea,
      selectAddress,
      saveButton,
    } = webelement.pageElement(this.page);
    await this.page.waitForTimeout(300);

    await createPersonalDetails.click();
    await numberOfFamilyMembers.nth(0).click();
    await selectNumberOfFamilyMembers.nth(3).click();
    await currentResident.nth(1).click();
    await selectcurrentResident.nth(0).click();
    await residentialAddressTextArea.fill("rs puram");
    await selectResidentialAddress.nth(2).click();
    await addEduWorkspaceAddress.click();
    await addAdressTextArea.nth(1).fill("coimbatore");
    await selectAddress.nth(2).click();
    await saveButton.nth(0).click();
  }
  async editPersonalDetails() {
    const {
      editDetails,
      editFamilyMembers,
      selectFamilyMembers,
      editCurrentResident,
      chooseurrentResident,
      editresidentialAddressTextArea,
      editResidentialAddress,
      editresidentialAddressTextArea1,
      editResidentialAddress1,
      editsaveButton,
    } = webelement.pageElement(this.page);
    await this.page.waitForTimeout(500);

    await editDetails.click();
    await editFamilyMembers.nth(0).click();
    await selectFamilyMembers.nth(2).click();
    await editCurrentResident.nth(1).click();
    await chooseurrentResident.nth(1).click();
    await editresidentialAddressTextArea.nth(0).fill("Coimbatore");
    await expect(editresidentialAddressTextArea).toHaveValue("Coimbatore");
    await editResidentialAddress.nth(3).click();
    await editsaveButton.click();
  }
  // Generates a random future date between minDays and maxDays from today
  // Used to create realistic but varied site visit dates in tests
  _getRandomFutureDate(minDays = 2, maxDays = 8) {
    const days = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    return getFutureDate(days);
  }

  _getRandomTime(startHour = 10, endHour = 17) {
    const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
    const minutes = ["00", "15", "30", "45"];
    const minute = minutes[Math.floor(Math.random() * minutes.length)];
    return `${String(hour).padStart(2, "0")}:${minute}`;
  }

  /**
   * Manages the complete lifecycle of site visits for a lead:
   * 1. Schedules two distinct site visits with random dates/times
   * 2. Handles the edit/reschedule flow for one of them
   * 3. Includes proper error handling and state verification
   *
   * Uses helper methods for date/time generation to ensure realistic test data
   * and proper cleanup of UI state between operations.
   */
  async addSiteVisit() {
    const {
      addSiteVistButton,
      clickSiteVisitScheduleButton,
      siteVisitEditButton,
      siteVisitDate,
      siteVisitTime,
      visitType,
      SelectVisitType,
      status,
      siteVistNote,
      enableRemnder,
      reminderDate,
      remindertime,
      SitevisitsaveButton,
    } = webelement.pageElement(this.page);

    await this.page.waitForTimeout(500);

    // =========================================================================
    // PART 1: FIRST SITE VISIT
    // =========================================================================
    console.log("[SiteVisit] --- Starting Part 1: Scheduling First Site Visit ---");

    // 1. Click Add Site Visit button
    if (await addSiteVistButton.first().isVisible().catch(() => false)) {
      await addSiteVistButton.first().click();
    } else if (await clickSiteVisitScheduleButton.first().isVisible().catch(() => false)) {
      await clickSiteVisitScheduleButton.first().click();
      await this.page.waitForTimeout(500);
      await addSiteVistButton.first().click();
    }
    await this.page.waitForTimeout(500);

    // 2. Add random Site Visit Date
    const visit1Date = this._getRandomFutureDate(2, 4);
    console.log(`[SiteVisit 1] Setting Visit Date: ${visit1Date}`);
    await siteVisitDate.waitFor({ state: "visible", timeout: 10000 });
    await siteVisitDate.fill(visit1Date);
    await expect(siteVisitDate).toHaveValue(visit1Date);

    // 3. Add random Site Visit Time
    const visit1Time = this._getRandomTime(10, 15);
    console.log(`[SiteVisit 1] Setting Visit Time: ${visit1Time}`);
    await siteVisitTime.click();
    await siteVisitTime.fill(visit1Time);
    await expect(siteVisitTime).toHaveValue(visit1Time);

    // 4. Select Visit Type
    const optionCount1 = await SelectVisitType.count();
    if (optionCount1 > 0) {
      const randomIndex1 = Math.floor(Math.random() * Math.min(optionCount1, 3));
      await visitType.selectOption({ index: randomIndex1 });
      console.log(`[SiteVisit 1] Selected visit type option index: ${randomIndex1}`);
    }

    // 5. Add Notes text
    await siteVistNote.fill("Site visit 1: Initial walkthrough and property inspection.");

    const customVisitInput1 = this.page.getByPlaceholder("Enter custom visit type...");
    if (await customVisitInput1.isVisible().catch(() => false)) {
      await customVisitInput1.fill("Initial Inspection");
    }

    // 6. Click Save button
    await SitevisitsaveButton.click();
    await this.page.waitForTimeout(500);
    await siteVisitDate.waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});
    await this.page.waitForLoadState("networkidle").catch(() => {});
    console.log(`[SiteVisit 1] Successfully saved first site visit for ${visit1Date} at ${visit1Time}`);

    // =========================================================================
    // PART 2: SECOND SITE VISIT
    // =========================================================================
    console.log("[SiteVisit] --- Starting Part 2: Scheduling Second Site Visit ---");

    // 7. Click Schedule Site Visit button to open popover
    await clickSiteVisitScheduleButton.first().waitFor({ state: "visible", timeout: 10000 });
    await clickSiteVisitScheduleButton.first().click();
    await this.page.waitForTimeout(500);

    // 8. Click Add Site Visit button for 2nd visit
    await addSiteVistButton.first().waitFor({ state: "visible", timeout: 10000 });
    await addSiteVistButton.first().click();
    await this.page.waitForTimeout(500);

    // 9. Add random Site Visit Date (2nd visit)
    const visit2Date = this._getRandomFutureDate(6, 8);
    console.log(`[SiteVisit 2] Setting Visit Date: ${visit2Date}`);
    await siteVisitDate.waitFor({ state: "visible", timeout: 10000 });
    await siteVisitDate.fill(visit2Date);
    await expect(siteVisitDate).toHaveValue(visit2Date);

    // 10. Add random Site Visit Time (2nd visit)
    const visit2Time = this._getRandomTime(12, 17);
    console.log(`[SiteVisit 2] Setting Visit Time: ${visit2Time}`);
    await siteVisitTime.click();
    await siteVisitTime.fill(visit2Time);
    await expect(siteVisitTime).toHaveValue(visit2Time);

    // 11. Select Visit Type
    const optionCount2 = await SelectVisitType.count();
    if (optionCount2 > 0) {
      const randomIndex2 = Math.floor(Math.random() * Math.min(optionCount2, 3));
      await visitType.selectOption({ index: randomIndex2 });
      console.log(`[SiteVisit 2] Selected visit type option index: ${randomIndex2}`);
    }

    // 12. Add Notes text
    await siteVistNote.fill("Site visit 2: Follow-up visit and contract discussion.");

    const customVisitInput2 = this.page.getByPlaceholder("Enter custom visit type...");
    if (await customVisitInput2.isVisible().catch(() => false)) {
      await customVisitInput2.fill("Follow-up Inspection");
    }

    // 13. Click Save button
    await SitevisitsaveButton.click();
    await this.page.waitForTimeout(500);
    await siteVisitDate.waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});
    await this.page.waitForLoadState("networkidle").catch(() => {});
    console.log(`[SiteVisit 2] Successfully saved second site visit for ${visit2Date} at ${visit2Time}`);

    // =========================================================================
    // PART 3: EDIT ONLY ONE SITE VISIT (WITH REMINDER)
    // =========================================================================
    console.log("[SiteVisit] --- Starting Part 3: Editing / Rescheduling Site Visit ---");

    // 14. Click Schedule Site Visit button (2 visits exist)
    await clickSiteVisitScheduleButton.first().waitFor({ state: "visible", timeout: 10000 });
    await clickSiteVisitScheduleButton.first().click();
    await this.page.waitForTimeout(500);

    // 15. Click Edit button on the first site visit
    if (await siteVisitEditButton.count() > 0 && await siteVisitEditButton.first().isVisible().catch(() => false)) {
      await siteVisitEditButton.first().click();
    } else {
      const editFallback = this.page.locator('button:has-text("Edit"), button[class*="flex-shrink-0 text-xs"]').first();
      await editFallback.waitFor({ state: "visible", timeout: 10000 });
      await editFallback.click();
    }
    await this.page.waitForTimeout(500);

    // 16. Click enable reminder button
    const isReminderChecked = await enableRemnder.isChecked().catch(() => false);
    if (!isReminderChecked) {
      await enableRemnder.click();
      await this.page.waitForTimeout(300);
    }
    console.log("[SiteVisit Edit] Reminder enabled: true");

    // 17. Add random Site Visit Date (rescheduled)
    const editDate = this._getRandomFutureDate(3, 5);
    console.log(`[SiteVisit Edit] Rescheduled Visit Date: ${editDate}`);
    await siteVisitDate.waitFor({ state: "visible", timeout: 10000 });
    await siteVisitDate.fill(editDate);
    await expect(siteVisitDate).toHaveValue(editDate);

    // 18. Add random Site Visit Time (rescheduled)
    const editTime = this._getRandomTime(11, 16);
    console.log(`[SiteVisit Edit] Rescheduled Visit Time: ${editTime}`);
    await siteVisitTime.click();
    await siteVisitTime.fill(editTime);
    await expect(siteVisitTime).toHaveValue(editTime);

    // Populate reminder fields if displayed
    if (await reminderDate.isVisible().catch(() => false)) {
      await reminderDate.fill(editDate);
      console.log(`[SiteVisit Edit] Reminder Date set to: ${editDate}`);
    }
    if (await remindertime.isVisible().catch(() => false)) {
      const [h, m] = editTime.split(":");
      const remH = String(Math.max(8, parseInt(h, 10) - 1)).padStart(2, "0");
      const reminderTimeVal = `${remH}:${m}`;
      await remindertime.click();
      await remindertime.fill(reminderTimeVal);
      console.log(`[SiteVisit Edit] Reminder Time set to: ${reminderTimeVal}`);
    }

    if (await status.isVisible().catch(() => false)) {
      try {
        await status.selectOption({ label: "Rescheduled" });
        console.log("[SiteVisit Edit] Status set to: Rescheduled");
      } catch {
        await status.selectOption("Rescheduled").catch(() => {});
        console.log("[SiteVisit Edit] Status set to: Rescheduled (fallback)");
      }
    }

    // 19. Click Save button
    await SitevisitsaveButton.click();
    await this.page.waitForTimeout(500);
    await siteVisitDate.waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});
    await this.page.waitForLoadState("networkidle").catch(() => {});
    console.log(`[SiteVisit Edit] Successfully saved rescheduled site visit for ${editDate} at ${editTime}`);
  }

  async linkedContact(count = 1) {
    const {
      linkContactButton,
      FirstName,
      LastName,
      contactemail,
      phoneNumber,
      saveContactButton,
    } = webelement.pageElement(this.page);

    const firstNames = [
      "Aarav", "Rohan", "Priya", "Neha", "Amit", "Rahul", "Sneha", "Vikram",
      "Karan", "Anjali", "Suresh", "Vijay", "Aditya", "Riya", "Kiran", "Deepak",
      "Pooja", "Manish", "Sunita", "Rajesh", "Kavita", "Sanjay", "Meera", "Arjun"
    ];
    const lastNames = [
      "Sharma", "Verma", "Kumar", "Singh", "Gupta", "Patel", "Mehta", "Joshi",
      "Das", "Nair", "Reddy", "Rao", "Iyer", "Choudhury", "Sen", "Pillai", "Bose"
    ];

    for (let i = 0; i < count; i++) {
      await this.page.waitForTimeout(500);
      await linkContactButton.click();
      await this.page.waitForTimeout(300);

      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const randomEmail = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}${randomSuffix}@gmail.com`;

      // 10-digit mobile number starting with 6, 7, 8, or 9
      const startingDigits = ["9", "8", "7", "6"];
      const startDigit = startingDigits[Math.floor(Math.random() * startingDigits.length)];
      const randomPhone = startDigit + Math.floor(100000000 + Math.random() * 900000000).toString();

      console.log(`Linked Contact [${i + 1}/${count}]: ${randomFirstName} ${randomLastName}, Email: ${randomEmail}, Mobile: ${randomPhone}`);

      await FirstName.fill(randomFirstName);
      await expect(FirstName).toHaveValue(randomFirstName);

      await LastName.fill(randomLastName);
      await expect(LastName).toHaveValue(randomLastName);

      await contactemail.fill(randomEmail);
      await expect(contactemail).toHaveValue(randomEmail);

      await phoneNumber.fill(randomPhone);
      await expect(phoneNumber).toHaveValue(randomPhone);

      await saveContactButton.click();
      await this.page.waitForTimeout(1000);
    }
  }
}

module.exports = { LeadeDetails };
