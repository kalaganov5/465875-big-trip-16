import {ROUTE_TYPES, ROUTE_CITIES, ROUTES_INFO} from './const.js';
import {getRandomInteger, getRandomItemArray} from './utils.js';
import {ROUTE_POINT_OFFERS} from './const';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const HOUR_IN_DAY = 24;
const MINUTE_IN_HOUR = 60;
const PRICE_OFFER_MIN = 20;
const PRICE_OFFER_MAX = 300;
const DAY_GAP_MIN = 1;
const DAY_GAP_MAX = 3;

/**
 *
 * @returns случайная дата и время
 */
const getRandomDateTime = (start = 0, end = 7) => (
  dayjs()
    .add(getRandomInteger(0, HOUR_IN_DAY), 'hour')
    .add(getRandomInteger(0, MINUTE_IN_HOUR), 'minute')
    .add(getRandomInteger(start, end), 'day')
    .toDate()
);

/**
 *
 * @param {string} type тип точки маршрута, значение задано по умолчанию и передавать не нужно
 * @returns объект точки маршрута
 */
export const getRoutePoint = (type = getRandomItemArray(ROUTE_TYPES)) => {

  const randomCity = getRandomItemArray(ROUTE_CITIES);

  return {
    id: nanoid(),
    destination: randomCity,
    type: type,
    info: {
      description: ROUTES_INFO[randomCity].description,
      photos: ROUTES_INFO[randomCity].photos,
    },
    offers: ROUTE_POINT_OFFERS[type],
    price: getRandomInteger(PRICE_OFFER_MIN, PRICE_OFFER_MAX),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    timeStart: getRandomDateTime(0, DAY_GAP_MIN),
    timeEnd: getRandomDateTime(DAY_GAP_MIN + 1, DAY_GAP_MAX),
  };
};
