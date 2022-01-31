import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';

export default class RoutePointsModel extends AbstractObservable {
  #apiService = null;
  #routePoints = [];

  constructor (apiService) {
    super();
    this.#apiService = apiService;
  }

  get routePoints() {
    return this.#routePoints;
  }

  init = async () => {
    try {
      const tripPoints = await this.#apiService.tripPoints;
      this.#routePoints = tripPoints.map(this.#adaptToClient);
    } catch (error) {
      this.#routePoints = [];
    }

    this._notify(UpdateType.INIT);
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

  #adaptToClient = (tripPoints) => {
    const adaptedTripPoints = {
      ...tripPoints,
      timeStart: new Date(tripPoints['date_from']),
      timeEnd: new Date(tripPoints['date_to']),
      info: {
        description: tripPoints.destination.description,
        photos: tripPoints.destination.pictures,
      },
      destination: tripPoints.destination.name,
      price: tripPoints.base_price,
      isFavorite: tripPoints.is_favorite,
    };

    // Ненужные ключи мы удаляем
    delete adaptedTripPoints['date_from'];
    delete adaptedTripPoints['date_to'];
    delete adaptedTripPoints['base_price'];
    delete adaptedTripPoints['is_favorite'];

    return adaptedTripPoints;
  }
}
