
/**
 * Formats a number as a price with decimals and commas.
 * 
 * @param {number} amount - The amount to format.
 * @param {string} locale - The locale string to format the number (default is 'en-US').
 * @param {string} currency - The currency string to format the number (default is 'NZD').
 * @returns {string} The formatted price.
 */
export function formatPrice(amount: number, locale: string = 'en-NZ', currency: string = 'NZD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}