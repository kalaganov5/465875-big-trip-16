export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

/**
 *
 * @param {string} template HTML в виде строки, должен иметь общую обёртку
 * @returns возвращаем этот DOM-элемент
 */
export const createElement = (template) => {
  // создаём пустой div-блок
  const newElement = document.createElement('div');
  // берём HTML в виде строки и вкладываем в этот div-блок, превращая в DOM-элемент
  newElement.innerHTML = template;
  return newElement.firstChild;
};
// Единственный нюанс, что HTML в строке должен иметь общую обёртку,
// то есть быть чем-то вроде <nav><a>Link 1</a><a>Link 2</a></nav>,
// а не просто <a>Link 1</a><a>Link 2</a>

/**
 *
 * @param {object} container в который поставим разметку
 * @param {object} element разметка/верстка
 * @param {string} place положение в начало или в конец
 */
export const renderElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      container.before(element);
      break;
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
};
