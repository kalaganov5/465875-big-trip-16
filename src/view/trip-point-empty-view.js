import {FiltersText} from './const.js';
import AbstractView from './abstract-view.js';

export default class TripPointEmptyView extends AbstractView {
  #currentFilterName = null;

  constructor(filterName = 'everything') {
    super();
    this.#currentFilterName = filterName;
  }

  get template() {
    return `<p class="trip-events__msg">${FiltersText[this.#currentFilterName]}</p>`;
  }
}
