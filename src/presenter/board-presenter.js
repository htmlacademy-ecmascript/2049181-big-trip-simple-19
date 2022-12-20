import { render, RenderPosition } from '../render.js';
import { getOffersByPointType } from '../utils.js';
import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class BoardPresenter {
  #destinationsModel = null;
  #boardContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #points = null;
  #destinations = null;
  #offers = null;
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

    render(new SortView(), this.#boardContainer.firstElementChild, RenderPosition.AFTEREND);
    render(this.#tripEventsList, this.#boardContainer);

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #renderPoint(point) {

    const pointData = {
      point: {
        ...point,
        destination: this.#destinations.find((item) => item.id === point.destination),
        allOffers: getOffersByPointType(point.type, this.#offers)
      }
    };

    const newPoint = new PointView(pointData);

    const newEditPoint = new PointEditView(pointData);

    const replacePointToForm = () => this.#tripEventsList.element.replaceChild(newEditPoint.element, newPoint.element);

    const replaceFormToPoint = () => this.#tripEventsList.element.replaceChild(newPoint.element, newEditPoint.element);

    const escKeydownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeydownHandler);
      }
    };

    newPoint.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', escKeydownHandler);
    });

    newEditPoint.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
    });

    newEditPoint.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeydownHandler);
    });

    render(newPoint, this.#tripEventsList.element);
  }

}


