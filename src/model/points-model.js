import { UpdateType } from '../constants.js';
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
      const [points] = await Promise.all([
        this.#apiService.points,
        this.#offersModel.init(),
        this.#destinationsModel.init()
      ]);
      points.forEach((point) => {
        const clientPoint = this.#adaptToClient(point);
        this.#points.set(point.id, clientPoint);
      });
    } catch (err) {
      this.#points = new Map();
    }
    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    if (!this.#points.has(update.id)) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const serverPoint = this.#adaptToServer(update);
      const newPoint = await this.#apiService.updatePoint(serverPoint);
      const newClientPoint = this.#adaptToClient(newPoint);
      this.#points.set(newClientPoint.id, newClientPoint);
      this._notify(updateType, newClientPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const serverPoint = this.#adaptToServer(update);
      const newPoint = await this.#apiService.createPoint(serverPoint);
      const newClientPoint = this.#adaptToClient(newPoint);
      this.#points.set(newClientPoint.id, newClientPoint);
      this._notify(updateType, newClientPoint);
    } catch (err) {
      throw new Error('Can\'t add point');

    }
  }

  async deletePoint(updateType, update) {
    if (!this.#points.has(update.id)) {
      throw new Error('Can\'t delete unexisting point');
    }
    try {
      await this.#apiService.deletePoint(update);
      this.#points.delete(update.id);
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
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
    delete adaptPoint.date_to;
    delete adaptPoint.date_from;
    delete adaptPoint.base_price;

    return adaptPoint;
  };

  #adaptToServer = (point) => {
    const serverPoint = {
      ...point,
      offers: point.offers.map((offer) => offer.id),
      destination: point.destination.id,
      'date_from': point.start.toISOString(),
      'date_to': point.end.toISOString(),
      'base_price': point.price
    };

    delete serverPoint.start;
    delete serverPoint.end;
    delete serverPoint.price;

    return serverPoint;
  };
}
