import { offers } from '../mock/data.js';

export default class OffersModel {
  offersByType = [...offers];

  getOffers() {
    return [...this.offersByType];
  }

  getByType(type) {
    return this.offersByType.find((offer) => offer.type === type).offers;
  }

  getByTypeAndId(id,type) {
    return this.getByType(type).find((offer) => offer.id === id);
  }


}
