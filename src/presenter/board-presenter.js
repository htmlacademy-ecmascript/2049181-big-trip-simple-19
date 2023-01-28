import { RenderPosition, render } from '../framework/render.js';
import { getOffersByPointType } from '../utils/common.js';
import { sortByDay, sortByPrice } from '../utils/point.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import { SortType } from '../const.js';

export default class BoardPresenter {
  #currentSortType = SortType.DAY;
  #boardContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
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

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortByDay);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortByPrice);
    }
    return this.#pointsModel.points;
  }

  init() {
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];
    this.#renderBoard();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#tripEventsList.element,
      onDataChange: this.#handlePointChange,
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

  #handlePointChange = (updatedPoint) => {
    //Здесь будем вызывать обновление модели
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
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
