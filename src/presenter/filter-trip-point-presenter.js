import FilterView from '../view/filters-view.js';
import {renderElement, RenderPosition} from '../utils/render.js';
import {UpdateType} from '../const.js';

export default class FilterTripPointPresenter {
  #filterContainer = null;
  #filterComponent = null;
  #filterModel = null;
  #tripPointsModel = null;

  /**
   * Creates an instance of FilterTripPointPresenter.
   * @param {*} container контейнер куда должен отрисовываться фильтр
   * @memberof FilterTripPointPresenter
   */
  constructor (container, filterModel, tripPointsModel) {
    this.#filterContainer = container;

    this.#filterModel = filterModel;

    this.#tripPointsModel = tripPointsModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init () {
    this.#filterComponent = new FilterView(this.#filterModel.filterType);
    this.#filterComponent.setFilterHandler(this.#filterHandler);
    this.#renderFilter();
  }


  #renderFilter = () => {
    renderElement(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
  }

  #filterHandler = (filterType) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  #handleModelEvent = () => {
    console.log('Обновить доску');
    console.log(this.#tripPointsModel.routePoints)
  }
}
