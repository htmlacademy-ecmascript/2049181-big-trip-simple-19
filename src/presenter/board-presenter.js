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

    const getDestination = (id) => this.#destinations.find((item) => item.id === id );

    render(new SortView(), this.#boardContainer.firstElementChild, RenderPosition.AFTEREND);
    render(this.#tripEventsList, this.#boardContainer);
    render(new PointEditView({
      point: {
        ...this.#points[0],
        destination: getDestination(0),
        allOffers: getOffersByPointType(this.#points[0].type, this.#offers)
      }
    }), this.#tripEventsList.element);

    for (let i = 1; i < this.#points.length; i++) {

      render(new PointView({
        point: {
          ...this.#points[i],
          destination: getDestination(i).name,
          allOffers: getOffersByPointType(this.#points[i].type, this.#offers)
        }
      }), this.#tripEventsList.element);
    }
  }

}


