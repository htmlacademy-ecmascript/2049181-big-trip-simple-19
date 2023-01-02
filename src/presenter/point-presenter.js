import { render, replace } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';


export default class PointPresenter {
  #pointsListContainer = null;
  #newPoint = null;
  #newEditPoint = null;

  constructor({pointsListContainer}) {
    this.#pointsListContainer = pointsListContainer;
  }

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleCloseForm();
    }
  };

  init(point) {
    this.#newPoint = new PointView({...point,
      handleExpandButtonClick: this.#handleOpenForm
    });

    this.#newEditPoint = new PointEditView({... point,
      handleSubmitForm: this.#handleCloseForm,
      handleRollupButtonClick: this.#handleCloseForm
    });

    render(this.#newPoint, this.#pointsListContainer);
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

  #handleOpenForm = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeydownHandler);
  };
}
