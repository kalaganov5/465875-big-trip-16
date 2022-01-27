import {TypeIcons, ROUTE_CITIES, ROUTE_TYPES} from './const.js';
import {humanReadableDate, setIconUrl, generateSelectCities, firstLetterToUpperCase, checkItemInArray} from './utils.js';
import {ROUTE_POINT_OFFERS, ROUTES_INFO} from '../mock/const.js';
import SmartView from './smart-view.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

/**
 *
 * @returns выпадающий список способов передвижения
 */
const generateSelectEventType = (currentType) => {
  const typesMarkup = Array.from({length: ROUTE_TYPES.length}, (_, index) => (
    `<div class="event__type-item">
      <input id="event-type-${ROUTE_TYPES[index]}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${ROUTE_TYPES[index]}" ${ROUTE_TYPES[index] === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${ROUTE_TYPES[index]}" for="event-type-${ROUTE_TYPES[index]}-1">${firstLetterToUpperCase(ROUTE_TYPES[index])}</label>
    </div>`)
  );

  return `<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>
    ${typesMarkup.join('')}
  </fieldset>
</div>`;
};

/**
 *
 * @param {Array} offers массив объектов с опциями для точки маршрута
 * @returns разметка с предложениями для поездки или ничего
 */
const setOffersCreatePoint = (offers) => {
  if (offers.length === 0) {
    return '';
  }

  const offerMarkup = Array.from({length: offers.length}, (_, index) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
        id="event-offers[index]-${index}"
        type="checkbox"
        name="event-offers[index]-${offers[index].title.toLowerCase().replaceAll(' ', '-')}"
        data-offer-id="${offers[index].id}"
        ${offers[index].isSelect ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offers[index]-${index}">
        <span class="event__offer-title">${offers[index].title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offers[index].price}</span>
      </label>
    </div>`)
  );

  return `
  <section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">
    ${offerMarkup.join('')}
  </div>
</section>`;
};

/**
 *
 * @param {string} description
 * @param {array} images
 * @returns
 */
const setInfo = (description, images) => {
  const imageLayout = [];
  for (const image of images) {
    imageLayout.push(`<img class="event__photo" src="${image}" alt="Event photo"></img>`);
  }
  return `
  <section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  ${description ? `<p class="event__destination-description">${description}</p>` : ''}

  ${images.length > 0 ?
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${imageLayout.join('')}
      </div>
    </div>` : ''}
  </section>`;
};

/**
 *
 * @param {Object} routePoint данные о точке маршрута
 * @returns заполненная форма создания или редактирования точки маршрута
 */
const createFormPointTemplate = (routePoint) => {
  const {timeStart, timeEnd, type, destination, price, offers, info, isCreateTripPoint} = routePoint;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${setIconUrl(type, TypeIcons)}" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${generateSelectEventType(type)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          ${generateSelectCities(ROUTE_CITIES)}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanReadableDate(timeStart, 'DD/MM/YYYY hh:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanReadableDate(timeEnd, 'DD/MM/YYYY hh:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isCreateTripPoint ? 'Cancel' : 'Delete'}</button>
        ${isCreateTripPoint ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'}
      </header>
      ${offers.length > 0 || Object.keys(info).length > 0 ?`<section class="event__details">
        ${setOffersCreatePoint(offers)}
        ${setInfo(info.description, info.photos)}
      </section>`: ''}
    </form>
  </li>`;
};

/**
 *
 *
 * @export
 * @class FormTripPointView форма создание или редактирования точки маршрута
 */
export default class FormTripPointView extends SmartView {
  #datepickerStart = null;
  #datepickerEnd = null;
  #sourceTripPointOffers = null;

  /**
   * Creates an instance of FormTripPointView.
   * @param {object} tripPoint данные о точке маршрута
   * @param {object} isCreateRoutePointEvent true если это создание новой точки маршрута или false если это редактирование точки маршрута
   * @memberof FormTripPointView
   */
  constructor(tripPoint, isCreateRoutePointEvent = false) {
    super();
    this._data = FormTripPointView.parseTripPointToData(tripPoint, isCreateRoutePointEvent);
    this.#setInnerHandlers();
    this.#sourceTripPointOffers = JSON.parse(JSON.stringify(this._data.offers));
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более не нужный календарь
  removeElement = () => {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerStart = null;
    }
  }

  get template() {
    return createFormPointTemplate(this._data);
  }

  static parseTripPointToData = (tripPoint, isCreateTripPoint) => ({...tripPoint,
    isCreateTripPoint,
  });

  static parseDataToTripPoint = (data) => {
    const tripPointData = {...data};

    // delete key
    delete tripPointData.isCreateTripPoint;

    return tripPointData;
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#formTypePointHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#formDestinationPointHandler);
    if (this._data.offers.length > 0) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('change', this.#formOffersPointHandler);
    }

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#formCostHandler);

    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  reset = (tripPointData) => {
    // Сброс выбранных оферов т.к. в this.#formOffersPointHandler идет обновление сразу
    for (let i = 0; i < this._data.offers.length; i++) {
      this._data.offers[i].isSelect = this.#sourceTripPointOffers[i].isSelect;
    }
    // Сброс выбранных оферов т.к. в this.#formOffersPointHandler идет обновление сразу
    this.updateData(
      FormTripPointView.parseTripPointToData(tripPointData),
    );
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmitHandler);
    this.setFormCloseHandler(this._callback.formCloseHandler);
  }

  setFormCloseHandler = (callbackFunction) => {
    this._callback.formCloseHandler = callbackFunction;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
  }

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.formCloseHandler();
  }

  setFormSubmitHandler = (callbackFunction) => {
    this._callback.formSubmitHandler = callbackFunction;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmitHandler(FormTripPointView.parseDataToTripPoint(this._data));
  }

  #formTypePointHandler = (evt) => {
    evt.preventDefault();
    const newType = checkItemInArray(ROUTE_TYPES, evt.target.value);

    this.updateData(
      {
        type: newType,
        offers: ROUTE_POINT_OFFERS[newType],
      }
    );
  }

  #formDestinationPointHandler = (evt) => {
    evt.preventDefault();
    const newDestination = checkItemInArray(ROUTE_CITIES, evt.target.value);
    this.updateData(
      {
        destination: newDestination,
        info: {
          description: ROUTES_INFO[newDestination].description,
          photos: ROUTES_INFO[newDestination].photos
        }
      }
    );
  }

  #formCostHandler = (evt) => {
    evt.preventDefault();
    this.updateData(
      {price: evt.target.value,},
      true,
    );
  }

  #formOffersPointHandler = (evt) => {
    evt.preventDefault();

    const offerId = evt.target.dataset.offerId;
    const offers = this._data.offers;
    for (let i = 0; i < offers.length; i++) {
      if(offers[i].id === offerId) {
        offers[i].isSelect = !offers[i].isSelect;
        break;
      }
    }
  }

  #setDatepickerStart = () => {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        dateFormat: 'd/m/Y H:i',
        maxDate: flatpickr.parseDate(this._data.timeEnd),
        defaultDate: this._data.timeStart,
        onChange: this.#formTimeStartHandler,
      },
    );
  }

  #formTimeStartHandler = ([userDateTimeStart]) => {
    this.updateData(
      {timeStart: userDateTimeStart,},
      true,
    );
  }

  #setDatepickerEnd = () => {
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        dateFormat: 'd/m/Y H:i',
        minDate: flatpickr.parseDate(this._data.timeStart),
        defaultDate: this._data.timeEnd,
        onChange: this.#formTimeEndHandler,
      },
    );
  }

  #formTimeEndHandler = ([userDateTimeEnd]) => {
    this.updateData(
      {timeEnd: userDateTimeEnd,},
      true,
    );
  }
}
