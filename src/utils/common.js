const getOffersByPointType = (pointType, offersByType) => offersByType
  .find((offer) => offer.type === pointType).offers;

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export {
  getOffersByPointType,
  updateItem
};
