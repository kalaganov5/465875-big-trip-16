import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';

const createFilterTemplate = (currentFilterType) => (
  `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" data-filter-type="${FilterType.EVERYTHING}" ${FilterType.EVERYTHING === currentFilterType ? 'checked': ''}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" data-filter-type="${FilterType.FUTURE}" ${FilterType.FUTURE === currentFilterType ? 'checked': ''}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" data-filter-type="${FilterType.PAST}" ${FilterType.PAST === currentFilterType ? 'checked': ''}>
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FilterView extends AbstractView {
  #currentFilter = null;

  constructor (currentFilterType) {
    super();
    this.#currentFilter = currentFilterType;
  }

  get template () {
    return createFilterTemplate(this.#currentFilter);
  }

  setFilterHandler = (callbackFunction) => {
    this._callback.filterHandler = callbackFunction;
    this.element.addEventListener('change', this.#filterHandler);
  }

  #filterHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.classList.contains('trip-filters__filter-input')) {
      this._callback.filterHandler(evt.target.dataset.filterType);
    }
  }
}
