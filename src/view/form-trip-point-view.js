import {TypeIcons, ROUTE_CITIES} from './const.js';
import {humanReadableDate, setIconUrl, generateSelectCities} from './utils.js';
import {createElement} from '../render.js';

/**
 *
 * @returns выпадающий список способов передвижения
 */
const generateSelectEventType = () => (
  `<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>

    <div class="event__type-item">
      <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
      <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
      <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
      <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
      <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
      <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
      <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
      <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
      <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
      <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
    </div>
  </fieldset>
</div>`
);

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
 * @param {Boolean} isCreateEvent true если это создание новой точки маршрута
 * @returns заполненная форма создания или редактирования точки маршрута
 */
const createFormPointTemplate = (routePoint, isCreateEvent) => {
  const {timeStart, timeEnd, type, destination, price, offers, info} = routePoint;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${setIconUrl(type, TypeIcons)}" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${generateSelectEventType()}
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
        <button class="event__reset-btn" type="reset">${isCreateEvent ? 'Cancel' : 'Delete'}</button>
        ${isCreateEvent ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'}
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
 * @class FormTripPointView
 */
export default class FormTripPointView {
  #element = null;
  #tripPoint = null;
  #isCreateEvent = false;
  /**
   * Creates an instance of FormTripPointView.
   * @param {object} tripPoint данные о точке маршрута
   * @memberof FormTripPointView
   */
  constructor(tripPoint, isCreateEvent = false) {
    this.#tripPoint = tripPoint;
    this.#isCreateEvent = isCreateEvent;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFormPointTemplate(this.#tripPoint, this.#isCreateEvent);
  }

  removeElement() {
    this.#element = null;
  }
}
