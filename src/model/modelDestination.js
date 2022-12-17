import { destinations } from '../mock/data.js';

export default class DestinationsModel {
  destinations = [...destinations];

  getDestinations() {
    return this.destinations;
  }

  getById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }

}
