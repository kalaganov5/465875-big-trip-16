import AbstractView from './abstract-view.js';
import {MenuItem} from '../const.js';

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn trip-tabs__btn--active" data-menu-item="${MenuItem.TRIP_POINTS}">Table</a>
    <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATISTICS}">Stats</a>
  </nav>`
);

export default class MenuView extends AbstractView {
  // #currentMenuItem = MenuItem.TRIP_POINTS;
  #menuActiveClass = 'trip-tabs__btn--active';
  constructor () {
    super();

  }

  get template () {
    return createMenuTemplate();
  }

  setMenuClickHandler = (callbackFunction) => {
    this._callback.menuClickHandler = callbackFunction;
    this.element.querySelectorAll('.trip-tabs__btn').forEach((menuItem) => {
      menuItem.addEventListener('click', this.#menuClickHandler);
    });
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    const currentActiveItem = this.element.querySelector(`.${this.#menuActiveClass}`);
    currentActiveItem.classList.remove(this.#menuActiveClass);
    currentActiveItem.href = '#';

    evt.target.removeAttribute('href');
    evt.target.classList.add(this.#menuActiveClass);

    this._callback.menuClickHandler(evt.target.dataset.menuItem);
  }
}
