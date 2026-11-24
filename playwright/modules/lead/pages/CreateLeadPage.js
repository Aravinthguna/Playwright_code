const { WebElement } = require("../../../utils/WebElements");
const { test, expect } = require("@playwright/test");
const { getRandomDate } = require("../../../utils/DateUtils");
const webelement = new WebElement();
 class CreateNewLead {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  async createNewlead({ useOtherSource } = {}) {
    const {
      createNewlead,
      ledaSourceField,
      selectItemField,
      otherSourceField,
      enterSourceName,
      saveOtherSourceName,
      subSourceField,
      firstNameField,
      lastNameField,
      emailAddressField,
      mobilNumberField,
      enquiryDatePicker,
      textArea,
      leadVerification,
      newLeadSaveButton
    } = webelement.pageElement(this.page);

    const otherSource = otherSourceField || this.page.locator('//span[@class="icon-design col-span-1 flex justify-end items-center"]');
    const enterSourceInput = enterSourceName || this.page.locator('//input[@placeholder="Enter Valid Source Name"]');
    const saveOtherSource = saveOtherSourceName || this.page.locator('(//button[normalize-space()="Save"])[1]');

    await this.page.waitForTimeout(500);

    await createNewlead.click();
    await ledaSourceField.click(); // Open dropdown
    await selectItemField.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});

    const dropdownOptions = selectItemField.locator('.hover\\:bg-gray-200');
    const optionCount = await dropdownOptions.count();

    // Select random source from dropdown
    if (optionCount > 0) {
      // Find "Other" option index
      let otherIndex = -1;
      for (let i = 0; i < optionCount; i++) {
        const text = await dropdownOptions.nth(i).innerText().catch(() => "");
        if (text.trim().toLowerCase() === "other") {
          otherIndex = i;
          break;
        }
      }

      // If user specified useOtherSource, or pick randomly across options (or 50/50 chance between Other and existing)
      let selectedIndex;
      if (useOtherSource === true && otherIndex !== -1) {
        selectedIndex = otherIndex;
      } else if (useOtherSource === false) {
        // pick random non-other
        const nonOtherIndices = [];
        for (let i = 0; i < optionCount; i++) {
          if (i !== otherIndex) nonOtherIndices.push(i);
        }
        selectedIndex = nonOtherIndices.length > 0
          ? nonOtherIndices[Math.floor(Math.random() * nonOtherIndices.length)]
          : 0;
      } else {
        // Randomly select any one source
        selectedIndex = Math.floor(Math.random() * optionCount);
      }

      const selectedOption = dropdownOptions.nth(selectedIndex);
      const selectedText = (await selectedOption.innerText().catch(() => "")).trim();
      console.log(`Selected option [${selectedIndex}]: "${selectedText}"`);

      await selectedOption.scrollIntoViewIfNeeded().catch(() => {});
      await selectedOption.click();

      // If the selected option is "Other", fill random source name and click save
      const isOther = selectedText.toLowerCase() === "other" || selectedIndex === otherIndex;
      if (isOther) {
        console.log("Selected 'Other' source! Checking for source input dialog...");
        // In case clicking the row didn't open the input dialog, try otherSource icon
        const isInputVisible = await enterSourceInput.waitFor({ state: "visible", timeout: 2000 }).then(() => true).catch(() => false);
        if (!isInputVisible && (await otherSource.count()) > 0) {
          console.log("Clicking otherSourceField icon to open source input...");
          await otherSource.first().click();
        }

        const sampleSources = ["Facebook", "Instagram", "WhatsApp", "Google Ads", "LinkedIn", "Twitter"];
        const randomSource = sampleSources[Math.floor(Math.random() * sampleSources.length)];
        console.log(`Entering other source name: ${randomSource}`);

        await enterSourceInput.waitFor({ state: "visible", timeout: 4000 });
        await enterSourceInput.fill(randomSource);
        await expect(enterSourceInput).toHaveValue(randomSource);

        await saveOtherSource.click();
        await this.page.waitForTimeout(500);
      }
    } 
    const firstNames = ["Aarav", "Rohan", "Priya", "Neha", "Amit", "Rahul", "Sneha", "Vikram", "Karan", "Anjali", "Suresh", "Vijay", "Aditya", "Riya", "Kiran"];
    const lastNames = ["Sharma", "Verma", "Kumar", "Singh", "Gupta", "Patel", "Mehta", "Joshi", "Das", "Nair", "Reddy", "Rao", "Iyer", "Choudhury", "Sen"];
    const enquiryMessages = [
      "Interested in purchasing a residential property. Please share the brochure and pricing details.",
      "Looking for a 2 BHK or 3 BHK apartment in this project. Please schedule a callback.",
      "Requesting information about available plots and financing options.",
      "I would like to schedule a site visit for this project. Please contact me soon.",
      "Interested in the commercial spaces in this project. Please share details."
    ];

    const randomName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomEmail = `${randomName.toLowerCase()}.${randomLastName.toLowerCase()}${Math.floor(Math.random() * 900) + 100}@gmail.com`;
    const randomMobile = "9" + Math.floor(100000000 + Math.random() * 900000000).toString();
    const randomText = enquiryMessages[Math.floor(Math.random() * enquiryMessages.length)];

    console.log(`Lead details: Name: ${randomName} ${randomLastName}, Email: ${randomEmail}, Mobile: ${randomMobile}`);

    await firstNameField.fill(randomName);
    await expect(firstNameField).toHaveValue(randomName);

    await lastNameField.fill(randomLastName);
    await expect(lastNameField).toHaveValue(randomLastName);

    await emailAddressField.fill(randomEmail);
    await expect(emailAddressField).toHaveValue(randomEmail);

    await mobilNumberField.fill(randomMobile);
    await expect(mobilNumberField).toHaveValue(randomMobile);
    
    const randomDate = getRandomDate();
    console.log(`Enquiry Date: ${randomDate}`);

    await enquiryDatePicker.fill(randomDate);
    await expect(enquiryDatePicker).toHaveValue(randomDate);
    await leadVerification.nth(1).click(); 
    await textArea.fill(randomText);
    // Wait for the Create Lead API POST response to complete before reloading
    const responsePromise = this.page.waitForResponse(
      (res) =>
        (res.url().includes("createLead") || res.url().includes("leadentry/create") || res.url().includes("lead")) &&
        res.request().method() === "POST" &&
        (res.status() === 200 || res.status() === 201),
      { timeout: 15000 }
    );

    await newLeadSaveButton.click();
    const response = await responsePromise;

    if (response) {
      console.log(`✅ Create Lead API Completed: Status ${response.status()} [${response.url()}]`);
      const responseData = await response.json().catch(() => null);
      console.log("API Response Body:", JSON.stringify(responseData, null, 2));
    }

    // Capture screenshot of UI after lead creation API completes
    await this.page.screenshot({ path: "test-results/lead_created_api.png", fullPage: true });

    // Reload page to reflect newly created lead
    await this.page.reload();
  }
  // async pom() {
  //   await this.createNewlead();
    
  // }
}
module.exports = { CreateNewLead };
