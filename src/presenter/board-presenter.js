import TripEventsListView from '../view/trip-events-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortView from '../view/sort-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { filter } from '../utils/filter.js';
import {
  RenderPosition,
  render,
  remove
} from '../framework/render.js';
import {
  SortType,
  UpdateType,
  UserAction,
  FilterType
} from '../const.js';
import {
  sortByDay,
  sortByPrice,
  getOffersByPointType
} from '../utils/point.js';
import NoAdditionalDataView from '../view/no-additional-data-view.js';

const TimeLimit = {
  LOWER: 350,
  UPPER: 1000
};

export default class BoardPresenter {
  #currentSortType = SortType.DAY;
  #boardContainer = null;
  #dataModel = null;
  #filterModel = null;
  #filterType = FilterType.EVERYTHING;
  #tripEventsListComponent = new TripEventsListView();
  #loadingComponent = new LoadingView();
  #noAdditionalDataComponent = null;
  #noPointsComponent = null;
  #sortComponent = null;
  #pointPresenters = new Map ();
  #newPointPresenter = null;
  #onNewPointDestroy = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER,
    upperLimit: TimeLimit.UPPER
  });

  constructor({
    boardContainer,
    dataModel,
    filterModel,
    onNewPointDestroy
  }) {
    this.#boardContainer = boardContainer;
    this.#dataModel = dataModel;
    this.#filterModel = filterModel;
    this.#onNewPointDestroy = onNewPointDestroy;

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

  get offers() {
    return this.#dataModel.offers;
  }

  get destinations() {
    return this.#dataModel.destinations;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter = new NewPointPresenter({
      boardContainer: this.#boardContainer,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointDestroy,
      allDestinations: this.destinations,
      getOffersByPointType: this.#getOffersByPointType
    });

    this.#newPointPresenter.init();
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#tripEventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      allDestinations: this.destinations,
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

    render(this.#sortComponent, this.#boardContainer, RenderPosition.BEFOREEND);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.BEFOREBEGIN);
  }

  #renderEventsListComponent() {
    render(this.#tripEventsListComponent, this.#boardContainer);
  }

  #renderBoard(isAllDataRecieved = true) {
    if (!isAllDataRecieved) {
      this.#noAdditionalDataComponent = new NoAdditionalDataView;
      render(this.#noAdditionalDataComponent, this.#boardContainer);
      return;
    }

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length < 1) {
      this.#renderEventsListComponent();
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderEventsListComponent();
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #clearBoard({resetSortType = false} = {}) {
    if(this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (this.#noAdditionalDataComponent) {
      remove(this.#noAdditionalDataComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #getOffersByPointType = (pointType) => {
    if (this.offers.length > 0) {
      return getOffersByPointType(pointType, this.offers);
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#dataModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#dataModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#dataModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard(data);
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());

    if(this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleNewPointDestroy = () => {
    this.#onNewPointDestroy();

    if (this.points.length < 1) {
      this.#renderEventsListComponent();
      this.#renderNoPoints();
    }
  };
}
