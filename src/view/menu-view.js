import AbstractView from './abstract-view.js';
import {MenuItem, LoadStatus} from '../const.js';

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn trip-tabs__btn--active" data-menu-item="${MenuItem.TRIP_POINTS}">Table</a>
    <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATISTICS}">Stats</a>
  </nav>`
);

export default class MenuView extends AbstractView {
  #menuActiveClass = 'trip-tabs__btn--active';
  constructor () {
    super();

  }

  get template () {
    return createMenuTemplate();
  }

  setMenuClickHandler = (callbackFunction) => {
    this._callback.menuClickHandler = callbackFunction;
    this.element
      .querySelectorAll('.trip-tabs__btn')
      .forEach((menuItem) => {
        menuItem.addEventListener('click', this.#menuClickHandler);
      });
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this.toggleMenu(evt.target.dataset.menuItem);
    this._callback.menuClickHandler(evt.target.dataset.menuItem);
  }

  toggleMenu = (newMenuItemType) => {
    const currentMenuItem = this.element.querySelector(`.${this.#menuActiveClass}`);
    currentMenuItem.classList.remove(this.#menuActiveClass);
    currentMenuItem.href = '#';

    const newMenuItem = this.element.querySelector(`[data-menu-item="${newMenuItemType}"]`);
    newMenuItem.removeAttribute('href');
    newMenuItem.classList.add(this.#menuActiveClass);
  }

  disableControlToggle = (statusControl) => {
    console.log(statusControl)
    switch (statusControl) {
      case(LoadStatus.LOADING):
        console.log(statusControl);
        this.element
          .querySelectorAll('.trip-tabs__btn')
          .forEach((menuItem) => {
            menuItem.classList.add('trip-tabs__btn--disabled');
            menuItem.removeAttribute('href');
          });
        break;
      case(LoadStatus.LOADED):
        console.log(statusControl);
        this.element
          .querySelectorAll('.trip-tabs__btn')
          .forEach((menuItem) => {
            menuItem.classList.remove('trip-tabs__btn--disabled');
            menuItem.href = '#';
          });
        break;
    }
  }
}
