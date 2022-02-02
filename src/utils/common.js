import AbstractView from '../view/abstract-view.js';
import dayjs from 'dayjs';

/**
 *
 * @param {*} component компонент который будет удален
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
 * @param {*} items массив данных с объектами
 * @param {*} update объект который будет обновлен
 * @returns массив объектов с обновленным объектом из @update
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

/**
 *
 * @param {*} tripPointA объект точки маршрута
 * @param {*} tripPointB объект точки маршрута
 * @returns сортировка по длительности от большего к меньшему
 */
export const sortDurationDescending = (tripPointA, tripPointB) => {
  // остается погрешность при сортировке в секундах
  const tripPointDurationA = dayjs(tripPointA.timeEnd).diff(tripPointA.timeStart, 'minutes');
  const tripPointDurationB = dayjs(tripPointB.timeEnd).diff(tripPointB.timeStart, 'minutes');
  return tripPointDurationB - tripPointDurationA;
};

/**
 *
 * @param {*} tripPointA объект точки маршрута
 * @param {*} tripPointB объект точки маршрута
 * @returns сортировка по цене от большего к меньшему
 */
export const sortPriceDescending = (tripPointA, tripPointB) => (tripPointB.price - tripPointA.price);

/**
 *
 * @param {*} tripPointA объект точки маршрута
 * @param {*} tripPointB объект точки маршрута
 * @returns сортировка дни по возрастанию
 */
export const sortDayAscending = (tripPointA, tripPointB) => {
  const tripPointDayA = tripPointA.timeStart;
  const tripPointDayB = tripPointB.timeStart;

  return dayjs(tripPointDayA).diff(tripPointDayB);
};
