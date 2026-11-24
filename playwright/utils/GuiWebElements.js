class WebElement {
  pageElement(page) {
    //******** login page elements *********
    const phoneTextbox = page.locator("#phone");
    const passwordTextbox = page.locator("#password");
    const signInButton = page.locator("//button[@type='submit']");
    const invalidErrorMsg = page.locator(
      "//div[@class='rounded-md bg-red-50 p-2 text-sm font-medium text-red-600 text-center']",
    );
    const invalidErrorMsgInForgot = page.locator(
      '//div[@class="rounded-md bg-red-50 p-2 text-sm font-medium text-red-600"]',
    );
    const blankErrorMsg = page.locator(
      "//*[@class='text-xs text-red-600 pr-3']",
    );
    const forgotPinLink = page.locator(
      "//a[normalize-space()='Forgot Pass Pin']",
    );
    const profileButton = page.locator('//a[@class="pl-2"]');
    const signOutButton = page.locator(
      "//button[normalize-space()='Sign Out']",
    );
    const siginViaOtpButton = page.locator(
      "//button[normalize-space()='Sign In via OTP']",
    );
    const submitOtpButton = page.locator('//div[@class="my-8"]//button');
    const optSuccessMsg = page.locator(
      '//label[@class=" my-4 block text-sm font-medium text-gray-700"]',
    );
    const resendOtp = page.locator("//button[normalize-space()='Resend OTP']");

    //********** stock page elements ************
    const stockMenuButton = page.locator(
      '//div[@class="static bottom-0 flex-col pt-3 sm:flex"]//a[@href="/stocks/units"]',
    );
    const addStockButton = page.locator(
      '//button[normalize-space()="+ New Stock"]',
    );
    const stockSaleRadioButton = page.locator(
      '//input[@name="notification-method_1"]',
    );
    const stockTypeRadioButton = page.locator(
      '//*[contains(@class,"inline-flex rounded-md ")]//button[@type="button"]',
    );
    const projectNameTextbox = page.locator("#project");
    const reraIdTextbox = page.locator("#rera");

    const stockLocationTextbox = page.locator(
      '//div[@class="relative"]//input[@type="text"and@role="combobox"]',
    );
    const stockLocationDropdown = page.locator('//div[@class="relative"]//div');
    const stockSubmitButton = page.locator(
      '//div[@class="flex items-center justify-end gap-2 mt-5"]//button',
    );
    const forRentOrResaleRadioButton = page.locator(
      '//input[@name="notification-method"]',
    );
    const stockSqftTextbox = page.locator('(//input[@name="text"])[1]');
    const stockBhkDropdown = page.locator("#bhk");
    const stockFacingDropdown = page.locator("#orientation");

    //**************** overview page elements *******************
    const overviewModuleButton = page.locator('(//li[@id="Overview"])[2]');
    const overviewEditButton = page.locator(
      '//button[normalize-space()="Edit"]',
    );
    const overviewProjNameTextbox = page.locator("#projectName");
    const overviewDevNameTextbox = page.locator("#developerName");
    const overviewAcresTextbox = page.locator("#totalAcres");
    const overviewReraTextbox = page.locator("#reraId");
    const overviewSqftTextbox = page.locator("#sqft");
    const overviewStatusDropdown = page.locator("#status");
    const overviewDescripTextarea = page.locator("#description");
    const Websiteheading = page.locator("#websiteHeading");
    const Pagetitleheading = page.locator("#websitePageTitle");
    const overviewLocationTextbox = page.locator(
      '//div[@class="relative"]//input[@type="text"and@role="combobox"]',
    );
    const overviewLocationMultiDropdown = page.locator(
      '//div[@class="relative"]//div',
    );
    const overviewImageEditButton = page.locator("#dropdownMenuButton1");
    const overviewImageDeleteButton = page.locator(
      '(//label[@data-te-dropdown-item-ref="true"])[2]',
    );
    const overviewImageUploadButton = page.locator(
      "(//label[normalize-space()='Upload'])[1]",
    );
    const overviewProjectImageUploadButton = page.locator(
      '//div[@class="mt-2 flex justify-center"]',
    );
    const overviewprojectSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const overviewProjectBannerUploadButton = page.locator(
      "(//label[normalize-space()='Upload'])[1]",
    );
    const overviewImageBannerUploadButton = page.locator(
      '//div[@class="mt-2 flex justify-center"]',
    );
    const overviewprojectBnnerSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const overviewSubmitMultiButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    const projectPublishButton = page.locator(
      '//button[text()="Publish to Webstore"]',
    );
    const publishProceedButton = page.locator(
      '//button[normalize-space()="Proceed"]',
    );
    const projectBackButton = page.locator(
      '//*[@class="flex flex-shrink-0 items-center"]//button[@type="button"]',
    );
    const publishMessage = page.locator(
      '//h3[contains(text(),"Project published successfully.")]',
    );

    //***************** unit page element ******************
    const unitModuleButton = page.locator('(//li[@id="Unit"])[2]');
    const addModelButton = page.locator(
      '//button[normalize-space()="Add Model"]',
    );
    const modelBhkDropdown = page.locator("#BHK");
    const modelFacingDropdown = page.locator("#facing");
    const modelBathDropDown = page.locator("#Bath");
    const modelBalconyDropDown = page.locator("#Balcony");
    const modelWebSiteHeading = page.locator(
      '(//input[@id="exampleInputPassword1"])[2]',
    );
    const modelPageTittleHeading = page.locator(
      '(//input[@id="exampleInputPassword1"])[3]',
    );
    const modelSqftTextbox = page.locator("#exampleInputPassword1");
    const modelSubmitButton = page.locator('//button[normalize-space()="Add"]');
    const modelCard = page.locator(
      '//div[@class="relative grid grid-cols-10 gap-4 px-4 py-2"]',
    );
    const modelDetialsButton = page.locator(
      '//button[normalize-space()="Go To Details"]',
    );
    const unitPageEditButton = page.locator(
      '//button[normalize-space()="Edit"]',
    );
    const unitPageSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    const unitBasePriceTextbox = page.locator(
      '//div[@class="w-48 text-center "]//input',
    );
    const unitBasePriceTextboxAssert = page.locator(
      '(//span[@class="block mt-2.5"])[1]',
    );
    const updateBasePrice = page.locator(
      "//button[normalize-space()='Yes, Update Price']",
    );

    //***************** model page element ******************/
    const modelBackButton = page.locator(
      '//button[@class="px-2 py-2 bg-indigo-900 rounded text-white hover:bg-indigo-700"]',
    );
    const projectLinkButton = page.locator(
      '//span[@class="flex justify-center items-center "]',
    );
    const stockDetialEditButton = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const customEditButton = page.locator(
      '(//button[normalize-space()="Edit"])[2]',
    );
    const modelImageUploadButton = page.locator('//input[@accept="image/*"]');
    const modelimageUpload = page.locator('input[type="file"]');
    const modelImageSubmitButton = page.locator(
      '(//div[@class="flex items-end justify-end gap-3"]//button)',
    );
    const modelPageFacingDropdown = page.locator("#orientation");

    const modelPageBhkDropdown = page.locator("#bhk");
    const modelPageSqftTextbox = page.locator(
      '(//input[contains(@class,"border border-gray")])[1]',
    );
    const modelUnitDiscription = page.locator(
      '//textarea[contains(@class ," p-1.5 border row-span-1")]',
    );
    const modelpageBathDropDown = page.locator("#bath");
    const modelpageBalconyDropDown = page.locator("#balcony");
    const modelPageBasePricetextBox = page.locator(
      '(//input[contains(@class,"border border-gray")])[2]',
    );
    const stockdetialSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    const customAddButton = page.locator('//button[normalize-space()="Add"]');
    const customLabelNameTextbox = page.locator(
      "//div[@class='mt-4']//div//input[@id='Label_tag']",
    );
    const customPriceTypeButton = page.locator(
      '//input[@placeholder="Select Price Type"]',
    );
    const customTypeIncrease = page.locator('//p[contains(text(),"Increase")]');
    const customTypeDecrease = page.locator('//p[contains(text(),"Decrease")]');
    const changePriceOnRadioButton = page.locator(
      '//label//input[@type="radio"]',
    );
    const customYourPriceTextbox = page.locator('//div[@class="mt-6 "]//input');
    const customSaveButton = page.locator(
      '//div[@class="flex items-center justify-end mt-12 text-base sm:gap-4 sk:gap-2 bottom-4"]//button[normalize-space()="Save"]',
    );
    const formulaBuildButton = page.locator(
      '//button[normalize-space()="Build"]',
    );
    const formulaProceedButton = page.locator(
      '//button[normalize-space()="Proceed"]',
    );
    const buildBlockButton = page.locator(
      '(//div[contains(@class,"flex items-center relative")])[1]',
    );
    const buildBlockTextbox = page.locator('(//input[@id="1"])[1]');
    const buildBlockDoneButton = page.locator(
      '(//button[normalize-space()="Done"])[1]',
    );
    const buildFloorButton = page.locator(
      '(//div[contains(@class,"flex items-center relative")])[2]',
    );
    const buildFloorTextbox = page.locator('(//input[@id="1"])[2]');
    const buildFloorDoneButton = page.locator(
      '(//button[normalize-space()="Done"])[2]',
    );
    const formulaSaveButton = page.locator(
      '//div[contains(@class,"mt-5")]//button[normalize-space()="Save"]',
    );
    const sitePlanButton = page.locator(
      '//button[normalize-space()="Mark on Site Plan"]',
    );
    const siteUploadButton = page.locator(
      '//button[normalize-space()="Upload Image"]',
    );
    const sitePlanUpload = page.locator("#file-upload");
    const siteUploadDoneButton = page.locator(
      '//button[normalize-space()="Done"]',
    );
    const sitePlanSelect = page.locator(
      '//div[contains(@class,"group aspect-h-7 border")]',
    );
    const sitePlanSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    const unitLabelNameEditButton = page.locator(
      '//p[text()="Manage Availability"]/../..//button[normalize-space()="Edit"]',
    );
    const unitLabelName = page
      .locator(
        '//input[contains(@aria-label,"Unit label for block 1")] | //input[contains(@aria-label,"Unit label")]',
      )
      .first();
    const unitLabelNameSaveButton = page.locator(
      '//p[text()="Manage Availability"]/../..//button[normalize-space()="Save"]',
    );
    const modelLabelNameEditButton = page.locator(
      '//button[@title="Edit model name"]',
    );
    const modelLabelName = page.locator("#model-name");
    const modelLabelNameSaveButton = page.locator(
      '//input[@id="model-name"]/following-sibling::button[normalize-space()="Save"]',
    );
    //*********************MArk on Floor********* */
    const floorPlanButton = page.locator(
      '//button[normalize-space()="Mark on Floor Plan"]',
    );
    const floorUploadButton = page.locator(
      '//button[normalize-space()="Upload Image"]',
    );
    const floorPlanUpload = page.locator("#file-upload");
    const floorUploadDoneButton = page.locator(
      '//button[normalize-space()="Done"]',
    );
    const floorPlanSelect = page.locator(
      '//div[contains(@class,"group aspect-h-7 border")]',
    );
    const floorPlanSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    /***************************   UNIT SLUG ********** */
    const unitSlugButton = page.locator('//button[normalize-space()="Slug"]');
    const unitSlugEditButton = page.locator(
      '//h1[normalize-space()="Slug"]/following::button[normalize-space()="Edit"][1]',
    );
    const unitSlugTextBox = page
      .locator('#slugURL, #slugUrn, [name="slugUrn"], [name="slugURL"]')
      .first();

    /*************** Unit Seo Details************* */

    const seoDetailsButton = page.locator(
      '//button[normalize-space()="SEO Details"]',
    );
    const editSeoButton = page.locator(
      '//h1[normalize-space()="SEO Details"]/following::button[normalize-space()="Edit"][1]',
    );
    const metaTittle = page.locator("#meta_title");
    const metaKeyword = page.locator("#meta_keyword");
    const metaDiscription = page.locator("#meta_description");
    const seoImageUpload = page.locator("#modelImg");
    const seoSmbmitButton = page.locator(
      '//h1[normalize-space()="SEO Details"]/following::button[normalize-space()="Submit"][1]',
    );

    const slugUrnButton = page.locator('//button[normalize-space()="Slug"]');
    const slugPanelContainer = page.locator(
      '//h1[normalize-space()="Slug"]/ancestor::div[contains(@class,"bg-white")][1]',
    );
    const EditSlugUrnButton = unitSlugEditButton;
    const slugTextAreaApart = unitSlugTextBox;
    const slugSaveButton = page.locator(
      '//h1[normalize-space()="Slug"]/following::button[normalize-space()="Save"][1]',
    );

    //********************* Unit Content Section 1 & 2 **********************//
    const unitContentSection1Button = page.locator(
      '//button[normalize-space()="Content Section 1"]',
    );
    const unitContentSection2Button = page.locator(
      '//button[normalize-space()="Content Section 2"]',
    );

    // Edit button scoped to section 1 panel (heading text is lowercase "section1")
    const unitContentSection1Panel = page.locator(
      '//h1[contains(normalize-space(),"Content section1")]/ancestor::div[contains(@class,"bg-white")][1]',
    );
    // Use CSS has-text so Playwright scopes the query relative to the panel element
    const unitContentSectionEditButton = unitContentSection1Panel.locator(
      'button:has-text("Edit")',
    );

    // Edit button scoped to section 2 panel
    const unitContentSection2Panel = page.locator(
      '//h1[contains(normalize-space(),"Content section2")]/ancestor::div[contains(@class,"bg-white")][1]',
    );
    const unitContentSection2EditButton = unitContentSection2Panel.locator(
      'button:has-text("Edit")',
    );

    const unitSectionTitle = page.locator('//input[@name="sectionTitle"]');
    const unitTitle = page.locator('//input[@name="title"]');
    const unitSubTitle = page.locator('//input[@name="subTitle"]');

    // Content Image label — scoped to its h3 heading to avoid strict-mode collision
    const unitContentImage1 = page.locator(
      '//h3[contains(normalize-space(),"Content Image")]/following-sibling::div//label[normalize-space()="Upload"]',
    );
    // Use the same bare #file-upload selector used elsewhere — the upload dialog
    // in this app does NOT carry role="dialog" or class="modal".
    const unitContentUploadImage1 = page.locator("input#file-upload");
    // Background Image label — scoped to its h3 heading
    const unitBackrountImage1 = page.locator(
      '//h3[contains(normalize-space(),"Background Image")]/following-sibling::div//label[normalize-space()="Upload"]',
    );

    const unitContentSectionSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );

    const unitContentDescriptionTextbox = page.locator(
      '//textarea[@name="description"]',
    );
    const unitContentSectionSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );

    /********************** Unit  Tags *************************************** */
    const unitTagsButton = page.locator("//button[normalize-space()='Tag']");
    const addUnitTagButton = page.locator(
      '//button[normalize-space()="Create"]',
    );
    const tagNameTextbox = page.locator('//input[@placeholder="Tag name"] ');
    const tagDescriptionTextbox = page.locator(
      '//textarea[contains(@class,"w-full px-3.5 py-2")]',
    );
    const tagSubmitButton = page.locator('//button[normalize-space()="Save"]');
    //******************* gallery page element ********************/
    const galleryModuleButton = page.locator('(//li[@id="Gallery"])[2]');
    const galleryAddButton = page
      .getByRole("button", { name: "Add Files" })
      .or(
        page.locator(
          '//button[contains(@class,"rounded-md border border-primary bg-primary px-3 py-1.5")]',
        ),
      )
      .or(
        page.locator(
          "//div[@class='flex ml-4 items-center justify-start']//button",
        ),
      );
    const galleryImageUploadButton = page.locator("#file-upload");
    const galleryUploadDoneButton = page.locator(
      '//button[normalize-space()="Done"]',
    );
    const galleryAfterAddButton = page.locator(
      "//div[@class='flex ml-4 items-center justify-start']//button",
    );
    const galleryYoutubeUploadTextbox = page.locator("#youtube_url");
    const galleryYoutubePlusButton = page.locator(
      '//div[@class="border-2 border-indigo-600 p-1 rounded"]',
    );
    const galleryMenuMultiButton = page.locator(
      '//button[contains(@class,"w-full border px-3 py-2 text-sm font-semibold ")]',
    );

    //**************** amenities page element *******************/
    const amenitiesModuleButton = page.locator('(//li[@id="Amenities"])[2]');
    const amenitiesEditMultiButton = page.locator(
      '//button[normalize-space()="Edit"]',
    );
    const amenitiesLabelMultiCheckbox = page.locator(
      '//input[@class="bg-primary"]',
    );
    const amenitiesSaveButton = page.locator(
      '//div[contains(@class,"flex")]//button[normalize-space()="Save"]',
    );
    const amenitiesCustomAddButton = page.locator(
      '//button[normalize-space()="Add Amenities"]',
    );
    const amenitiesCustomTextbox = page.locator(
      '//input[@placeholder="Enter Amenities Name"]',
    );
    const amenitiesCustomSaveButton = page.locator(
      '//button[normalize-space()="Add"]',
    );

    //********************* home loans ************************/
    const homeloanModuleButton = page.locator('(//li[@id="Home_Loans"])[2]');
    const loanAddButton = page
      .locator('//button[normalize-space()="Add Financial Institution"]')
      .filter({ visible: true })
      .first();
    const loanSearchTextbox = page.locator(
      '//input[@class="col-span-9 focus:outline-none px-2"]',
    );
    const loanOptionAddMultiButton = page.locator(
      '//button[normalize-space()="Add"]',
    );
    const loanApprovalFormButton = page.locator("#file-upload");
    const loanSubmitButton = page.locator('//button[normalize-space()="Done"]');
    const loanAfterAddButton = loanAddButton;
    const loanCustomAddButton = page.locator(
      '//button[normalize-space()="Create Financial Institution"]',
    );
    const loanCustomBankTextbox = page.locator(
      '//input[@placeholder="Eg.Bank Name"]',
    );
    const loanCustomBankCreateButton = page.locator(
      '//button[normalize-space()="Create"]',
    );

    // ********************** Specification *******************************
    const specModuleButton = page.locator('(//li[@id="Specification"])[2]');
    const specAddButton = page.locator(
      '//button[normalize-space()="Add Specifications"]',
    );
    const specLabelMultiCheckbox = page.locator('//input[@type="checkbox"]');
    const specLabelSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    const specEditButton = page.locator('//button[normalize-space()="Edit"]');
    const specSaveButton = page.locator('//button[normalize-space()="Save"]');
    const specSubLabelMultiTextbox = page.locator('//input[@type="text"]');
    const specSubLabelMultiTextArea = page.locator(
      '//textarea[@placeholder="Enter 2000 Characters only"]',
    );

    //************************ neighbourhood *******************/
    const neighModuleButton = page.locator('(//li[@id="Neighbourhood"])[2]');
    const neighAddButton = page.locator(
      '//button[normalize-space()="Add Neighbourhood"]',
    );
    const neighLabelMultiButton = page.locator(
      '//div[@class="flex gap-2 cursor-default items-center"]//p',
    );
    const neighCustomLabelTextbox = page.locator(
      "//input[@placeholder='Ex: Siva temple is 5km']",
    );
    const neighCustomLabelAddButton = page.locator(
      "//div[@class=' pl-2 flex items-center justify-center']",
    );
    const neighRangeSlide = page.locator('//input[@class="w-full "]');
    const neighSaveButton = page.locator('//button[normalize-space()="Save"]');
    const neighEditButton = page.locator('//button[normalize-space()="Edit"]');
    /************************FAQ'S ****************************************** */
    const faqModuleButton = page.locator("(//li[@id='FAQ'])[2]");
    const addFaqbutton = page.locator("//button[normalize-space()='Add FAQ']");
    const addMoreFaqbutton = page.locator(
      '//div[@class="flex justify-end"]//button',
    );
    const questionTexBox = page.locator("#question");
    const answerTextBox = page.locator("#answer");
    const SubmitFaqButton = page.locator(
      "(//button[contains(@class,'rounded-md border border-primary')])[2]",
    );

    /**************************************  PROJECT SEO DETAILS ********************************** */
    const seoButton = page.locator('//li[@id="SEO_Details"]').last();
    const seoEditButton = page.locator(
      '//h1[normalize-space()="SEO Details"]/following::button[normalize-space()="Edit"][1]',
    );
    const googleAnalytics = page
      .locator(
        '//input[contains(@placeholder,"UA -")] | (//*[normalize-space()="Google Analytics"]/following::input)[1]',
      )
      .first();
    const googleTagManager = page
      .locator(
        '//input[contains(@placeholder,"GTM")] | (//*[normalize-space()="Google Tag Manager"]/following::input)[1]',
      )
      .first();
    const metaTitle = page
      .locator(
        '//input[@placeholder="Meta Title"] | (//*[normalize-space()="Meta Title" or normalize-space()="Meta title"]/following::input)[1]',
      )
      .first();
    const ProjectSlug = page
      .locator(
        '//input[@placeholder="Project Slug"] | //textarea[@placeholder="Project Slug"] | (//*[normalize-space()="Project Slug"]/following::input)[1] | (//*[normalize-space()="Project Slug"]/following::textarea)[1]',
      )
      .first();

    const metaKeywords = page
      .locator(
        '//textarea[contains(@placeholder,"Meta Keyword")] | (//*[normalize-space()="Meta Keyword"]/following::textarea)[1]',
      )
      .first();
    const metaDescription = page
      .locator(
        '//textarea[contains(@placeholder,"Meta Description")] | (//*[normalize-space()="Meta Description"]/following::textarea)[1]',
      )
      .first();
    const metaImageUpload = page.locator("#modelImg");
    const saveSeoButton = page.locator(
      '//h1[normalize-space()="SEO Details"]/following::button[normalize-space()="Save"][1]',
    );
    const unitSeoButton = page.locator(
      '//button[normalize-space()="SEO Details"]',
    );
    //********************** Menu setting ***************************/
    const menuModuleButton = page.locator(
      "(//div[contains(@class,'text-sm flex items-center cursor-pointer')])[1]",
    );
    const menuEditButton = page.locator("//button[normalize-space()='Edit']");
    const menuDeleteButton = page.locator('//span[@class="text-red-500 "]');
    const menuAddButton = page.locator(
      "//button[normalize-space()='Add Menu']",
    );
    const menuLabelEmptyTextbox = page.locator(
      "//input[@placeholder='Eg: Gallery' and @value='']",
    );
    const menuUrlEmptyTextbox = page.locator(
      "//input[contains(@class,'pr-5 pl-4 py-2 rounded w-full') and @value='']",
    );
    const menuPhoneTextbox = page.locator("#email");
    const menuEmailTextbox = page.locator("#phone");
    const menuSaveButton = page.locator("//button[normalize-space()='Save']");
    const customPublish = page.locator(
      "//button[contains(@class,'rounded-3xl border border-primary')]",
    );
    const publishMessageClose = page.locator(
      '//button[normalize-space()="Go back"]',
    );
    const publishModuleButton = page.locator(
      '//div[normalize-space()="Publish Manager"]//div',
    );
    const visitSiteButton = page.locator('//a[normalize-space()="Visit Site"]');

    /**********************************Project Content Section ***************** */
    // Section nav items — .last() picks the sidebar nav item (2nd of 2 matches)
    const projectContentSection1 = page
      .locator('//li[@id="Content section 1"]')
      .last();
    const projectContentSection2 = page
      .locator('//li[@id="Content section 2"]')
      .last();

    // Edit button scoped to the panel — XPath handles both "section 1" (space) and "section1" (no space)
    const projectContentSection1Panel = page.locator(
      '//h1[contains(normalize-space(),"Content section 1") or contains(normalize-space(),"Content section1")]/ancestor::div[contains(@class,"bg-white")][1]',
    );
    const projectContentSection2Panel = page.locator(
      '//h1[contains(normalize-space(),"Content section 2") or contains(normalize-space(),"Content section2")]/ancestor::div[contains(@class,"bg-white")][1]',
    );
    // CSS selector properly scopes within the matched panel element
    const projectContentEditButton = projectContentSection1Panel.locator(
      'button:has-text("Edit")',
    );
    const projectContent2EditButton = projectContentSection2Panel.locator(
      'button:has-text("Edit")',
    );

    const projectsectionTitle = page.locator('//input[@name="sectionTitle"]');
    const projecttitle = page.locator('//input[@name="title"]');
    const projectsubTitle = page.locator('//input[@name="subTitle"]');

    // Content Image label — scoped to its h3 heading
    const projectcontentImage1 = page.locator(
      '//h3[contains(normalize-space(),"Content Image")]/following-sibling::div//label[normalize-space()="Upload"]',
    );
    // Background Image label — scoped to its h3 heading
    const projectBackgroundImage1 = page.locator(
      '//h3[contains(normalize-space(),"Background Image")]/following-sibling::div//label[normalize-space()="Upload"]',
    );
    // Dialog file input — same bare #file-upload selector used by gallery/site-plan
    // (the upload modal in this app does NOT carry role="dialog" or class="modal")
    const projjectcontentSectionUploadImage = page.locator("input#file-upload");
    // Submit button inside the upload dialog — scoped to the dialog footer
    const projectContentImageUploadSubmitButton = page
      .locator(
        '//div[contains(@class,"flex items-end justify-end")]//button[normalize-space()="Submit"] | //button[normalize-space()="Submit"]',
      )
      .first();

    const projectcontentDescriptionTextbox = page.locator(
      '//textarea[@name="description"]',
    );
    const projectContentSectionSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );

    /***************************. project Tags *********************************** */
    const projectTags = page.locator('(//li[@id="Tag"])[2]');
    const addtagcreateButton = page.locator(
      '//button[normalize-space()="Create"]',
    );
    const projectTagNameTextbox = page.locator(
      '//input[@placeholder="Tag name"] ',
    );
    const projectTagDescriptionTextbox = page.locator(
      '//textarea[contains(@class,"w-full px-3.5 py-2")]',
    );
    const projectTagSubmitButton = page.locator(
      '//button[normalize-space()="Save"]',
    );

    /********************************  COLLECTIONS *******************************/
    const stocksMenuButton = page.locator(
      '//div[@class="static bottom-0 flex-col pt-3 sm:flex"]//a[@href="/stocks/units"]',
    );
    const collectionButton = page.locator("#COLLECTIONS");
    const addCollectionButton = page.locator(
      '//button[normalize-space()="Add Collections"]',
    );
    const collectionName = page.locator("#collectionname");
    const collectionDescription = page.locator("#collectiondescription");
    const colectionImageUploadFile = page.locator(
      '//div[@class="flex flex-col items-center justify-center mt-14"]',
    );
    const imageUpload = page.locator("#file-upload");
    const collectionImageSaveButton = page.locator(
      '(//button[normalize-space()="Save"])',
    );
    const collectionSaveButton = page.locator(
      '(//button[normalize-space()="Save"])',
    );
    const filterButton = page.locator('//button[normalize-space()="+ Filter"]');
    const projectName = page.locator(
      '(//div[normalize-space()="Project Name"])[1]',
    );
    const companyName = page.locator(
      '(//div[normalize-space()="Company Name"])[1]',
    );
    const projectLocation = page.locator(
      '(//div[normalize-space()="Project Location"])[1]',
    );
    const projectTypesCategory = page.locator(
      '(//div[normalize-space()="Project Types & Category"])[1]',
    );
    const selectTypes = page.locator('(//div[@class="mb-1"]//div)');
    // const ProjectCategory=page.locator('//button[normalize-space()="Residential"]');
    // const forSale=page.locator('//button[normalize-space()="Sale"]');
    // const projectType=page.locator('//button[normalize-space()="Apartment"]');
    // const unitTypeOwned=page.locator('//button[normalize-space()="Owned"]');
    const unitsType = page.locator(
      '(//div[normalize-space()="Units Type"])[1]',
    );
    const selectUnitTYpes = page.locator('(//div[@class="mb-1"]//div)');
    const bedrooms = page.locator('(//div[normalize-space()="Bedrooms"])[1]');
    const SelectBhk = page.locator('(//div[@class="mb-1"]//div)');
    const facing = page.locator('(//div[normalize-space()="Facing"])[1]');
    const selectFacing = page.locator('(//div[@class="mb-1"]//div)');
    const area = page.locator('(//div[normalize-space()="Area"])[1]');
    const minSqftRange = page.locator('//input[@name="Min"]');
    const maxSqftRange = page.locator('//input[@name="Max"]');
    const price = page.locator('(//div[normalize-space()="Price"])[1]');
    const minPriceRange = page.locator('//input[@name="Min"]');
    const maxPriceRange = page.locator('//input[@name="Max"]');
    const status = page.locator('(//div[normalize-space()="Status"])[1]');
    const CheckBox = page.locator('//input[@type="checkbox"]');
    const collectionAcceptButon = page.locator(
      '//button[normalize-space()="Accept"]',
    );
    const addListCollectionButton = page.locator(
      '//button[normalize-space()="+ Add Collections"]',
    );
    const goBackButton = page.locator('//button[normalize-space()="Go Back"]');
    const pinCollcetion = page.locator(
      '//div[contains(@class,"px-4 py-2 flex gap-2")]',
    );

    return {
      phoneTextbox,
      passwordTextbox,
      signInButton,
      invalidErrorMsg,
      invalidErrorMsgInForgot,
      blankErrorMsg,
      forgotPinLink,
      resendOtp,
      stockMenuButton,
      addStockButton,
      stockSaleRadioButton,
      stockTypeRadioButton,
      projectNameTextbox,
      reraIdTextbox,
      Websiteheading,
      Pagetitleheading,
      stockLocationTextbox,
      stockLocationDropdown,
      stockSubmitButton,
      forRentOrResaleRadioButton,
      stockSqftTextbox,
      stockBhkDropdown,
      stockFacingDropdown,
      overviewModuleButton,
      overviewEditButton,
      overviewProjNameTextbox,
      overviewDevNameTextbox,
      overviewAcresTextbox,
      overviewReraTextbox,
      overviewStatusDropdown,
      overviewSqftTextbox,
      overviewDescripTextarea,
      overviewLocationTextbox,
      overviewLocationMultiDropdown,
      overviewImageEditButton,
      overviewImageDeleteButton,
      overviewImageUploadButton,
      overviewprojectSubmitButton,
      overviewProjectImageUploadButton,
      overviewProjectBannerUploadButton,
      overviewImageBannerUploadButton,
      overviewprojectBnnerSubmitButton,
      overviewSubmitMultiButton,
      projectPublishButton,
      publishProceedButton,
      projectBackButton,
      unitModuleButton,
      addModelButton,
      modelBhkDropdown,
      modelBathDropDown,
      modelBalconyDropDown,
      modelWebSiteHeading,
      modelPageTittleHeading,
      modelFacingDropdown,
      modelSqftTextbox,
      modelSubmitButton,
      modelCard,
      modelDetialsButton,
      unitPageEditButton,
      unitPageSaveButton,
      updateBasePrice,
      unitBasePriceTextbox,
      modelBackButton,
      unitLabelNameEditButton,
      unitLabelName,
      unitLabelNameSaveButton,
      modelLabelNameEditButton,
      modelLabelName,
      modelLabelNameSaveButton,

      projectLinkButton,
      stockDetialEditButton,
      customEditButton,
      modelImageUploadButton,
      modelimageUpload,
      modelImageSubmitButton,
      modelPageFacingDropdown,
      modelPageBhkDropdown,
      modelPageSqftTextbox,
      modelpageBathDropDown,
      modelpageBalconyDropDown,
      modelPageBasePricetextBox,
      modelUnitDiscription,
      stockdetialSaveButton,
      customAddButton,
      customLabelNameTextbox,
      customPriceTypeButton,
      customTypeIncrease,
      customTypeDecrease,
      changePriceOnRadioButton,
      customYourPriceTextbox,
      customSaveButton,
      formulaBuildButton,
      formulaProceedButton,
      buildBlockButton,
      buildBlockTextbox,
      buildBlockDoneButton,
      buildFloorButton,
      buildFloorTextbox,
      buildFloorDoneButton,
      formulaSaveButton,
      sitePlanButton,
      siteUploadButton,
      sitePlanUpload,
      siteUploadDoneButton,
      sitePlanSelect,
      sitePlanSaveButton,
      floorPlanButton,
      floorUploadButton,
      floorPlanUpload,
      floorUploadDoneButton,
      floorPlanSelect,
      floorPlanSaveButton,
      galleryModuleButton,
      galleryAddButton,
      galleryImageUploadButton,
      galleryUploadDoneButton,
      galleryAfterAddButton,
      galleryYoutubeUploadTextbox,
      galleryYoutubePlusButton,
      galleryMenuMultiButton,
      amenitiesModuleButton,
      amenitiesEditMultiButton,
      amenitiesLabelMultiCheckbox,
      amenitiesSaveButton,
      amenitiesCustomAddButton,
      amenitiesCustomTextbox,
      amenitiesCustomSaveButton,
      homeloanModuleButton,
      loanAddButton,
      loanSearchTextbox,
      loanOptionAddMultiButton,
      loanApprovalFormButton,
      loanSubmitButton,
      loanAfterAddButton,
      loanCustomAddButton,
      loanCustomBankTextbox,
      loanCustomBankCreateButton,
      specModuleButton,
      specAddButton,
      specLabelMultiCheckbox,
      specLabelSaveButton,
      specEditButton,
      specSaveButton,
      specSubLabelMultiTextbox,
      specSubLabelMultiTextArea,
      neighModuleButton,
      neighAddButton,
      neighLabelMultiButton,
      neighCustomLabelTextbox,
      neighCustomLabelAddButton,
      neighRangeSlide,
      neighSaveButton,
      neighEditButton,
      profileButton,
      signOutButton,
      publishMessage,
      faqModuleButton,
      addFaqbutton,
      addMoreFaqbutton,
      questionTexBox,
      answerTextBox,
      SubmitFaqButton,

      menuModuleButton,
      menuEditButton,
      menuDeleteButton,
      menuAddButton,
      menuLabelEmptyTextbox,
      menuUrlEmptyTextbox,
      menuSaveButton,
      customPublish,
      publishMessageClose,
      publishModuleButton,
      visitSiteButton,
      menuPhoneTextbox,
      menuEmailTextbox,
      siginViaOtpButton,
      submitOtpButton,
      optSuccessMsg,
      unitBasePriceTextboxAssert,
      stocksMenuButton,
      collectionButton,
      addCollectionButton,
      collectionName,
      collectionDescription,
      colectionImageUploadFile,
      imageUpload,
      collectionImageSaveButton,
      collectionSaveButton,
      filterButton,
      projectName,
      companyName,
      projectLocation,
      projectTypesCategory,
      selectTypes,
      unitsType,
      selectUnitTYpes,
      bedrooms,
      SelectBhk,
      facing,
      selectFacing,
      area,
      minSqftRange,
      maxSqftRange,
      price,
      minPriceRange,
      maxPriceRange,
      status,
      CheckBox,
      collectionAcceptButon,
      addListCollectionButton,
      goBackButton,
      pinCollcetion,

      seoButton,
      seoEditButton,
      googleAnalytics,
      metaTitle,
      googleTagManager,
      ProjectSlug,
      metaKeywords,
      metaDescription,
      metaImageUpload,
      saveSeoButton,
      unitSeoButton,
      slugUrnButton,
      EditSlugUrnButton,
      slugTextAreaApart,
      slugSaveButton,
      seoDetailsButton,
      editSeoButton,
      metaTittle,
      metaKeyword,
      metaDiscription,
      seoImageUpload,
      seoSmbmitButton,
      unitContentSection1Button,
      unitContentSection2Button,
      unitContentSectionEditButton,
      unitContentSection2EditButton,
      unitSectionTitle,
      unitTitle,
      unitSubTitle,
      unitContentImage1,
      unitBackrountImage1,
      unitContentUploadImage1,
      unitContentDescriptionTextbox,
      unitContentSectionSubmitButton,
      unitContentSectionSaveButton,
      unitTagsButton,
      addUnitTagButton,
      tagNameTextbox,
      tagDescriptionTextbox,
      tagSubmitButton,
      projectTags,
      addtagcreateButton,
      projectTagNameTextbox,
      projectTagDescriptionTextbox,
      projectTagSubmitButton,
      projectContentSection1,
      projectContentSection2,
      projectContentEditButton,
      projectContent2EditButton,
      projectsectionTitle,
      projecttitle,
      projectsubTitle,
      projectcontentImage1,
      projectBackgroundImage1,
      projjectcontentSectionUploadImage,
      projectContentImageUploadSubmitButton,
      projectcontentDescriptionTextbox,
      projectContentSectionSaveButton,
    };
  }
}

module.exports = { WebElement };
