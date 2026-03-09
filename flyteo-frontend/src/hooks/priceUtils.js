/**
 * Calculate final room price based on:
 * - Check-in date
 * - Day-wise percentage
 * - Hotel discount
 */
export function calculateRoomPrice({
  basePrice = 0,
  checkIn,
  dayWisePricing = [],
  hotelDiscount = 0,
  taxes = 0
}) {
  if (!basePrice) return 0;

  let price = basePrice;

  // Apply day-wise rule if date exists
  if (checkIn && dayWisePricing.length > 0) {
    const dayName = new Date(checkIn)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    const rule = dayWisePricing.find(
      d => d.day?.toUpperCase() === dayName
    );

    if (rule?.percentage) {
      price = price - (price * rule.percentage) / 100;
    }
  }

  // Hotel discount
  if (hotelDiscount > 0) {
    price = price - (price * hotelDiscount) / 100;
  }

  // Taxes
  price += taxes || 0;

  return Math.round(price);
}

export function calculateVillaPrice(basePrice = 0,
  checkIn,
  dayWisePricing = [],
  villaDiscount = 0,
  taxes = 0) {
  let price =basePrice;

  const date = checkIn ? new Date(checkIn) : new Date();

  const dayName = date
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  const rule = dayWisePricing.find(d => d.day === dayName);

  if (rule) {
    price = price - (price * rule.percentage) / 100;
  }

  if (villaDiscount > 0) {
    price = price - (price * villaDiscount) / 100;
  }

  price += taxes || 0;

  return Math.round(price);
}

export function calculateHotelPrice(hotel, checkIn) {
  const basePrice = hotel.room?.[0]?.price || 0;

  let price = basePrice;

  const date = checkIn ? new Date(checkIn) : new Date();

  const dayName = date
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  const rule = hotel.day_wise_percentage?.find(
    d => d.day === dayName
  );

  if (rule) {
    price = price - (price * rule.percentage) / 100;
  }

  if (hotel.discount > 0) {
    price = price - (price * hotel.discount) / 100;
  }

  price += hotel.taxes || 0;

  return Math.round(price);
}
export function calculateVillaPriceInSearch(villa, checkIn) {
  let price = villa.basePrice || 0;

  const date = checkIn ? new Date(checkIn) : new Date();

  const dayName = date
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  const rule = villa.day_wise_percentage?.find(
    d => d.day === dayName
  );

  if (rule) {
    price = price - (price * rule.percentage) / 100;
  }

  if (villa.discount > 0) {
    price = price - (price * villa.discount) / 100;
  }

  price += villa.taxes || 0;

  return Math.round(price);
}