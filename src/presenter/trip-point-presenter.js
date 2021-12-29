import TripPointView from '../view/trip-point-item-view';
import FormTripPointView from '../view/form-trip-point-view.js';
import {renderElement, replace, RenderPosition} from '../utils/render.js';
import {remove} from '../utils/common.js';

export default class TripPointPresenter {
  #tripPointData = null;
  #changeData = null;
  #tripPointContainer = null;
  #tripPointComponent = null;
  #tripPointFormComponent = null;

  /**
   * Creates an instance of TripPointPresenter.
   * @param {object} tripPoint данные о точки маршрута
   * @memberof TripPointPresenter
   */
  constructor (tripPointContainer, changeData) {
    this.#tripPointContainer = tripPointContainer;
    this.#changeData = changeData;
  }

  init = (tripPointItem) => {
    this.#tripPointData = tripPointItem;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointFormComponent = this.#tripPointFormComponent;

    this.#tripPointComponent = new TripPointView(this.#tripPointData);
    this.#tripPointFormComponent = new FormTripPointView(this.#tripPointData);

    this.#tripPointComponent.setEditTripPointHandler(this.#replaceTripPointToForm);
    this.#tripPointComponent.setToggleFavoritePointHandler(this.#toggleFavoritePoint);

    this.#tripPointFormComponent.setFormCloseHandler(this.#replaceFormToTripPoint);
    this.#tripPointFormComponent.setFormSubmitHandler(this.#replaceFormToTripPoint);

    if (prevTripPointComponent === null || prevTripPointFormComponent === null) {
      renderElement(this.#tripPointContainer, this.#tripPointComponent, RenderPosition.BEFOREEND);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#tripPointContainer.element.contains(prevTripPointComponent.element)) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#tripPointContainer.element.contains(prevTripPointFormComponent.element)) {
      replace(this.#tripPointFormComponent, prevTripPointFormComponent);
    }

    remove(prevTripPointFormComponent);
    remove(prevTripPointComponent);
  }

  destroy = () => {
    remove(this.#tripPointComponent);
    remove(this.#tripPointFormComponent);
  }

  #replaceFormToTripPoint = () => {
    replace(this.#tripPointComponent, this.#tripPointFormComponent);
  }

  #replaceTripPointToForm = () => {
    replace(this.#tripPointFormComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToTripPoint();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }

  #toggleFavoritePoint = () => {
    this.#changeData({...this.#tripPointData, isFavorite: !this.#tripPointData.isFavorite});
  }
}
