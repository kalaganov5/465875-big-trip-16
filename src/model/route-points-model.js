import AbstractObservable from '../utils/abstract-observable.js';

export default class RoutePointsModel extends AbstractObservable {
  #routePoints = [];

  set routePoints(routePoints) {
    this.#routePoints = [...routePoints];
  }

  get routePoints() {
    return this.#routePoints;
  }
}
