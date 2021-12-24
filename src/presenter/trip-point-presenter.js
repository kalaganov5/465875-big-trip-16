import TripPointView from '../view/trip-point-item-view';
import FormTripPointView from '../view/form-trip-point-view.js';
import {renderElement, replace, RenderPosition} from '../utils/render.js';

export default class TripPointPresenter {
  #tripPointContainer = null;
  #tripPointComponent = null;
  #tripPointFormComponent = null;

  /**
   * Creates an instance of TripPointPresenter.
   * @param {object} tripPoint данные о точки маршрута
   * @memberof TripPointPresenter
   */
  constructor (tripPointContainer) {
    this.#tripPointContainer = tripPointContainer;
  }

  init = (tripPointItem) => {
    this.#tripPointComponent = new TripPointView(tripPointItem);
    this.#tripPointFormComponent = new FormTripPointView(tripPointItem);

    this.#tripPointComponent.setEditTripPointHandler(this.#replaceTripPointToForm);

    this.#tripPointFormComponent.setFormCloseHandler(this.#replaceFormToTripPoint);
    this.#tripPointFormComponent.setFormSubmitHandler(this.#replaceFormToTripPoint);

    renderElement(this.#tripPointContainer, this.#tripPointComponent, RenderPosition.BEFOREEND);
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
}
