import EventsPresenter from './presenter/eventsPresenter.js';
import FilterPresenter from './presenter/filterPresenter.js';

const tripEventsContainer = document.querySelector('.trip-events');

const eventsPresenter = new EventsPresenter({ eventsContainer: tripEventsContainer });

eventsPresenter.init();

const filterContainer = document.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter({ filterContainer: filterContainer });

filterPresenter.init();
