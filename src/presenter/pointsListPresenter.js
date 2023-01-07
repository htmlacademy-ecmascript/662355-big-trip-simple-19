import SorterView from '../view/sorterView.js';
import { render } from '../framework/render.js';
import PointListView from '../view/pointListView.js';
import PointsModel from '../model/modelPoint.js';
import DestinationsModel from '../model/modelDestination.js';
import OffersModel from '../model/modelOffers.js';
import EmptyListView from '../view/emptyListView.js';
import PointPresenter from './pointPresenter.js';

export default class PointsListPresenter {
  #pointListComponent = new PointListView();
  #emptyListComponent = new EmptyListView();
  #sorterComponent = new SorterView();
  #destinationsModel = new DestinationsModel();
  #pointsModel = new PointsModel();
  #offersModel = new OffersModel();
  #pointsContainer = null;
  #pointPresenters = [];


  constructor({ pointsContainer }) {
    this.#pointsContainer = pointsContainer;
  }

  init() {
    const points = this.#pointsModel.points.map((point) => {
      point.destination = this.#destinationsModel.getById(point.destination);
      point.offers = point.offers.map((offerId) => this.#offersModel.getByTypeAndId(offerId, point.type));
      return point;
    });
    this.#renderList(points);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.push(pointPresenter);
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#pointsContainer);
  }

  #renderSorter() {
    render(this.#sorterComponent, this.#pointsContainer);
  }

  #renderPoints(points) {
    render(this.#pointListComponent, this.#pointsContainer);
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderList(points) {
    if (points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderSorter();
      this.#renderPoints(points);
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

}

