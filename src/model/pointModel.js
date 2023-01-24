import { points } from '../mock/data.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = new Map();


  constructor(offersModel, destinationsModel) {
    super();
    points.forEach((point) => {
      // поиск офферов для конткретной точки по Id. С ассоциацией точки с оферами для использования в pointView
      const offers = offersModel.getByType(point.type).filter((offer) => point.offers.includes(offer.id));
      const destination = destinationsModel.getById(point.destination);
      const enrichPoint = {
        ...point,
        offers: offers,
        destination: destination
      };
      this.#points.set(point.id, enrichPoint);
    });

  }


  get points() {
    return [...this.#points.values()];
  }

  updatePoint(updateType, update) {
    if (!this.#points.has(update.id)) {
      throw new Error('Can\'t update unexisting point');
    }
    this.#points.set(update.id, update);
    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points.set(update.id, update);
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    if (!this.#points.has(update.id)) {
      throw new Error('Can\'t delete unexisting point');
    }
    this.#points.delete(update.id);
    this._notify(updateType);
  }
}
