import EditFormView from '../view/editorFormView.js';
import PointView from '../view/pointView.js';
import SorterView from '../view/sorterView.js';
import { render } from '../render.js';
import PointListView from '../view/pointListView.js';
import PointsModel from '../model/modelPoint.js';
import DestinationsModel from '../model/modelDestination.js';
import OffersModel from '../model/modelOffers.js';


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
    render(new SorterView(), this.#eventsContainer);
    render(this.#pointListComponent, this.#eventsContainer);
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const editFormComponent = new EditFormView(point, this.#offersModel.getByType(point.type));
    const pointComponent = new PointView(point);
    const replacePointToForm = () => {
      this.#pointListComponent.element.replaceChild(editFormComponent.element, pointComponent.element);
    };
    const replaceFormToPoint = () => {
      this.#pointListComponent.element.replaceChild(pointComponent.element, editFormComponent.element);
    };
    editFormComponent.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
    });
    editFormComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
    });
    const escHendler = (evt) => {
      if (evt.key === 'Escape') {
        replaceFormToPoint();
        document.removeEventListener('keydown', escHendler);
      }
    };
    document.addEventListener('keydown', escHendler);
    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
    });

    render(pointComponent, this.#pointListComponent.element);
  }


}

