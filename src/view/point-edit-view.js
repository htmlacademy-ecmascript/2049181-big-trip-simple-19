import { TYPES } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import {
  capitalize,
  humanizeMinutes,
  humanizeEditDate
} from '../utils.js';

const createEventTypeItemTemplate = (type, pointType) => {
  const handleCheckedClass = () => pointType === type
    ? 'checked'
    : '';

  return (
    `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${handleCheckedClass()}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
  </div>`
  );};

const createEventTypeItemsTemplate = (allTypes, pointType) => {
  const templates = [];
  allTypes.forEach((type) => templates.push(createEventTypeItemTemplate(type, pointType)));

  return templates.join('\r\n\r\n');
};

const getOfferName = (offer) => offer.title.split(' ').pop();

const createOfferTemplate = (offer, selectedOffers) => {
  const checked = selectedOffers.includes(offer.id)
    ? 'checked'
    : '';

  return (
    `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getOfferName(offer)}-${offer.id}" type="checkbox" name="event-offer-${getOfferName(offer)}" ${checked}>
  <label class="event__offer-label" for="event-offer-${getOfferName(offer)}-${offer.id}">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>`
  );
};

const createOffersTemplate = (selectedOffers, allOffers) => {
  const resultOffers = [];

  allOffers.forEach((item) => resultOffers.push(createOfferTemplate(item, selectedOffers)));

  return resultOffers.sort((item) => item.indexOf('checked')).reverse().join('');
};


const createTemplate = (point) => {
  const {basePrice, dateFrom, dateTo, destination, type, offers, allOffers} = point;

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${createEventTypeItemsTemplate(TYPES, point.type)}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${capitalize(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeEditDate(dateFrom)} ${humanizeMinutes(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeEditDate(dateTo)} ${humanizeMinutes(dateTo)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createOffersTemplate(offers, allOffers)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
        </section>
      </section>
    </form>
  </li>`
  );
};

export default class PointEditView extends AbstractView {
  #point = null;
  #handleSubmitForm = null;
  #handleRollupButtonClick = null;

  constructor ({point, handleSubmitForm, handleRollupButtonClick}) {
    super();
    this.#point = point;
    this.#handleSubmitForm = handleSubmitForm;
    this.#handleRollupButtonClick = handleRollupButtonClick;

    this.element.querySelector('form').addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
  }

  get template() {
    return createTemplate(this.#point);
  }

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitForm();
  };

  #rollupButtonClickHandler = () => {
    this.#handleRollupButtonClick();
  };
}
