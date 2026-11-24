const { WebElement } = require("../../../utils/WebElements");
const { test, expect } = require("@playwright/test");
const exp = require("constants");
const path = require("path");

const webElement = new WebElement();
class Theme {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
  async goto(url) {
    await this.page.goto(url);
  }

  async personalization() {
    const {
      theme,
      personalization,
      editButtonPersonalization,
      selectThemes,
      previewpersonalization,
      previewBackButton,
      savePersonalization,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(1000);

    if (!(await personalization.isVisible())) {
      await theme.click();
      try {
        await personalization.waitFor({ state: "visible", timeout: 5000 });
      } catch (e) {
        await theme.click();
        await personalization.waitFor({ state: "visible", timeout: 10000 });
      }
    }
    await personalization.click();
    await editButtonPersonalization.click();
    await selectThemes.nth(1).click();
    await previewpersonalization.click();
    await previewBackButton.click();
    await savePersonalization.click();
  }
  async header() {
    const {
      theme,
      headerButton,
      editHeader,
      headerAddMenu,
      texts,
      links,
      headerEmail,
      headerMobileNumber,
      remove,
      headermenuIteamDeleteIteam,
      saveHeaderButton,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);
    if (!(await headerButton.isVisible())) {
      await theme.click();
      await headerButton.waitFor({ state: "visible", timeout: 10000 });
    }
    await headerButton.click();
    await editHeader.nth(0).click();
    await this.page.waitForTimeout(500);
    const existingCount = await texts.count();
    const needed = Math.max(0, 11 - existingCount);
    for (let i = 0; i < needed; i++) {
      if (await headerAddMenu.isVisible()) {
        await headerAddMenu.click();
        await this.page.waitForTimeout(300);
      }
    }
    await texts.nth(3).waitFor({ state: "visible", timeout: 15000 });
    await texts.nth(3).fill("mail");
    await expect(texts.nth(3)).toHaveValue("mail");
    await links.nth(7).fill("https://mail.google.com/mail/u/0/#inbox");
    await expect(links.nth(7)).toHaveValue(
      "https://mail.google.com/mail/u/0/#inbox"
    );
    await texts.nth(4).fill("Mysite");
    await expect(texts.nth(4)).toHaveValue("Mysite");
    await links.nth(9).fill("https://devin.realiti.tech/mysite");
    await expect(links.nth(9)).toHaveValue("https://devin.realiti.tech/mysite");

    await texts.nth(5).fill("Stock");
    await expect(texts.nth(5)).toHaveValue("Stock");

    await links.nth(11).fill("https://devin.realiti.tech/lead");
    await expect(links.nth(11)).toHaveValue("https://devin.realiti.tech/lead");

    await texts.nth(6).fill("Lead");
    await expect(texts.nth(6)).toHaveValue("Lead");

    await links.nth(13).fill("https://devin.realiti.tech/lead");
    await expect(links.nth(13)).toHaveValue("https://devin.realiti.tech/lead");

    await texts.nth(7).fill("partners");
    await expect(texts.nth(7)).toHaveValue("partners");
    await links
      .nth(15)
      .fill("https://devin.realiti.tech/mynetwork/myconnections");
    await expect(links.nth(15)).toHaveValue(
      "https://devin.realiti.tech/mynetwork/myconnections"
    );
    await texts.nth(8).fill("LinkedIn");
    await expect(texts.nth(8)).toHaveValue("LinkedIn");
    await links.nth(17).fill("https://www.linkedin.com/login");
    await expect(links.nth(17)).toHaveValue("https://www.linkedin.com/login");
    await texts.nth(9).fill("instagram");
    await expect(texts.nth(9)).toHaveValue("instagram");
    await links.nth(19).fill("https://www.instagram.com/");
    await expect(links.nth(19)).toHaveValue("https://www.instagram.com/");
    await texts.nth(10).fill("facebook");
    await expect(texts.nth(10)).toHaveValue("facebook");
    await links.nth(21).fill("https://www.facebook.com/");
    await expect(links.nth(21)).toHaveValue("https://www.facebook.com/");

    // Verify added confirmation
    const totalMenuCount = await texts.count();
    expect(totalMenuCount).toBeGreaterThanOrEqual(11);
    console.log(
      `[Header Menu] Added all menu items successfully. Total count: ${totalMenuCount}`
    );

    // Delete all menu items
    const deleteButtons = headermenuIteamDeleteIteam || remove;
    const initialDeleteCount = await deleteButtons.count();
    console.log(
      `[Header Menu] Deleting all menu items (${initialDeleteCount} items found)...`
    );

    while ((await deleteButtons.count()) > 0) {
      const deleteBtn = deleteButtons.first();
      const isDisabled =
        (await deleteBtn.getAttribute("disabled")) !== null ||
        (await deleteBtn.isDisabled({ timeout: 500 }).catch(() => false));

      if (isDisabled) {
        console.log(
          "[Header Menu] Delete button is disabled, stopping deletion."
        );
        break;
      }

      await deleteBtn.click();
      const confirmModal = this.page.locator(
        '//div[contains(@class,"modal") or contains(@role,"dialog")]//button[normalize-space()="Delete"] | //button[normalize-space()="Confirm"]'
      );
      if (await confirmModal.isVisible({ timeout: 1000 }).catch(() => false)) {
        await confirmModal.click();
      }
      await this.page.waitForTimeout(300);
    }

    // Verify deletion confirmation
    const remainingDeleteCount = await deleteButtons.count();
    if (remainingDeleteCount === 0) {
      expect(remainingDeleteCount).toBe(0);
      console.log(
        "[Header Menu] All menu items deleted successfully. Deletion confirmed."
      );
    } else {
      console.log(
        `[Header Menu] Remaining items: ${remainingDeleteCount} (delete button disabled).`
      );
    }

    const randomEmail = `sample${Math.floor(Math.random() * 100)}@gmail.com`;
    await headerEmail.fill(randomEmail);
    const randomPhNumber =
      "9" + Math.floor(100000000 + Math.random() * 900000000);
    await headerMobileNumber.fill(randomPhNumber);
    await expect(headerMobileNumber).toHaveValue(randomPhNumber);
    await saveHeaderButton.click();
    await this.page.waitForTimeout(1000);
  }
  async footer() {
    const {
      theme,
      footerButton,
      editFooter,
      removeFooterSections,
      sectionTitle,
      streetAddress,
      mobileNumber,
      email,
      linkName,
      footerURL,
      addSelection,
      addFooterLink,
      footerVisibility,
      previewFooter,
      previewFooterBackButton,
      saveFooterButton,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);
    if (!(await footerButton.isVisible())) {
      await theme.click();
      await footerButton.waitFor({ state: "visible", timeout: 10000 });
    }
    await footerButton.click();
    await this.page.waitForTimeout(500);
    await editFooter.click();
    await this.page.waitForTimeout(1000);
    // await removeFooterSections.click();
    const sectionTitles = [
      "Corporate Office",
      "Headquarters",
      "Branch Office",
      "Regional Office",
      "Customer Service",
    ];
    const streetAddresses = [
      "K K Nagar, R.S.Puram, K K Nagar, Tiruchirappalli, 641002, Tamil Nadu, India",
      "New Street, City Center, Downtown, Chennai, 600001, Tamil Nadu, India",
      "MG Road, Koramangala, Bangalore, 560034, Karnataka, India",
      "Park Avenue, Sector 17, Gurgaon, 122018, Haryana, India",
      "Tech Park, Whitefield, Bangalore, 560066, Karnataka, India",
    ];

    const Name = ["Google", "Facebook", "Instagram", "LinkedIn", "News"];
    const LinkName = [
      "https://google.com",
      "https://www.facebook.com/",
      "https://www.instagram.com/",
      "https://www.linkedin.com/login",
      "https://devin.realiti.tech/lead",
    ];

    for (let i = 0; i < 6; i++) {
      // Select random section title & address
      const randomSectionTitle =
        sectionTitles[Math.floor(Math.random() * sectionTitles.length)];
      const randomStreetAddress =
        streetAddresses[Math.floor(Math.random() * streetAddresses.length)];
      await sectionTitle.fill(randomSectionTitle);
      await streetAddress.fill(randomStreetAddress);
      const randomPhNumber =
        "9" + Math.floor(100000000 + Math.random() * 900000000);
      await mobileNumber.fill(randomPhNumber);
      await expect(mobileNumber).toHaveValue(randomPhNumber);
      const randomEmail = `test${Math.floor(Math.random() * 100)}@example.com`;
      await email.fill(randomEmail);
      await expect(email).toHaveValue(randomEmail);
      for (let j = 0; j < 3; j++) {
        const randomName = Name[Math.floor(Math.random() * Name.length)];
        const randomLink =
          LinkName[Math.floor(Math.random() * LinkName.length)];

        if (j < 2 && (await linkName.count()) <= j + 1) {
          if (await addFooterLink.isVisible()) {
            await addFooterLink.click();
            await this.page.waitForTimeout(500);
          }
        }
        if (await linkName.nth(j).isVisible()) {
          await linkName.nth(j).fill(randomName);
          await footerURL.nth(j).fill(randomLink);
        }
      }
      if (i < 5 && (await addSelection.isVisible())) {
        await addSelection.click();
        await this.page.waitForTimeout(500);
      }
    }

    // Verify added confirmation
    const addedSectionCount = await removeFooterSections.count();
    console.log(
      `[Footer Sections] Added footer sections. Found ${addedSectionCount} section remove buttons.`
    );
    expect(addedSectionCount).toBeGreaterThan(0);

    // Delete all sections
    console.log("[Footer Sections] Deleting all footer sections...");
    while ((await removeFooterSections.count()) > 1) {
      const deleteBtn = removeFooterSections.first();
      const isDisabled =
        (await deleteBtn.getAttribute("disabled")) !== null ||
        (await deleteBtn.isDisabled({ timeout: 500 }).catch(() => false));

      if (isDisabled) {
        console.log(
          "[Footer Sections] Delete button is disabled, cannot delete further."
        );
        break;
      }

      await deleteBtn.click();
      const confirmModal = this.page.locator(
        '//div[contains(@class,"modal") or contains(@role,"dialog")]//button[normalize-space()="Delete"] | //button[normalize-space()="Confirm"]'
      );
      if (await confirmModal.isVisible({ timeout: 1000 }).catch(() => false)) {
        await confirmModal.click();
      }
      await this.page.waitForTimeout(500);
    }

    // Verify deletion confirmation
    const remainingSections = await removeFooterSections.count();
    if (remainingSections === 0) {
      expect(remainingSections).toBe(0);
      console.log(
        "[Footer Sections] All footer sections deleted successfully. Deletion confirmed."
      );
    } else {
      console.log(
        `[Footer Sections] Remaining sections: ${remainingSections} (delete button disabled).`
      );
    }

    await footerVisibility.click();

    await previewFooter.click();
    await previewFooterBackButton.click();
    await saveFooterButton.click();
  }
  async socialMedia() {
    const {
      theme,
      socialMediabutton,
      editSocialMedia,
      addFacebookLink,
      addTwitterlink,
      addYoutubelink,
      addInstalink,
      addLinkedInlink,
      addPrintestlink,
      topBarButton,
      fotterBarButton,
      faceBookButton,
      twitterButton,
      youtubeButton,
      instaButton,
      linkedInButton,
      printestButton,
      saveSocialMediaButton,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);
    if (!(await socialMediabutton.isVisible())) {
      await theme.click();
      await socialMediabutton.waitFor({ state: "visible", timeout: 10000 });
    }
    await socialMediabutton.click();
    await editSocialMedia.click();
    await topBarButton.nth(0).click();
    await fotterBarButton.nth(1).click();
    await addFacebookLink.nth(1).fill("https://www.facebook.com/login/");
    await expect(addFacebookLink.nth(1)).toHaveValue(
      "https://www.facebook.com/login/"
    );
    await faceBookButton.nth(0).click();
    await addTwitterlink.nth(3).fill("https://www.x.com");
    await expect(addTwitterlink.nth(3)).toHaveValue("https://www.x.com");
    await twitterButton.nth(1).click();
    await addYoutubelink.nth(5).fill("https://www.youtube.com/");
    await expect(addYoutubelink.nth(5)).toHaveValue("https://www.youtube.com/");
    await youtubeButton.nth(2).click();
    await addInstalink.nth(7).fill("https://www.instagram.com/");
    await expect(addInstalink.nth(7)).toHaveValue("https://www.instagram.com/");
    await instaButton.nth(3).click();
    await addLinkedInlink.nth(9).fill("https://www.linkedin.com/login/in");
    await expect(addLinkedInlink.nth(9)).toHaveValue(
      "https://www.linkedin.com/login/in"
    );
    await linkedInButton.nth(4).click();
    await addPrintestlink.nth(11).fill("https://www.pinterest.com/");
    await expect(addPrintestlink.nth(11)).toHaveValue(
      "https://www.pinterest.com/"
    );
    await printestButton.nth(5).click();
    await saveSocialMediaButton.click();
  }
  async favIcon() {
    const {
      theme,
      faviconAndLogoButton,
      editFavicon,
      faviconUploadButton,
      faviconReplaceButton,
      logoAddLink,
      LinkText,
      saveLink,
      saveFaviconButton,
      saveAndPublishFavicon,
      editLogoButton,
      logoUploadButton,
      logoReplaceButton,
      saveLogoButton,
      saveAndPublishlogo,
      faviconImageUpload,
      faviconSubmitButton,
      logoImageUpload,
      logoCircleButton,
      logoSqureButton,
      logoRectangleButton,
      logoSubmitButton,
    } = webElement.pageElement(this.page);

    await this.page.waitForTimeout(500);
    if (!(await faviconAndLogoButton.isVisible())) {
      await theme.click();
      await faviconAndLogoButton.waitFor({ state: "visible", timeout: 10000 });
    }
    await faviconAndLogoButton.click();
    await editFavicon.click();
    if (await faviconUploadButton.isVisible()) {
      await faviconUploadButton.click();
      await faviconImageUpload.setInputFiles(path.join(__dirname, "../../../resources/images/pexels3.jpg"));
      await faviconSubmitButton.click();
    } else if (await faviconReplaceButton.isVisible()) {
      await faviconReplaceButton.click();
      await faviconImageUpload.setInputFiles(path.join(__dirname, "../../../resources/images/pexels3.jpg"));
      await faviconSubmitButton.click();
    }

    await saveFaviconButton.click();
    await editLogoButton.click();

    if (await logoUploadButton.isVisible()) {
      await logoUploadButton.click();
      await logoImageUpload.setInputFiles(path.join(__dirname, "../../../resources/images/pexels3.jpg"));
      await faviconSubmitButton.click();
    } else if (await logoReplaceButton.isVisible()) {
      await logoReplaceButton.click();
      // await logoCircleButton.click()
      await logoSqureButton.click();
      // await logoRectangleButton.click()
      await logoImageUpload.setInputFiles(path.join(__dirname, "../../../resources/images/pexels3.jpg"));
      await logoSubmitButton.click();
    }

    await logoAddLink.click();
    await LinkText.fill("https://devin.realiti.tech/mysite");
    await expect(LinkText).toHaveValue("https://devin.realiti.tech/mysite");
    await saveLink.click();
    await saveLogoButton.click();
  }
}
module.exports = { Theme };
