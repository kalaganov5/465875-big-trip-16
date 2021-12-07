import {ROUTE_TYPE, ROUTE_CITIES, ROUTE_DESCRIPTION} from './const.js';
import {getRandomInteger, getRandomItemArray} from './utils.js';
import {setOffers} from './get-point-offers.js';
import dayjs from 'dayjs';

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
  const photosLength = getRandomInteger(1, 10);
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
    .add(getRandomInteger(0, 24), 'hour')
    .add(getRandomInteger(0, 60), 'minute')
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
    price: getRandomInteger(20, 300),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    timeStart: getRandomDateTime(0, 1),
    timeEnd: getRandomDateTime(2, 3),
  }
);
