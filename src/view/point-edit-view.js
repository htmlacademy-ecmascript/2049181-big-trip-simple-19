import { TYPES } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  capitalize,
  humanizeMinutes,
  humanizeEditDate
} from '../utils/point.js';

const BLANK_POINT = {
  basePrice: '',
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: null,
  id: null,
  offers: [],
  type: 'flight',
  allOffers: []
};

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

const createDestinationCityTemplate = (city) => `<option value="${city.name}"></option>`;

const createDestinationCitiesTemplate = (allCities) => {
  const templates = [];
  allCities.forEach((city) => templates.push(createDestinationCityTemplate(city)));

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
  const {basePrice, dateFrom, dateTo, destinationData, type, offers, allOffers, allDestinations} = point;
  const handleResetButtonName = (price) => price > 0
    ? 'Delete'
    : 'Cancel';

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationData?.name || ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createDestinationCitiesTemplate(allDestinations)}
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
        <button class="event__reset-btn" type="reset">${handleResetButtonName(basePrice)}</button>
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
          <p class="event__destination-description">${destinationData?.description || ''}</p>
        </section>
      </section>
    </form>
  </li>`
  );
};

export default class PointEditView extends AbstractStatefulView {
  #handleSubmitForm = null;
  #handleRollupButtonClick = null;
  #allDestinations = [];
  #getOffersByPointType = null;

  constructor ({
    point = BLANK_POINT,
    handleSubmitForm,
    handleRollupButtonClick,
    allDestinations,
    getOffersByPointType
  } = {}) {
    super();

    this.#handleSubmitForm = handleSubmitForm;
    this.#handleRollupButtonClick = handleRollupButtonClick;
    this.#allDestinations = allDestinations;
    this.#getOffersByPointType = getOffersByPointType;
    this._setState(PointEditView.parsePointToState(point, this.#getDestinationById, this.#getOffersByPointType, this.#allDestinations));
    this._restoreHandlers();
  }

  get template() {
    return createTemplate(this._state);
  }

  resetState(task) {
    this.updateElement(task);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeButtonClickHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationDatalistClickHandler);
  }

  #getDestinationById = (point) => this.#allDestinations.find((item) => item.id === point.destination);

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitForm(this._state);
  };

  #rollupButtonClickHandler = () => {
    this.#handleRollupButtonClick();
  };

  #typeButtonClickHandler = (evt) => {
    const pointType = evt.target.innerText.toLowerCase();
    this.updateElement({
      type: pointType,
      allOffers: this.#getOffersByPointType(pointType),
      offers: []
    });
  };

  #destinationDatalistClickHandler = (evt) => {
    const newDestinationData = this.#allDestinations.find((item) => item.name === evt.srcElement.value);
    this.updateElement({
      destinationData: newDestinationData,
      destination: newDestinationData.id
    });
  };

  static parsePointToState(point, getDestination, getOffers, allDestinations) {
    return {
      ...point,
      destinationData: getDestination(point),
      allOffers: getOffers(point.type),
      allDestinations: allDestinations
    };
  }

}
