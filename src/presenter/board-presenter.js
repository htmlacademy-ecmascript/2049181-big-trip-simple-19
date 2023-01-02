import { RenderPosition, render, replace } from '../framework/render.js';
import { getOffersByPointType } from '../utils/common.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import SortView from '../view/sort-view.js';

export default class BoardPresenter {
  #destinationsModel = null;
  #boardContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #tripEventsList = new TripEventsListView();

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

    const escKeydownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escKeydownHandler);
      }
    };

    const pointData = {
      point: {
        ...point,
        destination: this.#destinations.find((item) => item.id === point.destination),
        allOffers: getOffersByPointType(point.type, this.#offers)
      }
    };

    const newPoint = new PointView({...pointData,
      handleExpandButtonClick: () => {
        replacePointToForm.call(this);
        document.addEventListener('keydown', escKeydownHandler);
      }
    });

    const newEditPoint = new PointEditView({... pointData,
      handleSubmitForm: () => {
        replaceFormToPoint.call(this);
      },
      handleRollupButtonClick: () => {
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escKeydownHandler);
      }
    });

    function replacePointToForm() {
      replace(newEditPoint, newPoint);
    }

    function replaceFormToPoint() {
      replace(newPoint, newEditPoint);
    }

    render(newPoint, this.#tripEventsList.element);
  }

  #renderBoard() {
    this.#renderSort();
    this.#renderPoints();
  }

  #renderNoPoints() {
    render(new ListEmptyView(), this.#boardContainer);
  }

  #renderSort() {
    render(new SortView(), this.#boardContainer.firstElementChild, RenderPosition.AFTEREND);
  }

  #renderPoints() {
    if (this.#points.length < 1) {
      this.#renderNoPoints();
      return;
    }

    render(this.#tripEventsList, this.#boardContainer);

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }

  }

}


