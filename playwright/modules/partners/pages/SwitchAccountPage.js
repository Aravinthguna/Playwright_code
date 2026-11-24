const { WebElement } = require("../../../utils/WebElements");
const { StockGrant } = require("./StockGrantPage"); // path to your file
const path = require("path");

const webElement = new WebElement();

class SwitchAccount {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
  async goto(url) {
    await this.page.goto(url);
  }

  async logout() {
    const { profileButton, signOutButton } = webElement.pageElement(this.page);
    await profileButton.click();
    await signOutButton.click();
  }

  async login() {
     const phNumberArray = [
  "7650270408",
  "0000000001",
  "7305711581",
  "0000000006",
  "6666666666",
  "7760279160",
  "8220548887",
  "8248673831",
  "9361505487",
  "9686620422",
  "9789593505",
];
function getRandomPhoneNumber() {
  const randomIndex = Math.floor(Math.random() * phNumberArray.length);
  return phNumberArray[randomIndex];
}
const randomPhoneNumber = getRandomPhoneNumber();
    const { phoneNumberField, passwordField, signButton } =
      webElement.pageElement(this.page);

    await phoneNumberField.fill(randomPhoneNumber);
    await passwordField.fill("no1234");
    await signButton.click();
  }

  async stockGrant() {
    const {
      myconnections,
      comapanyName,
      acceptButton,
      connect,
      GainorGrantButton,
      textarea,
      sentButton,
      addFileButton,
      AddImage,
      addAudio,
      addVideo,
      addDocument,
      backButton,
      refreshButton,
      ganiButton,
      gainCloseButton,
      grantButton,
      unitCheckBox,
      dotButton,
      stockgrantButton,
      threadButton,
      threadSubjectName,
      threadCreatButton,
      downloadPartners,
      partnerFilter,
      types,
      detailsButton,
      threeDotButton,
      disconnectPartners,
      disConectYes,
      sentConnectButton,
    } = webElement.pageElement(this.page);
    await myconnections.click();
    await comapanyName.click();
    await GainorGrantButton.nth(0).click();
    await acceptButton.click();
    const randomText = `abcdefghijklmnopqrstuvwxyz${Math.floor(
      Math.random() * 1000
    )}`;
    await textarea.fill(randomText);
    await sentButton.click();
    await addFileButton.click();
    await AddImage.setInputFiles(path.join(__dirname, "../../../resources/images/pexels7.jpg"));
    await sentButton.click();
    await page.waitForTimeout(600);
    await addFileButton.click();
    await addAudio.setInputFiles(path.join(__dirname, "../../../resources/audio/file_example_MP3_700KB.mp3"));
    await sentButton.click();
    await addFileButton.click();
    await addVideo.setInputFiles(
      path.join(__dirname, "../../../resources/video/3773486-hd_1920_1080_30fps.mp4")
    );
    await sentButton.click();
    await page.waitForTimeout(900);
    await addFileButton.click();
    await addDocument.setInputFiles(path.join(__dirname, "../../../resources/documents/Brochure.pdf"));

    await sentButton.click();
    await page.waitForTimeout(600);
    await backButton.click();
    await refreshButton.nth(0).click();
    await ganiButton.nth(1).click();
    await gainCloseButton.click();
    await grantButton.nth(2).click();
    await unitCheckBox.nth(0).click();
    await dotButton.click();
    await stockgrantButton.nth(0).click();
    await threadButton.nth(3).click();
    const randomName = `Test${Math.floor(Math.random() * 1000)}Sample`;
    await threadSubjectName.fill(randomName);
    await threadCreatButton.nth(1).click();
    await textarea.fill(randomText);
    await sentButton.click();
    await addFileButton.click();
    await AddImage.setInputFiles(path.join(__dirname, "../../../resources/images/pexels6.jpg"));
    await sentButton.click();
    await page.waitForTimeout(600);
    await addFileButton.click();
    await addAudio.setInputFiles(path.join(__dirname, "../../../resources/audio/file_example_MP3_700KB.mp3"));
    await sentButton.click();
    await addFileButton.click();
    await addVideo.setInputFiles(
      path.join(__dirname, "../../../resources/video/3773486-hd_1920_1080_30fps.mp4")
    );
    await sentButton.click();
    await page.waitForTimeout(900);
    await addFileButton.click();
    await addDocument.setInputFiles(path.join(__dirname, "../../../resources/documents/Brochure.pdf"));
    await sentButton.click();
    await page.waitForTimeout(600);
    await backButton.click();
    await downloadPartners.nth(4).click();
    await partnerFilter.nth(1).click();
    await types.click();
    await detailsButton.nth(5).click();
    await threeDotButton.nth(0).click();
    await disconnectPartners.click();
    await disConectYes.nth(1).click();
    await sentConnectButton.nth(0).click();
  }
}

module.exports = { SwitchAccount };
