import SorterView from '../view/sorterView.js';
import { render } from '../framework/render.js';
import PointListView from '../view/pointListView.js';
import PointsModel from '../model/modelPoint.js';
import DestinationsModel from '../model/modelDestination.js';
import OffersModel from '../model/modelOffers.js';
import EmptyListView from '../view/emptyListView.js';
import PointPresenter from './pointPresenter.js';
import { SortType } from '../const.js';
import { sortPointsByDay, sortPointsByPrice } from '../utils.js';

export default class PointsListPresenter {
  #pointListComponent = new PointListView();
  #emptyListComponent = new EmptyListView();
  #sorterComponent = null;
  #destinationsModel = new DestinationsModel();
  #pointsModel = new PointsModel();
  #offersModel = new OffersModel();
  #pointsContainer = null;
  #pointPresenters = [];
  #points = null;


  constructor({ pointsContainer }) {
    this.#pointsContainer = pointsContainer;
  }

  init() {
    this.#points = this.#pointsModel.points.map((point) => {
      point.destination = this.#destinationsModel.getById(point.destination);
      point.offers = point.offers.map((offerId) => this.#offersModel.getByTypeAndId(offerId, point.type));
      return point;
    });
    this.#renderList();
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

  #clearPoints() {
    this.#pointPresenters.forEach((pointPresenter) => {
      pointPresenter.destroy();
    });
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this.#points.sort(sortPointsByPrice);
        break;
      case SortType.DAY:
      default:
        this.#points.sort(sortPointsByDay);
    }
  }

  #handleSortTypeChange = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderPoints();
  };

  #renderSorter() {
    this.#sorterComponent = new SorterView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sorterComponent, this.#pointsContainer);
  }

  #renderPoints() {
    render(this.#pointListComponent, this.#pointsContainer);
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderList() {
    if (this.#points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderSorter();
      this.#renderPoints();
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

}

