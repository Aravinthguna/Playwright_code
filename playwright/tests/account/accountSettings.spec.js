const { test, expect } = require("../../utils/authFixture");
const {
  skipIfDisabled,
  skipTestIfDisabled,
} = require("../../utils/moduleGuard");
const { CURRENT_ENV } = require("../../config/env.config");
const {
  CompanySettingsPage,
} = require("../../modules/acountSettings/pages/CompanySettingsPage");
const {
  KycDetailsPage,
} = require("../../modules/acountSettings/pages/KycDetailsPage");
const {
  SeoDetailsPage,
} = require("../../modules/acountSettings/pages/SeoDetailsPage");
const {
  StaffManagementPage,
} = require("../../modules/acountSettings/pages/StaffManagementPage");
const {
  SourceManagementPage,
} = require("../../modules/acountSettings/pages/SourceManagementPage");
const {
  LeadSettingsPage,
} = require("../../modules/acountSettings/pages/LeadSettingsPage");
const {
  PipelineManagementPage,
} = require("../../modules/acountSettings/pages/PipelineManagementPage");

let page;
let companySettingsPage;
let kycDetailsPage;
let seoDetailsPage;
let staffManagementPage;
let sourceManagementPage;
let leadSettingsPage;
let pipelineManagementPage;
let currentStaff;
let currentTeam;
let currentPipelineCard;
let currentPipelineName;

test.beforeEach(async ({ authPage }) => {
  if (page === authPage) return;
  page = authPage;
  companySettingsPage = new CompanySettingsPage(page, expect);
  kycDetailsPage = new KycDetailsPage(page, expect);
  seoDetailsPage = new SeoDetailsPage(page, expect);
  staffManagementPage = new StaffManagementPage(page, expect);
  sourceManagementPage = new SourceManagementPage(page, expect);
  leadSettingsPage = new LeadSettingsPage(page, expect);
  pipelineManagementPage = new PipelineManagementPage(page, expect);
});

test.describe("ACCOUNT SETTINGS", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async () => {
    test.setTimeout(180000);
  });

  skipIfDisabled("accountSettings");

  test("Company Settings", async () => {
    skipTestIfDisabled("accountSettings", "companySettings");
    await companySettingsPage.goto(CURRENT_ENV.accountSettingsUrl);
    await companySettingsPage.companySettings();
  });

  test("KYC Details", async () => {
    skipTestIfDisabled("accountSettings", "kycDetails");
    await kycDetailsPage.goto(CURRENT_ENV.accountSettingsUrl);
    await kycDetailsPage.kycDetails();
  });

  test("SEO Details", async () => {
    skipTestIfDisabled("accountSettings", "seoDetails");
    await seoDetailsPage.goto(CURRENT_ENV.accountSettingsUrl);
    await seoDetailsPage.seoDetails();
  });

  test.describe("STAFF MANAGEMENT", () => {
    test("Scenario 1: Add Staff Member", async () => {
      skipTestIfDisabled("accountSettings", "addStaff");
      await staffManagementPage.goto(CURRENT_ENV.accountSettingsUrl);
      currentStaff = await staffManagementPage.addStaffMember();
    });

    test("Scenario 2: Edit Staff", async () => {
      skipTestIfDisabled("accountSettings", "editStaff");
      currentStaff = await staffManagementPage.editStaffMember(currentStaff);
    });

    test("Scenario 3: Delete Staff", async () => {
      skipTestIfDisabled("accountSettings", "deleteStaff");
      await staffManagementPage.deleteStaffMember(currentStaff);
    });
  });

  test("Source Management", async () => {
    skipTestIfDisabled("accountSettings", "sourceManagement");
    await sourceManagementPage.goto(CURRENT_ENV.accountSettingsUrl);
    await sourceManagementPage.sourceManagement();
  });

  test.describe("LEAD SETTINGS AND TEAM MANAGEMENT", () => {
    test("Scenario 1: Lead Settings & Create Team", async () => {
      skipTestIfDisabled("accountSettings", "createTeam");
      await leadSettingsPage.goto(CURRENT_ENV.accountSettingsUrl);
      currentTeam = await leadSettingsPage.createTeam();
    });

    test("Scenario 2: Edit Team", async () => {
      skipTestIfDisabled("accountSettings", "editTeam");
      currentTeam = await leadSettingsPage.editTeam(currentTeam);
    });

    test("Scenario 3: Delete Team", async () => {
      skipTestIfDisabled("accountSettings", "deleteTeam");
      await leadSettingsPage.deleteTeam(currentTeam);
    });
  });

  test.describe("PIPELINE MANAGEMENT", () => {
    test("Pipeline Management Full End-to-End Workflow", async () => {
      skipTestIfDisabled("accountSettings", "pipelineManagement");
      await pipelineManagementPage.goto(CURRENT_ENV.accountSettingsUrl);
      await pipelineManagementPage.pipelineManagement();
    });
  });
});
