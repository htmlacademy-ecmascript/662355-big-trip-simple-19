import FormView from '../view/formView.js';
import { render, remove } from '../framework/render.js';
import { UpdateType, UserAction } from '../const.js';
import { nanoid } from 'nanoid';

export default class NewPointPresenter {
  #newPointFormComponent = null;
  #renderPositionComponent = null;
  #offersModel = null;
  #destinationsModel = null;
  #handleDataChange = null;
  #handleDestroy = null;

  constructor({ onDestroy, renderPositionComponent, offersModel, destinationsModel, onDataChange }) {
    this.#renderPositionComponent = renderPositionComponent;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    this.#newPointFormComponent = new FormView({
      onSubmit: this.#handlerFormSubmit,
      onRemove: this.#handlerRemove,
      offersByType: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations
    });

    render(this.#newPointFormComponent, this.#renderPositionComponent.component, this.#renderPositionComponent.position);
  }

  destroy() {
    if (this.#newPointFormComponent === null) {
      return;
    }
    this.#handleDestroy();
    remove(this.#newPointFormComponent);
    this.#newPointFormComponent = null;
    document.removeEventListener('keydown', this.#escHandler);
  }

  #handlerFormSubmit = (point) => {
    point.id = nanoid();
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point
    );
    this.destroy();
  };

  #handlerRemove = () => {
    this.destroy();
  };

  #escHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
