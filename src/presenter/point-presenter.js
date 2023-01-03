import { remove, render, replace } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class PointPresenter {
  #pointsListContainer = null;
  #handleDataChange = null;
  #point = null;
  #newPoint = null;
  #newEditPoint = null;

  constructor({pointsListContainer, onDataChange}) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
  }

  init(point) {
    this.#point = point;

    const prevPoint = this.#newPoint;
    const prevEditPoint = this.#newEditPoint;

    this.#newPoint = new PointView({
      point: this.#point,
      handleExpandButtonClick: this.#handleOpenForm
    });

    this.#newEditPoint = new PointEditView({
      point: this.#point,
      handleSubmitForm: this.#handleSubmitForm,
      handleRollupButtonClick: this.#handleCloseForm
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

  #replacePointToForm() {
    replace(this.#newEditPoint, this.#newPoint);
  }

  #replaceFormToPoint() {
    replace(this.#newPoint, this.#newEditPoint);
  }

  #handleCloseForm = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  #handleSubmitForm = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  #handleOpenForm = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeydownHandler);
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleCloseForm();
    }
  };
}
