import AbstractObservable from '../utils/abstract-observable.js';

export default class RoutePointsModel extends AbstractObservable {
  #routePoints = [];

  set routePoints(routePoints) {
    this.#routePoints = [...routePoints];
  }

  get routePoints() {
    return this.#routePoints;
  }

  updateRoutePoints = (updateType, update) => {
    const index = this.#routePoints.findIndex((routePoint) => (routePoint.id === update.id));

    if (index === -1) {
      throw new Error ('Can\'t update unexisting routePoint');
    }

    this.#routePoints = [
      ...this.#routePoints.slice(0, index),
      update,
      ...this.#routePoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addRoutePoint = (updateType, update) => {
    this.#routePoints = [
      update,
      ...this.#routePoints,
    ];

    this._notify(updateType, update);
  }

  deleteRoutePoint = (updateType, update) => {
    const index = this.#routePoints.findIndex((routePoint) => (routePoint.id === update.id));

    if (index === -1) {
      throw new Error('Can\'t delete unexisting routePoint');
    }

    this.#routePoints = [
      ...this.#routePoints.slice(0, index),
      ...this.routePoints.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
