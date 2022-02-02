import AbstractView from './abstract-view.js';

export default class LoadingErrorView extends AbstractView {
  get template() {
    return '<p class="trip-events__msg shake">Loading Error:</br>Try reloading the page or check back later</p>';
  }
}
