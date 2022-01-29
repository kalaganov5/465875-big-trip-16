import {renderElement, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import FormTripPointView from '../view/form-trip-point-view.js';
import {nanoid} from 'nanoid';
import {remove} from '../utils/common.js';

export default class CreatePointPresenter {
  #tripPointContainer = null;
  #changeData = null;
  #tripPointFormComponent = null;

  constructor (tripPointContainer, changeData) {
    this.#tripPointContainer = tripPointContainer;
    this.#changeData = changeData;
  }

  init = () => {
    this.#tripPointFormComponent = new FormTripPointView();
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
  }

  #formSubmitHandler = (tripPoint) => {
    this.#changeData(
      UserAction.ADD_ROUTE_POINT,
      UpdateType.MAJOR,
      // Пока у нас нет сервера, который бы после сохранения
      // выдавал честный id задачи, нам нужно позаботиться об этом самим
      {id: nanoid(), ...tripPoint},
    );
    this.destroy();
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
}
