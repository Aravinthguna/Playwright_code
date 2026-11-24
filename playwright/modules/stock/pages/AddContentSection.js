const path = require("path");
const { WebElement } = require("../../../utils/GuiWebElements");
const webElement = new WebElement();

const IMAGE_PATH = path.join(
  __dirname,
  "../../../resources/images/pexels1.jpg"
);

class AddContentSection {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  // ─── Shared upload helper ────────────────────────────────────────────────────
  // Clicks the image-upload label, waits for the file-input to be attached,
  // sets the file, then clicks Submit and waits for the dialog to close.
  async _uploadImage(uploadLabel, submitButton) {
    await uploadLabel.click();

    // Wait for the upload dialog's file-input to become available
    const fileInput = this.page.locator("input#file-upload");
    await fileInput.waitFor({ state: "attached", timeout: 10000 });
    await fileInput.setInputFiles(IMAGE_PATH);

    // Allow the UI to process the file selection before submitting
    await submitButton.click();
    await this.page.waitForTimeout(600);

    // Wait for the dialog to close (input detaches or becomes hidden)
    await fileInput
      .waitFor({ state: "detached", timeout: 10000 })
      .catch(() => {
        // If it does not detach, the app may hide it instead — that is fine
      });
    await this.page.waitForTimeout(400);
  }

  // ─── Shared save helper ──────────────────────────────────────────────────────
  // Clicks the Save button, then waits for the Edit button to reappear — this
  // signals the panel has returned to view-only mode and the save is complete.
  async _saveAndVerify(saveButton, editButton) {
    await saveButton.click();

    // The panel transitions from edit-mode (Save/Cancel visible) back to
    // view-mode (Edit button visible) once the save API call finishes.
    await editButton.waitFor({ state: "visible", timeout: 20000 });
    await this.page.waitForTimeout(500);
  }

  // ─── Project Content Section 1 ───────────────────────────────────────────────
  // Completely runs Section 1 scenario to completion (fills all fields, uploads
  // images, saves and verifies), then waits 10 seconds before resolving.
  async addProjectContentSection1() {
    const {
      projectContentSection1,
      projectContentEditButton,
      projectsectionTitle,
      projecttitle,
      projectsubTitle,
      projectcontentImage1,
      projectBackgroundImage1,
      projectContentImageUploadSubmitButton,
      projectcontentDescriptionTextbox,
      projectContentSectionSaveButton,
    } = webElement.pageElement(this.page);

    await this.page.waitForTimeout(500);
    await projectContentSection1.scrollIntoViewIfNeeded();
    await projectContentSection1.click();

    // Wait for the section 1 panel Edit button to be visible
    await projectContentEditButton.waitFor({ state: "visible", timeout: 10000 });
    await projectContentEditButton.scrollIntoViewIfNeeded();
    await this.expect(projectContentEditButton).toBeEnabled();
    await projectContentEditButton.click();

    // Fill form fields
    await projectsectionTitle.waitFor({ state: "visible", timeout: 8000 });
    await projectsectionTitle.fill("Project Content Section 1");
    await this.expect(projectsectionTitle).toHaveValue(
      "Project Content Section 1"
    );

    await projecttitle.fill("Project Title 1");
    await this.expect(projecttitle).toHaveValue("Project Title 1");

    await projectsubTitle.fill("Project Subtitle 1");
    await this.expect(projectsubTitle).toHaveValue("Project Subtitle 1");

    // Upload Content Image — uses shared helper with condition-based waits
    await this._uploadImage(
      projectcontentImage1,
      projectContentImageUploadSubmitButton
    );

    // Upload Background Image
    await this._uploadImage(
      projectBackgroundImage1,
      projectContentImageUploadSubmitButton
    );

    // Description filled after uploads so the form state is stable
    await projectcontentDescriptionTextbox.fill(
      "Detailed description of project content section 1."
    );
    await this.expect(projectcontentDescriptionTextbox).toHaveValue(
      "Detailed description of project content section 1."
    );

    // Save and wait until the panel returns to view-mode (Edit button visible)
    await this._saveAndVerify(
      projectContentSectionSaveButton,
      projectContentEditButton
    );

    // Wait 2 seconds after Section 1 scenario is completely done before moving to Section 2
    await this.page.waitForTimeout(2000);
  }

  // ─── Project Content Section 2 ───────────────────────────────────────────────
  async addProjectContentSection2() {
    const {
      projectContentSection2,
      projectContent2EditButton,
      projectsectionTitle,
      projecttitle,
      projectsubTitle,
      projectcontentImage1,
      projectBackgroundImage1,
      projectContentImageUploadSubmitButton,
      projectcontentDescriptionTextbox,
      projectContentSectionSaveButton,
    } = webElement.pageElement(this.page);

    await this.page.waitForTimeout(500);
    await projectContentSection2.scrollIntoViewIfNeeded();
    await projectContentSection2.click();

    // Wait for Section 2 panel Edit button — the panel only renders after tab click
    await projectContent2EditButton.waitFor({ state: "visible", timeout: 10000 });
    await this.page.waitForTimeout(1000);
    await projectContent2EditButton.scrollIntoViewIfNeeded();
    await this.expect(projectContent2EditButton).toBeEnabled();
    await projectContent2EditButton.click();

    // Fill form fields
    await projectsectionTitle.waitFor({ state: "visible", timeout: 8000 });
    await projectsectionTitle.click();
    await projectsectionTitle.fill("Project Content Section 2");
    await this.expect(projectsectionTitle).toHaveValue(
      "Project Content Section 2"
    );

    await projecttitle.click();
    await projecttitle.fill("Project Title 2");
    await this.expect(projecttitle).toHaveValue("Project Title 2");

    await projectsubTitle.click();
    await projectsubTitle.fill("Project Subtitle 2");
    await this.expect(projectsubTitle).toHaveValue("Project Subtitle 2");

    // Upload Content Image
    await this._uploadImage(
      projectcontentImage1,
      projectContentImageUploadSubmitButton
    );

    // Upload Background Image
    await this._uploadImage(
      projectBackgroundImage1,
      projectContentImageUploadSubmitButton
    );

    // Description
    await projectcontentDescriptionTextbox.fill(
      "Detailed description of project content section 2."
    );
    await this.expect(projectcontentDescriptionTextbox).toHaveValue(
      "Detailed description of project content section 2."
    );

    // Save and wait until the panel returns to view-mode (Edit button visible)
    await this._saveAndVerify(
      projectContentSectionSaveButton,
      projectContent2EditButton
    );
  }

  // ─── Combined Runner ────────────────────────────────────────────────────────
  // Runs Section 1 completely, waits 10s (enforced inside Section 1), then runs Section 2
  async addProjectContentSection() {
    await this.addProjectContentSection1();
    await this.addProjectContentSection2();
  }
}

module.exports = { AddContentSection };
