export default function getDayWisePrice(basePrice, dayWisePricing = []) {
  if (!basePrice) return 0;

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  let discountPercent = 0;

  // 👉 Case A: array format
  if (Array.isArray(dayWisePricing)) {
    const todayRule = dayWisePricing.find(
      (d) => d.day === today
    );
    discountPercent = todayRule?.percentage || 0;
  }

  // 👉 Case B: object format
  if (!Array.isArray(dayWisePricing) && typeof dayWisePricing === "object") {
    discountPercent = dayWisePricing[today] || 0;
  }

  const discountAmount = (basePrice * discountPercent) / 100;
  return Math.round(basePrice - discountAmount);
}
