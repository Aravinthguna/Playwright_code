const { expect, test } = require('@playwright/test')
const { skipIfDisabled } = require('../../utils/moduleGuard')
const { loginPage } = require('../../modules/auth/pages/LoginPage')
let loginpage
let page
const url = 'https://devin.realiti.tech/'
const phone = '9999999993'
const pin = 'no1234'

test.beforeAll('creating object', async ({ browser }) => {
    page = await browser.newPage()
    loginpage = new loginPage(page, expect)
})

test.describe('Valid Login', () => {
  skipIfDisabled('login')

  test('successful login', async () => {
      await loginpage.goto(url)
      await loginpage.validCredential(phone, pin)
  })
})