/**
 * RandomDataUtils.js
 * Shared random-data generators extracted from lead and partners page objects.
 * Replaces duplicated local helper functions across CreateLeadPage, LeadDetailsPage,
 * LeadActivitiesPage, and SwitchAccountPage.
 *
 * Usage:
 *   const { generateRandomName, generateRandomEmail, generateRandomMobile, getRandomPhoneNumber } = require('../../utils/RandomDataUtils');
 */

/**
 * Generates a pronounceable random name by alternating consonants and vowels.
 * @param {number} length - Character length of the name (default: 6)
 * @returns {string} Capitalized random name
 */
function generateRandomName(length = 6) {
  const vowels = 'aeiou';
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  let name = '';
  const startWithVowel = Math.random() < 0.5;
  for (let i = 0; i < length; i++) {
    if ((i % 2 === 0) === startWithVowel) {
      name += vowels[Math.floor(Math.random() * vowels.length)];
    } else {
      name += consonants[Math.floor(Math.random() * consonants.length)];
    }
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Generates a random email address using a random name and a common domain.
 * @returns {string} Random email address
 */
function generateRandomEmail() {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com'];
  return (
    generateRandomName(5).toLowerCase() +
    Math.floor(Math.random() * 1000) +
    '@' +
    domains[Math.floor(Math.random() * domains.length)]
  );
}

/**
 * Generates a valid 10-digit Indian mobile number starting with 9.
 * @returns {string} 10-digit mobile number as string
 */
function generateRandomMobile() {
  return '9' + Math.floor(100000000 + Math.random() * 900000000).toString();
}

/**
 * Returns a random phone number from a predefined list of test accounts.
 * @returns {string} Phone number string
 */
function getRandomPhoneNumber() {
  const phNumberArray = [
    '7650270408',
    '0000000001',
    '7305711581',
    '0000000006',
    '6666666666',
    '7760279160',
    '8220548887',
    '8248673831',
    '9361505487',
    '9686620422',
    '9789593505',
  ];
  return phNumberArray[Math.floor(Math.random() * phNumberArray.length)];
}

/**
 * Generates a valid random PAN (10 chars: 5 uppercase letters, 4 digits, 1 uppercase letter)
 * @returns {string} Random PAN number
 */
function generateRandomPan() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let pan = '';
  for (let i = 0; i < 5; i++) {
    pan += letters[Math.floor(Math.random() * letters.length)];
  }
  pan += Math.floor(1000 + Math.random() * 9000).toString();
  pan += letters[Math.floor(Math.random() * letters.length)];
  return pan;
}

/**
 * Generates a valid random GSTIN (15 chars: 2-digit state code + 10-char PAN + 1 digit + 'Z' + 1 digit)
 * @param {string} [pan] Optional PAN to base GST on
 * @returns {string} Random GST number
 */
function generateRandomGst(pan) {
  const stateCode = '29';
  const panNumber = pan || generateRandomPan();
  const entityCode = Math.floor(1 + Math.random() * 9).toString();
  const checksum = Math.floor(1 + Math.random() * 9).toString();
  return `${stateCode}${panNumber}${entityCode}Z${checksum}`;
}

/**
 * Generates a valid random Indian CIN (21 characters: U + 5 digits + 2 letters + 4-digit year + PTC + 6 digits)
 * @returns {string} Random CIN number
 */
function generateRandomCin() {
  const digits5 = Math.floor(10000 + Math.random() * 90000).toString();
  const year = Math.floor(2000 + Math.random() * 24).toString();
  const digits6 = Math.floor(100000 + Math.random() * 900000).toString();
  return `U${digits5}KA${year}PTC${digits6}`;
}

module.exports = {
  generateRandomName,
  generateRandomEmail,
  generateRandomMobile,
  getRandomPhoneNumber,
  generateRandomPan,
  generateRandomGst,
  generateRandomCin,
};
