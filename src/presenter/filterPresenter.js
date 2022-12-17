import FilterView from '../view/filterView.js';
import { render } from '../render.js';

export default class FilterPresenter {

  constructor({ filterContainer }) {
    this.filterContainer = filterContainer;
  }

  init() {
    render(new FilterView(), this.filterContainer);
  }

}