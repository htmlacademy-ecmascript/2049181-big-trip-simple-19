import {
  getMultipleRandomArrayElements,
  getRandomArrayElement,
  getRandomInteger
} from './utils.js';
import { MAX_OFFERS, PointsAmount, TYPES } from './const.js';
import { offersByType } from './offer.js';
import { destinations } from './destination.js';

const generatePoint = () => {
  const day = getRandomInteger(1,31);

  const pointType = getRandomArrayElement(TYPES);

  const pointTypeOffers = offersByType.find((offer) => offer.type === pointType).offers;

  const getOffersIds = () => getMultipleRandomArrayElements(pointTypeOffers, 0, MAX_OFFERS)
    .map((item) => item.id);

  const getDestinationId = () => getRandomArrayElement(destinations).id;

  return ({
    basePrice: getRandomInteger(100, 1500),
    dateFrom: new Date(2022, 11, day),
    dateTo: new Date(2022, 11, day + 1),
    destination: getDestinationId(),
    id: getRandomInteger(10, 50),
    offers: getOffersIds(),
    type: pointType
  });
};

const generatePoints = () => Array.from({length: getRandomInteger(PointsAmount.MIN, PointsAmount.MAX)}, generatePoint);

export {generatePoints};
