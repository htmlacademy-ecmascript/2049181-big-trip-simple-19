import TripEventsListView from '../view/trip-events-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import {RenderPosition, render, remove} from '../framework/render.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import { filter } from '../utils/filter.js';
import {
  sortByDay,
  sortByPrice,
  getOffersByPointType
} from '../utils/point.js';

export default class BoardPresenter {
  #currentSortType = SortType.DAY;
  #boardContainer = null;
  #dataModel = null;
  #filterModel = null;
  #filterType = FilterType.EVERYTHING;
  #destinations = [];
  #offers = [];
  #tripEventsList = new TripEventsListView();
  #pointPresenters = new Map ();
  #sortComponent = null;
  #noPointsComponent = null;

  constructor({
    boardContainer,
    dataModel,
    filterModel
  }) {
    this.#boardContainer = boardContainer;
    this.#dataModel = dataModel;
    this.#filterModel = filterModel;

    this.#dataModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#dataModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }
    return filteredPoints;
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

  #renderNoPoints() {
    this.#noPointsComponent = new ListEmptyView({
      filterType: this.#filterType
    });

    render(this.#noPointsComponent, this.#boardContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortChange: this.#handleSortChange,
      currentSortType: this.#currentSortType
    });
    render(this.#sortComponent, this.#boardContainer.firstElementChild, RenderPosition.AFTEREND);
  }

  #renderBoard() {
    if (this.points.length < 1) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    render(this.#tripEventsList, this.#boardContainer);
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #getOffersByPointType = (pointType) => getOffersByPointType(pointType, this.#offers);

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#dataModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#dataModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#dataModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

}
