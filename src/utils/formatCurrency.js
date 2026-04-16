
const NGN_FORMATTER = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * format a Naira amount is display.
 * @param {number} amount - Amount in Naira (not kobo).
 * @returns {string} - Formatted currency string in Naira.
 */
export function formatCurrency(amount) {
  if(amount == null || isNaN(amount)) return '₦0';
  return NGN_FORMATTER.format(amount);
}

/**
 * Convert an amount from kobo to Naira and format it for display.
 * @param {number} kobo - Amount in kobo.
 * @returns {string} - Formatted currency string in Naira.
 */
export function fromKobo(kobo) {
 if (kobo == null || isNaN(kobo)) return 0;
 return NGN_FORMATTER.format(kobo / 100); 
}

/**
 * convert a Naira amount to kobo for sending to paystack.
 * @param {number} naira - Amount in Naira.
 * @returns {number} - Amount in kobo.
 */
export function toKobo(naira) {
  if (naira == null || isNaN(naira)) return 0;
  return Math.round((naira ?? 0) * 100);
}