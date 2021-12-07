import {ROUTE_TYPE, ROUTE_CITIES, ROUTE_DESCRIPTION} from './const.js';
import {getRandomInteger, getRandomItemArray} from './utils.js';
import {setOffers} from './get-point-offers.js';
import dayjs from 'dayjs';

const PHOTOS_NUMBER = 10;
const HOUR_IN_DAY = 24;
const MINUTE_IN_HOUR = 60;
const PRICE_OFFER_MIN = 20;
const PRICE_OFFER_MAX = 300;
const DAY_GAP_MIN = 1;
const DAY_GAP_MAX = 3;

/**
 *
 * @param {Array} array массив из описаний
 * @returns случайное описание строкой
 */
const getRandomDescriptions = (array) => {
  const randomLength = getRandomInteger(0, array.length - 1);
  const randomDescription = getRandomItemArray(array);
  return new Array(randomLength)
    .fill(randomDescription)
    .join(' ');
};

/**
 *
 * @returns массив фотографий
 */
const getPhotos = () => {
  const photosLength = getRandomInteger(1, PHOTOS_NUMBER);
  const photos = [];

  for (let i = 0; i < photosLength; i++) {
    const photo = `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`;
    photos.push(photo);
  }

  return photos;
};

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
export const getRoutePoint = (type = getRandomItemArray(ROUTE_TYPE)) => (
  {
    destination: getRandomItemArray(ROUTE_CITIES),
    type: type,
    info: {
      description: getRandomDescriptions(ROUTE_DESCRIPTION),
      photos: getPhotos(),
    },
    offers: setOffers(type),
    price: getRandomInteger(PRICE_OFFER_MIN, PRICE_OFFER_MAX),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    timeStart: getRandomDateTime(0, DAY_GAP_MIN),
    timeEnd: getRandomDateTime(DAY_GAP_MIN + 1, DAY_GAP_MAX),
  }
);
