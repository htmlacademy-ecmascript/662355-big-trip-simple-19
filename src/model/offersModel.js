// import { offers } from '../mock/data.js';

export default class OffersModel {
  #offersByType = [];
  #apiService = null;

  constructor({ apiService }) {
    this.#apiService = apiService;
  }

  get offers() {
    return this.#offersByType;
  }

  async init() {
    this.#offersByType = await this.#apiService.offers;
  }

  getByType(type) {
    return this.offers.find((offer) => offer.type === type).offers;
  }

}
