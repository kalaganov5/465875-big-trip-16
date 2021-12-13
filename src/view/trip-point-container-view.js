import {createElement} from '../render.js';

const createTripPointListTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class TripPointContainer {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createTripPointListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
