const { test, expect } = require("../../utils/authFixture");
const {
  skipIfDisabled,
  skipTestIfDisabled,
} = require("../../utils/moduleGuard");
const { CURRENT_ENV } = require("../../config/env.config");
const { createStock } = require("../../modules/stock/pages/CreateStockPage");
const { createUnit } = require("../../modules/stock/pages/createUnitPage");
const {
  uploadGallery,
} = require("../../modules/stock/pages/UploadGalleryPage");
const { addAmenities } = require("../../modules/stock/pages/AddAmenitiesPage");
const { addHomeLoan } = require("../../modules/stock/pages/AddHomeLoanPage");
const { addSpec } = require("../../modules/stock/pages/AddSpecPage");
const { addNeigh } = require("../../modules/stock/pages/AddNeighPage");
const { addOverview } = require("../../modules/stock/pages/AddOverviewPage");
const { addFaq } = require("../../modules/stock/pages/AddFaqsPage");
const { addSEODetails } = require("../../modules/stock/pages/AddSeoPage");
const { WebElement } = require("../../utils/GuiWebElements");
const { Collections } = require("../../modules/stock/pages/CollectionPage");
const {
  AddContentSection,
} = require("../../modules/stock/pages/AddContentSection");
const { AddTags } = require("../../modules/stock/pages/AddTags");
const webElement = new WebElement();

// Function-level execution toggles (Set true or false to enable or disable each step function)
const uploadGalleryEnabled = true;
const amenitiesEnabled = true;
const homeLoanEnabled = true;
const specEnabled = true;
const neighbourhoodEnabled = true;
const faqEnabled = false;
const tagsEnabled = true;
const seoEnabled = true;
const unitcontentSectionEnabled = true;
const unitSlugEnabled = true;
const unitseoEnabled = true;
const overviewEnabled = true;
const publishEnabled = true;
const projecttagsEnabled = true;
const projectcontentSectionEnabled = true;

let page;
let createstock;
let createunit;
let uploadgallery;
let amenities;
let homeloan;
let spec;
let addneigh;
let addfaq;
let addseo;
let addoverview;
let collection;
let addcontentsection;
let addtags;

// One authenticated page per worker (see utils/authFixture.js); page objects are
// rebuilt only when this worker's page changes.
test.beforeEach(async ({ authPage }) => {
  if (page === authPage) return;
  page = authPage;
  createstock = new createStock(page, expect);
  createunit = new createUnit(page, expect);
  uploadgallery = new uploadGallery(page, expect);
  amenities = new addAmenities(page, expect);
  homeloan = new addHomeLoan(page, expect);
  spec = new addSpec(page, expect);
  addneigh = new addNeigh(page, expect);
  addoverview = new addOverview(page, expect);
  addfaq = new addFaq(page, expect);
  addseo = new addSEODetails(page, expect);
  collection = new Collections(page, expect);
  addcontentsection = new AddContentSection(page, expect);
  addtags = new AddTags(page, expect);
});

test.describe("create new stock", () => {
  test.beforeEach(async () => {
    test.setTimeout(300000);
  });

  skipIfDisabled("stock");

  test("create apartment", async () => {
    skipTestIfDisabled("stock", "createApartment");
    // create stock
    await createstock.goto(CURRENT_ENV.stockUrl);
    await createstock.createApartment();

    // create model
    await createunit.addModelDetials();
    const randomFormula = Math.floor(Math.random() * 1) + 1;
    for (let i = 0; i < randomFormula; i++) {
      await createunit.navigateToUnit();
      await createunit.addUnit();
      await createunit.navigateToModelPage(i);
      await createunit.updateUnit();
      const randomCustomPriceCount = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < randomCustomPriceCount; j++) {
        await createunit.updateCustomPrice(j);
      }
      await createunit.createFormulaApartment();
      await createunit.UpdateModelLabelName();
      await createunit.UpdateUnitLabelName();
      await createunit.markOnSite();
      await createunit.markOnfloor();
      if (unitseoEnabled) {
        await createunit.unitSEO();
      }
      if (unitSlugEnabled) {
        await createunit.unitSlug();
      }
     
      if (unitcontentSectionEnabled) {
        await createunit.addUnitContentSection1();
        await createunit.addUnitContentSection2();
      }

      if (tagsEnabled) {
        await createunit.addUnitTags();
      }

      await createunit.navigateToProjectPage();
    }

    // upload gallery
    if (uploadGalleryEnabled) {
      await uploadgallery.navigateToGallery();
      for (let k = 0; k < 2; k++) {
        await uploadgallery.uploadSiteMap();
        await uploadgallery.uploadImage();
        await uploadgallery.uploadYoutube();
        await uploadgallery.uploadBrochure();
      }
    }

    // upload amenities
    if (amenitiesEnabled) {
      await amenities.navigateToAmenities();
      await amenities.uploadSports();
      await amenities.uploadConvenience();
      await amenities.uploadLeisure();
      await amenities.uploadSafety();
      await amenities.uploadEnvironment();
    }

    // home loans
    if (homeLoanEnabled) {
      await homeloan.navigateToHomeloan();
      await homeloan.addBank();
      await homeloan.addCustomBank();
    }

    // Specification
    if (specEnabled) {
      await spec.navigateToSpec();
      await spec.addLabel();
      await spec.addLabelTextbox();
      await spec.addLabelTextArea();
    }

    // neighbourhood
    if (neighbourhoodEnabled) {
      await addneigh.navigateToNeigh();
      await addneigh.addLandmarks();
      await addneigh.addCustomLandmarks();
      await addneigh.neighSave();
    }

    // AddFAQ
    if (faqEnabled) {
      await addfaq.navigateTOFaqs();
      await addfaq.addFaq();
    }

    // Add Content Section
    if (projectcontentSectionEnabled) {
      await addcontentsection.addProjectContentSection1();
      await addcontentsection.addProjectContentSection2();
    }

    // Add Tags
    if (projecttagsEnabled) {
      await addtags.addProjectTags();
    }

    // SEO Details
    if (seoEnabled) {
      await addseo.navigateTOSeo();
      await addseo.addSeo();
    }

    // overview
    if (overviewEnabled) {
      await addoverview.navigateToOverview();
      await addoverview.addProjectDetials();
    }

    // publish
    if (publishEnabled) {
      await addoverview.projectPublish(true);
    }
  });

  test("create villa", async () => {
    skipTestIfDisabled("stock", "createVilla");
    // create stock
    await createstock.goto(CURRENT_ENV.stockUrl);

    await createstock.createVilla();

    // create model
    await createunit.addModelDetials();
    const randomFormula = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < randomFormula; i++) {
      await createunit.navigateToUnit();
      await createunit.addUnit();
      await createunit.navigateToModelPage(i);
      await createunit.updateUnit();
      const randomCustomPriceCount = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < randomCustomPriceCount; j++) {
        await createunit.updateCustomPrice(j);
      }
      await createunit.createFormula();
      await createunit.UpdateModelLabelName();
      await createunit.UpdateUnitLabelName();
      await createunit.markOnSite();

      if (unitseoEnabled) {
        await createunit.unitSEO();
      }
      if (unitSlugEnabled) {
        await createunit.unitSlug();
      }
      if (unitcontentSectionEnabled) {
        await createunit.addUnitContentSection1();
        await createunit.addUnitContentSection2();
      }

      if (tagsEnabled) {
        await createunit.addUnitTags();
      }



      await createunit.navigateToProjectPage();
    }

    // upload gallery
    if (uploadGalleryEnabled) {
      await uploadgallery.navigateToGallery();
      for (let k = 0; k < 2; k++) {
        await uploadgallery.uploadSiteMap();
        await uploadgallery.uploadImage();
        await uploadgallery.uploadYoutube();
        await uploadgallery.uploadBrochure();
      }
    }

    // upload amenities
    if (amenitiesEnabled) {
      await amenities.navigateToAmenities();
      await amenities.uploadSports();
      await amenities.uploadConvenience();
      await amenities.uploadLeisure();
      await amenities.uploadSafety();
      await amenities.uploadEnvironment();
    }

    // home loans
    if (homeLoanEnabled) {
      await homeloan.navigateToHomeloan();
      await homeloan.addBank();
      await homeloan.addCustomBank();
    }

    // Specification
    if (specEnabled) {
      await spec.navigateToSpec();
      await spec.addLabel();
      await spec.addLabelTextbox();
      await spec.addLabelTextArea();
    }

    // neighbourhood
    if (neighbourhoodEnabled) {
      await addneigh.navigateToNeigh();
      await addneigh.addLandmarks();
      await addneigh.addCustomLandmarks();
      await addneigh.neighSave();
    }

    // AddFAQ
    if (faqEnabled) {
      await addfaq.navigateTOFaqs();
      await addfaq.addFaq();
    }

    // Add Content Section
    if (projectcontentSectionEnabled) {
      await addcontentsection.addProjectContentSection1();
      await addcontentsection.addProjectContentSection2();
    }

    // Add Tags
    if (tagsEnabled) {
      await addtags.addProjectTags();
    }

    // SEO Details
    if (seoEnabled) {
      await addseo.navigateTOSeo();
      await addseo.addSeo();
    }

    // overview
    if (overviewEnabled) {
      await addoverview.navigateToOverview();
      await addoverview.addProjectDetials();
    }

    // publish
    if (publishEnabled) {
      await addoverview.projectPublish(true);
    }
  });

  test("create row house", async () => {
    skipTestIfDisabled("stock", "createRowHouse");
    // create stock
    await createstock.goto(CURRENT_ENV.stockUrl);
    await createstock.createRowhouse();

    // create model
    await createunit.addModelDetials();
    const randomFormula = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < randomFormula; i++) {
      await createunit.navigateToUnit();
      await createunit.addUnit();
      await createunit.navigateToModelPage(i);
      await createunit.updateUnit();
      const randomCustomPriceCount = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < randomCustomPriceCount; j++) {
        await createunit.updateCustomPrice(j);
      }
      await createunit.createFormula();
      await createunit.UpdateModelLabelName();
      await createunit.UpdateUnitLabelName();
      await createunit.markOnSite();
      if (unitseoEnabled) {
        await createunit.unitSEO();
      }
      if (unitSlugEnabled) {
        await createunit.unitSlug();
      }
      if (unitcontentSectionEnabled) {
        await createunit.addUnitContentSection1();
        await createunit.addUnitContentSection2();
      }

      if (tagsEnabled) {
        await createunit.addUnitTags();
      }
      await createunit.navigateToProjectPage();
    }

    // upload gallery
    if (uploadGalleryEnabled) {
      await uploadgallery.navigateToGallery();
      for (let k = 0; k < 2; k++) {
        await uploadgallery.uploadSiteMap();
        await uploadgallery.uploadImage();
        await uploadgallery.uploadYoutube();
        await uploadgallery.uploadBrochure();
      }
    }

    // upload amenities
    if (amenitiesEnabled) {
      await amenities.navigateToAmenities();
      await amenities.uploadSports();
      await amenities.uploadConvenience();
      await amenities.uploadLeisure();
      await amenities.uploadSafety();
      await amenities.uploadEnvironment();
    }

    // home loans
    if (homeLoanEnabled) {
      await homeloan.navigateToHomeloan();
      await homeloan.addBank();
      await homeloan.addCustomBank();
    }

    // Specification
    if (specEnabled) {
      await spec.navigateToSpec();
      await spec.addLabel();
      await spec.addLabelTextbox();
      await spec.addLabelTextArea();
    }

    // neighbourhood
    if (neighbourhoodEnabled) {
      await addneigh.navigateToNeigh();
      await addneigh.addLandmarks();
      await addneigh.addCustomLandmarks();
      await addneigh.neighSave();
    }

    // AddFAQ
    if (faqEnabled) {
      await addfaq.navigateTOFaqs();
      await addfaq.addFaq();
    }

    // Add Content Section
    if (projectcontentSectionEnabled) {
      await addcontentsection.addProjectContentSection1();
      await addcontentsection.addProjectContentSection2();
    }

    // Add Tags
    if (tagsEnabled) {
      await addtags.addProjectTags();
    }

    // SEO Details
    if (seoEnabled) {
      await addseo.navigateTOSeo();
      await addseo.addSeo();
    }

    // overview
    if (overviewEnabled) {
      await addoverview.navigateToOverview();
      await addoverview.addProjectDetials();
    }

    // publish
    if (publishEnabled) {
      await addoverview.projectPublish(true);
    }
  });

test("create plot", async () => {
    skipTestIfDisabled("stock", "createPlot");
    // create stock
    await createstock.goto(CURRENT_ENV.stockUrl);

    await createstock.createPlot();

    // create model
    await createunit.addModelDetials();
    const randomFormula = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < randomFormula; i++) {
      await createunit.navigateToUnit();
      await createunit.addPlot();
      await createunit.navigateToModelPage(i);
      await createunit.updatePlot();
      const randomCustomPriceCount = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < randomCustomPriceCount; j++) {
        await createunit.updateCustomPrice(j);
      }
      await createunit.createFormula();
      await createunit.UpdateModelLabelName();
      await createunit.UpdateUnitLabelName();
      await createunit.markOnSite();


      if (unitseoEnabled) {
        await createunit.unitSEO();
      }
      if (unitSlugEnabled) {
        await createunit.unitSlug();
      }
      if (unitcontentSectionEnabled) {
        await createunit.addUnitContentSection1();
        await createunit.addUnitContentSection2();
      }

      if (tagsEnabled) {
        await createunit.addUnitTags();
      }
      await createunit.navigateToProjectPage();
    }

    // upload gallery
    if (uploadGalleryEnabled) {
      await uploadgallery.navigateToGallery();
      for (let k = 0; k < 2; k++) {
        await uploadgallery.uploadSiteMap();
        await uploadgallery.uploadImage();
        await uploadgallery.uploadYoutube();
        await uploadgallery.uploadBrochure();
      }
    }

    // upload amenities
    if (amenitiesEnabled) {
      await amenities.navigateToAmenities();
      await amenities.uploadSports();
      await amenities.uploadConvenience();
      await amenities.uploadLeisure();
      await amenities.uploadSafety();
      await amenities.uploadEnvironment();
    }

    // home loans
    if (homeLoanEnabled) {
      await homeloan.navigateToHomeloan();
      await homeloan.addBank();
      await homeloan.addCustomBank();
    }

    // Specification
    if (specEnabled) {
      await spec.navigateToSpec();
      await spec.addLabel();
      await spec.addLabelTextbox();
      await spec.addLabelTextArea();
    }

    // neighbourhood
    if (neighbourhoodEnabled) {
      await addneigh.navigateToNeigh();
      await addneigh.addLandmarks();
      await addneigh.addCustomLandmarks();
      await addneigh.neighSave();
    }

    // AddFAQ
    if (faqEnabled) {
      await addfaq.navigateTOFaqs();
      await addfaq.addFaq();
    }

    // Add Content Section
    if (projectcontentSectionEnabled) {
      await addcontentsection.addProjectContentSection1();
      await addcontentsection.addProjectContentSection2();
    }

    // Add Tags
    if (tagsEnabled) {
      await addtags.addProjectTags();
    }

    // SEO Details
    if (seoEnabled) {
      await addseo.navigateTOSeo();
      await addseo.addSeo();
    }

    // overview
    if (overviewEnabled) {
      await addoverview.navigateToOverview();
      await addoverview.addProjectDetials();
    }

    // publish
    if (publishEnabled) {
      await addoverview.projectPublish(true);
    }
  });

  test("create secondary resale flat", async () => {
    skipTestIfDisabled("stock", "createSecondaryResaleFlat");
    // create stock
    await createstock.goto(CURRENT_ENV.stockUrl);

    await createstock.createSecondaryResaleFlat();

    // update Model
    await createunit.navigateToUnit();
    await createunit.addSecResaleModelDetials();
    await createunit.navigateToModelPage(0);
    await createunit.updateUnit();
    await createunit.UpdateModelLabelName();
    await createunit.UpdateUnitLabelName();
    const randomCustomPriceCount = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < randomCustomPriceCount; j++) {
      await createunit.updateCustomPrice(j);
    }
     await createunit.UpdateModelLabelName();
      await createunit.UpdateUnitLabelName();
    await createunit.markOnSite();


    if (unitseoEnabled) {
        await createunit.unitSEO();
      }
      if (unitSlugEnabled) {
        await createunit.unitSlug();
      }
      if (unitcontentSectionEnabled) {
        await createunit.addUnitContentSection1();
        await createunit.addUnitContentSection2();
      }

      if (tagsEnabled) {
        await createunit.addUnitTags();
      }
    await createunit.navigateToProjectPage();

    // upload gallery
    if (uploadGalleryEnabled) {
      await uploadgallery.navigateToGallery();
      for (let k = 0; k < 2; k++) {
        await uploadgallery.uploadSiteMap();
        await uploadgallery.uploadImage();
        await uploadgallery.uploadYoutube();
        await uploadgallery.uploadBrochure();
      }
    }

    // upload amenities
    if (amenitiesEnabled) {
      await amenities.navigateToAmenities();
      await amenities.uploadSports();
      await amenities.uploadConvenience();
      await amenities.uploadLeisure();
      await amenities.uploadSafety();
      await amenities.uploadEnvironment();
    }

    // home loans
    if (homeLoanEnabled) {
      await homeloan.navigateToHomeloan();
      await homeloan.addBank();
      await homeloan.addCustomBank();
    }

    // Specification
    if (specEnabled) {
      await spec.navigateToSpec();
      await spec.addLabel();
      await spec.addLabelTextbox();
      await spec.addLabelTextArea();
    }

    // neighbourhood
    if (neighbourhoodEnabled) {
      await addneigh.navigateToNeigh();
      await addneigh.addLandmarks();
      await addneigh.addCustomLandmarks();
      await addneigh.neighSave();
    }

    // AddFAQ
    if (faqEnabled) {
      await addfaq.navigateTOFaqs();
      await addfaq.addFaq();
    }

    // Add Content Section
    if (projectcontentSectionEnabled) {
      await addcontentsection.addProjectContentSection1();
      await addcontentsection.addProjectContentSection2();
    }

    // Add Tags
    if (tagsEnabled) {
      await addtags.addProjectTags();
    }

    // SEO Details
    if (seoEnabled) {
      await addseo.navigateTOSeo();
      await addseo.addSeo();
    }

    // overview
    if (overviewEnabled) {
      await addoverview.navigateToOverview();
      await addoverview.addSecProjectDetials();
    }

    // publish
    if (publishEnabled) {
      await addoverview.projectPublish(true);
    }
  });

  test("create secondary resale house", async () => {
    skipTestIfDisabled("stock", "createSecondaryResaleHouse");
    // create stock
    await createstock.goto(CURRENT_ENV.stockUrl);

    await createstock.createSecondaryResaleHouse();

    // update Model
    await createunit.navigateToUnit();
    await createunit.addSecResaleModelDetials();
    await createunit.navigateToModelPage(0);
    await createunit.updateUnit();
    await createunit.UpdateModelLabelName();
    await createunit.UpdateUnitLabelName();
    const randomCustomPriceCount = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < randomCustomPriceCount; j++) {
      await createunit.updateCustomPrice(j);
    }
    await createunit.markOnSite();
    if (unitseoEnabled) {
        await createunit.unitSEO();
      }
      if (unitSlugEnabled) {
        await createunit.unitSlug();
      }
      if (unitcontentSectionEnabled) {
        await createunit.addUnitContentSection1();
        await createunit.addUnitContentSection2();
      }

      if (tagsEnabled) {
        await createunit.addUnitTags();
      }
    await createunit.navigateToProjectPage();

    // upload gallery
    if (uploadGalleryEnabled) {
      await uploadgallery.navigateToGallery();
      for (let k = 0; k < 2; k++) {
        await uploadgallery.uploadSiteMap();
        await uploadgallery.uploadImage();
        await uploadgallery.uploadYoutube();
        await uploadgallery.uploadBrochure();
      }
    }

    // upload amenities
    if (amenitiesEnabled) {
      await amenities.navigateToAmenities();
      await amenities.uploadSports();
      await amenities.uploadConvenience();
      await amenities.uploadLeisure();
      await amenities.uploadSafety();
      await amenities.uploadEnvironment();
    }

    // home loans
    if (homeLoanEnabled) {
      await homeloan.navigateToHomeloan();
      await homeloan.addBank();
      await homeloan.addCustomBank();
    }

    // Specification
    if (specEnabled) {
      await spec.navigateToSpec();
      await spec.addLabel();
      await spec.addLabelTextbox();
      await spec.addLabelTextArea();
    }

    // neighbourhood
    if (neighbourhoodEnabled) {
      await addneigh.navigateToNeigh();
      await addneigh.addLandmarks();
      await addneigh.addCustomLandmarks();
      await addneigh.neighSave();
    }

    // AddFAQ
    if (faqEnabled) {
      await addfaq.navigateTOFaqs();
      await addfaq.addFaq();
    }

    // Add Content Section
    if (projectcontentSectionEnabled) {
      await addcontentsection.addProjectContentSection1();
      await addcontentsection.addProjectContentSection2();
    }

    // Add Tags
    if (tagsEnabled) {
      await addtags.addProjectTags();
    }

    // SEO Details
    if (seoEnabled) {
      await addseo.navigateTOSeo();
      await addseo.addSeo();
    }

    // overview
    if (overviewEnabled) {
      await addoverview.navigateToOverview();
      await addoverview.addSecProjectDetials();
    }

    // publish
    if (publishEnabled) {
      await addoverview.projectPublish(true);
    }
  });

  test("create secondary resale plot", async () => {
    skipTestIfDisabled("stock", "createSecondaryResalePlot");
    // create stock
    await createstock.goto(CURRENT_ENV.stockUrl);

    await createstock.createSecondaryResalePlot();

    // update Model
    await createunit.navigateToUnit();
    await createunit.addSecResaleModelDetials();
    await createunit.navigateToModelPage(0);
    await createunit.updatePlot();
    const randomCustomPriceCount = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < randomCustomPriceCount; j++) {
      await createunit.updateCustomPrice(j);
    }
     await createunit.UpdateModelLabelName();
      await createunit.UpdateUnitLabelName();
    await createunit.markOnSite();
    if (unitseoEnabled) {
        await createunit.unitSEO();
      }
      if (unitSlugEnabled) {
        await createunit.unitSlug();
      }
      if (unitcontentSectionEnabled) {
        await createunit.addUnitContentSection1();
        await createunit.addUnitContentSection2();
      }

      if (tagsEnabled) {
        await createunit.addUnitTags();
      }
    await createunit.navigateToProjectPage();

    // upload gallery
    if (uploadGalleryEnabled) {
      await uploadgallery.navigateToGallery();
      for (let k = 0; k < 2; k++) {
        await uploadgallery.uploadSiteMap();
        await uploadgallery.uploadImage();
        await uploadgallery.uploadYoutube();
        await uploadgallery.uploadBrochure();
      }
    }

    // upload amenities
    if (amenitiesEnabled) {
      await amenities.navigateToAmenities();
      await amenities.uploadSports();
      await amenities.uploadConvenience();
      await amenities.uploadLeisure();
      await amenities.uploadSafety();
      await amenities.uploadEnvironment();
    }

    // home loans
    if (homeLoanEnabled) {
      await homeloan.navigateToHomeloan();
      await homeloan.addBank();
      await homeloan.addCustomBank();
    }

    // Specification
    if (specEnabled) {
      await spec.navigateToSpec();
      await spec.addLabel();
      await spec.addLabelTextbox();
      await spec.addLabelTextArea();
    }

    // neighbourhood
    if (neighbourhoodEnabled) {
      await addneigh.navigateToNeigh();
      await addneigh.addLandmarks();
      await addneigh.addCustomLandmarks();
      await addneigh.neighSave();
    }

    // AddFAQ
    if (faqEnabled) {
      await addfaq.navigateTOFaqs();
      await addfaq.addFaq();
    }

    // Add Content Section
    if (projectcontentSectionEnabled) {
      await addcontentsection.addProjectContentSection1();
      await addcontentsection.addProjectContentSection2();
    }

    // Add Tags
    if (tagsEnabled) {
      await addtags.addProjectTags();
    }

    // SEO Details
    if (seoEnabled) {
      await addseo.navigateTOSeo();
      await addseo.addSeo();
    }

    // overview
    if (overviewEnabled) {
      await addoverview.navigateToOverview();
      await addoverview.addSecPlotProjectDetials();
    }

    // publish
    if (publishEnabled) {
      await addoverview.projectPublish(true);
    }
  });

  test("create secondary rent flat", async () => {
    skipTestIfDisabled("stock", "createSecondaryRentFlat");
    // create stock
    await createstock.goto(CURRENT_ENV.stockUrl);

    await createstock.createSecondaryRentFlat();

    // update Model
    await createunit.navigateToUnit();
    await createunit.addSecRentModelDetials();
    await createunit.navigateToModelPage(0);
    await createunit.updateUnit();
    await createunit.UpdateModelLabelName();
    await createunit.UpdateUnitLabelName();
    const randomCustomPriceCount = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < randomCustomPriceCount; j++) {
      await createunit.updateCustomPrice(j);
    }
    await createunit.markOnSite();
    if (unitseoEnabled) {
        await createunit.unitSEO();
      }
      if (unitSlugEnabled) {
        await createunit.unitSlug();
      }
      if (unitcontentSectionEnabled) {
        await createunit.addUnitContentSection1();
        await createunit.addUnitContentSection2();
      }

      if (tagsEnabled) {
        await createunit.addUnitTags();
      }
    await createunit.navigateToProjectPage();

    // upload gallery
    if (uploadGalleryEnabled) {
      await uploadgallery.navigateToGallery();
      for (let k = 0; k < 2; k++) {
        await uploadgallery.uploadSiteMap();
        await uploadgallery.uploadImage();
        await uploadgallery.uploadYoutube();
        await uploadgallery.uploadBrochure();
      }
    }

    // upload amenities
    if (amenitiesEnabled) {
      await amenities.navigateToAmenities();
      await amenities.uploadSports();
      await amenities.uploadConvenience();
      await amenities.uploadLeisure();
      await amenities.uploadSafety();
      await amenities.uploadEnvironment();
    }

    // home loans
    if (homeLoanEnabled) {
      await homeloan.navigateToHomeloan();
      await homeloan.addBank();
      await homeloan.addCustomBank();
    }

    // Specification
    if (specEnabled) {
      await spec.navigateToSpec();
      await spec.addLabel();
      await spec.addLabelTextbox();
      await spec.addLabelTextArea();
    }

    // neighbourhood
    if (neighbourhoodEnabled) {
      await addneigh.navigateToNeigh();
      await addneigh.addLandmarks();
      await addneigh.addCustomLandmarks();
      await addneigh.neighSave();
    }

    // AddFAQ
    if (faqEnabled) {
      await addfaq.navigateTOFaqs();
      await addfaq.addFaq();
    }

    // Add Content Section
    if (projectcontentSectionEnabled) {
      await addcontentsection.addProjectContentSection1();
      await addcontentsection.addProjectContentSection2();
    }

    // Add Tags
    if (tagsEnabled) {
      await addtags.addProjectTags();
    }

    // SEO Details
    if (seoEnabled) {
      await addseo.navigateTOSeo();
      await addseo.addSeo();
    }

    // overview
    if (overviewEnabled) {
      await addoverview.navigateToOverview();
      await addoverview.addSecProjectDetials();
    }

    // publish
    if (publishEnabled) {
      await addoverview.projectPublish(true);
    }
  });

  test("create secondary rent house", async () => {
    skipTestIfDisabled("stock", "createSecondaryRentHouse");
    // create stock
    await createstock.goto(CURRENT_ENV.stockUrl);

    await createstock.createSecondaryRentHouse();

    // update Model
    await createunit.navigateToUnit();
    await createunit.addSecRentModelDetials();
    await createunit.navigateToModelPage(0);
    await createunit.updateUnit();
    await createunit.UpdateModelLabelName();
    await createunit.UpdateUnitLabelName();
    const randomCustomPriceCount = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < randomCustomPriceCount; j++) {
      await createunit.updateCustomPrice(j);
    }
    await createunit.markOnSite();
    if (unitseoEnabled) {
        await createunit.unitSEO();
      }
      if (unitSlugEnabled) {
        await createunit.unitSlug();
      }
      if (unitcontentSectionEnabled) {
        await createunit.addUnitContentSection1();
        await createunit.addUnitContentSection2();
      }

      if (tagsEnabled) {
        await createunit.addUnitTags();
      }
    await createunit.navigateToProjectPage();

    // upload gallery
    if (uploadGalleryEnabled) {
      await uploadgallery.navigateToGallery();
      for (let k = 0; k < 2; k++) {
        await uploadgallery.uploadSiteMap();
        await uploadgallery.uploadImage();
        await uploadgallery.uploadYoutube();
        await uploadgallery.uploadBrochure();
      }
    }

    // upload amenities
    if (amenitiesEnabled) {
      await amenities.navigateToAmenities();
      await amenities.uploadSports();
      await amenities.uploadConvenience();
      await amenities.uploadLeisure();
      await amenities.uploadSafety();
      await amenities.uploadEnvironment();
    }

    // home loans
    if (homeLoanEnabled) {
      await homeloan.navigateToHomeloan();
      await homeloan.addBank();
      await homeloan.addCustomBank();
    }

    // Specification
    if (specEnabled) {
      await spec.navigateToSpec();
      await spec.addLabel();
      await spec.addLabelTextbox();
      await spec.addLabelTextArea();
    }

    // neighbourhood
    if (neighbourhoodEnabled) {
      await addneigh.navigateToNeigh();
      await addneigh.addLandmarks();
      await addneigh.addCustomLandmarks();
      await addneigh.neighSave();
    }

    // AddFAQ
    if (faqEnabled) {
      await addfaq.navigateTOFaqs();
      await addfaq.addFaq();
    }

    // Add Content Section
    if (projectcontentSectionEnabled) {
      await addcontentsection.addProjectContentSection1();
      await addcontentsection.addProjectContentSection2();
    }

    // Add Tags
    if (tagsEnabled) {
      await addtags.addProjectTags();
    }

    // SEO Details
    if (seoEnabled) {
      await addseo.navigateTOSeo();
      await addseo.addSeo();
    }

    // overview
    if (overviewEnabled) {
      await addoverview.navigateToOverview();
      await addoverview.addSecProjectDetials();
    }

    // publish
    if (publishEnabled) {
      await addoverview.projectPublish(true);
    }
  });
});
