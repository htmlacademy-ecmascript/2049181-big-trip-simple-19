import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPES } from '../const.js';
import flatpickr from 'flatpickr';
import {
  isStartDateNotBiggerFinish,
  humanizeEditDate,
  humanizeMinutes,
  capitalize
} from '../utils/point.js';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: '',
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: null,
  id: null,
  offers: [],
  type: TYPES[0],
  allOffers: []
};

const FLATPICKR_DATE_FORMAT = 'd/m/y H:i';

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

const createDestinationCityTemplate = (city) => `<option value="${he.encode(city.name)}"></option>`;

const createDestinationCitiesTemplate = (allCities) => {
  const templates = [];
  allCities.forEach((city) => templates.push(createDestinationCityTemplate(city)));

  return templates.join('\r\n\r\n');
};

const getOfferName = (offer) => offer.title.split(' ').pop();

const createOfferTemplate = (offer, selectedOffers, isDisabled) => {
  const checked = selectedOffers.includes(offer.id)
    ? 'checked'
    : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getOfferName(offer)}-${offer.id}" type="checkbox" name="event-offer-${he.encode(getOfferName(offer))}" ${checked} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${getOfferName(offer)}-${offer.id}">
       <span class="event__offer-title">${he.encode(offer.title)}</span>
       &plus;&euro;&nbsp;
       <span class="event__offer-price">${offer.price}</span>
      </label>
      </div>`
  );
};

const createOffersTemplate = (selectedOffers, allOffers, isDisabled) => {
  const resultOffers = [];
  allOffers.forEach((item) => resultOffers.push(createOfferTemplate(item, selectedOffers, isDisabled)));

  return resultOffers.join('');
};

const createPictureTemplate = (picture) => `<img class="event__photo" src="${he.encode(picture.src)}" alt="${he.encode(picture.description)}">`;

const createPicturesTemplate = (pictures) => {
  const pictureTemplates = [];
  pictures.forEach((picture) => pictureTemplates.push(createPictureTemplate(picture)));

  return pictureTemplates.join('\r\n');
};

const handlePicturesTemplate = (pictures, mode) => (pictures && !mode) ?
  `<div class="event__photos-container">
       <div class="event__photos-tape">
         ${createPicturesTemplate(pictures)}
       </div>
     </div>`
  : '';

const handleDestinationTemplate = (destination, mode) => destination
  ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${he.encode(destination?.description) || ''}</p>
      ${handlePicturesTemplate(destination?.pictures, mode)}
    </section>`
  : '';

const handleOffersTemplate = (selectedOffers, allOffers, isDisabled) => {
  if (allOffers) {

    return allOffers.length !== 0
      ? `<section class="event__section  event__section--offers" >
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers" >
            ${createOffersTemplate(selectedOffers, allOffers, isDisabled)}
          </div>
        </section>`
      : '';
  }
};

const handleRollupButton = (mode, isDisabled) => mode
  ? `<button class="event__rollup-btn" type="button" display="none" ${isDisabled ? 'disabled' : ''}>
      <span class="visually-hidden">Open event</span>
    </button>`
  : `<button class="event__rollup-btn" type="button" display="none" style="display: none ">
       <span class="visually-hidden">Open event</span>
    </button>`;

const createTemplate = (point) => {
  const {basePrice, dateFrom, dateTo, destinationData, type, offers, allOffers, allDestinations, mode, isDisabled, isSaving, isDeleting} = point;
  const handleResetButtonName = () => {
    if (mode && isDeleting) {
      return 'Deleting';
    } else if (mode) {
      return 'Delete';
    } else {
      return 'Cancel';
    }
  };

  const handleDestinationName = () => destinationData?.name
    ? he.encode(destinationData.name)
    : '';


  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post" >
        <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''} >

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${handleDestinationName()}" list="destination-list-1" autocomplete="off" required ${isDisabled ? 'disabled' : ''} >
          <datalist id="destination-list-1">
            ${createDestinationCitiesTemplate(allDestinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeEditDate(dateFrom)} ${humanizeMinutes(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeEditDate(dateTo)} ${humanizeMinutes(dateTo)}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${basePrice}" required ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${handleResetButtonName(basePrice)}</button>
        ${handleRollupButton(mode, isDisabled)}
        </header>
        <section class="event__details">
            ${handleOffersTemplate(offers, allOffers, isDisabled)}
            ${handleDestinationTemplate(destinationData, mode)}
        </section>
      </form>
  </li>`
  );
};

export default class PointEditView extends AbstractStatefulView {
  #handleSubmitForm = null;
  #handleDeleteClick = null;
  #handleRollupButtonClick = null;
  #allDestinations = [];
  #getOffersByPointType = null;
  #startTimeDatepicker = null;
  #endTimeDatepicker = null;
  #mode = null;

  constructor ({
    point = BLANK_POINT,
    handleSubmitForm,
    handleDeleteClick,
    handleRollupButtonClick,
    allDestinations,
    getOffersByPointType,
    mode
  } = {}) {
    super();

    this.#handleSubmitForm = handleSubmitForm;
    this.#handleDeleteClick = handleDeleteClick;
    this.#handleRollupButtonClick = handleRollupButtonClick;
    this.#allDestinations = allDestinations;
    this.#getOffersByPointType = getOffersByPointType;
    this.#mode = mode;

    this._setState(PointEditView.parsePointToState(point, this.#getDestinationById, this.#getOffersByPointType, this.#allDestinations, this.#mode));
    this._restoreHandlers();
  }

  get template() {
    return createTemplate(this._state);
  }

  removeElement() {
    super.removeElement();

    if (this.#startTimeDatepicker && this.#endTimeDatepicker) {
      this.#startTimeDatepicker.destroy();
      this.#startTimeDatepicker = null;
      this.#endTimeDatepicker.destroy();
      this.#endTimeDatepicker = null;
    }
  }

  reset(task) {
    const update = {
      ...task,
      allOffers: this.#getOffersByPointType(task.type),
      destinationData: this.#getDestinationById(task)
    };
    this.updateElement(update);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeButtonClickHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationDatalistChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#eventPriceChangeHandler);

    if (this.#mode) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
    }

    const availableOffers = this.element.querySelector('.event__available-offers');

    if(availableOffers) {
      availableOffers.addEventListener('click', this.#offersClickHandler);
    }

    this.#setStartTimeDatepicker();
    this.#setEndTimeDatepicker();
  }

  #getCheckedOffersIds = () => {
    const checkedOffers = [];
    const allOffers = this.element.querySelectorAll('.event__offer-checkbox:checked');
    allOffers.forEach(
      (offer) => checkedOffers.push(
        Number(
          offer.id
            .split('-')
            .at(-1))
      )
    );

    return checkedOffers;
  };

  #getDestinationById = (point) => this.#allDestinations.find((item) => item.id === point.destination);

  #setStartTimeDatepicker() {
    this.#startTimeDatepicker = flatpickr(
      this.element.querySelector('[name = "event-start-time"]'),
      {
        dateFormat: FLATPICKR_DATE_FORMAT,
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onClose: this.#startTimeChangeHandler
      }
    );
  }

  #setEndTimeDatepicker() {
    this.#endTimeDatepicker = flatpickr(
      this.element.querySelector('[name = "event-end-time"]'),
      {
        dateFormat: FLATPICKR_DATE_FORMAT,
        enableTime: true,
        'time_24hr': true,
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo,
        onClose: this.#endTimeChangeHandler
      }
    );
  }

  #startTimeChangeHandler = ([time]) => {
    const handleDateTo = (dateFrom, dateTo) => isStartDateNotBiggerFinish(dateFrom, dateTo)
      ? dateTo
      : dateFrom;

    this.updateElement({
      dateFrom: time,
      dateTo: handleDateTo(time, this._state.dateTo),
      offers: this.#getCheckedOffersIds()
    });
  };

  #endTimeChangeHandler = ([time]) => {
    this.updateElement({
      dateTo: time,
      offers: this.#getCheckedOffersIds()
    });
  };

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitForm(PointEditView.parseStateToPoint(this._state));
  };

  #deleteClickHandler = () => {
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #rollupButtonClickHandler = () => {
    this.#handleRollupButtonClick();
  };

  #typeButtonClickHandler = (evt) => {
    const pointType = evt.target.innerText.toLowerCase();
    if (pointType) {
      this.updateElement({
        type: pointType,
        allOffers: this.#getOffersByPointType(pointType),
        offers: (this._state.type === pointType) ? this.#getCheckedOffersIds() : []
      });
    }
  };

  #destinationDatalistChangeHandler = (evt) => {
    const newDestinationData = this.#allDestinations.find((item) => item.name === evt.srcElement.value);
    this.updateElement({
      destinationData: newDestinationData,
      destination: newDestinationData?.id
    });
  };

  #eventPriceChangeHandler = (evt) => {
    this.updateElement({
      basePrice: parseInt(evt.target.value, 10)
    });
  };

  #offersClickHandler = (evt) => {
    if(evt.target.type === 'checkbox') {
      this.updateElement({
        offers: this.#getCheckedOffersIds()
      });
    }
  };

  static parsePointToState(point, getDestination, getOffers, allDestinations, mode) {
    return {
      ...point,
      destinationData: getDestination(point),
      allOffers: getOffers(point.type),
      allDestinations: allDestinations,
      mode: mode,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.destinationData;
    delete point.allOffers;
    delete point.allDestinations;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }

}
