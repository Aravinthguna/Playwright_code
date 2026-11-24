const { test, expect } = require('@playwright/test')
const { skipIfDisabled, skipTestIfDisabled } = require('../../utils/moduleGuard')
const { WebElement } = require('../../utils/GuiWebElements')
const webElement = new WebElement()

test.describe('LogIn Page TestCases', async () => {
  skipIfDisabled('login')

    test('LG0001, Verify that a user can successfully log in with valid credentials.', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0001')
        const { phoneTextbox, passwordTextbox, signInButton } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await phoneTextbox.fill('7760279160')
        await passwordTextbox.fill('no1234')
        await signInButton.click()
        await expect(page).toHaveTitle(/^(GettingStart|Home)$/i)

    })

    test('LG0002, Verify that a user cannot log in with an invalid Mobile number.', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0002')
        const { phoneTextbox, passwordTextbox, signInButton, invalidErrorMsg } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await phoneTextbox.fill('9864728399')
        await passwordTextbox.fill('no1234')
        await signInButton.click()
        await expect(invalidErrorMsg).toContainText("User Does Not Exist")

    })

    test('LG0003, Verify that a user cannot log in with an invalid passpin.', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0003')
        const { phoneTextbox, passwordTextbox, signInButton, invalidErrorMsg } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await phoneTextbox.fill('9999999996')
        await passwordTextbox.fill('no0001')
        await signInButton.click()
        await expect(invalidErrorMsg).toContainText("Invalid credentials")

    })

    test('LG0004, Verify that a user cannot log in with an empty Mobile number field.', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0004')
        const { passwordTextbox, signInButton, blankErrorMsg } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await passwordTextbox.fill('no0001')
        await signInButton.click()
        await expect(blankErrorMsg).toContainText("Field is required*")

    })

    test('LG0005, Verify that a user cannot log in with an empty passpin field.', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0005')
        const { phoneTextbox, signInButton, blankErrorMsg } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await phoneTextbox.fill('9999999996')
        await signInButton.click()
        await expect(blankErrorMsg).toContainText("Field is required*")

    })

    test('LG0006, Verify that the system handles invalid Mobile number formats', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0006')
        const { phoneTextbox, passwordTextbox, signInButton, blankErrorMsg } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await phoneTextbox.fill('12345')
        await passwordTextbox.fill('no1234')
        await signInButton.click()
        await expect(blankErrorMsg).toContainText("Enter valid number*")
        await page.reload()
        await expect(page).toHaveTitle('Realiti.io')
        await phoneTextbox.fill('123456789012345')
        await passwordTextbox.fill('no1234')
        await signInButton.click()
        await expect(blankErrorMsg).toContainText("Enter valid number*")

    })

    test('LG0007, Verify that the system handles invalid passpin formats', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0007')
        const { phoneTextbox, passwordTextbox, signInButton, invalidErrorMsg, blankErrorMsg } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await phoneTextbox.fill('9999999993')
        await passwordTextbox.fill('123456')
        await signInButton.click()
        await expect(invalidErrorMsg).toContainText("Invalid Request Parameters")
        await page.reload()
        await expect(page).toHaveTitle('Realiti.io')
        await phoneTextbox.fill('9999999993')
        await passwordTextbox.fill('no123456')
        await signInButton.click()
        await expect(blankErrorMsg).toContainText("Enter valid passpin*")

    })

    test('LG0008, Verify that the "Forgot Password" link redirects to the correct page', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0008')
        const { forgotPinLink } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await forgotPinLink.click()
        await expect(page).toHaveTitle('Forgot Pass Pin')

    })

    test('LG0009, Verify that user can recieve opt in Forgot passpin with valid mobile number', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0009')
        const { forgotPinLink, phoneTextbox, signInButton } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await forgotPinLink.click()
        await expect(page).toHaveTitle('Forgot Pass Pin')
        await phoneTextbox.fill('9999999993')
        await signInButton.click()
        await expect(page).toHaveTitle('VerifyOtp')

    })

    test('LG0010, Verify that user cannot recieve opt in Forgot passpin with invalid mobile number', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0010')
        const { forgotPinLink, phoneTextbox, signInButton, invalidErrorMsgInForgot } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await forgotPinLink.click()
        await expect(page).toHaveTitle('Forgot Pass Pin')
        await phoneTextbox.fill('9999964523')
        await signInButton.click()
        await expect(invalidErrorMsgInForgot).toContainText("user does not exist")

    })

    test('LG0011, Verify that the system handles invalid Mobile number formats in Forgot passpin', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0011')
        const { forgotPinLink, phoneTextbox, signInButton, blankErrorMsg } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await forgotPinLink.click()
        await expect(page).toHaveTitle('Forgot Pass Pin')
        await phoneTextbox.fill('8787364716487723')
        await signInButton.click()
        await expect(blankErrorMsg).toContainText("Enter valid number*")

    })

    test('LG0012, Verify that the user can successfully sign out of the system.', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0012')
        const { passwordTextbox, phoneTextbox, signInButton, profileButton, signOutButton } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await phoneTextbox.fill('9999999996')
        await passwordTextbox.fill('no1234')
        await signInButton.click()
        await expect(page).toHaveTitle(/^(GettingStart|Home)$/i)
        await profileButton.click()
        await signOutButton.click()
        await expect(page).toHaveTitle('Realiti.io')

    })

    test('LG0013, Verify that user can recieve opt in signin via otp with valid mobile number', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0013')
        const { phoneTextbox, siginViaOtpButton, submitOtpButton, optSuccessMsg,resendOtp } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await siginViaOtpButton.click()
        await page.waitForTimeout(300)
        await phoneTextbox.fill('0000000001')
        await submitOtpButton.click()
        await expect(optSuccessMsg).toContainText('Please Enter Your OTP')
        for(let i=0; i<=3; i++){
        await page.waitForTimeout(30000)
        await resendOtp.click();
        }

    })

    test('LG0014, Verify that user cannot recieve opt in signin via otp with invalid mobile number', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0014')
        const { phoneTextbox, siginViaOtpButton, submitOtpButton, invalidErrorMsg } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await siginViaOtpButton.click()
        await page.waitForTimeout(300)
        await phoneTextbox.fill('9999253996')
        await submitOtpButton.click()
        await expect(invalidErrorMsg).toContainText('user does not exist ')

    })

    test('LG0015, Verify that the system handles invalid Mobile number formats in signin via otp', async ({ page }) => {
        skipTestIfDisabled('login', 'LG0015')
        const { phoneTextbox, siginViaOtpButton, submitOtpButton, blankErrorMsg } = webElement.pageElement(page)
        await page.goto('https://devin.realiti.tech/')
        await expect(page).toHaveTitle('Realiti.io')
        await siginViaOtpButton.click()
        await page.waitForTimeout(300)
        await phoneTextbox.fill('9996479253996')
        await submitOtpButton.click()
        await expect(blankErrorMsg).toContainText('Enter valid number*')
        await page.reload()
        await siginViaOtpButton.click()
        await page.waitForTimeout(300)
        await phoneTextbox.fill('253996')
        await submitOtpButton.click()
        await expect(blankErrorMsg).toContainText('Enter valid number*')

    })

})