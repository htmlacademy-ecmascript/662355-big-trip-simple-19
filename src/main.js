import PointsListPresenter from './presenter/pointsListPresenter.js';
import FilterPresenter from './presenter/filterPresenter.js';

const pointsContainer = document.querySelector('.trip-events');

const pointsPresenter = new PointsListPresenter({ pointsContainer });

pointsPresenter.init();

const filterContainer = document.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter({ filterContainer: filterContainer });

filterPresenter.init();
