import { render } from './framework/render.js';
import DataModel from './model/data-model.js';
import FilterModel from './model/filter-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewTripButtonView from './view/new-trip-button-view.js';
import DataApiService from './data-api-service.js';

const AUTHORIZATION = 'Basic rfD1A6tsmG';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple';

const siteBodyElement = document.querySelector('.page-body');
const tripMainElement = siteBodyElement.querySelector('.trip-main');
const tripEventsContainerElement = siteBodyElement.querySelector('.trip-events');
const dataModel = new DataModel({
  dataApiService: new DataApiService(END_POINT, AUTHORIZATION)
});
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
  boardPresenter.createPoint();
  newPointButton.element.disabled = true;
}

function handleNewPointFormClose() {
  newPointButton.element.disabled = false;
}

filterPresenter.init();
boardPresenter.init();
dataModel.init()
  .finally(() => {
    if(dataModel.isAllDataRecieved) {
      render(newPointButton, tripMainElement);
    }
  });
