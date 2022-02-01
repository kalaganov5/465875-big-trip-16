import {renderElement, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import FormTripPointView from '../view/form-trip-point-view.js';
import {remove} from '../utils/common.js';

export default class CreatePointPresenter {
  #tripPointContainer = null;
  #changeData = null;
  #tripPointFormComponent = null;
  #addNewPointButton = null;
  #offersTripPoint = null;
  #destinationsTripPoint = null;

  constructor (tripPointContainer, changeData, addNewPointButton, offersTripPoint, destinationsTripPoint) {
    this.#tripPointContainer = tripPointContainer;
    this.#changeData = changeData;
    this.#addNewPointButton = addNewPointButton;

    this.#offersTripPoint = offersTripPoint;
    this.#destinationsTripPoint = destinationsTripPoint;
  }

  init = () => {
    this.#addNewPointButton.disabled = true;
    this.#tripPointFormComponent = new FormTripPointView(undefined, this.#offersTripPoint, this.#destinationsTripPoint);
    this.#tripPointFormComponent.setFormSubmitHandler(this.#formSubmitHandler);
    this.#tripPointFormComponent.setDeleteHandler(this.#formDeleteHandler);
    renderElement(this.#tripPointContainer, this.#tripPointFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  destroy = () => {
    if (this.#tripPointFormComponent === null) {
      return;
    }

    remove(this.#tripPointFormComponent);

    this.#tripPointFormComponent = null;
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#addNewPointButton.disabled = false;
  }

  #formSubmitHandler = (tripPoint) => {
    this.#changeData(
      UserAction.ADD_ROUTE_POINT,
      UpdateType.MAJOR,
      tripPoint,
    );
    // странно, но ладно, надо проверять
    // this.destroy();
  }

  #formDeleteHandler = () => {
    this.destroy();
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  setSaving = () => {
    this.#tripPointFormComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#tripPointFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#tripPointFormComponent.shake(resetFormState);
  }
}
