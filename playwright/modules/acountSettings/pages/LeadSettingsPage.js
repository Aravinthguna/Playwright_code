const { WebElement } = require("../../../utils/WebElements");
const webElement = new WebElement();
const { generateRandomName } = require("../../../utils/RandomDataUtils");

class LeadSettingsPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await this.page.waitForTimeout(1000);
  }

  /**
   * Helper to ensure a specific toggle switch is enabled (checked).
   * Checks current state via aria-checked to avoid unnecessary clicks.
   */
  async enableToggle(sectionName) {
    const card = this.page
      .locator("div")
      .filter({ hasText: sectionName })
      .filter({ has: this.page.locator('button[role="switch"]') })
      .last();

    const switchBtn = card.locator('button[role="switch"]').first();
    await switchBtn.waitFor({ state: "visible", timeout: 10000 });

    const isChecked = (await switchBtn.getAttribute("aria-checked")) === "true";
    if (!isChecked) {
      await switchBtn.click();
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Scenario 1: Lead Settings & Create Team
   * 1. Click Lead Settings.
   * 2. Enable toggle buttons:
   *    - Lead Auto Assignment
   *    - Pipeline Transition
   *    - Reset Lead on Re-engagement
   *    - Backward Pipeline Movement
   * 3. Click Pipeline Guide.
   * 4. Click Teams.
   * 5. Click Create Team.
   * 6. Enter Team Name.
   * 7. Open Add Team Members dropdown.
   * 8. Select one or two staff members.
   * 9. Select the first staff member as Assign Team Lead.
   * 10. Click Create Team and verify successful creation.
   */
  async createTeam(customTeamName) {
    const {
      leadSettings,
      pipelineGuide,
      teams,
      createTeam,
      teamName,
      addTeamMembers,
      selectEmployee,
      StaffAddButton,
      assignTeamLead,
      selectTeamLead,
    } = webElement.pageElement(this.page);

    // 1. Click Lead Settings
    await leadSettings.waitFor({ state: "visible", timeout: 20000 });
    await leadSettings.click();
    await this.page.waitForTimeout(1000);

    // 2. Enable toggles based on their current state
    const togglesToEnable = [
      "Lead Auto Assignment",
      "Pipeline Transition",
      "Reset Lead on Re-engagement",
      "Backward Pipeline Movement",
    ];
    for (const toggle of togglesToEnable) {
      await this.enableToggle(toggle);
    }

    // 3. Click Pipeline Guide
    await pipelineGuide.waitFor({ state: "visible", timeout: 15000 });
    await pipelineGuide.click();
    await this.page.waitForTimeout(1000);

    // 4. Click Teams
    await teams.waitFor({ state: "visible", timeout: 15000 });
    await teams.click();
    await this.page.waitForTimeout(1000);

    // 5. Click Create Team
    await createTeam.first().waitFor({ state: "visible", timeout: 15000 });
    await createTeam.first().click();
    await this.page.waitForTimeout(1000);

    // 6. Enter Team Name
    const newTeamName =
      customTeamName || `Team_${generateRandomName(5)}_${Math.floor(100 + Math.random() * 900)}`;
    await teamName.waitFor({ state: "visible", timeout: 10000 });
    await teamName.fill(newTeamName);

    // 7. Open Add Team Members dropdown
    await addTeamMembers.waitFor({ state: "visible", timeout: 10000 });
    await addTeamMembers.click();
    await this.page.waitForTimeout(1000);

    // 8. Select one or two staff members
    await selectEmployee.first().waitFor({ state: "visible", timeout: 10000 });
    const empCount = await selectEmployee.count();
    if (empCount > 0) {
      await selectEmployee.nth(0).click();
      if (empCount > 1) {
        await selectEmployee.nth(1).click();
      }
    }
    await StaffAddButton.waitFor({ state: "visible", timeout: 10000 });
    await StaffAddButton.click();
    await this.page.waitForTimeout(1000);

    // 9. Select the first staff member as Assign Team Lead
    await assignTeamLead.first().waitFor({ state: "visible", timeout: 10000 });
    await assignTeamLead.first().click();
    await selectTeamLead.first().waitFor({ state: "visible", timeout: 10000 });
    await selectTeamLead.first().click();
    await this.page.waitForTimeout(500);

    // 10. Click Create Team and verify successful creation
    const submitBtn = this.page
      .locator('button[type="submit"]')
      .filter({ hasText: "Create Team" })
      .or(this.page.locator('button:has-text("Create Team")'))
      .last();

    const createPromise = this.page
      .waitForResponse(
        (r) => r.url().includes("/api/account/createTeam") && r.status() === 200,
        { timeout: 15000 }
      )
      .catch(() => null);

    await submitBtn.click();
    await createPromise;
    await this.page.waitForTimeout(1500);

    // Verify team is visible in the list
    const createdTeamCard = this.page
      .locator("div, li, tr")
      .filter({ hasText: newTeamName })
      .first();
    await this.expect(createdTeamCard).toBeVisible({ timeout: 15000 });

    return newTeamName;
  }

  /**
   * Scenario 2: Edit Team
   * 1. Click Edit Team.
   * 2. Rename the Team Name.
   * 3. Click Create Team (submit).
   * 4. Verify the success message: Team updated successfully!
   */
  async editTeam(currentTeamName, updatedTeamName) {
    const { pipelineGuide, teams, teamName } = webElement.pageElement(this.page);

    // Ensure we are on Teams page
    if (!(await this.page.locator('button:has-text("Create Team")').first().isVisible().catch(() => false))) {
      if (await pipelineGuide.isVisible().catch(() => false)) {
        await pipelineGuide.click();
        await this.page.waitForTimeout(500);
      }
      if (await teams.isVisible().catch(() => false)) {
        await teams.click();
        await this.page.waitForTimeout(1000);
      }
    }

    // 1. Click Edit Team for the specified team
    const teamRow = this.page
      .locator("div, li, tr")
      .filter({ hasText: currentTeamName })
      .last();
    const editBtn = teamRow.locator('button:has-text("Edit")').first();
    await editBtn.waitFor({ state: "visible", timeout: 15000 });
    await editBtn.click();
    await this.page.waitForTimeout(1000);

    // 2. Rename the Team Name
    const newName = updatedTeamName || `${currentTeamName}_Renamed`;
    await teamName.waitFor({ state: "visible", timeout: 10000 });
    await teamName.fill(newName);

    // 3. Click Create Team (or Update Team button in edit form)
    const updateSubmitBtn = this.page
      .locator('button[type="submit"]')
      .filter({ hasText: /Update Team|Create Team/ })
      .or(this.page.locator('button:has-text("Update Team"), button:has-text("Create Team")'))
      .last();

    const updatePromise = this.page
      .waitForResponse(
        (r) =>
          (r.url().includes("/api/account/createTeam") ||
            r.url().includes("/api/account/updateTeam") ||
            r.url().includes("Team")) &&
          r.status() === 200,
        { timeout: 15000 }
      )
      .catch(() => null);

    await updateSubmitBtn.click();
    await updatePromise;

    // 4. Verify the success message: Team updated successfully!
    const successToast = this.page
      .locator('text="Team updated successfully!"')
      .or(this.page.getByText("Team updated successfully!"))
      .first();
    await this.expect(successToast).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(1000);

    return newName;
  }

  /**
   * Scenario 3: Delete Team
   * 1. Open Teams.
   * 2. Select the first team to delete (or specified created/edited team).
   * 3. Perform the delete action using the application's confirmation flow.
   * 4. Verify the team is deleted successfully.
   */
  async deleteTeam(teamNameToDelete) {
    const { pipelineGuide, teams } = webElement.pageElement(this.page);

    // 1. Open Teams (ensure on Teams page)
    if (!(await this.page.locator('button:has-text("Create Team")').first().isVisible().catch(() => false))) {
      if (await pipelineGuide.isVisible().catch(() => false)) {
        await pipelineGuide.click();
        await this.page.waitForTimeout(500);
      }
      if (await teams.isVisible().catch(() => false)) {
        await teams.click();
        await this.page.waitForTimeout(1000);
      }
    }

    // 2. Select the team to delete
    let targetRow;
    let targetName = teamNameToDelete;

    if (teamNameToDelete) {
      targetRow = this.page.locator("div, li, tr").filter({ hasText: teamNameToDelete }).last();
    } else {
      targetRow = this.page
        .locator("div, li, tr")
        .filter({ has: this.page.locator('button:has-text("Delete")') })
        .first();
      targetName = (await targetRow.innerText()).split("\n")[0].trim();
    }

    const deleteBtn = targetRow.locator('button:has-text("Delete")').first();
    await deleteBtn.waitFor({ state: "visible", timeout: 15000 });
    await deleteBtn.click();
    await this.page.waitForTimeout(500);

    // 3. Perform the delete action using confirmation flow
    const confirmDeleteBtn = this.page
      .locator(
        'button.bg-red-500:has-text("Delete"), [role="dialog"] button:has-text("Delete"), div.fixed button:has-text("Delete")'
      )
      .last();
    await confirmDeleteBtn.waitFor({ state: "visible", timeout: 10000 });

    const deletePromise = this.page
      .waitForResponse(
        (r) => r.url().includes("/api/account/deleteTeam") && r.status() === 200,
        { timeout: 15000 }
      )
      .catch(() => null);

    await confirmDeleteBtn.click();
    await deletePromise;
    await this.page.waitForTimeout(1500);

    // 4. Verify the team is deleted successfully
    if (targetName) {
      await this.expect(
        this.page.locator("div, li, tr").filter({ hasText: targetName })
      ).toHaveCount(0, { timeout: 15000 });
    }
  }
}

module.exports = { LeadSettingsPage };
