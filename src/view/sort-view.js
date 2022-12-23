import AbstractView from '../framework/view/abstract-view.js';

const createSortItemTemplate = (item, label, isChecked = false, isDisabled = true,) => {
  const handleDisabledClass = (disabledFlag) => disabledFlag
    ? 'disabled'
    : '';

  const handleCheckedClass = (checkedFlag) => checkedFlag
    ? 'checked'
    : '';

  return (
    `<div class="trip-sort__item  trip-sort__item--${item}">
  <input id="sort-${item}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item}" ${handleCheckedClass(isChecked)} ${handleDisabledClass(isDisabled)}>
  <label class="trip-sort__btn" for="sort-${item}">${label}</label>
</div>`
  );
};

const createTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createSortItemTemplate('day', 'Day', true, false)}
    ${createSortItemTemplate('event', 'Event')}
    ${createSortItemTemplate('time', 'Time')}
    ${createSortItemTemplate('price', 'Price', false, false)}
    ${createSortItemTemplate('offer', 'Offers')}
  </form>`
);

export default class SortView extends AbstractView{
  get template() {
    return createTemplate();
  }
}
