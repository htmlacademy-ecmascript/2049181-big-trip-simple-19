import DataModel from './model/data-model.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { render } from './framework/render.js';

const siteBodyElement = document.querySelector('.page-body');
const siteFiltersContainerElement = siteBodyElement.querySelector('.trip-controls__filters');
const siteTripEventsContainerElement = siteBodyElement.querySelector('.trip-events');
const dataModel = new DataModel;
const boardPresenter = new BoardPresenter({
  boardContainer: siteTripEventsContainerElement,
  dataModel
});

render(new FilterView(dataModel.points), siteFiltersContainerElement);
boardPresenter.init();
