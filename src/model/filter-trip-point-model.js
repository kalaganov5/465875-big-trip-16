import AbstractObservable from '../utils/abstract-observable.js';
import {FilterType} from '../const.js';

export default class FilterTripPointsModel extends AbstractObservable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filterType) => {
    console.log(updateType, filterType)
    this.#filter = filterType;
    this._notify(updateType, filterType);
  }
}
