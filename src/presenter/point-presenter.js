import { UpdateType, UserAction } from '../constants.js';
import { render, replace, remove } from '../framework/render.js';
import FormView from '../view/form-view.js';
import PointView from '../view/point-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #editFormComponent = null;
  #point = null;
  #offersModel = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #destinationsModel = null;
  #handleDataChange = null;


  constructor({ pointListContainer, onModeChange, offersModel, destinationsModel, onDataChange }) {
    this.#pointListContainer = pointListContainer;
    this.#handleModeChange = onModeChange;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;
    this.#editFormComponent = new FormView({
      point: this.#point,
      onSubmit: this.#handlerFormSubmit,
      onRollDown: this.#handlerRollDown,
      onRemove: this.#handlerRemove,
      offersByType: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations
    });

    this.#pointComponent = new PointView({
      point: this.#point,
      onRollUp: this.#handlerRollUp
    });

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointComponent, this.#pointListContainer.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }
    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }
    const resetFormState = () => {
      this.#editFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };
    this.#editFormComponent.shake(resetFormState);
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
    this.#mode = Mode.DEFAULT;
  }

  #handlerFormSubmit = async (point) => {
    let updateType = UpdateType.PATCH;
    if (this.#point.price !== point.price || this.#point.start !== point.start || this.#point.end !== point.end) {
      updateType = UpdateType.MINOR;
    }
    const isSuccess = await this.#handleDataChange(
      UserAction.UPDATE_POINT,
      updateType,
      point
    );
    if (isSuccess) {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escHandler);
    }
  };

  #handlerRemove = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handlerRollDown = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escHandler);
  };

  #handlerRollUp = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escHandler);
  };

  #escHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escHandler);
    }
  };

}
