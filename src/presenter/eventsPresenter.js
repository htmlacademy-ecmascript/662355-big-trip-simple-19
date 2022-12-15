import EditFormView from '../view/editorFormView.js';
import PointView from '../view/pointView.js';
import SorterView from '../view/sorterView.js';
import { render } from '../render.js';
import PointListView from '../view/pointListView.js';
import PointsModel from '../model/modelPoint.js';
import DestinationsModel from '../model/modelDestination.js';
import OffersModel from '../model/modelOffers.js';


export default class EventsPresenter {
  pointListComponent = new PointListView();
  destinationsModel = new DestinationsModel();
  pointsModel = new PointsModel();
  offersModel = new OffersModel();

  constructor({ eventsContainer }) {
    this.eventsContainer = eventsContainer;
  }

  init() {
    const points = this.pointsModel.getPoints().map((point) => {
      point.destination = this.destinationsModel.getById(point.destination);
      point.offers = point.offers.map((offerId) => this.offersModel.getByTypeAndId(offerId, point.type));
      return point;
    });
    render(new SorterView(), this.eventsContainer);
    render(new EditFormView(points[1], this.offersModel.getByType(points[1].type)), this.eventsContainer);
    render(this.pointListComponent, this.eventsContainer);
    points.forEach((point) => {
      render(new PointView(point), this.pointListComponent.getElement());
    });
  }

}

