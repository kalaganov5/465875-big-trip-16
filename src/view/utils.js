import {DAY_OF_MINUTES, HOUR_OF_MINUTES} from '../const.js';
import dayjs from 'dayjs';

/**
 *
 * @param {object} date объект дата и время
 * @param {string} format формат даты и времени строкой. Пример 'DD/MM/YYYY') итог '25/01/2019'
 */
export const humanReadableDate = (date, format = 'DD/MM/YYYY') => (dayjs(date).format(format));

/**
 *
 * @param {number} number число
 * @returns поставит ведущий ноль если число менее или равно 9
 */
const createLeadingZero = (number) => (number <= 9 ? `0${number}` : number);

/**
 *
 * @param {object} dateA дата начала
 * @param {object} dateB дата окончания
 * @returns объект {day, hour, minute}
 */
export const calculateDate = (dateA, dateB) => {
  const durationMinutes = dayjs(dateB).diff(dateA, 'minute');
  const day = Math.trunc(durationMinutes / DAY_OF_MINUTES);
  const hour = Math.trunc(
    (durationMinutes % DAY_OF_MINUTES) / HOUR_OF_MINUTES
  );
  const minute = (durationMinutes % DAY_OF_MINUTES) % HOUR_OF_MINUTES;
  return {
    day: createLeadingZero(day),
    hour: createLeadingZero(hour),
    minute: createLeadingZero(minute),
  };
};

/**
 *
 * @param {Object} type тип иконки
 * @param {Object} iconsMap сопоставление иконок тип = имя
 * @returns ссылка на изображение
 */
export const setIconUrl = (type, iconsMap) => (`img/icons/${iconsMap[type]}`);

/**
 *
 * @param {array} cities список городов
 * @returns разметку выбора списка городов
 */
export const generateSelectCities = (cities) => {
  const citiesLayout = [];
  for (const city of cities) {
    citiesLayout.push(`<option value="${city}"></option>`);
  }
  return `
    <datalist id="destination-list-1">
      ${citiesLayout.join('')}
    </datalist>
  `;
};

/**
 *
 * @param {String} string где нужно поменять регистр
 * @returns Вернёт строку, где первый символ будет заглавным
 */
export const firstLetterToUpperCase = (string) => (string[0].toUpperCase() + string.slice(1));

/**
 *
 * @param {array} elements массив элементов
 * @param {*} value проверяемый элемент
 * @returns если значение существует вернёт его
 */
export const checkItemInArray = (elements, value) => {
  for (const element of elements) {
    if (element.toUpperCase() === value.toUpperCase()) {
      return value;
    }
  }
};

export const makeItemsUnique = (items) => [...new Set(items)];

export const costByType = (items, type) => {
  let cost = 0;
  items.forEach((item) => {
    if (item.type === type) {
      cost = cost + Number(item.price);
    }
  });
  return cost;
};

export const countTripPointsByType = (items, type) => (items.filter((task) => task.type === type).length);

export const timeByType = (tripPoints, type) => {
  let durationMinutesByType = 0;

  tripPoints.forEach((tripPoint) => {
    if (tripPoint.type === type) {
      const dateStart = tripPoint.timeStart;
      const dateEnd = tripPoint.timeEnd;
      const durationMinutes = dayjs(dateEnd).diff(dateStart, 'minute');
      durationMinutesByType = durationMinutesByType + durationMinutes;
    }
  });

  return durationMinutesByType;
};

export const minutesToHumanFormat = (minutes) => {
  const day = Math.trunc(minutes / DAY_OF_MINUTES);
  const hour = Math.trunc(
    (minutes % DAY_OF_MINUTES) / HOUR_OF_MINUTES
  );
  const minute = (minutes % DAY_OF_MINUTES) % HOUR_OF_MINUTES;
  return {
    day: createLeadingZero(day),
    hour: createLeadingZero(hour),
    minute: createLeadingZero(minute),
  };
};

/**
 *
 * @param {object} dateTime объект, пример {day: '02', hour: '00', minute: 33}
 * @returns строка в формате:
 * Менее часа: минуты (например, 23M);
 * Менее суток: часы минуты (например, 02H 44M или 12H 00M, если минуты равны нулю);
 * Более суток: дни часы минуты (например, 01D 02H 30M или 07D 00H 00M, если часы и/или минуты равны нулю).
 */
export const setOutputLayoutDateTime = (dateTime) => {
  const {day, hour, minute} = dateTime;
  const dayLayout = `${+day > 0 ? `${day}D ` : ''}`;
  const hourLayout = `${+hour > 0 || +day > 0 ? `${hour}H `: ''}`;
  const minuteLayout = `${+minute > 0 || +hour > 0 || +day > 0 ? `${minute}M` : ''}`;
  return `${dayLayout ? dayLayout : ''} ${hourLayout ? hourLayout : ''} ${minuteLayout ? minuteLayout : ''}`;
};
