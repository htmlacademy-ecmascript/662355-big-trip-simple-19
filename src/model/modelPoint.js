import { points } from '../mock/data.js';

export default class PointsModel {
  #points = [...points];

  get points() {
    return [...this.#points];
  }
}
