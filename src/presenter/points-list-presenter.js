import SorterView from '../view/sorter-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { FilterType, SortType, UpdateType, UserAction, MessagesType } from '../constants.js';
import { sorter } from '../utils/sorter.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

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
  #newPointFormPresenter = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #isError = false;
  #disableButton = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });


  constructor({ pointsContainer, filterModel, onNewPointFormClose, pointsModel, destinationsModel, offersModel, disableButton }) {
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsContainer = pointsContainer;
    this.#filterModel = filterModel;
    this.#disableButton = disableButton;

    this.#handleNewPointFormToClose = onNewPointFormClose;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

  }

  init() {
    this.#renderList();
  }

  openNewPointForm() {
    this.#handleModeChange();

    this.#newPointFormPresenter = new NewPointPresenter({
      onDestroy: this.#handleNewPointFormToClose,
      position: this.#getPosition(),
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction
    });
    this.#newPointFormPresenter.init();
  }

  #getPosition() {
    let position;
    if (this.#points.length > 0) {
      position = {
        component: this.#sorterComponent.element,
        position: RenderPosition.AFTEREND
      };
    } else {
      position = {
        component: this.#pointsContainer,
        position: RenderPosition.AFTERBEGIN
      };
    }
    return position;
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
      messageType: this.#filterType
    });
    render(this.#emptyListComponent, this.#pointsContainer);
  }

  #renderError() {
    this.#emptyListComponent = new EmptyListView({
      messageType: MessagesType.ERROR
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
    return filteredPoints.sort(sorter[this.#sortType]);
  }

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
    } else if (this.#isError) {
      this.#renderError();
    } else if (this.#points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderSorter();
      this.#renderPoints();
    }
  }

  #handleSortTypeChange = (sortType) => {
    this.#sortType = sortType;
    this.#clearPoints();
    this.#renderList();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    if (this.#newPointFormPresenter) {
      this.#newPointFormPresenter.destroy();
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

      case UpdateType.ERROR:
        this.#isLoading = false;
        this.#isError = true;
        remove(this.#loadingComponent);
        this.#disableButton();
        this.#renderList();
        break;
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    let success = true;
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
          success = false;
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointFormPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointFormPresenter.setAborting();
          success = false;
        }
        break;

      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
          success = false;
        }
        break;
    }
    this.#uiBlocker.unblock();
    return success;
  };
}
