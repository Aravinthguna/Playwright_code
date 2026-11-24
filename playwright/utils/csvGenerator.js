const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Persisted registry file to prevent duplicate identifiers across repeated test runs
const PERSISTED_REGISTRY_PATH = path.resolve(
  __dirname,
  '../resources/.persisted_leads_registry.json'
);

const DEFAULT_RESOURCES_DIR = path.resolve(__dirname, '../resources');
const GENERATED_DIR = path.resolve(__dirname, '../resources/generated');

// CSV Headers exactly as required by the application
const CSV_HEADERS = ['First Name', 'last Name', 'mobilenumber', 'CountryCode', 'email'];

const FIRST_NAMES = [
  'Arun', 'Priya', 'Rohan', 'Sneha', 'Vikram', 'Neha', 'Aditya', 'Anjali',
  'Karan', 'Pooja', 'Rahul', 'Divya', 'Suresh', 'Kavita', 'Manish', 'Ritu',
  'Deepak', 'Swati', 'Rajesh', 'Shweta', 'Amit', 'Megha', 'Vijay', 'Sunita'
];

const LAST_NAMES = [
  'Kumar', 'Sharma', 'Patel', 'Verma', 'Singh', 'Gupta', 'Mehta', 'Joshi',
  'Reddy', 'Nair', 'Iyer', 'Rao', 'Das', 'Sen', 'Choudhury', 'Pillai',
  'Bose', 'Bhat', 'Deshmukh', 'Kulkarni', 'Mishra', 'Pandey', 'Saxena', 'Kapoor'
];

/**
 * Loads the persisted registry of used mobile numbers and emails.
 */
function loadRegistry() {
  try {
    if (fs.existsSync(PERSISTED_REGISTRY_PATH)) {
      const raw = fs.readFileSync(PERSISTED_REGISTRY_PATH, 'utf-8');
      const data = JSON.parse(raw);
      return {
        mobiles: new Set(data.mobiles || []),
        emails: new Set(data.emails || []),
      };
    }
  } catch (err) {
    console.warn('[csvGenerator] Warning loading persisted registry:', err.message);
  }
  return { mobiles: new Set(), emails: new Set() };
}

/**
 * Saves used mobile numbers and emails to the persisted registry.
 */
function saveRegistry(registry) {
  try {
    if (!fs.existsSync(DEFAULT_RESOURCES_DIR)) {
      fs.mkdirSync(DEFAULT_RESOURCES_DIR, { recursive: true });
    }
    const data = {
      mobiles: Array.from(registry.mobiles),
      emails: Array.from(registry.emails),
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(PERSISTED_REGISTRY_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[csvGenerator] Warning saving persisted registry:', err.message);
  }
}

/**
 * Validates 10-digit Indian mobile number format (must start with 6, 7, 8, or 9).
 */
function isValidMobile(mobile) {
  return typeof mobile === 'string' && /^[6-9]\d{9}$/.test(mobile);
}

/**
 * Validates standard email address format.
 */
function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Generates a collision-checked, unique 10-digit mobile number starting with 9, 8, 7, or 6.
 * Checks against both in-memory batch and persisted registry.
 */
function generateUniqueMobile(registry, inBatchMobiles) {
  const prefixes = ['9', '8', '7', '6'];
  let attempts = 0;
  const maxAttempts = 10000;

  while (attempts < maxAttempts) {
    attempts++;
    // Use worker/process entropy + random digits to avoid collisions in parallel runs
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    // Generate remaining 9 digits
    const randomSuffix = Math.floor(100000000 + Math.random() * 900000000).toString();
    const candidate = `${prefix}${randomSuffix}`;

    if (!registry.mobiles.has(candidate) && !inBatchMobiles.has(candidate)) {
      registry.mobiles.add(candidate);
      inBatchMobiles.add(candidate);
      return candidate;
    }
  }

  // Fallback timestamp-based mobile if collision space gets tight
  const tsSuffix = (Date.now() % 1000000000).toString().padStart(9, '0');
  const fallback = `9${tsSuffix}`;
  registry.mobiles.add(fallback);
  inBatchMobiles.add(fallback);
  return fallback;
}

/**
 * Generates a collision-checked, unique email using name and random entropy.
 */
function generateUniqueEmail(firstName, lastName, registry, inBatchEmails) {
  let attempts = 0;
  const maxAttempts = 5000;

  while (attempts < maxAttempts) {
    attempts++;
    const uniqueHash = crypto.randomBytes(3).toString('hex');
    const timestampTag = (Date.now() % 100000).toString();
    const candidate = `${firstName.toLowerCase()}.${lastName.toLowerCase()}_${timestampTag}_${uniqueHash}@autotest.realiti.io`;

    if (!registry.emails.has(candidate) && !inBatchEmails.has(candidate)) {
      registry.emails.add(candidate);
      inBatchEmails.add(candidate);
      return candidate;
    }
  }

  const fallback = `lead_${crypto.randomUUID().slice(0, 12)}@autotest.realiti.io`;
  registry.emails.add(fallback);
  inBatchEmails.add(fallback);
  return fallback;
}

/**
 * Escapes a single CSV value according to RFC 4180.
 */
function escapeCsvValue(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates an array of unique lead objects.
 *
 * @param {number} count - Number of leads to generate (default 1)
 * @param {Object} [overrides] - Optional field overrides
 * @returns {Array<{firstName: string, lastName: string, mobilenumber: string, CountryCode: string, email: string}>}
 */
function generateLeadRecords(count = 1, overrides = {}) {
  const registry = loadRegistry();
  const inBatchMobiles = new Set();
  const inBatchEmails = new Set();
  const leads = [];

  for (let i = 0; i < count; i++) {
    const firstName = overrides.firstName || FIRST_NAMES[(i + Math.floor(Math.random() * FIRST_NAMES.length)) % FIRST_NAMES.length];
    const lastName = overrides.lastName || LAST_NAMES[(i + Math.floor(Math.random() * LAST_NAMES.length)) % LAST_NAMES.length];
    const CountryCode = overrides.CountryCode || '91';

    const mobilenumber = overrides.mobilenumber || generateUniqueMobile(registry, inBatchMobiles);
    const email = overrides.email || generateUniqueEmail(firstName, lastName, registry, inBatchEmails);

    leads.push({
      'First Name': firstName,
      'last Name': lastName,
      'mobilenumber': mobilenumber,
      'CountryCode': CountryCode,
      'email': email,
    });
  }

  saveRegistry(registry);
  return leads;
}

/**
 * Writes lead records into a CSV string.
 */
function formatLeadsToCsv(leads, headers = CSV_HEADERS) {
  const headerLine = headers.join(',');
  const rowLines = leads.map((lead) =>
    headers.map((h) => escapeCsvValue(lead[h])).join(',')
  );
  return [headerLine, ...rowLines].join('\n') + '\n';
}

/**
 * Saves lead records into a CSV file.
 *
 * @param {Array<Object>} leads - Array of lead objects
 * @param {string} [fileName] - Optional file name
 * @param {string} [directory] - Optional destination directory
 * @returns {string} Absolute path to generated CSV file
 */
function saveLeadsToCsvFile(leads, fileName, directory = GENERATED_DIR) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const resolvedFileName = fileName || `leads_generated_${Date.now()}_${crypto.randomBytes(3).toString('hex')}.csv`;
  const targetPath = path.isAbsolute(resolvedFileName)
    ? resolvedFileName
    : path.join(directory, resolvedFileName);

  const csvContent = formatLeadsToCsv(leads);
  fs.writeFileSync(targetPath, csvContent, 'utf-8');
  console.log(`[csvGenerator] Generated CSV saved to: ${targetPath} (${leads.length} leads)`);
  return targetPath;
}

/**
 * High-level helper: generates fresh unique leads and writes them to a new CSV file.
 *
 * @param {number} count - Number of leads to generate
 * @param {Object} [options] - Optional settings { fileName, directory, overrides }
 * @returns {{ leads: Array<Object>, filePath: string }}
 */
function generateAndSaveCsv(count = 1, options = {}) {
  const leads = generateLeadRecords(count, options.overrides || {});
  const filePath = saveLeadsToCsvFile(leads, options.fileName, options.directory);
  return { leads, filePath };
}

/**
 * Helper to generate an invalid CSV file for negative test scenarios.
 *
 * @param {'duplicate_in_file' | 'missing_column' | 'invalid_mobile' | 'invalid_email' | 'empty' | 'unsupported_extension'} scenarioType
 * @param {Object} [options]
 * @returns {{ leads: Array<Object>, filePath: string }}
 */
function generateNegativeCsv(scenarioType, options = {}) {
  const dir = options.directory || GENERATED_DIR;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const randomTag = `${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
  let leads = [];
  let filePath = '';
  let content = '';

  switch (scenarioType) {
    case 'empty':
      filePath = path.join(dir, `empty_${randomTag}.csv`);
      fs.writeFileSync(filePath, '', 'utf-8');
      return { leads: [], filePath };

    case 'missing_column': {
      // Header missing 'mobilenumber' column
      const missingHeaders = ['First Name', 'last Name', 'CountryCode', 'email'];
      leads = [
        {
          'First Name': 'TestMissing',
          'last Name': 'Column',
          'CountryCode': '91',
          'email': `test.missing_${randomTag}@example.com`,
        },
      ];
      filePath = path.join(dir, `missing_col_${randomTag}.csv`);
      content = formatLeadsToCsv(leads, missingHeaders);
      fs.writeFileSync(filePath, content, 'utf-8');
      return { leads, filePath };
    }

    case 'invalid_mobile': {
      // Mobile number is invalid (less than 10 digits or non-numeric)
      leads = [
        {
          'First Name': 'Bad',
          'last Name': 'Mobile',
          'mobilenumber': options.invalidMobile || '12345',
          'CountryCode': '91',
          'email': `bad.mobile_${randomTag}@example.com`,
        },
      ];
      filePath = path.join(dir, `invalid_mobile_${randomTag}.csv`);
      fs.writeFileSync(filePath, formatLeadsToCsv(leads), 'utf-8');
      return { leads, filePath };
    }

    case 'invalid_email': {
      // Malformed email missing @ or domain
      leads = [
        {
          'First Name': 'Bad',
          'last Name': 'Email',
          'mobilenumber': generateUniqueMobile(loadRegistry(), new Set()),
          'CountryCode': '91',
          'email': options.invalidEmail || 'not-a-valid-email-address',
        },
      ];
      filePath = path.join(dir, `invalid_email_${randomTag}.csv`);
      fs.writeFileSync(filePath, formatLeadsToCsv(leads), 'utf-8');
      return { leads, filePath };
    }

    case 'duplicate_in_file': {
      // Two identical lead records in the exact same CSV
      const baseLead = generateLeadRecords(1)[0];
      leads = [baseLead, { ...baseLead }]; // duplicate row
      filePath = path.join(dir, `dup_in_file_${randomTag}.csv`);
      fs.writeFileSync(filePath, formatLeadsToCsv(leads), 'utf-8');
      return { leads, filePath };
    }

    case 'unsupported_extension': {
      leads = generateLeadRecords(1);
      filePath = path.join(dir, `unsupported_${randomTag}.txt`);
      fs.writeFileSync(filePath, formatLeadsToCsv(leads), 'utf-8');
      return { leads, filePath };
    }

    default:
      throw new Error(`Unknown negative scenario type: ${scenarioType}`);
  }
}

/**
 * Safely removes a generated CSV file.
 */
function cleanupCsvFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[csvGenerator] Cleaned up: ${filePath}`);
    }
  } catch (err) {
    console.warn(`[csvGenerator] Could not delete ${filePath}:`, err.message);
  }
}

module.exports = {
  CSV_HEADERS,
  loadRegistry,
  isValidMobile,
  isValidEmail,
  generateLeadRecords,
  formatLeadsToCsv,
  saveLeadsToCsvFile,
  generateAndSaveCsv,
  generateNegativeCsv,
  cleanupCsvFile,
  DEFAULT_RESOURCES_DIR,
  GENERATED_DIR,
};
