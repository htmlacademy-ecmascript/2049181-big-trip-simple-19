import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { render } from './framework/render.js';

const siteBodyElement = document.querySelector('.page-body');
const siteFiltersContainerElement = siteBodyElement.querySelector('.trip-controls__filters');
const siteTripEventsContainerElement = siteBodyElement.querySelector('.trip-events');
const pointsModel = new PointsModel;
const destinationsModel = new DestinationsModel;
const offersModel = new OffersModel;
const boardPresenter = new BoardPresenter({
  boardContainer: siteTripEventsContainerElement,
  pointsModel,
  destinationsModel,
  offersModel
});

render(new FilterView(), siteFiltersContainerElement);
boardPresenter.init();
