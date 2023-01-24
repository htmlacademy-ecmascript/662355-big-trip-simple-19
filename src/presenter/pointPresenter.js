import { UpdateType, UserAction } from '../const.js';
import { render, replace, remove } from '../framework/render.js';
import FormView from '../view/formView.js';
import PointView from '../view/pointView.js';

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
      onRollUp: this.#handlerRollUp,
      onRemove: this.#handlerRemove,
      offersByType: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations
    });

    this.#pointComponent = new PointView({
      point: this.#point,
      onClick: this.#handlerPoint
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

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #handlerFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point
    );
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escHandler);
  };

  #handlerRemove = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handlerRollUp = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escHandler);
  };

  #handlerPoint = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escHandler);
  };

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
    this.#mode = Mode.DEFAULT;
  }

  #escHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escHandler);
    }
  };

}
