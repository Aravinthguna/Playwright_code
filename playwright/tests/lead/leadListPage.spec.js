const { test, expect } = require("../../utils/authFixture");
const {
  skipIfDisabled,
  skipTestIfDisabled,
} = require("../../utils/moduleGuard");
const { WebElement } = require("../../utils/WebElements");
const { CreateNewLead } = require("../../modules/lead/pages/CreateLeadPage");
const { LeadeDetails } = require("../../modules/lead/pages/LeadDetailsPage");
const {
  LeadActivites,
} = require("../../modules/lead/pages/LeadActivitiesPage");
const { PipeLinePage } = require("../../modules/lead/pages/PipelinePage");
const { CreateContact } = require("../../modules/lead/pages/CreateContact");
const {
  LeadCSVUploadPage,
} = require("../../modules/lead/pages/LeadCSVUploadPage");
const {
  UnverifiedLeadPage,
} = require("../../modules/lead/pages/UnverifiedLeadPage");
const { SpamLeadPage } = require("../../modules/lead/pages/SpamLeadPage");
const { ContactListPage } = require("../../modules/lead/pages/ContactListPage");
const { CallManagerPage } = require("../../modules/lead/pages/CallManagerPage");
const {
  SourceReportPage,
} = require("../../modules/lead/pages/SourceReportPage");
const {
  PipelineFunnelPage,
} = require("../../modules/lead/pages/PipelineFunnelPage");
const {
  TeamsReportPage,
} = require("../../modules/lead/pages/TeamsReportPage");
const {
  StatusReportPage,
} = require("../../modules/lead/pages/StatusReportPage");
const {
  TrendReportPage,
} = require("../../modules/lead/pages/TrendReportPage");
const {
  ENVS,
  ENV_INDEX,
  createAuthenticatedPage,
} = require("../../config/env.config");

// Function-level execution toggles (Set true to run, false to skip)
// --- Create Lead Toggles ---
const createNewLeadEnabled = true;

// --- Edit Lead Toggles ---
const editLeadDetailsEnabled = true;
const leadAssignToStaffEnabled = true;
const leadCurrentStatusEnabled = true;
const createPersonalDetailsEnabled = true;
const editPersonalDetailsEnabled = true;
// --- Site Visit Toggles ---
const addSiteVisitEnabled = true;

// --- Lead Activities Toggles ---
const notePageDetailsEnabled = true;
const tellCallDetailsEnabled = true;
const videoCallDetailsEnabled = true;
const mailDetailsEnabled = true;
const messageDetailsEnabled = true;
const directMessageDetailsEnabled = true;
const addInterestedStockEnabled = false;
const linkedContactEnabled = true;
const createContactEnabled = true;

// --- Pipeline Page Toggles ---
const pipelinePageDetailsEnabled = false;

// --- Lead List Sections Toggles (Unverified, Spam, Contact List, Call Manager, Reports) ---
const unverifiedLeadEnabled = true;
const spamLeadEnabled = true;
const contactListEnabled = true;
const callManagerEnabled = true;
const sourceReportEnabled = true;
const pipelineFunnelReportEnabled = true;
const teamsReportEnabled = true;
const statusReportEnabled = true;
const trendReportEnabled = true;
// Max timeout (3 minutes) allocating headroom for concurrent execution of the complete 70-scenario advance-filter suite
const TEAMS_REPORT_TIMEOUT_MS = 180000;

// --- Lead CSV Upload Toggles (Set true to run, false to skip) ---
const uploadSingleValidLeadEnabled = false;
const uploadMultipleValidLeadsEnabled = true;
const uploadSequentialBatchesEnabled = true;
const uploadCheckboxTogglesEnabled = true;
const uploadNegativeScenariosEnabled = true;

const currentEnv = ENVS[ENV_INDEX];
const webElement = new WebElement();
let url = currentEnv.leadUrl || currentEnv.url;
let page;
let createNewLead;
let leadeDetails;
let leadActivites;
let pipeLinePage;
let createContact;
let leadCSVUploadPage;
let unverifiedLeadPage;
let spamLeadPage;
let contactListPage;
let callManagerPage;
let sourceReportPage;
let pipelineFunnelPage;
let teamsReportPage;
let statusReportPage;
let trendReportPage;

test.beforeAll(async ({ browser, request }) => {
  page = await createAuthenticatedPage(browser, request);
  createNewLead = new CreateNewLead(page);
  leadeDetails = new LeadeDetails(page);
  leadActivites = new LeadActivites(page);
  pipeLinePage = new PipeLinePage(page);
  createContact = new CreateContact(page);
  leadCSVUploadPage = new LeadCSVUploadPage(page);
  unverifiedLeadPage = new UnverifiedLeadPage(page);
  spamLeadPage = new SpamLeadPage(page);
  contactListPage = new ContactListPage(page);
  callManagerPage = new CallManagerPage(page);
  sourceReportPage = new SourceReportPage(page);
  pipelineFunnelPage = new PipelineFunnelPage(page);
  teamsReportPage = new TeamsReportPage(page);
  statusReportPage = new StatusReportPage(page);
  trendReportPage = new TrendReportPage(page);
});

/**
 * Open the lead list and wait for the SPA to settle. On start-up the app fires
 * API calls before its CSRF token is ready (403s) and then re-initialises
 * itself with a reload of /lead; under parallel load that reload can land after
 * a test has started typing and wipe the open form. Instead of a fixed sleep,
 * wait until no main-frame navigation has happened for `quietMs` (restarting
 * the window on every navigation, bounded by `maxMs`).
 */
async function openLeadList(quietMs = 1000, maxMs = 15000) {
  await page.goto(url);
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    const navigated = await page
      .waitForEvent("framenavigated", {
        predicate: (f) => f === page.mainFrame(),
        timeout: quietMs,
      })
      .then(() => true)
      .catch(() => false);
    if (!navigated) return;
    await page.waitForLoadState("load").catch(() => {});
  }
}

test.describe("Lead List", () => {
  skipIfDisabled("leadList");

  // Edit Lead and Lead Activity open the first lead in the list and expect the
  // fresh lead that Create Lead just made (e.g. no personal details yet). Keep
  // these three in order on one worker; every other test runs fully parallel.
  test.describe(() => {
    test.describe.configure({ mode: "serial" });

    test("Create Lead", async () => {
      skipTestIfDisabled("leadList", "createLead");
      if (createNewLeadEnabled) {
        await openLeadList();
        await createNewLead.createNewlead();
      }
    });

    test("Edit Lead", async () => {
      skipTestIfDisabled("leadList", "editLead");
      const anyEditLeadEnabled =
        editLeadDetailsEnabled ||
        leadAssignToStaffEnabled ||
        leadCurrentStatusEnabled ||
        createPersonalDetailsEnabled ||
        editPersonalDetailsEnabled ||
        addSiteVisitEnabled;

      if (!anyEditLeadEnabled) return;

      await openLeadList();

      if (editLeadDetailsEnabled) {
        await leadeDetails.editLeadDetails();
      } else {
        const { navigateLeadID } = webElement.pageElement(page);
        await navigateLeadID.nth(0).click();
      }

      if (leadAssignToStaffEnabled) {
        await leadeDetails.leadAasignToStaff();
      }
      if (leadCurrentStatusEnabled) {
        await leadeDetails.leadCurrentStatus();
      }
      if (createPersonalDetailsEnabled) {
        await leadeDetails.createPersonalDetails();
      }
      if (editPersonalDetailsEnabled) {
        await leadeDetails.editPersonalDetails();
      }
      if (addSiteVisitEnabled) {
        await leadeDetails.addSiteVisit();
      }
      if (linkedContactEnabled) {
        await leadeDetails.linkedContact();
      }
    });

    test("Lead Activity", async () => {
      // 7 activity flows (~30 sub-scenarios) need more than the 180s global default
      test.setTimeout(480000);
      skipTestIfDisabled("leadList", "leadActivites");
      const anyActivityEnabled =
        notePageDetailsEnabled ||
        tellCallDetailsEnabled ||
        videoCallDetailsEnabled ||
        mailDetailsEnabled ||
        messageDetailsEnabled ||
        directMessageDetailsEnabled ||
        addInterestedStockEnabled;

      if (!anyActivityEnabled) return;

      await openLeadList();

      if (notePageDetailsEnabled) {
        await leadActivites.notePageDetails();
      } else {
        const { navigateLeadID } = webElement.pageElement(page);
        await navigateLeadID.nth(0).click();
      }

      if (tellCallDetailsEnabled) {
        await leadActivites.tellCallDetails();
      }
      if (videoCallDetailsEnabled) {
        await leadActivites.videoCallDetails();
      }
      if (mailDetailsEnabled) {
        await leadActivites.mailDetails();
      }
      if (messageDetailsEnabled) {
        await leadActivites.messageDetails();
      }
      if (directMessageDetailsEnabled) {
        await leadActivites.directMessageDetails();
      }
      if (addInterestedStockEnabled) {
        await leadActivites.addInterstedStock();
      }
    });
  });

  test("createContact", async () => {
    test.setTimeout(300000);
    skipTestIfDisabled("contact", "createContact");
    if (createContactEnabled) {
      await openLeadList();
      await createContact.createContact();
    }
  });
  test("pipelinePage", async () => {
    test.setTimeout(300000);
    skipTestIfDisabled("leadList", "pipelinePage");
    if (pipelinePageDetailsEnabled) {
      await openLeadList();
      await pipeLinePage.pipelinePageDetails();
    }
  });

  test("Unverified Lead", async () => {
    test.setTimeout(300000);
        skipTestIfDisabled("leadList", "Unverified Lead");

    if (unverifiedLeadEnabled) {
      await openLeadList();
      await unverifiedLeadPage.processUnverifiedLeads();
    }
  });

  test("Spam Lead", async () => {
    test.setTimeout(300000);
            skipTestIfDisabled("leadList", "Spam Lead");

    if (spamLeadEnabled) {
      await openLeadList();
      await spamLeadPage.processSpamLeads();
    }
  });

  test("Contact List", async () => {
    test.setTimeout(300000);
                skipTestIfDisabled("leadList", "Contact List");

    if (contactListEnabled) {
      await openLeadList();
      await contactListPage.processContactList();
    }
  });

  test("Call Manager and History", async () => {
    test.setTimeout(300000);
    skipTestIfDisabled("leadList", "Call Manager and History");
    if (callManagerEnabled) {
      await openLeadList();
      await callManagerPage.processCallManagerSection();
    }
  });

  test("Source Report", async () => {
    test.setTimeout(1800000);
    skipTestIfDisabled("leadList", "sourceReport");
    if (sourceReportEnabled) {
      await openLeadList();
      const results = await sourceReportPage.sourceReport();
      const failed = results.filter((r) => !r.passed);
      expect(
        failed.length,
        `Source Report had ${failed.length} failed validations:\n` +
          failed.map((r) => `  - ${r.message}`).join("\n"),
      ).toBe(0);
      expect(results.length).toBeGreaterThan(0);
    }
  });

  test("Pipeline Funnel Report", async () => {
    // 83 scenarios take ~310s even with 3 parallel tabs
    test.setTimeout(600000);
    skipTestIfDisabled("leadList", "pipelineFunnel");
    if (pipelineFunnelReportEnabled) {
      await openLeadList();
      const results = await pipelineFunnelPage.pipelineFunnel();
      const failed = results.filter((r) => !r.passed);
      expect(
        failed.length,
        `Pipeline Funnel had ${failed.length} failed validations:\n` +
          failed.map((r) => `  - ${r.scenario} [${r.manager}]: ${r.message}`).join("\n"),
      ).toBe(0);
      expect(results.length).toBeGreaterThan(0);
    }
  });

  test("Teams Report", async () => {
    test.setTimeout(TEAMS_REPORT_TIMEOUT_MS);
    skipTestIfDisabled("leadList", "teamsReport");
    if (teamsReportEnabled) {
      await openLeadList();
      const results = await teamsReportPage.teamsReport();
      const failed = results.filter((r) => !r.passed);
      expect(failed.length, `Teams Report had ${failed.length} failed validations`).toBe(0);
      expect(results.length).toBeGreaterThan(0);
    }
  });
   test("Trend Report", async () => {
    test.setTimeout(600000);
    skipTestIfDisabled("leadList", "trendReport");
    if (trendReportEnabled) {
      await openLeadList();
      const results = await trendReportPage.trendReport();
      const failed = results.filter((r) => !r.passed);
      expect(
        failed.length,
        `Trend Report had ${failed.length} failed validations:\n` +
          failed.map((r) => `  - ${r.message}`).join("\n"),
      ).toBe(0);
      expect(results.length).toBeGreaterThan(0);
    }
  });


  test("Status Report", async () => {
    test.setTimeout(600000);
    skipTestIfDisabled("leadList", "statusReport");
    if (statusReportEnabled) {
      await openLeadList();
      const results = await statusReportPage.statusReport();
      const failed = results.filter((r) => !r.passed);
      expect(
        failed.length,
        `Status Report had ${failed.length} failed validations:\n` +
          failed.map((r) => `  - ${r.message}`).join("\n"),
      ).toBe(0);
      expect(results.length).toBeGreaterThan(0);
    }
  });

 
  /*********************** Lead CSV Upload Scenarios ***********************/
  test("Upload CSV - Single Valid Lead", async () => {
    test.setTimeout(300000);
    skipIfDisabled("leadCsvUpload");
    if (uploadSingleValidLeadEnabled) {
      await openLeadList();
      await leadCSVUploadPage.uploadSingleValidLead(url);
    }
  });

  test("Upload CSV - Multiple Valid Leads", async () => {
    test.setTimeout(300000);
    skipIfDisabled("leadCsvUpload");
    if (uploadMultipleValidLeadsEnabled) {
      await openLeadList();
      await leadCSVUploadPage.uploadMultipleValidLeads(url, 3);
    }
  });

  test("Upload CSV - Sequential Batches", async () => {
    test.setTimeout(300000);
    skipIfDisabled("leadCsvUpload");
    if (uploadSequentialBatchesEnabled) {
      await openLeadList();
      await leadCSVUploadPage.uploadSequentialBatches(url);
    }
  });

  test("Upload CSV - Checkbox Toggles", async () => {
    test.setTimeout(300000);
    skipIfDisabled("leadCsvUpload");
    if (uploadCheckboxTogglesEnabled) {
      await openLeadList();
      // Uploads 1 CSV file with "Do you want to add these Leads to CRM?" checkbox checked
      await leadCSVUploadPage.uploadWithCheckbox(url, true);
    }
  });

  test("Upload CSV - Negative Scenarios", async () => {
    test.setTimeout(300000);
    skipIfDisabled("leadCsvUpload");
    if (uploadNegativeScenariosEnabled) {
      await openLeadList();
      // Uploads 1 CSV file with duplicate records in the file to test CRM duplicate error handling
      await leadCSVUploadPage.uploadDuplicateWithinSameFile();
    }
  });
});
