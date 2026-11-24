const { test, expect } = require("../../utils/authFixture");
const {
  skipIfDisabled,
  skipTestIfDisabled,
} = require("../../utils/moduleGuard");
const { CURRENT_ENV } = require("../../config/env.config");
const { StockGrant } = require("../../modules/partners/pages/StockGrantPage");
const {
  SwitchAccount,
} = require("../../modules/partners/pages/SwitchAccountPage");

let page;
let stockGrant;
let switchAccount;

test.beforeEach(async ({ authPage }) => {
  if (page === authPage) return;
  page = authPage;
  stockGrant = new StockGrant(page, expect);
  switchAccount = new SwitchAccount(page, expect);
});

test.describe("PARTNERS PAGE", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async () => {
    test.setTimeout(180000);
  });

  skipIfDisabled("partners");

  test("Create Lead", async () => {
    skipTestIfDisabled("partners", "createLead");
    await page.goto(CURRENT_ENV.partnersUrl);
    await stockGrant.stockGrant();
  });

  test("SWITCH ACCOUNT ", async () => {
    skipTestIfDisabled("partners", "switchAccount");
    await page.goto(CURRENT_ENV.partnersUrl);
    await switchAccount.logout();
    await switchAccount.login();
    await switchAccount.stockGrant();
  });
});
