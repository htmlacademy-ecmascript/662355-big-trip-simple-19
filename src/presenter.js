import EditFormView from './view/editorFormView.js';
import FilterView from './view/filterView.js';
import PointView from './view/pointView.js';
import SorterView from './view/sorterView.js';
import { render } from './render.js';
import PointListView from './view/pointListView.js';

const tripEventsContainer = document.querySelector('.trip-events');

render(new FilterView(), document.querySelector('.trip-controls__filters'));
render(new SorterView(), tripEventsContainer);
render(new EditFormView(), tripEventsContainer);
render(new PointListView(), tripEventsContainer);
render(new PointView(), tripEventsContainer.querySelector('.trip-events__list'));
render(new PointView(), tripEventsContainer.querySelector('.trip-events__list'));
render(new PointView(), tripEventsContainer.querySelector('.trip-events__list'));
