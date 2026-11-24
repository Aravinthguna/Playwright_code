const { WebElement } = require("../../../utils/GuiWebElements");
const webElement = new WebElement();

class addFaq {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
  async navigateTOFaqs() {
    const {
      faqModuleButton,
     
    } = webElement.pageElement(this.page);
    await faqModuleButton.click();
  }

  async fillInput(locator, value) {
    await locator.waitFor({ state: "visible" });
    await this.page.waitForTimeout(300); // let UI settle
    for (let attempt = 1; attempt <= 3; attempt++) {
      await locator.click();
      await locator.fill(value);
      try {
        await this.expect(locator).toHaveValue(value, { timeout: 1000 });
        return;
      } catch (err) {
        if (attempt === 3) throw err;
        await this.page.waitForTimeout(300);
      }
    }
  }

  async addFaq() {
    const { addFaqbutton, addMoreFaqbutton, questionTexBox, answerTextBox, SubmitFaqButton } =
      webElement.pageElement(this.page);

    await addFaqbutton.waitFor({ state: "visible" });
    if (await addFaqbutton.isEnabled()) {
      await addFaqbutton.click();
      await this.page.waitForTimeout(500); // let modal transition in and state initialize
      
      await this.fillInput(questionTexBox, "Testing Process 1");
      await this.fillInput(
        answerTextBox,
        "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of."
      );

      await SubmitFaqButton.click();
      // Wait for submission and modal to fully close/hide before proceeding
      await questionTexBox.waitFor({ state: "hidden" });
      await this.page.waitForTimeout(500); // let UI/lists stabilize
    }

    let i = 0;
    while (i < 2) {
      await addMoreFaqbutton.waitFor({ state: "visible" });
      if (!(await addMoreFaqbutton.isEnabled())) {
        break;
      }

      await addMoreFaqbutton.click();
      await this.page.waitForTimeout(500); // let modal transition in and state initialize

      await this.fillInput(questionTexBox, `Testing Process ${i + 2}`);
      await this.fillInput(
        answerTextBox,
        "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of."
      );

      await SubmitFaqButton.click();
      // Wait for submission and modal to fully close/hide before next iteration
      await questionTexBox.waitFor({ state: "hidden" });
      await this.page.waitForTimeout(500); // let UI/lists stabilize
      i++;
    }
  }
}
module.exports={addFaq}
