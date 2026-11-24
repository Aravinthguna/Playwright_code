/**
 * DateUtils.js
 * Shared date and datetime formatting utilities extracted from LeadActivitiesPage.
 * Replaces 4+ identical `getRandomDate()` and `getRandomDateTimeFormatted()` 
 * function definitions inside leadActivites.js.
 *
 * Usage:
 *   const { getRandomDate, getRandomDateTimeFormattegetRandomDateTimeFormatted, getCurrentDateTimeFormatted, getRandomDateTime } = require('../../utils/DateUtils');
 */

/**
 * Generates a random date in the current month on or before today.
 * Suitable for <input type="date"> fields like enquiryDate (max="today").
 * @returns {string} Date string e.g. "2026-07-05"
 */
function getRandomDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();     // current month
  const todayDay = now.getDate();
  
  // Generate a day between 1 and today's date
  const day = Math.floor(Math.random() * todayDay) + 1;
  const d = new Date(year, month, day);
  
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Generates a random date+time in MM/DD/YYYY, HH:MM AM/PM format on or after today in the current month.
 * Suitable for react-datepicker reminder fields (which restrict past dates/times).
 * @returns {string} Datetime string e.g. "07/15/2026, 02:30 PM"
 */
function getRandomDateTimeFormatted() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();     // current month
  const todayDay = now.getDate();

  // Generate a day between today and 28
  const range = 28 - todayDay;
  const day = range > 0 ? (Math.floor(Math.random() * (range + 1)) + todayDay) : todayDay;
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);

  const d = new Date(year, month, day, hour, minute);

  // If the generated date-time is today, ensure it is in the future
  if (day === todayDay && d.getTime() <= now.getTime()) {
    d.setHours(now.getHours() + 2); // Push 2 hours into the future
  }

  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  let h = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${mm}/${dd}/${yyyy}, ${String(h).padStart(2, '0')}:${mins} ${ampm}`;
}

/**
 * Returns the current date+time in MM/DD/YYYY, HH:MM AM/PM format.
 * Suitable for reminder date pickers that default to now.
 * @returns {string} Current datetime string
 */
function getCurrentDateTimeFormatted() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const yyyy = now.getFullYear();
  let h = now.getHours();
  const mins = String(now.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${mm}/${dd}/${yyyy}, ${String(h).padStart(2, '0')}:${mins} ${ampm}`;
}

/**
 * Generates a fully random datetime on or after today in the current month.
 * Used in direct meeting reminders.
 * @returns {string} Random datetime in MM/DD/YYYY, HH:MM AM/PM format
 */
function getRandomDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;  // current month (1–12)
  const todayDay = now.getDate();

  // Generate a day between today and 28
  const range = 28 - todayDay;
  const day = range > 0 ? (Math.floor(Math.random() * (range + 1)) + todayDay) : todayDay;
  let hour = Math.floor(Math.random() * 12) + 1;   // 1–12
  const minute = Math.floor(Math.random() * 60);     // 0–59
  let ampm = Math.random() > 0.5 ? 'AM' : 'PM';

  // If the generated date-time is today, ensure it is in the future
  if (day === todayDay) {
    const curH = now.getHours();
    const futureH = (curH + 2) % 24;
    ampm = futureH >= 12 ? 'PM' : 'AM';
    hour = futureH % 12 || 12;
  }

  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}, ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;
}

/**
 * Returns current date formatted as YYYY-MM-DD for <input type="date"> fields.
 * @returns {string} Date string e.g. "2026-08-01"
 */
function getCurrentDateFormatted() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns a future date formatted as YYYY-MM-DD for <input type="date"> fields.
 * @param {number} daysAhead Number of days in the future (default: 2)
 * @returns {string} Date string e.g. "2026-10-05"
 */
function getFutureDate(daysAhead = 2) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns a future time in 24-hour "HH:mm" format for <input type="time"> fields.
 * @param {number} hoursAhead Number of hours ahead (default: 2)
 * @returns {string} Time string e.g. "19:57"
 */
function getFutureTime(hoursAhead = 2) {
  const d = new Date();
  d.setHours(d.getHours() + hoursAhead);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

module.exports = {
  getRandomDate,
  getRandomDateTimeFormatted,
  getCurrentDateTimeFormatted,
  getCurrentDateFormatted,
  getRandomDateTime,
  getFutureDate,
  getFutureTime,
};

