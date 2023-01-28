import TripEventsListView from '../view/trip-events-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import { RenderPosition, render } from '../framework/render.js';
import { SortType } from '../const.js';
import {
  sortByDay,
  sortByPrice,
  getOffersByPointType
} from '../utils/point.js';

export default class BoardPresenter {
  #currentSortType = SortType.DAY;
  #boardContainer = null;
  #dataModel = null;
  #destinations = [];
  #offers = [];
  #tripEventsList = new TripEventsListView();
  #pointPresenters = new Map ();

  constructor({
    boardContainer,
    dataModel
  }) {
    this.#boardContainer = boardContainer;
    this.#dataModel = dataModel;

    this.#dataModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#dataModel.points].sort(sortByDay);
      case SortType.PRICE:
        return [...this.#dataModel.points].sort(sortByPrice);
    }
    return this.#dataModel.points;
  }

  init() {
    this.#destinations = [...this.#dataModel.destinations];
    this.#offers = [...this.#dataModel.offers];
    this.#renderBoard();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#tripEventsList.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      allDestinations: this.#destinations,
      getOffersByPointType: this.#getOffersByPointType
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderBoard() {
    if (this.points.length < 1) {
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
    render(new SortView({
      onSortChange: this.#handleSortChange
    }), this.#boardContainer.firstElementChild, RenderPosition.AFTEREND);
  }

  #renderPointsList() {
    render(this.#tripEventsList, this.#boardContainer);
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #getOffersByPointType = (pointType) => getOffersByPointType(pointType, this.#offers);

  #handleViewAction = (actionType, update) => {
    console.log(actionType, update);
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointsList();
    this.#renderPointsList();
  };

}
