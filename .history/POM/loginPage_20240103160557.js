const { WebElement } = require('../Utils/GuiWebElements')
const webElement = new WebElement()

class loginPage {

    constructor(page, expect) {
        this.page = page
        this.expect = expect
    }
    async goto(url) {
        await this.page.goto(url)
    }
    async validCredential(phoneNumber, passPin) {
        const { phoneTextbox, passwordTextbox, signInButton, profileButton, signOutButton } = webElement.pageElement(this.page)
        await phoneTextbox.fill(phoneNumber)
        await passwordTextbox.fill(passPin)
        await signInButton.click()
        await clg
        if (this.page.title() == 'Home') {
            await profileButton.click()
            await signOutButton.click()
        }
    }
    //toHaveTitle(/Home|GettingStart/)
    async invalidPhonenumber(phoneNumber, passPin) {
        const { phoneTextbox, passwordTextbox, signInButton, invalidErrorMsg } = webElement.pageElement(this.page)
        await phoneTextbox.fill(phoneNumber)
        await passwordTextbox.fill(passPin)
        await signInButton.click()
        await this.expect(invalidErrorMsg).toContainText('User Does Not Exist')
    }
    async invalidPasspin(phoneNumber, passPin) {
        const { phoneTextbox, passwordTextbox, signInButton, invalidErrorMsg } = webElement.pageElement(this.page)
        await phoneTextbox.fill(phoneNumber)
        await passwordTextbox.fill(passPin)
        await signInButton.click()
        await this.expect(invalidErrorMsg).toContainText('Invalid credentials')
    }
    async blankPhonenumber(passPin) {
        const { phoneTextbox, passwordTextbox, signInButton, blankErrorMsg } = webElement.pageElement(this.page)
        await phoneTextbox.fill('')
        await passwordTextbox.fill(passPin)
        await signInButton.click()
        await this.expect(blankErrorMsg.first()).toContainText('Field is required*')
    }
    async blankPasspin(phoneNumber) {
        const { phoneTextbox, passwordTextbox, signInButton, blankErrorMsg } = webElement.pageElement(this.page)
        await phoneTextbox.fill(phoneNumber)
        await passwordTextbox.fill('')
        await signInButton.click()
        await this.expect(blankErrorMsg.last()).toContainText('Field is required*')
    }
    async blankPhone_Pass() {
        const { phoneTextbox, passwordTextbox, signInButton, blankErrorMsg } = webElement.pageElement(this.page)
        await phoneTextbox.fill('')
        await passwordTextbox.fill('')
        await signInButton.click()
        await this.expect(blankErrorMsg.first()).toContainText('Field is required*')
        await this.expect(blankErrorMsg.last()).toContainText('Field is required*')
    }
    async forgotPasspin() {
        const { forgotPinLink } = webElement.pageElement(this.page)
        await forgotPinLink.click();
        await this.expect(this.page).toHaveTitle('Forgot Pass Pin')
    }

    //sample
    async logIn(phoneNumber, passPin) {
        const { phoneTextbox, passwordTextbox, signInButton, stockMenuButton } = webElement.pageElement(this.page)
        await phoneTextbox.fill(phoneNumber)
        await passwordTextbox.fill(passPin)
        await signInButton.click()
        await this.expect(this.page).toHaveTitle(/Home|GettingStart/)
    }

}
module.exports = { loginPage }