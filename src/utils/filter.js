import { isPlannedDate } from './point.js';

const generateFilter = (points) => points.filter((point) => isPlannedDate(point.dateFrom));

export { generateFilter };
