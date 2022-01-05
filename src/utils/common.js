import AbstractView from '../view/abstract-view.js';
import dayjs from 'dayjs';

/**
 *
 * @param {*} component
 * @returns
 */
export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
};

/**
 *
 * @param {*} items
 * @param {*} update
 * @returns
 */
export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};


export const sortByDurationUp = (tripPointA, tripPointB) => {
  // остается погрешность при сортировке в секундах
  const tripPointDurationA = dayjs(tripPointA.timeEnd).diff(tripPointA.timeStart, 'minutes');
  const tripPointDurationB = dayjs(tripPointB.timeEnd).diff(tripPointB.timeStart, 'minutes');
  return tripPointDurationB - tripPointDurationA;
};

export const sortByPriceUp = (tripPointA, tripPointB) => (tripPointB.price - tripPointA.price);
