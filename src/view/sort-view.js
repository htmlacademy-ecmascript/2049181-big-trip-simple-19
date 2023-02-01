import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortItemTemplate = (item, label, sortType, currentSortType, isDisabled = true,) => {

  const handleDisabledClass = (disabledFlag) => disabledFlag
    ? 'disabled'
    : '';

  const handleCheckedClass = (currentSort) => (sortType && currentSort === sortType)
    ? 'checked'
    : '';

  const handleDataAttribute = (attribute) => attribute
    ? `data-sort-type="${attribute}"`
    : '';

  return (
    `<div class="trip-sort__item  trip-sort__item--${item}">
  <input id="sort-${item}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item}" ${handleCheckedClass(currentSortType)} ${handleDisabledClass(isDisabled)}>
  <label class="trip-sort__btn" for="sort-${item}" ${handleDataAttribute(sortType)}>${label}</label>
</div>`
  );
};

const createTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createSortItemTemplate('day', 'Day', SortType.DAY, currentSortType, false)}
    ${createSortItemTemplate('event', 'Event')}
    ${createSortItemTemplate('time', 'Time')}
    ${createSortItemTemplate('price', 'Price', SortType.PRICE, currentSortType, false)}
    ${createSortItemTemplate('offer', 'Offers')}
  </form>`
);

export default class SortView extends AbstractView{
  #handleSortChange = null;
  #currentSortType = null;

  constructor({onSortChange, currentSortType}) {
    super();
    this.#handleSortChange = onSortChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('click', this.#sortChangeHandler);
  }

  get template() {
    return createTemplate(this.#currentSortType);
  }

  #sortChangeHandler = (evt) => {
    if (!evt.target.dataset.sortType) {
      return;
    }

    this.#handleSortChange(evt.target.dataset.sortType);
  };
}
