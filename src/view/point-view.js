import { createElement } from '../render.js';
import {
  capitalize,
  humanizeDate,
  humanizeMinutes,
  humanizeTopicDate
} from '../utils.js';

const NO_OFFERS_TEMPLATE = (
  `<li class="event__offer">
<span class="event__offer-title">No additional offers</span>
</li>`
);

const createOfferTemplate = (offer) => (
  `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>`
);

const createOffersTemplate = (allOffers, selectedOffers) => {
  let offersTemplate = NO_OFFERS_TEMPLATE;

  if (selectedOffers.length > 0) {
    const resultOffers = [];

    allOffers.forEach((offer) => {
      if (selectedOffers.includes(offer.id)) {
        resultOffers.push(createOfferTemplate(offer));
      }
    });

    offersTemplate = resultOffers.join('\r\n');
  }

  return offersTemplate;
};

const createTemplate = (point) => {
  const {basePrice, dateFrom, dateTo, destination, type, offers, allOffers} = point;

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${humanizeDate(dateFrom)}">${humanizeTopicDate(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${capitalize(type)} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${humanizeDate(dateFrom)}T${humanizeMinutes(dateFrom)}">${humanizeMinutes(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${humanizeDate(dateTo)}T${humanizeMinutes(dateTo)}">${humanizeMinutes(dateTo)}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${createOffersTemplate(allOffers, offers)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
};

export default class PointView {
  constructor ({point}) {
    this.point = point;
  }

  getTemplate() {
    return createTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
