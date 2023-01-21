import { render, replace, remove } from '../framework/render.js';
import OffersModel from '../model/modelOffers.js';
import FormView from '../view/formView.js';
import PointView from '../view/pointView.js';
import DestinationsModel from '../model/modelDestination.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #editFormComponent = null;
  #point = null;
  #offersModel = new OffersModel();
  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #destinationsModel = new DestinationsModel();


  constructor({ pointListContainer, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#editFormComponent = new FormView({
      point: this.#point,
      onSubmit: this.#handlerForm,
      onClick: this.#handlerForm,
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

  #handlerForm = () => {
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
