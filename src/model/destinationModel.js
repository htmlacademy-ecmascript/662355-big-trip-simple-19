// import { destinations } from '../mock/data.js';

export default class DestinationsModel {
  #destinations = [];
  #apiService = null;

  constructor({ apiService }) {
    this.#apiService = apiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    this.#destinations = await this.#apiService.destinations;
  }

  getById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }

}
