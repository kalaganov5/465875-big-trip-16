import AbstractObservable from '../utils/abstract-observable.js';
import {FilterType} from '../const.js';

export default class FilterTripPointsModel extends AbstractObservable {
  #filter = FilterType.EVERYTHING;

  get filterType() {
    return this.#filter;
  }

  setFilterType = (filterType) => {
    this.#filter = filterType;
  }

  setFilter = (updateType, filterType) => {
    this.#filter = filterType;
    this._notify(updateType, filterType);
  }
}
