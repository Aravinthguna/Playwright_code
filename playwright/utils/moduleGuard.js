const { test } = require("@playwright/test");
const config = require("../modules.config.json");

/**
 * Call this INSIDE a test.describe() block to skip the entire module
 * when `enabled: false` in modules.config.json.
 *
 * Usage (inside describe):
 *   skipIfDisabled('login')
 *
 * @param {string} moduleKey - Top-level key in modules.config.json
 */
function skipIfDisabled(moduleKey) {
  const moduleConfig = config[moduleKey];

  if (moduleConfig === undefined) {
    console.warn(
      `[moduleGuard] Warning: key "${moduleKey}" not found in modules.config.json. ` +
        `Tests will run by default.`
    );
    return;
  }

  // Support both flat boolean (legacy) and nested object { enabled: bool, ... }
  const isEnabled =
    typeof moduleConfig === "object"
      ? moduleConfig.enabled !== false
      : !!moduleConfig;

  if (!isEnabled) {
    test.skip(true, `Module "${moduleKey}" is disabled in modules.config.json`);
  }
}

/**
 * Call this as the FIRST LINE inside a test() body to skip that specific
 * test case when its flag is false in modules.config.json.
 *
 * Usage (inside test body):
 *   skipTestIfDisabled('login', 'LG0001')
 *
 * @param {string} moduleKey - Top-level key in modules.config.json
 * @param {string} testKey   - The per-test key inside that module's config object
 */
function skipTestIfDisabled(moduleKey, testKey) {
  const moduleConfig = config[moduleKey];

  if (!moduleConfig || typeof moduleConfig !== "object") {
    return; // nothing to check (flat boolean handled by skipIfDisabled)
  }

  if (moduleConfig[testKey] === undefined) {
    console.warn(
      `[moduleGuard] Warning: test key "${testKey}" not found under "${moduleKey}" ` +
        `in modules.config.json. Test will run by default.`
    );
    return;
  }

  if (moduleConfig[testKey] === false) {
    test.skip(
      true,
      `Test "${testKey}" in module "${moduleKey}" is disabled in modules.config.json`
    );
  }
}

module.exports = { skipIfDisabled, skipTestIfDisabled };
