import AbstractView from './abstract-view.js';

const createTripPointListTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class TripPointContainer extends AbstractView {
  get template() {
    return createTripPointListTemplate();
  }
}
