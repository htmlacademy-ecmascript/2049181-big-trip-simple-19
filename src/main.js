import DataModel from './model/data-model.js';
import FilterModel from './model/filter-model.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { render } from './framework/render.js';
import { generateFilter } from './utils/filter.js';

const siteBodyElement = document.querySelector('.page-body');
const siteFiltersContainerElement = siteBodyElement.querySelector('.trip-controls__filters');
const siteTripEventsContainerElement = siteBodyElement.querySelector('.trip-events');
const dataModel = new DataModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  boardContainer: siteTripEventsContainerElement,
  dataModel
});

const filters = generateFilter(dataModel.points);

render(new FilterView({filters}), siteFiltersContainerElement);
boardPresenter.init();
