# Realiti UI Playwright Automation

A simple, fast, and reliable end-to-end test automation framework for the **Realiti CRM and Real Estate Platform** ([Realiti.io](https://app.realiti.io) / [Realiti.tech](https://devin.realiti.tech)), built with [Playwright](https://playwright.dev/).

---

## 1. Project Overview

This project automates UI workflows and data validations across the Realiti web application. Tests run on Chromium and use an accelerated API login to create authenticated browser sessions instantly.

### Modules Covered
- **Authentication:** Valid/invalid logins, passpin rules, OTP verification, forgot password, and sign-out.
- **Lead Management:** Create and edit leads, assign staff, update statuses, schedule site visits, and log activities (calls, notes, emails, SMS).
- **CRM Views:** Manage Unverified Leads, Spam List, Contact List, and Call Manager dialer logs.
- **Pipeline Funnel:** Move leads through pipeline bucket stages, test failure buckets, backward movement reverts, and final deal conversion.
- **Analytics & Reports:** Automated count reconciliation for **Source Reports** (filters, drawer drill-down, SVG donut charts) and **Pipeline Funnel Reports**.
- **Bulk CSV Upload:** Automated upload testing with dynamic, collision-free lead data generation (valid leads, multiple batches, duplicate detection, and format errors).
- **Stock / Inventory:** Creation and publishing of primary properties (Apartments, Villas, Row Houses, Plots) and secondary properties (Resale & Rental Flats, Houses, Plots).
- **MySite Builder:** Microsite branding, theme personalization, home page sections, store cards, and contact form publishing.
- **Channel Partners:** Stock grant workflows and partner account switching.

---

## 2. Installation and Setup

### Prerequisites
- **Node.js:** `v18.0.0` or higher (`v20` / `v22` LTS recommended; tested on `v22.22.1`)
- **npm:** `v9.0.0` or higher (tested on `9.2.0`)
- **OS:** Linux (Ubuntu), macOS, or Windows

### Step-by-Step Setup

1. **Open the project directory:**
   ```bash
   cd "/home/aravinth-guna/Documents/Playwright Atuomation/ui_playwright"
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Install the Playwright browser:**
   ```bash
   npx playwright install chromium

   # On Linux/Ubuntu, if system libraries are missing, run:
   npx playwright install-deps chromium
   ```

4. **Environment Configuration:**
   - **Target Environment:** Open `playwright/config/env.config.js` and set `ENV_INDEX`:
     - `0`: `dev` (`https://devin.realiti.tech`) — *Default*
     - `1`: `stage` (`https://stageapp.realitiindia.com`)
     - `2`: `prod` (`https://app.realiti.io`)
   - **Credentials (`.env`):** Create or update a `.env` file in the root directory:
     ```ini
     BASE_URL=https://devin.realiti.tech/
     MOBILE_NUMBER=6660000010
     PASSWORD=RI1234
     BUSINESS_NAME=Allwin
     ```

---

## 3. Project Folder Structure

```text
ui_playwright/
├── playwright.config.js            # Main Playwright test runner configuration
├── package.json                    # Project dependencies and metadata
├── README.md                       # Project documentation
│
├── playwright/                     # Core automation source code
│   ├── config/
│   │   └── env.config.js           # Environment URLs, credentials, and API auth session setup
│   ├── modules.config.json         # Feature flags to enable/disable specific modules or tests
│   │
│   ├── tests/                      # Test specification files (*.spec.js)
│   │   ├── auth/                   # Login and authentication tests
│   │   ├── lead/                   # Lead CRUD, activities, pipeline, reports, CSV upload tests
│   │   ├── stock/                  # Real estate inventory and unit creation tests
│   │   ├── mysite/                 # Microsite CMS builder tests
│   │   └── partners/               # Channel partner and account switching tests
│   │
│   ├── modules/                    # Page Object Model (POM) action classes
│   │   ├── auth/pages/             # Login page methods
│   │   ├── lead/pages/             # Lead management, pipeline, and report page methods
│   │   │   ├── helpers/            # Report filter, table, popup, and chart helpers
│   │   │   └── scenarios/          # Filter matrices and scenario runners for reports
│   │   ├── stock/pages/            # Stock, unit, gallery, amenities, and SEO methods
│   │   ├── mysite/pages/           # MySite theme, home, store, and contact methods
│   │   └── partners/pages/         # Stock grant and partner switch methods
│   │
│   ├── utils/                      # Reusable framework utilities
│   │   ├── WebElements.js          # Centralized UI locators (Leads, Reports, Pipelines)
│   │   ├── GuiWebElements.js       # Centralized UI locators (Login, Stock)
│   │   ├── ApiUtils.js             # API login and session token injection
│   │   ├── RandomDataUtils.js      # Random names, emails, and phone generators
│   │   ├── DateUtils.js            # Dynamic past/future date and time generators
│   │   ├── csvGenerator.js         # RFC 4180 CSV generator with duplicate registry
│   │   └── moduleGuard.js          # Skips tests based on modules.config.json
│   │
│   └── resources/                  # Test data and media assets
│       ├── leads_sample.csv        # Sample lead CSV file
│       ├── .persisted_leads_registry.json # Tracks used phones/emails to avoid CRM duplicates
│       ├── documents/Brochure.pdf  # Sample PDF for document upload tests
│       └── images/, video/, audio/ # Mock media files for gallery and stock uploads
│
├── playwright-report/              # Auto-generated HTML execution reports
└── test-results/                   # Screenshots, videos, and traces from failed tests
```

### Where to Add New Code
- **New Test Script:** Add to `playwright/tests/<module>/<testName>.spec.js`.
- **New Page Actions:** Add to `playwright/modules/<module>/pages/<PageName>.js`.
- **New Element Locators:** Add to `playwright/utils/WebElements.js` or `GuiWebElements.js`.
- **New Test Helpers / Data:** Add to `playwright/modules/<module>/pages/helpers/` or `playwright/utils/`.

---

## 4. Run Commands

All commands can be executed directly from the project root (`ui_playwright/`).

| Purpose | Command | Notes / Example |
|---|---|---|
| **Run all tests** | `npx playwright test` | Runs all 49 tests across 6 files |
| **Run a specific test file** | `npx playwright test <path>` | `npx playwright test playwright/tests/lead/leadListPage.spec.js` |
| **Run Source Report** | `npx playwright test -g "Source Report"` | Runs Source Report filter and chart validations |
| **Run Pipeline Funnel Report** | `npx playwright test -g "Pipeline Funnel Report"` | Runs Funnel conversion audit scenarios |
| **Run by test title or ID** | `npx playwright test -g "<pattern>"` | `npx playwright test -g "LG0001"` or `-g "Create Lead"` |
| **Run in headed mode** | `npx playwright test --headed` | Shows the browser window while running |
| **Run in headless mode** | `npx playwright test --headless` | Runs silently in the background (default in CI) |
| **Run in debug mode** | `npx playwright test --debug` | Opens the interactive Playwright Inspector |
| **Run on specific browser** | `npx playwright test --project=chromium` | Runs tests using the Chromium configuration |
| **Run sequentially (1 worker)** | `npx playwright test --workers=1` | Recommended default to prevent CRM data conflicts |
| **Re-run failed tests only** | `npx playwright test --last-failed` | Re-runs only tests that failed in the previous run |
| **View HTML test report** | `npx playwright show-report` | Opens the latest HTML test report in your browser |
| **Inspect a failure trace** | `npx playwright show-trace <trace.zip>` | `npx playwright show-trace test-results/.../trace.zip` |

### Submodule npm Scripts
If you are inside the `playwright/` folder (`cd playwright`), you can also use these shortcuts:
```bash
npm run test           # Run all tests
npm run test:lead      # Run leadListPage.spec.js
npm run test:source    # Run Source Report only
npm run test:pipeline  # Run Pipeline Funnel Report only
```

### Enabling and Disabling Tests
- **Via Config:** Open `playwright/modules.config.json` and set any module or test flag to `false`. The test will be automatically skipped.
- **Via Spec File:** In `leadListPage.spec.js` and `createStock.spec.js`, toggle individual boolean variables at the top of the file (e.g. `const editLeadDetailsEnabled = false;`).

---

## 5. Test File Locations

| Module | Test File Path | Key Scenarios Covered | Run Command |
|---|---|---|---|
| **Authentication** | `playwright/tests/auth/loginPage.spec.js` | 15 tests (LG0001–LG0015): Valid login, invalid credentials, boundary lengths, forgot pin, OTP, sign-out | `npx playwright test playwright/tests/auth/loginPage.spec.js` |
| **Valid Login Smoke** | `playwright/tests/auth/validLogin.spec.js` | Quick UI login smoke verification | `npx playwright test playwright/tests/auth/validLogin.spec.js` |
| **Lead Management** | `playwright/tests/lead/leadListPage.spec.js` | Create/edit lead, staff assign, status change, site visits, linked contacts, and contact creation | `npx playwright test playwright/tests/lead/leadListPage.spec.js -g "Create Lead\|Edit Lead"` |
| **Lead Activities** | `playwright/tests/lead/leadListPage.spec.js` | Add notes, telephone call logs, video call logs, emails, SMS, and interested property tagging | `npx playwright test playwright/tests/lead/leadListPage.spec.js -g "Lead Activity"` |
| **Pipeline Lifecycle** | `playwright/tests/lead/leadListPage.spec.js` | Traverse stages, bucket iteration, failure buckets, backward movement revert, and conversion | `npx playwright test playwright/tests/lead/leadListPage.spec.js -g "pipelinePage"` |
| **CRM Sub-Views** | `playwright/tests/lead/leadListPage.spec.js` | Unverified Leads, Spam List (restore/discard), Contact List table, and Call Manager dialer logs | `npx playwright test playwright/tests/lead/leadListPage.spec.js -g "Unverified\|Spam\|Contact List\|Call Manager"` |
| **Source Report** | `playwright/tests/lead/leadListPage.spec.js` | Filter combinations (Today, Quarters Q1–Q4, All, Custom), drawer infinite scroll, SVG donut chart count audit | `npx playwright test playwright/tests/lead/leadListPage.spec.js -g "Source Report"` |
| **Pipeline Funnel Report** | `playwright/tests/lead/leadListPage.spec.js` | Conversion rates by manager, stage breakdown, and drawer lead verification | `npx playwright test playwright/tests/lead/leadListPage.spec.js -g "Pipeline Funnel Report"` |
| **Bulk Lead CSV Upload** | `playwright/tests/lead/leadListPage.spec.js` | Single lead, multiple leads, sequential batches, CRM toggle, and negative format validations | `npx playwright test playwright/tests/lead/leadListPage.spec.js -g "Upload CSV"` |
| **Inventory / Stock** | `playwright/tests/stock/createStock.spec.js` | Primary developments (Apartment, Villa, Row House, Plot) and Secondary properties (Resale & Rental) | `npx playwright test playwright/tests/stock/createStock.spec.js` |
| **MySite CMS Builder** | `playwright/tests/mysite/mysitePage.spec.js` | Website info, theme customization, home page modules, store cards, partners, and contact publishing | `npx playwright test playwright/tests/mysite/mysitePage.spec.js` |
| **Channel Partners** | `playwright/tests/partners/partnersPage.spec.js` | Stock Grant to partners and multi-tenant account switching with media attachments | `npx playwright test playwright/tests/partners/partnersPage.spec.js` |

---

## 6. Troubleshooting

| Common Error | Cause | Quick Solution |
|---|---|---|
| `SyntaxError: Missing initializer in const declaration` | A variable declared with `const` was not assigned an initial value. | Ensure every `const` has a value (e.g., `const x = ...;`). Use `let` if the value is assigned later. |
| `strict mode violation: locator(...) resolved to X elements` | A locator matched more than one element on the page. | Use `.first()`, `.nth(index)`, or make the locator more specific in `playwright/utils/WebElements.js`. |
| `TimeoutError: page.waitForLoadState: Timeout 30000ms exceeded` | Slow network or background analytics prevented `networkidle` state. | Wait for a specific UI element instead: `await locator.waitFor({ state: 'visible' })`. |
| `Login API failed (401 Unauthorized)` | Invalid login credentials or expired session token in `env.config.js`. | Check the phone number and pin in `playwright/config/env.config.js` for the active `ENV_INDEX`. |
| `browserType.launch: Executable doesn't exist` | Playwright browser binaries are not installed. | Run `npx playwright install chromium` (and `npx playwright install-deps chromium` on Linux). |
| `CRM Error: Phone number / Email already exists` | Duplicate data rejected by the CRM. | Use `RandomDataUtils.js` or `csvGenerator.js`, which automatically check `.persisted_leads_registry.json` for unique values. |
| `Port 9323 is already in use` | A previous report server is still running. | Run `npx playwright show-report --port=9325` to use an alternate port. |

---

## 7. Quick Tips for Team Members

- **Before Pushing Code:** Always run `npx playwright test --list` to check for syntax errors, and run your specific test in headed mode:
  ```bash
  npx playwright test <your-test-file>.spec.js --headed
  ```
- **Git Conventions:** Work on branches named `feature/<name>` branched from `develop`. Use commit messages describing your change:
  ```text
  feature description || YourName
  ```
- **Security Reminder:** Never commit `.env` files, passwords, or personal credentials to git.
