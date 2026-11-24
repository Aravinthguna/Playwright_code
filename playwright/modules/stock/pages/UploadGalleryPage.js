const { WebElement } = require('../../../utils/GuiWebElements')
const path = require('path')
const webElement = new WebElement()

class uploadGallery {

    constructor(page, expect) {
        this.page = page
        this.expect = expect
    }
    async navigateToGallery() {
        const { galleryModuleButton } = webElement.pageElement(this.page)
        await galleryModuleButton.click()
        await this.expect(this.page.getByRole('heading', { name: 'Gallery' })).toBeVisible()
    }
    async _clickAddFiles(galleryAddButton, galleryAfterAddButton) {
        const addFilesButton = this.page
            .getByRole('button', { name: 'Add Files' })
            .or(galleryAddButton)
            .or(galleryAfterAddButton)
            .first()
        await addFilesButton.click()
    }
    async uploadSiteMap() {
        const { galleryAddButton, galleryImageUploadButton, galleryUploadDoneButton, galleryAfterAddButton, galleryMenuMultiButton } = webElement.pageElement(this.page)
        await galleryMenuMultiButton.nth(0).click()
        await this.page.waitForTimeout(500)
        await this._clickAddFiles(galleryAddButton, galleryAfterAddButton)
        await galleryImageUploadButton.setInputFiles(path.join(__dirname, '../../../resources/images/pexels1.jpg'))
        await galleryUploadDoneButton.click()
        await galleryUploadDoneButton.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {})
    }
    async uploadImage() {
        const { galleryMenuMultiButton, galleryAddButton, galleryImageUploadButton, galleryUploadDoneButton, galleryAfterAddButton } = webElement.pageElement(this.page)
        await galleryMenuMultiButton.nth(1).click()
        await this.page.waitForTimeout(500)
        await this._clickAddFiles(galleryAddButton, galleryAfterAddButton)
        await galleryImageUploadButton.setInputFiles(path.join(__dirname, '../../../resources/images/pexels1.jpg'))
        await galleryUploadDoneButton.click()
        await galleryUploadDoneButton.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {})
    }
    async uploadYoutube() {
        const { galleryMenuMultiButton, galleryAddButton, galleryUploadDoneButton, galleryAfterAddButton, galleryYoutubeUploadTextbox, galleryYoutubePlusButton } = webElement.pageElement(this.page)
        await galleryMenuMultiButton.nth(2).click()
        await this.page.waitForTimeout(500)
        await this._clickAddFiles(galleryAddButton, galleryAfterAddButton)
        await galleryYoutubeUploadTextbox.fill('https://www.youtube.com/watch?v=HY1JLi9TH4o')
        await galleryYoutubePlusButton.click()
        await this.page.waitForTimeout(500)
        await this.expect(galleryUploadDoneButton).toBeEnabled()
        await galleryUploadDoneButton.click()
        await galleryUploadDoneButton.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {})
    }
    async uploadBrochure() {
        const { galleryMenuMultiButton, galleryAddButton, galleryUploadDoneButton, galleryAfterAddButton, galleryImageUploadButton } = webElement.pageElement(this.page)
        await galleryMenuMultiButton.nth(3).click()
        await this.page.waitForTimeout(500)
        await this._clickAddFiles(galleryAddButton, galleryAfterAddButton)
        await galleryImageUploadButton.setInputFiles(path.join(__dirname, '../../../resources/documents/Brochure.pdf'))
        await galleryUploadDoneButton.click()
        await galleryUploadDoneButton.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {})
    }

}
module.exports = { uploadGallery }