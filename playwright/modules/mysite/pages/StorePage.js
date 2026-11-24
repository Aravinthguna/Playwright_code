const { WebElement } = require("../../../utils/WebElements");
const webElement = new WebElement();
const { expect } = require("@playwright/test");

class StorePage {
    constructor(page, expect) {
      this.page = page;
      this.expect = expect;
    }
    async goto(url) {
    await this.page.goto(url);
  }
async storeBanner(){
        const {
          pageButton,
          storeButton,
          editStoreButton,
          storeImgaddFiles,
          storeBannerImguploadButton,
          storeImgSubmitButton,
          deleteBannerCheckBox,
          homeBannerDeletButton,
          ImageLimit,
          previewStoreBanner,
          previewStoreBannerBackButton,
          saveStoreBanner,
        } = webElement.pageElement(this.page);
        await this.page.waitForTimeout(1000);
        if (!(await storeButton.isVisible())) {
          await pageButton.click();
          try {
            await storeButton.waitFor({ state: "visible", timeout: 3000 });
          } catch (e) {
            await pageButton.click();
            await storeButton.waitFor({ state: "visible", timeout: 10000 });
          }
        }
        await storeButton.click();
        await editStoreButton.click();
        await this.page.waitForTimeout(1000);
        for (let i = 0; i < 5; i++) {
          if (await storeImgaddFiles.isVisible()) {
            try {
              await storeImgaddFiles.click({ timeout: 3000 });
              const randomStoreImage = Math.floor(Math.random() * 5) + 1;
              await storeBannerImguploadButton.setInputFiles(`playwright/resources/images/pexels${randomStoreImage}.jpg`);
              await storeImgSubmitButton.click();
              const processing = this.page.locator('text=/Processing image|please wait/i');
              if (await processing.isVisible({ timeout: 2000 }).catch(() => false)) {
                await processing.waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
              }
              await this.page.waitForTimeout(1000);
            } catch (e) {
              break;
            }
          } else {
            break;
          }
        }

        // Follow the same delete flow as Home Banner Images
        // Verify all images are added
        const checkboxList =
          deleteBannerCheckBox || this.page.locator('//input[@name="checkbox"]');
        await checkboxList.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        await this.page.waitForTimeout(1000);
        const addedImageCount = await checkboxList.count();
        console.log(`[Store Banner] Uploaded images count: ${addedImageCount}`);
        expect(addedImageCount).toBeGreaterThan(0);

        // Select each checkbox, click Delete, verify all images are deleted
        console.log(
          `[Store Banner] Deleting all banner images (${addedImageCount} images)...`
        );
        while ((await checkboxList.count()) > 0) {
          const cb = checkboxList.first();
          if (!(await cb.isChecked())) {
            try {
              await cb.click();
            } catch (e) {
              await cb.check({ force: true });
            }
          }

          let deleteBtn = this.page
            .locator(
              '//button[normalize-space()="Delete"] | //div[@class="flex justify-end"]//button'
            )
            .first();
          if (
            !(await deleteBtn.isVisible().catch(() => false)) &&
            homeBannerDeletButton
          ) {
            deleteBtn = homeBannerDeletButton.first();
          }

          if (await deleteBtn.isVisible().catch(() => false)) {
            const isDisabled =
              (await deleteBtn.getAttribute("disabled")) !== null ||
              (await deleteBtn.isDisabled({ timeout: 500 }).catch(() => false));

            if (isDisabled) {
              console.log("[Store Banner] Delete button is disabled.");
              break;
            }

            await deleteBtn.click();
            const confirmModal = this.page.locator(
              '//div[contains(@class,"modal") or contains(@role,"dialog")]//button[normalize-space()="Delete"] | //button[normalize-space()="Confirm"]'
            );
            if (
              await confirmModal.isVisible({ timeout: 1500 }).catch(() => false)
            ) {
              await confirmModal.click();
            }
            await this.page.waitForTimeout(500);
          } else {
            break;
          }
        }

        // Verify all images are deleted
        await this.page.waitForTimeout(500);
        const remainingImages = await checkboxList.count();
        expect(remainingImages).toBe(0);
        console.log(
          "[Store Banner] All banner images verified deleted successfully."
        );

        await previewStoreBanner.click();
      await previewStoreBannerBackButton.click();
      await saveStoreBanner.click();
      console.log("[Store Banner] Store banner saved successfully.");
    }
    async cardStyle() {
        const {
          
          storeCardStyle,
          editCardStyle,
          verticalStyle,
          horizantalStyle,
          saveCardStyle,
        } = webElement.pageElement(this.page);
        await this.page.waitForTimeout(500)
    
        
        await storeCardStyle.click();
        await editCardStyle.click();
        //await verticalStyle.nth(0).click()
        await horizantalStyle.nth(1).click();
        await saveCardStyle.click();
      }
      
}
module.exports = { StorePage };






















