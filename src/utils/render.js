import AbstractView from '../view/abstract-view.js';

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
  const parentContainer = container instanceof AbstractView ? container.element : container;
  const childElement = element instanceof AbstractView ? element.element : element;

  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      parentContainer.before(childElement);
      break;

    case RenderPosition.AFTERBEGIN:
      parentContainer.prepend(childElement);
      break;

    case RenderPosition.BEFOREEND:
      parentContainer.append(childElement);
      break;

    case RenderPosition.AFTEREND:
      parentContainer.after(childElement);
      break;
  }
};

/**
 *
 * @param {*} newElement элемент на который будет заменён
 * @param {*} oldElement элемент который будет заменён
 */
export const replace = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;
  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newChild, oldChild);
};
