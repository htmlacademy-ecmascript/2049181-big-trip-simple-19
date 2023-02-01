import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  const handleChecked = () => currentFilterType === type ? 'checked' : '';
  const handleDisabled = () => count === 0 ? 'disabled' : '';

  // console.log(type, currentFilterType);
  return (
    `<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${handleChecked()} ${handleDisabled()}>
    <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
  </div>`
  );
};

const createTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters
    .map((filter) => createFilterTemplate(filter, currentFilterType))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">

    ${filterItemsTemplate}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #onFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#onFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterTypeChange(evt.target.value);
  };
}
