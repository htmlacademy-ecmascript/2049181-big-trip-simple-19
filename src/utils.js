import dayjs from 'dayjs';

const DATE_TOPIC_FORMAT = 'D MMM';
const DATE_FORMAT = 'YYYY-MM-DD';
const MINUTES_FORMAT = 'HH:MM';

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const humanizeTopicDate = (date) => date
  ? dayjs(date).format(DATE_TOPIC_FORMAT)
  : '';

const humanizeDate = (date) => date
  ? dayjs(date).format(DATE_FORMAT)
  : '';

const humanizeMinutes = (date) => date
  ? dayjs(date).format(MINUTES_FORMAT)
  : '';

const getOffersByPointType = (pointType, offersByType) => offersByType.find((offer) => offer.type === pointType).offers;

export { capitalize, humanizeTopicDate, humanizeDate, humanizeMinutes, getOffersByPointType };
