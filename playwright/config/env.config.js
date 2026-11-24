/**
 * env.config.js
 * Central environment configuration for the Realiti UI automation framework.
 * Usage: const { ENVS, ENV_INDEX } = require('../../config/env.config');
 *        await page.goto(ENVS[ENV_INDEX].stockUrl);
 */

const ENVS = [
  {
    name: "dev",
    baseUrl: "https://devin.realiti.tech",
    apiUrl: "https://devapi-office.realiti.tech",
    url: "https://devin.realiti.tech/lead",
    leadUrl: "https://devin.realiti.tech/lead",
    stockUrl: "https://devin.realiti.tech/stocks/units",
    mySiteUrl: "https://devin.realiti.tech/mysite",
    partnersUrl: "https://devin.realiti.tech/stocks/units/",
    authUrl: "https://devin.realiti.tech/",
    accountSettingsUrl: "https://devin.realiti.tech/settings",
    settingsUrl: "https://devin.realiti.tech/settings",
    leadSettingsUrl: "https://devin.realiti.tech/settings",
    cookieDomain: ".realiti.tech",
    phone: "7863693330",
    pin: "RI1234",
    
  },
  {
    name: "stage",
    baseUrl: "https://stageapp.realitiindia.com",
    apiUrl: "https://stageapi.realitiindia.com",
    url: "https://stageapp.realitiindia.com/lead",
    leadUrl: "https://stageapp.realitiindia.com/lead",
    stockUrl: "https://stageapp.realitiindia.com/stocks/units",
    mySiteUrl: "https://stageapp.realitiindia.com/mysite",
    partnersUrl: "https://stageapp.realitiindia.com/stocks/units",
    authUrl: "https://stageapp.realitiindia.com/",
    accountSettingsUrl: "https://stageapp.realitiindia.com/settings",
    settingsUrl: "https://stageapp.realitiindia.com/settings",
    cookieDomain: ".realitiindia.com",
    phone: "9990000001",
    pin: "RI1234",
    sessionId: "-8047261516509339615",
  },
  {
    name: "prod",
    baseUrl: "https://app.realiti.io",
    apiUrl: "https://api.realiti.io",
    url: "https://app.realiti.io/lead",
    leadUrl: "https://app.realiti.io/lead",
    stockUrl: "https://app.realiti.io/stocks/units",
    mySiteUrl: "https://app.realiti.io/mysite",
    partnersUrl: "https://app.realiti.io/stocks/units",
    authUrl: "https://app.realiti.io/",
    accountSettingsUrl: "https://app.realiti.io/settings",
    settingsUrl: "https://app.realiti.io/settings",
    cookieDomain: ".realiti.io",
    phone: "7760279160",
    pin: "no1234",
    sessionId: "-9074750668004325857",
  },
];

// Default environment index:
// 0 = dev (devin.realiti.tech)
// 1 = stage (stageapp.realitiindia.com)
// 2 = prod (app.realiti.io)
// Always use dev for test development to avoid affecting production data
const ENV_INDEX = 0;

/**
 * Validates that the environment configurations and active selection have all required fields at startup.
 * Throws an explicit error if any configuration parameters are missing, invalid, or out-of-bounds.
 * This early fail-fast validation prevents cryptic runtime failures during test execution due to
 * missing credentials, invalid URLs, or incorrect environment indexing.
 *
 * @param {Array<Object>} envs - The array of environment configuration objects.
 * @param {number} activeIndex - The index of the currently active environment to validate.
 * @throws {Error} If configuration array is empty/invalid, index is out-of-bounds, or any environment lacks mandatory keys.
 */
function validateEnvConfig(envs, activeIndex) {
  // 1. Array validation: Ensure ENVS is properly defined as a populated array.
  // This guards against accidental empty configs or uninitialized exports.
  if (!Array.isArray(envs) || envs.length === 0) {
    throw new Error("[env.config] Invalid configuration: ENVS must be a non-empty array.");
  }

  // 2. Active index bounds validation: Ensure activeIndex targets an existing environment entry.
  // Prevents undefined dereferencing when accessing ENVS[ENV_INDEX] across tests and helpers.
  if (typeof activeIndex !== "number" || !Number.isInteger(activeIndex) || activeIndex < 0 || activeIndex >= envs.length) {
    throw new Error(
      `[env.config] Invalid ENV_INDEX: ${activeIndex}. Must be an integer between 0 and ${envs.length - 1}.`
    );
  }

  // 3. Required schema validation: Verify critical endpoints and credentials exist for each environment:
  // - name: Used for environment identification, test reporting, and conditional logic.
  // - baseUrl: Root origin used for constructing navigation URLs and endpoints.
  // - url: Default entry landing page for lead workflows.
  // - phone & pin: User credentials required for API authentication and session token generation.
  const requiredFields = ["name", "baseUrl", "url", "phone", "pin"];
  envs.forEach((env, index) => {
    for (const field of requiredFields) {
      if (!env[field]) {
        throw new Error(
          `[env.config] Environment at index ${index} (${env.name || "unnamed"}) is missing required field: "${field}"`
        );
      }
    }
  });
}

// Run validation at startup
validateEnvConfig(ENVS, ENV_INDEX);

/**
 * Creates an authenticated Playwright Page using the environment configuration.
 * Handles API login, session cookie setup, and browser context creation automatically.
 *
 * @param {import('@playwright/test').Browser} browser
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {number} [envIdx] Optional environment index override (defaults to ENV_INDEX)
 * @returns {Promise<import('@playwright/test').Page>}
 */
async function createAuthenticatedPage(browser, request, envIdx = ENV_INDEX) {
  const { ApiUtils } = require("../utils/ApiUtils");
  const env = ENVS[envIdx];
  let sessionToken = env.sessionId;

  try {
    const apiUtils = new ApiUtils();
    const loginReturn = await apiUtils.loginReturn(
      request,
      env.phone,
      env.pin,
      env.apiUrl || env.baseUrl,
    );
    if (loginReturn && loginReturn.session) {
      sessionToken = loginReturn.session;
    }
  } catch (err) {
    if (env.sessionId) {
      console.warn(
        `[Auth] API login for ${env.name} did not return session (${err.message}). Using configured sessionId token.`,
      );
    } else {
      console.error(`[Auth] Login failed for ${env.name}:`, err.message);
      throw err;
    }
  }

  const storageContext = await browser.newContext({
    storageState: {
      cookies: [
        {
          name: "ri_s_id",
          value: `${sessionToken}`,
          domain: env.cookieDomain,
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "None",
        },
      ],
    },
  });

  return await storageContext.newPage();
}

module.exports = {
  ENVS,
  ENV_INDEX,
  currentEnv: ENVS[ENV_INDEX],
  CURRENT_ENV: ENVS[ENV_INDEX],
  createAuthenticatedPage,
  validateEnvConfig,
};
