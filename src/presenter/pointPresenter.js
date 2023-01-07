import { render, replace, remove } from '../framework/render.js';
import OffersModel from '../model/modelOffers.js';
import EditFormView from '../view/editFormView.js';
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
  #offersModel = new OffersModel();
  #handleModeChange = null;
  #mode = Mode.DEFAULT;


  constructor({ pointListContainer, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#editFormComponent = new EditFormView({
      point: this.#point,
      offers: this.#offersModel.getByType(point.type),
      onSubmit: this.#handlerForm,
      onClick: this.#handlerForm,
      offersByType: this.#offersModel.offers
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
