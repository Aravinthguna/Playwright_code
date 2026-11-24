const { WebElement } = require('../../../utils/GuiWebElements')
const webElement = new WebElement()

class MenuSettingPage {

    constructor(page, expect) {
        this.page = page
        this.expect = expect
    }
    async navigateToMenuSetting(url) {
        const { menuModuleButton } = webElement.pageElement(this.page)
        await this.page.goto(url)
        await menuModuleButton.click()
    }
    async navigateToEdit() {
        const { menuEditButton } = webElement.pageElement(this.page)
        await menuEditButton.click()
    }
    async addRandomNumberOfMenu() {
        const { menuAddButton } = webElement.pageElement(this.page)
        await this.page.waitForTimeout(500)
        const menuList = await this.page.locator("//tr[contains(@class,'bg-white')]").count()
        let randomNumberMenu = Math.floor(Math.random() * 8) + 4;
        console.log("randomNumberMenu", randomNumberMenu);
        for (let i = menuList; i < randomNumberMenu; i++) {
            await menuAddButton.click()
        }
    }
    async fillMenuLabelAndUrl() {
        const { menuLabelEmptyTextbox, menuUrlEmptyTextbox } = webElement.pageElement(this.page)
        const emptyMenuTextbox = await this.page.locator("//div[@class='relative ']//input[@value='']").count()
        for (let i = 0; i < emptyMenuTextbox; i++) {
            await menuLabelEmptyTextbox.nth(0).fill(`Menu ${i + 1}`)
            await menuUrlEmptyTextbox.nth(0).fill('https://www.google.com/')
        }
    }
    async extractMenuValues(menu) {
        const addedMenuLabel = await this.page.locator('//tr//input[@type="text"]').count()
        for (let i = 0; i < addedMenuLabel; i++) {
            const menuLabel = await this.page.locator('//tr//input[@type="text"]').nth(i).getAttribute('value')
            const menuValue = await this.page.locator('//td[contains(@class,"hidden py-4 lg")]//input').nth(i).getAttribute('value')
            menu[menuLabel] = menuValue
        }
    }
    async addPhoneAndEmail(menuPhone, menuEmail) {
        const { menuPhoneTextbox, menuEmailTextbox } = webElement.pageElement(this.page)
        await menuPhoneTextbox.fill('sajin@test.com')
        await menuEmailTextbox.fill('9000000000')
    }
    async saveMenu() {
        const { menuSaveButton } = webElement.pageElement(this.page)
        await menuSaveButton.click()
    }
    async customPublish() {
        const { customPublish, publishMessageClose } = webElement.pageElement(this.page)
        await customPublish.click()
        await publishMessageClose.click()
    }
    async navigateToDotsite() {
        const { publishModuleButton, visitSiteButton } = webElement.pageElement(this.page)
        await publishModuleButton.click()
        await visitSiteButton.click()
    }

}
module.exports = { MenuSettingPage }
