import { createElement } from '../render.js';

const createTemplate = () => (
  '<ul class="trip-events__list">'
);

export default class TripEventsListView {
  #element = null;

  get template() {
    return createTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
