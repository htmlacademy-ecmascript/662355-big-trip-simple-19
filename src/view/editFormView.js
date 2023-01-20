import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeFormDate, ucFirst } from '../utils.js';

function createOfferTemplate(offer, checked) {
  return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${checked ? 'checked' : ''}>
  <label class="event__offer-label" for="event-offer-luggage-1">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>`;
}

function createEventTypeTemplate(type) {
  return `<div class="event__type-item">
<input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
<label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${ucFirst(type)}</label>
</div>`;
}

function createPictureTemplate(picture) {
  return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
}

function createDestinationTemplate(destination){
  return ` <option value="${destination.name}"></option>`;
}

function createFormTemplate(state, offersByType, destinations) {
  const offersTemplate = offersByType.find((offer) => state.type === offer.type)
    .offers
    .map((offer) => createOfferTemplate(offer, state.offers.some((pointOffer) => pointOffer.id === offer.id)))
    .join('\n');
  const eventTypeTemplate = offersByType.map((offer) => offer.type).map((type) => createEventTypeTemplate(type)).join('\n');
  const picturesTemplate = state.destination.pictures.map((picture) => createPictureTemplate(picture)).join('\n');
  const destinationsTemplate = destinations.map((destination) => createDestinationTemplate(destination)).join('\n');
  return ` <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${state.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${eventTypeTemplate}

              </fieldset>
            </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${state.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${state.destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
             ${destinationsTemplate}
            </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeFormDate(state.start)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeFormDate(state.end)}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${state.price}">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </header>
          <section class="event__details">
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">
                ${offersTemplate}
              </div>
            </section>

            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${state.destination.description}</p>
            </section>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${picturesTemplate}
              </div>
            </div>
          </section>
        </form>`;
}

export default class EditFormView extends AbstractStatefulView {
  #handleSubmit = null;
  #handleClick = null;
  #destinations = null;
  #offersByType = null;

  constructor({ point, onSubmit, onClick, offersByType, destinations }) {
    super();
    this._setState(this.#parseToState(point));
    this.#handleSubmit = onSubmit;
    this.#handleClick = onClick;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this._restoreHandlers();
  }

  get template() {
    return createFormTemplate(this._state, this.#offersByType, this.#destinations);
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit();
  };

  #clickHandler = () => {
    this.#handleClick();
  };

  _restoreHandlers = () => {
    this.element.addEventListener('submit', this.#submitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
    const eventsNodeList = this.element.querySelectorAll('.event__type-input');
    // преобразование NodeList в массив
    Array.from(eventsNodeList)
      .forEach((el) => {
        el.addEventListener('change', this.#eventChangeHandler);
      });
  };

  #parseToState(point) {
    return {
      ...point,
    };
  }

  #eventChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value
    });
  };


}
