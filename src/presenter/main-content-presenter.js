import MenuView from '../view/menu-view.js';
import SortView from '../view/sort-view.js';
import TripPointContainerView from '../view/trip-point-container-view.js';
import TripPointEmptyView from '../view/trip-point-empty-view.js';
import StatisticsView from '../view/statistics-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import CreatePointPresenter from './create-point-presenter.js';
import LoadingView from '../view/loading-view.js';

import {filter} from '../utils/filter.js';
import {sortDurationDescending, sortPriceDescending, sortDayAscending, remove} from '../utils/common.js';
import {RenderPosition, renderElement, replace} from '../utils/render.js';
import {SortType, UserAction, UpdateType, FilterType, MenuItem, LoadStatus} from '../const.js';

export default class MainContentPresenter {
  #menuContainer = null;
  #contentContainer = null;

  #currentMenuItem = MenuItem.TRIP_POINTS;
  #currentSortType = SortType.DEFAULT;
  #filterType = null;

  #offersTripPoint = null;
  #destinationsTripPoint = null;

  #routePointsModel = null;
  #filterModel = null;

  #menuComponent = null;
  #sortComponent = null;
  #tripPointEmptyComponent = null;
  #tripPointContainerComponent = new TripPointContainerView();
  #loadingComponent = new LoadingView();
  #statisticsComponent = null;

  #tripPointPresenter = new Map();
  #tripPointNewPresenter = null;
  #filterPresenter = null;

  #addNewTripPointButton = null;
  #isLoading = LoadStatus.LOADING;
  /**
   * Creates an instance of MainContentPresenter.
   * @param {*} menuContainer
   * @param {*} addNewTripPointButton
   * @param {*} contentContainer
   * @param {*} routePointsModel
   * @memberof MainContentPresenter
   */
  constructor (menuContainer, addNewTripPointButton, contentContainer, routePointsModel, filterModel, filterPresenter) {
    this.#menuContainer = menuContainer;
    this.#addNewTripPointButton = addNewTripPointButton;
    this.#contentContainer = contentContainer;

    this.#routePointsModel = routePointsModel;
    this.#routePointsModel.addObserver(this.#handleModelEvent);
    this.#routePointsModel.init();
    this.#disablingControlWhileLoadingToggle(this.#isLoading);

    this.#filterModel = filterModel;

    this.#filterPresenter = filterPresenter;

    this.#addTripPointButtonHandler();
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
    if (this.#menuComponent === null && this.#isLoading === LoadStatus.LOADED) {
      this.#menuComponent = new MenuView();
      this.#menuComponent.setMenuClickHandler(this.#menuClickHandler);
      this.#renderMenu();
    }

    if (this.#statisticsComponent !== null) {
      remove(this.#statisticsComponent);
    }

    this.#filterModel.addObserver(this.#handleModelEvent);
    if (this.#isLoading === LoadStatus.LOADED) {
      this.#filterPresenter.init();
    }

    if (this.#isLoading === LoadStatus.LOADED &&
      (this.#offersTripPoint === null || this.#destinationsTripPoint === null)) {
      this.#offersTripPoint = this.#routePointsModel.offers;
      this.#destinationsTripPoint = this.#routePointsModel.destinations;
    }

    this.#tripPointContainerComponent = new TripPointContainerView();
    this.#renderTripPointContainer();
    this.#renderTripPoints();

    this.#tripPointNewPresenter = new CreatePointPresenter(this.#tripPointContainerComponent, this.#handleViewAction, this.#addNewTripPointButton);

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
      case UpdateType.INIT:
        this.#disablingControlWhileLoadingToggle(LoadStatus.LOADED);
        this.init();
        break;
    }
  }


  #handleModeChange = () => {
    this.#tripPointNewPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  }

  #menuClickHandler = (currentMenuItem) => {
    // для того чтобы не обрабатывать тот-же пункт меню
    if (currentMenuItem === this.#currentMenuItem) {
      return;
    }

    switch (currentMenuItem) {
      case MenuItem.TRIP_POINTS:
        this.#currentMenuItem = currentMenuItem;
        this.init();
        break;
      case MenuItem.STATISTICS:
        this.#currentMenuItem = currentMenuItem;
        this.#filterPresenter.destroy();
        this.#filterModel.removeObserver(this.#handleModelEvent);

        remove(this.#tripPointContainerComponent);
        this.#clearContent();

        // Показать статистику
        this.#statisticsComponent = new StatisticsView(this.routePoints);
        renderElement(this.#contentContainer, this.#statisticsComponent, RenderPosition.AFTEREND);
        break;
    }
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
    const tripPointPresenter = new TripPointPresenter(
      this.#tripPointContainerComponent,
      this.#handleViewAction,
      this.#handleModeChange,
      this.#offersTripPoint,
      this.#destinationsTripPoint
    );
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
    if (this.#isLoading === LoadStatus.LOADING) {
      return;
    }
    remove(this.#loadingComponent);
    this.#tripPointEmptyComponent = new TripPointEmptyView(this.#filterType);
    renderElement(this.#contentContainer, this.#tripPointEmptyComponent, RenderPosition.BEFOREEND);
  }

  #renderLoading = () => {
    renderElement(this.#contentContainer, this.#loadingComponent, RenderPosition.BEFOREEND);
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
      if (this.#currentMenuItem === MenuItem.STATISTICS) {
        this.#currentMenuItem = MenuItem.TRIP_POINTS;
        this.#menuComponent.toggleMenu(this.#currentMenuItem);
        this.init();
      }
      this.#createTripPoint();
    });
  }

  #disablingControlWhileLoadingToggle = (status = LoadStatus.LOADING) => {
    switch (status) {
      case(LoadStatus.LOADING):
        this.#addNewTripPointButton.disabled = true;
        this.#renderLoading();
        break;
      case(LoadStatus.LOADED):
        this.#addNewTripPointButton.disabled = false;
        remove(this.#loadingComponent);
        this.#isLoading = LoadStatus.LOADED;
        break;
    }
  }
}
