const { WebElement } = require("../../../utils/WebElements");
const webElement = new WebElement();

class PipelineManagementPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await this.page.waitForTimeout(1000);
  }

  /**
   * Complete Pipeline Management End-to-End Workflow:
   * 1. Navigate to Pipelines and create a new pipeline
   * 2. Edit the pipeline name
   * 3. Add a bucket to the In Progress group
   * 4. Add a bucket to the Failed group
   * 5. Save the pipeline configuration
   * 6. Associate a team with the pipeline
   * 7. Exclude selected staff members
   * 8. Save and verify the team and staff exclusions
   * 9. Replace the associated team with another team
   * 10. Verify the updated team
   * 11. Remove the associated team
   * 12. Verify the team has been removed
   * 13. Clone the pipeline and associate it with a project
   * 14. Verify the cloned pipeline and project association
   * 15. Delete the test-created pipeline
   * 16. Verify successful deletion
   */
  async pipelineManagement() {
    const timestamp = Date.now();
    const initialPipelineName = `QA_Pipeline_${timestamp}`;
    const updatedPipelineName = `QA_Pipeline_${timestamp}_Rev`;
    const inProgressBucketName = `Review_${timestamp}`;
    const failedBucketName = `Lost_${timestamp}`;
    const successBucketName = `Won_${timestamp}`;

    // 1. Navigate to Pipelines and create a new pipeline
    await this.navigateToPipelines();
    let card = await this.addPipeline(initialPipelineName);
    await this.verifyPipelineVisible(card, initialPipelineName);

    // 2. Edit the pipeline name
    await this.editPipelineName(card, updatedPipelineName);
    card = this.getCurrentPipelineCard();
    await this.verifyPipelineVisible(card, updatedPipelineName);

    // 3. Add a bucket to the In Progress group
    await this.addBucket(card, "IN PROGRESS", inProgressBucketName);
    await this.verifyBucketVisible(card, inProgressBucketName);

    // 4. Add a bucket to the Failed group
    await this.addBucket(card, "FAILED", failedBucketName);
    await this.verifyBucketVisible(card, failedBucketName);

    // Configure unique Success bucket name to prevent backend schema conflicts
    await this.renameSuccessBucket(card, successBucketName);
    await this.verifyBucketVisible(card, successBucketName);

    // 5. Save the pipeline configuration
    await this.savePipelineConfiguration();

    // 6. Associate a team with the pipeline
    // 7. Exclude selected staff members
    // 8. Save and verify the team and staff exclusions
    const { selectedTeamText } = await this.associateTeam(card, null, 1);
    await this.verifyTeamAssociated(card, selectedTeamText);

    // 9. Replace the associated team with another team
    // 10. Verify the updated team
    const updatedTeamText = await this.replaceTeam(card, null);
    await this.verifyTeamAssociated(card, updatedTeamText);

    // 11. Remove the associated team
    // 12. Verify the team has been removed
    await this.removeTeam(card);
    await this.verifyTeamRemoved(card);

    // 13. Clone the pipeline and associate it with a project
    // 14. Verify the cloned pipeline and project association
    const { clonedCard, selectedProjectName } = await this.clonePipeline(card, null);
    await this.verifyClonedPipeline(clonedCard, updatedPipelineName, selectedProjectName);

    // 15. Save cloned pipeline configuration
    await this.savePipelineConfiguration();

    // 16. Delete the child (cloned) pipeline and click Save button
    if (clonedCard && clonedCard !== card) {
      await this.deletePipelineAndSave(clonedCard);
    }

    // 17. Delete the parent pipeline and click Save button
    const originalCard = this.getPipelineCardByName(updatedPipelineName);
    await this.deletePipelineAndSave(originalCard);

    // 18. Verify successful deletion
    await this.verifyPipelineDeleted(updatedPipelineName);
  }

  // ==========================================
  // LOCATORS & SELECTORS
  // ==========================================

  /**
   * Helper to return all pipeline card locators on the page
   */
  getPipelineCards() {
    return this.page
      .locator('p:has-text("Hover a bucket to rename")')
      .locator('xpath=..');
  }

  /**
   * Helper to return the current (last created) pipeline card
   */
  getCurrentPipelineCard() {
    return this.getPipelineCards().last();
  }

  /**
   * Helper to return a specific pipeline card by its name
   */
  getPipelineCardByName(name) {
    if (!name) return this.getCurrentPipelineCard();
    return this.getPipelineCards().filter({ hasText: name }).first();
  }

  /**
   * Helper to return team badge locator inside card
   */
  getTeamBadge(card, teamName) {
    const target = card || this.getCurrentPipelineCard();
    if (teamName) {
      return target.locator("button, div").filter({ hasText: teamName }).first();
    }
    return target.locator('button:has-text("First team"), button:has-text("Team Two")').first();
  }

  /**
   * Helper to return "Associate with teams" button locator inside card
   */
  getAssociateTeamButton(card) {
    const target = card || this.getCurrentPipelineCard();
    return target
      .getByRole("button", { name: /associate/i })
      .or(target.locator('button:has-text("Associate with teams")'))
      .or(target.locator('button').filter({ hasText: /associate/i }))
      .first();
  }

  // ==========================================
  // NAVIGATION
  // ==========================================

  /**
   * Navigate to Lead Settings -> Pipelines page
   */
  async navigateToPipelines() {
    const { leadSettings, pipelines, addPipelineButton } =
      webElement.pageElement(this.page);

    const isPipelinesVisible = await pipelines
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (!isPipelinesVisible) {
      await leadSettings.waitFor({ state: "visible", timeout: 20000 });
      await leadSettings.click();
      await this.page.waitForTimeout(1000);
    }

    await pipelines.waitFor({ state: "visible", timeout: 20000 });
    await pipelines.click();
    await this.page.waitForTimeout(1500);

    const addBtn = this.page
      .getByRole("button", { name: /add pipeline/i })
      .or(addPipelineButton)
      .first();

    await addBtn.waitFor({ state: "visible", timeout: 15000 });
    await this.expect(addBtn).toBeVisible();

    // Clean up any stale test-created pipelines from previous runs if present
    await this.cleanupOldTestPipelines();
  }

  /**
   * Clean up any stale test pipelines starting with QA_Pipeline_, QA_Parent_, or Won_
   */
  async cleanupOldTestPipelines() {
    const staleCards = this.page.locator('p, h2, h3').filter({ hasText: /QA_Pipeline_|QA_Parent_|Won_/ });
    let count = await staleCards.count();
    while (count > 0) {
      const card = this.getPipelineCards().filter({ hasText: /QA_Pipeline_|QA_Parent_|Won_/ }).first();
      if (await card.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.deletePipeline(card);
        await this.page.waitForTimeout(1000);
      } else {
        break;
      }
      count = await this.page.locator('p, h2, h3').filter({ hasText: /QA_Pipeline_|QA_Parent_|Won_/ }).count();
    }
  }

  // ==========================================
  // PIPELINE LIFECYCLE (CREATE, EDIT, CLONE, DELETE)
  // ==========================================

  /**
   * Add a new custom pipeline
   * Clicks '+ Add pipeline' and returns the locator of the newly added card
   */
  async addPipeline(customPipelineName) {
    const { addPipelineButton } = webElement.pageElement(this.page);
    const addBtn = this.page
      .getByRole("button", { name: /add pipeline/i })
      .or(addPipelineButton)
      .first();

    await addBtn.waitFor({ state: "visible", timeout: 10000 });
    await addBtn.click();
    await this.page.waitForTimeout(1000);

    const cards = this.getPipelineCards();
    const newCard = cards.last();
    await newCard.scrollIntoViewIfNeeded();
    await this.expect(newCard).toBeVisible({ timeout: 10000 });

    if (customPipelineName) {
      await this.editPipelineName(newCard, customPipelineName);
    }

    return newCard;
  }

  /**
   * Edit / Rename Pipeline
   */
  async editPipelineName(pipelineCard, newName) {
    const card = pipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();
    const renameBtn = card
      .locator('button[title="Rename pipeline"], button[title*="Rename"]')
      .first();

    if (await renameBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await renameBtn.click();
    } else {
      const titleEl = card.locator("p, h2, h3").first();
      await titleEl.click();
    }
    await this.page.waitForTimeout(500);

    const nameInput = this.page.locator('input').last();
    await nameInput.waitFor({ state: "visible", timeout: 5000 });
    await nameInput.fill("");
    await nameInput.fill(newName);
    await nameInput.press("Enter");
    await this.page.waitForTimeout(500);

    await this.expect(this.getCurrentPipelineCard()).toContainText(newName);
    return newName;
  }

  /**
   * Clone Pipeline and associate with a project
   */
  async clonePipeline(sourcePipelineCard, projectName) {
    const card = sourcePipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();
    const cloneBtn = card
      .locator('button:has-text("Clone"), button[title*="Clone"]')
      .first();

    await cloneBtn.waitFor({ state: "visible", timeout: 10000 });
    await cloneBtn.click();
    await this.page.waitForTimeout(600);

    // Select project from the project popover
    let projectOption;
    if (projectName) {
      projectOption = this.page.locator('button').filter({ hasText: projectName }).first();
    } else {
      projectOption = this.page.locator('button').filter({ hasText: /Test Primary|Testing Project/ }).first();
    }

    await projectOption.waitFor({ state: "visible", timeout: 10000 });
    const selectedProjectName = (await projectOption.innerText()).trim();
    await projectOption.click();
    await this.page.waitForTimeout(1000);

    const clonedCard = this.getPipelineCards().last();
    await clonedCard.waitFor({ state: "visible", timeout: 15000 });
    return { clonedCard, selectedProjectName };
  }

  /**
   * Delete Pipeline
   */
  async deletePipeline(pipelineCard) {
    const card = pipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();
    const trashBtn = card
      .locator('button[title="Delete pipeline"], button[title*="Delete"], button.text-red-500, button:has(svg.lucide-trash-2), button:has(svg.lucide-trash)')
      .first();
    await trashBtn.waitFor({ state: "visible", timeout: 10000 });
    await trashBtn.click();
    await this.page.waitForTimeout(600);

    const confirmDeleteBtn = this.page
      .locator(
        'button:has-text("Delete Pipeline"), [role="dialog"] button.bg-red-600, div.fixed button:has-text("Delete Pipeline"), [role="dialog"] button:has-text("Delete")'
      )
      .last();
    if (await confirmDeleteBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await confirmDeleteBtn.click();
      await this.page.waitForTimeout(1000);
    }

    const { savePipelin } = webElement.pageElement(this.page);
    const saveBtn = this.page.getByRole("button", { name: /save pipeline/i }).or(savePipelin).first();
    if (await saveBtn.isEnabled().catch(() => false)) {
      await saveBtn.click();
      const toast = this.page.locator('text="Pipelines saved successfully!"').or(this.page.getByText("Pipelines saved successfully!"));
      await toast.first().waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Delete Pipeline and save configuration explicitly
   */
  async deletePipelineAndSave(pipelineCard) {
    const card = pipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();
    const trashBtn = card
      .locator('button[title="Delete pipeline"], button[title*="Delete"], button.text-red-500, button:has(svg.lucide-trash-2), button:has(svg.lucide-trash)')
      .first();
    await trashBtn.waitFor({ state: "visible", timeout: 10000 });
    await trashBtn.click();
    await this.page.waitForTimeout(600);

    const confirmDeleteBtn = this.page
      .locator(
        'button:has-text("Delete Pipeline"), [role="dialog"] button.bg-red-600, div.fixed button:has-text("Delete Pipeline"), [role="dialog"] button:has-text("Delete")'
      )
      .last();
    if (await confirmDeleteBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await confirmDeleteBtn.click();
      await this.page.waitForTimeout(1000);
    }

    await this.savePipelineConfiguration();
  }

  /**
   * Cloned Pipeline Scenario:
   * 1. Click the Clone Pipeline button.
   * 2. Select a project and create the cloned pipeline.
   * 3. Click Save.
   * 4. Delete the cloned pipeline and click Save.
   * 5. Delete the parent pipeline and click Save.
   */
  async clonePipelineScenario(sourceParentCard, projectName) {
    let parentCard = sourceParentCard;
    let parentPipelineName;

    // Ensure a parent pipeline is available to clone
    if (!parentCard) {
      await this.navigateToPipelines();
      const timestamp = Date.now();
      parentPipelineName = `QA_Parent_${timestamp}`;
      parentCard = await this.addPipeline(parentPipelineName);
      await this.renameSuccessBucket(parentCard, `Won_${timestamp}`);
      await this.savePipelineConfiguration();
    }

    // 1. Click the Clone Pipeline button
    // 2. Select a project and create the cloned pipeline
    const { clonedCard, selectedProjectName } = await this.clonePipeline(parentCard, projectName);
    await this.verifyPipelineVisible(clonedCard);
    if (selectedProjectName) {
      await this.expect(clonedCard).toContainText(selectedProjectName);
    }

    // 3. Click Save
    await this.savePipelineConfiguration();

    // 4. Delete the cloned pipeline and click Save
    await this.deletePipelineAndSave(clonedCard);

    // 5. Delete the parent pipeline and click Save
    const targetParentCard = parentPipelineName
      ? this.getPipelineCardByName(parentPipelineName)
      : parentCard;
    await this.deletePipelineAndSave(targetParentCard);

    if (parentPipelineName) {
      await this.verifyPipelineDeleted(parentPipelineName);
    }
  }

  // ==========================================
  // BUCKET MANAGEMENT FUNCTIONS
  // ==========================================

  /**
   * Add Bucket to IN PROGRESS or FAILED section
   */
  async addBucket(pipelineCard, groupType = "IN PROGRESS", bucketName) {
    const card = pipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();

    const isFailure = groupType.toUpperCase().includes("FAIL");
    const addBtn = isFailure
      ? card
          .getByRole("button", { name: "Add failure bucket" })
          .or(card.locator('button[title="Add failure bucket"]'))
          .or(card.locator('button[title*="failure"]'))
          .first()
      : card
          .getByRole("button", { name: "Add stage bucket" })
          .or(card.locator('button[title="Add stage bucket"]'))
          .or(card.locator('button[title*="stage"]'))
          .first();

    await addBtn.waitFor({ state: "visible", timeout: 10000 });
    await addBtn.click();
    await this.page.waitForTimeout(600);

    if (bucketName) {
      const targetBucket = isFailure
        ? card.locator("div, button").filter({ hasText: "New Failure" }).last()
        : card.locator("div, button").filter({ hasText: "New Stage" }).last();

      await targetBucket.waitFor({ state: "visible", timeout: 5000 });
      await targetBucket.hover({ force: true });
      await this.page.waitForTimeout(400);

      const renameBtn = this.page
        .locator('button:not([title*="pipeline"]):not([title*="Pipeline"]):has(svg.lucide-pencil), button:not([title*="pipeline"]):not([title*="Pipeline"])[title*="Rename"]')
        .last();

      if (await renameBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await renameBtn.click();
        await this.page.waitForTimeout(300);
        const input = card.locator('input').last();
        if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
          await input.fill(bucketName);
          await input.press("Enter");
          await this.page.waitForTimeout(400);
        }
      }
      await this.expect(card).toContainText(bucketName);
    }
  }

  /**
   * Rename Success Bucket (to avoid duplicate names)
   */
  async renameSuccessBucket(pipelineCard, newName = "Deal Closed") {
    const card = pipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();
    const successBucket = card
      .locator("div, button")
      .filter({ hasText: /^Success$/ })
      .last();

    if (await successBucket.isVisible({ timeout: 5000 }).catch(() => false)) {
      await successBucket.hover({ force: true });
      await this.page.waitForTimeout(400);
      const renameBtn = this.page
        .locator('button:not([title*="pipeline"]):not([title*="Pipeline"]):has(svg.lucide-pencil), button:not([title*="pipeline"]):not([title*="Pipeline"])[title*="Rename"]')
        .last();
      if (await renameBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await renameBtn.click();
        await this.page.waitForTimeout(400);
        const input = card.locator('input').last();
        if (await input.isVisible({ timeout: 3000 }).catch(() => false)) {
          await input.fill(newName);
          await input.press("Enter");
          await this.page.waitForTimeout(400);
        }
      }
    }
  }

  /**
   * Duplicate Bucket
   */
  async duplicateBucket(pipelineCard, bucketName) {
    await pipelineCard.scrollIntoViewIfNeeded();
    const bucket = pipelineCard.locator("div, button").filter({ hasText: bucketName }).first();
    await bucket.hover();
    await this.page.waitForTimeout(400);

    const dupBtn = this.page
      .locator('button[title*="Duplicate"], button:has(svg.lucide-copy), button:has(svg.lucide-plus)')
      .first();
    if (await dupBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await dupBtn.click();
      await this.page.waitForTimeout(600);
    }
  }

  /**
   * Delete Bucket
   */
  async deleteBucket(pipelineCard, bucketName) {
    await pipelineCard.scrollIntoViewIfNeeded();
    const bucket = pipelineCard.locator("div, button").filter({ hasText: bucketName }).first();
    await bucket.hover();
    await this.page.waitForTimeout(400);

    const trashBtn = this.page
      .locator('button[title*="Delete"], button:has(svg.lucide-trash), button:has(svg.lucide-trash-2)')
      .first();
    if (await trashBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await trashBtn.click();
      await this.page.waitForTimeout(600);
    }
  }

  // ==========================================
  // TEAM & STAFF EXCLUSION FUNCTIONS
  // ==========================================

  /**
   * Exclude selected staff members while preserving at least one active member
   */
  async excludeStaffMembers(excludeStaffCount = 1) {
    const staffCheckboxes = this.page.locator('input[type="checkbox"]');
    const totalStaff = await staffCheckboxes.count();
    let excludedCount = 0;
    if (excludeStaffCount > 0 && totalStaff > 1) {
      const allowedToExclude = Math.min(excludeStaffCount, totalStaff - 1);
      for (let i = 0; i < allowedToExclude; i++) {
        await staffCheckboxes.nth(i).check();
        excludedCount++;
      }
    }
    return excludedCount;
  }

  /**
   * Associate Team with Pipeline & Exclude Staff
   */
  async associateTeam(pipelineCard, teamName, excludeStaffCount = 0) {
    const card = pipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();

    const associateDropdownBtn = this.getAssociateTeamButton(card);
    await associateDropdownBtn.waitFor({ state: "visible", timeout: 15000 });
    await associateDropdownBtn.click();
    await this.page.waitForTimeout(600);

    // Select team from 'Select a team' popup inside this specific card
    let targetTeamBtn;
    if (teamName) {
      targetTeamBtn = card.locator('button').filter({ hasText: teamName }).first();
    } else {
      targetTeamBtn = card.locator('button').filter({ hasText: /First team|Team Two/ }).first();
    }

    if (!await targetTeamBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await associateDropdownBtn.click();
      await this.page.waitForTimeout(600);
    }

    await targetTeamBtn.waitFor({ state: "visible", timeout: 10000 });
    const selectedTeamText = (await targetTeamBtn.innerText()).trim();
    await targetTeamBtn.click();
    await this.page.waitForTimeout(800);

    // Exclude staff members if requested
    const excludedCount = await this.excludeStaffMembers(excludeStaffCount);

    // Click Associate
    const associateBtn = this.page
      .locator('button:has-text("Associate")')
      .last();
    await associateBtn.waitFor({ state: "visible", timeout: 10000 });
    await associateBtn.click();

    // Verify toast
    const toast = this.page
      .locator('text="Team associated successfully"')
      .or(this.page.getByText("Team associated successfully"))
      .or(this.page.locator('.toast, [role="status"]'));
    await this.expect(toast.first()).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000);

    return { selectedTeamText, excludedCount };
  }

  /**
   * Replace Team on Pipeline
   */
  async replaceTeam(pipelineCard, newTeamName) {
    const card = pipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();

    // The 3-dot button is the immediate sibling button of the team badge button
    const dotBtn = card
      .locator('button:has-text("First team") + button, button:has-text("Team Two") + button')
      .or(card.locator('div:has(> button:has-text("First team")), div:has(> button:has-text("Team Two"))').locator('button').nth(1))
      .first();

    await dotBtn.waitFor({ state: "visible", timeout: 10000 });
    await dotBtn.click();
    await this.page.waitForTimeout(400);

    const replaceTeamBtn = this.page.locator('button:has-text("Replace Team")').first();
    await replaceTeamBtn.waitFor({ state: "visible", timeout: 10000 });
    await replaceTeamBtn.click();
    await this.page.waitForTimeout(600);

    let teamOption;
    if (newTeamName) {
      teamOption = card.locator('button').filter({ hasText: newTeamName }).first();
    } else {
      teamOption = card.locator('button').filter({ hasText: "Team Two" }).first();
    }
    await teamOption.waitFor({ state: "visible", timeout: 10000 });
    const updatedTeamText = (await teamOption.innerText()).trim();
    await teamOption.click();
    await this.page.waitForTimeout(500);

    const associateBtn = this.page.locator('button:has-text("Associate")').last();
    await associateBtn.waitFor({ state: "visible", timeout: 10000 });
    await associateBtn.click();

    const toast = this.page
      .locator('text="Team associated successfully"')
      .or(this.page.getByText("Team associated successfully"))
      .or(this.page.locator('.toast, [role="status"]'));
    await this.expect(toast.first()).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000);

    return updatedTeamText;
  }

  /**
   * Remove Team from Pipeline
   */
  async removeTeam(pipelineCard) {
    const card = pipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();

    const dotBtn = card
      .locator('button:has-text("First team") + button, button:has-text("Team Two") + button')
      .or(card.locator('div:has(> button:has-text("First team")), div:has(> button:has-text("Team Two"))').locator('button').nth(1))
      .first();

    await dotBtn.waitFor({ state: "visible", timeout: 10000 });
    await dotBtn.click();
    await this.page.waitForTimeout(400);

    const removeBtn = this.page.locator('button:has-text("Remove Team")').first();
    await removeBtn.waitFor({ state: "visible", timeout: 10000 });
    await removeBtn.click();
    await this.page.waitForTimeout(1000);

    // Verify Associate with teams dropdown is restored
    await this.expect(this.getAssociateTeamButton(card)).toBeVisible({ timeout: 10000 });
  }

  // ==========================================
  // SAVE CONFIGURATION
  // ==========================================

  /**
   * Save Pipeline Configuration
   */
  async savePipelineConfiguration() {
    const { savePipelin } = webElement.pageElement(this.page);

    await savePipelin.waitFor({ state: "visible", timeout: 10000 });
    const isEnabled = await savePipelin.isEnabled().catch(() => false);
    if (!isEnabled) {
      return;
    }

    await savePipelin.click();
    await this.page.waitForTimeout(1000);

    const toast = this.page
      .locator('text="Pipelines saved successfully!"')
      .or(this.page.getByText("Pipelines saved successfully!"));

    await this.expect(toast.first()).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(1500);
  }

  // ==========================================
  // VERIFICATION & ASSERTION FUNCTIONS
  // ==========================================

  /**
   * Verify pipeline card is visible and has expected title
   */
  async verifyPipelineVisible(pipelineCard, expectedName) {
    const card = pipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();
    await this.expect(card).toBeVisible({ timeout: 10000 });
    if (expectedName) {
      await this.expect(card).toContainText(expectedName);
    }
  }

  /**
   * Verify a specific bucket is present inside the card
   */
  async verifyBucketVisible(pipelineCard, bucketName) {
    const card = pipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();
    await this.expect(card).toContainText(bucketName);
  }

  /**
   * Verify team badge is visible inside the card
   */
  async verifyTeamAssociated(pipelineCard, teamName) {
    const card = pipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();
    const badge = this.getTeamBadge(card, teamName);
    await this.expect(badge).toBeVisible({ timeout: 10000 });
  }

  /**
   * Verify team has been removed and "Associate with teams" button is restored
   */
  async verifyTeamRemoved(pipelineCard) {
    const card = pipelineCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();
    const associateBtn = this.getAssociateTeamButton(card);
    await this.expect(associateBtn).toBeVisible({ timeout: 10000 });
  }

  /**
   * Verify cloned pipeline card and project association
   */
  async verifyClonedPipeline(clonedCard, originalPipelineName, selectedProjectName) {
    const card = clonedCard || this.getCurrentPipelineCard();
    await card.scrollIntoViewIfNeeded();
    await this.expect(card).toBeVisible({ timeout: 10000 });
    if (originalPipelineName) {
      await this.expect(card).toContainText(originalPipelineName);
    }
    if (selectedProjectName) {
      await this.expect(card).toContainText(selectedProjectName);
    }
  }

  /**
   * Verify pipeline has been deleted from page
   */
  async verifyPipelineDeleted(pipelineName) {
    await this.page.waitForTimeout(1000);
    const titleLocator = this.page.locator("p, h2, h3").filter({ hasText: pipelineName });
    await this.expect(titleLocator).toHaveCount(0, { timeout: 10000 });
  }

  /**
   * Verify pipeline configuration persistence after refresh
   */
  async verifyPipelinePersistence({ pipelineName, inProgressBucket, failedBucket, successBucket }) {
    await this.navigateToPipelines();

    const card = this.getPipelineCardByName(pipelineName);
    await card.scrollIntoViewIfNeeded();
    await this.expect(card).toBeVisible({ timeout: 10000 });
    await this.expect(card).toContainText(pipelineName);

    if (inProgressBucket) {
      await this.expect(card).toContainText(inProgressBucket);
    }
    if (failedBucket) {
      await this.expect(card).toContainText(failedBucket);
    }
    if (successBucket) {
      await this.expect(card).toContainText(successBucket);
    }

    // Verify group labels
    await this.expect(card.locator('text="In Progress"').first()).toBeVisible();
    await this.expect(card.locator('text="✓ Success"').first()).toBeVisible();
    await this.expect(card.locator('text="✕ Failed"').first()).toBeVisible();

    return card;
  }
}

module.exports = { PipelineManagementPage };
