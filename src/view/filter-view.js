import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../constants.js';

function createFilterTemplate(filterType, isDisabledFuture) {
  const checked = (filter) => filterType === filter ? 'checked' : '';
  return `<div class="trip-main__trip-controls  trip-controls">
  <div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FilterType.ALL}" ${checked(FilterType.ALL)}>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FilterType.FUTURE}" ${checked(FilterType.FUTURE)} ${isDisabledFuture ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>
</div>`;
}

export default class FilterView extends AbstractView {
  #handleChangeFilter = null;
  #filterType = null;
  #isDisabledFuture = null;

  constructor({ onChange, filterType, isDisabledFuture }) {
    super();
    this.#handleChangeFilter = onChange;
    this.#filterType = filterType;
    this.#isDisabledFuture = isDisabledFuture;

    const filters = this.element.querySelectorAll('.trip-filters__filter-input');
    filters.forEach((filter) => {
      filter.addEventListener('change', this.#changeFilterHandler);
    });
  }

  get template() {
    return createFilterTemplate(this.#filterType, this.#isDisabledFuture);
  }

  #changeFilterHandler = (evt) => {
    evt.preventDefault();
    this.#handleChangeFilter(evt.target.value);
  };

}
