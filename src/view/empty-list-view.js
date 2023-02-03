import { MessagesType } from '../constants.js';
import AbstractView from '../framework/view/abstract-view.js';

const emptyPointsText = {
  [MessagesType.ALL]: 'Click New Event to create your first point',
  [MessagesType.FUTURE]: 'There are no future events now',
  [MessagesType.ERROR]: 'Can\'t load information from server. Try later'
};

function createTemplate(filterType) {
  const text = emptyPointsText[filterType];
  return `<p class="trip-events__msg">${text}</p>`;
}

export default class EmptyListView extends AbstractView {
  #messageType = null;

  constructor({ messageType }) {
    super();
    this.#messageType = messageType;
  }

  get template() {
    return createTemplate(this.#messageType);
  }
}
