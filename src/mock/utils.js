// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
/**
 *
 * @param {Number} a первое число
 * @param {Number} b второе число
 * @returns случайное число из указанного диапазона
 */
export const getRandomInteger = (a = 0, b = 1) => {
  if (a === b) {
    return Error('Неверное значение');
  }
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

/**
 *
 * @param {Array} array массив значение
 * @returns вернёт случайное значение из массива
 */
export const getRandomItemArray = (array) => (
  array[getRandomInteger(0, array.length - 1)]
);
