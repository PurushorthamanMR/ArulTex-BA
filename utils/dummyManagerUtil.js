/**
 * Dummy Manager util: when the authenticated user has the "Dummy Manager" role,
 * apply a revenue factor to amount fields in API responses so they see reduced figures.
 * Real data is never modified in the DB.
 */

const AMOUNT_KEYS = [
  'totalSales',
  'totalCashSale',
  'totalCardSale',
  'totalPurchases',
  'todaySales',
  'monthSales',
  'totalAmount',
  'subtotal',
  'totalPrice',
  'unitPrice',
  'discountAmount',
  'totalRevenue',
  'revenue',
  'profit',
  'cashSales',
  'cardSales'
];

/**
 * Normalize role string for comparison (e.g. "Dummy Manager" -> "DUMMY_MANAGER").
 * @param {string} userRole
 * @returns {boolean} true if role is Dummy Manager
 */
function isDummyManager(userRole) {
  if (!userRole || typeof userRole !== 'string') return false;
  const normalized = userRole.toUpperCase().replace(/\s+/g, '_');
  return normalized === 'DUMMY_MANAGER';
}

/**
 * Get the revenue factor from env (default 0.6 = show 60% of real).
 * @returns {number}
 */
function getDummyManagerFactor() {
  const raw = process.env.DUMMY_MANAGER_REVENUE_FACTOR;
  if (raw == null || raw === '') return 0.6;
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 && n <= 1 ? n : 0.6;
}

/**
 * Deep-clone and multiply numeric amount-like fields by factor.
 * Used for dashboard summary, sale list, sale detail, and report payloads.
 * @param {object|array} payload - API response (object or array of objects)
 * @param {number} factor - e.g. 0.6
 * @returns {object|array} new payload with amounts scaled
 */
function applyRevenueFactor(payload, factor) {
  if (payload == null) return payload;
  if (typeof factor !== 'number' || !Number.isFinite(factor) || factor <= 0 || factor > 1) {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => applyRevenueFactor(item, factor));
  }

  if (typeof payload !== 'object') {
    return payload;
  }

  const out = {};
  for (const key of Object.keys(payload)) {
    const val = payload[key];
    if (AMOUNT_KEYS.includes(key) && (typeof val === 'number' && Number.isFinite(val))) {
      out[key] = Math.round(val * factor * 100) / 100;
    } else if (Array.isArray(val)) {
      out[key] = val.map((item) => applyRevenueFactor(item, factor));
    } else if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
      out[key] = applyRevenueFactor(val, factor);
    } else {
      out[key] = val;
    }
  }
  return out;
}

module.exports = {
  isDummyManager,
  getDummyManagerFactor,
  applyRevenueFactor
};
