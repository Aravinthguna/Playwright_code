const { test, expect } = require("../../utils/authFixture");
const {
  skipIfDisabled,
  skipTestIfDisabled,
} = require("../../utils/moduleGuard");
const { CURRENT_ENV } = require("../../config/env.config");
const { WebSite } = require("../../modules/mysite/pages/WebSitePage");
const { Theme } = require("../../modules/mysite/pages/ThemePage");
const { HomePage } = require("../../modules/mysite/pages/HomePage");
const { StorePage } = require("../../modules/mysite/pages/StorePage");
const {
  OnBoardPartners,
} = require("../../modules/mysite/pages/OnBoardPartnersPage");
const { ContactUS } = require("../../modules/mysite/pages/ContactUsPage");

// Function-level execution toggles (Set true to run, false to skip)
// --- Mysite Page Toggles ---
const webSiteDetailsEnabled = true;
const gtmEnabled = true;

// --- Theme Page Toggles ---
const personalizationEnabled = true;
const headerEnabled = true;
const footerEnabled = true;
const socialMediaEnabled = true;
const favIconEnabled = true;

// --- Home Page Toggles ---
const homeBannerEnabled = true;
const homeFilterEnabled = true;
const featuredStockEnabled = true;
const collectionEnabled = true;
const servicesEnabled = true;
const defaultCollectionsEnabled = true;
const aboutUsEnabled = true;
const testimonialsEnabled = true;
const cardSectionEnabled = true;
const accordionSectionEnabled = true;
const statisticsEnabled = true;
const latestPropertiesEnabled = true;

// --- Store Page Toggles ---
const storeBannerEnabled = true;
const cardStyleEnabled = true;

// --- Onboard Partners Toggles ---
const onBoardPartnersEnabled = true;

// --- Contact Us Page Toggles ---
const contactUsEnabled = true;
const contentSectionEnabled = true;
const publishEnabled = true;

let page;
let webSite;
let theme;
let home;
let store;
let onboard;
let contactUs;

test.beforeEach(async ({ authPage }) => {
  if (page === authPage) return;
  page = authPage;
  webSite = new WebSite(page, expect);
  theme = new Theme(page, expect);
  home = new HomePage(page, expect);
  store = new StorePage(page, expect);
  onboard = new OnBoardPartners(page, expect);
  contactUs = new ContactUS(page, expect);
});

test.describe("Mysite", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async () => {
    test.setTimeout(180000);
  });

  skipIfDisabled("mySite");

  test("Mysite", async () => {
    skipTestIfDisabled("mySite", "mysite");
    await webSite.goto(CURRENT_ENV.mySiteUrl);
    if (webSiteDetailsEnabled) {
      await webSite.webSiteDetails();
    }
    if (gtmEnabled) {
      await webSite.gtm();
    }
  });

  test("them Page", async () => {
    skipTestIfDisabled("mySite", "themePage");
    await webSite.goto(CURRENT_ENV.mySiteUrl);
    if (personalizationEnabled) {
      await theme.personalization();
    }
    if (headerEnabled) {
      await theme.header();
    }
    if (footerEnabled) {
      await theme.footer();
    }
    if (socialMediaEnabled) {
      await theme.socialMedia();
    }
    if (favIconEnabled) {
      await theme.favIcon();
    }
  });

  test("Home Page", async () => {
    skipTestIfDisabled("mySite", "homePage");
    await webSite.goto(CURRENT_ENV.mySiteUrl);
    if (homeBannerEnabled) {
      await home.homeBanner();
    }
    if (homeFilterEnabled) {
      await home.homeFilter();
    }
    if (featuredStockEnabled) {
      await home.featuredStock();
    }
    if (collectionEnabled) {
      await home.collection();
    }
    if (servicesEnabled) {
      await home.services();
    }
    if (defaultCollectionsEnabled) {
      await home.defaultCollections();
    }
    if (aboutUsEnabled) {
      await home.aboutUs();
    }
    if (testimonialsEnabled) {
      await home.testimonials();
    }
    if (cardSectionEnabled) {
      await home.CardSection();
    }
    if (accordionSectionEnabled) {
      await home.AccordionSection();
    }
    if (statisticsEnabled) {
      await home.statistics();
    }
    if (latestPropertiesEnabled) {
      await home.latestProperties();
    }
  });

  test("Store Page", async () => {
    skipTestIfDisabled("mySite", "storePage");
    await webSite.goto(CURRENT_ENV.mySiteUrl);
    if (storeBannerEnabled) {
      await store.storeBanner();
    }
    if (cardStyleEnabled) {
      await store.cardStyle();
    }
  });

  test("Onborad Partners", async () => {
    skipTestIfDisabled("mySite", "onboardPartners");
    await webSite.goto(CURRENT_ENV.mySiteUrl);
    if (onBoardPartnersEnabled) {
      await onboard.onBoardPartners();
    }
  });

  test("CONTACTUS PAGE", async () => {
    skipTestIfDisabled("mySite", "contactUs");
    await webSite.goto(CURRENT_ENV.mySiteUrl);
    if (contactUsEnabled) {
      await contactUs.contactUs();
    }
    if (contentSectionEnabled) {
      await contactUs.contentSecion();
    }
    if (publishEnabled) {
      await contactUs.overAllPublish();
    }
  });
});
