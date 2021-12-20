import {TypeIcons} from './const.js';
import {humanReadableDate, calculateDate, setIconUrl} from './utils.js';
import AbstractView from './abstract-view.js';

/**
 *
 * @param {Array} offers массив объектов с опциями для точки маршрута
 * @returns разметка с предложениями для поездки или ничего
 */
const setOffers = (offers) => {
  if (offers.length === 0) {
    return '';
  }
  const offerMarkup = [];
  for (const offer of offers) {
    const offerElement = `
    <h4 class="visually-hidden">Offers:</h4>
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`;
    offerMarkup.push(offerElement);
  }
  return `
    <ul class="event__selected-offers">
    ${offerMarkup.join('')}
    </ul>`;
};

/**
 *
 * @param {boolean} isFavorite значение true или false
 * @returns класс или ничего
 */
const setIsFavorite = (isFavorite) => (isFavorite ? 'event__favorite-btn--active' : '');

/**
 *
 * @param {object} dateTime объект, пример {day: '02', hour: '00', minute: 33}
 * @returns строка в формате:
 * Менее часа: минуты (например, 23M);
 * Менее суток: часы минуты (например, 02H 44M или 12H 00M, если минуты равны нулю);
 * Более суток: дни часы минуты (например, 01D 02H 30M или 07D 00H 00M, если часы и/или минуты равны нулю).
 */
const setOutputLayoutDateTime = (dateTime) => {
  const {day, hour, minute} = dateTime;
  const dayLayout = `${+day > 0 ? `${day}d ` : ''}`;
  const hourLayout = `${+hour > 0 || +day > 0 ? `${hour}h `: ''}`;
  const minuteLayout = `${+minute > 0 || +hour > 0 || +day > 0 ? `${minute}m` : ''}`;
  return `${dayLayout ? dayLayout : ''}
          ${hourLayout ? hourLayout : ''}
          ${minuteLayout ? minuteLayout : ''}`;
};

/**
 *
 * @param {string} routePoint точка маршрута
 * @returns разметка точки маршрута
 */
const createTripPointItemTemplate = (routePoint) => {
  const {timeStart, timeEnd, type, destination, price, isFavorite, offers} = routePoint;
  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="
        ${humanReadableDate(timeStart, 'YYYY-MM-DD')}
      ">
        ${humanReadableDate(timeStart, 'MMM D')}
      </time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="${setIconUrl(type, TypeIcons)}" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="
            ${humanReadableDate(timeStart, 'YYYY-MM-DDThh:mm')}
          ">${humanReadableDate(timeStart, 'hh:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="
            ${humanReadableDate(timeEnd, 'YYYY-MM-DDThh:mm')}
          ">${humanReadableDate(timeEnd, 'hh:mm')}</time>
        </p>
        <p class="event__duration">${setOutputLayoutDateTime(calculateDate(timeStart, timeEnd))}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      ${setOffers(offers)}
      <button class="event__favorite-btn ${setIsFavorite(isFavorite)}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
export default class TripPointView extends AbstractView {
  #routePoint = null;
  /**
   * Creates an instance of TripPointView.
   * @param {*} routePoint
   * @memberof TripPointView
   */
  constructor (routePoint) {
    super();
    this.#routePoint = routePoint;
  }

  get template() {
    return createTripPointItemTemplate(this.#routePoint);
  }

  setEditTripPointHandler = (callbackFunction) => {
    this._callback.editTripPoint = callbackFunction;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editTripPointHandler);
  }

  #editTripPointHandler = (evt) => {
    evt.preventDefault();
    this._callback.editTripPoint();
  }
}
