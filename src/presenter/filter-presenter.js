import FilterView from '../view/filter-view.js';
import { render, replace, remove } from '../framework/render.js';
import { FilterType, UpdateType } from '../constants.js';
import { filter } from '../utils/filter.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filterComponent = null;
  #pointsModel = null;
  #filterType = FilterType.ALL;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleFilterModelEvent);
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
  }

  init(filterType = FilterType.ALL) {
    this.#filterType = filterType;
    const prevFilterComponent = this.#filterComponent;
    const filterFuture = filter[FilterType.FUTURE];
    const isDisabledFuture = filterType === FilterType.ALL &&
      filterFuture(this.#pointsModel.points).length === 0;
    this.#filterComponent = new FilterView({
      onChange: this.#handleFilterChange,
      filterType: filterType,
      isDisabledFuture: isDisabledFuture
    });

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleFilterModelEvent = (_updateType, filterType) => {
    this.init(filterType);
  };

  #handlePointsModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.MAJOR:
      case UpdateType.INIT:
        this.init(this.#filterType);
        break;
    }
  };
}
