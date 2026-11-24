const { WebElement } = require('../../../utils/GuiWebElements')
const webElement = new WebElement()

class addAmenities {

    constructor(page, expect) {
        this.page = page
        this.expect = expect
    }
    async navigateToAmenities() {
        const { amenitiesModuleButton } = webElement.pageElement(this.page)
        await amenitiesModuleButton.click()
    }
    async uploadSports() {
        const { amenitiesEditMultiButton, amenitiesLabelMultiCheckbox, amenitiesCustomAddButton, amenitiesCustomTextbox, amenitiesCustomSaveButton, amenitiesSaveButton } = webElement.pageElement(this.page)
        await this.page.waitForTimeout(500)
        await amenitiesEditMultiButton.nth(0).click()
        const labelOptionCount = await amenitiesLabelMultiCheckbox.count()
        for (let j = 0; j < labelOptionCount; j++) {
            await amenitiesLabelMultiCheckbox.nth(j).click()
        }
        await amenitiesCustomAddButton.click()
        for (let k = 0; k < 3; k++) {
            await amenitiesCustomTextbox.fill(`testing on process ${k + 1}`)
            await amenitiesCustomSaveButton.click()
        }
        await amenitiesSaveButton.click()
    }
    async uploadConvenience() {
        const { amenitiesEditMultiButton, amenitiesLabelMultiCheckbox, amenitiesCustomAddButton, amenitiesCustomTextbox, amenitiesCustomSaveButton, amenitiesSaveButton } = webElement.pageElement(this.page)
        await this.page.waitForTimeout(500)
        await amenitiesEditMultiButton.nth(1).click()
        const labelOptionCount = await amenitiesLabelMultiCheckbox.count()
        for (let j = 0; j < labelOptionCount; j++) {
            await amenitiesLabelMultiCheckbox.nth(j).click()
        }
        await amenitiesCustomAddButton.click()
        for (let k = 0; k < 3; k++) {
            await amenitiesCustomTextbox.fill(`testing on process ${k + 1}`)
            await amenitiesCustomSaveButton.click()
        }
        await amenitiesSaveButton.click()
    }
    async uploadLeisure() {
        const { amenitiesEditMultiButton, amenitiesLabelMultiCheckbox, amenitiesCustomAddButton, amenitiesCustomTextbox, amenitiesCustomSaveButton, amenitiesSaveButton } = webElement.pageElement(this.page)
        await this.page.waitForTimeout(500)
        await amenitiesEditMultiButton.nth(2).click()
        const labelOptionCount = await amenitiesLabelMultiCheckbox.count()
        for (let j = 0; j < labelOptionCount; j++) {
            await amenitiesLabelMultiCheckbox.nth(j).click()
        }
        await amenitiesCustomAddButton.click()
        for (let k = 0; k < 3; k++) {
            await amenitiesCustomTextbox.fill(`testing on process ${k + 1}`)
            await amenitiesCustomSaveButton.click()
        }
        await amenitiesSaveButton.click()
    }
    async uploadSafety() {
        const { amenitiesEditMultiButton, amenitiesLabelMultiCheckbox, amenitiesCustomAddButton, amenitiesCustomTextbox, amenitiesCustomSaveButton, amenitiesSaveButton } = webElement.pageElement(this.page)
        await this.page.waitForTimeout(500)
        await amenitiesEditMultiButton.nth(3).click()
        const labelOptionCount = await amenitiesLabelMultiCheckbox.count()
        for (let j = 0; j < labelOptionCount; j++) {
            await amenitiesLabelMultiCheckbox.nth(j).click()
        }
        await amenitiesCustomAddButton.click()
        for (let k = 0; k < 3; k++) {
            await amenitiesCustomTextbox.fill(`testing on process ${k + 1}`)
            await amenitiesCustomSaveButton.click()
        }
        await amenitiesSaveButton.click()
    }
    async uploadEnvironment() {
        const { amenitiesEditMultiButton, amenitiesLabelMultiCheckbox, amenitiesCustomAddButton, amenitiesCustomTextbox, amenitiesCustomSaveButton, amenitiesSaveButton } = webElement.pageElement(this.page)
        await this.page.waitForTimeout(500)
        await amenitiesEditMultiButton.nth(4).click()
        const labelOptionCount = await amenitiesLabelMultiCheckbox.count()
        for (let j = 0; j < labelOptionCount; j++) {
            await amenitiesLabelMultiCheckbox.nth(j).click()
        }
        await amenitiesCustomAddButton.click()
        for (let k = 0; k < 3; k++) {
            await amenitiesCustomTextbox.fill(`testing on process ${k + 1}`)
            await amenitiesCustomSaveButton.click()
        }
        await amenitiesSaveButton.click()
    }

}
module.exports = { addAmenities }