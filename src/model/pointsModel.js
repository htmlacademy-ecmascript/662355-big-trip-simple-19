// import { points } from '../mock/data.js';
import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = new Map();
  #apiService = null;
  #offersModel = null;
  #destinationsModel = null;

  constructor({ offersModel, destinationsModel, apiService }) {
    super();
    this.#apiService = apiService;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  get points() {
    return [...this.#points.values()];
  }

  async init() {
    try {
      const points = await this.#apiService.points;
      await this.#offersModel.init();
      await this.#destinationsModel.init();
      points.map(this.#adaptToClient).forEach((point) => this.#points.set(point.id, point));
    } catch (err) {
      this.#points = new Map();
    }
    this._notify(UpdateType.INIT);
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

  #adaptToClient = (point) => {
    // поиск офферов для конткретной точки по Id. С ассоциацией точки с оферами для использования в pointView
    const offers = this.#offersModel.getByType(point.type).filter((offer) => point.offers.includes(offer.id));
    const destination = this.#destinationsModel.getById(point.destination);
    const adaptPoint = {
      ...point,
      offers: offers,
      destination: destination,
      start: new Date(point.date_from),
      end: new Date(point.date_to),
      price: point.base_price
    };
    delete adaptPoint['date_to'];
    delete adaptPoint['date_from'];
    delete adaptPoint['base_price'];

    return adaptPoint;
  };
}
