import dayjs from 'dayjs';

const DATE_TOPIC_FORMAT = 'D MMM';
const DATE_FORMAT = 'YYYY-MM-DD';
const MINUTES_FORMAT = 'HH:MM';
const DATE_EDIT_FORMAT = 'DD/MM/YY';

const humanizeTopicDate = (date) => date
  ? dayjs(date).format(DATE_TOPIC_FORMAT)
  : '';

const humanizeDate = (date) => date
  ? dayjs(date).format(DATE_FORMAT)
  : '';

const humanizeMinutes = (minutes) => minutes
  ? dayjs(minutes).format(MINUTES_FORMAT)
  : '';

const humanizeEditDate = (date) => date
  ? dayjs(date).format(DATE_EDIT_FORMAT)
  : '';

const capitalize = (text) => text
  ? text.charAt(0).toUpperCase() + text.slice(1)
  : '';

const getWeightForNullValue = (valueA, valueB) => {
  if (valueA === null && valueB === null) {
    return 0;
  }

  if (valueA === null) {
    return 1;
  }

  if (valueB === null) {
    return -1;
  }

  return null;
};

const sortByDay = (pointA, pointB) => {
  const weight = getWeightForNullValue(pointA, pointB);
  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

const sortByPrice = (pointA, pointB) => {
  const weight = getWeightForNullValue(pointA, pointB);
  return weight ?? pointB.basePrice - pointA.basePrice;
};

export {
  humanizeTopicDate,
  humanizeEditDate,
  humanizeMinutes,
  humanizeDate,
  capitalize,
  sortByDay,
  sortByPrice
};
