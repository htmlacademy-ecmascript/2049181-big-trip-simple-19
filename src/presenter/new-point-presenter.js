import { UpdateType, UserAction } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';

export default class NewPointPresenter {
  #boardContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #allDestinations = null;
  #getOffersByPointType = null;
  #pointEditComponent = null;

  constructor ({
    boardContainer,
    onDataChange,
    onDestroy,
    allDestinations,
    getOffersByPointType
  }) {
    this.#boardContainer = boardContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#allDestinations = allDestinations;
    this.#getOffersByPointType = getOffersByPointType;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView({
      handleSubmitForm: this.#handleFormSubmit,
      handleDeleteClick: this.#handleDeleteClick,
      allDestinations: this.#allDestinations,
      getOffersByPointType: this.#getOffersByPointType,
    });
    render(this.#pointEditComponent, this.#boardContainer.querySelector('.trip-events__list'), RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
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
