import FilterView from '../view/filters-view.js';
import {renderElement, RenderPosition} from '../utils/render.js';

export default class FilterTripPointPresenter {
  #filterContainer = null;
  #currentFilterType = null;
  #filterComponent = null;
  #filterModel = null;

  /**
   * Creates an instance of FilterTripPointPresenter.
   * @param {*} container контейнер куда должен отрисовываться фильтр
   * @memberof FilterTripPointPresenter
   */
  constructor (container, filterModel) {
    this.#filterContainer = container;
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init (filterType) {
    this.#currentFilterType = filterType;
    this.#renderFilter();
    this.#filterComponent.setFilterHandler(this.#filterHandler);
  }

  #renderFilter = () => {
    this.#filterComponent = new FilterView(this.#currentFilterType);
    renderElement(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
  }

  #filterHandler = (filterType) => {
    this.#filterModel.setFilter = filterType;
  }

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
  }

  // создать коллбек для передачи
  // сделать метод для установки обработчика фильтра
  // в модели обновлять текущий фильтр
}
