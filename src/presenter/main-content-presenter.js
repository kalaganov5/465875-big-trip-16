import FilterView from '../view/filters-view.js';
import MenuView from '../view/menu-view.js';
import SortView from '../view/sort-view.js';
import TripPointContainerView from '../view/trip-point-container-view.js';
import TripPointEmptyView from '../view/trip-point-empty-view.js';
import TripPointPresenter from './trip-point-presenter.js';

import {updateItem, sortDurationDescending, sortPriceDescending, sortDayAscending} from '../utils/common.js';
import {RenderPosition, renderElement} from '../utils/render.js';
import {FiltersName} from './const.js';
import {SortType} from '../const.js';

export default class MainContentPresenter {
  #menuContainer = null;
  #filterContainer = null;
  #contentContainer = null;
  #filterName = FiltersName.EVERYTHING;

  #menuComponent = new MenuView();
  #filterComponent = new FilterView();
  #sortComponent = new SortView();
  #tripPointEmptyComponent = new TripPointEmptyView();
  #tripPointContainerComponent = new TripPointContainerView();

  #tripPoints = [];
  #tripPointPresenter = new Map();
  #sourceTripPoints = [];

  constructor (menuContainer, filterContainer, contentContainer) {
    this.#menuContainer = menuContainer;
    this.#filterContainer = filterContainer;
    this.#contentContainer = contentContainer;
  }

  init = (tripPoints) => {
    this.#tripPoints = [...tripPoints];
    // сортируем дни по возрастанию
    this.#tripPoints = this.#tripPoints.sort(sortDayAscending);
    this.#sourceTripPoints = [...this.#tripPoints];

    this.#renderMenu();
    this.#renderFilter();

    this.#renderTripPointContainer();

    this.#renderTripPoints();
  }

  #handleTripPoints = (updatedTripPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedTripPoint);
    this.#tripPointPresenter.get(updatedTripPoint.id).init(updatedTripPoint);
  }

  #handleModeChange = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  }

  #renderMenu = () => {
    renderElement(this.#menuContainer, this.#menuComponent, RenderPosition.BEFOREEND);
  }

  #renderFilter = () => {
    renderElement(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
  }

  #renderTripPointContainer = () => {
    if (this.#tripPoints.length === 0) {
      this.#renderNoTripPoint();
      return;
    }
    this.#renderSort();
    renderElement(this.#contentContainer, this.#tripPointContainerComponent, RenderPosition.BEFOREEND);
  }

  #renderSort = () => {
    renderElement(this.#contentContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortChangeHandler(this.#sortHandler);
  }

  #sortHandler = (sortType) => {
    this.#clearTripPointList();

    switch (sortType) {
      case SortType.DEFAULT:
        this.#tripPoints = [...this.#sourceTripPoints];
        break;

      case SortType.TIME:
        this.#tripPoints.sort(sortDurationDescending);
        break;

      case SortType.PRICE:
        this.#tripPoints.sort(sortPriceDescending);
        break;
    }

    this.#renderTripPoints();
  }

  #renderTripPoint = (tripPointItem) => {
    // рендер одной точки маршрута
    const tripPointPresenter = new TripPointPresenter(this.#tripPointContainerComponent, this.#handleTripPoints, this.#handleModeChange);
    tripPointPresenter.init(tripPointItem);
    this.#tripPointPresenter.set(tripPointItem.id, tripPointPresenter);
  }

  #clearTripPointList = () => {
    this.#tripPointPresenter.forEach((presenter) => (presenter.destroy()));
    this.#tripPointPresenter.clear();
  }

  #renderTripPoints = () => {
    this.#tripPoints.forEach((tripPointItem) => {
      this.#renderTripPoint(tripPointItem);
    });
  }

  #renderNoTripPoint = () => {
    renderElement(this.#contentContainer, this.#tripPointEmptyComponent, RenderPosition.BEFOREEND);
  }
}
