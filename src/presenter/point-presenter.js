import { remove, render, replace } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { UserAction, UpdateType } from '../const.js';
import { isDateEqual } from '../utils/point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointsListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #point = null;
  #newPoint = null;
  #newEditPoint = null;
  #mode = Mode.DEFAULT;
  #allDestinations = [];
  #getOffersByPointType = null;

  constructor({
    pointsListContainer,
    onDataChange,
    onModeChange,
    allDestinations,
    getOffersByPointType
  }) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#allDestinations = allDestinations;
    this.#getOffersByPointType = getOffersByPointType;
  }

  init(point) {
    this.#point = point;

    const prevPoint = this.#newPoint;
    const prevEditPoint = this.#newEditPoint;

    this.#newPoint = new PointView({
      point: this.#point,
      handleExpandButtonClick: this.#handleOpenForm,
      allDestinations: this.#allDestinations,
      getOffersByPointType: this.#getOffersByPointType
    });

    this.#newEditPoint = new PointEditView({
      point: this.#point,
      handleSubmitForm: this.#handleSubmitForm,
      handleDeleteClick: this.#handleDeleteClick,
      handleRollupButtonClick: this.#handleCloseForm,
      allDestinations: this.#allDestinations,
      getOffersByPointType: this.#getOffersByPointType
    });

    if (prevPoint === null || prevEditPoint === null) {
      render(this.#newPoint, this.#pointsListContainer);
      return;
    }

    if (this.#pointsListContainer.contains(prevPoint.element)) {
      replace(this.#newPoint, prevPoint);
    }

    if (this.#pointsListContainer.contains(prevEditPoint.element)) {
      replace(this.#newEditPoint, prevEditPoint);
    }

    remove(prevPoint);
    remove(prevEditPoint);
  }

  destroy() {
    remove(this.#newPoint);
    remove(this.#newEditPoint);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    replace(this.#newEditPoint, this.#newPoint);
    this.#mode = Mode.EDITING;

    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#newPoint, this.#newEditPoint);
    this.#mode = Mode.DEFAULT;

    document.removeEventListener('keydown', this.#escKeydownHandler);
  }

  #resetEditFormView() {
    this.#newEditPoint.reset(this.#point);
  }

  #handleCloseForm = () => {
    this.#resetEditFormView();
    this.#replaceFormToPoint();
  };

  #handleSubmitForm = (update) => {
    const isPatch = isDateEqual(this.#point.dateFrom, update.dateFrom);
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isPatch ? UpdateType.PATCH : UpdateType.MINOR,
      update);
    this.#replaceFormToPoint();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleOpenForm = () => {
    this.#handleModeChange();
    this.#replacePointToForm();
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleCloseForm();
    }
  };
}
