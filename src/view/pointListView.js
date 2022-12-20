import { createElement } from '../render.js';

function createPointListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class PointListView {
  #element = null;
  get #template() {
    return createPointListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
