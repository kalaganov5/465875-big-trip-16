import FilterView from '../view/filters-view.js';
import MenuView from '../view/menu-view.js';
import SortView from '../view/sort-view.js';
import TripPointContainerView from '../view/trip-point-container-view.js';
import TripPointEmptyView from '../view/trip-point-empty-view.js';
import TripPointPresenter from './trip-point-presenter.js';

import {updateItem, sortDurationDescending, sortPriceDescending} from '../utils/common.js';
import {RenderPosition, renderElement} from '../utils/render.js';
import {FiltersName} from './const.js';
import {SortType} from '../const.js';

export default class MainContentPresenter {
  #menuContainer = null;
  #filterContainer = null;
  #contentContainer = null;
  #filterName = FiltersName.EVERYTHING;

  #currentSortType = SortType.DEFAULT;

  #routePointsModel = null;

  #menuComponent = new MenuView();
  #filterComponent = new FilterView();
  #sortComponent = new SortView();
  #tripPointEmptyComponent = new TripPointEmptyView();
  #tripPointContainerComponent = new TripPointContainerView();

  #tripPointPresenter = new Map();
  /**
   * Creates an instance of MainContentPresenter.
   * @param {*} menuContainer
   * @param {*} filterContainer
   * @param {*} contentContainer
   * @param {*} routePointsModel
   * @memberof MainContentPresenter
   */
  constructor (menuContainer, filterContainer, contentContainer, routePointsModel) {
    this.#menuContainer = menuContainer;
    this.#filterContainer = filterContainer;
    this.#contentContainer = contentContainer;

    this.#routePointsModel = routePointsModel;
  }

  get routePoints() {
    switch (this.#currentSortType) {
      case SortType.PRICE:
        return [...this.#routePointsModel.routePoints].sort(sortPriceDescending);
      case SortType.TIME:
        return [...this.#routePointsModel.routePoints].sort(sortDurationDescending);
    }
    return this.#routePointsModel.routePoints;
  }

  init = () => {


    this.#renderMenu();
    this.#renderFilter();

    this.#renderTripPointContainer();

    this.#renderTripPoints();
  }

  #handleTripPoints = (updatedTripPoint) => {
    this.routePoints = updateItem(this.routePoints, updatedTripPoint);
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
    if (this.routePoints.length === 0) {
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

    this.#currentSortType = sortType;


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
    this.routePoints.forEach((tripPointItem) => {
      this.#renderTripPoint(tripPointItem);
    });
  }

  #renderNoTripPoint = () => {
    renderElement(this.#contentContainer, this.#tripPointEmptyComponent, RenderPosition.BEFOREEND);
  }
}
