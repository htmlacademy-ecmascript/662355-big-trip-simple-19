import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class PointService extends ApiService {

  get points() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(point),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }).then(ApiService.parseResponse);
  }

  createPoint(point) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(point),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }).then(ApiService.parseResponse);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }
}

