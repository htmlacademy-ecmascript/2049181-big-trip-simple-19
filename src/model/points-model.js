import { generatePoints } from '../mock/point.js';

export default class PointsModel {
  #points = generatePoints();

  get points() {
    return this.#points;
  }
}
