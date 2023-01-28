import Observable from '../framework/observable.js';
import { generatePoints } from '../mock/point.js';

export default class PointsModel extends Observable {
  #points = generatePoints();

  get points() {
    return this.#points;
  }
}
