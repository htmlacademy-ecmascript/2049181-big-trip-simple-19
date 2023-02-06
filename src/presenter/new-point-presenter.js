import { nanoid } from 'nanoid';
import { UpdateType, UserAction } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';

export default class NewPointPresenter {
  #pointsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #allDestinations = null;
  #getOffersByPointType = null;

  #pointEdit = null;

  constructor ({
    pointsListContainer,
    onDataChange,
    onDestroy,
    allDestinations,
    getOffersByPointType
  }) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#allDestinations = allDestinations;
    this.#getOffersByPointType = getOffersByPointType;
  }

  init() {
    if (this.#pointEdit !== null) {
      return;
    }

    this.#pointEdit = new PointEditView({
      handleSubmitForm: this.#handleFormSubmit,
      handleDeleteClick: this.#handleDeleteClick,
      allDestinations: this.#allDestinations,
      getOffersByPointType: this.#getOffersByPointType,
    });

    render(this.#pointEdit, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEdit === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEdit);
    this.#pointEdit = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point}
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
