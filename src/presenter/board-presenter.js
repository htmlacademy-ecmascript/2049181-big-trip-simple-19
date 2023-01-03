import { RenderPosition, render } from '../framework/render.js';
import { getOffersByPointType, updateItem } from '../utils/common.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #tripEventsList = new TripEventsListView();
  #pointPresenters = new Map ();

  constructor({
    boardContainer,
    pointsModel,
    destinationsModel,
    offersModel
  }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#renderBoard();
  }

  #renderPoint(point) {
    const pointData = {
      point: {
        ...point,
        destination: this.#destinations.find((item) => item.id === point.destination),
        allOffers: getOffersByPointType(point.type, this.#offers)
      }
    };

    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#tripEventsList.element
    });

    pointPresenter.init(pointData);
    this.#pointPresenters.set(pointData.point.id, pointPresenter);
  }

  #renderBoard() {
    if (this.#points.length < 1) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }

  #renderNoPoints() {
    render(new ListEmptyView(), this.#boardContainer);
  }

  #renderSort() {
    render(new SortView(), this.#boardContainer.firstElementChild, RenderPosition.AFTEREND);
  }

  #renderPointsList() {
    render(this.#tripEventsList, this.#boardContainer);

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handlePointChange(updatedPoint) {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  }
}
