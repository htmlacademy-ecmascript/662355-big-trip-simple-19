import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointTime, machinePointDateTime, humanizePointDate, machinePointDate } from '../utils.js';

function createOfferTemplate(offer) {
  return `<li class="event__offer">
  <span class="event__offer-title">${offer.title}</span>
  &plus;&euro;&nbsp;
  <span class="event__offer-price">${offer.price}</span>
</li>`;
}

function createPointTemplate(point) {
  const offersTemplate = point.offers.map(createOfferTemplate).join('\n');
  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${machinePointDate(point.start)}">${humanizePointDate(point.start)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${point.type} ${point.destination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${machinePointDateTime(point.start)}">${humanizePointTime(point.start)}</time>
        &mdash;
        <time class="event__end-time" datetime="${machinePointDateTime(point.end)}">${humanizePointTime(point.end)}</time>
      </p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${point.price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${offersTemplate}
    </ul>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
}

export default class PointView extends AbstractView {
  #point = null;
  #handleClick = null;

  constructor({ point, onClick }) {
    super();
    this.#point = point;
    this.#handleClick = onClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  #clickHandler = () => {
    this.#handleClick();
  };
}


