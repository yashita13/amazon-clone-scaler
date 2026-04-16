/**
 * Standardized pricing logic for the Amazon Clone.
 * Ensures 100% consistency between Frontend UI, API calculations, and Email templates.
 */

export const TAX_RATE = 0.18; // 18% GST
export const FREE_SHIPPING_THRESHOLD = 500;
export const SHIPPING_CHARGE = 40;

export interface PricingBreakdown {
  itemsTotal: number;
  taxAmount: number;
  deliveryFee: number;
  finalTotal: number;
}

/**
 * Calculates the full pricing breakdown based on the items subtotal.
 * @param itemsTotal The sum of all item (price * quantity)
 */
export const calculateOrderPrices = (itemsTotal: number): PricingBreakdown => {
  // Round to 2 decimal places to avoid floating point issues
  const subtotal = Math.round(itemsTotal * 100) / 100;
  
  const taxAmount = Math.round((subtotal * TAX_RATE) * 100) / 100;
  
  const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  
  const finalTotal = Math.round((subtotal + taxAmount + deliveryFee) * 100) / 100;

  return {
    itemsTotal: subtotal,
    taxAmount,
    deliveryFee,
    finalTotal,
  };
};

/**
 * Generates a unique guest ID and persists it in localStorage if not already present.
 * To be used for tracking orders of non-logged-in demo users.
 */
export const getOrCreateGuestId = (): string => {
  if (typeof window === "undefined") return "server-side";
  
  let guestId = localStorage.getItem("amazon_guest_id");
  if (!guestId) {
    guestId = `gst_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
    localStorage.setItem("amazon_guest_id", guestId);
  }
  return guestId;
};
