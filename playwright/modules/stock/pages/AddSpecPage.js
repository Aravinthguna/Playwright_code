const { WebElement } = require('../../../utils/GuiWebElements')
const webElement = new WebElement()

class addSpec {

    constructor(page, expect) {
        this.page = page
        this.expect = expect
    }
    async navigateToSpec() {
        const { specModuleButton } = webElement.pageElement(this.page)
        await specModuleButton.click()
        await this.page.waitForTimeout(300)
    }
    async addLabel() {
        const { specAddButton, specLabelMultiCheckbox, specLabelSaveButton } = webElement.pageElement(this.page)
        await this.page.waitForTimeout(300)
        await specAddButton.click()
        const labelCount = await specLabelMultiCheckbox.count()
        for (let i = 0; i < labelCount; i++) {
            await specLabelMultiCheckbox.nth(i).click()
        }
        await specLabelSaveButton.click()
    }
    async addLabelTextbox() {
        const { specEditButton, specSubLabelMultiTextbox, specSaveButton } = webElement.pageElement(this.page)
        await specEditButton.click()
        const subLabeltextboxCount = await specSubLabelMultiTextbox.count()
        for (let j = 0; j < subLabeltextboxCount; j++) {
            await specSubLabelMultiTextbox.nth(j).fill('testing on process')
        }
        await specSaveButton.click()
    }
    async addLabelTextArea() {
        const { specEditButton, specSubLabelMultiTextArea, specSaveButton } = webElement.pageElement(this.page)
        await specEditButton.click()
        const subLabeltextareaCount = await specSubLabelMultiTextArea.count()
        for (let k = 0; k < subLabeltextareaCount; k++) {
            await specSubLabelMultiTextArea.nth(k).fill("The goal of a tester is not to find bugs, it's to validate that the software meets the requirements")
        }
        await specSaveButton.click()
    }

}
module.exports = { addSpec }