import {createElement} from '../render.js';
import {FilterNames} from './const.js';

export default class TripPointEmptyView {
  #element = null;
  #currentFilterName = null;

  constructor(filterName = 'everything') {
    this.#currentFilterName = filterName;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return `<p class="trip-events__msg">${FilterNames[this.#currentFilterName]}</p>`;
  }

  removeElement() {
    this.#element = null;
  }
}
