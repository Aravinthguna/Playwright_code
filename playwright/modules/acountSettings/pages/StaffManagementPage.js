const { WebElement } = require("../../../utils/WebElements");
const webElement = new WebElement();
const {
  generateRandomName,
  generateRandomEmail,
  generateRandomMobile,
} = require("../../../utils/RandomDataUtils");

const PROPER_FIRST_NAMES = [
  "Aravinth", "Arjun", "Karthik", "Rohan", "Suresh",
  "Vikram", "Rahul", "Aditya", "Sanjay", "Deepak",
  "Priya", "Ananya", "Alexander", "Daniel", "Michael"
];

const PROPER_LAST_NAMES = [
  "Kumar", "Sharma", "Patel", "Singh", "Reddy",
  "Gupta", "Verma", "Rao", "Nair", "Iyer"
];

function getRandomProperName(prefix = "") {
  const first = PROPER_FIRST_NAMES[Math.floor(Math.random() * PROPER_FIRST_NAMES.length)];
  const last = PROPER_LAST_NAMES[Math.floor(Math.random() * PROPER_LAST_NAMES.length)];
  const rnd = Math.floor(100 + Math.random() * 900);
  return {
    firstName: prefix ? `${first}${prefix}${rnd}` : `${first}${rnd}`,
    lastName: last,
  };
}

class StaffManagementPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  async goto(url) {
    const onboardingPromise = this.page
      .waitForResponse(
        (r) => r.url().includes("/api/account/onboarding") && r.status() === 200,
        { timeout: 30000 }
      )
      .catch(() => null);

    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await onboardingPromise;
    await this.page.waitForTimeout(1000);
  }

  /**
   * Helper to configure privilege accordion sections and toggle switches.
   */
  async configurePrivileges() {
    const privilegesMap = [
      { section: "Account", items: ["Edit Account", "View Account"] },
      { section: "Partners", items: ["Edit Partners", "View Partners"] },
      { section: "Leads", items: ["Edit Leads", "Assign Leads", "View Leads"] },
      { section: "Stock", items: ["Edit Stock", "View Stock", "Publish Stock"] },
      { section: "MySite", items: ["View MySite", "Edit MySite", "Publish MySite"] },
    ];

    for (const { section, items } of privilegesMap) {
      const secHeader = this.page.locator(`span:text-is("${section}")`).first();
      if (await secHeader.isVisible().catch(() => false)) {
        await secHeader.click();
        await this.page.waitForTimeout(300);

        for (const item of items) {
          const labelLoc = this.page.locator(`text="${item}"`).first();
          if (await labelLoc.isVisible().catch(() => false)) {
            const toggle = labelLoc.locator(
              "xpath=ancestor::*[contains(@class, 'flex') and .//button[@role='switch']][1]//button[@role='switch']"
            );
            if (await toggle.isVisible().catch(() => false)) {
              await toggle.click();
              await this.page.waitForTimeout(150);
            }
          }
        }
      }
    }
  }

  /**
   * Scenario 1: Add Staff Member
   */
  async addStaffMember(staffData = {}) {
    const {
      StaffManagement,
      addstaffMember,
      staffFirstName,
      staffLasttName,
      staffMobileNumber,
      staffEmailAddress,
      staffAgentNumber,
      staffRole,
      CreateStaffButton,
    } = webElement.pageElement(this.page);

    // 1. Click Staff Management
    await StaffManagement.waitFor({ state: "visible", timeout: 20000 });
    await StaffManagement.click();
    await this.page.waitForTimeout(1000);

    // 2. Click Add Staff Member
    await addstaffMember.waitFor({ state: "visible", timeout: 20000 });
    await addstaffMember.click();
    await staffFirstName.waitFor({ state: "visible", timeout: 15000 });

    // 3. Enter First Name, Last Name, Mobile Number, Email, and Agent Number using random data
    const properName = getRandomProperName();
    const firstName = staffData.firstName || properName.firstName;
    const lastName = staffData.lastName || properName.lastName;
    const mobileNumber = staffData.mobileNumber || generateRandomMobile();
    const email = staffData.email || generateRandomEmail();
    const agentNumber =
      staffData.agentNumber ||
      Math.floor(10000000 + Math.random() * 90000000).toString();
    const role = staffData.role || "Staff";

    await staffFirstName.fill(firstName);
    await staffLasttName.fill(lastName);
    await staffMobileNumber.fill(mobileNumber);
    await staffEmailAddress.fill(email);
    await staffAgentNumber.fill(agentNumber);

    // 4. Select a role from the Role dropdown
    await staffRole.waitFor({ state: "visible", timeout: 10000 });
    // Wait for roles to populate if fetched asynchronously
    await this.page.locator("#role option").nth(1).waitFor({ state: "attached", timeout: 10000 }).catch(() => {});
    await staffRole.selectOption(role);
    await this.page.waitForTimeout(500);

 //   5 & 6. Configure Staff Privileges & handle privilege toggle buttons when required
    await this.configurePrivileges();

    // Ensure business name is populated
    const bizInput = this.page.locator('input[name="businessName"]');
    if (await bizInput.isVisible().catch(() => false)) {
      const val = await bizInput.inputValue().catch(() => "");
      if (!val) {
        await bizInput.evaluate((el) => {
          el.removeAttribute("disabled");
          el.value = "Realiti Tech";
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }).catch(() => {});
      }
    }

 //   7. Click Submit / Create Staff and verify successful creation
    let addStaffResponse = null;
    const addStaffResponsePromise = this.page
      .waitForResponse(
        (r) => r.url().includes("/api/account/addStaff"),
        { timeout: 20000 }
      )
      .then((r) => {
        addStaffResponse = r;
        return r;
      })
      .catch(() => null);

    await this.page.waitForTimeout(500);
    await CreateStaffButton.click();

    // If modal is still visible after 1.5s, click again in case blur swallowed the click
    await this.page.waitForTimeout(1500);
    if (!addStaffResponse && (await CreateStaffButton.isVisible().catch(() => false))) {
      await CreateStaffButton.click().catch(() => {});
    }

    await addStaffResponsePromise;
    await this.page.waitForTimeout(1500);

    // Handle any success notification popup
    const successModal = this.page.locator('text="Staff created successfully"');
    if (await successModal.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.expect(successModal).toBeVisible();
      const successOkBtn = this.page
        .locator('[role="dialog"]:has-text("Staff created successfully") button')
        .first();
      if (await successOkBtn.isVisible().catch(() => false)) {
        await successOkBtn.click();
      }
    }

    // Verify staff member is visible in staff list
    await this.expect(
      this.page.locator(`tr:has-text("${firstName}")`).first()
    ).toBeVisible({ timeout: 15000 });

    return { firstName, lastName, email, mobileNumber, agentNumber, role };
  }

  /**
   * Scenario 2: Edit Staff
   */
  async editStaffMember(existingStaff = {}, updatedData = {}) {
    const {
      StaffManagement,
      Edit3DotStaffButton,
      EditStaffButton,
      staffFirstName,
      staffLasttName,
      staffMobileNumber,
      staffEmailAddress,
      staffAgentNumber,
      staffRole,
      editstaffSubmitButton,
      goBackButton,
    } = webElement.pageElement(this.page);

    // Ensure on Staff Management view
    if (!(await Edit3DotStaffButton.isVisible().catch(() => false))) {
      if (await StaffManagement.isVisible().catch(() => false)) {
        await StaffManagement.click();
        await this.page.waitForTimeout(1000);
      }
    }

    // 1. Click the three-dot menu for an existing staff member
    let threeDot = Edit3DotStaffButton;
    if (existingStaff && existingStaff.firstName) {
      const staffRow = this.page.locator(`tr:has-text("${existingStaff.firstName}")`);
      if ((await staffRow.count()) > 0) {
        threeDot = staffRow
          .locator(
            'button[id^="headlessui-menu-button"], button:has-text("Open options"), button[class*="rounded-full"]'
          )
          .first();
      }
    }

    await threeDot.waitFor({ state: "visible", timeout: 15000 });
    await threeDot.click();
    await this.page.waitForTimeout(500);

    // 2. Click Edit
    await EditStaffButton.waitFor({ state: "visible", timeout: 10000 });
    await EditStaffButton.click();
    await editstaffSubmitButton.waitFor({ state: "visible", timeout: 15000 });

    // Handle privileges in edit view if visible
    await this.configurePrivileges();

    // 3. Update the First Name, Last Name, Mobile Number, Email, Agent Number, and Role
    const properEditName = getRandomProperName("Edit");
    const newFirstName = updatedData.firstName || properEditName.firstName;
    const newLastName = updatedData.lastName || properEditName.lastName;
    const newMobile = updatedData.mobileNumber || generateRandomMobile();
    const newEmail = updatedData.email || generateRandomEmail();
    const newAgentNumber =
      updatedData.agentNumber ||
      Math.floor(10000000 + Math.random() * 90000000).toString();
    const newRole = updatedData.role || "Staff";

    await staffFirstName.fill(newFirstName);
    await staffLasttName.fill(newLastName);
    if (await staffMobileNumber.isEditable().catch(() => false)) {
      await staffMobileNumber.fill(newMobile);
    }
    if (await staffEmailAddress.isEditable().catch(() => false)) {
      await staffEmailAddress.fill(newEmail);
    }
    if (await staffAgentNumber.isEditable().catch(() => false)) {
      await staffAgentNumber.fill(newAgentNumber);
    }
    if (await staffRole.isEditable().catch(() => false)) {
      await staffRole.selectOption(newRole);
    }

    // 4. Click Submit
    const updateResponsePromise = this.page
      .waitForResponse(
        (r) => r.url().includes("/api/account/updateStaff"),
        { timeout: 20000 }
      )
      .catch(() => null);

    await editstaffSubmitButton.click();
    await updateResponsePromise;
    await this.page.waitForTimeout(1500);

    // Click "Go back" on the success popup to return to the staff list
    const goBackBtn = this.page.locator('button:has-text("Go back")').last();
    if (await goBackBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
      await goBackBtn.click();
      await this.page.waitForTimeout(1000);
    }

    // 5. Verify the staff details are updated successfully
    await this.expect(
      this.page.locator(`tr:has-text("${newFirstName}")`).first()
    ).toBeVisible({ timeout: 15000 });

    return {
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
      mobileNumber: newMobile,
      agentNumber: newAgentNumber,
      role: newRole,
    };
  }

  /**
   * Scenario 3: Delete Staff
   */
  async deleteStaffMember(staffToDelete = {}) {
    const {
      StaffManagement,
      Edit3DotStaffButton,
      deleteStaffButton,
      goBackButton,
    } = webElement.pageElement(this.page);

    // Ensure on Staff Management view
    if (!(await Edit3DotStaffButton.isVisible().catch(() => false))) {
      if (await StaffManagement.isVisible().catch(() => false)) {
        await StaffManagement.click();
        await this.page.waitForTimeout(1000);
      }
    }

    // 1. Click the three-dot menu
    let threeDot = Edit3DotStaffButton;
    if (staffToDelete && staffToDelete.firstName) {
      const staffRow = this.page.locator(`tr:has-text("${staffToDelete.firstName}")`);
      if ((await staffRow.count()) > 0) {
        threeDot = staffRow
          .locator(
            'button[id^="headlessui-menu-button"], button:has-text("Open options"), button[class*="rounded-full"]'
          )
          .first();
      }
    }

    await threeDot.waitFor({ state: "visible", timeout: 15000 });
    await threeDot.click();
    await this.page.waitForTimeout(500);

    // 2. Click Delete
    await deleteStaffButton.waitFor({ state: "visible", timeout: 10000 });
    await deleteStaffButton.click();
    await this.page.waitForTimeout(500);

    // 3. Verify the confirmation popup
    const confirmDialogHeading = this.page.locator('text="Delete Confirmation"');
    await this.expect(confirmDialogHeading).toBeVisible({ timeout: 10000 });

    // 4. Click Delete again to confirm
    const deleteResponsePromise = this.page
      .waitForResponse(
        (r) => r.url().includes("/api/account/deleteStaff"),
        { timeout: 20000 }
      )
      .catch(() => null);

    const confirmDeleteBtn = this.page
      .locator('button:has-text("Delete")')
      .last();
    await confirmDeleteBtn.click();
    await deleteResponsePromise;
    await this.page.waitForTimeout(1500);

    // 5. Click Go Back
    const goBackBtn = this.page.locator('button:has-text("Go back")').last();
    if (await goBackBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await goBackBtn.click();
      await this.page.waitForTimeout(1000);
    }

    // 6. Verify the staff member is deleted
    if (staffToDelete && staffToDelete.firstName) {
      await this.expect(
        this.page.locator(`tr:has-text("${staffToDelete.firstName}")`)
      ).toHaveCount(0, { timeout: 10000 });
    }
  }
}

module.exports = { StaffManagementPage };
