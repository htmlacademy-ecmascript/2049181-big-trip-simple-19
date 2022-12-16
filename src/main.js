import PointsModel from './model/points-model.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { render } from './render.js';

const siteBodyElement = document.querySelector('.page-body');
const siteFiltersContainerElement = siteBodyElement.querySelector('.trip-controls__filters');
const siteTripEventsContainerElement = siteBodyElement.querySelector('.trip-events');
const pointsModel = new PointsModel;
const boardPresenter = new BoardPresenter({
  boardContainer: siteTripEventsContainerElement,
  pointsModel
});

render(new FilterView(), siteFiltersContainerElement);
boardPresenter.init();

