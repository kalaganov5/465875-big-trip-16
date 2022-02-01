import TripPointView from '../view/trip-point-item-view';
import FormTripPointView from '../view/form-trip-point-view.js';

import {renderElement, replace, RenderPosition} from '../utils/render.js';
import {remove} from '../utils/common.js';
import {Mode} from './const.js';
import {UserAction, UpdateType, State} from '../const.js';

export default class TripPointPresenter {
  #tripPointData = null;
  #changeData = null;
  #changeMode = null;

  #offersTripPoint = null;
  #destinationsTripPoint = null;

  #tripPointContainer = null;
  #tripPointComponent = null;
  #tripPointFormComponent = null;

  #mode = Mode.DEFAULT

  /**
   * Creates an instance of TripPointPresenter.
   * @param {object} tripPoint данные о точки маршрута
   * @memberof TripPointPresenter
   */
  constructor (tripPointContainer, changeData, changeMode, offersTripPoint, destinationsTripPoint) {
    this.#tripPointContainer = tripPointContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;

    this.#offersTripPoint = offersTripPoint;
    this.#destinationsTripPoint = destinationsTripPoint;
  }

  init = (tripPointItem) => {
    this.#tripPointData = tripPointItem;
    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointFormComponent = this.#tripPointFormComponent;

    this.#tripPointComponent = new TripPointView(this.#tripPointData);
    this.#tripPointComponent.setEditTripPointHandler(this.#replaceTripPointToForm);
    this.#tripPointComponent.setToggleFavoritePointHandler(this.#toggleFavoritePoint);

    this.#tripPointFormComponent = new FormTripPointView(this.#tripPointData, this.#offersTripPoint, this.#destinationsTripPoint);
    this.#tripPointFormComponent.setFormCloseHandler(this.#formCloseHandler);
    this.#tripPointFormComponent.setFormSubmitHandler(this.#formSubmitHandler);
    this.#tripPointFormComponent.setDeleteHandler(this.#formDeleteHandler);

    if (prevTripPointComponent === null || prevTripPointFormComponent === null) {
      renderElement(this.#tripPointContainer, this.#tripPointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripPointFormComponent, prevTripPointFormComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevTripPointFormComponent);
    remove(prevTripPointComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#tripPointFormComponent.reset(this.#tripPointData);
      this.#replaceFormToTripPoint();
    }
  }

  destroy = () => {
    remove(this.#tripPointComponent);
    remove(this.#tripPointFormComponent);
  }

  #replaceFormToTripPoint = () => {
    replace(this.#tripPointComponent, this.#tripPointFormComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  }

  #replaceTripPointToForm = () => {
    replace(this.#tripPointFormComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.resetView();
    }
  }

  #toggleFavoritePoint = () => {
    this.#changeData(
      UserAction.UPDATE_ROUTE_POINT,
      UpdateType.MINOR,
      {...this.#tripPointData, isFavorite: !this.#tripPointData.isFavorite}
    );
  }

  #formSubmitHandler = (tripPoint) => {
    this.#changeData(
      UserAction.UPDATE_ROUTE_POINT,
      UpdateType.MAJOR,
      tripPoint,
    );
    // Надо проверить верность
    // this.#replaceFormToTripPoint();
  }

  #formCloseHandler = () => {
    this.resetView();
  }

  #formDeleteHandler = () => {
    this.#changeData(
      UserAction.DELETE_ROUTE_POINT,
      UpdateType.MAJOR,
      this.#tripPointData,
    );
  }

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#tripPointFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#tripPointFormComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#tripPointFormComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#tripPointComponent.shake(resetFormState);
        this.#tripPointFormComponent.shake(resetFormState);
        break;
    }
  }
}
