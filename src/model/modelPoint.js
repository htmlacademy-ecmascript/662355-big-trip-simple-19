import { points } from '../mock/data.js';

export default class PointsModel {
  points = [...points];

  getPoints() {
    return [...this.points];
  }
}
