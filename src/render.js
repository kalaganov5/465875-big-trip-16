export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

/**
 *
 * @param {*} container в который поставим разметку
 * @param {*} markup разметка/верстка
 * @param {*} position - положение в начало или в конец
 */
export const renderTemplate = (container, markup, position) => {
  container.insertAdjacentHTML(position, markup);
};
