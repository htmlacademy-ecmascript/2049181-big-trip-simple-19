import { offersByType } from '../mock/offer.js';

export default class OffersModel {
  offers = offersByType;

  getOffers() {
    return this.offers;
  }
}
