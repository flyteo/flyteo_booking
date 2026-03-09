export function filterAndSortStays({
  stays,
  destination,
  priceRange,
  rating,
  selectedAmenities,
  getPrice
}) {
  let result = [...stays];

  /* DESTINATION FILTER */
  if (destination) {
    result = result.filter((s) =>
      s.location?.toLowerCase().includes(destination.toLowerCase())
    );
  }

  /* PRICE FILTER */
  if (priceRange) {
    result = result.filter((s) => getPrice(s) <= priceRange);
  }

  /* RATING FILTER */
  if (rating > 0) {
    result = result.filter((s) => s.starCategory >= rating);
  }

  /* AMENITIES FILTER */
  if (selectedAmenities?.length > 0) {
    result = result.filter((s) =>
      s.hotelamenity?.some((a) =>
        selectedAmenities.includes(a.amenityId)
      )
    );
  }

  /* SORT BY PRICE */
  result.sort((a, b) => getPrice(a) - getPrice(b));

  return result;
}