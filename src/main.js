import DataModel from './model/data-model.js';
import FilterModel from './model/filter-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteBodyElement = document.querySelector('.page-body');
const siteFiltersContainerElement = siteBodyElement.querySelector('.trip-controls__filters');
const siteTripEventsContainerElement = siteBodyElement.querySelector('.trip-events');
const dataModel = new DataModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  boardContainer: siteTripEventsContainerElement,
  dataModel,
  filterModel
});
const filterPresenter = new FilterPresenter({
  filterContainer: siteFiltersContainerElement,
  filterModel: filterModel,
  dataModel: dataModel
});

filterPresenter.init();
boardPresenter.init();
