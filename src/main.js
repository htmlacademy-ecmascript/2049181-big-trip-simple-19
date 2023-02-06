import { render } from './framework/render.js';
import DataModel from './model/data-model.js';
import FilterModel from './model/filter-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewTripButtonView from './view/new-trip-button-view.js';

const siteBodyElement = document.querySelector('.page-body');
const tripMainElement = siteBodyElement.querySelector('.trip-main');
const tripEventsContainerElement = siteBodyElement.querySelector('.trip-events');
const dataModel = new DataModel();
const filterModel = new FilterModel();
const newPointButton = new NewTripButtonView({
  onClick: handleNewPointButtonClick
});
const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsContainerElement,
  dataModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});
const filterPresenter = new FilterPresenter({
  filterContainer: tripMainElement,
  filterModel: filterModel,
  dataModel: dataModel
});

function handleNewPointButtonClick() {
  boardPresenter.createTask();
  newPointButton.element.disabled = true;
}

function handleNewPointFormClose() {
  newPointButton.element.disabled = false;
}

filterPresenter.init();
render(newPointButton, tripMainElement);
boardPresenter.init();
