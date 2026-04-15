/**
 * Converts a USD price to INR and formats it using Indian number formatting.
 * Rate: 1 USD = 83 INR
 * Example: formatINR(199) → "₹16,517.00"
 */
export function formatINR(usdPrice: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdPrice * 83);
}
