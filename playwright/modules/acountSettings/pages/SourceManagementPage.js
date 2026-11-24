const { WebElement } = require("../../../utils/WebElements");
const webElement = new WebElement();
const { generateRandomName } = require("../../../utils/RandomDataUtils");

class SourceManagementPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await this.page.waitForTimeout(1000);
  }

  /**
   * Complete Source Management scenario:
   * 1. Click the Source button.
   * 2. Click Add New Source.
   * 3. Enter Source Heading.
   * 4. Enable the source using sourceenableordisablebutton.
   * 5. Enter Source Display Name.
   * 6. Enter Source Parameter.
   * 7. Enter Source Code.
   * 8. Click trackingCodeGenerateButton.
   * 9. Click openChannelDropDown.
   * 10. Enter the channel name in createChanneltextBox.
   * 11. Click channelAddButton.
   * 12. Select the first channel using selectChannel.
   * 13. Click Add User and select the first staff member.
   * 14. Click Add User again and select the second staff member.
   * 15. Click Save.
   * 16. Verify the source is created successfully.
   */
  async sourceManagement() {
    const {
      source,
      addNewSourceButton,
      sourceHeading,
      sourceenableordisablebutton,
      sourceDisplyName,
      sourceparameter,
      sourceCode,
      trackingCodeGenerateButton,
      openChannelDropDown,
      createChanneltextBox,
      channelAddButton,
      selectChannel,
      addUser,
      selectStaffmember,
      sourceSaveButton,
    } = webElement.pageElement(this.page);

    // 1. Click the Source button.
    await source.first().waitFor({ state: "visible", timeout: 20000 });
    await source.first().click();

    // 2. Click Add New Source.
    await addNewSourceButton.first().waitFor({ state: "visible", timeout: 20000 });
    await addNewSourceButton.first().click();

    // 3. Enter Source Heading.
    const rnd = Math.floor(1000 + Math.random() * 9000);
    const headingText = `Source ${generateRandomName(5)} ${rnd}`;
    await sourceHeading.first().waitFor({ state: "visible", timeout: 15000 });
    await sourceHeading.first().fill(headingText);
    await this.expect(sourceHeading.first()).toHaveValue(headingText);

    // 4. Enable the source using sourceenableordisablebutton.
    if (await sourceenableordisablebutton.first().isVisible().catch(() => false)) {
      await sourceenableordisablebutton.first().click();
    }

    // 5. Enter Source Display Name.
    const displayName = `Display ${generateRandomName(5)} ${rnd}`;
    await sourceDisplyName.fill(displayName);
    await this.expect(sourceDisplyName).toHaveValue(displayName);

    // 6. Enter Source Parameter.
    const param = `p${Math.floor(100 + Math.random() * 899)}`;
    await sourceparameter.fill(param);
    await this.expect(sourceparameter).toHaveValue(param);

    // 7. Enter Source Code.
    const code = `C${Math.floor(100 + Math.random() * 899)}`;
    await sourceCode.fill(code);
    await this.expect(sourceCode).toHaveValue(code);

    // 8. Click trackingCodeGenerateButton.
    await trackingCodeGenerateButton.click();

    // 9. Click openChannelDropDown.
    await openChannelDropDown.first().click();

    // 10. Enter the channel name in createChanneltextBox.
    const channelName = `Chan_${generateRandomName(4)}`;
    await createChanneltextBox.fill(channelName);
    await this.expect(createChanneltextBox).toHaveValue(channelName);

    // 11. Click channelAddButton.
    await channelAddButton.click();

    // 12. Select the first channel using selectChannel.
    await selectChannel.first().waitFor({ state: "visible", timeout: 10000 });
    await selectChannel.first().click();

    // 13. Click Add User and select the first staff member.
    await addUser.click();
    await selectStaffmember.first().waitFor({ state: "visible", timeout: 10000 });
    await selectStaffmember.first().click();

    // 14. Click Add User again and select the second staff member.
    await addUser.click();
    const secondStaff = selectStaffmember.nth(1);
    if (await secondStaff.isVisible().catch(() => false)) {
      await secondStaff.click();
    }

    // 15. Click Save.
    await sourceSaveButton.click();

    // 16. Verify the source is created successfully.
    const createdSource = this.page.locator(`text="${headingText}"`).first();
    await createdSource.waitFor({ state: "visible", timeout: 20000 });
    await this.expect(createdSource).toBeVisible();

    return { headingText, displayName };
  }
}

module.exports = { SourceManagementPage };
