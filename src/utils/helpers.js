/**
 * Helper Utilities for the Estimating Engine
 */

/**
 * Generate a unique identifier
 */
export function generateId() {
  return `est_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Round to 2 decimal places for currency
 */
export function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Format a number as currency
 */
export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number as percentage
 */
export function formatPercentage(value, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a date string for display
 */
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Parse a unit abbreviation to full name
 */
export function unitFullName(unit) {
  const unitMap = {
    ea: 'Each',
    sf: 'Square Feet',
    lf: 'Linear Feet',
    sy: 'Square Yards',
    cy: 'Cubic Yards',
    hr: 'Hours',
    ls: 'Lump Sum',
    gal: 'Gallons',
    lb: 'Pounds',
    ton: 'Tons',
    bag: 'Bags',
    bndl: 'Bundles',
    roll: 'Rolls',
    sht: 'Sheets',
    pc: 'Pieces',
    ft: 'Feet',
    in: 'Inches',
    day: 'Days',
    wk: 'Weeks',
    mo: 'Months',
  };
  return unitMap[unit?.toLowerCase()] || unit || 'Each';
}

/**
 * Pad a string for table formatting
 */
export function padRight(str, len) {
  return String(str).padEnd(len);
}

export function padLeft(str, len) {
  return String(str).padStart(len);
}

/**
 * Create a horizontal rule for reports
 */
export function horizontalRule(len = 80, char = '-') {
  return char.repeat(len);
}

/**
 * Deep clone an object (JSON-safe)
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
