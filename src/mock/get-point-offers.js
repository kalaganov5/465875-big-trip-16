import {getRandomInteger} from './utils.js';
const PRICE_MIN = 5;
const PRICE_MAX = 100;
const offers = {}; // заполняется динамически: ключ = [{},{}]

/**
 *
 * @returns набор уникальных опций для точки маршрута
 */
const getPointOffers = () => {
  const offersItem = [
    {
      title: 'Switch to comfort class',
      price: getRandomInteger(PRICE_MIN, PRICE_MAX),
      isSelect: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Order Uber',
      price: getRandomInteger(PRICE_MIN, PRICE_MAX),
      isSelect: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Add meal',
      price: getRandomInteger(PRICE_MIN, PRICE_MAX),
      isSelect: Boolean(getRandomInteger(0, 1)),
    },{
      title: 'Choose seats',
      price: getRandomInteger(PRICE_MIN, PRICE_MAX),
      isSelect: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Add luggage',
      price: getRandomInteger(PRICE_MIN, PRICE_MAX),
      isSelect: Boolean(getRandomInteger(0, 1)),
    }
  ];
  const offersLength = getRandomInteger(0, offersItem.length - 1);
  return offersItem.splice(0, offersLength);
};

/**
 *
 * @param {string} type тип точки маршрута
 * @returns массив из уникальных опций для точки маршрута
 */
export const setOffers = (type) => {
  if (type in offers) {
    return offers[type];
  }

  offers[type] = getPointOffers();
  return offers[type];
};
