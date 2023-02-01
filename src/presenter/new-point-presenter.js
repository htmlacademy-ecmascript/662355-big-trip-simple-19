import FormView from '../view/form-view.js';
import { render, remove } from '../framework/render.js';
import { UpdateType, UserAction } from '../constants.js';

export default class NewPointPresenter {
  #newPointFormComponent = null;
  #position = null;
  #offersModel = null;
  #destinationsModel = null;
  #handleDataChange = null;
  #handleDestroy = null;

  constructor({ onDestroy, position, offersModel, destinationsModel, onDataChange }) {
    this.#position = position;
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

    render(this.#newPointFormComponent, this.#position.component, this.#position.position);
  }

  setSaving() {
    this.#newPointFormComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#newPointFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };
    this.#newPointFormComponent.shake(resetFormState);
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

  #handlerFormSubmit = async (point) => {
    const isSuccess = await this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point
    );
    if (isSuccess) {
      this.destroy();
    }
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
