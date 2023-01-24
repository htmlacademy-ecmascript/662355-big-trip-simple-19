import { offers } from '../mock/data.js';

export default class OffersModel {
  #offersByType = [...offers];

  get offers() {
    return [...this.#offersByType];
  }

  getByType(type) {
    return this.#offersByType.find((offer) => offer.type === type).offers;
  }

}
