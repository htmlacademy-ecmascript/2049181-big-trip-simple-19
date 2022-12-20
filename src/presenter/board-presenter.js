import { render, RenderPosition } from '../render.js';
import { getOffersByPointType } from '../utils.js';
import SortView from '../view/sort-view.js';
// import PointAddView from '../view/point-add-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class BoardPresenter {
<<<<<<< Updated upstream
  tripEventsList = new TripEventsListView();
=======
  #destinationsModel = null;
  #boardContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #tripEventsList = new TripEventsListView();
>>>>>>> Stashed changes

  constructor({
    boardContainer,
    pointsModel,
    destinationsModel,
    offersModel
  }) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];
    this.destinations = [...this.destinationsModel.getDestinations()];
    this.offers = [...this.offersModel.getOffers()];

<<<<<<< Updated upstream
    const getDestination = (id) => this.destinations.find((item) => item.id === id );
=======
    if (this.#points.length < 1) {
      render(new ListEmptyView(), this.#boardContainer);
      return;
    }

    render(new SortView(), this.#boardContainer.firstElementChild, RenderPosition.AFTEREND);
    render(this.#tripEventsList, this.#boardContainer);
>>>>>>> Stashed changes


    render(new SortView(), this.boardContainer.firstElementChild, RenderPosition.AFTEREND);
    render(this.tripEventsList, this.boardContainer);
    render(new PointEditView({
      point: {
        ...this.points[0],
        destination: getDestination(0),
        allOffers: getOffersByPointType(this.points[0].type, this.offers)
      }
    }), this.tripEventsList.getElement());

    for (let i = 1; i < this.points.length; i++) {

      render(new PointView({
        point: {
          ...this.points[i],
          destination: getDestination(i).name,
          allOffers: getOffersByPointType(this.points[i].type, this.offers)
        }
      }), this.tripEventsList.getElement());
    }
  }

}


