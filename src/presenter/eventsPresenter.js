import EditFormView from '../view/editorFormView.js';
import PointView from '../view/pointView.js';
import SorterView from '../view/sorterView.js';
import { render } from '../framework/render.js';
import PointListView from '../view/pointListView.js';
import PointsModel from '../model/modelPoint.js';
import DestinationsModel from '../model/modelDestination.js';
import OffersModel from '../model/modelOffers.js';
import EmptyListView from '../view/emptyListView.js';


export default class EventsPresenter {
  #pointListComponent = new PointListView();
  #destinationsModel = new DestinationsModel();
  #pointsModel = new PointsModel();
  #offersModel = new OffersModel();
  #eventsContainer = null;

  constructor({ eventsContainer }) {
    this.#eventsContainer = eventsContainer;
  }

  init() {
    const points = this.#pointsModel.points.map((point) => {
      point.destination = this.#destinationsModel.getById(point.destination);
      point.offers = point.offers.map((offerId) => this.#offersModel.getByTypeAndId(offerId, point.type));
      return point;
    });
    if (points.length === 0) {
      render(new EmptyListView(), this.#eventsContainer);
    } else {
      render(new SorterView(), this.#eventsContainer);
      render(this.#pointListComponent, this.#eventsContainer);
      points.forEach((point) => {
        this.#renderPoint(point);
      });
    }
  }

  #renderPoint(point) {
    const escHandler = (evt) => {
      if (evt.key === 'Escape') {
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escHandler);
      }
    };

    const editFormComponent = new EditFormView({
      point,
      offers: this.#offersModel.getByType(point.type),
      onSubmit: () => {
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escHandler);
      },
      onClick: () => {
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escHandler);
      }
    });

    const pointComponent = new PointView({
      point,
      onClick: () => {
        replacePointToForm.call(this);
        document.addEventListener('keydown', escHandler);
      }
    });

    function replacePointToForm() {
      this.#pointListComponent.element.replaceChild(editFormComponent.element, pointComponent.element);
    }

    function replaceFormToPoint() {
      this.#pointListComponent.element.replaceChild(pointComponent.element, editFormComponent.element);
    }

    render(pointComponent, this.#pointListComponent.element);
  }

}

