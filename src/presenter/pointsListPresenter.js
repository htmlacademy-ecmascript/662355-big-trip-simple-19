import SorterView from '../view/sorterView.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import PointListView from '../view/pointListView.js';
import EmptyListView from '../view/emptyListView.js';
import PointPresenter from './pointPresenter.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import { sortPointsByDay, sortPointsByPrice } from '../utils/utils.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './newPointPresenter.js';
import LoadingView from '../view/loadingView.js';

export default class PointsListPresenter {
  #pointListComponent = new PointListView();
  #emptyListComponent = null;
  #sorterComponent = null;
  #destinationsModel = null;
  #pointsModel = null;
  #offersModel = null;
  #pointsContainer = null;
  #pointPresenters = new Map();
  #sortType = SortType.DAY;
  #filterModel = null;
  #filterType = FilterType.ALL;
  #handleNewPointFormToClose = null;
  #newPointForm = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;


  constructor({ pointsContainer, filterModel, onNewPointFormClose, pointsModel, destinationsModel, offersModel }) {
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsContainer = pointsContainer;
    this.#filterModel = filterModel;

    this.#handleNewPointFormToClose = onNewPointFormClose;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

  }

  init() {
    this.#renderList();
  }

  openNewPointForm() {
    this.#handleModeChange();
    let renderPositionComponent;
    if (this.#points.length > 0) {
      renderPositionComponent = {
        component: this.#sorterComponent.element,
        position: RenderPosition.AFTEREND
      };
    } else {
      renderPositionComponent = {
        component: this.#pointsContainer,
        position: RenderPosition.AFTERBEGIN
      };
    }
    this.#newPointForm = new NewPointPresenter({
      onDestroy: this.#handleNewPointFormToClose,
      renderPositionComponent: renderPositionComponent,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction
    });
    this.#newPointForm.init();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      pointListContainer: this.#pointListComponent,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyListView({
      filterType: this.#filterType
    });
    render(this.#emptyListComponent, this.#pointsContainer);
  }

  #clearPoints({ resertSortType = false } = {}) {
    this.#pointPresenters.forEach((pointPresenter) => {
      pointPresenter.destroy();
    });
    this.#pointPresenters.clear();

    remove(this.#sorterComponent);
    remove(this.#loadingComponent);

    if (resertSortType) {
      this.#sortType = SortType.DAY;
    }

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
  }

  get #points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#sortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
      case SortType.DAY:
      default:
        return filteredPoints.sort(sortPointsByDay);
    }
  }

  #handleSortTypeChange = (sortType) => {
    this.#sortType = sortType;
    this.#clearPoints();
    this.#renderList();
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#pointsContainer);
  }

  #renderSorter() {
    this.#sorterComponent = new SorterView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#sortType
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
    if (this.#isLoading) {
      this.#renderLoading();
    } else if (this.#points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderSorter();
      this.#renderPoints();
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    if (this.#newPointForm) {
      this.#newPointForm.destroy();
    }
  };

  #handleModelEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(point.id).init(point);
        break;

      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderList();
        break;

      case UpdateType.MAJOR:
        this.#clearPoints({ resertSortType: true });
        this.#renderList();
        break;

      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderList();
        break;

    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;

      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;

      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

}

