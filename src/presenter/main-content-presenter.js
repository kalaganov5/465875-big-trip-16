import MenuView from '../view/menu-view.js';
import SortView from '../view/sort-view.js';
import TripPointContainerView from '../view/trip-point-container-view.js';
import TripPointEmptyView from '../view/trip-point-empty-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import CreatePointPresenter from './create-point-presenter.js';

import {filter} from '../utils/filter.js';
import {sortDurationDescending, sortPriceDescending, sortDayAscending, remove} from '../utils/common.js';
import {RenderPosition, renderElement, replace} from '../utils/render.js';
import {SortType, UserAction, UpdateType, FilterType, MenuItem} from '../const.js';

export default class MainContentPresenter {
  #menuContainer = null;
  #contentContainer = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = null;

  #routePointsModel = null;
  #filterModel = null;

  #menuComponent = null;
  #sortComponent = null;
  #tripPointEmptyComponent = null;
  #tripPointContainerComponent = new TripPointContainerView();

  #tripPointPresenter = new Map();
  #tripPointNewPresenter = null;

  #addNewTripPointButton = null;
  /**
   * Creates an instance of MainContentPresenter.
   * @param {*} menuContainer
   * @param {*} addNewTripPointButton
   * @param {*} contentContainer
   * @param {*} routePointsModel
   * @memberof MainContentPresenter
   */
  constructor (menuContainer, addNewTripPointButton, contentContainer, routePointsModel, filterModel) {
    this.#menuContainer = menuContainer;
    this.#addNewTripPointButton = addNewTripPointButton;
    this.#contentContainer = contentContainer;

    this.#routePointsModel = routePointsModel;
    this.#routePointsModel.addObserver(this.#handleModelEvent);

    this.#tripPointNewPresenter = new CreatePointPresenter(this.#tripPointContainerComponent, this.#handleViewAction, this.#addNewTripPointButton);

    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get routePoints() {
    this.#filterType = this.#filterModel.filterType;
    const routePoints = this.#routePointsModel.routePoints;
    const filteredRoutePoints = filter[this.#filterType](routePoints);
    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredRoutePoints.sort(sortPriceDescending);
      case SortType.TIME:
        return filteredRoutePoints.sort(sortDurationDescending);
    }
    return filteredRoutePoints.sort(sortDayAscending);
  }

  init = () => {
    if (this.#menuComponent === null) {
      this.#menuComponent = new MenuView();
      this.#menuComponent.setMenuClickHandler(this.#menuClickHandler);
      this.#renderMenu();
    }

    this.#addTripPointButtonHandler();

    this.#renderTripPointContainer();

    this.#renderTripPoints();
  }

  #handleViewAction = (actionType, updateType, update) => {
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case (UserAction.UPDATE_ROUTE_POINT):
        this.#routePointsModel.updateRoutePoints(updateType, update);
        break;
      case (UserAction.ADD_ROUTE_POINT):
        this.#routePointsModel.addRoutePoint(updateType, update);
        break;
      case (UserAction.DELETE_ROUTE_POINT):
        this.#routePointsModel.deleteRoutePoint(updateType, update);
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case (UpdateType.MINOR):
        this.#tripPointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        this.#clearContent();
        this.#currentSortType = SortType.DEFAULT;
        this.init();
        break;
    }
  }


  #handleModeChange = () => {
    this.#tripPointNewPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  }

  #menuClickHandler = (currentMenuItem) => {
    console.log(currentMenuItem);
  }

  #renderMenu = () => {
    renderElement(this.#menuContainer, this.#menuComponent, RenderPosition.BEFOREEND);
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
    this.#sortComponent = new SortView();
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
    const tripPointPresenter = new TripPointPresenter(this.#tripPointContainerComponent, this.#handleViewAction, this.#handleModeChange);
    tripPointPresenter.init(tripPointItem);
    this.#tripPointPresenter.set(tripPointItem.id, tripPointPresenter);
  }

  #clearTripPointList = () => {
    this.#tripPointPresenter.forEach((presenter) => (presenter.destroy()));
    this.#tripPointPresenter.clear();
  }

  #clearContent = () => {
    this.#tripPointNewPresenter.destroy();
    remove(this.#sortComponent);
    if (this.#tripPointEmptyComponent) {
      remove(this.#tripPointEmptyComponent);
    }
    this.#clearTripPointList();
  }

  #renderTripPoints = () => {
    this.routePoints.forEach((tripPointItem) => {
      this.#renderTripPoint(tripPointItem);
    });
  }

  #renderNoTripPoint = () => {
    this.#tripPointEmptyComponent = new TripPointEmptyView(this.#filterType);
    renderElement(this.#contentContainer, this.#tripPointEmptyComponent, RenderPosition.BEFOREEND);
  }

  #createTripPoint = () => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    if (this.#tripPointEmptyComponent !== null) {
      replace(this.#tripPointContainerComponent, this.#tripPointEmptyComponent);
      this.#tripPointEmptyComponent = null;
    }
    this.#tripPointNewPresenter.init();
  }

  #addTripPointButtonHandler = () => {
    this.#addNewTripPointButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#createTripPoint();
    });
  }
}
