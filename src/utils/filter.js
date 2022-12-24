import dayjs from 'dayjs';

const isPointDateInFuture = (point) => !(dayjs().isAfter(point.dateFrom, 'D'));

const filter = (points) => points.filter((point) => isPointDateInFuture(point));

export { filter };
