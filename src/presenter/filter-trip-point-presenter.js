import FilterView from '../view/filters-view.js';
import {renderElement, RenderPosition, replace} from '../utils/render.js';
import {remove} from '../utils/common.js';
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
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView(this.#filterModel.filterType);
    this.#filterComponent.setFilterHandler(this.#filterHandler);

    if (prevFilterComponent === null) {
      this.#renderFilter();
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }


  #renderFilter = () => {
    renderElement(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
  }

  #filterHandler = (filterType) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  #handleModelEvent = () => {
    this.init();
  }

  destroy = () => {
    remove(this.#filterComponent);
    this.#filterComponent = null;
  }
}
