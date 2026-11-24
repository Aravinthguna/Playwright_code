class WebElement {
  pageElement(page) {
    /***********  LOGIN Page Elememts  ************/

    const phoneNumberField = page.locator("#phone");
    const passwordField = page.locator("#password");
    const signButton = page.locator('//button[@type="submit"]');
    const invalidErrorMsg = page.locator(
      "//div[@class='rounded-md bg-red-50 p-2 text-sm font-medium text-red-600 text-center']",
    );
    const blankErrorMsg = page.locator(
      "//[@class='text-xs text-red-600 pr-3']",
    );
    const forgotPinLink = page.locator(
      "//a[normalize-space()='Forgot Pass Pin']",
    );
    const profileButton = page.locator('//a[@class="pl-2"]');
    const signOutButton = page.locator(
      "//button[normalize-space()='Sign Out']",
    );

    /************************************ DASHBOARD ******************************** */
    const accountverified = page.locator(
      '//span[normalize-space()="(BUILDER)"]',
    );
    const CheckUser = page.locator(
      '//div[contains(@class,"relative flex items-center h-8 py-1 ")]',
    );
    const totalLeadsCount = page.locator(
      '(//div[contains(@class,"w-full h-full p-4 text-left relative")])[1]',
    );

    /*************Lead Page **************** */

    const navigateLeadsButton = page.locator(
      '//div[@class="static bottom-0 flex-col pt-3 sm:flex"]//a[@href="/leads"]',
    );
    const unverifiedLead = page.locator(
      "(//div[normalize-space()='Unverified'])[1]",
    );
    const unverifiedLeadList = page.locator(
      '(//tr[contains(@class,"hover:bg-gray-50/70 border-b border-gray-200")])[1]',
    );
    const verifiedThreeDotButton = page.locator(
      '(//td[contains(@class,"whitespace-nowrap pr-14 pl-2 py-2.5")])[1]',
    );
    const unverifiedThreeDotButton = page.locator(
      '(//td[contains(@class,"whitespace-nowrap pr-14 pl-2 py-2.5")])[1]',
    );
    const moveToSpamList = page
      .locator(
        '//*[self::button or self::div or self::a or self::li][normalize-space()="Move to Spam List" or contains(text(),"Move to Spam")]',
      )
      .first();
    const moveToVerifiedList = page
      .locator(
        '//*[self::button or self::div or self::a or self::li][normalize-space()="Move to Verified List" or contains(text(),"Move to Verified")]',
      )
      .first();
    const SpamList = page.locator("(//div[normalize-space()='Spam'])[1]");
    const moveToUnVerifiedList = page
      .locator(
        '//*[self::button or self::div or self::a or self::li][normalize-space()="Move to Unverified List" or contains(text(),"Move to Unverified")]',
      )
      .first();
    const contactList = page.locator(
      "(//div[normalize-space()='Contact list'])[1]",
    );
    const contactListScroll = page.locator(
      '//tbody[@class="divide-y divide-slate-100"]',
    );
    const callMAnager = page.locator(
      "(//div[normalize-space()='Call Manager'])[1]",
    );
    const todayList = page.locator("(//div[normalize-space()='Today'])[1]");
    const missedcall = page.locator("//button[normalize-space()='Missed']");
    const callHistory = page.locator("//div[normalize-space()='Call History']");
    const reports = page.locator("(//div[normalize-space()='Reports'])[1]");
    const sourceReport = page.locator(
      "//div[normalize-space()='Source Reports']",
    );
    const advanceFilter = page.locator(
      '//button[contains(., "Advanced Filters")] | //button[contains(@class,"flex items-center gap-2 border")]',
    );
    const reportingPeriod = page.locator(
      '(//select[contains(@class,"w-full pl-3 pr-8 py-2 border")])[1]',
    );
    const numberofDays = page.locator('//input[@type="number"]');
    const modifiedAt = page.locator(
      '(//select[contains(@class,"w-full pl-3 pr-8 py-2 border")])[2]',
    );
    const siteVisitSchedule = page.locator(
      '(//select[contains(@class,"w-full pl-3 pr-8 py-2 border")])[3]',
    );
    const bookingDate = page.locator(
      '(//select[contains(@class,"w-full pl-3 pr-8 py-2 border")])[4]',
    );
    const addAllTagCheckbox = page.locator(
      '(//button[contains(@class,"flex items-center gap-2")])[2]',
    );
    const clickTagfiltercheckbox = page.locator(
      '(//button[contains(@class,"flex items-center gap-2")])[3]',
    );
    const allSource = page.locator("//button[normalize-space()='All Sources']");
    const FilterSearchButton = page.locator(
      "//button[normalize-space()='Search']",
    );
    const chatView = page.locator("//button[normalize-space()='Chart View']");
    const leadCountClick = page.locator(
      '(//button[contains(@class,"font-semibold text-indigo-600")])[1]',
    );
    const inProgressCountClick = page.locator(
      '(//button[contains(@class,"font-semibold text-indigo-600")])[2]',
    );
    const pipelineFunnel = page.locator(
      "//div[normalize-space()='Pipeline Funnel']",
    );
    const totalLeads = page.locator(
      '(//button[contains(@class,"font-semibold hover:underline")])[1]',
    );
    const PipelineFilter = page.locator(
      '//label[contains(translate(normalize-space(), "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "PIPELINE")]/..//select | (//select[contains(@class,"w-full pl-3 pr-8 py-2 border")])[5]',
    );
    const createdbyLeadOwner = page.locator(
      '//label[contains(translate(normalize-space(), "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "CREATED BY")]/..//select | (//select[contains(@class,"w-full pl-3 pr-8 py-2 border")])[6]',
    );
    const pipelineFunnelHeading = page.locator(
      '//h1[normalize-space()="Pipeline Funnel"] | //h2[normalize-space()="Pipeline Funnel"] | //*[contains(text(), "Pipeline funnel overview")]',
    );
    const teamReport = page.locator("//div[normalize-space()='Team Reports']");
    const teamReportHeading = page.locator(
      '//h1[normalize-space()="Teams Reports"] | //h2[normalize-space()="Teams Reports"]',
    );
    const leadCount = page.locator(
      '(//button[contains(@class,"font-semibold hover:underline")])[1]',
    );
    const trendReportHeading = page.locator(
      '//h1[normalize-space()="Trend Reports"] | //h2[normalize-space()="Trend Reports"] | //*[contains(text(), "Trend Reports")] | //*[contains(text(), "Lead Trends")]',
    );
    const trendReport = page.locator(
      "//div[normalize-space()='Trend Reports']",
    );
    const dailyTrends = page.locator(
      "//button[normalize-space()='Daily Trends'] | //button[normalize-space()='Daily']",
    );
    const weeklyTrends = page.locator(
      "//button[normalize-space()='Weekly Trends'] | //button[normalize-space()='Weekly']",
    );
    const monthyTrends = page.locator(
      "//button[normalize-space()='Monthly Trends'] | //button[normalize-space()='Monthly']",
    );
    const quarterlyTrends = page.locator(
      "//button[normalize-space()='Quarterly Trends'] | //button[normalize-space()='Quarterly']",
    );
    const yeralyTrends = page.locator(
      "//button[normalize-space()='Yearly Trends'] | //button[normalize-space()='Yearly']",
    );
    const statusReport = page.locator(
      "//div[normalize-space()='Status Reports']",
    );
    const dailyStatus = page.locator("//button[normalize-space()='Daily']");
    const weeklyStatus = page.locator("//button[normalize-space()='Weekly']");
    const monthyStatus = page.locator("//button[normalize-space()='Monthly']");
    const quarterlyStatus = page.locator(
      "//button[normalize-space()='Quarterly']",
    );
    const yeralyStatus = page.locator("//button[normalize-space()='Yearly']");
    const statusReportHeading = page.locator(
      '//h1[normalize-space()="Status Reports"] | //h2[normalize-space()="Status Reports"] | //*[contains(text(), "Lead Count by Status")] | //*[contains(text(), "Total Leads Over Time")]',
    );
    const totalCount = page.locator(
      '//td[contains(@class,"px-4 py-3 text-center font-bold")]//button',
    );
    const noLeadFound = page.locator(
      '//h3[@class="mt-2 text-sm font-semibold text-gray-900"]',
    );
    const noDataFound = page.locator(
      '//p[@class="text-gray-700 text-sm font-medium"]',
    );
    const clcikCloseButton = page.locator(
      '//button[contains(@class,"w-8 h-8 flex items-center justify-center")]',
    );
    const filterResetButton = page.locator(
      "//button[normalize-space()='Reset']",
    );

    /***********************************************PIPELINE FUNEL **************************** */
    // const pipline=page.locator('(//div[@class="relative"])[6]');
    // const createdbyLeadOwner=page.locator('(//div[@class="relative"])[6]');

    /***********  Source Report Elements  ************/
    const sourceReportHeading = page.locator(
      '//h1[normalize-space()="Source Report"] | //*[contains(text(), "Lead vs Source")]',
    );
    // Chart View
    const chartViewBtn = page.locator(
      "//button[normalize-space()='Chart View']",
    );
    const distributionHeading = page.locator(
      '//h3[normalize-space()="Lead Source Distribution"] | //*[contains(text(), "Lead Source Distribution")]',
    );
    const chartTotalLeadsHeading = page
      .getByText("Total Leads", { exact: false })
      .first();
    const listViewBtn = page.locator("//button[normalize-space()='List View']");
    const countEl = page
      .locator('svg text[y="192"], svg text[font-size="22"]')
      .first();
    const breakdownH3 = page.locator(
      '//h3[normalize-space()="Source Breakdown"] | //*[contains(text(), "Source Breakdown")]',
    );

    // Filter Sections & Field Elements
    const reportingPeriodSection = page.locator(
      '//label[translate(normalize-space(), "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ")="REPORTING PERIOD"]/..',
    );
    const reportingPeriodSelect = reportingPeriodSection
      .locator("select")
      .first();
    const reportingPeriodDaysInput = reportingPeriodSection
      .locator('input[type="number"]')
      .first();
    const reportingPeriodFromInput = reportingPeriodSection
      .locator('input[type="datetime-local"]')
      .first();
    const reportingPeriodToInput = reportingPeriodSection
      .locator('input[type="datetime-local"]')
      .nth(1);

    const modifiedAtSection = page.locator(
      '//label[translate(normalize-space(), "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ")="MODIFIED AT"]/..',
    );
    const modifiedAtSelect = modifiedAtSection.locator("select").first();
    const modifiedAtDaysInput = modifiedAtSection
      .locator('input[type="number"]')
      .first();
    const modifiedAtFromInput = modifiedAtSection
      .locator('input[type="datetime-local"]')
      .first();
    const modifiedAtToInput = modifiedAtSection
      .locator('input[type="datetime-local"]')
      .nth(1);

    const siteVisitSection = page.locator(
      '//label[contains(translate(normalize-space(), "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "SITE VISIT")]/..',
    );
    const siteVisitSelect = siteVisitSection.locator("select").first();
    const siteVisitDaysInput = siteVisitSection
      .locator('input[type="number"]')
      .first();
    const siteVisitFromInput = siteVisitSection
      .locator('input[type="datetime-local"]')
      .first();
    const siteVisitToInput = siteVisitSection
      .locator('input[type="datetime-local"]')
      .nth(1);

    const bookingDateSection = page.locator(
      '//label[contains(translate(normalize-space(), "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "BOOKING DATE")]/..',
    );
    const bookingDateSelect = bookingDateSection.locator("select").first();
    const bookingDateDaysInput = bookingDateSection
      .locator('input[type="number"]')
      .first();
    const bookingDateFromInput = bookingDateSection
      .locator('input[type="datetime-local"]')
      .first();
    const bookingDateToInput = bookingDateSection
      .locator('input[type="datetime-local"]')
      .nth(1);

    const tagsSection = page.locator(
      '//label[translate(normalize-space(), "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ")="TAGS"]/..',
    );
    const allTagsBtn = tagsSection
      .locator('button:has-text("All Tags")')
      .first();

    const sourceSection = page.locator(
      '//label[translate(normalize-space(), "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ")="SOURCE"]/..',
    );
    const allSourcesBtn = sourceSection
      .locator('button:has-text("All Sources")')
      .first();

    const teamFilterSection = page.locator(
      '//label[contains(translate(normalize-space(), "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "TEAM")]/..',
    );
    const teamFilter = teamFilterSection.locator("select").first();

    // Table, Spinner & Empty-State Elements
    const spinner = page.locator(
      '.animate-spin, [class*="loading"], [class*="spinner"]',
    );
    const noDataLocator = page
      .getByText("No data found for the selected filters")
      .or(page.locator('//p[contains(text(), "No data found")]'));
    const table = page.locator("table tbody tr");
    const reportTableRows = page.locator("table tbody tr");
    const reportSourceName = page.locator(
      "table tbody tr td:first-child .text-dark-200, table tbody tr td:first-child span",
    );
    const reportCountButton = page.locator("td:nth-child(2) button");

    // Popup & Drawer Elements
    const popupContainer = page
      .locator(
        'div[role="dialog"], [class*="drawer"], [class*="modal"], [class*="drawer-content"], .fixed.inset-0:has([class*="overflow"], table, button)',
      )
      .first();
    const dialog = popupContainer;
    const modal = popupContainer;
    const allLeadsLoadedEl = page
      .getByText("All leads loaded", { exact: false })
      .first();
    const popupLeadRows = page.locator(
      '.fixed.inset-0 table tbody tr, div[role="dialog"] table tbody tr',
    );
    const popupRows = popupContainer.locator(
      "table tbody tr, [class*='lead-row'], [class*='lead-item']",
    );
    const rows = popupRows;
    const items = popupContainer.locator(
      '[class*="lead-row"], [class*="lead-item"], [class*="card"]',
    );
    const noLeads = popupContainer.locator(
      "text=/[Nn]o\\s+(leads?|data|records?)/",
    );
    const popupTotalText = page.locator(
      '.fixed.inset-0 [class*="total"], .fixed.inset-0 [class*="count"], div[role="dialog"] [class*="total"]',
    );
    const totalPatterns = [
      popupContainer.locator("text=/Total[:\\s-]+\\d+/i"),
      popupContainer.locator("text=/\\d+\\s+[Ll]eads?/"),
      popupContainer.locator("text=/of\\s+\\d+/"),
      popupContainer.locator(
        '[class*="badge"], [class*="count"], [class*="total"]',
      ),
    ];
    const popupNextPageButton = page.locator(
      '.fixed.inset-0 button:has-text("Next"), div[role="dialog"] button:has-text("Next")',
    );
    const nextSelectors = [
      popupContainer.locator('button:has-text("Next")'),
      popupContainer.locator('button:has-text("›")'),
      popupContainer.locator('button:has-text("»")'),
      popupContainer.locator('[aria-label="Next page"], [aria-label="next"]'),
      popupContainer.locator('button[class*="next"]'),
      popupContainer.locator('a:has-text("Next")'),
    ];
    const popupPrevPageButton = page.locator(
      '.fixed.inset-0 button:has-text("Previous"), div[role="dialog"] button:has-text("Previous")',
    );
    const popupCloseButton = page.locator(
      '.fixed.inset-0 button[aria-label="Close"], div[role="dialog"] button[aria-label="Close"]',
    );
    const fallbackSelectors = [
      page
        .locator(
          '//button[contains(@class,"w-8 h-8 flex items-center justify-center")]',
        )
        .first(),
      page.locator('button[aria-label="Close"]').first(),
      page.locator('[class*="close"]').first(),
    ];
    const popupNoLeadsMessage = page.locator(
      '.fixed.inset-0 h3, div[role="dialog"] h3',
    );

    /***********  CREATE NEW LEADS Elements   ************/
    const createNewlead = page.locator(
      '//div[contains(@class,"false rounded-md text-indigo-900 px-2")]',
    );
    const ledaSourceField = page.locator(
      '//p[normalize-space()="Select an item"]',
    );
    const selectItemField = page.locator(
      '//div[@class="w-full absolute bg-white border shadow z-30 h-48 overflow-y-auto"]',
    );
    const subSourceField = page.locator(
      '//div[@class="sm:col-span-3 mt-2 md:mt-0"]//input',
    );
    const firstNameField = page.locator("#firstName");
    const lastNameField = page.locator("#lastName");
    const emailAddressField = page.locator("#email");
    const mobilNumberField = page.locator("#mobileNumber");
    const enquiryDatePicker = page.locator("#enquiryDate");
    const textArea = page.locator("#contactFormMessage");
    const newLeadSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    const leadVerification = page.locator(
      '(//div[@class="flex gap-2 mb-2"]//button)',
    );

    /*********** EDIT LEADS Page Elements **************/
    const navigateLeadID = page.locator(
      '//tr[contains(@class,"bg-white hover:bg-gray-50")]',
    );
    const editLeadDetailsField = page.locator(
      '//span[contains(@style,"cursor: pointer; display:")]',
    );
    const editLedaSourceField = page.locator(
      '(//div[@class="w-full relative mt-2"]//div)',
    );
    const editSelectItemField = page.locator(
      '(//div[@class="hover:bg-gray-200 p-1 grid grid-cols-4 false"])',
    );
    const otherSourceField = page.locator(
      '//span[@class="icon-design col-span-1 flex justify-end items-center"]',
    );
    const enterSourceName = page.locator(
      '//input[@placeholder="Enter Valid Source Name"]',
    );
    const saveOtherSourceName = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const editFirstNameField = page.locator('(//div[@class="mt-2"]//input)');
    const editLastNameField = page.locator('(//div[@class="mt-2"]//input)');
    const editEnquiryDatePicker = page.locator('(//input[@type="date"])[2]');
    const clickSaveButton = page.locator('//button[normalize-space()="Save"]');
    /****************************************** Pipeline status ******************************** */
    const pipelineName = page.locator(
      '//h3[@class="text-base font-semibold text-gray-900"]',
    );
    const clickPipelineBucketField = page.locator(
      '//div[contains(@style,"width: 100%; height: 34px;")]',
    );
    const failureBucketdropdown = page.locator("div > span + svg");
    const successBucket = page.locator(
      '//div[contains(@style,"position: relative; flex: 3 0 auto;")]',
    );
    const selectFailureBucket = page.locator(
      '//button[contains(@style,"width: 100%; padding: 9px 12px; text-align: left; font-size:")]',
    );

    const clickMoveNextPipelineButton = page.locator(
      '//div[contains(@style,"margin-left: 20px; ")]',
    );
    const clickBackWardMovementButton = page.locator(
      '//button[contains(@class,"bg-primary text-white hover:bg-primary")]',
    );
    const backwardPipelineName = page.locator(
      '(//div[contains(@class,"bg-gray-50 border-b border-gray-200 ")]//h3)[1]',
    );
    const backwardBucktswitch = page.locator(
      '(//div[contains(@class,"w-full flex items-center cursor-pointer opacity-85")])[1]',
    );
    const backwardReasonTextArea = page
      .locator('//textarea[@style="font-family: inherit;"]')
      .or(page.locator('//textarea[contains(@style,"font-family: inherit")]'));
    const backwardConfirmButton = page.locator(
      '//button[normalize-space()="Confirm"]',
    );

    const leadConverted = page
      .locator('//div[contains(@style,"margin-left: 20px; flex-shrink:")]')
      .or(page.getByText(/lead converted/i));
    const pipelineHistoryfield = page.locator(
      "//button[normalize-space()='PIPELINE HISTORY']",
    );
    const activityTimelineField = page.locator(
      '//select[contains(@style,"appearance: none; background:")]',
    );

    const scrollToBottomOfPipelineHistory = page.locator(
      "//div[@class='ph-hide']",
    );

    /*********************** Booking a Unit ******************** */
    const bookAUnitButton = page.locator(
      "//button[normalize-space()='Booking']",
    );
    const SelectUnitRadioBuuton = page.locator('//input[@type="radio"]');

    const bookingButton = page.locator(
      "//button[normalize-space()='Book a Unit']",
    );
    const SelectUnit = page.locator(
      '//div[contains(@class,"relative p-3 rounded-xl border transition-all")]',
    );
    const book1Unit = page.locator(
      '//button[contains(@class,"inline-flex items-center justify-center gap-2")]',
    );

    const bookingAmountButton = page.locator(
      ".booking-modal-enter input[type='text']",
    );
    const paymentdate = page.locator(".booking-modal-enter input[type='date']");
    const confirmBookingButton = page.locator(
      "//button[normalize-space()='Confirm Booking']",
    );

    /***********************Add Site Visit ******************** */
    const addSiteVistButton = page.locator(
      "//button[normalize-space()='Add Site Visit']",
    );
    const pipelineDropDownButton = page.locator(
      '//button[contains(@style,"display: flex; align-items: center;")]',
    );
    const SwitchPipelineDropDown = page.locator(
      '//button[contains(@style,"width: 100%; text-align: left;")]',
    );
    const siteVisitDate = page.locator('//input[@id="add-site-visit-date"]');
    const siteVisitTime = page.locator('//input[@id="add-site-visit-time"]');
    const visitType = page.locator("#add-site-visit-type");
    const SelectVisitType = page.locator("#add-site-visit-type option");
    const status = page.locator("#add-site-visit-status");
    const selectStatus = page.locator("#add-site-visit-status option");
    const siteVistNote = page.locator(
      '//textarea[contains(@class,"w-full rounded-md border px-3 py-2")]',
    );
    const SitevisitsaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    const enableRemnder = page.locator('//input[@type="checkbox"]');
    const reminderDate = page.locator(
      "(//input[contains(@class,'w-full rounded-md border px-3 py-2')])[3]",
    );
    const remindertime = page.locator(
      '//input[@id="add-site-visit-reminder-time"]',
    );
    const siteVisitEditButton = page.locator(
      "//button[contains(@class,'flex-shrink-0 text-xs text-white') or (contains(@class,'text-xs') and contains(.,'Edit'))]",
    );
    const clickSiteVisitScheduleButton = page.locator(
      '//button[contains(@class,"flex items-center gap-2") and not(normalize-space()="Add Site Visit")]',
    );
    const siteVisitDeleteButton = page.locator(
      "//button[contains(@class,'flex-shrink-0 border')]",
    );
    const confirmDeleteBUtton = page.locator(
      '//button[normalize-space()="Delete"]',
    );

    /****************************Linked Contact **********************************/
    const linkContactButton = page.locator(
      '//div[contains(@class,"rounded-md text-indigo-900 px-2")]',
    );
    const FirstName = page.locator("#first-name");
    const LastName = page.locator("#last-name");
    const contactemail = page.locator("#email");
    const phoneNumber = page.locator("#phone");
    const saveContactButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    /************************ Create Contact *************************** */
    const createContactButton = page.locator(
      '//button[normalize-space()="+ New Contact"]',
    );
    /***********Assigned staff ************************ */
    const leadAssignedTo = page.locator('(//div[@class="w-full"]//button)');
    const AssignedStaff = page.locator('(//div[@class="py-1"]//a)');

    /***********  Lead Current Status page Elements ******/
    const clickLeadCurrenStatusField = page.locator(
      '//button[contains(@class,"w-full flex disabled:")]',
    );
    const selectLeadCurrentStatusField = page.locator(
      '(//div[@class="py-1"]//a)',
    );

    /************ Personal Details Page Elements **********/
    const createPersonalDetails = page.locator(
      '//div[@class="flex justify-center"]//button',
    );
    const numberOfFamilyMembers = page.locator(
      '(//div[@class="relative inline-block text-left w-full"])',
    );
    const selectNumberOfFamilyMembers = page.locator(
      '(//div[@class="py-1 hover:overflow-scroll"]//div)',
    );
    const currentResident = page.locator(
      '(//div[@class="relative inline-block text-left w-full"])',
    );
    const selectcurrentResident = page.locator(
      '(//div[@class=" py-1 hover:overflow-scroll "]//div)',
    );
    const residentialAddressTextArea = page.locator(
      '//input[@placeholder="Search Address (please enter more than 3 characters)"]',
    );
    const selectResidentialAddress = page.locator(
      '(//div[@role="option"]//span)',
    );
    const addEduWorkspaceAddress = page.locator(
      '//div[@class="col-span-3"]//button',
    );
    const addAdressTextArea = page.locator(
      'input[placeholder*="Search Address"]',
    );
    const selectAddress = page.locator('(//div[@role="option"]//span)');
    const saveButton = page.locator('//button[normalize-space()="Save"]');
    //  /*********** Edit Personal Details****************** */
    const editDetails = page.locator(
      "div.flex.justify-between.items-center > svg",
    );
    const editFamilyMembers = page.locator(
      '(//div[@class="relative inline-block text-left w-full"])',
    );
    const selectFamilyMembers = page.locator(
      '(//div[@class="py-1 hover:overflow-scroll"]//div)',
    );
    const editCurrentResident = page.locator(
      '(//div[@class="relative inline-block text-left w-full"])',
    );
    const chooseurrentResident = page.locator(
      '(//div[@class=" py-1 hover:overflow-scroll "]//div)',
    );
    const editresidentialAddressTextArea = page
      .locator('input[placeholder*="Search Address"]')
      .first();
    const editResidentialAddress = page.locator(
      '(//div[@role="option"]//span)',
    );
    const editresidentialAddressTextArea1 = page
      .locator('input[placeholder*="Search Address"]')
      .last();
    const editResidentialAddress1 = page.locator(
      '(//div[@role="option"]//span)',
    );
    const editsaveButton = page.locator('//button[normalize-space()="Save"]');

    /***********  NOTE Page Elements ********************/
    const leadBackButon = page.locator(
      '//button[contains (@class," items-center rounded border borde")]',
    );
    const clickNoteField = page.locator(
      ' (//div[@class="flex items-center gap-8 px-4 py-2 overflow-x-auto md:gap-10"])//div',
    );
    const textAreaField = page
      .locator('textarea[placeholder="Enter activity details"]')
      .or(page.locator('//div[contains(@class,"relative")]//textarea'))
      .first();
    const clickReminder = page.locator(
      '//label[contains(@class,"border border-gray-300 hover:")]',
    );
    const datepickerField = page.locator(
      '//div[@class="react-datepicker__input-container"]//input',
    );
    const reminderSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    const activityVisibilityButton = page.locator(
      '//div[@class="hidden w-full border border-gray-300 rounded-lg md:block md:col-span-2"]',
    );
    const selectActivity = page.locator('(//div[@class="flex gap-5"]//input)');
    const submitActivityButton = page.locator(
      '(//button[normalize-space()="Submit"])[2]',
    );
    const noteSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const time = page.locator('//div[@class="react-datepicker__time-box"]');
    /************ Telecalling Page Elements   ***********/
    const clickTelecallField = page.locator(
      ' (//div[@class="flex items-center gap-8 px-4 py-2 overflow-x-auto md:gap-10"]//div)',
    );
    const telecallTextArea = page
      .locator('textarea[placeholder="Enter activity details"]')
      .or(page.locator('//div[contains(@class,"relative")]//textarea'))
      .first();
    const edittelecallDatepicker = page.locator('//input[@type="date"]');
    const telecallTypeDropDown = page.locator(
      '(//div[@class="relative inline-block text-left"]//button)',
    );
    const telecallSubType = page.locator('(//div[@role="none"]//div)');
    const mobileTypes = page.locator(
      '(//div[@class="relative inline-block text-left"]//button)',
    );
    const mobileSubTypes = page.locator('(//div[@role="none"]//div)');
    const activityVisibility = page.locator(
      '//div[@class="hidden w-full border border-gray-300 rounded-lg md:block md:col-span-2"]',
    );
    const selectActivitysub = page.locator(
      '(//div[@class="flex gap-5"]//input)',
    );
    const submitActivity = page.locator(
      '(//button[normalize-space()="Submit"])[2]',
    );
    const telecallReminderButton = page.locator(
      '//label[contains(@class,"border border-gray-300 hover:")]',
    );
    const telecallDataPickerField = page.locator(
      '//div[@class="react-datepicker__input-container"]//input',
    );
    const reminderDateSubmitButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    const telecallSaveButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );

    const incomingOutgoingDropdown = page.locator(
      'button:has-text("Incoming"):visible, button:has-text("Outgoing"):visible',
    );
    const phoneWhatsappOthersDropdown = page.locator(
      'button:has-text("Phone"):visible, button:has-text("Whatsapp"):visible, button:has-text("Gmeet"):visible, button:has-text("Zoom"):visible, button:has-text("Others"):visible',
    );
    const incomingOption = page
      .locator('a:has-text("Incoming"):visible')
      .first();
    const outgoingOption = page
      .locator('a:has-text("Outgoing"):visible')
      .first();
    const phoneOption = page.locator('a:has-text("Phone"):visible').first();
    const whatsappOption = page
      .locator('a:has-text("Whatsapp"):visible')
      .first();
    const gmeetOption = page.locator('a:has-text("Gmeet"):visible').first();
    const zoomOption = page.locator('a:has-text("Zoom"):visible').first();
    const othersOption = page.locator('a:has-text("Others"):visible').first();

    // /***********  VIDEO CALL Page Elements    ***********/
    const clickvideocallfield = page.locator(
      ' //div[@class="flex items-center gap-8 px-4 py-2 overflow-x-auto md:gap-10"]//div',
    );
    const videoCalltextArea = page
      .locator('textarea[placeholder="Enter activity details"]')
      .or(page.locator('//div[contains(@class,"relative")]//textarea'))
      .first();
    const editVideocallDatepicker = page.locator('//input[@type="date"]');
    const videocallType = page.locator(
      '(//div[@class="relative inline-block text-left"]//button)',
    );
    const videocallSubType = page.locator('(//div[@role="none"]//div)');
    const videcallMobileType = page.locator(
      '(//div[@class="relative inline-block text-left"]//button)',
    );
    const videocallMobileSubType = page.locator('(//div[@role="none"]//div)');
    const videoActivityVisibility = page.locator(
      '//div[@class="hidden w-full border border-gray-300 rounded-lg md:block md:col-span-2"]',
    );
    const videoActivitySubType = page.locator(
      '(//div[@class="flex gap-5"]//input)',
    );
    const videoActivitySubmitButton = page.locator(
      '(//button[normalize-space()="Submit"])[2]',
    );
    const videoReminder = page.locator(
      '//label[contains(@class,"border border-gray-300 hover:")]',
    );
    const videoReminderdateField = page.locator(
      '//div[@class="react-datepicker__input-container"]//input',
    );
    const reminderDateSubmitbutton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    const videocallSaveButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );

    // /************* MAIL Page Elements  ******************/
    const clickMailField = page.locator(
      ' //div[@class="flex items-center gap-8 px-4 py-2 overflow-x-auto md:gap-10"]//div',
    );
    const mailTextArea = page
      .locator('textarea[placeholder="Enter activity details"]')
      .or(page.locator('//div[contains(@class,"relative")]//textarea'))
      .first();
    const editMailDatepicker = page.locator('//input[@type="date"]');
    const mailType = page.locator(
      '(//div[@class="relative inline-block text-left"]//button)',
    );
    const mailSubType = page.locator('(//div[@role="none"]//div)');
    const mailActivityVisibility = page.locator(
      '//div[@class="hidden w-full border border-gray-300 rounded-lg md:block md:col-span-2"]',
    );
    const mailActivitySubType = page.locator(
      '(//div[@class="flex gap-5"]//input)',
    );
    const mailActivitySubmitButton = page.locator(
      '(//button[normalize-space()="Submit"])[2]',
    );
    const maillReminderButton = page.locator(
      '//label[contains(@class,"border border-gray-300 hover:")]',
    );
    const mailRemindDatePicker = page.locator(
      '//div[@class="react-datepicker__input-container"]//input',
    );
    const maillReminderSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    const mailSaveButton = page.locator('//button[normalize-space()="Submit"]');

    /*********** MESSAGE Page Elements  ****************/
    const clickMessageField = page.locator(
      ' (//div[@class="flex items-center gap-8 px-4 py-2 overflow-x-auto md:gap-10"]//div)',
    );
    const messageTextArea = page
      .locator('textarea[placeholder="Enter activity details"]')
      .or(page.locator('//div[contains(@class,"relative")]//textarea'))
      .first();
    const editMessageDatepicker = page.locator('//input[@type="date"]');
    const messageType = page.locator(
      '(//div[@class="relative inline-block text-left"]//button)',
    );
    const messageSubType = page.locator('(//div[@role="none"]//div)');
    const messageMobileType = page.locator(
      '(//div[@class="relative inline-block text-left"]//button)',
    );
    const messageSubMobileType = page.locator('(//div[@role="none"]//div)');
    const messageActivityVisibility = page.locator(
      '//div[@class="hidden w-full border border-gray-300 rounded-lg md:block md:col-span-2"]',
    );
    const messageActivitySubType = page.locator(
      '(//div[@class="flex gap-5"]//input)',
    );
    const messageActivitySubmitButton = page.locator(
      '(//button[normalize-space()="Submit"])[2]',
    );
    const messageRemindeButton = page.locator(
      '//label[contains(@class,"border border-gray-300 hover:")]',
    );
    const messageReminDate = page.locator(
      '//div[@class="react-datepicker__input-container"]//input',
    );
    const messageSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    const messageReminderSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );

    /***********  DIRECT MEETING Page Elements *********/
    const clickDirectMetting = page.locator(
      ' (//div[@class="flex items-center gap-8 px-4 py-2 overflow-x-auto md:gap-10"]//div)',
    );
    const directTextArea = page
      .locator('textarea[placeholder="Enter activity details"]')
      .or(page.locator('//div[contains(@class,"relative")]//textarea'))
      .first();
    const directActivityVisibility = page
      .locator(
        '//div[@class="hidden w-full border border-gray-300 rounded-lg md:block md:col-span-2"]',
      )
      .or(page.locator('button:has-text("Private"), button:has-text("Public")'))
      .first();
    const directActivitySubType = page.locator(
      '(//div[@class="flex gap-5"]//input)',
    );
    const directActivitySubmitButton = page
      .locator(
        '//div[contains(@id,"headlessui-dialog-panel") or @role="dialog"]//button[normalize-space()="Submit"]',
      )
      .or(page.locator('(//button[normalize-space()="Submit"])[2]'))
      .first();
    const directReminderButton = page
      .locator('//label[contains(@class,"border border-gray-300 hover:")]')
      .or(page.locator('button:has-text("Reminder"), label:has-text("Reminder")'))
      .or(page.getByText("Reminder", { exact: false }))
      .first();
    const directReminDate = page.locator(
      '//div[@class="react-datepicker__input-container"]//input',
    );
    const directReminderSaveButton = page
      .locator('//button[normalize-space()="Save"]')
      .first();
    const directReminderSubmitButton = page
      .locator('//button[normalize-space()="Submit"]')
      .first();
    /************UP Comming Reminder************ */
    const clickUpcommingremainder = page.locator(
      '//div[@class="flex justify-center items-center w-full"]',
    );
    const editUpcommingremainder = page.locator(
      '(//div[@class="md:col-span-1 hidden md:block"]//div)',
    );
    const editUpcomeReminderTextArea = page.locator(
      '(//div[@class="flex col-span-10"]//textarea)',
    );
    const remineActivityVisibility = page.locator('(//div[@class="flex"])');
    const upremineSelectActivity = page.locator(
      '(//div[@class="flex gap-5"]//input)',
    );
    const upremineSubmitButton = page.locator(
      '//div[@class="flex flex-row-reverse gap-3 py-4 px-5 border-t"]//button',
    );
    const upremineSaveButton = page.locator(
      '(//div[@class="flex gap-3 justify-end mt-3"]//button)',
    );
    const closeUpCommingReminder = page.locator(
      '//span[@class="ml-auto mt-1"]',
    );

    /*********** ADD INTERSTED STOCK********************/
    const clickInterstedStock = page
      .locator(
        '//button[normalize-space()="Interested Stock" or normalize-space()="INTERESTED STOCK"]',
      )
      .or(page.getByRole("tab", { name: /interested stock/i }))
      .or(page.locator('button:has-text("Interested Stock")'))
      .first();
    const addInterestStock = page.locator(
      '(//button[normalize-space()="Add Interested Stock"])',
    );
    const addNewInterestStock = page.locator(
      "(//button[normalize-space()='Add new interest'])",
    );
    const interestedStockPopupHeader = page
      .getByText(/add interested stock|select.*unit/i)
      .first();

    const selectInsterestStocks = page.locator(
      '(//div[@class="flex gap-2 items-center "]//input)',
    );
    const addInterstedStockButton = page.locator(
      '//div[@class="flex justify-between items-center"]//button',
    );

    /*********** INTERSTED STOCK FILTER  ***************/
    const clickFilterTag = page.locator(
      '//div[@class="relative border border-primary rounded px-4 py-2 flex gap-2 justify-center items-center cursor-pointer"]',
    );
    const projectNameField = page.locator(
      '(//h1[normalize-space()="Project Name"])',
    );
    const projectNameTextArea = page.locator(
      '//input[@placeholder="Enter project name"]',
    );
    const companyNameField = page.locator(
      '(//h1[normalize-space()="Company Name"])',
    );
    const companyNametextArea = page.locator(
      '//input[@placeholder="Enter Company Name"]  ',
    );
    const projectLocationField = page.locator(
      '(//h1[normalize-space()="Project Location"])',
    );
    const projectLocationTextArea = page.locator(
      '//input[@placeholder="Enter Project Location"]',
    );
    const projectCategoryField = page.locator(
      '(//h1[normalize-space()="Project Types & Category"])',
    );
    const ProjectSaleType = page.locator(
      '(//div[@class="flex justify-center mx-2 cursor-pointer"]//button)',
    );
    const projectCategory = page.locator(
      '(//div[@class="flex justify-center mx-2 cursor-pointer"]//button)',
    );
    const projectType = page.locator(
      '(//div[@class="flex justify-center mx-2 cursor-pointer"]//button)',
    );
    const projectTypes = page.locator(
      '(//div[@class="flex justify-center mx-2 cursor-pointer"]//button)',
    );
    const unitTypeField = page.locator(
      '(//h1[normalize-space()="Units Type"])',
    );
    const selectunitType = page.locator(
      '(//div[@class="flex flex-wrap ml-8 mt-2"]//button)',
    );
    const ownedUnit = page.locator(
      "(//button[contains(@class,'flex items-center gap-1 border')])[1]",
    );
    const sharedUnit = page.locator(
      "(//button[contains(@class,'flex items-center gap-1 border')])[2]",
    );

    const bedRoomField = page.locator(
      '(//div[@class="flex justify-between border-b border-gray-100 mb-2 mt-2 md:my-6 cursor-pointer"]//h1)',
    );
    const selectBhk = page.locator(
      '(//div[@class="flex flex-wrap ml-8 mt-2"]//div)',
    );
    const facingField = page.locator(
      '(//div[@class="flex justify-between border-b border-gray-100 mb-2 mt-2 md:my-6 cursor-pointer"]//h1)',
    );
    const selectFacing = page.locator(
      '(//div[@class="flex justify-center mx-2 cursor-pointer"]//button)',
    );
    const areaField = page.locator(
      '(//div[@class="flex justify-between border-b border-gray-100 mb-2 mt-2 md:my-6 cursor-pointer"]//h1)',
    );
    const minimumRange = page.locator('//input[@name="Min"]');
    const maximumRange = page.locator('//input[@name="Max"]');
    const priceField = page.locator(
      '(//div[@class="flex justify-between border-b border-gray-100 mb-2 mt-2 md:my-6 cursor-pointer"]//h1)',
    );
    const minimumPrice = page.locator(
      '(//div[@class="flex flex-wrap ml-8 mt-2"]//input)',
    );
    const maximumPrice = page.locator(
      '(//div[@class="flex justify-center mx-2 false"]//input)',
    );
    const AmenitiesField = page.locator(
      '(//div[@class="flex justify-between border-b border-gray-100 mb-2 mt-2 md:my-6 cursor-pointer"]//h1)',
    );
    const convenienceField = page.locator(
      '(//div[@class="flex justify-center mx-2 cursor-pointer"]//button)',
    );
    const environmentField = page.locator(
      '(//div[@class="flex justify-center mx-2 cursor-pointer"]//button)',
    );
    const leisureField = page.locator(
      '(//div[@class="flex justify-center mx-2 cursor-pointer"]//button)',
    );
    const safetyField = page.locator(
      '(//div[@class="flex justify-center mx-2 cursor-pointer"]//button)',
    );
    const sportsField = page.locator(
      '(//div[@class="flex justify-center mx-2 cursor-pointer"]//button)',
    );
    const neighbourhoodsField = page.locator(
      '(//div[@class="flex justify-between border-b border-gray-100 mb-2 mt-2 md:my-6 cursor-pointer"]//h1)',
    );
    const selectNeighbourhoodsField = page.locator(
      '(//div[@class="flex justify-center mx-2 cursor-pointer"]//button)',
    );
    const statusField = page.locator(
      '(//div[@class="flex justify-between border-b border-gray-100 mb-2 mt-2 md:my-6 cursor-pointer"]//h1)',
    );
    const selectstatusField = page.locator(
      '(//div[@class="flex items-center mt-3"]//input)',
    );
    const acceptButton = page.locator('(//button[normalize-space()="Accept"])');
    const grantSendButton = page.locator("//button[normalize-space()='Send']");

    /**************************************** Upload CSV File ***************************/
    const uploadCsvFileButton = page.locator(
      '//button[normalize-space()="Upload csv"]',
    );
    const uploadLeadButton = page.locator(
      '//li[normalize-space()="Upload Lead"]',
    );
    const uploadContactButton = page.locator(
      '//li[normalize-space()="Upload Contact"]',
    );
    const fileUploadButton = page.locator("#file-upload");
    const doyouwantCrmCheckBox = page.locator('//input[@type="checkbox"]');
    const deletCsvFileBUtton = page.locator(
      '//button[contains(@class,"text-red-500 hover:text-red-700 ")]',
    );
    const clickUploadButton = page.locator(
      '//button[normalize-space()="Upload"]',
    );
    const csvScetion = page.locator('//span[normalize-space()="CSV"]');
    const checkTheStatusCompleted = page.locator(
      '(//span[normalize-space()="Completed"])[1]',
    );
    const checkTheErrorStaus = page.locator(
      '(//span[normalize-space()="Completed with Errors"])[1]',
    );
    const importLeadClick = page.locator(
      '(//div[@class="flex items-center justify-between p-5"])[1]',
    );
    const totalRecords = page.locator(
      '//div[normalize-space()="Total Records"]',
    );
    const cancelUploadButton = page.locator(
      '//button[normalize-space()="Cancel"]',
    );
    const selectedFileName = page.locator(
      '//span[contains(text(), ".csv")] | //p[contains(text(), ".csv")] | //div[contains(@class, "truncate")]',
    );

    /*************************************************************  MYSITE PAGE *************************************************************************** */
    // const dotSiteButton=page.locator('//a[@href="https://newton2ndlaw.realiti.tech"]')
    const publishManager = page.locator("(//div[text()='Publish Manager'])[1]");
    const publishlog = page.locator("(//div[text()='Publish Logs'])[1]");
    const projectSuccessfull = page.locator(
      '(//div[@class="mt-4 mb-20 space-y-3 h-publishlogs md:h-screen76 overflow-y-auto sm:mb-0 border p-4 rounded-lg shadow-xl"]//span)[2]',
    );
    const mySiteButton1 = page.locator(
      '//div[@class="static bottom-0 flex-col pt-3 sm:flex"]//a[@href="/mysite"]',
    );
    /********GTM TAG */
    const GTMTagButton = page.locator(
      '(//div[text()="Google Tag Manager"])[1]',
    );
    const GTMTagEditButton = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const leadConversion = page.locator('//input[@type="checkbox"]');
    const GTMTextBox = page.locator('//input[@type="text"]');
    const GTMToggleButton = page.locator('//button[@role="switch"]');
    const GTMSaveButton = page.locator(
      '//button[normalize-space()="Save & Publish"]',
    );
    const GTMGoBackButton = page.locator(
      '//button[normalize-space()="Go back"]',
    );
    /*********THEMES */
    const theme = page.locator('(//div[text()="Theme"])[1]');
    const personalization = page.locator(
      '(//div[normalize-space()="Personalization"])[1]',
    );
    const editButtonPersonalization = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const selectThemes = page.locator(
      '(//div[@class="relative shadow-md rounded-md p-4 w-[360px]"]//img)',
    );
    const previewpersonalization = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const savePersonalization = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveandPublishbuttonPersonalization = page.locator(
      '//button[normalize-space()="Save & Publish"]',
    );
    const goBackSuccessfull = page.locator(
      '//div[normalize-space()="Go back"]',
    );
    //****Header */
    const headerButton = page.locator('(//div[normalize-space()="Header"])[1]');
    const editHeader = page.locator('(//button[normalize-space()="Edit"])[1]');
    const headerAddMenu = page.locator('button:has-text("Add Menu")');
    const texts = page.locator(
      '//input[contains(@class,"border-gray-400capitalize focus")]',
    );
    const links = page.locator(
      '//input[contains(@class,"border-gray-400 focus:outline-none")]',
    );

    const headerEmail = page.locator("#email");
    const headerMobileNumber = page.locator("#phone");

    const remove = page.locator('//span[@class="text-red-500 "]');
    const saveHeaderButton = page.locator(
      ' (//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishHeader = page.locator(
      '//button[normalize-space()="Save & Publish"]',
    );
    const headermenuIteamDeleteIteam=page.locator('//span[@class="text-red-500 "]')

    //***********Footter  */
    const footerButton = page.locator('(//div[normalize-space()="Footer"])[1]');
    const editFooter = page.locator('(//button[normalize-space()="Edit"])[1]');
    const removeFooterSections = page.locator(
      '//button[@class="ml-3 text-red-500 hover:text-red-600"]',
    );

    const sectionTitle = page.locator('//input[@id="title"]');
    const streetAddress = page.locator('//textarea[@id="footerText"]');
    const mobileNumber = page.locator('//input[@id="phoneNumber"]');
    const email = page.locator('//input[@id="email"]');
    const linkName = page.locator('//input[@placeholder="Link Name"]');
    const footerURL = page.locator('//input[@placeholder="Link URL"]');
    const addSelection = page.locator(
      '//button[normalize-space()="+ Add Section" or contains(.,"Add Section")] | //div[@class="mt-2"]//button',
    );
    const footerVisibility = page.locator('//button[@role="switch"]');
    const addFooterLink = page.locator(
      '//button[normalize-space()="+ Add Link" or contains(.,"Add Link")] | //div[@class="col-span-6 flex items-center justify-end w-full mt-4"]//button',
    );
    const previewFooter = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewFooterBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const saveFooterButton = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishFooter = page.locator(
      '(//button[normalize-space()="Save & Publish"])[1]',
    );

    const socialMediabutton = page.locator(
      '(//div[normalize-space()="Social Media"])[1]',
    );
    const editSocialMedia = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );

    const addFacebookLink = page.locator('(//div[@class="relative"]//input)');
    const faceBookButton = page.locator(
      '(//td[@class="flex items-center justify-center py-4 pl-3 pr-4 text-sm font-medium sm:pr-0"]//button)',
    );
    const addTwitterlink = page.locator('(//div[@class="relative"]//input)');
    const twitterButton = page.locator(
      '(//td[@class="flex items-center justify-center py-4 pl-3 pr-4 text-sm font-medium sm:pr-0"]//button)',
    );
    const addYoutubelink = page.locator('(//div[@class="relative"]//input)');
    const youtubeButton = page.locator(
      '(//td[@class="flex items-center justify-center py-4 pl-3 pr-4 text-sm font-medium sm:pr-0"]//button)',
    );
    const addInstalink = page.locator('(//div[@class="relative"]//input)');
    const instaButton = page.locator(
      '(//td[@class="flex items-center justify-center py-4 pl-3 pr-4 text-sm font-medium sm:pr-0"]//button)',
    );
    const addLinkedInlink = page.locator('(//div[@class="relative"]//input)');
    const linkedInButton = page.locator(
      '(//td[@class="flex items-center justify-center py-4 pl-3 pr-4 text-sm font-medium sm:pr-0"]//button)',
    );
    const addPrintestlink = page.locator('(//div[@class="relative"]//input)');
    const printestButton = page.locator(
      '(//td[@class="flex items-center justify-center py-4 pl-3 pr-4 text-sm font-medium sm:pr-0"]//button)',
    );
    const topBarButton = page.locator('(//div[@class="flex gap-2 "]//button)');
    const fotterBarButton = page.locator(
      '(//div[@class="flex gap-2 "]//button)',
    );
    const saveSocialMediaButton = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishSocial = page.locator(
      '(//button[normalize-space()="Save & Publish"])[1]',
    );
    const deleteFooterButton=page.locator('//button[@class="ml-3 text-red-500 hover:text-red-600"]')

    /**********  Favicon & Logo  */
    const faviconAndLogoButton = page.locator(
      '(//div[normalize-space()="Favicon & Logo"])[1]',
    );
    const editFavicon = page.locator('(//button[normalize-space()="Edit"])[1]');
    const faviconReplaceButton = page.locator(
      '(//button[normalize-space()="Replace"])[1]',
    );
    const faviconUploadButton = page.locator(
      '//button[normalize-space()="Upload"]',
    );

    const faviconImageUpload = page.locator('//input[@type="file"]');
    const faviconSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const saveFaviconButton = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishFavicon = page.locator(
      '(//button[normalize-space()="Save & Publish"])[1]',
    );
    const editLogoButton = page.locator(
      '(//button[normalize-space()="Edit"])[3]',
    );
    const logoReplaceButton = page.locator(
      '(//button[normalize-space()="Replace"])',
    );
    const logoUploadButton = page.locator(
      '//button[normalize-space()="Upload"]',
    );

    const backButton = page.locator(
      '(//div[@class="flex items-end justify-end gap-3"]//button)[1]',
    );
    const logoImageUpload = page.locator('//input[@type="file"]');
    const logoSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );

    const logoCircleButton = page.locator(
      '//button[normalize-space()="Circle"]',
    );
    const logoSqureButton = page.locator(
      '//button[normalize-space()="Square"]',
    );
    const logoRectangleButton = page.locator(
      '//button[normalize-space()="Rectangle"]',
    );

    const logoAddLink = page.locator(
      '//div[@class="flex items-center justify-center gap-1"]',
    );
    const LinkText = page.locator('//input[@type="text"]');
    const saveLink = page.locator(
      '(//div[@class="relative flex gap-2"]//span)[2]',
    );

    const saveLogoButton = page.locator(
      ' (//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishlogo = page.locator(
      '(//button[normalize-space()="Save & Publish"])[1]',
    );
    /***********Pages HOME*/
    const pageButton = page.locator('(//div[normalize-space()="Pages"])[1]');
    const homeButton = page.locator(
      '(//div[contains(@class, "pl-8") and contains(., "Home")])[1]',
    );
    const homeBannerButton = page.locator(
      '//p[normalize-space()="Home Banner"]',
    );
    const EditHomeBanner = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const addFiles = page.locator('//button[normalize-space()="Add Files"]');
    const HomeBannerImgUpload = page.locator('//input[@type="file"]');
    const BannerSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const limitExeed = page.locator('//div[@class="text-orange-500"]');
    const title = page.locator("#maincontent");
    const subTitle = page.locator(
      '(//div[contains(@class,"mt-10 text-md")]//textarea)[1]',
    );
    const Description = page.locator(
      '(//div[contains(@class,"mt-10 text-md")]//textarea)[2]',
    );
    const alignmentsLeft = page.locator('//button[normalize-space()="Left"]');
    const alignmentsCenter = page.locator(
      '//button[normalize-space()="Center"]',
    );
    const alignmentsRight = page.locator('//button[normalize-space()="Right"]');
    const bannerTextColor = page.locator('//button[@aria-haspopup="true"]');
    const textColor = page.locator('//div[@title="#4A90E2"]');
    const previewHomeBanner = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewBannerBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const saveHomeBannerButton = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishHomeBanner = page.locator(
      '(//button[normalize-space()="Save & Publish"])[1]',
    );
    const deleteBannerCheckBox = page.locator('//input[@name="checkbox"]');
    const homeBannerDeletButton = page.locator(
      '//div[@class="flex justify-end"]//button | //button[normalize-space()="Delete"] | //div[@class="flex justify-end"]'
    );
    /************ HOME FILTER */
    const homeFilter = page.locator('(//p[normalize-space()="Home Filter"])');
    const editHomeFilter = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const showOnWebStoreButon = page.locator(
      '//div[@class="flex items-center justify-end gap-6 py-4 mx-4"]//button',
    );
    const previewHomeFilter = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewfilterBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const saveHomeFilter = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishhomeFilter = page.locator(
      '(//button[normalize-space()="Save & Publish"])[1]',
    );
    /************FEATURED STOCK ***************** */
    const featuredStockButton = page.locator(
      '(//p[normalize-space()="Featured Stock"])',
    );
    const editFeaturedStock = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );

    // const stockButton=page.locator('//div[@class="static bottom-0 flex-col pt-3 sm:flex"]//a[@href="/stocks/units"]')
    // const stockPin=page.locator('//div[@class="w-full right-2 top-2 flex items-center justify-end tooltippub relative"]')
    // const PlotPage=page.locator('(//div[@class="text-right rounded-sm pr-3"]//button)[2]')
    // const PlotPin=page.locator('//div[@class="w-full right-2 top-2 flex items-center justify-end tooltippub relative"]')
    // const projectPage=page.locator('(//div[@class="text-right rounded-sm pr-3"]//button)[3]')
    // const projectPin=page.locator('//div[@class="w-full right-2 top-2 flex items-center justify-end tooltippub relative"]')
    const unitToggleButton = page.locator(
      '//div[@class="relative flex items-center justify-end gap-6 py-4 mx-4"]//button',
    );
    const unitUnpin = page.locator(
      '//div[@class="flex items-center justify-end w-full right-2 top-2"]',
    );
    const switchPlot = page.locator('(//button[normalize-space()="Plots"])');
    const plotToggleButton = page.locator(
      '//div[@class="relative flex items-center justify-end gap-6 py-4 mx-4"]//button',
    );
    const plotUnpin = page.locator(
      '//div[@class="flex items-center justify-end w-full right-2 top-2"]',
    );
    const switchProject = page.locator(
      '(//button[normalize-space()="Projects"])',
    );

    const projectToggleButton = page.locator(
      '//div[@class="relative flex items-center justify-end gap-6 py-4 mx-4"]//button',
    );
    const projectUnpin = page.locator(
      '//div[@class="absolute flex items-center right-2 top-2"]',
    );
    const previewFeaturedStock = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewFeaturedBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const saveFeatureStock = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishFeatured = page.locator(
      '(//button[normalize-space()="Save & Publish"])[1]',
    );
    /*****************  COLLECTIONS */
    const collectionButton = page.locator(
      '(//p[normalize-space()="Collections"])',
    );
    const editCollection = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const collectinToggleButton = page.locator(
      '//div[@class="flex items-center justify-end gap-6 py-4 mx-4"]//button',
    );
    const collectionUnpin = page.locator(
      '//div[@class="absolute top-2 right-2 z-50"]',
    );

    const previewCollection = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewCollectionBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const saveCollection = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishCollection = page.locator(
      '(//button[normalize-space()="Save & Publish"])[1]',
    );
    /*********************ABOUT US *******/
    const aboutUsButton = page.locator('(//p[normalize-space()="About Us"])');
    const editAboutUs = page.locator('(//button[normalize-space()="Edit"])[1]');
    const aboutUsToggleButton = page.locator(
      '//div[@class="flex items-center justify-end gap-6 py-4 mx-3"]//button',
    );
    const aboutUploadButton = page.locator('//div[@class="ml-auto"]//button');
    const aboutUsImgUpload = page.locator('//input[@type="file"]');
    const aboutusSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const aboutUsDiscription = page.locator(
      '//div[@class="relative"]//textarea',
    );
    const previewAboutUs = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewAboutUsBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const saveAboutUs = page.locator('(//button[normalize-space()="Save"])[1]');
    const SaveAndPublishAboutUs = page.locator(
      '//button[normalize-space()="Save & Publish"]',
    );

    /***********SERVICES */
    const servicesButton = page.locator('//p[normalize-space()="Services"]');
    const editServicesButton = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const servicesToggleButton = page.locator(
      '//div[@class="flex items-center justify-between gap-6 pt-4 mx-2 mb-2"]//button',
    );
    const servicesMainTittle = page.locator('//div[@class="mx-2"]//input');
    const servicesSubTittle = page.locator('//div[@class="col-span-3"]//input');
    const servicesDiscription = page.locator(
      '(//textarea[@class="border focus:outline-none px-4 rounded py-2 block w-full h-36 mt-2 text-md font-normal"])',
    );
    const serviceimguploadButton = page.locator(
      '//div[@class="relative col-span-1 w-full"]//div[contains(@class, "cursor-pointer")]',
    );
    //const serviceimguploadButton=page.locator('(//label[@class="rounded-md bg-primary text-white px-2 py-1 text-sm cursor-pointer"])')

    const serviceimgupload1 = page.locator('//input[@type="file"]');
    const servicesSubmitButton1 = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const servicesDeleteButton1 = page.locator(
      '(//div[@class="relative col-span-1 w-full"]//div)',
    );
    const servicesSubTittle2 = page.locator(
      '//div[@class="col-span-3"]//input',
    );
    const servicesDiscription2 = page.locator(
      '(//textarea[@class="border focus:outline-none px-4 rounded py-2 block w-full h-36 mt-2 text-md font-normal"])',
    );
    const serviceimguploadButton2 = page.locator(
      '//div[@class="relative col-span-1 w-full"]//div[contains(@class, "cursor-pointer")]',
    );
    //const serviceimguploadButton2=page.locator('(//label[@class="rounded-md bg-primary text-white px-2 py-1 text-sm cursor-pointer"])')

    const serviceimgupload2 = page.locator('//input[@type="file"]');
    const servicesSubmitButton2 = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const servicesDeleteButton2 = page.locator(
      '(//div[@class="relative col-span-1 w-full"]//div)',
    );

    const servicesSubTittle3 = page.locator(
      '(//textarea[@class="border focus:outline-none px-4 rounded py-2 block w-full h-36 mt-2 text-md font-normal"])',
    );
    const servicesDiscription3 = page.locator(
      '(//textarea[@class="border focus:outline-none px-4 rounded py-2 block w-full h-36 mt-2 text-md font-normal"])',
    );
    const serviceimguploadButton3 = page.locator(
      '//div[@class="relative col-span-1 w-full"]//div[contains(@class, "cursor-pointer")]',
    );
    //const serviceimguploadButton3=page.locator('(//label[@class="rounded-md bg-primary text-white px-2 py-1 text-sm cursor-pointer"])')

    const serviceimgupload3 = page.locator('//input[@type="file"]');
    const servicesSubmitButton3 = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const servicesDeleteButton3 = page.locator(
      '(//div[@class="relative col-span-1 w-full"]//div)',
    );

    const previewServices = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewServicesBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const saveServices = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishServices = page.locator(
      '//button[normalize-space()="Save & Publish"]',
    );
    /******************DEFAULT COLLECTION */
    const defaultCollectionButton = page.locator(
      '//p[normalize-space()="Default Collections"]',
    );
    const editDefaultCollection = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const defaultCollectionToggleButton = page.locator(
      '//div[@class="flex items-center justify-end gap-6 py-4 mx-4"]//button',
    );
    const backroundImageUpload = page.locator('input[type="file"]');
    const backroundImageButton = page.locator(
      '(//button[@id="dropdownMenuButton1"])[2]',
    );
    const titleBox = page.locator("#title");
    const SubTitleBox = page.locator("#subtitle");
    const DescriptionBox = page.locator("#description");
    const iconImagebutton = page.locator(
      '(//button[@data-te-ripple-init="true"])[1]',
    );
    const iconImageUpload = page.locator('input[type="file"]');
    const plotDescription = page.locator(
      '(//textarea[contains(@class,"border  outline: none;")])[1]',
    );
    const plotImage = page.locator('(//button[@id="dropdownMenuButton1"])[4]');
    const plotImageUpload = page.locator('input[type="file"]');
    const plotImageSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const villaDescription = page.locator(
      '(//textarea[contains(@class,"border  outline: none;")])[2]',
    );
    const villaImage = page.locator('(//button[@id="dropdownMenuButton1"])[5]');
    const villaImageUpload = page.locator('input[type="file"]');
    const villaImageSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const rowHouseDescription = page.locator(
      '(//textarea[contains(@class,"border  outline: none;")])[3]',
    );
    const rowHouseImage = page.locator(
      '(//button[@id="dropdownMenuButton1"])[6]',
    );
    const rowhouseImageUpload = page.locator('input[type="file"]');
    const rowImageSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const apartmentDescription = page.locator(
      '(//textarea[contains(@class,"border  outline: none;")])[4]',
    );
    const apartmentImage = page.locator(
      '(//button[@id="dropdownMenuButton1"])[7]',
    );
    const apartmentImageUpload = page.locator('input[type="file"]');
    const apartImageSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );

    const previewDefaultCollection = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewDefaultCollectionBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const saveDefaultCollection = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishDefaultCollection = page.locator(
      '//button[normalize-space()="Save & Publish"]',
    );
    /*****************************TESTIMONIALS**************************** */
    const testimonials = page.locator('//p[normalize-space()="Testimonials"]');
    const testimonialsEditButton = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const testimonialsToogleButton = page.locator(
      '(//button[@role="switch"])[1]',
    );
    const testimonialsTitle = page.locator("#title");
    const testimonialsImageButton = page.locator(
      '//div[contains(@class,"absolute top-2 right-2 sm:top-3")]',
    );
    const testimonialsImageUpload = page.locator('//input[@type="file"]');
    const testimonialsImageSubmit = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const Addtestimonials = page.locator(
      '//button[normalize-space()="Add Testimonial"]',
    );
    const name = page.locator("#Name");
    const SubTitle = page.locator("#JobTitle");
    const content = page.locator("#Content");
    const uploadImage = page.locator('//input[@type="file"]');
    const testimonialSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const previewTestimoials = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewTestimoialsBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const saveTestimoials = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishTestimoials = page.locator(
      '//button[normalize-space()="Save & Publish"]',
    );
    const deleteTestimonialsButton = page.locator(
      '//button[contains(@class,"p-2 bg-red-500 text-white round")] | //button[contains(@class,"bg-red-500")]'
    );
    /**************************CARD SECTION*********************** */
    const rightImageSectionButton = page.locator(
      '//p[normalize-space()="Cards Section"]',
    );
    const rightImageEditButton = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const rightImagetoggleButton = page.locator(
      '(//button[@role="switch"])[1]',
    );
    const rightImageTitle = page.locator("#title");
    const rightImageSubitle = page.locator("#subcontent");
    const rightImageContent = page.locator("#content");
    const rightOverallImageButton = page.locator(
      '(//button[contains(@class,"px-2 py-1 text-xs font-medium")])[1]',
    );
    const rightOverallImageUpload = page.locator('//input[@type="file"]');
    const OverallImageSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const selectCardImagePosition = page.locator("#imagePosition");

    const titleimageButton = page.locator(
      '(//div[contains(@class ,"absolute top-3 left-3 z-10 w-6 h-6")])[1]',
    );
    const titleimageUploadButton = page.locator('//input[@type="file"]');
    const titleimageSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const Title = page.locator(
      '(//input[contains(@class,"border focus:outline-none")])[3]',
    );
    const description = page.locator(
      '(//textarea[contains(@class,"border focus:outline-none")])[1]',
    );
    const title2imageButton = page.locator(
      '(//div[contains(@class ,"absolute top-3 left-3 z-10 w-6 h-6")])[1]',
    );
    const title2imageUploadButton = page.locator('//input[@type="file"]');
    const title2imageSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const Title2 = page.locator(
      '(//input[contains(@class,"border focus:outline-none")])[3]',
    );
    const description2 = page.locator(
      '(//textarea[contains(@class,"border focus:outline-none")])[1]',
    );
    const title3imageButton = page.locator(
      '(//div[contains(@class ,"absolute top-3 left-3 z-10 w-6 h-6")])[1]',
    );
    const title3imageUploadButton = page.locator('//input[@type="file"]');
    const title3imageSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const Title3 = page.locator(
      '(//input[contains(@class,"border focus:outline-none")])[3]',
    );
    const description3 = page.locator(
      '(//textarea[contains(@class,"border focus:outline-none")])[1]',
    );
    const title4imageButton = page.locator(
      '(//div[contains(@class ,"absolute top-3 left-3 z-10 w-6 h-6")])[1]',
    );
    const title4imageUploadButton = page.locator('//input[@type="file"]');
    const title4imageSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const Title4 = page.locator(
      '(//input[contains(@class,"border focus:outline-none")])[3]',
    );
    const description4 = page.locator(
      '(//textarea[contains(@class,"border focus:outline-none")])[1]',
    );
    const rightImagePreview = page.locator(
      '(//button[normalize-space ()="Preview"])[1]',
    );
    const rightImagePreBackButton = page.locator(
      '(//button[normalize-space ()="Back"])[1]',
    );
    const rightImageSaveButton = page.locator(
      '(//button[normalize-space ()="Save"])[1]',
    );
    const rightImageSavePublishButton = page.locator(
      '(//button[normalize-space ()="Save & Publish"])[1]',
    );
    /*************************Accordion SECTION **********************/
    const leftImageSection = page.locator(
      '//p[normalize-space()="Accordion Section"]',
    );
    const leftImageEditButton = page.locator(
      '(//button[normalize-space ()="Edit"])[1]',
    );
    const leftImagetoggleButton = page.locator(
      '(//button[@role="switch"])[1]',
    );
    const leftImageTitle = page.locator("#title");
    const leftImageSubTitle = page.locator("input#subcontent");
    const leftImageContent = page.locator("textarea#subcontent").first();
    const leftOverallImageButton = page.locator(
      '(//div[contains(@class,"absolute top-3 right-3 z-10")]//button)[1]',
    );
    const leftOverallImageUpload = page.locator('//input[@type="file"]');
    const LeftOverallImageSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const selectImagePosition = page.locator("#imagePosition");

    const leftAddSections = page.locator(
      '//button[normalize-space ()="Add Sections"]',
    );
    const LeftImageSectionTitle = page.locator(
      '(//input[contains(@class,"focus:outline-none border")])[1]',
    );
    const leftImageSectionDescription = page.locator(
      '(//textarea[contains(@class,"border break-all")])[2]',
    );
    const leftImagePreview = page.locator(
      '(//button[normalize-space ()="Preview"])[1]',
    );
    const leftImagePreBackButton = page.locator(
      '(//button[normalize-space ()="Back"])[1]',
    );
    const leftImageSaveButton = page.locator(
      '(//button[normalize-space ()="Save"])[1]',
    );
    const leftImageSavePublishButton = page.locator(
      '(//button[normalize-space ()="Save & Publish"])[1]',
    );
    /************************Statistics ******************* */
    const statisticsSection = page.locator(
      '//p[normalize-space()="Statistics"]',
    );
    const statisticsEditButton = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const statisticsToggleButton = page.locator(
      '//div[@class="flex items-center justify-end gap-6 py-4 mx-4"]//button',
    );
    const statisticsImageButton = page.locator(
      '//div[contains(@class,"absolute top-3 right-3 z-10 w-6 ")]//button',
    );
    const statisticsUploadButton = page.locator('//input[@type="file"]');
    const statisticsSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );
    const statisticsTitle = page.locator("#title");
    const statisticsSubTitle = page.locator("input#subcontent");
    const statisticsTitle1 = page.locator(
      '(//input[contains(@class,"ocus:outline-none")])[3]',
    );
    const statisticsDescription1 = page.locator(
      '(//textarea[contains(@class,"ocus:outline-none")])[1]',
    );
    const statisticsTitle2 = page.locator(
      '(//input[contains(@class,"ocus:outline-none")])[4]',
    );
    const statisticsDescription2 = page.locator(
      '(//textarea[contains(@class,"ocus:outline-none")])[2]',
    );
    const statisticsTitle3 = page.locator(
      '(//input[contains(@class,"ocus:outline-none")])[5]',
    );
    const statisticsDescription3 = page.locator(
      '(//textarea[contains(@class,"ocus:outline-none")])[3]',
    );
    const statisticsTitle4 = page.locator(
      '(//input[contains(@class,"ocus:outline-none")])[6]',
    );
    const statisticsDescription4 = page.locator(
      '(//textarea[contains(@class,"ocus:outline-none")])[4]',
    );
    const StatisticsPreview = page.locator(
      '(//button[normalize-space ()="Preview"])[1]',
    );
    const StatisticsPreBackButton = page.locator(
      '(//button[normalize-space ()="Back"])[1]',
    );
    const StatisticsSaveButton = page.locator(
      '(//button[normalize-space ()="Save"])[1]',
    );
    const StatisticsSavePublishButton = page.locator(
      '(//button[normalize-space ()="Save & Publish"])[1]',
    );

    /************************************LATEST PROPERTIES *************************************** */
    const latestPropertiesButton = page.locator(
      '//p[normalize-space()="Latest Properties"]',
    );
    const latestpropertyEditButton = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const toggleButtton = page.locator(
      '//div[@class="flex items-center justify-end gap-6 py-4 mx-4"]//button',
    );
    const titleTextBox = page.locator("#title");
    const subTitleTextBox = page.locator("input#subcontent");
    const switchApart = page.locator(
      '(//span[@class="inline-flex overflow-y-auto rounded-md shadow-sm isolate"]//button)[1]',
    );
    const switchVilla = page.locator(
      '(//span[@class="inline-flex overflow-y-auto rounded-md shadow-sm isolate"]//button)[2]',
    );
    const switchRowHouse = page.locator(
      '(//span[@class="inline-flex overflow-y-auto rounded-md shadow-sm isolate"]//button)[3]',
    );
    const switchPlots = page.locator(
      '(//span[@class="inline-flex overflow-y-auto rounded-md shadow-sm isolate"]//button)[4]',
    );
    const switchFlat = page.locator(
      '(//span[@class="inline-flex overflow-y-auto rounded-md shadow-sm isolate"]//button)[5]',
    );
    const switchHouse = page.locator(
      '(//span[@class="inline-flex overflow-y-auto rounded-md shadow-sm isolate"]//button)[6]',
    );
    const previewLatestProperties = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewLatestPropertiesBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const saveLatestProperties = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );

    /**************** STORE */
    const storeButton = page.locator(
      '(//div[contains(@class, "pl-8") and contains(., "Store")])[1]',
    );
    const editStoreButton = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const storeImgaddFiles = page.locator('//div[@class="ml-auto"]//button');
    const storeBannerImguploadButton = page.locator('//input[@type="file"]');
    const storeImgSubmitButton = page.locator(
      '//button[normalize-space()="Submit"]',
    );

    const ImageLimit = page.locator('//div[@class="text-orange-500"]');
    const previewStoreBanner = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewStoreBannerBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const saveStoreBanner = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishStoreBanner = page.locator(
      '//button[normalize-space()="Save & Publish"]',
    );
    /*******************CARD STYLE */
    const storeCardStyle = page.locator('//p[normalize-space()="Card Style"]');
    const editCardStyle = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const verticalStyle = page.locator(
      '(//div[@class="flex items-center mb-4"])',
    );
    const horizantalStyle = page.locator(
      '(//div[@class="flex items-center mb-4"])',
    );
    const saveCardStyle = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );

    /***********ON BOARED PARTNERS */
    const onBoardPartnerButton = page.locator(
      '(//div[contains(@class, "pl-8") and contains(., "Onboard Partner")])[1]',
    );
    const editOnBoardPartner = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const onBoardPartnerToggleButton = page.locator(
      '//div[@class="flex items-center gap-4 pb-2 justify-end pt-2"]//button',
    );
    const buttonLabelName = page.locator('//input[@name="btn"]');
    const partnerTypeBroker = page.locator('//input[@type="checkbox"]');
    const partnerTypeBuilder = page.locator('//input[@type="checkbox"]');
    const partnerTittle = page.locator('//input[@name="title"]');
    const partnerMessage = page.locator('//textarea[@name="msg"]');
    const previewOnBoardPartne = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const previewOnBoardPartneBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const saveOnBoardPartne = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const saveAndPublishOnBoardPartne = page.locator(
      '//button[normalize-space()="Save & Publish"]',
    );
    const overAllPublishButton = page.locator(
      '(//button[normalize-space()="Publish"])[1]',
    );
    /********************************************* CONTACT US ********************************************************************** */
    const contactUsButton = page.locator(
      '(//div[contains(@class, "pl-8") and contains(., "Contact Us")])[1]',
    );
    const contactBanner = page.locator(
      '//div[normalize-space()="Contact Banner"]',
    );
    const conatctEditButton = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const conatctTitle = page.locator("#title");
    const contactSubTitle = page.locator("#subcontent");
    const contactDescription = page.locator("#content");
    const contactImageUploadButton = page.locator(
      '//button[contains(@class,"flex items-center whitespace")]',
    );
    const imageUpload = page.locator("#file-upload");
    const contactPreview = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const contactpreviewBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const contactSaveButton = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );
    const contentsection = page.locator(
      '//div[normalize-space()="Content Section"]',
    );
    const contentEditButton = page.locator(
      '(//button[normalize-space()="Edit"])[1]',
    );
    const contentToggleButton = page.locator(
      '(//button[@role="switch"])[1]',
    );
    const contentTitle = page.locator("#title");
    const contentSubTitle = page.locator("#subcontent");
    const contentDescription = page.locator("#content");
    const contentimageUploadButton = page.locator(
      '//button[contains(@class,"flex items-center whitespace")]',
    );
    const contentImageUpload = page.locator("#file-upload");
    const contentBacroundImage = page.locator(
      '//button[@class="flex items-center justify-center text-white"]',
    );
    const backroundImageUploadButton = page.locator("#file-upload");
    const callToAction = page.locator("#callToAction");
    const ButtonTextBox = page.locator("#buttonText");
    const contentPreview = page.locator(
      '(//button[normalize-space()="Preview"])[1]',
    );
    const contentpreviewBackButton = page.locator(
      '(//button[normalize-space()="Back"])[1]',
    );
    const contentSaveButton = page.locator(
      '(//button[normalize-space()="Save"])[1]',
    );

    /****************************************Partner Exange ********************************************************/
    /*****************************STOCK GRANT ******************** */
    const stockbutton = page.locator('//a[normalize-space()="Stock"]');
    const checkbox = page.locator('//div[@class="flex checkBox"]');
    // const dotButtons = page.locator('//div[@class="wavecircle delay3"]');
    const grantButton = page.locator(
      '(//div[@class="flex gap-2 justify-start items-center"])[1]',
    );
    const textBox = page.locator('//input[@type="text"]');
    const searchButton = page.locator('//button[normalize-space()="Search"]');
    const selectCompany = page.locator('//div[contains(@class,"block py-1")]');
    const addMessageBox = page.locator(
      '//textarea[contains(@class,"w-full h-40 p-3 text-sm")]',
    );
    const acceptGrantButon = page.locator(
      '//button[normalize-space()="Grant"]',
    );
    const grantBackButton = page.locator(
      '//button[@class="px-2 py-2 bg-indigo-900 rounded text-white hover:bg-indigo-700"]',
    );

    /*************************************** SWITCH ACCOUNT ****************** */
    const myconnections = page.locator(
      '//div[@class="static bottom-0 flex-col pt-3 sm:flex"]//a[@href="/mynetwork/myconnections"]',
    );
    const acceptConnection = page.locator(
      '//button[normalize-space()="Accept"]',
    );
    const connectCompany = page.locator(
      '(//ul[@class="lg:h-only_conversations overflow-y-auto h-my_screen264 scroll-smooth"]//li)[1]',
    );
    const connect = page.locator(
      '//div[@class="col-span-2 lg:mt-0 sm:flex justify-center"]//button',
    );

    const comapanyName = page.locator(
      '//li[contains(@class,"grid grid-cols-7")]',
    );
    const GainorGrantButton = page.locator(
      '(//div[@class="relative grid grid-cols-8 border-b-1 lg:grid-cols-12"])',
    );
    const grantAcceptButton = page.locator('//div[normalize-space()="Accept"]');
    const textarea = page.locator('//textarea[@placeholder="Type a Message"]');

    const addFileButton = page.locator(
      '//div[@class="flex items-center justify-between w-11/12 gap-2 px-4 bg-gray-100"]//button',
    );
    const AddImage = page.locator(
      '(//div[@class="text-gray-500 text-center"]//label)[1]',
    );
    const addAudio = page.locator(
      '(//div[@class="text-gray-500 text-center"]//label)[2]',
    );
    const addVideo = page.locator(
      '(//div[@class="text-gray-500 text-center"]//label)[3]',
    );
    const addDocument = page.locator(
      '(//div[@class="text-gray-500 text-center"]//label)[4]',
    );
    const sentButton = page.locator(
      '//button[@class="flex items-center justify-center w-12 md:w-10 h-10 bg-indigo-100 rounded-full text-primary"]',
    );
    const BackButton = page.locator(
      '//button[@class="items-center justify-center hidden w-8 h-8 rounded-md lg:text-white lg:flex lg:bg-primary"]',
    );
    const refreshButton = page.locator(
      '(//div[@class="items-center gap-3 lg:flex"]//button)',
    );
    const ganiButton = page.locator(
      '(//div[@class="items-center gap-3 lg:flex"]//button)',
    );
    const gainCloseButton = page.locator(
      '//div[@class="mt-5 sm:mt-6"]//button',
    );

    const mobileNumbers = page.locator("#phone");

    const GrantButton = page.locator(
      '(//div[@class="items-center gap-3 lg:flex"]//button)',
    );
    const unitCheckBox = page.locator('(//input[@type="checkbox"])');
    const dotButton = page.locator('//div[@class="wavecircle1 jiggle"]');
    const stockgrantButton = page.locator(
      '(//div[@class="flex gap-2 justify-start items-center "])',
    );
    const threadButton = page.locator(
      '(//div[@class="items-center gap-3 lg:flex"]//button)',
    );
    const threadSubjectName = page.locator("#subject");
    const threadCreatButton = page.locator(
      '(//div[@class="mt-4 flex items-center justify-end gap-4"]//button)',
    );
    const threadCancelButton = page.locator(
      '(//div[@class="mt-4 flex items-center justify-end gap-4"]//button)[1]',
    );

    const downloadPartners = page.locator(
      '(//div[@class="items-center gap-3 lg:flex"]//button)',
    );
    const detailsButton = page.locator(
      '(//div[@class="items-center gap-3 lg:flex"]//button)',
    );
    const threeDotButton = page.locator(
      '(//div[@class="relative inline-block text-left"]//button)',
    );
    const disConectYes = page.locator(
      '(//div[@class="mt-4 flex items-center justify-end gap-4"]//button)',
    );
    const disconnectPartners = page.locator('//div[@class="py-1"]//div');
    const partnerFilter = page.locator('(//select[@name="type"])');
    const types = page.locator('//option[@value="STOCK"]');

    /*************************************** ACCOUNT SETTINGS ****************************************/
    const accountSettings = page.locator(
      '//a[contains(@class,"flex flex-col items-center justify-center")]',
    );
    const companyDetailsEditButton = page.locator(
      '//button[normalize-space()="Edit"]',
    );
    const companyName = page.locator('//input[@name="name"]');
    const companyType = page.locator('(//select[@id="type"])[2]');
    const companyTypeSelect = page.locator('//option[@value="Company_Type"]');
    const wesiteNameDropdown = page.locator(
      '//select[contains(@class,"inline-flex items-center px-3")]',
    );
    const webSiteNameTextBox = page.locator('//input[@id="web"]');
    const companyAddressTextBox = page.locator(
      '//input[@placeholder="Search Address (please enter more than 3 characters)"]',
    );
    const selectCompanyAddress = page.locator('(//div[@role="option"]//span)');
    const adressLineOne = page.locator("#address1");
    const adressLineTwo = page.locator("#address2");
    const adressLineThree = page.locator("#address3");
    const CountryTextBox = page.locator("#country");
    const stateTextBox = page.locator("#state");
    const cityTextBox = page.locator("#city");
    const pincodeTextBox = page.locator("#pincode");
    const secondaryContactNumber = page.locator("#contact");
    const secondaryEmail = page.locator("#email");
    const comapnyDetailsSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    /******************* KYC DETAILS**************** */
    const kycDetails = page.locator(
      '(//aside//p[normalize-space()="KYC Details"])[1] | (//p[normalize-space()="KYC Details"])[2]',
    );
    const kycDetailsEditButton = page.locator(
      '//button[normalize-space()="Edit"]',
    );
    const cinNumberTextBox = page.locator('//input[@name="cin"]');
    const gstNumberTextBox = page.locator('//input[@name="gst"]');
    const panNumberTextBox = page.locator('//input[@name="pan"]');
    const companyPanNo = page.locator('//input[@name="pan"]');
    const companyAadharNo = page.locator('//input[@name="aadhar"]');
    const cinNumberUploadbutton = page.locator('(//input[@type="file"])[1]');
    const gstNumberUploadbutton = page.locator('(//input[@type="file"])[2]');
    const panNumberUploadbutton = page.locator('(//input[@type="file"])[3]');
    const kycDetailsSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    /**************************** SEO DETAILS ************/
    const seoDeatilsButton = page.locator(
      '(//aside//p[normalize-space()="SEO Details"])[1] | (//p[normalize-space()="SEO Details"])[3]',
    );
    const seoDetailsEditButton = page.locator(
      '//button[normalize-space()="Edit"]',
    );
    const metaTitle = page.locator('//input[@placeholder="Meta Title"]');
    const metaKeyword = page.locator(
      '//textarea[@placeholder="Enter your Meta Keyword "]',
    );
    const metaDescription = page.locator(
      '//textarea[@placeholder="Enter your Meta Description"]',
    );
    const metaImageUpload = page.locator(
      '//label[normalize-space()="Upload"] | //input[@id="modelImg"] | //input[@type="file"]',
    );
    const deleteMetaImage = page.locator(
      '(//div[contains(@class,"min-w-[20vh]")]//button)[1] | //span[normalize-space()="Meta Image"]/following::button[1]',
    );
    const deleteButton = page.locator(
      '//button[normalize-space()="Delete"]',
    );
    const seoDetailsSaveButton = page.locator(
      '//button[normalize-space()="Save"]',
    );
    /*************************************STAFF MANAGEMENT *************** */
    const StaffManagement = page.locator(
      '(//aside//p[normalize-space()="Staff Management"])[1] | (//p[normalize-space()="Staff Management"])[2]',
    );
    const addStaffButton = page.locator(
      '(//button[contains(., "Add Staff") or normalize-space()="+Add Staff"])[1]',
    );
    const addstaffMember = page.locator(
      '(//button[contains(., "Add Staff Member") or contains(., "Add Staff")])[1]',
    );
    const staffFirstName = page.locator('//input[@name="firstName"]');
    const staffLasttName = page.locator('//input[@name="lastName"]');
    const staffMobileNumber = page.locator("#phone");
    const staffEmailAddress = page.locator("#email");
    const staffAgentNumber = page.locator("#agentNumber");
    const staffRole = page.locator("#role");
    const selectStaffRole = page.locator('//option[@value="Staff"]');
    const CreateStaffButton = page.locator(
      '(//button[normalize-space()="Create Staff" or (@type="submit" and contains(.,"Create Staff"))])[1]',
    );
    const goBackButton = page.locator('(//button[normalize-space()="Go back" or normalize-space()="Back"])[1]');
    const Edit3DotStaffButton = page.locator(
      '(//button[contains(@class,"flex items-center rounded-full") or (contains(@id,"headlessui-menu-button") and contains(.,"Open options"))])[1]',
    );
    const EditStaffButton = page.locator('(//button[contains(., "Edit") or normalize-space()="Edit"])[1]');
    const deleteStaffButton = page.locator(
      '(//button[contains(., "Delete") or normalize-space()="Delete"])[1]',
    );
    const resendInviteButton = page.locator(
      '(//button[normalize-space()="Resend Invite"])[1]',
    );
    const editstaffSubmitButton = page.locator(
      '(//button[normalize-space()="Submit" or (@type="submit" and contains(.,"Submit"))])[1]',
    );
    const PrivilegesEnabledButton=page.locator('//span[@class="flex items-center gap-2"]');
    const editToggleButton=page.locator('//button[@data-headlessui-state="checked"]');


    /************************************SOURCE  *************************************** */
    const source = page.locator(
      '(//aside//p[normalize-space()="Source"])[1] | (//p[normalize-space()="Source"])[2] | //a[normalize-space()="Source"]',
    );
    const addNewSourceButton = page.locator(
      '//div[normalize-space()="Add new Source"] | //button[normalize-space()="Add new Source"]',
    );
    const sourceHeading = page.locator(
      '(//input[contains(@class,"mt-1 block w-full rounded-md bg-white")])[1]',
    );
    const sourceenableordisablebutton = page.locator(
      '//button[contains(@class,"bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 ")] | (//button[@role="switch"])[1]',
    );
    const sourceDisplyName = page.locator("#project-name");
    const sourceparameter = page.locator("#parameter");
    const sourceCode = page.locator("#manual-code");
    const trackingCodeGenerateButton = page.locator(
      '//button[normalize-space()="Generate"]',
    );
    const openChannelDropDown = page.locator(
      '//button[contains(@class,"inline-flex w-full justify-between gap-x-1.5")] | (//button[contains(.,"Select Channel") or contains(.,"Channel")])[1]',
    );
    const createChanneltextBox = page.locator("#new_channel");
    const channelAddButton = page.locator('//button[normalize-space()="Add"]');
    const selectChannel = page.locator(
      '(//div[contains(@class,"flex items-center justify-between gap-2")])[1]',
    );
    const addUser = page.locator('//button[normalize-space()="Add user"]');
    const selectStaffmember = page.locator(
      '(//div[contains(@class,"flex items-center justify-between py-2 px-4")])',
    );
    const sourceSaveButton = page.locator('//button[normalize-space()="Save"]');

    /******************************************LEAD SETTINGS **************************** */
    const leadSettings = page.locator('(//li[@id="Lead Settings"])[2]');
    const leadAutoAssignmentToggle = page.locator(
      '(//button[contains(@class,"bg-primary relative inline-flex h-6")])[1]',
    );
    const pipelineTransitionToggle = page.locator(
      '(//button[contains(@class,"bg-primary relative inline-flex h-6")])[2]',
    );
    const backwardPipelineMovement = page.locator(
      '(//button[contains(@class,"bg-primary relative inline-flex h-6")])[3]',
    );
    const leadReEngagement = page.locator(
      '(//button[contains(@class,"bg-gray-200 relative inline-flex h-6")])[1]',
    );
    const resetLeadOnReEngagement = page.locator(
      '(//button[contains(@class,"bg-gray-200 relative inline-flex h-6")])[2]',
    );
    const pipelineGuide = page.locator(
      '(//li[normalize-space()="Pipeline Guide"])[2]',
    );
    const teams = page.locator('(//li[normalize-space()="Teams"])[2]');
    const createTeam = page.locator(
      '//button[normalize-space()="Create Team"]',
    );
    const teamName = page.locator(
      '//input[@placeholder="e.g., Marketing Team"]',
    );
    const addTeamMembers = page.locator(
      '//button[contains(@class,"w-full md:w-1/2 flex items-center")]',
    );
    const SearchEmployee = page.locator('(//div[@class="relative"])[2]');
    const selectEmployee = page.locator(
      '(//div[@class="max-h-64 overflow-y-auto"]//label)',
    );
    const StaffAddButton = page.locator(
      '//button[contains(@class,"flex-1 px-4 py-2 bg-blue-600")]',
    );
    const assignTeamLead = page.locator(
      '//button[contains(@class,"w-full border rounded-lg p-3")]',
    );
    const selectTeamLead = page.locator(
      '//li[contains(@class,"px-4 py-2 text-sm cursor-pointer transition")]',
    );
    const editTeam = page.locator('//button[normalize-space()="Edit"]');
    const deleteTeam = page.locator('//button[normalize-space()="Delete"]');
    const pipelines = page.locator('(//li[normalize-space()="Pipelines"])[2]');
    const addPipelineButton = page.locator(
      '//button[normalize-space()="Add pipeline"]',
    );
    const EditPipeline = page.locator('(//button[@title="Rename pipeline"])');
    const DeletePipeline = page.locator('(//button[@title="Delete pipeline"])');
    const associateWithTeam = page.locator(
      '(//div[@class="flex shrink-0 items-center gap-3"])[1]',
    );
    const selectTeam = page.locator(
      '(//div[@style="max-height: 260px; overflow-y: auto;"]//button)[1]',
    );
    const selectTeamMember = page.locator(
      '(//div[@style="max-height: 240px; overflow-y: auto;"]//button)[1]',
    );
    const AssociateTeam = page.locator(
      '//button[normalize-space()="Associate"]',
    );
    const click3DotButton = page.locator(
      '(//div[@style="position: relative;"])[1]',
    );
    const ReplaceTeam = page.locator(
      '//button[normalize-space()="Replace Team"]',
    );
    const RemoveTeam = page.locator(
      '//button[normalize-space()="Remove Team"]',
    );
    const clonePipelineButton = page.locator(
      '//button[normalize-space()="Clone Pipeline"]',
    );
    const selectaproject = page.locator(
      '//button[contains(@class,"flex w-full items-center")]',
    );
    const savePipelin = page.locator(
      '//button[normalize-space()="Save Pipeline"]',
    );

    return {
      phoneNumberField,
      passwordField,
      signButton,
      invalidErrorMsg,
      blankErrorMsg,
      forgotPinLink,
      profileButton,
      signOutButton,
      navigateLeadsButton,
      unverifiedLead,
      unverifiedLeadList,
      verifiedThreeDotButton,
      unverifiedThreeDotButton,
      moveToSpamList,
      moveToVerifiedList,
      SpamList,
      moveToUnVerifiedList,
      contactList,
      contactListScroll,
      callMAnager,
      todayList,
      missedcall,
      callHistory,
      reports,
      sourceReport,
      filterResetButton,
      advanceFilter,
      reportingPeriod,
      numberofDays,
      modifiedAt,
      siteVisitSchedule,
      bookingDate,
      addAllTagCheckbox,
      clickTagfiltercheckbox,
      allSource,
      FilterSearchButton,
      chatView,
      leadCountClick,
      inProgressCountClick,
      pipelineFunnel,
      totalLeads,
      PipelineFilter,
      createdbyLeadOwner,
      pipelineFunnelHeading,
      teamReport,
      teamReportHeading,
      leadCount,
      trendReportHeading,
      trendReport,
      dailyTrends,
      weeklyTrends,
      monthyTrends,
      quarterlyTrends,
      yeralyTrends,
      statusReport,
      dailyStatus,
      weeklyStatus,
      monthyStatus,
      quarterlyStatus,
      yeralyStatus,
      statusReportHeading,
      totalCount,
      noLeadFound,
      noDataFound,
      clcikCloseButton,
      createNewlead,
      ledaSourceField,
      selectItemField,
      otherSourceField,
      subSourceField,
      enterSourceName,
      saveOtherSourceName,
      firstNameField,
      lastNameField,
      emailAddressField,
      mobilNumberField,
      enquiryDatePicker,
      textArea,
      newLeadSaveButton,
      leadVerification,
      navigateLeadID,
      editLeadDetailsField,
      editLedaSourceField,
      editSelectItemField,
      editFirstNameField,
      editLastNameField,
      editEnquiryDatePicker,
      clickSaveButton,
      bookAUnitButton,
      bookingButton,
      SelectUnitRadioBuuton,
      SelectUnit,
      book1Unit,
      bookingAmountButton,
      paymentdate,
      confirmBookingButton,
      addSiteVistButton,
      pipelineDropDownButton,
      SwitchPipelineDropDown,
      siteVisitDate,
      siteVisitTime,
      visitType,
      SelectVisitType,
      status,
      selectStatus,
      siteVistNote,
      SitevisitsaveButton,
      enableRemnder,
      reminderDate,
      remindertime,
      siteVisitEditButton,
      siteVisitDeleteButton,
      confirmDeleteBUtton,
      clickSiteVisitScheduleButton,
      linkContactButton,
      createContactButton,
      FirstName,
      LastName,
      contactemail,
      phoneNumber,
      saveContactButton,
      leadAssignedTo,
      AssignedStaff,
      clickLeadCurrenStatusField,
      selectLeadCurrentStatusField,
      createPersonalDetails,
      numberOfFamilyMembers,
      selectNumberOfFamilyMembers,
      currentResident,
      selectcurrentResident,
      residentialAddressTextArea,
      selectResidentialAddress,
      addEduWorkspaceAddress,
      addAdressTextArea,
      selectAddress,
      saveButton,
      editDetails,
      editFamilyMembers,
      selectFamilyMembers,
      editCurrentResident,
      chooseurrentResident,
      editresidentialAddressTextArea,
      editResidentialAddress,
      editresidentialAddressTextArea1,
      editResidentialAddress1,
      editsaveButton,
      leadBackButon,
      clickNoteField,
      textAreaField,
      clickReminder,
      datepickerField,
      reminderSaveButton,
      activityVisibilityButton,
      selectActivity,
      submitActivityButton,
      noteSubmitButton,
      time,
      clickTelecallField,
      telecallTextArea,
      edittelecallDatepicker,
      telecallTypeDropDown,
      telecallSubType,
      mobileTypes,
      mobileSubTypes,
      activityVisibility,
      selectActivitysub,
      submitActivity,
      telecallReminderButton,
      telecallDataPickerField,
      reminderDateSubmitButton,
      telecallSaveButton,
      incomingOutgoingDropdown,
      phoneWhatsappOthersDropdown,
      incomingOption,
      outgoingOption,
      phoneOption,
      whatsappOption,
      gmeetOption,
      zoomOption,
      othersOption,
      clickvideocallfield,
      videoCalltextArea,
      editVideocallDatepicker,
      videocallType,
      videocallSubType,
      videcallMobileType,
      videocallMobileSubType,
      videoActivityVisibility,
      videoActivitySubType,
      videoActivitySubmitButton,
      videoReminder,
      videoReminderdateField,
      reminderDateSubmitbutton,
      videocallSaveButton,
      clickMailField,
      mailTextArea,
      editMailDatepicker,
      mailType,
      mailSubType,
      mailActivityVisibility,
      mailActivitySubType,
      mailActivitySubmitButton,
      maillReminderButton,
      mailRemindDatePicker,
      maillReminderSaveButton,
      mailSaveButton,
      clickMessageField,
      messageTextArea,
      editMessageDatepicker,
      messageType,
      messageSubType,
      messageMobileType,
      messageSubMobileType,
      messageActivityVisibility,
      messageActivitySubmitButton,
      messageActivitySubType,
      messageRemindeButton,
      messageReminDate,
      messageSaveButton,
      messageReminderSubmitButton,
      clickDirectMetting,
      directTextArea,
      directActivityVisibility,
      directActivitySubType,
      directActivitySubmitButton,
      directReminderButton,
      directReminDate,
      directReminderSaveButton,
      directReminderSubmitButton,
      clickUpcommingremainder,
      editUpcommingremainder,
      editUpcomeReminderTextArea,
      remineActivityVisibility,
      upremineSelectActivity,
      upremineSubmitButton,
      upremineSaveButton,
      closeUpCommingReminder,
      clickInterstedStock,
      selectInsterestStocks,
      addInterestStock,
      addInterstedStockButton,
      grantSendButton,
      addNewInterestStock,
      interestedStockPopupHeader,
      clickFilterTag,
      projectNameField,
      projectNameTextArea,
      companyNameField,
      companyNametextArea,
      projectLocationField,
      projectLocationTextArea,
      projectCategoryField,
      ProjectSaleType,
      projectCategory,
      projectType,
      projectTypes,
      unitTypeField,
      ownedUnit,
      sharedUnit,
      selectunitType,
      bedRoomField,
      selectBhk,
      facingField,
      selectFacing,
      areaField,
      minimumRange,
      maximumRange,
      priceField,
      minimumPrice,
      maximumPrice,
      AmenitiesField,
      convenienceField,
      environmentField,
      leisureField,
      safetyField,
      sportsField,
      neighbourhoodsField,
      selectNeighbourhoodsField,
      statusField,
      selectstatusField,
      acceptButton,
      pipelineName,
      clickPipelineBucketField,
      failureBucketdropdown,
      selectFailureBucket,
      clickMoveNextPipelineButton,
      clickBackWardMovementButton,
      backwardBucktswitch,
      backwardPipelineName,
      backwardReasonTextArea,
      backwardConfirmButton,
      revertReasonTextArea: backwardReasonTextArea,
      confirmButton: backwardConfirmButton,
      successBucket,
      leadConverted,
      pipelineHistoryfield,
      activityTimelineField,
      scrollToBottomOfPipelineHistory,
      addSiteVistButton,
      pipelineDropDownButton,
      SwitchPipelineDropDown,
      siteVisitDate,
      siteVisitTime,
      visitType,
      SelectVisitType,
      status,
      selectStatus,
      siteVistNote,
      SitevisitsaveButton,
      enableRemnder,
      reminderDate,
      remindertime,
      siteVisitEditButton,
      siteVisitDeleteButton,
      confirmDeleteBUtton,
      clickSiteVisitScheduleButton,
      linkContactButton,
      FirstName,
      LastName,
      contactemail,
      phoneNumber,
      saveContactButton,

      /*******************************************************       MYSITE PAGE        ***************************************************************** */
      ///dotSiteButton,
      mySiteButton1,
      publishManager,
      publishlog,
      projectSuccessfull,
      mySiteButton1,
      theme,
      GTMTagButton,
      GTMTagEditButton,
      leadConversion,
      GTMTextBox,
      GTMToggleButton,
      GTMSaveButton,
      GTMGoBackButton,

      personalization,
      editButtonPersonalization,
      selectThemes,
      previewpersonalization,
      previewBackButton,
      savePersonalization,
      saveandPublishbuttonPersonalization,
      goBackSuccessfull,
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
      saveAndPublishHeader,
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
      saveAndPublishFooter,
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
      saveAndPublishSocial,
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
      logoReplaceButton,
      logoUploadButton,
      saveLogoButton,
      saveAndPublishlogo,
      faviconImageUpload,
      faviconSubmitButton,
      logoImageUpload,
      logoCircleButton,
      logoSqureButton,
      logoRectangleButton,
      logoSubmitButton,
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
      previewHomeBanner,
      previewBannerBackButton,
      saveHomeBannerButton,
      saveAndPublishHomeBanner,
      deleteBannerCheckBox,
      homeBannerDeletButton,
      limitExeed,
      homeFilter,
      editHomeFilter,
      showOnWebStoreButon,
      previewHomeFilter,
      previewfilterBackButton,
      saveHomeFilter,
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
      collectionButton,
      editCollection,
      collectinToggleButton,
      collectionUnpin,
      previewCollection,
      previewCollectionBackButton,
      saveCollection,
      aboutUsButton,
      editAboutUs,
      aboutUsToggleButton,
      aboutUploadButton,
      aboutUsImgUpload,
      aboutUsDiscription,
      saveAboutUs,
      previewAboutUs,
      previewAboutUsBackButton,
      aboutusSubmitButton,
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
      defaultCollectionButton,
      editDefaultCollection,
      defaultCollectionToggleButton,
      backroundImageUpload,
      backroundImageButton,
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
      previewTestimoials,
      previewTestimoialsBackButton,
      saveTestimoials,
      deleteTestimonialsButton,
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
      storeButton,
      editStoreButton,
      storeImgaddFiles,
      storeBannerImguploadButton,
      storeImgSubmitButton,
      ImageLimit,
      previewStoreBanner,
      previewStoreBannerBackButton,
      saveStoreBanner,
      storeCardStyle,
      editCardStyle,
      verticalStyle,
      horizantalStyle,
      saveCardStyle,
      onBoardPartnerButton,
      editOnBoardPartner,
      onBoardPartnerToggleButton,
      buttonLabelName,
      partnerTypeBroker,
      partnerTypeBuilder,
      partnerTittle,
      partnerMessage,
      previewOnBoardPartne,
      previewOnBoardPartneBackButton,
      saveOnBoardPartne,
      saveAndPublishOnBoardPartne,

      contactUsButton,
      contactBanner,
      conatctEditButton,
      conatctTitle,
      contactSubTitle,
      contactDescription,
      contactImageUploadButton,
      imageUpload,
      contactPreview,
      contactpreviewBackButton,
      contactSaveButton,
      contentsection,
      contentEditButton,
      contentToggleButton,
      contentTitle,
      contentSubTitle,
      contentDescription,
      contentimageUploadButton,
      contentImageUpload,
      contentBacroundImage,
      backroundImageUploadButton,
      callToAction,
      ButtonTextBox,
      contentPreview,
      contentpreviewBackButton,
      contentSaveButton,
      overAllPublishButton,

      /***********************************   PARTNERS PAGE *************************************************** */
      stockbutton,
      checkbox,
      textBox,
      selectCompany,
      addMessageBox,
      acceptGrantButon,
      acceptConnection,
      comapanyName,
      grantAcceptButton,
      GrantButton,
      grantBackButton,
      myconnections,
      mobileNumbers,
      searchButton,
      connectCompany,
      GainorGrantButton,
      textarea,
      addFileButton,
      AddImage,
      addAudio,
      addVideo,
      addDocument,
      sentButton,
      BackButton,
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
      threadCancelButton,
      downloadPartners,
      detailsButton,
      threeDotButton,
      disconnectPartners,
      disConectYes,
      partnerFilter,
      types,

      /*************************************** ACCOUNT SETTINGS ****************************************/
      accountSettings,
      companyDetailsEditButton,
      companyName,
      companyType,
      companyTypeSelect,
      wesiteNameDropdown,
      webSiteNameTextBox,
      companyAddressTextBox,
      selectCompanyAddress,
      adressLineOne,
      adressLineTwo,
      adressLineThree,
      CountryTextBox,
      stateTextBox,
      cityTextBox,
      pincodeTextBox,
      secondaryContactNumber,
      secondaryEmail,
      comapnyDetailsSaveButton,

      /******************* KYC DETAILS**************** */
      kycDetails,
      kycDetailsEditButton,
      cinNumberTextBox,
      gstNumberTextBox,
      panNumberTextBox,
      companyPanNo,
      companyAadharNo,
      cinNumberUploadbutton,
      gstNumberUploadbutton,
      panNumberUploadbutton,
      kycDetailsSaveButton,

      /**************************** SEO DETAILS ************/
      seoDeatilsButton,
      seoDetailsEditButton,
      metaTitle,
      metaKeyword,
      metaDescription,
      metaImageUpload,
      deleteMetaImage,
      deleteButton,
      seoDetailsSaveButton,

      /*************************************STAFF MANAGEMENT *************** */
      StaffManagement,
      addStaffButton,
      addstaffMember,
      staffFirstName,
      staffLasttName,
      staffMobileNumber,
      staffEmailAddress,
      staffAgentNumber,
      staffRole,
      selectStaffRole,
      CreateStaffButton,
      goBackButton,
      Edit3DotStaffButton,
      EditStaffButton,
      deleteStaffButton,
      resendInviteButton,
      editstaffSubmitButton,
      PrivilegesEnabledButton,
      editToggleButton,

      /************************************SOURCE  *************************************** */
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

      /******************************************LEAD SETTINGS **************************** */
      leadSettings,
      leadAutoAssignmentToggle,
      pipelineTransitionToggle,
      backwardPipelineMovement,
      leadReEngagement,
      resetLeadOnReEngagement,
      pipelineGuide,
      teams,
      createTeam,
      teamName,
      addTeamMembers,
      SearchEmployee,
      selectEmployee,
      StaffAddButton,
      assignTeamLead,
      selectTeamLead,
      editTeam,
      deleteTeam,
      pipelines,
      addPipelineButton,
      EditPipeline,
      DeletePipeline,
      associateWithTeam,
      selectTeam,
      selectTeamMember,
      AssociateTeam,
      click3DotButton,
      ReplaceTeam,
      RemoveTeam,
      clonePipelineButton,
      selectaproject,
      savePipelin,
      bookAUnitButton,
      SelectUnitRadioBuuton,
      bookingButton,
      SelectUnit,
      book1Unit,
      bookingAmountButton,
      paymentdate,
      confirmBookingButton,

      /**************************************** Upload CSV File ***************************/
      uploadCsvFileButton,
      uploadLeadButton,
      uploadContactButton,
      fileUploadButton,
      doyouwantCrmCheckBox,
      deletCsvFileBUtton,
      clickUploadButton,
      csvScetion,
      checkTheStatusCompleted,
      checkTheErrorStaus,
      importLeadClick,
      totalRecords,
      cancelUploadButton,
      selectedFileName,

      /***********  Source Report Elements  ************/
      sourceReportHeading,
      // Chart View
      chartViewBtn,
      distributionHeading,
      chartTotalLeadsHeading,
      listViewBtn,
      countEl,
      breakdownH3,

      // Filter Sections & Inputs
      reportingPeriodSection,
      reportingPeriodSelect,
      reportingPeriodDaysInput,
      reportingPeriodFromInput,
      reportingPeriodToInput,
      modifiedAtSection,
      modifiedAtSelect,
      modifiedAtDaysInput,
      modifiedAtFromInput,
      modifiedAtToInput,
      siteVisitSection,
      siteVisitSelect,
      siteVisitDaysInput,
      siteVisitFromInput,
      siteVisitToInput,
      bookingDateSection,
      bookingDateSelect,
      bookingDateDaysInput,
      bookingDateFromInput,
      bookingDateToInput,
      tagsSection,
      allTagsBtn,
      sourceSection,
      allSourcesBtn,
      teamFilterSection,
      teamFilter,

      // Table & Empty State
      spinner,
      noDataLocator,
      table,
      reportTableRows,
      reportSourceName,
      reportCountButton,

      // Popup & Drawer
      popupContainer,
      dialog,
      modal,
      allLeadsLoadedEl,
      popupLeadRows,
      popupRows,
      rows,
      items,
      noLeads,
      popupTotalText,
      totalPatterns,
      popupNextPageButton,
      nextSelectors,
      popupPrevPageButton,
      popupCloseButton,
      fallbackSelectors,
      popupNoLeadsMessage,
    };
  }
}

module.exports = { WebElement };
