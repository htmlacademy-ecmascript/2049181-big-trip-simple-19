import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const NoTaskTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now'
};

const createTemplate = (filterType) => `<p class="trip-events__msg">${NoTaskTextType[filterType]}</p>`;

export default class ListEmptyView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createTemplate(this.#filterType);
  }
}
