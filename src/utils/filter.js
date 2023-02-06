import { isPlannedDate } from './point.js';
import { FilterType } from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => (isPlannedDate(point.dateFrom) || isPlannedDate(point.dateTo)))
};

export { filter };
