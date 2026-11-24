const { WebElement } = require('../../../utils/GuiWebElements')
const webElement = new WebElement()

class addNeigh {

    constructor(page, expect) {
        this.page = page
        this.expect = expect
    }
    async navigateToNeigh() {
        const { neighModuleButton } = webElement.pageElement(this.page)
        await neighModuleButton.click()
        await this.page.waitForTimeout(300)
    }
    async addLandmarks() {
        const { neighAddButton, neighRangeSlide, neighLabelMultiButton, neighSaveButton } = webElement.pageElement(this.page)
        await neighAddButton.click()
        await neighRangeSlide.fill('20')
        const neighLabelCount = await neighLabelMultiButton.count()
        for (let i = 0; i < neighLabelCount; i++) {
            await neighLabelMultiButton.nth(i).click()
        }
    }
    async addCustomLandmarks() {
        const { neighCustomLabelTextbox, neighCustomLabelAddButton } = webElement.pageElement(this.page)
        for (let j = 0; j < 3; j++) {
            await neighCustomLabelTextbox.fill(`testing on process ${j + 1}`)
            await neighCustomLabelAddButton.click()
        }
    }
    async neighSave() {
        const { neighSaveButton } = webElement.pageElement(this.page)
        await neighSaveButton.click()
    }

}
module.exports = { addNeigh }