import {getRandomInteger, getRandomItemArray} from './utils.js';

/**
 *
 * @returns набор уникальных опций для точки маршрута
 */
export const getPointOffers = () => {
  const pointOffers = [
    {
      title: 'Switch to comfort class',
      price: getRandomInteger(50, 100),
      isSelect: Boolean(getRandomInteger(0,1)),
    },
    {
      title: 'Order Uber',
      price: getRandomInteger(10, 25),
      isSelect: Boolean(getRandomInteger(0,1)),
    },
    {
      title: 'Add meal',
      price: getRandomInteger(5, 25),
      isSelect: Boolean(getRandomInteger(0,1)),
    },{
      title: 'Choose seats',
      price: getRandomInteger(5, 50),
      isSelect: Boolean(getRandomInteger(0,1)),
    },
    {
      title: 'Add luggage',
      price: getRandomInteger(5, 10),
      isSelect: Boolean(getRandomInteger(0,1)),
    }
  ];
  const offerLength = getRandomInteger(0, pointOffers.length - 1);
  const pointOffersUnique = [];
  while (pointOffersUnique.length < offerLength) {
    const randomItem = getRandomItemArray(pointOffers);

    const checkIsUniqueOffer = () => {
      for (const pointOffer of pointOffersUnique) {
        if (pointOffer.title === randomItem.title) {
          return false;
        }
      }

      return true;
    };

    if (checkIsUniqueOffer()) {
      pointOffersUnique.push(randomItem);
    }
  }

  return pointOffersUnique;
};
