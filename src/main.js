import PointsListPresenter from './presenter/pointsListPresenter.js';
import FilterPresenter from './presenter/filterPresenter.js';
import FilterModel from './model/filterModel.js';
import NewPointButtonView from './view/newPointButtonView.js';
import { render } from './framework/render.js';
import { FilterType, UpdateType } from './const.js';

const filterModel = new FilterModel();

const pointsContainer = document.querySelector('.trip-events');

const pointsPresenter = new PointsListPresenter({
  pointsContainer: pointsContainer,
  filterModel: filterModel,
  onNewPointFormClose: handleNewPointFormClose
});

pointsPresenter.init();

const newPointComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

const newPointContainer = document.querySelector('.trip-main');

function handleNewPointFormClose() {
  newPointComponent.element.disabled = false;
  filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
}

function handleNewPointButtonClick() {
  pointsPresenter.openNewPointForm();

  newPointComponent.element.disabled = true;
}

render(newPointComponent, newPointContainer);


const filterContainer = document.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel: filterModel
});

filterPresenter.init();
