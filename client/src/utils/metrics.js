/**
 * Calculates Click-Through Rate (CTR) as a percentage.
 * @param {number} clicks
 * @param {number} impressions
 * @returns {string} Formatted CTR (e.g., "5.00%")
 */
export function calculateCTR(clicks, impressions) {
  if (!impressions) return "0.00%";
  const ctr = (clicks / impressions) * 100;
  return ctr.toFixed(2) + "%";
}

/**
 * Calculates Return on Ad Spend (ROAS).
 * Assumes $50 revenue per conversion.
 * @param {number} conversions
 * @param {number} spend
 * @returns {string} Formatted ROAS (e.g., "2.5x")
 */
export function calculateROAS(conversions, spend) {
  if (!spend) return "0.00x";
  const revenue = conversions * 50;
  const roas = revenue / spend;
  return roas.toFixed(2) + "x";
}

/**
 * Formats a given number into a currency string (USD).
 * @param {number} amount
 * @returns {string} Formatted currency
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a given number with commas.
 * @param {number} num
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num);
}
