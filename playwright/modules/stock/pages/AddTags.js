const { WebElement } = require("../../../utils/GuiWebElements");
const webElement = new WebElement();

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

class AddTags {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  async addProjectTags() {
    const {
      projectTags,
      addtagcreateButton,
      projectTagNameTextbox,
      projectTagDescriptionTextbox,
      projectTagSubmitButton,
    } = webElement.pageElement(this.page);

    const { tagName, tagDescription } = generateTagData();

    await this.page.waitForTimeout(500);
    await projectTags.click();

    await addtagcreateButton.click();
    await projectTagNameTextbox.fill(tagName);
    await this.expect(projectTagNameTextbox).toHaveValue(tagName);
    await projectTagDescriptionTextbox.fill(tagDescription);
    await this.expect(projectTagDescriptionTextbox).toHaveValue(tagDescription);
    await projectTagSubmitButton.click();
  }
}

module.exports = { AddTags };

