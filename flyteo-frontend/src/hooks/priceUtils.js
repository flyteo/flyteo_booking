/**
 * Calculate final room price based on:
 * - Check-in date
 * - Day-wise percentage
 * - Hotel discount
 */
export function calculateRoomPrice({
  basePrice,
  checkIn,
  dayWisePricing = [],
  hotelDiscount = 0
}) {
  if (!basePrice) return 0;

  let price = basePrice;

  // ❗ If no date selected → only discount applies
  if (checkIn) {
    const dayName = new Date(checkIn)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    // 🔹 Day-wise percentage
    const rule = dayWisePricing.find(d => d.day === dayName);

    if (rule?.percentage) {
      price = price - (price * rule.percentage) / 100;
    }
  }

  // 🔹 Hotel discount (always applies)
  if (hotelDiscount > 0) {
    price = price - (price * hotelDiscount) / 100;
  }

  return Math.round(price);
}
