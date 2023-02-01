import {isPlannedDate} from './point.js';

const filter = (points) => points.filter((point) => isPlannedDate(point.dateFrom));

export {filter};
