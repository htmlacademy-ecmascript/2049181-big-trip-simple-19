import { generatePoints } from '../mock/point.js';

export default class PointsModel {
  points = generatePoints();

  getPoints() {
    return this.points;
  }
}
