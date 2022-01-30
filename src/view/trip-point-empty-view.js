import {FiltersText} from './const.js';
import AbstractView from './abstract-view.js';

export default class TripPointEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return `<p class="trip-events__msg">${FiltersText[this.#filterType]}</p>`;
  }
}
