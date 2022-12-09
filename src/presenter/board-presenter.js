import { render } from '../render.js';
import { RenderPosition } from '../render.js';
import SortView from '../view/sort-view.js';
import PointAddView from '../view/point-add-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class BoardPresenter {
  tripEventsList = new TripEventsListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new SortView(), this.boardContainer.firstElementChild, RenderPosition.AFTEREND);
    render(this.tripEventsList, this.boardContainer);
    render(new PointEditView(), this.tripEventsList.getElement());
    render(new PointAddView(), this.tripEventsList.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.tripEventsList.getElement());
    }
  }

}


