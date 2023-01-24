import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const emptyPointsText = {
  [FilterType.ALL]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now'
};

function createTemplate(filterType) {
  const text = emptyPointsText[filterType];
  return `<p class="trip-events__msg">${text}</p>`;
}

export default class EmptyListView extends AbstractView {
  #filerType = null;

  constructor({ filterType }) {
    super();
    this.#filerType = filterType;
  }

  get template() {
    return createTemplate(this.#filerType);
  }
}
