import { render, RenderPosition } from '../render.js';
import { getOffersByPointType } from '../utils.js';
import SortView from '../view/sort-view.js';
import PointAddView from '../view/point-add-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class BoardPresenter {
  tripEventsList = new TripEventsListView();

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

    const getDestinationName = (id) => this.destinations.find((item) => item.id === id ).name;


    render(new SortView(), this.boardContainer.firstElementChild, RenderPosition.AFTEREND);
    render(this.tripEventsList, this.boardContainer);
    render(new PointEditView(), this.tripEventsList.getElement());
    render(new PointAddView(), this.tripEventsList.getElement());

    for (let i = 0; i < this.points.length; i++) {
      const allOffersByType = getOffersByPointType(this.points[i].type, this.offers);

      render(new PointView({
        point: {
          ...this.points[i],
          destination: getDestinationName(i),
          allOffers: allOffersByType
        }
      }), this.tripEventsList.getElement());
    }
  }

}


