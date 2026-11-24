const path = require('path')
const { WebElement } = require('../../../utils/GuiWebElements')
const webElement = new WebElement()

class addHomeLoan {

    constructor(page, expect) {
        this.page = page
        this.expect = expect
    }
    async navigateToHomeloan() {
        const { homeloanModuleButton } = webElement.pageElement(this.page)
        await homeloanModuleButton.click()
    }
    async addBank() {
        const { loanAddButton, loanSearchTextbox, loanOptionAddMultiButton, loanApprovalFormButton, loanSubmitButton } = webElement.pageElement(this.page)
        for (let i = 0; i < 3; i++) {
            await loanAddButton.click()
            await loanSearchTextbox.waitFor({ state: "visible" })
            await loanSearchTextbox.fill('s')
            await loanOptionAddMultiButton.nth(i).click()
            await loanApprovalFormButton.setInputFiles(path.join(__dirname, '../../../resources/documents/Brochure.pdf'))
            await loanSubmitButton.click()
            await loanSearchTextbox.waitFor({ state: "hidden" })
            await this.page.waitForTimeout(500); // let UI settle after closing
        }
    }
    async addCustomBank() {
        const { loanAddButton, loanApprovalFormButton, loanSubmitButton, loanCustomAddButton, loanCustomBankTextbox, loanCustomBankCreateButton } = webElement.pageElement(this.page)
        for (let j = 0; j < 3; j++) {
            await loanAddButton.click()
            await loanCustomAddButton.waitFor({ state: "visible" })
            await loanCustomAddButton.click()
            await loanCustomBankTextbox.waitFor({ state: "visible" })
            await loanCustomBankTextbox.fill(`Custom Bank ${j + 1}`)
            await loanCustomBankCreateButton.click()
            await loanApprovalFormButton.setInputFiles(path.join(__dirname, '../../../resources/documents/Brochure.pdf'))
            await loanSubmitButton.click()
            await loanCustomBankTextbox.waitFor({ state: "hidden" })
            await this.page.waitForTimeout(500); // let UI settle after closing
        }
    }

}
module.exports = { addHomeLoan }