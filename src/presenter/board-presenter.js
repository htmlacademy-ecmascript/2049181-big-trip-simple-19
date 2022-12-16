import { render } from '../render.js';
import { RenderPosition } from '../render.js';
import SortView from '../view/sort-view.js';
import PointAddView from '../view/point-add-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class BoardPresenter {
  tripEventsList = new TripEventsListView();

  constructor({boardContainer, pointsModel}) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];

    render(new SortView(), this.boardContainer.firstElementChild, RenderPosition.AFTEREND);
    render(this.tripEventsList, this.boardContainer);
    render(new PointEditView(), this.tripEventsList.getElement());
    render(new PointAddView(), this.tripEventsList.getElement());

    for (let i = 0; i < this.points.length; i++) {
      render(new PointView({point: this.points[i]}), this.tripEventsList.getElement());
    }
    console.log(this.points);
  }

}


