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

  updateRoutePoints = async (updateType, update) => {
    const index = this.#routePoints.findIndex((routePoint) => (routePoint.id === update.id));

    if (index === -1) {
      throw new Error ('Can\'t update unexisting routePoint');
    }

    try {
      const response = await this.#apiService.updateTripPoint(update);
      const updatedTripPoint = this.#adaptToClient(response);

      this.#routePoints = [
        ...this.#routePoints.slice(0, index),
        updatedTripPoint,
        ...this.#routePoints.slice(index + 1),
      ];

      this._notify(updateType, updatedTripPoint);
    } catch(error) {
      throw new Error('Can\'t update routePoint');
    }
  }

  addRoutePoint = async (updateType, update) => {
    try {
      const response = await this.#apiService.addTripPoint(update);
      const newTripPoint = this.#adaptToClient(response);
      this.#routePoints = [newTripPoint, ...this.#routePoints];
      this._notify(updateType, newTripPoint);
    } catch(err) {
      throw new Error('Can\'t add route point');
    }
  }

  deleteRoutePoint = async (updateType, update) => {
    const index = this.#routePoints.findIndex((routePoint) => (routePoint.id === update.id));

    if (index === -1) {
      throw new Error('Can\'t delete unexisting routePoint');
    }

    try {
      await this.#apiService.deleteTripPoint(update);
      this.#routePoints = [
        ...this.#routePoints.slice(0, index),
        ...this.routePoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete trip point');
    }
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
