import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { ucFirst } from '../utils/utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';


function createOfferTemplate(offer, checked, isDisabled) {
  return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer" ${checked ? 'checked' : ''} data-offer-id='${offer.id}'  ${isDisabled ? 'disabled' : ''}>
  <label class="event__offer-label" for="event-offer-${offer.id}">
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

function createDestinationTemplate(destination) {
  return ` <option value="${he.encode(destination.name)}"></option>`;
}

function createOffersContainer(offersTemplate) {
  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">
    ${offersTemplate}
  </div>
</section>`;
}

function createDestinationContainer(destination) {
  const picturesTemplate = destination
    .pictures
    .map((picture) => createPictureTemplate(picture))
    .join('\n');
  return `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${destination.description}</p>
</section>
<div class="event__photos-container">
  <div class="event__photos-tape">
    ${picturesTemplate}
  </div>`;
}

const rollButton = `<button class="event__rollup-btn" type="button">
<span class="visually-hidden">Open event</span>
</button>`;

function createFormTemplate(state, offersByType, destinations) {
  const offers = offersByType.find((offer) => state.type === offer.type).offers;
  let offersTemplate = '';
  if (offers.length > 0) {
    const offersTemplateList = offers.map((offer) => createOfferTemplate(offer, state.offers.some((pointOffer) => pointOffer.id === offer.id), state.isDisabled))
      .join('\n');
    offersTemplate = createOffersContainer(offersTemplateList);
  }

  const eventTypeTemplate = offersByType.map((offer) => createEventTypeTemplate(offer.type)).join('\n');
  let selectedDestination = null;
  if (state.destination) {
    selectedDestination = destinations.find((destination) => destination.id === state.destination.id);
  }
  const destinationsTemplate = destinations.map((destination) => createDestinationTemplate(destination)).join('\n');
  const selectedDestinationTemplate = selectedDestination ? createDestinationContainer(selectedDestination) : '';
  const destinationPattern = destinations.map((destination) => destination.name).join('|');
  const price = state.price ? state.price : 0;
  const deleteName = state.isDeleting ? 'Deleting...' : 'Delete';
  const buttonName = state.id ? deleteName : 'Cancel';
  return ` <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${state.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${state.isDisabled ? 'disabled' : ''}>

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(state.destinationName || '')}" pattern="${destinationPattern}" required list="destination-list-1" ${state.isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
             ${destinationsTemplate}
            </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="" ${state.isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="" ${state.isDisabled ? 'disabled' : ''}>
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" min="1" ${state.isDisabled ? 'disabled' : ''}>
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit" ${state.isDisabled ? 'disabled' : ''}>${state.isSaving ? 'Saving...' : 'Save'}</button>
            <button class="event__reset-btn" type="reset" ${state.isDisabled ? 'disabled' : ''}>${buttonName}</button>  
            ${state.id ? rollButton : ''}
          </header>
          <section class="event__details">
            ${offersTemplate}
            ${selectedDestinationTemplate}
            </div>
          </section>
        </form>`;
}

export default class FormView extends AbstractStatefulView {
  #DATE_FORMAT = 'j/m/y H:i';
  #handleSubmit = null;
  #handleRollDown = null;
  #destinations = null;
  #offersByType = null;
  #nameToDestination = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #handleRemove = null;

  constructor({ point, onSubmit, onRollDown, offersByType, destinations, onRemove }) {
    super();
    const newState = point ? this.#parsePointToState(point) : this.#createStateNewForm();
    this._setState(newState);
    this.#handleRemove = onRemove;
    this.#handleSubmit = onSubmit;
    this.#handleRollDown = onRollDown;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#nameToDestination = destinations.reduce((acc, destination) => {
      acc[destination.name] = destination;
      return acc;
    }, {});
    this._restoreHandlers();
  }

  get template() {
    return createFormTemplate(this._state, this.#offersByType, this.#destinations);
  }

  _restoreHandlers = () => {
    this.element.addEventListener('submit', this.#submitHandler);
    if (this._state.id) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpHandler);
    }
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#removeClickHandler);
    this.element.querySelector('#event-price-1').addEventListener('change', this.#priceChangeHandler);
    const offersNodeList = this.element.querySelectorAll('.event__offer-checkbox ');
    offersNodeList.forEach((el) => {
      el.addEventListener('change', this.#offerChangeHandler);
    });
    const eventsNodeList = this.element.querySelectorAll('.event__type-input');
    eventsNodeList.forEach((el) => {
      el.addEventListener('change', this.#eventChangeHandler);
    });
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  };

  removeElement() {
    super.removeElement();

    this.#datepickerStart.destroy();
    this.#datepickerStart = null;

    this.#datepickerEnd.destroy();
    this.#datepickerEnd = null;
  }

  #parsePointToState(point) {
    return {
      ...point,
      destinationName: point.destination.name,
      isSaving: false,
      isDeleting: false,
      isDisabled: false
    };
  }

  #parseStateToPoint() {
    const point = {
      ...this._state,
      price: this._state.price ? this._state.price : 0
    };
    delete point.destinationName;
    delete point.isSaving;
    delete point.isDeleting;
    delete point.isDisabled;
    return point;
  }

  #createStateNewForm() {
    return {
      type: 'bus',
      offers: [],
      start: new Date(),
      end: new Date(),
      isSaving: false,
      isDisabled: false
    };
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    const point = this.#parseStateToPoint();
    this.#handleSubmit(point);
  };

  #rollUpHandler = () => {
    this.#handleRollDown();
  };

  #eventChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      price: +evt.target.value
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = Number.parseInt(evt.target.dataset.offerId, 10);
    if (evt.target.checked) {
      const newOffer = this.#offersByType.find((offer) => offer.type === this._state.type).offers
        .find((offer) => offerId === offer.id);
      this.updateElement({
        offers: [...this._state.offers, newOffer]
      });
    } else {
      this.updateElement({
        offers: this._state.offers.filter((offer) => offerId !== offer.id)
      });
    }
  };

  #removeClickHandler = (evt) => {
    evt.preventDefault();
    const point = this.#parseStateToPoint();
    this.#handleRemove(point);
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#nameToDestination[evt.target.value];
    const newDestination = destination ? this.#nameToDestination[evt.target.value] : null;
    this.updateElement({
      destination: newDestination,
      destinationName: evt.target.value
    });
  };

  #setDatepickerStart() {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: this.#DATE_FORMAT,
        enableTime: true,
        defaultDate: this._state.start,
        onChange: ([userDate]) => {
          const newState = { start: userDate };
          if (userDate > this._state.end) {
            newState.end = userDate;
          }
          this.updateElement(newState);
        }
      }
    );
  }

  #setDatepickerEnd() {
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: this.#DATE_FORMAT,
        enableTime: true,
        defaultDate: this._state.end,
        minDate: this._state.start,
        onChange: ([userDate]) => {
          this.updateElement({
            end: userDate,
          });
        }
      });
  }
}
