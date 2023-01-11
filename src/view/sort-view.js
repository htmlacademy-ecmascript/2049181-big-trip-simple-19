import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortItemTemplate = (item, label, sortType, isChecked = false, isDisabled = true,) => {
  const handleDisabledClass = (disabledFlag) => disabledFlag
    ? 'disabled'
    : '';

  const handleCheckedClass = (checkedFlag) => checkedFlag
    ? 'checked'
    : '';

  const handleDataAttribute = (attribute) => attribute
    ? `data-sort-type="${attribute}"`
    : '';

  return (
    `<div class="trip-sort__item  trip-sort__item--${item}">
  <input id="sort-${item}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item}" ${handleCheckedClass(isChecked)} ${handleDisabledClass(isDisabled)}>
  <label class="trip-sort__btn" for="sort-${item}" ${handleDataAttribute(sortType)}>${label}</label>
</div>`
  );
};

const createTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createSortItemTemplate('day', 'Day', SortType.DAY, true, false)}
    ${createSortItemTemplate('event', 'Event')}
    ${createSortItemTemplate('time', 'Time')}
    ${createSortItemTemplate('price', 'Price', SortType.PRICE, false, false)}
    ${createSortItemTemplate('offer', 'Offers')}
  </form>`
);

export default class SortView extends AbstractView{
  #handleSortChange = null;

  constructor({onSortChange}) {
    super();
    this.#handleSortChange = onSortChange;

    this.element.addEventListener('click', this.#sortChangeHandler);
  }

  get template() {
    return createTemplate();
  }

  #sortChangeHandler = (evt) => {
    if (!evt.target.dataset.sortType) {
      return;
    }


    this.#handleSortChange(evt.target.dataset.sortType);
  };
}
