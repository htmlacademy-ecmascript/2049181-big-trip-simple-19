import { offersByType } from '../mock/offer.js';

export default class OffersModel {
  #offers = offersByType;

  get offers() {
    return this.#offers;
  }
}
