const { WebElement } = require("../../../utils/WebElements");
const webElement = new WebElement();
const exp = require("constants");
const { expect } = require("@playwright/test");
const path = require("path");

class HomePage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
  async goto(url) {
    await this.page.goto(url);
  }
  async homeBanner() {
    const {
      pageButton,
      homeButton,
      homeBannerButton,
      EditHomeBanner,
      addFiles,
      HomeBannerImgUpload,
      BannerSubmitButton,
      title,
      subTitle,
      Description,
      alignmentsLeft,
      alignmentsCenter,
      alignmentsRight,
      bannerTextColor,
      textColor,
      saveHomeBannerButton,
      deleteBannerCheckBox,
      homeBannerDeletButton,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(1000);
    if (!(await homeButton.isVisible())) {
      await pageButton.click();
      try {
        await homeButton.waitFor({ state: "visible", timeout: 3000 });
      } catch (e) {
        await pageButton.click();
        await homeButton.waitFor({ state: "visible", timeout: 10000 });
      }
    }
    await homeButton.click();
    await homeBannerButton.nth(0).click();
    await EditHomeBanner.click();
    await this.page.waitForTimeout(1000);
    for (let i = 1; i <= 5; i++) {
      if (await addFiles.isVisible()) {
        try {
          await addFiles.click({ timeout: 3000 });
          const randomImage = Math.floor(Math.random() * 5) + 1;
          await HomeBannerImgUpload.setInputFiles(
            `playwright/resources/images/pexels${randomImage}.jpg`
          );
          if (await BannerSubmitButton.isVisible()) {
            await BannerSubmitButton.click();
            const processing = this.page.locator('text=/Processing image|please wait/i');
            if (await processing.isVisible({ timeout: 2000 }).catch(() => false)) {
              await processing.waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
            }
            await this.page.waitForTimeout(1000);
          }
        } catch (e) {
          break;
        }
      } else {
        break;
      }
    }

    // Verify all images are added
    const checkboxList =
      deleteBannerCheckBox || this.page.locator('//input[@name="checkbox"]');
    await checkboxList.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
    const addedImageCount = await checkboxList.count();
    console.log(`[Home Banner] Uploaded images count: ${addedImageCount}`);
    expect(addedImageCount).toBeGreaterThan(0);

    // Select each checkbox, click Delete, verify all images are deleted
    console.log(
      `[Home Banner] Deleting all banner images (${addedImageCount} images)...`
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
          console.log("[Home Banner] Delete button is disabled.");
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
      "[Home Banner] All banner images verified deleted successfully."
    );

    // await this.expect(limitExeed).toContainText("Exceed Image Upload Limit");
    await title.fill("Discover Your Perfect Property");
    await expect(title).toHaveValue("Discover Your Perfect Property");
    await subTitle.fill("Lorem ipsum dolor sit amet, consectetuer adipiscin");
    await expect(subTitle).toHaveValue(
      "Lorem ipsum dolor sit amet, consectetuer adipiscin"
    );
    await Description.fill(
      "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring whi"
    );
    await expect(Description).toHaveValue(
      "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring whi"
    );
    // await alignmentsCenter.nth(1).click();
    // await bannerTextColor.click();
    // await textColor.click();
    await saveHomeBannerButton.click();
  }
  async homeFilter() {
    const {
      homeFilter,
      editHomeFilter,

      showOnWebStoreButon,
      previewHomeFilter,
      previewfilterBackButton,
      saveHomeFilter,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);

    await homeFilter.click();
    await editHomeFilter.click();
    await showOnWebStoreButon.click();
    await previewHomeFilter.click();
    await previewfilterBackButton.click();
    await saveHomeFilter.click();
  }
  async featuredStock() {
    const {
      featuredStockButton,
      editFeaturedStock,
      unitToggleButton,
      unitUnpin,
      switchPlot,
      plotToggleButton,
      plotUnpin,
      switchProject,
      projectToggleButton,
      projectUnpin,
      previewFeaturedStock,
      previewFeaturedBackButton,
      saveFeatureStock,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);

    await featuredStockButton.click();
    await editFeaturedStock.click();
    await unitToggleButton.click();
    //   for (let i = 0; i < 8; i++) {
    //     await unitUnpin.nth(i).click();
    //   }
    await switchPlot.click();
    // await plotToggleButton.click();
    //   for (let i = 0; i < 8; i++) {
    //     await plotUnpin.nth(i).click();
    //   }
    // await switchProject.click();
    // await projectToggleButton.click();
    //   for (let i = 0; i < 8; i++) {
    //     await projectUnpin.nth(i).click();
    //   }
    await previewFeaturedStock.click();
    await previewFeaturedBackButton.click();
    await saveFeatureStock.click();
  }
  async collection() {
    const {
      collectionButton,
      editCollection,
      collectinToggleButton,
      collectionUnpin,
      previewCollection,
      previewCollectionBackButton,
      saveCollection,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);

    await collectionButton.click();
    await editCollection.click();
    await collectinToggleButton.click();
    // for (let i = 0; i < 2; i++) {
    //   await collectionUnpin.nth(i).click();
    // }
    await previewCollection.click();
    await previewCollectionBackButton.click();
    await saveCollection.click();
  }
  async services() {
    const {
      servicesButton,
      editServicesButton,
      servicesToggleButton,
      servicesMainTittle,
      servicesSubTittle,
      servicesDiscription,
      serviceimgupload1,
      servicesSubmitButton1,
      servicesDeleteButton1,
      serviceimguploadButton,
      servicesSubTittle2,
      servicesDiscription2,
      serviceimguploadButton2,
      serviceimgupload2,
      servicesSubmitButton2,
      servicesDeleteButton2,
      servicesSubTittle3,
      servicesDiscription3,
      serviceimguploadButton3,
      serviceimgupload3,
      servicesSubmitButton3,
      servicesDeleteButton3,
      previewServices,
      previewServicesBackButton,
      saveServices,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);

    await servicesButton.click();
    await editServicesButton.nth(0).click();
    await servicesToggleButton.click();
    await servicesMainTittle.fill(
      "Lorem ipsum dolor sit amet, consectetuer adipiscin"
    );
    await expect(servicesMainTittle).toHaveValue(
      "Lorem ipsum dolor sit amet, consectetuer adipiscin"
    );
    await servicesSubTittle.nth(0).fill("The European languag");
    await expect(servicesSubTittle.nth(0)).toHaveValue("The European languag");
    await servicesDiscription
      .nth(0)
      .fill(
        "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born "
      );
    await expect(servicesDiscription.nth(0)).toHaveValue(
      "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born "
    );

    if (await serviceimguploadButton.nth(0).isVisible()) {
      await serviceimguploadButton.nth(0).click();
      if (await serviceimgupload1.isVisible({ timeout: 2000 }).catch(() => false)) {
        await serviceimgupload1.setInputFiles(path.join(__dirname, "../../../resources/images/pexels3.jpg"));
        await servicesSubmitButton1.click();
      }
    }
    //await servicesDeleteButton1.nth(0).click()
    await servicesSubTittle2.nth(1).fill("Far far away, behind");
    await expect(servicesSubTittle2.nth(1)).toHaveValue("Far far away, behind");
    await servicesDiscription2
      .nth(1)
      .fill(
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,"
      );
    await expect(servicesDiscription2.nth(1)).toHaveValue(
      "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,"
    );
    if (await serviceimguploadButton2.nth(1).isVisible().catch(() => false) || await serviceimguploadButton2.nth(0).isVisible().catch(() => false)) {
      const btn2 = (await serviceimguploadButton2.nth(1).isVisible().catch(() => false)) ? serviceimguploadButton2.nth(1) : serviceimguploadButton2.nth(0);
      await btn2.click();
      if (await serviceimgupload2.isVisible({ timeout: 2000 }).catch(() => false)) {
        await serviceimgupload2.setInputFiles(path.join(__dirname, "../../../resources/images/pexels5.jpg"));
        await servicesSubmitButton2.click();
      }
    }
    //await servicesDeleteButton2.nth(0).click()
    await servicesSubTittle3.nth(2).fill("A wonderful serenity");
    await expect(servicesSubTittle3.nth(2)).toHaveValue("A wonderful serenity");
    await servicesDiscription3
      .nth(2)
      .fill("A wonderful serenity has taken possession of my entire soul.");
    await expect(servicesDiscription3.nth(2)).toHaveValue(
      "A wonderful serenity has taken possession of my entire soul."
    );
    if (await serviceimguploadButton3.nth(2).isVisible().catch(() => false) || await serviceimguploadButton3.nth(0).isVisible().catch(() => false)) {
      const btn3 = (await serviceimguploadButton3.nth(2).isVisible().catch(() => false)) ? serviceimguploadButton3.nth(2) : serviceimguploadButton3.nth(0);
      await btn3.click();
      if (await serviceimgupload3.isVisible({ timeout: 2000 }).catch(() => false)) {
        await serviceimgupload3.setInputFiles(path.join(__dirname, "../../../resources/images/pexels4.jpg"));
        await servicesSubmitButton3.click();
      }
    }
    //await servicesDeleteButton3.nth(0).click()
    await previewServices.click();
    await previewServicesBackButton.click();
    await saveServices.click();
  }
  async defaultCollections() {
    const {
      defaultCollectionButton,
      editDefaultCollection,
      defaultCollectionToggleButton,
      backroundImageButton,
      backroundImageUpload,
      titleBox,
      SubTitleBox,
      DescriptionBox,
      iconImagebutton,
      iconImageUpload,
      apartmentDescription,
      apartmentImage,
      apartmentImageUpload,
      apartImageSubmitButton,
      rowHouseDescription,
      rowHouseImage,
      rowhouseImageUpload,
      rowImageSubmitButton,
      villaDescription,
      villaImage,
      villaImageUpload,
      villaImageSubmitButton,
      plotDescription,
      plotImage,
      plotImageUpload,
      plotImageSubmitButton,
      previewDefaultCollection,
      previewDefaultCollectionBackButton,
      saveDefaultCollection,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);

    await defaultCollectionButton.click();
    await editDefaultCollection.click();
    await defaultCollectionToggleButton.click();
    await this.page.waitForTimeout(500);
    await backroundImageButton.click();

    await backroundImageUpload.setInputFiles(path.join(__dirname, "../../../resources/images/pexels16.jpg"));
    await titleBox.fill("Explore Our Properties");
    await SubTitleBox.fill("Find your perfect place to live or invest");
    await DescriptionBox.fill(
      "Browse through a range of residential property types available for sale."
    );
    await iconImagebutton.click();
    await this.page.waitForTimeout(500);
    await iconImageUpload.setInputFiles(path.join(__dirname, "../../../resources/images/pexels17.png"));
    await plotDescription.fill(
      "Residential plots in well-planned layouts with clear titles."
    );
    await this.page.waitForTimeout(500);
    await plotImage.click();
    await plotImageUpload.setInputFiles(path.join(__dirname, "../../../resources/images/pexels21.jpg"));
    await plotImageSubmitButton.click();
    await villaDescription.fill(
      "Luxury villas with private gardens and premium features."
    );
    await this.page.waitForTimeout(500);
    await villaImage.click();
    await villaImageUpload.setInputFiles(path.join(__dirname, "../../../resources/images/pexels20.jpg"));
    await villaImageSubmitButton.click();
    await rowHouseDescription.fill(
      "Spacious rowhouses in peaceful gated communities."
    );
    await this.page.waitForTimeout(500);
    await rowHouseImage.click();
    await rowhouseImageUpload.setInputFiles(path.join(__dirname, "../../../resources/images/pexels19.jpg"));
    await rowImageSubmitButton.click();
    await apartmentDescription.fill(
      "Modern apartments with all amenities and excellent connectivity."
    );
    await this.page.waitForTimeout(500);
    await apartmentImage.click();
    await apartmentImageUpload.setInputFiles(path.join(__dirname, "../../../resources/images/pexels18.png"));
    await apartImageSubmitButton.click();

    await previewDefaultCollection.click();
    await previewDefaultCollectionBackButton.click();
    await saveDefaultCollection.click();
  }

  async aboutUs() {
    const {
      aboutUsButton,
      editAboutUs,
      aboutUsToggleButton,
      aboutUploadButton,
      aboutUsImgUpload,
      aboutusSubmitButton,
      previewAboutUs,
      previewAboutUsBackButton,
      aboutUsDiscription,
      saveAboutUs,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(300);

    await aboutUsButton.click();
    await editAboutUs.click();
    await aboutUsToggleButton.click();
    await aboutUploadButton.click();
    await aboutUsImgUpload.setInputFiles(path.join(__dirname, "../../../resources/images/pexels1.jpg"));
    await aboutusSubmitButton.click();
    await aboutUsDiscription.fill(
      "The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Qu"
    );
    //await expect(aboutUsDiscription).toHaveValue(aboutUsDiscription);
    await previewAboutUs.click();
    await previewAboutUsBackButton.click();
    await saveAboutUs.click();
  }
  async testimonials() {
    const {
      testimonials,
      testimonialsEditButton,
      testimonialsToogleButton,
      testimonialsTitle,
      testimonialsImageButton,
      testimonialsImageUpload,
      testimonialsImageSubmit,
      Addtestimonials,
      name,
      SubTitle,
      content,
      uploadImage,
      testimonialSubmitButton,
      deleteTestimonialsButton,
      previewTestimoials,
      previewTestimoialsBackButton,
      saveTestimoials,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);
    // Step 1: Enter testimonial section and basic setup
    await testimonials.click();

    await testimonialsEditButton.click();
    await testimonialsToogleButton.click();
    await testimonialsTitle.fill("Testimonial & Customer");

    // Upload section image
    await testimonialsImageButton.click();
    await testimonialsImageUpload.setInputFiles(path.join(__dirname, "../../../resources/images/pexels6.jpg"));
    await testimonialsImageSubmit.click();
    await this.page.waitForTimeout(1000);

    // Random name list
    const nameList = [
      "SivaShankar",
      "Sajin Sathyan",
      "Dhanush Aadithyen",
      "Sibin TS",
      "Aravinth Kumar",
      "Dhivya",
      "ShanmugaPriya",
      "Kumaravel",
    ];

    // Step 2: Add multiple testimonial entries
    for (let i = 0; i < 5; i++) {
      if (await Addtestimonials.isVisible()) {
        await Addtestimonials.click();
        await this.page.waitForTimeout(500);
        const randomName = nameList[Math.floor(Math.random() * nameList.length)];
        const randomSubTitle = `FrontEnd Developer ${i + 1}`;

        // Fill name
        await expect(name).toBeVisible();
        await name.fill(randomName);
        await this.page.waitForTimeout(500);
        // Fill subtitle
        await expect(SubTitle).toBeVisible();
        await SubTitle.fill(randomSubTitle);
        await expect(SubTitle).toHaveValue(randomSubTitle);

        // Fill content
        await expect(content).toBeVisible();
        await content.fill("Lorem ipsum dolor sit amet, consectetuer adipiscin");
        await expect(content).toHaveValue(
          "Lorem ipsum dolor sit amet, consectetuer adipiscin"
        );

        // Upload image
        const randomImageIndex = Math.floor(Math.random() * 10) + 1;
        const imagePath = `playwright/resources/images/pexels${randomImageIndex}.jpg`;
        await uploadImage.setInputFiles(imagePath);
        await this.page.waitForTimeout(500);
        // Submit testimonial
        await testimonialSubmitButton.click();
        await this.page.waitForTimeout(1000);
      }
    }

    // Verify added confirmation
    const deleteBtnLocator =
      deleteTestimonialsButton ||
      this.page.locator(
        '//button[contains(@class,"p-2 bg-red-500 text-white round")] | //button[contains(@class,"bg-red-500")]'
      );
    const totalTestimonials = await deleteBtnLocator.count();
    console.log(
      `[Testimonials] Added 5 testimonials. Total testimonials found: ${totalTestimonials}`
    );
    expect(totalTestimonials).toBeGreaterThanOrEqual(3);

    // Delete extra testimonials while maintaining a minimum of 3
    console.log(
      "[Testimonials] Deleting extra testimonials while maintaining a minimum of 3..."
    );
    while ((await deleteBtnLocator.count()) > 3) {
      const deleteBtn = deleteBtnLocator.first();
      const isDisabled =
        (await deleteBtn.getAttribute("disabled")) !== null ||
        (await deleteBtn.isDisabled({ timeout: 500 }).catch(() => false));

      if (isDisabled) {
        console.log(
          "[Testimonials] Delete button is disabled, cannot delete further."
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

    // Verify deletion confirmation and count
    const remainingTestimonials = await deleteBtnLocator.count();
    console.log(
      `[Testimonials] Testimonials remaining: ${remainingTestimonials} (minimum 3 maintained).`
    );
    expect(remainingTestimonials).toBeGreaterThanOrEqual(3);

    // Step 3: Never click Save if fewer than 3 testimonials exist
    if (remainingTestimonials >= 3) {
      await previewTestimoials.click();
      await previewTestimoialsBackButton.click();
      await saveTestimoials.click();
      console.log(
        "[Testimonials] Testimonials saved successfully with at least 3 testimonials."
      );
    } else {
      console.error(
        `[Testimonials] Cannot save! Only ${remainingTestimonials} testimonials exist (minimum 3 required).`
      );
      throw new Error(
        `Testimonials validation failed: Expected at least 3 testimonials, but found ${remainingTestimonials}`
      );
    }
  }

  async CardSection() {
    const {
      rightImageSectionButton,
      rightImageEditButton,
      rightImagetoggleButton,
      rightImageTitle,
      rightImageSubitle,
      rightImageContent,
      rightOverallImageButton,
      rightOverallImageUpload,
      OverallImageSubmitButton,
      selectCardImagePosition,
      titleimageButton,
      titleimageUploadButton,
      titleimageSubmitButton,
      Title,
      description,
      title2imageButton,
      title2imageUploadButton,
      title2imageSubmitButton,
      Title2,
      description2,
      title3imageButton,
      title3imageUploadButton,
      title3imageSubmitButton,
      Title3,
      description3,
      title4imageButton,
      title4imageUploadButton,
      title4imageSubmitButton,
      Title4,
      description4,
      rightImagePreview,
      rightImagePreBackButton,
      rightImageSaveButton,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);
    await rightImageSectionButton.click();
    await rightImageEditButton.click();
    await rightImagetoggleButton.click();
    const randonTitle =
      "Ananya's " + Math.floor(Math.random()) + "NanaNani Homes";
    await rightImageTitle.fill(randonTitle);
    await expect(rightImageTitle).toHaveValue(randonTitle);
    const randomSubTitle = "Nananani" + Math.floor(Math.random()) + "Homes";
    await rightImageSubitle.fill(randomSubTitle);
    await expect(rightImageSubitle).toHaveValue(randomSubTitle);
    const randomContent =
      "Lorem ipsum dolor si" +
      Math.floor(Math.random()) +
      "A wonderful serenity";
    await rightImageContent.fill(randomContent);
    await expect(rightImageContent).toHaveValue(randomContent);
    await rightOverallImageButton.click();
    const randomOverallImage = Math.floor(Math.random() * 5) + 1;
    await rightOverallImageUpload.setInputFiles(
      `playwright/resources/images/pexels${randomOverallImage}.jpg`
    );
    await OverallImageSubmitButton.click();
    const randomSectionIndex = await Math.floor(
      Math.random() * (await selectCardImagePosition.locator("option").count())
    );
    await selectCardImagePosition.selectOption({ index: randomSectionIndex });

    await titleimageButton.click();
    await titleimageUploadButton.setInputFiles(
      path.join(__dirname, "../../../resources/images/sample.svg")
    );
    if (await titleimageSubmitButton.isVisible()) {
      await titleimageSubmitButton.click();
    }
    await Title.fill("Quality, Trust & Innovation");
    await expect(Title).toHaveValue("Quality, Trust & Innovation");
    await description.fill(
      "Lorem ipsum dolor sit amet consectetur. Tellus tortor gravida consectetur neque diam sit nunc. Etiam pellentesque varius vel leo non dui maecenas lectus. Sit arcu magna morbi arcu lectus vitae."
    );
    await expect(description).toHaveValue(
      "Lorem ipsum dolor sit amet consectetur. Tellus tortor gravida consectetur neque diam sit nunc. Etiam pellentesque varius vel leo non dui maecenas lectus. Sit arcu magna morbi arcu lectus vitae."
    );
    await title2imageButton.click();
    await title2imageUploadButton.setInputFiles(
      path.join(__dirname, "../../../resources/images/sample.svg")
    );
    if (await title2imageSubmitButton.isVisible()) {
      await title2imageSubmitButton.click();
    }
    await Title2.fill("Premium Quality Construction");
    await expect(Title2).toHaveValue("Premium Quality Construction");
    await description2.fill(
      "Lorem ipsum dolor sit amet consectetur. Sem egestas phasellus leo nunc morbi odio maecenas."
    );
    await expect(description2).toHaveValue(
      "Lorem ipsum dolor sit amet consectetur. Sem egestas phasellus leo nunc morbi odio maecenas."
    );
    await title3imageButton.click();
    await title3imageUploadButton.setInputFiles(
      path.join(__dirname, "../../../resources/images/sample.svg")
    );
    if (await title3imageSubmitButton.isVisible()) {
      await title3imageSubmitButton.click();
    }
    await Title3.fill("Modern & Elegant Designs");
    await expect(Title3).toHaveValue("Modern & Elegant Designs");
    await description3.fill(
      "Lorem ipsum dolor sit amet consectetur. Sem egestas phasellus leo nunc morbi odio maecenas."
    );
    await expect(description3).toHaveValue(
      "Lorem ipsum dolor sit amet consectetur. Sem egestas phasellus leo nunc morbi odio maecenas."
    );
    await title4imageButton.click();
    await title4imageUploadButton.setInputFiles(
      path.join(__dirname, "../../../resources/images/sample.svg")
    );
    if (await title4imageSubmitButton.isVisible()) {
      await title4imageSubmitButton.click();
    }
    await Title4.fill("On-Time Delivery");
    await expect(Title4).toHaveValue("On-Time Delivery");
    await description4.fill(
      "Lorem ipsum dolor sit amet consectetur. Sem egestas phasellus leo nunc morbi odio maecenas."
    );
    await expect(description4).toHaveValue(
      "Lorem ipsum dolor sit amet consectetur. Sem egestas phasellus leo nunc morbi odio maecenas."
    );
    await rightImagePreview.click();
    await rightImagePreBackButton.click();
    await rightImageSaveButton.click();
  }
  async AccordionSection() {
    const {
      leftImageSection,
      leftImageEditButton,
      leftImagetoggleButton,
      leftImageTitle,
      leftImageSubTitle,
      leftImageContent,
      leftOverallImageButton,
      leftOverallImageUpload,
      LeftOverallImageSubmitButton,
      selectImagePosition,
      leftAddSections,
      LeftImageSectionTitle,
      leftImageSectionDescription,
      leftImagePreview,
      leftImagePreBackButton,
      leftImageSaveButton,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);
    await leftImageSection.click();
    await leftImageEditButton.click();
    await leftImagetoggleButton.click();
    await leftImageTitle.fill("Customer-Centric Approach");
    await expect(leftImageTitle).toHaveValue("Customer-Centric Approach");
    await leftImageSubTitle.fill("Prime Locations");
    await expect(leftImageSubTitle).toHaveValue("Prime Locations");
    await leftImageContent.fill(
      "Lorem ipsum dolor sit amet consectetur. Tellus tortor gravida consectetur neque diam sit nunc. Etiam pellentesque varius vel leo non dui maecenas lectus. Sit arcu magna morbi arcu lectus vitae."
    );
    await expect(leftImageContent).toHaveValue(
      "Lorem ipsum dolor sit amet consectetur. Tellus tortor gravida consectetur neque diam sit nunc. Etiam pellentesque varius vel leo non dui maecenas lectus. Sit arcu magna morbi arcu lectus vitae."
    );
    await leftOverallImageButton.click();
    const randomLeftImage = Math.floor(Math.random() * 5) + 1;
    await leftOverallImageUpload.setInputFiles(
      `playwright/resources/images/pexels${randomLeftImage}.jpg`
    );
    await LeftOverallImageSubmitButton.click();
    const randomSectionIndex = await Math.floor(
      Math.random() * (await selectImagePosition.locator("option").count())
    );
    await selectImagePosition.selectOption({ index: randomSectionIndex });
    for (let i = 0; i < 6; i++) {
      if (await leftAddSections.isVisible()) {
        await leftAddSections.click();
        const randomTitle =
          "Crafting Timeless Designs " + Math.floor(Math.random()) + "Designs ";
        await LeftImageSectionTitle.fill(randomTitle);
        await expect(LeftImageSectionTitle).toHaveValue(randomTitle);
        const randomDescription =
          "A wonderful serenity has taken possessio " +
          Math.floor(Math.random()) +
          "Designs ";
        await leftImageSectionDescription.fill(randomDescription);
        await expect(leftImageSectionDescription).toHaveValue(randomDescription);
        await leftImagePreview.click();
        await leftImagePreBackButton.click();
        await leftImageSaveButton.click();
      }
    }
  }
  async statistics() {
    const {
      statisticsSection,
      statisticsEditButton,
      statisticsToggleButton,
      statisticsImageButton,
      statisticsUploadButton,
      statisticsSubmitButton,
      statisticsTitle,
      statisticsSubTitle,
      statisticsTitle1,
      statisticsDescription1,
      statisticsTitle2,
      statisticsDescription2,
      statisticsTitle3,
      statisticsDescription3,
      statisticsTitle4,
      statisticsDescription4,
      StatisticsPreview,
      StatisticsPreBackButton,
      StatisticsSaveButton,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);
    await statisticsSection.click();
    await statisticsEditButton.click();
    await statisticsToggleButton.click();
    await statisticsImageButton.click();
    const replaceBtn = this.page.locator('//button[normalize-space()="Replace"] | //a[normalize-space()="Replace"] | //li[normalize-space()="Replace"]');
    if (await replaceBtn.isVisible()) {
      await replaceBtn.click();
    }
    if (await statisticsUploadButton.isVisible()) {
      await statisticsUploadButton.setInputFiles(path.join(__dirname, "../../../resources/images/pexels1.jpg"));
      if (await statisticsSubmitButton.isVisible()) {
        await statisticsSubmitButton.click();
      }
    }
    await statisticsTitle.fill("Your Ideal Investment Awaits");
    await expect(statisticsTitle).toHaveValue("Your Ideal Investment Awaits");
    await statisticsSubTitle.fill("Luxury Living");
    await expect(statisticsSubTitle).toHaveValue("Luxury Living");
    await statisticsTitle1.fill("15k");
    await expect(statisticsTitle1).toHaveValue("15k");
    await statisticsDescription1.fill("Our Happy Customer");
    await expect(statisticsDescription1).toHaveValue("Our Happy Customer");
    await statisticsTitle2.fill("100%");
    await expect(statisticsTitle2).toHaveValue("100%");
    await statisticsDescription2.fill("Clients Satisfaction Rate");
    await expect(statisticsDescription2).toHaveValue(
      "Clients Satisfaction Rate"
    );
    await statisticsTitle3.fill("17k");
    await expect(statisticsTitle3).toHaveValue("17k");
    await statisticsDescription3.fill("Total Property Sale");
    await expect(statisticsDescription3).toHaveValue("Total Property Sale");
    await statisticsTitle4.fill("50+");
    await expect(statisticsTitle4).toHaveValue("50+");
    await statisticsDescription4.fill("Projects");
    await expect(statisticsDescription4).toHaveValue("Projects");
    await StatisticsPreview.click();
    await StatisticsPreBackButton.click();
    await StatisticsSaveButton.click();
  }
  async latestProperties() {
    const {
      latestPropertiesButton,
      latestpropertyEditButton,
      toggleButtton,
      titleTextBox,
      subTitleTextBox,
      switchApart,
      switchVilla,
      switchRowHouse,
      switchPlots,
      switchFlat,
      switchHouse,
      previewLatestProperties,
      previewLatestPropertiesBackButton,
      saveLatestProperties,
    } = webElement.pageElement(this.page);
    await this.page.waitForTimeout(500);
    await latestPropertiesButton.click();
    await latestpropertyEditButton.click();
    await toggleButtton.click();
    await titleTextBox.fill("Latest Properties");
    await expect(titleTextBox).toHaveValue('Latest Properties');
     await subTitleTextBox.fill("Find Your Haven");
    await expect(subTitleTextBox).toHaveValue('Find Your Haven');
    await switchApart.click();
    await switchVilla.click();
    await switchRowHouse.click();
    await switchPlots.click();
    await switchFlat.click();
    await switchHouse.click();
    await previewLatestProperties.click();
    await previewLatestPropertiesBackButton.click();
    await saveLatestProperties.click();
  }
}

module.exports = { HomePage };
